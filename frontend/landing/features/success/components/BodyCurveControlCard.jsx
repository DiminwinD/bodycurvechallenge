import React from "react";
import { COLORS, CONTROL_FEATURES } from "../data/successContent.js";
import { APP_LINK } from "../utils/shareHelpers.js";

const C = COLORS;

// Bloc "Bonne nouvelle" — accès BodyCurve Control activé.
export default function BodyCurveControlCard() {
  return (
    <div style={{
      background: C.card,
      borderRadius: 20,
      padding: "26px 22px",
      marginBottom: 20,
      boxShadow: "0 4px 24px rgba(255,77,109,.10)",
      border: `1.5px solid ${C.cta}22`,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        background: `linear-gradient(135deg, ${C.cta} 0%, #E8365A 100%)`,
        color: "#fff", fontSize: 10, fontWeight: 800,
        letterSpacing: 1.1, textTransform: "uppercase",
        padding: "5px 14px", borderBottomLeftRadius: 12,
      }}>
        Activé ✓
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 32 }}>📱</span>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.cta, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Bonne nouvelle</p>
          <p style={{ fontWeight: 700, fontSize: 16, color: C.dark, lineHeight: 1.2 }}>Ton accès BodyCurve Control vient d'être activé</p>
        </div>
      </div>

      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 16 }}>
        Ton inscription au BodyCurve Challenge est confirmée.<br /><br />
        Et parce qu'une bonne nouvelle n'arrive jamais seule…<br />
        Tu viens de débloquer en exclusivité l'accès à l'application <strong style={{ color: C.dark }}>BodyCurve Control</strong>.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
        {CONTROL_FEATURES.map(([icon, text], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.45 }}>{text}</p>
          </div>
        ))}
      </div>

      <a href={APP_LINK} className="bc-btn"
        style={{
          display: "block", width: "100%",
          background: `linear-gradient(135deg, ${C.cta} 0%, #E8365A 100%)`,
          color: "#fff", textAlign: "center", padding: "16px 24px",
          borderRadius: 14, fontWeight: 700, fontSize: 15,
          textDecoration: "none", boxShadow: `0 6px 20px ${C.cta}35`,
        }}
      >
        Découvrir BodyCurve Control →
      </a>
    </div>
  );
}
