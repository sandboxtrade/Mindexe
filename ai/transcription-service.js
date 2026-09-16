// MIND.EXE — Decision Lab audio transcription.

import { getDecisionTranscriptionModel } from "./decision-runtime.js";
import { runAiRequest } from "../core/ai-request-runtime.js";

async function blobToBase64(blob) {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function normalizeMime(mime) {
  const base = String(mime || "").split(";")[0].trim().toLowerCase();
  if (base.startsWith("audio/")) return base;
  return "audio/webm";
}

export async function transcribeDecisionAudio(blob, { mimeType = null, lang = "ru" } = {}) {
  if (!(blob instanceof Blob) || blob.size === 0) throw new Error("decision_audio_empty");
  if (blob.size > 18 * 1024 * 1024) throw new Error("decision_audio_too_large");
  const model = getDecisionTranscriptionModel();
  const data = await blobToBase64(blob);
  const prompt = lang === "en"
    ? "Transcribe this recording exactly. Plain text only."
    : "Расшифруй эту запись максимально дословно. Верни только текст без пояснений.";
  return runAiRequest({
    key: "decision_transcription", operation: "DECISION_TRANSCRIPTION", timeoutMs: 50000, retries: 0, slowMs: 7000,
    execute: async () => {
      const result = await model.generateContent([
        { text: prompt },
        { inlineData: { mimeType: normalizeMime(mimeType || blob.type), data } }
      ]);
      const text = result?.response?.text?.();
      if (!text || !text.trim()) throw new Error("decision_transcription_empty");
      return text.trim();
    }
  });
}
