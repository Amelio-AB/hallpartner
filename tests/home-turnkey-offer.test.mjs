import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const home = readFileSync(new URL('../src/components/home/HallpartnerHome.astro', import.meta.url), 'utf8');
const index = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
const count = (source, phrase) => source.split(phrase).length - 1;

test('startsidan presenterar nyckelfärdiga hallar och avtalsberoende totalentreprenad', () => {
  assert.ok(home.includes('<h1 id="hp-home-title">Nyckelfärdiga hallar.</h1>'));
  assert.ok(home.includes('helt driftklar hall'));
  assert.ok(home.includes('totalentreprenad'));
  assert.ok(home.includes('de installationer som ingår i offerten'));
  assert.ok(home.includes('offerten och avtalet för ditt projekt'));
  assert.ok(index.includes('title="Nyckelfärdiga hallar med totalentreprenad"'));
  assert.ok(index.includes('driftklara hallar'));
});

test('huvudknappen leder till offert och halltyper finns kvar i heron', () => {
  const start = home.indexOf('<section class="hp-home-hero"');
  const end = home.indexOf('</section>', start);
  assert.ok(start >= 0 && end > start);
  const hero = home.slice(start, end);
  assert.ok(hero.includes('href={existingPages.offert}'));
  assert.ok(hero.includes('href="#halltyper"'));
});

test('offert, kontakt och process är nåbara utan ny Javascriptfunktion', () => {
  assert.ok(home.includes("offert: '/offert/'"));
  assert.ok(home.includes("kontakt: '/kontakt/'"));
  assert.ok(home.includes("process: '/sa-gar-det-till/'"));
  assert.equal(count(home, 'href={existingPages.offert}'), 2);
  assert.equal(count(home, 'href={existingPages.process}'), 1);
  assert.ok(home.includes('href="#att-tanka-pa"'));
  assert.ok(home.includes('href={existingPages.kontakt}'));
  assert.ok(home.includes('href="#halltyper"'));
});

test('befintliga hallkort, sidsektioner och bildanvändning bevaras', () => {
  for (const marker of ['hp-home-type-grid', 'hp-home-perspective', 'hp-home-planning', 'hp-home-final', '/images/hallpartner-hero-temporary.webp']) {
    assert.ok(home.includes(marker), 'Missing original section/image: ' + marker);
  }
  for (const key of ['lagerhallar:', 'maskinhallar:', 'ridhus:']) {
    assert.ok(home.includes(key));
  }
});

test('inga löften om bygglov, garantier eller att allt automatiskt ingår', () => {
  assert.ok(!home.includes('garanterat bygglov'));
  assert.ok(!home.includes('allt ingår'));
  assert.ok(!home.includes('garanterad leveranstid'));
});
