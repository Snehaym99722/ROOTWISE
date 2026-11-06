import React, { useState } from 'react';
import { 
  Investigation, 
  HistoricalMatch 
} from '../../types/investigation.ts';
import { 
  History, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  BookOpen,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface PrecedentsTabProps {
  investigation: Investigation;
  onUpdate: (updated: Investigation) => void;
}

export const PrecedentsTab: React.FC<PrecedentsTabProps> = ({
  investigation,
  onUpdate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<HistoricalMatch | null>(
    investigation.historicalMatches?.[0] || null
  );

  const matches = investigation.historicalMatches || [];

  const filteredMatches = matches.filter(m => 
    m.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.deviationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.failureMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.rootCause.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdoptLearning = (match: HistoricalMatch) => {
    const existingSummary = investigation.rootCauseSummary ? `${investigation.rootCauseSummary}\n\n` : '';
    const updatedSummary = `${existingSummary}[Historical Precedent Insight from ${match.deviationId}]: ${match.learnings}`;

    onUpdate({
      ...investigation,
      rootCauseSummary: updatedSummary
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <History className="w-4 h-4 text-teal-400" />
              <span>Historical Precedent & Cross-Batch Recurrence Intelligence</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Correlating current event against archived batch execution deviations and past CAPA effectiveness
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search historical records..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Grid: Match Cards & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Matched Records */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Correlated Deviations ({filteredMatches.length})
          </span>

          {filteredMatches.length === 0 ? (
            <div className="p-6 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              No matching historical precedents found in database.
            </div>
          ) : (
            filteredMatches.map(match => (
              <div
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors text-xs space-y-2 ${
                  selectedMatch?.id === match.id
                    ? 'bg-slate-850 border-teal-500 shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-teal-400">
                    {match.deviationId}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-200">
                    {match.similarityScore}% SIMILARITY
                  </span>
                </div>

                <div className="font-medium text-slate-200">
                  {match.failureMode}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Batch {match.batchNumber}</span>
                  <span>{match.date}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px]">
                  {match.capaEffective ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Past CAPA Effective</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-400">
                      <XCircle className="w-3 h-3" />
                      <span>Defect Recurred (CAPA Ineffective)</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Deep-Dive Precedent Analysis */}
        <div className="lg:col-span-2">
          {selectedMatch ? (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5 text-xs">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white font-mono">
                      {selectedMatch.deviationId}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-teal-400 font-mono">
                      Batch {selectedMatch.batchNumber}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-400">{selectedMatch.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 mt-1">
                    {selectedMatch.failureMode}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold font-mono text-teal-300">
                    {selectedMatch.similarityScore}%
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Cosine Feature Match
                  </div>
                </div>
              </div>

              {/* Past Root Cause Finding */}
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block mb-1">
                  Archived Root Cause Determination
                </span>
                <p className="p-3 bg-slate-950 rounded border border-slate-800 text-slate-200 leading-relaxed font-mono text-[11px]">
                  {selectedMatch.rootCause}
                </p>
              </div>

              {/* CAPA Effectiveness Audit */}
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block mb-1">
                  Historical CAPA Outcome Evaluation
                </span>
                <div className={`p-3 rounded border text-xs leading-relaxed flex items-start gap-2.5 ${
                  selectedMatch.capaEffective
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                    : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                }`}>
                  {selectedMatch.capaEffective ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold block mb-0.5">
                      {selectedMatch.capaEffective ? 'Action was Effective in preventing immediate recurrence' : 'Recurring Defect Pattern: Historical CAPA was incomplete'}
                    </span>
                    <span className="text-[11px] opacity-90">{selectedMatch.learnings}</span>
                  </div>
                </div>
              </div>

              {/* Investigation Learnings & Action to Adopt */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-slate-200 font-semibold">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Key Investigation Takeaway for Current Deviation</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Comparing current failure dynamics with {selectedMatch.deviationId} demonstrates that recurring mechanical issues require systemic engineering redesign (e.g. automated interlocks or upgraded fluoropolymer materials) rather than recurring operator retrainings.
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleAdoptLearning(selectedMatch)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded font-medium transition-colors"
                  >
                    <span>Import Historical Finding into RCA Summary</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center text-slate-500 text-xs">
              Select an archived deviation from the left panel to examine past root causes and CAPA performance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
