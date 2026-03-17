import React, { useState } from "react";
import { COLORS } from "../data/successContent.js";
import { WA_SHARE, SHARE_URL, copyToClipboard } from "../utils/shareHelpers.js";

const C = COLORS;

// Bloc partage social : WhatsApp, Instagram, copier le lien.
export default function ShareActions() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(SHARE_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{
      background: C.card, borderRadius: 20, padding: "24px 22px",
      marginBottom: 16, boxShadow: "0 2px 16px rgba(0,0,0,.05)",
      border: `1px solid ${C.border}`, textAlign: "center",
    }}>
      <span style={{ fontSize: 28, display: "block", marginBottom: 10 }}>📲</span>
      <p style={{ fontWeight: 700, fontSize: 15, color: C.dark, marginBottom: 8 }}>Partage BodyCurve autour de toi</p>
      <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65, marginBottom: 20 }}>
        Tu peux déjà commencer à partager BodyCurve avec tes amies.<br />
        Chaque femme que tu inspires peut transformer sa vie.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <a href={WA_SHARE} target="_blank" rel="noopener noreferrer" className="bc-btn"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
            background: C.green, color: "#fff", padding: "14px 20px", borderRadius: 13,
            fontWeight: 700, fontSize: 14, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(37,211,102,.25)",
          }}
        >
          <span style={{ fontSize: 18 }}>💬</span>
          Partager sur WhatsApp
        </a>
        <a href="#" className="bc-btn"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
            background: "linear-gradient(135deg, #E1306C 0%, #833AB4 100%)",
            color: "#fff", padding: "14px 20px", borderRadius: 13,
            fontWeight: 700, fontSize: 14, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(225,48,108,.22)",
          }}
        >
          <span style={{ fontSize: 18 }}>📸</span>
          Partager sur Instagram
        </a>
        <button onClick={handleCopy} className="bc-btn"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
            background: copied ? "#EDFAF2" : C.bg,
            color: copied ? "#1A8A44" : C.dark,
            padding: "14px 20px", borderRadius: 13,
            fontWeight: 700, fontSize: 14,
            border: `1.5px solid ${copied ? "#B6EAC8" : C.border}`,
            cursor: "pointer", width: "100%", transition: "all .2s",
          }}
        >
          <span style={{ fontSize: 18 }}>{copied ? "✅" : "🔗"}</span>
          {copied ? "Lien copié !" : "Copier le lien"}
        </button>
      </div>
    </div>
  );
}
