import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/leads': {
        target: 'http://localhost:5174',
        changeOrigin: true,
      },
      '/leads-api': {
        target: 'http://localhost:5006',
        changeOrigin: true,
        timeout: 600_000,
        proxyTimeout: 600_000,
      },
    },
  },
  build: {
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline small assets as base64
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('swiper')) {
              return 'vendor-swiper';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
