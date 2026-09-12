// mind.exe — calibration and journal-review engine.
// Questionnaire construction/scoring only; no React UI or persistence writes.

import { entriesWithRealizedRR, hasRealizedRR } from "../core/trade-math.js?v=1";
import { patternEngineV2 } from "./trader-analytics.js?v=1";
import { WIN, LOSS, WARN } from "../config/app-config.js?v=1";

export const CALIBRATION_QUESTIONS = [
  {
    id: "sleep",
    text: "\u041A\u0430\u043A \u0432\u044B \u0441\u043F\u0430\u043B\u0438 \u0441\u0435\u0433\u043E\u0434\u043D\u044F?",
    positive: "\u0425\u043E\u0440\u043E\u0448\u0438\u0439 \u0441\u043E\u043D",
    negative: "\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u043A \u0441\u043D\u0430",
    options: [
      { label: "\u041E\u0442\u043B\u0438\u0447\u043D\u043E", score: 2 },
      { label: "\u041D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u043E", score: 1 },
      { label: "\u041F\u043B\u043E\u0445\u043E", score: -1 },
      { label: "\u041F\u043E\u0447\u0442\u0438 \u043D\u0435 \u0441\u043F\u0430\u043B", score: -2 }
    ]
  },
  {
    id: "emotion",
    text: "\u0412\u0430\u0448\u0435 \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435?",
    positive: "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435",
    negative: "\u041F\u043E\u0432\u044B\u0448\u0435\u043D\u043D\u0430\u044F \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C",
    options: [
      { label: "\u0421\u043F\u043E\u043A\u043E\u0435\u043D", score: 2 },
      { label: "\u041D\u0435\u043C\u043D\u043E\u0433\u043E \u043D\u0430\u043F\u0440\u044F\u0436\u0451\u043D", score: 0 },
      { label: "\u0420\u0430\u0437\u0434\u0440\u0430\u0436\u0451\u043D", score: -1 },
      { label: "\u041E\u0447\u0435\u043D\u044C \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u0435\u043D", score: -2, flag: "emotion" }
    ]
  },
  {
    id: "motivation",
    text: "\u041F\u043E\u0447\u0435\u043C\u0443 \u0432\u044B \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0435 \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B?",
    positive: "\u0427\u0451\u0442\u043A\u0438\u0439 \u043F\u043B\u0430\u043D \u043D\u0430 \u0441\u0435\u0441\u0441\u0438\u044E",
    negative: "\u0416\u0435\u043B\u0430\u043D\u0438\u0435 \u043E\u0442\u0431\u0438\u0442\u044C \u0443\u0431\u044B\u0442\u043A\u0438",
    options: [
      { label: "\u0421\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u044C \u043F\u043B\u0430\u043D\u0443", score: 2 },
      { label: "\u0415\u0441\u0442\u044C \u0445\u043E\u0440\u043E\u0448\u0438\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438", score: 1 },
      { label: "\u0425\u043E\u0447\u0443 \u043E\u0442\u0431\u0438\u0442\u044C \u0443\u0431\u044B\u0442\u043A\u0438", score: -2, flag: "revenge" },
      { label: "\u041F\u0440\u043E\u0441\u0442\u043E \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043F\u043E\u0442\u043E\u0440\u0433\u043E\u0432\u0430\u0442\u044C", score: -1 }
    ]
  },
  {
    id: "walkaway",
    text: "\u0415\u0441\u043B\u0438 \u043D\u0435 \u0431\u0443\u0434\u0435\u0442 \u0445\u043E\u0440\u043E\u0448\u0438\u0445 \u0432\u0445\u043E\u0434\u043E\u0432, \u0441\u043C\u043E\u0436\u0435\u0442\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u044C \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B \u0431\u0435\u0437 \u0441\u0434\u0435\u043B\u043A\u0438?",
    positive: "\u0413\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0441\u0435\u0441\u0441\u0438\u044E",
    negative: "\u0421\u043B\u043E\u0436\u043D\u043E \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C\u0441\u044F \u0431\u0435\u0437 \u0441\u0434\u0435\u043B\u043A\u0438",
    options: [
      { label: "\u0414\u0430", score: 2 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u0434\u0430", score: 1 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u043D\u0435\u0442", score: -1 },
      { label: "\u041D\u0435\u0442", score: -2 }
    ]
  },
  {
    id: "noTradeFeeling",
    text: "\u0427\u0442\u043E \u043F\u043E\u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0435\u0442\u0435, \u0435\u0441\u043B\u0438 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043D\u0435 \u0431\u0443\u0434\u0435\u0442 \u043D\u0438 \u043E\u0434\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438?",
    positive: "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u043E \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u043A \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044E \u0441\u0434\u0435\u043B\u043E\u043A",
    negative: "\u0421\u0442\u0440\u0430\u0445 \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435",
    options: [
      { label: "\u041D\u0438\u0447\u0435\u0433\u043E", score: 2 },
      { label: "\u041B\u0451\u0433\u043A\u043E\u0435 \u0440\u0430\u0437\u043E\u0447\u0430\u0440\u043E\u0432\u0430\u043D\u0438\u0435", score: 1 },
      { label: "\u0411\u0443\u0434\u0435\u0442 \u043D\u0435\u043F\u0440\u0438\u044F\u0442\u043D\u043E", score: -1 },
      { label: "\u0411\u0443\u0434\u0443 \u0447\u0443\u0432\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C, \u0447\u0442\u043E \u0443\u043F\u0443\u0441\u0442\u0438\u043B \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C", score: -2, flag: "fomo" }
    ]
  },
  {
    id: "objectivity",
    text: "\u041D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043E\u0431\u044A\u0435\u043A\u0442\u0438\u0432\u043D\u043E \u0432\u044B \u0441\u0435\u0439\u0447\u0430\u0441 \u043E\u0446\u0435\u043D\u0438\u0432\u0430\u0435\u0442\u0435 \u0440\u044B\u043D\u043E\u043A?",
    positive: "\u0422\u0440\u0435\u0437\u0432\u0430\u044F \u043E\u0446\u0435\u043D\u043A\u0430 \u0440\u044B\u043D\u043A\u0430",
    negative: "\u042D\u043C\u043E\u0446\u0438\u0438 \u0432\u043B\u0438\u044F\u044E\u0442 \u043D\u0430 \u043E\u0446\u0435\u043D\u043A\u0443 \u0440\u044B\u043D\u043A\u0430",
    options: [
      { label: "\u041F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E", score: 2 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E", score: 1 },
      { label: "\u0415\u0441\u0442\u044C \u0441\u043E\u043C\u043D\u0435\u043D\u0438\u044F", score: -1 },
      { label: "\u0421\u0438\u043B\u044C\u043D\u044B\u0435 \u044D\u043C\u043E\u0446\u0438\u0438 \u0438\u043B\u0438 \u0447\u0440\u0435\u0437\u043C\u0435\u0440\u043D\u0430\u044F \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C", score: -2, flag: "emotion" }
    ]
  }
];
export const CALIBRATION_QUESTIONS_EN = [
  {
    id: "sleep",
    text: "How did you sleep today?",
    positive: "Good sleep",
    negative: "Lack of sleep",
    options: [
      { label: "Great", score: 2 },
      { label: "Fine", score: 1 },
      { label: "Poorly", score: -1 },
      { label: "Barely slept", score: -2 }
    ]
  },
  {
    id: "emotion",
    text: "How's your emotional state?",
    positive: "Calm state",
    negative: "Elevated emotions",
    options: [
      { label: "Calm", score: 2 },
      { label: "A bit tense", score: 0 },
      { label: "Irritated", score: -1 },
      { label: "Very emotional", score: -2, flag: "emotion" }
    ]
  },
  {
    id: "motivation",
    text: "Why are you opening the terminal today?",
    positive: "Clear plan for the session",
    negative: "Wanting to win back losses",
    options: [
      { label: "To follow the plan", score: 2 },
      { label: "There are good opportunities", score: 1 },
      { label: "I want to win back losses", score: -2, flag: "revenge" },
      { label: "Just feel like trading", score: -1 }
    ]
  },
  {
    id: "walkaway",
    text: "If there are no good entries, can you close the terminal without trading?",
    positive: "Willing to skip the session",
    negative: "Hard to stop without a trade",
    options: [
      { label: "Yes", score: 2 },
      { label: "Probably yes", score: 1 },
      { label: "Probably not", score: -1 },
      { label: "No", score: -2 }
    ]
  },
  {
    id: "noTradeFeeling",
    text: "How would you feel if there were no trades at all today?",
    positive: "Calm about having no trades",
    negative: "Fear of missing out",
    options: [
      { label: "Nothing", score: 2 },
      { label: "Mild disappointment", score: 1 },
      { label: "Would feel unpleasant", score: -1 },
      { label: "Would feel like I missed an opportunity", score: -2, flag: "fomo" }
    ]
  },
  {
    id: "objectivity",
    text: "How objectively are you assessing the market right now?",
    positive: "Sober market assessment",
    negative: "Emotions are affecting your read on the market",
    options: [
      { label: "Completely calm", score: 2 },
      { label: "Mostly calm", score: 1 },
      { label: "Some doubts", score: -1 },
      { label: "Strong emotions or overconfidence", score: -2, flag: "emotion" }
    ]
  }
];
var CALIBRATION_TIERS = [
  { label: "\u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u0430 \u2014 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043E\u0442\u043B\u0438\u0447\u043D\u043E\u0435.", color: WIN },
  { label: "\u0413\u043E\u0442\u043E\u0432 \u043A \u0442\u043E\u0440\u0433\u043E\u0432\u043B\u0435 \u2014 \u043C\u043E\u0436\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \u043F\u043E \u043F\u043B\u0430\u043D\u0443.", color: WIN },
  { label: "\u041F\u043E\u0432\u044B\u0448\u0435\u043D\u043D\u044B\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0440\u0438\u0441\u043A\u0430 \u2014 \u0441\u043E\u0431\u043B\u044E\u0434\u0430\u0442\u044C \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0443.", color: WARN },
  { label: "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u2014 \u0441\u043D\u0438\u0437\u0438\u0442\u044C \u0440\u0438\u0441\u043A \u043D\u0430 30\u201350%.", color: LOSS },
  { label: "\u0422\u043E\u0440\u0433\u043E\u0432\u043B\u044F \u043D\u0435 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u2014 \u0432\u044B\u0441\u043E\u043A\u0430\u044F \u0432\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044C \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0440\u0435\u0448\u0435\u043D\u0438\u0439.", color: LOSS }
];
var CALIBRATION_TIERS_EN = [
  { label: "System stable \u2014 great state.", color: WIN },
  { label: "Ready to trade \u2014 you can work the plan.", color: WIN },
  { label: "Elevated risk level \u2014 stick to discipline.", color: WARN },
  { label: "Caution recommended \u2014 cut risk by 30\u201350%.", color: LOSS },
  { label: "Trading not recommended \u2014 high chance of emotional decisions.", color: LOSS }
];
// ---- Adaptive Calibration: shared answer scale + scorer ---------------------
// Adaptive (Gemini-written) questions don't carry their own per-option scores — that would let
// the model influence scoring, which p.14 of the spec explicitly forbids. Score is always derived
// purely from which option POSITION the user picked (index 0..3 -> -2,-1,1,2); position 0 is
// always the least-favorable/highest-risk answer and position 3 the most-favorable/lowest-risk
// one. That contract never changes.
//
// V5.7: what DID change is that until now every adaptive question was forced onto one single
// yes/no phrasing (CALIBRATION_READINESS_SCALE), even when the question Gemini wrote wasn't a
// yes/no question at all (e.g. "how do you rate the impact of X on Y" answered with
// "Нет/Скорее нет/Скорее да/Да" reads as nonsense). Gemini now also returns a scaleType chosen
// from this fixed, app-defined enum \u2014 it picks WHICH pre-approved wording fits the question it
// wrote, but never writes or scores an option itself, so the p.14 guarantee is unchanged. An
// unrecognised or missing scaleType falls back to "readiness".
export const CALIBRATION_SCALE_SETS = {
  ru: {
    readiness: [
      { label: "\u041D\u0435\u0442", score: -2 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u043D\u0435\u0442", score: -1 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u0434\u0430", score: 1 },
      { label: "\u0414\u0430", score: 2 }
    ],
    confidence: [
      { label: "\u0421\u043E\u0432\u0441\u0435\u043C \u043D\u0435 \u0443\u0432\u0435\u0440\u0435\u043D", score: -2 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u043D\u0435 \u0443\u0432\u0435\u0440\u0435\u043D", score: -1 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u0443\u0432\u0435\u0440\u0435\u043D", score: 1 },
      { label: "\u041F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u0443\u0432\u0435\u0440\u0435\u043D", score: 2 }
    ],
    calm: [
      { label: "\u0421\u043E\u0432\u0441\u0435\u043C \u043D\u0435 \u0441\u043F\u043E\u043A\u043E\u0435\u043D", score: -2 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u043D\u0435 \u0441\u043F\u043E\u043A\u043E\u0435\u043D", score: -1 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u0441\u043F\u043E\u043A\u043E\u0435\u043D", score: 1 },
      { label: "\u041F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u0441\u043F\u043E\u043A\u043E\u0435\u043D", score: 2 }
    ],
    // Impact-style questions ("how much did X affect your reading of Y") run the other visual
    // direction \u2014 heavy impact is position 0 (risk), no impact is position 3 (safe) \u2014 which is
    // exactly the shape the "stop-loss / collected liquidity" example question needed.
    impact: [
      { label: "\u0421\u0438\u043B\u044C\u043D\u043E \u043F\u043E\u0432\u043B\u0438\u044F\u043B\u043E", score: -2 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u043F\u043E\u0432\u043B\u0438\u044F\u043B\u043E", score: -1 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u043D\u0435 \u043F\u043E\u0432\u043B\u0438\u044F\u043B\u043E", score: 1 },
      { label: "\u0421\u043E\u0432\u0441\u0435\u043C \u043D\u0435 \u043F\u043E\u0432\u043B\u0438\u044F\u043B\u043E", score: 2 }
    ],
    // V0.1 — четырёх шкал не хватало: почти все адаптивные вопросы падали на readiness
    // ("\u0414\u0430/\u041D\u0435\u0442"), даже когда вопрос спрашивал "насколько легко/часто/вероятно".
    // Направление у всех одинаковое: -2 = рискованное состояние, +2 = ресурсное.
    ease: [
      { label: "\u041E\u0447\u0435\u043D\u044C \u0442\u044F\u0436\u0435\u043B\u043E", score: -2 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u0442\u044F\u0436\u0435\u043B\u043E", score: -1 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u043B\u0435\u0433\u043A\u043E", score: 1 },
      { label: "\u0421\u043E\u0432\u0441\u0435\u043C \u043B\u0435\u0433\u043A\u043E", score: 2 }
    ],
    comfort: [
      { label: "\u0421\u043E\u0432\u0441\u0435\u043C \u043D\u0435\u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E", score: -2 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u043D\u0435\u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E", score: -1 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E", score: 1 },
      { label: "\u0412\u043F\u043E\u043B\u043D\u0435 \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E", score: 2 }
    ],
    likelihood: [
      { label: "\u0422\u043E\u0447\u043D\u043E \u043D\u0435\u0442", score: -2 },
      { label: "\u0412\u0440\u044F\u0434 \u043B\u0438", score: -1 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u0432\u0441\u0435\u0433\u043E \u0434\u0430", score: 1 },
      { label: "\u041F\u043E\u0447\u0442\u0438 \u043D\u0430\u0432\u0435\u0440\u043D\u044F\u043A\u0430", score: 2 }
    ],
    frequency: [
      { label: "\u041F\u043E\u0447\u0442\u0438 \u043D\u0438\u043A\u043E\u0433\u0434\u0430", score: -2 },
      { label: "\u0418\u043D\u043E\u0433\u0434\u0430", score: -1 },
      { label: "\u0427\u0430\u0441\u0442\u043E", score: 1 },
      { label: "\u041F\u043E\u0447\u0442\u0438 \u0432\u0441\u0435\u0433\u0434\u0430", score: 2 }
    ],
    presence: [
      { label: "\u0421\u043E\u0432\u0441\u0435\u043C \u043D\u0435 \u043F\u043E\u043C\u043D\u044E", score: -2 },
      { label: "\u0421\u043C\u0443\u0442\u043D\u043E", score: -1 },
      { label: "\u0421\u043A\u043E\u0440\u0435\u0435 \u043F\u043E\u043C\u043D\u044E", score: 1 },
      { label: "\u041F\u043E\u043C\u043D\u044E \u0447\u0451\u0442\u043A\u043E", score: 2 }
    ],
    energy: [
      { label: "\u0421\u043E\u0432\u0441\u0435\u043C \u043D\u0435\u0442 \u0441\u0438\u043B", score: -2 },
      { label: "\u0421\u0438\u043B \u043C\u0430\u043B\u043E", score: -1 },
      { label: "\u0421\u0438\u043B \u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E", score: 1 },
      { label: "\u041F\u043E\u043B\u043E\u043D \u0441\u0438\u043B", score: 2 }
    ]
  },
  en: {
    readiness: [
      { label: "No", score: -2 },
      { label: "Probably not", score: -1 },
      { label: "Probably yes", score: 1 },
      { label: "Yes", score: 2 }
    ],
    confidence: [
      { label: "Not confident at all", score: -2 },
      { label: "Somewhat unsure", score: -1 },
      { label: "Fairly confident", score: 1 },
      { label: "Completely confident", score: 2 }
    ],
    calm: [
      { label: "Not calm at all", score: -2 },
      { label: "A bit on edge", score: -1 },
      { label: "Fairly calm", score: 1 },
      { label: "Completely calm", score: 2 }
    ],
    impact: [
      { label: "Affected it a lot", score: -2 },
      { label: "Affected it somewhat", score: -1 },
      { label: "Barely affected it", score: 1 },
      { label: "Didn't affect it at all", score: 2 }
    ],
    ease: [
      { label: "Very hard", score: -2 },
      { label: "Fairly hard", score: -1 },
      { label: "Fairly easy", score: 1 },
      { label: "Very easy", score: 2 }
    ],
    comfort: [
      { label: "Not comfortable at all", score: -2 },
      { label: "Somewhat uncomfortable", score: -1 },
      { label: "Fairly comfortable", score: 1 },
      { label: "Completely comfortable", score: 2 }
    ],
    likelihood: [
      { label: "Definitely not", score: -2 },
      { label: "Unlikely", score: -1 },
      { label: "Likely", score: 1 },
      { label: "Almost certainly", score: 2 }
    ],
    frequency: [
      { label: "Almost never", score: -2 },
      { label: "Sometimes", score: -1 },
      { label: "Often", score: 1 },
      { label: "Almost always", score: 2 }
    ],
    presence: [
      { label: "Don't remember it at all", score: -2 },
      { label: "Vaguely", score: -1 },
      { label: "Mostly remember it", score: 1 },
      { label: "Remember it clearly", score: 2 }
    ],
    energy: [
      { label: "No energy at all", score: -2 },
      { label: "Low energy", score: -1 },
      { label: "Enough energy", score: 1 },
      { label: "Full of energy", score: 2 }
    ]
  }
};
export const CALIBRATION_SCALE_TYPES = ["readiness", "confidence", "calm", "impact", "ease", "comfort", "likelihood", "frequency", "presence", "energy"];
// V0.2 — ограничение времени ожидания для сетевых промисов калибровки (Gemini / Firestore).
// Важно: обработчик .catch вешается на исходный промис, поэтому его поздний reject уже
// обработан и не всплывает как unhandled rejection; таймер очищается в любом исходе.
export function caWithTimeout(promise, ms, tag) {
  let timer = null;
  promise.catch(() => {
  });
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(tag)), ms);
    })
  ]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}
