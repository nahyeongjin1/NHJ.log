import type { Config } from '@react-router/dev/config';
import { init } from 'react-router-mdx/server';

const mdx = init({ path: 'content/posts', alias: 'posts' });

export default {
  ssr: true,
  future: {
    v8_middleware: true,
  },
  async prerender() {
    return [
      '/',
      '/posts',
      '/projects',
      '/bookmarks',
      '/about',
      ...(await mdx.paths()),
    ];
  },
} satisfies Config;
