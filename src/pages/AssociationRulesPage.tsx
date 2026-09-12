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
import { useI18n } from '../i18n/LocaleContext';

export const AssociationRulesPage: React.FC = () => {
  const { t } = useI18n();
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
          <h1 className="text-[26px] md:text-[30px] font-bold text-[var(--c-ink)]"> {t('Lagged Association Rule Mining (Apriori)')} </h1>
          <p className="text-[14px] text-[var(--c-muted)] mt-1 max-w-3xl"> {t('Mining temporal dependencies between discrete immunization coverage tiers (at lag t-1) and downstream infectious disease incidence (at time t).')} </p>
        </div>

        {/* 1. Lag indicator chip */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[var(--c-surface)] px-3 py-1.5 rounded-[8px] border border-[var(--c-border-strong)] shadow-sm">
          <Clock size={16} className="text-[var(--c-primary)]" />
          <span className="text-[12px] font-semibold text-[var(--c-muted)]">{t('Temporal Alignment:')}</span>
          <span className="text-[12px] font-mono font-bold text-[var(--c-primary)] bg-[var(--c-subtle-2)] px-2 py-0.5 rounded"> {t('Best Lag = 1 Year (t-1)')} </span>
        </div>
      </div>

      {/* 4. PERMANENT CAUTION PANEL (Mandatory in spec) */}
      <div className="rounded-[8px] border border-[var(--c-warning-border)] bg-[var(--c-warning-bg)] p-5 shadow-[var(--c-shadow-sm)] border-l-4 border-l-[var(--c-warning)]">
        <div className="flex items-start gap-3.5">
          <ShieldAlert size={22} className="text-[var(--c-warning)] shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--c-warning)] mb-0.5"> {t('CRITICAL METHODOLOGICAL CAVEAT · CO-TRENDING CONFOUND')} </div>
            <h3 className="text-[16px] font-bold text-[var(--c-ink)] mb-1"> {t('Top Rule R1 (HepB_HIGH & MCV2_HIGH → Diphtheria_HIGH) is Non-Causal')} </h3>
            <p className="text-[13px] text-[var(--c-ink)] leading-relaxed"> {t('In naive mining, Rule R1 exhibits the highest lift (2.45) and confidence (0.92). Biologically and clinically, higher immunisation does')} <em>{t('not')}</em> {t('cause diphtheria outbreaks. This is an artifact of')} <strong>{t('shared temporal co-trending')}</strong>{t(': during Myanmar’s 2000–2018 health expansion, both new vaccine rollouts (HepB, MCV2) and national epidemiological laboratory surveillance capacity scaled up concurrently.')} </p>
            <div className="mt-2 text-[12px] text-[var(--c-muted)] font-medium bg-[var(--c-surface)]/60 p-2.5 rounded border border-[var(--c-warning-border)]"> {t('Key Lesson: Apriori mining on non-stationary national time-series must be audited against domain causality. Real protective rules (such as')} <code>{t('DTP3_LOW → Measles_HIGH')}</code>{t(') operate on counter-trending mechanics.')} </div>
          </div>
        </div>
      </div>

      {/* 2. Top Rule Cards (Grid of 6) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--c-ink)]"> {t('Featured Association Rules (Ranked by Lift)')} </h3>
            <p className="text-[12px] text-[var(--c-muted)]"> {t('Antecedent conditions at year (t-1) and consequent health status at year (t)')} </p>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[var(--c-subtle)] text-[var(--c-primary)]"> {t('Min Support ≥ 0.15 · Min Conf ≥ 0.65')} </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topRules.map((rule) => (
            <div
              key={rule.id}
              className={`bg-[var(--c-surface)] rounded-[8px] p-4 shadow-[var(--c-shadow-sm)] border ${
                rule.isCoTrendingConfound
                  ? 'border-[var(--c-warning)] ring-1 ring-[var(--c-warning)]/30'
                  : 'border-[var(--c-border)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--c-subtle)] text-[var(--c-primary)]"> {t('Rule')} {rule.id}
                </span>
                {rule.isCoTrendingConfound && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--c-warning-bg)] text-[var(--c-warning)] border border-[var(--c-warning-border)]"> {t('Co-Trending Confound')} </span>
                )}
              </div>

              {/* Antecedent -> Consequent */}
              <div className="my-3 space-y-1.5">
                <div className="text-[12px] font-mono font-semibold text-[var(--c-ink)] bg-[var(--c-subtle)]/60 p-2 rounded border border-[var(--c-border)]">
                  {t(rule.antecedent)}
                </div>
                <div className="flex justify-center text-[var(--c-muted)]">
                  <ArrowRight size={14} className="rotate-90 md:rotate-0" />
                </div>
                <div className="text-[12px] font-mono font-semibold text-[var(--c-primary)] bg-[var(--c-subtle-2)]/60 p-2 rounded border border-[var(--c-border-strong)]">
                  {t(rule.consequent)}
                </div>
              </div>

              {/* Badges: Support / Confidence / Lift */}
              <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-[var(--c-border)] text-center">
                <div>
                  <div className="text-[10px] text-[var(--c-muted)] uppercase font-medium">{t('Support')}</div>
                  <div className="text-[13px] font-mono font-bold text-[var(--c-ink)]">
                    {(rule.support * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--c-muted)] uppercase font-medium">{t('Confidence')}</div>
                  <div className="text-[13px] font-mono font-bold text-[var(--c-ink)]">
                    {(rule.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--c-muted)] uppercase font-medium">{t('Lift')}</div>
                  <div className="text-[13px] font-mono font-bold text-[var(--c-primary)]">
                    {rule.lift.toFixed(2)}×
                  </div>
                </div>
              </div>

              <p className="mt-2.5 text-[11px] text-[var(--c-muted)] leading-relaxed">
                {t(rule.explanation)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Full Sortable Table (All 14 Rules) */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--c-ink)]"> {t('Full Mined Rule Catalog (14 Rules)')} </h3>
            <p className="text-[12px] text-[var(--c-muted)]"> {t('Click any metric column header to sort rules by strength or prevalence')} </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--c-border)] text-[var(--c-muted)]">
                <th
                  onClick={() => handleSort('id')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[var(--c-primary)]"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('ID')}</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-medium">{t('Antecedent (t-1)')}</th>
                <th className="py-2.5 px-3 font-medium">{t('Consequent (t)')}</th>
                <th
                  onClick={() => handleSort('support')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[var(--c-primary)]"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('Support')}</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('confidence')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[var(--c-primary)]"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('Confidence')}</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('lift')}
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-[var(--c-primary)]"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('Lift')}</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-medium">{t('Analytical Implication')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--c-border)]">
              {sortedRules.map((r) => (
                <tr
                  key={r.id}
                  className={`hover:bg-[var(--c-subtle)]/50 transition-colors ${
                    r.isCoTrendingConfound ? 'bg-[var(--c-warning-bg)]/40' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-[var(--c-primary)]">
                    {r.id}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[12px] text-[var(--c-ink)]">
                    {t(r.antecedent)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[12px] text-[var(--c-primary)] font-semibold">
                    {t(r.consequent)}
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-[var(--c-ink)]">
                    {(r.support * 100).toFixed(0)}%
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-[var(--c-ink)]">
                    {(r.confidence * 100).toFixed(0)}%
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums font-bold text-[var(--c-primary)]">
                    {r.lift.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-[12px] text-[var(--c-muted)] max-w-xs">
                    {t(r.explanation)}
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
