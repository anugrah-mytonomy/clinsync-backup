export type AddContentFileStatus = 'ready' | 'review' | 'rejected';

export interface AddContentFile {
  id: string;
  file: File;
  name: string;
  size: number;
  basicValid: boolean;
  rejectReason?: string;
}

export interface AddContentDisplayFile extends AddContentFile {
  status: AddContentFileStatus;
  note?: string;
}
