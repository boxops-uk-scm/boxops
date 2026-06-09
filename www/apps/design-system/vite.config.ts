import path from 'path';
import fs from 'node:fs';

import { reactRouter } from '@react-router/dev/vite';
import stylex from '@stylexjs/unplugin';
import { defineConfig, type Plugin } from 'vite';
import relay from 'vite-plugin-relay';

const repoRoot = process.env.BOXOPS_REPO_ROOT;
if (!repoRoot) {
  throw new Error('BOXOPS_REPO_ROOT environment variable is not set');
}

const wwwRoot = path.join(repoRoot, 'www');

function chunkInputsPlugin(): Plugin {
  return {
    name: 'chunk-inputs',
    apply: 'build',

    generateBundle(_, bundle) {
      const root = process.cwd();

      const report = Object.fromEntries(
        Object.entries(bundle)
          .filter(([, output]) => output.type === 'chunk')
          .map(([fileName, output]) => {
            if (output.type !== 'chunk') throw new Error('unreachable');

            const modules = Object.keys(output.modules)
              .filter((id) => {
                return (
                  path.isAbsolute(id) &&
                  id.startsWith(root) &&
                  !id.includes('node_modules') &&
                  !id.startsWith('\0') &&
                  !id.startsWith('virtual:')
                );
              })
              .map((id) => path.relative(root, id))
              .sort();

            return [
              fileName,
              {
                name: output.name,
                isEntry: output.isEntry,
                isDynamicEntry: output.isDynamicEntry,
                imports: output.imports,
                dynamicImports: output.dynamicImports,
                modules,
              },
            ];
          }),
      );

      fs.mkdirSync('.vite-dump', { recursive: true });
      fs.writeFileSync('.vite-dump/chunk-inputs.json', JSON.stringify(report, null, 2));
    },
  };
}

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
    chunkInputsPlugin(),
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
