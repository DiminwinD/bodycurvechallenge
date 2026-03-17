import React from "react";
// Helpers canvas — fallback pour navigateurs sans ctx.roundRect (Chrome <99, Firefox <112)
function rrPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h,     x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y,         x + r, y);
  ctx.closePath();
}
function fillRoundRect(ctx, x, y, w, h, r)   { rrPath(ctx, x, y, w, h, r); ctx.fill();   }
function strokeRoundRect(ctx, x, y, w, h, r) { rrPath(ctx, x, y, w, h, r); ctx.stroke(); }

// Génère une image Story 1080×1920 avec le badge Ambassadrice
// et la partage via Web Share API (mobile) ou téléchargement (desktop).
export default function AmbassadorStoryShare() {
  const shareStory = async () => {
    const canvas  = document.createElement("canvas");
    const ctx     = canvas.getContext("2d");
    canvas.width  = 1080;
    canvas.height = 1920;

    // Fond premium
    ctx.fillStyle = "#f7efe8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = "/ambassador-badge.png";

    img.onload = async () => {
      // ── Fond dégradé vertical premium ──
      const grad = ctx.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0,   "#f8efe7");
      grad.addColorStop(0.5, "#f3d8d8");
      grad.addColorStop(1,   "#e9c7b8");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // ── Halo doré derrière le badge ──
      const halo1 = ctx.createRadialGradient(540, 680, 0, 540, 680, 280);
      halo1.addColorStop(0, "rgba(255,215,160,0.55)");
      halo1.addColorStop(1, "rgba(255,215,160,0)");
      ctx.fillStyle = halo1;
      ctx.fillRect(0, 0, 1080, 1920);

      // ── Halo rosé secondaire ──
      const halo2 = ctx.createRadialGradient(540, 720, 0, 540, 720, 320);
      halo2.addColorStop(0, "rgba(255,190,210,0.28)");
      halo2.addColorStop(1, "rgba(255,190,210,0)");
      ctx.fillStyle = halo2;
      ctx.fillRect(0, 0, 1080, 1920);

      // ── Badge centré (par-dessus les halos) ──
      ctx.drawImage(img, 290, 430, 500, 500);

      ctx.textAlign = "center";

      // ── Ligne 1 — intro ──
      ctx.fillStyle = "#3a2a2a";
      ctx.font      = "600 52px Arial";
      ctx.fillText("Je fais partie des", 540, 220);

      // ── Lignes 2 & 3 — identitaire sur deux lignes ──
      ctx.fillStyle = "#7a3f52";
      ctx.font      = "800 72px Arial";
      ctx.fillText("Ambassadrices", 540, 300);
      ctx.fillText("💎 BodyCurve 💎", 540, 380);

      // ── Ligne 3 — défi ──
      ctx.fillStyle = "#a97816";
      ctx.font      = "700 44px Arial";
      ctx.fillText("Défi perso : inviter 3 amies en 24h 🔥", 540, 1080);

      // ── Ligne 4 — sociale / invitation ──
      ctx.fillStyle = "#2f1f1f";
      ctx.font      = "700 58px Arial";
      ctx.fillText("Qui vient avec moi ?", 540, 1180);

      // ── Signature ──
      ctx.fillStyle = "rgba(58,42,42,0.78)";
      ctx.font      = "600 34px Arial";
      ctx.fillText("BodyCurve Challenge", 540, 1710);

      // ── Baseline ──
      ctx.fillStyle = "rgba(58,42,42,0.58)";
      ctx.font      = "400 28px Arial";
      ctx.fillText("Deviens celle que tu rêves d'être", 540, 1765);

      // ── Sticker glass badge ──

      // Couche 1 — ombre portée douce
      ctx.shadowColor   = "rgba(122,63,82,0.12)";
      ctx.shadowBlur    = 18;
      ctx.shadowOffsetY = 6;

      // Couche 2 — fond glass translucide
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      if (ctx.roundRect) {
        ctx.beginPath(); ctx.roundRect(340, 1320, 400, 96, 32); ctx.fill();
      } else {
        fillRoundRect(ctx, 340, 1320, 400, 96, 32);
      }

      // Reset shadow avant contour et reflet
      ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      // Couche 3 — contour verre subtil
      ctx.strokeStyle = "rgba(255,255,255,0.38)";
      ctx.lineWidth   = 2;
      if (ctx.roundRect) {
        ctx.beginPath(); ctx.roundRect(340, 1320, 400, 96, 32); ctx.stroke();
      } else {
        strokeRoundRect(ctx, 340, 1320, 400, 96, 32);
      }

      // Couche 4 — reflet lumineux haut
      ctx.fillStyle = "rgba(255,255,255,0.20)";
      if (ctx.roundRect) {
        ctx.beginPath(); ctx.roundRect(360, 1330, 360, 26, 18); ctx.fill();
      } else {
        fillRoundRect(ctx, 360, 1330, 360, 26, 18);
      }

      // Texte centré inchangé
      ctx.fillStyle = "#7a3f52";
      ctx.font      = "700 42px Arial";
      ctx.textAlign = "center";
      ctx.fillText("0 / 3 amies invitées", 540, 1383);

      canvas.toBlob(async (blob) => {
        const file = new File([blob], "bodycurve-story.png", { type: "image/png" });

        // Partage natif si supporté (iOS Safari, Chrome Android)
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: "BodyCurve Story" });
        } else {
          // Fallback : téléchargement direct
          const a    = document.createElement("a");
          a.href     = URL.createObjectURL(blob);
          a.download = "bodycurve-story.png";
          a.click();
        }
      });
    };

    // Si l'image est absente → partage texte seul
    img.onerror = async () => {
      ctx.fillStyle = "#1f1a17";
      ctx.font      = "bold 64px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Badge Ambassadrice BodyCurve 💎", 540, 960);
      canvas.toBlob(async (blob) => {
        const file = new File([blob], "bodycurve-story.png", { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: "BodyCurve Story" });
        } else {
          const a    = document.createElement("a");
          a.href     = URL.createObjectURL(blob);
          a.download = "bodycurve-story.png";
          a.click();
        }
      });
    };
  };

  return (
    <button
      onClick={shareStory}
      className="bc-btn"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        width: "100%",
        background: "linear-gradient(135deg, #D4A017 0%, #B8860B 100%)",
        color: "#fff",
        padding: "15px 24px",
        borderRadius: 13,
        fontWeight: 700,
        fontSize: 14.5,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 5px 18px rgba(212,160,23,.35)",
      }}
    >
      <span style={{ fontSize: 18 }}>📸</span>
      Publier ma Story Ambassadrice
    </button>
  );
}
