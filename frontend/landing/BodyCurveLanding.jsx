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
  AI_WIDGET_ENABLED: true,
  PAYMENT_URL: "https://pzptvmid.mychariow.shop/prd_iuoyld",
};

// ─── PAYMENT HANDLER ─────────────────────────────────────
const handlePayment = () => window.open(CONFIG.PAYMENT_URL, "_blank", "noopener,noreferrer");

const formatFCFA = (n) => n.toLocaleString("fr-FR") + " FCFA";

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

function CTAButton({ children, onClick, full, small, style: s }) {
  return (
    <button onClick={onClick} style={{ ...baseBtn, padding: small ? "12px 28px" : "16px 36px", width: full ? "100%" : "auto", fontSize: small ? 15 : 17, ...s }}>
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
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: C.card, borderRadius: 20, padding: "16px 28px", boxShadow: `0 0 0 2px ${C.cta}44, 0 8px 32px ${C.cta}18`, animation: under72h ? "pulse-glow 2s infinite" : "none" }}>
      {under72h && <span style={{ fontSize: 11, color: C.cta, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>{under24h ? "⏰ DERNIÈRES HEURES" : "🔥 DERNIERS 3 JOURS"}</span>}
      <div style={{ display: "flex", gap: 12 }}>
        {[[promo.days, "Jours"], [promo.hours, "Heures"], [promo.minutes, "Min"], [promo.seconds, "Sec"]].map(([v, l]) => (
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
    { q: "Combien de temps peux-tu consacrer ?", opts: ["15 min/jour", "30 min/jour", "45 min/jour", "1h+/jour"] },
  ];
  const pick = (opt) => {
    const next = [...answers, opt];
    if (step < questions.length - 1) { setAnswers(next); setStep(step + 1); }
    else onComplete(next);
  };
  const q = questions[step];
  return (
    <div style={{ background: C.card, borderRadius: 24, padding: 28, boxShadow: `0 4px 24px ${C.border}` }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ height: 4, background: `${C.peach}33`, borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ width: `${((step + 1) / questions.length) * 100}%`, height: "100%", background: C.cta, borderRadius: 99, transition: "width .4s" }} />
        </div>
        <p style={{ fontSize: 13, color: C.muted }}>Question {step + 1} / {questions.length}</p>
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.dark, marginBottom: 16, lineHeight: 1.4 }}>{q.q}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.opts.map((opt) => (
          <button key={opt} onClick={() => pick(opt)}
            style={{ background: "transparent", border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 16px", textAlign: "left", cursor: "pointer", fontSize: 15, color: C.text, transition: "all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.cta; e.currentTarget.style.color = C.cta; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuizResult({ answers }) {
  const profile = answers[0] === "Perdre du ventre" ? "Sculpteuse" : answers[0] === "Tonifier mon corps" ? "Tonique" : "Épanouie";
  return (
    <div style={{ background: C.card, borderRadius: 24, padding: 28, textAlign: "center", boxShadow: `0 4px 24px ${C.border}` }}>
      <p style={{ fontSize: 36, marginBottom: 8 }}>🌸</p>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark, marginBottom: 8 }}>Ton profil : La {profile}</h3>
      <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>Le Body Curve Challenge est conçu exactement pour toi. En 21 jours, tu vas ressentir une vraie transformation.</p>
      <CTAButton onClick={handlePayment} full>Je rejoins le challenge maintenant</CTAButton>
    </div>
  );
}

// ─── BEFORE / AFTER SLIDER ────────────────────────────────
function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  const sliderRef = useRef(null);
  const dragging = useRef(false);

  const move = useCallback((clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }, []);

  useEffect(() => {
    const up = () => { dragging.current = false; };
    const mm = (e) => { if (dragging.current) move(e.clientX); };
    const tm = (e) => { if (dragging.current) move(e.touches[0].clientX); };
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", mm);
    window.addEventListener("touchend", up);
    window.addEventListener("touchmove", tm, { passive: true });
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchmove", tm);
    };
  }, [move]);

  return (
    <div ref={sliderRef}
      style={{ position: "relative", borderRadius: 20, overflow: "hidden", height: 320, cursor: "col-resize", userSelect: "none" }}
      onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
      onTouchStart={(e) => { dragging.current = true; move(e.touches[0].clientX); }}>
      <ImgPlaceholder label="AVANT" h={320} src={IMG_MIRROR} style={{ borderRadius: 0, position: "absolute", inset: 0 }} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <ImgPlaceholder label="APRÈS" h={320} src={IMG_APRES} style={{ borderRadius: 0 }} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)", width: 3, background: "#fff", boxShadow: "0 0 12px rgba(0,0,0,.3)" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 36, height: 36, borderRadius: "50%", background: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⟺</div>
      </div>
      {["AVANT", "APRÈS"].map((l, i) => (
        <div key={l} style={{ position: "absolute", top: 12, [i === 0 ? "left" : "right"]: 12, background: "rgba(0,0,0,.5)", color: "#fff", borderRadius: 99, padding: "4px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{l}</div>
      ))}
    </div>
  );
}

// ─── FAQ ACCORDION ────────────────────────────────────────
function FAQAccordion() {
  const [open, setOpen] = useState(null);
  const faqs = [
    ["C'est fait pour moi si je suis débutante ?", "Oui ! Le programme s'adapte à tous les niveaux. Les exercices sont progressifs et expliqués pas à pas."],
    ["Quel équipement ai-je besoin ?", "Aucun équipement spécifique. Les séances sont conçues pour être réalisées à la maison avec ton poids corporel."],
    ["Comment reçois-je le programme ?", "Après paiement, tu reçois un accès immédiat au groupe WhatsApp privé et à tous les contenus du programme."],
    ["Y a-t-il un suivi personnalisé ?", "Oui ! Tu auras accès à 2 sessions live Q&A par semaine avec Marie, plus le groupe WhatsApp pour poser tes questions."],
    ["Et si je n'ai pas de résultats ?", "Marie croit en ce programme. Si tu suis le challenge à 100% pendant 21 jours sans résultats, contacte-nous."],
    ["Le paiement est-il sécurisé ?", "Oui, le paiement se fait via Chariow, plateforme de paiement sécurisée disponible en Côte d'Ivoire."],
    ["Puis-je payer par mobile money ?", "Oui ! Chariow accepte Orange Money, MTN Money et les cartes bancaires."],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}>
      {faqs.map(([q, a], i) => (
        <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{ width: "100%", background: "transparent", border: "none", padding: "16px 20px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, fontSize: 15, fontWeight: 600, color: C.dark }}>
            {q}
            <span style={{ fontSize: 18, color: C.cta, flexShrink: 0, transform: open === i ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
          </button>
          {open === i && <div style={{ padding: "0 20px 16px", color: C.muted, fontSize: 14, lineHeight: 1.7 }}>{a}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── EARLY BIRD SIGNUP (avec Supabase) ───────────────────
function EarlyBirdSignup() {
  const [form, setForm] = useState({ prenom: "", whatsapp: "", email: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.prenom || !form.whatsapp) return;
    setLoading(true);
    try {
      await supabase.from("leads").insert([{ prenom: form.prenom, whatsapp: form.whatsapp, email: form.email || null, source: "earlybird" }]);
    } catch (e) { console.error(e); }
    setLoading(false);
    setDone(true);
  };

  const inp = { border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 15, outline: "none", width: "100%", background: C.card, color: C.text };
  return (
    <div style={{ background: `linear-gradient(135deg, ${C.cta}08, ${C.peach}12)`, borderRadius: 28, padding: 32, textAlign: "center" }}>
      {done ? (
        <div>
          <p style={{ fontSize: 36 }}>✨</p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark, marginTop: 8 }}>C'est parti !</h3>
          <p style={{ color: C.muted, marginTop: 8 }}>Ton guide est en route sur WhatsApp.</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 32, marginBottom: 4 }}>🎁</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark }}>Attends ! Un cadeau pour toi</h3>
            <p style={{ color: C.muted, fontSize: 14, marginTop: 8 }}>Reçois gratuitement le Guide Ventre Plat + un accès anticipé au challenge.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input placeholder="Prénom *" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} style={inp} />
            <input placeholder="WhatsApp *" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} style={inp} />
            <input placeholder="Email (optionnel)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inp} />
            <CTAButton onClick={submit} full>{loading ? "Envoi..." : "Recevoir mon guide"}</CTAButton>
            <Micro>Aucun spam. Tes infos restent privées.</Micro>
          </div>
        </>
      )}
    </div>
  );
}

// ─── PRICING CARD ─────────────────────────────────────────
function PricingCard({ promo }) {
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
      <CTAButton onClick={handlePayment} full>
        {promo.active ? "Je profite de l'offre -80%" : "Je m'inscris maintenant"}
      </CTAButton>
      <Micro>Paiement unique — aucun abonnement.</Micro>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
        {["🔒 Paiement sécurisé", "📱 Orange Money & MTN", "✅ Accès immédiat"].map((t) => (
          <span key={t} style={{ fontSize: 11, color: C.muted }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── WHATSAPP BUTTON ──────────────────────────────────────
function WhatsAppButton() {
  return (
    <a href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace("+", "")}?text=Bonjour%20!%20Je%20suis%20int%C3%A9ress%C3%A9e%20par%20le%20Body%20Curve%20Challenge`}
      target="_blank" rel="noopener noreferrer"
      style={{ position: "fixed", bottom: 20, right: 20, zIndex: 800, background: "#25D366", color: "#fff", borderRadius: 999, padding: "12px 20px", fontWeight: 600, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 20px rgba(37,211,102,.35)", display: "flex", alignItems: "center", gap: 8 }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.596-.773-6.39-2.082l-.446-.34-2.897.97.97-2.897-.34-.446A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
      WhatsApp
    </a>
  );
}

// ─── STICKY MOBILE CTA ────────────────────────────────────
function CTAStickyMobile({ promo }) {
  const timer = promo.active
    ? `${String(promo.hours).padStart(2, "0")}:${String(promo.minutes).padStart(2, "0")}:${String(promo.seconds).padStart(2, "0")}`
    : null;
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 800, background: `${C.bg}f0`, backdropFilter: "blur(16px)", padding: "12px 16px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flexShrink: 0 }}>
        {promo.active && (
          <>
            <div style={{ fontSize: 11, color: C.muted, textDecoration: "line-through" }}>{formatFCFA(CONFIG.PRICES.original)}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.dark, lineHeight: 1 }}>{formatFCFA(CONFIG.PRICES.promo)}</div>
            {timer && <div style={{ fontSize: 10, color: C.cta, fontWeight: 700, marginTop: 2 }}>⏱ {timer}</div>}
          </>
        )}
      </div>
      <CTAButton onClick={handlePayment} full small>
        {promo.active ? "Je profite -80% 🔥" : "Je m'inscris"}
      </CTAButton>
    </div>
  );
}

// ─── EXIT INTENT POPUP ────────────────────────────────────
function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ prenom: "", whatsapp: "", email: "" });
  const shown = useRef(false);
  useExitIntent(() => { if (!shown.current) { shown.current = true; setShow(true); } });

  const submit = async () => {
    if (!form.prenom || !form.whatsapp) return;
    setLoading(true);
    try {
      await supabase.from("leads").insert([{ prenom: form.prenom, whatsapp: form.whatsapp, email: form.email || null, source: "exit_intent" }]);
    } catch (e) { console.error(e); }
    setLoading(false);
    setDone(true);
  };

  if (!show) return null;
  const inp = { border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 15, outline: "none", width: "100%", background: C.card };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={() => setShow(false)}>
      <div style={{ background: C.bg, borderRadius: 28, padding: 32, maxWidth: 400, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,.25)", position: "relative" }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShow(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.muted }}>×</button>
        {done ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 36 }}>✨</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark, marginTop: 8 }}>C'est parti !</h3>
            <p style={{ color: C.muted, marginTop: 8 }}>Ton guide arrive bientôt sur WhatsApp.</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <p style={{ fontSize: 32 }}>🎁</p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark, marginTop: 8 }}>Attends ! Un cadeau pour toi</h3>
              <p style={{ color: C.muted, fontSize: 14, marginTop: 8 }}>Reçois gratuitement le Guide Ventre Plat + un accès anticipé.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input placeholder="Prénom *" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} style={inp} />
              <input placeholder="WhatsApp *" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} style={inp} />
              <input placeholder="Email (optionnel)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inp} />
              <CTAButton onClick={submit} full>{loading ? "Envoi..." : "Recevoir mon guide"}</CTAButton>
              <Micro>Aucun spam. Tes infos restent privées.</Micro>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function BodyCurveLanding() {
  const promo = usePromoState();
  const [quizDone, setQuizDone] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState(null);

  const scrollPricing = () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'Inter', 'Manrope', -apple-system, sans-serif", color: C.text, background: C.bg, overflowX: "hidden", paddingBottom: 70 }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 2px ${C.cta}44,0 8px 32px ${C.cta}18} 50%{box-shadow:0 0 0 4px ${C.cta}66,0 8px 40px ${C.cta}33} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation-duration:0.01ms !important;transition-duration:0.01ms !important; } }
        * { box-sizing:border-box; margin:0; }
        html { scroll-behavior:smooth; }
        img { max-width:100%; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background: `${C.bg}ee`, backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 700, padding: "12px 20px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.cta, fontStyle: "italic", fontWeight: 600 }}>Bodycurve</p>
          <CTAButton onClick={handlePayment} small>S'inscrire</CTAButton>
        </div>
      </header>

      {/* ══ SECTION 1 — HERO ══ */}
      <SectionWrap id="hero" bg={`linear-gradient(180deg, ${C.peach}18, ${C.bg})`} style={{ paddingTop: 72 }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ display: "inline-block", background: `${C.cta}12`, color: C.cta, borderRadius: 99, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            🔥 {CONFIG.SPOTS_LEFT} places restantes sur {CONFIG.SPOTS_TOTAL}
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,7vw,56px)", color: C.dark, lineHeight: 1.15, margin: "0 0 16px" }}>
            21 jours pour <span style={{ color: C.cta }}>transformer</span> ton corps
          </h1>
          <p style={{ color: C.muted, fontSize: "clamp(16px,3vw,20px)", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 28px" }}>
            Le programme de remise en forme pensé pour les femmes qui veulent des résultats vrais — sans se perdre dans des régimes épuisants.
          </p>
          <div style={{ marginBottom: 28 }}>
            <PromoCountdownCapsule promo={promo} />
          </div>
          <CTAButton onClick={handlePayment}>
            {promo.active ? `Je commence pour ${formatFCFA(CONFIG.PRICES.promo)} 🔥` : "Je rejoins le challenge"}
          </CTAButton>
          <Micro>Paiement sécurisé · Orange Money · MTN Money · CB</Micro>
        </div>
        <div style={{ marginTop: 36 }}>
          <ImgPlaceholder label="Photo Coach Marie N'Dah" h={340} src={IMG_MIRROR} />
        </div>
      </SectionWrap>

      {/* ══ SECTION 2 — MIROIR ══ */}
      <SectionWrap bg={C.card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "center" }}>
          <ImgPlaceholder label="Photo miroir" h={280} src={IMG_MIRROR} />
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,4vw,30px)", color: C.dark, lineHeight: 1.3, margin: "0 0 16px" }}>
              Tu te regardes dans le miroir et tu n'aimes plus ce que tu vois.
            </h2>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              Tu n'es pas seule. Des milliers de femmes vivent la même frustration. Mais certaines ont trouvé la clé pour sortir de ce cycle.
            </p>
            <CTAButton onClick={scrollPricing} small>Je veux changer ça</CTAButton>
          </div>
        </div>
      </SectionWrap>

      {/* ══ SECTION 3 — RUPTURE ══ */}
      <SectionWrap bg={C.dark}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,5vw,36px)", color: "#fff", lineHeight: 1.3, margin: "0 0 24px" }}>
            Ce n'est pas un problème de <span style={{ color: C.peach }}>volonté</span>. C'est un problème de <span style={{ color: C.cta }}>méthode</span>.
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
            Les régimes draconiens, les heures de sport épuisant — tout ça ne marche pas. Parce que ce n'est pas fait pour toi.
          </p>
        </div>
      </SectionWrap>

      {/* ══ SECTION 4 — 3 PILIERS ══ */}
      <SectionWrap>
        <Heading center sub="Body Curve Challenge repose sur 3 piliers scientifiquement prouvés.">La méthode Marie N'Dah</Heading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 8 }}>
          {[
            ["🏋️", "Mouvement", "Des séances courtes (20–40 min) adaptées à ton niveau, sans matériel."],
            ["🥗", "Nutrition", "Pas de privation. Des choix simples et accessibles en Côte d'Ivoire."],
            ["🧠", "Mindset", "Le changement durable commence dans la tête. Marie t'accompagne chaque jour."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: C.card, borderRadius: 20, padding: 24, textAlign: "center", boxShadow: `0 2px 16px ${C.border}` }}>
              <span style={{ fontSize: 32 }}>{icon}</span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.dark, margin: "12px 0 8px" }}>{title}</h3>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </SectionWrap>

      {/* ══ SECTION 5 — BÉNÉFICES ══ */}
      <SectionWrap bg={`${C.peach}08`}>
        <Heading center>Ce que tu vas vivre en 21 jours</Heading>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["✨", "Un ventre plus plat et une silhouette sculptée"],
            ["💪", "Une énergie retrouvée dès la première semaine"],
            ["🌸", "Une confiance en toi que tu n'attendais plus"],
            ["👗", "Ces vêtements que tu n'osais plus mettre"],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", gap: 16, alignItems: "center", background: C.card, borderRadius: 16, padding: "16px 20px", boxShadow: `0 2px 12px ${C.border}` }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
              <p style={{ color: C.text, fontSize: 16, fontWeight: 500, lineHeight: 1.4 }}>{text}</p>
            </div>
          ))}
        </div>
      </SectionWrap>

      {/* ══ SECTION 6 — QUIZ ══ */}
      <SectionWrap bg={C.card}>
        <Heading center sub="Réponds à 3 questions pour découvrir ton profil de transformation.">Quel est ton profil ?</Heading>
        {quizDone ? (
          <QuizResult answers={quizAnswers} />
        ) : (
          <BodyGoalQuiz onComplete={(a) => { setQuizAnswers(a); setQuizDone(true); }} />
        )}
      </SectionWrap>

      {/* ══ SECTION 7 — AVANT / APRÈS ══ */}
      <SectionWrap>
        <Heading center sub="Fais glisser pour voir la transformation.">Elles l'ont fait. Toi aussi tu peux.</Heading>
        <BeforeAfterSlider />
        <p style={{ color: C.muted, fontSize: 13, textAlign: "center", marginTop: 12 }}>← Fais glisser →</p>
      </SectionWrap>

      {/* ══ SECTION 8 — TÉMOIGNAGES ══ */}
      <SectionWrap bg={C.card}>
        <Heading center sub="+300 femmes ont déjà rejoint Body Curve Challenge.">Elles témoignent</Heading>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {["/capture-whatsapp-1.jpeg", "/capture-whatsapp-2.jpeg", "/capture-whatsapp-3.jpeg"].map((src, i) => (
            <div key={i} style={{ borderRadius: 20, overflow: "hidden", boxShadow: `0 4px 20px ${C.border}` }}>
              <img src={src} alt={`Témoignage WhatsApp ${i + 1}`} style={{ width: "100%", display: "block", borderRadius: 20 }} />
            </div>
          ))}
        </div>
      </SectionWrap>

      {/* ══ SECTION 9 — PROJECTION ══ */}
      <SectionWrap bg={`linear-gradient(180deg, ${C.peach}10, ${C.bg})`}>
        <div style={{ textAlign: "center" }}>
          <Heading center>Dans 21 jours…</Heading>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420, margin: "0 auto 28px" }}>
            {["Tu te sentiras plus légère.", "Tu remettras des vêtements que tu évitais.", "Tu seras fière de toi — enfin."].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: `${C.cta}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✨</span>
                <p style={{ color: C.text, fontSize: 16, lineHeight: 1.5, textAlign: "left" }}>{t}</p>
              </div>
            ))}
          </div>
          <CTAButton onClick={handlePayment}>Je veux me retrouver</CTAButton>
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
            <CTAButton onClick={handlePayment}>Je profite de l'offre -80%</CTAButton>
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
        <CTAButton onClick={handlePayment} full style={{ maxWidth: 400, margin: "0 auto" }}>
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
      {CONFIG.AI_WIDGET_ENABLED && <AIChatBubble />}
    </div>
  );
}
