// mind.exe — journal entry/edit/close/log UI.
// UI-only feature module. Persistence callbacks are supplied by app.js.

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles, NotebookText, Search, Trash2, ChevronRight, ChevronDown, Check,
  X as XIcon, PenLine, Plus, ImagePlus, Target, Camera
} from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import {
  computePlannedRR, computeRealizedRR, countExcludedResultEntries,
  formatPriceValue, formatResult, formatStoredResult,
  normalizeResultByCloseType, normalizeResultCurrency, normalizeResultMode,
  outcomeFromResult, resultEntriesForUnit, unitSymbol
} from "../../core/trade-math.js?v=1";
import {
  emotionClampPct, emotionScaleKeys, emotionConflict, isEntryClosed, normalizeEmotions
} from "../../core/journal-model.js?v=2";
import {
  BASE, WIN, LOSS, WARN, INSTRUMENTS, SETUP_TAGS, DIRECTION_LABEL
} from "../../config/app-config.js?v=1";
import { Pill, ScreenshotImage, EmptyState, StatCard } from "../../ui/primitives.js?v=2";
import { compressImageFile } from "../../ui/media-utils.js?v=1";
import { aiPolishText, aiRecognizeTradeFromImage } from "../../ai/trade-tools.js?v=1";

const ring = (accent) => `0 0 0 1px ${accent}35`;
const softLift = (accent) => `0 0 0 1px ${accent}35, 0 6px 20px ${accent}1F`;
function pluralRu(n, one, few, many) {
  const abs = Math.abs(Number(n) || 0) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}
