import { serve }        from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── CORS ──────────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age":       "86400",
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// ── Normalisation ─────────────────────────────────────────────────────────────

function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[\s\-().]/g, "").trim();
  return cleaned.length >= 6 ? cleaned : null;
}

function normalizeEmail(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().toLowerCase();
  return cleaned.includes("@") && cleaned.length >= 5 ? cleaned : null;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase() || "lead";
}

// ── Messages UX (français) ────────────────────────────────────────────────────

const UX_MESSAGES: Record<string, string> = {
  new_lead_created:               "Merci, votre demande a bien été enregistrée.",
  existing_lead_updated:          "Nous avions déjà reçu une partie de vos informations. Votre fiche a été complétée.",
  existing_lead_already_complete: "Vos informations sont déjà enregistrées. Vérifiez votre WhatsApp ou votre email pour la suite.",
  missing_identifier:             "Merci de renseigner au moins un numéro de téléphone ou une adresse email.",
  db_error:                       "Une erreur est survenue côté serveur. Veuillez réessayer.",
};

// ── Handler ───────────────────────────────────────────────────────────────────

// deno-lint-ignore no-explicit-any
serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== "POST")    return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    // ── Parse body ────────────────────────────────────────────────────────────
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return jsonResponse({ success: false, status: "invalid_payload" }, 400);
    }

    // Compatibilité champs anciens (prenom/whatsapp) ET nouveaux (first_name/phone)
    const firstName = (body.first_name ?? body.prenom   ?? "").toString().trim() || null;
    const lastName  = (body.last_name  ?? "").toString().trim() || null;
    const phoneRaw  = (body.phone      ?? body.whatsapp ?? "").toString().trim() || null;
    const emailRaw  = (body.email      ?? "").toString().trim() || null;
    const objective = (body.objective  ?? "").toString().trim() || null;
    const source    = (body.source     ?? "unknown").toString().trim();

    const phoneNorm = normalizePhone(phoneRaw);
    const emailNorm = normalizeEmail(emailRaw);

    // ── Variables d'environnement ─────────────────────────────────────────────
    const supabaseUrl            = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const brevoApiKey            = Deno.env.get("BREVO_API_KEY");
    const brevoListId            = Deno.env.get("BREVO_LIST_ID");
    const brevoTemplateId        = Deno.env.get("BREVO_TEMPLATE_ID");
    const brevoSenderEmail       = Deno.env.get("BREVO_SENDER_EMAIL");
    const brevoSenderName        = Deno.env.get("BREVO_SENDER_NAME") ?? "BodyCurve Challenge";

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("[capture-lead] Variables Supabase manquantes");
      return jsonResponse({ success: false, status: "db_error", message: UX_MESSAGES.db_error }, 500);
    }

    // ── RPC capture_lead_safe ─────────────────────────────────────────────────
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data: rpcData, error: rpcError } = await supabase.rpc("capture_lead_safe", {
      p_first_name:       firstName,
      p_last_name:        lastName,
      p_phone_raw:        phoneRaw,
      p_phone_normalized: phoneNorm,
      p_email_raw:        emailRaw,
      p_email_normalized: emailNorm,
      p_objective:        objective,
      p_source:           source,
    });

    if (rpcError) {
      console.error("[capture-lead] RPC error:", rpcError.message);
      return jsonResponse({ success: false, status: "db_error", message: UX_MESSAGES.db_error, debug: rpcError.message }, 500);
    }

    const result = rpcData as {
      success:           boolean;
      status:            string;
      lead_id:           string | null;
      should_send_email: boolean;
      should_send_pdf:   boolean;
    };

    // ── Brevo : uniquement si should_send_email = true ────────────────────────
    if (result.should_send_email && brevoApiKey) {

      // 1) Créer / mettre à jour le contact dans la liste Brevo
      const emailPourContact = emailNorm
        ?? `${slugify(firstName ?? "lead")}-${Date.now()}@noemail.local`;

      const contactPayload: Record<string, unknown> = {
        email:         emailPourContact,
        attributes: {
          PRENOM:   firstName ?? "",
          WHATSAPP: phoneRaw  ?? "",
        },
        updateEnabled: true,
      };
      if (brevoListId) contactPayload.listIds = [Number(brevoListId)];

      const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
        method:  "POST",
        headers: { "Content-Type": "application/json", "api-key": brevoApiKey },
        body:    JSON.stringify(contactPayload),
      });
      if (!contactRes.ok) {
        const err = await contactRes.text();
        console.warn("[capture-lead] Brevo contact warning:", err);
      } else {
        console.log("[capture-lead] Contact Brevo créé/mis à jour:", emailPourContact);
      }

      // 2) Envoyer l'email transactionnel — uniquement si email réel disponible
      if (emailNorm && (brevoTemplateId || brevoSenderEmail)) {
        let emailSent = false;

        const toRecipient = [{ email: emailNorm, name: firstName ?? "" }];
        let smtpPayload: Record<string, unknown>;

        if (brevoTemplateId) {
          smtpPayload = {
            to:         toRecipient,
            templateId: Number(brevoTemplateId),
            params: {
              PRENOM:   firstName ?? "",
              WHATSAPP: phoneRaw  ?? "",
            },
          };
        } else {
          smtpPayload = {
            sender:      { name: brevoSenderName, email: brevoSenderEmail },
            to:          toRecipient,
            subject:     `${firstName ?? "Bonjour"}, ton guide BodyCurve est prêt 🎁`,
            htmlContent: `
              <p>Bonjour ${firstName ?? ""},</p>
              <p>Merci pour ton inscription au <strong>BodyCurve Challenge</strong> !</p>
              <p>Tu vas recevoir ton guide ventre plat sur WhatsApp très prochainement.</p>
              <p>À très vite,<br>L'équipe BodyCurve</p>
            `,
          };
        }

        const smtpRes = await fetch("https://api.brevo.com/v3/smtp/email", {
          method:  "POST",
          headers: { "Content-Type": "application/json", "api-key": brevoApiKey },
          body:    JSON.stringify(smtpPayload),
        });

        if (smtpRes.ok) {
          emailSent = true;
          console.log("[capture-lead] Email transactionnel envoyé à:", emailNorm);
        } else {
          const smtpErr = await smtpRes.text();
          console.error("[capture-lead] Échec envoi email transactionnel:", smtpRes.status, smtpErr);
        }

        // 3) Mettre à jour email_sent dans la table leads
        if (emailSent && result.lead_id) {
          const { error: updateError } = await supabase
            .from("leads")
            .update({ email_sent: true })
            .eq("id", result.lead_id);

          if (updateError) {
            console.error("[capture-lead] Échec mise à jour email_sent:", updateError.message);
          } else {
            console.log("[capture-lead] email_sent = true pour lead:", result.lead_id);
          }
        }
      } else if (!emailNorm) {
        console.log("[capture-lead] Pas d'email réel — envoi email transactionnel ignoré.");
      } else {
        console.warn("[capture-lead] BREVO_TEMPLATE_ID et BREVO_SENDER_EMAIL manquants — envoi email ignoré.");
      }
    }

    // ── Réponse finale ────────────────────────────────────────────────────────
    return jsonResponse({
      success:           result.success,
      status:            result.status,
      message:           UX_MESSAGES[result.status] ?? "Traitement effectué.",
      lead_id:           result.lead_id,
      should_send_email: result.should_send_email,
      should_send_pdf:   result.should_send_pdf,
    }, result.success ? 200 : 422);

  } catch (error) {
    console.error("[capture-lead] Unexpected:", error);
    return jsonResponse({
      success: false,
      status:  "db_error",
      message: UX_MESSAGES.db_error,
    }, 500);
  }
});
