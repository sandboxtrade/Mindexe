import { useState, useMemo, useEffect, useRef } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, ResponsiveContainer, Cell,
  Tooltip, AreaChart, Area
} from "recharts";
import {
  Sparkles, BookOpen, NotebookText, LineChart as LineChartIcon, Flame, ChevronRight,
  ChevronLeft, Check, X as XIcon, CalendarCheck, ShieldCheck, PenLine, TrendingUp,
  Gauge, RotateCcw, Bitcoin, Activity
} from "lucide-react";
import { BASE, WIN, LOSS, FLAT, DIRECTION_LABEL } from "../../config/app-config.js?v=4.9.0";
import {
  countExcludedResultEntries, formatBalance, formatResult, formatStoredResult, hasRealizedRR,
  resultEntriesForUnit, unitSymbol
} from "../../core/trade-math.js?v=4.9.0";
import { st_mean } from "../../core/stats.js?v=4.9.0";
import { emotionClampPct, emotionScaleKeys, emotionConflict, isEntryClosed, normalizeEmotions } from "../../core/journal-model.js?v=4.9.0";
import { TREND_ARROW, analyzeTraderPatterns, calculateTraderLevel } from "../../analytics/trader-analytics.js?v=4.9.0";
import { caWithTimeout } from "../../analytics/calibration-review.js?v=4.9.0";
import { JournalReview } from "../calibration/calibration-ui.js?v=4.9.0";
import { Card, Pill, SkeletonLines, EmptyState, StatCard } from "../../ui/primitives.js?v=4.9.0";
import { aiGenerateHomeAdvice, aiFetchMarketSnapshot } from "../../ai/ai-service.js?v=4.9.0";
import { aiBuildContext, aiHashContext } from "../../ai/context.js?v=4.9.0";
import { pointToEmotions } from "../journal/journal-ui.js?v=4.9.0";

let storageGet = null;
let storageSet = null;

export function configureDashboardData(deps = {}) {
  storageGet = typeof deps.storageGet === "function" ? deps.storageGet : null;
  storageSet = typeof deps.storageSet === "function" ? deps.storageSet : null;
}

const BTC_DOMINANCE = 54.6;
const FEAR_GREED = { score: 44, label: "Нейтрально" };
const outcomeColor = (o) => o === "Win" ? WIN : o === "Loss" ? LOSS : FLAT;
const isToday = (isoDate) => !!isoDate && new Date(isoDate).toDateString() === new Date().toDateString();
const pluralRu = (n, one, few, many) => {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
};

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
      if (start === undefined) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else prevRef.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return display;
}

function calculateCalendarStats(dayEntries, closedDayEntries, measureMode = "R", currency = "USD") {
  if (!dayEntries.length) return null;
  const closed = closedDayEntries || dayEntries.filter(isEntryClosed);
  const resultClosed = resultEntriesForUnit(closed, measureMode, currency);
  const wins = closed.filter((e) => e.outcome === "Win").length;
  const losses = closed.filter((e) => e.outcome === "Loss").length;
  const breakevens = closed.filter((e) => e.outcome === "Breakeven").length;
  const avgR = resultClosed.length ? resultClosed.reduce((s, e) => s + e.r, 0) / resultClosed.length : null;
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
    mood = avgX >= 50 && avgY >= 50 ? "Уверенно и спокойно" : avgX >= 50 && avgY < 50 ? "Уверенно, но на взводе" : avgX < 50 && avgY >= 50 ? "Спокойно, но неуверенно" : "Страшно и на нервах";
    moodColor = avgX >= 50 && avgY >= 50 ? WIN : avgX < 50 && avgY < 50 ? LOSS : BASE.inkDim;
  }
  return { wins, losses, breakevens, avgR, topInstrument, topTag, mood, moodColor };
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
  return /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2.5", children: week.map((d, i) => /* @__PURE__ */ jsx(
    "span",
    {
      className: "w-2 h-2 rounded-full transition-all duration-300",
      style: { background: d.filled ? accent : "transparent", border: `1px solid ${d.filled ? accent : BASE.line}` },
      "aria-label": d.label
    },
    i
  )) });
}
// V0.8 — раньше это была голая ломаная в 1.6px с острыми углами: при двух-трёх сделках она
// выглядела как случайная «галочка» в углу карточки. Теперь линия сглажена (кубическая кривая
// по средним точкам — без библиотек), под ней мягкая заливка тем же цветом, а последнее
// значение отмечено точкой, чтобы читалось направление.
function Sparkline({ points, color, width = 84, height = 30 }) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const padY = 4;
  const stepX = width / (points.length - 1);
  const xy = points.map((v, i) => [i * stepX, height - padY - (v - min) / range * (height - padY * 2)]);
  let line = `M ${xy[0][0].toFixed(1)} ${xy[0][1].toFixed(1)}`;
  for (let i = 1; i < xy.length; i++) {
    const [px, py] = xy[i - 1];
    const [cx, cy] = xy[i];
    const mx = (px + cx) / 2;
    line += ` C ${mx.toFixed(1)} ${py.toFixed(1)}, ${mx.toFixed(1)} ${cy.toFixed(1)}, ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  const gradId = `spark-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  const last = xy[xy.length - 1];
  return /* @__PURE__ */ jsxs("svg", { width, height, viewBox: `0 0 ${width} ${height}`, style: { overflow: "visible" }, children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: gradId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: color, stopOpacity: "0.22" }),
      /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: color, stopOpacity: "0" })
    ] }) }),
    /* @__PURE__ */ jsx("path", { d: area, fill: `url(#${gradId})`, stroke: "none" }),
    /* @__PURE__ */ jsx("path", { d: line, fill: "none", stroke: color, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", opacity: "0.9" }),
    /* @__PURE__ */ jsx("circle", { cx: last[0], cy: last[1], r: "2", fill: color })
  ] });
}
var HOME_ADVICE_KEY = "home-advice";
// Кэш приватный (shared=false \u2192 users/{uid}/data/home-advice), поэтому совет одного пользователя
// физически не может показаться другому. Ключ инвалидации \u2014 хэш того же контекста, который
// уходит в модель: пока статистика, состояние и стратегия не менялись, запрос не уходит вообще.
async function getHomeAdvice(context, contextHash, force) {
  if (!context) return null;
  if (!force) {
    try {
      const res = await caWithTimeout(storageGet(HOME_ADVICE_KEY, false), 1e4, "home_advice_cache_timeout");
      const cached = res?.value ? JSON.parse(res.value) : null;
      if (cached && cached.hash === contextHash && cached.text) return cached.text;
    } catch (_) {
    }
  }
  const text = await caWithTimeout(aiGenerateHomeAdvice(context), 2e4, "home_advice_timeout");
  if (!text) return null;
  storageSet(HOME_ADVICE_KEY, JSON.stringify({ hash: contextHash, text }), false).catch(() => {
  });
  return text;
}
function marketHourBucket() {
  return Math.floor(Date.now() / 36e5);
}
function marketSnapshotKey(assetClass) {
  return `market-snapshot:${assetClass}`;
}
async function loadCachedMarketSnapshot(assetClass) {
  try {
    const res = await storageGet(marketSnapshotKey(assetClass), true);
    return res?.value ? JSON.parse(res.value) : null;
  } catch {
    return null;
  }
}
async function saveCachedMarketSnapshot(assetClass, snapshot) {
  try {
    await storageSet(marketSnapshotKey(assetClass), JSON.stringify(snapshot), true);
  } catch {
  }
}
// In-memory guard: the shared Firestore cache is the primary hourly cache, but if writing it ever
// fails (rules, offline) the hour bucket check would miss on every mount and fire a fresh grounded
// Gemini call each time the Home tab renders. This keeps at most one call per asset per hour per
// session regardless of whether the shared write succeeded.
var __marketMemCache = {};
async function getMarketSnapshot(assetClass, lang) {
  if (!assetClass) return null;
  const bucket = marketHourBucket();
  const mem = __marketMemCache[assetClass];
  if (mem && mem.hourBucket === bucket) return mem;
  const cached = await loadCachedMarketSnapshot(assetClass);
  if (cached && cached.hourBucket === bucket) {
    __marketMemCache[assetClass] = cached;
    return cached;
  }
  try {
    const fresh = await aiFetchMarketSnapshot(assetClass, lang);
    const withBucket = { ...fresh, hourBucket: bucket };
    __marketMemCache[assetClass] = withBucket;
    saveCachedMarketSnapshot(assetClass, withBucket);
    return withBucket;
  } catch {
    return cached || null;
  }
}

