import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Brain, ChevronDown, ChevronUp, Check, RotateCcw, AlertTriangle } from "lucide-react";
import { BASE, WIN, LOSS } from "../../config/app-config.js";
import {
  DECISION_ARGUMENT_REVIEW_ASSESSMENTS,
  DECISION_REVIEW_OUTCOMES,
  normalizeDecisionSession
} from "../../core/decision-model.js";
import { DECISION_EMOTION_LABELS, decisionFactorLabel } from "../../core/decision-factor-taxonomy.js";

const L = {
  ru: {
    title: "Логика до входа",
    loading: "Загружаю разбор…",
    failed: "Не удалось загрузить разбор решения",
    retry: "Повторить",
    decision: "Решение",
    clarity: "Ясность",
    confidence: "Уверенность",
    weight: "Вес",
    emotion: "Эмоция",
    key: "главный",
    conditions: "Условия",
    review: "Разбор после сделки",
    reviewHint: "Сравни исходную логику с тем, что увидел после результата. Исходные оценки не изменятся.",
    openReview: "Оценить логику после сделки",
    editReview: "Изменить post-review",
    saveReview: "Сохранить post-review",
    note: "Что понял после сделки?",
    notePlaceholder: "Коротко: что было верно, что переоценил, что пропустил…",
    argumentAfter: "После сделки",
    resultQuestion: "Как ты оцениваешь первоначальную логику?",
    saved: "Post-review сохранён",
    saveFailed: "Не удалось сохранить post-review",
    logic_valid: "Логика была корректной",
    logic_invalid: "Логика оказалась неверной",
    plan_violated: "Я нарушил свой план",
    inconclusive: "Результат ничего не доказывает",
    overestimated: "Переоценил",
    underestimated: "Недооценил",
    accurate: "Оценил верно",
    unclear: "Не уверен"
  },
  en: {
    title: "Pre-trade reasoning",
    loading: "Loading decision…",
    failed: "Could not load decision",
    retry: "Retry",
    decision: "Decision",
    clarity: "Clarity",
    confidence: "Confidence",
    weight: "Weight",
    emotion: "Emotion",
    key: "key",
    conditions: "Conditions",
    review: "Post-trade review",
    reviewHint: "Compare the original logic with what you learned after the outcome. The original snapshot stays unchanged.",
    openReview: "Review the logic after trade",
    editReview: "Edit post-review",
    saveReview: "Save post-review",
    note: "What did you learn?",
    notePlaceholder: "Briefly: what was right, overestimated, or missed…",
    argumentAfter: "After trade",
    resultQuestion: "How do you rate the original logic?",
    saved: "Post-review saved",
    saveFailed: "Could not save post-review",
    logic_valid: "Logic was sound",
    logic_invalid: "Logic was wrong",
    plan_violated: "I violated my plan",
    inconclusive: "Outcome is inconclusive",
    overestimated: "Overestimated",
    underestimated: "Underestimated",
    accurate: "Accurate",
    unclear: "Unsure"
  }
};

const clamp = (v) => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));
const sideColor = (side, accent) => side === "long" || side === "for_entry" ? WIN : side === "short" || side === "against_entry" ? LOSS : accent;

function Panel({ children, className = "" }) {
  return jsx("div", { className: `rounded-[14px] p-3 ${className}`, style: { background: BASE.surface, border: `1px solid ${BASE.line}` }, children });
}

function Slider({ label, value, fallbackValue = 50, onChange, accent }) {
  const rated = value != null;
  const sliderValue = rated ? value : (fallbackValue == null ? 50 : fallbackValue);
  return jsxs("div", { className: "mb-3", children: [
    jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [jsx("span", { className: "text-[10px]", style: { color: BASE.inkDim }, children: label }), jsx("span", { className: "text-[11px]", style: { color: rated ? BASE.ink : BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: rated ? `${value}%` : "—" })] }),
    jsx("input", { type: "range", min: 0, max: 100, step: 5, value: sliderValue, onChange: (e) => onChange(clamp(e.target.value)), className: "w-full", style: { accentColor: accent } })
  ] });
}

