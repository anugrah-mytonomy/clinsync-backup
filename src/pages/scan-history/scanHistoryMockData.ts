import type { Finding, RiskLevel, ScanDocument, ScanRun } from '@/types/scanHistory';

export const scanDocuments: ScanDocument[] = [
  {
    id: 'doc-1',
    title: 'Whipple Procedure',
    specialties: ['Oncology', 'Gastroenterology'],
    documentType: 'Patient Education Text',
    version: 'v1',
    sourceFile: 'Whipple_Procedure.docx',
    addedAt: 'Aug 1, 2026, 9:00 AM UTC',
  },
  {
    id: 'doc-2',
    title: 'Human Bite Care',
    specialties: ['Emergency Medicine'],
    documentType: 'Patient Education Text',
    version: 'v1',
    sourceFile: 'Human_Bite_Care.docx',
    addedAt: 'Aug 1, 2026, 9:00 AM UTC',
  },
  {
    id: 'doc-3',
    title: 'Post-Op Wound Care Guide',
    specialties: ['General Surgery'],
    documentType: 'Patient Education Text',
    version: 'v1',
    sourceFile: 'Post-Op_Wound_Care_Guide.docx',
    addedAt: 'Aug 1, 2026, 9:00 AM UTC',
  },
  {
    id: 'doc-4',
    title: 'Cardiac Rehab Protocol',
    specialties: ['Cardiology'],
    documentType: 'Patient Education Text',
    version: 'v1',
    sourceFile: 'Cardiac_Rehab_Protocol.docx',
    addedAt: 'Aug 1, 2026, 9:00 AM UTC',
  },
  {
    id: 'doc-5',
    title: 'Circumcision Care Guide',
    specialties: ['Pediatrics', 'Urology'],
    documentType: 'Patient Education Text',
    version: 'v1',
    sourceFile: 'Circumcision_Care_Guide.docx',
    addedAt: 'Aug 1, 2026, 9:00 AM UTC',
  },
  {
    id: 'doc-6',
    title: 'Asthma Action Plan',
    specialties: ['Pulmonology', 'Pediatrics'],
    documentType: 'Patient Education Text',
    version: 'v1',
    sourceFile: 'Asthma_Action_Plan.docx',
    addedAt: 'Aug 1, 2026, 9:00 AM UTC',
  },
  {
    id: 'doc-7',
    title: 'Famotidine Patient Handout',
    specialties: ['Gastroenterology'],
    documentType: 'Medication Guide',
    version: 'v1',
    sourceFile: 'Famotidine_Patient_Handout.docx',
    addedAt: 'Jul 20, 2026, 9:00 AM UTC',
  },
  {
    id: 'doc-8',
    title: 'Pterygium Care Guide',
    specialties: ['Ophthalmology'],
    documentType: 'Patient Education Text',
    version: 'v1',
    sourceFile: 'Pterygium_Care_Guide.docx',
    addedAt: 'Jul 20, 2026, 9:00 AM UTC',
  },
];

export const scanRuns: ScanRun[] = [
  {
    id: 'SR-001',
    dateTime: 'Aug 20, 2026, 10:30 AM UTC',
    trigger: 'manual-selected',
    triggerLabel: 'Manual — selected documents',
    documentIds: ['doc-7', 'doc-8'],
    scannedCount: 2,
    status: 'expired',
    runBy: 'John Doe',
    findingsCount: 3,
    findingsBreakdown: { high: 0, medium: 1, low: 2 },
    mandatoryClinicalReview: 0,
    scanWarnings: 0,
    workbook: { state: 'expired' },
  },
  {
    id: 'SR-002',
    dateTime: 'Aug 29, 2026, 2:15 PM UTC',
    trigger: 'scheduled-full-library',
    triggerLabel: 'Scheduled — full library',
    documentIds: ['doc-3', 'doc-4', 'doc-5'],
    scannedCount: 3,
    status: 'success',
    runBy: 'John Doe',
    findingsCount: 6,
    findingsBreakdown: { high: 0, medium: 3, low: 3 },
    mandatoryClinicalReview: 0,
    scanWarnings: 0,
    workbook: { state: 'available', downloadUrl: '/scans/SR-002/workbook.xlsx' },
  },
  {
    id: 'SR-003',
    dateTime: 'Sep 1, 2026, 9:00 AM UTC',
    trigger: 'manual-selected',
    triggerLabel: 'Manual — selected documents',
    documentIds: ['doc-1', 'doc-2', 'doc-3', 'doc-4', 'doc-5', 'doc-6'],
    scannedCount: 6,
    status: 'success',
    runBy: 'John Doe',
    findingsCount: 9,
    findingsBreakdown: { high: 1, medium: 4, low: 4 },
    mandatoryClinicalReview: 1,
    scanWarnings: 0,
    workbook: { state: 'available', downloadUrl: '/scans/SR-003/workbook.xlsx' },
  },
  {
    id: 'SR-004',
    dateTime: 'Sep 6, 2026, 9:00 AM UTC',
    trigger: 'manual-selected',
    triggerLabel: 'Manual — selected documents',
    documentIds: ['doc-1', 'doc-2', 'doc-3', 'doc-4', 'doc-5'],
    scannedCount: 5,
    status: 'in-progress',
    runBy: 'John Doe',
    findingsCount: null,
    findingsBreakdown: null,
    mandatoryClinicalReview: null,
    scanWarnings: null,
    workbook: { state: 'generating' },
  },
];

