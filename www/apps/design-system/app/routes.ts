import { type RouteConfig, route } from '@react-router/dev/routes';

export default [
  route('button', 'routes/button.tsx'),
  route('text', 'routes/text.tsx'),
  route('heading', 'routes/heading.tsx'),
  route('badge', 'routes/badge.tsx'),
  route('flexbox', 'routes/flexbox.tsx'),
  route('icon', 'routes/icon.tsx'),
  route('button-group', 'routes/buttonGroup.tsx'),
] satisfies RouteConfig;
