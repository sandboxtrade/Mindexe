// mind.exe — Strategy Lab UI and local strategy statistics.
// Persistence mutations remain callbacks owned by app.js/strategy-store.

import { Fragment, useMemo, useRef, useState } from "react";
import {
  Sparkles, Trash2, ChevronRight, ChevronLeft, X as XIcon, PenLine, Plus,
  ImagePlus, Brain, Target, Camera
} from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import {
  computePlannedRR, computeRealizedRR, formatResult, formatStoredResult,
  formatStrategyTotal, normalizeResultByCloseType, normalizeResultCurrency,
  normalizeResultMode, outcomeFromResult, resultEntriesForUnit, unitSymbol
} from "../../core/trade-math.js?v=1";
import { isEntryClosed } from "../../core/journal-model.js?v=1";
import { BASE, WIN, LOSS, INSTRUMENTS } from "../../config/app-config.js?v=1";
import { Card, Pill, ScreenshotImage, EmptyState, StatCard } from "../../ui/primitives.js?v=2";
import { compressImageFile } from "../../ui/media-utils.js?v=1";
import { PickerField } from "../journal/journal-ui.js?v=1";
import { aiAnalyzeStrategy, aiRecognizeTradeFromImage } from "../../ai/trade-tools.js?v=1";

const outcomeColor = (o) => o === "Win" ? WIN : o === "Loss" ? LOSS : BASE.inkDim;

