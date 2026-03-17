import React from "react";
import { COLORS } from "../data/successContent.js";
import { WA_LINK, APP_LINK } from "../utils/shareHelpers.js";

const C = COLORS;

// Bloc haut de page : badge, emoji, célébration, card étapes, CTA WhatsApp + App.
export default function SuccessHero() {
  return (
    <>
      {/* ── Badge ── */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <span style={{
          display: "inline-block",
          background: "#EDFAF2", color: "#1A8A44",
          fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
          padding: "6px 18px", borderRadius: 20,
          border: "1.5px solid #B6EAC8",
        }}>
          Paiement confirmé ✅
        </span>
      </div>

      {/* ── Emoji ── */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <span className="bc-emoji" style={{ fontSize: 60, display: "inline-block" }}>🎉</span>
      </div>

      {/* ── Titre ── */}
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(22px, 6vw, 30px)", fontWeight: 700,
        color: C.dark, textAlign: "center", lineHeight: 1.3, marginBottom: 22,
      }}>
        Félicitations. Ton accès BodyCurve est maintenant activé.
      </h1>

      <p style={{ fontSize: 15, color: C.muted, textAlign: "center", lineHeight: 1.8, marginBottom: 20 }}>
        Tu viens officiellement de rejoindre le BodyCurve Challenge.
      </p>

      <p style={{ fontSize: 14.5, color: C.muted, textAlign: "center", lineHeight: 1.8, marginBottom: 20, padding: "0 4px" }}>
        À partir de maintenant, tu fais partie d'un groupe de femmes qui ont décidé de reprendre le contrôle de leur corps, de leur discipline et de leur énergie.
      </p>

      <p style={{ fontSize: 15, fontWeight: 600, color: C.dark, textAlign: "center", lineHeight: 1.7, marginBottom: 6 }}>
        Ton parcours commence maintenant.
      </p>

      <p style={{ fontSize: 15, fontWeight: 600, color: C.dark, textAlign: "center", lineHeight: 1.7, marginBottom: 28 }}>
        Bienvenue dans l'univers BodyCurve.
      </p>

      {/* ── Séparateur ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <p style={{ fontSize: 13.5, color: C.muted, fontStyle: "italic", whiteSpace: "nowrap" }}>
          Et une bonne nouvelle n'arrive jamais seule…
        </p>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>

      {/* ── Card étapes ── */}
      <div style={{ background: C.card, borderRadius: 18, padding: "22px 20px", marginBottom: 28, boxShadow: "0 2px 16px rgba(0,0,0,.05)" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 18 }}>
          Pour bien commencer
        </p>
        <div style={{ display: "flex", gap: 14, paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.2 }}>1️⃣</span>
          <p style={{ fontSize: 14, color: C.dark, lineHeight: 1.55 }}>
            Rejoins le <strong style={{ color: C.dark }}>groupe WhatsApp privé</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.2 }}>2️⃣</span>
          <p style={{ fontSize: 14, color: C.dark, lineHeight: 1.55 }}>
            Active ton accès à <strong style={{ color: C.dark }}>BodyCurve Control</strong>
          </p>
        </div>
      </div>

      {/* ── Bouton WhatsApp ── */}
      <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="bc-btn"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          width: "100%", background: C.green, color: "#fff",
          padding: "18px 24px", borderRadius: 16, fontWeight: 700, fontSize: 15.5,
          textDecoration: "none", marginBottom: 12,
          boxShadow: "0 6px 24px rgba(37,211,102,.28)",
        }}
      >
        <span style={{ fontSize: 20 }}>💬</span>
        Rejoindre le groupe WhatsApp
      </a>

      {/* ── Bouton App ── */}
      <a href={APP_LINK} className="bc-btn"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          width: "100%", background: `linear-gradient(135deg, ${C.cta} 0%, #E8365A 100%)`,
          color: "#fff", padding: "18px 24px", borderRadius: 16,
          fontWeight: 700, fontSize: 15.5, textDecoration: "none",
          marginBottom: 32, boxShadow: `0 6px 24px ${C.cta}38`,
        }}
      >
        <span style={{ fontSize: 20 }}>📱</span>
        Accéder à BodyCurve Control
      </a>

      {/* ── Note équipe ── */}
      <p style={{ fontSize: 13.5, color: C.muted, textAlign: "center", lineHeight: 1.65, marginBottom: 40 }}>
        Notre équipe t'accompagne pour bien démarrer ton challenge.
      </p>
    </>
  );
}
