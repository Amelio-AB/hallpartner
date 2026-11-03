/**
 * Headless Chrome DevTools visual checks without third-party dependencies.
 * Screenshots are captured after every image has decoded.
 * For internal QA only. No deploy, credentials, or production side effects.
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const executable = process.env.HP_CHROME || 'google-chrome';
const url = process.env.HP_PREVIEW_URL || 'http://127.0.0.1:4321/stalhallar/';
const output = resolve(process.env.HP_SCREENSHOT_DIR || 'visual-review/gallery');

const prefix = process.env.HP_SCREENSHOT_PREFIX || 'validated';
const sectionIds = (process.env.HP_SCREENSHOT_SECTIONS || '').split(',').filter(Boolean);
if (sectionIds.some(id => !/^[a-z0-9-]+$/i.test(id))) throw new Error('Invalid section ID');
if (!/^[a-z0-9-]+$/i.test(prefix)) throw new Error('Invalid screenshot prefix');
const port = 9300 + process.pid % 300;
const profile = join(tmpdir(), 'hp-cdp-' + process.pid);
const browser = spawn(executable, [
  '--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--disable-background-networking', '--remote-allow-origins=*',
  '--remote-debugging-port=' + port, '--user-data-dir=' + profile,
  'about:blank',
], { stdio: 'ignore' });

await mkdir(output, { recursive: true });
let socket;
try {
  let target;
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      const response = await fetch('http://127.0.0.1:' + port + '/json');
      if (response.ok) {
        const pages = await response.json();
        target = pages.find((page) => page.type === 'page' && page.webSocketDebuggerUrl);
      }
    } catch {
      // Chrome has not exposed its debugging port yet.
    }
    if (target) break;
    await sleep(150);
  }
  if (!target) throw new Error('Chrome debugging target unavailable');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((done, fail) => {
    const timer = setTimeout(() => fail(new Error('WebSocket open timeout')), 8000);
    socket.addEventListener('open', () => { clearTimeout(timer); done(); }, { once: true });
    socket.addEventListener('error', (event) => { clearTimeout(timer); fail(event); }, { once: true });
  });
  let sequence = 0;
  const promises = new Map();
  socket.addEventListener('message', (event) => {
    const packet = JSON.parse(event.data);
    if (!packet.id || !promises.has(packet.id)) return;
    const entry = promises.get(packet.id);
    promises.delete(packet.id);
    clearTimeout(entry.timer);
    if (packet.error) entry.reject(new Error(packet.error.message));
    else entry.resolve(packet.result);
  });
  const call = (method, params = {}) => new Promise((done, fail) => {
    const id = ++sequence;
    const timer = setTimeout(() => { promises.delete(id); fail(new Error(method + ' timed out')); }, 20000);
    promises.set(id, { resolve: done, reject: fail, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression, awaitPromise = false) => {
    const result = await call('Runtime.evaluate', { expression, awaitPromise, returnByValue: true });
    if (result.exceptionDetails) throw new Error('Browser evaluation failed: ' + JSON.stringify(result.exceptionDetails));
    return result.result?.value;
  };
  await call('Runtime.enable');
  await call('Page.enable');

  const assert = (value, message) => { if (!value) throw new Error(message); };
  const report = [];
  const requests = [];
  const runtimeErrors = [];
  socket.addEventListener('message', event => {
    const packet = JSON.parse(event.data);
    if (packet.method === 'Network.requestWillBeSent') requests.push(packet.params.request.url);
    if (packet.method === 'Runtime.exceptionThrown') runtimeErrors.push(packet.params.exceptionDetails);
  });
  await call('Network.enable');
  const run = fn => evaluate('(' + fn.toString() + ')()', true);
  const state = () => run(() => {
    const t = document.querySelector('[data-gallery-track]');
    return {
      left: t.scrollLeft, max: t.scrollWidth - t.clientWidth,
      previous: document.querySelector('[data-gallery-previous]').getAttribute('aria-disabled'),
      next: document.querySelector('[data-gallery-next]').getAttribute('aria-disabled'),
      label: document.querySelector('[data-gallery-status]').textContent,
      focus: document.activeElement === t ? 'track' : document.activeElement?.getAttribute('data-gallery-next') === '' ? 'next' : document.activeElement?.tagName,
      outline: getComputedStyle(document.activeElement).outlineWidth,
    };
  });
  const key = async (key, code, keyCode) => {
    await call('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: keyCode, text: key === 'Enter' ? '\r' : '' });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: keyCode });
    await sleep(1000);
  };
  const navigate = async () => {
    await call('Page.navigate', { url });
    for (let i = 0; i < 100; i++) {
      try { if (await evaluate('document.readyState === "complete" && !!document.querySelector("[data-gallery-track]")')) break; } catch {}
      await sleep(100);
    }
    await sleep(250);
  };
  for (const width of [320, 390, 768, 1280, 1440]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await call('Network.clearBrowserCache');
    await navigate();
    const initial = await run(() => ({
      galleryTop: document.querySelector('[data-image-gallery]').getBoundingClientRect().top,
      heroHeight: document.querySelector('#stalhallar-intro').getBoundingClientRect().height,
      galleryHeight: document.querySelector('[data-image-gallery]').getBoundingClientRect().height,
      initialImages: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'img').map(r => ({ name: r.name, bytes: r.encodedBodySize })),
      mediaElements: document.querySelectorAll('video, iframe').length,
      images: [...document.querySelectorAll('[data-image-gallery] img')].map(i => ({ alt: i.alt, loading: i.loading, srcset: i.srcset, sizes: i.sizes })),
      buttons: [...document.querySelectorAll('[data-image-gallery] button')].map(b => ({ height: b.getBoundingClientRect().height, width: b.getBoundingClientRect().width })),
    }));
    assert(initial.images.length === 5 && initial.images.every(i => i.alt && i.loading === 'lazy' && i.srcset), 'Responsive lazy images');
    assert(initial.buttons.every(b => b.height >= 44 && b.width >= 44), '44 px targets');
    assert(initial.mediaElements === 0, 'No video or embeds in static fallback');
    await run(async () => { for (const i of document.images) { i.loading = 'eager'; await i.decode(); } document.querySelector('[data-gallery-track]').focus(); });
    let start = await state();
    assert(start.left < 2 && start.previous === 'true', 'Start state');
    await key('ArrowRight', 'ArrowRight', 39);
    const arrow = await state();
    assert(arrow.left > 100 && arrow.focus === 'track' && parseFloat(arrow.outline) >= 3, 'ArrowRight and visible keyboard focus');
    await key('End', 'End', 35);
    const end = await state();
    assert(Math.abs(end.left - end.max) <= 2 && end.next === 'true' && end.label.includes('5'), 'End and last caption status');
    await key('Home', 'Home', 36);
    await run(() => document.querySelector('[data-gallery-next]').focus());
    await key('Enter', 'Enter', 13);
    const enter = await state(); console.log(JSON.stringify({width,enter}));
    assert(enter.left > 100 && enter.focus === 'next', 'Enter activates button without losing focus');
    await run(() => document.querySelector('[data-gallery-previous]').click());
    await sleep(1000);
    assert((await state()).left < 2, 'Previous button returns to first');
    await run(() => document.querySelector('[data-gallery-track]').focus());
    await key('End', 'End', 35);
    await run(() => document.querySelector('[data-gallery-next]').focus());
    await key('Enter', 'Enter', 13);
    assert((await state()).focus === 'next' && (await state()).next === 'true', 'End button preserves focus and position');
    await run(() => document.querySelector('[data-gallery-track]').focus());
    await key('Home', 'Home', 36);
    const stationary = await state();
    await sleep(1000);
    assert((await state()).left === stationary.left, 'No automatic advance');
    if (width < 768) {
      await call('Emulation.setTouchEmulationEnabled', { enabled: true });
      const point = await run(() => { const t = document.querySelector('[data-gallery-track]'); window.scrollTo(0, t.getBoundingClientRect().top + scrollY - 150); return { x: innerWidth - 45, y: t.getBoundingClientRect().top + 100 }; });
      await call('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...point, id: 0 }] });
      for (let i = 1; i <= 10; i++) {
        await call('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: point.x - i * 20, y: point.y, id: 0 }] });
        await sleep(30);
      }
      await call('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await sleep(900);
      assert((await state()).left > 100, 'Native touch swipe');
    }
    // Capture every motif, including the last slide, at common mobile and desktop sizes.
    if (width === 390 || width === 1440) {
      await run(() => document.querySelector('[data-gallery-track]').focus());
      await key('Home', 'Home', 36);
      for (let i = 0; i < 5; i++) {
        const clip = await run(() => { const r = document.querySelector('[data-image-gallery]').getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height, scale: 1 }; });
        const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip });
        await writeFile(join(output, 'gallery-' + width + '-' + (i + 1) + '.png'), Buffer.from(shot.data, 'base64'));
        await key('ArrowRight', 'ArrowRight', 39);
      }
    }
    report.push({ width, initial, start, arrow, end, enter, keyboard: true, touch: width < 768, noAutomaticAdvance: true });
  }
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await navigate();
  const reducedMotion = await run(() => {
    const track = document.querySelector('[data-gallery-track]');
    document.querySelector('[data-gallery-next]').click();
    return { matches: matchMedia('(prefers-reduced-motion: reduce)').matches, immediateLeft: track.scrollLeft, motionElements: document.querySelectorAll('video').length };
  });
  assert(reducedMotion.matches && reducedMotion.immediateLeft > 100 && reducedMotion.motionElements === 0, 'Reduced motion is immediate');
  await call('Emulation.setScriptExecutionDisabled', { value: true });
  await navigate();
  const noJs = await run(() => ({
    controlsHidden: getComputedStyle(document.querySelector('[data-gallery-controls]')).display === 'none',
    captions: document.querySelectorAll('[data-image-gallery] figcaption').length,
    overflow: getComputedStyle(document.querySelector('[data-gallery-track]')).overflowX,
    focusable: document.querySelector('[data-gallery-track]').tabIndex === 0,
  }));
  assert(noJs.controlsHidden && noJs.captions === 5 && noJs.overflow === 'auto' && noJs.focusable, 'Usable no-JS fallback');
  await call('Emulation.setScriptExecutionDisabled', { value: false });
  const videoRequests = requests.filter(u => /vimeo|\.mp4|\.webm/i.test(u));
  assert(videoRequests.length === 0 && runtimeErrors.length === 0, 'No video requests or runtime errors');
  await writeFile(join(output, 'INTERACTION-REPORT.json'), JSON.stringify({ report, reducedMotion, noJs, videoRequests, runtimeErrors }, null, 2));
  console.log('PASS: five widths, buttons, keyboard, focus, native touch, reduced motion, no-JS, no video requests.');
} finally {
  if (socket && socket.readyState === WebSocket.OPEN) socket.close();
  browser.kill('SIGTERM');
}
