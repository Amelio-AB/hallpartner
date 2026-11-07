import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const page = readFileSync(new URL('../src/pages/sa-gar-det-till/index.astro', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles/hallpartner-info.css', import.meta.url), 'utf8');
const rights = JSON.parse(readFileSync(new URL('../config/preview-image-rights.json', import.meta.url), 'utf8'));
const heroImage = readFileSync(new URL('../public/images/hero/hallpartner-sa-gar-det-till-hero.webp', import.meta.url));

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

test('processherons konceptillustration är sidavgränsad och endast registrerad för lokal granskning', () => {
  const image = '/images/hero/hallpartner-sa-gar-det-till-hero.webp';
  assert.match(css, /\.hp-info--process \.hp-info__hero/);
  assert.ok(css.includes(`url('${image}')`));
  assert.match(css, /background-size: cover/);
  assert.match(css, /background-position: 62% center/);
  assert.match(css, /background-position: 68% center/);
  assert.match(css, /background-position: 72% center/);
  assert.doesNotMatch(css, /\.hp-info--process \.hp-info__hero\s*\{[^}]*linear-gradient/);
  assert.match(css, /\.hp-info--process \.hp-info__hero::before\s*\{[\s\S]*inset: 0;[\s\S]*background: rgba\(255, 255, 255, \.15\);/);
  assert.match(css, /\.hp-info--process \.hp-info__hero-grid \{ position: relative; z-index: 1; \}/);
  assert.match(css, /\.hp-info--process \.hp-info__hero \.hp-info__textlink\s*\{[\s\S]*color: #F4F4F0 !important;[\s\S]*text-shadow:/);
  assert.equal((css.match(/\.hp-info--process \.hp-info__hero::before/g) ?? []).length, 1);
  assert.match(css, /\.hp-info--process \.hp-info__intro h1 em \{[\s\S]*overflow-wrap: anywhere;/);
  assert.match(css, /@media \(max-width: 980px\)/);
  assert.match(css, /@media \(max-width: 520px\)/);
  assert.doesNotMatch(page, /<img[^>]+hallpartner-sa-gar-det-till-hero/);

  const sha256 = createHash('sha256').update(heroImage).digest('hex');
  assert.equal(sha256, '67785d6385916bf2f14d1815ef35961aece631103a461a3c34c1e4c72e7bde74');
  const approval = rights.approvals.find((entry) => entry.source.endsWith('hallpartner-sa-gar-det-till-hero.webp'));
  assert.equal(approval?.sourceSha256, sha256);
  assert.equal(approval?.outputSha256, sha256);
  assert.equal(approval?.scope, 'local-review-only');
  assert.equal(approval?.origin, 'user-created-ai-concept-illustration');
  assert.equal(approval?.externalLicenseEvidence, null);
});
