export type NavigationPage =
  | 'overview'
  | 'data-quality'
  | 'reversal'
  | 'clustering'
  | 'disease-levels'
  | 'association-rules'
  | 'anomaly'
  | 'synthesis'
  | 'model-performance'
  | 'predict'
  | 'about';

export interface IndicatorRecord {
  id: string;
  name: string;
  domain: string;
  domainName: string;
  unit: string;
  dimType: string;
  breakdown: string;
  years: number[];
  values: number[];
  latestYear: number;
  latestValue: number;
  isDisaggregated: boolean;
}

export interface ReversalItem {
  id: string;
  indicator: string;
  domain: string;
  breakpointYear: number | string;
  bestYear: number | string;
  bestValue: number;
  currentValue: number;
  pctWorseThanBest: number;
  verdict: 'Reversal' | 'Steady worsening' | 'Improving';
  yearsLost: number | string;
  history: { year: number; value: number }[];
  description: string;
}

export interface DiseaseLevelRow {
  disease: string;
  code: string;
  category: string;
  baselineMedian: number;
  unit: string;
  tercileCuts: [number, number]; // [LowMax, MidMax]
  epiCuts: [number, number];
  sdCuts: [number, number];
  years: { [year: number]: 'Low' | 'Mid' | 'High' };
  rawValues: { [year: number]: number };
}

export interface AssociationRuleItem {
  id: string;
  antecedent: string;
  consequent: string;
  support: number;
  confidence: number;
  lift: number;
  isCoTrendingConfound?: boolean;
  explanation: string;
}

export interface ModelComparisonRow {
  model: string;
  isSelected?: boolean;
  precision: number;
  recall: number;
  f1: number;
  alerts: number;
  prAuc: number;
  rocAuc: number;
}

export interface PredictQuickRequest {
  mode: 'quick';
  indicator: string;
  breakdown: string;
  year: number;
  scenario?: 'baseline' | 'pessimistic' | 'recovery';
}

export interface PredictAdvancedRequest {
  mode: 'advanced';
  targetYear?: number;
  features: {
    z_lag0: number;
    z_lag1: number;
    z_lag2: number;
    z_lag3: number;
    delta1: number;
    delta2: number;
    accel: number;
    roll_mean3: number;
    roll_std3: number;
    slope5: number;
    level_now: 'Low' | 'Mid' | 'High';
    level_prev: 'Low' | 'Mid' | 'High';
    n_changes: number;
    year_norm: number;
    domain: string;
    unit: string;
    dim_type: string;
    is_disaggregated: boolean;
  };
}

export interface PredictionResult {
  probability: number;
  threshold: number;
  verdict: 'stable' | 'flagged';
  band: 'below' | 'elevated' | 'high';
  bandLabel: string;
  explanation: string[];
  history: { year: number; value: number; isProjected?: boolean }[];
  reliabilityNote: string;
  forecastYear?: number;
  isFutureHorizon?: boolean;
  scenario?: string;
}