export const findings: Finding[] = [
  // SR-001 — Famotidine Patient Handout, Pterygium Care Guide
  {
    id: 'f-001',
    scanId: 'SR-001',
    documentId: 'doc-7',
    risk: 'medium',
    category: 'Dosage Guideline',
    flaggedText: 'Maximum daily dose is stated without adjusting for reduced renal function in older adults.',
    suggestedChange: 'Add a reduced-dose note for patients with renal impairment.',
  },
  {
    id: 'f-002',
    scanId: 'SR-001',
    documentId: 'doc-8',
    risk: 'low',
    category: 'Patient Education',
    flaggedText: 'Post-procedure eye care steps are listed as a single paragraph rather than sequential steps.',
    suggestedChange: 'Reformat aftercare instructions as a numbered list.',
  },
  {
    id: 'f-003',
    scanId: 'SR-001',
    documentId: 'doc-8',
    risk: 'low',
    category: 'Readability',
    flaggedText: 'Clinical term "pterygium" is used throughout without a plain-language explanation.',
    suggestedChange: 'Add a one-line lay definition on first use.',
  },

  // SR-002 — Post-Op Wound Care Guide, Cardiac Rehab Protocol, Circumcision Care Guide
  {
    id: 'f-004',
    scanId: 'SR-002',
    documentId: 'doc-3',
    risk: 'medium',
    category: 'Clinical Clarity',
    flaggedText: 'Instructions on post-op wound dressing changes are vague about frequency.',
    suggestedChange: 'State the exact frequency and duration of dressing changes.',
  },
  {
    id: 'f-005',
    scanId: 'SR-002',
    documentId: 'doc-3',
    risk: 'low',
    category: 'Readability',
    flaggedText: 'Section on activity restrictions runs as one dense paragraph.',
    suggestedChange: 'Break activity restrictions into a bulleted list.',
  },
  {
    id: 'f-006',
    scanId: 'SR-002',
    documentId: 'doc-4',
    risk: 'medium',
    category: 'Clinical Safety',
    flaggedText: 'Antibiotic prophylaxis recommendation is missing for high-risk cardiac patients.',
    suggestedChange: 'Add a recommendation for early prophylactic antibiotics per AHA guidance.',
  },
  {
    id: 'f-007',
    scanId: 'SR-002',
    documentId: 'doc-4',
    risk: 'low',
    category: 'Patient Education',
    flaggedText: 'Target heart rate ranges are given without explaining how to measure pulse.',
    suggestedChange: 'Add a short how-to-measure-pulse callout.',
  },
  {
    id: 'f-008',
    scanId: 'SR-002',
    documentId: 'doc-5',
    risk: 'medium',
    category: 'Medical Accuracy',
    flaggedText: 'Content prioritizes primary closure over timely wound irrigation.',
    suggestedChange: 'Emphasize copious irrigation and delayed primary closure.',
  },
  {
    id: 'f-009',
    scanId: 'SR-002',
    documentId: 'doc-5',
    risk: 'low',
    category: 'Readability',
    flaggedText: 'Aftercare section exceeds an 8th-grade reading level.',
    suggestedChange: 'Simplify vocabulary and shorten sentences in aftercare section.',
  },

  // SR-003 — Whipple Procedure, Human Bite Care, Post-Op Wound Care Guide,
  // Cardiac Rehab Protocol, Circumcision Care Guide, Asthma Action Plan (clear)
  {
    id: 'f-010',
    scanId: 'SR-003',
    documentId: 'doc-1',
    risk: 'high',
    category: 'Clinical Safety',
    flaggedText:
      'Content recommends ibuprofen without age restriction; contraindicated under 6 months per current pediatric dosing guidance.',
    suggestedChange: 'Add age restriction per AAP/FDA guidance.',
  },
  {
    id: 'f-011',
    scanId: 'SR-003',
    documentId: 'doc-1',
    risk: 'low',
    category: 'Patient Education',
    flaggedText: 'Diagram labels use highly technical anatomical terms without layperson definitions.',
    suggestedChange: 'Add a glossary or simplify anatomical labels.',
  },
  {
    id: 'f-012',
    scanId: 'SR-003',
    documentId: 'doc-1',
    risk: 'low',
    category: 'Readability',
    flaggedText: 'Average sentence length exceeds 32 words in the post-operative section.',
    suggestedChange: 'Break down complex sentences into bullet points.',
  },
  {
    id: 'f-013',
    scanId: 'SR-003',
    documentId: 'doc-2',
    risk: 'medium',
    category: 'Dosage Guideline',
    flaggedText: 'Recommended dosage for pediatric oral wound care lacks weight-based limits.',
    suggestedChange: 'Add a weight-based pediatric dosing table.',
  },
  {
    id: 'f-014',
    scanId: 'SR-003',
    documentId: 'doc-2',
    risk: 'medium',
    category: 'Clinical Safety',
    flaggedText: 'Text refers to "amoxicillin" and "penicillin" interchangeably without noting allergy cross-reactivity.',
    suggestedChange: 'Add a cross-reactivity warning for penicillin-class allergies.',
  },
  {
    id: 'f-015',
    scanId: 'SR-003',
    documentId: 'doc-4',
    risk: 'medium',
    category: 'Clinical Safety',
    flaggedText: 'Antibiotic prophylaxis recommendation is still missing for high-risk cardiac patients.',
    suggestedChange: 'Add a recommendation for early prophylactic antibiotics per AHA guidance.',
  },
  {
    id: 'f-016',
    scanId: 'SR-003',
    documentId: 'doc-5',
    risk: 'medium',
    category: 'Medical Accuracy',
    flaggedText: 'Content still prioritizes primary closure over timely wound irrigation.',
    suggestedChange: 'Emphasize copious irrigation and delayed primary closure.',
  },
  {
    id: 'f-017',
    scanId: 'SR-003',
    documentId: 'doc-3',
    risk: 'low',
    category: 'Clinical Clarity',
    flaggedText: 'Instructions on post-op wound dressing changes are vague about frequency.',
    suggestedChange: 'State the exact frequency and duration of dressing changes.',
  },
  {
    id: 'f-018',
    scanId: 'SR-003',
    documentId: 'doc-3',
    risk: 'low',
    category: 'Clinical Safety',
    flaggedText: 'Fails to clearly distinguish normal wound healing from signs of potential infection.',
    suggestedChange: 'Highlight red-flag symptoms requiring immediate clinic contact.',
  },
];

