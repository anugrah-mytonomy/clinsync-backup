import type { ComponentType } from 'react';
import { ReplaceIcon, SearchIcon, UploadIcon } from '@/components/ui/icons';

interface DetailCard {
  label: string;
  count: number;
  caption: string;
  icon: ComponentType<{ className?: string }>;
}

const detailCards: DetailCard[] = [
  { label: 'Documents Uploaded', count: 8, caption: '100% of library', icon: UploadIcon },
  { label: 'Scanned', count: 2, caption: '25% of uploaded documents', icon: SearchIcon },
  { label: 'Replaced', count: 1, caption: 'of 2 High/Medium documents', icon: ReplaceIcon },
];

const Inventory = () => {
  return (
    <section className="rounded-lg border border-border bg-background px-6 py-5">
      <div className="flex items-start justify-between gap-sm">
        <div>
          <h2 className="text-base font-bold uppercase text-slate-900">Documents Details</h2>
          <p className="text-xs text-slate-700">
            Document counts, for documents uploaded in the selected date range
          </p>
        </div>
        <p className="shrink-0 text-xs text-muted">Aug 28, 2026 - Sep 28, 2026</p>
      </div>

      <div className="mt-md grid grid-cols-1 gap-md md:grid-cols-3">
        {detailCards.map(({ label, count, caption, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-background px-md py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{label}</p>
              <Icon className="h-4 w-4 text-slate-700" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{count}</p>
            <p className="mt-1 text-xs text-slate-700">{caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Inventory;
