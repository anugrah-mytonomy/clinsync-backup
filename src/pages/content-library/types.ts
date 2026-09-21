export type LibraryRiskLevel = 'high' | 'medium' | 'low';

export interface LibraryDocument {
  id: string;
  title: string;
  specialties: string[];
  documentType: string;
  version: string;
  addedAt: string;
  lastScannedAt: string | null;
  highestRisk: LibraryRiskLevel | null;
  findings: number | null;
}
