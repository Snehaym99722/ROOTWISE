import React from 'react';
import { 
  ShieldCheck, 
  Plus, 
  FlaskConical, 
  FileCheck2,
  Database,
  Building2
} from 'lucide-react';

interface HeaderProps {
  onNewInvestigation: () => void;
  investigationCount: number;
  currentView: 'list' | 'detail';
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewInvestigation,
  investigationCount,
  currentView,
  onNavigateHome
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      {/* Top Demo Compliance Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400"></span>
          <span className="font-semibold text-slate-200">ROOTWISE AI</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Pharma API Quality Investigation Workspace</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-amber-300 font-mono text-[11px]">DEMONSTRATION WORKSPACE · HUMAN REVIEW REQUIRED</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span>Investigation records: {investigationCount}</span>
          </span>
          <span aria-hidden="true" className="text-slate-700">|</span>
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Site: API Active Synthesis Plant #2</span>
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left focus:outline-none group"
            title="Return to Master Investigation Register"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 group-hover:border-teal-400 transition-colors">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  ROOTWISE<span className="text-teal-400">.AI</span>
                </span>
                <span className="text-[10px] font-mono text-teal-400 border border-teal-500/30 px-1 py-0.2 rounded bg-teal-950/40">
                  RCA v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pharmaceutical Root Cause Analysis & CAPA Management
              </p>
            </div>
          </button>

          {currentView === 'detail' && (
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-400 hover:text-slate-200 border-l border-slate-800 pl-4 py-1 ml-2 transition-colors flex items-center gap-1.5"
            >
              <span>← All Investigations</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 mr-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Review history available</span>
          </div>

          <button
            onClick={onNewInvestigation}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-md shadow-sm transition-colors focus:ring-2 focus:ring-teal-400 focus:outline-none"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Quality Event</span>
          </button>
        </div>
      </div>
    </header>
  );
};
