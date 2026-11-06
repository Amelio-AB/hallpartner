import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { extname } from 'node:path';
import { spawn } from 'node:child_process';
import { PAGES, safePath, assert } from './policy.mjs';

const output = 'reports/preview/chrome'; mkdirSync(output, { recursive: true });
const types = { '.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2','.woff':'font/woff','.txt':'text/plain' };
const apiRequests = [];
const server = createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/') || req.method !== 'GET') apiRequests.push({ path:url.pathname, method:req.method });
    const path = safePath(decodeURIComponent(url.pathname.slice(1)) + (url.pathname.endsWith('/') ? 'index.html' : ''));
    if (!existsSync('preview-payload/' + path)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type':types[extname(path)] ?? 'application/octet-stream','Cache-Control':'no-store' }); res.end(readFileSync('preview-payload/' + path));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = 'http://127.0.0.1:' + server.address().port;
async function run(name, script, env) {
  const child = spawn(process.execPath, [script], { env:{...process.env,...env}, stdio:['ignore','pipe','pipe'] });
  const chunks = []; child.stdout.on('data', c => chunks.push(c)); child.stderr.on('data', c => chunks.push(c));
  const timer = setTimeout(() => child.kill('SIGTERM'), 240000);
  const code = await new Promise((done,reject) => { child.on('error',reject); child.on('exit',done); }); clearTimeout(timer);
  const log=Buffer.concat(chunks);
  writeFileSync(output + '/' + name + '.log', log);
  // Browser scripts contain no credentials; surface the actual assertion on failure.
  if(code !== 0) console.error(log.toString().slice(-12000));
  assert(code === 0, 'Chrome regression failed: ' + name); console.log(name + ': PASS');
}
try {
  for (const page of PAGES) {
    const route = page === 'index.html' ? '/' : '/' + page.replace(/\/index\.html$/, '/');
    const name = page.replaceAll('/','-').replaceAll('.','-');
    await run(name, 'scripts/capture-hallpartner-home.mjs', { HP_PREVIEW_URL:origin + route, HP_SCREENSHOT_DIR:output + '/pages', HP_SCREENSHOT_PREFIX:name });
  }
  await run('amp006','scripts/verify-hallpartner-amp006.mjs',{HP_PREVIEW_URL:origin + '/stalhallar/',HP_SCREENSHOT_DIR:output + '/amp006'});
  await run('gallery','scripts/verify-hallpartner-gallery.mjs',{HP_PREVIEW_URL:origin + '/stalhallar/',HP_SCREENSHOT_DIR:output + '/gallery'});
  await run('amp002','scripts/verify-hallpartner-amp002.mjs',{HP_PREVIEW_ORIGIN:origin,HP_SCREENSHOT_DIR:output + '/amp002'});
  assert(apiRequests.length === 0, 'Payload attempted an API request');
  writeFileSync(output + '/result.json', JSON.stringify({ pages:PAGES.length, widths:[320,390,768,1024,1280,1440], apiRequests, status:'passed' },null,2));
} finally { await new Promise(done => server.close(done)); }
