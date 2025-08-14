import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
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
                embed: resolve(__dirname, 'src/embed.js'), // your non-React widget script
            },
            output: [
                // Output for main React app (default ESM)
                {
                    format: 'es',
                    entryFileNames: function (chunk) {
                        return chunk.name === 'main'
                            ? 'assets/[name]-[hash].js'
                            : 'assets/[name]-[hash].js';
                    },
                    chunkFileNames: 'assets/[name]-[hash].js',
                    assetFileNames: 'assets/[name]-[hash].[ext]',
                },
                // Output for embed script (IIFE)
                {
                    format: 'iife',
                    entryFileNames: function (chunk) {
                        return chunk.name === 'embed'
                            ? 'assets/embed-script.js'
                            : 'assets/[name]-[hash].js';
                    },
                    name: 'RAGChatWidget', // global variable name
                    chunkFileNames: 'assets/[name]-[hash].js',
                    assetFileNames: 'assets/[name]-[hash].[ext]',
                },
            ],
        },
        minify: true,
        sourcemap: false,
    },
});
