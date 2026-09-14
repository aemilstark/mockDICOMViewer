import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  // Resolve path aliases so you can use `@/components/utils` instead of relative paths
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Production build configurations
  build: {
    outDir: 'dist',          // Where the compiled production files go
    minify: 'esbuild',       // Fast minification using esbuild
    sourcemap: true,         // Helps with debugging production errors
  },

  // Development server configurations
  server: {
    port: 3000,              // Changes default port from 5173 to 3000
    open: true,              // Automatically opens your browser on server start
  },
})