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

export const DataQualityPage: React.FC = () => {
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
        <h1 className="text-[26px] md:text-[30px] font-bold text-[#0B0F19]">
          Dataset Understanding & Four Data-Quality Traps
        </h1>
        <p className="text-[14px] text-[#60636A] mt-1 max-w-4xl">
          Detailed audit of the WHO Global Health Observatory repository for Myanmar. Demonstrates specific problem identification, schema extraction, and cleansing safeguards executed prior to mining.
        </p>
      </div>

      {/* 1. Dataset Profile Card */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <h3 className="text-[16px] font-semibold text-[#0B0F19] mb-4">
          Core Repository Profile & Dimension Types
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-5 border-b border-[#E4E9F2]">
          <div>
            <span className="text-[12px] text-[#60636A]">Total Observations</span>
            <div className="text-[24px] font-bold text-[#0B0F19] tabular-nums">20,613</div>
            <span className="text-[11px] text-[#2F9E68]">100% verified schema</span>
          </div>
          <div>
            <span className="text-[12px] text-[#60636A]">Unique Indicators</span>
            <div className="text-[24px] font-bold text-[#0B0F19] tabular-nums">644</div>
            <span className="text-[11px] text-[#60636A]">Across 11 WHO domains</span>
          </div>
          <div>
            <span className="text-[12px] text-[#60636A]">Temporal Span</span>
            <div className="text-[24px] font-bold text-[#0B0F19] tabular-nums">1961–2030</div>
            <span className="text-[11px] text-[#60636A]">Historical & projected</span>
          </div>
          <div>
            <span className="text-[12px] text-[#60636A]">Disaggregation Rate</span>
            <div className="text-[24px] font-bold text-[#0B0F19] tabular-nums">42.6%</div>
            <span className="text-[11px] text-[#1C4BBC]">8,771 disaggregated rows</span>
          </div>
        </div>

        {/* Small Dimension Breakdown Table */}
        <div className="mt-4">
          <div className="text-[13px] font-semibold text-[#0B0F19] mb-2">
            Disaggregation Dimension Breakdown
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#E4E9F2] text-[#60636A]">
                  <th className="py-2 font-medium">Dimension Code</th>
                  <th className="py-2 font-medium">Description</th>
                  <th className="py-2 font-medium">Row Count</th>
                  <th className="py-2 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9F2]">
                <tr>
                  <td className="py-2 font-semibold text-[#0B0F19]">TOTAL</td>
                  <td className="py-2 text-[#60636A]">National aggregated indicators</td>
                  <td className="py-2 font-mono tabular-nums text-[#0B0F19]">11,842</td>
                  <td className="py-2 text-[#60636A]">57.4%</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-[#0B0F19]">SEX</td>
                  <td className="py-2 text-[#60636A]">Male / Female / Both Sexes</td>
                  <td className="py-2 font-mono tabular-nums text-[#0B0F19]">5,120</td>
                  <td className="py-2 text-[#60636A]">24.8%</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-[#0B0F19]">RESIDENCEAREATYPE</td>
                  <td className="py-2 text-[#60636A]">Urban vs. Rural splits</td>
                  <td className="py-2 font-mono tabular-nums text-[#0B0F19]">1,740</td>
                  <td className="py-2 text-[#60636A]">8.4%</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-[#0B0F19]">AGEGROUP</td>
                  <td className="py-2 text-[#60636A]">5-year cohorts and child brackets</td>
                  <td className="py-2 font-mono tabular-nums text-[#0B0F19]">1,438</td>
                  <td className="py-2 text-[#60636A]">7.0%</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-[#0B0F19]">ALCOHOLTYPE / SEVERITY</td>
                  <td className="py-2 text-[#60636A]">Beverage category and clinical stages</td>
                  <td className="py-2 font-mono tabular-nums text-[#0B0F19]">473</td>
                  <td className="py-2 text-[#60636A]">2.4%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Value-Type Interactive Segments */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0F19]">
              Value-Type Distribution
            </h3>
            <p className="text-[12px] text-[#60636A]">
              Click any segment below to inspect preprocessing resolution
            </p>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#EDF1FA] text-[#1C4BBC]">
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
                backgroundColor: t.color,
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
                    ? 'border-[#1C4BBC] bg-[#DDE4F5]/40 shadow-[0_1px_2px_rgba(11,15,25,0.06)]'
                    : 'border-[#E4E9F2] hover:border-[#CAD3E6] bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="text-[13px] font-semibold text-[#0B0F19]">
                      {t.type}
                    </span>
                  </div>
                  <span className="text-[12px] font-mono tabular-nums text-[#60636A]">
                    {t.pct}
                  </span>
                </div>
                <div className="text-[18px] font-bold text-[#0B0F19] tabular-nums">
                  {t.count.toLocaleString()} rows
                </div>
                <p className="text-[11px] text-[#60636A] mt-2 leading-relaxed">
                  {t.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. The Four Data-Quality Problems (Interactive Stepper / Accordion) */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C4453F] mb-1">
            CRISP-DM DATA PREPARATION
          </div>
          <h3 className="text-[18px] font-bold text-[#0B0F19]">
            The Four Data-Quality Traps & Cleansing Safeguards
          </h3>
          <p className="text-[13px] text-[#60636A] mt-1">
            Crucial engineering fixes implemented in pandas/NumPy to prevent invalid inferences and spurious correlations.
          </p>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 border-b border-[#E4E9F2] pb-3">
          {FOUR_TRAPS.map((trap) => {
            const isActive = activeTrap === trap.id;
            return (
              <button
                key={trap.id}
                type="button"
                onClick={() => setActiveTrap(trap.id)}
                className={`text-left p-2.5 rounded-[6px] transition-colors ${
                  isActive
                    ? 'bg-[#1C4BBC] text-white'
                    : 'bg-[#EDF1FA] text-[#0B0F19] hover:bg-[#DDE4F5]'
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
            <div className="p-4 rounded-[8px] bg-[#EDF1FA]/60 border border-[#CAD3E6] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#C4453F] text-white">
                    Trap #{trap.number}
                  </span>
                  <h4 className="text-[16px] font-bold text-[#0B0F19] mt-1">
                    {trap.title}
                  </h4>
                </div>
                <div className="text-[12px] font-semibold text-[#1C4BBC] bg-white px-3 py-1 rounded-[6px] border border-[#CAD3E6] self-start">
                  Impacted: {trap.affectedCount} instances
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3.5 rounded-[6px] border border-[#E4E9F2]">
                  <div className="text-[12px] font-bold text-[#C4453F] mb-1 flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Identified Vulnerability
                  </div>
                  <p className="text-[12px] text-[#0B0F19] leading-relaxed">
                    {trap.problem}
                  </p>
                  <p className="text-[11px] text-[#60636A] mt-2 italic">
                    Impact: {trap.impact}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-[6px] border border-[#E4E9F2]">
                  <div className="text-[12px] font-bold text-[#2F9E68] mb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Pipeline Solution Implemented
                  </div>
                  <p className="text-[12px] text-[#0B0F19] leading-relaxed">
                    {trap.fix}
                  </p>
                </div>
              </div>

              {/* Before & After Example Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C4453F] mb-1">
                    Before Cleansing (Raw GHO Record)
                  </div>
                  <div className="bg-white rounded-[6px] border border-[#E4E9F2] overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <tbody className="divide-y divide-[#E4E9F2]">
                        {trap.exampleBefore.map((row, i) => (
                          <tr key={i} className="p-2">
                            {Object.entries(row).map(([k, v]) => (
                              <td key={k} className="p-2">
                                <span className="font-medium text-[#60636A]">{k}: </span>
                                <span className="text-[#C4453F] font-mono">{v}</span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#2F9E68] mb-1">
                    After Cleansing (Prepared Mining Dataset)
                  </div>
                  <div className="bg-white rounded-[6px] border border-[#E4E9F2] overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <tbody className="divide-y divide-[#E4E9F2]">
                        {trap.exampleAfter.map((row, i) => (
                          <tr key={i} className="p-2">
                            {Object.entries(row).map(([k, v]) => (
                              <td key={k} className="p-2">
                                <span className="font-medium text-[#60636A]">{k}: </span>
                                <span className="text-[#2F9E68] font-mono">{v}</span>
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
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0F19]">
              WHO Thematic Domain Taxonomy (Table 2.5)
            </h3>
            <p className="text-[12px] text-[#60636A]">
              Sortable mapping of indicators, raw row volumes, and observation density per domain
            </p>
          </div>
          <span className="text-[11px] text-[#60636A]">Click headers to sort</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E4E9F2] text-[#60636A]">
                <th className="py-2.5 px-3 font-medium">Domain</th>
                <th className="py-2.5 px-3 font-medium">Name</th>
                <th
                  onClick={() => toggleDomainSort('indicators')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>Indicators</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => toggleDomainSort('rows')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>Total Rows</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => toggleDomainSort('obsPerInd')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>Obs / Indicator</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-medium">Span</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9F2]">
              {sortedDomains.map((d) => (
                <tr key={d.code} className="hover:bg-[#EDF1FA]/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-[#1C4BBC]">
                    {d.code}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#0B0F19]">{d.name}</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-[#0B0F19]">
                    {d.indicators}
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-[#0B0F19]">
                    {d.rows.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-[#0B0F19]">
                    {d.obsPerInd.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3 text-[12px] text-[#60636A] font-mono">
                    {d.coverage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Unit Inference Summary */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <div className="mb-3">
          <h3 className="text-[16px] font-semibold text-[#0B0F19]">
            Unit-Inference Taxonomy (Resolving Trap 2)
          </h3>
          <p className="text-[12px] text-[#60636A]">
            Standardized physical unit categories inferred via regex pattern matching on raw metadata strings
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E4E9F2] text-[#60636A]">
                <th className="py-2 font-medium">Inferred Measurement Unit</th>
                <th className="py-2 font-medium">Indicators</th>
                <th className="py-2 font-medium">Rows</th>
                <th className="py-2 font-medium">Representative Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9F2]">
              {UNIT_SUMMARY.map((u, i) => (
                <tr key={i} className="hover:bg-[#EDF1FA]/40">
                  <td className="py-2.5 font-semibold text-[#0B0F19]">{u.unit}</td>
                  <td className="py-2.5 font-mono tabular-nums text-[#0B0F19]">{u.indicators}</td>
                  <td className="py-2.5 font-mono tabular-nums text-[#60636A]">{u.rows.toLocaleString()}</td>
                  <td className="py-2.5 text-[12px] text-[#60636A] italic">{u.example}</td>
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
