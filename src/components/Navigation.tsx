import React from 'react';
import {
  Home,
  Database,
  TrendingDown,
  GitFork,
  Layers,
  Network,
  AlertTriangle,
  Compass,
  BarChart3,
  Sliders,
  Info,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { NavigationPage } from '../types';

export interface NavigationProps {
  currentPage: NavigationPage;
  onNavigate?: (page: NavigationPage) => void;
  onSelectPage?: (page: NavigationPage) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  badge?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
  onSelectPage,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const handleSelect = (page: NavigationPage) => {
    if (onNavigate) {
      onNavigate(page);
    }
    if (onSelectPage) {
      onSelectPage(page);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const mainItems: NavItem[] = [
    { id: 'overview', label: 'Executive Overview', icon: Home },
    { id: 'data-quality', label: 'Dataset & 4 Traps', icon: Database },
  ];

  const descriptiveItems: NavItem[] = [
    { id: 'reversal', label: 'Reversal Detection', icon: TrendingDown },
    { id: 'clustering', label: 'Trajectory Clustering', icon: GitFork },
    { id: 'disease-levels', label: 'Disease Levels (L/M/H)', icon: Layers },
    { id: 'association-rules', label: 'Association Rules', icon: Network },
    { id: 'anomaly', label: 'Anomaly & Surveillance', icon: AlertTriangle },
    { id: 'synthesis', label: 'Cross-Method Synthesis', icon: Compass },
  ];

  const predictiveItems: NavItem[] = [
    { id: 'model-performance', label: 'Model Performance', icon: BarChart3 },
    { id: 'predict', label: 'Predict Tool', icon: Sliders, badge: 'Live Model' },
  ];

  const footerItems: NavItem[] = [
    { id: 'about', label: 'About & Methodology', icon: Info },
  ];

  const renderNavGroup = (title: string | null, items: NavItem[]) => (
    <div className="mb-4">
      {title && (
        <div className="px-3 mb-1.5 text-[11px] font-semibold tracking-wider text-[#60636A] uppercase">
          {title}
        </div>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                id={`nav-item-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium rounded-[6px] transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#1C4BBC] text-white shadow-xs'
                    : 'text-[#0B0F19] hover:bg-[#DDE4F5] hover:text-[#1C4BBC]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className={isActive ? 'text-white shrink-0' : 'text-[#60636A] shrink-0'}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ml-1.5 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#DDE4F5] text-[#1C4BBC]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#E4E9F2] flex items-center justify-between shrink-0">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => handleSelect('overview')}
        >
          <div className="w-8 h-8 rounded-[6px] bg-[#1C4BBC] flex items-center justify-center text-white font-bold text-[15px] shrink-0 shadow-xs">
            MM
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#0B0F19] leading-tight">
              Myanmar Health
            </div>
            <div className="text-[11px] text-[#60636A]">
              Transition & Reversal
            </div>
          </div>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-[6px] text-[#60636A] hover:text-[#0B0F19] hover:bg-[#EDF1FA]"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Scrollable Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3">
        {renderNavGroup(null, mainItems)}
        {renderNavGroup('Descriptive Mining', descriptiveItems)}
        {renderNavGroup('Predictive Mining', predictiveItems)}
        {renderNavGroup('Reference', footerItems)}
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-3.5 border-t border-[#E4E9F2] bg-[#EDF1FA]/60 shrink-0">
        <div className="text-[11px] text-[#60636A] leading-relaxed">
          <div className="font-medium text-[#0B0F19]">WHO GHO Dataset</div>
          <div>20,613 records · 644 indicators</div>
          <div className="text-[10px] text-[#919398] mt-0.5">
            CRISP-DM Mining Pipeline
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (In-flow flex item: w-64 shrink-0, NEVER overlaps content) */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 h-screen bg-white border-r border-[#E4E9F2] z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-over Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-[#E4E9F2] flex flex-col transition-transform duration-200 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export interface TopBarProps {
  currentPage: NavigationPage;
  onNavigate?: (page: NavigationPage) => void;
  onToggleMobile?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  onNavigate,
  onToggleMobile,
}) => {
  const pageTitles: Record<NavigationPage, { section: string; title: string }> = {
    overview: { section: 'Executive Overview', title: 'Health Transition & Reversal Summary' },
    'data-quality': { section: 'Data Understanding & Prep', title: 'Dataset Profile & Four Quality Traps' },
    reversal: { section: 'Descriptive Mining', title: 'Reversal Detection & Years Lost' },
    clustering: { section: 'Descriptive Mining', title: 'Trajectory Clustering (DTW + Ward)' },
    'disease-levels': { section: 'Descriptive Mining', title: 'Disease Burden Discretisation (Low/Mid/High)' },
    'association-rules': { section: 'Descriptive Mining', title: 'Lagged Immunisation & Disease Rules' },
    anomaly: { section: 'Descriptive Mining', title: 'Isolation Forest Anomaly & Surveillance Quality' },
    synthesis: { section: 'Descriptive Mining', title: 'Cross-Method Synthesis & Timeline' },
    'model-performance': { section: 'Predictive Mining', title: 'Rare-Event Deterioration Model Evaluation' },
    predict: { section: 'Predictive Mining', title: 'Interactive Prediction & Risk Forecasting Tool' },
    about: { section: 'Methodology & Reference', title: 'CRISP-DM Mapping, Citation & Limitations' },
  };

  const meta = pageTitles[currentPage] || {
    section: 'Analytics Dashboard',
    title: 'Myanmar Health Transition',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E4E9F2] px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
      {/* Left: Mobile hamburger toggle + Breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
        {onToggleMobile && (
          <button
            type="button"
            onClick={onToggleMobile}
            className="lg:hidden p-1.5 -ml-1 rounded-[6px] text-[#0B0F19] hover:bg-[#EDF1FA] border border-[#CAD3E6]/60 cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu size={19} />
          </button>
        )}

        <div className="flex items-center gap-1.5 text-[13px] min-w-0">
          <span className="text-[#60636A] font-medium hidden sm:inline truncate">
            {meta.section}
          </span>
          <ChevronRight size={14} className="text-[#919398] hidden sm:inline shrink-0" />
          <span className="text-[#0B0F19] font-semibold truncate">
            {meta.title}
          </span>
        </div>
      </div>

      {/* Right: Quick Scope Badge and Jump Selector */}
      <div className="flex items-center gap-2.5 shrink-0">
        {onNavigate && (
          <select
            value={currentPage}
            onChange={(e) => onNavigate(e.target.value as NavigationPage)}
            className="hidden md:block text-[12px] font-medium text-[#0B0F19] bg-[#EDF1FA] border border-[#CAD3E6] rounded-[6px] px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-[#1C4BBC] cursor-pointer"
            aria-label="Quick jump to module"
          >
            <option value="overview">1. Overview</option>
            <option value="data-quality">2. Dataset & 4 Traps</option>
            <option value="reversal">3. Reversal Detection</option>
            <option value="clustering">4. Trajectory Clustering</option>
            <option value="disease-levels">5. Disease Discretisation</option>
            <option value="association-rules">6. Association Rules</option>
            <option value="anomaly">7. Anomaly & Completeness</option>
            <option value="synthesis">8. Cross-Method Synthesis</option>
            <option value="model-performance">9. Model Performance</option>
            <option value="predict">10. Interactive Predictor</option>
            <option value="about">11. Methodology & Reference</option>
          </select>
        )}

        <span className="inline-flex items-center px-2.5 py-1 rounded-[999px] text-[11px] sm:text-[12px] font-medium bg-[#EDF1FA] text-[#0B0F19] border border-[#CAD3E6]">
          1961–2030 · WHO GHO
        </span>
      </div>
    </header>
  );
};
