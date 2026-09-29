import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { formatBytes } from '@/utils/formatBytes';

export type UploadResultStatus = 'uploading' | 'success';

export interface UploadResultItem {
  id: string;
  name: string;
  size: number;
  status: UploadResultStatus;
}

interface UploadStatusPageProps {
  items: UploadResultItem[];
  onContinue?: () => void;
}

const FileIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8m-6-6a2.4 2.4 0 0 1 1.7.7l3.6 3.6A2.4 2.4 0 0 1 20 8m-6-6v5a1 1 0 0 0 1 1h5M10 9H8m8 4H8m8 4H8"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} />
    <path
      d="m8.5 12 2.5 2.5 4.5-5"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UploadStatusPage = ({ items, onContinue }: UploadStatusPageProps) => {
  const total = items.length;
  const uploadedCount = items.filter((item) => item.status === 'success').length;
  const isUploading = items.some((item) => item.status === 'uploading');

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-sm">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">Upload Complete</h2>
          <p className="mt-0.5 text-xs text-[#5A6065]">
            {uploadedCount} of {total} documents uploaded successfully
          </p>
        </div>
      </div>

      <ul className="mt-4 overflow-hidden rounded-lg border border-[#35383914] bg-white">
        {items.map((item) => {
          return (
            <li
              key={item.id}
              className="flex items-center gap-md border-b border-[#35383914] px-5 py-3 last:border-b-0"
            >
              <FileIcon className="h-5 w-5 shrink-0 text-[#007FAA]" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[#353839]">{item.name}</p>
                <p className="text-[11px] text-[#70767A] font-[400]">{formatBytes(item.size)}</p>
              </div>

              {item.status === 'uploading' && (
                <span className="flex shrink-0 items-center gap-xs text-xs text-muted">
                  <Spinner className="text-current" />
                  Uploading
                </span>
              )}

              {item.status === 'success' && (
                <span className="flex shrink-0 items-center gap-1.5 text-[13px] font-[500] text-[#059669]">
                  <CheckCircleIcon className="h-4 w-4" />
                  Uploaded successfully
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-sm px-1">
        <p className="text-[14px] font-[500] text-[#353839]">{uploadedCount} uploaded</p>
        <Button
          disabled={isUploading || uploadedCount === 0}
          onClick={onContinue}
          className="text-[#FFFFFF]"
        >
          Continue to Tagging
        </Button>
      </div>
    </>
  );
};

export default UploadStatusPage;
