import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {ftps,ftpsFailure,verifyRetainedFiles} from '../scripts/preview/remote.mjs';
import {sha256} from '../scripts/preview/policy.mjs';

test('FTPS diagnostics identify the active file without returning credentials or raw server text',()=>{
  const creds={host:'ftp://private-host.invalid:21',username:'private-user',password:'private-password'};
  const commands=['get a.css -o first','get images/b.webp -o second'];
  assert.throws(()=>ftps(commands,creds,'.',(_exe,_args,options)=>{
    const echoes=[...options.input.matchAll(/^echo (HP_FTPS_STEP_.+)$/gm)].map(m=>m[1]);
    assert.equal(echoes.length,2);
    assert.match(options.input,/set ssl:verify-certificate yes/);
    return {status:1,stdout:echoes.join('\n')+'\n',stderr:'421 Too many connections for ftp://private-user:private-password@private-host.invalid; timeout'};
  }),error=>{
    assert.equal(error.safeDetails.path,'images/b.webp');
    assert.equal(error.safeDetails.connectionLimit,true);assert.equal(error.safeDetails.timeout,true);
    assert.deepEqual(error.safeDetails.responseCodes,['421']);
    for(const value of Object.values(creds))assert(!error.message.includes(value));
    assert(!error.message.includes('private-host'));assert(!error.message.includes('Too many connections'));
    return true;
  });
  assert.equal(ftpsFailure({status:null,error:{code:'ETIMEDOUT'},stderr:''},commands,-1).timeout,true);
  assert.equal(ftpsFailure({status:1,stdout:'Fatal error: max-retries exceeded'},commands,0).retryLimit,true);
  assert.equal(ftpsFailure({status:1,stdout:'Connection closed'},commands,0).connectionFailure,true);
  const missing=ftpsFailure({status:1,stderr:'550 No such file'},commands,0);
  assert.equal(missing.unavailableFile,true);assert.equal(missing.path,'a.css');
  const tls=ftpsFailure({status:1,stderr:'Certificate verification failed'},commands,-1);
  assert.equal(tls.tlsFailure,true);assert.equal(tls.operation,'connect-or-setup');
  assert.equal(ftps(['find .'],creds,'.',(_exe,_args,options)=>({status:0,stdout:options.input.match(/^echo (.+)$/m)[1]+'\n./\n./index.html\n',stderr:''})),'./\n./index.html\n');
});
test('retained files share exactly one transfer session and every original hash remains mandatory',()=>{
  const temp=mkdtempSync(tmpdir()+'/hp-retained-test-');
  try{
    const entries=[{path:'a.css',sha256:sha256('a')},{path:'images/b.webp',sha256:sha256('b')}];
    let transfers=0;
    const transfer=(commands,_creds,dest)=>{transfers++;assert.deepEqual(commands,['get a.css -o retained-0','get images/b.webp -o retained-1']);writeFileSync(dest+'/retained-0','a');writeFileSync(dest+'/retained-1','b');};
    const report=verifyRetainedFiles(entries,{},temp,transfer,false);
    assert.equal(transfers,1);assert.equal(report.status,'verified');
    assert(report.files.every(f=>f.expectedSha256===f.actualSha256));
    assert.throws(()=>verifyRetainedFiles(entries,{},temp,(commands,creds,dest)=>{transfer(commands,creds,dest);writeFileSync(dest+'/retained-1','tampered');},false),/images\/b.webp/);
    assert.equal(verifyRetainedFiles([],{},temp,()=>assert.fail('Empty transfer'),false).status,'verified');
  }finally{rmSync(temp,{recursive:true,force:true});}
});
