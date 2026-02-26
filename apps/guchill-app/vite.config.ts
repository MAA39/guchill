import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // WebSocket + HTTP を Worker に転送
      '/agent': {
        target: 'http://localhost:8787',
        ws: true, // ← WebSocket Upgrade を転送するために必須
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
});
