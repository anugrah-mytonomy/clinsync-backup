const UPLOAD_STEP_MS = 150;

export interface SimulateUploadOptions {
  onProgress: (progress: number) => void;
}

export async function simulateFileUpload({ onProgress }: SimulateUploadOptions): Promise<void> {
  let progress = 0;

  while (progress < 100) {
    await new Promise((resolve) => setTimeout(resolve, UPLOAD_STEP_MS));
    progress = Math.min(100, progress + Math.round(15 + Math.random() * 20));
    onProgress(progress);
  }
}
