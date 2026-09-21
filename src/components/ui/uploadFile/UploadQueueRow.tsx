import { formatBytes } from '@/utils/formatBytes';
import { AlertIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import type { UploadFileStatus, UploadRenderBlock } from '@/components/ui/uploadFile/types';
import fileTextIcon from '@/assets/File_text.svg';
import trashIcon from '@/assets/Trash.svg';

interface UploadQueueRowProps {
  block: UploadRenderBlock;
  onRemove: (id: string) => void;
}

const statusBadgeClasses: Record<UploadFileStatus, string> = {
  ready: 'border border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A]',
  review: 'border border-[#FDE68A] bg-[#FFFBEB] text-[#D97706]',
  rejected: 'border border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]',
};

const statusLabels: Record<UploadFileStatus, string> = {
  ready: 'Ready',
  review: 'Review',
  rejected: 'Rejected',
};

const UploadQueueRow = ({ block, onRemove }: UploadQueueRowProps) => {
  if (block.kind === 'ready') {
    const item = block.item;
    return (
      <li className="overflow-hidden rounded-lg border border-[#35383914] bg-background">
        <div className="flex items-center gap-md px-5 py-3">
          <span className="flex shrink-0 items-center justify-center rounded-md">
            <img src={fileTextIcon} alt="" className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
            <p className="text-xs text-muted">{formatBytes(item.size)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-sm">
            <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', statusBadgeClasses.ready)}>
              {statusLabels.ready}
            </span>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.name}`}
              className="rounded-md p-xs text-muted transition-colors hover:bg-surface hover:text-danger"
            >
              <img src={trashIcon} alt="" className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </li>
    );
  }

  if (block.kind === 'review-group') {
    return (
      <li className="overflow-hidden rounded-lg border border-[#FDE68A]">
        <ul className="divide-y divide-[#FDE68A] bg-white">
          {block.items.map((groupItem, index) => (
            <li key={groupItem.id} className="flex items-center gap-md px-md py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface text-muted">
                <img src={fileTextIcon} alt="" className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{groupItem.name}</p>
                <p className="text-xs text-muted">{formatBytes(groupItem.size)}</p>
                {index > 0 && <p className="mt-0.5 text-[10px] text-[#B45309]">{groupItem.note}</p>}
              </div>
              <button
                type="button"
                aria-label={`Review ${groupItem.name}`}
                className={cn(
                  'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-amber-100',
                  statusBadgeClasses.review,
                )}
              >
                {statusLabels.review}
              </button>
              <button
                type="button"
                onClick={() => onRemove(groupItem.id)}
                aria-label={`Remove ${groupItem.name}`}
                className="shrink-0 rounded-md p-xs text-muted transition-colors hover:bg-surface hover:text-danger"
              >
                <img src={trashIcon} alt="" className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  const item = block.item;
  return (
    <li className="overflow-hidden rounded-lg border border-[#FECACA] bg-white">
      <div className="flex items-center gap-md px-md py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-danger/10 text-danger">
          <AlertIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-danger">{item.name}</p>
          <p className="text-xs text-danger/80">{item.note}</p>
        </div>
        <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', statusBadgeClasses.rejected)}>
          {statusLabels.rejected}
        </span>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name}`}
          className="shrink-0 rounded-md p-xs text-danger/70 transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <img src={trashIcon} alt="" className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
};

export default UploadQueueRow;
