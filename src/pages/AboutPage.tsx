import React from 'react';
import {
  FileText,
  AlertOctagon,
  BookOpen,
  Compass,
  CheckCircle2,
  Database,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  Calendar,
} from 'lucide-react';
import { NavigationPage } from '../types';

interface AboutPageProps {
  onNavigate?: (page: NavigationPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const crispdmPhases = [
    {
      phase: 'Phase 1',
      title: 'Domain & Epidemiological Understanding',
      desc: 'Defining health transition phases (infectious to non-communicable diseases) and identifying structural deterioration risks in Myanmar following geopolitical shocks and healthcare disruptions.',
      focus: 'SDG 3 Targets · 14 Sentinel Indicators · Reversal Definitions',
    },
    {
      phase: 'Phase 2',
      title: 'Data Understanding & Profiling',
      desc: 'Profiling 20,613 longitudinal records across 644 WHO GHO indicators spanning 1961 to 2030, auditing indicator sparsity, dimensional breakdowns, and data quality anomalies.',
      focus: '644 Indicators · 11 Domains · 300 Dense Time-Series',
    },
    {
      phase: 'Phase 3',
      title: 'Data Preparation & Quality Cleansing',
      desc: 'Resolving the four primary data quality traps: stripping placeholder strings, reconstructing missing measurement units, handling structural zero intervals, and correcting for reporting collapse.',
      focus: 'Regex Extraction · Unit Inference · Masking Confounders',
    },
    {
      phase: 'Phase 4',
      title: 'Descriptive & Pattern Mining',
      desc: 'Applying Dynamic Time Warping (DTW) with Ward linkage clustering, piecewise linear breakpoint regression, multi-method discretisation, and 1-year lagged Apriori association rule generation.',
      focus: 'DTW Clustering · Breakpoints · Discretisation · Association Rules',
    },
    {
      phase: 'Phase 5',
      title: 'Predictive Modeling & Anomaly Detection',
      desc: 'Training rare-event classifiers (Random Forest, XGBoost, CatBoost) to forecast acute health deterioration. Demonstrating temporal splitting to prevent +0.32 PR-AUC cross-validation leakage.',
      focus: 'Precision-Recall AUC · Time-Series Validation · Isolation Forest',
    },
    {
      phase: 'Phase 6',
      title: 'Evaluation & Interactive Deployment',
      desc: 'Synthesising multi-method evidence into an actionable surveillance dashboard and live what-if simulation tool for health planners, epidemiologists, and humanitarian decision-makers.',
      focus: 'Interactive Simulator · Risk Categorisation · Surveillance Completeness',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Scope */}
      <div>
        <h1 className="text-[28px] md:text-[32px] font-bold text-[var(--c-ink)] leading-tight">
          Methodology & Project Reference
        </h1>
        <p className="text-[14px] text-[var(--c-muted)] mt-1 max-w-4xl">
          CRISP-DM data mining workflow, epidemiological definitions, technical citations, and analytical caveats for the Myanmar Health Transition & Reversal Analysis project.
        </p>
      </div>

      {/* Overview Card */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-[8px] bg-[var(--c-primary)]/10 text-[var(--c-primary)] flex items-center justify-center shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-[var(--c-ink)]">
              Project Objective & Research Motivation
            </h2>
            <p className="text-[14px] text-[var(--c-muted)] mt-2 leading-relaxed">
              Between 1990 and 2019, Myanmar achieved substantial public health progress: malaria mortality declined by over 90%, maternal mortality dropped significantly, and routine immunisation coverage reached historical highs. However, compound shocks—including the COVID-19 pandemic, the February 2021 political crisis, civil conflict, and economic contraction—precipitated acute setbacks across disease control and reporting infrastructure.
            </p>
            <p className="text-[14px] text-[var(--c-muted)] mt-2 leading-relaxed">
              This analytics platform implements a comprehensive <strong>CRISP-DM data mining pipeline</strong> on the complete World Health Organization (WHO) Global Health Observatory repository for Myanmar, systematically identifying turning points, categorising trajectory archetypes, and training predictive models to detect acute deterioration signals before systemic collapse.
            </p>
          </div>
        </div>
      </div>

      {/* CRISP-DM Framework Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[18px] font-bold text-[var(--c-ink)]">
              CRISP-DM Data Mining Architecture
            </h2>
            <p className="text-[13px] text-[var(--c-muted)]">
              Six-phase execution architecture from domain formulation to decision support
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crispdmPhases.map((phase) => (
            <div
              key={phase.phase}
              className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px] bg-[var(--c-subtle)] text-[var(--c-primary)] border border-[var(--c-border-strong)]">
                    {phase.phase}
                  </span>
                  <CheckCircle2 size={16} className="text-[var(--c-success)]" />
                </div>
                <h3 className="text-[15px] font-bold text-[var(--c-ink)] mb-1.5">
                  {phase.title}
                </h3>
                <p className="text-[13px] text-[var(--c-muted)] leading-relaxed">
                  {phase.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--c-border)] text-[11px] font-mono text-[var(--c-primary)]">
                {phase.focus}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Methodological Caveats */}
      <div className="bg-[var(--c-subtle)]/60 border border-[var(--c-border-strong)] rounded-[8px] p-5">
        <div className="flex items-start gap-3">
          <AlertOctagon size={20} className="text-[var(--c-warning)] shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-[14px] font-bold text-[var(--c-ink)]">
              Analytical Caveats & Interpretation Guidelines
            </h3>
            <ul className="space-y-1.5 text-[13px] text-[var(--c-muted)] list-disc list-inside">
              <li>
                <strong>Surveillance Collapse Confound:</strong> The post-2021 decline in reported case counts for certain conditions reflects the withdrawal and fracturing of health facility reporting systems rather than true biological eradication.
              </li>
              <li>
                <strong>Association vs. Causation:</strong> Association rules derived from Apriori capture temporal co-occurrence and shared macro-economic disruptions; they should not be interpreted as isolated biochemical or clinical causal vectors.
              </li>
              <li>
                <strong>Temporal Validation Requirement:</strong> Cross-validation across longitudinal health indicators must always use forward-chaining temporal splits (e.g., Train: 1961–2017, Val: 2018–2020, Test: 2021–2023) rather than random K-Fold splits to prevent severe data leakage.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dataset & Primary Citation */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[var(--c-ink)] mb-3 flex items-center gap-2">
          <Database size={18} className="text-[var(--c-primary)]" />
          Data Sources & Technical Citations
        </h2>
        <div className="space-y-3 text-[13px] text-[var(--c-muted)] leading-relaxed">
          <p>
            <strong>Primary Repository:</strong> World Health Organization (WHO) Global Health Observatory (GHO) data repository for Myanmar (Country Code: <code>MMR</code>), extracted via the official OData REST API.
          </p>
          <div className="p-3 bg-[var(--c-surface-2)] rounded-[6px] border border-[var(--c-border)] font-mono text-[12px] text-[var(--c-ink)] overflow-x-auto">
            World Health Organization. (2024). Global Health Observatory Data Repository: Myanmar Country Statistics [Data set]. WHO. https://www.who.int/data/gho
          </div>
          <p className="text-[12px] text-[var(--c-faint)]">
            Indicators indexed under SDG 3 (Good Health and Well-Being), WHO Global Tuberculosis Programme, WHO Global Malaria Programme, and the WHO/UNICEF Joint Monitoring Programme.
          </p>
        </div>
      </div>
    </div>
  );
};
