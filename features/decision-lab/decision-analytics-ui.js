import { jsx, jsxs } from "react/jsx-runtime";
import { Activity, Brain, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { BASE, WIN, LOSS } from "../../config/app-config.js";
import { buildDecisionAnalytics, buildDecisionInsights } from "../../core/decision-analytics.js";

const T = {
  ru: {
    title: "Как ты принимаешь решения",
    subtitle: "Связи внутри твоего журнала. Это не доказательство причинности и не торговый сигнал.",
    sessions: "Разборов",
    linked: "С результатом",
    clarity: "Ясность после разбора",
    overall: "Средний результат",
    observations: "Наблюдения",
    noObs: "Пока мало данных для персональных наблюдений.",
    factors: "Аргументы",
    noData: "Пока нет закрытых сделок, связанных с разборами. Аналитика начнёт работать по мере накопления истории.",
    usage: "Использован",
    decisive: "Главный",
    avgWeight: "Средний вес",
    avgEmotion: "Средняя эмоция",
    result: "Результат",
    calm: "Низкая эмоция",
    emotional: "Высокая эмоция",
    sample: "сделок",
    afterReview: "После сделки",
    insufficient: "мало данных",
    stable: "устойчивее",
    preliminary: "предварительно"
  },
  en: {
    title: "How you make decisions",
    subtitle: "Associations inside your journal. Not proof of causality and not a trading signal.",
    sessions: "Decisions",
    linked: "With outcome",
    clarity: "Clarity delta",
    overall: "Average result",
    observations: "Observations",
    noObs: "Not enough data for personal observations yet.",
    factors: "Arguments",
    noData: "No closed trades are linked to decisions yet. Analytics will appear as history accumulates.",
    usage: "Used",
    decisive: "Key",
    avgWeight: "Avg weight",
    avgEmotion: "Avg emotion",
    result: "Result",
    calm: "Low emotion",
    emotional: "High emotion",
    sample: "trades",
    afterReview: "After trade",
    insufficient: "low sample",
    stable: "more stable",
    preliminary: "preliminary"
  }
};

function Panel({ children, className = "" }) {
  return jsx("div", {
    className: `rounded-[18px] p-5 ${className}`,
    style: { background: "#070708", border: "1px solid #18181C" },
    children
  });
}

function Stat({ label, value, color = BASE.ink }) {
  return jsxs("div", { className: "min-w-0", children: [
    jsx("div", { className: "text-[11px] mb-1", style: { color: BASE.inkFaint }, children: label }),
    jsx("div", { className: "text-[19px] truncate", style: { color, fontFamily: "var(--font-mono)", fontWeight: 600 }, children: value })
  ] });
}

function fmtR(v) {
  return typeof v === "number" && Number.isFinite(v) ? `${v > 0 ? "+" : ""}${v.toFixed(2)}R` : "—";
}

function strengthLabel(strength, l) {
  if (strength === "stable") return l.stable;
  if (strength === "preliminary") return l.preliminary;
  return l.insufficient;
}

function FactorCard({ factor, lang, accent }) {
  const l = T[lang] || T.ru;
  const perf = factor.decisiveCount > 0 && factor.decisivePerformance?.sample > 0
    ? factor.decisivePerformance
    : factor.performance;
  const resultColor = typeof perf?.averageR === "number" ? (perf.averageR > 0 ? WIN : perf.averageR < 0 ? LOSS : BASE.ink) : BASE.inkDim;
  const low = factor.emotionBands?.low;
  const high = factor.emotionBands?.high;
  const canCompareEmotion = (low?.sample || 0) >= 5 && (high?.sample || 0) >= 5;
  return jsxs(Panel, { className: "mb-2.5", children: [
    jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      jsxs("div", { className: "min-w-0", children: [
        jsx("div", { className: "text-[14px] leading-snug", style: { color: BASE.ink, fontWeight: 600 }, children: factor.label }),
        jsx("div", { className: "text-[10px] mt-1", style: { color: BASE.inkFaint }, children: strengthLabel(perf?.strength, l) })
      ] }),
      jsx("div", { className: "text-[14px] shrink-0", style: { color: resultColor, fontFamily: "var(--font-mono)", fontWeight: 600 }, children: fmtR(perf?.averageR) })
    ] }),
    jsxs("div", { className: "grid grid-cols-4 gap-2 mt-4", children: [
      jsx(Stat, { label: l.usage, value: String(factor.usageCount) }),
      jsx(Stat, { label: l.decisive, value: String(factor.decisiveCount), color: factor.decisiveCount ? accent : BASE.inkDim }),
      jsx(Stat, { label: l.avgWeight, value: factor.averageWeight == null ? "—" : `${factor.averageWeight}%` }),
      jsx(Stat, { label: l.avgEmotion, value: factor.averageEmotionIntensity == null ? "—" : `${factor.averageEmotionIntensity}%` })
    ] }),
    perf?.sample > 0 && jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 text-[10px]", style: { borderTop: `1px solid ${BASE.line}`, color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
      jsx("span", { children: `n=${perf.sample}` }),
      jsx("span", { children: `WR ${perf.winRate == null ? "—" : `${perf.winRate}%`}` }),
      jsx("span", { children: `Avg ${fmtR(perf.averageR)}` })
    ] }),
    (factor.postReview?.sample || 0) >= 3 && jsxs("div", { className: "mt-3 pt-3 flex items-center justify-between gap-3 text-[10px]", style: { borderTop: `1px solid ${BASE.line}` }, children: [
      jsx("span", { style: { color: BASE.inkFaint }, children: l.afterReview }),
      jsx("span", { style: { color: BASE.inkDim, fontFamily: "var(--font-mono)" }, children: `${factor.postReview.averageWeightDelta == null ? "—" : `${factor.postReview.averageWeightDelta > 0 ? "+" : ""}${factor.postReview.averageWeightDelta} вес`} · n=${factor.postReview.sample}` })
    ] }),
    canCompareEmotion && jsxs("div", { className: "grid grid-cols-2 gap-2 mt-3", children: [
      jsxs("div", { className: "rounded-[10px] p-2.5", style: { background: BASE.bg, border: `1px solid ${BASE.line}` }, children: [
        jsx("div", { className: "text-[10px] mb-1", style: { color: BASE.inkFaint }, children: l.calm }),
        jsx("div", { className: "text-[12px]", style: { color: typeof low.averageR === "number" ? (low.averageR >= 0 ? WIN : LOSS) : BASE.inkDim, fontFamily: "var(--font-mono)" }, children: `${fmtR(low.averageR)} · n=${low.sample}` })
      ] }),
      jsxs("div", { className: "rounded-[10px] p-2.5", style: { background: BASE.bg, border: `1px solid ${BASE.line}` }, children: [
        jsx("div", { className: "text-[10px] mb-1", style: { color: BASE.inkFaint }, children: l.emotional }),
        jsx("div", { className: "text-[12px]", style: { color: typeof high.averageR === "number" ? (high.averageR >= 0 ? WIN : LOSS) : BASE.inkDim, fontFamily: "var(--font-mono)" }, children: `${fmtR(high.averageR)} · n=${high.sample}` })
      ] })
    ] })
  ] });
}

