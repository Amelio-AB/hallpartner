// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Slutlig domän för canonical och sitemap; preview/prototyper förblir noindex.
export default defineConfig({
  site: 'https://hallpartner.se',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return pathname !== '/workshop/' && !pathname.startsWith('/prototype/');
      },
    }),
  ],
});
