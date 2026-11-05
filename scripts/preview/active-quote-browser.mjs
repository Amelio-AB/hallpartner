/** Local-only end-to-end Chrome regression. Never contacts the live receiver. */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as pause } from 'node:timers/promises';

const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript',
  '.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};
let submitted=[];
const server=createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    if(req.method==='POST' && url.pathname==='/api/lead.php'){
      let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>16384)throw Error('Large payload');}
      submitted.push(JSON.parse(raw));
      res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
      res.end(JSON.stringify({status:'success',requestId:'1234567890abcdef12345678'}));
      return;
    }
    if(req.method!=='GET'){res.writeHead(405);res.end();return;}
    const route=decodeURIComponent(url.pathname.slice(1));
    const path=route.endsWith('/')?route+'index.html':route;
    if(!path || path.split('/').some(p=>p==='..'||p.startsWith('.'))||path.startsWith('api/')){
      res.writeHead(404);res.end();return;
    }
    const filename='dist/'+path;
    if(!existsSync(filename)){res.writeHead(404);res.end();return;}
    res.writeHead(200,{'Content-Type':types[extname(filename)]??'application/octet-stream','Cache-Control':'no-store'});
    res.end(readFileSync(filename));
  }catch{res.writeHead(500);res.end();}
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const origin='http://127.0.0.1:'+server.address().port;
const profile=mkdtempSync(join(tmpdir(),'hp-active-quote-chrome-'));
const debuggingPort=9600+(process.pid%300);
const chrome=spawn(process.env.HP_CHROME||'google-chrome',[
  '--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
  '--disable-background-networking','--no-first-run','--no-default-browser-check',
  '--remote-allow-origins=*','--remote-debugging-port='+debuggingPort,
  '--user-data-dir='+profile,'about:blank'
],{stdio:['ignore','ignore','pipe']});
let socket;
const requests=new Map();let sequence=0;
try{
  let target;
  for(let n=0;n<120;n++){
    if(chrome.exitCode!==null)throw Error('Chrome ended early');
    try{
      const response=await fetch('http://127.0.0.1:'+debuggingPort+'/json',{signal:AbortSignal.timeout(800)});
      if(response.ok)target=(await response.json()).find(item=>item.type==='page'&&item.webSocketDebuggerUrl);
    }catch{/* starting up */}
    if(target)break; await pause(150);
  }
  assert.ok(target,'Chrome CDP unavailable');
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{
    socket.addEventListener('open',resolve,{once:true});
    socket.addEventListener('error',reject,{once:true});
  });
  socket.addEventListener('message',event=>{
    const item=JSON.parse(event.data);if(!item.id||!requests.has(item.id))return;
    const pending=requests.get(item.id);requests.delete(item.id);
    if(item.error)pending.reject(Error(item.error.message));else pending.resolve(item.result);
  });
  const call=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++sequence;
    requests.set(id,{resolve,reject});
    socket.send(JSON.stringify({id,method,params}));
  });
  const evaluate=async expression=>{
    const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw Error('CDP runtime: '+JSON.stringify(result.exceptionDetails));
    return result.result?.value;
  };
  await call('Runtime.enable');await call('Page.enable');
  await call('Page.navigate',{url:origin+'/offert/'});
  let ready=false;
  for(let n=0;n<160;n++){
    try{ready=await evaluate('document.querySelector("#hp-offert-guide")?.dataset.enabled==="true" && !!document.querySelector(".qf-panel button[type=submit]")');}catch{}
    if(ready)break;await pause(100);
  }
  assert.ok(ready,'Offline active build did not mount the active quote guide');
  const advance=async()=>{
    const state=await evaluate('(()=>{const b=document.querySelector(".qf-panel button[type=submit]");const heading=document.querySelector(".qf-step-heading h3")?.textContent;b.click();return {heading,disabled:b.disabled};})()');
    assert.equal(state.disabled,false,'submit navigation must be enabled');
  };
  assert.ok(await evaluate('(()=>{const input=document.querySelector("input[name=\\"project.use\\"][value=\\"storage\\"]");input?.click();return input?.checked===true;})()'));
  await advance(); // dimensions
  await advance(); // design
  await advance(); // planning
  await advance(); // contact
  assert.ok(await evaluate('(()=>{for(const [name,value] of Object.entries({"contact.name":"Syntetisk Testperson","contact.email":"test@example.invalid"})){const el=document.querySelector("[name=\\""+name+"\\"]");if(!el)return false;el.value=value;el.dispatchEvent(new Event("input",{bubbles:true}));}return true;})()'));
  await advance(); // automatic review
  assert.ok(await evaluate('document.querySelector(".qf-step-heading h3")?.textContent==="Kontrollera dina svar"'));
  assert.ok(await evaluate('document.querySelector(".qf-panel button[type=submit]")?.textContent==="Skicka förfrågan"'));
  assert.equal(submitted.length,0,'No request before final click');
  await advance();
  let success=false;
  for(let n=0;n<100;n++){
    success=await evaluate('document.querySelector(".qf-status")?.textContent==="Förfrågan är mottagen."');
    if(success)break;await pause(100);
  }
  assert.ok(success,'Browser did not show successful test submit');
  assert.equal(submitted.length,1,'Exactly one local mock submission');
  assert.equal(submitted[0].configurationId,'hallpartner-offert-v2-review');
  assert.equal(submitted[0].contractVersion,1);
  assert.equal(submitted[0].answers['project.use'],'storage');
  assert.equal(submitted[0].answers['contact.name'],'Syntetisk Testperson');
  assert.equal(submitted[0].answers['contact.email'],'test@example.invalid');
  console.log('OFFLINE ACTIVE CHROME: PASS; 6 steps, enabled button, 1 mock POST, success response; no live SMTP.');
}finally{
  for(const pending of requests.values())pending.reject(Error('Browser closing'));
  if(socket)socket.close();
  chrome.kill('SIGTERM');
  await new Promise(resolve=>{if(chrome.exitCode!==null)return resolve();chrome.once('exit',resolve);});
  await new Promise(resolve=>server.close(resolve));
  rmSync(profile,{recursive:true,force:true});
}
