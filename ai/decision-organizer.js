// MIND.EXE — transforms the user's transcript into argument cards without making the decision.

import { getDecisionOrganizerModel } from "./decision-runtime.js";
import { runAiRequest } from "../core/ai-request-runtime.js";
import {
  DECISION_FACTOR_GROUPS,
  DECISION_FACTORS
} from "../core/decision-factor-taxonomy.js";
import { validateDecisionOrganizerResponse } from "../core/decision-organizer-model.js";

function stripCodeFence(text) {
  return String(text || "").replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

function compactTaxonomy() {
  return Object.entries(DECISION_FACTORS).map(([id, row]) => ({ id, group: row.group }));
}

export async function organizeDecisionTranscript({
  transcript,
  mode = "direction",
  consideredDirection = null,
  lang = "ru",
  source = "voice",
  chartImageDataUrl = null
} = {}) {
  const clean = String(transcript || "").trim();
  if (!clean) throw new Error("decision_transcript_empty");
  const sides = mode === "entry"
    ? '"for_entry" | "against_entry" | "neutral"'
    : '"long" | "short" | "neutral"';
  const modeExplanation = mode === "entry"
    ? `The trader is already considering ${consideredDirection || "a trade"}. Classify each thought as supporting entry, arguing against entry, or neutral/uncertain.`
    : "The trader has not chosen a direction. Classify only from their wording as supporting long, supporting short, or neutral/uncertain.";
  const prompt = `LANGUAGE: ${lang === "en" ? "English" : "Russian"}
MODE: ${mode}
${modeExplanation}

TRANSCRIPT:
${clean}

${chartImageDataUrl ? `CHART SCREENSHOT:
An image is attached as visual context. Use it only to understand direct visual references already present in the transcript (for example “this level” or “this impulse”). Never create a new argument from the screenshot alone, never infer a trade signal, and never add technical-analysis claims that the trader did not say.

` : ""}TASK:
- Split the transcript into 4-10 distinct arguments when possible, maximum 14.
- Merge obvious repetitions, but do not merge genuinely different reasons.
- Keep contradictions instead of resolving them.
- "rawText" should stay close to the user's own wording.
- "normalizedText" should be a short, neutral formulation in the transcript language.
- Choose one existing factorId from TAXONOMY. Never invent ids. If none fits, use factorId="other" and factorGroup="other".
- side must be one of: ${sides}.
- Do not return weights, emotions, confidence, scores, recommendations, probabilities or final decisions.

FACTOR GROUPS:
${JSON.stringify(Object.keys(DECISION_FACTOR_GROUPS))}

TAXONOMY:
${JSON.stringify(compactTaxonomy())}

RETURN EXACTLY:
{"arguments":[{"rawText":"...","normalizedText":"...","side":"...","factorGroup":"...","factorId":"..."}]}`;
  const model = getDecisionOrganizerModel();
  return runAiRequest({
    key: "decision_organizer", operation: "DECISION_ORGANIZER", timeoutMs: 30000, retries: 0, slowMs: 6000,
    execute: async () => {
      const imageMatch = typeof chartImageDataUrl === "string"
        ? /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(chartImageDataUrl)
        : null;
      const result = imageMatch
        ? await model.generateContent([
            prompt,
            { inlineData: { mimeType: imageMatch[1], data: imageMatch[2] } }
          ])
        : await model.generateContent(prompt);
      const text = result?.response?.text?.();
      if (!text || !text.trim()) throw new Error("decision_organizer_empty");
      let parsed;
      try { parsed = JSON.parse(stripCodeFence(text)); } catch { throw new Error("decision_organizer_bad_json"); }
      return validateDecisionOrganizerResponse(parsed, mode, source);
    }
  });
}
