import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDownIcon } from '@/components/ui/icons';
import type { SelectOption } from '@/components/ui/Select';

interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const SELECT_BORDER = '1px solid #3538392E';

const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder,
  fullWidth = false,
  disabled,
  id,
  className,
}: MultiSelectProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const toggleOption = (optionValue: string) => {
    onChange(
      value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue],
    );
  };

  return (
    <div ref={containerRef} className={cn('relative', fullWidth ? 'w-full' : 'w-[200px]')}>
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-[6px] bg-background px-3 text-left text-sm text-slate-900 outline-none transition-colors',
          'focus:ring-2 focus:ring-primary/20',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        style={{ border: SELECT_BORDER }}
      >
        <span className={cn('truncate', selectedLabels.length === 0 && 'text-slate-500')}>
          {selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
        </span>
        <ChevronDownIcon className={cn('h-4 w-4 shrink-0 text-slate-600', open && 'rotate-180')} />
      </button>

      {open && !disabled && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={selectId}
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-[6px] bg-background py-1 shadow-sm"
          style={{ border: SELECT_BORDER }}
        >
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <label className="flex h-9 w-full cursor-pointer items-center gap-2 px-3 text-sm text-slate-900 hover:bg-surface">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOption(option.value)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                  />
                  {option.label}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
