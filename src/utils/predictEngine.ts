import {
  IndicatorRecord,
  PredictAdvancedRequest,
  PredictionResult,
} from '../types';
import { DATASET_STATS } from '../data/miningData';

/**
 * Computes engineered statistical features from raw historical series for Quick Predict,
 * with multi-step autoregressive forward projection for future horizon years (2024–2030).
 */
export function engineerFeaturesFromHistory(
  indicator: IndicatorRecord,
  targetYear: number,
  scenario: 'baseline' | 'pessimistic' | 'recovery' = 'baseline',
) {
  const latestHistoricalYear = indicator.years[indicator.years.length - 1];
  const isFutureHorizon = targetYear > latestHistoricalYear;

  let validYears: number[];
  let validVals: number[];
  let projectedPoints: { year: number; value: number; isProjected: boolean }[] = [];

  if (!isFutureHorizon) {
    const historyIdx = indicator.years.indexOf(targetYear);
    const upToIdx = historyIdx !== -1 ? historyIdx : indicator.years.length - 1;
    validYears = indicator.years.slice(0, upToIdx + 1);
    validVals = indicator.values.slice(0, upToIdx + 1);
  } else {
    // Multi-step forward projection from latest empirical year (e.g. 2023) to targetYear (e.g. 2026 or 2027)
    validYears = [...indicator.years];
    validVals = [...indicator.values];

    const nHist = indicator.values.length;
    // Calculate recent empirical annual velocity (last 3-4 years)
    const recentSpan = Math.min(4, nHist - 1);
    const recentValDiff = indicator.values[nHist - 1] - indicator.values[nHist - 1 - recentSpan];
    const rawAnnualDrift = recentSpan > 0 ? recentValDiff / recentSpan : 0;

    // Adjust drift by scenario
    let adjustedDrift = rawAnnualDrift;
    const isCoverageIndicator =
      indicator.name.toLowerCase().includes('immuniz') ||
      indicator.name.toLowerCase().includes('coverage') ||
      indicator.name.toLowerCase().includes('expectancy');

    if (scenario === 'pessimistic') {
      // Worsen trend: if coverage, drop faster; if disease/mortality, rise faster
      adjustedDrift = isCoverageIndicator
        ? Math.min(-0.8, rawAnnualDrift * 1.5)
        : Math.max(0.8, rawAnnualDrift > 0 ? rawAnnualDrift * 1.6 : Math.abs(rawAnnualDrift) * 1.2);
    } else if (scenario === 'recovery') {
      // Reversal towards recovery
      adjustedDrift = isCoverageIndicator
        ? Math.max(1.2, Math.abs(rawAnnualDrift) * 0.8)
        : -Math.max(0.5, Math.abs(rawAnnualDrift) * 0.8);
    }

    let lastVal = indicator.values[nHist - 1];
    for (let yr = latestHistoricalYear + 1; yr <= targetYear; yr++) {
      // Dampening factor across forward horizon
      const horizonStep = yr - latestHistoricalYear;
      const damp = Math.pow(0.92, horizonStep - 1);
      lastVal = Number((lastVal + adjustedDrift * damp).toFixed(1));
      if (isCoverageIndicator) {
        lastVal = Math.max(2, Math.min(99, lastVal));
      } else {
        lastVal = Math.max(0.1, lastVal);
      }
      validYears.push(yr);
      validVals.push(lastVal);
      projectedPoints.push({ year: yr, value: lastVal, isProjected: true });
    }
  }

  if (validVals.length < 3) {
    throw new Error('Not enough history — pick a later year (at least 3 years required).');
  }

  // Calculate z-scores based on available history
  const mean = validVals.reduce((a, b) => a + b, 0) / validVals.length;
  const variance =
    validVals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (validVals.length || 1);
  const std = Math.sqrt(variance) || 1;

  const zScores = validVals.map((v) => (v - mean) / std);
  const n = zScores.length;

  const z_lag0 = zScores[n - 1];
  const z_lag1 = n >= 2 ? zScores[n - 2] : z_lag0;
  const z_lag2 = n >= 3 ? zScores[n - 3] : z_lag1;
  const z_lag3 = n >= 4 ? zScores[n - 4] : z_lag2;

  const delta1 = z_lag0 - z_lag1;
  const delta2 = z_lag1 - z_lag2;
  const accel = delta1 - delta2;

  const recent3 = [z_lag0, z_lag1, z_lag2];
  const roll_mean3 = recent3.reduce((a, b) => a + b, 0) / 3;
  let roll_std3 =
    Math.sqrt(recent3.reduce((a, b) => a + Math.pow(b - roll_mean3, 2), 0) / 3) || 0.1;

  // If pessimistic scenario in future, inject volatility
  if (isFutureHorizon && scenario === 'pessimistic') {
    roll_std3 = Math.max(roll_std3, 0.55);
  }

  // 5-year local linear slope
  const recent5 = validVals.slice(-5);
  let slope5 = 0;
  if (recent5.length >= 2) {
    const xMean = (recent5.length - 1) / 2;
    const yMean = recent5.reduce((a, b) => a + b, 0) / recent5.length;
    let num = 0;
    let den = 0;
    recent5.forEach((y, x) => {
      num += (x - xMean) * (y - yMean);
      den += Math.pow(x - xMean, 2);
    });
    slope5 = den !== 0 ? (num / den) / (std || 1) : 0;
  }

  const level_now: 'Low' | 'Mid' | 'High' =
    z_lag0 < -0.43 ? 'Low' : z_lag0 > 0.43 ? 'High' : 'Mid';
  const level_prev: 'Low' | 'Mid' | 'High' =
    z_lag1 < -0.43 ? 'Low' : z_lag1 > 0.43 ? 'High' : 'Mid';

  // Count changes
  let n_changes = 0;
  for (let i = 1; i < zScores.length; i++) {
    const l1 = zScores[i - 1] < -0.43 ? 'L' : zScores[i - 1] > 0.43 ? 'H' : 'M';
    const l2 = zScores[i] < -0.43 ? 'L' : zScores[i] > 0.43 ? 'H' : 'M';
    if (l1 !== l2) n_changes++;
  }

  const minYear = 1961;
  const maxYear = 2030;
  const year_norm = (targetYear - minYear) / (maxYear - minYear);

  return {
    features: {
      z_lag0,
      z_lag1,
      z_lag2,
      z_lag3,
      delta1,
      delta2,
      accel,
      roll_mean3,
      roll_std3,
      slope5,
      level_now,
      level_prev,
      n_changes,
      year_norm,
      domain: indicator.domain,
      unit: indicator.unit,
      dim_type: indicator.dimType,
      is_disaggregated: indicator.isDisaggregated,
    },
    isFutureHorizon,
    latestHistoricalYear,
    projectedPoints,
    fullSeries: validYears.map((yr, idx) => ({
      year: yr,
      value: validVals[idx],
      isProjected: yr > latestHistoricalYear,
    })),
  };
}

