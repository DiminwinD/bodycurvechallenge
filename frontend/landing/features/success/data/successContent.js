export const COLORS = {
  bg:     "#FFF7F3",
  cta:    "#FF4D6D",
  dark:   "#0F0F12",
  muted:  "#6B6B76",
  card:   "#FFFFFF",
  border: "rgba(18,18,23,0.08)",
  green:  "#25D366",
};

export const CONTROL_FEATURES = [
  ["🎯", "Suivre ta progression semaine par semaine"],
  ["💪", "Rester motivée chaque jour du challenge"],
  ["🔔", "Recevoir des conseils et rappels personnalisés"],
  ["⭐", "Accéder aux fonctionnalités exclusives participantes"],
];

export const AMBASSADOR_ACTIVATION_BULLETS = [
  "inviter d'autres femmes à rejoindre le challenge",
  "débloquer des avantages exclusifs BodyCurve",
  "accéder à des réductions réservées aux ambassadrices",
  "suivre ta progression et les participantes que tu inspires",
];

// Phase 2 : remplacer par useAmbassadorCount() branché sur Supabase
export const AMBASSADOR_LIVE_COUNT = 287;

// Phase 2 : remplacer par useLeaderboard() branché sur Supabase
export const LEADERBOARD_TOP3 = [
  { rank: "🥇", name: "Marie N.",      count: 7 },
  { rank: "🥈", name: "Fatoumata D.", count: 5 },
  { rank: "🥉", name: "Aïcha K.",      count: 4 },
];
export const LEADERBOARD_PERSONAL_COUNT = 0;
export const LEADERBOARD_THRESHOLD      = 3;

export const ANIM_STEPS = [
  { delay: 900,  count: 1, bar: 33  },
  { delay: 1800, count: 2, bar: 66  },
  { delay: 2700, count: 3, bar: 100 },
  { delay: 3400, badge: true        },
  { delay: 4700, count: 0, bar: 0, badge: false, done: true },
];
