// mind.exe — calibration and journal-review UI.
// Calibration history persistence is injected by app.js; model calls use the shared AI service.

import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Check, AlertTriangle, Gauge } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import { BASE, WIN, LOSS, WARN } from "../../config/app-config.js?v=1";
import { Card } from "../../ui/primitives.js?v=2";
import { LogoSpinner } from "../../ui/brand.js?v=1";
import {
  CALIBRATION_QUESTIONS, CALIBRATION_QUESTIONS_EN, REVIEW_LIKERT, REVIEW_LIKERT_EN,
  buildReviewQuiz, scoreJournalReview, caScaleSet, scoreCalibrationDynamic, caWithTimeout
} from "../../analytics/calibration-review.js?v=2";
import { caComputeAdaptiveFactors, caBuildContext } from "../../ai/context.js?v=2";
import {
  aiGenerateCalibrationQuestions, aiReviewQuestions, aiReviewSummary
} from "../../ai/ai-service.js?v=1";

const softLift = (accent) => `0 0 0 1px ${accent}35, 0 6px 20px ${accent}1F`;

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
    /* @__PURE__ */ jsxs("text", { x: "50%", y: "50%", textAnchor: "middle", dy: "0.35em", fill: BASE.ink, fontSize: "30", fontFamily: "var(--font-display)", fontWeight: "600", children: [
      Math.round(animated),
      "%"
    ] })
  ] });
}
// Bump this whenever the shape of a stored calibration record (its questions/options) changes, so
// a same-day cache written by an older build is treated as a miss instead of being replayed
// unchanged for the rest of the day. V5.8: bumped for CALIBRATION_SCALE_SETS (readiness/
// confidence/calm/impact) replacing the single hardcoded yes/no scale.
var CALIBRATION_CACHE_SCHEMA = 3;
export function Calibration({ accent, onComplete, lang, t, entries, analytics, userId, strategyNote, loadHistory, saveHistory }) {
  const [stage, setStage] = useState("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState(() => (lang === "en" ? CALIBRATION_QUESTIONS_EN : CALIBRATION_QUESTIONS).map((q) => ({ ...q, category: "baseline", source: "baseline" })));
  const [adaptiveActive, setAdaptiveActive] = useState(false);
  const historyRef = useRef([]);
  const q = questions[qIndex];
  // Runs only on explicit "Start" tap (never on render/state change, matching the Coach tab's
  // request rule). Cache: if a set was already generated today, reuse it instead of calling
  // Gemini again. Falls back through: Gemini adaptive -> local factor-based fallback questions ->
  // the original static 6-question CALIBRATION_QUESTIONS set, so this screen can never break.
  const prepareAndStart = async () => {
    setStage("loading");
    try {
      const history = await loadHistory(userId);
      historyRef.current = history;
      const todayKey = (/* @__PURE__ */ new Date()).toDateString();
      const cached = history[0] && new Date(history[0].date).toDateString() === todayKey ? history[0] : null;
      // Guard against a same-day cache record saved by an older version of this code path that
      // didn't persist `options` (would otherwise crash the quiz render on `q.options.map`).
      // Any such stale/malformed record is treated as a cache miss and a fresh set is generated.
      //
      // V5.8: also guard against a schema MISMATCH, not just missing options. A record written
      // before scaleType existed (or before any future calibration format change) still has a
      // perfectly well-formed, non-empty `options` array \u2014 it would pass the check above and
      // get replayed verbatim for the rest of that day, silently hiding whatever changed in the
      // question/scale logic until the cache ages out tomorrow. Every record now carries the
      // schema it was generated under; a mismatch (including a record with none at all) is a
      // cache miss, same as a malformed one.
      const cachedValid = cached && cached.schema === CALIBRATION_CACHE_SCHEMA && Array.isArray(cached.questions) && cached.questions.length && cached.questions.every((qq) => Array.isArray(qq.options) && qq.options.length);
      if (cachedValid) {
        setQuestions(cached.questions);
        setAdaptiveActive(cached.questions.some((qq) => qq.category === "adaptive"));
        setStage("quiz");
        return;
      }
      const factors = caComputeAdaptiveFactors(entries, analytics, history, lang);
      let adaptiveQuestions = [];
      if (factors.length) {
        try {
          const context = caBuildContext(entries, analytics, factors, history, lang, strategyNote);
          // V0.1 — вечная загрузка на экране "Готовим вопросы...". generateContent() у Firebase AI
          // не имеет собственного таймаута: при недоступной/висящей сети промис не резолвится
          // никогда, поэтому finally { setStage("quiz") } не выполнялся. Ограничиваем ожидание:
          // по истечении времени идём по уже существующему локальному fallback-пути.
          adaptiveQuestions = await caWithTimeout(aiGenerateCalibrationQuestions(context), 2e4, "ai_calibration_timeout");
        } catch (e) {
          adaptiveQuestions = [];
        }
        if (!adaptiveQuestions.length) adaptiveQuestions = caLocalFallbackQuestions(factors, lang);
      }
      const finalQuestions = assembleCalibrationQuestions(adaptiveQuestions, lang);
      setQuestions(finalQuestions);
      setAdaptiveActive(adaptiveQuestions.length > 0);
    } catch (e) {
      setQuestions((lang === "en" ? CALIBRATION_QUESTIONS_EN : CALIBRATION_QUESTIONS).map((qq) => ({ ...qq, category: "baseline", source: "baseline" })));
      setAdaptiveActive(false);
    } finally {
      setStage("quiz");
    }
  };
  const selectAnswer = (option) => {
    const next = { ...answers, [q.id]: option };
    setAnswers(next);
    setTimeout(() => {
      if (qIndex + 1 < questions.length) {
        setQIndex(qIndex + 1);
      } else {
        const r = scoreCalibrationDynamic(questions, next, lang);
        setResult(r);
        onComplete({ pct: r.pct, tierColor: r.tier.color, date: (/* @__PURE__ */ new Date()).toISOString(), riskFactors: r.riskFactors });
        const record = {
          date: (/* @__PURE__ */ new Date()).toISOString(),
          schema: CALIBRATION_CACHE_SCHEMA,
          questions: questions.map((qq) => ({ id: qq.id, text: qq.text, factor: qq.factor || null, category: qq.category, source: qq.source, options: qq.options })),
          answers: next,
          pct: r.pct,
          riskFactors: r.riskFactors
        };
        saveHistory(userId, [record, ...historyRef.current]);
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
      /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2 tracking-wide", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 600 }, children: t.calibration.heading }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-6", style: { color: BASE.inkDim }, children: t.calibration.subtitle }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-8 px-2", style: { color: BASE.inkFaint }, children: t.calibration.intro }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: prepareAndStart,
          className: "px-10 py-3 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "var(--font-display)", fontWeight: 600, boxShadow: softLift(accent) },
          children: t.calibration.start
        }
      )
    ] });
  }
  if (stage === "loading") {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx(LogoSpinner, { size: 26, accent }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: t.calibration.loading })
    ] });
  }
  if (stage === "quiz") {
    if (!q || !Array.isArray(q.options) || !q.options.length) {
      return /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm mb-4", style: { color: BASE.inkFaint }, children: t.coach.error }),
        /* @__PURE__ */ jsx("button", { onClick: restart, className: "text-sm", style: { color: accent }, children: t.calibration.restart })
      ] });
    }
    return /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2 text-xs", style: { color: BASE.inkFaint }, children: [
        /* @__PURE__ */ jsx("span", { children: t.calibration.questionOf(qIndex + 1, questions.length) }),
        /* @__PURE__ */ jsx("button", { onClick: restart, style: { color: BASE.inkFaint }, children: t.calibration.cancel })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-6", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-500 ease-out", style: { width: `${qIndex / questions.length * 100}%`, background: accent } }) }),
      qIndex === 0 && adaptiveActive && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-4 text-[11px]", style: { color: accent }, children: [
        /* @__PURE__ */ jsx(Sparkles, { size: 11 }),
        t.calibration.adaptiveNote
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg mb-5 leading-snug", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 500 }, children: q.text }),
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
    /* @__PURE__ */ jsx("p", { className: "text-base mb-6 px-2 leading-relaxed", style: { color: result.tier.color, fontFamily: "var(--font-display)", fontWeight: 500 }, children: result.tier.label }),
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
export function JournalReview({ entries, accent, onClose, t, lang }) {
  const baseIssues = useMemo(() => buildReviewQuiz(entries, lang), [entries, lang]);
  const likert = lang === "en" ? REVIEW_LIKERT_EN : REVIEW_LIKERT;
  const [stage, setStage] = useState("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  // V1.5 — Gemini переформулирует вопросы под конкретные числа из журнала. Запрос уходит
  // один раз, пока трейдер читает интро, и НЕ блокирует кнопку «Начать»: если ответ не
  // успел прийти или упал, показываются зашитые формулировки. Факты, evidence и
  // рекомендации в любом случае свои — от модели берётся только текст вопроса.
  const [aiQuestions, setAiQuestions] = useState(null);
  useEffect(() => {
    if (baseIssues.length === 0) return;
    let cancelled = false;
    aiReviewQuestions(baseIssues, lang).then((map) => {
      if (!cancelled && map && Object.keys(map).length > 0) setAiQuestions(map);
    }).catch((err) => console.warn("mind.exe: review questions unavailable", err));
    return () => {
      cancelled = true;
    };
  }, [baseIssues, lang]);
  const issues = useMemo(
    () => aiQuestions ? baseIssues.map((i) => aiQuestions[i.id] ? { ...i, question: aiQuestions[i.id] } : i) : baseIssues,
    [baseIssues, aiQuestions]
  );
  const dataDrivenCount = useMemo(() => baseIssues.filter((i) => i.dataDriven).length, [baseIssues]);
  // Персональный вывод. Локальный narrative из scoreJournalReview показывается сразу,
  // ИИ-версия подменяет его, когда придёт. Так экран результата никогда не ждёт сеть.
  const [aiSummary, setAiSummary] = useState(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const q = issues[qIndex];
  const finish = (next) => {
    setResult(scoreJournalReview(issues, next, lang));
    setStage("result");
    setAiSummaryLoading(true);
    aiReviewSummary(issues, next, lang).then((text) => {
      if (text && text.trim()) setAiSummary(text.trim());
    }).catch((err) => console.warn("mind.exe: review summary unavailable", err)).finally(() => setAiSummaryLoading(false));
  };
  const selectAnswer = (opt) => {
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    setTimeout(() => {
      if (qIndex + 1 < issues.length) {
        setQIndex(qIndex + 1);
      } else {
        finish(next);
      }
    }, 200);
  };
  const restart = () => {
    setStage("intro");
    setQIndex(0);
    setAnswers({});
    setResult(null);
    setAiSummary(null);
    setAiSummaryLoading(false);
  };
  if (baseIssues.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-4 stagger", children: [
      /* @__PURE__ */ jsx(Sparkles, { size: 38, style: { color: accent }, className: "mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2 tracking-wide", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 600 }, children: t.review.heading }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-8 px-4 leading-relaxed", style: { color: BASE.inkFaint }, children: t.review.notEnough }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "px-10 py-3 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "var(--font-display)", fontWeight: 600, boxShadow: softLift(accent) },
          children: t.review.back
        }
      )
    ] });
  }
  if (stage === "intro") {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-4 stagger", children: [
      /* @__PURE__ */ jsx(Sparkles, { size: 38, style: { color: accent }, className: "mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2 tracking-wide", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 600 }, children: t.review.heading }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-6", style: { color: BASE.inkDim }, children: t.review.questionsCount(issues.length, dataDrivenCount) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-8 px-2", style: { color: BASE.inkFaint }, children: t.review.intro }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setStage("quiz"),
          className: "px-10 py-3 rounded-full text-sm transition-all active:scale-95",
          style: { background: accent, color: "#06120F", fontFamily: "var(--font-display)", fontWeight: 600, boxShadow: softLift(accent) },
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
      /* @__PURE__ */ jsx("h3", { className: "text-lg mb-5 leading-snug", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 500 }, children: q.question }),
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
    /* @__PURE__ */ jsx("p", { className: "text-base mb-1 px-2 leading-relaxed", style: { color: result.tier.color, fontFamily: "var(--font-display)", fontWeight: 500 }, children: result.tier.label }),
    /* @__PURE__ */ jsx("p", { className: "text-[11px] mb-5", style: { color: BASE.inkFaint }, children: t.review.questionsAnswered(totalAnswered, dataDrivenAnswered) }),
    /* @__PURE__ */ jsxs(Card, { className: "text-left mb-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: aiSummary || result.narrative }),
      aiSummaryLoading && !aiSummary && /* @__PURE__ */ jsx("p", { className: "text-[11px] mt-2", style: { color: BASE.inkFaint }, children: t.review.summaryLoading }),
      aiSummary && /* @__PURE__ */ jsxs("p", { className: "text-[11px] mt-2 flex items-center gap-1.5", style: { color: BASE.inkFaint }, children: [
        /* @__PURE__ */ jsx(Sparkles, { size: 11, style: { color: accent } }),
        t.review.summaryByAi
      ] })
    ] }),
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
          style: { background: accent, color: "#06120F", fontFamily: "var(--font-display)", fontWeight: 600 },
          children: t.review.done
        }
      )
    ] })
  ] });
}
// ============================================================================
// ---- Adaptive Calibration Engine ---------------------------------------------
// New layer on top of the existing Calibration/scoreCalibrationDynamic UI and the existing
// aiCallGemini plumbing above. Nothing here replaces Analytics Engine, Pattern Engine,
// Calibration Score math, Firebase Auth, or Firestore — it only adds:
//   caComputeAdaptiveFactors: reads existing `analytics` + entries.slice for the last trading
//     day and a short rolling window, and turns that into a small list of typed, severity-scored
//     factors (recent_losses, revenge_risk, increased_risk, overtrading_risk, early_exit_pattern,
//     euphoria_risk, fomo_risk, repeated_lesson, poor_sleep, decreased_discipline, reflection_note).
//     Nothing is invented — every factor requires the underlying sample to actually exist.
//   caBuildContext: compresses entries+analytics+factors+recent question history into the same
//     kind of compact JSON aiBuildContext already builds for the Coach tab.
//   aiGenerateCalibrationQuestions: the only new Gemini call site. Gemini returns question TEXT
//     + factor/category/priority metadata only — never scores, never awareness, per the client's
//     explicit constraint. All questions (adaptive or fallback) are scored afterwards through the
//     existing shared CALIBRATION_READINESS_SCALE via scoreCalibrationDynamic.
//   caLocalFallbackQuestions: used whenever Gemini is unavailable or returns something unusable,
//     so the calibration screen can never break.
//   caLoadCalibrationHistory/caSaveCalibrationHistory: Firestore-backed (same storageGet/Set
//     pattern as loadAiState/saveAiState), doubles as same-day cache (don't regenerate if a set
//     was already produced today) and as the "don't ask the same thing again" question history.
// ============================================================================

