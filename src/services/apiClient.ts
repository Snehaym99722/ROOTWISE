import { Investigation, ElectronicSignature, AuditLogEntry } from '../types/investigation.ts';
import { INITIAL_INVESTIGATIONS } from '../data/mockInvestigations.ts';
import { AiAnalysisResult, runPharmaceuticalHeuristicRCA } from '../server/aiRcaEngine.ts';

const STORAGE_KEY = 'rootwise_investigations_v2';
let apiOnline = false;
export const isApiOnline = () => apiOnline;

const DEMO_NOTICE = 'FICTIONAL DEMO DATA: values, people, source records, historical matches, and actions are invented to illustrate this workflow. Not manufacturing evidence, not a GMP record, and not suitable for batch or patient decisions.';
function safeguardDemoCase(item: Investigation): Investigation {
  if (item.id !== 'DEV-2026-0842') return item;
  if (item.demoMode && item.source === 'Fictional AI Studio-inspired demo dossier · all records and metrics synthetic') return item;
  return {
    ...item,
    title: item.title.startsWith('DEMO ·') ? item.title : `DEMO · ${item.title}`,
    demoMode: true,
    demoNotice: DEMO_NOTICE,
    source: 'Fictional AI Studio-inspired demo dossier · all records and metrics synthetic',
    extractionMode: 'Synthetic seeded demonstration',
    fiveWhys: (item.fiveWhys || []).map((why, index) => ({
      ...why,
      answer: `Unconfirmed hypothesis only: ${why.answer}`,
      evidence: `DEMO-SRC-${String(index + 1).padStart(2, '0')} · Synthetic reference only; verify the corresponding controlled source record before relying on this statement. ${why.evidence}`,
      status: 'HYPOTHESIS',
      isRootCause: false,
    })),
    fishboneFactors: (item.fishboneFactors || []).map(factor => ({
      ...factor,
      verified: false,
      isRootCause: false,
      notes: `Synthetic investigation lead only; no evidence independently verified. ${factor.notes}`,
    })),
    riskAssessment: {
      ...item.riskAssessment,
      rationale: 'Illustrative screening score only. Not a site-approved ICH Q9 assessment; QA must reassess using actual product, patient, process, and control evidence.',
    },
    capas: (item.capas || []).map(capa => ({
      ...capa,
      status: 'OPEN',
      description: `Illustrative draft only. ${capa.description}`,
      verificationMethod: `Pending approved site criteria. ${capa.verificationMethod}`,
    })),
    historicalMatches: (item.historicalMatches || []).map(match => ({
      ...match,
      rootCause: `Synthetic prior-record example: ${match.rootCause}`,
      learnings: `Synthetic precedent only; it does not establish the current event's cause. ${match.learnings}`,
    })),
    electronicSignatures: [],
    auditLogs: [
      { id: 'DEMO-LOG-01', timestamp: '2026-11-04T18:50:00Z', operator: 'QC Analyst (demo)', action: 'Illustrative OOS alert logged', category: 'STATUS_CHANGE', details: 'Synthetic example only: illustrative Impurity D result entered for the demo dossier.', hash: '' },
      { id: 'DEMO-LOG-02', timestamp: '2026-11-04T19:15:22Z', operator: 'QA Investigator (demo)', action: 'Demo investigation opened and hold recorded', category: 'RECORD_EDIT', details: 'Fictional workflow event; no real batch, hold, or QA decision exists.', hash: '' },
      { id: 'DEMO-LOG-03', timestamp: '2026-11-05T10:20:00Z', operator: 'Maintenance Lead (demo)', action: 'Synthetic equipment evidence reference added', category: 'RECORD_EDIT', details: 'DEMO-SRC-04 is an invented reference; no original teardown report is attached.', hash: '' },
    ],
    rootCauseSummary: 'Cause not established. The illustrative thermal excursion, control-loop response, maintenance practices, measurement integrity, and impurity result remain hypotheses pending actual source records and qualified human review.',
    aiSuggestedSummary: 'DEMO DRAFT ONLY: the illustrative record depicts an OOS impurity result alongside a crystallization temperature excursion. It does not establish that one caused the other.',
    isAiAssisted: false,
    evidenceRecords: [
      { id: 'DEMO-SRC-01', name: 'QC HPLC chromatogram and reference-standard comparison', type: 'Laboratory record (synthetic)', status: 'DEMO AVAILABLE', finding: 'Illustrative impurity peak only; obtain and review actual raw data and identification.' },
      { id: 'DEMO-SRC-02', name: 'SCADA historian export: TIC-104-PV and recipe setpoint', type: 'Process record (synthetic)', status: 'DEMO AVAILABLE', finding: 'Illustrative 38-minute excursion; verify original export, tag metadata, time synchronization, and recipe.' },
      { id: 'DEMO-SRC-03', name: 'DCS command / valve-position trend: TCV-104A and ZS-104', type: 'Equipment record (synthetic)', status: 'DEMO AVAILABLE', finding: 'Illustrative command / feedback mismatch; inspect actual historian and alarm records.' },
      { id: 'DEMO-SRC-04', name: 'Maintenance teardown report MTR-2026-88', type: 'Maintenance record (synthetic)', status: 'DEMO AVAILABLE', finding: 'Illustrative inspection note; obtain the controlled original and component disposition.' },
      { id: 'DEMO-SRC-05', name: 'CMMS WO-89110 and air-header filter F-201 inspection', type: 'Maintenance record (synthetic)', status: 'DEMO AVAILABLE', finding: 'Illustrative PM / filter references; verify actual work-order and inspection history.' },
    ],
    evidenceGaps: [
      'Replace DEMO-SRC-01 with controlled HPLC raw data, review, and reference-standard identification records.',
      'Verify DEMO-SRC-02 against the original SCADA export, tag metadata, time synchronization, and approved recipe.',
      'Obtain actual DCS command / feedback and alarm history for TCV-104A and ZS-104.',
      'Obtain actual maintenance inspection, PM deferral approval, instrument-air filter, and calibration records.',
      'Complete QA product-impact assessment, related-batch scope, and disposition using approved site procedures.',
    ],
  };
}
function safeguardDemoCases(items: Investigation[]): Investigation[] {
  return items.map(safeguardDemoCase);
}

