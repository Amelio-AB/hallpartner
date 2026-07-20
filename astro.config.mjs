// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Presentationssajt för Hallpartner. Se docs/TECHNICAL_SPEC.md.
//
// NOINDEX: Sajten är i presentationsfas och ska inte indexeras av sökmotorer.
// Se public/robots.txt och src/components/SeoHead.astro för noindex-konfigurationen.
// När sajten blir publik: ta bort noindex i robots.txt och SeoHead.astro,
// men behåll sitemap-integrationen nedan.
export default defineConfig({
  site: 'https://hallpartner.amelio.se',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
