/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const authApiUrl = env.VITE_AUTH_API_URL || 'http://localhost:4000';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port:5188,
      proxy: {
        '/api_auth': {
          target: authApiUrl,
          changeOrigin: true,
          secure: authApiUrl.startsWith('https://'),
          // Auth service may set Domain=.mytonomy.com; strip so the browser stores
          // refresh_token host-only on localhost (see .specify/specs/001-authentication/contracts/auth.md).
          cookieDomainRewrite: { '*': '' },
          rewrite: (path) => path.replace(/^\/api_auth/, ''),
        },
        '/s3': {
          target: env.VITE_S3_ENDPOINT || 'http://localhost:4566',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/s3/, ''),
        },
        // Vite matches proxy keys by prefix in declaration order, so this must stay
        // after '/api_auth' (which also starts with '/api').
        '/api': {
          target: env.VITE_CLINSYNC_API_URL || 'http://localhost:8001',
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/testing/setup.ts'],
      css: true,
      env: {
        VITE_AUTH_API_URL: 'http://localhost:4000',
        VITE_CLINSYNC_API_URL: 'http://localhost:8001',
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
