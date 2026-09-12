// mind.exe — Gemini service layer.
// Network/model calls only. Context construction, persistence and React UI live elsewhere.

import { getGenerativeModel } from "firebase/ai";
import { caWithTimeout, CALIBRATION_SCALE_TYPES } from "../analytics/calibration-review.js?v=4.9.0";

let runtimeAiLogic = null;
let runtimeModelName = null;

export function configureAiService({ aiLogic, modelName }) {
  runtimeAiLogic = aiLogic || null;
  runtimeModelName = modelName || null;
  aiGeminiModel = null;
  aiMarketModel = null;
  aiMarketModelPlain = null;
}

function requireAiRuntime() {
  if (!runtimeAiLogic || !runtimeModelName) throw new Error("ai_runtime_not_configured");
}

var AI_SYSTEM_INSTRUCTION = `You are the analytical assistant inside mind.exe, a trading journal app.
You analyze a trader's already-computed journal statistics and behavioral patterns. You are NOT a
financial advisor and must never give trading signals or instructions ("buy", "sell", "go long",
"set your stop here", specific entries/exits/instruments/position sizing).

You analyze: discipline, execution of the trader's own plan, emotional state, statistics, recurring
behavioral patterns, and gaps between plan and outcome.

Rules:
- Every number you cite must come from the JSON context you are given. Never invent statistics,
  dates, trade counts, or patterns that are not present in the data.
- Clearly separate FACT (a number from the data) from INTERPRETATION (your reading of it). Prefer
  phrasing like "this may indicate..." over flat claims.
- Never issue a psychological diagnosis ("you are afraid of profit", "you are addicted to..."). You
  may describe an observed behavioral tendency, but not label the person.
- Win rate and RR (risk/reward) must always be read together, never in isolation. A low win rate
  with a higher RR is not automatically bad trading, and a high win rate with a low RR is not
  automatically good trading. If the app-computed expectancy is available and positive, say so
  explicitly rather than criticizing win rate or RR individually.
- If the sample size for a metric is small or a field is null/missing, say plainly that there isn't
  enough data for a confident conclusion on that point, instead of guessing.
- Never reference the exact time period unless dates are present in the data — don't say "over the
  last few months" if you don't know the span.
- Keep responses concise, concrete, and grounded in the numbers you were given.
- Never pad an answer with advice that would be true for any trader ("stay disciplined", "manage
  your risk", "be careful after a winning streak"). If you cannot attach a statement to a specific
  number from this trader's own data, do not make the statement at all. Saying "there isn't enough
  data for that yet" is always an acceptable and preferred answer.
- The context may contain a "strategy" field: the trader's own description of how they trade. Treat
  it as a GIVEN FRAME, never as a mistake to correct. Do not suggest changing their style, their
  timeframe, how many trades they take, how long they hold, or which sessions they trade \u2014 a
  scalper taking 20 trades a day is executing their strategy, not overtrading. Judge only whether
  they FOLLOWED their own stated rules and how their state affected that. If something in the data
  contradicts the stated strategy, describe the contradiction factually and let the trader draw
  the conclusion.
- You have no market data. Never describe current market conditions, sentiment, or price direction.
- Respond in the language given by the context's "lang" field: "ru" \u2192 Russian, "en" \u2192 English.`;
// V5.4: the previous task asked for "at least one concrete number", which the model satisfied with
// a single stat wrapped in otherwise universal advice. It now has to build every sentence from a
// relationship between fields, and is explicitly shown what a rejected answer looks like.
var AI_INSIGHT_TASK = `Write a personal journal insight (3-6 sentences) for this specific trader, using ONLY the
AGGREGATED_CONTEXT JSON below.

Your job is to find a CONNECTION between two or more things in this trader's own data \u2014 not to
describe the market and not to give advice that would fit any trader on any day.

Hard requirements:
- Every claim must be tied to a countable fact from the context: a count, a percentage, an average,
  a change, or a comparison between two groups. Name the number.
- Prefer linking fields to each other. Useful sources of links: exitBehavior (tpReachedPct vs
  slRespectedPct, earlyExitCount, avgRRLostToEarlyExit, avgConfidenceBeforeEarlyExit,
  avgSatisfactionAfterEarlyExit), afterStreakBehavior (riskChangeVsBaselinePct, manualClosePct
  after two wins or two losses), recentClosedSequence (an actual run of recent trades \u2014 you may
  say "N of the last M"; each carries stateBefore and, where the trader filled it in, stateAfter.
  Both are self-reported intensities, 0-100, one number PER EMOTION, and they are independent: the
  trader can report high confidence AND high fear at the same time. stateBefore holds confidence,
  fear, calm, tension; stateAfter holds pleased, disappointed, atPeace, stung \u2014 a reaction to the
  RESULT, not a read on the setup. Each also carries conflict (0-100): how strongly OPPOSITE
  emotions were reported together. High conflict means a genuinely mixed state \u2014 do not describe
  it as calm or as confident, describe the tension between the two. Never average opposing
  emotions into a single "mood" number. Older entries instead carry an "axes" object (two combined
  axes, no per-emotion detail); treat those as coarser and do not compare them numerically with
  per-emotion entries), emotionalShift (calmShift plus avgSatisfactionAfter,
  split by outcome and by close type \u2014 e.g. wins that still end with low satisfaction or low calm,
  or losses the trader takes calmly),
  journal.repeatedLessons (the same lesson written repeatedly), calibration.statedVsActualNote
  (stated state vs what actually happened), emotional.bestState/worstState, holdTime.
- State the observation first, then at most one careful interpretation ("this may indicate...").
- If a block you would need is null, or its sample is small (sample/sampleSize below ~5), do not
  build an insight on it. If NOTHING in the context supports a specific observation yet, say plainly
  and briefly what is still missing (e.g. how few closed trades or filled-in reflections there are)
  and stop. A short honest "not enough data yet" answer is correct and preferred.
- Do not describe market conditions, sentiment, or what the market is "waiting for" \u2014 you have no
  market data here, only this trader's journal.

Rejected (too generic, never write like this): "You sometimes make emotional decisions." /
"Be careful after a winning streak." / "Watch your discipline." / "The market is consolidating."
Accepted (this is the target): "In the last 7 closed trades you closed 3 by hand before TP; in all
three the realized RR came out below the planned one, on average by 0.8R. Before two of those three
you had marked low calm (below 40)."

Plain prose. No headers, no bullet lists, no markdown.`;
var AI_CHAT_TASK = `Answer the trader's USER_QUESTION using AGGREGATED_CONTEXT and, if provided,
RECENT_TRADES as your only source of truth. Use CONVERSATION_SO_FAR for context on the ongoing
chat. Ground the answer in named numbers from the data (counts, percentages, averages, comparisons
between groups) rather than general trading advice. If the data doesn't support a confident answer
\u2014 the relevant field is null, or its sample is under ~5 \u2014 say that plainly and name what is
missing, instead of guessing or filling the gap with universal recommendations.`;

