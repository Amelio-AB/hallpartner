import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createJsonAdapter, createQuoteFlow } from '@amelio/web-platform/quote-flow';
import { hallpartnerQuoteConfig } from '../src/config/hallpartner-quote.ts';
import { quoteReleasePolicy, quoteBuildEnvironment } from '../scripts/preview/quote-release.mjs';

test('preview build flags follow the reviewed policy; review fixtures always disable submission', () => {
  const dir=mkdtempSync(join(tmpdir(),'hp-quote-flags-'));
  try {
    const envFile=join(dir,'flags');
    const proc=spawnSync(process.execPath,['scripts/preview/quote-release.mjs','github-env'],{
      encoding:'utf8',env:{...process.env,GITHUB_ENV:envFile}
    });
    assert.equal(proc.status,0,proc.stderr);
    const flags=readFileSync(envFile,'utf8');
    const expected=String(quoteReleasePolicy().enabled);
    for(const key of ['PUBLIC_HP_QUOTE_SUBMISSIONS_ENABLED','PUBLIC_HP_RECEIVER_VERIFIED','PUBLIC_HP_PRIVACY_APPROVED']) {
      assert.ok(flags.includes(key+'='+expected+'\n'),key+' must follow the verified policy');
    }
    const policy=JSON.parse(readFileSync('config/preview-quote-release.json','utf8'));
    const contactPolicy=JSON.parse(readFileSync('config/preview-contact-release.json','utf8'));
    const review=quoteBuildEnvironment({...policy,mode:'review',approval:{}}, {...contactPolicy,mode:'review',approval:{}});
    assert.ok(Object.values(review).every(value=>value==='false'));
    assert.throws(()=>quoteBuildEnvironment({...policy,mode:'enabled',approval:{}}));
    assert.ok(flags.includes('PUBLIC_HP_LEADS_ENABLED='+String(contactPolicy.mode==='enabled')+'\n'),
      'Contact flag must follow its independently approved policy');
    assert.ok(flags.includes('PUBLIC_HP_QUOTE_FILES_REVIEW=false\n'),
      'Quote file uploads must remain disabled');
  } finally { rmSync(dir,{recursive:true,force:true}); }
});

test('five-step V2 flow sends its exact JSON contract via the AMP adapter when explicitly activated in a mock', async () => {
  let requests=0;
  const fetcher=async (url,options) => {
    requests++;
    assert.equal(url,'/api/lead.php');
    assert.equal(options.method,'POST');
    assert.equal(options.credentials,'omit');
    assert.equal(options.redirect,'error');
    assert.equal(options.headers['Content-Type'],'application/json');
    const payload=JSON.parse(options.body);
    assert.equal(payload.technicalId,'quote-flow');
    assert.equal(payload.contractVersion,1);
    assert.equal(payload.configurationId,'hallpartner-offert-v2-review');
    assert.equal(payload.answers['project.use'],'storage');
    assert.equal(payload.answers['project.description'],'');
    assert.equal(payload.answers['contact.name'],'Syntetisk Testperson');
    assert.equal(payload.answers['contact.email'],'test@example.invalid');
    assert.ok(!('attachments' in payload),'uploads are not enabled');
    return {status:200,json:async()=>({status:'success',requestId:'1234567890abcdef12345678'})};
  };
  const flow=createQuoteFlow(hallpartnerQuoteConfig,createJsonAdapter('/api/lead.php',fetcher));
  assert.equal(flow.next(),false);
  assert.equal(flow.set('project.use','storage'),true);
  assert.equal(flow.next(),true);
  for(let i=0;i<3;i++)assert.equal(flow.next(),true);
  flow.set('contact.name','Syntetisk Testperson');
  flow.set('contact.email','test@example.invalid');
  assert.equal(flow.next(),true);
  assert.equal(flow.snapshot().reviewing,true);
  assert.equal(requests,0,'before clicking submit no network call is allowed');
  const result=await flow.submit();
  assert.equal(result.status,'success');
  assert.equal(requests,1,'exactly one synthetic submit');
  flow.dispose();
});
