import { useMemo, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import UploadDropzone from '@/components/ui/uploadFile/UploadDropzone';
import UploadQueue from '@/components/ui/uploadFile/UploadQueue';
import {
  ACCEPTED_FILE_INPUT,
  FORMATS_LABEL,
  validateFileBasics,
} from '@/utils/addContentValidation';
import { uploadFileToLocalStack } from '@/utils/localstackUpload';
import type { UploadDisplayFile, UploadFile } from '@/components/ui/uploadFile/types';
import UploadStatusPage, { type UploadResultItem } from './UploadStatusPage';
import TagDocumentsPage, { type TagDocumentItem } from './TagDocumentsPage';

let idCounter = 0;
const createId = () => {
  idCounter += 1;
  return `add-content-file-${idCounter}`;
};

const AddContentPage = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadResults, setUploadResults] = useState<UploadResultItem[] | null>(null);
  const [tagDocuments, setTagDocuments] = useState<TagDocumentItem[] | null>(null);

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

  const canUpload = displayFiles.length > 0;

  const handleUpload = async () => {
    if (displayFiles.length === 0) return;

    const readyFiles = displayFiles.filter((file) => file.status === 'ready');

    setIsUploading(true);
    setUploadMessage(null);
    setUploadResults(
      displayFiles.map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        status: 'success',
      })),
    );

    try {
      await Promise.allSettled(readyFiles.map((item) => uploadFileToLocalStack(item.file)));
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinueToTagging = () => {
    if (!uploadResults) return;
    setTagDocuments(
      uploadResults
        .filter((item) => item.status === 'success')
        .map((item) => ({ id: item.id, name: item.name })),
    );
  };

  return (
    <div className="flex min-h-full flex-col bg-[#F1F5F9]">
      {!uploadResults && (
        <PageHeader
          title="Add Content"
          subtitle="Upload healthcare clinical documents to library and verify compliance standards."
        />
      )}

      {tagDocuments ? (
        <div className="px-6 pb-6 pt-4">
          <TagDocumentsPage documents={tagDocuments} />
        </div>
      ) : uploadResults ? (
        <div className="px-6 pb-6 pt-4">
          <UploadStatusPage items={uploadResults} onContinue={handleContinueToTagging} />
        </div>
      ) : (
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
                <Button
                  disabled={!canUpload || isUploading}
                  isLoading={isUploading}
                  onClick={handleUpload}
                >
                  Upload
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddContentPage;
