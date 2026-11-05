import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createQuoteConfirmationAdapter, parseReceipt } from '../src/lib/quote-confirmation.ts';
import { hallpartnerQuoteConfig } from '../src/config/hallpartner-quote.ts';

const requestId = '1234567890abcdef12345678';
const payload = { contractVersion:1, technicalId:'quote-flow', configurationId:hallpartnerQuoteConfig.id, answers:{} };
test('only HTTP 200 + success navigates; copy result is independent and receipt excludes PII', async () => {
  for (const [http,body,expected] of [
    [200,{status:'success',requestId,customerCopy:'accepted',email:'secret@example.invalid'},'success'],
    [200,{status:'success',requestId,customerCopy:'unconfirmed'},'success'],
    [200,{status:'success',requestId},'success'],
    [200,{status:'failed'},'unknown'],
    [201,{status:'success',requestId},'unknown'],
    [422,{status:'validation-error',fields:{'contact.email':'Kontrollera adressen'}},'validation-error'],
    [503,{status:'failed'},'failed'],
    [500,{status:'success',requestId},'unknown'],
  ]) {
    const receipts=[]; let calls=0;
    const adapter=createQuoteConfirmationAdapter(r=>receipts.push(r),async()=>{
      calls++;return new Response(JSON.stringify(body),{status:http});
    });
    assert.equal((await adapter(payload,{signal:new AbortController().signal})).status,expected);
    assert.equal(calls,1);
    assert.equal(receipts.length,expected==='success'?1:0);
    if(receipts.length){
      assert.deepEqual(Object.keys(receipts[0]).sort(),['createdAt','customerCopy','requestId']);
      assert.equal(receipts[0].customerCopy,body.customerCopy==='accepted'?'accepted':'unconfirmed');
    }
  }
});
test('network, malformed responses, aborts and broken storage never cause a retry or false redirect',async()=>{
  for(const fetcher of [async()=>{throw Error('timeout');},async()=>new Response('invalid JSON')]) {
    let redirects=0;
    await assert.rejects(createQuoteConfirmationAdapter(()=>redirects++,fetcher)(payload,{signal:new AbortController().signal}));
    assert.equal(redirects,0);
  }
  const fetcher=async()=>new Response(JSON.stringify({status:'success',requestId}));
  const controller=new AbortController();controller.abort();
  let redirects=0;
  await createQuoteConfirmationAdapter(()=>redirects++,fetcher)(payload,{signal:controller.signal});
  assert.equal(redirects,0);
  const adapter=createQuoteConfirmationAdapter(()=>{throw Error('Storage blocked');},fetcher);
  assert.equal((await adapter(payload,{signal:new AbortController().signal})).status,'success');
});
test('receipt expires, rejects injected/invalid IDs and strips extra data',()=>{
  const now=123456789;
  for(const value of [null,{}, {requestId:'<script>',createdAt:now}, {requestId,createdAt:now+1},
    {requestId,createdAt:now-1800001}, {requestId,createdAt:NaN}]) assert.equal(parseReceipt(value,now),null);
  assert.deepEqual(parseReceipt({requestId,createdAt:now,customerCopy:'anything',email:'private'},now),
    {requestId,createdAt:now,customerCopy:'unconfirmed'});
});
test('all server labels and choices exactly match the unchanged guide',()=>{
  const fields=JSON.parse(readFileSync('server/lead/quote-fields.json','utf8'));
  for(const field of hallpartnerQuoteConfig.steps.flatMap(s=>s.fields)) {
    assert.equal(fields[field.id].label,field.label);
    if(field.options)assert.deepEqual(fields[field.id].options,Object.fromEntries(field.options.map(o=>[o.value,o.label])));
  }
});
