// MIND.EXE — Decision Lab analytics engine v1.
// Correlational only: it describes the user's historical decision process, never market causality.

import { normalizeDecisionSession } from "./decision-model.js";
import { decisionFactorLabel, DECISION_EMOTION_LABELS } from "./decision-factor-taxonomy.js";

const finite = (v) => typeof v === "number" && Number.isFinite(v);
const mean = (arr) => arr.length ? arr.reduce((sum, v) => sum + v, 0) / arr.length : null;
const round = (v, digits = 2) => finite(v) ? Number(v.toFixed(digits)) : null;

export function decisionSampleStrength(n) {
  const count = Math.max(0, Number(n) || 0);
  if (count < 5) return "insufficient";
  if (count < 10) return "low";
  if (count < 20) return "preliminary";
  return "stable";
}

export function decisionTradeResultR(trade) {
  if (!trade || trade.status !== "closed") return null;
  if (finite(trade.realizedRR)) return trade.realizedRR;
  if (trade.resultMode === "R" && finite(trade.r)) return trade.r;
  return null;
}

function outcomeOfTrade(trade) {
  if (!trade || trade.status !== "closed") return null;
  if (trade.outcome === "Win" || trade.outcome === "Loss" || trade.outcome === "Breakeven") return trade.outcome;
  if (finite(trade.r)) return trade.r > 0 ? "Win" : trade.r < 0 ? "Loss" : "Breakeven";
  return null;
}

function makePerformance(rows) {
  const closed = rows.filter((row) => row.outcome);
  const wins = closed.filter((row) => row.outcome === "Win").length;
  const losses = closed.filter((row) => row.outcome === "Loss").length;
  const breakevens = closed.filter((row) => row.outcome === "Breakeven").length;
  const rValues = closed.map((row) => row.r).filter(finite);
  return {
    sample: closed.length,
    strength: decisionSampleStrength(closed.length),
    wins,
    losses,
    breakevens,
    winRate: closed.length ? round(wins / closed.length * 100, 1) : null,
    averageR: rValues.length ? round(mean(rValues), 2) : null,
    rSample: rValues.length
  };
}

function bandForWeight(v) {
  return v >= 70 ? "high" : v >= 40 ? "medium" : "low";
}
function bandForEmotion(v) {
  return v >= 70 ? "high" : v > 30 ? "moderate" : "low";
}

