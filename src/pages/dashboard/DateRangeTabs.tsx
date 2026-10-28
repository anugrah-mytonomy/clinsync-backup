import { useState } from 'react';
import { cn } from '@/utils/cn';

const dateRangeOptions = [
  'Last 7 days',
  'Last 30 days',
  'Last 3 months',
  'Last 6 months',
  'Last year',
  'Custom Range',
] as const;

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </svg>
);

const DateRangeTabs = () => {
  const [active, setActive] = useState<(typeof dateRangeOptions)[number]>('Last 30 days');

  return (
    <div
      role="tablist"
      aria-label="Dashboard date range"
      className="flex flex-wrap items-center gap-2"
    >
      {dateRangeOptions.map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={active === option}
          onClick={() => setActive(option)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors',
            active === option
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-slate-700 hover:bg-surface',
          )}
        >
          {option}
          {option === 'Custom Range' && <CalendarIcon className="h-4 w-4" />}
        </button>
      ))}
    </div>
  );
};

export default DateRangeTabs;
