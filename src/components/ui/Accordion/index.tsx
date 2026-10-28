import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDownIcon } from '@/components/ui/icons';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIds?: string[];
  // When false, opening an item closes the others.
  allowMultiple?: boolean;
  className?: string;
}

const Accordion = ({
  items,
  defaultOpenIds = [],
  allowMultiple = true,
  className,
}: AccordionProps) => {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(defaultOpenIds));

  const toggle = (id: string) => {
    setOpenIds((current) => {
      const next = new Set(allowMultiple ? current : []);
      if (current.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn('divide-y divide-border', className)}>
      {items.map(({ id, title, content }) => {
        const isOpen = openIds.has(id);
        const buttonId = `${baseId}-${id}-button`;
        const panelId = `${baseId}-${id}-panel`;

        return (
          <div key={id} className={cn(isOpen && 'bg-[#F8FAFC]')}>
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-semibold text-slate-900 transition-colors hover:bg-[#F8FAFC]"
            >
              <span>{title}</span>
              <ChevronDownIcon
                className={cn(
                  'h-4 w-4 shrink-0 text-slate-700 transition-transform',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="px-4 pb-3 text-sm leading-relaxed text-[#64748B]"
              >
                {content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
