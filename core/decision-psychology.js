// MIND.EXE — deterministic Decision Lab thought-balance math + AI response validation.
// This module never evaluates the market. It only measures the structure of the user's own ratings.

import { normalizeDecisionSession } from "./decision-model.js";

const cleanText = (value, max = 1800) => String(value ?? "").trim().slice(0, max);
const round = (value, digits = 0) => {
  const factor = 10 ** digits;
  return Math.round((Number(value) || 0) * factor) / factor;
};

function pairPercent(left, right) {
  const a = Math.max(0, Number(left) || 0);
  const b = Math.max(0, Number(right) || 0);
  const total = a + b;
  if (total <= 0) return { available: false, leftPct: null, rightPct: null, gapPct: null, dominantSide: null };
  const leftPct = Math.round((a / total) * 100);
  const rightPct = 100 - leftPct;
  return {
    available: true,
    leftPct,
    rightPct,
    gapPct: Math.abs(leftPct - rightPct),
    dominantSide: leftPct === rightPct ? null : leftPct > rightPct ? "left" : "right"
  };
}

function neutralShare(left, right, neutral) {
  const a = Math.max(0, Number(left) || 0);
  const b = Math.max(0, Number(right) || 0);
  const n = Math.max(0, Number(neutral) || 0);
  const total = a + b + n;
  return total > 0 ? Math.round((n / total) * 100) : null;
}

export function decisionPsychologySides(mode = "direction") {
  return mode === "entry"
    ? { left: "for_entry", right: "against_entry", neutral: "neutral" }
    : { left: "long", right: "short", neutral: "neutral" };
}

export function buildDecisionPsychologyContext(session) {
  const s = normalizeDecisionSession(session);
  if (!s) throw new Error("decision_invalid");
  return {
    mode: s.mode,
    consideredDirection: s.mode === "entry" ? s.consideredDirection : null,
    transcript: s.rawInput.combinedTranscript,
    arguments: s.arguments.map((arg) => ({
      id: arg.id,
      rawText: arg.rawText,
      normalizedText: arg.normalizedText,
      side: arg.side,
      weight: arg.weightRated ? arg.weight : null,
      emotionIntensity: arg.emotionRated ? arg.emotionIntensity : null,
      emotionTag: arg.emotionRated ? arg.emotionTag : null,
      isDecisive: !!arg.isDecisive
    })),
    conditions: s.conditions
  };
}

export function calculateDecisionThoughtBalance(session) {
  const s = normalizeDecisionSession(session);
  if (!s) throw new Error("decision_invalid");
  const sides = decisionPsychologySides(s.mode);
  const totals = {
    logical: { left: 0, right: 0, neutral: 0, count: 0 },
    emotional: { left: 0, right: 0, neutral: 0, count: 0 }
  };
  for (const arg of s.arguments) {
    const bucket = arg.side === sides.left ? "left" : arg.side === sides.right ? "right" : "neutral";
    if (arg.weightRated && Number.isFinite(arg.weight)) {
      totals.logical[bucket] += Math.max(0, arg.weight);
      totals.logical.count += 1;
    }
    if (arg.emotionRated && Number.isFinite(arg.emotionIntensity)) {
      totals.emotional[bucket] += Math.max(0, arg.emotionIntensity);
      totals.emotional.count += 1;
    }
  }
  const logicalPair = pairPercent(totals.logical.left, totals.logical.right);
  const emotionalPair = pairPercent(totals.emotional.left, totals.emotional.right);
  return {
    mode: s.mode,
    sides,
    logical: {
      ...logicalPair,
      leftTotal: round(totals.logical.left, 1),
      rightTotal: round(totals.logical.right, 1),
      neutralTotal: round(totals.logical.neutral, 1),
      neutralSharePct: neutralShare(totals.logical.left, totals.logical.right, totals.logical.neutral),
      ratedCount: totals.logical.count
    },
    emotional: {
      ...emotionalPair,
      leftTotal: round(totals.emotional.left, 1),
      rightTotal: round(totals.emotional.right, 1),
      neutralTotal: round(totals.emotional.neutral, 1),
      neutralSharePct: neutralShare(totals.emotional.left, totals.emotional.right, totals.emotional.neutral),
      ratedCount: totals.emotional.count
    },
    alignment: logicalPair.available && emotionalPair.available
      ? logicalPair.dominantSide === emotionalPair.dominantSide
        ? (logicalPair.dominantSide ? "aligned" : "balanced")
        : "conflict"
      : "insufficient"
  };
}

function fnv1a(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function decisionPsychologyInputHash(session) {
  return `psy1_${fnv1a(JSON.stringify(buildDecisionPsychologyContext(session)))}`;
}

export function normalizeDecisionPsychologyAiResponse(raw) {
  if (!raw || typeof raw !== "object") throw new Error("decision_psychology_bad_json");
  const result = {
    sideASummary: cleanText(raw.sideASummary, 1500),
    sideBSummary: cleanText(raw.sideBSummary, 1500),
    neutralSummary: cleanText(raw.neutralSummary, 1200),
    strongPattern: cleanText(raw.strongPattern, 1600),
    weakPattern: cleanText(raw.weakPattern, 1600),
    mainConflict: cleanText(raw.mainConflict, 1600),
    selfQuestion: cleanText(raw.selfQuestion, 700)
  };
  const required = ["sideASummary", "sideBSummary", "strongPattern", "weakPattern", "mainConflict", "selfQuestion"];
  if (required.some((key) => !result[key])) throw new Error("decision_psychology_incomplete");
  return result;
}
