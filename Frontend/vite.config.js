import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split the framework dependencies (React, React Router) into their own
        // chunk so they cache separately from app code — they change far less
        // often, so returning users keep the cached vendor bundle across app
        // updates. The heavy @zxing barcode libraries are deliberately left out
        // so they stay in the lazily-loaded BarcodeScanner chunk and only load
        // when the camera is actually opened.
        manualChunks(id) {
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
