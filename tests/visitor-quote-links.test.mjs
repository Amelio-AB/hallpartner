import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const count = (source, needle) => source.split(needle).length - 1;

const hallPages = [
  'src/pages/stalhallar/index.astro',
  'src/pages/stalhallar/lagerhall/index.astro',
  'src/pages/stalhallar/maskinhall/index.astro',
  'src/pages/stalhallar/plathall/index.astro',
  'src/pages/stalhallar/isolerad-hall/index.astro',
  'src/pages/stalhallar/ridhus/index.astro',
  'src/pages/stalhallar/talthall/index.astro',
];

test('startsidan leder till offertguiden och behåller direktkontakt', () => {
  const page = read('src/components/home/HallpartnerHome.astro');
  assert.ok(page.includes("offert: '/offert/'"));
  assert.equal(count(page, 'href={existingPages.offert}'), 2);
  assert.ok(page.includes('href={existingPages.kontakt}'));
});

for (const path of hallPages) {
  test(`${path} har offertväg och alternativ för direktkontakt`, () => {
    const page = read(path);
    assert.ok(page.includes("const quoteHref = '/offert/';"));
    assert.equal(count(page, 'href={quoteHref}'), 2);
    assert.ok(page.includes('href={contactHref}'));
    assert.ok(page.includes('Be om offert'));
  });
}
