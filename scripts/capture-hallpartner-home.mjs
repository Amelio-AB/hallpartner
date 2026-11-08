/** Chrome checks on real visitor routes. No publication or form delivery. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { createChromeSession, openChromeSocket } from './preview/chrome-session.mjs';
import { quoteReleasePolicy } from './preview/quote-release.mjs';

const url=process.env.HP_PREVIEW_URL||'http://127.0.0.1:4321/';
const expectedPath=new URL(url).pathname;
const quoteEnabled=quoteReleasePolicy().enabled;
const output=resolve(process.env.HP_SCREENSHOT_DIR||'visual-review');
const prefix=process.env.HP_SCREENSHOT_PREFIX||'validated';
const sections=(process.env.HP_SCREENSHOT_SECTIONS||'').split(',').filter(Boolean);
assert.match(prefix,/^[a-z0-9-]+$/i);
for(const id of sections)assert.match(id,/^[a-z0-9-]+$/i);
await mkdir(output,{recursive:true});
const session=await createChromeSession();
let socket, captureFailure;
let phase='chrome-startup';
const report=[];
try {
  socket=await openChromeSocket(await session.ready());
  phase='site-regression';
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
  // This review never delivers personal data, even when the deployed guide is active.
  let blockedSubmissions=0;
  await call('Fetch.enable',{patterns:[{urlPattern:'*/api/*',requestStage:'Request'}]});
  socket.addEventListener('message',event=>{
    const packet=JSON.parse(event.data);
    if(packet.method==='Fetch.requestPaused'){
      blockedSubmissions++;
      call('Fetch.failRequest',{requestId:packet.params.requestId,errorReason:'BlockedByClient'}).catch(()=>{});
    }
  });
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
        // The quote wizard has a valid nested header inside main, not a second site header.
        visibleHeaders:[...document.querySelectorAll('header')].filter(node=>!node.closest('main')&&getComputedStyle(node).display!=='none').length,
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
    // AMP-006 must enhance on a fine-pointer desktop. CSS-only/no-JS/touch
    // fallback intentionally keeps all descriptions visible at equal widths.
    if(expectedPath==='/stalhallar/') {
      metrics.amp006=await run(function(){
        const root=document.getElementById('stalhallar-use-cards');
        const row=root?.querySelector('.ecg__row');
        const cards=[...(row?.children??[])].filter(card=>card.matches('.ecg__card'));
        const fine=matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)').matches;
        const active=!!root?.hasAttribute('data-ecg-enhanced');
        const details=cards.every(card=>!!card.querySelector('.ecg__details'));
        return {
          root:!!root&&root.matches('.ecg[data-ecg]'),
          allCards:cards.length===3,
          descriptions:details,
          correctMode:fine?active:!active,
        };
      });
      allTrue(metrics.amp006,width+': AMP-006 enhanced desktop or readable fallback');
      if(width>=901) {
        const fine=await evaluate("matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)').matches");
        if(fine){
          await evaluate("document.querySelector('#stalhallar-use-cards .ecg__card')?.focus()");
          await sleep(550);
          metrics.amp006Focus=await run(function(){
            const grid=document.getElementById('stalhallar-use-cards');
            const cards=[...grid.querySelector('.ecg__row').children].filter(card=>card.matches('.ecg__card'));
            const sizes=cards.map(card=>card.getBoundingClientRect().width);
            return {
              active:cards[0].getAttribute('data-ecg-active')==='true',
              focus:document.activeElement===cards[0],
              wideFirst:sizes[0]>sizes[1]*1.5&&sizes[0]>sizes[2]*1.5,
            };
          });
          allTrue(metrics.amp006Focus,width+': AMP-006 expands first card on keyboard focus');
        }
      }
    }
    if(/^\/stalhallar\/(lagerhall|maskinhall|ridhus|plathall|isolerad-hall|talthall)\/$/.test(expectedPath)) {
      metrics.hallHeroRail=await run(function(){
        const hero=document.querySelector('.hp-detail__hero-grid.hp-draft-rail');
        const crumbs=document.querySelector('.hp-detail__crumbs.hp-draft-rail');
        const copy=hero?.querySelector('.hp-detail__hero-copy');
        if(!hero||!crumbs||!copy)return {structure:false};
        const a=hero.getBoundingClientRect(),b=crumbs.getBoundingClientRect(),c=copy.getBoundingClientRect();
        const crumbStyle=getComputedStyle(crumbs);
        return {
          structure:true,
          alignedLeft:Math.abs(a.left-b.left)<=2,
          alignedRight:Math.abs(a.right-b.right)<=2,
          copyInside:c.left>=b.left-2&&c.right<=b.right+2,
          minimumGutter:a.left>=Math.min(12,innerWidth*.03),
          breadcrumbFlex:crumbStyle.display==='flex'&&crumbStyle.alignItems==='center',
          breadcrumbWrap:crumbStyle.flexWrap==='wrap',
          breadcrumbGap:parseFloat(crumbStyle.columnGap)>=8,
          breadcrumbHeight:b.height>=48,
          breadcrumbContents:crumbs.children.length===5&&[...crumbs.querySelectorAll('span[aria-hidden="true"]')].filter(s=>s.textContent.trim()==='/').length===2,
          backgroundPhoto:!!document.querySelector('.hp-detail__hero-media img'),
        };
      });
      allTrue(metrics.hallHeroRail,width+': hall hero rail aligned with breadcrumbs');
    }
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
      const panel=document.querySelector('.hp-info__hero #kontaktformular');
      const actions=[...document.querySelectorAll('.hp-contact-hero__action')].map(a=>a.getAttribute('href'));
      return {
        found:!!form,
        hero:!!panel && panel.contains(form),
        onlyOneForm:document.querySelectorAll('#hp-contact-form').length===1,
        inactive:form?.dataset.enabled==='false',
        fieldsDisabled:!!form?.querySelector('fieldset[disabled]') && [...form.querySelectorAll('input,textarea')].every(input=>input.matches(':disabled')),
        submitDisabled:form?.querySelector('button[type="submit"]')?.disabled===true,
        status:!!form?.querySelector('[role="status"]'),
        notice:!!document.querySelector('.hp-contact-hero__notice--review'),
        quote:!!panel?.querySelector('a[href="/offert/"]'),
        phone:actions.includes('#hallpartner-telefon'),
        email:actions.includes('#hallpartner-epost'),
        directoryBeforePeople:(document.querySelector('#kontaktuppgifter')?.compareDocumentPosition(document.querySelector('#personer')) & Node.DOCUMENT_POSITION_FOLLOWING)!==0,
        phoneVisible:!!document.querySelector('#hallpartner-telefon')?.parentElement.querySelector('a[href="tel:+46548200490"]'),
        emailVisible:!!document.querySelector('#hallpartner-epost')?.parentElement.querySelector('a[href="mailto:info@hallpartner.se"]'),
        mobilePortraitsFit:innerWidth>460 || (() => {
          const portraits=[...document.querySelectorAll('.hp-info__person--contact .hp-info__person-photo')];
          return portraits.length===2 && portraits.every(photo=>{
            const rect=photo.getBoundingClientRect();
            return rect.width>=180 && rect.height>=rect.width*.70;
          });
        })(),
        noUnapprovedMap:!document.querySelector('#kontaktuppgifter iframe')
      };
    }),width+': safe contact form in hero');

    if(expectedPath==='/offert/') {
      metrics.quoteBreadcrumb=await run(function(){
        const shell=document.querySelector('.hp-quote-shell');
        const crumb=shell?.querySelector('nav.hp-info__crumbs');
        if(!shell||!crumb)return {present:false};
        const a=shell.getBoundingClientRect(),b=crumb.getBoundingClientRect();
        const paddingTop=parseFloat(getComputedStyle(shell).paddingTop);
        return {
          present:true,
          noTopPadding:paddingTop<=1,
          flushInsideShell:Math.abs(a.top-b.top)<=2,
          greenBackground:getComputedStyle(crumb,'::before').backgroundColor==='rgb(21, 49, 41)',
          readableHeight:b.height>=48
        };
      });
      allTrue(metrics.quoteBreadcrumb,width+': quote breadcrumb flush without pale strip');
      await evaluate('window.hpExpectedQuoteEnabled='+JSON.stringify(quoteEnabled));
      allTrue(await run(function(){
        const host=document.querySelector('#hp-offert-guide');
        const trigger=host?.querySelector('button.qf-help-trigger');
        const steps=[...host.querySelectorAll('.qf-progress-item')];
        const cards=[...host.querySelectorAll('.qf-card')];
        trigger?.focus();trigger?.click();
        const dialog=host?.querySelector('dialog.qf-help-dialog[open]');
        const progress=host.querySelector('.qf-progress');
        return {
          mounted:!!host?.querySelector('.qf'),
          releaseMode:host?.dataset.enabled===String(window.hpExpectedQuoteEnabled),
          helpOpen:!!dialog?.open,
          helpTitle:!!dialog?.querySelector('h3')?.textContent,
          helpText:!!dialog?.querySelector('p')?.textContent,
          sixSteps:steps.length===6,
          hallpartnerFont:getComputedStyle(host.querySelector('.qf')).fontFamily.includes('Inter'),
          tintedCards:cards.length===5&&getComputedStyle(cards[0]).backgroundColor==='rgb(241, 244, 240)',
          noDuplicateTitle:getComputedStyle(host.querySelector('.qf-intro')).display==='none'&&
            document.querySelector('.hp-quote-shell__lead h1')?.textContent.trim()==='Berätta om hallen du planerar',
          progressFits:progress?.getBoundingClientRect().right<=innerWidth+1,
          cardsFit:cards.length===5&&cards.every(card=>{
            const r=card.getBoundingClientRect(),copy=card.querySelector('.qf-card-copy strong')?.getBoundingClientRect();
            return r.width>=180&&r.left>=-1&&r.right<=innerWidth+1&&!!copy&&copy.right<=r.right+1;
          })
        };
      }),width+': AMP-001 six steps, cards and info popup');
      if(width===390||width===1280)await capture(prefix+'-'+width+'-amp001-help.png');
      await key('Escape');await sleep(80);
      allTrue(await run(function(){
        const host=document.querySelector('#hp-offert-guide');
        return {
          escaped:!host?.querySelector('dialog.qf-help-dialog[open]'),
          focusReturned:document.activeElement===host?.querySelector('button.qf-help-trigger')
        };
      }),width+': AMP-001 Escape and focus');
      if([320,390,768,1024,1440].includes(width)) {
        // Focus restoration from the help dialog may scroll the viewport.
        // Pin the fixed header at document top before full-page evidence.
        await evaluate('window.scrollTo(0,0)');
        await sleep(70);
        const layout=await call('Page.getLayoutMetrics'),size=layout.cssContentSize||layout.contentSize;
        await capture(prefix+'-'+width+'-amp001-step1.png',{x:0,y:0,width:Math.ceil(size.width),height:Math.ceil(size.height),scale:1});
      }
      allTrue(await run(function(){
        const host=document.querySelector('#hp-offert-guide'),form=host.querySelector('form.qf-panel');
        host.querySelector('input[name="project.use"][value="storage"]')?.click();
        const field=host.querySelector('textarea[name="project.description"]');
        const descriptionOptional=field?.required===false&&field?.value==='';
        form.requestSubmit();
        const certainty=host.querySelector('select[name="dimensions.confidence"]');
        if(!certainty)return {onDimensions:false};
        const blankDescriptionAccepted=!!certainty;
        const optional=certainty.required===false&&certainty.value==='';
        form.requestSubmit();
        const skippedToDesign=!!host.querySelector('select[name="design.insulation"]');
        host.querySelector('.qf-actions button:not([type="submit"])')?.click();
        const returned=!!host.querySelector('select[name="dimensions.confidence"]');
        const updatedCertainty=host.querySelector('select[name="dimensions.confidence"]');
        if(!updatedCertainty)return {returned:false};
        updatedCertainty.value='approximate';
        updatedCertainty.dispatchEvent(new Event('input',{bubbles:true}));
        const group=host.querySelector('button.qf-group-toggle');
        const collapsed=group?.getAttribute('aria-expanded')==='false';
        group?.click();
        const expanded=group?.getAttribute('aria-expanded')==='true';
        const height=host.querySelector('input[name="dimensions.side_height"]');
        if(height){height.value='5';height.dispatchEvent(new Event('input',{bubbles:true}));}
        group?.click();
        const closed=group?.getAttribute('aria-expanded')==='false';
        group?.click();
        return {
          onDimensions:!!certainty,descriptionOptional,blankDescriptionAccepted,optional,skippedToDesign,returned,collapsed,expanded,closed,
          retained:host.querySelector('input[name="dimensions.side_height"]')?.value==='5',
          groupOpen:group?.getAttribute('aria-expanded')==='true'
        };
      }),width+': AMP-001 collapsible fields');
      allTrue(await run(function(){
        const host=document.querySelector('#hp-offert-guide'),grid=host.querySelector('.qf-fields');
        const columns=getComputedStyle(grid).gridTemplateColumns.split(' ').length;
        const a=host.querySelector('[name="dimensions.width"]')?.getBoundingClientRect();
        const b=host.querySelector('[name="dimensions.length"]')?.getBoundingClientRect();
        return {
          columns:innerWidth>=740?columns===2:columns===1,
          pairedMeasures:!!a&&!!b&&(innerWidth>=740
            ? Math.abs(a.top-b.top)<=2&&a.left<b.left
            : a.top<b.top&&Math.abs(a.left-b.left)<=2),
          noOverflow:document.documentElement.scrollWidth<=innerWidth+1
        };
      }),width+': two-column form fields and mobile stacking');
      if([390,768,1440].includes(width)) {
        await evaluate('window.scrollTo(0,0)');
        await sleep(70);
        const metrics=await call('Page.getLayoutMetrics'),size=metrics.cssContentSize||metrics.contentSize;
        await capture(prefix+'-'+width+'-amp001-step2.png',{x:0,y:0,width:Math.ceil(size.width),height:Math.ceil(size.height),scale:1});
      }
      if(width===390||width===1280){
        const layout=await call('Page.getLayoutMetrics'),size=layout.cssContentSize||layout.contentSize;
        await capture(prefix+'-'+width+'-amp001-groups.png',{x:0,y:0,width:Math.ceil(size.width),height:Math.ceil(size.height),scale:1});
      }
      allTrue(await run(async function(){
        const host=document.querySelector('#hp-offert-guide'),form=host.querySelector('form.qf-panel');
        const fill=(selector,value)=>{
          const field=host.querySelector(selector);
          if(field){field.value=value;field.dispatchEvent(new Event('input',{bubbles:true}));}
        };
        fill('select[name="dimensions.confidence"]','need_help');
        const irrelevant=!host.querySelector('input[name="dimensions.side_height"]');
        form.requestSubmit();
        const design=!!host.querySelector('select[name="design.insulation"]');
        fill('select[name="openings.ports"]','yes');
        fill('textarea[name="openings.port_needs"]','Synthetic example: wide port');
        fill('select[name="openings.ports"]','no');
        const irrelevantPort=!host.querySelector('textarea[name="openings.port_needs"]');
        form.requestSubmit();
        const planning=!!host.querySelector('select[name="planning.stage"]');
        fill('select[name="documents.available"]','yes');
        fill('textarea[name="documents.description"]','Synthetic document description');
        fill('select[name="documents.available"]','later');
        const irrelevantDocument=!host.querySelector('textarea[name="documents.description"]');
        form.requestSubmit();
        const customer=!!host.querySelector('input[name="contact.name"]');
        fill('input[name="contact.name"]','Test Person');
        fill('input[name="contact.email"]','test@example.invalid');
        form.requestSubmit();
        // The disabled state is updated in a MutationObserver microtask.
        await Promise.resolve();
        const send=[...host.querySelectorAll('button[type="submit"]')].find(button=>button.textContent.includes('Skicka förfrågan'));
        const summary=[...host.querySelectorAll('.qf-summary-section')];
        return {
          releaseMode:host.dataset.enabled===String(window.hpExpectedQuoteEnabled),
          irrelevant,design,irrelevantPort,planning,irrelevantDocument,customer,
          review:!!host.querySelector('.qf-step-heading h3')?.textContent.includes('Kontrollera dina svar'),
          sixSteps:host.querySelectorAll('.qf-progress-item').length===6,
          fiveSections:summary.length===5,
          submitGate:send?.disabled===!window.hpExpectedQuoteEnabled,
          notice:window.hpExpectedQuoteEnabled
            ? !!document.querySelector('#hp-offert-notice a[href="/integritet/"]')
            : !!document.querySelector('.hp-leads-note--review')
        };
      }),width+': all five question steps, final review and release gate (no send)');
      assert.equal(blockedSubmissions,0,'Guide attempted an API request before final submit');
    }

    await evaluate('if(document.activeElement instanceof HTMLElement)document.activeElement.blur();window.scrollTo(0,0)');
    await sleep(70);
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

  // Ultrabreda skärmar: verifiera att hela den centralt placerade textkolumnen
  // ligger under gradientens täta del. Undvik dyra 4K-screenshots.
  if(new RegExp('^/stalhallar/(lagerhall|maskinhall|ridhus|plathall|isolerad-hall|talthall)/$').test(expectedPath)) {
    for (const wideWidth of [1920,2560,3840]) {
      await call('Emulation.setDeviceMetricsOverride',{
        width:wideWidth,height:900,deviceScaleFactor:1,mobile:false
      });
      await call('Page.navigate',{url});
      let isReady=false;
      for(let attempt=0;attempt<120;attempt++){
        try {
          isReady=await evaluate('document.readyState==="complete" && document.body?.dataset.ampReady==="true" && location.pathname==='+JSON.stringify(expectedPath));
        } catch { /* Chrome navigering byter JS-context. */ }
        if(isReady)break;
        await sleep(100);
      }
      assert.ok(isReady,'Hall hero did not load at '+wideWidth);
      const wide=await run(function(){
        const hero=document.querySelector('.hp-detail__hero.hp-detail__hero--illustrated');
        const copy=hero?.querySelector('.hp-detail__hero-copy');
        const rail=hero?.querySelector('.hp-detail__hero-grid.hp-draft-rail');
        const crumbs=document.querySelector('.hp-detail__crumbs.hp-draft-rail');
        const image=hero?.querySelector('.hp-detail__hero-media img');
        if(!copy||!rail||!crumbs||!image)return {structure:false};
        const copyBox=copy.getBoundingClientRect();
        const railBox=rail.getBoundingClientRect();
        const crumbBox=crumbs.getBoundingClientRect();
        const rootFont=parseFloat(getComputedStyle(document.documentElement).fontSize);
        const opaqueEdge=innerWidth/2+6*rootFont;
        return {
          structure:true,
          aligned:Math.abs(railBox.left-crumbBox.left)<=2,
          copyBehindOpaqueGradient:copyBox.right<=opaqueEdge+2,
          imageLoaded:image.complete&&image.naturalWidth>0,
          noOverflow:document.documentElement.scrollWidth<=innerWidth+1
        };
      });
      allTrue(wide,wideWidth+': centered 4K hero scrim');
      report.push({viewport:{width:wideWidth,height:900},metrics:{wideHeroGradient:wide},status:'passed'});
    }
  }
  assert.equal(browserErrors.length,0,'Browser errors: '+browserErrors.join('\n'));
  assert.equal(blockedSubmissions,0,'Read-only browser review attempted an API request');
  await writeFile(join(output,prefix+'-REPORT.json'),JSON.stringify({route:expectedPath,pages:report,status:'passed'},null,2));
  console.log('PASS '+expectedPath+': AMP-002, images, release gates and no-JS navigation at six widths; no API requests.');
}catch(error){
  session.evidence.failurePhase=phase;
  session.evidence.failureKind=phase==='chrome-startup'?'browser-startup':error.code==='ERR_ASSERTION'?'site-assertion':'browser-protocol-or-harness';
  session.evidence.error=String(error);
  await writeFile(join(output,prefix+'-ERROR.txt'),phase+': '+String(error));
  await writeFile(join(output,prefix+'-PARTIAL.json'),JSON.stringify(report,null,2));
  if(captureFailure){try{await captureFailure();}catch{/* Preserve original assertion. */}}
  console.error(error);process.exitCode=1;
}finally{
  if(socket?.readyState===WebSocket.OPEN)socket.close();
  await session.close(join(output,prefix+'-chrome.json'));
}
