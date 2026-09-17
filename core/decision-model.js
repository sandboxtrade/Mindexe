// MIND.EXE — Decision Lab pure data model v1.
// No React/Firebase/DOM. Locked pre-trade snapshots are immutable by design.
// v5.2 hardening: explicit rating provenance so defaults never pollute analytics.

import {
  DECISION_EMOTION_TAGS,
  normalizeDecisionFactor
} from "./decision-factor-taxonomy.js";

export const DECISION_SCHEMA_VERSION = 1;
export const DECISION_INDEX_SCHEMA_VERSION = 1;
export const DECISION_MODES = Object.freeze(["direction", "entry"]);
export const DECISION_STATUSES = Object.freeze(["draft", "locked", "linked", "reviewed", "abandoned"]);
export const DECISION_FLOW_STEPS = Object.freeze(["context", "input", "review", "rate", "conditions", "decision", "summary"]);
export const DECISION_REVIEW_OUTCOMES = Object.freeze(["logic_valid", "logic_invalid", "plan_violated", "inconclusive"]);
export const DECISION_ARGUMENT_REVIEW_ASSESSMENTS = Object.freeze(["overestimated", "underestimated", "accurate", "unclear"]);

const clamp100 = (value, fallback = 0) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
};
const nullable100 = (value) => value == null || value === "" ? null : clamp100(value, 0);
const cleanText = (value, max = 1200) => String(value ?? "").trim().slice(0, max);
const cleanId = (value) => String(value ?? "").trim().slice(0, 160);

