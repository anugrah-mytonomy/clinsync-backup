const DEFAULT_BUCKET = 'clinsync-uploads';

const getBucket = () => import.meta.env.VITE_S3_BUCKET || DEFAULT_BUCKET;

const getUploadUrl = (key: string) => {
  const bucket = getBucket();
  return `/s3/${bucket}/${key}`;
};

const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_');

export const buildLibraryObjectKey = (fileName: string) => {
  return `library/${Date.now()}-${sanitizeFileName(fileName)}`;
};

export const uploadFileToLocalStack = async (file: File): Promise<string> => {
  const key = buildLibraryObjectKey(file.name);
  const url = getUploadUrl(key);

  const response = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
  });

  if (!response.ok) {
    throw new Error(
      `LocalStack upload failed (${response.status}). Start it with npm run localstack:up.`,
    );
  }

  return key;
};
