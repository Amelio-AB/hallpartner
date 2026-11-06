import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, lstatSync } from 'node:fs';
import { join } from 'node:path';

export const PREVIEW = 'https://hallpartner-se.preview2.inleed.com';
export const PRODUCTION = ['https://hallpartner.se', 'https://www.hallpartner.se'];
export const PROBE_FILE = 'hp-preview-probe-20261103-6de487a.txt';
export const PROBE = 'HALLPARTNER_INLEED_PREVIEW_PROBE_20261103_6de487a';
export const AMP_SHA = '2bde176de3509c2ceb4c1bebdf2e69c48120e4d9';
export const PAGES = ['index.html', '404.html', 'kontakt/index.html', 'offert/index.html', 'offert/tack/index.html', 'integritet/index.html',
  'om-oss/index.html', 'sa-gar-det-till/index.html', 'stalhallar/index.html',
  ...['lagerhall','maskinhall','plathall','isolerad-hall','ridhus','talthall'].map(x => 'stalhallar/' + x + '/index.html')];
export const BLOCKED = /(^|\/)(api|server|prototype|projekt|roadmap|vision|workshop|quote-engine-test|node_modules|docs|visual-review)(\/|$)|(^|\/)\.|\.(php[0-9]?|phtml|phar|env|log|bak|sql|map|md|ya?ml|lock)$/i;
export const IMAGE = /\.(avif|webp|png|jpe?g|gif|svg|ico)$/i;
export const sha256 = value => createHash('sha256').update(value).digest('hex');
export const json = file => JSON.parse(readFileSync(file, 'utf8'));
export function assert(condition, message) { if (!condition) throw new Error(message); }
export function safePath(path) {
  assert(typeof path === 'string' && /^[A-Za-z0-9_./-]+$/.test(path) && !path.startsWith('/') && !path.split('/').some(x => !x || x === '.' || x === '..'), 'Unsafe file path');
  assert(!BLOCKED.test(path), 'Excluded public path: ' + path);
  return path;
}
export function files(root, prefix = '') {
  return readdirSync(root).sort().flatMap(name => {
    const path = prefix + name; const stat = lstatSync(join(root, name));
    assert(!stat.isSymbolicLink(), 'Symlink forbidden: ' + path);
    return stat.isDirectory() ? files(join(root, name), path + '/') : [path];
  });
}
export function assertAmp() {
  const pkg = json('package.json'); const lock = json('package-lock.json'); const installed = json('node_modules/@amelio/web-platform/package.json');
  assert(pkg.dependencies['@amelio/web-platform'] === 'github:Amelio-AB/amelio-web-platform#' + AMP_SHA &&
    lock.packages[''].dependencies['@amelio/web-platform'] === pkg.dependencies['@amelio/web-platform'] &&
    lock.packages['node_modules/@amelio/web-platform'].resolved.endsWith('#' + AMP_SHA) &&
    lock.packages['node_modules/@amelio/web-platform'].version === '1.5.0' && installed.version === '1.5.0' &&
    installed.name === '@amelio/web-platform', 'Private AMP source/version mismatch');
}
