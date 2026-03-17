import React, { useRef, useEffect, useState } from "react";

const BASE_PAYMENT_LINK = "https://pzptvmid.mychariow.shop/prd_iuoyld";

function buildPaymentLink() {
  try {
    const raw = sessionStorage.getItem("bc_lead");
    if (!raw) return BASE_PAYMENT_LINK;
    const { firstname, phone, email } = JSON.parse(raw);
    const params = new URLSearchParams();
    if (firstname) params.set("firstname", firstname);
    if (phone)     params.set("phone",     phone);
    if (email)     params.set("email",     email);
    const qs = params.toString();
    return qs ? `${BASE_PAYMENT_LINK}?${qs}` : BASE_PAYMENT_LINK;
  } catch {
    return BASE_PAYMENT_LINK;
  }
}
const WA_LINK =
  "https://wa.me/2250799576214?text=Bonjour%20!%20J%27ai%20un%20souci%20pour%20payer%20ma%20place%20au%20BodyCurve%20Challenge.%20Pouvez-vous%20m%27aider%20%3F";

const C = {
  bg: "#FFF7F3",
  cta: "#FF4D6D",
  dark: "#0F0F12",
  muted: "#6B6B76",
  card: "#FFFFFF",
  border: "rgba(18,18,23,0.08)",
};

const PROGRAMME = [
  {
    icon: "🎯",
    title: "Séances guidées",
    desc: "Exercices adaptés à ton niveau, chaque jour pendant 21 jours.",
  },
  {
    icon: "👤",
    title: "Accompagnement coach",
    desc: "Suivi personnalisé par une coach dédiée tout au long du programme.",
  },
  {
    icon: "👭",
    title: "Dynamique de groupe",
    desc: "Un groupe actif de femmes qui avancent ensemble.",
  },
  {
    icon: "📅",
    title: "21 jours de suivi",
    desc: "Structure, régularité et progression pour aller jusqu'au bout.",
  },
];

const BONUS_FEATURES = [
  ["🥗", "Suivre tes calories"],
  ["📈", "Suivre ton évolution"],
  ["📸", "Prendre tes photos de progression"],
  ["🎯", "Rester disciplinée pendant 21 jours"],
];

