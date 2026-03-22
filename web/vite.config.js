import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/', // Use absolute paths for assets so rewrites work properly
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ops: resolve(__dirname, 'ops/index.html')
      }
    }
  }
});