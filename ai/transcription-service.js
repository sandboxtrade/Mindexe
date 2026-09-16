// MIND.EXE — Decision Lab audio transcription.
// Browser audio is normalized to mono PCM WAV 16 kHz before Gemini sees it.

import { getDecisionTranscriptionModel, getDecisionTranscriptPolishModel } from "./decision-runtime.js";
import { runAiRequest } from "../core/ai-request-runtime.js";

function hasAudibleTranscript(text) {
  return String(text || "")
    .replace(/\[(?:inaudible|неразборчиво|silence|тишина|no speech)[^\]]*\]/gi, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .length > 0;
}

function protectedTranscriptSignature(text, knownSymbol = "") {
  const source = String(text || "").toLowerCase();
  const numbers = (source.match(/\d+(?:[.,]\d+)?/g) || []).map((value) => value.replace(",", "."));
  const directions = source.match(/\b(?:long|short)\b|(?:лонг|шорт)/g) || [];
  const negations = source.match(/\b(?:not|never|no|without)\b|(?:^|\s)(?:не|нет|без)(?=\s|$)/g) || [];
  const symbol = String(knownSymbol || "").trim().toLowerCase();
  return {
    numbers: numbers.sort().join("|"),
    directions: directions.sort().join("|"),
    negationCount: negations.length,
    containsKnownSymbol: !!symbol && source.includes(symbol)
  };
}

function polishPreservesCriticalContent(rawText, polishedText, knownSymbol = "") {
  const before = protectedTranscriptSignature(rawText, knownSymbol);
  const after = protectedTranscriptSignature(polishedText, knownSymbol);
  if (before.numbers !== after.numbers) return false;
  if (before.directions !== after.directions) return false;
  if (before.negationCount !== after.negationCount) return false;
  if (before.containsKnownSymbol && !after.containsKnownSymbol) return false;
  const rawLength = String(rawText || "").trim().length;
  const polishedLength = String(polishedText || "").trim().length;
  if (rawLength >= 40 && (polishedLength < rawLength * 0.72 || polishedLength > rawLength * 1.35)) return false;
  return true;
}

function cleanModelText(value) {
  let text = String(value || "").trim();
  const fenced = text.match(/^```(?:text)?\s*([\s\S]*?)\s*```$/i);
  if (fenced) text = fenced[1].trim();
  return text;
}

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

function audioBufferToMonoWav(audioBuffer) {
  const targetRate = 16000;
  const sampleCount = Math.max(1, Math.floor(audioBuffer.length * targetRate / audioBuffer.sampleRate));
  const arrayBuffer = new ArrayBuffer(44 + sampleCount * 2);
  const view = new DataView(arrayBuffer);
  const writeString = (offset, value) => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  writeString(0, "RIFF");
  view.setUint32(4, 36 + sampleCount * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, targetRate, true);
  view.setUint32(28, targetRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, sampleCount * 2, true);

  const channels = Array.from({ length: audioBuffer.numberOfChannels }, (_, index) => audioBuffer.getChannelData(index));
  let peak = 0;
  let squareSum = 0;
  for (let i = 0; i < sampleCount; i += 1) {
    const from = Math.floor(i * audioBuffer.sampleRate / targetRate);
    const to = Math.min(audioBuffer.length, Math.max(from + 1, Math.floor((i + 1) * audioBuffer.sampleRate / targetRate)));
    let sample = 0;
    for (const channel of channels) {
      for (let sourceIndex = from; sourceIndex < to; sourceIndex += 1) {
        sample += channel[sourceIndex] / channels.length / (to - from);
      }
    }
    sample = Math.max(-1, Math.min(1, sample));
    peak = Math.max(peak, Math.abs(sample));
    squareSum += sample * sample;
    view.setInt16(44 + i * 2, Math.round(sample * (sample < 0 ? 32768 : 32767)), true);
  }
  return {
    blob: new Blob([arrayBuffer], { type: "audio/wav" }),
    peak,
    rms: Math.sqrt(squareSum / Math.max(1, sampleCount)),
    durationMs: sampleCount / targetRate * 1000
  };
}

