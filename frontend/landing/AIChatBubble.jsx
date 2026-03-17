import React from "react";
import { useState, useRef, useEffect } from "react";

const WA_NUMBER = "2250799576214";

const C = {
  cta: "#FF4D6D",
  ctaHover: "#E63B5E",
  dark: "#0F0F12",
  muted: "#6B6B76",
  card: "#FFFFFF",
  peach: "#FFB3A7",
  border: "rgba(18,18,23,0.08)",
};

const PROFILES = [
  {
    id: 1,
    choice: "Je ne me reconnais plus dans mon corps",
    responses: [
      "Ce que tu ressens, c'est réel — et ce n'est pas une question de volonté.\nBeaucoup de femmes arrivent ici avec exactement cette sensation : voir son reflet et ne plus se reconnaître.",
      "BodyCurve a été pensé pour redonner un cadre doux mais concret, sans te faire culpabiliser.\nTu veux qu'on t'explique comment ça fonctionne ?",
    ],
    testimony: {
      text: "Je ne me reconnaissais plus du tout.\nLe challenge m'a aidée à me remettre en mouvement sans pression.",
      time: "18:24",
      signature: "— M., Abidjan",
      image: "/wa-emotion.jpeg",
    },
    cta: "Je veux retrouver confiance et être accompagnée",
    waMessage:
      "Bonjour,\nje viens du site BodyCurve.\n\nMon besoin principal est de retrouver confiance en moi, car je ne me reconnais plus dans mon corps.\nJ'aimerais savoir comment le challenge peut m'aider à reprendre le contrôle sans me décourager.\n\nPouvez-vous m'expliquer ?",
  },
  {
    id: 2,
    choice: "Je veux perdre vite et voir un vrai changement",
    responses: [
      "Je comprends l'envie d'aller vite — tu en as assez d'attendre.\nLa plupart des femmes qui rejoignent BodyCurve ont ce même besoin : voir quelque chose de réel, rapidement.",
      "Le programme est court (21 jours), intensif mais guidé, avec une progression pensée pour un résultat visible.\nTu veux voir concrètement ce que ça donne ?",
    ],
    testimony: {
      text: "J'avais besoin de voir un vrai changement pour ne pas abandonner.\nLe déclic est venu beaucoup plus vite que je pensais.",
      time: "07:51",
      signature: "— A., Cocody",
      image: "/wa-urgence.jpeg",
    },
    cta: "Je veux voir rapidement si le challenge est pour moi",
    waMessage:
      "Bonjour,\nje viens du site BodyCurve.\n\nMon objectif principal est de perdre vite et de voir un vrai changement visible.\nJ'aimerais savoir si le challenge est adapté à ce type de besoin et comment il fonctionne concrètement.\n\nPouvez-vous m'en dire plus ?",
  },
  {
    id: 3,
    choice: "J'ai peur que ça ne marche pas pour moi",
    responses: [
      "Ce doute est sain — et il est partagé par beaucoup de femmes qui ont déjà essayé sans résultat.\nLe problème vient rarement du manque de motivation : c'est souvent une méthode mal adaptée à ta réalité.",
      "BodyCurve combine cadre, rythme et suivi pour que tu ne lâches pas avant de voir le changement.\nTu veux qu'on te montre en quoi c'est différent de ce que tu as déjà fait ?",
    ],
    testimony: {
      text: "J'avais déjà essayé plusieurs fois avant.\nCette fois, j'ai enfin senti que je n'étais pas seule.",
      time: "21:08",
      signature: "— S., Yopougon",
      image: "/wa-sceptique.jpeg",
    },
    cta: "Je veux comprendre pourquoi BodyCurve peut marcher pour moi",
    waMessage:
      "Bonjour,\nje viens du site BodyCurve.\n\nJ'ai déjà essayé plusieurs choses et j'ai peur que ça ne marche pas encore pour moi.\nJ'aimerais comprendre ce qui rend BodyCurve différent et pourquoi ce programme pourrait mieux me convenir.\n\nPouvez-vous m'expliquer ?",
  },
  {
    id: 4,
    choice: "Seule, je vais abandonner",
    responses: [
      "Ce que tu décris, c'est exactement ce que vivent la plupart des femmes seules face à un objectif.\nSans cadre ni dynamique de groupe, même les plus motivées finissent par lâcher.",
      "BodyCurve t'intègre dans un groupe actif avec suivi quotidien — tu ne portes plus ça seule.\nTu veux qu'on t'explique comment fonctionne le suivi ?",
    ],
    testimony: {
      text: "Seule, j'aurais encore arrêté.\nLe suivi et la dynamique m'ont aidée à rester régulière.",
      time: "19:42",
      signature: "— R., Marcory",
      image: "/wa-encadrement.jpeg",
    },
    cta: "Je veux un cadre pour ne plus abandonner",
    waMessage:
      "Bonjour,\nje viens du site BodyCurve.\n\nMon problème principal est que seule, j'ai du mal à tenir sur la durée.\nJ'aimerais savoir comment le challenge m'aide à rester régulière et accompagnée.\n\nPouvez-vous m'expliquer ?",
  },
];