export function makeDecisionId(now = Date.now()) {
  return `dec_${Number(now).toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function allowedDecisionSides(mode) {
  return mode === "entry" ? ["for_entry", "against_entry", "neutral"] : ["long", "short", "neutral"];
}

export function allowedFinalDecisions(mode) {
  return mode === "entry" ? ["enter", "wait", "skip"] : ["long", "short", "wait"];
}

export function createDecisionSession({
  id = null,
  mode = "direction",
  symbol = "",
  consideredDirection = null,
  clarityBefore = null,
  inputMethod = "voice",
  now = Date.now()
} = {}) {
  const safeMode = DECISION_MODES.includes(mode) ? mode : "direction";
  const timestamp = Number(now) || Date.now();
  const initialClarity = nullable100(clarityBefore);
  return {
    id: id || makeDecisionId(timestamp),
    schemaVersion: DECISION_SCHEMA_VERSION,
    mode: safeMode,
    status: "draft",
    flowStep: "context",
    symbol: cleanText(symbol, 40).toUpperCase(),
    consideredDirection: safeMode === "entry" && ["long", "short"].includes(consideredDirection) ? consideredDirection : null,
    createdAt: timestamp,
    updatedAt: timestamp,
    persistenceRevision: 0,
    persistenceUpdatedAt: null,
    rawInput: {
      transcriptSegments: [],
      combinedTranscript: "",
      inputMethod: ["voice", "text", "mixed"].includes(inputMethod) ? inputMethod : "voice",
      transcriptEdited: false
    },
    preDecisionState: {
      clarityBefore: initialClarity,
      clarityBeforeRated: initialClarity != null,
      clarityAfter: null,
      clarityAfterRated: false,
      decisionConfidence: null,
      decisionConfidenceRated: false
    },
    arguments: [],
    conditions: safeMode === "entry"
      ? { entryRemainsValidIf: [], invalidation: [] }
      : { longBecomesValidIf: [], shortBecomesValidIf: [] },
    finalDecision: null,
    lockedAt: null,
    linkedTradeId: null,
    chartImageAttached: false,
    psychologySynthesis: null,
    postDecisionNote: "",
    postReview: null
  };
}

export function normalizeDecisionArgument(raw, mode = "direction", index = 0) {
  const sideOptions = allowedDecisionSides(mode);
  const side = sideOptions.includes(raw?.side) ? raw.side : "neutral";
  const factor = normalizeDecisionFactor(raw?.factorGroup, raw?.factorId);
  const weight = nullable100(raw?.weight);
  const emotionIntensity = nullable100(raw?.emotionIntensity);
  // Rating provenance is deliberately explicit. Legacy Decision Lab records without the flags
  // keep their numeric values for display/backward compatibility, but analytics will not mistake
  // those values for conscious ratings made by the user.
  const weightRated = raw?.weightRated === true;
  const emotionRated = raw?.emotionRated === true;
  const emotionTag = DECISION_EMOTION_TAGS.includes(raw?.emotionTag)
    ? raw.emotionTag
    : emotionRated && emotionIntensity != null && emotionIntensity <= 20 ? "calm" : null;
  return {
    id: cleanId(raw?.id) || `arg_${Date.now().toString(36)}_${index}_${Math.random().toString(36).slice(2, 6)}`,
    rawText: cleanText(raw?.rawText || raw?.normalizedText, 500),
    normalizedText: cleanText(raw?.normalizedText || raw?.rawText, 500),
    factorGroup: factor.factorGroup,
    factorId: factor.factorId,
    factorLabel: cleanText(raw?.factorLabel, 120) || null,
    side,
    weight,
    weightRated,
    emotionIntensity,
    emotionRated,
    emotionTag,
    isDecisive: !!raw?.isDecisive,
    source: ["voice", "text", "manual", "mixed"].includes(raw?.source) ? raw.source : "manual",
    aiGeneratedStructure: raw?.aiGeneratedStructure !== false,
    userEdited: !!raw?.userEdited,
    createdAt: Number(raw?.createdAt) || Date.now()
  };
}

function normalizeTextList(value, max = 8) {
  return Array.isArray(value)
    ? value.map((v) => cleanText(v, 500)).filter(Boolean).slice(0, max)
    : [];
}

export function normalizeDecisionPostReview(raw, session = null) {
  if (!raw || typeof raw !== "object") return null;
  const validArgumentIds = new Set(Array.isArray(session?.arguments) ? session.arguments.map((arg) => arg.id) : []);
  const reviews = Array.isArray(raw.argumentReviews) ? raw.argumentReviews : [];
  const argumentReviews = reviews.map((row) => {
    const argumentId = cleanId(row?.argumentId);
    if (!argumentId || (validArgumentIds.size && !validArgumentIds.has(argumentId))) return null;
    return {
      argumentId,
      weightAfter: row?.weightAfter == null ? null : clamp100(row.weightAfter, 50),
      emotionAfter: row?.emotionAfter == null ? null : clamp100(row.emotionAfter, 0),
      assessment: DECISION_ARGUMENT_REVIEW_ASSESSMENTS.includes(row?.assessment) ? row.assessment : "unclear"
    };
  }).filter(Boolean).slice(0, 14);
  return {
    outcomeAssessment: DECISION_REVIEW_OUTCOMES.includes(raw.outcomeAssessment) ? raw.outcomeAssessment : "inconclusive",
    note: cleanText(raw.note, 3000),
    argumentReviews,
    createdAt: Number(raw.createdAt) || Date.now(),
    updatedAt: Number(raw.updatedAt) || Number(raw.createdAt) || Date.now()
  };
}

export function normalizeDecisionPsychologySynthesis(raw) {
  if (!raw || typeof raw !== "object") return null;
  const clean = (value, max = 1800) => cleanText(value, max);
  const normalized = {
    version: 1,
    inputHash: cleanId(raw.inputHash),
    generatedAt: Number(raw.generatedAt) || Date.now(),
    sideASummary: clean(raw.sideASummary, 1500),
    sideBSummary: clean(raw.sideBSummary, 1500),
    neutralSummary: clean(raw.neutralSummary, 1200),
    strongPattern: clean(raw.strongPattern, 1600),
    weakPattern: clean(raw.weakPattern, 1600),
    mainConflict: clean(raw.mainConflict, 1600),
    selfQuestion: clean(raw.selfQuestion, 700)
  };
  if (!normalized.inputHash || !normalized.sideASummary || !normalized.sideBSummary ||
      !normalized.strongPattern || !normalized.weakPattern || !normalized.mainConflict || !normalized.selfQuestion) {
    return null;
  }
  return normalized;
}

export function normalizeDecisionSession(raw) {
  if (!raw || typeof raw !== "object") return null;
  const mode = DECISION_MODES.includes(raw.mode) ? raw.mode : "direction";
  const base = createDecisionSession({
    id: cleanId(raw.id) || undefined,
    mode,
    symbol: raw.symbol,
    consideredDirection: raw.consideredDirection,
    clarityBefore: raw?.preDecisionState?.clarityBefore,
    inputMethod: raw?.rawInput?.inputMethod,
    now: Number(raw.createdAt) || Date.now()
  });
  const status = DECISION_STATUSES.includes(raw.status) ? raw.status : "draft";
  const flowStep = DECISION_FLOW_STEPS.includes(raw.flowStep)
    ? raw.flowStep
    : status === "draft" ? "context" : "summary";
  const segments = Array.isArray(raw?.rawInput?.transcriptSegments)
    ? raw.rawInput.transcriptSegments.map((seg, i) => ({
        id: cleanId(seg?.id) || `seg_${i}`,
        text: cleanText(seg?.text, 5000),
        createdAt: Number(seg?.createdAt) || base.createdAt,
        source: ["voice", "text"].includes(seg?.source) ? seg.source : "text"
      })).filter((seg) => seg.text).slice(-24)
    : [];
  const combinedTranscript = cleanText(raw?.rawInput?.combinedTranscript || segments.map((s) => s.text).join("\n"), 30000);
  const args = Array.isArray(raw.arguments)
    ? raw.arguments.slice(0, 14).map((arg, i) => normalizeDecisionArgument(arg, mode, i))
    : [];
  let decisiveSeen = 0;
  const normalizedArgs = args.map((arg) => {
    if (!arg.isDecisive) return arg;
    decisiveSeen += 1;
    return decisiveSeen <= 3 ? arg : { ...arg, isDecisive: false };
  });
  const conditions = mode === "entry"
    ? {
        entryRemainsValidIf: normalizeTextList(raw?.conditions?.entryRemainsValidIf),
        invalidation: normalizeTextList(raw?.conditions?.invalidation)
      }
    : {
        longBecomesValidIf: normalizeTextList(raw?.conditions?.longBecomesValidIf),
        shortBecomesValidIf: normalizeTextList(raw?.conditions?.shortBecomesValidIf)
      };
  const finalDecision = allowedFinalDecisions(mode).includes(raw.finalDecision) ? raw.finalDecision : null;
  const clarityBefore = nullable100(raw?.preDecisionState?.clarityBefore);
  const clarityAfter = nullable100(raw?.preDecisionState?.clarityAfter);
  const decisionConfidence = nullable100(raw?.preDecisionState?.decisionConfidence);
  return {
    ...base,
    schemaVersion: DECISION_SCHEMA_VERSION,
    status,
    flowStep,
    updatedAt: Number(raw.updatedAt) || base.createdAt,
    persistenceRevision: Math.max(0, Number(raw.persistenceRevision) || 0),
    persistenceUpdatedAt: raw.persistenceUpdatedAt ?? null,
    rawInput: {
      transcriptSegments: segments,
      combinedTranscript,
      inputMethod: ["voice", "text", "mixed"].includes(raw?.rawInput?.inputMethod) ? raw.rawInput.inputMethod : "voice",
      transcriptEdited: !!raw?.rawInput?.transcriptEdited
    },
    preDecisionState: {
      clarityBefore,
      clarityBeforeRated: raw?.preDecisionState?.clarityBeforeRated === true,
      clarityAfter,
      clarityAfterRated: raw?.preDecisionState?.clarityAfterRated === true,
      decisionConfidence,
      decisionConfidenceRated: raw?.preDecisionState?.decisionConfidenceRated === true
    },
    arguments: normalizedArgs,
    conditions,
    finalDecision,
    lockedAt: raw.lockedAt ?? null,
    linkedTradeId: cleanId(raw.linkedTradeId) || null,
    chartImageAttached: raw.chartImageAttached === true,
    psychologySynthesis: normalizeDecisionPsychologySynthesis(raw.psychologySynthesis),
    postDecisionNote: cleanText(raw.postDecisionNote, 2000),
    postReview: normalizeDecisionPostReview(raw.postReview, { arguments: normalizedArgs })
  };
}

export function setDecisionTranscript(session, text, now = Date.now()) {
  const s = normalizeDecisionSession(session);
  if (!s || s.status !== "draft") throw new Error("decision_not_editable");
  return {
    ...s,
    psychologySynthesis: null,
    updatedAt: Number(now) || Date.now(),
    rawInput: {
      ...s.rawInput,
      combinedTranscript: cleanText(text, 30000),
      transcriptEdited: true
    }
  };
}

export function addDecisionTranscriptSegment(session, text, source = "text", now = Date.now()) {
  const s = normalizeDecisionSession(session);
  if (!s || s.status !== "draft") throw new Error("decision_not_editable");
  const clean = cleanText(text, 5000);
  if (!clean) return s;
  const segments = [...s.rawInput.transcriptSegments, {
    id: `seg_${Number(now).toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    text: clean,
    createdAt: Number(now) || Date.now(),
    source: source === "voice" ? "voice" : "text"
  }].slice(-24);
  const hasVoice = segments.some((seg) => seg.source === "voice");
  const hasText = segments.some((seg) => seg.source === "text");
  // combinedTranscript is the canonical editable text. Never rebuild it from stale source segments:
  // doing so used to erase manual transcript corrections as soon as another voice fragment arrived.
  const combinedTranscript = [s.rawInput.combinedTranscript, clean].map((v) => cleanText(v, 30000)).filter(Boolean).join("\n").slice(0, 30000);
  return {
    ...s,
    psychologySynthesis: null,
    updatedAt: Number(now) || Date.now(),
    rawInput: {
      ...s.rawInput,
      transcriptSegments: segments,
      combinedTranscript,
      inputMethod: hasVoice && hasText ? "mixed" : hasVoice ? "voice" : "text"
    }
  };
}