export async function normalizeDecisionAudio(blob, AudioContextImpl = globalThis.AudioContext || globalThis.webkitAudioContext) {
  if (!AudioContextImpl) throw new Error("decision_audio_decode_unsupported");
  let context;
  try {
    context = new AudioContextImpl({ sampleRate: 16000 });
  } catch (_) {
    context = new AudioContextImpl();
  }
  let timer = null;
  try {
    const decoded = await Promise.race([
      context.decodeAudioData(await blob.arrayBuffer()),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("decision_audio_decode_timeout")), 15000); })
    ]);
    if (decoded.duration > 190) throw new Error("decision_audio_too_long");
    const normalized = audioBufferToMonoWav(decoded);
    if (normalized.durationMs < 250 || normalized.peak < 0.0001) throw new Error("decision_audio_silent");
    if (normalized.blob.size > 18 * 1024 * 1024) throw new Error("decision_audio_too_large");
    return normalized;
  } catch (error) {
    if (String(error?.message || "").startsWith("decision_audio_")) throw error;
    throw new Error("decision_audio_decode_failed");
  } finally {
    clearTimeout(timer);
    try { await context.close(); } catch (_) {}
  }
}

async function polishTranscript(rawText, { lang = "ru", symbol = "", direction = "" } = {}) {
  const text = String(rawText || "").trim();
  if (!text) return text;
  const model = getDecisionTranscriptPolishModel();
  const context = [symbol ? `Ticker: ${String(symbol).slice(0, 40)}` : "", direction ? `Direction: ${direction}` : ""].filter(Boolean).join("\n");
  const prompt = lang === "en"
    ? `Clean up this speech transcript for readability. Preserve every factual claim, number, ticker, timeframe, LONG/SHORT direction and uncertainty. Fix punctuation and obvious speech-to-text mistakes only. Remove filler words only when doing so cannot change meaning. Never summarize, shorten reasoning, add facts, or make the trader sound more certain than they were. Return plain text only.\n${context}\n\nTRANSCRIPT:\n${text}`
    : `Приведи эту расшифровку речи к аккуратному читаемому тексту. Сохрани каждую мысль, число, тикер, таймфрейм, направление LONG/SHORT и любую неопределённость. Исправляй только пунктуацию и очевидные ошибки распознавания речи. Слова-паразиты убирай только если это точно не меняет смысл. Ничего не сокращай по смыслу, не пересказывай, не добавляй факты и не делай трейдера увереннее, чем он говорил. Верни только готовый текст.\n${context}\n\nРАСШИФРОВКА:\n${text}`;
  try {
    return await runAiRequest({
      key: "decision_transcript_polish",
      operation: "DECISION_TRANSCRIPT_POLISH",
      timeoutMs: 35000,
      retries: 0,
      slowMs: 6000,
      execute: async () => {
        const result = await model.generateContent(prompt);
        const polished = cleanModelText(result?.response?.text?.());
        return hasAudibleTranscript(polished) && polishPreservesCriticalContent(text, polished, symbol)
          ? polished
          : text;
      }
    });
  } catch (_) {
    // The verbatim transcript is still useful and already paid for. A formatting failure must not
    // force the user to re-record or lose the successful transcription.
    return text;
  }
}

export async function transcribeDecisionAudio(blob, { mimeType = null, lang = "ru", symbol = "", direction = "" } = {}) {
  if (!(blob instanceof Blob) || blob.size === 0) throw new Error("decision_audio_empty");
  if (blob.size > 18 * 1024 * 1024) throw new Error("decision_audio_too_large");

  const model = getDecisionTranscriptionModel();
  const normalized = await normalizeDecisionAudio(blob);
  const data = await blobToBase64(normalized.blob);
  const context = [symbol ? `Known ticker: ${String(symbol).slice(0, 40)}` : "", direction ? `Known direction: ${direction}` : ""].filter(Boolean).join("\n");
  const prompt = lang === "en"
    ? `Transcribe this recording as accurately and completely as possible. Preserve punctuation, numbers, ticker symbols, timeframes and trading terms. Do not summarize. Plain text only.\n${context}`
    : `Расшифруй эту запись максимально точно и полностью. Сохраняй числа, тикеры, таймфреймы и торговые термины. Не пересказывай и не сокращай. Расставь естественную пунктуацию. Верни только текст без пояснений.\n${context}`;

  const rawText = await runAiRequest({
    key: "decision_transcription",
    operation: "DECISION_TRANSCRIPTION",
    timeoutMs: 90000,
    retries: 0,
    slowMs: 7000,
    execute: async () => {
      const result = await model.generateContent([
        { text: prompt },
        { inlineData: { mimeType: "audio/wav", data } }
      ]);
      const text = cleanModelText(result?.response?.text?.());
      if (!hasAudibleTranscript(text)) throw new Error("decision_transcription_inaudible");
      return text;
    }
  });

  return polishTranscript(rawText, { lang, symbol, direction });
}
