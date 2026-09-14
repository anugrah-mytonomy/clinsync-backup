import * as JSZip from 'jszip';
import * as mammoth from 'mammoth';
import type {
  FileValidationResult,
  SupportedExtension,
  VideoSection,
  ZipEntryResult,
} from '@/types/contentLibrary';

export const SUPPORTED_EXTENSIONS: SupportedExtension[] = ['docx', 'pdf', 'html', 'zip'];

export const ACCEPTED_FILE_INPUT = '.docx,.pdf,.html,.htm,.zip';

const VIDEO_SECTION_REGEX = /Video\s+(\d+)\s*-\s*([^\n:]+):/gi;

export function getSupportedExtension(fileName: string): SupportedExtension | null {
  const match = /\.([a-z0-9]+)$/i.exec(fileName.trim());
  const extension = match?.[1]?.toLowerCase();

  if (!extension) return null;
  if (extension === 'htm') return 'html';
  if ((SUPPORTED_EXTENSIONS as string[]).includes(extension)) return extension as SupportedExtension;

  return null;
}

export function extractVideoSections(text: string): VideoSection[] {
  const sections: VideoSection[] = [];
  const regex = new RegExp(VIDEO_SECTION_REGEX);
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    sections.push({
      id: `video-${match[1]}-${sections.length}`,
      index: Number(match[1]),
      title: match[2].trim(),
    });
  }

  return sections;
}

export function getAnalysisItemCount(result: FileValidationResult | undefined): number {
  if (!result) return 0;

  if (result.zipEntries) {
    return result.zipEntries
      .filter((entry) => entry.valid)
      .reduce((total, entry) => total + (entry.videoSections?.length || 1), 0);
  }

  if (result.videoSections) {
    return result.videoSections.length || 1;
  }

  return result.valid ? 1 : 0;
}

async function validateDocxBuffer(arrayBuffer: ArrayBuffer): Promise<FileValidationResult> {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (!result.value.trim()) {
      return { valid: false, errors: ['The document appears to be empty.'] };
    }

    return { valid: true, errors: [], videoSections: extractVideoSections(result.value) };
  } catch {
    return { valid: false, errors: ['The DOCX file is corrupted or cannot be read.'] };
  }
}

async function validatePdfBuffer(arrayBuffer: ArrayBuffer): Promise<FileValidationResult> {
  const header = new Uint8Array(arrayBuffer.slice(0, 5));
  const signature = String.fromCharCode(...header);

  if (signature !== '%PDF-') {
    return { valid: false, errors: ['The PDF file is corrupted or invalid.'] };
  }

  return { valid: true, errors: [] };
}

function validateHtmlText(text: string): FileValidationResult {
  if (!text.trim()) {
    return { valid: false, errors: ['The HTML file is empty.'] };
  }

  const parserError = new DOMParser().parseFromString(text, 'text/html').querySelector('parsererror');
  if (parserError) {
    return { valid: false, errors: ['The HTML file could not be parsed.'] };
  }

  return { valid: true, errors: [] };
}

function isIgnoredZipEntry(path: string): boolean {
  if (path.includes('__MACOSX/')) return true;

  const baseName = path.split('/').pop() ?? '';
  return baseName.startsWith('.');
}

async function validateBufferByExtension(
  extension: Exclude<SupportedExtension, 'zip'>,
  arrayBuffer: ArrayBuffer,
): Promise<FileValidationResult> {
  if (extension === 'docx') return validateDocxBuffer(arrayBuffer);
  if (extension === 'pdf') return validatePdfBuffer(arrayBuffer);
  return validateHtmlText(new TextDecoder().decode(arrayBuffer));
}

async function validateZipBuffer(file: File): Promise<FileValidationResult> {
  let zip: Awaited<ReturnType<typeof JSZip.loadAsync>>;

  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    return { valid: false, errors: ['The ZIP file is corrupted or cannot be read.'] };
  }

  const entries = Object.values(zip.files).filter(
    (entry) => !entry.dir && !isIgnoredZipEntry(entry.name),
  );

  const zipEntries: ZipEntryResult[] = [];

  for (const entry of entries) {
    const segments = entry.name.split('/').filter(Boolean);
    const fileName = segments[segments.length - 1];
    const depth = segments.length - 1;

    if (depth > 1) {
      zipEntries.push({
        id: entry.name,
        path: entry.name,
        fileName,
        valid: false,
        error: 'File is nested more than one subfolder deep.',
      });
      continue;
    }

    const extension = getSupportedExtension(fileName);
    if (!extension || extension === 'zip') {
      zipEntries.push({
        id: entry.name,
        path: entry.name,
        fileName,
        valid: false,
        error: 'Unsupported file type inside ZIP.',
      });
      continue;
    }

    const buffer = await entry.async('arraybuffer');
    if (buffer.byteLength === 0) {
      zipEntries.push({ id: entry.name, path: entry.name, fileName, valid: false, error: 'File is empty.' });
      continue;
    }

    const innerResult = await validateBufferByExtension(extension, buffer);
    zipEntries.push({
      id: entry.name,
      path: entry.name,
      fileName,
      valid: innerResult.valid,
      error: innerResult.errors[0],
      videoSections: innerResult.videoSections,
    });
  }

  const validEntries = zipEntries.filter((entry) => entry.valid);
  const errors: string[] = [];

  if (zipEntries.length === 0) {
    errors.push('The ZIP file does not contain any supported documents.');
  } else if (validEntries.length === 0) {
    errors.push('None of the documents inside the ZIP file are valid.');
  }

  return { valid: validEntries.length > 0, errors, zipEntries };
}

export async function validateUploadFile(file: File): Promise<FileValidationResult> {
  const extension = getSupportedExtension(file.name);

  if (!extension) {
    return {
      valid: false,
      errors: [
        `Unsupported file type. Supported formats: ${SUPPORTED_EXTENSIONS.map((ext) => ext.toUpperCase()).join(', ')}.`,
      ],
    };
  }

  if (file.size === 0) {
    return { valid: false, errors: ['File is empty.'] };
  }

  if (extension === 'zip') {
    return validateZipBuffer(file);
  }

  const arrayBuffer = await file.arrayBuffer();
  return validateBufferByExtension(extension, arrayBuffer);
}
