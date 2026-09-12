// MIND.EXE — pure journal data model and backward-compatible migration.
// No React, Firebase, DOM or persistence side effects.

import {
  normalizeResultByCloseType,
  normalizeResultCurrency,
  normalizeResultMode,
  outcomeFromResult
} from "./trade-math.js?v=1";

export const EMOTION_SCALE_KEYS = {
  entry: ["confidence", "fear", "calm", "tension"],
  exit: ["pleased", "disappointed", "atPeace", "stung"]
};

export function emotionScaleKeys(variant) {
  return EMOTION_SCALE_KEYS[variant] || EMOTION_SCALE_KEYS.entry;
}

export function emotionClampPct(v) {
  const n = Number(v);
  if (n === null || n === void 0 || isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function normalizeEmotions(v, variant = "entry") {
  if (!v || typeof v !== "object") return null;
  const k = emotionScaleKeys(variant);
  if (!k.some((key) => typeof v[key] === "number" && !isNaN(v[key]))) return null;
  const out = {};
  for (const key of k) out[key] = emotionClampPct(v[key]);
  return out;
}

export function deriveEntryStatus(e) {
  if (e.status === "open" || e.status === "closed") return e.status;
  return e.outcome != null ? "closed" : "open";
}

export function migrateEntry(e) {
  const status = deriveEntryStatus(e);
  const closeType = ["tp", "sl", "manual"].includes(e.closeType) ? e.closeType : null;
  const rawResult = typeof e.r === "number" && isFinite(e.r) ? e.r : null;
  const normalizedResult = status === "closed" && rawResult != null
    ? normalizeResultByCloseType(closeType, rawResult)
    : rawResult;
  const resultMode = normalizeResultMode(e.resultMode);
  const resultCurrency = resultMode === "currency" ? normalizeResultCurrency(e.resultCurrency) : null;

  return {
    ...e,
    status,
    r: normalizedResult,
    resultMode,
    resultCurrency,
    outcome: normalizedResult == null ? e.outcome ?? null : outcomeFromResult(normalizedResult),
    exitDate: e.exitDate ? e.exitDate : null,
    stopLoss: typeof e.stopLoss === "number" && !isNaN(e.stopLoss) ? e.stopLoss : null,
    takeProfit: typeof e.takeProfit === "number" && !isNaN(e.takeProfit) ? e.takeProfit : null,
    plannedRR: typeof e.plannedRR === "number" && !isNaN(e.plannedRR) ? e.plannedRR : null,
    closeType,
    realizedRR: typeof e.realizedRR === "number" && !isNaN(e.realizedRR) ? e.realizedRR : null,
    exitX: typeof e.exitX === "number" && !isNaN(e.exitX) ? e.exitX : null,
    exitY: typeof e.exitY === "number" && !isNaN(e.exitY) ? e.exitY : null,
    emotions: normalizeEmotions(e.emotions, "entry"),
    exitEmotions: normalizeEmotions(e.exitEmotions, "exit"),
    exitScreenshots: Array.isArray(e.exitScreenshots) ? e.exitScreenshots : []
  };
}

export const isEntryClosed = (e) => e.status === "closed";

// Independent opposing-emotion intensity used by UI and AI context.
export function emotionConflict(values, variant = "entry") {
  if (!values) return { x: 0, y: 0, max: 0, has: false };
  const k = emotionScaleKeys(variant);
  const g = (n) => emotionClampPct(values[n]);
  // min(a,b) — насколько сильно выражен более слабый из двух противоположных полюсов.
  // Оба по 100 -> конфликт 100. Один 100, второй 0 -> конфликта нет, состояние однозначное.
  const cx = Math.min(g(k[0]), g(k[1]));
  const cy = Math.min(g(k[2]), g(k[3]));
  const max = Math.max(cx, cy);
  return { x: cx, y: cy, max, has: max >= 40 };
}
