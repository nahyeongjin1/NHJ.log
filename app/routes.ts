import {
  type RouteConfig,
  index,
  route,
  prefix,
} from '@react-router/dev/routes';
import { routes as mdxRoutes } from 'react-router-mdx/server';

export default [
  index('routes/home.tsx'),
  route('posts', 'routes/posts.tsx'),
  ...mdxRoutes('routes/posts.$slug.tsx'),
  route('projects', 'routes/projects.tsx'),
  route('bookmarks', 'routes/bookmarks.tsx'),
  route('about', 'routes/about.tsx'),
  ...prefix('api', [
    route('set-theme', 'routes/api/set-theme.ts'),
    route('test-notion', 'routes/api/test-notion.ts'),
    route('comments', 'routes/api/comments.ts'),
    route('auth/*', 'routes/api/auth.$.ts'),
  ]),
] satisfies RouteConfig;
