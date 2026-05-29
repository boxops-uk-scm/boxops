import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [index('routes/_index.tsx'), route('Home', 'routes/Home.tsx')] satisfies RouteConfig;
