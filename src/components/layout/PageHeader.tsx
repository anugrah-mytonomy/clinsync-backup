import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
}

const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <header className="flex shrink-0 flex-col gap-3 bg-[#F1F5F9] px-6 py-2 lg:flex-row lg:items-center lg:justify-between lg:gap-md">
      <div className="min-w-0">
        {typeof title === 'string' ? (
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        ) : (
          title
        )}
        {subtitle && <p className="text-sm font-normal text-[#64748B]">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
          {actions}
        </div>
      )}
    </header>
  );
};

export default PageHeader;
