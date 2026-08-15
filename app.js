// entry.jsx
import React2 from "react";
import { createRoot } from "react-dom/client";

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
  LogOut
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
function calculateCalendarStats(dayEntries) {
  if (!dayEntries.length) return null;
  const wins = dayEntries.filter((e) => e.outcome === "Win").length;
  const losses = dayEntries.filter((e) => e.outcome === "Loss").length;
  const breakevens = dayEntries.filter((e) => e.outcome === "Breakeven").length;
  const avgR = dayEntries.reduce((s, e) => s + (e.r || 0), 0) / dayEntries.length;
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
var CALIBRATION_TIERS = [
  { label: "\u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u0430 \u2014 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043E\u0442\u043B\u0438\u0447\u043D\u043E\u0435.", color: WIN },
  { label: "\u0413\u043E\u0442\u043E\u0432 \u043A \u0442\u043E\u0440\u0433\u043E\u0432\u043B\u0435 \u2014 \u043C\u043E\u0436\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \u043F\u043E \u043F\u043B\u0430\u043D\u0443.", color: WIN },
  { label: "\u041F\u043E\u0432\u044B\u0448\u0435\u043D\u043D\u044B\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0440\u0438\u0441\u043A\u0430 \u2014 \u0441\u043E\u0431\u043B\u044E\u0434\u0430\u0442\u044C \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0443.", color: WARN },
  { label: "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u2014 \u0441\u043D\u0438\u0437\u0438\u0442\u044C \u0440\u0438\u0441\u043A \u043D\u0430 30\u201350%.", color: LOSS },
  { label: "\u0422\u043E\u0440\u0433\u043E\u0432\u043B\u044F \u043D\u0435 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u2014 \u0432\u044B\u0441\u043E\u043A\u0430\u044F \u0432\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044C \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0440\u0435\u0448\u0435\u043D\u0438\u0439.", color: LOSS }
];
function scoreCalibration(answers) {
  const total = CALIBRATION_QUESTIONS.reduce((s, q) => s + (answers[q.id]?.score ?? 0), 0);
  const pct = Math.max(0, Math.min(100, Math.round((total + 12) / 24 * 100)));
  let tierIndex = pct >= 85 ? 0 : pct >= 70 ? 1 : pct >= 50 ? 2 : pct >= 30 ? 3 : 4;
  const riskFactors = [];
  if (answers.motivation?.flag === "revenge") riskFactors.push("\u0416\u0435\u043B\u0430\u043D\u0438\u0435 \u043E\u0442\u0431\u0438\u0442\u044C \u0443\u0431\u044B\u0442\u043A\u0438");
  if (answers.emotion?.flag === "emotion" || answers.objectivity?.flag === "emotion") riskFactors.push("\u0421\u0438\u043B\u044C\u043D\u0430\u044F \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0432\u043E\u0432\u043B\u0435\u0447\u0451\u043D\u043D\u043E\u0441\u0442\u044C");
  if (riskFactors.length) tierIndex = Math.max(tierIndex, 2);
  const factors = CALIBRATION_QUESTIONS.map((q) => {
    const a = answers[q.id];
    if (!a) return null;
    if (a.score === 2) return { type: "positive", text: q.positive };
    if (a.score === -2) return { type: "warning", text: q.negative };
    return null;
  }).filter(Boolean);
  return { pct, tier: CALIBRATION_TIERS[tierIndex], riskFactors, factors };
}
var REVIEW_LIKERT = [
  { label: "\u041F\u043E\u0447\u0442\u0438 \u043D\u0438\u043A\u043E\u0433\u0434\u0430", score: 0 },
  { label: "\u0418\u043D\u043E\u0433\u0434\u0430", score: 1 },
  { label: "\u0427\u0430\u0441\u0442\u043E", score: 2 },
  { label: "\u041F\u043E\u0447\u0442\u0438 \u0432\u0441\u0435\u0433\u0434\u0430", score: 3 }
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
function analyzeJournalForQuiz(entries) {
  if (entries.length < 3) return [];
  const wins = entries.filter((e) => e.outcome === "Win");
  const losses = entries.filter((e) => e.outcome === "Loss");
  const avg = (arr, k) => arr.reduce((s, e) => s + (e[k] || 0), 0) / arr.length;
  const sorted = [...entries].sort((a, b) => a.date - b.date);
  const issues = [];
  const wEmo = wins.filter((e) => e.x != null), lEmo = losses.filter((e) => e.x != null);
  if (wEmo.length >= 2 && lEmo.length >= 2) {
    const wX = avg(wEmo, "x"), lX = avg(lEmo, "x");
    if (lX < wX - 8) {
      issues.push({
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
      issues.push({
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
    issues.push({
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
    issues.push({
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
      issues.push({
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
    issues.push({
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
    issues.push({
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
      issues.push({
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
      issues.push({
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
      issues.push({
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
    for (const g of GENERIC_REVIEW_QUESTIONS) {
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
function buildReviewIssuesFromPatterns(patternsResult) {
  return (patternsResult.patterns || []).map((p) => {
    const meta = PATTERN_QUIZ_MAP[p.id];
    if (!meta) return null;
    return { id: p.id, dataDriven: true, title: p.title, evidence: p.description, question: meta.question, recommendation: p.recommendation };
  }).filter(Boolean);
}
function buildReviewQuiz(entries) {
  if (entries.length < 3) return [];
  const patternsResult = patternEngineV2(entries);
  if (!patternsResult.available) return analyzeJournalForQuiz(entries);
  let selected = buildReviewIssuesFromPatterns(patternsResult).slice(0, REVIEW_MAX_QUESTIONS);
  if (selected.length < REVIEW_MIN_QUESTIONS) {
    const usedIds = new Set(selected.map((i) => i.id));
    for (const g of GENERIC_REVIEW_QUESTIONS) {
      if (selected.length >= REVIEW_MIN_QUESTIONS) break;
      if (!usedIds.has(g.id)) selected.push(g);
    }
  }
  return selected;
}
function scoreJournalReview(issues, answers) {
  const answered = issues.filter((q) => answers[q.id] != null);
  const total = answered.reduce((s, q) => s + answers[q.id].score, 0);
  const maxTotal = answered.length * 3;
  const pct = maxTotal > 0 ? Math.round(total / maxTotal * 100) : 0;
  const tier = pct >= 66 ? { label: "\u042D\u043C\u043E\u0446\u0438\u0438 \u0441\u0435\u0439\u0447\u0430\u0441 \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u044E\u0442 \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u0438 \u0431\u043E\u043B\u044C\u0448\u0435, \u0447\u0435\u043C \u043F\u043B\u0430\u043D.", color: LOSS } : pct >= 33 ? { label: "\u0415\u0441\u0442\u044C \u043D\u0430 \u0447\u0442\u043E \u043E\u0431\u0440\u0430\u0442\u0438\u0442\u044C \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435, \u043D\u043E \u043D\u0435 \u043A\u0440\u0438\u0442\u0438\u0447\u043D\u043E.", color: WARN } : { label: "\u0414\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430 \u0432\u044B\u0433\u043B\u044F\u0434\u0438\u0442 \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E.", color: WIN };
  const confirmed = issues.filter((q) => (answers[q.id]?.score ?? 0) >= 2).sort((a, b) => (answers[b.id]?.score ?? 0) - (answers[a.id]?.score ?? 0));
  const clear = issues.filter((q) => (answers[q.id]?.score ?? 0) <= 1);
  const priority = confirmed[0] || null;
  const rest = confirmed.slice(1);
  const crossValidated = confirmed.filter((q) => q.dataDriven);
  let narrative;
  if (confirmed.length === 0) {
    narrative = "\u041F\u043E \u0442\u0432\u043E\u0438\u043C \u043E\u0442\u0432\u0435\u0442\u0430\u043C \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u044B\u0445 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u043D\u044B\u0445 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u043E\u0432 \u043D\u0435 \u0432\u0438\u0434\u043D\u043E \u2014 \u044D\u0442\u043E \u0445\u043E\u0440\u043E\u0448\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442, \u043D\u043E \u043D\u0435 \u043F\u043E\u0432\u043E\u0434 \u0442\u0435\u0440\u044F\u0442\u044C \u0431\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C: \u043F\u0440\u043E\u0439\u0434\u0438 \u0440\u0430\u0437\u0431\u043E\u0440 \u0435\u0449\u0451 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0434\u0435\u043B\u043E\u043A.";
  } else {
    const titles = confirmed.map((q) => q.title.toLowerCase());
    narrative = titles.length === 1 ? `\u0421\u0438\u043B\u044C\u043D\u0435\u0435 \u0432\u0441\u0435\u0433\u043E \u043D\u0430 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0441\u0435\u0439\u0447\u0430\u0441 \u0432\u043B\u0438\u044F\u0435\u0442: ${titles[0]}.` : `\u0421\u0438\u043B\u044C\u043D\u0435\u0435 \u0432\u0441\u0435\u0433\u043E \u043D\u0430 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0441\u0435\u0439\u0447\u0430\u0441 \u0432\u043B\u0438\u044F\u0435\u0442: ${titles.slice(0, -1).join(", ")} \u0438 ${titles[titles.length - 1]}.`;
    if (crossValidated.length > 0) {
      narrative += crossValidated.length === confirmed.length ? " \u042D\u0442\u043E \u0432\u0438\u0434\u043D\u043E \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E \u043E\u0442\u0432\u0435\u0442\u0430\u043C, \u043D\u043E \u0438 \u0432 \u0441\u0430\u043C\u0438\u0445 \u0446\u0438\u0444\u0440\u0430\u0445 \u0436\u0443\u0440\u043D\u0430\u043B\u0430 \u2014 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u0441 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u043C\u0438 \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u0438, \u0430 \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0441 \u043E\u0449\u0443\u0449\u0435\u043D\u0438\u0435\u043C." : ` \u0427\u0430\u0441\u0442\u044C \u044D\u0442\u043E\u0433\u043E (${crossValidated.map((q) => q.title.toLowerCase()).join(", ")}) \u0432\u0438\u0434\u043D\u043E \u0438 \u0432 \u0441\u0430\u043C\u0438\u0445 \u0446\u0438\u0444\u0440\u0430\u0445 \u0436\u0443\u0440\u043D\u0430\u043B\u0430, \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u043E\u0442\u0432\u0435\u0442\u0430\u0445.`;
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
function awarenessAnalysis(entries, reflection, risk, discipline) {
  const n = entries.length;
  if (!n) return { score: ta_metric(55, 0), components: null };
  const selfObservation = entries.filter(
    (e) => e.x != null && e.y != null && e.pull && e.pull !== "\u2014" && e.lesson && e.lesson !== "\u2014"
  ).length / n * 100;
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
function calibrationAnalysis(sortedEntries, lastCalibration) {
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
  if (statedCalm && (revengeCount > 0 || riskGrew || dayEntries.length >= 8)) {
    const signals = [];
    if (revengeCount > 0) signals.push(`${revengeCount} ${pluralRu(revengeCount, "\u0441\u0434\u0435\u043B\u043A\u0430", "\u0441\u0434\u0435\u043B\u043A\u0438", "\u0441\u0434\u0435\u043B\u043E\u043A")} \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 30 \u043C\u0438\u043D\u0443\u0442 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430`);
    if (riskGrew) signals.push("\u0440\u0438\u0441\u043A \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0432\u044B\u0440\u043E\u0441 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u0434\u043D\u044F");
    if (dayEntries.length >= 8) signals.push(`${dayEntries.length} \u0441\u0434\u0435\u043B\u043E\u043A \u0437\u0430 \u0434\u0435\u043D\u044C`);
    divergenceNote = `\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0441\u0435\u0441\u0441\u0438\u0435\u0439 \u043D\u0435 \u043E\u0442\u043C\u0435\u0442\u0438\u043B\u0430 \u0444\u0430\u043A\u0442\u043E\u0440\u043E\u0432 \u0440\u0438\u0441\u043A\u0430, \u043D\u043E \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u0434\u043D\u044F: ${signals.join(", ")}. \u041C\u0435\u0436\u0434\u0443 \u0437\u0430\u044F\u0432\u043B\u0435\u043D\u043D\u044B\u043C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435\u043C \u0438 \u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435\u043C \u0431\u044B\u043B\u043E \u0440\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0435.`;
  } else if (!statedCalm && revengeCount === 0 && !riskGrew && dayEntries.length < 8) {
    divergenceNote = "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u043E\u0442\u043C\u0435\u0442\u0438\u043B\u0430 \u0444\u0430\u043A\u0442\u043E\u0440\u044B \u0440\u0438\u0441\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0441\u0435\u0441\u0441\u0438\u0435\u0439, \u0438 \u0434\u0435\u043D\u044C \u043F\u0440\u043E\u0448\u0451\u043B \u0431\u0435\u0437 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u044B\u0445 \u043F\u0440\u0438\u0437\u043D\u0430\u043A\u043E\u0432 \u0440\u0435\u0432\u0430\u043D\u0448\u0430, \u0440\u043E\u0441\u0442\u0430 \u0440\u0438\u0441\u043A\u0430 \u0438\u043B\u0438 \u0431\u043E\u043B\u044C\u0448\u043E\u0433\u043E \u0447\u0438\u0441\u043B\u0430 \u0441\u0434\u0435\u043B\u043E\u043A \u2014 \u0437\u0430\u044F\u0432\u043B\u0435\u043D\u043D\u0430\u044F \u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u043B\u0430\u0441\u044C \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435\u043C.";
  }
  return {
    available: true,
    dayTradeCount: dayEntries.length,
    statedPct: lastCalibration.pct,
    statedRiskFactors,
    actualSignals: { revengeCount, riskGrew, tradeCount: dayEntries.length },
    divergenceNote,
    confidence: ta_confidence(dayEntries.length, { low: 3, moderate: 6, high: 10 }),
    limitation: "\u0423\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043D\u0430\u044F \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u0437\u0430 \u0434\u0435\u043D\u044C \u2014 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043E\u043A \u043F\u043E \u0441\u0435\u0441\u0441\u0438\u044F\u043C \u043F\u043E\u043A\u0430 \u043D\u0435\u0442, \u0434\u043E\u043B\u0433\u043E\u0441\u0440\u043E\u0447\u043D\u0430\u044F \u0442\u043E\u0447\u043D\u043E\u0441\u0442\u044C \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0438 \u043D\u0435 \u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F."
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
function pd_confidenceTension(complete) {
  const group = complete.filter((t) => t.x >= 80 && t.y <= 20);
  if (group.length < PATTERN_MIN_GROUP) return null;
  const rest = complete.filter((t) => !(t.x >= 80 && t.y <= 20));
  return {
    id: "confidence_tension",
    title: "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C + \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435",
    description: "\u0422\u0432\u043E\u0438 \u043D\u0430\u0438\u0431\u043E\u043B\u0435\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0432\u043E\u0437\u043D\u0438\u043A\u0430\u044E\u0442 \u043D\u0435 \u0432 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \u0441\u0442\u0440\u0430\u0445\u0430, \u0430 \u043A\u043E\u0433\u0434\u0430 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0432\u044B\u0441\u043E\u043A\u0430\u044F, \u043D\u043E \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F \u0442\u043E\u0436\u0435 \u0432\u044B\u0441\u043E\u043A\u0438\u0439.",
    healthyDescription: "\u041A\u043E\u0433\u0434\u0430 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0438 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435 \u0432\u044B\u0441\u043E\u043A\u0438 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E, \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043B\u0443\u0447\u0448\u0435, \u0447\u0435\u043C \u0432 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043A\u0430\u0445.",
    group,
    rest
  };
}
function pd_fear(complete) {
  const group = complete.filter((t) => t.x <= 20);
  if (group.length < PATTERN_MIN_GROUP) return null;
  const rest = complete.filter((t) => t.x > 20);
  return {
    id: "fear",
    title: "\u0412\u0445\u043E\u0434 \u0438\u0437 \u0441\u0442\u0440\u0430\u0445\u0430",
    description: "\u0421\u0434\u0435\u043B\u043A\u0438, \u043D\u0430\u0447\u0430\u0442\u044B\u0435 \u0438\u0437 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u043E\u0433\u043E \u0441\u0442\u0440\u0430\u0445\u0430 \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435, \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0445\u0443\u0436\u0435 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445.",
    healthyDescription: "\u0414\u0430\u0436\u0435 \u0432\u0445\u043E\u0434\u044B \u0438\u0437 \u0441\u0442\u0440\u0430\u0445\u0430 \u0443 \u0442\u0435\u0431\u044F \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u043D\u0435 \u0445\u0443\u0436\u0435 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u2014 \u044D\u0442\u043E \u0441\u0430\u043C\u043E \u043F\u043E \u0441\u0435\u0431\u0435 \u043D\u0435\u043E\u0431\u044B\u0447\u043D\u043E \u0438 \u0441\u0442\u043E\u0438\u0442 \u0437\u043D\u0430\u0442\u044C.",
    group,
    rest
  };
}
function pd_tooCalm(complete) {
  const group = complete.filter((t) => t.y >= 80);
  if (group.length < PATTERN_MIN_GROUP) return null;
  const rest = complete.filter((t) => t.y < 80);
  return {
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
function pd_revenge(allSorted) {
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
  return {
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
function pd_lessonNotLearned(all) {
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
    title: "\u0423\u0440\u043E\u043A \u043D\u0435 \u0443\u0441\u0432\u043E\u0435\u043D",
    description: `\u041F\u043E\u0445\u043E\u0436\u0438\u0439 \u0443\u0440\u043E\u043A \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0442\u0441\u044F \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 ${group.length} \u0440\u0430\u0437 (\xAB${group[0].lesson}\xBB) \u2014 \u0430 \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435, \u0441\u0443\u0434\u044F \u043F\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0443, \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0435\u0436\u043D\u0438\u043C.`,
    group,
    rest,
    minDiffR: 0.1,
    minGroup: 3,
    sampleNorm: 6
  };
}
function pd_unstableRisk(all) {
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
    title: "\u041D\u0435\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0439 \u0440\u0438\u0441\u043A",
    description: `\u0420\u0430\u0437\u043C\u0435\u0440 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430 \u043F\u043E R \u0441\u0438\u043B\u044C\u043D\u043E \u043A\u043E\u043B\u0435\u0431\u043B\u0435\u0442\u0441\u044F (\u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C ${meanMag.toFixed(2)}R, \u0440\u0430\u0437\u0431\u0440\u043E\u0441 \xB1${stdev.toFixed(2)}R) \u2014 \u0447\u0430\u0441\u0442\u044C \u0441\u0434\u0435\u043B\u043E\u043A \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043A\u0440\u0443\u043F\u043D\u0435\u0435 \u0442\u0438\u043F\u0438\u0447\u043D\u043E\u0439, \u0447\u0442\u043E \u043E\u0431\u044B\u0447\u043D\u043E \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u043E \u043D\u0435\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u043C \u0440\u0438\u0441\u043A\u0435, \u0430 \u043D\u0435 \u043E \u0440\u044B\u043D\u043A\u0435.`,
    group: spikes,
    rest,
    minDiffR: 0.1
  };
}
function pd_overtrading(all) {
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
    title: "\u041F\u0435\u0440\u0435\u0442\u0440\u0435\u0439\u0434\u0438\u043D\u0433",
    description: `\u041E\u0431\u044B\u0447\u043D\u043E \u0443 \u0442\u0435\u0431\u044F ${baseline} ${baseline === 1 ? "\u0441\u0434\u0435\u043B\u043A\u0430" : "\u0441\u0434\u0435\u043B\u043A\u0438"} \u0432 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0434\u0435\u043D\u044C. \u0412 \u0434\u043D\u0438 \u043E\u0442 ${anomalyThreshold} \u0441\u0434\u0435\u043B\u043E\u043A \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u043E\u0442 \u0442\u0438\u043F\u0438\u0447\u043D\u043E\u0433\u043E \u0434\u043D\u044F.`,
    group,
    rest
  };
}
function pd_lossStreak(allSorted) {
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
    title: "\u0421\u0435\u0440\u0438\u044F \u0443\u0431\u044B\u0442\u043A\u043E\u0432",
    description: "\u0421\u0434\u0435\u043B\u043A\u0438 \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0441\u0435\u0440\u0438\u0438 \u0438\u0437 \u0434\u0432\u0443\u0445 \u0438 \u0431\u043E\u043B\u0435\u0435 \u0443\u0431\u044B\u0442\u043A\u043E\u0432 \u043F\u043E\u0434\u0440\u044F\u0434 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043E\u0442\u043B\u0438\u0447\u0430\u044E\u0442\u0441\u044F \u043E\u0442 \u043E\u0431\u044B\u0447\u043D\u044B\u0445 \u043F\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0443.",
    group: afterStreak,
    rest: normal.length ? normal : allSorted.filter((t) => !afterStreak.includes(t)),
    minDiffR: 0.15
  };
}
function pd_riskAfterWin(allSorted) {
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
    title: "\u0420\u043E\u0441\u0442 \u0440\u0438\u0441\u043A\u0430 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0431\u0435\u0434\u044B",
    description: "\u041F\u043E\u0441\u043B\u0435 \u0432\u044B\u0438\u0433\u0440\u044B\u0448\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0440\u0430\u0437\u043C\u0435\u0440 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E R \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0432\u044B\u0440\u0430\u0441\u0442\u0430\u0435\u0442 \u2014 \u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0442\u0430\u043A\u0438\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u0445\u0443\u0436\u0435.",
    group,
    rest: rest.length ? rest : allSorted,
    minDiffR: 0.15
  };
}
function pd_avoidLossReview(all) {
  const wins = all.filter((t) => t.outcome === "Win");
  const losses = all.filter((t) => t.outcome === "Loss");
  if (losses.length < PATTERN_MIN_GROUP || wins.length < 3) return null;
  const winShotRate = wins.filter((t) => Array.isArray(t.screenshots) && t.screenshots.length > 0).length / wins.length;
  const lossShotRate = losses.filter((t) => Array.isArray(t.screenshots) && t.screenshots.length > 0).length / losses.length;
  if (winShotRate - lossShotRate < 0.25) return null;
  return {
    id: "avoid_loss_review",
    title: "\u0418\u0437\u0431\u0435\u0433\u0430\u043D\u0438\u0435 \u0440\u0430\u0437\u0431\u043E\u0440\u0430 \u0443\u0431\u044B\u0442\u043A\u043E\u0432",
    description: `\u041F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0441\u043E \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u043E\u043C: ${Math.round(winShotRate * 100)}%. \u0423\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435: ${Math.round(lossShotRate * 100)}%. \u0422\u044B \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0440\u0435\u0436\u0435 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0435\u0448\u044C \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0432\u0438\u0437\u0443\u0430\u043B\u044C\u043D\u043E.`,
    group: losses,
    rest: wins,
    skipDiffCheck: true
    // this pattern's evidence is the screenshot rate, not avgR — always show if the gap is real
  };
}
function pd_shallowReflection(all) {
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
    title: "\u041F\u043E\u0432\u0435\u0440\u0445\u043D\u043E\u0441\u0442\u043D\u0430\u044F \u0440\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u044F",
    description: `${shallow.length} \u0438\u0437 ${losses.length} \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u043E\u043F\u0438\u0441\u0430\u043D\u044B \u0431\u0435\u0437 \u0440\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u043E\u0433\u043E \u0432\u044B\u0432\u043E\u0434\u0430 \u2014 \u043A\u043E\u0440\u043E\u0442\u043A\u043E \u0438\u043B\u0438 \u0432\u043E\u043E\u0431\u0449\u0435 \u0431\u0435\u0437 \u043D\u0435\u0433\u043E.`,
    group: shallow,
    rest: rest.length ? rest : losses,
    minDiffR: 0.1
  };
}
function analyzeTraderPatterns(trades) {
  const all = (trades || []).filter((t) => t && t.date instanceof Date && !isNaN(t.date.getTime()));
  const complete = all.filter(pe_isEmotionallyComplete);
  if (complete.length < PATTERN_MIN_SAMPLE) {
    return { available: false, sampleSize: complete.length, needed: PATTERN_MIN_SAMPLE };
  }
  const sorted = [...all].sort((a, b) => a.date - b.date);
  const raw = [
    pd_confidenceTension(complete),
    pd_fear(complete),
    pd_tooCalm(complete),
    pd_revenge(sorted),
    pd_lessonNotLearned(all),
    pd_unstableRisk(all),
    pd_overtrading(all),
    pd_lossStreak(sorted),
    pd_riskAfterWin(sorted),
    pd_avoidLossReview(all),
    pd_shallowReflection(all)
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
      healthy.push({ ...entry, title: c.healthyTitle || `${c.title} (\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)` });
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
  shallow_reflection: "reflection"
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
  shallow_reflection: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0444\u0440\u0430\u0437\u0443 \xAB\u0412 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437 \u044F \u0441\u0434\u0435\u043B\u0430\u044E \u0438\u043D\u0430\u0447\u0435, \u0435\u0441\u043B\u0438...\xBB \u0438 \u0434\u043E\u043F\u0438\u0448\u0438 \u0435\u0451 \u0447\u0435\u0441\u0442\u043D\u043E."
};
function ta_severity(score, diff) {
  const mag = Math.abs(diff ?? 0);
  if (score >= 0.55 && mag >= 0.4) return "high";
  if (score >= 0.35) return "medium";
  return "low";
}
function ta_buildPatternRecord(c, result, isHealthy) {
  return {
    id: c.id,
    type: PATTERN_TYPE_MAP[c.id] || "behavioral",
    severity: isHealthy ? "info" : ta_severity(result.score, result.diff),
    confidence: result.confidenceLabel,
    sampleSize: c.group.length,
    title: isHealthy ? c.healthyTitle || `${c.title} (\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)` : c.title,
    description: isHealthy ? c.healthyDescriptionFull || c.healthyDescription || c.description : c.description,
    evidence: pe_pickExamples(c.group, 3).map((t) => ({ id: t.id, date: t.date, outcome: t.outcome, r: t.r, instrument: t.instrument, tag: t.tag })),
    metrics: { group: result.gStats, rest: result.rStats, diff: st_round2(result.diff), uniqueDays: result.uniqueDays, confidenceScore: st_round2(result.score) },
    recommendation: isHealthy ? null : PATTERN_RECOMMENDATIONS[c.id] || null
  };
}
function patternEngineV2(trades) {
  const all = (trades || []).filter((t) => t && t.date instanceof Date && !isNaN(t.date.getTime()));
  const complete = all.filter(pe_isEmotionallyComplete);
  if (complete.length < PATTERN_MIN_SAMPLE) {
    return { available: false, sampleSize: complete.length, needed: PATTERN_MIN_SAMPLE, patterns: [], healthyPatterns: [] };
  }
  const sorted = [...all].sort((a, b) => a.date - b.date);
  const raw = [
    pd_confidenceTension(complete),
    pd_fear(complete),
    pd_tooCalm(complete),
    pd_revenge(sorted),
    pd_lessonNotLearned(all),
    pd_unstableRisk(all),
    pd_overtrading(all),
    pd_lossStreak(sorted),
    pd_riskAfterWin(sorted),
    pd_avoidLossReview(all),
    pd_shallowReflection(all)
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
      healthy.push(ta_buildPatternRecord(c, result, true));
    } else if (result.score >= PATTERN_SCORE_FLOOR) {
      patterns.push(ta_buildPatternRecord(c, result, false));
    }
  }
  patterns.sort((a, b) => b.metrics.confidenceScore - a.metrics.confidenceScore);
  return { available: true, sampleSize: complete.length, patterns, healthyPatterns: healthy };
}
function buildInsights(patternsResult, calibration, discipline) {
  const insights = [];
  (patternsResult.patterns || []).slice(0, 3).forEach((p) => {
    insights.push({ id: `pattern_${p.id}`, basis: "pattern", confidence: p.confidence, sampleSize: p.sampleSize, text: p.description });
  });
  if (calibration.available && calibration.divergenceNote) {
    insights.push({ id: "calibration_divergence", basis: "calibration", confidence: calibration.confidence, sampleSize: calibration.dayTradeCount, text: calibration.divergenceNote });
  }
  if (discipline.violations && discipline.violations.length) {
    const top = discipline.violations[0];
    const text = {
      revenge_rate: `\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0442\u044B \u0432\u0445\u043E\u0434\u0438\u0448\u044C \u0432 \u043D\u043E\u0432\u0443\u044E \u0441\u0434\u0435\u043B\u043A\u0443 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0441\u0430 \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u0432 ${top.value}% \u0441\u043B\u0443\u0447\u0430\u0435\u0432.`,
      overtrading_days: `\u041F\u0440\u0438\u043C\u0435\u0440\u043D\u043E ${top.value}% \u0442\u0432\u043E\u0438\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u043D\u0430 \u0434\u043D\u0438 \u0441 \u0430\u043D\u043E\u043C\u0430\u043B\u044C\u043D\u043E \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C\u044E.`,
      risk_after_loss: `\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0442\u0432\u043E\u0439 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0438\u0441\u043A \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u043D\u0430 ${top.value}%.`,
      risk_after_win: `\u041F\u043E\u0441\u043B\u0435 \u043F\u043E\u0431\u0435\u0434\u044B \u0442\u0432\u043E\u0439 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0438\u0441\u043A \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u043D\u0430 ${top.value}%.`
    }[top.id];
    if (text) insights.push({ id: `discipline_${top.id}`, basis: "discipline", confidence: discipline.score.confidence, sampleSize: discipline.score.sampleSize, text });
  }
  return insights;
}
function calculateTraderAnalytics(entries, lastCalibration) {
  const validEntries = (entries || []).filter((e) => e && e.date instanceof Date && !isNaN(e.date.getTime()));
  const sorted = [...validEntries].sort((a, b) => a.date - b.date);
  const seq = sequenceAnalysis(sorted);
  const risk = riskAnalysis(sorted);
  const reflection = reflectionAnalysis(validEntries);
  const discipline = disciplineAnalysis(sorted, seq, risk);
  const emotional = emotionalAnalysis(validEntries);
  const awareness = awarenessAnalysis(validEntries, reflection, risk, discipline);
  const patternsResult = patternEngineV2(validEntries);
  const calibration = calibrationAnalysis(sorted, lastCalibration);
  const { recent, previous } = ta_splitRecent(sorted);
  let trend = { awareness: "insufficient_data", discipline: "insufficient_data", riskStability: "insufficient_data", reflectionQuality: "insufficient_data" };
  if (recent.length >= 5 && previous.length >= 5) {
    const rRisk = riskAnalysis(recent), pRisk = riskAnalysis(previous);
    const rReflection = reflectionAnalysis(recent), pReflection = reflectionAnalysis(previous);
    const rDiscipline = disciplineAnalysis(recent, sequenceAnalysis(recent), rRisk);
    const pDiscipline = disciplineAnalysis(previous, sequenceAnalysis(previous), pRisk);
    const rAwareness = awarenessAnalysis(recent, rReflection, rRisk, rDiscipline);
    const pAwareness = awarenessAnalysis(previous, pReflection, pRisk, pDiscipline);
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
  const insights = buildInsights(patternsResult, calibration, discipline);
  return {
    awareness: { ...awareness, trend: trend.awareness },
    emotionalState: emotional,
    discipline: { ...discipline, trend: trend.discipline },
    risk: { ...risk, stability: { ...risk.stability, trend: trend.riskStability } },
    execution: { score: discipline.score, consistency: risk.stability, confidence: discipline.score.confidence },
    reflection: { ...reflection, trend: trend.reflectionQuality },
    calibration,
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
var SIM_ACHIEVEMENTS = {
  lowRisk: "\u041D\u0438\u0437\u043A\u0438\u0439 \u0440\u0438\u0441\u043A",
  noImpulsive: "\u041D\u0438 \u043E\u0434\u043D\u043E\u0439 \u0438\u043C\u043F\u0443\u043B\u044C\u0441\u0438\u0432\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438",
  tightDrawdown: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u043E\u0441\u0430\u0434\u043A\u0430 \u043C\u0435\u043D\u0435\u0435 5%",
  survivedVol: "\u041F\u0435\u0440\u0435\u0436\u0438\u043B \u0432\u044B\u0441\u043E\u043A\u0443\u044E \u0432\u043E\u043B\u0430\u0442\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0431\u0435\u0437 \u043B\u0438\u043A\u0432\u0438\u0434\u0430\u0446\u0438\u0438"
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
function createMarketEngine(seed, startPrice = 100) {
  const rand = mulberry32(seed);
  const regime = "accumulation";
  const inst = instantiateRegime(rand, regime);
  const startCandle = { open: startPrice, high: startPrice, low: startPrice, close: startPrice, t: 0 };
  const eng = {
    rand,
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
  const hasEffect = eng.rand() < 0.6;
  const direction = eng.rand() < 0.5 ? 1 : -1;
  const tierRoll = eng.rand();
  const magnitudePct = !hasEffect ? 0 : tierRoll < 0.5 ? 3e-3 + eng.rand() * 6e-3 : tierRoll < 0.85 ? 0.01 + eng.rand() * 0.014 : 0.026 + eng.rand() * 0.03;
  return {
    id: `news_${Math.floor(eng.elapsedMs)}`,
    headline: NEWS_HEADLINES[Math.floor(eng.rand() * NEWS_HEADLINES.length)],
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
function drawBlackHole(canvas, t) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (w === 0 || h === 0) return;
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.32, 0, w * 0.5, h * 0.32, Math.max(w, h) * 0.85);
  bgGrad.addColorStop(0, "#0B0B0E");
  bgGrad.addColorStop(0.5, "#050506");
  bgGrad.addColorStop(1, "#000000");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);
  if (!canvas._stars || canvas._starsW !== w || canvas._starsH !== h) {
    const stars = [];
    const count = Math.floor(w * h / 1600);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.92,
        r: Math.random() < 0.9 ? Math.random() * 0.7 + 0.3 : Math.random() * 1.3 + 1,
        baseAlpha: Math.random() * 0.5 + 0.22,
        tw: Math.random() * Math.PI * 2,
        twSpeed: Math.random() * 0.6 + 0.2
      });
    }
    canvas._stars = stars;
    canvas._starsW = w;
    canvas._starsH = h;
  }
  for (const s of canvas._stars) {
    ctx.globalAlpha = Math.max(0, s.baseAlpha * (0.6 + 0.4 * Math.sin(t * s.twSpeed + s.tw)));
    ctx.fillStyle = "#F5F3EE";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const cx = w * 0.5, cy = h * 0.34;
  const rx = Math.min(w * 0.46, 300);
  const ry = rx * 0.34;
  const tilt = -0.22;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  const breathe = 0.85 + 0.15 * Math.sin(t * 0.35);
  for (let i = 6; i >= 1; i--) {
    ctx.globalAlpha = 0.026 * breathe;
    ctx.fillStyle = "#EDE6D8";
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * (1 + i * 0.17), ry * (1 + i * 0.24), 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const filGrad = ctx.createLinearGradient(-rx * 2.7, -ry * 3.3, rx * 2.7, ry * 3.3);
  filGrad.addColorStop(0, "rgba(230,224,212,0)");
  filGrad.addColorStop(0.42, "rgba(230,224,212,0.3)");
  filGrad.addColorStop(0.5, "rgba(230,224,212,0.42)");
  filGrad.addColorStop(0.58, "rgba(230,224,212,0.3)");
  filGrad.addColorStop(1, "rgba(230,224,212,0)");
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = filGrad;
  ctx.lineWidth = ry * 0.55;
  ctx.beginPath();
  ctx.moveTo(-rx * 2.7, -ry * 3.1);
  ctx.lineTo(rx * 2.7, ry * 3.1);
  ctx.stroke();
  ctx.globalAlpha = 1;
  const segments = 180;
  const seg = (i) => {
    const a = i / segments * Math.PI * 2;
    const bias = 0.5 + 0.5 * Math.sin(a - 0.6);
    const hotspot = 0.22 * Math.max(0, Math.cos(a - t * 0.18));
    return { a, intensity: Math.min(1, bias * 0.75 + hotspot + 0.08) };
  };
  for (let i = 0; i < segments; i++) {
    const { a: a0, intensity } = seg(i);
    const a1 = (i + 1.4) / segments * Math.PI * 2;
    const x0 = Math.cos(a0) * rx, y0 = Math.sin(a0) * ry;
    const x1 = Math.cos(a1) * rx, y1 = Math.sin(a1) * ry;
    const dim = 1 - intensity;
    ctx.strokeStyle = `rgba(${Math.round(237 - 40 * dim)},${Math.round(230 - 50 * dim)},${Math.round(214 - 60 * dim)},${(0.15 + intensity * 0.85).toFixed(3)})`;
    ctx.lineWidth = 1.3 + intensity * 5.5;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  for (let i = 0; i < segments; i += 2) {
    const { a: a0, intensity } = seg(i);
    if (intensity < 0.4) continue;
    const x0 = Math.cos(a0) * rx * 1.03, y0 = Math.sin(a0) * ry * 1.03;
    ctx.globalAlpha = 0.06 * intensity;
    ctx.fillStyle = "#F0E8D6";
    ctx.beginPath();
    ctx.arc(x0, y0, 6 + intensity * 11, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.ellipse(0, 0, rx * 0.78, ry * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.5 + 0.15 * Math.sin(t * 0.5);
  ctx.strokeStyle = "#EDE6D8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, ry * 2.1, rx * 0.5, ry * 0.55, 0, Math.PI * 0.08, Math.PI * 0.92);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();
  const vGrad = ctx.createRadialGradient(w * 0.5, h * 0.3, Math.min(w, h) * 0.25, w * 0.5, h * 0.3, Math.max(w, h) * 0.75);
  vGrad.addColorStop(0, "rgba(0,0,0,0)");
  vGrad.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vGrad;
  ctx.fillRect(0, 0, w, h);
}
function BlackHoleScene() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  useEffect(() => {
    const loop = (ts) => {
      if (startRef.current == null) startRef.current = ts;
      if (canvasRef.current) drawBlackHole(canvasRef.current, (ts - startRef.current) / 1e3);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return /* @__PURE__ */ jsx("canvas", { ref: canvasRef, style: { width: "100%", height: "100%", display: "block" } });
}
function Splash({ accent, fading }) {
  return /* @__PURE__ */ jsxs("div", { className: "splash2-root fixed inset-0 z-50 transition-opacity duration-500", style: { opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "auto" }, children: [
    /* @__PURE__ */ jsx("div", { className: "splash2-bh-scene", children: /* @__PURE__ */ jsx(BlackHoleScene, {}) }),
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
      /* @__PURE__ */ jsx("p", { className: "splash2-tagline", children: "\u0442\u0432\u043E\u0439 \u0440\u0430\u0437\u0443\u043C \u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u0441\u043B\u0435\u0434" })
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
function useStreak(entries) {
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
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push({ label: RU_WEEKDAY_SHORT[d.getDay()], filled: dateSet.has(d.toDateString()) });
    }
    return { streak, week };
  }, [entries]);
}
function calculateChallengeProgress(entries) {
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
function Home({ entries, goTo, accent, name, measureMode, currency, startingCapital, lastCalibration, analytics }) {
  const total = entries.length;
  const [patternOpen, setPatternOpen] = useState(false);
  const traderPatterns = useMemo(() => analyzeTraderPatterns(entries), [entries]);
  const calibratedToday = lastCalibration && isToday(lastCalibration.date);
  const consciousScoreTarget = analytics.awareness.score.value ?? 55;
  const reflectionScore = analytics.reflection.score.value;
  const disciplineScore = analytics.discipline.score.value;
  const riskStabilityScore = analytics.risk.stability.value;
  const level = calculateTraderLevel(total);
  const { streak, week } = useStreak(entries);
  const moodKey = consciousScoreTarget > 80 ? "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u043E\u0435" : consciousScoreTarget > 60 ? "\u0421\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0435" : "\u0420\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0435";
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
    { id: "new", label: "\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C", icon: BookOpen, primary: true },
    { id: "log", label: "\u0417\u0430\u043C\u0435\u0442\u043A\u0438", icon: NotebookText },
    { id: "patterns", label: "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430", icon: LineChartIcon }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-[24px] leading-tight mb-1", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 500 }, children: [
        "\u0421 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u0438\u0435\u043C, ",
        name || "\u041E\u043F\u0435\u0440\u0430\u0442\u043E\u0440"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: "\u0422\u0435\u0431\u044F \u0436\u0434\u0451\u0442 \u044F\u0441\u043D\u043E\u0441\u0442\u044C." })
    ] }),
    /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-1.5", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: [
          /* @__PURE__ */ jsx(Wallet, { size: 11, className: "inline mr-1 -mt-0.5", style: { color: accent } }),
          measureMode === "currency" ? "\u041A\u0430\u043F\u0438\u0442\u0430\u043B" : "\u041E\u0431\u0449\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442"
        ] }),
        sparkPoints.length >= 2 && /* @__PURE__ */ jsx(Sparkline, { points: sparkPoints, color: cumResult >= 0 ? WIN : LOSS })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-[28px] leading-none mb-1", style: { fontFamily: "'JetBrains Mono', monospace", color: BASE.ink, fontWeight: 500 }, children: measureMode === "currency" ? formatBalance(animatedHero, currency) : formatResult(animatedHero, "R", currency) }),
      measureMode === "currency" && /* @__PURE__ */ jsxs("span", { className: "text-[11px]", style: { color: cumResult >= 0 ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: [
        formatResult(cumResult, "currency", currency),
        " \u0441 \u043D\u0430\u0447\u0430\u043B\u0430"
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
            calibratedToday ? `\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F: ${lastCalibration.pct}%` : "\u041F\u0440\u043E\u0439\u0442\u0438 \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0443 \u043F\u0435\u0440\u0435\u0434 \u0441\u0435\u0441\u0441\u0438\u0435\u0439"
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { size: 15, style: { color: BASE.inkFaint } })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Card, { accent, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[11px]", style: { color: BASE.inkDim, fontFamily: "'Space Grotesk', sans-serif" }, children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 12, style: { color: accent } }),
          " \u0418\u043D\u0441\u0430\u0439\u0442"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full animate-pulse", style: { background: accent } })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: [
        "\u041D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435 \u0440\u044B\u043D\u043A\u0430: ",
        /* @__PURE__ */ jsx("span", { style: { color: accent }, children: moodKey }),
        ".",
        " ",
        total >= 4 ? "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442, \u0447\u0442\u043E \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u043E\u043A\u0443\u043F\u0430\u0435\u0442\u0441\u044F \u2014 \u0434\u0435\u0440\u0436\u0438 \u043E\u0431\u044A\u0451\u043C \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u043C." : "\u0421\u0444\u043E\u043A\u0443\u0441\u0438\u0440\u0443\u0439\u0441\u044F \u043D\u0430 \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u0438. \u0414\u043E\u0431\u0430\u0432\u044C \u0435\u0449\u0451 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0441\u0434\u0435\u043B\u043E\u043A, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u044F\u0432\u0438\u043B\u0441\u044F \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0442\u0442\u0435\u0440\u043D."
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 divide-x", style: { borderColor: BASE.line }, children: [
        /* @__PURE__ */ jsxs("div", { className: "pr-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1", style: { color: BASE.inkFaint }, children: "\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0442\u0440\u0435\u0439\u0434\u0435\u0440\u0430" }),
          /* @__PURE__ */ jsx("div", { className: "text-[26px] leading-none", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 500 }, children: level })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pl-4", style: { borderLeft: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1", style: { color: BASE.inkFaint }, children: "\u041E\u0441\u043E\u0437\u043D\u0430\u043D\u043D\u043E\u0441\u0442\u044C" }),
          /* @__PURE__ */ jsxs("div", { className: "text-[26px] leading-none", style: { fontFamily: "'Space Grotesk', sans-serif", color: accent, fontWeight: 500 }, children: [
            consciousScore,
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mt-3 mb-2.5", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${consciousScore}%`, background: accent } }) }),
      total > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap text-[10px]", style: { color: BASE.inkFaint }, children: [
        reflectionScore != null && /* @__PURE__ */ jsxs("span", { children: [
          "\u0420\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u044F ",
          reflectionScore,
          "%"
        ] }),
        reflectionScore != null && (disciplineScore != null || riskStabilityScore != null) && /* @__PURE__ */ jsx("span", { children: "\xB7" }),
        disciplineScore != null && /* @__PURE__ */ jsxs("span", { children: [
          "\u0414\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430 ",
          disciplineScore,
          "%"
        ] }),
        disciplineScore != null && riskStabilityScore != null && /* @__PURE__ */ jsx("span", { children: "\xB7" }),
        riskStabilityScore != null && /* @__PURE__ */ jsxs("span", { children: [
          "\u0421\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0440\u0438\u0441\u043A\u0430 ",
          riskStabilityScore,
          "%"
        ] }),
        calibratedToday && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { children: "\xB7" }),
          /* @__PURE__ */ jsxs("span", { style: { color: lastCalibration.tierColor }, children: [
            "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F ",
            lastCalibration.pct,
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-3 mt-3", style: { borderTop: `1px solid ${BASE.line}` }, children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => goTo("challenge"), className: "flex items-center gap-1.5 text-xs transition-transform duration-150 active:scale-95", style: { color: BASE.inkDim }, children: [
          /* @__PURE__ */ jsx(Flame, { size: 13, className: streak > 0 ? "flame-flicker" : "", style: { color: streak > 0 ? "#D98A4A" : BASE.inkFaint } }),
          streak > 0 ? `${animatedStreak} \u0434\u043D. \u043F\u043E\u0434\u0440\u044F\u0434` : "\u041D\u0430\u0447\u043D\u0438 \u0441\u0435\u0440\u0438\u044E"
        ] }),
        /* @__PURE__ */ jsx(WeekDots, { week, accent })
      ] })
    ] }),
    traderPatterns.available ? traderPatterns.primaryPattern ? /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: "\u0422\u0432\u043E\u0439 \u043F\u0430\u0442\u0442\u0435\u0440\u043D" }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] px-2 py-0.5 rounded-full", style: { color: accent, border: `1px solid ${accent}40` }, children: traderPatterns.primaryPattern.confidence === "high" ? "\u0421\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u0438\u0433\u043D\u0430\u043B" : traderPatterns.primaryPattern.confidence === "medium" ? "\u041D\u0430\u0431\u043B\u044E\u0434\u0430\u0435\u043C\u044B\u0439 \u043F\u0430\u0442\u0442\u0435\u0440\u043D" : "\u0415\u0441\u0442\u044C \u043F\u0440\u0438\u0437\u043D\u0430\u043A\u0438" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-base mb-1.5", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: traderPatterns.primaryPattern.title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
        /* @__PURE__ */ jsxs("span", { children: [
          traderPatterns.primaryPattern.stats.trades,
          " ",
          pluralRu(traderPatterns.primaryPattern.stats.trades, "\u0441\u0434\u0435\u043B\u043A\u0430", "\u0441\u0434\u0435\u043B\u043A\u0438", "\u0441\u0434\u0435\u043B\u043E\u043A")
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          traderPatterns.primaryPattern.stats.winRate,
          "% win"
        ] }),
        /* @__PURE__ */ jsxs("span", { style: { color: traderPatterns.primaryPattern.stats.avgR >= 0 ? WIN : LOSS }, children: [
          formatResult(traderPatterns.primaryPattern.stats.avgR ?? 0, "R", currency),
          " \u0441\u0440."
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-3", style: { color: BASE.inkDim }, children: traderPatterns.primaryPattern.description }),
      /* @__PURE__ */ jsx("button", { onClick: () => setPatternOpen(true), className: "text-sm transition-transform duration-150 active:scale-95", style: { color: accent, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: "\u0420\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C \u2192" })
    ] }) : traderPatterns.healthyPatterns.length > 0 ? /* @__PURE__ */ jsxs(Card, { accent, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: "\u0422\u0432\u043E\u0439 \u043F\u0430\u0442\u0442\u0435\u0440\u043D" }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] px-2 py-0.5 rounded-full", style: { color: WIN, border: `1px solid ${WIN}40` }, children: "\u0421\u0438\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-base mb-1.5", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: traderPatterns.healthyPatterns[0].title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
        /* @__PURE__ */ jsxs("span", { children: [
          traderPatterns.healthyPatterns[0].stats.trades,
          " ",
          pluralRu(traderPatterns.healthyPatterns[0].stats.trades, "\u0441\u0434\u0435\u043B\u043A\u0430", "\u0441\u0434\u0435\u043B\u043A\u0438", "\u0441\u0434\u0435\u043B\u043E\u043A")
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          traderPatterns.healthyPatterns[0].stats.winRate,
          "% win"
        ] }),
        /* @__PURE__ */ jsxs("span", { style: { color: WIN }, children: [
          formatResult(traderPatterns.healthyPatterns[0].stats.avgR ?? 0, "R", currency),
          " \u0441\u0440."
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.inkDim }, children: traderPatterns.healthyPatterns[0].description })
    ] }) : /* @__PURE__ */ jsxs(Card, { className: "mb-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-1.5", style: { color: BASE.inkFaint }, children: "\u0422\u0432\u043E\u0439 \u043F\u0430\u0442\u0442\u0435\u0440\u043D" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.inkDim }, children: "\u042F\u0432\u043D\u043E\u0433\u043E \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0433\u043E \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u0430 \u043F\u043E\u043A\u0430 \u043D\u0435 \u0432\u0438\u0434\u043D\u043E \u2014 \u044D\u0442\u043E \u0442\u043E\u0436\u0435 \u043D\u0435\u043F\u043B\u043E\u0445\u043E\u0439 \u0437\u043D\u0430\u043A. \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0439 \u0432\u0435\u0441\u0442\u0438 \u0436\u0443\u0440\u043D\u0430\u043B, \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0441\u043B\u0435\u0434\u0438\u0442 \u0437\u0430 \u044D\u0442\u0438\u043C \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u043E." })
    ] }) : /* @__PURE__ */ jsxs(Card, { className: "mb-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-1.5", style: { color: BASE.inkFaint }, children: "\u0422\u0432\u043E\u0439 \u043F\u0430\u0442\u0442\u0435\u0440\u043D" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm mb-2", style: { color: BASE.ink }, children: [
        "\u041F\u043E\u043A\u0430 \u0444\u043E\u0440\u043C\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u2014 ",
        traderPatterns.sampleSize,
        " / ",
        traderPatterns.needed
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-2", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${Math.min(100, traderPatterns.sampleSize / traderPatterns.needed * 100)}%`, background: accent } }) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed", style: { color: BASE.inkFaint }, children: "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0438\u0449\u0435\u0442 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0435\u0441\u044F \u0441\u0432\u044F\u0437\u0438 \u043C\u0435\u0436\u0434\u0443 \u0442\u0432\u043E\u0438\u043C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435\u043C \u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u043C \u2014 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u0437\u0430\u043F\u0438\u0441\u0438 \u0441 \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u043E\u0439 \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0439 \u0442\u043E\u0447\u043A\u043E\u0439." })
    ] }),
    patternOpen && traderPatterns.primaryPattern && /* @__PURE__ */ jsx(TraderPatternDetail, { pattern: traderPatterns.primaryPattern, accent, currency, onClose: () => setPatternOpen(false) }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 mb-3", children: tiles.map((t) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => goTo(t.id),
        className: "flex items-center justify-between px-4 py-3.5 rounded-2xl text-left transition-all duration-200 active:scale-[0.98]",
        style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: BASE.ink },
        children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { fontFamily: "'Space Grotesk', sans-serif" }, children: [
            /* @__PURE__ */ jsx(t.icon, { size: 15, style: { color: t.primary ? accent : BASE.inkDim } }),
            " ",
            t.label
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { size: 15, style: { color: BASE.inkFaint } })
        ]
      },
      t.id
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
        "\u0420\u044B\u043D\u043E\u043A: ",
        moodKey
      ] })
    ] })
  ] });
}
function TraderPatternDetail({ pattern, accent, currency, onClose }) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center", onClick: onClose, style: { background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: (e) => e.stopPropagation(),
      className: "w-full max-w-md rounded-t-[28px] px-5 pt-4 pb-8",
      style: { background: BASE.surface, border: `1px solid ${BASE.line}`, borderBottom: "none", maxHeight: "88vh", overflowY: "auto", animation: "riseIn 0.28s ease-out" },
      children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4", style: { width: 36, height: 4, borderRadius: 2, background: BASE.line } }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: "\u0422\u0432\u043E\u0439 \u043F\u0430\u0442\u0442\u0435\u0440\u043D" }),
          /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1 -m-1", children: /* @__PURE__ */ jsx(XIcon, { size: 16, style: { color: BASE.inkFaint } }) })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: pattern.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-4", style: { color: BASE.inkDim }, children: pattern.description }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: "\u0421\u0434\u0435\u043B\u043E\u043A" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: pattern.stats.trades })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: "Win rate" }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: [
              pattern.stats.winRate,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 R" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: (pattern.stats.avgR ?? 0) >= 0 ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(pattern.stats.avgR ?? 0, "R", currency) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: "\u0421\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink }, children: "\u041F\u043E\u0445\u043E\u0436\u0438\u0435 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: (pattern.stats.avgR ?? 0) >= 0 ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(pattern.stats.avgR ?? 0, "R", currency) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.inkFaint }, children: "\u041E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: (pattern.comparisonStats.avgR ?? 0) >= 0 ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(pattern.comparisonStats.avgR ?? 0, "R", currency) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: "\u0413\u0434\u0435 \u044D\u0442\u043E \u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u044D\u043C\u043E\u0446\u0438\u0439" }),
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
              label: { value: "\u0421\u0442\u0440\u0430\u0445 \u2192 \u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C", position: "insideBottom", offset: -10, fill: BASE.inkFaint, fontSize: 10 }
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
              label: { value: "\u041D\u0430 \u043D\u0435\u0440\u0432\u0430\u0445 \u2192 \u0421\u043F\u043E\u043A\u043E\u0435\u043D", angle: -90, position: "insideLeft", fill: BASE.inkFaint, fontSize: 10 }
            }
          ),
          /* @__PURE__ */ jsx(ZAxis, { range: [70, 70] }),
          /* @__PURE__ */ jsx(Scatter, { data: pattern.comparisonStats._trades || [], fill: BASE.line, isAnimationActive: false }),
          /* @__PURE__ */ jsx(Scatter, { data: pattern.stats._trades || [], isAnimationActive: false, children: (pattern.stats._trades || []).map((t) => /* @__PURE__ */ jsx(Cell, { fill: accent }, t.id)) })
        ] }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: "\u041F\u0440\u0438\u043C\u0435\u0440\u044B \u0441\u0434\u0435\u043B\u043E\u043A" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 mb-4", children: pattern.sampleTrades.map((t) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm py-1.5", style: { borderBottom: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { background: outcomeColor(t.outcome) } }),
          /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, className: "text-xs shrink-0", children: t.date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }) }),
          /* @__PURE__ */ jsx("span", { style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, className: "shrink-0", children: t.instrument }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs shrink-0", style: { color: BASE.inkFaint }, children: [
            "x",
            Math.round(t.x),
            " y",
            Math.round(t.y)
          ] }),
          t.r !== null && t.r !== void 0 && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0", style: { color: outcomeColor(t.outcome), fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(t.r, "R", currency) })
        ] }, t.id)) }),
        /* @__PURE__ */ jsxs(Card, { className: "mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: "\u041F\u043E\u0447\u0435\u043C\u0443 mind.exe \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u044D\u0442\u043E" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: [
            pattern.evidenceCount,
            " ",
            pluralRu(pattern.evidenceCount, "\u0441\u0434\u0435\u043B\u043A\u0430 \u043F\u043E\u043F\u0430\u043B\u0430", "\u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u043F\u0430\u043B\u0438", "\u0441\u0434\u0435\u043B\u043E\u043A \u043F\u043E\u043F\u0430\u043B\u043E"),
            " \u0432 \u044D\u0442\u0443 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E. \u0412 \u044D\u0442\u043E\u0439 \u0433\u0440\u0443\u043F\u043F\u0435 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0441\u043E\u0441\u0442\u0430\u0432\u0438\u043B ",
            formatResult(pattern.stats.avgR ?? 0, "R", currency),
            ", \u043F\u0440\u043E\u0442\u0438\u0432 ",
            formatResult(pattern.comparisonStats.avgR ?? 0, "R", currency),
            " \u0443 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A."
          ] })
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
function NewEntry({ onSave, accent, measureMode, currency, customInstruments, customTags, onAddCustomInstrument, onAddCustomTag, notify }) {
  const [instrument, setInstrument] = useState("");
  const [direction, setDirection] = useState("Long");
  const [outcome, setOutcome] = useState("Win");
  const [resultR, setResultR] = useState("");
  const [tag, setTag] = useState("");
  const [point, setPoint] = useState({ x: null, y: null });
  const [pull, setPull] = useState("");
  const [lesson, setLesson] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const fileInputRef = useRef(null);
  const canSave = instrument.trim() && point.x !== null;
  const MAX_SHOTS = 4;
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
    if (!canSave) return;
    onSave({
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      instrument: instrument.trim(),
      direction,
      outcome,
      r: resultR === "" || isNaN(parseFloat(resultR)) ? null : parseFloat(resultR),
      tag: tag.trim() || "\u041E\u0431\u0449\u0435\u0435",
      x: point.x,
      y: point.y,
      pull: pull.trim() || "\u2014",
      lesson: lesson.trim() || "\u2014",
      date: /* @__PURE__ */ new Date(),
      screenshots
    });
    setInstrument("");
    setDirection("Long");
    setOutcome("Win");
    setResultR("");
    setTag("");
    setPoint({ x: null, y: null });
    setPull("");
    setLesson("");
    setScreenshots([]);
  };
  const L = ({ children }) => /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-1.5", style: { color: BASE.inkFaint, fontFamily: "'Space Grotesk', sans-serif" }, children });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-4 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsx(BookOpen, { size: 17, style: { color: accent } }),
      " \u041D\u043E\u0432\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: "\u0418\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442" }),
        /* @__PURE__ */ jsx(PickerField, { value: instrument, onChange: setInstrument, options: instrumentOptions, placeholder: "\u0412\u044B\u0431\u0435\u0440\u0438 \u0438\u043B\u0438 \u0434\u043E\u0431\u0430\u0432\u044C", accent, allowCustom: true, mono: true, onCustomAdd: onAddCustomInstrument })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: "\u0422\u0438\u043F \u0441\u0435\u0442\u0430\u043F\u0430" }),
        /* @__PURE__ */ jsx(PickerField, { value: tag, onChange: setTag, options: tagOptions, placeholder: "\u0412\u044B\u0431\u0435\u0440\u0438 \u0438\u043B\u0438 \u0434\u043E\u0431\u0430\u0432\u044C", accent, allowCustom: true, flat: true, onCustomAdd: onAddCustomTag })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-4 items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-[38%] shrink-0", children: [
        /* @__PURE__ */ jsxs(L, { children: [
          "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 (",
          unitSymbol(measureMode, currency),
          ")"
        ] }),
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
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: "\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435" }),
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
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: "\u0418\u0441\u0445\u043E\u0434" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: ["Win", "Loss", "Breakeven"].map((o) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setOutcome(o),
          className: "flex-1 px-2 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
          style: { background: outcome === o ? `${outcomeColor(o)}14` : "transparent", color: outcome === o ? outcomeColor(o) : BASE.inkDim, border: `1px solid ${outcome === o ? outcomeColor(o) + "50" : BASE.line}` },
          children: OUTCOME_LABEL[o]
        },
        o
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxs(L, { children: [
        "\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B \u0433\u0440\u0430\u0444\u0438\u043A\u0430 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E, \u0434\u043E ",
        MAX_SHOTS,
        ")"
      ] }),
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
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx(L, { children: "\u0427\u0442\u043E \u0437\u0430\u0442\u044F\u043D\u0443\u043B\u043E \u0442\u0435\u0431\u044F \u0432 \u044D\u0442\u0443 \u0441\u0434\u0435\u043B\u043A\u0443?" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: pull,
          onChange: (e) => setPull(e.target.value),
          rows: 2,
          placeholder: "\u0427\u0435\u0441\u0442\u043D\u043E, \u0430 \u043D\u0435 \u043A\u0440\u0430\u0441\u0438\u0432\u043E.",
          className: "w-full bg-transparent border rounded-xl outline-none p-3 text-sm resize-none",
          style: { borderColor: BASE.line, color: BASE.ink }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: "\u0427\u0442\u043E \u0431\u044B \u0442\u044B \u0441\u043A\u0430\u0437\u0430\u043B \u0441\u0435\u0431\u0435 \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437?" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: lesson,
          onChange: (e) => setLesson(e.target.value),
          rows: 2,
          placeholder: "\u041E\u0434\u043D\u0430 \u0444\u0440\u0430\u0437\u0430, \u043A\u043E\u0442\u043E\u0440\u0443\u044E \u0442\u044B \u043F\u0440\u0430\u0432\u0434\u0430 \u0437\u0430\u043F\u043E\u043C\u043D\u0438\u0448\u044C.",
          className: "w-full bg-transparent border rounded-xl outline-none p-3 text-sm resize-none",
          style: { borderColor: BASE.line, color: BASE.ink }
        }
      )
    ] }),
    /* @__PURE__ */ jsx(L, { children: "\u0427\u0442\u043E \u0442\u044B \u0447\u0443\u0432\u0441\u0442\u0432\u043E\u0432\u0430\u043B \u0432 \u043C\u043E\u043C\u0435\u043D\u0442 \u0432\u0445\u043E\u0434\u0430 \u0432 \u0441\u0434\u0435\u043B\u043A\u0443?" }),
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
        children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C"
      }
    )
  ] });
}
function Log({ entries, onDelete, accent, measureMode, currency }) {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const filtered = entries.filter((e) => {
    const matchesFilter = filter === "All" || e.outcome === filter;
    const matchesQuery = e.instrument.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });
  const winRate = entries.length ? Math.round(entries.filter((e) => e.outcome === "Win").length / entries.length * 100) : 0;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-lg flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
        /* @__PURE__ */ jsx(NotebookText, { size: 17, style: { color: accent } }),
        " \u0417\u0430\u043C\u0435\u0442\u043A\u0438"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs", style: { color: BASE.inkFaint }, children: [
        entries.length,
        " \u0441\u0434\u0435\u043B\u043E\u043A \xB7 ",
        winRate,
        "% \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0445"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 my-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 px-3 py-2 rounded-full", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: [
      /* @__PURE__ */ jsx(Search, { size: 13, style: { color: BASE.inkFaint } }),
      /* @__PURE__ */ jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0443\u2026", className: "bg-transparent outline-none text-sm flex-1", style: { color: BASE.ink } })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-4 overflow-x-auto", children: ["All", "Win", "Loss", "Breakeven"].map((f) => /* @__PURE__ */ jsx(Pill, { active: filter === f, onClick: () => setFilter(f), accent, children: OUTCOME_LABEL[f] }, f)) }),
    filtered.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0434\u0440\u0443\u0433\u043E\u0439 \u0444\u0438\u043B\u044C\u0442\u0440." }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filtered.slice().reverse().map((e) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl overflow-hidden", style: { border: `1px solid ${BASE.line}` }, children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => setOpenId(openId === e.id ? null : e.id), className: "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150", style: { background: BASE.surface }, children: [
        /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { background: outcomeColor(e.outcome) } }),
        /* @__PURE__ */ jsx("span", { className: "text-sm w-20 shrink-0 truncate", style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: e.instrument }),
        /* @__PURE__ */ jsx("span", { className: "text-sm w-12 shrink-0", style: { color: BASE.inkDim }, children: DIRECTION_LABEL[e.direction] }),
        e.r !== null && e.r !== void 0 && /* @__PURE__ */ jsx("span", { className: "text-xs shrink-0", style: { color: outcomeColor(e.outcome), fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(e.r, measureMode, currency) }),
        e.screenshots?.length > 0 && /* @__PURE__ */ jsx(ImagePlus, { size: 11, className: "shrink-0", style: { color: BASE.inkFaint } }),
        /* @__PURE__ */ jsx("span", { className: "text-xs ml-auto shrink-0", style: { color: BASE.inkFaint }, children: relTime(e.date) })
      ] }),
      openId === e.id && /* @__PURE__ */ jsxs("div", { className: "tab-content px-4 py-3 space-y-2 text-sm", style: { background: BASE.bg, color: BASE.inkDim }, children: [
        e.screenshots?.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: e.screenshots.map((src, i) => /* @__PURE__ */ jsx("img", { src, alt: `\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 ${i + 1}`, className: "w-24 h-24 object-cover rounded-lg shrink-0", style: { border: `1px solid ${BASE.line}` } }, i)) }),
        /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-0.5 rounded-full text-[11px] mb-1", style: { border: `1px solid ${BASE.line}`, color: accent }, children: e.tag }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u0417\u0430\u0442\u044F\u043D\u0443\u043B\u043E \u2014 " }),
          e.pull
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u0412 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437 \u2014 " }),
          e.lesson
        ] }),
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
  const daySummary = useMemo(() => calculateCalendarStats(selectedEntries), [selectedEntries]);
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
            e.r !== null && e.r !== void 0 && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0", style: { color: outcomeColor(e.outcome), fontFamily: "'JetBrains Mono', monospace" }, children: formatResult(e.r, measureMode, currency) })
          ] }),
          e.lesson && e.lesson !== "\u2014" && /* @__PURE__ */ jsx("p", { className: "text-xs pl-3.5 mt-0.5", style: { color: BASE.inkFaint }, children: e.lesson })
        ] }, e.id)) })
      ] })
    ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-center", style: { color: BASE.inkFaint }, children: "\u041D\u0430\u0436\u043C\u0438 \u043D\u0430 \u0447\u0438\u0441\u043B\u043E, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0441\u0432\u043E\u0434\u043A\u0443 \u0437\u0430 \u0434\u0435\u043D\u044C." })
  ] });
}
function Patterns({ entries, accent, measureMode, currency, analytics }) {
  const [view, setView] = useState("emotions");
  const [reviewOpen, setReviewOpen] = useState(false);
  const grouped = useMemo(() => {
    const g = { Win: [], Loss: [], Breakeven: [] };
    entries.forEach((e) => g[e.outcome]?.push(e));
    return g;
  }, [entries]);
  const winRate = entries.length ? Math.round(grouped.Win.length / entries.length * 100) : 0;
  const withR = entries.filter((e) => e.r !== null && e.r !== void 0);
  const avgR = withR.length ? withR.reduce((s, e) => s + e.r, 0) / withR.length : null;
  const traderPatterns = useMemo(() => analyzeTraderPatterns(entries), [entries]);
  const insight = useMemo(() => {
    if (grouped.Win.length < 2 || grouped.Loss.length < 2) return "\u0414\u043E\u0431\u0430\u0432\u044C \u0435\u0449\u0451 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0441\u0434\u0435\u043B\u043E\u043A \u0441 \u043E\u0431\u0435\u0438\u0445 \u0441\u0442\u043E\u0440\u043E\u043D \u2014 \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0445 \u0438 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u2014 \u0438 \u0437\u0434\u0435\u0441\u044C \u043D\u0430\u0447\u043D\u0451\u0442 \u043F\u0440\u043E\u044F\u0432\u043B\u044F\u0442\u044C\u0441\u044F \u043F\u0430\u0442\u0442\u0435\u0440\u043D.";
    if (analytics.insights.length) return analytics.insights[0].text;
    if (traderPatterns.available) return "\u042F\u0432\u043D\u043E\u0433\u043E \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0433\u043E \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u0430 \u043F\u043E\u043A\u0430 \u043D\u0435 \u0432\u0438\u0434\u043D\u043E \u2014 \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0435 \u0438 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u0440\u0438\u0445\u043E\u0434\u044F\u0442 \u0438\u0437 \u043F\u043E\u0445\u043E\u0436\u0438\u0445 \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0439. \u042D\u0442\u043E \u0441\u0430\u043C\u043E \u043F\u043E \u0441\u0435\u0431\u0435 \u0432\u0430\u0436\u043D\u043E \u0437\u0430\u043C\u0435\u0442\u0438\u0442\u044C.";
    return `\u041F\u043E\u043A\u0430 \u043D\u0430\u043A\u0430\u043F\u043B\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B \u0434\u043B\u044F \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u044B\u0445 \u0432\u044B\u0432\u043E\u0434\u043E\u0432 (\u043D\u0443\u0436\u043D\u043E \u0435\u0449\u0451 ${traderPatterns.needed - traderPatterns.sampleSize} \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0441 \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0439 \u0442\u043E\u0447\u043A\u043E\u0439) \u2014 \u043D\u043E \u0443\u0436\u0435 \u0432\u0438\u0434\u043D\u043E, \u0447\u0442\u043E \u0436\u0443\u0440\u043D\u0430\u043B \u0432\u0435\u0434\u0451\u0442\u0441\u044F \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E, \u0438 \u044D\u0442\u043E \u0433\u043B\u0430\u0432\u043D\u043E\u0435.`;
  }, [grouped, traderPatterns, analytics]);
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
    return /* @__PURE__ */ jsx(JournalReview, { entries, accent, onClose: () => setReviewOpen(false) });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-4 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsx(LineChartIcon, { size: 17, style: { color: accent } }),
      " \u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "\u0421\u0434\u0435\u043B\u043A\u0438", value: entries.length, accent: BASE.ink }),
      /* @__PURE__ */ jsx(StatCard, { label: "\u0412\u0438\u043D\u0440\u0435\u0439\u0442", value: `${winRate}%`, accent }),
      /* @__PURE__ */ jsx(StatCard, { label: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442", value: formatResult(avgR, measureMode, currency), accent: BASE.ink })
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
          "\u041E\u0441\u043E\u0437\u043D\u0430\u043D\u043D\u043E\u0441\u0442\u044C ",
          analytics.awareness.score.value,
          "%",
          TREND_ARROW[analytics.awareness.trend] || ""
        ] }),
        analytics.discipline.score.value != null && /* @__PURE__ */ jsxs("span", { children: [
          "\xB7 \u0414\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430 ",
          analytics.discipline.score.value,
          "%",
          TREND_ARROW[analytics.discipline.trend] || ""
        ] }),
        analytics.risk.stability.value != null && /* @__PURE__ */ jsxs("span", { children: [
          "\xB7 \u0421\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0440\u0438\u0441\u043A\u0430 ",
          analytics.risk.stability.value,
          "%",
          TREND_ARROW[analytics.risk.stability.trend] || ""
        ] }),
        analytics.reflection.score.value != null && /* @__PURE__ */ jsxs("span", { children: [
          "\xB7 \u0420\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u044F ",
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
      tagStats.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: "\u0414\u043E\u0431\u0430\u0432\u044C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043A \u0441\u0434\u0435\u043B\u043A\u0430\u043C, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C, \u043A\u0430\u043A\u0438\u0435 \u0441\u0435\u0442\u0430\u043F\u044B \u0440\u0435\u0430\u043B\u044C\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442." }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(TagBars, { data: tagStats, measureMode, currency }) })
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
function Challenge({ entries, accent, weeklyGoal }) {
  const { streak, week } = useStreak(entries);
  const daysThisWeek = week.filter((d) => d.filled).length;
  const pct = Math.min(100, Math.round(daysThisWeek / weeklyGoal * 100));
  const animatedStreak = Math.round(useAnimatedNumber(streak));
  const CHALLENGE_ICONS = { revenge: ShieldCheck, reflect: PenLine, winstreak: TrendingUp };
  const challenges = useMemo(() => calculateChallengeProgress(entries), [entries]);
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg mb-5 flex items-center gap-2", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsx(Flame, { size: 17, style: { color: "#D98A4A" } }),
      " \u0427\u0435\u043B\u043B\u0435\u043D\u0434\u0436"
    ] }),
    /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "mb-4 text-center py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-1", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 500 }, children: animatedStreak }),
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide", style: { color: BASE.inkFaint }, children: "\u0434\u043D\u0435\u0439 \u043F\u043E\u0434\u0440\u044F\u0434" })
    ] }),
    /* @__PURE__ */ jsx(ChallengeCard, { icon: CalendarCheck, title: "\u041D\u0435\u0434\u0435\u043B\u044C\u043D\u0430\u044F \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u044C", desc: `\u0412\u0435\u0434\u0438 \u0436\u0443\u0440\u043D\u0430\u043B ${weeklyGoal} \u0438\u0437 7 \u0434\u043D\u0435\u0439 \u044D\u0442\u043E\u0439 \u043D\u0435\u0434\u0435\u043B\u0438.`, progress: daysThisWeek, goal: weeklyGoal, accent }),
    challenges.map((c) => /* @__PURE__ */ jsx(ChallengeCard, { icon: CHALLENGE_ICONS[c.id], title: c.title, desc: c.desc, progress: c.progress, goal: c.goal, accent }, c.id)),
    /* @__PURE__ */ jsxs(Card, { className: "mt-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: "\u042D\u0442\u0430 \u043D\u0435\u0434\u0435\u043B\u044F" }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs", style: { color: BASE.inkFaint }, children: [
          daysThisWeek,
          "/",
          weeklyGoal
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-4", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${pct}%`, background: accent } }) }),
      /* @__PURE__ */ jsx(WeekDots, { week, accent })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.inkFaint }, children: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u044C \u0432\u0430\u0436\u043D\u0435\u0435 \u043B\u044E\u0431\u043E\u0439 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438. \u0421\u0435\u0440\u0438\u044F \u2014 \u044D\u0442\u043E \u043D\u0435 \u043F\u0440\u043E \u043F\u043E\u0431\u0435\u0434\u044B, \u0430 \u043F\u0440\u043E \u0442\u043E, \u0447\u0442\u043E\u0431\u044B \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0442\u044C\u0441\u044F \u043A \u0441\u0435\u0431\u0435 \u0434\u0430\u0436\u0435 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430." })
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
function Calibration({ accent, onComplete }) {
  const [stage, setStage] = useState("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const q = CALIBRATION_QUESTIONS[qIndex];
  const selectAnswer = (option) => {
    const next = { ...answers, [q.id]: option };
    setAnswers(next);
    setTimeout(() => {
      if (qIndex + 1 < CALIBRATION_QUESTIONS.length) {
        setQIndex(qIndex + 1);
      } else {
        const r = scoreCalibration(next);
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
      /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2 tracking-wide", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: "\u041A\u0410\u041B\u0418\u0411\u0420\u041E\u0412\u041A\u0410" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-6", style: { color: BASE.inkDim }, children: "\u041E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C \u043A \u0442\u043E\u0440\u0433\u043E\u0432\u043E\u0439 \u0441\u0435\u0441\u0441\u0438\u0438." }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-8 px-2", style: { color: BASE.inkFaint }, children: "\u042D\u0442\u043E \u0437\u0430\u0439\u043C\u0451\u0442 \u043C\u0435\u043D\u0435\u0435 30 \u0441\u0435\u043A\u0443\u043D\u0434. \u041E\u0442\u0432\u0435\u0447\u0430\u0439\u0442\u0435 \u0447\u0435\u0441\u0442\u043D\u043E. \u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u0430\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0435\u0442 \u043D\u0435 \u0440\u044B\u043D\u043E\u043A, \u0430 \u0432\u0430\u0448\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setStage("quiz"),
          className: "px-10 py-3 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, boxShadow: softLift(accent) },
          children: "\u041D\u0430\u0447\u0430\u0442\u044C"
        }
      )
    ] });
  }
  if (stage === "quiz") {
    return /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2 text-xs", style: { color: BASE.inkFaint }, children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "\u0412\u043E\u043F\u0440\u043E\u0441 ",
          qIndex + 1,
          " \u0438\u0437 ",
          CALIBRATION_QUESTIONS.length
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: restart, style: { color: BASE.inkFaint }, children: "\u041E\u0442\u043C\u0435\u043D\u0430" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-6", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-500 ease-out", style: { width: `${qIndex / CALIBRATION_QUESTIONS.length * 100}%`, background: accent } }) }),
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
        /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-wide", style: { color: LOSS }, children: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0444\u0430\u043A\u0442\u043E\u0440 \u0440\u0438\u0441\u043A\u0430" })
      ] }),
      result.riskFactors.map((f, i) => /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.ink }, children: f }, i))
    ] }),
    result.factors.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "text-left mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: "\u0427\u0442\u043E \u043F\u043E\u0432\u043B\u0438\u044F\u043B\u043E \u043D\u0430 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442" }),
      result.factors.map((f, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-sm py-1", children: [
        /* @__PURE__ */ jsx("span", { style: { color: f.type === "positive" ? WIN : WARN }, children: f.type === "positive" ? "\u2713" : "\u26A0" }),
        /* @__PURE__ */ jsx("span", { style: { color: BASE.ink }, children: f.text })
      ] }, i))
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: restart, className: "text-sm transition-opacity duration-150", style: { color: BASE.inkFaint }, children: "\u041F\u0440\u043E\u0439\u0442\u0438 \u0437\u0430\u043D\u043E\u0432\u043E" })
  ] });
}
function JournalReview({ entries, accent, onClose }) {
  const issues = useMemo(() => buildReviewQuiz(entries), [entries]);
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
        setResult(scoreJournalReview(issues, next));
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
      /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2 tracking-wide", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: "\u0420\u0410\u0417\u0411\u041E\u0420" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-8 px-4 leading-relaxed", style: { color: BASE.inkFaint }, children: "\u041F\u043E\u043A\u0430 \u043C\u0430\u043B\u043E\u0432\u0430\u0442\u043E \u0437\u0430\u043F\u0438\u0441\u0435\u0439, \u0447\u0442\u043E\u0431\u044B \u0432\u044B\u0434\u0435\u043B\u0438\u0442\u044C \u0432 \u043D\u0438\u0445 \u0437\u0430\u043A\u043E\u043D\u043E\u043C\u0435\u0440\u043D\u043E\u0441\u0442\u0438. \u0414\u043E\u0431\u0430\u0432\u044C \u0435\u0449\u0451 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0441\u0434\u0435\u043B\u043E\u043A \u2014 \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0445 \u0438 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u2014 \u0438 \u0440\u0430\u0437\u0431\u043E\u0440 \u0441\u0442\u0430\u043D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "px-10 py-3 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, boxShadow: softLift(accent) },
          children: "\u041D\u0430\u0437\u0430\u0434"
        }
      )
    ] });
  }
  if (stage === "intro") {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-4 stagger", children: [
      /* @__PURE__ */ jsx(Sparkles, { size: 38, style: { color: accent }, className: "mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2 tracking-wide", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: "\u0420\u0410\u0417\u0411\u041E\u0420" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm mb-6", style: { color: BASE.inkDim }, children: [
        issues.length,
        " ",
        pluralRu(issues.length, "\u0432\u043E\u043F\u0440\u043E\u0441", "\u0432\u043E\u043F\u0440\u043E\u0441\u0430", "\u0432\u043E\u043F\u0440\u043E\u0441\u043E\u0432"),
        " \u043F\u043E \u0442\u043E\u043C\u0443, \u0447\u0442\u043E \u0443\u0436\u0435 \u0432\u0438\u0434\u043D\u043E \u0432 \u0442\u0432\u043E\u0451\u043C \u0436\u0443\u0440\u043D\u0430\u043B\u0435."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-8 px-2", style: { color: BASE.inkFaint }, children: "\u042D\u0442\u043E \u043D\u0435 \u043F\u0440\u043E \u0440\u044B\u043D\u043E\u043A \u0438 \u043D\u0435 \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u044B\u0439 \u0441\u043E\u0432\u0435\u0442 \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435, \u0432 \u043A\u043E\u0442\u043E\u0440\u043E\u043C \u0442\u044B \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0435\u0448\u044C \u0440\u0435\u0448\u0435\u043D\u0438\u044F. \u041E\u0442\u0432\u0435\u0447\u0430\u0439 \u0447\u0435\u0441\u0442\u043D\u043E, \u0437\u0434\u0435\u0441\u044C \u043D\u0435\u043A\u043E\u043C\u0443 \u043F\u043E\u043D\u0440\u0430\u0432\u0438\u0442\u044C\u0441\u044F." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setStage("quiz"),
          className: "px-10 py-3 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, boxShadow: softLift(accent) },
          children: "\u041D\u0430\u0447\u0430\u0442\u044C"
        }
      ),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "block mx-auto mt-4 text-sm", style: { color: BASE.inkFaint }, children: "\u041D\u0430\u0437\u0430\u0434" })
    ] });
  }
  if (stage === "quiz") {
    return /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2 text-xs", style: { color: BASE.inkFaint }, children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "\u0412\u043E\u043F\u0440\u043E\u0441 ",
          qIndex + 1,
          " \u0438\u0437 ",
          issues.length
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, style: { color: BASE.inkFaint }, children: "\u041E\u0442\u043C\u0435\u043D\u0430" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-6", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-500 ease-out", style: { width: `${qIndex / issues.length * 100}%`, background: accent } }) }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-wide mb-2", style: { color: BASE.inkFaint }, children: q.title }),
      /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed mb-4", style: { color: BASE.inkDim }, children: q.evidence }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg mb-5 leading-snug", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 500 }, children: q.question }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: REVIEW_LIKERT.map((opt) => /* @__PURE__ */ jsx(
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
    /* @__PURE__ */ jsxs("p", { className: "text-[11px] mb-5", style: { color: BASE.inkFaint }, children: [
      totalAnswered,
      " ",
      pluralRu(totalAnswered, "\u0432\u043E\u043F\u0440\u043E\u0441", "\u0432\u043E\u043F\u0440\u043E\u0441\u0430", "\u0432\u043E\u043F\u0440\u043E\u0441\u043E\u0432"),
      dataDrivenAnswered > 0 ? `, \u0438\u0437 \u043D\u0438\u0445 ${dataDrivenAnswered} \u2014 \u043F\u043E \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u043C \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u0430\u043C \u0438\u0437 \u0436\u0443\u0440\u043D\u0430\u043B\u0430` : ""
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "text-left mb-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: result.narrative }) }),
    result.priority && /* @__PURE__ */ jsxs(Card, { className: "mb-4 text-left", style: { border: `1px solid ${LOSS}50`, background: `${LOSS}0D` }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 14, style: { color: LOSS } }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-wide", style: { color: LOSS }, children: "\u041D\u0430\u0447\u043D\u0438 \u0441 \u044D\u0442\u043E\u0433\u043E" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-1", style: { color: BASE.ink, fontWeight: 600 }, children: result.priority.title }),
      /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed mb-2", style: { color: BASE.inkDim }, children: result.priority.evidence }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: result.priority.recommendation })
    ] }),
    result.rest.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "mb-4 text-left", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: "\u0415\u0449\u0451 \u0441\u0442\u043E\u0438\u0442 \u043E\u0431\u0440\u0430\u0442\u0438\u0442\u044C \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435" }),
      result.rest.map((f) => /* @__PURE__ */ jsxs("div", { className: "mb-3 last:mb-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm mb-1", style: { color: BASE.ink, fontWeight: 500 }, children: f.title }),
        /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed", style: { color: BASE.inkDim }, children: f.recommendation })
      ] }, f.id))
    ] }),
    result.clear.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "text-left mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: "\u0422\u0443\u0442 \u0432\u0440\u043E\u0434\u0435 \u043F\u043E\u0440\u044F\u0434\u043E\u043A" }),
      result.clear.map((f) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-sm py-1", children: [
        /* @__PURE__ */ jsx(Check, { size: 13, style: { color: WIN, marginTop: 2, flexShrink: 0 } }),
        /* @__PURE__ */ jsx("span", { style: { color: BASE.ink }, children: f.title })
      ] }, f.id))
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-[11px] mb-5", style: { color: BASE.inkFaint }, children: "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u043F\u0441\u0438\u0445\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0435, \u043D\u0435 \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u044B\u0435 \u2014 \u043E\u043D\u0438 \u043D\u0435 \u043F\u0440\u043E \u0442\u043E, \u0447\u0442\u043E \u0442\u043E\u0440\u0433\u043E\u0432\u0430\u0442\u044C, \u0430 \u043F\u0440\u043E \u0442\u043E, \u043A\u0430\u043A \u0442\u044B \u044D\u0442\u043E \u0434\u0435\u043B\u0430\u0435\u0448\u044C." }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: restart, className: "text-sm", style: { color: BASE.inkFaint }, children: "\u041F\u0440\u043E\u0439\u0442\u0438 \u0437\u0430\u043D\u043E\u0432\u043E" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "px-8 py-2.5 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 },
          children: "\u0413\u043E\u0442\u043E\u0432\u043E"
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
  if (liqPrice != null) drawDashed(liqPrice, WARN, "\u043B\u0438\u043A\u0432.");
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
function CandleChart({ engineRef, accent, entryPrice, liqPrice, tpPrice, slPrice, direction, groupFactor = 1 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    const loop = () => {
      if (canvasRef.current) {
        drawChart(canvasRef.current, engineRef.current, { accent, entryPrice, liqPrice, tpPrice, slPrice, direction, groupFactor });
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
function OrderRadar({ engineRef, accent }) {
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
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: "\u041A\u0440\u0443\u043F\u043D\u044B\u0435 \u0437\u0430\u044F\u0432\u043A\u0438" }),
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[9px]", style: { color: BASE.inkFaint }, children: [
        /* @__PURE__ */ jsx("span", { style: { width: 5, height: 5, borderRadius: 999, background: WIN, display: "inline-block" } }),
        " \u0431\u0438\u0434",
        /* @__PURE__ */ jsx("span", { style: { width: 5, height: 5, borderRadius: 999, background: LOSS, display: "inline-block", marginLeft: 4 } }),
        " \u0430\u0441\u043A"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { width: "100%", height: 118 }, children: /* @__PURE__ */ jsx("canvas", { ref: canvasRef, style: { width: "100%", height: "100%", display: "block" } }) }),
    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-center mt-1.5", style: { color: BASE.inkFaint }, children: "\u041D\u0435 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u044F \u2014 \u043C\u043E\u0433\u0443\u0442 \u0441\u043D\u044F\u0442\u044C, \u0438\u0441\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0438\u043B\u0438 \u0441\u0434\u0432\u0438\u043D\u0443\u0442\u044C \u0432 \u043B\u044E\u0431\u043E\u0439 \u043C\u043E\u043C\u0435\u043D\u0442" })
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
function Simulator({ accent, onWin }) {
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
    const capitalSeq = [SIM_START_CAPITAL, ...finalTrades.map((t) => t.capitalAfter)];
    let peak = SIM_START_CAPITAL, maxDD = 0;
    capitalSeq.forEach((c) => {
      peak = Math.max(peak, c);
      maxDD = Math.max(maxDD, (peak - c) / peak);
    });
    const eng = engineRef.current;
    const marketReturn = eng ? (eng.price - 100) / 100 : 0;
    const playerReturn = (finalCapital - SIM_START_CAPITAL) / SIM_START_CAPITAL;
    const impulsive = finalTrades.filter((t) => t.durationMs < 3e3).length;
    const anyLiquidated = finalTrades.some((t) => t.liquidated);
    const achievements = [];
    if (maxDD < 0.15) achievements.push(SIM_ACHIEVEMENTS.lowRisk);
    if (finalTrades.length > 0 && impulsive === 0) achievements.push(SIM_ACHIEVEMENTS.noImpulsive);
    if (maxDD < 0.05) achievements.push(SIM_ACHIEVEMENTS.tightDrawdown);
    if (!anyLiquidated && finalTrades.length > 0) achievements.push(SIM_ACHIEVEMENTS.survivedVol);
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
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1e3);
    return () => clearTimeout(t);
  }, [stage, secondsLeft]);
  const startSession = () => {
    const seed = Math.floor(Math.random() * 1e9);
    const eng = createMarketEngine(seed, 100);
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
      /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2 tracking-wide", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: "\u0421\u0418\u041C\u0423\u041B\u042F\u0422\u041E\u0420 \u0420\u042B\u041D\u041A\u0410" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-8", style: { color: BASE.inkDim }, children: "\u0418\u0441\u043A\u0443\u0441\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0440\u044B\u043D\u043E\u043A. \u0420\u0435\u0430\u043B\u044C\u043D\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F." }),
      /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "text-left mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "'Space Grotesk', sans-serif" }, children: "\u0422\u0435\u0440\u043C\u0438\u043D\u0430\u043B" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full", style: { color: accent, border: `1px solid ${accent}40` }, children: "Beta" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.inkDim }, children: "\u0420\u0430\u0434\u0430\u0440 \u043A\u0440\u0443\u043F\u043D\u044B\u0445 \u0437\u0430\u044F\u0432\u043E\u043A, \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u0438 \u043F\u043B\u0435\u0447\u043E \u0434\u043E x50. \u0420\u044B\u043D\u043E\u043A \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0443\u0436\u0435 \xAB\u0432 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0435\xBB \u2014 \u0441 \u0438\u0441\u0442\u043E\u0440\u0438\u0435\u0439 \u043D\u0430 \u0433\u0440\u0430\u0444\u0438\u043A\u0435 \u2014 \u0438 \u0432\u0435\u0434\u0451\u0442 \u0441\u0435\u0431\u044F \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u0432\u0430\u0448\u0438\u0445 \u0441\u0434\u0435\u043B\u043E\u043A." })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: startSession,
          className: "px-10 py-3 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, boxShadow: softLift(accent) },
          children: "\u041D\u0430\u0447\u0430\u0442\u044C \u0441\u0435\u0441\u0441\u0438\u044E"
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
                "\u0441"
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
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: "\u041A\u0430\u043F\u0438\u0442\u0430\u043B" }),
          /* @__PURE__ */ jsx("div", { className: "text-[22px] leading-none", style: { fontFamily: "'JetBrains Mono', monospace", color: BASE.ink, fontWeight: 500 }, children: formatSimMoney(liveEquity) }),
          /* @__PURE__ */ jsxs("span", { className: "text-[11px]", style: { color: liveEquity >= SIM_START_CAPITAL ? WIN : LOSS, fontFamily: "'JetBrains Mono', monospace" }, children: [
            liveEquity >= SIM_START_CAPITAL ? "+" : "",
            ((liveEquity - SIM_START_CAPITAL) / SIM_START_CAPITAL * 100).toFixed(1),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: "\u0426\u0435\u043D\u0430" }),
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
            groupFactor
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
              uiNews.ageMs < uiNews.rampMs && /* @__PURE__ */ jsx("span", { className: "text-[9px] shrink-0 ml-auto", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: "\u0440\u0435\u0430\u043A\u0446\u0438\u044F\u2026" })
            ]
          }
        ),
        liquidated && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", style: { background: `${LOSS}18`, backdropFilter: "blur(1px)" }, children: /* @__PURE__ */ jsx("span", { className: "px-3 py-1.5 rounded-full text-[12px]", style: { background: LOSS, color: "#1A0806", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }, children: "\u041F\u043E\u0437\u0438\u0446\u0438\u044F \u043B\u0438\u043A\u0432\u0438\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u0430" }) }),
        autoClosedTag && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", style: { background: `${autoClosedTag === "tp" ? WIN : LOSS}18`, backdropFilter: "blur(1px)" }, children: /* @__PURE__ */ jsx("span", { className: "px-3 py-1.5 rounded-full text-[12px]", style: { background: autoClosedTag === "tp" ? WIN : LOSS, color: "#06120F", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }, children: autoClosedTag === "tp" ? "Take-profit \u0441\u0440\u0430\u0431\u043E\u0442\u0430\u043B" : "Stop-loss \u0441\u0440\u0430\u0431\u043E\u0442\u0430\u043B" }) })
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
              position.direction === "long" ? "\u041B\u043E\u043D\u0433" : "\u0428\u043E\u0440\u0442",
              " x",
              position.leverage
            ] }),
            "\u0432\u0445\u043E\u0434 ",
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
            "\u041C\u0430\u0440\u0436\u0430 ",
            formatSimMoney(position.margin)
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "P&L ",
            liveFloatingPnl >= 0 ? "+" : "",
            formatSimMoney(liveFloatingPnl)
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { color: WARN }, children: [
            "\u043B\u0438\u043A\u0432. ",
            formatPrice(liqPrice)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          addMarginAmount >= 50 && /* @__PURE__ */ jsxs("button", { onClick: addMargin, className: "flex-1 py-2.5 rounded-full text-[13px] transition-all duration-150 active:scale-95", style: { border: `1px solid ${accent}40`, color: accent, background: `${accent}0D` }, children: [
            "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C ",
            formatSimMoney(addMarginAmount)
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: closePosition, className: "flex-1 py-2.5 rounded-full text-[13px] transition-all duration-150 active:scale-95", style: { border: `1px solid ${BASE.line}`, color: BASE.ink, background: BASE.surface2 }, children: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0437\u0438\u0446\u0438\u044E" })
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-center mb-1.5", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: [
          "\u041C\u0430\u0440\u0436\u0430 ",
          formatSimMoney(capital * MARGIN_FRACTION),
          " \xB7 \u043E\u0431\u044A\u0451\u043C x",
          leverage,
          " = ",
          formatSimMoney(capital * MARGIN_FRACTION * leverage)
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-2.5", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => openPosition("long"), className: "flex-1 py-3 rounded-2xl text-sm transition-all duration-150 active:scale-95", style: { border: `1px solid ${WIN}40`, color: WIN, background: `${WIN}0D` }, children: "\u041B\u043E\u043D\u0433" }),
          /* @__PURE__ */ jsx("button", { onClick: () => openPosition("short"), className: "flex-1 py-3 rounded-2xl text-sm transition-all duration-150 active:scale-95", style: { border: `1px solid ${LOSS}40`, color: LOSS, background: `${LOSS}0D` }, children: "\u0428\u043E\u0440\u0442" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(OrderRadar, { engineRef, accent })
    ] });
  }
  const r = result;
  return /* @__PURE__ */ jsxs("div", { className: "text-center stagger", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg mb-1 tracking-wide", style: { fontFamily: "'Space Grotesk', sans-serif", color: BASE.ink, fontWeight: 600 }, children: "\u0421\u0415\u0421\u0421\u0418\u042F \u0417\u0410\u0412\u0415\u0420\u0428\u0415\u041D\u0410" }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs mb-6", style: { color: BASE.inkFaint }, children: [
      "\u041A\u0430\u043F\u0438\u0442\u0430\u043B: ",
      formatSimMoney(r.finalCapital)
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-[40px] leading-none mb-2", style: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: r.playerReturn >= 0 ? WIN : LOSS }, children: [
      r.playerReturn >= 0 ? "+" : "",
      (r.playerReturn * 100).toFixed(1),
      "%"
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-base mb-6", style: { color: r.beatMarket ? WIN : LOSS, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }, children: r.beatMarket ? "\u041F\u043E\u0431\u0435\u0434\u0430 \u043D\u0430\u0434 \u0440\u044B\u043D\u043A\u043E\u043C." : "\u0420\u044B\u043D\u043E\u043A \u043E\u043A\u0430\u0437\u0430\u043B\u0441\u044F \u0441\u0438\u043B\u044C\u043D\u0435\u0435." }),
    /* @__PURE__ */ jsxs(Card, { className: "text-left mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm py-1", children: [
        /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u0414\u043E\u0445\u043E\u0434\u043D\u043E\u0441\u0442\u044C \u0440\u044B\u043D\u043A\u0430" }),
        /* @__PURE__ */ jsxs("span", { style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: [
          r.marketReturn >= 0 ? "+" : "",
          (r.marketReturn * 100).toFixed(1),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm py-1", children: [
        /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u0421\u0434\u0435\u043B\u043E\u043A" }),
        /* @__PURE__ */ jsx("span", { style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: r.tradesCount })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm py-1", children: [
        /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u041C\u0430\u043A\u0441. \u043F\u0440\u043E\u0441\u0430\u0434\u043A\u0430" }),
        /* @__PURE__ */ jsxs("span", { style: { color: BASE.ink, fontFamily: "'JetBrains Mono', monospace" }, children: [
          (r.maxDD * 100).toFixed(1),
          "%"
        ] })
      ] }),
      r.liquidated && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm py-1", children: [
        /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u041B\u0438\u043A\u0432\u0438\u0434\u0430\u0446\u0438\u0438" }),
        /* @__PURE__ */ jsx("span", { style: { color: WARN, fontFamily: "'JetBrains Mono', monospace" }, children: "\u0431\u044B\u043B\u0438" })
      ] })
    ] }),
    r.achievements.length > 0 && /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "text-left mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F" }),
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
        children: "\u0418\u0433\u0440\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430"
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
  onLogout
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
      " \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438"
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 rounded-xl mb-2", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { color: BASE.ink }, children: [
          /* @__PURE__ */ jsx(User, { size: 15, style: { color: accent } }),
          " ",
          username || "\u2014"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase", style: { color: BASE.inkFaint, fontFamily: "'JetBrains Mono', monospace" }, children: "local" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: onLogout, className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: BASE.inkDim }, children: [
        /* @__PURE__ */ jsx(LogOut, { size: 15 }),
        " \u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mt-2", style: { color: BASE.inkFaint }, children: "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0442\u0435\u0441\u0442\u043E\u0432\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435. \u0414\u0430\u043D\u043D\u044B\u0435 \u043D\u0435 \u0443\u0434\u0430\u043B\u044F\u044E\u0442\u0441\u044F \u043F\u0440\u0438 \u0432\u044B\u0445\u043E\u0434\u0435 \u0438 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0442\u0441\u044F \u043F\u0440\u0438 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C \u0432\u0445\u043E\u0434\u0435." })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: "\u0418\u043C\u044F \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440\u0430" }),
      /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "\u041E\u043F\u0435\u0440\u0430\u0442\u043E\u0440", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink } })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: "\u0410\u043A\u0446\u0435\u043D\u0442\u043D\u044B\u0439 \u0446\u0432\u0435\u0442" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: ACCENTS.map((a) => /* @__PURE__ */ jsxs("button", { onClick: () => {
        setAccent(a);
        onThemeChange(a.name);
      }, className: "flex flex-col items-center gap-1.5 transition-transform duration-150 active:scale-90", children: [
        /* @__PURE__ */ jsx("span", { className: "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300", style: { background: a.value, boxShadow: accent === a.value ? `0 0 0 3px ${BASE.bg}, 0 0 0 4.5px ${a.value}60` : "none" }, children: accent === a.value && /* @__PURE__ */ jsx(Check, { size: 16, color: "#06120F" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px]", style: { color: BASE.inkFaint }, children: a.name })
      ] }, a.name)) })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: "\u0415\u0434\u0438\u043D\u0438\u0446\u044B \u0438\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u044F \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-3", children: [{ id: "R", label: "R-\u043C\u0443\u043B\u044C\u0442\u0438\u043F\u043B\u0438\u043A\u0430\u0442\u043E\u0440" }, { id: "currency", label: "\u0412\u0430\u043B\u044E\u0442\u0430" }].map((m) => /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsx(SectionLabel, { children: "\u041D\u0430\u0447\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B" }),
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
      /* @__PURE__ */ jsx(SectionLabel, { children: "\u041D\u0435\u0434\u0435\u043B\u044C\u043D\u0430\u044F \u0446\u0435\u043B\u044C \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u0438" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: [3, 5, 7].map((g) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setWeeklyGoal(g),
          className: "px-4 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
          style: { background: weeklyGoal === g ? `${accent}12` : "transparent", color: weeklyGoal === g ? accent : BASE.inkDim, border: `1px solid ${weeklyGoal === g ? accent + "40" : BASE.line}` },
          children: [
            g,
            " \u0434\u043D\u0435\u0439"
          ]
        },
        g
      )) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mt-2", style: { color: BASE.inkFaint }, children: "\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0434\u043D\u0435\u0439 \u0432 \u043D\u0435\u0434\u0435\u043B\u044E \u043D\u0443\u0436\u043D\u043E \u0432\u0435\u0441\u0442\u0438 \u0436\u0443\u0440\u043D\u0430\u043B \u0434\u043B\u044F \u0447\u0435\u043B\u043B\u0435\u043D\u0434\u0436\u0430 \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u0438." })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: "\u0417\u0432\u0443\u043A" }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setSoundOn(!soundOn), className: "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { color: BASE.ink }, children: [
          soundOn ? /* @__PURE__ */ jsx(Volume2, { size: 16, style: { color: accent } }) : /* @__PURE__ */ jsx(VolumeX, { size: 16, style: { color: BASE.inkFaint } }),
          "\u0417\u0432\u0443\u043A \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438 \u0437\u0430\u043F\u0438\u0441\u0438"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "w-9 h-5 rounded-full relative transition-all duration-200", style: { background: soundOn ? accent : BASE.line }, children: /* @__PURE__ */ jsx("span", { className: "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200", style: { left: soundOn ? "18px" : "2px" } }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: "\u0414\u0430\u043D\u043D\u044B\u0435" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mb-2.5", style: { color: BASE.inkFaint }, children: "\u0412\u0441\u0451 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435 (\u0438\u043B\u0438 \u0432 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0435, \u0435\u0441\u043B\u0438 \u0442\u044B \u0432\u043E\u0448\u0451\u043B). \u041F\u043E\u043B\u043D\u044B\u0439 \u0431\u044D\u043A\u0430\u043F \u2014 \u043D\u0430 \u0441\u043B\u0443\u0447\u0430\u0439 \u0441\u043C\u0435\u043D\u044B \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u0438\u043B\u0438 \u043D\u0430 \u0432\u0441\u044F\u043A\u0438\u0439 \u0441\u043B\u0443\u0447\u0430\u0439." }),
      /* @__PURE__ */ jsxs("button", { onClick: onExportBackup, className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-2 transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${accent}40`, background: `${accent}0D`, color: BASE.ink }, children: [
        /* @__PURE__ */ jsx(Download, { size: 15, style: { color: accent } }),
        " \u041F\u043E\u043B\u043D\u044B\u0439 \u0431\u044D\u043A\u0430\u043F (.json)"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => importBackupInputRef.current?.click(), className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-3 transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${accent}40`, background: `${accent}0D`, color: BASE.ink }, children: [
        /* @__PURE__ */ jsx(Upload, { size: 15, style: { color: accent } }),
        " \u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0438\u0437 \u0431\u044D\u043A\u0430\u043F\u0430 (.json)"
      ] }),
      /* @__PURE__ */ jsx("input", { ref: importBackupInputRef, type: "file", accept: "application/json,.json", className: "hidden", onChange: (e) => {
        const f = e.target.files?.[0];
        e.target.value = "";
        if (f) onImportBackup(f);
      } }),
      /* @__PURE__ */ jsxs("button", { onClick: onExport, className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-2 transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: BASE.ink }, children: [
        /* @__PURE__ */ jsx(Download, { size: 15, style: { color: accent } }),
        " \u042D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0436\u0443\u0440\u043D\u0430\u043B (.json)"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => importInputRef.current?.click(), className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-2 transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: BASE.ink }, children: [
        /* @__PURE__ */ jsx(Upload, { size: 15, style: { color: accent } }),
        " \u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0436\u0443\u0440\u043D\u0430\u043B (.json)"
      ] }),
      /* @__PURE__ */ jsx("input", { ref: importInputRef, type: "file", accept: "application/json,.json", className: "hidden", onChange: (e) => {
        const f = e.target.files?.[0];
        e.target.value = "";
        if (f) onImport(f);
      } }),
      confirmReset ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3 rounded-xl", style: { border: `1px solid ${LOSS}50`, background: `${LOSS}0D` }, children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 15, style: { color: LOSS } }),
        /* @__PURE__ */ jsx("span", { className: "text-xs flex-1", style: { color: BASE.ink }, children: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0432\u0441\u0435 \u0437\u0430\u043F\u0438\u0441\u0438 \u0431\u0435\u0437 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u043E\u0442\u043C\u0435\u043D\u044B?" }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          onReset();
          setConfirmReset(false);
        }, className: "text-xs shrink-0", style: { color: LOSS }, children: "\u0414\u0430" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setConfirmReset(false), className: "text-xs shrink-0", style: { color: BASE.inkFaint }, children: "\u041E\u0442\u043C\u0435\u043D\u0430" })
      ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setConfirmReset(true), className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: LOSS }, children: [
        /* @__PURE__ */ jsx(Trash2, { size: 15 }),
        " \u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0436\u0443\u0440\u043D\u0430\u043B"
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: "\u041F\u043E\u043B\u043D\u044B\u0439 \u0441\u0431\u0440\u043E\u0441" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mb-3", style: { color: BASE.inkFaint }, children: "\u0421\u0442\u0438\u0440\u0430\u0435\u0442 \u0436\u0443\u0440\u043D\u0430\u043B, \u0432\u0441\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438, \u0441\u0432\u043E\u0438 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B, \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0438 \u0438 \u043A\u043E\u0448\u0435\u043B\u0451\u043A MindCoin \u2014 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043A \u043F\u0435\u0440\u0432\u043E\u043C\u0443 \u0437\u0430\u043F\u0443\u0441\u043A\u0443." }),
      confirmFullReset ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3 rounded-xl", style: { border: `1px solid ${LOSS}50`, background: `${LOSS}0D` }, children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 15, style: { color: LOSS } }),
        /* @__PURE__ */ jsx("span", { className: "text-xs flex-1", style: { color: BASE.ink }, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u043E\u043E\u0431\u0449\u0435 \u0432\u0441\u0451?" }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          onFullReset();
          setConfirmFullReset(false);
        }, className: "text-xs shrink-0", style: { color: LOSS }, children: "\u0414\u0430, \u0441\u0431\u0440\u043E\u0441\u0438\u0442\u044C" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setConfirmFullReset(false), className: "text-xs shrink-0", style: { color: BASE.inkFaint }, children: "\u041E\u0442\u043C\u0435\u043D\u0430" })
      ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setConfirmFullReset(true), className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${LOSS}50`, background: `${LOSS}0D`, color: LOSS }, children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 15 }),
        " \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u0441\u0451 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435"
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: BASE.inkFaint }, children: "\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B \u0441\u0434\u0435\u043B\u043E\u043A \u0445\u0440\u0430\u043D\u044F\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u044D\u0442\u043E\u0439 \u0441\u0435\u0441\u0441\u0438\u0438 \u0438 \u043D\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F \u043C\u0435\u0436\u0434\u0443 \u0432\u0438\u0437\u0438\u0442\u0430\u043C\u0438. \u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0438 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0441 \u0431\u0440\u043E\u043A\u0435\u0440\u043E\u043C \u043F\u043E\u043A\u0430 \u043D\u0435 \u0440\u0435\u0430\u043B\u0438\u0437\u043E\u0432\u0430\u043D\u044B." })
  ] });
}
function sanitizeImportedEntry(e, fallbackIndex) {
  if (!e || typeof e !== "object") return null;
  const date = new Date(e.date);
  if (isNaN(date.getTime())) return null;
  const clampCoord = (v) => typeof v === "number" && !isNaN(v) ? Math.max(0, Math.min(100, v)) : null;
  return {
    id: e.id != null ? String(e.id) : `imported_${Date.now()}_${fallbackIndex}_${Math.random().toString(36).slice(2, 6)}`,
    instrument: typeof e.instrument === "string" && e.instrument ? e.instrument : "\u2014",
    direction: e.direction === "Short" ? "Short" : "Long",
    outcome: ["Win", "Loss", "Breakeven"].includes(e.outcome) ? e.outcome : "Breakeven",
    r: typeof e.r === "number" && !isNaN(e.r) ? e.r : null,
    tag: typeof e.tag === "string" && e.tag ? e.tag : "\u041E\u0431\u0449\u0435\u0435",
    x: clampCoord(e.x),
    y: clampCoord(e.y),
    pull: typeof e.pull === "string" && e.pull ? e.pull : "\u2014",
    lesson: typeof e.lesson === "string" && e.lesson ? e.lesson : "\u2014",
    date,
    screenshots: Array.isArray(e.screenshots) ? e.screenshots.filter((s) => typeof s === "string").slice(0, 4) : []
  };
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
async function storageGet(key, shared = false) {
  if (!window.storage || storageDegraded) return null;
  try {
    return await queueStorage(() => withStorageRetry(() => window.storage.get(key, shared)));
  } catch (e) {
    markStorageDegraded(e);
    throw e;
  }
}
async function storageSet(key, value, shared = false) {
  if (!window.storage || storageDegraded) return null;
  try {
    return await queueStorage(() => withStorageRetry(() => window.storage.set(key, value, shared)));
  } catch (e) {
    markStorageDegraded(e);
    throw e;
  }
}
async function storageDelete(key, shared = false) {
  if (!window.storage || storageDegraded) return null;
  try {
    return await queueStorage(() => withStorageRetry(() => window.storage.delete(key, shared)));
  } catch (e) {
    markStorageDegraded(e);
    throw e;
  }
}
function profileKey(userId) {
  return `${PROFILE_KEY}:${userId}`;
}
function mediaKey(userId) {
  return `${MEDIA_KEY}:${userId}`;
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
var AUTH_SESSION_KEY = "mind-exe-auth-session";
var LEGACY_CLAIMED_KEY = "mind-exe-legacy-claimed";
function mockHashPassword(pw) {
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = (h * 33 ^ pw.charCodeAt(i)) >>> 0;
  return `mock:${h.toString(16)}`;
}
var memoryAuthUsers = {};
var memoryAuthSession = null;
async function loadAuthUsers() {
  if (!window.storage || storageDegraded) return memoryAuthUsers;
  try {
    const res = await storageGet(AUTH_USERS_KEY, false);
    return res?.value ? JSON.parse(res.value) : {};
  } catch (_) {
    return {};
  }
}
async function saveAuthUsers(users) {
  memoryAuthUsers = users;
  if (!window.storage || storageDegraded) return;
  try {
    await storageSet(AUTH_USERS_KEY, JSON.stringify(users), false);
  } catch (e) {
    console.warn("mind.exe: account storage unavailable in this preview \u2014 accounts will only last this session", e);
  }
}
async function loadAuthSession() {
  if (!window.storage || storageDegraded) return memoryAuthSession;
  try {
    const res = await storageGet(AUTH_SESSION_KEY, false);
    return res?.value ? JSON.parse(res.value) : null;
  } catch (_) {
    return null;
  }
}
async function saveAuthSession(session) {
  memoryAuthSession = session || null;
  if (!window.storage || storageDegraded) return;
  try {
    if (!session) {
      await storageDelete(AUTH_SESSION_KEY, false);
    } else {
      await storageSet(AUTH_SESSION_KEY, JSON.stringify(session), false);
    }
  } catch (e) {
    console.warn("mind.exe: session storage unavailable in this preview \u2014 staying logged in only for this tab", e);
  }
}
function createLocalAuthProvider() {
  return {
    async register(username, password) {
      const uname = (username || "").trim();
      if (uname.length < 3) throw new Error("\u041B\u043E\u0433\u0438\u043D \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043E\u0442 3 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432");
      if ((password || "").length < 4) throw new Error("\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043E\u0442 4 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432");
      const key = uname.toLowerCase();
      const users = await loadAuthUsers();
      if (users[key]) throw new Error("\u0422\u0430\u043A\u043E\u0439 \u043B\u043E\u0433\u0438\u043D \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442");
      const user = {
        id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        username: uname,
        email: null,
        authProvider: "local",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      users[key] = { ...user, passwordHash: mockHashPassword(password) };
      await saveAuthUsers(users);
      await saveAuthSession({ userId: user.id, username: user.username });
      return user;
    },
    async login(username, password) {
      const key = (username || "").trim().toLowerCase();
      const users = await loadAuthUsers();
      const record = users[key];
      if (!record || record.passwordHash !== mockHashPassword(password || "")) {
        throw new Error("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C");
      }
      const { passwordHash, ...user } = record;
      await saveAuthSession({ userId: user.id, username: user.username });
      return user;
    },
    async logout() {
      await saveAuthSession(null);
    },
    async getSession() {
      const session = await loadAuthSession();
      if (!session?.userId) return null;
      const users = await loadAuthUsers();
      const record = Object.values(users).find((u) => u.id === session.userId);
      if (!record) return null;
      const { passwordHash, ...user } = record;
      return user;
    }
  };
}
var authProvider = createLocalAuthProvider();
var authService = {
  register: (username, password) => authProvider.register(username, password),
  login: (username, password) => authProvider.login(username, password),
  logout: () => authProvider.logout(),
  getCurrentUser: () => authProvider.getSession()
};
async function checkLegacyDataAvailable() {
  if (!window.storage) return false;
  try {
    const claimed = await storageGet(LEGACY_CLAIMED_KEY, false);
    if (claimed?.value) return false;
    const legacy = await storageGet(PROFILE_KEY, false);
    return !!legacy?.value;
  } catch (_) {
    return false;
  }
}
async function claimLegacyData(userId) {
  if (!window.storage) return;
  try {
    const [legacyProfile, legacyMedia] = await Promise.all([
      storageGet(PROFILE_KEY, false).catch(() => null),
      storageGet(MEDIA_KEY, false).catch(() => null)
    ]);
    if (legacyProfile?.value) await storageSet(profileKey(userId), legacyProfile.value, false);
    if (legacyMedia?.value) await storageSet(mediaKey(userId), legacyMedia.value, false);
  } finally {
    try {
      await storageSet(LEGACY_CLAIMED_KEY, "1", false);
    } catch (_) {
    }
  }
}
async function skipLegacyData() {
  if (!window.storage) return;
  try {
    await storageSet(LEGACY_CLAIMED_KEY, "1", false);
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
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setStatus("unauthenticated");
  };
  return { status, user, register, login, logout };
}
function AuthScreen({ accent, onRegister, onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
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
          disabled: true,
          type: "button",
          className: "w-full py-3 rounded-xl text-sm mb-6 flex items-center justify-center gap-2 opacity-40 cursor-not-allowed",
          style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim },
          children: [
            "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u0441 Google ",
            /* @__PURE__ */ jsx("span", { className: "text-[10px]", style: { color: BASE.inkFaint }, children: "\xB7 \u0441\u043A\u043E\u0440\u043E" })
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
function MindExe() {
  const [entries, setEntries] = useState(seedEntries);
  const [tab, setTab] = useState("home");
  const [accentPreset, setAccentPreset] = useState(ACCENTS.find((a) => a.cosmic) || ACCENTS[0]);
  const [name, setName] = useState("");
  const [toast, setToast] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [measureMode, setMeasureMode] = useState("R");
  const [currency, setCurrency] = useState("USD");
  const [startingCapital, setStartingCapital] = useState(1e3);
  const [customInstruments, setCustomInstruments] = useState([]);
  const [customTags, setCustomTags] = useState([]);
  const [lastCalibration, setLastCalibration] = useState(null);
  const [mindCoins, setMindCoins] = useState(0);
  const [coinLedger, setCoinLedger] = useState([]);
  const [lastDailyReward, setLastDailyReward] = useState(null);
  const analytics = useMemo(() => calculateTraderAnalytics(entries, lastCalibration), [entries, lastCalibration]);
  const [walletOpen, setWalletOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [anonId] = useState(getOrCreateAnonId);
  const toastTimer = useRef(null);
  const firstLoadRef = useRef(true);
  const firstDailyRewardRef = useRef(true);
  const { status: authStatus, user: authUser, register: authRegister, login: authLogin, logout: authLogout } = useAuth();
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
    resetInMemoryState();
    setTab("home");
  };
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
          const restoredEntries = rawEntries.map((e) => ({
            ...e,
            date: new Date(e.date),
            screenshots: Array.isArray(media?.[e.id]) ? media[e.id] : []
          }));
          setEntries(restoredEntries);
          if (user.name !== void 0) setName(user.name);
          if (typeof settings.accentIndex === "number") setAccentPreset(ACCENTS[settings.accentIndex] || ACCENTS.find((a) => a.cosmic) || ACCENTS[0]);
          if (typeof settings.soundOn === "boolean") setSoundOn(settings.soundOn);
          if (typeof settings.weeklyGoal === "number") setWeeklyGoal(settings.weeklyGoal);
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
    const src = { entries, name, accentIndex: ACCENTS.findIndex((a) => a.value === accentPreset.value), soundOn, weeklyGoal, measureMode, currency, startingCapital, customInstruments, customTags, lastCalibration, mindCoins, coinLedger, lastDailyReward, ...overrides };
    return {
      version: SCHEMA_VERSION,
      user: { name: src.name, anonId },
      journal: {
        entries: src.entries.map(({ screenshots, ...rest }) => ({ ...rest, date: rest.date instanceof Date ? rest.date.toISOString() : rest.date }))
      },
      settings: {
        accentIndex: src.accentIndex,
        soundOn: src.soundOn,
        weeklyGoal: src.weeklyGoal,
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
        if (Array.isArray(e.screenshots) && e.screenshots.length > 0) mediaMap[e.id] = e.screenshots;
      }
      await saveMedia(userId, mediaMap);
    } catch (_) {
    }
  };
  useEffect(() => {
    if (!loaded || authStatus !== "authenticated" || !userId) return;
    persistNow();
  }, [entries, name, accentPreset, soundOn, weeklyGoal, measureMode, currency, startingCapital, customInstruments, customTags, lastCalibration, mindCoins, coinLedger, lastDailyReward, loaded, authStatus, userId]);
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
  }, [entries, name, accentPreset, soundOn, weeklyGoal, measureMode, currency, startingCapital, customInstruments, customTags, lastCalibration, mindCoins, coinLedger, lastDailyReward, loaded, authStatus, userId]);
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
      const data = entries.map((e) => ({ ...e, date: e.date.toISOString() }));
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
      payload.journal.entries = entries.map((e) => ({ ...e, date: e.date instanceof Date ? e.date.toISOString() : e.date }));
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
    { id: "home", label: "\u0418\u0418", icon: Sparkles },
    { id: "new", label: "\u0414\u043D\u0435\u0432\u043D\u0438\u043A", icon: BookOpen },
    { id: "log", label: "\u0417\u0430\u043C\u0435\u0442\u043A\u0438", icon: NotebookText },
    { id: "patterns", label: "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430", icon: LineChartIcon },
    { id: "simulator", label: "\u0418\u0433\u0440\u0430", icon: Swords },
    { id: "challenge", label: "\u0427\u0435\u043B\u043B\u0435\u043D\u0434\u0436", icon: Flame },
    { id: "settings", label: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438", icon: SettingsIcon }
  ];
  const activeIndex = nav.findIndex((n) => n.id === tab);
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

        /* ---------- Splash v2: a canvas-rendered "alive" black hole (see drawBlackHole) behind a
           radar-ringed logo intro \u2014 CSS gradients alone read too flat/graphic for this, canvas gives
           per-pixel control over the ring's brightness variation and a genuinely animated shimmer. ---------- */
        .splash2-root { background: #000; overflow: hidden; }
        @keyframes splash2RiseFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes splash2RingExpand { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }

        .splash2-bh-scene { position: absolute; inset: 0; height: 62%; }
        .splash2-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 55% at 50% 26%, transparent 40%, rgba(0,0,0,0.55) 78%, #000 100%);
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
    !showSplash && authStatus === "unauthenticated" && /* @__PURE__ */ jsx(AuthScreen, { accent, onRegister: handleRegister, onLogin: handleLogin }),
    !showSplash && authStatus === "authenticated" && migrateFor && /* @__PURE__ */ jsx(LegacyMigratePrompt, { accent, onMigrate: handleMigrate, onSkip: handleSkipMigrate }),
    !showSplash && authStatus === "authenticated" && !migrateFor && /* @__PURE__ */ jsxs(Fragment, { children: [
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
          tab === "home" && /* @__PURE__ */ jsx(Home, { entries, goTo: setTab, accent, name, measureMode, currency, startingCapital, lastCalibration, analytics }),
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
          tab === "log" && /* @__PURE__ */ jsx(Log, { entries, accent, onDelete: deleteEntry, measureMode, currency }),
          tab === "patterns" && /* @__PURE__ */ jsx(Patterns, { entries, accent, measureMode, currency, analytics }),
          tab === "calibration" && /* @__PURE__ */ jsx(Calibration, { accent, onComplete: setLastCalibration }),
          tab === "simulator" && /* @__PURE__ */ jsx(Simulator, { accent, onWin: () => {
            awardCoins(5, "\u041F\u043E\u0431\u0435\u0434\u0430 \u0432 \u0438\u0433\u0440\u0435");
            showToast("+5 MindCoin \u2014 \u043F\u043E\u0431\u0435\u0434\u0430 \u0432 \u0438\u0433\u0440\u0435");
          } }),
          tab === "challenge" && /* @__PURE__ */ jsx(Challenge, { entries, accent, weeklyGoal }),
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
              onLogout: handleLogout
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
