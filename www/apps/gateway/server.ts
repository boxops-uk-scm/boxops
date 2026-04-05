import http from 'http';
import path from 'path';

import { createRequestHandler } from '@react-router/express';
import express from 'express';
import * as vite from 'vite';

import type { ServerBuild } from 'react-router';

const app = express();
const server = http.createServer(app);

const designSystemRoot = path.resolve(import.meta.dirname, '../design-system');
const designSystem = await vite.createServer({
  server: {
    middlewareMode: true,
    cors: { origin: '*' },
    allowedHosts: true,
    hmr: {
      server,
    },
  },
  appType: 'custom',
  root: designSystemRoot,
  configFile: path.resolve(designSystemRoot, 'vite.config.ts'),
});

app.use(designSystem.middlewares);

app.all(
  /.*/,
  createRequestHandler({
    build: async () => {
      return (await designSystem.ssrLoadModule('virtual:react-router/server-build')) as ServerBuild;
    },
    getLoadContext() {
      return {
        app: 'design-system',
      };
    },
  }),
);

app.listen(3000, '0.0.0.0', () => {
  console.log('Server listening on http://localhost:3000');
});