// ---- aiService.js ------------------------------------------------------------
var aiGeminiModel = null;
export function aiGetModel() {
  requireAiRuntime();
  if (!aiGeminiModel) {
    aiGeminiModel = getGenerativeModel(runtimeAiLogic, {
      model: runtimeModelName,
      systemInstruction: AI_SYSTEM_INSTRUCTION,
      generationConfig: { temperature: 0.4, maxOutputTokens: 700 }
    });
  }
  return aiGeminiModel;
}
// V0.7 — generateContent() у Firebase AI Logic не имеет собственного таймаута: при потере
// сети промис может не резолвиться никогда, и вызывающий экран остаётся в состоянии загрузки
// навсегда (та же причина, что чинилась для калибровки в V0.2). Таймаут стоит здесь, в одной
// точке, поэтому его получают все потребители: анализ и чат в Coach, совет на Главной, vision.
export async function aiCallGemini(prompt) {
  const model = aiGetModel();
  const result = await caWithTimeout(model.generateContent(prompt), 3e4, "ai_request_timeout");
  const text = result?.response?.text?.();
  if (!text || !text.trim()) throw new Error("ai_empty_response");
  return text.trim();
}
export async function aiGenerateInsight(context) {
  const prompt = `${AI_INSIGHT_TASK}

AGGREGATED_CONTEXT:
${JSON.stringify(context)}`;
  return aiCallGemini(prompt);
}
export async function aiChatReply(context, recentTrades, history, question) {
  const historyText = (history || []).slice(-10).map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
  const prompt = `${AI_CHAT_TASK}

AGGREGATED_CONTEXT:
${JSON.stringify(context)}

RECENT_TRADES:
${JSON.stringify(recentTrades)}

CONVERSATION_SO_FAR:
${historyText || "(none yet)"}

USER_QUESTION:
${question}`;
  return aiCallGemini(prompt);
}

