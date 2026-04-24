import path from 'path';

import { reactRouter } from '@react-router/dev/vite';
import stylex from '@stylexjs/unplugin';
import { defineConfig } from 'vite';
import relay from 'vite-plugin-relay';

const repoRoot = process.env.BOXOPS_REPO_ROOT;
if (!repoRoot) {
  throw new Error('BOXOPS_REPO_ROOT environment variable is not set');
}

const wwwRoot = path.join(repoRoot, 'www');

export default defineConfig({
  // base: '/design-system/',
  plugins: [
    stylex.vite({
      useCSSLayers: true,
      treeshakeCompensation: true,
      unstable_moduleResolution: {
        type: 'commonJS',
      },
      aliases: {
        '@boxops/ui/tokens.stylex': path.join(wwwRoot, '@boxops/ui/src/tokens.stylex.ts'),
        '@boxops/ui/MetadataList/vars.stylex': path.join(wwwRoot, '@boxops/ui/src/MetadataList/vars.stylex.ts'),
      },
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
