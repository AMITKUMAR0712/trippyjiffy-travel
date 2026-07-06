import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/leads/',
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/leads-api': {
        target: 'http://localhost:5006',
        changeOrigin: true,
        timeout: 600_000,
        proxyTimeout: 600_000,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
