import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 從環境變數讀取
const API_KEY = process.env.API_KEY || '';
const FIREBASE_CONFIG = process.env.FIREBASE_CONFIG || '';

export default defineConfig({
  plugins: [react()],
  base: './', // 相容 GitHub Pages
  define: {
    'process.env.API_KEY': JSON.stringify(API_KEY),
    'process.env.FIREBASE_CONFIG': JSON.stringify(FIREBASE_CONFIG)
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
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