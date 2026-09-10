import React, { useState } from 'react';
import {
  Network,
  ArrowRight,
  ArrowUpDown,
  AlertTriangle,
  Info,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Callout } from '../components/Callout';
import { Badge } from '../components/Badge';
import { ASSOCIATION_RULES } from '../data/miningData';
import { AssociationRuleItem } from '../types';

export const AssociationRulesPage: React.FC = () => {
  const [sortKey, setSortKey] = useState<keyof AssociationRuleItem>('lift');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const topRules = ASSOCIATION_RULES.slice(0, 6);

  const sortedRules = [...ASSOCIATION_RULES].sort((a, b) => {
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

  const handleSort = (key: keyof AssociationRuleItem) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Lag chip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[26px] md:text-[30px] font-bold text-[#0B0F19]">
            Lagged Association Rule Mining (Apriori)
          </h1>
          <p className="text-[14px] text-[#60636A] mt-1 max-w-3xl">
            Mining temporal dependencies between discrete immunization coverage tiers (at lag t-1) and downstream infectious disease incidence (at time t).
          </p>
        </div>

        {/* 1. Lag indicator chip */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-3 py-1.5 rounded-[8px] border border-[#CAD3E6] shadow-sm">
          <Clock size={16} className="text-[#1C4BBC]" />
          <span className="text-[12px] font-semibold text-[#60636A]">Temporal Alignment:</span>
          <span className="text-[12px] font-mono font-bold text-[#1C4BBC] bg-[#DDE4F5] px-2 py-0.5 rounded">
            Best Lag = 1 Year (t-1)
          </span>
        </div>
      </div>

      {/* 4. PERMANENT CAUTION PANEL (Mandatory in spec) */}
      <div className="rounded-[8px] border border-[#F2DEB0] bg-[#FCF5E8] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] border-l-4 border-l-[#C68A1E]">
        <div className="flex items-start gap-3.5">
          <ShieldAlert size={22} className="text-[#C68A1E] shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C68A1E] mb-0.5">
              CRITICAL METHODOLOGICAL CAVEAT · CO-TRENDING CONFOUND
            </div>
            <h3 className="text-[16px] font-bold text-[#0B0F19] mb-1">
              Top Rule R1 (HepB_HIGH & MCV2_HIGH → Diphtheria_HIGH) is Non-Causal
            </h3>
            <p className="text-[13px] text-[#0B0F19] leading-relaxed">
              In naive mining, Rule R1 exhibits the highest lift (2.45) and confidence (0.92). Biologically and clinically, higher immunisation does <em>not</em> cause diphtheria outbreaks. This is an artifact of <strong>shared temporal co-trending</strong>: during Myanmar’s 2000–2018 health expansion, both new vaccine rollouts (HepB, MCV2) and national epidemiological laboratory surveillance capacity scaled up concurrently.
            </p>
            <div className="mt-2 text-[12px] text-[#60636A] font-medium bg-white/60 p-2.5 rounded border border-[#F2DEB0]">
              Key Lesson: Apriori mining on non-stationary national time-series must be audited against domain causality. Real protective rules (such as <code>DTP3_LOW → Measles_HIGH</code>) operate on counter-trending mechanics.
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Rule Cards (Grid of 6) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0F19]">
              Featured Association Rules (Ranked by Lift)
            </h3>
            <p className="text-[12px] text-[#60636A]">
              Antecedent conditions at year (t-1) and consequent health status at year (t)
            </p>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#EDF1FA] text-[#1C4BBC]">
            Min Support ≥ 0.15 · Min Conf ≥ 0.65
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topRules.map((rule) => (
            <div
              key={rule.id}
              className={`bg-white rounded-[8px] p-4 shadow-[0_1px_2px_rgba(11,15,25,0.06)] border ${
                rule.isCoTrendingConfound
                  ? 'border-[#C68A1E] ring-1 ring-[#C68A1E]/30'
                  : 'border-[#E4E9F2]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#EDF1FA] text-[#1C4BBC]">
                  Rule {rule.id}
                </span>
                {rule.isCoTrendingConfound && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FCF5E8] text-[#C68A1E] border border-[#F2DEB0]">
                    Co-Trending Confound
                  </span>
                )}
              </div>

              {/* Antecedent -> Consequent */}
              <div className="my-3 space-y-1.5">
                <div className="text-[12px] font-mono font-semibold text-[#0B0F19] bg-[#EDF1FA]/60 p-2 rounded border border-[#E4E9F2]">
                  {rule.antecedent}
                </div>
                <div className="flex justify-center text-[#60636A]">
                  <ArrowRight size={14} className="rotate-90 md:rotate-0" />
                </div>
                <div className="text-[12px] font-mono font-semibold text-[#1C4BBC] bg-[#DDE4F5]/60 p-2 rounded border border-[#CAD3E6]">
                  {rule.consequent}
                </div>
              </div>

              {/* Badges: Support / Confidence / Lift */}
              <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-[#E4E9F2] text-center">
                <div>
                  <div className="text-[10px] text-[#60636A] uppercase font-medium">Support</div>
                  <div className="text-[13px] font-mono font-bold text-[#0B0F19]">
                    {(rule.support * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#60636A] uppercase font-medium">Confidence</div>
                  <div className="text-[13px] font-mono font-bold text-[#0B0F19]">
                    {(rule.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#60636A] uppercase font-medium">Lift</div>
                  <div className="text-[13px] font-mono font-bold text-[#1C4BBC]">
                    {rule.lift.toFixed(2)}×
                  </div>
                </div>
              </div>

              <p className="mt-2.5 text-[11px] text-[#60636A] leading-relaxed">
                {rule.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Full Sortable Table (All 14 Rules) */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0F19]">
              Full Mined Rule Catalog (14 Rules)
            </h3>
            <p className="text-[12px] text-[#60636A]">
              Click any metric column header to sort rules by strength or prevalence
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E4E9F2] text-[#60636A]">
                <th
                  onClick={() => handleSort('id')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>ID</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-medium">Antecedent (t-1)</th>
                <th className="py-2.5 px-3 font-medium">Consequent (t)</th>
                <th
                  onClick={() => handleSort('support')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>Support</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('confidence')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>Confidence</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('lift')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#1C4BBC]"
                >
                  <div className="flex items-center gap-1">
                    <span>Lift</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-medium">Analytical Implication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9F2]">
              {sortedRules.map((r) => (
                <tr
                  key={r.id}
                  className={`hover:bg-[#EDF1FA]/50 transition-colors ${
                    r.isCoTrendingConfound ? 'bg-[#FCF5E8]/40' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-[#1C4BBC]">
                    {r.id}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[12px] text-[#0B0F19]">
                    {r.antecedent}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[12px] text-[#1C4BBC] font-semibold">
                    {r.consequent}
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-[#0B0F19]">
                    {(r.support * 100).toFixed(0)}%
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-[#0B0F19]">
                    {(r.confidence * 100).toFixed(0)}%
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums font-bold text-[#1C4BBC]">
                    {r.lift.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-[12px] text-[#60636A] max-w-xs">
                    {r.explanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