function initialReview(session) {
  if (session?.postReview) return {
    outcomeAssessment: session.postReview.outcomeAssessment,
    note: session.postReview.note || "",
    argumentReviews: session.postReview.argumentReviews || []
  };
  return {
    outcomeAssessment: "inconclusive",
    note: "",
    argumentReviews: (session?.arguments || []).map((arg) => ({
      argumentId: arg.id,
      weightAfter: null,
      emotionAfter: null,
      assessment: "unclear"
    }))
  };
}

export function DecisionTradePanel({ sessionId, userId, store, trade, accent, lang = "ru", notify }) {
  const l = L[lang] || L.ru;
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [review, setReview] = useState(null);

  const load = async () => {
    if (!sessionId || !userId || !store) return;
    setLoading(true);
    setError(null);
    try {
      const next = await store.loadSession(userId, sessionId);
      let normalized = normalizeDecisionSession(next);
      if (!normalized) throw new Error("decision_session_missing");
      if (!normalized.linkedTradeId && trade?.id && ["locked", "linked", "reviewed"].includes(normalized.status) && store.linkTrade) {
        try {
          normalized = await store.linkTrade(userId, normalized.id, trade.id);
        } catch (_) {
          // The journal trade remains valid even when relinking cannot be confirmed right now.
        }
      }
      setSession(normalized);
      setReview(initialReview(normalized));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Journal lists can contain many Decision-linked trades. Do not issue one Firestore read per
    // card just because the Journal screen mounted; load the immutable snapshot only when the
    // user expands that trade's Decision section.
    setExpanded(false);
    setSession(null);
    setReview(null);
    setError(null);
    setLoading(false);
  }, [sessionId, userId, store, trade?.id]);

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    if (next && !session && !loading) load();
  };

  const reviewMap = useMemo(() => new Map((review?.argumentReviews || []).map((row) => [row.argumentId, row])), [review]);
  const isClosed = trade?.status === "closed" || trade?.outcome != null;

  const patchArgReview = (argumentId, patch) => {
    const base = reviewMap.get(argumentId) || { argumentId, weightAfter: null, emotionAfter: null, assessment: "unclear" };
    const next = { ...base, ...patch, argumentId };
    const rows = (review?.argumentReviews || []).filter((row) => row.argumentId !== argumentId);
    setReview({ ...(review || initialReview(session)), argumentReviews: [...rows, next] });
  };

  const saveReview = async () => {
    if (!store || !userId || !session) return;
    setSaving(true);
    try {
      const committed = await store.savePostReview(userId, session.id, review || initialReview(session));
      setSession(committed);
      setReview(initialReview(committed));
      setReviewOpen(false);
      notify?.(l.saved);
    } catch (e) {
      notify?.(`${l.saveFailed}: ${e?.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  if (!sessionId) return null;
  const collapsedHeader = (chevron) => jsxs("button", { type: "button", onClick: toggleExpanded, className: "w-full flex items-center justify-between text-left py-1", children: [
    jsxs("div", { className: "flex items-center gap-2", children: [jsx(Brain, { size: 13, style: { color: accent } }), jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: l.title })] }),
    chevron
  ] });
  if (!expanded) return jsx("div", { className: "pt-2", style: { borderTop: `1px solid ${BASE.line}` }, children: collapsedHeader(jsx(ChevronDown, { size: 13, style: { color: BASE.inkFaint } })) });
  if (loading) return jsxs("div", { className: "pt-2", style: { borderTop: `1px solid ${BASE.line}` }, children: [collapsedHeader(jsx(ChevronUp, { size: 13, style: { color: BASE.inkFaint } })), jsx("div", { className: "text-[10px] py-3", style: { color: BASE.inkFaint }, children: l.loading })] });
  if (error || !session) return jsxs("div", { className: "pt-2", style: { borderTop: `1px solid ${BASE.line}` }, children: [collapsedHeader(jsx(ChevronUp, { size: 13, style: { color: BASE.inkFaint } })), jsxs(Panel, { children: [jsx(AlertTriangle, { size: 14, style: { color: BASE.inkFaint } }), jsx("div", { className: "text-[11px] mt-2 mb-2", style: { color: BASE.inkDim }, children: l.failed }), jsxs("button", { type: "button", onClick: load, className: "text-[10px] flex items-center gap-1", style: { color: accent }, children: [jsx(RotateCcw, { size: 11 }), l.retry] })] })] });

  const args = [...session.arguments].sort((a, b) => Number(b.isDecisive) - Number(a.isDecisive) || b.weight - a.weight);
  const cond = session.conditions || {};
  const conditionRows = session.mode === "entry"
    ? [...(cond.entryRemainsValidIf || []).map((text) => [lang === "en" ? "Entry valid" : "Вход валиден", text]), ...(cond.invalidation || []).map((text) => [lang === "en" ? "Invalidation" : "Инвалидация", text])]
    : [...(cond.longBecomesValidIf || []).map((text) => ["LONG", text]), ...(cond.shortBecomesValidIf || []).map((text) => ["SHORT", text])];

  return jsxs("div", { className: "pt-2", style: { borderTop: `1px solid ${BASE.line}` }, children: [
    jsxs("button", { type: "button", onClick: toggleExpanded, className: "w-full flex items-center justify-between text-left py-1", children: [
      jsxs("div", { className: "flex items-center gap-2", children: [jsx(Brain, { size: 13, style: { color: accent } }), jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: l.title })] }),
      expanded ? jsx(ChevronUp, { size: 13, style: { color: BASE.inkFaint } }) : jsx(ChevronDown, { size: 13, style: { color: BASE.inkFaint } })
    ] }),
    expanded && jsxs("div", { className: "mt-2 space-y-2", children: [
      jsxs(Panel, { children: [
        jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          jsxs("div", { children: [jsx("div", { className: "text-[8px] uppercase mb-1", style: { color: BASE.inkFaint }, children: l.decision }), jsx("div", { className: "text-[12px]", style: { color: sideColor(session.finalDecision, accent), fontFamily: "var(--font-mono)", fontWeight: 600 }, children: String(session.finalDecision || "—").toUpperCase() })] }),
          jsxs("div", { children: [jsx("div", { className: "text-[8px] uppercase mb-1", style: { color: BASE.inkFaint }, children: l.clarity }), jsx("div", { className: "text-[12px]", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: `${session.preDecisionState.clarityBeforeRated ? `${session.preDecisionState.clarityBefore}%` : "—"} → ${session.preDecisionState.clarityAfterRated ? `${session.preDecisionState.clarityAfter}%` : "—"}` })] }),
          jsxs("div", { children: [jsx("div", { className: "text-[8px] uppercase mb-1", style: { color: BASE.inkFaint }, children: l.confidence }), jsx("div", { className: "text-[12px]", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: session.preDecisionState.decisionConfidenceRated ? `${session.preDecisionState.decisionConfidence}%` : "—" })] })
        ] })
      ] }),
      ...args.map((arg) => jsxs(Panel, { children: [
        jsxs("div", { className: "flex items-start justify-between gap-2", children: [jsx("div", { className: "text-[11px] leading-relaxed", style: { color: BASE.ink }, children: arg.normalizedText }), arg.isDecisive && jsx("span", { className: "text-[9px] shrink-0", style: { color: accent }, children: `★ ${l.key}` })] }),
        jsxs("div", { className: "flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[9px]", style: { color: BASE.inkFaint }, children: [
          jsx("span", { children: decisionFactorLabel(arg.factorId, lang) }),
          jsx("span", { style: { fontFamily: "var(--font-mono)" }, children: `${l.weight} ${arg.weightRated ? `${arg.weight}%` : "—"}` }),
          jsx("span", { style: { fontFamily: "var(--font-mono)" }, children: `${l.emotion} ${arg.emotionRated ? `${arg.emotionIntensity}%` : "—"}` }),
          arg.emotionRated && arg.emotionTag && jsx("span", { children: DECISION_EMOTION_LABELS[arg.emotionTag]?.[lang] || arg.emotionTag })
        ] })
      ] }, arg.id)),
      conditionRows.length > 0 && jsxs(Panel, { children: [jsx("div", { className: "text-[9px] uppercase tracking-wide mb-2", style: { color: BASE.inkFaint }, children: l.conditions }), ...conditionRows.map(([label, text], i) => jsxs("div", { className: "text-[10px] leading-relaxed mb-1.5", children: [jsx("span", { style: { color: BASE.inkFaint }, children: `${label}: ` }), jsx("span", { style: { color: BASE.inkDim }, children: text })] }, `${label}_${i}`))] }),
      isClosed && jsxs("div", { className: "pt-2", children: [
        jsx("button", { type: "button", onClick: () => setReviewOpen((v) => !v), className: "w-full h-10 rounded-[11px] text-[11px]", style: { border: `1px solid ${session.postReview ? accent + "55" : BASE.line}`, color: session.postReview ? accent : BASE.inkDim, background: session.postReview ? `${accent}0b` : "transparent" }, children: session.postReview ? l.editReview : l.openReview }),
        reviewOpen && jsxs(Panel, { className: "mt-2", children: [
          jsx("div", { className: "text-[13px] mb-1", style: { color: BASE.ink, fontWeight: 600 }, children: l.review }),
          jsx("p", { className: "text-[10px] leading-relaxed mb-3", style: { color: BASE.inkFaint }, children: l.reviewHint }),
          jsx("div", { className: "text-[10px] mb-2", style: { color: BASE.inkDim }, children: l.resultQuestion }),
          jsx("div", { className: "grid grid-cols-2 gap-1.5 mb-4", children: DECISION_REVIEW_OUTCOMES.map((id) => jsx("button", { type: "button", onClick: () => setReview({ ...(review || initialReview(session)), outcomeAssessment: id }), className: "min-h-10 px-2 rounded-[9px] text-[9px] text-left", style: { border: `1px solid ${(review?.outcomeAssessment || "inconclusive") === id ? accent + "55" : BASE.line}`, color: (review?.outcomeAssessment || "inconclusive") === id ? accent : BASE.inkDim, background: (review?.outcomeAssessment || "inconclusive") === id ? `${accent}0b` : "transparent" }, children: l[id] }, id)) }),
          ...args.map((arg) => {
            const row = reviewMap.get(arg.id) || { argumentId: arg.id, weightAfter: null, emotionAfter: null, assessment: "unclear" };
            return jsxs("div", { className: "mb-4 pt-3", style: { borderTop: `1px solid ${BASE.line}` }, children: [
              jsx("div", { className: "text-[10px] mb-2 leading-relaxed", style: { color: BASE.ink }, children: arg.normalizedText }),
              jsx(Slider, { label: `${l.weight}: ${arg.weightRated ? `${arg.weight}%` : "—"} →`, value: row.weightAfter, fallbackValue: arg.weightRated ? arg.weight : 50, onChange: (v) => patchArgReview(arg.id, { weightAfter: v }), accent }),
              jsx(Slider, { label: `${l.emotion}: ${arg.emotionRated ? `${arg.emotionIntensity}%` : "—"} →`, value: row.emotionAfter, fallbackValue: arg.emotionRated ? arg.emotionIntensity : 50, onChange: (v) => patchArgReview(arg.id, { emotionAfter: v }), accent }),
              jsx("div", { className: "flex flex-wrap gap-1", children: DECISION_ARGUMENT_REVIEW_ASSESSMENTS.map((id) => jsx("button", { type: "button", onClick: () => patchArgReview(arg.id, { assessment: id }), className: "px-2 py-1 rounded-full text-[8px]", style: { border: `1px solid ${row.assessment === id ? accent + "55" : BASE.line}`, color: row.assessment === id ? accent : BASE.inkFaint }, children: l[id] }, id)) })
            ] }, arg.id);
          }),
          jsx("div", { className: "text-[10px] mb-1.5", style: { color: BASE.inkDim }, children: l.note }),
          jsx("textarea", { rows: 3, value: review?.note || "", onChange: (e) => setReview({ ...(review || initialReview(session)), note: e.target.value }), placeholder: l.notePlaceholder, className: "w-full bg-transparent rounded-[10px] p-2.5 text-[11px] resize-none outline-none mb-3", style: { border: `1px solid ${BASE.line}`, color: BASE.ink } }),
          jsxs("button", { type: "button", disabled: saving, onClick: saveReview, className: "w-full h-10 rounded-[10px] flex items-center justify-center gap-2 text-[11px]", style: { background: BASE.ink, color: "#050505", opacity: saving ? 0.55 : 1 }, children: [jsx(Check, { size: 13 }), saving ? "…" : l.saveReview] })
        ] })
      ] })
    ] })
  ] });
}
