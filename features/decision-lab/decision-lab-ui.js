import { useEffect, useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import {
  Brain, Mic, Square, ChevronRight, ChevronLeft, Plus, Trash2, Check,
  RotateCcw, AlertTriangle, Sparkles, BarChart3, ImagePlus, ChevronDown
} from "lucide-react";
import { BASE, WIN, LOSS } from "../../config/app-config.js";
import { ScreenshotImage, requestAppConfirm } from "../../ui/primitives.js";
import { compressDecisionImageFile } from "../../ui/media-utils.js";
import {
  createDecisionSession,
  addDecisionTranscriptSegment,
  setDecisionArguments,
  normalizeDecisionArgument,
  normalizeDecisionSession,
  lockDecisionSession,
  decisionClarityDelta,
  setDecisionTranscript,
  setDecisionPsychologySynthesis,
  buildDecisionIndexRow
} from "../../core/decision-model.js";
import {
  DECISION_EMOTION_TAGS,
  DECISION_EMOTION_LABELS,
  DECISION_FACTORS
} from "../../core/decision-factor-taxonomy.js";
import { createAudioDraftStore } from "../../audio/audio-draft-store.js";
import { createDecisionDraftCache } from "../../core/decision-draft-cache.js";
import { createAudioRecorder } from "../../audio/audio-recorder.js";
import { transcribeDecisionAudio } from "../../ai/transcription-service.js";
import { organizeDecisionTranscript } from "../../ai/decision-organizer.js";
import { synthesizeDecisionPsychology } from "../../ai/decision-psychology.js";
import { calculateDecisionThoughtBalance, decisionPsychologyInputHash } from "../../core/decision-psychology.js";
import { DecisionAnalyticsView } from "./decision-analytics-ui.js";

const UI = {
  ru: {
    title: "Разбор решения",
    subtitle: "Не совет. Карта того, как ты сам думаешь перед сделкой.",
    choose: "Что сейчас не получается решить?",
    direction: "Long или Short",
    directionHint: "Хочу войти, но не вижу ясного направления.",
    entry: "Входить или нет",
    entryHint: "Направление уже есть, но сомневаюсь в самом входе.",
    recent: "Последние разборы",
    resume: "Продолжить",
    historyEmpty: "Разборов пока нет",
    context: "Контекст",
    symbol: "Инструмент — необязательно",
    considered: "Какое направление рассматриваешь?",
    clarityBefore: "Насколько сейчас решение тебе понятно?",
    continue: "Продолжить",
    unload: "Выгрузи мысли",
    unloadHint: "Говори свободно. Не пытайся делать вывод или красиво формулировать.",
    record: "Начать запись",
    stop: "Остановить",
    processing: "Расшифровываю запись…",
    savedAudio: "Запись сохранена локально. Можно повторить обработку без новой записи.",
    retryAudio: "Повторить обработку",
    typeFallback: "Или добавь мысль текстом",
    addText: "Добавить",
    transcript: "Что получилось",
    organize: "Разложить по аргументам",
    organizing: "Разбираю только твои слова…",
    manual: "Разложить вручную",
    review: "Проверь структуру",
    reviewHint: "Перенеси или поправь карточку, если смысл считан неверно.",
    addArgument: "Добавить аргумент",
    rate: "Оцени аргументы",
    rateHint: "Вес — логическая важность. Эмоция — насколько эта мысль тебя цепляет.",
    weight: "Вес в решении",
    emotion: "Эмоция",
    decisive: "Главный",
    conditions: "Условия решения",
    longValid: "Что должно произойти, чтобы LONG стал логичным?",
    shortValid: "Что должно произойти, чтобы SHORT стал логичным?",
    entryValid: "Что должно оставаться правдой, чтобы вход имел смысл?",
    invalidation: "Что полностью отменит идею?",
    onePerLine: "Одно условие на строку",
    final: "Перед решением",
    clarityAfter: "Насколько решение стало понятнее сейчас?",
    confidence: "Насколько ты уверен в качестве самого решения?",
    chooseDecision: "Что ты выбираешь?",
    lock: "Зафиксировать решение",
    locked: "Логика до сделки зафиксирована",
    createTrade: "Создать сделку",
    newDecision: "Новый разбор",
    strongest: "Самый весомый аргумент",
    emotional: "Самая эмоциональная мысль",
    psychologyTitle: "Разбор твоего мышления",
    psychologyHint: "Gemini анализирует только структуру твоих мыслей и эмоций. Рынок, график и стратегию он не оценивает.",
    psychologyLoading: "Собираю психологический разбор…",
    psychologyError: "Не удалось собрать психологический разбор.",
    psychologyRetry: "Повторить разбор",
    psychologySkip: "Продолжить без него",
    logicalBalance: "Логический перевес",
    emotionalBalance: "Эмоциональный перевес",
    neutralShare: "Неопределённая часть",
    insufficientBalance: "Недостаточно оценённых аргументов для перевеса",
    neutralOnlyBalance: "Все оценённые мысли сейчас в неопределённости — перевеса между сторонами нет.",
    sideLongThinking: "Как LONG существует в твоих рассуждениях",
    sideShortThinking: "Как SHORT существует в твоих рассуждениях",
    sideForEntryThinking: "Как аргументы ЗА ВХОД существуют в твоих рассуждениях",
    sideAgainstEntryThinking: "Как аргументы ПРОТИВ ВХОДА существуют в твоих рассуждениях",
    neutralThinking: "Где остаётся неопределённость",
    strongThinking: "Что в твоём рассуждении выглядит сильным",
    weakThinking: "Что выглядит слабым или неустойчивым",
    mainConflict: "Главный внутренний конфликт",
    selfQuestion: "Вопрос себе",
    noSymbol: "Без тикера",
    wait: "Ждать",
    skip: "Отказаться",
    enter: "Войти",
    long: "LONG",
    short: "SHORT",
    neutral: "Неопределённость",
    forEntry: "За вход",
    againstEntry: "Против входа",
    saveError: "Не удалось сохранить разбор",
    conflict: "На другом устройстве уже есть более новая версия. Перезагрузи разбор.",
    reload: "Загрузить свежую версию",
    decisionsTab: "Разборы",
    analyticsTab: "Аналитика",
    analyticsLoading: "Собираю аналитику…",
    unrated: "Не оценено",
    chooseFactor: "Категория аргумента",
    draftExists: "У тебя уже есть незавершённый разбор.",
    continueDraft: "Продолжить текущий",
    startNew: "Начать новый",
    cancel: "Отмена",
    syncPending: "Сохраняю в облако…",
    recordingLimit: "Максимум 3 минуты",
    localRecovered: "Восстановлены локальные изменения, которые ещё не успели попасть в облако.",
    deleteDecision: "Удалить разбор",
    deleteTitle: "Удалить разбор?",
    deleteConfirm: "Это действие нельзя отменить. Разбор и прикреплённый скрин будут удалены.",
    deleteAction: "Удалить",
    deleteError: "Не удалось удалить разбор",
    chartShot: "Скрин графика",
    chartShotHint: "Можно добавить один скрин как контекст к этому решению.",
    addChartShot: "Добавить скрин",
    replaceChartShot: "Заменить",
    removeChartShot: "Удалить скрин",
    chartShotLocked: "Скрин зафиксирован вместе с решением",
    chartShotError: "Не удалось сохранить скрин",
    deleted: "Разбор удалён",
    showAllHistory: "Показать всю историю",
    showLessHistory: "Свернуть историю",
    statusDraft: "черновик",
    statusAbandoned: "не завершён",
    statusLocked: "зафиксирован",
    statusLinked: "привязан к сделке",
    statusReviewed: "разобран"
  },
  en: {
    title: "Decision Lab",
    subtitle: "Not advice. A map of how you think before a trade.",
    choose: "What are you trying to decide?",
    direction: "Long or Short",
    directionHint: "I want a trade, but the direction is unclear.",
    entry: "Enter or not",
    entryHint: "I have a direction, but I am unsure about the entry.",
    recent: "Recent decisions",
    resume: "Resume",
    historyEmpty: "No decisions yet",
    context: "Context",
    symbol: "Instrument — optional",
    considered: "Which direction are you considering?",
    clarityBefore: "How clear is the decision right now?",
    continue: "Continue",
    unload: "Unload your thoughts",
    unloadHint: "Speak freely. Do not try to conclude or structure anything.",
    record: "Start recording",
    stop: "Stop",
    processing: "Transcribing…",
    savedAudio: "Recording is saved locally. You can retry without recording again.",
    retryAudio: "Retry processing",
    typeFallback: "Or add a thought as text",
    addText: "Add",
    transcript: "Transcript",
    organize: "Structure my thoughts",
    organizing: "Structuring only your words…",
    manual: "Continue manually",
    review: "Check the structure",
    reviewHint: "Move or edit a card if its meaning was read incorrectly.",
    addArgument: "Add argument",
    rate: "Rate the arguments",
    rateHint: "Weight = logical importance. Emotion = how strongly the thought pulls you.",
    weight: "Decision weight",
    emotion: "Emotion",
    decisive: "Key",
    conditions: "Decision conditions",
    longValid: "What would make LONG logical?",
    shortValid: "What would make SHORT logical?",
    entryValid: "What must remain true for the entry to make sense?",
    invalidation: "What fully invalidates the idea?",
    onePerLine: "One condition per line",
    final: "Before the decision",
    clarityAfter: "How clear is the decision now?",
    confidence: "How confident are you in the quality of this decision?",
    chooseDecision: "What do you choose?",
    lock: "Lock decision",
    locked: "Pre-trade logic is locked",
    createTrade: "Create trade",
    newDecision: "New decision",
    strongest: "Strongest logical argument",
    emotional: "Most emotional thought",
    psychologyTitle: "Your reasoning synthesis",
    psychologyHint: "Gemini analyzes only the structure of your own thoughts and emotions. It does not evaluate the market, chart, or strategy.",
    psychologyLoading: "Building psychological synthesis…",
    psychologyError: "Could not build the psychological synthesis.",
    psychologyRetry: "Retry synthesis",
    psychologySkip: "Continue without it",
    logicalBalance: "Logical balance",
    emotionalBalance: "Emotional balance",
    neutralShare: "Uncertain share",
    insufficientBalance: "Not enough rated arguments to calculate a balance",
    neutralOnlyBalance: "All rated thoughts are currently uncertain, so there is no balance between the two sides yet.",
    sideLongThinking: "How LONG exists in your reasoning",
    sideShortThinking: "How SHORT exists in your reasoning",
    sideForEntryThinking: "How FOR ENTRY exists in your reasoning",
    sideAgainstEntryThinking: "How AGAINST ENTRY exists in your reasoning",
    neutralThinking: "Where uncertainty remains",
    strongThinking: "What is internally strong in your reasoning",
    weakThinking: "What looks weak or unstable",
    mainConflict: "Main internal conflict",
    selfQuestion: "Question to yourself",
    noSymbol: "No ticker",
    wait: "WAIT",
    skip: "SKIP",
    enter: "ENTER",
    long: "LONG",
    short: "SHORT",
    neutral: "Uncertainty",
    forEntry: "For entry",
    againstEntry: "Against entry",
    saveError: "Could not save decision",
    conflict: "A newer version exists on another device. Reload this decision.",
    reload: "Load latest version",
    decisionsTab: "Decisions",
    analyticsTab: "Analytics",
    analyticsLoading: "Building analytics…",
    unrated: "Not rated",
    chooseFactor: "Argument category",
    draftExists: "You already have an unfinished decision.",
    continueDraft: "Continue current",
    startNew: "Start new",
    cancel: "Cancel",
    syncPending: "Syncing to cloud…",
    recordingLimit: "Maximum 3 minutes",
    localRecovered: "Recovered local changes that had not reached the cloud yet.",
    deleteDecision: "Delete decision",
    deleteTitle: "Delete decision?",
    deleteConfirm: "This cannot be undone. The decision and attached chart screenshot will be deleted.",
    deleteAction: "Delete",
    deleteError: "Could not delete decision",
    chartShot: "Chart screenshot",
    chartShotHint: "Attach one chart screenshot as context for this decision.",
    addChartShot: "Add screenshot",
    replaceChartShot: "Replace",
    removeChartShot: "Remove screenshot",
    chartShotLocked: "Screenshot locked with this decision",
    chartShotError: "Could not save screenshot",
    deleted: "Decision deleted",
    showAllHistory: "Show full history",
    showLessHistory: "Show less",
    statusDraft: "draft",
    statusAbandoned: "unfinished",
    statusLocked: "locked",
    statusLinked: "linked to trade",
    statusReviewed: "reviewed"
  }
};

const pct = (v) => v == null ? "—" : `${Math.max(0, Math.min(100, Number(v) || 0))}%`;
const lines = (text) => String(text || "").split(/\n+/).map((s) => s.trim()).filter(Boolean).slice(0, 8);
const linesText = (arr) => (Array.isArray(arr) ? arr : []).join("\n");
const sideColor = (side, accent) => side === "long" || side === "for_entry" ? WIN : side === "short" || side === "against_entry" ? LOSS : accent;

function DecisionChoiceButton({ id, label, selected, onClick, accent, size = "chip" }) {
  const large = size === "large";
  const medium = size === "medium";
  const geometry = large
    ? "w-full h-12 rounded-[11px] px-3 text-[12px]"
    : medium
      ? "w-full h-10 rounded-[10px] px-3 text-[12px]"
      : "min-h-8 rounded-[10px] px-3 py-1.5 text-[11px]";
  const color = sideColor(id, accent);
  return jsx("button", {
    type: "button",
    onClick,
    className: `${geometry} transition-all active:scale-[0.985]`,
    style: {
      border: `1px solid ${selected ? color + "66" : BASE.line}`,
      background: selected ? `${color}0e` : "transparent",
      color: selected ? color : BASE.inkDim,
      fontFamily: "var(--font-display)",
      fontWeight: selected ? 600 : 520,
      letterSpacing: id === "long" || id === "short" ? "0.015em" : "-0.005em"
    },
    children: label
  });
}

function Panel({ children, className = "" }) {
  return jsx("div", {
    className: `rounded-[18px] p-5 ${className}`,
    style: { background: "#070708", border: "1px solid #18181C" },
    children
  });
}

function SectionTitle({ children }) {
  return jsx("div", { className: "text-[12px] mb-3", style: { color: BASE.inkDim, fontWeight: 550, letterSpacing: "-0.01em" }, children });
}

function PrimaryButton({ children, onClick, disabled = false, icon: Icon = null }) {
  return jsxs("button", {
    type: "button",
    onClick,
    disabled,
    className: "w-full h-[50px] rounded-[13px] flex items-center justify-center gap-2 text-[14px] transition-all active:scale-[0.985]",
    style: { background: disabled ? BASE.surface2 : BASE.ink, color: disabled ? BASE.inkFaint : "#050505", fontWeight: 650, opacity: disabled ? 0.7 : 1 },
    children: [Icon && jsx(Icon, { size: 16 }), children]
  });
}

function StepHeader({ title, subtitle, onBack, onDelete, deleteLabel = "Delete" }) {
  return jsxs("div", { className: "mb-7", children: [
    jsxs("div", { className: "flex items-center justify-between gap-3 mb-3", children: [
      onBack ? jsx("button", { type: "button", onClick: onBack, className: "w-9 h-9 -ml-2 rounded-[10px] flex items-center justify-center", style: { color: BASE.inkDim }, children: jsx(ChevronLeft, { size: 18 }) }) : jsx("span", {}),
      onDelete && jsx("button", { type: "button", onClick: onDelete, className: "h-9 px-2.5 rounded-[10px] flex items-center gap-1.5 text-[11px]", style: { color: LOSS, border: `1px solid ${LOSS}33`, background: `${LOSS}08` }, title: deleteLabel, children: [jsx(Trash2, { size: 14 }), jsx("span", { className: "hidden sm:inline", children: deleteLabel })] })
    ] }),
    jsx("h2", { className: "text-[24px] leading-[1.15] mb-2", style: { color: BASE.ink, fontWeight: 650, letterSpacing: "-0.025em" }, children: title }),
    subtitle && jsx("p", { className: "text-[13px] leading-[1.55]", style: { color: BASE.inkDim }, children: subtitle })
  ] });
}

function SliderField({ label, value, rated = true, onChange, accent, hintLeft = "0", hintRight = "100", unratedLabel = "—" }) {
  const safeValue = value == null ? 50 : value;
  return jsxs("div", { className: "mb-5", children: [
    jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      jsx("span", { className: "text-[12px]", style: { color: BASE.inkDim }, children: label }),
      jsx("span", { className: "text-[13px]", style: { color: rated ? BASE.ink : BASE.inkFaint, fontFamily: "var(--font-mono)", fontWeight: 600 }, children: rated ? pct(value) : unratedLabel })
    ] }),
    jsx("input", { type: "range", min: 0, max: 100, step: 5, value: safeValue, onChange: (e) => onChange(Number(e.target.value)), className: "w-full", style: { accentColor: accent } }),
    jsxs("div", { className: "flex justify-between mt-1 text-[9px]", style: { color: BASE.inkFaint }, children: [jsx("span", { children: hintLeft }), jsx("span", { children: hintRight })] })
  ] });
}

