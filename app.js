// mind.exe V2.5 — two Coach-screen fixes. (1) Chat card layout: it had `minHeight` instead of a
// fixed `height`, so the card grew to fit the whole conversation instead of scrolling internally
// — pushed the input off-screen and blew past the bottom nav, exactly like the "стало резиновым"
// screenshot showed. Reverted to a fixed height (52vh, capped at 560px) plus `min-h-0` on the
// inner scroll div (a flexbox gotcha: a flex child needs min-h-0 for overflow-y-auto to actually
// clip instead of growing its parent). (2) DecodeText felt like lag, not an effect: it drove a
// requestAnimationFrame loop (60 ticks/sec) that rebuilt and re-rendered the *entire* string every
// frame for up to 1100ms, and — because revealMs (90-260ms) was large relative to the tiny
// per-char delay on long strings — most characters were mid-scramble simultaneously, i.e. the
// whole paragraph flickering at once rather than a left-to-right sweep, which is real jank on a
// phone with 10+ DecodeText instances live at once (title, labels, chips, messages...). Switched
// the tick loop from rAF to a slower ~55ms setTimeout cadence (fewer re-renders) and cut default
// maxTotalMs/revealMs roughly in half (900/260 -> 520/90), with the long-text call sites (analysis
// paragraph, AI chat replies, quick-question chips) tuned down to match. Net effect: a quick,
// calm settle instead of a sustained flicker.
// mind.exe V2.4 — pilot: text on the Coach screen no longer just fades in, it "decodes" — the
// full string renders immediately with every letter/digit scrambled to a random character from
// its own script (cyrillic stays cyrillic, digits stay digits, so width never jumps), then
// characters lock into their real value left-to-right over a capped ~0.5-1.1s regardless of
// string length. New shared DecodeText component (near LogoSpinner) drives this via
// requestAnimationFrame and respects prefers-reduced-motion. Applied to: the Coach title/
// subtitle, both card section labels, the Analyze button label, the analysis result paragraph
// (so a fresh AI insight visibly "decrypts" in), the scope-info line, the 6 quick-question
// chips, assistant chat replies (user messages stay plain — only AI output decodes), the
// disclaimer, and the status/model footer row. Card layout and colors unchanged. If this reads
// well, next step is rolling DecodeText out to the other screens.
// mind.exe V2.3 — bottom mobile nav bar geometry fixed: the active-tab highlight was positioned
// with percentages measured against the bar's padding box (p-1 on the same element as the grid),
// while the grid tracks themselves are sized against the content box (padding excluded) — a
// mismatch that grows with each column, so it was worst (visibly skewed/cut) on the rightmost
// tab (Settings). Fixed by moving the 4px inset from padding to margin on an inner wrapper: the
// highlight and the grid buttons now share that inner div as their coordinate system with zero
// padding on it, so percentage math for both matches exactly. Outer rounded shell also got
// overflow-hidden so nothing can visually poke past its rounded corners again.
// mind.exe V2.2 — Coach tab redesigned: header now has a subtitle line, the analysis card gained
// a small glowing accent orb + gradient "Analyze" button + a scope-info footer line, and the chat
// card shows a 2-column grid of tappable quick-question chips (Brain/Star/TrendingDown/Target/
// RotateCcw/LineChart icons) before the first message, which fire straight into sendMessage
// instead of requiring typing. Added a bottom status row (pulsing WIN-colored online dot +
// "Model: Gemini" badge) below the chat card. All colors stay on the existing cosmic BASE/accent
// palette — no new hues introduced. sendMessage now accepts an optional override string so the
// quick-question chips can bypass the input box.
// mind.exe V2.1 — splash-screen shimmer glow restored: the luminance mask baked for the new 16:9
// black hole photo had way too harsh a contrast curve (mean alpha ~4/255, only ~5% of pixels
// visible), so the animated light sweep across the ring was barely there. Rebuilt the mask with a
// gentler black point/gamma and a brightness boost (mean alpha now ~21/255) so the glow reads clearly
// on the loading screen again. (Also since V2.0, undocumented: App Check reCAPTCHA v3 site key wired
// in, black hole object-position retuned to 51%/48% to center the event horizon on mobile crops,
// CalendarView capped to max-w-md so it doesn't blow up on wide desktop, Settings' Section/
// SectionLabel hoisted out of the component body to fix a focus-loss-per-keystroke bug, and the Coach
// chat got a pulsing logo spinner + fade-in for replies instead of an abrupt pop-in.)
// mind.exe V2.0 — Gemini AI layer added via Firebase AI Logic (client SDK, Gemini Developer API
// backend — no Cloud Function, no Blaze billing plan needed). Bumped the Firebase JS SDK from
// 10.13.0 to 12.17.1 in index.html (required for the firebase/ai package to exist) and added
// firebase/ai + firebase/app-check imports. Replaced the old aiAnalyzeCallable Cloud Function
// (Anthropic-backed, deferred pending Blaze) with a direct Gemini call. New AI layer, organized as
// three logical modules within this file: aiContextBuilder (turns real analytics/journal data into
// a compact, privacy-safe JSON — no raw Firestore/user/auth data ever leaves the device), aiPrompts
// (fixed system instruction: no trading signals, no diagnoses, RR+WinRate read jointly, cites only
// given numbers), aiService (single Gemini call site + error handling). Coach tab now calls Gemini
// directly; requests only fire on explicit user action (Analyze button / Send), never on render, and
// the automatic insight is skipped entirely if the underlying stats hash hasn't changed since the
// last generated insight. AI_MODEL is the one place the model name lives (gemini-3.1-flash-lite —
// current free-tier fast/cheap model; 2.0/2.5 Flash & Flash-Lite are being retired through 2026).
// Two manual setup steps remain in the Firebase console (can't be done from code): 1) run through
// the "AI Logic" setup wizard once to enable the Gemini Developer API for this project (Spark plan
// is fine, no billing needed); 2) optionally create a reCAPTCHA v3 site key under App Check and
// paste it into AI_APP_CHECK_SITE_KEY before Nov 2, 2026, when Google starts enforcing App Check
// for Firebase AI Logic — until then the app works fine with it left blank.
// entry.jsx
import React2 from "react";
import { createRoot } from "react-dom/client";

// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
var firebaseConfig = {
  apiKey: "AIzaSyAPSGcQOPS09ytLKi8dk0WOh0U3WfLm4_E",
  authDomain: "mindexe-29adf.firebaseapp.com",
  projectId: "mindexe-29adf",
  storageBucket: "mindexe-29adf.firebasestorage.app",
  messagingSenderId: "448455109935",
  appId: "1:448455109935:web:46862c8d072ea6cb7505da",
  measurementId: "G-NJFS3KLKFN"
};
var firebaseApp = initializeApp(firebaseConfig);
var fbAuth = getAuth(firebaseApp);
var fbDb = getFirestore(firebaseApp);
// ai/config.js — single place that controls which Gemini model is used everywhere in the app.
// Gemini 2.0/2.5 Flash and Flash-Lite are being retired in 2026 (2.0 already shut down June 1,
// 2.5 shuts down Oct 16) — 3.1 Flash-Lite is the current cheap/fast free-tier model recommended
// as their replacement, so that's what's wired in by default. Swap the model by changing this one
// constant; nothing else in the file should hardcode a model name.
var AI_MODEL = "gemini-3.1-flash-lite";
// reCAPTCHA v3 site key for Firebase App Check (Web). Firebase AI Logic doesn't require App Check
// yet, but Google has announced enforcement starting Nov 2, 2026 — create a reCAPTCHA v3 key in the
// Firebase console (App Check section) and paste it here before that date. Left blank, App Check is
// simply skipped and the app (including AI features) keeps working exactly as it does today.
var AI_APP_CHECK_SITE_KEY = "6LebzJQtAAAAAAWWewd3EI6SbiY-xoTeAjRrmrNa";
if (AI_APP_CHECK_SITE_KEY) {
  try {
    initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaV3Provider(AI_APP_CHECK_SITE_KEY),
      isTokenAutoRefreshEnabled: true
    });
  } catch (_) {
  }
}
var aiLogic = getAI(firebaseApp, { backend: new GoogleAIBackend() });
function fsSanitizeKey(key) {
  return String(key).replace(/[\/]/g, "_");
}
function fsDocRef(key, shared) {
  const safeKey = fsSanitizeKey(key);
  if (shared) return doc(fbDb, "shared", safeKey);
  const uid = fbAuth.currentUser?.uid;
  if (!uid) return null;
  return doc(fbDb, "users", uid, "data", safeKey);
}

// mind-exe.tsx
import { useState, useMemo, useRef, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
  AreaChart,
  Area
} from "recharts";
import {
  Sparkles,
  BookOpen,
  NotebookText,
  LineChart as LineChartIcon,
  Settings as SettingsIcon,
  Flame,
  Search,
  Trash2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  X as XIcon,
  CalendarCheck,
  ShieldCheck,
  PenLine,
  TrendingUp,
  Volume2,
  VolumeX,
  Download,
  AlertTriangle,
  Plus,
  Wallet,
  ImagePlus,
  Gauge,
  Upload,
  Swords,
  Coins,
  Newspaper,
  User,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  Bot,
  Send,
  Brain,
  Star,
  TrendingDown,
  Target,
  RotateCcw,
  Zap,
  Info
} from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var BASE = {
  bg: "#0A0A0B",
  surface: "#131315",
  surface2: "#18181B",
  line: "#25252A",
  ink: "#F3F3F1",
  inkDim: "#8B8B90",
  inkFaint: "#4E4E54"
};
var WIN = "#5FAF96";
var LOSS = "#C4645A";
var FLAT = "#8B8B90";
var WARN = "#D9A24A";
var ACCENTS = [
  { name: "\u0411\u0438\u0440\u044E\u0437\u043E\u0432\u044B\u0439", value: "#2FD9BC", dim: "#175C4F" },
  { name: "\u042F\u043D\u0442\u0430\u0440\u043D\u044B\u0439", value: "#D9A24A", dim: "#5C441F" },
  { name: "\u0424\u0438\u043E\u043B\u0435\u0442\u043E\u0432\u044B\u0439", value: "#8C7FE0", dim: "#3C3570" },
  { name: "\u0420\u043E\u0437\u043E\u0432\u044B\u0439", value: "#E0708F", dim: "#5C2E3D" },
  { name: "\u041A\u043E\u0441\u043C\u043E\u0441", value: "#F5F5F7", dim: "#3A3A3E", cosmic: true }
];
var INSTRUMENTS = [
  { category: "\u041A\u0440\u0438\u043F\u0442\u043E", items: ["BTC/USD", "ETH/USD", "SOL/USD", "BNB/USD", "XRP/USD", "DOGE/USD", "TON/USD"] },
  { category: "\u0410\u043A\u0446\u0438\u0438", items: ["AAPL", "TSLA", "NVDA", "AMZN", "MSFT", "GOOGL", "META", "NFLX"] },
  { category: "\u0424\u043E\u0440\u0435\u043A\u0441", items: ["EUR/USD", "GBP/USD", "USD/JPY", "GBP/JPY", "USD/CHF", "AUD/USD", "USD/CAD"] },
  { category: "\u0418\u043D\u0434\u0435\u043A\u0441\u044B \u0438 \u0441\u044B\u0440\u044C\u0451", items: ["XAU/USD", "XAG/USD", "NAS100", "SPX500", "US30", "USOIL"] }
];
var SETUP_TAGS = ["\u041F\u0440\u043E\u0431\u043E\u0439", "\u0420\u0430\u0437\u0432\u043E\u0440\u043E\u0442", "\u0420\u0435\u0432\u0430\u043D\u0448", "\u0422\u0440\u0435\u043D\u0434", "\u0424\u043B\u044D\u0442", "\u041D\u043E\u0432\u043E\u0441\u0442\u0438", "\u0418\u043C\u043F\u0443\u043B\u044C\u0441", "\u041E\u0442\u0431\u043E\u0439 \u0443\u0440\u043E\u0432\u043D\u044F", "\u0421\u043A\u0430\u043B\u044C\u043F", "\u0423\u0441\u0440\u0435\u0434\u043D\u0435\u043D\u0438\u0435"];
var OUTCOME_LABEL = { Win: "\u041F\u0440\u0438\u0431\u044B\u043B\u044C", Loss: "\u0423\u0431\u044B\u0442\u043E\u043A", Breakeven: "\u0412 \u043D\u043E\u043B\u044C", All: "\u0412\u0441\u0435" };
var DIRECTION_LABEL = { Long: "\u041B\u043E\u043D\u0433", Short: "\u0428\u043E\u0440\u0442" };
var STRINGS = {
  ru: {
    nav: { home: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F", new: "\u0414\u043D\u0435\u0432\u043D\u0438\u043A", log: "\u0417\u0430\u043C\u0435\u0442\u043A\u0438", patterns: "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430", simulator: "\u0418\u0433\u0440\u0430", challenge: "\u0427\u0435\u043B\u043B\u0435\u043D\u0434\u0436", coach: "\u041A\u043E\u0443\u0447", settings: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" },
    coach: {
      title: "\u0418\u0418-\u043A\u043E\u0443\u0447",
      subtitle: "\u0422\u0432\u043E\u0439 \u043B\u0438\u0447\u043D\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A. \u041F\u043E\u043D\u0438\u043C\u0430\u0435\u0442 \u0442\u0432\u043E\u0439 \u0441\u0442\u0438\u043B\u044C \u0442\u043E\u0440\u0433\u043E\u0432\u043B\u0438.",
      analyzeTitle: "\u0410\u043D\u0430\u043B\u0438\u0437 \u0434\u043D\u0435\u0432\u043D\u0438\u043A\u0430",
      analyzeDesc: "\u0418\u0418 \u043F\u0440\u043E\u0430\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0435\u0442 \u0442\u0432\u043E\u0439 \u0436\u0443\u0440\u043D\u0430\u043B \u0438 \u043D\u0430\u0439\u0434\u0451\u0442 \u0432\u0430\u0436\u043D\u044B\u0435 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u044B, \u0441\u0438\u043B\u044C\u043D\u044B\u0435 \u0438 \u0441\u043B\u0430\u0431\u044B\u0435 \u0441\u0442\u043E\u0440\u043E\u043D\u044B.",
      analyzeScopeInfo: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0435\u043C \u0432\u0435\u0441\u044C \u0434\u043D\u0435\u0432\u043D\u0438\u043A \u0438 \u043D\u0430\u0439\u0434\u0435\u043D\u043D\u044B\u0435 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u044B",
      analyzeBtn: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
      analyzeBusy: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E\u2026",
      analyzeEmpty: "\u041D\u0430\u0436\u043C\u0438 \u00AB\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u00BB, \u0447\u0442\u043E\u0431\u044B \u0418\u0418 \u0440\u0430\u0437\u043E\u0431\u0440\u0430\u043B \u0442\u0432\u043E\u0439 \u0434\u043D\u0435\u0432\u043D\u0438\u043A.",
      analyzeNoEntries: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u043E\u0431\u0430\u0432\u044C \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0432 \u0434\u043D\u0435\u0432\u043D\u0438\u043A.",
      chatTitle: "\u0421\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u0418\u0418-\u043A\u043E\u0443\u0447\u0430",
      chatDesc: "\u0417\u0430\u0434\u0430\u0439 \u043B\u044E\u0431\u043E\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u043F\u0440\u043E \u0441\u0432\u043E\u0438 \u0441\u0434\u0435\u043B\u043A\u0438, \u043F\u0441\u0438\u0445\u043E\u043B\u043E\u0433\u0438\u044E \u0438\u043B\u0438 \u0442\u043E\u0440\u0433\u043E\u0432\u043B\u044E \u0432 \u0446\u0435\u043B\u043E\u043C.",
      chatPlaceholder: "\u041D\u0430\u043F\u0438\u0448\u0438 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435\u2026",
      chatEmpty: "\u0421\u043F\u0440\u043E\u0441\u0438 \u043F\u0440\u043E \u0441\u0432\u043E\u0438 \u0441\u0434\u0435\u043B\u043A\u0438, \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u044B \u0438\u043B\u0438 \u043F\u0441\u0438\u0445\u043E\u043B\u043E\u0433\u0438\u044E \u0442\u043E\u0440\u0433\u043E\u0432\u043B\u0438.",
      quick: {
        lateCloses: "\u041F\u043E\u0447\u0435\u043C\u0443 \u044F \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u044E \u0441\u0434\u0435\u043B\u043A\u0438 \u0440\u0430\u043D\u044C\u0448\u0435?",
        strengths: "\u041C\u043E\u0438 \u0441\u0438\u043B\u044C\u043D\u044B\u0435 \u0441\u0442\u043E\u0440\u043E\u043D\u044B",
        losses: "\u041F\u043E\u0447\u0435\u043C\u0443 \u044F \u0432 \u0443\u0431\u044B\u0442\u043A\u0435?",
        discipline: "\u041A\u0430\u043A \u0443\u043B\u0443\u0447\u0448\u0438\u0442\u044C \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0443?",
        strategy: "\u0421\u0442\u043E\u0438\u0442 \u043B\u0438 \u043C\u0435\u043D\u044F\u0442\u044C \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044E?",
        style: "\u041A\u0430\u043A\u043E\u0439 \u0443 \u043C\u0435\u043D\u044F \u0441\u0442\u0438\u043B\u044C \u0442\u043E\u0440\u0433\u043E\u0432\u043B\u0438?"
      },
      disclaimer: "\u0418\u0418 \u043D\u0435 \u0434\u0430\u0451\u0442 \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u044B\u0445 \u0441\u043E\u0432\u0435\u0442\u043E\u0432. \u0422\u043E\u043B\u044C\u043A\u043E \u0430\u043D\u0430\u043B\u0438\u0437 \u0438 \u043D\u0430\u0431\u043B\u044E\u0434\u0435\u043D\u0438\u044F.",
      statusReady: "\u0413\u043E\u0442\u043E\u0432 \u043F\u043E\u043C\u043E\u0447\u044C",
      statusOnline: "\u0418\u0418-\u043A\u043E\u0443\u0447 \u043E\u043D\u043B\u0430\u0439\u043D",
      modelLabel: "\u041C\u043E\u0434\u0435\u043B\u044C: Gemini",
      send: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",
      error: "\u0418\u0418 \u0441\u0435\u0439\u0447\u0430\u0441 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0451 \u0440\u0430\u0437."
    },
    home: {
      welcomeBack: (name) => `\u0421 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u0438\u0435\u043C, ${name}`,
      defaultName: "\u041E\u043F\u0435\u0440\u0430\u0442\u043E\u0440",
      subtitle: "\u0422\u0435\u0431\u044F \u0436\u0434\u0451\u0442 \u044F\u0441\u043D\u043E\u0441\u0442\u044C.",
      capital: "\u041A\u0430\u043F\u0438\u0442\u0430\u043B",
      totalResult: "\u041E\u0431\u0449\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442",
      sinceStart: "\u0441 \u043D\u0430\u0447\u0430\u043B\u0430",
      calibrationToday: (pct) => `\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F: ${pct}%`,
      calibrationCta: "\u041F\u0440\u043E\u0439\u0442\u0438 \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0443 \u043F\u0435\u0440\u0435\u0434 \u0441\u0435\u0441\u0441\u0438\u0435\u0439",
      insight: "\u0418\u043D\u0441\u0430\u0439\u0442",
      moodPrefix: "\u041D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435 \u0440\u044B\u043D\u043A\u0430: ",
      insightConfident: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442, \u0447\u0442\u043E \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u043E\u043A\u0443\u043F\u0430\u0435\u0442\u0441\u044F \u2014 \u0434\u0435\u0440\u0436\u0438 \u043E\u0431\u044A\u0451\u043C \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u043C.",
      insightFocus: "\u0421\u0444\u043E\u043A\u0443\u0441\u0438\u0440\u0443\u0439\u0441\u044F \u043D\u0430 \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u0438. \u0414\u043E\u0431\u0430\u0432\u044C \u0435\u0449\u0451 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0441\u0434\u0435\u043B\u043E\u043A, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u044F\u0432\u0438\u043B\u0441\u044F \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0442\u0442\u0435\u0440\u043D.",
      moodCalm: "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u043E\u0435",
      moodStable: "\u0421\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0435",
      moodReactive: "\u0420\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0435",
      traderLevel: "\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0442\u0440\u0435\u0439\u0434\u0435\u0440\u0430",
      awareness: "\u041E\u0441\u043E\u0437\u043D\u0430\u043D\u043D\u043E\u0441\u0442\u044C",
      reflection: "\u0420\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u044F",
      discipline: "\u0414\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430",
      riskStability: "\u0421\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0440\u0438\u0441\u043A\u0430",
      calibrationTodayShort: "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F",
      newEntryTile: "\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C",
      logTile: "\u0417\u0430\u043C\u0435\u0442\u043A\u0438",
      patternsTile: "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430",
      simulatorTile: "\u0418\u0433\u0440\u0430",
      market: "\u0420\u044B\u043D\u043E\u043A",
      streakDays: (n) => `${n} \u0434\u043D. \u043F\u043E\u0434\u0440\u044F\u0434`,
      startStreak: "\u041D\u0430\u0447\u043D\u0438 \u0441\u0435\u0440\u0438\u044E"
    },
    newEntry: {
      title: "\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C",
      instrument: "\u0418\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442",
      pickOrAdd: "\u0412\u044B\u0431\u0435\u0440\u0438 \u0438\u043B\u0438 \u0434\u043E\u0431\u0430\u0432\u044C",
      setupType: "\u0422\u0438\u043F \u0441\u0435\u0442\u0430\u043F\u0430",
      result: (unit) => `\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 (${unit})`,
      direction: "\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435",
      entry: "\u0412\u0445\u043E\u0434",
      exit: "\u0412\u044B\u0445\u043E\u0434",
      outcome: "\u0418\u0441\u0445\u043E\u0434",
      screenshots: (max) => `\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B \u0433\u0440\u0430\u0444\u0438\u043A\u0430 (\u0434\u043E ${max})`,
      pullQuestion: "\u0427\u0442\u043E \u0437\u0430\u0442\u044F\u043D\u0443\u043B\u043E \u0442\u0435\u0431\u044F \u0432 \u044D\u0442\u0443 \u0441\u0434\u0435\u043B\u043A\u0443?",
      pullPlaceholder: "\u0427\u0435\u0441\u0442\u043D\u043E, \u0430 \u043D\u0435 \u043A\u0440\u0430\u0441\u0438\u0432\u043E.",
      lessonQuestion: "\u0427\u0442\u043E \u0431\u044B \u0442\u044B \u0441\u043A\u0430\u0437\u0430\u043B \u0441\u0435\u0431\u0435 \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437?",
      lessonPlaceholder: "\u041E\u0434\u043D\u0430 \u0444\u0440\u0430\u0437\u0430, \u043A\u043E\u0442\u043E\u0440\u0443\u044E \u0442\u044B \u043F\u0440\u0430\u0432\u0434\u0430 \u0437\u0430\u043F\u043E\u043C\u043D\u0438\u0448\u044C.",
      emotionQuestion: "\u0427\u0442\u043E \u0442\u044B \u0447\u0443\u0432\u0441\u0442\u0432\u043E\u0432\u0430\u043B \u0432 \u043C\u043E\u043C\u0435\u043D\u0442 \u0432\u0445\u043E\u0434\u0430 \u0432 \u0441\u0434\u0435\u043B\u043A\u0443?",
      save: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C"
    },
    log: {
      title: "\u0416\u0443\u0440\u043D\u0430\u043B \u0441\u0434\u0435\u043B\u043E\u043A",
      totalTrades: "\u0412\u0441\u0435\u0433\u043E \u0441\u0434\u0435\u043B\u043E\u043A",
      profitable: "\u041F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0445",
      searchPlaceholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u2026",
      filters: { All: "\u0412\u0441\u0435", Win: "\u041F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0435", Loss: "\u0423\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435", Long: "\u041B\u043E\u043D\u0433", Short: "\u0428\u043E\u0440\u0442" },
      empty: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0434\u0440\u0443\u0433\u043E\u0439 \u0444\u0438\u043B\u044C\u0442\u0440.",
      colEntry: "\u0412\u0445\u043E\u0434",
      colExit: "\u0412\u044B\u0445\u043E\u0434",
      colRR: "R/R",
      colResult: "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442"
    },
    settings: {
      title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
      language: "\u042F\u0437\u044B\u043A \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F",
      languageNote: "\u041C\u0435\u043D\u044F\u0435\u0442 \u044F\u0437\u044B\u043A \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430. \u0417\u0430\u043F\u0438\u0441\u0438 \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 \u043E\u0441\u0442\u0430\u043D\u0443\u0442\u0441\u044F \u0442\u0430\u043A\u0438\u043C\u0438, \u043A\u0430\u043A \u0442\u044B \u0438\u0445 \u043D\u0430\u043F\u0438\u0441\u0430\u043B.",
      russian: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
      english: "English",
      account: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442",
      logout: "\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430",
      localAccountNote: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0447\u0435\u0440\u0435\u0437 \u043E\u0431\u043B\u0430\u043A\u043E \u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0441 \u043B\u044E\u0431\u043E\u0433\u043E \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u043F\u043E\u0441\u043B\u0435 \u0432\u0445\u043E\u0434\u0430.",
      operatorName: "\u0418\u043C\u044F \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440\u0430",
      operatorPlaceholder: "\u041E\u043F\u0435\u0440\u0430\u0442\u043E\u0440",
      accentColor: "\u0410\u043A\u0446\u0435\u043D\u0442\u043D\u044B\u0439 \u0446\u0432\u0435\u0442",
      resultUnits: "\u0415\u0434\u0438\u043D\u0438\u0446\u044B \u0438\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u044F \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430",
      rMultiplier: "R-\u043C\u0443\u043B\u044C\u0442\u0438\u043F\u043B\u0438\u043A\u0430\u0442\u043E\u0440",
      currencyLabel: "\u0412\u0430\u043B\u044E\u0442\u0430",
      startingCapital: "\u041D\u0430\u0447\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B",
      weeklyGoalLabel: "\u041D\u0435\u0434\u0435\u043B\u044C\u043D\u0430\u044F \u0446\u0435\u043B\u044C \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u0438",
      weeklyGoalNote: "\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0434\u043D\u0435\u0439 \u0432 \u043D\u0435\u0434\u0435\u043B\u044E \u043D\u0443\u0436\u043D\u043E \u0432\u0435\u0441\u0442\u0438 \u0436\u0443\u0440\u043D\u0430\u043B \u0434\u043B\u044F \u0447\u0435\u043B\u043B\u0435\u043D\u0434\u0436\u0430 \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u0438.",
      daysSuffix: "\u0434\u043D\u0435\u0439",
      sound: "\u0417\u0432\u0443\u043A",
      soundToggleLabel: "\u0417\u0432\u0443\u043A \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438 \u0437\u0430\u043F\u0438\u0441\u0438",
      data: "\u0414\u0430\u043D\u043D\u044B\u0435",
      dataNote: "\u0412\u0441\u0451 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435 (\u0438\u043B\u0438 \u0432 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0435, \u0435\u0441\u043B\u0438 \u0442\u044B \u0432\u043E\u0448\u0451\u043B). \u041F\u043E\u043B\u043D\u044B\u0439 \u0431\u044D\u043A\u0430\u043F \u2014 \u043D\u0430 \u0441\u043B\u0443\u0447\u0430\u0439 \u0441\u043C\u0435\u043D\u044B \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u0438\u043B\u0438 \u043D\u0430 \u0432\u0441\u044F\u043A\u0438\u0439 \u0441\u043B\u0443\u0447\u0430\u0439.",
      fullBackup: "\u041F\u043E\u043B\u043D\u044B\u0439 \u0431\u044D\u043A\u0430\u043F (.json)",
      restoreBackup: "\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0438\u0437 \u0431\u044D\u043A\u0430\u043F\u0430 (.json)",
      exportJournalOnly: "\u042D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0436\u0443\u0440\u043D\u0430\u043B (.json)",
      importJournalOnly: "\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0436\u0443\u0440\u043D\u0430\u043B (.json)",
      confirmClearJournal: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0432\u0441\u0435 \u0437\u0430\u043F\u0438\u0441\u0438 \u0431\u0435\u0437 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u043E\u0442\u043C\u0435\u043D\u044B?",
      yes: "\u0414\u0430",
      cancel: "\u041E\u0442\u043C\u0435\u043D\u0430",
      clearJournal: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0436\u0443\u0440\u043D\u0430\u043B",
      fullResetTitle: "\u041F\u043E\u043B\u043D\u044B\u0439 \u0441\u0431\u0440\u043E\u0441",
      fullResetNote: "\u0421\u0442\u0438\u0440\u0430\u0435\u0442 \u0436\u0443\u0440\u043D\u0430\u043B, \u0432\u0441\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438, \u0441\u0432\u043E\u0438 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B, \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0438 \u0438 \u043A\u043E\u0448\u0435\u043B\u0451\u043A MindCoin \u2014 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043A \u043F\u0435\u0440\u0432\u043E\u043C\u0443 \u0437\u0430\u043F\u0443\u0441\u043A\u0443.",
      confirmFullReset: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u043E\u043E\u0431\u0449\u0435 \u0432\u0441\u0451?",
      yesReset: "\u0414\u0430, \u0441\u0431\u0440\u043E\u0441\u0438\u0442\u044C",
      fullResetButton: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u0441\u0451 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435",
      footerNote: "\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B \u0441\u0434\u0435\u043B\u043E\u043A \u0445\u0440\u0430\u043D\u044F\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u044D\u0442\u043E\u0439 \u0441\u0435\u0441\u0441\u0438\u0438 \u0438 \u043D\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F \u043C\u0435\u0436\u0434\u0443 \u0432\u0438\u0437\u0438\u0442\u0430\u043C\u0438. \u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0438 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0441 \u0431\u0440\u043E\u043A\u0435\u0440\u043E\u043C \u043F\u043E\u043A\u0430 \u043D\u0435 \u0440\u0435\u0430\u043B\u0438\u0437\u043E\u0432\u0430\u043D\u044B."
    },
    challenge: {
      title: "\u0427\u0435\u043B\u043B\u0435\u043D\u0434\u0436",
      daysInARow: "\u0434\u043D\u0435\u0439 \u043F\u043E\u0434\u0440\u044F\u0434",
      weeklyConsistency: "\u041D\u0435\u0434\u0435\u043B\u044C\u043D\u0430\u044F \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u044C",
      weeklyConsistencyDesc: (goal) => `\u0412\u0435\u0434\u0438 \u0436\u0443\u0440\u043D\u0430\u043B ${goal} \u0438\u0437 7 \u0434\u043D\u0435\u0439 \u044D\u0442\u043E\u0439 \u043D\u0435\u0434\u0435\u043B\u0438.`,
      thisWeek: "\u042D\u0442\u0430 \u043D\u0435\u0434\u0435\u043B\u044F",
      footer: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u044C \u0432\u0430\u0436\u043D\u0435\u0435 \u043B\u044E\u0431\u043E\u0439 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438. \u0421\u0435\u0440\u0438\u044F \u2014 \u044D\u0442\u043E \u043D\u0435 \u043F\u0440\u043E \u043F\u043E\u0431\u0435\u0434\u044B, \u0430 \u043F\u0440\u043E \u0442\u043E, \u0447\u0442\u043E\u0431\u044B \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0442\u044C\u0441\u044F \u043A \u0441\u0435\u0431\u0435 \u0434\u0430\u0436\u0435 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430."
    },
    calibration: {
      heading: "\u041A\u0410\u041B\u0418\u0411\u0420\u041E\u0412\u041A\u0410",
      subtitle: "\u041E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C \u043A \u0442\u043E\u0440\u0433\u043E\u0432\u043E\u0439 \u0441\u0435\u0441\u0441\u0438\u0438.",
      intro: "\u042D\u0442\u043E \u0437\u0430\u0439\u043C\u0451\u0442 \u043C\u0435\u043D\u0435\u0435 30 \u0441\u0435\u043A\u0443\u043D\u0434. \u041E\u0442\u0432\u0435\u0447\u0430\u0439\u0442\u0435 \u0447\u0435\u0441\u0442\u043D\u043E. \u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u0430\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0435\u0442 \u043D\u0435 \u0440\u044B\u043D\u043E\u043A, \u0430 \u0432\u0430\u0448\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435.",
      start: "\u041D\u0430\u0447\u0430\u0442\u044C",
      questionOf: (i, total) => `\u0412\u043E\u043F\u0440\u043E\u0441 ${i} \u0438\u0437 ${total}`,
      cancel: "\u041E\u0442\u043C\u0435\u043D\u0430",
      mainRiskFactor: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0444\u0430\u043A\u0442\u043E\u0440 \u0440\u0438\u0441\u043A\u0430",
      whatInfluenced: "\u0427\u0442\u043E \u043F\u043E\u0432\u043B\u0438\u044F\u043B\u043E \u043D\u0430 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442",
      restart: "\u041F\u0440\u043E\u0439\u0442\u0438 \u0437\u0430\u043D\u043E\u0432\u043E"
    },
    pattern: {
      yourPattern: "\u0422\u0432\u043E\u0439 \u043F\u0430\u0442\u0442\u0435\u0440\u043D",
      strongSignal: "\u0421\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u0438\u0433\u043D\u0430\u043B",
      observedPattern: "\u041D\u0430\u0431\u043B\u044E\u0434\u0430\u0435\u043C\u044B\u0439 \u043F\u0430\u0442\u0442\u0435\u0440\u043D",
      someSigns: "\u0415\u0441\u0442\u044C \u043F\u0440\u0438\u0437\u043D\u0430\u043A\u0438",
      trades: (n) => `${n} ${pluralRu(n, "\u0441\u0434\u0435\u043B\u043A\u0430", "\u0441\u0434\u0435\u043B\u043A\u0438", "\u0441\u0434\u0435\u043B\u043E\u043A")}`,
      winShort: "win",
      avgShort: "\u0441\u0440.",
      breakdown: "\u0420\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C \u2192",
      strength: "\u0421\u0438\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430",
      noClearPattern: "\u042F\u0432\u043D\u043E\u0433\u043E \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0433\u043E \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u0430 \u043F\u043E\u043A\u0430 \u043D\u0435 \u0432\u0438\u0434\u043D\u043E \u2014 \u044D\u0442\u043E \u0442\u043E\u0436\u0435 \u043D\u0435\u043F\u043B\u043E\u0445\u043E\u0439 \u0437\u043D\u0430\u043A. \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0439 \u0432\u0435\u0441\u0442\u0438 \u0436\u0443\u0440\u043D\u0430\u043B, \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0441\u043B\u0435\u0434\u0438\u0442 \u0437\u0430 \u044D\u0442\u0438\u043C \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u043E.",
      buildingUp: (have, need) => `\u041F\u043E\u043A\u0430 \u0444\u043E\u0440\u043C\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u2014 ${have} / ${need}`,
      buildingUpDesc: "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0438\u0449\u0435\u0442 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0435\u0441\u044F \u0441\u0432\u044F\u0437\u0438 \u043C\u0435\u0436\u0434\u0443 \u0442\u0432\u043E\u0438\u043C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435\u043C \u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u043C \u2014 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u0437\u0430\u043F\u0438\u0441\u0438 \u0441 \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u043E\u0439 \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0439 \u0442\u043E\u0447\u043A\u043E\u0439.",
      detailTitle: "\u0422\u0432\u043E\u0439 \u043F\u0430\u0442\u0442\u0435\u0440\u043D",
      tradesLabel: "\u0421\u0434\u0435\u043B\u043E\u043A",
      winRateLabel: "Win rate",
      avgRLabel: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 R",
      comparison: "\u0421\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435",
      similarSituations: "\u041F\u043E\u0445\u043E\u0436\u0438\u0435 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438",
      otherTrades: "\u041E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438",
      whereOnMap: "\u0413\u0434\u0435 \u044D\u0442\u043E \u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u044D\u043C\u043E\u0446\u0438\u0439",
      fearToConfidence: "\u0421\u0442\u0440\u0430\u0445 \u2192 \u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C",
      nervousToCalm: "\u041D\u0430 \u043D\u0435\u0440\u0432\u0430\u0445 \u2192 \u0421\u043F\u043E\u043A\u043E\u0435\u043D",
      tradeExamples: "\u041F\u0440\u0438\u043C\u0435\u0440\u044B \u0441\u0434\u0435\u043B\u043E\u043A",
      whyShown: "\u041F\u043E\u0447\u0435\u043C\u0443 mind.exe \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u044D\u0442\u043E",
      whyShownText: (n, avgGroup, avgRest) => `${n} ${pluralRu(n, "\u0441\u0434\u0435\u043B\u043A\u0430 \u043F\u043E\u043F\u0430\u043B\u0430", "\u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u043F\u0430\u043B\u0438", "\u0441\u0434\u0435\u043B\u043E\u043A \u043F\u043E\u043F\u0430\u043B\u043E")} \u0432 \u044D\u0442\u0443 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E. \u0412 \u044D\u0442\u043E\u0439 \u0433\u0440\u0443\u043F\u043F\u0435 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0441\u043E\u0441\u0442\u0430\u0432\u0438\u043B ${avgGroup}, \u043F\u0440\u043E\u0442\u0438\u0432 ${avgRest} \u0443 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A.`,
      needMoreEntries: "\u0414\u043E\u0431\u0430\u0432\u044C \u0435\u0449\u0451 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0441\u0434\u0435\u043B\u043E\u043A \u0441 \u043E\u0431\u0435\u0438\u0445 \u0441\u0442\u043E\u0440\u043E\u043D \u2014 \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0445 \u0438 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u2014 \u0438 \u0437\u0434\u0435\u0441\u044C \u043D\u0430\u0447\u043D\u0451\u0442 \u043F\u0440\u043E\u044F\u0432\u043B\u044F\u0442\u044C\u0441\u044F \u043F\u0430\u0442\u0442\u0435\u0440\u043D.",
      noPatternYetLong: "\u042F\u0432\u043D\u043E\u0433\u043E \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0433\u043E \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u0430 \u043F\u043E\u043A\u0430 \u043D\u0435 \u0432\u0438\u0434\u043D\u043E \u2014 \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0435 \u0438 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u0440\u0438\u0445\u043E\u0434\u044F\u0442 \u0438\u0437 \u043F\u043E\u0445\u043E\u0436\u0438\u0445 \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0439. \u042D\u0442\u043E \u0441\u0430\u043C\u043E \u043F\u043E \u0441\u0435\u0431\u0435 \u0432\u0430\u0436\u043D\u043E \u0437\u0430\u043C\u0435\u0442\u0438\u0442\u044C.",
      accumulating: (n) => `\u041F\u043E\u043A\u0430 \u043D\u0430\u043A\u0430\u043F\u043B\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B \u0434\u043B\u044F \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u044B\u0445 \u0432\u044B\u0432\u043E\u0434\u043E\u0432 (\u043D\u0443\u0436\u043D\u043E \u0435\u0449\u0451 ${n} \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0441 \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0439 \u0442\u043E\u0447\u043A\u043E\u0439) \u2014 \u043D\u043E \u0443\u0436\u0435 \u0432\u0438\u0434\u043D\u043E, \u0447\u0442\u043E \u0436\u0443\u0440\u043D\u0430\u043B \u0432\u0435\u0434\u0451\u0442\u0441\u044F \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E, \u0438 \u044D\u0442\u043E \u0433\u043B\u0430\u0432\u043D\u043E\u0435.`
    },
    review: {
      heading: "\u0420\u0410\u0417\u0411\u041E\u0420",
      notEnough: "\u041F\u043E\u043A\u0430 \u043C\u0430\u043B\u043E\u0432\u0430\u0442\u043E \u0437\u0430\u043F\u0438\u0441\u0435\u0439, \u0447\u0442\u043E\u0431\u044B \u0432\u044B\u0434\u0435\u043B\u0438\u0442\u044C \u0432 \u043D\u0438\u0445 \u0437\u0430\u043A\u043E\u043D\u043E\u043C\u0435\u0440\u043D\u043E\u0441\u0442\u0438. \u0414\u043E\u0431\u0430\u0432\u044C \u0435\u0449\u0451 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0441\u0434\u0435\u043B\u043E\u043A \u2014 \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0445 \u0438 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u2014 \u0438 \u0440\u0430\u0437\u0431\u043E\u0440 \u0441\u0442\u0430\u043D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D.",
      back: "\u041D\u0430\u0437\u0430\u0434",
      questionsCount: (n) => `${n} ${pluralRu(n, "\u0432\u043E\u043F\u0440\u043E\u0441", "\u0432\u043E\u043F\u0440\u043E\u0441\u0430", "\u0432\u043E\u043F\u0440\u043E\u0441\u043E\u0432")} \u043F\u043E \u0442\u043E\u043C\u0443, \u0447\u0442\u043E \u0443\u0436\u0435 \u0432\u0438\u0434\u043D\u043E \u0432 \u0442\u0432\u043E\u0451\u043C \u0436\u0443\u0440\u043D\u0430\u043B\u0435.`,
      intro: "\u042D\u0442\u043E \u043D\u0435 \u043F\u0440\u043E \u0440\u044B\u043D\u043E\u043A \u0438 \u043D\u0435 \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u044B\u0439 \u0441\u043E\u0432\u0435\u0442 \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435, \u0432 \u043A\u043E\u0442\u043E\u0440\u043E\u043C \u0442\u044B \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0435\u0448\u044C \u0440\u0435\u0448\u0435\u043D\u0438\u044F. \u041E\u0442\u0432\u0435\u0447\u0430\u0439 \u0447\u0435\u0441\u0442\u043D\u043E, \u0437\u0434\u0435\u0441\u044C \u043D\u0435\u043A\u043E\u043C\u0443 \u043F\u043E\u043D\u0440\u0430\u0432\u0438\u0442\u044C\u0441\u044F.",
      questionsAnswered: (total, dataDriven) => `${total} ${pluralRu(total, "\u0432\u043E\u043F\u0440\u043E\u0441", "\u0432\u043E\u043F\u0440\u043E\u0441\u0430", "\u0432\u043E\u043F\u0440\u043E\u0441\u043E\u0432")}${dataDriven > 0 ? `, \u0438\u0437 \u043D\u0438\u0445 ${dataDriven} \u2014 \u043F\u043E \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u043C \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u0430\u043C \u0438\u0437 \u0436\u0443\u0440\u043D\u0430\u043B\u0430` : ""}`,
      startHere: "\u041D\u0430\u0447\u043D\u0438 \u0441 \u044D\u0442\u043E\u0433\u043E",
      alsoWorthNoting: "\u0415\u0449\u0451 \u0441\u0442\u043E\u0438\u0442 \u043E\u0431\u0440\u0430\u0442\u0438\u0442\u044C \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435",
      looksFine: "\u0422\u0443\u0442 \u0432\u0440\u043E\u0434\u0435 \u043F\u043E\u0440\u044F\u0434\u043E\u043A",
      disclaimer: "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u043F\u0441\u0438\u0445\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0435, \u043D\u0435 \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u044B\u0435 \u2014 \u043E\u043D\u0438 \u043D\u0435 \u043F\u0440\u043E \u0442\u043E, \u0447\u0442\u043E \u0442\u043E\u0440\u0433\u043E\u0432\u0430\u0442\u044C, \u0430 \u043F\u0440\u043E \u0442\u043E, \u043A\u0430\u043A \u0442\u044B \u044D\u0442\u043E \u0434\u0435\u043B\u0430\u0435\u0448\u044C.",
      done: "\u0413\u043E\u0442\u043E\u0432\u043E"
    },
    sim: {
      heading: "\u0421\u0418\u041C\u0423\u041B\u042F\u0422\u041E\u0420 \u0420\u042B\u041D\u041A\u0410",
      subtitle: "\u0418\u0441\u043A\u0443\u0441\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0440\u044B\u043D\u043E\u043A. \u0420\u0435\u0430\u043B\u044C\u043D\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F.",
      terminal: "\u0422\u0435\u0440\u043C\u0438\u043D\u0430\u043B",
      beta: "Beta",
      introText: "\u0420\u0430\u0434\u0430\u0440 \u043A\u0440\u0443\u043F\u043D\u044B\u0445 \u0437\u0430\u044F\u0432\u043E\u043A, \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u0438 \u043F\u043B\u0435\u0447\u043E \u0434\u043E x50. \u0420\u044B\u043D\u043E\u043A \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0443\u0436\u0435 \xAB\u0432 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0435\xBB \u2014 \u0441 \u0438\u0441\u0442\u043E\u0440\u0438\u0435\u0439 \u043D\u0430 \u0433\u0440\u0430\u0444\u0438\u043A\u0435 \u2014 \u0438 \u0432\u0435\u0434\u0451\u0442 \u0441\u0435\u0431\u044F \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u0432\u0430\u0448\u0438\u0445 \u0441\u0434\u0435\u043B\u043E\u043A.",
      startSession: "\u041D\u0430\u0447\u0430\u0442\u044C \u0441\u0435\u0441\u0441\u0438\u044E",
      capital: "\u041A\u0430\u043F\u0438\u0442\u0430\u043B",
      price: "\u0426\u0435\u043D\u0430",
      reacting: "\u0440\u0435\u0430\u043A\u0446\u0438\u044F\u2026",
      positionLiquidated: "\u041F\u043E\u0437\u0438\u0446\u0438\u044F \u043B\u0438\u043A\u0432\u0438\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u0430",
      takeProfitHit: "Take-profit \u0441\u0440\u0430\u0431\u043E\u0442\u0430\u043B",
      stopLossHit: "Stop-loss \u0441\u0440\u0430\u0431\u043E\u0442\u0430\u043B",
      long: "\u041B\u043E\u043D\u0433",
      short: "\u0428\u043E\u0440\u0442",
      entry: "\u0432\u0445\u043E\u0434",
      margin: "\u041C\u0430\u0440\u0436\u0430",
      liq: "\u043B\u0438\u043A\u0432.",
      add: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
      closePosition: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0437\u0438\u0446\u0438\u044E",
      volume: "\u043E\u0431\u044A\u0451\u043C",
      sessionOver: "\u0421\u0415\u0421\u0421\u0418\u042F \u0417\u0410\u0412\u0415\u0420\u0428\u0415\u041D\u0410",
      finalCapital: "\u041A\u0430\u043F\u0438\u0442\u0430\u043B",
      beatMarket: "\u041F\u043E\u0431\u0435\u0434\u0430 \u043D\u0430\u0434 \u0440\u044B\u043D\u043A\u043E\u043C.",
      lostToMarket: "\u0420\u044B\u043D\u043E\u043A \u043E\u043A\u0430\u0437\u0430\u043B\u0441\u044F \u0441\u0438\u043B\u044C\u043D\u0435\u0435.",
      marketReturn: "\u0414\u043E\u0445\u043E\u0434\u043D\u043E\u0441\u0442\u044C \u0440\u044B\u043D\u043A\u0430",
      tradesCount: "\u0421\u0434\u0435\u043B\u043E\u043A",
      maxDrawdown: "\u041C\u0430\u043A\u0441. \u043F\u0440\u043E\u0441\u0430\u0434\u043A\u0430",
      liquidations: "\u041B\u0438\u043A\u0432\u0438\u0434\u0430\u0446\u0438\u0438",
      wasLiquidated: "\u0431\u044B\u043B\u0438",
      achievements: "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F",
      playAgain: "\u0418\u0433\u0440\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430",
      bigOrders: "\u041A\u0440\u0443\u043F\u043D\u044B\u0435 \u0437\u0430\u044F\u0432\u043A\u0438",
      bid: "\u0431\u0438\u0434",
      ask: "\u0430\u0441\u043A",
      noGuarantee: "\u041D\u0435 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u044F \u2014 \u043C\u043E\u0433\u0443\u0442 \u0441\u043D\u044F\u0442\u044C, \u0438\u0441\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0438\u043B\u0438 \u0441\u0434\u0432\u0438\u043D\u0443\u0442\u044C \u0432 \u043B\u044E\u0431\u043E\u0439 \u043C\u043E\u043C\u0435\u043D\u0442"
    }
  },
  en: {
    nav: { home: "Home", new: "Journal", log: "Notes", patterns: "Analytics", simulator: "Game", challenge: "Challenge", coach: "Coach", settings: "Settings" },
    coach: {
      title: "AI Coach",
      subtitle: "Your personal analyst. Understands your trading style.",
      analyzeTitle: "Journal analysis",
      analyzeDesc: "AI will review your journal and surface key patterns, strengths and weaknesses.",
      analyzeScopeInfo: "Analyzing your full journal and detected patterns",
      analyzeBtn: "Analyze",
      analyzeBusy: "Analyzing\u2026",
      analyzeEmpty: "Tap \"Analyze\" to have AI review your journal.",
      analyzeNoEntries: "Add a few journal entries first.",
      chatTitle: "Ask the AI coach",
      chatDesc: "Ask anything about your trades, psychology, or trading in general.",
      chatPlaceholder: "Type a message\u2026",
      chatEmpty: "Ask about your trades, patterns, or trading psychology.",
      quick: {
        lateCloses: "Why do I close trades too early?",
        strengths: "My strengths",
        losses: "Why am I losing?",
        discipline: "How can I improve discipline?",
        strategy: "Should I change my strategy?",
        style: "What's my trading style?"
      },
      disclaimer: "AI doesn't give financial advice. Analysis and observations only.",
      statusReady: "Ready to help",
      statusOnline: "AI coach online",
      modelLabel: "Model: Gemini",
      send: "Send",
      error: "AI is unavailable right now, try again."
    },
    home: {
      welcomeBack: (name) => `Welcome back, ${name}`,
      defaultName: "Operator",
      subtitle: "Clarity is waiting for you.",
      capital: "Capital",
      totalResult: "Total result",
      sinceStart: "since start",
      calibrationToday: (pct) => `Today's calibration: ${pct}%`,
      calibrationCta: "Calibrate before your session",
      insight: "Insight",
      moodPrefix: "Market mood: ",
      insightConfident: "Recent trades show confidence is paying off \u2014 keep your size consistent.",
      insightFocus: "Focus on consistency. Add a few more trades for a real pattern to show up.",
      moodCalm: "Calm",
      moodStable: "Stable",
      moodReactive: "Reactive",
      traderLevel: "Trader level",
      awareness: "Awareness",
      reflection: "Reflection",
      discipline: "Discipline",
      riskStability: "Risk stability",
      calibrationTodayShort: "Today's calibration",
      newEntryTile: "New entry",
      logTile: "Notes",
      patternsTile: "Analytics",
      simulatorTile: "Game",
      market: "Market",
      streakDays: (n) => `${n} days in a row`,
      startStreak: "Start a streak"
    },
    newEntry: {
      title: "New entry",
      instrument: "Instrument",
      pickOrAdd: "Pick or add",
      setupType: "Setup type",
      result: (unit) => `Result (${unit})`,
      direction: "Direction",
      entry: "Entry",
      exit: "Exit",
      outcome: "Outcome",
      screenshots: (max) => `Chart screenshots (up to ${max})`,
      pullQuestion: "What pulled you into this trade?",
      pullPlaceholder: "Be honest, not flattering.",
      lessonQuestion: "What would you tell yourself next time?",
      lessonPlaceholder: "One line you'll actually remember.",
      emotionQuestion: "What did you feel the moment you entered?",
      save: "Save entry"
    },
    log: {
      title: "Trade journal",
      totalTrades: "Total trades",
      profitable: "Profitable",
      searchPlaceholder: "Search trades\u2026",
      filters: { All: "All", Win: "Profitable", Loss: "Losing", Long: "Long", Short: "Short" },
      empty: "Nothing found. Try a different filter.",
      colEntry: "Entry",
      colExit: "Exit",
      colRR: "R/R",
      colResult: "Result"
    },
    settings: {
      title: "Settings",
      language: "App language",
      languageNote: "Changes the interface language. Your journal entries stay exactly as you wrote them.",
      russian: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
      english: "English",
      account: "Account",
      logout: "Log out",
      localAccountNote: "Account syncs to the cloud and is available from any device after logging in.",
      operatorName: "Operator name",
      operatorPlaceholder: "Operator",
      accentColor: "Accent color",
      resultUnits: "Result units",
      rMultiplier: "R-multiple",
      currencyLabel: "Currency",
      startingCapital: "Starting capital",
      weeklyGoalLabel: "Weekly consistency goal",
      weeklyGoalNote: "How many days a week to journal for the consistency challenge.",
      daysSuffix: "days",
      sound: "Sound",
      soundToggleLabel: "Play a sound when saving an entry",
      data: "Data",
      dataNote: "Everything saves automatically on this device (or your account, if signed in). A full backup is for switching devices or just for safety.",
      fullBackup: "Full backup (.json)",
      restoreBackup: "Restore from backup (.json)",
      exportJournalOnly: "Export journal only (.json)",
      importJournalOnly: "Import journal only (.json)",
      confirmClearJournal: "Delete all entries permanently?",
      yes: "Yes",
      cancel: "Cancel",
      clearJournal: "Clear journal",
      fullResetTitle: "Full reset",
      fullResetNote: "Erases the journal, all settings, custom instruments, calibration result, and MindCoin wallet \u2014 resets the app to its first launch.",
      confirmFullReset: "Reset absolutely everything?",
      yesReset: "Yes, reset",
      fullResetButton: "Reset the whole app",
      footerNote: "Trade screenshots are kept only for this session and aren't saved between visits. Notifications and broker sync aren't implemented yet."
    },
    challenge: {
      title: "Challenge",
      daysInARow: "days in a row",
      weeklyConsistency: "Weekly consistency",
      weeklyConsistencyDesc: (goal) => `Journal ${goal} out of 7 days this week.`,
      thisWeek: "This week",
      footer: "Consistency matters more than any single trade. A streak isn't about winning \u2014 it's about coming back to yourself even after a loss."
    },
    calibration: {
      heading: "CALIBRATION",
      subtitle: "Check your readiness for a trading session.",
      intro: "It takes less than 30 seconds. Answer honestly. The system analyzes your state, not the market.",
      start: "Start",
      questionOf: (i, total) => `Question ${i} of ${total}`,
      cancel: "Cancel",
      mainRiskFactor: "Main risk factor",
      whatInfluenced: "What influenced the result",
      restart: "Take it again"
    },
    pattern: {
      yourPattern: "Your pattern",
      strongSignal: "Strong signal",
      observedPattern: "Observed pattern",
      someSigns: "Some signs",
      trades: (n) => `${n} ${n === 1 ? "trade" : "trades"}`,
      winShort: "win",
      avgShort: "avg",
      breakdown: "Break it down \u2192",
      strength: "Strength",
      noClearPattern: "No clear stable pattern yet \u2014 that's a decent sign too. Keep journaling, the app keeps watching for this continuously.",
      buildingUp: (have, need) => `Still building up \u2014 ${have} / ${need}`,
      buildingUpDesc: "The app looks for repeating links between your state and your results \u2014 entries need a filled-in emotional point to count.",
      detailTitle: "Your pattern",
      tradesLabel: "Trades",
      winRateLabel: "Win rate",
      avgRLabel: "Average R",
      comparison: "Comparison",
      similarSituations: "Similar situations",
      otherTrades: "Other trades",
      whereOnMap: "Where this sits on the emotion map",
      fearToConfidence: "Fear \u2192 Confidence",
      nervousToCalm: "On edge \u2192 Calm",
      tradeExamples: "Trade examples",
      whyShown: "Why mind.exe is showing this",
      whyShownText: (n, avgGroup, avgRest) => `${n} ${n === 1 ? "trade falls" : "trades fall"} into this category. This group's average result was ${avgGroup}, versus ${avgRest} for the rest of your trades.`,
      needMoreEntries: "Add a few more trades from both sides \u2014 winning and losing \u2014 and a pattern will start to show up here.",
      noPatternYetLong: "No clear stable pattern yet \u2014 winning and losing trades come from similar emotional states. That's worth noticing in itself.",
      accumulating: (n) => `Still building material for stable conclusions (need ${n} more entries with an emotional point) \u2014 but it's already clear the journal is being kept regularly, and that's what matters.`
    },
    review: {
      heading: "REVIEW",
      notEnough: "There aren't quite enough entries yet to spot patterns in them. Add a few more trades \u2014 winning and losing \u2014 and the review will become available.",
      back: "Back",
      questionsCount: (n) => `${n} ${n === 1 ? "question" : "questions"} based on what's already visible in your journal.`,
      intro: "This isn't about the market or financial advice \u2014 only about the state you're making decisions in. Answer honestly, there's no one to impress here.",
      questionsAnswered: (total, dataDriven) => `${total} ${total === 1 ? "question" : "questions"}${dataDriven > 0 ? `, ${dataDriven} of them based on real patterns from your journal` : ""}`,
      startHere: "Start with this",
      alsoWorthNoting: "Also worth noting",
      looksFine: "This looks fine",
      disclaimer: "The recommendations are psychological, not financial \u2014 they're not about what to trade, but about how you do it.",
      done: "Done"
    },
    sim: {
      heading: "MARKET SIMULATOR",
      subtitle: "An artificial market. Real decisions.",
      terminal: "Terminal",
      beta: "Beta",
      introText: 'A radar of large orders, random news, and leverage up to x50. The market opens already "in progress" \u2014 with history on the chart \u2014 and moves independently of your trades.',
      startSession: "Start session",
      capital: "Capital",
      price: "Price",
      reacting: "reacting\u2026",
      positionLiquidated: "Position liquidated",
      takeProfitHit: "Take-profit hit",
      stopLossHit: "Stop-loss hit",
      long: "Long",
      short: "Short",
      entry: "entry",
      margin: "Margin",
      liq: "liq.",
      add: "Add",
      closePosition: "Close position",
      volume: "size",
      sessionOver: "SESSION OVER",
      finalCapital: "Capital",
      beatMarket: "You beat the market.",
      lostToMarket: "The market was stronger.",
      marketReturn: "Market return",
      tradesCount: "Trades",
      maxDrawdown: "Max drawdown",
      liquidations: "Liquidations",
      wasLiquidated: "yes",
      achievements: "Achievements",
      playAgain: "Play again",
      bigOrders: "Large orders",
      bid: "bid",
      ask: "ask",
      noGuarantee: "Not a guarantee \u2014 orders can be pulled, filled, or moved at any moment"
    }
  }
};
var CURRENCIES = [
  { code: "USD", symbol: "$", prefix: true },
  { code: "RUB", symbol: "\u20BD", prefix: false },
  { code: "EUR", symbol: "\u20AC", prefix: true },
  { code: "GBP", symbol: "\xA3", prefix: true },
  { code: "CNY", symbol: "\xA5", prefix: true },
  { code: "KZT", symbol: "\u20B8", prefix: false }
];
var BTC_DOMINANCE = 54.6;
var FEAR_GREED = { score: 44, label: "\u041D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u043E" };
var ring = (accent) => `0 0 0 1px ${accent}35`;
var softLift = (accent) => `0 0 0 1px ${accent}35, 0 6px 20px ${accent}1F`;
var outcomeColor = (o) => o === "Win" ? WIN : o === "Loss" ? LOSS : FLAT;
function deriveEntryStatus(e) {
  if (e.status === "open" || e.status === "closed") return e.status;
  return e.outcome != null ? "closed" : "open";
}
function migrateEntry(e) {
  return {
    ...e,
    status: deriveEntryStatus(e),
    exitDate: e.exitDate ? e.exitDate : null,
    stopLoss: typeof e.stopLoss === "number" && !isNaN(e.stopLoss) ? e.stopLoss : null,
    takeProfit: typeof e.takeProfit === "number" && !isNaN(e.takeProfit) ? e.takeProfit : null,
    plannedRR: typeof e.plannedRR === "number" && !isNaN(e.plannedRR) ? e.plannedRR : null,
    closeType: ["tp", "sl", "manual"].includes(e.closeType) ? e.closeType : null,
    realizedRR: typeof e.realizedRR === "number" && !isNaN(e.realizedRR) ? e.realizedRR : null,
    exitScreenshots: Array.isArray(e.exitScreenshots) ? e.exitScreenshots : []
  };
}
var isEntryClosed = (e) => e.status === "closed";
function computePlannedRR(direction, entry, sl, tp) {
  if ([entry, sl, tp].some((v) => typeof v !== "number" || isNaN(v) || !isFinite(v))) return { ok: false, error: "\u0417\u0430\u043F\u043E\u043B\u043D\u0438 Entry, SL \u0438 TP \u0447\u0438\u0441\u043B\u0430\u043C\u0438" };
  const risk = direction === "Short" ? sl - entry : entry - sl;
  const reward = direction === "Short" ? entry - tp : tp - entry;
  if (risk <= 0) return { ok: false, error: direction === "Short" ? "SL \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432\u044B\u0448\u0435 Entry" : "SL \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043D\u0438\u0436\u0435 Entry" };
  if (reward <= 0) return { ok: false, error: direction === "Short" ? "TP \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043D\u0438\u0436\u0435 Entry" : "TP \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432\u044B\u0448\u0435 Entry" };
  const rr = reward / risk;
  if (!isFinite(rr) || isNaN(rr)) return { ok: false, error: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F" };
  return { ok: true, rr };
}
function computeRealizedRR(direction, entry, sl, exit) {
  if ([entry, sl, exit].some((v) => typeof v !== "number" || isNaN(v) || !isFinite(v))) return null;
  const risk = direction === "Short" ? sl - entry : entry - sl;
  if (!risk || risk <= 0) return null;
  const reward = direction === "Short" ? entry - exit : exit - entry;
  const rr = reward / risk;
  return isFinite(rr) && !isNaN(rr) ? rr : null;
}
var findCurrency = (code) => CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
var groupThousands = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
var isToday = (isoDate) => !!isoDate && new Date(isoDate).toDateString() === (/* @__PURE__ */ new Date()).toDateString();
function unitSymbol(measureMode, currencyCode) {
  return measureMode === "R" ? "R" : findCurrency(currencyCode).symbol;
}
function formatResult(value, measureMode, currencyCode) {
  if (value === null || value === void 0) return "\u2014";
  if (measureMode === "R") {
    const v2 = Math.round(value * 10) / 10;
    return `${v2 > 0 ? "+" : ""}${v2}R`;
  }
  const cur = findCurrency(currencyCode);
  const v = Math.round(value);
  const sign = v > 0 ? "+" : v < 0 ? "-" : "";
  const abs = groupThousands(Math.abs(v));
  return cur.prefix ? `${sign}${cur.symbol}${abs}` : `${sign}${abs} ${cur.symbol}`;
}
function formatPriceValue(v) {
  if (v == null || isNaN(v)) return "\u2014";
  if (Math.abs(v) >= 1e3) return groupThousands(Math.round(v));
  if (Math.abs(v) >= 1) return (Math.round(v * 100) / 100).toString();
  return (Math.round(v * 1e4) / 1e4).toString();
}
function formatBalance(value, currencyCode) {
  const cur = findCurrency(currencyCode);
  const v = Math.round(value);
  const sign = v < 0 ? "-" : "";
  const abs = groupThousands(Math.abs(v));
  return cur.prefix ? `${sign}${cur.symbol}${abs}` : `${sign}${abs} ${cur.symbol}`;
}
function useAnimatedNumber(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  useEffect(() => {
    const from = prevRef.current;
    const to = target;
    if (from === to) return;
    let start;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
      else prevRef.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return display;
}
function useIsDesktop(breakpoint = 900) {
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" && window.innerWidth >= breakpoint);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const handler = (e) => setIsDesktop(e.matches);
    handler(mq);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, [breakpoint]);
  return isDesktop;
}
function calculateTraderLevel(entriesCount) {
  return Math.min(9, 3 + Math.floor(entriesCount / 3));
}
function calculateCalendarStats(dayEntries, closedDayEntries) {
  if (!dayEntries.length) return null;
  const closed = closedDayEntries || dayEntries.filter(isEntryClosed);
  const wins = closed.filter((e) => e.outcome === "Win").length;
  const losses = closed.filter((e) => e.outcome === "Loss").length;
  const breakevens = closed.filter((e) => e.outcome === "Breakeven").length;
  const avgR = closed.length ? closed.reduce((s, e) => s + (e.r || 0), 0) / closed.length : 0;
  const countBy = (key) => {
    const counts = {};
    dayEntries.forEach((e) => {
      const v = e[key];
      if (v) counts[v] = (counts[v] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length ? { value: sorted[0][0], count: sorted[0][1] } : null;
  };
  const topInstrument = countBy("instrument");
  const topTag = countBy("tag");
  const emoPoints = dayEntries.filter((e) => e.x != null && e.y != null);
  let mood = null, moodColor = BASE.inkFaint;
  if (emoPoints.length) {
    const avgX = emoPoints.reduce((s, e) => s + e.x, 0) / emoPoints.length;
    const avgY = emoPoints.reduce((s, e) => s + e.y, 0) / emoPoints.length;
    mood = avgX >= 50 && avgY >= 50 ? "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E \u0438 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E" : avgX >= 50 && avgY < 50 ? "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E, \u043D\u043E \u043D\u0430 \u0432\u0437\u0432\u043E\u0434\u0435" : avgX < 50 && avgY >= 50 ? "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u043E, \u043D\u043E \u043D\u0435\u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E" : "\u0421\u0442\u0440\u0430\u0448\u043D\u043E \u0438 \u043D\u0430 \u043D\u0435\u0440\u0432\u0430\u0445";
    moodColor = avgX >= 50 && avgY >= 50 ? WIN : avgX < 50 && avgY < 50 ? LOSS : BASE.inkDim;
  }
  return { wins, losses, breakevens, avgR, topInstrument, topTag, mood, moodColor };
}
var daysAgo = (n) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 30, 0, 0);
  return d;
};
var relTime = (date) => {
  const diff = Math.floor((Date.now() - date.getTime()) / 864e5);
  if (diff <= 0) return "\u0421\u0435\u0433\u043E\u0434\u043D\u044F";
  if (diff === 1) return "\u0412\u0447\u0435\u0440\u0430";
  if (diff < 7) return `${diff} \u0434\u043D. \u043D\u0430\u0437\u0430\u0434`;
  return `${Math.floor(diff / 7)} \u043D\u0435\u0434. \u043D\u0430\u0437\u0430\u0434`;
};
var pluralRu = (n, one, few, many) => {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
};
function compressImageFile(file, maxDim = 1280, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image decode failed"));
    };
    img.src = url;
  });
}
var seedEntries = [
  {
    id: 1,
    instrument: "EUR/USD",
    direction: "Long",
    outcome: "Loss",
    x: 78,
    y: 82,
    r: -1.2,
    tag: "\u041F\u0440\u043E\u0431\u043E\u0439",
    screenshots: [],
    pull: "\u0423\u0432\u0438\u0434\u0435\u043B, \u043A\u0430\u043A \u043F\u0430\u0440\u0430 \u043F\u0440\u043E\u043B\u0435\u0442\u0435\u043B\u0430 40 \u043F\u0443\u043D\u043A\u0442\u043E\u0432 \u0437\u0430 10 \u043C\u0438\u043D\u0443\u0442, \u0438 \u043D\u0435 \u0445\u043E\u0442\u0435\u043B \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435.",
    lesson: "\u041F\u043E\u0433\u043E\u043D\u044F \u0437\u0430 \u0441\u0432\u0435\u0447\u043E\u0439 \u2014 \u044D\u0442\u043E \u043D\u0435 \u0441\u0435\u0442\u0430\u043F. \u0414\u043E\u0436\u0434\u0438\u0441\u044C, \u043F\u043E\u043A\u0430 \u0446\u0435\u043D\u0430 \u0432\u0435\u0440\u043D\u0451\u0442\u0441\u044F \u043A \u0442\u0435\u0431\u0435.",
    date: daysAgo(3)
  },
  {
    id: 2,
    instrument: "TSLA",
    direction: "Short",
    outcome: "Win",
    x: 62,
    y: 40,
    r: 2.1,
    tag: "\u0420\u0430\u0437\u0432\u043E\u0440\u043E\u0442",
    screenshots: [],
    pull: "\u0427\u0451\u0442\u043A\u0438\u0439 \u043E\u0442\u0431\u043E\u0439 \u043E\u0442 \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u044F, \u0432\u0441\u0451 \u0441\u043E\u0432\u043F\u0430\u043B\u043E \u0441 \u043F\u043B\u0430\u043D\u043E\u043C, \u0441\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u043C \u0434\u043E \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u044F \u0440\u044B\u043D\u043A\u0430.",
    lesson: "\u0412\u043E\u0442 \u043A\u0430\u043A \u0432\u044B\u0433\u043B\u044F\u0434\u044F\u0442 \u0441\u043A\u0443\u0447\u043D\u044B\u0435 \u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438. \u0417\u0430\u043F\u043E\u043C\u043D\u0438 \u044D\u0442\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435.",
    date: daysAgo(5)
  },
  {
    id: 3,
    instrument: "NAS100",
    direction: "Long",
    outcome: "Loss",
    x: 22,
    y: 71,
    r: -2,
    tag: "\u0420\u0435\u0432\u0430\u043D\u0448",
    screenshots: [],
    pull: "\u0420\u0435\u0432\u0430\u043D\u0448-\u0442\u0440\u0435\u0439\u0434 \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0441\u0442\u043E\u043F\u0430 \u043F\u043E TSLA, \u0445\u043E\u0442\u0435\u043B \u043E\u0442\u044B\u0433\u0440\u0430\u0442\u044C\u0441\u044F.",
    lesson: "\u042F \u0442\u043E\u0440\u0433\u043E\u0432\u0430\u043B \u043D\u0435 \u0433\u0440\u0430\u0444\u0438\u043A, \u0430 \u0441\u0432\u043E\u0439 P&L.",
    date: daysAgo(5)
  },
  {
    id: 4,
    instrument: "GBP/JPY",
    direction: "Short",
    outcome: "Win",
    x: 70,
    y: 35,
    r: 1.6,
    tag: "\u0422\u0440\u0435\u043D\u0434",
    screenshots: [],
    pull: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u043E \u0443\u043C\u0435\u043D\u044C\u0448\u0438\u043B \u043E\u0431\u044A\u0451\u043C, \u043D\u0435 \u0431\u044B\u043B\u043E \u0441\u043F\u0435\u0448\u043A\u0438 \u2014 \u043F\u0440\u043E\u0441\u0442\u043E \u0438\u0441\u043F\u043E\u043B\u043D\u0438\u043B \u043F\u043B\u0430\u043D.",
    lesson: "\u041C\u0435\u043D\u044C\u0448\u0435 \u043E\u0431\u044A\u0451\u043C, \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u0435\u0435 \u0433\u043E\u043B\u043E\u0432\u0430, \u0442\u043E\u0447\u043D\u0435\u0435 \u0447\u0442\u0435\u043D\u0438\u0435 \u0440\u044B\u043D\u043A\u0430. \u0412\u0437\u044F\u043B \u043D\u0430 \u0437\u0430\u043C\u0435\u0442\u043A\u0443.",
    date: daysAgo(1)
  },
  {
    id: 5,
    instrument: "BTC/USD",
    direction: "Long",
    outcome: "Breakeven",
    x: 48,
    y: 55,
    r: 0,
    tag: "\u0424\u043B\u044D\u0442",
    screenshots: [],
    pull: "\u041D\u0435 \u0431\u044B\u043B \u0443\u0432\u0435\u0440\u0435\u043D, \u0432\u0437\u044F\u043B \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0443 \u043E\u0431\u044A\u0451\u043C\u0430 \u043A\u0430\u043A \u043A\u043E\u043C\u043F\u0440\u043E\u043C\u0438\u0441\u0441 \u0441 \u0441\u0430\u043C\u0438\u043C \u0441\u043E\u0431\u043E\u0439.",
    lesson: "\u0421\u0434\u0435\u043B\u043A\u0438 \u0441 \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0447\u0430\u0442\u043E\u0439 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C\u044E \u0441\u044A\u0435\u0434\u0430\u044E\u0442 \u0441\u043B\u043E\u0442\u044B. \u041B\u0438\u0431\u043E \u043D\u0430 \u043F\u043E\u043B\u043D\u0443\u044E, \u043B\u0438\u0431\u043E \u043C\u0438\u043C\u043E.",
    date: daysAgo(2)
  },
  {
    id: 6,
    instrument: "XAU/USD",
    direction: "Short",
    outcome: "Loss",
    x: 30,
    y: 88,
    r: -1.5,
    tag: "\u041D\u043E\u0432\u043E\u0441\u0442\u0438",
    screenshots: [],
    pull: "\u0422\u043E\u043B\u044C\u043A\u043E \u0432\u044B\u0448\u0435\u043B CPI, \u0445\u043E\u0442\u0435\u043B \u0432\u043E\u0439\u0442\u0438 \u043F\u0435\u0440\u0432\u044B\u043C, \u043F\u043E\u043A\u0430 \u043D\u0435 \u0443\u043B\u0435\u0442\u0435\u043B\u043E \u0435\u0449\u0451 \u0434\u0430\u043B\u044C\u0448\u0435.",
    lesson: "\u041D\u043E\u0432\u043E\u0441\u0442\u043D\u044B\u0435 \u0441\u043F\u0430\u0439\u043A\u0438 \u2014 \u044D\u0442\u043E \u043B\u043E\u0442\u0435\u0440\u0435\u044F, \u0430 \u043D\u0435 \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u043E.",
    date: daysAgo(0)
  }
];
var CALIBRATION_QUESTIONS = [
  {
    id: "sleep",
    text: "\u041A\u0430\u043A \u0432\u044B \u0441\u043F\u0430\u043B\u0438 \u0441\u0435\u0433\u043E\u0434\u043D\u044F?",
    positive: "\u0425\u043E\u0440\u043E\u0448\u0438\u0439 \u0441\u043E\u043D",
    negative: "\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u043A \u0441\u043D\u0430",
    options: [
      { label: "\u041E\u0442\u043B\u0438\u0447\u043D\u043E", score: 2 },
      { label: "\u041D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u043E", score: 1 },
      { label: "\u041F\u043B\u043E\u0445\u043E", score: -1 },
      { label: "\u041F\u043E\u0447\u0442\u0438 \u043D\u0435 \u0441\u043F\u0430\u043B", score: -2 }
    ]
  },
  {
    id: "emotion",
    text: "\u0412\u0430\u0448\u0435 \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435?",
    positive: "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435",
    negative: "\u041F\u043E\u0432\u044B\u0448\u0435\u043D\u043D\u0430\u044F \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C",
    options: [
      { label: "\u0421\u043F\u043E\u043A\u043E\u0435\u043D", score: 2 },
      { label: "\u041D\u0435\u043C\u043D\u043E\u0433\u043E \u043D\u0430\u043F\u0440\u044F\u0436\u0451\u043D", score: 0 },
      { label: "\u0420\u0430\u0437\u0434\u0440\u0430\u0436\u0451\u043D", score: -1 },
      { label: "\u041E\u0447\u0435\u043D\u044C \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u0435\u043D", score: -2, flag: "emotion" }
    ]
  },
  {
    id: "motivation",
    text: "\u041F\u043E\u0447\u0435\u043C\u0443 \u0432\u044B \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0435 \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B?",
    positive: "\u0427\u0451\u0442\u043A\u0438\u0439 \u043F\u043B\u0430\u043D \u043D\u0430 \u0441\u0435\u0441\u0441\u0438\u044E",
    negative: "\u0416\u0435\u043B\u0430\u043D\u0438\u0435 \u043E\u0442\u0431\u0438\u0442\u044C \u0443\u0431\u044B\u0442\u043A\u0438",
    options: [
      { label: "\u0421\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u044C \u043F\u043B\u0430\u043D\u0443", score: 2 },
      { label: "\u0415\u0441\u0442\u044C \u0445\u043E\u0440\u043E\u0448\u0438\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438", score: 1 },
      { label: "\u0425\u043E\u0447\u0443 \u043E\u0442\u0431\u0438\u0442\u044C \u0443\u0431\u044B\u0442\u043A\u0438", score: -2, flag: "revenge" },
      { label: "\u041F\u0440\u043E\u0441\u0442\u043E \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043F\u043E\u0442\u043E\u0440\u0433\u043E\u0432\u0430\u0442\u044C", score: -1 }
    ]
  },
  {
    id: "walkaway",
    text: "\u0415\u0441\u043B\u0438 \u043D\u0435 \u0431\u0443\u0434\u0435\u0442 \u0445\u043E\u0440\u043E\u0448\u0438\u0445 \u0432\u0445\u043E\u0434\u043E\u0432, \u0441\u043C\u043E\u0436\u0435\u0442\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u044C \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B \u0431\u0435\u0437 \u0441\u0434\u0435\u043B\u043A\u0438?",
    positive: "\u0413\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0441\u0435\u0441\u0441\u0438\u044E",
    negative: "\u0421\u043B\u043E\u0436\u043D\u043E \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C\u0441\u044F \u0431\u0435\u0437 \u0441\u0434\u0435\u043B\u043A\u0438",
    options: [
      { label: "\u0414\u0430", score: 2 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u0434\u0430", score: 1 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u043D\u0435\u0442", score: -1 },
      { label: "\u041D\u0435\u0442", score: -2 }
    ]
  },
  {
    id: "noTradeFeeling",
    text: "\u0427\u0442\u043E \u043F\u043E\u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0435\u0442\u0435, \u0435\u0441\u043B\u0438 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043D\u0435 \u0431\u0443\u0434\u0435\u0442 \u043D\u0438 \u043E\u0434\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438?",
    positive: "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u043E \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u043A \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044E \u0441\u0434\u0435\u043B\u043E\u043A",
    negative: "\u0421\u0442\u0440\u0430\u0445 \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435",
    options: [
      { label: "\u041D\u0438\u0447\u0435\u0433\u043E", score: 2 },
      { label: "\u041B\u0451\u0433\u043A\u043E\u0435 \u0440\u0430\u0437\u043E\u0447\u0430\u0440\u043E\u0432\u0430\u043D\u0438\u0435", score: 1 },
      { label: "\u0411\u0443\u0434\u0435\u0442 \u043D\u0435\u043F\u0440\u0438\u044F\u0442\u043D\u043E", score: -1 },
      { label: "\u0411\u0443\u0434\u0443 \u0447\u0443\u0432\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C, \u0447\u0442\u043E \u0443\u043F\u0443\u0441\u0442\u0438\u043B \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C", score: -2, flag: "fomo" }
    ]
  },
  {
    id: "objectivity",
    text: "\u041D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043E\u0431\u044A\u0435\u043A\u0442\u0438\u0432\u043D\u043E \u0432\u044B \u0441\u0435\u0439\u0447\u0430\u0441 \u043E\u0446\u0435\u043D\u0438\u0432\u0430\u0435\u0442\u0435 \u0440\u044B\u043D\u043E\u043A?",
    positive: "\u0422\u0440\u0435\u0437\u0432\u0430\u044F \u043E\u0446\u0435\u043D\u043A\u0430 \u0440\u044B\u043D\u043A\u0430",
    negative: "\u042D\u043C\u043E\u0446\u0438\u0438 \u0432\u043B\u0438\u044F\u044E\u0442 \u043D\u0430 \u043E\u0446\u0435\u043D\u043A\u0443 \u0440\u044B\u043D\u043A\u0430",
    options: [
      { label: "\u041F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E", score: 2 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E", score: 1 },
      { label: "\u0415\u0441\u0442\u044C \u0441\u043E\u043C\u043D\u0435\u043D\u0438\u044F", score: -1 },
      { label: "\u0421\u0438\u043B\u044C\u043D\u044B\u0435 \u044D\u043C\u043E\u0446\u0438\u0438 \u0438\u043B\u0438 \u0447\u0440\u0435\u0437\u043C\u0435\u0440\u043D\u0430\u044F \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C", score: -2, flag: "emotion" }
    ]
  }
];
var CALIBRATION_QUESTIONS_EN = [
  {
    id: "sleep",
    text: "How did you sleep today?",
    positive: "Good sleep",
    negative: "Lack of sleep",
    options: [
      { label: "Great", score: 2 },
      { label: "Fine", score: 1 },
      { label: "Poorly", score: -1 },
      { label: "Barely slept", score: -2 }
    ]
  },
  {
    id: "emotion",
    text: "How's your emotional state?",
    positive: "Calm state",
    negative: "Elevated emotions",
    options: [
      { label: "Calm", score: 2 },
      { label: "A bit tense", score: 0 },
      { label: "Irritated", score: -1 },
      { label: "Very emotional", score: -2, flag: "emotion" }
    ]
  },
  {
    id: "motivation",
    text: "Why are you opening the terminal today?",
    positive: "Clear plan for the session",
    negative: "Wanting to win back losses",
    options: [
      { label: "To follow the plan", score: 2 },
      { label: "There are good opportunities", score: 1 },
      { label: "I want to win back losses", score: -2, flag: "revenge" },
      { label: "Just feel like trading", score: -1 }
    ]
  },
  {
    id: "walkaway",
    text: "If there are no good entries, can you close the terminal without trading?",
    positive: "Willing to skip the session",
    negative: "Hard to stop without a trade",
    options: [
      { label: "Yes", score: 2 },
      { label: "Probably yes", score: 1 },
      { label: "Probably not", score: -1 },
      { label: "No", score: -2 }
    ]
  },
  {
    id: "noTradeFeeling",
    text: "How would you feel if there were no trades at all today?",
    positive: "Calm about having no trades",
    negative: "Fear of missing out",
    options: [
      { label: "Nothing", score: 2 },
      { label: "Mild disappointment", score: 1 },
      { label: "Would feel unpleasant", score: -1 },
      { label: "Would feel like I missed an opportunity", score: -2, flag: "fomo" }
    ]
  },
  {
    id: "objectivity",
    text: "How objectively are you assessing the market right now?",
    positive: "Sober market assessment",
    negative: "Emotions are affecting your read on the market",
    options: [
      { label: "Completely calm", score: 2 },
      { label: "Mostly calm", score: 1 },
      { label: "Some doubts", score: -1 },
      { label: "Strong emotions or overconfidence", score: -2, flag: "emotion" }
    ]
  }
];
var CALIBRATION_TIERS = [
  { label: "\u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u0430 \u2014 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043E\u0442\u043B\u0438\u0447\u043D\u043E\u0435.", color: WIN },
  { label: "\u0413\u043E\u0442\u043E\u0432 \u043A \u0442\u043E\u0440\u0433\u043E\u0432\u043B\u0435 \u2014 \u043C\u043E\u0436\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \u043F\u043E \u043F\u043B\u0430\u043D\u0443.", color: WIN },
  { label: "\u041F\u043E\u0432\u044B\u0448\u0435\u043D\u043D\u044B\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0440\u0438\u0441\u043A\u0430 \u2014 \u0441\u043E\u0431\u043B\u044E\u0434\u0430\u0442\u044C \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0443.", color: WARN },
  { label: "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u2014 \u0441\u043D\u0438\u0437\u0438\u0442\u044C \u0440\u0438\u0441\u043A \u043D\u0430 30\u201350%.", color: LOSS },
  { label: "\u0422\u043E\u0440\u0433\u043E\u0432\u043B\u044F \u043D\u0435 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u2014 \u0432\u044B\u0441\u043E\u043A\u0430\u044F \u0432\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044C \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0440\u0435\u0448\u0435\u043D\u0438\u0439.", color: LOSS }
];
var CALIBRATION_TIERS_EN = [
  { label: "System stable \u2014 great state.", color: WIN },
  { label: "Ready to trade \u2014 you can work the plan.", color: WIN },
  { label: "Elevated risk level \u2014 stick to discipline.", color: WARN },
  { label: "Caution recommended \u2014 cut risk by 30\u201350%.", color: LOSS },
  { label: "Trading not recommended \u2014 high chance of emotional decisions.", color: LOSS }
];
function scoreCalibration(answers, lang = "ru") {
  const questions = lang === "en" ? CALIBRATION_QUESTIONS_EN : CALIBRATION_QUESTIONS;
  const tiers = lang === "en" ? CALIBRATION_TIERS_EN : CALIBRATION_TIERS;
  const total = questions.reduce((s, q) => s + (answers[q.id]?.score ?? 0), 0);
  const pct = Math.max(0, Math.min(100, Math.round((total + 12) / 24 * 100)));
  let tierIndex = pct >= 85 ? 0 : pct >= 70 ? 1 : pct >= 50 ? 2 : pct >= 30 ? 3 : 4;
  const riskFactors = [];
  if (answers.motivation?.flag === "revenge") riskFactors.push(lang === "en" ? "Wanting to win back losses" : "\u0416\u0435\u043B\u0430\u043D\u0438\u0435 \u043E\u0442\u0431\u0438\u0442\u044C \u0443\u0431\u044B\u0442\u043A\u0438");
  if (answers.emotion?.flag === "emotion" || answers.objectivity?.flag === "emotion") riskFactors.push(lang === "en" ? "Strong emotional involvement" : "\u0421\u0438\u043B\u044C\u043D\u0430\u044F \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0432\u043E\u0432\u043B\u0435\u0447\u0451\u043D\u043D\u043E\u0441\u0442\u044C");
  if (riskFactors.length) tierIndex = Math.max(tierIndex, 2);
  const factors = questions.map((q) => {
    const a = answers[q.id];
    if (!a) return null;
    if (a.score === 2) return { type: "positive", text: q.positive };
    if (a.score === -2) return { type: "warning", text: q.negative };
    return null;
  }).filter(Boolean);
  return { pct, tier: tiers[tierIndex], riskFactors, factors };
}
var REVIEW_LIKERT = [
  { label: "\u041F\u043E\u0447\u0442\u0438 \u043D\u0438\u043A\u043E\u0433\u0434\u0430", score: 0 },
  { label: "\u0418\u043D\u043E\u0433\u0434\u0430", score: 1 },
  { label: "\u0427\u0430\u0441\u0442\u043E", score: 2 },
  { label: "\u041F\u043E\u0447\u0442\u0438 \u0432\u0441\u0435\u0433\u0434\u0430", score: 3 }
];
var REVIEW_LIKERT_EN = [
  { label: "Almost never", score: 0 },
  { label: "Sometimes", score: 1 },
  { label: "Often", score: 2 },
  { label: "Almost always", score: 3 }
];
var REVIEW_MIN_QUESTIONS = 5;
var REVIEW_MAX_QUESTIONS = 8;
var GENERIC_REVIEW_QUESTIONS = [
  {
    id: "g_plan",
    dataDriven: false,
    title: "\u0422\u043E\u0440\u0433\u043E\u0432\u043B\u044F \u0431\u0435\u0437 \u043F\u043B\u0430\u043D\u0430",
    evidence: "\u041E\u0431\u0449\u0438\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u0436\u0443\u0440\u043D\u0430\u043B \u043F\u043E\u043A\u0430 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0435\u0433\u043E \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043F\u043E \u0446\u0438\u0444\u0440\u0430\u043C.",
    question: "\u041A\u0430\u043A \u0447\u0430\u0441\u0442\u043E \u0442\u044B \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0448\u044C \u0441\u0434\u0435\u043B\u043A\u0443 \u0431\u0435\u0437 \u0437\u0430\u0440\u0430\u043D\u0435\u0435 \u043F\u0440\u043E\u043F\u0438\u0441\u0430\u043D\u043D\u043E\u0433\u043E \u043F\u043B\u0430\u043D\u0430 \u2014 \u0442\u043E\u0447\u043A\u0438 \u0432\u0445\u043E\u0434\u0430, \u0441\u0442\u043E\u043F\u0430 \u0438 \u0446\u0435\u043B\u0438?",
    recommendation: "\u041F\u0440\u0435\u0436\u0434\u0435 \u0447\u0435\u043C \u0432\u0445\u043E\u0434\u0438\u0442\u044C, \u0437\u0430\u043F\u0438\u0448\u0438 \u0442\u0440\u0438 \u0447\u0438\u0441\u043B\u0430: \u0432\u0445\u043E\u0434, \u0441\u0442\u043E\u043F, \u0446\u0435\u043B\u044C. \u0415\u0441\u043B\u0438 \u043D\u0435 \u043C\u043E\u0436\u0435\u0448\u044C \u2014 \u0441\u0434\u0435\u043B\u043A\u0430 \u0435\u0449\u0451 \u043D\u0435 \u0433\u043E\u0442\u043E\u0432\u0430, \u044D\u0442\u043E \u043D\u0435 \u043F\u0440\u043E \u0440\u044B\u043D\u043E\u043A."
  },
  {
    id: "g_overconf",
    dataDriven: false,
    title: "\u0420\u0438\u0441\u043A \u043F\u043E\u0441\u043B\u0435 \u0441\u0435\u0440\u0438\u0438 \u043F\u043E\u0431\u0435\u0434",
    evidence: "\u041E\u0431\u0449\u0438\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u0436\u0443\u0440\u043D\u0430\u043B \u043F\u043E\u043A\u0430 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0435\u0433\u043E \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043F\u043E \u0446\u0438\u0444\u0440\u0430\u043C.",
    question: "\u041F\u043E\u0441\u043B\u0435 \u043F\u0430\u0440\u044B \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u043F\u043E\u0434\u0440\u044F\u0434 \u0442\u0435\u0431\u0435 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u043F\u043E\u0437\u0438\u0446\u0438\u0438?",
    recommendation: "\u0421\u0435\u0440\u0438\u044F \u043F\u043E\u0431\u0435\u0434 \u043D\u0435 \u043E\u0442\u043C\u0435\u043D\u044F\u0435\u0442 \u043F\u043B\u0430\u043D \u043F\u043E \u0440\u0438\u0441\u043A\u0443. \u0415\u0441\u043B\u0438 \u0438 \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0442\u044C \u0447\u0442\u043E-\u0442\u043E \u2014 \u0442\u043E \u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E\u0441\u0442\u044C, \u0430 \u043D\u0435 \u043E\u0431\u044A\u0451\u043C."
  },
  {
    id: "g_honesty",
    dataDriven: false,
    title: "\u0427\u0435\u0441\u0442\u043D\u043E\u0441\u0442\u044C \u0436\u0443\u0440\u043D\u0430\u043B\u0430",
    evidence: "\u041E\u0431\u0449\u0438\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u0436\u0443\u0440\u043D\u0430\u043B \u043F\u043E\u043A\u0430 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0435\u0433\u043E \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043F\u043E \u0446\u0438\u0444\u0440\u0430\u043C.",
    question: "\u0411\u044B\u0432\u0430\u0435\u0442, \u0447\u0442\u043E \u0442\u044B \u043D\u0435 \u0437\u0430\u043F\u0438\u0441\u044B\u0432\u0430\u0435\u0448\u044C \u043D\u0435\u0443\u0434\u0430\u0447\u043D\u0443\u044E \u0441\u0434\u0435\u043B\u043A\u0443 \u0432 \u0436\u0443\u0440\u043D\u0430\u043B, \u0447\u0442\u043E\u0431\u044B \u043D\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0432\u0430\u0442\u044C \u0435\u0451?",
    recommendation: "\u0416\u0443\u0440\u043D\u0430\u043B \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442, \u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0432 \u043D\u0451\u043C \u0435\u0441\u0442\u044C \u0438 \u0442\u043E, \u0447\u0442\u043E \u0441\u0442\u044B\u0434\u043D\u043E \u043F\u0438\u0441\u0430\u0442\u044C. \u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043D\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C \u2014 \u0442\u043E\u0436\u0435 \u0443\u0440\u043E\u043A, \u043F\u0440\u043E\u0441\u0442\u043E \u043E\u0442\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0439."
  },
  {
    id: "g_carryover",
    dataDriven: false,
    title: "\u041F\u0435\u0440\u0435\u043D\u043E\u0441 \u044D\u043C\u043E\u0446\u0438\u0439 \u043C\u0435\u0436\u0434\u0443 \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u0438",
    evidence: "\u041E\u0431\u0449\u0438\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u0436\u0443\u0440\u043D\u0430\u043B \u043F\u043E\u043A\u0430 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0435\u0433\u043E \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043F\u043E \u0446\u0438\u0444\u0440\u0430\u043C.",
    question: "\u041F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u0448\u044C \u043B\u0438 \u0440\u0430\u0437\u0434\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u044D\u0439\u0444\u043E\u0440\u0438\u044E \u043E\u0442 \u043E\u0434\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u043D\u0430 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u043F\u043E \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439?",
    recommendation: "\u041C\u0435\u0436\u0434\u0443 \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u0438 \u043F\u043E\u043C\u043E\u0433\u0430\u0435\u0442 \u0440\u0438\u0442\u0443\u0430\u043B-\u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u044C \u2014 \u0434\u0430\u0436\u0435 60 \u0441\u0435\u043A\u0443\u043D\u0434 \u043F\u0430\u0443\u0437\u044B \u0438 \u043E\u0434\u0438\u043D \u0432\u0434\u043E\u0445, \u0447\u0442\u043E\u0431\u044B \u043D\u0435 \u0442\u0430\u0449\u0438\u0442\u044C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0434\u0430\u043B\u044C\u0448\u0435."
  },
  {
    id: "g_size",
    dataDriven: false,
    title: "\u041E\u0431\u044A\u0451\u043C \u043F\u043E\u0434 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435",
    evidence: "\u041E\u0431\u0449\u0438\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u0436\u0443\u0440\u043D\u0430\u043B \u043F\u043E\u043A\u0430 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0435\u0433\u043E \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043F\u043E \u0446\u0438\u0444\u0440\u0430\u043C.",
    question: "\u041C\u0435\u043D\u044F\u0435\u0448\u044C \u043B\u0438 \u0442\u044B \u0440\u0430\u0437\u043C\u0435\u0440 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u0442\u043E\u0433\u043E, \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0443\u0432\u0435\u0440\u0435\u043D \u0432 \u043C\u043E\u043C\u0435\u043D\u0442\u0435, \u0430 \u043D\u0435 \u043E\u0442 \u0437\u0430\u0440\u0430\u043D\u0435\u0435 \u0437\u0430\u0434\u0430\u043D\u043D\u043E\u0433\u043E \u0440\u0438\u0441\u043A\u0430?",
    recommendation: "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u2014 \u043F\u043B\u043E\u0445\u043E\u0439 \u043A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440 \u043E\u0431\u044A\u0451\u043C\u0430. \u041E\u043D\u0430 \u043E\u0431\u043C\u0430\u043D\u044B\u0432\u0430\u0435\u0442 \u0447\u0430\u0449\u0435 \u0432\u0441\u0435\u0433\u043E \u0438\u043C\u0435\u043D\u043D\u043E \u043F\u043E\u0441\u043B\u0435 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u043F\u043E\u0431\u0435\u0434 \u043F\u043E\u0434\u0440\u044F\u0434."
  }
];
var GENERIC_REVIEW_QUESTIONS_EN = [
  {
    id: "g_plan",
    dataDriven: false,
    title: "Trading without a plan",
    evidence: "General question \u2014 the journal can't check this directly against numbers yet.",
    question: "How often do you open a trade without a plan written down in advance \u2014 entry, stop, and target?",
    recommendation: "Before entering, write down three numbers: entry, stop, target. If you can't \u2014 the trade isn't ready yet, that's not about the market."
  },
  {
    id: "g_overconf",
    dataDriven: false,
    title: "Risk after a winning streak",
    evidence: "General question \u2014 the journal can't check this directly against numbers yet.",
    question: "After a couple of winning trades in a row, do you feel like increasing position size?",
    recommendation: "A winning streak doesn't cancel your risk plan. If anything should increase, it's caution \u2014 not size."
  },
  {
    id: "g_honesty",
    dataDriven: false,
    title: "Journal honesty",
    evidence: "General question \u2014 the journal can't check this directly against numbers yet.",
    question: "Do you ever skip logging a bad trade so you don't have to admit it?",
    recommendation: "A journal only works if it includes the things you're embarrassed to write. A skipped entry is still a lesson \u2014 just a postponed one."
  },
  {
    id: "g_carryover",
    dataDriven: false,
    title: "Carrying emotions between trades",
    evidence: "General question \u2014 the journal can't check this directly against numbers yet.",
    question: "Do you carry irritation or euphoria from one trade into decisions on the next?",
    recommendation: "A reset ritual between trades helps \u2014 even 60 seconds of pause and one breath, so the state doesn't carry forward."
  },
  {
    id: "g_size",
    dataDriven: false,
    title: "Sizing by mood",
    evidence: "General question \u2014 the journal can't check this directly against numbers yet.",
    question: "Do you change position size based on how confident you feel in the moment, rather than a pre-set risk?",
    recommendation: "Confidence is a bad size calculator. It fools you most often right after a few wins in a row."
  }
];
function analyzeJournalForQuiz(entries, lang = "ru") {
  if (entries.length < 3) return [];
  const questions = lang === "en" ? GENERIC_REVIEW_QUESTIONS_EN : GENERIC_REVIEW_QUESTIONS;
  const wins = entries.filter((e) => e.outcome === "Win");
  const losses = entries.filter((e) => e.outcome === "Loss");
  const avg = (arr, k) => arr.reduce((s, e) => s + (e[k] || 0), 0) / arr.length;
  const sorted = [...entries].sort((a, b) => a.date - b.date);
  const issues = [];
  const wEmo = wins.filter((e) => e.x != null), lEmo = losses.filter((e) => e.x != null);
  if (wEmo.length >= 2 && lEmo.length >= 2) {
    const wX = avg(wEmo, "x"), lX = avg(lEmo, "x");
    if (lX < wX - 8) {
      issues.push(lang === "en" ? {
        id: "fear",
        dataDriven: true,
        title: "Entering out of fear",
        evidence: 'Losing trades in the journal started, on average, from a more anxious state ("Fear") than winning ones.',
        question: "Do you notice yourself opening a trade out of fear of missing something, rather than because it matched your plan?",
        recommendation: `Before you hit "enter," say your reason for the trade out loud in one sentence. If the only reason is "what if it moves without me" \u2014 that's fear, not a plan.`
      } : {
        id: "fear",
        dataDriven: true,
        title: "\u0412\u0445\u043E\u0434 \u0438\u0437 \u0441\u0442\u0440\u0430\u0445\u0430",
        evidence: "\u0423\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u043D\u0430\u0447\u0438\u043D\u0430\u043B\u0438\u0441\u044C \u0438\u0437 \u0431\u043E\u043B\u0435\u0435 \u0442\u0440\u0435\u0432\u043E\u0436\u043D\u043E\u0433\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F (\xAB\u0421\u0442\u0440\u0430\u0445\xBB), \u0447\u0435\u043C \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0435.",
        question: "\u0417\u0430\u043C\u0435\u0447\u0430\u0435\u0448\u044C, \u0447\u0442\u043E \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0448\u044C \u0441\u0434\u0435\u043B\u043A\u0443 \u0438\u0437 \u0441\u0442\u0440\u0430\u0445\u0430 \u0447\u0442\u043E-\u0442\u043E \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C, \u0430 \u043D\u0435 \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u044D\u0442\u043E \u0441\u043E\u0432\u043F\u0430\u043B\u043E \u0441 \u043F\u043B\u0430\u043D\u043E\u043C?",
        recommendation: "\u041F\u0440\u0435\u0436\u0434\u0435 \u0447\u0435\u043C \u043D\u0430\u0436\u0430\u0442\u044C \xAB\u0432 \u0441\u0434\u0435\u043B\u043A\u0443\xBB, \u0441\u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u0443\u0439 \u0432\u0441\u043B\u0443\u0445 \u043F\u0440\u0438\u0447\u0438\u043D\u0443 \u0432\u0445\u043E\u0434\u0430 \u043E\u0434\u043D\u0438\u043C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u043C. \u0415\u0441\u043B\u0438 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u043F\u0440\u0438\u0447\u0438\u043D\u0430 \u2014 \xAB\u0430 \u0432\u0434\u0440\u0443\u0433 \u0443\u0435\u0434\u0443 \u0431\u0435\u0437 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F\xBB \u2014 \u044D\u0442\u043E \u0441\u0442\u0440\u0430\u0445, \u0430 \u043D\u0435 \u043F\u043B\u0430\u043D."
      });
    }
  }
  const wYEmo = wins.filter((e) => e.y != null), lYEmo = losses.filter((e) => e.y != null);
  if (wYEmo.length >= 2 && lYEmo.length >= 2) {
    const wY = avg(wYEmo, "y"), lY = avg(lYEmo, "y");
    if (lY < wY - 8) {
      issues.push(lang === "en" ? {
        id: "nerves",
        dataDriven: true,
        title: 'Being "on edge"',
        evidence: 'Losing trades noticeably more often happened while "on edge" than winning ones.',
        question: "Before your losing trades, did you feel a sense of rushing or being wound up?",
        recommendation: "Rushing almost never comes from the market \u2014 it comes from you. If you feel wound up, that's a signal to pause, not a signal to enter faster."
      } : {
        id: "nerves",
        dataDriven: true,
        title: "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \xAB\u043D\u0430 \u043D\u0435\u0440\u0432\u0430\u0445\xBB",
        evidence: "\u0423\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0447\u0430\u0449\u0435 \u0441\u043B\u0443\u0447\u0430\u043B\u0438\u0441\u044C \u0432 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \xAB\u043D\u0430 \u043D\u0435\u0440\u0432\u0430\u0445\xBB, \u0447\u0435\u043C \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0435.",
        question: "\u041F\u0435\u0440\u0435\u0434 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u043C\u0438 \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u0438 \u0443 \u0442\u0435\u0431\u044F \u0431\u044B\u043B\u043E \u043E\u0449\u0443\u0449\u0435\u043D\u0438\u0435 \u0441\u043F\u0435\u0448\u043A\u0438 \u0438\u043B\u0438 \u0432\u0437\u0432\u0438\u043D\u0447\u0435\u043D\u043D\u043E\u0441\u0442\u0438?",
        recommendation: "\u0421\u043F\u0435\u0448\u043A\u0430 \u043F\u043E\u0447\u0442\u0438 \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442 \u043E\u0442 \u0440\u044B\u043D\u043A\u0430 \u2014 \u043E\u043D\u0430 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442 \u043E\u0442 \u0442\u0435\u0431\u044F. \u0415\u0441\u043B\u0438 \u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0435\u0448\u044C \u0432\u0437\u0432\u0438\u043D\u0447\u0435\u043D\u043D\u043E\u0441\u0442\u044C, \u044D\u0442\u043E \u0441\u0438\u0433\u043D\u0430\u043B \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u043F\u0430\u0443\u0437\u0443, \u0430 \u043D\u0435 \u0441\u0438\u0433\u043D\u0430\u043B \u0432\u0445\u043E\u0434\u0438\u0442\u044C \u0431\u044B\u0441\u0442\u0440\u0435\u0435."
      });
    }
  }
  let revengeCount = 0;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1].outcome === "Loss") {
      const gapMin = (sorted[i].date - sorted[i - 1].date) / 6e4;
      if (gapMin >= 0 && gapMin < 30) revengeCount++;
    }
  }
  if (revengeCount >= 1) {
    issues.push(lang === "en" ? {
      id: "revenge",
      dataDriven: true,
      title: "Revenge trading",
      evidence: `The journal has ${revengeCount} ${revengeCount === 1 ? "case" : "cases"} of a new trade opening within half an hour of a loss.`,
      question: "After a losing trade, do you want to win it back with a new one as fast as possible?",
      recommendation: "Set a mandatory pause after a loss \u2014 at least 20-30 minutes away from the terminal. This isn't about the market, it's about getting control back over yourself, not the price."
    } : {
      id: "revenge",
      dataDriven: true,
      title: "\u0420\u0435\u0432\u0430\u043D\u0448-\u0442\u0440\u0435\u0439\u0434\u0438\u043D\u0433",
      evidence: `\u0412 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 ${revengeCount} ${pluralRu(revengeCount, "\u0441\u043B\u0443\u0447\u0430\u0439", "\u0441\u043B\u0443\u0447\u0430\u044F", "\u0441\u043B\u0443\u0447\u0430\u0435\u0432")}, \u043A\u043E\u0433\u0434\u0430 \u043D\u043E\u0432\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u043B\u0430\u0441\u044C \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0441\u0430 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430.`,
      question: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0442\u0435\u0431\u0435 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u043C\u043E\u0436\u043D\u043E \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u043E\u0442\u044B\u0433\u0440\u0430\u0442\u044C\u0441\u044F \u043D\u043E\u0432\u043E\u0439?",
      recommendation: "\u0412\u0432\u0435\u0434\u0438 \u0434\u043B\u044F \u0441\u0435\u0431\u044F \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u0443\u044E \u043F\u0430\u0443\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u2014 \u043C\u0438\u043D\u0438\u043C\u0443\u043C 20-30 \u043C\u0438\u043D\u0443\u0442 \u0431\u0435\u0437 \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B\u0430. \u042D\u0442\u043E \u043D\u0435 \u043F\u0440\u043E \u0440\u044B\u043D\u043E\u043A, \u044D\u0442\u043E \u043F\u0440\u043E \u0442\u043E, \u0447\u0442\u043E\u0431\u044B \u0432\u0435\u0440\u043D\u0443\u0442\u044C \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043D\u0430\u0434 \u0441\u043E\u0431\u043E\u0439, \u0430 \u043D\u0435 \u043D\u0430\u0434 \u0446\u0435\u043D\u043E\u0439."
    });
  }
  const lessonCounts = {};
  entries.forEach((e) => {
    if (e.lesson && e.lesson !== "\u2014") lessonCounts[e.lesson] = (lessonCounts[e.lesson] || 0) + 1;
  });
  const repeated = Object.entries(lessonCounts).find(([, c]) => c >= 2);
  if (repeated) {
    issues.push(lang === "en" ? {
      id: "repeat",
      dataDriven: true,
      title: "A repeating lesson",
      evidence: `The lesson "${repeated[0]}" appears in the journal ${repeated[1]} times \u2014 it seems the takeaway hasn't become a habit yet.`,
      question: "Do you ever write down a lesson but still repeat the same mistake next time?",
      recommendation: `Rewrite the lesson as a specific action, not an observation \u2014 not "don't rush," but "wait for the candle to close before entering." Abstract conclusions get forgotten, instructions don't.`
    } : {
      id: "repeat",
      dataDriven: true,
      title: "\u041F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0439\u0441\u044F \u0443\u0440\u043E\u043A",
      evidence: `\u0423\u0440\u043E\u043A \xAB${repeated[0]}\xBB \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044F \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 ${repeated[1]} \u0440\u0430\u0437\u0430 \u2014 \u043F\u043E\u0445\u043E\u0436\u0435, \u0432\u044B\u0432\u043E\u0434 \u043F\u043E\u043A\u0430 \u043D\u0435 \u0441\u0442\u0430\u043B \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u043E\u0439.`,
      question: "\u0411\u044B\u0432\u0430\u0435\u0442, \u0447\u0442\u043E \u0442\u044B \u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u0443\u0435\u0448\u044C \u0443\u0440\u043E\u043A, \u043D\u043E \u0432\u0441\u0451 \u0440\u0430\u0432\u043D\u043E \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0448\u044C \u0442\u0443 \u0436\u0435 \u043E\u0448\u0438\u0431\u043A\u0443 \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437?",
      recommendation: "\u041F\u0435\u0440\u0435\u043F\u0438\u0448\u0438 \u0443\u0440\u043E\u043A \u0432 \u0444\u043E\u0440\u043C\u0430\u0442 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0433\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F, \u0430 \u043D\u0435 \u043D\u0430\u0431\u043B\u044E\u0434\u0435\u043D\u0438\u044F \u2014 \u043D\u0435 \xAB\u043D\u0435 \u0442\u043E\u0440\u043E\u043F\u0438\u0442\u044C\u0441\u044F\xBB, \u0430 \xAB\u0436\u0434\u0430\u0442\u044C \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u044F \u0441\u0432\u0435\u0447\u0438 \u043F\u0435\u0440\u0435\u0434 \u0432\u0445\u043E\u0434\u043E\u043C\xBB. \u0410\u0431\u0441\u0442\u0440\u0430\u043A\u0442\u043D\u044B\u0435 \u0432\u044B\u0432\u043E\u0434\u044B \u0437\u0430\u0431\u044B\u0432\u0430\u044E\u0442\u0441\u044F, \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u0438 \u2014 \u043D\u0435\u0442."
    });
  }
  const withR = entries.filter((e) => e.r != null && e.r !== void 0);
  if (withR.length >= 4) {
    const rs = withR.map((e) => e.r);
    const avgAbs = rs.reduce((s, r) => s + Math.abs(r), 0) / rs.length;
    const maxLoss = Math.min(...rs);
    if (maxLoss < -avgAbs * 2.5 && maxLoss <= -1) {
      issues.push(lang === "en" ? {
        id: "outlier",
        dataDriven: true,
        title: "Unstable risk size",
        evidence: `There's a trade with a result of ${maxLoss.toFixed(1)}, noticeably bigger than your usual risk per trade.`,
        question: "Do you set your risk size before entering a trade, rather than adjusting it as you go?",
        recommendation: "A spread in loss size usually says more about unstable in-the-moment decisions than about the market. Fix your risk in R or % before you enter \u2014 that should be decided before the terminal is even open."
      } : {
        id: "outlier",
        dataDriven: true,
        title: "\u041D\u0435\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0438\u0441\u043A\u0430",
        evidence: `\u0415\u0441\u0442\u044C \u0441\u0434\u0435\u043B\u043A\u0430 \u0441 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u043C ${maxLoss.toFixed(1)}, \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043A\u0440\u0443\u043F\u043D\u0435\u0435 \u0442\u0432\u043E\u0435\u0433\u043E \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E \u0440\u0438\u0441\u043A\u0430 \u043D\u0430 \u0441\u0434\u0435\u043B\u043A\u0443.`,
        question: "\u0422\u044B \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0435\u0448\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0438\u0441\u043A\u0430 \u0434\u043E \u0432\u0445\u043E\u0434\u0430 \u0432 \u0441\u0434\u0435\u043B\u043A\u0443, \u0430 \u043D\u0435 \u043F\u043E \u0445\u043E\u0434\u0443 \u043D\u0435\u0451?",
        recommendation: "\u0420\u0430\u0437\u0431\u0440\u043E\u0441 \u0432 \u0440\u0430\u0437\u043C\u0435\u0440\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u043E\u0431\u044B\u0447\u043D\u043E \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u043D\u0435 \u043E \u0440\u044B\u043D\u043A\u0435, \u0430 \u043E \u043D\u0435\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u0440\u0435\u0448\u0435\u043D\u0438\u0439 \u0432 \u043C\u043E\u043C\u0435\u043D\u0442\u0435. \u0424\u0438\u043A\u0441\u0438\u0440\u0443\u0439 \u0440\u0438\u0441\u043A \u0432 R \u0438\u043B\u0438 % \u0435\u0449\u0451 \u0434\u043E \u0432\u0445\u043E\u0434\u0430 \u2014 \u044D\u0442\u043E \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0440\u0435\u0448\u0435\u043D\u043E \u0440\u0430\u043D\u044C\u0448\u0435, \u0447\u0435\u043C \u043E\u0442\u043A\u0440\u044B\u0442 \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B."
      });
    }
  }
  const dayCounts = {};
  entries.forEach((e) => {
    const k = e.date.toDateString();
    dayCounts[k] = (dayCounts[k] || 0) + 1;
  });
  const dayCountValues = Object.values(dayCounts);
  const maxDay = Math.max(...dayCountValues);
  const avgDay = dayCountValues.reduce((s, c) => s + c, 0) / dayCountValues.length;
  if (maxDay >= 4 && maxDay > avgDay * 1.8) {
    issues.push(lang === "en" ? {
      id: "overtrade",
      dataDriven: true,
      title: "Overtrading",
      evidence: `On one day, the journal shows ${maxDay} trades \u2014 noticeably more than the average (${avgDay.toFixed(1)} per day).`,
      question: "Do you notice that on some days you open way more trades than you planned that morning?",
      recommendation: "Set a daily trade limit in advance and physically stop once you hit it \u2014 regardless of whether you're up or down."
    } : {
      id: "overtrade",
      dataDriven: true,
      title: "\u041F\u0435\u0440\u0435\u0442\u0440\u0435\u0439\u0434\u0438\u043D\u0433",
      evidence: `\u0412 \u043E\u0434\u0438\u043D \u0438\u0437 \u0434\u043D\u0435\u0439 \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 ${maxDay} ${pluralRu(maxDay, "\u0441\u0434\u0435\u043B\u043A\u0430", "\u0441\u0434\u0435\u043B\u043A\u0438", "\u0441\u0434\u0435\u043B\u043E\u043A")} \u2014 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0431\u043E\u043B\u044C\u0448\u0435, \u0447\u0435\u043C \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C (${avgDay.toFixed(1)} \u0432 \u0434\u0435\u043D\u044C).`,
      question: "\u0417\u0430\u043C\u0435\u0447\u0430\u0435\u0448\u044C, \u0447\u0442\u043E \u0432 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0435 \u0434\u043D\u0438 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0448\u044C \u0441\u0438\u043B\u044C\u043D\u043E \u0431\u043E\u043B\u044C\u0448\u0435 \u0441\u0434\u0435\u043B\u043E\u043A, \u0447\u0435\u043C \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043B \u0441 \u0443\u0442\u0440\u0430?",
      recommendation: "\u0417\u0430\u0440\u0430\u043D\u0435\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438 \u043B\u0438\u043C\u0438\u0442 \u0441\u0434\u0435\u043B\u043E\u043A \u043D\u0430 \u0434\u0435\u043D\u044C \u0438 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u0438 \u043E\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0439\u0441\u044F, \u043A\u043E\u0433\u0434\u0430 \u043E\u043D \u0434\u043E\u0441\u0442\u0438\u0433\u043D\u0443\u0442 \u2014 \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u0442\u043E\u0433\u043E, \u0432 \u043F\u043B\u044E\u0441\u0435 \u0442\u044B \u0438\u043B\u0438 \u0432 \u043C\u0438\u043D\u0443\u0441\u0435."
    });
  }
  let streak = 0, maxStreak = 0;
  sorted.forEach((e) => {
    if (e.outcome === "Loss") {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else streak = 0;
  });
  if (maxStreak >= 3) {
    issues.push(lang === "en" ? {
      id: "streak",
      dataDriven: true,
      title: "A streak of consecutive losses",
      evidence: `The journal has a streak of ${maxStreak} consecutive losing trades with no winning trade in between.`,
      question: "Do you keep trading the same way even after several losses in a row?",
      recommendation: "After the second loss in a row \u2014 that's already a signal to stop and figure out why, not a signal to add size on the next one."
    } : {
      id: "streak",
      dataDriven: true,
      title: "\u0421\u0435\u0440\u0438\u044F \u0443\u0431\u044B\u0442\u043A\u043E\u0432 \u043F\u043E\u0434\u0440\u044F\u0434",
      evidence: `\u0412 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 \u0435\u0441\u0442\u044C \u0441\u0435\u0440\u0438\u044F \u0438\u0437 ${maxStreak} \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u043F\u043E\u0434\u0440\u044F\u0434 \u0431\u0435\u0437 \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u043E\u0439 \u043C\u0435\u0436\u0434\u0443 \u043D\u0438\u043C\u0438.`,
      question: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0448\u044C \u0442\u043E\u0440\u0433\u043E\u0432\u0430\u0442\u044C \u0432 \u0442\u043E\u043C \u0436\u0435 \u0440\u0435\u0436\u0438\u043C\u0435, \u0434\u0430\u0436\u0435 \u043F\u043E\u0441\u043B\u0435 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0443\u0431\u044B\u0442\u043A\u043E\u0432 \u043F\u043E\u0434\u0440\u044F\u0434?",
      recommendation: "\u041F\u043E\u0441\u043B\u0435 \u0432\u0442\u043E\u0440\u043E\u0439 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u0434\u0440\u044F\u0434 \u2014 \u044D\u0442\u043E \u0443\u0436\u0435 \u0441\u0438\u0433\u043D\u0430\u043B \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C\u0441\u044F \u0438 \u0440\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C\u0441\u044F, \u0430 \u043D\u0435 \u0441\u0438\u0433\u043D\u0430\u043B \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u0431\u044A\u0451\u043C \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439."
    });
  }
  const lossesAfterWin = [], lossesAfterLoss = [];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].outcome === "Loss" && sorted[i].r != null) {
      if (sorted[i - 1].outcome === "Win") lossesAfterWin.push(sorted[i].r);
      else if (sorted[i - 1].outcome === "Loss") lossesAfterLoss.push(sorted[i].r);
    }
  }
  if (lossesAfterWin.length >= 2 && lossesAfterLoss.length >= 1) {
    const avgAfterWin = lossesAfterWin.reduce((s, r) => s + r, 0) / lossesAfterWin.length;
    const avgAfterLoss = lossesAfterLoss.reduce((s, r) => s + r, 0) / lossesAfterLoss.length;
    if (avgAfterWin < avgAfterLoss - 0.3) {
      issues.push(lang === "en" ? {
        id: "overconfidence",
        dataDriven: true,
        title: "Risk grows after wins",
        evidence: "Losses that happened right after a winning trade are, on average, bigger than losses after another loss.",
        question: "After a winning trade, do you feel more comfortable risking more on the next one?",
        recommendation: "A win doesn't make the next setup any more valid. Keep your risk size constant regardless of what happened on the last trade."
      } : {
        id: "overconfidence",
        dataDriven: true,
        title: "\u0420\u0438\u0441\u043A \u0440\u0430\u0441\u0442\u0451\u0442 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0431\u0435\u0434",
        evidence: "\u0423\u0431\u044B\u0442\u043A\u0438, \u0441\u043B\u0443\u0447\u0438\u0432\u0448\u0438\u0435\u0441\u044F \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438, \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u043A\u0440\u0443\u043F\u043D\u0435\u0435 \u0443\u0431\u044B\u0442\u043A\u043E\u0432 \u043F\u043E\u0441\u043B\u0435 \u0434\u0440\u0443\u0433\u043E\u0433\u043E \u0443\u0431\u044B\u0442\u043A\u0430.",
        question: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0434\u0430\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0442\u0435\u0431\u0435 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u0435\u0435 \u0440\u0438\u0441\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439?",
        recommendation: "\u041F\u043E\u0431\u0435\u0434\u0430 \u043D\u0435 \u0434\u0435\u043B\u0430\u0435\u0442 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0441\u0435\u0442\u0430\u043F \u0431\u043E\u043B\u0435\u0435 \u0432\u0435\u0440\u043D\u044B\u043C. \u0414\u0435\u0440\u0436\u0438 \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0438\u0441\u043A\u0430 \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u044B\u043C \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u0442\u043E\u0433\u043E, \u0447\u0442\u043E \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u043E \u043D\u0430 \u043F\u0440\u043E\u0448\u043B\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0435."
      });
    }
  }
  if (losses.length >= 3) {
    const lossesNoShot = losses.filter((e) => !e.screenshots || e.screenshots.length === 0).length;
    if (lossesNoShot / losses.length > 0.75) {
      issues.push(lang === "en" ? {
        id: "noshot",
        dataDriven: true,
        title: "Avoiding loss review",
        evidence: `${lossesNoShot} of ${losses.length} losing trades in the journal have no chart screenshot.`,
        question: "Do you feel uncomfortable revisiting the chart after a losing trade?",
        recommendation: "A screenshot of a losing trade is the most useful material in the journal, not the most pleasant. Make a habit of saving exactly what you don't want to revisit."
      } : {
        id: "noshot",
        dataDriven: true,
        title: "\u0418\u0437\u0431\u0435\u0433\u0430\u043D\u0438\u0435 \u0440\u0430\u0437\u0431\u043E\u0440\u0430 \u0443\u0431\u044B\u0442\u043A\u043E\u0432",
        evidence: `${lossesNoShot} \u0438\u0437 ${losses.length} \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 ${pluralRu(losses.length, "\u0441\u0434\u0435\u043B\u043A\u0438", "\u0441\u0434\u0435\u043B\u043E\u043A", "\u0441\u0434\u0435\u043B\u043E\u043A")} \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 \u2014 \u0431\u0435\u0437 \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u0430 \u0433\u0440\u0430\u0444\u0438\u043A\u0430.`,
        question: "\u0422\u0435\u0431\u0435 \u043D\u0435\u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E \u043F\u0435\u0440\u0435\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u0442\u044C \u0433\u0440\u0430\u0444\u0438\u043A \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438?",
        recommendation: "\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u2014 \u0441\u0430\u043C\u044B\u0439 \u043F\u043E\u043B\u0435\u0437\u043D\u044B\u0439 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435, \u043D\u0435 \u0441\u0430\u043C\u044B\u0439 \u043F\u0440\u0438\u044F\u0442\u043D\u044B\u0439. \u0412\u043E\u0437\u044C\u043C\u0438 \u0437\u0430 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0443 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0442\u044C \u0438\u043C\u0435\u043D\u043D\u043E \u0442\u043E, \u0447\u0442\u043E \u043D\u0435 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043F\u0435\u0440\u0435\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u0442\u044C."
      });
    }
  }
  if (losses.length >= 3) {
    const shallow = losses.filter((e) => !e.lesson || e.lesson === "\u2014" || e.lesson.trim().length < 15).length;
    if (shallow / losses.length > 0.6) {
      issues.push(lang === "en" ? {
        id: "shallow",
        dataDriven: true,
        title: "Shallow reflection",
        evidence: "Most losing trades in the journal are described without a real takeaway.",
        question: "After a loss, do you want to close the subject quickly rather than dig into the reason?",
        recommendation: `One line of "bad luck" doesn't count as a lesson. Try finishing the sentence "Next time I'll do it differently if..." \u2014 and write it honestly.`
      } : {
        id: "shallow",
        dataDriven: true,
        title: "\u041F\u043E\u0432\u0435\u0440\u0445\u043D\u043E\u0441\u0442\u043D\u0430\u044F \u0440\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u044F",
        evidence: "\u0411\u043E\u043B\u044C\u0448\u0430\u044F \u0447\u0430\u0441\u0442\u044C \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0430 \u0431\u0435\u0437 \u0440\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u043E\u0433\u043E \u0432\u044B\u0432\u043E\u0434\u0430.",
        question: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043F\u043E\u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u044C \u0442\u0435\u043C\u0443, \u0430 \u043D\u0435 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0442\u044C\u0441\u044F \u0432 \u043F\u0440\u0438\u0447\u0438\u043D\u0435?",
        recommendation: "\u041E\u0434\u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0430 \xAB\u043D\u0435 \u043F\u043E\u0432\u0435\u0437\u043B\u043E\xBB \u043D\u0435 \u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u0443\u0440\u043E\u043A\u043E\u043C. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u0442\u044C \u0444\u0440\u0430\u0437\u0443 \xAB\u0412 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437 \u044F \u0441\u0434\u0435\u043B\u0430\u044E \u0438\u043D\u0430\u0447\u0435, \u0435\u0441\u043B\u0438...\xBB \u2014 \u0438 \u0434\u043E\u043F\u0438\u0441\u0430\u0442\u044C \u0435\u0451 \u0447\u0435\u0441\u0442\u043D\u043E."
      });
    }
  }
  let selected = issues.slice(0, REVIEW_MAX_QUESTIONS);
  if (selected.length < REVIEW_MIN_QUESTIONS) {
    const usedIds = new Set(selected.map((i) => i.id));
    for (const g of questions) {
      if (selected.length >= REVIEW_MIN_QUESTIONS) break;
      if (!usedIds.has(g.id)) selected.push(g);
    }
  }
  return selected;
}
var PATTERN_QUIZ_MAP = {
  fear: { question: "\u0417\u0430\u043C\u0435\u0447\u0430\u0435\u0448\u044C, \u0447\u0442\u043E \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0448\u044C \u0441\u0434\u0435\u043B\u043A\u0443 \u0438\u0437 \u0441\u0442\u0440\u0430\u0445\u0430 \u0447\u0442\u043E-\u0442\u043E \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C, \u0430 \u043D\u0435 \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u044D\u0442\u043E \u0441\u043E\u0432\u043F\u0430\u043B\u043E \u0441 \u043F\u043B\u0430\u043D\u043E\u043C?" },
  too_calm: { question: "\u0411\u044B\u0432\u0430\u0435\u0442, \u0447\u0442\u043E \u0432 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E\u043C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \u0442\u044B \u043C\u0435\u043D\u044C\u0448\u0435 \u0441\u043B\u0435\u0434\u0438\u0448\u044C \u0437\u0430 \u0440\u0438\u0441\u043A\u043E\u043C, \u0447\u0435\u043C \u043E\u0431\u044B\u0447\u043D\u043E?" },
  confidence_tension: { question: "\u0411\u044B\u0432\u0430\u0435\u0442, \u0447\u0442\u043E \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0432 \u0441\u0434\u0435\u043B\u043A\u0435 \u0441\u043E\u0447\u0435\u0442\u0430\u0435\u0442\u0441\u044F \u0441 \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u043C \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435\u043C, \u0430 \u043D\u0435 \u0441\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u0435\u043C?" },
  revenge: { question: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0442\u0435\u0431\u0435 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u043C\u043E\u0436\u043D\u043E \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u043E\u0442\u044B\u0433\u0440\u0430\u0442\u044C\u0441\u044F \u043D\u043E\u0432\u043E\u0439?" },
  lesson_not_learned: { question: "\u0411\u044B\u0432\u0430\u0435\u0442, \u0447\u0442\u043E \u0442\u044B \u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u0443\u0435\u0448\u044C \u0443\u0440\u043E\u043A, \u043D\u043E \u0432\u0441\u0451 \u0440\u0430\u0432\u043D\u043E \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0448\u044C \u0442\u0443 \u0436\u0435 \u043E\u0448\u0438\u0431\u043A\u0443 \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437?" },
  unstable_risk: { question: "\u041C\u0435\u043D\u044F\u0435\u0442\u0441\u044F \u043B\u0438 \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0438\u0441\u043A\u0430 \u043E\u0442 \u0441\u0434\u0435\u043B\u043A\u0438 \u043A \u0441\u0434\u0435\u043B\u043A\u0435 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u0435\u0435, \u0447\u0435\u043C \u0442\u044B \u0441\u0430\u043C \u043F\u043B\u0430\u043D\u0438\u0440\u0443\u0435\u0448\u044C?" },
  overtrading: { question: "\u0417\u0430\u043C\u0435\u0447\u0430\u0435\u0448\u044C, \u0447\u0442\u043E \u0432 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0435 \u0434\u043D\u0438 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0448\u044C \u0441\u0438\u043B\u044C\u043D\u043E \u0431\u043E\u043B\u044C\u0448\u0435 \u0441\u0434\u0435\u043B\u043E\u043A, \u0447\u0435\u043C \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043B \u0441 \u0443\u0442\u0440\u0430?" },
  loss_streak: { question: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0448\u044C \u0442\u043E\u0440\u0433\u043E\u0432\u0430\u0442\u044C \u0432 \u0442\u043E\u043C \u0436\u0435 \u0440\u0435\u0436\u0438\u043C\u0435, \u0434\u0430\u0436\u0435 \u043F\u043E\u0441\u043B\u0435 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0443\u0431\u044B\u0442\u043A\u043E\u0432 \u043F\u043E\u0434\u0440\u044F\u0434?" },
  risk_after_win: { question: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0434\u0430\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0442\u0435\u0431\u0435 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u0435\u0435 \u0440\u0438\u0441\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439?" },
  avoid_loss_review: { question: "\u0422\u0435\u0431\u0435 \u043D\u0435\u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E \u043F\u0435\u0440\u0435\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u0442\u044C \u0433\u0440\u0430\u0444\u0438\u043A \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438?" },
  shallow_reflection: { question: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043F\u043E\u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u044C \u0442\u0435\u043C\u0443, \u0430 \u043D\u0435 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0442\u044C\u0441\u044F \u0432 \u043F\u0440\u0438\u0447\u0438\u043D\u0435?" }
};
var PATTERN_QUIZ_MAP_EN = {
  fear: { question: "Do you notice yourself opening a trade out of fear of missing something, rather than because it matched your plan?" },
  too_calm: { question: "Does being calm sometimes mean you watch risk less closely than usual?" },
  confidence_tension: { question: "Does confidence in a trade sometimes come with inner tension rather than calm?" },
  revenge: { question: "After a losing trade, do you want to win it back with a new one as fast as possible?" },
  lesson_not_learned: { question: "Do you ever write down a lesson but still repeat the same mistake next time?" },
  unstable_risk: { question: "Does your risk size vary from trade to trade noticeably more than you actually plan?" },
  overtrading: { question: "Do you notice that on some days you open way more trades than you planned that morning?" },
  loss_streak: { question: "Do you keep trading the same way even after several losses in a row?" },
  risk_after_win: { question: "After a winning trade, do you feel more comfortable risking more on the next one?" },
  avoid_loss_review: { question: "Do you feel uncomfortable revisiting the chart after a losing trade?" },
  shallow_reflection: { question: "After a loss, do you want to close the subject quickly rather than dig into the reason?" }
};
function buildReviewIssuesFromPatterns(patternsResult, lang = "ru") {
  const map = lang === "en" ? PATTERN_QUIZ_MAP_EN : PATTERN_QUIZ_MAP;
  return (patternsResult.patterns || []).map((p) => {
    const meta = map[p.id];
    if (!meta) return null;
    return { id: p.id, dataDriven: true, title: p.title, evidence: p.description, question: meta.question, recommendation: p.recommendation };
  }).filter(Boolean);
}
function buildReviewQuiz(entries, lang = "ru") {
  if (entries.length < 3) return [];
  const patternsResult = patternEngineV2(entries, lang);
  if (!patternsResult.available) return analyzeJournalForQuiz(entries, lang);
  const questions = lang === "en" ? GENERIC_REVIEW_QUESTIONS_EN : GENERIC_REVIEW_QUESTIONS;
  let selected = buildReviewIssuesFromPatterns(patternsResult, lang).slice(0, REVIEW_MAX_QUESTIONS);
  if (selected.length < REVIEW_MIN_QUESTIONS) {
    const usedIds = new Set(selected.map((i) => i.id));
    for (const g of questions) {
      if (selected.length >= REVIEW_MIN_QUESTIONS) break;
      if (!usedIds.has(g.id)) selected.push(g);
    }
  }
  return selected;
}
function scoreJournalReview(issues, answers, lang = "ru") {
  const answered = issues.filter((q) => answers[q.id] != null);
  const total = answered.reduce((s, q) => s + answers[q.id].score, 0);
  const maxTotal = answered.length * 3;
  const pct = maxTotal > 0 ? Math.round(total / maxTotal * 100) : 0;
  const tier = lang === "en" ? pct >= 66 ? { label: "Emotions are currently steering your trades more than your plan.", color: LOSS } : pct >= 33 ? { label: "There's something worth watching, but it's not critical.", color: WARN } : { label: "Discipline looks solid.", color: WIN } : pct >= 66 ? { label: "\u042D\u043C\u043E\u0446\u0438\u0438 \u0441\u0435\u0439\u0447\u0430\u0441 \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u044E\u0442 \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u0438 \u0431\u043E\u043B\u044C\u0448\u0435, \u0447\u0435\u043C \u043F\u043B\u0430\u043D.", color: LOSS } : pct >= 33 ? { label: "\u0415\u0441\u0442\u044C \u043D\u0430 \u0447\u0442\u043E \u043E\u0431\u0440\u0430\u0442\u0438\u0442\u044C \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435, \u043D\u043E \u043D\u0435 \u043A\u0440\u0438\u0442\u0438\u0447\u043D\u043E.", color: WARN } : { label: "\u0414\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430 \u0432\u044B\u0433\u043B\u044F\u0434\u0438\u0442 \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E.", color: WIN };
  const confirmed = issues.filter((q) => (answers[q.id]?.score ?? 0) >= 2).sort((a, b) => (answers[b.id]?.score ?? 0) - (answers[a.id]?.score ?? 0));
  const clear = issues.filter((q) => (answers[q.id]?.score ?? 0) <= 1);
  const priority = confirmed[0] || null;
  const rest = confirmed.slice(1);
  const crossValidated = confirmed.filter((q) => q.dataDriven);
  let narrative;
  if (lang === "en") {
    if (confirmed.length === 0) {
      narrative = "Based on your answers, no strong problem patterns stand out \u2014 that's a good result, but not a reason to drop your guard: take the review again after a few more trades.";
    } else {
      const titles = confirmed.map((q) => q.title.toLowerCase());
      narrative = titles.length === 1 ? `Right now, the biggest influence on your decisions is: ${titles[0]}.` : `Right now, the biggest influence on your decisions is: ${titles.slice(0, -1).join(", ")}, and ${titles[titles.length - 1]}.`;
      if (crossValidated.length > 0) {
        narrative += crossValidated.length === confirmed.length ? " This shows up not just in your answers, but in the journal's own numbers too \u2014 it matches your actual trades, not just how it feels." : ` Some of this (${crossValidated.map((q) => q.title.toLowerCase()).join(", ")}) also shows up in the journal's own numbers, not just in your answers.`;
      }
    }
  } else {
    if (confirmed.length === 0) {
      narrative = "\u041F\u043E \u0442\u0432\u043E\u0438\u043C \u043E\u0442\u0432\u0435\u0442\u0430\u043C \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u044B\u0445 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u043D\u044B\u0445 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u043E\u0432 \u043D\u0435 \u0432\u0438\u0434\u043D\u043E \u2014 \u044D\u0442\u043E \u0445\u043E\u0440\u043E\u0448\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442, \u043D\u043E \u043D\u0435 \u043F\u043E\u0432\u043E\u0434 \u0442\u0435\u0440\u044F\u0442\u044C \u0431\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C: \u043F\u0440\u043E\u0439\u0434\u0438 \u0440\u0430\u0437\u0431\u043E\u0440 \u0435\u0449\u0451 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0434\u0435\u043B\u043E\u043A.";
    } else {
      const titles = confirmed.map((q) => q.title.toLowerCase());
      narrative = titles.length === 1 ? `\u0421\u0438\u043B\u044C\u043D\u0435\u0435 \u0432\u0441\u0435\u0433\u043E \u043D\u0430 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0441\u0435\u0439\u0447\u0430\u0441 \u0432\u043B\u0438\u044F\u0435\u0442: ${titles[0]}.` : `\u0421\u0438\u043B\u044C\u043D\u0435\u0435 \u0432\u0441\u0435\u0433\u043E \u043D\u0430 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0441\u0435\u0439\u0447\u0430\u0441 \u0432\u043B\u0438\u044F\u0435\u0442: ${titles.slice(0, -1).join(", ")} \u0438 ${titles[titles.length - 1]}.`;
      if (crossValidated.length > 0) {
        narrative += crossValidated.length === confirmed.length ? " \u042D\u0442\u043E \u0432\u0438\u0434\u043D\u043E \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E \u043E\u0442\u0432\u0435\u0442\u0430\u043C, \u043D\u043E \u0438 \u0432 \u0441\u0430\u043C\u0438\u0445 \u0446\u0438\u0444\u0440\u0430\u0445 \u0436\u0443\u0440\u043D\u0430\u043B\u0430 \u2014 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u0441 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u043C\u0438 \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u0438, \u0430 \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0441 \u043E\u0449\u0443\u0449\u0435\u043D\u0438\u0435\u043C." : ` \u0427\u0430\u0441\u0442\u044C \u044D\u0442\u043E\u0433\u043E (${crossValidated.map((q) => q.title.toLowerCase()).join(", ")}) \u0432\u0438\u0434\u043D\u043E \u0438 \u0432 \u0441\u0430\u043C\u0438\u0445 \u0446\u0438\u0444\u0440\u0430\u0445 \u0436\u0443\u0440\u043D\u0430\u043B\u0430, \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u043E\u0442\u0432\u0435\u0442\u0430\u0445.`;
      }
    }
  }
  return { pct, tier, narrative, priority, rest, confirmed, clear };
}
var TA_CONFIDENCE_THRESHOLDS = { low: 5, moderate: 15, high: 30 };
function ta_confidence(sampleSize, thresholds = TA_CONFIDENCE_THRESHOLDS) {
  if (!sampleSize || sampleSize < thresholds.low) return "insufficient";
  if (sampleSize < thresholds.moderate) return "low";
  if (sampleSize < thresholds.high) return "moderate";
  return "high";
}
function ta_metric(value, sampleSize, thresholds) {
  return { value, sampleSize, confidence: ta_confidence(sampleSize, thresholds) };
}
function st_mean(arr) {
  if (!arr || !arr.length) return null;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}
function st_median(arr) {
  if (!arr || !arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function st_stdev(arr) {
  if (!arr || arr.length < 2) return null;
  const m = st_mean(arr);
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}
var st_round2 = (v) => v == null ? null : Math.round(v * 100) / 100;
var TA_TREND_WINDOW = 20;
function ta_splitRecent(sortedEntries, windowSize = TA_TREND_WINDOW) {
  const n = sortedEntries.length;
  const recent = sortedEntries.slice(Math.max(0, n - windowSize));
  const previous = sortedEntries.slice(Math.max(0, n - 2 * windowSize), Math.max(0, n - windowSize));
  return { recent, previous };
}
function ta_trend(currentValue, previousValue, epsilon = 1, higherIsBetter = true) {
  if (currentValue == null || previousValue == null) return "insufficient_data";
  const diff = currentValue - previousValue;
  if (Math.abs(diff) < epsilon) return "stable";
  const rising = diff > 0;
  return rising === higherIsBetter ? "improving" : "declining";
}
var TREND_ARROW = { improving: " \u2191", declining: " \u2193", stable: "", insufficient_data: "" };
var RQ_CAUSE_MARKERS = ["\u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E", "\u0438\u0437-\u0437\u0430", "\u0442.\u043A.", "\u0442\u0430\u043A \u043A\u0430\u043A", "\u043F\u043E\u044D\u0442\u043E\u043C\u0443", "\u0432\u0435\u0434\u044C"];
var RQ_ACTION_MARKERS = ["\u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437", "\u0431\u0443\u0434\u0443", "\u0441\u0434\u0435\u043B\u0430\u044E", "\u043F\u0435\u0440\u0435\u0441\u0442\u0430\u043D\u0443", "\u043D\u0430\u0447\u043D\u0443", "\u043D\u0435 \u0431\u0443\u0434\u0443", "\u043D\u0430\u0434\u043E \u0431\u0443\u0434\u0435\u0442", "\u0441\u0442\u043E\u0438\u0442"];
function ta_reflectionQualityForEntry(entry) {
  const pull = (entry.pull || "").trim();
  const lesson = (entry.lesson || "").trim();
  const hasPull = pull && pull !== "\u2014";
  const hasLesson = lesson && lesson !== "\u2014";
  if (!hasPull && !hasLesson) return 0;
  let score = 0;
  if (hasPull) score += 20;
  if (hasLesson) score += 20;
  const combined = `${pull} ${lesson}`.toLowerCase();
  const hasCause = RQ_CAUSE_MARKERS.some((m) => combined.includes(m));
  const hasAction = RQ_ACTION_MARKERS.some((m) => combined.includes(m));
  const hasNumberOrTime = /\d/.test(combined);
  if (hasCause) score += 20;
  if (hasAction) score += 25;
  if (hasNumberOrTime) score += 15;
  const wordCount = combined.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 6 && (hasCause || hasAction)) score += Math.min(10, Math.floor(wordCount / 6));
  return Math.max(0, Math.min(100, score));
}
function reflectionAnalysis(entries) {
  const withText = entries.filter((e) => e.pull && e.pull !== "\u2014" || e.lesson && e.lesson !== "\u2014");
  const scores = entries.map(ta_reflectionQualityForEntry).filter((_, i) => entries[i].pull && entries[i].pull !== "\u2014" || entries[i].lesson && entries[i].lesson !== "\u2014");
  const avgScore = st_mean(scores);
  const withLessons = entries.filter((e) => e.lesson && e.lesson !== "\u2014" && e.lesson.trim().length > 3);
  const words = withLessons.map((e) => pe_normalizeLesson(e.lesson));
  const clusters = [];
  for (let i = 0; i < withLessons.length; i++) {
    let placed = false;
    for (const c of clusters) {
      if (pe_lessonSimilarity(words[i], words[c.members[0]]) >= 0.5) {
        c.members.push(i);
        placed = true;
        break;
      }
    }
    if (!placed) clusters.push({ members: [i] });
  }
  const repeatedLessons = clusters.filter((c) => c.members.length >= 2).map((c) => ({ text: withLessons[c.members[0]].lesson, count: c.members.length })).sort((a, b) => b.count - a.count);
  const losses = entries.filter((e) => e.outcome === "Loss");
  const lossesWithShots = losses.filter((e) => Array.isArray(e.screenshots) && e.screenshots.length > 0);
  return {
    score: ta_metric(avgScore != null ? Math.round(avgScore) : null, withText.length),
    repeatedLessons,
    lossReviewCoverage: losses.length ? ta_metric(Math.round(lossesWithShots.length / losses.length * 100), losses.length) : ta_metric(null, 0)
  };
}
var EMOTION_ZONES = [
  { id: "fear_avoidance", title: "\u0421\u0442\u0440\u0430\u0445 / \u0438\u0437\u0431\u0435\u0433\u0430\u043D\u0438\u0435", test: (x, y) => x < 50 && y < 50 },
  { id: "tense_confidence", title: "\u041D\u0430\u043F\u0440\u044F\u0436\u0451\u043D\u043D\u0430\u044F \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C", test: (x, y) => x >= 50 && y < 50 },
  { id: "calm_confidence", title: "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u0430\u044F \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C", test: (x, y) => x >= 50 && y >= 50 },
  { id: "doubt_neutral", title: "\u0421\u043E\u043C\u043D\u0435\u043D\u0438\u0435 / \u043D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C", test: (x, y) => x < 50 && y >= 50 }
];
function ta_zoneStats(group) {
  const withR = group.filter((t) => typeof t.r === "number" && !isNaN(t.r));
  const rs = withR.map((t) => t.r);
  const wins = group.filter((t) => t.outcome === "Win").length;
  const losses = group.filter((t) => t.outcome === "Loss").length;
  let maxLossStreak = 0, streak = 0;
  [...group].sort((a, b) => a.date - b.date).forEach((t) => {
    if (t.outcome === "Loss") {
      streak++;
      maxLossStreak = Math.max(maxLossStreak, streak);
    } else streak = 0;
  });
  return {
    trades: group.length,
    winRate: group.length ? Math.round(wins / group.length * 100) : null,
    meanR: st_round2(st_mean(rs)),
    medianR: st_round2(st_median(rs)),
    meanAbsR: st_round2(st_mean(rs.map(Math.abs))),
    lossShare: group.length ? Math.round(losses / group.length * 100) : null,
    maxLossStreak
  };
}
function emotionalAnalysis(entries) {
  const complete = entries.filter((e) => e.x != null && e.y != null && !isNaN(e.x) && !isNaN(e.y));
  if (!complete.length) {
    return { average: null, volatility: null, zones: [], bestState: null, worstState: null, confidence: "insufficient" };
  }
  const xs = complete.map((e) => e.x), ys = complete.map((e) => e.y);
  const average = { x: Math.round(st_mean(xs)), y: Math.round(st_mean(ys)) };
  const volatility = { x: st_round2(st_stdev(xs)), y: st_round2(st_stdev(ys)) };
  const zones = EMOTION_ZONES.map((z) => {
    const group = complete.filter((e) => z.test(e.x, e.y));
    return { id: z.id, title: z.title, ...ta_zoneStats(group), confidence: ta_confidence(group.length, { low: 5, moderate: 20, high: 30 }) };
  });
  const ranked = zones.filter((z) => z.trades >= 5 && z.medianR != null);
  const bestState = ranked.length ? ranked.reduce((a, b) => b.medianR > a.medianR ? b : a) : null;
  const worstState = ranked.length ? ranked.reduce((a, b) => b.medianR < a.medianR ? b : a) : null;
  return { average, volatility, zones, bestState, worstState, confidence: ta_confidence(complete.length) };
}
function riskAnalysis(sortedEntries) {
  const withR = sortedEntries.filter((t) => typeof t.r === "number" && !isNaN(t.r));
  if (withR.length < 5) {
    return {
      stability: ta_metric(null, withR.length),
      averageRisk: null,
      volatility: null,
      postLossChange: ta_metric(null, 0),
      postWinChange: ta_metric(null, 0)
    };
  }
  const mags = withR.map((t) => Math.abs(t.r));
  const meanMag = st_mean(mags);
  const sd = st_stdev(mags);
  const cv = meanMag ? sd / meanMag : 0;
  const stability = Math.round(Math.max(0, 100 - cv * 100));
  const postLoss = [], postWin = [];
  for (let i = 1; i < sortedEntries.length; i++) {
    const prev = sortedEntries[i - 1], cur = sortedEntries[i];
    if (typeof prev.r !== "number" || typeof cur.r !== "number") continue;
    if (prev.outcome === "Loss") postLoss.push({ prevAbs: Math.abs(prev.r), curAbs: Math.abs(cur.r) });
    else if (prev.outcome === "Win") postWin.push({ prevAbs: Math.abs(prev.r), curAbs: Math.abs(cur.r) });
  }
  const pctChange = (pairs) => {
    if (!pairs.length) return null;
    const prevMean = st_mean(pairs.map((p) => p.prevAbs));
    const curMean = st_mean(pairs.map((p) => p.curAbs));
    if (!prevMean) return null;
    return Math.round((curMean - prevMean) / prevMean * 100);
  };
  return {
    stability: ta_metric(stability, withR.length),
    averageRisk: st_round2(meanMag),
    volatility: st_round2(sd),
    postLossChange: ta_metric(pctChange(postLoss), postLoss.length),
    postWinChange: ta_metric(pctChange(postWin), postWin.length)
  };
}
function sequenceAnalysis(sortedEntries) {
  const revengeGroup = [], normalAfterLoss = [];
  for (let i = 1; i < sortedEntries.length; i++) {
    if (sortedEntries[i - 1].outcome === "Loss") {
      const gapMin = (sortedEntries[i].date - sortedEntries[i - 1].date) / 6e4;
      if (gapMin >= 0 && gapMin <= 30) revengeGroup.push(sortedEntries[i]);
      else normalAfterLoss.push(sortedEntries[i]);
    }
  }
  const revengeStats = pe_summarize(revengeGroup);
  const normalAfterLossStats = pe_summarize(normalAfterLoss.length ? normalAfterLoss : sortedEntries);
  let curLossStreak = 0, maxLossStreak = 0, curWinStreak = 0, maxWinStreak = 0;
  const afterLossStreak2 = [];
  sortedEntries.forEach((t) => {
    if (curLossStreak >= 2) afterLossStreak2.push(t);
    if (t.outcome === "Loss") {
      curLossStreak++;
      maxLossStreak = Math.max(maxLossStreak, curLossStreak);
      curWinStreak = 0;
    } else if (t.outcome === "Win") {
      curWinStreak++;
      maxWinStreak = Math.max(maxWinStreak, curWinStreak);
      curLossStreak = 0;
    } else {
      curLossStreak = 0;
      curWinStreak = 0;
    }
  });
  const afterLossStreakStats = pe_summarize(afterLossStreak2);
  const byDay = /* @__PURE__ */ new Map();
  sortedEntries.forEach((t) => {
    const k = t.date.toDateString();
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k).push(t);
  });
  const dayCounts = [...byDay.values()].map((a) => a.length);
  const medianDayCount = dayCounts.length ? st_median(dayCounts) : null;
  let overtradingGroup = [], normalDaysGroup = [];
  if (dayCounts.length >= 5) {
    const baseline = Math.max(1, medianDayCount);
    const threshold = Math.max(baseline + 3, baseline * 2);
    byDay.forEach((trades) => {
      if (trades.length >= threshold) overtradingGroup.push(...trades);
      else normalDaysGroup.push(...trades);
    });
  }
  const overtradingStats = pe_summarize(overtradingGroup);
  const normalDaysStats = pe_summarize(normalDaysGroup.length ? normalDaysGroup : sortedEntries);
  return {
    revenge: { group: revengeStats, groupSize: revengeGroup.length, rest: normalAfterLossStats },
    lossStreak: { max: maxLossStreak, afterStreak: afterLossStreakStats, afterStreakSize: afterLossStreak2.length },
    winStreak: { max: maxWinStreak },
    overtrading: { medianDayCount, group: overtradingStats, groupSize: overtradingGroup.length, normalDays: normalDaysStats }
  };
}
function disciplineAnalysis(sortedEntries, seq, risk) {
  const n = sortedEntries.length;
  if (n < 5) return { score: ta_metric(null, n), violations: [] };
  const violations = [];
  let penalty = 0;
  const lossCount = sortedEntries.filter((t) => t.outcome === "Loss").length;
  if (lossCount >= 3) {
    const revengeRate = seq.revenge.groupSize / lossCount;
    if (revengeRate > 0.15) {
      const amount = Math.min(30, revengeRate * 60);
      penalty += amount;
      violations.push({ id: "revenge_rate", value: Math.round(revengeRate * 100), impact: Math.round(amount) });
    }
  }
  if (seq.overtrading.groupSize > 0) {
    const share = seq.overtrading.groupSize / n;
    const amount = Math.min(20, share * 100);
    penalty += amount;
    violations.push({ id: "overtrading_days", value: Math.round(share * 100), impact: Math.round(amount) });
  }
  if (risk.postLossChange.value != null && risk.postLossChange.value > 20) {
    const amount = Math.min(20, risk.postLossChange.value / 3);
    penalty += amount;
    violations.push({ id: "risk_after_loss", value: risk.postLossChange.value, impact: Math.round(amount) });
  }
  if (risk.postWinChange.value != null && risk.postWinChange.value > 20) {
    const amount = Math.min(20, risk.postWinChange.value / 3);
    penalty += amount;
    violations.push({ id: "risk_after_win", value: risk.postWinChange.value, impact: Math.round(amount) });
  }
  const score = Math.round(Math.max(0, 100 - penalty));
  return { score: ta_metric(score, n), violations };
}
var AWARENESS_WEIGHTS = {
  selfObservation: 0.2,
  emotionalAwareness: 0.15,
  behavioralConsistency: 0.15,
  reflectionQuality: 0.2,
  patternRecognition: 0.15,
  processDiscipline: 0.15
};
function awarenessAnalysis(entries, closedEntries, reflection, risk, discipline) {
  const n = entries.length;
  if (!n) return { score: ta_metric(55, 0), components: null };
  const closedN = (closedEntries || []).length;
  const selfObservation = closedN ? closedEntries.filter(
    (e) => e.x != null && e.y != null && e.pull && e.pull !== "\u2014" && e.lesson && e.lesson !== "\u2014"
  ).length / closedN * 100 : 50;
  const emotionalAwareness = entries.filter((e) => e.x != null && e.y != null).length / n * 100;
  const behavioralConsistency = risk.stability.value != null ? risk.stability.value : 50;
  const reflectionQuality = reflection.score.value != null ? reflection.score.value : 50;
  const withLessons = entries.filter((e) => e.lesson && e.lesson !== "\u2014" && e.lesson.trim().length > 3).length;
  const repeatedCount = reflection.repeatedLessons.reduce((s, c) => s + c.count, 0);
  const patternRecognition = withLessons ? Math.max(0, 100 - repeatedCount / withLessons * 100) : 50;
  const processDiscipline = discipline.score.value != null ? discipline.score.value : 50;
  const components = { selfObservation, emotionalAwareness, behavioralConsistency, reflectionQuality, patternRecognition, processDiscipline };
  const raw = Object.entries(AWARENESS_WEIGHTS).reduce((s, [k, w]) => s + (components[k] ?? 50) * w, 0);
  const score = Math.round(Math.max(0, Math.min(100, raw)));
  return { score: ta_metric(score, n), components };
}
function calibrationAnalysis(sortedEntries, lastCalibration, lang = "ru") {
  if (!lastCalibration || !lastCalibration.date) {
    return { available: false, confidence: "insufficient" };
  }
  const calDate = new Date(lastCalibration.date);
  if (isNaN(calDate.getTime())) return { available: false, confidence: "insufficient" };
  const dayEntries = sortedEntries.filter((e) => e.date.toDateString() === calDate.toDateString());
  if (dayEntries.length < 2) {
    return { available: false, confidence: "insufficient", dayTradeCount: dayEntries.length };
  }
  let revengeCount = 0;
  for (let i = 1; i < dayEntries.length; i++) {
    if (dayEntries[i - 1].outcome === "Loss") {
      const gapMin = (dayEntries[i].date - dayEntries[i - 1].date) / 6e4;
      if (gapMin >= 0 && gapMin <= 30) revengeCount++;
    }
  }
  const withR = dayEntries.filter((e) => typeof e.r === "number" && !isNaN(e.r));
  let riskGrew = false;
  if (withR.length >= 3) {
    const half = Math.floor(withR.length / 2);
    const m1 = st_mean(withR.slice(0, half).map((e) => Math.abs(e.r)));
    const m2 = st_mean(withR.slice(half).map((e) => Math.abs(e.r)));
    if (m1 && m2 && m2 > m1 * 1.3) riskGrew = true;
  }
  const statedRiskFactors = lastCalibration.riskFactors || [];
  const statedCalm = statedRiskFactors.length === 0;
  let divergenceNote = null;
  if (lang === "en") {
    if (statedCalm && (revengeCount > 0 || riskGrew || dayEntries.length >= 8)) {
      const signals = [];
      if (revengeCount > 0) signals.push(`${revengeCount} ${revengeCount === 1 ? "trade" : "trades"} within 30 minutes of a loss`);
      if (riskGrew) signals.push("risk noticeably grew during the day");
      if (dayEntries.length >= 8) signals.push(`${dayEntries.length} trades in one day`);
      divergenceNote = `Your pre-session calibration didn't flag any risk factors, but during the day: ${signals.join(", ")}. There was a gap between the stated state and actual behavior.`;
    } else if (!statedCalm && revengeCount === 0 && !riskGrew && dayEntries.length < 8) {
      divergenceNote = "Calibration flagged risk factors before the session, and the day went without clear signs of revenge trading, growing risk, or a high trade count \u2014 the stated caution held up in behavior.";
    }
  } else {
    if (statedCalm && (revengeCount > 0 || riskGrew || dayEntries.length >= 8)) {
      const signals = [];
      if (revengeCount > 0) signals.push(`${revengeCount} ${pluralRu(revengeCount, "\u0441\u0434\u0435\u043B\u043A\u0430", "\u0441\u0434\u0435\u043B\u043A\u0438", "\u0441\u0434\u0435\u043B\u043E\u043A")} \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 30 \u043C\u0438\u043D\u0443\u0442 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430`);
      if (riskGrew) signals.push("\u0440\u0438\u0441\u043A \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0432\u044B\u0440\u043E\u0441 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u0434\u043D\u044F");
      if (dayEntries.length >= 8) signals.push(`${dayEntries.length} \u0441\u0434\u0435\u043B\u043E\u043A \u0437\u0430 \u0434\u0435\u043D\u044C`);
      divergenceNote = `\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0441\u0435\u0441\u0441\u0438\u0435\u0439 \u043D\u0435 \u043E\u0442\u043C\u0435\u0442\u0438\u043B\u0430 \u0444\u0430\u043A\u0442\u043E\u0440\u043E\u0432 \u0440\u0438\u0441\u043A\u0430, \u043D\u043E \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u0434\u043D\u044F: ${signals.join(", ")}. \u041C\u0435\u0436\u0434\u0443 \u0437\u0430\u044F\u0432\u043B\u0435\u043D\u043D\u044B\u043C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435\u043C \u0438 \u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435\u043C \u0431\u044B\u043B\u043E \u0440\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0435.`;
    } else if (!statedCalm && revengeCount === 0 && !riskGrew && dayEntries.length < 8) {
      divergenceNote = "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u043E\u0442\u043C\u0435\u0442\u0438\u043B\u0430 \u0444\u0430\u043A\u0442\u043E\u0440\u044B \u0440\u0438\u0441\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0441\u0435\u0441\u0441\u0438\u0435\u0439, \u0438 \u0434\u0435\u043D\u044C \u043F\u0440\u043E\u0448\u0451\u043B \u0431\u0435\u0437 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u044B\u0445 \u043F\u0440\u0438\u0437\u043D\u0430\u043A\u043E\u0432 \u0440\u0435\u0432\u0430\u043D\u0448\u0430, \u0440\u043E\u0441\u0442\u0430 \u0440\u0438\u0441\u043A\u0430 \u0438\u043B\u0438 \u0431\u043E\u043B\u044C\u0448\u043E\u0433\u043E \u0447\u0438\u0441\u043B\u0430 \u0441\u0434\u0435\u043B\u043E\u043A \u2014 \u0437\u0430\u044F\u0432\u043B\u0435\u043D\u043D\u0430\u044F \u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u043B\u0430\u0441\u044C \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435\u043C.";
    }
  }
  return {
    available: true,
    dayTradeCount: dayEntries.length,
    statedPct: lastCalibration.pct,
    statedRiskFactors,
    actualSignals: { revengeCount, riskGrew, tradeCount: dayEntries.length },
    divergenceNote,
    confidence: ta_confidence(dayEntries.length, { low: 3, moderate: 6, high: 10 }),
    limitation: lang === "en" ? "Only the last calibration completed that day is considered \u2014 there's no per-session calibration history yet, so long-term calibration accuracy isn't calculated." : "\u0423\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043D\u0430\u044F \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u0437\u0430 \u0434\u0435\u043D\u044C \u2014 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043E\u043A \u043F\u043E \u0441\u0435\u0441\u0441\u0438\u044F\u043C \u043F\u043E\u043A\u0430 \u043D\u0435\u0442, \u0434\u043E\u043B\u0433\u043E\u0441\u0440\u043E\u0447\u043D\u0430\u044F \u0442\u043E\u0447\u043D\u043E\u0441\u0442\u044C \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0438 \u043D\u0435 \u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F."
  };
}
var PATTERN_MIN_SAMPLE = 20;
var PATTERN_MIN_GROUP = 8;
var PATTERN_MIN_REVENGE = 5;
var PATTERN_MIN_DIFF_R = 0.2;
var PATTERN_SCORE_FLOOR = 0.22;
function pe_isEmotionallyComplete(t) {
  return t && t.x != null && t.y != null && !isNaN(t.x) && !isNaN(t.y) && (t.outcome === "Win" || t.outcome === "Loss" || t.outcome === "Breakeven");
}
function pe_summarize(group) {
  const wins = group.filter((t) => t.outcome === "Win").length;
  const losses = group.filter((t) => t.outcome === "Loss").length;
  const breakevens = group.filter((t) => t.outcome === "Breakeven").length;
  const withR = group.filter((t) => typeof t.r === "number" && !isNaN(t.r));
  const avgR = withR.length ? withR.reduce((s, t) => s + t.r, 0) / withR.length : null;
  const winRate = group.length ? Math.round(wins / group.length * 100) : 0;
  return { trades: group.length, wins, losses, breakevens, winRate, avgR };
}
function pe_scoreCandidate(group, rest, opts = {}) {
  const gStats = pe_summarize(group);
  const rStats = pe_summarize(rest);
  if (gStats.avgR == null || rStats.avgR == null || group.length === 0) return null;
  const diff = gStats.avgR - rStats.avgR;
  if (Math.abs(diff) < (opts.minDiffR ?? PATTERN_MIN_DIFF_R)) return null;
  const uniqueDays = new Set(group.map((t) => t.date.toDateString())).size;
  const sampleNorm = opts.sampleNorm ?? 25;
  const sampleConfidence = Math.min(1, group.length / sampleNorm);
  const statisticalDifference = Math.min(1, Math.abs(diff) / 0.6);
  const recurrence = Math.min(1, uniqueDays / Math.min(8, sampleNorm));
  const score = statisticalDifference * sampleConfidence * recurrence;
  const confidenceLabel = score >= 0.55 ? "high" : score >= 0.32 ? "medium" : "low";
  return { gStats, rStats, diff, uniqueDays, score, confidenceLabel };
}
function pe_pickExamples(group, n = 3) {
  const withR = group.filter((t) => typeof t.r === "number" && !isNaN(t.r));
  if (withR.length === 0) return group.slice(0, n);
  const avg = withR.reduce((s, t) => s + t.r, 0) / withR.length;
  return [...withR].sort((a, b) => Math.abs(a.r - avg) - Math.abs(b.r - avg)).slice(0, n);
}
var PE_STOPWORDS = /* @__PURE__ */ new Set([
  "\u0438",
  "\u0432",
  "\u043D\u0430",
  "\u0441",
  "\u043D\u0435",
  "\u0447\u0442\u043E",
  "\u044F",
  "\u044D\u0442\u043E",
  "\u043F\u043E",
  "\u0437\u0430",
  "\u043A\u0430\u043A",
  "\u043D\u043E",
  "\u0430",
  "\u0442\u043E",
  "\u0438\u0437",
  "\u043A",
  "\u0443",
  "\u0436\u0435",
  "\u0431\u044B",
  "\u0432\u0441\u0435",
  "\u0432\u0441\u0451",
  "\u043C\u043D\u0435",
  "\u043C\u0435\u043D\u044F",
  "\u0442\u0435\u0431\u0435",
  "\u0441\u0435\u0431\u044F",
  "\u0431\u044B\u043B\u043E",
  "\u0431\u044B\u043B",
  "\u0431\u044B\u043B\u0430",
  "\u043D\u0443\u0436\u043D\u043E",
  "\u043D\u0430\u0434\u043E",
  "\u0435\u0441\u043B\u0438",
  "\u0438\u043B\u0438",
  "\u0434\u043B\u044F",
  "\u0434\u043E",
  "\u043E\u0442",
  "\u0440\u0430\u0437",
  "\u043F\u0440\u043E\u0441\u0442\u043E",
  "\u0443\u0436\u0435",
  "\u0435\u0449\u0451",
  "\u0435\u0449\u0435"
]);
function pe_normalizeLesson(text) {
  return (text || "").toLowerCase().replace(/[.,!?;:()«»"'\-—]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !PE_STOPWORDS.has(w));
}
function pe_lessonSimilarity(aWords, bWords) {
  if (!aWords.length || !bWords.length) return 0;
  const a = new Set(aWords), b = new Set(bWords);
  let intersection = 0;
  a.forEach((w) => {
    if (b.has(w)) intersection++;
  });
  const union = (/* @__PURE__ */ new Set([...a, ...b])).size;
  return union ? intersection / union : 0;
}
function pd_confidenceTension(complete, lang = "ru") {
  const group = complete.filter((t) => t.x >= 80 && t.y <= 20);
  if (group.length < PATTERN_MIN_GROUP) return null;
  const rest = complete.filter((t) => !(t.x >= 80 && t.y <= 20));
  return lang === "en" ? {
    id: "confidence_tension",
    title: "Confidence + tension",
    description: "Your worst-performing trades don't come from fear \u2014 they come when confidence is high but tension is high too.",
    healthyDescription: "When confidence and tension are both high, your result is noticeably better than in other trades.",
    group,
    rest
  } : {
    id: "confidence_tension",
    title: "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C + \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435",
    description: "\u0422\u0432\u043E\u0438 \u043D\u0430\u0438\u0431\u043E\u043B\u0435\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0432\u043E\u0437\u043D\u0438\u043A\u0430\u044E\u0442 \u043D\u0435 \u0432 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \u0441\u0442\u0440\u0430\u0445\u0430, \u0430 \u043A\u043E\u0433\u0434\u0430 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0432\u044B\u0441\u043E\u043A\u0430\u044F, \u043D\u043E \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F \u0442\u043E\u0436\u0435 \u0432\u044B\u0441\u043E\u043A\u0438\u0439.",
    healthyDescription: "\u041A\u043E\u0433\u0434\u0430 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0438 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435 \u0432\u044B\u0441\u043E\u043A\u0438 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E, \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043B\u0443\u0447\u0448\u0435, \u0447\u0435\u043C \u0432 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043A\u0430\u0445.",
    group,
    rest
  };
}
function pd_fear(complete, lang = "ru") {
  const group = complete.filter((t) => t.x <= 20);
  if (group.length < PATTERN_MIN_GROUP) return null;
  const rest = complete.filter((t) => t.x > 20);
  return lang === "en" ? {
    id: "fear",
    title: "Entering out of fear",
    description: "Trades started from a strong fear of missing the move are, on average, noticeably worse than the rest.",
    healthyDescription: "Even your fear-driven entries aren't worse than your other trades on average \u2014 that's unusual and worth knowing.",
    group,
    rest
  } : {
    id: "fear",
    title: "\u0412\u0445\u043E\u0434 \u0438\u0437 \u0441\u0442\u0440\u0430\u0445\u0430",
    description: "\u0421\u0434\u0435\u043B\u043A\u0438, \u043D\u0430\u0447\u0430\u0442\u044B\u0435 \u0438\u0437 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u043E\u0433\u043E \u0441\u0442\u0440\u0430\u0445\u0430 \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435, \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0445\u0443\u0436\u0435 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445.",
    healthyDescription: "\u0414\u0430\u0436\u0435 \u0432\u0445\u043E\u0434\u044B \u0438\u0437 \u0441\u0442\u0440\u0430\u0445\u0430 \u0443 \u0442\u0435\u0431\u044F \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u043D\u0435 \u0445\u0443\u0436\u0435 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u2014 \u044D\u0442\u043E \u0441\u0430\u043C\u043E \u043F\u043E \u0441\u0435\u0431\u0435 \u043D\u0435\u043E\u0431\u044B\u0447\u043D\u043E \u0438 \u0441\u0442\u043E\u0438\u0442 \u0437\u043D\u0430\u0442\u044C.",
    group,
    rest
  };
}
function pd_tooCalm(complete, lang = "ru") {
  const group = complete.filter((t) => t.y >= 80);
  if (group.length < PATTERN_MIN_GROUP) return null;
  const rest = complete.filter((t) => t.y < 80);
  return lang === "en" ? {
    id: "too_calm",
    title: "Too calm",
    description: "In a state of pronounced calm, your result is noticeably worse than in other trades \u2014 maybe it's not calm, but a lack of attention to risk.",
    healthyDescription: "Calm",
    healthyTitle: "Calm works in your favor",
    healthyDescriptionFull: "Trades made in a state of pronounced calm are noticeably better than your other trades \u2014 that's a strength, not something to fix.",
    group,
    rest
  } : {
    id: "too_calm",
    title: "\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u0439",
    description: "\u0412 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u043E\u0433\u043E \u0441\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u044F \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0445\u0443\u0436\u0435, \u0447\u0435\u043C \u0432 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043A\u0430\u0445 \u2014 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E, \u044D\u0442\u043E \u043D\u0435 \u0441\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u0435, \u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u043A \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u044F \u043A \u0440\u0438\u0441\u043A\u0443.",
    healthyDescription: "\u0421\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u0435",
    healthyTitle: "\u0421\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043D\u0430 \u0442\u0435\u0431\u044F",
    healthyDescriptionFull: "\u0421\u0434\u0435\u043B\u043A\u0438 \u0432 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u043E\u0433\u043E \u0441\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u044F \u0443 \u0442\u0435\u0431\u044F \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043B\u0443\u0447\u0448\u0435 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u2014 \u044D\u0442\u043E \u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430, \u0430 \u043D\u0435 \u0442\u043E, \u0447\u0442\u043E \u043D\u0443\u0436\u043D\u043E \u0447\u0438\u043D\u0438\u0442\u044C.",
    group,
    rest
  };
}
function pd_revenge(allSorted, lang = "ru") {
  const revengeTrades = [];
  const normalNextTrades = [];
  for (let i = 1; i < allSorted.length; i++) {
    if (allSorted[i - 1].outcome === "Loss") {
      const gapMin = (allSorted[i].date - allSorted[i - 1].date) / 6e4;
      if (gapMin >= 0 && gapMin <= 30) revengeTrades.push(allSorted[i]);
      else normalNextTrades.push(allSorted[i]);
    }
  }
  if (revengeTrades.length < PATTERN_MIN_REVENGE) return null;
  const rest = normalNextTrades.length ? normalNextTrades : allSorted.filter((t) => !revengeTrades.includes(t));
  return lang === "en" ? {
    id: "revenge",
    title: "Revenge through confidence",
    description: "After a losing trade you often re-enter within a short window, and the quality of the result in those re-entries is noticeably worse.",
    group: revengeTrades,
    rest,
    minDiffR: 0.15,
    sampleNorm: 10
  } : {
    id: "revenge",
    title: "\u0420\u0435\u0432\u0430\u043D\u0448 \u0447\u0435\u0440\u0435\u0437 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C",
    description: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0442\u044B \u0447\u0430\u0441\u0442\u043E \u0432\u0445\u043E\u0434\u0438\u0448\u044C \u0441\u043D\u043E\u0432\u0430 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u043A\u043E\u0440\u043E\u0442\u043A\u043E\u0433\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438, \u0438 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430 \u0432 \u044D\u0442\u0438\u0445 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u0445 \u0432\u0445\u043E\u0434\u0430\u0445 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0445\u0443\u0436\u0435.",
    group: revengeTrades,
    rest,
    minDiffR: 0.15,
    sampleNorm: 10
    // revenge has its own, lower, spec'd minimum (5) — score against that scale, not the general one
  };
}
function pd_lessonNotLearned(all, lang = "ru") {
  const withLessons = all.filter((t) => t.lesson && t.lesson !== "\u2014" && t.lesson.trim().length > 3);
  if (withLessons.length < 3) return null;
  const words = withLessons.map((t) => pe_normalizeLesson(t.lesson));
  const clusters = [];
  for (let i = 0; i < withLessons.length; i++) {
    let placed = false;
    for (const c of clusters) {
      const rep = c.members[0];
      if (pe_lessonSimilarity(words[i], words[rep]) >= 0.5) {
        c.members.push(i);
        placed = true;
        break;
      }
    }
    if (!placed) clusters.push({ members: [i] });
  }
  clusters.sort((a, b) => b.members.length - a.members.length);
  const top = clusters[0];
  if (!top || top.members.length < 3) return null;
  const group = top.members.map((i) => withLessons[i]);
  const groupIds = new Set(group.map((t) => t.id));
  const rest = all.filter((t) => !groupIds.has(t.id));
  return {
    id: "lesson_not_learned",
    title: lang === "en" ? "Lesson not learned" : "\u0423\u0440\u043E\u043A \u043D\u0435 \u0443\u0441\u0432\u043E\u0435\u043D",
    description: lang === "en" ? `A similar lesson repeats in the journal ${group.length} times ("${group[0].lesson}") \u2014 but based on the results, the behavior itself hasn't changed.` : `\u041F\u043E\u0445\u043E\u0436\u0438\u0439 \u0443\u0440\u043E\u043A \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0442\u0441\u044F \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 ${group.length} \u0440\u0430\u0437 (\xAB${group[0].lesson}\xBB) \u2014 \u0430 \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435, \u0441\u0443\u0434\u044F \u043F\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0443, \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0435\u0436\u043D\u0438\u043C.`,
    group,
    rest,
    minDiffR: 0.1,
    minGroup: 3,
    sampleNorm: 6
  };
}
function pd_unstableRisk(all, lang = "ru") {
  const withR = all.filter((t) => typeof t.r === "number" && !isNaN(t.r));
  if (withR.length < 10) return null;
  const mags = withR.map((t) => Math.abs(t.r));
  const meanMag = mags.reduce((s, v) => s + v, 0) / mags.length;
  const variance = mags.reduce((s, v) => s + (v - meanMag) ** 2, 0) / mags.length;
  const stdev = Math.sqrt(variance);
  if (stdev < meanMag * 0.6 || stdev < 0.3) return null;
  const spikes = withR.filter((t) => Math.abs(t.r) > meanMag + stdev);
  if (spikes.length < PATTERN_MIN_GROUP) return null;
  const rest = withR.filter((t) => !spikes.includes(t));
  return {
    id: "unstable_risk",
    title: lang === "en" ? "Unstable risk" : "\u041D\u0435\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0439 \u0440\u0438\u0441\u043A",
    description: lang === "en" ? `Your R result swings a lot (average ${meanMag.toFixed(2)}R, spread \xB1${stdev.toFixed(2)}R) \u2014 some trades are noticeably bigger than typical, which usually points to unstable risk, not the market.` : `\u0420\u0430\u0437\u043C\u0435\u0440 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430 \u043F\u043E R \u0441\u0438\u043B\u044C\u043D\u043E \u043A\u043E\u043B\u0435\u0431\u043B\u0435\u0442\u0441\u044F (\u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C ${meanMag.toFixed(2)}R, \u0440\u0430\u0437\u0431\u0440\u043E\u0441 \xB1${stdev.toFixed(2)}R) \u2014 \u0447\u0430\u0441\u0442\u044C \u0441\u0434\u0435\u043B\u043E\u043A \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043A\u0440\u0443\u043F\u043D\u0435\u0435 \u0442\u0438\u043F\u0438\u0447\u043D\u043E\u0439, \u0447\u0442\u043E \u043E\u0431\u044B\u0447\u043D\u043E \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u043E \u043D\u0435\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u043C \u0440\u0438\u0441\u043A\u0435, \u0430 \u043D\u0435 \u043E \u0440\u044B\u043D\u043A\u0435.`,
    group: spikes,
    rest,
    minDiffR: 0.1
  };
}
function pd_overtrading(all, lang = "ru") {
  const byDay = /* @__PURE__ */ new Map();
  all.forEach((t) => {
    const k = t.date.toDateString();
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k).push(t);
  });
  const dayCounts = [...byDay.values()].map((arr) => arr.length);
  if (dayCounts.length < 5) return null;
  const sortedCounts = [...dayCounts].sort((a, b) => a - b);
  const median = sortedCounts[Math.floor(sortedCounts.length / 2)];
  const baseline = Math.max(1, median);
  const anomalyThreshold = Math.max(baseline + 3, baseline * 2);
  const group = [], rest = [];
  byDay.forEach((trades) => {
    if (trades.length >= anomalyThreshold) group.push(...trades);
    else rest.push(...trades);
  });
  if (group.length < PATTERN_MIN_GROUP) return null;
  return {
    id: "overtrading",
    title: lang === "en" ? "Overtrading" : "\u041F\u0435\u0440\u0435\u0442\u0440\u0435\u0439\u0434\u0438\u043D\u0433",
    description: lang === "en" ? `You typically make ${baseline} ${baseline === 1 ? "trade" : "trades"} on an active day. On days with ${anomalyThreshold}+ trades, the result looks noticeably different from a typical day.` : `\u041E\u0431\u044B\u0447\u043D\u043E \u0443 \u0442\u0435\u0431\u044F ${baseline} ${baseline === 1 ? "\u0441\u0434\u0435\u043B\u043A\u0430" : "\u0441\u0434\u0435\u043B\u043A\u0438"} \u0432 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0434\u0435\u043D\u044C. \u0412 \u0434\u043D\u0438 \u043E\u0442 ${anomalyThreshold} \u0441\u0434\u0435\u043B\u043E\u043A \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u043E\u0442 \u0442\u0438\u043F\u0438\u0447\u043D\u043E\u0433\u043E \u0434\u043D\u044F.`,
    group,
    rest
  };
}
function pd_lossStreak(allSorted, lang = "ru") {
  const afterStreak = [], normal = [];
  let streak = 0;
  for (let i = 0; i < allSorted.length; i++) {
    const t = allSorted[i];
    if (streak >= 2 && t.outcome !== void 0) {
      afterStreak.push(t);
    } else if (i > 0) {
      normal.push(t);
    }
    if (t.outcome === "Loss") streak++;
    else streak = 0;
  }
  if (afterStreak.length < PATTERN_MIN_GROUP) return null;
  return {
    id: "loss_streak",
    title: lang === "en" ? "Loss streak" : "\u0421\u0435\u0440\u0438\u044F \u0443\u0431\u044B\u0442\u043A\u043E\u0432",
    description: lang === "en" ? "Trades right after a streak of two or more losses in a row look noticeably different from your usual result." : "\u0421\u0434\u0435\u043B\u043A\u0438 \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0441\u0435\u0440\u0438\u0438 \u0438\u0437 \u0434\u0432\u0443\u0445 \u0438 \u0431\u043E\u043B\u0435\u0435 \u0443\u0431\u044B\u0442\u043A\u043E\u0432 \u043F\u043E\u0434\u0440\u044F\u0434 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043E\u0442\u043B\u0438\u0447\u0430\u044E\u0442\u0441\u044F \u043E\u0442 \u043E\u0431\u044B\u0447\u043D\u044B\u0445 \u043F\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0443.",
    group: afterStreak,
    rest: normal.length ? normal : allSorted.filter((t) => !afterStreak.includes(t)),
    minDiffR: 0.15
  };
}
function pd_riskAfterWin(allSorted, lang = "ru") {
  const withR = allSorted.filter((t) => typeof t.r === "number" && !isNaN(t.r));
  const group = [], rest = [];
  for (let i = 1; i < allSorted.length; i++) {
    if (allSorted[i - 1].outcome === "Win" && typeof allSorted[i - 1].r === "number" && typeof allSorted[i].r === "number") {
      const grew = Math.abs(allSorted[i].r) > Math.abs(allSorted[i - 1].r) * 1.3;
      if (grew) group.push(allSorted[i]);
      else rest.push(allSorted[i]);
    }
  }
  if (group.length < PATTERN_MIN_GROUP) return null;
  return {
    id: "risk_after_win",
    title: lang === "en" ? "Risk growth after a win" : "\u0420\u043E\u0441\u0442 \u0440\u0438\u0441\u043A\u0430 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0431\u0435\u0434\u044B",
    description: lang === "en" ? "After a winning trade, the size of your next trade in R noticeably grows \u2014 and the result of those trades is worse." : "\u041F\u043E\u0441\u043B\u0435 \u0432\u044B\u0438\u0433\u0440\u044B\u0448\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0440\u0430\u0437\u043C\u0435\u0440 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E R \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0432\u044B\u0440\u0430\u0441\u0442\u0430\u0435\u0442 \u2014 \u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0442\u0430\u043A\u0438\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u0445\u0443\u0436\u0435.",
    group,
    rest: rest.length ? rest : allSorted,
    minDiffR: 0.15
  };
}
function pd_avoidLossReview(all, lang = "ru") {
  const wins = all.filter((t) => t.outcome === "Win");
  const losses = all.filter((t) => t.outcome === "Loss");
  if (losses.length < PATTERN_MIN_GROUP || wins.length < 3) return null;
  const winShotRate = wins.filter((t) => Array.isArray(t.screenshots) && t.screenshots.length > 0).length / wins.length;
  const lossShotRate = losses.filter((t) => Array.isArray(t.screenshots) && t.screenshots.length > 0).length / losses.length;
  if (winShotRate - lossShotRate < 0.25) return null;
  return {
    id: "avoid_loss_review",
    title: lang === "en" ? "Avoiding loss review" : "\u0418\u0437\u0431\u0435\u0433\u0430\u043D\u0438\u0435 \u0440\u0430\u0437\u0431\u043E\u0440\u0430 \u0443\u0431\u044B\u0442\u043A\u043E\u0432",
    description: lang === "en" ? `Winning trades with a screenshot: ${Math.round(winShotRate * 100)}%. Losing trades: ${Math.round(lossShotRate * 100)}%. You visually review losing trades noticeably less often.` : `\u041F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0441\u043E \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u043E\u043C: ${Math.round(winShotRate * 100)}%. \u0423\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435: ${Math.round(lossShotRate * 100)}%. \u0422\u044B \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0440\u0435\u0436\u0435 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0435\u0448\u044C \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0432\u0438\u0437\u0443\u0430\u043B\u044C\u043D\u043E.`,
    group: losses,
    rest: wins,
    skipDiffCheck: true
    // this pattern's evidence is the screenshot rate, not avgR — always show if the gap is real
  };
}
function pd_shallowReflection(all, lang = "ru") {
  const losses = all.filter((t) => t.outcome === "Loss");
  if (losses.length < PATTERN_MIN_GROUP) return null;
  const isShallow = (t) => {
    const text = (t.lesson || "").trim();
    if (!text || text === "\u2014") return true;
    const words = text.split(/\s+/).filter(Boolean);
    return words.length <= 3 || text.length < 15;
  };
  const shallow = losses.filter(isShallow);
  if (shallow.length / losses.length < 0.5) return null;
  const rest = all.filter((t) => !shallow.includes(t));
  return {
    id: "shallow_reflection",
    title: lang === "en" ? "Shallow reflection" : "\u041F\u043E\u0432\u0435\u0440\u0445\u043D\u043E\u0441\u0442\u043D\u0430\u044F \u0440\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u044F",
    description: lang === "en" ? `${shallow.length} of ${losses.length} losing trades are described without a real takeaway \u2014 briefly or not at all.` : `${shallow.length} \u0438\u0437 ${losses.length} \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u043E\u043F\u0438\u0441\u0430\u043D\u044B \u0431\u0435\u0437 \u0440\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u043E\u0433\u043E \u0432\u044B\u0432\u043E\u0434\u0430 \u2014 \u043A\u043E\u0440\u043E\u0442\u043A\u043E \u0438\u043B\u0438 \u0432\u043E\u043E\u0431\u0449\u0435 \u0431\u0435\u0437 \u043D\u0435\u0433\u043E.`,
    group: shallow,
    rest: rest.length ? rest : losses,
    minDiffR: 0.1
  };
}
function pd_earlyExit(all, lang = "ru") {
  const candidates = all.filter(
    (t) => t.closeType === "manual" && typeof t.realizedRR === "number" && !isNaN(t.realizedRR) && typeof t.plannedRR === "number" && t.plannedRR > 0 && t.realizedRR > 0
  );
  if (candidates.length < 3) return null;
  const early = candidates.filter((t) => t.realizedRR < t.plannedRR * 0.7);
  if (early.length < 3) return null;
  const rest = all.filter((t) => !early.includes(t));
  const avgPlanned = st_mean(early.map((t) => t.plannedRR));
  const avgRealized = st_mean(early.map((t) => t.realizedRR));
  return {
    id: "early_exit",
    title: lang === "en" ? "Closing before target" : "\u0417\u0430\u043A\u0440\u044B\u0442\u0438\u0435 \u0434\u043E \u0446\u0435\u043B\u0438",
    description: lang === "en" ? `In your manual closes, you often exit before the planned Take Profit \u2014 in the last cases the average plan was ${avgPlanned.toFixed(1)}R, the average actual exit was ${avgRealized.toFixed(1)}R. Worth checking whether this is a deliberate plan change or a repeating early exit.` : `\u0412 \u0442\u0432\u043E\u0438\u0445 \u0440\u0443\u0447\u043D\u044B\u0445 \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u044F\u0445 \u0447\u0430\u0441\u0442\u043E \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044F \u0432\u044B\u0445\u043E\u0434 \u0434\u043E \u0437\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0433\u043E Take Profit \u2014 \u0432 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 \u0441\u043B\u0443\u0447\u0430\u044F\u0445 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u043F\u043B\u0430\u043D \u0431\u044B\u043B ${avgPlanned.toFixed(1)}R, \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0432\u044B\u0445\u043E\u0434 \u2014 ${avgRealized.toFixed(1)}R. \u0421\u0442\u043E\u0438\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C, \u044D\u0442\u043E \u043E\u0441\u043E\u0437\u043D\u0430\u043D\u043D\u0430\u044F \u0441\u043C\u0435\u043D\u0430 \u043F\u043B\u0430\u043D\u0430 \u0438\u043B\u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0439\u0441\u044F \u0440\u0430\u043D\u043D\u0438\u0439 \u0432\u044B\u0445\u043E\u0434.`,
    group: early,
    rest: rest.length ? rest : candidates,
    minDiffR: 0.1,
    sampleNorm: 8
  };
}
function analyzeTraderPatterns(trades, lang = "ru") {
  const all = (trades || []).filter((t) => t && t.date instanceof Date && !isNaN(t.date.getTime()));
  const complete = all.filter(pe_isEmotionallyComplete);
  if (complete.length < PATTERN_MIN_SAMPLE) {
    return { available: false, sampleSize: complete.length, needed: PATTERN_MIN_SAMPLE };
  }
  const sorted = [...all].sort((a, b) => a.date - b.date);
  const raw = [
    pd_confidenceTension(complete, lang),
    pd_fear(complete, lang),
    pd_tooCalm(complete, lang),
    pd_revenge(sorted, lang),
    pd_lessonNotLearned(all, lang),
    pd_unstableRisk(all, lang),
    pd_overtrading(all, lang),
    pd_lossStreak(sorted, lang),
    pd_riskAfterWin(sorted, lang),
    pd_avoidLossReview(all, lang),
    pd_shallowReflection(all, lang),
    pd_earlyExit(all, lang)
  ].filter(Boolean);
  const scored = [];
  const healthy = [];
  for (const c of raw) {
    const result = c.skipDiffCheck ? (() => {
      const gStats = pe_summarize(c.group), rStats = pe_summarize(c.rest);
      const uniqueDays = new Set(c.group.map((t) => t.date.toDateString())).size;
      const sampleConfidence = Math.min(1, c.group.length / 25);
      const recurrence = Math.min(1, uniqueDays / 8);
      const score = 0.5 * sampleConfidence * recurrence + 0.25;
      return { gStats, rStats, diff: (gStats.avgR ?? 0) - (rStats.avgR ?? 0), uniqueDays, score, confidenceLabel: score >= 0.4 ? "medium" : "low" };
    })() : pe_scoreCandidate(c.group, c.rest, { minDiffR: c.minDiffR, sampleNorm: c.sampleNorm });
    if (!result) continue;
    const entry = {
      id: c.id,
      title: c.title,
      description: result.diff < 0 || c.skipDiffCheck ? c.description : c.healthyDescriptionFull || c.healthyDescription || c.description,
      confidence: result.confidenceLabel,
      confidenceScore: Math.round(result.score * 100) / 100,
      stats: { ...result.gStats, _trades: c.group },
      comparisonStats: { ...result.rStats, _trades: c.rest },
      diff: Math.round(result.diff * 100) / 100,
      sampleTrades: pe_pickExamples(c.group, 3),
      evidenceCount: c.group.length
    };
    if (!c.skipDiffCheck && result.diff > 0 && c.healthyDescription) {
      healthy.push({ ...entry, title: c.healthyTitle || (lang === "en" ? `${c.title} (strength)` : `${c.title} (\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)`) });
    } else if (result.score >= PATTERN_SCORE_FLOOR) {
      scored.push(entry);
    }
  }
  scored.sort((a, b) => b.confidenceScore - a.confidenceScore);
  return {
    available: true,
    sampleSize: complete.length,
    primaryPattern: scored[0] || null,
    secondaryPatterns: scored.slice(1, 4),
    healthyPatterns: healthy
  };
}
var PATTERN_TYPE_MAP = {
  confidence_tension: "emotional",
  fear: "emotional",
  too_calm: "emotional",
  revenge: "behavioral",
  overtrading: "behavioral",
  loss_streak: "behavioral",
  unstable_risk: "risk",
  risk_after_win: "risk",
  lesson_not_learned: "reflection",
  avoid_loss_review: "reflection",
  shallow_reflection: "reflection",
  early_exit: "behavioral"
};
var PATTERN_RECOMMENDATIONS = {
  confidence_tension: "\u041F\u0435\u0440\u0435\u0434 \u0432\u0445\u043E\u0434\u043E\u043C \u0432 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \xAB\u0443\u0432\u0435\u0440\u0435\u043D, \u043D\u043E \u043D\u0430 \u0432\u0437\u0432\u043E\u0434\u0435\xBB \u2014 \u043E\u0434\u043D\u0430 \u043F\u0430\u0443\u0437\u0430 \u0432 60 \u0441\u0435\u043A\u0443\u043D\u0434 \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430, \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u043B\u0438 \u0441\u0434\u0435\u043B\u043A\u0430 \u0441 \u043F\u043B\u0430\u043D\u043E\u043C, \u0430 \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0441 \u043C\u043E\u043C\u0435\u043D\u0442\u043E\u043C.",
  fear: "\u041F\u0440\u0435\u0436\u0434\u0435 \u0447\u0435\u043C \u043D\u0430\u0436\u0430\u0442\u044C \xAB\u0432 \u0441\u0434\u0435\u043B\u043A\u0443\xBB, \u0441\u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u0443\u0439 \u043F\u0440\u0438\u0447\u0438\u043D\u0443 \u0432\u0445\u043E\u0434\u0430 \u043E\u0434\u043D\u0438\u043C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u043C. \u0415\u0441\u043B\u0438 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u043F\u0440\u0438\u0447\u0438\u043D\u0430 \u2014 \xAB\u0430 \u0432\u0434\u0440\u0443\u0433 \u0443\u0435\u0434\u0443 \u0431\u0435\u0437 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F\xBB, \u044D\u0442\u043E \u0441\u0442\u0440\u0430\u0445, \u0430 \u043D\u0435 \u043F\u043B\u0430\u043D.",
  too_calm: "\u0412 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \u0441\u0438\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u044F \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E \u043F\u0435\u0440\u0435\u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0439 \u0440\u0438\u0441\u043A \u2014 \xAB\u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E\xBB \u0438\u043D\u043E\u0433\u0434\u0430 \u0437\u043D\u0430\u0447\u0438\u0442 \xAB\u043D\u0435 \u0441\u043B\u0435\u0436\u0443\xBB, \u0430 \u043D\u0435 \xAB\u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u0443\u044E\xBB.",
  revenge: "\u0412\u0432\u0435\u0434\u0438 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u0443\u044E \u043F\u0430\u0443\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u2014 \u043C\u0438\u043D\u0438\u043C\u0443\u043C 20\u201330 \u043C\u0438\u043D\u0443\u0442 \u0431\u0435\u0437 \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B\u0430.",
  lesson_not_learned: "\u041F\u0435\u0440\u0435\u043F\u0438\u0448\u0438 \u0443\u0440\u043E\u043A \u0432 \u0444\u043E\u0440\u043C\u0430\u0442 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0433\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F, \u0430 \u043D\u0435 \u043D\u0430\u0431\u043B\u044E\u0434\u0435\u043D\u0438\u044F \u2014 \u043D\u0435 \xAB\u043D\u0435 \u0442\u043E\u0440\u043E\u043F\u0438\u0442\u044C\u0441\u044F\xBB, \u0430 \xAB\u0436\u0434\u0430\u0442\u044C \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u044F \u0441\u0432\u0435\u0447\u0438 \u043F\u0435\u0440\u0435\u0434 \u0432\u0445\u043E\u0434\u043E\u043C\xBB.",
  unstable_risk: "\u0417\u0430\u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0439 \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u044B\u0439 % \u0440\u0438\u0441\u043A\u0430 \u043D\u0430 \u0441\u0434\u0435\u043B\u043A\u0443 \u0438 \u0434\u0435\u0440\u0436\u0438\u0441\u044C \u0435\u0433\u043E \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u0438 \u0432 \u043C\u043E\u043C\u0435\u043D\u0442\u0435.",
  overtrading: "\u0417\u0430\u0440\u0430\u043D\u0435\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438 \u043B\u0438\u043C\u0438\u0442 \u0441\u0434\u0435\u043B\u043E\u043A \u043D\u0430 \u0434\u0435\u043D\u044C \u0438 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u0438 \u043E\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0439\u0441\u044F \u043F\u0440\u0438 \u0435\u0433\u043E \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0438.",
  loss_streak: "\u041F\u043E\u0441\u043B\u0435 \u0432\u0442\u043E\u0440\u043E\u0439 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u0434\u0440\u044F\u0434 \u2014 \u0441\u0438\u0433\u043D\u0430\u043B \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u043F\u0430\u0443\u0437\u0443 \u0438 \u0440\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C\u0441\u044F, \u0430 \u043D\u0435 \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0442\u044C \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C.",
  risk_after_win: "\u041F\u043E\u0431\u0435\u0434\u0430 \u043D\u0435 \u0434\u0435\u043B\u0430\u0435\u0442 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0441\u0435\u0442\u0430\u043F \u0431\u043E\u043B\u0435\u0435 \u0432\u0435\u0440\u043D\u044B\u043C \u2014 \u0434\u0435\u0440\u0436\u0438 \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0438\u0441\u043A\u0430 \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u044B\u043C \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0435\u0433\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430.",
  avoid_loss_review: "\u0412\u043E\u0437\u044C\u043C\u0438 \u0437\u0430 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0443 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0442\u044C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442 \u0438\u043C\u0435\u043D\u043D\u043E \u0442\u0435\u0445 \u0441\u0434\u0435\u043B\u043E\u043A, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043D\u0435 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043F\u0435\u0440\u0435\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u0442\u044C \u2014 \u044D\u0442\u043E \u0441\u0430\u043C\u044B\u0439 \u043F\u043E\u043B\u0435\u0437\u043D\u044B\u0439 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435.",
  shallow_reflection: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0444\u0440\u0430\u0437\u0443 \xAB\u0412 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437 \u044F \u0441\u0434\u0435\u043B\u0430\u044E \u0438\u043D\u0430\u0447\u0435, \u0435\u0441\u043B\u0438...\xBB \u0438 \u0434\u043E\u043F\u0438\u0448\u0438 \u0435\u0451 \u0447\u0435\u0441\u0442\u043D\u043E.",
  early_exit: "\u041F\u0435\u0440\u0435\u0434 \u0440\u0443\u0447\u043D\u044B\u043C \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u0435\u043C \u0441\u043F\u0440\u043E\u0441\u0438 \u0441\u0435\u0431\u044F: \u044D\u0442\u043E \u043E\u0441\u043E\u0437\u043D\u0430\u043D\u043D\u0430\u044F \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u043A\u0430 \u043F\u043B\u0430\u043D\u0430 \u0438\u043B\u0438 \u0440\u0435\u0444\u043B\u0435\u043A\u0441 \u043D\u0430 \u0442\u0440\u0435\u0432\u043E\u0433\u0443? \u0415\u0441\u043B\u0438 \u043E\u0442\u0432\u0435\u0442 \u043D\u0435 \u043E\u0447\u0435\u0432\u0438\u0434\u0435\u043D \u2014 \u0434\u0430\u0439 \u0441\u0434\u0435\u043B\u043A\u0435 \u0447\u0443\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0434\u043E \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u044F."
};
var PATTERN_RECOMMENDATIONS_EN = {
  confidence_tension: 'Before entering while feeling "confident but on edge" \u2014 take a 60-second pause and check the trade against your plan, not just against the moment.',
  fear: `Before you hit "enter," state your reason for the trade in one sentence. If the only reason is "what if it moves without me," that's fear, not a plan.`,
  too_calm: 'In a state of strong calm, double-check your risk separately \u2014 "calm" can sometimes mean "not watching," not "in control."',
  revenge: "Set a mandatory pause after a loss \u2014 at least 20-30 minutes away from the terminal.",
  lesson_not_learned: `Rewrite the lesson as a specific action, not an observation \u2014 not "don't rush," but "wait for the candle to close before entering."`,
  unstable_risk: "Fix a constant % risk per trade and stick to it regardless of how confident you feel in the moment.",
  overtrading: "Set a daily trade limit in advance and physically stop once you hit it.",
  loss_streak: "After the second loss in a row \u2014 that's a signal to pause and figure out why, not to trade more.",
  risk_after_win: "A win doesn't make the next setup any more valid \u2014 keep your risk size constant regardless of the previous result.",
  avoid_loss_review: "Make a habit of saving a screenshot of exactly the trades you don't want to revisit \u2014 that's the most useful material in the journal.",
  shallow_reflection: `After a loss, finish the sentence "Next time I'll do it differently if..." and write it honestly.`,
  early_exit: "Before closing manually, ask yourself: is this a deliberate plan change or anxiety talking? If unsure, give the trade a bit more time before closing."
};
function ta_severity(score, diff) {
  const mag = Math.abs(diff ?? 0);
  if (score >= 0.55 && mag >= 0.4) return "high";
  if (score >= 0.35) return "medium";
  return "low";
}
function ta_buildPatternRecord(c, result, isHealthy, lang = "ru") {
  const recs = lang === "en" ? PATTERN_RECOMMENDATIONS_EN : PATTERN_RECOMMENDATIONS;
  return {
    id: c.id,
    type: PATTERN_TYPE_MAP[c.id] || "behavioral",
    severity: isHealthy ? "info" : ta_severity(result.score, result.diff),
    confidence: result.confidenceLabel,
    sampleSize: c.group.length,
    title: isHealthy ? c.healthyTitle || (lang === "en" ? `${c.title} (strength)` : `${c.title} (\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)`) : c.title,
    description: isHealthy ? c.healthyDescriptionFull || c.healthyDescription || c.description : c.description,
    evidence: pe_pickExamples(c.group, 3).map((t) => ({ id: t.id, date: t.date, outcome: t.outcome, r: t.r, instrument: t.instrument, tag: t.tag })),
    metrics: { group: result.gStats, rest: result.rStats, diff: st_round2(result.diff), uniqueDays: result.uniqueDays, confidenceScore: st_round2(result.score) },
    recommendation: isHealthy ? null : recs[c.id] || null
  };
}
function patternEngineV2(trades, lang = "ru") {
  const all = (trades || []).filter((t) => t && t.date instanceof Date && !isNaN(t.date.getTime()));
  const complete = all.filter(pe_isEmotionallyComplete);
  if (complete.length < PATTERN_MIN_SAMPLE) {
    return { available: false, sampleSize: complete.length, needed: PATTERN_MIN_SAMPLE, patterns: [], healthyPatterns: [] };
  }
  const sorted = [...all].sort((a, b) => a.date - b.date);
  const raw = [
    pd_confidenceTension(complete, lang),
    pd_fear(complete, lang),
    pd_tooCalm(complete, lang),
    pd_revenge(sorted, lang),
    pd_lessonNotLearned(all, lang),
    pd_unstableRisk(all, lang),
    pd_overtrading(all, lang),
    pd_lossStreak(sorted, lang),
    pd_riskAfterWin(sorted, lang),
    pd_avoidLossReview(all, lang),
    pd_shallowReflection(all, lang),
    pd_earlyExit(all, lang)
  ].filter(Boolean);
  const patterns = [], healthy = [];
  for (const c of raw) {
    const result = c.skipDiffCheck ? (() => {
      const gStats = pe_summarize(c.group), rStats = pe_summarize(c.rest);
      const uniqueDays = new Set(c.group.map((t) => t.date.toDateString())).size;
      const sampleConfidence = Math.min(1, c.group.length / 25);
      const recurrence = Math.min(1, uniqueDays / 8);
      const score = 0.5 * sampleConfidence * recurrence + 0.25;
      return { gStats, rStats, diff: (gStats.avgR ?? 0) - (rStats.avgR ?? 0), uniqueDays, score, confidenceLabel: score >= 0.4 ? "medium" : "low" };
    })() : pe_scoreCandidate(c.group, c.rest, { minDiffR: c.minDiffR, sampleNorm: c.sampleNorm });
    if (!result) continue;
    if (!c.skipDiffCheck && result.diff > 0 && c.healthyDescription) {
      healthy.push(ta_buildPatternRecord(c, result, true, lang));
    } else if (result.score >= PATTERN_SCORE_FLOOR) {
      patterns.push(ta_buildPatternRecord(c, result, false, lang));
    }
  }
  patterns.sort((a, b) => b.metrics.confidenceScore - a.metrics.confidenceScore);
  return { available: true, sampleSize: complete.length, patterns, healthyPatterns: healthy };
}
function computeRRWinRateStats(closedEntries) {
  const withRealized = closedEntries.filter((e) => typeof e.realizedRR === "number" && !isNaN(e.realizedRR));
  const avgRealizedRR = withRealized.length ? st_mean(withRealized.map((e) => e.realizedRR)) : null;
  const wins = closedEntries.filter((e) => e.outcome === "Win");
  const losses = closedEntries.filter((e) => e.outcome === "Loss");
  const breakevens = closedEntries.filter((e) => e.outcome === "Breakeven");
  const winRate = wins.length + losses.length > 0 ? wins.length / (wins.length + losses.length) * 100 : null;
  const winsWithR = wins.filter((e) => typeof e.r === "number" && !isNaN(e.r));
  const lossesWithR = losses.filter((e) => typeof e.r === "number" && !isNaN(e.r));
  const avgWinR = winsWithR.length ? st_mean(winsWithR.map((e) => e.r)) : null;
  const avgLossR = lossesWithR.length ? Math.abs(st_mean(lossesWithR.map((e) => e.r))) : null;
  const total = wins.length + losses.length;
  const expectancy = total > 0 && avgWinR != null && avgLossR != null ? wins.length / total * avgWinR - losses.length / total * avgLossR : null;
  return {
    sampleSize: closedEntries.length,
    avgRealizedRR: avgRealizedRR != null ? st_round2(avgRealizedRR) : null,
    winRate: winRate != null ? Math.round(winRate) : null,
    wins: wins.length,
    losses: losses.length,
    breakevens: breakevens.length,
    avgWinR: avgWinR != null ? st_round2(avgWinR) : null,
    avgLossR: avgLossR != null ? st_round2(avgLossR) : null,
    expectancy: expectancy != null ? st_round2(expectancy) : null
  };
}
function rrWinRateInsightText(rr, lang = "ru") {
  if (!rr || rr.sampleSize < PATTERN_MIN_SAMPLE || rr.avgRealizedRR == null || rr.winRate == null || rr.expectancy == null) return null;
  if (rr.expectancy < 0) {
    return lang === "en" ? `Your journal currently shows a combination of an average realized RR of ${rr.avgRealizedRR}R and a ${rr.winRate}% win rate \u2014 based on these numbers the expectancy is negative. Worth checking whether this holds up on a larger sample or reflects a specific stretch.` : `\u0412 \u0442\u0432\u043E\u0451\u043C \u0436\u0443\u0440\u043D\u0430\u043B\u0435 \u0441\u0435\u0439\u0447\u0430\u0441 \u0441\u043E\u0447\u0435\u0442\u0430\u043D\u0438\u0435 \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E realized RR \u2248 ${rr.avgRealizedRR}R \u0438 Win Rate ${rr.winRate}% \u2014 \u043F\u0440\u0438 \u0442\u0430\u043A\u0438\u0445 \u0446\u0438\u0444\u0440\u0430\u0445 \u043C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u043E\u0442\u0440\u0438\u0446\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435. \u0421\u0442\u043E\u0438\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C, \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u043B\u0438 \u044D\u0442\u043E \u043D\u0430 \u0431\u043E\u043B\u044C\u0448\u0435\u0439 \u0432\u044B\u0431\u043E\u0440\u043A\u0435 \u0438\u043B\u0438 \u044D\u0442\u043E \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0440\u0435\u0437\u043E\u043A.`;
  }
  if (rr.avgRealizedRR < 1.3 && rr.winRate < 50 && rr.expectancy < 0.15) {
    return lang === "en" ? `Average realized RR (\u2248${rr.avgRealizedRR}R) and win rate (${rr.winRate}%) currently sit in a zone where the result depends heavily on win frequency. Worth checking whether your system has a stable statistical edge.` : `\u0421\u0440\u0435\u0434\u043D\u0438\u0439 realized RR (\u2248${rr.avgRealizedRR}R) \u0438 Win Rate (${rr.winRate}%) \u0441\u0435\u0439\u0447\u0430\u0441 \u043D\u0430\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432 \u0437\u043E\u043D\u0435, \u0433\u0434\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0441\u0438\u043B\u044C\u043D\u043E \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0447\u0430\u0441\u0442\u043E\u0442\u044B \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A. \u0421\u0442\u043E\u0438\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C, \u0435\u0441\u0442\u044C \u043B\u0438 \u0443 \u0442\u0432\u043E\u0435\u0439 \u0441\u0438\u0441\u0442\u0435\u043C\u044B \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0435 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u043E.`;
  }
  return null;
}
function buildInsights(patternsResult, calibration, discipline, lang = "ru", rrStats = null) {
  const insights = [];
  (patternsResult.patterns || []).slice(0, 3).forEach((p) => {
    insights.push({ id: `pattern_${p.id}`, basis: "pattern", confidence: p.confidence, sampleSize: p.sampleSize, text: p.description });
  });
  if (calibration.available && calibration.divergenceNote) {
    insights.push({ id: "calibration_divergence", basis: "calibration", confidence: calibration.confidence, sampleSize: calibration.dayTradeCount, text: calibration.divergenceNote });
  }
  if (discipline.violations && discipline.violations.length) {
    const top = discipline.violations[0];
    const text = lang === "en" ? {
      revenge_rate: `You re-enter a new trade within half an hour of a loss about ${top.value}% of the time.`,
      overtrading_days: `About ${top.value}% of your trades fall on days with abnormally high activity.`,
      risk_after_loss: `After a loss, your average risk increases by about ${top.value}%.`,
      risk_after_win: `After a win, your average risk increases by about ${top.value}%.`
    }[top.id] : {
      revenge_rate: `\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0442\u044B \u0432\u0445\u043E\u0434\u0438\u0448\u044C \u0432 \u043D\u043E\u0432\u0443\u044E \u0441\u0434\u0435\u043B\u043A\u0443 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0441\u0430 \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u0432 ${top.value}% \u0441\u043B\u0443\u0447\u0430\u0435\u0432.`,
      overtrading_days: `\u041F\u0440\u0438\u043C\u0435\u0440\u043D\u043E ${top.value}% \u0442\u0432\u043E\u0438\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u043D\u0430 \u0434\u043D\u0438 \u0441 \u0430\u043D\u043E\u043C\u0430\u043B\u044C\u043D\u043E \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C\u044E.`,
      risk_after_loss: `\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0442\u0432\u043E\u0439 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0438\u0441\u043A \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u043D\u0430 ${top.value}%.`,
      risk_after_win: `\u041F\u043E\u0441\u043B\u0435 \u043F\u043E\u0431\u0435\u0434\u044B \u0442\u0432\u043E\u0439 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0438\u0441\u043A \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u043D\u0430 ${top.value}%.`
    }[top.id];
    if (text) insights.push({ id: `discipline_${top.id}`, basis: "discipline", confidence: discipline.score.confidence, sampleSize: discipline.score.sampleSize, text });
  }
  const rrText = rrWinRateInsightText(rrStats, lang);
  if (rrText) insights.push({ id: "rr_winrate", basis: "rr_winrate", confidence: rrStats.sampleSize >= PATTERN_MIN_SAMPLE * 1.5 ? "medium" : "low", sampleSize: rrStats.sampleSize, text: rrText });
  return insights;
}
function calculateTraderAnalytics(entries, lastCalibration, lang = "ru") {
  const validEntries = (entries || []).filter((e) => e && e.date instanceof Date && !isNaN(e.date.getTime()));
  const closedEntries = validEntries.filter(isEntryClosed);
  const sorted = [...closedEntries].sort((a, b) => a.date - b.date);
  const seq = sequenceAnalysis(sorted);
  const risk = riskAnalysis(sorted);
  const reflection = reflectionAnalysis(validEntries);
  const discipline = disciplineAnalysis(sorted, seq, risk);
  const emotional = emotionalAnalysis(validEntries);
  const awareness = awarenessAnalysis(validEntries, closedEntries, reflection, risk, discipline);
  const patternsResult = patternEngineV2(closedEntries, lang);
  const calibration = calibrationAnalysis(sorted, lastCalibration, lang);
  const rrStats = computeRRWinRateStats(closedEntries);
  const { recent, previous } = ta_splitRecent(sorted);
  let trend = { awareness: "insufficient_data", discipline: "insufficient_data", riskStability: "insufficient_data", reflectionQuality: "insufficient_data" };
  if (recent.length >= 5 && previous.length >= 5) {
    const rRisk = riskAnalysis(recent), pRisk = riskAnalysis(previous);
    const rReflection = reflectionAnalysis(recent), pReflection = reflectionAnalysis(previous);
    const rDiscipline = disciplineAnalysis(recent, sequenceAnalysis(recent), rRisk);
    const pDiscipline = disciplineAnalysis(previous, sequenceAnalysis(previous), pRisk);
    const rAwareness = awarenessAnalysis(recent, recent, rReflection, rRisk, rDiscipline);
    const pAwareness = awarenessAnalysis(previous, previous, pReflection, pRisk, pDiscipline);
    trend = {
      awareness: ta_trend(rAwareness.score.value, pAwareness.score.value, 3, true),
      discipline: ta_trend(rDiscipline.score.value, pDiscipline.score.value, 3, true),
      riskStability: ta_trend(rRisk.stability.value, pRisk.stability.value, 3, true),
      reflectionQuality: ta_trend(rReflection.score.value, pReflection.score.value, 3, true)
    };
  }
  const dataQuality = {
    totalTrades: validEntries.length,
    completeTrades: validEntries.filter(pe_isEmotionallyComplete).length,
    missingEmotion: validEntries.filter((e) => e.x == null || e.y == null).length,
    missingReflection: validEntries.filter((e) => (!e.pull || e.pull === "\u2014") && (!e.lesson || e.lesson === "\u2014")).length,
    missingRisk: validEntries.filter((e) => typeof e.r !== "number" || isNaN(e.r)).length,
    missingScreenshots: validEntries.filter((e) => !Array.isArray(e.screenshots) || e.screenshots.length === 0).length
  };
  const insights = buildInsights(patternsResult, calibration, discipline, lang, rrStats);
  return {
    awareness: { ...awareness, trend: trend.awareness },
    emotionalState: emotional,
    discipline: { ...discipline, trend: trend.discipline },
    risk: { ...risk, stability: { ...risk.stability, trend: trend.riskStability } },
    execution: { score: discipline.score, consistency: risk.stability, confidence: discipline.score.confidence },
    reflection: { ...reflection, trend: trend.reflectionQuality },
    calibration,
    rrStats,
    patterns: patternsResult.patterns,
    healthyPatterns: patternsResult.healthyPatterns,
    insights,
    dataQuality
  };
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var lerp = (a, b, t) => a + (b - a) * t;
var SIM_DURATION = 180;
var SIM_START_CAPITAL = 1e4;
var CANDLE_MS = 5e3;
var VISIBLE_CANDLES = 30;
var MARGIN_FRACTION = 0.65;
var LEVERAGE_OPTIONS = [2, 3, 5, 10, 20, 30, 50];
var NEWS_INTERVAL_SEC = 30;
var NEWS_VISIBLE_MS = 11e3;
var NEWS_HEADLINES = [
  "\u0420\u0435\u0433\u0443\u043B\u044F\u0442\u043E\u0440 \u0430\u043D\u043E\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043B \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443 \u0434\u0435\u0440\u0438\u0432\u0430\u0442\u0438\u0432\u043D\u044B\u0445 \u043F\u043B\u043E\u0449\u0430\u0434\u043E\u043A",
  "\u041A\u0440\u0443\u043F\u043D\u044B\u0439 \u043C\u0430\u0440\u043A\u0435\u0442-\u043C\u0435\u0439\u043A\u0435\u0440 \u0441\u043E\u043E\u0431\u0449\u0438\u043B \u043E\u0431 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0438 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0438",
  "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u0430 \u043C\u0430\u043A\u0440\u043E\u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u2014 \u0440\u044B\u043D\u043A\u0438 \u043E\u0446\u0435\u043D\u0438\u0432\u0430\u044E\u0442 \u0432\u043B\u0438\u044F\u043D\u0438\u0435",
  "\u0422\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0441\u0431\u043E\u0439 \u043D\u0430 \u043E\u0434\u043D\u043E\u0439 \u0438\u0437 \u0431\u0438\u0440\u0436-\u043A\u043E\u043D\u043A\u0443\u0440\u0435\u043D\u0442\u043E\u0432",
  "\u041F\u043E\u044F\u0432\u0438\u043B\u0438\u0441\u044C \u0441\u043B\u0443\u0445\u0438 \u043E \u0434\u0435\u043B\u0438\u0441\u0442\u0438\u043D\u0433\u0435 \u0430\u043A\u0442\u0438\u0432\u0430 \u0441 \u043E\u0434\u043D\u043E\u0439 \u0438\u0437 \u043F\u043B\u043E\u0449\u0430\u0434\u043E\u043A",
  "\u0426\u0435\u043D\u0442\u0440\u043E\u0431\u0430\u043D\u043A \u043D\u0435 \u0438\u0441\u043A\u043B\u044E\u0447\u0430\u0435\u0442 \u0432\u043D\u0435\u043E\u0447\u0435\u0440\u0435\u0434\u043D\u043E\u0433\u043E \u0437\u0430\u0441\u0435\u0434\u0430\u043D\u0438\u044F",
  "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0438 \u0440\u0430\u0437\u043E\u0448\u043B\u0438\u0441\u044C \u0432 \u043E\u0446\u0435\u043D\u043A\u0430\u0445 \u0434\u0430\u043B\u044C\u043D\u0435\u0439\u0448\u0435\u0433\u043E \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F",
  "\u041A\u0440\u0443\u043F\u043D\u044B\u0439 \u0444\u043E\u043D\u0434 \u0438\u0437\u043C\u0435\u043D\u0438\u043B \u0440\u0430\u0437\u043C\u0435\u0440 \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0445 \u043F\u043E\u0437\u0438\u0446\u0438\u0439",
  "\u0421\u041C\u0418 \u0441\u043E\u043E\u0431\u0449\u0430\u044E\u0442 \u043E \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u0445 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445 \u0432 \u0440\u0435\u0433\u0443\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438",
  "\u041E\u043D\u0447\u0435\u0439\u043D-\u0434\u0430\u043D\u043D\u044B\u0435 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u043D\u0430 \u0431\u0438\u0440\u0436\u0438",
  "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D \u043E\u0442\u0447\u0451\u0442 \u043E \u043B\u0438\u043A\u0432\u0438\u0434\u043D\u043E\u0441\u0442\u0438 \u0440\u044B\u043D\u043A\u0430",
  "\u041F\u043E\u044F\u0432\u0438\u043B\u0430\u0441\u044C \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u043A\u0440\u0443\u043F\u043D\u043E\u0439 \u0432\u043D\u0435\u0431\u0438\u0440\u0436\u0435\u0432\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0435",
  "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u0442\u043E\u043A\u043E\u043B\u0430 \u043F\u0440\u043E\u0448\u043B\u043E \u0431\u0435\u0437 \u0438\u043D\u0446\u0438\u0434\u0435\u043D\u0442\u043E\u0432",
  "\u0421\u0431\u043E\u0439 \u0443 \u043A\u0440\u0443\u043F\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 \u043B\u0438\u043A\u0432\u0438\u0434\u043D\u043E\u0441\u0442\u0438",
  "\u0420\u0435\u0439\u0442\u0438\u043D\u0433\u043E\u0432\u043E\u0435 \u0430\u0433\u0435\u043D\u0442\u0441\u0442\u0432\u043E \u043F\u0435\u0440\u0435\u0441\u043C\u043E\u0442\u0440\u0435\u043B\u043E \u043F\u0440\u043E\u0433\u043D\u043E\u0437",
  "\u041F\u043E\u044F\u0432\u0438\u043B\u0438\u0441\u044C \u0441\u043B\u0443\u0445\u0438 \u043E \u043D\u043E\u0432\u043E\u043C \u043A\u0440\u0443\u043F\u043D\u043E\u043C \u0438\u0433\u0440\u043E\u043A\u0435 \u043D\u0430 \u0440\u044B\u043D\u043A\u0435",
  "\u041E\u043F\u0440\u043E\u0441 \u0442\u0440\u0435\u0439\u0434\u0435\u0440\u043E\u0432 \u043F\u043E\u043A\u0430\u0437\u0430\u043B \u0440\u043E\u0441\u0442 \u043D\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0451\u043D\u043D\u043E\u0441\u0442\u0438",
  "\u0411\u0438\u0440\u0436\u0430 \u043E\u0431\u044A\u044F\u0432\u0438\u043B\u0430 \u043E \u043F\u043B\u0430\u043D\u043E\u0432\u044B\u0445 \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0440\u0430\u0431\u043E\u0442\u0430\u0445",
  "\u0412\u044B\u0448\u043B\u0430 \u0441\u0442\u0430\u0442\u044C\u044F \u0441 \u043A\u0440\u0438\u0442\u0438\u043A\u043E\u0439 \u0442\u0435\u043A\u0443\u0449\u0435\u0439 \u043C\u043E\u0434\u0435\u043B\u0438 \u0440\u044B\u043D\u043A\u0430",
  "\u041A\u0440\u0443\u043F\u043D\u044B\u0439 \u043A\u043E\u0448\u0435\u043B\u0451\u043A \u043F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u043B \u0437\u043D\u0430\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u0443\u044E \u0441\u0443\u043C\u043C\u0443",
  "\u0420\u0435\u0433\u0443\u043B\u044F\u0442\u043E\u0440 \u043E\u0434\u043E\u0431\u0440\u0438\u043B \u043D\u043E\u0432\u044B\u0439 \u043F\u0440\u043E\u0434\u0443\u043A\u0442 \u0434\u043B\u044F \u0438\u043D\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u043E\u043D\u0430\u043B\u043E\u0432",
  "\u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0438 \u0430\u043D\u043E\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043B\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0434\u043E\u0440\u043E\u0436\u043D\u043E\u0439 \u043A\u0430\u0440\u0442\u044B",
  "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0438 \u0441\u043E\u043E\u0431\u0449\u0430\u044E\u0442 \u043E \u043F\u0435\u0440\u0435\u0433\u043E\u0432\u043E\u0440\u0430\u0445 \u043C\u0435\u0436\u0434\u0443 \u043A\u0440\u0443\u043F\u043D\u044B\u043C\u0438 \u0438\u0433\u0440\u043E\u043A\u0430\u043C\u0438",
  "\u0417\u0430\u043C\u0435\u0447\u0435\u043D\u0430 \u0430\u043D\u043E\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C \u0432 \u0434\u0435\u0440\u0438\u0432\u0430\u0442\u0438\u0432\u0430\u0445"
];
var NEWS_HEADLINES_EN = [
  "Regulator announces review of derivatives venues",
  "Major market maker reports strategy shift",
  "Macro data released \u2014 markets weigh the impact",
  "Technical outage at a rival exchange",
  "Delisting rumors surface on one platform",
  "Central bank doesn't rule out an emergency meeting",
  "Analysts split on the next move",
  "Large fund changes its open position size",
  "Media reports possible regulatory changes",
  "On-chain data shows funds flowing to exchanges",
  "Market liquidity report published",
  "Word of a large OTC deal surfaces",
  "Protocol upgrade completed without incident",
  "Outage at a major liquidity provider",
  "Rating agency revises its outlook",
  "Rumors of a new major market player",
  "Trader survey shows rising uncertainty",
  "Exchange announces scheduled maintenance",
  "Article critical of the current market model published",
  "A large wallet moves a significant sum",
  "Regulator approves a new product for institutions",
  "Developers announce a roadmap update",
  "Sources report talks between major players",
  "Unusual activity spotted in derivatives"
];
var SIM_ACHIEVEMENTS = {
  lowRisk: "\u041D\u0438\u0437\u043A\u0438\u0439 \u0440\u0438\u0441\u043A",
  noImpulsive: "\u041D\u0438 \u043E\u0434\u043D\u043E\u0439 \u0438\u043C\u043F\u0443\u043B\u044C\u0441\u0438\u0432\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438",
  tightDrawdown: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u043E\u0441\u0430\u0434\u043A\u0430 \u043C\u0435\u043D\u0435\u0435 5%",
  survivedVol: "\u041F\u0435\u0440\u0435\u0436\u0438\u043B \u0432\u044B\u0441\u043E\u043A\u0443\u044E \u0432\u043E\u043B\u0430\u0442\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0431\u0435\u0437 \u043B\u0438\u043A\u0432\u0438\u0434\u0430\u0446\u0438\u0438"
};
var SIM_ACHIEVEMENTS_EN = {
  lowRisk: "Low risk",
  noImpulsive: "No impulsive trades",
  tightDrawdown: "Max drawdown under 5%",
  survivedVol: "Survived high volatility without liquidation"
};
var REGIMES = {
  accumulation: { drift: 0, vol: 0.11, revert: 0.09 },
  trend_up: { drift: 0.05, vol: 0.17, revert: 0 },
  trend_down: { drift: -0.05, vol: 0.17, revert: 0 },
  impulse_up: { drift: 0.22, vol: 0.42, revert: 0 },
  impulse_down: { drift: -0.22, vol: 0.42, revert: 0 },
  panic: { drift: -0.42, vol: 0.75, revert: 0 },
  euphoria: { drift: 0.32, vol: 0.58, revert: 0 },
  fakeout_up: { drift: 0.08, vol: 0.23, revert: 0.02 },
  fakeout_down: { drift: -0.08, vol: 0.23, revert: 0.02 },
  highvol_chop: { drift: 0, vol: 0.35, revert: 0.11 },
  lowvol_chop: { drift: 0, vol: 0.09, revert: 0.09 }
};
var REGIME_TRANSITIONS = {
  accumulation: ["accumulation", "trend_up", "trend_down", "highvol_chop", "lowvol_chop"],
  trend_up: ["trend_up", "euphoria", "fakeout_down", "highvol_chop", "accumulation"],
  trend_down: ["trend_down", "panic", "fakeout_up", "highvol_chop", "accumulation"],
  impulse_up: ["euphoria", "trend_up", "highvol_chop", "fakeout_down"],
  impulse_down: ["panic", "trend_down", "highvol_chop", "fakeout_up"],
  panic: ["highvol_chop", "trend_down", "accumulation", "fakeout_up"],
  euphoria: ["highvol_chop", "trend_up", "fakeout_down", "impulse_up"],
  fakeout_up: ["trend_down", "panic", "accumulation"],
  fakeout_down: ["trend_up", "euphoria", "accumulation"],
  highvol_chop: ["accumulation", "trend_up", "trend_down", "impulse_up", "impulse_down", "lowvol_chop"],
  lowvol_chop: ["accumulation", "highvol_chop", "trend_up", "trend_down"]
};
function instantiateRegime(rand, name) {
  const base = REGIMES[name];
  return {
    name,
    drift: base.drift * (0.6 + rand() * 0.8),
    // 0.6x - 1.4x
    vol: base.vol * (0.75 + rand() * 0.5),
    // 0.75x - 1.25x
    revert: base.revert * (0.5 + rand() * 1)
    // 0.5x - 1.5x
  };
}
function createMarketEngine(seed, startPrice = 100, lang = "ru") {
  const rand = mulberry32(seed);
  const regime = "accumulation";
  const inst = instantiateRegime(rand, regime);
  const startCandle = { open: startPrice, high: startPrice, low: startPrice, close: startPrice, t: 0 };
  const eng = {
    rand,
    lang,
    price: startPrice,
    anchor: startPrice,
    emaFast: startPrice,
    emaSlow: startPrice,
    regime,
    prevTickPrice: startPrice,
    regimeElapsed: 0,
    regimeDuration: (10 + rand() * 20) * 1e3,
    // 10-30s — long enough that shifts don't feel mechanical
    transitioning: false,
    transitionT: 0,
    transitionDur: 1e3,
    fromP: inst,
    toP: inst,
    nextRegime: regime,
    activeDrift: inst.drift,
    activeVol: inst.vol,
    activeRevert: inst.revert,
    whaleTimer: 3 + rand() * 6,
    playerFlow: 0,
    // signed, size-scaled exposure of the player's own open position — a real participant too
    candles: [],
    currentCandle: startCandle,
    radarOrders: [],
    radarTimer: 1 + rand() * 2,
    newsEvent: null,
    newsTimer: 999999,
    // set for real right after warmup, below
    elapsedMs: 0
  };
  const WARMUP_SECONDS = 150;
  let warmed = 0;
  while (warmed < WARMUP_SECONDS) {
    stepEngine(eng, 1 / 20);
    warmed += 1 / 20;
  }
  eng.newsEvent = null;
  eng.newsTimer = 8 + rand() * 10;
  return eng;
}
function stepEngine(eng, dtSec, playerFlow = 0) {
  eng.elapsedMs += dtSec * 1e3;
  eng.regimeElapsed += dtSec * 1e3;
  eng.playerFlow = playerFlow;
  if (eng.transitioning) {
    eng.transitionT += dtSec * 1e3;
    const p = Math.min(1, eng.transitionT / eng.transitionDur);
    const jitter = 1 + (eng.rand() - 0.5) * 0.12;
    eng.activeDrift = lerp(eng.fromP.drift, eng.toP.drift, p) * jitter;
    eng.activeVol = lerp(eng.fromP.vol, eng.toP.vol, p);
    eng.activeRevert = lerp(eng.fromP.revert, eng.toP.revert, p);
    if (p >= 1) {
      eng.transitioning = false;
      eng.regime = eng.nextRegime;
      eng.activeDrift = eng.toP.drift;
      eng.regimeDuration = (10 + eng.rand() * 25) * 1e3;
      eng.regimeElapsed = 0;
    }
  } else {
    eng.activeDrift = eng.fromP.drift;
    eng.activeVol = eng.fromP.vol;
    eng.activeRevert = eng.fromP.revert;
    if (eng.regimeElapsed >= eng.regimeDuration) {
      const options = REGIME_TRANSITIONS[eng.regime];
      const next = options[Math.floor(eng.rand() * options.length)];
      eng.fromP = { name: eng.regime, drift: eng.activeDrift, vol: eng.activeVol, revert: eng.activeRevert };
      eng.toP = instantiateRegime(eng.rand, next);
      eng.nextRegime = next;
      eng.transitioning = true;
      eng.transitionT = 0;
      eng.transitionDur = eng.rand() < 0.25 ? 200 + eng.rand() * 400 : 600 + eng.rand() * 2600;
    }
  }
  eng.emaFast += (eng.price - eng.emaFast) * Math.min(1, dtSec * 2.2);
  eng.emaSlow += (eng.price - eng.emaSlow) * Math.min(1, dtSec * 0.6);
  const slope = (eng.emaFast - eng.emaSlow) / eng.emaSlow;
  const crowdMomentum = clamp(slope * 4, -0.028, 0.028);
  eng.whaleTimer -= dtSec;
  if (eng.whaleTimer <= 0) {
    eng.whaleTimer = 4 + eng.rand() * 10;
    if (eng.rand() < 0.3) {
      const shockPct = (eng.rand() < 0.5 ? -1 : 1) * (6e-3 + eng.rand() * 0.016);
      eng.price = Math.max(1, eng.price * (1 + shockPct));
    }
  }
  const scalperNoise = (eng.rand() - 0.5) * 2;
  const panicKick = eng.regime === "panic" || eng.nextRegime === "panic" ? -Math.abs(eng.rand() - 0.5) * 0.4 : 0;
  const meanRevertForce = -((eng.price - eng.anchor) / eng.anchor) * eng.activeRevert;
  const driftPerSec = eng.activeDrift / 100;
  const pctChange = (driftPerSec + crowdMomentum * 0.22 + meanRevertForce + panicKick * 0.01) * dtSec + scalperNoise * (eng.activeVol / 100) * Math.sqrt(dtSec) * 3.2;
  eng.prevTickPrice = eng.price;
  eng.price = Math.max(1, eng.price * (1 + pctChange));
  eng.anchor += (eng.price - eng.anchor) * dtSec * 0.035 + (eng.rand() - 0.5) * eng.price * 5e-4 * Math.sqrt(dtSec) * 3;
  updateCandle(eng);
  updateRadarOrders(eng, dtSec);
  updateNewsEvent(eng, dtSec);
}
function applyMarketImpact(eng, side, marginUsd, leverageUsed) {
  const exposure = marginUsd * leverageUsed;
  const ratio = clamp(exposure / (SIM_START_CAPITAL * 6), 0, 2);
  const impactPct = Math.min(0.02, ratio * 0.012) * (0.7 + eng.rand() * 0.6);
  const sign = side === "buy" ? 1 : -1;
  eng.prevTickPrice = eng.price;
  eng.price = Math.max(1, eng.price * (1 + sign * impactPct));
  updateCandle(eng);
  return impactPct;
}
function updateCandle(eng) {
  const c = eng.currentCandle;
  c.high = Math.max(c.high, eng.price);
  c.low = Math.min(c.low, eng.price);
  c.close = eng.price;
  const candleIndex = Math.floor(eng.elapsedMs / CANDLE_MS);
  if (candleIndex !== c.t) {
    eng.candles.push(c);
    if (eng.candles.length > VISIBLE_CANDLES * 4) eng.candles.shift();
    eng.currentCandle = { open: eng.price, high: eng.price, low: eng.price, close: eng.price, t: candleIndex };
  }
}
var RADAR_MAX_ORDERS = 7;
function spawnRadarOrder(eng) {
  const askBias = clamp(0.5 + eng.playerFlow * 0.12, 0.15, 0.85);
  const side = eng.rand() < askBias ? "ask" : "bid";
  const distPct = 15e-4 + Math.pow(eng.rand(), 1.6) * 0.02;
  const price = side === "bid" ? eng.price * (1 - distPct) : eng.price * (1 + distPct);
  const sizeRoll = eng.rand();
  const size = sizeRoll < 0.5 ? 1 : sizeRoll < 0.82 ? 2 : sizeRoll < 0.96 ? 3 : 4;
  return {
    id: `ro_${Math.floor(eng.elapsedMs)}_${eng.rand().toString(36).slice(2, 7)}`,
    side,
    price,
    size,
    bornMs: eng.elapsedMs,
    ttlMs: 8e3 + eng.rand() * 14e3,
    state: "active",
    // active | pulled | filled
    animMs: 0,
    justMovedMs: null
  };
}
function updateRadarOrders(eng, dtSec) {
  eng.radarTimer -= dtSec;
  const activeCount = eng.radarOrders.reduce((n, o) => n + (o.state === "active" ? 1 : 0), 0);
  if (eng.radarTimer <= 0 && activeCount < RADAR_MAX_ORDERS) {
    eng.radarOrders.push(spawnRadarOrder(eng));
    eng.radarTimer = 1.2 + eng.rand() * 2.6;
  }
  const proximityPct = 9e-4;
  for (const o of eng.radarOrders) {
    if (o.state === "active") {
      const dist = Math.abs(eng.price - o.price) / o.price;
      const expired = eng.elapsedMs - o.bornMs > o.ttlMs;
      if (dist < proximityPct) {
        const r = eng.rand();
        if (r < 0.38) {
          o.state = "pulled";
          o.animMs = 0;
        } else if (r < 0.74) {
          o.state = "filled";
          o.animMs = 0;
          const sign = o.side === "bid" ? -1 : 1;
          eng.price = Math.max(1, eng.price * (1 + sign * 4e-4 * o.size * (0.5 + eng.rand())));
        } else {
          const distPct2 = 2e-3 + eng.rand() * 0.012;
          o.price = o.side === "bid" ? eng.price * (1 - distPct2) : eng.price * (1 + distPct2);
          o.bornMs = eng.elapsedMs;
          o.ttlMs = 6e3 + eng.rand() * 1e4;
          o.justMovedMs = 0;
        }
      } else if (expired) {
        o.state = "pulled";
        o.animMs = 0;
      }
    } else {
      o.animMs += dtSec * 1e3;
    }
    if (o.justMovedMs != null) o.justMovedMs += dtSec * 1e3;
  }
  eng.radarOrders = eng.radarOrders.filter((o) => o.state === "active" || o.animMs < 550);
}
function spawnNewsEvent(eng) {
  const headlines = eng.lang === "en" ? NEWS_HEADLINES_EN : NEWS_HEADLINES;
  const hasEffect = eng.rand() < 0.6;
  const direction = eng.rand() < 0.5 ? 1 : -1;
  const tierRoll = eng.rand();
  const magnitudePct = !hasEffect ? 0 : tierRoll < 0.5 ? 3e-3 + eng.rand() * 6e-3 : tierRoll < 0.85 ? 0.01 + eng.rand() * 0.014 : 0.026 + eng.rand() * 0.03;
  return {
    id: `news_${Math.floor(eng.elapsedMs)}`,
    headline: headlines[Math.floor(eng.rand() * headlines.length)],
    hasEffect,
    targetPct: direction * magnitudePct,
    spawnMs: eng.elapsedMs,
    rampMs: 2e3 + eng.rand() * 1e3,
    // 2-3s
    appliedPct: 0
  };
}
function updateNewsEvent(eng, dtSec) {
  eng.newsTimer -= dtSec;
  if (eng.newsTimer <= 0) {
    eng.newsEvent = spawnNewsEvent(eng);
    eng.newsTimer = NEWS_INTERVAL_SEC + (eng.rand() - 0.5) * 8;
  }
  const ev = eng.newsEvent;
  if (ev && ev.targetPct !== 0) {
    const age = eng.elapsedMs - ev.spawnMs;
    if (age < ev.rampMs) {
      const shouldBeApplied = ev.targetPct * Math.min(1, age / ev.rampMs);
      const delta = shouldBeApplied - ev.appliedPct;
      const jitter = 1 + (eng.rand() - 0.5) * 0.3;
      eng.price = Math.max(1, eng.price * (1 + delta * jitter));
      ev.appliedPct = shouldBeApplied;
    }
  }
}
function aggregateCandles(candles, current, factor) {
  if (factor <= 1) return [...candles, current];
  const all = [...candles, current];
  const groups = [];
  const byKey = /* @__PURE__ */ new Map();
  for (const c of all) {
    const key = Math.floor(c.t / factor);
    let g = byKey.get(key);
    if (!g) {
      g = { open: c.open, high: c.high, low: c.low, close: c.close, t: key };
      byKey.set(key, g);
      groups.push(g);
    } else {
      g.high = Math.max(g.high, c.high);
      g.low = Math.min(g.low, c.low);
      g.close = c.close;
    }
  }
  return groups;
}
function LogoMark({ size = 26, color, accent, animated = false }) {
  const c = color || BASE.ink;
  const dashProps = animated ? { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 } : {};
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 64 64", fill: "none", children: [
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M13 30 V19 Q13 14 18 14 H38 L47 14",
        stroke: c,
        strokeWidth: "6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...dashProps,
        style: animated ? { animation: "drawMark 0.8s ease forwards" } : void 0
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M51 34 V45 Q51 50 46 50 H26 L17 50",
        stroke: c,
        strokeWidth: "6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...dashProps,
        style: animated ? { animation: "drawMark 0.8s ease 0.2s forwards" } : void 0
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M13 32 H23 L27 23 L32 41 L36 32 H51",
        stroke: accent,
        strokeWidth: "2.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...dashProps,
        style: animated ? { animation: "drawMark 0.7s ease 0.75s forwards" } : void 0
      }
    ),
    /* @__PURE__ */ jsx("rect", { x: "45", y: "8", width: "3.5", height: "3.5", fill: c, opacity: "0.55", style: animated ? { animation: "dotIn 0.3s ease 1.2s backwards" } : void 0 }),
    /* @__PURE__ */ jsx("rect", { x: "54", y: "17", width: "2.5", height: "2.5", fill: c, opacity: "0.35", style: animated ? { animation: "dotIn 0.3s ease 1.32s backwards" } : void 0 }),
    /* @__PURE__ */ jsx("rect", { x: "9", y: "45", width: "2.5", height: "2.5", fill: c, opacity: "0.35", style: animated ? { animation: "dotIn 0.3s ease 1.44s backwards" } : void 0 })
  ] });
}
function LogoSpinner({ size = 22, color, accent }) {
  return /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", animation: "logoPulseFade 1.1s ease-in-out infinite" }, children: /* @__PURE__ */ jsx(LogoMark, { size, color, accent }) });
}
// ---- DecodeText.js -----------------------------------------------------------
// Reveal effect for text/numbers: instead of a plain fade-in, the full string is shown
// immediately but every non-space character is randomly scrambled (matching its own
// script/case/digit-ness so cyrillic stays cyrillic, digits stay digits — no layout shift,
// no width jump) and characters "lock in" to their real value left-to-right over time, like
// text decrypting on a terminal. Total animation length is capped via maxTotalMs regardless
// of string length, so a 6-word label and a 300-character AI paragraph both settle in roughly
// the same perceived time. Respects prefers-reduced-motion by skipping straight to final text.
var DECODE_POOL_CYR_UP = "\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F";
var DECODE_POOL_CYR_LO = "\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F";
var DECODE_POOL_LAT_UP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var DECODE_POOL_LAT_LO = "abcdefghijklmnopqrstuvwxyz";
var DECODE_POOL_DIGIT = "0123456789";
function decodeScrambleChar(ch) {
  if (ch >= "0" && ch <= "9") return DECODE_POOL_DIGIT[Math.floor(Math.random() * 10)];
  if (ch >= "\u0410" && ch <= "\u042F") return DECODE_POOL_CYR_UP[Math.floor(Math.random() * 32)];
  if (ch >= "\u0430" && ch <= "\u044F") return DECODE_POOL_CYR_LO[Math.floor(Math.random() * 32)];
  if (ch >= "A" && ch <= "Z") return DECODE_POOL_LAT_UP[Math.floor(Math.random() * 26)];
  if (ch >= "a" && ch <= "z") return DECODE_POOL_LAT_LO[Math.floor(Math.random() * 26)];
  return ch;
}
var decodeReduceMotion = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
function DecodeText({ text, as = "span", className = "", style, maxTotalMs = 520, revealMs = 90 }) {
  const value = text == null ? "" : String(text);
  const [display, setDisplay] = useState(value);
  const timerRef = useRef(null);
  useEffect(() => {
    if (decodeReduceMotion && decodeReduceMotion.matches) {
      setDisplay(value);
      return;
    }
    if (!value) {
      setDisplay("");
      return;
    }
    const len = value.length;
    const charDelay = Math.max(2, Math.min(18, (maxTotalMs - revealMs) / len));
    const totalMs = (len - 1) * charDelay + revealMs;
    const tickMs = 55;
    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = value[i];
        if (ch === " " || ch === "\n" || ch === "\t") {
          out += ch;
          continue;
        }
        out += elapsed >= i * charDelay + revealMs ? ch : decodeScrambleChar(ch);
      }
      setDisplay(out);
      if (elapsed < totalMs) {
        timerRef.current = setTimeout(tick, tickMs);
      } else {
        setDisplay(value);
      }
    };
    timerRef.current = setTimeout(tick, tickMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, maxTotalMs, revealMs]);
  return /* @__PURE__ */ jsx(as, { className, style, children: display });
}
function Wordmark({ accent, size = 15, animated = false, wide = false }) {
  return /* @__PURE__ */ jsxs("span", { className: "flex items-baseline", style: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: size, letterSpacing: wide ? "0.28em" : void 0, color: BASE.ink, animation: animated ? "riseIn 0.5s ease 1.55s backwards" : void 0 }, children: [
    "mind",
    /* @__PURE__ */ jsxs("span", { className: "relative", style: { color: accent }, children: [
      ".exe",
      /* @__PURE__ */ jsx("span", { className: "absolute left-0 -bottom-[3px] w-full h-px", style: { background: `repeating-linear-gradient(90deg, ${accent} 0, ${accent} 3px, transparent 3px, transparent 6px)` } })
    ] })
  ] });
}
var SPLASH_BLACKHOLE_IMG = "data:image/jpeg;base64,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";
var SPLASH_BLACKHOLE_MASK = "data:image/png;base64,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";
function Splash({ accent, fading }) {
  return /* @__PURE__ */ jsxs("div", { className: "splash2-root fixed inset-0 z-50 transition-opacity duration-500", style: { opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "auto" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "splash2-bh-scene", children: [
      /* @__PURE__ */ jsx("img", { className: "splash2-bh-img", src: SPLASH_BLACKHOLE_IMG, alt: "" }),
      /* @__PURE__ */ jsx("div", { className: "splash2-bh-shimmer" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "splash2-vignette" }),
    /* @__PURE__ */ jsxs("div", { className: "splash2-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "splash2-radar", children: [
        /* @__PURE__ */ jsx("span", { className: "splash2-ring ring-a" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-ring ring-b" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-crosshair ch-h" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-crosshair ch-v" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-node node-1" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-node node-2" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-node node-3" }),
        /* @__PURE__ */ jsx(LogoMark, { size: 42, accent, animated: true })
      ] }),
      /* @__PURE__ */ jsx(Wordmark, { accent, size: 24, animated: true, wide: true }),
      /* @__PURE__ */ jsx("div", { className: "splash2-divider" }),
      /* @__PURE__ */ jsx("p", { className: "splash2-tagline", children: "your mind leaves a pattern" }),
      /* @__PURE__ */ jsxs("div", { className: "splash2-dots", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("span", { className: "splash2-dots-line" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-dot" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-dot" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-dot active" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-dot" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-dot" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-dots-line" })
      ] })
    ] })
  ] });
}
function Pill({ active, children, onClick, accent }) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      className: "px-3.5 py-1.5 rounded-full text-[12.5px] transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0",
      style: { background: active ? `${accent}12` : "transparent", color: active ? accent : BASE.inkDim, border: `1px solid ${active ? accent + "40" : BASE.line}` },
      children
    }
  );
}
function Card({ children, className = "", glowing = false, accent, style = {} }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `rounded-2xl p-4 transition-shadow duration-300 break-inside-avoid ${className}`,
      style: {
        background: BASE.surface,
        border: `1px solid ${glowing ? accent + "45" : BASE.line}`,
        boxShadow: glowing ? ring(accent) + ", inset 0 1px 0 rgba(255,255,255,0.02)" : "inset 0 1px 0 rgba(255,255,255,0.02)",
        ...style
      },
      children
    }
  );
}
function Toast({ text }) {
  if (!text) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full text-xs toast-in",
      style: { background: BASE.surface2, border: `1px solid ${BASE.line}`, color: BASE.ink, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" },
      children: text
    }
  );
}
function WalletBadge({ balance, accent, onClick }) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick,
      className: "flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-full transition-all duration-150 active:scale-95",
      style: { border: `1px solid ${BASE.line}`, background: BASE.surface },
      children: [
        /* @__PURE__ */ jsx(Coins, { size: 13, style: { color: accent } }),
        /* @__PURE__ */ jsx("span", { className: "text-[12px] leading-none", style: { fontFamily: "'JetBrains Mono', monospace", color: BASE.ink, fontWeight: 500 }, children: groupThousands(balance) })
      ]
    }
  );
}
function WalletSheet({ open, onClose, balance, ledger, accent }) {
  if (!open) return null;
  const rows = [...ledger].reverse();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end justify-center",
      onClick: onClose,
      style: { background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          className: "w-full max-w-md rounded-t-[28px] px-5 pt-4 pb-8",
          style: { background: BASE.surface, border: `1px solid ${BASE.line}`, borderBottom: "none", maxHeight: "78vh", overflowY: "auto", animation: "riseIn 0.28s ease-out" },
          children: [
            /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4", style: { width: 36, height: 4, borderRadius: 2, background: BASE.line } }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: "MindCoin" }),
              /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1 -m-1", children: /* @__PURE__ */ jsx(XIcon, { size: 16, style: { color: BASE.inkFaint } }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 mb-1", children: [
              /* @__PURE__ */ jsx(Coins, { size: 24, style: { color: accent } }),
              /* @__PURE__ */ jsx("span", { className: "text-[30px] leading-none", style: { fontFamily: "'JetBrains Mono', monospace", color: BASE.ink, fontWeight: 600 }, children: groupThousands(balance) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] mb-6", style: { color: BASE.inkFaint }, children: "\u041F\u043E\u043A\u0430 \u043D\u0435 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D\u044B \u043A \u043F\u043E\u043A\u0443\u043F\u043A\u0430\u043C \u2014 \u043E\u0431\u043C\u0435\u043D \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0437\u0436\u0435, \u0432 App Store-\u0432\u0435\u0440\u0441\u0438\u0438." }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: "\u041F\u043E\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F" }),
            rows.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm py-2", style: { color: BASE.inkFaint }, children: "\u041F\u043E\u043A\u0430 \u043F\u0443\u0441\u0442\u043E. +10 \u043D\u0430\u0447\u0438\u0441\u043B\u044F\u0435\u0442\u0441\u044F \u0437\u0430 \u0432\u0445\u043E\u0434 \u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C, +5 \u2014 \u0437\u0430 \u043F\u043E\u0431\u0435\u0434\u0443 \u043D\u0430\u0434 \u0440\u044B\u043D\u043A\u043E\u043C \u0432 \u0438\u0433\u0440\u0435." }) : /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: rows.map((tx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2.5", style: { borderBottom: `1px solid ${BASE.line}` }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: BASE.ink }, children: tx.reason }),
                /* @__PURE__ */ jsx("div", { className: "text-[11px]", style: { color: BASE.inkFaint }, children: relTime(new Date(tx.date)) })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm", style: { color: WIN, fontFamily: "'JetBrains Mono', monospace" }, children: [
                "+",
                tx.amount
              ] })
            ] }, tx.id)) })
          ]
        }
      )
    }
  );
}
var RU_WEEKDAY_SHORT = ["\u0412\u0441", "\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431"];
var EN_WEEKDAY_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function useStreak(entries, lang = "ru") {
  return useMemo(() => {
    const dateSet = new Set(entries.map((e) => e.date.toDateString()));
    const cursor = /* @__PURE__ */ new Date();
    if (!dateSet.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (dateSet.has(cursor.toDateString())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    const today = /* @__PURE__ */ new Date();
    const mondayOffset = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset);
    const weekdayLabels = lang === "en" ? EN_WEEKDAY_SHORT : RU_WEEKDAY_SHORT;
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push({ label: weekdayLabels[d.getDay()], filled: dateSet.has(d.toDateString()) });
    }
    return { streak, week };
  }, [entries, lang]);
}
function calculateChallengeProgress(entries, lang = "ru") {
  const sortedDesc = [...entries].sort((a, b) => b.date - a.date);
  let noRevenge = 0;
  for (const e of sortedDesc) {
    if (e.tag === "\u0420\u0435\u0432\u0430\u043D\u0448") break;
    noRevenge++;
    if (noRevenge >= 5) break;
  }
  const last5 = sortedDesc.slice(0, 5);
  const reflected = last5.filter((e) => e.pull && e.pull !== "\u2014" && e.lesson && e.lesson !== "\u2014").length;
  let winStreak = 0;
  for (const e of sortedDesc) {
    if (e.r === null || e.r === void 0 || e.r <= 0) break;
    winStreak++;
    if (winStreak >= 3) break;
  }
  if (lang === "en") {
    return [
      { id: "revenge", title: "No revenge trades", desc: '5 trades in a row without the "Revenge" tag.', progress: noRevenge, goal: 5 },
      { id: "reflect", title: "Full reflection", desc: "Fill in both reflection fields \u2014 in your last 5 trades.", progress: reflected, goal: 5 },
      { id: "winstreak", title: "Positive streak", desc: "3 trades in a row with a positive result.", progress: winStreak, goal: 3 }
    ];
  }
  return [
    { id: "revenge", title: "\u0411\u0435\u0437 \u0440\u0435\u0432\u0430\u043D\u0448-\u0442\u0440\u0435\u0439\u0434\u043E\u0432", desc: "5 \u0441\u0434\u0435\u043B\u043E\u043A \u043F\u043E\u0434\u0440\u044F\u0434 \u0431\u0435\u0437 \u0442\u0435\u0433\u0430 \xAB\u0420\u0435\u0432\u0430\u043D\u0448\xBB.", progress: noRevenge, goal: 5 },
    { id: "reflect", title: "\u041F\u043E\u043B\u043D\u0430\u044F \u0440\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u044F", desc: "\u0417\u0430\u043F\u043E\u043B\u043D\u044F\u0439 \u043E\u0431\u0430 \u043F\u043E\u043B\u044F \u0440\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u0438 \u2014 \u0432 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 5 \u0441\u0434\u0435\u043B\u043A\u0430\u0445.", progress: reflected, goal: 5 },
    { id: "winstreak", title: "\u041F\u043B\u044E\u0441\u043E\u0432\u0430\u044F \u0441\u0435\u0440\u0438\u044F", desc: "3 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u0434\u0440\u044F\u0434 \u0441 \u043F\u043E\u043B\u043E\u0436\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u043C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u043C.", progress: winStreak, goal: 3 }
  ];
}
function WeekDots({ week, accent }) {
  return /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: week.map((d, i) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
    /* @__PURE__ */ jsx("span", { className: "text-[9px]", style: { color: BASE.inkFaint }, children: d.label }),
    /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full transition-all duration-300", style: { background: d.filled ? accent : "transparent", border: `1px solid ${d.filled ? accent : BASE.line}` } })
  ] }, i)) });
}
function Sparkline({ points, color, width = 68, height = 26 }) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);
  const coords = points.map((v, i) => `${(i * stepX).toFixed(1)},${(height - 3 - (v - min) / range * (height - 6)).toFixed(1)}`).join(" ");
  return /* @__PURE__ */ jsx("svg", { width, height, viewBox: `0 0 ${width} ${height}`, children: /* @__PURE__ */ jsx("polyline", { points: coords, fill: "none", stroke: color, strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function Home({ entries, goTo, accent, name, measureMode, currency, startingCapital, lastCalibration, analytics, t, lang }) {
  const total = entries.length;
  const [patternOpen, setPatternOpen] = useState(false);
  const closedEntries = useMemo(() => entries.filter(isEntryClosed), [entries]);
  const traderPatterns = useMemo(() => analyzeTraderPatterns(closedEntries, lang), [closedEntries, lang]);
  const calibratedToday = lastCalibration && isToday(lastCalibration.date);
  const consciousScoreTarget = analytics.awareness.score.value ?? 55;
  const reflectionScore = analytics.reflection.score.value;
  const disciplineScore = analytics.discipline.score.value;
  const riskStabilityScore = analytics.risk.stability.value;
  const level = calculateTraderLevel(total);
  const { streak, week } = useStreak(entries, lang);
  const moodKey = consciousScoreTarget > 80 ? t.home.moodCalm : consciousScoreTarget > 60 ? t.home.moodStable : t.home.moodReactive;
  const withR = entries.filter((e) => e.r !== null && e.r !== void 0);
  const cumResult = withR.reduce((s, e) => s + e.r, 0);
  const heroTarget = measureMode === "currency" ? startingCapital + cumResult : cumResult;
  const sparkPoints = useMemo(() => {
    const sorted = [...withR].sort((a, b) => a.date - b.date);
    let cum = measureMode === "currency" ? startingCapital : 0;
    return sorted.map((e) => {
      cum += e.r;
      return cum;
    }).slice(-10);
  }, [withR, measureMode, startingCapital]);
  const consciousScore = Math.round(useAnimatedNumber(consciousScoreTarget));
  const animatedStreak = Math.round(useAnimatedNumber(streak));
  const animatedHero = useAnimatedNumber(heroTarget);
  const tiles = [
    { id: "new", label: t.home.newEntryTile, icon: BookOpen, primary: true },
    { id: "log", label: t.home.logTile, icon: NotebookText },
    { id: "patterns", label: t.home.patternsTile, icon: LineChartIcon },
    { id: "simulator", label: t.home.simulatorTile, icon: Swords }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-[24px] leading-tight mb-1", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 500 }, children: t.home.welcomeBack(name || t.home.defaultName) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: t.home.subtitle })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:columns-2 lg:gap-4", children: [
    /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-1.5", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: [
          /* @__PURE__ */ jsx(Wallet, { size: 11, className: "inline mr-1 -mt-0.5", style: { color: accent } }),
          measureMode === "currency" ? t.home.capital : t.home.totalResult
        ] }),
        sparkPoints.length >= 2 && /* @__PURE__ */ jsx(Sparkline, { points: sparkPoints, color: cumResult >= 0 ? WIN : LOSS })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-[28px] leading-none mb-1", style: { fontFamily: "'JetBrains Mono', monospace", color: BASE.ink, fontWeight: 500 }, children: measureMode === "currency" ? formatBalance(animatedHero, currency) : formatResult(animatedHero, "R", currency) }),
      measureMode === "currency" && /* @__PURE__ */ jsxs("span", { className: "text-[11px]", style: { color: cumResult >= 0 ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: [
        formatResult(cumResult, "currency", currency),
        " ",
        t.home.sinceStart
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => goTo("calibration"),
        className: "w-full flex items-center justify-between px-4 py-3 rounded-2xl mb-3 text-left transition-all duration-200 active:scale-[0.98] break-inside-avoid",
        style: { border: `1px solid ${calibratedToday ? BASE.line : accent + "40"}`, background: calibratedToday ? BASE.surface : `${accent}0D` },
        children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: [
            /* @__PURE__ */ jsx(Gauge, { size: 15, style: { color: calibratedToday ? lastCalibration.tierColor : accent } }),
            calibratedToday ? t.home.calibrationToday(lastCalibration.pct) : t.home.calibrationCta
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { size: 15, style: { color: BASE.inkFaint } })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Card, { accent, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[11px]", style: { color: BASE.inkDim, fontFamily: "'Space Grotesk', sans-serif" }, children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 12, style: { color: accent } }),
          " ",
          t.home.insight
        ] }),
        /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full animate-pulse", style: { background: accent } })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: [
        t.home.moodPrefix,
        /* @__PURE__ */ jsx("span", { style: { color: accent }, children: moodKey }),
        ".",
        " ",
        total >= 4 ? t.home.insightConfident : t.home.insightFocus
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 divide-x", style: { borderColor: BASE.line }, children: [
        /* @__PURE__ */ jsxs("div", { className: "pr-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1", style: { color: BASE.inkFaint }, children: t.home.traderLevel }),
          /* @__PURE__ */ jsx("div", { className: "text-[26px] leading-none", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 500 }, children: level })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pl-4", style: { borderLeft: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1", style: { color: BASE.inkFaint }, children: t.home.awareness }),
          /* @__PURE__ */ jsxs("div", { className: "text-[26px] leading-none", style: { fontFamily: "'Space Grotesk', sans-serif", color: accent, fontWeight: 500 }, children: [
            consciousScore,
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mt-3 mb-2.5", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${consciousScore}%`, background: accent } }) }),
      total > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap text-[10px]", style: { color: BASE.inkFaint }, children: [
        reflectionScore != null && /* @__PURE__ */ jsxs("span", { children: [
          t.home.reflection,
          " ",
          reflectionScore,
          "%"
        ] }),
        reflectionScore != null && (disciplineScore != null || riskStabilityScore != null) && /* @__PURE__ */ jsx("span", { children: "\xB7" }),
        disciplineScore != null && /* @__PURE__ */ jsxs("span", { children: [
          t.home.discipline,
          " ",
          disciplineScore,
          "%"
        ] }),
        disciplineScore != null && riskStabilityScore != null && /* @__PURE__ */ jsx("span", { children: "\xB7" }),
        riskStabilityScore != null && /* @__PURE__ */ jsxs("span", { children: [
          t.home.riskStability,
          " ",
          riskStabilityScore,
          "%"
        ] }),
        calibratedToday && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { children: "\xB7" }),
          /* @__PURE__ */ jsxs("span", { style: { color: lastCalibration.tierColor }, children: [
            t.home.calibrationTodayShort,
            " ",
            lastCalibration.pct,
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-3 mt-3", style: { borderTop: `1px solid ${BASE.line}` }, children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => goTo("challenge"), className: "flex items-center gap-1.5 text-xs transition-transform duration-150 active:scale-95", style: { color: BASE.inkDim }, children: [
          /* @__PURE__ */ jsx(Flame, { size: 13, className: streak > 0 ? "flame-flicker" : "", style: { color: streak > 0 ? "#D98A4A" : BASE.inkFaint } }),
          streak > 0 ? t.home.streakDays(animatedStreak) : t.home.startStreak
        ] }),
        /* @__PURE__ */ jsx(WeekDots, { week, accent })
      ] })
    ] }),
    traderPatterns.available ? traderPatterns.primaryPattern ? /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: t.pattern.yourPattern }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] px-2 py-0.5 rounded-full", style: { color: accent, border: `1px solid ${accent}40` }, children: traderPatterns.primaryPattern.confidence === "high" ? t.pattern.strongSignal : traderPatterns.primaryPattern.confidence === "medium" ? t.pattern.observedPattern : t.pattern.someSigns })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-base mb-1.5", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: traderPatterns.primaryPattern.title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
        /* @__PURE__ */ jsx("span", { children: t.pattern.trades(traderPatterns.primaryPattern.stats.trades) }),
        /* @__PURE__ */ jsxs("span", { children: [
          traderPatterns.primaryPattern.stats.winRate,
          "% ",
          t.pattern.winShort
        ] }),
        /* @__PURE__ */ jsxs("span", { style: { color: traderPatterns.primaryPattern.stats.avgR >= 0 ? WIN : LOSS }, children: [
          formatResult(traderPatterns.primaryPattern.stats.avgR ?? 0, "R", currency),
          " ",
          t.pattern.avgShort
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-3", style: { color: BASE.inkDim }, children: traderPatterns.primaryPattern.description }),
      /* @__PURE__ */ jsx("button", { onClick: () => setPatternOpen(true), className: "text-sm transition-transform duration-150 active:scale-95", style: { color: accent, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: t.pattern.breakdown })
    ] }) : traderPatterns.healthyPatterns.length > 0 ? /* @__PURE__ */ jsxs(Card, { accent, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: t.pattern.yourPattern }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] px-2 py-0.5 rounded-full", style: { color: WIN, border: `1px solid ${WIN}40` }, children: t.pattern.strength })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-base mb-1.5", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: traderPatterns.healthyPatterns[0].title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
        /* @__PURE__ */ jsx("span", { children: t.pattern.trades(traderPatterns.healthyPatterns[0].stats.trades) }),
        /* @__PURE__ */ jsxs("span", { children: [
          traderPatterns.healthyPatterns[0].stats.winRate,
          "% ",
          t.pattern.winShort
        ] }),
        /* @__PURE__ */ jsxs("span", { style: { color: WIN }, children: [
          formatResult(traderPatterns.healthyPatterns[0].stats.avgR ?? 0, "R", currency),
          " ",
          t.pattern.avgShort
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.inkDim }, children: traderPatterns.healthyPatterns[0].description })
    ] }) : /* @__PURE__ */ jsxs(Card, { className: "mb-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-1.5", style: { color: BASE.inkFaint }, children: t.pattern.yourPattern }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.inkDim }, children: t.pattern.noClearPattern })
    ] }) : /* @__PURE__ */ jsxs(Card, { className: "mb-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-1.5", style: { color: BASE.inkFaint }, children: t.pattern.yourPattern }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-2", style: { color: BASE.ink }, children: t.pattern.buildingUp(traderPatterns.sampleSize, traderPatterns.needed) }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-2", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${Math.min(100, traderPatterns.sampleSize / traderPatterns.needed * 100)}%`, background: accent } }) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed", style: { color: BASE.inkFaint }, children: t.pattern.buildingUpDesc })
    ] }),
    patternOpen && traderPatterns.primaryPattern && /* @__PURE__ */ jsx(TraderPatternDetail, { pattern: traderPatterns.primaryPattern, accent, currency, onClose: () => setPatternOpen(false), t, lang }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 mb-3 break-inside-avoid", children: tiles.map((tile) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => goTo(tile.id),
        className: "flex items-center justify-between px-4 py-3.5 rounded-2xl text-left transition-all duration-200 active:scale-[0.98]",
        style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: BASE.ink },
        children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { fontFamily: "'Space Grotesk', sans-serif" }, children: [
            /* @__PURE__ */ jsx(tile.icon, { size: 15, style: { color: tile.primary ? accent : BASE.inkDim } }),
            " ",
            tile.label
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { size: 15, style: { color: BASE.inkFaint } })
        ]
      },
      tile.id
    )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs px-1 pt-3", style: { borderTop: `1px solid ${BASE.line}`, color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "BTC.D ",
        /* @__PURE__ */ jsxs("span", { style: { color: BASE.ink }, children: [
          BTC_DOMINANCE,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("span", { children: [
        "F&G ",
        /* @__PURE__ */ jsxs("span", { style: { color: BASE.ink }, children: [
          FEAR_GREED.score,
          " \xB7 ",
          FEAR_GREED.label
        ] })
      ] }),
      /* @__PURE__ */ jsxs("span", { style: { fontFamily: "'Space Grotesk', sans-serif" }, children: [
        t.home.market,
        ": ",
        moodKey
      ] })
    ] })
  ] });
}
function TraderPatternDetail({ pattern, accent, currency, onClose, t, lang }) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center", onClick: onClose, style: { background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: (e) => e.stopPropagation(),
      className: "w-full max-w-md rounded-t-[28px] px-5 pt-4 pb-8",
      style: { background: BASE.surface, border: `1px solid ${BASE.line}`, borderBottom: "none", maxHeight: "88vh", overflowY: "auto", animation: "riseIn 0.28s ease-out" },
      children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4", style: { width: 36, height: 4, borderRadius: 2, background: BASE.line } }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: t.pattern.detailTitle }),
          /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1 -m-1", children: /* @__PURE__ */ jsx(XIcon, { size: 16, style: { color: BASE.inkFaint } }) })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: pattern.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-4", style: { color: BASE.inkDim }, children: pattern.description }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.pattern.tradesLabel }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: pattern.stats.trades })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.pattern.winRateLabel }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: [
              pattern.stats.winRate,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.pattern.avgRLabel }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: (pattern.stats.avgR ?? 0) >= 0 ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(pattern.stats.avgR ?? 0, "R", currency) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.pattern.comparison }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink }, children: t.pattern.similarSituations }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: (pattern.stats.avgR ?? 0) >= 0 ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(pattern.stats.avgR ?? 0, "R", currency) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.inkFaint }, children: t.pattern.otherTrades }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: (pattern.comparisonStats.avgR ?? 0) >= 0 ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(pattern.comparisonStats.avgR ?? 0, "R", currency) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.pattern.whereOnMap }),
        /* @__PURE__ */ jsx("div", { style: { width: "100%", height: 220 }, className: "mb-4", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(ScatterChart, { margin: { top: 10, right: 10, bottom: 20, left: 0 }, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: BASE.line }),
          /* @__PURE__ */ jsx(
            XAxis,
            {
              type: "number",
              dataKey: "x",
              domain: [0, 100],
              tick: { fill: BASE.inkFaint, fontSize: 10 },
              stroke: BASE.line,
              label: { value: t.pattern.fearToConfidence, position: "insideBottom", offset: -10, fill: BASE.inkFaint, fontSize: 10 }
            }
          ),
          /* @__PURE__ */ jsx(
            YAxis,
            {
              type: "number",
              dataKey: "y",
              domain: [0, 100],
              reversed: true,
              tick: { fill: BASE.inkFaint, fontSize: 10 },
              stroke: BASE.line,
              label: { value: t.pattern.nervousToCalm, angle: -90, position: "insideLeft", fill: BASE.inkFaint, fontSize: 10 }
            }
          ),
          /* @__PURE__ */ jsx(ZAxis, { range: [70, 70] }),
          /* @__PURE__ */ jsx(Scatter, { data: pattern.comparisonStats._trades || [], fill: BASE.line, isAnimationActive: false }),
          /* @__PURE__ */ jsx(Scatter, { data: pattern.stats._trades || [], isAnimationActive: false, children: (pattern.stats._trades || []).map((t2) => /* @__PURE__ */ jsx(Cell, { fill: accent }, t2.id)) })
        ] }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.pattern.tradeExamples }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 mb-4", children: pattern.sampleTrades.map((tr) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm py-1.5", style: { borderBottom: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { background: outcomeColor(tr.outcome) } }),
          /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, className: "text-xs shrink-0", children: tr.date.toLocaleDateString(lang === "en" ? "en-US" : "ru-RU", { day: "2-digit", month: "2-digit" }) }),
          /* @__PURE__ */ jsx("span", { style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, className: "shrink-0", children: tr.instrument }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs shrink-0", style: { color: BASE.inkFaint }, children: [
            "x",
            Math.round(tr.x),
            " y",
            Math.round(tr.y)
          ] }),
          tr.r !== null && tr.r !== void 0 && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0", style: { color: outcomeColor(tr.outcome), fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(tr.r, "R", currency) })
        ] }, tr.id)) }),
        /* @__PURE__ */ jsxs(Card, { className: "mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.pattern.whyShown }),
          /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: t.pattern.whyShownText(pattern.evidenceCount, formatResult(pattern.stats.avgR ?? 0, "R", currency), formatResult(pattern.comparisonStats.avgR ?? 0, "R", currency)) })
        ] })
      ]
    }
  ) });
}
function EmotionGrid({ x, y, onChange, accent }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [justPlaced, setJustPlaced] = useState(false);
  const place = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const px = (clientX - rect.left) / rect.width * 100;
    const py = (clientY - rect.top) / rect.height * 100;
    onChange({ x: Math.min(100, Math.max(0, Math.round(px))), y: Math.min(100, Math.max(0, Math.round(py))) });
  };
  const onDown = (e) => {
    setDragging(true);
    if (ref.current.setPointerCapture && e.pointerId !== void 0) {
      try {
        ref.current.setPointerCapture(e.pointerId);
      } catch (_) {
      }
    }
    place(e);
  };
  const onMove = (e) => {
    if (dragging) place(e);
  };
  const onUp = () => {
    setDragging(false);
    setJustPlaced(true);
    setTimeout(() => setJustPlaced(false), 500);
  };
  const has = x !== null && y !== null;
  const label = "text-[10px] uppercase tracking-wide";
  const quadrantText = () => {
    if (!has) return null;
    if (x >= 50 && y >= 50) return "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E \u0438 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E";
    if (x >= 50 && y < 50) return "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E, \u043D\u043E \u043D\u0430 \u0432\u0437\u0432\u043E\u0434\u0435";
    if (x < 50 && y >= 50) return "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u043E, \u043D\u043E \u043D\u0435\u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E";
    return "\u0421\u0442\u0440\u0430\u0448\u043D\u043E \u0438 \u043D\u0430 \u043D\u0435\u0440\u0432\u0430\u0445";
  };
  const quadrantColor = has ? x >= 50 && y >= 50 ? WIN : x < 50 && y < 50 ? LOSS : BASE.inkDim : BASE.inkFaint;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "text-center mb-1.5", children: /* @__PURE__ */ jsx("span", { className: label, style: { color: BASE.inkFaint }, children: "\u041D\u0430 \u043D\u0435\u0440\u0432\u0430\u0445" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5", children: [
      /* @__PURE__ */ jsx("span", { className: label, style: { color: BASE.inkFaint, writingMode: "vertical-rl", transform: "rotate(180deg)" }, children: "\u0421\u0442\u0440\u0430\u0445" }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          ref,
          onPointerDown: onDown,
          onPointerMove: onMove,
          onPointerUp: onUp,
          onPointerLeave: onUp,
          className: "relative flex-1 aspect-square rounded-2xl cursor-crosshair touch-none select-none overflow-hidden",
          style: { background: `radial-gradient(circle at 10% 10%, ${LOSS}0D 0%, transparent 45%), radial-gradient(circle at 90% 90%, ${WIN}0D 0%, transparent 45%), ${BASE.surface2}`, border: `1px solid ${BASE.line}` },
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-0 bottom-0 w-px", style: { background: BASE.line } }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-0 right-0 h-px", style: { background: BASE.line } }),
            has && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-0", style: { top: `${y}%`, borderTop: `1px dashed ${accent}45`, transition: dragging ? "none" : "top 0.15s ease-out" } }),
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 bottom-0", style: { left: `${x}%`, borderLeft: `1px dashed ${accent}45`, transition: dragging ? "none" : "left 0.15s ease-out" } }),
              justPlaced && /* @__PURE__ */ jsx("div", { className: "absolute rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none emotion-ripple", style: { left: `${x}%`, top: `${y}%`, border: `1.5px solid ${accent}` } }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2",
                  style: { left: `${x}%`, top: `${y}%`, background: accent, boxShadow: `0 0 0 4px ${accent}25`, transition: dragging ? "none" : "left 0.15s ease-out, top 0.15s ease-out" }
                }
              )
            ] }),
            !has && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center text-center px-6 text-xs", style: { color: BASE.inkFaint }, children: "\u041E\u0442\u043C\u0435\u0442\u044C, \u0433\u0434\u0435 \u0431\u044B\u043B \u0442\u044B, \u0430 \u043D\u0435 \u0433\u0434\u0435 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u043B \u0431\u044B\u0442\u044C" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: label, style: { color: BASE.inkFaint, writingMode: "vertical-rl" }, children: "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-center mt-1.5 mb-1", children: /* @__PURE__ */ jsx("span", { className: label, style: { color: BASE.inkFaint }, children: "\u0421\u043F\u043E\u043A\u043E\u0435\u043D" }) }),
    has && /* @__PURE__ */ jsx("div", { className: "text-center text-xs mt-1", style: { color: quadrantColor }, children: quadrantText() })
  ] });
}
function PickerField({ value, onChange, options, placeholder, accent, allowCustom, flat, mono, onCustomAdd }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);
  const flatOptions = flat ? options : options.flatMap((g) => g.items);
  const filtered = query.trim() ? flatOptions.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase())) : null;
  const exactMatch = filtered && filtered.some((o) => o.toLowerCase() === query.trim().toLowerCase());
  const select = (val) => {
    onChange(val);
    setOpen(false);
    setQuery("");
  };
  const addCustom = (val) => {
    select(val);
    onCustomAdd && onCustomAdd(val);
  };
  const rowStyle = (o) => ({ color: BASE.ink, fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit", background: value === o ? `${accent}12` : "transparent" });
  return /* @__PURE__ */ jsx("div", { className: "relative", children: !open ? /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setOpen(true), className: "w-full flex items-center justify-between border-b py-2.5 text-sm text-left", style: { borderColor: BASE.line }, children: [
    /* @__PURE__ */ jsx("span", { style: { color: value ? BASE.ink : BASE.inkDim, fontFamily: value && mono ? "'JetBrains Mono', monospace" : "inherit" }, children: value || placeholder }),
    /* @__PURE__ */ jsx(ChevronDown, { size: 14, style: { color: BASE.inkFaint } })
  ] }) : /* @__PURE__ */ jsxs("div", { className: "rounded-xl overflow-hidden", style: { border: `1px solid ${accent}45`, background: BASE.surface2, boxShadow: ring(accent) }, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5", style: { borderBottom: `1px solid ${BASE.line}` }, children: [
      /* @__PURE__ */ jsx(Search, { size: 13, style: { color: BASE.inkFaint } }),
      /* @__PURE__ */ jsx("input", { ref: inputRef, value: query, onChange: (e) => setQuery(e.target.value), placeholder: "\u041F\u043E\u0438\u0441\u043A \u0438\u043B\u0438 \u0441\u0432\u043E\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u2026", className: "bg-transparent outline-none text-sm flex-1", style: { color: BASE.ink } }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
        setOpen(false);
        setQuery("");
      }, children: /* @__PURE__ */ jsx(XIcon, { size: 14, style: { color: BASE.inkFaint } }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-h-52 overflow-y-auto", children: filtered ? /* @__PURE__ */ jsxs(Fragment, { children: [
      filtered.map((o) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => select(o), className: "w-full text-left px-3 py-2.5 text-sm transition-colors duration-100", style: rowStyle(o), children: o }, o)),
      allowCustom && query.trim() && !exactMatch && /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => addCustom(query.trim()), className: "w-full text-left px-3 py-2.5 text-sm flex items-center gap-2", style: { color: accent }, children: [
        /* @__PURE__ */ jsx(Plus, { size: 13 }),
        " \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \xAB",
        query.trim(),
        "\xBB"
      ] }),
      filtered.length === 0 && !allowCustom && /* @__PURE__ */ jsx("div", { className: "px-3 py-3 text-xs", style: { color: BASE.inkFaint }, children: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E" })
    ] }) : flat ? options.map((o) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => select(o), className: "w-full text-left px-3 py-2.5 text-sm transition-colors duration-100", style: rowStyle(o), children: o }, o)) : options.map((g) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "px-3 pt-2.5 pb-1 text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children: g.category }),
      g.items.map((o) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => select(o), className: "w-full text-left px-3 py-2 text-sm transition-colors duration-100", style: rowStyle(o), children: o }, o))
    ] }, g.category)) })
  ] }) });
}
function NewEntry({ onSave, accent, customInstruments, customTags, onAddCustomInstrument, onAddCustomTag, notify, t }) {
  const [instrument, setInstrument] = useState("");
  const [direction, setDirection] = useState("Long");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [tag, setTag] = useState("");
  const [point, setPoint] = useState({ x: null, y: null });
  const [pull, setPull] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const fileInputRef = useRef(null);
  const MAX_SHOTS = 4;
  const plannedRRResult = useMemo(() => {
    const en = parseFloat(entryPrice), sl = parseFloat(stopLoss), tp = parseFloat(takeProfit);
    if (entryPrice === "" || stopLoss === "" || takeProfit === "" || isNaN(en) || isNaN(sl) || isNaN(tp)) return { ok: false, error: null };
    return computePlannedRR(direction, en, sl, tp);
  }, [entryPrice, stopLoss, takeProfit, direction]);
  const canSave = instrument.trim() && point.x !== null && plannedRRResult.ok;
  const instrumentOptions = useMemo(
    () => customInstruments.length ? [{ category: "\u0421\u0432\u043E\u0438", items: customInstruments }, ...INSTRUMENTS] : INSTRUMENTS,
    [customInstruments]
  );
  const tagOptions = useMemo(() => [...customTags, ...SETUP_TAGS], [customTags]);
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    const room = MAX_SHOTS - screenshots.length;
    if (room <= 0) {
      notify(`\u041C\u0430\u043A\u0441\u0438\u043C\u0443\u043C ${MAX_SHOTS} \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u0430`);
      return;
    }
    files.slice(0, room).forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        notify(`\xAB${file.name}\xBB \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439 (\u043C\u0430\u043A\u0441. 15 \u041C\u0411)`);
        return;
      }
      compressImageFile(file).then((dataUrl) => setScreenshots((prev) => prev.length < MAX_SHOTS ? [...prev, dataUrl] : prev)).catch(() => notify(`\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \xAB${file.name}\xBB`));
    });
    if (files.length > room) notify(`\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B \u043D\u0435 \u0432\u0441\u0435 \u2014 \u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C ${MAX_SHOTS} \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u0430`);
  };
  const submit = () => {
    if (!instrument.trim() || point.x === null) return;
    const en = parseFloat(entryPrice), sl = parseFloat(stopLoss), tp = parseFloat(takeProfit);
    const rrCheck = computePlannedRR(direction, en, sl, tp);
    if (!rrCheck.ok) {
      notify(rrCheck.error || "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u043F\u043B\u0430\u043D SL/TP");
      return;
    }
    onSave({
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: "open",
      instrument: instrument.trim(),
      direction,
      outcome: null,
      r: null,
      tag: tag.trim() || "\u041E\u0431\u0449\u0435\u0435",
      x: point.x,
      y: point.y,
      pull: pull.trim() || "\u2014",
      lesson: "\u2014",
      date: /* @__PURE__ */ new Date(),
      exitDate: null,
      screenshots,
      exitScreenshots: [],
      entryPrice: en,
      stopLoss: sl,
      takeProfit: tp,
      plannedRR: rrCheck.rr,
      exitPrice: null,
      closeType: null,
      realizedRR: null,
      rr: rrCheck.rr
    });
    setInstrument("");
    setDirection("Long");
    setTag("");
    setPoint({ x: null, y: null });
    setPull("");
    setScreenshots([]);
    setEntryPrice("");
    setStopLoss("");
    setTakeProfit("");
  };
  const L = ({ children }) => /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-1.5", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-4 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsx(BookOpen, { size: 17, style: { color: accent } }),
      " ",
      t.newEntry.title
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start", children: [
    /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.instrument }),
        /* @__PURE__ */ jsx(PickerField, { value: instrument, onChange: setInstrument, options: instrumentOptions, placeholder: t.newEntry.pickOrAdd, accent, allowCustom: true, mono: true, onCustomAdd: onAddCustomInstrument })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.setupType }),
        /* @__PURE__ */ jsx(PickerField, { value: tag, onChange: setTag, options: tagOptions, placeholder: t.newEntry.pickOrAdd, accent, allowCustom: true, flat: true, onCustomAdd: onAddCustomTag })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.entry }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: entryPrice,
            onChange: (e) => setEntryPrice(e.target.value),
            placeholder: "67 230",
            type: "number",
            step: "any",
            inputMode: "decimal",
            className: "w-full bg-transparent border-b outline-none py-2 text-sm",
            style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.direction }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: ["Long", "Short"].map((d) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setDirection(d),
            className: "flex-1 px-2 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
            style: { background: direction === d ? `${accent}12` : "transparent", color: direction === d ? accent : BASE.inkDim, border: `1px solid ${direction === d ? accent + "40" : BASE.line}` },
            children: DIRECTION_LABEL[d]
          },
          d
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: "Stop Loss" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: stopLoss,
            onChange: (e) => setStopLoss(e.target.value),
            placeholder: "66 800",
            type: "number",
            step: "any",
            inputMode: "decimal",
            className: "w-full bg-transparent border-b outline-none py-2 text-sm",
            style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: "Take Profit" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: takeProfit,
            onChange: (e) => setTakeProfit(e.target.value),
            placeholder: "68 500",
            type: "number",
            step: "any",
            inputMode: "decimal",
            className: "w-full bg-transparent border-b outline-none py-2 text-sm",
            style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-5 text-xs", style: { color: plannedRRResult.ok ? accent : plannedRRResult.error ? LOSS : BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: plannedRRResult.ok ? `Planned RR \u2248 1:${plannedRRResult.rr.toFixed(2)}` : plannedRRResult.error || "\u0423\u043A\u0430\u0436\u0438 Entry, SL \u0438 TP \u2014 RR \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.screenshots(MAX_SHOTS) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        screenshots.map((src, i) => /* @__PURE__ */ jsxs("div", { className: "relative w-20 h-20 rounded-xl overflow-hidden shrink-0", style: { border: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx("img", { src, alt: `\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 ${i + 1}`, className: "w-full h-full object-cover block" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setScreenshots((prev) => prev.filter((_, idx) => idx !== i)),
              className: "absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-150 active:scale-90",
              style: { background: "rgba(0,0,0,0.55)" },
              children: /* @__PURE__ */ jsx(XIcon, { size: 11, color: "#fff" })
            }
          )
        ] }, i)),
        screenshots.length < MAX_SHOTS && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => fileInputRef.current?.click(),
            className: "w-20 h-20 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-150",
            style: { border: `1px dashed ${BASE.line}`, color: BASE.inkDim },
            children: /* @__PURE__ */ jsx(ImagePlus, { size: 18 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", multiple: true, onChange: handleFiles, className: "hidden" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.pullQuestion }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: pull,
          onChange: (e) => setPull(e.target.value),
          rows: 2,
          placeholder: t.newEntry.pullPlaceholder,
          className: "w-full bg-transparent border rounded-xl outline-none p-3 text-sm resize-none",
          style: { borderColor: BASE.line, color: BASE.ink }
        }
      )
    ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(L, { children: t.newEntry.emotionQuestion }),
    /* @__PURE__ */ jsx(EmotionGrid, { x: point.x, y: point.y, onChange: setPoint, accent })
    ] })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: submit,
        disabled: !canSave,
        className: "w-full mt-6 py-3 rounded-full text-sm transition-all active:scale-[0.98] lg:max-w-sm lg:mx-auto lg:block",
        style: {
          background: accent,
          color: "#06120F",
          opacity: canSave ? 1 : 0.3,
          cursor: canSave ? "pointer" : "not-allowed",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          boxShadow: canSave ? softLift(accent) : "none"
        },
        children: t.newEntry.save
      }
    )
  ] });
}
function CloseTrade({ entry, onSave, onCancel, accent, measureMode, currency, notify, t }) {
  const hasPlan = entry && typeof entry.entryPrice === "number" && typeof entry.stopLoss === "number" && typeof entry.takeProfit === "number";
  const [closeType, setCloseType] = useState("manual");
  const [manualExit, setManualExit] = useState("");
  const [resultR, setResultR] = useState("");
  const [lesson, setLesson] = useState("");
  const [exitScreenshots, setExitScreenshots] = useState([]);
  const fileInputRef = useRef(null);
  const MAX_SHOTS = 4;
  const L = ({ children }) => /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-1.5", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children });
  const effectiveExit = hasPlan ? closeType === "tp" ? entry.takeProfit : closeType === "sl" ? entry.stopLoss : manualExit === "" ? null : parseFloat(manualExit) : manualExit === "" ? null : parseFloat(manualExit);
  const realizedRR = hasPlan && effectiveExit != null && !isNaN(effectiveExit) ? computeRealizedRR(entry.direction, entry.entryPrice, entry.stopLoss, effectiveExit) : null;
  const resultNum = resultR === "" ? null : parseFloat(resultR);
  const derivedOutcome = resultNum == null || isNaN(resultNum) ? null : resultNum > 0 ? "Win" : resultNum < 0 ? "Loss" : "Breakeven";
  const canSave = resultR !== "" && !isNaN(parseFloat(resultR));
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    const room = MAX_SHOTS - exitScreenshots.length;
    if (room <= 0) {
      notify?.(`\u041C\u0430\u043A\u0441\u0438\u043C\u0443\u043C ${MAX_SHOTS} \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u0430`);
      return;
    }
    files.slice(0, room).forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        notify?.(`\xAB${file.name}\xBB \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439 (\u043C\u0430\u043A\u0441. 15 \u041C\u0411)`);
        return;
      }
      compressImageFile(file).then((dataUrl) => setExitScreenshots((prev) => prev.length < MAX_SHOTS ? [...prev, dataUrl] : prev)).catch(() => notify?.(`\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \xAB${file.name}\xBB`));
    });
  };
  const submit = () => {
    if (!canSave) return;
    onSave({
      status: "closed",
      closeType: hasPlan ? closeType : "manual",
      exitPrice: effectiveExit,
      realizedRR,
      r: resultNum,
      outcome: derivedOutcome,
      lesson: lesson.trim() || "\u2014",
      exitDate: /* @__PURE__ */ new Date(),
      exitScreenshots
    });
  };
  if (!entry) return null;
  const closeTypeOptions = [
    { id: "tp", label: "\u041F\u043E Take Profit" },
    { id: "sl", label: "\u041F\u043E Stop Loss" },
    { id: "manual", label: "\u0412\u0440\u0443\u0447\u043D\u0443\u044E" }
  ];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-1 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsx(BookOpen, { size: 17, style: { color: accent } }),
      " \u0417\u0430\u043A\u0440\u044B\u0442\u0438\u0435 \u0441\u0434\u0435\u043B\u043A\u0438"
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-sm mb-4", style: { color: BASE.inkFaint }, children: [
      entry.instrument, " \xB7 ", DIRECTION_LABEL[entry.direction],
      entry.entryPrice != null ? ` \xB7 \u0432\u0445\u043E\u0434 ${formatPriceValue(entry.entryPrice)}` : "",
      hasPlan ? ` \xB7 \u043F\u043B\u0430\u043D 1:${entry.plannedRR.toFixed(2)}` : ""
    ] }),
    hasPlan && /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-4 text-xs", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
      /* @__PURE__ */ jsxs("span", { children: ["SL ", formatPriceValue(entry.stopLoss)] }),
      /* @__PURE__ */ jsxs("span", { children: ["TP ", formatPriceValue(entry.takeProfit)] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start", children: [
    /* @__PURE__ */ jsxs("div", { children: [
    hasPlan && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx(L, { children: "\u041A\u0430\u043A \u0437\u0430\u043A\u0440\u044B\u043B\u0430\u0441\u044C \u0441\u0434\u0435\u043B\u043A\u0430" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: closeTypeOptions.map((o) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setCloseType(o.id),
          className: "flex-1 px-2 py-1.5 rounded-full text-[12px] transition-all duration-200 active:scale-95",
          style: { background: closeType === o.id ? `${accent}12` : "transparent", color: closeType === o.id ? accent : BASE.inkDim, border: `1px solid ${closeType === o.id ? accent + "40" : BASE.line}` },
          children: o.label
        },
        o.id
      )) })
    ] }),
    (!hasPlan || closeType === "manual") && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.exit }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: manualExit,
          onChange: (e) => setManualExit(e.target.value),
          placeholder: "68 412",
          type: "number",
          step: "any",
          inputMode: "decimal",
          className: "w-full bg-transparent border-b outline-none py-2 text-sm",
          style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }
        }
      )
    ] }),
    hasPlan && /* @__PURE__ */ jsx("div", { className: "mb-4 text-xs", style: { color: realizedRR != null ? accent : BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: realizedRR != null ? `\u0420\u0430\u0441\u0447\u0451\u0442\u043D\u044B\u0439 RR \u043F\u043E \u0446\u0435\u043D\u0430\u043C: ${realizedRR >= 0 ? "+" : ""}${realizedRR.toFixed(2)}R` : "RR \u043F\u043E \u0446\u0435\u043D\u0430\u043C \u2014" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.result(unitSymbol(measureMode, currency)) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: resultR,
          onChange: (e) => setResultR(e.target.value),
          placeholder: measureMode === "R" ? "1.5 / -1" : "150 / -80",
          type: "number",
          step: "0.1",
          className: "w-full bg-transparent border-b outline-none py-2 text-sm",
          style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] mt-1.5", style: { color: BASE.inkFaint }, children: "\u0412\u0432\u0435\u0434\u0438 \u0438\u0442\u043E\u0433\u043E\u0432\u044B\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0432\u0440\u0443\u0447\u043D\u0443\u044E \u2014 \u043E\u043D \u0438\u0434\u0451\u0442 \u0432 PnL \u0438 \u0431\u0430\u043B\u0430\u043D\u0441." })
    ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: "\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B \u0432\u044B\u0445\u043E\u0434\u0430" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        exitScreenshots.map((src, i) => /* @__PURE__ */ jsxs("div", { className: "relative w-20 h-20 rounded-xl overflow-hidden shrink-0", style: { border: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx("img", { src, alt: `\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 ${i + 1}`, className: "w-full h-full object-cover block" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setExitScreenshots((prev) => prev.filter((_, idx) => idx !== i)),
              className: "absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-150 active:scale-90",
              style: { background: "rgba(0,0,0,0.55)" },
              children: /* @__PURE__ */ jsx(XIcon, { size: 11, color: "#fff" })
            }
          )
        ] }, i)),
        exitScreenshots.length < MAX_SHOTS && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => fileInputRef.current?.click(),
            className: "w-20 h-20 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-150",
            style: { border: `1px dashed ${BASE.line}`, color: BASE.inkDim },
            children: /* @__PURE__ */ jsx(ImagePlus, { size: 18 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", multiple: true, onChange: handleFiles, className: "hidden" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.lessonQuestion }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: lesson,
          onChange: (e) => setLesson(e.target.value),
          rows: 2,
          placeholder: t.newEntry.lessonPlaceholder,
          className: "w-full bg-transparent border rounded-xl outline-none p-3 text-sm resize-none",
          style: { borderColor: BASE.line, color: BASE.ink }
        }
      )
    ] })
    ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onCancel,
          className: "px-4 py-3 rounded-full text-sm transition-all active:scale-[0.98]",
          style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim, fontFamily: "'Space Grotesk', sans-serif" },
          children: "\u041E\u0442\u043C\u0435\u043D\u0430"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: submit,
          disabled: !canSave,
          className: "flex-1 py-3 rounded-full text-sm transition-all active:scale-[0.98]",
          style: {
            background: accent,
            color: "#06120F",
            opacity: canSave ? 1 : 0.3,
            cursor: canSave ? "pointer" : "not-allowed",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            boxShadow: canSave ? softLift(accent) : "none"
          },
          children: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0441\u0434\u0435\u043B\u043A\u0443"
        }
      )
    ] })
  ] });
}
function EditTrade({ entry, onSave, onCancel, accent, customInstruments, customTags, onAddCustomInstrument, onAddCustomTag, measureMode, currency, notify, t }) {
  const [instrument, setInstrument] = useState(entry?.instrument || "");
  const [direction, setDirection] = useState(entry?.direction || "Long");
  const [tag, setTag] = useState(entry?.tag === "\u041E\u0431\u0449\u0435\u0435" ? "" : entry?.tag || "");
  const [entryPrice, setEntryPrice] = useState(entry?.entryPrice != null ? String(entry.entryPrice) : "");
  const [stopLoss, setStopLoss] = useState(entry?.stopLoss != null ? String(entry.stopLoss) : "");
  const [takeProfit, setTakeProfit] = useState(entry?.takeProfit != null ? String(entry.takeProfit) : "");
  const [point, setPoint] = useState({ x: entry?.x ?? null, y: entry?.y ?? null });
  const [pull, setPull] = useState(entry?.pull === "\u2014" ? "" : entry?.pull || "");
  const [screenshots, setScreenshots] = useState(entry?.screenshots || []);
  const [closeType, setCloseType] = useState(entry?.closeType || "manual");
  const [manualExit, setManualExit] = useState(entry?.exitPrice != null ? String(entry.exitPrice) : "");
  const [resultR, setResultR] = useState(entry?.r != null ? String(entry.r) : "");
  const [lesson, setLesson] = useState(entry?.lesson === "\u2014" ? "" : entry?.lesson || "");
  const [exitScreenshots, setExitScreenshots] = useState(entry?.exitScreenshots || []);
  const entryFileRef = useRef(null);
  const exitFileRef = useRef(null);
  const MAX_SHOTS = 4;
  const instrumentOptions = useMemo(
    () => customInstruments.length ? [{ category: "\u0421\u0432\u043E\u0438", items: customInstruments }, ...INSTRUMENTS] : INSTRUMENTS,
    [customInstruments]
  );
  const tagOptions = useMemo(() => [...customTags, ...SETUP_TAGS], [customTags]);
  const plannedRRResult = useMemo(() => {
    const en = parseFloat(entryPrice), sl = parseFloat(stopLoss), tp = parseFloat(takeProfit);
    if (entryPrice === "" || stopLoss === "" || takeProfit === "" || isNaN(en) || isNaN(sl) || isNaN(tp)) return { ok: false, error: null };
    return computePlannedRR(direction, en, sl, tp);
  }, [entryPrice, stopLoss, takeProfit, direction]);
  const hasPlanNow = plannedRRResult.ok;
  const effectiveExit = hasPlanNow ? closeType === "tp" ? parseFloat(takeProfit) : closeType === "sl" ? parseFloat(stopLoss) : manualExit === "" ? null : parseFloat(manualExit) : manualExit === "" ? null : parseFloat(manualExit);
  const realizedRR = hasPlanNow && effectiveExit != null && !isNaN(effectiveExit) ? computeRealizedRR(direction, parseFloat(entryPrice), parseFloat(stopLoss), effectiveExit) : null;
  const resultNum = resultR === "" ? null : parseFloat(resultR);
  const derivedOutcome = resultNum == null || isNaN(resultNum) ? null : resultNum > 0 ? "Win" : resultNum < 0 ? "Loss" : "Breakeven";
  const canSave = instrument.trim() && point.x !== null && resultR !== "" && !isNaN(parseFloat(resultR));
  const L = ({ children }) => /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-1.5", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children });
  const makeHandleFiles = (list, setList) => (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    const room = MAX_SHOTS - list.length;
    if (room <= 0) {
      notify?.(`\u041C\u0430\u043A\u0441\u0438\u043C\u0443\u043C ${MAX_SHOTS} \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u0430`);
      return;
    }
    files.slice(0, room).forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        notify?.(`\xAB${file.name}\xBB \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439 (\u043C\u0430\u043A\u0441. 15 \u041C\u0411)`);
        return;
      }
      compressImageFile(file).then((dataUrl) => setList((prev) => prev.length < MAX_SHOTS ? [...prev, dataUrl] : prev)).catch(() => notify?.(`\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \xAB${file.name}\xBB`));
    });
  };
  const ShotRow = ({ list, setList, fileRef, onFiles }) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
    list.map((src, i) => /* @__PURE__ */ jsxs("div", { className: "relative w-20 h-20 rounded-xl overflow-hidden shrink-0", style: { border: `1px solid ${BASE.line}` }, children: [
      /* @__PURE__ */ jsx("img", { src, alt: `\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 ${i + 1}`, className: "w-full h-full object-cover block" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setList((prev) => prev.filter((_, idx) => idx !== i)),
          className: "absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-150 active:scale-90",
          style: { background: "rgba(0,0,0,0.55)" },
          children: /* @__PURE__ */ jsx(XIcon, { size: 11, color: "#fff" })
        }
      )
    ] }, i)),
    list.length < MAX_SHOTS && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => fileRef.current?.click(),
        className: "w-20 h-20 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-150",
        style: { border: `1px dashed ${BASE.line}`, color: BASE.inkDim },
        children: /* @__PURE__ */ jsx(ImagePlus, { size: 18 })
      }
    ),
    /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/*", multiple: true, onChange: onFiles, className: "hidden" })
  ] });
  const submit = () => {
    if (!canSave) return;
    const num = (s) => s === "" || isNaN(parseFloat(s)) ? null : parseFloat(s);
    onSave({
      instrument: instrument.trim(),
      direction,
      tag: tag.trim() || "\u041E\u0431\u0449\u0435\u0435",
      x: point.x,
      y: point.y,
      pull: pull.trim() || "\u2014",
      screenshots,
      entryPrice: num(entryPrice),
      stopLoss: hasPlanNow ? parseFloat(stopLoss) : null,
      takeProfit: hasPlanNow ? parseFloat(takeProfit) : null,
      plannedRR: hasPlanNow ? plannedRRResult.rr : null,
      closeType: hasPlanNow ? closeType : "manual",
      exitPrice: effectiveExit,
      realizedRR,
      r: resultNum,
      outcome: derivedOutcome,
      lesson: lesson.trim() || "\u2014",
      exitScreenshots
    });
  };
  if (!entry) return null;
  const closeTypeOptions = [
    { id: "tp", label: "\u041F\u043E TP" },
    { id: "sl", label: "\u041F\u043E SL" },
    { id: "manual", label: "\u0412\u0440\u0443\u0447\u043D\u0443\u044E" }
  ];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-4 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsx(BookOpen, { size: 17, style: { color: accent } }),
      " \u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0441\u0434\u0435\u043B\u043A\u0438"
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-2", style: { color: BASE.inkFaint }, children: "ENTRY" }),
    /* @__PURE__ */ jsxs("div", { className: "lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start", children: [
    /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.instrument }),
        /* @__PURE__ */ jsx(PickerField, { value: instrument, onChange: setInstrument, options: instrumentOptions, placeholder: t.newEntry.pickOrAdd, accent, allowCustom: true, mono: true, onCustomAdd: onAddCustomInstrument })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.setupType }),
        /* @__PURE__ */ jsx(PickerField, { value: tag, onChange: setTag, options: tagOptions, placeholder: t.newEntry.pickOrAdd, accent, allowCustom: true, flat: true, onCustomAdd: onAddCustomTag })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.entry }),
        /* @__PURE__ */ jsx("input", { value: entryPrice, onChange: (e) => setEntryPrice(e.target.value), type: "number", step: "any", inputMode: "decimal", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" } })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.direction }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: ["Long", "Short"].map((d) => /* @__PURE__ */ jsx(
          "button",
          { onClick: () => setDirection(d), className: "flex-1 px-2 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95", style: { background: direction === d ? `${accent}12` : "transparent", color: direction === d ? accent : BASE.inkDim, border: `1px solid ${direction === d ? accent + "40" : BASE.line}` }, children: DIRECTION_LABEL[d] },
          d
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: "Stop Loss" }),
        /* @__PURE__ */ jsx("input", { value: stopLoss, onChange: (e) => setStopLoss(e.target.value), type: "number", step: "any", inputMode: "decimal", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" } })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: "Take Profit" }),
        /* @__PURE__ */ jsx("input", { value: takeProfit, onChange: (e) => setTakeProfit(e.target.value), type: "number", step: "any", inputMode: "decimal", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" } })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 text-xs", style: { color: hasPlanNow ? accent : plannedRRResult.error ? LOSS : BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: hasPlanNow ? `Planned RR \u2248 1:${plannedRRResult.rr.toFixed(2)}` : plannedRRResult.error || "\u0411\u0435\u0437 SL/TP \u2014 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0431\u0443\u0434\u0435\u0442 \u0432\u0432\u043E\u0434\u0438\u0442\u044C\u0441\u044F \u0432\u0440\u0443\u0447\u043D\u0443\u044E" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.screenshots(MAX_SHOTS) }),
      /* @__PURE__ */ jsx(ShotRow, { list: screenshots, setList: setScreenshots, fileRef: entryFileRef, onFiles: makeHandleFiles(screenshots, setScreenshots) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.pullQuestion }),
      /* @__PURE__ */ jsx("textarea", { value: pull, onChange: (e) => setPull(e.target.value), rows: 2, placeholder: t.newEntry.pullPlaceholder, className: "w-full bg-transparent border rounded-xl outline-none p-3 text-sm resize-none", style: { borderColor: BASE.line, color: BASE.ink } })
    ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(L, { children: t.newEntry.emotionQuestion }),
    /* @__PURE__ */ jsx(EmotionGrid, { x: point.x, y: point.y, onChange: setPoint, accent }),
    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mt-6 mb-2", style: { color: BASE.inkFaint }, children: "EXIT" }),
    hasPlanNow && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx(L, { children: "\u041A\u0430\u043A \u0437\u0430\u043A\u0440\u044B\u043B\u0430\u0441\u044C \u0441\u0434\u0435\u043B\u043A\u0430" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: closeTypeOptions.map((o) => /* @__PURE__ */ jsx(
        "button",
        { onClick: () => setCloseType(o.id), className: "flex-1 px-2 py-1.5 rounded-full text-[12px] transition-all duration-200 active:scale-95", style: { background: closeType === o.id ? `${accent}12` : "transparent", color: closeType === o.id ? accent : BASE.inkDim, border: `1px solid ${closeType === o.id ? accent + "40" : BASE.line}` }, children: o.label },
        o.id
      )) })
    ] }),
    (!hasPlanNow || closeType === "manual") && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.exit }),
      /* @__PURE__ */ jsx("input", { value: manualExit, onChange: (e) => setManualExit(e.target.value), type: "number", step: "any", inputMode: "decimal", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" } })
    ] }),
    hasPlanNow && /* @__PURE__ */ jsx("div", { className: "mb-4 text-xs", style: { color: realizedRR != null ? accent : BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: realizedRR != null ? `\u0420\u0430\u0441\u0447\u0451\u0442\u043D\u044B\u0439 RR \u043F\u043E \u0446\u0435\u043D\u0430\u043C: ${realizedRR >= 0 ? "+" : ""}${realizedRR.toFixed(2)}R` : "RR \u043F\u043E \u0446\u0435\u043D\u0430\u043C \u2014" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.result(unitSymbol(measureMode, currency)) }),
      /* @__PURE__ */ jsx("input", { value: resultR, onChange: (e) => setResultR(e.target.value), type: "number", step: "0.1", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" } }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] mt-1.5", style: { color: BASE.inkFaint }, children: "\u0418\u0442\u043E\u0433\u043E\u0432\u044B\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0432\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0432\u0440\u0443\u0447\u043D\u0443\u044E \u2014 \u043E\u043D \u0438\u0434\u0451\u0442 \u0432 PnL \u0438 \u0431\u0430\u043B\u0430\u043D\u0441." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: "\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B \u0432\u044B\u0445\u043E\u0434\u0430" }),
      /* @__PURE__ */ jsx(ShotRow, { list: exitScreenshots, setList: setExitScreenshots, fileRef: exitFileRef, onFiles: makeHandleFiles(exitScreenshots, setExitScreenshots) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.lessonQuestion }),
      /* @__PURE__ */ jsx("textarea", { value: lesson, onChange: (e) => setLesson(e.target.value), rows: 2, placeholder: t.newEntry.lessonPlaceholder, className: "w-full bg-transparent border rounded-xl outline-none p-3 text-sm resize-none", style: { borderColor: BASE.line, color: BASE.ink } })
    ] })
    ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "px-4 py-3 rounded-full text-sm transition-all active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim, fontFamily: "'Space Grotesk', sans-serif" }, children: "\u041E\u0442\u043C\u0435\u043D\u0430" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: submit,
          disabled: !canSave,
          className: "flex-1 py-3 rounded-full text-sm transition-all active:scale-[0.98]",
          style: { background: accent, color: "#06120F", opacity: canSave ? 1 : 0.3, cursor: canSave ? "pointer" : "not-allowed", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, boxShadow: canSave ? softLift(accent) : "none" },
          children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C"
        }
      )
    ] })
  ] });
}
function LogMiniStat({ label, value, color }) {
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5 truncate", style: { color: BASE.inkFaint }, children: label }),
    /* @__PURE__ */ jsx("div", { className: "text-xs truncate", style: { color: color || BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: value })
  ] });
}
function Log({ entries, onDelete, onCloseTrade, onEditTrade, accent, measureMode, currency, t }) {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const logFilters = [
    { id: "All", label: t.log.filters.All },
    { id: "Open", label: "\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0435" },
    { id: "Win", label: t.log.filters.Win },
    { id: "Loss", label: t.log.filters.Loss },
    { id: "Long", label: t.log.filters.Long },
    { id: "Short", label: t.log.filters.Short }
  ];
  const filtered = entries.filter((e) => {
    const matchesFilter = filter === "All" ? true : filter === "Open" ? !isEntryClosed(e) : filter === "Win" || filter === "Loss" ? e.outcome === filter : e.direction === filter;
    const matchesQuery = e.instrument.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });
  const closedEntries = entries.filter(isEntryClosed);
  const winsCount = closedEntries.filter((e) => e.outcome === "Win").length;
  const lossesCount = closedEntries.filter((e) => e.outcome === "Loss").length;
  const winRate = winsCount + lossesCount > 0 ? Math.round(winsCount / (winsCount + lossesCount) * 100) : 0;
  const withR = closedEntries.filter((e) => e.r !== null && e.r !== void 0);
  const netR = withR.reduce((s, e) => s + e.r, 0);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-4 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsx(NotebookText, { size: 17, style: { color: accent } }),
      " ",
      t.log.title
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: t.log.totalTrades, value: entries.length, accent: BASE.ink }),
      /* @__PURE__ */ jsx(StatCard, { label: t.log.profitable, value: `${winRate}%`, accent: BASE.ink }),
      /* @__PURE__ */ jsx(StatCard, { label: `PnL (${unitSymbol(measureMode, currency)})`, value: formatResult(netR, measureMode, currency), accent: netR >= 0 ? WIN : LOSS })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 px-3 py-2 rounded-full", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: [
      /* @__PURE__ */ jsx(Search, { size: 13, style: { color: BASE.inkFaint } }),
      /* @__PURE__ */ jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: t.log.searchPlaceholder, className: "bg-transparent outline-none text-sm flex-1", style: { color: BASE.ink } })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-4 overflow-x-auto", children: logFilters.map((f) => /* @__PURE__ */ jsx(Pill, { active: filter === f.id, onClick: () => setFilter(f.id), accent, children: f.label }, f.id)) }),
    filtered.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: t.log.empty }) : /* @__PURE__ */ jsx("div", { className: "space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-3 md:items-start xl:grid-cols-3", children: filtered.slice().reverse().map((e) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl overflow-hidden", style: { border: `1px solid ${BASE.line}` }, children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => setOpenId(openId === e.id ? null : e.id), className: "w-full text-left transition-colors duration-150", style: { background: BASE.surface }, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 pt-3 pb-2.5", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { background: outcomeColor(e.outcome) } }),
          /* @__PURE__ */ jsx("span", { className: "text-sm truncate", style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: e.instrument }),
          /* @__PURE__ */ jsx("span", { className: "text-xs shrink-0", style: { color: BASE.inkDim }, children: DIRECTION_LABEL[e.direction] }),
          e.screenshots?.length > 0 && /* @__PURE__ */ jsx(ImagePlus, { size: 11, className: "shrink-0", style: { color: BASE.inkFaint } }),
          !isEntryClosed(e) && /* @__PURE__ */ jsx("span", { className: "text-[10px] ml-auto shrink-0 px-1.5 py-0.5 rounded-full", style: { color: accent, border: `1px solid ${accent}40` }, children: "\u041E\u0442\u043A\u0440\u044B\u0442\u0430" }),
          isEntryClosed(e) && e.r !== null && e.r !== void 0 && /* @__PURE__ */ jsx("span", { className: "text-sm ml-auto shrink-0", style: { color: outcomeColor(e.outcome), fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }, children: formatResult(e.r, measureMode, currency) }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] shrink-0", style: { color: BASE.inkFaint }, children: relTime(e.date) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-2 px-4 pb-3", children: [
          /* @__PURE__ */ jsx(LogMiniStat, { label: t.log.colEntry, value: formatPriceValue(e.entryPrice) }),
          /* @__PURE__ */ jsx(LogMiniStat, { label: t.log.colExit, value: formatPriceValue(e.exitPrice) }),
          /* @__PURE__ */ jsx(LogMiniStat, { label: t.log.colRR, value: e.rr != null ? e.rr.toFixed(1) : "\u2014" }),
          /* @__PURE__ */ jsx(LogMiniStat, { label: t.log.colResult, value: formatResult(e.r, measureMode, currency), color: e.r != null ? outcomeColor(e.outcome) : void 0 })
        ] })
      ] }),
      openId === e.id && /* @__PURE__ */ jsxs("div", { className: "tab-content px-4 py-3 space-y-3 text-sm", style: { background: BASE.bg, color: BASE.inkDim }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1.5", style: { color: BASE.inkFaint }, children: "ENTRY" }),
          (e.stopLoss != null || e.takeProfit != null) && /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-xs mb-2", style: { fontFamily: "'JetBrains Mono', monospace" }, children: [
            e.stopLoss != null && /* @__PURE__ */ jsxs("span", { children: ["SL ", formatPriceValue(e.stopLoss)] }),
            e.takeProfit != null && /* @__PURE__ */ jsxs("span", { children: ["TP ", formatPriceValue(e.takeProfit)] }),
            e.plannedRR != null && /* @__PURE__ */ jsxs("span", { style: { color: accent }, children: ["\u041F\u043B\u0430\u043D 1:", e.plannedRR.toFixed(2)] })
          ] }),
          e.screenshots?.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-1 mb-2", children: e.screenshots.map((src, i) => /* @__PURE__ */ jsx("img", { src, alt: `\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 ${i + 1}`, className: "w-24 h-24 object-cover rounded-lg shrink-0", style: { border: `1px solid ${BASE.line}` } }, i)) }),
          /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-0.5 rounded-full text-[11px] mb-1", style: { border: `1px solid ${BASE.line}`, color: accent }, children: e.tag }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u0417\u0430\u0442\u044F\u043D\u0443\u043B\u043E \u2014 " }),
            e.pull
          ] })
        ] }),
        isEntryClosed(e) && /* @__PURE__ */ jsxs("div", { className: "pt-2", style: { borderTop: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1.5", style: { color: BASE.inkFaint }, children: "EXIT" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-xs mb-2 flex-wrap", style: { fontFamily: "'JetBrains Mono', monospace" }, children: [
            e.closeType && /* @__PURE__ */ jsx("span", { children: { tp: "\u041F\u043E TP", sl: "\u041F\u043E SL", manual: "\u0412\u0440\u0443\u0447\u043D\u0443\u044E" }[e.closeType] || e.closeType }),
            e.exitPrice != null && /* @__PURE__ */ jsxs("span", { children: ["Exit ", formatPriceValue(e.exitPrice)] }),
            e.realizedRR != null && /* @__PURE__ */ jsxs("span", { style: { color: outcomeColor(e.outcome) }, children: [e.realizedRR >= 0 ? "+" : "", e.realizedRR.toFixed(2), "R"] })
          ] }),
          e.exitScreenshots?.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-1 mb-2", children: e.exitScreenshots.map((src, i) => /* @__PURE__ */ jsx("img", { src, alt: `\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 \u0432\u044B\u0445\u043E\u0434\u0430 ${i + 1}`, className: "w-24 h-24 object-cover rounded-lg shrink-0", style: { border: `1px solid ${BASE.line}` } }, i)) }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u0412 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437 \u2014 " }),
            e.lesson
          ] })
        ] }),
        !isEntryClosed(e) && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onCloseTrade(e.id),
            className: "flex items-center gap-1.5 text-xs pt-1",
            style: { color: accent },
            children: [/* @__PURE__ */ jsx(ChevronRight, { size: 12 }), " \u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0441\u0434\u0435\u043B\u043A\u0443"]
          }
        ),
        isEntryClosed(e) && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onEditTrade(e.id),
            className: "flex items-center gap-1.5 text-xs pt-1",
            style: { color: accent },
            children: [/* @__PURE__ */ jsx(PenLine, { size: 12 }), " \u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C"]
          }
        ),
        confirmId === e.id ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pt-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs", style: { color: BASE.inkFaint }, children: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0431\u0435\u0437\u0432\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u043E?" }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            onDelete(e.id);
            setConfirmId(null);
          }, className: "text-xs", style: { color: LOSS }, children: "\u0414\u0430, \u0443\u0434\u0430\u043B\u0438\u0442\u044C" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setConfirmId(null), className: "text-xs", style: { color: BASE.inkFaint }, children: "\u041E\u0442\u043C\u0435\u043D\u0430" })
        ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setConfirmId(e.id), className: "flex items-center gap-1.5 text-xs pt-1", style: { color: LOSS }, children: [
          /* @__PURE__ */ jsx(Trash2, { size: 12 }),
          " \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C"
        ] })
      ] })
    ] }, e.id)) })
  ] });
}
function StatCard({ label, value, accent }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 rounded-xl px-3 py-3", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1", style: { color: BASE.inkFaint }, children: label }),
    /* @__PURE__ */ jsx("div", { className: "text-lg", style: { color: accent, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }, children: value })
  ] });
}
function TagBars({ data, measureMode, currency }) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.avgR)), 0.1);
  return /* @__PURE__ */ jsx("div", { className: "space-y-3", children: data.map((d) => {
    const positive = d.avgR >= 0;
    const width = Math.max(4, Math.abs(d.avgR) / maxAbs * 100);
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink }, children: d.tag }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
          formatResult(d.avgR, measureMode, currency),
          " \xB7 ",
          d.count,
          " \u0441\u0434."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-500 ease-out", style: { width: `${width}%`, background: positive ? WIN : LOSS } }) })
    ] }, d.tag);
  }) });
}
function CalendarView({ entries, accent, measureMode, currency }) {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const entriesByDate = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      const key = e.date.toDateString();
      (map[key] = map[key] || []).push(e);
    });
    return map;
  }, [entries]);
  const cells = useMemo(() => {
    const year = viewMonth.getFullYear(), month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < startOffset; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    return arr;
  }, [viewMonth]);
  const dayColor = (date) => {
    const dayEntries = entriesByDate[date.toDateString()];
    if (!dayEntries?.length) return null;
    const netR = dayEntries.reduce((s, e) => s + (e.r || 0), 0);
    if (netR > 0) return WIN;
    if (netR < 0) return LOSS;
    return BASE.inkDim;
  };
  const selectedEntries = selectedDate ? entriesByDate[selectedDate.toDateString()] || [] : [];
  const selectedNet = selectedEntries.reduce((s, e) => s + (e.r || 0), 0);
  const daySummary = useMemo(() => calculateCalendarStats(selectedEntries, selectedEntries.filter(isEntryClosed)), [selectedEntries]);
  const monthLabel = viewMonth.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
  const weekdayLabels = ["\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431", "\u0412\u0441"];
  const changeMonth = (delta) => {
    setSelectedDate(null);
    setViewMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + delta);
      return d;
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "tab-content max-w-md mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => changeMonth(-1), className: "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-150 active:scale-90", style: { border: `1px solid ${BASE.line}` }, children: /* @__PURE__ */ jsx(ChevronLeft, { size: 14, style: { color: BASE.inkDim } }) }),
      /* @__PURE__ */ jsx("span", { className: "text-sm capitalize", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: monthLabel }),
      /* @__PURE__ */ jsx("button", { onClick: () => changeMonth(1), className: "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-150 active:scale-90", style: { border: `1px solid ${BASE.line}` }, children: /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: BASE.inkDim } }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1.5 mb-1", children: weekdayLabels.map((w) => /* @__PURE__ */ jsx("div", { className: "text-center text-[10px]", style: { color: BASE.inkFaint }, children: w }, w)) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1.5 mb-4", children: cells.map((date, i) => {
      if (!date) return /* @__PURE__ */ jsx("div", {}, i);
      const color = dayColor(date);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isTodayCell = date.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setSelectedDate(date),
          className: "aspect-square rounded-lg flex items-center justify-center text-xs transition-all duration-150 active:scale-90",
          style: {
            background: color ? `${color}18` : BASE.surface,
            border: `1px solid ${isSelected ? accent : color ? color + "50" : BASE.line}`,
            color: color || BASE.inkDim,
            boxShadow: isTodayCell ? `0 0 0 1px ${accent}60 inset` : "none"
          },
          children: date.getDate()
        },
        i
      );
    }) }),
    selectedDate ? /* @__PURE__ */ jsxs(Card, { accent, glowing: selectedEntries.length > 0, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: selectedDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long" }) }),
        selectedEntries.length > 0 && /* @__PURE__ */ jsx("span", { className: "text-xs", style: { color: selectedNet >= 0 ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(selectedNet, measureMode, currency) })
      ] }),
      selectedEntries.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: "\u0421\u0434\u0435\u043B\u043E\u043A \u0432 \u044D\u0442\u043E\u0442 \u0434\u0435\u043D\u044C \u043D\u0435 \u0431\u044B\u043B\u043E." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: "\u0421\u0434\u0435\u043B\u043E\u043A" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: selectedEntries.length })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: "W / L / BE" }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: [
              daySummary.wins,
              "/",
              daySummary.losses,
              "/",
              daySummary.breakevens
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsxs("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: [
              "\u0421\u0440. ",
              unitSymbol(measureMode, currency)
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: daySummary.avgR >= 0 ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(daySummary.avgR, measureMode, currency) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 mb-3 text-xs", children: [
          daySummary.topInstrument && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442" }),
            /* @__PURE__ */ jsxs("span", { style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: [
              daySummary.topInstrument.value,
              daySummary.topInstrument.count > 1 ? ` \xD7${daySummary.topInstrument.count}` : ""
            ] })
          ] }),
          daySummary.topTag && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0441\u0435\u0442\u0430\u043F" }),
            /* @__PURE__ */ jsxs("span", { style: { color: BASE.ink }, children: [
              daySummary.topTag.value,
              daySummary.topTag.count > 1 ? ` \xD7${daySummary.topTag.count}` : ""
            ] })
          ] }),
          daySummary.mood && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u042D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0444\u043E\u043D" }),
            /* @__PURE__ */ jsx("span", { style: { color: daySummary.moodColor }, children: daySummary.mood })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-3 space-y-2", style: { borderTop: `1px solid ${BASE.line}` }, children: selectedEntries.map((e) => /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { background: outcomeColor(e.outcome) } }),
            /* @__PURE__ */ jsx("span", { style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: e.instrument }),
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkDim }, children: DIRECTION_LABEL[e.direction] }),
            !isEntryClosed(e) && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0 text-[10px]", style: { color: BASE.inkFaint }, children: "\u041E\u0442\u043A\u0440\u044B\u0442\u0430" }),
            isEntryClosed(e) && e.r !== null && e.r !== void 0 && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0", style: { color: outcomeColor(e.outcome), fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(e.r, measureMode, currency) })
          ] }),
          e.lesson && e.lesson !== "\u2014" && /* @__PURE__ */ jsx("p", { className: "text-xs pl-3.5 mt-0.5", style: { color: BASE.inkFaint }, children: e.lesson })
        ] }, e.id)) })
      ] })
    ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-center", style: { color: BASE.inkFaint }, children: "\u041D\u0430\u0436\u043C\u0438 \u043D\u0430 \u0447\u0438\u0441\u043B\u043E, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0441\u0432\u043E\u0434\u043A\u0443 \u0437\u0430 \u0434\u0435\u043D\u044C." })
  ] });
}
function Patterns({ entries, accent, measureMode, currency, analytics, t, lang }) {
  const [view, setView] = useState("emotions");
  const [reviewOpen, setReviewOpen] = useState(false);
  const closedEntries = useMemo(() => entries.filter(isEntryClosed), [entries]);
  const grouped = useMemo(() => {
    const g = { Win: [], Loss: [], Breakeven: [] };
    closedEntries.forEach((e) => g[e.outcome]?.push(e));
    return g;
  }, [closedEntries]);
  const winRate = grouped.Win.length + grouped.Loss.length > 0 ? Math.round(grouped.Win.length / (grouped.Win.length + grouped.Loss.length) * 100) : 0;
  const withR = closedEntries.filter((e) => e.r !== null && e.r !== void 0);
  const avgR = withR.length ? withR.reduce((s, e) => s + e.r, 0) / withR.length : null;
  const traderPatterns = useMemo(() => analyzeTraderPatterns(closedEntries, lang), [closedEntries, lang]);
  const insight = useMemo(() => {
    if (grouped.Win.length < 2 || grouped.Loss.length < 2) return t.pattern.needMoreEntries;
    if (analytics.insights.length) return analytics.insights[0].text;
    if (traderPatterns.available) return t.pattern.noPatternYetLong;
    return t.pattern.accumulating(traderPatterns.needed - traderPatterns.sampleSize);
  }, [grouped, traderPatterns, analytics, t]);
  const equityCurve = useMemo(() => {
    const sorted = [...withR].sort((a, b) => a.date - b.date);
    let cum = 0;
    return sorted.map((e) => {
      cum += e.r;
      return { ...e, cum, dateLabel: e.date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }) };
    });
  }, [withR]);
  const tagStats = useMemo(() => {
    const stats = {};
    withR.forEach((e) => {
      stats[e.tag] = stats[e.tag] || { count: 0, sumR: 0 };
      stats[e.tag].count += 1;
      stats[e.tag].sumR += e.r;
    });
    return Object.entries(stats).map(([tag, s]) => ({ tag, avgR: s.sumR / s.count, count: s.count })).sort((a, b) => b.avgR - a.avgR);
  }, [withR]);
  const planVsFact = useMemo(() => {
    const withPlan = closedEntries.filter((e) => typeof e.plannedRR === "number" && typeof e.realizedRR === "number");
    if (withPlan.length < 3) return null;
    const avgPlanned = st_mean(withPlan.map((e) => e.plannedRR));
    const avgRealized = st_mean(withPlan.map((e) => e.realizedRR));
    const captures = withPlan.filter((e) => e.plannedRR > 0).map((e) => Math.max(0, Math.min(1, e.realizedRR / e.plannedRR)));
    const captureRatio = captures.length ? st_mean(captures) * 100 : null;
    const closeCounts = { tp: 0, sl: 0, manual: 0 };
    closedEntries.forEach((e) => {
      if (e.closeType && closeCounts[e.closeType] != null) closeCounts[e.closeType]++;
    });
    const closeTotal = closeCounts.tp + closeCounts.sl + closeCounts.manual;
    return { count: withPlan.length, avgPlanned, avgRealized, captureRatio, closeCounts, closeTotal };
  }, [closedEntries]);
  const EquityTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const e = payload[0].payload;
    return /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 rounded-lg text-xs", style: { background: BASE.surface2, border: `1px solid ${BASE.line}`, color: BASE.ink }, children: [
      /* @__PURE__ */ jsxs("div", { style: { color: BASE.inkFaint }, children: [
        e.dateLabel,
        " \xB7 ",
        e.instrument
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { fontFamily: "'JetBrains Mono', monospace" }, children: [
        "\u0418\u0442\u043E\u0433\u043E: ",
        formatResult(e.cum, measureMode, currency)
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { color: outcomeColor(e.outcome) }, children: [
        formatResult(e.r, measureMode, currency),
        " \u0437\u0430 \u044D\u0442\u0443 \u0441\u0434\u0435\u043B\u043A\u0443"
      ] })
    ] });
  };
  const ChartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const e = payload[0].payload;
    return /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 rounded-lg text-xs", style: { background: BASE.surface2, border: `1px solid ${BASE.line}`, color: BASE.ink }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontFamily: "'JetBrains Mono', monospace" }, children: e.instrument }),
      /* @__PURE__ */ jsxs("div", { style: { color: outcomeColor(e.outcome) }, children: [
        OUTCOME_LABEL[e.outcome],
        e.r !== null && e.r !== void 0 ? ` \xB7 ${formatResult(e.r, measureMode, currency)}` : ""
      ] })
    ] });
  };
  if (reviewOpen) {
    return /* @__PURE__ */ jsx(JournalReview, { entries: closedEntries, accent, onClose: () => setReviewOpen(false), t, lang });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-4 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsx(LineChartIcon, { size: 17, style: { color: accent } }),
      " \u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "\u0421\u0434\u0435\u043B\u043A\u0438", value: entries.length, accent: BASE.ink }),
      /* @__PURE__ */ jsx(StatCard, { label: "\u0412\u0438\u043D\u0440\u0435\u0439\u0442", value: `${winRate}%`, accent }),
      /* @__PURE__ */ jsx(StatCard, { label: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 RR", value: analytics.rrStats?.avgRealizedRR != null ? `${analytics.rrStats.avgRealizedRR >= 0 ? "+" : ""}${analytics.rrStats.avgRealizedRR}R` : "\u2014", accent: BASE.ink })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-5", children: [
      /* @__PURE__ */ jsx(Pill, { active: view === "emotions", onClick: () => setView("emotions"), accent, children: "\u042D\u043C\u043E\u0446\u0438\u0438" }),
      /* @__PURE__ */ jsx(Pill, { active: view === "performance", onClick: () => setView("performance"), accent, children: "\u0414\u0438\u043D\u0430\u043C\u0438\u043A\u0430" }),
      /* @__PURE__ */ jsx(Pill, { active: view === "calendar", onClick: () => setView("calendar"), accent, children: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C" })
    ] }),
    view === "calendar" && /* @__PURE__ */ jsx(CalendarView, { entries, accent, measureMode, currency }),
    view === "emotions" && /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[11px]", style: { color: BASE.inkDim, fontFamily: "'Space Grotesk', sans-serif" }, children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 12, style: { color: accent } }),
            " \u0427\u0442\u043E \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u0436\u0443\u0440\u043D\u0430\u043B"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setReviewOpen(true),
              className: "shrink-0 px-2.5 py-1 rounded-full text-[10.5px] transition-all duration-150 active:scale-95",
              style: { color: accent, border: `1px solid ${accent}40`, background: `${accent}0F`, fontFamily: "'Space Grotesk', sans-serif" },
              children: "\u0420\u0430\u0437\u0431\u043E\u0440"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: insight })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap text-[10px] mb-6", style: { color: BASE.inkFaint }, children: [
        analytics.awareness.score.value != null && /* @__PURE__ */ jsxs("span", { children: [
          t.home.awareness,
          " ",
          analytics.awareness.score.value,
          "%",
          TREND_ARROW[analytics.awareness.trend] || ""
        ] }),
        analytics.discipline.score.value != null && /* @__PURE__ */ jsxs("span", { children: [
          "\xB7 ",
          t.home.discipline,
          " ",
          analytics.discipline.score.value,
          "%",
          TREND_ARROW[analytics.discipline.trend] || ""
        ] }),
        analytics.risk.stability.value != null && /* @__PURE__ */ jsxs("span", { children: [
          "\xB7 ",
          t.home.riskStability,
          " ",
          analytics.risk.stability.value,
          "%",
          TREND_ARROW[analytics.risk.stability.trend] || ""
        ] }),
        analytics.reflection.score.value != null && /* @__PURE__ */ jsxs("span", { children: [
          "\xB7 ",
          t.home.reflection,
          " ",
          analytics.reflection.score.value,
          "%",
          TREND_ARROW[analytics.reflection.trend] || ""
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { width: "100%", height: 300 }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(ScatterChart, { margin: { top: 10, right: 20, bottom: 20, left: 0 }, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { stroke: BASE.line }),
        /* @__PURE__ */ jsx(
          XAxis,
          {
            type: "number",
            dataKey: "x",
            domain: [0, 100],
            tick: { fill: BASE.inkFaint, fontSize: 11 },
            stroke: BASE.line,
            label: { value: "\u0421\u0442\u0440\u0430\u0445  \u2192  \u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C", position: "insideBottom", offset: -10, fill: BASE.inkFaint, fontSize: 11 }
          }
        ),
        /* @__PURE__ */ jsx(
          YAxis,
          {
            type: "number",
            dataKey: "y",
            domain: [0, 100],
            reversed: true,
            tick: { fill: BASE.inkFaint, fontSize: 11 },
            stroke: BASE.line,
            label: { value: "\u041D\u0430 \u043D\u0435\u0440\u0432\u0430\u0445  \u2192  \u0421\u043F\u043E\u043A\u043E\u0435\u043D", angle: -90, position: "insideLeft", fill: BASE.inkFaint, fontSize: 11 }
          }
        ),
        /* @__PURE__ */ jsx(ZAxis, { range: [90, 90] }),
        /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(ChartTooltip, {}), cursor: { stroke: BASE.line } }),
        /* @__PURE__ */ jsx(Scatter, { data: entries, isAnimationActive: true, animationDuration: 600, children: entries.map((e) => /* @__PURE__ */ jsx(Cell, { fill: outcomeColor(e.outcome) }, e.id)) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-5 mt-2 justify-center", children: ["Win", "Loss", "Breakeven"].map((o) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full", style: { background: outcomeColor(o) } }),
        /* @__PURE__ */ jsx("span", { className: "text-xs", style: { color: BASE.inkFaint }, children: OUTCOME_LABEL[o] })
      ] }, o)) })
    ] }),
    view === "performance" && /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: "\u041A\u0440\u0438\u0432\u0430\u044F \u0434\u043E\u0445\u043E\u0434\u043D\u043E\u0441\u0442\u0438" }),
        equityCurve.length > 0 && /* @__PURE__ */ jsx("span", { className: "text-xs", style: { color: equityCurve[equityCurve.length - 1].cum >= 0 ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(equityCurve[equityCurve.length - 1].cum, measureMode, currency) })
      ] }),
      equityCurve.length < 2 ? /* @__PURE__ */ jsx("p", { className: "text-sm mb-6", style: { color: BASE.inkFaint }, children: "\u0414\u043E\u0431\u0430\u0432\u044C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0445\u043E\u0442\u044F \u0431\u044B \u043A \u043F\u0430\u0440\u0435 \u0441\u0434\u0435\u043B\u043E\u043A, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u043A\u0440\u0438\u0432\u0443\u044E \u0434\u043E\u0445\u043E\u0434\u043D\u043E\u0441\u0442\u0438 \u0432\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438." }) : /* @__PURE__ */ jsx("div", { style: { width: "100%", height: 220 }, className: "mb-6", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(AreaChart, { data: equityCurve, margin: { top: 10, right: 10, bottom: 0, left: -10 }, children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "eqGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: accent, stopOpacity: 0.3 }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: accent, stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsx(CartesianGrid, { stroke: BASE.line, vertical: false }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "dateLabel", tick: { fill: BASE.inkFaint, fontSize: 10 }, stroke: BASE.line }),
        /* @__PURE__ */ jsx(YAxis, { tick: { fill: BASE.inkFaint, fontSize: 10 }, stroke: BASE.line, width: 32 }),
        /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(EquityTooltip, {}), cursor: { stroke: BASE.line } }),
        /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "cum", stroke: accent, strokeWidth: 2, fill: "url(#eqGrad)", dot: { r: 3, fill: accent, strokeWidth: 0 }, isAnimationActive: true, animationDuration: 700 })
      ] }) }) }),
      /* @__PURE__ */ jsx("span", { className: "text-sm block mb-3", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043F\u043E \u0442\u0438\u043F\u0443 \u0441\u0435\u0442\u0430\u043F\u0430" }),
      /* @__PURE__ */ jsxs("div", { className: "lg:grid lg:grid-cols-2 lg:gap-4 lg:items-start", children: [
      tagStats.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm lg:col-span-2", style: { color: BASE.inkFaint }, children: "\u0414\u043E\u0431\u0430\u0432\u044C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043A \u0441\u0434\u0435\u043B\u043A\u0430\u043C, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C, \u043A\u0430\u043A\u0438\u0435 \u0441\u0435\u0442\u0430\u043F\u044B \u0440\u0435\u0430\u043B\u044C\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442." }) : /* @__PURE__ */ jsx(Card, { className: "mb-6", children: /* @__PURE__ */ jsx(TagBars, { data: tagStats, measureMode, currency }) }),
      analytics.rrStats && analytics.rrStats.sampleSize > 0 && /* @__PURE__ */ jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm block mb-3", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: "Average RR \u0438 Win Rate" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(StatCard, { label: "Average RR", value: analytics.rrStats.avgRealizedRR != null ? `${analytics.rrStats.avgRealizedRR >= 0 ? "+" : ""}${analytics.rrStats.avgRealizedRR}R` : "\u2014", accent: analytics.rrStats.avgRealizedRR != null ? analytics.rrStats.avgRealizedRR >= 0 ? WIN : LOSS : BASE.ink }),
          /* @__PURE__ */ jsx(StatCard, { label: "Win Rate", value: analytics.rrStats.winRate != null ? `${analytics.rrStats.winRate}%` : "\u2014", accent: BASE.ink })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
          /* @__PURE__ */ jsxs("span", { children: ["Wins ", analytics.rrStats.wins] }),
          /* @__PURE__ */ jsxs("span", { children: ["Losses ", analytics.rrStats.losses] }),
          /* @__PURE__ */ jsxs("span", { children: ["Breakeven ", analytics.rrStats.breakevens] })
        ] })
      ] }),
      planVsFact && /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm block mb-3", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: "\u041F\u043B\u0430\u043D vs \u0424\u0430\u043A\u0442" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-3", children: [
          /* @__PURE__ */ jsx(StatCard, { label: "\u0421\u0440. Planned RR", value: `${planVsFact.avgPlanned.toFixed(1)}R`, accent: BASE.ink }),
          /* @__PURE__ */ jsx(StatCard, { label: "\u0421\u0440. Realized RR", value: `${planVsFact.avgRealized.toFixed(1)}R`, accent: planVsFact.avgRealized >= 0 ? WIN : LOSS }),
          planVsFact.captureRatio != null && /* @__PURE__ */ jsx(StatCard, { label: "TP Capture", value: `${Math.round(planVsFact.captureRatio)}%`, accent: BASE.ink })
        ] }),
        planVsFact.closeTotal > 0 && /* @__PURE__ */ jsxs("div", { className: "flex gap-3 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
          /* @__PURE__ */ jsxs("span", { children: ["TP ", Math.round(planVsFact.closeCounts.tp / planVsFact.closeTotal * 100), "%"] }),
          /* @__PURE__ */ jsxs("span", { children: ["SL ", Math.round(planVsFact.closeCounts.sl / planVsFact.closeTotal * 100), "%"] }),
          /* @__PURE__ */ jsxs("span", { children: ["Manual ", Math.round(planVsFact.closeCounts.manual / planVsFact.closeTotal * 100), "%"] })
        ] })
      ] })
      ] })
    ] })
  ] });
}
function ChallengeCard({ icon: Icon, title, desc, progress, goal, accent }) {
  const pct = Math.min(100, Math.round(progress / goal * 100));
  const completed = progress >= goal;
  return /* @__PURE__ */ jsxs(Card, { accent, glowing: completed, className: "mb-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-7 h-7 rounded-full flex items-center justify-center shrink-0", style: { background: completed ? `${accent}14` : BASE.surface2, border: `1px solid ${completed ? accent + "40" : BASE.line}` }, children: /* @__PURE__ */ jsx(Icon, { size: 13, style: { color: completed ? accent : BASE.inkDim } }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: title })
      ] }),
      completed && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full", style: { color: accent, border: `1px solid ${accent}40` }, children: [
        /* @__PURE__ */ jsx(Check, { size: 10 }),
        " \u0413\u043E\u0442\u043E\u0432\u043E"
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs mb-2.5", style: { color: BASE.inkFaint }, children: desc }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 h-1 rounded-full", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${pct}%`, background: completed ? accent : BASE.inkDim } }) }),
      /* @__PURE__ */ jsxs("span", { className: "text-[11px] shrink-0", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
        Math.min(progress, goal),
        "/",
        goal
      ] })
    ] })
  ] });
}
function Challenge({ entries, accent, weeklyGoal, t, lang }) {
  const { streak, week } = useStreak(entries, lang);
  const daysThisWeek = week.filter((d) => d.filled).length;
  const pct = Math.min(100, Math.round(daysThisWeek / weeklyGoal * 100));
  const animatedStreak = Math.round(useAnimatedNumber(streak));
  const CHALLENGE_ICONS = { revenge: ShieldCheck, reflect: PenLine, winstreak: TrendingUp };
  const challenges = useMemo(() => calculateChallengeProgress(entries, lang), [entries, lang]);
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-5 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsx(Flame, { size: 17, style: { color: "#D98A4A" } }),
      " ",
      t.challenge.title
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:columns-2 lg:gap-4", children: [
    /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "mb-4 text-center py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-1", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 500 }, children: animatedStreak }),
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide", style: { color: BASE.inkFaint }, children: t.challenge.daysInARow })
    ] }),
    /* @__PURE__ */ jsx(ChallengeCard, { icon: CalendarCheck, title: t.challenge.weeklyConsistency, desc: t.challenge.weeklyConsistencyDesc(weeklyGoal), progress: daysThisWeek, goal: weeklyGoal, accent }),
    challenges.map((c) => /* @__PURE__ */ jsx(ChallengeCard, { icon: CHALLENGE_ICONS[c.id], title: c.title, desc: c.desc, progress: c.progress, goal: c.goal, accent }, c.id)),
    /* @__PURE__ */ jsxs(Card, { className: "mt-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: t.challenge.thisWeek }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs", style: { color: BASE.inkFaint }, children: [
          daysThisWeek,
          "/",
          weeklyGoal
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-4", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${pct}%`, background: accent } }) }),
      /* @__PURE__ */ jsx(WeekDots, { week, accent })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed break-inside-avoid", style: { color: BASE.inkFaint }, children: t.challenge.footer })
    ] })
  ] });
}
function CalibrationRing({ pct, color, size = 172 }) {
  const animated = useAnimatedNumber(pct, 1100);
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - animated / 100);
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, children: [
    /* @__PURE__ */ jsx("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: BASE.line, strokeWidth: "9" }),
    /* @__PURE__ */ jsx(
      "circle",
      {
        cx: size / 2,
        cy: size / 2,
        r,
        fill: "none",
        stroke: color,
        strokeWidth: "9",
        strokeLinecap: "round",
        strokeDasharray: circumference,
        strokeDashoffset: offset,
        style: { transform: "rotate(-90deg)", transformOrigin: "50% 50%" }
      }
    ),
    /* @__PURE__ */ jsxs("text", { x: "50%", y: "50%", textAnchor: "middle", dy: "0.35em", fill: BASE.ink, fontSize: "30", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "600", children: [
      Math.round(animated),
      "%"
    ] })
  ] });
}
function Calibration({ accent, onComplete, lang, t }) {
  const [stage, setStage] = useState("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const questions = lang === "en" ? CALIBRATION_QUESTIONS_EN : CALIBRATION_QUESTIONS;
  const q = questions[qIndex];
  const selectAnswer = (option) => {
    const next = { ...answers, [q.id]: option };
    setAnswers(next);
    setTimeout(() => {
      if (qIndex + 1 < questions.length) {
        setQIndex(qIndex + 1);
      } else {
        const r = scoreCalibration(next, lang);
        setResult(r);
        onComplete({ pct: r.pct, tierColor: r.tier.color, date: (/* @__PURE__ */ new Date()).toISOString(), riskFactors: r.riskFactors });
        setStage("result");
      }
    }, 200);
  };
  const restart = () => {
    setStage("intro");
    setQIndex(0);
    setAnswers({});
    setResult(null);
  };
  if (stage === "intro") {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-4 stagger", children: [
      /* @__PURE__ */ jsx(Gauge, { size: 38, style: { color: accent }, className: "mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2 tracking-wide", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: t.calibration.heading }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-6", style: { color: BASE.inkDim }, children: t.calibration.subtitle }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-8 px-2", style: { color: BASE.inkFaint }, children: t.calibration.intro }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setStage("quiz"),
          className: "px-10 py-3 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, boxShadow: softLift(accent) },
          children: t.calibration.start
        }
      )
    ] });
  }
  if (stage === "quiz") {
    return /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2 text-xs", style: { color: BASE.inkFaint }, children: [
        /* @__PURE__ */ jsx("span", { children: t.calibration.questionOf(qIndex + 1, questions.length) }),
        /* @__PURE__ */ jsx("button", { onClick: restart, style: { color: BASE.inkFaint }, children: t.calibration.cancel })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-6", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-500 ease-out", style: { width: `${qIndex / questions.length * 100}%`, background: accent } }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg mb-5 leading-snug", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 500 }, children: q.text }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: q.options.map((opt) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => selectAnswer(opt),
          className: "text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-200 active:scale-[0.98]",
          style: { border: `1px solid ${answers[q.id] === opt ? accent : BASE.line}`, background: answers[q.id] === opt ? `${accent}12` : BASE.surface, color: BASE.ink },
          children: opt.label
        },
        opt.label
      )) })
    ] }, qIndex);
  }
  return /* @__PURE__ */ jsxs("div", { className: "text-center stagger", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx(CalibrationRing, { pct: result.pct, color: result.tier.color }) }),
    /* @__PURE__ */ jsx("p", { className: "text-base mb-6 px-2 leading-relaxed", style: { color: result.tier.color, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: result.tier.label }),
    result.riskFactors.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "mb-4 text-left", style: { border: `1px solid ${LOSS}50`, background: `${LOSS}0D` }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 14, style: { color: LOSS } }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-wide", style: { color: LOSS }, children: t.calibration.mainRiskFactor })
      ] }),
      result.riskFactors.map((f, i) => /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.ink }, children: f }, i))
    ] }),
    result.factors.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "text-left mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.calibration.whatInfluenced }),
      result.factors.map((f, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-sm py-1", children: [
        /* @__PURE__ */ jsx("span", { style: { color: f.type === "positive" ? WIN : WARN }, children: f.type === "positive" ? "\u2713" : "\u26A0" }),
        /* @__PURE__ */ jsx("span", { style: { color: BASE.ink }, children: f.text })
      ] }, i))
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: restart, className: "text-sm transition-opacity duration-150", style: { color: BASE.inkFaint }, children: t.calibration.restart })
  ] });
}
function JournalReview({ entries, accent, onClose, t, lang }) {
  const issues = useMemo(() => buildReviewQuiz(entries, lang), [entries, lang]);
  const likert = lang === "en" ? REVIEW_LIKERT_EN : REVIEW_LIKERT;
  const [stage, setStage] = useState("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const q = issues[qIndex];
  const selectAnswer = (opt) => {
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    setTimeout(() => {
      if (qIndex + 1 < issues.length) {
        setQIndex(qIndex + 1);
      } else {
        setResult(scoreJournalReview(issues, next, lang));
        setStage("result");
      }
    }, 200);
  };
  const restart = () => {
    setStage("intro");
    setQIndex(0);
    setAnswers({});
    setResult(null);
  };
  if (issues.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-4 stagger", children: [
      /* @__PURE__ */ jsx(Sparkles, { size: 38, style: { color: accent }, className: "mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2 tracking-wide", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: t.review.heading }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-8 px-4 leading-relaxed", style: { color: BASE.inkFaint }, children: t.review.notEnough }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "px-10 py-3 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, boxShadow: softLift(accent) },
          children: t.review.back
        }
      )
    ] });
  }
  if (stage === "intro") {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-4 stagger", children: [
      /* @__PURE__ */ jsx(Sparkles, { size: 38, style: { color: accent }, className: "mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2 tracking-wide", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: t.review.heading }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-6", style: { color: BASE.inkDim }, children: t.review.questionsCount(issues.length) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-8 px-2", style: { color: BASE.inkFaint }, children: t.review.intro }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setStage("quiz"),
          className: "px-10 py-3 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, boxShadow: softLift(accent) },
          children: t.calibration.start
        }
      ),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "block mx-auto mt-4 text-sm", style: { color: BASE.inkFaint }, children: t.review.back })
    ] });
  }
  if (stage === "quiz") {
    return /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2 text-xs", style: { color: BASE.inkFaint }, children: [
        /* @__PURE__ */ jsx("span", { children: t.calibration.questionOf(qIndex + 1, issues.length) }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, style: { color: BASE.inkFaint }, children: t.calibration.cancel })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-6", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-500 ease-out", style: { width: `${qIndex / issues.length * 100}%`, background: accent } }) }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-wide mb-2", style: { color: BASE.inkFaint }, children: q.title }),
      /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed mb-4", style: { color: BASE.inkDim }, children: q.evidence }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg mb-5 leading-snug", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 500 }, children: q.question }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: likert.map((opt) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => selectAnswer(opt),
          className: "text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-200 active:scale-[0.98]",
          style: { border: `1px solid ${answers[q.id] === opt ? accent : BASE.line}`, background: answers[q.id] === opt ? `${accent}12` : BASE.surface, color: BASE.ink },
          children: opt.label
        },
        opt.label
      )) })
    ] }, qIndex);
  }
  const totalAnswered = result ? result.confirmed.length + result.clear.length : 0;
  const dataDrivenAnswered = result ? result.confirmed.filter((q2) => q2.dataDriven).length + result.clear.filter((q2) => q2.dataDriven).length : 0;
  return /* @__PURE__ */ jsxs("div", { className: "text-center stagger", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx(CalibrationRing, { pct: result.pct, color: result.tier.color }) }),
    /* @__PURE__ */ jsx("p", { className: "text-base mb-1 px-2 leading-relaxed", style: { color: result.tier.color, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: result.tier.label }),
    /* @__PURE__ */ jsx("p", { className: "text-[11px] mb-5", style: { color: BASE.inkFaint }, children: t.review.questionsAnswered(totalAnswered, dataDrivenAnswered) }),
    /* @__PURE__ */ jsx(Card, { className: "text-left mb-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: result.narrative }) }),
    result.priority && /* @__PURE__ */ jsxs(Card, { className: "mb-4 text-left", style: { border: `1px solid ${LOSS}50`, background: `${LOSS}0D` }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 14, style: { color: LOSS } }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-wide", style: { color: LOSS }, children: t.review.startHere })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-1", style: { color: BASE.ink, fontWeight: 600 }, children: result.priority.title }),
      /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed mb-2", style: { color: BASE.inkDim }, children: result.priority.evidence }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: result.priority.recommendation })
    ] }),
    result.rest.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "mb-4 text-left", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.review.alsoWorthNoting }),
      result.rest.map((f) => /* @__PURE__ */ jsxs("div", { className: "mb-3 last:mb-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm mb-1", style: { color: BASE.ink, fontWeight: 500 }, children: f.title }),
        /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed", style: { color: BASE.inkDim }, children: f.recommendation })
      ] }, f.id))
    ] }),
    result.clear.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "text-left mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.review.looksFine }),
      result.clear.map((f) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-sm py-1", children: [
        /* @__PURE__ */ jsx(Check, { size: 13, style: { color: WIN, marginTop: 2, flexShrink: 0 } }),
        /* @__PURE__ */ jsx("span", { style: { color: BASE.ink }, children: f.title })
      ] }, f.id))
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-[11px] mb-5", style: { color: BASE.inkFaint }, children: t.review.disclaimer }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: restart, className: "text-sm", style: { color: BASE.inkFaint }, children: t.calibration.restart }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "px-8 py-2.5 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 },
          children: t.review.done
        }
      )
    ] })
  ] });
}
function formatSimMoney(v) {
  const sign = v < 0 ? "-" : "";
  return `${sign}$${groupThousands(Math.round(Math.abs(v)))}`;
}
function formatPrice(v) {
  return v.toFixed(v >= 1e3 ? 1 : 2);
}
function drawChart(canvas, eng, opts) {
  const { accent, entryPrice, liqPrice, tpPrice, slPrice, direction, groupFactor = 1 } = opts;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  if (!eng) return;
  const BARS = 26;
  const aggregated = aggregateCandles(eng.candles, eng.currentCandle, groupFactor);
  const all = aggregated.slice(-BARS);
  if (all.length === 0) return;
  const formingKey = Math.floor(eng.currentCandle.t / groupFactor);
  const padL = 4, padR = 54, padT = 10, padB = 10;
  const plotW = Math.max(1, w - padL - padR);
  const plotH = Math.max(1, h - padT - padB);
  let lo = Math.min(...all.map((c) => c.low));
  let hi = Math.max(...all.map((c) => c.high));
  if (entryPrice != null) {
    lo = Math.min(lo, entryPrice);
    hi = Math.max(hi, entryPrice);
  }
  if (liqPrice != null) {
    lo = Math.min(lo, liqPrice);
    hi = Math.max(hi, liqPrice);
  }
  if (tpPrice != null) {
    lo = Math.min(lo, tpPrice);
    hi = Math.max(hi, tpPrice);
  }
  if (slPrice != null) {
    lo = Math.min(lo, slPrice);
    hi = Math.max(hi, slPrice);
  }
  const span = Math.max(hi - lo, hi * 1e-3);
  lo -= span * 0.12;
  hi += span * 0.12;
  const yOf = (p) => padT + (1 - (p - lo) / (hi - lo)) * plotH;
  ctx.strokeStyle = BASE.line;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  for (let i = 0; i <= 3; i++) {
    const y = padT + plotH / 3 * i;
    ctx.beginPath();
    ctx.moveTo(padL, Math.round(y) + 0.5);
    ctx.lineTo(w - padR, Math.round(y) + 0.5);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const slotW = plotW / BARS;
  const bodyW = Math.max(2, slotW * 0.56);
  const rightPad = BARS - all.length;
  all.forEach((c, i) => {
    const slot = i + rightPad;
    const x = padL + slot * slotW + slotW / 2;
    const isUp = c.close >= c.open;
    const color = isUp ? WIN : LOSS;
    const isForming = c.t === formingKey;
    ctx.globalAlpha = isForming ? 0.92 : 1;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, yOf(c.high));
    ctx.lineTo(x, yOf(c.low));
    ctx.stroke();
    const yO = yOf(c.open), yC = yOf(c.close);
    const top = Math.min(yO, yC), bh = Math.max(1.5, Math.abs(yC - yO));
    ctx.fillRect(x - bodyW / 2, top, bodyW, bh);
    ctx.globalAlpha = 1;
  });
  const drawDashed = (price, color, label) => {
    if (price == null) return;
    const y = yOf(price);
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR + 6, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textBaseline = "middle";
    ctx.fillText(label, w - padR + 8, y);
  };
  if (entryPrice != null) drawDashed(entryPrice, direction === "long" ? WIN : LOSS, formatPrice(entryPrice));
  if (liqPrice != null) drawDashed(liqPrice, WARN, opts.lang === "en" ? "liq." : "\u043B\u0438\u043A\u0432.");
  if (tpPrice != null) drawDashed(tpPrice, WIN, "TP");
  if (slPrice != null) drawDashed(slPrice, LOSS, "SL");
  const last = eng.price;
  const yLast = yOf(last);
  const upTick = last >= eng.prevTickPrice;
  ctx.setLineDash([2, 3]);
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, yLast);
  ctx.lineTo(w - padR + 6, yLast);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#06120F";
  const tagColor = upTick ? WIN : LOSS;
  const tagY = clamp(yLast, padT + 8, h - padB - 8);
  ctx.fillStyle = tagColor;
  ctx.fillRect(w - padR + 4, tagY - 8, padR - 6, 16);
  ctx.fillStyle = "#06120F";
  ctx.font = "600 10px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(formatPrice(last), w - padR + 8, tagY);
  ctx.textAlign = "left";
}
function CandleChart({ engineRef, accent, entryPrice, liqPrice, tpPrice, slPrice, direction, groupFactor = 1, lang = "ru" }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    const loop = () => {
      if (canvasRef.current) {
        drawChart(canvasRef.current, engineRef.current, { accent, entryPrice, liqPrice, tpPrice, slPrice, direction, groupFactor, lang });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [accent, entryPrice, liqPrice, tpPrice, slPrice, direction, groupFactor]);
  return /* @__PURE__ */ jsx("div", { style: { width: "100%", height: 150 }, children: /* @__PURE__ */ jsx("canvas", { ref: canvasRef, style: { width: "100%", height: "100%", display: "block" } }) });
}
function drawRadar(canvas, eng, opts) {
  const { accent } = opts;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  if (!eng) return;
  const padR = 46, padY = 8;
  const plotW = w - padR;
  const plotH = h - padY * 2;
  const price = eng.price;
  const rangePct = 0.016;
  const lo = price * (1 - rangePct), hi = price * (1 + rangePct);
  const yOf = (p) => padY + (1 - (p - lo) / (hi - lo)) * plotH;
  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.textBaseline = "middle";
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const p = lo + (hi - lo) * (i / steps);
    const y = yOf(p);
    ctx.strokeStyle = BASE.line;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(plotW, Math.round(y) + 0.5);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = BASE.inkFaint;
    ctx.fillText(formatPrice(p), plotW + 6, y);
  }
  const yPrice = yOf(price);
  ctx.setLineDash([2, 3]);
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, yPrice);
  ctx.lineTo(plotW, yPrice);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.fillStyle = accent;
  ctx.font = "600 9px 'JetBrains Mono', monospace";
  ctx.fillText(formatPrice(price), plotW + 6, clamp(yPrice, padY + 8, h - padY - 8));
  const orders = eng.radarOrders || [];
  for (const o of orders) {
    if (o.price < lo || o.price > hi) continue;
    const y = yOf(o.price);
    const color = o.side === "bid" ? WIN : LOSS;
    let alpha = 1, scale = 1, glow = 0, fillColor = color;
    if (o.state === "pulled") {
      const t = Math.min(1, o.animMs / 500);
      alpha = 1 - t;
      scale = 1 - t * 0.4;
    } else if (o.state === "filled") {
      const t = Math.min(1, o.animMs / 500);
      alpha = 1 - t * 0.7;
      scale = 1 + t * 0.8;
      glow = 1 - t;
      fillColor = accent;
    } else {
      const age = eng.elapsedMs - o.bornMs;
      scale = 1 + Math.sin(age / 450) * 0.06;
      if (o.justMovedMs != null && o.justMovedMs < 400) glow = 1 - o.justMovedMs / 400;
    }
    const barLen = (16 + o.size * 11) * scale;
    const barH = Math.max(3, 3 + o.size * 1.3);
    ctx.globalAlpha = clamp(alpha, 0, 1);
    ctx.fillStyle = fillColor;
    if (glow > 0) {
      ctx.shadowColor = fillColor;
      ctx.shadowBlur = 10 * glow;
    }
    ctx.fillRect(plotW - barLen, y - barH / 2, barLen, barH);
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;
}
function OrderRadar({ engineRef, accent, t }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    const loop = () => {
      if (canvasRef.current) drawRadar(canvasRef.current, engineRef.current, { accent });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [accent]);
  return /* @__PURE__ */ jsxs(Card, { className: "mb-2.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: t.sim.bigOrders }),
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[9px]", style: { color: BASE.inkFaint }, children: [
        /* @__PURE__ */ jsx("span", { style: { width: 5, height: 5, borderRadius: 999, background: WIN, display: "inline-block" } }),
        " ",
        t.sim.bid,
        /* @__PURE__ */ jsx("span", { style: { width: 5, height: 5, borderRadius: 999, background: LOSS, display: "inline-block", marginLeft: 4 } }),
        " ",
        t.sim.ask
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { width: "100%", height: 118 }, children: /* @__PURE__ */ jsx("canvas", { ref: canvasRef, style: { width: "100%", height: "100%", display: "block" } }) }),
    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-center mt-1.5", style: { color: BASE.inkFaint }, children: t.sim.noGuarantee })
  ] });
}
function LeverageBar({ value, onChange, accent, disabled }) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1.5", style: { color: BASE.inkFaint }, children: "\u041F\u043B\u0435\u0447\u043E" }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5", children: LEVERAGE_OPTIONS.map((lv) => /* @__PURE__ */ jsxs(
      "button",
      {
        disabled,
        onClick: () => onChange(lv),
        className: "px-3 py-1.5 rounded-full text-[12px] transition-all duration-150 active:scale-95 whitespace-nowrap shrink-0",
        style: {
          background: value === lv ? accent : "transparent",
          color: value === lv ? "#06120F" : disabled ? BASE.inkFaint : BASE.inkDim,
          border: `1px solid ${value === lv ? accent : BASE.line}`,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: value === lv ? 700 : 400,
          opacity: disabled ? 0.5 : 1
        },
        children: [
          "x",
          lv
        ]
      },
      lv
    )) })
  ] });
}

// ============================================================================
// src/services/ai/ — Gemini AI layer for the Coach tab, built via Firebase AI
// Logic (client SDK, Gemini Developer API backend — no Cloud Function, no
// Blaze plan required). Kept as one section of this file (the app ships as a
// single bundled module) but organized as three logically separate pieces,
// exactly like separate files would be:
//   - aiContextBuilder: turns existing analytics/journal data into a compact,
//     privacy-safe object. Never invents a metric the app doesn't compute.
//   - aiPrompts: the fixed system instruction + task templates.
//   - aiService: the only place that talks to Gemini; owns error handling.
// Nothing outside this section calls the Gemini SDK directly.
// ============================================================================

// ---- aiContextBuilder.js ----------------------------------------------------
function aiSafeNum(v) {
  return typeof v === "number" && isFinite(v) ? v : null;
}
function aiComputeStreakDays(entries) {
  const dateSet = new Set((entries || []).map((e) => e.date.toDateString()));
  const cursor = /* @__PURE__ */ new Date();
  if (!dateSet.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dateSet.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
function aiComputeStreaks(sortedClosed) {
  let curLoss = 0, maxLoss = 0, curWin = 0, maxWin = 0;
  sortedClosed.forEach((t) => {
    if (t.outcome === "Loss") {
      curLoss++;
      maxLoss = Math.max(maxLoss, curLoss);
      curWin = 0;
    } else if (t.outcome === "Win") {
      curWin++;
      maxWin = Math.max(maxWin, curWin);
      curLoss = 0;
    } else {
      curLoss = 0;
      curWin = 0;
    }
  });
  return { maxLossStreak: maxLoss, maxWinStreak: maxWin };
}
function aiComputePlanVsFact(closedEntries) {
  const withPlan = closedEntries.filter((e) => typeof e.plannedRR === "number" && typeof e.realizedRR === "number");
  if (withPlan.length < 3) return null;
  const avgPlanned = st_mean(withPlan.map((e) => e.plannedRR));
  const avgRealized = st_mean(withPlan.map((e) => e.realizedRR));
  const captures = withPlan.filter((e) => e.plannedRR > 0).map((e) => Math.max(0, Math.min(1, e.realizedRR / e.plannedRR)));
  const captureRatioPct = captures.length ? Math.round(st_mean(captures) * 100) : null;
  const closeCounts = { tp: 0, sl: 0, manual: 0 };
  closedEntries.forEach((e) => {
    if (e.closeType && closeCounts[e.closeType] != null) closeCounts[e.closeType]++;
  });
  const closeTotal = closeCounts.tp + closeCounts.sl + closeCounts.manual;
  return {
    sample: withPlan.length,
    avgPlannedRR: st_round2(avgPlanned),
    avgRealizedRR: st_round2(avgRealized),
    captureRatioPct,
    tpSharePct: closeTotal ? Math.round(closeCounts.tp / closeTotal * 100) : null,
    slSharePct: closeTotal ? Math.round(closeCounts.sl / closeTotal * 100) : null,
    manualSharePct: closeTotal ? Math.round(closeCounts.manual / closeTotal * 100) : null
  };
}
function aiSummarizePattern(p) {
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    type: p.type || null,
    severity: p.severity || null,
    confidence: p.confidence || null,
    sampleSize: aiSafeNum(p.sampleSize),
    avgR: p.metrics?.group?.avgR != null ? aiSafeNum(p.metrics.group.avgR) : null,
    winRatePct: p.metrics?.group?.winRate != null ? aiSafeNum(p.metrics.group.winRate) : null,
    summary: p.description || null
  };
}
function aiBuildContext(entries, analytics, lang) {
  const validEntries = (entries || []).filter((e) => e && e.date instanceof Date && !isNaN(e.date.getTime()));
  const closedEntries = validEntries.filter(isEntryClosed);
  const sortedClosed = [...closedEntries].sort((a, b) => a.date - b.date);
  const streaks = aiComputeStreaks(sortedClosed);
  const rr = analytics?.rrStats || null;
  const violation = (id) => analytics?.discipline?.violations?.find((v) => v.id === id)?.value ?? null;
  const context = {
    lang: lang === "en" ? "en" : "ru",
    trader: {
      level: calculateTraderLevel(validEntries.length),
      awarenessScore: aiSafeNum(analytics?.awareness?.score?.value),
      awarenessTrend: analytics?.awareness?.trend || null,
      currentStreakDays: aiComputeStreakDays(validEntries)
    },
    statistics: rr ? {
      totalTrades: validEntries.length,
      closedTrades: aiSafeNum(rr.sampleSize),
      winRate: aiSafeNum(rr.winRate),
      wins: aiSafeNum(rr.wins),
      losses: aiSafeNum(rr.losses),
      breakevens: aiSafeNum(rr.breakevens),
      avgRealizedRR: aiSafeNum(rr.avgRealizedRR),
      avgWinR: aiSafeNum(rr.avgWinR),
      avgLossR: aiSafeNum(rr.avgLossR),
      expectancy: aiSafeNum(rr.expectancy)
    } : { totalTrades: validEntries.length, closedTrades: 0 },
    planVsFact: aiComputePlanVsFact(closedEntries),
    behavior: {
      disciplineScore: aiSafeNum(analytics?.discipline?.score?.value),
      revengeTradeRatePct: aiSafeNum(violation("revenge_rate")),
      overtradingDaySharePct: aiSafeNum(violation("overtrading_days")),
      riskChangeAfterLossPct: aiSafeNum(analytics?.risk?.postLossChange?.value),
      riskChangeAfterWinPct: aiSafeNum(analytics?.risk?.postWinChange?.value),
      maxLossStreak: streaks.maxLossStreak,
      maxWinStreak: streaks.maxWinStreak
    },
    risk: {
      averageRiskR: aiSafeNum(analytics?.risk?.averageRisk),
      stabilityScore: aiSafeNum(analytics?.risk?.stability?.value),
      volatility: aiSafeNum(analytics?.risk?.volatility)
    },
    reflection: {
      reflectionScore: aiSafeNum(analytics?.reflection?.score?.value),
      lossReviewCoveragePct: aiSafeNum(analytics?.reflection?.lossReviewCoverage?.value),
      repeatedLessonsCount: analytics?.reflection?.repeatedLessons?.length ?? 0
    },
    emotional: analytics?.emotionalState?.average ? {
      average: analytics.emotionalState.average,
      confidence: analytics.emotionalState.confidence || null,
      bestState: analytics.emotionalState.bestState ? {
        title: analytics.emotionalState.bestState.title,
        winRatePct: aiSafeNum(analytics.emotionalState.bestState.winRate),
        meanR: aiSafeNum(analytics.emotionalState.bestState.meanR),
        trades: aiSafeNum(analytics.emotionalState.bestState.trades)
      } : null,
      worstState: analytics.emotionalState.worstState ? {
        title: analytics.emotionalState.worstState.title,
        winRatePct: aiSafeNum(analytics.emotionalState.worstState.winRate),
        meanR: aiSafeNum(analytics.emotionalState.worstState.meanR),
        trades: aiSafeNum(analytics.emotionalState.worstState.trades)
      } : null
    } : null,
    patterns: (analytics?.patterns || []).slice(0, 5).map(aiSummarizePattern).filter(Boolean),
    healthyPatterns: (analytics?.healthyPatterns || []).slice(0, 3).map(aiSummarizePattern).filter(Boolean),
    dataQuality: analytics?.dataQuality || null
  };
  return context;
}
function aiHashContext(context) {
  const str = JSON.stringify(context);
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
function aiCompactRecentEntries(entries, limit) {
  return (entries || []).slice(-limit).map((e) => ({
    date: e.date instanceof Date ? e.date.toISOString().slice(0, 10) : null,
    instrument: e.instrument || null,
    direction: e.direction || null,
    outcome: e.outcome || null,
    r: aiSafeNum(e.r),
    tag: e.tag && e.tag !== "\u041E\u0431\u0449\u0435\u0435" ? e.tag : null,
    plannedRR: aiSafeNum(e.plannedRR),
    realizedRR: aiSafeNum(e.realizedRR),
    closeType: e.closeType || null,
    pull: e.pull && e.pull !== "\u2014" ? String(e.pull).slice(0, 200) : null,
    lesson: e.lesson && e.lesson !== "\u2014" ? String(e.lesson).slice(0, 200) : null
  }));
}

// ---- aiPrompts.js ------------------------------------------------------------
var AI_SYSTEM_INSTRUCTION = `You are the analytical assistant inside mind.exe, a trading journal app.
You analyze a trader's already-computed journal statistics and behavioral patterns. You are NOT a
financial advisor and must never give trading signals or instructions ("buy", "sell", "go long",
"set your stop here", specific entries/exits/instruments/position sizing).

You analyze: discipline, execution of the trader's own plan, emotional state, statistics, recurring
behavioral patterns, and gaps between plan and outcome.

Rules:
- Every number you cite must come from the JSON context you are given. Never invent statistics,
  dates, trade counts, or patterns that are not present in the data.
- Clearly separate FACT (a number from the data) from INTERPRETATION (your reading of it). Prefer
  phrasing like "this may indicate..." over flat claims.
- Never issue a psychological diagnosis ("you are afraid of profit", "you are addicted to..."). You
  may describe an observed behavioral tendency, but not label the person.
- Win rate and RR (risk/reward) must always be read together, never in isolation. A low win rate
  with a higher RR is not automatically bad trading, and a high win rate with a low RR is not
  automatically good trading. If the app-computed expectancy is available and positive, say so
  explicitly rather than criticizing win rate or RR individually.
- If the sample size for a metric is small or a field is null/missing, say plainly that there isn't
  enough data for a confident conclusion on that point, instead of guessing.
- Never reference the exact time period unless dates are present in the data — don't say "over the
  last few months" if you don't know the span.
- Keep responses concise, concrete, and grounded in the numbers you were given.
- Respond in the language given by the context's "lang" field: "ru" \u2192 Russian, "en" \u2192 English.`;
var AI_INSIGHT_TASK = `Write a short journal insight (3-6 sentences) for the Home/Coach screen, based only on
the AGGREGATED_CONTEXT JSON below. Reference at least one concrete number from the data. If the
sample size is too small anywhere relevant, say so instead of speculating. Do not use headers or
bullet lists \u2014 plain prose.`;
var AI_CHAT_TASK = `Answer the trader's USER_QUESTION using AGGREGATED_CONTEXT and, if provided,
RECENT_TRADES as your only source of truth. Use CONVERSATION_SO_FAR for context on the ongoing
chat. If the data doesn't support a confident answer, say so directly rather than guessing.`;

// ---- aiService.js ------------------------------------------------------------
var aiGeminiModel = null;
function aiGetModel() {
  if (!aiGeminiModel) {
    aiGeminiModel = getGenerativeModel(aiLogic, {
      model: AI_MODEL,
      systemInstruction: AI_SYSTEM_INSTRUCTION,
      generationConfig: { temperature: 0.4, maxOutputTokens: 700 }
    });
  }
  return aiGeminiModel;
}
async function aiCallGemini(prompt) {
  const model = aiGetModel();
  const result = await model.generateContent(prompt);
  const text = result?.response?.text?.();
  if (!text || !text.trim()) throw new Error("ai_empty_response");
  return text.trim();
}
async function aiGenerateInsight(context) {
  const prompt = `${AI_INSIGHT_TASK}

AGGREGATED_CONTEXT:
${JSON.stringify(context)}`;
  return aiCallGemini(prompt);
}
async function aiChatReply(context, recentTrades, history, question) {
  const historyText = (history || []).slice(-10).map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
  const prompt = `${AI_CHAT_TASK}

AGGREGATED_CONTEXT:
${JSON.stringify(context)}

RECENT_TRADES:
${JSON.stringify(recentTrades)}

CONVERSATION_SO_FAR:
${historyText || "(none yet)"}

USER_QUESTION:
${question}`;
  return aiCallGemini(prompt);
}

function Coach({ entries, analytics, accent, userId, lang, t }) {
  const [analysis, setAnalysis] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const loadedRef = useRef(false);
  const scrollRef = useRef(null);
  const lastContextHashRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    loadAiState(userId).then((s) => {
      if (cancelled) return;
      setAnalysis(s.analysis || "");
      setChatMessages(Array.isArray(s.chatMessages) ? s.chatMessages : []);
      lastContextHashRef.current = s.lastContextHash || null;
      loadedRef.current = true;
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);
  useEffect(() => {
    if (!loadedRef.current) return;
    saveAiState(userId, { analysis, chatMessages, lastContextHash: lastContextHashRef.current });
  }, [analysis, chatMessages, userId]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages, sending]);
  // Gemini request is only ever triggered by an explicit user action below (button press /
  // send message) — never inside a useEffect tied to entries/state, per the no-request-per-render
  // rule. runAnalyze also skips the network call entirely when the underlying stats haven't
  // changed since the last generated insight (context hash cache).
  const runAnalyze = async () => {
    if (analyzing || entries.length === 0) return;
    const context = aiBuildContext(entries, analytics, lang);
    const hash = aiHashContext(context);
    if (hash === lastContextHashRef.current && analysis) return;
    setAnalyzing(true);
    setError("");
    try {
      const text = await aiGenerateInsight(context);
      setAnalysis(text);
      lastContextHashRef.current = hash;
    } catch (e) {
      setError(t.coach.error);
    } finally {
      setAnalyzing(false);
    }
  };
  const sendMessage = async (overrideText) => {
    const text = (overrideText ?? chatInput).trim();
    if (!text || sending) return;
    setChatInput("");
    setError("");
    const nextMessages = [...chatMessages, { role: "user", content: text }];
    setChatMessages(nextMessages);
    setSending(true);
    try {
      const context = aiBuildContext(entries, analytics, lang);
      const recentTrades = aiCompactRecentEntries(entries, 15);
      const reply = await aiChatReply(context, recentTrades, nextMessages, text);
      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(t.coach.error);
    } finally {
      setSending(false);
    }
  };
  const quickQuestions = [
    { icon: Brain, text: t.coach.quick.lateCloses },
    { icon: Star, text: t.coach.quick.strengths },
    { icon: TrendingDown, text: t.coach.quick.losses },
    { icon: Target, text: t.coach.quick.discipline },
    { icon: RotateCcw, text: t.coach.quick.strategy },
    { icon: LineChartIcon, text: t.coach.quick.style }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-1 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
        /* @__PURE__ */ jsx(Bot, { size: 17, style: { color: accent } }),
        " ",
        /* @__PURE__ */ jsx(DecodeText, { text: t.coach.title })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: BASE.inkDim }, children: /* @__PURE__ */ jsx(DecodeText, { text: t.coach.subtitle }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { accent, className: "mb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-wide mb-3", style: { color: accent, fontFamily: "'Space Grotesk', sans-serif" }, children: /* @__PURE__ */ jsx(DecodeText, { text: t.coach.analyzeTitle }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: analyzing ? /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 py-1", children: /* @__PURE__ */ jsx(LogoSpinner, { size: 20, accent }) }) : analysis ? /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed whitespace-pre-wrap", style: { color: BASE.ink }, children: /* @__PURE__ */ jsx(DecodeText, { as: "span", text: analysis, maxTotalMs: 750 }) }) : /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed", style: { color: BASE.inkFaint }, children: /* @__PURE__ */ jsx(DecodeText, { text: entries.length === 0 ? t.coach.analyzeNoEntries : t.coach.analyzeDesc }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "relative shrink-0 w-16 h-16 rounded-full flex items-center justify-center", style: { background: `radial-gradient(circle at 35% 30%, ${accent}30, transparent 72%)`, border: `1px solid ${accent}35`, boxShadow: ring(accent) }, children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-2 rounded-full", style: { border: `1px solid ${accent}25` } }),
          /* @__PURE__ */ jsx(Sparkles, { size: 20, style: { color: accent } })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: runAnalyze,
          disabled: analyzing || entries.length === 0,
          className: "w-full py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2",
          style: { border: `1px solid ${accent}40`, background: `linear-gradient(135deg, ${accent}30, ${accent}12)`, color: accent, fontFamily: "'Space Grotesk', sans-serif" },
          children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 14 }),
            /* @__PURE__ */ jsx(DecodeText, { text: analyzing ? t.coach.analyzeBusy : t.coach.analyzeBtn })
          ]
        }
      ),
      entries.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mt-3 pt-3 text-[11px]", style: { borderTop: `1px solid ${BASE.line}`, color: BASE.inkFaint }, children: [
        /* @__PURE__ */ jsx(Info, { size: 12 }),
        /* @__PURE__ */ jsx(DecodeText, { text: t.coach.analyzeScopeInfo })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { accent, className: "mb-4 flex flex-col", style: { height: "52vh", maxHeight: 560 }, children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-wide mb-1", style: { color: accent, fontFamily: "'Space Grotesk', sans-serif" }, children: /* @__PURE__ */ jsx(DecodeText, { text: t.coach.chatTitle }) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mb-3", style: { color: BASE.inkFaint }, children: /* @__PURE__ */ jsx(DecodeText, { text: t.coach.chatDesc }) }),
      /* @__PURE__ */ jsxs("div", { ref: scrollRef, className: "flex-1 min-h-0 overflow-y-auto mb-3 pr-1", children: [
        chatMessages.length === 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: quickQuestions.map((q, i) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => sendMessage(q.text),
            disabled: sending,
            className: "flex items-center gap-2 text-left p-2.5 rounded-xl text-[12px] leading-snug transition-all duration-200 active:scale-[0.97] disabled:opacity-40",
            style: { background: BASE.surface2, border: `1px solid ${BASE.line}`, color: BASE.ink },
            children: [
              /* @__PURE__ */ jsx("span", { className: "shrink-0 w-6 h-6 rounded-lg flex items-center justify-center", style: { background: `${accent}14`, color: accent }, children: /* @__PURE__ */ jsx(q.icon, { size: 13 }) }),
              /* @__PURE__ */ jsx(DecodeText, { text: q.text, maxTotalMs: 420 })
            ]
          },
          i
        )) }),
        chatMessages.map((m, i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: `mt-2.5 max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" ? "ml-auto" : ""}`,
            style: m.role === "user" ? { background: `${accent}14`, color: BASE.ink } : { background: BASE.surface2, color: BASE.ink },
            children: m.role === "assistant" ? /* @__PURE__ */ jsx(DecodeText, { text: m.content, maxTotalMs: 750 }) : m.content
          },
          i
        ))
      ] }),
      sending && /* @__PURE__ */ jsx("div", { className: "mb-2.5 max-w-[85%] rounded-xl px-3 py-2 flex items-center", style: { background: BASE.surface2 }, children: /* @__PURE__ */ jsx(LogoSpinner, { size: 18, accent }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            value: chatInput,
            onChange: (e) => setChatInput(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") sendMessage();
            },
            placeholder: t.coach.chatPlaceholder,
            className: "flex-1 bg-transparent outline-none text-sm px-3 py-2 rounded-xl",
            style: { border: `1px solid ${BASE.line}`, color: BASE.ink }
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => sendMessage(),
            disabled: sending || !chatInput.trim(),
            className: "shrink-0 p-2.5 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40",
            style: { border: `1px solid ${accent}40`, background: `${accent}12`, color: accent },
            "aria-label": t.coach.send,
            children: /* @__PURE__ */ jsx(Send, { size: 15 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10.5px]", style: { color: BASE.inkFaint }, children: [
        /* @__PURE__ */ jsx(ShieldCheck, { size: 11 }),
        /* @__PURE__ */ jsx(DecodeText, { text: t.coach.disclaimer })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { accent, className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full animate-pulse", style: { background: WIN } }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: BASE.ink }, children: /* @__PURE__ */ jsx(DecodeText, { text: t.coach.statusReady }) }),
          /* @__PURE__ */ jsx("p", { className: "text-[10.5px]", style: { color: BASE.inkFaint }, children: /* @__PURE__ */ jsx(DecodeText, { text: t.coach.statusOnline }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10.5px]", style: { color: accent }, children: [
        /* @__PURE__ */ jsx(Zap, { size: 11 }),
        /* @__PURE__ */ jsx(DecodeText, { text: t.coach.modelLabel })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "text-xs text-center", style: { color: LOSS }, children: error })
  ] });
}
function Simulator({ accent, onWin, t, lang }) {
  const [stage, setStage] = useState("intro");
  const [leverage, setLeverage] = useState(10);
  const [timeframeSec, setTimeframeSec] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(SIM_DURATION);
  const [capital, setCapital] = useState(SIM_START_CAPITAL);
  const [position, setPosition] = useState(null);
  const [takeProfitPct, setTakeProfitPct] = useState(null);
  const [stopLossPct, setStopLossPct] = useState(null);
  const [trades, setTrades] = useState([]);
  const [result, setResult] = useState(null);
  const [liquidated, setLiquidated] = useState(false);
  const [autoClosedTag, setAutoClosedTag] = useState(null);
  const engineRef = useRef(null);
  const positionRef = useRef(null);
  const capitalRef = useRef(SIM_START_CAPITAL);
  const tradesRef = useRef([]);
  const stageRef = useRef("intro");
  const rafRef = useRef(null);
  const lastUiSyncRef = useRef(0);
  const tpSlRef = useRef({ tp: null, sl: null });
  const [uiPrice, setUiPrice] = useState(100);
  const [uiNews, setUiNews] = useState(null);
  useEffect(() => {
    positionRef.current = position;
  }, [position]);
  useEffect(() => {
    capitalRef.current = capital;
  }, [capital]);
  useEffect(() => {
    tradesRef.current = trades;
  }, [trades]);
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);
  useEffect(() => {
    tpSlRef.current = { tp: takeProfitPct, sl: stopLossPct };
  }, [takeProfitPct, stopLossPct]);
  const floatingPnlPct = (pos, price) => {
    if (!pos || price == null) return 0;
    const movePct = pos.direction === "long" ? (price - pos.entryPrice) / pos.entryPrice : (pos.entryPrice - price) / pos.entryPrice;
    return movePct * pos.leverage;
  };
  const liqPriceOf = (pos) => {
    if (!pos) return null;
    const adverse = 1 / pos.leverage;
    return pos.direction === "long" ? pos.entryPrice * (1 - adverse) : pos.entryPrice * (1 + adverse);
  };
  const finalizeSession = (finalCapital, finalTrades) => {
    const capitalSeq = [SIM_START_CAPITAL, ...finalTrades.map((t2) => t2.capitalAfter)];
    let peak = SIM_START_CAPITAL, maxDD = 0;
    capitalSeq.forEach((c) => {
      peak = Math.max(peak, c);
      maxDD = Math.max(maxDD, (peak - c) / peak);
    });
    const eng = engineRef.current;
    const marketReturn = eng ? (eng.price - 100) / 100 : 0;
    const playerReturn = (finalCapital - SIM_START_CAPITAL) / SIM_START_CAPITAL;
    const impulsive = finalTrades.filter((t2) => t2.durationMs < 3e3).length;
    const anyLiquidated = finalTrades.some((t2) => t2.liquidated);
    const achievementLabels = lang === "en" ? SIM_ACHIEVEMENTS_EN : SIM_ACHIEVEMENTS;
    const achievements = [];
    if (maxDD < 0.15) achievements.push(achievementLabels.lowRisk);
    if (finalTrades.length > 0 && impulsive === 0) achievements.push(achievementLabels.noImpulsive);
    if (maxDD < 0.05) achievements.push(achievementLabels.tightDrawdown);
    if (!anyLiquidated && finalTrades.length > 0) achievements.push(achievementLabels.survivedVol);
    const beatMarket = playerReturn > marketReturn;
    setCapital(finalCapital);
    setTrades(finalTrades);
    setPosition(null);
    setResult({ finalCapital, playerReturn, marketReturn, beatMarket, achievements, maxDD, tradesCount: finalTrades.length, liquidated: anyLiquidated });
    setStage("result");
    if (beatMarket && onWin) onWin();
  };
  useEffect(() => {
    if (stage !== "playing") return;
    let last = performance.now();
    const tick = (now) => {
      const dtSec = Math.min(0.05, (now - last) / 1e3);
      last = now;
      const eng = engineRef.current;
      if (eng) {
        const pos0 = positionRef.current;
        const playerFlow = pos0 ? (pos0.direction === "long" ? 1 : -1) * clamp(pos0.margin * pos0.leverage / (SIM_START_CAPITAL * 5), 0, 2) : 0;
        stepEngine(eng, dtSec, playerFlow);
        const pos = positionRef.current;
        if (pos) {
          const pnlPct = floatingPnlPct(pos, eng.price);
          if (pnlPct <= -1) {
            const newCapital = Math.max(0, capitalRef.current - pos.margin);
            const closedTrade = { direction: pos.direction, durationMs: eng.elapsedMs - pos.openedAtMs, pnl: -pos.margin, capitalAfter: newCapital, liquidated: true };
            capitalRef.current = newCapital;
            tradesRef.current = [...tradesRef.current, closedTrade];
            positionRef.current = null;
            setCapital(newCapital);
            setTrades(tradesRef.current);
            setPosition(null);
            setLiquidated(true);
            setTimeout(() => setLiquidated(false), 1600);
          } else {
            const movePct = pos.direction === "long" ? (eng.price - pos.entryPrice) / pos.entryPrice : (pos.entryPrice - eng.price) / pos.entryPrice;
            const { tp, sl } = tpSlRef.current;
            const hitSL = sl != null && movePct <= -sl / 100;
            const hitTP = !hitSL && tp != null && movePct >= tp / 100;
            if (hitSL || hitTP) {
              applyMarketImpact(eng, pos.direction === "long" ? "sell" : "buy", pos.margin, pos.leverage);
              const finalPnlPct = clamp(floatingPnlPct(pos, eng.price), -1, Infinity);
              const pnl = pos.margin * finalPnlPct;
              const newCapital = Math.max(0, capitalRef.current + pnl);
              const closedTrade = { direction: pos.direction, durationMs: eng.elapsedMs - pos.openedAtMs, pnl, capitalAfter: newCapital, liquidated: false };
              capitalRef.current = newCapital;
              tradesRef.current = [...tradesRef.current, closedTrade];
              positionRef.current = null;
              setCapital(newCapital);
              setTrades(tradesRef.current);
              setPosition(null);
              setAutoClosedTag(hitSL ? "sl" : "tp");
              setTimeout(() => setAutoClosedTag(null), 1600);
            }
          }
        }
      }
      if (now - lastUiSyncRef.current > 100) {
        lastUiSyncRef.current = now;
        if (eng) {
          setUiPrice(eng.price);
          const ev = eng.newsEvent;
          const age = ev ? eng.elapsedMs - ev.spawnMs : Infinity;
          setUiNews(ev && age < NEWS_VISIBLE_MS ? { headline: ev.headline, ageMs: age, rampMs: ev.rampMs } : null);
        }
      }
      if (stageRef.current === "playing") rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stage]);
  useEffect(() => {
    if (stage !== "playing") return;
    if (secondsLeft <= 0) {
      const eng = engineRef.current;
      let finalCapital = capitalRef.current;
      let finalTrades = tradesRef.current;
      const pos = positionRef.current;
      if (pos && eng) {
        const pnlPct = clamp(floatingPnlPct(pos, eng.price), -1, Infinity);
        const pnl = pos.margin * pnlPct;
        finalCapital = Math.max(0, finalCapital + pnl);
        finalTrades = [...finalTrades, { direction: pos.direction, durationMs: eng.elapsedMs - pos.openedAtMs, pnl, capitalAfter: finalCapital, liquidated: pnlPct <= -1 }];
      }
      finalizeSession(finalCapital, finalTrades);
      return;
    }
    const t2 = setTimeout(() => setSecondsLeft((s) => s - 1), 1e3);
    return () => clearTimeout(t2);
  }, [stage, secondsLeft]);
  const startSession = () => {
    const seed = Math.floor(Math.random() * 1e9);
    const eng = createMarketEngine(seed, 100, lang);
    engineRef.current = eng;
    capitalRef.current = SIM_START_CAPITAL;
    tradesRef.current = [];
    positionRef.current = null;
    setSecondsLeft(SIM_DURATION);
    setCapital(SIM_START_CAPITAL);
    setPosition(null);
    setTrades([]);
    setResult(null);
    setLiquidated(false);
    setUiPrice(eng.price);
    setStage("playing");
  };
  const openPosition = (direction) => {
    if (position || !engineRef.current) return;
    const eng = engineRef.current;
    const margin = capital * MARGIN_FRACTION;
    applyMarketImpact(eng, direction === "long" ? "buy" : "sell", margin, leverage);
    const pos = { direction, entryPrice: eng.price, margin, leverage, openedAtMs: eng.elapsedMs };
    positionRef.current = pos;
    setPosition(pos);
    setUiPrice(eng.price);
  };
  const closePosition = () => {
    const pos = positionRef.current;
    const eng = engineRef.current;
    if (!pos || !eng) return;
    applyMarketImpact(eng, pos.direction === "long" ? "sell" : "buy", pos.margin, pos.leverage);
    const pnlPct = clamp(floatingPnlPct(pos, eng.price), -1, Infinity);
    const pnl = pos.margin * pnlPct;
    const newCapital = Math.max(0, capital + pnl);
    const closedTrade = { direction: pos.direction, durationMs: eng.elapsedMs - pos.openedAtMs, pnl, capitalAfter: newCapital, liquidated: false };
    setTrades((prev) => [...prev, closedTrade]);
    setCapital(newCapital);
    positionRef.current = null;
    setPosition(null);
    setUiPrice(eng.price);
  };
  const maxAddableMargin = position ? Math.max(0, capital - position.margin) : 0;
  const addMarginAmount = Math.min(capital * 0.2, maxAddableMargin);
  const addMargin = () => {
    const pos = positionRef.current;
    const eng = engineRef.current;
    if (!pos || !eng || addMarginAmount < 50) return;
    applyMarketImpact(eng, pos.direction === "long" ? "buy" : "sell", addMarginAmount, pos.leverage);
    const newMargin = pos.margin + addMarginAmount;
    const newEntry = (pos.entryPrice * pos.margin + eng.price * addMarginAmount) / newMargin;
    const updated = { ...pos, margin: newMargin, entryPrice: newEntry };
    positionRef.current = updated;
    setPosition(updated);
    setUiPrice(eng.price);
  };
  const liveFloatingPct = position ? floatingPnlPct(position, uiPrice) : 0;
  const liveFloatingPnl = position ? position.margin * clamp(liveFloatingPct, -1, Infinity) : 0;
  const liveEquity = capital + liveFloatingPnl;
  const liqPrice = position ? liqPriceOf(position) : null;
  const tpPrice = position && takeProfitPct != null ? position.direction === "long" ? position.entryPrice * (1 + takeProfitPct / 100) : position.entryPrice * (1 - takeProfitPct / 100) : null;
  const slPrice = position && stopLossPct != null ? position.direction === "long" ? position.entryPrice * (1 - stopLossPct / 100) : position.entryPrice * (1 + stopLossPct / 100) : null;
  const upTick = engineRef.current ? uiPrice >= engineRef.current.prevTickPrice : true;
  const groupFactor = timeframeSec / 5;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  if (stage === "intro") {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-4 stagger", children: [
      /* @__PURE__ */ jsx(Swords, { size: 38, style: { color: accent }, className: "mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2 tracking-wide", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: t.sim.heading }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-8", style: { color: BASE.inkDim }, children: t.sim.subtitle }),
      /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "text-left mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: t.sim.terminal }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full", style: { color: accent, border: `1px solid ${accent}40` }, children: t.sim.beta })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.inkDim }, children: t.sim.introText })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: startSession,
          className: "px-10 py-3 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, boxShadow: softLift(accent) },
          children: t.sim.startSession
        }
      )
    ] });
  }
  if (stage === "playing") {
    return /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children: "SYNTH/USD" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: [5, 15].map((tf) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setTimeframeSec(tf),
              className: "px-1.5 py-0.5 rounded-md text-[9.5px] transition-all duration-150",
              style: {
                fontFamily: "'JetBrains Mono', monospace",
                color: timeframeSec === tf ? accent : BASE.inkFaint,
                border: `1px solid ${timeframeSec === tf ? accent + "40" : BASE.line}`,
                background: timeframeSec === tf ? `${accent}0F` : "transparent"
              },
              children: [
                tf,
                lang === "en" ? "s" : "\u0441"
              ]
            },
            tf
          )) })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm", style: { color: secondsLeft <= 10 ? LOSS : BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: [
          mm,
          ":",
          ss
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-2.5", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-1000 ease-linear", style: { width: `${secondsLeft / SIM_DURATION * 100}%`, background: secondsLeft <= 10 ? LOSS : accent } }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.sim.capital }),
          /* @__PURE__ */ jsx("div", { className: "text-[22px] leading-none", style: { fontFamily: "'JetBrains Mono', monospace", color: BASE.ink, fontWeight: 500 }, children: formatSimMoney(liveEquity) }),
          /* @__PURE__ */ jsxs("span", { className: "text-[11px]", style: { color: liveEquity >= SIM_START_CAPITAL ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: [
            liveEquity >= SIM_START_CAPITAL ? "+" : "",
            ((liveEquity - SIM_START_CAPITAL) / SIM_START_CAPITAL * 100).toFixed(1),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.sim.price }),
          /* @__PURE__ */ jsx("div", { className: "text-[18px] leading-none transition-colors duration-150", style: { fontFamily: "'JetBrains Mono', monospace", color: upTick ? WIN : LOSS, fontWeight: 500 }, children: formatPrice(uiPrice) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "mb-2", style: { padding: "8px 6px 4px 6px", position: "relative", overflow: "hidden" }, children: [
        /* @__PURE__ */ jsx(
          CandleChart,
          {
            engineRef,
            accent,
            entryPrice: position?.entryPrice ?? null,
            liqPrice,
            tpPrice,
            slPrice,
            direction: position?.direction ?? null,
            groupFactor,
            lang
          }
        ),
        uiNews && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "absolute top-0 left-0 right-0 flex items-center gap-1.5 px-2.5 py-1.5",
            style: { background: "rgba(19,19,21,0.92)", borderBottom: `1px solid ${BASE.line}`, animation: "riseIn 0.25s ease-out" },
            children: [
              /* @__PURE__ */ jsx(Newspaper, { size: 11, style: { color: accent, flexShrink: 0 } }),
              /* @__PURE__ */ jsx("span", { className: "text-[10.5px] leading-tight overflow-hidden text-ellipsis whitespace-nowrap", style: { color: BASE.ink }, children: uiNews.headline }),
              uiNews.ageMs < uiNews.rampMs && /* @__PURE__ */ jsx("span", { className: "text-[9px] shrink-0 ml-auto", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: t.sim.reacting })
            ]
          }
        ),
        liquidated && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", style: { background: `${LOSS}18`, backdropFilter: "blur(1px)" }, children: /* @__PURE__ */ jsx("span", { className: "px-3 py-1.5 rounded-full text-[12px]", style: { background: LOSS, color: "#1A0806", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }, children: t.sim.positionLiquidated }) }),
        autoClosedTag && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", style: { background: `${autoClosedTag === "tp" ? WIN : LOSS}18`, backdropFilter: "blur(1px)" }, children: /* @__PURE__ */ jsx("span", { className: "px-3 py-1.5 rounded-full text-[12px]", style: { background: autoClosedTag === "tp" ? WIN : LOSS, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }, children: autoClosedTag === "tp" ? t.sim.takeProfitHit : t.sim.stopLossHit }) })
      ] }),
      /* @__PURE__ */ jsx(LeverageBar, { value: leverage, onChange: setLeverage, accent, disabled: !!position }),
      /* @__PURE__ */ jsxs("div", { className: "mb-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] w-6 shrink-0", style: { color: WIN }, children: "TP" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-1 overflow-x-auto no-scrollbar", children: [null, 1, 2, 3, 5].map((v) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setTakeProfitPct(v),
              className: "px-1.5 py-0.5 rounded-md text-[9.5px] transition-all duration-150 shrink-0",
              style: {
                fontFamily: "'JetBrains Mono', monospace",
                color: takeProfitPct === v ? WIN : BASE.inkFaint,
                border: `1px solid ${takeProfitPct === v ? WIN + "40" : BASE.line}`,
                background: takeProfitPct === v ? `${WIN}0F` : "transparent"
              },
              children: v == null ? "\u2014" : `+${v}%`
            },
            `tp${v}`
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] w-6 shrink-0", style: { color: LOSS }, children: "SL" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-1 overflow-x-auto no-scrollbar", children: [null, 1, 2, 3, 5].map((v) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setStopLossPct(v),
              className: "px-1.5 py-0.5 rounded-md text-[9.5px] transition-all duration-150 shrink-0",
              style: {
                fontFamily: "'JetBrains Mono', monospace",
                color: stopLossPct === v ? LOSS : BASE.inkFaint,
                border: `1px solid ${stopLossPct === v ? LOSS + "40" : BASE.line}`,
                background: stopLossPct === v ? `${LOSS}0F` : "transparent"
              },
              children: v == null ? "\u2014" : `-${v}%`
            },
            `sl${v}`
          )) })
        ] })
      ] }),
      position ? /* @__PURE__ */ jsxs(Card, { className: "mb-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-sm", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: [
            /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded-full text-[11px]", style: { color: position.direction === "long" ? WIN : LOSS, border: `1px solid ${position.direction === "long" ? WIN : LOSS}40` }, children: [
              position.direction === "long" ? t.sim.long : t.sim.short,
              " x",
              position.leverage
            ] }),
            t.sim.entry,
            " ",
            formatPrice(position.entryPrice)
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm", style: { color: liveFloatingPct >= 0 ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: [
            liveFloatingPct >= 0 ? "+" : "",
            (liveFloatingPct * 100).toFixed(1),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[11px] mb-3", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
          /* @__PURE__ */ jsxs("span", { children: [
            t.sim.margin,
            " ",
            formatSimMoney(position.margin)
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "P&L ",
            liveFloatingPnl >= 0 ? "+" : "",
            formatSimMoney(liveFloatingPnl)
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { color: WARN }, children: [
            t.sim.liq,
            " ",
            formatPrice(liqPrice)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          addMarginAmount >= 50 && /* @__PURE__ */ jsxs("button", { onClick: addMargin, className: "flex-1 py-2.5 rounded-full text-[13px] transition-all duration-150 active:scale-95", style: { border: `1px solid ${accent}40`, color: accent, background: `${accent}0D` }, children: [
            t.sim.add,
            " ",
            formatSimMoney(addMarginAmount)
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: closePosition, className: "flex-1 py-2.5 rounded-full text-[13px] transition-all duration-150 active:scale-95", style: { border: `1px solid ${BASE.line}`, color: BASE.ink, background: BASE.surface2 }, children: t.sim.closePosition })
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-center mb-1.5", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
          t.sim.margin,
          " ",
          formatSimMoney(capital * MARGIN_FRACTION),
          " \xB7 ",
          t.sim.volume,
          " x",
          leverage,
          " = ",
          formatSimMoney(capital * MARGIN_FRACTION * leverage)
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-2.5", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => openPosition("long"), className: "flex-1 py-3 rounded-2xl text-sm transition-all duration-150 active:scale-95", style: { border: `1px solid ${WIN}40`, color: WIN, background: `${WIN}0D` }, children: t.sim.long }),
          /* @__PURE__ */ jsx("button", { onClick: () => openPosition("short"), className: "flex-1 py-3 rounded-2xl text-sm transition-all duration-150 active:scale-95", style: { border: `1px solid ${LOSS}40`, color: LOSS, background: `${LOSS}0D` }, children: t.sim.short })
        ] })
      ] }),
      /* @__PURE__ */ jsx(OrderRadar, { engineRef, accent, t })
    ] });
  }
  const r = result;
  return /* @__PURE__ */ jsxs("div", { className: "text-center stagger", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg mb-1 tracking-wide", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: t.sim.sessionOver }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs mb-6", style: { color: BASE.inkFaint }, children: [
      t.sim.finalCapital,
      ": ",
      formatSimMoney(r.finalCapital)
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-[40px] leading-none mb-2", style: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: r.playerReturn >= 0 ? WIN : LOSS }, children: [
      r.playerReturn >= 0 ? "+" : "",
      (r.playerReturn * 100).toFixed(1),
      "%"
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-base mb-6", style: { color: r.beatMarket ? WIN : LOSS, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: r.beatMarket ? t.sim.beatMarket : t.sim.lostToMarket }),
    /* @__PURE__ */ jsxs(Card, { className: "text-left mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm py-1", children: [
        /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: t.sim.marketReturn }),
        /* @__PURE__ */ jsxs("span", { style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: [
          r.marketReturn >= 0 ? "+" : "",
          (r.marketReturn * 100).toFixed(1),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm py-1", children: [
        /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: t.sim.tradesCount }),
        /* @__PURE__ */ jsx("span", { style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: r.tradesCount })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm py-1", children: [
        /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: t.sim.maxDrawdown }),
        /* @__PURE__ */ jsxs("span", { style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: [
          (r.maxDD * 100).toFixed(1),
          "%"
        ] })
      ] }),
      r.liquidated && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm py-1", children: [
        /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: t.sim.liquidations }),
        /* @__PURE__ */ jsx("span", { style: { color: WARN, fontFamily: "'JetBrains Mono', monospace" }, children: t.sim.wasLiquidated })
      ] })
    ] }),
    r.achievements.length > 0 && /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "text-left mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.sim.achievements }),
      r.achievements.map((a) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm py-1", children: [
        /* @__PURE__ */ jsx(Check, { size: 13, style: { color: accent } }),
        /* @__PURE__ */ jsx("span", { style: { color: BASE.ink }, children: a })
      ] }, a))
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: startSession,
        className: "px-10 py-3 rounded-full text-sm transition-all active:scale-95",
        style: { background: accent, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, boxShadow: softLift(accent) },
        children: t.sim.playAgain
      }
    )
  ] });
}
function SettingsSection({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "mb-6 break-inside-avoid", children });
}
function SettingsSectionLabel({ children }) {
  return /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-2.5", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children });
}
function Settings({
  accent,
  setAccent,
  name,
  setName,
  onThemeChange,
  soundOn,
  setSoundOn,
  weeklyGoal,
  setWeeklyGoal,
  onExport,
  onImport,
  onExportBackup,
  onImportBackup,
  onReset,
  onFullReset,
  measureMode,
  setMeasureMode,
  currency,
  setCurrency,
  startingCapital,
  setStartingCapital,
  username,
  accountProvider,
  onLogout,
  lang,
  setLang,
  t
}) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmFullReset, setConfirmFullReset] = useState(false);
  const importInputRef = useRef(null);
  const importBackupInputRef = useRef(null);
  const Section = SettingsSection;
  const SectionLabel = SettingsSectionLabel;
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-5 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsx(SettingsIcon, { size: 17, style: { color: accent } }),
      " ",
      t.settings.title
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:columns-2 lg:gap-6", children: [
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.language }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: [{ id: "ru", label: t.settings.russian }, { id: "en", label: t.settings.english }].map((l) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setLang(l.id),
          className: "flex-1 px-4 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
          style: { background: lang === l.id ? `${accent}12` : "transparent", color: lang === l.id ? accent : BASE.inkDim, border: `1px solid ${lang === l.id ? accent + "40" : BASE.line}` },
          children: l.label
        },
        l.id
      )) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mt-2", style: { color: BASE.inkFaint }, children: t.settings.languageNote })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.account }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 rounded-xl mb-2", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { color: BASE.ink }, children: [
          /* @__PURE__ */ jsx(User, { size: 15, style: { color: accent } }),
          " ",
          username || "\u2014"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: accountProvider || "\u2014" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: onLogout, className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: BASE.inkDim }, children: [
        /* @__PURE__ */ jsx(LogOut, { size: 15 }),
        " ",
        t.settings.logout
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mt-2", style: { color: BASE.inkFaint }, children: t.settings.localAccountNote })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.operatorName }),
      /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: t.settings.operatorPlaceholder, className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink } })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.accentColor }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: ACCENTS.map((a) => /* @__PURE__ */ jsxs("button", { onClick: () => {
        setAccent(a);
        onThemeChange(a.name);
      }, className: "flex flex-col items-center gap-1.5 transition-transform duration-150 active:scale-90", children: [
        /* @__PURE__ */ jsx("span", { className: "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300", style: { background: a.value, boxShadow: accent === a.value ? `0 0 0 3px ${BASE.bg}, 0 0 0 4.5px ${a.value}60` : "none" }, children: accent === a.value && /* @__PURE__ */ jsx(Check, { size: 16, color: "#06120F" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px]", style: { color: BASE.inkFaint }, children: a.name })
      ] }, a.name)) })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.resultUnits }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-3", children: [{ id: "R", label: t.settings.rMultiplier }, { id: "currency", label: t.settings.currencyLabel }].map((m) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMeasureMode(m.id),
          className: "px-4 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
          style: { background: measureMode === m.id ? `${accent}12` : "transparent", color: measureMode === m.id ? accent : BASE.inkDim, border: `1px solid ${measureMode === m.id ? accent + "40" : BASE.line}` },
          children: m.label
        },
        m.id
      )) }),
      measureMode === "currency" && /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
        /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap mb-3", children: CURRENCIES.map((c) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setCurrency(c.code),
            className: "px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
            style: { background: currency === c.code ? `${accent}12` : "transparent", color: currency === c.code ? accent : BASE.inkDim, border: `1px solid ${currency === c.code ? accent + "40" : BASE.line}`, fontFamily: "'JetBrains Mono', monospace" },
            children: [
              c.symbol,
              " ",
              c.code
            ]
          },
          c.code
        )) }),
        /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.startingCapital }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: startingCapital,
            onChange: (e) => setStartingCapital(parseFloat(e.target.value) || 0),
            type: "number",
            className: "w-full bg-transparent border-b outline-none py-2 text-sm",
            style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.weeklyGoalLabel }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: [3, 5, 7].map((g) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setWeeklyGoal(g),
          className: "px-4 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
          style: { background: weeklyGoal === g ? `${accent}12` : "transparent", color: weeklyGoal === g ? accent : BASE.inkDim, border: `1px solid ${weeklyGoal === g ? accent + "40" : BASE.line}` },
          children: [
            g,
            " ",
            t.settings.daysSuffix
          ]
        },
        g
      )) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mt-2", style: { color: BASE.inkFaint }, children: t.settings.weeklyGoalNote })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.sound }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setSoundOn(!soundOn), className: "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { color: BASE.ink }, children: [
          soundOn ? /* @__PURE__ */ jsx(Volume2, { size: 16, style: { color: accent } }) : /* @__PURE__ */ jsx(VolumeX, { size: 16, style: { color: BASE.inkFaint } }),
          t.settings.soundToggleLabel
        ] }),
        /* @__PURE__ */ jsx("span", { className: "w-9 h-5 rounded-full relative transition-all duration-200", style: { background: soundOn ? accent : BASE.line }, children: /* @__PURE__ */ jsx("span", { className: "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200", style: { left: soundOn ? "18px" : "2px" } }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.data }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mb-2.5", style: { color: BASE.inkFaint }, children: t.settings.dataNote }),
      /* @__PURE__ */ jsxs("button", { onClick: onExportBackup, className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-2 transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${accent}40`, background: `${accent}0D`, color: BASE.ink }, children: [
        /* @__PURE__ */ jsx(Download, { size: 15, style: { color: accent } }),
        " ",
        t.settings.fullBackup
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => importBackupInputRef.current?.click(), className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-3 transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${accent}40`, background: `${accent}0D`, color: BASE.ink }, children: [
        /* @__PURE__ */ jsx(Upload, { size: 15, style: { color: accent } }),
        " ",
        t.settings.restoreBackup
      ] }),
      /* @__PURE__ */ jsx("input", { ref: importBackupInputRef, type: "file", accept: "application/json,.json", className: "hidden", onChange: (e) => {
        const f = e.target.files?.[0];
        e.target.value = "";
        if (f) onImportBackup(f);
      } }),
      /* @__PURE__ */ jsxs("button", { onClick: onExport, className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-2 transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: BASE.ink }, children: [
        /* @__PURE__ */ jsx(Download, { size: 15, style: { color: accent } }),
        " ",
        t.settings.exportJournalOnly
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => importInputRef.current?.click(), className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-2 transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: BASE.ink }, children: [
        /* @__PURE__ */ jsx(Upload, { size: 15, style: { color: accent } }),
        " ",
        t.settings.importJournalOnly
      ] }),
      /* @__PURE__ */ jsx("input", { ref: importInputRef, type: "file", accept: "application/json,.json", className: "hidden", onChange: (e) => {
        const f = e.target.files?.[0];
        e.target.value = "";
        if (f) onImport(f);
      } }),
      confirmReset ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3 rounded-xl", style: { border: `1px solid ${LOSS}50`, background: `${LOSS}0D` }, children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 15, style: { color: LOSS } }),
        /* @__PURE__ */ jsx("span", { className: "text-xs flex-1", style: { color: BASE.ink }, children: t.settings.confirmClearJournal }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          onReset();
          setConfirmReset(false);
        }, className: "text-xs shrink-0", style: { color: LOSS }, children: t.settings.yes }),
        /* @__PURE__ */ jsx("button", { onClick: () => setConfirmReset(false), className: "text-xs shrink-0", style: { color: BASE.inkFaint }, children: t.settings.cancel })
      ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setConfirmReset(true), className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: LOSS }, children: [
        /* @__PURE__ */ jsx(Trash2, { size: 15 }),
        " ",
        t.settings.clearJournal
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.fullResetTitle }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mb-3", style: { color: BASE.inkFaint }, children: t.settings.fullResetNote }),
      confirmFullReset ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3 rounded-xl", style: { border: `1px solid ${LOSS}50`, background: `${LOSS}0D` }, children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 15, style: { color: LOSS } }),
        /* @__PURE__ */ jsx("span", { className: "text-xs flex-1", style: { color: BASE.ink }, children: t.settings.confirmFullReset }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          onFullReset();
          setConfirmFullReset(false);
        }, className: "text-xs shrink-0", style: { color: LOSS }, children: t.settings.yesReset }),
        /* @__PURE__ */ jsx("button", { onClick: () => setConfirmFullReset(false), className: "text-xs shrink-0", style: { color: BASE.inkFaint }, children: t.settings.cancel })
      ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setConfirmFullReset(true), className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${LOSS}50`, background: `${LOSS}0D`, color: LOSS }, children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 15 }),
        " ",
        t.settings.fullResetButton
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs break-inside-avoid", style: { color: BASE.inkFaint }, children: t.settings.footerNote })
    ] })
  ] });
}
function sanitizeImportedEntry(e, fallbackIndex) {
  if (!e || typeof e !== "object") return null;
  const date = new Date(e.date);
  if (isNaN(date.getTime())) return null;
  const exitDate = e.exitDate ? new Date(e.exitDate) : null;
  const clampCoord = (v) => typeof v === "number" && !isNaN(v) ? Math.max(0, Math.min(100, v)) : null;
  const outcome = ["Win", "Loss", "Breakeven"].includes(e.outcome) ? e.outcome : null;
  return migrateEntry({
    id: e.id != null ? String(e.id) : `imported_${Date.now()}_${fallbackIndex}_${Math.random().toString(36).slice(2, 6)}`,
    status: e.status === "open" || e.status === "closed" ? e.status : void 0,
    instrument: typeof e.instrument === "string" && e.instrument ? e.instrument : "\u2014",
    direction: e.direction === "Short" ? "Short" : "Long",
    outcome,
    r: typeof e.r === "number" && !isNaN(e.r) ? e.r : null,
    tag: typeof e.tag === "string" && e.tag ? e.tag : "\u041E\u0431\u0449\u0435\u0435",
    x: clampCoord(e.x),
    y: clampCoord(e.y),
    pull: typeof e.pull === "string" && e.pull ? e.pull : "\u2014",
    lesson: typeof e.lesson === "string" && e.lesson ? e.lesson : "\u2014",
    date,
    exitDate: !isNaN(exitDate?.getTime()) ? exitDate : null,
    screenshots: Array.isArray(e.screenshots) ? e.screenshots.filter((s) => typeof s === "string").slice(0, 4) : [],
    exitScreenshots: Array.isArray(e.exitScreenshots) ? e.exitScreenshots.filter((s) => typeof s === "string").slice(0, 4) : [],
    entryPrice: typeof e.entryPrice === "number" && !isNaN(e.entryPrice) ? e.entryPrice : null,
    exitPrice: typeof e.exitPrice === "number" && !isNaN(e.exitPrice) ? e.exitPrice : null,
    stopLoss: e.stopLoss,
    takeProfit: e.takeProfit,
    plannedRR: e.plannedRR,
    closeType: e.closeType,
    realizedRR: e.realizedRR,
    rr: typeof e.rr === "number" && !isNaN(e.rr) ? e.rr : null
  });
}
var SCHEMA_VERSION = 2;
var PROFILE_KEY = "mind-exe-journal-state";
var MEDIA_KEY = "mind-exe-journal-media";
var ANON_ID_KEY = "mind-exe-anon-id";
function getOrCreateAnonId() {
  try {
    let id = window.localStorage?.getItem(ANON_ID_KEY);
    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage?.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch (_) {
    return "anon_local";
  }
}
function migrateProfile(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (raw.version === SCHEMA_VERSION) return raw;
  if (!raw.version) {
    return {
      version: 2,
      user: { name: typeof raw.name === "string" ? raw.name : "" },
      journal: { entries: Array.isArray(raw.entries) ? raw.entries : [] },
      settings: {
        accentIndex: typeof raw.accentIndex === "number" ? raw.accentIndex : void 0,
        soundOn: typeof raw.soundOn === "boolean" ? raw.soundOn : true,
        weeklyGoal: typeof raw.weeklyGoal === "number" ? raw.weeklyGoal : 5,
        measureMode: raw.measureMode || "R",
        currency: raw.currency || "USD",
        startingCapital: typeof raw.startingCapital === "number" ? raw.startingCapital : 1e3,
        customInstruments: Array.isArray(raw.customInstruments) ? raw.customInstruments : [],
        customTags: Array.isArray(raw.customTags) ? raw.customTags : []
      },
      progress: { lastCalibration: raw.lastCalibration ?? null },
      wallet: {
        mindCoins: typeof raw.mindCoins === "number" ? raw.mindCoins : 0,
        coinLedger: Array.isArray(raw.coinLedger) ? raw.coinLedger : [],
        lastDailyReward: raw.lastDailyReward ?? null
      }
    };
  }
  return raw;
}
var __storageChain = Promise.resolve();
function queueStorage(fn) {
  const run = __storageChain.then(fn, fn);
  __storageChain = run.then(() => {
  }, () => {
  });
  return run;
}
async function withStorageRetry(fn, attempts = 4, delayMs = 150) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      const isBridgeGlitch = /unexpected response/i.test(String(e?.message || e || ""));
      if (i === attempts - 1 || !isBridgeGlitch) throw e;
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
}
var storageDegraded = false;
function markStorageDegraded(e) {
  if (/unexpected response/i.test(String(e?.message || e || ""))) storageDegraded = true;
}
async function legacyStorageGet(key, shared = false) {
  if (!window.storage || storageDegraded) return null;
  try {
    return await queueStorage(() => withStorageRetry(() => window.storage.get(key, shared)));
  } catch (e) {
    markStorageDegraded(e);
    throw e;
  }
}
async function legacyStorageSet(key, value, shared = false) {
  if (!window.storage || storageDegraded) return null;
  try {
    return await queueStorage(() => withStorageRetry(() => window.storage.set(key, value, shared)));
  } catch (e) {
    markStorageDegraded(e);
    throw e;
  }
}
async function legacyStorageDelete(key, shared = false) {
  if (!window.storage || storageDegraded) return null;
  try {
    return await queueStorage(() => withStorageRetry(() => window.storage.delete(key, shared)));
  } catch (e) {
    markStorageDegraded(e);
    throw e;
  }
}
async function storageGet(key, shared = false) {
  const ref = fsDocRef(key, shared);
  if (!ref) return null;
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { key, value: snap.data().value, shared: !!shared };
}
async function storageSet(key, value, shared = false) {
  const ref = fsDocRef(key, shared);
  if (!ref) return null;
  await setDoc(ref, { value, updatedAt: Date.now() });
  return { key, value, shared: !!shared };
}
async function storageDelete(key, shared = false) {
  const ref = fsDocRef(key, shared);
  if (!ref) return null;
  await deleteDoc(ref);
  return { key, deleted: true, shared: !!shared };
}
function profileKey(userId) {
  return `${PROFILE_KEY}:${userId}`;
}
function mediaKey(userId) {
  return `${MEDIA_KEY}:${userId}`;
}
function aiKey(userId) {
  return `mind-exe-ai:${userId}`;
}
async function loadAiState(userId) {
  if (!window.storage || !userId) return { analysis: "", chatMessages: [] };
  try {
    const res = await storageGet(aiKey(userId), false);
    return res?.value ? JSON.parse(res.value) : { analysis: "", chatMessages: [] };
  } catch (_) {
    return { analysis: "", chatMessages: [] };
  }
}
async function saveAiState(userId, aiState) {
  if (!window.storage || !userId) return;
  try {
    await storageSet(aiKey(userId), JSON.stringify(aiState), false);
  } catch (_) {
  }
}
async function loadProfile(userId) {
  if (!window.storage || !userId) return null;
  const res = await storageGet(profileKey(userId), false);
  if (!res?.value) return null;
  return migrateProfile(JSON.parse(res.value));
}
async function saveProfile(userId, profile) {
  if (!window.storage || !userId) return;
  await storageSet(profileKey(userId), JSON.stringify({ ...profile, version: SCHEMA_VERSION }), false);
}
async function loadMedia(userId) {
  if (!window.storage || !userId) return {};
  try {
    const res = await storageGet(mediaKey(userId), false);
    return res?.value ? JSON.parse(res.value) : {};
  } catch (_) {
    return {};
  }
}
async function saveMedia(userId, mediaMap) {
  if (!window.storage || !userId) return;
  try {
    await storageSet(mediaKey(userId), JSON.stringify(mediaMap), false);
  } catch (e) {
    console.warn("mind.exe: could not save screenshots (quota?)", e);
  }
}
var AUTH_USERS_KEY = "mind-exe-auth-users";
var LEGACY_CLAIMED_KEY = "mind-exe-legacy-claimed";
var LOCAL_MIGRATED_KEY = "mind-exe-local-migrated";
var USERNAME_RE = /^[a-z0-9_.-]{3,32}$/;
function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@mindexe.local`;
}
function emailToUsername(email) {
  return (email || "").split("@")[0];
}
async function findLegacyLocalUser(username) {
  try {
    const res = await legacyStorageGet(AUTH_USERS_KEY, false);
    const users = res?.value ? JSON.parse(res.value) : {};
    return users[username.trim().toLowerCase()] || null;
  } catch (_) {
    return null;
  }
}
async function migrateLocalAccountIfNeeded(uid, username) {
  try {
    const already = await storageGet(LOCAL_MIGRATED_KEY, false);
    if (already?.value) return;
    const legacyUser = await findLegacyLocalUser(username);
    if (!legacyUser) return;
    const [legacyProfile, legacyMedia] = await Promise.all([
      legacyStorageGet(profileKey(legacyUser.id), false).catch(() => null),
      legacyStorageGet(mediaKey(legacyUser.id), false).catch(() => null)
    ]);
    if (legacyProfile?.value) await storageSet(profileKey(uid), legacyProfile.value, false);
    if (legacyMedia?.value) await storageSet(mediaKey(uid), legacyMedia.value, false);
    await storageSet(LOCAL_MIGRATED_KEY, "1", false);
  } catch (e) {
    console.warn("mind.exe: local\u2192Firebase account migration skipped", e);
  }
}
function createFirebaseAuthProvider() {
  return {
    async register(username, password) {
      const uname = (username || "").trim();
      if (!USERNAME_RE.test(uname.toLowerCase())) {
        throw new Error("\u041B\u043E\u0433\u0438\u043D: 3-32 \u0441\u0438\u043C\u0432\u043E\u043B\u0430, \u043B\u0430\u0442\u0438\u043D\u0438\u0446\u0430/\u0446\u0438\u0444\u0440\u044B/._-");
      }
      if ((password || "").length < 6) {
        throw new Error("\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043E\u0442 6 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432");
      }
      const cred = await createUserWithEmailAndPassword(fbAuth, usernameToEmail(uname), password);
      await firebaseUpdateProfile(cred.user, { displayName: uname });
      await migrateLocalAccountIfNeeded(cred.user.uid, uname);
      return { id: cred.user.uid, username: uname };
    },
    async login(username, password) {
      const uname = (username || "").trim();
      const cred = await signInWithEmailAndPassword(fbAuth, usernameToEmail(uname), password);
      await migrateLocalAccountIfNeeded(cred.user.uid, uname);
      return { id: cred.user.uid, username: cred.user.displayName || emailToUsername(cred.user.email) };
    },
    async logout() {
      await firebaseSignOut(fbAuth);
    },
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(fbAuth, provider);
      const uname = cred.user.displayName || emailToUsername(cred.user.email) || `user_${cred.user.uid.slice(0, 6)}`;
      return { id: cred.user.uid, username: uname };
    },
    async getSession() {
      return new Promise((resolve) => {
        const unsub = onAuthStateChanged(fbAuth, (u) => {
          unsub();
          resolve(u ? { id: u.uid, username: u.displayName || emailToUsername(u.email) } : null);
        });
      });
    }
  };
}
function authProviderLabel() {
  const pid = fbAuth.currentUser?.providerData?.[0]?.providerId;
  if (pid === "google.com") return "google";
  if (pid === "password") return "email";
  return "\u2014";
}
var authProvider = createFirebaseAuthProvider();
var authService = {
  register: (username, password) => {
    const friendly = (e) => {
      const code = e?.code || "";
      if (code === "auth/email-already-in-use") return new Error("\u0422\u0430\u043A\u043E\u0439 \u043B\u043E\u0433\u0438\u043D \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442");
      if (code === "auth/weak-password") return new Error("\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043F\u0440\u043E\u0441\u0442\u043E\u0439 \u043F\u0430\u0440\u043E\u043B\u044C");
      return e;
    };
    return authProvider.register(username, password).catch((e) => { throw friendly(e); });
  },
  login: (username, password) => {
    const friendly = (e) => {
      const code = e?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        return new Error("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C");
      }
      return e;
    };
    return authProvider.login(username, password).catch((e) => { throw friendly(e); });
  },
  logout: () => authProvider.logout(),
  loginWithGoogle: () => {
    const friendly = (e) => {
      const code = e?.code || "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        return new Error("\u0412\u0445\u043E\u0434 \u043E\u0442\u043C\u0435\u043D\u0451\u043D");
      }
      if (code === "auth/popup-blocked") {
        return new Error("\u0411\u0440\u0430\u0443\u0437\u0435\u0440 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043B \u0432\u0441\u043F\u043B\u044B\u0432\u0430\u044E\u0449\u0435\u0435 \u043E\u043A\u043D\u043E \u2014 \u0440\u0430\u0437\u0440\u0435\u0448\u0438 \u0432\u0441\u043F\u043B\u044B\u0432\u0430\u044E\u0449\u0438\u0435 \u043E\u043A\u043D\u0430 \u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0451 \u0440\u0430\u0437");
      }
      return e;
    };
    return authProvider.loginWithGoogle().catch((e) => { throw friendly(e); });
  },
  getCurrentUser: () => authProvider.getSession()
};
async function checkLegacyDataAvailable() {
  if (!window.storage) return false;
  try {
    const claimed = await legacyStorageGet(LEGACY_CLAIMED_KEY, false);
    if (claimed?.value) return false;
    const legacy = await legacyStorageGet(PROFILE_KEY, false);
    return !!legacy?.value;
  } catch (_) {
    return false;
  }
}
async function claimLegacyData(userId) {
  if (!window.storage) return;
  try {
    const [legacyProfile, legacyMedia] = await Promise.all([
      legacyStorageGet(PROFILE_KEY, false).catch(() => null),
      legacyStorageGet(MEDIA_KEY, false).catch(() => null)
    ]);
    if (legacyProfile?.value) await storageSet(profileKey(userId), legacyProfile.value, false);
    if (legacyMedia?.value) await storageSet(mediaKey(userId), legacyMedia.value, false);
  } finally {
    try {
      await legacyStorageSet(LEGACY_CLAIMED_KEY, "1", false);
    } catch (_) {
    }
  }
}
async function skipLegacyData() {
  if (!window.storage) return;
  try {
    await legacyStorageSet(LEGACY_CLAIMED_KEY, "1", false);
  } catch (_) {
  }
}
function useAuth() {
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);
  useEffect(() => {
    let cancelled = false;
    authService.getCurrentUser().then((u) => {
      if (!cancelled) {
        setUser(u);
        setStatus(u ? "authenticated" : "unauthenticated");
      }
    }).catch(() => {
      if (!cancelled) setStatus("unauthenticated");
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const register = async (username, password) => {
    const u = await authService.register(username, password);
    setUser(u);
    setStatus("authenticated");
    return u;
  };
  const login = async (username, password) => {
    const u = await authService.login(username, password);
    setUser(u);
    setStatus("authenticated");
    return u;
  };
  const loginWithGoogle = async () => {
    const u = await authService.loginWithGoogle();
    setUser(u);
    setStatus("authenticated");
    return u;
  };
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setStatus("unauthenticated");
  };
  return { status, user, register, login, loginWithGoogle, logout };
}
function AuthScreen({ accent, onRegister, onLogin, onGoogle }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const switchMode = (m) => {
    setMode(m);
    setError("");
  };
  const submit = async () => {
    if (busy) return;
    setError("");
    if (mode === "register" && password !== confirmPassword) {
      setError("\u041F\u0430\u0440\u043E\u043B\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442");
      return;
    }
    setBusy(true);
    try {
      if (mode === "register") await onRegister(username, password);
      else await onLogin(username, password);
    } catch (e) {
      const raw = e?.message || "";
      setError(/unexpected response/i.test(raw) ? "\u0425\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u043D\u0435 \u043E\u0442\u0432\u0435\u0442\u0438\u043B\u043E \u2014 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0451 \u0440\u0430\u0437." : raw || "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A");
    } finally {
      setBusy(false);
    }
  };
  const submitGoogle = async () => {
    if (googleBusy) return;
    setError("");
    setGoogleBusy(true);
    try {
      await onGoogle();
    } catch (e) {
      setError(e?.message || "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A");
    } finally {
      setGoogleBusy(false);
    }
  };
  const disabled = busy || !username.trim() || !password || mode === "register" && !confirmPassword;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-40 flex flex-col items-center justify-center px-8", style: { background: "#040405" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "pointer-events-none fixed inset-0 overflow-hidden", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("div", { className: "cosmic-core" }),
      /* @__PURE__ */ jsx("div", { className: "cosmic-stars cosmic-stars-1" }),
      /* @__PURE__ */ jsx("div", { className: "cosmic-stars cosmic-stars-2" }),
      /* @__PURE__ */ jsx("div", { className: "cosmic-vignette" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 mb-9", children: [
        /* @__PURE__ */ jsx(LogoMark, { size: 38, accent }),
        /* @__PURE__ */ jsx(Wordmark, { accent, size: 17 })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-6 justify-center", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => switchMode("login"),
            className: "px-4 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
            style: { background: mode === "login" ? `${accent}12` : "transparent", color: mode === "login" ? accent : BASE.inkDim, border: `1px solid ${mode === "login" ? accent + "40" : BASE.line}` },
            children: "\u0412\u043E\u0439\u0442\u0438"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => switchMode("register"),
            className: "px-4 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
            style: { background: mode === "register" ? `${accent}12` : "transparent", color: mode === "register" ? accent : BASE.inkDim, border: `1px solid ${mode === "register" ? accent + "40" : BASE.line}` },
            children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Card, { accent, className: "mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-2", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children: "\u041B\u043E\u0433\u0438\u043D" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b py-2", style: { borderColor: BASE.line }, children: [
            /* @__PURE__ */ jsx(User, { size: 14, style: { color: BASE.inkFaint } }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: username,
                onChange: (e) => setUsername(e.target.value),
                placeholder: "trader01",
                autoCapitalize: "none",
                autoCorrect: "off",
                spellCheck: false,
                className: "flex-1 bg-transparent outline-none text-sm",
                style: { color: BASE.ink }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: mode === "register" ? "mb-4" : "mb-1", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-2", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children: "\u041F\u0430\u0440\u043E\u043B\u044C" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b py-2", style: { borderColor: BASE.line }, children: [
            /* @__PURE__ */ jsx(KeyRound, { size: 14, style: { color: BASE.inkFaint } }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: password,
                onChange: (e) => setPassword(e.target.value),
                type: showPw ? "text" : "password",
                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022",
                className: "flex-1 bg-transparent outline-none text-sm",
                style: { color: BASE.ink }
              }
            ),
            /* @__PURE__ */ jsx("button", { onClick: () => setShowPw((v) => !v), className: "shrink-0", type: "button", "aria-label": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C", children: showPw ? /* @__PURE__ */ jsx(EyeOff, { size: 14, style: { color: BASE.inkFaint } }) : /* @__PURE__ */ jsx(Eye, { size: 14, style: { color: BASE.inkFaint } }) })
          ] })
        ] }),
        mode === "register" && /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-2", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b py-2", style: { borderColor: BASE.line }, children: [
            /* @__PURE__ */ jsx(KeyRound, { size: 14, style: { color: BASE.inkFaint } }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
                type: showPw ? "text" : "password",
                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022",
                className: "flex-1 bg-transparent outline-none text-sm",
                style: { color: BASE.ink }
              }
            )
          ] })
        ] })
      ] }),
      error && /* @__PURE__ */ jsx("p", { className: "text-xs mb-3 text-center", style: { color: LOSS }, children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: submit,
          disabled,
          className: "w-full py-3 rounded-xl text-sm mb-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-40",
          style: { border: `1px solid ${accent}40`, background: `${accent}12`, color: accent, fontFamily: "'Space Grotesk', sans-serif" },
          children: busy ? "\u2026" : mode === "register" ? "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442" : "\u0412\u043E\u0439\u0442\u0438"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: submitGoogle,
          disabled: googleBusy,
          type: "button",
          className: "w-full py-3 rounded-xl text-sm mb-6 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-40",
          style: { border: `1px solid ${BASE.line}`, color: BASE.ink, background: BASE.surface2 },
          children: [
            /* @__PURE__ */ jsxs("svg", { width: 16, height: 16, viewBox: "0 0 48 48", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx("path", { fill: "#FFC107", d: "M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" }),
              /* @__PURE__ */ jsx("path", { fill: "#FF3D00", d: "M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z" }),
              /* @__PURE__ */ jsx("path", { fill: "#4CAF50", d: "M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.4 34.9 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z" }),
              /* @__PURE__ */ jsx("path", { fill: "#1976D2", d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.5 5.5C41.5 35.7 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z" })
            ] }),
            googleBusy ? "\u2026" : "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u0441 Google"
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-center mb-2", style: { color: BASE.inkFaint }, children: mode === "login" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "\u041D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430? ",
        /* @__PURE__ */ jsx("span", { onClick: () => switchMode("register"), className: "underline cursor-pointer", style: { color: accent }, children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        "\u0423\u0436\u0435 \u0435\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442? ",
        /* @__PURE__ */ jsx("span", { onClick: () => switchMode("login"), className: "underline cursor-pointer", style: { color: accent }, children: "\u0412\u043E\u0439\u0442\u0438" })
      ] }) }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-center", style: { color: BASE.inkFaint }, children: "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0442\u0435\u0441\u0442\u043E\u0432\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435." })
    ] })
  ] });
}
function LegacyMigratePrompt({ accent, onMigrate, onSkip }) {
  const [busy, setBusy] = useState(false);
  const run = async (fn) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-40 flex flex-col items-center justify-center px-8", style: { background: "#040405" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "pointer-events-none fixed inset-0 overflow-hidden", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("div", { className: "cosmic-core" }),
      /* @__PURE__ */ jsx("div", { className: "cosmic-stars cosmic-stars-1" }),
      /* @__PURE__ */ jsx("div", { className: "cosmic-vignette" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx(LogoMark, { size: 32, accent }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: "\u041D\u0430\u0439\u0434\u0435\u043D \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0439 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mb-8 leading-relaxed", style: { color: BASE.inkFaint }, children: "\u0414\u043D\u0435\u0432\u043D\u0438\u043A, \u043A\u043E\u0448\u0435\u043B\u0451\u043A MindCoin, streak \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438, \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435 \u0440\u0430\u043D\u044C\u0448\u0435. \u041F\u0435\u0440\u0435\u043D\u0435\u0441\u0442\u0438 \u0438\u0445 \u0432 \u043D\u043E\u0432\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442?" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => run(onMigrate),
          disabled: busy,
          className: "w-full py-3 rounded-xl text-sm mb-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-50",
          style: { border: `1px solid ${accent}40`, background: `${accent}12`, color: accent, fontFamily: "'Space Grotesk', sans-serif" },
          children: "\u041F\u0435\u0440\u0435\u043D\u0435\u0441\u0442\u0438"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => run(onSkip),
          disabled: busy,
          className: "w-full py-3 rounded-xl text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50",
          style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim },
          children: "\u041D\u0430\u0447\u0430\u0442\u044C \u0437\u0430\u043D\u043E\u0432\u043E"
        }
      )
    ] })
  ] });
}
function BootIntro({ accent, name, lang, onDone }) {
  const isEn = lang === "en";
  const lines = isEn ? [
    "> mind.exe",
    "> auth\u2026 ok",
    "> syncing journal\u2026",
    `> welcome, ${name || "operator"}`
  ] : [
    "> mind.exe",
    "> \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F\u2026 ok",
    "> \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0434\u043D\u0435\u0432\u043D\u0438\u043A\u0430\u2026",
    `> \u0434\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C, ${name || "\u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440"}`
  ];
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const lineDelay = 420;
    const holdAfter = 600;
    const totalTypeTime = lines.length * lineDelay + holdAfter;
    const fadeTimer = setTimeout(() => setFading(true), totalTypeTime);
    const doneTimer = setTimeout(() => onDone(), totalTypeTime + 480);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex flex-col items-center justify-center px-8 transition-opacity duration-500",
      style: { background: "#040405", opacity: fading ? 0 : 1 },
      children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-xs", children: lines.map((line, i) => /* @__PURE__ */ jsx(
        "p",
        {
          className: "text-sm mb-2",
          style: {
            color: i === lines.length - 1 ? accent : BASE.inkDim,
            fontFamily: "'JetBrains Mono', monospace",
            opacity: 0,
            animation: `riseIn 0.4s ease ${i * 0.42}s forwards`
          },
          children: line
        },
        i
      )) })
    }
  );
}
function DesktopSidebar({ nav, tab, setTab, accent, mindCoins, onWalletClick }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "hidden md:flex fixed left-0 top-0 bottom-0 w-[232px] flex-col px-3 pt-6 pb-5 z-20",
      style: { background: "rgba(10,10,12,0.6)", borderRight: `1px solid ${BASE.line}`, backdropFilter: "blur(10px)" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-2 mb-1", children: [
          /* @__PURE__ */ jsx(LogoMark, { size: 24, accent }),
          /* @__PURE__ */ jsx(Wordmark, { accent })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mb-6 mt-2 px-2", children: /* @__PURE__ */ jsx(WalletBadge, { balance: mindCoins, accent, onClick: onWalletClick }) }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1 flex-1", children: nav.map((n) => {
          const active = tab === n.id;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setTab(n.id),
              className: "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150",
              style: { background: active ? `${accent}12` : "transparent", border: `1px solid ${active ? accent + "35" : "transparent"}` },
              children: [
                /* @__PURE__ */ jsx(n.icon, { size: 16, strokeWidth: 2, style: { color: active ? accent : BASE.inkFaint } }),
                /* @__PURE__ */ jsx("span", { className: "text-[13px]", style: { color: active ? accent : BASE.inkDim, fontFamily: "'Space Grotesk', sans-serif" }, children: n.label })
              ]
            },
            n.id
          );
        }) })
      ]
    }
  );
}
function MindExe() {
  const [entries, setEntries] = useState(() => seedEntries.map(migrateEntry));
  const [tab, setTab] = useState("home");
  const [closingId, setClosingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [accentPreset, setAccentPreset] = useState(ACCENTS.find((a) => a.cosmic) || ACCENTS[0]);
  const [name, setName] = useState("");
  const [toast, setToast] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [lang, setLang] = useState("ru");
  const [measureMode, setMeasureMode] = useState("R");
  const [currency, setCurrency] = useState("USD");
  const [startingCapital, setStartingCapital] = useState(1e3);
  const [customInstruments, setCustomInstruments] = useState([]);
  const [customTags, setCustomTags] = useState([]);
  const [lastCalibration, setLastCalibration] = useState(null);
  const [mindCoins, setMindCoins] = useState(0);
  const [coinLedger, setCoinLedger] = useState([]);
  const [lastDailyReward, setLastDailyReward] = useState(null);
  const analytics = useMemo(() => calculateTraderAnalytics(entries, lastCalibration, lang), [entries, lastCalibration, lang]);
  const t = STRINGS[lang] || STRINGS.ru;
  const [walletOpen, setWalletOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showBootIntro, setShowBootIntro] = useState(false);
  const [introResolved, setIntroResolved] = useState(false);
  const [anonId] = useState(getOrCreateAnonId);
  const toastTimer = useRef(null);
  const firstLoadRef = useRef(true);
  const firstDailyRewardRef = useRef(true);
  const { status: authStatus, user: authUser, register: authRegister, login: authLogin, loginWithGoogle: authLoginWithGoogle, logout: authLogout } = useAuth();
  const userId = authUser?.id || null;
  const [migrateFor, setMigrateFor] = useState(null);
  const accent = accentPreset.value;
  const resetInMemoryState = () => {
    setEntries([]);
    setName("");
    setAccentPreset(ACCENTS.find((a) => a.cosmic) || ACCENTS[0]);
    setSoundOn(true);
    setWeeklyGoal(5);
    setMeasureMode("R");
    setCurrency("USD");
    setStartingCapital(1e3);
    setCustomInstruments([]);
    setCustomTags([]);
    setLastCalibration(null);
    setMindCoins(0);
    setCoinLedger([]);
    setLastDailyReward(null);
  };
  const handleRegister = async (username, password) => {
    const newUser = await authRegister(username, password);
    const hasLegacy = await checkLegacyDataAvailable();
    if (hasLegacy) setMigrateFor(newUser.id);
  };
  const handleLogin = async (username, password) => {
    await authLogin(username, password);
  };
  const handleGoogleLogin = async () => {
    const newUser = await authLoginWithGoogle();
    const hasLegacy = await checkLegacyDataAvailable();
    if (hasLegacy) setMigrateFor(newUser.id);
  };
  const handleMigrate = async () => {
    if (!migrateFor) return;
    await claimLegacyData(migrateFor);
    setMigrateFor(null);
  };
  const handleSkipMigrate = async () => {
    await skipLegacyData();
    setMigrateFor(null);
  };
  const handleLogout = async () => {
    await authLogout();
    setLoaded(false);
    setIntroResolved(false);
    setShowBootIntro(false);
    resetInMemoryState();
    setTab("home");
  };
  useEffect(() => {
    if (authStatus !== "authenticated" || !loaded || migrateFor || !userId || introResolved) return;
    setShowBootIntro(true);
    setIntroResolved(true);
  }, [authStatus, loaded, migrateFor, userId, introResolved]);
  useEffect(() => {
    const t1 = setTimeout(() => setSplashFading(true), 7200);
    const t2 = setTimeout(() => setShowSplash(false), 7700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  useEffect(() => {
    if (authStatus !== "authenticated" || !userId || migrateFor) return;
    let cancelled = false;
    let attempts = 0;
    setLoaded(false);
    resetInMemoryState();
    const tryLoad = async () => {
      if (cancelled) return;
      if (!window.storage) {
        attempts++;
        if (attempts < 20) {
          setTimeout(tryLoad, 100);
          return;
        }
        if (!cancelled) setLoaded(true);
        return;
      }
      try {
        const [profile, media] = await Promise.all([loadProfile(userId), loadMedia(userId)]);
        if (profile && !cancelled) {
          const { user = {}, journal = {}, settings = {}, progress = {}, wallet = {} } = profile;
          const rawEntries = Array.isArray(journal.entries) ? journal.entries : [];
          const restoredEntries = rawEntries.map((e) => migrateEntry({
            ...e,
            date: new Date(e.date),
            exitDate: e.exitDate ? new Date(e.exitDate) : null,
            screenshots: Array.isArray(media?.[e.id]) ? media[e.id] : Array.isArray(media?.[e.id]?.entry) ? media[e.id].entry : [],
            exitScreenshots: Array.isArray(media?.[e.id]?.exit) ? media[e.id].exit : []
          }));
          setEntries(restoredEntries);
          if (user.name !== void 0) setName(user.name);
          if (typeof settings.accentIndex === "number") setAccentPreset(ACCENTS[settings.accentIndex] || ACCENTS.find((a) => a.cosmic) || ACCENTS[0]);
          if (typeof settings.soundOn === "boolean") setSoundOn(settings.soundOn);
          if (typeof settings.weeklyGoal === "number") setWeeklyGoal(settings.weeklyGoal);
          if (settings.lang === "en" || settings.lang === "ru") setLang(settings.lang);
          if (settings.measureMode) setMeasureMode(settings.measureMode);
          if (settings.currency) setCurrency(settings.currency);
          if (typeof settings.startingCapital === "number") setStartingCapital(settings.startingCapital);
          if (Array.isArray(settings.customInstruments)) setCustomInstruments(settings.customInstruments);
          if (Array.isArray(settings.customTags)) setCustomTags(settings.customTags);
          if (progress.lastCalibration) setLastCalibration(progress.lastCalibration);
          if (typeof wallet.mindCoins === "number") setMindCoins(wallet.mindCoins);
          if (Array.isArray(wallet.coinLedger)) setCoinLedger(wallet.coinLedger);
          if (wallet.lastDailyReward) setLastDailyReward(wallet.lastDailyReward);
          if (restoredEntries.length > 0) {
            setTimeout(() => showToast("\u0414\u0430\u043D\u043D\u044B\u0435 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u044B"), firstLoadRef.current ? 7900 : 300);
          }
        }
      } catch (_) {
      } finally {
        firstLoadRef.current = false;
        if (!cancelled) setLoaded(true);
      }
    };
    tryLoad();
    return () => {
      cancelled = true;
    };
  }, [authStatus, userId, migrateFor]);
  const buildPayload = (overrides = {}) => {
    const src = { entries, name, accentIndex: ACCENTS.findIndex((a) => a.value === accentPreset.value), soundOn, weeklyGoal, lang, measureMode, currency, startingCapital, customInstruments, customTags, lastCalibration, mindCoins, coinLedger, lastDailyReward, ...overrides };
    return {
      version: SCHEMA_VERSION,
      user: { name: src.name, anonId },
      journal: {
        entries: src.entries.map(({ screenshots, ...rest }) => ({ ...rest, date: rest.date instanceof Date ? rest.date.toISOString() : rest.date, exitDate: rest.exitDate instanceof Date ? rest.exitDate.toISOString() : rest.exitDate }))
      },
      settings: {
        accentIndex: src.accentIndex,
        soundOn: src.soundOn,
        weeklyGoal: src.weeklyGoal,
        lang: src.lang,
        measureMode: src.measureMode,
        currency: src.currency,
        startingCapital: src.startingCapital,
        customInstruments: src.customInstruments,
        customTags: src.customTags
      },
      progress: { lastCalibration: src.lastCalibration },
      wallet: { mindCoins: src.mindCoins, coinLedger: src.coinLedger, lastDailyReward: src.lastDailyReward }
    };
  };
  const persistNow = async (overrides = {}) => {
    try {
      if (!window.storage || !userId) return;
      await saveProfile(userId, buildPayload(overrides));
      const srcEntries = overrides.entries ?? entries;
      const mediaMap = {};
      for (const e of srcEntries) {
        if ((Array.isArray(e.screenshots) && e.screenshots.length > 0) || (Array.isArray(e.exitScreenshots) && e.exitScreenshots.length > 0)) {
          mediaMap[e.id] = { entry: e.screenshots || [], exit: e.exitScreenshots || [] };
        }
      }
      await saveMedia(userId, mediaMap);
    } catch (_) {
    }
  };
  useEffect(() => {
    if (!loaded || authStatus !== "authenticated" || !userId) return;
    persistNow();
  }, [entries, name, accentPreset, soundOn, weeklyGoal, lang, measureMode, currency, startingCapital, customInstruments, customTags, lastCalibration, mindCoins, coinLedger, lastDailyReward, loaded, authStatus, userId]);
  useEffect(() => {
    if (!loaded || authStatus !== "authenticated" || !userId) return;
    const flush = () => {
      if (document.visibilityState === "hidden") persistNow();
    };
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("pagehide", flush);
    };
  }, [entries, name, accentPreset, soundOn, weeklyGoal, lang, measureMode, currency, startingCapital, customInstruments, customTags, lastCalibration, mindCoins, coinLedger, lastDailyReward, loaded, authStatus, userId]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const showToast = (text) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };
  const awardCoins = (amount, reason) => {
    const tx = { id: `mc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, amount, reason, date: (/* @__PURE__ */ new Date()).toISOString() };
    const nextCoins = mindCoins + amount;
    const nextLedger = [...coinLedger, tx];
    setMindCoins(nextCoins);
    setCoinLedger(nextLedger);
    persistNow({ mindCoins: nextCoins, coinLedger: nextLedger });
    return tx;
  };
  useEffect(() => {
    if (!loaded || authStatus !== "authenticated" || !userId) return;
    if (isToday(lastDailyReward)) return;
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const tx = { id: `mc_daily_${Date.now()}`, amount: 10, reason: "\u0415\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u044B\u0439 \u0432\u0445\u043E\u0434", date: nowIso };
    const nextCoins = mindCoins + 10;
    const nextLedger = [...coinLedger, tx];
    setMindCoins(nextCoins);
    setCoinLedger(nextLedger);
    setLastDailyReward(nowIso);
    persistNow({ mindCoins: nextCoins, coinLedger: nextLedger, lastDailyReward: nowIso });
    setTimeout(() => showToast("+10 MindCoin \u2014 \u0432\u0445\u043E\u0434 \u0437\u0430 \u0434\u0435\u043D\u044C"), firstDailyRewardRef.current ? 10300 : 400);
    firstDailyRewardRef.current = false;
  }, [loaded, authStatus, userId]);
  const playPing = () => {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.setValueAtTime(1e-4, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + 0.35);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.35);
    } catch (_) {
    }
  };
  const deleteEntry = (id) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    persistNow({ entries: next });
    showToast("\u0417\u0430\u043F\u0438\u0441\u044C \u0443\u0434\u0430\u043B\u0435\u043D\u0430");
  };
  const exportJournal = () => {
    try {
      const data = entries.map((e) => ({ ...e, date: e.date.toISOString(), exitDate: e.exitDate instanceof Date ? e.exitDate.toISOString() : e.exitDate }));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mind-exe-journal.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("\u0416\u0443\u0440\u043D\u0430\u043B \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D");
    } catch (_) {
      showToast("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C");
    }
  };
  const importJournal = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result);
        if (!Array.isArray(raw)) throw new Error("not an array");
        const restored = raw.map(sanitizeImportedEntry).filter(Boolean);
        if (restored.length === 0 && raw.length > 0) throw new Error("nothing salvageable");
        setEntries(restored);
        persistNow({ entries: restored });
        showToast(restored.length < raw.length ? `\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E ${restored.length} \u0438\u0437 ${raw.length} \u2014 \u0447\u0430\u0441\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u043F\u043E\u0432\u0440\u0435\u0436\u0434\u0435\u043D\u0430` : `\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u0437\u0430\u043F\u0438\u0441\u0435\u0439: ${restored.length}`);
      } catch (_) {
        showToast("\u0424\u0430\u0439\u043B \u043F\u043E\u0432\u0440\u0435\u0436\u0434\u0451\u043D \u0438\u043B\u0438 \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442");
      }
    };
    reader.readAsText(file);
  };
  const exportFullBackup = () => {
    try {
      const payload = buildPayload();
      payload.journal.entries = entries.map((e) => ({ ...e, date: e.date instanceof Date ? e.date.toISOString() : e.date, exitDate: e.exitDate instanceof Date ? e.exitDate.toISOString() : e.exitDate }));
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mind-exe-backup.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("\u041F\u043E\u043B\u043D\u044B\u0439 \u0431\u044D\u043A\u0430\u043F \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D");
    } catch (_) {
      showToast("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0431\u044D\u043A\u0430\u043F");
    }
  };
  const importFullBackup = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result);
        const profile = migrateProfile(raw);
        if (!profile) throw new Error("unrecognized backup format");
        const { user = {}, journal = {}, settings = {}, progress = {}, wallet = {} } = profile;
        const restoredEntries = (Array.isArray(journal.entries) ? journal.entries : []).map(sanitizeImportedEntry).filter(Boolean);
        setEntries(restoredEntries);
        if (user.name !== void 0) setName(user.name);
        if (typeof settings.accentIndex === "number") setAccentPreset(ACCENTS[settings.accentIndex] || ACCENTS.find((a) => a.cosmic) || ACCENTS[0]);
        if (typeof settings.soundOn === "boolean") setSoundOn(settings.soundOn);
        if (typeof settings.weeklyGoal === "number") setWeeklyGoal(settings.weeklyGoal);
        if (settings.lang === "en" || settings.lang === "ru") setLang(settings.lang);
        if (settings.measureMode) setMeasureMode(settings.measureMode);
        if (settings.currency) setCurrency(settings.currency);
        if (typeof settings.startingCapital === "number") setStartingCapital(settings.startingCapital);
        if (Array.isArray(settings.customInstruments)) setCustomInstruments(settings.customInstruments);
        if (Array.isArray(settings.customTags)) setCustomTags(settings.customTags);
        if (progress.lastCalibration) setLastCalibration(progress.lastCalibration);
        if (typeof wallet.mindCoins === "number") setMindCoins(wallet.mindCoins);
        if (Array.isArray(wallet.coinLedger)) setCoinLedger(wallet.coinLedger);
        if (wallet.lastDailyReward) setLastDailyReward(wallet.lastDailyReward);
        persistNow({
          entries: restoredEntries,
          name: user.name ?? name,
          accentIndex: typeof settings.accentIndex === "number" ? settings.accentIndex : ACCENTS.findIndex((a) => a.value === accentPreset.value),
          soundOn: settings.soundOn ?? soundOn,
          weeklyGoal: settings.weeklyGoal ?? weeklyGoal,
          lang: settings.lang ?? lang,
          measureMode: settings.measureMode ?? measureMode,
          currency: settings.currency ?? currency,
          startingCapital: settings.startingCapital ?? startingCapital,
          customInstruments: settings.customInstruments ?? customInstruments,
          customTags: settings.customTags ?? customTags,
          lastCalibration: progress.lastCalibration ?? lastCalibration,
          mindCoins: wallet.mindCoins ?? mindCoins,
          coinLedger: wallet.coinLedger ?? coinLedger,
          lastDailyReward: wallet.lastDailyReward ?? lastDailyReward
        });
        showToast("\u0411\u044D\u043A\u0430\u043F \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D");
      } catch (_) {
        showToast("\u0424\u0430\u0439\u043B \u043F\u043E\u0432\u0440\u0435\u0436\u0434\u0451\u043D \u0438\u043B\u0438 \u044D\u0442\u043E \u043D\u0435 \u0431\u044D\u043A\u0430\u043F mind.exe");
      }
    };
    reader.readAsText(file);
  };
  const resetJournal = () => {
    setEntries([]);
    persistNow({ entries: [] });
    showToast("\u0416\u0443\u0440\u043D\u0430\u043B \u043E\u0447\u0438\u0449\u0435\u043D");
  };
  const resetEverything = () => {
    const cosmicIndex = ACCENTS.findIndex((a) => a.cosmic);
    const defaults = {
      entries: [],
      name: "",
      accentIndex: cosmicIndex >= 0 ? cosmicIndex : 0,
      soundOn: true,
      weeklyGoal: 5,
      lang: "ru",
      measureMode: "R",
      currency: "USD",
      startingCapital: 1e3,
      customInstruments: [],
      customTags: [],
      lastCalibration: null,
      mindCoins: 0,
      coinLedger: [],
      lastDailyReward: null
    };
    setEntries([]);
    setName("");
    setAccentPreset(ACCENTS.find((a) => a.cosmic) || ACCENTS[0]);
    setSoundOn(true);
    setWeeklyGoal(5);
    setLang("ru");
    setMeasureMode("R");
    setCurrency("USD");
    setStartingCapital(1e3);
    setCustomInstruments([]);
    setCustomTags([]);
    setLastCalibration(null);
    setMindCoins(0);
    setCoinLedger([]);
    setLastDailyReward(null);
    persistNow(defaults);
    showToast("\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u043E");
  };
  const addCustomInstrument = (v) => setCustomInstruments((prev) => prev.some((x) => x.toLowerCase() === v.toLowerCase()) ? prev : [v, ...prev]);
  const addCustomTag = (v) => setCustomTags((prev) => prev.some((x) => x.toLowerCase() === v.toLowerCase()) ? prev : [v, ...prev]);
  const nav = [
    { id: "home", label: t.nav.home, icon: Sparkles },
    { id: "new", label: t.nav.new, icon: BookOpen },
    { id: "log", label: t.nav.log, icon: NotebookText },
    { id: "patterns", label: t.nav.patterns, icon: LineChartIcon },
    { id: "challenge", label: t.nav.challenge, icon: Flame },
    { id: "coach", label: t.nav.coach, icon: Bot },
    { id: "settings", label: t.nav.settings, icon: SettingsIcon }
  ];
  const activeIndex = Math.max(0, nav.findIndex((n) => n.id === tab));
  const wideTab = ["home", "log", "patterns"].includes(tab);
  const formTab = ["new", "edit", "close"].includes(tab);
  const contentMaxWidth = wideTab ? "md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl" : formTab ? "md:max-w-3xl lg:max-w-4xl xl:max-w-5xl" : "md:max-w-2xl lg:max-w-4xl xl:max-w-5xl";
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen w-full relative theme-fade${accentPreset.cosmic ? " cosmic-theme" : ""}`, style: { background: accentPreset.cosmic ? "#040405" : BASE.bg, fontFamily: "'Inter', sans-serif" }, children: [
    /* @__PURE__ */ jsx("style", { children: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes logoPulseFade { 0%, 100% { opacity: 0.35; transform: scale(0.94); } 50% { opacity: 1; transform: scale(1.04); } }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, -6px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes ripple { from { width: 14px; height: 14px; opacity: 0.6; } to { width: 32px; height: 32px; opacity: 0; } }
        @keyframes drawMark { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes dotIn { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flicker { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }

        /* ---------- Splash v3: a real photo behind a radar-ringed logo intro. The photo itself can't
           be per-pixel animated the way the old canvas render was, so "alive" comes from a few cheap
           layers instead: a slow Ken Burns zoom (with extra overscan margin so cover-cropping never
           shows a hard photo edge), and \u2014 the actual motion \u2014 a shimmer sweep masked by the photo's
           own brightness (SPLASH_BLACKHOLE_MASK, a luminance-derived alpha map baked from this exact
           image). That mask is what makes this reliable across devices: earlier attempts hand-guessed
           an ellipse to trace the ring's position and it drifted off onto the dark disk on other
           screen sizes. Masking by the photo's actual brightness makes that impossible \u2014 the sweep is
           gated by the same pixels regardless of viewport, so it can only ever brighten where the ring
           already is. Rotating the whole photo was deliberately avoided too: the ring is drawn in
           perspective (foreshortened, gravitationally lensed), so spinning the flat image would swing
           the light-bending arcs into physically wrong positions and break the illusion rather than
           sell it. ---------- */
        .splash2-root { background: #000; overflow: hidden; }
        @keyframes splash2RiseFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes splash2RingExpand { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        @keyframes splash2KenBurns { from { transform: scale(1.0); } to { transform: scale(1.06); } }
        @keyframes splash2Shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

        .splash2-bh-scene { position: absolute; inset: 0; height: 62%; overflow: hidden; }
        .splash2-bh-img {
          width: 100%; height: 100%; object-fit: cover; object-position: 51% 48%; display: block;
          animation: splash2KenBurns 26s ease-in-out infinite alternate;
        }
        /* Same Ken Burns animation as the photo (so the mask never drifts out of registration while
           zooming) plus a slow diagonal sweep. mask-image/-webkit-mask-image use the alpha channel of
           SPLASH_BLACKHOLE_MASK directly \u2014 no mask-mode needed, so this works on older Safari too. */
        .splash2-bh-shimmer {
          position: absolute; inset: 0; pointer-events: none; mix-blend-mode: screen;
          background-image: linear-gradient(115deg, transparent 34%, rgba(255,250,235,0.95) 49%, rgba(255,250,235,0.95) 51%, transparent 66%);
          background-size: 300% 300%;
          -webkit-mask-image: url(${SPLASH_BLACKHOLE_MASK}); mask-image: url(${SPLASH_BLACKHOLE_MASK});
          -webkit-mask-size: cover; mask-size: cover;
          -webkit-mask-position: 51% 48%; mask-position: 51% 48%;
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          animation: splash2KenBurns 26s ease-in-out infinite alternate, splash2Shimmer 7s ease-in-out infinite;
        }
        .splash2-vignette {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 75% 60% at 50% 28%, transparent 22%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.85) 100%),
            linear-gradient(to right, rgba(0,0,0,0.75), transparent 18%, transparent 82%, rgba(0,0,0,0.75)),
            linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 16%, transparent 36%, rgba(0,0,0,0.92) 58%, #000 68%);
        }

        .splash2-content { position: absolute; left: 0; right: 0; bottom: 15%; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .splash2-radar { position: relative; width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; }
        .splash2-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,0.14); animation: splash2RingExpand 1.1s ease-out both; }
        .splash2-ring.ring-a { inset: 16%; animation-delay: 0.15s; }
        .splash2-ring.ring-b { inset: 0; border-color: rgba(255,255,255,0.07); animation-delay: 0.35s; }
        .splash2-crosshair { position: absolute; background: rgba(255,255,255,0.09); opacity: 0; animation: splash2RiseFade 0.6s ease-out 0.6s forwards; }
        .splash2-crosshair.ch-h { left: -12px; right: -12px; top: 50%; height: 1px; }
        .splash2-crosshair.ch-v { top: -12px; bottom: -12px; left: 50%; width: 1px; }
        .splash2-node { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.5); opacity: 0; animation: splash2RiseFade 0.5s ease-out forwards; }
        .splash2-node.node-1 { top: 8%; left: 20%; animation-delay: 0.75s; }
        .splash2-node.node-2 { top: 28%; right: 2%; animation-delay: 0.9s; }
        .splash2-node.node-3 { bottom: 12%; left: 6%; animation-delay: 1.05s; }
        .splash2-divider { width: 26px; height: 1px; background: rgba(255,255,255,0.25); opacity: 0; animation: splash2RiseFade 0.5s ease-out 2.1s forwards; }
        .splash2-tagline { font-size: 12px; letter-spacing: 0.05em; color: #6B6B70; opacity: 0; animation: splash2RiseFade 0.7s ease-out 2.35s forwards; }
        .splash2-dots { display: flex; align-items: center; gap: 6px; opacity: 0; animation: splash2RiseFade 0.6s ease-out 2.55s forwards; }
        .splash2-dots-line { width: 26px; height: 1px; background: rgba(255,255,255,0.14); }
        .splash2-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.25); }
        .splash2-dot.active { width: 7px; height: 7px; background: #FFFFFF; box-shadow: 0 0 6px rgba(255,255,255,0.55); }

        /* ---------- Cosmic theme: quiet dark atmosphere \u2014 soft ambient light and stars, not a literal black hole ---------- */
        @keyframes horizonBreathe { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.03); } }
        @keyframes cosmicTwinkle { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.4; } }
        .cosmic-core {
          position: absolute; width: 100vw; height: 100vw; right: -40vw; bottom: -46vw; border-radius: 50%;
          background: radial-gradient(circle at 38% 38%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 32%, transparent 55%);
          filter: blur(8px);
          animation: horizonBreathe 12s ease-in-out infinite;
        }
        .cosmic-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 95% 75% at 0% 0%, rgba(0,0,0,0.5) 0%, transparent 55%);
        }
        .cosmic-stars {
          position: absolute; inset: -15%;
          background-image:
            radial-gradient(1.3px 1.3px at 8% 12%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 22% 38%, rgba(255,255,255,0.55), transparent),
            radial-gradient(1.2px 1.2px at 38% 8%, rgba(255,255,255,0.65), transparent),
            radial-gradient(1px 1px at 52% 52%, rgba(255,255,255,0.45), transparent),
            radial-gradient(1.3px 1.3px at 66% 24%, rgba(255,255,255,0.75), transparent),
            radial-gradient(1px 1px at 78% 62%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1.2px 1.2px at 88% 14%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 12% 78%, rgba(255,255,255,0.45), transparent),
            radial-gradient(1.3px 1.3px at 46% 86%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 94% 88%, rgba(255,255,255,0.5), transparent);
          background-repeat: repeat;
          background-size: 420px 420px;
        }
        .cosmic-stars-1 { opacity: 0.35; animation: cosmicTwinkle 6s ease-in-out infinite; }
        .cosmic-stars-2 { background-size: 560px 560px; opacity: 0.22; animation: cosmicTwinkle 9s ease-in-out infinite 1.4s; }
        /* buttons/cards read as a layer floating above the void, not flush with it */
        .cosmic-theme .rounded-2xl { box-shadow: 0 16px 36px -10px rgba(0,0,0,0.7), 0 2px 10px -2px rgba(0,0,0,0.5); }
        .cosmic-theme .rounded-xl { box-shadow: 0 10px 22px -8px rgba(0,0,0,0.6); }
        .cosmic-theme .rounded-full { box-shadow: 0 3px 10px -3px rgba(0,0,0,0.5); }
        .cosmic-theme button:active { transform: translateY(1px); }

        .tab-content { animation: fadeIn 0.25s ease-out; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .toast-in { animation: toastIn 0.2s ease-out; }
        .emotion-ripple { animation: ripple 0.5s ease-out; }
        .flame-flicker { animation: flicker 1.8s ease-in-out infinite; display: inline-block; }
        .theme-fade, .theme-fade * { transition: background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease; }
        .stagger > * { animation: fadeIn 0.45s ease-out both; }
        .stagger > *:nth-child(1) { animation-delay: 0ms; }
        .stagger > *:nth-child(2) { animation-delay: 60ms; }
        .stagger > *:nth-child(3) { animation-delay: 120ms; }
        .stagger > *:nth-child(4) { animation-delay: 180ms; }
        .stagger > *:nth-child(5) { animation-delay: 240ms; }
        .stagger > *:nth-child(6) { animation-delay: 300ms; }
      ` }),
    showSplash && /* @__PURE__ */ jsx(Splash, { accent, fading: splashFading }),
    !showSplash && authStatus === "unauthenticated" && /* @__PURE__ */ jsx(AuthScreen, { accent, onRegister: handleRegister, onLogin: handleLogin, onGoogle: handleGoogleLogin }),
    !showSplash && authStatus === "authenticated" && migrateFor && /* @__PURE__ */ jsx(LegacyMigratePrompt, { accent, onMigrate: handleMigrate, onSkip: handleSkipMigrate }),
    !showSplash && authStatus === "authenticated" && !migrateFor && showBootIntro && /* @__PURE__ */ jsx(BootIntro, { accent, name, lang, onDone: () => setShowBootIntro(false) }),
    !showSplash && authStatus === "authenticated" && !migrateFor && introResolved && !showBootIntro && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed inset-0", style: { background: `radial-gradient(circle at 50% 0%, ${accent}0A 0%, transparent 55%)`, transition: "background 0.4s ease" } }),
      accentPreset.cosmic && /* @__PURE__ */ jsxs("div", { className: "pointer-events-none fixed inset-0 overflow-hidden", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("div", { className: "cosmic-core" }),
        /* @__PURE__ */ jsx("div", { className: "cosmic-stars cosmic-stars-1" }),
        /* @__PURE__ */ jsx("div", { className: "cosmic-stars cosmic-stars-2" }),
        /* @__PURE__ */ jsx("div", { className: "cosmic-vignette" })
      ] }),
      /* @__PURE__ */ jsx(Toast, { text: toast }),
      /* @__PURE__ */ jsx(WalletSheet, { open: walletOpen, onClose: () => setWalletOpen(false), balance: mindCoins, ledger: coinLedger, accent }),
      /* @__PURE__ */ jsx(DesktopSidebar, { nav, tab, setTab, accent, mindCoins, onWalletClick: () => setWalletOpen(true) }),
      /* @__PURE__ */ jsx("div", { className: "md:ml-[232px] md:flex md:justify-center", children: /* @__PURE__ */ jsxs("div", { className: `max-w-md ${contentMaxWidth} w-full mx-auto md:mx-0 px-5 md:px-10 pt-8 md:pt-10 pb-32 md:pb-16 relative`, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 items-center mb-3 md:hidden", children: [
          /* @__PURE__ */ jsx("div", {}),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx(LogoMark, { size: 24, accent }),
            /* @__PURE__ */ jsx(Wordmark, { accent })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(WalletBadge, { balance: mindCoins, accent, onClick: () => setWalletOpen(true) }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-8", style: { width: "44px", height: "2px", background: `linear-gradient(90deg, transparent, ${accent}90, transparent)` } }),
        /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
          tab === "home" && /* @__PURE__ */ jsx(Home, { entries, goTo: setTab, accent, name, measureMode, currency, startingCapital, lastCalibration, analytics, t, lang }),
          tab === "new" && /* @__PURE__ */ jsx(
            NewEntry,
            {
              accent,
              measureMode,
              currency,
              customInstruments,
              customTags,
              onAddCustomInstrument: addCustomInstrument,
              onAddCustomTag: addCustomTag,
              notify: showToast,
              t,
              onSave: (e) => {
                const next = [...entries, e];
                setEntries(next);
                persistNow({ entries: next });
                showToast("\u0417\u0430\u043F\u0438\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430");
                playPing();
                setTab("log");
              }
            }
          ),
          tab === "log" && /* @__PURE__ */ jsx(Log, { entries, accent, onDelete: deleteEntry, onCloseTrade: (id) => {
            setClosingId(id);
            setTab("close");
          }, onEditTrade: (id) => {
            setEditingId(id);
            setTab("edit");
          }, measureMode, currency, t }),
          tab === "close" && /* @__PURE__ */ jsx(CloseTrade, {
            entry: entries.find((e) => e.id === closingId) || null,
            accent,
            measureMode,
            currency,
            t,
            notify: showToast,
            onCancel: () => {
              setClosingId(null);
              setTab("log");
            },
            onSave: (patch) => {
              const next = entries.map((e) => e.id === closingId ? { ...e, ...patch } : e);
              setEntries(next);
              persistNow({ entries: next });
              showToast("\u0421\u0434\u0435\u043B\u043A\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u0430");
              playPing();
              setClosingId(null);
              setTab("log");
            }
          }),
          tab === "edit" && /* @__PURE__ */ jsx(EditTrade, {
            entry: entries.find((e) => e.id === editingId) || null,
            accent,
            measureMode,
            currency,
            customInstruments,
            customTags,
            onAddCustomInstrument: addCustomInstrument,
            onAddCustomTag: addCustomTag,
            notify: showToast,
            t,
            onCancel: () => {
              setEditingId(null);
              setTab("log");
            },
            onSave: (patch) => {
              const next = entries.map((e) => e.id === editingId ? { ...e, ...patch } : e);
              setEntries(next);
              persistNow({ entries: next });
              showToast("\u0421\u0434\u0435\u043B\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430");
              setEditingId(null);
              setTab("log");
            }
          }),
          tab === "patterns" && /* @__PURE__ */ jsx(Patterns, { entries, accent, measureMode, currency, analytics, t, lang }),
          tab === "calibration" && /* @__PURE__ */ jsx(Calibration, { accent, onComplete: setLastCalibration, lang, t }),
          tab === "simulator" && /* @__PURE__ */ jsx(Simulator, { accent, onWin: () => {
            awardCoins(5, lang === "en" ? "Win in the game" : "\u041F\u043E\u0431\u0435\u0434\u0430 \u0432 \u0438\u0433\u0440\u0435");
            showToast(lang === "en" ? "+5 MindCoin \u2014 win in the game" : "+5 MindCoin \u2014 \u043F\u043E\u0431\u0435\u0434\u0430 \u0432 \u0438\u0433\u0440\u0435");
          }, t, lang }),
          tab === "challenge" && /* @__PURE__ */ jsx(Challenge, { entries, accent, weeklyGoal, t, lang }),
          tab === "coach" && /* @__PURE__ */ jsx(Coach, { entries, analytics, accent, userId, lang, t }),
          tab === "settings" && /* @__PURE__ */ jsx(
            Settings,
            {
              accent,
              setAccent: setAccentPreset,
              name,
              setName,
              onThemeChange: (n) => showToast(`\u0422\u0435\u043C\u0430: ${n}`),
              soundOn,
              setSoundOn,
              weeklyGoal,
              setWeeklyGoal,
              onExport: exportJournal,
              onImport: importJournal,
              onExportBackup: exportFullBackup,
              onImportBackup: importFullBackup,
              onReset: resetJournal,
              onFullReset: resetEverything,
              measureMode,
              setMeasureMode,
              currency,
              setCurrency,
              startingCapital,
              setStartingCapital,
              username: authUser?.username,
              accountProvider: authProviderLabel(),
              onLogout: handleLogout,
              lang,
              setLang,
              t
            }
          )
        ] }, tab)
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 flex justify-center pb-6 px-3 md:hidden", children: /* @__PURE__ */ jsx("div", { className: "max-w-md w-full rounded-[22px] overflow-hidden", style: { background: "rgba(19,19,21,0.94)", border: `1px solid ${BASE.line}`, backdropFilter: "blur(10px)" }, children: /* @__PURE__ */ jsxs("div", { className: "relative grid grid-cols-7 m-1", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute top-0 bottom-0 rounded-2xl transition-all duration-300 ease-out",
            style: { left: `calc(${activeIndex} * (100% / 7) + 3px)`, width: `calc(100% / 7 - 6px)`, background: `${accent}12`, border: `1px solid ${accent}35` }
          }
        ),
        nav.map((n) => {
          const active = tab === n.id;
          return /* @__PURE__ */ jsxs("button", { onClick: () => setTab(n.id), className: "relative z-10 flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl min-w-0 transition-transform duration-150 active:scale-90", children: [
            /* @__PURE__ */ jsx(n.icon, { size: 16, strokeWidth: 2, style: { color: active ? accent : BASE.inkFaint, transition: "color 0.25s ease" } }),
            /* @__PURE__ */ jsx("span", { className: "text-[8px] leading-none max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-0.5", style: { color: active ? accent : BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif", transition: "color 0.25s ease" }, children: n.label })
          ] }, n.id);
        })
      ] }) }) })
    ] })
  ] });
}

// entry.jsx
import { jsx as jsx2 } from "react/jsx-runtime";
createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsx2(MindExe, {}));
