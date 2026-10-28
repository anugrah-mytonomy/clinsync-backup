export type DashboardRiskLevel = 'high' | 'medium' | 'low';

export interface BacklogTile {
  level: DashboardRiskLevel;
  label: string;
  count: number;
  caption?: string;
}