export function setDecisionArguments(session, args, now = Date.now()) {
  const s = normalizeDecisionSession(session);
  if (!s || s.status !== "draft") throw new Error("decision_not_editable");
  const normalized = (Array.isArray(args) ? args : []).slice(0, 14).map((arg, i) => normalizeDecisionArgument(arg, s.mode, i));
  return { ...s, arguments: normalized, psychologySynthesis: null, updatedAt: Number(now) || Date.now() };
}

export function setDecisionPsychologySynthesis(session, synthesis, inputHash, now = Date.now()) {
  const s = normalizeDecisionSession(session);
  if (!s || s.status !== "draft") throw new Error("decision_not_editable");
  const normalized = normalizeDecisionPsychologySynthesis({
    ...(synthesis || {}),
    inputHash,
    generatedAt: Number(now) || Date.now()
  });
  if (!normalized) throw new Error("decision_psychology_invalid");
  return { ...s, psychologySynthesis: normalized, updatedAt: Number(now) || Date.now() };
}

export function validateDecisionForLock(session) {
  const s = normalizeDecisionSession(session);
  if (!s) return { ok: false, error: "decision_invalid" };
  if (s.status !== "draft") return { ok: false, error: "decision_already_locked" };
  if (!s.arguments.length) return { ok: false, error: "decision_arguments_missing" };
  if (!s.preDecisionState.clarityBeforeRated || s.preDecisionState.clarityBefore == null) {
    return { ok: false, error: "decision_clarity_before_missing" };
  }
  if (s.arguments.some((arg) => !arg.weightRated || arg.weight == null || !arg.emotionRated || arg.emotionIntensity == null)) {
    return { ok: false, error: "decision_argument_ratings_missing" };
  }
  if (!allowedFinalDecisions(s.mode).includes(s.finalDecision)) return { ok: false, error: "decision_final_missing" };
  if (!s.preDecisionState.clarityAfterRated || s.preDecisionState.clarityAfter == null ||
      !s.preDecisionState.decisionConfidenceRated || s.preDecisionState.decisionConfidence == null) {
    return { ok: false, error: "decision_state_missing" };
  }
  if (s.mode === "entry" && !["long", "short"].includes(s.consideredDirection)) {
    return { ok: false, error: "decision_direction_missing" };
  }
  return { ok: true, session: s };
}

