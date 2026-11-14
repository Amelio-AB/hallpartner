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
const apiRequests=[];
const server=createServer((req,res)=>{
  try{
    const path=new URL(req.url,'http://localhost').pathname;
    if(path.startsWith('/api/')||req.method!=='GET'){
      apiRequests.push({method:req.method,path});res.writeHead(503,{'Cache-Control':'no-store'});res.end();return;
    }
    const relative=decodeURIComponent(path.slice(1));
    if(relative.split('/').some(part=>part==='..'||part.startsWith('.'))){res.writeHead(404);res.end();return;}
    const file='dist/'+(relative.endsWith('/')?relative+'index.html':relative);
    if(!existsSync(file)){res.writeHead(404);res.end();return;}
    res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream','Cache-Control':'no-store'});
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
  writeFileSync(output+'/result.json',JSON.stringify({commit:process.env.GITHUB_SHA??null,mode:'disabled/offline',apiRequests,results},null,2)+'\n');
  console.log('PASS: actual Chrome 390/1440, 15 open sections, keyboard article row, dynamic-row focus/restore, field focus, distinct recipient summary, no API or SMTP.');
}finally{
  socket?.close();
  await session.close(output+'/chrome-environment.json');
  await new Promise(resolve=>server.close(resolve));
}
