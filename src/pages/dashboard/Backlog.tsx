import riskHighIcon from '@/assets/Risk_High.svg';
import riskMediumIcon from '@/assets/Risk_Medium.svg';
import riskLowIcon from '@/assets/Risk_Low.svg';
import type { BacklogTile, DashboardRiskLevel } from '@/pages/dashboard/types';

const riskIcons: Record<DashboardRiskLevel, string> = {
  high: riskHighIcon,
  medium: riskMediumIcon,
  low: riskLowIcon,
};

const tileStyles: Record<
  DashboardRiskLevel,
  { background: string; border: string; color: string }
> = {
  high: { background: '#FEF2F2', border: '#F87171', color: '#DC142A' },
  medium: { background: '#FFFBEB', border: '#FCD34D', color: '#F59C00' },
  low: { background: '#F0FDF4', border: '#86EFAC', color: '#198038' },
};

const backlogTiles: BacklogTile[] = [
  { level: 'high', label: 'Highest: High', count: 1, caption: '50% of scanned' },
  { level: 'medium', label: 'Highest: Medium', count: 1, caption: '50% of scanned' },
  { level: 'low', label: 'Highest: Low', count: 0 },
];

const summaryRows = [
  { label: 'Documents with highest risk: High', value: '1' },
  { label: 'Documents awaiting replacement', value: '1' },
  { label: 'Documents replaced since finding surfaced (Highest: High/Medium)', value: '1 of 2' },
];

const Backlog = () => {
  return (
    <section className="rounded-lg border border-border bg-background px-6 py-5">
      <div className="flex items-start justify-between gap-sm">
        <div>
          <h2 className="text-base font-bold uppercase text-slate-900">Risk Breakdown</h2>
          <p className="text-xs text-slate-700">
            Each document is counted once, under its highest risk level, from its most recent scan.
          </p>
        </div>
        <p className="shrink-0 text-xs text-muted">Aug 28, 2026 - Sep 28, 2026</p>
      </div>

      <div className="mt-md grid grid-cols-1 gap-md md:grid-cols-3">
        {backlogTiles.map(({ level, label, count, caption }) => {
          const style = tileStyles[level];
          return (
            <div
              key={level}
              className="rounded-lg border px-md py-3"
              style={{
                background: style.background,
                borderColor: style.border,
                color: style.color,
              }}
            >
              <div className="flex items-center gap-2">
                <img
                  src={riskIcons[level]}
                  alt=""
                  className="h-[30px] w-[30px] shrink-0"
                  aria-hidden="true"
                />
                <p className="text-sm font-semibold">{label}</p>
              </div>
              <p className="mt-2 text-2xl font-bold">{count}</p>
              {caption && <p className="mt-1 text-xs">{caption}</p>}
            </div>
          );
        })}
      </div>

      <div className="mt-md flex flex-col gap-3 border-t border-border pt-3">
        {summaryRows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between text-xs text-slate-700">
            <span>{label}</span>
            <span className="font-semibold text-slate-900">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Backlog;