export function lockDecisionSession(session, now = Date.now()) {
  const checked = validateDecisionForLock(session);
  if (!checked.ok) throw new Error(checked.error);
  const timestamp = Number(now) || Date.now();
  return {
    ...checked.session,
    status: "locked",
    flowStep: "summary",
    lockedAt: timestamp,
    updatedAt: timestamp
  };
}

export function buildDecisionIndexRow(session) {
  const s = normalizeDecisionSession(session);
  if (!s) throw new Error("decision_invalid");
  return {
    id: s.id,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    mode: s.mode,
    symbol: s.symbol || null,
    consideredDirection: s.consideredDirection,
    finalDecision: s.finalDecision,
    linkedTradeId: s.linkedTradeId,
    status: s.status,
    lockedAt: s.lockedAt
  };
}

export function decisionLockedSnapshot(session) {
  const s = normalizeDecisionSession(session);
  if (!s) return null;
  return {
    mode: s.mode,
    symbol: s.symbol,
    consideredDirection: s.consideredDirection,
    rawInput: s.rawInput,
    preDecisionState: s.preDecisionState,
    arguments: s.arguments,
    conditions: s.conditions,
    finalDecision: s.finalDecision,
    chartImageAttached: s.chartImageAttached === true,
    psychologySynthesis: s.psychologySynthesis,
    lockedAt: s.lockedAt
  };
}

