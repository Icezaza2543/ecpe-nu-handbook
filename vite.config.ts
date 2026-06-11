import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'redirect-base',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '/index.html') {
            res.writeHead(302, { Location: '/ecpe-nu-handbook/' });
            res.end();
          } else if (req.url === '/ecpe-nu-handbook') {
            res.writeHead(302, { Location: '/ecpe-nu-handbook/' });
            res.end();
          } else {
            next();
          }
        });
      }
    }
  ],
  base: "/ecpe-nu-handbook/",
});
