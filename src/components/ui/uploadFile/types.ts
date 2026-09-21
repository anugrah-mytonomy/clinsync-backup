export type UploadFileStatus = 'ready' | 'review' | 'rejected';

export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  basicValid: boolean;
  rejectReason?: string;
}

export interface UploadDisplayFile extends UploadFile {
  status: UploadFileStatus;
  note?: string;
}

export type UploadRenderBlock =
  | { kind: 'ready'; key: string; item: UploadDisplayFile }
  | { kind: 'review-group'; key: string; items: UploadDisplayFile[] }
  | { kind: 'rejected'; key: string; item: UploadDisplayFile };