function AppSelect({ value, onChange, options = [] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((option) => option.value === value) || options[0] || null;

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return jsxs("div", { ref: rootRef, className: "relative", children: [
    jsxs("button", {
      type: "button",
      onClick: () => setOpen((current) => !current),
      className: "w-full min-h-10 rounded-[10px] px-3 flex items-center justify-between gap-3 text-left transition-colors",
      style: { border: `1px solid ${open ? BASE.inkFaint : BASE.line}`, background: open ? "#0B0B0D" : "#080809", color: BASE.inkDim },
      "aria-expanded": open,
      children: [
        jsx("span", { className: "text-[11px] leading-[1.35]", children: selected?.label || "—" }),
        jsx(ChevronDown, { size: 14, className: `shrink-0 transition-transform ${open ? "rotate-180" : ""}`, style: { color: BASE.inkFaint } })
      ]
    }),
    open && jsx("div", {
      className: "absolute z-50 left-0 right-0 mt-1.5 max-h-[280px] overflow-y-auto rounded-[12px] p-1.5",
      style: { background: "#0A0A0C", border: `1px solid ${BASE.line}`, boxShadow: "0 18px 50px rgba(0,0,0,.55)" },
      children: options.map((option) => {
        const active = option.value === value;
        return jsxs("button", {
          type: "button",
          onClick: () => { onChange(option.value); setOpen(false); },
          className: "w-full min-h-9 rounded-[8px] px-2.5 py-2 flex items-center justify-between gap-3 text-left",
          style: { background: active ? BASE.surface2 : "transparent", color: active ? BASE.ink : BASE.inkDim },
          children: [
            jsx("span", { className: "text-[11px] leading-[1.35]", children: option.label }),
            active ? jsx(Check, { size: 13, style: { color: BASE.ink } }) : jsx("span", { className: "w-[13px]" })
          ]
        }, option.value);
      })
    })
  ] });
}

function ThoughtBalanceMeter({ title, balance, leftSide, rightSide, leftLabel, rightLabel, accent, l }) {
  if (!balance?.available) {
    const neutralOnly = Number(balance?.ratedCount || 0) > 0
      && Number(balance?.leftTotal || 0) <= 0
      && Number(balance?.rightTotal || 0) <= 0
      && Number(balance?.neutralTotal || 0) > 0;
    return jsxs("div", { className: "py-3", children: [
      jsx("div", { className: "text-[11px] mb-1.5", style: { color: BASE.inkDim }, children: title }),
      jsx("div", { className: "text-[11px] leading-[1.5]", style: { color: BASE.inkFaint }, children: neutralOnly ? l.neutralOnlyBalance : l.insufficientBalance })
    ] });
  }
  const leftPct = Math.max(0, Math.min(100, Number(balance.leftPct) || 0));
  const rightPct = Math.max(0, Math.min(100, Number(balance.rightPct) || 0));
  return jsxs("div", { className: "py-3", children: [
    jsxs("div", { className: "flex items-center justify-between gap-3 mb-2", children: [
      jsx("div", { className: "text-[11px]", style: { color: BASE.inkDim }, children: title }),
      jsx("div", { className: "text-[10px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: balance.neutralSharePct != null && balance.neutralSharePct > 0 ? `${l.neutralShare}: ${balance.neutralSharePct}%` : "" })
    ] }),
    jsxs("div", { className: "flex items-center justify-between text-[11px] mb-1.5", children: [
      jsx("span", { style: { color: sideColor(leftSide, accent), fontWeight: 650 }, children: `${leftLabel} ${leftPct}%` }),
      jsx("span", { style: { color: sideColor(rightSide, accent), fontWeight: 650 }, children: `${rightPct}% ${rightLabel}` })
    ] }),
    jsxs("div", { className: "h-2 rounded-full overflow-hidden flex", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
      jsx("div", { style: { width: `${leftPct}%`, background: sideColor(leftSide, accent), opacity: 0.8 } }),
      jsx("div", { style: { width: `${rightPct}%`, background: sideColor(rightSide, accent), opacity: 0.8 } })
    ] })
  ] });
}

function PsychologySynthesisCard({ synthesis, balance, accent, lang, l }) {
  if (!synthesis || !balance) return null;
  const entry = balance.mode === "entry";
  const leftLabel = entry ? (lang === "en" ? "FOR" : "ЗА") : "LONG";
  const rightLabel = entry ? (lang === "en" ? "AGAINST" : "ПРОТИВ") : "SHORT";
  const leftHeading = entry ? l.sideForEntryThinking : l.sideLongThinking;
  const rightHeading = entry ? l.sideAgainstEntryThinking : l.sideShortThinking;
  const textBlock = (title, text, strong = false) => text ? jsxs("div", { className: "pt-4", style: { borderTop: `1px solid ${BASE.line}` }, children: [
    jsx("div", { className: "text-[11px] mb-1.5", style: { color: strong ? BASE.ink : BASE.inkFaint, fontWeight: strong ? 600 : 500 }, children: title }),
    jsx("div", { className: "text-[13px] leading-[1.65]", style: { color: BASE.inkDim }, children: text })
  ] }) : null;
  return jsxs(Panel, { className: "mb-3", children: [
    jsxs("div", { className: "flex items-start gap-3 mb-1", children: [
      jsx("div", { className: "w-8 h-8 rounded-[10px] shrink-0 flex items-center justify-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: jsx(Brain, { size: 15 }) }),
      jsxs("div", { children: [
        jsx("div", { className: "text-[15px]", style: { color: BASE.ink, fontWeight: 650 }, children: l.psychologyTitle }),
        jsx("div", { className: "text-[11px] leading-[1.5] mt-1", style: { color: BASE.inkFaint }, children: l.psychologyHint })
      ] })
    ] }),
    jsx(ThoughtBalanceMeter, { title: l.logicalBalance, balance: balance.logical, leftSide: balance.sides.left, rightSide: balance.sides.right, leftLabel, rightLabel, accent, l }),
    jsx(ThoughtBalanceMeter, { title: l.emotionalBalance, balance: balance.emotional, leftSide: balance.sides.left, rightSide: balance.sides.right, leftLabel, rightLabel, accent, l }),
    jsx("div", { className: "grid gap-3 sm:grid-cols-2 mt-1", children: [
      jsxs("div", { className: "rounded-[13px] p-3.5", style: { background: "#050506", border: `1px solid ${BASE.line}` }, children: [jsx("div", { className: "text-[11px] mb-1.5", style: { color: sideColor(balance.sides.left, accent), fontWeight: 600 }, children: leftHeading }), jsx("div", { className: "text-[13px] leading-[1.6]", style: { color: BASE.inkDim }, children: synthesis.sideASummary })] }),
      jsxs("div", { className: "rounded-[13px] p-3.5", style: { background: "#050506", border: `1px solid ${BASE.line}` }, children: [jsx("div", { className: "text-[11px] mb-1.5", style: { color: sideColor(balance.sides.right, accent), fontWeight: 600 }, children: rightHeading }), jsx("div", { className: "text-[13px] leading-[1.6]", style: { color: BASE.inkDim }, children: synthesis.sideBSummary })] })
    ] }),
    synthesis.neutralSummary && textBlock(l.neutralThinking, synthesis.neutralSummary),
    textBlock(l.strongThinking, synthesis.strongPattern, true),
    textBlock(l.weakThinking, synthesis.weakPattern),
    textBlock(l.mainConflict, synthesis.mainConflict, true),
    synthesis.selfQuestion && jsxs("div", { className: "mt-4 rounded-[13px] p-4", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [jsx("div", { className: "text-[10px] mb-1.5", style: { color: BASE.inkFaint }, children: l.selfQuestion }), jsx("div", { className: "text-[14px] leading-[1.55]", style: { color: BASE.ink, fontWeight: 550 }, children: synthesis.selfQuestion })] })
  ] });
}

function DecisionArgumentCard({ arg, mode, accent, lang, onChange, onDelete, rating = false, decisiveCount = 0, notify }) {
  const l = UI[lang] || UI.ru;
  const sides = mode === "entry"
    ? [["for_entry", l.forEntry], ["against_entry", l.againstEntry], ["neutral", l.neutral]]
    : [["long", l.long], ["short", l.short], ["neutral", l.neutral]];
  const emotionLabel = arg.emotionTag ? DECISION_EMOTION_LABELS[arg.emotionTag]?.[lang] || arg.emotionTag : null;
  return jsxs(Panel, { className: "mb-2.5", children: [
    jsxs("div", { className: "flex items-start gap-2", children: [
      jsx("textarea", {
        value: arg.normalizedText,
        rows: Math.min(3, Math.max(1, Math.ceil((arg.normalizedText?.length || 1) / 38))),
        onChange: (e) => {
          const nextText = e.target.value;
          const meaningChanged = nextText.trim() !== String(arg.normalizedText || "").trim();
          onChange({
            ...arg,
            normalizedText: nextText,
            userEdited: true,
            ...(meaningChanged && arg.factorId !== "other" ? { factorId: "other", factorGroup: "other", factorLabel: null } : {})
          });
        },
        className: "flex-1 bg-transparent outline-none resize-none text-[13px] leading-relaxed",
        style: { color: BASE.ink }
      }),
      jsx("button", { type: "button", onClick: onDelete, className: "w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0", style: { color: BASE.inkFaint }, children: jsx(Trash2, { size: 14 }) })
    ] }),
    jsx("div", { className: "flex flex-wrap gap-1.5 mt-2", children: sides.map(([id, label]) => jsx(DecisionChoiceButton, {
      id,
      label,
      selected: arg.side === id,
      onClick: () => onChange({ ...arg, side: id, userEdited: true }),
      accent
    }, id)) }),
    jsxs("div", { className: "mt-2", children: [
      jsx("div", { className: "text-[10px] mb-1", style: { color: BASE.inkFaint }, children: l.chooseFactor }),
      jsx(AppSelect, {
        value: arg.factorId || "other",
        onChange: (id) => {
          const row = DECISION_FACTORS[id] || DECISION_FACTORS.other;
          onChange({ ...arg, factorId: id, factorGroup: row.group, factorLabel: null, userEdited: true });
        },
        options: Object.entries(DECISION_FACTORS).map(([id, row]) => ({ value: id, label: row[lang === "en" ? "en" : "ru"] }))
      })
    ] }),
    rating && jsxs("div", { className: "mt-2 text-[9px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [arg.weightRated ? `${arg.weight}%` : "—", " · ", arg.emotionRated ? `${arg.emotionIntensity}%` : "—", emotionLabel ? ` · ${emotionLabel}` : ""] }),
    rating && jsxs("div", { className: "mt-4 pt-3", style: { borderTop: `1px solid ${BASE.line}` }, children: [
      jsx(SliderField, { label: l.weight, value: arg.weight, rated: arg.weightRated, unratedLabel: l.unrated, onChange: (value) => onChange({ ...arg, weight: value, weightRated: true, userEdited: true }), accent, hintLeft: lang === "en" ? "doesn't matter" : "не влияет", hintRight: lang === "en" ? "defines decision" : "определяет решение" }),
      jsx(SliderField, { label: l.emotion, value: arg.emotionIntensity, rated: arg.emotionRated, unratedLabel: l.unrated, onChange: (value) => onChange({ ...arg, emotionIntensity: value, emotionRated: true, emotionTag: value <= 20 ? "calm" : arg.emotionTag === "calm" ? null : arg.emotionTag, userEdited: true }), accent, hintLeft: lang === "en" ? "calm" : "спокойно", hintRight: lang === "en" ? "takes over" : "захватывает" }),
      arg.emotionRated && arg.emotionIntensity > 20 && jsxs("div", { className: "mb-4", children: [
        jsx("div", { className: "text-[11px] mb-2", style: { color: BASE.inkFaint }, children: lang === "en" ? "Dominant emotion" : "Доминирующая эмоция" }),
        jsx("div", { className: "flex flex-wrap gap-1.5", children: DECISION_EMOTION_TAGS.filter((tag) => tag !== "calm").map((tag) => jsx("button", {
          type: "button",
          onClick: () => onChange({ ...arg, emotionTag: tag, userEdited: true }),
          className: "px-2.5 py-1.5 rounded-full text-[10px]",
          style: { border: `1px solid ${arg.emotionTag === tag ? accent + "55" : BASE.line}`, color: arg.emotionTag === tag ? accent : BASE.inkDim, background: arg.emotionTag === tag ? `${accent}0d` : "transparent" },
          children: DECISION_EMOTION_LABELS[tag]?.[lang] || tag
        }, tag)) })
      ] }),
      jsx("button", {
        type: "button",
        onClick: () => {
          if (!arg.isDecisive && decisiveCount >= 3) {
            notify?.(lang === "en" ? "Up to 3 key arguments" : "Можно выбрать максимум 3 главных аргумента");
            return;
          }
          onChange({ ...arg, isDecisive: !arg.isDecisive, userEdited: true });
        },
        className: "h-9 px-3 rounded-[10px] flex items-center gap-2 text-[11px]",
        style: { border: `1px solid ${arg.isDecisive ? accent + "55" : BASE.line}`, color: arg.isDecisive ? accent : BASE.inkDim, background: arg.isDecisive ? `${accent}0d` : "transparent" },
        children: [jsx(Check, { size: 13 }), l.decisive]
      })
    ] })
  ] });
}

function ModeHome({ index, activeDraft, onStart, onOpen, onDelete, accent, lang, startPromptMode, onResumeDraft, onConfirmNew, onCancelNew }) {
  const l = UI[lang] || UI.ru;
  const [showAllHistory, setShowAllHistory] = useState(false);
  const historyRows = (index?.sessions || []).filter((row) => row.id !== activeDraft?.id);
  const visibleHistoryRows = showAllHistory ? historyRows : historyRows.slice(0, 8);
  const statusLabel = (status) => ({
    draft: l.statusDraft,
    abandoned: l.statusAbandoned,
    locked: l.statusLocked,
    linked: l.statusLinked,
    reviewed: l.statusReviewed
  }[status] || status);
  return jsxs("div", { children: [
    jsxs("div", { className: "mb-7", children: [
      jsxs("div", { className: "flex items-center gap-2 mb-2", children: [jsx(Brain, { size: 18, style: { color: accent } }), jsx("h2", { className: "text-[24px]", style: { color: BASE.ink, fontWeight: 650, letterSpacing: "-0.025em" }, children: l.title })] }),
      jsx("p", { className: "text-[14px] leading-[1.55]", style: { color: BASE.inkDim }, children: l.subtitle })
    ] }),
    activeDraft && jsxs("button", {
      type: "button", onClick: () => onOpen(activeDraft.id), className: "w-full text-left rounded-[16px] p-4 mb-4 transition-all active:scale-[0.99]",
      style: { background: `${accent}0b`, border: `1px solid ${accent}35` },
      children: [
        jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          jsxs("div", { children: [jsx("div", { className: "text-[11px] mb-1", style: { color: accent }, children: lang === "en" ? "Unfinished decision" : "Незавершённый разбор" }), jsx("div", { className: "text-sm", style: { color: BASE.ink }, children: activeDraft.symbol || l.noSymbol })] }),
          jsxs("span", { className: "flex items-center gap-1 text-[11px]", style: { color: accent }, children: [l.resume, jsx(ChevronRight, { size: 14 })] })
        ] })
      ]
    }),
    startPromptMode && activeDraft && jsxs(Panel, { className: "mb-4", children: [
      jsx("p", { className: "text-[12px] leading-relaxed mb-3", style: { color: BASE.ink }, children: l.draftExists }),
      jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        jsx("button", { type: "button", onClick: onResumeDraft, className: "h-10 rounded-[10px] text-[11px]", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: l.continueDraft }),
        jsx("button", { type: "button", onClick: onConfirmNew, className: "h-10 rounded-[10px] text-[11px]", style: { border: `1px solid ${accent}55`, color: accent, background: `${accent}0b` }, children: l.startNew })
      ] }),
      jsx("button", { type: "button", onClick: onCancelNew, className: "w-full h-8 mt-2 text-[10px]", style: { color: BASE.inkFaint }, children: l.cancel })
    ] }),
    jsx(SectionTitle, { children: l.choose }),
    jsxs("div", { className: "grid md:grid-cols-2 gap-3 mb-7", children: [
      jsxs("button", { type: "button", onClick: () => onStart("direction"), className: "text-left rounded-[18px] p-5 min-h-[124px] transition-all active:scale-[0.99]", style: { background: "#070708", border: "1px solid #18181C" }, children: [jsx("div", { className: "text-[16px] mb-2", style: { color: BASE.ink, fontWeight: 600 }, children: l.direction }), jsx("p", { className: "text-[12px] leading-[1.5]", style: { color: BASE.inkDim }, children: l.directionHint }), jsx(ChevronRight, { size: 15, className: "mt-3", style: { color: accent } })] }),
      jsxs("button", { type: "button", onClick: () => onStart("entry"), className: "text-left rounded-[18px] p-5 min-h-[124px] transition-all active:scale-[0.99]", style: { background: "#070708", border: "1px solid #18181C" }, children: [jsx("div", { className: "text-[16px] mb-2", style: { color: BASE.ink, fontWeight: 600 }, children: l.entry }), jsx("p", { className: "text-[12px] leading-[1.5]", style: { color: BASE.inkDim }, children: l.entryHint }), jsx(ChevronRight, { size: 15, className: "mt-3", style: { color: accent } })] })
    ] }),
    jsx(SectionTitle, { children: l.recent }),
    !historyRows.length ? jsx("div", { className: "text-[12px] py-3", style: { color: BASE.inkFaint }, children: l.historyEmpty }) : jsxs("div", { children: [
      jsx("div", { className: "flex flex-col", children: visibleHistoryRows.map((row) => jsxs("div", { className: "w-full flex items-center gap-2", style: { borderBottom: `1px solid ${BASE.line}` }, children: [
        jsxs("button", { type: "button", disabled: row.status === "abandoned", onClick: row.status === "abandoned" ? undefined : () => onOpen(row.id), className: "min-w-0 flex-1 flex items-center justify-between py-3 text-left", style: { opacity: row.status === "abandoned" ? 0.72 : 1 }, children: [
          jsxs("div", { className: "min-w-0", children: [jsx("div", { className: "text-[13px] truncate", style: { color: BASE.ink }, children: row.symbol || l.noSymbol }), jsx("div", { className: "text-[11px] mt-1", style: { color: BASE.inkFaint }, children: `${row.mode === "entry" ? l.entry : l.direction} · ${statusLabel(row.status)}` })] }),
          jsxs("div", { className: "flex items-center gap-2", children: [row.finalDecision && jsx("span", { className: "text-[10px] uppercase", style: { color: BASE.inkDim, fontFamily: "var(--font-mono)" }, children: row.finalDecision }), row.status !== "abandoned" && jsx(ChevronRight, { size: 14, style: { color: BASE.inkFaint } })] })
        ] }),
        jsx("button", { type: "button", onClick: () => onDelete(row), className: "w-9 h-9 shrink-0 rounded-[10px] flex items-center justify-center", style: { color: row.status === "abandoned" ? LOSS : BASE.inkFaint }, "aria-label": l.deleteDecision, title: l.deleteDecision, children: jsx(Trash2, { size: 14 }) })
      ] }, row.id)) }),
      historyRows.length > 8 && jsx("button", { type: "button", onClick: () => setShowAllHistory((value) => !value), className: "w-full h-10 mt-2 text-[11px]", style: { color: BASE.inkDim }, children: showAllHistory ? l.showLessHistory : `${l.showAllHistory} · ${historyRows.length}` })
    ] })
  ] });
}