export function buildDecisionAnalytics(sessions = [], trades = [], lang = "ru") {
  const tradeMap = new Map((trades || []).filter((t) => t?.id).map((t) => [String(t.id), t]));
  const normalized = (sessions || []).map(normalizeDecisionSession).filter(Boolean);
  const locked = normalized.filter((s) => ["locked", "linked", "reviewed"].includes(s.status));
  const linkedRows = [];
  const factors = new Map();

  for (const session of locked) {
    const trade = session.linkedTradeId ? tradeMap.get(String(session.linkedTradeId)) : null;
    const outcome = outcomeOfTrade(trade);
    const r = decisionTradeResultR(trade);
    if (trade && outcome) linkedRows.push({ session, trade, outcome, r });

    for (const arg of session.arguments) {
      const key = arg.factorId || "other";
      if (!factors.has(key)) {
        factors.set(key, {
          factorId: key,
          factorGroup: arg.factorGroup || "other",
          label: decisionFactorLabel(key, lang),
          argumentCount: 0,
          sessionArgs: new Map()
        });
      }
      const acc = factors.get(key);
      acc.argumentCount += 1;
      const current = acc.sessionArgs.get(session.id) || null;
      // A canonical factor may appear more than once in the same decision (for example two
      // differently worded "higher timeframe trend" thoughts). Analytics must count that trade
      // once, otherwise one decision artificially inflates sample size and win rate. Prefer the
      // decisive version, then the highest logical weight, then the stronger emotional reading.
      const candidateWeight = arg.weightRated && finite(arg.weight) ? arg.weight : -1;
      const candidateEmotion = arg.emotionRated && finite(arg.emotionIntensity) ? arg.emotionIntensity : -1;
      const currentWeight = current?.arg?.weightRated && finite(current.arg.weight) ? current.arg.weight : -1;
      const currentEmotion = current?.arg?.emotionRated && finite(current.arg.emotionIntensity) ? current.arg.emotionIntensity : -1;
      const candidateRank = (Number(arg.isDecisive) * 1e6) + (candidateWeight * 1e3) + candidateEmotion;
      const currentRank = current
        ? (Number(current.arg.isDecisive) * 1e6) + (currentWeight * 1e3) + currentEmotion
        : -1;
      if (!current || candidateRank > currentRank) {
        acc.sessionArgs.set(session.id, { session, trade, outcome, r, arg });
      }
    }
  }

  const factorStats = [...factors.values()].map((acc) => {
    const reps = [...acc.sessionArgs.values()];
    const linked = reps.filter((row) => row.trade && row.outcome);
    const decisive = linked.filter((row) => row.arg.isDecisive);
    const weights = reps.filter((row) => row.arg.weightRated && finite(row.arg.weight)).map((row) => row.arg.weight);
    const emotions = reps.filter((row) => row.arg.emotionRated && finite(row.arg.emotionIntensity)).map((row) => row.arg.emotionIntensity);
    const byWeight = { low: [], medium: [], high: [] };
    const byEmotion = { low: [], moderate: [], high: [] };
    const byEmotionTag = new Map();
    const reviewWeightDeltas = [];
    const reviewEmotionDeltas = [];
    const reviewAssessments = new Map();

    for (const row of reps) {
      const reviewRow = row.session.postReview?.argumentReviews?.find((item) => item.argumentId === row.arg.id) || null;
      if (reviewRow) {
        if (row.arg.weightRated && finite(row.arg.weight) && finite(reviewRow.weightAfter)) reviewWeightDeltas.push(reviewRow.weightAfter - row.arg.weight);
        if (row.arg.emotionRated && finite(row.arg.emotionIntensity) && finite(reviewRow.emotionAfter)) reviewEmotionDeltas.push(reviewRow.emotionAfter - row.arg.emotionIntensity);
        const assessment = reviewRow.assessment || "unclear";
        reviewAssessments.set(assessment, (reviewAssessments.get(assessment) || 0) + 1);
      }
      if (!row.trade || !row.outcome) continue;
      if (row.arg.weightRated && finite(row.arg.weight)) byWeight[bandForWeight(row.arg.weight)].push(row);
      if (row.arg.emotionRated && finite(row.arg.emotionIntensity)) {
        byEmotion[bandForEmotion(row.arg.emotionIntensity)].push(row);
        const tag = row.arg.emotionTag || "none";
        if (!byEmotionTag.has(tag)) byEmotionTag.set(tag, []);
        byEmotionTag.get(tag).push(row);
      }
    }

    return {
      factorId: acc.factorId,
      factorGroup: acc.factorGroup,
      label: acc.label,
      usageCount: reps.length,
      argumentCount: acc.argumentCount,
      decisiveCount: reps.filter((row) => row.arg.isDecisive).length,
      averageWeight: round(mean(weights), 1),
      averageEmotionIntensity: round(mean(emotions), 1),
      performance: makePerformance(linked),
      decisivePerformance: makePerformance(decisive),
      weightBands: {
        low: makePerformance(byWeight.low),
        medium: makePerformance(byWeight.medium),
        high: makePerformance(byWeight.high)
      },
      emotionBands: {
        low: makePerformance(byEmotion.low),
        moderate: makePerformance(byEmotion.moderate),
        high: makePerformance(byEmotion.high)
      },
      emotionTags: [...byEmotionTag.entries()].map(([tag, rows]) => ({
        tag,
        label: DECISION_EMOTION_LABELS[tag]?.[lang] || tag,
        ...makePerformance(rows)
      })).sort((a, b) => b.sample - a.sample),
      postReview: {
        sample: Math.max(reviewWeightDeltas.length, reviewEmotionDeltas.length, [...reviewAssessments.values()].reduce((sum, n) => sum + n, 0)),
        averageWeightDelta: reviewWeightDeltas.length ? round(mean(reviewWeightDeltas), 1) : null,
        averageEmotionDelta: reviewEmotionDeltas.length ? round(mean(reviewEmotionDeltas), 1) : null,
        assessments: Object.fromEntries(reviewAssessments.entries())
      }
    };
  }).sort((a, b) => b.usageCount - a.usageCount);


  const clarityDeltas = locked
    .map((s) => s.preDecisionState.clarityBeforeRated && s.preDecisionState.clarityAfterRated &&
      finite(s.preDecisionState.clarityBefore) && finite(s.preDecisionState.clarityAfter)
      ? s.preDecisionState.clarityAfter - s.preDecisionState.clarityBefore
      : null)
    .filter(finite);
  const confidenceRows = linkedRows.filter((row) => row.session.preDecisionState.decisionConfidenceRated && finite(row.session.preDecisionState.decisionConfidence));
  const confidenceBands = { low: [], medium: [], high: [], extreme: [] };
  for (const row of confidenceRows) {
    const c = row.session.preDecisionState.decisionConfidence;
    const band = c > 90 ? "extreme" : c > 70 ? "high" : c > 40 ? "medium" : "low";
    confidenceBands[band].push(row);
  }

  return {
    sessionCount: normalized.length,
    lockedCount: locked.length,
    linkedClosedCount: linkedRows.length,
    reviewedCount: locked.filter((s) => !!s.postReview).length,
    overallPerformance: makePerformance(linkedRows),
    averageClarityDelta: clarityDeltas.length ? round(mean(clarityDeltas), 1) : null,
    confidenceBands: {
      low: makePerformance(confidenceBands.low),
      medium: makePerformance(confidenceBands.medium),
      high: makePerformance(confidenceBands.high),
      extreme: makePerformance(confidenceBands.extreme)
    },
    factors: factorStats
  };
}

