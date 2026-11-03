import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, basename, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, walkSync } from 'ultrahtml';
import { init, parse as parseJS } from 'es-module-lexer';
import { PAGES, PREVIEW, IMAGE, safePath, files, json, sha256, assert, assertAmp } from './policy.mjs';

const ROBOTS = 'User-agent: *\nDisallow: /\n';
export function inspectHtml(html, page) {
  const assets = []; const links = []; const scripts = []; let noindex = false; let contact = false; let quote = false;
  walkSync(parse(html), node => {
    if (!node.name) return;
    const a = node.attributes;
    if (node.name === 'meta' && a.name?.toLowerCase() === 'robots') {
      const values = a.content?.toLowerCase().split(/\s*,\s*/);
      noindex = values?.includes('noindex') && values.includes('nofollow');
    }
    assert(!['iframe','object','embed','base'].includes(node.name), 'Unexpected active embed/base in ' + page);
    if (a['data-enabled'] !== undefined) assert(a['data-enabled'] === 'false', 'Enabled form in ' + page);
    if (node.name === 'form') assert(a['data-enabled'] === 'false' && !a.action, 'Active form in ' + page);
    if (a.id === 'hp-contact-form') contact = a['data-enabled'] === 'false';
    if (a.id === 'hp-offert-guide') quote = a['data-enabled'] === 'false';
    if (a.src) assets.push(a.src);
    if (a.poster) assets.push(a.poster);
    if (a.srcset) assets.push(...a.srcset.split(',').map(x => x.trim().split(/\s+/)[0]));
    if (node.name === 'link' && /^(stylesheet|icon|preload|modulepreload)$/.test(a.rel)) assets.push(a.href);
    if (node.name === 'a' && a.href) links.push(a.href);
    if (node.name === 'script' && !a.src && (!a.type || a.type === 'module')) scripts.push(node.children.map(x => x.value ?? '').join(''));
    if (a.style) assets.push(...cssRefs(a.style));
    if (node.name === 'style') assets.push(...cssRefs(node.children.map(x => x.value ?? '').join('')));
  });
  assert(noindex, 'Missing noindex,nofollow: ' + page);
  if (page === 'kontakt/index.html') assert(contact, 'Contact disabled contract missing');
  if (page === 'offert/index.html') assert(quote, 'Quote disabled contract missing');
  if (page === 'index.html') assert(html.includes('En hall börjar med ditt behov.'), 'Unexpected homepage');
  return { assets, links, scripts };
}
function cssRefs(text) {
  return [...text.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)|@import\s+["']([^"']+)["']/g)].map(x => x[1] ?? x[2]);
}
async function jsRefs(text) {
  await init;
  const [imports] = parseJS(text);
  assert(imports.every(x => x.d < 0 || x.n !== undefined || x.d === -2), 'Unresolved dynamic module import');
  return imports.filter(x => x.n).map(x => x.n);
}
function localRef(raw, from, external) {
  if (!raw || raw.startsWith('#') || raw.startsWith('data:')) return null;
  assert(!/^(javascript|blob):/i.test(raw), 'Unexpected asset scheme');
  const url = new URL(raw.replaceAll('&amp;', '&'), PREVIEW + '/' + from);
  if (url.origin !== PREVIEW) {
    assert(url.protocol === 'https:' && ['fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname), 'Unapproved external asset origin: ' + url.origin);
    external.add(url.href); return null;
  }
  const path = safePath(decodeURIComponent(url.pathname).slice(1));
  assert(/\.(css|js|mjs|woff2?|ttf|otf|avif|webp|png|jpe?g|gif|svg|ico)$/.test(path), 'Unexpected asset extension: ' + path);
  return path;
}
function imageSource(path, sources) {
  if (!path.startsWith('_astro/')) return 'public/' + path;
  const name = basename(path);
  // Duplicate legacy basenames: these are the imports used by the approved public pages.
  const sourceByStem = { maskinhall: 'src/assets/images/maskinhall.jpeg', 'talthall-1536x1152': 'src/assets/images/legacy/talthall-1536x1152.jpg' };
  const mapped = Object.entries(sourceByStem).find(([stem]) => name.startsWith(stem + '.'));
  if (mapped) return mapped[1];
  const matches = sources.filter(p => IMAGE.test(p) && name.startsWith(basename(p, extname(p)) + '.'));
  assert(matches.length === 1, 'Ambiguous or missing image source: ' + path);
  return matches[0];
}
export async function prepare({ dist = 'dist', out = 'preview-payload', report = 'reports/preview', commit }) {
  assert(/^[a-f0-9]{40}$/.test(commit), 'Exact commit required');
  assert(!existsSync(out), 'Payload directory must be new (never reuse stale files)');
  assertAmp();
  const all = files(dist); const selected = new Set(PAGES); const external = new Set(); const usedBy = new Map();
  for (const page of PAGES) {
    assert(all.includes(page), 'Missing page: ' + page);
    const html = readFileSync(dist + '/' + page, 'utf8'); const data = inspectHtml(html, page);
    for (const link of data.links) {
      if (/^(mailto:|tel:|https?:)/.test(link) || link.startsWith('#')) continue;
      const pathname = new URL(link, PREVIEW + '/' + page).pathname;
      const target = pathname.slice(1) + (pathname.endsWith('/') ? 'index.html' : '');
      assert(PAGES.includes(target), 'Link to excluded/missing page: ' + link);
    }
    const pending = [...data.assets, ...(await Promise.all(data.scripts.map(jsRefs))).flat()]; const visited = new Set();
    while (pending.length) {
      const item = pending.pop(); const raw = typeof item === 'string' ? item : item.raw; const from = typeof item === 'string' ? page : item.from;
      const path = localRef(raw, from, external); if (!path) continue;
      assert(all.includes(path), 'Missing asset: ' + path);
      selected.add(path); const usage = usedBy.get(path) ?? new Set(); usage.add(page); usedBy.set(path, usage);
      if (visited.has(path)) continue; visited.add(path);
      const refs = path.endsWith('.css') ? cssRefs(readFileSync(dist + '/' + path, 'utf8')) : /\.m?js$/.test(path) ? await jsRefs(readFileSync(dist + '/' + path, 'utf8')) : [];
      pending.push(...refs.map(raw => ({ raw, from: path })));
    }
  }
  const sourceFiles = [...files('src/assets/images').map(x => 'src/assets/images/' + x)];
  const images = [...selected].filter(x => IMAGE.test(x)).sort().map(path => {
    const source = imageSource(path, sourceFiles);
    return { path, source, sourceSha256: sha256(readFileSync(source)), outputSha256: sha256(readFileSync(dist + '/' + path)), pages: [...usedBy.get(path) ?? []].sort() };
  });
  mkdirSync(out, { recursive: true }); mkdirSync(report, { recursive: true });
  for (const path of [...selected].sort()) {
    safePath(path); mkdirSync(dirname(out + '/' + path), { recursive: true }); copyFileSync(dist + '/' + path, out + '/' + path);
  }
  writeFileSync(out + '/robots.txt', ROBOTS);
  const manifest = { schemaVersion: 1, commit, pages: PAGES, externalAssets: [...external].sort(), files: files(out).map(path => ({ path, sha256: sha256(readFileSync(out + '/' + path)), bytes: readFileSync(out + '/' + path).length })), images };
  writeFileSync(report + '/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  writeFileSync(report + '/excluded-files.json', JSON.stringify(all.filter(x => !selected.has(x) && x !== 'robots.txt'), null, 2) + '\n');
  writeFileSync(report + '/image-rights.json', JSON.stringify(rightsStatus(manifest), null, 2) + '\n');
  verifyPayload(out, manifest);
  return manifest;
}
export function rightsStatus(manifest, rights = json('config/preview-image-rights.json')) {
  assert(rights.schemaVersion === 1 && Array.isArray(rights.approvals), 'Invalid rights register');
  return manifest.images.map(image => ({ ...image, approved: rights.approvals.some(a => a.source === image.source && a.sourceSha256 === image.sourceSha256 && a.outputSha256 === image.outputSha256 && a.scope === PREVIEW && a.approvedBy?.trim() && a.evidence?.trim()) }));
}
export function verifyPayload(root, manifest) {
  assert(/^[a-f0-9]{40}$/.test(manifest.commit), 'Invalid payload commit');
  assert(JSON.stringify(files(root)) === JSON.stringify(manifest.files.map(x => x.path).sort()), 'Unexpected/missing payload files');
  for (const f of manifest.files) {
    safePath(f.path); assert(sha256(readFileSync(root + '/' + f.path)) === f.sha256, 'Payload hash mismatch: ' + f.path);
    if (f.path.endsWith('.html')) { assert(PAGES.includes(f.path), 'Unapproved HTML'); inspectHtml(readFileSync(root + '/' + f.path, 'utf8'), f.path); }
  }
  assert(PAGES.every(p => manifest.files.some(f => f.path === p)), 'Required page missing');
  for (const image of manifest.images) {
    safePath(image.source); assert(/^(public\/|src\/assets\/images\/)/.test(image.source) && IMAGE.test(image.source), 'Invalid image source path');
  }
  const actualImages = manifest.files.filter(f => IMAGE.test(f.path));
  assert(actualImages.length === manifest.images.length && actualImages.every(f => manifest.images.some(i => i.path === f.path && i.outputSha256 === f.sha256 && sha256(readFileSync(i.source)) === i.sourceSha256)), 'Image inventory/source mismatch');
  assert(readFileSync(root + '/robots.txt','utf8') === ROBOTS, 'Robots must disallow crawling');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [mode, commit] = process.argv.slice(2);
  if (mode === 'prepare') { const m = await prepare({ commit }); console.log('Static payload:', m.files.length, 'files;', m.images.length, 'images. Rights approval remains a publication gate.'); }
  else if (mode === 'verify') verifyPayload('preview-payload', json('reports/preview/manifest.json'));
  else if (mode === 'rights') assert(rightsStatus(json('reports/preview/manifest.json')).every(x => x.approved), 'BLOCKED: image rights are not approved for this preview');
  else throw new Error('Use prepare <commit>, verify, or rights');
}
