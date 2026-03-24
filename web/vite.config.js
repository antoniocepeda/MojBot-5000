import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  plugins: [
    {
      name: 'rewrite-routes',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/ops') {
            req.url = '/ops/index.html';
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ops: resolve(__dirname, 'ops/index.html')
      }
    }
  }
});