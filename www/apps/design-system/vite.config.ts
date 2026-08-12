import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { transformSync } from '@babel/core';
import { reactRouter } from '@react-router/dev/vite';
import stylex from '@stylexjs/unplugin';
import { defineConfig, type Plugin } from 'vite';

const repoRoot = process.env.BOXOPS_REPO_ROOT;
if (!repoRoot) {
  throw new Error('BOXOPS_REPO_ROOT environment variable is not set');
}

const wwwRoot = path.join(repoRoot, 'www');
const relayArtifacts = path.join(wwwRoot, '@repo/relay-artifacts/src/__generated__');

// Resolved from this config rather than passed to Babel as a bare name. Babel resolves plugin names
// against `process.cwd()`, and the gateway app runs this very config through Vite in middleware
// mode — so the cwd is `apps/gateway`, which has no reason to declare a Relay Babel plugin.
const relayBabelPlugin = createRequire(import.meta.url).resolve('babel-plugin-relay');

/**
 * Replaces `vite-plugin-relay`, which invokes `babel-plugin-relay` with no options — so the plugin
 * falls back to the relative `artifactDirectory` in `relay.config.js` and resolves it against the
 * importing file. That works for app code, but `@boxops/ui` is resolved through a Yarn PnP virtual
 * path, and a relative hop from there lands nowhere. Passing an absolute directory makes the
 * emitted import independent of where the importing module happens to live.
 */
function relayPlugin(): Plugin {
  return {
    name: 'vite:relay-artifacts',
    // Ahead of react-router's babel pass, so this is the only thing that consumes a graphql tag.
    enforce: 'pre',

    // `babel-plugin-relay` always emits a *relative* import, and always writes it without the `.ts`
    // the compiler actually produces — so the specifier names a file that does not exist. Resolving
    // it here is less invasive than teaching the compiler to emit a different extension.
    resolveId(source, importer) {
      if (!importer || !source.endsWith('.graphql')) {
        return undefined;
      }

      const resolved = path.resolve(path.dirname(importer), source) + '.ts';
      return fs.existsSync(resolved) ? resolved : undefined;
    },
    transform(src, id) {
      const file = id.split('?')[0];

      // Only first-party source. Prebundled vendor chunks are large and some contain the string
      // `graphql\`` in their own source, which had Babel re-parsing half a megabyte per chunk for
      // nothing — visible as its "code generator has deoptimised" warning.
      if (id.startsWith('\0') || file.includes('/node_modules/') || file.includes('/.vite/')) {
        return undefined;
      }

      if (!/\.(t|j)sx?$/.test(file) || !src.includes('graphql`')) {
        return undefined;
      }

      const out = transformSync(src, {
        plugins: [[relayBabelPlugin, { artifactDirectory: relayArtifacts }]],
        parserOpts: { plugins: ['typescript', 'jsx'] },
        babelrc: false,
        configFile: false,
        code: true,
        filename: id,
        sourceMaps: true,
      });

      if (!out?.code) {
        throw new Error(`vite:relay-artifacts: failed to transform ${id}`);
      }

      return { code: out.code, map: out.map };
    },
  };
}

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
        '@boxops/ui/palette.stylex': path.join(wwwRoot, '@boxops/ui/src/palette.stylex.ts'),
        '@boxops/ui/themes.stylex': path.join(wwwRoot, '@boxops/ui/src/themes.stylex.ts'),
        '@boxops/ui/MetadataList/vars.stylex': path.join(wwwRoot, '@boxops/ui/src/MetadataList/vars.stylex.ts'),
      },
    }),
    relayPlugin(),
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
    // Crawl the app (and through it @boxops/ui) at server start so every dependency is pre-bundled
    // before the first request. Left to discover them mid-load, Vite aborts the in-flight module
    // scripts and issues an "optimized dependencies changed" reload; that load comes back with the
    // SSR markup intact but React never hydrated — the page looks correct while nothing is
    // interactive and no portals (tooltips, popovers, the editor action bar) ever mount.
    // @boxops/ui's own deps (lexical, @base-ui/react) cannot go in `include`: under Yarn PnP they
    // are not resolvable from this workspace, so they have to be reached by scanning instead.
    entries: ['app/entry.client.tsx', 'app/root.tsx', 'app/routes/**/*.tsx'],
    include: ['react-relay', 'relay-runtime', '@stylexjs/stylex', '@phosphor-icons/react'],
  },
});
