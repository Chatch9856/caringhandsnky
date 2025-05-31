import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'), // Alias @ to the project root
    },
  },
  build: {
    target: 'esnext', // Ensure modern JavaScript features are supported
  },
});
