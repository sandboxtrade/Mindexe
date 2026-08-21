// mind.exe V1.2 — boot intro now plays on every app entry (page load / fresh session, including when Firebase session persists and skips the login screen), not just the very first-ever login
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
import { getFunctions, httpsCallable } from "firebase/functions";
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
var fbFunctions = getFunctions(firebaseApp, "europe-west1");
var aiAnalyzeCallable = httpsCallable(fbFunctions, "aiAnalyze");
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
  Send
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
    nav: { home: "\u0418\u0418", new: "\u0414\u043D\u0435\u0432\u043D\u0438\u043A", log: "\u0417\u0430\u043C\u0435\u0442\u043A\u0438", patterns: "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430", simulator: "\u0418\u0433\u0440\u0430", challenge: "\u0427\u0435\u043B\u043B\u0435\u043D\u0434\u0436", coach: "\u041A\u043E\u0443\u0447", settings: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" },
    coach: {
      title: "\u0418\u0418-\u043A\u043E\u0443\u0447",
      analyzeTitle: "\u0410\u043D\u0430\u043B\u0438\u0437 \u0434\u043D\u0435\u0432\u043D\u0438\u043A\u0430",
      analyzeBtn: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
      analyzeBusy: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E\u2026",
      analyzeEmpty: "\u041D\u0430\u0436\u043C\u0438 \u00AB\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u00BB, \u0447\u0442\u043E\u0431\u044B \u0418\u0418 \u0440\u0430\u0437\u043E\u0431\u0440\u0430\u043B \u0442\u0432\u043E\u0439 \u0434\u043D\u0435\u0432\u043D\u0438\u043A.",
      analyzeNoEntries: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u043E\u0431\u0430\u0432\u044C \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0432 \u0434\u043D\u0435\u0432\u043D\u0438\u043A.",
      chatTitle: "\u0421\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u043A\u043E\u0443\u0447\u0430",
      chatPlaceholder: "\u041D\u0430\u043F\u0438\u0448\u0438 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435\u2026",
      chatEmpty: "\u0421\u043F\u0440\u043E\u0441\u0438 \u043F\u0440\u043E \u0441\u0432\u043E\u0438 \u0441\u0434\u0435\u043B\u043A\u0438, \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u044B \u0438\u043B\u0438 \u043F\u0441\u0438\u0445\u043E\u043B\u043E\u0433\u0438\u044E \u0442\u043E\u0440\u0433\u043E\u0432\u043B\u0438.",
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
    nav: { home: "AI", new: "Journal", log: "Notes", patterns: "Analytics", simulator: "Game", challenge: "Challenge", coach: "Coach", settings: "Settings" },
    coach: {
      title: "AI Coach",
      analyzeTitle: "Journal analysis",
      analyzeBtn: "Analyze",
      analyzeBusy: "Analyzing\u2026",
      analyzeEmpty: "Tap \"Analyze\" to have AI review your journal.",
      analyzeNoEntries: "Add a few journal entries first.",
      chatTitle: "Ask the coach",
      chatPlaceholder: "Type a message\u2026",
      chatEmpty: "Ask about your trades, patterns, or trading psychology.",
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
function Wordmark({ accent, size = 15, animated = false, wide = false }) {
  return /* @__PURE__ */ jsxs("span", { className: "flex items-baseline", style: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: size, letterSpacing: wide ? "0.28em" : void 0, color: BASE.ink, animation: animated ? "riseIn 0.5s ease 1.55s backwards" : void 0 }, children: [
    "mind",
    /* @__PURE__ */ jsxs("span", { className: "relative", style: { color: accent }, children: [
      ".exe",
      /* @__PURE__ */ jsx("span", { className: "absolute left-0 -bottom-[3px] w-full h-px", style: { background: `repeating-linear-gradient(90deg, ${accent} 0, ${accent} 3px, transparent 3px, transparent 6px)` } })
    ] })
  ] });
}
var SPLASH_BLACKHOLE_IMG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wAARCARxAoADASIAAhEBAxEB/8QAHAABAQEBAQEBAQEAAAAAAAAAAAECAwQFBgcI/8QARRAAAgIBAwMCBAQDBgQFAgYDAAECEQMEITEFEkFRYQYTInEygZGhFEKxByMzUsHRFWJy4SRDgpLwFlM0NkSisvFjk8L/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EACMRAQEBAQACAwEAAgMBAAAAAAABEQISITFBUQMicRMyYUL/2gAMAwEAAhEDEQA/AP8AKgBQAAYAAAAAAAAEKQrSXkAKBQIwGOAAB00zwrNH+IWR4r+pY2lKvawOQL5IBSAtuqt0uEAt1XgEAFAAAAgFIABSAoEKQoAAAACAUAAACAAUgFAIABQAAIAKQACggAFAEKQAUeCF4AAva1Hu8N0ZAApAKQoAEKQCkKAIAAKCFAAgApCgCAFAhSFAEKQCggAoCAAAAQvghQCW1g0rlx4W5kAPBU/K5Epyn+Jt0qAgBABSACghQBCkApCgAQFAgBQAIUACFAEKAAAAhSFAAAAQpAAKABAUCAFAgAAoBAKCAAUDwABCgCFAFnNzabq0ktkkQAAAABAAKQFAEKAIUAAQoqwIUtehKAAEAFIABSFAEKAAAAAgAFIAOmLLLFkjkjXdFpq0n+z2MN3yEwAvYAACFAEBQABCgQoIBSFIBQQAACgAAAAAAAAAQACgAAAABAAKQACggFBABSFAAAgAoAAAAAABAUgFIUgFAAAhQAAHkAWrFFrYCAFStX4KJQSo1ySgLwZfBW6JdgQhQQAQoCggABCgAAQCgACFIaU2ouPh7vYCAeAAAAAhSAAAAKJJKTSdr1AEBSy7e59t9vi+QICFAAvfJR7O59t3V7WQAAAAAAAEAoBAKQpAAKQCgAAQq38lkkpNJ2r2fqBkoAAAgAG55HkjBNRXYu1Uqve9/UwBQQAUhQAAAAEKAAAAAAAAAA5AAApREVLcqj5oqV7gKI7bNVtfgKNhEjFebNv6nfCRKSI3YVX5SI6SHHBOQI9ycIr4MsAQoIIAAKAAIUEApC+CAUhQA2rzYIUCAFAEKAAAAhSACggAvL3IABQCAUhSAUAgFBCgAAwBAUAAAABABQQCghYtKSck3G90gICkAFIAABQAAAAACApAKEAAYAooFO+m0eTUwzSxqLWHG8krklUU0vL35Wy3OLVMIyDVChggNV5ZKAUFdlqkaxwtlFUdhRurJarbkDNXsG64DltRjhAaS5EpLhGW29kVQsgn3Hj2Nukvc5SdhRsMEsAQrIQCkKBCgACFAHT5y/hvk/Kx3393zKffxVXdV54OQAFIUgFBAAKQoEKCAU6ZszyrH9EI9kVH6Y1deX6s5kAAFAEKAICkAAFAgKAIUsvG6e3ggEN5FBdvZJyuKcrVU/QyQCjwBewAEO38Nn/hv4n5WT5Hf8v5nb9PdV1frW4HIMBgJJxbT5C3BAKQoAgAArdkBqceyTj3KVOrXDAyUhQAAAAAAAAAAKAAAoAA0nSJyxYRUEdHGjKRucov8Ma2W12Bhv0CTZYQ7mdUktkUY7DaSit2L3szLkgNtozdCUtqMW3sBW6JTfsajD15F7gElFDu8/sK7tiP+gGZO2TkMAPBACKgKQgGrdVbrmjJUgAK002mqoyBSAte4AAACFIAAAAAoELTq/AIAAAAFIAALSrncCFIABUQoHfVaSWmjgcp4pfOxrKvl5FLtTbVSrh7cPfg4CwAAIABQAAAAtvtq3XJAAHsPsAIUAAH7AAAKAEBQAohXx4AAAAE2uAAAABQsAoDkICwgwkC0UDQpE+wGvJYRc3SEYWjvh7Y7lCbWOKhBNJpd292zFUrNT3k2Y5YAzJ2ba2M0gM9pWkkWklbqgl3eKRBjxbEV5NSaTrlI5uS8AalKkY7mOWGBGRlZCKAAgEK/uQAUDwAIUAAAAAAEBSAUEAFICgQqezVLfz6AAGkns7ICgKdWuAvuLZAALJpu0qIBQQtgQFIBQAAABQABAAAABAAACgACBTQD524DdlFkkns729CAEAAAL24/MAAAAUKp16FAACgWhgyUFoqBKNUby45wklkTT7U0mvDVr9hgwkaqkEqC3AjZqKFC6KNOVfSjpjVLfY544OTtnWaSSSAkt5Ptdq9mIwpWajCqRpxpegHOW+yMPZ0bk0uODFqwCi2JypUvBlt1Zl7gZbMmmSyAQWPJAYIAoByABACAUhQAAAEKQAAAKAAIUgAFIAKAnSa9SAUAACFIAKotq/HFhVavgNpvZUvAAgKBAUAAEAAAsoApAAAAAuxCBRqUJQScoyXcrVrlepm6OmXUZs6gsuXJNY4qEFKTfbHml6Ld7e5RzAADwACAALAAhUBRbqvA2HJRPIBUgCTd+xUm3RUQqIXwVR7nSJRVVFqvIXBq0EZSKkyrgqQEKkQ3CDk6AlEjDumk3Sfn0O/yqT3Vrx6moY/NAFCnS4Dhujr281uEu6T4Tf7EBRjGDtvvvb0RwnK3Uf1OmTtjBfVcnyvQ4OaoCSdsw5egbMeQK3v6Esj2I3sAb3IxyWgM7lFBqiKc8WTwVNp2nT9iySil6sDIYBBAUgAFIBQCtOu7xwBkAqAAEAoAAEAApCgCAACgIgApCgAABU3HdEAA66fJhx/M+bh+b3QcY/U49kvEtua9DkwAAAKAAAApAAAoAGUgAAUQAKBQoFIAAAAFFAFv4HALRcREtzXgi2ZQC5CXr4IaQFXBGjSiu2TckmqpVyQoNU6e9bbMUy0aUE1d+OAM0ahFvY3jwSnJKKts+g9Lk0ndp5wcMkku5SX1LzXsQeBYlGSUvzPWtOnJyxQcYeFOStfmb+Ssbvl+pyyPu+yA04Ri1vb8+iMuUVF1uzHc3t4M3yB1XdNN3UVyYnlcFUWc5ZK2Obl6jBZO7OcpCUrMv7lEe5LoPcV6kAlWaoFEqiclbt0EiA4Sik2mlLde5llb39CMKFi4VLuUnt9NPhmQZAJshQBAAAAAoA8gL8AMgFAIBWCFAEKABAAKQoAAAAAAAAAAAAACh5BaXgAOA016oFk3w+UBEg0VpJtJ2vUjbe73CIXglgKpAABQQCghQFEKEAohShEL+YSDRQrctEXJoCexaJ5s0kBnyaSFWOOCjXAHJUAo64sbnJRStmYRcnUeWfb6Xpo6PD/ABmaE6TrG+21Ofp9kQa0WCehXzX/AHeRV2v+aPmzhnyxWSU3c5ybbbfL9y59ROUnPI7lJ22/J5MklLdEUyTlk5MNUqZriN+Xwc8ncvxXbV7lRG0r3Ocpq6W4lKuDnKTbvyUJSRlsPZWZlIA2qJuwWKAdtFoMJ7OnzyA8ms8IQUezLHJ3RUnSa7X5W/lGH7GWwJW5b2pEsjCmxAGZAhQQAAAIUgFIUAB2tptJ0uWQtgACAUhQBCkKBAAAAAAAAUAAAAAAoFAXsWUZRdSTT9HsErdWvzAI1lcJTbxxcY+E3bRl7PYWBfsI0pK+CIBDeyq2wQAQoAgKAoAFwEEGB4KACFEUBeRW5cQSLRaLQwRbBor4JdbIoKI8hFAgtP1K90lS2/ciQG4rYjNLgdu4CKZUjSidtPg+bNLft8sDvoMDv5jX6ntzZnNxTk6ivBzc4RrHFVGPJzz90UrVNq9/QzVc8snORlKluahFOLbGWNYrpU3V3v8AoEcpz354RxlNrdMTmlwcZblFbbJXkGWyiybZzq2aAFSRrZQZCXaoCuqMMt7mZOwF7EscAgll2a3I3ZBot0mvDIAZULRBZRashb2rYjVACFIQUhSAUEAAFDVAQpCgByCAAW1VVvfJANR7b+q6rwQgApAAKAaxRhNtTmoJRbTpu36AZAAF5foEERlHbVarPrc89Rqc2TNmyO5ZMknKUn7tnIIMIMChQAAqqmmrvz5QEIUUBCihQUAKiiFoooCewLRasqMmqCiWgJW5e3bzZogENxjfngyvc1cVF8p3t6UBidt0jNKuS7vctUBL3KO3yWgC3NJbBLctAEjaiIpeSrkCwi5SSW57rWHHUNmznCMcUeFKTX6EW/LZBvE90n5ZqcnlnS38ErtVpb8I76XTuKWXJsm7XvRFTJhcPpSqMfxM8ObK3aXk9Gp1Xzm4QbcU7b9WeHK9ywYk7Mv9xy6LwVEaaRg23b9TDQBbl4C2D3YCyXsXtDXoBhuy0qe+5a23oz/QCeQaUJSUmk2oq2/RGHwQaglJu5Rjs3ve/sYfIKRUBaKq87gTjgbV7i7FbAQMAggKQCgJACFBANR2PRr8+n1GZT02m/hsfZCPZ3uf1KKUnb9Wm68XR5hYAAgFBAAKNiAAUAQop1foAIaRABSA1RUTgBk5ApClpUgLE1J9yWy2VbLky5dr+kq4KMhb7FcVe3HuR7MKFrci9TSKiUSjbStkoDNGi0KRAq0KNJFrYoykEjdbBVQGGgaaNYljUrydzjT2i0ndbc+9AYbXaq7u7e74/IyV8hLyAQZaKkvIEotFXsWrAzRaNKJaQGEty16rc6JeiNKO6fL53A58Hpw4GofMnsnxfLOsNJK05KvO5v5Nu5ysmjmlb4FPu2O0Ypvbj1O08DhLslCmlbXp9yK4wTzZIY4x3lSR06rqYTzy0+Canhx/QppbTrz9jl/EYsKzfjllce3G4/hTve/y9DxTk07WyEiK2salv9XhHn/E9zTlbMN7mhqXauNjLexG6I3YE8igy02ACQexEwN1S3F0jKZvJlxPDihDD25I93fk72++3tt4r9wOb3M2g3ZK3ASZl7lfArYgzyUsUVqnXkKgq6XqKtlapAZexHwUiq9+CAGwCAQAClNduxkqIwGqC2ZFCGp33y7mm7dtcGQKanBwaTrdJ7OzK+4YEKQAUAACFAAAAABu3b3KKi3fsReg4sICgi8eSgA9y0FRlsrRKCLyyVuFya4KCiEtiri0E9qoCFKlZrtTXmwMpIqVm1D0FVv+wDtr3J22/RGqLQGWkvciXq6K/YVsBJVRn+htrZp0/clAZoJGu32L20BlI0o2WMbNqDTAyo39ztj0/dBtSXdddvlr1OmPBJ06SXqz24sGF43c333yuK/3Jo+b8utmjePA8kqS/M+hHQxmm3OCS8N8m+yGOPbaf/SqGjxS08YVDHJzm9pLt432p+T14NFHBHvyU5+F6GscY4beybOOXP3SqyKSklJvd2EnPhGsGH5srlweyGXT48kI21G0pTStpeWl60QedYFgV5XXntXK/wBjy67WvU5HNRhjh4hBUjv1bLj1GeWPRRyfJc2salvOSva/f19z5mSEoSlCSqUXTT8M1EZnk3OcmytbmWiiMjNeyI4/oBghpkS8gKKma7H2uT4+5ngDTjjcL75d9fh7dv1s5v0K2ZAP1I3sPYAQItFpp7gRIVZpI0ogTsqKb4fBho6NfmZa2sDMTMvQ2nsYk7II7qyB1S3BlQAAKoCtuV9h4A3ut0Rb2acaRccoQc+7GptxpW2u1+ppGO6ouNLfy0YNteTJKo3ZCkIBQAAAAA7z0nZo8Wp+fgl8ycofKjO8kardx8J3s/ZnAAAAAAKNODUIzuP1Nqk91XqiID7BB7MDwCixQJwVp+QLVlCRSiAJbmkvAGaNqNxu1zx5HaWCAji4pWud0ErNNBRAqXg3GJYQNqFNX532Az3UqM+9/kbnbdUSgMitjSQ7QMxjZXD0OsIPlE9VYHPtCje1HVR9eDSiq22QHLt2CgdljvZHp02jlklTpL1fgg8+DS5M04wxwlKT4SXJ9nW9LwdLyThjyY9ZNUvmwTWNOt6vd/0PpaPWx6ToZ4sWGMZZlUp19c16e0fbyfMzat5d5J/7E1Xjho8ubIm7f3PQo48MaW7LjjPLbjFuvLZjNCS2e7Azly+IqvYwsjhu95B4+1W+TnPvaSeyXgDMpyb3fIjGKdvd+hY46+qRuCioym9kle4R1duFQTpK5M4ZNRCEZJQ7m1Vt1RyyaiU9uF4RwnJjB1y5240vp+x5m6K5bGGzQvJ1z4MeOOJwzwzd+NTkoJr5crf0u1zsnttucVzuVtP2AiW7pc+pJqlVlboxKwMtkHkeLArVJP13Myk5Nt8sN+hmwKzL9ivkgBF9gkXYAgluDSjW4GuxqN7UwlbpBou6AzNJOvC8+pjk23yZukBh7IxZpmfJKIAGZUAACi+wopcG47ozNU7EXWxZ8FRluyUQqZFRgPkhBXu+KICgQoIBbYAAFIUoLghVsSwL5KxBx+ruTbr6afD9xyUSipIUOQglu/Y3GyGkAJy9yhlCTuv0C5IuTcUgKaitmwt/BucHBRTVWkwMVbNqNCKo6Ri50km2+EuQiJenBrbkkuVVceCyblz4Co6lS2XuStipWVIDNeDajW5qMN7qzrCFK69twOVXwWGFy8HaKddvEW7o9GPG1Gt0mQeRY96qztDT9y4s9ENNcqSr7neGBuXZF2/Ymq80NOm1Fbv2PpPp+TQyxLLjankgpwi/KfDPV07pc56lRx4++T/CvF+p68uBYHOLyY+/+Z3bZNHyM2KabnN/eTPN8r5kkre75o9WeSm5OTlOnVrhFxY1Fd+S1/lXAHbHgjpsLbagm9r5/Q8Uk5TTgm6d7nTNnlqZLHD8MSZsuLFjjGMouTW9XS+7A5LBJveklycXj7m3xHwdHnjGHdLNjp7KMU7PJLUxcrScq4vj9BIN5p4oQTSbe93x+R455JTN5s0sk3OUk3JtnCU9zUiJPb3M8le/Jl0iiN77GGVsyBSNj2MtgWyWQeLfkBappq2+H6Gb2KQCMhQBChFQBItewKgIludYx+pGIrc7QSUtwMtbtmeN/Jqbbb4RzlyBm99zEjXJmQVmvJk0ZqkQT3Aqi1ZBEVItG1Gy4JGLdsbI026q9jErAymaUvpMGrtVRBEE9yBAVq2Q0zLAAAgUQoQAAAVOgCMoru7IEAKlW5UQqKhyVIJFRQRUFyaigFCSS2Tv7GnFreiVYESNJUEjVb+wQjybSsiRuKCkItuqPRCMsSU13Ra3TWzOcVX3O8k4xSk23Wysg4SXoRR2O0YeWajjTd3SKOUMTdJHRY1dRV+rO8YtXT3Z6MGl/wAyJo80NPKTqJ1xadydfue35Oyil2r+p3xYVFJJc+pLRxx6btjfavvRqOm7nbPctO405nsw9My63HkWHG+3Grm21FR+9kV4oaWOPF9Vdz9fCOvTumS1mrjBZI6fAmvm6ia2hHzt5folyfQw6bpugk3rMmXWZXD+7xYNod//ADye9f8AT+pnU6qWRJSjGEV+HFBUkRXTqeXR4cc8HTcuoWG2nkyJLJkV7Wlsvsfns2rlGHysSUEnvL+aX3Z21OdqLh3qvRHiz4paeXbk+luKnv6NWio5rK4NXJ0nde5iepnNt9zr3MZZqS22XqeWUpN7cehR3nqp8Rf3rycJ5XL8TDVKznJXuy4iOX6EUn42Myt8cDwAk97NTxTx0pwlBtKVSVbPdP8AQxe50zZpZWpTnPJKkm5NtpJUlv7FGGlu/wBjOTG8bp1dJ7NP+hqWRyjGLqo2lsZ+Z4/lTvtfAHJolG5JXtde5nawMSRGjb3M1sBgGmPAGSV6lLQEolGl6DYCdoo222km+Nl7E7bAng0kHGixA1jW7s2tiRVHRQcuFwm+fQDlLaJybZuTtGGqQGGY8GmzMeNwDdbUZK+QgMpWzaiIo2o2rZBlKuDaTaI9uTSk5JR2pX4CsVf2Mz4o6uXZwcnu7YHMJ0ypWTggr2IUgFAQezAEr0K+BwB1z6meojiUo418qCxrtio2k27dcvflnGgAKQFVcgEWSipNRl3Lw6ojq/YIohULCCNJWVInH5ljbdFBIvp5KlvRNt/9AJ5OkTCVs6x4CO+bV58+LBiy5JTx4IuGKL4hFu2l+bs4qO5UaqkFRRRftt7BbmlG3QCKp0aS3sPl/c6KOyA66TGnkUpL6VbNSvJJyJDIlj7YXbtO/Q+jodD3OKm1BNN3J1Sog8scLgrnHnhGseOEZLvtJvej0ZEpTbUXS/CjWDTd01J7kVMGnTk5yT9ke7Hp+7ffurhHTFp5ZNsUXL7I+107QxWKWOlLPLl8rHHzJko+Lj03bPd2/CXk+hg6ZP5S1WTHOWNP6Ypfja8X6GNT13TrW9ui0OP5Mfp7st3OvLX+h7Nd8YajV6bFpZylLFgi1jjSSi3zSWyQXI+VP+Ixxm249+R7eXF+3oMWKOnptuUvMpM8+XX5cjSc1GK42PPm1SatScvdhHsz6lTltJRr0Ob1d45KM1Xm3uz58tSpLtVu/Jyed9yTdJKlSA9E8qtu6/1PPlzp8RMSlOaSV0uDrj0WScJN0lFdzuSRR57lNk7N6X4mdpRjjdU26vfZHOeSLi63f7BGJQUI/VJX6I5S7b80HJN3RmUuUtrKMyXpwRp06Vpcv0Da9TDZQqvIVpEsjlXkA36D8zPduLAt14JX2J3bi1QBojC+4dMDNiti0UDNCvQ2lZKAyVR3FeDXa2rQEaEU9itC1Fp1YEly0I7NGox7uOWGqYHSG7R1yfVjUaW1/dnOCte4lJpqSe64IOD2dPwYmzct22+XuYf4W2Uc2PAC4dgZ5LHcqRY0BYxRrl0VGopLdgYlCyNNbI65s8JLGseNQcY1J233u+fb7ex55TZFJPt9zm2w2QlFTK1e5GE6CFEZrxsZYBbFbsgsK0qe3kjQjVmlTXuUYBWiEFQa9hxwa27Fu7b48FGQ/Sty1uK8gZKgyxCK0agt6ItzcVV7JlFml4syjT3EUAija4IjS53CLFG6tURLyaW4VY43Tl4TSbLREt0dFHu2IJCNnbtrtXoMcK58HdYu+UeF9hQ0eFSzRcoy7fY+/nwLHgxxW+SaTfsvCPPosNReTsTr8KfH5n0NNByhPLnffJr6a8MzaseKGnTTSSS8tnd4YQxVB9q8zkefJqoxy9kI3T2Myhkz5182ajCO8r/oB+jwYo6fo+PLjr68jxqPEm6T7n/yvx9mezF1iXTPh/UdNxfIj/FTWTPmUbnNR/DDu8RT3pcs/O6zqWXPjhjuTjBVFyd0vRHiy6uU4VKe69X/AKDB1y6jE1Lhu/CPDPNd26XoizyR7b/c8uTK5NKK5A3ky3+GP5s4zm72Y3bt7lWOKm08kZU6+ndMDMU5PdnSONbvl+htzhGKUYr3bOL1bjdSa+wHWGacJpRgmzc9dmUpNfLxp+Irg8ctTKW7bbOOTL3KlZR69Zrc2ryrLqMkss1FQuTvZKkvskeVzjv9NmIybXqSV+lFiEp09l+phtvlmXL2JdgbThT7nK9qpfqZZL8Et+jooPd8Ee3gtqSSSSa/cn1X6/cKw+CNUdGtrpc8WZcb2sDFi/Q12Nck7QC90KstMLYgLbZgvdezKo2ttwYKW/j8itWZkq8BSsqK4m404NefAStWiLZgWF2uGrumYywcXR1UaSfiy5o/U6drwyDlidPdXRZ82ZT7WbkrSKN4+G0MrhJRUFKkvqb8vz+RqP8Ad49/5tjPbVoiuEkcpeh0kzFW36FRitgg+aNVQGUmaSKl6mqQE2R6MunWPTQySyJZJNp4qfdFUmpPxTvY88d2ayOtiK5PajlJm5M5yAjBSMgvAKuCNFxFi/UOLMmosgyUso19vUi3VDFQt+Q1RFapgbtMkkOWCoyajuQsXUk2rp8eoULZH6kKjS9QRGqAsVas6JfSXFHH8mbbmslrtSS7WvNv9CcbAPBUqCNeeAiFijXNUkn6mox3YVqq2Klb2EVZ0jC9wJCG/HB1gjSh2/mdcWNt1WxBFDbg+hptJ89winVvn0RiGnSTcvB9foHTNR1XVQ0+nxyyZJtY4RirbbdUjNWR6umaSGeORpqOOC3v0/3PHn12XUTWHC6xYoqHc+El4P0nVehQ6JmydPWphmcJduoyQi49rX4oxvl+LPi6qWkxNfKg6XEFxH8/JIuY8XbLHHH8rHGMk23llu5WuKOcYY8a7pNyl7mtRq20+EjwPM5L8XavUqO2bO3atRR455VdJNv3JLJH3bOPd3O26QHaWVveTS9kcnJtPtTdeTnPJGGy3Zj+8yP2KOzkq+qVv0RxllcXSpHVaf8AzS2/Qj+Xj2VN+vIHPulLd392ZlGTXsdFJJ7WV3LiLZBxUGltdkeOVbUetRSr6Fx+pjsS/lRR51GflpkcJN+f1PT9K5jH7D+6k4/SlXO73GjxyxNN2mirBJq1ue544zvsVK7rusxLFJcIaPDPBLy19jPZJLk9jwvwnZiUN6/qWDyqPqLr1o9DiuKMSxrwBzUvYNp+CuDW5O0CylGMkou1W74signw/wBTLj6GooBKMqpql7kgktv6npllUmu1dqSSosHikpRnjUpOqknTj/uQcOyM+KRY4pRVxdnf5OO/pb/M64e3DKpw7l5VgeOlPatzEsElvWx9PUYcGacZ6fH8morujbfe75Xp9jl8vwvI0eHG3HZmqtnSeK26Mxi7XuUdYw7qS3szki+6t6o64J/Lk65NyjCTi48+SD58oVM6qLewyL+8fuyx3ajZobm1LtavZUTUVGMe3bbc0sblLsju26MauStqDuKdJ+xkeSS3My2W1r1+5t+tGZbuqKjKj5Ka42NRiBhFddyUrq965o7afS5dTl+Xih3Spye6VJK2/wAkji68bthUfaptwtRv6b5ozKViWxhuwiSMPc1Jiv3/AHAz5IaaJ7EFW5qO+xhG1+5RmcO1mYunZ2cdjk1uQbTTRiWz2CZeSiKnyKI1RqO4VEXwR7MWBSUVOypOXHgCJFrYJFKjJuPJF60biraTA1TSKlwjvHC8uLJlllxp43FdkpVKae30rzVb/dHGqYCMXKVJbm47ozGrOkIuTSit2BpRqDfkitosq7qi7S8+p1wQ+ZkUfVgahjpetnbDjcm9uDtLCoLsjJdylUq9PuevBpl2Wlz6mbVeT5bXi7PdpNK6tx+pnp0HTsmu1uPDjxyyTnLtjGCtt+iR9fUaCOkyShqJR0/y/ocZfitcqubJo+PHSzy5Y4o7tumfoI6jL0XE9J0/J8rVP/FzwlTh/wAqa8+rR16B1bH0XUS1um0eKeaCcceXVY1NQbVXGD2tcpvg+TqtT2pybuUne/8AUi/DWbUNWp5p5sj3cpO9z5mfOoqTcna4MZ9T5b3PFln3O3+hUdcsn3uLVtePCPNkzLy7ZzyZJcR/YkcN/VN7egGpKlJNOUpJOPa9l9zXyp5H3TcYt+Ev9B+FfTX3NJutv2KIsODHvLulK+GJTlN1GKj6BQfdXl+FyeiGklzLZP15IPI8fds3bNLBBb05P0R9HDoMk5pY4Ve1tWz3YuiPuUZS7pP+VO3+iJq+NfBWKb4io/uzrj0rf4pNP7H6hfCPV5JPB0vXyh/mWBxX6yon/wBMarTu9VjxYX6ZdRji/wD+Q2GV+b/hop8uX6j+HSdPG2vsfpF0dd1rL0/89bj/ANzr/wAIllqGPDgyZHw8WqhL9rGni/LSxUtsTS+yOThHhwr8j9nqPg7r+LEsq6JrJY+e+OBzX6xs+PqMfUNNPtnpscWv5ZYkn+jGr4vkwxYpR2aiyLBJcOz68uoThKPzunaGdKmli7G/08nKeq0Ln3ZNBPFH/wDx5GqLqY+asG++33RnLhltcVOPqt6Psw/4blTccuaK/wCapV/Qj0ejzRk8eqh3/wAvc+z+qGmPgzw45Pyn7nHJppw2q16o/RZOkZZY+6lkj4aaf7o8H8I4yipqagpLu7UnKvNerEpj4zj4MuNx/Dwe/NpoqTaT7W2k3scHCUJexUeXs8Mij2umeyWn703Bbrdo5KL800ByUPKHErO/y2naMSjfigKp353NRVtbHJbySaPVjxfTvfswOuKai7cb/OjUoxhJySuMuL3o5SbxNNrZ7HWKWXG/rjGlavz7AefNFrelT9Ecoxr12PpTxQ7YNxrG6T7Xbv2PJCFqSrdAce25ccnXHiaV3VOmWWOnsdIxbh7cP7geLOu3NJJ2ltfr7mIxal7nfUY3HMr4asnZv3P7AYzLJihFtSi5xtX5XqeXej15JRljknGTyWu2Xdsl6Ueat/qKMNbEUaR1S7hLH8uKclu919gOPG5vHJx+pcryRxcpe7OrUY40u7zbVcAefI358mHI3lalLY5soktzPPsaI1YRkr3Ko0H7cAShSRaK4PtbAz22jKuLOilsZklXG5B0xtTOU4tS4EZuLOrayJbU6q/UDhW4WzOko0YarcCyJF0xdiS7Zcr8gqyWxkt2ipKnuETZvZBMjVM1RRbKlZEtircCpeDcY7kgjrFdq43A6fLcYJ7U/FnOUd/udJXsYkmgJFcnRbRMwVtHacUlSS2XqQYivFHs0eGburSfJy0+H5kuHSPv6PCsEILsi5dt/UrX3JR5cOCKnGLfPp4Pp6fHhuSlGUoxW0U92zxtVl7Ip918ntwYJPJ8iMu1v8UuX9kSrH0+jabV/Iz6/BCWNY38vFKFxSm/R+qOUMWHR6iXfNZtS+cj3381/ufY6v8AEMtP0rQdD0spw0ujjKag3/5k95S+/B+cxyVSzzf1Pi/CMtV6dbqV2Rxwql77yZ8XUam/NyY1GdyySleyPFLI7+ZJOuF6WXGauRuK7p7t8I5wjLNJK6XDk+EEnlfdK6v9Tbt/TF1FehQlGMPphUnw5GZPukly0qXsbhDufbHZLyejHplHenb4fqUcFhqpTaR6MOCeV1GPZHy3yfW6V8NZtXietzTxafSRdS1OeXbjXsnzJ/8ALFNm9X1rpPS7xdP038dlj/8AqNXGsafrHEn+8m37GdXP1z6d0TJnxvJiwt4o/iyyahjX3nKkds2bo/ToVl1kc+Rfy6SHcv8A/ZOl+iZ+e6l8Qa3qeTv1Oonla2Sb+mPsktl+SPlzzpyblbYz9N/H6afxdhxTX8J0vA6/n1MpZX+my/Y55PjLrF92PX5NNfjTJYkv/ak/3PzM9Q62pL2OM9RXq/uXxhtfY1nWNTrZ92fUZtRJ+cuSU3+7Z5pamfhRS/I+Y9RJ+a+xn5r9S4j6y1Nb/TZY65xlvGP5o+R81+pVna8lH6HS9ez6PKp6XNn001/Ngyyxv/8Aa0fdxf2g9diksvVc2rh5hrFHPF/+9N/ufglqH5dnSOofh0TxNfvF8YaLWS7df0bTNPmekm8T/wDa7idfldF16rR675E3xj1kfl/l3q4v86PwUNQ1vZ6cWtknyTx/F1+s1vQs2kSWfTuF/hl4l9mtmfOen7Nmml7memfEes6d9GDUVil+LDNKWOX3i9j7el6l0vqMFHPFaDO+Jbzwv8/xQ/dA9PjYcmXSzvHKS9uD0rqffOUZPtc9m5xTT/M+jqumfIyKGVdimrjKNShNeqfD/I8mo6PljUoRWSL3Tj/sT0vw5ZtNgyYpfMwtPmMoO0fOfTciT7J05fhhNbSXs/U9D+bimnByi47M9UcuTNjV0+3+R/1QPT5E8Xy9mmv9DGXG8jUnG3VXH2Ps/wBzqZVNdkvEmtvzOGbQXcY/3cv2GmPkwpNbd0X48oPGnK4b/fyenUaXLpM3ydRjljmt91RzjCptS2T8mmced4U3a59DWKbTUJ32/wBDrlxRhOXbO4p7NqrJjj86dSqLaA1nxqcGvxUrTPPFyilueqC7YuMldPZ+hn5VqmuCD0YbzYJJJ09uNk/BrDppbSrdbUNDnzaKUnim1DIu2S8M+hp88MaWecFkj3dslfNoL8vj5YtZXGradGsOLvbTdJbmp4pQzS3tN7G4SnpayQtO+QjyavE4ZFFqmjOROONWqtbHp1Deo1KlJtvtu37HLUYmnRR5VjSim5c87HCatbRo9GdqCUV48kxRjJSnkTceOatgcYR8vZf1MNSzTVySXFyeyR1zTcm5NJcKkqRyeaSg48L0A532q1ycpSdGpc3ZirKMeSeTVBRreioi2FFrcqje72Aylb32RWuEVu3XgNUFSMTai3sIK9/B0VLZb3+xEeOLo3ycjeNuwMSVMsZtLk6ZIK2k7V7Oqs5NUB2jLuRJKm00clZtOwM+Q919jXngUijMX4KSqZVRFdL78cY9sV23ulu/v6mGip1v6lirfHJUIrZiKb4KtrJwwNRe52xq5I441bPRBb7eAO+phHHOMVfG7fqcHz9jvqciy6iVcJ0cq+okG8ELkmblH69/J206+XFuk+5NbkjDuml5bA9mkwJJNLavJ9rR6ZrF/ESTaltE+TH6IqK/mpI/Zdawrp/SenQiksmbG5xSkm+267mvHDr2MVY/N6lduaWPHTzNr6oStRXp9z9B0jS6TQ6N5sk18xum3vJ7eD5Gj00bdK5PmR36rr/lwx4MUVUFS936irHl1+Z5tTJJ7veTX9DzZ8yjFwX5ssZqCc5by9Pc8edyk1GO8pcliOWXJ38bIwoTyS7F43fojahb7Et09zrHHdY4243u1/MyjnGDm1GP4V59Tr8vvqEV7bHVY3P6MateZI/Q/DXw3l6pkk12YdPij359Vmfbjww9W/HslvLhIm4smvk9M6TqdXnhp9Npp6jPOXbCEI91v7Lln2smLpXw5GU9bLD1PqC2+RGXdgwv/nkv8Rr/ACx+leW+Dp8RfFmk6fpcnSPhuMsGmkuzPrJLtz6pem34Mf8AyLn+Zs/A6nVubacrJmrsj63WPiLV9Uy/M1OaWTtXbCPEYL0iltFeyR8HNqrbt/kjjl1D4TPLLJtdmpGXeeofjY4Syt+TlKTbJY0dPmPwzDl5JZBo03ZLICC37i/cgA1ZVKjBQOscjTtM6QzUzzIqZdHvhnTe/wCqPZh1Uo12vuR8ZM648zi1/Uo/Y9J69l0sPl1HLgbuWDJvF+69H7o/UdPy4Oo43/ASmpJd09PP6pR90v5l7rc/m+n1KfO/uj63TdZPDnhkx5JQlF90ZwdOL9U/BmxZX7vJ0eOfCs2bCpQ8ZsTtL8/9GfM6h0KMsTyaSfc4/wAlV+h+j+HfijS9Q/8AD635eDXz2jnjUYaj2muFJ+vD9menU9Mw5Mkp6bG9Nmj+LHf0N/1i/bgxuN5K/m08WbHK5Rkr5tc+51xamMovFK7eys/ZZ8eGfdp9Xg7HLzXD9fb7rk+BrPh7LiyTnhhKcY7vbdL1/wC40yvnanLPO9PLLly55Y4dlZvqUV4S9jx5NNFxuMrS8f5f+x9HBBfNePNjco+zqX3X+x582jyY8jnjuS8P/sXUx81YpyjODuLSuvU87Xbvyv6H6DDnwxwSw6nEk5NduTzB/wCx49ZoscXLta71/K1v90+GWVLHzcU25U3yeuFKSlJdy4aZ5ZY3GlKNe68nfHKvxJt/cqDuP0Xau6PVDJ2aftUbcvp+z9Tl8pyukvp5o9+mWPNjWNxUe3de7JVkefWKGKWBd2KbcFKXY26vw/cZYp41jSi+6n3eV7GNTgnKWOSg0pSps9uo0jwOT3lGP4XXJNMfJzrt1NRe20Ttrs+l78fyVkk1iXf31tk34rxxzvyZqce9xq2nHdepwyaOeOMJzVdxRyx6eGVvLnk4wW6Vfj9kcM8k5yk6j3O6S2R1zZpdsYttqKqKvhHnb7otdn1XyaZcnLu4RxmvFnoaklxsc57vgDh2t8Glhl2d/a64s6KHsby5e6064qlwho8kk1sR7o6ONssYL0Lo5KO170PxOktjpKJVBqmuPUDDj8tb8vwc3udciTfNsih7AIV27lSfLNxVG1C+VQHyzTtL7mTS45EGoSvkuSPlGODSbqr2YRizUWHDytxtXuBuUnKKT/l2RhpptM1GhKNfYokXurVkaabIrTNc8gIPejpXozmlUjp4A1VyeyRhrc7YoqStvh7nJqpNAahsm/J2xP6lZxqkd8a7XGwO2b6J1SSaTM4k5SdeTWp+rM1drhHfSYEk5eSDvDE4ppr8K3Omh00s+RtJt8L7noUca08+6LlKVKLvj/c/Uf2d6bQYuqxz9V0j1Onjhy5YY1l7O+cVat/5b5Xkzbiya+K+mSx9S6dpckJQlllfc/Kvn7I1rNVky58inNTyd3ZF3tS229j3a3WQh1N61xUZZ5tKN32QfhX7HyZ4lDVtN1FN7kWvdhyrBjafNc+54J5HlzSm3dG8uRze3CRz7HGMFfbKT7m/QqOGbK4R7nzdJHG3CPdJ3J8fc6SnLUZHOUu5Jt9z8+rJp8bzZVL1dRv+oG8GBRjclXr/ALHRqTuGPl7Sa8L0R0zRffHDju1y/c+78LfDeXrep+XBwxafFF5M2bJ+CEVzOXsvTltpLdktWR1+Fvhta/5mo1WVaXQadKefPKNqEfCS/mk+Ix8v2TZj4u+KY58MendNxPSdNwu4YVK5Tl/nm/5pv14XCpHf4s69jx4odN0F49Dgb+XF/iyS85J+sn+y2Xv+C12seVtJ2/LEm+1tz1HDU6u20nv5Z4MuWtxlyU9t2eect/Vm2SU3Lkzdkv1BNAhSEFIUAQAAAAAAAFAIBUzafoYCdFHoxTcWfQ0+eUWpR2aR8qLs7Ys8sd0+dqYH6HS61uX1Pb+h/UPgj4qw58mLp3UssMeRpQ0+snwvSGT1j6S5XnY/jeDUOlZ9fS6tdsabvgzZq83H9x6h8O5c+aenyaeWHMrqFbP/AKX/AKHyMeiydOzLDqsc8kY7x8TgvWD8r2Y+Dfi3W6/R4NDlz9+o09LT/Mf+NFf+W3/mX8svP4X4P6ItLovjLpXfBxWaP4ovacJf/PP6nK+nee38l6p0GGszOeiqTe6itu5/bw/Y+Jm0mbA3LNGUJx2aa3/M/pWb4f1ehWfHnw/NrZZKqS9n7+5+Y1dZPplC5KLUm23bXlp+22wlSx+Y1GLTa3TRjHDKOaN98u61L0peDx5OnZXppyhbjjq3/l9D9HDpcZt5MTeGa3Ta+n7P0PndR0eZYI5njcF3U2uGzWpj88scnCSyQtPZv0fqZy4Gt4QfH33PouDgu9J29r8fZnnz53HGu1O1K2k9l7peppix4YSlF0nW57sG2Ndq3i7OcsTywU47+52wRyOUYxi+57JryKSP2n9nfRND13F1aPUJ4ceLT4Vmhky5flxjO9rfm+KPi9azQyarJHuVp7uuXVG9Dr8fSel5dHD5vz8+ZTzuUUlFQvsivL3bbe3hHjWrWtyzeompT/lclu/zM/bW+seLBjx48jyR/vZK24SWy9Hfk8msyvKqkkvPue/UYsT7nCTi/C9TwyjBtpxl3Llvg1Ga+XkSTaVu+bW5zUUj6GbTNyt2vdHOeKemTjLabXlbo1rOPDkpNKrrk53jxrhuTPS8OSTTt160cM0Gm1X50VHGc3PaqXuc3GvR+5twp8G1GUYuSS+lW7A5wxrtk5Xf8tcX7mJxndNV7HRZJNU90lS+wp8gYjif/wDYnFy5bNqVPyjS3e6A4qFPwa7V4T/M7zgo0+2r4oz8tuuQY5rG3uXt2/EerHFSi0quPNtI4ZFJcpL2A+KVbECoDXO6NxfhmYummHK5Nrb2NIStOgn6mmu5XRzaaIN8FTtUzDk5Pfd+peNwK1THkl2aSZRqKtFSJF1WxtqmmuAOulr5iT/C9mTJD65NepIy7XR6tRi7WmpQmnFPug7V/wC5FeJcnZTp9pzirbRU6dlR6J/ii/Y9azLtSivC/M8M3fbXhbnowN5cq9W9yD7i+XHBgjOD+mCcqddze9/pR7um5Y6bDkkpuMsv0Lx9Pnf9EfNk3kcYRTlJ8JeT29b0Gr6S8enzPvjixQlaVKDyR7+377ma1Hj1ueWfVRd7OSSPRl/xITkk3VP3Pn45JZcbcU6fc7PYpub7qtII9ekwLLljCfcot3NxVtR8nDqE4JOEVcpuot8pH0ejZMSx6z5kprJPH2wpWnvbv0VI+HlzPJmyZnxdR+wVnt7msMdl/M/Y9nylpsSl/wCbJfSv8qL07TxjGWfKuPqfu/B7NHg/isssuRdyW7Xr6IlpI6dF6Pn6hmx4MWOeXPnkoRhFXJtvZL3Z+p+Jeoab4Z0H/wBP6DJCXy33a3PjdrNlX8qfmEN0vV2/Q9vS4/8A0b0R9XzKuo62M8ejXnFD8M8v35hH/wBT8H8z611B5ssney/dmZ7rd/xjxdT10s05Sb3f7I+Llytp+EzrnzdzaPFlnctjrHNmct6X6nNlZCUCFIQACgQoIBQQoAgAAAAAAAKAATo3F2YCdFHqx5HH7H0NNl7ad2nykfKi9j04Mva6YH7PoGucMvbbe17eiP6v07rupxzXU9POK1OCUYatR/DO9o5Wv8s+Jeklfk/hmh1ktNkx5V4af5eT918EdceDXy7l82LtPHJ7ZscvxQf3XHo0mc+o6cV/oTSavR/EughmhkWDO/oUpb9sv/t5V/SXlH5XrPwlinnm54XpdXDmvwy9/dHxMWXU9C18cmgzPNpskFkxOXGfC90mvVbr2aZ/V+hdR6R8Z9FWOW2pjGu2Uvqj9n5RydX8ZydOn0nO3lwvJgb3hdfozhk+HsHU5ZJdLy5c2Nq54JxqUPv/ALn9H6l0aWgnLS9QxSyYL2nVSS/1+5+Vj0XPpNTKXT9TFfW/lZFKm16f9hq4/m/UulZtPCU1GSUH2z28+58vT48OZ9uTHlS3uS3Xsf1DrGklqNQ8erwy00575Y4n3QyP/NR+U1HTZaTPkyYEsUHx8v6oP/b8zU6ZvD4MekySeSDcYf5krRxlGXzYUqa5rb8z9dp9ZpZ4MUdTgcZ01LJhjV/dcM8WfBg0uRS0OKWozOVqU4fTD8vJdTxfF12nnJRySnbk+X/N+fk8GaLxxvs3XlPc/Sda02onJLVKT1FXJtp9ze9pLZfZHg0mTHo1LJqYQlHtahce593hr7FiWPj/ADpTbuLj7HPNGU33JqPsetZMEHcIfMbe6yDU4bUZRx0pcVK1+RdYx9PoWh0mv0Ws+dqVDNp8HzlFRvufclSf52z4nUY6fT5HKMXkbe88j5f2M53PH21tW9HkySeau+2lxuJFt9Y5Zssc2+6ftwef5MmpNPZHoeNwbSe62dEWOTo2w8/yZLn+hzeNylSV/Y+5pcWJtvPjbxdtSjjl9T99zyS0EZ5nDTTcsfiUlTZPJfF8p4VGVPZ+52xqEd5q16XyezJ0uU8vb3J1yTJ07Ji7Lj3QldNNXtzsNMeSeDvqSiknxW5ynj7Z0rT9Gj2LTyeVrHFxh6M3qsWXSw+Q2u1y794ptP7817DTHgeRqrimenDjxZV2ufZJ7pPgxlxxilW972YgpSk5JVS2Kjrk06hXavJwnGud2ff18cWGKT06wb0ubmqX1b/mfEztJfSqskq2Y/PpCig2wdo4+4TNcoo1F0ZlTZfF1sStwM0Xd7M0ohx2vwBlbnSLtVX5mEjVAbS5TW5tbqjCdumbTcXYU7N7PTizTWP5Tk/lt243tfqcl9Svk1FfVRBVjWPK1K2t1t+xylHf7H0PkfMxQcItz9t7PJOFS/cI522enQT7M8ZHm3e3odsG0rqtgr6kdS8GaOROuzc/T/EWvfV9Pi1M5d88zeTJJ896SX6VR+OX1/TLl72ffxZcC6K8OV5HnklPF21SSdOzNix8vHG5OXjhHshSwrnuk/XweaC7El67nr0WKObU4cUn9M2rrwr3CPdjyvp/SM/0yWfWtY4TfEcf81e7/ofMjh+blUUvpifW+JdXiyayGLB3fw2lj2Yu9JS7bdd1eaJ03DGGB6icdku5/wCiI1nsyYnGOPTJfVtKSXvwj9X8EdBj1DqcMWZrHpsN5M2V8Qilcpfkv3o/N9Lw5NTnllSucpVH7/8AY/ZdS1P/ANOfBsceP6NT1a37w00X/wD9zTf2ijN/G5Pt+c/tC+Jf+MdTyZsK+Vp4JYcGJcY8cVUY/kv3bZ/PdXmtvfj+p9HqOreSTk/GyPh55e+7NyOdu158kmcJM3klb28HJmqgQpDIFIAKCAAAUACACkKQACkAoIABQAAIUDcWdoUedHWL9Cj6Gny01E+/0jWS02ZSi906PzGJtNM+rpMtNb1ZLCP7t8K5o9d6U9Jf9/jUtRp37rfJD819S+zPXpNZn6PqP4zTOUKa+bBfyvxJex+J/s/6vl0+pxSwO82GSywj6tePzVr8z+n6/R4M2pU9M125Maz6e+MuKW/Y/dbr8mcOvVeme4/fdA+INN8T6CGLJHT5siVZMGV/V94vyj8x/aB8NYek6LJq+l4NTHa5QS7sbfs/B+L6zoNZ0HJp+o6R5Xppu4ODqeN+x/Q/hf480nWdNh0XVZN5ciUY6iC2mv8AmSCv4/D41y4JSWtwZMeqhUcc8fDXnuv/AEOj+ItG+1y02KKu3aps/rP9oP8AZT0/qWlzau4Yvk9q/iYR334Ukufufy3qPwJ1Tp+GWow5cerhKHa546na+xPR7fN1kMGu1PzNFkjibfd8tcfl/serNos2o08tbhnKGWO0sPFe69j8707Sa/HrZ4MTack4vuW9fnwz930B6LqWky6LVZMuPV4Y90csIOXdFc9yW+3qW+knt+R1ms1WtnDHq3jwxhsnHEoqLX2PKum5OpKPf2ya2Ti/6/7n9A6x0SUNFB5Xi1MFH6KXK+6PzC1HUa+XDpun0+PHj7LwR3a9W73YnS3l+fz/AAy9Plb3UIq5Tb2XsvVnghjzYp/gv/lo+5j1WBzeLLgzfMbqHbNKN+6Z7ZdMwajDKPbkjqFH8D+iUff3/Ivkz4/j8lljjzd0ckXFv/Lt+p5cvToRj9DjN+z3R+mydA1mL+8+VLPiatTq2vucNZ8PzwRx6jT9045I/Ukt4s1Kl5fjs2nyYXs279CwyTUFGapeElufeydIy513KpXw15PmZ8L0+VRVWvVF1izHjWXJimpQmkz7fTp6OcIT1eVwl3VJLHxF+U/9GeTTaCOqyRdJXyz7ep6AtJhePJOHdV90XaX+5LV5lcddoZdP1mTBGeHWRdSx5sTu0901/sfJ6lo/ka5Tck7SSS5X3P1vwpqelaXJk0etjmyTy43HTzx0lDK39Llf8p8zq2HTz+IFotLKGT5b7J5f5e7y/siS+2rPWvlYcGGLqbd2pdiXP39DjrsUJ48mZ1KUd3fC+x9DX48Gg12eMZrUYMUu35kVSyv29v8AQ/P9Q109Tk3arwlwanti3HjzpznV72e3p+THg1WGUMWPN2PucciuLr1XlHz+3JkyVHy+fQ9sezp2J2u/JOHD/lv1+5qsxOo63Jq9RLNmyPJNttynyzw5tVBpJK2jjlzyzSaUd7OuDRL8WR0v/nBcxLdfFQryVrYiTbpLdm2Up2W2iWWwNRd8mnFJJqSe3jwYj7mvAGrte5HHa7XBE3+Rt12/0Awk6CKnRUBtPdOt0t7Nw+r6TEVT23NRVMDddro1B1Toskpv6W3Xlqh2V9iVX0On5VDLFStpPuVOv3GsxYcmpyT02N4sbk3HG5dzjG9lfmjx4crhJex7owjkbnCUrSbd/tRB87Njcb2GJbpnqnDum/KZyilFqPbVPd3yB6cMG2m19j9FPQR/gNNnjJ3HG8U4Vw7bT/O/2Pz8vowya2bqj9VpsuGfRdFkxwzPJ2t5Jza7ZzT4ivFbfczWo+Hlh25Prb5rY+l0XEoylncbaXavY8ep/v5Tm/xd1uuNz7fQ9FOWFKMbct6fnyxUny+Pq4S1mvnCO6c6v2R9XLBww4tMlSf1y/0L0rSRz6yWRxp5JtRS4Vu3+x9HTafHrOq0m9ptVW3ZFcmbW5H6D4J+F56/VYdNF1LLOOPu/wAt/if5K/0Pif2k9aw9T6xqXpPp0uN/I08V/Lhh9Mf1Sv8AM/omjhk+G/hTqPU2uzNHD8nG/TLm2/aNn8N6rqVOWRt0vwonPu6136mPh6qbcq8Hzs0rk3+R6tTN7t8ngyu6R2ji5NmWVkJRACkEBSACggAAoEKQoEKQAUEAAFIAKQACoACo3FmDcSj04X6nu07ezPn4z3aXcUfrfhnXZen6vT6mDce2Sd+3B/eeiTwa3pSebeGmyd0WuY4snp/0z/8A5H+fekyx9lylvaTSXC9T+1f2dapanHDQZn9OeMtPJ+0ls/yfazj3Hf8AnX6zLgxZtP8AwOqn24p5FWRrbHL1+3B+D65oNb8KdXfy809PBT7lOG/ypeq9j+k9K0GTqWLHp9RBd6vDl7uYzjw/s6o83Xvh7D1fST0bhJZsMe1927j6b+UYdH1vhz4/x6rp+GXUMWTWd2FY82TFTUmvLifk/iLV9GxznqdHmyQj3fVjVxyQXqvU/H6LPr/hzX90FkjkxPsypfhmk9m16n77r/ROn9e6PptficZPNBNZMca7ZVvFrw0RY/nmHqOLNqe/UJZIqX05Uqn9z9J034a1GbA+s9LnkWTFLuhkx7OLr/5sfkOufD/UPh/Pjz6XI+/8cGlafuk9me74A/tA1XwxroYtVlnDS5ZduTa0r/moWfib+v1XxJ8VamPRdL83okI6ltx1OWX0Y5O/pkkuG/J8PUa/RaLSSj1SEsWdNOGKL7ozi1+OGRbV9z+kfEXVdHm0anq9Dhb7l3Rh/h5oP+eL8e5+Y13wv0HrXSddg0Hbm6jimlDE8lKOOucfr9jLcfz/AOT0nqOeWOGpcZ5H9E8qUYr8/U8c9L1HQ6hw0uVauOF93cvrhD7s5dV+G9T0eGbI05QxOpWqcfujy4vjbJHQYenz0/YseXvc4ya+YvSS4Z0/05318vZ0j4z1XRdW467C9Tp3O5JbSh6uP+x+71vTuk9fwafFoeo4sHUs0fmY3gi1g1CfC9pH8f63r3r9TPJDHDDGXGOHCP3nwP0rUZMXRtPo8k555Xncmu1Y2349lXJOp9nN+nPqHSNd0zRTWswSxRlOaTaq5RdSX334/M/J9S6Vl00lLPJxjJd0Y34P3f8Aa98Qw6j1VvSZvmPB24nLH+HLOK+vLXjwk/NH4CGaS0k82qnHtyfhi3u/c1yz1j2dE02hxfLy6vJOOOc1cYby7Fyzr1jr+h1jzrC5vHB9uKMt5NeEfG1/xDm1UHiwpJNKNxilaXBx6R0jJrdVDDH/ABJvl8IufdZ36j7Xwb03J1jrkcH8zxznb4VK237Fz9Q0nR1qNNp4xlPOksmWa+p07tei9F55Z9HU/Ek/gXR5dH0Scfn58E8ep1WXClOSltUL3ikv3Z/Ofm5tblbnLtTduUhJvtbZPX29HVOoS1OTsg32LhHz4wnkmob78n1YaPBF/wCI4xq5Tkt39kZyZ8eLSpaZQhObkpSkrlFL9tzbnn61PH/wOMJZcUYZJ445YLIrck/wuj4WWeXPNzbcnJ22/LPRllie8nLJJfzTdnHJq1Guzn19DUSuum06xweSdLet3/oMuZuLpxSXq92fPy6ptv6nfLb8s4Tyyb32LjLmt0O3fzRd6WxUaRlxMNHVwbWximmBDXgqW5qklx+YGEbr6d+RS8cGo1TVAYi6kbklJbcme3c0lwlyBMblF2nudo01uY7V52KnboDso9rTujvBRmlZwh+F3wdcORKSTIrU9O4q0fR6HOKzOM1GScXGpK9mZxVO4uKp+EZx6bJptS3uktzNWOmu0L0+olDujJVcXHho8ksdxUq9j6uZrUY4TUGskG+5+qPHGDVwe8btISljFKUIp+Nmfpuh6TJrOlTx42u3DkjJpyr8W1/sfmtRBx7XW0kfc+Glk1eaXT4fLTypSUpbO4p7J+5L8Lz8j06hGV+W4s+70zH2aPNmjJRjhxNu3u29tj5TxSk+xpp/Mqj9N03pqy6LLhppxg1J+Htaoza3zPb5fTe7F/fKoxxYpSV+ZPZH63+zf4e/i9WsuVd0FC5v25f9P3Pz0NI/+GpKNtyhFfez+r/AfT1pelzhjjUs+WOFP2bt/sl+pjqt8x4v7YM+PpPwh0vQppZtXky6ycfb8MP9T/O2tblNx9D+1f28az+I+K3o4v8Au9HjjgS9O1K/3Z/FNWq+dN+tI6cfDl/T5fH1TPFN7nqzu2eWSOjDmyMrIQCFIQAABQQAAUAACACkAAAoEAAFICgACrkCrk1EiR0hG9krKO0Fsme3SKtzzYo7JM92jik2mhR97peJrJXNf0P7D8AYPl5tPJ3Sl237r/4j+UdBhGealGTrHcvunyf2P4Lxzioxd9jz99e/bVnDuvR/OP691DBpsHUsGoxyUMmoisq8dz8/nZvWaGGbLDqWBuPfHtk4rh+Tc9Dj6p0nTzyxv5M+y/Mb4/c7w1Oo+HtNh02swLPpcs3F5IrdXw/uQfio9C0+s1uolNxx54urauM/udOg6JdMy5tDq4OGkz5FGlxFvho/Q6jR4sUNTHAlOGScckWt/wAvsIwwZs2nxyXfSh3bbprlGcb18f4z+GPm9MWjz6aCWKV6fNH+deU34d7o/ivWvh/NoNbiy5V8+Mp9klW/sf6w6qsX8LmyuKyQ7fpjX4n4S+5/BfjWMYa/teP5X4ZvHy4v0FmUl8o+907XaHX/AApotJqcfbqtM/kOD59v2PzPU9LoPh7LLNnjlyajUwcdHgxycWpf52/RePU+98IfC08mCev17n8v8fa3+L8zn8Q6XTf8a0/W+rZe3T6aPdbh2xajxCC8mbW5HyviDWYcnS5LrWl7tVpdM4ZckdvmZWvo7vst2fwfX5IvO1H8MD9n8YfGeo6rjyQnkqMpzmoJVy7r3PzHQPh/V/EOs+Xgj33bbul7tvhJep04mTa593yuR0+Geiaj4g6jHGoTljT+vt2pelvZfd8H9N6z1mHSYxwaKWnw4npliyarG24QUVtig/Pu/LPky1nSPhLpWfonyo6zXNqebJjn24kqtQtby9X4Pw3Vutanqcr1E0oQ2hjiqjBeiQ/7VP8ArMddd1ePyM0MF5cuXaeR+F6I+BPO53Fu2MillyPtTjDwm9kfW0nQ8mPpsuqZsOVaOMlD5/ZcZT/yx9X/AEOnw5+66fDvR8mryRShcpbq9kl6tvZL3Z7NB8a4eg6zU4ulY45MjhPCtSo97tqu5P8AWqPkdZ63o9To9HpdNgz4ZQjNaiEp3HK+76W2udvHB8N6yUIuONqEX4Ww8d+Tyz4e3PkeszuefUxjBP8Amdt+5Xl00JKOBcL6suTx9kfHu5OV/mSepUdu50axz17Z6neU3JvfazyajVOa2kzyT1Dm3RzeVKNNXJ+fQ0ju75e7OebL3Nv6U64iqOEsr9TPdYCTsw2acXJqtw8ai/qaXsUSL9zV+phNGvxIqOkXtsxK738mIqmqNttq3xwBlbs1dcEg6deGdoxjexFc0rLFHR42lsjLTXIHVYu/GmncldquEcUqZ0huqfJUn5AkIfNaiqtvZt0ZUK+5tL6j1QjGeOlBOXiQHnx237+h1UFKVvZepVBW68HRxliim19Mv3INYMssUl6H0tLnhli4ZNm+G/J4dP25JfLlST4Z7f4GePG5ONr2JVj9P8PfC+r61HUfwXbn/h9Nkz5YWlLHCPL35X2PhS00Fqp4+FyvZnfoeuy6bUL63CtlK6/I/X6n4XfXNGus9Mw98+7s1GnxreM0ruK9Gt19mY3L7dJNj8Lm0q7d3XlI6/Dk4x6viWSbhcqUvR+D6nUNHWC5R7Jxf1Qapr/sfK0+lcNYpVXlF3Wcyv1/U9Ngx5v4nF3dks8o01uvKs/Z/DOgWXpWrzSxRl82Kxwk1vFre1/Q/HaiOSengslNZ+3Kq9eD+2dK6A9P0rT4cMVkw4cKySkopOpVu/Xc5dV25nvX8y6d05/KwqfjNVfqf2j4D6OtRPQRiqxxyzzS29H/ALJH4nN0L+G1eDFVJ679t2f1v4M00NF0uWSH8mne797bJPdXr1H+Xv7Sdc9b8SazUSlbyZckr+8mfzLqLqEl6ybP2Hxbnln1uSSfCTf5s/G9S3lJ+ODtz8OHfy+Ll5PNP8XPB6sypo8st7OjDmyGmRkEIUEEAAApCgCAACkKAIAABQBAUAQoKAo0kRI2lbKEY2z0Y4+iM447pHqhCmihij9aTPo6fElL19GcY6btg207f7I+zo9D9UG03VOS/ejFqyP0XwdolPNq+9uPbpZP83R/cfgPpMsuHDkyOTwwjS/6mtkfzn+zf4Yl1PRdV6trZzw4IQWLH2Rt5s05fTBe3q/RH9n6dpsOHR6bR4O+sGT5fcv551uzh1dr1cz0/a/DOm+d0nUYsm/ck/sz19Y0sp6LBCNOUd6fk79Awfw+nlBrdpWejXY3KSpfhWy9WdJPTjb/AJPyOo0c9Hj78U2ox3j7ex5ulTjp+qSyajt/uoqf1Ou+b4R+n6hh0+l0UVqWvoXdklfn0R/Lup/FUZdcwaeUYRhkzfMp+Ix/0MWY6c3X9F+I+rR0XTXqdQ1jyY05RS4i2v8ARH8m6B0vUfGHxFk1ksMp6bFL8T4cv9Wcup63rn9o3U3otGssY5cijig9lHGnvOR/Q+oavF8B9FxdG6HplqNXhxd2XNJqMMfrOcnsrM2/dWTPUb691HR/D3T/AJWXEpwx08kU6ut1G/6n+c/7QPi7qPxN1TJlzZagnUMcdoY4+El/8bPu/EPXdZ1rvefXLK3JqMcbbjfsvP3Z8TRfCmp103nzSwafSQdZNRqMqhjg/Tuf4pe0bY5/V6/H5nRdClrsnfmba8yk/Hu/B9vX5o9A6C9JhSwyyyua/myRra/SPovPLPV1/r/SOjRyaPpGP+J1GnfZ/EZ/owwl5cY8yfuz+fdS6nk1Nzy6l5ssnbk+LNyXpm2c/DOfqWZ5MmTLN5Zzd78v7nbo3SOodZyZcmPEpRx45ZZyySUIRhHdtt0qR8qOqhp4Nwg8uR/zy/Cv9zPU+qvWY8KmleKHaoqTab/zb8P7HTPxy2fb7i1nTtDljnw546vLCpKcsdY4tO9ov8X5qj53VfiTqHVZS/iNZmnCWR5OxyqKk+WorZfkj4cc7T7pStmZ6nubk1bLOWb1a3myPut/U/Uz8/alFX60efJmbbvk0rWO3JJ7UvLNMujyXvJ0jjL+8k+aSb2RzlkS9zHznwgNOPavql+Rhytke+7ZF60UaSvds0qr2MpGpY3GnJNWtgMyybfSvzOTbNuP6EqK92BF6Gkc7s2ntyVGrKtyXsQDa2ZtO9rr3MJtoqQHojGX39zbjdGcDlF7Oj0fM5TUX3Krkrr3RNVzjj2cvBai1R6L+ZL6qTpcKkHg32aJo4/Kt/TydMDeOSdcHfB2JP8ADN+nlEcU23wBmcYRacO73TPVhw4tRieOb7W19LW+/ucccYSlLvbi6+nbaz1Y9BlhNqnGUeYvwTR5Z6HPpt5wkqflH1+n6/AngjqYyljcqyRi6dex00eRzjLFqYuUfN+h4tbooaXVViyxyY5JSi4+L8P0ZGs+4+lk0+KPdFRipXaa4aP2/wDZn8Q6jpGoy4oxjljlx/LkpX9HmM/vF/s2fiMF5lBOpKKr6fxH1elSzdMyY9RiydsnvBr+Zf8AzwY6np05vvX9B+MfhhzeLVfIioZ1dx4vzTPwGu6TPT4+7tqeOVP7H9V+Dfi19QnPQ6vHHPgztN4ZpPslxcfT7Hb41+AJ4NVljgw41ce6LxL6ZJ+3hnOXHS86/mPToqevwY4wlOClFuF8+qP9DdLS6n0qOpWOemyZHUcbfCjX0n8Z6H0HPj103JxxyxJWnzu62P7Z8ItZek49LqW1KM5yclyrX+6JbtWTI+d1fS5Z9VhghC8ktRGvZNU3+ln7/Diei+HtU47P5LS/9rr9j4sNFLU9b0+eUbcsX1feqP0HWpxw9D7VssuVQ/LtaNcz7Y7vxH+NfiTSJa3JHu/FjTPxXUUm7XDP6B8SYJPXZe5U8UGn906PwevxNaZT8/Ma/Y68uXfy+HqI7r0Z5JKnR9HVY6dem6PHkjun6nRh5pKmZZ0kjFEGQUnAAAMgEKAAAAEKQAUACAooAC0VICUVKzSjZtLYokYHSEbeyNQhb33O+PE3SS3ZRrBgbaSVt/sevS6OeoyRjFcvZnbDg+Rpn3Ri5TpU3ukfR6foZa6LxxT2VuEFW3q3wkZtWRM2n7MdYZKUIvt7/wDPL2P03QOkajX1hX15sq7sspP8Efd+DXTsfStBp4ZcuKOv1EF9GN/Tgxf6zf7H6H4W6ZqOqZc2p1WOVZpX8qH93F/9T8L2OfXXp1559v2+m6ng6J8PaPRaHtlDTSeSMkv8XM9u/wCyWyP6L8GdP1GLp+gjqo8OWom2t3OX+yPynw98IS63q8EqUdPp0klih9Ll62+Wf2PQ9Pw9NwReRXJJXKTtmOZrffWent0cJRxvJJVe9HPVavDpoOU5XkfCR4+q/EODRaZyeXHBLlyl/Q/H9X+L8b0WTLg/8LKcX2ZtSqf3UeWbvUjnzxa4fHHXf4OHzdZPs08V9EIu3OXol6n8g0XT+sfFvxI8uLHmUJ7OUMbccMPT7n0tX8WYtfqnhnq9Tr4Yts2TFj+uXt3PaP5HzviH+03XYJ4sHR5Ppemw4/l4tLpn3P3lOT5k/wBjn7rrkj+k4dXpv7MunZXLUKOpz8ubTz5PbbaET+TfFnxtrfiXNlWTK9PoU7lcmlN+svVn5nW/Emp1KzZtfnlm1EuJZJd7W/p+25+X6jr9Z1DPLL9TTd90mqX2XCLOP1L3J8P02q+LoaTTw0umi80IX29y7YX60t3+bPzOu+I9Vq8ilnzzyPHvFX9OP7LhfkfK1HdkqKyuUr+pp7UcpThhg4v80vJ0nLle6ajqGXUTbt1d77tnGWRveT/Uxk1SqowjE80sssnubkY17dRlXYl3W6Pn5ssn5pM6Zs2XPU8k+6SSjb9EqX7Hlk7exYjXftR0hkUFe11scFBs0l273TAuTI5u73Obbbqy0rNKFe7NDCg2ajGKfqzVP7EcorbdkCXYud2c3K+Cttvcm9AVTcd06I8je9tmZEtIDdti64Rnu+mvezLYCPJpszRePcI0rbrY1Hc5p0zaKNV+ZVyRM1GSvcDpFtO0doT9UZxqE207TravLNdtEV6seaKg123K1Tvj8jayRltKNnmwzgpfXdeiPTBRktrsg92lhgzVBxayuW0orle531HTVG+zLG14kmrPmNSx7q0evD1XLkxxxZUpdipTr6q9H6kWYS0GfH+KElJcxaPf03N2v5c42n5fKPToOrYcmSD1ODHlj29jhbjfun4Z9TD0rRarJJRySxSaUoW7TRm39ak/Hpxx6bqc8Vk08dLFY1CXyW6k/wDM74szn+GJZ9sS+dgjFuOSMfrX/Uj52p0mfT6nsi20ttvJ97ovUNR0+O7n2ctLwZbj8tLS6jpmuioPdbo+u9bDV4uzJGOOff3x7VSTfJ+ulo+n/E+bHPJ2/M478dRkvuuGeLq39mfVtDj/AI3GlqdJ3U8kFTg/+aPgmr42O3wvr9T0nW4NU4V2SUoZK8r+p/dfhv4gydf0OOM8mJ6ttqSml2zvyvRn8U6fhjgxw0udywuUdr/DL/ufoumZtVoXCcNRbxNONqn+3JzrpzH6TrHwfm0mszJxlDJOXdGTaanvxa4Z+l+H8X8FpMLytrNuu1/zL/c9/wANanR9RcsmtwSx/wAVBd0mri36/c93UekQwzwxlJdin3Rkv5kuRJ9l6+ns00csNBDUSdZM0qS9Im/iyHy+lYor+Xul+kWdOjxnrsUZ5otdjckvC9Evsjh8YahQl8mrrDKl7tbHT6cv/p/mH4/00dN8S9SxJUvmTr833f6n866hp+7DvHy19j+v/wBo3TcmXrD1U8dPUYceVNcP6af9D+b9TwL5HbBP643bXEls/wBi806j8Vng5Lup7PtPDnhXjhn1smHtyyUtk3yeXNhfbbjtdWdZXF8ycOWcnE9ssd2vQ888faUcO32M0dWjNDBhqiHTtaI0QYoG+0naBkGqFAZoUa7SqIGKLRrtNKAHNRs0oo2oHSONNFwcUrNKPsemGFNfhOiwNrhJeoHljj7nR3hhTq3SPQsGKEbcpSd8JbfqbhDudqDjHwTRmGByqEI/7s9unjh0s4Wvmbru7X49E/UYtNPNJRUGo/uz6mDpse5Y4YXKfnyS1ZHkxY1LIm01Fy2XLq/3PtaOWbFmb0+nuKd9slcX6dy/m/ofV6X8Ia3qE1DTaXNqc8tliwQ75fn4ivdn9I+G/hbp3w7Fx69q9Ms0oXPS6ecZzivSU+F+Ry66deeK/OfBPwbl1+qwvPCSll+pOS2S9fsf2Xp3wj8PdA+Vm6hkyZZ7KMMkuyDfoo8s/C9R/tI0XQksfRNBg0Omjt325Tn/AOp7v7I5aP4xfVYS1uqqWuyS/wDCYY/VkhFb99+G35fgxd+a6ySen9vyfEGl6dihh0el/vKtY8cPwr3S4PyXxN/aTKLWDNP+DUf/AC4NTz5P/StoL77n8o6/8d9f6dhvq2ujhlqY98NPp8i7nG9nNLdfm9z8BqPjLPkySrJ2Rbvsg95P/mlyyyWs/wCMf1jqX9pKlnljwSWHJ5yTnco/eT2j+R+R6v8AGenyaaVTnr5XTUZOGNv3b+qX7H881eq1PU5tQhOezk444t0ly9vC9TyKGtenjJYsvypSaWRxfbJrxfDo1OIl/pX3tb8Y63M1hlmw6fTp2sGJdsF+S5/M4vquDV4Mkv4lxzRS+Xijjk3lb5prZV7nwMuGOL6smVX6R3Zh9anhwvDp8MMEX+LIt5z+8n/ob8fxz8v17NRlcY5J5csIuDX9yn9Urf8AoeOepWSL7puMFvGF7RPmZ9TObb2pnK8k1d0vU1IzenseZtSlBqotLnd36I8+TJJvdmHmcdo8evqcrlN+WXGW215ZHNLgqxLyyqEW6SKOdOT817m444x3aN9nb7sst9uAOUrlztH0Hyrr6Tsvk40nPuk/8qdHN6lpr6V2+l/6gO2MFTW/hGZ7Qu6fpRj57u6iYlJy8gW7flmXZY3XBrZrkqaxXnkkjvnnilkk8MHjxt7Qcu5r8/JxkrW1BWGiUXtaK9gifkZfqW6BFSyjt2FFRpbqvAT8F8cCvIFRQo+TSi6tASMnF2menHK0rOCjfKOiuJB0a32OuGUuLdnnjJ3ud4TVcCq9UcrdRe7OkYXwqZ5FNpbHpw6jZdytLyZHq02KayKUfB9+PUofwsYZPmrURajjldwUPKrm78nx8Wux9vbTuqT4r/c64NRKM1JZLd7L29SWa1Lj+gdI+J5YY4cXWen4tXpoNVklBOl6Xz+TPtS6f0bquoeXQZI6bvdwxwdKvSmfz7RdX1WnnJxk5xa3jJWn+R9Tp3UcX15VGOnkt49svpT9kc7HWda/ey+Dc2j0eHWabPjyz1Dfy4Y4b0nu5PhH7T4T6hr9JpnpdfpI63TtVKKknKvQ/mvTviTJizTekU5rJTl6N+dvSz9FouuaucZ45PHjnNqcae8X5f5nO66TK/fS+Cug9blPPpMny4R2lg1MK7G/RnLRf2XwwVGWpnLGna7ZKR+c6b8UabBOcdb3Ty1t9Xn3Pr4fiuepzYsfSdPqFma+pyl9K9/sT/bWfT6+m6b1ToObFp9LqtLqYSn29inTh7yT4S8s+jpupS6vq8vyp/MxQaw45JfS0uWvuzx4J/xsMuKWo+fqsq/vszdfT/lXt7n6X4W6XhemhLGksSX0159y8zb6Z6uT2+5oMUsGOGOVfSk37L0PyXxhlzavq+TBp5KL+Wpxb8uPg/XamfbmeGDX0R78j/oj8L1HUQ6j1HOsO7w4ZOTbOnXxjnxPevzHxh0b+K6TpdQofXiU8L9t+5f6n8O6rpJYdXl0rcnBT+bGPs1u0f6cWl/4h07UaSa7prHDLG/VL/Y/lXXfhTD/AB6yf4eXG9r/AJ4+n35/UxuN5sfxLq3TeyeRxaTVPt8teqPk5dM3heSm1w/Zn9X6v8G5oSno/kznlj9WHKltPG+L/wBz+e/weo0uqeHMlGLlXa3cZP3rwdZ1rl1w/NSwtO2q+5xy4W9kuP3P0+v6TGWRQhab/CpPde1nxNRgeObg1utjcrnZj5TxtWqMOG59OeNtJStpbI4PAka1Hj7WRx9j1SwtLg5/KfIHDtHb6HrhjS/FTXoa/he6DnFfSqTf3A8Pa/Qdh65aTInuv3NrSVG5SQHiUH6FUPY9+PSKW+7OkdHbpIaPnrE/KLHC34Z9bH0+bkkoW/Co+hpvhzV53+Cvy2/Unkslr89HTtK2jrDDv+FI/TPoenwbZckZTX8uNdz/AFNfwMcULhix6df5pfVkf+xPJfGvgQ0mS19DV8WeyXSp4qllkoqvPP5I+vHHHFj7saqf/wBye7/7HOLxKV5G8j877fqTV8XzI6eUvpx49n5fLPqaXo0vlxyZ8nbGK+lSfH2R9HFo9RqNPHPihhwadtpZJTUbr3e51wZOlYJrDLNqeq6p/h02hg0pP3m96+yJas5cdP06Erfz4aaFU5yXdka/5Yrj8z7mPquj0WLHj0PS9PLJjgoLNqp13e/at2/ueSet1Okx4tV/E9K6b8vJto9PLvywa8z5v82fnuq/E+o1Gqy5p5pTeSVyyUk5v12M5a1uP3eD4s1v8JLT9S6pkjgS7lpNJFYMderUd3+Z+Z6l8X6fA70emjkmuJZLcV9l5/M/Ifxuo1E5uUm4Tl3NetcHWWr0+GLckp5PEXx93/sXxS/0r70NdHWyWp6rqMuRvdY8VJ16XxE3qfjvJp8T0XT9Jg6fp3+P5VyyZP8Aqm93+yPyUtdmz5eyM1BPmUnX/wDR5/mdu9W16l8f1nzv0+jr9fqNfqZ6jNkblN77/seZ5+1fSkq2v1PJLO3LdvkJ93CpG8Z19rpfxBqumLM8GrzYJZscsU3ilTlB8xfs/KPHm6rqMkYYXlyywQbccTm+yLfLS8HlUZNPthaW7bMuM5OkTDa1PUOubZ55Tb3bNTj2OnuzPbKXO5UZi5N3SZWpyW7o6LHJOt0jpGEY819gPOsTfqztGHy1wrOzTdtdsF77HLI4uVQk3tu36gc27fCRqEFTlJqK92HPHBXdnN5VOXdL6n7+Cju54YYYzvvm3+CuEvU8bzzbfaqv0NSbm7eyJVcOvcYMfUnb5MybZ0cW9rsnaxgyoMvb6su5HuVNLUTNkvce4G4U2+5NpJvZ0Yth7iVBRtv7GXYtojYQbIGGRWkzSQ+XsvcJMqNUi9j9CxUuatG436AY+XJI1FNHVV5TRp42lFtbSVoDEaXJbjWy3L2sRi7Ioop+TcY81JfmdFjfZ3OLq6b9BGKW74GhBv8AD73Z1hGUVwWEU2trO6g1wQSEeG1u/wBj24O5JLsbZwg8s0lHt2/U9/T8Gec/7x7V5dV7ktWR2hpNTlSn+CK3cm+D3YPmSko4cbySrxG2evp/SsOSSWbU5MiW7jFH2NNrdJ05z/htNntxqo0r+7OdrrzGOm5OoYccYZcWWCuoXClfofQ0+DW4tVjyRyyjmck07tt+yO+kx9X+IorFg0qWG94xTd/d+T9Toc3T/gyU8/UdR/GdUzRShj2lLGkqSVcbbfY52ukj14Ph6E9W+odSc8XzEpSyamS7pSfP0r+h9HD1nT5JPQdF0/zGqU8jW1/5pv09Ir8z831LSdQ+JI4dVrorQabFNzhFy+qV+X6n9E+EeivXabDp8enjo9LGm2lUsrM/+N/+vqdC+G8UKj3z1OXLGsk2t3fP2s/daXTQ6Zh7pNQjCNUuIomh0mHp+NtJQjFfifk/E/Hfx9h0OGWk0045NXJqOLCnv3Phy/2Okni423qvs5uvYcP8fmTcrv8AZH43pT/jMmbUyWVRyzji7YL8Sbto+Z0vVarr3UcfRtFqHiwYsMv4jPJb5Xdzr7y2P2vwksEoaXEu2HynJOH/ADJmb7rcni+307RKeulkWPt/la9FR+V+N/hJ6h5HC4zxvujJenh/6H7PQwz4Or6qc7eOck0vRVyfR6lpY6vDa/F2tXXg347HO9ZX8GhqNRJR0er07y4Y43iyL+aE0/X0ktj8R8S/COLpOqyrRaeOo080snycsauLXj3P611jous6b1R6rS5flyprurZ+VaPdh03Svibp8H1rS48eux432rT5FDu+3j8mcpbK7+rH+dtRh0ep79XDQZHhxdqzYJTpxfC+rmrPjav4bwa/TZ9Xp/8Aw/8ADxg5LJJyWRytbUtuPJ/VPib4awzU8vTprNCe0oTXbP7Pwz8Zl6N1HRZ4zwRz43JVFx2f29zpOnO8v57m6TlT/D+adoq6Xnx8Yu5tVwmfvF0fXZpy/iNDnflzhgTb/RHj1fRdVL6cOj1C+9J/ojfk5+D8Tn6bkjtPHGHovJz/AOG0lzxvcV+x/RNB/Zr1/XOModM1X1eXHt/dn3X/AGQdVwQitTpXGT3Ue7vb/QecP+O1/HZdPjHjuf2R1XQs0sayfJyKD8ypI/sEP7K+v5ciwafpU8Ma2z512o7aP+yBxzZY9Z+JdFp5413Sx4qyNL3tpIn/ACL/AMb+TaT4Yepg3HE2ly03R69J8O43OUMmn1U6i+yOnxqUnLxd8L9z+sz+HugdDcVi1eXXy9dTJqH5QjR8fqXXcummo6XWrSY73/h8McdL77tmfO34an85Pl+Q0n9nvxBqWpYug61wf82WoL96PZqfgTD0pRfVddotLNq3ixv5k1/oejq3X8eaTvqGuljS4eSU8k3+tI+Dm6zLOn8vTdrf82WVsv8AlTOY+jCHTtJFx6bp8+eV75MlRR5tVqskU/m5MOPb8MLk0fIWr7cl6nXQir/Bjub/ANhn6n8/HHBiwqWKDck5vlvyy4zr1YtRgi24rJnl6LZfsc55l3Slk7cMfSEbf6s+dm1WocEnlx4YL/JSPPn1GnUXUsmV+O+VmpGLXqz6/Ds+75rbqrtr3ZY6jNPJCWkx1JKl8xJ2/twfInqsr2VRj6Ixl1ylJuUpf9EFSRcTyfYz6iem7Y9Qk3klFTWOEk9nxdcfY4ZOuZ46WWm081pcE95ww/S8n/VLlr24Pg5M7f4UoL2J8+40r+5Zylr2S1bbUVsl4OeXPBtP6pS829l9jyvIlvdszFub2LiPW9VJrtjNxVb+Dj3qLtK36sLGoLulu/QxLJtsqA08k9qVe5zeSUl22zUe6b9EaWFxXDSKMwjf4meiCuu1Wc4Y7dJNnsxYJuDaTVbcepBzjGSX1yr2HL2OssEMVPJb9ro8uTN3fTFV9gGSNGsfbGNuN+jJij3JuW9eC5M8IQce1d/rf7AVuUuKSXrsjPzYxg5LtdbWeaeRz3b29DKUm6RcHSWWU2220jFuqivu2y9r8muFSQHNQlJm+1RRYx5tUaaikUZVD2od0U7ZG0/IQfsYabNMkpOqfgCLbwK7iWe3p+XQ43metxZsqeKSx/KmoduT+WTtO4re1tfqgPA1uS+aWxrI/q2ObYEtvkNkbJdhV8Bi2S/UiBACD0otIsYmvyNDMU1e9XsdI0vJDpjS4auyK1SktrsvZKvOxtJR2ZqL3tDRzjjk3wezBjxL6sydPbbaiY8cpraP50dMWJOaWRqK8vmiBnxaaLlHDkeWmu2VUmvdGYaVzTbVJHdLBij3KcXLurtabb9/Q9S1+LDia+TDI5Kkm2q+1EXHmjo4x7eXe92evTxxY4tLBCTfDlbr8jemWfUqPy8Kx34lv/U9y6esfa8usx4p3tGK7n+xm1qcvCtP3S7UpNt9zdbn0dLpO1qTTfrufT0vRvntfPeoca7pSSUIxXrJ+D1YNR0rpsYvQYs2fUd1/MyxSxpVx2veX3Zm9Nzl6tF0jPrIPO1/C6W0pZJ3GC/1k/sfYxYvh7puPM4zzdT1Xd24vm4/l4Yr/N23cn6LY+RPqmsyxep1E55lDmU3UYfbwvsjnn0WuzZscYwnCOVKal2ONxfouaMNx9DP8UdX16/gdNqckMV04YEsUEvyPufCXw5l/wCKQzz0+PJ3L/Gnbp+xnoPw9KUMeojirBF1TX4n6v1+x/XulaTT4tDpc2TEpvLJQh2qor3k/Qzb+Nf7TpXwZpZwnq9Wsca/Dkmrr7L/AGP2fStNpNBp/n4YSklG++ezf+x+W6r8RYtH1yGCMoZY6eKU8Uf5L80Z+JviX/ifSHotHk7cmWMo9qfa3JK4x+zpr70WWRmy1313xli1epljllTUJu+zdJePyuj+YZf4bVfHcc2tyPS4sLeSGTs7lmn4v/c6dN0uv6X1XFk1un1cdLPi8b48KX2s/VvQdF6hki3LPp8n4k4Rfbf2Zm3W5MfY0PRcWPVYeo9OljzuKcMmOP0znF+Uny1+40+mz9O648iwzhDJu4yXa37r3Gm0MVjeHDq8N19MnFxkn+R9nTaPqfyY48/UdJqclVGDTl+hYzX6DR6vBnyY1PMozS/nXbI+lKkvxqSPy6x9TwZMWPUf8LnlpuEHkcZNLzR1y9Wz6X5cNQ9DhnOXbGKyt3+x1nTled+H2svS9LrHc8cW/dHk1Xwxgyqlj0yjW94znpfiDSPJLG9bic4K5KEX/VnxOp/Hujj3QXUlgbtK8e6/LglvJOevoz/AKyfThzYoRTtR+UmjxdR+GIdNXzVq+j6VqP1T1OVQS/JKzw6z4t6blwwx5eoZnPJt36rO4wb96pJH5zqHxjiz6LUabRaTDljhi5ZXpsCyJxX83dTfb7mNjrJ1919PpvwXofiDUfO6p8TrV48jbj/BxnHFJLmpySjX2Ppab4d+Dug6rFn6d0vLqs+nn3xzZs7Sv7vn9D+Pan+1PqHyv+H6DT5Mixt/JhFyl2N+kFf6E0/9o2u6bj/8TPVSzR/xsWXCnKMvRX+Ef6M/a/sHWfjV4JylpdL03Fkk95Qg88/1dRR+R6v8T9cy6mMM3U9XiclfysPapJe9bRP5V1T+1HrHUNVKOh0vy5Sf03c5t/Zbfoj5mu1XxX3SfUcstHklFT7NRkjjk0+H2vceN+zyk+H9J6z8RZaalmx4Ul/iZ889Rml789q/JH5LXfEPT9Dp1HS6iCyzfdObalkyP+p+Nnkm5QlrOoLOpW548MrkvbuapfvRqXWNJCDwafQYNNj5fy13ZJ/9WSVt/lSNTlm9vd1L4kzZF3/3spPiNVZ83Jl1uugvn5sWhwy5yZNv+/6HCfWcrcoYYwwx8NVb/wDUz52TqSg5ObXfV233O/ubkYvT6mnn0bS4dRGeXXa7Uxl24nhj8vDJf5m5fV+VHzNXr/mZk3p8GNJUoq9/v6s+bn12VybUlJVbqR4smeUnbpGpyxen3c3UsumxLLhnDHN/4fbhVS333fFHz56+ebuepcck2+663PnvI5S/xIy8J2YeZrhFxNeieZSntDYxLV9q8WeaWST/AJqOVq9tzWI7y1EpctsxLI5bIyrvg18u92/0Ay13eS9rpK9jokopbF7brl+wGI4+50juqxqkrfqd1hlgjc/7v1b2f2OE8sI7q5e7IOc+5v6/yMwxuUtw8kpt+EaVtbNlHZOGFeHIilLNs22l+xIYk67n/wBjvHsi9qSILijJNJI9ueefSx/hXrPoT73jxSuKk1596PK3lmqxRbb22R2hpe3Gu5uUv5q8Ajiscp7OLd8Nk+Rjxu3vXNHScZuSdqKqlZ6Z6TEsGGXdklOVucWu2NeEvIHzsuqnlXbeySiopVSXCOHyvof0pt+X4Pdk0rxXOlFN8I5uDk1CKt+QPLDDxas6KLqopL3PRHBJSXdsaydsIUuRo8nypN77LyHjrg6Lunsk6L27V5KjzSTtmWvJ2nSZxlb8ARxXJjgsmZdlFRJbEukO6wJdk7qD5MgW7ZGPYkueQIQv2AEXPv4DHkjIqkAIPak1wips3CDk0kuTXZs12uzRHPl+EWM2nabtO00bWC1Z1hhiuSDn81rdq2/LNLLlk0oqvyOv0rijtjwTmr7W36cEGIRytW3SLFLvXc217HV4FT+ZOq8I6aeMsuCeLT4E03csjVtfb0IM/Ilts15t7Hr0+m27opX/AJn/AKH0tL0dvSR1msvHg/BGcv536R9T1rXaXTabFHp+KS1Dv5k80Y9sV47fP3bM3puc/rn0/oOrzOGsnHKtNdfNaqN+ls+tin07pWDJLFPDm1S27m+52/Tbg+Xqup5tRpo4/mTySjzkk9l7RXC+55sGqxqUVNQb8095Iy16j6i1mXVZYrLknlg3fbf039j9NoenaLFo8ms1s/l4ccdlH8eR+Ix/1Z+dj03W5cTy9P0+TJCEe+XbG5QjfLrhe531etlWTItPljhnX9w5OXy9vDfKJWo9XS9Lk6xkbyKS0mGTko3s5f8Azyfqo6/Ho+pQ02XJKEIwjF5OWk1ufjuh9a/gdRHI4TWK7cadM/TQ+Jul9SyrT6nQQ1HLxuKanFelrcxW+a/U6n4s06wS6d0VPHBVeTMl/fLzX+U+joup5MvS82nl1h6XDkj9UMi3i/Zn871j0WeUf4C8Hc673qO5RPJrcmt0enf8PqdJljFb556uEkvskyeK+T9+viToiyuesnrvnafHUNXpY/Vmd/haf9WerqPXugZ9P/8AmjEvptxmkmtuHSP4rquv9mnjJ63FmyTbTUJNuNeX7Pwfn8vW8uLLOby487lwnClE1P5s3+j+w5f7S4aJY8ej6tr8iU/rUZNxUfVXyfoNH/a7NYYrHqpZm9l34t2/Tjk/hWj+JNVj7VDU48Kly/lRdfse3N8d6vFplpY5suTCpd7TaXdL12WxfAn9P1/a5f2j5smqhi1ug1PylkUssI/3UpL0trY+Vk/tD+IYdSUdHqcOPSzy/wCFjmlllG9o93h15P5JP4v1GujTxxhkk678mRuvdtnzNP1vVOcpPJdN+6E4pf6R/eMvxTjepfWM7zaTqKXy/nLWd/dHylbPkZ/7TcOhdafNly5Kbk++239z+PxnqdZl+qU3B+PB+i6P0jH8zG8emy6ybVvG3SX3ZLzPsndvw/T6n+13rGphLT4e6EZPfJFNzr0s5Y+pfFXWr1Gm0uq+XH/zJ1FL82bjrIdOipanUaLS4oSSnDBBNx9d/X2N6z+1TR6OGr0HRZznidSxavWYO+SaW6jBPZN+WTPyLufNfq/g/wCHM3V9THJ8SZMuaDg28GDJUl6OU3st/CPrT03wp8OafVRw5dRqs2oxPDLFDUyacX4l2L8PqfxHVfG/xL1SMo6nqeeOKW3ZjXYpL8j52u6jqp6RYsmqyrEuMbm0v0RrwS9x/V+parFh+Xjx/EWPo+nr/wDD6FRx7e/Zcn+bs/L6/qnQdFnyYtLh1/V8k43GcpKHfk83dtr9z+ePXycVCDlS/wAqoxPU5JJcxX33NThi/wBH3Z/FfUMM3/DOOgT5Wnj2y/8AdyfK1fWMuTJKb78k57ynN25P3b3Z50u/HKUu6oLufbzXoeHPqZZXaxxxxXi7bNyOd6eh6zJ33KT/ACGXWRjFNLLb+yPBLUtJx7kk/CRxlmtbWy4mvTPPKTt/T7t2zhkzKNPdv1ZyuV77GJWyo1PNOXsYU1/NuR+g7a4RQc/REbkzfa/RCmwOfY6LGP2NU79TTgwM9ziWEZ5H5YklB/Uty/MbVJ0gPRj08Yf4mSEfbl/ojUtTjxf4HdGS/wDMfP5eh5JyqOzps5qq8gdcuZ5Ek23XqzCTl7Iyt3wdEqTdr7FDZL1OmKck7SdoY16Lf1O8INpJeSDKi2rPRptPLJKMYxcpSdJerPTpOnT1E1CMW2ff/godE0cZzip6zWLtwR/+3i4lk+8n9MfbuZm1ZNfNUXDH2SyNYsaa+j+eT5r+l+x11f1YovFo1pcPakoRbbk/80m+Wfd0fQIqsmp2ml3SX8uGPv7+x4uowetztY4tYk1DHFcy9DOxrK8HStDDL36rNG4Yl3O+PZfmc8mTvm5SaTbvg+t1Ouk6aOhi1LIt8leZ+n5cfqfnNZmaj2J3J8ss9pfTnqc3z8lJ7Lg1iisC7pVb9fJww9sbcnvWyMZHLO7baXBpl6JaivqhytrOUMU8zTmqXhHbBhXdHu/CvBvNm7tscbr0A55e3FGqSZ5ZTnLaKpep6s2nfe1KSyV5WyZxkqVPYDzSg48nN8HrmlSp16s82SNN00yo4yXsZa8mm96L2uUXS8WUcXZnyWXItV7gQjDfuRgLJbaStUgTa9wpwabb8+5F7kT3ZA8kHAICYAIPrQi/Cs6/KlJUZjOCX0xbZv5knGnKMYvlJ7lCMIxdWjpHE7+pNRe/3XsYjljidqq90Z1GvyZUlHHjjJfzRX1NegHW46eXfFKHo3uzb1Mn+GblJ+Ty4cGTLTak37n6Lo3S4T02o1GTPoMLw4rUc2RKeS3X0L+aS/oS+lk14v8Ah88HZDUxcXKKyJvfuUuGfa0ur03TdCpY8XzM/emvmJdir/l8/meKekTyVpsqm/KUTfbrloezuhkx4pvtwy5TfLSM1qenHU9U1muzTz6rI8ilNvfZJv0XhfYYcWXvU5QlU1s68Hd6fVLDjll0ePDBO1JtK7/Pc92kwRi5KepyKHbalgxudv08EMfNeh1GqzZHhg+2K2jJ8nH/AIfq9O3kyabJjjy26S/qfX61oseOGFR6xp5wyQ75d945Q34a33+x8yOLTY8cHizQz5L3fypV+shKuPoaDrc9G1LDl1OKTTi3jnTafK+xvF8X63SZ8nbijlTVY1nfcoP1ryfGy6ueHI7jinf/AMs5RyZM8947V42L4xPKv1Gr/tF+I9Vpf4SfUcccHnHj08IL86R8jUfFfVdTJQ/4hlxKKcV8qsez2a+n1PNBafGrljeRp/h4v2swsPzsmTNh0kMKnJuMFJ9sV6Ju2TJF21nBmzYMndjyzx/8ydM56rJjVJpN/bc3n0+pil9CXq7X7HlyYGo73J+xpnWJahRgl+Jv9EefJKU/KR1eF1faoperM/RVcv2KlX+JjDJWDvxwcextu3L1+1+hYwc1u3f2Mxwdzuq+59DT4IuSUX3NukrJVntMOJdig42/c9GLHp9PvkhXtHdnbL0jqWKbj/B5a4uK+l/nwzwZo5YOeLL/AOG+W6n8xNNfl5Ivw+tpOsabQzWZaTFNx4+c7/ZHbU/Fmu1mKfy8kcGHiSxR7E/bY+JpeoaLSRydmGeXUNVjzZlUYP1UfL+5M/WZ5YKE4wy1vbgkm/WkPFfJ3lrcuu+mUm4x4XCRwx/Lw5blJT9k6X6niy63JOfc0q8JbJHDJltby39C4z5P0Gr61m1MYKeaKjij2QjF32r0R8vJqVKT3v1b8nhjkyNfSjUtLm+XHNPJDtcnFxjL6l916FkS3Xp/iEnS292c8upk1XzEl/y8nJxj21H9Tk4+rKivNV7t/dmHNyfP5D5bXI7PQoOK87fczSvbcrjsRzrZNsA4ze7/AFM/L8sspzWyl+hm/wDM/wBwDSXC3I7Z0WZQTqEZPw5eDHzJyk23FflSAJ3tuaVR5VkUlG3dnOc3J21SKNvL2v6UrJPK0u+cm5tmLit1uyOnyr/Mgy8jbthT9g0myqK9AJdu2/0LFW/Y0oWaUPQCKLfHB2x4e5q+Dpp9NKbVppXye2OHtaqN+xBxhi3pL/sfU6f0yeeUVCDnN8JK9zr0zpWXV5ljhjcpyfB/S/hz4WxdLwyz6qbg19Mpx/Ff+SH/ADer4it36Gb1jXPNr4nROgrp+CWq1WNSipOChe+Wf+RP0X8z8ccs+xj+Gpy7+qazJB6/JU4xkvpwY1/M14SW0UfZ1Gk+bqcWpljxY1jx/wBxhX+Hgxry/VXvvvJ7nx9f1WXVVl6fo5S+Qvqz55czfq/9Ec9dckfF6prv+I5I6Hp2N/LT5fOR+ZSf/wAo8GoyaLp+kjPHkyZtfKV48i2x44LbuS5bb4vhK/Jy1OSWTPk0ejuGlS/vs38016fZ+h8nX5nqtXUOFUaXtsor7GpGLftz6jqHTyOXdJ8P1Z8l909358np1uSM8rSdxjsvc54sblJHRzrCxuMeKLGEZS7Yul7nq1uXvm4RbkoxSbfovBjS41FfNkr9F6gHp6V9rbXhnXSY3ml21Titq9DUc85qWWX1XtbPb0nFi/i8GTUuePB3x+bLGrkoX9TSfLq6QHhywanKK43pHgzSqfbKtvKPtdalpI6vKtHKc8He1jlkj2ycb2bS4dHxcvb3J7teQOM24O0/c4ykmt+fU6Tb3o4MsRiS3F2hMw3RRJx8oxWzZucu4ylswMENcGL33AjBWTztwAIAZFIwOSKhQ01VqrVoAfTedcIw8m9s6fJcYJuCV7pPmi4sMZuqX9DQ5Sm5epqEZTrxR6Y48dUotm4Yu5KnGCsgYc04Km5V7nR55SxqHd9K3R7sHRoSxrUajVQw4d1f4pN+iit/zOWaGjxRh2Qc2l9Sm9n+SIuPLinntTg3FvZdrN5Z5pU3lyN+UnbMLV5IOSx4oqL8JUkc1PNk3af5FHp/ic2DGozyza5UbujlLU5Z28jnL0uTMZdRJY1BrGnf4mrkcYZZKSb+pLlPawj36H5mpc8ccbnLtk4qEHKWy8JHOM8kWoz7vs92SHVM+lbelvBKSacsbal2vlXzVHLLlcla+l+iIa65cyi/8FS33cpbnpXUW8slpsfyMT/DG++S/wDUfNW6t/qy/OcdoyaXtsMXX0cuSeL6U3ByW7k9zOPqstPp1p+6LqTl3pfW78N+i8HhWaN90qXrKTM6meGORLBNzjSbk4Vv5r2GGvo4Os5sDm8SVTXbJzXda/M5z6jm1Eq7oK/EYny5ZfU6YtVPFvDZ1yxIa+lr8EcEcfzM2P5mSCn2qSl2p+tcP2Z49Pjy6nUQwYXCU5tqNySXF8v7Hj+Ym3e9mnHGk++S42Ud7KmvoQjcE5TtvftTr9zpj6xr9JD5WkzS00XLuaxpXJr1b5PlfMcV9KSOcp8222TF178+uy54KGXNkypO0pTbS/LwZ/jMrj29z4q2/B4YzflpF3l5/wC5cR6FkSlcnZnJlU5NxtLwrOXbJ+Cxj6lwauU3twdYY13O5J15MwxttHqhijGCc63Xh7kHJyhCNbv0SN48XfJS7mvRCeNKmk6OsJY0trv0A9UOl/NwPLjyY7XOO/qS9UvQ8MtPHffc7xcskklKq/I1DTQlkUYT7pN1RFeWUIqN0zlKk9la/qe/NossJSWROPbymcZYIKN2VHhlF3ST34MPG033Uq8HuljfiLo4zxSXEQPM4N7pbGexP1O8oTjyjnKDZRntS4r7s5uJ0+XuOxhGFATUa3tv2NuMmjKhuFc4wfoX5fB2UGXsrgI4rHTpm4wPRj0zyM9ENJGLVpt+gV5IYnJ1R6cWlpr1/oe3FopTaikl9j3YemSarHBzfrRLR4tPhlJqEW6PvdH+HsuqzxVUvVrg+38NfBeq12SChpp5sst1CK/f7e72P6T0P4c0XTtHk1UlDWZsU1By5wRn/lj5yy9eIr3OfXbpzx+vg9D+GtN0PBHVZ8eT+9X90ltkz/8AS/5Y+s/yjb3X6HXY444Y4aiGOet7Uo4IqsWmj6Nevt+bPqdST6XGWfPJZus5Y9yjNprSRr8UvClXC8H88y9W1XUNTk0OjXd3N/MzXyvLv0/qc/l19Rer9Wyaxz0Gkk5dzvJlb3m/V+i/ofA1euh0/F/w/SveX+JJ8yflv0+3hHu1+rwdPxT0+iallf8AiZ5f6e3sflNXqoaWTSTnqJ7uU1x7v/Y3I59VrX9R+XieDC6b5f8Aqz4csjwxaTSdfmdcs923cm+fcmLTPI+6W7e50jnbry4tPl1GRUmd5wlp8ksS3nDZteD6TjHT4YuD7JO+31b9T50NNO3F8y9+So5QxrJd234N53KGNRi+di5cnyrhjpR9fLOGTK3Cm7S49gNLMowcO23aqV8H0ceq7IOLaaa7bPjKV2/T18ndZm8cVfAHTPOpvFL/ANLPJNSV7G8uRyXa6+5qbc8HzZyt3X3QHibr/c5tJM05W36Mw9kVGMm1tcWc2rNzOd7UURgS9SX7gLVmWiNhOnuBHt5W5L3DVMfYioxYBAAYIHghSAfUtyfLbPRhwuW0k2n4RxeqjH8Cr8jnLVZH/O/uUfQlhip9s8+HTp/5m3X5K2XBmxY41GPzJestl/ufL76d2ajlpDB9LN1XVajDDTSzv5eJycIUkk5c/wBDzwyZJJRT3fouTxubb2uzeOTTvuaa8geyOmyTVyl2r1k6J/c47XzFPw2ro4/NjW9sw8qbdRW/qwPVN4rksaUknSk9r96MRW27X5bHGE5riv0Lu1blsB3lkjddqSXm7bObyJ/y0zmpKN+Wc3NvnZAb+a73lfsJ5bVdto4yyVwkT5zS9wLkmm1s1Xuc3P3Mzb9eSRRRtZHwiOXgNO/G3oRxAsd3sdU7o5xVcbmt/OwFdJ82ydlvYtbFi5bbJUMCOOnx+p2xxXlox92XvS4A61+ZiUq2onzG1dNIlqeze4HTFkp+D0rOuVGMvueFtY3T9ao1HJs0uBR9WOs00tHPFk00llbXbkU2lFeV2+fueD+Z/L3VXvscoRnKVKV3xvye/Tw0+RLHkbjke3sSjlCDmk5X7M9mDEsbi4Tv1tHpj0/Njg/kRjnXmMd3+h43mjCa7G8cvKfAHvyYss5wWocpYr3qXK9pH6HTfB+HqeneTomeGtkl3S0zXZqYf+h/iXvFv8j4Oj1cHJQnHtlLzHh/kfQWaemUZ4Y98ou12S3Xulz+hm61MfO1mgngyShPHLG06cWncX6M8E9Ntfa69Vuj93p/izHr5wxdb0sNdFfT35rWaK/619X62ejUfDfQNdBz6f1RaWUuMeqj9P2+ZHb9Uhp4/j+aSxNPg5vD3ep+113wZ1HSLvenhqcfjJgkpxf5xs+atBHH9MsOSMvS9y6njX5p4PFkWlk/Rn6DJp5X/hSpf5oHP5LbqOn3+xdTHwpaea5TM/w7T4Puz0uWLXdpk/umd8Oh1GVf3eDFH37LGj86sEpfhhJ/ZG46Sd+n3P0v/DtXqI1PLkpfywjR9joPwJ1Lq0+3T6HNkvj6W7/Ql6WS1+QwaHI0ua99j62g6HlyyTk448fmUlx/uf1fpf8AY7nxJPqmTDpHz25sii6/6Vcv2P0Gm+GvhTotfxE8muyR/DCvlw/TeT/Yxe3Sfz/X8q6L8HarqmoWHTaPPlt8KNya9a8H7fT/AAp07o/bj1eWGTOucGnanKL/AOaX4Yv9X7H3dX1v+Nvp+lS0enWy02mx9vf90t3/AOps9un6HoOiYceu+IsstHGe2DS/+blry6/BExenSc47dE6Jk1uinqNRD/hnQsW+RxdPO/8ALb3m3x6ex5eo/Euh6Z3ZcDxY3jTjgr/D00f+RfzT9Zepz+LPjPVfEWLBodDCWLQ6aP0zyLsU/wDma8JcJf6n876n1LQ6PJ8yeWOt1C2Tyfgj9o/7kk0vWPoajV6jrGZxcsmLSzk22/x5n6v1/ofI+IOr6bpmCOi6aod8l9c4u6/Pyz5vVev59fH5cckli4nJKnP29o+x8iOqxYpPNkqc/wCSL4Xuzc5c7029S9LF5s8rn/LF+p8nNKWfI5y3b3bJrcz1GVPub3OunwvIu2TqEd3fk3I52vP2qbpL6V59T34OzTY5ZMlX6f6EjhULyNfSuPcdTj8mMcE8K+b2p88N77+5THDvWfJkzzj9Ldxh/p9jjkmvkyyJq26r/wCeDtqcscWFYVj7Mmykk7r/ALnzc+VpuPhbBK5yl3S3MZH2qub/AGI5tvhGJvbf7lxByJ3PhMwnT33CVvko7xpx53OuTJ36FQpfTNpfnyedZW6W1JUbjJRabe17geSS7ZNehhu9zeeu99rbV7P1OTdAR787GJJJunt4NSexhlBv1MOTXsWyPcDDdgtESANuW73IUWRUBefBGQAmvSwQgtEKQD3Ptj5v7Ge6+IhQdmvlyNBGLl6I6dsI7byf7GEu3dGXJJ8gdHT249kHGMU99149TOOuXb+xZNc0ooglr0r7jvS4RxyZO57bIkZlHaWRvywpNK7OfdT4RJTtfbwB2WR+qr0E43bcopV68ex5+5lTsDLl58+hO5tla32FNgLvk14EVSNKIBcFUbdk7a5f5Gvs3QFl9L+kyW34QvbcqNKVr2Ktl/oc3NWbhL2Cu+LG57tbLydPlxadPhWzzvLLhOkaxRcnz+pBnK0nW5mN7+DrmUJTfYtq22qzCST5Az2WyU4nRbbPgOKfkC4ZqEu5o9UJY8yUt1NM8rhSMq48PcD6+n1+TTZE1JqUXtJOmj3YtZoupZ4Q6hLJGMpNyzY4Rc1a96tWfAWWUq7t9uTUJvu2e64JiyvsanpmXR5WsU45Ut9nyvU5yyT7k8ndGXju/wBzhg6hOGSFv8Poe/8A4liltlwRmvVfSwPTg6hPtXzouVcN/Ue/S9U0qdZoKa/OLX5o+Y/4Kc6w5JRT4UtmvyK9LlhssuKafCbVmVlr9Vo82gyZVk0upz4PXulf7xp/sfcXUFkj8l9a0uft5x6jHa/WUf8AU/AaTLLSxreLvdOKZ6YdZeLuUZwXdza5J4tTp/QVocOXH3voHT9T/wA+FNX/AOyX+h58/T+nRx98+gaZesVrs0Jfoz8jpPieemn3w7YSXEscnFnvf9o3VYSpazLJekql/VEyr5R97RQ+GLay9IcH5T12V1/+0+hDqHwrpI9uPo+PK34lqMrX7UflI/GWu1uWLz6TBqIef7pKT/NHoy66OocnPo2GMJJdvbKUZR/O9yYa/Sx+Nul9NyJaLoHSoT8Nabva/ObZrN/aV1HJLtepnjx//aw/Sv0ikj8nhhosWWU9TocaxyVb6hpxfqe99X6JDSww6Tpi+bBfXl+fKbm/0pL7DF19SfxB1DVS/wDDQyQU+Z5Jdt/dLf8Ac1Dpeonljl1nUJ4k1+HH/d2v6s/PZPibVZ8kVp8eHT44ql2x499+WddJ8Q6XSwm55Z59a5L6nb2+/gmGv3/Ter6P4awLLosa0zj/APqMi+pv/lXLf3Phdb+Np6/ULqerUc05P5eKeSqpcpRXofj+pdbyanVfO1LeX0xJ0q9PY8OLTS1ssuu1WbBhXclHBHlr2XhL1Y8V8/x7eu/Fms6nlePHag3+CGy/P1Z82Gh7VLNrMkcbik3B/i34N6jqWn0OTs08VGX+erl+R8fU6rJqZvd03dN22/c3I52u2q6pHtlixRUcd8er9WfMySc97PXh6e3Fznslu7MZIKFNR2ey9zTLjijxS3Z7MeJynGNP3Zz08XGTySV+h+l6Iv4OMeq5tNi1GPTyUuzMrhOXiMl5T9PYlpI8Opw4tHj0s9TCOSORqS06nUpwT3ba/Cnx6nxMuZPNkklTcn2q77V6HvzTg8+XUZo/VPuaUdkm/wDRHysyUVdiFefJkcZ3b2dprk8mabnK2229235O2Z8e+558krl6GojDezOd2WT5RmtkVB7F7vBG+fUy32tNFG413bul6nTPlvHBbVFUtjkuCZZNRin6WQc5StWc5SLJ+hiWxQkzLLflklyBlgX6mWBZWm16GWy8/YiQVLLQoeSDeLLHHHInihNzj2pyu4O07XvtX5nMrMkFBCkEBQB9FXWyQ7ZOLbaVK6fn7HJZHVyk69CPUSfMmXBqXc/c4vfkSzydpOk/Qwp17gdZNY4qpqV+j/qcpZO57mZOzIHRtJe5hMiKmvIRq3sL9SbPgWXRtPc1dnNOzpEBVmu1lVLktuTpeQEYcnRRg4xruct7tbGHKCUak22t7XDJLJtQFpN2xa9jn3e4sDVtmW99iOXoSyjV/qai7MLk0mB0+xuPKRzidISS+4GlB3dpNeBunaRHJp2WWXu3/Ugz3fU1VGt1uiNd3B1xQ76hsm3y9kVYY5bWYnFOVlcZRe3h/kdFByXBBiL9OC9mzpHWeNqKnK6e2xEk1yQclszqs0uO5mVs/qj3IWk32xpeLLg9C1KaV39+TpHVW19S29fJ5HKVUq3Kk2t0iYPrQ1GKT7p5Mkb/AMu6OmWGmhOLhqYamDSb7bg063TTV7evB8uEXR1xKUWqtENfThqNHijb07m78y4O66wox/ucOHBt4jbPmKOWX87NQwzbSeSvWyYuvrw6/qY42nq5Q9oQSbOc+qxzQvJnzdy4tttngjDFKajLIkrptvZfc2vkxyuMX306TiqT99y4a9WLURkm545yfhyex6Ya7Jjg4xX6bI8ndG0nSXu7Oz12DS5Kg4y2/E47/kiDpDQ6zUqOXK8kMU39Leyl9j25I6DQRSjkebLW/btFfnyz58tfn1Cirahwk3bosNA9RlTyZVCCVyb8f7kxdalrMuozxWODySpQiorx4LkjlxSnDJkScXUlF7X9/Jp54afE8OGV27df6nnWFzi5TlsuIlTXmk+93FXbq2e3RdPlOSk1yd+n9LlqssVSXmnsl7s+tlhiwaZxhJKMFc8r2/T2Bj4/UccsOWWKeRLFB7uP8z9T5qw/OyXG3Hw2dNVqcWvm4wco41v3S/m/I+l07PpNFp3KeP5uRU4pq0mBzngaxxbtQhFKKly/+xjVdZyZtPh0spKOLTJ0o7Jt+WvL9zya3qss2aeRpK3dLhHy45e5tt7t2MN/Hs1Oplmld7JbI8LyWuVv6jLl8Un7Hncq2RYhOVx+x55ScpNvds6Tl+Zz3uzSMvdkk/CK+b5OcpehQV+SSq7V17hFSTQE7tkiT2/NB/iM5Wml7AZydvfLs7uy/p7ua9znJ7FkzL4sB/KHwS9mRvcDPkhX6kYDwVLYlWvQt7EVGGLZGQAAQAAAIUAdHk7jNkQs0FsebKAiNhb+CtWK2sio0AACAFFG4Lc07/IxCVGm/UI3Fpcjus591mlJpbFB8juRlsnIGmxfBAQWwnSJ4Kiip+eDZgoHRM3HZ2jkmztGH034Akru/UbhhSt8IDvCCd9rt+EajkpcLY542237E+a3dgeqWsyPDLDGSWObTkvVri/tZxUt/wDY5w3ZpNRfr9yK98ssM2OK+XGMoxUfpVd3u/VnCeJJbN/oYhkpL2O61H09ndJwe7i3tYHHtkvGxOx204tM7SnFqv5fRMkopRTbe/uBmOLuXNHaEIxW9tmYZF8tQ7eJN93mvQ2pwf8AmZBXJLgiyN7WVzi0u2Pa1y27s3FycUruvYiMylPt2bRIzlHdtnTJF1vT2vbwce1vgK6z1M8nZbdQXbG/Cv8A7m8c1zu/zOCx3JWdoxkqpUij2YtRkVPFixwajXc13fn9znCCk25NtvmXqXHGVU4n0tD02ebBmzuWGEMMVKSnNRcrdVFfzP2ILpseNLuinOMFcr2SX38GdXq/4mahp4yhCt7fH2PRlcflOGJtYFT7Wqcn6s4QxU03HeXCIrHb8mCVbnswY4qEZyX2LkwuMalTf9D6XTcGPV66GPFJY8MVc8s9+yK5kKR+i+Hvh2WbpWu6tq3HSaPBBJ5Mjpzb4jFctv2PzvxV1PpT0H/DtFgzvK5RlPPOVbLmKivV+W/B9LXa/Fr8cvkSmtFp/qub3a8X7s/BazWyy6jLlvdtska6/COSGGLVP/UQ1Pztm+2L5Z4ZZG1b8moy7cd8KjTDOeSi3TtHHv7Fd7kyZOEzi22t2XEblk7pN3X2MX+pDMpOlu9kXBqU629TLnS8HNu/uZb3A1fJzluzTexiTKNKNJbrdFSqk3Vvn0M3SI5OgMXuyTexdnvZl8gYZLNyi6Ob2AGStke4CxWxA6va6IKQXW68BvcKnkMAyA8AAQpCgQpABpI19kRPYN+hpFp+RuyW+CpNhWbKi9jTKmo8LcgwyWWUmyJWBQHsSyoq2NIiY7qA1Xkl7ku0RgUtrwREKrSFkARoJkCA0Fsw6VUOANJ0z3rXy/4f/CfKwqPzPm/M+WvmXVV3c9vmuL3Pn+6NW6A33WzS3e25xvc6JgdIzcdlsTyRTp8Gu5egFWy43Np1vwZck62S9kHKwrqpV6UHK9vByTs0mEdVJJq90bu1tucNm9jSsD0RuMfYu/KRzg62bO8Kat7+xBYxUufudsHa04pxj7yZwnK2qEFuQdJZPFvcsa8N/midttUdcWN3wRXTHDsW6jvx6naEVOaUU5P0MY4xjNSyttLlJ0axZ6n3QjT9QPfGGPA8UszUYzj3VBqUlvVNeGdp6yGSEe2Ll2bJPwfKUZZMjlOT/wBz6egwxv69ordgenFix4cfzczuc/wwOGfUfwsJznJPNN12rmKGTXd0p5KuS2h6RRnpPTp9W1kYyv5bf1S9PUK4vPqdVc1Gscd5VwkfYx67R6Xp+XDgxznPIl3Zsrql6KK9/U8PxDr9Dm1C0+gwyx4Mf03e82vLPFjmow7pr6Y+PVgenX9RUdO8UNm490vdv/sfnpzVS9Wj0azL3d7f4pHgnOtkJEtW739CyzXS8I5d2xmUq3KDnbMt0mYctyt/T4Kh3GZPynySUtjDk2ii3uZci1fsZfAFbUm6Sin4I6YXt5Mtga8f1MSfgtpLd8rajm3uAvYsatW9jL2M3uB9HX4tFiw6Z6XU5M054e7PGeLsWLJb+lO33Kqd7c1Wx82RZTb8mW7IIAVrjdblGWQr9CEqqnW5GAQAECACF2AAAAAVIDVB+xSqkuLNIiX6lva/Qdr5ZiTAspv1MkW5rgilJLdhEHBQe5Ukl7mShBhl29SMAVScJXGXtaMloASihIKvsRFoVQRUgi+NyLnkoo3FlSAq2RVwKpBKgFHRKkZuhYGuSpebM3ZpPwBVbdJNs0mZZUrA3t4CfhkW3BarkDSOiTTquDnHbk3BN8bAdIUj0RSlscYx7a3OnzEtkQbUKdPk3vagnavY5xcpbHvjp4Y9NHK8sXO94rwvV/7EoxjxJfVN8EzaniKSil5XLMZtSppRVUvTycIqWR1yRXbullex7tPp3CCtW2Y0GmUalNqnb58I9P8AFRcmo/ZeyA64sMY7yXHoe3Bgy5+zFjj+OSX3b2PA9V9LjDzV+59F6qXTNKu+parJTWNq0oNefR3W3oFjr1HpOLp+J4cuf/xsck8ebAobYq89/Dv0XB5NVkl0XSz08ZShlyR/vK2dPwcHr4OMZOXc7+qKVJHydbq56vUSnOTe/LYFwSc8qnLzwvQ6avWOS+XGX0J3S8v1PDPO+I7I45Mrk229wy3nyuUuf0OE25SbfJJyMOV3uUHLck/wJp7+UZcr8GJPc0K5Nu27I5uXmzL3InRBqXPqRPYj3MlGpS2JKVonI8gFwQ03RhsCPkj2D4D33bAxJ7mbDdsgBgNEIKaaW1PxvfqYKn6BUfsQr2BBAA9iAAQAUhQIXYgAvJeAg7KN2qKpr0MV5Lwr8lGnP3OdWV7svBESqI7KyFUBAQBRpszyACAAoCFlQ8lTIlbSSscBVbKmSbi5txTjFvZN20iJgbsyLBUXyaT2MI0iC2bbpGL3KluBr8Ww3Qir2QasoqNqTimlwzCNJWB073JNUlfJKEaQq2BuFeTqsinK8ilLarTrxscLpbG4+7A0tjUW2yJ+r2NRk1wBpts6RimrfoYgdUlJ/wCVehB07oqVKXel5qrGTJKSq/y9DEm8TcUq9SY13vyQO1xdctnpxY3Jr0RYYklxbNZMk+zsi6vmiK6zqlFNWawYW5PbufoZ0WklqMiik5S9vB9LN8rp0HHCo5Jyp/MlFqUfWvb3KO+iw4OnQWo1CctYskZYsMoqWNx3vvXN3VI+brdRLNkm1K5Sbcmcsurnk7pXt5flnmlkXHityC5cnZjpM885tUnWy8GcuS2lZzu5UUVyfJyb+o1kkrOTe4RZS3My5atfckncmZb3KCe5lvbxTI3uSRQ3F7mbFgaW/kjImGwDdETI3sRO+GBqUm2Zck65v9jNksDVjuSTW25iyWAfINqMJY5SeSMZRqotO5fb7HJsCtkFhkU5IikINECFgQAqXL9CCENXsQA+SFAAUVACJ0GxQexQtmo0Zo3fsltQFoj32I2RsqDIXkMioXwFFt0k39jTjKKe221gYYHk0vpatK0+GMGQWT7pN0lbvbglDAArayiBwh4AsqDIVKygTgFZCimkZSs0l6gVMqIi0BUaSbIuaNV+oFVMq5CVbF3sDXBUu7YylfLosdgN9tFW3gRNcc7AFGzST3LapcbfuJtdzUW2vWqILGT9uKOiaqrs5RTbpHaEHxQEacuEevTYXabR0waaNJtpX5LlyVePHW2zadkGsuSMUlHjm/U5adPJNt/c6YcMfxZm1GvHPsTLmUbWOo4vTy/uFeic3OffLL2Xz2KtvsjyanWfN+lSb8dz5Zznm+l+55k/qA6/Ma+nwSU9jlKVv2J3K3fAFk7e5z7t2VvcxLZ+pUSUjFiTtmboC2ZbFkb2KI2Z8kL4ANksD3sAh9xZLAPgwa7qdmHdgKI9y3uHv55AwQ09mZApl8mjLJVPJSFZBAtwXgDc/k/Kx9nf8yn3uTVc7V+RzAIHLDfiirggBBmlJ9tXtyZAFW4X5FTpFEFpBuyAL2AIQavYEQKLYbIAFuqKt2rde5ABpvtk+2XHlbGQALW1iwCgiMqIQW2+QQtlBsEA0aRGLYSsIFFFKCKkQqBraVcglhALNJ2yV6lToDdv0K3t4M2VAVex0irMJG4ugNd3psgtzPJuOwFto1GLYtfmdYKiDUY9qXqenFgk49z29NuTemxKLbyQttbX49yavVPFJJPul7+CKTk3/dxT7Vy/U3Gfy47KMTyfPbXc3uYnmck23YR01Ooc51bpcGHl+hK+Tz93e92TubdlHT5jI51TXJhsljB0jLyZlL0Zlyoq3QFT23MyZa3MN7gRkkV7GG/BRLpiTIyAPIfgE8gCWJcksBJ0Zvbcr+5GwQbI+AQByGR7BPxyFOTJRJ272X2IIR7lIAABAHgAgAAoAAgAAALIUALoEApCgAAAAZ2wYseRZXkzRxOEHKKcW+92vpVcPl29tjiBYycXaIAA2ABRUPuG7CAJgtBIoUZ8mzL5CIOClS3sCJWaS9AvsWyiPk3hnihNvLjeSPbJKKl27tbO/Z715MWRkUTNJ+xlFRUasvdXBE+37tADVsE+xVYGosEXJtKwNQVo1W5FJpVYA0pLwki237mLNwdb0n9yDeNXLyepYXjXdk5aTjTT/U8yk06s6PI5KgPZj1HyccpNJ2qVnjlkeWbk6V/sZyy3r0RmP0/cQab/AEJOW2xG75M93oUNkt+S1tZmrZtqopepBFf5EbonCI90A3e5vhpWc0za9QNSark5PyWTaMp2wNPg5yOnjg5y2QGGAVlEsMg5AmxGVk5AngjRZUuNx4AhAPHIGXyRGmQBGTjK1W3qiAfYgJBkKFRgMvbLt7qfa3V1tZBZOLUe2LTrdt3bMgEAAAACAUhQBCkAFIUgFqiFIBUr2oq2+5E/BXu9wJYIUACFABoeQUPPqaSIlZ3w4/mSSSt+hYOVFUTtkh8vf9Di5Nu22ERvxwSrNSdqiJquQCQdEbIBWFsSwDGmRIAAtjUd0ZKnsBryL9hdgopUiKi/YCo3GkmIJNO7vxRXs6/oBWty9y4oRk4ppNpS2fuZAcm1sjPDKrCNxdnSL49jlE6IK32dybM5F2UjcHSdnPJPcgxKRLMt2LA2uUays5pmm7oAl9JmT2NJ+DEkUEbT2McDjyAk9yxMy5JYHpmouMOz/L9XuzzzNxdqjEnyQYIVkKAoWR8gGZbLZlvcCsjFi7AhHwCpNxdLjncgyvUMAolELYIqclCHiwILdVbr0Lt5VkJQABAAAAAACFIAKAAAIAKQAVB8hAAAAAAsAACjUT39O1ktDqcOqhHHKWGanFTipJtO6afK24Pnpl73XsNH0+tdUydX6hqdfmhhhl1OSWWccWNQgpSdtRitkvZHzWydzZL9yg2TwAQVbgiKVAlhgiqXgiBRq9iBBlRpFsyi+AL5NLYya4A1G3sjfhHNM0nfLAppephM0ntQFRUjKkW9+QOiR0Udk1ucovY2n9JKN3UGcJvb3NymcpSdgTYCxZRU9zaRzR0TpAR8huyN2VKwK19NmLNvgw6ILIwblVGE9yjrhaqSflbHOS/U1B0yZH3Ssg52G/QNEZQZFwLJYCyFZHuBGwGS9gLaJ5AAgk0+FS+4Zkg3DHPK+2EZSdN1FXst2ZqjUG4u02vszNiKWCFsIEKQlUABAAAAhQAADAgKQAAAAAApCkAoIUAEAALQKiiSpVV8bkLJU+b9w0BAVcjjcCAeQAAAAAAUMhQKmCGjSKgEwBpFJ4KlvQA14JxwLApUzKLYGufIIuCpgbT2NJmE2VJogkmzLLJkKBbMvYXsQaN/yrf8jESrYoqVs2qqzmnua7nSV7LhEHV9qxPZ9z4d7Hn5NydolU9nYB/UYpnVV2mZ7ASGyJLct0jIEodq9fAF0UYZk1L2JYEFgjAjBSABQL4AzVsV6l2AE8GTTIQQFfptt5Ci2m0uAp4Iaq43a28XuZ+xAABAAAEKAAIUgAFAEBSAddPp82qzRw4MU8uSbqMIRtv7I5tFhOWOSnCUoyXDTpkAhSFAhQAAAAq2LfqiCyg3u2QN2AC5K68EXuPsBWqIABdhsdcmrzZdPh0053iwuTxxpfT3O3/Q4jRfBAwAKiFQFRfABUPJVwCoopUbx5ssMU8UZyUMlOcb2lXF/azLAnkWByBUXkiCsDSexUjCNLcDRX4MorTAjY8E4D2AkqKtzPKLEg0tmV7mb3NR3KEedzRFsy+SCrmmLSfqSUt9iN7gdHJJU1scq7maluSKVgRoVsJc0RtARpWXtThKbnFdtVF8y+xlskndFEbvcyadpUZAMMACMhQBBYJ5AAAA+SF2IAL3NJpN78ogZKqFaVL1IKIAFAAAL2qyAQoAgKQAUhfAEBa8gAQpABSFAAhQAAAJ0GC9vo0wIQrVAAPAAAAAByAUACiCFIXwUUABFRURIqKNR5KRclYELYoewBGkm+CJF8EAIsVYpJ7plAX4QWxAFkbsj9wmAKmPJEBryaVIyUg0mG7C4G1P1AR9ySKmGm9wNfyrckXQ8ESASduzLe5rwYYEYDJbKD3MmjJAABQIyk3AVtfghfBAJQbKZIokCogQoUGCCAtE8BQMo2r3A1jxSyqbjX0R7nbS2v8AfkwPAAC3VBAghSAACgAQoAgAAFIUBt6AFbVUlv6+oGQABWq82AQCgAACFAAAAACgUgAGqpJ+oim79it3+XgsDkUAVAoTsqQBLcthpUSgNC7Iaiv0IES1Za9jUVboCRQ8h7EboBZm3V+BZLsAwuSFKDF0A+AKnuaW5mJqHJBvwPAnyRukBKNJ7Ejw2PAFBE7NbU7u/AGWYfBp8kYGWQ0yVZRBRWqIBlkK15IQAGChIiKyIgN+3BCkKFgrRCCApAADLsBL2BX21snf3MkUCdcAAAAQQFAEAKBCggAAAAAALW1gAax5JYp98KtWt1fijAAAAAAUAQpCgAAA8gAACohRQmFsx7lRUy1Rk14ALZm0zHJUUasIIqAI0klyWLSatWaq9yBtVme6iyaMNgaTvkjHCIBGtrIivcn5AAgAAtjyAKjcXX3OZtcAbW7I2WHmyNbgOGV8i9yeQHCK3sGQCWBwHwBlhfuGFaAN2RutikluBmgy8Il2yg/cnIYWxAJRQBKAABmTTJVgAOAAC2I92VOtq2AjIikZFAAQAAAICgQAACggAoIAAAFBAAKQAAABQQoAhQAAAAAKq9wAAKKAPIFSLVhIUVF7Wkn68BEKii16G4K3RmjpCLsg3KKh5TMd97FycnPggt7kF7gqgRPAQFIWyMIDwEWyiFSsjW5eCAbjuYNw2A09g/US5K+GBgeSFAN2wQoBk8CwnyBCWWiAEiUWw9wI9kQrIAe5Ck88gCclHAEXJR5AEphIp0w9nfHvvttd1c0UcmiHbUPF82Xye75dvt7ua8X7nEggLZABLKQlUYDBAAAEBSACkAFIAAKCACgAQpABSFAEBSAAABQQoEKQoAAAXnwKoCigyFCdO0EaXCLsRFKLQIWO7A3GLdHqzaeekyzxZouGTG+2UXyn6HCD7d64N5J2iDi3uZbs0zJQAIwFFHKDAeCFIBVyPJC/YAw3uABTXkyjSA3zQoqWxG9iDPkBi9iiMCqRAKSiiwJ4IWw+AIEh5LwBKI14K2IunYGCh+gAnILQAjAY9wKS9itmWBGRlJVgEC0QgEL4FBUAAAAEAEAApABSAAAAAKAAICgQAAUhSAAUACFAAAAAAAKQ0WAVxcXTIk3x4KUQoADk1EzRpbBHb8KRJbpEW5trjwRXN8E+5qTpGVuVEZCt2AotiWVbECKyE8l4ArBABW/1A5FAVGo7tGTpj5IK3uyIS5F0BHyR7edivclWUUlDgqfqAa2MlZLAgvYMcgQWWiVXIFIUUBOSGqJVICENUSgJQDAAjKAIwUjAjqiFAEABBAAFAAQQFAEKCAUAgAAAACgACAVK/KAIBQQAUgAAFAEKAAAAApCoooTAKiloiRpAABRBvGeiT70r8KkcIo6RTYHOcdyeDozDYGPI8loj4KJ5GyBWBPIFFaIHJGhwCiopCogXbNLkyVcgabHCEfsWtgMoo4JYFaVEK+DJQJRSPkA1sSJfA8AVsiVhFS2AUOC0CDNBlZAFWSigDLQooAzQK+SIoEZqjLQEDLW9WRqtmBAwPsQQFIFAAQAAwABABSFAEAAFIABQAICgBe1B1e1/mAAAFAQoYAhQAAAAFQFFFXgAoQ4KmRF+xRpbhbMiNURW4p/keiHy4wn3dzfb9NVz7nnTaVWO59oFlt+ZHG1aJ5t7lbVbAZfBOQ3uG2ERkFgot0LsnkEFbIGggKEPIvYC+CxJE0gNcBCwBHuR7FI+QLdmWqQTBQ4I34AAeCWUIBGioiNJAWiFshAaMtGiMARj2DAhCirAhDVGWigm0LBGAZGABAARQhQEQFIFE6aDbbtu2/IBAICgQoIAAAAoAAVQKBOAAAHnkAoUGmnTVNF5BBAClEAACigAACgEX3J+RUwihABVRpPYwi2BtseCWAjXggTLKnulQGeCcmjIBLcPZl3MvkAQoAFRABWFyEX7AVcFird+hEVOmUX+Yt8Gb8mkA4RluzRlkGWEBdASijkAEVqqIlZqqVlE8GlwEK3IIxygyWABOS2URkZqzLICL5Mo1XABoybMtAZfIDBRlg0ZYERpJdrfck1VL1MlIJ4HgAKgKAIACAAABAAAAAoAAAAoAFRAABQIWwASLk7O7+77u3b8XPG5Bt2+4ELv6AAQtjyhXIBFvwABGVEKBbBC/mBpAzZbAvkrMi7QGkzSdmVsVBF4RGhdhvwFDL5NqVeLMt7hEIVgoDlhblIBSFW5VFsPceS8gI2avaicILkIXRLKyLkgNEZplcX29yWwHNFsrjtZEtwCOiTZhcnWL7N/YDD2D4NN2jDewAnqLBRLRLDe4ZAsEYsoWasyikF3DCdl8gYaIaaIUGZZp7GQIwVkZBB9gAoRlAEAoEAMAAAABCkA64sEsmLJkTj240m7kk93Wy8mGgthdlEBbogApAAAAFIAQAClBAAAAx45AJlIEBaIAgKSwVprYAhYAFHAAFv/AGKnRABpMNsyihCxYAU8hgPgC2QhQgVbEQKqlRBZBqy8GU0wEW0yNlJywL4NKW3aSMbsvAF3MNUzalQlT3AzHk1J342ItixVgRPaiM3KNGUBh7CyvkjQGWUjK3sBDPBWQC2aeyMGrtcAVNCzN7j3A1ZLJe4A02+2vF2Z5NpJxVXZlqgMkNMgGQUlBQlWUUA8EKQAKL4IAABAIbxz7JqXbGVeJK0zPkAAAAAAAAAAAALZABWLIBQQFF2dACgBCkAFTIAKAgwA4Ae4FRURFQAoQsAUl7lAAEAtggAoIVAAwAK+CB+gXARpKgQvgAaSMo1wB1il216kcH3UWMrjdcHRLuphXFxcXTMtnXKcgh4o3jW5iyxnTA7ZqaSVHnZ0e5iSYGfJJGuTLQGeSWafBkCMAoEHgAAyp7GSoCgJgAmaf3MlQEkttiGn9iAZZZdrrtTW29u9wQCUG73K7HigqEKKAIgKwIACAAQCjwAAAAAAsV3OrS+4E8j3QAAAAADeLHLNkjjhXdJqKtpK/uwMArVEAMeAAAFgAUheQCAAAAIorVbBMg8AWykFoClIANEYAAAIAUgCBQL2AAF5CoXkBBA3yjBqO+wHSL+k7YWnJJukcbqNebJCVMK65FbOLRqUt7szdhEC5KQDcWjp2dy2OSRtOuGBzlFoyd3K3Rhx8gcpIzXk6OJkDFCtzVGQDIysjAhQGABCgXwLpEFgaTsjFjlAQhRQEAAVAUjAhRuAIAGQAAABCgAAASuwCAUAAAAAAABgAAAAAAAAAAVEAAoABFbsgKKBQACwANAlgChGbLYFbBAgNcEA9wihECYVsyxZQIjcUZRuwihLciZuKsDD5ZCtO2PAFRCsloDSDdbkTQb2AORVO1Rh8ETaA6qjM4p8GbCmwI00Zo33WyMDBDdGWgAoIAZ8gtEYDkJgAWyoyArRAGEPIIAoQACAtEABgEAhQBCggFAAEAAAAoEKAA4AAAAAAAAAAAAAFsAAABQABCigllAADwBQQAUAAUArAALggD3KQt0BQtyBMIqNXsRhcAaienClV87HlXOx37vl/TafugJki4u2jl3HaeVShT/JnnArYsnJANWL8GbCe4FsWGTwAsWQFGk9y2YsNkGmSyp2iNACMF5QEMlezMthVIABVsCACjwQAAAAAAAMAARgAAAQQoAAEKBACgAABAUAAAAAAAAAALt2wAAAAAAAKbAAAAChEKKCFIACBRQQoFCfghQKRlW+5PIFIAAKiADTewjyTwLA6Lbckpt/ZGbIwi91i6Ig2BbZPIsBRhBFYRGARgBYAFIEALwO4jIFW9y3ZlFuwIyM1ZlgQoFgALAAewYAEKAAAAMhSAVEAZAHgAAAAIUAAAAAAAAAByAAAAAAAAAAAH3AAAAPIAAtOrIAAAKAAACgCAUpAUUWEVAF6jkSa2oALoIEArBLAFXBBYAqYZEygFsG9yWAiggsK0mUzYfsBW6JtRGVAEPJaMAaIAwLZkoAhQyBFI+QmAoRFAAgBAAAAIABZSCwF7ABgAAAAAAAAACAUAAAAAAAAAAAAAAAAIAAAAAAAD2AAAACsEsAUhSAAUgFAACzSMlKLJuTbfLZPAAAAAB5BAigAKEDAAAALAAFsqMlQBmkQ1FUER8GDU3vS4MhVAFgQCwAYAAgAIABVTe7pAQAAAAUAAQAAAAAAAAAAAAAAAAAAAAK4gRgAAAAAAAAIAAAAAKqSe1359AIAAAAAAAAPAAAAACgAAQFFKQWABQBCkKBAUgAAAPIBLAoFgB5ADAFRA+LA1F7nRuMY+W2v0OJWwI3bHglgCgBkAgAAAAAAALVEAAD7AAAAAAAAAAAAAAAAAAwAAIAAKABUejUf/h9N/0P+oAg8zCAAD1AAhfQAAgwADAAFHgACB8AAPAAABAAAgABVyABEAACKAAAAFfBPAAQXIAKoEAQPIYAQDACjABUEGAFEV8AEEYQARAgAqsjAAAAAEABfBkACsIAAPIAAAAAAADAICDAKAAAMeQAP//Z";
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
      className: `rounded-2xl p-4 transition-shadow duration-300 ${className}`,
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
        className: "w-full flex items-center justify-between px-4 py-3 rounded-2xl mb-3 text-left transition-all duration-200 active:scale-[0.98]",
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
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 mb-3", children: tiles.map((tile) => /* @__PURE__ */ jsxs(
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
    )) }),
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
    ] }),
    /* @__PURE__ */ jsx(L, { children: t.newEntry.emotionQuestion }),
    /* @__PURE__ */ jsx(EmotionGrid, { x: point.x, y: point.y, onChange: setPoint, accent }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: submit,
        disabled: !canSave,
        className: "w-full mt-6 py-3 rounded-full text-sm transition-all active:scale-[0.98]",
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
    ] }),
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
    ] }),
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
    filtered.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: t.log.empty }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filtered.slice().reverse().map((e) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl overflow-hidden", style: { border: `1px solid ${BASE.line}` }, children: [
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
  return /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
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
      tagStats.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: "\u0414\u043E\u0431\u0430\u0432\u044C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043A \u0441\u0434\u0435\u043B\u043A\u0430\u043C, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C, \u043A\u0430\u043A\u0438\u0435 \u0441\u0435\u0442\u0430\u043F\u044B \u0440\u0435\u0430\u043B\u044C\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442." }) : /* @__PURE__ */ jsx(Card, { className: "mb-6", children: /* @__PURE__ */ jsx(TagBars, { data: tagStats, measureMode, currency }) }),
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
    /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.inkFaint }, children: t.challenge.footer })
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
function Coach({ entries, accent, userId, lang, t }) {
  const [analysis, setAnalysis] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const loadedRef = useRef(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    loadAiState(userId).then((s) => {
      if (cancelled) return;
      setAnalysis(s.analysis || "");
      setChatMessages(Array.isArray(s.chatMessages) ? s.chatMessages : []);
      loadedRef.current = true;
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);
  useEffect(() => {
    if (!loadedRef.current) return;
    saveAiState(userId, { analysis, chatMessages });
  }, [analysis, chatMessages, userId]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages, sending]);
  const compactEntries = (list) => list.map((e) => ({
    date: e.date instanceof Date ? e.date.toISOString() : e.date,
    instrument: e.instrument,
    direction: e.direction,
    outcome: e.outcome,
    r: e.r,
    setup: e.setup,
    mood: e.mood,
    notes: (e.notes || "").slice(0, 400)
  }));
  const runAnalyze = async () => {
    if (analyzing || entries.length === 0) return;
    setAnalyzing(true);
    setError("");
    try {
      const res = await aiAnalyzeCallable({ mode: "insights", entries: compactEntries(entries.slice(-100)), lang });
      setAnalysis(res.data?.text || "");
    } catch (e) {
      setError(t.coach.error);
    } finally {
      setAnalyzing(false);
    }
  };
  const sendMessage = async () => {
    const text = chatInput.trim();
    if (!text || sending) return;
    setChatInput("");
    setError("");
    const nextMessages = [...chatMessages, { role: "user", content: text }];
    setChatMessages(nextMessages);
    setSending(true);
    try {
      const res = await aiAnalyzeCallable({
        mode: "chat",
        message: text,
        history: nextMessages.slice(-20),
        entries: compactEntries(entries.slice(-40)),
        lang
      });
      setChatMessages((prev) => [...prev, { role: "assistant", content: res.data?.text || "" }]);
    } catch (e) {
      setError(t.coach.error);
    } finally {
      setSending(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-5 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsx(Bot, { size: 17, style: { color: accent } }),
      " ",
      t.coach.title
    ] }),
    /* @__PURE__ */ jsxs(Card, { accent, className: "mb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-wide mb-3", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children: t.coach.analyzeTitle }),
      analysis ? /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed whitespace-pre-wrap mb-3", style: { color: BASE.ink }, children: analysis }) : /* @__PURE__ */ jsx("p", { className: "text-xs mb-3", style: { color: BASE.inkFaint }, children: entries.length === 0 ? t.coach.analyzeNoEntries : t.coach.analyzeEmpty }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: runAnalyze,
          disabled: analyzing || entries.length === 0,
          className: "w-full py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40",
          style: { border: `1px solid ${accent}40`, background: `${accent}12`, color: accent, fontFamily: "'Space Grotesk', sans-serif" },
          children: analyzing ? t.coach.analyzeBusy : t.coach.analyzeBtn
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Card, { accent, className: "mb-4 flex flex-col", style: { height: "48vh" }, children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-wide mb-3", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children: t.coach.chatTitle }),
      /* @__PURE__ */ jsx("div", { ref: scrollRef, className: "flex-1 overflow-y-auto mb-3 pr-1", children: chatMessages.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: BASE.inkFaint }, children: t.coach.chatEmpty }) : chatMessages.map((m, i) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `mb-2.5 max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" ? "ml-auto" : ""}`,
          style: m.role === "user" ? { background: `${accent}14`, color: BASE.ink } : { background: BASE.surface2, color: BASE.ink },
          children: m.content
        },
        i
      )) }),
      sending && /* @__PURE__ */ jsx("p", { className: "text-xs mb-2", style: { color: BASE.inkFaint }, children: "\u2026" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
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
            onClick: sendMessage,
            disabled: sending || !chatInput.trim(),
            className: "shrink-0 p-2.5 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40",
            style: { border: `1px solid ${accent}40`, background: `${accent}12`, color: accent },
            "aria-label": t.coach.send,
            children: /* @__PURE__ */ jsx(Send, { size: 15 })
          }
        )
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
  const Section = ({ children }) => /* @__PURE__ */ jsx("div", { className: "mb-6", children });
  const SectionLabel = ({ children }) => /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-2.5", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children });
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-5 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsx(SettingsIcon, { size: 17, style: { color: accent } }),
      " ",
      t.settings.title
    ] }),
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
    /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: BASE.inkFaint }, children: t.settings.footerNote })
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
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen w-full relative theme-fade${accentPreset.cosmic ? " cosmic-theme" : ""}`, style: { background: accentPreset.cosmic ? "#040405" : BASE.bg, fontFamily: "'Inter', sans-serif" }, children: [
    /* @__PURE__ */ jsx("style", { children: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
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
          width: 100%; height: 100%; object-fit: cover; object-position: 50% 44%; display: block;
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
          -webkit-mask-position: 50% 44%; mask-position: 50% 44%;
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
      /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto px-5 pt-8 pb-32 relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 items-center mb-3", children: [
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
          tab === "coach" && /* @__PURE__ */ jsx(Coach, { entries, accent, userId, lang, t }),
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
      ] }),
      /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 flex justify-center pb-6 px-3", children: /* @__PURE__ */ jsxs("div", { className: "relative grid grid-cols-7 max-w-md w-full p-1 rounded-[22px]", style: { background: "rgba(19,19,21,0.94)", border: `1px solid ${BASE.line}`, backdropFilter: "blur(10px)" }, children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute top-1 bottom-1 rounded-2xl transition-all duration-300 ease-out",
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
      ] }) })
    ] })
  ] });
}

// entry.jsx
import { jsx as jsx2 } from "react/jsx-runtime";
createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsx2(MindExe, {}));