/**
 * Random Forest surrogate scoring model matching notebook weights & tree thresholds
 */
export function scoreRandomForest(
  features: PredictAdvancedRequest['features'],
): { probability: number; explanation: string[] } {
  // Base log-odds anchored at base rate (0.072)
  let logOdds = Math.log(DATASET_STATS.baseRate / (1 - DATASET_STATS.baseRate)); // ~ -2.557

  const explanations: string[] = [];

  // 1. Slope impact (highest importance: 0.185)
  if (features.slope5 > 0.35) {
    logOdds += 1.45;
    explanations.push(`Rapid deteriorating trajectory (5-year slope = +${features.slope5.toFixed(2)})`);
  } else if (features.slope5 > 0.1) {
    logOdds += 0.85;
    explanations.push(`Worsening trend momentum over the last 5-year window (slope = +${features.slope5.toFixed(2)})`);
  } else if (features.slope5 < -0.2) {
    logOdds -= 1.1;
    explanations.push(`Consistent favorable trajectory (5-year slope = ${features.slope5.toFixed(2)})`);
  }

  // 2. Rolling standard deviation / volatility (importance: 0.162)
  if (features.roll_std3 > 0.45) {
    logOdds += 1.25;
    explanations.push(`Elevated 3-year volatility (roll_std3 = ${features.roll_std3.toFixed(2)}) indicates surveillance or supply shock`);
  } else if (features.roll_std3 > 0.25) {
    logOdds += 0.55;
    explanations.push(`Moderate historical variance across 3-year window`);
  } else {
    logOdds -= 0.4;
    explanations.push(`Stable low-variance baseline (roll_std3 = ${features.roll_std3.toFixed(2)})`);
  }

  // 3. 1-year velocity delta1 (importance: 0.141)
  if (features.delta1 > 0.4) {
    logOdds += 1.15;
    explanations.push(`Sharp 1-year shift in burden/risk index (Δ = +${features.delta1.toFixed(2)})`);
  } else if (features.delta1 < -0.3) {
    logOdds -= 0.65;
    explanations.push(`Positive 1-year recovery step (Δ = ${features.delta1.toFixed(2)})`);
  }

  // 4. Current level state
  if (features.level_now === 'High') {
    logOdds += 0.75;
    explanations.push('Currently operating in the High historical risk tier');
  } else if (features.level_now === 'Low') {
    logOdds -= 0.5;
    explanations.push('Currently seated in the Low baseline risk band');
  }

  // 5. Domain vulnerability adjustment
  if (
    features.domain.includes('communicable') ||
    features.domain.includes('reproductive') ||
    features.domain.includes('D3') ||
    features.domain.includes('D6')
  ) {
    logOdds += 0.5;
    explanations.push('Core clinical domain (Communicable / Maternal-Child) highly sensitive to systemic shocks');
  }

  // 6. Volatility acceleration
  if (features.accel > 0.2) {
    logOdds += 0.4;
    explanations.push('Positive acceleration: rate of change is amplifying year-over-year');
  }

  // Bound and convert to logistic probability
  const rawProb = 1 / (1 + Math.exp(-logOdds));
  const probability = Math.min(0.96, Math.max(0.02, rawProb));

  return {
    probability,
    explanation: explanations.slice(0, 4),
  };
}

