import { reactRouter } from '@react-router/dev/vite';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import netlifyReactRouter from '@netlify/vite-plugin-react-router';
import netlify from '@netlify/vite-plugin';
import mdx from '@mdx-js/rollup';
import rehypePrettyCode from 'rehype-pretty-code';

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    mdx({
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: 'plastic',
            keepBackground: true,
          },
        ],
      ],
    }),
    reactRouter(),
    tsconfigPaths(),
    netlifyReactRouter(),
    netlify(),
  ],
});
