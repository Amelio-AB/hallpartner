import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('docs/content/hallpartner-webp-import-manifest-20261106.json', root), 'utf8'));
const component = readFileSync(new URL('src/components/HallConceptImage.astro', root),'utf8');
const pages = manifest.images;

test('en godkänd illustration är kopplad till var och en av de sex undersidorna', () => {
  assert.equal(pages.length, 6);
  assert.equal(new Set(pages.map(x => x.slug)).size, 6);
  for(const photo of pages) {
    const page = readFileSync(new URL('src/pages/stalhallar/' + photo.slug + '/index.astro', root),'utf8');
    assert.ok(page.includes('<HallConceptImage slug="' + photo.slug + '"'));
    const heroStart = page.indexOf('<section class="hp-detail__hero hp-detail__hero--illustrated"');
    const heroEnd = page.indexOf('</section>', heroStart);
    const imageAt = page.indexOf('<HallConceptImage slug="' + photo.slug + '"', heroStart);
    const summary = page.indexOf('class="hp-detail__summary-strip"', heroEnd);
    const aside = page.indexOf('<aside class="hp-detail__hero-aside"', heroEnd);
    const jump = page.indexOf('<nav class="hp-detail__jump"', heroEnd);
    assert.ok(heroStart >= 0 && imageAt > heroStart && imageAt < heroEnd, 'background image in hero: ' + photo.slug);
    assert.ok(summary > heroEnd && aside > summary && jump > aside, 'facts moved below hero: ' + photo.slug);
    assert.equal(page.split('<HallConceptImage slug="' + photo.slug + '"').length - 1, 1);
    assert.ok(page.includes("href={quoteHref}"));
    assert.ok(page.includes('sa-gar-det-till'));
  }
  assert.ok(component.includes("existsSync(join(process.cwd(), 'public', 'images', 'halls', filename))"));
  assert.ok(component.includes('AI-genererad illustration'));
});

test('bilderna är antingen ännu inte importerade eller alla sex exakt importerade', () => {
  const available = pages.filter(photo => existsSync(new URL(photo.path, root)));
  assert.ok(available.length === 0 || available.length === 6, 'Endast en del av bilderna har importerats');
  for(const photo of available) {
    const data = readFileSync(new URL(photo.path, root));
    assert.equal(data.length, photo.bytes, photo.slug + ': annan filstorlek än granskad version');
    assert.equal(createHash('sha256').update(data).digest('hex'), photo.sha256, photo.slug + ': filen ändrades sedan optimeringen');
    assert.equal(data.subarray(0,4).toString(), 'RIFF');
    assert.equal(data.subarray(8,12).toString(), 'WEBP');
    // De godkända WebP-originalen är förlustkomprimerade VP8 med storlek i bildheadern.
    assert.equal(data.subarray(12,16).toString(), 'VP8 ');
    assert.equal(data.readUInt16LE(26) & 0x3fff, 1920);
    assert.equal(data.readUInt16LE(28) & 0x3fff, 1080);
  }
});

test('light gradients on photo backgrounds preserve dark readable hero text', () => {
  const css = readFileSync(new URL('src/styles/hallpartner-hall-detail.css', root),'utf8');
  assert.ok(component.includes('class="hp-detail__hero-media"'));
  assert.ok(component.includes('fetchpriority="high"'));
  assert.match(css, /background: linear-gradient\(90deg,/);
  // Off-white från breadcrumb, hög täckning genom textens centrerade rail.
  assert.match(css, /background: var\(--hp-offwhite, #EBEBE8\)/);
  assert.ok(css.includes('rgba(235,235,232,.97) 0%'));
  assert.ok(css.includes('rgba(235,235,232,.96) calc(50% + 6rem)'));
  assert.ok(css.includes('rgba(235,235,232,.78) calc(50% + 13rem)'));
  assert.ok(css.includes('rgba(235,235,232,0) calc(50% + 28rem)'));
  assert.ok(css.includes('rgba(235,235,232,0) 55%')); // Mobil oförändrad.
  assert.doesNotMatch(css, /rgba\(235,235,232,1(?:\.0+)?\)/);
  assert.doesNotMatch(css, /#F4F4F0 0%/);
  assert.ok(css.includes('object-fit: cover'));
  assert.ok(css.includes('@media (max-width: 640px)'));
  assert.ok(css.includes('hp-detail__summary-strip'));
});

test('hero text keeps the same centered content rail as breadcrumbs on all screen sizes', () => {
  const css = readFileSync(new URL('src/styles/hallpartner-hall-detail.css', root), 'utf8');
  const base = readFileSync(new URL('src/styles/hallpartner-draft.css', root), 'utf8');
  const section = css.match(/\.hp-detail \.hp-detail__hero--illustrated \.hp-detail__hero-grid\s*\{([^}]+)\}/)?.[1];
  assert.ok(section, 'Missing illustrated hero content rule');
  assert.doesNotMatch(section, /(?:^|[;\n])\s*width\s*:/, 'Hero must not override .hp-draft-rail width');
  assert.match(base, /\.hp-draft-rail\s*\{\s*width:\s*min\(/);
  assert.match(base, /margin-inline:\s*auto/);
});