function localList(): Investigation[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const normalized = safeguardDemoCases(JSON.parse(saved) as Investigation[]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }
    const initial = safeguardDemoCases(INITIAL_INVESTIGATIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch { /* browser storage may be disabled */ }
  return safeguardDemoCases(INITIAL_INVESTIGATIONS);
}
function saveLocal(list: Investigation[]) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* API persistence remains available */ } }
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...init?.headers } });
  if (!response.ok) throw new Error(`API ${response.status}: ${await response.text()}`);
  apiOnline = true; return response.json() as Promise<T>;
}
export async function fetchInvestigations(): Promise<Investigation[]> {
  try { const records = await api<Investigation[]>('/api/investigations'); const visible = records.filter(item => !item.archived); saveLocal(visible); return visible; }
  catch (error) { apiOnline = false; console.warn('FastAPI unavailable; opening the local demo workspace.', error); return localList(); }
}
export async function fetchInvestigationById(id: string): Promise<Investigation | null> {
  try { return await api<Investigation>(`/api/investigations/${encodeURIComponent(id)}`); } catch { return localList().find(item => item.id === id) ?? null; }
}
export async function persistInvestigation(inv: Investigation): Promise<Investigation> {
  const local = localList(), existing = local.some(item => item.id === inv.id), updated = { ...inv, updatedAt: new Date().toISOString() };
  saveLocal(existing ? local.map(item => item.id === inv.id ? updated : item) : [updated, ...local]);
  try { return await api<Investigation>(existing ? `/api/investigations/${encodeURIComponent(inv.id)}` : '/api/investigations', { method: existing ? 'PUT' : 'POST', body: JSON.stringify(updated) }); }
  catch (error) { apiOnline = false; console.warn('Saved to local demo storage because FastAPI is unavailable.', error); return updated; }
}
export async function ingestIncident(file?: File, text?: string): Promise<Investigation> {
  const form = new FormData(); if (file) form.append('file', file); if (text) form.append('text', text); return api<Investigation>('/api/ingest', { method: 'POST', body: form });
}
export async function archiveInvestigation(id: string): Promise<void> {
  await api(`/api/investigations/${encodeURIComponent(id)}`, { method: 'DELETE' }); saveLocal(localList().filter(item => item.id !== id));
}
export async function submitElectronicSignature(investigationId: string, signerName: string, signerEmail: string, role: 'Lead Investigator' | 'QA Technical Reviewer' | 'Qualified Person (QP)' | 'Operations Head', reason: string): Promise<Investigation | null> {
  try { return await api<Investigation>(`/api/investigations/${encodeURIComponent(investigationId)}/sign`, { method: 'POST', body: JSON.stringify({ signerName, signerEmail, role, reason }) }); } catch { return null; }
}
export async function authenticateAndApprove(investigationId: string, email: string, password: string, reason: string): Promise<Investigation> {
  const session = await api<{ access_token: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  return api<Investigation>(`/api/investigations/${encodeURIComponent(investigationId)}/approve`, {
    method: 'POST', body: JSON.stringify({ reason }), headers: { Authorization: `Bearer ${session.access_token}` },
  });
}
export interface AuditIntegrityResult { valid: boolean; hashedEntries: number; legacyUnhashedEntries: number; scope: string }
export async function verifyAuditIntegrity(investigationId: string): Promise<AuditIntegrityResult> {
  return api<AuditIntegrityResult>(`/api/investigations/${encodeURIComponent(investigationId)}/audit-integrity`);
}
export async function requestAiRcaAnalysis(inv: Partial<Investigation>): Promise<AiAnalysisResult> {
  try { return await api<AiAnalysisResult>('/api/ai/analyze', { method: 'POST', body: JSON.stringify(inv) }); }
  catch (error) { apiOnline = false; console.warn('FastAPI analysis unavailable; using local demo guidance.', error); return runPharmaceuticalHeuristicRCA(inv); }
}
