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

// The homepage must be an actual visual composition, not editorial placeholders.
const homepage = readFileSync(join(dist, 'prototype', 'hallpartner', 'start', 'index.html'), 'utf8');
assert.ok(homepage.includes('En hall börjar med ditt behov.'), 'missing homepage Hero');
assert.ok(homepage.includes('id="halltyper"'), 'missing hall type section');
assert.ok(homepage.includes('id="att-tanka-pa"'), 'missing planning section');
assert.ok((homepage.match(/<img(?:\s|>)/gi) ?? []).length >= 4, 'home prototype needs built image elements');
assert.ok(homepage.includes('aria-controls="hp-proto-nav"'), 'missing accessible mobile menu toggle');
for (const href of homepage.matchAll(/href="(\/prototype\/hallpartner\/[^"#?]*\/)"/g)) {
  const target = join(dist, href[1].slice(1), 'index.html');
  assert.ok(existsSync(target), 'broken local homepage link: ' + href[1]);
}
for (const anchor of ['halltyper', 'att-tanka-pa']) {
  assert.ok(homepage.includes('id="' + anchor + '"'), 'broken homepage anchor: #' + anchor);
}

// The hall overview must be a complete second visual page with working review links.
const halls = readFileSync(join(dist, 'prototype', 'hallpartner', 'hallar', 'index.html'), 'utf8');
assert.ok(halls.includes('Vilken sorts hall behöver du?'), 'missing overview Hero');
for (const id of ['hp-halls-usage', 'hp-halls-structure', 'hp-halls-insulation']) {
  assert.ok(halls.includes('id="' + id + '"'), 'missing overview section: ' + id);
}
assert.ok((halls.match(/<img(?:\s|>)/gi) ?? []).length >= 4, 'hall overview needs built image elements');
for (const slug of ['lagerhallar', 'maskinhallar', 'ridhus', 'talthallar', 'plathallar', 'isolerade-hallar', 'kontakt']) {
  assert.ok(halls.includes('/prototype/hallpartner/' + slug + '/'), 'missing overview link: ' + slug);
  assert.ok(existsSync(join(dist, 'prototype', 'hallpartner', slug, 'index.html')), 'broken overview target: ' + slug);
}

const sitemapFiles = readdirSync(dist).filter((file) => /^sitemap.*\.xml$/.test(file));
assert.ok(sitemapFiles.length > 0, 'expected an XML sitemap from Astro build');
for (const file of sitemapFiles) {
  const xml = readFileSync(join(dist, file), 'utf8');
  assert.ok(!xml.includes('/prototype/'), `draft route leaked into ${file}`);
}

console.log(`Verified ${routes.length} static prototype pages: one header/navigation/H1, noindex, and no sitemap leaks.`);
