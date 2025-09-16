import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react({
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    }),
    {
      name: 'generate-types',
      generateBundle() {
        // Generate comprehensive .d.ts file
        this.emitFile({
          type: 'asset',
          fileName: 'index.d.ts',
          source: `export * from "../src/index";`,
        });
      },
    },
    // Bundle analyzer for optimization insights
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'AIReactSDK',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: id => {
        return [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react-router-dom',
          '@buildlayer/ai-core',
          'zustand',
          'immer',
        ].includes(id);
      },
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'react-router-dom': 'ReactRouterDOM',
          '@buildlayer/ai-core': 'BuildLayerAICore',
          zustand: 'Zustand',
          immer: 'Immer',
        },
        // Optimize chunk splitting (only for non-external modules)
        manualChunks: id => {
          // Only create chunks for internal modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // Optimize build settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
      mangle: {
        safari10: true,
      },
    },
    // Enable source maps for debugging
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  css: {
    postcss: './postcss.config.mjs',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['zustand', 'immer'],
    exclude: ['react', 'react-dom', 'react-router-dom', '@buildlayer/ai-core'],
  },
  // Performance optimizations
  esbuild: {
    target: 'es2020',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
});
