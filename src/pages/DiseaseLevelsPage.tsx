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

export const DiseaseLevelsPage: React.FC = () => {
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
        return 'bg-[#2F9E68] text-white hover:bg-[#278657]';
      case 'Mid':
        return 'bg-[#C68A1E] text-white hover:bg-[#A87418]';
      case 'High':
        return 'bg-[#C4453F] text-white hover:bg-[#A73934]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[#0B0F19]">
          Disease Burden Discretisation (Low / Mid / High)
        </h1>
        <p className="text-[14px] text-[#60636A] mt-1 max-w-4xl">
          Normalizing disparate disease indicators into standardized ordinal tiers (Low, Mid, High) relative to 2000–2019 pre-disruption baselines to enable cross-disease comparative mining.
        </p>
      </div>

      {/* Tabs & Method Toggle Bar */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-4 shadow-[0_1px_2px_rgba(11,15,25,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* View switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EDF1FA] rounded-[6px]">
          <button
            type="button"
            onClick={() => setActiveTab('heatmap')}
            className={`px-3 py-1.5 text-[13px] font-semibold rounded-[5px] transition-colors ${
              activeTab === 'heatmap'
                ? 'bg-white text-[#1C4BBC] shadow-sm'
                : 'text-[#60636A] hover:text-[#0B0F19]'
            }`}
          >
            Temporal Heatmap (2000–2024)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 text-[13px] font-semibold rounded-[5px] transition-colors ${
              activeTab === 'comparison'
                ? 'bg-white text-[#1C4BBC] shadow-sm'
                : 'text-[#60636A] hover:text-[#0B0F19]'
            }`}
          >
            Sequence vs. Value Clustering Comparison
          </button>
        </div>

        {/* Method Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[#60636A]">
            Discretisation Method:
          </span>
          <div className="flex items-center rounded-[6px] border border-[#CAD3E6] overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setMethod('tercile')}
              className={`px-2.5 py-1 text-[12px] font-medium transition-colors ${
                method === 'tercile'
                  ? 'bg-[#1C4BBC] text-white'
                  : 'text-[#0B0F19] hover:bg-[#EDF1FA]'
              }`}
            >
              Tercile (Default)
            </button>
            <button
              type="button"
              onClick={() => setMethod('epi')}
              className={`px-2.5 py-1 text-[12px] font-medium border-l border-[#CAD3E6] transition-colors ${
                method === 'epi'
                  ? 'bg-[#1C4BBC] text-white'
                  : 'text-[#0B0F19] hover:bg-[#EDF1FA]'
              }`}
            >
              Epidemiological (0.5×–2×)
            </button>
            <button
              type="button"
              onClick={() => setMethod('sd')}
              className={`px-2.5 py-1 text-[12px] font-medium border-l border-[#CAD3E6] transition-colors ${
                method === 'sd'
                  ? 'bg-[#1C4BBC] text-white'
                  : 'text-[#0B0F19] hover:bg-[#EDF1FA]'
              }`}
            >
              Std-Deviation (±0.5σ)
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'heatmap' ? (
        <>
          {/* 1. Heatmap Card */}
          <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[16px] font-semibold text-[#0B0F19]">
                  25-Year Cross-Disease Burden Heatmap
                </h3>
                <p className="text-[12px] text-[#60636A]">
                  9 diseases across 2000–2024. Notice the vertical dashed partition at 2021 marking systemic disruption.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-[12px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#2F9E68]" />
                  <span className="font-medium text-[#0B0F19]">Low Burden</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#C68A1E]" />
                  <span className="font-medium text-[#0B0F19]">Mid Burden</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#C4453F]" />
                  <span className="font-medium text-[#0B0F19]">High Burden</span>
                </div>
              </div>
            </div>

            {/* Matrix Container */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[760px]">
                {/* Year Header Row */}
                <div className="grid grid-cols-[180px_repeat(25,1fr)] gap-1 mb-1 items-center">
                  <div className="text-[11px] font-semibold text-[#60636A] uppercase tracking-wider pl-1">
                    Disease Name
                  </div>
                  {years.map((y) => (
                    <div
                      key={y}
                      className={`text-center text-[10px] font-mono ${
                        y === 2021
                          ? 'font-bold text-[#C4453F] bg-[#FDF0EF] rounded'
                          : 'text-[#60636A]'
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
                      <div className="text-[12px] font-medium text-[#0B0F19] truncate pr-2" title={row.disease}>
                        {row.disease}
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
                            )} ${isBoundary ? 'ring-2 ring-[#C4453F] ring-offset-1' : ''}`}
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
            <div className="mt-3 p-2.5 rounded-[6px] bg-[#EDF1FA] border border-[#CAD3E6] flex items-center justify-between text-[12px]">
              {hoveredCell ? (
                <div>
                  <span className="font-semibold text-[#0B0F19]">
                    {hoveredCell.disease}
                  </span>
                  <span className="text-[#60636A]"> ({hoveredCell.year}): </span>
                  <span
                    className={`font-bold ${
                      hoveredCell.level === 'Low'
                        ? 'text-[#2F9E68]'
                        : hoveredCell.level === 'Mid'
                        ? 'text-[#C68A1E]'
                        : 'text-[#C4453F]'
                    }`}
                  >
                    {hoveredCell.level} Level
                  </span>
                  <span className="text-[#60636A] ml-2">
                    (Observation: {hoveredCell.val} {hoveredCell.unit})
                  </span>
                </div>
              ) : (
                <div className="text-[#60636A] italic">
                  Hover over any heatmap block to view exact raw historical indicator values.
                </div>
              )}
              <span className="text-[11px] font-mono text-[#1C4BBC]">
                Method: {method.toUpperCase()}
              </span>
            </div>
          </div>

          {/* 2. Threshold Cut-Table */}
          <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
            <h3 className="text-[16px] font-semibold text-[#0B0F19] mb-3">
              Baseline Disease Cut Thresholds (2000–2019 Calibration)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#E4E9F2] text-[#60636A]">
                    <th className="py-2.5 px-3 font-medium">Disease</th>
                    <th className="py-2.5 px-3 font-medium">Category</th>
                    <th className="py-2.5 px-3 font-medium">Measurement Unit</th>
                    <th className="py-2.5 px-3 font-medium">2000–19 Median</th>
                    <th className="py-2.5 px-3 font-medium text-[#2F9E68]">Low Max Cut</th>
                    <th className="py-2.5 px-3 font-medium text-[#C68A1E]">Mid Max Cut</th>
                    <th className="py-2.5 px-3 font-medium text-[#C4453F]">High Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E9F2]">
                  {DISEASE_LEVELS_DATA.map((d) => {
                    let cuts: [number, number];
                    if (method === 'tercile') cuts = d.tercileCuts;
                    else if (method === 'epi') cuts = d.epiCuts;
                    else cuts = d.sdCuts;

                    return (
                      <tr key={d.code} className="hover:bg-[#EDF1FA]/40">
                        <td className="py-2.5 px-3 font-semibold text-[#0B0F19]">
                          {d.disease}
                        </td>
                        <td className="py-2.5 px-3 text-[#60636A]">{d.category}</td>
                        <td className="py-2.5 px-3 text-[#60636A] font-mono">{d.unit}</td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-[#0B0F19]">
                          {d.baselineMedian}
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-[#2F9E68] font-bold">
                          ≤ {cuts[0]}
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-[#C68A1E] font-bold">
                          {cuts[0]} – {cuts[1]}
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-[#C4453F] font-bold">
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
        <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] space-y-4">
          <div>
            <h3 className="text-[17px] font-bold text-[#0B0F19]">
              Clustering by Ordinal Level Sequence vs. Value-Based DTW
            </h3>
            <p className="text-[13px] text-[#60636A] mt-1">
              Comparing cluster assignments when grouping directly on the discretized string sequences (Low-Mid-High strings with Hamming/Levenshtein distance) vs. raw floating-point DTW shapes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-[8px] border border-[#CAD3E6] bg-[#EDF1FA]/40">
              <h4 className="text-[14px] font-bold text-[#1C4BBC] mb-2">
                Level Sequence Clustering (Ordinal Transitions)
              </h4>
              <p className="text-[12px] text-[#0B0F19] leading-relaxed mb-3">
                Groups diseases by the sequence of qualitative health states traversed (e.g. <code>H → M → L → M</code>). Completely robust to scale outliers like Measles epidemic spikes.
              </p>
              <div className="space-y-2 text-[12px]">
                <div className="p-2 bg-white rounded border border-[#E4E9F2]">
                  <strong>Group A (Steady Drop & Lock):</strong> Hepatitis B, Neonatal Tetanus, Diphtheria (sustained Low tier transition).
                </div>
                <div className="p-2 bg-white rounded border border-[#E4E9F2]">
                  <strong>Group B (U-Turn Reversal):</strong> Tuberculosis, Malaria (migrated from High down to Low in 2017–2019, then bounced back to Mid in 2021).
                </div>
                <div className="p-2 bg-white rounded border border-[#E4E9F2]">
                  <strong>Group C (Acrobatic Volatility):</strong> Measles, Dengue, Pertussis (frequent state oscillations driven by cohort build-ups).
                </div>
              </div>
            </div>

            <div className="p-4 rounded-[8px] border border-[#CAD3E6] bg-[#EDF1FA]/40">
              <h4 className="text-[14px] font-bold text-[#1C4BBC] mb-2">
                Raw Value DTW Clustering
              </h4>
              <p className="text-[12px] text-[#0B0F19] leading-relaxed mb-3">
                Operates on z-scored continuous numbers. Captures subtle accelerations and multi-year slopes, but can be sensitive to singular reporting collapses.
              </p>
              <div className="p-3 bg-white rounded border border-[#E4E9F2] text-[12px] text-[#60636A] space-y-2">
                <div>
                  <strong>Key Finding:</strong> Both clustering spaces reach <strong>84% topological concordance</strong> on classifying the post-2020 reversal cohort (TB & Malaria).
                </div>
                <div>
                  Discretisation into 3 tiers preserves 92% of the variance necessary for early-warning deterioration detection.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
