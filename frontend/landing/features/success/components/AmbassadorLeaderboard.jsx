import React from "react";
import {
  COLORS,
  LEADERBOARD_TOP3,
  LEADERBOARD_PERSONAL_COUNT,
  LEADERBOARD_THRESHOLD,
} from "../data/successContent.js";

const C = COLORS;

// Leaderboard Ambassadrices — Phase 1 : données statiques.
// Phase 2 : remplacer les constantes importées par useLeaderboard() :
//   const { top3, personalCount } = useLeaderboard();
export default function AmbassadorLeaderboard() {
  const top3          = LEADERBOARD_TOP3;
  const personalCount = LEADERBOARD_PERSONAL_COUNT;
  const remaining     = Math.max(0, LEADERBOARD_THRESHOLD - personalCount);

  return (
    <div style={{
      background: "linear-gradient(160deg, #FFFBF0 0%, #FFF7F3 100%)",
      borderRadius: 20,
      padding: "26px 22px",
      marginBottom: 20,
      boxShadow: "0 4px 24px rgba(212,160,23,.12)",
      border: "1.5px solid rgba(212,160,23,.22)",
    }}>

      {/* ── Titre ── */}
      <p style={{
        fontSize: 11, fontWeight: 800, color: "#B8860B",
        letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 18,
      }}>
        🏆 Ambassadrices en tête cette semaine
      </p>

      {/* ── Top 3 ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {top3.map(({ rank, name, count }, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: i === 0 ? "rgba(212,160,23,.10)" : "rgba(212,160,23,.05)",
            borderRadius: 12, padding: "11px 14px",
            border: i === 0 ? "1px solid rgba(212,160,23,.28)" : "1px solid rgba(212,160,23,.12)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{rank}</span>
              <p style={{
                fontSize: 14, fontWeight: i === 0 ? 700 : 600,
                color: i === 0 ? "#7A5C00" : C.dark,
              }}>
                {name}
              </p>
            </div>
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: i === 0 ? "#B8860B" : C.muted,
              background: i === 0 ? "rgba(212,160,23,.15)" : "transparent",
              padding: i === 0 ? "3px 10px" : "0",
              borderRadius: 8,
            }}>
              {count} inscrites
            </span>
          </div>
        ))}
      </div>

      {/* ── Phrase motivation ── */}
      <p style={{
        fontSize: 13, color: "#9A7200", fontStyle: "italic",
        lineHeight: 1.65, marginBottom: 18, textAlign: "center",
      }}>
        ✨ Certaines participantes trouvent leurs premières inscrites en quelques jours seulement.
      </p>

      {/* ── Progression personnelle ── */}
      <div style={{
        background: `rgba(255,77,109,.04)`,
        borderRadius: 13, padding: "16px 16px",
        border: `1px solid ${C.cta}18`,
        borderLeft: `3px solid ${C.cta}50`,
        marginBottom: 16,
      }}>
        <p style={{
          fontSize: 11, fontWeight: 800, color: C.cta,
          letterSpacing: 0.9, textTransform: "uppercase", marginBottom: 8,
        }}>
          Ta progression actuelle
        </p>
        <p style={{ fontSize: 22, fontWeight: 800, color: C.dark, marginBottom: 6 }}>
          {personalCount}{" "}
          <span style={{ fontSize: 14, fontWeight: 500, color: C.muted }}>
            inscrite{personalCount > 1 ? "s" : ""}
          </span>
        </p>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
          {remaining > 0
            ? <>Encore <strong style={{ color: C.dark }}>{remaining} inscrite{remaining > 1 ? "s" : ""}</strong> pour apparaître dans le classement.</>
            : <>🎉 Tu apparais déjà dans le classement. Continue sur ta lancée !</>
          }
        </p>
      </div>

      {/* ── Réassurance hebdomadaire ── */}
      <p style={{
        fontSize: 12.5, color: C.muted, lineHeight: 1.7,
        fontStyle: "italic", textAlign: "center", opacity: 0.85,
      }}>
        Le classement est réinitialisé chaque semaine, pour que chaque ambassadrice ait une nouvelle chance de se démarquer.
      </p>

    </div>
  );
}
