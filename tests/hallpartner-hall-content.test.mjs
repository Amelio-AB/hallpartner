import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const pages = [
  ['lagerhall', 'lagerbehov'],
  ['maskinhall', 'maskinernas-behov'],
  ['ridhus', 'ridhus-verksamhet'],
  ['plathall', 'plathall-begrepp'],
  ['isolerad-hall', 'isolering-behov'],
  ['talthall', 'talthall-utforande'],
];
const titles = new Set();
for (const [slug, anchor] of pages) {
  test(`hallundersida ${slug} har eget erbjudande, offert och väg till byggprocessen`, () => {
    const html = readFileSync(new URL(`../src/pages/stalhallar/${slug}/index.astro`, import.meta.url), 'utf8');
    const h1 = html.match(/<h1[^>]+>([\s\S]*?)<\/h1>/)?.[1] ?? '';
    assert.ok(h1.length > 10);
    assert.ok(!titles.has(h1), `duplicerad huvudrubrik: ${slug}`);
    titles.add(h1);
    assert.ok(html.includes('id="' + anchor + '"'));
    assert.ok(html.includes('totalentreprenad'));
    assert.ok(html.includes('driftklar'));
    assert.equal(html.split('href={quoteHref}').length-1, 2);
    assert.ok(html.includes('href="/sa-gar-det-till/"'));
    assert.ok(html.includes('href={contactHref}'));
    assert.ok(html.includes('offerten'));
  });
}
test('tälthall lovas inte vara bygglovsfri', () => {
  const s = readFileSync(new URL('../src/pages/stalhallar/talthall/index.astro', import.meta.url), 'utf8');
  assert.ok(s.includes('Är en tälthall alltid bygglovsfri?'));
  assert.ok(s.includes('Nej, det kan inte förutsättas.'));
});
