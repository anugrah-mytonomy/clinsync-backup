import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
}

const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <header className="flex shrink-0 items-center justify-between gap-md px-6 py-2 bg-[#F1F5F9]">
      <div>
        {typeof title === 'string' ? (
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        ) : (
          title
        )}
        {subtitle && <p className="text-sm font-normal text-[#64748B]">{subtitle}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
};

export default PageHeader;