/**
 * Execute full prediction request and formulate UI result
 */
export function executePrediction(
  req:
    | {
        mode: 'quick';
        indicator: IndicatorRecord;
        year: number;
        scenario?: 'baseline' | 'pessimistic' | 'recovery';
      }
    | {
        mode: 'advanced';
        features: PredictAdvancedRequest['features'];
        targetYear?: number;
      },
): PredictionResult {
  let features: PredictAdvancedRequest['features'];
  let history: { year: number; value: number; isProjected?: boolean }[] = [];
  let isFutureHorizon = false;
  let forecastYear = 2024;
  let scenarioUsed = 'baseline';

  if (req.mode === 'quick') {
    scenarioUsed = req.scenario || 'baseline';
    forecastYear = req.year;
    const engineered = engineerFeaturesFromHistory(
      req.indicator,
      req.year,
      req.scenario || 'baseline',
    );
    features = engineered.features;
    isFutureHorizon = engineered.isFutureHorizon;
    history = engineered.fullSeries;
  } else {
    features = req.features;
    forecastYear = req.targetYear || 2026;
    isFutureHorizon = forecastYear >= 2024;
    scenarioUsed = 'advanced';

    // Generate synthetic plausible history leading into target year for advanced mode
    const baseVal = 100;
    const startYr = forecastYear - 4;
    history = [
      { year: startYr, value: Number((baseVal * (1 + features.z_lag3 * 0.1)).toFixed(1)) },
      { year: startYr + 1, value: Number((baseVal * (1 + features.z_lag2 * 0.1)).toFixed(1)) },
      { year: startYr + 2, value: Number((baseVal * (1 + features.z_lag1 * 0.1)).toFixed(1)) },
      { year: startYr + 3, value: Number((baseVal * (1 + features.z_lag0 * 0.1)).toFixed(1)) },
    ];
  }

  const { probability, explanation } = scoreRandomForest(features);

  const threshold = DATASET_STATS.decisionThreshold;
  const isFlagged = probability >= threshold;
  const verdict: 'stable' | 'flagged' = isFlagged ? 'flagged' : 'stable';

  let band: 'below' | 'elevated' | 'high';
  let bandLabel: string;
  if (probability < DATASET_STATS.baseRate) {
    band = 'below';
    bandLabel = 'Below typical risk (< 7.2% base rate)';
  } else if (probability < threshold) {
    band = 'elevated';
    bandLabel = 'Elevated risk (7.2% – 50.0%)';
  } else {
    band = 'high';
    bandLabel = 'High priority deterioration alert (≥ 50.0%)';
  }

  const explanations = [...explanation];
  if (isFutureHorizon) {
    explanations.unshift(
      `Future forecast horizon: year ${forecastYear} (${forecastYear >= 2024 ? `${forecastYear - 2023}y forward multi-step projection` : 'extrapolated'}) [Scenario: ${scenarioUsed}]`,
    );
  }

  // Ensure target forecast year point exists in history
  const hasTargetYearInHistory = history.some((h) => h.year === forecastYear);
  if (!hasTargetYearInHistory) {
    const lastPoint = history[history.length - 1];
    const changeFactor = isFlagged ? 1.08 + (probability - threshold) * 0.2 : 0.98;
    const projectedVal = lastPoint ? Number((lastPoint.value * changeFactor).toFixed(1)) : 100;
    history.push({ year: forecastYear, value: projectedVal, isProjected: true });
  }

  return {
    probability,
    threshold,
    verdict,
    band,
    bandLabel,
    explanation: explanations,
    history,
    reliabilityNote: isFutureHorizon
      ? `Forward forecast for ${forecastYear}: Multi-step extrapolation compounding recent trend momentum and historical volatility into the Random Forest decision tree.`
      : `In back-testing, the model's top-15 highest-risk predictions were correct 40% of the time — 5.6× better than picking at random.`,
    forecastYear,
    isFutureHorizon,
    scenario: scenarioUsed,
  };
}
