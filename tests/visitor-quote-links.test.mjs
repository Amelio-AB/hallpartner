import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

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
  assert.match(page, /offert:\\s*'\\/offert\\/'/);
  assert.equal((page.match(/href=\\{existingPages\\.offert\\}/g) ?? []).length, 2);
  assert.match(page, /href=\\{existingPages\\.kontakt\\}/);
});

for (const path of hallPages) {
  test(`${path} har offertväg och alternativ för direktkontakt`, () => {
    const page = read(path);
    assert.match(page, /const quoteHref = '\\/offert\\/';/);
    assert.equal((page.match(/href=\\{quoteHref\\}/g) ?? []).length, 2);
    assert.match(page, /href=\\{contactHref\\}/);
    assert.match(page, /Be om offert/);
  });
}
