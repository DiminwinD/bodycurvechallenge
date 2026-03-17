import React, { useState } from "react";
import { COLORS } from "../data/successContent.js";
import AmbassadorStoryShare from "./AmbassadorStoryShare.jsx";

const C = COLORS;

const BADGE_STYLE = {
  display: "block",
  width: "100%",
  maxWidth: 220,
  margin: "20px auto 24px",
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(212,160,23,.30)",
};

const SHARE_TEXT =
  "Je viens de rejoindre le BodyCurve Challenge et de débloquer mon badge Ambassadrice 💎🔥\nJe lance un défi : trouver mes 3 premières amies en 24h.\nTu viens avec moi ?";
const SHARE_URL = "https://bodycurvechallenge.com";

// Partage avec Web Share API (+ fichier badge si supporté) + fallback WhatsApp.
async function handleShareBadge() {
  const payload = { title: "Badge Ambassadrice BodyCurve", text: SHARE_TEXT, url: SHARE_URL };

  // Tentative partage avec image du badge
  if (navigator.share) {
    try {
      const res  = await fetch("/ambassador-badge.png");
      const blob = await res.blob();
      const file = new File([blob], "ambassador-badge.png", { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ ...payload, files: [file] });
        return;
      }
    } catch {
      // image non disponible ou canShare false → partage sans fichier
    }

    // Partage texte seul (sans image)
    try {
      await navigator.share(payload);
      return;
    } catch {
      // annulation silencieuse par l'utilisateur
      return;
    }
  }

  // Fallback : WhatsApp avec texte prérempli
  window.open(
    `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + "\n" + SHARE_URL)}`,
    "_blank"
  );
}

// Révélation du badge Ambassadrice : titre, vidéo/fallback, textes, défi 24h + partage.
// Glow animation via .ambassador-badge-video (défini dans Success.jsx).
export default function AmbassadorBadgeVideo() {
  const [isVideoError, setIsVideoError] = useState(false);

  return (
    <>
      {/* ── Titre ── */}
      <p style={{ fontSize: 15, fontWeight: 700, color: C.dark, textAlign: "center", marginBottom: 4 }}>
        💎 Badge Ambassadrice BodyCurve
      </p>

      {/* ── Badge : vidéo ou fallback image ── */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        {isVideoError ? (
          <img
            src="/ambassador-badge.png"
            alt="Badge Ambassadrice BodyCurve"
            className="ambassador-badge-video"
            style={BADGE_STYLE}
          />
        ) : (
          <video
            src="/ambassador-badge.mp4"
            poster="/ambassador-badge.png"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setIsVideoError(true)}
            className="ambassador-badge-video"
            style={BADGE_STYLE}
          />
        )}
      </div>

      {/* ── Textes sous le badge ── */}
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 12 }}>
        Tu viens officiellement de débloquer ton{" "}
        <strong style={{ color: C.dark }}>statut Ambassadrice BodyCurve</strong>.
      </p>
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 12 }}>
        Ce badge symbolise ton entrée dans le programme Ambassadrices et ton accès à un cercle
        de participantes qui ont décidé de partager l'expérience autour d'elles.
      </p>
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 12 }}>
        Certaines participantes utilisent déjà leur lien pour inviter leurs premières amies et
        débloquer leurs premiers avantages.
      </p>
      <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, lineHeight: 1.7, marginBottom: 22 }}>
        ✨ Ton lien personnel peut être activé en quelques secondes.
      </p>

      {/* ── Mini bloc Défi 24h ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,77,109,.05) 0%, rgba(212,160,23,.07) 100%)",
        borderRadius: 14,
        padding: "18px 16px",
        marginBottom: 20,
        border: "1px solid rgba(255,77,109,.15)",
      }}>
        {/* Titre défi */}
        <p style={{
          fontSize: 11, fontWeight: 800, color: C.cta,
          letterSpacing: 0.9, textTransform: "uppercase", marginBottom: 12,
        }}>
          🔥 Défi Ambassadrice — 24 heures
        </p>

        <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.75, marginBottom: 10 }}>
          Voici le moyen le plus simple de lancer ta progression :
        </p>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, lineHeight: 1.65, marginBottom: 14 }}>
          partage ton badge BodyCurve à 3 amies dans les prochaines 24 heures.
        </p>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
          Beaucoup de participantes trouvent leur première inscrite dès leur premier partage.
        </p>

        {/* Bouton partage */}
        <button
          onClick={handleShareBadge}
          className="bc-btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            width: "100%",
            background: `linear-gradient(135deg, ${C.cta} 0%, #E8365A 100%)`,
            color: "#fff",
            padding: "16px 24px",
            borderRadius: 13,
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            boxShadow: `0 6px 20px ${C.cta}35`,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 18 }}>🚀</span>
          Partager mon badge Ambassadrice
        </button>

        {/* Bouton Story */}
        <div style={{ marginBottom: 14 }}>
          <AmbassadorStoryShare />
        </div>

        {/* Compteur statique Phase 1 */}
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: C.dark }}>0</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: C.muted }}> / 3 amies invitées</span>
        </div>

        {/* Preuve sociale */}
        <p style={{
          fontSize: 12.5, color: C.muted, lineHeight: 1.7,
          textAlign: "center", fontStyle: "italic",
        }}>
          ✨ Astuce : certaines participantes trouvent leurs{" "}
          <strong style={{ color: C.dark }}>3 premières inscrites en moins de 48 heures</strong>{" "}
          simplement en partageant leur badge avec leurs amies proches.
        </p>
      </div>
    </>
  );
}