function relTime(date) {
  const delta = Date.now() - date.getTime();
  if (delta < 6e4) return "сейчас";
  if (delta < 36e5) return `${Math.floor(delta / 6e4)} мин`;
  if (delta < 864e5) return `${Math.floor(delta / 36e5)} ч`;
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

const outcomeColor = (o) => o === "Win" ? WIN : o === "Loss" ? LOSS : BASE.inkDim;

function emotionLerpHex(c1, c2, t) {
  const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
  const ar = a >> 16 & 255, ag = a >> 8 & 255, ab = a & 255;
  const br = b >> 16 & 255, bg = b >> 8 & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t), g = Math.round(ag + (bg - ag) * t), bl = Math.round(ab + (bb - ab) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}
function emotionPositionColor(x, y) {
  const positivity = Math.max(0, Math.min(100, (x + (100 - y)) / 2)) / 100;
  return positivity < 0.5 ? emotionLerpHex(LOSS, WARN, positivity * 2) : emotionLerpHex(WARN, WIN, (positivity - 0.5) * 2);
}
// V5.5: the 3x3 band -> written state lookup used to live only inside EmotionGrid. It is now a
// plain helper so the Log can label a stored point (before AND after) with exactly the same words
// the trader saw when they placed it \u2014 one source of truth for the wording.
function emotionBand(v) {
  return v < 34 ? 0 : v < 67 ? 1 : 2;
}
// V5.7: `variant` selects which of the two label sets (entry vs exit) a point is read against.
// Both callers of this function must agree on which grid produced x/y, or the wrong wording gets
// shown \u2014 exit points always pass variant "exit" (see the Log call sites).
export function emotionStateText(x, y, t, variant = "entry") {
  if (x == null || y == null || isNaN(x) || isNaN(y)) return null;
  const eg = variant === "exit" ? t.newEntry.exitEmotionGrid : t.newEntry.emotionGrid;
  return eg.states[emotionBand(y) * 3 + emotionBand(x)] || null;
}
// V1.1 — вместо квадрата, по которому нужно было ставить точку, состояние набирается
// ползунками в процентах (уверенность 70%, страх 10% и т.д.). Модель данных НЕ менялась:
// x/y по-прежнему две оси 0-100, на которых держится вся аналитика (ta_zoneStats,
// pd_confidenceTension, скаттер паттернов, emotionStateText, Gemini-контекст). Проценты
// сводятся в те же x/y через emotionsToPoint, а сами значения дополнительно сохраняются
// в entry.emotions / entry.exitEmotions, чтобы при редактировании записи ползунки
// вставали на те же места, а не на восстановленное приближение.
// Проценты -> точка на прежних осях. Ось = разница противоположных полюсов, центр 50.
// confidence 70 / fear 10 -> x = 50 + (70-10)/2 = 80, то есть та же правая треть сетки,
// куда трейдер раньше ставил точку руками.
function emotionsToPoint(values, variant = "entry") {
  if (!values) return { x: null, y: null };
  const k = emotionScaleKeys(variant);
  const axis = (a, b) => Math.max(0, Math.min(100, Math.round(50 + (emotionClampPct(values[a]) - emotionClampPct(values[b])) / 2)));
  return { x: axis(k[0], k[1]), y: axis(k[2], k[3]) };
}
// Обратное восстановление — только для записей, созданных до V1.1: у них есть x/y, но нет
// сохранённых процентов. Однозначного разложения нет (x=80 это и 60/0, и 70/10), поэтому
// берётся простейший вариант: перевес идёт в один полюс, противоположный обнуляется.
// Точка на сетке при этом сохраняется без сдвига, аналитика не меняется.
export function pointToEmotions(x, y, variant = "entry") {
  if (x === null || x === void 0 || y === null || y === void 0 || isNaN(x) || isNaN(y)) return null;
  const k = emotionScaleKeys(variant);
  const dx = (x - 50) * 2;
  const dy = (y - 50) * 2;
  return {
    [k[0]]: dx >= 0 ? emotionClampPct(dx) : 0,
    [k[1]]: dx < 0 ? emotionClampPct(-dx) : 0,
    [k[2]]: dy >= 0 ? emotionClampPct(dy) : 0,
    [k[3]]: dy < 0 ? emotionClampPct(-dy) : 0
  };
}
// V1.2 — состояние читается ИЗ ПРОЦЕНТОВ, а не из клетки сетки. Прежняя схема сводила
// четыре шкалы в две оси и теряла конфликт: уверенность 70% + страх 100% давали x=35,
// y=85 и подпись «Спокойно и ровно», хотя это прямо противоположное — сильный внутренний
// конфликт. Ниже проценты остаются исходными данными, а x/y считаются из них только для
// графиков и зон, которые построены на осях (скаттер паттернов, ta_zoneStats).
//
// Конфликт = оба полюса одной оси набраны высоко одновременно. По каждой оси считается
// отдельно: страх/уверенность и напряжение/спокойствие.
// Общая насыщенность: насколько вообще что-то чувствовалось. Все ползунки на нуле —
// это не «нейтрально и ровно», это «ничего не отмечено», и подпись должна отличаться.
// V1.7 — вердикт по состоянию. Раньше подпись просто перечисляла проценты, которые и так
// видны на ползунках, и не давала никакой оценки. Теперь правила читают сами проценты и
// называют состояние словами плюс что с ним делать. Порядок проверок — от самого
// тревожного к самому спокойному: первое совпавшее правило и есть вердикт, поэтому
// сильный страх никогда не будет перекрыт формулировкой про ровное состояние.
//
// Пороги: 60 — «выражено», 40 — «слабо», 20 — «практически нет». Те же числа, что и в
// аналитике (EMOTION_IMPACT_HIGH/LOW), чтобы подпись и статистика не противоречили друг другу.
function emotionVerdictKey(values, variant = "entry") {
  const k = emotionScaleKeys(variant);
  const g = (n) => emotionClampPct(values[n]);
  const pos = g(k[0]);
  const neg = g(k[1]);
  const settled = g(k[2]);
  const agitated = g(k[3]);
  if (Math.max(pos, neg, settled, agitated) < 15) return "flat";
  const conflict = emotionConflict(values, variant).max;
  if (variant === "exit") {
    if (neg >= 60 && pos <= 40) return "disappointed";
    if (agitated >= 60 && settled <= 40) return "stung";
    if (conflict >= 50) return "mixed";
    if (pos >= 70 && neg <= 25 && agitated <= 30) return "elated";
    if (settled >= 55 && agitated <= 30 && neg <= 40) return "atPeace";
    return "neutral";
  }
  // Страх проверяется раньше конфликта: «боюсь сильнее, чем уверен» — это уже не
  // смешанное состояние, а решение, которое ведёт страх, и говорить надо именно об этом.
  if (neg >= 60 && neg > pos) return "fearLed";
  if (conflict >= 50) return "mixed";
  if (agitated >= 60 && settled <= 40) return "tense";
  if (pos >= 75 && neg <= 20 && agitated <= 25) return "overconfident";
  if (settled >= 55 && agitated <= 30 && neg <= 40) return "steady";
  return "neutral";
}
export function emotionVerdict(values, t, variant = "entry") {
  if (!values) return null;
  const eg = variant === "exit" ? t.newEntry.exitEmotionGrid : t.newEntry.emotionGrid;
  const key = emotionVerdictKey(values, variant);
  const v = eg.verdicts?.[key];
  if (!v) return null;
  return { key, label: v.label, advice: v.advice };
}
// Цвет вердикта. Привязан к самому вердикту, а не к балансу осей: состояние, которое
// названо тревожным, не должно подсвечиваться спокойным цветом.
var EMOTION_VERDICT_TONE = {
  flat: "faint",
  neutral: "faint",
  fearLed: "bad",
  mixed: "bad",
  stung: "bad",
  disappointed: "bad",
  tense: "warn",
  overconfident: "warn",
  elated: "warn",
  steady: "good",
  atPeace: "good"
};
// Прежнее перечисление процентов от сильного к слабому.
// Именно эта строка теперь показывается трейдеру и в журнале, вместо формулировки из
// 3x3-сетки, которая при смешанных состояниях врала.
// Используется в журнале, где нужна одна короткая строка: там показывается только
// название состояния, без рекомендации — она уместна в момент заполнения, а не в списке.
export function emotionValuesText(values, t, variant = "entry") {
  const v = emotionVerdict(values, t, variant);
  return v ? v.label : null;
}
// Цвет подписи. Сильный конфликт всегда тянет в предупреждающий, даже если по балансу
// осей состояние выглядит благополучным — иначе «страх 100%» подсвечивался бы зелёным.
export function emotionValuesColor(values, variant = "entry") {
  if (!values) return BASE.inkFaint;
  const tone = EMOTION_VERDICT_TONE[emotionVerdictKey(values, variant)] || "faint";
  return tone === "bad" ? LOSS : tone === "warn" ? WARN : tone === "good" ? WIN : BASE.inkFaint;
}
// Единая точка входа для журнала: у записей с процентами читаем проценты, у старых
// (до V1.1) процентов нет — для них остаётся прежняя формулировка по сетке.
export function entryStateText(values, x, y, t, variant = "entry") {
  const v = normalizeEmotions(values, variant);
  return v ? emotionValuesText(v, t, variant) : emotionStateText(x, y, t, variant);
}
export function entryStateColor(values, x, y, variant = "entry") {
  const v = normalizeEmotions(values, variant);
  return v ? emotionValuesColor(v, variant) : emotionPositionColor(x, y);
}
// V1.3 — дорожка больше НЕ рисуется фоном самого input. В WebKit (iOS) нативный трек
// перекрывает background-image элемента, из-за чего вместо тонкой линии выводилась
// сплошная белая «таблетка» во всю высоту контрола. Теперь дорожка и заполнение — это
// обычные div, а input лежит поверх прозрачным на всю ширину и с высотой под палец,
// поэтому перетаскивание и доступность остаются нативными, а вид полностью наш.
export function EmotionScales({ values, onChange, accent, t, variant = "entry" }) {
  const eg = variant === "exit" ? t.newEntry.exitEmotionGrid : t.newEntry.emotionGrid;
  const keys = emotionScaleKeys(variant);
  const labels = Array.isArray(eg.scales) ? eg.scales : keys;
  const has = !!values;
  const current = values || {};
  const verdict = has ? emotionVerdict(values, t, variant) : null;
  const stateColor = has ? emotionValuesColor(values, variant) : BASE.inkFaint;
  const setKey = (key, raw) => {
    const next = {};
    for (const k of keys) next[k] = emotionClampPct(current[k]);
    next[key] = emotionClampPct(raw);
    onChange(next);
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { className: "text-[11px] leading-relaxed mb-4", style: { color: BASE.inkFaint }, children: eg.hint }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: keys.map((key, i) => {
      const pct = emotionClampPct(current[key]);
      const active = has && pct > 0;
      return /* @__PURE__ */ jsxs("div", { className: "py-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[13px]", style: { color: active ? BASE.ink : BASE.inkDim }, children: labels[i] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[13px] tabular-nums", style: { color: active ? accent : BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
            pct,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative h-6 flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-0 h-[5px] rounded-full pointer-events-none", style: { background: "rgba(255,255,255,0.09)" } }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute left-0 h-[5px] rounded-full pointer-events-none",
              style: { width: `${pct}%`, background: accent, opacity: active ? 1 : 0 }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute w-[18px] h-[18px] rounded-full pointer-events-none",
              // calc сдвигает бегунок внутрь дорожки на краях, иначе на 0% и 100%
              // половина кружка вылезает за границу строки.
              style: {
                left: `calc(${pct}% - ${pct * 0.18}px)`,
                background: active ? accent : BASE.surface2,
                border: `1px solid ${active ? accent : BASE.line}`,
                boxShadow: active ? `0 0 0 5px ${accent}22, 0 1px 4px rgba(0,0,0,0.5)` : "0 1px 4px rgba(0,0,0,0.5)"
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: 0,
              max: 100,
              step: 1,
              value: pct,
              onChange: (e) => setKey(key, e.target.value),
              "aria-label": labels[i],
              className: "emotion-range absolute inset-0 w-full"
            }
          )
        ] })
      ] }, key);
    }) }),
    has && verdict && /* @__PURE__ */ jsxs("div", { className: "mt-5 rounded-xl px-3.5 py-3", style: { border: `1px solid ${stateColor}33`, background: `${stateColor}0D` }, children: [
      /* @__PURE__ */ jsx("p", { className: "text-[13px] leading-snug mb-1", style: { color: stateColor, fontFamily: "var(--font-display)", fontWeight: 600 }, children: verdict.label }),
      /* @__PURE__ */ jsx("p", { className: "text-[12px] leading-relaxed", style: { color: BASE.inkDim }, children: verdict.advice })
    ] })
  ] });
}
export function PickerField({ value, onChange, options, placeholder, accent, allowCustom, flat, mono, onCustomAdd }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const closeIfOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", closeIfOutside);
    document.addEventListener("touchstart", closeIfOutside);
    return () => {
      document.removeEventListener("mousedown", closeIfOutside);
      document.removeEventListener("touchstart", closeIfOutside);
    };
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
  const rowStyle = (o) => ({ color: BASE.ink, fontFamily: mono ? "var(--font-mono)" : "inherit", background: value === o ? `${accent}12` : "transparent" });
  return /* @__PURE__ */ jsx("div", { ref: containerRef, className: "relative", children: !open ? /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setOpen(true), className: "w-full flex items-center justify-between border-b py-2.5 text-sm text-left", style: { borderColor: BASE.line }, children: [
    /* @__PURE__ */ jsx("span", { style: { color: value ? BASE.ink : BASE.inkDim, fontFamily: value && mono ? "var(--font-mono)" : "inherit" }, children: value || placeholder }),
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
    /* @__PURE__ */ jsx("div", { className: "max-h-52 overflow-y-auto vscroll", children: filtered ? /* @__PURE__ */ jsxs(Fragment, { children: [
      filtered.map((o) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => select(o), className: "w-full text-left px-3 py-2.5 text-sm transition-colors duration-100", style: rowStyle(o), children: o }, o)),
      allowCustom && query.trim() && !exactMatch && /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => addCustom(query.trim()), className: "w-full text-left px-3 py-2.5 text-sm flex items-center gap-2", style: { color: accent }, children: [
        /* @__PURE__ */ jsx(Plus, { size: 13 }),
        " \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \xAB",
        query.trim(),
        "\xBB"
      ] }),
      filtered.length === 0 && !allowCustom && /* @__PURE__ */ jsx("div", { className: "px-3 py-3 text-xs", style: { color: BASE.inkFaint }, children: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E" })
    ] }) : flat ? options.map((o) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => select(o), className: "w-full text-left px-3 py-2.5 text-sm transition-colors duration-100", style: rowStyle(o), children: o }, o)) : options.map((g) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "px-3 pt-2.5 pb-1 text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint, fontFamily: "var(--font-display)" }, children: g.category }),
      g.items.map((o) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => select(o), className: "w-full text-left px-3 py-2 text-sm transition-colors duration-100", style: rowStyle(o), children: o }, o))
    ] }, g.category)) })
  ] }) });
}

