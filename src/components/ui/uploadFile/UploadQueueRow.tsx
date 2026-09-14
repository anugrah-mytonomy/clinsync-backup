import { cn } from '@/utils/cn';
import { formatBytes } from '@/utils/formatBytes';
import ProgressBar from '@/components/ui/ProgressBar';
import { AlertIcon, CheckCircleIcon, DocumentIcon, TrashIcon, VideoIcon } from '@/components/ui/icons';
import type { UploadQueueItem } from '@/types/contentLibrary';

interface UploadQueueRowProps {
  item: UploadQueueItem;
  onRemove: (id: string) => void;
}

const UploadQueueRow = ({ item, onRemove }: UploadQueueRowProps) => {
  const hasVideoSections = Boolean(item.validation?.videoSections?.length);
  const isQueued = item.status === 'queued';
  const isUploading = item.status === 'uploading';
  const isSuccess = item.status === 'success';
  const isFailed = item.status === 'validation-failed' || item.status === 'upload-failed';

  return (
    <li className="flex items-start gap-md py-md">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface text-muted">
        {hasVideoSections ? <VideoIcon className="h-4 w-4" /> : <DocumentIcon className="h-4 w-4" />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-md">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                'truncate text-sm font-medium',
                isQueued ? 'text-muted' : 'text-slate-900',
                isSuccess && 'text-slate-900',
              )}
            >
              {item.name}
            </p>
            {!isUploading && (
              <p className="text-xs text-muted">
                {formatBytes(item.size)}
                {hasVideoSections &&
                  ` · ${item.validation!.videoSections!.length} video section${item.validation!.videoSections!.length === 1 ? '' : 's'}`}
                {item.validation?.zipEntries &&
                  ` · ${item.validation.zipEntries.filter((entry) => entry.valid).length}/${item.validation.zipEntries.length} documents valid`}
              </p>
            )}
            {item.status === 'validation-failed' && item.validation?.errors && (
              <p className="truncate text-xs text-danger">{item.validation.errors.join(' ')}</p>
            )}
          </div>

          <div className="shrink-0 text-right">
            {isSuccess && (
              <span className="flex items-center justify-end gap-xs text-xs font-medium text-success">
                <CheckCircleIcon className="h-4 w-4" />
                Uploaded successfully
              </span>
            )}

            {isQueued && <span className="text-xs text-muted">Queued for upload</span>}

            {isFailed && (
              <span
                className="flex items-center justify-end gap-xs text-xs font-medium text-danger"
                title={item.validation?.errors.join(' ')}
              >
                <AlertIcon className="h-4 w-4 shrink-0" />
                {item.status === 'validation-failed' ? 'Validation failed' : 'Upload failed'}
              </span>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="mt-sm flex items-center gap-sm">
            <ProgressBar
              value={item.progress}
              variant="accent"
              label={`${item.name} upload progress`}
              className="flex-1"
            />
            <span className="shrink-0 text-xs font-medium text-slate-900">{item.progress}%</span>
            <span className="shrink-0 text-xs text-muted">{formatBytes(item.size)}</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        disabled={isUploading}
        aria-label={`Remove ${item.name}`}
        className="shrink-0 rounded-md p-xs text-muted transition-colors hover:bg-surface hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </li>
  );
};

export default UploadQueueRow;