export function DecisionAnalyticsView({ sessions = [], trades = [], accent, lang = "ru" }) {
  const l = T[lang] || T.ru;
  const analytics = buildDecisionAnalytics(sessions, trades, lang);
  const insights = buildDecisionInsights(analytics, lang);
  const overall = analytics.overallPerformance;
  const avgRColor = typeof overall.averageR === "number" ? (overall.averageR > 0 ? WIN : overall.averageR < 0 ? LOSS : BASE.ink) : BASE.inkDim;

  return jsxs("div", { children: [
    jsxs("div", { className: "mb-6", children: [
      jsxs("div", { className: "flex items-center gap-2 mb-2", children: [jsx(BarChart3, { size: 18, style: { color: accent } }), jsx("h2", { className: "text-[24px]", style: { color: BASE.ink, fontWeight: 650 }, children: l.title })] }),
      jsx("p", { className: "text-[13px] leading-[1.55]", style: { color: BASE.inkDim }, children: l.subtitle })
    ] }),
    jsxs(Panel, { className: "mb-4", children: [
      jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        jsx(Stat, { label: l.sessions, value: String(analytics.lockedCount) }),
        jsx(Stat, { label: l.linked, value: String(analytics.linkedClosedCount) }),
        jsx(Stat, { label: l.clarity, value: analytics.averageClarityDelta == null ? "—" : `${analytics.averageClarityDelta >= 0 ? "+" : ""}${analytics.averageClarityDelta}%`, color: analytics.averageClarityDelta >= 0 ? WIN : BASE.ink }),
        jsx(Stat, { label: l.overall, value: fmtR(overall.averageR), color: avgRColor })
      ] })
    ] }),
    analytics.linkedClosedCount === 0 && jsxs(Panel, { className: "mb-4", children: [jsx(AlertTriangle, { size: 17, style: { color: BASE.inkFaint } }), jsx("p", { className: "text-[13px] mt-2 leading-[1.55]", style: { color: BASE.inkDim }, children: l.noData })] }),
    jsx("div", { className: "text-[12px] mb-3", style: { color: BASE.inkFaint }, children: l.observations }),
    insights.length ? jsx("div", { className: "space-y-2 mb-5", children: insights.map((insight, i) => jsxs(Panel, { children: [jsxs("div", { className: "flex items-start gap-2", children: [jsx(Activity, { size: 14, className: "mt-0.5 shrink-0", style: { color: accent } }), jsx("p", { className: "text-[13px] leading-[1.55]", style: { color: BASE.inkDim }, children: insight.text })] })] }, `${insight.type}_${insight.factorId}_${i}`)) }) : jsx("div", { className: "text-[12px] mb-5", style: { color: BASE.inkFaint }, children: l.noObs }),
    jsx("div", { className: "text-[12px] mb-3", style: { color: BASE.inkFaint }, children: l.factors }),
    analytics.factors.length ? analytics.factors.slice(0, 24).map((factor) => jsx(FactorCard, { factor, lang, accent }, factor.factorId)) : jsx("div", { className: "text-[12px] py-4", style: { color: BASE.inkFaint }, children: l.noData })
  ] });
}
