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

// ── HTML inline fallback ───────────────────────────────────────────────────────

function buildFallbackHtml(prenom: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:0;">
  <div style="background:linear-gradient(135deg,#C19A6B,#8B6914);padding:40px 30px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:28px;">BodyCurve Challenge 🌟</h1>
    <p style="color:#ffe;margin:10px 0 0;font-size:16px;">Ta transformation commence aujourd'hui</p>
  </div>
  <div style="padding:35px 30px;">
    <h2 style="color:#333;">Bienvenue ${prenom} ! ✨</h2>
    <p style="color:#555;line-height:1.7;">Tu viens de rejoindre une communauté de femmes qui prennent soin d'elles et transforment leur corps avec méthode et bienveillance.</p>
    <p style="color:#555;line-height:1.7;"><strong>Chaque semaine, tu recevras :</strong></p>
    <ul style="color:#555;line-height:2;">
      <li>🏃‍♀️ Des conseils sport adaptés</li>
      <li>🥗 Des conseils alimentation sains et gourmands</li>
      <li>💆‍♀️ Des rituels bien-être</li>
      <li>✨ De la motivation pour tenir sur la durée</li>
    </ul>
    <div style="background:#FFF8EE;border-left:4px solid #C19A6B;padding:20px;margin:25px 0;border-radius:0 8px 8px 0;">
      <p style="margin:0;color:#8B6914;font-style:italic;font-size:16px;">"La transformation ne commence pas dans la salle de sport. Elle commence dans ta tête." 💪</p>
    </div>
    <p style="color:#555;">Prête ? <strong>Ta meilleure version t'attend.</strong></p>
  </div>
  <div style="background:#f5f5f5;padding:20px;text-align:center;">
    <p style="color:#999;font-size:12px;margin:0;">BodyCurve Challenge — Pour les femmes qui veulent plus 🌿</p>
  </div>
</body>
</html>`;
}

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
    const brevoSenderEmail       = Deno.env.get("BREVO_SENDER_EMAIL") ?? "noreply@bodycurve.fr";
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
      if (emailNorm) {
        const prenom      = firstName ?? "toi";
        const toRecipient = [{ email: emailNorm, name: prenom }];
        let emailSent     = false;
        let lastEmailError: string | null = null;

        // Tentative 1 : via template Brevo si BREVO_TEMPLATE_ID est défini
        if (brevoTemplateId) {
          const smtpPayload = {
            to:         toRecipient,
            templateId: Number(brevoTemplateId),
            params: {
              PRENOM:   firstName ?? "",
              WHATSAPP: phoneRaw  ?? "",
            },
          };
          const smtpRes = await fetch("https://api.brevo.com/v3/smtp/email", {
            method:  "POST",
            headers: { "Content-Type": "application/json", "api-key": brevoApiKey },
            body:    JSON.stringify(smtpPayload),
          });
          if (smtpRes.ok) {
            emailSent = true;
            console.log("[capture-lead] Email template envoyé à:", emailNorm);
          } else {
            lastEmailError = await smtpRes.text();
            console.error("[capture-lead] Échec template Brevo:", smtpRes.status, lastEmailError, "→ fallback HTML inline");
          }
        } else {
          console.log("[capture-lead] BREVO_TEMPLATE_ID absent → fallback HTML inline direct");
        }

        // Tentative 2 : fallback HTML inline si template absent OU si template a échoué
        if (!emailSent) {
          const smtpPayload = {
            sender:      { name: brevoSenderName, email: brevoSenderEmail },
            to:          toRecipient,
            subject:     `Bienvenue dans le BodyCurve Challenge, ${prenom} !`,
            htmlContent: buildFallbackHtml(prenom),
          };
          const smtpRes = await fetch("https://api.brevo.com/v3/smtp/email", {
            method:  "POST",
            headers: { "Content-Type": "application/json", "api-key": brevoApiKey },
            body:    JSON.stringify(smtpPayload),
          });
          if (smtpRes.ok) {
            emailSent = true;
            console.log("[capture-lead] Email HTML inline envoyé à:", emailNorm);
          } else {
            lastEmailError = await smtpRes.text();
            console.error("[capture-lead] Échec email HTML inline Brevo:", smtpRes.status, lastEmailError);
          }
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

        if (!emailSent) {
          console.error("[capture-lead] TOUS les essais d'envoi email ont échoué. Dernière erreur Brevo:", lastEmailError);
        }

      } else {
        console.log("[capture-lead] Pas d'email réel — envoi email transactionnel ignoré.");
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
