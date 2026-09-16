// MIND.EXE — Decision Lab factor taxonomy v1.
// Stable canonical ids let analytics connect differently worded arguments over time.

export const DECISION_FACTOR_GROUPS = Object.freeze({
  market_structure: "Market structure",
  price_level: "Price level",
  participant_behavior: "Participant behavior",
  market_context: "Market context",
  momentum: "Momentum",
  volume: "Volume",
  liquidity: "Liquidity",
  volatility: "Volatility",
  correlation: "Correlation",
  risk: "Risk",
  timing: "Timing",
  emotion: "Emotion",
  other: "Other"
});

export const DECISION_FACTORS = Object.freeze({
  higher_timeframe_trend: { group: "market_structure", ru: "Тренд старшего ТФ", en: "Higher-timeframe trend" },
  local_trend: { group: "market_structure", ru: "Локальный тренд", en: "Local trend" },
  trend_conflict: { group: "market_structure", ru: "Конфликт таймфреймов", en: "Timeframe conflict" },
  market_structure_shift: { group: "market_structure", ru: "Смена структуры", en: "Structure shift" },
  range: { group: "market_structure", ru: "Диапазон / флэт", en: "Range" },
  support: { group: "price_level", ru: "Поддержка", en: "Support" },
  resistance: { group: "price_level", ru: "Сопротивление", en: "Resistance" },
  level_retest: { group: "price_level", ru: "Ретест уровня", en: "Level retest" },
  level_exhaustion: { group: "price_level", ru: "Усталость уровня", en: "Level exhaustion" },
  breakout: { group: "price_level", ru: "Пробой", en: "Breakout" },
  rejection: { group: "price_level", ru: "Отбой / реакция", en: "Rejection" },
  buyer_strength: { group: "participant_behavior", ru: "Сила покупателя", en: "Buyer strength" },
  buyer_weakness: { group: "participant_behavior", ru: "Слабость покупателя", en: "Buyer weakness" },
  seller_strength: { group: "participant_behavior", ru: "Сила продавца", en: "Seller strength" },
  seller_weakness: { group: "participant_behavior", ru: "Слабость продавца", en: "Seller weakness" },
  no_reaction: { group: "participant_behavior", ru: "Нет реакции", en: "No reaction" },
  failed_reclaim: { group: "participant_behavior", ru: "Неудачный возврат", en: "Failed reclaim" },
  btc_strength: { group: "market_context", ru: "Сила BTC", en: "BTC strength" },
  btc_weakness: { group: "market_context", ru: "Слабость BTC", en: "BTC weakness" },
  btc_dominance: { group: "market_context", ru: "BTC Dominance", en: "BTC dominance" },
  market_sentiment: { group: "market_context", ru: "Общий фон рынка", en: "Market context" },
  momentum_strength: { group: "momentum", ru: "Сильный импульс", en: "Strong momentum" },
  momentum_weakness: { group: "momentum", ru: "Слабый импульс", en: "Weak momentum" },
  volume_confirmation: { group: "volume", ru: "Подтверждение объёмом", en: "Volume confirmation" },
  volume_weakness: { group: "volume", ru: "Слабый объём", en: "Weak volume" },
  liquidity_sweep: { group: "liquidity", ru: "Снятие ликвидности", en: "Liquidity sweep" },
  liquidity_density: { group: "liquidity", ru: "Плотность ликвидности", en: "Liquidity density" },
  volatility_high: { group: "volatility", ru: "Высокая волатильность", en: "High volatility" },
  volatility_low: { group: "volatility", ru: "Низкая волатильность", en: "Low volatility" },
  correlation_btc: { group: "correlation", ru: "Корреляция с BTC", en: "BTC correlation" },
  correlation_market: { group: "correlation", ru: "Корреляция с рынком", en: "Market correlation" },
  price_extension: { group: "risk", ru: "Цена уже далеко прошла", en: "Price extension" },
  risk_reward: { group: "risk", ru: "Соотношение риск/прибыль", en: "Risk/reward" },
  invalidation_quality: { group: "risk", ru: "Качество инвалидации", en: "Invalidation quality" },
  entry_timing: { group: "timing", ru: "Тайминг входа", en: "Entry timing" },
  late_entry: { group: "timing", ru: "Поздний вход", en: "Late entry" },
  early_entry: { group: "timing", ru: "Ранний вход", en: "Early entry" },
  fear_of_missing: { group: "emotion", ru: "Страх упустить движение", en: "Fear of missing out" },
  fear_of_loss: { group: "emotion", ru: "Страх убытка", en: "Fear of loss" },
  revenge_pressure: { group: "emotion", ru: "Желание отбиться", en: "Revenge pressure" },
  overconfidence: { group: "emotion", ru: "Чрезмерная уверенность", en: "Overconfidence" },
  hesitation: { group: "emotion", ru: "Сомнение", en: "Hesitation" },
  other: { group: "other", ru: "Другое", en: "Other" }
});

export const DECISION_EMOTION_TAGS = Object.freeze([
  "calm",
  "fear",
  "fomo",
  "doubt",
  "overconfidence",
  "rush",
  "greed",
  "frustration",
  "revenge",
  "excitement",
  "other"
]);

export const DECISION_EMOTION_LABELS = Object.freeze({
  calm: { ru: "Спокойствие", en: "Calm" },
  fear: { ru: "Страх", en: "Fear" },
  fomo: { ru: "FOMO", en: "FOMO" },
  doubt: { ru: "Сомнение", en: "Doubt" },
  overconfidence: { ru: "Переуверенность", en: "Overconfidence" },
  rush: { ru: "Спешка", en: "Rush" },
  greed: { ru: "Азарт / жадность", en: "Greed" },
  frustration: { ru: "Раздражение", en: "Frustration" },
  revenge: { ru: "Желание отбиться", en: "Revenge" },
  excitement: { ru: "Возбуждение", en: "Excitement" },
  other: { ru: "Другое", en: "Other" }
});

export function isDecisionFactorGroup(value) {
  return Object.prototype.hasOwnProperty.call(DECISION_FACTOR_GROUPS, value);
}

export function isDecisionFactor(value) {
  return Object.prototype.hasOwnProperty.call(DECISION_FACTORS, value);
}

export function normalizeDecisionFactor(group, factorId) {
  if (isDecisionFactor(factorId)) {
    const factor = DECISION_FACTORS[factorId];
    return { factorId, factorGroup: factor.group };
  }
  if (isDecisionFactorGroup(group)) return { factorId: "other", factorGroup: group };
  return { factorId: "other", factorGroup: "other" };
}

export function decisionFactorLabel(factorId, lang = "ru") {
  const row = DECISION_FACTORS[factorId] || DECISION_FACTORS.other;
  return row[lang === "en" ? "en" : "ru"];
}
