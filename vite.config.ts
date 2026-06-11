import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function normalizeBasePath(value?: string) {
  if (!value || value === '/') return '/';
  if (value === './') return './';
  return `/${value.replace(/^\/+|\/+$/g, '')}/`;
}

export default defineConfig({
  plugins: [react()],
  base: normalizeBasePath(process.env.VITE_BASE_PATH || process.env.BASE_PATH),
});