function Home({ entries, goTo, accent, name, measureMode, currency, startingCapital, lastCalibration, analytics, t, lang, tradingAsset, notify, strategyNote }) {
  const total = entries.length;
  const [patternOpen, setPatternOpen] = useState(false);
  const [marketSnapshot, setMarketSnapshot] = useState(null);
  const [marketRefreshing, setMarketRefreshing] = useState(false);
  useEffect(() => {
    if (!tradingAsset) {
      setMarketSnapshot(null);
      return;
    }
    let cancelled = false;
    getMarketSnapshot(tradingAsset, lang).then((snap) => {
      if (!cancelled && snap) setMarketSnapshot(snap);
    }).catch((err) => {
      console.error("mind.exe market snapshot (auto) failed:", err);
    });
    return () => {
      cancelled = true;
    };
  }, [tradingAsset, lang]);
  // V0.4 — совет по собственному журналу вместо пересказа рынка. Контекст тот же, что у Coach
  // (aiBuildContext), плюс стратегия из настроек. Запрос уходит только когда меняется хэш
  // контекста — не на каждый рендер Home.
  const [homeAdvice, setHomeAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const adviceContext = useMemo(() => aiBuildContext(entries, analytics, lang, strategyNote), [entries, analytics, lang, strategyNote]);
  const adviceHash = useMemo(() => aiHashContext(adviceContext), [adviceContext]);
  useEffect(() => {
    if (entries.length === 0) {
      setHomeAdvice(null);
      return;
    }
    let cancelled = false;
    setAdviceLoading(true);
    getHomeAdvice(adviceContext, adviceHash, false).then((text) => {
      if (!cancelled && text) setHomeAdvice(text);
    }).catch((err) => {
      console.error("mind.exe home advice failed:", err);
    }).finally(() => {
      if (!cancelled) setAdviceLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // adviceContext/entries читаются внутри; перезапуск строго по изменению хэша контекста.
  }, [adviceHash]);
  // V0.4 — кнопка обновления в шапке карточки: принудительно перегенерировать совет (мимо кэша)
  // и заодно освежить рыночные метрики внизу экрана, если актив выбран.
  const refreshInsight = async () => {
    if (marketRefreshing || adviceLoading) return;
    if (entries.length > 0) {
      setAdviceLoading(true);
      try {
        const text = await getHomeAdvice(adviceContext, adviceHash, true);
        if (text) setHomeAdvice(text);
      } catch (err) {
        console.error("mind.exe home advice (manual) failed:", err);
        notify?.(t.coach.error);
      } finally {
        setAdviceLoading(false);
      }
    }
    if (tradingAsset) refreshMarketSnapshot();
  };
  const refreshMarketSnapshot = async () => {
    if (marketRefreshing) return;
    if (!tradingAsset) {
      notify?.("\u0412\u044B\u0431\u0435\u0440\u0438 \u0442\u043E\u0440\u0433\u043E\u0432\u044B\u0439 \u0430\u043A\u0442\u0438\u0432 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u2014 \u0431\u0435\u0437 \u043D\u0435\u0433\u043E \u0440\u044B\u043D\u043E\u0447\u043D\u044B\u0439 \u0438\u043D\u0441\u0430\u0439\u0442 \u043D\u0435 \u0441\u0442\u0440\u043E\u0438\u0442\u0441\u044F");
      return;
    }
    setMarketRefreshing(true);
    try {
      const fresh = await aiFetchMarketSnapshot(tradingAsset, lang);
      const withBucket = { ...fresh, hourBucket: marketHourBucket() };
      __marketMemCache[tradingAsset] = withBucket;
      saveCachedMarketSnapshot(tradingAsset, withBucket);
      setMarketSnapshot(withBucket);
    } catch (err) {
      console.error("mind.exe market snapshot (manual) failed:", err);
      notify?.(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0441\u0430\u0439\u0442\u0430: ${err?.message || err}`);
    } finally {
      setMarketRefreshing(false);
    }
  };
  const closedEntries = useMemo(() => entries.filter(isEntryClosed), [entries]);
  const traderPatterns = useMemo(() => analyzeTraderPatterns(closedEntries, lang), [closedEntries, lang]);
  const calibratedToday = lastCalibration && isToday(lastCalibration.date);
  const consciousScoreTarget = analytics.awareness.score.value ?? 0;
  const reflectionScore = analytics.reflection.score.value;
  const disciplineScore = analytics.discipline.score.value;
  const riskStabilityScore = analytics.risk.stability.value;
  const level = calculateTraderLevel(entries, analytics);
  const { streak, week } = useStreak(entries, lang);
  // V5.4: the local fallback used to derive a mood from consciousScoreTarget unconditionally.
  // Awareness now legitimately starts at 0 for a new account, which made that expression print
  // "Reactive" to someone who had not made a single trade yet — a psychological label invented
  // out of no data. The fallback is only used once awareness actually rests on some history.
  const awarenessKnown = analytics.awareness.score.value != null && (analytics.awareness.evidence ?? 0) >= 6;
  const moodKey = marketSnapshot?.moodLabel || (!awarenessKnown ? t.home.moodStable : consciousScoreTarget > 80 ? t.home.moodCalm : consciousScoreTarget > 60 ? t.home.moodStable : t.home.moodReactive);
  // V1.0 — данные для рыночной карточки внизу главной. Источник тот же, что и был:
  // marketSnapshot от Gemini с фолбэком на константы BTC_DOMINANCE / FEAR_GREED.
  const showBtcD = !tradingAsset || tradingAsset === "crypto";
  const btcDValue = marketSnapshot?.btcDominance ?? BTC_DOMINANCE;
  const fngValue = marketSnapshot?.sentimentScore ?? FEAR_GREED.score;
  const fngLabel = marketSnapshot?.sentimentLabel || FEAR_GREED.label;
  const marketCells = [
    showBtcD && { key: "btcd", label: "BTC.D", value: `${btcDValue}%`, mono: true, icon: Bitcoin, bar: Number(btcDValue) || 0 },
    { key: "fng", label: "F&G", value: `${fngValue}`, mono: true, icon: Gauge, pill: fngLabel },
    { key: "mood", label: t.home.market, value: moodKey, mono: false, icon: Activity }
  ].filter(Boolean);
  // Prefer a fact-based insight computed from this user's own journal (analytics.insights are
  // always backed by a real sample) over the two hardcoded generic sentences.
  const localInsight = (analytics.insights || []).find((i) => i && i.text)?.text || null;
  const withR = resultEntriesForUnit(entries, measureMode, currency);
  const excludedResultCount = countExcludedResultEntries(entries, measureMode, currency);
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
    { id: "patterns", label: t.home.patternsTile, icon: LineChartIcon }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-7", children: [
      /* @__PURE__ */ jsx("span", { className: "sec-cap text-[10px] block mb-3", style: { color: BASE.inkFaint }, children: measureMode === "currency" ? t.home.capital : t.home.totalResult }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[38px] leading-none mb-2", style: { fontFamily: "var(--font-mono)", color: BASE.ink, fontWeight: 500, letterSpacing: "-0.02em" }, children: measureMode === "currency" ? formatBalance(animatedHero, currency) : formatResult(animatedHero, "R", currency) }),
          measureMode === "currency" && /* @__PURE__ */ jsxs("span", { className: "text-[13px]", style: { color: cumResult >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: [
            formatResult(cumResult, "currency", currency),
            " ",
            t.home.sinceStart
          ] })
        ] }),
        sparkPoints.length >= 2 && /* @__PURE__ */ jsx("div", { className: "shrink-0 pb-1", children: /* @__PURE__ */ jsx(Sparkline, { points: sparkPoints, color: cumResult >= 0 ? WIN : LOSS, width: 96, height: 34 }) })
      ] }),
      excludedResultCount > 0 && /* @__PURE__ */ jsx("div", {
        className: "text-[10px] mt-2",
        style: { color: BASE.inkFaint },
        children: lang === "en"
          ? `${excludedResultCount} result${excludedResultCount === 1 ? "" : "s"} in another unit are not included`
          : `${excludedResultCount} ${pluralRu(excludedResultCount, "результат в другой единице не учитывается", "результата в другой единице не учитываются", "результатов в другой единице не учитываются")}`
      })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:columns-2 lg:gap-4", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => goTo("calibration"),
        className: "w-full flex items-center justify-between px-4 py-3.5 rounded-[22px] mb-3 text-left transition-all duration-200 active:scale-[0.98] break-inside-avoid",
        style: { border: "none", background: calibratedToday ? BASE.surface : BASE.surface2 },
        children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: [
            /* @__PURE__ */ jsx(Gauge, { size: 15, style: { color: calibratedToday ? lastCalibration.tierColor : accent } }),
            calibratedToday ? t.home.calibrationToday(lastCalibration.pct) : t.home.calibrationCta
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { size: 15, style: { color: BASE.inkFaint } })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Card, { accent, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[11px]", style: { color: BASE.inkDim, fontFamily: "var(--font-display)" }, children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 12, style: { color: accent } }),
          " ",
          t.home.insight
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* V5.1: the manual refresh control was rendered only when a trading asset had been picked
             in Settings, so for anyone who never set one it simply wasn't there \u2014 which reads as
             \"\u0440\u0443\u0447\u043D\u043E\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u043F\u0430\u043B\u043E\". It is always visible now, with a real 28px tap target, and
             explains itself instead of doing nothing when no asset is selected. */
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: refreshInsight,
              disabled: marketRefreshing || adviceLoading,
              title: t.home.marketRefresh,
              "aria-label": t.home.marketRefresh,
              className: "flex items-center justify-center w-7 h-7 -m-1 rounded-full transition-all active:scale-90",
              style: { color: accent, opacity: marketRefreshing || adviceLoading ? 0.45 : 0.85 },
              children: /* @__PURE__ */ jsx(RotateCcw, { size: 13, className: marketRefreshing || adviceLoading ? "animate-spin" : void 0 })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full animate-pulse", style: { background: accent } })
        ] })
      ] }),
      /* V0.4 — текст карточки: совет по собственному журналу. Пока Gemini отвечает (или если он
         недоступен) показывается локальный инсайт из аналитики — он всегда посчитан по реальным
         данным, поэтому подмены фактов не происходит. */
      /* V2.1 — скелетон показывается ТОЛЬКО когда показать действительно нечего: нет ни
         ответа Gemini, ни локального инсайта, ни записей. Если локальный инсайт есть, он
         выводится сразу — он посчитан по реальным данным, и подменять его серыми полосами
         значило бы прятать готовую информацию ради анимации. */
      adviceLoading && !homeAdvice && !localInsight && total === 0 ? /* @__PURE__ */ jsx("div", { className: "py-1", children: /* @__PURE__ */ jsx(SkeletonLines, { lines: 3 }) }) : /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed content-in", style: { color: BASE.ink }, children: homeAdvice || localInsight || (total >= 4 ? t.home.insightConfident : t.home.insightFocus) }, homeAdvice ? "ai" : "local")
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 divide-x", style: { borderColor: BASE.line }, children: [
        /* @__PURE__ */ jsxs("div", { className: "pr-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1", style: { color: BASE.inkFaint }, children: t.home.traderLevel }),
          /* @__PURE__ */ jsx("div", { className: "text-[24px] leading-none", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 500 }, children: level })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pl-4", style: { borderLeft: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1", style: { color: BASE.inkFaint }, children: t.home.awareness }),
          /* @__PURE__ */ jsxs("div", { className: "text-[24px] leading-none", style: { fontFamily: "var(--font-display)", color: accent, fontWeight: 500 }, children: [
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
      /* @__PURE__ */ jsx("p", { className: "text-base mb-1.5", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 600 }, children: traderPatterns.primaryPattern.title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
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
      /* @__PURE__ */ jsx("button", { onClick: () => setPatternOpen(true), className: "text-sm transition-transform duration-150 active:scale-95", style: { color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }, children: t.pattern.breakdown })
    ] }) : traderPatterns.healthyPatterns.length > 0 ? /* @__PURE__ */ jsxs(Card, { accent, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: t.pattern.yourPattern }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] px-2 py-0.5 rounded-full", style: { color: WIN, border: `1px solid ${WIN}40` }, children: t.pattern.strength })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-base mb-1.5", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 600 }, children: traderPatterns.healthyPatterns[0].title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
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
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { fontFamily: "var(--font-display)" }, children: [
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
    /* V1.5 — три колонки в ряд не помещались на телефоне: «Волатильный» ломался посреди
       слова, а пилюля с настроением уезжала в две строки. Значения тут разной природы —
       число, число с текстовой меткой и просто слово — и равные узкие колонки для них не
       подходят. Теперь это список строк: слева иконка и подпись, справа значение, которому
       больше не приходится втискиваться в треть ширины. Данные и их источник прежние. */
    /* @__PURE__ */ jsx("div", { className: "pt-3.5", children: /* @__PURE__ */ jsx("div", { className: "rounded-2xl px-4 py-1", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: marketCells.map((m, i) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "py-3",
        style: i === 0 ? void 0 : { borderTop: `1px solid ${BASE.line}` },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 shrink-0", children: [
              /* @__PURE__ */ jsx("span", { className: "shrink-0 flex items-center justify-center rounded-full", style: { width: 26, height: 26, border: `1px solid ${BASE.line}`, background: BASE.surface2 }, children: /* @__PURE__ */ jsx(m.icon, { size: 13, style: { color: BASE.inkDim } }) }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.12em]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: m.label })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "min-w-0 text-right", children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[17px] leading-tight", style: { color: BASE.ink, fontFamily: m.mono ? "var(--font-mono)" : "var(--font-display)", fontWeight: 600 }, children: m.value }),
              m.pill && /* @__PURE__ */ jsx("span", { className: "block text-[11px] leading-snug mt-0.5", style: { color: BASE.inkDim }, children: m.pill })
            ] })
          ] }),
          m.bar !== void 0 && /* @__PURE__ */ jsx("div", { className: "w-full h-[3px] rounded-full mt-2.5", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-[3px] rounded-full transition-all duration-700 ease-out", style: { width: `${Math.max(0, Math.min(100, m.bar))}%`, background: accent } }) })
        ]
      },
      m.key
    )) }) })
  ] });
}
function TraderPatternDetail({ pattern, accent, currency, onClose, t, lang }) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center", onClick: onClose, style: { background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: (e) => e.stopPropagation(),
      className: "w-full max-w-md rounded-t-[28px] px-5 pt-4 pb-8 vscroll",
      style: { background: BASE.surface, border: `1px solid ${BASE.line}`, borderBottom: "none", maxHeight: "88vh", overflowY: "auto", animation: "riseIn 0.28s ease-out" },
      children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4", style: { width: 36, height: 4, borderRadius: 2, background: BASE.line } }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: t.pattern.detailTitle }),
          /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1 -m-1", children: /* @__PURE__ */ jsx(XIcon, { size: 16, style: { color: BASE.inkFaint } }) })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 600 }, children: pattern.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-4", style: { color: BASE.inkDim }, children: pattern.description }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.pattern.tradesLabel }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: pattern.stats.trades })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.pattern.winRateLabel }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: [
              pattern.stats.winRate,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.pattern.avgRLabel }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: (pattern.stats.avgR ?? 0) >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: formatResult(pattern.stats.avgR ?? 0, "R", currency) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.pattern.comparison }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink }, children: t.pattern.similarSituations }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: (pattern.stats.avgR ?? 0) >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: formatResult(pattern.stats.avgR ?? 0, "R", currency) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.inkFaint }, children: t.pattern.otherTrades }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: (pattern.comparisonStats.avgR ?? 0) >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: formatResult(pattern.comparisonStats.avgR ?? 0, "R", currency) })
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
          /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, className: "text-xs shrink-0", children: tr.date.toLocaleDateString(lang === "en" ? "en-US" : "ru-RU", { day: "2-digit", month: "2-digit" }) }),
          /* @__PURE__ */ jsx("span", { style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, className: "shrink-0", children: tr.instrument }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs shrink-0", style: { color: BASE.inkFaint }, children: [
            "x",
            Math.round(tr.x),
            " y",
            Math.round(tr.y)
          ] }),
          hasRealizedRR(tr) && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0", style: { color: outcomeColor(tr.outcome), fontFamily: "var(--font-mono)" }, children: formatResult(tr.realizedRR, "R", currency) })
        ] }, tr.id)) }),
        /* @__PURE__ */ jsxs(Card, { className: "mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.pattern.whyShown }),
          /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: t.pattern.whyShownText(pattern.evidenceCount, formatResult(pattern.stats.avgR ?? 0, "R", currency), formatResult(pattern.comparisonStats.avgR ?? 0, "R", currency)) })
        ] })
      ]
    }
  ) });
}
// V1.4 — блок «Эмоции» в аналитике. Раньше там был скаттер: каждая сделка точкой в
// координатах страх→уверенность / нервы→спокойствие. Читать его было нечем — точки не
// подписаны, никакого вывода из облака не следует, а после перехода на процентные шкалы
// оси вообще стали производной величиной. Вместо него считается прямое сравнение: при
// какой эмоции результат в среднем лучше, а при какой хуже.
//
// Порог 60/40 — намеренно с зазором: сделки, где эмоция отмечена в середине, не попадают
// ни в одну группу, иначе сравнение размывается пограничными случаями.
var EMOTION_IMPACT_HIGH = 60;
var EMOTION_IMPACT_LOW = 40;
var EMOTION_IMPACT_MIN = 3;
function ei_avg(rows) {
  return rows.length ? rows.reduce((sum, x) => sum + x.r, 0) / rows.length : null;
}
// labels передаются явно, а не берутся из t: этой же статистикой пользуется «Разбор»,
// который знает только lang и не имеет доступа к объекту переводов экрана записи.
function emotionImpactStats(entries, labelList) {
  const keys = emotionScaleKeys("entry");
  const labels = Array.isArray(labelList) && labelList.length === keys.length ? labelList : keys;
  // У записей до V1.1 процентов нет — для них проценты восстанавливаются из осей, иначе
  // блок был бы пустым у всех, кто вёл журнал раньше. Восстановление приблизительное
  // (см. pointToEmotions), поэтому доля таких сделок показывается отдельно.
  const rows = (entries || []).filter((e) => typeof e.r === "number" && !isNaN(e.r)).map((e) => {
    const exact = normalizeEmotions(e.emotions, "entry");
    return { r: e.r, v: exact || pointToEmotions(e.x, e.y, "entry"), exact: !!exact };
  }).filter((x) => x.v);
  if (rows.length < EMOTION_IMPACT_MIN * 2) {
    return { available: false, reason: "few_trades", sample: rows.length, needed: EMOTION_IMPACT_MIN * 2 };
  }
  // V1.8 — allScales считается ДО фильтра по размеру групп. Раньше отфильтрованные шкалы
  // просто исчезали, и блок показывал сообщение про нехватку сделок даже когда сделок
  // хватало: причина была другой — ни в одной шкале не набиралось по 3 сделки в обеих
  // группах сразу. Теперь эти числа доступны UI, и он может объяснить, чего не хватает.
  const allScales = keys.map((key, i) => {
    const high = rows.filter((x) => emotionClampPct(x.v[key]) >= EMOTION_IMPACT_HIGH);
    const low = rows.filter((x) => emotionClampPct(x.v[key]) <= EMOTION_IMPACT_LOW);
    return { key, label: labels[i], highN: high.length, lowN: low.length, highAvg: ei_avg(high), lowAvg: ei_avg(low) };
  });
  const scales = allScales.filter((s2) => s2.highN >= EMOTION_IMPACT_MIN && s2.lowN >= EMOTION_IMPACT_MIN).map((s2) => ({ ...s2, diff: s2.highAvg - s2.lowAvg })).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  const withConflict = rows.map((x) => ({ ...x, c: emotionConflict(x.v, "entry").max }));
  const mixed = withConflict.filter((x) => x.c >= 40);
  const clear = withConflict.filter((x) => x.c < 40);
  const conflict = mixed.length >= EMOTION_IMPACT_MIN && clear.length >= EMOTION_IMPACT_MIN ? { mixedN: mixed.length, clearN: clear.length, mixedAvg: ei_avg(mixed), clearAvg: ei_avg(clear) } : null;
  const available = scales.length > 0 || !!conflict;
  return {
    available,
    reason: available ? null : "no_groups",
    sample: rows.length,
    approxCount: rows.filter((x) => !x.exact).length,
    allScales,
    scales,
    conflict
  };
}
// Одна строка сравнения: подпись, число сделок и средний результат столбиком в обе
// стороны от общей базовой линии. Ширина считается от максимума по всему блоку, чтобы
// строки были сопоставимы между собой, а не каждая в своём масштабе.
function EmotionImpactRow({ label, count, avg, scale, measureMode, currency }) {
  const pct = scale > 0 ? Math.min(100, Math.abs(avg) / scale * 100) : 0;
  const positive = avg >= 0;
  const color = positive ? WIN : LOSS;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 py-1", children: [
    /* @__PURE__ */ jsx("span", { className: "text-[11px] shrink-0 text-right", style: { color: BASE.inkDim, width: 62 }, children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex-1 h-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 bottom-0 w-px left-1/2", style: { background: BASE.line } }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute top-1/2 -translate-y-1/2 h-2 rounded-full",
          style: { width: `${pct / 2}%`, background: color, opacity: 0.85, left: positive ? "50%" : void 0, right: positive ? void 0 : "50%" }
        }
      )
    ] }),
    /* @__PURE__ */ jsx("span", { className: "text-[11px] shrink-0 text-right", style: { color, fontFamily: "var(--font-mono)", width: 54 }, children: formatResult(avg, measureMode, currency) }),
    /* @__PURE__ */ jsxs("span", { className: "text-[10px] shrink-0 text-right", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)", width: 26 }, children: [
      "\u00D7",
      count
    ] })
  ] });
}
function EmotionImpact({ stats, measureMode, currency }) {
  if (!stats.available) {
    // V1.8 — два РАЗНЫХ случая, которые раньше показывали один и тот же текст. Отсюда и
    // брался абсурд «нужно минимум 6, сейчас 6»: сделок хватало, не хватало разброса.
    if (stats.reason === "few_trades") {
      return /* @__PURE__ */ jsxs("p", { className: "text-sm leading-relaxed", style: { color: BASE.inkFaint }, children: [
        "\u041D\u0443\u0436\u043D\u043E \u043C\u0438\u043D\u0438\u043C\u0443\u043C ",
        stats.needed || EMOTION_IMPACT_MIN * 2,
        " \u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u0441 \u043E\u0442\u043C\u0435\u0447\u0435\u043D\u043D\u044B\u043C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435\u043C. \u0421\u0435\u0439\u0447\u0430\u0441 ",
        stats.sample || 0,
        "."
      ] });
    }
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("p", { className: "text-[13px] leading-relaxed mb-3", style: { color: BASE.inkDim }, children: [
        "\u0421\u0434\u0435\u043B\u043E\u043A \u0445\u0432\u0430\u0442\u0430\u0435\u0442 (",
        stats.sample,
        "), \u043D\u043E \u0441\u0440\u0430\u0432\u043D\u0438\u0432\u0430\u0442\u044C \u043F\u043E\u043A\u0430 \u043D\u0435 \u0441 \u0447\u0435\u043C: \u043D\u0438 \u043F\u043E \u043E\u0434\u043D\u043E\u0439 \u0448\u043A\u0430\u043B\u0435 \u043D\u0435 \u043D\u0430\u0431\u0440\u0430\u043B\u043E\u0441\u044C \u043F\u043E ",
        EMOTION_IMPACT_MIN,
        " \u0441\u0434\u0435\u043B\u043A\u0438 \u0441 \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u0438 \u0441 \u043D\u0438\u0437\u043A\u043E\u0439 \u044D\u043C\u043E\u0446\u0438\u0435\u0439 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E."
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5 mb-3", children: (stats.allScales || []).map((sc) => /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[12px] truncate", style: { color: BASE.inkDim }, children: sc.label }),
        /* @__PURE__ */ jsxs("span", { className: "text-[11px] shrink-0", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
          `\u043E\u0442 ${EMOTION_IMPACT_HIGH}%: `,
          sc.highN,
          `  \u00B7  \u0434\u043E ${EMOTION_IMPACT_LOW}%: `,
          sc.lowN
        ] })
      ] }, sc.key)) }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] leading-relaxed", style: { color: BASE.inkFaint }, children: "\u0421\u0435\u0440\u0435\u0434\u0438\u043D\u0430 \u0448\u043A\u0430\u043B\u044B (41\u201359%) \u043D\u0430\u043C\u0435\u0440\u0435\u043D\u043D\u043E \u043D\u0435 \u043F\u043E\u043F\u0430\u0434\u0430\u0435\u0442 \u043D\u0438 \u0432 \u043E\u0434\u043D\u0443 \u0433\u0440\u0443\u043F\u043F\u0443 \u2014 \u0438\u043D\u0430\u0447\u0435 \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435 \u0440\u0430\u0437\u043C\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u043E\u0433\u0440\u0430\u043D\u0438\u0447\u043D\u044B\u043C\u0438 \u0441\u043B\u0443\u0447\u0430\u044F\u043C\u0438. \u0411\u043B\u043E\u043A \u0437\u0430\u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442, \u043A\u043E\u0433\u0434\u0430 \u043D\u0430\u043A\u043E\u043F\u044F\u0442\u0441\u044F \u0441\u0434\u0435\u043B\u043A\u0438 \u0441 \u0440\u0430\u0437\u043D\u044B\u043C\u0438 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F\u043C\u0438." })
    ] });
  }
  const all = [];
  stats.scales.forEach((s) => all.push(s.highAvg, s.lowAvg));
  if (stats.conflict) all.push(stats.conflict.mixedAvg, stats.conflict.clearAvg);
  const scale = Math.max(0.01, ...all.map((v) => Math.abs(v || 0)));
  return /* @__PURE__ */ jsxs("div", { children: [
    stats.scales.map((s) => /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[13px]", style: { color: BASE.ink }, children: s.label }),
        /* @__PURE__ */ jsxs("span", { className: "text-[11px]", style: { color: s.diff >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: [
          s.diff >= 0 ? "+" : "\u2212",
          Math.abs(s.diff).toFixed(2),
          "R \u0440\u0430\u0437\u043D\u0438\u0446\u0430"
        ] })
      ] }),
      /* @__PURE__ */ jsx(EmotionImpactRow, { label: `\u043E\u0442 ${EMOTION_IMPACT_HIGH}%`, count: s.highN, avg: s.highAvg, scale, measureMode, currency }),
      /* @__PURE__ */ jsx(EmotionImpactRow, { label: `\u0434\u043E ${EMOTION_IMPACT_LOW}%`, count: s.lowN, avg: s.lowAvg, scale, measureMode, currency })
    ] }, s.key)),
    stats.conflict && /* @__PURE__ */ jsxs("div", { className: "pt-3", style: { borderTop: `1px solid ${BASE.line}` }, children: [
      /* @__PURE__ */ jsx("span", { className: "text-[13px] block mb-1", style: { color: BASE.ink }, children: "\u0421\u043C\u0435\u0448\u0430\u043D\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435" }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] mb-1.5 leading-relaxed", style: { color: BASE.inkFaint }, children: "\u0421\u0434\u0435\u043B\u043A\u0438, \u0433\u0434\u0435 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u043F\u043E\u043B\u043E\u0436\u043D\u044B\u0435 \u044D\u043C\u043E\u0446\u0438\u0438 \u043E\u0442\u043C\u0435\u0447\u0435\u043D\u044B \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u2014 \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0432\u043C\u0435\u0441\u0442\u0435 \u0441\u043E \u0441\u0442\u0440\u0430\u0445\u043E\u043C." }),
      /* @__PURE__ */ jsx(EmotionImpactRow, { label: "\u0441\u043C\u0435\u0448\u0430\u043D\u043D\u043E", count: stats.conflict.mixedN, avg: stats.conflict.mixedAvg, scale, measureMode, currency }),
      /* @__PURE__ */ jsx(EmotionImpactRow, { label: "\u043E\u0434\u043D\u043E\u0437\u043D\u0430\u0447\u043D\u043E", count: stats.conflict.clearN, avg: stats.conflict.clearAvg, scale, measureMode, currency })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-[11px] mt-3 leading-relaxed", style: { color: BASE.inkFaint }, children: [
      "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043F\u043E ",
      stats.sample,
      " \u0441\u0434\u0435\u043B\u043A\u0430\u043C. \u0413\u0440\u0443\u043F\u043F\u044B \u043F\u0435\u0440\u0435\u0441\u0435\u043A\u0430\u044E\u0442\u0441\u044F: \u043E\u0434\u043D\u0430 \u0441\u0434\u0435\u043B\u043A\u0430 \u043F\u043E\u043F\u0430\u0434\u0430\u0435\u0442 \u0432 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0448\u043A\u0430\u043B \u0441\u0440\u0430\u0437\u0443.",
      stats.approxCount > 0 ? ` \u0423 ${stats.approxCount} \u0441\u0434\u0435\u043B\u043E\u043A \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E \u0438\u0437 \u0441\u0442\u0430\u0440\u043E\u0433\u043E \u0444\u043E\u0440\u043C\u0430\u0442\u0430 \u043F\u0440\u0438\u0431\u043B\u0438\u0437\u0438\u0442\u0435\u043B\u044C\u043D\u043E.` : ""
    ] })
  ] });
}
// V2.0 — дизайн-проход, этап 2: пустые состояния. До этого их не существовало как
// сущности: там, где данных нет, стояла одинокая серая строка или вообще ничего. Это
// первое, что видит новый пользователь, и именно оно создаёт впечатление незаконченности.
//
// Компонент даёт всем таким местам одну форму: иконка в круге, короткий заголовок, одно
// поясняющее предложение и — там, где действие очевидно — кнопка. Тексты передаются
// вызывающим, компонент ничего не придумывает сам.
// V2.1 — дизайн-проход, этап 3: скелетоны. Пока данные едут, экран был пустым и потом
// резко наполнялся. Скелетон повторяет ФОРМУ будущего содержимого, а не абстрактный
// прямоугольник, — иначе он не снимает ощущение пустоты, а добавляет мельтешения.
function TagBars({ data, measureMode, currency }) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.totalR != null ? d.totalR : d.avgR)), 0.1);
  return /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: data.map((d) => {
    const result = d.totalR != null ? d.totalR : d.avgR;
    const positive = result >= 0;
    const width = Math.max(6, Math.abs(result) / maxAbs * 100);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "rounded-[18px] px-3.5 py-3",
        style: { background: BASE.surface2, border: `1px solid ${BASE.line}` },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[15px] truncate", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: d.tag }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] mt-1", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: `${d.count} ${pluralRu(d.count, "сделка", "сделки", "сделок")}` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "shrink-0 text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[15px] leading-none", style: { color: positive ? WIN : LOSS, fontFamily: "var(--font-mono)", fontWeight: 500 }, children: formatResult(result, measureMode, currency) }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] mt-1", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
                "ср. ",
                formatResult(d.avgR, measureMode, currency),
                " / сделку"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full h-[6px] rounded-full overflow-hidden", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-[6px] rounded-full transition-all duration-500 ease-out", style: { width: `${width}%`, background: positive ? WIN : LOSS, boxShadow: `0 0 18px ${positive ? WIN : LOSS}33` } }) })
        ]
      },
      d.tag
    );
  }) });
}
function CalendarView({ entries, accent, measureMode, currency, t }) {
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
    const resultEntries = resultEntriesForUnit(dayEntries, measureMode, currency);
    if (!resultEntries.length) return BASE.inkDim;
    const netR = resultEntries.reduce((s, e) => s + e.r, 0);
    if (netR > 0) return WIN;
    if (netR < 0) return LOSS;
    return BASE.inkDim;
  };
  const selectedEntries = selectedDate ? entriesByDate[selectedDate.toDateString()] || [] : [];
  const selectedResultEntries = resultEntriesForUnit(selectedEntries, measureMode, currency);
  const selectedNet = selectedResultEntries.reduce((s, e) => s + e.r, 0);
  const daySummary = useMemo(
    () => calculateCalendarStats(selectedEntries, selectedEntries.filter(isEntryClosed), measureMode, currency),
    [selectedEntries, measureMode, currency]
  );
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
      /* @__PURE__ */ jsx("span", { className: "text-sm capitalize", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: monthLabel }),
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
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: selectedDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long" }) }),
        selectedEntries.length > 0 && /* @__PURE__ */ jsx("span", {
          className: "text-xs",
          style: { color: selectedResultEntries.length ? selectedNet >= 0 ? WIN : LOSS : BASE.inkFaint, fontFamily: "var(--font-mono)" },
          children: selectedResultEntries.length ? formatResult(selectedNet, measureMode, currency) : "\u2014"
        })
      ] }),
      selectedEntries.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: "\u0421\u0434\u0435\u043B\u043E\u043A \u0432 \u044D\u0442\u043E\u0442 \u0434\u0435\u043D\u044C \u043D\u0435 \u0431\u044B\u043B\u043E." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: "\u0421\u0434\u0435\u043B\u043E\u043A" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: selectedEntries.length })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.home.wlbe }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: [
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
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: daySummary.avgR >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: formatResult(daySummary.avgR, measureMode, currency) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 mb-3 text-xs", children: [
          daySummary.topInstrument && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442" }),
            /* @__PURE__ */ jsxs("span", { style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: [
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
            /* @__PURE__ */ jsx("span", { style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: e.instrument }),
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkDim }, children: DIRECTION_LABEL[e.direction] }),
            !isEntryClosed(e) && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0 text-[10px]", style: { color: BASE.inkFaint }, children: "\u041E\u0442\u043A\u0440\u044B\u0442\u0430" }),
            isEntryClosed(e) && e.r !== null && e.r !== void 0 && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0", style: { color: outcomeColor(e.outcome), fontFamily: "var(--font-mono)" }, children: formatStoredResult(e, measureMode, currency) })
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
  // V0.1 — equityCurve/tagStats ниже читают `withR`, но переменная нигде не объявлялась:
  // рендер вкладки "Аналитика" падал с ReferenceError и экран оставался чёрным.
  // Определение то же, что в Home: закрытые сделки с посчитанным r.
  const withR = useMemo(
    () => resultEntriesForUnit(closedEntries, measureMode, currency),
    [closedEntries, measureMode, currency]
  );
  const traderPatterns = useMemo(() => analyzeTraderPatterns(closedEntries, lang), [closedEntries, lang]);
  const insight = useMemo(() => {
    if (grouped.Win.length < 2 || grouped.Loss.length < 2) return t.pattern.needMoreEntries;
    if (analytics.insights.length) return analytics.insights[0].text;
    if (traderPatterns.available) return t.pattern.noPatternYetLong;
    return t.pattern.accumulating(traderPatterns.needed - traderPatterns.sampleSize);
  }, [grouped, traderPatterns, analytics, t]);
  const equityCurve = useMemo(() => {
    const sorted = [...withR].sort((a, b) => a.date - b.date);
    const grouped = [];
    sorted.forEach((e) => {
      const dayKey = e.date.toLocaleDateString("sv-SE");
      let bucket = grouped[grouped.length - 1];
      if (!bucket || bucket.dayKey !== dayKey) {
        bucket = {
          dayKey,
          dateLabel: e.date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
          dayResult: 0,
          tradeCount: 0,
          instruments: []
        };
        grouped.push(bucket);
      }
      bucket.dayResult += e.r;
      bucket.tradeCount += 1;
      if (e.instrument && !bucket.instruments.includes(e.instrument)) bucket.instruments.push(e.instrument);
    });
    let cum = 0;
    return grouped.map((d) => {
      cum += d.dayResult;
      return {
        ...d,
        cum,
        instrumentsLabel: d.instruments.slice(0, 2).join(", ") + (d.instruments.length > 2 ? " +" : "")
      };
    });
  }, [withR]);
  const tagStats = useMemo(() => {
    const stats = {};
    withR.forEach((e) => {
      stats[e.tag] = stats[e.tag] || { count: 0, sumR: 0, wins: 0, losses: 0, breakevens: 0 };
      stats[e.tag].count += 1;
      stats[e.tag].sumR += e.r;
      if (e.r > 0) stats[e.tag].wins += 1;
      else if (e.r < 0) stats[e.tag].losses += 1;
      else stats[e.tag].breakevens += 1;
    });
    return Object.entries(stats).map(([tag, s]) => ({
      tag,
      totalR: s.sumR,
      avgR: s.sumR / s.count,
      count: s.count,
      wins: s.wins,
      losses: s.losses,
      breakevens: s.breakevens
    })).sort((a, b) => b.totalR - a.totalR || b.avgR - a.avgR);
  }, [withR]);
  const emotionImpact = useMemo(() => emotionImpactStats(withR, t.newEntry.emotionGrid.scales), [withR, t]);
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
    const dayPositive = e.dayResult >= 0;
    return /* @__PURE__ */ jsxs("div", { className: "px-3 py-2.5 rounded-xl text-xs", style: { background: BASE.surface2, border: `1px solid ${BASE.line}`, color: BASE.ink }, children: [
      /* @__PURE__ */ jsxs("div", { style: { color: BASE.inkFaint }, children: [
        e.dateLabel,
        " \xB7 ",
        e.tradeCount,
        " ",
        pluralRu(e.tradeCount, "сделка", "сделки", "сделок")
      ] }),
      e.instrumentsLabel && /* @__PURE__ */ jsx("div", { className: "mt-0.5", style: { color: BASE.inkDim }, children: e.instrumentsLabel }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1.5", style: { fontFamily: "var(--font-mono)" }, children: [
        "Итого: ",
        formatResult(e.cum, measureMode, currency)
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-0.5", style: { color: dayPositive ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: [
        formatResult(e.dayResult, measureMode, currency),
        " за день"
      ] })
    ] });
  };
  // V1.4: ChartTooltip обслуживал только скаттер эмоций и после его замены не имел
  // вызовов — удалён, чтобы не тянуть за собой мёртвый код.
  if (reviewOpen) {
    return /* @__PURE__ */ jsx(JournalReview, { entries: closedEntries, accent, onClose: () => setReviewOpen(false), t, lang });
  }
  // V2.0 — вся аналитика построена на ЗАКРЫТЫХ сделках. Пока их нет, экран показывал
  // вкладки, нулевые метрики и пустые графики — выглядело как сломанное приложение,
  // хотя данных просто ещё не было. Теперь состояние названо прямо.
  if (closedEntries.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: LineChartIcon,
        title: entries.length === 0 ? "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430 \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043F\u0435\u0440\u0432\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A" : "\u041D\u0435\u0442 \u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A",
        hint: entries.length === 0 ? "\u0417\u0434\u0435\u0441\u044C \u0431\u0443\u0434\u0435\u0442 \u0432\u0438\u0434\u043D\u043E, \u043A\u0430\u043A \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043D\u0430 \u0432\u0445\u043E\u0434\u0435 \u0441\u0432\u044F\u0437\u0430\u043D\u043E \u0441 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u043C. \u0414\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u043D\u0443\u0436\u043D\u044B \u0437\u0430\u043F\u0438\u0441\u0438 \u0441 \u043E\u0442\u043C\u0435\u0447\u0435\u043D\u043D\u044B\u043C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435\u043C." : `\u0421\u0434\u0435\u043B\u043E\u043A \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435: ${entries.length}, \u043D\u043E \u043D\u0438 \u043E\u0434\u043D\u0430 \u0435\u0449\u0451 \u043D\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u0430. \u0420\u0430\u0441\u0447\u0451\u0442\u044B \u0441\u0447\u0438\u0442\u0430\u044E\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E \u0437\u0430\u043A\u0440\u044B\u0442\u044B\u043C.`,
        accent
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "sec-cap text-[10px] text-center mb-4", style: { color: BASE.inkDim, fontFamily: "var(--font-display)", fontWeight: 400 }, children: [
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
    view === "calendar" && /* @__PURE__ */ jsx(CalendarView, { entries, accent, measureMode, currency, t }),
    view === "emotions" && /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[11px]", style: { color: BASE.inkDim, fontFamily: "var(--font-display)" }, children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 12, style: { color: accent } }),
            " \u0427\u0442\u043E \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u0436\u0443\u0440\u043D\u0430\u043B"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setReviewOpen(true),
              className: "shrink-0 px-2.5 py-1 rounded-full text-[11px] transition-all duration-150 active:scale-95",
              style: { color: accent, border: `1px solid ${accent}40`, background: `${accent}0F`, fontFamily: "var(--font-display)" },
              children: "\u0420\u0430\u0437\u0431\u043E\u0440"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: insight })
      ] }),
      /* V1.4 — метрики стояли одной строкой из четырёх «· подпись N%», которая на телефоне
         переносилась посреди подписи. Теперь сетка 2x2 из карточек одинаковой ширины. */
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 mb-6", children: [
        { key: "awareness", label: t.home.awareness, score: analytics.awareness.score.value, trend: analytics.awareness.trend },
        { key: "discipline", label: t.home.discipline, score: analytics.discipline.score.value, trend: analytics.discipline.trend },
        { key: "risk", label: t.home.riskStability, score: analytics.risk.stability.value, trend: analytics.risk.trend },
        { key: "reflection", label: t.home.reflection, score: analytics.reflection.score.value, trend: analytics.reflection.trend }
      ].filter((m) => m.score != null).map((m) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "rounded-xl px-3 py-2.5",
          style: { border: `1px solid ${BASE.line}`, background: BASE.surface },
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.08em] mb-1.5 truncate", style: { color: BASE.inkFaint }, children: m.label }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 mb-1.5", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[17px] leading-none", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: [
                m.score,
                "%"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-[11px]", style: { color: BASE.inkFaint }, children: TREND_ARROW[m.trend] || "" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-[3px] rounded-full", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-[3px] rounded-full transition-all duration-700 ease-out", style: { width: `${Math.max(0, Math.min(100, m.score))}%`, background: accent } }) })
          ]
        },
        m.key
      )) }),
      /* V1.4 — на месте скаттера теперь прямое сравнение «при какой эмоции результат
         лучше». Облако точек в координатах страх/уверенность ничего не сообщало: точки
         не подписаны, вывода из формы облака не следует, а сами оси после перехода на
         процентные шкалы стали производной величиной, а не исходными данными. */
      /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-baseline justify-between gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: "\u041A\u0430\u043A \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0432\u043B\u0438\u044F\u0435\u0442 \u043D\u0430 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] shrink-0", style: { color: BASE.inkFaint }, children: "\u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442" })
      ] }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(EmotionImpact, { stats: emotionImpact, measureMode, currency }) })
    ] }),
    view === "performance" && /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      /* @__PURE__ */ jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm block", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: "Кривая доходности" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] block mt-1", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: "накопительный результат по дням" })
          ] }),
          equityCurve.length > 0 && /* @__PURE__ */ jsx("span", { className: "shrink-0 text-sm", style: { color: equityCurve[equityCurve.length - 1].cum >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: formatResult(equityCurve[equityCurve.length - 1].cum, measureMode, currency) })
        ] }),
        equityCurve.length < 2 ? /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: "Добавь результат хотя бы к паре сделок, чтобы увидеть динамику по дням." }) : /* @__PURE__ */ jsx("div", { style: { width: "100%", height: 240 }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(AreaChart, { data: equityCurve, margin: { top: 8, right: 6, bottom: 6, left: -14 }, children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "eqGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: accent, stopOpacity: 0.26 }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: accent, stopOpacity: 0.02 })
          ] }) }),
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: `${BASE.line}CC`, vertical: false, strokeDasharray: "3 6" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "dateLabel", tick: { fill: BASE.inkFaint, fontSize: 10 }, stroke: "transparent", tickLine: false, axisLine: false, dy: 6 }),
          /* @__PURE__ */ jsx(YAxis, { tick: { fill: BASE.inkFaint, fontSize: 10 }, stroke: "transparent", tickLine: false, axisLine: false, width: 36 }),
          /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(EquityTooltip, {}), cursor: { stroke: BASE.line, strokeDasharray: "3 4" } }),
          /* @__PURE__ */ jsx(Area, { type: "linear", dataKey: "cum", stroke: accent, strokeWidth: 2.5, fill: "url(#eqGrad)", dot: { r: 3.5, fill: BASE.ink, stroke: accent, strokeWidth: 1.5 }, activeDot: { r: 5, fill: BASE.ink, stroke: accent, strokeWidth: 2 }, isAnimationActive: true, animationDuration: 650 })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm block", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: "Результат по типу сетапа" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] block mt-1", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: "итог + средний результат на сделку" })
          ] }),
          tagStats.length > 0 && /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[10px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: `${tagStats.length} сетап.` })
        ] }),
        tagStats.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: "Добавь результат к сделкам, чтобы увидеть, какие сетапы реально работают." }) : /* @__PURE__ */ jsx(TagBars, { data: tagStats, measureMode, currency })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:grid lg:grid-cols-2 lg:gap-4 lg:items-start", children: [
      analytics.rrStats && analytics.rrStats.sampleSize > 0 && /* @__PURE__ */ jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm block mb-3", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: t.home.avgRrWinRate }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(StatCard, { label: "Average RR", value: analytics.rrStats.avgRealizedRR != null ? `${analytics.rrStats.avgRealizedRR >= 0 ? "+" : ""}${analytics.rrStats.avgRealizedRR}R` : "—", accent: analytics.rrStats.avgRealizedRR != null ? analytics.rrStats.avgRealizedRR >= 0 ? WIN : LOSS : BASE.ink }),
          /* @__PURE__ */ jsx(StatCard, { label: "Win Rate", value: analytics.rrStats.winRate != null ? `${analytics.rrStats.winRate}%` : "—", accent: BASE.ink })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
          /* @__PURE__ */ jsxs("span", { children: ["Wins ", analytics.rrStats.wins] }),
          /* @__PURE__ */ jsxs("span", { children: ["Losses ", analytics.rrStats.losses] }),
          /* @__PURE__ */ jsxs("span", { children: ["Breakeven ", analytics.rrStats.breakevens] })
        ] })
      ] }),
      planVsFact && /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm block mb-3", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: "План vs Факт" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-3", children: [
          /* @__PURE__ */ jsx(StatCard, { label: "Ср. Planned RR", value: `${planVsFact.avgPlanned.toFixed(1)}R`, accent: BASE.ink }),
          /* @__PURE__ */ jsx(StatCard, { label: "Ср. Realized RR", value: `${planVsFact.avgRealized.toFixed(1)}R`, accent: planVsFact.avgRealized >= 0 ? WIN : LOSS }),
          planVsFact.captureRatio != null && /* @__PURE__ */ jsx(StatCard, { label: "TP Capture", value: `${Math.round(planVsFact.captureRatio)}%`, accent: BASE.ink })
        ] }),
        planVsFact.closeTotal > 0 && /* @__PURE__ */ jsxs("div", { className: "flex gap-3 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
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
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: title })
      ] }),
      completed && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full", style: { color: accent, border: `1px solid ${accent}40` }, children: [
        /* @__PURE__ */ jsx(Check, { size: 10 }),
        " \u0413\u043E\u0442\u043E\u0432\u043E"
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs mb-2.5", style: { color: BASE.inkFaint }, children: desc }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 h-1 rounded-full", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${pct}%`, background: completed ? accent : BASE.inkDim } }) }),
      /* @__PURE__ */ jsxs("span", { className: "text-[11px] shrink-0", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
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
  const effectiveWeeklyGoal = 7;
  const pct = Math.min(100, Math.round(daysThisWeek / effectiveWeeklyGoal * 100));
  const animatedStreak = Math.round(useAnimatedNumber(streak));
  const CHALLENGE_ICONS = { revenge: ShieldCheck, reflect: PenLine, winstreak: TrendingUp };
  const challenges = useMemo(() => calculateChallengeProgress(entries, lang), [entries, lang]);
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("h2", { className: "sec-cap text-[10px] text-center mb-5", style: { color: BASE.inkDim, fontFamily: "var(--font-display)", fontWeight: 400 }, children: [
      " ",
      t.challenge.title
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:columns-2 lg:gap-4", children: [
    /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "mb-4 text-center py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-1", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 500 }, children: animatedStreak }),
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide", style: { color: BASE.inkFaint }, children: t.challenge.daysInARow })
    ] }),
    /* @__PURE__ */ jsx(ChallengeCard, { icon: CalendarCheck, title: t.challenge.weeklyConsistency, desc: t.challenge.weeklyConsistencyDesc(effectiveWeeklyGoal), progress: daysThisWeek, goal: effectiveWeeklyGoal, accent }),
    challenges.map((c) => /* @__PURE__ */ jsx(ChallengeCard, { icon: CHALLENGE_ICONS[c.id], title: c.title, desc: c.desc, progress: c.progress, goal: c.goal, accent }, c.id)),
    /* @__PURE__ */ jsxs(Card, { className: "mt-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: t.challenge.thisWeek }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs", style: { color: BASE.inkFaint }, children: [
          daysThisWeek,
          "/",
          effectiveWeeklyGoal
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-4", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${pct}%`, background: accent } }) }),
      /* @__PURE__ */ jsx(WeekDots, { week, accent })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed break-inside-avoid", style: { color: BASE.inkFaint }, children: t.challenge.footer })
    ] })
  ] });
}

export { Home, Patterns, Challenge };
