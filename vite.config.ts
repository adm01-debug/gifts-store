import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Resolve configuration with comprehensive path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@api': path.resolve(__dirname, './src/api'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@services': path.resolve(__dirname, './src/services'),
      '@middleware': path.resolve(__dirname, './src/middleware'),
    },
    // Improve module resolution
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    // CommonJS compatibility
    mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
  },

  // Server configuration for development
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    
    // HMR configuration for proper hot module replacement
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },

    // Middleware configuration
    middlewareMode: false,
    
    // Allow modules to be imported from outside root
    fs: {
      allow: ['..'],
    },
  },

  // Preview configuration for production preview
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
  },

  // Build configuration with production-ready optimizations
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: false,
    
    // Output configuration
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,

    // Asset naming configuration
    rollupOptions: {
      output: {
        // Organize chunks by type
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          
          if (chunkInfo.name.includes('vendor')) {
            return 'assets/vendors/[name].[hash].js';
          }
          if (chunkInfo.name.includes('react')) {
            return 'assets/react/[name].[hash].js';
          }
          if (facadeModuleId.includes('components')) {
            return 'assets/components/[name].[hash].js';
          }
          if (facadeModuleId.includes('pages')) {
            return 'assets/pages/[name].[hash].js';
          }
          if (facadeModuleId.includes('utils')) {
            return 'assets/utils/[name].[hash].js';
          }
          
          return 'assets/chunks/[name].[hash].js';
        },

        // Entry file naming
        entryFileNames: 'assets/js/[name].[hash].js',

        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];

          if (/png|jpe?g|gif|tiff|bmp|ico|webp|svg/.test(ext)) {
            return `assets/images/[name].[hash][extname]`;
          }

          if (/woff|woff2|ttf|otf|eot/.test(ext)) {
            return `assets/fonts/[name].[hash][extname]`;
          }

          if (ext === 'css') {
            return `assets/styles/[name].[hash][extname]`;
          }

          return `assets/[name].[hash][extname]`;
        },
      },
    },

    // Improved chunk splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-state': ['zustand', '@reduxjs/toolkit', 'redux', 'react-redux'],
          'vendor-http': ['axios', 'fetch-api'],
          'vendor-utils': ['lodash', 'classnames', 'date-fns'],
          'vendor-ui': ['antd', 'material-ui', 'react-bootstrap'],
        },
      },
    },

    // Terser minification options
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
      format: {
        comments: false,
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    
    // CSS code splitting
    cssCodeSplit: true,

    // Report compressed size
    reportCompressedSize: true,

    // Limit concurrency
    rollupOptions: {
      output: {
        // Optimize dynamic imports
        experimentalMinChunkSize: 20000,
      },
    },
  },

  // Global defines for feature flags and build info
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __DEV__: JSON.stringify(true),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.REACT_APP_API_URL': JSON.stringify(
      process.env.REACT_APP_API_URL || 'http://localhost:3000'
    ),
    'process.env.REACT_APP_ENV': JSON.stringify(
      process.env.REACT_APP_ENV || 'development'
    ),
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      '@reduxjs/toolkit',
      'axios',
    ],
    exclude: ['@vite/client'],
    esbuildOptions: {
      // Enable polyfills for CommonJS compatibility
      define: {
        global: 'globalThis',
      },
      // Support named exports from CommonJS modules
      plugins: [],
    },
  },

  // Experimental features for better performance
  experimental: {
    // Optimized to improved CSS handling in dev
  },
});
