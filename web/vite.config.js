import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // This ensures all generated asset paths are relative
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ops: resolve(__dirname, 'public/ops/index.html')
      }
    }
  }
});