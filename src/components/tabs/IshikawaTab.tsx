import React, { useState } from 'react';
import { 
  Investigation, 
  FishboneFactor, 
  SixMCategory 
} from '../../types/investigation.ts';
import { 
  Layers, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Trash2,
  HelpCircle,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { requestAiRcaAnalysis } from '../../services/apiClient.ts';

interface IshikawaTabProps {
  investigation: Investigation;
  onUpdate: (updated: Investigation) => void;
}

const SIX_M_CATEGORIES: SixMCategory[] = [
  'Machine',
  'Method',
  'Material',
  'Man',
  'Measurement',
  'Milieu'
];

export const IshikawaTab: React.FC<IshikawaTabProps> = ({
  investigation,
  onUpdate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SixMCategory>('Machine');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [newFactorText, setNewFactorText] = useState('');
  const [newFactorCategory, setNewFactorCategory] = useState<SixMCategory>('Machine');
  const [newFactorLikelihood, setNewFactorLikelihood] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [newFactorNotes, setNewFactorNotes] = useState('');

  const factors = investigation.fishboneFactors || [];

  const handleAddFactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactorText.trim()) return;

    const newFactor: FishboneFactor = {
      id: `F-${Date.now()}`,
      category: newFactorCategory,
      factor: newFactorText.trim(),
      likelihood: newFactorLikelihood,
      verified: false,
      notes: newFactorNotes.trim()
    };

    onUpdate({
      ...investigation,
      fishboneFactors: [...factors, newFactor]
    });

    setNewFactorText('');
    setNewFactorNotes('');
    setShowAddModal(false);
  };

  const handleToggleVerify = (id: string) => {
    const updated = factors.map(f => {
      if (f.id === id) {
        return { ...f, verified: !f.verified };
      }
      return f;
    });

    onUpdate({
      ...investigation,
      fishboneFactors: updated
    });
  };

  const handleToggleRootCause = (id: string) => {
    const updated = factors.map(f => {
      if (f.id === id) {
        return { ...f, isRootCause: !f.isRootCause };
      }
      return f;
    });

    onUpdate({
      ...investigation,
      fishboneFactors: updated
    });
  };

  const handleDeleteFactor = (id: string) => {
    onUpdate({
      ...investigation,
      fishboneFactors: factors.filter(f => f.id !== id)
    });
  };

  const handleAiBrainstorm = async () => {
    setIsAiLoading(true);
    try {
      const result = await requestAiRcaAnalysis(investigation);
      if (result.suggestedFishbone && result.suggestedFishbone.length > 0) {
        // Merge suggested factors without duplicate IDs
        const existingTexts = new Set(factors.map(f => f.factor.toLowerCase()));
        const additions = result.suggestedFishbone.filter(f => !existingTexts.has(f.factor.toLowerCase()));

        onUpdate({
          ...investigation,
          fishboneFactors: [...factors, ...additions],
          isAiAssisted: true
        });
      }
    } catch (err) {
      console.error('Failed AI 6M brainstorm:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const getFactorsByCategory = (cat: SixMCategory) => {
    return factors.filter(f => f.category === cat);
  };

  return (
    <div className="space-y-6">
      {/* Overview & AI Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Ishikawa 6M Cause-and-Effect Matrix (Fishbone)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive exploration across Machine, Method, Material, Man, Measurement, and Milieu
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAiBrainstorm}
              disabled={isAiLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-xs rounded transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isAiLoading ? 'Analyzing...' : 'AI Brainstorm 6Ms'}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Causal Factor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Fishbone SVG Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
          <span>Interactive 6M Diagram Representation</span>
          <span className="font-mono text-[11px] text-teal-400">{factors.length} Investigated Factors</span>
        </div>

        <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800/80 overflow-x-auto">
          <div className="min-w-[850px] relative py-6">
            {/* SVG Spine and Diagonal Ribs */}
            <svg className="w-full h-80" viewBox="0 0 850 320" fill="none">
              {/* Central Spine */}
              <line x1="40" y1="160" x2="680" y2="160" stroke="#0ea5e9" strokeWidth="4" />
              <polygon points="680,150 710,160 680,170" fill="#0ea5e9" />

              {/* Upper Rib 1: Machine (x=160) */}
              <line x1="180" y1="30" x2="260" y2="160" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Upper Rib 2: Method (x=340) */}
              <line x1="360" y1="30" x2="440" y2="160" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Upper Rib 3: Material (x=520) */}
              <line x1="540" y1="30" x2="620" y2="160" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Lower Rib 1: Man (x=260) */}
              <line x1="260" y1="160" x2="180" y2="290" stroke="#14b8a6" strokeWidth="2.5" />
              {/* Lower Rib 2: Measurement (x=440) */}
              <line x1="440" y1="160" x2="360" y2="290" stroke="#14b8a6" strokeWidth="2.5" />
              {/* Lower Rib 3: Milieu (x=620) */}
              <line x1="620" y1="160" x2="540" y2="290" stroke="#14b8a6" strokeWidth="2.5" />
            </svg>

            {/* Effect / Problem Box (Right Head of Fishbone) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-48 bg-rose-950/40 border border-rose-500/60 p-3 rounded text-center shadow-lg">
              <span className="text-[10px] text-rose-300 font-semibold uppercase tracking-wider block">
                Primary Quality Event
              </span>
              <span className="text-xs font-bold text-white block mt-1 leading-snug">
                {investigation.title}
              </span>
              <span className="text-[10px] font-mono text-rose-300 block mt-1">
                Batch: {investigation.batchNumber}
              </span>
            </div>

            {/* Rib Labels on the SVG Layout */}
            {/* Machine */}
            <div 
              onClick={() => setSelectedCategory('Machine')}
              className="absolute left-36 top-2 cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1 rounded text-xs font-semibold text-sky-300 flex items-center gap-1.5 shadow"
            >
              <span>1. MACHINE</span>
              <span className="text-[10px] text-slate-400">({getFactorsByCategory('Machine').length})</span>
            </div>

            {/* Method */}
            <div 
              onClick={() => setSelectedCategory('Method')}
              className="absolute left-[340px] top-2 cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1 rounded text-xs font-semibold text-sky-300 flex items-center gap-1.5 shadow"
            >
              <span>2. METHOD</span>
              <span className="text-[10px] text-slate-400">({getFactorsByCategory('Method').length})</span>
            </div>

            {/* Material */}
            <div 
              onClick={() => setSelectedCategory('Material')}
              className="absolute left-[520px] top-2 cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1 rounded text-xs font-semibold text-sky-300 flex items-center gap-1.5 shadow"
            >
              <span>3. MATERIAL</span>
              <span className="text-[10px] text-slate-400">({getFactorsByCategory('Material').length})</span>
            </div>

            {/* Man */}
            <div 
              onClick={() => setSelectedCategory('Man')}
              className="absolute left-36 bottom-2 cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1 rounded text-xs font-semibold text-teal-300 flex items-center gap-1.5 shadow"
            >
              <span>4. MAN (Personnel)</span>
              <span className="text-[10px] text-slate-400">({getFactorsByCategory('Man').length})</span>
            </div>

            {/* Measurement */}
            <div 
              onClick={() => setSelectedCategory('Measurement')}
              className="absolute left-[320px] bottom-2 cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1 rounded text-xs font-semibold text-teal-300 flex items-center gap-1.5 shadow"
            >
              <span>5. MEASUREMENT (LIMS)</span>
              <span className="text-[10px] text-slate-400">({getFactorsByCategory('Measurement').length})</span>
            </div>

            {/* Milieu */}
            <div 
              onClick={() => setSelectedCategory('Milieu')}
              className="absolute left-[520px] bottom-2 cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1 rounded text-xs font-semibold text-teal-300 flex items-center gap-1.5 shadow"
            >
              <span>6. MILIEU (Environment)</span>
              <span className="text-[10px] text-slate-400">({getFactorsByCategory('Milieu').length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6M Category Inspector & Factor Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200">Category Filter:</span>
            <div className="flex flex-wrap gap-1">
              {SIX_M_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    selectedCategory === cat
                      ? 'bg-teal-500 text-slate-950 font-semibold shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {cat} ({getFactorsByCategory(cat).length})
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setNewFactorCategory(selectedCategory);
              setShowAddModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-teal-400 rounded transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Factor in {selectedCategory}</span>
          </button>
        </div>

        {/* Factors List under Selected Category */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {getFactorsByCategory(selectedCategory).length === 0 ? (
            <div className="col-span-2 py-8 text-center text-slate-500 text-xs">
              No causal factors recorded under {selectedCategory}. Click "Add Factor" to evaluate this branch.
            </div>
          ) : (
            getFactorsByCategory(selectedCategory).map(f => (
              <div 
                key={f.id}
                className={`p-4 rounded-lg border text-xs space-y-2.5 transition-colors ${
                  f.isRootCause
                    ? 'bg-rose-950/20 border-rose-500/50'
                    : f.verified
                    ? 'bg-slate-950/80 border-slate-800'
                    : 'bg-slate-950/40 border-slate-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-slate-200 flex-1">
                    {f.factor}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      f.likelihood === 'HIGH' ? 'bg-rose-950/40 text-rose-300 border border-rose-800/40' :
                      f.likelihood === 'MEDIUM' ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {f.likelihood} RISK
                    </span>
                    <button
                      onClick={() => handleDeleteFactor(f.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {f.notes && (
                  <p className="text-slate-400 text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800/60">
                    {f.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => handleToggleVerify(f.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${f.verified ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>{f.verified ? 'Verified with Evidence' : 'Unverified Hypothesis'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleRootCause(f.id)}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                      f.isRootCause
                        ? 'bg-rose-500 text-white'
                        : 'text-slate-400 hover:text-rose-300'
                    }`}
                  >
                    {f.isRootCause ? '★ Confirmed Root Cause' : 'Designate as Root Cause'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Factor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-semibold text-white">Add Ishikawa Causal Factor</h3>
            <form onSubmit={handleAddFactor} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">6M Category</label>
                <select
                  value={newFactorCategory}
                  onChange={e => setNewFactorCategory(e.target.value as SixMCategory)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                >
                  {SIX_M_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Hypothesized Failure Factor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCV-104A pneumatic bypass valve stem mechanical seizure"
                  value={newFactorText}
                  onChange={e => setNewFactorText(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Likelihood / Plausibility</label>
                <select
                  value={newFactorLikelihood}
                  onChange={e => setNewFactorLikelihood(e.target.value as any)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                >
                  <option value="HIGH">HIGH (Strong correlation with event)</option>
                  <option value="MEDIUM">MEDIUM (Plausible contributing factor)</option>
                  <option value="LOW">LOW (Unlikely secondary consideration)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Verification Strategy / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Describe inspection or analytical test used to verify or refute this factor"
                  value={newFactorNotes}
                  onChange={e => setNewFactorNotes(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded"
                >
                  Add Factor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
