import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import type { BreadcrumbProps } from '@/pages/scan-history/types';

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center text-sm" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-[#94A3B8]" aria-hidden="true">
                /
              </span>
            )}
            {item.to && !isLast ? (
              <Link to={item.to} className="text-[#94A3B8] hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? 'font-medium text-primary' : 'text-[#94A3B8]')}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
