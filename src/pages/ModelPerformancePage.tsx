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

export const ModelPerformancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[#0B0F19]">
          Predictive Model Evaluation & Validation Rigor
        </h1>
        <p className="text-[14px] text-[#60636A] mt-1 max-w-4xl">
          Benchmarking machine learning classifiers for rare-event health deterioration risk (base rate = 7.2%). Exposing temporal leakage pitfalls across validation protocols.
        </p>
      </div>

      {/* 1. Model Comparison Table */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0F19]">
              Classifier Evaluation on Out-of-Sample Test Set (2022–2023)
            </h3>
            <p className="text-[12px] text-[#60636A]">
              Random Forest achieves a 4.4× PR-AUC lift over baseline with actionable alert precision
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#EBF7F0] text-[#2F9E68] border border-[#BBE5D0] font-semibold">
            Decision Threshold: 0.499
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E4E9F2] text-[#60636A]">
                <th className="py-2.5 px-3 font-medium">Model Architecture</th>
                <th className="py-2.5 px-3 font-medium">Precision</th>
                <th className="py-2.5 px-3 font-medium">Recall</th>
                <th className="py-2.5 px-3 font-medium">F1-Score</th>
                <th className="py-2.5 px-3 font-medium">Total Alerts</th>
                <th className="py-2.5 px-3 font-medium text-[#1C4BBC]">PR-AUC</th>
                <th className="py-2.5 px-3 font-medium">ROC-AUC</th>
                <th className="py-2.5 px-3 font-medium">Model Lift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9F2]">
              {MODEL_COMPARISON.map((m) => {
                const lift = (m.prAuc / DATASET_STATS.baseRate).toFixed(1);
                return (
                  <tr
                    key={m.model}
                    className={`${
                      m.isSelected
                        ? 'bg-[#DDE4F5]/60 font-semibold text-[#0B0F19]'
                        : 'hover:bg-[#EDF1FA]/40 text-[#0B0F19]'
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
                    <td className="py-2.5 px-3 font-mono tabular-nums text-[#1C4BBC] font-bold">
                      {m.prAuc.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-[#60636A]">
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
        <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-[16px] font-semibold text-[#0B0F19]">
                Precision–Recall Curve (Test Set)
              </h3>
              <p className="text-[12px] text-[#60636A]">
                Targeting a severe 7.2% class imbalance; PR-AUC is the true gold standard
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#DDE4F5] text-[#1C4BBC]">
              PR-AUC = 0.319
            </span>
          </div>

          <div className="h-[250px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PR_CURVE_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CAD3E6" vertical={false} />
                <XAxis dataKey="recall" stroke="#60636A" fontSize={11} tickLine={false} unit="" />
                <YAxis domain={[0, 0.7]} stroke="#60636A" fontSize={11} tickLine={false} unit="" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E4E9F2',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(v: any) => [Number(v).toFixed(3), 'Precision']}
                />
                <ReferenceLine
                  y={0.072}
                  stroke="#60636A"
                  strokeDasharray="4 4"
                  label={{ value: 'Random Base Rate (0.072)', position: 'insideBottomRight', fill: '#60636A', fontSize: 11 }}
                />
                <Line
                  type="monotone"
                  dataKey="precision"
                  name="Random Forest"
                  stroke="#1C4BBC"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E4E9F2] text-[12px] text-[#60636A]">
            Operating Point at Threshold 0.499: Recall = 42.9%, Precision = 34.1%.
          </div>
        </div>

        {/* 3. Confusion Matrix: Dedicated 2x2 Grid (Not a heatmap) */}
        <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] font-semibold text-[#0B0F19]">
                Confusion Matrix (Threshold = 0.499)
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#EDF1FA] text-[#0B0F19]">
                n = 488 test series
              </span>
            </div>
            <p className="text-[12px] text-[#60636A] mb-4">
              Categorical outcomes for the 35 true deterioration events vs. 453 stable series:
            </p>

            {/* 2x2 Grid Layout */}
            <div className="grid grid-cols-[100px_1fr_1fr] gap-2 items-center text-center">
              <div />
              <div className="text-[11px] font-bold text-[#60636A] uppercase">
                Predicted Stable
              </div>
              <div className="text-[11px] font-bold text-[#C4453F] uppercase">
                Predicted Deterioration
              </div>

              {/* Row 1: Actual Stable */}
              <div className="text-right text-[11px] font-bold text-[#60636A] uppercase pr-2">
                Actual Stable
              </div>
              <div className="p-4 rounded-[6px] bg-[#EBF7F0] border border-[#BBE5D0]">
                <div className="text-[22px] font-bold text-[#2F9E68] font-mono tabular-nums">
                  {CONFUSION_MATRIX.tn}
                </div>
                <div className="text-[11px] font-semibold text-[#2F9E68]">
                  True Negative (TN)
                </div>
              </div>
              <div className="p-4 rounded-[6px] bg-[#FDF0EF] border border-[#F4C5C2]">
                <div className="text-[22px] font-bold text-[#C4453F] font-mono tabular-nums">
                  {CONFUSION_MATRIX.fp}
                </div>
                <div className="text-[11px] font-semibold text-[#C4453F]">
                  False Positive (FP)
                </div>
              </div>

              {/* Row 2: Actual Deterioration */}
              <div className="text-right text-[11px] font-bold text-[#C4453F] uppercase pr-2">
                Actual Worsened
              </div>
              <div className="p-4 rounded-[6px] bg-[#FCF5E8] border border-[#F2DEB0]">
                <div className="text-[22px] font-bold text-[#C68A1E] font-mono tabular-nums">
                  {CONFUSION_MATRIX.fn}
                </div>
                <div className="text-[11px] font-semibold text-[#C68A1E]">
                  False Negative (FN)
                </div>
              </div>
              <div className="p-4 rounded-[6px] bg-[#DDE4F5] border border-[#CAD3E6]">
                <div className="text-[22px] font-bold text-[#1C4BBC] font-mono tabular-nums">
                  {CONFUSION_MATRIX.tp}
                </div>
                <div className="text-[11px] font-semibold text-[#1C4BBC]">
                  True Positive (TP)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E4E9F2] text-[12px] text-[#60636A] flex justify-between">
            <span>Accuracy: 89.9%</span>
            <span className="font-semibold text-[#1C4BBC]">Precision@15 = 40.0% (5.6× random)</span>
          </div>
        </div>
      </div>

      {/* 4. Cross-Validation Comparison Bar Chart (Vital Result) */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0F19]">
              Cross-Validation Scheme Comparison (Temporal Leakage Finding)
            </h3>
            <p className="text-[12px] text-[#60636A]">
              Comparing TimeSeriesSplit against standard GroupKFold and StratifiedKFold schemes
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#FCF5E8] text-[#C68A1E] border border-[#F2DEB0]">
            +0.32 Artificial PR-AUC Inflation
          </span>
        </div>

        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CV_COMPARISON_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CAD3E6" vertical={false} />
              <XAxis dataKey="scheme" stroke="#60636A" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 0.7]} stroke="#60636A" fontSize={11} tickLine={false} unit="" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E4E9F2',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
              <Bar dataKey="rfPrAuc" name="Random Forest PR-AUC" fill="#1C4BBC" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hgbPrAuc" name="HistGradientBoosting PR-AUC" fill="#C68A1E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lrPrAuc" name="Logistic Regression PR-AUC" fill="#60636A" radius={[4, 4, 0, 0]} />
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
        <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
          <h3 className="text-[16px] font-semibold text-[#0B0F19] mb-1">
            Random Forest Gini Feature Importance
          </h3>
          <p className="text-[12px] text-[#60636A] mb-3">
            Fraction of total impurity decrease contributed by each engineered predictor
          </p>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={FEATURE_IMPORTANCE_DATA}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#CAD3E6" horizontal={false} />
                <XAxis type="number" stroke="#60636A" fontSize={11} tickLine={false} domain={[0, 0.22]} />
                <YAxis type="category" dataKey="feature" stroke="#0B0F19" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E4E9F2',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [val, 'Importance']}
                />
                <Bar dataKey="importance" fill="#1C4BBC" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
          <h3 className="text-[16px] font-semibold text-[#0B0F19] mb-1">
            Mutual Information vs. Deterioration Target
          </h3>
          <p className="text-[12px] text-[#60636A] mb-3">
            Non-parametric dependency measure (in nats) between raw inputs and future state
          </p>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={FEATURE_IMPORTANCE_DATA}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#CAD3E6" horizontal={false} />
                <XAxis type="number" stroke="#60636A" fontSize={11} tickLine={false} domain={[0, 0.1]} />
                <YAxis type="category" dataKey="feature" stroke="#0B0F19" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E4E9F2',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [val, 'Mutual Information']}
                />
                <Bar dataKey="mi" fill="#2F9E68" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
