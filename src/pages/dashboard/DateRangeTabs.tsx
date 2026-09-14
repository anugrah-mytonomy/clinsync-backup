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

const DateRangeTabs = () => {
  const [active, setActive] = useState<(typeof dateRangeOptions)[number]>('Last 30 days');

  return (
    <div
      role="tablist"
      aria-label="Dashboard date range"
      className="inline-flex flex-wrap items-center gap-xs rounded-[10px] bg-[#FFFFFF] p-1"
    >
      {dateRangeOptions.map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={active === option}
          onClick={() => setActive(option)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            active === option
              ? 'bg-primary text-white'
              : 'text-muted hover:bg-background hover:text-slate-900',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default DateRangeTabs;
