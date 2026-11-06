import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const page = readFileSync(new URL('../src/pages/sa-gar-det-till/index.astro', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles/hallpartner-info.css', import.meta.url), 'utf8');

test('kundresan har sju steg med konkret information till båda parter', () => {
  assert.equal((page.match(/^    hallpartner:/gm) ?? []).length, 7);
  assert.equal((page.match(/^    customer:/gm) ?? []).length, 7);
  assert.match(page, /Från idé till <em>nyckelfärdig hall/);
  assert.match(page, /helt driftklar hall/);
});

test('offertflödet länkas utan ändring av mottagningen', () => {
  assert.equal((page.match(/href="\/offert\/"/g) ?? []).length, 2);
  assert.match(page, /href="\/kontakt\/"/);
});

test('verifierade myndighets- och avtalslänkar finns på sidan', () => {
  const hosts = ['www.boverket.se', 'www.upphandlingsmyndigheten.se', 'www.av.se'];
  const addresses = [...page.matchAll(/href: '(https:\/\/[^']+)'/g)].map((match) => match[1]);
  assert.equal(addresses.length, 4);
  assert.deepEqual(new Set(addresses.map((url) => new URL(url).host)), new Set(hosts));
  assert.match(page, /slutbesked\/"/);
  assert.match(page, /ABT 06/);
  assert.match(page, /inte att organisationerna/);
});

test('gamla ankarmål bevaras och källsektionen fungerar på mobil', () => {
  for (const id of ['projekt-forberedelser', 'projekt-ansvar', 'projekt-regler']) {
    assert.ok(page.includes(`id="${id}"`));
  }
  assert.match(css, /hp-info--process \.hp-info__resource-list/);
  assert.match(css, /max-width: 740px/);
});
