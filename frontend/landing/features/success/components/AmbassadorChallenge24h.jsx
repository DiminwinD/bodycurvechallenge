import React from "react";
import { COLORS } from "../data/successContent.js";

const C = COLORS;

// Défi viral "3 amies en 24h" — extrait de AmbassadorBlock.
export default function AmbassadorChallenge24h() {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.cta}0A 0%, rgba(212,160,23,.07) 100%)`,
      borderRadius: 14,
      padding: "18px 16px",
      marginBottom: 24,
      border: `1px solid ${C.cta}20`,
    }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: C.cta, letterSpacing: 0.9, textTransform: "uppercase", marginBottom: 10 }}>
        🔥 Défi Ambassadrice 24h
      </p>
      <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.75, marginBottom: 10 }}>
        Pour lancer ta progression, commence simplement par partager ton lien BodyCurve à{" "}
        <strong style={{ color: C.dark }}>3 amies dans les prochaines 24 heures</strong>.
      </p>
      <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.75, marginBottom: 10 }}>
        C'est souvent la manière la plus rapide d'enclencher ton premier niveau Ambassadrice et de te rapprocher de tes premiers avantages.
      </p>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>
        Beaucoup de participantes trouvent leur première inscrite dès leur premier partage.
      </p>
      <a
        href="#ambassador-program"
        className="bc-btn"
        style={{
          display: "block", width: "100%",
          background: `linear-gradient(135deg, ${C.cta} 0%, #E8365A 100%)`,
          color: "#fff", textAlign: "center",
          padding: "15px 24px", borderRadius: 13,
          fontWeight: 700, fontSize: 14.5,
          textDecoration: "none",
          boxShadow: `0 5px 18px ${C.cta}30`,
          marginBottom: 8,
        }}
      >
        Je lance mon défi 24h →
      </a>
      <p style={{ fontSize: 12, color: C.muted, textAlign: "center", lineHeight: 1.6, opacity: 0.85 }}>
        Commence simplement par 3 amies proches. C'est souvent comme ça que les meilleures ambassadrices démarrent.
      </p>
    </div>
  );
}