const OPENING_MSG =
  "Salut 👋\nJe suis Coach Marie.\n\nJ'aide les femmes à reprendre le contrôle de leur corps avec un cadre clair, motivant et réaliste.\n\nDis-moi ce qui te bloque le plus aujourd'hui :";

export default function AIChatBubble() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [typing, setTyping] = useState(false);
  const [responding, setResponding] = useState(false);
  const [respondingChoice, setRespondingChoice] = useState(null);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifOut, setNotifOut] = useState(false);
  const typingShownRef = useRef(false);
  const notifShownRef = useRef(false);
  const bottomRef = useRef(null);

  // Typing animation on first open
  useEffect(() => {
    if (open && !typingShownRef.current) {
      typingShownRef.current = true;
      setTyping(true);
      const t = setTimeout(() => setTyping(false), 1300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [profile, open, typing, responding]);

  // ── Behavioral triggers ──────────────────────────────────
  useEffect(() => {
    let triggered = false;

    const openOnce = () => {
      if (triggered) return;
      triggered = true;
      setOpen(true);
    };

    // 1. Scroll 50%
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total >= 0.5) openOnce();
    };

    // 2. Inactivité 7s
    let inactivityTimer = setTimeout(openOnce, 7000);
    const resetInactivity = () => {
      if (triggered) return;
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(openOnce, 7000);
    };

    // 3. Exit intent
    const onMouseMove = (e) => {
      resetInactivity();
      if (e.clientY < 20) openOnce();
    };

    const onActivity = () => resetInactivity();

    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onActivity);
    window.addEventListener("click", onActivity);
    window.addEventListener("touchstart", onActivity);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("click", onActivity);
      window.removeEventListener("touchstart", onActivity);
    };
  }, []);

  // Délai d'apparition du screenshot après la réponse du coach
  useEffect(() => {
    if (!profile) {
      setShowScreenshot(false);
      return;
    }
    const delay = 700 + Math.random() * 300;
    const t = setTimeout(() => setShowScreenshot(true), delay);
    return () => clearTimeout(t);
  }, [profile]);

  // Notification sociale simulée — une seule fois par session
  useEffect(() => {
    if (!showScreenshot || notifShownRef.current) return;
    notifShownRef.current = true;
    const t = setTimeout(() => setShowNotif(true), 1500);
    return () => clearTimeout(t);
  }, [showScreenshot]);

  useEffect(() => {
    if (!showNotif) return;
    const tOut = setTimeout(() => setNotifOut(true), 4000);
    const tRemove = setTimeout(() => setShowNotif(false), 4450);
    return () => { clearTimeout(tOut); clearTimeout(tRemove); };
  }, [showNotif]);

  const selectedProfile = PROFILES.find((p) => p.id === profile);

  const handleWA = (p) => {
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(p.waMessage)}`,
      "_blank"
    );
  };

  const handleChoice = (p) => {
    setRespondingChoice(p);
    setResponding(true);
    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      setProfile(p.id);
      setResponding(false);
    }, delay);
  };

  const handleJoin = () => {
    setOpen(false);
    document.getElementById("earlybird")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @keyframes bc-typing {
          0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
        .bc-dot { display: inline-block; animation: bc-typing 1.1s infinite; }
        .bc-dot:nth-child(2) { animation-delay: 0.18s; }
        .bc-dot:nth-child(3) { animation-delay: 0.36s; }
        .bc-choice:hover {
          border-color: #FF4D6D !important;
          background: rgba(255,77,109,0.06) !important;
        }
        @keyframes bc-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bc-screenshot { animation: bc-fadein 0.4s ease forwards; }
        @keyframes bc-notif-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bc-notif-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(6px); }
        }
        .bc-notif-enter { animation: bc-notif-in 0.3s ease forwards; }
        .bc-notif-exit { animation: bc-notif-out 0.4s ease forwards; }
      `}</style>

      {/* ── Fenêtre chat ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 152,
            right: 16,
            zIndex: 1000,
            width: "min(340px, calc(100vw - 32px))",
            maxHeight: "calc(100vh - 220px)",
            background: "#FAFAFA",
            borderRadius: 24,
            boxShadow: "0 12px 48px rgba(0,0,0,.16), 0 2px 8px rgba(0,0,0,.06)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "slideUp .3s cubic-bezier(.22,.68,0,1.2)",
            fontFamily: "'Inter', -apple-system, sans-serif",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              background: `linear-gradient(135deg, ${C.cta} 0%, #E8365A 100%)`,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                border: "2.5px solid rgba(255,255,255,0.85)",
                boxShadow: "0 2px 10px rgba(0,0,0,.2)",
              }}
            >
              <img
                src="/coach-marie.png"
                alt="Coach Marie"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>

            {/* Texte */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0, lineHeight: 1.2 }}>
                Coach Marie
              </p>
              <p style={{ color: "rgba(255,255,255,.82)", fontSize: 11.5, margin: "3px 0 0", lineHeight: 1 }}>
                🟢 En ligne · répond en quelques secondes
              </p>
            </div>

            {/* Fermer */}
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,.15)",
                border: "none",
                color: "#fff",
                fontSize: 18,
                cursor: "pointer",
                lineHeight: 1,
                padding: 0,
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>

          {/* ── Body ── */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 14px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background: "#F5F5F7",
            }}
          >
            {/* Typing indicator */}
            {typing ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img
                  src="/coach-marie.png"
                  alt=""
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    border: "1.5px solid rgba(255,77,109,0.25)",
                  }}
                />
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "16px 16px 16px 4px",
                    padding: "10px 16px",
                    fontSize: 13,
                    color: C.muted,
                    boxShadow: "0 1px 4px rgba(0,0,0,.07)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 12 }}>Coach Marie est en train d'écrire</span>
                  <span style={{ fontSize: 16, letterSpacing: 1, lineHeight: 1 }}>
                    <span className="bc-dot">•</span>
                    <span className="bc-dot">•</span>
                    <span className="bc-dot">•</span>
                  </span>
                </div>
              </div>
            ) : (
              <>
                {/* Message d'ouverture */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <img
                    src="/coach-marie.png"
                    alt=""
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                      border: "1.5px solid rgba(255,77,109,0.25)",
                      marginTop: 2,
                    }}
                  />
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "16px 16px 16px 4px",
                      padding: "12px 14px",
                      fontSize: 13,
                      lineHeight: 1.65,
                      color: C.dark,
                      whiteSpace: "pre-line",
                      boxShadow: "0 1px 4px rgba(0,0,0,.07)",
                      maxWidth: "88%",
                    }}
                  >
                    {OPENING_MSG}
                  </div>
                </div>

                {/* Choix / responding / réponse */}
                {!profile && !responding ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4, paddingLeft: 38 }}>
                    {PROFILES.map((p) => (
                      <button
                        key={p.id}
                        className="bc-choice"
                        onClick={() => handleChoice(p)}
                        style={{
                          background: "#fff",
                          border: `1.5px solid rgba(255,77,109,0.3)`,
                          borderRadius: 12,
                          padding: "10px 14px",
                          fontSize: 13,
                          color: C.dark,
                          cursor: "pointer",
                          textAlign: "left",
                          lineHeight: 1.45,
                          transition: "all .15s",
                          fontFamily: "inherit",
                          width: "100%",
                          boxShadow: "0 1px 3px rgba(0,0,0,.05)",
                        }}
                      >
                        {p.choice}
                      </button>
                    ))}
                  </div>
                ) : responding ? (
                  <>
                    {/* Echo pendant le délai */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div
                        style={{
                          background: `linear-gradient(135deg, ${C.cta}, ${C.ctaHover})`,
                          color: "#fff",
                          borderRadius: "16px 16px 4px 16px",
                          padding: "10px 14px",
                          fontSize: 13,
                          lineHeight: 1.5,
                          maxWidth: "80%",
                          boxShadow: `0 2px 10px ${C.cta}33`,
                        }}
                      >
                        {respondingChoice?.choice}
                      </div>
                    </div>
                    {/* Typing indicator */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src="/coach-marie.png"
                        alt=""
                        style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1.5px solid rgba(255,77,109,0.25)" }}
                      />
                      <div
                        style={{
                          background: "#fff",
                          borderRadius: "16px 16px 16px 4px",
                          padding: "10px 16px",
                          fontSize: 13,
                          color: C.muted,
                          boxShadow: "0 1px 4px rgba(0,0,0,.07)",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span style={{ fontSize: 12 }}>Coach Marie est en train d'écrire</span>
                        <span style={{ fontSize: 16, letterSpacing: 1, lineHeight: 1 }}>
                          <span className="bc-dot">•</span>
                          <span className="bc-dot">•</span>
                          <span className="bc-dot">•</span>
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Echo du choix */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div
                        style={{
                          background: `linear-gradient(135deg, ${C.cta}, ${C.ctaHover})`,
                          color: "#fff",
                          borderRadius: "16px 16px 4px 16px",
                          padding: "10px 14px",
                          fontSize: 13,
                          lineHeight: 1.5,
                          maxWidth: "80%",
                          boxShadow: `0 2px 10px ${C.cta}33`,
                        }}
                      >
                        {selectedProfile.choice}
                      </div>
                    </div>

                    {/* Réponses Coach */}
                    {selectedProfile.responses.map((text, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        {i === 0 && (
                          <img
                            src="/coach-marie.png"
                            alt=""
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              objectFit: "cover",
                              flexShrink: 0,
                              border: "1.5px solid rgba(255,77,109,0.25)",
                              marginTop: 2,
                            }}
                          />
                        )}
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: i === 0 ? "16px 16px 16px 4px" : "16px",
                            padding: "12px 14px",
                            fontSize: 13,
                            lineHeight: 1.65,
                            color: C.dark,
                            whiteSpace: "pre-line",
                            boxShadow: "0 1px 4px rgba(0,0,0,.07)",
                            maxWidth: "88%",
                            marginLeft: i === 0 ? 0 : 38,
                          }}
                        >
                          {text}
                        </div>
                      </div>
                    ))}

                    {/* Phrase de transition */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <img
                        src="/coach-marie.png"
                        alt=""
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                          border: "1.5px solid rgba(255,77,109,0.25)",
                          marginTop: 2,
                        }}
                      />
                      <div
                        style={{
                          background: "#fff",
                          borderRadius: "16px 16px 16px 4px",
                          padding: "10px 14px",
                          fontSize: 12.5,
                          lineHeight: 1.5,
                          color: C.muted,
                          fontStyle: "italic",
                          boxShadow: "0 1px 4px rgba(0,0,0,.07)",
                          maxWidth: "88%",
                        }}
                      >
                        Je te montre un exemple réel d'une participante :
                      </div>
                    </div>

                    {/* Témoignage ciblé — mini carte WhatsApp */}
                    <div
                      style={{
                        marginLeft: 38,
                        marginTop: 4,
                        background: "#fff",
                        borderRadius: 14,
                        overflow: "hidden",
                        boxShadow: "0 2px 12px rgba(0,0,0,.10)",
                      }}
                    >
                      {/* Header type WhatsApp */}
                      <div
                        style={{
                          background: "#F0F2F0",
                          padding: "7px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          borderBottom: "1px solid rgba(0,0,0,.06)",
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "#25D366",
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: 11, color: "#667781", fontWeight: 500, letterSpacing: 0.2 }}>
                          WhatsApp · Retour cliente
                        </span>
                      </div>

                      {/* Zone message */}
                      <div style={{ padding: "10px 12px 10px" }}>
                        {/* Bulle */}
                        <div
                          style={{
                            background: "#E7FFDB",
                            borderRadius: "12px 12px 4px 12px",
                            padding: "9px 12px",
                            display: "inline-block",
                            maxWidth: "100%",
                          }}
                        >
                          <p
                            style={{
                              margin: "0 0 4px",
                              fontSize: 13,
                              lineHeight: 1.55,
                              color: "#111",
                              whiteSpace: "pre-line",
                            }}
                          >
                            {selectedProfile.testimony.text}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <span style={{ fontSize: 10.5, color: "#667781" }}>
                              {selectedProfile.testimony.time}
                            </span>
                            <svg width="15" height="9" viewBox="0 0 15 9" fill="none">
                              <path d="M1 4L3.5 7L8 1" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M5 4L7.5 7L12 1" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        {/* Signature */}
                        <p
                          style={{
                            margin: "6px 0 0",
                            fontSize: 11.5,
                            color: "#667781",
                            fontStyle: "italic",
                            textAlign: "right",
                          }}
                        >
                          {selectedProfile.testimony.signature}
                        </p>
                      </div>
                    </div>

                    {/* Screenshot WhatsApp avec fade-in différé */}
                    {showScreenshot && (
                      <div
                        className="bc-screenshot"
                        style={{ marginLeft: 38, marginTop: 4 }}
                      >
                        <img
                          src={selectedProfile.testimony.image}
                          alt="Capture WhatsApp"
                          style={{
                            width: "100%",
                            borderRadius: 12,
                            boxShadow: "0 2px 12px rgba(0,0,0,.12)",
                            display: "block",
                          }}
                        />
                      </div>
                    )}

                    {/* CTA */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6, paddingLeft: 38 }}>
                      <button
                        onClick={() => handleWA(selectedProfile)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          background: "#25D366",
                          color: "#fff",
                          border: "none",
                          borderRadius: 12,
                          padding: "12px 14px",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          boxShadow: "0 2px 12px rgba(37,211,102,.3)",
                        }}
                      >
                        <WaIcon />
                        Parler sur WhatsApp
                      </button>

                      <button
                        onClick={handleJoin}
                        style={{
                          background: `linear-gradient(135deg, ${C.cta}, ${C.ctaHover})`,
                          color: "#fff",
                          border: "none",
                          borderRadius: 12,
                          padding: "12px 14px",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          boxShadow: `0 4px 16px ${C.cta}44`,
                          lineHeight: 1.35,
                        }}
                      >
                        {selectedProfile.cta}
                      </button>

                      <button
                        onClick={() => setProfile(null)}
                        style={{
                          background: "none",
                          border: "none",
                          color: C.muted,
                          fontSize: 12,
                          cursor: "pointer",
                          padding: "4px 0",
                          textDecoration: "underline",
                          fontFamily: "inherit",
                        }}
                      >
                        ← Changer ma réponse
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Notification sociale simulée ── */}
          {showNotif && (
            <div
              className={notifOut ? "bc-notif-exit" : "bc-notif-enter"}
              style={{
                position: "absolute",
                bottom: 12,
                left: 10,
                right: 10,
                background: "#fff",
                borderRadius: 12,
                padding: "10px 12px",
                boxShadow: "0 4px 18px rgba(0,0,0,.16)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                zIndex: 20,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#25D366",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <WaIcon />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 600, color: "#111", lineHeight: 1.3 }}>
                  Awa — Cocody
                </p>
                <p style={{ margin: 0, fontSize: 11.5, color: "#667781", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  Je viens de m'inscrire mais j'ai une question.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Bouton toggle ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Parler à Coach Marie"
        style={{
          position: "fixed",
          bottom: 88,
          right: 16,
          zIndex: 1000,
          width: 54,
          height: 54,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          padding: 0,
          overflow: "hidden",
          boxShadow: open
            ? "0 4px 16px rgba(0,0,0,.2)"
            : `0 4px 20px ${C.cta}66, 0 0 0 3px #fff, 0 0 0 5px ${C.cta}44`,
          transition: "box-shadow .2s",
          background: open ? C.ctaHover : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {open ? (
          <span style={{ color: "#fff", fontSize: 22, fontWeight: 300, lineHeight: 1 }}>×</span>
        ) : (
          <img
            src="/coach-marie.png"
            alt="Coach Marie"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </button>
    </>
  );
}

function WaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.596-.773-6.39-2.082l-.446-.34-2.897.97.97-2.897-.34-.446A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}
