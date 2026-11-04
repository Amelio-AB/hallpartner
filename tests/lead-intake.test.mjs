import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { createQuoteFlow } from '@amelio/web-platform/quote-flow';
import { hallpartnerQuoteConfig } from '../src/config/hallpartner-quote.ts';
import { hallpartnerQuoteAttachmentsReviewConfig } from '../src/config/hallpartner-quote-attachments-review.ts';

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

test('AMP-001 1.5.0 optional help and collapsible groups preserve V1 answers', () => {
 const all = hallpartnerQuoteConfig.steps.flatMap(step => step.fields);
 assert.ok(all.filter(field => field.help).length >= 3);
 for (const step of hallpartnerQuoteConfig.steps) {
   for (const field of step.fields) if (field.group) {
     assert.ok(step.groups?.some(group => group.id === field.group), field.id);
   }
 }
 let calls = 0;
 const flow = createQuoteFlow(hallpartnerQuoteConfig, async payload => {
   calls++;
   assert.equal(payload.contractVersion, 1);
   assert.deepEqual(Object.keys(payload).sort(), ['answers','configurationId','contractVersion','technicalId']);
   return {status:'success'};
 });
 flow.set('project.use','storage');
 flow.set('project.description','En syntetisk förfrågan om lagerbyggnad.');
 assert.equal(flow.next(),true);
 flow.set('dimensions.confidence','approximate');
 flow.set('dimensions.side_height','5');
 flow.set('dimensions.confidence','need_help');
 assert.ok(!Object.hasOwn(flow.snapshot().active,'dimensions.side_height'));
 assert.equal(flow.next(),true);
 flow.set('site.city','Karlstad');
 flow.set('site.postal_code','654 32');
 assert.equal(flow.next(),true);
 flow.set('contact.name','Synthetic Person');
 flow.set('contact.email','test@example.invalid');
 assert.equal(flow.next(),true);
 assert.equal(calls,0);
 flow.dispose();
});

test('V2 attachment review cannot silently fall back to V1 or the PHP receiver', () => {
 let v1Calls=0;
 const fallback=async()=>{ v1Calls++; return {status:'success'}; };
 assert.throws(()=>createQuoteFlow(hallpartnerQuoteAttachmentsReviewConfig, fallback),/explicit V2 upload integration/);
 const review=createQuoteFlow(hallpartnerQuoteAttachmentsReviewConfig, fallback, { uploads:{
    async upload(){throw new Error('review only');},
    async submit(){return {status:'failed'};}
 } });
 assert.equal(hallpartnerQuoteAttachmentsReviewConfig.id,'hallpartner-offert-files-review-v2');
 const filesField=hallpartnerQuoteAttachmentsReviewConfig.steps.at(-1).fields[0];
 assert.equal(filesField.kind,'files');
 assert.deepEqual(filesField.files.allowedFormats,['jpg','png','webp','pdf','docx']);
 assert.equal(filesField.files.maxFiles,10);
 assert.equal(filesField.files.maxTotalBytes,50*1024*1024);
 assert.equal(v1Calls,0);
 review.dispose();
 const page=read('src/pages/offert/index.astro');
 assert.match(page,/PUBLIC_HP_QUOTE_FILES_REVIEW === 'true'/);
 assert.match(page,/!ready && import\.meta\.env/);
 assert.match(page,/async upload\(\) \{ throw new Error/);
 assert.match(page,/enabled \? createJsonAdapter\('\/api\/lead\.php'\) : blocked/);
 assert.match(read('server/lead/validator.php'),/\$input\['contractVersion'\] \?\? null\) !== 1/);
});
