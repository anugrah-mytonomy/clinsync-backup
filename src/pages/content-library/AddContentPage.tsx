import { useMemo, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import UploadDropzone from '@/components/ui/uploadFile/UploadDropzone';
import UploadQueue from '@/components/ui/uploadFile/UploadQueue';
import { ACCEPTED_FILE_INPUT, FORMATS_LABEL, validateFileBasics } from '@/utils/addContentValidation';
import { uploadFileToLocalStack } from '@/utils/localstackUpload';
import type { UploadDisplayFile, UploadFile } from '@/components/ui/uploadFile/types';

let idCounter = 0;
const createId = () => {
  idCounter += 1;
  return `add-content-file-${idCounter}`;
};

const AddContentPage = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const addFiles = (fileList: FileList) => {
    const newFiles: UploadFile[] = Array.from(fileList).map((file) => {
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

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleClearAll = () => {
    setFiles([]);
    setUploadMessage(null);
  };

  const displayFiles: UploadDisplayFile[] = useMemo(() => {
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

  const handleUpload = async () => {
    const readyFiles = displayFiles.filter((file) => file.status === 'ready');
    if (readyFiles.length === 0) return;

    setIsUploading(true);
    setUploadMessage(null);

    try {
      for (const item of readyFiles) {
        await uploadFileToLocalStack(item.file);
      }
      setUploadMessage(`Uploaded ${readyFiles.length} file${readyFiles.length === 1 ? '' : 's'} to LocalStack S3.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed.';
      setUploadMessage(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-[#F1F5F9]">
      <PageHeader
        title="Add Content"
        subtitle="Upload healthcare clinical documents to library and verify compliance standards."
      />

      <div className="flex flex-col gap-md px-6 pb-6 pt-4 bg-[#F1F5F9] ">
        <UploadDropzone
          onFilesSelected={addFiles}
          accept={ACCEPTED_FILE_INPUT}
          formatsLabel={FORMATS_LABEL}
          formats={['DOCX', 'PDF', 'ZIP']}
        />

        <UploadQueue displayFiles={displayFiles} onRemove={handleRemove} />

        {displayFiles.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-sm px-1">
            <p className="text-xs text-[#353839]">
              {readyCount} accepted · {reviewCount} duplicate · {rejectedCount} rejected
              {uploadMessage ? ` · ${uploadMessage}` : ''}
            </p>

            <div className="flex items-center gap-sm">
              <button
                type="button"
                onClick={handleClearAll}
                className="text-sm font-medium text-muted hover:text-slate-900"
              >
                Clear All
              </button>
              <Button disabled={!canUpload || isUploading} isLoading={isUploading} onClick={handleUpload}>
                Upload
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddContentPage;
