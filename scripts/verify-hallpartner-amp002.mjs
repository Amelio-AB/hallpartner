/** Local built-site QA: Spacious, actual font scaling, keyboard and history. Never send leads. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { createChromeSession, openChromeSocket } from './preview/chrome-session.mjs';

const origin = process.env.HP_PREVIEW_ORIGIN || 'http://127.0.0.1:4321';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(origin).hostname), 'Local candidate only');
const output = resolve(process.env.HP_SCREENSHOT_DIR || 'reports/amp002/after');
const baseline = process.env.HP_AMP002_BASELINE === 'true';
const widths = [320, 390, 768, 1024, 1025, 1100, 1200, 1280, 1440, 1920];
const report = [];
await mkdir(output, { recursive: true });

for (const fontScale of baseline ? [1] : [1, 2]) {
  // Change the browser's default font, including rem-based media queries, rather
  // than enlarging a screenshot or using deviceScaleFactor (neither is text zoom).
  const session = await createChromeSession({ args: fontScale === 2 ? ['--blink-settings=defaultFontSize=32,defaultFixedFontSize=26'] : [] });
  let socket, capture, current = 'startup';
  try {
    socket = await openChromeSocket(await session.ready());
    let sequence = 0, blockedRequests = 0;
    const pending = new Map(), errors = [];
    const call = (method, params = {}) => new Promise((done, fail) => {
      const id = ++sequence;
      const timer = setTimeout(() => { pending.delete(id); fail(Error(method + ' timeout')); }, 20000);
      pending.set(id, { done, fail, timer });
      socket.send(JSON.stringify({ id, method, params }));
    });
    socket.addEventListener('message', event => {
      const packet = JSON.parse(event.data);
      if (packet.method === 'Runtime.exceptionThrown') errors.push(packet.params.exceptionDetails.text);
      if (packet.method === 'Fetch.requestPaused') {
        blockedRequests++;
        call('Fetch.failRequest', { requestId: packet.params.requestId, errorReason: 'BlockedByClient' }).catch(() => {});
      }
      const entry = pending.get(packet.id);
      if (!entry) return;
      pending.delete(packet.id); clearTimeout(entry.timer);
      if (packet.error) entry.fail(Error(packet.error.message)); else entry.done(packet.result);
    });
    const evaluate = async expression => {
      const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const run = fn => evaluate('(' + fn.toString() + ')()');
    const waitFor = async expression => {
      for (let i = 0; i < 100; i++) {
        try { if (await evaluate(expression)) return; } catch { /* navigation replaces the context */ }
        await sleep(100);
      }
      throw Error('Timed out: ' + expression);
    };
    const navigate = async path => {
      await call('Page.navigate', { url: new URL(path, origin).href });
      await waitFor('location.pathname===' + JSON.stringify(path) + '&&document.readyState==="complete"&&document.body?.dataset.ampReady==="true"');
      await evaluate('document.fonts.ready.then(()=>new Promise(r=>setTimeout(r,150)))');
    };
    const key = async name => {
      const code = { Enter: 13, Escape: 27, Tab: 9 }[name];
      await call('Input.dispatchKeyEvent', { type: name === 'Enter' ? 'keyDown' : 'rawKeyDown', key: name, code: name,
        windowsVirtualKeyCode: code, ...(name === 'Enter' ? { text: '\r' } : {}) });
      await call('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code: name, windowsVirtualKeyCode: code });
    };
    const pointer = async (selector, click = false) => {
      const box = await evaluate('(()=>{const r=document.querySelector(' + JSON.stringify(selector) + ').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()');
      await call('Input.dispatchMouseEvent', { type: 'mouseMoved', ...box });
      if (click) {
        await call('Input.dispatchMouseEvent', { type: 'mousePressed', ...box, button: 'left', clickCount: 1 });
        await call('Input.dispatchMouseEvent', { type: 'mouseReleased', ...box, button: 'left', clickCount: 1 });
      }
    };
    capture = async name => {
      const shot = await call('Page.captureScreenshot', { format: 'png', fromSurface: true });
      await writeFile(join(output, name + '.png'), Buffer.from(shot.data, 'base64'));
    };
    const allTrue = (data, label) => assert.ok(Object.values(data).every(x => x === true), label + ': ' + JSON.stringify(data));
    await call('Page.enable'); await call('Runtime.enable');
    await call('Fetch.enable', { patterns: [{ urlPattern: '*/api/*', requestStage: 'Request' }] });

    for (const width of widths) {
      await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
      for (const [name, path] of [['home', '/'], ['solid', '/sa-gar-det-till/']]) {
        current = name + '-' + width + '-font' + fontScale;
        await navigate(path);
        const metrics = await run(() => {
          const header = document.querySelector('header.hm');
          const desktop = getComputedStyle(header.querySelector('.hm__desktop')).display !== 'none';
          const bar = header.querySelector(desktop ? '.hm__desktop' : '.hm__mobile-bar');
          const visible = [...bar.querySelectorAll('.hm__logo')].find(x => x.getBoundingClientRect().height);
          const logo = visible.getBoundingClientRect();
          const controls = desktop ? [...bar.querySelectorAll('.hm__nav-list > li > a, .hm__nav-list > li > button, .hm__cta')] : [bar.querySelector('.hm__mobile-toggle')];
          const boxes = controls.map(x => x.getBoundingClientRect());
          const nav = bar.querySelector('.hm__desktop-nav');
          const cta = bar.querySelector('.hm__cta');
          const rect = bar.getBoundingClientRect();
          const items = [...bar.querySelectorAll('.hm__nav-list > li')].map(x => x.getBoundingClientRect());
          return { desktop, appearance: header.dataset.navigationAppearance, rootFont: parseFloat(getComputedStyle(document.documentElement).fontSize),
            font: parseFloat(getComputedStyle(controls[0]).fontSize), weight: getComputedStyle(controls[0]).fontWeight,
            surface: header.dataset.surface, color: getComputedStyle(controls[0]).color,
            checks: {
              headerFits: rect.left >= -1 && rect.right <= innerWidth + 1,
              logoFits: logo.left >= 0 && logo.right <= boxes[0].left && logo.height > 0,
              controlsFit: boxes.every(b => b.left >= logo.right && b.right <= rect.right && b.height >= 44),
              noClippedText: controls.every(x => x.scrollWidth <= x.clientWidth + 1),
              itemsSeparate: items.every((b, i) => i === 0 || b.left >= items[i - 1].right),
              ctaSeparate: !desktop || nav.getBoundingClientRect().right <= cta.getBoundingClientRect().left,
              fallbackHidden: document.querySelector('#hp-amp-header-fallback').hidden,
              noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
              headingClear: !!document.querySelector('.hp-home-hero') || document.querySelector('h1').getBoundingClientRect().top >= header.getBoundingClientRect().bottom - 2,
            } };
        });
        report.push({ name: current, width, fontScale, ...metrics });
        if (!baseline) {
          assert.equal(metrics.appearance, 'spacious');
          allTrue(metrics.checks, current);
          if (metrics.desktop) { assert.ok(metrics.font >= 16); assert.equal(metrics.weight, '600'); }
        }
        assert.equal(metrics.rootFont, 16 * fontScale, 'Actual browser text size');
        assert.equal(metrics.surface, name === 'home' ? 'transparent' : 'solid');
        await capture(current);
        if (baseline) continue;

        const opener = metrics.desktop ? '.hm__desktop .hm__disclosure' : '.hm__mobile-toggle';
        // Reach the first header control through real Tab events and verify visible focus.
        await key('Tab');
        for (let i = 0; i < 12 && !(await evaluate('document.activeElement?.matches(' + JSON.stringify(opener) + ')')); i++) await key('Tab');
        allTrue(await run(() => {
          const focused = document.activeElement, style = getComputedStyle(focused);
          return { inHeader: !!focused.closest('header.hm'), visible: focused.matches(':focus-visible'), outline: parseFloat(style.outlineWidth) >= 2 && style.outlineStyle !== 'none' };
        }), current + ' keyboard focus');
        await capture(current + '-focus');
        await key('Enter'); await sleep(260);
        allTrue(await evaluate(`(()=>{const b=document.querySelector(${JSON.stringify(opener)});const panel=document.querySelector(${JSON.stringify(metrics.desktop ? '.hm__desktop .hm__submenu' : '.hm__mobile-dialog')});return {expanded:b.getAttribute('aria-expanded')==='true',panelVisible:panel.getBoundingClientRect().height>0,allCategories:panel.querySelectorAll('a[href^="/stalhallar/"]').length>=6}})()`), current + ' keyboard open');
        if (!metrics.desktop) {
          await evaluate('document.querySelector(".hm__mobile-dialog summary").click()');
          assert.equal(await evaluate('document.body.style.overflow'), 'hidden');
        }
        if ([390, 1025, 1440].includes(width)) await capture(current + '-menu');
        await key('Escape'); await sleep(260);
        allTrue(await evaluate(`(()=>{const b=document.querySelector(${JSON.stringify(opener)});return {closed:b.getAttribute('aria-expanded')==='false',focus:document.activeElement===b,scrollRestored:document.body.style.overflow!=='hidden'}})()`), current + ' Escape');
        if (metrics.desktop) {
          await pointer(opener); await sleep(260);
          assert.equal(await evaluate('document.querySelector(".hm__desktop .hm__disclosure").getAttribute("aria-expanded")'), 'true', 'Mouse hover');
          await key('Escape');
          await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: 450 });
        }
        if (name === 'home') {
          await evaluate('document.activeElement.blur();window.scrollTo(0,document.querySelector(".hp-home-hero").offsetHeight+200)');
          await sleep(300);
          assert.equal(await evaluate('document.querySelector("header.hm").dataset.surface'), 'solid');
          await evaluate('window.scrollBy(0,-100)'); await sleep(300);
          if ([390, 1440].includes(width)) await capture(current + '-scrolled');
          await evaluate('window.scrollTo(0,0)'); await sleep(300);
          assert.equal(await evaluate('document.querySelector("header.hm").dataset.surface'), 'transparent');
        }
      }
    }

    if (!baseline) {
      // Real link navigation plus browser history, with either mobile or desktop.
      await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
      await navigate('/');
      const desktop = await evaluate('matchMedia("(min-width:64.001rem)").matches');
      await pointer(desktop ? '.hm__desktop .hm__disclosure' : '.hm__mobile-toggle', true); await sleep(260);
      if (!desktop) await evaluate('document.querySelector(".hm__mobile-dialog summary").click()');
      const scope = desktop ? '.hm__desktop' : '.hm__mobile-dialog';
      await pointer(scope + ' a[href="/stalhallar/lagerhall/"]', true);
      await waitFor('location.pathname==="/stalhallar/lagerhall/"&&document.body?.dataset.ampReady==="true"');
      allTrue(await run(() => ({ section: !!document.querySelector('.hm__nav-item[data-current-section] .hm__disclosure'),
        exactLink: !!document.querySelector('a[href="/stalhallar/lagerhall/"][aria-current="page"]'),
        buttonNotPage: !document.querySelector('button[aria-current]') })), 'Current hall section');
      await evaluate('history.back()');
      await waitFor('location.pathname==="/"&&document.body?.dataset.ampReady==="true"');
      assert.equal(await evaluate('document.querySelectorAll("header.hm").length'), 1);
      await pointer(desktop ? '.hm__desktop .hm__disclosure' : '.hm__mobile-toggle', true); await sleep(260);
      assert.equal(await evaluate('document.querySelector(' + JSON.stringify(desktop ? '.hm__desktop .hm__disclosure' : '.hm__mobile-toggle') + ').getAttribute("aria-expanded")'), 'true', 'Restored history menu works');
      await key('Escape'); await sleep(260);
      await evaluate('history.forward()');
      await waitFor('location.pathname==="/stalhallar/lagerhall/"&&document.body?.dataset.ampReady==="true"');
      assert.ok(await evaluate('!!document.querySelector(".hm__nav-item[data-current-section] .hm__disclosure")'));
      await navigate('/kontakt/');
      assert.ok(await run(() => !!document.querySelector('.hm__desktop a[href="/kontakt/"][aria-current="page"]')));
      await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 1, mobile: false });
      await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await navigate('/');
      const touch = await run(() => { const r = document.querySelector('.hm__mobile-toggle').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      await call('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [touch] });
      await call('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await waitFor('document.querySelector(".hm__mobile-dialog").open');
      for (let i = 0; i < 12; i++) {
        await key('Tab');
        // Native dialogs may yield Tab to browser chrome (activeElement becomes
        // body); no focusable element in the inert page may receive focus.
        const focus = await run(() => ({ inside: !!document.activeElement.closest('dialog.hm__mobile-dialog'),
          browserChrome: document.activeElement === document.body, tag: document.activeElement.tagName }));
        assert.ok(focus.inside || focus.browserChrome, 'Native modal focus boundary: ' + JSON.stringify(focus));
      }
      // Return focus from browser chrome before checking the document's Escape handler.
      await evaluate('document.querySelector(".hm__mobile-close").focus()');
      await key('Escape');
      assert.equal(await evaluate('document.querySelector(".hm__mobile-dialog").open'), false, 'Reduced motion closes immediately');
      assert.equal(blockedRequests, 0, 'No attempted API requests');
      assert.deepEqual(errors, [], 'No JavaScript exceptions');
    }
  } catch (error) {
    if (capture) await capture('FAILURE-' + current).catch(() => {});
    throw error;
  } finally {
    await writeFile(join(output, 'report.json'), JSON.stringify({ baseline, widths, scenarios: report }, null, 2));
    if (socket?.readyState === WebSocket.OPEN) socket.close();
    await session.close(join(output, 'chrome-font' + fontScale + '.json'));
  }
}
await writeFile(join(output, 'report.json'), JSON.stringify({ status: 'passed', baseline, widths, scenarios: report }, null, 2));
console.log(`PASS AMP-002: ${report.length} viewport/surface/text-size scenarios${baseline ? ' (baseline)' : ', keyboard, hover, Escape and history; no API requests'}.`);
