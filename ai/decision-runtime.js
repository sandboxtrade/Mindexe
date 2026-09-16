// MIND.EXE — isolated Gemini runtime for Decision Lab.
// Uses its own model instructions so the feature never behaves like a trading-advice chat.

import { getGenerativeModel } from "firebase/ai";

let runtimeAiLogic = null;
let runtimeModelName = null;
let organizerModel = null;
let transcriptionModel = null;
let transcriptPolishModel = null;

const ORGANIZER_SYSTEM = `You are the structuring engine inside MIND.EXE Decision Lab.
Your ONLY job is to reorganize the trader's own words into a clean decision map.
You are not a market analyst and must never add market facts, trading advice, probabilities, signals,
entry ideas, price targets, stop levels, or a preferred direction that the user did not explicitly state.
Never assign logical weight, emotional intensity, confidence, or a final decision. Those belong only to the user.
Preserve uncertainty. If a sentence can reasonably support both sides or does not support either side, classify it as neutral.
Return only the requested JSON. No markdown and no commentary.`;

const TRANSCRIPTION_SYSTEM = `You are a transcription engine for a Russian/English trading journal.
Transcribe only what is audibly present. Preserve ticker symbols, timeframe names (M1, M5, M15, H1, H4, D1),
LONG/SHORT, numbers, and common trading terms. Do not summarize, reorganize, correct the trader's reasoning,
or add content. If a short fragment is genuinely unintelligible, use [неразборчиво] for Russian speech or
[inaudible] for English speech. Return plain transcript text only.`;

export function configureDecisionAi({ aiLogic, modelName }) {
  runtimeAiLogic = aiLogic || null;
  runtimeModelName = modelName || null;
  organizerModel = null;
  transcriptionModel = null;
  transcriptPolishModel = null;
}

function requireRuntime() {
  if (!runtimeAiLogic || !runtimeModelName) throw new Error("decision_ai_runtime_not_configured");
}

export function getDecisionOrganizerModel() {
  requireRuntime();
  if (!organizerModel) {
    organizerModel = getGenerativeModel(runtimeAiLogic, {
      model: runtimeModelName,
      systemInstruction: ORGANIZER_SYSTEM,
      generationConfig: { temperature: 0.15, maxOutputTokens: 1800 }
    });
  }
  return organizerModel;
}

export function getDecisionTranscriptionModel() {
  requireRuntime();
  if (!transcriptionModel) {
    transcriptionModel = getGenerativeModel(runtimeAiLogic, {
      model: runtimeModelName,
      systemInstruction: TRANSCRIPTION_SYSTEM,
      generationConfig: { temperature: 0, maxOutputTokens: 2400 }
    });
  }
  return transcriptionModel;
}


const TRANSCRIPT_POLISH_SYSTEM = `You are a conservative transcript editor inside MIND.EXE.
You receive an already-transcribed trader voice note. Improve readability only: punctuation, paragraph breaks,
and unmistakable speech-to-text mistakes. Preserve every substantive thought, number, ticker, timeframe,
LONG/SHORT direction, negation and uncertainty. Never summarize, infer missing market facts, add advice,
or make the trader sound more certain. Return plain text only.`;

export function getDecisionTranscriptPolishModel() {
  requireRuntime();
  if (!transcriptPolishModel) {
    transcriptPolishModel = getGenerativeModel(runtimeAiLogic, {
      model: runtimeModelName,
      systemInstruction: TRANSCRIPT_POLISH_SYSTEM,
      generationConfig: { temperature: 0, maxOutputTokens: 2400 }
    });
  }
  return transcriptPolishModel;
}
