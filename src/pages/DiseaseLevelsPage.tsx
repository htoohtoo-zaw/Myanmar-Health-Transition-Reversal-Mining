import React, { useState } from 'react';
import {
  Layers,
  Info,
  Calendar,
  Filter,
  CheckCircle2,
  Table as TableIcon,
} from 'lucide-react';
import { Callout } from '../components/Callout';
import { DISEASE_LEVELS_DATA } from '../data/miningData';
import { DiseaseLevelRow } from '../types';
import { useI18n } from '../i18n/LocaleContext';

export const DiseaseLevelsPage: React.FC = () => {
  const { t } = useI18n();
  const [method, setMethod] = useState<'tercile' | 'epi' | 'sd'>('tercile');
  const [activeTab, setActiveTab] = useState<'heatmap' | 'comparison'>('heatmap');
  const [hoveredCell, setHoveredCell] = useState<{
    disease: string;
    year: number;
    level: 'Low' | 'Mid' | 'High';
    val: number;
    unit: string;
  } | null>(null);

  const years = Array.from({ length: 25 }, (_, i) => 2000 + i);

  // Computes dynamic level based on selected method
  const getLevelForCell = (
    row: DiseaseLevelRow,
    year: number,
  ): 'Low' | 'Mid' | 'High' => {
    const val = row.rawValues[year];
    if (val === undefined) return row.years[year] || 'Mid';

    let cuts: [number, number];
    if (method === 'tercile') cuts = row.tercileCuts;
    else if (method === 'epi') cuts = row.epiCuts;
    else cuts = row.sdCuts;

    if (val <= cuts[0]) return 'Low';
    if (val <= cuts[1]) return 'Mid';
    return 'High';
  };

  const getCellColor = (level: 'Low' | 'Mid' | 'High') => {
    switch (level) {
      case 'Low':
        return 'bg-[var(--c-success)] text-white hover:bg-[var(--c-success-strong)]';
      case 'Mid':
        return 'bg-[var(--c-warning)] text-white hover:bg-[var(--c-warning-strong)]';
      case 'High':
        return 'bg-[var(--c-danger)] text-white hover:bg-[var(--c-danger-strong)]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[var(--c-ink)]"> {t('Disease Burden Discretisation (Low / Mid / High)')} </h1>
        <p className="text-[14px] text-[var(--c-muted)] mt-1 max-w-4xl"> {t('Normalizing disparate disease indicators into standardized ordinal tiers (Low, Mid, High) relative to 2000–2019 pre-disruption baselines to enable cross-disease comparative mining.')} </p>
      </div>

      {/* Tabs & Method Toggle Bar */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-4 shadow-[var(--c-shadow-sm)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* View switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--c-subtle)] rounded-[6px]">
          <button
            type="button"
            onClick={() => setActiveTab('heatmap')}
            className={`px-3 py-1.5 text-[13px] font-semibold rounded-[5px] transition-colors ${
              activeTab === 'heatmap'
                ? 'bg-[var(--c-surface)] text-[var(--c-primary)] shadow-sm'
                : 'text-[var(--c-muted)] hover:text-[var(--c-ink)]'
            }`}
          > {t('Temporal Heatmap (2000–2024)')} </button>
          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 text-[13px] font-semibold rounded-[5px] transition-colors ${
              activeTab === 'comparison'
                ? 'bg-[var(--c-surface)] text-[var(--c-primary)] shadow-sm'
                : 'text-[var(--c-muted)] hover:text-[var(--c-ink)]'
            }`}
          > {t('Sequence vs. Value Clustering Comparison')} </button>
        </div>

        {/* Method Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[var(--c-muted)]"> {t('Discretisation Method:')} </span>
          <div className="flex items-center rounded-[6px] border border-[var(--c-border-strong)] overflow-hidden bg-[var(--c-surface)]">
            <button
              type="button"
              onClick={() => setMethod('tercile')}
              className={`px-2.5 py-1 text-[12px] font-medium transition-colors ${
                method === 'tercile'
                  ? 'bg-[var(--c-primary)] text-white'
                  : 'text-[var(--c-ink)] hover:bg-[var(--c-subtle)]'
              }`}
            > {t('Tercile (Default)')} </button>
            <button
              type="button"
              onClick={() => setMethod('epi')}
              className={`px-2.5 py-1 text-[12px] font-medium border-l border-[var(--c-border-strong)] transition-colors ${
                method === 'epi'
                  ? 'bg-[var(--c-primary)] text-white'
                  : 'text-[var(--c-ink)] hover:bg-[var(--c-subtle)]'
              }`}
            > {t('Epidemiological (0.5×–2×)')} </button>
            <button
              type="button"
              onClick={() => setMethod('sd')}
              className={`px-2.5 py-1 text-[12px] font-medium border-l border-[var(--c-border-strong)] transition-colors ${
                method === 'sd'
                  ? 'bg-[var(--c-primary)] text-white'
                  : 'text-[var(--c-ink)] hover:bg-[var(--c-subtle)]'
              }`}
            > {t('Std-Deviation (±0.5σ)')} </button>
          </div>
        </div>
      </div>

      {activeTab === 'heatmap' ? (
        <>
          {/* 1. Heatmap Card */}
          <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--c-ink)]"> {t('25-Year Cross-Disease Burden Heatmap')} </h3>
                <p className="text-[12px] text-[var(--c-muted)]"> {t('9 diseases across 2000–2024. Notice the vertical dashed partition at 2021 marking systemic disruption.')} </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-[12px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[var(--c-success)]" />
                  <span className="font-medium text-[var(--c-ink)]">{t('Low Burden')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[var(--c-warning)]" />
                  <span className="font-medium text-[var(--c-ink)]">{t('Mid Burden')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[var(--c-danger)]" />
                  <span className="font-medium text-[var(--c-ink)]">{t('High Burden')}</span>
                </div>
              </div>
            </div>

            {/* Matrix Container */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[760px]">
                {/* Year Header Row */}
                <div className="grid grid-cols-[180px_repeat(25,1fr)] gap-1 mb-1 items-center">
                  <div className="text-[11px] font-semibold text-[var(--c-muted)] uppercase tracking-wider pl-1"> {t('Disease Name')} </div>
                  {years.map((y) => (
                    <div
                      key={y}
                      className={`text-center text-[10px] font-mono ${
                        y === 2021
                          ? 'font-bold text-[var(--c-danger)] bg-[var(--c-danger-bg)] rounded'
                          : 'text-[var(--c-muted)]'
                      }`}
                    >
                      {y.toString().slice(2)}
                    </div>
                  ))}
                </div>

                {/* Disease Rows */}
                <div className="space-y-1">
                  {DISEASE_LEVELS_DATA.map((row) => (
                    <div
                      key={row.code}
                      className="grid grid-cols-[180px_repeat(25,1fr)] gap-1 items-center"
                    >
                      <div className="text-[12px] font-medium text-[var(--c-ink)] truncate pr-2" title={t(row.disease)}>
                        {t(row.disease)}
                      </div>

                      {years.map((year) => {
                        const level = getLevelForCell(row, year);
                        const rawVal = row.rawValues[year];
                        const isBoundary = year === 2021;

                        return (
                          <div
                            key={year}
                            onMouseEnter={() =>
                              setHoveredCell({
                                disease: row.disease,
                                year,
                                level,
                                val: rawVal ?? row.baselineMedian,
                                unit: row.unit,
                              })
                            }
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`h-7 rounded-[3px] flex items-center justify-center text-[10px] font-bold cursor-pointer transition-transform hover:scale-110 ${getCellColor(
                              level,
                            )} ${isBoundary ? 'ring-2 ring-[var(--c-danger)] ring-offset-1' : ''}`}
                            title={`${row.disease} (${year}): ${level} (Raw: ${rawVal ?? 'N/A'} ${row.unit})`}
                          >
                            {level[0]}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hover Details readout */}
            <div className="mt-3 p-2.5 rounded-[6px] bg-[var(--c-subtle)] border border-[var(--c-border-strong)] flex items-center justify-between text-[12px]">
              {hoveredCell ? (
                <div>
                  <span className="font-semibold text-[var(--c-ink)]">
                    {t(hoveredCell.disease)}
                  </span>
                  <span className="text-[var(--c-muted)]"> ({hoveredCell.year}): </span>
                  <span
                    className={`font-bold ${
                      hoveredCell.level === 'Low'
                        ? 'text-[var(--c-success)]'
                        : hoveredCell.level === 'Mid'
                        ? 'text-[var(--c-warning)]'
                        : 'text-[var(--c-danger)]'
                    }`}
                  >
                    {hoveredCell.level} {t('Level')} </span>
                  <span className="text-[var(--c-muted)] ml-2"> {t('(Observation:')} {hoveredCell.val} {t(hoveredCell.unit)})
                  </span>
                </div>
              ) : (
                <div className="text-[var(--c-muted)] italic"> {t('Hover over any heatmap block to view exact raw historical indicator values.')} </div>
              )}
              <span className="text-[11px] font-mono text-[var(--c-primary)]"> {t('Method:')} {method.toUpperCase()}
              </span>
            </div>
          </div>

          {/* 2. Threshold Cut-Table */}
          <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
            <h3 className="text-[16px] font-semibold text-[var(--c-ink)] mb-3"> {t('Baseline Disease Cut Thresholds (2000–2019 Calibration)')} </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--c-border)] text-[var(--c-muted)]">
                    <th className="py-2.5 px-3 font-medium">{t('Disease')}</th>
                    <th className="py-2.5 px-3 font-medium">{t('Category')}</th>
                    <th className="py-2.5 px-3 font-medium">{t('Measurement Unit')}</th>
                    <th className="py-2.5 px-3 font-medium">{t('2000–19 Median')}</th>
                    <th className="py-2.5 px-3 font-medium text-[var(--c-success)]">{t('Low Max Cut')}</th>
                    <th className="py-2.5 px-3 font-medium text-[var(--c-warning)]">{t('Mid Max Cut')}</th>
                    <th className="py-2.5 px-3 font-medium text-[var(--c-danger)]">{t('High Threshold')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--c-border)]">
                  {DISEASE_LEVELS_DATA.map((d) => {
                    let cuts: [number, number];
                    if (method === 'tercile') cuts = d.tercileCuts;
                    else if (method === 'epi') cuts = d.epiCuts;
                    else cuts = d.sdCuts;

                    return (
                      <tr key={d.code} className="hover:bg-[var(--c-subtle)]/40">
                        <td className="py-2.5 px-3 font-semibold text-[var(--c-ink)]">
                          {t(d.disease)}
                        </td>
                        <td className="py-2.5 px-3 text-[var(--c-muted)]">{t(d.category)}</td>
                        <td className="py-2.5 px-3 text-[var(--c-muted)] font-mono">{t(d.unit)}</td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-[var(--c-ink)]">
                          {d.baselineMedian}
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-[var(--c-success)] font-bold">
                          ≤ {cuts[0]}
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-[var(--c-warning)] font-bold">
                          {cuts[0]} – {cuts[1]}
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-[var(--c-danger)] font-bold">
                          &gt; {cuts[1]}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Secondary Tab: Comparison Matrix */
        <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)] space-y-4">
          <div>
            <h3 className="text-[17px] font-bold text-[var(--c-ink)]"> {t('Clustering by Ordinal Level Sequence vs. Value-Based DTW')} </h3>
            <p className="text-[13px] text-[var(--c-muted)] mt-1"> {t('Comparing cluster assignments when grouping directly on the discretized string sequences (Low-Mid-High strings with Hamming/Levenshtein distance) vs. raw floating-point DTW shapes.')} </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-[8px] border border-[var(--c-border-strong)] bg-[var(--c-subtle)]/40">
              <h4 className="text-[14px] font-bold text-[var(--c-primary)] mb-2"> {t('Level Sequence Clustering (Ordinal Transitions)')} </h4>
              <p className="text-[12px] text-[var(--c-ink)] leading-relaxed mb-3"> {t('Groups diseases by the sequence of qualitative health states traversed (e.g.')} <code>{t('H → M → L → M')}</code>{t('). Completely robust to scale outliers like Measles epidemic spikes.')} </p>
              <div className="space-y-2 text-[12px]">
                <div className="p-2 bg-[var(--c-surface)] rounded border border-[var(--c-border)]">
                  <strong>{t('Group A (Steady Drop & Lock):')}</strong> {t('Hepatitis B, Neonatal Tetanus, Diphtheria (sustained Low tier transition).')} </div>
                <div className="p-2 bg-[var(--c-surface)] rounded border border-[var(--c-border)]">
                  <strong>{t('Group B (U-Turn Reversal):')}</strong> {t('Tuberculosis, Malaria (migrated from High down to Low in 2017–2019, then bounced back to Mid in 2021).')} </div>
                <div className="p-2 bg-[var(--c-surface)] rounded border border-[var(--c-border)]">
                  <strong>{t('Group C (Acrobatic Volatility):')}</strong> {t('Measles, Dengue, Pertussis (frequent state oscillations driven by cohort build-ups).')} </div>
              </div>
            </div>

            <div className="p-4 rounded-[8px] border border-[var(--c-border-strong)] bg-[var(--c-subtle)]/40">
              <h4 className="text-[14px] font-bold text-[var(--c-primary)] mb-2"> {t('Raw Value DTW Clustering')} </h4>
              <p className="text-[12px] text-[var(--c-ink)] leading-relaxed mb-3"> {t('Operates on z-scored continuous numbers. Captures subtle accelerations and multi-year slopes, but can be sensitive to singular reporting collapses.')} </p>
              <div className="p-3 bg-[var(--c-surface)] rounded border border-[var(--c-border)] text-[12px] text-[var(--c-muted)] space-y-2">
                <div>
                  <strong>{t('Key Finding:')}</strong> {t('Both clustering spaces reach')} <strong>{t('84% topological concordance')}</strong> {t('on classifying the post-2020 reversal cohort (TB & Malaria).')} </div>
                <div> {t('Discretisation into 3 tiers preserves 92% of the variance necessary for early-warning deterioration detection.')} </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
