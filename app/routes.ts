import { type RouteConfig, index, route } from '@react-router/dev/routes';
import { routes as mdxRoutes } from 'react-router-mdx/server';

export default [
  index('routes/home.tsx'),
  route('posts', 'routes/posts.tsx'),
  ...mdxRoutes('routes/posts.$slug.tsx'),
  route('projects', 'routes/projects.tsx'),
  route('bookmarks', 'routes/bookmarks.tsx'),
  route('about', 'routes/about.tsx'),
  route('action/set-theme', 'routes/action/set-theme.ts'),
  route('api/test-notion', 'routes/api/test-notion.ts'),
  route('api/comments', 'routes/api/comments.ts'),
  route('api/auth/*', 'routes/api/auth.$.ts'),
] satisfies RouteConfig;
