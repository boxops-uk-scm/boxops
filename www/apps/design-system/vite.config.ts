import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import stylex from '@stylexjs/unplugin';
import relay from 'vite-plugin-relay';

export default defineConfig({
  base: '/design-system/',
  plugins: [
    stylex.vite({
      useCSSLayers: true,
    }),
    relay,
    reactRouter(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  ssr: {
    noExternal: ['react-relay', 'relay-runtime', '@stylexjs/stylex'],
    optimizeDeps: {
      include: ['react-relay', 'relay-runtime', '@stylexjs/stylex'],
      exclude: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
    external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  optimizeDeps: {
    include: ['react-relay', 'relay-runtime', '@stylexjs/stylex'],
  },
});
