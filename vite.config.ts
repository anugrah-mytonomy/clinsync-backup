/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api_auth': {
          target: env.VITE_AUTH_API_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api_auth/, ''),
        },
        '/s3': {
          target: env.VITE_S3_ENDPOINT || 'http://localhost:4566',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/s3/, ''),
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/testing/setup.ts'],
      css: true,
      env: {
        VITE_AUTH_API_URL: 'http://localhost:4000',
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        exclude: ['src/mocks/**', 'src/testing/**'],
        thresholds: {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80,
        },
      },
    },
  };
});
