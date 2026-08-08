import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    target: 'chrome120',
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('monaco-editor')) return 'monaco';
          if (id.includes('node_modules/react')) return 'react';
        },
      },
    },
  },
  server: {
    port: 5177,
    strictPort: true,
  },
});
