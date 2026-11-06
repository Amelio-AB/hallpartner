/**
 * Read-only preflight for replacement-ready Hallpartner hall photography.
 * Usage: node scripts/hall-image-preflight.mjs <directory-containing-six-PNGs>
 * NO uploads, NO writes, NO external network and NO publication.
 */
import { readFileSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, 'docs/content/hallpartner-ai-image-originals-20261106.json'), 'utf8'));

export function inspectPngHeader(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error('Not a PNG file');
  }
  if (bytes.toString('ascii', 12, 16) !== 'IHDR') throw new Error('PNG IHDR missing');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

export function verifyPng(bytes, filename) {
  const dimensions = inspectPngHeader(bytes);
  if (dimensions.width < 1920 || dimensions.height < 1080) {
    throw new Error(filename + ': too small; need at least 1920x1080, got ' + dimensions.width + 'x' + dimensions.height);
  }
  const ratio = dimensions.width / dimensions.height;
  if (Math.abs(ratio - 16 / 9) > 0.045) throw new Error(filename + ': aspect ratio is not approximately 16:9');
  if (bytes.length > 20_000_000) throw new Error(filename + ': original exceeds 20 MB');
  return { ...dimensions, bytes: bytes.length };
}

export function main(directory) {
  if (!directory) {
    throw new Error('Specify the folder containing six downloaded originals (lagerhall.png etc.).');
  }
  const abs = resolve(directory);
  const checks = manifest.images.map(image => {
    if (basename(image.expectedOriginal) !== image.expectedOriginal) throw new Error('Unsafe image filename');
    const full = join(abs, image.expectedOriginal);
    const size = statSync(full).size;
    if (size > 20_000_000 || size < 1000) throw new Error('Unreasonable image file size: ' + image.expectedOriginal);
    return { slug: image.slug, source: image.expectedOriginal, ...verifyPng(readFileSync(full), image.expectedOriginal), output: image.targetFile };
  });
  for (const file of checks) console.log(file.source + ' PASS ' + file.width + 'x' + file.height + ' -> ' + file.output);
  console.log(checks.length + ' originalbilder godkända för fortsatt bildgranskning (INGEN publicering).');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv[2]); } catch (error) { console.error('IMAGE PREFLIGHT FAILED: ' + error.message); process.exitCode = 1; }
}
