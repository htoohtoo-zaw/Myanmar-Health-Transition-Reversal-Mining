import React, { useState, useRef } from 'react';
import { NavigationPage } from './types';
import { Navigation, TopBar } from './components/Navigation';
import { OverviewPage } from './pages/OverviewPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { RawDataPage } from './pages/RawDataPage';
import { ReversalPage } from './pages/ReversalPage';
import { ClusteringPage } from './pages/ClusteringPage';
import { DiseaseLevelsPage } from './pages/DiseaseLevelsPage';
import { AssociationRulesPage } from './pages/AssociationRulesPage';
import { AnomalyPage } from './pages/AnomalyPage';
import { SynthesisPage } from './pages/SynthesisPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { PredictPage } from './pages/PredictPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const mainScrollRef = useRef<HTMLElement>(null);

  const handleNavigate = (page: NavigationPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage onNavigate={handleNavigate} />;
      case 'data-quality':
        return <DataQualityPage />;
      case 'raw-data':
        return <RawDataPage />;
      case 'reversal':
        return <ReversalPage />;
      case 'clustering':
        return <ClusteringPage />;
      case 'disease-levels':
        return <DiseaseLevelsPage />;
      case 'association-rules':
        return <AssociationRulesPage />;
      case 'anomaly':
        return <AnomalyPage />;
      case 'synthesis':
        return <SynthesisPage onNavigate={handleNavigate} />;
      case 'model-performance':
        return <ModelPerformancePage />;
      case 'predict':
        return <PredictPage />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      default:
        return <OverviewPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--c-surface-2)] text-[var(--c-ink)]">
      {/* Sidebar Navigation (In-flow desktop sidebar + off-canvas mobile drawer) */}
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area (Separated adjacent container, never overlapped) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky TopBar */}
        <TopBar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onToggleMobile={() => setMobileMenuOpen((prev) => !prev)}
        />

        {/* Scrollable Viewport */}
        <main
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto pb-12">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