export function getScanById(scanId: string): ScanRun | undefined {
  return scanRuns.find((scan) => scan.id === scanId);
}

export function getDocumentById(documentId: string): ScanDocument | undefined {
  return scanDocuments.find((doc) => doc.id === documentId);
}

export function getFindingsForScan(scanId: string): Finding[] {
  return findings.filter((finding) => finding.scanId === scanId);
}

export function getFindingsForDocumentInScan(scanId: string, documentId: string): Finding[] {
  return findings.filter((finding) => finding.scanId === scanId && finding.documentId === documentId);
}

const RISK_ORDER: Record<RiskLevel, number> = { high: 3, medium: 2, low: 1 };

export function getHighestRisk(documentFindings: Finding[]): RiskLevel | null {
  let highest: RiskLevel | null = null;
  for (const finding of documentFindings) {
    if (finding.risk === 'clear') continue;
    if (!highest || RISK_ORDER[finding.risk] > RISK_ORDER[highest]) {
      highest = finding.risk;
    }
  }
  return highest;
}

export interface DocumentScanHistoryEntry {
  scanId: string;
  dateTime: string;
  triggerLabel: string;
  findingsCount: number;
  highestRisk: RiskLevel | null;
}

export function getScanHistoryForDocument(documentId: string): DocumentScanHistoryEntry[] {
  return scanRuns
    .filter((scan) => scan.status === 'success' && scan.documentIds.includes(documentId))
    .map((scan) => {
      const documentFindings = getFindingsForDocumentInScan(scan.id, documentId);
      return {
        scanId: scan.id,
        dateTime: scan.dateTime,
        triggerLabel: scan.triggerLabel,
        findingsCount: documentFindings.length,
        highestRisk: getHighestRisk(documentFindings),
      };
    })
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .reverse();
}
