import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const layout = readFileSync('src/layouts/HallpartnerSiteLayout.astro', 'utf8');

test('Hallpartner loads only the approved Saira 600 weight alongside Inter', () => {
  assert.match(layout, /family=Saira:wght@600&display=swap/);
  assert.match(layout, /family=Inter:wght@400;500;600;700;800/);
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
