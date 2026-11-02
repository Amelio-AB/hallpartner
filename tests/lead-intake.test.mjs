import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { createQuoteFlow } from '@amelio/web-platform/quote-flow';
import { hallpartnerQuoteConfig } from '../src/config/hallpartner-quote.ts';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=(p)=>readFileSync(join(root,p),'utf8');

test('AMP-001 genuine public contract accepts the compact Hallpartner draft',()=>{
 let calls=0;
 const flow=createQuoteFlow(hallpartnerQuoteConfig,async()=>{calls++;return{status:'success'}});
 const ids=hallpartnerQuoteConfig.steps.flatMap(step=>step.fields.map(f=>f.id));
 assert.equal(new Set(ids).size,ids.length);
 assert.equal(hallpartnerQuoteConfig.id,'hallpartner-offert-v1');
 assert.equal(hallpartnerQuoteConfig.steps.length,4);
 assert.equal(flow.next(),false,'required first question blocks empty step');
 assert.equal(flow.set('project.use','storage'),true);
 assert.equal(flow.set('project.description','This synthetic enquiry is long enough.'),true);
 assert.equal(flow.next(),true);
 assert.equal(flow.set('dimensions.confidence','need_help'),true);
 assert.equal(flow.set('dimensions.width','20'),false,'irrelevant dimension must not be editable');
 assert.equal(flow.next(),true);
 assert.equal(flow.next(),true);
 assert.equal(flow.set('contact.name','Test Person'),true);
 assert.equal(flow.set('contact.email','test@example.invalid'),true);
 assert.equal(flow.next(),true);
 assert.equal(calls,0,'no sending until explicit final submit');
 flow.dispose();
});

test('quote UI and contact UI cannot send from an unconfigured Draft build',()=>{
 const quote=read('src/pages/offert/index.astro');
 const contact=read('src/components/ContactForm.astro');
 for(const s of [quote,contact]) {
   assert.match(s,/PUBLIC_HP_LEADS_ENABLED === 'true'/);
   assert.ok(s.includes("data-enabled={String("),'form must be gated in rendered HTML');
 }
 assert.ok(quote.includes("enabled ? createJsonAdapter('/api/lead.php') : blocked"));
 assert.ok(quote.includes('button.disabled = true'));
 assert.ok(contact.includes('type="submit" disabled'));
 assert.ok(contact.includes("response.status === 200 && body?.status === 'success'"));
 assert.ok(contact.includes("response.status === 503 && body?.status === 'failed'"));
 assert.ok(contact.includes('allowRetry = false'),'uncertain result must not cause blind retry');
 assert.ok(existsSync(join(root,'public/api/lead.php')));
});

test('PHP public bootstrap never carries recipient credentials or bundled private code',()=>{
 const bridge=read('public/api/lead.php');
 assert.match(bridge,/HP_LEAD_PRIVATE_DIR/);
 assert.match(bridge,/503, 'failed'/);
 assert.doesNotMatch(bridge,/Password|smtp_password|smtp_username/);
 const config=read('server/lead/config.example.php');
 assert.match(config,/'enabled' => false/);
 assert.match(config,/'privacy_approved' => false/);
 assert.doesNotMatch(config,/github_pat_|ghp_[a-zA-Z0-9]{16}/);
 const composer=JSON.parse(read('server/lead/composer.json'));
 assert.equal(composer.require['phpmailer/phpmailer'],'7.1.1');
});