// ---- aiService.js: Journal review --------------------------------------------
// V1.5 — Gemini подключён к «Разбору» по той же схеме, что и к калибровке: приложение
// само считает ФАКТЫ (числа, выборки, средние) и само хранит рекомендации, а модель
// только переформулирует вопрос под конкретный факт и пишет финальный вывод. Числа
// модели не отдаются на генерацию — она физически не может их выдумать, потому что
// evidence подставляется наш. Оба вызова необязательные: при отказе сети, таймауте или
// неожиданном ответе остаются зашитые формулировки, и разбор работает как раньше.
var AI_REVIEW_QUESTIONS_TASK = `You are writing the question wording for a self-review inside mind.exe, a
trading journal. You receive REVIEW_FACTS: a JSON array of findings the app already computed from this
trader's own journal. Each has an id, a title, and an evidence string containing real numbers.

For each finding, rewrite its "question" so it refers to that finding's own evidence and sounds like it
was written for this specific person. Keep it to one or two plain sentences.

Rules:
- Never invent, change, or restate a number that is not in that finding's evidence.
- Never diagnose or label the person ("you are impulsive", "you have a problem with..."). Ask about what
  they notice in themselves.
- Do not phrase a question so there is an obviously correct answer to give. It must honestly probe.
- Do not give advice here \u2014 only the question. The app supplies recommendations itself.
- Every question is answered on the same fixed agree/disagree scale, which the app owns. Do not
  propose answers, scores, or scales.
- Write in the language given by LANG ("ru" \u2192 Russian, "en" \u2192 English).
- Return ONLY a JSON array, no markdown fences, no commentary:
  [{"id": "<the same id you were given>", "question": "..."}]
  Use every id exactly once. If you cannot improve a question, return its id with your best rewording
  anyway \u2014 do not omit it and do not add ids that were not given to you.`;
