import UploadQueueRow from '@/components/ui/uploadFile/UploadQueueRow';
import type { UploadQueueItem } from '@/types/contentLibrary';

interface UploadQueueProps {
  title: string;
  items: UploadQueueItem[];
  onRemove: (id: string) => void;
}

const UploadQueue = ({ title, items, onRemove }: UploadQueueProps) => {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-900">
        {title} ({items.length})
      </h3>
      <ul className="mt-sm divide-y divide-border">
        {items.map((item) => (
          <UploadQueueRow key={item.id} item={item} onRemove={onRemove} />
        ))}
      </ul>
    </div>
  );
};

export default UploadQueue;
