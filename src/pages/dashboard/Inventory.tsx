import { AlertIcon } from '@/components/ui/icons';
import ProgressBar from '@/components/ui/ProgressBar';
import { cn } from '@/utils/cn';

interface SpecialtyTag {
  label: string;
  count: number;
  flagged?: boolean;
}

interface DocumentTypeRow {
  label: string;
  count: number;
}

const totalTitles = 8;
const untaggedCount = 2;

const specialtyTags: SpecialtyTag[] = [
  { label: 'Oncology', count: 1 },
  { label: 'General Surgery', count: 2 },
  { label: 'Gastroenterology', count: 0 },
  { label: 'Emergency Medicine', count: 1 },
  { label: 'Ophthalmology', count: 0 },
  { label: 'Pediatrics', count: 1 },
  { label: 'Urology', count: 1 },
  { label: 'Pulmonology', count: 0 },
  { label: 'Unassigned', count: 2, flagged: true },
];

const documentTypes: DocumentTypeRow[] = [
  { label: 'Procedural Guide', count: 1 },
  { label: 'Medication Information', count: 1 },
  { label: 'Discharge Instructions', count: 3 },
  { label: 'Condition Overview / Disease Management', count: 3 },
];

const maxDocumentTypeCount = Math.max(...documentTypes.map((row) => row.count));

const Inventory = () => {
  return (
    <div className="rounded-lg border border-border bg-background px-6 py-5">
      <div className="flex items-center justify-between gap-sm">
        <h2 className="text-base font-bold text-slate-900">Inventory</h2>
<span className="text-xs font-medium text-muted flex items-center justify-center">
    Total Titles:{" "}
    <span className="font-inter pl-1 text-lg font-bold leading-[100%] tracking-[0%] text-[#007FAA]">
      {totalTitles}
    </span>
  </span>
      </div>

      <div className="mt-md flex items-start gap-sm rounded-md border border-[#FDE68A] bg-amber-50 px-3 py-2.5">
        <AlertIcon className="h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-xs text-amber-800">
          <span className="font-semibold">{untaggedCount} Untagged Documents</span> · Requires
          specialty assignment to enable custom scan templates.
        </p>
      </div>

      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">By Specialty</h3>
        <div className="mt-sm flex flex-wrap gap-xs">
          {specialtyTags.map((tag) => (
            <span
              key={tag.label}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium',
                tag.flagged ? 'bg-amber-100 text-amber-800' : 'bg-[#D9ECF2] font-medium text-[#005875]',
              )}
            >
              {tag.label} ({tag.count})
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          By Document Type
        </h3>
        <ul className="mt-sm flex flex-col gap-sm">
          {documentTypes.map((row) => (
            <li key={row.label} className="flex items-center gap-sm">
              <span className="w-56 shrink-0 truncate text-[13px] text-slate-600">
                {row.label}
              </span>
              <ProgressBar
                value={(row.count / maxDocumentTypeCount) * 100}
                label={`${row.label}: ${row.count}`}
                className="flex-1"
              />
              <span className="w-4 shrink-0 text-right text-[13px] font-semibold text-slate-900">
                {row.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Inventory;
