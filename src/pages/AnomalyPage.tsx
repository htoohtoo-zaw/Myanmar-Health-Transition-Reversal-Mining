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
  AreaChart,
  Area,
} from 'recharts';
import {
  AlertTriangle,
  Info,
  ShieldCheck,
  FileSpreadsheet,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { Callout } from '../components/Callout';
import { ANOMALY_SERIES, OUTBREAK_YEARS } from '../data/miningData';
import { useTheme } from '../theme/ThemeContext';

export const AnomalyPage: React.FC = () => {
  const { colors } = useTheme();
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[var(--c-ink)]">
          Anomaly Detection & Surveillance Completeness
        </h1>
        <p className="text-[14px] text-[var(--c-muted)] mt-1 max-w-4xl">
          Disentangling genuine public health outbreaks from structural surveillance collapse using multidimensional Isolation Forests and reporting completeness audits.
        </p>
      </div>

      {/* 4. Core Logical Callout (Prominent) */}
      <Callout
        type="danger"
        kicker="SURVEILLANCE DISRUPTION PARADOX"
        title="Why Simultaneous Drops in Cases and Coverage Prove Data Collapse"
      >
        If measles immunisation plummets from 92% to 44%, true community disease transmission <em>must increase</em>. The fact that officially reported measles case numbers also dropped from thousands to 42 cases in 2021 is an administrative impossibility. It proves that public health facilities and hospital reporting pipelines fractured, creating an illusion of disease absence.
      </Callout>

      {/* 1. Isolation Forest Anomaly Score Chart */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">
              Isolation Forest Temporal Anomaly Score (2000–2024)
            </h3>
            <p className="text-[12px] text-[var(--c-muted)]">
              Trained on cross-indicator multidimensional shifts. Peak anomaly scores coincide with 2021–2022 disruption.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[var(--c-danger-bg)] text-[var(--c-danger)] border border-[var(--c-danger-border)] font-semibold">
            2021 Peak Score: 0.88 / 1.00
          </span>
        </div>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ANOMALY_SERIES} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.danger} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={colors.primary} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.borderStrong} vertical={false} />
              <XAxis dataKey="year" stroke={colors.muted} fontSize={12} tickLine={false} />
              <YAxis domain={[0, 1.0]} stroke={colors.muted} fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${Number(val).toFixed(2)}`, 'Anomaly Score']}
              />
              <ReferenceLine
                y={0.5}
                stroke={colors.warning}
                strokeDasharray="3 3"
                label={{ value: 'Elevated Anomaly Threshold (0.50)', fill: colors.warning, fontSize: 11 }}
              />
              <ReferenceLine
                x={2021}
                stroke={colors.danger}
                strokeDasharray="4 4"
                label={{ value: '2021 Peak Fracture', position: 'top', fill: colors.danger, fontSize: 11, fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="score"
                name="Isolation Forest Anomaly Score"
                stroke={colors.danger}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#anomalyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Synchronized Dual Time Series: Completeness Index directly above Mean Coverage */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)] space-y-4">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">
            Surveillance Completeness vs. Mean Immunisation Coverage (Aligned Axes)
          </h3>
          <p className="text-[12px] text-[var(--c-muted)]">
            Observing the synchronized collapse of health facility reporting rates alongside routine immunization delivery
          </p>
        </div>

        {/* Top Chart: Completeness Index (1.00 -> 0.80) */}
        <div>
          <div className="flex items-center justify-between text-[12px] font-semibold text-[var(--c-primary)] mb-1">
            <span>A. National Surveillance Completeness Index (0.0 – 1.0)</span>
            <span className="font-mono text-[var(--c-danger)]">Dropped 1.00 → 0.80 in 2021</span>
          </div>
          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANOMALY_SERIES} margin={{ top: 5, right: 20, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderStrong} vertical={false} />
                <XAxis dataKey="year" stroke={colors.muted} fontSize={11} tickLine={false} />
                <YAxis domain={[0.7, 1.05]} stroke={colors.muted} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <ReferenceLine x={2021} stroke={colors.danger} strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="completeness"
                  name="Completeness Index"
                  stroke={colors.primary}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Chart: Mean Routine Coverage (%) */}
        <div className="pt-2 border-t border-[var(--c-border)]">
          <div className="flex items-center justify-between text-[12px] font-semibold text-[var(--c-warning)] mb-1">
            <span>B. Mean Routine Immunisation Coverage (%)</span>
            <span className="font-mono text-[var(--c-danger)]">Halved: 92% → 45% in 2021</span>
          </div>
          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANOMALY_SERIES} margin={{ top: 5, right: 20, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderStrong} vertical={false} />
                <XAxis dataKey="year" stroke={colors.muted} fontSize={11} tickLine={false} />
                <YAxis domain={[30, 100]} stroke={colors.muted} fontSize={11} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Mean Coverage']}
                />
                <ReferenceLine x={2021} stroke={colors.danger} strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="coverage"
                  name="Mean Routine Coverage"
                  stroke={colors.warning}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Per-Disease Outbreak Year Chips */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <h3 className="text-[16px] font-semibold text-[var(--c-ink)] mb-1">
          Historical Epidemic Outbreak Years (Rolling-Median & MAD Detection)
        </h3>
        <p className="text-[12px] text-[var(--c-muted)] mb-4">
          Identified statistical anomalies where reported incidence exceeded 3× Median Absolute Deviation (MAD) over a 5-year moving window:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {OUTBREAK_YEARS.map((ob, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-[8px] bg-[var(--c-subtle)]/60 border border-[var(--c-border-strong)] flex flex-col justify-between"
            >
              <div>
                <span className="text-[13px] font-bold text-[var(--c-ink)]">
                  {ob.disease}
                </span>
                <div className="text-[11px] text-[var(--c-muted)] mt-0.5">
                  Algorithm: {ob.method}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {ob.years.map((yr) => (
                  <span
                    key={yr}
                    className="px-2 py-0.5 rounded-[4px] font-mono text-[12px] font-bold bg-[var(--c-surface)] text-[var(--c-danger)] border border-[var(--c-danger-border)]"
                  >
                    {yr}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
