import React from "react";
import { COLORS, AMBASSADOR_ACTIVATION_BULLETS, AMBASSADOR_LIVE_COUNT } from "../data/successContent.js";
import AmbassadorBadgeVideo from "./AmbassadorBadgeVideo.jsx";
import AmbassadorChallenge24h from "./AmbassadorChallenge24h.jsx";
import AmbassadorProgress from "./AmbassadorProgress.jsx";

const C = COLORS;

// Bloc Ambassadrice complet : statut, activation, preuve sociale, défi 24h, progression.
export default function AmbassadorBlock() {
  return (
    <div style={{
      background: "linear-gradient(160deg, #FFFBF0 0%, #FFF7F3 100%)",
      borderRadius: 20,
      padding: "28px 22px",
      marginBottom: 20,
      boxShadow: "0 6px 32px rgba(212,160,23,.14)",
      border: "1.5px solid rgba(212,160,23,.28)",
    }}>
      {/* ── En-tête ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <span style={{ fontSize: 34 }}>💎</span>
        <div>
          <p style={{ fontSize: 10.5, fontWeight: 800, color: "#B8860B", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 3 }}>
            Statut débloqué
          </p>
          <p style={{ fontWeight: 700, fontSize: 16.5, color: C.dark, lineHeight: 1.2 }}>
            Statut Ambassadrice BodyCurve
          </p>
        </div>
      </div>

      {/* ── Révélation badge + textes encadrants ── */}
      <AmbassadorBadgeVideo />

      {/* ── Activation ── */}
      <div style={{ borderTop: "1px solid rgba(212,160,23,.2)", paddingTop: 20, marginBottom: 18 }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: "#B8860B", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
          ✨ Activation Ambassadrice
        </p>
        <p style={{ fontSize: 11.5, color: "#9A7200", marginBottom: 16 }}>Étape 1 sur 2</p>
        <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>
          Ton statut Ambassadrice est prêt.<br />
          Il ne te reste qu'à activer ton lien personnel pour commencer à partager BodyCurve autour de toi.
        </p>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 10 }}>
          Une fois ton lien activé, tu pourras :
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {AMBASSADOR_ACTIVATION_BULLETS.map((text, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
              <span style={{ color: "#D4A017", fontSize: 14, flexShrink: 0, marginTop: 1 }}>•</span>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>{text}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
          Chaque nouvelle participante que tu aides à rejoindre BodyCurve fait progresser ton statut.
        </p>
      </div>

      {/* ── CTA principal ── */}
      <a
        href="#ambassador-program"
        className="bc-btn"
        style={{
          display: "block", width: "100%",
          background: "linear-gradient(135deg, #D4A017 0%, #B8860B 100%)",
          color: "#fff", textAlign: "center",
          padding: "17px 24px", borderRadius: 14,
          fontWeight: 700, fontSize: 15.5,
          textDecoration: "none",
          boxShadow: "0 6px 22px rgba(212,160,23,.38)",
          marginBottom: 10,
        }}
      >
        Activer mon lien Ambassadrice →
      </a>
      {/* ── Compteur live Mouvement BodyCurve ── */}
      <div style={{
        background: "rgba(212,160,23,.07)",
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 14,
        borderLeft: "3px solid #D4A017",
      }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#B8860B", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
          🔥 Mouvement BodyCurve
        </p>
        <p style={{ fontSize: 13.5, color: "#6B6B76", lineHeight: 1.7, marginBottom: 6 }}>
          Déjà <strong style={{ color: "#0F0F12", fontSize: 15 }}>{AMBASSADOR_LIVE_COUNT}</strong> ambassadrices BodyCurve ont activé leur lien personnel.
        </p>
        <p style={{ fontSize: 13, color: "#9A7200", lineHeight: 1.65, marginBottom: 6 }}>
          Certaines trouvent leurs premières inscrites en quelques jours seulement.
        </p>
        <p style={{ fontSize: 12.5, color: "#9A7200", lineHeight: 1.6, opacity: 0.85 }}>
          Chaque nouvelle participante qui active son lien renforce le mouvement.
        </p>
      </div>

      <p style={{ fontSize: 12.5, color: "#9A7200", textAlign: "center", marginBottom: 6 }}>
        Cela prend moins de 30 secondes.
      </p>
      <p style={{ fontSize: 12.5, color: "#9A7200", textAlign: "center", fontStyle: "italic", marginBottom: 16 }}>
        Ton premier avantage peut se débloquer beaucoup plus vite que tu ne l'imagines.
      </p>

      {/* ── Preuve sociale ── */}
      <div style={{ background: "rgba(212,160,23,.06)", borderRadius: 11, padding: "12px 14px", marginBottom: 20, textAlign: "center" }}>
        <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7, opacity: 0.88 }}>
          🔥 Déjà plusieurs participantes BodyCurve ont activé leur lien Ambassadrice.<br />
          Certaines ont trouvé leurs 3 premières inscrites en moins de 48 heures.<br />
          Ton lien personnel sera prêt immédiatement après activation.
        </p>
      </div>

      {/* ── Défi Ambassadrice 24h ── */}
      <AmbassadorChallenge24h />

      {/* ── Progression Ambassadrice ── */}
      <AmbassadorProgress />
    </div>
  );
}
