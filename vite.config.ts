import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', 
        changeOrigin: true,
      }
    }
  },
  build: {
    // Esto reduce el tamaño de los chunks y mejora la carga
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          icons: ['lucide-react']
        },
      },
    },
    // Minificación agresiva
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
});