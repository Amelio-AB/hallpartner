import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { AMP003_APPROVED_VERSION, hallpartnerFooterConfig as config } from '../src/config/hallpartner-footer.mjs';
import { hallpartnerContact } from '../src/config/hallpartner-people.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const allLinks = config.groups.flatMap(group => group.links);

test('AMP-003 remains compact with only the verified privacy policy legal link', () => {
  assert.equal(AMP003_APPROVED_VERSION, '1.5.0');
  assert.equal(config.variant, 'compact');
  assert.equal(config.brand.name, 'Hallpartner');
  assert.equal(config.groups.length, 2);
  assert.ok(config.groups.every(group => group.links.length > 0));
  assert.equal(config.contact.primary.href, '/kontakt/');
  assert.equal(new Set(allLinks.map(link => link.href)).size, allLinks.length);
  for (const key of ['cookieSettings', 'legalName']) assert.ok(!(key in config));
  assert.deepEqual(config.legalLinks, [{ label: 'Integritetspolicy', href: '/integritetspolicy/' }]);
});
test('every AMP Footer link reaches a real visitor Astro page', async () => {
  for (const link of [{ href:config.brand.homeHref }, config.contact.primary, ...allLinks, ...config.legalLinks]) {
    assert.match(link.href, /^\/(?:[a-z0-9/-]*\/)?$/);
    await access(join(root, 'src/pages', link.href === '/' ? 'index.astro' : link.href.slice(1) + 'index.astro'));
  }
  await access(join(root, 'public', config.brand.logoSrc));
});
test('AMP Footer contact values still match the visitor contact page', async () => {
  const contact = await readFile(join(root, 'src/pages/kontakt/index.astro'), 'utf8');
  assert.equal(config.contact.email, hallpartnerContact.email);
  assert.equal(config.contact.phone, hallpartnerContact.phone);
  assert.ok(contact.includes('hallpartnerContact.email'));
  assert.ok(contact.includes('hallpartnerContact.phone'));
});
test('AMP-003 is the default and its explicit rollback still fails closed on missing packages', async () => {
  const layout = await readFile(join(root, 'src/layouts/HallpartnerSiteLayout.astro'), 'utf8');
  const prep = await readFile(join(root, 'scripts/prepare-amp-footer.mjs'), 'utf8');
  assert.match(layout, /process\.env\.HALLPARTNER_FOOTER_MODE !== 'legacy'/);
  assert.match(layout, /<Fragment set:html=\{ampFooterHtml\}/);
  assert.match(layout, /<footer class="hp-draft-footer">/);
  assert.match(prep, /await import\('@amelio\/web-platform\/footer'\)/);
  assert.match(prep, /import\.meta\.resolve\('@amelio\/web-platform\/footer\/style\.css'\)/);
  assert.match(prep, /manifest\.version !== AMP003_APPROVED_VERSION/);
  assert.match(prep, /throw new Error\('AMP-003 is not installed/);
  assert.match(prep, /process\.env\.HALLPARTNER_FOOTER_MODE \|\| 'amp-003'/);
});
