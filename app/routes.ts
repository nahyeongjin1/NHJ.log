import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('posts', 'routes/posts.tsx'),
  route('projects', 'routes/projects.tsx'),
  route('bookmarks', 'routes/bookmarks.tsx'),
  route('about', 'routes/about.tsx'),
  route('design-test', 'routes/design-test.tsx'),
  route('examples', 'routes/examples.tsx'),
  route('action/set-theme', 'routes/action/set-theme.ts'),
  route('api/test-notion', 'routes/api/test-notion.ts'),
] satisfies RouteConfig;
