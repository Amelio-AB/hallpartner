/**
 * Verify rendered HTML from npm run build; source-only checks are insufficient.
 * This is a prototype guard, not an end-to-end AMP or accessibility audit.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { draftPageSpecs } from '../src/config/hallpartner-draft-pages.ts';

const dist = new URL('../dist/', import.meta.url).pathname;
const routes = ['', ...draftPageSpecs.map((page) => page.slug)];

for (const slug of routes) {
  const file = join(dist, 'prototype', 'hallpartner', slug, 'index.html');
  assert.ok(existsSync(file), `missing built prototype HTML: ${file}`);
  const html = readFileSync(file, 'utf8');
  assert.match(html, /<meta\s+name="robots"\s+content="noindex,nofollow"/);
  assert.equal((html.match(/<h1(?:\s|>)/gi) ?? []).length, 1, `wrong H1 count: ${file}`);
  assert.equal((html.match(/<header(?:\s|>)/gi) ?? []).length, 1, `duplicate header: ${file}`);
  assert.equal((html.match(/<nav(?:\s|>)/gi) ?? []).length, 1, `duplicate navigation: ${file}`);
  assert.ok(html.includes('Intern arbetsprototyp'), `missing draft marker: ${file}`);
  assert.ok(html.includes('id="main-content"'), `missing main landmark: ${file}`);
  if (slug) {
    assert.ok(html.includes('Ursprungligt fulltextutkast saknas'), `missing source warning: ${file}`);
  }
}

const index = readFileSync(join(dist, 'prototype', 'hallpartner', 'index.html'), 'utf8');
for (const page of draftPageSpecs) {
  assert.ok(index.includes(`/prototype/hallpartner/${page.slug}/`), `index does not link to ${page.slug}`);
}

const sitemapFiles = readdirSync(dist).filter((file) => /^sitemap.*\.xml$/.test(file));
assert.ok(sitemapFiles.length > 0, 'expected an XML sitemap from Astro build');
for (const file of sitemapFiles) {
  const xml = readFileSync(join(dist, file), 'utf8');
  assert.ok(!xml.includes('/prototype/'), `draft route leaked into ${file}`);
}

console.log(`Verified ${routes.length} static prototype pages: one header/navigation/H1, noindex, and no sitemap leaks.`);
