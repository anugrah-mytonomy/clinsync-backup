import ProgressBar from '@/components/ui/ProgressBar';

interface YearRow {
  year: string;
  count: number;
}

const yearRows: YearRow[] = [
  { year: '2026', count: 8 },
  { year: 'Before 2026', count: 0 },
];

const maxCount = Math.max(...yearRows.map((row) => row.count), 1);

const DocumentsByYear = () => {
  return (
    <div className="rounded-lg border border-border bg-background px-6 py-5">
      <h2 className="text-base font-bold text-slate-900">Documents by Year Added</h2>

      <ul className="mt-md flex flex-col gap-sm">
        {yearRows.map((row) => (
          <li key={row.year} className="flex items-center gap-sm">
            <span className="w-28 shrink-0 text-[13px] text-slate-600">{row.year}</span>
            <ProgressBar
              value={(row.count / maxCount) * 100}
              label={`${row.year}: ${row.count} documents`}
              className="flex-1"
            />
            <span className="w-24 shrink-0 text-right text-[13px] font-medium text-muted">
              {row.count} documents
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-md text-xs text-muted">
        All {yearRows[0].count} titles were added in the current year.
      </p>
    </div>
  );
};

export default DocumentsByYear;
