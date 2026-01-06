
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use environment variables from process.env (injected by GitHub Actions or local environment)
const API_KEY = process.env.API_KEY || '';
const FIREBASE_CONFIG = process.env.FIREBASE_CONFIG || '';

export default defineConfig({
  plugins: [react()],
  base: './', // Essential for GitHub Pages sub-directory compatibility
  define: {
    'process.env.API_KEY': JSON.stringify(API_KEY),
    'process.env.FIREBASE_CONFIG': JSON.stringify(FIREBASE_CONFIG)
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging in this specific setup if needed
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
          charts: ['recharts'],
          ai: ['@google/genai']
        }
      }
    }
  }
});
