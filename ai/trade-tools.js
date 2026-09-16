// mind.exe — AI tools used directly by trade-entry UI.
// Runtime is configured once by app.js so this module reuses the same Firebase AI client/model.

import { getGenerativeModel } from "firebase/ai";
import { runAiRequest } from "../core/ai-request-runtime.js";
import { normalizeResultCurrency, normalizeResultMode } from "../core/trade-math.js";
import { isEntryClosed } from "../core/journal-model.js";

let runtimeAiLogic = null;
let runtimeModelName = null;
let runtimeGetBaseModel = null;
let aiPolishModel = null;

export function configureTradeAi({ aiLogic, modelName, getBaseModel }) {
  runtimeAiLogic = aiLogic || null;
  runtimeModelName = modelName || null;
  runtimeGetBaseModel = typeof getBaseModel === "function" ? getBaseModel : null;
  aiPolishModel = null;
}

function requireRuntime() {
  if (!runtimeAiLogic || !runtimeModelName) throw new Error("ai_runtime_not_configured");
}

function getBaseModel() {
  if (runtimeGetBaseModel) return runtimeGetBaseModel();
  requireRuntime();
  return getGenerativeModel(runtimeAiLogic, { model: runtimeModelName });
}

function getPolishModel() {
  requireRuntime();
  if (!aiPolishModel) {
    aiPolishModel = getGenerativeModel(runtimeAiLogic, {
      model: runtimeModelName,
      generationConfig: { temperature: 0.05, maxOutputTokens: 300 }
    });
  }
  return aiPolishModel;
}

var AI_POLISH_TASK = "Lightly copyedit the trader's own journal note below: fix grammar, punctuation and awkward phrasing, and merge fragments into smooth sentences. Preserve the original meaning, tone, facts and language exactly \u2014 do not add, remove, reinterpret, or answer it as if it were a question, and do not give advice. Return ONLY the edited text, no quotes, no commentary, no markdown.";

export async function aiPolishText(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) throw new Error("ai_empty_text");
  const model = getPolishModel();
  return runAiRequest({
    key: "journal_polish", operation: "AI_POLISH", timeoutMs: 12000, retries: 1, slowMs: 4500,
    execute: async () => {
      const result = await model.generateContent(`${AI_POLISH_TASK}

TEXT:
${trimmed}`);
      const out = result?.response?.text?.();
      if (!out || !out.trim()) throw new Error("ai_model_empty_response");
      return out.trim();
    }
  });
}

// ---- aiService.js: Vision (trade screenshot recognition) ----------------------
// Reuses the same aiGeminiModel singleton — Gemini flash-lite is multimodal, no second
// client/model is created. Called only from an explicit user action (NewEntry "Распознать").
var AI_VISION_TRADE_TASK = `You are analyzing a screenshot of a trading platform or chart (TradingView,
Binance, Bybit, or similar — light or dark theme, desktop or mobile). Extract ONLY information that is
clearly and visibly present in the image: asset/instrument symbol, trade direction, entry price, stop
loss, take profit. Do NOT guess, calculate, or infer any value not directly visible. If a field is
missing, ambiguous, or poorly readable, its value must be null. Do not give trading advice or interpret
future price scenarios. Return ONLY this JSON shape, no markdown fences, no commentary:
{"asset":{"value":string|null,"confidence":0-1},"direction":{"value":"LONG"|"SHORT"|null,"confidence":0-1},"entryPrice":{"value":number|null,"confidence":0-1},"stopLoss":{"value":number|null,"confidence":0-1},"takeProfit":{"value":number|null,"confidence":0-1}}`;
export async function aiRecognizeTradeFromImage(dataUrl) {
  const m = /^data:(image\/[a-zA-Z]+);base64,(.+)$/.exec(dataUrl || "");
  if (!m) throw new Error("ai_bad_image");
  const model = getBaseModel();
  return runAiRequest({
    key: "trade_vision", operation: "AI_VISION", timeoutMs: 30000, retries: 0, slowMs: 6000,
    execute: async () => {
      const result = await model.generateContent([
        { text: AI_VISION_TRADE_TASK },
        { inlineData: { mimeType: m[1], data: m[2] } }
      ]);
      const text = result?.response?.text?.();
      if (!text || !text.trim()) throw new Error("ai_model_empty_response");
      const cleaned = text.replace(/```json|```/g, "").trim();
      let parsed;
      try { parsed = JSON.parse(cleaned); } catch { throw new Error("ai_vision_bad_json"); }
      const CONFIDENT = 0.72;
      const field = (f) => ({ value: parsed?.[f]?.value ?? null, confidence: Number(parsed?.[f]?.confidence) || 0 });
      const confidentValue = (f) => { const x = field(f); return x.confidence >= CONFIDENT ? x.value : null; };
      const num = (f) => { const v = confidentValue(f); return typeof v === "number" && isFinite(v) ? v : null; };
      const dir = confidentValue("direction");
      const asset = confidentValue("asset");
      const uncertainFields = ["asset","direction","entryPrice","stopLoss","takeProfit"].filter((f) => { const x = field(f); return x.value != null && x.confidence < CONFIDENT; });
      return {
        asset: typeof asset === "string" && asset.trim() ? asset.trim() : null,
        direction: dir === "LONG" ? "Long" : dir === "SHORT" ? "Short" : null,
        entryPrice: num("entryPrice"), stopLoss: num("stopLoss"), takeProfit: num("takeProfit"),
        uncertainFields, confidence: Object.fromEntries(["asset","direction","entryPrice","stopLoss","takeProfit"].map((f)=>[f, field(f).confidence]))
      };
    }
  });
}

