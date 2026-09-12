import React, { useState } from 'react';
import {
  GitFork,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  TrendingUp,
  AlertOctagon,
  Activity,
} from 'lucide-react';
import { Callout } from '../components/Callout';
import { CLUSTERS_DATA, CROSS_TAB_CLUSTERING } from '../data/miningData';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/LocaleContext';

export const ClusteringPage: React.FC = () => {
  const { t } = useI18n();
  const { colors } = useTheme();
  const [crossTabOpen, setCrossTabOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<number>(1);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[var(--c-ink)]"> {t('Trajectory Clustering (DTW + Ward\'s Linkage)')} </h1>
        <p className="text-[14px] text-[var(--c-muted)] mt-1 max-w-4xl"> {t('Unsupervised temporal grouping using Dynamic Time Warping distance to align time-series shape independently of scale, capturing shared structural shocks.')} </p>
      </div>

      {/* 1. Explainer Strip */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-4 shadow-[var(--c-shadow-sm)] border-l-4 border-l-[var(--c-primary)]">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-[var(--c-primary)] mt-0.5 shrink-0" />
          <div className="text-[13px] text-[var(--c-ink)] leading-relaxed">
            <strong>{t('Methodology Rationale:')}</strong> {t('Standard Euclidean distance fails on time-series when shocks suffer phase shifts or delayed reporting lags. Dynamic Time Warping (DTW) calculates optimal non-linear alignment between series. Ward’s hierarchical agglomerative clustering minimizes total within-cluster variance, revealing')} <strong>{t('k = 3 distinct behavioral trajectories')}</strong>.
          </div>
        </div>
      </div>

      {/* 2. Interactive Dendrogram Chart Component */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--c-ink)]"> {t('Hierarchical Agglomerative Dendrogram')} </h3>
            <p className="text-[12px] text-[var(--c-muted)]"> {t('Cut line at height = 4.2 yields 3 clusters. Click any cluster branch to highlight members.')} </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[var(--c-subtle-2)] text-[var(--c-primary)] border border-[var(--c-border-strong)] font-semibold"> {t('Threshold Cut: k = 3')} </span>
          </div>
        </div>

        {/* SVG Dendrogram Tree Representation */}
        <div className="relative w-full overflow-x-auto pb-2">
          <div className="min-w-[640px] bg-[var(--c-subtle)]/40 rounded-[8px] p-4 border border-[var(--c-border-strong)]">
            {/* Cut line indicator */}
            <div className="relative mb-2 flex items-center justify-between text-[11px] font-mono text-[var(--c-danger)]">
              <span className="bg-[var(--c-surface)] px-2 py-0.5 rounded border border-[var(--c-danger)]/40"> {t('DTW Distance Cut Level (k=3)')} </span>
              <div className="flex-1 border-b-2 border-dashed border-[var(--c-danger)] mx-3" />
              <span>{t('h = 4.20')}</span>
            </div>

            {/* Tree SVG diagram */}
            <svg viewBox="0 0 700 180" className="w-full h-[180px]">
              {/* Root node */}
              <path d="M 350,10 L 350,30" stroke={colors.muted} strokeWidth="2" fill="none" />
              
              {/* Branch 1 to Left (Cluster 3) vs Branch 2 to Right */}
              <path d="M 120,30 L 580,30" stroke={colors.muted} strokeWidth="2" fill="none" />
              
              {/* Left Branch -> Cluster 3 */}
              <path d="M 120,30 L 120,70" stroke={colors.success} strokeWidth="2.5" fill="none" />
              <path d="M 60,70 L 180,70" stroke={colors.success} strokeWidth="2" fill="none" />
              <path d="M 60,70 L 60,130" stroke={colors.success} strokeWidth="1.5" fill="none" />
              <path d="M 180,70 L 180,130" stroke={colors.success} strokeWidth="1.5" fill="none" />

              {/* Right Branch -> Split into Cluster 1 and Cluster 2 */}
              <path d="M 450,30 L 450,55" stroke={colors.muted} strokeWidth="2" fill="none" />
              <path d="M 350,55 L 560,55" stroke={colors.muted} strokeWidth="2" fill="none" />
              
              {/* Cluster 1 Branch */}
              <path d="M 350,55 L 350,90" stroke={colors.primary} strokeWidth="2.5" fill="none" />
              <path d="M 280,90 L 420,90" stroke={colors.primary} strokeWidth="2" fill="none" />
              <path d="M 280,90 L 280,130" stroke={colors.primary} strokeWidth="1.5" fill="none" />
              <path d="M 420,90 L 420,130" stroke={colors.primary} strokeWidth="1.5" fill="none" />

              {/* Cluster 2 Branch */}
              <path d="M 560,55 L 560,90" stroke={colors.danger} strokeWidth="2.5" fill="none" />
              <path d="M 500,90 L 620,90" stroke={colors.danger} strokeWidth="2" fill="none" />
              <path d="M 500,90 L 500,130" stroke={colors.danger} strokeWidth="1.5" fill="none" />
              <path d="M 620,90 L 620,130" stroke={colors.danger} strokeWidth="1.5" fill="none" />

              {/* Labels below leaves */}
              <g className="cursor-pointer" onClick={() => setSelectedCluster(3)}>
                <rect x="40" y="135" width="160" height="36" rx="6" fill={selectedCluster === 3 ? colors.success : colors.surface} stroke={colors.success} strokeWidth="1.5" />
                <text x="120" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" fill={selectedCluster === 3 ? colors.surface : colors.success}> {t('Cluster 3 (n=5)')} </text>
                <text x="120" y="165" textAnchor="middle" fontSize="9" fill={selectedCluster === 3 ? colors.surface : colors.muted}> {t('Secular Reductions')} </text>
              </g>

              <g className="cursor-pointer" onClick={() => setSelectedCluster(1)}>
                <rect x="270" y="135" width="160" height="36" rx="6" fill={selectedCluster === 1 ? colors.primary : colors.surface} stroke={colors.primary} strokeWidth="1.5" />
                <text x="350" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" fill={selectedCluster === 1 ? colors.surface : colors.primary}> {t('Cluster 1 (n=7)')} </text>
                <text x="350" y="165" textAnchor="middle" fontSize="9" fill={selectedCluster === 1 ? colors.surface : colors.muted}> {t('Pandemic Halving Shock')} </text>
              </g>

              <g className="cursor-pointer" onClick={() => setSelectedCluster(2)}>
                <rect x="490" y="135" width="160" height="36" rx="6" fill={selectedCluster === 2 ? colors.danger : colors.surface} stroke={colors.danger} strokeWidth="1.5" />
                <text x="570" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" fill={selectedCluster === 2 ? colors.surface : colors.danger}> {t('Cluster 2 (n=5)')} </text>
                <text x="570" y="165" textAnchor="middle" fontSize="9" fill={selectedCluster === 2 ? colors.surface : colors.muted}> {t('Decade-Long Reversals')} </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Three Cluster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CLUSTERS_DATA.map((cluster) => {
          const isSelected = selectedCluster === cluster.id;
          const colorTheme =
            cluster.id === 1
              ? { border: 'border-[var(--c-primary)]', tag: 'bg-[var(--c-subtle-2)] text-[var(--c-primary)]' }
              : cluster.id === 2
              ? { border: 'border-[var(--c-danger)]', tag: 'bg-[var(--c-danger-bg)] text-[var(--c-danger)]' }
              : { border: 'border-[var(--c-success)]', tag: 'bg-[var(--c-success-bg)] text-[var(--c-success)]' };

          return (
            <div
              key={cluster.id}
              onClick={() => setSelectedCluster(cluster.id)}
              className={`bg-[var(--c-surface)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)] border-2 cursor-pointer transition-all ${
                isSelected ? `${colorTheme.border} ring-2 ring-opacity-20` : 'border-[var(--c-border)] hover:border-[var(--c-border-strong)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${colorTheme.tag}`}> {t('Cluster')} {cluster.id} · {cluster.size} {t('indicators')} </span>
                <span className="text-[11px] font-mono text-[var(--c-muted)]"> {t('Shape:')} {cluster.keyShape}
                </span>
              </div>

              <h4 className="text-[15px] font-bold text-[var(--c-ink)] mb-2 leading-tight">
                {cluster.name.split(':')[1]}
              </h4>

              <p className="text-[12px] text-[var(--c-muted)] leading-relaxed mb-4">
                {t(cluster.description)}
              </p>

              <div className="border-t border-[var(--c-border)] pt-3">
                <div className="text-[11px] font-semibold text-[var(--c-muted)] uppercase tracking-wider mb-2"> {t('Member Indicators:')} </div>
                <ul className="space-y-1.5">
                  {cluster.members.map((m, idx) => (
                    <li key={idx} className="text-[12px] text-[var(--c-ink)] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-muted)]" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--c-border)] text-[11px] text-[var(--c-muted)] flex justify-between">
                <span>{t('Domain Composition:')}</span>
                <span className="font-mono font-semibold text-[var(--c-ink)]">{cluster.domainMix}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Validation Callout */}
      <Callout
        type="info"
        kicker="CLUSTERING VALIDATION FINDING"
        title={t('Adjusted Rand Index (ARI) = 0.072 (Near Chance)')}
      > {t('External validation against WHO disease category taxonomies yields an')} <strong>{t('ARI of 0.072')}</strong>{t('. This near-zero agreement demonstrates that indicators cluster by')} <strong>{t('trajectory dynamics and delivery disruption shape')}</strong>{t(', rather than by physiological organ system or medical category.')} </Callout>

      {/* 5. Domain x Cluster Cross-Tabulation (Expandable) */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
        <button
          type="button"
          onClick={() => setCrossTabOpen(!crossTabOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--c-ink)]"> {t('Domain × Trajectory Cluster Contingency Matrix')} </h3>
            <p className="text-[12px] text-[var(--c-muted)]"> {t('Cross-tabulation demonstrating how indicators from the same WHO domain disperse across different trajectory clusters')} </p>
          </div>
          <div className="p-1 rounded hover:bg-[var(--c-subtle)] text-[var(--c-muted)]">
            {crossTabOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        {crossTabOpen && (
          <div className="mt-4 pt-3 border-t border-[var(--c-border)] overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[var(--c-border)] text-[var(--c-muted)]">
                  <th className="py-2.5 px-3 font-medium">{t('Domain')}</th>
                  <th className="py-2.5 px-3 font-medium text-center text-[var(--c-primary)]"> {t('Cluster 1 (Halving Shock)')} </th>
                  <th className="py-2.5 px-3 font-medium text-center text-[var(--c-danger)]"> {t('Cluster 2 (Reversals)')} </th>
                  <th className="py-2.5 px-3 font-medium text-center text-[var(--c-success)]"> {t('Cluster 3 (Secular)')} </th>
                  <th className="py-2.5 px-3 font-medium text-right">{t('Total Analyzed')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--c-border)]">
                {CROSS_TAB_CLUSTERING.map((r, i) => (
                  <tr key={i} className="hover:bg-[var(--c-subtle)]/40">
                    <td className="py-2 px-3 font-medium text-[var(--c-ink)]">{t(r.domain)}</td>
                    <td className="py-2 px-3 font-mono tabular-nums text-center text-[var(--c-primary)] font-semibold">
                      {r.c1 > 0 ? r.c1 : '—'}
                    </td>
                    <td className="py-2 px-3 font-mono tabular-nums text-center text-[var(--c-danger)] font-semibold">
                      {r.c2 > 0 ? r.c2 : '—'}
                    </td>
                    <td className="py-2 px-3 font-mono tabular-nums text-center text-[var(--c-success)] font-semibold">
                      {r.c3 > 0 ? r.c3 : '—'}
                    </td>
                    <td className="py-2 px-3 font-mono tabular-nums text-right font-bold text-[var(--c-ink)]">
                      {r.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
