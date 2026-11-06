import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { ampHeaderItems, ampHeaderBrand, ampHeaderCTA, ampHeaderTheme } from '../src/config/hallpartner-amp-header.ts';
import { validateHeaderConfig, resolveHeaderTheme } from '@amelio/web-platform/header-menu';
import { AMP_SHA, assertAmp } from '../scripts/preview/policy.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => readFileSync(join(root, p), 'utf8');

test('approved AMP-002 accepts the actual mega-menu and icon configuration', () => {
  assert.doesNotThrow(() => validateHeaderConfig({ variant:'classic-mega-menu', navigationAppearance:'spacious', mobileToggleAppearance:'icon', items:ampHeaderItems, brand:ampHeaderBrand, cta:ampHeaderCTA, theme:ampHeaderTheme }));
  assert.equal(resolveHeaderTheme(ampHeaderTheme).corrections.length, 0);
  assert.equal(ampHeaderBrand.logoSrc, '/images/logo_text_white.png');
});
test('all AMP header links reach real visitor routes', () => {
  const links = ampHeaderItems.flatMap(item => [
    ...(item.href ? [item.href] : []),
    ...((item.groups || []).flatMap(group => group.links.map(link => link.href))),
    ...(item.featured ? [item.featured.href] : []),
  ]).concat(ampHeaderCTA.href);
  for (const href of links) {
    assert.match(href, /^\/(?:[a-z0-9-]+\/)*$/);
    assert.ok(existsSync(join(root, 'src/pages', href === '/' ? 'index.astro' : href.slice(1) + 'index.astro')), href);
  }
});
test('all visitor pages use the real AMP header with a server-rendered fallback', () => {
  const layout = read('src/layouts/HallpartnerSiteLayout.astro');
  const header = read('src/components/SiteHeader.astro');
  assert.match(layout, /<SiteHeader overlayHero=\{isHome\}/);
  assert.doesNotMatch(layout, /HallpartnerDraftLayout|hp-nav-toggle/);
  assert.match(header, /import \{ mountHeaderMenu \} from '@amelio\/web-platform\/header-menu'/);
  assert.match(header, /@amelio\/web-platform\/header-menu\/style\.css/);
  assert.match(header, /variant: 'classic-mega-menu'/);
  assert.match(header, /navigationAppearance: 'spacious'/);
  assert.match(header, /mobileToggleAppearance: 'icon'/);
  assert.match(header, /currentPath: window\.location\.pathname/);
  assert.match(header, /heroTone: 'dark'/);
  assert.match(header, /fallback\.hidden = true/);
  assert.match(header, /fallback\.hidden = false/);
  assert.match(header, /id="hp-amp-header-fallback"/);
  assert.match(header, /aria-label="Huvudnavigation"/);
  assert.doesNotMatch(header, /hm__toggle-line|URLSearchParams/);
  assert.match(layout, /name="robots" content="noindex,nofollow"/);
});
test('the installed runtime matches the reviewed AMP source, including unchanged products', () => {
  const fixture = JSON.parse(read('tests/fixtures/amp002-upgrade-sources.json'));
  assert.equal(AMP_SHA, fixture.approvedSha);
  assertAmp();
  for (const [path, expected] of Object.entries(fixture.approved)) {
    // Git on Windows checks out CRLF; no other source differences are normalized.
    const source = read('node_modules/@amelio/web-platform/' + path).replaceAll('\r\n', '\n');
    assert.equal(createHash('sha256').update(source).digest('hex'), expected, path);
  }
});
test('retired header views and duplicate page shell are absent', () => {
  for (const path of ['src/pages/prototype', 'src/components/prototype', 'src/layouts/HallpartnerDraftLayout.astro']) {
    assert.equal(existsSync(join(root, path)), false, path);
  }
});

test('Hallpartner menu descriptions and local hall icons stay in mega panel', () => {
  const css = read('src/styles/hallpartner-amp-header.css');
  const halls = ampHeaderItems.find(item => item.label === 'Hallar');
  assert.equal(halls?.groups?.length, 2);
  const links = halls.groups.flatMap(group => group.links);
  assert.equal(links.length, 6);
  for (const item of links) {
    assert.ok(item.description?.length > 12, item.label);
    const slug = item.href.split('/').filter(Boolean).at(-1);
    assert.ok(existsSync(join(root, 'public/icons/halls', slug + '.svg')), slug);
    assert.ok(css.includes('/icons/halls/' + slug + '.svg'), slug);
  }
  assert.match(css, /\.hm__sublink:focus-visible/);
  assert.match(css, /\.hm__groups--mega \.hm__sublink::before/);
  assert.ok(css.includes('.hm__groups--mega .hm__sublink::after'));
  assert.ok(css.includes('transform: scaleX(0)'));
  assert.ok(css.includes('transform-origin: left center'));
  assert.ok(css.includes('transition: transform .24s cubic-bezier(.25,.8,.25,1)'));
  assert.ok(css.includes('transform: scaleX(1)'));
  assert.ok(css.includes('background: transparent'));
  assert.ok(!css.includes('background: #DAE6D9'));
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'));
  const detail = read('src/styles/hallpartner-hall-detail.css');
  assert.match(detail, /\.hp-detail__crumbs::before/);
  assert.match(detail, /background: #153129/);
  assert.match(detail, /width: 100vw/);
});
