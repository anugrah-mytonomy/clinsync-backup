import { cn } from '@/utils/cn';
import type { FindingRisk, RiskBadgeVariant, ScanStatus } from '@/pages/scan-history/types';

const riskTextClasses: Record<FindingRisk, string> = {
  high: 'text-[#9C0E1E]',
  medium: 'text-[#8C5900]',
  low: 'text-[#125B28]',
  clear: 'text-[#64748B]',
};

const riskBadgeClasses: Record<FindingRisk, string> = {
  high: 'bg-[#F7C7CC] text-[#9C0E1E]',
  medium: 'bg-[#FCEACB] text-[#8C5900]',
  low: 'bg-[#D1E6D7] text-[#125B28]',
  clear: 'bg-[#E5E7EB] text-[#64748B]',
};

export const RiskBadge = ({ risk, variant = 'badge' }: { risk: FindingRisk; variant?: RiskBadgeVariant }) => (
  <span
    className={cn(
      'inline-block text-[13px] font-bold uppercase',
      variant === 'badge'
        ? cn('rounded-[6px] border border-[#35383914] px-2 py-0.5', riskBadgeClasses[risk])
        : riskTextClasses[risk],
    )}
  >
    {risk}
  </span>
);

const statusBadgeConfig: Record<ScanStatus, { label: string; className: string }> = {
  'in-progress': { label: 'In Progress', className: 'bg-[#E5E7EB] text-[#353839CC]' },
  success: { label: 'Success', className: 'bg-[#D1E6D7] text-[#125B28]' },
  expired: { label: 'Expired', className: 'bg-[#F7C7CC] text-[#9C0E1E]' },
};

export const StatusBadge = ({ status }: { status: ScanStatus }) => {
  const config = statusBadgeConfig[status];
  return (
    <span
      className={cn('inline-block rounded-[6px] border border-[#35383914] px-2 py-0.5 text-xs font-medium', config.className)}
    >
      {config.label}
    </span>
  );
};
