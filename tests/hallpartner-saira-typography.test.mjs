import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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
    '.hp-draft-cta',
    '.hp-contact-hero__action',
  ]) {
    assert.ok(layout.includes(selector), `Missing Saira scope: ${selector}`);
  }
  assert.match(layout, /\.hp-site \.hp-draft-main :is\(\s*button,/);
  assert.match(layout, /font-family: var\(--hp-heading-font\);\s*font-weight: 600/);
  assert.match(layout, /letter-spacing: -0\.01em;/);
  assert.doesNotMatch(layout, /\.hm__nav-item[^{]*\{[^}]*font-family: var\(--hp-heading-font\)/);
});
