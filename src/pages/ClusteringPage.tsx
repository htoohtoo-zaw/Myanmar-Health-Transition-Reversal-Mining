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

export const ClusteringPage: React.FC = () => {
  const [crossTabOpen, setCrossTabOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<number>(1);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[#0B0F19]">
          Trajectory Clustering (DTW + Ward's Linkage)
        </h1>
        <p className="text-[14px] text-[#60636A] mt-1 max-w-4xl">
          Unsupervised temporal grouping using Dynamic Time Warping distance to align time-series shape independently of scale, capturing shared structural shocks.
        </p>
      </div>

      {/* 1. Explainer Strip */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-4 shadow-[0_1px_2px_rgba(11,15,25,0.06)] border-l-4 border-l-[#1C4BBC]">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-[#1C4BBC] mt-0.5 shrink-0" />
          <div className="text-[13px] text-[#0B0F19] leading-relaxed">
            <strong>Methodology Rationale:</strong> Standard Euclidean distance fails on time-series when shocks suffer phase shifts or delayed reporting lags. Dynamic Time Warping (DTW) calculates optimal non-linear alignment between series. Ward’s hierarchical agglomerative clustering minimizes total within-cluster variance, revealing <strong>k = 3 distinct behavioral trajectories</strong>.
          </div>
        </div>
      </div>

      {/* 2. Interactive Dendrogram Chart Component */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0F19]">
              Hierarchical Agglomerative Dendrogram
            </h3>
            <p className="text-[12px] text-[#60636A]">
              Cut line at height = 4.2 yields 3 clusters. Click any cluster branch to highlight members.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#DDE4F5] text-[#1C4BBC] border border-[#CAD3E6] font-semibold">
              Threshold Cut: k = 3
            </span>
          </div>
        </div>

        {/* SVG Dendrogram Tree Representation */}
        <div className="relative w-full overflow-x-auto pb-2">
          <div className="min-w-[640px] bg-[#EDF1FA]/40 rounded-[8px] p-4 border border-[#CAD3E6]">
            {/* Cut line indicator */}
            <div className="relative mb-2 flex items-center justify-between text-[11px] font-mono text-[#C4453F]">
              <span className="bg-white px-2 py-0.5 rounded border border-[#C4453F]/40">
                DTW Distance Cut Level (k=3)
              </span>
              <div className="flex-1 border-b-2 border-dashed border-[#C4453F] mx-3" />
              <span>h = 4.20</span>
            </div>

            {/* Tree SVG diagram */}
            <svg viewBox="0 0 700 180" className="w-full h-[180px]">
              {/* Root node */}
              <path d="M 350,10 L 350,30" stroke="#60636A" strokeWidth="2" fill="none" />
              
              {/* Branch 1 to Left (Cluster 3) vs Branch 2 to Right */}
              <path d="M 120,30 L 580,30" stroke="#60636A" strokeWidth="2" fill="none" />
              
              {/* Left Branch -> Cluster 3 */}
              <path d="M 120,30 L 120,70" stroke="#2F9E68" strokeWidth="2.5" fill="none" />
              <path d="M 60,70 L 180,70" stroke="#2F9E68" strokeWidth="2" fill="none" />
              <path d="M 60,70 L 60,130" stroke="#2F9E68" strokeWidth="1.5" fill="none" />
              <path d="M 180,70 L 180,130" stroke="#2F9E68" strokeWidth="1.5" fill="none" />

              {/* Right Branch -> Split into Cluster 1 and Cluster 2 */}
              <path d="M 450,30 L 450,55" stroke="#60636A" strokeWidth="2" fill="none" />
              <path d="M 350,55 L 560,55" stroke="#60636A" strokeWidth="2" fill="none" />
              
              {/* Cluster 1 Branch */}
              <path d="M 350,55 L 350,90" stroke="#1C4BBC" strokeWidth="2.5" fill="none" />
              <path d="M 280,90 L 420,90" stroke="#1C4BBC" strokeWidth="2" fill="none" />
              <path d="M 280,90 L 280,130" stroke="#1C4BBC" strokeWidth="1.5" fill="none" />
              <path d="M 420,90 L 420,130" stroke="#1C4BBC" strokeWidth="1.5" fill="none" />

              {/* Cluster 2 Branch */}
              <path d="M 560,55 L 560,90" stroke="#C4453F" strokeWidth="2.5" fill="none" />
              <path d="M 500,90 L 620,90" stroke="#C4453F" strokeWidth="2" fill="none" />
              <path d="M 500,90 L 500,130" stroke="#C4453F" strokeWidth="1.5" fill="none" />
              <path d="M 620,90 L 620,130" stroke="#C4453F" strokeWidth="1.5" fill="none" />

              {/* Labels below leaves */}
              <g className="cursor-pointer" onClick={() => setSelectedCluster(3)}>
                <rect x="40" y="135" width="160" height="36" rx="6" fill={selectedCluster === 3 ? '#2F9E68' : '#FFFFFF'} stroke="#2F9E68" strokeWidth="1.5" />
                <text x="120" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" fill={selectedCluster === 3 ? '#FFFFFF' : '#2F9E68'}>
                  Cluster 3 (n=5)
                </text>
                <text x="120" y="165" textAnchor="middle" fontSize="9" fill={selectedCluster === 3 ? '#FFFFFF' : '#60636A'}>
                  Secular Reductions
                </text>
              </g>

              <g className="cursor-pointer" onClick={() => setSelectedCluster(1)}>
                <rect x="270" y="135" width="160" height="36" rx="6" fill={selectedCluster === 1 ? '#1C4BBC' : '#FFFFFF'} stroke="#1C4BBC" strokeWidth="1.5" />
                <text x="350" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" fill={selectedCluster === 1 ? '#FFFFFF' : '#1C4BBC'}>
                  Cluster 1 (n=7)
                </text>
                <text x="350" y="165" textAnchor="middle" fontSize="9" fill={selectedCluster === 1 ? '#FFFFFF' : '#60636A'}>
                  Pandemic Halving Shock
                </text>
              </g>

              <g className="cursor-pointer" onClick={() => setSelectedCluster(2)}>
                <rect x="490" y="135" width="160" height="36" rx="6" fill={selectedCluster === 2 ? '#C4453F' : '#FFFFFF'} stroke="#C4453F" strokeWidth="1.5" />
                <text x="570" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" fill={selectedCluster === 2 ? '#FFFFFF' : '#C4453F'}>
                  Cluster 2 (n=5)
                </text>
                <text x="570" y="165" textAnchor="middle" fontSize="9" fill={selectedCluster === 2 ? '#FFFFFF' : '#60636A'}>
                  Decade-Long Reversals
                </text>
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
              ? { border: 'border-[#1C4BBC]', tag: 'bg-[#DDE4F5] text-[#1C4BBC]' }
              : cluster.id === 2
              ? { border: 'border-[#C4453F]', tag: 'bg-[#FDF0EF] text-[#C4453F]' }
              : { border: 'border-[#2F9E68]', tag: 'bg-[#EBF7F0] text-[#2F9E68]' };

          return (
            <div
              key={cluster.id}
              onClick={() => setSelectedCluster(cluster.id)}
              className={`bg-white rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] border-2 cursor-pointer transition-all ${
                isSelected ? `${colorTheme.border} ring-2 ring-opacity-20` : 'border-[#E4E9F2] hover:border-[#CAD3E6]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${colorTheme.tag}`}>
                  Cluster {cluster.id} · {cluster.size} indicators
                </span>
                <span className="text-[11px] font-mono text-[#60636A]">
                  Shape: {cluster.keyShape}
                </span>
              </div>

              <h4 className="text-[15px] font-bold text-[#0B0F19] mb-2 leading-tight">
                {cluster.name.split(':')[1]}
              </h4>

              <p className="text-[12px] text-[#60636A] leading-relaxed mb-4">
                {cluster.description}
              </p>

              <div className="border-t border-[#E4E9F2] pt-3">
                <div className="text-[11px] font-semibold text-[#60636A] uppercase tracking-wider mb-2">
                  Member Indicators:
                </div>
                <ul className="space-y-1.5">
                  {cluster.members.map((m, idx) => (
                    <li key={idx} className="text-[12px] text-[#0B0F19] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#60636A]" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E4E9F2] text-[11px] text-[#60636A] flex justify-between">
                <span>Domain Composition:</span>
                <span className="font-mono font-semibold text-[#0B0F19]">{cluster.domainMix}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Validation Callout */}
      <Callout
        type="info"
        kicker="CLUSTERING VALIDATION FINDING"
        title="Adjusted Rand Index (ARI) = 0.072 (Near Chance)"
      >
        External validation against WHO disease category taxonomies yields an <strong>ARI of 0.072</strong>. This near-zero agreement demonstrates that indicators cluster by <strong>trajectory dynamics and delivery disruption shape</strong>, rather than by physiological organ system or medical category.
      </Callout>

      {/* 5. Domain x Cluster Cross-Tabulation (Expandable) */}
      <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
        <button
          type="button"
          onClick={() => setCrossTabOpen(!crossTabOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0F19]">
              Domain × Trajectory Cluster Contingency Matrix
            </h3>
            <p className="text-[12px] text-[#60636A]">
              Cross-tabulation demonstrating how indicators from the same WHO domain disperse across different trajectory clusters
            </p>
          </div>
          <div className="p-1 rounded hover:bg-[#EDF1FA] text-[#60636A]">
            {crossTabOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        {crossTabOpen && (
          <div className="mt-4 pt-3 border-t border-[#E4E9F2] overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#E4E9F2] text-[#60636A]">
                  <th className="py-2.5 px-3 font-medium">Domain</th>
                  <th className="py-2.5 px-3 font-medium text-center text-[#1C4BBC]">
                    Cluster 1 (Halving Shock)
                  </th>
                  <th className="py-2.5 px-3 font-medium text-center text-[#C4453F]">
                    Cluster 2 (Reversals)
                  </th>
                  <th className="py-2.5 px-3 font-medium text-center text-[#2F9E68]">
                    Cluster 3 (Secular)
                  </th>
                  <th className="py-2.5 px-3 font-medium text-right">Total Analyzed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9F2]">
                {CROSS_TAB_CLUSTERING.map((r, i) => (
                  <tr key={i} className="hover:bg-[#EDF1FA]/40">
                    <td className="py-2 px-3 font-medium text-[#0B0F19]">{r.domain}</td>
                    <td className="py-2 px-3 font-mono tabular-nums text-center text-[#1C4BBC] font-semibold">
                      {r.c1 > 0 ? r.c1 : '—'}
                    </td>
                    <td className="py-2 px-3 font-mono tabular-nums text-center text-[#C4453F] font-semibold">
                      {r.c2 > 0 ? r.c2 : '—'}
                    </td>
                    <td className="py-2 px-3 font-mono tabular-nums text-center text-[#2F9E68] font-semibold">
                      {r.c3 > 0 ? r.c3 : '—'}
                    </td>
                    <td className="py-2 px-3 font-mono tabular-nums text-right font-bold text-[#0B0F19]">
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
