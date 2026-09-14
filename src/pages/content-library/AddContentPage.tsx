import { useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import { formatBytes } from '@/utils/formatBytes';
import { ACCEPTED_FILE_INPUT, FORMATS_LABEL, validateFileBasics } from '@/utils/addContentValidation';
import { AlertIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import type { AddContentDisplayFile, AddContentFile, AddContentFileStatus } from '@/types/addContent';
import uploadIcon from '@/assets/Upload.svg';
import fileTextIcon from '@/assets/File_text.svg';
import trashIcon from '@/assets/Trash.svg';

let idCounter = 0;
const createId = () => {
  idCounter += 1;
  return `add-content-file-${idCounter}`;
};

const statusBadgeClasses: Record<AddContentFileStatus, string> = {
  ready: 'border border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A]',
  review: 'border border-[#FDE68A] bg-[#FFFBEB] text-[#D97706]',
  rejected: 'border border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]',
};

const statusLabels: Record<AddContentFileStatus, string> = {
  ready: 'Ready',
  review: 'Review',
  rejected: 'Rejected',
};

type RenderBlock =
  | { kind: 'ready'; key: string; item: AddContentDisplayFile }
  | { kind: 'review-group'; key: string; items: AddContentDisplayFile[] }
  | { kind: 'rejected'; key: string; item: AddContentDisplayFile };

function buildRenderBlocks(displayFiles: AddContentDisplayFile[]): RenderBlock[] {
  const blocks: RenderBlock[] = [];
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

const AddContentPage = () => {
  const [files, setFiles] = useState<AddContentFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fileList: FileList) => {
    const newFiles: AddContentFile[] = Array.from(fileList).map((file) => {
      const result = validateFileBasics(file);
      return {
        id: createId(),
        file,
        name: file.name,
        size: file.size,
        basicValid: result.valid,
        rejectReason: result.reason,
      };
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) addFiles(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleClearAll = () => {
    setFiles([]);
  };

  const displayFiles: AddContentDisplayFile[] = useMemo(() => {
    const nameCounts = new Map<string, number>();
    files.forEach((file) => {
      if (!file.basicValid) return;
      const key = file.name.toLowerCase();
      nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1);
    });

    return files.map((file) => {
      if (!file.basicValid) {
        return { ...file, status: 'rejected', note: file.rejectReason };
      }

      const key = file.name.toLowerCase();
      const isDuplicate = (nameCounts.get(key) ?? 0) > 1;

      if (isDuplicate) {
        return {
          ...file,
          status: 'review',
          note: 'Duplicate filename: Two files in this upload have the same filename and in library.',
        };
      }

      return { ...file, status: 'ready' };
    });
  }, [files]);

  const readyCount = displayFiles.filter((file) => file.status === 'ready').length;
  const reviewCount = displayFiles.filter((file) => file.status === 'review').length;
  const rejectedCount = displayFiles.filter((file) => file.status === 'rejected').length;

  const canUpload = displayFiles.length > 0 && displayFiles.every((file) => file.status === 'ready');

  const renderBlocks = useMemo(() => buildRenderBlocks(displayFiles), [displayFiles]);

  return (
    <div className="flex min-h-full flex-col bg-[#F1F5F9]">
      <PageHeader
        title="Add Content"
        subtitle="Upload healthcare clinical documents to library and verify compliance standards."
      />

      <div className="flex flex-col gap-md px-6 pb-6 pt-4 bg-[#F1F5F9] ">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-sm rounded-lg border-2 border-dashed px-lg py-xl text-center transition-colors',
            isDragActive ? 'border-primary bg-background' : 'border-primary/40 bg-background',
          )}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <img src={uploadIcon} alt="" className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-sm text-slate-900">
            <span className="font-semibold">Drag files here</span> or browse your system
          </p>
          <p className="text-xs text-muted">{FORMATS_LABEL}</p>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">PDF · DOC · DOCX · ZIP</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_FILE_INPUT}
            className="hidden"
            onChange={handleInputChange}
          />
        </div>

        {displayFiles.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-900">Uploaded Files ({displayFiles.length})</h2>

            <ul className="mt-sm flex flex-col gap-sm">
              {renderBlocks.map((block) => {
                if (block.kind === 'ready') {
                  const item = block.item;
                  return (
                    <li
                      key={block.key}
                      className="overflow-hidden rounded-lg border border-[#35383914] bg-background"
                    >
                      <div className="flex items-center gap-md px-md py-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                          <img src={fileTextIcon} alt="" className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                          <p className="text-xs text-muted">{formatBytes(item.size)}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-sm">
                          <span
                            className={cn(
                              'rounded-full px-2.5 py-1 text-xs font-semibold',
                              statusBadgeClasses.ready,
                            )}
                          >
                            {statusLabels.ready}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
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
                    <li key={block.key} className="overflow-hidden rounded-lg border border-[#FDE68A]">
                      <ul className="divide-y divide-[#FDE68A] bg-white">
                        {block.items.map((groupItem, index) => (
                          <li key={groupItem.id} className="flex items-center gap-md px-md py-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface text-muted">
                              <img src={fileTextIcon} alt="" className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-900">
                                {groupItem.name}
                              </p>
                              <p className="text-xs text-muted">{formatBytes(groupItem.size)}</p>
                              {index > 0 && (
                                <p className="mt-0.5 text-[10px] text-[#B45309]">{groupItem.note}</p>
                              )}
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
                              onClick={() => handleRemove(groupItem.id)}
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
                  <li key={block.key} className="overflow-hidden rounded-lg border border-[#FECACA] bg-white">
                    <div className="flex items-center gap-md px-md py-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-danger/10 text-danger">
                        <AlertIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-danger">{item.name}</p>
                        <p className="text-xs text-danger/80">{item.note}</p>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
                          statusBadgeClasses.rejected,
                        )}
                      >
                        {statusLabels.rejected}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="shrink-0 rounded-md p-xs text-danger/70 transition-colors hover:bg-danger/10 hover:text-danger"
                      >
                        <img src={trashIcon} alt="" className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {displayFiles.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-sm px-1">
            <p className="text-xs text-[#353839]">
              {readyCount} accepted · {reviewCount} duplicate · {rejectedCount} rejected
            </p>

            <div className="flex items-center gap-sm">
              <button
                type="button"
                onClick={handleClearAll}
                className="text-sm font-medium text-muted hover:text-slate-900"
              >
                Clear All
              </button>
              <Button disabled={!canUpload}>Upload</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddContentPage;
