/** Per-file validation outcome from initiate (006-add-content spec). */
export type LibraryUploadInitiateStatus = 'ready' | 'review' | 'rejected';

/** Job status while complete is processed asynchronously (poll until terminal). */
export type LibraryUploadJobStatus = 'processing' | 'ready' | 'failed';

export type UploadInitiateFileInput = {
  fileName: string;
  contentType: string;
  sizeBytes: number;
};

export type UploadInitiateItem = {
  uploadId: string | null;
  fileName: string;
  objectKey?: string;
  uploadUrl?: string;
  status: LibraryUploadInitiateStatus;
  rejectReason: string | null;
};

export type UploadInitiateResponse = {
  uploads: UploadInitiateItem[];
};

export type UploadCompleteRequest = {
  uploadId: string;
  objectKey: string;
};

export type LibraryDocumentSummary = {
  id: string;
  title: string;
  specialties: string[];
  documentType: string;
  version: string;
  addedAt: string;
  lastScannedAt: string | null;
  highestRisk: string | null;
  findings: number | null;
};

/** Sync complete (201) or async hand-off (202) — async uses GET status polling. */
export type UploadCompleteResponse =
  | { status: 'ready'; document: LibraryDocumentSummary }
  | { status: 'processing'; uploadId: string };

export type UploadStatusResponse = {
  uploadId: string;
  status: LibraryUploadJobStatus;
  document: LibraryDocumentSummary | null;
  errorMessage: string | null;
};
