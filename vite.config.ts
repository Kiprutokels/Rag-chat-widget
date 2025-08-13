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
                embed: resolve(__dirname, 'src/embed.js'),
            },
            output: {
                entryFileNames: function (chunk) {
                    if (chunk.name === 'embed') {
                        return 'assets/embed-script.js';
                    }
                    return 'assets/[name]-[hash].js';
                },
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
            external: [],
        },
        minify: true,
        sourcemap: false,
    },
});
