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
import { useI18n } from '../i18n/LocaleContext';

interface SynthesisPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const SynthesisPage: React.FC<SynthesisPageProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[var(--c-ink)]"> {t('Cross-Method Synthesis & Chronological Convergence')} </h1>
        <p className="text-[14px] text-[var(--c-muted)] mt-1 max-w-4xl"> {t('Integrating five distinct descriptive and diagnostic mining techniques into a unified empirical narrative of Myanmar’s public health transition and post-2020 systemic shock.')} </p>
      </div>

      {/* Narrative Synthesis Statement Card */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-6 shadow-[var(--c-shadow-sm)] border-l-4 border-l-[var(--c-primary)]">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--c-primary)] mb-1"> {t('UNIFIED MINING SYNTHESIS')} </div>
        <h2 className="text-[19px] font-bold text-[var(--c-ink)] mb-2"> {t('Convergent Evidence of System Fracture: The 2020–2021 Disruption')} </h2>
        <p className="text-[14px] text-[var(--c-ink)] leading-relaxed max-w-4xl"> {t('When evaluated in isolation, single indicators can mislead: official case notifications dropped (suggesting progress), while routine coverage also dropped (suggesting severe vulnerability). By synthesizing')} <strong>{t('reversal detection')}</strong>, <strong>{t('trajectory clustering')}</strong>, <strong>{t('disease tier discretisation')}</strong>, <strong>{t('lagged association rules')}</strong>{t(', and')} <strong>{t('isolation forest anomaly scores')}</strong>{t(', every analytical vector independently points to')} <strong>2020–2021</strong> {t('as a compound shock. The disruption halted institutional delivery, halved routine infant immunization to 44%, caused a massive +765% malaria resurgence, reversed tuberculosis progress by 12.2 years, and triggered acute reporting blackouts in public health surveillance.')} </p>
      </div>

      {/* 1. Horizontal Chronological Timeline (2018–2023) */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--c-ink)]"> {t('Multi-Method Empirical Timeline (2019–2024)')} </h3>
            <p className="text-[12px] text-[var(--c-muted)]"> {t('Alignment of statistical breakpoints, surveillance collapse flags, and model risk alarms')} </p>
          </div>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded bg-[var(--c-subtle)] text-[var(--c-primary)]"> {t('5 Mining Methods Aligned')} </span>
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
                    ? 'bg-[var(--c-danger-bg)]/60 border-[var(--c-danger-border)]'
                    : isWarning
                    ? 'bg-[var(--c-warning-bg)]/60 border-[var(--c-warning-border)]'
                    : 'bg-[var(--c-success-bg)]/60 border-[var(--c-success-border)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[16px] font-mono font-bold text-[var(--c-ink)]">
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

                  <h4 className="text-[13px] font-bold text-[var(--c-ink)] leading-snug mb-1.5">
                    {t(item.title)}
                  </h4>

                  <p className="text-[11px] text-[var(--c-muted)] leading-relaxed">
                    {t(item.detail)}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-black/10 text-[10px] font-semibold uppercase tracking-wider text-[var(--c-muted)]"> {t('Phase:')} {t(item.phase)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Five-Row Evidence Table */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <h3 className="text-[16px] font-semibold text-[var(--c-ink)] mb-1"> {t('Five-Vector Cross-Validation Evidence Table')} </h3>
        <p className="text-[12px] text-[var(--c-muted)] mb-4"> {t('Direct mapping of each data mining algorithm\'s empirical output to its systemic conclusion')} </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--c-border)] text-[var(--c-muted)]">
                <th className="py-2.5 px-3 font-medium w-[240px]">{t('Mining Technique')}</th>
                <th className="py-2.5 px-3 font-medium">{t('Empirical Output & Finding')}</th>
                <th className="py-2.5 px-3 font-medium">{t('Systemic Interpretation')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--c-border)]">
              {SYNTHESIS_EVIDENCE_TABLE.map((row, i) => (
                <tr key={i} className="hover:bg-[var(--c-subtle)]/40">
                  <td className="py-3 px-3 font-semibold text-[var(--c-primary)] align-top">
                    {row.method}
                  </td>
                  <td className="py-3 px-3 text-[var(--c-ink)] align-top">
                    {t(row.evidence)}
                  </td>
                  <td className="py-3 px-3 text-[var(--c-muted)] align-top">
                    {t(row.implication)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Footer Button to Predictive Model */}
      <div className="bg-[var(--c-subtle)] border border-[var(--c-border-strong)] rounded-[8px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-[15px] font-bold text-[var(--c-ink)]"> {t('Translating Historical Retrospective into Forward-Looking Prediction')} </h4>
          <p className="text-[12px] text-[var(--c-muted)] mt-0.5"> {t('How can public health authorities detect indicators on the verge of deterioration 1 year in advance?')} </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('model-performance')}
            className="px-4 py-2 bg-[var(--c-surface)] hover:bg-[var(--c-subtle-2)] text-[var(--c-primary)] text-[13px] font-semibold rounded-[6px] border border-[var(--c-border-strong)] transition-colors"
          > {t('Model Performance')} </button>
          <button
            type="button"
            onClick={() => onNavigate('predict')}
            className="px-4 py-2 bg-[var(--c-primary)] hover:bg-[var(--c-primary-strong)] text-white text-[13px] font-semibold rounded-[6px] transition-colors flex items-center gap-1.5"
          >
            <span>{t('Launch Predict Tool')}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
