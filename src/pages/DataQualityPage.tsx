import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { DataDownloads } from '../components/DataDownloads';
import {
  DATASET_STATS,
  VALUE_TYPES,
  FOUR_TRAPS,
  DOMAINS,
  UNIT_SUMMARY,
} from '../data/miningData';
import { useTheme } from '../theme/ThemeContext';

export const DataQualityPage: React.FC = () => {
  const { colors } = useTheme();
  const [selectedType, setSelectedType] = useState<number | null>(0);
  const [activeTrap, setActiveTrap] = useState<string>('trap-1');
  const [domainSortKey, setDomainSortKey] = useState<'indicators' | 'rows' | 'obsPerInd'>('indicators');
  const [domainSortAsc, setDomainSortAsc] = useState<boolean>(false);

  const sortedDomains = [...DOMAINS].sort((a, b) => {
    const valA = a[domainSortKey];
    const valB = b[domainSortKey];
    return domainSortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
  });

  const toggleDomainSort = (key: 'indicators' | 'rows' | 'obsPerInd') => {
    if (domainSortKey === key) {
      setDomainSortAsc(!domainSortAsc);
    } else {
      setDomainSortKey(key);
      setDomainSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[var(--c-ink)]">
          Dataset Understanding & Four Data-Quality Traps
        </h1>
        <p className="text-[14px] text-[var(--c-muted)] mt-1 max-w-4xl">
          Detailed audit of the WHO Global Health Observatory repository for Myanmar. Demonstrates specific problem identification, schema extraction, and cleansing safeguards executed prior to mining.
        </p>
      </div>

      {/* 1. Dataset Profile Card */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <h3 className="text-[16px] font-semibold text-[var(--c-ink)] mb-4">
          Core Repository Profile & Dimension Types
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-5 border-b border-[var(--c-border)]">
          <div>
            <span className="text-[12px] text-[var(--c-muted)]">Total Observations</span>
            <div className="text-[24px] font-bold text-[var(--c-ink)] tabular-nums">20,613</div>
            <span className="text-[11px] text-[var(--c-success)]">100% verified schema</span>
          </div>
          <div>
            <span className="text-[12px] text-[var(--c-muted)]">Unique Indicators</span>
            <div className="text-[24px] font-bold text-[var(--c-ink)] tabular-nums">644</div>
            <span className="text-[11px] text-[var(--c-muted)]">Across 11 WHO domains</span>
          </div>
          <div>
            <span className="text-[12px] text-[var(--c-muted)]">Temporal Span</span>
            <div className="text-[24px] font-bold text-[var(--c-ink)] tabular-nums">1961–2030</div>
            <span className="text-[11px] text-[var(--c-muted)]">Historical & projected</span>
          </div>
          <div>
            <span className="text-[12px] text-[var(--c-muted)]">Disaggregation Rate</span>
            <div className="text-[24px] font-bold text-[var(--c-ink)] tabular-nums">42.6%</div>
            <span className="text-[11px] text-[var(--c-primary)]">8,771 disaggregated rows</span>
          </div>
        </div>

        {/* Small Dimension Breakdown Table */}
        <div className="mt-4">
          <div className="text-[13px] font-semibold text-[var(--c-ink)] mb-2">
            Disaggregation Dimension Breakdown
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[var(--c-border)] text-[var(--c-muted)]">
                  <th className="py-2 font-medium">Dimension Code</th>
                  <th className="py-2 font-medium">Description</th>
                  <th className="py-2 font-medium">Row Count</th>
                  <th className="py-2 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--c-border)]">
                <tr>
                  <td className="py-2 font-semibold text-[var(--c-ink)]">TOTAL</td>
                  <td className="py-2 text-[var(--c-muted)]">National aggregated indicators</td>
                  <td className="py-2 font-mono tabular-nums text-[var(--c-ink)]">11,842</td>
                  <td className="py-2 text-[var(--c-muted)]">57.4%</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-[var(--c-ink)]">SEX</td>
                  <td className="py-2 text-[var(--c-muted)]">Male / Female / Both Sexes</td>
                  <td className="py-2 font-mono tabular-nums text-[var(--c-ink)]">5,120</td>
                  <td className="py-2 text-[var(--c-muted)]">24.8%</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-[var(--c-ink)]">RESIDENCEAREATYPE</td>
                  <td className="py-2 text-[var(--c-muted)]">Urban vs. Rural splits</td>
                  <td className="py-2 font-mono tabular-nums text-[var(--c-ink)]">1,740</td>
                  <td className="py-2 text-[var(--c-muted)]">8.4%</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-[var(--c-ink)]">AGEGROUP</td>
                  <td className="py-2 text-[var(--c-muted)]">5-year cohorts and child brackets</td>
                  <td className="py-2 font-mono tabular-nums text-[var(--c-ink)]">1,438</td>
                  <td className="py-2 text-[var(--c-muted)]">7.0%</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-[var(--c-ink)]">ALCOHOLTYPE / SEVERITY</td>
                  <td className="py-2 text-[var(--c-muted)]">Beverage category and clinical stages</td>
                  <td className="py-2 font-mono tabular-nums text-[var(--c-ink)]">473</td>
                  <td className="py-2 text-[var(--c-muted)]">2.4%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Value-Type Interactive Segments */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">
              Value-Type Distribution
            </h3>
            <p className="text-[12px] text-[var(--c-muted)]">
              Click any segment below to inspect preprocessing resolution
            </p>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[var(--c-subtle)] text-[var(--c-primary)]">
            Interactive Inspector
          </span>
        </div>

        {/* Stacked Proportional Bar */}
        <div className="h-6 w-full flex rounded-[6px] overflow-hidden mb-4">
          {VALUE_TYPES.map((t, idx) => (
            <div
              key={t.type}
              onClick={() => setSelectedType(idx)}
              className="h-full cursor-pointer transition-opacity hover:opacity-90"
              style={{
                width: t.pct,
                backgroundColor: colors[t.colorKey],
              }}
              title={`${t.type}: ${t.count.toLocaleString()} (${t.pct})`}
            />
          ))}
        </div>

        {/* Segment Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {VALUE_TYPES.map((t, idx) => {
            const isSelected = selectedType === idx;
            return (
              <div
                key={t.type}
                onClick={() => setSelectedType(idx)}
                className={`p-3.5 rounded-[8px] border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[var(--c-primary)] bg-[var(--c-subtle-2)]/40 shadow-[var(--c-shadow-sm)]'
                    : 'border-[var(--c-border)] hover:border-[var(--c-border-strong)] bg-[var(--c-surface)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: colors[t.colorKey] }}
                    />
                    <span className="text-[13px] font-semibold text-[var(--c-ink)]">
                      {t.type}
                    </span>
                  </div>
                  <span className="text-[12px] font-mono tabular-nums text-[var(--c-muted)]">
                    {t.pct}
                  </span>
                </div>
                <div className="text-[18px] font-bold text-[var(--c-ink)] tabular-nums">
                  {t.count.toLocaleString()} rows
                </div>
                <p className="text-[11px] text-[var(--c-muted)] mt-2 leading-relaxed">
                  {t.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. The Four Data-Quality Problems (Interactive Stepper / Accordion) */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--c-danger)] mb-1">
            CRISP-DM DATA PREPARATION
          </div>
          <h3 className="text-[18px] font-bold text-[var(--c-ink)]">
            The Four Data-Quality Traps & Cleansing Safeguards
          </h3>
          <p className="text-[13px] text-[var(--c-muted)] mt-1">
            Crucial engineering fixes implemented in pandas/NumPy to prevent invalid inferences and spurious correlations.
          </p>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 border-b border-[var(--c-border)] pb-3">
          {FOUR_TRAPS.map((trap) => {
            const isActive = activeTrap === trap.id;
            return (
              <button
                key={trap.id}
                type="button"
                onClick={() => setActiveTrap(trap.id)}
                className={`text-left p-2.5 rounded-[6px] transition-colors ${
                  isActive
                    ? 'bg-[var(--c-primary)] text-white'
                    : 'bg-[var(--c-subtle)] text-[var(--c-ink)] hover:bg-[var(--c-subtle-2)]'
                }`}
              >
                <div className="text-[11px] font-semibold uppercase opacity-80">
                  Trap {trap.number}
                </div>
                <div className="text-[12px] font-bold truncate">
                  {trap.title.split(' ')[0]} {trap.title.split(' ')[1]}...
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Trap Detailed Card */}
        {(() => {
          const trap = FOUR_TRAPS.find((t) => t.id === activeTrap)!;
          return (
            <div className="p-4 rounded-[8px] bg-[var(--c-subtle)]/60 border border-[var(--c-border-strong)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[var(--c-danger)] text-white">
                    Trap #{trap.number}
                  </span>
                  <h4 className="text-[16px] font-bold text-[var(--c-ink)] mt-1">
                    {trap.title}
                  </h4>
                </div>
                <div className="text-[12px] font-semibold text-[var(--c-primary)] bg-[var(--c-surface)] px-3 py-1 rounded-[6px] border border-[var(--c-border-strong)] self-start">
                  Impacted: {trap.affectedCount} instances
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--c-surface)] p-3.5 rounded-[6px] border border-[var(--c-border)]">
                  <div className="text-[12px] font-bold text-[var(--c-danger)] mb-1 flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Identified Vulnerability
                  </div>
                  <p className="text-[12px] text-[var(--c-ink)] leading-relaxed">
                    {trap.problem}
                  </p>
                  <p className="text-[11px] text-[var(--c-muted)] mt-2 italic">
                    Impact: {trap.impact}
                  </p>
                </div>

                <div className="bg-[var(--c-surface)] p-3.5 rounded-[6px] border border-[var(--c-border)]">
                  <div className="text-[12px] font-bold text-[var(--c-success)] mb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Pipeline Solution Implemented
                  </div>
                  <p className="text-[12px] text-[var(--c-ink)] leading-relaxed">
                    {trap.fix}
                  </p>
                </div>
              </div>

              {/* Before & After Example Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--c-danger)] mb-1">
                    Before Cleansing (Raw GHO Record)
                  </div>
                  <div className="bg-[var(--c-surface)] rounded-[6px] border border-[var(--c-border)] overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <tbody className="divide-y divide-[var(--c-border)]">
                        {trap.exampleBefore.map((row, i) => (
                          <tr key={i} className="p-2">
                            {Object.entries(row).map(([k, v]) => (
                              <td key={k} className="p-2">
                                <span className="font-medium text-[var(--c-muted)]">{k}: </span>
                                <span className="text-[var(--c-danger)] font-mono">{v}</span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--c-success)] mb-1">
                    After Cleansing (Prepared Mining Dataset)
                  </div>
                  <div className="bg-[var(--c-surface)] rounded-[6px] border border-[var(--c-border)] overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <tbody className="divide-y divide-[var(--c-border)]">
                        {trap.exampleAfter.map((row, i) => (
                          <tr key={i} className="p-2">
                            {Object.entries(row).map(([k, v]) => (
                              <td key={k} className="p-2">
                                <span className="font-medium text-[var(--c-muted)]">{k}: </span>
                                <span className="text-[var(--c-success)] font-mono">{v}</span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 4. Domain Taxonomy Table */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">
              WHO Thematic Domain Taxonomy (Table 2.5)
            </h3>
            <p className="text-[12px] text-[var(--c-muted)]">
              Sortable mapping of indicators, raw row volumes, and observation density per domain
            </p>
          </div>
          <span className="text-[11px] text-[var(--c-muted)]">Click headers to sort</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--c-border)] text-[var(--c-muted)]">
                <th className="py-2.5 px-3 font-medium">Domain</th>
                <th className="py-2.5 px-3 font-medium">Name</th>
                <th
                  onClick={() => toggleDomainSort('indicators')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[var(--c-primary)]"
                >
                  <div className="flex items-center gap-1">
                    <span>Indicators</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => toggleDomainSort('rows')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[var(--c-primary)]"
                >
                  <div className="flex items-center gap-1">
                    <span>Total Rows</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => toggleDomainSort('obsPerInd')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[var(--c-primary)]"
                >
                  <div className="flex items-center gap-1">
                    <span>Obs / Indicator</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-medium">Span</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--c-border)]">
              {sortedDomains.map((d) => (
                <tr key={d.code} className="hover:bg-[var(--c-subtle)]/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-[var(--c-primary)]">
                    {d.code}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[var(--c-ink)]">{d.name}</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-[var(--c-ink)]">
                    {d.indicators}
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-[var(--c-ink)]">
                    {d.rows.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-[var(--c-ink)]">
                    {d.obsPerInd.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3 text-[12px] text-[var(--c-muted)] font-mono">
                    {d.coverage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Unit Inference Summary */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <div className="mb-3">
          <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">
            Unit-Inference Taxonomy (Resolving Trap 2)
          </h3>
          <p className="text-[12px] text-[var(--c-muted)]">
            Standardized physical unit categories inferred via regex pattern matching on raw metadata strings
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--c-border)] text-[var(--c-muted)]">
                <th className="py-2 font-medium">Inferred Measurement Unit</th>
                <th className="py-2 font-medium">Indicators</th>
                <th className="py-2 font-medium">Rows</th>
                <th className="py-2 font-medium">Representative Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--c-border)]">
              {UNIT_SUMMARY.map((u, i) => (
                <tr key={i} className="hover:bg-[var(--c-subtle)]/40">
                  <td className="py-2.5 font-semibold text-[var(--c-ink)]">{u.unit}</td>
                  <td className="py-2.5 font-mono tabular-nums text-[var(--c-ink)]">{u.indicators}</td>
                  <td className="py-2.5 font-mono tabular-nums text-[var(--c-muted)]">{u.rows.toLocaleString()}</td>
                  <td className="py-2.5 text-[12px] text-[var(--c-muted)] italic">{u.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Dataset Downloads */}
      <DataDownloads />
    </div>
  );
};
