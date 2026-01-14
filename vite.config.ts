import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nitro } from 'nitro/vite';

// Force Nitro preset to vercel to avoid bun preset during build
process.env.NITRO_PRESET = process.env.NITRO_PRESET || 'vercel';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    tsconfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart(),
    nitro({
      preset: 'vercel',
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
