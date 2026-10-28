import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import MultiSelect from '@/components/ui/MultiSelect';
import Select, { type SelectOption } from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import UploadDropzone from '@/components/ui/uploadFile/UploadDropzone';
import type { LibraryDocument } from '@/pages/content-library/types';
import { cn } from '@/utils/cn';
import { formatBytes } from '@/utils/formatBytes';
import fileTextIcon from '@/assets/File_text.svg';
import trashIcon from '@/assets/Trash.svg';

export interface ReplaceDocumentChanges {
  file: File;
  specialties: string[];
  documentType: string;
  whatChanged: string;
}

interface ReplaceDocumentModalProps {
  document: LibraryDocument;
  specialtyOptions: SelectOption[];
  documentTypeOptions: SelectOption[];
  onClose: () => void;
  onReplace: (id: string, changes: ReplaceDocumentChanges) => void;
}

const ACCEPTED_FILE_INPUT = '.docx';
const MAX_FILE_SIZE = 1024 ** 3;
const UPLOAD_TICK_MS = 150;
const UPLOAD_STEP = 4;

const labelClassName = 'mb-1.5 block text-xs font-semibold text-[#0F172A]';

const stripExtension = (fileName: string) => fileName.replace(/\.[^.]+$/, '');

const ReplaceDocumentModal = ({
  document,
  specialtyOptions,
  documentTypeOptions,
  onClose,
  onReplace,
}: ReplaceDocumentModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [specialties, setSpecialties] = useState<string[]>(document.specialties);
  const [documentType, setDocumentType] = useState(document.documentType);
  const [whatChanged, setWhatChanged] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const isUploading = uploadProgress !== null;
  const canReplace = file !== null && specialties.length > 0 && documentType !== '';

  // Mock upload: ticks progress to 100% and then hands the result back to the page.
  useEffect(() => {
    if (uploadProgress === null) return;
    if (uploadProgress >= 100) {
      if (file) onReplace(document.id, { file, specialties, documentType, whatChanged });
      return;
    }
    const timer = setTimeout(
      () => setUploadProgress((current) => Math.min(100, (current ?? 0) + UPLOAD_STEP)),
      UPLOAD_TICK_MS,
    );
    return () => clearTimeout(timer);
  }, [uploadProgress, file, document.id, specialties, documentType, whatChanged, onReplace]);

  const handleFilesSelected = (files: FileList) => {
    const selected = files[0];
    if (!selected.name.toLowerCase().endsWith('.docx')) {
      setError('Only DOCX files are supported.');
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError('File exceeds the 1 GB limit.');
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleClose = () => {
    if (!isUploading) onClose();
  };

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title="Replace Document"
      subtitle={`Upload a revised version of ${document.title}`}
      width={740}
      closeOnOverlayClick={!isUploading}
      showCloseButton={!isUploading}
      bodyClassName={cn(file && 'bg-[#F1F5F9]')}
      footerClassName={cn(
        isUploading && 'justify-center rounded-b-lg border-[#E5E9EC] bg-[#E2E8F0] py-4',
      )}
      footer={
        isUploading ? (
          <p className="text-sm font-medium text-[#475569]">Processing and uploading document...</p>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose} className="h-10 px-lg py-md">
              Cancel
            </Button>
            <Button
              disabled={!canReplace}
              onClick={() => setUploadProgress(0)}
              className="h-10 min-w-[85px] gap-1 px-lg py-md"
            >
              Replace &amp; Update
            </Button>
          </>
        )
      }
    >
      {file ? (
        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-md rounded-lg bg-background px-4 py-3">
            <img src={fileTextIcon} alt="" className="h-6 w-6 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0F172A]">{file.name}</p>
              <p className="text-xs text-[#64748B]">{formatBytes(file.size)}</p>
            </div>
            {isUploading ? (
              <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-[#007FAA]">
                <Spinner label="Uploading" className="h-3.5 w-3.5" />
                Uploading... {uploadProgress}%
              </span>
            ) : (
              <div className="flex shrink-0 items-center gap-sm">
                <span className="rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-0.5 text-xs font-semibold text-[#16A34A]">
                  Ready
                </span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  aria-label={`Remove ${file.name}`}
                  className="rounded-md p-xs transition-colors hover:bg-surface"
                >
                  <img src={trashIcon} alt="" className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          <fieldset
            disabled={isUploading}
            className={cn(
              'rounded-lg border border-[#E5E9EC] bg-white p-4 transition-opacity',
              isUploading && 'pointer-events-none opacity-50',
            )}
          >
            <h3 className="mb-4 text-sm font-semibold text-[#0F172A]">Document Metadata</h3>

            <div className="mb-4">
              <label htmlFor="replace-document-title" className={labelClassName}>
                Title
              </label>
              <input
                id="replace-document-title"
                type="text"
                value={stripExtension(file.name)}
                readOnly
                disabled
                className="h-9 w-full cursor-not-allowed rounded-[6px] border border-[#E5E9EC] bg-[#F1F5F9] px-3 text-sm text-[#64748B] outline-none"
              />
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="replace-document-specialty" className={labelClassName}>
                  Specialty
                </label>
                <MultiSelect
                  id="replace-document-specialty"
                  fullWidth
                  placeholder="Select specialty"
                  options={specialtyOptions}
                  value={specialties}
                  onChange={setSpecialties}
                  disabled={isUploading}
                />
              </div>
              <div>
                <label htmlFor="replace-document-type" className={labelClassName}>
                  Document Type
                </label>
                <Select
                  id="replace-document-type"
                  fullWidth
                  placeholder="Select document type"
                  options={documentTypeOptions}
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value)}
                  disabled={isUploading}
                />
              </div>
            </div>

            {!isUploading && (
              <div>
                <label htmlFor="replace-document-what-changed" className={labelClassName}>
                  What changed in this version?
                </label>
                <textarea
                  id="replace-document-what-changed"
                  rows={3}
                  value={whatChanged}
                  onChange={(event) => setWhatChanged(event.target.value)}
                  placeholder="e.g., Updated ibuprofen age restriction per current pediatric dosing guidance"
                  className="w-full resize-none rounded-[6px] border border-[#3538392E] bg-[#F8FAFC] px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-[#94A3B8] focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
          </fieldset>
        </div>
      ) : (
        <div className="flex flex-col gap-sm">
          <UploadDropzone
            title="Drag and drop your revised document here"
            formatsLabel={
              <>
                Supported clinical document formats up to{' '}
                <span className="font-semibold text-[#64748B]">1 GB</span>
              </>
            }
            formats={['DOCX']}
            accept={ACCEPTED_FILE_INPUT}
            multiple={false}
            onFilesSelected={handleFilesSelected}
          />
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
    </Modal>
  );
};

export default ReplaceDocumentModal;
