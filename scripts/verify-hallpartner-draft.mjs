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

// Check links/anchors on EVERY prototype route, not just the finished visual pages.
// Verify destinations against generated output instead of merely matching route lists.
const builtHtml = new Map(
  routes.map((slug) => [slug, readFileSync(join(dist, 'prototype', 'hallpartner', slug, 'index.html'), 'utf8')]),
);
const ids = new Map(routes.map((slug) => [
  slug,
  [...builtHtml.get(slug).matchAll(/\\sid="([^"]+)"/g)].map((match) => match[1]),
]));
for (const slug of routes) {
  const html = builtHtml.get(slug);
  const existingIds = ids.get(slug);
  assert.equal(new Set(existingIds).size, existingIds.length, 'duplicate id on prototype route: ' + (slug || 'index'));
  for (const [, rawHref] of html.matchAll(/\\shref="([^"]*)"/g)) {
    if (!rawHref.startsWith('#') && !rawHref.startsWith('/prototype/hallpartner/')) continue;
    const target = new URL(rawHref, 'https://prototype.example/prototype/hallpartner/' + slug + '/');
    const routePrefix = '/prototype/hallpartner/';
    assert.ok(target.pathname.startsWith(routePrefix), 'prototype href escaped route root: ' + rawHref);
    const targetSlug = target.pathname.slice(routePrefix.length).replace(/\\/$/, '');
    assert.ok(routes.includes(targetSlug), 'unbuilt prototype link on ' + (slug || 'index') + ': ' + rawHref);
    assert.ok(existsSync(join(dist, 'prototype', 'hallpartner', targetSlug, 'index.html')),
      'missing linked HTML on ' + (slug || 'index') + ': ' + rawHref);
    if (target.hash) {
      const anchor = decodeURIComponent(target.hash.slice(1));
      assert.ok(ids.get(targetSlug).includes(anchor),
        'missing target anchor on ' + (slug || 'index') + ': ' + rawHref);
    } else {
      assert.notEqual(rawHref, '#', 'empty hash link on ' + (slug || 'index'));
    }
  }

  // HPD-017: no zero-padded decorative numbers in headings. Genuine process
  // sequences belong in an explicit ordered list, not in visual heading badges.
  for (const [, heading] of html.matchAll(/<h[1-6]\\b[^>]*>([\\s\\S]*?)<\\/h[1-6]>/gi)) {
    const content = heading.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/g, ' ').trim();
    assert.doesNotMatch(content, /^0[1-9]\\b/, 'decorative heading number in ' + (slug || 'index') + ': ' + content);
  }
}

// The temporary approved concept image must remain a small, real WebP asset.
// It is not evidence of a completed Hallpartner building.
const heroAsset = join(dist, 'images', 'hallpartner-hero-temporary.webp');
assert.ok(existsSync(heroAsset), 'approved temporary hero asset is missing from build');
const webp = readFileSync(heroAsset);
assert.ok(webp.length > 1000 && webp.length < 350_000, 'hero WebP asset too large/invalid');
assert.equal(webp.toString('ascii', 0, 4), 'RIFF', 'hero asset lacks RIFF header');
assert.equal(webp.toString('ascii', 8, 12), 'WEBP', 'hero asset lacks WebP signature');

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

// The storage-hall page has its own visual composition, not generic editorial placeholders.
const storage = readFileSync(join(dist, 'prototype', 'hallpartner', 'lagerhallar', 'index.html'), 'utf8');
assert.ok(storage.includes('Mer plats för det som behöver förvaras.'), 'missing storage page hero');
for (const id of ['hp-storage-needs', 'hp-storage-flow', 'hp-storage-next']) {
  assert.ok(storage.includes('id="' + id + '"'), 'missing storage section: ' + id);
}
assert.ok((storage.match(/<img(?:\s|>)/gi) ?? []).length >= 2, 'storage page needs two rendered images');
assert.ok(storage.includes('Ursprungligt fulltextutkast saknas'), 'storage page must disclose missing original copy');
assert.ok(storage.includes('noindex,nofollow'), 'storage page must not be indexable');
for (const slug of ['hallar', 'kontakt']) {
  const href = '/prototype/hallpartner/' + slug + '/';
  assert.ok(storage.includes(href), 'missing storage link: ' + href);
  assert.ok(existsSync(join(dist, 'prototype', 'hallpartner', slug, 'index.html')), 'broken storage target: ' + href);
}

// Maskinhallar has a dedicated visitor-facing composition, not generic editorial placeholders.
const machines = readFileSync(join(dist, 'prototype', 'hallpartner', 'maskinhallar', 'index.html'), 'utf8');
assert.ok(machines.includes('Plats för maskiner. Utrymme för arbetet.'), 'missing machine hall Hero');
for (const id of ['hp-machines-use', 'hp-machines-movement', 'hp-machines-questions']) {
  assert.ok(machines.includes('id="' + id + '"'), 'missing machine section: ' + id);
}
assert.ok(machines.split('<img').length - 1 >= 2, 'machine page needs two rendered images');
assert.ok(machines.includes('Ursprungligt fulltextutkast saknas'), 'machine page must disclose unverified copy');
assert.ok(machines.includes('noindex,nofollow'), 'machine page must remain noindex');
for (const slug of ['hallar', 'lagerhallar', 'kontakt']) {
  const href = '/prototype/hallpartner/' + slug + '/';
  assert.ok(machines.includes(href), 'missing machine link: ' + href);
  assert.ok(existsSync(join(dist, 'prototype', 'hallpartner', slug, 'index.html')), 'broken machine target: ' + href);
}

const sitemapFiles = readdirSync(dist).filter((file) => /^sitemap.*\.xml$/.test(file));
assert.ok(sitemapFiles.length > 0, 'expected an XML sitemap from Astro build');
for (const file of sitemapFiles) {
  const xml = readFileSync(join(dist, file), 'utf8');
  assert.ok(!xml.includes('/prototype/'), `draft route leaked into ${file}`);
}

console.log(`Verified ${routes.length} static prototype pages: one header/navigation/H1, noindex, and no sitemap leaks.`);