function normalizeStrategyResultByCloseType(closeType, value) {
  return normalizeResultByCloseType(closeType, value);
}
function strategyResultOutcome(value) {
  return outcomeFromResult(value);
}
export function strategyAllTrades(strategyId, strategyTrades, journalEntries) {
  const direct = (strategyTrades || []).filter((t) => t.strategyId === strategyId).map((t) => ({ ...t, __source: "strategy" }));
  const linked = (journalEntries || []).filter((e) => e.strategyId === strategyId).map((e) => ({ ...e, __source: "journal" }));
  return [...direct, ...linked].sort((a, b) => {
    const da = a.date instanceof Date ? a.date.getTime() : new Date(a.date || 0).getTime();
    const db = b.date instanceof Date ? b.date.getTime() : new Date(b.date || 0).getTime();
    return da - db;
  });
}
export function calculateStrategyStats(strategyId, strategyTrades, journalEntries, measureMode = "R", currency = "USD") {
  const allTrades = strategyAllTrades(strategyId, strategyTrades, journalEntries);
  const closedAll = allTrades.filter((t) => isEntryClosed(t) && typeof t.r === "number" && isFinite(t.r));
  const closed = resultEntriesForUnit(closedAll, measureMode, currency);
  const open = allTrades.filter((t) => !isEntryClosed(t));

  const allWins = closedAll.filter((t) => t.outcome === "Win" || t.r > 0);
  const allLosses = closedAll.filter((t) => t.outcome === "Loss" || t.r < 0);
  const allBreakevens = closedAll.filter((t) => t.outcome === "Breakeven" || t.r === 0);
  const winRate = allWins.length + allLosses.length ? allWins.length / (allWins.length + allLosses.length) * 100 : null;

  const wins = closed.filter((t) => t.r > 0);
  const losses = closed.filter((t) => t.r < 0);
  const totalR = closed.reduce((s, t) => s + t.r, 0);
  const avgR = closed.length ? totalR / closed.length : null;
  const avgWin = wins.length ? wins.reduce((s, t) => s + t.r, 0) / wins.length : null;
  const avgLoss = losses.length ? losses.reduce((s, t) => s + t.r, 0) / losses.length : null;
  const grossProfit = wins.reduce((s, t) => s + t.r, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.r, 0));
  const grossLossSigned = losses.reduce((s, t) => s + t.r, 0);
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : null;

  let equity = 0, peak = 0, maxDrawdown = 0;
  [...closed].sort((a, b) => {
    const da = a.exitDate || a.date;
    const db = b.exitDate || b.date;
    return new Date(da || 0) - new Date(db || 0);
  }).forEach((t) => {
    equity += t.r;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);
  });

  const longClosed = closed.filter((t) => t.direction === "Long");
  const shortClosed = closed.filter((t) => t.direction === "Short");
  const longTotal = longClosed.reduce((s, t) => s + t.r, 0);
  const shortTotal = shortClosed.reduce((s, t) => s + t.r, 0);
  const avgGroup = (arr) => arr.length ? arr.reduce((s, t) => s + t.r, 0) / arr.length : null;
  const rulesKnown = closed.filter((t) => typeof t.rulesFollowed === "boolean");
  const followed = rulesKnown.filter((t) => t.rulesFollowed);
  const broken = rulesKnown.filter((t) => !t.rulesFollowed);
  const directCount = allTrades.filter((t) => t.__source === "strategy").length;
  const linkedCount = allTrades.filter((t) => t.__source === "journal").length;

  return {
    totalTrades: allTrades.length,
    closedTrades: closedAll.length,
    resultSampleTrades: closed.length,
    excludedResultTrades: closedAll.length - closed.length,
    openTrades: open.length,
    wins: allWins.length,
    losses: allLosses.length,
    breakevens: allBreakevens.length,
    winRate: winRate == null ? null : Math.round(winRate * 10) / 10,
    totalR: Math.round(totalR * 100) / 100,
    avgR: avgR == null ? null : Math.round(avgR * 100) / 100,
    avgWin: avgWin == null ? null : Math.round(avgWin * 100) / 100,
    avgLoss: avgLoss == null ? null : Math.round(avgLoss * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100,
    grossLoss: Math.round(grossLossSigned * 100) / 100,
    profitFactor: profitFactor === Infinity ? "Infinity" : profitFactor == null ? null : Math.round(profitFactor * 100) / 100,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    long: { count: longClosed.length, totalR: Math.round(longTotal * 100) / 100, avgR: avgGroup(longClosed) == null ? null : Math.round(avgGroup(longClosed) * 100) / 100 },
    short: { count: shortClosed.length, totalR: Math.round(shortTotal * 100) / 100, avgR: avgGroup(shortClosed) == null ? null : Math.round(avgGroup(shortClosed) * 100) / 100 },
    rules: {
      known: rulesKnown.length,
      followed: followed.length,
      broken: broken.length,
      followedAvgR: avgGroup(followed) == null ? null : Math.round(avgGroup(followed) * 100) / 100,
      brokenAvgR: avgGroup(broken) == null ? null : Math.round(avgGroup(broken) * 100) / 100
    },
    directCount,
    linkedCount
  };
}
function StrategyEditor({ strategy, accent, lang, onCancel, onSave }) {
  const isEn = lang === "en";
  const [name, setName] = useState(strategy?.name || "");
  const [description, setDescription] = useState(strategy?.description || "");
  const canSave = name.trim().length >= 2 && description.trim().length >= 10;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "w-9 h-9 rounded-full flex items-center justify-center", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }) }),
      /* @__PURE__ */ jsx("h2", { className: "sec-cap text-[10px]", style: { color: BASE.inkDim }, children: strategy ? isEn ? "EDIT STRATEGY" : "РЕДАКТИРОВАНИЕ СТРАТЕГИИ" : isEn ? "NEW STRATEGY" : "НОВАЯ СТРАТЕГИЯ" })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-[10px] uppercase tracking-[0.14em] mb-1.5", style: { color: BASE.inkFaint }, children: isEn ? "Name" : "Название" }),
      /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), maxLength: 60, placeholder: isEn ? "Breakout M15" : "Например: Breakout M15", className: "w-full bg-transparent border-b outline-none py-2.5 text-[16px] mb-5", style: { borderColor: BASE.line, color: BASE.ink } }),
      /* @__PURE__ */ jsx("label", { className: "block text-[10px] uppercase tracking-[0.14em] mb-1.5", style: { color: BASE.inkFaint }, children: isEn ? "How the strategy should work" : "Как должна работать стратегия" }),
      /* @__PURE__ */ jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 8, maxLength: 4000, placeholder: isEn ? "Describe entry conditions, invalidation, stop placement, target logic and anything that must be repeatable..." : "Опиши условия входа, инвалидацию, постановку стопа, логику цели и всё, что должно повторяться от сделки к сделке...", className: "w-full bg-transparent rounded-[18px] outline-none p-3.5 text-sm resize-none", style: { border: `1px solid ${BASE.line}`, color: BASE.ink, lineHeight: 1.65 } }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] mt-2", style: { color: BASE.inkFaint }, children: isEn ? "Gemini will use this as the strategy's rulebook and compare it with your actual sample." : "Gemini будет воспринимать это описание как правила стратегии и сравнивать их с реальной выборкой сделок." })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "px-4 py-3 rounded-full text-sm", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: isEn ? "Cancel" : "Отмена" }),
      /* @__PURE__ */ jsx("button", { disabled: !canSave, onClick: () => onSave({ name: name.trim(), description: description.trim() }), className: "flex-1 py-3 rounded-full text-sm transition-all active:scale-[0.98]", style: { background: accent, color: "#04120B", opacity: canSave ? 1 : 0.3, fontWeight: 600 }, children: strategy ? isEn ? "Save changes" : "Сохранить изменения" : isEn ? "Create strategy" : "Создать стратегию" })
    ] })
  ] });
}
function StrategyTradeForm({ strategy, accent, customInstruments, onAddCustomInstrument, notify, lang, onCancel, onSave }) {
  const isEn = lang === "en";
  const [instrument, setInstrument] = useState("");
  const [direction, setDirection] = useState("Long");
  const [timeframe, setTimeframe] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [note, setNote] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [recognizing, setRecognizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const recognizeInputRef = useRef(null);
  const MAX_SHOTS = 4;
  const instrumentOptions = useMemo(() => customInstruments.length ? [{ category: isEn ? "Custom" : "Свои", items: customInstruments }, ...INSTRUMENTS] : INSTRUMENTS, [customInstruments, isEn]);
  const rr = useMemo(() => {
    const en = parseFloat(entryPrice), sl = parseFloat(stopLoss), tp = parseFloat(takeProfit);
    if ([en, sl, tp].some((v) => isNaN(v))) return { ok: false, error: null };
    return computePlannedRR(direction, en, sl, tp);
  }, [direction, entryPrice, stopLoss, takeProfit]);
  const canSave = !!instrument.trim() && rr.ok;
  const handleRecognizeFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      notify?.(isEn ? `"${file.name}" is too large (max 15 MB)` : `«${file.name}» слишком большой (макс. 15 МБ)`);
      return;
    }
    if (screenshots.length >= MAX_SHOTS) {
      notify?.(isEn ? `Maximum ${MAX_SHOTS} screenshots` : `Максимум ${MAX_SHOTS} скриншота`);
      return;
    }
    setRecognizing(true);
    try {
      const dataUrl = await compressImageFile(file);
      setScreenshots((prev) => prev.length < MAX_SHOTS ? [...prev, dataUrl] : prev);
      const rec = await aiRecognizeTradeFromImage(dataUrl);
      if (rec.asset) setInstrument(rec.asset);
      if (rec.direction) setDirection(rec.direction);
      if (rec.entryPrice != null) setEntryPrice(String(rec.entryPrice));
      if (rec.stopLoss != null) setStopLoss(String(rec.stopLoss));
      if (rec.takeProfit != null) setTakeProfit(String(rec.takeProfit));
      if (rec.entryPrice != null && rec.stopLoss != null && rec.takeProfit != null) {
        const check = computePlannedRR(rec.direction || direction, rec.entryPrice, rec.stopLoss, rec.takeProfit);
        notify?.(
          check.ok
            ? isEn ? "Trade recognized — verify the values" : "Сделка распознана — проверь значения"
            : isEn ? "Verify the recognized values" : "Проверь распознанные значения"
        );
      } else {
        notify?.(
          isEn
            ? "Trade recognized partially — fill in the missing fields manually"
            : "Сделка распознана частично — дозаполни остальное вручную"
        );
      }
    } catch {
      notify?.(
        isEn
          ? "Could not recognize the trade. Fill in the data manually."
          : "Не удалось распознать сделку. Заполни данные вручную."
      );
    } finally {
      setRecognizing(false);
    }
  };
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    const room = MAX_SHOTS - screenshots.length;
    files.slice(0, Math.max(0, room)).forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        notify?.(isEn ? `"${file.name}" is too large` : `«${file.name}» слишком большой`);
        return;
      }
      compressImageFile(file).then((dataUrl) => setScreenshots((prev) => prev.length < MAX_SHOTS ? [...prev, dataUrl] : prev)).catch(() => notify?.(isEn ? "Could not process image" : "Не удалось обработать изображение"));
    });
  };
  const handleSubmit = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await onSave({
        strategyId: strategy.id,
        status: "open",
        instrument: instrument.trim(),
        direction,
        timeframe: timeframe.trim() || null,
        entryPrice: parseFloat(entryPrice),
        stopLoss: parseFloat(stopLoss),
        takeProfit: parseFloat(takeProfit),
        plannedRR: rr.rr,
        note: note.trim(),
        date: /* @__PURE__ */ new Date(),
        exitDate: null,
        exitPrice: null,
        closeType: null,
        realizedRR: null,
        r: null,
        outcome: null,
        rulesFollowed: null,
        rulesNote: "",
        screenshots,
        exitScreenshots: []
      });
    } finally {
      setSaving(false);
    }
  };
  const L = ({ children }) => /* @__PURE__ */ jsx("label", { className: "block text-[10px] uppercase tracking-[0.14em] mb-1.5", style: { color: BASE.inkFaint }, children });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "w-9 h-9 rounded-full flex items-center justify-center", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }) }),
      /* @__PURE__ */ jsx("h2", { className: "sec-cap text-[10px]", style: { color: BASE.inkDim }, children: isEn ? "STRATEGY TRADE" : "СДЕЛКА СТРАТЕГИИ" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs mb-5 pl-11", style: { color: BASE.inkFaint }, children: strategy?.name || "" }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => recognizeInputRef.current?.click(),
            disabled: recognizing,
            className: "w-full flex items-center justify-center gap-2 px-3.5 py-3 rounded-[16px] text-xs transition-all active:scale-[0.98]",
            style: {
              border: `1px solid ${accent}35`,
              color: recognizing ? BASE.inkDim : accent,
              background: recognizing ? BASE.surface2 : `${accent}0A`,
              opacity: recognizing ? 0.72 : 1,
              fontFamily: "var(--font-display)"
            },
            children: [
              /* @__PURE__ */ jsx(Camera, { size: 14 }),
              recognizing
                ? isEn ? "Analyzing screenshot…" : "Анализируем скриншот…"
                : isEn ? "Recognize trade from screenshot" : "Распознать сделку по скриншоту"
            ]
          }
        ),
        /* @__PURE__ */ jsx("input", { ref: recognizeInputRef, type: "file", accept: "image/*", onChange: handleRecognizeFile, className: "hidden" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] mt-2 px-1", style: { color: BASE.inkFaint }, children: isEn ? "Gemini fills instrument, direction, Entry, SL and TP. Verify everything before saving." : "Gemini заполнит инструмент, направление, Entry, SL и TP. Перед сохранением проверь значения." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(L, { children: isEn ? "Instrument" : "Инструмент" }),
          /* @__PURE__ */ jsx(PickerField, { value: instrument, onChange: setInstrument, options: instrumentOptions, placeholder: isEn ? "Select" : "Выбрать", accent, allowCustom: true, mono: true, onCustomAdd: onAddCustomInstrument })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(L, { children: isEn ? "Timeframe" : "Таймфрейм" }),
          /* @__PURE__ */ jsx("input", { value: timeframe, onChange: (e) => setTimeframe(e.target.value), placeholder: "M15", maxLength: 12, className: "w-full bg-transparent border-b outline-none py-2.5 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" } })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx(L, { children: isEn ? "Direction" : "Направление" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: ["Long", "Short"].map((d) => /* @__PURE__ */ jsx("button", { onClick: () => setDirection(d), className: "flex-1 py-2 rounded-full text-sm", style: { border: `1px solid ${direction === d ? accent + "60" : BASE.line}`, background: direction === d ? `${accent}12` : "transparent", color: direction === d ? accent : BASE.inkDim }, children: d }, d)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3 mb-2", children: [
        ["Entry", entryPrice, setEntryPrice],
        ["SL", stopLoss, setStopLoss],
        ["TP", takeProfit, setTakeProfit]
      ].map(([label, value, setter]) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(L, { children: label }),
        /* @__PURE__ */ jsx("input", { value, onChange: (e) => setter(e.target.value), type: "number", step: "any", inputMode: "decimal", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" } })
      ] }, label)) }),
      /* @__PURE__ */ jsx("div", { className: "text-xs mb-5", style: { color: rr.ok ? accent : rr.error ? LOSS : BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: rr.ok ? `Planned RR 1:${rr.rr.toFixed(2)}` : rr.error || (isEn ? "Entry, SL and TP are required" : "Укажи Entry, SL и TP") }),
      /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
        /* @__PURE__ */ jsx(L, { children: isEn ? "Entry screenshots" : "Скриншоты входа" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
          screenshots.map((src, i) => /* @__PURE__ */ jsxs("div", { className: "relative w-20 h-20 rounded-xl overflow-hidden", style: { border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx(ScreenshotImage, { src, className: "w-full h-full object-cover", alt: `strategy ${i + 1}` }),
            /* @__PURE__ */ jsx("button", { onClick: () => setScreenshots((prev) => prev.filter((_, idx) => idx !== i)), className: "absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center", style: { background: "rgba(0,0,0,.65)" }, children: /* @__PURE__ */ jsx(XIcon, { size: 11, color: "#fff" }) })
          ] }, i)),
          screenshots.length < MAX_SHOTS && /* @__PURE__ */ jsx("button", { onClick: () => fileRef.current?.click(), className: "w-20 h-20 rounded-xl flex items-center justify-center", style: { border: `1px dashed ${BASE.line}`, color: BASE.inkDim }, children: /* @__PURE__ */ jsx(ImagePlus, { size: 18 }) })
        ] }),
        /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: handleFiles })
      ] }),
      /* @__PURE__ */ jsx(L, { children: isEn ? "Technical note (optional)" : "Технический комментарий (необязательно)" }),
      /* @__PURE__ */ jsx("textarea", { value: note, onChange: (e) => setNote(e.target.value), rows: 3, placeholder: isEn ? "Why this setup meets the strategy rules..." : "Почему этот сетап соответствует правилам стратегии...", className: "w-full bg-transparent rounded-[16px] p-3 text-sm outline-none resize-none", style: { border: `1px solid ${BASE.line}`, color: BASE.ink } })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "px-4 py-3 rounded-full text-sm", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: isEn ? "Cancel" : "Отмена" }),
      /* @__PURE__ */ jsx("button", {
        disabled: !canSave || saving,
        onClick: handleSubmit,
        className: "flex-1 py-3 rounded-full text-sm active:scale-[0.98] transition-all",
        style: { background: accent, color: "#04120B", opacity: canSave && !saving ? 1 : 0.45, fontWeight: 600 },
        children: saving ? isEn ? "Saving…" : "Сохраняю…" : isEn ? "Add trade" : "Добавить сделку"
      })
    ] })
  ] });
}
function StrategyTradeEditForm({ trade, strategy, accent, measureMode, currency, customInstruments, onAddCustomInstrument, notify, lang, onCancel, onSave }) {
  const isEn = lang === "en";
  const closed = !!trade && isEntryClosed(trade);
  const editResultMode = normalizeResultMode(trade?.resultMode) || measureMode;
  const editResultCurrency = editResultMode === "currency"
    ? normalizeResultCurrency(trade?.resultCurrency) || currency
    : null;
  const [instrument, setInstrument] = useState(trade?.instrument || "");
  const [direction, setDirection] = useState(trade?.direction === "Short" ? "Short" : "Long");
  const [timeframe, setTimeframe] = useState(trade?.timeframe || "");
  const [entryPrice, setEntryPrice] = useState(trade?.entryPrice == null ? "" : String(trade.entryPrice));
  const [stopLoss, setStopLoss] = useState(trade?.stopLoss == null ? "" : String(trade.stopLoss));
  const [takeProfit, setTakeProfit] = useState(trade?.takeProfit == null ? "" : String(trade.takeProfit));
  const [note, setNote] = useState(trade?.note || "");
  const [screenshots, setScreenshots] = useState(Array.isArray(trade?.screenshots) ? trade.screenshots : []);
  const initialCloseType = ["tp", "sl", "manual"].includes(trade?.closeType) ? trade.closeType : "manual";
  const [closeType, setCloseType] = useState(initialCloseType);
  const [exitPrice, setExitPrice] = useState(trade?.exitPrice == null ? "" : String(trade.exitPrice));
  const [result, setResult] = useState(
    trade?.r == null
      ? ""
      : String(initialCloseType === "sl" || initialCloseType === "tp" ? Math.abs(trade.r) : trade.r)
  );
  const [rulesFollowed, setRulesFollowed] = useState(typeof trade?.rulesFollowed === "boolean" ? trade.rulesFollowed : null);
  const [rulesNote, setRulesNote] = useState(trade?.rulesNote || "");
  const [exitScreenshots, setExitScreenshots] = useState(Array.isArray(trade?.exitScreenshots) ? trade.exitScreenshots : []);
  const [saving, setSaving] = useState(false);
  const entryFileRef = useRef(null);
  const exitFileRef = useRef(null);
  const MAX_SHOTS = 4;

  const instrumentOptions = useMemo(
    () => customInstruments.length ? [{ category: isEn ? "Custom" : "Свои", items: customInstruments }, ...INSTRUMENTS] : INSTRUMENTS,
    [customInstruments, isEn]
  );

  const rr = useMemo(() => {
    const en = parseFloat(entryPrice), sl = parseFloat(stopLoss), tp = parseFloat(takeProfit);
    if ([en, sl, tp].some((v) => isNaN(v))) return { ok: false, error: null };
    return computePlannedRR(direction, en, sl, tp);
  }, [direction, entryPrice, stopLoss, takeProfit]);

  const hasPlan = rr.ok;
  const manualExitNum = exitPrice === "" ? null : parseFloat(exitPrice);
  const effectiveExit = closed && hasPlan
    ? closeType === "tp"
      ? parseFloat(takeProfit)
      : closeType === "sl"
        ? parseFloat(stopLoss)
        : manualExitNum
    : manualExitNum;
  const resultNum = result === "" ? null : parseFloat(result);
  const normalizedResult = resultNum == null || isNaN(resultNum)
    ? null
    : normalizeStrategyResultByCloseType(hasPlan ? closeType : "manual", resultNum);
  const realizedRR = closed && hasPlan && effectiveExit != null && !isNaN(effectiveExit)
    ? computeRealizedRR(direction, parseFloat(entryPrice), parseFloat(stopLoss), effectiveExit)
    : trade?.realizedRR ?? null;
  const canSave = !!instrument.trim() && rr.ok && (!closed || normalizedResult != null && !isNaN(normalizedResult));

  const addFiles = (phase, e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    const current = phase === "entry" ? screenshots : exitScreenshots;
    const setter = phase === "entry" ? setScreenshots : setExitScreenshots;
    files.slice(0, Math.max(0, MAX_SHOTS - current.length)).forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        notify?.(isEn ? "Image is too large" : "Скриншот слишком большой");
        return;
      }
      compressImageFile(file)
        .then((dataUrl) => setter((prev) => prev.length < MAX_SHOTS ? [...prev, dataUrl] : prev))
        .catch(() => notify?.(isEn ? "Could not process image" : "Не удалось обработать изображение"));
    });
  };

  const ShotEditor = ({ title, items, setItems, inputRef, phase }) => /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.14em] mb-2", style: { color: BASE.inkFaint }, children: title }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
      items.map((src, i) => /* @__PURE__ */ jsxs("div", { className: "relative w-20 h-20 rounded-xl overflow-hidden", style: { border: `1px solid ${BASE.line}` }, children: [
        /* @__PURE__ */ jsx(ScreenshotImage, { src, className: "w-full h-full object-cover", alt: `${phase} ${i + 1}` }),
        /* @__PURE__ */ jsx("button", {
          type: "button",
          onClick: (e) => {
            e.stopPropagation();
            setItems((prev) => prev.filter((_, idx) => idx !== i));
          },
          className: "absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center",
          style: { background: "rgba(0,0,0,.72)" },
          children: /* @__PURE__ */ jsx(XIcon, { size: 11, color: "#fff" })
        })
      ] }, `${phase}_${i}`)),
      items.length < MAX_SHOTS && /* @__PURE__ */ jsx("button", {
        type: "button",
        onClick: () => inputRef.current?.click(),
        className: "w-20 h-20 rounded-xl flex items-center justify-center",
        style: { border: `1px dashed ${BASE.line}`, color: BASE.inkDim },
        children: /* @__PURE__ */ jsx(ImagePlus, { size: 18 })
      }),
      /* @__PURE__ */ jsx("input", { ref: inputRef, type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: (e) => addFiles(phase, e) })
    ] })
  ] });

  const handleSubmit = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      const patch = {
        instrument: instrument.trim(),
        direction,
        timeframe: timeframe.trim() || null,
        entryPrice: parseFloat(entryPrice),
        stopLoss: parseFloat(stopLoss),
        takeProfit: parseFloat(takeProfit),
        plannedRR: rr.rr,
        note: note.trim(),
        screenshots
      };
      if (closed) {
        patch.closeType = hasPlan ? closeType : "manual";
        patch.exitPrice = effectiveExit != null && !isNaN(effectiveExit) ? effectiveExit : null;
        patch.realizedRR = realizedRR;
        patch.r = normalizedResult;
        patch.resultMode = editResultMode;
        patch.resultCurrency = editResultMode === "currency" ? editResultCurrency : null;
        patch.outcome = strategyResultOutcome(normalizedResult);
        patch.rulesFollowed = rulesFollowed;
        patch.rulesNote = rulesNote.trim();
        patch.exitScreenshots = exitScreenshots;
      }
      await onSave(patch);
    } finally {
      setSaving(false);
    }
  };

  const L = ({ children }) => /* @__PURE__ */ jsx("label", {
    className: "block text-[10px] uppercase tracking-[0.14em] mb-1.5",
    style: { color: BASE.inkFaint },
    children
  });

  if (!trade) return null;

  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "w-9 h-9 rounded-full flex items-center justify-center", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }) }),
      /* @__PURE__ */ jsx("h2", { className: "sec-cap text-[10px]", style: { color: BASE.inkDim }, children: isEn ? "EDIT STRATEGY TRADE" : "РЕДАКТИРОВАНИЕ СДЕЛКИ" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs mb-5 pl-11", style: { color: BASE.inkFaint }, children: strategy?.name || "" }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(L, { children: isEn ? "Instrument" : "Инструмент" }),
          /* @__PURE__ */ jsx(PickerField, { value: instrument, onChange: setInstrument, options: instrumentOptions, placeholder: isEn ? "Select" : "Выбрать", accent, allowCustom: true, mono: true, onCustomAdd: onAddCustomInstrument })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(L, { children: isEn ? "Timeframe" : "Таймфрейм" }),
          /* @__PURE__ */ jsx("input", { value: timeframe, onChange: (e) => setTimeframe(e.target.value), placeholder: "M15", maxLength: 12, className: "w-full bg-transparent border-b outline-none py-2.5 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" } })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx(L, { children: isEn ? "Direction" : "Направление" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: ["Long", "Short"].map((d) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setDirection(d), className: "flex-1 py-2 rounded-full text-sm", style: { border: `1px solid ${direction === d ? accent + "60" : BASE.line}`, background: direction === d ? `${accent}12` : "transparent", color: direction === d ? accent : BASE.inkDim }, children: d }, d)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3 mb-2", children: [
        ["Entry", entryPrice, setEntryPrice],
        ["SL", stopLoss, setStopLoss],
        ["TP", takeProfit, setTakeProfit]
      ].map(([label, value, setter]) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(L, { children: label }),
        /* @__PURE__ */ jsx("input", { value, onChange: (e) => setter(e.target.value), type: "number", step: "any", inputMode: "decimal", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" } })
      ] }, label)) }),
      /* @__PURE__ */ jsx("div", { className: "text-xs mb-5", style: { color: rr.ok ? accent : rr.error ? LOSS : BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: rr.ok ? `Planned RR 1:${rr.rr.toFixed(2)}` : rr.error || (isEn ? "Entry, SL and TP are required" : "Укажи Entry, SL и TP") }),
      /* @__PURE__ */ jsx(ShotEditor, { title: isEn ? "Entry screenshots" : "Скриншоты входа", items: screenshots, setItems: setScreenshots, inputRef: entryFileRef, phase: "entry" }),
      /* @__PURE__ */ jsx(L, { children: isEn ? "Technical note (optional)" : "Технический комментарий (необязательно)" }),
      /* @__PURE__ */ jsx("textarea", { value: note, onChange: (e) => setNote(e.target.value), rows: 3, className: "w-full bg-transparent rounded-[16px] p-3 text-sm outline-none resize-none mb-5", style: { border: `1px solid ${BASE.line}`, color: BASE.ink } }),
      closed && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.14em] mb-3 mt-1", style: { color: BASE.inkFaint }, children: isEn ? "CLOSED TRADE RESULT" : "РЕЗУЛЬТАТ ЗАКРЫТОЙ СДЕЛКИ" }),
        hasPlan && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(L, { children: isEn ? "Close reason" : "Как закрылась" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: [
            { id: "tp", label: "TP" },
            { id: "sl", label: "SL" },
            { id: "manual", label: isEn ? "Manual" : "Вручную" }
          ].map((o) => /* @__PURE__ */ jsx("button", {
            type: "button",
            onClick: () => setCloseType(o.id),
            className: "py-2.5 rounded-full text-xs transition-colors",
            style: {
              border: `1px solid ${closeType === o.id ? accent + "55" : BASE.line}`,
              color: closeType === o.id ? BASE.ink : BASE.inkDim,
              background: closeType === o.id ? BASE.surface2 : "transparent"
            },
            children: o.label
          }, o.id)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 mb-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(L, { children: isEn ? "Exit price" : "Цена выхода" }),
            hasPlan && closeType !== "manual"
              ? /* @__PURE__ */ jsx("div", { className: "py-2.5 border-b text-sm", style: { borderColor: BASE.line, color: BASE.inkDim, fontFamily: "var(--font-mono)" }, children: String(effectiveExit ?? "—") })
              : /* @__PURE__ */ jsx("input", { value: exitPrice, onChange: (e) => setExitPrice(e.target.value), type: "number", step: "any", inputMode: "decimal", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" } })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(L, { children: `${isEn ? "Result amount" : "Сумма результата"} (${unitSymbol(editResultMode, editResultCurrency || currency)})` }),
            /* @__PURE__ */ jsx("input", {
              value: result,
              onChange: (e) => setResult(e.target.value),
              type: "number",
              step: "any",
              inputMode: "decimal",
              placeholder: closeType === "manual" ? "30 / -30" : "30",
              className: "w-full bg-transparent border-b outline-none py-2 text-sm",
              style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" }
            })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", {
          className: "text-[11px] mb-4",
          style: { color: normalizedResult == null ? BASE.inkFaint : normalizedResult < 0 ? LOSS : normalizedResult > 0 ? WIN : BASE.inkDim, fontFamily: "var(--font-mono)" },
          children: normalizedResult == null
            ? isEn ? "Enter the final amount" : "Укажи итоговую сумму"
            : closeType === "sl"
              ? `${isEn ? "SL → saved as" : "SL → будет сохранено как"} ${formatStrategyTotal(normalizedResult, editResultMode, editResultCurrency || currency)}`
              : closeType === "tp"
                ? `${isEn ? "TP → saved as" : "TP → будет сохранено как"} ${formatStrategyTotal(normalizedResult, editResultMode, editResultCurrency || currency)}`
                : `${isEn ? "Manual → saved as entered:" : "Вручную → знак сохраняется как введён:"} ${formatStrategyTotal(normalizedResult, editResultMode, editResultCurrency || currency)}`
        }),
        /* @__PURE__ */ jsx("div", { className: "text-xs mb-4", style: { color: realizedRR != null ? BASE.inkDim : BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: realizedRR != null ? `Realized ${realizedRR >= 0 ? "+" : ""}${realizedRR.toFixed(2)}R` : "Realized RR —" }),
        /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.14em] mb-2", style: { color: BASE.inkFaint }, children: isEn ? "Were the strategy rules followed?" : "Правила стратегии соблюдены?" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 mb-4", children: [
          { v: true, label: isEn ? "Yes" : "Да" },
          { v: false, label: isEn ? "No" : "Нет" },
          { v: null, label: isEn ? "Skip" : "Не указывать" }
        ].map((o, i) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setRulesFollowed(o.v), className: "py-2 rounded-full text-xs", style: { border: `1px solid ${rulesFollowed === o.v ? accent + "60" : BASE.line}`, color: rulesFollowed === o.v ? accent : BASE.inkDim, background: rulesFollowed === o.v ? `${accent}10` : "transparent" }, children: o.label }, i)) }),
        rulesFollowed === false && /* @__PURE__ */ jsx("textarea", { value: rulesNote, onChange: (e) => setRulesNote(e.target.value), rows: 2, placeholder: isEn ? "What exactly was broken?" : "Что именно было нарушено?", className: "w-full bg-transparent rounded-[16px] p-3 text-sm outline-none resize-none mb-4", style: { border: `1px solid ${BASE.line}`, color: BASE.ink } }),
        /* @__PURE__ */ jsx(ShotEditor, { title: isEn ? "Exit screenshots" : "Скриншоты выхода", items: exitScreenshots, setItems: setExitScreenshots, inputRef: exitFileRef, phase: "exit" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "px-4 py-3 rounded-full text-sm", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: isEn ? "Cancel" : "Отмена" }),
      /* @__PURE__ */ jsx("button", {
        disabled: !canSave || saving,
        onClick: handleSubmit,
        className: "flex-1 py-3 rounded-full text-sm active:scale-[0.98] transition-all",
        style: { background: accent, color: "#04120B", opacity: canSave && !saving ? 1 : 0.45, fontWeight: 600 },
        children: saving ? isEn ? "Saving…" : "Сохраняю…" : isEn ? "Save changes" : "Сохранить изменения"
      })
    ] })
  ] });
}
function StrategyCloseTrade({ trade, accent, measureMode, currency, notify, lang, onCancel, onSave }) {
  const isEn = lang === "en";
  const [closeType, setCloseType] = useState("manual");
  const [manualExit, setManualExit] = useState("");
  const [result, setResult] = useState("");
  const [rulesFollowed, setRulesFollowed] = useState(null);
  const [rulesNote, setRulesNote] = useState("");
  const [exitScreenshots, setExitScreenshots] = useState([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const hasPlan = trade && typeof trade.entryPrice === "number" && typeof trade.stopLoss === "number" && typeof trade.takeProfit === "number";
  const effectiveExit = hasPlan ? closeType === "tp" ? trade.takeProfit : closeType === "sl" ? trade.stopLoss : manualExit === "" ? null : parseFloat(manualExit) : manualExit === "" ? null : parseFloat(manualExit);
  const realizedRR = hasPlan && effectiveExit != null && !isNaN(effectiveExit) ? computeRealizedRR(trade.direction, trade.entryPrice, trade.stopLoss, effectiveExit) : null;
  const resultNum = result === "" ? null : parseFloat(result);
  const normalizedResult = resultNum == null || isNaN(resultNum)
    ? null
    : normalizeStrategyResultByCloseType(hasPlan ? closeType : "manual", resultNum);
  const canSave = normalizedResult != null && !isNaN(normalizedResult);
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    files.slice(0, 4 - exitScreenshots.length).forEach((file) => {
      if (file.size > 15 * 1024 * 1024) return notify?.(isEn ? "Image is too large" : "Скриншот слишком большой");
      compressImageFile(file).then((dataUrl) => setExitScreenshots((prev) => prev.length < 4 ? [...prev, dataUrl] : prev)).catch(() => notify?.(isEn ? "Could not process image" : "Не удалось обработать скриншот"));
    });
  };
  const handleSubmit = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await onSave({
        status: "closed",
        closeType: hasPlan ? closeType : "manual",
        exitPrice: effectiveExit,
        realizedRR,
        r: normalizedResult,
        resultMode: measureMode,
        resultCurrency: measureMode === "currency" ? currency : null,
        outcome: strategyResultOutcome(normalizedResult),
        exitDate: /* @__PURE__ */ new Date(),
        rulesFollowed,
        rulesNote: rulesNote.trim(),
        exitScreenshots
      });
    } finally {
      setSaving(false);
    }
  };
  if (!trade) return null;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "w-9 h-9 rounded-full flex items-center justify-center", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }) }),
      /* @__PURE__ */ jsx("h2", { className: "sec-cap text-[10px]", style: { color: BASE.inkDim }, children: isEn ? "CLOSE STRATEGY TRADE" : "ЗАКРЫТИЕ СДЕЛКИ" })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs mb-5 pl-11", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [trade.instrument, " · ", trade.direction, trade.timeframe ? ` · ${trade.timeframe}` : ""] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { children: [
      hasPlan && /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.14em] mb-2", style: { color: BASE.inkFaint }, children: isEn ? "Close reason" : "Как закрылась" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: [
          { id: "tp", label: "TP" }, { id: "sl", label: "SL" }, { id: "manual", label: isEn ? "Manual" : "Вручную" }
        ].map((o) => /* @__PURE__ */ jsx("button", { onClick: () => setCloseType(o.id), className: "py-2 rounded-full text-xs", style: { border: `1px solid ${closeType === o.id ? accent + "60" : BASE.line}`, color: closeType === o.id ? accent : BASE.inkDim, background: closeType === o.id ? `${accent}10` : "transparent" }, children: o.label }, o.id)) })
      ] }),
      (!hasPlan || closeType === "manual") && /* @__PURE__ */ jsx("input", { value: manualExit, onChange: (e) => setManualExit(e.target.value), type: "number", step: "any", inputMode: "decimal", placeholder: "Exit price", className: "w-full bg-transparent border-b outline-none py-2.5 text-sm mb-4", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" } }),
      hasPlan && /* @__PURE__ */ jsx("div", { className: "text-xs mb-4", style: { color: realizedRR != null ? accent : BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: realizedRR != null ? `Realized ${realizedRR >= 0 ? "+" : ""}${realizedRR.toFixed(2)}R` : "Realized RR —" }),
      /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.14em] mb-1.5", style: { color: BASE.inkFaint }, children: `${isEn ? "Result amount" : "Сумма результата"} (${unitSymbol(measureMode, currency)})` }),
      /* @__PURE__ */ jsx("input", {
        value: result,
        onChange: (e) => setResult(e.target.value),
        type: "number",
        step: "0.1",
        inputMode: "decimal",
        placeholder: closeType === "manual" ? (measureMode === "R" ? "1.5 / -1" : "150 / -80") : (measureMode === "R" ? "1" : "30"),
        className: "w-full bg-transparent border-b outline-none py-2.5 text-sm mb-2",
        style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" }
      }),
      /* @__PURE__ */ jsx("div", {
        className: "text-[11px] mb-5",
        style: { color: normalizedResult == null ? BASE.inkFaint : normalizedResult < 0 ? LOSS : normalizedResult > 0 ? WIN : BASE.inkDim, fontFamily: "var(--font-mono)" },
        children: normalizedResult == null
          ? isEn ? "Enter the final amount" : "Укажи итоговую сумму"
          : closeType === "sl"
            ? `${isEn ? "SL → saved as" : "SL → будет сохранено как"} ${formatStrategyTotal(normalizedResult, measureMode, currency)}`
            : closeType === "tp"
              ? `${isEn ? "TP → saved as" : "TP → будет сохранено как"} ${formatStrategyTotal(normalizedResult, measureMode, currency)}`
              : isEn ? "Manual close keeps the sign you enter" : "При ручном закрытии знак задаёшь сам"
      }),
      /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.14em] mb-2", style: { color: BASE.inkFaint }, children: isEn ? "Were the strategy rules followed?" : "Правила стратегии соблюдены?" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 mb-4", children: [
        { v: true, label: isEn ? "Yes" : "Да" }, { v: false, label: isEn ? "No" : "Нет" }, { v: null, label: isEn ? "Skip" : "Не указывать" }
      ].map((o, i) => /* @__PURE__ */ jsx("button", { onClick: () => setRulesFollowed(o.v), className: "py-2 rounded-full text-xs", style: { border: `1px solid ${rulesFollowed === o.v ? accent + "60" : BASE.line}`, color: rulesFollowed === o.v ? accent : BASE.inkDim, background: rulesFollowed === o.v ? `${accent}10` : "transparent" }, children: o.label }, i)) }),
      rulesFollowed === false && /* @__PURE__ */ jsx("textarea", { value: rulesNote, onChange: (e) => setRulesNote(e.target.value), rows: 2, placeholder: isEn ? "What exactly was broken?" : "Что именно было нарушено?", className: "w-full bg-transparent rounded-[16px] p-3 text-sm outline-none resize-none mb-4", style: { border: `1px solid ${BASE.line}`, color: BASE.ink } }),
      /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.14em] mb-2", style: { color: BASE.inkFaint }, children: isEn ? "Exit screenshots" : "Скриншоты выхода" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        exitScreenshots.map((src, i) => /* @__PURE__ */ jsxs("div", { className: "relative w-20 h-20 rounded-xl overflow-hidden", style: { border: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx(ScreenshotImage, { src, className: "w-full h-full object-cover", alt: `exit ${i + 1}` }),
          /* @__PURE__ */ jsx("button", { onClick: () => setExitScreenshots((prev) => prev.filter((_, idx) => idx !== i)), className: "absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center", style: { background: "rgba(0,0,0,.65)" }, children: /* @__PURE__ */ jsx(XIcon, { size: 11, color: "#fff" }) })
        ] }, i)),
        exitScreenshots.length < 4 && /* @__PURE__ */ jsx("button", { onClick: () => fileRef.current?.click(), className: "w-20 h-20 rounded-xl flex items-center justify-center", style: { border: `1px dashed ${BASE.line}`, color: BASE.inkDim }, children: /* @__PURE__ */ jsx(ImagePlus, { size: 18 }) }),
        /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: handleFiles })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "px-4 py-3 rounded-full text-sm", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: isEn ? "Cancel" : "Отмена" }),
      /* @__PURE__ */ jsx("button", {
        disabled: !canSave || saving,
        onClick: handleSubmit,
        className: "flex-1 py-3 rounded-full text-sm active:scale-[0.98] transition-all",
        style: { background: accent, color: "#04120B", opacity: canSave && !saving ? 1 : 0.45, fontWeight: 600 },
        children: saving ? isEn ? "Saving…" : "Сохраняю…" : isEn ? "Close trade" : "Закрыть сделку"
      })
    ] })
  ] });
}
export function StrategyLab({ strategies, strategyTrades, journalEntries, loaded, accent, measureMode, currency, customInstruments, onAddCustomInstrument, notify, lang, onCreateStrategy, onUpdateStrategy, onDeleteStrategy, onCreateTrade, onUpdateTrade, onCloseTrade }) {
  const isEn = lang === "en";
  const [mode, setMode] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTradeId, setSelectedTradeId] = useState(null);
  const [detailTab, setDetailTab] = useState("trades");
  const [aiBusy, setAiBusy] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const selected = strategies.find((s) => s.id === selectedId) || null;
  const allSelectedTrades = selected ? strategyAllTrades(selected.id, strategyTrades, journalEntries) : [];
  const stats = selected ? calculateStrategyStats(selected.id, strategyTrades, journalEntries, measureMode, currency) : null;
  const openStrategy = (id) => {
    setSelectedId(id);
    setDetailTab("trades");
    setDeleteConfirm(false);
    setMode("detail");
  };
  if (!loaded) {
    return /* @__PURE__ */ jsx("div", { className: "py-16 flex justify-center", children: /* @__PURE__ */ jsx(LogoSpinner, { size: 24, accent }) });
  }
  if (mode === "create") return /* @__PURE__ */ jsx(StrategyEditor, { accent, lang, onCancel: () => setMode("list"), onSave: async (data) => {
    const created = await onCreateStrategy(data);
    if (created) {
      setSelectedId(created.id);
      setMode("detail");
    }
  } });
  if (mode === "edit" && selected) return /* @__PURE__ */ jsx(StrategyEditor, { strategy: selected, accent, lang, onCancel: () => setMode("detail"), onSave: async (data) => {
    const ok = await onUpdateStrategy(selected.id, { ...data, aiReview: "", aiReviewedAt: null });
    if (ok) setMode("detail");
  } });
  if (mode === "newTrade" && selected) return /* @__PURE__ */ jsx(StrategyTradeForm, { strategy: selected, accent, customInstruments, onAddCustomInstrument, notify, lang, onCancel: () => setMode("detail"), onSave: async (trade) => {
    const ok = await onCreateTrade(trade);
    if (ok) setMode("detail");
  } });
  if (mode === "editTrade" && selected) {
    const trade = strategyTrades.find((t) => t.id === selectedTradeId) || null;
    return /* @__PURE__ */ jsx(StrategyTradeEditForm, {
      trade,
      strategy: selected,
      accent,
      measureMode,
      currency,
      customInstruments,
      onAddCustomInstrument,
      notify,
      lang,
      onCancel: () => {
        setSelectedTradeId(null);
        setMode("detail");
      },
      onSave: async (patch) => {
        const ok = await onUpdateTrade(selectedTradeId, patch);
        if (ok) {
          setSelectedTradeId(null);
          setMode("detail");
        }
        return ok;
      }
    });
  }
  if (mode === "closeTrade" && selected) {
    const trade = strategyTrades.find((t) => t.id === selectedTradeId) || null;
    return /* @__PURE__ */ jsx(StrategyCloseTrade, { trade, accent, measureMode, currency, notify, lang, onCancel: () => setMode("detail"), onSave: async (patch) => {
      const ok = await onCloseTrade(selectedTradeId, patch);
      if (ok) {
        setSelectedTradeId(null);
        setMode("detail");
      }
      return ok;
    } });
  }
  if (mode === "detail" && selected && stats) {
    const pf = stats.profitFactor === "Infinity" ? "∞" : stats.profitFactor == null ? "—" : stats.profitFactor.toFixed(2);
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 min-w-0", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setMode("list"), className: "w-9 h-9 rounded-full flex items-center justify-center shrink-0", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-[20px] truncate", style: { color: BASE.ink, fontWeight: 500 }, children: selected.name }),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] mt-1", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: ["v", selected.version || 1, " · ", stats.totalTrades, " ", isEn ? "trades" : pluralRu(stats.totalTrades, "сделка", "сделки", "сделок"), stats.openTrades ? ` · ${stats.openTrades} ${isEn ? "open" : "открыто"}` : ""] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setMode("edit"), "aria-label": isEn ? "Edit strategy" : "Редактировать стратегию", className: "w-9 h-9 rounded-full flex items-center justify-center", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: /* @__PURE__ */ jsx(PenLine, { size: 15 }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setDeleteConfirm(true), "aria-label": isEn ? "Delete strategy" : "Удалить стратегию", className: "w-9 h-9 rounded-full flex items-center justify-center", style: { border: `1px solid ${LOSS}35`, color: LOSS, background: `${LOSS}08` }, children: /* @__PURE__ */ jsx(Trash2, { size: 15 }) })
        ] })
      ] }),
      deleteConfirm && /* @__PURE__ */ jsx(Card, { className: "mb-4", style: { border: `1px solid ${LOSS}35`, background: `${LOSS}06` }, children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm mb-2", style: { color: BASE.ink, fontWeight: 500 }, children: isEn ? "Delete this strategy?" : "Удалить эту стратегию?" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed mb-4", style: { color: BASE.inkDim }, children: isEn
          ? "Strategy Lab trades and their screenshots will be deleted. Journal trades linked to this strategy and their screenshots will remain in the journal."
          : "Тестовые сделки Strategy Lab и их скриншоты будут удалены. Обычные сделки журнала, привязанные к этой стратегии, и их скриншоты останутся в журнале."
        }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { disabled: deleteBusy, onClick: () => setDeleteConfirm(false), className: "flex-1 py-2.5 rounded-full text-xs", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim, opacity: deleteBusy ? 0.5 : 1 }, children: isEn ? "Cancel" : "Отмена" }),
          /* @__PURE__ */ jsx("button", { disabled: deleteBusy, onClick: async () => {
            if (!selected || deleteBusy) return;
            setDeleteBusy(true);
            try {
              const ok = await onDeleteStrategy(selected.id);
              if (ok) {
                setDeleteConfirm(false);
                setSelectedId(null);
                setMode("list");
              }
            } finally {
              setDeleteBusy(false);
            }
          }, className: "flex-1 py-2.5 rounded-full text-xs", style: { background: LOSS, color: "#090909", fontWeight: 600, opacity: deleteBusy ? 0.65 : 1 }, children: deleteBusy ? isEn ? "Deleting…" : "Удаляю…" : isEn ? "Delete" : "Удалить" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "mb-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.14em] mb-2", style: { color: BASE.inkFaint }, children: isEn ? "Strategy rules" : "Правила стратегии" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed whitespace-pre-wrap", style: { color: BASE.inkDim }, children: selected.description })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 mb-4", children: [
        /* @__PURE__ */ jsx(StatCard, { label: isEn ? "WIN RATE" : "ВИНРЕЙТ", value: stats.winRate == null ? "—" : `${stats.winRate}%`, accent: BASE.ink }),
        /* @__PURE__ */ jsx(StatCard, { label: isEn ? "TOTAL RESULT" : "ОБЩИЙ РЕЗУЛЬТАТ", value: stats.resultSampleTrades ? formatStrategyTotal(stats.totalR, measureMode, currency) : "—", accent: stats.totalR >= 0 ? WIN : LOSS }),
        /* @__PURE__ */ jsx(StatCard, { label: "PROFIT FACTOR", value: pf, accent: BASE.ink }),
        /* @__PURE__ */ jsx(StatCard, { label: isEn ? "MAX DRAWDOWN" : "МАКС. ПРОСАДКА", value: stats.resultSampleTrades ? formatStrategyTotal(-stats.maxDrawdown, measureMode, currency) : "—", accent: stats.maxDrawdown > 0 ? LOSS : BASE.ink })
      ] }),
      stats.excludedResultTrades > 0 && /* @__PURE__ */ jsx("div", {
        className: "text-[10px] mb-3 px-1",
        style: { color: BASE.inkFaint },
        children: isEn
          ? `${stats.excludedResultTrades} closed result${stats.excludedResultTrades === 1 ? "" : "s"} use another unit and are excluded from result sums`
          : `${stats.excludedResultTrades} ${pluralRu(stats.excludedResultTrades, "закрытый результат в другой единице не входит", "закрытых результата в другой единице не входят", "закрытых результатов в другой единице не входят")} в суммы`
      }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-5 hscroll", children: [
        /* @__PURE__ */ jsx(Pill, { active: detailTab === "trades", onClick: () => setDetailTab("trades"), accent, children: isEn ? "Trades" : "Сделки" }),
        /* @__PURE__ */ jsx(Pill, { active: detailTab === "stats", onClick: () => setDetailTab("stats"), accent, children: isEn ? "Statistics" : "Статистика" }),
        /* @__PURE__ */ jsx(Pill, { active: detailTab === "ai", onClick: () => setDetailTab("ai"), accent, children: "Gemini" })
      ] }),
      detailTab === "trades" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setMode("newTrade"), className: "w-full mb-4 py-3 rounded-[18px] flex items-center justify-center gap-2 text-sm active:scale-[0.99]", style: { background: BASE.ink, color: "#000", fontWeight: 600 }, children: [
          /* @__PURE__ */ jsx(Plus, { size: 15 }),
          isEn ? "Add strategy trade" : "Добавить тестовую сделку"
        ] }),
        allSelectedTrades.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Target, title: isEn ? "No trades yet" : "Сделок пока нет", hint: isEn ? "Add a trade here or link a journal trade to this strategy." : "Добавь сделку здесь или привяжи обычную запись журнала к этой стратегии.", accent, compact: true }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [...allSelectedTrades].reverse().map((trade) => {
          const closed = isEntryClosed(trade);
          return /* @__PURE__ */ jsxs("div", { className: "rounded-[18px] px-3.5 py-3", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { background: closed ? outcomeColor(trade.outcome) : accent } }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: trade.instrument }),
              /* @__PURE__ */ jsx("span", { className: "text-[11px]", style: { color: BASE.inkDim }, children: trade.direction }),
              trade.timeframe && /* @__PURE__ */ jsx("span", { className: "text-[10px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: trade.timeframe }),
              /* @__PURE__ */ jsx("span", { className: "ml-auto text-[9px] px-2 py-0.5 rounded-full", style: { border: `1px solid ${BASE.line}`, color: trade.__source === "journal" ? BASE.inkDim : accent }, children: trade.__source === "journal" ? isEn ? "JOURNAL" : "ЖУРНАЛ" : "LAB" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-2 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
              trade.plannedRR != null && /* @__PURE__ */ jsx("span", { children: `plan 1:${trade.plannedRR.toFixed(2)}` }),
              closed && /* @__PURE__ */ jsx("span", { style: { color: outcomeColor(trade.outcome) }, children: formatStoredResult(trade, measureMode, currency) }),
              !closed && /* @__PURE__ */ jsx("span", { style: { color: accent }, children: isEn ? "OPEN" : "ОТКРЫТА" }),
              typeof trade.rulesFollowed === "boolean" && /* @__PURE__ */ jsx("span", { style: { color: trade.rulesFollowed ? WIN : LOSS }, children: trade.rulesFollowed ? isEn ? "rules ✓" : "по правилам ✓" : isEn ? "rules broken" : "нарушение правил" })
            ] }),
            (trade.screenshots?.length > 0 || trade.exitScreenshots?.length > 0) && /* @__PURE__ */ jsx("div", { className: "flex gap-2 mt-3 hscroll", children: [...(trade.screenshots || []), ...(trade.exitScreenshots || [])].slice(0, 6).map((src, i) => /* @__PURE__ */ jsx(ScreenshotImage, { src, className: "w-16 h-16 rounded-xl object-cover shrink-0", style: { border: `1px solid ${BASE.line}` }, alt: `strategy shot ${i + 1}` }, i)) }),
            trade.__source === "strategy" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-3", children: [
              /* @__PURE__ */ jsxs("button", {
                onClick: () => {
                  setSelectedTradeId(trade.id);
                  setMode("editTrade");
                },
                className: "flex-1 py-2 rounded-full text-xs flex items-center justify-center gap-1.5",
                style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim, background: BASE.surface2 },
                children: [
                  /* @__PURE__ */ jsx(PenLine, { size: 12 }),
                  isEn ? "Edit" : "Редактировать"
                ]
              }),
              !closed && /* @__PURE__ */ jsx("button", {
                onClick: () => {
                  setSelectedTradeId(trade.id);
                  setMode("closeTrade");
                },
                className: "flex-1 py-2 rounded-full text-xs",
                style: { border: `1px solid ${accent}55`, color: accent, background: `${accent}0B` },
                children: isEn ? "Close trade" : "Закрыть сделку"
              })
            ] })
          ] }, `${trade.__source}_${trade.id}`);
        }) })
      ] }),
      detailTab === "stats" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Card, { className: "mb-3", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.14em] mb-3", style: { color: BASE.inkFaint }, children: isEn ? "RESULT QUALITY" : "КАЧЕСТВО РЕЗУЛЬТАТА" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-y-3 gap-x-5 text-sm", children: [
            [isEn ? "Closed trades" : "Закрытых", stats.closedTrades],
            [isEn ? "Total result" : "Общий результат", formatStrategyTotal(stats.totalR, measureMode, currency)],
            [isEn ? "Total profit" : "Общая прибыль", formatStrategyTotal(stats.grossProfit, measureMode, currency)],
            [isEn ? "Total loss" : "Общий убыток", formatStrategyTotal(stats.grossLoss, measureMode, currency)],
            [isEn ? "Long total" : "Long итог", formatStrategyTotal(stats.long.totalR, measureMode, currency)],
            [isEn ? "Short total" : "Short итог", formatStrategyTotal(stats.short.totalR, measureMode, currency)]
          ].map(([label, value]) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] mb-1", style: { color: BASE.inkFaint }, children: label }),
            /* @__PURE__ */ jsx("div", { style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: value })
          ] }, label)) })
        ] }) }),
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.14em] mb-3", style: { color: BASE.inkFaint }, children: isEn ? "DATA SOURCES & RULES" : "ИСТОЧНИКИ И СОБЛЮДЕНИЕ ПРАВИЛ" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 rounded-full text-[10px]", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: `${isEn ? "Lab" : "Lab"} ${stats.directCount}` }),
            /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 rounded-full text-[10px]", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim }, children: `${isEn ? "Journal" : "Журнал"} ${stats.linkedCount}` })
          ] }),
          stats.rules.known === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: BASE.inkFaint }, children: isEn ? "Rule adherence has not been marked yet." : "Пока нет закрытых сделок с отметкой о соблюдении правил." }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-[16px] p-3", style: { background: `${WIN}08`, border: `1px solid ${WIN}25` }, children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px]", style: { color: BASE.inkFaint }, children: isEn ? "Rules followed" : "По правилам" }),
              /* @__PURE__ */ jsx("div", { className: "text-lg mt-1", style: { color: WIN, fontFamily: "var(--font-mono)" }, children: stats.rules.followedAvgR == null ? "—" : formatResult(stats.rules.followedAvgR, measureMode, currency) }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px]", style: { color: BASE.inkFaint }, children: `${stats.rules.followed} ${isEn ? "trades" : "сд."}` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-[16px] p-3", style: { background: `${LOSS}08`, border: `1px solid ${LOSS}25` }, children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px]", style: { color: BASE.inkFaint }, children: isEn ? "Rules broken" : "С нарушением" }),
              /* @__PURE__ */ jsx("div", { className: "text-lg mt-1", style: { color: LOSS, fontFamily: "var(--font-mono)" }, children: stats.rules.brokenAvgR == null ? "—" : formatResult(stats.rules.brokenAvgR, measureMode, currency) }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px]", style: { color: BASE.inkFaint }, children: `${stats.rules.broken} ${isEn ? "trades" : "сд."}` })
            ] })
          ] })
        ] }) })
      ] }),
      detailTab === "ai" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Card, { className: "mb-3", glowing: true, accent, children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 14, style: { color: accent } }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink }, children: isEn ? "Strategy review" : "Разбор стратегии" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed mb-4", style: { color: BASE.inkFaint }, children: isEn ? "The app calculates the statistics. Gemini only interprets the sample and checks whether the rules are testable." : "Цифры считает само приложение. Gemini только интерпретирует выборку и проверяет, насколько правила стратегии вообще можно нормально тестировать." }),
          /* @__PURE__ */ jsx("button", { disabled: aiBusy, onClick: async () => {
            setAiBusy(true);
            try {
              const review = await aiAnalyzeStrategy(selected, stats, allSelectedTrades, measureMode, currency, lang);
              await onUpdateStrategy(selected.id, { aiReview: review, aiReviewedAt: (/* @__PURE__ */ new Date()).toISOString() });
            } catch (e) {
              notify?.(isEn ? "Gemini strategy review is unavailable right now" : "Не удалось получить разбор Gemini");
            } finally {
              setAiBusy(false);
            }
          }, className: "w-full py-2.5 rounded-full text-sm", style: { background: accent, color: "#04120B", opacity: aiBusy ? 0.55 : 1, fontWeight: 600 }, children: aiBusy ? isEn ? "Analyzing..." : "Анализирую..." : selected.aiReview ? isEn ? "Refresh review" : "Обновить разбор" : isEn ? "Analyze strategy" : "Разобрать стратегию" })
        ] }) }),
        selected.aiReview ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { children: [
          selected.aiReviewedAt && /* @__PURE__ */ jsx("div", { className: "text-[10px] mb-3", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: new Date(selected.aiReviewedAt).toLocaleString(isEn ? "en-US" : "ru-RU") }),
          /* @__PURE__ */ jsx("p", { className: "text-sm leading-[1.75] whitespace-pre-wrap", style: { color: BASE.ink }, children: selected.aiReview })
        ] }) }) : /* @__PURE__ */ jsx(EmptyState, { icon: Brain, title: isEn ? "No AI review yet" : "Разбора пока нет", hint: isEn ? "Gemini can review the written rules even before the sample becomes large, but numerical conclusions stay limited by sample size." : "Gemini может проверить формулировку правил даже до большой выборки, но выводы по эффективности будут ограничены размером выборки.", accent, compact: true })
      ] })
    ] });
  }
  const activeStrategies = strategies.filter((s) => s.status !== "archived");
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "sec-cap text-[10px]", style: { color: BASE.inkDim }, children: isEn ? "STRATEGY LAB" : "СТРАТЕГИИ" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs mt-1.5", style: { color: BASE.inkFaint }, children: isEn ? "Test the technical side separately from trading psychology." : "Тестируй техническую часть отдельно от психологии торговли." })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => setMode("create"), className: "w-10 h-10 rounded-full flex items-center justify-center", style: { background: BASE.ink, color: "#000" }, children: /* @__PURE__ */ jsx(Plus, { size: 17 }) })
    ] }),
    activeStrategies.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Target, title: isEn ? "Create your first strategy" : "Создай первую стратегию", hint: isEn ? "Describe the rules, add technical trades, and mind.exe will calculate the sample separately." : "Опиши правила, добавляй технические сделки, а mind.exe будет отдельно считать эффективность выборки.", actionLabel: isEn ? "New strategy" : "Новая стратегия", onAction: () => setMode("create"), accent }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: activeStrategies.map((s) => {
      const st = calculateStrategyStats(s.id, strategyTrades, journalEntries, measureMode, currency);
      return /* @__PURE__ */ jsx("button", { onClick: () => openStrategy(s.id), className: "w-full text-left rounded-[20px] p-4 active:scale-[0.995] transition-transform", style: { background: BASE.surface, border: `1px solid ${BASE.line}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,.018)" }, children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[17px] truncate", style: { color: BASE.ink, fontWeight: 500 }, children: s.name }),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] mt-1", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: ["v", s.version || 1, " · ", st.totalTrades, " ", isEn ? "trades" : pluralRu(st.totalTrades, "сделка", "сделки", "сделок")] })
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { size: 16, style: { color: BASE.inkFaint } })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: [
          [isEn ? "WR" : "WR", st.winRate == null ? "—" : `${st.winRate}%`, BASE.ink],
          [isEn ? "PROFIT" : "ПРИБЫЛЬ", st.resultSampleTrades ? formatStrategyTotal(st.grossProfit, measureMode, currency) : "—", WIN],
          [isEn ? "TOTAL" : "ИТОГ", st.resultSampleTrades ? formatStrategyTotal(st.totalR, measureMode, currency) : "—", st.totalR >= 0 ? WIN : LOSS]
        ].map(([label, value, color]) => /* @__PURE__ */ jsxs("div", { className: "rounded-[16px] p-2.5", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx("div", { className: "text-[9px] mb-1", style: { color: BASE.inkFaint }, children: label }),
          /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color, fontFamily: "var(--font-mono)" }, children: value })
        ] }, label)) })
      ] }) }, s.id);
    }) })
  ] });
}
