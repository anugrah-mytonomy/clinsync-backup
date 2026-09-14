import { useEffect, useId, useRef, useState, type ChangeEvent, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDownIcon } from '@/components/ui/icons';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

const SELECT_BORDER = '1px solid #3538392E';

const Select = ({
  options,
  placeholder,
  fullWidth = false,
  className,
  id,
  disabled,
  value,
  name,
  onChange,
}: SelectProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleSelect = (nextValue: string) => {
    onChange?.({
      target: { value: nextValue, name: name ?? '' },
    } as ChangeEvent<HTMLSelectElement>);
    setOpen(false);
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
          'flex h-9 w-full items-center justify-between rounded-[6px] bg-background px-3 text-left text-sm text-slate-900 outline-none transition-colors',
          'focus:ring-2 focus:ring-primary/20',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        style={{ border: SELECT_BORDER }}
      >
        <span className={cn('truncate', !selected && 'text-slate-500')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDownIcon className={cn('h-4 w-4 shrink-0 text-slate-600', open && 'rotate-180')} />
      </button>

      {open && !disabled && (
        <ul
          role="listbox"
          aria-labelledby={selectId}
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-[6px] bg-background py-1 shadow-sm"
          style={{ border: SELECT_BORDER }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex h-9 w-full items-center px-3 text-left text-sm text-slate-900 hover:bg-surface',
                    isSelected && 'bg-surface font-medium',
                  )}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Select;
