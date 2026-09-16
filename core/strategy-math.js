// mind.exe — pure Strategy Lab aggregation helpers.
// Kept outside the Strategy UI so the large editor/AI/media feature can stay lazy-loaded.

import { normalizeResultByCloseType, outcomeFromResult, resultEntriesForUnit } from "./trade-math.js";
import { isEntryClosed } from "./journal-model.js";

export function normalizeStrategyResultByCloseType(closeType, value) {
  return normalizeResultByCloseType(closeType, value);
}

export function strategyResultOutcome(value) {
  return outcomeFromResult(value);
}

export function strategyAllTrades(strategyId, strategyTrades, journalEntries) {
  const direct = (strategyTrades || [])
    .filter((t) => t.strategyId === strategyId)
    .map((t) => ({ ...t, __source: "strategy" }));
  const linked = (journalEntries || [])
    .filter((e) => e.strategyId === strategyId)
    .map((e) => ({ ...e, __source: "journal" }));
  return [...direct, ...linked].sort((a, b) => {
    const da = a.date instanceof Date ? a.date.getTime() : new Date(a.date || 0).getTime();
    const db = b.date instanceof Date ? b.date.getTime() : new Date(b.date || 0).getTime();
    return da - db;
  });
}

export function calculateStrategyStats(strategyId, strategyTrades, journalEntries, measureMode = "R", currency = "USD") {
  const allTrades = strategyAllTrades(strategyId, strategyTrades, journalEntries);
  const closedAll = allTrades.filter((t) => isEntryClosed(t) && typeof t.r === "number" && isFinite(t.r));
  const closed = resultEntriesForUnit(closedAll, measureMode, currency);
  const open = allTrades.filter((t) => !isEntryClosed(t));

  const allWins = closedAll.filter((t) => t.outcome === "Win" || t.r > 0);
  const allLosses = closedAll.filter((t) => t.outcome === "Loss" || t.r < 0);
  const allBreakevens = closedAll.filter((t) => t.outcome === "Breakeven" || t.r === 0);
  const winRate = allWins.length + allLosses.length ? allWins.length / (allWins.length + allLosses.length) * 100 : null;

  const wins = closed.filter((t) => t.r > 0);
  const losses = closed.filter((t) => t.r < 0);
  const totalR = closed.reduce((s, t) => s + t.r, 0);
  const avgR = closed.length ? totalR / closed.length : null;
  const avgWin = wins.length ? wins.reduce((s, t) => s + t.r, 0) / wins.length : null;
  const avgLoss = losses.length ? losses.reduce((s, t) => s + t.r, 0) / losses.length : null;
  const grossProfit = wins.reduce((s, t) => s + t.r, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.r, 0));
  const grossLossSigned = losses.reduce((s, t) => s + t.r, 0);
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : null;

  let equity = 0, peak = 0, maxDrawdown = 0;
  [...closed].sort((a, b) => {
    const da = a.exitDate || a.date;
    const db = b.exitDate || b.date;
    return new Date(da || 0).getTime() - new Date(db || 0).getTime();
  }).forEach((t) => {
    equity += t.r;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);
  });

  const longClosed = closed.filter((t) => t.direction === "Long");
  const shortClosed = closed.filter((t) => t.direction === "Short");
  const longTotal = longClosed.reduce((s, t) => s + t.r, 0);
  const shortTotal = shortClosed.reduce((s, t) => s + t.r, 0);
  const avgGroup = (arr) => arr.length ? arr.reduce((s, t) => s + t.r, 0) / arr.length : null;
  const rulesKnown = closed.filter((t) => typeof t.rulesFollowed === "boolean");
  const followed = rulesKnown.filter((t) => t.rulesFollowed);
  const broken = rulesKnown.filter((t) => !t.rulesFollowed);
  const directCount = allTrades.filter((t) => t.__source === "strategy").length;
  const linkedCount = allTrades.filter((t) => t.__source === "journal").length;

  return {
    totalTrades: allTrades.length,
    closedTrades: closedAll.length,
    resultSampleTrades: closed.length,
    excludedResultTrades: closedAll.length - closed.length,
    openTrades: open.length,
    wins: allWins.length,
    losses: allLosses.length,
    breakevens: allBreakevens.length,
    winRate: winRate == null ? null : Math.round(winRate * 10) / 10,
    totalR: Math.round(totalR * 100) / 100,
    avgR: avgR == null ? null : Math.round(avgR * 100) / 100,
    avgWin: avgWin == null ? null : Math.round(avgWin * 100) / 100,
    avgLoss: avgLoss == null ? null : Math.round(avgLoss * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100,
    grossLoss: Math.round(grossLossSigned * 100) / 100,
    profitFactor: profitFactor === Infinity ? "Infinity" : profitFactor == null ? null : Math.round(profitFactor * 100) / 100,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    long: { count: longClosed.length, totalR: Math.round(longTotal * 100) / 100, avgR: avgGroup(longClosed) == null ? null : Math.round(avgGroup(longClosed) * 100) / 100 },
    short: { count: shortClosed.length, totalR: Math.round(shortTotal * 100) / 100, avgR: avgGroup(shortClosed) == null ? null : Math.round(avgGroup(shortClosed) * 100) / 100 },
    rules: {
      known: rulesKnown.length,
      followed: followed.length,
      broken: broken.length,
      followedAvgR: avgGroup(followed) == null ? null : Math.round(avgGroup(followed) * 100) / 100,
      brokenAvgR: avgGroup(broken) == null ? null : Math.round(avgGroup(broken) * 100) / 100
    },
    directCount,
    linkedCount
  };
}
