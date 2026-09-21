export type RiskLevel = 'high' | 'medium' | 'low';

export type FindingRisk = RiskLevel | 'clear';

export type ScanTrigger = 'manual-selected' | 'scheduled-full-library';

export type ScanStatus = 'in-progress' | 'success' | 'expired';

export type WorkbookState = 'generating' | 'available' | 'expired';

export interface ScanDocument {
  id: string;
  title: string;
  specialties: string[];
  documentType: string;
  version: string;
  sourceFile: string;
  addedAt: string;
}

export interface Finding {
  id: string;
  scanId: string;
  documentId: string;
  risk: FindingRisk;
  category: string;
  flaggedText: string;
  suggestedChange: string;
}

export interface FindingsBreakdown {
  high: number;
  medium: number;
  low: number;
}

export interface ScanWorkbook {
  state: WorkbookState;
  downloadUrl?: string;
}

export interface ScanRun {
  id: string;
  dateTime: string;
  trigger: ScanTrigger;
  triggerLabel: string;
  documentIds: string[];
  scannedCount: number;
  status: ScanStatus;
  runBy: string;
  findingsCount: number | null;
  findingsBreakdown: FindingsBreakdown | null;
  mandatoryClinicalReview: number | null;
  scanWarnings: number | null;
  workbook: ScanWorkbook;
}

export interface FindingRow extends Finding {
  documentTitle: string;
}

export interface DocumentScanHistoryEntry {
  scanId: string;
  dateTime: string;
  triggerLabel: string;
  findingsCount: number;
  highestRisk: RiskLevel | null;
}

export type RiskBadgeVariant = 'badge' | 'text';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}
