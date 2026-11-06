import React, { useState } from 'react';
import { ingestIncident, requestAiRcaAnalysis } from '../services/apiClient.ts';
import { AiAnalysisResult } from '../server/aiRcaEngine.ts';
import { 
  Investigation, 
  SeverityLevel 
} from '../types/investigation.ts';
import { 
  Plus, 
  X, 
  FlaskConical, 
  AlertTriangle,
  Building,
  User
} from 'lucide-react';

interface NewInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newInv: Investigation) => void;
}

export const NewInvestigationModal: React.FC<NewInvestigationModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [apiProduct, setApiProduct] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [manufacturingStage, setManufacturingStage] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [facility, setFacility] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('CRITICAL');
  const [investigatorLead, setInvestigatorLead] = useState('Quality Investigator');
  const [eventDescription, setEventDescription] = useState('');
  const [immediateContainment, setImmediateContainment] = useState('');
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [extractedDraft, setExtractedDraft] = useState<Investigation | null>(null);
  const [analysisPreview, setAnalysisPreview] = useState<AiAnalysisResult | null>(null);
  const [rootCauseDraft, setRootCauseDraft] = useState('');
  const [extractionNotice, setExtractionNotice] = useState('');

  if (!isOpen) return null;

  const handleGenerateAnalysis = async () => {
    if (!sourceFile && !eventDescription.trim()) return;
    setIsImporting(true);
    setExtractionNotice('');
    try {
      const draft = await ingestIncident(sourceFile || undefined, sourceFile ? undefined : eventDescription);
      const analysis = await requestAiRcaAnalysis(draft);
      const fields = analysis.extractedFields || {};
      const merged = { ...draft, ...fields } as Investigation;
      setExtractedDraft(merged);
      setAnalysisPreview(analysis);
      setRootCauseDraft(analysis.rootCauseCandidate);
      setTitle(merged.title || ''); setApiProduct(merged.apiProduct || ''); setBatchNumber(merged.batchNumber || '');
      setManufacturingStage(merged.manufacturingStage || ''); setEquipmentId(merged.equipmentId || ''); setFacility(merged.facility || '');
      setEventDescription(merged.eventDescription || ''); setImmediateContainment(merged.immediateContainment || '');
      setSeverity(merged.severity || 'MAJOR');
      setExtractionNotice(`${analysis.source === 'GROQ_LANGGRAPH' ? 'Groq + LangGraph' : 'Local demo'} extraction is ready. Review and edit every field before saving.`);
    } catch (error) {
      setExtractionNotice(`Could not process this source. Check that FastAPI is running. ${error instanceof Error ? error.message : ''}`);
    } finally { setIsImporting(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedDraft) { setExtractionNotice('Select a source or enter the incident narrative, then click Generate analysis before saving.'); return; }
    if (!title.trim() || !eventDescription.trim()) return;

    const id = `DEV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newInv: Investigation = {
      id,
      title: title.trim() || `Incident from ${sourceFile?.name || 'source record'}`,
      apiProduct,
      batchNumber,
      manufacturingStage,
      equipmentId,
      facility,
      incidentDate: now,
      detectionDate: now,
      targetClosureDate: new Date(Date.now() + 21 * 86400000).toISOString(),
      severity,
      status: 'UNDER_INVESTIGATION',
      investigatorLead,
      qaApprover: 'Marcus Vance (Director of Quality Assurance)',
      eventDescription: eventDescription.trim(),
      immediateContainment: immediateContainment.trim(),
      batchDisposition: 'QUARANTINED',
      telemetryData: [],
      labResults: [],
      fiveWhys: [],
      fishboneFactors: [],
      riskAssessment: {
        severity: severity === 'CRITICAL' ? 8 : severity === 'MAJOR' ? 6 : 3,
        occurrence: 5,
        detection: 4,
        rpn: (severity === 'CRITICAL' ? 8 : severity === 'MAJOR' ? 6 : 3) * 5 * 4,
        riskCategory: severity === 'CRITICAL' ? 'HIGH' : severity === 'MAJOR' ? 'MEDIUM' : 'LOW',
        rationale: 'Preliminary placeholder only. Review and assign risk using verified evidence and site procedure.'
      },
      capas: [],
      historicalMatches: [],
      electronicSignatures: [],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: now,
          operator: investigatorLead,
          action: 'Deviation Opened',
          category: 'RECORD_EDIT',
          details: `Draft deviation ${id} created. Source evidence and extracted values require review.`,
          hash: ''
        }
      ],
      rootCauseSummary: 'Cause not established. Review and link supporting evidence before recording causal conclusions.',
      createdAt: now,
      updatedAt: now
    };

    try {
      onCreate({ ...extractedDraft, ...newInv, id: extractedDraft.id, title: title.trim(), apiProduct, batchNumber, manufacturingStage, equipmentId, facility, incidentDate: extractedDraft.incidentDate, detectionDate: extractedDraft.detectionDate, targetClosureDate: extractedDraft.targetClosureDate, qaApprover: extractedDraft.qaApprover, batchDisposition: extractedDraft.batchDisposition, eventDescription: eventDescription.trim(), immediateContainment: immediateContainment.trim(), investigatorLead, telemetryData: extractedDraft.telemetryData, labResults: extractedDraft.labResults, fiveWhys: (analysisPreview?.suggestedFiveWhys || extractedDraft.fiveWhys).map(item => ({ ...item, status: 'HYPOTHESIS', isRootCause: false })), fishboneFactors: (analysisPreview?.suggestedFishbone || extractedDraft.fishboneFactors).map(item => ({ ...item, verified: false, isRootCause: false })), capas: analysisPreview?.suggestedCapas || extractedDraft.capas, riskAssessment: analysisPreview?.suggestedRisk || extractedDraft.riskAssessment, historicalMatches: extractedDraft.historicalMatches, evidenceGaps: extractedDraft.evidenceGaps, source: extractedDraft.source, auditLogs: [...(extractedDraft.auditLogs || []), ...newInv.auditLogs], status: 'DRAFT', rootCauseSummary: rootCauseDraft || 'Cause not established. Verify source records and review AI-generated suggestions before any conclusion.' });
      onClose();
    } catch (error) {
      alert(`Could not import the source. Check that FastAPI is running. ${error instanceof Error ? error.message : ''}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-2xl w-full my-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Log API Manufacturing Quality Event</h2>
              <p className="text-xs text-slate-400">Initiate formal Root Cause Analysis (RCA) dossier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Deviation Title / Problem Statement *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. OOS Related Impurity Spike during Anti-Solvent Crystallization"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-medium block mb-1">API Drug Substance</label>
              <input
                type="text"
                required
                value={apiProduct}
                onChange={e => setApiProduct(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">Batch Lot Number</label>
              <input
                type="text"
                required
                value={batchNumber}
                onChange={e => setBatchNumber(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-teal-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Manufacturing Stage</label>
              <input
                type="text"
                required
                value={manufacturingStage}
                onChange={e => setManufacturingStage(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">Equipment Unit & ID</label>
              <input
                type="text"
                required
                value={equipmentId}
                onChange={e => setEquipmentId(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Facility / Cleanroom Suite</label>
              <input
                type="text"
                required
                value={facility}
                onChange={e => setFacility(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">Quality Severity Tier</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as SeverityLevel)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100 font-semibold"
              >
                <option value="CRITICAL">CRITICAL (Impacts Batch Release / Patient Safety)</option>
                <option value="MAJOR">MAJOR (Process Parameter Excursion / Yield Drop)</option>
                <option value="MINOR">MINOR (Procedural Variance / No Product Impact)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Event Description & Symptoms *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe what occurred, how it was observed, parameter values, and timeframes..."
              value={eventDescription}
              onChange={e => setEventDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Incident source file (PDF, text, or email .eml)</label>
            <input type="file" accept=".pdf,.txt,.eml,text/plain,message/rfc822,application/pdf" onChange={e => setSourceFile(e.target.files?.[0] || null)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-300" />
            <p className="text-[11px] text-slate-500 mt-1">Extracted text is a draft. Verify each field against the original record.</p>
          </div>

          <div className="p-3 border border-teal-900/70 bg-teal-950/30 rounded space-y-2">
            <p className="text-[11px] text-slate-300">Clicking Generate analysis sends this case text and fields to Groq when a key is configured. Without a key, local demo extraction runs. Review and edit the fields before saving.</p>
            <button type="button" onClick={handleGenerateAnalysis} disabled={isImporting || (!sourceFile && !eventDescription.trim())} className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded disabled:opacity-50">
              {isImporting ? 'Generating analysis…' : 'Generate analysis'}
            </button>
            {extractionNotice && <p role="status" className="text-[11px] text-teal-200">{extractionNotice}</p>}
          </div>

          {analysisPreview && <section className="p-3 border border-amber-800/70 bg-amber-950/20 rounded space-y-2">
            <h3 className="text-xs font-semibold text-amber-200">Review AI suggestions before saving</h3>
            <p className="text-[11px] text-slate-400">{analysisPreview.disclaimer}</p>
            <label className="text-[11px] text-slate-300 block">Potential cause · unconfirmed</label>
            <textarea rows={2} value={rootCauseDraft} onChange={e => setRootCauseDraft(e.target.value)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100" />
            <div className="max-h-56 overflow-y-auto space-y-2">
              {analysisPreview.suggestedFiveWhys.map((why, index) => <div key={why.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 bg-slate-950/70 rounded">
                <input aria-label={`Why ${index + 1} question`} value={why.question} onChange={e => setAnalysisPreview({ ...analysisPreview, suggestedFiveWhys: analysisPreview.suggestedFiveWhys.map((item, i) => i === index ? { ...item, question: e.target.value } : item) })} className="p-2 bg-slate-950 border border-slate-800 rounded text-slate-100" />
                <textarea aria-label={`Why ${index + 1} answer`} rows={2} value={why.answer} onChange={e => setAnalysisPreview({ ...analysisPreview, suggestedFiveWhys: analysisPreview.suggestedFiveWhys.map((item, i) => i === index ? { ...item, answer: e.target.value } : item) })} className="p-2 bg-slate-950 border border-slate-800 rounded text-slate-100" />
              </div>)}
              {analysisPreview.suggestedFishbone.map((factor, index) => <div key={factor.id} className="flex items-center gap-2 text-[11px] text-slate-300"><span className="w-24 shrink-0">{factor.category} · unconfirmed</span><input aria-label={`${factor.category} hypothesis`} value={factor.factor} onChange={e => setAnalysisPreview({ ...analysisPreview, suggestedFishbone: analysisPreview.suggestedFishbone.map((item, i) => i === index ? { ...item, factor: e.target.value } : item) })} className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded text-slate-100" /></div>)}
              {analysisPreview.suggestedCapas.map((capa, index) => <div key={capa.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 border border-slate-800 rounded"><input aria-label="CAPA recommendation title" value={capa.title} onChange={e => setAnalysisPreview({ ...analysisPreview, suggestedCapas: analysisPreview.suggestedCapas.map((item, i) => i === index ? { ...item, title: e.target.value } : item) })} className="p-2 bg-slate-950 border border-slate-800 rounded text-slate-100" /><textarea aria-label="CAPA recommendation description" rows={2} value={capa.description} onChange={e => setAnalysisPreview({ ...analysisPreview, suggestedCapas: analysisPreview.suggestedCapas.map((item, i) => i === index ? { ...item, description: e.target.value } : item) })} className="p-2 bg-slate-950 border border-slate-800 rounded text-slate-100" /></div>)}
            </div>
          </section>}

          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Immediate Physical & Electronic Containment Actions
            </label>
            <textarea
              rows={2}
              value={immediateContainment}
              onChange={e => setImmediateContainment(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Lead Investigator</label>
            <input
              type="text"
              required
              value={investigatorLead}
              onChange={e => setInvestigatorLead(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded shadow transition-colors"
            >
              Save reviewed investigation draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