export function StrategySelect({ value, onChange, strategies, accent, placeholder, allowNone = true }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open]);
  const selected = (strategies || []).find((s) => s.id === value);
  return /* @__PURE__ */ jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxs("button", {
      type: "button",
      onClick: () => setOpen((v) => !v),
      className: "w-full flex items-center justify-between border-b py-2.5 text-sm text-left",
      style: { borderColor: BASE.line },
      children: [
        /* @__PURE__ */ jsxs("span", { className: "min-w-0 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Target, { size: 13, style: { color: selected ? accent : BASE.inkFaint } }),
          /* @__PURE__ */ jsx("span", { className: "truncate", style: { color: selected ? BASE.ink : BASE.inkDim }, children: selected ? selected.name : placeholder || "Не выбрана" })
        ] }),
        /* @__PURE__ */ jsx(ChevronDown, { size: 14, style: { color: BASE.inkFaint, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s ease" } })
      ]
    }),
    open && /* @__PURE__ */ jsxs("div", {
      className: "absolute z-40 left-0 right-0 top-[calc(100%+6px)] rounded-[18px] overflow-hidden",
      style: { background: BASE.surface2, border: `1px solid ${BASE.line}`, boxShadow: "0 18px 40px rgba(0,0,0,.55)" },
      children: [
        allowNone && /* @__PURE__ */ jsx("button", {
          type: "button",
          onClick: () => {
            onChange("");
            setOpen(false);
          },
          className: "w-full px-3 py-2.5 text-left text-sm",
          style: { color: !value ? BASE.ink : BASE.inkDim, background: !value ? `${accent}10` : "transparent" },
          children: "Без стратегии"
        }),
        (strategies || []).length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-3 py-3 text-xs", style: { color: BASE.inkFaint }, children: "Сначала создай стратегию во вкладке «Стратегии»." }) : (strategies || []).map((s) => /* @__PURE__ */ jsxs("button", {
          type: "button",
          onClick: () => {
            onChange(s.id);
            setOpen(false);
          },
          className: "w-full px-3 py-2.5 text-left flex items-center justify-between gap-3",
          style: { color: BASE.ink, background: value === s.id ? `${accent}10` : "transparent", borderTop: `1px solid ${BASE.line}` },
          children: [
            /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("span", { className: "block text-sm truncate", children: s.name }),
              /* @__PURE__ */ jsxs("span", { className: "block text-[10px] mt-0.5", style: { color: BASE.inkFaint }, children: ["v", s.version || 1, s.status === "archived" ? " · архив" : ""] })
            ] }),
            value === s.id && /* @__PURE__ */ jsx(Check, { size: 14, style: { color: accent } })
          ]
        }, s.id))
      ]
    })
  ] });
}

