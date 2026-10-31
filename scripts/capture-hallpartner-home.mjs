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
const url = process.env.HP_PREVIEW_URL || 'http://127.0.0.1:4321/prototype/hallpartner/start/';
const output = resolve(process.env.HP_SCREENSHOT_DIR || 'visual-review');
const expectedPath = new URL(url).pathname;
const prefix = process.env.HP_SCREENSHOT_PREFIX || 'validated';
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

  const report = [];
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    await call('Emulation.setDeviceMetricsOverride', {
      width: viewport.width, height: viewport.height,
      deviceScaleFactor: 1, mobile: false,
    });
    await call('Page.navigate', { url });
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        ready = await evaluate('document.readyState === "complete" && location.pathname === ' + JSON.stringify(expectedPath)) === true;
      } catch {
        // A navigation can reset the execution context temporarily.
      }
      if (ready) break;
      await sleep(100);
    }
    if (!ready) throw new Error(viewport.name + ' document never became ready');

    const metrics = await evaluate('(async function(){' +
      'for(const img of document.images) img.loading = "eager";' +
      'await Promise.all([...document.images].map(img=>img.decode().catch(()=>null)));' +
      'await document.fonts.ready;' +
      'window.scrollTo(0,document.body.scrollHeight);' +
      'await new Promise(r=>setTimeout(r,300));' +
      'window.scrollTo(0,0);' +
      'return {h1Count:document.querySelectorAll("h1").length,' +
      'navCount:document.querySelectorAll("nav").length,' +
      'overflow:document.documentElement.scrollWidth>window.innerWidth,' +
      'images:[...document.images].map(img=>({loaded:img.complete&&img.naturalWidth>0,src:img.currentSrc||img.src}))};' +
      '})()', true);

    if (viewport.name === 'mobile') {
      metrics.menu = await evaluate('(()=>{' +
        'const toggle=document.querySelector("[data-hp-nav-toggle]");' +
        'const nav=document.querySelector("#hp-proto-nav");' +
        'if(!toggle||!nav)return {error:"Missing mobile controls"};' +
        'const before=toggle.getAttribute("aria-expanded");' +
        'toggle.click();' +
        'const opened=toggle.getAttribute("aria-expanded");' +
        'const visible=getComputedStyle(nav).display!=="none";' +
        'document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}));' +
        'return {before,opened,visible,closed:toggle.getAttribute("aria-expanded")};' +
        '})()');
    }

    const layout = await call('Page.getLayoutMetrics');
    const dimensions = layout.cssContentSize || layout.contentSize;
    const shot = await call('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: true, fromSurface: true,
      clip: { x: 0, y: 0, width: Math.ceil(dimensions.width), height: Math.ceil(dimensions.height), scale: 1 },
    });
    const filename = prefix + '-' + viewport.name + '-full.png';
    await writeFile(join(output, filename), Buffer.from(shot.data, 'base64'));
    report.push({ viewport, filename, ...metrics });
  }
  await writeFile(join(output, prefix + '-REPORT.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  for (const page of report) {
    if (page.h1Count !== 1 || page.navCount !== 1 || page.overflow || page.images.some(i => !i.loaded)) {
      throw new Error('Invalid rendered page on ' + page.viewport.name);
    }
  }
  const mobile = report.find(page => page.viewport.name === 'mobile')?.menu;
  if (!mobile || mobile.before !== 'false' || mobile.opened !== 'true' || !mobile.visible || mobile.closed !== 'false') {
    throw new Error('Mobile toggle / Escape interaction failed');
  }
} catch (error) {
  await writeFile(join(output, prefix + '-ERROR.txt'), String(error));
  console.error('Visual QA failed:', error);
  process.exitCode = 1;
} finally {
  if (socket && socket.readyState === WebSocket.OPEN) socket.close();
  browser.kill('SIGTERM');
}
