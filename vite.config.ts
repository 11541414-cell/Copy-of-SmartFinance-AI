import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 從環境變數讀取，Vite 編譯時注入
const API_KEY = process.env.API_KEY || '';
const FIREBASE_CONFIG = process.env.FIREBASE_CONFIG || '';

export default defineConfig({
  plugins: [react()],
  base: './', // 確保在 GitHub Pages 子路徑下資源能正確載入
  define: {
    'process.env.API_KEY': JSON.stringify(API_KEY),
    'process.env.FIREBASE_CONFIG': JSON.stringify(FIREBASE_CONFIG)
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // 保留日誌方便除錯
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
          charts: ['recharts'],
        }
      }
    }
  }
});