export async function aiReviewQuestions(issues, lang) {
  const facts = (issues || []).map((i) => ({ id: i.id, title: i.title, evidence: i.evidence, currentQuestion: i.question }));
  if (!facts.length) return {};
  const prompt = `${AI_REVIEW_QUESTIONS_TASK}

LANG: ${lang === "en" ? "en" : "ru"}

REVIEW_FACTS:
${JSON.stringify(facts)}`;
  const raw = await aiCallGemini(prompt);
  const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
  if (!Array.isArray(parsed)) throw new Error("ai_review_bad_shape");
  const allowed = new Set(facts.map((f) => f.id));
  const out = {};
  for (const item of parsed) {
    // Принимаются только id, которые мы сами отдали: любой придуманный моделью
    // идентификатор игнорируется, иначе в разбор попал бы вопрос без факта под ним.
    if (item && allowed.has(item.id) && typeof item.question === "string" && item.question.trim().length > 8) {
      out[item.id] = item.question.trim();
    }
  }
  return out;
}
var AI_REVIEW_SUMMARY_TASK = `You are writing the closing summary of a self-review inside mind.exe, a trading
journal. You receive REVIEW_RESULT: the findings the app computed from the trader's own journal, and, for
each one, how strongly the trader agreed it applies to them (agreement 0-3, where 3 is full agreement).

Write 3-5 sentences addressed to the trader, in the language given by LANG.

Rules:
- Use only numbers that appear in the evidence strings you were given. Never invent statistics.
- The most useful thing you can point out is a MISMATCH: a finding the numbers show clearly but the
  trader disagreed with, or one they strongly agreed with that the numbers do not yet support. Name it
  plainly if it exists.
- Separate fact from reading: say "the journal shows X" for numbers and "this may mean" for your
  interpretation.
- Never diagnose, never label the person, never give trading instructions (what to buy, sell, or when
  to enter). Guidance is only about how they make decisions.
- If the findings are few or the samples are small, say so honestly instead of overreaching.
- Return ONLY the text. No markdown, no headings, no bullet points, no quotes.`;
export async function aiReviewSummary(issues, answers, lang) {
  const facts = (issues || []).map((i) => ({
    title: i.title,
    evidence: i.evidence,
    fromJournal: !!i.dataDriven,
    agreement: answers?.[i.id]?.score ?? null
  })).filter((f) => f.agreement != null);
  if (!facts.length) throw new Error("ai_review_no_answers");
  const prompt = `${AI_REVIEW_SUMMARY_TASK}

LANG: ${lang === "en" ? "en" : "ru"}

REVIEW_RESULT:
${JSON.stringify(facts)}`;
  return aiCallGemini(prompt);
}
// ---- aiService.js: Market snapshot (hourly, Google Search-grounded) -----------
// Separate model instance from aiGetModel(): the journal-analysis model's system instruction
// explicitly forbids inventing facts not present in the user's own data, which is the right rule
// for coaching but wrong here — this one needs to go out and read the actual current market via
// Gemini's Google Search grounding tool. Same aiLogic/Firebase AI Logic client, same Gemini
// Developer API key setup, just a different getGenerativeModel() config — not a second AI
// integration. Result is cached in Firestore (storageGet/storageSet, shared:true) once per hour
// PER ASSET CLASS, not per user — everyone trading the same asset class reads the same cached
// snapshot for that hour instead of triggering a fresh Gemini+Search call each time someone opens
// the Home tab. Any failure (unsupported tool, quota, network, bad JSON) falls back to the last
// cached snapshot, then to null — the Home screen already has its own local-only fallback text for
// that case, so nothing breaks if this never succeeds.
var aiMarketModel = null;
function aiGetMarketModel() {
  requireAiRuntime();
  if (!aiMarketModel) {
    aiMarketModel = getGenerativeModel(runtimeAiLogic, {
      model: runtimeModelName,
      tools: [{ googleSearch: {} }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 400 }
    });
  }
  return aiMarketModel;
}
var aiMarketModelPlain = null;
function aiGetMarketModelPlain() {
  requireAiRuntime();
  if (!aiMarketModelPlain) {
    aiMarketModelPlain = getGenerativeModel(runtimeAiLogic, {
      model: runtimeModelName,
      generationConfig: { temperature: 0.3, maxOutputTokens: 400 }
    });
  }
  return aiMarketModelPlain;
}
function marketFocusText(assetClass) {
  if (assetClass === "forex") return "the FX/forex market \u2014 DXY direction, major pairs, central bank policy and macro data releases that could move currencies in the next few hours";
  if (assetClass === "stocks") return "the stock market \u2014 major indices, macro catalysts, earnings or data releases that could move equities in the next few hours";
  return "the crypto market (BTC, ETH and majors) \u2014 price action, the dominant narrative, and anything that could move prices in the next few hours";
}
// V0.3 — прежний промпт просил буквально "summarize the market right now" в 1-2 предложения и
// ничего больше, поэтому на выходе стабильно получалась вода вида "рынок консолидируется, ожидая
// сигналов". Теперь от модели требуется проверяемая конкретика: каждое предложение должно
// содержать число, уровень или названное событие, а список типовых пустых формулировок запрещён
// явно. Дополнительно возвращается facts[] — короткие фактические строки, которые второй слой
// (aiGenerateMarketLink) связывает со статистикой конкретного трейдера.
function buildMarketPrompt(assetClass, lang, grounded) {
  const langName = lang === "en" ? "English" : "Russian";
  const lead = grounded ? "Using current, real information from the web, describe" : "Describe, using your best current knowledge,";
  return `${lead} ${marketFocusText(assetClass)} right now.

Hard requirements for "summary" and "facts":
- Every sentence must carry something verifiable: a price, a percentage move, a concrete level,
  a named asset, or a named event with its timing. No sentence without one.
- Banned as empty filler \u2014 do not write these or anything equivalent: "cautious optimism",
  "the market is consolidating", "awaiting new signals", "moderate volatility", "mixed sentiment",
  "traders are watching closely", "holding its positions".
- Name what actually moved and by how much, and what specifically is driving it, instead of
  characterising the mood in the abstract.
- If you are not confident about a number, leave it out rather than inventing it \u2014 but then say
  plainly what is unknown instead of filling the space with a generic sentence.

Return ONLY this JSON, no markdown fences, no commentary, no extra keys:
{"moodLabel":"<one or two words in ${langName}, e.g. 'Reactive'/'Calm'/'Volatile'>","summary":"<1-2 sentences in ${langName}, each with a concrete number, level or named event>","facts":["<up to 3 short factual strings in ${langName}, each with a number or a named event>"],"btcDominance":<number 0-100 or null${assetClass !== "crypto" ? " (null unless directly relevant)" : ""}>,"sentimentScore":<number 0-100, general market risk sentiment, or null>,"sentimentLabel":"<short label in ${langName} matching sentimentScore, or null>"}`;
}
async function aiRunMarketModel(model, prompt) {
  const result = await caWithTimeout(model.generateContent(prompt), 3e4, "ai_market_timeout");
  const text = result?.response?.text?.();
  if (!text || !text.trim()) throw new Error("ai_empty_response");
  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  const num = (v) => typeof v === "number" && isFinite(v) ? v : null;
  return {
    moodLabel: typeof parsed.moodLabel === "string" && parsed.moodLabel.trim() ? parsed.moodLabel.trim() : null,
    summary: typeof parsed.summary === "string" && parsed.summary.trim() ? parsed.summary.trim() : null,
    // V0.3 — факты нужны второму слою (персональная связка); в UI напрямую не выводятся.
    facts: Array.isArray(parsed.facts) ? parsed.facts.filter((f) => typeof f === "string" && f.trim()).map((f) => f.trim()).slice(0, 3) : [],
    btcDominance: num(parsed.btcDominance),
    sentimentScore: num(parsed.sentimentScore),
    sentimentLabel: typeof parsed.sentimentLabel === "string" && parsed.sentimentLabel.trim() ? parsed.sentimentLabel.trim() : null
  };
}
export async function aiFetchMarketSnapshot(assetClass, lang) {
  try {
    // V0.3 — grounded: true означает, что сводка построена по реальным данным из веба.
    // При false (fallback ниже) UI показывает пометку "без свежих данных", а не выдаёт
    // догадку модели за актуальную картину рынка.
    const snap = await aiRunMarketModel(aiGetMarketModel(), buildMarketPrompt(assetClass, lang, true));
    return { ...snap, grounded: true };
  } catch (groundedErr) {
    // Google Search grounding (tools:[{googleSearch:{}}]) may not be supported for this
    // model/SDK combo, or may refuse strict-JSON output while grounded — either way, fall back to
    // a plain (non-grounded) call so the insight still updates with Gemini's own knowledge instead
    // of silently doing nothing. Logged clearly so the actual cause is visible in devtools.
    console.error("mind.exe market snapshot: grounded call failed, retrying without Search tool:", groundedErr);
    const snap = await aiRunMarketModel(aiGetMarketModelPlain(), buildMarketPrompt(assetClass, lang, false));
    return { ...snap, grounded: false };
  }
}
// ---- V0.4: совет на главном экране (журнал, а не рынок) ----------------------
// Блок «Инсайт» на Home больше не пересказывает рынок: он выдаёт один короткий вывод по
// СОБСТВЕННЫМ данным трейдера — последние сделки, состояние, повторяющиеся паттерны, время
// удержания, калибровка — плюс описание стратегии из настроек. Никакой новой AI-системы:
// используется тот же aiBuildContext() и тот же aiGetModel(), что и в Coach; его system
// instruction уже запрещает торговые сигналы и (с V0.4) запрещает предлагать смену стиля
// торговли. Рыночный снапшот остаётся только для строки метрик внизу главной (BTC.D / F&G).
var AI_HOME_ADVICE_TASK = `Write ONE short piece of guidance (2-3 sentences) for this trader's home screen,
using ONLY the AGGREGATED_CONTEXT JSON below.

What this is: a single observation about how this person has been executing lately \u2014 built from
their recent closed trades, their state before/after those trades, repeated lessons, hold time,
and calibration \u2014 and at most one careful suggestion about their own process.

Hard rules:
- Not a trading recommendation. No instruments, no directions, no entries, exits, stops, targets or
  position sizes. Nothing about the market.
- Never suggest changing their strategy or style. If "strategy" is present in the context, it is the
  frame you work inside. Trade frequency, timeframe, hold duration and session choice are the
  trader's decisions \u2014 a scalper with many trades per day is following their plan, not making a
  mistake. If no strategy is described, still do not judge style: stick to consistency with their
  OWN past behaviour and their own stated plans.
- Ground it in a named number from the context (a count, an average, a percentage, "N of the last M").
- No motivational filler and nothing that would be true for any trader. If the data is too thin
  (few closed trades, empty reflections, no calibration), say plainly in one sentence what is
  missing and stop \u2014 that is a correct answer.
- Plain prose, no headers, no lists, no markdown.`;
export async function aiGenerateHomeAdvice(context) {
  const prompt = `${AI_HOME_ADVICE_TASK}

AGGREGATED_CONTEXT:
${JSON.stringify(context)}`;
  return aiCallGemini(prompt);
}

