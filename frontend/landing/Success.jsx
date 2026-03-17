import React from "react";
import {
  ConfettiEffect,
  SuccessHero,
  BodyCurveControlCard,
  AmbassadorBlock,
  AmbassadorLeaderboard,
  ShareActions,
} from "./features/success/index.js";

export default function Success() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { background: #FFF7F3; margin: 0; }
        @keyframes bc-pop {
          0%   { transform: scale(.8); opacity: 0; }
          65%  { transform: scale(1.06); }
          100% { transform: scale(1); opacity: 1; }
        }
        .bc-emoji { animation: bc-pop .6s cubic-bezier(.34,1.56,.64,1) both; }
        .bc-btn { transition: opacity .15s, transform .15s; }
        .bc-btn:hover { opacity: .92; transform: translateY(-2px); }
        .bc-btn:active { transform: translateY(0); }
        .ambassador-badge-video { animation: badgeGlow 2s ease-out; }
        @keyframes badgeGlow {
          0%   { box-shadow: 0 0 0 rgba(212,160,23,0); transform: scale(0.95); }
          50%  { box-shadow: 0 0 40px rgba(212,160,23,0.6); transform: scale(1.05); }
          100% { box-shadow: 0 8px 32px rgba(212,160,23,.30); transform: scale(1); }
        }
      `}</style>

      <ConfettiEffect />

      <div style={{
        background: "#FFF7F3",
        minHeight: "100vh",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#0F0F12",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px 64px",
      }}>
        <div style={{ maxWidth: 440, width: "100%" }}>
          <SuccessHero />
          <BodyCurveControlCard />
          <AmbassadorBlock />
          <AmbassadorLeaderboard />
          <ShareActions />
        </div>
      </div>
    </>
  );
}
