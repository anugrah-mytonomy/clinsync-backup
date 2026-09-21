export type DashboardRiskLevel = 'high' | 'medium' | 'low';

export interface BacklogTile {
  level: DashboardRiskLevel;
  label: string;
  count: number;
}

export interface YearRow {
  year: string;
  count: number;
}

export interface SpecialtyTag {
  label: string;
  count: number;
  flagged?: boolean;
}

export interface DocumentTypeRow {
  label: string;
  count: number;
}

export interface TrendPoint {
  date: string;
  high: number;
  medium: number;
  low: number;
}

export interface TooltipPayloadItem {
  dataKey: DashboardRiskLevel;
  value: number;
}
