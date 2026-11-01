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
  // Cover narrow mobile, common mobile, tablet and desktop breakpoints.
  // These are real rendered Chrome viewports, not stylesheet-only checks.
  for (const viewport of [
    { name: 'mobile-320', width: 320, height: 720 },
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'desktop-1280', width: 1280, height: 800 },
    { name: 'desktop', width: 1440, height: 900 },
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

    if (expectedPath.endsWith('/start/')) {
      metrics.heroState = await evaluate("(async function(){\n const hero=document.querySelector('.hp-home-hero[data-hero]');\n const header=document.querySelector('.hp-draft-header');\n const image=document.querySelector('.hp-home-hero__background');\n if(!hero||!header||!image)return {error:'Missing hero/header/image'};\n await new Promise(resolve=>setTimeout(resolve,240));\n const imageRect=image.getBoundingClientRect(),heroRect=hero.getBoundingClientRect();\n const initial={headerOverlay:header.classList.contains('hp-draft-header--overlay'),transparent:!header.classList.contains('hp-draft-header--solid')&&getComputedStyle(header).backgroundColor==='rgba(0, 0, 0, 0)',headerOverHero:Math.abs(header.getBoundingClientRect().top-heroRect.top)<3,fullWidth:Math.abs(heroRect.width-document.documentElement.clientWidth)<3,cover:getComputedStyle(image).objectFit==='cover'&&Math.abs(imageRect.width-heroRect.width)<3,imageLoaded:image.complete&&image.naturalWidth===1916&&image.currentSrc.includes('/images/hallpartner-hero-temporary.webp')};\n const questionWidths=[...document.querySelectorAll('.hp-home-planning__list li > div')].map(node=>Math.round(node.getBoundingClientRect().width));\n window.scrollTo(0,Math.ceil(heroRect.height+160));window.dispatchEvent(new Event('scroll'));\n await new Promise(resolve=>setTimeout(resolve,240));\n const solidOnExit=header.classList.contains('hp-draft-header--solid');\n window.scrollTo(0,0);window.dispatchEvent(new Event('scroll'));\n await new Promise(resolve=>setTimeout(resolve,240));\n const transparentOnReturn=!header.classList.contains('hp-draft-header--solid');\n return {...initial,solidOnExit,transparentOnReturn,minQuestionWidth:Math.min(...questionWidths)};\n})()", true);
    }

    // A valid hash alone is insufficient: the fixed header must not cover the target heading.
    // This exercises the actual Hero CTA and overview links in a rendered browser.
    if (expectedPath.endsWith('/start/')) {
      metrics.anchorClearance = await evaluate("(async function(){\n" +
        "const header=document.querySelector('.hp-draft-header');\n" +
        "const main=document.getElementById('main-content');\n" +
        "const checks=[];\n" +
        "for(const hash of ['#halltyper','#att-tanka-pa']){\n" +
        "const link=document.querySelector('a[href=\"'+hash+'\"]');\n" +
        "const target=document.querySelector(hash);\n" +
        "if(!link||!target)return {error:'Missing CTA or anchor: '+hash};\n" +
        "link.click();await new Promise(done=>setTimeout(done,180));\n" +
        "const top=target.getBoundingClientRect().top, headerBottom=header.getBoundingClientRect().bottom;\n" +
        "checks.push({hash,top:Math.round(top),headerBottom:Math.round(headerBottom),cleared:top>=headerBottom-1});\n" +
        "}\n" +
        "window.scrollTo(0,0);await new Promise(done=>setTimeout(done,180));\n" +
        "return {checks,skipFocusable:main?.tabIndex===-1};\n" +
        "})()", true);
    }

    if (expectedPath === '/') {
      metrics.siteLogo = await evaluate('(()=>{' +
        'const image=document.querySelector(".hp-site .hp-draft-brand img.hp-site-logo");' +
        'const wrapper=document.querySelector(".hp-draft-header__inner");' +
        'const sibling=window.innerWidth<=800?document.querySelector("[data-hp-nav-toggle]"):document.querySelector("#hp-proto-nav");' +
        'if(!image||!wrapper||!sibling)return {error:"Missing logo/header/navigation"};' +
        'const logo=image.getBoundingClientRect(), header=wrapper.getBoundingClientRect(), neighbor=sibling.getBoundingClientRect();' +
        'return {loaded:image.complete&&image.naturalWidth===1536&&image.naturalHeight===274,' +
        'alt:image.alt==="Hallpartner – Hallar till alla",' +
        'src:image.currentSrc.includes("/images/logo_text_white.png"),' +
        'ratio:Math.abs(logo.width/logo.height-1536/274)<0.05,' +
        'insideHeader:logo.top>=header.top-2&&logo.bottom<=header.bottom+2,' +
        'insideViewport:logo.left>=-1&&logo.right<=innerWidth+1,' +
        'noNavOverlap:logo.right<=neighbor.left+2,' +
        'visible:logo.height>=22&&logo.height<=65};' +
        '})()');
    }

    if (viewport.width <= 800) {
      metrics.menu = await evaluate('(()=>{' +
        'const toggle=document.querySelector("[data-hp-nav-toggle]");' +
        'const nav=document.querySelector("#hp-proto-nav");' +
        'if(!toggle||!nav)return {error:"Missing mobile controls"};' +
        'const before=toggle.getAttribute("aria-expanded");' +
        'toggle.click();' +
        'const opened=toggle.getAttribute("aria-expanded");' +
        'const visible=getComputedStyle(nav).display!=="none";' +
        'const solidWhenOpen=document.querySelector(".hp-home-hero")?document.querySelector(".hp-draft-header")?.classList.contains("hp-draft-header--solid"):null;' +
        'document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}));' +
        'const transparentAfterEscape=document.querySelector(".hp-home-hero")?!document.querySelector(".hp-draft-header")?.classList.contains("hp-draft-header--solid"):null;' +
        'const closedByEscape=toggle.getAttribute("aria-expanded");' +
        'toggle.click();' +
        'const reopened=toggle.getAttribute("aria-expanded");' +
        'document.querySelector("main")?.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true,pointerType:"touch"}));' +
        'const closedAfterOutside=toggle.getAttribute("aria-expanded");' +
        'const transparentAfterOutside=document.querySelector(".hp-home-hero")?!document.querySelector(".hp-draft-header")?.classList.contains("hp-draft-header--solid"):null;' +
        'return {before,opened,visible,closed:closedByEscape,solidWhenOpen,transparentAfterEscape,reopened,closedAfterOutside,transparentAfterOutside};' +
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
    if (page.h1Count !== 1 || page.navCount !== (expectedPath === '/stalhallar/' ? 3 : 1) || page.overflow || page.images.some(i => !i.loaded)) {
      throw new Error('Invalid rendered page on ' + page.viewport.name);
    }
  }
  for (const page of report.filter(page => page.siteLogo)) {
    const logo = page.siteLogo;
    if (logo.error || !logo.loaded || !logo.alt || !logo.src || !logo.ratio || !logo.insideHeader || !logo.insideViewport || !logo.noNavOverlap || !logo.visible) {
      throw new Error('Hallpartner logo layout failed at ' + page.viewport.width + 'px: ' + JSON.stringify(logo));
    }
  }
  const homePages = report.filter(page => page.heroState);
  for (const page of homePages) {
    const h = page.heroState;
    if (h.error || !h.headerOverlay || !h.transparent || !h.headerOverHero || !h.fullWidth || !h.cover || !h.imageLoaded || !h.solidOnExit || !h.transparentOnReturn || h.minQuestionWidth < 180) {
      throw new Error('Home hero/header/list layout failed on ' + page.viewport.name + ': ' + JSON.stringify(h));
    }
  }
  for (const page of homePages) {
    const a = page.anchorClearance;
    if (!a || a.error || !a.skipFocusable || a.checks.length !== 2 || a.checks.some(check => !check.cleared)) {
      throw new Error('Hero CTA anchor is obscured by fixed header on ' + page.viewport.name + ': ' + JSON.stringify(a));
    }
  }
  for (const page of report.filter(page => page.viewport.width <= 800)) {
    const mobile = page.menu;
    if (!mobile || mobile.before !== 'false' || mobile.opened !== 'true' || !mobile.visible || mobile.closed !== 'false' || mobile.reopened !== 'true' || mobile.closedAfterOutside !== 'false' || (homePages.length && (!mobile.solidWhenOpen || !mobile.transparentAfterEscape || !mobile.transparentAfterOutside))) {
      throw new Error('Mobile toggle / Escape / outside-tap interaction failed at ' + page.viewport.width + 'px: ' + JSON.stringify(mobile));
    }
  }
} catch (error) {
  await writeFile(join(output, prefix + '-ERROR.txt'), String(error));
  console.error('Visual QA failed:', error);
  process.exitCode = 1;
} finally {
  if (socket && socket.readyState === WebSocket.OPEN) socket.close();
  browser.kill('SIGTERM');
}
