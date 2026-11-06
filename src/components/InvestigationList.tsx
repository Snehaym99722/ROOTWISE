import React, { useState, useMemo } from 'react';
import { 
  Search, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  FileSpreadsheet,
  AlertOctagon,
  Gauge
} from 'lucide-react';
import { Investigation, SeverityLevel, InvestigationStatus } from '../types/investigation.ts';

interface InvestigationListProps {
  investigations: Investigation[];
  onSelect: (investigation: Investigation) => void;
  onNew: () => void;
}

export const InvestigationList: React.FC<InvestigationListProps> = ({
  investigations,
  onSelect,
  onNew
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | SeverityLevel>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InvestigationStatus>('ALL');

  // Metrics calculations
  const metrics = useMemo(() => {
    const total = investigations.length;
    const critical = investigations.filter(i => i.severity === 'CRITICAL').length;
    const openCapas = investigations.reduce((acc, curr) => {
      const open = curr.capas.filter(c => c.status !== 'VERIFIED' && c.status !== 'COMPLETED').length;
      return acc + open;
    }, 0);
    const underReview = investigations.filter(i => i.status === 'UNDER_INVESTIGATION' || i.status === 'QA_REVIEW').length;

    return { total, critical, openCapas, underReview };
  }, [investigations]);

  // Filtered list
  const filteredInvestigations = useMemo(() => {
    return investigations.filter(inv => {
      const matchesSearch = 
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.apiProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.equipmentId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity = severityFilter === 'ALL' || inv.severity === severityFilter;
      const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [investigations, searchTerm, severityFilter, statusFilter]);

  const getSeverityStyle = (sev: SeverityLevel) => {
    switch (sev) {
      case 'CRITICAL':
        return 'text-rose-400 font-semibold';
      case 'MAJOR':
        return 'text-amber-400 font-medium';
      case 'MINOR':
        return 'text-slate-300 font-normal';
    }
  };

  const getStatusLabel = (status: InvestigationStatus) => {
    switch (status) {
      case 'UNDER_INVESTIGATION':
        return 'Under Investigation';
      case 'CAPA_PENDING':
        return 'CAPA Implementation';
      case 'QA_REVIEW':
        return 'QA Formal Review';
      case 'CLOSED':
        return 'Closed & Signed';
      case 'DRAFT':
        return 'Draft Protocol';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              API Quality Deviations & Root Cause Analysis Register
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Defensible root-cause determination workspace for Active Pharmaceutical Ingredient manufacturing. 
              A working investigation workspace with source evidence, 5 Whys, Ishikawa 6M prompts, risk review, and CAPA tracking. AI suggestions remain unconfirmed until a qualified reviewer verifies them.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onNew}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-md shadow-sm transition-colors"
            >
              Log New Quality Event
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-md p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Active Dossiers</span>
              <FileSpreadsheet className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {metrics.total}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {metrics.underReview} pending technical resolution
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-md p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Critical OOS Events</span>
              <AlertOctagon className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-rose-400">
              {metrics.critical}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Immediate batch quarantine active
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-md p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Open CAPA Items</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {metrics.openCapas}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Across maintenance & QA departments
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-md p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Avg RCA Lead Time</span>
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              11.4d
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Target: &lt; 30 days (ICH Q10 SLA)
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Batch #, Deviation ID, Product, or Equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        {/* Segmented Controls for Filtering */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Severity filter tabs */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-md text-xs">
            <span className="text-[11px] text-slate-500 px-2 font-medium">Severity:</span>
            {(['ALL', 'CRITICAL', 'MAJOR', 'MINOR'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  severityFilter === sev
                    ? 'bg-slate-800 text-teal-300 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev === 'ALL' ? 'All' : sev.charAt(0) + sev.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-md text-xs">
            <span className="text-[11px] text-slate-500 px-2 font-medium">Status:</span>
            {(['ALL', 'UNDER_INVESTIGATION', 'CAPA_PENDING', 'QA_REVIEW', 'CLOSED'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-800 text-teal-300 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All' : st === 'UNDER_INVESTIGATION' ? 'Active' : st === 'CAPA_PENDING' ? 'CAPA' : st === 'QA_REVIEW' ? 'Review' : 'Closed'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Investigations Master Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-medium">
                <th className="py-3 px-4">Deviation ID</th>
                <th className="py-3 px-4">API Substance / Batch</th>
                <th className="py-3 px-4">Stage & Equipment</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">ICH Q9 RPN</th>
                <th className="py-3 px-4">Investigation Status</th>
                <th className="py-3 px-4">Signatures</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInvestigations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No investigations match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInvestigations.map((inv) => (
                  <tr 
                    key={inv.id}
                    onClick={() => onSelect(inv)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    {/* Deviation ID & Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-teal-400 group-hover:text-teal-300 transition-colors">
                        {inv.id}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(inv.incidentDate).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Drug Product & Batch */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">
                        {inv.apiProduct}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                        Batch: {inv.batchNumber}
                      </div>
                    </td>

                    {/* Stage & Equipment */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-300 truncate">
                        {inv.manufacturingStage}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {inv.equipmentId}
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          inv.severity === 'CRITICAL' ? 'bg-rose-500' : inv.severity === 'MAJOR' ? 'bg-amber-400' : 'bg-slate-400'
                        }`} />
                        <span className={getSeverityStyle(inv.severity)}>
                          {inv.severity}
                        </span>
                      </div>
                    </td>

                    {/* FMEA RPN Score */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-slate-200">
                        RPN {inv.riskAssessment.rpn}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        S{inv.riskAssessment.severity} · O{inv.riskAssessment.occurrence} · D{inv.riskAssessment.detection}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300">
                        {getStatusLabel(inv.status)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {inv.capas.filter(c => c.status === 'VERIFIED').length} / {inv.capas.length} CAPAs closed
                      </div>
                    </td>

                    {/* Signatures */}
                    <td className="py-3.5 px-4">
                      {inv.electronicSignatures.length > 0 ? (
                        <div className="flex items-center gap-1 text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{inv.electronicSignatures.length} Verified</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs">Pending Sign-off</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(inv);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-teal-400 hover:text-teal-300 font-medium group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Investigate</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