var AI_CALIBRATION_TASK = `You are generating a pre-session trading-psychology calibration for mind.exe. You will
receive ADAPTIVE_CONTEXT: a compact JSON with yesterday's trading facts, a short recent window, detected
patterns, a list of adaptiveFactors (each with type/severity/evidence, already computed by the app \u2014
never invent new ones), and recentQuestions already asked in previous calibrations.

Pick the 2 to 4 adaptiveFactors that are most relevant RIGHT NOW (prefer higher severity, but rotate away
from factors that already dominate recentQuestions \u2014 don't ask essentially the same question again).
For each chosen factor, write ONE short, concrete, specific question that references the actual evidence
(a number, a time gap, a streak \u2014 whatever is in the context) rather than a generic mood question. Cover
both directions: a loss-related factor implies possible revenge/fear, a win-streak factor implies possible
euphoria/overconfidence, a no-trades factor implies possible FOMO \u2014 match the question's tone to the
factor's actual direction, don't treat everything as a problem.

If ADAPTIVE_CONTEXT.strategy is present, it is the trader's own description of how they trade. Never
imply that their style is the problem: trade frequency, timeframe, hold duration and session choice
are deliberate parts of their plan, not symptoms. A scalper with many trades in a day is executing
their strategy. Ask about their state and whether they followed their OWN rules, not about changing
those rules.

Rules:
- Never diagnose or label the person ("you have a problem with...", "you are addicted to..."). Use the
  observation \u2192 question \u2192 awareness pattern instead.
- Never phrase a question so there's an obviously "correct" answer to pick \u2014 it must honestly probe the
  person's actual state, not lead them.
- Do not calculate any score, tier, or awareness value yourself \u2014 only write the question text.
- Each question must be a single sentence or two, in plain conversational language, in the language given
  by ADAPTIVE_CONTEXT.lang ("ru" \u2192 Russian, "en" \u2192 English).
- Every question is answered on a 4-point scale, but the WORDING of that scale must fit how you phrased
  the question. Choose one scaleType per question from this fixed list \u2014 you only pick the name, the
  app supplies the actual button text and never lets you set scores:
  \u2022 "readiness" \u2014 for a yes/no question about what the person will DO ("will you keep your usual
    risk size today even if...", "\u0431\u0443\u0434\u0435\u0448\u044C \u043B\u0438 \u0442\u044B...").
  \u2022 "confidence" \u2014 for "how confident/sure are you that..." questions.
  \u2022 "calm" \u2014 for questions about the person's emotional/physical state right now.
  \u2022 "impact" \u2014 for "how much did [an event] affect your [judgment/read of the market/plan]"
    questions \u2014 use this one whenever the question isn't naturally a yes/no, e.g. it asks the person
    to RATE something rather than commit to an action.
  \u2022 "ease" \u2014 for "how easy/hard will it be to..." questions.
  \u2022 "comfort" \u2014 for "how comfortable are you with..." questions.
  \u2022 "likelihood" \u2014 for "how likely is it that..." questions about a future outcome.
  \u2022 "frequency" \u2014 for "how often do you..." questions about a habit.
  \u2022 "presence" \u2014 for "how well do you remember / how present is..." questions about a past lesson.
  \u2022 "energy" \u2014 for questions about physical resources: rest, sleep, energy for the session.
  Pick the one that genuinely matches the grammar of the question you wrote \u2014 do NOT default to
  "readiness" for a question that isn't a yes/no; pick the matching scale instead of rephrasing.
- Return ONLY a JSON array, no markdown fences, no commentary: [{"question": "...", "factor": "...",
  "category": "adaptive", "scaleType": "readiness", "priority": 0.0}]. "factor" must be one of the
  adaptiveFactors' type values you were given. "scaleType" must be exactly one of readiness/confidence/
  calm/impact. "priority" is 0-1, how relevant this question is right now.`;
export async function aiGenerateCalibrationQuestions(context) {
  if (!context.adaptiveFactors.length) return [];
  const prompt = `${AI_CALIBRATION_TASK}

ADAPTIVE_CONTEXT:
${JSON.stringify(context)}`;
  const raw = await aiCallGemini(prompt);
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error("ai_calibration_bad_shape");
  return parsed.filter((q) => q && typeof q.question === "string" && q.question.trim() && typeof q.factor === "string").slice(0, 4).map((q, i) => ({
    id: `adaptive_${i}`,
    text: q.question.trim(),
    factor: q.factor,
    category: "adaptive",
    source: "adaptive",
    priority: typeof q.priority === "number" ? q.priority : 0.5,
    // Gemini only NAMES which pre-built wording fits its own question \u2014 the actual label text
    // and score values for every scaleType live in CALIBRATION_SCALE_SETS, defined by the app.
    // An unrecognised value (or none) falls back to the plain yes/no scale in caScaleSet().
    scaleType: CALIBRATION_SCALE_TYPES.includes(q.scaleType) ? q.scaleType : "readiness"
  }));
}
