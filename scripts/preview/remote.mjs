import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PREVIEW, PRODUCTION, PROBE, PROBE_FILE, BLOCKED, safePath, sha256, json, assert } from './policy.mjs';
import { verifyPayload, rightsStatus } from './payload.mjs';

const REPORT = 'reports/preview';
const MARKER = 'hp-preview-deploy.json';
const INVENTORY = 'hp-preview-inventory.json';
const REPO = 'Amelio-AB/hallpartner';
export function endpoint(host) {
  assert(typeof host === 'string' && /^[a-zA-Z0-9.:/-]+$/.test(host), 'Invalid FTP host');
  const url = new URL(host.includes('://') ? host : 'ftp://' + host);
  assert(['ftp:','ftps:'].includes(url.protocol) && url.pathname === '/' && !url.username && !url.password && !url.search && !url.hash, 'FTP host must not contain credentials or a remote path');
  // Existing account uses explicit TLS on FTP port 21; never downgrade to cleartext.
  assert(!url.port || url.port === '21', 'Unreviewed FTPS port');
  return 'ftp://' + url.hostname + ':21';
}
export function credentials(env = process.env) {
  assert(env.FTP_PASSWORD && /^[A-Za-z0-9_.@+-]+$/.test(env.FTP_USERNAME ?? ''), 'Missing/invalid FTPS credentials');
  const host = endpoint(env.FTP_HOST);
  return { host, username: env.FTP_USERNAME, password: env.FTP_PASSWORD, binding: sha256(host + '\n' + env.FTP_USERNAME + '\n./') };
}
export function lftpScript(commands, creds) {
  return [
    'set cmd:fail-exit yes', 'set cmd:interactive no', 'set ftp:ssl-allow yes',
    'set ftp:ssl-force yes', 'set ftp:ssl-protect-data yes', 'set ftp:ssl-protect-list yes',
    'set ssl:verify-certificate yes', 'set ssl:check-hostname yes',
    'set ssl:priority NORMAL:-VERS-SSL3.0:-VERS-TLS1.0:-VERS-TLS1.1',
    'set ftp:passive-mode yes', 'set net:max-retries 1', 'set net:timeout 20',
    'set log:enabled no', 'set log:enabled/xfer no',
    'open --env-password --user ' + creds.username + ' ' + creds.host,
    'cd ./', ...commands, 'bye', ''
  ].join('\n');
}
function ftps(commands, creds, cwd) {
  const result = spawnSync('lftp', ['--norc'], { input: lftpScript(commands, creds), encoding: 'utf8', cwd,
    env: { ...process.env, LFTP_PASSWORD: creds.password }, timeout: 10 * 60 * 1000, maxBuffer: 16 * 1024 * 1024 });
  // Never print lftp diagnostics: they can contain credential-bearing server URLs.
  assert(result.status === 0 && !result.error, 'FTPS operation failed; no success claimed. Inspect credentials/TLS/permissions privately.');
  return result.stdout;
}
export async function request(url) {
  const initial = new URL(url); let current = initial;
  for (let i = 0; i < 4; i++) {
    const response = await fetch(current, { redirect: 'manual', signal: AbortSignal.timeout(25000), headers: { 'Cache-Control': 'no-cache' } });
    if ([301,302,303,307,308].includes(response.status)) {
      const next = new URL(response.headers.get('location') ?? '', current);
      const productionRedirect = PRODUCTION.includes(initial.origin) && PRODUCTION.includes(next.origin);
      assert(next.protocol === 'https:' && (next.origin === initial.origin || productionRedirect), 'Unexpected redirect origin');
      current = next; continue;
    }
    return { status: response.status, url: current.href, body: Buffer.from(await response.arrayBuffer()), type: response.headers.get('content-type') };
  }
  throw new Error('Too many redirects');
}
export async function assertAbsent(origin, path, get = request) {
  const r = await get(origin + '/' + path + '?hp-preview-check=' + Date.now());
  assert([404,410].includes(r.status) && !r.body.toString().includes(PROBE), 'Production marker must be absent with 404/410: ' + origin);
}
export async function publicProof(get = request) {
  const r = await get(PREVIEW + '/' + PROBE_FILE + '?hp-preview-check=' + Date.now());
  assert(r.status === 200 && r.body.toString().trim() === PROBE, 'Preview target marker mismatch');
  for (const host of PRODUCTION) await assertAbsent(host, PROBE_FILE, get);
}
// Inventory may include forbidden publication paths (for example .htaccess),
// but none may escape the login root or inject an lftp command/option.
export function remoteInventory(listing) {
  const remoteFiles = []; const remoteDirectories = [];
  for (const line of listing.split(/\r?\n/).filter(Boolean)) {
    if (line === '.' || line === './') continue;
    const directory = line.endsWith('/');
    const path = line.replace(/^\.\//, '').replace(/\/$/, '');
    assert(/^[A-Za-z0-9_.][A-Za-z0-9_./-]*$/.test(path) &&
      !path.split('/').some(p => !p || p === '.' || p === '..'), 'Unsafe remote inventory path');
    (directory ? remoteDirectories : remoteFiles).push(path);
  }
  assert(new Set([...remoteFiles, ...remoteDirectories]).size === remoteFiles.length + remoteDirectories.length, 'Duplicate remote inventory path');
  return { remoteFiles: remoteFiles.sort(), remoteDirectories: remoteDirectories.sort() };
}
export async function deliveryStatus(fingerprints, get = request) {
  const results = [];
  for (const file of fingerprints.filter(f => !BLOCKED.test(f.path))) {
    safePath(file.path);
    const response = await get(PREVIEW + '/' + file.path + '?hp-delivery-check=' + Date.now());
    const httpSha256 = sha256(response.body);
    results.push({ path: file.path, status: response.status, ftpsSha256: file.sha256, httpSha256,
      matches: response.status === 200 && httpSha256 === file.sha256 });
  }
  return results;
}
export function assertDelivery(proof) {
  const expected = proof.fileFingerprints.filter(f => !BLOCKED.test(f.path));
  assert(expected.length > 0 && Array.isArray(proof.deliveryChecks) && proof.deliveryChecks.length === expected.length &&
    expected.every(f => proof.deliveryChecks.some(r => r.path === f.path && r.status === 200 &&
      r.ftpsSha256 === f.sha256 && r.httpSha256 === f.sha256 && r.matches)),
  'BLOCKED: existing FTPS files do not match HTTPS delivery; review server/proxy rewriting before any upload');
}
export async function checkTarget(creds = credentials()) {
  await publicProof();
  const temp = mkdtempSync(tmpdir() + '/hp-preview-read-');
  try {
    ftps(['get ' + PROBE_FILE + ' -o probe.txt'], creds, temp);
    assert(readFileSync(temp + '/probe.txt', 'utf8').trim() === PROBE, 'FTPS login root does not match public preview marker');
    const listing = ftps(['find .'], creds, temp);
    const { remoteFiles, remoteDirectories } = remoteInventory(listing);
    assert(remoteFiles.includes(PROBE_FILE), 'Unrecognized FTPS directory listing');
    // Read only. Raw files, including server configuration, stay in the temporary
    // runner directory and are never included in uploaded evidence artifacts.
    ftps(remoteFiles.map((path, index) => 'get ' + path + ' -o inventory-' + index), creds, temp);
    const fileFingerprints = remoteFiles.map((path, index) => {
      const body = readFileSync(temp + '/inventory-' + index);
      return { path, sha256: sha256(body), bytes: body.length };
    });
    const after = remoteInventory(ftps(['find .'], creds, temp));
    assert(JSON.stringify(after) === JSON.stringify({ remoteFiles, remoteDirectories }), 'Remote inventory changed during read-only inspection');
    const deliveryChecks = await deliveryStatus(fileFingerprints);
    const result = { checkedAt: new Date().toISOString(), target: PREVIEW, root: './', bindingSha256: creds.binding, remoteFiles, remoteDirectories, fileFingerprints, deliveryChecks,
      writeOperations: 0,
      forbiddenFiles: remoteFiles.filter(p => BLOCKED.test(p)) };
    mkdirSync(REPORT, { recursive: true }); writeFileSync(REPORT + '/target-proof.json', JSON.stringify(result, null, 2) + '\n');
    console.log('Read-only proof passed: FTPS login root marker matches preview and is absent from both production hosts.');
    return result;
  } finally { rmSync(temp, { recursive: true, force: true }); }
}
async function github(path) {
  assert(process.env.GH_TOKEN, 'Missing read-only GitHub token');
  const r = await fetch('https://api.github.com/repos/' + REPO + '/' + path, { signal: AbortSignal.timeout(20000), headers: { Authorization: 'Bearer ' + process.env.GH_TOKEN, Accept: 'application/vnd.github+json' } });
  assert(r.ok, 'GitHub safety check failed'); return r.json();
}
export function assertPublishContext(env, commit) {
  assert(env.GITHUB_REPOSITORY === REPO && env.GITHUB_REF === 'refs/heads/main' && ['push','workflow_dispatch'].includes(env.GITHUB_EVENT_NAME), 'Publication is only allowed from main push/manual events');
  assert(/^[a-f0-9]{40}$/.test(commit) && env.GITHUB_SHA === commit, 'Publication commit mismatch');
}
async function latest(commit) {
  assert((await github('git/ref/heads/main')).object.sha === commit, 'Superseded commit: main has advanced');
}
export async function productionSnapshot(get = request) {
  const snapshot = [];
  for (const origin of PRODUCTION) for (const path of ['/', '/robots.txt', '/stalhallar/']) {
    const url = origin + path; const a = await get(url); const b = await get(url);
    assert(a.status === 200 && b.status === 200 && sha256(a.body) === sha256(b.body), 'Production is unavailable/unstable; cannot prove unchanged content: ' + url);
    snapshot.push({ url, sha256: sha256(a.body) });
  }
  return snapshot;
}
async function verifyProduction(snapshot, marker) {
  for (const row of snapshot) {
    const r = await request(row.url);
    assert(r.status === 200 && sha256(r.body) === row.sha256, 'Production changed during preview transfer; stop and investigate: ' + row.url);
  }
  for (const host of PRODUCTION) { await assertAbsent(host, marker); await assertAbsent(host, MARKER); await assertAbsent(host, PROBE_FILE); }
}
export function retainedFiles(remoteFiles, manifest, policy, previous = [], imageApprovals = []) {
  return remoteFiles.filter(p => !manifest.files.some(f => f.path === p) && p !== PROBE_FILE && p !== MARKER && p !== INVENTORY && !/^hp-preview-deploy-[a-f0-9]{40}\.json$/.test(p)).map(path => {
    safePath(path);
    // Automatically retain only previously verified static assets. Removed HTML is never grandfathered.
    const prior = previous.find(f => f.path === path && /^[a-f0-9]{64}$/.test(f.sha256));
    const staticAsset = /^(?:_astro|images|generated)\/.+\.(?:css|m?js|woff2?|ttf|otf|avif|webp|png|jpe?g|gif|svg|ico)$/.test(path);
    const image = /\.(?:avif|webp|png|jpe?g|gif|svg|ico)$/.test(path);
    if (prior && staticAsset && (!image || imageApprovals.some(a => a.outputSha256 === prior.sha256 && a.scope === PREVIEW && a.approvedBy?.trim() && a.evidence?.trim()))) return prior;
    const entry = policy.retainedFiles.find(f => f.path === path && /^[a-f0-9]{64}$/.test(f.sha256) && f.approvedBy?.trim() && f.evidence?.trim());
    assert(entry, 'Unreviewed old remote file (no deletion performed): ' + path);
    return entry;
  });
}
async function verifyPublished(manifest) {
  for (const file of manifest.files) {
    // Fetch every staged page and local CSS/JS/image/font, not just a few screenshots.
    const route = file.path === 'index.html' ? '/' : '/' + file.path.replace(/\/index\.html$/, '/');
    const r = await request(PREVIEW + route + '?hp-commit=' + manifest.commit);
    assert(r.status === 200 && sha256(r.body) === file.sha256, 'Published content does not match tested payload: ' + file.path);
  }
  for (const url of manifest.externalAssets) assert((await request(url)).status === 200, 'Existing external font stylesheet unavailable');
}
export async function publish() {
  const manifest = json(REPORT + '/manifest.json');
  assertPublishContext(process.env, manifest.commit);
  const policy = json('config/preview-release.json');
  assert(policy.schemaVersion === 1 && /^[a-f0-9]{64}$/.test(policy.targetBindingSha256 ?? '') && policy.targetEvidence?.trim(), 'BLOCKED: target approval is not recorded');
  assert(rightsStatus(manifest).every(x => x.approved), 'BLOCKED: image rights are not approved');
  verifyPayload('preview-payload', manifest);
  for (const id of [405335800,405334470]) assert((await github('actions/workflows/' + id)).state === 'disabled_manually', 'BLOCKED: old ops workflow is still active');
  const creds = credentials(); assert(creds.binding === policy.targetBindingSha256, 'FTPS account binding has changed');
  const proof = await checkTarget(creds);
  assertDelivery(proof); // Detect known delivery transformations before the first remote write.
  const temp = mkdtempSync(tmpdir() + '/hp-preview-publish-');
  try {
    let previous = [];
    if (proof.remoteFiles.includes(MARKER) || proof.remoteFiles.includes(INVENTORY)) {
      assert(proof.remoteFiles.includes(MARKER) && proof.remoteFiles.includes(INVENTORY), 'Incomplete previous deployment inventory');
      ftps(['get ' + MARKER + ' -o previous-marker.json', 'get ' + INVENTORY + ' -o previous-inventory.json'], creds, temp);
      const marker = json(temp + '/previous-marker.json'); const inventoryBytes = readFileSync(temp + '/previous-inventory.json');
      assert(marker.inventorySha256 === sha256(inventoryBytes), 'Previous inventory hash mismatch');
      const inventory = JSON.parse(inventoryBytes);
      assert(inventory.schemaVersion === 1 && inventory.target === PREVIEW && inventory.commit === marker.commit && /^[a-f0-9]{40}$/.test(inventory.commit) && Array.isArray(inventory.files), 'Invalid previous inventory');
      previous = inventory.files;
    }
    const extras = retainedFiles(proof.remoteFiles, manifest, policy, previous, json('config/preview-image-rights.json').approvals);
    for (const [index, entry] of extras.entries()) {
      ftps(['get ' + entry.path + ' -o retained-' + index], creds, temp);
      assert(sha256(readFileSync(temp + '/retained-' + index)) === entry.sha256, 'Retained remote file changed');
    }
    const snapshot = await productionSnapshot();
    const uniqueMarker = 'hp-preview-deploy-' + manifest.commit + '.json';
    for (const host of PRODUCTION) { await assertAbsent(host, uniqueMarker); await assertAbsent(host, MARKER); }
    await latest(manifest.commit); // Immediately before the first remote write, inside the shared concurrency lock.
    const ordered = [...manifest.files].sort((a,b) => Number(a.path.endsWith('.html')) - Number(b.path.endsWith('.html')) || Number(a.path === 'index.html') - Number(b.path === 'index.html') || a.path.localeCompare(b.path));
    const directories = [...new Set(ordered.map(f => dirname(f.path)).filter(x => x !== '.'))].sort();
    const commands = [...directories.map(path => 'mkdir -p ' + safePath(path)), ...ordered.map(f => 'put ' + safePath(f.path) + ' -o ' + safePath(f.path))];
    ftps(commands, creds, resolve('preview-payload'));
    await verifyPublished(manifest);
    await verifyProduction(snapshot, uniqueMarker);
    await latest(manifest.commit);
    const inventory = { schemaVersion: 1, target: PREVIEW, commit: manifest.commit, files: [...manifest.files.map(({path,sha256}) => ({path,sha256})), ...extras.map(({path,sha256}) => ({path,sha256}))] };
    const inventoryBody = JSON.stringify(inventory, null, 2) + '\n'; writeFileSync(temp + '/inventory.json', inventoryBody);
    const marker = { schemaVersion: 1, inventorySha256: sha256(inventoryBody), commit: manifest.commit, runId: process.env.GITHUB_RUN_ID, manifestSha256: sha256(readFileSync(REPORT + '/manifest.json')), verifiedAt: new Date().toISOString() };
    const markerBody = JSON.stringify(marker, null, 2) + '\n'; writeFileSync(temp + '/marker.json', markerBody);
    // Written last, only after all HTTP/resource/form/noindex and production checks passed.
    ftps(['put inventory.json -o ' + INVENTORY, 'put marker.json -o ' + uniqueMarker, 'put marker.json -o ' + MARKER], creds, temp);
    const publishedInventory = await request(PREVIEW + '/' + INVENTORY + '?hp-commit=' + manifest.commit);
    assert(publishedInventory.status === 200 && sha256(publishedInventory.body) === marker.inventorySha256, 'Published inventory mismatch');
    for (const name of [uniqueMarker, MARKER]) {
      const r = await request(PREVIEW + '/' + name + '?hp-commit=' + manifest.commit);
      assert(r.status === 200 && r.body.toString() === markerBody, 'Deploy marker verification failed');
    }
    await verifyProduction(snapshot, uniqueMarker); await latest(manifest.commit);
    writeFileSync(REPORT + '/deployment-result.json', JSON.stringify({ ...marker, target: PREVIEW, status: 'verified' }, null, 2));
    console.log('Preview transfer and HTTP verification succeeded for ' + manifest.commit);
  } finally { rmSync(temp, { recursive: true, force: true }); }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv[2] === 'check-target') await checkTarget();
  else if (process.argv[2] === 'publish') await publish();
  else throw new Error('Use check-target or publish');
}
