/** C-only, offline browser regression of the actual order page in the fail-closed release candidate. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync, existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {extname} from 'node:path';
import {setTimeout as pause} from 'node:timers/promises';
import {createChromeSession, openChromeSocket} from './chrome-session.mjs';

const output='reports/preview/order-spec-browser';
mkdirSync(output,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript',
  '.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp',
  '.woff2':'font/woff2','.woff':'font/woff'};
const apiRequests=[],mockRequests=[];
let mockEnabled=false,delayChallenge=false;
const server=createServer((req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost'),path=url.pathname;
    // Dedicated localhost-only fake API: no SMTP, no customer services, no success.
    if(mockEnabled && path==='/api/order-spec.php' && req.method==='POST'){
      let raw='';
      req.on('data',part=>{raw+=part;});
      req.on('end',()=>{
        if(raw.length>100000){res.writeHead(413);res.end();return;}
        let body={};try{body=JSON.parse(raw);}catch{res.writeHead(400);res.end();return;}
        mockRequests.push({action:body.action,recipient:body.payload?.recipient?.email??null,
          submitter:body.payload?.submitter?.email??null});
        const reply=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
        if(body.action==='challenge-request'){
          const respond=()=>reply(200,{status:'pending',challengeId:'synthetic-challenge'});
          if(delayChallenge){delayChallenge=false;setTimeout(respond,350);}else respond();
        }else if(body.action==='challenge-confirm'){
          reply(200,{status:'verified',verificationToken:'synthetic-token'});
        }else if(body.action==='submit'){
          reply(422,{status:'invalid',fields:{
            '$.documentation.requested':'Ange önskad dokumentation.',
            '$.finalReview.detailsReviewed':'Bekräfta granskningen.',
            '$.recipient.email':'Kontrollera mottagaren.',
            '$.items.0.dimensions.widthMm':'Kontrollera artikelmåttet.'
          }});
        }else reply(400,{status:'invalid'});
      });return;
    }
    if(path.startsWith('/api/')||req.method!=='GET'){
      apiRequests.push({method:req.method,path});res.writeHead(503,{'Cache-Control':'no-store'});res.end();return;
    }
    const relative=decodeURIComponent(path.slice(1));
    if(relative.split('/').some(part=>part==='..'||part.startsWith('.'))){res.writeHead(404);res.end();return;}
    const file='dist/'+(relative.endsWith('/')?relative+'index.html':relative);
    if(!existsSync(file)){res.writeHead(404);res.end();return;}
    res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream','Cache-Control':'no-store'});
    if(mockEnabled && url.searchParams.has('local-test-only') && path==='/offert/bestallningsformular/'){
      const raw=readFileSync(file,'utf8');
      const patched=raw.replace('data-enabled="false"','data-enabled="true"')
        .replace(/(<(?:input|button)[^>]*data-(?:request-code|confirm-code|verification-code|submit)\b[^>]*?)\sdisabled(?:="")?/g,'$1');
      assert.ok(patched!==raw && patched.includes('data-enabled="true"'),'Local mock HTML transform');
      res.end(patched);return;
    }
    res.end(readFileSync(file));
  }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const session=await createChromeSession();
let socket,seq=0;
const pending=new Map(),results=[];
try{
  socket=await openChromeSocket(await session.ready());
  socket.addEventListener('message',event=>{
    const packet=JSON.parse(event.data),entry=pending.get(packet.id);
    if(!entry)return;
    pending.delete(packet.id);clearTimeout(entry.timer);
    if(packet.error)entry.reject(Error(packet.error.message));else entry.resolve(packet.result);
  });
  const call=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout: '+method));},20000);
    pending.set(id,{resolve,reject,timer});
    socket.send(JSON.stringify({id,method,params}));
  });
  const evaluate=async expression=>{
    const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw Error('Chrome JavaScript: '+JSON.stringify(result.exceptionDetails));
    return result.result?.value;
  };
  const run=fn=>evaluate('('+fn.toString()+')()');
  await call('Runtime.enable');await call('Page.enable');
  for(const width of [390,1440]){
    await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
    await call('Page.navigate',{url:origin+'/offert/bestallningsformular/'});
    let loaded=false;
    for(let attempt=0;attempt<120;attempt++){
      try{loaded=await evaluate('document.readyState==="complete" && !!document.querySelector("#hp-order-spec-form")');}catch{}
      if(loaded)break;
      await pause(100);
    }
    assert.ok(loaded,'Order page did not load in Chrome at '+width);
    await pause(300);
    const metrics=await run(()=>{
      const form=document.querySelector('#hp-order-spec-form');
      const links=[...document.querySelectorAll('.hp-order__jump a[href^="#hp-order-"]')];
      const sections=[...document.querySelectorAll('section.hp-order__section')];
      const order=id=>sections.findIndex(el=>el.id===id);
      const grid=document.querySelector('.hp-order__section .hp-order__grid');
      return {
        enabled:form.dataset.enabled,links:links.length,sections:sections.length,
        anchors:links.every(link=>!!document.getElementById(link.getAttribute('href').slice(1))),
        allOpen:sections.every(el=>el.getClientRects().length>0&&!el.hidden),
        pvcBeforeFinishes:order('hp-order-pvcMembrane')>=0&&order('hp-order-pvcMembrane')<order('hp-order-finishes'),
        noOverflow:document.documentElement.scrollWidth<=innerWidth+1,
        columns:getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length,
        disabledSend:form.querySelector('[data-submit]')?.disabled===true,
        disabledCode:form.querySelector('[data-request-code]')?.disabled===true,
        recipient:!!form.querySelector('[data-path="recipient.email"][required]'),
        sender:!!form.querySelector('[data-path="submitter.email"][required]'),
        disclaimer:document.body.innerText.includes('Ej signerat')&&document.body.innerText.includes('ingår inte i leverantörens åtagande'),
        noindex:document.querySelector('meta[name="robots"]')?.content==='noindex,nofollow'
      };
    });
    assert.equal(metrics.enabled,'false','Unapproved transport must stay disabled');
    assert.equal(metrics.links,15);
    assert.equal(metrics.sections,15);
    for(const name of ['anchors','allOpen','pvcBeforeFinishes','noOverflow','disabledSend','disabledCode','recipient','sender','disclaimer','noindex']){
      assert.equal(metrics[name],true,width+': '+name);
    }
    assert.equal(metrics.columns,width===390?1:2,width+': responsive field layout');
    const capture=await call('Page.captureScreenshot',{format:'png',fromSurface:true});
    writeFileSync(output+'/'+width+'-form.png',Buffer.from(capture.data,'base64'));
    results.push({width,metrics,status:'passed'});
    if(width===390){
      const invalid=await run(()=>{
        document.querySelector('[data-preview]').click();
        const form=document.querySelector('#hp-order-spec-form');
        return {first:form.querySelector('[aria-invalid=true]')?.dataset.path,
          focused:document.activeElement===form.querySelector('[aria-invalid=true]'),
          errors:form.querySelectorAll('[aria-invalid=true]').length};
      });
      assert.equal(invalid.first,'submitter.name','Local errors must be mapped to the correct field');
      assert.equal(invalid.focused,true,'Invalid field must receive focus');
      assert.ok(invalid.errors>0,'Invalid review must not show a valid summary');
      await run(()=>{
        const button=document.querySelector('[data-add-line="roofPanel"]');
        button.focus();
      });
      await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
      await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
      const rowCount=await evaluate('document.querySelectorAll("[data-item-row=roofPanel]").length');
      assert.equal(rowCount,1,'Keyboard Enter must add an article row');
      // Real DOM focus checks for A's dynamic-row keyboard fix; no transport enabled.
      const focusChecks=await run(()=>{
        const form=document.querySelector('#hp-order-spec-form');
        const addArticle=form.querySelector('[data-add-line="roofPanel"]');
        const article=form.querySelector('[data-item-row="roofPanel"]');
        const articleFocused=document.activeElement===article.querySelector('[data-item-field="itemType"]');
        const glossPresent=!!article.querySelector('[data-item-field="gloss"]');
        article.querySelector('.hp-order__remove').click();
        const articleRestored=document.activeElement===addArticle;
        addArticle.click();
        const articleFocusedAgain=document.activeElement===form.querySelector('[data-item-row="roofPanel"] [data-item-field="itemType"]');
        const addFinish=form.querySelector('[data-add-finish]');
        addFinish.click();
        const finish=form.querySelector('[data-finish-row]');
        const finishFocused=document.activeElement===finish.querySelector('[data-item-field="materialClass"]');
        finish.querySelector('.hp-order__remove').click();
        const finishRestored=document.activeElement===addFinish;
        const addDocument=form.querySelector('[data-add-document]');
        addDocument.click();
        const doc=form.querySelector('[data-document-row]');
        const documentFocused=document.activeElement===doc.querySelector('[data-item-field="number"]');
        doc.querySelector('.hp-order__remove').click();
        const documentRestored=document.activeElement===addDocument;
        return {articleFocused,glossPresent,articleRestored,articleFocusedAgain,
          finishFocused,finishRestored,documentFocused,documentRestored,
          noOverflow:document.documentElement.scrollWidth<=innerWidth+1};
      });
      for(const [name,passed] of Object.entries(focusChecks))assert.equal(passed,true,'Dynamic keyboard '+name);
      results.push({width,focusChecks,status:'passed'});
      const summary=await run(()=>{
        const values={
          'submitter.name':'Syntetisk Testperson',
          'submitter.email':'submitter@example.invalid',
          'submitter.role':'customer',
          'orderingParty.companyName':'Testkund AB',
          'supplier.companyName':'Testleverantör AB',
          'project.name':'Syntetiskt projekt',
          'recipient.email':'recipient@example.invalid'
        };
        for(const [path,value] of Object.entries(values)){
          const el=[...document.querySelectorAll('[data-path]')].find(node=>node.dataset.path===path);
          if(!el)throw Error('Missing '+path);
          el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));
          el.dispatchEvent(new Event('change',{bubbles:true}));
        }
        const row=document.querySelector('[data-item-row="roofPanel"]');
        for(const [key,value] of Object.entries({itemType:'SYNTH-PANEL-1',quantity:'2',unit:'pcs'})){
          const el=[...row.querySelectorAll('[data-item-field]')].find(node=>node.dataset.itemField===key);
          if(!el)throw Error('Missing item '+key);
          el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));
          el.dispatchEvent(new Event('change',{bubbles:true}));
        }
        document.querySelector('[data-preview]').click();
        const panel=document.querySelector('[data-summary]');
        return {
          visible:!panel.hidden,
          recipient:panel.innerText.includes('PDF-mottagare: recipient@example.invalid'),
          submitter:panel.innerText.includes('submitter@example.invalid'),
          line:panel.innerText.includes('SYNTH-PANEL-1'),
          unsent:document.querySelector('[data-message]').innerText.includes('Inget har skickats'),
          valuesPreserved:document.querySelector('[data-path="submitter.name"]').value==='Syntetisk Testperson'
        };
      });
      for(const [name,value] of Object.entries(summary))assert.equal(value,true,'Review '+name+' must be true');
      results.push({width,keyboard:'Enter added item',validation:'focused first missing field',summary,status:'passed'});
    }
  }
  assert.equal(apiRequests.length,0,'Offline review must never call a PHP API');
  // Second local pass only: emulate activated HTML *in-memory*, never in dist.
  // No real mail: synthetic responses solely exercise UI binding and 422 display.
  mockEnabled=true;delayChallenge=true;
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:origin+'/offert/bestallningsformular/?local-test-only=1'});
  let ready=false;
  for(let n=0;n<120;n++){
    try{ready=await evaluate('document.readyState==="complete" && document.querySelector("#hp-order-spec-form")?.dataset.enabled==="true" && !document.querySelector("[data-request-code]")?.disabled');}catch{}
    if(ready)break;await pause(100);
  }
  assert.equal(ready,true,'Local synthetic adapter ready');
  await run(()=>{
    const form=document.querySelector('#hp-order-spec-form');
    const fill=(path,value)=>{
      const input=form.querySelector('[data-path="'+path+'"]');
      if(!input)throw Error('Missing '+path);
      input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));
      input.dispatchEvent(new Event('change',{bubbles:true}));
    };
    for(const [path,value] of Object.entries({
      'submitter.name':'Syntetisk testperson','submitter.email':'stale@example.invalid',
      'submitter.role':'customer','orderingParty.companyName':'Syntetisk kund',
      'supplier.companyName':'Syntetisk leverantör','project.name':'Syntetiskt projekt',
      'recipient.email':'recipient@example.invalid'
    }))fill(path,value);
    form.querySelector('[data-request-code]').click();
    fill('submitter.email','new@example.invalid');
  });
  await pause(650);
  assert.equal(await evaluate('document.querySelector("[data-verification-status]").innerText.includes("ändrades under kodbegäran")'),true,'Old challenge response must be discarded');
  await run(()=>document.querySelector('[data-confirm-code]').click());
  assert.equal(mockRequests.filter(x=>x.action==='challenge-confirm').length,0,'Stale challenge cannot confirm');
  await run(()=>document.querySelector('[data-request-code]').click());
  let challenged=false;
  for(let n=0;n<50;n++){
    challenged=await evaluate('document.querySelector("[data-verification-status]").innerText.includes("Kod begärd")');
    if(challenged)break;await pause(100);
  }
  assert.equal(challenged,true,'New challenge for current sender email');
  await run(()=>{
    document.querySelector('[data-verification-code]').value='123456';
    document.querySelector('[data-confirm-code]').click();
  });
  let verified=false;
  for(let n=0;n<50;n++){
    verified=await evaluate('document.querySelector("[data-verification-status]").innerText.includes("E-postadress verifierad")');
    if(verified)break;await pause(100);
  }
  assert.equal(verified,true,'Synthetic code confirmation');
  const prompt=await run(()=>{
    const form=document.querySelector('#hp-order-spec-form');
    form.querySelector('[data-add-line="roofPanel"]').click();
    const row=form.querySelector('[data-item-row="roofPanel"]');
    for(const [key,value] of Object.entries({itemType:'SYNTH-422',quantity:'2',unit:'pcs'})){
      const input=row.querySelector('[data-item-field="'+key+'"]');
      input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));
    }
    form.querySelector('[data-details-reviewed]').checked=true;
    window.__mockConfirm='';
    window.confirm=text=>{window.__mockConfirm=text;return true;};
    form.dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}));
    return window.__mockConfirm;
  });
  assert.ok(prompt.includes('recipient@example.invalid'),'Recipient must appear in send confirmation');
  let invalid=false;
  for(let n=0;n<50;n++){
    invalid=await evaluate('document.querySelector("[data-multi=documentation]")?.getAttribute("aria-invalid")==="true"');
    if(invalid)break;await pause(100);
  }
  assert.equal(invalid,true,'Server 422 must reach checkbox control');
  const evidence=await run(()=>{
    const form=document.querySelector('#hp-order-spec-form');
    const tested=['[data-multi="documentation"]','[data-details-reviewed]',
      '[data-path="recipient.email"]','[data-item-row] [data-item-field="dimensions.widthMm"]'];
    const fields=tested.map(selector=>{
      const input=form.querySelector(selector);
      if(!input)throw Error('Missing '+selector);
      const ids=(input.getAttribute('aria-describedby')??'').split(/\s+/).filter(Boolean);
      return {selector,invalid:input.getAttribute('aria-invalid')==='true',
        errorIds:ids.filter(id=>document.getElementById(id)?.classList.contains('hp-order__error')),
        visible:ids.some(id=>document.getElementById(id)?.textContent.trim())};
    });
    const recipient=form.querySelector('[data-path="recipient.email"]');
    return {fields,firstFocused:document.activeElement===form.querySelector('[data-multi="documentation"]'),
      hintPreserved:(recipient.getAttribute('aria-describedby')??'').split(/\s+/).some(id=>document.getElementById(id)?.classList.contains('hp-order__hint')),
      recipientPreserved:recipient.value==='recipient@example.invalid',
      submitterPreserved:form.querySelector('[data-path="submitter.email"]').value==='new@example.invalid',
      noSuccess:!document.querySelector('[data-message]').innerText.includes('Servern har accepterat'),
      noDownload:document.querySelector('[data-download]').hidden};
  });
  for(const field of evidence.fields){
    assert.equal(field.invalid,true,'422 invalid '+field.selector);
    assert.equal(field.visible,true,'422 visible described error '+field.selector);
    assert.equal(field.errorIds.length,1,'422 unique linked error '+field.selector);
  }
  for(const check of ['firstFocused','hintPreserved','recipientPreserved','submitterPreserved','noSuccess','noDownload'])
    assert.equal(evidence[check],true,'422 '+check);
  assert.deepEqual(mockRequests.map(x=>x.action),['challenge-request','challenge-request','challenge-confirm','submit']);
  assert.equal(mockRequests.at(-1).recipient,'recipient@example.invalid');
  assert.equal(mockRequests.at(-1).submitter,'new@example.invalid');
  const shot=await call('Page.captureScreenshot',{format:'png',fromSurface:true});
  writeFileSync(output+'/synthetic-422.png',Buffer.from(shot.data,'base64'));
  writeFileSync(output+'/synthetic-422.json',JSON.stringify({mode:'localhost mock, no SMTP',evidence,mockRequests},null,2)+'\n');
  results.push({mode:'localhost synthetic challenge/422',evidence,status:'passed'});
  writeFileSync(output+'/result.json',JSON.stringify({commit:process.env.GITHUB_SHA??null,mode:'disabled/offline',apiRequests,results},null,2)+'\n');
  console.log('PASS: Chrome 390/1440 layout/keyboard, stale email challenge and server-shaped 422 in localhost-only mock; no SMTP or customer API.');
}finally{
  socket?.close();
  await session.close(output+'/chrome-environment.json');
  await new Promise(resolve=>server.close(resolve));
}
