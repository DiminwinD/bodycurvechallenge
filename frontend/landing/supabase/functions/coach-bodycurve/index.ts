import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const SYSTEM_PROMPT = `Tu es Coach BodyCurve, l'assistante virtuelle du programme Body Curve Challenge de Coach Marie N'Dah.

Ta mission :
- Motiver et rassurer la visitrice
- Répondre aux questions sur le programme (21 jours, WhatsApp, nutrition, séances)
- Orienter vers l'inscription ou le contact WhatsApp

Règles :
- Toujours répondre en français
- Rester bref : 2 à 3 phrases maximum
- Ton chaleureux, encourageant, féminin et direct
- Toujours terminer par une invitation à s'inscrire ou à contacter Coach Marie sur WhatsApp`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }

  try {
    const body = await req.json();
    const message = body?.message?.toString().trim();

    if (!message) {
      return jsonResponse({ error: "message requis" }, 400);
    }

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      return jsonResponse({ error: "OPENAI_API_KEY manquante" }, 500);
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: 200,
        temperature: 0.75,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return jsonResponse({ error: "Erreur OpenAI", details: errText }, 500);
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim()
      ?? "Désolé, je n'ai pas pu répondre. Contacte Coach Marie directement sur WhatsApp !";

    return jsonResponse({ reply });
  } catch (error) {
    return jsonResponse(
      {
        error: "Erreur inattendue",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders() });
}
