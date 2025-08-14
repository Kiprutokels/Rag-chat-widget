import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        embed: resolve(__dirname, 'public/embed.html'),
      },
      output: {
        // Keep JS file names predictable
        entryFileNames: (chunk) => {
          if (chunk.name === 'embed') {
            return 'assets/embed-script.js'
          }
          if (chunk.name === 'main') {
            return 'assets/main.js'
          }
          return 'assets/[name].js'
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
})