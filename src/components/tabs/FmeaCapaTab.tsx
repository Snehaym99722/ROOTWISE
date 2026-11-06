import React, { useState } from 'react';
import { 
  Investigation, 
  CapaItem, 
  RiskAssessment 
} from '../../types/investigation.ts';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Trash2,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { requestAiRcaAnalysis } from '../../services/apiClient.ts';

interface FmeaCapaTabProps {
  investigation: Investigation;
  onUpdate: (updated: Investigation) => void;
}

export const FmeaCapaTab: React.FC<FmeaCapaTabProps> = ({
  investigation,
  onUpdate
}) => {
  const [showAddCapaModal, setShowAddCapaModal] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [newCapa, setNewCapa] = useState<Partial<CapaItem>>({
    type: 'PREVENTIVE',
    title: '',
    description: '',
    owner: '',
    department: 'Engineering & Maintenance',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: 'OPEN',
    verificationMethod: ''
  });

  const risk = investigation.riskAssessment || {
    severity: 7,
    occurrence: 5,
    detection: 4,
    rpn: 140,
    riskCategory: 'MEDIUM',
    rationale: 'Initial assessment'
  };

  const handleUpdateRisk = (field: 'severity' | 'occurrence' | 'detection', value: number) => {
    const s = field === 'severity' ? value : risk.severity;
    const o = field === 'occurrence' ? value : risk.occurrence;
    const d = field === 'detection' ? value : risk.detection;
    const rpn = s * o * d;

    let riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (rpn >= 200 || s >= 9) riskCategory = 'CRITICAL';
    else if (rpn >= 120 || s >= 7) riskCategory = 'HIGH';
    else if (rpn >= 60) riskCategory = 'MEDIUM';

    onUpdate({
      ...investigation,
      riskAssessment: {
        ...risk,
        [field]: value,
        rpn,
        riskCategory
      }
    });
  };

  const handleUpdateRationale = (text: string) => {
    onUpdate({
      ...investigation,
      riskAssessment: {
        ...risk,
        rationale: text
      }
    });
  };

  const handleAddCapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCapa.title) return;

    const capaItem: CapaItem = {
      id: `CAPA-${investigation.id}-${investigation.capas.length + 1}`,
      type: newCapa.type || 'PREVENTIVE',
      title: newCapa.title || '',
      description: newCapa.description || '',
      owner: newCapa.owner || 'Assigned Lead',
      department: newCapa.department || 'Quality Assurance',
      dueDate: newCapa.dueDate || new Date().toISOString().split('T')[0],
      status: 'OPEN',
      verificationMethod: newCapa.verificationMethod || 'Verification of Effectiveness protocol execution'
    };

    onUpdate({
      ...investigation,
      capas: [...investigation.capas, capaItem],
      status: investigation.status === 'UNDER_INVESTIGATION' ? 'CAPA_PENDING' : investigation.status
    });

    setShowAddCapaModal(false);
    setNewCapa({
      type: 'PREVENTIVE',
      title: '',
      description: '',
      owner: '',
      department: 'Engineering & Maintenance',
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'OPEN',
      verificationMethod: ''
    });
  };

  const handleCycleCapaStatus = (id: string) => {
    const statuses: CapaItem['status'][] = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED'];
    const updated = investigation.capas.map(c => {
      if (c.id === id) {
        const nextIdx = (statuses.indexOf(c.status) + 1) % statuses.length;
        return { ...c, status: statuses[nextIdx] };
      }
      return c;
    });

    onUpdate({
      ...investigation,
      capas: updated
    });
  };

  const handleDeleteCapa = (id: string) => {
    onUpdate({
      ...investigation,
      capas: investigation.capas.filter(c => c.id !== id)
    });
  };

  const handleAiSuggestCapas = async () => {
    setIsAiLoading(true);
    try {
      const result = await requestAiRcaAnalysis(investigation);
      if (result.suggestedCapas && result.suggestedCapas.length > 0) {
        onUpdate({
          ...investigation,
          capas: [...investigation.capas, ...result.suggestedCapas],
          status: 'CAPA_PENDING',
          isAiAssisted: true
        });
      }
    } catch (err) {
      console.error('Failed to generate AI CAPAs:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const getRpnBadgeColor = (cat: string) => {
    switch (cat) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/60';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/60';
      case 'MEDIUM':
        return 'text-sky-400 bg-sky-950/40 border-sky-800/60';
      default:
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* ICH Q9 Risk Assessment Matrix Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>ICH Q9 Quality Risk Management (FMEA Scoring)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Defines risk level based on clinical patient severity, recurrence probability, and detection controls
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded border text-xs font-mono font-bold flex items-center gap-2 ${getRpnBadgeColor(risk.riskCategory)}`}>
              <span>RPN SCORE: {risk.rpn}</span>
              <span aria-hidden="true" className="opacity-50">/ 1000</span>
              <span className="text-[10px] uppercase font-sans font-semibold">({risk.riskCategory})</span>
            </div>
          </div>
        </div>

        {/* 3 Interactive Factor Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
          {/* Severity */}
          <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Severity (S)</span>
              <span className="font-mono text-rose-400 font-bold">{risk.severity} / 10</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Impact on API Critical Quality Attributes (CQAs) and patient safety.
            </p>
            <input
              type="range"
              min="1"
              max="10"
              value={risk.severity}
              onChange={e => handleUpdateRisk('severity', parseInt(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono">
              <span>1: Minor / Cosmetic</span>
              <span>10: Direct Hazard</span>
            </div>
          </div>

          {/* Occurrence */}
          <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Occurrence (O)</span>
              <span className="font-mono text-amber-400 font-bold">{risk.occurrence} / 10</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Frequency of failure occurrence and maintenance deferral likelihood.
            </p>
            <input
              type="range"
              min="1"
              max="10"
              value={risk.occurrence}
              onChange={e => handleUpdateRisk('occurrence', parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono">
              <span>1: Extremely Rare</span>
              <span>10: Frequent Drift</span>
            </div>
          </div>

          {/* Detectability */}
          <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Detection Difficulty (D)</span>
              <span className="font-mono text-sky-400 font-bold">{risk.detection} / 10</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Difficulty of intercepting defect prior to batch distribution.
            </p>
            <input
              type="range"
              min="1"
              max="10"
              value={risk.detection}
              onChange={e => handleUpdateRisk('detection', parseInt(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono">
              <span>1: Automated Sensor Trip</span>
              <span>10: Undetectable</span>
            </div>
          </div>
        </div>

        {/* Risk Rationale */}
        <div className="mt-4">
          <label className="text-slate-400 block mb-1 text-xs font-medium">
            ICH Q9 Risk Evaluation Rationale & Mitigating Controls:
          </label>
          <input
            type="text"
            value={risk.rationale}
            onChange={e => handleUpdateRationale(e.target.value)}
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* CAPA Plan Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              <span>Corrective & Preventive Action Plan (CAPA)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enforces engineering controls, SOP overhauls, and Verification of Effectiveness (VoE)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAiSuggestCapas}
              disabled={isAiLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-xs rounded transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isAiLoading ? 'Synthesizing...' : 'AI Propose CAPAs'}</span>
            </button>

            <button
              onClick={() => setShowAddCapaModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create CAPA Item</span>
            </button>
          </div>
        </div>

        {/* CAPA Action Cards */}
        <div className="mt-4 space-y-3">
          {investigation.capas.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/40 border border-slate-800/80 rounded-lg text-slate-500 text-xs">
              No CAPA items registered. Click "Create CAPA Item" or "AI Propose CAPAs" to establish remediation actions.
            </div>
          ) : (
            investigation.capas.map(capa => (
              <div 
                key={capa.id}
                className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg text-xs space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      capa.type === 'CORRECTIVE' 
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50' 
                        : 'bg-teal-950/60 text-teal-300 border border-teal-800/50'
                    }`}>
                      {capa.type} ACTION
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">{capa.id}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleCycleCapaStatus(capa.id)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        capa.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        capa.status === 'COMPLETED' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                        capa.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}
                      title="Click to advance status"
                    >
                      <Clock className="w-3 h-3" />
                      <span>{capa.status}</span>
                      <ChevronRight className="w-3 h-3 opacity-60" />
                    </button>

                    <button
                      onClick={() => handleDeleteCapa(capa.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete CAPA"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-100">{capa.title}</h4>
                  <p className="text-slate-300 mt-1 leading-relaxed">{capa.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800/60">
                  <div>
                    <span className="text-slate-500 block">Assigned Owner:</span>
                    <span className="text-slate-200 font-medium">{capa.owner}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Department:</span>
                    <span className="text-slate-200">{capa.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Regulatory Due Date:</span>
                    <span className="text-teal-300 font-mono">{capa.dueDate}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-start gap-2 text-[11px]">
                  <span className="text-slate-500 uppercase tracking-wider font-mono shrink-0 mt-0.5">
                    VoE Protocol:
                  </span>
                  <span className="text-slate-300 font-mono">
                    {capa.verificationMethod}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add CAPA Modal */}
      {showAddCapaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-lg w-full space-y-4">
            <h3 className="text-base font-semibold text-white">Create Corrective / Preventive Action</h3>
            <form onSubmit={handleAddCapa} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">CAPA Classification</label>
                  <select
                    value={newCapa.type}
                    onChange={e => setNewCapa({ ...newCapa, type: e.target.value as any })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                  >
                    <option value="PREVENTIVE">PREVENTIVE (Systemic Control)</option>
                    <option value="CORRECTIVE">CORRECTIVE (Containment & Fix)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newCapa.dueDate}
                    onChange={e => setNewCapa({ ...newCapa, dueDate: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Action Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Upgrade actuator diaphragm to Viton & install particulate filter"
                  value={newCapa.title}
                  onChange={e => setNewCapa({ ...newCapa, title: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Action Description & Scope</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detailed engineering specifications or procedural change instructions"
                  value={newCapa.description}
                  onChange={e => setNewCapa({ ...newCapa, description: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Responsible Owner</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Miller (Plant Maintenance Lead)"
                    value={newCapa.owner}
                    onChange={e => setNewCapa({ ...newCapa, owner: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={newCapa.department}
                    onChange={e => setNewCapa({ ...newCapa, department: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Verification of Effectiveness (VoE) Criteria</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verify 0 pressure drift across next 5 consecutive batches"
                  value={newCapa.verificationMethod}
                  onChange={e => setNewCapa({ ...newCapa, verificationMethod: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCapaModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded"
                >
                  Save CAPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
