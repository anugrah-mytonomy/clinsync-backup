import { useMemo } from 'react';
import UploadQueueRow from '@/components/ui/uploadFile/UploadQueueRow';
import { AlertCircleIcon } from '@/components/ui/icons';
import type { UploadDisplayFile } from '@/components/ui/uploadFile/types';

interface UploadQueueProps {
  displayFiles: UploadDisplayFile[];
  onRemove: (id: string) => void;
}

const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

const countLabel = (count: number) => COUNT_WORDS[count] ?? String(count);

/** Groups files that share a filename (case-insensitive), in first-seen order. */
function groupDuplicates(displayFiles: UploadDisplayFile[]): UploadDisplayFile[][] {
  const groups = new Map<string, UploadDisplayFile[]>();
  displayFiles.forEach((item) => {
    if (item.status !== 'review') return;
    const key = item.name.toLowerCase();
    groups.set(key, [...(groups.get(key) ?? []), item]);
  });
  return [...groups.values()];
}

const UploadQueue = ({ displayFiles, onRemove }: UploadQueueProps) => {
  const duplicateGroups = useMemo(() => groupDuplicates(displayFiles), [displayFiles]);
  const otherFiles = useMemo(
    () => [
      ...displayFiles.filter((item) => item.status === 'ready'),
      ...displayFiles.filter((item) => item.status === 'rejected'),
    ],
    [displayFiles],
  );

  if (displayFiles.length === 0) return null;

  return (
    <div className="flex flex-col gap-sm">
      <h2 className="text-sm font-bold text-[#0F172A]">
        Uploaded Documents ({displayFiles.length})
      </h2>

      {duplicateGroups.map((group) => (
        <div
          key={group[0].name.toLowerCase()}
          className="overflow-hidden rounded-lg border border-[#F5B843] bg-white"
        >
          <div className="flex items-center gap-sm border-b border-[#F5B843]/60 bg-[#FFFBEB] px-4 py-2.5">
            <AlertCircleIcon className="h-4 w-4 shrink-0 text-[#D97706]" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#0F172A]">Duplicate Group</p>
              <p className="text-xs text-[#B45309]">
                {countLabel(group.length)} documents in this upload share the same filename.
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-[#FEF3C7] px-2 py-0.5 text-xs font-medium text-[#B45309]">
              From this upload
            </span>
          </div>
          <ul className="divide-y divide-[#E5E9EC]">
            {group.map((item) => (
              <UploadQueueRow key={item.id} item={item} onRemove={onRemove} />
            ))}
          </ul>
        </div>
      ))}

      {otherFiles.length > 0 && (
        <ul className="divide-y divide-[#E5E9EC] overflow-hidden rounded-lg border border-[#E5E9EC] bg-white">
          {otherFiles.map((item) => (
            <UploadQueueRow key={item.id} item={item} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default UploadQueue;
