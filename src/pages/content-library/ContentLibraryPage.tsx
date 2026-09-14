import { useRef, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import UploadDropzone from '@/components/ui/uploadFile/UploadDropzone';
import UploadQueue from '@/components/ui/uploadFile/UploadQueue';
import { formatBytes } from '@/utils/formatBytes';
import { simulateFileUpload } from '@/utils/simulateUpload';
import {
  ACCEPTED_FILE_INPUT,
  SUPPORTED_EXTENSIONS,
  getSupportedExtension,
  validateUploadFile,
} from '@/utils/contentValidation';
import type { UploadQueueItem } from '@/types/contentLibrary';
import { UploadIcon } from '@/components/ui/icons';

const MAX_FILE_SIZE_MB = import.meta.env.VITE_MAX_UPLOAD_FILE_SIZE_MB;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB ? Number(MAX_FILE_SIZE_MB) * 1024 * 1024 : undefined;

const FORMATS_LABEL = `Supported clinical file formats: ${SUPPORTED_EXTENSIONS.map((ext) => ext.toUpperCase()).join(', ')}${
  MAX_FILE_SIZE_BYTES ? ` up to ${formatBytes(MAX_FILE_SIZE_BYTES)}` : ''
}`;

let idCounter = 0;
const createItemId = () => {
  idCounter += 1;
  return `upload-item-${idCounter}`;
};

const ContentLibraryPage = () => {
  const [items, setItems] = useState<UploadQueueItem[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uploadChainRef = useRef<Promise<void>>(Promise.resolve());

  const uploadQueuedItems = async (targetItems: UploadQueueItem[]) => {
    const queuedItems = targetItems.filter((item) => item.status === 'queued');
    if (queuedItems.length === 0) return;

    setIsUploading(true);

    let readyItems = [...queuedItems];
    const unvalidated = readyItems.filter((item) => !item.validated);

    if (unvalidated.length > 0) {
      const results = await Promise.all(unvalidated.map((item) => validateUploadFile(item.file)));

      readyItems = readyItems.map((item) => {
        const index = unvalidated.findIndex((pendingItem) => pendingItem.id === item.id);
        if (index === -1) return item;

        const result = results[index];
        return {
          ...item,
          validated: true,
          validation: result,
          status: result.valid ? 'queued' : 'validation-failed',
        };
      });

      setItems((prev) =>
        prev.map((item) => readyItems.find((readyItem) => readyItem.id === item.id) ?? item),
      );
    }

    const itemsToUpload = readyItems.filter(
      (item) => item.status === 'queued' && item.validated && item.validation?.valid,
    );

    for (const item of itemsToUpload) {
      setItems((prev) =>
        prev.map((current) =>
          current.id === item.id ? { ...current, status: 'uploading', progress: 0 } : current,
        ),
      );

      await simulateFileUpload({
        onProgress: (progress) => {
          setItems((prev) =>
            prev.map((current) => (current.id === item.id ? { ...current, progress } : current)),
          );
        },
      });

      setItems((prev) =>
        prev.map((current) =>
          current.id === item.id ? { ...current, status: 'success', progress: 100 } : current,
        ),
      );
    }

    setIsUploading(false);
  };

  const enqueueUpload = (targetItems: UploadQueueItem[]) => {
    uploadChainRef.current = uploadChainRef.current.then(() => uploadQueuedItems(targetItems));
  };

  const addFiles = (files: FileList) => {
    const newItems: UploadQueueItem[] = Array.from(files).map((file) => {
      const extension = getSupportedExtension(file.name);
      const errors: string[] = [];

      if (!extension) {
        errors.push(
          `Unsupported file type. Supported formats: ${SUPPORTED_EXTENSIONS.map((ext) => ext.toUpperCase()).join(', ')}.`,
        );
      } else if (file.size === 0) {
        errors.push('File is empty.');
      } else if (MAX_FILE_SIZE_BYTES && file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`File exceeds the maximum size of ${formatBytes(MAX_FILE_SIZE_BYTES)}.`);
      }

      const hasError = errors.length > 0;

      return {
        id: createItemId(),
        file,
        name: file.name,
        extension,
        size: file.size,
        status: hasError ? 'validation-failed' : 'queued',
        progress: 0,
        validated: hasError,
        validation: hasError ? { valid: false, errors } : undefined,
      };
    });

    setItems((prev) => [...prev, ...newItems]);
    enqueueUpload(newItems);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearQueue = () => {
    setItems([]);
    setIsValidating(false);
    setIsUploading(false);
    uploadChainRef.current = Promise.resolve();
  };

  const handleValidate = async () => {
    const pending = items.filter((item) => item.status === 'queued' && !item.validated);
    if (pending.length === 0) return;

    setIsValidating(true);
    const results = await Promise.all(pending.map((item) => validateUploadFile(item.file)));

    setItems((prev) =>
      prev.map((item) => {
        const index = pending.findIndex((pendingItem) => pendingItem.id === item.id);
        if (index === -1) return item;

        const result = results[index];
        return {
          ...item,
          validated: true,
          validation: result,
          status: result.valid ? 'queued' : 'validation-failed',
        };
      }),
    );
    setIsValidating(false);
  };

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Upload Content"
        subtitle="Add new patient guidance, training videos, and regulatory materials to queue verification."
      />

      <div className="flex flex-col gap-lg p-lg">
        <div className="rounded-lg border border-border bg-background p-lg">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Upload Files</p>
          <div className="mt-sm">
            <UploadDropzone
              onFilesSelected={addFiles}
              accept={ACCEPTED_FILE_INPUT}
              formatsLabel={FORMATS_LABEL}
            />
          </div>
        </div>

        {items.length > 0 && (
          <div className="rounded-lg border border-border bg-background p-lg">
            <UploadQueue
              title="Uploaded Video & Documents"
              items={items}
              onRemove={handleRemove}
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-md">
          <button
            type="button"
            onClick={handleClearQueue}
            className="text-sm font-medium text-muted hover:text-slate-900"
          >
            Clear Queue
          </button>

          <Button
            variant="primary"
            onClick={handleValidate}
            disabled={items.length === 0 || isValidating || isUploading}
            isLoading={isValidating}
          >
            <UploadIcon className="h-4 w-4" />
            Validate Files
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentLibraryPage;
