// MIND.EXE — pure statistical helpers.
// No React, Firebase, DOM or persistence side effects.

export function st_mean(arr) {
  if (!arr || !arr.length) return null;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

export function st_median(arr) {
  if (!arr || !arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function st_stdev(arr) {
  if (!arr || arr.length < 2) return null;
  const m = st_mean(arr);
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

export function st_round2(v) {
  return v == null ? null : Math.round(v * 100) / 100;
}

export function computeRRWinRateStats(closedEntries) {
  // `r` may be money. Only realizedRR is a true risk-normalized R value.
  const rrTrades = (closedEntries || []).filter(
    (e) => typeof e.realizedRR === "number" && !isNaN(e.realizedRR) && isFinite(e.realizedRR)
  );
  const avgRealizedRR = rrTrades.length ? st_mean(rrTrades.map((e) => e.realizedRR)) : null;
  const wins = rrTrades.filter((e) => e.realizedRR > 0);
  const losses = rrTrades.filter((e) => e.realizedRR < 0);
  const breakevens = rrTrades.filter((e) => e.realizedRR === 0);
  const total = wins.length + losses.length;
  const winRate = total > 0 ? wins.length / total * 100 : null;
  const avgWinR = wins.length ? st_mean(wins.map((e) => e.realizedRR)) : null;
  const avgLossR = losses.length ? Math.abs(st_mean(losses.map((e) => e.realizedRR))) : null;
  const expectancy = total > 0 && avgWinR != null && avgLossR != null
    ? wins.length / total * avgWinR - losses.length / total * avgLossR
    : null;

  return {
    sampleSize: rrTrades.length,
    avgRealizedRR: avgRealizedRR != null ? st_round2(avgRealizedRR) : null,
    winRate: winRate != null ? Math.round(winRate) : null,
    wins: wins.length,
    losses: losses.length,
    breakevens: breakevens.length,
    avgWinR: avgWinR != null ? st_round2(avgWinR) : null,
    avgLossR: avgLossR != null ? st_round2(avgLossR) : null,
    expectancy: expectancy != null ? st_round2(expectancy) : null
  };
}
