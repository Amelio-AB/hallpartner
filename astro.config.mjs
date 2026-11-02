// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Slutlig domän för canonical och sitemap; preview förblir noindex.
// Domänbytet påverkar metadata, inte hosting eller DNS.
// Arbetsprototyper, gamla Amelio-presentationssidor och 404-dokumentet
// ska inte ingå i den framtida publika XML-sitemap:en.
export default defineConfig({
  site: 'https://hallpartner.se',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        const excludedRoutes = new Set([
          '/404/', '/404.html', '/workshop/', '/vision/', '/projekt/', '/roadmap/', '/offert/',
        ]);
        return !excludedRoutes.has(pathname) && !pathname.startsWith('/prototype/');
      },
    }),
  ],
});
