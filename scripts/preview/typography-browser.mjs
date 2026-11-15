/**
 * Read-only browser regression for all 16 Hallpartner pages.
 * Serves the built site locally; never calls real PHP, SMTP or customer accounts.
 */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { setTimeout as pause } from 'node:timers/promises';
import { PAGES } from './policy.mjs';

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon'
};
const server = createServer((req, res) => {
  try {
    if (req.method !== 'GET') { res.writeHead(405); res.end(); return; }
    const url = new URL(req.url, 'http://localhost');
    const route = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const path = route === '' || route.endsWith('/') ? route + 'index.html' : route;
    if (path.startsWith('api/') || path.split('/').some(p => !p || p === '.' || p === '..')) {
      res.writeHead(404); res.end(); return;
    }
    const file = join('dist', path);
    if (!existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, {
      'Content-Type': types[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(readFileSync(file));
  } catch { res.writeHead(500); res.end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = 'http://127.0.0.1:' + server.address().port;

const profile = mkdtempSync(join(tmpdir(), 'hp-typography-'));
const port = 9550 + (process.pid % 200);
const chrome = spawn(process.env.HP_CHROME || 'google-chrome', [
  '--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--disable-background-networking', '--no-first-run', '--no-default-browser-check',
  '--remote-allow-origins=*', '--remote-debugging-port=' + port,
  '--user-data-dir=' + profile, 'about:blank'
], { stdio: ['ignore', 'ignore', 'pipe'] });
const waiting = new Map();
let seq = 0;
let socket;
const results = [];
try {
  let target;
  for (let i = 0; i < 120; i++) {
    if (chrome.exitCode !== null) throw Error('Chrome exited early');
    try {
      const response = await fetch('http://127.0.0.1:' + port + '/json', { signal: AbortSignal.timeout(800) });
      if (response.ok) target = (await response.json()).find(x => x.type === 'page' && x.webSocketDebuggerUrl);
    } catch { /* Chrome starting */ }
    if (target) break;
    await pause(150);
  }
  assert.ok(target, 'Chrome CDP not available');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!message.id || !waiting.has(message.id)) return;
    const pending = waiting.get(message.id);
    waiting.delete(message.id);
    if (message.error) pending.reject(Error(message.error.message));
    else pending.resolve(message.result);
  });
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++seq;
    waiting.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw Error('CDP JS error: ' + JSON.stringify(result.exceptionDetails));
    return result.result?.value;
  };
  await call('Runtime.enable'); await call('Page.enable');
  assert.equal(PAGES.length, 16);

  const metricsExpression = [
    '(() => {',
    '  const font = el => el ? getComputedStyle(el).fontFamily : null;',
    '  const weight = el => el ? getComputedStyle(el).fontWeight : null;',
    '  const q = selector => document.querySelector(selector);',
    '  return {',
    '    heading: font(q(".hp-draft-main h1")),',
    '    body: font(q("body.hp-site.hp-draft")),',
    '    footerHeading: font(q(".af__group-heading")),',
    '    footerCTA: font(q(".af__quick-link")),',
    '    nav: font(q(".hp-draft-header .hp-draft-nav a:not(.hp-draft-nav__cta)")),',
    '    ampNav: font(q(".hm__desktop-nav .hm__nav-link, .hm__desktop-nav .hm__disclosure")),',
    '    ampNavWeight: weight(q(".hm__desktop-nav .hm__nav-link, .hm__desktop-nav .hm__disclosure")),',
    '    ampSub: font(q(".hm__sublink")),',
    '    ampSubWeight: weight(q(".hm__sublink")),',
    '    ampGroupHeading: font(q(".hm__group-heading")),',
    '    ampGroupHeadingWeight: weight(q(".hm__group-heading")),',
    '    ampIntro: font(q(".hm__menu-intro strong")),',
    '    ampIntroWeight: weight(q(".hm__menu-intro strong")),',
    '    ampIntroDescription: font(q(".hm__menu-intro p")),',
    '    ampFeatured: font(q(".hm__featured")),',
    '    ampFeaturedWeight: weight(q(".hm__featured")),',
    '    ampDescription: font(q(".hm__description")),',
    '    ampCta: font(q(".hm__cta")),',
    '    ampCtaWeight: weight(q(".hm__cta")),',
    '    mobileNav: font(q(".hm__mobile-link, .hm__mobile-overview, .hm__mobile-details summary")),',
    '    mobileNavWeight: weight(q(".hm__mobile-link, .hm__mobile-overview, .hm__mobile-details summary")),',
    '    headerCTA: font(q(".hp-draft-header .hp-draft-nav__cta")),',
    '    pageCTA: font(q(".hp-draft-main .hp-home-button, .hp-draft-main .hp-detail__button, .hp-draft-main .hp-stal__button, .hp-draft-main .hp-info__button, .hp-draft-main .hp-contact-hero__action, .hp-draft-main button[type=submit]")),',
    '    scrollWidth: document.documentElement.scrollWidth,',
    '    innerWidth: window.innerWidth',
    '  };',
    '})()'
  ].join('\n');

  for (const width of [390, 1440]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    for (const page of PAGES) {
      const route = page === 'index.html' ? '/' : '/' + page.replace(/index\.html$/, '');
      await call('Page.navigate', { url: origin + route });
      let ready = false;
      for (let w = 0; w < 100; w++) {
        try {
          ready = await evaluate('document.readyState === "complete" && !!document.querySelector(".hp-site .hp-draft-main h1") && !!document.querySelector(".af__group-heading")');
        } catch { /* Between navigation documents */ }
        if (ready) break;
        await pause(80);
      }
      assert.ok(ready, 'Page did not render: ' + route + ' at ' + width);
      const m = await evaluate(metricsExpression);
      assert.match(m.heading ?? '', /Saira/, 'Main title wrong: ' + route);
      assert.match(m.body ?? '', /Manrope/, 'Body font wrong: ' + route);
      assert.match(m.footerHeading ?? '', /Saira/, 'Footer heading wrong: ' + route);
      assert.match(m.footerCTA ?? '', /Saira/, 'Footer CTA wrong: ' + route);
      if (m.nav) assert.match(m.nav, /Saira/, 'Fallback nav not Saira: ' + route);
      if (width === 1440) {
        assert.ok(m.ampIntro, 'The mega-menu intro heading must exist: ' + route);
        assert.ok(m.ampFeatured, 'The mega-menu featured link must exist: ' + route);
        assert.ok(m.ampGroupHeading, 'The mega-menu group headings must exist: ' + route);
      }
      for (const [label, family, weight] of [
        ['AMP desktop navigation', m.ampNav, m.ampNavWeight],
        ['AMP submenu link', m.ampSub, m.ampSubWeight],
        ['AMP group heading', m.ampGroupHeading, m.ampGroupHeadingWeight],
        ['AMP intro heading', m.ampIntro, m.ampIntroWeight],
        ['AMP featured link', m.ampFeatured, m.ampFeaturedWeight],
        ['AMP mobile navigation', m.mobileNav, m.mobileNavWeight]
      ]) {
        if (!family) continue;
        assert.match(family, /Saira/, label + ' must use Saira: ' + route);
        assert.equal(weight, '500', label + ' must use Saira Medium 500: ' + route);
      }
      if (m.ampDescription) assert.match(m.ampDescription, /Inter/, 'Mega menu supporting copy not Inter: ' + route);
      if (m.ampIntroDescription) assert.match(m.ampIntroDescription, /Inter/, 'Mega intro description not Inter: ' + route);
      if (m.ampCta) {
        assert.match(m.ampCta, /Saira/, 'AMP CTA should remain Saira: ' + route);
        assert.equal(m.ampCtaWeight, '600', 'AMP CTA should remain SemiBold 600: ' + route);
      }
      if (m.headerCTA) assert.match(m.headerCTA, /Saira/, 'Header CTA wrong: ' + route);
      if (m.pageCTA) assert.match(m.pageCTA, /Saira/, 'Page CTA wrong: ' + route);
      assert.ok(m.scrollWidth <= width + 1, 'Horizontal overflow: ' + route + ' at ' + width + 'px; scroll=' + m.scrollWidth);
      results.push({ route, width, result: 'PASS' });
    }
  }

  mkdirSync('reports/preview/typography', { recursive: true });
  writeFileSync('reports/preview/typography/result.json',
    JSON.stringify({ pages: PAGES.length, widths: [390, 1440], results }, null, 2) + '\n');
  console.log('HALLPARTNER TYPOGRAPHY CHROME PASS: ' + results.length +
    ' page/viewport combinations; Saira heading/CTA, Manrope body, Saira Medium menu, overflow');
} finally {
  for (const task of waiting.values()) task.reject(Error('Chrome shutting down'));
  if (socket) socket.close();
  chrome.kill('SIGTERM');
  await new Promise(resolve => {
    if (chrome.exitCode !== null) return resolve();
    chrome.once('exit', resolve);
  });
  await new Promise(resolve => server.close(resolve));
  rmSync(profile, { recursive: true, force: true });
}
