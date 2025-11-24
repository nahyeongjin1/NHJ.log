import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('design-test', 'routes/design-test.tsx'),
  route('examples', 'routes/examples.tsx'),
] satisfies RouteConfig;
