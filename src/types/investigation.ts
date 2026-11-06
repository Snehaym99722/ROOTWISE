export type SeverityLevel = 'CRITICAL' | 'MAJOR' | 'MINOR';

export type InvestigationStatus = 
  | 'DRAFT'
  | 'UNDER_INVESTIGATION'
  | 'CAPA_PENDING'
  | 'QA_REVIEW'
  | 'CLOSED';

export type HypothesisStatus = 'VERIFIED' | 'REFUTED' | 'HYPOTHESIS' | 'INCONCLUSIVE';

export type SixMCategory = 
  | 'Machine'
  | 'Method'
  | 'Material'
  | 'Man'
  | 'Measurement'
  | 'Milieu';

export interface TelemetryPoint {
  time: string;
  jacketTemp: number; // °C
  slurryTemp: number; // °C
  targetTemp: number; // °C
  agitatorRpm: number; // RPM
  pressure: number; // bar
  pH?: number;
  isExcursion?: boolean;
}

export interface LabResult {
  id: string;
  testName: string;
  parameter: string;
  result: string;
  specification: string;
  unit: string;
  status: 'PASS' | 'OOS' | 'OOT';
  instrumentId: string;
  analyst: string;
}

export interface FiveWhyNode {
  id: string;
  level: number;
  question: string;
  answer: string;
  evidence: string;
  status: HypothesisStatus;
  isRootCause: boolean;
  contributingCategory?: SixMCategory;
}

export interface FishboneFactor {
  id: string;
  category: SixMCategory;
  factor: string;
  likelihood: 'HIGH' | 'MEDIUM' | 'LOW';
  verified: boolean;
  notes: string;
  isRootCause?: boolean;
}

export interface RiskAssessment {
  severity: number; // 1-10 (ICH Q9)
  occurrence: number; // 1-10
  detection: number; // 1-10
  rpn: number; // Severity * Occurrence * Detection (1-1000)
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  rationale: string;
}

export interface CapaItem {
  id: string;
  type: 'CORRECTIVE' | 'PREVENTIVE';
  title: string;
  description: string;
  owner: string;
  department: string;
  dueDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
  verificationMethod: string;
  verificationEvidence?: string;
}

export interface HistoricalMatch {
  id: string;
  batchNumber: string;
  deviationId: string;
  date: string;
  product: string;
  failureMode: string;
  rootCause: string;
  similarityScore: number; // 0-100%
  capaEffective: boolean;
  learnings: string;
}

export interface EvidenceRecord {
  id: string;
  documentId?: string;
  name: string;
  type: string;
  status: string;
  finding: string;
  sha256?: string;
  pageCount?: number;
  ocrUsed?: boolean;
  sizeBytes?: number;
  downloadUrl?: string;
}

export interface ElectronicSignature {
  id: string;
  signerName: string;
  signerEmail: string;
  role: 'Lead Investigator' | 'QA Technical Reviewer' | 'Qualified Person (QP)' | 'Operations Head';
  timestamp: string;
  reason: string;
  sha256Checksum: string;
  isVerified: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  category: 'RECORD_EDIT' | 'STATUS_CHANGE' | 'AI_ANALYSIS' | 'SIGNATURE' | 'CAPA_UPDATE';
  details: string;
  hash: string;
  previousHash?: string;
}

export interface Investigation {
  id: string; // e.g. DEV-2026-0842
  title: string;
  apiProduct: string;
  batchNumber: string;
  manufacturingStage: string;
  equipmentId: string;
  facility: string;
  incidentDate: string;
  detectionDate: string;
  targetClosureDate: string;
  severity: SeverityLevel;
  status: InvestigationStatus;
  investigatorLead: string;
  qaApprover: string;
  
  eventDescription: string;
  immediateContainment: string;
  batchDisposition: 'QUARANTINED' | 'UNDER_EVALUATION' | 'REJECTED' | 'REPROCESSED' | 'RELEASED';
  
  telemetryData: TelemetryPoint[];
  labResults: LabResult[];
  fiveWhys: FiveWhyNode[];
  fishboneFactors: FishboneFactor[];
  riskAssessment: RiskAssessment;
  capas: CapaItem[];
  historicalMatches: HistoricalMatch[];
  electronicSignatures: ElectronicSignature[];
  auditLogs: AuditLogEntry[];
  
  rootCauseSummary: string;
  aiSuggestedSummary?: string;
  isAiAssisted?: boolean;
  
  createdAt: string;
  updatedAt: string;
  source?: string;
  extractionMode?: string;
  sourceDocumentId?: string;
  sourceSha256?: string;
  reviewDecision?: string;
  evidenceGaps?: string[];
  evidenceRecords?: EvidenceRecord[];
  demoMode?: boolean;
  demoNotice?: string;
  archived?: boolean;
}