export function DecisionLab({ userId, store, mediaStore, accent, lang = "ru", notify, onCreateTrade, onBeforeDeleteSession, trades = [] }) {
  const l = UI[lang] || UI.ru;
  const [index, setIndex] = useState({ sessions: [] });
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [manualText, setManualText] = useState("");
  const [newArgText, setNewArgText] = useState("");
  const [organizing, setOrganizing] = useState(false);
  const [organizeError, setOrganizeError] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordingSec, setRecordingSec] = useState(0);
  const [voiceBusy, setVoiceBusy] = useState(false);
  const [pendingAudio, setPendingAudio] = useState(null);
  const [homeView, setHomeView] = useState("decisions");
  const [analyticsSessions, setAnalyticsSessions] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [startPromptMode, setStartPromptMode] = useState(null);
  const [conditionDrafts, setConditionDrafts] = useState({ sessionId: null, first: "", second: "" });
  const [chartMedia, setChartMedia] = useState(null);
  const [chartBusy, setChartBusy] = useState(false);
  const [psychologyBusy, setPsychologyBusy] = useState(false);
  const [psychologyError, setPsychologyError] = useState(null);
  const [psychologySkipKey, setPsychologySkipKey] = useState(null);

  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  const stopRecordingRef = useRef(null);
  const activeRef = useRef(null);
  const cloudRef = useRef(null);
  const editSeqRef = useRef(0);
  const lastSyncedSeqRef = useRef(0);
  const syncTimerRef = useRef(null);
  const saveChainRef = useRef(Promise.resolve());
  const organizerGenerationRef = useRef(0);
  const psychologyGenerationRef = useRef(0);
  const deletedSessionIdsRef = useRef(new Set());
  const recordingChunksRef = useRef([]);
  const recordingAudioIdRef = useRef(null);
  const recordingSessionIdRef = useRef(null);
  const chartInputRef = useRef(null);
  const audioStore = useMemo(() => createAudioDraftStore(), []);
  const draftCache = useMemo(() => createDecisionDraftCache(), []);

  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    psychologyGenerationRef.current += 1;
    setPsychologyBusy(false);
    setPsychologyError(null);
    setPsychologySkipKey(null);
  }, [active?.id]);

  useEffect(() => {
    if (!active?.id || active.status !== "draft" || active.flowStep !== "conditions") return;
    const currentConditions = active.conditions || {};
    const firstKey = active.mode === "entry" ? "entryRemainsValidIf" : "longBecomesValidIf";
    const secondKey = active.mode === "entry" ? "invalidation" : "shortBecomesValidIf";
    setConditionDrafts({
      sessionId: active.id,
      first: linesText(currentConditions[firstKey]),
      second: linesText(currentConditions[secondKey])
    });
  }, [active?.id, active?.flowStep, active?.mode]);

  const upsertIndex = (session) => {
    if (!session) return;
    const row = buildDecisionIndexRow(session);
    setIndex((prev) => ({
      ...(prev || { sessions: [] }),
      sessions: [row, ...((prev?.sessions || []).filter((item) => item.id !== row.id))]
        .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
    }));
  };

  const refreshIndex = async () => {
    if (!userId || !store) return;
    const next = await store.loadIndex(userId);
    setIndex(next);
    return next;
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    refreshIndex().catch((e) => { if (!cancelled) setError(e); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId, store]);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearTimeout(syncTimerRef.current);
    recorderRef.current?.cancel?.();
  }, []);

  useEffect(() => {
    if (!active?.id) { setPendingAudio(null); return; }
    let cancelled = false;
    audioStore.listForSession(active.id).then((rows) => {
      if (!cancelled) setPendingAudio(rows.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))[0] || null);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [active?.id, audioStore]);

  useEffect(() => {
    if (!active?.id || !mediaStore || !userId) { setChartMedia(null); setChartBusy(false); return; }
    let cancelled = false;
    setChartBusy(true);
    mediaStore.loadForSession(userId, active.id).then((media) => {
      if (!cancelled) setChartMedia(media || null);
    }).catch(() => {
      if (!cancelled) setChartMedia(null);
    }).finally(() => {
      if (!cancelled) setChartBusy(false);
    });
    return () => { cancelled = true; };
  }, [active?.id, mediaStore, userId]);

  const syncDraft = (candidate = activeRef.current, capturedSeq = editSeqRef.current) => {
    if (!candidate || candidate.status !== "draft" || !userId || !store) return Promise.resolve(null);
    const sessionId = candidate.id;
    if (deletedSessionIdsRef.current.has(sessionId)) return Promise.resolve(null);
    const operation = saveChainRef.current.then(async () => {
      const latestCloud = cloudRef.current?.id === sessionId ? cloudRef.current : candidate;
      const toSave = normalizeDecisionSession({
        ...candidate,
        persistenceRevision: latestCloud?.persistenceRevision || 0,
        persistenceUpdatedAt: latestCloud?.persistenceUpdatedAt ?? null
      });
      setCloudSyncing(true);
      try {
        const committed = await store.saveSession(userId, toSave);
        cloudRef.current = committed;
        lastSyncedSeqRef.current = Math.max(lastSyncedSeqRef.current, capturedSeq);
        upsertIndex(committed);
        const current = activeRef.current;
        if (current?.id === committed.id && current.status === "draft") {
          const merged = editSeqRef.current === capturedSeq
            ? committed
            : normalizeDecisionSession({
                ...current,
                persistenceRevision: committed.persistenceRevision,
                persistenceUpdatedAt: committed.persistenceUpdatedAt
              });
          activeRef.current = merged;
          setActive(merged);
          draftCache.save(userId, merged, committed.persistenceRevision);
        }
        return committed;
      } catch (e) {
        setError(e);
        if (e?.message === "decision_revision_conflict") notify?.(l.conflict);
        else notify?.(`${l.saveError}: ${e?.message || e}`);
        throw e;
      } finally {
        setCloudSyncing(false);
      }
    });
    saveChainRef.current = operation.catch(() => null);
    return operation;
  };

  const scheduleDraftSync = (session, seq) => {
    clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => syncDraft(session, seq).catch(() => {}), 650);
  };

  const applyLocal = (candidate, { sync = true } = {}) => {
    const normalized = normalizeDecisionSession(candidate);
    if (!normalized) return null;
    editSeqRef.current += 1;
    const seq = editSeqRef.current;
    activeRef.current = normalized;
    setActive(normalized);
    if (normalized.status === "draft" && userId) {
      const baseRevision = cloudRef.current?.id === normalized.id ? cloudRef.current.persistenceRevision : normalized.persistenceRevision;
      draftCache.save(userId, normalized, baseRevision);
      if (sync) scheduleDraftSync(normalized, seq);
    }
    return normalized;
  };

  const mutateActive = (updater, options) => {
    const current = activeRef.current;
    if (!current) return null;
    const next = typeof updater === "function" ? updater(current) : updater;
    return applyLocal(next, options);
  };

  const openAnalytics = async () => {
    setHomeView("analytics");
    if (!store?.loadAllSessions || !userId) return;
    setAnalyticsLoading(true);
    try {
      setAnalyticsSessions(await store.loadAllSessions(userId, { concurrency: 6, statuses: ["locked", "linked", "reviewed"] }));
    } catch (_) {
      notify?.(lang === "en" ? "Could not load Decision analytics" : "Не удалось загрузить аналитику решений");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const activeDraft = index.sessions?.find((row) => row.status === "draft") || null;

  const createFreshDraft = async (mode) => {
    const draft = createDecisionSession({ mode });
    setSaving(true);
    setError(null);
    try {
      const committed = await store.saveSession(userId, draft);
      cloudRef.current = committed;
      editSeqRef.current = 0;
      lastSyncedSeqRef.current = 0;
      activeRef.current = committed;
      setActive(committed);
      upsertIndex(committed);
      draftCache.save(userId, committed, committed.persistenceRevision);
      return committed;
    } catch (e) {
      setError(e);
      notify?.(`${l.saveError}: ${e?.message || e}`);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const start = async (mode) => {
    if (activeDraft) {
      setStartPromptMode(mode);
      return;
    }
    await createFreshDraft(mode);
  };

  const open = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const cloud = await store.loadSession(userId, id);
      if (!cloud) throw new Error("decision_session_missing");
      cloudRef.current = cloud;
      editSeqRef.current = 0;
      lastSyncedSeqRef.current = 0;
      let chosen = cloud;
      const local = draftCache.load(userId, id);
      if (cloud.status === "draft" && local?.session) {
        if (local.baseRevision === cloud.persistenceRevision && local.session.updatedAt > cloud.updatedAt) {
          chosen = normalizeDecisionSession({
            ...local.session,
            persistenceRevision: cloud.persistenceRevision,
            persistenceUpdatedAt: cloud.persistenceUpdatedAt
          });
          editSeqRef.current = 1;
          notify?.(l.localRecovered);
          scheduleDraftSync(chosen, 1);
        } else if (local.baseRevision !== cloud.persistenceRevision && local.session.updatedAt > cloud.updatedAt) {
          setError(new Error("decision_revision_conflict"));
        }
      }
      activeRef.current = chosen;
      setActive(chosen);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const confirmStartNew = async () => {
    const mode = startPromptMode;
    setStartPromptMode(null);
    if (!mode || !activeDraft) return;
    setSaving(true);
    try {
      clearTimeout(syncTimerRef.current);
      deletedSessionIdsRef.current.add(activeDraft.id);
      await saveChainRef.current.catch(() => null);
      await store.deleteSession(userId, activeDraft.id);
      setIndex((prev) => ({ ...(prev || { sessions: [] }), sessions: (prev?.sessions || []).filter((row) => row.id !== activeDraft.id) }));
      draftCache.remove(userId, activeDraft.id);
      await audioStore.clearForSession(activeDraft.id).catch(() => {});
      if (mediaStore) await mediaStore.deleteForSession(userId, activeDraft.id).catch(() => {});
      if (activeRef.current?.id === activeDraft.id) { activeRef.current = null; setActive(null); }
      cloudRef.current = null;
      await createFreshDraft(mode);
    } catch (e) {
      // The draft still exists when deletion fails. Re-enable its normal autosync path; otherwise
      // this session would be treated as deleted until the whole Decision Lab remounts.
      deletedSessionIdsRef.current.delete(activeDraft.id);
      setError(e);
      notify?.(`${l.saveError}: ${e?.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  const patchActive = (patch) => mutateActive((prev) => ({ ...prev, ...patch }));
  const commitConditionDrafts = (field = null) => {
    const current = activeRef.current;
    if (!current || current.status !== "draft") return current;
    const currentConditions = current.conditions || {};
    const firstKey = current.mode === "entry" ? "entryRemainsValidIf" : "longBecomesValidIf";
    const secondKey = current.mode === "entry" ? "invalidation" : "shortBecomesValidIf";
    const drafts = conditionDrafts.sessionId === current.id
      ? conditionDrafts
      : { first: linesText(currentConditions[firstKey]), second: linesText(currentConditions[secondKey]) };
    const nextConditions = { ...currentConditions };
    if (!field || field === "first") nextConditions[firstKey] = lines(drafts.first);
    if (!field || field === "second") nextConditions[secondKey] = lines(drafts.second);
    const changed = JSON.stringify(nextConditions) !== JSON.stringify(currentConditions);
    return patchActive(changed ? { conditions: nextConditions, psychologySynthesis: null } : { conditions: nextConditions });
  };
  const updateArgument = (id, next) => mutateActive((prev) => ({
    ...prev,
    arguments: prev.arguments.map((arg) => arg.id === id ? normalizeDecisionArgument(next, prev.mode) : arg),
    psychologySynthesis: null
  }));
  const deleteArgument = (id) => mutateActive((prev) => ({ ...prev, arguments: prev.arguments.filter((arg) => arg.id !== id), psychologySynthesis: null }));
  const decisiveCount = active?.arguments?.filter((arg) => arg.isDecisive).length || 0;
  const allArgumentsRated = !!active?.arguments?.length && active.arguments.every((arg) => arg.weightRated && arg.weight != null && arg.emotionRated && arg.emotionIntensity != null);

  const goStep = (step) => {
    mutateActive((prev) => ({ ...prev, flowStep: step }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const checkpointRecording = (chunk, meta) => {
    const sessionId = recordingSessionIdRef.current;
    const id = recordingAudioIdRef.current;
    if (!sessionId || !id || !chunk?.size) return;
    recordingChunksRef.current.push(chunk);
    const count = recordingChunksRef.current.length;
    if (count % 2 !== 0) return;
    const mimeType = meta?.mimeType || chunk.type || "application/octet-stream";
    const blob = new Blob(recordingChunksRef.current, { type: mimeType });
    audioStore.save({
      id,
      sessionId,
      userId,
      blob,
      mimeType,
      durationMs: meta?.durationMs || 0,
      createdAt: meta?.startedAt || Date.now(),
      updatedAt: Date.now(),
      status: "recording"
    }).then((saved) => setPendingAudio(saved)).catch(() => {});
  };

  const startRecording = async () => {
    setError(null);
    const current = activeRef.current;
    if (!current?.id) return;
    try {
      recordingChunksRef.current = [];
      recordingAudioIdRef.current = `aud_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      recordingSessionIdRef.current = current.id;
      recorderRef.current = createAudioRecorder({ onChunk: checkpointRecording, timesliceMs: 2000 });
      await recorderRef.current.start();
      setRecording(true);
      setRecordingSec(0);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingSec((sec) => {
          const next = sec + 1;
          if (next >= 180) setTimeout(() => stopRecordingRef.current?.(), 0);
          return Math.min(next, 180);
        });
      }, 1000);
    } catch (e) {
      const msg = e?.name === "NotAllowedError" ? (lang === "en" ? "Microphone permission was denied" : "Нет доступа к микрофону") : (e?.message || String(e));
      notify?.(msg);
    }
  };

  const processAudioDraft = async (draft) => {
    if (!draft?.blob) return;
    const sessionId = String(draft.sessionId || activeRef.current?.id || "");
    setVoiceBusy(true);
    try {
      let text = draft.transcriptText?.trim() || "";
      let durableDraft = draft;
      if (!text) {
        text = await transcribeDecisionAudio(draft.blob, {
          lang,
          symbol: activeRef.current?.symbol || "",
          direction: activeRef.current?.consideredDirection || ""
        });
        durableDraft = await audioStore.save({ ...draft, status: "transcribed", transcriptText: text, updatedAt: Date.now() });
        setPendingAudio(durableDraft);
      }
      const latest = activeRef.current;
      if (!latest || latest.id !== sessionId || latest.status !== "draft") throw new Error("decision_audio_session_changed");
      const next = addDecisionTranscriptSegment(latest, text, "voice");
      next.flowStep = "input";
      applyLocal(next);
      // The transcript is now durable in the local Decision draft cache. Cloud sync can happen
      // independently; there is no reason to pay for the same transcription twice after a network error.
      await audioStore.remove(durableDraft.id);
      setPendingAudio(null);
    } catch (e) {
      notify?.(lang === "en" ? `Transcription failed: ${e?.message || e}` : `Не удалось расшифровать запись: ${e?.message || e}`);
      setPendingAudio(draft);
    } finally {
      setVoiceBusy(false);
    }
  };

  const stopRecording = async () => {
    if (!recording || !recorderRef.current?.isRecording?.()) return;
    clearInterval(timerRef.current);
    setRecording(false);
    setVoiceBusy(true);
    try {
      const result = await recorderRef.current.stop();
      const id = recordingAudioIdRef.current || `aud_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      const draft = await audioStore.save({
        id,
        sessionId: recordingSessionIdRef.current || activeRef.current?.id,
        userId,
        ...result,
        createdAt: result.startedAt || Date.now(),
        updatedAt: Date.now(),
        status: "pending"
      });
      setPendingAudio(draft);
      await processAudioDraft(draft);
    } catch (e) {
      notify?.(lang === "en" ? `Recording failed: ${e?.message || e}` : `Ошибка записи: ${e?.message || e}`);
      setVoiceBusy(false);
    } finally {
      recordingChunksRef.current = [];
      recordingAudioIdRef.current = null;
      recordingSessionIdRef.current = null;
    }
  };
  stopRecordingRef.current = stopRecording;

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && recorderRef.current?.isRecording?.()) stopRecordingRef.current?.();
    };
    const onPageHide = () => {
      if (recorderRef.current?.isRecording?.()) stopRecordingRef.current?.();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  const addManualText = () => {
    if (!manualText.trim()) return;
    const current = activeRef.current;
    if (!current) return;
    applyLocal(addDecisionTranscriptSegment(current, manualText, "text"));
    setManualText("");
  };

  const attachChartScreenshot = async (file) => {
    const current = activeRef.current;
    if (!file || !current?.id || current.status !== "draft" || !mediaStore || !userId) return;
    setChartBusy(true);
    try {
      const dataUrl = await compressDecisionImageFile(file);
      const now = Date.now();
      const local = await mediaStore.saveLocal(userId, current.id, {
        dataUrl, mimeType: "image/jpeg", createdAt: chartMedia?.createdAt || now, updatedAt: now, cloudSynced: false
      });
      setChartMedia(local);
      if (!current.chartImageAttached) applyLocal({ ...current, chartImageAttached: true });
      try {
        const synced = await mediaStore.saveCloud(userId, current.id, local);
        setChartMedia(synced);
      } catch (cloudError) {
        notify?.(lang === "en" ? "Screenshot saved on this device; cloud sync will need a retry." : "Скрин сохранён на устройстве, но облачная синхронизация пока не прошла.");
      }
    } catch (e) {
      notify?.(`${l.chartShotError}: ${e?.message || e}`);
    } finally {
      if (chartInputRef.current) chartInputRef.current.value = "";
      setChartBusy(false);
    }
  };

  const removeChartScreenshot = async () => {
    const current = activeRef.current;
    if (!current?.id || current.status !== "draft" || !mediaStore || !userId) return;
    setChartBusy(true);
    try {
      await mediaStore.deleteForSession(userId, current.id);
      setChartMedia(null);
      if (current.chartImageAttached) applyLocal({ ...current, chartImageAttached: false });
    } catch (e) {
      notify?.(`${l.chartShotError}: ${e?.message || e}`);
    } finally {
      setChartBusy(false);
    }
  };

  const organize = async () => {
    const current = activeRef.current;
    const transcript = current?.rawInput?.combinedTranscript?.trim();
    if (!transcript) { notify?.(lang === "en" ? "Add your thoughts first" : "Сначала добавь мысли"); return; }
    const sessionId = current.id;
    const generation = ++organizerGenerationRef.current;
    setOrganizing(true);
    setOrganizeError(null);
    try {
      const args = await organizeDecisionTranscript({
        transcript,
        mode: current.mode,
        consideredDirection: current.consideredDirection,
        lang,
        source: current.rawInput.inputMethod,
        chartImageDataUrl: chartMedia?.dataUrl || null
      });
      const latest = activeRef.current;
      if (generation !== organizerGenerationRef.current || !latest || latest.id !== sessionId || latest.rawInput.combinedTranscript.trim() !== transcript) {
        notify?.(lang === "en" ? "Thoughts changed while structuring. Run it again." : "Пока шёл разбор, текст изменился. Запусти разбор ещё раз.");
        return;
      }
      const next = setDecisionArguments(latest, args);
      next.flowStep = "review";
      applyLocal(next);
    } catch (e) {
      setOrganizeError(e);
      notify?.(lang === "en" ? "Automatic structuring failed. You can continue manually." : "Авторазбор не сработал. Можно продолжить вручную.");
    } finally {
      setOrganizing(false);
    }
  };

  const continueManual = () => goStep("review");

  const addManualArgument = () => {
    if (!newArgText.trim()) return;
    const current = activeRef.current;
    if (!current) return;
    const arg = normalizeDecisionArgument({
      rawText: newArgText,
      normalizedText: newArgText,
      side: "neutral",
      factorId: "other",
      factorGroup: "other",
      weight: null,
      weightRated: false,
      emotionIntensity: null,
      emotionRated: false,
      emotionTag: null,
      source: "manual",
      aiGeneratedStructure: false,
      userEdited: true
    }, current.mode, current.arguments.length);
    applyLocal({ ...current, arguments: [...current.arguments, arg].slice(0, 14), psychologySynthesis: null });
    setNewArgText("");
  };

  const runPsychologySynthesis = async (candidate = activeRef.current, { force = false } = {}) => {
    if (!candidate || candidate.status !== "draft" || candidate.flowStep !== "decision") return null;
    let inputHash;
    try { inputHash = decisionPsychologyInputHash(candidate); } catch { return null; }
    if (!force && candidate.psychologySynthesis?.inputHash === inputHash) return candidate.psychologySynthesis;
    const generation = ++psychologyGenerationRef.current;
    const sessionId = candidate.id;
    setPsychologyBusy(true);
    setPsychologyError(null);
    setPsychologySkipKey(null);
    try {
      const result = await synthesizeDecisionPsychology({ session: candidate, lang });
      const latest = activeRef.current;
      if (!latest || latest.id !== sessionId || latest.status !== "draft") return null;
      const latestHash = decisionPsychologyInputHash(latest);
      if (generation !== psychologyGenerationRef.current || latestHash !== inputHash) {
        notify?.(lang === "en" ? "Your reasoning changed while the synthesis was running. Rebuilding is required." : "Пока шёл разбор, аргументы изменились. Нужно собрать его заново.");
        return null;
      }
      const next = setDecisionPsychologySynthesis(latest, result, inputHash);
      next.flowStep = "decision";
      applyLocal(next);
      return next.psychologySynthesis;
    } catch (e) {
      setPsychologyError(e);
      return null;
    } finally {
      if (generation === psychologyGenerationRef.current) setPsychologyBusy(false);
    }
  };

  const enterDecisionStep = () => {
    const committed = commitConditionDrafts() || activeRef.current;
    if (!committed) return;
    let psychologySynthesis = null;
    try {
      const hash = decisionPsychologyInputHash(committed);
      if (committed.psychologySynthesis?.inputHash === hash) psychologySynthesis = committed.psychologySynthesis;
    } catch (_) {
    }
    applyLocal({ ...committed, flowStep: "decision", psychologySynthesis });
    setPsychologyError(null);
    setPsychologySkipKey(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const skipPsychologySynthesis = () => {
    const current = activeRef.current;
    if (!current) return;
    const hash = decisionPsychologyInputHash(current);
    if (current.psychologySynthesis) applyLocal({ ...current, psychologySynthesis: null });
    setPsychologySkipKey(`${current.id}:${hash}`);
  };

  useEffect(() => {
    if (!active?.id || active.status !== "draft" || active.flowStep !== "decision" || psychologyBusy || psychologyError) return;
    let hash;
    try { hash = decisionPsychologyInputHash(active); } catch { return; }
    if (active.psychologySynthesis?.inputHash === hash || psychologySkipKey === `${active.id}:${hash}`) return;
    const timer = setTimeout(() => runPsychologySynthesis(activeRef.current).catch(() => {}), 0);
    return () => clearTimeout(timer);
  }, [active?.id, active?.flowStep, active?.psychologySynthesis?.inputHash, psychologyBusy, psychologyError, psychologySkipKey]);

  const lock = async () => {
    clearTimeout(syncTimerRef.current);
    setSaving(true);
    try {
      await saveChainRef.current;
      const current = activeRef.current;
      const base = cloudRef.current?.id === current?.id ? cloudRef.current : current;
      const candidate = normalizeDecisionSession({
        ...current,
        persistenceRevision: base?.persistenceRevision || 0,
        persistenceUpdatedAt: base?.persistenceUpdatedAt ?? null
      });
      if (candidate.chartImageAttached) {
        if (!chartMedia?.dataUrl) throw new Error("decision_chart_media_missing");
        if (!chartMedia.cloudSynced && mediaStore) {
          const synced = await mediaStore.saveCloud(userId, candidate.id, chartMedia);
          setChartMedia(synced);
        }
      }
      const locked = lockDecisionSession(candidate);
      const committed = await store.saveSession(userId, locked);
      cloudRef.current = committed;
      activeRef.current = committed;
      setActive(committed);
      upsertIndex(committed);
      draftCache.remove(userId, committed.id);
      await audioStore.clearForSession(committed.id).catch(() => {});
      editSeqRef.current = 0;
      lastSyncedSeqRef.current = 0;
    } catch (e) {
      if (e?.message === "decision_revision_conflict") {
        setError(e);
        notify?.(l.conflict);
      } else {
        notify?.(lang === "en" ? "Complete every rating before locking the decision" : "Сначала заполни все оценки и выбери решение");
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteSessionRecord = async (sessionOrRow) => {
    const id = String(sessionOrRow?.id || "");
    if (!id || !store?.deleteSession || !userId) return false;
    const confirmed = await requestAppConfirm({
      title: l.deleteTitle,
      message: l.deleteConfirm,
      confirmLabel: l.deleteAction,
      cancelLabel: l.cancel,
      danger: true
    });
    if (!confirmed) return false;
    setSaving(true);
    setError(null);
    deletedSessionIdsRef.current.add(id);
    clearTimeout(syncTimerRef.current);
    try {
      await saveChainRef.current.catch(() => null);
      const cloud = sessionOrRow?.persistenceRevision != null ? sessionOrRow : await store.loadSession(userId, id);
      if (onBeforeDeleteSession) {
        const ok = await onBeforeDeleteSession(id, cloud);
        if (ok === false) throw new Error("decision_journal_unlink_failed");
      }
      await store.deleteSession(userId, id, { expectedRevision: cloud?.persistenceRevision ?? null });
      draftCache.remove(userId, id);
      await audioStore.clearForSession(id).catch(() => {});
      if (mediaStore) await mediaStore.deleteForSession(userId, id).catch(() => {});
      setIndex((prev) => ({ ...(prev || { sessions: [] }), sessions: (prev?.sessions || []).filter((row) => row.id !== id) }));
      setAnalyticsSessions((prev) => (prev || []).filter((row) => row?.id !== id));
      if (activeRef.current?.id === id) {
        activeRef.current = null;
        cloudRef.current = null;
        setActive(null);
        editSeqRef.current = 0;
        lastSyncedSeqRef.current = 0;
      }
      notify?.(l.deleted);
      return true;
    } catch (e) {
      deletedSessionIdsRef.current.delete(id);
      setError(e);
      notify?.(`${l.deleteError}: ${e?.message || e}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const reloadActive = async () => {
    if (!activeRef.current?.id) return;
    draftCache.remove(userId, activeRef.current.id);
    await open(activeRef.current.id);
  };

  if (loading) return jsx("div", { className: "py-16 text-center text-xs", style: { color: BASE.inkFaint }, children: lang === "en" ? "Loading Decision Lab…" : "Загружаю разборы…" });
  if (!active) return jsxs("div", { children: [
    jsx("div", { className: "grid grid-cols-2 gap-1 p-1 rounded-[13px] mb-6", style: { background: "#070708", border: "1px solid #18181C" }, children: [
      jsx("button", { type: "button", onClick: () => setHomeView("decisions"), className: "h-10 rounded-[10px] text-[12px] flex items-center justify-center gap-1.5", style: { background: homeView === "decisions" ? BASE.surface2 : "transparent", color: homeView === "decisions" ? BASE.ink : BASE.inkFaint }, children: [jsx(Brain, { size: 13 }), l.decisionsTab] }),
      jsx("button", { type: "button", onClick: openAnalytics, className: "h-10 rounded-[10px] text-[12px] flex items-center justify-center gap-1.5", style: { background: homeView === "analytics" ? BASE.surface2 : "transparent", color: homeView === "analytics" ? BASE.ink : BASE.inkFaint }, children: [jsx(BarChart3, { size: 13 }), l.analyticsTab] })
    ] }),
    homeView === "analytics"
      ? (analyticsLoading ? jsx("div", { className: "py-16 text-center text-xs", style: { color: BASE.inkFaint }, children: l.analyticsLoading }) : jsx(DecisionAnalyticsView, { sessions: analyticsSessions, trades, accent, lang }))
      : jsx(ModeHome, {
          index, activeDraft, onStart: start, onOpen: open, onDelete: deleteSessionRecord, accent, lang, startPromptMode,
          onResumeDraft: () => { setStartPromptMode(null); if (activeDraft) open(activeDraft.id); },
          onConfirmNew: confirmStartNew,
          onCancelNew: () => setStartPromptMode(null)
        })
  ] });

  if (error?.message === "decision_revision_conflict") {
    return jsxs(Panel, { children: [jsx(AlertTriangle, { size: 20, style: { color: "#D9A85E" } }), jsx("p", { className: "text-sm mt-3 mb-4", style: { color: BASE.ink }, children: l.conflict }), jsx(PrimaryButton, { accent, onClick: reloadActive, icon: RotateCcw, children: l.reload })] });
  }

  const step = active.status === "draft" ? active.flowStep : "summary";
  const setBack = (prevStep) => () => goStep(prevStep);

  if (step === "context") {
    const contextReady = active.preDecisionState.clarityBeforeRated && active.preDecisionState.clarityBefore != null && (active.mode !== "entry" || !!active.consideredDirection);
    return jsxs("div", { children: [
      jsx(StepHeader, { title: l.context, subtitle: active.mode === "entry" ? l.entryHint : l.directionHint, onBack: () => setActive(null), onDelete: () => deleteSessionRecord(activeRef.current), deleteLabel: l.deleteDecision }),
      jsxs(Panel, { children: [
        jsx("label", { className: "block text-[10px] uppercase tracking-wide mb-2", style: { color: BASE.inkFaint }, children: l.symbol }),
        jsx("input", { value: active.symbol, onChange: (e) => patchActive({ symbol: e.target.value.toUpperCase().slice(0, 40) }), placeholder: "BTCUSDT", className: "w-full bg-transparent border-b outline-none py-2.5 mb-5 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" } }),
        active.mode === "entry" && jsxs("div", { className: "mb-5", children: [jsx("div", { className: "text-[11px] mb-2", style: { color: BASE.inkFaint }, children: l.considered }), jsx("div", { className: "grid grid-cols-2 gap-2", children: [["long", "LONG"], ["short", "SHORT"]].map(([id, label]) => jsx(DecisionChoiceButton, { id, label, selected: active.consideredDirection === id, onClick: () => patchActive({ consideredDirection: id }), accent, size: "medium" }, id)) })] }),
        jsx(SliderField, { label: l.clarityBefore, value: active.preDecisionState.clarityBefore, rated: active.preDecisionState.clarityBeforeRated, unratedLabel: l.unrated, onChange: (value) => patchActive({ preDecisionState: { ...active.preDecisionState, clarityBefore: value, clarityBeforeRated: true } }), accent, hintLeft: lang === "en" ? "chaos" : "каша", hintRight: lang === "en" ? "clear" : "ясно" }),
        jsx(PrimaryButton, { accent, disabled: !contextReady, onClick: () => goStep("input"), children: l.continue })
      ] })
    ] });
  }

  if (step === "input") {
    const mm = String(Math.floor(recordingSec / 60)).padStart(2, "0");
    const ss = String(recordingSec % 60).padStart(2, "0");
    return jsxs("div", { children: [
      jsx(StepHeader, { title: l.unload, subtitle: l.unloadHint, onBack: setBack("context"), onDelete: () => deleteSessionRecord(activeRef.current), deleteLabel: l.deleteDecision }),
      jsxs(Panel, { className: "mb-3", children: [
        recording ? jsxs("div", { className: "text-center py-7", children: [jsx("div", { className: "text-[30px] mb-2", style: { fontFamily: "var(--font-mono)", color: BASE.ink }, children: `${mm}:${ss}` }), jsx("div", { className: "text-[11px] mb-4", style: { color: BASE.inkFaint }, children: l.recordingLimit }), jsx("button", { type: "button", onClick: stopRecording, className: "mx-auto w-[72px] h-[72px] rounded-full flex items-center justify-center", style: { background: LOSS, color: "#fff" }, children: jsx(Square, { size: 20, fill: "currentColor" }) }), jsx("div", { className: "text-[10px] mt-3", style: { color: BASE.inkFaint }, children: l.stop })] }) : jsxs("div", { className: "text-center py-7", children: [jsx("button", { type: "button", onClick: startRecording, disabled: voiceBusy, className: "mx-auto w-[72px] h-[72px] rounded-full flex items-center justify-center transition-transform active:scale-95", style: { background: BASE.ink, color: "#050505", opacity: voiceBusy ? 0.5 : 1 }, children: jsx(Mic, { size: 22 }) }), jsx("div", { className: "text-[12px] mt-3", style: { color: BASE.inkDim }, children: voiceBusy ? l.processing : l.record })] }),
        pendingAudio && !voiceBusy && jsxs("div", { className: "mt-3 pt-3", style: { borderTop: `1px solid ${BASE.line}` }, children: [jsx("p", { className: "text-[12px] leading-relaxed mb-2", style: { color: BASE.inkDim }, children: l.savedAudio }), jsx("button", { type: "button", onClick: () => processAudioDraft(pendingAudio), className: "h-9 px-3 rounded-[10px] text-[11px] flex items-center gap-2", style: { border: `1px solid ${BASE.line}`, color: BASE.ink }, children: [jsx(RotateCcw, { size: 13 }), l.retryAudio] })] })
      ] }),
      jsxs(Panel, { className: "mb-3", children: [jsx("div", { className: "text-[11px] mb-2", style: { color: BASE.inkFaint }, children: l.typeFallback }), jsx("textarea", { value: manualText, onChange: (e) => setManualText(e.target.value), rows: 3, className: "w-full bg-transparent outline-none resize-none text-[14px] leading-[1.6]", style: { color: BASE.ink }, placeholder: lang === "en" ? "Write any thought here…" : "Можно дописать любую мысль…" }), jsx("button", { type: "button", onClick: addManualText, disabled: !manualText.trim(), className: "mt-2 h-9 px-3 rounded-[10px] text-[11px]", style: { border: `1px solid ${BASE.line}`, color: manualText.trim() ? BASE.ink : BASE.inkFaint }, children: l.addText })] }),
      jsxs(Panel, { className: "mb-3", children: [
        jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          jsxs("div", { children: [jsx("div", { className: "text-[12px] mb-1", style: { color: BASE.ink, fontWeight: 600 }, children: l.chartShot }), jsx("div", { className: "text-[11px] leading-[1.45]", style: { color: BASE.inkFaint }, children: l.chartShotHint })] }),
          jsx(ImagePlus, { size: 17, style: { color: BASE.inkFaint, flexShrink: 0 } })
        ] }),
        jsx("input", { ref: chartInputRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => attachChartScreenshot(e.target.files?.[0] || null) }),
        chartMedia?.dataUrl ? jsxs("div", { children: [
          jsx(ScreenshotImage, { src: chartMedia.dataUrl, alt: active.symbol ? `${active.symbol} · ${l.chartShot}` : l.chartShot, className: "w-full max-h-[300px] object-contain rounded-[12px]", style: { background: "#030304", border: `1px solid ${BASE.line}` } }),
          jsxs("div", { className: "grid grid-cols-2 gap-2 mt-3", children: [
            jsx("button", { type: "button", disabled: chartBusy, onClick: () => chartInputRef.current?.click(), className: "h-10 rounded-[10px] text-[11px]", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: l.replaceChartShot }),
            jsx("button", { type: "button", disabled: chartBusy, onClick: removeChartScreenshot, className: "h-10 rounded-[10px] text-[11px]", style: { border: `1px solid ${LOSS}33`, color: LOSS, background: `${LOSS}07` }, children: l.removeChartShot })
          ] })
        ] }) : jsx("button", { type: "button", disabled: chartBusy, onClick: () => chartInputRef.current?.click(), className: "w-full h-11 rounded-[11px] flex items-center justify-center gap-2 text-[12px]", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim, background: BASE.surface2 }, children: [jsx(ImagePlus, { size: 15 }), chartBusy ? (lang === "en" ? "Preparing…" : "Подготавливаю…") : l.addChartShot] })
      ] }),
      active.rawInput.combinedTranscript && jsxs(Panel, { className: "mb-3", children: [jsx(SectionTitle, { children: l.transcript }), jsx("textarea", { value: active.rawInput.combinedTranscript, onChange: (e) => applyLocal(setDecisionTranscript(activeRef.current, e.target.value)), rows: 7, className: "w-full bg-transparent outline-none resize-none text-[14px] leading-[1.6]", style: { color: BASE.inkDim } })] }),
      organizeError && jsx("button", { type: "button", onClick: continueManual, className: "w-full h-10 rounded-[10px] mb-2 text-xs", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: l.manual }),
      jsx(PrimaryButton, { accent, disabled: organizing || voiceBusy || !active.rawInput.combinedTranscript.trim(), onClick: organize, icon: Sparkles, children: organizing ? l.organizing : l.organize })
    ] });
  }

  if (step === "review") {
    return jsxs("div", { children: [
      jsx(StepHeader, { title: l.review, subtitle: l.reviewHint, onBack: setBack("input"), onDelete: () => deleteSessionRecord(activeRef.current), deleteLabel: l.deleteDecision }),
      active.arguments.map((arg) => jsx(DecisionArgumentCard, { arg, mode: active.mode, accent, lang, onChange: (next) => updateArgument(arg.id, next), onDelete: () => deleteArgument(arg.id), notify }, arg.id)),
      active.arguments.length < 14 && jsxs(Panel, { className: "mb-3", children: [jsx("input", { value: newArgText, onChange: (e) => setNewArgText(e.target.value), className: "w-full bg-transparent outline-none py-2 text-sm", style: { color: BASE.ink }, placeholder: l.addArgument }), jsx("button", { type: "button", onClick: addManualArgument, disabled: !newArgText.trim(), className: "mt-2 h-9 px-3 rounded-[10px] text-[11px] flex items-center gap-2", style: { border: `1px solid ${BASE.line}`, color: newArgText.trim() ? BASE.ink : BASE.inkFaint }, children: [jsx(Plus, { size: 13 }), l.addText] })] }),
      jsx(PrimaryButton, { accent, disabled: active.arguments.length === 0, onClick: () => goStep("rate"), children: l.continue })
    ] });
  }

  if (step === "rate") {
    return jsxs("div", { children: [
      jsx(StepHeader, { title: l.rate, subtitle: l.rateHint, onBack: setBack("review"), onDelete: () => deleteSessionRecord(activeRef.current), deleteLabel: l.deleteDecision }),
      active.arguments.map((arg) => jsx(DecisionArgumentCard, { arg, mode: active.mode, accent, lang, rating: true, decisiveCount, notify, onChange: (next) => updateArgument(arg.id, next), onDelete: () => deleteArgument(arg.id) }, arg.id)),
      jsx(PrimaryButton, { accent, disabled: !allArgumentsRated, onClick: () => goStep("conditions"), children: l.continue })
    ] });
  }

  if (step === "conditions") {
    const c = active.conditions || {};
    const firstKey = active.mode === "entry" ? "entryRemainsValidIf" : "longBecomesValidIf";
    const secondKey = active.mode === "entry" ? "invalidation" : "shortBecomesValidIf";
    return jsxs("div", { children: [
      jsx(StepHeader, { title: l.conditions, onBack: setBack("rate"), onDelete: () => deleteSessionRecord(activeRef.current), deleteLabel: l.deleteDecision }),
      jsxs(Panel, { className: "mb-3", children: [jsx("label", { className: "block text-[12px] mb-2", style: { color: BASE.ink }, children: active.mode === "entry" ? l.entryValid : l.longValid }), jsx("textarea", { value: conditionDrafts.sessionId === active.id ? conditionDrafts.first : linesText(c[firstKey]), onChange: (e) => setConditionDrafts((prev) => ({ sessionId: active.id, first: e.target.value, second: prev.sessionId === active.id ? prev.second : linesText(c[secondKey]) })), onBlur: () => commitConditionDrafts("first"), rows: 4, placeholder: l.onePerLine, className: "w-full bg-transparent outline-none resize-none text-sm leading-relaxed", style: { color: BASE.inkDim } })] }),
      jsxs(Panel, { className: "mb-3", children: [jsx("label", { className: "block text-[12px] mb-2", style: { color: BASE.ink }, children: active.mode === "entry" ? l.invalidation : l.shortValid }), jsx("textarea", { value: conditionDrafts.sessionId === active.id ? conditionDrafts.second : linesText(c[secondKey]), onChange: (e) => setConditionDrafts((prev) => ({ sessionId: active.id, first: prev.sessionId === active.id ? prev.first : linesText(c[firstKey]), second: e.target.value })), onBlur: () => commitConditionDrafts("second"), rows: 4, placeholder: l.onePerLine, className: "w-full bg-transparent outline-none resize-none text-sm leading-relaxed", style: { color: BASE.inkDim } })] }),
      jsx(PrimaryButton, { accent, onClick: enterDecisionStep, children: l.continue })
    ] });
  }

  if (step === "decision") {
    const strongest = [...active.arguments].filter((a) => a.weightRated && a.weight != null).sort((a, b) => b.weight - a.weight)[0] || null;
    const emotional = [...active.arguments].filter((a) => a.emotionRated && a.emotionIntensity != null).sort((a, b) => b.emotionIntensity - a.emotionIntensity)[0] || null;
    const choices = active.mode === "entry" ? [["enter", l.enter], ["wait", l.wait], ["skip", l.skip]] : [["long", l.long], ["short", l.short], ["wait", l.wait]];
    const psychologyHash = decisionPsychologyInputHash(active);
    const psychology = active.psychologySynthesis?.inputHash === psychologyHash ? active.psychologySynthesis : null;
    const psychologyBalance = calculateDecisionThoughtBalance(active);
    const psychologySkipped = psychologySkipKey === `${active.id}:${psychologyHash}`;
    const psychologyReady = !!psychology || psychologySkipped;
    const finalRatingsReady = active.preDecisionState.clarityAfterRated && active.preDecisionState.clarityAfter != null && active.preDecisionState.decisionConfidenceRated && active.preDecisionState.decisionConfidence != null;
    return jsxs("div", { children: [
      jsx(StepHeader, { title: l.final, onBack: setBack("conditions"), onDelete: () => deleteSessionRecord(activeRef.current), deleteLabel: l.deleteDecision }),
      jsxs(Panel, { className: "mb-3", children: [
        strongest && jsxs("div", { className: "mb-4", children: [jsx(SectionTitle, { children: l.strongest }), jsx("div", { className: "text-[14px] mb-1", style: { color: BASE.ink }, children: strongest.normalizedText }), jsx("div", { className: "text-[12px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: `${strongest.weight}%` })] }),
        emotional && jsxs("div", { children: [jsx(SectionTitle, { children: l.emotional }), jsx("div", { className: "text-[14px] mb-1", style: { color: BASE.ink }, children: emotional.normalizedText }), jsx("div", { className: "text-[12px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: `${emotional.emotionIntensity}%${emotional.emotionTag ? ` · ${DECISION_EMOTION_LABELS[emotional.emotionTag]?.[lang] || emotional.emotionTag}` : ""}` })] })
      ] }),
      psychology && jsx(PsychologySynthesisCard, { synthesis: psychology, balance: psychologyBalance, accent, lang, l }),
      !psychology && jsxs(Panel, { className: "mb-3", children: [
        jsxs("div", { className: "flex items-start gap-3", children: [
          jsx("div", { className: "w-8 h-8 rounded-[10px] shrink-0 flex items-center justify-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: jsx(Brain, { size: 15 }) }),
          jsxs("div", { className: "min-w-0 flex-1", children: [
            jsx("div", { className: "text-[15px]", style: { color: BASE.ink, fontWeight: 650 }, children: l.psychologyTitle }),
            jsx("div", { className: "text-[11px] leading-[1.5] mt-1", style: { color: BASE.inkFaint }, children: l.psychologyHint })
          ] })
        ] }),
        psychologyBusy && jsx("div", { className: "mt-5 text-[12px] animate-pulse", style: { color: BASE.inkDim }, children: l.psychologyLoading }),
        psychologyError && jsxs("div", { className: "mt-5", children: [
          jsx("div", { className: "text-[12px] mb-3", style: { color: LOSS }, children: l.psychologyError }),
          jsx("div", { className: "grid grid-cols-2 gap-2", children: [
            jsx("button", { type: "button", onClick: () => runPsychologySynthesis(activeRef.current, { force: true }), className: "h-10 rounded-[11px] text-[11px]", style: { border: `1px solid ${BASE.line}`, color: BASE.ink }, children: l.psychologyRetry }),
            jsx("button", { type: "button", onClick: skipPsychologySynthesis, className: "h-10 rounded-[11px] text-[11px]", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: l.psychologySkip })
          ] })
        ] }),
        !psychologyBusy && !psychologyError && !psychologySkipped && jsx("button", { type: "button", onClick: () => runPsychologySynthesis(activeRef.current, { force: true }), className: "mt-5 h-10 px-4 rounded-[11px] text-[11px]", style: { border: `1px solid ${BASE.line}`, color: BASE.ink }, children: l.psychologyRetry })
      ] }),
      psychologySkipped && !psychology && jsx("div", { className: "text-[10px] mb-3 text-center", style: { color: BASE.inkFaint }, children: lang === "en" ? "Psychological synthesis skipped for this decision." : "Психологический разбор пропущен для этого решения." }),
      psychologyReady && jsxs(Panel, { className: "mb-3", children: [jsx(SliderField, { label: l.clarityAfter, value: active.preDecisionState.clarityAfter, rated: active.preDecisionState.clarityAfterRated, unratedLabel: l.unrated, onChange: (value) => patchActive({ preDecisionState: { ...active.preDecisionState, clarityAfter: value, clarityAfterRated: true } }), accent, hintLeft: lang === "en" ? "unclear" : "неясно", hintRight: lang === "en" ? "clear" : "ясно" }), jsx(SliderField, { label: l.confidence, value: active.preDecisionState.decisionConfidence, rated: active.preDecisionState.decisionConfidenceRated, unratedLabel: l.unrated, onChange: (value) => patchActive({ preDecisionState: { ...active.preDecisionState, decisionConfidence: value, decisionConfidenceRated: true } }), accent, hintLeft: lang === "en" ? "not sure" : "не уверен", hintRight: lang === "en" ? "sure of process" : "уверен в решении" })] }),
      psychologyReady && jsx(SectionTitle, { children: l.chooseDecision }),
      psychologyReady && jsx("div", { className: "grid grid-cols-3 gap-2 mb-3", children: choices.map(([id, label]) => jsx(DecisionChoiceButton, { id, label, selected: active.finalDecision === id, onClick: () => patchActive({ finalDecision: id }), accent, size: "large" }, id)) }),
      cloudSyncing && jsx("div", { className: "text-center text-[9px] mb-2", style: { color: BASE.inkFaint }, children: l.syncPending }),
      psychologyReady && jsx(PrimaryButton, { accent, disabled: saving || !active.finalDecision || !allArgumentsRated || !finalRatingsReady, onClick: lock, icon: Check, children: l.lock })
    ] });
  }

  const locked = normalizeDecisionSession(active);
  const delta = decisionClarityDelta(locked);
  const actionable = locked.mode === "direction" ? ["long", "short"].includes(locked.finalDecision) : locked.finalDecision === "enter";
  const groups = locked.mode === "entry"
    ? [["for_entry", l.forEntry], ["against_entry", l.againstEntry], ["neutral", l.neutral]]
    : [["long", l.long], ["short", l.short], ["neutral", l.neutral]];
  return jsxs("div", { children: [
    jsx(StepHeader, { title: l.locked, subtitle: `${locked.symbol || l.noSymbol} · ${String(locked.finalDecision || "").toUpperCase()}`, onBack: () => setActive(null), onDelete: () => deleteSessionRecord(activeRef.current), deleteLabel: l.deleteDecision }),
    jsxs(Panel, { className: "mb-3", children: [
      jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
        jsxs("div", { children: [jsx("div", { className: "text-[10px] mb-1", style: { color: BASE.inkFaint }, children: lang === "en" ? "Clarity before" : "Ясность до" }), jsx("div", { className: "text-lg", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: locked.preDecisionState.clarityBeforeRated ? pct(locked.preDecisionState.clarityBefore) : "—" })] }),
        jsxs("div", { children: [jsx("div", { className: "text-[10px] mb-1", style: { color: BASE.inkFaint }, children: lang === "en" ? "Clarity after" : "Ясность после" }), jsx("div", { className: "text-lg", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: locked.preDecisionState.clarityAfterRated ? pct(locked.preDecisionState.clarityAfter) : "—" }), delta != null && jsx("div", { className: "text-[11px] mt-1", style: { color: delta >= 0 ? WIN : LOSS }, children: `${delta >= 0 ? "+" : ""}${delta}` })] }),
        jsxs("div", { children: [jsx("div", { className: "text-[10px] mb-1", style: { color: BASE.inkFaint }, children: lang === "en" ? "Confidence" : "Уверенность" }), jsx("div", { className: "text-lg", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: locked.preDecisionState.decisionConfidenceRated ? pct(locked.preDecisionState.decisionConfidence) : "—" })] })
      ] })
    ] }),
    locked.chartImageAttached && chartMedia?.dataUrl && jsxs(Panel, { className: "mb-3", children: [
      jsx(SectionTitle, { children: l.chartShot }),
      jsx(ScreenshotImage, { src: chartMedia.dataUrl, alt: locked.symbol ? `${locked.symbol} · ${l.chartShot}` : l.chartShot, className: "w-full max-h-[340px] object-contain rounded-[12px]", style: { background: "#030304", border: `1px solid ${BASE.line}` } }),
      jsx("div", { className: "text-[10px] mt-2", style: { color: BASE.inkFaint }, children: l.chartShotLocked })
    ] }),
    locked.psychologySynthesis && jsx(PsychologySynthesisCard, { synthesis: locked.psychologySynthesis, balance: calculateDecisionThoughtBalance(locked), accent, lang, l }),
    ...groups.map(([side, label]) => {
      const args = locked.arguments.filter((arg) => arg.side === side);
      if (!args.length) return null;
      return jsxs("div", { className: "mb-4", children: [jsx(SectionTitle, { children: label }), ...args.map((arg) => jsxs(Panel, { className: "mb-2", children: [jsx("div", { className: "text-[14px] leading-[1.55]", style: { color: BASE.ink }, children: arg.normalizedText }), jsxs("div", { className: "flex flex-wrap gap-2 mt-2 text-[10px]", style: { color: BASE.inkFaint }, children: [jsx("span", { style: { fontFamily: "var(--font-mono)" }, children: `${l.weight}: ${arg.weightRated ? `${arg.weight}%` : "—"}` }), jsx("span", { style: { fontFamily: "var(--font-mono)" }, children: `${l.emotion}: ${arg.emotionRated ? `${arg.emotionIntensity}%` : "—"}` }), arg.emotionRated && arg.emotionTag && jsx("span", { children: DECISION_EMOTION_LABELS[arg.emotionTag]?.[lang] || arg.emotionTag }), arg.isDecisive && jsx("span", { style: { color: accent }, children: `★ ${l.decisive}` })] })] }, arg.id))] }, side);
    }).filter(Boolean),
    actionable && !locked.linkedTradeId && jsx(PrimaryButton, { accent, onClick: () => onCreateTrade?.(locked), children: l.createTrade }),
    locked.linkedTradeId && jsx("div", { className: "text-center text-[11px] mb-3", style: { color: WIN }, children: lang === "en" ? "Linked to journal trade" : "Привязано к сделке в дневнике" }),
    jsx("button", { type: "button", onClick: () => setActive(null), className: "w-full h-11 mt-2 rounded-[12px] text-xs", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: l.newDecision })
  ] });
}
