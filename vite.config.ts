import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        chunkSizeWarningLimit: 900,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (!id.includes('node_modules')) {
                return undefined;
              }

              if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('\\react\\') || id.includes('/react/')) {
                return 'react-core';
              }

              if (id.includes('katex')) {
                return 'math-rendering';
              }

              if (id.includes('react-quill-new')) {
                return 'editor';
              }

              if (id.includes('react-player')) {
                return 'video-player';
              }

              if (id.includes('hls.js')) {
                return 'video-hls';
              }

              if (id.includes('dashjs')) {
                return 'video-dash';
              }

              if (id.includes('recharts')) {
                return 'charts';
              }

              if (id.includes('firebase')) {
                return 'firebase';
              }

              if (id.includes('lucide-react')) {
                return 'icons';
              }

              if (id.includes('motion')) {
                return 'motion';
              }

              if (id.includes('@google/genai')) {
                return 'ai-sdk';
              }

              if (id.includes('xlsx')) {
                return 'spreadsheet';
              }

              return undefined;
            },
          },
        },
      }
    };
});
