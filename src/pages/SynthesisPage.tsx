import React from 'react';
import {
  Compass,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Layers,
  Network,
  Activity,
  Sliders,
} from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { Badge } from '../components/Badge';
import { SYNTHESIS_TIMELINE, SYNTHESIS_EVIDENCE_TABLE } from '../data/miningData';
import { NavigationPage } from '../types';

interface SynthesisPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const SynthesisPage: React.FC<SynthesisPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[#0B0F19]">
          Cross-Method Synthesis & Chronological Convergence
        </h1>
        <p className="text-[14px] text-[#60636A] mt-1 max-w-4xl">
          Integrating five distinct descriptive and diagnostic mining techniques into a unified empirical narrative of Myanmar’s public health transition and post-2020 systemic shock.
        </p>
      </div>

      {/* Narrative Synthesis Statement Card */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-6 shadow-[0_1px_2px_rgba(11,15,25,0.06)] border-l-4 border-l-[#1C4BBC]">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#1C4BBC] mb-1">
          UNIFIED MINING SYNTHESIS
        </div>
        <h2 className="text-[19px] font-bold text-[#0B0F19] mb-2">
          Convergent Evidence of System Fracture: The 2020–2021 Disruption
        </h2>
        <p className="text-[14px] text-[#0B0F19] leading-relaxed max-w-4xl">
          When evaluated in isolation, single indicators can mislead: official case notifications dropped (suggesting progress), while routine coverage also dropped (suggesting severe vulnerability). By synthesizing <strong>reversal detection</strong>, <strong>trajectory clustering</strong>, <strong>disease tier discretisation</strong>, <strong>lagged association rules</strong>, and <strong>isolation forest anomaly scores</strong>, every analytical vector independently points to <strong>2020–2021</strong> as a compound shock. The disruption halted institutional delivery, halved routine infant immunization to 44%, caused a massive +765% malaria resurgence, reversed tuberculosis progress by 12.2 years, and triggered acute reporting blackouts in public health surveillance.
        </p>
      </div>

      {/* 1. Horizontal Chronological Timeline (2018–2023) */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0F19]">
              Multi-Method Empirical Timeline (2019–2024)
            </h3>
            <p className="text-[12px] text-[#60636A]">
              Alignment of statistical breakpoints, surveillance collapse flags, and model risk alarms
            </p>
          </div>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded bg-[#EDF1FA] text-[#1C4BBC]">
            5 Mining Methods Aligned
          </span>
        </div>

        {/* Chronological Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {SYNTHESIS_TIMELINE.map((item, idx) => {
            const isDanger = item.type === 'danger';
            const isWarning = item.type === 'warning';
            return (
              <div
                key={idx}
                className={`p-4 rounded-[8px] border flex flex-col justify-between transition-all ${
                  isDanger
                    ? 'bg-[#FDF0EF]/60 border-[#F4C5C2]'
                    : isWarning
                    ? 'bg-[#FCF5E8]/60 border-[#F2DEB0]'
                    : 'bg-[#EBF7F0]/60 border-[#BBE5D0]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[16px] font-mono font-bold text-[#0B0F19]">
                      {item.year}
                    </span>
                    <Badge
                      variant={
                        isDanger ? 'danger' : isWarning ? 'warning' : 'success'
                      }
                      size="sm"
                    >
                      {item.badge}
                    </Badge>
                  </div>

                  <h4 className="text-[13px] font-bold text-[#0B0F19] leading-snug mb-1.5">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-[#60636A] leading-relaxed">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-black/10 text-[10px] font-semibold uppercase tracking-wider text-[#60636A]">
                  Phase: {item.phase}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Five-Row Evidence Table */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <h3 className="text-[16px] font-semibold text-[#0B0F19] mb-1">
          Five-Vector Cross-Validation Evidence Table
        </h3>
        <p className="text-[12px] text-[#60636A] mb-4">
          Direct mapping of each data mining algorithm's empirical output to its systemic conclusion
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E4E9F2] text-[#60636A]">
                <th className="py-2.5 px-3 font-medium w-[240px]">Mining Technique</th>
                <th className="py-2.5 px-3 font-medium">Empirical Output & Finding</th>
                <th className="py-2.5 px-3 font-medium">Systemic Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9F2]">
              {SYNTHESIS_EVIDENCE_TABLE.map((row, i) => (
                <tr key={i} className="hover:bg-[#EDF1FA]/40">
                  <td className="py-3 px-3 font-semibold text-[#1C4BBC] align-top">
                    {row.method}
                  </td>
                  <td className="py-3 px-3 text-[#0B0F19] align-top">
                    {row.evidence}
                  </td>
                  <td className="py-3 px-3 text-[#60636A] align-top">
                    {row.implication}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Footer Button to Predictive Model */}
      <div className="bg-[#EDF1FA] border border-[#CAD3E6] rounded-[8px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-[15px] font-bold text-[#0B0F19]">
            Translating Historical Retrospective into Forward-Looking Prediction
          </h4>
          <p className="text-[12px] text-[#60636A] mt-0.5">
            How can public health authorities detect indicators on the verge of deterioration 1 year in advance?
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('model-performance')}
            className="px-4 py-2 bg-white hover:bg-[#DDE4F5] text-[#1C4BBC] text-[13px] font-semibold rounded-[6px] border border-[#CAD3E6] transition-colors"
          >
            Model Performance
          </button>
          <button
            type="button"
            onClick={() => onNavigate('predict')}
            className="px-4 py-2 bg-[#1C4BBC] hover:bg-[#17398B] text-white text-[13px] font-semibold rounded-[6px] transition-colors flex items-center gap-1.5"
          >
            <span>Launch Predict Tool</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