function caLocalFallbackQuestions(adaptiveFactors, lang) {
  const bank = lang === "en" ? {
    consecutive_losses: "Given the recent losing trades, how comfortable would you be pausing for a while after your next loss today, if it happens?",
    euphoria_risk: "After the recent winning trades, how confident are you that you'll keep your usual risk size even if today starts well too?",
    revenge_risk: "If a trade goes against you today, how easy will it be to wait before entering the next one, instead of re-entering quickly?",
    increased_risk: "How committed are you to keeping your normal risk size today, regardless of how the first trade goes?",
    overtrading_risk: "If today gives fewer setups than usual, how comfortable are you trading less than you did recently?",
    early_exit_pattern: "If a position moves in your favor today, how easy will it be to wait for your planned exit instead of closing early?",
    fomo_risk: "If today doesn't offer a clean setup for a while, how comfortable are you ending the session without a trade?",
    repeated_lesson: "A similar lesson has come up more than once recently \u2014 how present is that lesson for you as you start today?",
    decreased_discipline: "How closely do you expect to follow your written plan today, entry to exit?",
    poor_sleep: "Given you weren't well rested recently, how ready do you feel to make clear-headed decisions today?",
    reflection_note: "Thinking back to your notes from the last session, how much is that still on your mind as you start today?"
  } : {
    consecutive_losses: "\u0421 \u0443\u0447\u0451\u0442\u043E\u043C \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u2014 \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0442\u0435\u0431\u0435 \u0431\u0443\u0434\u0435\u0442 \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u043F\u0430\u0443\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E \u0443\u0431\u044B\u0442\u043A\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F, \u0435\u0441\u043B\u0438 \u043E\u043D \u0441\u043B\u0443\u0447\u0438\u0442\u0441\u044F?",
    euphoria_risk: "\u041F\u043E\u0441\u043B\u0435 \u043D\u0435\u0434\u0430\u0432\u043D\u0438\u0445 \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u2014 \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0442\u044B \u0443\u0432\u0435\u0440\u0435\u043D, \u0447\u0442\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0448\u044C \u043E\u0431\u044B\u0447\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0438\u0441\u043A\u0430, \u0434\u0430\u0436\u0435 \u0435\u0441\u043B\u0438 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0442\u043E\u0436\u0435 \u043D\u0430\u0447\u043D\u0451\u0442\u0441\u044F \u0443\u0434\u0430\u0447\u043D\u043E?",
    revenge_risk: "\u0415\u0441\u043B\u0438 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0441\u0434\u0435\u043B\u043A\u0430 \u0443\u0439\u0434\u0451\u0442 \u043D\u0435 \u0432 \u0442\u0432\u043E\u044E \u0441\u0442\u043E\u0440\u043E\u043D\u0443 \u2014 \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043B\u0435\u0433\u043A\u043E \u0431\u0443\u0434\u0435\u0442 \u0432\u044B\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043F\u0430\u0443\u0437\u0443 \u043F\u0435\u0440\u0435\u0434 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u043C \u0432\u0445\u043E\u0434\u043E\u043C, \u0432\u043C\u0435\u0441\u0442\u043E \u0442\u043E\u0433\u043E \u0447\u0442\u043E\u0431\u044B \u0431\u044B\u0441\u0442\u0440\u043E \u0432\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F?",
    increased_risk: "\u041D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0442\u044B \u0433\u043E\u0442\u043E\u0432 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043E\u0431\u044B\u0447\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0438\u0441\u043A\u0430, \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u0442\u043E\u0433\u043E, \u043A\u0430\u043A \u043F\u0440\u043E\u0439\u0434\u0451\u0442 \u043F\u0435\u0440\u0432\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430?",
    overtrading_risk: "\u0415\u0441\u043B\u0438 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0441\u0435\u0442\u0430\u043F\u043E\u0432 \u0431\u0443\u0434\u0435\u0442 \u043C\u0435\u043D\u044C\u0448\u0435 \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E \u2014 \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E \u0442\u0435\u0431\u0435 \u0442\u043E\u0440\u0433\u043E\u0432\u0430\u0442\u044C \u043C\u0435\u043D\u044C\u0448\u0435, \u0447\u0435\u043C \u043E\u0431\u044B\u0447\u043D\u043E?",
    early_exit_pattern: "\u0415\u0441\u043B\u0438 \u043F\u043E\u0437\u0438\u0446\u0438\u044F \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043F\u043E\u0439\u0434\u0451\u0442 \u0432 \u043F\u043B\u044E\u0441 \u2014 \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043B\u0435\u0433\u043A\u043E \u0431\u0443\u0434\u0435\u0442 \u0434\u043E\u0436\u0434\u0430\u0442\u044C\u0441\u044F \u0437\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0433\u043E \u0432\u044B\u0445\u043E\u0434\u0430, \u0430 \u043D\u0435 \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u0442\u044C \u0440\u0430\u043D\u044C\u0448\u0435?",
    fomo_risk: "\u0415\u0441\u043B\u0438 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0434\u043E\u043B\u0433\u043E \u043D\u0435 \u0431\u0443\u0434\u0435\u0442 \u0447\u0451\u0442\u043A\u043E\u0433\u043E \u0441\u0435\u0442\u0430\u043F\u0430 \u2014 \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u0442\u044C \u0441\u0435\u0441\u0441\u0438\u044E \u0431\u0435\u0437 \u0441\u0434\u0435\u043B\u043A\u0438?",
    repeated_lesson: "\u041F\u043E\u0445\u043E\u0436\u0438\u0439 \u0443\u0440\u043E\u043A \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u043B\u0441\u044F \u0443\u0436\u0435 \u043D\u0435 \u0432 \u043F\u0435\u0440\u0432\u044B\u0439 \u0440\u0430\u0437 \u2014 \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043E\u043D \u0441\u0435\u0439\u0447\u0430\u0441 \u0443 \u0442\u0435\u0431\u044F \u0432 \u0433\u043E\u043B\u043E\u0432\u0435, \u043A\u043E\u0433\u0434\u0430 \u0442\u044B \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0448\u044C \u0441\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u0438\u0439 \u0434\u0435\u043D\u044C?",
    decreased_discipline: "\u041D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0442\u043E\u0447\u043D\u043E \u0442\u044B \u043F\u043B\u0430\u043D\u0438\u0440\u0443\u0435\u0448\u044C \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u044C \u0441\u0432\u043E\u0435\u043C\u0443 \u043F\u0438\u0441\u044C\u043C\u0435\u043D\u043D\u043E\u043C\u0443 \u043F\u043B\u0430\u043D\u0443 \u043E\u0442 \u0432\u0445\u043E\u0434\u0430 \u0434\u043E \u0432\u044B\u0445\u043E\u0434\u0430?",
    poor_sleep: "\u0423\u0447\u0438\u0442\u044B\u0432\u0430\u044F, \u0447\u0442\u043E \u0442\u044B \u043D\u0435\u0434\u0430\u0432\u043D\u043E \u043F\u043B\u043E\u0445\u043E \u0432\u044B\u0441\u043F\u0430\u043B\u2014 \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0433\u043E\u0442\u043E\u0432 \u0442\u0432\u043E\u0439 \u0443\u043C \u043A \u044F\u0441\u043D\u044B\u043C \u0440\u0435\u0448\u0435\u043D\u0438\u044F\u043C \u0441\u0435\u0433\u043E\u0434\u043D\u044F?",
    reflection_note: "\u0412\u0441\u043F\u043E\u043C\u043D\u0438 \u0441\u0432\u043E\u0438 \u0437\u0430\u043C\u0435\u0442\u043A\u0438 \u043F\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0441\u0435\u0441\u0441\u0438\u0438 \u2014 \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043E\u043D\u0438 \u0435\u0449\u0451 \u0441 \u0442\u043E\u0431\u043E\u0439, \u043A\u043E\u0433\u0434\u0430 \u0442\u044B \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0448\u044C \u0441\u0435\u0433\u043E\u0434\u043D\u044F?"
  };
  // V0.1 \u2014 раньше каждый fallback-вопрос получал scaleType "readiness", т.е. "Да/Нет", хотя
  // формулировки в банке спрашивают "насколько комфортно / насколько легко / насколько уверен".
  // Шкала теперь закреплена за конкретным вопросом банка (тексты фиксированные, поэтому
  // соответствие однозначное).
  const scaleByFactor = {
    consecutive_losses: "comfort",
    euphoria_risk: "confidence",
    revenge_risk: "ease",
    increased_risk: "readiness",
    overtrading_risk: "comfort",
    early_exit_pattern: "ease",
    fomo_risk: "comfort",
    repeated_lesson: "presence",
    decreased_discipline: "likelihood",
    poor_sleep: "energy",
    reflection_note: "presence"
  };
  return adaptiveFactors.filter((f) => bank[f.type]).sort((a, b) => b.severity - a.severity).slice(0, 4).map((f, i) => ({
    id: `fallback_${i}`,
    text: bank[f.type],
    factor: f.type,
    category: "adaptive",
    source: "fallback",
    priority: f.severity,
    scaleType: scaleByFactor[f.type] || "readiness"
  }));
}
function assembleCalibrationQuestions(adaptiveQuestions, lang) {
  const questions = lang === "en" ? CALIBRATION_QUESTIONS_EN : CALIBRATION_QUESTIONS;
  const baseline = questions.filter((q) => q.id === "sleep" || q.id === "emotion").map((q) => ({ ...q, category: "baseline", source: "baseline" }));
  // V5.7: each adaptive question can carry its own scaleType (readiness/confidence/calm/impact),
  // picked by aiGenerateCalibrationQuestions or the local fallback bank — so a question shaped
  // as "how much did X affect Y" gets the impact wording instead of being forced onto yes/no.
  const adaptive = adaptiveQuestions.slice(0, 4).map((q) => ({ ...q, options: caScaleSet(q.scaleType, lang) }));
  return [...baseline, ...adaptive];
}
