/**
 * HP-054: isolated Chrome test for a future active contact form.
 * Uses a local in-memory mock instead of any live PHP/SMTP endpoint.
 * Only test@example.invalid and other synthetic inputs are submitted.
 */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as pause } from 'node:timers/promises';

const output = 'reports/preview/active-contact';
mkdirSync(output, {recursive:true});
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript',
  '.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
let requests=[],statusCode=200,mode='normal';
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    if(req.method==='POST'&&url.pathname==='/api/lead.php'){
      let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>16384)throw Error('Large body');}
      const payload=JSON.parse(raw);
      requests.push({payload,method:req.method,contentType:req.headers['content-type']});
      if(mode==='timeout')return;
      if(mode==='disconnect'){res.writeHead(200,{'Content-Type':'application/json'});res.write('{');setTimeout(()=>res.destroy(),20);return;}
      const body=statusCode===200?{status:'success',requestId:'1234567890abcdef12345678'}:
        statusCode===422?{status:'validation-error',fields:{'contact.email':'Kontrollera e-postadressen.'}}:
        statusCode===503?{status:'failed'}:{status:'unknown'};
      res.writeHead(statusCode,{'Content-Type':'application/json','Cache-Control':'no-store'});
      res.end(JSON.stringify(body));return;
    }
    if(req.method!=='GET'){res.writeHead(405);res.end();return;}
    const route=decodeURIComponent(url.pathname.slice(1));
    const path=route.endsWith('/')?route+'index.html':route;
    if(!path||path.split('/').some(part=>part==='..'||part.startsWith('.'))||path.startsWith('api/')){
      res.writeHead(404);res.end();return;
    }
    const filename='dist/'+path;
    if(!existsSync(filename)){res.writeHead(404);res.end();return;}
    res.writeHead(200,{'Content-Type':types[extname(filename)]??'application/octet-stream','Cache-Control':'no-store'});
    res.end(readFileSync(filename));
  }catch{res.writeHead(500);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const profile=mkdtempSync(join(tmpdir(),'hp-active-contact-'));
const port=9900+(process.pid%250);
const chrome=spawn(process.env.HP_CHROME||'google-chrome',[
  '--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
  '--disable-background-networking','--no-first-run','--no-default-browser-check',
  '--remote-allow-origins=*','--remote-debugging-port='+port,
  '--user-data-dir='+profile,'about:blank'
],{stdio:['ignore','ignore','pipe']});
let socket;
const pending=new Map();let sequence=0;
const results=[];
try{
  let target;
  for(let i=0;i<120;i++){
    if(chrome.exitCode!==null)throw Error('Chrome ended early');
    try{
      const response=await fetch('http://127.0.0.1:'+port+'/json',{signal:AbortSignal.timeout(800)});
      if(response.ok)target=(await response.json()).find(x=>x.type==='page'&&x.webSocketDebuggerUrl);
    }catch{/* Chrome is starting */}
    if(target)break;
    await pause(150);
  }
  assert.ok(target,'Chrome CDP unavailable');
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{
    socket.addEventListener('open',resolve,{once:true});
    socket.addEventListener('error',reject,{once:true});
  });
  socket.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(!message.id||!pending.has(message.id))return;
    const promise=pending.get(message.id);pending.delete(message.id);
    if(message.error)promise.reject(Error(message.error.message));
    else promise.resolve(message.result);
  });
  const call=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++sequence;pending.set(id,{resolve,reject});
    socket.send(JSON.stringify({id,method,params}));
  });
  const evaluate=async expression=>{
    const response=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(response.exceptionDetails)throw Error('Runtime evaluation failed: '+JSON.stringify(response.exceptionDetails));
    return response.result?.value;
  };
  await call('Runtime.enable');await call('Page.enable');
  const scenarios=[
    {width:390,code:200,expected:'Referens: 1234567890abcdef12345678',retry:false},
    {width:1440,code:200,expected:'Referens: 1234567890abcdef12345678',retry:false},
    {width:390,code:422,expected:'Kontrollera uppgifterna i formuläret.',retry:true},
    {width:390,code:503,expected:'Mottagningen är inte tillgänglig.',retry:true},
    {width:390,code:500,expected:'Det är oklart om meddelandet kom fram.',retry:false},
    {width:390,code:200,mode:'disconnect',expected:'Det går inte att bekräfta mottagningen.',retry:false},
    {width:390,code:200,mode:'timeout',expected:'Det går inte att bekräfta mottagningen.',retry:false},
  ];
  for(const scenario of scenarios){
    requests=[];statusCode=scenario.code;mode=scenario.mode??'normal';
    await call('Emulation.setDeviceMetricsOverride',{
      width:scenario.width,height:900,deviceScaleFactor:1,mobile:false
    });
    await call('Page.navigate',{url:origin+'/kontakt/'});
    let ready=false;
    for(let n=0;n<120;n++){
      try{ready=await evaluate('(()=>{const f=document.querySelector("#hp-contact-form");return f?.dataset.enabled==="true" && !f.querySelector("fieldset").disabled && !f.querySelector("button[type=submit]").disabled})()');}catch{}
      if(ready)break;await pause(100);
    }
    assert.ok(ready,'Active form did not mount and enable on mock-only build');
    assert.ok(await evaluate('!!document.querySelector("#hp-form-notice a[href=\'/integritet/\']")'),
      'Active contact needs a visible privacy link');
    const valid=await evaluate('(()=>{const answers={"contact.name":"Syntetisk Testperson","contact.email":"test@example.invalid","contact.phone":"","contact.message":"Ett påhittat meddelande för automatiskt funktionstest."};for(const [key,value] of Object.entries(answers)){const input=document.querySelector("[name="+CSS.escape(key)+"]");if(!input)return false;input.value=value;input.dispatchEvent(new Event("input",{bubbles:true}));}return document.querySelector("#hp-contact-form").reportValidity();})()');
    assert.ok(valid,'Synthetic fields must pass native validation');
    assert.equal(requests.length,0,'No POST before explicit submit');
    const submitted=await evaluate('(()=>{document.querySelector("#hp-contact-form").requestSubmit();return true;})()');
    assert.ok(submitted);
    let outcome=false;
    for(let n=0;n<(scenario.mode==='timeout'?175:85);n++){
      try{outcome=await evaluate('document.querySelector("#hp-form-status")?.textContent.includes('+JSON.stringify(scenario.expected)+') && document.querySelector("#hp-contact-form button[type=submit]").disabled==='+String(!scenario.retry));}catch{}
      if(outcome)break;await pause(110);
    }
    assert.ok(outcome,'Contact form result/retry state incorrect for '+JSON.stringify(scenario));
    assert.equal(requests.length,1,'Exactly one synthetic POST');
    const sent=requests[0];
    assert.equal(sent.method,'POST');
    assert.equal(sent.contentType,'application/json');
    assert.deepEqual(Object.keys(sent.payload).sort(),['answers','configurationId','contractVersion','technicalId']);
    assert.equal(sent.payload.contractVersion,1);
    assert.equal(sent.payload.technicalId,'quote-flow');
    assert.equal(sent.payload.configurationId,'hallpartner-contact-v1');
    assert.equal(sent.payload.answers['contact.name'],'Syntetisk Testperson');
    assert.equal(sent.payload.answers['contact.email'],'test@example.invalid');
    assert.equal(sent.payload.answers.website,'');
    assert.equal(await evaluate('location.pathname'),'/kontakt/','No success redirect');
    assert.equal(await evaluate('location.search+location.hash'),'','No PII in URL');
    assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'No horizontal overflow');
    const shot=await call('Page.captureScreenshot',{format:'png',fromSurface:true});
    writeFileSync(output+'/'+scenario.width+'-'+scenario.code+'-'+(scenario.mode??'response')+'.png',Buffer.from(shot.data,'base64'));
    results.push({width:scenario.width,httpStatus:scenario.code,mode:scenario.mode,requests:requests.length,result:'passed'});
  }
  writeFileSync(output+'/result.json',JSON.stringify({localMockOnly:true,results},null,2)+'\n');
  console.log('OFFLINE ACTIVE CONTACT CHROME PASS: mobile/desktop, success, 422, 503, unknown, disconnect, timeout; one local POST per case, no SMTP');
}finally{
  for(const result of pending.values())result.reject(Error('Browser shutting down'));
  if(socket)socket.close();
  chrome.kill('SIGTERM');
  await new Promise(resolve=>{if(chrome.exitCode!==null)return resolve();chrome.once('exit',resolve);});
  await new Promise(resolve=>server.close(resolve));
  rmSync(profile,{recursive:true,force:true});
}
