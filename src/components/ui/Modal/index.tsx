import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number | string;
  closeOnOverlayClick?: boolean;
  className?: string;
  bodyClassName?: string;
  footerClassName?: string;
  showCloseButton?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 520,
  closeOnOverlayClick = true,
  className,
  bodyClassName,
  footerClassName,
  showCloseButton = true,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onMouseDown={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'flex max-h-[90vh] w-full flex-col rounded-lg border border-[#E5E9EC] bg-[#F1F5F9] shadow-lg',
          className,
        )}
        style={{ maxWidth: width }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-md border-b border-[#E5E9EC] px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-[#64748B]">{subtitle}</p>}
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 rounded-md p-1 text-muted transition-colors hover:bg-surface hover:text-slate-900"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        <div className={cn('min-h-0 flex-1 overflow-auto px-5 py-4', bodyClassName)}>
          {children}
        </div>

        {footer && (
          <div
            className={cn(
              'flex items-center justify-end gap-sm px-5 py-3',
              footerClassName,
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
