import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const layout = readFileSync('src/layouts/HallpartnerSiteLayout.astro', 'utf8');
const header = readFileSync('src/styles/hallpartner-amp-header.css', 'utf8');

test('Rajdhani SemiBold 600 loads in the existing Google Fonts link', () => {
  assert.match(layout, /family=Rajdhani:wght@600&family=Saira:wght@600/);
  assert.equal((layout.match(/fonts\.googleapis\.com\/css2/g) ?? []).length, 1);
  assert.match(layout, /--hp-heading-font: 'Saira'/);
  assert.match(layout, /--hp-body-font: 'Manrope'/);
});

test('Only menu typography changes, with CTA, sizing and interactions preserved', () => {
  assert.match(header, /--hp-nav-font: 'Rajdhani', Inter/);
  assert.match(header, /\.hp-amp-site-header \.hm \{ --hm-font: Inter,/,
    'Preserve AMP default for secondary descriptions and controls');
  assert.match(layout, /#hp-amp-header-target \.hm__cta/,
    'Header CTA must keep the separately approved Saira rule');
  const section = header.slice(header.indexOf('HP-072 — menu typography experiment'));
  assert.ok(section.length > 100);
  for (const selector of [
    '.hm__nav-link', '.hm__disclosure', '.hm__sublink', '.hm__group-heading',
    '.hm__mobile-link', '.hm__mobile-overview',
    '.hm__mobile-details > summary'
  ]) assert.ok(section.includes(selector), 'Missing menu scope: ' + selector);
  assert.match(section, /font-family: var\(--hp-nav-font\);\s*font-weight: 600;/);
  assert.match(section, /\.hm__description \{\s*font-family: Inter/);
  assert.match(section, /\.hp-draft-nav a:not\(\.hp-draft-nav__cta\)/);
  assert.doesNotMatch(section, /(?:font-size|padding|margin|width|height|gap|border|display|transform|transition)\s*:/,
    'Do not change menu layout or interactions');
  assert.doesNotMatch(section, /\.hm__cta\s*[,{]/,
    'Saira CTA must remain outside the Rajdhani selectors');
  assert.match(layout, /#hp-amp-header-target \.hm__cta/);
});
