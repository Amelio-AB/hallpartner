/** Chrome checks on real visitor routes. No publication or form delivery. */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const url=process.env.HP_PREVIEW_URL||'http://127.0.0.1:4321/';
const expectedPath=new URL(url).pathname;
const output=resolve(process.env.HP_SCREENSHOT_DIR||'visual-review');
const prefix=process.env.HP_SCREENSHOT_PREFIX||'validated';
const sections=(process.env.HP_SCREENSHOT_SECTIONS||'').split(',').filter(Boolean);
assert.match(prefix,/^[a-z0-9-]+$/i);
for(const id of sections)assert.match(id,/^[a-z0-9-]+$/i);
const port=9300+process.pid%300;
const profile=await mkdtemp(join(tmpdir(),'hp-site-cdp-'));
const browser=spawn(process.env.HP_CHROME||'google-chrome',[
  '--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
  '--disable-background-networking','--no-first-run','--no-default-browser-check',
  '--remote-allow-origins=*','--remote-debugging-port='+port,'--user-data-dir='+profile,'about:blank',
],{stdio:['ignore','ignore','pipe']});
let startupError, socket, captureFailure;
let diagnostics='';
browser.on('error',error=>{startupError=error;});
browser.stderr.on('data',chunk=>{diagnostics=(diagnostics+chunk).slice(-65536);});
await mkdir(output,{recursive:true});
const report=[];
try {
  let target;
  for(let attempt=0;attempt<160;attempt++) {
    if(startupError)throw startupError;
    if(browser.exitCode!==null||browser.signalCode!==null)throw Error('Chrome exited before startup');
    try {
      const response=await fetch('http://127.0.0.1:'+port+'/json',{signal:AbortSignal.timeout(1000)});
      if(response.ok)target=(await response.json()).find(page=>page.type==='page'&&page.webSocketDebuggerUrl);
    }catch{/* Chrome may not have opened its debugging port yet. */}
    if(target)break;
    await sleep(150);
  }
  assert.ok(target,'Chrome debugging target unavailable');
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((done,fail)=>{
    const timer=setTimeout(()=>fail(Error('WebSocket startup timeout')),8000);
    socket.addEventListener('open',()=>{clearTimeout(timer);done();},{once:true});
    socket.addEventListener('error',event=>{clearTimeout(timer);fail(event);},{once:true});
  });
  let sequence=0;
  const pending=new Map(),browserErrors=[];
  socket.addEventListener('message',event=>{
    const packet=JSON.parse(event.data);
    if(packet.method==='Runtime.exceptionThrown')browserErrors.push(packet.params.exceptionDetails.text);
    if(packet.method==='Runtime.consoleAPICalled'&&packet.params.type==='error')browserErrors.push(packet.params.args.map(arg=>arg.value||arg.description||'').join(' '));
    if(!packet.id||!pending.has(packet.id))return;
    const entry=pending.get(packet.id);pending.delete(packet.id);clearTimeout(entry.timer);
    if(packet.error)entry.reject(Error(packet.error.message));else entry.resolve(packet.result);
  });
  const call=(method,params={})=>new Promise((done,fail)=>{
    const id=++sequence;
    const timer=setTimeout(()=>{pending.delete(id);fail(Error(method+' timeout'));},20000);
    pending.set(id,{resolve:done,reject:fail,timer});socket.send(JSON.stringify({id,method,params}));
  });
  const evaluate=async(expression,awaitPromise=false)=>{
    const result=await call('Runtime.evaluate',{expression,awaitPromise,returnByValue:true});
    if(result.exceptionDetails)throw Error('Browser evaluation: '+JSON.stringify(result.exceptionDetails));
    return result.result?.value;
  };
  const run=fn=>evaluate('('+fn.toString()+')()',true);
  const key=async name=>{
    const code=name==='Escape'?27:13;
    // Native Enter text is required for default activation of a focused HTML button.
    await call('Input.dispatchKeyEvent',{
      type:name==='Enter'?'keyDown':'rawKeyDown',key:name,code:name,
      windowsVirtualKeyCode:code,nativeVirtualKeyCode:code,
      ...(name==='Enter'?{text:'\r',unmodifiedText:'\r'}:{}),
    });
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:name,code:name,windowsVirtualKeyCode:code,nativeVirtualKeyCode:code});
  };
  const allTrue=(result,label)=>assert.ok(result&&Object.values(result).every(value=>value===true),label+': '+JSON.stringify(result));
  const capture=async(filename,clip)=>{
    const shot=await call('Page.captureScreenshot',{format:'png',fromSurface:true,...(clip?{captureBeyondViewport:true,clip}:{})});
    await writeFile(join(output,filename),Buffer.from(shot.data,'base64'));
  };
  captureFailure=()=>capture(prefix+'-FAILURE.png');
  await call('Runtime.enable');await call('Page.enable');
  for(const width of [320,390,768,1024,1280,1440]) {
    const viewport={width,height:width<800?844:900};
    await call('Emulation.setDeviceMetricsOverride',{...viewport,deviceScaleFactor:1,mobile:false});
    await call('Page.navigate',{url});
    let ready=false;
    for(let attempt=0;attempt<120;attempt++) {
      try{ready=await evaluate('document.readyState==="complete" && document.body?.dataset.ampReady==="true" && location.pathname==='+JSON.stringify(expectedPath));}catch{/* Navigation resets its execution context. */}
      if(ready)break;
      await sleep(100);
    }
    assert.ok(ready,'AMP-002 did not mount on '+expectedPath+' at '+width);
    const metrics=await run(async function(){
      for(const image of document.images)image.loading='eager';
      await Promise.all([...document.images].map(image=>image.decode().catch(()=>null)));
      await document.fonts.ready;window.scrollTo(0,0);await new Promise(done=>setTimeout(done,250));
      const root=document.querySelector('header.hm'),header=root.getBoundingClientRect();
      const bar=root.querySelector(innerWidth<=1024?'.hm__mobile-bar':'.hm__desktop');
      // AMP hides one of its solid/hero logo variants. Measure the visible logo only.
      const logos=[...bar.querySelectorAll('img.hm__logo')].filter(image=>image.getBoundingClientRect().height>0);
      const logo=logos[0];if(!logo)throw Error('No visible AMP logo in active header bar');
      const box=logo.getBoundingClientRect();
      const sibling=bar.querySelector(innerWidth<=1024?'.hm__mobile-toggle':'.hm__desktop-nav');
      return {
        h1:document.querySelectorAll('h1').length,header:document.querySelectorAll('header.hm').length,
        visibleHeaders:[...document.querySelectorAll('header')].filter(node=>getComputedStyle(node).display!=='none').length,
        footer:document.querySelectorAll('footer').length,ampFooter:!!document.querySelector('footer.af--compact'),
        noindex:document.querySelector('meta[name="robots"]')?.content==='noindex,nofollow',
        fallbackHidden:document.querySelector('#hp-amp-header-fallback')?.hidden===true,
        noOverflow:document.documentElement.scrollWidth<=innerWidth+1,
        images:[...document.images].every(image=>image.complete&&image.naturalWidth>0),surface:root.dataset.surface,
        headingClear:!!document.querySelector('.hp-home-hero')||document.querySelector('h1').getBoundingClientRect().top>=header.bottom-2,
        logo:{oneVisible:logos.length===1,loaded:logo.naturalWidth===1536&&logo.naturalHeight===274,source:logo.currentSrc.includes('/images/logo_text_white.png'),ratio:Math.abs(box.width/box.height-1536/274)<.05,inViewport:box.left>=-1&&box.right<=innerWidth+1,visible:box.height>=22&&box.height<=65,noOverlap:!!sibling&&box.right<=sibling.getBoundingClientRect().left+2},
      };
    });
    const entry={viewport,metrics,status:'in-progress'};report.push(entry);
    assert.equal(metrics.h1,1);assert.equal(metrics.header,1);assert.equal(metrics.visibleHeaders,1);assert.equal(metrics.footer,1);
    assert.equal(metrics.ampFooter,process.env.HALLPARTNER_FOOTER_MODE!=='legacy');
    for(const field of ['noindex','fallbackHidden','noOverflow','images','headingClear'])assert.ok(metrics[field],width+': '+field);
    assert.equal(metrics.surface,expectedPath==='/'?'transparent':'solid');allTrue(metrics.logo,width+': logo');
    if(width<=1024) {
      metrics.menu=await run(function(){
        const root=document.querySelector('header.hm'),button=root.querySelector('button.hm__mobile-toggle');
        const dialog=root.querySelector('dialog.hm__mobile-dialog'),rect=button.getBoundingClientRect();
        const initial=button.getAttribute('aria-expanded')==='false'&&button.getAttribute('aria-label')==='Öppna meny'&&button.getAttribute('aria-controls')===dialog.id;
        button.click();const details=dialog.querySelector('details');details.querySelector('summary').click();
        return {initial,hitTarget:rect.width>=44&&rect.height>=44,icon:button.classList.contains('hm__mobile-toggle--icon')&&button.querySelectorAll('.hm__toggle-line').length===3&&button.textContent.trim()==='',opened:dialog.open&&button.getAttribute('aria-expanded')==='true',scrollLock:document.body.style.overflow==='hidden',halls:details.open&&!!details.querySelector('a[href="/stalhallar/lagerhall/"]'),closeIcon:!!dialog.querySelector('.hm__mobile-close--icon[aria-label="Stäng meny"]')};
      });
      await sleep(300);
      metrics.menu.rightEdge=await evaluate('Math.abs(document.querySelector("dialog.hm__mobile-dialog").getBoundingClientRect().right-innerWidth)<=2');
      allTrue(metrics.menu,width+': mobile opening');await capture(prefix+'-'+width+'-menu-open.png');
      await key('Escape');await sleep(350);
      allTrue(await run(function(){const button=document.querySelector('button.hm__mobile-toggle');return {closed:!document.querySelector('dialog.hm__mobile-dialog').open,aria:button.getAttribute('aria-expanded')==='false',focus:document.activeElement===button,scroll:document.body.style.overflow!=='hidden'};}),width+': Escape');
      await key('Enter');await sleep(300);
      assert.ok(await evaluate('document.querySelector("dialog.hm__mobile-dialog").open'),width+': keyboard Enter');
      await evaluate('document.querySelector(".hm__mobile-close--icon").click()');await sleep(350);
      allTrue(await run(function(){return {closed:!document.querySelector('dialog.hm__mobile-dialog').open,focus:document.activeElement===document.querySelector('button.hm__mobile-toggle'),scroll:document.body.style.overflow!=='hidden'};}),width+': close icon');
    } else {
      metrics.menu=await run(function(){
        const root=document.querySelector('header.hm'),button=root.querySelector('.hm__desktop .hm__disclosure');button.click();
        const expanded=button.getAttribute('aria-expanded')==='true';
        const links=[...root.querySelector('.hm__desktop .hm__submenu').querySelectorAll('a[href]')].map(link=>link.getAttribute('href'));
        document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
        return {expanded,links:['lagerhall','maskinhall','ridhus','plathall','isolerad-hall','talthall'].every(slug=>links.includes('/stalhallar/'+slug+'/')),closed:button.getAttribute('aria-expanded')==='false',focus:document.activeElement===button};
      });allTrue(metrics.menu,width+': desktop disclosure');
    }
    if(expectedPath==='/') {
      metrics.hero=await run(async function(){
        const hero=document.querySelector('.hp-home-hero'),image=hero.querySelector('.hp-home-hero__background');
        const header=document.querySelector('header.hm'),box=hero.getBoundingClientRect();
        const initial=header.dataset.surface==='transparent'&&Math.abs(box.top)<3;
        const fullWidth=Math.abs(box.width-document.documentElement.clientWidth)<3;
        const cover=getComputedStyle(image).objectFit==='cover'&&Math.abs(image.getBoundingClientRect().width-box.width)<3;
        const imageLoaded=image.complete&&image.naturalWidth===1916&&image.currentSrc.includes('/images/hallpartner-hero-temporary.webp');
        window.scrollTo(0,Math.ceil(box.height+180));window.dispatchEvent(new Event('scroll'));await new Promise(done=>setTimeout(done,300));
        const solid=header.dataset.surface==='solid';
        window.scrollTo(0,0);window.dispatchEvent(new Event('scroll'));await new Promise(done=>setTimeout(done,300));
        const returned=header.dataset.surface==='transparent';
        const planning=[...document.querySelectorAll('.hp-home-planning__list li > div')].every(node=>node.getBoundingClientRect().width>=180);
        const anchors=[];
        for(const hash of ['#halltyper','#att-tanka-pa']) {
          document.querySelector('a[href="'+hash+'"]').click();await new Promise(done=>setTimeout(done,350));
          anchors.push(document.querySelector(hash).getBoundingClientRect().top>=header.getBoundingClientRect().bottom-2);
        }
        history.replaceState(null,'',location.pathname+location.search);
        window.scrollTo(0,0);window.dispatchEvent(new Event('scroll'));await new Promise(done=>setTimeout(done,300));
        return {initial,fullWidth,cover,imageLoaded,solid,returned,planning,anchors:anchors.every(Boolean),skip:document.querySelector('#main-content').tabIndex===-1};
      });allTrue(metrics.hero,width+': hero and anchors');
    }
    if(expectedPath==='/kontakt/')allTrue(await run(function(){
      const form=document.querySelector('#hp-contact-form');
      return {found:!!form,inactive:form?.dataset.enabled==='false',disabled:form?.querySelector('button[type="submit"]')?.disabled===true,status:!!form?.querySelector('[role="status"]'),notice:!!document.querySelector('.hp-leads-note--review')};
    }),width+': inactive contact');
    if(expectedPath==='/offert/')allTrue(await run(async function(){
      const host=document.querySelector('#hp-offert-guide'),form=host?.querySelector('form.qf-panel');
      if(!host||!form)return {mounted:false};
      host.querySelector('input[name="project.use"][value="storage"]')?.click();
      const fill=(selector,value)=>{const field=host.querySelector(selector);if(field){field.value=value;field.dispatchEvent(new Event('input',{bubbles:true}));}};
      fill('textarea[name="project.description"]','Synthetic example enquiry for a warehouse hall.');form.requestSubmit();
      fill('select[name="dimensions.confidence"]','need_help');form.requestSubmit();form.requestSubmit();
      fill('input[name="contact.name"]','Test Person');fill('input[name="contact.email"]','test@example.invalid');form.requestSubmit();await Promise.resolve();
      const send=[...host.querySelectorAll('button[type="submit"]')].find(button=>button.textContent.includes('Skicka förfrågan'));
      return {mounted:!!host.querySelector('.qf'),inactive:host.dataset.enabled==='false',review:!!host.querySelector('.qf-step-heading h3')?.textContent.includes('Kontrollera dina svar'),disabled:send?.disabled===true,notice:!!document.querySelector('.hp-leads-note--review')};
    }),width+': quote review must never send');
    await evaluate('if(document.activeElement instanceof HTMLElement)document.activeElement.blur()');
    const layout=await call('Page.getLayoutMetrics'),size=layout.cssContentSize||layout.contentSize;
    const filename=prefix+'-'+width+'-full.png';
    await capture(filename,{x:0,y:0,width:Math.ceil(size.width),height:Math.ceil(size.height),scale:1});
    for(const id of sections) {
      const bounds=await evaluate('(()=>{const node=document.getElementById('+JSON.stringify(id)+');if(!node)return null;const r=node.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height,scale:1};})()');
      assert.ok(bounds,'Missing section '+id);await capture(prefix+'-'+width+'-'+id+'.png',bounds);
    }
    // A real reload is necessary: removing an anchor alone does not reload the document.
    await call('Emulation.setScriptExecutionDisabled',{value:true});await call('Page.reload',{ignoreCache:true});
    let fallbackReady=false;
    for(let attempt=0;attempt<80;attempt++) {
      try{fallbackReady=await evaluate('document.readyState==="complete" && location.pathname==='+JSON.stringify(expectedPath)+' && !!document.querySelector("#hp-amp-header-fallback nav a") && !document.querySelector("header.hm")');}catch{/* Await navigation. */}
      if(fallbackReady)break;await sleep(100);
    }
    assert.ok(fallbackReady,width+': no-JS navigation missing');
    allTrue(await run(function(){const fallback=document.querySelector('#hp-amp-header-fallback');return {visible:!fallback.hidden&&getComputedStyle(fallback).display!=='none',nativeContact:!!fallback.querySelector('a[href="/kontakt/"]'),nativeHalls:!!fallback.querySelector('a[href="/stalhallar/"]'),noOverflow:document.documentElement.scrollWidth<=innerWidth+1};}),width+': no-JS fallback');
    await call('Emulation.setScriptExecutionDisabled',{value:false});
    Object.assign(entry,{filename,noJavaScript:'passed',status:'passed'});
  }
  assert.equal(browserErrors.length,0,'Browser errors: '+browserErrors.join('\n'));
  await writeFile(join(output,prefix+'-REPORT.json'),JSON.stringify({route:expectedPath,pages:report,status:'passed'},null,2));
  console.log('PASS '+expectedPath+': AMP-002, images, inactive forms and no-JS navigation at six widths.');
}catch(error){
  await writeFile(join(output,prefix+'-ERROR.txt'),String(error));
  await writeFile(join(output,prefix+'-PARTIAL.json'),JSON.stringify(report,null,2));
  if(captureFailure){try{await captureFailure();}catch{/* Preserve original assertion. */}}
  console.error(error);process.exitCode=1;
}finally{
  await writeFile(join(output,prefix+'-chrome-stderr.log'),diagnostics);
  if(socket?.readyState===WebSocket.OPEN)socket.close();
  if(browser.exitCode===null&&browser.signalCode===null){
    browser.kill('SIGTERM');await Promise.race([new Promise(done=>browser.once('exit',done)),sleep(2000)]);
  }
  if(browser.exitCode!==null||browser.signalCode!==null)await rm(profile,{recursive:true,force:true});
}