export function assertDecisionMutationAllowed(currentRaw, nextRaw) {
  const current = normalizeDecisionSession(currentRaw);
  const next = normalizeDecisionSession(nextRaw);
  if (!current || !next || current.id !== next.id) throw new Error("decision_invalid_mutation");
  if (current.status === "draft") return true;
  const a = JSON.stringify(decisionLockedSnapshot(current));
  const b = JSON.stringify(decisionLockedSnapshot(next));
  if (a !== b) throw new Error("decision_locked_snapshot_mutation");
  return true;
}

export function setDecisionPostReview(session, review, now = Date.now()) {
  const s = normalizeDecisionSession(session);
  if (!s || !["locked", "linked", "reviewed"].includes(s.status)) throw new Error("decision_review_not_available");
  if (!s.linkedTradeId) throw new Error("decision_review_trade_missing");
  const timestamp = Number(now) || Date.now();
  const normalized = normalizeDecisionPostReview({
    ...(review || {}),
    createdAt: s.postReview?.createdAt || review?.createdAt || timestamp,
    updatedAt: timestamp
  }, s);
  if (!normalized) throw new Error("decision_review_invalid");
  return {
    ...s,
    status: "reviewed",
    postReview: normalized,
    updatedAt: timestamp
  };
}


export function decisionClarityDelta(session) {
  const s = normalizeDecisionSession(session);
  if (!s || !s.preDecisionState.clarityBeforeRated || !s.preDecisionState.clarityAfterRated ||
      s.preDecisionState.clarityBefore == null || s.preDecisionState.clarityAfter == null) return null;
  return s.preDecisionState.clarityAfter - s.preDecisionState.clarityBefore;
}
