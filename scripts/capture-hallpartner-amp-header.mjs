/**
 * Browser acceptance evidence for isolated real AMP-002 Header prototypes.
 * Uses installed public AMP-002 bundle and built Astro pages, no UI mocks.
 * No deployment, credentials or external receivers.
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const origin = process.env.HP_PREVIEW_ORIGIN || 'http://127.0.0.1:4321';
const output = resolve(process.env.HP_SCREENSHOT_DIR || 'visual-review');
const chrome = process.env.HP_CHROME || 'google-chrome';
const scenarios = [
  { name:'dropdown-hero', path:'/prototype/amp/header/', hero:true, variant:'classic-dropdown' },
  { name:'mega-hero', path:'/prototype/amp/header/mega/', hero:true, variant:'classic-mega-menu' },
  // Deliberately use Hallpartner's actual dark photo for the light-tone stress case.
  // A technical pass here is NOT proof of sufficient real-image contrast.
  { name:'mega-hero-light', path:'/prototype/amp/header/mega/?tone=light', hero:true, variant:'classic-mega-menu', tone:'light' },
  { name:'mega-solid', path:'/prototype/amp/header/solid/', hero:false, variant:'classic-mega-menu' },
];
const viewports=[320,390,768,1024,1280,1440];
const port=9500+(process.pid%400);
const browser=spawn(chrome,[
  '--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
  '--disable-background-networking','--remote-allow-origins=*',
  '--remote-debugging-port='+port,'--user-data-dir='+join(tmpdir(),'hp-amp002-'+process.pid),'about:blank'
],{stdio:'ignore'});
let ws;
await mkdir(output,{recursive:true});
try {
  let target;
  for(let n=0;n<90;n++){
    try{
      const res=await fetch('http://127.0.0.1:'+port+'/json');
      if(res.ok) target=(await res.json()).find(t=>t.type==='page'&&t.webSocketDebuggerUrl);
    }catch{}
    if(target)break;
    await sleep(130);
  }
  if(!target)throw Error('Chrome debugging target unavailable');
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((done,fail)=>{
    const timer=setTimeout(()=>fail(Error('Chrome websocket timeout')),9000);
    ws.addEventListener('open',()=>{clearTimeout(timer);done();},{once:true});
    ws.addEventListener('error',(error)=>{clearTimeout(timer);fail(error);},{once:true});
  });
  let id=0;const pending=new Map();
  ws.addEventListener('message',event=>{
    const msg=JSON.parse(event.data);
    if(!msg.id||!pending.has(msg.id))return;
    const p=pending.get(msg.id);pending.delete(msg.id);clearTimeout(p.timer);
    if(msg.error)p.reject(Error(msg.error.message));else p.resolve(msg.result);
  });
  const call=(method,params={})=>new Promise((done,fail)=>{
    const commandId=++id;
    const timer=setTimeout(()=>{pending.delete(commandId);fail(Error(method+' timed out'));},20000);
    pending.set(commandId,{resolve:done,reject:fail,timer});
    ws.send(JSON.stringify({id:commandId,method,params}));
  });
  const evalJS=async expression=>{
    const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw Error('Browser eval failure: '+JSON.stringify(result.exceptionDetails));
    return result.result?.value;
  };
  await call('Runtime.enable');await call('Page.enable');
  const report=[];
  for(const scenario of scenarios){
    for(const width of viewports){
      const label=scenario.name+'-'+width;
      await call('Emulation.setDeviceMetricsOverride',{width,height:width<=390?844:900,deviceScaleFactor:1,mobile:false});
      await call('Page.navigate',{url:origin+scenario.path});
      let ready=false;
      for(let n=0;n<100;n++){
        try{
          ready=await evalJS('document.readyState==="complete" && document.body?.dataset.ampReady==="true" && location.pathname==='+JSON.stringify(scenario.path.split('?')[0]));
        }catch{}
        if(ready)break;
        await sleep(110);
      }
      if(!ready)throw Error(label+' did not mount real AMP-002');
      const initial=await evalJS('('+function(){
        return (async()=>{
          for(const img of document.images) img.loading='eager';
          await Promise.all([...document.images].map(img=>img.decode().catch(()=>null)));
          await document.fonts.ready;
          const root=document.querySelector('header.hm');
          const hero=document.querySelector('.hp-home-hero[data-hero]');
          const fallback=document.querySelector('#hp-amp-header-fallback');
          const heading=document.querySelector('.hp-amp-solid-lead h1');
          const rect=root?.getBoundingClientRect();
          return {
            ready:document.body.dataset.ampReady==='true',
            variant:document.body.dataset.headerVariant,
            headerCount:document.querySelectorAll('header.hm').length,
            onlyOneVisibleHeader:[...document.querySelectorAll('header')].filter(x=>getComputedStyle(x).display!=='none').length===1,
            fallbackHidden:fallback?.hidden===true,
            footerCount:document.querySelectorAll('footer.af--compact').length,
            h1Count:document.querySelectorAll('h1').length,
            noOverflow:document.documentElement.scrollWidth<=innerWidth+1,
            surface:root?.dataset.surface,
            fixed:root?getComputedStyle(root).position==='fixed':false,
            hasHero:!!hero,
            heroAtTop:hero?Math.abs(hero.getBoundingClientRect().top)<3:null,
            solidHeadingClear:heading?heading.getBoundingClientRect().top>=rect.bottom-2:null,
            imagesLoaded:[...root.querySelectorAll('img.hm__logo')].every(img=>img.complete&&img.naturalWidth>0),
            hasHallsMenu:!!root.querySelector('.hm__desktop .hm__disclosure'),
            noindex:document.querySelector('meta[name="robots"]')?.content==='noindex,nofollow',
            tone:root?.dataset.heroTone,
          };
        })();
      }.toString()+')()');
      for(const [key,condition] of Object.entries({
        ready:initial.ready,
        variant:initial.variant===scenario.variant,
        headerCount:initial.headerCount===1,
        onlyOneVisibleHeader:initial.onlyOneVisibleHeader,
        fallbackHidden:initial.fallbackHidden,
        footerCount:initial.footerCount===1,
        h1Count:initial.h1Count===1,
        noOverflow:initial.noOverflow,
        surface:initial.surface===(scenario.hero?'transparent':'solid'),
        fixed:initial.fixed,hasHero:initial.hasHero===scenario.hero,
        heroAtTop:!scenario.hero||initial.heroAtTop,
        solidHeadingClear:scenario.hero||initial.solidHeadingClear,
        imagesLoaded:initial.imagesLoaded,
        hasHallsMenu:initial.hasHallsMenu,noindex:initial.noindex,
        tone:initial.tone===(scenario.tone||'dark'),
      }))if(!condition)throw Error(label+' invalid '+key+': '+JSON.stringify(initial));
      let interaction;
      if(width>1024){
        interaction=await evalJS('('+function(){
          const root=document.querySelector('header.hm');
          const button=root.querySelector('.hm__desktop .hm__disclosure');
          button.click();
          const expanded=button.getAttribute('aria-expanded')==='true';
          const panel=root.querySelector('.hm__desktop .hm__submenu');
          const links=[...panel.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'));
          document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
          return {expanded,linksOk:['/stalhallar/lagerhall/','/stalhallar/maskinhall/','/stalhallar/ridhus/','/stalhallar/plathall/','/stalhallar/isolerad-hall/','/stalhallar/talthall/','/stalhallar/'].every(href=>links.includes(href)),closed:button.getAttribute('aria-expanded')==='false',focusReturn:document.activeElement===button};
        }.toString()+')()');
        if(!interaction.expanded||!interaction.linksOk||!interaction.closed||!interaction.focusReturn)throw Error(label+' desktop disclosure/Escape failed: '+JSON.stringify(interaction));
      }else{
        interaction=await evalJS('('+function(){
          const root=document.querySelector('header.hm');
          const button=root.querySelector('button.hm__mobile-toggle');
          const dialog=root.querySelector('dialog.hm__mobile-dialog');
          const logo=root.querySelector('.hm__mobile-bar .hm__brand');
          const buttonRect=button.getBoundingClientRect();
          const logoRect=logo.getBoundingClientRect();
          const hitTarget=buttonRect.width>=44&&buttonRect.height>=44;
          const noBrandOverlap=buttonRect.left>=logoRect.right-1&&buttonRect.right<=innerWidth+1;
          const threeStrokes=button.querySelectorAll('.hm__toggle-line').length===3;
          const isIcon=button.classList.contains('hm__mobile-toggle--icon')&&button.textContent.trim()==='';
          const initialAria=button.getAttribute('aria-label')==='Öppna meny'&&button.getAttribute('aria-controls')===dialog.id;
          const tone=root.dataset.heroTone;
          const color=getComputedStyle(button).color;
          const toneColor= root.dataset.surface!=='transparent' || (tone==='light' ? color==='rgb(20, 45, 54)' : color==='rgb(255, 255, 255)');
          button.click();
          const opened=dialog.open&&button.getAttribute('aria-expanded')==='true'&&document.body.style.overflow==='hidden';
          const animatedDrawer=dialog.classList.contains('hm__mobile-dialog--animated');
          const iconClose=!!dialog.querySelector('.hm__mobile-close--icon[aria-label="Stäng meny"]');
          const details=dialog.querySelector('details');
          details.querySelector('summary').click();
          const detailsOpened=details.open;
          const linkVisible=!!details.querySelector('a[href="/stalhallar/lagerhall/"]');
          return {opened,detailsOpened,linkVisible,hitTarget,noBrandOverlap,threeStrokes,isIcon,initialAria,toneColor,animatedDrawer,iconClose};
        }.toString()+')()');
        // The right-anchored drawer deliberately translates during its 200ms entry.
        // Measure final bounds only after the transition, not mid-animation.
        await sleep(270);
        interaction.rightEdge=await evalJS("Math.abs(document.querySelector('dialog.hm__mobile-dialog').getBoundingClientRect().right-innerWidth)<=2");
        if(scenario.variant==='classic-mega-menu' && [320,390,768,1024].includes(width)) {
          const shot=await call('Page.captureScreenshot',{format:'png',fromSurface:true});
          await writeFile(join(output,'amp002-'+label+'-dialog-open.png'),Buffer.from(shot.data,'base64'));
        }
        await call('Input.dispatchKeyEvent',{type:'rawKeyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
        await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
        // Icon appearance intentionally has a 200ms close transition.
        await sleep(320);
        const closed=await evalJS('('+function(){
          const root=document.querySelector('header.hm');
          const button=root.querySelector('button.hm__mobile-toggle');
          const dialog=root.querySelector('dialog.hm__mobile-dialog');
          return {closed:!dialog.open&&button.getAttribute('aria-expanded')==='false',overflowRestored:document.body.style.overflow!=='hidden',focusReturn:document.activeElement===button};
        }.toString()+')()');
        interaction={...interaction,...closed};
        if(Object.values(interaction).some(x=>x!==true))throw Error(label+' mobile dialog/Escape failed: '+JSON.stringify(interaction));
        // A real keyboard activation and X-button closing must also preserve focus.
        await evalJS("document.querySelector('button.hm__mobile-toggle').focus()");
        await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',unmodifiedText:'\r',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
        await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
        const keyboardOpen=await evalJS("document.querySelector('dialog.hm__mobile-dialog').open");
        if(!keyboardOpen){
          const debug=await evalJS("({focus:document.activeElement?.className,open:document.querySelector('dialog.hm__mobile-dialog').open,aria:document.querySelector('button.hm__mobile-toggle')?.getAttribute('aria-expanded')})");
          throw Error(label+' keyboard Enter did not open the AMP dialog: '+JSON.stringify(debug));
        }
        await evalJS("document.querySelector('.hm__mobile-close--icon').click()");
        await sleep(320);
        const closeByX=await evalJS("!document.querySelector('dialog.hm__mobile-dialog').open && document.activeElement===document.querySelector('button.hm__mobile-toggle') && document.body.style.overflow!=='hidden'");
        if(!closeByX)throw Error(label+' X-button close/focus/scroll cleanup failed');
        interaction.keyboardOpen=keyboardOpen;interaction.closeByX=closeByX;
      }
      let solidAfterScroll=null;
      if(scenario.hero){
        await evalJS('window.scrollTo(0,Math.ceil(document.querySelector(".hp-home-hero").offsetHeight)+200);window.dispatchEvent(new Event("scroll"));');
        await sleep(240);
        solidAfterScroll=await evalJS('document.querySelector("header.hm").dataset.surface==="solid"');
        if(!solidAfterScroll)throw Error(label+' Header did not become solid after hero');
      }
      if(scenario.variant==='classic-mega-menu' && [320,390,768,1024,1440].includes(width)){
        await evalJS('window.scrollTo(0,0);window.dispatchEvent(new Event("scroll"));');
        await sleep(170);
        // The previous keyboard test intentionally returns focus to the opener.
        // Preserve that visible focus state as separate evidence at 390px,
        // then blur only for a truthful idle-design screenshot.
        if(width===390){
          const focused=await call('Page.captureScreenshot',{format:'png',fromSurface:true});
          await writeFile(join(output,'amp002-'+label+'-keyboard-focus.png'),Buffer.from(focused.data,'base64'));
        }
        await evalJS("if(document.activeElement instanceof HTMLElement) document.activeElement.blur()");
        const layout=await call('Page.getLayoutMetrics');
        const dimensions=layout.cssContentSize||layout.contentSize;
        const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,fromSurface:true,clip:{x:0,y:0,width:Math.ceil(dimensions.width),height:Math.ceil(dimensions.height),scale:1}});
        await writeFile(join(output,'amp002-'+label+'.png'),Buffer.from(shot.data,'base64'));
      }
      report.push({label,initial,interaction,solidAfterScroll});
      console.log('AMP-002 PASS '+label);
    }
  }
  await writeFile(join(output,'amp002-REPORT.json'),JSON.stringify(report,null,2));
  console.log('Validated '+report.length+' real AMP-002 viewport/variant combinations.');
}catch(error){
  console.error('AMP-002 browser QA failed:',error);
  await writeFile(join(output,'amp002-ERROR.txt'),String(error));
  process.exitCode=1;
}finally{
  if(ws&&ws.readyState===WebSocket.OPEN)ws.close();
  browser.kill('SIGTERM');
}
