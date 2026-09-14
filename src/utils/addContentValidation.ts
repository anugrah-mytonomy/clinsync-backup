const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx'];
const ARCHIVE_EXTENSIONS = ['zip'];

export const SUPPORTED_EXTENSIONS = [...DOCUMENT_EXTENSIONS, ...ARCHIVE_EXTENSIONS];

export const ACCEPTED_FILE_INPUT = SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(',');

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 * 1024;

export const FORMATS_LABEL = 'Supported clinical file formats up to 5 GB';

export function getFileExtension(fileName: string): string | null {
  const match = /\.([a-z0-9]+)$/i.exec(fileName.trim());
  return match?.[1]?.toLowerCase() ?? null;
}

export interface BasicValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateFileBasics(file: File): BasicValidationResult {
  const extension = getFileExtension(file.name);

  if (!extension || !SUPPORTED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      reason: `Rejected with inline reason: Unsupported file format (.${extension ?? 'unknown'}).`,
    };
  }

  if (file.size === 0) {
    return { valid: false, reason: 'Rejected with inline reason: File is empty.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, reason: 'Rejected with inline reason: File exceeds the 5 GB size limit.' };
  }

  return { valid: true };
}
