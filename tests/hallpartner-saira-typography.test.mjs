import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const layout = readFileSync('src/layouts/HallpartnerSiteLayout.astro', 'utf8');

test('Hallpartner loads Saira 600 for headings and Manrope 400-700 for body', () => {
  assert.match(layout, /family=Saira:wght@600&display=swap/);
  assert.match(layout, /family=Manrope:wght@400\.\.700/);
  assert.match(layout, /family=Inter:wght@400;500;600;700;800/);
});

test('Manrope is the default body; AMP quote text uses the same font, but menu stays Inter', () => {
  assert.match(layout, /--hp-body-font:\s*'Manrope',\s*Inter/);
  assert.match(layout, /\.hp-site\.hp-draft\s*\{\s*font-family:\s*var\(--hp-body-font\)/);
  assert.match(layout, /\.hp-site \.hp-quote-shell \.qf\s*\{\s*--quote-font-body:\s*var\(--hp-body-font\)/);
  assert.match(layout, /\.hp-site \.hp-draft-header\s*\{\s*font-family:\s*Inter/);
  const ampHeader = readFileSync('src/styles/hallpartner-amp-header.css', 'utf8');
  assert.match(ampHeader, /\.hp-amp-site-header \.hm \{ --hm-font: Inter,/);
  assert.equal((layout.match(/fonts\.googleapis\.com\/css2/g) ?? []).length, 1,
    'Keep Saira, Inter and Manrope on one Google Fonts stylesheet');
});

test('Saira 600 is scoped to H1-H3 and real site action buttons', () => {
  for (const selector of [
    ':is(h1, h2, h3)',
    '#hp-amp-header-target .hm__cta',
    '.hp-draft-nav__cta',
    '.hp-home-button',
    '.hp-home-textlink',
    '.hp-info__button',
    '.hp-info__textlink',
    '.hp-info__person-more',
    '.hp-draft-cta',
    '.hp-contact-hero__action',
    '.hp-stal__button',
    '.hp-stal__text-link',
    '.hp-stal__inline-link',
    '.hp-detail__button',
    '.hp-detail__text-link',
    '.hp-halls-button',
    '.hp-detail__related a',
    '.hp-detail__related-inline a',
    '.af__quick-link',
    '.af--compact .af__group-heading',
  ]) {
    assert.ok(layout.includes(selector), `Missing Saira scope: ${selector}`);
  }
  assert.match(layout, /\.hp-site \.hp-draft-main :is\(\s*button,/);
  assert.match(layout, /font-family: var\(--hp-heading-font\);\s*font-weight: 600/);
  assert.match(layout, /letter-spacing: -0\.01em;/);
  assert.doesNotMatch(layout, /\.hm__nav-item[^{]*\{[^}]*font-family: var\(--hp-heading-font\)/);
});

test('Typography-only release does not alter fonts through content/layout measurements', () => {
  const block = layout.match(/<style is:global>([\s\S]*?)<\/style>/)?.[1];
  assert.ok(block, 'Global typography style missing');
  assert.doesNotMatch(block, /\b(?:font-size|line-height|min-height|max-height|height|width|margin|padding|display|position)\s*:/,
    'Typography-only change must not resize or reposition elements');
});

test('All 16 public Astro page routes use the same Hallpartner layout', () => {
  const paths = [];
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = dir + '/' + entry.name;
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith('.astro')) paths.push(path);
    }
  };
  walk('src/pages');
  assert.equal(paths.length, 16);
  for (const path of paths) {
    assert.match(readFileSync(path, 'utf8'), /import HallpartnerSiteLayout from/,
      'This page does not use shared font system: ' + path);
  }
});
