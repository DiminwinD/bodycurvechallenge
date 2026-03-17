import React from "react";
import { useAmbassadorProgressAnimation } from "../hooks/useAmbassadorProgressAnimation.js";
import { useSectionReplay } from "../hooks/useSectionReplay.js";
import { COLORS } from "../data/successContent.js";

const C = COLORS;

// Progression Ambassadrice : Niveau 1 animé + Niveau Premium statique + Mouvement + Astuce.
// L'animation se rejoue à chaque fois que le bloc entre dans le viewport.
export default function AmbassadorProgress() {
  const { counter, barWidth, showBadge, start, reset } = useAmbassadorProgressAnimation();
  const progressRef = useSectionReplay({ onEnter: start, onLeave: reset });

  return (
    <>
      {/* ── Séparateur Progression ── */}
      <div style={{ borderTop: "1px solid rgba(212,160,23,.2)", paddingTop: 20, marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: "#B8860B", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
          📈 Progression Ambassadrice
        </p>
        <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, marginBottom: 18 }}>
          Ton statut Ambassadrice évolue à mesure que des participantes rejoignent BodyCurve grâce à toi.<br />
          Chaque nouvelle inscription te rapproche du niveau suivant et de nouveaux avantages.
        </p>
      </div>

      {/* ── Niveau 1 animé ── */}
      <div
        ref={progressRef}
        style={{ background: "#FFFBF0", borderRadius: 14, padding: "18px 16px", marginBottom: 12, border: "1px solid rgba(212,160,23,.2)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#7A5C00" }}>Niveau 1 — Première Ambassadrice</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {showBadge && (
              <span style={{ fontSize: 10, fontWeight: 800, background: "#1A8A44", color: "#fff", padding: "3px 9px", borderRadius: 10, letterSpacing: 0.5 }}>
                Débloqué ✓
              </span>
            )}
            <p style={{ fontSize: 14, fontWeight: 800, color: "#B8860B" }}>
              {counter} <span style={{ fontWeight: 500, color: C.muted }}>/ 3</span>
            </p>
          </div>
        </div>
        <div style={{ background: "rgba(212,160,23,.15)", borderRadius: 8, height: 8, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${barWidth}%`, background: "linear-gradient(90deg, #D4A017, #F5C842)", borderRadius: 8, transition: "width .35s ease" }} />
        </div>
        <p style={{ fontSize: 13, color: "#9A7200", lineHeight: 1.65, marginBottom: 10 }}>
          Invite <strong>3 femmes</strong> à rejoindre BodyCurve pour débloquer ton premier niveau Ambassadrice.
        </p>
        <p style={{ fontSize: 12.5, color: "#9A7200", lineHeight: 1.6 }}>
          Une fois ce niveau atteint, tu accèdes à : des réductions réservées aux ambassadrices · des avantages privilégiés · un accès anticipé à certaines nouveautés.
        </p>
      </div>

      {/* ── Niveau Premium statique ── */}
      <div style={{ background: C.bg, borderRadius: 14, padding: "18px 16px", marginBottom: 18, border: `1px solid ${C.border}`, opacity: 0.75 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>Niveau Premium — Cercle privilégié</p>
          <p style={{ fontSize: 14, fontWeight: 800, color: C.muted }}>0 <span style={{ fontWeight: 500 }}>/ 10</span></p>
        </div>
        <div style={{ background: C.border, borderRadius: 8, height: 8, marginBottom: 12 }}>
          <div style={{ height: "100%", width: "0%", borderRadius: 8 }} />
        </div>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 10 }}>
          Les ambassadrices les plus actives peuvent débloquer un niveau supérieur avec : des avantages renforcés · des bonus exclusifs BodyCurve · un retour financier sur certaines participantes recommandées.
        </p>
      </div>

      {/* ── Mouvement BodyCurve ── */}
      <div style={{ background: "rgba(255,77,109,.04)", borderRadius: 12, padding: "14px 16px", marginBottom: 14, borderLeft: `3px solid ${C.cta}40`, textAlign: "center" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.cta, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>
          📊 Mouvement BodyCurve
        </p>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, marginBottom: 6 }}>
          Les participantes BodyCurve ont déjà invité<br />
          <strong style={{ color: C.dark }}>plus de 789 femmes</strong> à rejoindre le challenge cette semaine.
        </p>
        <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, opacity: 0.85 }}>
          Chaque nouvelle participante que tu invites fait progresser le mouvement.
        </p>
      </div>

      {/* ── Astuce ── */}
      <div style={{ background: "rgba(212,160,23,.07)", borderRadius: 12, padding: "14px 16px", borderLeft: "3px solid #D4A017" }}>
        <p style={{ fontSize: 12.5, fontWeight: 700, color: "#7A5C00", marginBottom: 7 }}>✨ Astuce Ambassadrice</p>
        <p style={{ fontSize: 13, color: "#9A7200", lineHeight: 1.7 }}>
          Beaucoup de participantes commencent simplement par partager BodyCurve à une amie ou dans leur cercle proche.<br />
          Certaines débloquent leur premier niveau en quelques jours seulement.
        </p>
      </div>
    </>
  );
}
