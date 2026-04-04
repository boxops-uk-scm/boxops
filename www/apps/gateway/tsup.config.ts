import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['server.ts'],
  target: 'es2023',
  format: ['esm'],
  platform: 'node',
  clean: true,
  external: ['fs', 'path'],
});
