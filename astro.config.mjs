// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Slutlig domän för canonical och sitemap; preview förblir noindex.
// Domänbytet påverkar metadata, inte hosting eller DNS.
export default defineConfig({
  site: 'https://hallpartner.se',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => new URL(page).pathname !== '/workshop/',
    }),
  ],
});