export function caScaleSet(scaleType, lang) {
  const byLang = lang === "en" ? CALIBRATION_SCALE_SETS.en : CALIBRATION_SCALE_SETS.ru;
  return byLang[scaleType] || byLang.readiness;
}

var ADAPTIVE_FACTOR_LABELS = {
  consecutive_losses: { ru: "\u0421\u0435\u0440\u0438\u044F \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A", en: "A losing streak" },
  euphoria_risk: { ru: "\u042D\u0439\u0444\u043E\u0440\u0438\u044F \u043F\u043E\u0441\u043B\u0435 \u0441\u0435\u0440\u0438\u0438 \u043F\u043E\u0431\u0435\u0434", en: "Euphoria after a winning streak" },
  revenge_risk: { ru: "\u0416\u0435\u043B\u0430\u043D\u0438\u0435 \u0431\u044B\u0441\u0442\u0440\u043E \u043E\u0442\u044B\u0433\u0440\u0430\u0442\u044C\u0441\u044F", en: "Wanting to win back losses quickly" },
  increased_risk: { ru: "\u0420\u0438\u0441\u043A \u0432\u044B\u0448\u0435 \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430", en: "Risk creeping up after a loss" },
  overtrading_risk: { ru: "\u0421\u043A\u043B\u043E\u043D\u043D\u043E\u0441\u0442\u044C \u043A \u043F\u0435\u0440\u0435\u0442\u043E\u0440\u0433\u043E\u0432\u043B\u0435", en: "Tendency to overtrade" },
  early_exit_pattern: { ru: "\u0420\u0430\u043D\u043D\u0438\u0435 \u0432\u044B\u0445\u043E\u0434\u044B \u0438\u0437 \u043F\u043E\u0437\u0438\u0446\u0438\u0439", en: "Exiting positions early" },
  fomo_risk: { ru: "FOMO \u2014 \u0441\u0442\u0440\u0430\u0445 \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435", en: "FOMO \u2014 fear of missing the move" },
  repeated_lesson: { ru: "\u041F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0439\u0441\u044F \u0443\u0440\u043E\u043A", en: "A recurring lesson" },
  poor_sleep: { ru: "\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u043A \u0441\u043D\u0430", en: "Lack of sleep" },
  decreased_discipline: { ru: "\u0421\u043D\u0438\u0436\u0435\u043D\u043D\u0430\u044F \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430", en: "Discipline slipping" },
  reflection_note: { ru: "\u0412\u0447\u0435\u0440\u0430\u0448\u043D\u044F\u044F \u0440\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u044F", en: "Yesterday's reflection" }
};
function caFactorLabel(factor, lang) {
  const entry = ADAPTIVE_FACTOR_LABELS[factor];
  if (!entry) return null;
  return lang === "en" ? entry.en : entry.ru;
}
// Works for any question list: static CALIBRATION_QUESTIONS, or the mixed baseline+adaptive
// list assembled by assembleCalibrationQuestions(). Baseline questions keep their embedded
// positive/negative/flag; adaptive questions derive their factor label from q.factor when the
// user picks a low-readiness option (score <= -1) on the shared scale.
export function scoreCalibrationDynamic(questions, answers, lang = "ru") {
  const tiers = lang === "en" ? CALIBRATION_TIERS_EN : CALIBRATION_TIERS;
  const total = questions.reduce((s, q) => s + (answers[q.id]?.score ?? 0), 0);
  const maxAbs = Math.max(1, questions.length) * 2;
  const pct = Math.max(0, Math.min(100, Math.round((total + maxAbs) / (2 * maxAbs) * 100)));
  let tierIndex = pct >= 85 ? 0 : pct >= 70 ? 1 : pct >= 50 ? 2 : pct >= 30 ? 3 : 4;
  const riskFactors = [];
  const factors = [];
  questions.forEach((q) => {
    const a = answers[q.id];
    if (!a) return;
    if (q.source === "adaptive" || q.source === "fallback") {
      const label = caFactorLabel(q.factor, lang);
      if (a.score <= -1 && label && !riskFactors.includes(label)) riskFactors.push(label);
      if (a.score === 2) factors.push({ type: "positive", text: q.text });
      else if (a.score === -2) factors.push({ type: "warning", text: label || q.text });
    } else {
      if (a.score === 2 && q.positive) factors.push({ type: "positive", text: q.positive });
      if (a.score === -2 && q.negative) factors.push({ type: "warning", text: q.negative });
      if (a.flag === "revenge") {
        const t2 = lang === "en" ? "Wanting to win back losses" : "\u0416\u0435\u043B\u0430\u043D\u0438\u0435 \u043E\u0442\u0431\u0438\u0442\u044C \u0443\u0431\u044B\u0442\u043A\u0438";
        if (!riskFactors.includes(t2)) riskFactors.push(t2);
      }
      if (a.flag === "emotion") {
        const t2 = lang === "en" ? "Strong emotional involvement" : "\u0421\u0438\u043B\u044C\u043D\u0430\u044F \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0432\u043E\u0432\u043B\u0435\u0447\u0451\u043D\u043D\u043E\u0441\u0442\u044C";
        if (!riskFactors.includes(t2)) riskFactors.push(t2);
      }
      if (a.flag === "fomo") {
        const t2 = lang === "en" ? "Fear of missing out" : "\u0421\u0442\u0440\u0430\u0445 \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C";
        if (!riskFactors.includes(t2)) riskFactors.push(t2);
      }
    }
  });
  if (riskFactors.length) tierIndex = Math.max(tierIndex, 2);
  return { pct, tier: tiers[tierIndex], riskFactors, factors };
}
export const REVIEW_LIKERT = [
  { label: "\u041F\u043E\u0447\u0442\u0438 \u043D\u0438\u043A\u043E\u0433\u0434\u0430", score: 0 },
  { label: "\u0418\u043D\u043E\u0433\u0434\u0430", score: 1 },
  { label: "\u0427\u0430\u0441\u0442\u043E", score: 2 },
  { label: "\u041F\u043E\u0447\u0442\u0438 \u0432\u0441\u0435\u0433\u0434\u0430", score: 3 }
];
export const REVIEW_LIKERT_EN = [
  { label: "Almost never", score: 0 },
  { label: "Sometimes", score: 1 },
  { label: "Often", score: 2 },
  { label: "Almost always", score: 3 }
];
var REVIEW_MIN_QUESTIONS = 5;
var REVIEW_MAX_QUESTIONS = 8;
var GENERIC_REVIEW_QUESTIONS = [
  {
    id: "g_plan",
    dataDriven: false,
    title: "\u0422\u043E\u0440\u0433\u043E\u0432\u043B\u044F \u0431\u0435\u0437 \u043F\u043B\u0430\u043D\u0430",
    evidence: "\u041E\u0431\u0449\u0438\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u0436\u0443\u0440\u043D\u0430\u043B \u043F\u043E\u043A\u0430 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0435\u0433\u043E \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043F\u043E \u0446\u0438\u0444\u0440\u0430\u043C.",
    question: "\u041A\u0430\u043A \u0447\u0430\u0441\u0442\u043E \u0442\u044B \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0448\u044C \u0441\u0434\u0435\u043B\u043A\u0443 \u0431\u0435\u0437 \u0437\u0430\u0440\u0430\u043D\u0435\u0435 \u043F\u0440\u043E\u043F\u0438\u0441\u0430\u043D\u043D\u043E\u0433\u043E \u043F\u043B\u0430\u043D\u0430 \u2014 \u0442\u043E\u0447\u043A\u0438 \u0432\u0445\u043E\u0434\u0430, \u0441\u0442\u043E\u043F\u0430 \u0438 \u0446\u0435\u043B\u0438?",
    recommendation: "\u041F\u0440\u0435\u0436\u0434\u0435 \u0447\u0435\u043C \u0432\u0445\u043E\u0434\u0438\u0442\u044C, \u0437\u0430\u043F\u0438\u0448\u0438 \u0442\u0440\u0438 \u0447\u0438\u0441\u043B\u0430: \u0432\u0445\u043E\u0434, \u0441\u0442\u043E\u043F, \u0446\u0435\u043B\u044C. \u0415\u0441\u043B\u0438 \u043D\u0435 \u043C\u043E\u0436\u0435\u0448\u044C \u2014 \u0441\u0434\u0435\u043B\u043A\u0430 \u0435\u0449\u0451 \u043D\u0435 \u0433\u043E\u0442\u043E\u0432\u0430, \u044D\u0442\u043E \u043D\u0435 \u043F\u0440\u043E \u0440\u044B\u043D\u043E\u043A."
  },
  {
    id: "g_overconf",
    dataDriven: false,
    title: "\u0420\u0438\u0441\u043A \u043F\u043E\u0441\u043B\u0435 \u0441\u0435\u0440\u0438\u0438 \u043F\u043E\u0431\u0435\u0434",
    evidence: "\u041E\u0431\u0449\u0438\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u0436\u0443\u0440\u043D\u0430\u043B \u043F\u043E\u043A\u0430 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0435\u0433\u043E \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043F\u043E \u0446\u0438\u0444\u0440\u0430\u043C.",
    question: "\u041F\u043E\u0441\u043B\u0435 \u043F\u0430\u0440\u044B \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u043F\u043E\u0434\u0440\u044F\u0434 \u0442\u0435\u0431\u0435 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u043F\u043E\u0437\u0438\u0446\u0438\u0438?",
    recommendation: "\u0421\u0435\u0440\u0438\u044F \u043F\u043E\u0431\u0435\u0434 \u043D\u0435 \u043E\u0442\u043C\u0435\u043D\u044F\u0435\u0442 \u043F\u043B\u0430\u043D \u043F\u043E \u0440\u0438\u0441\u043A\u0443. \u0415\u0441\u043B\u0438 \u0438 \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0442\u044C \u0447\u0442\u043E-\u0442\u043E \u2014 \u0442\u043E \u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E\u0441\u0442\u044C, \u0430 \u043D\u0435 \u043E\u0431\u044A\u0451\u043C."
  },
  {
    id: "g_honesty",
    dataDriven: false,
    title: "\u0427\u0435\u0441\u0442\u043D\u043E\u0441\u0442\u044C \u0436\u0443\u0440\u043D\u0430\u043B\u0430",
    evidence: "\u041E\u0431\u0449\u0438\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u0436\u0443\u0440\u043D\u0430\u043B \u043F\u043E\u043A\u0430 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0435\u0433\u043E \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043F\u043E \u0446\u0438\u0444\u0440\u0430\u043C.",
    question: "\u0411\u044B\u0432\u0430\u0435\u0442, \u0447\u0442\u043E \u0442\u044B \u043D\u0435 \u0437\u0430\u043F\u0438\u0441\u044B\u0432\u0430\u0435\u0448\u044C \u043D\u0435\u0443\u0434\u0430\u0447\u043D\u0443\u044E \u0441\u0434\u0435\u043B\u043A\u0443 \u0432 \u0436\u0443\u0440\u043D\u0430\u043B, \u0447\u0442\u043E\u0431\u044B \u043D\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0432\u0430\u0442\u044C \u0435\u0451?",
    recommendation: "\u0416\u0443\u0440\u043D\u0430\u043B \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442, \u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0432 \u043D\u0451\u043C \u0435\u0441\u0442\u044C \u0438 \u0442\u043E, \u0447\u0442\u043E \u0441\u0442\u044B\u0434\u043D\u043E \u043F\u0438\u0441\u0430\u0442\u044C. \u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043D\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C \u2014 \u0442\u043E\u0436\u0435 \u0443\u0440\u043E\u043A, \u043F\u0440\u043E\u0441\u0442\u043E \u043E\u0442\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0439."
  },
  {
    id: "g_carryover",
    dataDriven: false,
    title: "\u041F\u0435\u0440\u0435\u043D\u043E\u0441 \u044D\u043C\u043E\u0446\u0438\u0439 \u043C\u0435\u0436\u0434\u0443 \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u0438",
    evidence: "\u041E\u0431\u0449\u0438\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u0436\u0443\u0440\u043D\u0430\u043B \u043F\u043E\u043A\u0430 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0435\u0433\u043E \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043F\u043E \u0446\u0438\u0444\u0440\u0430\u043C.",
    question: "\u041F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u0448\u044C \u043B\u0438 \u0440\u0430\u0437\u0434\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u044D\u0439\u0444\u043E\u0440\u0438\u044E \u043E\u0442 \u043E\u0434\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u043D\u0430 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u043F\u043E \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439?",
    recommendation: "\u041C\u0435\u0436\u0434\u0443 \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u0438 \u043F\u043E\u043C\u043E\u0433\u0430\u0435\u0442 \u0440\u0438\u0442\u0443\u0430\u043B-\u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u044C \u2014 \u0434\u0430\u0436\u0435 60 \u0441\u0435\u043A\u0443\u043D\u0434 \u043F\u0430\u0443\u0437\u044B \u0438 \u043E\u0434\u0438\u043D \u0432\u0434\u043E\u0445, \u0447\u0442\u043E\u0431\u044B \u043D\u0435 \u0442\u0430\u0449\u0438\u0442\u044C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0434\u0430\u043B\u044C\u0448\u0435."
  },
  {
    id: "g_size",
    dataDriven: false,
    title: "\u041E\u0431\u044A\u0451\u043C \u043F\u043E\u0434 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435",
    evidence: "\u041E\u0431\u0449\u0438\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u0436\u0443\u0440\u043D\u0430\u043B \u043F\u043E\u043A\u0430 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0435\u0433\u043E \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043F\u043E \u0446\u0438\u0444\u0440\u0430\u043C.",
    question: "\u041C\u0435\u043D\u044F\u0435\u0448\u044C \u043B\u0438 \u0442\u044B \u0440\u0430\u0437\u043C\u0435\u0440 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u0442\u043E\u0433\u043E, \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0443\u0432\u0435\u0440\u0435\u043D \u0432 \u043C\u043E\u043C\u0435\u043D\u0442\u0435, \u0430 \u043D\u0435 \u043E\u0442 \u0437\u0430\u0440\u0430\u043D\u0435\u0435 \u0437\u0430\u0434\u0430\u043D\u043D\u043E\u0433\u043E \u0440\u0438\u0441\u043A\u0430?",
    recommendation: "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u2014 \u043F\u043B\u043E\u0445\u043E\u0439 \u043A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440 \u043E\u0431\u044A\u0451\u043C\u0430. \u041E\u043D\u0430 \u043E\u0431\u043C\u0430\u043D\u044B\u0432\u0430\u0435\u0442 \u0447\u0430\u0449\u0435 \u0432\u0441\u0435\u0433\u043E \u0438\u043C\u0435\u043D\u043D\u043E \u043F\u043E\u0441\u043B\u0435 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u043F\u043E\u0431\u0435\u0434 \u043F\u043E\u0434\u0440\u044F\u0434."
  }
];
var GENERIC_REVIEW_QUESTIONS_EN = [
  {
    id: "g_plan",
    dataDriven: false,
    title: "Trading without a plan",
    evidence: "General question \u2014 the journal can't check this directly against numbers yet.",
    question: "How often do you open a trade without a plan written down in advance \u2014 entry, stop, and target?",
    recommendation: "Before entering, write down three numbers: entry, stop, target. If you can't \u2014 the trade isn't ready yet, that's not about the market."
  },
  {
    id: "g_overconf",
    dataDriven: false,
    title: "Risk after a winning streak",
    evidence: "General question \u2014 the journal can't check this directly against numbers yet.",
    question: "After a couple of winning trades in a row, do you feel like increasing position size?",
    recommendation: "A winning streak doesn't cancel your risk plan. If anything should increase, it's caution \u2014 not size."
  },
  {
    id: "g_honesty",
    dataDriven: false,
    title: "Journal honesty",
    evidence: "General question \u2014 the journal can't check this directly against numbers yet.",
    question: "Do you ever skip logging a bad trade so you don't have to admit it?",
    recommendation: "A journal only works if it includes the things you're embarrassed to write. A skipped entry is still a lesson \u2014 just a postponed one."
  },
  {
    id: "g_carryover",
    dataDriven: false,
    title: "Carrying emotions between trades",
    evidence: "General question \u2014 the journal can't check this directly against numbers yet.",
    question: "Do you carry irritation or euphoria from one trade into decisions on the next?",
    recommendation: "A reset ritual between trades helps \u2014 even 60 seconds of pause and one breath, so the state doesn't carry forward."
  },
  {
    id: "g_size",
    dataDriven: false,
    title: "Sizing by mood",
    evidence: "General question \u2014 the journal can't check this directly against numbers yet.",
    question: "Do you change position size based on how confident you feel in the moment, rather than a pre-set risk?",
    recommendation: "Confidence is a bad size calculator. It fools you most often right after a few wins in a row."
  }
];
function analyzeJournalForQuiz(entries, lang = "ru") {
  if (entries.length < 3) return [];
  const questions = lang === "en" ? GENERIC_REVIEW_QUESTIONS_EN : GENERIC_REVIEW_QUESTIONS;
  const wins = entries.filter((e) => e.outcome === "Win");
  const losses = entries.filter((e) => e.outcome === "Loss");
  const avg = (arr, k) => arr.reduce((s, e) => s + (e[k] || 0), 0) / arr.length;
  const sorted = [...entries].sort((a, b) => a.date - b.date);
  const issues = [];
  const wEmo = wins.filter((e) => e.x != null), lEmo = losses.filter((e) => e.x != null);
  if (wEmo.length >= 2 && lEmo.length >= 2) {
    const wX = avg(wEmo, "x"), lX = avg(lEmo, "x");
    if (lX < wX - 8) {
      issues.push(lang === "en" ? {
        id: "fear",
        dataDriven: true,
        title: "Entering out of fear",
        evidence: 'Losing trades in the journal started, on average, from a more anxious state ("Fear") than winning ones.',
        question: "Do you notice yourself opening a trade out of fear of missing something, rather than because it matched your plan?",
        recommendation: `Before you hit "enter," say your reason for the trade out loud in one sentence. If the only reason is "what if it moves without me" \u2014 that's fear, not a plan.`
      } : {
        id: "fear",
        dataDriven: true,
        title: "\u0412\u0445\u043E\u0434 \u0438\u0437 \u0441\u0442\u0440\u0430\u0445\u0430",
        evidence: "\u0423\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u043D\u0430\u0447\u0438\u043D\u0430\u043B\u0438\u0441\u044C \u0438\u0437 \u0431\u043E\u043B\u0435\u0435 \u0442\u0440\u0435\u0432\u043E\u0436\u043D\u043E\u0433\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F (\xAB\u0421\u0442\u0440\u0430\u0445\xBB), \u0447\u0435\u043C \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0435.",
        question: "\u0417\u0430\u043C\u0435\u0447\u0430\u0435\u0448\u044C, \u0447\u0442\u043E \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0448\u044C \u0441\u0434\u0435\u043B\u043A\u0443 \u0438\u0437 \u0441\u0442\u0440\u0430\u0445\u0430 \u0447\u0442\u043E-\u0442\u043E \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C, \u0430 \u043D\u0435 \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u044D\u0442\u043E \u0441\u043E\u0432\u043F\u0430\u043B\u043E \u0441 \u043F\u043B\u0430\u043D\u043E\u043C?",
        recommendation: "\u041F\u0440\u0435\u0436\u0434\u0435 \u0447\u0435\u043C \u043D\u0430\u0436\u0430\u0442\u044C \xAB\u0432 \u0441\u0434\u0435\u043B\u043A\u0443\xBB, \u0441\u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u0443\u0439 \u0432\u0441\u043B\u0443\u0445 \u043F\u0440\u0438\u0447\u0438\u043D\u0443 \u0432\u0445\u043E\u0434\u0430 \u043E\u0434\u043D\u0438\u043C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u043C. \u0415\u0441\u043B\u0438 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u043F\u0440\u0438\u0447\u0438\u043D\u0430 \u2014 \xAB\u0430 \u0432\u0434\u0440\u0443\u0433 \u0443\u0435\u0434\u0443 \u0431\u0435\u0437 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F\xBB \u2014 \u044D\u0442\u043E \u0441\u0442\u0440\u0430\u0445, \u0430 \u043D\u0435 \u043F\u043B\u0430\u043D."
      });
    }
  }
  const wYEmo = wins.filter((e) => e.y != null), lYEmo = losses.filter((e) => e.y != null);
  if (wYEmo.length >= 2 && lYEmo.length >= 2) {
    const wY = avg(wYEmo, "y"), lY = avg(lYEmo, "y");
    if (lY < wY - 8) {
      issues.push(lang === "en" ? {
        id: "nerves",
        dataDriven: true,
        title: 'Being "on edge"',
        evidence: 'Losing trades noticeably more often happened while "on edge" than winning ones.',
        question: "Before your losing trades, did you feel a sense of rushing or being wound up?",
        recommendation: "Rushing almost never comes from the market \u2014 it comes from you. If you feel wound up, that's a signal to pause, not a signal to enter faster."
      } : {
        id: "nerves",
        dataDriven: true,
        title: "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \xAB\u043D\u0430 \u043D\u0435\u0440\u0432\u0430\u0445\xBB",
        evidence: "\u0423\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0447\u0430\u0449\u0435 \u0441\u043B\u0443\u0447\u0430\u043B\u0438\u0441\u044C \u0432 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \xAB\u043D\u0430 \u043D\u0435\u0440\u0432\u0430\u0445\xBB, \u0447\u0435\u043C \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0435.",
        question: "\u041F\u0435\u0440\u0435\u0434 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u043C\u0438 \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u0438 \u0443 \u0442\u0435\u0431\u044F \u0431\u044B\u043B\u043E \u043E\u0449\u0443\u0449\u0435\u043D\u0438\u0435 \u0441\u043F\u0435\u0448\u043A\u0438 \u0438\u043B\u0438 \u0432\u0437\u0432\u0438\u043D\u0447\u0435\u043D\u043D\u043E\u0441\u0442\u0438?",
        recommendation: "\u0421\u043F\u0435\u0448\u043A\u0430 \u043F\u043E\u0447\u0442\u0438 \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442 \u043E\u0442 \u0440\u044B\u043D\u043A\u0430 \u2014 \u043E\u043D\u0430 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442 \u043E\u0442 \u0442\u0435\u0431\u044F. \u0415\u0441\u043B\u0438 \u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0435\u0448\u044C \u0432\u0437\u0432\u0438\u043D\u0447\u0435\u043D\u043D\u043E\u0441\u0442\u044C, \u044D\u0442\u043E \u0441\u0438\u0433\u043D\u0430\u043B \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u043F\u0430\u0443\u0437\u0443, \u0430 \u043D\u0435 \u0441\u0438\u0433\u043D\u0430\u043B \u0432\u0445\u043E\u0434\u0438\u0442\u044C \u0431\u044B\u0441\u0442\u0440\u0435\u0435."
      });
    }
  }
  let revengeCount = 0;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1].outcome === "Loss") {
      const gapMin = (sorted[i].date - sorted[i - 1].date) / 6e4;
      if (gapMin >= 0 && gapMin < 30) revengeCount++;
    }
  }
  if (revengeCount >= 1) {
    issues.push(lang === "en" ? {
      id: "revenge",
      dataDriven: true,
      title: "Revenge trading",
      evidence: `The journal has ${revengeCount} ${revengeCount === 1 ? "case" : "cases"} of a new trade opening within half an hour of a loss.`,
      question: "After a losing trade, do you want to win it back with a new one as fast as possible?",
      recommendation: "Set a mandatory pause after a loss \u2014 at least 20-30 minutes away from the terminal. This isn't about the market, it's about getting control back over yourself, not the price."
    } : {
      id: "revenge",
      dataDriven: true,
      title: "\u0420\u0435\u0432\u0430\u043D\u0448-\u0442\u0440\u0435\u0439\u0434\u0438\u043D\u0433",
      evidence: `\u0412 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 ${revengeCount} ${pluralRu(revengeCount, "\u0441\u043B\u0443\u0447\u0430\u0439", "\u0441\u043B\u0443\u0447\u0430\u044F", "\u0441\u043B\u0443\u0447\u0430\u0435\u0432")}, \u043A\u043E\u0433\u0434\u0430 \u043D\u043E\u0432\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u043B\u0430\u0441\u044C \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0441\u0430 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430.`,
      question: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0442\u0435\u0431\u0435 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u043C\u043E\u0436\u043D\u043E \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u043E\u0442\u044B\u0433\u0440\u0430\u0442\u044C\u0441\u044F \u043D\u043E\u0432\u043E\u0439?",
      recommendation: "\u0412\u0432\u0435\u0434\u0438 \u0434\u043B\u044F \u0441\u0435\u0431\u044F \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u0443\u044E \u043F\u0430\u0443\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u2014 \u043C\u0438\u043D\u0438\u043C\u0443\u043C 20-30 \u043C\u0438\u043D\u0443\u0442 \u0431\u0435\u0437 \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B\u0430. \u042D\u0442\u043E \u043D\u0435 \u043F\u0440\u043E \u0440\u044B\u043D\u043E\u043A, \u044D\u0442\u043E \u043F\u0440\u043E \u0442\u043E, \u0447\u0442\u043E\u0431\u044B \u0432\u0435\u0440\u043D\u0443\u0442\u044C \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043D\u0430\u0434 \u0441\u043E\u0431\u043E\u0439, \u0430 \u043D\u0435 \u043D\u0430\u0434 \u0446\u0435\u043D\u043E\u0439."
    });
  }
  const lessonCounts = {};
  entries.forEach((e) => {
    if (e.lesson && e.lesson !== "\u2014") lessonCounts[e.lesson] = (lessonCounts[e.lesson] || 0) + 1;
  });
  const repeated = Object.entries(lessonCounts).find(([, c]) => c >= 2);
  if (repeated) {
    issues.push(lang === "en" ? {
      id: "repeat",
      dataDriven: true,
      title: "A repeating lesson",
      evidence: `The lesson "${repeated[0]}" appears in the journal ${repeated[1]} times \u2014 it seems the takeaway hasn't become a habit yet.`,
      question: "Do you ever write down a lesson but still repeat the same mistake next time?",
      recommendation: `Rewrite the lesson as a specific action, not an observation \u2014 not "don't rush," but "wait for the candle to close before entering." Abstract conclusions get forgotten, instructions don't.`
    } : {
      id: "repeat",
      dataDriven: true,
      title: "\u041F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0439\u0441\u044F \u0443\u0440\u043E\u043A",
      evidence: `\u0423\u0440\u043E\u043A \xAB${repeated[0]}\xBB \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044F \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 ${repeated[1]} \u0440\u0430\u0437\u0430 \u2014 \u043F\u043E\u0445\u043E\u0436\u0435, \u0432\u044B\u0432\u043E\u0434 \u043F\u043E\u043A\u0430 \u043D\u0435 \u0441\u0442\u0430\u043B \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u043E\u0439.`,
      question: "\u0411\u044B\u0432\u0430\u0435\u0442, \u0447\u0442\u043E \u0442\u044B \u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u0443\u0435\u0448\u044C \u0443\u0440\u043E\u043A, \u043D\u043E \u0432\u0441\u0451 \u0440\u0430\u0432\u043D\u043E \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0448\u044C \u0442\u0443 \u0436\u0435 \u043E\u0448\u0438\u0431\u043A\u0443 \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437?",
      recommendation: "\u041F\u0435\u0440\u0435\u043F\u0438\u0448\u0438 \u0443\u0440\u043E\u043A \u0432 \u0444\u043E\u0440\u043C\u0430\u0442 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0433\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F, \u0430 \u043D\u0435 \u043D\u0430\u0431\u043B\u044E\u0434\u0435\u043D\u0438\u044F \u2014 \u043D\u0435 \xAB\u043D\u0435 \u0442\u043E\u0440\u043E\u043F\u0438\u0442\u044C\u0441\u044F\xBB, \u0430 \xAB\u0436\u0434\u0430\u0442\u044C \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u044F \u0441\u0432\u0435\u0447\u0438 \u043F\u0435\u0440\u0435\u0434 \u0432\u0445\u043E\u0434\u043E\u043C\xBB. \u0410\u0431\u0441\u0442\u0440\u0430\u043A\u0442\u043D\u044B\u0435 \u0432\u044B\u0432\u043E\u0434\u044B \u0437\u0430\u0431\u044B\u0432\u0430\u044E\u0442\u0441\u044F, \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u0438 \u2014 \u043D\u0435\u0442."
    });
  }
  const withR = entriesWithRealizedRR(entries);
  if (withR.length >= 4) {
    const rs = withR.map((e) => e.realizedRR);
    const avgAbs = rs.reduce((s, r) => s + Math.abs(r), 0) / rs.length;
    const maxLoss = Math.min(...rs);
    if (maxLoss < -avgAbs * 2.5 && maxLoss <= -1) {
      issues.push(lang === "en" ? {
        id: "outlier",
        dataDriven: true,
        title: "Unstable risk size",
        evidence: `There's a trade with a realized result of ${maxLoss.toFixed(1)}R, noticeably larger than your usual realized R magnitude.`,
        question: "Do you set your risk size before entering a trade, rather than adjusting it as you go?",
        recommendation: "A spread in loss size usually says more about unstable in-the-moment decisions than about the market. Fix your risk in R or % before you enter \u2014 that should be decided before the terminal is even open."
      } : {
        id: "outlier",
        dataDriven: true,
        title: "\u041D\u0435\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0438\u0441\u043A\u0430",
        evidence: `\u0415\u0441\u0442\u044C \u0441\u0434\u0435\u043B\u043A\u0430 \u0441 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u043C ${maxLoss.toFixed(1)}, \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043A\u0440\u0443\u043F\u043D\u0435\u0435 \u0442\u0432\u043E\u0435\u0433\u043E \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E \u0440\u0438\u0441\u043A\u0430 \u043D\u0430 \u0441\u0434\u0435\u043B\u043A\u0443.`,
        question: "\u0422\u044B \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0435\u0448\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0438\u0441\u043A\u0430 \u0434\u043E \u0432\u0445\u043E\u0434\u0430 \u0432 \u0441\u0434\u0435\u043B\u043A\u0443, \u0430 \u043D\u0435 \u043F\u043E \u0445\u043E\u0434\u0443 \u043D\u0435\u0451?",
        recommendation: "\u0420\u0430\u0437\u0431\u0440\u043E\u0441 \u0432 \u0440\u0430\u0437\u043C\u0435\u0440\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u043E\u0431\u044B\u0447\u043D\u043E \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u043D\u0435 \u043E \u0440\u044B\u043D\u043A\u0435, \u0430 \u043E \u043D\u0435\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u0440\u0435\u0448\u0435\u043D\u0438\u0439 \u0432 \u043C\u043E\u043C\u0435\u043D\u0442\u0435. \u0424\u0438\u043A\u0441\u0438\u0440\u0443\u0439 \u0440\u0438\u0441\u043A \u0432 R \u0438\u043B\u0438 % \u0435\u0449\u0451 \u0434\u043E \u0432\u0445\u043E\u0434\u0430 \u2014 \u044D\u0442\u043E \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0440\u0435\u0448\u0435\u043D\u043E \u0440\u0430\u043D\u044C\u0448\u0435, \u0447\u0435\u043C \u043E\u0442\u043A\u0440\u044B\u0442 \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B."
      });
    }
  }
  const dayCounts = {};
  entries.forEach((e) => {
    const k = e.date.toDateString();
    dayCounts[k] = (dayCounts[k] || 0) + 1;
  });
  const dayCountValues = Object.values(dayCounts);
  const maxDay = Math.max(...dayCountValues);
  const avgDay = dayCountValues.reduce((s, c) => s + c, 0) / dayCountValues.length;
  if (maxDay >= 4 && maxDay > avgDay * 1.8) {
    issues.push(lang === "en" ? {
      id: "overtrade",
      dataDriven: true,
      title: "Overtrading",
      evidence: `On one day, the journal shows ${maxDay} trades \u2014 noticeably more than the average (${avgDay.toFixed(1)} per day).`,
      question: "Do you notice that on some days you open way more trades than you planned that morning?",
      recommendation: "Set a daily trade limit in advance and physically stop once you hit it \u2014 regardless of whether you're up or down."
    } : {
      id: "overtrade",
      dataDriven: true,
      title: "\u041F\u0435\u0440\u0435\u0442\u0440\u0435\u0439\u0434\u0438\u043D\u0433",
      evidence: `\u0412 \u043E\u0434\u0438\u043D \u0438\u0437 \u0434\u043D\u0435\u0439 \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 ${maxDay} ${pluralRu(maxDay, "\u0441\u0434\u0435\u043B\u043A\u0430", "\u0441\u0434\u0435\u043B\u043A\u0438", "\u0441\u0434\u0435\u043B\u043E\u043A")} \u2014 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0431\u043E\u043B\u044C\u0448\u0435, \u0447\u0435\u043C \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C (${avgDay.toFixed(1)} \u0432 \u0434\u0435\u043D\u044C).`,
      question: "\u0417\u0430\u043C\u0435\u0447\u0430\u0435\u0448\u044C, \u0447\u0442\u043E \u0432 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0435 \u0434\u043D\u0438 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0448\u044C \u0441\u0438\u043B\u044C\u043D\u043E \u0431\u043E\u043B\u044C\u0448\u0435 \u0441\u0434\u0435\u043B\u043E\u043A, \u0447\u0435\u043C \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043B \u0441 \u0443\u0442\u0440\u0430?",
      recommendation: "\u0417\u0430\u0440\u0430\u043D\u0435\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438 \u043B\u0438\u043C\u0438\u0442 \u0441\u0434\u0435\u043B\u043E\u043A \u043D\u0430 \u0434\u0435\u043D\u044C \u0438 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u0438 \u043E\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0439\u0441\u044F, \u043A\u043E\u0433\u0434\u0430 \u043E\u043D \u0434\u043E\u0441\u0442\u0438\u0433\u043D\u0443\u0442 \u2014 \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u0442\u043E\u0433\u043E, \u0432 \u043F\u043B\u044E\u0441\u0435 \u0442\u044B \u0438\u043B\u0438 \u0432 \u043C\u0438\u043D\u0443\u0441\u0435."
    });
  }
  let streak = 0, maxStreak = 0;
  sorted.forEach((e) => {
    if (e.outcome === "Loss") {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else streak = 0;
  });
  if (maxStreak >= 3) {
    issues.push(lang === "en" ? {
      id: "streak",
      dataDriven: true,
      title: "A streak of consecutive losses",
      evidence: `The journal has a streak of ${maxStreak} consecutive losing trades with no winning trade in between.`,
      question: "Do you keep trading the same way even after several losses in a row?",
      recommendation: "After the second loss in a row \u2014 that's already a signal to stop and figure out why, not a signal to add size on the next one."
    } : {
      id: "streak",
      dataDriven: true,
      title: "\u0421\u0435\u0440\u0438\u044F \u0443\u0431\u044B\u0442\u043A\u043E\u0432 \u043F\u043E\u0434\u0440\u044F\u0434",
      evidence: `\u0412 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 \u0435\u0441\u0442\u044C \u0441\u0435\u0440\u0438\u044F \u0438\u0437 ${maxStreak} \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u043F\u043E\u0434\u0440\u044F\u0434 \u0431\u0435\u0437 \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u043E\u0439 \u043C\u0435\u0436\u0434\u0443 \u043D\u0438\u043C\u0438.`,
      question: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0448\u044C \u0442\u043E\u0440\u0433\u043E\u0432\u0430\u0442\u044C \u0432 \u0442\u043E\u043C \u0436\u0435 \u0440\u0435\u0436\u0438\u043C\u0435, \u0434\u0430\u0436\u0435 \u043F\u043E\u0441\u043B\u0435 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0443\u0431\u044B\u0442\u043A\u043E\u0432 \u043F\u043E\u0434\u0440\u044F\u0434?",
      recommendation: "\u041F\u043E\u0441\u043B\u0435 \u0432\u0442\u043E\u0440\u043E\u0439 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u0434\u0440\u044F\u0434 \u2014 \u044D\u0442\u043E \u0443\u0436\u0435 \u0441\u0438\u0433\u043D\u0430\u043B \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C\u0441\u044F \u0438 \u0440\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C\u0441\u044F, \u0430 \u043D\u0435 \u0441\u0438\u0433\u043D\u0430\u043B \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u0431\u044A\u0451\u043C \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439."
    });
  }
  const lossesAfterWin = [], lossesAfterLoss = [];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].outcome === "Loss" && hasRealizedRR(sorted[i])) {
      if (sorted[i - 1].outcome === "Win") lossesAfterWin.push(sorted[i].realizedRR);
      else if (sorted[i - 1].outcome === "Loss") lossesAfterLoss.push(sorted[i].realizedRR);
    }
  }
  if (lossesAfterWin.length >= 2 && lossesAfterLoss.length >= 1) {
    const avgAfterWin = lossesAfterWin.reduce((s, r) => s + r, 0) / lossesAfterWin.length;
    const avgAfterLoss = lossesAfterLoss.reduce((s, r) => s + r, 0) / lossesAfterLoss.length;
    if (avgAfterWin < avgAfterLoss - 0.3) {
      issues.push(lang === "en" ? {
        id: "overconfidence",
        dataDriven: true,
        title: "Risk grows after wins",
        evidence: "Losses that happened right after a winning trade are, on average, bigger than losses after another loss.",
        question: "After a winning trade, do you feel more comfortable risking more on the next one?",
        recommendation: "A win doesn't make the next setup any more valid. Keep your risk size constant regardless of what happened on the last trade."
      } : {
        id: "overconfidence",
        dataDriven: true,
        title: "\u0420\u0438\u0441\u043A \u0440\u0430\u0441\u0442\u0451\u0442 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0431\u0435\u0434",
        evidence: "\u0423\u0431\u044B\u0442\u043A\u0438, \u0441\u043B\u0443\u0447\u0438\u0432\u0448\u0438\u0435\u0441\u044F \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438, \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u043A\u0440\u0443\u043F\u043D\u0435\u0435 \u0443\u0431\u044B\u0442\u043A\u043E\u0432 \u043F\u043E\u0441\u043B\u0435 \u0434\u0440\u0443\u0433\u043E\u0433\u043E \u0443\u0431\u044B\u0442\u043A\u0430.",
        question: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0434\u0430\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0442\u0435\u0431\u0435 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u0435\u0435 \u0440\u0438\u0441\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439?",
        recommendation: "\u041F\u043E\u0431\u0435\u0434\u0430 \u043D\u0435 \u0434\u0435\u043B\u0430\u0435\u0442 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0441\u0435\u0442\u0430\u043F \u0431\u043E\u043B\u0435\u0435 \u0432\u0435\u0440\u043D\u044B\u043C. \u0414\u0435\u0440\u0436\u0438 \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0438\u0441\u043A\u0430 \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u044B\u043C \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u0442\u043E\u0433\u043E, \u0447\u0442\u043E \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u043E \u043D\u0430 \u043F\u0440\u043E\u0448\u043B\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0435."
      });
    }
  }
  if (losses.length >= 3) {
    const lossesNoShot = losses.filter((e) => !e.screenshots || e.screenshots.length === 0).length;
    if (lossesNoShot / losses.length > 0.75) {
      issues.push(lang === "en" ? {
        id: "noshot",
        dataDriven: true,
        title: "Avoiding loss review",
        evidence: `${lossesNoShot} of ${losses.length} losing trades in the journal have no chart screenshot.`,
        question: "Do you feel uncomfortable revisiting the chart after a losing trade?",
        recommendation: "A screenshot of a losing trade is the most useful material in the journal, not the most pleasant. Make a habit of saving exactly what you don't want to revisit."
      } : {
        id: "noshot",
        dataDriven: true,
        title: "\u0418\u0437\u0431\u0435\u0433\u0430\u043D\u0438\u0435 \u0440\u0430\u0437\u0431\u043E\u0440\u0430 \u0443\u0431\u044B\u0442\u043A\u043E\u0432",
        evidence: `${lossesNoShot} \u0438\u0437 ${losses.length} \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 ${pluralRu(losses.length, "\u0441\u0434\u0435\u043B\u043A\u0438", "\u0441\u0434\u0435\u043B\u043E\u043A", "\u0441\u0434\u0435\u043B\u043E\u043A")} \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 \u2014 \u0431\u0435\u0437 \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u0430 \u0433\u0440\u0430\u0444\u0438\u043A\u0430.`,
        question: "\u0422\u0435\u0431\u0435 \u043D\u0435\u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E \u043F\u0435\u0440\u0435\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u0442\u044C \u0433\u0440\u0430\u0444\u0438\u043A \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438?",
        recommendation: "\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u2014 \u0441\u0430\u043C\u044B\u0439 \u043F\u043E\u043B\u0435\u0437\u043D\u044B\u0439 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435, \u043D\u0435 \u0441\u0430\u043C\u044B\u0439 \u043F\u0440\u0438\u044F\u0442\u043D\u044B\u0439. \u0412\u043E\u0437\u044C\u043C\u0438 \u0437\u0430 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0443 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0442\u044C \u0438\u043C\u0435\u043D\u043D\u043E \u0442\u043E, \u0447\u0442\u043E \u043D\u0435 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043F\u0435\u0440\u0435\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u0442\u044C."
      });
    }
  }
  if (losses.length >= 3) {
    const shallow = losses.filter((e) => !e.lesson || e.lesson === "\u2014" || e.lesson.trim().length < 15).length;
    if (shallow / losses.length > 0.6) {
      issues.push(lang === "en" ? {
        id: "shallow",
        dataDriven: true,
        title: "Shallow reflection",
        evidence: "Most losing trades in the journal are described without a real takeaway.",
        question: "After a loss, do you want to close the subject quickly rather than dig into the reason?",
        recommendation: `One line of "bad luck" doesn't count as a lesson. Try finishing the sentence "Next time I'll do it differently if..." \u2014 and write it honestly.`
      } : {
        id: "shallow",
        dataDriven: true,
        title: "\u041F\u043E\u0432\u0435\u0440\u0445\u043D\u043E\u0441\u0442\u043D\u0430\u044F \u0440\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u044F",
        evidence: "\u0411\u043E\u043B\u044C\u0448\u0430\u044F \u0447\u0430\u0441\u0442\u044C \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0430 \u0431\u0435\u0437 \u0440\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u043E\u0433\u043E \u0432\u044B\u0432\u043E\u0434\u0430.",
        question: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043F\u043E\u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u044C \u0442\u0435\u043C\u0443, \u0430 \u043D\u0435 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0442\u044C\u0441\u044F \u0432 \u043F\u0440\u0438\u0447\u0438\u043D\u0435?",
        recommendation: "\u041E\u0434\u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0430 \xAB\u043D\u0435 \u043F\u043E\u0432\u0435\u0437\u043B\u043E\xBB \u043D\u0435 \u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u0443\u0440\u043E\u043A\u043E\u043C. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u0442\u044C \u0444\u0440\u0430\u0437\u0443 \xAB\u0412 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437 \u044F \u0441\u0434\u0435\u043B\u0430\u044E \u0438\u043D\u0430\u0447\u0435, \u0435\u0441\u043B\u0438...\xBB \u2014 \u0438 \u0434\u043E\u043F\u0438\u0441\u0430\u0442\u044C \u0435\u0451 \u0447\u0435\u0441\u0442\u043D\u043E."
      });
    }
  }
  let selected = issues.slice(0, REVIEW_MAX_QUESTIONS);
  if (selected.length < REVIEW_MIN_QUESTIONS) {
    const usedIds = new Set(selected.map((i) => i.id));
    for (const g of questions) {
      if (selected.length >= REVIEW_MIN_QUESTIONS) break;
      if (!usedIds.has(g.id)) selected.push(g);
    }
  }
  return selected;
}
var PATTERN_QUIZ_MAP = {
  fear: { question: "\u0417\u0430\u043C\u0435\u0447\u0430\u0435\u0448\u044C, \u0447\u0442\u043E \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0448\u044C \u0441\u0434\u0435\u043B\u043A\u0443 \u0438\u0437 \u0441\u0442\u0440\u0430\u0445\u0430 \u0447\u0442\u043E-\u0442\u043E \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C, \u0430 \u043D\u0435 \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u044D\u0442\u043E \u0441\u043E\u0432\u043F\u0430\u043B\u043E \u0441 \u043F\u043B\u0430\u043D\u043E\u043C?" },
  too_calm: { question: "\u0411\u044B\u0432\u0430\u0435\u0442, \u0447\u0442\u043E \u0432 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E\u043C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \u0442\u044B \u043C\u0435\u043D\u044C\u0448\u0435 \u0441\u043B\u0435\u0434\u0438\u0448\u044C \u0437\u0430 \u0440\u0438\u0441\u043A\u043E\u043C, \u0447\u0435\u043C \u043E\u0431\u044B\u0447\u043D\u043E?" },
  confidence_tension: { question: "\u0411\u044B\u0432\u0430\u0435\u0442, \u0447\u0442\u043E \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0432 \u0441\u0434\u0435\u043B\u043A\u0435 \u0441\u043E\u0447\u0435\u0442\u0430\u0435\u0442\u0441\u044F \u0441 \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u043C \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435\u043C, \u0430 \u043D\u0435 \u0441\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u0435\u043C?" },
  revenge: { question: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0442\u0435\u0431\u0435 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u043C\u043E\u0436\u043D\u043E \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u043E\u0442\u044B\u0433\u0440\u0430\u0442\u044C\u0441\u044F \u043D\u043E\u0432\u043E\u0439?" },
  lesson_not_learned: { question: "\u0411\u044B\u0432\u0430\u0435\u0442, \u0447\u0442\u043E \u0442\u044B \u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u0443\u0435\u0448\u044C \u0443\u0440\u043E\u043A, \u043D\u043E \u0432\u0441\u0451 \u0440\u0430\u0432\u043D\u043E \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0448\u044C \u0442\u0443 \u0436\u0435 \u043E\u0448\u0438\u0431\u043A\u0443 \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437?" },
  unstable_risk: { question: "\u041C\u0435\u043D\u044F\u0435\u0442\u0441\u044F \u043B\u0438 \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0438\u0441\u043A\u0430 \u043E\u0442 \u0441\u0434\u0435\u043B\u043A\u0438 \u043A \u0441\u0434\u0435\u043B\u043A\u0435 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u0435\u0435, \u0447\u0435\u043C \u0442\u044B \u0441\u0430\u043C \u043F\u043B\u0430\u043D\u0438\u0440\u0443\u0435\u0448\u044C?" },
  overtrading: { question: "\u0417\u0430\u043C\u0435\u0447\u0430\u0435\u0448\u044C, \u0447\u0442\u043E \u0432 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0435 \u0434\u043D\u0438 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0448\u044C \u0441\u0438\u043B\u044C\u043D\u043E \u0431\u043E\u043B\u044C\u0448\u0435 \u0441\u0434\u0435\u043B\u043E\u043A, \u0447\u0435\u043C \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043B \u0441 \u0443\u0442\u0440\u0430?" },
  loss_streak: { question: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0448\u044C \u0442\u043E\u0440\u0433\u043E\u0432\u0430\u0442\u044C \u0432 \u0442\u043E\u043C \u0436\u0435 \u0440\u0435\u0436\u0438\u043C\u0435, \u0434\u0430\u0436\u0435 \u043F\u043E\u0441\u043B\u0435 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0443\u0431\u044B\u0442\u043A\u043E\u0432 \u043F\u043E\u0434\u0440\u044F\u0434?" },
  risk_after_win: { question: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0434\u0430\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0442\u0435\u0431\u0435 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u0435\u0435 \u0440\u0438\u0441\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439?" },
  avoid_loss_review: { question: "\u0422\u0435\u0431\u0435 \u043D\u0435\u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E \u043F\u0435\u0440\u0435\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u0442\u044C \u0433\u0440\u0430\u0444\u0438\u043A \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438?" },
  shallow_reflection: { question: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043F\u043E\u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u044C \u0442\u0435\u043C\u0443, \u0430 \u043D\u0435 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0442\u044C\u0441\u044F \u0432 \u043F\u0440\u0438\u0447\u0438\u043D\u0435?" }
};
var PATTERN_QUIZ_MAP_EN = {
  fear: { question: "Do you notice yourself opening a trade out of fear of missing something, rather than because it matched your plan?" },
  too_calm: { question: "Does being calm sometimes mean you watch risk less closely than usual?" },
  confidence_tension: { question: "Does confidence in a trade sometimes come with inner tension rather than calm?" },
  revenge: { question: "After a losing trade, do you want to win it back with a new one as fast as possible?" },
  lesson_not_learned: { question: "Do you ever write down a lesson but still repeat the same mistake next time?" },
  unstable_risk: { question: "Does your risk size vary from trade to trade noticeably more than you actually plan?" },
  overtrading: { question: "Do you notice that on some days you open way more trades than you planned that morning?" },
  loss_streak: { question: "Do you keep trading the same way even after several losses in a row?" },
  risk_after_win: { question: "After a winning trade, do you feel more comfortable risking more on the next one?" },
  avoid_loss_review: { question: "Do you feel uncomfortable revisiting the chart after a losing trade?" },
  shallow_reflection: { question: "After a loss, do you want to close the subject quickly rather than dig into the reason?" }
};
function buildReviewIssuesFromPatterns(patternsResult, lang = "ru") {
  const map = lang === "en" ? PATTERN_QUIZ_MAP_EN : PATTERN_QUIZ_MAP;
  return (patternsResult.patterns || []).map((p) => {
    const meta = map[p.id];
    if (!meta) return null;
    return { id: p.id, dataDriven: true, title: p.title, evidence: p.description, question: meta.question, recommendation: p.recommendation };
  }).filter(Boolean);
}
// V1.5 — вопросы, построенные на процентных шкалах эмоций. До этого «Разбор» не знал
// про них вообще: вопросы брались из паттернов (которым нужно 8 сделок на группу) и из
// зашитого общего списка. Здесь порог мягче — 3 сделки на группу, — поэтому уже на
// небольшом журнале появляются вопросы с настоящими числами, а не общие.
var REVIEW_EMOTION_SCALE_LABELS = {
  ru: ["Уверенность", "Страх", "Спокойствие", "Напряжение"],
  en: ["Confidence", "Fear", "Calm", "Tension"]
};
var REVIEW_EMOTION_META = {
  ru: {
    confidence: { title: "Уверенность подводит", question: "Замечаешь, что при высокой уверенности ты хуже проверяешь сетап, потому что он и так «очевидный»?", recommendation: "Уверенность — не подтверждение сетапа. Когда она высокая, прогоняй тот же чек-лист, что и при сомнениях." },
    fear: { title: "Вход на страхе", question: "Бывает, что при сильном страхе ты всё равно входишь, лишь бы не упустить движение?", recommendation: "Страх упустить — не сигнал. Если состояние отмечено как страх, отложи вход до следующего сетапа по плану." },
    calm: { title: "Спокойствие притупляет", question: "Бывает, что в спокойном состоянии ты меньше следишь за риском, чем обычно?", recommendation: "Спокойствие не отменяет стоп. Проговаривай размер риска вслух даже тогда, когда всё выглядит понятно." },
    tension: { title: "Вход на напряжении", question: "Замечаешь, что при внутреннем напряжении решения принимаются быстрее, чем обычно?", recommendation: "Напряжение сокращает паузу перед входом. Заведи правило: при высоком напряжении между сетапом и входом проходит минута." },
    mixed: { title: "Смешанное состояние", question: "Бывает, что ты одновременно уверен в сделке и боишься её — и всё равно входишь?", recommendation: "Смешанное состояние — сигнал, что решение ещё не созрело. Это тот случай, когда пропустить сетап дешевле, чем войти." }
  },
  en: {
    confidence: { title: "Confidence backfires", question: "Do you notice yourself checking a setup less carefully when you feel very confident, because it already looks obvious?", recommendation: "Confidence isn't setup confirmation. When it's high, run the same checklist you use when in doubt." },
    fear: { title: "Entering on fear", question: "Do you sometimes enter anyway while strongly afraid, just to not miss the move?", recommendation: "Fear of missing out isn't a signal. If your state is fear, wait for the next setup that matches your plan." },
    calm: { title: "Calm dulls attention", question: "Does being calm sometimes mean you watch risk less closely than usual?", recommendation: "Calm doesn't cancel the stop. Say your risk size out loud even when everything looks clear." },
    tension: { title: "Entering on tension", question: "Do you notice decisions being made faster than usual when you feel inner tension?", recommendation: "Tension shortens the pause before entry. Make it a rule: when tension is high, a full minute passes between setup and entry." },
    mixed: { title: "Mixed state", question: "Do you sometimes feel confident and afraid at the same time — and enter anyway?", recommendation: "A mixed state means the decision isn't ready. This is the case where skipping the setup is cheaper than taking it." }
  }
};
var REVIEW_EMOTION_MIN_DIFF = 0.4;
function reviewEmotionIssues(entries, lang = "ru") {
  const meta = REVIEW_EMOTION_META[lang === "en" ? "en" : "ru"];
  const stats = emotionImpactStats(entries, REVIEW_EMOTION_SCALE_LABELS[lang === "en" ? "en" : "ru"]);
  if (!stats.available) return [];
  const fmt = (v) => `${v >= 0 ? "+" : "\u2212"}${Math.abs(v).toFixed(2)}R`;
  const out = [];
  for (const sc of stats.scales) {
    // Берём только шкалы, где высокая эмоция СВЯЗАНА С ХУДШИМ результатом. Обратный случай
    // (эмоция помогает) вопросом не оформляется: спрашивать о том, что и так работает,
    // значит навязывать проблему там, где её нет.
    if (!(sc.diff <= -REVIEW_EMOTION_MIN_DIFF)) continue;
    const m = meta[sc.key];
    if (!m) continue;
    out.push({
      id: `emo_${sc.key}`,
      dataDriven: true,
      title: m.title,
      evidence: lang === "en" ? `Trades where you marked ${sc.label.toLowerCase()} at ${EMOTION_IMPACT_HIGH}% or more average ${fmt(sc.highAvg)} (${sc.highN} trades), versus ${fmt(sc.lowAvg)} where it was ${EMOTION_IMPACT_LOW}% or less (${sc.lowN} trades).` : `Сделки, где ты отметил «${sc.label.toLowerCase()}» на ${EMOTION_IMPACT_HIGH}% и выше, в среднем дают ${fmt(sc.highAvg)} (${sc.highN} шт.), против ${fmt(sc.lowAvg)} там, где эта шкала была до ${EMOTION_IMPACT_LOW}% (${sc.lowN} шт.).`,
      question: m.question,
      recommendation: m.recommendation,
      weight: Math.abs(sc.diff)
    });
  }
  if (stats.conflict) {
    const diff = stats.conflict.mixedAvg - stats.conflict.clearAvg;
    if (diff <= -REVIEW_EMOTION_MIN_DIFF) {
      const m = meta.mixed;
      out.push({
        id: "emo_mixed",
        dataDriven: true,
        title: m.title,
        evidence: lang === "en" ? `Trades entered in a mixed state \u2014 opposite emotions marked high at once \u2014 average ${fmt(stats.conflict.mixedAvg)} (${stats.conflict.mixedN} trades), versus ${fmt(stats.conflict.clearAvg)} for the rest (${stats.conflict.clearN} trades).` : `Сделки, открытые в смешанном состоянии \u2014 когда противоположные эмоции отмечены высоко одновременно, \u2014 в среднем дают ${fmt(stats.conflict.mixedAvg)} (${stats.conflict.mixedN} шт.), против ${fmt(stats.conflict.clearAvg)} у остальных (${stats.conflict.clearN} шт.).`,
        question: m.question,
        recommendation: m.recommendation,
        weight: Math.abs(diff)
      });
    }
  }
  return out.sort((a, b) => b.weight - a.weight);
}
export function buildReviewQuiz(entries, lang = "ru") {
  if (entries.length < 3) return [];
  const questions = lang === "en" ? GENERIC_REVIEW_QUESTIONS_EN : GENERIC_REVIEW_QUESTIONS;
  const patternsResult = patternEngineV2(entries, lang);
  // V1.5 — вопросы из паттернов и из эмоциональных шкал складываются, а не заменяют друг
  // друга. Раньше при недоступном движке паттернов эмоциональная часть терялась целиком.
  const fromPatterns = patternsResult.available ? buildReviewIssuesFromPatterns(patternsResult, lang) : analyzeJournalForQuiz(entries, lang).filter((i) => i.dataDriven);
  const fromEmotions = reviewEmotionIssues(entries, lang);
  const seen = /* @__PURE__ */ new Set();
  let selected = [];
  for (const issue of [...fromEmotions, ...fromPatterns]) {
    if (seen.has(issue.id)) continue;
    seen.add(issue.id);
    selected.push(issue);
    if (selected.length >= REVIEW_MAX_QUESTIONS) break;
  }
  // Общие вопросы — только добивка до минимума, и они честно помечены dataDriven: false,
  // из-за чего интро сообщает, сколько вопросов на самом деле построено на журнале.
  if (selected.length < REVIEW_MIN_QUESTIONS) {
    for (const g of questions) {
      if (selected.length >= REVIEW_MIN_QUESTIONS) break;
      if (!seen.has(g.id)) {
        seen.add(g.id);
        selected.push(g);
      }
    }
  }
  return selected;
}
export function scoreJournalReview(issues, answers, lang = "ru") {
  const answered = issues.filter((q) => answers[q.id] != null);
  const total = answered.reduce((s, q) => s + answers[q.id].score, 0);
  const maxTotal = answered.length * 3;
  const pct = maxTotal > 0 ? Math.round(total / maxTotal * 100) : 0;
  const tier = lang === "en" ? pct >= 66 ? { label: "Emotions are currently steering your trades more than your plan.", color: LOSS } : pct >= 33 ? { label: "There's something worth watching, but it's not critical.", color: WARN } : { label: "Discipline looks solid.", color: WIN } : pct >= 66 ? { label: "\u042D\u043C\u043E\u0446\u0438\u0438 \u0441\u0435\u0439\u0447\u0430\u0441 \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u044E\u0442 \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u0438 \u0431\u043E\u043B\u044C\u0448\u0435, \u0447\u0435\u043C \u043F\u043B\u0430\u043D.", color: LOSS } : pct >= 33 ? { label: "\u0415\u0441\u0442\u044C \u043D\u0430 \u0447\u0442\u043E \u043E\u0431\u0440\u0430\u0442\u0438\u0442\u044C \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435, \u043D\u043E \u043D\u0435 \u043A\u0440\u0438\u0442\u0438\u0447\u043D\u043E.", color: WARN } : { label: "\u0414\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430 \u0432\u044B\u0433\u043B\u044F\u0434\u0438\u0442 \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E.", color: WIN };
  const confirmed = issues.filter((q) => (answers[q.id]?.score ?? 0) >= 2).sort((a, b) => (answers[b.id]?.score ?? 0) - (answers[a.id]?.score ?? 0));
  const clear = issues.filter((q) => (answers[q.id]?.score ?? 0) <= 1);
  const priority = confirmed[0] || null;
  const rest = confirmed.slice(1);
  const crossValidated = confirmed.filter((q) => q.dataDriven);
  let narrative;
  if (lang === "en") {
    if (confirmed.length === 0) {
      narrative = "Based on your answers, no strong problem patterns stand out \u2014 that's a good result, but not a reason to drop your guard: take the review again after a few more trades.";
    } else {
      const titles = confirmed.map((q) => q.title.toLowerCase());
      narrative = titles.length === 1 ? `Right now, the biggest influence on your decisions is: ${titles[0]}.` : `Right now, the biggest influence on your decisions is: ${titles.slice(0, -1).join(", ")}, and ${titles[titles.length - 1]}.`;
      if (crossValidated.length > 0) {
        narrative += crossValidated.length === confirmed.length ? " This shows up not just in your answers, but in the journal's own numbers too \u2014 it matches your actual trades, not just how it feels." : ` Some of this (${crossValidated.map((q) => q.title.toLowerCase()).join(", ")}) also shows up in the journal's own numbers, not just in your answers.`;
      }
    }
  } else {
    if (confirmed.length === 0) {
      narrative = "\u041F\u043E \u0442\u0432\u043E\u0438\u043C \u043E\u0442\u0432\u0435\u0442\u0430\u043C \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u044B\u0445 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u043D\u044B\u0445 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u043E\u0432 \u043D\u0435 \u0432\u0438\u0434\u043D\u043E \u2014 \u044D\u0442\u043E \u0445\u043E\u0440\u043E\u0448\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442, \u043D\u043E \u043D\u0435 \u043F\u043E\u0432\u043E\u0434 \u0442\u0435\u0440\u044F\u0442\u044C \u0431\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C: \u043F\u0440\u043E\u0439\u0434\u0438 \u0440\u0430\u0437\u0431\u043E\u0440 \u0435\u0449\u0451 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0434\u0435\u043B\u043E\u043A.";
    } else {
      const titles = confirmed.map((q) => q.title.toLowerCase());
      narrative = titles.length === 1 ? `\u0421\u0438\u043B\u044C\u043D\u0435\u0435 \u0432\u0441\u0435\u0433\u043E \u043D\u0430 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0441\u0435\u0439\u0447\u0430\u0441 \u0432\u043B\u0438\u044F\u0435\u0442: ${titles[0]}.` : `\u0421\u0438\u043B\u044C\u043D\u0435\u0435 \u0432\u0441\u0435\u0433\u043E \u043D\u0430 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0441\u0435\u0439\u0447\u0430\u0441 \u0432\u043B\u0438\u044F\u0435\u0442: ${titles.slice(0, -1).join(", ")} \u0438 ${titles[titles.length - 1]}.`;
      if (crossValidated.length > 0) {
        narrative += crossValidated.length === confirmed.length ? " \u042D\u0442\u043E \u0432\u0438\u0434\u043D\u043E \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E \u043E\u0442\u0432\u0435\u0442\u0430\u043C, \u043D\u043E \u0438 \u0432 \u0441\u0430\u043C\u0438\u0445 \u0446\u0438\u0444\u0440\u0430\u0445 \u0436\u0443\u0440\u043D\u0430\u043B\u0430 \u2014 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u0441 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u043C\u0438 \u0441\u0434\u0435\u043B\u043A\u0430\u043C\u0438, \u0430 \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0441 \u043E\u0449\u0443\u0449\u0435\u043D\u0438\u0435\u043C." : ` \u0427\u0430\u0441\u0442\u044C \u044D\u0442\u043E\u0433\u043E (${crossValidated.map((q) => q.title.toLowerCase()).join(", ")}) \u0432\u0438\u0434\u043D\u043E \u0438 \u0432 \u0441\u0430\u043C\u0438\u0445 \u0446\u0438\u0444\u0440\u0430\u0445 \u0436\u0443\u0440\u043D\u0430\u043B\u0430, \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u043E\u0442\u0432\u0435\u0442\u0430\u0445.`;
      }
    }
  }
  return { pct, tier, narrative, priority, rest, confirmed, clear };
}
