import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import {
  X,
  TrendingDown,
  ArrowUpDown,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { Badge } from '../components/Badge';
import { Callout } from '../components/Callout';
import { REVERSAL_ITEMS } from '../data/miningData';
import { ReversalItem } from '../types';

export const ReversalPage: React.FC = () => {
  const [filterVerdict, setFilterVerdict] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<ReversalItem | null>(REVERSAL_ITEMS[0]);
  const [sortKey, setSortKey] = useState<keyof ReversalItem>('pctWorseThanBest');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const filteredItems = REVERSAL_ITEMS.filter((item) => {
    if (filterVerdict === 'All') return true;
    return item.verdict === filterVerdict;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    if (typeof valA === 'string') {
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    }

    return sortAsc
      ? (valA as number) > (valB as number)
        ? 1
        : -1
      : (valA as number) < (valB as number)
      ? 1
      : -1;
  });

  const handleSort = (key: keyof ReversalItem) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[#0B0F19]">
          Reversal Detection & Structural Breakpoints
        </h1>
        <p className="text-[14px] text-[#60636A] mt-1 max-w-4xl">
          Identifying health indicators that achieved sustained historical progress before suffering acute trend reversals or steady post-2020 deteriorations.
        </p>
      </div>

      {/* 1. KPI Row (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          kicker="ANALYSED"
          label="Target Indicators"
          value="14"
          subtext="With continuous longitudinal records"
        />
        <KPICard
          kicker="CRITICAL"
          label="Acute Reversals"
          value="3"
          subtext="TB, Malaria, Immunisation (DTP3/MCV1)"
          badge={{ text: 'Reversal', variant: 'danger' }}
        />
        <KPICard
          kicker="CONCERN"
          label="Steady Worsening"
          value="3"
          subtext="Under-5, Maternal, Neonatal mortality"
          badge={{ text: 'Worsening', variant: 'warning' }}
        />
        <KPICard
          kicker="RESILIENT"
          label="Improving / Intact"
          value="8"
          subtext="HIV, HepB, Stunting, Suicide, WASH"
          badge={{ text: 'Improving', variant: 'success' }}
        />
      </div>

      {/* Pinned Callouts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Callout type="danger" title="Tuberculosis Loss of Progress" kicker="REVERSAL FINDING">
          Tuberculosis incidence reversed after 2020 (338 → 375 per 100k), causing an estimated <strong className="font-bold">12.2 years of progress lost</strong>, returning the national burden to approximately 2011 levels.
        </Callout>

        <Callout type="danger" title="Malaria Resurgence Magnitude" kicker="EPIDEMIOLOGICAL SURGE">
          Malaria incidence reached an all-time regional elimination low of 1.4 per 1,000 in 2019 before exploding to 12.1 per 1,000 in 2023 — an astonishing <strong className="font-bold">765% increase</strong> over its baseline nadir.
        </Callout>
      </div>

      {/* 2. Filter Chips & Table Header */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0F19]">
              Reversal Summary Table (14 Indicators)
            </h3>
            <p className="text-[12px] text-[#60636A]">
              Click any row below to inspect its detailed historical trajectory and breakpoint drawer
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Reversal', 'Steady worsening', 'Improving'].map((v) => {
              const isActive = filterVerdict === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setFilterVerdict(v)}
                  className={`px-3 py-1 text-[12px] font-medium rounded-[6px] transition-colors ${
                    isActive
                      ? 'bg-[#1C4BBC] text-white'
                      : 'bg-[#EDF1FA] text-[#0B0F19] hover:bg-[#DDE4F5]'
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Main Sortable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E4E9F2] text-[#60636A]">
                <th
                  onClick={() => handleSort('indicator')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>Indicator</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('breakpointYear')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>Breakpoint</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('bestYear')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>Best Year (Val)</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pctWorseThanBest')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>% Worse vs Best</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('verdict')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>Verdict Status</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('yearsLost')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>Years Lost</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9F2]">
              {sortedItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#DDE4F5]'
                        : 'hover:bg-[#EDF1FA]/60'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#0B0F19]">{item.indicator}</div>
                      <div className="text-[11px] text-[#60636A]">{item.domain}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#0B0F19]">
                      {item.breakpointYear}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-[#0B0F19]">
                      {item.bestYear} ({item.bestValue})
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">
                      {item.pctWorseThanBest > 0 ? (
                        <span className="text-[#C4453F] font-semibold">
                          +{item.pctWorseThanBest.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-[#2F9E68]">0.0%</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={
                          item.verdict === 'Reversal'
                            ? 'danger'
                            : item.verdict === 'Steady worsening'
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {item.verdict}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0B0F19]">
                      {typeof item.yearsLost === 'number' && item.yearsLost > 0 ? (
                        <span className="text-[#C4453F]">~{item.yearsLost} yrs</span>
                      ) : (
                        <span className="text-[#60636A]">0</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Row Click -> Detail Trajectory Drawer / Panel */}
      {selectedItem && (
        <div className="bg-white border border-[#1C4BBC] rounded-[8px] p-5 shadow-[0_4px_12px_rgba(28,75,188,0.08)] animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-[#E4E9F2]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1C4BBC]">
                  SELECTED INDICATOR TRAJECTORY
                </span>
                <Badge
                  variant={
                    selectedItem.verdict === 'Reversal'
                      ? 'danger'
                      : selectedItem.verdict === 'Steady worsening'
                      ? 'warning'
                      : 'success'
                  }
                >
                  {selectedItem.verdict}
                </Badge>
              </div>
              <h3 className="text-[18px] font-bold text-[#0B0F19] mt-0.5">
                {selectedItem.indicator}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-[13px]">
              <div>
                <span className="text-[#60636A]">Best Year: </span>
                <strong className="text-[#0B0F19] font-mono">{selectedItem.bestYear}</strong>
              </div>
              <div>
                <span className="text-[#60636A]">Breakpoint: </span>
                <strong className="text-[#C4453F] font-mono">{selectedItem.breakpointYear}</strong>
              </div>
              <div>
                <span className="text-[#60636A]">Years Lost: </span>
                <strong className="text-[#C4453F] font-mono">
                  {selectedItem.yearsLost > 0 ? `~${selectedItem.yearsLost} yrs` : 'None'}
                </strong>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedItem.history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#CAD3E6" vertical={false} />
                  <XAxis dataKey="year" stroke="#60636A" fontSize={12} tickLine={false} />
                  <YAxis stroke="#60636A" fontSize={12} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E4E9F2',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  {typeof selectedItem.breakpointYear === 'number' && (
                    <ReferenceLine
                      x={selectedItem.breakpointYear}
                      stroke="#C4453F"
                      strokeDasharray="4 4"
                      label={{
                        value: `Breakpoint (${selectedItem.breakpointYear})`,
                        position: 'top',
                        fill: '#C4453F',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {typeof selectedItem.bestYear === 'number' && (
                    <ReferenceDot
                      x={selectedItem.bestYear}
                      y={selectedItem.bestValue}
                      r={5}
                      fill="#2F9E68"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Observed Value"
                    stroke={selectedItem.verdict === 'Improving' ? '#2F9E68' : '#1C4BBC'}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#EDF1FA]/60 p-4 rounded-[8px] border border-[#CAD3E6] flex flex-col justify-between">
              <div>
                <h4 className="text-[13px] font-bold text-[#0B0F19] mb-1.5">
                  Analytical Narrative
                </h4>
                <p className="text-[12px] text-[#0B0F19] leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#CAD3E6] space-y-1.5 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[#60636A]">Domain Category:</span>
                  <span className="font-semibold text-[#0B0F19]">{selectedItem.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#60636A]">Best Value Recorded:</span>
                  <span className="font-mono text-[#2F9E68] font-bold">{selectedItem.bestValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#60636A]">Current Observation:</span>
                  <span className="font-mono text-[#0B0F19] font-bold">{selectedItem.currentValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
