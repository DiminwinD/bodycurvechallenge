import React, { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import AIChatBubble from "./AIChatBubble";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// ─── CONFIG ───────────────────────────────────────────────
const CONFIG = {
  TIMEZONE: "Africa/Abidjan",
  PROMO_DEADLINE_ISO: "2026-03-30T23:59:00",
  PRICES: { original: 125000, promo: 25000, standard: 60000 },
  WHATSAPP_NUMBER: "+2250799576214",
  SPOTS_TOTAL: 120,
  SPOTS_LEFT: 43,
  AI_WIDGET_ENABLED: false,
};

const formatFCFA = (n) => n.toLocaleString("fr-FR") + " FCFA";

// Image: mirror/avant photo (intro_douleur)
const IMG_MIRROR = "/img-mirror.png";
const IMG_APRES = "/img-apres.png";

// ─── HOOKS ────────────────────────────────────────────────
function usePromoState() {
  const [state, setState] = useState({ active: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const deadline = new Date(CONFIG.PROMO_DEADLINE_ISO + "+00:00");
      const diff = deadline - now;
      if (diff <= 0) { setState({ active: false, days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setState({
        active: true,
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return state;
}

function useExitIntent(cb) {
  useEffect(() => {
    const handler = (e) => { if (e.clientY < 5) cb(); };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, [cb]);
}

// ─── STYLE CONSTANTS ──────────────────────────────────────
const C = {
  bg: "#FFF7F3", cta: "#FF4D6D", ctaHover: "#E63B5E", peach: "#FFB3A7",
  dark: "#0F0F12", text: "#121217", muted: "#6B6B76", card: "#FFFFFF",
  border: "rgba(18,18,23,0.08)",
};

const baseBtn = {
  background: `linear-gradient(135deg, ${C.cta}, ${C.ctaHover})`,
  color: "#fff", border: "none", borderRadius: 999, fontWeight: 700,
  cursor: "pointer", fontSize: 17, letterSpacing: 0.3, transition: "all .2s",
  boxShadow: `0 4px 24px ${C.cta}44`,
};

// ─── SMALL COMPONENTS ─────────────────────────────────────
function SectionWrap({ children, bg, id, style }) {
  return (
    <section id={id} style={{ background: bg || C.bg, padding: "56px 20px", ...style }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function Heading({ children, sub, center }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 24 }}>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(26px,5vw,38px)", color: C.dark, lineHeight: 1.2, margin: 0 }}>{children}</h2>
      {sub && <p style={{ color: C.muted, fontSize: 16, marginTop: 10, lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

function CTAButton({ children, onClick, full, small, style: s, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...baseBtn, padding: small ? "12px 28px" : "16px 36px", width: full ? "100%" : "auto", fontSize: small ? 15 : 17, opacity: disabled ? 0.6 : 1, cursor: disabled ? "not-allowed" : "pointer", ...s }}>
      {children}
    </button>
  );
}

function Micro({ children }) {
  return <p style={{ color: C.muted, fontSize: 13, marginTop: 8, textAlign: "center" }}>{children}</p>;
}

function ImgPlaceholder({ label, h, src, style: s }) {
  return (
    <div style={{ width: "100%", height: h || 260, borderRadius: 20, overflow: "hidden", background: `linear-gradient(135deg, ${C.peach}33, ${C.cta}11)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", ...s }}>
      {src ? <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> :
        <span style={{ color: C.muted, fontSize: 14, opacity: .6 }}>{label}</span>}
    </div>
  );
}

// ─── PROMO COUNTDOWN CAPSULE ──────────────────────────────
function PromoCountdownCapsule({ promo }) {
  if (!promo.active) return null;
  const under72h = promo.days < 3;
  const under24h = promo.days === 0 && promo.hours < 24;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: C.card, borderRadius: 20, padding: "16px 28px", border: `2px solid transparent`, backgroundClip: "padding-box", boxShadow: `0 0 0 2px ${C.cta}44, 0 8px 32px ${C.cta}18`, animation: under72h ? "pulse-glow 2s infinite" : "none" }}>
      {under72h && <span style={{ fontSize: 11, color: C.cta, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>{under24h ? "⏰ DERNIÈRES HEURES" : "🔥 DERNIERS 3 JOURS"}</span>}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          [promo.days, "Jours"], [promo.hours, "Heures"], [promo.minutes, "Min"], [promo.seconds, "Sec"]
        ].map(([v, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: C.dark, lineHeight: 1 }}>{String(v).padStart(2, "0")}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SPOTS PROGRESS BAR ───────────────────────────────────
function SpotsProgressBar() {
  const pct = ((CONFIG.SPOTS_TOTAL - CONFIG.SPOTS_LEFT) / CONFIG.SPOTS_TOTAL) * 100;
  return (
    <div style={{ background: C.card, borderRadius: 16, padding: 20, boxShadow: `0 2px 16px ${C.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontWeight: 600, color: C.dark, fontSize: 14 }}>Places restantes</span>
        <span style={{ fontWeight: 700, color: C.cta, fontSize: 14 }}>{CONFIG.SPOTS_LEFT} / {CONFIG.SPOTS_TOTAL}</span>
      </div>
      <div style={{ height: 10, background: `${C.peach}33`, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.cta}, ${C.peach})`, borderRadius: 99, transition: "width 1s" }} />
      </div>
      <p style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Places limitées pour garantir un suivi personnalisé.</p>
    </div>
  );
}

// ─── LIVE SIGNUP NOTIFICATIONS ────────────────────────────
function LiveSignupNotifications() {
  const names = ["Aminata", "Fatou", "Aïcha", "Mariam", "Adjoa", "Kady", "Awa", "Yao", "Bintou", "Raissa"];
  const actions = ["vient de réserver sa place", "vient de rejoindre le challenge", "s'est inscrite"];
  const [notif, setNotif] = useState(null);
  const countRef = useRef(0);
  useEffect(() => {
    const show = () => {
      if (countRef.current >= 6) return;
      const n = names[Math.floor(Math.random() * names.length)];
      const a = actions[Math.floor(Math.random() * actions.length)];
      setNotif(`${n} ${a} ✨`);
      countRef.current++;
      setTimeout(() => setNotif(null), 4000);
    };
    const id = setInterval(show, 22000);
    const first = setTimeout(show, 8000);
    return () => { clearInterval(id); clearTimeout(first); };
  }, []);
  if (!notif) return null;
  return (
    <div style={{ position: "fixed", bottom: 80, left: 16, zIndex: 900, background: C.card, borderRadius: 14, padding: "12px 18px", boxShadow: "0 8px 32px rgba(0,0,0,.12)", fontSize: 14, color: C.dark, maxWidth: 280, animation: "slideUp .4s ease" }}>
      {notif}
    </div>
  );
}

// ─── BODY GOAL QUIZ ───────────────────────────────────────
function BodyGoalQuiz({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const questions = [
    { q: "Quel est ton objectif principal ?", opts: ["Perdre du ventre", "Tonifier mon corps", "Retrouver confiance", "Me sentir bien"] },
    { q: "Quel est ton niveau actuel ?", opts: ["Débutante totale", "J'ai déjà essayé", "Habituée au sport", "Reprise après pause"] },
    { q: "Combien de temps peux-tu consacrer ?", opts: ["15–20 min/jour", "30 min/jour", "45 min/jour", "Plus de 45 min"] },
  ];

  const select = (opt) => {
    const na = [...answers, opt];
    setAnswers(na);
    if (step < questions.length - 1) setStep(step + 1);
    else onComplete(na);
  };

  if (step >= questions.length) return null;
  const prog = ((step + 1) / questions.length) * 100;

  return (
    <div style={{ background: C.card, borderRadius: 24, padding: 32, boxShadow: `0 4px 24px ${C.border}` }}>
      <div style={{ height: 4, background: `${C.peach}33`, borderRadius: 99, marginBottom: 24 }}>
        <div style={{ width: `${prog}%`, height: "100%", background: C.cta, borderRadius: 99, transition: "width .4s" }} />
      </div>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Question {step + 1}/{questions.length}</p>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark, marginBottom: 20 }}>{questions[step].q}</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {questions[step].opts.map((o) => (
          <button key={o} onClick={() => select(o)} style={{ background: `${C.peach}15`, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "14px 18px", fontSize: 15, color: C.dark, cursor: "pointer", textAlign: "left", transition: "all .2s" }}
            onMouseEnter={(e) => { e.target.style.borderColor = C.cta; e.target.style.background = `${C.cta}08`; }}
            onMouseLeave={(e) => { e.target.style.borderColor = C.border; e.target.style.background = `${C.peach}15`; }}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function PersonalizedResult({ answers }) {
  const profile = answers[0]?.includes("ventre") ? "Objectif Ventre Plat" : answers[0]?.includes("confiance") ? "Reconnexion & Confiance" : "Transformation Complète";
  return (
    <div style={{ background: `linear-gradient(135deg, ${C.cta}08, ${C.peach}15)`, borderRadius: 24, padding: 28, marginTop: 20, border: `1px solid ${C.peach}33` }}>
      <p style={{ fontSize: 13, color: C.cta, fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>TON PROFIL DÉTECTÉ</p>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: C.dark, margin: "4px 0 12px" }}>{profile}</h3>
      <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.6 }}>
        Le programme Body Curve Challenge est parfaitement adapté à ton profil. En 21 jours, avec un cadre clair et un suivi personnalisé, tu vas voir des résultats concrets.
      </p>
    </div>
  );
}

function CommitmentStep({ onCommit }) {
  const [committed, setCommitted] = useState(false);
  if (committed) {
    return (
      <div style={{ textAlign: "center", padding: 28, background: `${C.cta}06`, borderRadius: 20, marginTop: 16 }}>
        <p style={{ fontSize: 28, marginBottom: 8 }}>💪</p>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark }}>Tu as fait le premier pas.</h3>
        <p style={{ color: C.muted, marginTop: 8, fontSize: 15 }}>C'est le moment de transformer cette intention en action.</p>
        <div style={{ marginTop: 20 }}>
          <CTAButton onClick={() => { const el = document.getElementById('earlybird'); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }} full>Je bloque ma place maintenant</CTAButton>
        </div>
      </div>
    );
  }
  return (
    <div style={{ textAlign: "center", padding: 28, background: C.card, borderRadius: 20, marginTop: 16, boxShadow: `0 2px 16px ${C.border}` }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark }}>Es-tu prête à t'engager pendant 21 jours ?</h3>
      <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "center", flexWrap: "wrap" }}>
        <CTAButton onClick={() => setCommitted(true)}>Oui, je suis prête</CTAButton>
        <button onClick={() => setCommitted(true)} style={{ background: "transparent", border: `2px solid ${C.cta}`, color: C.cta, borderRadius: 999, padding: "14px 28px", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
          Je veux essayer
        </button>
      </div>
    </div>
  );
}

// ─── BEFORE/AFTER SLIDER ──────────────────────────────────
function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  return (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", height: 320, touchAction: "none", cursor: "ew-resize" }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos(Math.max(5, Math.min(95, ((e.clientX - r.left) / r.width) * 100))); }}
      onTouchMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const t = e.touches[0]; setPos(Math.max(5, Math.min(95, ((t.clientX - r.left) / r.width) * 100))); }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <img src={IMG_APRES} alt="Après" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <span style={{ position: "absolute", bottom: 12, right: 12, color: C.muted, fontSize: 13, fontWeight: 700, letterSpacing: 2, background: "rgba(255,255,255,.7)", padding: "4px 10px", borderRadius: 8 }}>APRÈS</span>
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${pos}%`, overflow: "hidden", borderRight: `3px solid ${C.card}` }}>
        <img src={IMG_MIRROR} alt="Avant" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <span style={{ position: "absolute", bottom: 12, left: 12, color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: 2, background: "rgba(0,0,0,.45)", padding: "4px 10px", borderRadius: 8 }}>AVANT</span>
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)", width: 40, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.card, boxShadow: "0 2px 12px rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>↔</div>
      </div>
    </div>
  );
}

// ─── FAQ ACCORDION ────────────────────────────────────────
function FAQAccordion() {
  const [open, setOpen] = useState(null);
  const faqs = [
    ["Ce challenge est-il adapté aux débutantes ?", "Absolument ! Le programme est conçu pour tous les niveaux. Les séances sont progressives et adaptées, que tu n'aies jamais fait de sport ou que tu reprennes après une pause."],
    ["Combien de temps durent les séances ?", "Entre 20 et 35 minutes par jour. L'objectif est l'efficacité, pas de passer des heures à s'épuiser. Chaque minute compte."],
    ["Ai-je besoin d'équipement ?", "Non, aucun matériel n'est nécessaire. Tu peux tout faire chez toi, avec ton poids de corps. Un tapis de sol est un plus, mais pas obligatoire."],
    ["En groupe ou en solo, comment ça se passe ?", "Tu suis le programme à ton rythme, mais tu fais partie d'un groupe WhatsApp privé avec d'autres participantes et ta coach. L'énergie collective te porte."],
    ["Y a-t-il un accompagnement réel ?", "Oui ! Coach Marie assure un suivi quotidien via le groupe WhatsApp, avec 2 lives Q&A par semaine pour répondre à toutes tes questions."],
    ["Quand commence la prochaine session ?", "Les inscriptions sont ouvertes maintenant. La prochaine session démarre dès que tu es inscrite, avec un onboarding personnalisé."],
    ["Que gagnent les premières inscrites ?", "Les premières inscrites reçoivent le Guide Ventre Plat & Éclat, un accès anticipé à l'application Body Curve Control, et des surprises & goodies exclusifs."],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {faqs.map(([q, a], i) => (
        <div key={i} style={{ background: C.card, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, transition: "all .2s" }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
            <span style={{ fontWeight: 600, color: C.dark, fontSize: 15 }}>{q}</span>
            <span style={{ color: C.cta, fontSize: 20, transform: open === i ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
          </button>
          {open === i && <div style={{ padding: "0 20px 18px", color: C.muted, fontSize: 14, lineHeight: 1.7 }}>{a}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── SHARED LEAD SUBMISSION ───────────────────────────────
async function submitLead({ prenom, whatsapp, email, source }) {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/capture-lead`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY },
      body: JSON.stringify({ prenom, whatsapp, email: email || null, source }),
    }
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error('[capture-lead] Erreur:', res.status, body);
    throw new Error(body.message || `Erreur serveur (${res.status})`);
  }
}

// ─── EARLY BIRD SIGNUP ────────────────────────────────────
function EarlyBirdSignup() {
  const [form, setForm] = useState({ prenom: "", whatsapp: "", email: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.prenom || !form.whatsapp || loading) return;
    setLoading(true);
    try {
      await submitLead({ prenom: form.prenom, whatsapp: form.whatsapp, email: form.email, source: 'early_bird_signup' });
      sessionStorage.setItem("bc_lead", JSON.stringify({ firstname: form.prenom, phone: form.whatsapp, email: form.email }));
      setDone(true);
    } catch {
      alert('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: 36, background: `linear-gradient(135deg, ${C.cta}08, ${C.peach}18)`, borderRadius: 24 }}>
      <p style={{ fontSize: 40, marginBottom: 8 }}>🎉</p>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: C.dark }}>Bienvenue dans le challenge !</h3>
      <p style={{ color: C.muted, marginTop: 8 }}>Ton guide sera envoyé immédiatement. Surveille ton WhatsApp.</p>
    </div>
  );

  const inp = { width: "100%", padding: "14px 18px", borderRadius: 14, border: `1.5px solid ${C.border}`, fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: C.card };

  return (
    <div style={{ background: C.card, borderRadius: 24, padding: 32, boxShadow: `0 8px 40px ${C.cta}10` }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <span style={{ fontSize: 13, color: C.cta, fontWeight: 700, letterSpacing: 1 }}>🎁 CADEAUX EARLY BIRD</span>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: C.dark, marginTop: 8 }}>Reçois ton Guide Ventre Plat gratuit</h3>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>+ Accès anticipé app + surprises & goodies offerts aux premières inscrites — stock limité.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input placeholder="Ton prénom *" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} style={inp} />
        <input placeholder="WhatsApp (ex: +225 07...)" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} style={inp} />
        <input placeholder="Email (optionnel)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inp} />
        <CTAButton onClick={submit} full disabled={loading}>{loading ? "Envoi en cours..." : "Recevoir mon guide 🎁"}</CTAButton>
        <Micro>Tes informations restent privées. Téléchargement immédiat après inscription.</Micro>
      </div>
    </div>
  );
}

// ─── EXIT INTENT POPUP ────────────────────────────────────
function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [shown, setShown] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ prenom: "", whatsapp: "", email: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trigger = useCallback(() => {
    if (!shown) { setShow(true); setShown(true); }
  }, [shown]);

  useExitIntent(trigger);

  if (!show) return null;

  const inp = { width: "100%", padding: "14px 18px", borderRadius: 14, border: `1.5px solid ${C.border}`, fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  const handleStep1 = () => {
    if (!form.prenom.trim()) return;
    setStep(2);
  };

  const handleStep2 = async () => {
    if (!form.whatsapp.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await submitLead({ prenom: form.prenom, whatsapp: form.whatsapp, email: form.email, source: 'popup_guide_offer_v2' });
      sessionStorage.setItem("bc_lead", JSON.stringify({ firstname: form.prenom, phone: form.whatsapp, email: form.email }));
      setDone(true);
    } catch {
      setError('Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShow(false)}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.card, borderRadius: 24, padding: 36, maxWidth: 420, width: "100%", position: "relative", animation: "slideUp .3s ease" }}>
        <button onClick={() => setShow(false)} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 24, cursor: "pointer", color: C.muted }}>×</button>
        {done ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 36 }}>✨</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark }}>Parfait. Ta demande a bien été enregistrée.</h3>
            <p style={{ color: C.muted, marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>Étape suivante : rejoins maintenant le WhatsApp pour recevoir les infos en priorité.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
              <a href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace("+", "")}?text=Bonjour%20!%20Je%20suis%20int%C3%A9ress%C3%A9e%20par%20le%20Body%20Curve%20Challenge`}
                target="_blank" rel="noopener noreferrer"
                style={{ ...baseBtn, display: "inline-block", textAlign: "center", textDecoration: "none" }}>
                Rejoindre le WhatsApp maintenant
              </a>
              <a href="/guide-ventre-plat.pdf" download
                style={{ ...baseBtn, background: "transparent", border: `2px solid ${C.cta}`, color: C.cta, display: "inline-block", textAlign: "center", textDecoration: "none" }}>
                Télécharger mon guide PDF
              </a>
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark }}>Avant de partir : reçois ton Guide Ventre Plat gratuit</h3>
              <p style={{ color: C.muted, fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>Découvre quoi manger, quoi éviter et comment commencer sans te punir, avec un accès prioritaire au prochain groupe BodyCurve Challenge.</p>
            </div>

            {error && (
              <div style={{ background: "#fee", borderRadius: 12, padding: 12, marginBottom: 16, color: "#c33", fontSize: 14 }}>
                {error}
              </div>
            )}

            {step === 1 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input 
                  placeholder="Ton prénom *" 
                  value={form.prenom} 
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })} 
                  style={inp}
                  autoFocus
                />
                <CTAButton onClick={handleStep1} full>Je continue</CTAButton>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input 
                  placeholder="WhatsApp (ex: +225 07...) *" 
                  value={form.whatsapp} 
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} 
                  style={inp}
                  autoFocus
                />
                <input 
                  placeholder="Email (optionnel)" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  style={inp}
                />
                <CTAButton onClick={handleStep2} full disabled={isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Oui, je veux mon guide"}
                </CTAButton>
                <Micro>Aucun spam. Tes infos restent privées.</Micro>
                <p style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 4 }}>Les premières inscrites reçoivent les infos avant l'ouverture complète du challenge.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── PRICING CARD ─────────────────────────────────────────
function PricingCard({ promo }) {
  const scrollCTA = () => { const el = document.getElementById('earlybird'); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } };
  const includes = [
    "Programme d'entraînement complet 21 jours",
    "Guide nutritionnel personnalisé",
    "Accès au groupe privé WhatsApp",
    "2 lives Q&A par semaine",
    "Bonus : Guide « Ventre Plat & Éclat »",
    "Bonus : Accès anticipé à l'app Body Curve Control — à vie",
    "Surprises & goodies pour les premières inscrites",
  ];
  return (
    <div style={{ background: C.card, borderRadius: 28, padding: 36, boxShadow: `0 12px 48px ${C.cta}15`, border: `2px solid ${C.cta}22`, position: "relative", overflow: "hidden" }}>
      {promo.active && (
        <div style={{ position: "absolute", top: 20, right: -32, background: C.cta, color: "#fff", padding: "6px 40px", fontSize: 13, fontWeight: 700, transform: "rotate(45deg)", letterSpacing: 1 }}>-80%</div>
      )}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <p style={{ color: C.cta, fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 12 }}>OFFRE BODY CURVE CHALLENGE</p>
        {promo.active ? (
          <>
            <p style={{ color: C.muted, fontSize: 18, textDecoration: "line-through" }}>{formatFCFA(CONFIG.PRICES.original)}</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, color: C.dark, margin: "4px 0" }}>{formatFCFA(CONFIG.PRICES.promo)}</p>
            <span style={{ display: "inline-block", background: `${C.cta}12`, color: C.cta, borderRadius: 99, padding: "4px 14px", fontSize: 13, fontWeight: 600 }}>Offre lancement — ne reviendra pas.</span>
          </>
        ) : (
          <>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, color: C.dark, margin: "4px 0" }}>{formatFCFA(CONFIG.PRICES.standard)}</p>
            <span style={{ color: C.muted, fontSize: 14 }}>Prix standard en cours.</span>
          </>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {includes.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: C.cta, fontSize: 16, lineHeight: 1.4 }}>✓</span>
            <span style={{ color: C.text, fontSize: 14, lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
      <CTAButton onClick={scrollCTA} full>{promo.active ? "Je profite de l'offre -80%" : "Je m'inscris maintenant"}</CTAButton>
      <Micro>Paiement unique — aucun abonnement.</Micro>
    </div>
  );
}

// ─── WHATSAPP BUTTON ──────────────────────────────────────
function WhatsAppButton() {
  return (
    <a href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace("+", "")}?text=Bonjour%20!%20Je%20suis%20int%C3%A9ress%C3%A9e%20par%20le%20Body%20Curve%20Challenge`}
      target="_blank" rel="noopener noreferrer"
      style={{ position: "fixed", bottom: 20, right: 20, zIndex: 800, background: "#25D366", color: "#fff", borderRadius: 999, padding: "12px 20px", fontWeight: 600, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 20px rgba(37,211,102,.35)", display: "flex", alignItems: "center", gap: 8 }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.596-.773-6.39-2.082l-.446-.34-2.897.97.97-2.897-.34-.446A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
      WhatsApp
    </a>
  );
}

// ─── STICKY MOBILE CTA ────────────────────────────────────
function CTAStickyMobile({ promo }) {
  const scrollCTA = () => { const el = document.getElementById('earlybird'); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } };
  const timer = promo.active ? `${String(promo.hours).padStart(2, "0")}:${String(promo.minutes).padStart(2, "0")}:${String(promo.seconds).padStart(2, "0")}` : null;
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 850, background: C.card, padding: "10px 16px", boxShadow: "0 -4px 20px rgba(0,0,0,.08)", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1 }}>
        <button onClick={scrollCTA} style={{ ...baseBtn, width: "100%", padding: "14px", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {promo.active && <span style={{ background: "rgba(255,255,255,.25)", borderRadius: 6, padding: "2px 8px", fontSize: 12 }}>-80%</span>}
          Je m'inscris
          {timer && <span style={{ fontSize: 12, opacity: .9, fontFamily: "monospace" }}>{timer}</span>}
        </button>
      </div>
    </div>
  );
}

// ─── DOPAMINE SCROLL ──────────────────────────────────────
function DopamineBlock({ icon, title, desc, bg }) {
  return (
    <div style={{ background: bg, borderRadius: 20, padding: 28, display: "flex", gap: 16, alignItems: "flex-start" }}>
      <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
      <div>
        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.dark, margin: "0 0 6px" }}>{title}</h4>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function BodyCurveChallenge() {
  const promo = usePromoState();
  const [quizDone, setQuizDone] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState(null);

  const scrollPricing = () => { const el = document.getElementById('earlybird'); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } };

  return (
    <div style={{ fontFamily: "'Inter', 'Manrope', -apple-system, sans-serif", color: C.text, background: C.bg, overflowX: "hidden", paddingBottom: 70 }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 2px ${C.cta}44, 0 8px 32px ${C.cta}18} 50%{box-shadow:0 0 0 4px ${C.cta}66, 0 8px 40px ${C.cta}33} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
        * { box-sizing: border-box; margin: 0; }
        html { scroll-behavior: smooth; }
        img { max-width: 100%; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background: `${C.bg}ee`, backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 700, padding: "12px 20px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.cta, fontStyle: "italic" }}>Bodycurve</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, color: C.dark, letterSpacing: 3, textTransform: "uppercase" }}>CHALLENGE</span>
          </div>
          {promo.active && (
            <span style={{ background: `${C.cta}12`, color: C.cta, borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>-80% 🔥</span>
          )}
        </div>
      </header>

      {/* ══ SECTION 1 — HOOK ÉMOTIONNEL ══ */}
      <SectionWrap bg={`linear-gradient(180deg, ${C.bg}, ${C.peach}08)`} style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div style={{ textAlign: "center", animation: "fadeIn .6s ease" }}>
          <p style={{ color: C.cta, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 16 }}>BODY CURVE CHALLENGE — By Marie N'Dah</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px,6.5vw,48px)", color: C.dark, lineHeight: 1.15, margin: "0 0 16px" }}>
            Le confort détruit ton corps<br /><span style={{ color: C.cta }}>lentement.</span>
          </h1>
          <p style={{ color: C.muted, fontSize: 17, lineHeight: 1.6, maxWidth: 520, margin: "0 auto 28px" }}>
            Chaque semaine tu dis « je commence lundi ». Et chaque lundi devient… le lundi suivant.
          </p>
          <div style={{ marginBottom: 20 }}>
            <PromoCountdownCapsule promo={promo} />
          </div>
          <CTAButton onClick={scrollPricing} full style={{ maxWidth: 420, margin: "0 auto" }}>
            Je bloque ma place maintenant
          </CTAButton>
          <Micro>Places limitées pour garantir un suivi personnalisé.</Micro>
        </div>
      </SectionWrap>

      {/* ══ SECTION 2 — MIROIR PSYCHOLOGIQUE ══ */}
      <SectionWrap bg={C.card}>
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr", alignItems: "center" }}>
          <div>
            <Heading>Quand tu te regardes dans le miroir…</Heading>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "Tu reconnais ton visage, mais ton corps ne te ressemble plus.",
                "Tu veux changer… mais tu es fatiguée d'échouer.",
                "Tu n'as pas besoin de motivation. Tu as besoin d'un cadre.",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: C.cta, fontSize: 20, lineHeight: 1.3 }}>•</span>
                  <p style={{ color: C.text, fontSize: 16, lineHeight: 1.6, margin: 0 }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", height: 280 }}>
            <img src={IMG_MIRROR} alt="Femme devant le miroir" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", borderRadius: 20 }} />
          </div>
        </div>
      </SectionWrap>

      {/* ══ SECTION 3 — RUPTURE COGNITIVE ══ */}
      <SectionWrap bg={`linear-gradient(180deg, ${C.dark}, #1a1a22)`} style={{ textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          {["Le problème n'est pas ton corps.", "Le problème n'est pas ta discipline.", "Le problème, c'est la méthode."].map((t, i) => (
            <p key={i} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,4.5vw,32px)", color: i === 2 ? C.cta : "#fff", lineHeight: 1.3, marginBottom: 16, fontWeight: i === 2 ? 700 : 400 }}>{t}</p>
          ))}
          <div style={{ marginTop: 28, background: "rgba(255,77,109,.08)", borderRadius: 16, padding: "20px 24px", border: `1px solid ${C.cta}33` }}>
            <p style={{ color: "#fff", fontSize: 17, fontWeight: 600 }}>Body Curve Challenge = <span style={{ color: C.peach }}>structure</span> + <span style={{ color: C.peach }}>simplicité</span> + <span style={{ color: C.peach }}>suivi</span>.</p>
          </div>
        </div>
      </SectionWrap>

      {/* ══ SECTION 4 — PRÉSENTATION BODY CURVE ══ */}
      <SectionWrap>
        <Heading center>21 jours. Un cadre. Une transformation.</Heading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            ["🏋️‍♀️", "Entraînement guidé", "Séances courtes et efficaces, adaptées à ton niveau, à faire chez toi."],
            ["🥗", "Nutrition simple", "Un plan alimentaire réaliste, avec des recettes locales savoureuses."],
            ["🧠", "Mindset & suivi", "Coaching quotidien, groupe WhatsApp et lives pour rester motivée."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: C.card, borderRadius: 20, padding: 24, textAlign: "center", boxShadow: `0 2px 16px ${C.border}` }}>
              <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>{icon}</span>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.dark, marginBottom: 8 }}>{title}</h4>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {["Séances en ligne", "Suivi quotidien", "Communauté"].map((t) => (
            <span key={t} style={{ fontSize: 13, color: C.muted, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.cta }} />{t}
            </span>
          ))}
        </div>
      </SectionWrap>

      {/* ══ SECTION 5 — DOPAMINE SCROLL ══ */}
      <SectionWrap bg={`${C.peach}08`}>
        <Heading center sub="Découvre ce qui t'attend chaque jour.">Ce que tu vas débloquer</Heading>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <DopamineBlock icon="⚡" title="Séances courtes, efficaces" desc="20–30 min max. Pas besoin de matériel. Tu peux le faire entre deux tâches." bg={`${C.card}`} />
          <DopamineBlock icon="🍽️" title="Plan nutrition plaisir" desc="Des recettes locales simples, pas de régime frustrant. Attiéké, poisson grillé, patate douce..." bg={`${C.cta}05`} />
          <DopamineBlock icon="💬" title="Groupe WhatsApp + énergie" desc="Tu n'es jamais seule. Le groupe te porte, te motive, te challenge chaque jour." bg={`${C.peach}12`} />
          <DopamineBlock icon="👩‍🏫" title="Coach qui te suit" desc="Marie est là chaque jour. Pas un robot. Une vraie coach qui comprend ta réalité." bg={`${C.card}`} />
        </div>
      </SectionWrap>

      {/* ══ SECTION 6 — QUIZ ENGAGEMENT ══ */}
      <SectionWrap bg={C.card}>
        <Heading center sub="Réponds à 3 questions pour découvrir ton profil.">Trouve ton chemin</Heading>
        {!quizDone ? (
          <BodyGoalQuiz onComplete={(a) => { setQuizDone(true); setQuizAnswers(a); }} />
        ) : (
          <>
            <PersonalizedResult answers={quizAnswers} />
            <CommitmentStep />
          </>
        )}
      </SectionWrap>

      {/* ══ SECTION 7 — AVANT / APRÈS ══ */}
      <SectionWrap>
        <Heading center>Transformation visuelle</Heading>
        <BeforeAfterSlider />
        <p style={{ textAlign: "center", color: C.muted, fontSize: 13, marginTop: 12, fontStyle: "italic" }}>Exemples d'évolution (illustrations). Glisse pour comparer.</p>
        <p style={{ textAlign: "center", fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.dark, marginTop: 20, lineHeight: 1.4 }}>
          Fais-le pour toi. Pas pour plaire.<br /><span style={{ color: C.cta }}>Pour te retrouver.</span>
        </p>
      </SectionWrap>

      {/* ══ SECTION 8 — PREUVE SOCIALE ══ */}
      <SectionWrap bg={C.card}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: C.dark, fontWeight: 700 }}>+300</p>
          <p style={{ color: C.muted, fontSize: 15 }}>femmes ont déjà participé.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            ["Sarah K.", "Je ne pensais pas pouvoir retrouver ma silhouette d'avant grossesse. Marie m'a prouvé le contraire en trois semaines."],
            ["Aminata D.", "Le groupe WhatsApp m'a donné l'énergie que je n'avais plus. On se motive entre nous, c'est incroyable."],
            ["Fatou B.", "Les séances sont courtes mais tellement efficaces. J'ai vu des résultats dès la deuxième semaine."],
          ].map(([name, text]) => (
            <div key={name} style={{ background: `${C.peach}08`, borderRadius: 20, padding: 24, borderLeft: `3px solid ${C.cta}` }}>
              <p style={{ color: C.text, fontSize: 15, lineHeight: 1.7, fontStyle: "italic", marginBottom: 8 }}>« {text} »</p>
              <p style={{ color: C.cta, fontWeight: 600, fontSize: 14 }}>— {name}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginTop: 20 }}>
          <img src="/capture-whatsapp-1.jpeg" alt="Preuve WhatsApp 1" style={{ width: "100%", borderRadius: 16, objectFit: "cover", boxShadow: "0 4px 16px rgba(0,0,0,.10)", display: "block" }} />
          <img src="/capture-whatsapp-2.jpeg" alt="Preuve WhatsApp 2" style={{ width: "100%", borderRadius: 16, objectFit: "cover", boxShadow: "0 4px 16px rgba(0,0,0,.10)", display: "block" }} />
          <img src="/capture-whatsapp-3.jpeg" alt="Preuve WhatsApp 3" style={{ width: "100%", borderRadius: 16, objectFit: "cover", boxShadow: "0 4px 16px rgba(0,0,0,.10)", display: "block" }} />
        </div>
      </SectionWrap>

      {/* ══ SECTION 9 — PROJECTION FUTUR ══ */}
      <SectionWrap bg={`linear-gradient(180deg, ${C.peach}10, ${C.bg})`}>
        <div style={{ textAlign: "center" }}>
          <Heading center>Dans 21 jours…</Heading>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420, margin: "0 auto 28px" }}>
            {[
              "Tu te sentiras plus légère.",
              "Tu remettras des vêtements que tu évitais.",
              "Tu seras fière de toi — enfin.",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: `${C.cta}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✨</span>
                <p style={{ color: C.text, fontSize: 16, lineHeight: 1.5, textAlign: "left" }}>{t}</p>
              </div>
            ))}
          </div>
          <CTAButton onClick={scrollPricing}>Je veux me retrouver</CTAButton>
        </div>
      </SectionWrap>

      {/* ══ SECTION 10 — PRICING ══ */}
      <SectionWrap id="pricing" bg={C.card}>
        <Heading center sub="Tout est inclus. Aucun frais caché.">L'offre Body Curve Challenge</Heading>
        <PricingCard promo={promo} />
      </SectionWrap>

      {/* ══ SECTION 11 — URGENCE ══ */}
      <SectionWrap bg={`linear-gradient(180deg, ${C.cta}06, ${C.bg})`}>
        <div style={{ textAlign: "center" }}>
          <SpotsProgressBar />
          <div style={{ marginTop: 24 }}>
            <PromoCountdownCapsule promo={promo} />
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.dark, marginTop: 24, lineHeight: 1.4 }}>
            Le 31 mars, le tarif passe à {formatFCFA(CONFIG.PRICES.standard)}.
          </p>
          <p style={{ color: C.muted, fontSize: 16, marginTop: 4 }}>Si tu veux le prix lancement, c'est maintenant.</p>
          <div style={{ marginTop: 20 }}>
            <CTAButton onClick={scrollPricing}>Je profite de l'offre -80%</CTAButton>
          </div>
        </div>
      </SectionWrap>

      {/* ══ SECTION 12 — CTA FINAL ══ */}
      <SectionWrap bg={`linear-gradient(180deg, ${C.dark}, #1a1a22)`} style={{ textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,5vw,36px)", color: "#fff", lineHeight: 1.25, margin: "0 0 16px" }}>
          La seule question : est-ce que tu veux que ton corps soit le même <span style={{ color: C.peach }}>dans 3 mois</span> ?
        </h2>
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
          Tu n'as pas besoin de perfection. Tu as besoin d'un départ.
        </p>
        <CTAButton onClick={scrollPricing} full style={{ maxWidth: 400, margin: "0 auto" }}>
          Je commence maintenant
        </CTAButton>
        <p style={{ color: "rgba(255,255,255,.4)", fontSize: 13, marginTop: 12 }}>Tu peux poser tes questions sur WhatsApp à tout moment.</p>
      </SectionWrap>

      {/* ── EARLY BIRD ── */}
      <SectionWrap id="earlybird" bg={`${C.peach}08`}>
        <EarlyBirdSignup />
      </SectionWrap>

      {/* ── FAQ ── */}
      <SectionWrap bg={C.card}>
        <Heading center>Questions fréquentes</Heading>
        <FAQAccordion />
      </SectionWrap>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.dark, padding: "40px 20px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.cta, fontStyle: "italic" }}>Bodycurve</p>
        <p style={{ color: "rgba(255,255,255,.3)", fontSize: 12, marginTop: 8 }}>Body Curve Challenge © 2026 — By Marie N'Dah</p>
        <p style={{ color: "rgba(255,255,255,.2)", fontSize: 11, marginTop: 4 }}>@MARIE_NDAHFIT</p>
      </footer>

      {/* ── OVERLAYS ── */}
      <LiveSignupNotifications />
      <WhatsAppButton />
      <CTAStickyMobile promo={promo} />
      <ExitIntentPopup />
      <AIChatBubble />
    </div>
  );
}