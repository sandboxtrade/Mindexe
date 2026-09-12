// mind.exe — AI context builders.
// Pure compression/derivation from journal analytics; no Firebase, network or UI side effects.

import { st_mean, st_round2 } from "../core/stats.js?v=1";
import { normalizeResultCurrency, normalizeResultMode } from "../core/trade-math.js?v=1";
import {
  emotionClampPct, emotionConflict, emotionScaleKeys, isEntryClosed, normalizeEmotions
} from "../core/journal-model.js?v=2";
import { calculateTraderLevel } from "../analytics/trader-analytics.js?v=2";

function aiSafeNum(v) {
  return typeof v === "number" && isFinite(v) ? v : null;
}
function aiComputeStreakDays(entries) {
  const dateSet = new Set((entries || []).map((e) => e.date.toDateString()));
  const cursor = /* @__PURE__ */ new Date();
  if (!dateSet.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dateSet.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
function aiComputeStreaks(sortedClosed) {
  let curLoss = 0, maxLoss = 0, curWin = 0, maxWin = 0;
  sortedClosed.forEach((t) => {
    if (t.outcome === "Loss") {
      curLoss++;
      maxLoss = Math.max(maxLoss, curLoss);
      curWin = 0;
    } else if (t.outcome === "Win") {
      curWin++;
      maxWin = Math.max(maxWin, curWin);
      curLoss = 0;
    } else {
      curLoss = 0;
      curWin = 0;
    }
  });
  return { maxLossStreak: maxLoss, maxWinStreak: maxWin };
}
function aiComputePlanVsFact(closedEntries) {
  const withPlan = closedEntries.filter((e) => typeof e.plannedRR === "number" && typeof e.realizedRR === "number");
  if (withPlan.length < 3) return null;
  const avgPlanned = st_mean(withPlan.map((e) => e.plannedRR));
  const avgRealized = st_mean(withPlan.map((e) => e.realizedRR));
  const captures = withPlan.filter((e) => e.plannedRR > 0).map((e) => Math.max(0, Math.min(1, e.realizedRR / e.plannedRR)));
  const captureRatioPct = captures.length ? Math.round(st_mean(captures) * 100) : null;
  const closeCounts = { tp: 0, sl: 0, manual: 0 };
  closedEntries.forEach((e) => {
    if (e.closeType && closeCounts[e.closeType] != null) closeCounts[e.closeType]++;
  });
  const closeTotal = closeCounts.tp + closeCounts.sl + closeCounts.manual;
  return {
    sample: withPlan.length,
    avgPlannedRR: st_round2(avgPlanned),
    avgRealizedRR: st_round2(avgRealized),
    captureRatioPct,
    tpSharePct: closeTotal ? Math.round(closeCounts.tp / closeTotal * 100) : null,
    slSharePct: closeTotal ? Math.round(closeCounts.sl / closeTotal * 100) : null,
    manualSharePct: closeTotal ? Math.round(closeCounts.manual / closeTotal * 100) : null
  };
}
function aiSummarizePattern(p) {
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    type: p.type || null,
    severity: p.severity || null,
    confidence: p.confidence || null,
    sampleSize: aiSafeNum(p.sampleSize),
    avgR: p.metrics?.group?.avgR != null ? aiSafeNum(p.metrics.group.avgR) : null,
    winRatePct: p.metrics?.group?.winRate != null ? aiSafeNum(p.metrics.group.winRate) : null,
    summary: p.description || null
  };
}
// ---- V5.4: extra AI context ---------------------------------------------------------------
// The insight was generic because the context it was built from was thin: it carried aggregate
// scores but almost none of the raw behavioural relationships the user actually wants named
// ("3 of the last 7 were closed manually before TP"). Everything below is computed from data that
// already exists on the entry objects — nothing new is stored, nothing is invented, and every
// block returns null when its own minimum sample isn't met so the model can say "not enough data"
// instead of guessing.
function aiEntryMinutesHeld(e) {
  if (!(e.date instanceof Date) || !(e.exitDate instanceof Date)) return null;
  const m = (e.exitDate - e.date) / 6e4;
  return isFinite(m) && m >= 0 ? Math.round(m) : null;
}
// How the trader exits: did they let their own TP/SL do the work, or step in early — and what did
// stepping in cost them in RR terms.
function aiComputeExitBehavior(closedEntries) {
  const planned = closedEntries.filter((e) => typeof e.plannedRR === "number" && e.plannedRR > 0);
  if (planned.length < 3) return null;
  const byType = { tp: 0, sl: 0, manual: 0 };
  planned.forEach((e) => {
    if (e.closeType && byType[e.closeType] != null) byType[e.closeType]++;
  });
  const withBoth = planned.filter((e) => typeof e.realizedRR === "number" && !isNaN(e.realizedRR));
  // "Early exit" = closed by hand, in profit, but noticeably short of the planned target.
  const earlyExits = withBoth.filter((e) => e.closeType === "manual" && e.realizedRR > 0 && e.realizedRR < e.plannedRR * 0.9);
  const shortfalls = earlyExits.map((e) => e.plannedRR - e.realizedRR);
  // SL respected = the loss never went materially past 1R.
  const losers = withBoth.filter((e) => e.realizedRR < 0);
  const slRespected = losers.filter((e) => e.realizedRR >= -1.05).length;
  const emotionOnEarlyExit = earlyExits.filter((e) => e.x != null && e.y != null);
  const exitEmotionOnEarlyExit = earlyExits.filter((e) => e.exitX != null && e.exitY != null);
  return {
    plannedTradesSample: planned.length,
    tpReachedPct: Math.round(byType.tp / planned.length * 100),
    slHitPct: Math.round(byType.sl / planned.length * 100),
    manualClosePct: Math.round(byType.manual / planned.length * 100),
    slRespectedPct: losers.length ? Math.round(slRespected / losers.length * 100) : null,
    slRespectedSample: losers.length,
    earlyExitCount: earlyExits.length,
    earlyExitOfManualPct: byType.manual ? Math.round(earlyExits.length / byType.manual * 100) : null,
    avgRRLostToEarlyExit: shortfalls.length ? st_round2(st_mean(shortfalls)) : null,
    avgPlannedRROnEarlyExits: earlyExits.length ? st_round2(st_mean(earlyExits.map((e) => e.plannedRR))) : null,
    avgRealizedRROnEarlyExits: earlyExits.length ? st_round2(st_mean(earlyExits.map((e) => e.realizedRR))) : null,
    // avgConfidenceBeforeEarlyExit reads entry x (fear\u2192confidence axis \u2014 correct name). The
    // after-exit figure below reads exitX, which since V5.7 is the disappointed\u2192pleased axis, so
    // it's named for what it actually measures rather than reusing "confidence".
    avgConfidenceBeforeEarlyExit: emotionOnEarlyExit.length >= 2 ? Math.round(st_mean(emotionOnEarlyExit.map((e) => e.x))) : null,
    avgCalmBeforeEarlyExit: emotionOnEarlyExit.length >= 2 ? Math.round(st_mean(emotionOnEarlyExit.map((e) => e.y))) : null,
    emotionSampleOnEarlyExits: emotionOnEarlyExit.length,
    avgCalmAfterEarlyExit: exitEmotionOnEarlyExit.length >= 2 ? Math.round(st_mean(exitEmotionOnEarlyExit.map((e) => e.exitY))) : null,
    avgSatisfactionAfterEarlyExit: exitEmotionOnEarlyExit.length >= 2 ? Math.round(st_mean(exitEmotionOnEarlyExit.map((e) => e.exitX))) : null,
    exitEmotionSampleOnEarlyExits: exitEmotionOnEarlyExit.length
  };
}
// What changes in the NEXT trade after two consecutive wins / two consecutive losses.
function aiComputeAfterStreakBehavior(sortedClosed) {
  const withR = entriesWithRealizedRR(sortedClosed);
  if (withR.length < 8) return null;
  const baselineRisk = st_mean(withR.map((e) => Math.abs(e.realizedRR)));
  const collect = (outcome) => {
    const next = [];
    for (let i = 2; i < sortedClosed.length; i++) {
      if (sortedClosed[i - 1].outcome === outcome && sortedClosed[i - 2].outcome === outcome) next.push(sortedClosed[i]);
    }
    if (next.length < 2) return null;
    const nWithR = entriesWithRealizedRR(next);
    const avgRisk = nWithR.length ? st_mean(nWithR.map((e) => Math.abs(e.realizedRR))) : null;
    const manual = next.filter((e) => e.closeType === "manual").length;
    return {
      sample: next.length,
      riskChangeVsBaselinePct: avgRisk != null && baselineRisk ? Math.round((avgRisk - baselineRisk) / baselineRisk * 100) : null,
      manualClosePct: Math.round(manual / next.length * 100),
      winRatePct: (() => {
        const w = next.filter((e) => e.outcome === "Win").length;
        const l = next.filter((e) => e.outcome === "Loss").length;
        return w + l ? Math.round(w / (w + l) * 100) : null;
      })()
    };
  };
  return {
    baselineAvgRiskR: st_round2(baselineRisk),
    afterTwoWins: collect("Win"),
    afterTwoLosses: collect("Loss")
  };
}
function aiComputeHoldTimes(closedEntries) {
  const held = closedEntries.map((e) => ({ m: aiEntryMinutesHeld(e), outcome: e.outcome, closeType: e.closeType })).filter((h) => h.m != null);
  if (held.length < 4) return null;
  const wins = held.filter((h) => h.outcome === "Win").map((h) => h.m);
  const losses = held.filter((h) => h.outcome === "Loss").map((h) => h.m);
  const manual = held.filter((h) => h.closeType === "manual").map((h) => h.m);
  return {
    sample: held.length,
    medianMinutes: Math.round(st_median(held.map((h) => h.m))),
    medianMinutesWins: wins.length >= 2 ? Math.round(st_median(wins)) : null,
    medianMinutesLosses: losses.length >= 2 ? Math.round(st_median(losses)) : null,
    medianMinutesManualCloses: manual.length >= 2 ? Math.round(st_median(manual)) : null
  };
}
// The journal itself — regularity, how filled in entries are, and what the trader keeps writing.
function aiJournalDigest(validEntries, analytics) {
  const n = validEntries.length;
  if (!n) return null;
  const days = new Set(validEntries.map((e) => e.date.toDateString()));
  const withReflection = validEntries.filter((e) => e.pull && e.pull !== "\u2014" || e.lesson && e.lesson !== "\u2014").length;
  const withEmotion = validEntries.filter((e) => e.x != null && e.y != null).length;
  const withPlan = validEntries.filter((e) => typeof e.plannedRR === "number").length;
  return {
    totalEntries: n,
    distinctJournalDays: days.size,
    entriesWithReflectionPct: Math.round(withReflection / n * 100),
    entriesWithEmotionPct: Math.round(withEmotion / n * 100),
    entriesWithPlanPct: Math.round(withPlan / n * 100),
    reflectionQualityScore: aiSafeNum(analytics?.reflection?.score?.value),
    repeatedLessons: (analytics?.reflection?.repeatedLessons || []).slice(0, 4).map((r) => ({
      text: String(r.text || "").slice(0, 160),
      timesRepeated: r.count
    }))
  };
}
function aiCalibrationDigest(analytics) {
  const c = analytics?.calibration;
  if (!c || !c.available) return { available: false, reason: "no_calibration_matched_to_a_trading_day" };
  return {
    available: true,
    statedReadinessPct: aiSafeNum(c.statedPct),
    statedRiskFactors: c.statedRiskFactors || [],
    tradesThatDay: aiSafeNum(c.dayTradeCount),
    actualSignals: c.actualSignals || null,
    statedVsActualNote: c.divergenceNote || null,
    confidence: c.confidence || null
  };
}
export function aiBuildContext(entries, analytics, lang, strategyNote) {
  const validEntries = (entries || []).filter((e) => e && e.date instanceof Date && !isNaN(e.date.getTime()));
  const closedEntries = validEntries.filter(isEntryClosed);
  const sortedClosed = [...closedEntries].sort((a, b) => a.date - b.date);
  const streaks = aiComputeStreaks(sortedClosed);
  const rr = analytics?.rrStats || null;
  const violation = (id) => analytics?.discipline?.violations?.find((v) => v.id === id)?.value ?? null;
  const context = {
    lang: lang === "en" ? "en" : "ru",
    // V0.4 — стратегия, описанная пользователем в настройках. Модель обязана считать её
    // заданной рамкой, а не предметом критики (см. AI_STRATEGY_RULE).
    strategy: strategyNote && strategyNote.trim() ? strategyNote.trim() : null,
    trader: {
      level: calculateTraderLevel(validEntries, analytics),
      awarenessScore: aiSafeNum(analytics?.awareness?.score?.value),
      awarenessTrend: analytics?.awareness?.trend || null,
      currentStreakDays: aiComputeStreakDays(validEntries)
    },
    statistics: rr ? {
      totalTrades: validEntries.length,
      closedTrades: aiSafeNum(rr.sampleSize),
      winRate: aiSafeNum(rr.winRate),
      wins: aiSafeNum(rr.wins),
      losses: aiSafeNum(rr.losses),
      breakevens: aiSafeNum(rr.breakevens),
      avgRealizedRR: aiSafeNum(rr.avgRealizedRR),
      avgWinR: aiSafeNum(rr.avgWinR),
      avgLossR: aiSafeNum(rr.avgLossR),
      expectancy: aiSafeNum(rr.expectancy)
    } : { totalTrades: validEntries.length, closedTrades: 0 },
    planVsFact: aiComputePlanVsFact(closedEntries),
    behavior: {
      disciplineScore: aiSafeNum(analytics?.discipline?.score?.value),
      revengeTradeRatePct: aiSafeNum(violation("revenge_rate")),
      overtradingDaySharePct: aiSafeNum(violation("overtrading_days")),
      riskChangeAfterLossPct: aiSafeNum(analytics?.risk?.postLossChange?.value),
      riskChangeAfterWinPct: aiSafeNum(analytics?.risk?.postWinChange?.value),
      maxLossStreak: streaks.maxLossStreak,
      maxWinStreak: streaks.maxWinStreak
    },
    risk: {
      averageAbsRealizedRR: aiSafeNum(analytics?.risk?.averageRisk),
      stabilityScore: aiSafeNum(analytics?.risk?.stability?.value),
      realizedRRVolatility: aiSafeNum(analytics?.risk?.volatility)
    },
    reflection: {
      reflectionScore: aiSafeNum(analytics?.reflection?.score?.value),
      lossReviewCoveragePct: aiSafeNum(analytics?.reflection?.lossReviewCoverage?.value),
      repeatedLessonsCount: analytics?.reflection?.repeatedLessons?.length ?? 0
    },
    emotional: analytics?.emotionalState?.average ? {
      average: analytics.emotionalState.average,
      confidence: analytics.emotionalState.confidence || null,
      bestState: analytics.emotionalState.bestState ? {
        title: analytics.emotionalState.bestState.title,
        winRatePct: aiSafeNum(analytics.emotionalState.bestState.winRate),
        meanR: aiSafeNum(analytics.emotionalState.bestState.meanR),
        trades: aiSafeNum(analytics.emotionalState.bestState.trades)
      } : null,
      worstState: analytics.emotionalState.worstState ? {
        title: analytics.emotionalState.worstState.title,
        winRatePct: aiSafeNum(analytics.emotionalState.worstState.winRate),
        meanR: aiSafeNum(analytics.emotionalState.worstState.meanR),
        trades: aiSafeNum(analytics.emotionalState.worstState.trades)
      } : null
    } : null,
    exitBehavior: aiComputeExitBehavior(closedEntries),
    // How the trader's state moves between entry and exit, split by outcome and by how the trade
    // was closed. Null-safe: reports available:false on journals where the after-state was never
    // filled in, so the model says "not tracked yet" instead of inventing a shift.
    emotionalShift: analytics?.emotionalShift?.available ? analytics.emotionalShift : { available: false, sample: analytics?.emotionalShift?.sample ?? 0, coveragePct: analytics?.emotionalShift?.coveragePct ?? null },
    afterStreakBehavior: aiComputeAfterStreakBehavior(sortedClosed),
    holdTime: aiComputeHoldTimes(closedEntries),
    journal: aiJournalDigest(validEntries, analytics),
    calibration: aiCalibrationDigest(analytics),
    // The last closed trades in order, so the model can name a real sequence ("3 of the last 7")
    // instead of only speaking in lifetime aggregates.
    recentClosedSequence: aiCompactRecentEntries(sortedClosed, 12),
    patterns: (analytics?.patterns || []).slice(0, 5).map(aiSummarizePattern).filter(Boolean),
    healthyPatterns: (analytics?.healthyPatterns || []).slice(0, 3).map(aiSummarizePattern).filter(Boolean),
    localInsights: (analytics?.insights || []).slice(0, 4).map((i) => ({ id: i.id, basis: i.basis, sampleSize: aiSafeNum(i.sampleSize), confidence: i.confidence || null, text: i.text })),
    dataQuality: analytics?.dataQuality || null
  };
  return context;
}
export function aiHashContext(context) {
  const str = JSON.stringify(context);
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
// V1.2 — сериализация состояния для модели. Проценты идут как есть; conflict считается
// здесь же, чтобы модель не выводила его сама и не ошибалась.
function aiEmotionState(values, x, y, variant) {
  const v = normalizeEmotions(values, variant);
  if (v) {
    const k = emotionScaleKeys(variant);
    const out = {};
    for (const key of k) out[key] = emotionClampPct(v[key]);
    out.conflict = emotionConflict(v, variant).max;
    return out;
  }
  if (x == null || y == null) return null;
  return variant === "exit" ? { axes: { satisfaction: x, calm: y } } : { axes: { confidence: x, calm: y } };
}
export function aiCompactRecentEntries(entries, limit) {
  // V5.6: this used to slice(-limit) straight off the array. For normally-created trades that is
  // chronological (every new entry gets new Date() and is appended), but an imported journal keeps
  // the file's order, so after an import the Coach chat was handed the last-INSERTED trades and
  // told they were the most recent. Sorting here fixes both call sites and is a no-op on input
  // that is already ordered.
  return [...(entries || [])].sort((a, b) => {
    const av = a?.date instanceof Date ? a.date.getTime() : 0;
    const bv = b?.date instanceof Date ? b.date.getTime() : 0;
    return av - bv;
  }).slice(-limit).map((e) => ({
    date: e.date instanceof Date ? e.date.toISOString().slice(0, 10) : null,
    instrument: e.instrument || null,
    direction: e.direction || null,
    outcome: e.outcome || null,
    r: aiSafeNum(e.r),
    resultMode: normalizeResultMode(e.resultMode),
    resultCurrency: normalizeResultCurrency(e.resultCurrency),
    tag: e.tag && e.tag !== "\u041E\u0431\u0449\u0435\u0435" ? e.tag : null,
    plannedRR: aiSafeNum(e.plannedRR),
    realizedRR: aiSafeNum(e.realizedRR),
    closeType: e.closeType || null,
    // V5.4: state-before-entry and hold time were already on the entry but never reached the model,
    // which is why it could not connect "anxious before the trade" to "closed it by hand early".
    // V1.2: модель получала только две сведённые оси и из-за этого не различала
    // «уверен и спокоен» и «уверен, но при этом сильно боится» — обе ситуации давали
    // близкие confidence/calm. Теперь отдаются сами проценты по каждой эмоции плюс
    // conflict (насколько одновременно набраны противоположные полюса). Оси оставлены
    // как axes только для записей, где процентов нет (созданы до перехода на шкалы).
    stateBefore: aiEmotionState(e.emotions, e.x, e.y, "entry"),
    stateAfter: aiEmotionState(e.exitEmotions, e.exitX, e.exitY, "exit"),
    minutesHeld: aiEntryMinutesHeld(e),
    pull: e.pull && e.pull !== "\u2014" ? String(e.pull).slice(0, 200) : null,
    lesson: e.lesson && e.lesson !== "\u2014" ? String(e.lesson).slice(0, 200) : null
  }));
}

function caMinutesBetween(a, b) {
  if (!a || !b) return null;
  const diff = Math.abs(new Date(b).getTime() - new Date(a).getTime());
  return Math.round(diff / 6e4);
}
function caDayKey(d) {
  return d instanceof Date && !isNaN(d.getTime()) ? d.toDateString() : null;
}
function caLastSessionEntries(closedSorted) {
  if (!closedSorted.length) return { dayKey: null, list: [] };
  const dayKey = caDayKey(closedSorted[closedSorted.length - 1].exitDate || closedSorted[closedSorted.length - 1].date);
  const list = closedSorted.filter((e) => caDayKey(e.exitDate || e.date) === dayKey);
  return { dayKey, list };
}
function caTrailingStreak(closedSorted) {
  if (!closedSorted.length) return { type: null, count: 0 };
  let type = null, count = 0;
  for (let i = closedSorted.length - 1; i >= 0; i--) {
    const o = closedSorted[i].outcome;
    if (o !== "Win" && o !== "Loss") break;
    if (type === null) type = o;
    if (o !== type) break;
    count++;
  }
  return { type: type === "Win" ? "win" : type === "Loss" ? "loss" : null, count };
}
export function caComputeAdaptiveFactors(entries, analytics, calibrationHistory, lang) {
  const closedSorted = (entries || []).filter(isEntryClosed).slice().sort((a, b) => (a.exitDate || a.date) - (b.exitDate || b.date));
  const factors = [];
  if (!closedSorted.length) return factors;
  const { list: lastSession } = caLastSessionEntries(closedSorted);
  const streak = caTrailingStreak(closedSorted);
  if (streak.type === "loss" && streak.count >= 2) {
    factors.push({
      type: "consecutive_losses",
      severity: Math.min(1, 0.4 + streak.count * 0.13),
      evidence: lang === "en" ? `${streak.count} losing trades in a row (most recent trend)` : `${streak.count} \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u0434\u0440\u044F\u0434 (\u0441\u0430\u043C\u044B\u0439 \u0441\u0432\u0435\u0436\u0438\u0439 \u0442\u0440\u0435\u043D\u0434)`,
      source: "journal"
    });
  }
  if (streak.type === "win" && streak.count >= 2) {
    factors.push({
      type: "euphoria_risk",
      severity: Math.min(1, 0.35 + streak.count * 0.12),
      evidence: lang === "en" ? `${streak.count} winning trades in a row` : `${streak.count} \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u0434\u0440\u044F\u0434`,
      source: "journal"
    });
  }
  for (let i = 0; i < lastSession.length - 1; i++) {
    const cur = lastSession[i], next = lastSession[i + 1];
    if (cur.outcome !== "Loss") continue;
    const mins = caMinutesBetween(cur.exitDate || cur.date, next.date);
    if (mins != null && mins <= 25) {
      factors.push({
        type: "revenge_risk",
        severity: mins <= 10 ? 0.8 : mins <= 20 ? 0.6 : 0.4,
        evidence: lang === "en" ? `Re-entered ${mins} min after a loss in the last session` : `\u041D\u043E\u0432\u044B\u0439 \u0432\u0445\u043E\u0434 \u0447\u0435\u0440\u0435\u0437 ${mins} \u043C\u0438\u043D \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0432 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0441\u0435\u0441\u0441\u0438\u0438`,
        source: "journal"
      });
      break;
    }
  }
  const riskChange = analytics?.risk?.postLossChange?.value;
  if (riskChange != null && riskChange > 15) {
    factors.push({
      type: "increased_risk",
      severity: Math.min(1, riskChange / 40),
      evidence: lang === "en" ? `Risk tends to run ${Math.round(riskChange)}% higher right after a loss` : `\u0420\u0438\u0441\u043A \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u043E\u0431\u044B\u0447\u043D\u043E \u0432\u044B\u0448\u0435 \u043D\u0430 ${Math.round(riskChange)}%`,
      source: "pattern_engine"
    });
  }
  const recentByDay = {};
  closedSorted.slice(-40).forEach((e) => {
    const k = caDayKey(e.exitDate || e.date);
    if (k) recentByDay[k] = (recentByDay[k] || 0) + 1;
  });
  const dayCounts = Object.values(recentByDay);
  const avgPerDay = dayCounts.length ? dayCounts.reduce((s, n) => s + n, 0) / dayCounts.length : 0;
  if (lastSession.length >= 3 && avgPerDay > 0 && lastSession.length > avgPerDay * 1.6) {
    factors.push({
      type: "overtrading_risk",
      severity: Math.min(1, 0.4 + (lastSession.length / Math.max(1, avgPerDay) - 1) * 0.3),
      evidence: lang === "en" ? `${lastSession.length} trades last session vs a usual ~${Math.round(avgPerDay)}` : `${lastSession.length} \u0441\u0434\u0435\u043B\u043E\u043A \u0432 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0441\u0435\u0441\u0441\u0438\u0438 \u043F\u0440\u043E\u0442\u0438\u0432 \u043E\u0431\u044B\u0447\u043D\u044B\u0445 ~${Math.round(avgPerDay)}`,
      source: "journal"
    });
  }
  const earlyCandidates = closedSorted.slice(-15).filter((e) => e.closeType === "manual" && typeof e.plannedRR === "number" && e.plannedRR > 0 && typeof e.realizedRR === "number" && e.realizedRR > 0);
  const earlyExits = earlyCandidates.filter((e) => e.realizedRR < e.plannedRR * 0.7);
  if (earlyCandidates.length >= 3 && earlyExits.length / earlyCandidates.length >= 0.4) {
    factors.push({
      type: "early_exit_pattern",
      severity: Math.min(1, 0.4 + earlyExits.length / earlyCandidates.length * 0.5),
      evidence: lang === "en" ? `${earlyExits.length} of the last ${earlyCandidates.length} manual closes exited well before planned RR` : `${earlyExits.length} \u0438\u0437 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 ${earlyCandidates.length} \u0440\u0443\u0447\u043D\u044B\u0445 \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u0439 \u0431\u044B\u043B\u0438 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0440\u0430\u043D\u044C\u0448\u0435 \u043F\u043B\u0430\u043D\u043E\u0432\u043E\u0433\u043E RR`,
      source: "pattern_engine"
    });
  }
  const yesterday = /* @__PURE__ */ new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const hadTradesYesterday = closedSorted.some((e) => caDayKey(e.exitDate || e.date) === caDayKey(yesterday));
  if (!hadTradesYesterday) {
    factors.push({
      type: "fomo_risk",
      severity: 0.35,
      evidence: lang === "en" ? "No trades yesterday" : "\u0412\u0447\u0435\u0440\u0430 \u043D\u0435 \u0431\u044B\u043B\u043E \u0441\u0434\u0435\u043B\u043E\u043A",
      source: "journal"
    });
  }
  const repeatedLessons = analytics?.reflection?.repeatedLessons?.length ?? 0;
  if (repeatedLessons >= 2) {
    factors.push({
      type: "repeated_lesson",
      severity: Math.min(1, 0.4 + repeatedLessons * 0.12),
      evidence: lang === "en" ? `The same lesson has repeated ${repeatedLessons} times` : `\u041E\u0434\u0438\u043D \u0438 \u0442\u043E\u0442 \u0436\u0435 \u0443\u0440\u043E\u043A \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u043B\u0441\u044F ${repeatedLessons} \u0440\u0430\u0437`,
      source: "pattern_engine"
    });
  }
  const disciplineScore = analytics?.discipline?.score?.value;
  if (disciplineScore != null && disciplineScore < 50) {
    factors.push({
      type: "decreased_discipline",
      severity: Math.min(1, (50 - disciplineScore) / 50),
      evidence: lang === "en" ? `Discipline score is at ${Math.round(disciplineScore)}/100` : `\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044C \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u044B \u2014 ${Math.round(disciplineScore)}/100`,
      source: "pattern_engine"
    });
  }
  const lastSleepCal = (calibrationHistory || []).find((h) => h.answers?.sleep);
  if (lastSleepCal && lastSleepCal.answers.sleep.score <= -1) {
    factors.push({
      type: "poor_sleep",
      severity: lastSleepCal.answers.sleep.score === -2 ? 0.7 : 0.4,
      evidence: lang === "en" ? "Reported poor sleep at a recent calibration" : "\u0412 \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0435\u0439 \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0435 \u043E\u0442\u043C\u0435\u0447\u0435\u043D \u043F\u043B\u043E\u0445\u043E\u0439 \u0441\u043E\u043D",
      source: "calibration_history"
    });
  }
  const reflectionSnippets = lastSession.map((e) => [e.pull, e.lesson].filter((v) => v && v !== "\u2014").join(" / ")).filter(Boolean);
  if (reflectionSnippets.length) {
    factors.push({
      type: "reflection_note",
      severity: 0.5,
      evidence: reflectionSnippets.slice(0, 2).join(" | ").slice(0, 220),
      source: "journal"
    });
  }
  return factors;
}
export function caBuildContext(entries, analytics, adaptiveFactors, calibrationHistory, lang, strategyNote) {
  const closedSorted = (entries || []).filter(isEntryClosed).slice().sort((a, b) => (a.exitDate || a.date) - (b.exitDate || b.date));
  const { list: lastSession } = caLastSessionEntries(closedSorted);
  const closeCounts = { tp: 0, sl: 0, manual: 0 };
  lastSession.forEach((e) => {
    if (e.closeType && closeCounts[e.closeType] != null) closeCounts[e.closeType]++;
  });
  const last7 = closedSorted.filter((e) => {
    const days = ((/* @__PURE__ */ new Date()).getTime() - (e.exitDate || e.date).getTime()) / 864e5;
    return days <= 7;
  });
  return {
    lang: lang === "en" ? "en" : "ru",
    // V0.4 — стратегия из настроек: вопросы не должны подразумевать, что стиль торговли
    // (частота, таймфрейм, длительность удержания) сам по себе является проблемой.
    strategy: strategyNote && strategyNote.trim() ? strategyNote.trim() : null,
    todayDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    yesterday: lastSession.length ? {
      trades: lastSession.length,
      wins: lastSession.filter((e) => e.outcome === "Win").length,
      losses: lastSession.filter((e) => e.outcome === "Loss").length,
      totalR: aiSafeNum(st_round2(lastSession.reduce((s, e) => s + (e.realizedRR || 0), 0))),
      closeTypes: closeCounts
    } : null,
    recent: {
      last7DaysTrades: last7.length,
      winRate: last7.length ? Math.round(last7.filter((e) => e.outcome === "Win").length / last7.length * 100) : null,
      awarenessScore: aiSafeNum(analytics?.awareness?.score?.value)
    },
    patterns: (analytics?.patterns || []).slice(0, 3).map(aiSummarizePattern).filter(Boolean),
    adaptiveFactors: adaptiveFactors.map((f) => ({ type: f.type, severity: Math.round(f.severity * 100) / 100, evidence: f.evidence })),
    recentQuestions: (calibrationHistory || []).slice(0, 5).flatMap((h) => h.questions || []).filter((q) => q.source === "adaptive").map((q) => ({ factor: q.factor, text: q.text })).slice(0, 12)
  };
}
