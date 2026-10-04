import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isPortfolioBuild = mode === 'portfolio';
  const isLandingMode = mode === 'landing';

  return {
    // Landing Page and Portfolio builds have separate public roots and outputs.
    base: isPortfolioBuild ? '/portfolio/' : '/',
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        // In combined local development, keep both independent apps on one
        // browser origin while the Portfolio Vite server remains on port 5173.
        ...(isLandingMode ? {
          '/portfolio': {
            target: 'http://127.0.0.1:5173',
            changeOrigin: false,
            ws: true,
          },
        } : {}),
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: isPortfolioBuild ? 'dist-portfolio' : 'dist-main',
      target: 'es2020',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.warn', 'console.info'],
        },
        mangle: {
          safari10: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'animation-vendor': ['gsap'],
            'three-vendor': ['three'],
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 200,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'gsap'],
      exclude: [],
    },
    css: {
      devSourcemap: false,
      modules: {
        localsConvention: 'camelCase',
      },
    },
  };
});
