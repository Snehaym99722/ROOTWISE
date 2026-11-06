import { Investigation, FiveWhyNode, FishboneFactor, CapaItem, RiskAssessment } from '../types/investigation.ts';

export interface AiAnalysisResult { source: 'GROQ_LANGGRAPH' | 'LOCAL_DEMO_RULES' | 'LOCAL_FALLBACK'; disclaimer: string; summary: string; rootCauseCandidate: string; extractedFields: Partial<Investigation>; suggestedFiveWhys: FiveWhyNode[]; suggestedFishbone: FishboneFactor[]; suggestedRisk: RiskAssessment; suggestedCapas: CapaItem[]; }

// Deterministic, keyless demonstration. Never marks a hypothesis as verified.
export function runPharmaceuticalHeuristicRCA(inv: Partial<Investigation>): AiAnalysisResult {
  const description = inv.eventDescription || 'Incident details have not yet been provided.';
  const cause = 'Cause not established. Review the source record and supporting evidence before drawing conclusions.';
  const pairs = [
    ['Why was the quality event opened?', 'A deviation was reported and requires documented investigation.'],
    ['Why did the observed result differ from expectation?', 'The narrative identifies an event; its mechanism remains to be verified.'],
    ['Why might the process have behaved this way?', 'Equipment, method, material, personnel, measurement, and environment remain lines of inquiry.'],
    ['Why is a causal link not established yet?', 'Relevant batch, historian, laboratory, and equipment records need review.'],
    ['What is the confirmed root cause?', cause],
  ];
  const suggestedFiveWhys: FiveWhyNode[] = pairs.map(([question, answer], index) => ({ id: `LOCAL-W${index + 1}`, level: index + 1, question, answer, evidence: 'Source record review pending.', status: 'HYPOTHESIS', isRootCause: false }));
  const categories: FishboneFactor['category'][] = ['Machine', 'Method', 'Material', 'Man', 'Measurement', 'Milieu'];
  const suggestedFishbone: FishboneFactor[] = categories.map((category, index) => ({ id: `LOCAL-F${index + 1}`, category, factor: `Review ${category.toLowerCase()} records and determine whether they are relevant to this event.`, likelihood: 'MEDIUM', verified: false, notes: 'Investigation prompt only; evidence and investigator review required.' }));
  const suggestedRisk: RiskAssessment = { severity: 5, occurrence: 3, detection: 4, rpn: 60, riskCategory: 'MEDIUM', rationale: 'Illustrative screening only; assign and approve risk using site procedures and verified evidence.' };
  const suggestedCapas: CapaItem[] = [{ id: `LOCAL-CAPA-${Date.now()}`, type: 'CORRECTIVE', title: 'Complete evidence review and document impact assessment', description: 'Investigate source records and document the Quality Unit assessment before disposition.', owner: 'Quality Assurance', department: 'Quality', dueDate: '', status: 'OPEN', verificationMethod: 'QA review of the completed evidence record and approved acceptance criteria.' }];
  return { source: 'LOCAL_DEMO_RULES', disclaimer: 'Local demo guidance; all causal statements are unconfirmed hypotheses. Verify source records and obtain qualified human review. Not disposition advice.', summary: description, rootCauseCandidate: cause, extractedFields: Object.fromEntries(['title','apiProduct','batchNumber','manufacturingStage','equipmentId','facility','incidentDate','severity','eventDescription','immediateContainment'].map(key => [key, inv[key as keyof Investigation]]).filter(([, value]) => value !== undefined)) as Partial<Investigation>, suggestedFiveWhys, suggestedFishbone, suggestedRisk, suggestedCapas };
}
