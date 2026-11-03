import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { AMP003_APPROVED_VERSION, hallpartnerFooterConfig as config } from '../src/config/hallpartner-footer.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const allLinks = config.groups.flatMap((group) => group.links);

test('AMP-003 config is one compact shared footer, not an extra global CTA', () => {
  assert.equal(AMP003_APPROVED_VERSION, '1.4.0');
  assert.equal(config.variant, 'compact');
  assert.equal(config.brand.name, 'Hallpartner');
  assert.equal(config.groups.length, 2);
  assert.ok(config.groups.every((group) => group.links.length > 0));
  assert.equal(config.contact.primary.href, '/kontakt/');
  assert.equal(new Set(allLinks.map((link) => link.href)).size, allLinks.length);
  assert.ok(!('cookieSettings' in config), 'do not invent a cookie settings feature');
  assert.ok(!('legalName' in config), 'unverified legal identity must not be invented');
  assert.ok(!('legalLinks' in config), 'do not link to nonexistent legal pages');
});

test('every AMP Footer link leads to a real visitor Astro page', async () => {
  for (const link of [
    { href: config.brand.homeHref }, config.contact.primary, ...allLinks,
  ]) {
    assert.match(link.href, /^\/(?:[a-z0-9/-]*\/)?$/, 'unsafe link or inconsistent trailing slash');
    const route = link.href === '/' ? 'index.astro' : join(link.href.slice(1), 'index.astro');
    await access(join(root, 'src', 'pages', route));
  }
  await access(join(root, 'public', config.brand.logoSrc));
});

test('AMP Footer contact values match the provisional visitor contact page', async () => {
  const contact = await readFile(join(root, 'src/pages/kontakt/index.astro'), 'utf8');
  assert.ok(contact.includes(config.contact.email));
  assert.ok(contact.includes(config.contact.phone));
});

test('AMP-003 is the visitor default, prototypes retain legacy Footer, and missing private packages fail fast', async () => {
  const layout = await readFile(join(root, 'src/layouts/HallpartnerDraftLayout.astro'), 'utf8');
  const prep = await readFile(join(root, 'scripts/prepare-amp-footer.mjs'), 'utf8');
  assert.match(layout, /isSite && process\.env\.HALLPARTNER_FOOTER_MODE !== 'legacy'/);
  assert.match(layout, /<Fragment set:html=\{ampFooterHtml\}/);
  assert.match(layout, /<footer class="hp-draft-footer">/);
  assert.match(prep, /await import\('@amelio\/web-platform\/footer'\)/);
  assert.match(prep, /import\.meta\.resolve\('@amelio\/web-platform\/footer\/style\.css'\)/);
  assert.match(prep, /manifest\.version !== AMP003_APPROVED_VERSION/);
  assert.match(prep, /throw new Error\('AMP-003 is not installed/);
  assert.match(prep, /process\.env\.HALLPARTNER_FOOTER_MODE \|\| 'amp-003'/);
});
