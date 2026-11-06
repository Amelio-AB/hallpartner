import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('docs/content/hallpartner-webp-import-manifest-20261106.json', root), 'utf8'));
const component = readFileSync(new URL('src/components/HallConceptImage.astro', root),'utf8');
const pages = manifest.images;

test('en godkänd illustration är kopplad till var och en av de sex undersidorna', () => {
  assert.equal(pages.length, 6);
  assert.equal(new Set(pages.map(x => x.slug)).size, 6);
  for(const photo of pages) {
    const page = readFileSync(new URL('src/pages/stalhallar/' + photo.slug + '/index.astro', root),'utf8');
    assert.ok(page.includes('<HallConceptImage slug="' + photo.slug + '"'));
    assert.ok(page.includes("href={quoteHref}"));
    assert.ok(page.includes('sa-gar-det-till'));
  }
  assert.ok(component.includes("existsSync(join(process.cwd(), 'public', 'images', 'halls', filename))"));
  assert.ok(component.includes('AI-genererad illustration'));
});

test('bilderna är antingen ännu inte importerade eller alla sex exakt importerade', () => {
  const available = pages.filter(photo => existsSync(new URL(photo.path, root)));
  assert.ok(available.length === 0 || available.length === 6, 'Endast en del av bilderna har importerats');
  for(const photo of available) {
    const data = readFileSync(new URL(photo.path, root));
    assert.equal(data.length, photo.bytes, photo.slug + ': annan filstorlek än granskad version');
    assert.equal(createHash('sha256').update(data).digest('hex'), photo.sha256, photo.slug + ': filen ändrades sedan optimeringen');
    assert.equal(data.subarray(0,4).toString(), 'RIFF');
    assert.equal(data.subarray(8,12).toString(), 'WEBP');
    // De godkända WebP-originalen är förlustkomprimerade VP8 med storlek i bildheadern.
    assert.equal(data.subarray(12,16).toString(), 'VP8 ');
    assert.equal(data.readUInt16LE(26) & 0x3fff, 1920);
    assert.equal(data.readUInt16LE(28) & 0x3fff, 1080);
  }
});
