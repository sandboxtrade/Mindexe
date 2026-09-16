// MIND.EXE — psychological synthesis of the trader's own Decision Lab reasoning.
// Deliberately receives no chart image, symbol price data, market feed or external market facts.

import { getDecisionPsychologyModel } from "./decision-runtime.js";
import { runAiRequest } from "../core/ai-request-runtime.js";
import {
  buildDecisionPsychologyContext,
  calculateDecisionThoughtBalance,
  normalizeDecisionPsychologyAiResponse
} from "../core/decision-psychology.js";

function stripCodeFence(text) {
  return String(text || "").replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

function assertPsychologyOnly(result) {
  const text = Object.values(result || {}).join(" \n ");
  const forbidden = [
    /\b(?:тебе\s+)?(?:нужно|стоит|лучше|следует).{0,24}\b(?:войти|входить|выходить|ждать|дождаться|открыть|закрыть|лонговать|шортить)\b/i,
    /\b(?:рынок|график)\s+(?:показывает|подтверждает|сигнализирует|указывает|говорит)\b/i,
    /\b(?:you\s+)?(?:should|need\s+to|better\s+to).{0,24}\b(?:enter|exit|wait|open|close|go\s+long|go\s+short)\b/i,
    /\b(?:the\s+market|the\s+chart|market|chart)\s+(?:shows|confirms|signals|suggests|indicates)\b/i,
    /\d{1,3}\s*%|\bпроцент(?:а|ов|ы)?\b|\bpercent(?:age)?\b/i
  ];
  const selfQuestion = String(result?.selfQuestion || "");
  const tradingQuestion = /\b(?:войти|входить|выходить|ждать|дождаться|открыть|закрыть|подтверждени\w*|enter|exit|wait|open|close|confirmation)\b/i;
  if (forbidden.some((re) => re.test(text)) || tradingQuestion.test(selfQuestion)) {
    throw new Error("decision_psychology_strategy_leak");
  }
  return result;
}

export async function synthesizeDecisionPsychology({ session, lang = "ru" } = {}) {
  const context = buildDecisionPsychologyContext(session);
  const balance = calculateDecisionThoughtBalance(session);
  const sideLabels = context.mode === "entry"
    ? { a: lang === "en" ? "FOR ENTRY" : "ЗА ВХОД", b: lang === "en" ? "AGAINST ENTRY" : "ПРОТИВ ВХОДА" }
    : { a: "LONG", b: "SHORT" };

  const prompt = `LANGUAGE: ${lang === "en" ? "English" : "Russian"}
DECISION MODE: ${context.mode}
SIDE A: ${sideLabels.a}
SIDE B: ${sideLabels.b}

IMPORTANT BOUNDARY:
You are analyzing ONLY the structure of this person's own thinking. Every statement about price, trend, buyers,
sellers, levels, liquidity, direction or any other market concept is merely a belief stated by the user.
Do NOT decide whether any market statement is true, false, technically valid, strong in the market, or likely to happen.
Do NOT infer anything from a chart. No chart is provided to you. Do NOT give entry/exit/wait/confirmation advice.
Do NOT improve, correct or teach the trader's strategy. Do NOT add any argument that is not in the supplied data.

WHAT "STRONG" MEANS HERE:
Strong = internally strong inside the user's OWN reasoning: the user gave it meaningful logical weight, it is stated
clearly, it is supported by several compatible thoughts, or it is less dependent on an unresolved assumption.
Weak = internally unstable inside the user's OWN reasoning: contradiction, conditional/hypothetical wording,
low self-assigned weight, dependence on one unresolved assumption, or a large mismatch between logical weight and emotional pull.
This is psychological/decision-structure analysis, NOT market analysis.

DETERMINISTIC BALANCE CALCULATED BY CODE (you must not recalculate or invent scores):
${JSON.stringify(balance)}

USER'S OWN MATERIAL:
${JSON.stringify(context)}

TASK:
1. Summarize how SIDE A exists in the user's reasoning, without judging whether SIDE A is correct in the market.
2. Summarize how SIDE B exists in the user's reasoning, same restriction.
3. If neutral/uncertain thoughts materially matter, summarize what uncertainty they represent; otherwise return an empty string.
4. Explain what is internally strongest in the user's reasoning.
5. Explain what is internally weakest/least stable in the user's reasoning.
6. Identify the central psychological/logical conflict preventing clarity.
7. Ask exactly one self-question that helps the user inspect that conflict. The question must not suggest a trade action.
8. If you mention which side has more weight, only mirror the deterministic balance above. Never produce your own percentage,
probability, prediction, recommendation or preferred trade direction.
9. Do not use prescriptive phrases such as "тебе нужно войти", "лучше ждать", "дождись подтверждения", "you should enter".

RETURN EXACTLY JSON, no markdown:
{"sideASummary":"...","sideBSummary":"...","neutralSummary":"...","strongPattern":"...","weakPattern":"...","mainConflict":"...","selfQuestion":"..."}`;

  const model = getDecisionPsychologyModel();
  return runAiRequest({
    key: "decision_psychology_synthesis",
    operation: "DECISION_PSYCHOLOGY_SYNTHESIS",
    timeoutMs: 32000,
    retries: 0,
    slowMs: 7000,
    execute: async () => {
      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.();
      if (!text || !text.trim()) throw new Error("decision_psychology_empty");
      let parsed;
      try { parsed = JSON.parse(stripCodeFence(text)); } catch { throw new Error("decision_psychology_bad_json"); }
      return assertPsychologyOnly(normalizeDecisionPsychologyAiResponse(parsed));
    }
  });
}
