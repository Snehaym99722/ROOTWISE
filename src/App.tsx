import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Investigation } from './types/investigation.ts';
import { AppDispatch, RootState, selectInvestigation, setInvestigations, setLoading, upsertInvestigation } from './store.ts';
import { 
  fetchInvestigations, 
  persistInvestigation 
} from './services/apiClient.ts';
import { Header } from './components/Header.tsx';
import { InvestigationList } from './components/InvestigationList.tsx';
import { EventOverviewTab } from './components/tabs/EventOverviewTab.tsx';
import { FiveWhysTab } from './components/tabs/FiveWhysTab.tsx';
import { IshikawaTab } from './components/tabs/IshikawaTab.tsx';
import { PrecedentsTab } from './components/tabs/PrecedentsTab.tsx';
import { FmeaCapaTab } from './components/tabs/FmeaCapaTab.tsx';
import { AuditSignaturesTab } from './components/tabs/AuditSignaturesTab.tsx';
import { ReportTab } from './components/tabs/ReportTab.tsx';
import { NewInvestigationModal } from './components/NewInvestigationModal.tsx';
import { 
  FileText, 
  GitCommit, 
  Layers, 
  History, 
  ShieldCheck, 
  FileSignature, 
  Printer, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

type TabKey = 
  | 'overview' 
  | 'fiveWhys' 
  | 'ishikawa' 
  | 'precedents' 
  | 'fmeaCapa' 
  | 'auditSignatures' 
  | 'report';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { investigations, selectedId, loading } = useSelector((state: RootState) => state.workspace);
  const selectedInvestigation = investigations.find(item => item.id === selectedId) ?? null;
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load investigations from SQLite backend on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchInvestigations();
        dispatch(setInvestigations(data));
        if (data.length > 0 && !selectedId) {
          // Pre-select the first investigation so workspace is immediately visible
          dispatch(selectInvestigation(data[0].id));
        }
      } catch (err) {
        console.error('Failed to load investigations:', err);
      } finally {
        dispatch(setLoading(false));
      }
    }
    loadData();
  }, [dispatch]);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSelectInvestigation = (inv: Investigation) => {
    dispatch(selectInvestigation(inv.id));
    setActiveTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateInvestigation = async (updated: Investigation) => {
    dispatch(upsertInvestigation(updated));

    // Save to SQLite DB & localStorage
    await persistInvestigation(updated);
    showToast(`Dossier ${updated.id} changes recorded & synchronized with audit trail.`);
  };

  const handleCreateInvestigation = async (newInv: Investigation) => {
    const saved = await persistInvestigation(newInv);
    dispatch(upsertInvestigation(saved));
    dispatch(selectInvestigation(saved.id));
    setActiveTab('overview');
    showToast(`New quality deviation ${saved.id} initialized.`);
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: 'overview', label: '1. Event Dossier & Telemetry', icon: <FileText className="w-4 h-4" /> },
    { key: 'fiveWhys', label: '2. 5-Whys Causal Tree', icon: <GitCommit className="w-4 h-4" />, badge: selectedInvestigation?.fiveWhys?.length ? `${selectedInvestigation.fiveWhys.length}` : undefined },
    { key: 'ishikawa', label: '3. Ishikawa 6M Fishbone', icon: <Layers className="w-4 h-4" /> },
    { key: 'precedents', label: '4. Historical Precedents', icon: <History className="w-4 h-4" />, badge: selectedInvestigation?.historicalMatches?.length ? `${selectedInvestigation.historicalMatches.length}` : undefined },
    { key: 'fmeaCapa', label: '5. ICH Q9 Risk & CAPAs', icon: <ShieldCheck className="w-4 h-4" />, badge: selectedInvestigation?.capas?.length ? `${selectedInvestigation.capas.length}` : undefined },
    { key: 'auditSignatures', label: '6. Review & Audit Trail', icon: <FileSignature className="w-4 h-4" />, badge: selectedInvestigation?.electronicSignatures?.length ? `${selectedInvestigation.electronicSignatures.length} Acknowledged` : undefined },
    { key: 'report', label: '7. Investigation Report (Draft)', icon: <Printer className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Mounting ROOTWISE AI Pharmaceutical Investigation SQLite Database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        onNewInvestigation={() => setIsNewModalOpen(true)}
        investigationCount={investigations.length}
        currentView={selectedInvestigation ? 'detail' : 'list'}
        onNavigateHome={() => dispatch(selectInvestigation(null))}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-5 right-5 z-50 bg-teal-950 border border-teal-500/50 text-teal-200 px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {!selectedInvestigation ? (
          /* Master Investigation Register View */
          <InvestigationList
            investigations={investigations}
            onSelect={handleSelectInvestigation}
            onNew={() => setIsNewModalOpen(true)}
          />
        ) : (
          /* Single Investigation Deep-Dive Workspace */
          <div className="space-y-6">
            {/* Dossier Top Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => dispatch(selectInvestigation(null))}
                      className="inline-flex items-center gap-1.5 rounded-md border border-teal-700/70 bg-teal-950/50 px-3 py-1.5 text-sm font-bold text-teal-200 shadow-sm transition-colors hover:border-teal-500 hover:bg-teal-900/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 group"
                      title="Back to All Quality Events"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      <span>Register</span>
                    </button>
                    <span aria-hidden="true" className="text-slate-700">|</span>
                    <span className="font-mono text-base font-bold text-teal-400">
                      {selectedInvestigation.id}
                    </span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className={`font-semibold text-xs ${
                      selectedInvestigation.severity === 'CRITICAL' ? 'text-rose-400' :
                      selectedInvestigation.severity === 'MAJOR' ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {selectedInvestigation.severity} DEVIATION
                    </span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="font-mono text-xs text-slate-300">
                      Batch: {selectedInvestigation.batchNumber}
                    </span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="text-xs text-slate-400">
                      {selectedInvestigation.apiProduct}
                    </span>
                  </div>

                  <h1 className="text-lg font-bold text-white mt-1.5 leading-snug">
                    {selectedInvestigation.title}
                  </h1>
                </div>

                <div className="flex items-center gap-3 self-start lg:self-auto">
                  <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-xs font-mono">
                    <span className="text-slate-500 mr-2">STATUS:</span>
                    <span className="text-teal-300 font-semibold">{selectedInvestigation.status}</span>
                  </div>
                </div>
              </div>

              {/* Segmented Tab Navigation */}
              <div className="flex items-center gap-1 mt-5 pt-4 border-t border-slate-800 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                      activeTab === tab.key
                        ? 'bg-slate-800 text-teal-300 font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Body View */}
            <div>
              {activeTab === 'overview' && (
                <EventOverviewTab
                  investigation={selectedInvestigation}
                  onUpdate={handleUpdateInvestigation}
                />
              )}
              {activeTab === 'fiveWhys' && (
                <FiveWhysTab
                  investigation={selectedInvestigation}
                  onUpdate={handleUpdateInvestigation}
                />
              )}
              {activeTab === 'ishikawa' && (
                <IshikawaTab
                  investigation={selectedInvestigation}
                  onUpdate={handleUpdateInvestigation}
                />
              )}
              {activeTab === 'precedents' && (
                <PrecedentsTab
                  investigation={selectedInvestigation}
                  onUpdate={handleUpdateInvestigation}
                />
              )}
              {activeTab === 'fmeaCapa' && (
                <FmeaCapaTab
                  investigation={selectedInvestigation}
                  onUpdate={handleUpdateInvestigation}
                />
              )}
              {activeTab === 'auditSignatures' && (
                <AuditSignaturesTab
                  investigation={selectedInvestigation}
                  onUpdate={handleUpdateInvestigation}
                />
              )}
              {activeTab === 'report' && (
                <ReportTab
                  investigation={selectedInvestigation}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* New Quality Event Modal */}
      <NewInvestigationModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreateInvestigation}
      />
    </div>
  );
}
