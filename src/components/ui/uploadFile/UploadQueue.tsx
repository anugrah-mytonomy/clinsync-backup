import { useMemo } from 'react';
import UploadQueueRow from '@/components/ui/uploadFile/UploadQueueRow';
import type { UploadDisplayFile, UploadRenderBlock } from '@/components/ui/uploadFile/types';

interface UploadQueueProps {
  displayFiles: UploadDisplayFile[];
  onRemove: (id: string) => void;
}

function buildRenderBlocks(displayFiles: UploadDisplayFile[]): UploadRenderBlock[] {
  const blocks: UploadRenderBlock[] = [];
  const seenGroupKeys = new Set<string>();

  displayFiles.forEach((item) => {
    if (item.status !== 'review') return;

    const key = item.name.toLowerCase();
    if (seenGroupKeys.has(key)) return;
    seenGroupKeys.add(key);
    const group = displayFiles.filter((entry) => entry.name.toLowerCase() === key);
    blocks.push({ kind: 'review-group', key, items: group });
  });

  displayFiles.forEach((item) => {
    if (item.status === 'rejected') {
      blocks.push({ kind: 'rejected', key: item.id, item });
    }
  });

  displayFiles.forEach((item) => {
    if (item.status === 'ready') {
      blocks.push({ kind: 'ready', key: item.id, item });
    }
  });

  return blocks;
}

const UploadQueue = ({ displayFiles, onRemove }: UploadQueueProps) => {
  const renderBlocks = useMemo(() => buildRenderBlocks(displayFiles), [displayFiles]);

  if (displayFiles.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-bold text-slate-900">Uploaded Files ({displayFiles.length})</h2>

      <ul className="mt-sm flex flex-col gap-sm">
        {renderBlocks.map((block) => (
          <UploadQueueRow key={block.key} block={block} onRemove={onRemove} />
        ))}
      </ul>
    </div>
  );
};

export default UploadQueue;
