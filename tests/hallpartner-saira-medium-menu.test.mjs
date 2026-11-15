import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const layout = readFileSync('src/layouts/HallpartnerSiteLayout.astro', 'utf8');
const header = readFileSync('src/styles/hallpartner-amp-header.css', 'utf8');

test('Saira Medium 500 and SemiBold 600 load without Rajdhani', () => {
  assert.match(layout, /family=Saira:wght@500;600&display=swap/);
  assert.doesNotMatch(layout, /family=Rajdhani/);
  assert.equal((layout.match(/fonts\.googleapis\.com\/css2/g) ?? []).length, 1);
  assert.match(layout, /--hp-heading-font: 'Saira'/);
  assert.match(layout, /--hp-body-font: 'Manrope'/);
});

test('Saira Medium 500 covers all menu links and headings without affecting UI size', () => {
  assert.match(header, /--hp-nav-font: 'Saira', Inter/);
  assert.doesNotMatch(header, /--hp-nav-font: 'Rajdhani'/,
    'Rajdhani must be removed from the actual AMP menu styles');
  const marker = 'HP-072 — Saira Medium 500';
  const section = header.slice(header.indexOf(marker));
  assert.ok(section.length > 100, 'Missing menu-only font rules');

  for (const selector of [
    '.hm__nav-link', '.hm__disclosure', '.hm__sublink', '.hm__group-heading',
    '.hm__menu-intro strong', '.hm__featured', '.hm__mobile-link',
    '.hm__mobile-overview', '.hm__mobile-details > summary'
  ]) assert.ok(section.includes(selector), 'Missing menu selector: ' + selector);

  assert.match(section, /font-family: var\(--hp-nav-font\);\s*font-weight: 500;/);
  assert.match(section, /data-navigation-appearance="spacious"[\s\S]*?font-weight: 500;/,
    'Override the more specific AMP Spacious font-weight rule');
  assert.match(section, /\.hm :is\(\.hm__description, \.hm__menu-intro p\)\s*\{\s*font-family: var\(--hp-body-font\)/,
    'Mega-menu description copy must use the shared Manrope body font');
  assert.match(section, /\.hp-draft-nav a:not\(\.hp-draft-nav__cta\)/);
  // Inspect CSS declarations only: @media (min-width: ...) is a responsive
  // condition, not a forbidden layout change. Still reject real layout rules.
  const declarationBlocks = section.replace(/\/\*[\s\S]*?\*\//g, '').match(/\{[^{}]*\}/g) ?? [];
  assert.ok(declarationBlocks.length >= 3, 'Missing expected navigation CSS rules');
  const layoutDeclarations = /(?:^|[;{])\s*(?:font-size|padding|margin|width|height|min-width|max-width|min-height|max-height|gap|row-gap|column-gap|border|display|transform|transition)\s*:/m;
  for (const block of declarationBlocks) {
    assert.doesNotMatch(block, layoutDeclarations,
      'Menu-only typography cannot alter layout or interactions');
  }
  assert.match('{ padding: 1rem; }', layoutDeclarations,
    'Layout regression guard must still detect forbidden properties');
  assert.doesNotMatch(section, /\.hm__cta\s*[,{]/, 'Do not change the approved Saira 600 CTA');

  assert.match(header, /\.hp-amp-site-header \.hm \{ --hm-font: Inter,/);
  assert.match(layout, /#hp-amp-header-target \.hm__cta/,
    'The header CTA must keep its separate Saira SemiBold 600 rule');
});
