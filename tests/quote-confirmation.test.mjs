import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createQuoteConfirmationAdapter, parseReceipt } from '../src/lib/quote-confirmation.ts';
import { hallpartnerQuoteConfig } from '../src/config/hallpartner-quote.ts';
import { buildQuoteReceiptSummary, displayQuoteReceiptSummary, parseQuoteReceiptSummary } from '../src/lib/quote-receipt-summary.ts';

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

test('a successful quote stores only safe, selected project values in the one-time receipt', async () => {
  const answers = {
    'project.use': 'storage', 'project.hall_interest': 'lagerhall',
    'dimensions.width': '18,5', 'dimensions.length': '24',
    'site.city': 'Karlstad', 'planning.timeline': 'three_six',
    'contact.name': 'Do not persist', 'contact.email': 'private@example.invalid',
    'contact.phone': '070 999 99 99', 'contact.company': 'Private Company',
    'site.address': 'Private street 123', 'project.description': 'Private long explanation'
  };
  let stored = null;
  const adapter = createQuoteConfirmationAdapter(receipt => { stored = receipt; },
    async () => new Response(JSON.stringify({ status: 'success', requestId, customerCopy: 'accepted' }), { status: 200 }));
  assert.equal((await adapter({ ...payload, answers }, { signal: new AbortController().signal })).status, 'success');
  assert.ok(stored);
  const json = JSON.stringify(stored);
  for (const privateValue of ['private@example.invalid', '070 999', 'Private Company', 'Private street', 'Do not persist', 'Private long']) {
    assert.equal(json.includes(privateValue), false, 'Do not put contact/free text into sessionStorage');
  }
  assert.deepEqual(displayQuoteReceiptSummary(stored.summary), [
    { label: 'Användningsområde', value: 'Lager eller förvaring' },
    { label: 'Hallkategori', value: 'Lagerhall' },
    { label: 'Bredd', value: '18,5 meter' },
    { label: 'Längd', value: '24 meter' },
    { label: 'Byggort', value: 'Karlstad' },
    { label: 'Önskad byggstart', value: 'Om 3–6 månader' }
  ]);
  assert.deepEqual(parseReceipt(JSON.parse(json)), stored);
});

test('untrusted session data cannot inject extra fields or HTML into the receipt', () => {
  assert.deepEqual(buildQuoteReceiptSummary({ 'site.city': 'Example Road 14',
    'project.use': '<script>', 'contact.email': 'private@example.invalid',
    'dimensions.width': '9999999', 'project.hall_interest': 'lagerhall' }),
  [{ id: 'project.hall_interest', value: 'lagerhall' }]);
  assert.deepEqual(parseQuoteReceiptSummary([{ id: 'project.use', value: 'storage' },
    { id: 'contact.email', value: 'private@example.invalid' }]), []);
  assert.deepEqual(parseQuoteReceiptSummary([{ id: 'project.use', value: 'storage' },
    { id: 'project.use', value: 'machinery' }]), []);
  assert.deepEqual(parseQuoteReceiptSummary([{ id: 'site.city', value: '<script>' }]), []);
  const receipt = parseReceipt({requestId,createdAt:1234567,
    summary:[{ id:'contact.email',value:'secret@example.invalid' }]}, 1234567);
  assert.deepEqual(receipt, {requestId,createdAt:1234567,customerCopy:'unconfirmed'});
});
