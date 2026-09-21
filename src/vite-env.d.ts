/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'development' | 'stage' | 'production';
  readonly VITE_AUTH_API_URL: string;
  readonly VITE_S3_ENDPOINT?: string;
  readonly VITE_S3_BUCKET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@/playground' {
  import type { ComponentType } from 'react';

  export const Playground: ComponentType;
}