export function buildDecisionInsights(analytics, lang = "ru") {
  const out = [];
  for (const factor of analytics?.factors || []) {
    const low = factor.emotionBands?.low;
    const high = factor.emotionBands?.high;
    if (low?.sample >= 5 && high?.sample >= 5) {
      const rDiff = finite(low.averageR) && finite(high.averageR) ? low.averageR - high.averageR : null;
      const wrDiff = finite(low.winRate) && finite(high.winRate) ? low.winRate - high.winRate : null;
      if ((finite(rDiff) && Math.abs(rDiff) >= 0.25) || (finite(wrDiff) && Math.abs(wrDiff) >= 15)) {
        const betterLow = finite(rDiff) ? rDiff > 0 : wrDiff > 0;
        out.push({
          type: "emotion_factor_gap",
          factorId: factor.factorId,
          sample: low.sample + high.sample,
          text: lang === "en"
            ? `${factor.label}: in your history, ${betterLow ? "low" : "high"} emotional intensity has shown better results than ${betterLow ? "high" : "low"} intensity (${low.sample} vs ${high.sample} closed trades). This is an association in your journal, not proof of causality.`
            : `${factor.label}: в твоей истории ${betterLow ? "низкая" : "высокая"} эмоциональная вовлечённость пока связана с лучшим результатом, чем ${betterLow ? "высокая" : "низкая"} (${low.sample} против ${high.sample} закрытых сделок). Это связь в журнале, а не доказательство причинности.`
        });
      }
    }
  }
  for (const factor of analytics?.factors || []) {
    const review = factor.postReview;
    if ((review?.sample || 0) >= 5 && finite(review.averageWeightDelta) && Math.abs(review.averageWeightDelta) >= 15) {
      const lowered = review.averageWeightDelta < 0;
      out.push({
        type: "post_review_weight_gap",
        factorId: factor.factorId,
        sample: review.sample,
        text: lang === "en"
          ? `${factor.label}: after the trade, you tend to ${lowered ? "lower" : "raise"} its importance by about ${Math.abs(review.averageWeightDelta).toFixed(0)} points on average (${review.sample} reviews). This describes your own re-evaluation, not whether the factor is objectively good or bad.`
          : `${factor.label}: после сделки ты в среднем ${lowered ? "снижаешь" : "повышаешь"} его значимость примерно на ${Math.abs(review.averageWeightDelta).toFixed(0)} пунктов (${review.sample} post-review). Это описывает твою переоценку, а не объективное качество фактора.`
      });
    }
  }
  return out.sort((a, b) => b.sample - a.sample).slice(0, 8);
}
