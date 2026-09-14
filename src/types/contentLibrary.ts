export type SupportedExtension = 'docx' | 'pdf' | 'html' | 'zip';

export type UploadStatus = 'queued' | 'uploading' | 'success' | 'validation-failed' | 'upload-failed';

export interface VideoSection {
  id: string;
  index: number;
  title: string;
}

export interface ZipEntryResult {
  id: string;
  path: string;
  fileName: string;
  valid: boolean;
  error?: string;
  videoSections?: VideoSection[];
}

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
  videoSections?: VideoSection[];
  zipEntries?: ZipEntryResult[];
}

export interface UploadQueueItem {
  id: string;
  file: File;
  name: string;
  extension: SupportedExtension | null;
  size: number;
  status: UploadStatus;
  progress: number;
  /** Whether the deep "Validate Files" pass has run for this item. */
  validated: boolean;
  validation?: FileValidationResult;
}
