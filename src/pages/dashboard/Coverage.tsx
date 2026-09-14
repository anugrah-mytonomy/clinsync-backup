import DonutChart from '@/components/ui/DonutChart';
import { DocumentIcon } from '@/components/ui/icons';

const scannedCount = 6;
const totalTitles = 8;
const coveragePercent = Math.round((scannedCount / totalTitles) * 100);

const oldestUnscanned = {
  name: 'Post-Op Wound Care Guide',
  addedOn: 'Sep 1, 2026',
  position: 1,
  totalUnscanned: totalTitles - scannedCount,
};

const donutData = [
  { id: 'scanned', label: 'Scanned', value: scannedCount, color: 'rgb(var(--color-primary))' },
  {
    id: 'unscanned',
    label: 'Unscanned',
    value: totalTitles - scannedCount,
    color: 'rgb(var(--color-border))',
  },
];

const Coverage = () => {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-background px-6 py-5">
      <h2 className="text-base font-bold text-slate-900">Coverage</h2>

      <div className="mt-md flex items-center gap-lg">
        <DonutChart
          data={donutData}
          size={104}
          thickness={14}
          ariaLabel={`${coveragePercent}% coverage, ${scannedCount} of ${totalTitles} titles scanned`}
          centerLabel={<span className="text-xl font-bold text-slate-900">{coveragePercent}%</span>}
        />
        <div>
          <p className="text-sm font-bold text-slate-900">
            {scannedCount} of {totalTitles} titles scanned
          </p>
          <p className="text-xs text-muted">Scanned within the last 30 days</p>
        </div>
      </div>

      <div className="mt-lg border-t border-border pt-md">
        <div className="flex items-center justify-between gap-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Never Scanned
          </h3>
          <span className="text-xs text-muted">
            Oldest unscanned ({oldestUnscanned.position} of {oldestUnscanned.totalUnscanned})
          </span>
        </div>
        <div className="mt-sm flex items-center gap-sm rounded-md border border-border bg-surface px-3 py-2.5">
          <DocumentIcon className="h-5 w-5 shrink-0 text-muted" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{oldestUnscanned.name}</p>
            <p className="text-xs text-muted">Added {oldestUnscanned.addedOn}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coverage;
