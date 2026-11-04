import { PREVIEW, sha256, assert } from './policy.mjs';

// Inleed observation: docs/preview/http-ftps-comparison-20261104.json.
// Transform ORIGINAL bytes forwards. Latin-1 preserves every unaffected byte,
// including invalid UTF-8; do not decode/re-encode, trim, or normalize responses.
export function expectedHttpBytes(path, original) {
  if (!/\.(html|xml)$/.test(path)) return original;
  return Buffer.from(original.toString('latin1').replace(
    /https:\/\/hallpartner\.se(?=[/?#"'<> \t\r\n]|$)/g, PREVIEW,
  ), 'latin1');
}

export function fingerprint(path, original) {
  return { path, sha256: sha256(original), bytes: original.length,
    expectedHttpSha256: sha256(expectedHttpBytes(path, original)) };
}

export function assertOriginal(file, original) {
  assert(sha256(original) === file.sha256, 'FTPS original differs from tested payload: ' + file.path);
}

export function compareDelivery(file, response) {
  const expected = file.expectedHttpSha256;
  assert(/^[a-f0-9]{64}$/.test(expected ?? ''), 'Missing expected HTTP hash: ' + file.path);
  const httpSha256 = sha256(response.body);
  const correctOrigin = new URL(response.url).origin === PREVIEW;
  return { path: file.path, status: response.status, ftpsSha256: file.sha256,
    expectedHttpSha256: expected, httpSha256, correctOrigin,
    matches: response.status === 200 && correctOrigin && httpSha256 === expected };
}

export function assertChecks(expected, checks) {
  assert(expected.length > 0 && Array.isArray(checks) && checks.length === expected.length &&
    new Set(checks.map(r => r.path)).size === expected.length &&
    expected.every(f => checks.some(r => r.path === f.path && r.status === 200 &&
      r.ftpsSha256 === f.sha256 && r.expectedHttpSha256 === f.expectedHttpSha256 &&
      r.httpSha256 === f.expectedHttpSha256 && r.correctOrigin && r.matches)),
  'BLOCKED: HTTPS differs from the exact forward transformation of FTPS originals');
}
