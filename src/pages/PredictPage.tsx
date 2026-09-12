import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
} from 'recharts';
import {
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Calendar,
  Zap,
} from 'lucide-react';
import { Badge } from '../components/Badge';
import { Callout } from '../components/Callout';
import {
  TRAINED_INDICATORS,
  DOMAINS,
  DATASET_STATS,
} from '../data/miningData';
import {
  engineerFeaturesFromHistory,
  executePrediction,
} from '../utils/predictEngine';
import {
  IndicatorRecord,
  PredictAdvancedRequest,
  PredictionResult,
} from '../types';
import { useTheme } from '../theme/ThemeContext';

export const PredictPage: React.FC = () => {
  const { colors } = useTheme();
  const [mode, setMode] = useState<'quick' | 'advanced'>('quick');

  // Quick Predict state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(
    TRAINED_INDICATORS[0].id,
  );
  // Default to 2026 so user can test 2026 immediately
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [futureScenario, setFutureScenario] = useState<'baseline' | 'pessimistic' | 'recovery'>('baseline');

  // Advanced features state
  const [advTargetYear, setAdvTargetYear] = useState<number>(2026);
  const [advFeatures, setAdvFeatures] = useState<
    PredictAdvancedRequest['features']
  >({
    z_lag0: 0.85,
    z_lag1: 0.42,
    z_lag2: -0.15,
    z_lag3: -0.60,
    delta1: 0.43,
    delta2: 0.57,
    accel: -0.14,
    roll_mean3: 0.37,
    roll_std3: 0.41,
    slope5: 0.28,
    level_now: 'Mid',
    level_prev: 'Low',
    n_changes: 2,
    year_norm: 0.88,
    domain: 'D3 Communicable Diseases',
    unit: 'rate_per_100k',
    dim_type: 'TOTAL',
    is_disaggregated: false,
  });

  // UI Flow state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);

  // Filtered indicators by search
  const filteredIndicators = useMemo(() => {
    return TRAINED_INDICATORS.filter((ind) =>
      ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.domainName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const currentIndicator = useMemo(() => {
    return (
      TRAINED_INDICATORS.find((i) => i.id === selectedIndicatorId) ||
      TRAINED_INDICATORS[0]
    );
  }, [selectedIndicatorId]);

  // Handle Quick Predict run
  const handleRunQuickPredict = () => {
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      try {
        const res = executePrediction({
          mode: 'quick',
          indicator: currentIndicator,
          year: selectedYear,
          scenario: futureScenario,
        });
        setPredictionResult(res);
      } catch (err: any) {
        setErrorMsg(err.message || 'An error occurred during feature engineering.');
      } finally {
        setIsLoading(false);
      }
    }, 450);
  };

  // Handle Advanced Predict run
  const handleRunAdvancedPredict = () => {
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      try {
        const res = executePrediction({
          mode: 'advanced',
          features: advFeatures,
          targetYear: advTargetYear,
        });
        setPredictionResult(res);
      } catch (err: any) {
        setErrorMsg(err.message || 'Error processing advanced inputs.');
      } finally {
        setIsLoading(false);
      }
    }, 450);
  };

  // Synchronize Quick Predict values to Advanced mode
  const handleSwitchToAdvanced = () => {
    try {
      const engineered = engineerFeaturesFromHistory(
        currentIndicator,
        selectedYear,
        futureScenario,
      );
      setAdvFeatures({
        ...engineered.features,
        domain: currentIndicator.domainName,
      });
      setAdvTargetYear(selectedYear);
    } catch {
      // Keep default values if history calculation fails
    }
    setMode('advanced');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[var(--c-ink)]">
          Interactive Deterioration Risk Prediction Tool
        </h1>
        <p className="text-[14px] text-[var(--c-muted)] mt-1 max-w-4xl">
          Real-time execution of the trained Random Forest classifier (decision threshold = 0.499, base rate = 7.2%). Forecast whether a specific health indicator is likely to experience severe deterioration next year.
        </p>
      </div>

      {/* Mode Switcher Banner (§5.1) */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-4 shadow-[var(--c-shadow-sm)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[var(--c-primary)] text-white">
            <Sliders size={18} strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[14px] font-bold text-[var(--c-ink)]">
              Prediction Operation Mode: {mode === 'quick' ? 'Quick Predict' : 'Advanced / What-If'}
            </div>
            <div className="text-[12px] text-[var(--c-muted)]">
              {mode === 'quick'
                ? 'Standard presentation demo: select any trainable indicator and year.'
                : 'Technical stress-testing: directly modify the 14 engineered features and test model sensitivity.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[var(--c-subtle)] rounded-[6px] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('quick')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-[5px] transition-colors ${
              mode === 'quick'
                ? 'bg-[var(--c-surface)] text-[var(--c-primary)] shadow-sm'
                : 'text-[var(--c-muted)] hover:text-[var(--c-ink)]'
            }`}
          >
            Quick Predict
          </button>
          <button
            type="button"
            onClick={handleSwitchToAdvanced}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-[5px] transition-colors ${
              mode === 'advanced'
                ? 'bg-[var(--c-surface)] text-[var(--c-primary)] shadow-sm'
                : 'text-[var(--c-muted)] hover:text-[var(--c-ink)]'
            }`}
          >
            Advanced / What-If
          </button>
        </div>
      </div>

      {/* Main Grid: Left Form Input, Right Result Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Form Inputs */}
        <div className="lg:col-span-6 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)] space-y-4">
          {mode === 'quick' ? (
            /* Quick Predict Mode Form (§5.2) */
            <div className="space-y-4">
              <div className="border-b border-[var(--c-border)] pb-3">
                <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">
                  1. Select Indicator & Observation Horizon
                </h3>
                <p className="text-[12px] text-[var(--c-muted)]">
                  Restricted to the 157 distinct indicators (300 series) with sufficient historical depth for lag/slope engineering
                </p>
              </div>

              {/* Indicator Search & Dropdown */}
              <div>
                <label className="block text-[12px] font-semibold text-[var(--c-ink)] mb-1">
                  Health Indicator (Grouped by Domain)
                </label>
                <input
                  type="text"
                  placeholder="Type to filter indicators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 text-[12px] border border-[var(--c-border-strong)] rounded-[6px] mb-2 focus:outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
                />
                <select
                  value={selectedIndicatorId}
                  onChange={(e) => {
                    setSelectedIndicatorId(e.target.value);
                    const ind = TRAINED_INDICATORS.find((i) => i.id === e.target.value);
                    if (ind && ind.years.length > 0) {
                      setSelectedYear(ind.years[ind.years.length - 1]);
                    }
                  }}
                  className="w-full px-3 py-2 text-[13px] border border-[var(--c-border-strong)] rounded-[6px] bg-[var(--c-surface)] text-[var(--c-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
                >
                  {filteredIndicators.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      [{ind.domainName.split(' ')[0]}] {ind.name} ({ind.breakdown})
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-[11px] text-[var(--c-muted)] flex justify-between">
                  <span>Domain: {currentIndicator.domainName}</span>
                  <span>Unit: {currentIndicator.unit}</span>
                </div>
              </div>

              {/* Breakdown Dimension */}
              <div>
                <label className="block text-[12px] font-semibold text-[var(--c-ink)] mb-1">
                  Disaggregation Breakdown
                </label>
                <div className="px-3 py-2 text-[13px] rounded-[6px] bg-[var(--c-subtle)] text-[var(--c-ink)] border border-[var(--c-border-strong)] flex justify-between items-center font-mono">
                  <span>{currentIndicator.breakdown}</span>
                  <span className="text-[11px] text-[var(--c-muted)]">
                    Dim: {currentIndicator.dimType}
                  </span>
                </div>
              </div>

              {/* Target Year & Future Horizon Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[12px] font-semibold text-[var(--c-ink)]">
                    Evaluation / Forecast Horizon Year
                  </label>
                  <span className="text-[11px] font-medium text-[var(--c-primary)] flex items-center gap-1">
                    <Sparkles size={12} />
                    {selectedYear >= 2024 ? 'Future Horizon Mode' : 'Back-Test Mode'}
                  </span>
                </div>

                {/* Quick Selection Shortcuts */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="text-[11px] text-[var(--c-muted)]">Quick Set:</span>
                  {[2026, 2027, 2030, 2023].map((yr) => {
                    const isSel = selectedYear === yr;
                    return (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setSelectedYear(yr)}
                        className={`px-2 py-0.5 text-[11px] font-semibold rounded-[4px] transition-colors cursor-pointer ${
                          isSel
                            ? 'bg-[var(--c-primary)] text-white'
                            : 'bg-[var(--c-subtle)] text-[var(--c-primary)] hover:bg-[var(--c-border-strong)]'
                        }`}
                      >
                        {yr >= 2024 ? `${yr} 🔮` : `${yr} (Hist)`}
                      </button>
                    );
                  })}
                </div>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-3 py-2 text-[13px] border border-[var(--c-border-strong)] rounded-[6px] bg-[var(--c-surface)] text-[var(--c-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--c-primary)] font-mono"
                >
                  <optgroup label="🔮 Future Forecast Horizons (Extrapolation)">
                    <option value={2026}>2026 (Forward Horizon +3y)</option>
                    <option value={2027}>2027 (Forward Horizon +4y)</option>
                    <option value={2028}>2028 (Forward Horizon +5y)</option>
                    <option value={2029}>2029 (Forward Horizon +6y)</option>
                    <option value={2030}>2030 (SDG 2030 Target Milestone)</option>
                    <option value={2025}>2025 (Forward Horizon +2y)</option>
                    <option value={2024}>2024 (Forward Horizon +1y)</option>
                  </optgroup>

                  <optgroup label="📋 Historical Observations (Empirical Back-Test)">
                    {currentIndicator.years
                      .slice()
                      .reverse()
                      .map((y, idx) => {
                        const originalIdx = currentIndicator.years.indexOf(y);
                        const hasEnoughHistory = originalIdx >= 2;
                        return (
                          <option key={y} value={y} disabled={!hasEnoughHistory}>
                            {y} {hasEnoughHistory ? '(Observed WHO GHO)' : '(insufficient history)'}
                          </option>
                        );
                      })}
                  </optgroup>
                </select>

                {/* Scenario Selector if Future Horizon */}
                {selectedYear >= 2024 ? (
                  <div className="mt-3 p-3 bg-[var(--c-subtle)]/80 border border-[var(--c-border-strong)] rounded-[6px] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[var(--c-ink)] uppercase tracking-wider">
                        Future Projection Scenario (2024–{selectedYear})
                      </span>
                      <span className="text-[10px] text-[var(--c-muted)] font-mono">
                        Base: {currentIndicator.latestYear || 2023}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'baseline', label: 'Baseline', desc: 'Status quo trend' },
                        { id: 'pessimistic', label: 'Severe Shock', desc: 'Accelerated drop' },
                        { id: 'recovery', label: 'Recovery', desc: 'Intervention rebound' },
                      ].map((sc) => (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => setFutureScenario(sc.id as any)}
                          className={`p-1.5 rounded-[5px] text-center border transition-colors ${
                            futureScenario === sc.id
                              ? 'bg-[var(--c-surface)] text-[var(--c-primary)] border-[var(--c-primary)] shadow-xs font-bold'
                              : 'bg-[var(--c-surface)]/60 text-[var(--c-muted)] border-[var(--c-border-strong)] hover:bg-[var(--c-surface)] text-[11px]'
                          }`}
                        >
                          <div className="text-[11px]">{sc.label}</div>
                          <div className="text-[9px] text-[var(--c-faint)]">{sc.desc}</div>
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-[var(--c-muted)] leading-tight">
                      Autoregressively compounds the {futureScenario} trajectory from {currentIndicator.latestYear || 2023} into {selectedYear} to compute rolling features.
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-[var(--c-muted)] mt-1">
                    The model extracts 4 lags, 3-year volatility, and 5-year trend slope prior to this year.
                  </p>
                )}
              </div>

              {/* Action Button: Predict */}
              <div className="pt-3 border-t border-[var(--c-border)]">
                <button
                  type="button"
                  onClick={handleRunQuickPredict}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[var(--c-primary)] hover:bg-[var(--c-primary-strong)] disabled:opacity-60 text-white font-semibold text-[14px] rounded-[6px] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Predicting...</span>
                    </>
                  ) : (
                    <>
                      <span>Predict Deterioration Risk</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Advanced Mode Form (§5.3) */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--c-border)] pb-3">
                <div>
                  <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">
                    Direct Engineered Feature Inputs
                  </h3>
                  <p className="text-[12px] text-[var(--c-muted)]">
                    Interquartile ranges (IQR) pre-configured with numeric overrides
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSwitchToAdvanced()}
                  className="text-[12px] text-[var(--c-primary)] font-semibold hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reset from Quick
                </button>
              </div>

              {/* Target Horizon Year for Advanced Simulation */}
              <div className="p-3 bg-[var(--c-subtle)]/60 rounded-[6px] border border-[var(--c-border-strong)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-semibold text-[var(--c-ink)]">
                    Simulated Target Horizon Year
                  </label>
                  <span className="text-[11px] font-mono text-[var(--c-primary)] font-bold">
                    {advTargetYear >= 2024 ? `🔮 ${advTargetYear} Horizon` : `${advTargetYear} Historical`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[2026, 2027, 2028, 2030].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setAdvTargetYear(yr)}
                      className={`px-2 py-1 text-[11px] font-semibold rounded-[4px] border transition-colors cursor-pointer ${
                        advTargetYear === yr
                          ? 'bg-[var(--c-primary)] text-white border-[var(--c-primary)]'
                          : 'bg-[var(--c-surface)] text-[var(--c-muted)] border-[var(--c-border-strong)] hover:bg-[var(--c-subtle)]'
                      }`}
                    >
                      {yr} 🔮
                    </button>
                  ))}
                  <select
                    value={advTargetYear}
                    onChange={(e) => setAdvTargetYear(Number(e.target.value))}
                    className="ml-auto px-2 py-1 text-[11px] border border-[var(--c-border-strong)] rounded-[4px] bg-[var(--c-surface)] text-[var(--c-ink)] font-mono"
                  >
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                    <option value={2028}>2028</option>
                    <option value={2029}>2029</option>
                    <option value={2030}>2030</option>
                    <option value={2023}>2023</option>
                    <option value={2022}>2022</option>
                  </select>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {/* 5-year Slope */}
                <div>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-semibold text-[var(--c-ink)]">
                      slope5 (5-year linear slope)
                    </span>
                    <span className="font-mono text-[var(--c-primary)] font-bold">
                      {advFeatures.slope5.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.05"
                    value={advFeatures.slope5}
                    onChange={(e) =>
                      setAdvFeatures({ ...advFeatures, slope5: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[var(--c-primary)]"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--c-muted)]">
                    <span>Declining (-1.5)</span>
                    <span>Flat (0.0)</span>
                    <span>Worsening (+1.5)</span>
                  </div>
                </div>

                {/* 3-year Volatility roll_std3 */}
                <div>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-semibold text-[var(--c-ink)]">
                      roll_std3 (3-year rolling volatility)
                    </span>
                    <span className="font-mono text-[var(--c-primary)] font-bold">
                      {advFeatures.roll_std3.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.5"
                    step="0.05"
                    value={advFeatures.roll_std3}
                    onChange={(e) =>
                      setAdvFeatures({ ...advFeatures, roll_std3: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[var(--c-primary)]"
                  />
                </div>

                {/* 1-year Delta1 */}
                <div>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-semibold text-[var(--c-ink)]">
                      delta1 (1-year velocity shift: z0 - z1)
                    </span>
                    <span className="font-mono text-[var(--c-primary)] font-bold">
                      {advFeatures.delta1.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.05"
                    value={advFeatures.delta1}
                    onChange={(e) =>
                      setAdvFeatures({ ...advFeatures, delta1: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[var(--c-primary)]"
                  />
                </div>

                {/* z_lag0 Current Z-Score */}
                <div>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-semibold text-[var(--c-ink)]">
                      z_lag0 (Current normalized z-score)
                    </span>
                    <span className="font-mono text-[var(--c-primary)] font-bold">
                      {advFeatures.z_lag0.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-3.0"
                    max="3.0"
                    step="0.1"
                    value={advFeatures.z_lag0}
                    onChange={(e) =>
                      setAdvFeatures({ ...advFeatures, z_lag0: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[var(--c-primary)]"
                  />
                </div>

                {/* Level Now Segmented Control */}
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--c-ink)] mb-1">
                    level_now (Discretised Current Burden Tier)
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--c-subtle)] rounded-[6px]">
                    {(['Low', 'Mid', 'High'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setAdvFeatures({ ...advFeatures, level_now: lvl })}
                        className={`py-1 text-[12px] font-semibold rounded-[4px] transition-colors ${
                          advFeatures.level_now === lvl
                            ? 'bg-[var(--c-primary)] text-white shadow-sm'
                            : 'text-[var(--c-muted)] hover:bg-[var(--c-surface)]/50'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Acceleration */}
                <div>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-semibold text-[var(--c-ink)]">
                      accel (Velocity acceleration: delta1 - delta2)
                    </span>
                    <span className="font-mono text-[var(--c-primary)] font-bold">
                      {advFeatures.accel.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.05"
                    value={advFeatures.accel}
                    onChange={(e) =>
                      setAdvFeatures({ ...advFeatures, accel: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[var(--c-primary)]"
                  />
                </div>
              </div>

              {/* Action Button: Run Advanced Predict */}
              <div className="pt-3 border-t border-[var(--c-border)]">
                <button
                  type="button"
                  onClick={handleRunAdvancedPredict}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[var(--c-primary)] hover:bg-[var(--c-primary-strong)] disabled:opacity-60 text-white font-semibold text-[14px] rounded-[6px] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Predicting...</span>
                    </>
                  ) : (
                    <>
                      <span>Score Advanced Inputs</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error Display if any */}
          {errorMsg && (
            <div className="p-3 bg-[var(--c-danger-bg)] border-l-4 border-l-[var(--c-danger)] border-[var(--c-danger-border)] rounded-[6px] text-[12px] text-[var(--c-danger)]">
              <strong>Configuration Note:</strong> {errorMsg}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Prediction Result Panel (§5.5) */}
        <div className="lg:col-span-6 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)] space-y-4">
          <div className="border-b border-[var(--c-border)] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">
                Model Prediction Result
              </h3>
              <p className="text-[12px] text-[var(--c-muted)]">
                Statistical probability of season-ahead deterioration
              </p>
            </div>
            {predictionResult && (
              <Badge
                variant={predictionResult.verdict === 'stable' ? 'success' : 'danger'}
              >
                {predictionResult.verdict === 'stable'
                  ? 'Likely Stable'
                  : 'Flagged for Review'}
              </Badge>
            )}
          </div>

          {predictionResult ? (
            <div className="space-y-5 animate-in fade-in">
              {/* Future Forecast Horizon Banner */}
              {predictionResult.isFutureHorizon && (
                <div className="flex items-center justify-between p-3 rounded-[6px] bg-[var(--c-primary)]/10 border border-[var(--c-primary)]/30 text-[var(--c-primary)] text-[12px]">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="shrink-0 text-[var(--c-primary)]" />
                    <div>
                      <span className="font-bold text-[var(--c-ink)]">
                        Target Forecast Horizon: Year {predictionResult.forecastYear}
                      </span>
                      <span className="text-[11px] text-[var(--c-muted)] ml-2">
                        ({predictionResult.forecastYear! - 2023} years beyond 2023 empirical baseline)
                      </span>
                    </div>
                  </div>
                  {predictionResult.scenario && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[var(--c-surface)] border border-[var(--c-border-strong)] uppercase font-mono text-[var(--c-ink)]">
                      {predictionResult.scenario}
                    </span>
                  )}
                </div>
              )}

              {/* Score & Band */}
              <div className="flex items-baseline justify-between p-4 rounded-[8px] bg-[var(--c-subtle)]/70 border border-[var(--c-border-strong)]">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--c-muted)]">
                    Deterioration Probability
                  </div>
                  <div className="text-[44px] font-bold text-[var(--c-ink)] font-mono tabular-nums leading-none mt-1">
                    {(predictionResult.probability * 100).toFixed(1)}%
                  </div>
                  <div className="text-[12px] font-semibold text-[var(--c-primary)] mt-2">
                    {predictionResult.bandLabel}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-[var(--c-muted)]">Decision Threshold</div>
                  <div className="text-[16px] font-mono font-bold text-[var(--c-ink)]">
                    {(predictionResult.threshold * 100).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-[var(--c-muted)] mt-1">Base Rate: 7.2%</div>
                </div>
              </div>

              {/* Explanations: Plain Language Bullets (§5.5) */}
              <div>
                <h4 className="text-[13px] font-semibold text-[var(--c-ink)] mb-2">
                  Signal Contributors & Risk Drivers:
                </h4>
                <ul className="space-y-1.5">
                  {predictionResult.explanation.map((exp, i) => (
                    <li
                      key={i}
                      className="text-[12px] text-[var(--c-ink)] flex items-start gap-2 bg-[var(--c-subtle)]/40 p-2 rounded border border-[var(--c-border)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-primary)] mt-1.5 shrink-0" />
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trend Chart with Projected Horizon Points */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[13px] font-semibold text-[var(--c-ink)]">
                    {predictionResult.isFutureHorizon
                      ? `Trajectory with Forward Horizon Extrapolation to ${predictionResult.forecastYear}`
                      : 'Trajectory & Model 1-Year Ahead Projection'}
                  </h4>
                  <span className="text-[11px] font-mono text-[var(--c-muted)]">
                    {predictionResult.isFutureHorizon ? '🔮 Dotted = Forward Horizon' : 'Dashed = Projected'}
                  </span>
                </div>

                <div className="h-[210px] w-full bg-[var(--c-surface)] rounded-[6px] border border-[var(--c-border)] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={predictionResult.history}
                      margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.borderStrong} vertical={false} />
                      <XAxis dataKey="year" stroke={colors.muted} fontSize={11} tickLine={false} />
                      <YAxis stroke={colors.muted} fontSize={11} tickLine={false} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        formatter={(val: any, name: any, item: any) => [
                          `${val} ${item.payload.isProjected ? '🔮 (Forward Projected)' : '📊 (WHO Observed)'}`,
                          'Value',
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Trajectory"
                        stroke={
                          predictionResult.verdict === 'stable'
                            ? colors.success
                            : colors.danger
                        }
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Reliability Context Callout (§5.5) */}
              <div className="p-3 rounded-[6px] bg-[var(--c-subtle)] border border-[var(--c-border-strong)] text-[12px] text-[var(--c-ink)]">
                <strong>Reliability Context: </strong>
                {predictionResult.reliabilityNote}
              </div>

              {/* Mandatory Disclaimer (§5.5) */}
              <p className="text-[11px] text-[var(--c-faint)] leading-relaxed italic border-t border-[var(--c-border)] pt-2">
                Disclaimer: This is a statistical pattern match on the indicator's own historical trajectory, not a medical or causal diagnosis. Historical deterioration rate in the test period was 7.2%.
              </p>
            </div>
          ) : (
            /* Idle State */
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[var(--c-subtle)] text-[var(--c-primary)] flex items-center justify-center mx-auto">
                <Sliders size={22} strokeWidth={1.75} />
              </div>
              <h4 className="text-[15px] font-semibold text-[var(--c-ink)]">
                Model Awaiting Input
              </h4>
              <p className="text-[13px] text-[var(--c-muted)] max-w-sm mx-auto">
                Select an indicator and year on the left, then click <strong>Predict Deterioration Risk</strong> to evaluate the Random Forest model.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
