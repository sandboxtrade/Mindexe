// mind.exe — behavioral analytics + pattern engine.
// Pure journal analysis only; no React UI, auth, persistence or Firestore writes.

import { entriesWithRealizedRR, hasRealizedRR } from "../core/trade-math.js?v=1";
import { computeRRWinRateStats, st_mean, st_median, st_round2, st_stdev } from "../core/stats.js?v=1";
import { isEntryClosed, normalizeEmotions } from "../core/journal-model.js?v=1";

var TA_CONFIDENCE_THRESHOLDS = { low: 5, moderate: 15, high: 30 };
function ta_confidence(sampleSize, thresholds = TA_CONFIDENCE_THRESHOLDS) {
  if (!sampleSize || sampleSize < thresholds.low) return "insufficient";
  if (sampleSize < thresholds.moderate) return "low";
  if (sampleSize < thresholds.high) return "moderate";
  return "high";
}
function ta_metric(value, sampleSize, thresholds) {
  return { value, sampleSize, confidence: ta_confidence(sampleSize, thresholds) };
}
var TA_TREND_WINDOW = 20;
function ta_splitRecent(sortedEntries, windowSize = TA_TREND_WINDOW) {
  const n = sortedEntries.length;
  const recent = sortedEntries.slice(Math.max(0, n - windowSize));
  const previous = sortedEntries.slice(Math.max(0, n - 2 * windowSize), Math.max(0, n - windowSize));
  return { recent, previous };
}
function ta_trend(currentValue, previousValue, epsilon = 1, higherIsBetter = true) {
  if (currentValue == null || previousValue == null) return "insufficient_data";
  const diff = currentValue - previousValue;
  if (Math.abs(diff) < epsilon) return "stable";
  const rising = diff > 0;
  return rising === higherIsBetter ? "improving" : "declining";
}
export const TREND_ARROW = { improving: " \u2191", declining: " \u2193", stable: "", insufficient_data: "" };
var RQ_CAUSE_MARKERS = ["\u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E", "\u0438\u0437-\u0437\u0430", "\u0442.\u043A.", "\u0442\u0430\u043A \u043A\u0430\u043A", "\u043F\u043E\u044D\u0442\u043E\u043C\u0443", "\u0432\u0435\u0434\u044C"];
var RQ_ACTION_MARKERS = ["\u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437", "\u0431\u0443\u0434\u0443", "\u0441\u0434\u0435\u043B\u0430\u044E", "\u043F\u0435\u0440\u0435\u0441\u0442\u0430\u043D\u0443", "\u043D\u0430\u0447\u043D\u0443", "\u043D\u0435 \u0431\u0443\u0434\u0443", "\u043D\u0430\u0434\u043E \u0431\u0443\u0434\u0435\u0442", "\u0441\u0442\u043E\u0438\u0442"];
function ta_reflectionQualityForEntry(entry) {
  const pull = (entry.pull || "").trim();
  const lesson = (entry.lesson || "").trim();
  const hasPull = pull && pull !== "\u2014";
  const hasLesson = lesson && lesson !== "\u2014";
  if (!hasPull && !hasLesson) return 0;
  let score = 0;
  if (hasPull) score += 20;
  if (hasLesson) score += 20;
  const combined = `${pull} ${lesson}`.toLowerCase();
  const hasCause = RQ_CAUSE_MARKERS.some((m) => combined.includes(m));
  const hasAction = RQ_ACTION_MARKERS.some((m) => combined.includes(m));
  const hasNumberOrTime = /\d/.test(combined);
  if (hasCause) score += 20;
  if (hasAction) score += 25;
  if (hasNumberOrTime) score += 15;
  const wordCount = combined.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 6 && (hasCause || hasAction)) score += Math.min(10, Math.floor(wordCount / 6));
  return Math.max(0, Math.min(100, score));
}
function reflectionAnalysis(entries) {
  const withText = entries.filter((e) => e.pull && e.pull !== "\u2014" || e.lesson && e.lesson !== "\u2014");
  const scores = entries.map(ta_reflectionQualityForEntry).filter((_, i) => entries[i].pull && entries[i].pull !== "\u2014" || entries[i].lesson && entries[i].lesson !== "\u2014");
  const avgScore = st_mean(scores);
  const withLessons = entries.filter((e) => e.lesson && e.lesson !== "\u2014" && e.lesson.trim().length > 3);
  const words = withLessons.map((e) => pe_normalizeLesson(e.lesson));
  const clusters = [];
  for (let i = 0; i < withLessons.length; i++) {
    let placed = false;
    for (const c of clusters) {
      if (pe_lessonSimilarity(words[i], words[c.members[0]]) >= 0.5) {
        c.members.push(i);
        placed = true;
        break;
      }
    }
    if (!placed) clusters.push({ members: [i] });
  }
  const repeatedLessons = clusters.filter((c) => c.members.length >= 2).map((c) => ({ text: withLessons[c.members[0]].lesson, count: c.members.length })).sort((a, b) => b.count - a.count);
  const losses = entries.filter((e) => e.outcome === "Loss");
  const lossesWithShots = losses.filter((e) => Array.isArray(e.screenshots) && e.screenshots.length > 0);
  return {
    score: ta_metric(avgScore != null ? Math.round(avgScore) : null, withText.length),
    repeatedLessons,
    lossReviewCoverage: losses.length ? ta_metric(Math.round(lossesWithShots.length / losses.length * 100), losses.length) : ta_metric(null, 0)
  };
}
var EMOTION_ZONES = [
  { id: "fear_avoidance", title: "\u0421\u0442\u0440\u0430\u0445 / \u0438\u0437\u0431\u0435\u0433\u0430\u043D\u0438\u0435", test: (x, y) => x < 50 && y < 50 },
  { id: "tense_confidence", title: "\u041D\u0430\u043F\u0440\u044F\u0436\u0451\u043D\u043D\u0430\u044F \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C", test: (x, y) => x >= 50 && y < 50 },
  { id: "calm_confidence", title: "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u0430\u044F \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C", test: (x, y) => x >= 50 && y >= 50 },
  { id: "doubt_neutral", title: "\u0421\u043E\u043C\u043D\u0435\u043D\u0438\u0435 / \u043D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C", test: (x, y) => x < 50 && y >= 50 }
];
function ta_zoneStats(group) {
  const withR = entriesWithRealizedRR(group);
  const rs = withR.map((t) => t.realizedRR);
  const wins = group.filter((t) => t.outcome === "Win").length;
  const losses = group.filter((t) => t.outcome === "Loss").length;
  let maxLossStreak = 0, streak = 0;
  [...group].sort((a, b) => a.date - b.date).forEach((t) => {
    if (t.outcome === "Loss") {
      streak++;
      maxLossStreak = Math.max(maxLossStreak, streak);
    } else streak = 0;
  });
  return {
    trades: group.length,
    winRate: group.length ? Math.round(wins / group.length * 100) : null,
    meanR: st_round2(st_mean(rs)),
    medianR: st_round2(st_median(rs)),
    meanAbsR: st_round2(st_mean(rs.map(Math.abs))),
    rrSample: withR.length,
    lossShare: group.length ? Math.round(losses / group.length * 100) : null,
    maxLossStreak
  };
}
function emotionalAnalysis(entries) {
  const complete = entries.filter((e) => e.x != null && e.y != null && !isNaN(e.x) && !isNaN(e.y));
  if (!complete.length) {
    return { average: null, volatility: null, zones: [], bestState: null, worstState: null, confidence: "insufficient" };
  }
  const xs = complete.map((e) => e.x), ys = complete.map((e) => e.y);
  const average = { x: Math.round(st_mean(xs)), y: Math.round(st_mean(ys)) };
  const volatility = { x: st_round2(st_stdev(xs)), y: st_round2(st_stdev(ys)) };
  const zones = EMOTION_ZONES.map((z) => {
    const group = complete.filter((e) => z.test(e.x, e.y));
    return { id: z.id, title: z.title, ...ta_zoneStats(group), confidence: ta_confidence(group.length, { low: 5, moderate: 20, high: 30 }) };
  });
  const ranked = zones.filter((z) => z.trades >= 5 && z.medianR != null);
  const bestState = ranked.length ? ranked.reduce((a, b) => b.medianR > a.medianR ? b : a) : null;
  const worstState = ranked.length ? ranked.reduce((a, b) => b.medianR < a.medianR ? b : a) : null;
  return { average, volatility, zones, bestState, worstState, confidence: ta_confidence(complete.length) };
}
// V5.5 \u2014 exit-state analysis. The entry mood (x/y) was already tracked; exitX/exitY closes the
// loop. Everything here needs both points on the same trade, so it reports its own sample and
// returns nulls rather than guessing when a group is too thin. Nothing else in the engine depends
// on this \u2014 scores, patterns and levels are unchanged by it \u2014 it is an added read-only view fed
// to the UI and to Gemini.
//
// V5.7 correction: this used to also report `confidenceShift = mean(exitX - x)`. That was only
// ever valid while the exit grid reused the entry grid's fear\u2192confidence x-axis. Since the exit
// grid was redesigned around disappointed\u2192pleased (a reaction to the RESULT, not a read on the
// setup), x and exitX are two different psychological axes \u2014 subtracting them produced a number
// with no coherent meaning, even though it looked like a normal "before/after" delta. The y-axis
// (agitated\u2192calm at entry, stung\u2192at peace at exit) is still the same kind of arousal measure on
// both ends, so calmShift stays valid and unchanged. avgConfidenceAfter is renamed
// avgSatisfactionAfter \u2014 it was always just a mean of exitX alone (not a comparison to x), so the
// value is identical, only the name now matches what it actually measures.
var EMOTION_SHIFT_MIN_GROUP = 3;
function es_shiftStats(group) {
  if (group.length < EMOTION_SHIFT_MIN_GROUP) return null;
  return {
    sample: group.length,
    calmShift: Math.round(st_mean(group.map((e) => e.exitY - e.y))),
    avgCalmAfter: Math.round(st_mean(group.map((e) => e.exitY))),
    avgSatisfactionAfter: Math.round(st_mean(group.map((e) => e.exitX)))
  };
}
function emotionalShiftAnalysis(closedEntries) {
  const both = (closedEntries || []).filter(
    (e) => e.x != null && e.y != null && e.exitX != null && e.exitY != null
  );
  const coverage = closedEntries && closedEntries.length ? Math.round(both.length / closedEntries.length * 100) : null;
  if (both.length < EMOTION_SHIFT_MIN_GROUP) {
    return { available: false, sample: both.length, coveragePct: coverage, confidence: "insufficient" };
  }
  const byOutcome = {
    win: es_shiftStats(both.filter((e) => e.outcome === "Win")),
    loss: es_shiftStats(both.filter((e) => e.outcome === "Loss")),
    breakeven: es_shiftStats(both.filter((e) => e.outcome === "Breakeven"))
  };
  const byCloseType = {
    tp: es_shiftStats(both.filter((e) => e.closeType === "tp")),
    sl: es_shiftStats(both.filter((e) => e.closeType === "sl")),
    manual: es_shiftStats(both.filter((e) => e.closeType === "manual"))
  };
  // A win that still leaves the trader rattled, or unsatisfied, is a different signal from a win
  // that settles them \u2014 each stays within its own axis (calm compared to calm, satisfaction
  // compared to satisfaction), never mixed.
  const winsUncalm = both.filter((e) => e.outcome === "Win" && e.exitY < 40);
  const winsUnsatisfied = both.filter((e) => e.outcome === "Win" && e.exitX < 40);
  const lossesCalm = both.filter((e) => e.outcome === "Loss" && e.exitY >= 60);
  return {
    available: true,
    sample: both.length,
    coveragePct: coverage,
    overall: es_shiftStats(both),
    byOutcome,
    byCloseType,
    winsEndingUncalmCount: winsUncalm.length,
    winsEndingUncalmPct: byOutcome.win ? Math.round(winsUncalm.length / byOutcome.win.sample * 100) : null,
    winsEndingUnsatisfiedCount: winsUnsatisfied.length,
    winsEndingUnsatisfiedPct: byOutcome.win ? Math.round(winsUnsatisfied.length / byOutcome.win.sample * 100) : null,
    lossesEndingCalmCount: lossesCalm.length,
    lossesEndingCalmPct: byOutcome.loss ? Math.round(lossesCalm.length / byOutcome.loss.sample * 100) : null,
    confidence: ta_confidence(both.length, { low: 5, moderate: 15, high: 25 })
  };
}
function riskAnalysis(sortedEntries) {
  // R-based analytics must use realizedRR. Generic `r` may be money.
  const withR = entriesWithRealizedRR(sortedEntries);
  if (withR.length < 5) {
    return {
      stability: ta_metric(null, withR.length),
      averageRisk: null,
      volatility: null,
      postLossChange: ta_metric(null, 0),
      postWinChange: ta_metric(null, 0)
    };
  }
  const mags = withR.map((t) => Math.abs(t.realizedRR));
  const meanMag = st_mean(mags);
  const sd = st_stdev(mags);
  const cv = meanMag ? sd / meanMag : 0;
  const stability = Math.round(Math.max(0, 100 - cv * 100));
  const postLoss = [], postWin = [];
  for (let i = 1; i < sortedEntries.length; i++) {
    const prev = sortedEntries[i - 1], cur = sortedEntries[i];
    if (!hasRealizedRR(prev) || !hasRealizedRR(cur)) continue;
    if (prev.outcome === "Loss") postLoss.push({ prevAbs: Math.abs(prev.realizedRR), curAbs: Math.abs(cur.realizedRR) });
    else if (prev.outcome === "Win") postWin.push({ prevAbs: Math.abs(prev.realizedRR), curAbs: Math.abs(cur.realizedRR) });
  }
  const pctChange = (pairs) => {
    if (!pairs.length) return null;
    const prevMean = st_mean(pairs.map((p) => p.prevAbs));
    const curMean = st_mean(pairs.map((p) => p.curAbs));
    if (!prevMean) return null;
    return Math.round((curMean - prevMean) / prevMean * 100);
  };
  return {
    stability: ta_metric(stability, withR.length),
    averageRisk: st_round2(meanMag),
    volatility: st_round2(sd),
    postLossChange: ta_metric(pctChange(postLoss), postLoss.length),
    postWinChange: ta_metric(pctChange(postWin), postWin.length)
  };
}
function sequenceAnalysis(sortedEntries) {
  const revengeGroup = [], normalAfterLoss = [];
  for (let i = 1; i < sortedEntries.length; i++) {
    if (sortedEntries[i - 1].outcome === "Loss") {
      const gapMin = (sortedEntries[i].date - sortedEntries[i - 1].date) / 6e4;
      if (gapMin >= 0 && gapMin <= 30) revengeGroup.push(sortedEntries[i]);
      else normalAfterLoss.push(sortedEntries[i]);
    }
  }
  const revengeStats = pe_summarize(revengeGroup);
  const normalAfterLossStats = pe_summarize(normalAfterLoss.length ? normalAfterLoss : sortedEntries);
  let curLossStreak = 0, maxLossStreak = 0, curWinStreak = 0, maxWinStreak = 0;
  const afterLossStreak2 = [];
  sortedEntries.forEach((t) => {
    if (curLossStreak >= 2) afterLossStreak2.push(t);
    if (t.outcome === "Loss") {
      curLossStreak++;
      maxLossStreak = Math.max(maxLossStreak, curLossStreak);
      curWinStreak = 0;
    } else if (t.outcome === "Win") {
      curWinStreak++;
      maxWinStreak = Math.max(maxWinStreak, curWinStreak);
      curLossStreak = 0;
    } else {
      curLossStreak = 0;
      curWinStreak = 0;
    }
  });
  const afterLossStreakStats = pe_summarize(afterLossStreak2);
  const byDay = /* @__PURE__ */ new Map();
  sortedEntries.forEach((t) => {
    const k = t.date.toDateString();
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k).push(t);
  });
  const dayCounts = [...byDay.values()].map((a) => a.length);
  const medianDayCount = dayCounts.length ? st_median(dayCounts) : null;
  let overtradingGroup = [], normalDaysGroup = [];
  if (dayCounts.length >= 5) {
    const baseline = Math.max(1, medianDayCount);
    const threshold = Math.max(baseline + 3, baseline * 2);
    byDay.forEach((trades) => {
      if (trades.length >= threshold) overtradingGroup.push(...trades);
      else normalDaysGroup.push(...trades);
    });
  }
  const overtradingStats = pe_summarize(overtradingGroup);
  const normalDaysStats = pe_summarize(normalDaysGroup.length ? normalDaysGroup : sortedEntries);
  return {
    revenge: { group: revengeStats, groupSize: revengeGroup.length, rest: normalAfterLossStats },
    lossStreak: { max: maxLossStreak, afterStreak: afterLossStreakStats, afterStreakSize: afterLossStreak2.length },
    winStreak: { max: maxWinStreak },
    overtrading: { medianDayCount, group: overtradingStats, groupSize: overtradingGroup.length, normalDays: normalDaysStats }
  };
}
function disciplineAnalysis(sortedEntries, seq, risk) {
  const n = sortedEntries.length;
  if (n < 5) return { score: ta_metric(null, n), violations: [] };
  const violations = [];
  let penalty = 0;
  const lossCount = sortedEntries.filter((t) => t.outcome === "Loss").length;
  if (lossCount >= 3) {
    const revengeRate = seq.revenge.groupSize / lossCount;
    if (revengeRate > 0.15) {
      const amount = Math.min(30, revengeRate * 60);
      penalty += amount;
      violations.push({ id: "revenge_rate", value: Math.round(revengeRate * 100), impact: Math.round(amount) });
    }
  }
  if (seq.overtrading.groupSize > 0) {
    const share = seq.overtrading.groupSize / n;
    const amount = Math.min(20, share * 100);
    penalty += amount;
    violations.push({ id: "overtrading_days", value: Math.round(share * 100), impact: Math.round(amount) });
  }
  if (risk.postLossChange.value != null && risk.postLossChange.value > 20) {
    const amount = Math.min(20, risk.postLossChange.value / 3);
    penalty += amount;
    violations.push({ id: "risk_after_loss", value: risk.postLossChange.value, impact: Math.round(amount) });
  }
  if (risk.postWinChange.value != null && risk.postWinChange.value > 20) {
    const amount = Math.min(20, risk.postWinChange.value / 3);
    penalty += amount;
    violations.push({ id: "risk_after_win", value: risk.postWinChange.value, impact: Math.round(amount) });
  }
  const score = Math.round(Math.max(0, 100 - penalty));
  return { score: ta_metric(score, n), violations };
}
var AWARENESS_WEIGHTS = {
  selfObservation: 0.2,
  emotionalAwareness: 0.15,
  behavioralConsistency: 0.15,
  reflectionQuality: 0.2,
  patternRecognition: 0.15,
  processDiscipline: 0.15,
  // V5.5. Safe to add BECAUSE of the V5.4 rewrite: a component that cannot be computed is excluded
  // and the remaining weights are renormalised, so for every journal where the after-state was
  // never recorded this evaluates to null and the awareness score is bit-for-bit what it was
  // before. It only starts counting once the trader actually closes the loop on their own state.
  stateAfterTracking: 0.08
};
// V5.4 rewrite. Three concrete problems with the old version:
//   1. An empty journal returned 55% — a brand-new account was shown a score it had not earned.
//   2. Every component that could not be computed yet was substituted with the constant 50, so a
//      single entry produced ~50% out of essentially nothing. That is the "1 запись = 30%" jump.
//   3. Nothing braked the score when the trader kept repeating the same mistake — patternRecognition
//      was diluted to 1/6 of the total and the other five components kept drifting up with use.
// Now: unavailable components are EXCLUDED and the remaining weights are renormalised (never
// faked with 50); the renormalised value is then multiplied by an evidence ramp so the score grows
// gradually with real, complete history instead of jumping; and repeated mistakes apply a direct
// multiplicative brake. rawScore (pre-ramp) is returned separately so trend comparison between two
// short windows stays meaningful — the ramp would otherwise flatten both windows to near zero.
var AWARENESS_EVIDENCE_TARGET = 40;
function awarenessAnalysis(entries, closedEntries, reflection, risk, discipline) {
  const n = (entries || []).length;
  const closed = closedEntries || [];
  const closedN = closed.length;
  if (!n) return { score: ta_metric(0, 0), rawScore: null, components: null, evidence: 0 };
  const emotionTagged = entries.filter((e) => e.x != null && e.y != null).length;
  const withLessons = entries.filter((e) => e.lesson && e.lesson !== "\u2014" && e.lesson.trim().length > 3).length;
  const repeatedCount = (reflection.repeatedLessons || []).reduce((s, c) => s + c.count, 0);
  const components = {
    // Requires closed trades — an open trade has no lesson yet, so it cannot be judged.
    selfObservation: closedN >= 1 ? closed.filter(
      (e) => e.x != null && e.y != null && e.pull && e.pull !== "\u2014" && e.lesson && e.lesson !== "\u2014"
    ).length / closedN * 100 : null,
    emotionalAwareness: n >= 3 ? emotionTagged / n * 100 : null,
    behavioralConsistency: risk?.stability?.value ?? null,
    reflectionQuality: reflection?.score?.value ?? null,
    // Needs at least 3 written lessons before "does he repeat himself" means anything.
    patternRecognition: withLessons >= 3 ? Math.max(0, 100 - repeatedCount / withLessons * 100) : null,
    processDiscipline: discipline?.score?.value ?? null,
    // Null \u2014 not 0 \u2014 while the field is unused, otherwise every pre-V5.5 journal would be
    // retroactively penalised for a field that did not exist when those trades were closed. It
    // starts counting only once the trader has recorded the after-state at least 3 times.
    stateAfterTracking: (() => {
      const recorded = closed.filter((e) => e.exitX != null && e.exitY != null).length;
      return closedN >= 3 && recorded >= 3 ? recorded / closedN * 100 : null;
    })()
  };
  let sum = 0, wsum = 0;
  Object.entries(AWARENESS_WEIGHTS).forEach(([k, w]) => {
    const v = components[k];
    if (v == null || isNaN(v)) return;
    sum += v * w;
    wsum += w;
  });
  if (wsum <= 0) return { score: ta_metric(0, n), rawScore: null, components, evidence: 0 };
  const rawScore = Math.max(0, Math.min(100, sum / wsum));
  // Evidence = how much genuinely usable material the score rests on. A journalled-but-empty entry
  // contributes far less than a closed trade with emotion + reflection recorded.
  const completeN = closed.filter(
    (e) => e.x != null && e.y != null && e.lesson && e.lesson !== "\u2014"
  ).length;
  const evidence = closedN + completeN;
  const ramp = Math.min(1, evidence / AWARENESS_EVIDENCE_TARGET);
  // Repeated-mistake brake: if most written lessons are restatements of earlier ones, awareness is
  // not actually growing — continued app usage alone must not lift the number.
  const repeatShare = withLessons >= 3 ? Math.min(1, repeatedCount / withLessons) : 0;
  const repeatBrake = 1 - repeatShare * 0.35;
  const score = Math.round(Math.max(0, Math.min(100, rawScore * ramp * repeatBrake)));
  return { score: ta_metric(score, n), rawScore: Math.round(rawScore), components, evidence };
}
function calibrationAnalysis(sortedEntries, lastCalibration, lang = "ru") {
  if (!lastCalibration || !lastCalibration.date) {
    return { available: false, confidence: "insufficient" };
  }
  const calDate = new Date(lastCalibration.date);
  if (isNaN(calDate.getTime())) return { available: false, confidence: "insufficient" };
  const dayEntries = sortedEntries.filter((e) => e.date.toDateString() === calDate.toDateString());
  if (dayEntries.length < 2) {
    return { available: false, confidence: "insufficient", dayTradeCount: dayEntries.length };
  }
  let revengeCount = 0;
  for (let i = 1; i < dayEntries.length; i++) {
    if (dayEntries[i - 1].outcome === "Loss") {
      const gapMin = (dayEntries[i].date - dayEntries[i - 1].date) / 6e4;
      if (gapMin >= 0 && gapMin <= 30) revengeCount++;
    }
  }
  const withR = entriesWithRealizedRR(dayEntries);
  let riskGrew = false;
  if (withR.length >= 3) {
    const half = Math.floor(withR.length / 2);
    const m1 = st_mean(withR.slice(0, half).map((e) => Math.abs(e.realizedRR)));
    const m2 = st_mean(withR.slice(half).map((e) => Math.abs(e.realizedRR)));
    if (m1 && m2 && m2 > m1 * 1.3) riskGrew = true;
  }
  const statedRiskFactors = lastCalibration.riskFactors || [];
  const statedCalm = statedRiskFactors.length === 0;
  let divergenceNote = null;
  if (lang === "en") {
    if (statedCalm && (revengeCount > 0 || riskGrew || dayEntries.length >= 8)) {
      const signals = [];
      if (revengeCount > 0) signals.push(`${revengeCount} ${revengeCount === 1 ? "trade" : "trades"} within 30 minutes of a loss`);
      if (riskGrew) signals.push("risk noticeably grew during the day");
      if (dayEntries.length >= 8) signals.push(`${dayEntries.length} trades in one day`);
      divergenceNote = `Your pre-session calibration didn't flag any risk factors, but during the day: ${signals.join(", ")}. There was a gap between the stated state and actual behavior.`;
    } else if (!statedCalm && revengeCount === 0 && !riskGrew && dayEntries.length < 8) {
      divergenceNote = "Calibration flagged risk factors before the session, and the day went without clear signs of revenge trading, growing risk, or a high trade count \u2014 the stated caution held up in behavior.";
    }
  } else {
    if (statedCalm && (revengeCount > 0 || riskGrew || dayEntries.length >= 8)) {
      const signals = [];
      if (revengeCount > 0) signals.push(`${revengeCount} ${pluralRu(revengeCount, "\u0441\u0434\u0435\u043B\u043A\u0430", "\u0441\u0434\u0435\u043B\u043A\u0438", "\u0441\u0434\u0435\u043B\u043E\u043A")} \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 30 \u043C\u0438\u043D\u0443\u0442 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430`);
      if (riskGrew) signals.push("\u0440\u0438\u0441\u043A \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0432\u044B\u0440\u043E\u0441 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u0434\u043D\u044F");
      if (dayEntries.length >= 8) signals.push(`${dayEntries.length} \u0441\u0434\u0435\u043B\u043E\u043A \u0437\u0430 \u0434\u0435\u043D\u044C`);
      divergenceNote = `\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0441\u0435\u0441\u0441\u0438\u0435\u0439 \u043D\u0435 \u043E\u0442\u043C\u0435\u0442\u0438\u043B\u0430 \u0444\u0430\u043A\u0442\u043E\u0440\u043E\u0432 \u0440\u0438\u0441\u043A\u0430, \u043D\u043E \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u0434\u043D\u044F: ${signals.join(", ")}. \u041C\u0435\u0436\u0434\u0443 \u0437\u0430\u044F\u0432\u043B\u0435\u043D\u043D\u044B\u043C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435\u043C \u0438 \u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435\u043C \u0431\u044B\u043B\u043E \u0440\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0435.`;
    } else if (!statedCalm && revengeCount === 0 && !riskGrew && dayEntries.length < 8) {
      divergenceNote = "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u043E\u0442\u043C\u0435\u0442\u0438\u043B\u0430 \u0444\u0430\u043A\u0442\u043E\u0440\u044B \u0440\u0438\u0441\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0441\u0435\u0441\u0441\u0438\u0435\u0439, \u0438 \u0434\u0435\u043D\u044C \u043F\u0440\u043E\u0448\u0451\u043B \u0431\u0435\u0437 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u044B\u0445 \u043F\u0440\u0438\u0437\u043D\u0430\u043A\u043E\u0432 \u0440\u0435\u0432\u0430\u043D\u0448\u0430, \u0440\u043E\u0441\u0442\u0430 \u0440\u0438\u0441\u043A\u0430 \u0438\u043B\u0438 \u0431\u043E\u043B\u044C\u0448\u043E\u0433\u043E \u0447\u0438\u0441\u043B\u0430 \u0441\u0434\u0435\u043B\u043E\u043A \u2014 \u0437\u0430\u044F\u0432\u043B\u0435\u043D\u043D\u0430\u044F \u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u043B\u0430\u0441\u044C \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435\u043C.";
    }
  }
  return {
    available: true,
    dayTradeCount: dayEntries.length,
    statedPct: lastCalibration.pct,
    statedRiskFactors,
    actualSignals: { revengeCount, riskGrew, tradeCount: dayEntries.length },
    divergenceNote,
    confidence: ta_confidence(dayEntries.length, { low: 3, moderate: 6, high: 10 }),
    limitation: lang === "en" ? "Only the last calibration completed that day is considered \u2014 there's no per-session calibration history yet, so long-term calibration accuracy isn't calculated." : "\u0423\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043D\u0430\u044F \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u0437\u0430 \u0434\u0435\u043D\u044C \u2014 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043E\u043A \u043F\u043E \u0441\u0435\u0441\u0441\u0438\u044F\u043C \u043F\u043E\u043A\u0430 \u043D\u0435\u0442, \u0434\u043E\u043B\u0433\u043E\u0441\u0440\u043E\u0447\u043D\u0430\u044F \u0442\u043E\u0447\u043D\u043E\u0441\u0442\u044C \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0438 \u043D\u0435 \u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F."
  };
}
var PATTERN_MIN_SAMPLE = 20;
var PATTERN_MIN_GROUP = 8;
var PATTERN_MIN_REVENGE = 5;
var PATTERN_MIN_DIFF_R = 0.2;
var PATTERN_SCORE_FLOOR = 0.22;
function pe_isEmotionallyComplete(t) {
  return t && t.x != null && t.y != null && !isNaN(t.x) && !isNaN(t.y) && (t.outcome === "Win" || t.outcome === "Loss" || t.outcome === "Breakeven");
}
function pe_summarize(group) {
  const wins = group.filter((t) => t.outcome === "Win").length;
  const losses = group.filter((t) => t.outcome === "Loss").length;
  const breakevens = group.filter((t) => t.outcome === "Breakeven").length;
  const withR = entriesWithRealizedRR(group);
  const avgR = withR.length ? withR.reduce((s, t) => s + t.realizedRR, 0) / withR.length : null;
  const winRate = group.length ? Math.round(wins / group.length * 100) : 0;
  return { trades: group.length, rrSample: withR.length, wins, losses, breakevens, winRate, avgR };
}
function pe_scoreCandidate(group, rest, opts = {}) {
  const gStats = pe_summarize(group);
  const rStats = pe_summarize(rest);
  if (gStats.avgR == null || rStats.avgR == null || gStats.rrSample < 3 || rStats.rrSample < 3) return null;
  const diff = gStats.avgR - rStats.avgR;
  if (Math.abs(diff) < (opts.minDiffR ?? PATTERN_MIN_DIFF_R)) return null;
  const rrGroup = entriesWithRealizedRR(group);
  const uniqueDays = new Set(rrGroup.map((t) => t.date.toDateString())).size;
  const sampleNorm = opts.sampleNorm ?? 25;
  const sampleConfidence = Math.min(1, gStats.rrSample / sampleNorm);
  const statisticalDifference = Math.min(1, Math.abs(diff) / 0.6);
  const recurrence = Math.min(1, uniqueDays / Math.min(8, sampleNorm));
  const score = statisticalDifference * sampleConfidence * recurrence;
  const confidenceLabel = score >= 0.55 ? "high" : score >= 0.32 ? "medium" : "low";
  return { gStats, rStats, diff, uniqueDays, score, confidenceLabel };
}
function pe_pickExamples(group, n = 3) {
  const withR = entriesWithRealizedRR(group);
  if (withR.length === 0) return group.slice(0, n);
  const avg = withR.reduce((s, t) => s + t.realizedRR, 0) / withR.length;
  return [...withR].sort((a, b) => Math.abs(a.realizedRR - avg) - Math.abs(b.realizedRR - avg)).slice(0, n);
}
var PE_STOPWORDS = /* @__PURE__ */ new Set([
  "\u0438",
  "\u0432",
  "\u043D\u0430",
  "\u0441",
  "\u043D\u0435",
  "\u0447\u0442\u043E",
  "\u044F",
  "\u044D\u0442\u043E",
  "\u043F\u043E",
  "\u0437\u0430",
  "\u043A\u0430\u043A",
  "\u043D\u043E",
  "\u0430",
  "\u0442\u043E",
  "\u0438\u0437",
  "\u043A",
  "\u0443",
  "\u0436\u0435",
  "\u0431\u044B",
  "\u0432\u0441\u0435",
  "\u0432\u0441\u0451",
  "\u043C\u043D\u0435",
  "\u043C\u0435\u043D\u044F",
  "\u0442\u0435\u0431\u0435",
  "\u0441\u0435\u0431\u044F",
  "\u0431\u044B\u043B\u043E",
  "\u0431\u044B\u043B",
  "\u0431\u044B\u043B\u0430",
  "\u043D\u0443\u0436\u043D\u043E",
  "\u043D\u0430\u0434\u043E",
  "\u0435\u0441\u043B\u0438",
  "\u0438\u043B\u0438",
  "\u0434\u043B\u044F",
  "\u0434\u043E",
  "\u043E\u0442",
  "\u0440\u0430\u0437",
  "\u043F\u0440\u043E\u0441\u0442\u043E",
  "\u0443\u0436\u0435",
  "\u0435\u0449\u0451",
  "\u0435\u0449\u0435"
]);
function pe_normalizeLesson(text) {
  return (text || "").toLowerCase().replace(/[.,!?;:()«»"'\-—]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !PE_STOPWORDS.has(w));
}
function pe_lessonSimilarity(aWords, bWords) {
  if (!aWords.length || !bWords.length) return 0;
  const a = new Set(aWords), b = new Set(bWords);
  let intersection = 0;
  a.forEach((w) => {
    if (b.has(w)) intersection++;
  });
  const union = (/* @__PURE__ */ new Set([...a, ...b])).size;
  return union ? intersection / union : 0;
}
// V1.2 — эмоциональные предикаты паттернов. Раньше они читали только x/y, а те сводят
// четыре шкалы в две оси и теряют одновременность: уверенность 70% + страх 100% давали
// x=35, y=85 и попадали в «слишком спокойный», хотя это ровно противоположный случай.
// Теперь у записей со шкалами проверяются сами проценты, а x/y остаются запасным путём
// для записей, созданных до перехода на шкалы (у них процентов физически нет).
function pe_emo(t) {
  return normalizeEmotions(t?.emotions, "entry");
}
function pe_match(t, byPct, byAxes) {
  const v = pe_emo(t);
  return v ? byPct(v) : byAxes(t);
}
function pd_confidenceTension(complete, lang = "ru") {
  const test = (t) => pe_match(
    t,
    (v) => v.confidence >= 60 && v.tension >= 50,
    (t2) => t2.x >= 80 && t2.y <= 20
  );
  const group = complete.filter(test);
  if (group.length < PATTERN_MIN_GROUP) return null;
  const rest = complete.filter((t) => !test(t));
  return lang === "en" ? {
    id: "confidence_tension",
    title: "Confidence + tension",
    description: "Your worst-performing trades don't come from fear \u2014 they come when confidence is high but tension is high too.",
    healthyDescription: "When confidence and tension are both high, your result is noticeably better than in other trades.",
    group,
    rest
  } : {
    id: "confidence_tension",
    title: "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C + \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435",
    description: "\u0422\u0432\u043E\u0438 \u043D\u0430\u0438\u0431\u043E\u043B\u0435\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0432\u043E\u0437\u043D\u0438\u043A\u0430\u044E\u0442 \u043D\u0435 \u0432 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \u0441\u0442\u0440\u0430\u0445\u0430, \u0430 \u043A\u043E\u0433\u0434\u0430 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0432\u044B\u0441\u043E\u043A\u0430\u044F, \u043D\u043E \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F \u0442\u043E\u0436\u0435 \u0432\u044B\u0441\u043E\u043A\u0438\u0439.",
    healthyDescription: "\u041A\u043E\u0433\u0434\u0430 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0438 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435 \u0432\u044B\u0441\u043E\u043A\u0438 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E, \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043B\u0443\u0447\u0448\u0435, \u0447\u0435\u043C \u0432 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043A\u0430\u0445.",
    group,
    rest
  };
}
function pd_fear(complete, lang = "ru") {
  const test = (t) => pe_match(t, (v) => v.fear >= 60, (t2) => t2.x <= 20);
  const group = complete.filter(test);
  if (group.length < PATTERN_MIN_GROUP) return null;
  const rest = complete.filter((t) => !test(t));
  return lang === "en" ? {
    id: "fear",
    title: "Entering out of fear",
    description: "Trades started from a strong fear of missing the move are, on average, noticeably worse than the rest.",
    healthyDescription: "Even your fear-driven entries aren't worse than your other trades on average \u2014 that's unusual and worth knowing.",
    group,
    rest
  } : {
    id: "fear",
    title: "\u0412\u0445\u043E\u0434 \u0438\u0437 \u0441\u0442\u0440\u0430\u0445\u0430",
    description: "\u0421\u0434\u0435\u043B\u043A\u0438, \u043D\u0430\u0447\u0430\u0442\u044B\u0435 \u0438\u0437 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u043E\u0433\u043E \u0441\u0442\u0440\u0430\u0445\u0430 \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435, \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0445\u0443\u0436\u0435 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445.",
    healthyDescription: "\u0414\u0430\u0436\u0435 \u0432\u0445\u043E\u0434\u044B \u0438\u0437 \u0441\u0442\u0440\u0430\u0445\u0430 \u0443 \u0442\u0435\u0431\u044F \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u043D\u0435 \u0445\u0443\u0436\u0435 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u2014 \u044D\u0442\u043E \u0441\u0430\u043C\u043E \u043F\u043E \u0441\u0435\u0431\u0435 \u043D\u0435\u043E\u0431\u044B\u0447\u043D\u043E \u0438 \u0441\u0442\u043E\u0438\u0442 \u0437\u043D\u0430\u0442\u044C.",
    group,
    rest
  };
}
function pd_tooCalm(complete, lang = "ru") {
  // Спокойствие засчитывается только когда оно НЕ соседствует с сильным страхом или
  // напряжением: иначе «спокоен на 70% и одновременно боится на 100%» попадало сюда.
  const test = (t) => pe_match(
    t,
    (v) => v.calm >= 70 && v.tension <= 30 && v.fear <= 30,
    (t2) => t2.y >= 80
  );
  const group = complete.filter(test);
  if (group.length < PATTERN_MIN_GROUP) return null;
  const rest = complete.filter((t) => !test(t));
  return lang === "en" ? {
    id: "too_calm",
    title: "Too calm",
    description: "In a state of pronounced calm, your result is noticeably worse than in other trades \u2014 maybe it's not calm, but a lack of attention to risk.",
    healthyDescription: "Calm",
    healthyTitle: "Calm works in your favor",
    healthyDescriptionFull: "Trades made in a state of pronounced calm are noticeably better than your other trades \u2014 that's a strength, not something to fix.",
    group,
    rest
  } : {
    id: "too_calm",
    title: "\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u0439",
    description: "\u0412 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u043E\u0433\u043E \u0441\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u044F \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0445\u0443\u0436\u0435, \u0447\u0435\u043C \u0432 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043A\u0430\u0445 \u2014 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E, \u044D\u0442\u043E \u043D\u0435 \u0441\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u0435, \u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u043A \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u044F \u043A \u0440\u0438\u0441\u043A\u0443.",
    healthyDescription: "\u0421\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u0435",
    healthyTitle: "\u0421\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043D\u0430 \u0442\u0435\u0431\u044F",
    healthyDescriptionFull: "\u0421\u0434\u0435\u043B\u043A\u0438 \u0432 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u043D\u043E\u0433\u043E \u0441\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u044F \u0443 \u0442\u0435\u0431\u044F \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043B\u0443\u0447\u0448\u0435 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u2014 \u044D\u0442\u043E \u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430, \u0430 \u043D\u0435 \u0442\u043E, \u0447\u0442\u043E \u043D\u0443\u0436\u043D\u043E \u0447\u0438\u043D\u0438\u0442\u044C.",
    group,
    rest
  };
}
function pd_revenge(allSorted, lang = "ru") {
  const revengeTrades = [];
  const normalNextTrades = [];
  for (let i = 1; i < allSorted.length; i++) {
    if (allSorted[i - 1].outcome === "Loss") {
      const gapMin = (allSorted[i].date - allSorted[i - 1].date) / 6e4;
      if (gapMin >= 0 && gapMin <= 30) revengeTrades.push(allSorted[i]);
      else normalNextTrades.push(allSorted[i]);
    }
  }
  if (revengeTrades.length < PATTERN_MIN_REVENGE) return null;
  const rest = normalNextTrades.length ? normalNextTrades : allSorted.filter((t) => !revengeTrades.includes(t));
  return lang === "en" ? {
    id: "revenge",
    title: "Revenge through confidence",
    description: "After a losing trade you often re-enter within a short window, and the quality of the result in those re-entries is noticeably worse.",
    group: revengeTrades,
    rest,
    minDiffR: 0.15,
    sampleNorm: 10
  } : {
    id: "revenge",
    title: "\u0420\u0435\u0432\u0430\u043D\u0448 \u0447\u0435\u0440\u0435\u0437 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C",
    description: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0442\u044B \u0447\u0430\u0441\u0442\u043E \u0432\u0445\u043E\u0434\u0438\u0448\u044C \u0441\u043D\u043E\u0432\u0430 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u043A\u043E\u0440\u043E\u0442\u043A\u043E\u0433\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438, \u0438 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430 \u0432 \u044D\u0442\u0438\u0445 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u0445 \u0432\u0445\u043E\u0434\u0430\u0445 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0445\u0443\u0436\u0435.",
    group: revengeTrades,
    rest,
    minDiffR: 0.15,
    sampleNorm: 10
    // revenge has its own, lower, spec'd minimum (5) — score against that scale, not the general one
  };
}
function pd_lessonNotLearned(all, lang = "ru") {
  const withLessons = all.filter((t) => t.lesson && t.lesson !== "\u2014" && t.lesson.trim().length > 3);
  if (withLessons.length < 3) return null;
  const words = withLessons.map((t) => pe_normalizeLesson(t.lesson));
  const clusters = [];
  for (let i = 0; i < withLessons.length; i++) {
    let placed = false;
    for (const c of clusters) {
      const rep = c.members[0];
      if (pe_lessonSimilarity(words[i], words[rep]) >= 0.5) {
        c.members.push(i);
        placed = true;
        break;
      }
    }
    if (!placed) clusters.push({ members: [i] });
  }
  clusters.sort((a, b) => b.members.length - a.members.length);
  const top = clusters[0];
  if (!top || top.members.length < 3) return null;
  const group = top.members.map((i) => withLessons[i]);
  const groupIds = new Set(group.map((t) => t.id));
  const rest = all.filter((t) => !groupIds.has(t.id));
  return {
    id: "lesson_not_learned",
    title: lang === "en" ? "Lesson not learned" : "\u0423\u0440\u043E\u043A \u043D\u0435 \u0443\u0441\u0432\u043E\u0435\u043D",
    description: lang === "en" ? `A similar lesson repeats in the journal ${group.length} times ("${group[0].lesson}") \u2014 but based on the results, the behavior itself hasn't changed.` : `\u041F\u043E\u0445\u043E\u0436\u0438\u0439 \u0443\u0440\u043E\u043A \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0442\u0441\u044F \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 ${group.length} \u0440\u0430\u0437 (\xAB${group[0].lesson}\xBB) \u2014 \u0430 \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435, \u0441\u0443\u0434\u044F \u043F\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0443, \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0435\u0436\u043D\u0438\u043C.`,
    group,
    rest,
    minDiffR: 0.1,
    minGroup: 3,
    sampleNorm: 6
  };
}
function pd_unstableRisk(all, lang = "ru") {
  const withR = entriesWithRealizedRR(all);
  if (withR.length < 10) return null;
  const mags = withR.map((t) => Math.abs(t.realizedRR));
  const meanMag = mags.reduce((s, v) => s + v, 0) / mags.length;
  const variance = mags.reduce((s, v) => s + (v - meanMag) ** 2, 0) / mags.length;
  const stdev = Math.sqrt(variance);
  if (stdev < meanMag * 0.6 || stdev < 0.3) return null;
  const spikes = withR.filter((t) => Math.abs(t.realizedRR) > meanMag + stdev);
  if (spikes.length < PATTERN_MIN_GROUP) return null;
  const rest = withR.filter((t) => !spikes.includes(t));
  return {
    id: "unstable_risk",
    title: lang === "en" ? "Unstable risk" : "\u041D\u0435\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0439 \u0440\u0438\u0441\u043A",
    description: lang === "en" ? `Your R result swings a lot (average ${meanMag.toFixed(2)}R, spread \xB1${stdev.toFixed(2)}R) \u2014 some trades are noticeably bigger than typical, which usually points to unstable risk, not the market.` : `\u0420\u0430\u0437\u043C\u0435\u0440 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430 \u043F\u043E R \u0441\u0438\u043B\u044C\u043D\u043E \u043A\u043E\u043B\u0435\u0431\u043B\u0435\u0442\u0441\u044F (\u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C ${meanMag.toFixed(2)}R, \u0440\u0430\u0437\u0431\u0440\u043E\u0441 \xB1${stdev.toFixed(2)}R) \u2014 \u0447\u0430\u0441\u0442\u044C \u0441\u0434\u0435\u043B\u043E\u043A \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043A\u0440\u0443\u043F\u043D\u0435\u0435 \u0442\u0438\u043F\u0438\u0447\u043D\u043E\u0439, \u0447\u0442\u043E \u043E\u0431\u044B\u0447\u043D\u043E \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u043E \u043D\u0435\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u043C \u0440\u0438\u0441\u043A\u0435, \u0430 \u043D\u0435 \u043E \u0440\u044B\u043D\u043A\u0435.`,
    group: spikes,
    rest,
    minDiffR: 0.1
  };
}
function pd_overtrading(all, lang = "ru") {
  const byDay = /* @__PURE__ */ new Map();
  all.forEach((t) => {
    const k = t.date.toDateString();
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k).push(t);
  });
  const dayCounts = [...byDay.values()].map((arr) => arr.length);
  if (dayCounts.length < 5) return null;
  const sortedCounts = [...dayCounts].sort((a, b) => a - b);
  const median = sortedCounts[Math.floor(sortedCounts.length / 2)];
  const baseline = Math.max(1, median);
  const anomalyThreshold = Math.max(baseline + 3, baseline * 2);
  const group = [], rest = [];
  byDay.forEach((trades) => {
    if (trades.length >= anomalyThreshold) group.push(...trades);
    else rest.push(...trades);
  });
  if (group.length < PATTERN_MIN_GROUP) return null;
  return {
    id: "overtrading",
    title: lang === "en" ? "Overtrading" : "\u041F\u0435\u0440\u0435\u0442\u0440\u0435\u0439\u0434\u0438\u043D\u0433",
    description: lang === "en" ? `You typically make ${baseline} ${baseline === 1 ? "trade" : "trades"} on an active day. On days with ${anomalyThreshold}+ trades, the result looks noticeably different from a typical day.` : `\u041E\u0431\u044B\u0447\u043D\u043E \u0443 \u0442\u0435\u0431\u044F ${baseline} ${baseline === 1 ? "\u0441\u0434\u0435\u043B\u043A\u0430" : "\u0441\u0434\u0435\u043B\u043A\u0438"} \u0432 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0434\u0435\u043D\u044C. \u0412 \u0434\u043D\u0438 \u043E\u0442 ${anomalyThreshold} \u0441\u0434\u0435\u043B\u043E\u043A \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u043E\u0442 \u0442\u0438\u043F\u0438\u0447\u043D\u043E\u0433\u043E \u0434\u043D\u044F.`,
    group,
    rest
  };
}
function pd_lossStreak(allSorted, lang = "ru") {
  const afterStreak = [], normal = [];
  let streak = 0;
  for (let i = 0; i < allSorted.length; i++) {
    const t = allSorted[i];
    if (streak >= 2 && t.outcome !== void 0) {
      afterStreak.push(t);
    } else if (i > 0) {
      normal.push(t);
    }
    if (t.outcome === "Loss") streak++;
    else streak = 0;
  }
  if (afterStreak.length < PATTERN_MIN_GROUP) return null;
  return {
    id: "loss_streak",
    title: lang === "en" ? "Loss streak" : "\u0421\u0435\u0440\u0438\u044F \u0443\u0431\u044B\u0442\u043A\u043E\u0432",
    description: lang === "en" ? "Trades right after a streak of two or more losses in a row look noticeably different from your usual result." : "\u0421\u0434\u0435\u043B\u043A\u0438 \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0441\u0435\u0440\u0438\u0438 \u0438\u0437 \u0434\u0432\u0443\u0445 \u0438 \u0431\u043E\u043B\u0435\u0435 \u0443\u0431\u044B\u0442\u043A\u043E\u0432 \u043F\u043E\u0434\u0440\u044F\u0434 \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043E\u0442\u043B\u0438\u0447\u0430\u044E\u0442\u0441\u044F \u043E\u0442 \u043E\u0431\u044B\u0447\u043D\u044B\u0445 \u043F\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0443.",
    group: afterStreak,
    rest: normal.length ? normal : allSorted.filter((t) => !afterStreak.includes(t)),
    minDiffR: 0.15
  };
}
function pd_riskAfterWin(allSorted, lang = "ru") {
  const group = [], rest = [];
  for (let i = 1; i < allSorted.length; i++) {
    if (allSorted[i - 1].outcome === "Win" && hasRealizedRR(allSorted[i - 1]) && hasRealizedRR(allSorted[i])) {
      const grew = Math.abs(allSorted[i].realizedRR) > Math.abs(allSorted[i - 1].realizedRR) * 1.3;
      if (grew) group.push(allSorted[i]);
      else rest.push(allSorted[i]);
    }
  }
  if (group.length < PATTERN_MIN_GROUP) return null;
  return {
    id: "risk_after_win",
    title: lang === "en" ? "Risk growth after a win" : "\u0420\u043E\u0441\u0442 \u0440\u0438\u0441\u043A\u0430 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0431\u0435\u0434\u044B",
    description: lang === "en" ? "After a winning trade, the size of your next trade in R noticeably grows \u2014 and the result of those trades is worse." : "\u041F\u043E\u0441\u043B\u0435 \u0432\u044B\u0438\u0433\u0440\u044B\u0448\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0440\u0430\u0437\u043C\u0435\u0440 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E R \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0432\u044B\u0440\u0430\u0441\u0442\u0430\u0435\u0442 \u2014 \u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0442\u0430\u043A\u0438\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u0445\u0443\u0436\u0435.",
    group,
    rest: rest.length ? rest : allSorted,
    minDiffR: 0.15
  };
}
function pd_avoidLossReview(all, lang = "ru") {
  const wins = all.filter((t) => t.outcome === "Win");
  const losses = all.filter((t) => t.outcome === "Loss");
  if (losses.length < PATTERN_MIN_GROUP || wins.length < 3) return null;
  const winShotRate = wins.filter((t) => Array.isArray(t.screenshots) && t.screenshots.length > 0).length / wins.length;
  const lossShotRate = losses.filter((t) => Array.isArray(t.screenshots) && t.screenshots.length > 0).length / losses.length;
  if (winShotRate - lossShotRate < 0.25) return null;
  return {
    id: "avoid_loss_review",
    title: lang === "en" ? "Avoiding loss review" : "\u0418\u0437\u0431\u0435\u0433\u0430\u043D\u0438\u0435 \u0440\u0430\u0437\u0431\u043E\u0440\u0430 \u0443\u0431\u044B\u0442\u043A\u043E\u0432",
    description: lang === "en" ? `Winning trades with a screenshot: ${Math.round(winShotRate * 100)}%. Losing trades: ${Math.round(lossShotRate * 100)}%. You visually review losing trades noticeably less often.` : `\u041F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0441\u043E \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u043E\u043C: ${Math.round(winShotRate * 100)}%. \u0423\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435: ${Math.round(lossShotRate * 100)}%. \u0422\u044B \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0440\u0435\u0436\u0435 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0435\u0448\u044C \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0432\u0438\u0437\u0443\u0430\u043B\u044C\u043D\u043E.`,
    group: losses,
    rest: wins,
    skipDiffCheck: true
    // this pattern's evidence is the screenshot rate, not avgR — always show if the gap is real
  };
}
function pd_shallowReflection(all, lang = "ru") {
  const losses = all.filter((t) => t.outcome === "Loss");
  if (losses.length < PATTERN_MIN_GROUP) return null;
  const isShallow = (t) => {
    const text = (t.lesson || "").trim();
    if (!text || text === "\u2014") return true;
    const words = text.split(/\s+/).filter(Boolean);
    return words.length <= 3 || text.length < 15;
  };
  const shallow = losses.filter(isShallow);
  if (shallow.length / losses.length < 0.5) return null;
  const rest = all.filter((t) => !shallow.includes(t));
  return {
    id: "shallow_reflection",
    title: lang === "en" ? "Shallow reflection" : "\u041F\u043E\u0432\u0435\u0440\u0445\u043D\u043E\u0441\u0442\u043D\u0430\u044F \u0440\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u044F",
    description: lang === "en" ? `${shallow.length} of ${losses.length} losing trades are described without a real takeaway \u2014 briefly or not at all.` : `${shallow.length} \u0438\u0437 ${losses.length} \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u043E\u043F\u0438\u0441\u0430\u043D\u044B \u0431\u0435\u0437 \u0440\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u043E\u0433\u043E \u0432\u044B\u0432\u043E\u0434\u0430 \u2014 \u043A\u043E\u0440\u043E\u0442\u043A\u043E \u0438\u043B\u0438 \u0432\u043E\u043E\u0431\u0449\u0435 \u0431\u0435\u0437 \u043D\u0435\u0433\u043E.`,
    group: shallow,
    rest: rest.length ? rest : losses,
    minDiffR: 0.1
  };
}
function pd_earlyExit(all, lang = "ru") {
  const candidates = all.filter(
    (t) => t.closeType === "manual" && typeof t.realizedRR === "number" && !isNaN(t.realizedRR) && typeof t.plannedRR === "number" && t.plannedRR > 0 && t.realizedRR > 0
  );
  if (candidates.length < 3) return null;
  const early = candidates.filter((t) => t.realizedRR < t.plannedRR * 0.7);
  if (early.length < 3) return null;
  const rest = all.filter((t) => !early.includes(t));
  const avgPlanned = st_mean(early.map((t) => t.plannedRR));
  const avgRealized = st_mean(early.map((t) => t.realizedRR));
  return {
    id: "early_exit",
    title: lang === "en" ? "Closing before target" : "\u0417\u0430\u043A\u0440\u044B\u0442\u0438\u0435 \u0434\u043E \u0446\u0435\u043B\u0438",
    description: lang === "en" ? `In your manual closes, you often exit before the planned Take Profit \u2014 in the last cases the average plan was ${avgPlanned.toFixed(1)}R, the average actual exit was ${avgRealized.toFixed(1)}R. Worth checking whether this is a deliberate plan change or a repeating early exit.` : `\u0412 \u0442\u0432\u043E\u0438\u0445 \u0440\u0443\u0447\u043D\u044B\u0445 \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u044F\u0445 \u0447\u0430\u0441\u0442\u043E \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044F \u0432\u044B\u0445\u043E\u0434 \u0434\u043E \u0437\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0433\u043E Take Profit \u2014 \u0432 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 \u0441\u043B\u0443\u0447\u0430\u044F\u0445 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u043F\u043B\u0430\u043D \u0431\u044B\u043B ${avgPlanned.toFixed(1)}R, \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0432\u044B\u0445\u043E\u0434 \u2014 ${avgRealized.toFixed(1)}R. \u0421\u0442\u043E\u0438\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C, \u044D\u0442\u043E \u043E\u0441\u043E\u0437\u043D\u0430\u043D\u043D\u0430\u044F \u0441\u043C\u0435\u043D\u0430 \u043F\u043B\u0430\u043D\u0430 \u0438\u043B\u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0439\u0441\u044F \u0440\u0430\u043D\u043D\u0438\u0439 \u0432\u044B\u0445\u043E\u0434.`,
    group: early,
    rest: rest.length ? rest : candidates,
    minDiffR: 0.1,
    sampleNorm: 8
  };
}
export function analyzeTraderPatterns(trades, lang = "ru") {
  const all = (trades || []).filter((t) => t && t.date instanceof Date && !isNaN(t.date.getTime()));
  const complete = all.filter(pe_isEmotionallyComplete);
  if (complete.length < PATTERN_MIN_SAMPLE) {
    return { available: false, sampleSize: complete.length, needed: PATTERN_MIN_SAMPLE };
  }
  const sorted = [...all].sort((a, b) => a.date - b.date);
  const raw = [
    pd_confidenceTension(complete, lang),
    pd_fear(complete, lang),
    pd_tooCalm(complete, lang),
    pd_revenge(sorted, lang),
    pd_lessonNotLearned(all, lang),
    pd_unstableRisk(all, lang),
    pd_overtrading(all, lang),
    pd_lossStreak(sorted, lang),
    pd_riskAfterWin(sorted, lang),
    pd_avoidLossReview(all, lang),
    pd_shallowReflection(all, lang),
    pd_earlyExit(all, lang)
  ].filter(Boolean);
  const scored = [];
  const healthy = [];
  for (const c of raw) {
    const result = c.skipDiffCheck ? (() => {
      const gStats = pe_summarize(c.group), rStats = pe_summarize(c.rest);
      const rrGroup = entriesWithRealizedRR(c.group);
      const uniqueDays = new Set(rrGroup.map((t) => t.date.toDateString())).size;
      const sampleConfidence = Math.min(1, rrGroup.length / 25);
      const recurrence = Math.min(1, uniqueDays / 8);
      const score = 0.5 * sampleConfidence * recurrence + 0.25;
      return { gStats, rStats, diff: (gStats.avgR ?? 0) - (rStats.avgR ?? 0), uniqueDays, score, confidenceLabel: score >= 0.4 ? "medium" : "low" };
    })() : pe_scoreCandidate(c.group, c.rest, { minDiffR: c.minDiffR, sampleNorm: c.sampleNorm });
    if (!result) continue;
    const entry = {
      id: c.id,
      title: c.title,
      description: result.diff < 0 || c.skipDiffCheck ? c.description : c.healthyDescriptionFull || c.healthyDescription || c.description,
      confidence: result.confidenceLabel,
      confidenceScore: Math.round(result.score * 100) / 100,
      stats: { ...result.gStats, _trades: c.group },
      comparisonStats: { ...result.rStats, _trades: c.rest },
      diff: Math.round(result.diff * 100) / 100,
      sampleTrades: pe_pickExamples(c.group, 3),
      evidenceCount: c.group.length
    };
    if (!c.skipDiffCheck && result.diff > 0 && c.healthyDescription) {
      healthy.push({ ...entry, title: c.healthyTitle || (lang === "en" ? `${c.title} (strength)` : `${c.title} (\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)`) });
    } else if (result.score >= PATTERN_SCORE_FLOOR) {
      scored.push(entry);
    }
  }
  scored.sort((a, b) => b.confidenceScore - a.confidenceScore);
  return {
    available: true,
    sampleSize: complete.length,
    primaryPattern: scored[0] || null,
    secondaryPatterns: scored.slice(1, 4),
    healthyPatterns: healthy
  };
}
var PATTERN_TYPE_MAP = {
  confidence_tension: "emotional",
  fear: "emotional",
  too_calm: "emotional",
  revenge: "behavioral",
  overtrading: "behavioral",
  loss_streak: "behavioral",
  unstable_risk: "risk",
  risk_after_win: "risk",
  lesson_not_learned: "reflection",
  avoid_loss_review: "reflection",
  shallow_reflection: "reflection",
  early_exit: "behavioral"
};
var PATTERN_RECOMMENDATIONS = {
  confidence_tension: "\u041F\u0435\u0440\u0435\u0434 \u0432\u0445\u043E\u0434\u043E\u043C \u0432 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \xAB\u0443\u0432\u0435\u0440\u0435\u043D, \u043D\u043E \u043D\u0430 \u0432\u0437\u0432\u043E\u0434\u0435\xBB \u2014 \u043E\u0434\u043D\u0430 \u043F\u0430\u0443\u0437\u0430 \u0432 60 \u0441\u0435\u043A\u0443\u043D\u0434 \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430, \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u043B\u0438 \u0441\u0434\u0435\u043B\u043A\u0430 \u0441 \u043F\u043B\u0430\u043D\u043E\u043C, \u0430 \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0441 \u043C\u043E\u043C\u0435\u043D\u0442\u043E\u043C.",
  fear: "\u041F\u0440\u0435\u0436\u0434\u0435 \u0447\u0435\u043C \u043D\u0430\u0436\u0430\u0442\u044C \xAB\u0432 \u0441\u0434\u0435\u043B\u043A\u0443\xBB, \u0441\u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u0443\u0439 \u043F\u0440\u0438\u0447\u0438\u043D\u0443 \u0432\u0445\u043E\u0434\u0430 \u043E\u0434\u043D\u0438\u043C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u043C. \u0415\u0441\u043B\u0438 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u043F\u0440\u0438\u0447\u0438\u043D\u0430 \u2014 \xAB\u0430 \u0432\u0434\u0440\u0443\u0433 \u0443\u0435\u0434\u0443 \u0431\u0435\u0437 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F\xBB, \u044D\u0442\u043E \u0441\u0442\u0440\u0430\u0445, \u0430 \u043D\u0435 \u043F\u043B\u0430\u043D.",
  too_calm: "\u0412 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \u0441\u0438\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u044F \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E \u043F\u0435\u0440\u0435\u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0439 \u0440\u0438\u0441\u043A \u2014 \xAB\u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E\xBB \u0438\u043D\u043E\u0433\u0434\u0430 \u0437\u043D\u0430\u0447\u0438\u0442 \xAB\u043D\u0435 \u0441\u043B\u0435\u0436\u0443\xBB, \u0430 \u043D\u0435 \xAB\u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u0443\u044E\xBB.",
  revenge: "\u0412\u0432\u0435\u0434\u0438 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u0443\u044E \u043F\u0430\u0443\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u2014 \u043C\u0438\u043D\u0438\u043C\u0443\u043C 20\u201330 \u043C\u0438\u043D\u0443\u0442 \u0431\u0435\u0437 \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B\u0430.",
  lesson_not_learned: "\u041F\u0435\u0440\u0435\u043F\u0438\u0448\u0438 \u0443\u0440\u043E\u043A \u0432 \u0444\u043E\u0440\u043C\u0430\u0442 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0433\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F, \u0430 \u043D\u0435 \u043D\u0430\u0431\u043B\u044E\u0434\u0435\u043D\u0438\u044F \u2014 \u043D\u0435 \xAB\u043D\u0435 \u0442\u043E\u0440\u043E\u043F\u0438\u0442\u044C\u0441\u044F\xBB, \u0430 \xAB\u0436\u0434\u0430\u0442\u044C \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u044F \u0441\u0432\u0435\u0447\u0438 \u043F\u0435\u0440\u0435\u0434 \u0432\u0445\u043E\u0434\u043E\u043C\xBB.",
  unstable_risk: "\u0417\u0430\u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0439 \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u044B\u0439 % \u0440\u0438\u0441\u043A\u0430 \u043D\u0430 \u0441\u0434\u0435\u043B\u043A\u0443 \u0438 \u0434\u0435\u0440\u0436\u0438\u0441\u044C \u0435\u0433\u043E \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u0438 \u0432 \u043C\u043E\u043C\u0435\u043D\u0442\u0435.",
  overtrading: "\u0417\u0430\u0440\u0430\u043D\u0435\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438 \u043B\u0438\u043C\u0438\u0442 \u0441\u0434\u0435\u043B\u043E\u043A \u043D\u0430 \u0434\u0435\u043D\u044C \u0438 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u0438 \u043E\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0439\u0441\u044F \u043F\u0440\u0438 \u0435\u0433\u043E \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0438.",
  loss_streak: "\u041F\u043E\u0441\u043B\u0435 \u0432\u0442\u043E\u0440\u043E\u0439 \u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u0434\u0440\u044F\u0434 \u2014 \u0441\u0438\u0433\u043D\u0430\u043B \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u043F\u0430\u0443\u0437\u0443 \u0438 \u0440\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C\u0441\u044F, \u0430 \u043D\u0435 \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0442\u044C \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C.",
  risk_after_win: "\u041F\u043E\u0431\u0435\u0434\u0430 \u043D\u0435 \u0434\u0435\u043B\u0430\u0435\u0442 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0441\u0435\u0442\u0430\u043F \u0431\u043E\u043B\u0435\u0435 \u0432\u0435\u0440\u043D\u044B\u043C \u2014 \u0434\u0435\u0440\u0436\u0438 \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0438\u0441\u043A\u0430 \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u044B\u043C \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0435\u0433\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430.",
  avoid_loss_review: "\u0412\u043E\u0437\u044C\u043C\u0438 \u0437\u0430 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0443 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0442\u044C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442 \u0438\u043C\u0435\u043D\u043D\u043E \u0442\u0435\u0445 \u0441\u0434\u0435\u043B\u043E\u043A, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043D\u0435 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u043F\u0435\u0440\u0435\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u0442\u044C \u2014 \u044D\u0442\u043E \u0441\u0430\u043C\u044B\u0439 \u043F\u043E\u043B\u0435\u0437\u043D\u044B\u0439 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435.",
  shallow_reflection: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438 \u043F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0444\u0440\u0430\u0437\u0443 \xAB\u0412 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437 \u044F \u0441\u0434\u0435\u043B\u0430\u044E \u0438\u043D\u0430\u0447\u0435, \u0435\u0441\u043B\u0438...\xBB \u0438 \u0434\u043E\u043F\u0438\u0448\u0438 \u0435\u0451 \u0447\u0435\u0441\u0442\u043D\u043E.",
  early_exit: "\u041F\u0435\u0440\u0435\u0434 \u0440\u0443\u0447\u043D\u044B\u043C \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u0435\u043C \u0441\u043F\u0440\u043E\u0441\u0438 \u0441\u0435\u0431\u044F: \u044D\u0442\u043E \u043E\u0441\u043E\u0437\u043D\u0430\u043D\u043D\u0430\u044F \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u043A\u0430 \u043F\u043B\u0430\u043D\u0430 \u0438\u043B\u0438 \u0440\u0435\u0444\u043B\u0435\u043A\u0441 \u043D\u0430 \u0442\u0440\u0435\u0432\u043E\u0433\u0443? \u0415\u0441\u043B\u0438 \u043E\u0442\u0432\u0435\u0442 \u043D\u0435 \u043E\u0447\u0435\u0432\u0438\u0434\u0435\u043D \u2014 \u0434\u0430\u0439 \u0441\u0434\u0435\u043B\u043A\u0435 \u0447\u0443\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0434\u043E \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u044F."
};
var PATTERN_RECOMMENDATIONS_EN = {
  confidence_tension: 'Before entering while feeling "confident but on edge" \u2014 take a 60-second pause and check the trade against your plan, not just against the moment.',
  fear: `Before you hit "enter," state your reason for the trade in one sentence. If the only reason is "what if it moves without me," that's fear, not a plan.`,
  too_calm: 'In a state of strong calm, double-check your risk separately \u2014 "calm" can sometimes mean "not watching," not "in control."',
  revenge: "Set a mandatory pause after a loss \u2014 at least 20-30 minutes away from the terminal.",
  lesson_not_learned: `Rewrite the lesson as a specific action, not an observation \u2014 not "don't rush," but "wait for the candle to close before entering."`,
  unstable_risk: "Fix a constant % risk per trade and stick to it regardless of how confident you feel in the moment.",
  overtrading: "Set a daily trade limit in advance and physically stop once you hit it.",
  loss_streak: "After the second loss in a row \u2014 that's a signal to pause and figure out why, not to trade more.",
  risk_after_win: "A win doesn't make the next setup any more valid \u2014 keep your risk size constant regardless of the previous result.",
  avoid_loss_review: "Make a habit of saving a screenshot of exactly the trades you don't want to revisit \u2014 that's the most useful material in the journal.",
  shallow_reflection: `After a loss, finish the sentence "Next time I'll do it differently if..." and write it honestly.`,
  early_exit: "Before closing manually, ask yourself: is this a deliberate plan change or anxiety talking? If unsure, give the trade a bit more time before closing."
};
function ta_severity(score, diff) {
  const mag = Math.abs(diff ?? 0);
  if (score >= 0.55 && mag >= 0.4) return "high";
  if (score >= 0.35) return "medium";
  return "low";
}
function ta_buildPatternRecord(c, result, isHealthy, lang = "ru") {
  const recs = lang === "en" ? PATTERN_RECOMMENDATIONS_EN : PATTERN_RECOMMENDATIONS;
  return {
    id: c.id,
    type: PATTERN_TYPE_MAP[c.id] || "behavioral",
    severity: isHealthy ? "info" : ta_severity(result.score, result.diff),
    confidence: result.confidenceLabel,
    sampleSize: c.group.length,
    title: isHealthy ? c.healthyTitle || (lang === "en" ? `${c.title} (strength)` : `${c.title} (\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)`) : c.title,
    description: isHealthy ? c.healthyDescriptionFull || c.healthyDescription || c.description : c.description,
    evidence: pe_pickExamples(c.group, 3).map((t) => ({ id: t.id, date: t.date, outcome: t.outcome, realizedRR: hasRealizedRR(t) ? t.realizedRR : null, instrument: t.instrument, tag: t.tag })),
    metrics: { group: result.gStats, rest: result.rStats, diff: st_round2(result.diff), uniqueDays: result.uniqueDays, confidenceScore: st_round2(result.score) },
    recommendation: isHealthy ? null : recs[c.id] || null
  };
}
export function patternEngineV2(trades, lang = "ru") {
  const all = (trades || []).filter((t) => t && t.date instanceof Date && !isNaN(t.date.getTime()));
  const complete = all.filter(pe_isEmotionallyComplete);
  if (complete.length < PATTERN_MIN_SAMPLE) {
    return { available: false, sampleSize: complete.length, needed: PATTERN_MIN_SAMPLE, patterns: [], healthyPatterns: [] };
  }
  const sorted = [...all].sort((a, b) => a.date - b.date);
  const raw = [
    pd_confidenceTension(complete, lang),
    pd_fear(complete, lang),
    pd_tooCalm(complete, lang),
    pd_revenge(sorted, lang),
    pd_lessonNotLearned(all, lang),
    pd_unstableRisk(all, lang),
    pd_overtrading(all, lang),
    pd_lossStreak(sorted, lang),
    pd_riskAfterWin(sorted, lang),
    pd_avoidLossReview(all, lang),
    pd_shallowReflection(all, lang),
    pd_earlyExit(all, lang)
  ].filter(Boolean);
  const patterns = [], healthy = [];
  for (const c of raw) {
    const result = c.skipDiffCheck ? (() => {
      const gStats = pe_summarize(c.group), rStats = pe_summarize(c.rest);
      const rrGroup = entriesWithRealizedRR(c.group);
      const uniqueDays = new Set(rrGroup.map((t) => t.date.toDateString())).size;
      const sampleConfidence = Math.min(1, rrGroup.length / 25);
      const recurrence = Math.min(1, uniqueDays / 8);
      const score = 0.5 * sampleConfidence * recurrence + 0.25;
      return { gStats, rStats, diff: (gStats.avgR ?? 0) - (rStats.avgR ?? 0), uniqueDays, score, confidenceLabel: score >= 0.4 ? "medium" : "low" };
    })() : pe_scoreCandidate(c.group, c.rest, { minDiffR: c.minDiffR, sampleNorm: c.sampleNorm });
    if (!result) continue;
    if (!c.skipDiffCheck && result.diff > 0 && c.healthyDescription) {
      healthy.push(ta_buildPatternRecord(c, result, true, lang));
    } else if (result.score >= PATTERN_SCORE_FLOOR) {
      patterns.push(ta_buildPatternRecord(c, result, false, lang));
    }
  }
  patterns.sort((a, b) => b.metrics.confidenceScore - a.metrics.confidenceScore);
  return { available: true, sampleSize: complete.length, patterns, healthyPatterns: healthy };
}
function rrWinRateInsightText(rr, lang = "ru") {
  if (!rr || rr.sampleSize < PATTERN_MIN_SAMPLE || rr.avgRealizedRR == null || rr.winRate == null || rr.expectancy == null) return null;
  if (rr.expectancy < 0) {
    return lang === "en" ? `Your journal currently shows a combination of an average realized RR of ${rr.avgRealizedRR}R and a ${rr.winRate}% win rate \u2014 based on these numbers the expectancy is negative. Worth checking whether this holds up on a larger sample or reflects a specific stretch.` : `\u0412 \u0442\u0432\u043E\u0451\u043C \u0436\u0443\u0440\u043D\u0430\u043B\u0435 \u0441\u0435\u0439\u0447\u0430\u0441 \u0441\u043E\u0447\u0435\u0442\u0430\u043D\u0438\u0435 \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E realized RR \u2248 ${rr.avgRealizedRR}R \u0438 Win Rate ${rr.winRate}% \u2014 \u043F\u0440\u0438 \u0442\u0430\u043A\u0438\u0445 \u0446\u0438\u0444\u0440\u0430\u0445 \u043C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u043E\u0442\u0440\u0438\u0446\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435. \u0421\u0442\u043E\u0438\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C, \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u043B\u0438 \u044D\u0442\u043E \u043D\u0430 \u0431\u043E\u043B\u044C\u0448\u0435\u0439 \u0432\u044B\u0431\u043E\u0440\u043A\u0435 \u0438\u043B\u0438 \u044D\u0442\u043E \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0440\u0435\u0437\u043E\u043A.`;
  }
  if (rr.avgRealizedRR < 1.3 && rr.winRate < 50 && rr.expectancy < 0.15) {
    return lang === "en" ? `Average realized RR (\u2248${rr.avgRealizedRR}R) and win rate (${rr.winRate}%) currently sit in a zone where the result depends heavily on win frequency. Worth checking whether your system has a stable statistical edge.` : `\u0421\u0440\u0435\u0434\u043D\u0438\u0439 realized RR (\u2248${rr.avgRealizedRR}R) \u0438 Win Rate (${rr.winRate}%) \u0441\u0435\u0439\u0447\u0430\u0441 \u043D\u0430\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432 \u0437\u043E\u043D\u0435, \u0433\u0434\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0441\u0438\u043B\u044C\u043D\u043E \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0447\u0430\u0441\u0442\u043E\u0442\u044B \u043F\u0440\u0438\u0431\u044B\u043B\u044C\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A. \u0421\u0442\u043E\u0438\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C, \u0435\u0441\u0442\u044C \u043B\u0438 \u0443 \u0442\u0432\u043E\u0435\u0439 \u0441\u0438\u0441\u0442\u0435\u043C\u044B \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0435 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u043E.`;
  }
  return null;
}
function buildInsights(patternsResult, calibration, discipline, lang = "ru", rrStats = null) {
  const insights = [];
  (patternsResult.patterns || []).slice(0, 3).forEach((p) => {
    insights.push({ id: `pattern_${p.id}`, basis: "pattern", confidence: p.confidence, sampleSize: p.sampleSize, text: p.description });
  });
  if (calibration.available && calibration.divergenceNote) {
    insights.push({ id: "calibration_divergence", basis: "calibration", confidence: calibration.confidence, sampleSize: calibration.dayTradeCount, text: calibration.divergenceNote });
  }
  if (discipline.violations && discipline.violations.length) {
    const top = discipline.violations[0];
    const text = lang === "en" ? {
      revenge_rate: `You re-enter a new trade within half an hour of a loss about ${top.value}% of the time.`,
      overtrading_days: `About ${top.value}% of your trades fall on days with abnormally high activity.`,
      risk_after_loss: `After a loss, your average risk increases by about ${top.value}%.`,
      risk_after_win: `After a win, your average risk increases by about ${top.value}%.`
    }[top.id] : {
      revenge_rate: `\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0442\u044B \u0432\u0445\u043E\u0434\u0438\u0448\u044C \u0432 \u043D\u043E\u0432\u0443\u044E \u0441\u0434\u0435\u043B\u043A\u0443 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0441\u0430 \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u0432 ${top.value}% \u0441\u043B\u0443\u0447\u0430\u0435\u0432.`,
      overtrading_days: `\u041F\u0440\u0438\u043C\u0435\u0440\u043D\u043E ${top.value}% \u0442\u0432\u043E\u0438\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u043D\u0430 \u0434\u043D\u0438 \u0441 \u0430\u043D\u043E\u043C\u0430\u043B\u044C\u043D\u043E \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C\u044E.`,
      risk_after_loss: `\u041F\u043E\u0441\u043B\u0435 \u0443\u0431\u044B\u0442\u043A\u0430 \u0442\u0432\u043E\u0439 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0438\u0441\u043A \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u043D\u0430 ${top.value}%.`,
      risk_after_win: `\u041F\u043E\u0441\u043B\u0435 \u043F\u043E\u0431\u0435\u0434\u044B \u0442\u0432\u043E\u0439 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0438\u0441\u043A \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u043D\u0430 ${top.value}%.`
    }[top.id];
    if (text) insights.push({ id: `discipline_${top.id}`, basis: "discipline", confidence: discipline.score.confidence, sampleSize: discipline.score.sampleSize, text });
  }
  const rrText = rrWinRateInsightText(rrStats, lang);
  if (rrText) insights.push({ id: "rr_winrate", basis: "rr_winrate", confidence: rrStats.sampleSize >= PATTERN_MIN_SAMPLE * 1.5 ? "medium" : "low", sampleSize: rrStats.sampleSize, text: rrText });
  return insights;
}
export function calculateTraderAnalytics(entries, lastCalibration, lang = "ru") {
  const validEntries = (entries || []).filter((e) => e && e.date instanceof Date && !isNaN(e.date.getTime()));
  const closedEntries = validEntries.filter(isEntryClosed);
  const sorted = [...closedEntries].sort((a, b) => a.date - b.date);
  const seq = sequenceAnalysis(sorted);
  const risk = riskAnalysis(sorted);
  const reflection = reflectionAnalysis(validEntries);
  const discipline = disciplineAnalysis(sorted, seq, risk);
  const emotional = emotionalAnalysis(validEntries);
  const emotionalShift = emotionalShiftAnalysis(closedEntries);
  const awareness = awarenessAnalysis(validEntries, closedEntries, reflection, risk, discipline);
  const patternsResult = patternEngineV2(closedEntries, lang);
  const calibration = calibrationAnalysis(sorted, lastCalibration, lang);
  const rrStats = computeRRWinRateStats(closedEntries);
  const { recent, previous } = ta_splitRecent(sorted);
  let trend = { awareness: "insufficient_data", discipline: "insufficient_data", riskStability: "insufficient_data", reflectionQuality: "insufficient_data" };
  if (recent.length >= 5 && previous.length >= 5) {
    const rRisk = riskAnalysis(recent), pRisk = riskAnalysis(previous);
    const rReflection = reflectionAnalysis(recent), pReflection = reflectionAnalysis(previous);
    const rDiscipline = disciplineAnalysis(recent, sequenceAnalysis(recent), rRisk);
    const pDiscipline = disciplineAnalysis(previous, sequenceAnalysis(previous), pRisk);
    const rAwareness = awarenessAnalysis(recent, recent, rReflection, rRisk, rDiscipline);
    const pAwareness = awarenessAnalysis(previous, previous, pReflection, pRisk, pDiscipline);
    trend = {
      // rawScore, not score: both windows hold only TA_TREND_WINDOW trades, so their evidence ramp
      // is identical and tiny — comparing ramped values would report "stable" forever.
      awareness: ta_trend(rAwareness.rawScore, pAwareness.rawScore, 3, true),
      discipline: ta_trend(rDiscipline.score.value, pDiscipline.score.value, 3, true),
      riskStability: ta_trend(rRisk.stability.value, pRisk.stability.value, 3, true),
      reflectionQuality: ta_trend(rReflection.score.value, pReflection.score.value, 3, true)
    };
  }
  const dataQuality = {
    totalTrades: validEntries.length,
    completeTrades: validEntries.filter(pe_isEmotionallyComplete).length,
    missingEmotion: validEntries.filter((e) => e.x == null || e.y == null).length,
    missingExitEmotion: closedEntries.filter((e) => e.exitX == null || e.exitY == null).length,
    missingReflection: validEntries.filter((e) => (!e.pull || e.pull === "\u2014") && (!e.lesson || e.lesson === "\u2014")).length,
    missingRisk: closedEntries.filter((e) => !hasRealizedRR(e)).length,
    missingScreenshots: validEntries.filter((e) => !Array.isArray(e.screenshots) || e.screenshots.length === 0).length
  };
  const insights = buildInsights(patternsResult, calibration, discipline, lang, rrStats);
  return {
    awareness: { ...awareness, trend: trend.awareness },
    emotionalState: emotional,
    emotionalShift,
    discipline: { ...discipline, trend: trend.discipline },
    risk: { ...risk, stability: { ...risk.stability, trend: trend.riskStability } },
    execution: { score: discipline.score, consistency: risk.stability, confidence: discipline.score.confidence },
    reflection: { ...reflection, trend: trend.reflectionQuality },
    calibration,
    rrStats,
    patterns: patternsResult.patterns,
    healthyPatterns: patternsResult.healthyPatterns,
    insights,
    dataQuality
  };
}

// Trader level is behavioral and sample-capped; no PnL inputs.
var TRADER_LEVEL_WEIGHTS = {
  awareness: 0.22,
  discipline: 0.2,
  riskStability: 0.16,
  reflection: 0.16,
  journalCompleteness: 0.14,
  planAdherence: 0.12
};
function tl_journalCompleteness(closedEntries) {
  if (!closedEntries.length) return null;
  const scored = closedEntries.map((e) => {
    let f = 0;
    if (e.x != null && e.y != null) f++;
    if (e.pull && e.pull !== "\u2014") f++;
    if (e.lesson && e.lesson !== "\u2014") f++;
    if (typeof e.r === "number" && !isNaN(e.r)) f++;
    if (typeof e.plannedRR === "number" && !isNaN(e.plannedRR)) f++;
    return f / 5 * 100;
  });
  return st_mean(scored);
}
// "Did the trader execute their own plan?" — measured only on trades that actually HAVE a plan
// (entry/SL/TP were filled in), so trades journalled without a plan neither help nor hurt.
function tl_planAdherence(closedEntries) {
  const planned = closedEntries.filter((e) => typeof e.plannedRR === "number" && e.plannedRR > 0 && typeof e.realizedRR === "number" && !isNaN(e.realizedRR));
  if (planned.length < 3) return null;
  const captures = planned.map((e) => {
    if (e.realizedRR <= -1.05) return 0;
    return Math.max(0, Math.min(1, e.realizedRR / e.plannedRR));
  });
  const respectedSL = closedEntries.filter((e) => e.closeType === "sl" || typeof e.realizedRR !== "number" || e.realizedRR >= -1.05).length / closedEntries.length;
  return Math.max(0, Math.min(100, (st_mean(captures) * 0.6 + respectedSL * 0.4) * 100));
}
export function calculateTraderLevel(entries, analytics) {
  const list = Array.isArray(entries) ? entries : [];
  const closed = list.filter(isEntryClosed);
  const closedN = closed.length;
  if (closedN === 0) return 1;
  // Experience gate: no amount of good behaviour can push the level past what the sample supports.
  const cap = Math.min(9, 1 + Math.floor(closedN / 5));
  const parts = {
    awareness: analytics?.awareness?.score?.value ?? null,
    discipline: analytics?.discipline?.score?.value ?? null,
    riskStability: analytics?.risk?.stability?.value ?? null,
    reflection: analytics?.reflection?.score?.value ?? null,
    journalCompleteness: tl_journalCompleteness(closed),
    planAdherence: tl_planAdherence(closed)
  };
  let sum = 0, wsum = 0;
  Object.entries(TRADER_LEVEL_WEIGHTS).forEach(([k, w]) => {
    if (parts[k] == null || isNaN(parts[k])) return;
    sum += parts[k] * w;
    wsum += w;
  });
  if (wsum <= 0) return 1;
  const quality = Math.max(0, Math.min(100, sum / wsum));
  const earned = 1 + Math.round(quality / 100 * 8);
  return Math.max(1, Math.min(cap, earned));
}