function PolishButton({ accent, notify, text, onPolished }) {
  const [busy, setBusy] = useState(false);
  const handleClick = async () => {
    if (!text || !text.trim()) {
      notify?.("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043D\u0430\u043F\u0438\u0448\u0438 \u0442\u0435\u043A\u0441\u0442");
      return;
    }
    setBusy(true);
    try {
      const polished = await aiPolishText(text);
      onPolished(polished);
    } catch {
      notify?.("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0442\u0435\u043A\u0441\u0442");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: handleClick,
      disabled: busy,
      title: "\u0423\u043B\u0443\u0447\u0448\u0438\u0442\u044C \u0442\u0435\u043A\u0441\u0442 \u0441 \u0418\u0418",
      className: "shrink-0 flex items-center gap-1 px-2 h-6 rounded-full text-[10px] transition-all active:scale-90",
      style: { background: `${accent}12`, color: accent, border: `1px solid ${accent}30`, opacity: busy ? 0.55 : 1 },
      children: [/* @__PURE__ */ jsx(Sparkles, { size: 11 }), busy ? "\u2026" : ""]
    }
  );
}
export function NewEntry({ onSave, accent, customInstruments, customTags, onAddCustomInstrument, onAddCustomTag, strategies = [], notify, t, lang = "ru" }) {
  const [instrument, setInstrument] = useState("");
  const [direction, setDirection] = useState("Long");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [tag, setTag] = useState("");
  const [strategyId, setStrategyId] = useState("");
  // V1.1 — состоянием теперь владеют проценты; x/y выводятся из них перед сохранением,
  // поэтому формат записи в журнале не изменился.
  const [emotions, setEmotions] = useState(null);
  const point = emotionsToPoint(emotions, "entry");
  const [pull, setPull] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [recognizing, setRecognizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const recognizeInputRef = useRef(null);
  const MAX_SHOTS = 4;
  const handleRecognizeFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      notify(`\xAB${file.name}\xBB \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439 (\u043C\u0430\u043A\u0441. 15 \u041C\u0411)`);
      return;
    }
    if (screenshots.length >= MAX_SHOTS) {
      notify(`\u041C\u0430\u043A\u0441\u0438\u043C\u0443\u043C ${MAX_SHOTS} \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u0430`);
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
        notify(check.ok ? "\u0421\u0434\u0435\u043B\u043A\u0430 \u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D\u0430 \u2014 \u043F\u0440\u043E\u0432\u0435\u0440\u044C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F" : "\u041F\u0440\u043E\u0432\u0435\u0440\u044C \u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D\u043D\u044B\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F");
      } else {
        notify("\u0421\u0434\u0435\u043B\u043A\u0430 \u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D\u0430 \u0447\u0430\u0441\u0442\u0438\u0447\u043D\u043E \u2014 \u0434\u043E\u0437\u0430\u043F\u043E\u043B\u043D\u0438 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u043E\u0435 \u0432\u0440\u0443\u0447\u043D\u0443\u044E");
      }
    } catch {
      notify("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u0442\u044C \u0441\u0434\u0435\u043B\u043A\u0443. \u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0432\u0440\u0443\u0447\u043D\u0443\u044E.");
    } finally {
      setRecognizing(false);
    }
  };
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
  const submit = async () => {
    if (!instrument.trim() || point.x === null || saving) return;
    const en = parseFloat(entryPrice), sl = parseFloat(stopLoss), tp = parseFloat(takeProfit);
    const rrCheck = computePlannedRR(direction, en, sl, tp);
    if (!rrCheck.ok) {
      notify(rrCheck.error || "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u043F\u043B\u0430\u043D SL/TP");
      return;
    }
    setSaving(true);
    try {
      const ok = await onSave({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        status: "open",
        instrument: instrument.trim(),
        direction,
        outcome: null,
        r: null,
        tag: tag.trim() || "\u041E\u0431\u0449\u0435\u0435",
        strategyId: strategyId || null,
        x: point.x,
        y: point.y,
        emotions,
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
      if (!ok) return;
      setInstrument("");
      setDirection("Long");
      setTag("");
      setStrategyId("");
      setEmotions(null);
      setPull("");
      setScreenshots([]);
      setEntryPrice("");
      setStopLoss("");
      setTakeProfit("");
    } finally {
      setSaving(false);
    }
  };
  const L = ({ children }) => /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-1.5", style: { color: BASE.inkFaint, fontFamily: "var(--font-display)" }, children });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "sec-cap text-[10px] text-center mb-4", style: { color: BASE.inkDim, fontFamily: "var(--font-display)", fontWeight: 400 }, children: [
      " ",
      t.newEntry.title
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start", children: [
    /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => recognizeInputRef.current?.click(),
          disabled: recognizing,
          className: "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all active:scale-95",
          style: { border: `1px solid ${accent}40`, color: accent, background: `${accent}0d`, opacity: recognizing ? 0.6 : 1, fontFamily: "var(--font-display)" },
          children: [
            /* @__PURE__ */ jsx(Camera, { size: 13 }),
            recognizing ? "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0435\u043C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u2026" : "\u0420\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u0442\u044C \u0441\u0434\u0435\u043B\u043A\u0443 \u043F\u043E \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u0443"
          ]
        }
      ),
      /* @__PURE__ */ jsx("input", { ref: recognizeInputRef, type: "file", accept: "image/*", onChange: handleRecognizeFile, className: "hidden" })
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
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx(L, { children: lang === "en" ? "Strategy (optional)" : "Стратегия (необязательно)" }),
      /* @__PURE__ */ jsx(StrategySelect, { value: strategyId, onChange: setStrategyId, strategies: strategies.filter((s) => s.status !== "archived"), accent, placeholder: lang === "en" ? "Not linked" : "Не привязана" }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] mt-1.5", style: { color: BASE.inkFaint }, children: lang === "en" ? "If selected, this journal trade will automatically be included in that strategy's statistics." : "Если выбрать стратегию, эта сделка автоматически попадёт в её статистику без создания второй копии." })
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
            style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" }
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
        /* @__PURE__ */ jsx(L, { children: t.home.stopLoss }),
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
            style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: t.home.takeProfit }),
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
            style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-5 text-xs", style: { color: plannedRRResult.ok ? accent : plannedRRResult.error ? LOSS : BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: plannedRRResult.ok ? `Planned RR \u2248 1:${plannedRRResult.rr.toFixed(2)}` : plannedRRResult.error || "\u0423\u043A\u0430\u0436\u0438 Entry, SL \u0438 TP \u2014 RR \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.screenshots(MAX_SHOTS) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        screenshots.map((src, i) => /* @__PURE__ */ jsxs("div", { className: "relative w-20 h-20 rounded-xl overflow-hidden shrink-0", style: { border: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx(ScreenshotImage, { src, alt: `\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 ${i + 1}`, className: "w-full h-full object-cover block" }),
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
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.pullQuestion }),
        /* @__PURE__ */ jsx(PolishButton, { accent, notify, text: pull, onPolished: setPull })
      ] }),
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
    /* @__PURE__ */ jsx(EmotionScales, { values: emotions, onChange: setEmotions, accent, t })
    ] })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: submit,
        disabled: !canSave || saving,
        className: "w-full mt-6 py-3 rounded-full text-sm transition-all active:scale-[0.98] lg:max-w-sm lg:mx-auto lg:block",
        style: {
          background: accent,
          color: "#06120F",
          opacity: canSave && !saving ? 1 : 0.45,
          cursor: canSave && !saving ? "pointer" : "not-allowed",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          boxShadow: canSave && !saving ? softLift(accent) : "none"
        },
        children: saving ? lang === "en" ? "Saving…" : "Сохраняю…" : t.newEntry.save
      }
    )
  ] });
}
export function CloseTrade({ entry, onSave, onCancel, accent, measureMode, currency, notify, t }) {
  const hasPlan = entry && typeof entry.entryPrice === "number" && typeof entry.stopLoss === "number" && typeof entry.takeProfit === "number";
  const [closeType, setCloseType] = useState("manual");
  const [manualExit, setManualExit] = useState("");
  const [resultR, setResultR] = useState("");
  const [lesson, setLesson] = useState("");
  const [exitScreenshots, setExitScreenshots] = useState([]);
  const [saving, setSaving] = useState(false);
  // V5.5: state after the trade. Deliberately NOT part of canSave \u2014 forcing it would push people
  // to tap something arbitrary just to close a trade, which is worse than a null.
  const [exitEmotions, setExitEmotions] = useState(null);
  const exitPoint = emotionsToPoint(exitEmotions, "exit");
  const fileInputRef = useRef(null);
  const MAX_SHOTS = 4;
  const L = ({ children }) => /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-1.5", style: { color: BASE.inkFaint, fontFamily: "var(--font-display)" }, children });
  const effectiveExit = hasPlan ? closeType === "tp" ? entry.takeProfit : closeType === "sl" ? entry.stopLoss : manualExit === "" ? null : parseFloat(manualExit) : manualExit === "" ? null : parseFloat(manualExit);
  const realizedRR = hasPlan && effectiveExit != null && !isNaN(effectiveExit) ? computeRealizedRR(entry.direction, entry.entryPrice, entry.stopLoss, effectiveExit) : null;
  const resultNum = resultR === "" ? null : parseFloat(resultR);
  const normalizedResult = resultNum == null || isNaN(resultNum)
    ? null
    : normalizeResultByCloseType(hasPlan ? closeType : "manual", resultNum);
  const derivedOutcome = outcomeFromResult(normalizedResult);
  const canSave = normalizedResult != null && !isNaN(normalizedResult);
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
  const submit = async () => {
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
        outcome: derivedOutcome,
        lesson: lesson.trim() || "\u2014",
        exitDate: /* @__PURE__ */ new Date(),
        exitX: exitPoint.x,
        exitY: exitPoint.y,
        exitEmotions,
        exitScreenshots
      });
    } finally {
      setSaving(false);
    }
  };
  if (!entry) return null;
  const closeTypeOptions = [
    { id: "tp", label: "\u041F\u043E Take Profit" },
    { id: "sl", label: "\u041F\u043E Stop Loss" },
    { id: "manual", label: "\u0412\u0440\u0443\u0447\u043D\u0443\u044E" }
  ];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "sec-cap text-[10px] text-center mb-1", style: { color: BASE.inkDim, fontFamily: "var(--font-display)", fontWeight: 400 }, children: [
      " \u0417\u0430\u043A\u0440\u044B\u0442\u0438\u0435 \u0441\u0434\u0435\u043B\u043A\u0438"
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-center mb-5", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
      entry.instrument, " \xB7 ", DIRECTION_LABEL[entry.direction],
      entry.entryPrice != null ? ` \xB7 \u0432\u0445\u043E\u0434 ${formatPriceValue(entry.entryPrice)}` : "",
      hasPlan ? ` \xB7 \u043F\u043B\u0430\u043D 1:${entry.plannedRR.toFixed(2)}` : ""
    ] }),
    hasPlan && /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-4 text-xs", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
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
          style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" }
        }
      )
    ] }),
    hasPlan && /* @__PURE__ */ jsx("div", { className: "mb-4 text-xs", style: { color: realizedRR != null ? accent : BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: realizedRR != null ? `\u0420\u0430\u0441\u0447\u0451\u0442\u043D\u044B\u0439 RR \u043F\u043E \u0446\u0435\u043D\u0430\u043C: ${realizedRR >= 0 ? "+" : ""}${realizedRR.toFixed(2)}R` : "RR \u043F\u043E \u0446\u0435\u043D\u0430\u043C \u2014" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.result(unitSymbol(measureMode, currency)) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: resultR,
          onChange: (e) => setResultR(e.target.value),
          placeholder: hasPlan && closeType !== "manual"
            ? (measureMode === "R" ? "1" : "30")
            : (measureMode === "R" ? "1.5 / -1" : "150 / -80"),
          type: "number",
          step: "0.1",
          inputMode: "decimal",
          className: "w-full bg-transparent border-b outline-none py-2 text-sm",
          style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" }
        }
      ),
      /* @__PURE__ */ jsx("p", {
        className: "text-[11px] mt-1.5",
        style: {
          color: normalizedResult == null ? BASE.inkFaint : normalizedResult < 0 ? LOSS : normalizedResult > 0 ? WIN : BASE.inkDim,
          fontFamily: "var(--font-mono)"
        },
        children: normalizedResult == null
          ? "\u0423\u043a\u0430\u0436\u0438 \u0438\u0442\u043e\u0433\u043e\u0432\u0443\u044e \u0441\u0443\u043c\u043c\u0443"
          : hasPlan && closeType === "sl"
            ? `SL \u2192 ${formatResult(normalizedResult, measureMode, currency)}`
            : hasPlan && closeType === "tp"
              ? `TP \u2192 ${formatResult(normalizedResult, measureMode, currency)}`
              : "\u0412\u0440\u0443\u0447\u043d\u0443\u044e: \u0437\u043d\u0430\u043a \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0430 \u0437\u0430\u0434\u0430\u0451\u0448\u044c \u0441\u0430\u043c"
      })
    ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: "\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B \u0432\u044B\u0445\u043E\u0434\u0430" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        exitScreenshots.map((src, i) => /* @__PURE__ */ jsxs("div", { className: "relative w-20 h-20 rounded-xl overflow-hidden shrink-0", style: { border: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx(ScreenshotImage, { src, alt: `\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 ${i + 1}`, className: "w-full h-full object-cover block" }),
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
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.lessonQuestion }),
        /* @__PURE__ */ jsx(PolishButton, { accent, notify, text: lesson, onPolished: setLesson })
      ] }),
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
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.emotionExitQuestion }),
      /* @__PURE__ */ jsx(EmotionScales, { values: exitEmotions, onChange: setExitEmotions, accent, t, variant: "exit" }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] mt-2", style: { color: BASE.inkFaint }, children: t.newEntry.emotionExitOptional })
    ] })
    ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onCancel,
          className: "px-4 py-3 rounded-full text-sm transition-all active:scale-[0.98]",
          style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim, fontFamily: "var(--font-display)" },
          children: "\u041E\u0442\u043C\u0435\u043D\u0430"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: submit,
          disabled: !canSave || saving,
          className: "flex-1 py-3 rounded-full text-sm transition-all active:scale-[0.98]",
          style: {
            background: accent,
            color: "#06120F",
            opacity: canSave && !saving ? 1 : 0.45,
            cursor: canSave && !saving ? "pointer" : "not-allowed",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            boxShadow: canSave && !saving ? softLift(accent) : "none"
          },
          children: saving ? "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u2026" : "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0441\u0434\u0435\u043B\u043A\u0443"
        }
      )
    ] })
  ] });
}
export function EditTrade({ entry, onSave, onCancel, accent, customInstruments, customTags, onAddCustomInstrument, onAddCustomTag, strategies = [], measureMode, currency, notify, t, lang = "ru" }) {
  const editResultMode = normalizeResultMode(entry?.resultMode) || measureMode;
  const editResultCurrency = editResultMode === "currency"
    ? normalizeResultCurrency(entry?.resultCurrency) || currency
    : null;
  const [instrument, setInstrument] = useState(entry?.instrument || "");
  const [direction, setDirection] = useState(entry?.direction || "Long");
  const [tag, setTag] = useState(entry?.tag === "\u041E\u0431\u0449\u0435\u0435" ? "" : entry?.tag || "");
  const [strategyId, setStrategyId] = useState(entry?.strategyId || "");
  const [entryPrice, setEntryPrice] = useState(entry?.entryPrice != null ? String(entry.entryPrice) : "");
  const [stopLoss, setStopLoss] = useState(entry?.stopLoss != null ? String(entry.stopLoss) : "");
  const [takeProfit, setTakeProfit] = useState(entry?.takeProfit != null ? String(entry.takeProfit) : "");
  // V1.1 — для записей, созданных до перехода на ползунки, процентов нет: восстанавливаем
  // их приближённо из x/y, чтобы редактирование не открывалось с пустыми шкалами.
  const [emotions, setEmotions] = useState(
    () => normalizeEmotions(entry?.emotions, "entry") || pointToEmotions(entry?.x ?? null, entry?.y ?? null, "entry")
  );
  const point = emotionsToPoint(emotions, "entry");
  const [pull, setPull] = useState(entry?.pull === "\u2014" ? "" : entry?.pull || "");
  const [screenshots, setScreenshots] = useState(entry?.screenshots || []);
  const [closeType, setCloseType] = useState(entry?.closeType || "manual");
  const [manualExit, setManualExit] = useState(entry?.exitPrice != null ? String(entry.exitPrice) : "");
  const [resultR, setResultR] = useState(
    entry?.r != null
      ? String(entry?.closeType === "sl" || entry?.closeType === "tp" ? Math.abs(entry.r) : entry.r)
      : ""
  );
  const [lesson, setLesson] = useState(entry?.lesson === "\u2014" ? "" : entry?.lesson || "");
  const [exitScreenshots, setExitScreenshots] = useState(entry?.exitScreenshots || []);
  const [saving, setSaving] = useState(false);
  // V5.5: editable so a trade closed before this field existed can be completed retroactively.
  const [exitEmotions, setExitEmotions] = useState(
    () => normalizeEmotions(entry?.exitEmotions, "exit") || pointToEmotions(entry?.exitX ?? null, entry?.exitY ?? null, "exit")
  );
  const exitPoint = emotionsToPoint(exitEmotions, "exit");
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
  const normalizedResult = resultNum == null || isNaN(resultNum)
    ? null
    : normalizeResultByCloseType(hasPlanNow ? closeType : "manual", resultNum);
  const derivedOutcome = outcomeFromResult(normalizedResult);
  const canSave = instrument.trim() && point.x !== null && normalizedResult != null && !isNaN(normalizedResult);
  const L = ({ children }) => /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-1.5", style: { color: BASE.inkFaint, fontFamily: "var(--font-display)" }, children });
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
      /* @__PURE__ */ jsx(ScreenshotImage, { src, alt: `\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 ${i + 1}`, className: "w-full h-full object-cover block" }),
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
  const submit = async () => {
    if (!canSave || saving) return;
    const num = (s) => s === "" || isNaN(parseFloat(s)) ? null : parseFloat(s);
    setSaving(true);
    try {
      await onSave({
        instrument: instrument.trim(),
        direction,
        tag: tag.trim() || "\u041E\u0431\u0449\u0435\u0435",
        strategyId: strategyId || null,
        x: point.x,
        y: point.y,
        emotions,
        pull: pull.trim() || "\u2014",
        screenshots,
        entryPrice: num(entryPrice),
        stopLoss: hasPlanNow ? parseFloat(stopLoss) : null,
        takeProfit: hasPlanNow ? parseFloat(takeProfit) : null,
        plannedRR: hasPlanNow ? plannedRRResult.rr : null,
        closeType: hasPlanNow ? closeType : "manual",
        exitPrice: effectiveExit,
        realizedRR,
        r: normalizedResult,
        resultMode: editResultMode,
        resultCurrency: editResultMode === "currency" ? editResultCurrency : null,
        outcome: derivedOutcome,
        lesson: lesson.trim() || "\u2014",
        exitX: exitPoint.x,
        exitY: exitPoint.y,
        exitEmotions,
        exitScreenshots
      });
    } finally {
      setSaving(false);
    }
  };
  if (!entry) return null;
  const closeTypeOptions = [
    { id: "tp", label: "\u041F\u043E TP" },
    { id: "sl", label: "\u041F\u043E SL" },
    { id: "manual", label: "\u0412\u0440\u0443\u0447\u043D\u0443\u044E" }
  ];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "sec-cap text-[10px] text-center mb-4", style: { color: BASE.inkDim, fontFamily: "var(--font-display)", fontWeight: 400 }, children: [
      " \u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0441\u0434\u0435\u043B\u043A\u0438"
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-2", style: { color: BASE.inkFaint }, children: t.home.entrySection }),
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
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx(L, { children: lang === "en" ? "Strategy (optional)" : "Стратегия (необязательно)" }),
      /* @__PURE__ */ jsx(StrategySelect, { value: strategyId, onChange: setStrategyId, strategies, accent, placeholder: lang === "en" ? "Not linked" : "Не привязана" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.entry }),
        /* @__PURE__ */ jsx("input", { value: entryPrice, onChange: (e) => setEntryPrice(e.target.value), type: "number", step: "any", inputMode: "decimal", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" } })
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
        /* @__PURE__ */ jsx(L, { children: t.home.stopLoss }),
        /* @__PURE__ */ jsx("input", { value: stopLoss, onChange: (e) => setStopLoss(e.target.value), type: "number", step: "any", inputMode: "decimal", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" } })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(L, { children: t.home.takeProfit }),
        /* @__PURE__ */ jsx("input", { value: takeProfit, onChange: (e) => setTakeProfit(e.target.value), type: "number", step: "any", inputMode: "decimal", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" } })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 text-xs", style: { color: hasPlanNow ? accent : plannedRRResult.error ? LOSS : BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: hasPlanNow ? `Planned RR \u2248 1:${plannedRRResult.rr.toFixed(2)}` : plannedRRResult.error || "\u0411\u0435\u0437 SL/TP \u2014 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0431\u0443\u0434\u0435\u0442 \u0432\u0432\u043E\u0434\u0438\u0442\u044C\u0441\u044F \u0432\u0440\u0443\u0447\u043D\u0443\u044E" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.screenshots(MAX_SHOTS) }),
      /* @__PURE__ */ jsx(ShotRow, { list: screenshots, setList: setScreenshots, fileRef: entryFileRef, onFiles: makeHandleFiles(screenshots, setScreenshots) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.pullQuestion }),
        /* @__PURE__ */ jsx(PolishButton, { accent, notify, text: pull, onPolished: setPull })
      ] }),
      /* @__PURE__ */ jsx("textarea", { value: pull, onChange: (e) => setPull(e.target.value), rows: 2, placeholder: t.newEntry.pullPlaceholder, className: "w-full bg-transparent border rounded-xl outline-none p-3 text-sm resize-none", style: { borderColor: BASE.line, color: BASE.ink } })
    ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(L, { children: t.newEntry.emotionQuestion }),
    /* @__PURE__ */ jsx(EmotionScales, { values: emotions, onChange: setEmotions, accent, t }),
    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mt-6 mb-2", style: { color: BASE.inkFaint }, children: t.home.exitSection }),
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
      /* @__PURE__ */ jsx("input", { value: manualExit, onChange: (e) => setManualExit(e.target.value), type: "number", step: "any", inputMode: "decimal", className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" } })
    ] }),
    hasPlanNow && /* @__PURE__ */ jsx("div", { className: "mb-4 text-xs", style: { color: realizedRR != null ? accent : BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: realizedRR != null ? `\u0420\u0430\u0441\u0447\u0451\u0442\u043D\u044B\u0439 RR \u043F\u043E \u0446\u0435\u043D\u0430\u043C: ${realizedRR >= 0 ? "+" : ""}${realizedRR.toFixed(2)}R` : "RR \u043F\u043E \u0446\u0435\u043D\u0430\u043C \u2014" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.result(unitSymbol(editResultMode, editResultCurrency || currency)) }),
      /* @__PURE__ */ jsx("input", {
        value: resultR,
        onChange: (e) => setResultR(e.target.value),
        type: "number",
        step: "0.1",
        inputMode: "decimal",
        placeholder: hasPlanNow && closeType !== "manual"
          ? (editResultMode === "R" ? "1" : "30")
          : (editResultMode === "R" ? "1.5 / -1" : "150 / -80"),
        className: "w-full bg-transparent border-b outline-none py-2 text-sm",
        style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" }
      }),
      /* @__PURE__ */ jsx("p", {
        className: "text-[11px] mt-1.5",
        style: {
          color: normalizedResult == null ? BASE.inkFaint : normalizedResult < 0 ? LOSS : normalizedResult > 0 ? WIN : BASE.inkDim,
          fontFamily: "var(--font-mono)"
        },
        children: normalizedResult == null
          ? "\u0423\u043a\u0430\u0436\u0438 \u0438\u0442\u043e\u0433\u043e\u0432\u0443\u044e \u0441\u0443\u043c\u043c\u0443"
          : hasPlanNow && closeType === "sl"
            ? `SL \u2192 ${formatResult(normalizedResult, editResultMode, editResultCurrency || currency)}`
            : hasPlanNow && closeType === "tp"
              ? `TP \u2192 ${formatResult(normalizedResult, editResultMode, editResultCurrency || currency)}`
              : "\u0412\u0440\u0443\u0447\u043d\u0443\u044e: \u0437\u043d\u0430\u043a \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0430 \u0437\u0430\u0434\u0430\u0451\u0448\u044c \u0441\u0430\u043c"
      })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: "\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B \u0432\u044B\u0445\u043E\u0434\u0430" }),
      /* @__PURE__ */ jsx(ShotRow, { list: exitScreenshots, setList: setExitScreenshots, fileRef: exitFileRef, onFiles: makeHandleFiles(exitScreenshots, setExitScreenshots) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx(L, { children: t.newEntry.lessonQuestion }),
        /* @__PURE__ */ jsx(PolishButton, { accent, notify, text: lesson, onPolished: setLesson })
      ] }),
      /* @__PURE__ */ jsx("textarea", { value: lesson, onChange: (e) => setLesson(e.target.value), rows: 2, placeholder: t.newEntry.lessonPlaceholder, className: "w-full bg-transparent border rounded-xl outline-none p-3 text-sm resize-none", style: { borderColor: BASE.line, color: BASE.ink } })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx(L, { children: t.newEntry.emotionExitQuestion }),
      /* @__PURE__ */ jsx(EmotionScales, { values: exitEmotions, onChange: setExitEmotions, accent, t, variant: "exit" }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] mt-2", style: { color: BASE.inkFaint }, children: t.newEntry.emotionExitOptional })
    ] })
    ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "px-4 py-3 rounded-full text-sm transition-all active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim, fontFamily: "var(--font-display)" }, children: "\u041E\u0442\u043C\u0435\u043D\u0430" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: submit,
          disabled: !canSave || saving,
          className: "flex-1 py-3 rounded-full text-sm transition-all active:scale-[0.98]",
          style: { background: accent, color: "#06120F", opacity: canSave && !saving ? 1 : 0.45, cursor: canSave && !saving ? "pointer" : "not-allowed", fontFamily: "var(--font-display)", fontWeight: 600, boxShadow: canSave && !saving ? softLift(accent) : "none" },
          children: saving ? "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u2026" : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C"
        }
      )
    ] })
  ] });
}
function LogMiniStat({ label, value, color }) {
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5 truncate", style: { color: BASE.inkFaint }, children: label }),
    /* @__PURE__ */ jsx("div", { className: "text-xs truncate", style: { color: color || BASE.ink, fontFamily: "var(--font-mono)" }, children: value })
  ] });
}
export function Log({ entries, onDelete, onCloseTrade, onEditTrade, accent, measureMode, currency, t }) {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
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
  const withR = resultEntriesForUnit(closedEntries, measureMode, currency);
  const excludedResultCount = countExcludedResultEntries(closedEntries, measureMode, currency);
  const netR = withR.reduce((s, e) => s + e.r, 0);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "sec-cap text-[10px] text-center mb-4", style: { color: BASE.inkDim, fontFamily: "var(--font-display)", fontWeight: 400 }, children: [
      " ",
      t.log.title
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-2", children: [
      /* @__PURE__ */ jsx(StatCard, { label: t.log.totalTrades, value: entries.length, accent: BASE.ink }),
      /* @__PURE__ */ jsx(StatCard, { label: t.log.profitable, value: `${winRate}%`, accent: BASE.ink }),
      /* @__PURE__ */ jsx(StatCard, { label: `PnL (${unitSymbol(measureMode, currency)})`, value: formatResult(netR, measureMode, currency), accent: netR >= 0 ? WIN : LOSS })
    ] }),
    excludedResultCount > 0 && /* @__PURE__ */ jsx("div", {
      className: "text-[10px] mb-4 px-1",
      style: { color: BASE.inkFaint },
      children: `${excludedResultCount} ${pluralRu(excludedResultCount, "результат", "результата", "результатов")} в другой единице не входит в PnL`
    }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 px-3 py-2 rounded-full", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: [
      /* @__PURE__ */ jsx(Search, { size: 13, style: { color: BASE.inkFaint } }),
      /* @__PURE__ */ jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: t.log.searchPlaceholder, className: "bg-transparent outline-none text-sm flex-1", style: { color: BASE.ink } })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-4 hscroll", children: logFilters.map((f) => /* @__PURE__ */ jsx(Pill, { active: filter === f.id, onClick: () => setFilter(f.id), accent, children: f.label }, f.id)) }),
    filtered.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      entries.length === 0 ? { icon: NotebookText, title: t.log.noTradesTitle, hint: t.log.noTradesHint, accent } : { icon: Search, title: t.log.emptyTitle, hint: t.log.emptyHint, accent, compact: true }
    ) : /* V2.1 — stagger: карточки проявляются с шагом 60ms вместо одновременного возникновения
       всего списка. Класс уже существовал в бандле, но к журналу применён не был. Ключ
       контейнера привязан к фильтру и запросу, чтобы анимация повторялась при смене
       выборки, а не проигрывалась один раз за всю сессию. */
    /* @__PURE__ */ jsx("div", { className: "space-y-2 stagger md:space-y-0 md:grid md:grid-cols-2 md:gap-3 md:items-start xl:grid-cols-3", children: filtered.slice().reverse().map((e) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl overflow-hidden", style: { border: `1px solid ${BASE.line}` }, children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => setOpenId(openId === e.id ? null : e.id), className: "w-full text-left transition-colors duration-150", style: { background: BASE.surface }, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 pt-3 pb-2.5", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { background: outcomeColor(e.outcome) } }),
          /* @__PURE__ */ jsx("span", { className: "text-sm truncate", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: e.instrument }),
          /* @__PURE__ */ jsx("span", { className: "text-xs shrink-0", style: { color: BASE.inkDim }, children: DIRECTION_LABEL[e.direction] }),
          e.screenshots?.length > 0 && /* @__PURE__ */ jsx(ImagePlus, { size: 11, className: "shrink-0", style: { color: BASE.inkFaint } }),
          !isEntryClosed(e) && /* @__PURE__ */ jsx("span", { className: "text-[10px] ml-auto shrink-0 px-1.5 py-0.5 rounded-full", style: { color: accent, border: `1px solid ${accent}40` }, children: "\u041E\u0442\u043A\u0440\u044B\u0442\u0430" }),
          isEntryClosed(e) && e.r !== null && e.r !== void 0 && /* @__PURE__ */ jsx("span", { className: "text-sm ml-auto shrink-0", style: { color: outcomeColor(e.outcome), fontFamily: "var(--font-mono)", fontWeight: 500 }, children: formatStoredResult(e, measureMode, currency) }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] shrink-0", style: { color: BASE.inkFaint }, children: relTime(e.date) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-2 px-4 pb-3", children: [
          /* @__PURE__ */ jsx(LogMiniStat, { label: t.log.colEntry, value: formatPriceValue(e.entryPrice) }),
          /* @__PURE__ */ jsx(LogMiniStat, { label: t.log.colExit, value: formatPriceValue(e.exitPrice) }),
          /* @__PURE__ */ jsx(LogMiniStat, { label: t.log.colRR, value: e.rr != null ? e.rr.toFixed(1) : "\u2014" }),
          /* @__PURE__ */ jsx(LogMiniStat, { label: t.log.colResult, value: formatStoredResult(e, measureMode, currency), color: e.r != null ? outcomeColor(e.outcome) : void 0 })
        ] })
      ] }),
      openId === e.id && /* @__PURE__ */ jsxs("div", { className: "tab-content px-4 py-3 space-y-3 text-sm", style: { background: BASE.bg, color: BASE.inkDim }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1.5", style: { color: BASE.inkFaint }, children: t.home.entrySection }),
          (e.stopLoss != null || e.takeProfit != null) && /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-xs mb-2", style: { fontFamily: "var(--font-mono)" }, children: [
            e.stopLoss != null && /* @__PURE__ */ jsxs("span", { children: ["SL ", formatPriceValue(e.stopLoss)] }),
            e.takeProfit != null && /* @__PURE__ */ jsxs("span", { children: ["TP ", formatPriceValue(e.takeProfit)] }),
            e.plannedRR != null && /* @__PURE__ */ jsxs("span", { style: { color: accent }, children: ["\u041F\u043B\u0430\u043D 1:", e.plannedRR.toFixed(2)] })
          ] }),
          e.screenshots?.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex gap-2 hscroll pb-1 mb-2", children: e.screenshots.map((src, i) => /* @__PURE__ */ jsx(ScreenshotImage, { src, alt: `\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 ${i + 1}`, className: "w-24 h-24 object-cover rounded-lg shrink-0", style: { border: `1px solid ${BASE.line}` } }, i)) }),
          /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-0.5 rounded-full text-[11px] mb-1", style: { border: `1px solid ${BASE.line}`, color: accent }, children: e.tag }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u0417\u0430\u0442\u044F\u043D\u0443\u043B\u043E \u2014 " }),
            e.pull
          ] })
        ] }),
        isEntryClosed(e) && /* @__PURE__ */ jsxs("div", { className: "pt-2", style: { borderTop: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1.5", style: { color: BASE.inkFaint }, children: t.home.exitSection }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-xs mb-2 flex-wrap", style: { fontFamily: "var(--font-mono)" }, children: [
            e.closeType && /* @__PURE__ */ jsx("span", { children: { tp: "\u041F\u043E TP", sl: "\u041F\u043E SL", manual: "\u0412\u0440\u0443\u0447\u043D\u0443\u044E" }[e.closeType] || e.closeType }),
            e.exitPrice != null && /* @__PURE__ */ jsxs("span", { children: ["Exit ", formatPriceValue(e.exitPrice)] }),
            e.realizedRR != null && /* @__PURE__ */ jsxs("span", { style: { color: outcomeColor(e.outcome) }, children: [e.realizedRR >= 0 ? "+" : "", e.realizedRR.toFixed(2), "R"] })
          ] }),
          (e.x != null || e.exitX != null) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[11px] mb-2 flex-wrap", children: [
            e.x != null && /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsxs("span", { style: { color: BASE.inkFaint }, children: [t.newEntry.stateBeforeLabel, " "] }),
              /* @__PURE__ */ jsx("span", { style: { color: entryStateColor(e.emotions, e.x, e.y) }, children: entryStateText(e.emotions, e.x, e.y, t) })
            ] }),
            e.x != null && e.exitX != null && /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u2192" }),
            e.exitX != null && /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsxs("span", { style: { color: BASE.inkFaint }, children: [t.newEntry.stateAfterLabel, " "] }),
              /* @__PURE__ */ jsx("span", { style: { color: entryStateColor(e.exitEmotions, e.exitX, e.exitY, "exit") }, children: entryStateText(e.exitEmotions, e.exitX, e.exitY, t, "exit") })
            ] })
          ] }),
          e.exitScreenshots?.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex gap-2 hscroll pb-1 mb-2", children: e.exitScreenshots.map((src, i) => /* @__PURE__ */ jsx(ScreenshotImage, { src, alt: `\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 \u0432\u044B\u0445\u043E\u0434\u0430 ${i + 1}`, className: "w-24 h-24 object-cover rounded-lg shrink-0", style: { border: `1px solid ${BASE.line}` } }, i)) }),
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
          /* @__PURE__ */ jsx("button", {
            disabled: deletingId === e.id,
            onClick: async () => {
              if (deletingId) return;
              setDeletingId(e.id);
              try {
                const ok = await onDelete(e.id);
                if (ok) setConfirmId(null);
              } finally {
                setDeletingId(null);
              }
            },
            className: "text-xs",
            style: { color: LOSS, opacity: deletingId === e.id ? 0.55 : 1 },
            children: deletingId === e.id ? "\u0423\u0434\u0430\u043B\u044F\u044E\u2026" : "\u0414\u0430, \u0443\u0434\u0430\u043B\u0438\u0442\u044C"
          }),
          /* @__PURE__ */ jsx("button", { onClick: () => setConfirmId(null), className: "text-xs", style: { color: BASE.inkFaint }, children: "\u041E\u0442\u043C\u0435\u043D\u0430" })
        ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setConfirmId(e.id), className: "flex items-center gap-1.5 text-xs pt-1", style: { color: LOSS }, children: [
          /* @__PURE__ */ jsx(Trash2, { size: 12 }),
          " \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C"
        ] })
      ] })
    ] }, e.id)) })
  ] });
}
