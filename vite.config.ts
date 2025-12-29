import { reactRouter } from '@react-router/dev/vite';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import netlifyReactRouter from '@netlify/vite-plugin-react-router';
import netlify from '@netlify/vite-plugin';

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    netlifyReactRouter(),
    netlify(),
    {
      name: 'add-server-build-to-input',
      enforce: 'post',
      config(config, { command, isSsrBuild }) {
        if (isSsrBuild && command === 'build') {
          const currentInput = config.build?.rollupOptions?.input;
          console.log('[prerender-fix] Current input:', currentInput);

          if (currentInput && typeof currentInput === 'object') {
            return {
              build: {
                rollupOptions: {
                  input: {
                    ...currentInput,
                    'server-build': 'virtual:react-router/server-build',
                  },
                },
              },
            };
          }
        }
      },
    },
  ],
});
