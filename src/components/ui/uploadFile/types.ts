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
