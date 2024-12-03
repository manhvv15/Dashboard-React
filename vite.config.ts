import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { checker } from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import { writeTheme } from './plugins/write-theme';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const PORT = Number(env.VITE_PORT) || 3000;

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      svgr({
        include: '**/*.svg',
      }),
      checker({
        typescript: true,
      }),
      writeTheme(),
    ],
    server: {
      port: PORT,
      open: mode === 'development',
      proxy: {
        '/api': {
          target: env.VITE_API_GATEWAY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      }
    },
    preview: {
      port: PORT,
    },
    build: {
      target: 'esnext',
    },
  };
});
