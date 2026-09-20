import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
    // The custom GitHub Pages domain serves this project from /portfolio/.
    base: '/portfolio/',
    plugins: [
        react()
    ],
    server: {
        host: true,
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false
            },
            '/uploads': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false
            }
        }
    },
    build: {
        target: 'es2020',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.warn', 'console.info']
            },
            mangle: {
                safari10: true
            }
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'animation-vendor': ['gsap'],
                    'three-vendor': ['three']
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
            }
        },
        cssCodeSplit: true,
        sourcemap: false,
        reportCompressedSize: true,
        chunkSizeWarningLimit: 200
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'gsap'],
        exclude: []
    },
    css: {
        devSourcemap: false,
        modules: {
            localsConvention: 'camelCase'
        }
    }
})
