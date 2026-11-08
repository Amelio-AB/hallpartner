import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PAGES } from '../scripts/preview/policy.mjs';
import { hallpartnerFooterConfig } from '../src/config/hallpartner-footer.mjs';

const read = path => readFileSync(path, 'utf8');

test('Hallpartner and temporary Amelio preview have separate privacy routes', () => {
  const policy = read('src/pages/integritetspolicy/index.astro');
  const preview = read('src/pages/integritet/index.astro');
  assert.ok(PAGES.includes('integritetspolicy/index.html'));
  assert.ok(PAGES.includes('integritet/index.html'));
  assert.match(policy, /personuppgiftsansvarig.*hallpartners ordinarie webbplats/i);
  assert.match(policy, /hallpartnerContact\.legalName/);
  assert.match(policy, /24 månader/);
  assert.doesNotMatch(policy, /Särskilt om Amelios testmiljö|utvecklingspreview har en separat mottagning/);
  assert.match(policy, /Rutinen får inte beskrivas som redan genomförd/);
  assert.match(policy, /senast inom en månad/);
  assert.match(policy, /uppgifterna ska tas bort senast 24 månader/);
  assert.match(policy, /Google Analytics/);
  assert.match(policy, /samtycke/);
  assert.match(policy, /info@hallpartner\.se|hallpartnerContact\.email/);
  assert.match(preview, /Amelio AB är personuppgiftsansvarig/);
  assert.match(preview, /kontakt@amelio\.se/);
});

test('AMP-003 and legacy Footer link to the Hallpartner policy route', () => {
  assert.deepEqual(hallpartnerFooterConfig.legalLinks, [
    { label: 'Integritetspolicy', href: '/integritetspolicy/' },
  ]);
  const layout = read('src/layouts/HallpartnerSiteLayout.astro');
  assert.match(layout, /href="\/integritetspolicy\/"/);
  assert.match(layout, /ampFooterHtml/);
});

test('policy does not promise existing automatic deletion or active GA', () => {
  const policy = read('src/pages/integritetspolicy/index.astro');
  assert.doesNotMatch(policy, /raderas automatiskt|raderar automatiskt|Google Analytics är aktivt/i);
  assert.doesNotMatch(policy, /cookie-inställningar|cookieinställningar.*href=/i);
  const quote = read('src/pages/offert/index.astro');
  assert.match(quote, /href="\/integritet\/"/);
});
