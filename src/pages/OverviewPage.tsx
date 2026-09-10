import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
} from 'recharts';
import {
  ArrowRight,
  TrendingDown,
  GitFork,
  Layers,
  Network,
  AlertTriangle,
  Compass,
  Sliders,
} from 'lucide-react';
import { KPICard } from '../components/KPICard';
import {
  DATASET_STATS,
  HERO_IMMUNISATION_SERIES,
  HERO_INCIDENCE_SERIES,
  DOMAINS,
} from '../data/miningData';
import { NavigationPage } from '../types';

interface OverviewPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const sortedDomains = [...DOMAINS].sort((a, b) => b.indicators - a.indicators);

  return (
    <div className="space-y-6">
      {/* Page Title & Scope */}
      <div>
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#0B0F19] leading-tight">
          Myanmar Health Transition & Reversal Analysis
        </h1>
        <p className="text-[14px] text-[#60636A] mt-1 max-w-4xl">
          CRISP-DM data mining investigation into 60+ years of WHO Global Health Observatory indicators: discovering structural reversal breakpoints, trajectory archetypes, surveillance breakdowns, and machine learning risk alerts.
        </p>
      </div>

      {/* 1. KPI Row (5 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          kicker="SCOPE"
          label="Indicators Analyzed"
          value="644"
          subtext="Covering 300 deep time-series"
        />
        <KPICard
          kicker="REPOSITORY"
          label="Total Records"
          value="20,613"
          subtext="WHO GHO historical repository"
        />
        <KPICard
          kicker="TAXONOMY"
          label="Thematic Domains"
          value="11"
          subtext="D1 mortality to D11 hazards"
        />
        <KPICard
          kicker="TIME HORIZON"
          label="Year Coverage"
          value="1961–2030"
          subtext="69-year longitudinal depth"
        />
        <KPICard
          kicker="MODEL LIFT"
          label="Deterioration PR-AUC"
          value="4.4×"
          subtext="0.319 test vs 0.072 baseline"
          badge={{ text: 'Random Forest', variant: 'primary' }}
        />
      </div>

      {/* 2. Key-Finding Banner */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-[#C4453F]">
        <div>
          <div className="text-[11px] font-semibold text-[#C4453F] uppercase tracking-wider mb-1">
            CORE SYNTHESIS FINDING
          </div>
          <h2 className="text-[17px] font-bold text-[#0B0F19]">
            Immunisation coverage halved and tuberculosis lost ~12 years of progress after 2020.
          </h2>
          <p className="text-[13px] text-[#60636A] mt-1">
            Reversal detection, trajectory clustering, and anomaly scores independently converge on 2020–2021 as a compound health system fracture.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('synthesis')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C4BBC] hover:bg-[#17398B] text-white text-[13px] font-semibold rounded-[6px] transition-colors shrink-0"
        >
          <span>View Synthesis Timeline</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 3. Hero Charts: Two Side-by-Side Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart: Immunisation Coverage Halving */}
        <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-[16px] font-semibold text-[#0B0F19]">
                Routine Immunisation Coverage (2000–2024)
              </h3>
              <p className="text-[12px] text-[#60636A]">
                Historical scale peak at 91% (2019) followed by abrupt halving to 44–45% in 2021
              </p>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#FDF0EF] text-[#C4453F] border border-[#F4C5C2]">
              -50.5% Shock
            </span>
          </div>

          <div className="h-[280px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HERO_IMMUNISATION_SERIES} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CAD3E6" vertical={false} />
                <XAxis dataKey="year" stroke="#60636A" fontSize={12} tickLine={false} />
                <YAxis domain={[30, 100]} stroke="#60636A" fontSize={12} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E4E9F2',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(11,15,25,0.08)',
                  }}
                  formatter={(val: any) => [`${val}%`, '']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <ReferenceLine
                  x={2021}
                  stroke="#C4453F"
                  strokeDasharray="4 4"
                  label={{ value: '2021 Disruption', position: 'top', fill: '#C4453F', fontSize: 11, fontWeight: 600 }}
                />
                <Line type="monotone" dataKey="dtp3" name="DTP3 Coverage" stroke="#1C4BBC" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="mcv1" name="MCV1 (Measles)" stroke="#C68A1E" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="pol3" name="Pol3 (Polio)" stroke="#2F9E68" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="hepb3" name="HepB3" stroke="#60636A" strokeWidth={1.5} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E4E9F2] text-[12px] text-[#60636A] flex justify-between">
            <span>Source: WHO/UNICEF Joint Reporting Forms (JRF)</span>
            <button onClick={() => onNavigate('reversal')} className="text-[#1C4BBC] font-medium hover:underline inline-flex items-center gap-1">
              Explore Reversals <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Right Chart: Communicable Disease Reversals */}
        <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-[16px] font-semibold text-[#0B0F19]">
                Tuberculosis & Malaria Reversals (2000–2024)
              </h3>
              <p className="text-[12px] text-[#60636A]">
                Post-2020 reversals: TB gained +11% incidence; Malaria incidence spiked +765%
              </p>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#FCF5E8] text-[#C68A1E] border border-[#F2DEB0]">
              Decade Reversal
            </span>
          </div>

          <div className="h-[280px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HERO_INCIDENCE_SERIES} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CAD3E6" vertical={false} />
                <XAxis dataKey="year" stroke="#60636A" fontSize={12} tickLine={false} />
                <YAxis yAxisId="left" stroke="#1C4BBC" fontSize={12} tickLine={false} domain={[300, 500]} unit="" />
                <YAxis yAxisId="right" orientation="right" stroke="#C4453F" fontSize={12} tickLine={false} domain={[0, 45]} unit="" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E4E9F2',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(11,15,25,0.08)',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <ReferenceLine
                  x={2020}
                  stroke="#C68A1E"
                  strokeDasharray="4 4"
                  label={{ value: 'Breakpoint (2020)', position: 'insideTopLeft', fill: '#C68A1E', fontSize: 11, fontWeight: 600 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tb"
                  name="TB Incidence (per 100k)"
                  stroke="#1C4BBC"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="malaria"
                  name="Malaria Incidence (per 1k at risk)"
                  stroke="#C4453F"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E4E9F2] text-[12px] text-[#60636A] flex justify-between">
            <span>TB lost ~12.2 years of progress; Malaria +765% from 2019 low</span>
            <button onClick={() => onNavigate('disease-levels')} className="text-[#1C4BBC] font-medium hover:underline inline-flex items-center gap-1">
              Disease Heatmap <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Domain Composition Bar Chart */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0F19]">
              WHO Domain Composition — Indicators per Domain
            </h3>
            <p className="text-[12px] text-[#60636A]">
              Distribution of the 644 indicators across the 11 thematic public health domains
            </p>
          </div>
          <div className="text-[11px] font-medium px-3 py-1 rounded bg-[#EDF1FA] text-[#1C4BBC] border border-[#CAD3E6]">
            Key Trajectory Trap: Most indicators ≠ Most data (D8 vs D3)
          </div>
        </div>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedDomains}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 140, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#CAD3E6" horizontal={false} />
              <XAxis type="number" stroke="#60636A" fontSize={11} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#0B0F19"
                fontSize={11}
                tickLine={false}
                width={130}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E4E9F2',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val} indicators`, 'Catalog Count']}
              />
              <Bar dataKey="indicators" fill="#1C4BBC" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-[12px] text-[#60636A] leading-relaxed italic border-t border-[#E4E9F2] pt-2">
          Note: D8 (Health Systems & UHC) contains the highest indicator count (142), yet yields fewer deep longitudinal observations (15.1 obs/ind) compared to D3 (Communicable Diseases, 54.0 obs/ind) and D1 (Mortality, 52.6 obs/ind).
        </p>
      </div>

      {/* 5. Six Navigation Cards to Main Sections */}
      <div>
        <h3 className="text-[16px] font-semibold text-[#0B0F19] mb-3">
          Explore Mining Pipeline Modules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigate('reversal')}
            className="bg-white border border-[#E4E9F2] hover:border-[#1C4BBC] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-[6px] bg-[#EDF1FA] text-[#1C4BBC] group-hover:bg-[#1C4BBC] group-hover:text-white transition-colors">
                <TrendingDown size={20} strokeWidth={1.75} />
              </div>
              <h4 className="text-[15px] font-semibold text-[#0B0F19] group-hover:text-[#1C4BBC] transition-colors">
                Reversal Detection
              </h4>
            </div>
            <p className="text-[12px] text-[#60636A] leading-relaxed">
              Breakpoint identification and years-lost computation across 14 key indicators showing 3 major reversals.
            </p>
          </div>

          <div
            onClick={() => onNavigate('clustering')}
            className="bg-white border border-[#E4E9F2] hover:border-[#1C4BBC] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-[6px] bg-[#EDF1FA] text-[#1C4BBC] group-hover:bg-[#1C4BBC] group-hover:text-white transition-colors">
                <GitFork size={20} strokeWidth={1.75} />
              </div>
              <h4 className="text-[15px] font-semibold text-[#0B0F19] group-hover:text-[#1C4BBC] transition-colors">
                Trajectory Clustering
              </h4>
            </div>
            <p className="text-[12px] text-[#60636A] leading-relaxed">
              DTW distance matrix & Ward dendrogram splitting time-series into 3 behavioral archetypes (ARI = 0.072).
            </p>
          </div>

          <div
            onClick={() => onNavigate('disease-levels')}
            className="bg-white border border-[#E4E9F2] hover:border-[#1C4BBC] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-[6px] bg-[#EDF1FA] text-[#1C4BBC] group-hover:bg-[#1C4BBC] group-hover:text-white transition-colors">
                <Layers size={20} strokeWidth={1.75} />
              </div>
              <h4 className="text-[15px] font-semibold text-[#0B0F19] group-hover:text-[#1C4BBC] transition-colors">
                Disease Levels (L/M/H)
              </h4>
            </div>
            <p className="text-[12px] text-[#60636A] leading-relaxed">
              Discretisation across 9 diseases × 25 years with interactive method switching (Tercile, Epi, SD).
            </p>
          </div>

          <div
            onClick={() => onNavigate('association-rules')}
            className="bg-white border border-[#E4E9F2] hover:border-[#1C4BBC] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-[6px] bg-[#EDF1FA] text-[#1C4BBC] group-hover:bg-[#1C4BBC] group-hover:text-white transition-colors">
                <Network size={20} strokeWidth={1.75} />
              </div>
              <h4 className="text-[15px] font-semibold text-[#0B0F19] group-hover:text-[#1C4BBC] transition-colors">
                Association Rules
              </h4>
            </div>
            <p className="text-[12px] text-[#60636A] leading-relaxed">
              Lagged apriori rules between immunisation and disease incidence, exposing co-trending confounds.
            </p>
          </div>

          <div
            onClick={() => onNavigate('anomaly')}
            className="bg-white border border-[#E4E9F2] hover:border-[#1C4BBC] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-[6px] bg-[#EDF1FA] text-[#1C4BBC] group-hover:bg-[#1C4BBC] group-hover:text-white transition-colors">
                <AlertTriangle size={20} strokeWidth={1.75} />
              </div>
              <h4 className="text-[15px] font-semibold text-[#0B0F19] group-hover:text-[#1C4BBC] transition-colors">
                Anomaly & Surveillance
              </h4>
            </div>
            <p className="text-[12px] text-[#60636A] leading-relaxed">
              Isolation Forest scores by year and surveillance completeness drop vs real epidemiological decline.
            </p>
          </div>

          <div
            onClick={() => onNavigate('predict')}
            className="bg-[#EDF1FA] border border-[#CAD3E6] hover:border-[#1C4BBC] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-[6px] bg-[#1C4BBC] text-white">
                <Sliders size={20} strokeWidth={1.75} />
              </div>
              <div className="flex items-center gap-2">
                <h4 className="text-[15px] font-semibold text-[#1C4BBC]">
                  Predict Deterioration Risk
                </h4>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#1C4BBC] text-white">
                  Live Tool
                </span>
              </div>
            </div>
            <p className="text-[12px] text-[#0B0F19] leading-relaxed">
              Run the trained Random Forest model (4.4× lift, 0.499 threshold) in Quick Predict or Advanced mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