export default function Reservation() {
  const ctaRef = useRef(null);
  const [paymentLink, setPaymentLink] = useState(BASE_PAYMENT_LINK);

  useEffect(() => { setPaymentLink(buildPaymentLink()); }, []);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el || !window.IntersectionObserver) return;
    const obs = new IntersectionObserver(
      ([entry]) => el.classList.toggle("bc-cta-live", entry.isIntersecting),
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { background: ${C.bg}; margin: 0; }
        @keyframes bc-breathe {
          0%   { box-shadow: 0 8px 28px rgba(255,77,109,.38), 0 0 0 0 rgba(255,77,109,.12); transform: scale(1); }
          50%  { box-shadow: 0 14px 44px rgba(255,77,109,.52), 0 0 0 10px rgba(255,77,109,.07); transform: scale(1.016); }
          100% { box-shadow: 0 8px 28px rgba(255,77,109,.38), 0 0 0 0 rgba(255,77,109,0); transform: scale(1); }
        }
        .bc-cta {
          animation: bc-breathe 3s ease-in-out infinite;
          animation-play-state: paused;
          transition: opacity .18s;
          will-change: transform, box-shadow;
        }
        .bc-cta-live { animation-play-state: running; }
        .bc-cta:hover { opacity: .91; animation-play-state: paused !important; }
        .bc-cta:active { transform: scale(.985) !important; }
      `}</style>

      <div
        style={{
          background: C.bg,
          minHeight: "100vh",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          color: C.dark,
        }}
      >
        {/* ── Header ── */}
        <header
          style={{
            background: C.card,
            borderBottom: `1px solid ${C.border}`,
            padding: "15px 20px",
            textAlign: "center",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 1px 8px rgba(0,0,0,.05)",
          }}
        >
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: C.cta,
              letterSpacing: 0.4,
              margin: 0,
            }}
          >
            BodyCurve Challenge
          </p>
        </header>

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 72px" }}>

          {/* ── SECTION 1 — TITRE ── */}
          <section style={{ paddingTop: 40, paddingBottom: 32, textAlign: "center" }}>
            <span
              style={{
                display: "inline-block",
                background: `${C.cta}18`,
                color: C.cta,
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: 1,
                padding: "5px 16px",
                borderRadius: 20,
                marginBottom: 22,
                textTransform: "uppercase",
              }}
            >
              Offre Early Bird — Limitée
            </span>

            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(24px, 6.5vw, 32px)",
                fontWeight: 700,
                color: C.dark,
                lineHeight: 1.25,
                marginBottom: 16,
              }}
            >
              Réserve ta place pour le BodyCurve Challenge
            </h1>

            <p
              style={{
                fontSize: 15.5,
                lineHeight: 1.65,
                color: C.muted,
                margin: 0,
              }}
            >
              21 jours pour reprendre le contrôle de ton corps avec accompagnement.
            </p>
          </section>

          {/* ── SECTION 2 — PROGRAMME ── */}
          <section
            style={{
              background: C.card,
              borderRadius: 18,
              padding: "22px 20px",
              marginBottom: 16,
              boxShadow: "0 2px 16px rgba(0,0,0,.05)",
            }}
          >
            <p
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: C.muted,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Ce que tu reçois
            </p>

            {PROGRAMME.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  paddingBottom: i < PROGRAMME.length - 1 ? 16 : 0,
                  marginBottom: i < PROGRAMME.length - 1 ? 16 : 0,
                  borderBottom:
                    i < PROGRAMME.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${C.cta}12`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: C.dark,
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </p>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.55 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* ── SECTION 3 — PRIX ── */}
          <section
            style={{
              background: C.card,
              borderRadius: 18,
              padding: "22px 20px",
              marginBottom: 16,
              boxShadow: "0 2px 16px rgba(0,0,0,.05)",
              border: `1.5px solid ${C.cta}28`,
            }}
          >
            <p
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: C.muted,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Prix de l'offre
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>
                  Prix normal
                </p>
                <p
                  style={{
                    fontSize: 19,
                    color: C.muted,
                    textDecoration: "line-through",
                    fontWeight: 600,
                  }}
                >
                  125 000 FCFA
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: 11.5,
                    color: C.cta,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    marginBottom: 4,
                  }}
                >
                  Aujourd'hui
                </p>
                <p
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: C.dark,
                    lineHeight: 1,
                    letterSpacing: -0.5,
                  }}
                >
                  25 000{" "}
                  <span style={{ fontSize: 15, fontWeight: 600 }}>FCFA</span>
                </p>
              </div>
            </div>

            <div
              style={{
                background: C.bg,
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              <span style={{ color: C.cta, fontSize: 16, lineHeight: 1 }}>✓</span>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: C.dark }}>
                Paiement unique — pas de frais cachés.
              </p>
            </div>
          </section>

          {/* ── SECTION 4 — PREUVE SOCIALE ── */}
          <section
            style={{
              background: `linear-gradient(135deg, ${C.cta} 0%, #E8365A 100%)`,
              borderRadius: 18,
              padding: "26px 20px",
              marginBottom: 16,
              textAlign: "center",
              boxShadow: `0 6px 24px ${C.cta}35`,
            }}
          >
            <p
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 6,
                lineHeight: 1,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              +312
            </p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.9)", lineHeight: 1.5 }}>
              femmes ont déjà participé au BodyCurve Challenge.
            </p>
          </section>

          {/* ── SECTION 5 — RARETÉ ── */}
          <section
            style={{
              background: "#FFF8ED",
              border: "1.5px solid #F5A623",
              borderRadius: 14,
              padding: "18px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 26, flexShrink: 0 }}>⏳</span>
            <div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#9A5800",
                  marginBottom: 5,
                }}
              >
                Session limitée à 220 participantes
              </p>
              <p style={{ fontSize: 13, color: "#9A5800", lineHeight: 1.5 }}>
                Il reste actuellement{" "}
                <strong style={{ color: "#9A5800" }}>42 places</strong>{" "}
                disponibles.
              </p>
            </div>
          </section>

          {/* ── SECTION 6 — BONUS ── */}
          <section
            style={{
              background: C.card,
              borderRadius: 18,
              padding: "22px 20px",
              marginBottom: 20,
              boxShadow: "0 2px 16px rgba(0,0,0,.05)",
              border: `1.5px solid ${C.cta}30`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: `linear-gradient(135deg, ${C.cta} 0%, #E8365A 100%)`,
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                padding: "5px 14px",
                borderBottomLeftRadius: 12,
              }}
            >
              Offert
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 26 }}>📱</span>
              <div>
                <p
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: C.cta,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 3,
                  }}
                >
                  Bonus exclusif
                </p>
                <p style={{ fontWeight: 700, fontSize: 15, color: C.dark, lineHeight: 1.2 }}>
                  Application BodyCurve Control
                </p>
              </div>
            </div>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: C.muted,
                marginBottom: 14,
                whiteSpace: "pre-line",
              }}
            >
              {`Pendant le BodyCurve Challenge, les participantes utilisent l'application BodyCurve Control pour suivre leurs calories et leur progression.\n\nCet outil est normalement réservé au coaching privé.\n\nMais pour cette session, nous le débloquons exceptionnellement pour toutes les participantes.`}
            </p>

            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.dark,
                marginBottom: 10,
              }}
            >
              Tu pourras :
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 16 }}>
              {BONUS_FEATURES.map(([icon, text], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
                  <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.45 }}>{text}</p>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: C.cta,
                marginBottom: 14,
              }}
            >
              Accès débloqué immédiatement après ton inscription.
            </p>

            <div
              style={{
                background: `${C.cta}0F`,
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>
                Valeur :{" "}
                <span style={{ textDecoration: "line-through" }}>57 000 FCFA</span>
              </p>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: C.cta }}>
                Offert avec ton inscription aujourd'hui.
              </p>
            </div>
          </section>

          {/* ── SECTION 7 — NOTRE ENGAGEMENT ── */}
          <section
            style={{
              background: C.card,
              borderRadius: 18,
              padding: "22px 20px",
              marginBottom: 24,
              boxShadow: "0 2px 16px rgba(0,0,0,.05)",
              borderLeft: "4px solid #25D366",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 22 }}>🤝</span>
              <p style={{ fontWeight: 700, fontSize: 15, color: C.dark }}>
                Notre engagement
              </p>
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: C.muted,
                whiteSpace: "pre-line",
              }}
            >
              {`Tu peux rejoindre le challenge sans pression et avancer à ton rythme vers tes objectifs.\n\nNotre équipe reste disponible pour t'accompagner et répondre à tes questions pendant toute la durée du programme.`}
            </p>
          </section>

          {/* ── MICRO-RÉASSURANCE ── */}
          <p
            style={{
              fontSize: 13,
              color: C.muted,
              textAlign: "center",
              lineHeight: 1.65,
              marginBottom: 16,
              padding: "0 8px",
            }}
          >
            Ta place est validée immédiatement après paiement.<br />
            Accès instantané au BodyCurve Challenge et à l'application BodyCurve Control.
          </p>

          {/* ── SECTION 8 — PAIEMENT ── */}
          <section>
            <a
              ref={ctaRef}
              href={paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bc-cta"
              style={{
                display: "block",
                width: "100%",
                background: `linear-gradient(135deg, ${C.cta} 0%, #E8365A 100%)`,
                color: "#fff",
                textAlign: "center",
                padding: "19px 24px",
                borderRadius: 16,
                fontWeight: 700,
                fontSize: 16,
                textDecoration: "none",
                lineHeight: 1.35,
                marginBottom: 20,
                letterSpacing: 0.2,
              }}
            >
              Je valide ma place maintenant
            </a>

            {/* Réassurance paiement */}
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 14 }}>🔒</span>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>
                  Paiement sécurisé via Chariow
                </p>
              </div>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>
                Orange Money · MTN Mobile Money · Wave · Carte bancaire
              </p>
              <p style={{ fontSize: 12, color: C.muted, opacity: 0.75 }}>
                Selon disponibilité dans votre pays.
              </p>
            </div>

            {/* Fallback WhatsApp */}
            <p
              style={{
                fontSize: 12.5,
                color: C.muted,
                textAlign: "center",
                lineHeight: 1.6,
                opacity: 0.85,
              }}
            >
              Un souci pour payer ?{" "}
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#25D366",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Parle-nous directement sur WhatsApp.
              </a>
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
