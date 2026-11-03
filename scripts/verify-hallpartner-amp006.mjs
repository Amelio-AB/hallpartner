/**
 * Headless Chrome DevTools visual checks without third-party dependencies.
 * Screenshots are captured after every image has decoded.
 * For internal QA only. No deploy, credentials, or production side effects.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { spawn } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const executable = process.env.HP_CHROME || 'google-chrome';
const url = process.env.HP_PREVIEW_URL || 'http://127.0.0.1:4321/stalhallar/';
const output = resolve(process.env.HP_SCREENSHOT_DIR || 'visual-review/amp006/interaction');
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

  const report = { commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), scenarios: [], errors: [] };
  socket.addEventListener('message', event => {
    const p = JSON.parse(event.data);
    if (p.method === 'Runtime.exceptionThrown') report.errors.push(p.params.exceptionDetails.text);
  });
  const waitFor = async expression => {
    for (let i = 0; i < 100; i++) {
      try { if (await evaluate(expression)) return; } catch { /* navigation */ }
      await sleep(100);
    }
    throw new Error('Timed out: ' + expression);
  };
  const open = async destination => {
    await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});
    await call('Page.navigate', { url: destination });
    await waitFor('document.readyState === "complete" && location.href === ' + JSON.stringify(destination));
    await evaluate('(async()=>{for(const i of document.images)i.loading="eager";await Promise.all([...document.images].map(i=>i.decode().catch(()=>null)));await document.fonts.ready;})()', true);
    await sleep(850);
  };
  const viewport = async (width, touch = false) => {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    await call('Emulation.setTouchEmulationEnabled', { enabled: touch, maxTouchPoints: 1 });
    // Headless Linux can retain a non-hover pointer after touch emulation.
    // Declare each scenario's input capabilities and verify the real media query.
    await call('Emulation.setEmulatedMedia', { features: [
      { name: 'hover', value: touch ? 'none' : 'hover' },
      { name: 'pointer', value: touch ? 'coarse' : 'fine' },
    ] });
    const capabilities = await evaluate('({hover:matchMedia("(hover:hover)").matches,fine:matchMedia("(pointer:fine)").matches})');
    assert.deepEqual(capabilities, { hover: !touch, fine: !touch }, 'Scenario input capabilities');
  };
  const key = async (key, code, value) => {
    await call('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: value });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: value });
  };
  const move = async index => {
    await evaluate('document.getElementById("stalhallar-use-cards").scrollIntoView({block:"center"})');
    const point = await evaluate(`(()=>{const r=document.querySelectorAll('#stalhallar-use-cards a')[${index}].getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+40}})()`);
    await call('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
    await sleep(850);
    return point;
  };
  const inspect = () => evaluate(`(()=>{
    const root=document.getElementById('stalhallar-use-cards');
    const luminance=rgb=>rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
    const contrast=a=>Math.min(...[...a.querySelectorAll('.ecg__category,h3,.ecg__description,.ecg__cta')].filter(n=>!n.closest('.ecg__details')||getComputedStyle(a.querySelector('.ecg__details')).opacity==='1').map(n=>{
      const box=a.getBoundingClientRect(),y=Math.max(0,Math.min(1,(n.getBoundingClientRect().top-box.top)/box.height));
      // Conservative white photograph under the theme's documented three-stop overlay.
      const alpha=y<=.52?.24+(.78-.24)*y/.52:.78+(.96-.78)*(y-.52)/.48;
      const bg=[7,26,22].map(v=>v*alpha+255*(1-alpha));
      const fg=getComputedStyle(n).color.match(/[0-9.]+/g).slice(0,3).map(Number);
      return (luminance(fg)+.05)/(luminance(bg)+.05);
    }));
    const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right}};
    return {enhanced:root.hasAttribute('data-ecg-enhanced'),overflow:document.documentElement.scrollWidth>innerWidth,
      h2:document.querySelectorAll('#anvandningsomraden h2').length,h3:root.querySelectorAll('h3').length,
      noindex:document.querySelector('meta[name=robots]').content,
      cards:[...root.querySelectorAll('a')].map(a=>({
        ...rect(a),href:a.pathname,active:a.hasAttribute('data-ecg-active'),focused:a===document.activeElement,
        outline:getComputedStyle(a).outlineWidth,contrast:contrast(a),
        title:a.querySelector('h3').textContent,category:a.querySelector('.ecg__category')?.textContent,
        details:getComputedStyle(a.querySelector('.ecg__details')).opacity,cta:getComputedStyle(a.querySelector('.ecg__cta')).opacity,
        fits:[...a.querySelectorAll('.ecg__content,h3,.ecg__category,.ecg__description,.ecg__cta')].every(n=>{if(n.closest('.ecg__details')&&getComputedStyle(a.querySelector('.ecg__details')).opacity==='0')return true;const r=rect(n),b=rect(a);return r.x>=b.x&&r.right<=b.right+.5&&r.bottom<=b.bottom+.5}),
        image:[...a.querySelectorAll('img')].map(i=>({loaded:i.complete&&i.naturalWidth>0,alt:i.alt,srcset:i.srcset,sizes:i.sizes,width:i.width,height:i.height})),
      }))};})()`);
  const shot = async (name, selector = '#anvandningsomraden') => {
    // Beyond-viewport capture triggers layout measurement in Chrome and can reset
    // active grid tracks. Capture the real desktop viewport without resizing it.
    if(selector==='#anvandningsomraden' && await evaluate('innerWidth>900')) {
      await evaluate('document.getElementById("anvandningsomraden").scrollIntoView({block:"start"})');
      await sleep(850);
      const r=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      await writeFile(join(output,name+'.png'),Buffer.from(r.data,'base64'));
      return r.data;
    }
    // Static mobile content can be captured beyond the viewport.
    await evaluate('window.scrollTo(0,0)');
    await sleep(100);
    const clip=await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()`);
    const r=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip});
    await writeFile(join(output,name+'.png'),Buffer.from(r.data,'base64'));
    return r.data;
  };
  const baseline = process.env.HP_BASELINE_URL;
  for (const width of [320,390,768,1280,1440]) {
    await viewport(width, width<=768);
    await open(url);
    await evaluate('document.getElementById("stalhallar-use-cards").scrollIntoView({block:"center"})');
    await evaluate('document.activeElement.blur()');
    const idle=await inspect();
    assert.equal(idle.cards.length,3); assert.equal(idle.h2,1); assert.equal(idle.h3,3);
    assert.match(idle.noindex,/noindex/); assert.equal(idle.overflow,false);
    for(const c of idle.cards){assert.ok(c.category&&c.fits,JSON.stringify({width,c}));assert.ok(c.contrast>=4.5,JSON.stringify({width,contrast:c.contrast}));assert.equal(c.image.length,1);assert.ok(c.image[0].loaded&&c.image[0].alt&&c.image[0].srcset&&c.image[0].sizes);}
    await shot(width+'-normal');
    if(width>900){
      assert.ok(idle.cards.every(c=>Math.abs(c.width-idle.cards[0].width)<1&&c.details==='0'), JSON.stringify({width,idle}));
      for(let index=0;index<3;index++){
        await move(index);
        const expanded=await inspect(); const active=expanded.cards[index];
        assert.ok(active.active&&active.details==='1'&&active.cta==='1'&&active.fits);assert.ok(active.contrast>=4.5);
        assert.ok(expanded.cards.every(c=>c.fits&&Math.abs(c.height-idle.cards[0].height)<1));
        assert.ok(Math.abs(active.width/expanded.cards[(index+1)%3].width-2)<.02);
        assert.ok(expanded.cards[0].right<=expanded.cards[1].x&&expanded.cards[1].right<=expanded.cards[2].x);
        await evaluate(`document.querySelectorAll('#stalhallar-use-cards a')[${index}].focus()`);
        await sleep(850);
        await shot(width+'-expanded-'+index);
        await evaluate('document.activeElement.blur()');
      }
      await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});
      await evaluate('document.activeElement.blur();document.querySelector("#stalhallar-use-cards a").focus()');
      await key('Tab','Tab',9); await sleep(850);
      const focused=await inspect(); assert.ok(focused.cards[1].focused&&focused.cards[1].active&&focused.cards[1].outline==='3px');
      await move(2); assert.ok((await inspect()).cards[1].active,'focus wins over pointer');
      await shot(width+'-keyboard');
      await key('Enter','Enter',13);
      await waitFor('location.pathname === "/stalhallar/maskinhall/"');
      await open(url); await move(0);
      const point=await move(0);
      await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
      await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});
      await waitFor('location.pathname === "/stalhallar/lagerhall/"');
    } else {
      assert.ok(idle.cards.every(c=>c.details==='1'&&c.cta==='1'));
      await evaluate('document.querySelector("#stalhallar-use-cards a").focus()');
      await shot(width+'-focus-static');
      for(let index=0;index<3;index++){
        await open(url);
        await evaluate(`document.querySelectorAll('#stalhallar-use-cards a')[${index}].scrollIntoView({block:'center'})`);
        const point=await evaluate(`(()=>{const r=document.querySelectorAll('#stalhallar-use-cards a')[${index}].getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+40}})()`);
        await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});
        await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
        await waitFor('location.pathname === '+JSON.stringify(idle.cards[index].href));
      }
    }
    // Existing destinations must actually return HTML and the intended heading.
    for(const c of idle.cards){const response=await fetch(new URL(c.href,url));assert.equal(response.status,200);assert.match(await response.text(),/<h1[\s>]/);}
    // Pixel and DOM preservation: compare independent baseline build when supplied.
    const preservation=[];
    if(baseline){
      for(const [name,selector] of [['header','header'],['hero','#stalhallar-intro'],['footer','footer']]){
        const states=[];
        for(const [label,destination] of [['before',baseline],['after',url]]){
          await open(destination);
          await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start'})`);
          await sleep(150);
          const text=await evaluate(`document.querySelector(${JSON.stringify(selector)}).textContent`);
          const pixels=await shot(width+'-'+name+'-'+label,selector);
          states.push({text,pixels});
        }
        assert.equal(states[0].text,states[1].text,name+' text changed');
        preservation.push({name,identicalPng:states[0].pixels===states[1].pixels});
      }
    }
    report.scenarios.push({width,touch:width<=768,idle,preservation,status:'PASS'});
  }
  // Coarse desktop: all details visible, no opening tap required.
  await viewport(1280,true); await open(url);
  assert.ok((await inspect()).cards.every(c=>c.details==='1'&&c.cta==='1'));
  report.scenarios.push({name:'coarse desktop',status:'PASS'});
  // Reduced motion: zero transitions and no decorative zoom.
  await viewport(1440); await call('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'hover'},{name:'pointer',value:'fine'},{name:'prefers-reduced-motion',value:'reduce'}]});
  await open(url); await move(0);
  const reduced=await evaluate(`(()=>{const a=document.querySelector('#stalhallar-use-cards a');return [...a.querySelectorAll('img,.ecg__details,.ecg__cta'),a.parentElement].map(n=>({duration:getComputedStyle(n).transitionDuration,transform:getComputedStyle(n).transform}))})()`);
  assert.ok(reduced.every(n=>n.duration==='0s'&&n.transform==='none'));
  report.scenarios.push({name:'reduced motion',status:'PASS'});
  // Progressive enhancement: disable JS before loading the real built page.
  await call('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'hover'},{name:'pointer',value:'fine'}]});
  await call('Emulation.setScriptExecutionDisabled',{value:true}); await open(url);
  const nojs=await inspect(); assert.equal(nojs.enhanced,false);assert.ok(nojs.cards.every(c=>c.details==='1'&&c.cta==='1'));
  report.scenarios.push({name:'no JavaScript',status:'PASS'});
  assert.deepEqual(report.errors,[]);
  await rm(join(output,'ERROR.txt'),{force:true});
  await writeFile(join(output,'REPORT.json'),JSON.stringify(report,null,2));
  console.log('AMP-006 Chrome PASS: five widths; hover 2:1; keyboard/focus priority; mouse/Enter/touch navigation; coarse desktop; reduced motion; no-JS.');
  console.log(JSON.stringify(report.scenarios.map(({width,name,status,preservation})=>({width,name,status,preservation})),null,2));
} catch(error){
  await writeFile(join(output,'ERROR.txt'),String(error.stack||error));
  console.error(error);process.exitCode=1;
} finally {
  if(socket&&socket.readyState===WebSocket.OPEN)socket.close();
  browser.kill('SIGTERM');
}