import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { Callout } from '../components/Callout';
import { Badge } from '../components/Badge';
import {
  MODEL_COMPARISON,
  CV_COMPARISON_DATA,
  FEATURE_IMPORTANCE_DATA,
  PR_CURVE_DATA,
  CONFUSION_MATRIX,
  DATASET_STATS,
} from '../data/miningData';
import { useTheme } from '../theme/ThemeContext';

export const ModelPerformancePage: React.FC = () => {
  const { colors } = useTheme();
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[var(--c-ink)]">
          Predictive Model Evaluation & Validation Rigor
        </h1>
        <p className="text-[14px] text-[var(--c-muted)] mt-1 max-w-4xl">
          Benchmarking machine learning classifiers for rare-event health deterioration risk (base rate = 7.2%). Exposing temporal leakage pitfalls across validation protocols.
        </p>
      </div>

      {/* 1. Model Comparison Table */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">
              Classifier Evaluation on Out-of-Sample Test Set (2022–2023)
            </h3>
            <p className="text-[12px] text-[var(--c-muted)]">
              Random Forest achieves a 4.4× PR-AUC lift over baseline with actionable alert precision
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-border)] font-semibold">
            Decision Threshold: 0.499
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--c-border)] text-[var(--c-muted)]">
                <th className="py-2.5 px-3 font-medium">Model Architecture</th>
                <th className="py-2.5 px-3 font-medium">Precision</th>
                <th className="py-2.5 px-3 font-medium">Recall</th>
                <th className="py-2.5 px-3 font-medium">F1-Score</th>
                <th className="py-2.5 px-3 font-medium">Total Alerts</th>
                <th className="py-2.5 px-3 font-medium text-[var(--c-primary)]">PR-AUC</th>
                <th className="py-2.5 px-3 font-medium">ROC-AUC</th>
                <th className="py-2.5 px-3 font-medium">Model Lift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--c-border)]">
              {MODEL_COMPARISON.map((m) => {
                const lift = (m.prAuc / DATASET_STATS.baseRate).toFixed(1);
                return (
                  <tr
                    key={m.model}
                    className={`${
                      m.isSelected
                        ? 'bg-[var(--c-subtle-2)]/60 font-semibold text-[var(--c-ink)]'
                        : 'hover:bg-[var(--c-subtle)]/40 text-[var(--c-ink)]'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span>{m.model}</span>
                        {m.isSelected && (
                          <Badge variant="primary" size="sm">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">
                      {(m.precision * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">
                      {(m.recall * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">
                      {m.f1.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">
                      {m.alerts}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-[var(--c-primary)] font-bold">
                      {m.prAuc.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-[var(--c-muted)]">
                      {m.rocAuc.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums font-bold">
                      {lift}×
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2 & 3: PR Curve & Confusion Matrix Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Precision-Recall Curve */}
        <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">
                Precision–Recall Curve (Test Set)
              </h3>
              <p className="text-[12px] text-[var(--c-muted)]">
                Targeting a severe 7.2% class imbalance; PR-AUC is the true gold standard
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--c-subtle-2)] text-[var(--c-primary)]">
              PR-AUC = 0.319
            </span>
          </div>

          <div className="h-[250px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PR_CURVE_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderStrong} vertical={false} />
                <XAxis dataKey="recall" stroke={colors.muted} fontSize={11} tickLine={false} unit="" />
                <YAxis domain={[0, 0.7]} stroke={colors.muted} fontSize={11} tickLine={false} unit="" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(v: any) => [Number(v).toFixed(3), 'Precision']}
                />
                <ReferenceLine
                  y={0.072}
                  stroke={colors.muted}
                  strokeDasharray="4 4"
                  label={{ value: 'Random Base Rate (0.072)', position: 'insideBottomRight', fill: colors.muted, fontSize: 11 }}
                />
                <Line
                  type="monotone"
                  dataKey="precision"
                  name="Random Forest"
                  stroke={colors.primary}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 pt-2 border-t border-[var(--c-border)] text-[12px] text-[var(--c-muted)]">
            Operating Point at Threshold 0.499: Recall = 42.9%, Precision = 34.1%.
          </div>
        </div>

        {/* 3. Confusion Matrix: Dedicated 2x2 Grid (Not a heatmap) */}
        <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">
                Confusion Matrix (Threshold = 0.499)
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--c-subtle)] text-[var(--c-ink)]">
                n = 488 test series
              </span>
            </div>
            <p className="text-[12px] text-[var(--c-muted)] mb-4">
              Categorical outcomes for the 35 true deterioration events vs. 453 stable series:
            </p>

            {/* 2x2 Grid Layout */}
            <div className="grid grid-cols-[100px_1fr_1fr] gap-2 items-center text-center">
              <div />
              <div className="text-[11px] font-bold text-[var(--c-muted)] uppercase">
                Predicted Stable
              </div>
              <div className="text-[11px] font-bold text-[var(--c-danger)] uppercase">
                Predicted Deterioration
              </div>

              {/* Row 1: Actual Stable */}
              <div className="text-right text-[11px] font-bold text-[var(--c-muted)] uppercase pr-2">
                Actual Stable
              </div>
              <div className="p-4 rounded-[6px] bg-[var(--c-success-bg)] border border-[var(--c-success-border)]">
                <div className="text-[22px] font-bold text-[var(--c-success)] font-mono tabular-nums">
                  {CONFUSION_MATRIX.tn}
                </div>
                <div className="text-[11px] font-semibold text-[var(--c-success)]">
                  True Negative (TN)
                </div>
              </div>
              <div className="p-4 rounded-[6px] bg-[var(--c-danger-bg)] border border-[var(--c-danger-border)]">
                <div className="text-[22px] font-bold text-[var(--c-danger)] font-mono tabular-nums">
                  {CONFUSION_MATRIX.fp}
                </div>
                <div className="text-[11px] font-semibold text-[var(--c-danger)]">
                  False Positive (FP)
                </div>
              </div>

              {/* Row 2: Actual Deterioration */}
              <div className="text-right text-[11px] font-bold text-[var(--c-danger)] uppercase pr-2">
                Actual Worsened
              </div>
              <div className="p-4 rounded-[6px] bg-[var(--c-warning-bg)] border border-[var(--c-warning-border)]">
                <div className="text-[22px] font-bold text-[var(--c-warning)] font-mono tabular-nums">
                  {CONFUSION_MATRIX.fn}
                </div>
                <div className="text-[11px] font-semibold text-[var(--c-warning)]">
                  False Negative (FN)
                </div>
              </div>
              <div className="p-4 rounded-[6px] bg-[var(--c-subtle-2)] border border-[var(--c-border-strong)]">
                <div className="text-[22px] font-bold text-[var(--c-primary)] font-mono tabular-nums">
                  {CONFUSION_MATRIX.tp}
                </div>
                <div className="text-[11px] font-semibold text-[var(--c-primary)]">
                  True Positive (TP)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--c-border)] text-[12px] text-[var(--c-muted)] flex justify-between">
            <span>Accuracy: 89.9%</span>
            <span className="font-semibold text-[var(--c-primary)]">Precision@15 = 40.0% (5.6× random)</span>
          </div>
        </div>
      </div>

      {/* 4. Cross-Validation Comparison Bar Chart (Vital Result) */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">
              Cross-Validation Scheme Comparison (Temporal Leakage Finding)
            </h3>
            <p className="text-[12px] text-[var(--c-muted)]">
              Comparing TimeSeriesSplit against standard GroupKFold and StratifiedKFold schemes
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--c-warning-bg)] text-[var(--c-warning)] border border-[var(--c-warning-border)]">
            +0.32 Artificial PR-AUC Inflation
          </span>
        </div>

        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CV_COMPARISON_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.borderStrong} vertical={false} />
              <XAxis dataKey="scheme" stroke={colors.muted} fontSize={11} tickLine={false} />
              <YAxis domain={[0, 0.7]} stroke={colors.muted} fontSize={11} tickLine={false} unit="" />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
              <Bar dataKey="rfPrAuc" name="Random Forest PR-AUC" fill={colors.primary} radius={[4, 4, 0, 0]} />
              <Bar dataKey="hgbPrAuc" name="HistGradientBoosting PR-AUC" fill={colors.warning} radius={[4, 4, 0, 0]} />
              <Bar dataKey="lrPrAuc" name="Logistic Regression PR-AUC" fill={colors.muted} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <Callout
          type="warning"
          kicker="METHODOLOGICAL SAFEGUARD"
          title="Why StratifiedKFold is Catastrophically Flawed on Time Series"
        >
          StratifiedKFold leaks future observations into past training folds. This creates an <strong>illusionary PR-AUC jump from 0.319 to 0.638</strong> and erroneously selects HistGradientBoosting over Random Forest. TimeSeriesSplit enforces strict forward chaining, guaranteeing zero future leakage and proving Random Forest is the true production performer.
        </Callout>
      </div>

      {/* 5. Two Side-by-Side Bar Charts: Feature Importance vs. Mutual Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
          <h3 className="text-[16px] font-semibold text-[var(--c-ink)] mb-1">
            Random Forest Gini Feature Importance
          </h3>
          <p className="text-[12px] text-[var(--c-muted)] mb-3">
            Fraction of total impurity decrease contributed by each engineered predictor
          </p>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={FEATURE_IMPORTANCE_DATA}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderStrong} horizontal={false} />
                <XAxis type="number" stroke={colors.muted} fontSize={11} tickLine={false} domain={[0, 0.22]} />
                <YAxis type="category" dataKey="feature" stroke={colors.ink} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [val, 'Importance']}
                />
                <Bar dataKey="importance" fill={colors.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
          <h3 className="text-[16px] font-semibold text-[var(--c-ink)] mb-1">
            Mutual Information vs. Deterioration Target
          </h3>
          <p className="text-[12px] text-[var(--c-muted)] mb-3">
            Non-parametric dependency measure (in nats) between raw inputs and future state
          </p>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={FEATURE_IMPORTANCE_DATA}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderStrong} horizontal={false} />
                <XAxis type="number" stroke={colors.muted} fontSize={11} tickLine={false} domain={[0, 0.1]} />
                <YAxis type="category" dataKey="feature" stroke={colors.ink} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [val, 'Mutual Information']}
                />
                <Bar dataKey="mi" fill={colors.success} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
