import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { inspectPngHeader, verifyPng } from '../scripts/hall-image-preflight.mjs';

const manifest = JSON.parse(readFileSync(new URL('../docs/content/hallpartner-ai-image-originals-20261106.json', import.meta.url), 'utf8'));
const pngHeader = (width, height) => {
  const b = Buffer.alloc(1500, 0);
  Buffer.from('89504e470d0a1a0a', 'hex').copy(b, 0);
  b.write('IHDR', 12, 'ascii');
  b.writeUInt32BE(width, 16);
  b.writeUInt32BE(height, 20);
  return b;
};

test('six unique named concept images are documented but not marked as published', () => {
  assert.equal(manifest.images.length, 6);
  assert.equal(new Set(manifest.images.map(x => x.slug)).size, 6);
  assert.equal(new Set(manifest.images.map(x => x.runwayTaskId)).size, 6);
  assert.equal(manifest.status, 'runway_source_png_external_webp_imported_to_draft');
  assert.equal(manifest.webpFilesVersionedOnDraft, true);
  for(const im of manifest.images) {
    assert.equal(im.published, false);
    assert.equal(im.imported, false); // Source-PNG files are intentionally outside Git.
    assert.equal(im.webpImportedToDraft, true);
    assert.match(im.targetFile, /^hallpartner-[a-z-]+-ai-koncept-v01\.webp$/);
  }
});

test('PNG header validator accepts real 2K dimensions without decoding untrusted content', () => {
  assert.deepEqual(inspectPngHeader(pngHeader(2048,1152)), {width:2048,height:1152});
  assert.deepEqual(verifyPng(pngHeader(2048,1152), 'example.png'), {width:2048,height:1152,bytes:1500});
});

test('rejects small, malformed and portrait image sources', () => {
  assert.throws(() => inspectPngHeader(Buffer.from('fake')), /Not a PNG/);
  assert.throws(() => verifyPng(pngHeader(1024,576), 'small.png'), /too small/);
  assert.throws(() => verifyPng(pngHeader(2048,2048), 'square.png'), /aspect ratio/);
});
