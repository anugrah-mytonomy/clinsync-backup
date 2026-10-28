import { formatBytes } from '@/utils/formatBytes';
import { AlertCircleIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import type { UploadDisplayFile } from '@/components/ui/uploadFile/types';
import fileTextIcon from '@/assets/File_text.svg';
import trashIcon from '@/assets/Trash.svg';

interface UploadQueueRowProps {
  item: UploadDisplayFile;
  onRemove: (id: string) => void;
}

const UploadQueueRow = ({ item, onRemove }: UploadQueueRowProps) => {
  const isRejected = item.status === 'rejected';

  return (
    <li className="flex items-center gap-md px-4 py-3">
      {isRejected ? (
        <AlertCircleIcon className="h-5 w-5 shrink-0 text-[#B42318]" />
      ) : (
        <img src={fileTextIcon} alt="" className="h-5 w-5 shrink-0" aria-hidden="true" />
      )}

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-sm font-medium',
            isRejected ? 'text-[#B42318]' : 'text-[#0F172A]',
          )}
        >
          {item.name}
        </p>
        <p className={cn('text-xs', isRejected ? 'text-[#B42318]' : 'text-[#64748B]')}>
          {isRejected ? `Rejected with inline reason: ${item.note}` : formatBytes(item.size)}
        </p>
      </div>

      {item.status === 'ready' && (
        <span className="shrink-0 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-0.5 text-xs font-semibold text-[#16A34A]">
          Ready
        </span>
      )}
      {isRejected && (
        <span className="shrink-0 rounded-full border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-0.5 text-xs font-semibold text-[#B42318]">
          Rejected
        </span>
      )}

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
        className="shrink-0 rounded-md p-xs transition-colors hover:bg-surface"
      >
        <img src={trashIcon} alt="" className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  );
};

export default UploadQueueRow;
