import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Ensure compatibility with iframe embedding
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        embed: resolve(__dirname, 'embed.html'),
        embedAnalytics: resolve(__dirname, 'embed-analytics.html'),
        unifiedAnalytics: resolve(__dirname, 'unified-analytics.html'),
        landing: resolve(__dirname, 'landing.html'),
        examples: resolve(__dirname, 'integration-examples.html'),
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    // Enable CORS for local development embedding
    cors: true,
    headers: {
      // Allow embedding in iframes
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "frame-ancestors 'self' *",
    },
  },
})

