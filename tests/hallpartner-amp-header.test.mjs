import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ampHeaderItems, ampHeaderBrand, ampHeaderCTA, ampHeaderTheme } from '../src/config/hallpartner-amp-header.ts';
import { validateHeaderConfig, resolveHeaderTheme } from '@amelio/web-platform/header-menu';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => readFileSync(join(root, p), 'utf8');

test('approved AMP-002 accepts the actual mega-menu and icon configuration', () => {
  assert.doesNotThrow(() => validateHeaderConfig({ variant:'classic-mega-menu', mobileToggleAppearance:'icon', items:ampHeaderItems, brand:ampHeaderBrand, cta:ampHeaderCTA, theme:ampHeaderTheme }));
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
test('retired header views and duplicate page shell are absent', () => {
  for (const path of ['src/pages/prototype', 'src/components/prototype', 'src/layouts/HallpartnerDraftLayout.astro']) {
    assert.equal(existsSync(join(root, path)), false, path);
  }
});