// ---- aiService.js: Strategy Lab -----------------------------------------------
var aiStrategyModel = null;
var AI_STRATEGY_SYSTEM_INSTRUCTION = `You are the Strategy Lab analyst inside mind.exe.
Your job is to evaluate a trader's self-defined technical strategy using ONLY:
1) the strategy description;
2) statistics already calculated by the app;
3) a compact list of the trader's own closed trades.

Do not predict future prices, do not invent market facts, and do not claim that a strategy is
profitable or has an edge from a tiny sample. If the sample is under 10 closed trades, explicitly say
that confidence is low; under 5, treat numerical conclusions as preliminary only.

Focus on test quality: whether the rules are specific enough to reproduce, what the data actually
suggests, where results differ by long/short or rule adherence when those fields exist, and what ONE
or TWO concrete variables should be tested next. Never fabricate a metric that is not present.
Write in the requested language. Keep the answer concise, practical, and grounded in numbers.`;
function aiGetStrategyModel() {
  if (!aiStrategyModel) {
    aiStrategyModel = getGenerativeModel(runtimeAiLogic, {
      model: runtimeModelName,
      systemInstruction: AI_STRATEGY_SYSTEM_INSTRUCTION,
      generationConfig: { temperature: 0.35, maxOutputTokens: 750 }
    });
  }
  return aiStrategyModel;
}
export async function aiAnalyzeStrategy(strategy, stats, trades, measureMode, currency, lang = "ru") {
  const compactTrades = (trades || []).filter((t) => isEntryClosed(t) && typeof t.r === "number").slice(-80).map((t) => ({
    source: t.__source || t.source || "strategy",
    instrument: t.instrument || null,
    direction: t.direction || null,
    timeframe: t.timeframe || null,
    plannedRR: typeof t.plannedRR === "number" ? Math.round(t.plannedRR * 100) / 100 : null,
    realizedRR: typeof t.realizedRR === "number" ? Math.round(t.realizedRR * 100) / 100 : null,
    result: typeof t.r === "number" ? Math.round(t.r * 100) / 100 : null,
    resultMode: normalizeResultMode(t.resultMode),
    resultCurrency: normalizeResultCurrency(t.resultCurrency),
    rulesFollowed: typeof t.rulesFollowed === "boolean" ? t.rulesFollowed : null
  }));
  const prompt = `LANG: ${lang}
MEASURE_MODE: ${measureMode}
CURRENCY: ${currency}

STRATEGY:
${JSON.stringify({
    name: strategy?.name || "",
    version: strategy?.version || 1,
    description: strategy?.description || ""
  })}

APP_CALCULATED_STATS:
${JSON.stringify(stats)}

CLOSED_TRADES:
${JSON.stringify(compactTrades)}

RESULT UNIT RULE:
- resultMode="R" means risk-normalized R.
- resultMode="currency" means money in resultCurrency.
- resultMode=null means legacy/unknown historical unit.
- Never add or directly compare incompatible units or different currencies.
- APP_CALCULATED_STATS already filters numeric result sums to MEASURE_MODE/CURRENCY.

Return plain text with three short sections:
1. What the sample actually shows.
2. Weak spots / ambiguity in the rules or data.
3. What to test next.
Do not use markdown tables.`;
  const model = aiGetStrategyModel();
  return runAiRequest({
    key: "strategy_analysis", operation: "AI_STRATEGY_ANALYSIS", timeoutMs: 30000, retries: 0, slowMs: 6000,
    execute: async () => {
      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.();
      if (!text || !text.trim()) throw new Error("ai_model_empty_response");
      return text.trim();
    }
  });
}
