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
 assert.equal(hallpartnerQuoteConfig.id,'hallpartner-offert-v2-review');
 assert.deepEqual(hallpartnerQuoteConfig.steps.map(s=>s.id),['project','dimensions','design','planning','customer']);
 assert.equal(hallpartnerQuoteConfig.steps.length,5);
 assert.equal(flow.next(),false,'required first question blocks empty step');
 assert.equal(flow.set('project.use','storage'),true);
 assert.equal(flow.next(),true,'a selected use is sufficient without a project description');
 assert.equal(flow.set('dimensions.confidence','need_help'),true);
 assert.equal(flow.set('dimensions.width','20'),false,'irrelevant dimension must not be editable');
 assert.equal(flow.next(),true);
 assert.equal(flow.next(),true);
 assert.equal(flow.next(),true);
 assert.equal(flow.set('contact.name','Test Person'),true);
 assert.equal(flow.set('contact.email','test@example.invalid'),true);
 assert.equal(flow.next(),true);
 assert.equal(calls,0,'no sending until explicit final submit');
 assert.equal(flow.snapshot().stepIndex,5,'five questions plus automatic control');
 flow.dispose();
});

test('V2 quote is always blocked while contact keeps its previous release gate',()=>{
 const quote=read('src/pages/offert/index.astro');
 const contact=read('src/components/ContactForm.astro');
 assert.match(quote,/const ready = false;/);
 assert.match(quote,/data-enabled=\{String\(ready\)\}/);
 assert.doesNotMatch(quote,/createJsonAdapter|fetch\(\s*['"]\/api\/lead\.php/);
 assert.match(quote,/const blocked: Adapter = async/);
 assert.ok(quote.includes('button.disabled = true'));
 assert.match(contact,/PUBLIC_HP_LEADS_ENABLED === 'true'/);
 assert.ok(contact.includes('data-enabled={String('));
 assert.ok(contact.includes('type="submit" disabled'));
 assert.ok(contact.includes("response.status === 200 && body?.status === 'success'"));
 assert.ok(contact.includes("response.status === 503 && body?.status === 'failed'"));
 assert.ok(contact.includes('allowRetry = false'));
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
 assert.ok(all.filter(field => field.help).length >= 5);
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
 flow.set('site.city','Karlstad');
 flow.set('site.postal_code','654 32');
 flow.set('site.decided','yes');
 flow.set('site.address','Synthetic Testvägen 1');
 flow.set('foundation.status','existing');
 flow.set('foundation.notes','Existing slab');
 flow.set('dimensions.confidence','need_help');
 assert.ok(!Object.hasOwn(flow.snapshot().active,'dimensions.side_height'));
 flow.set('site.decided','no');
 assert.ok(!Object.hasOwn(flow.snapshot().active,'site.address'));
 flow.set('foundation.status','none');
 assert.ok(!Object.hasOwn(flow.snapshot().active,'foundation.notes'));
 assert.equal(flow.snapshot().active['site.city'],'Karlstad');
 assert.equal(flow.snapshot().active['site.postal_code'],'654 32');
 assert.equal(flow.next(),true);
 flow.set('openings.ports','yes');
 flow.set('openings.port_needs','Synthetic port need');
 flow.set('openings.ports','no');
 assert.ok(!Object.hasOwn(flow.snapshot().active,'openings.port_needs'));
 assert.equal(flow.next(),true);
 flow.set('documents.available','yes');
 flow.set('documents.description','Synthetic drawing');
 flow.set('documents.available','later');
 assert.ok(!Object.hasOwn(flow.snapshot().active,'documents.description'));
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
 assert.equal(hallpartnerQuoteAttachmentsReviewConfig.steps.length,5);
 assert.equal(hallpartnerQuoteAttachmentsReviewConfig.steps[3].id,'planning');
 assert.equal(hallpartnerQuoteAttachmentsReviewConfig.steps.at(-1).id,'customer');
 const filesField=hallpartnerQuoteAttachmentsReviewConfig.steps[3].fields.at(-1);
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
 assert.match(page,/const ready = false;/);
 assert.match(read('server/lead/validator.php'),/\$input\['contractVersion'\] \?\? null\) !== 1/);
});



test('optional hall interest is independent of intended use and only three fields are required',()=>{
 const required=hallpartnerQuoteConfig.steps.flatMap(step=>step.fields.filter(field=>field.required).map(field=>field.id));
 assert.deepEqual(required,['project.use','contact.name','contact.email']);
 assert.deepEqual(hallpartnerQuoteAttachmentsReviewConfig.steps.flatMap(step=>step.fields.filter(field=>field.required).map(field=>field.id)),required,'file review has same four required answers');
 const project=hallpartnerQuoteConfig.steps[0];
 const preference=project.fields.find(field=>field.id==='project.hall_interest');
 assert.ok(preference&&preference.kind==='select'&&!preference.required);
 assert.equal(preference.group,'project.extra');
 assert.ok(preference.options.some(option=>option.value==='talthall'));
 const flow=createQuoteFlow(hallpartnerQuoteConfig,async()=>({status:'failed'}));
 flow.set('project.use','riding');
 flow.set('project.description','Syntetisk önskan om väderskyddad ridyta.');
 assert.equal(flow.next(),true,'hall interest is optional');
 assert.equal(flow.back(),true);
 assert.equal(flow.set('project.hall_interest','talthall'),true);
 assert.equal(flow.snapshot().active['project.use'],'riding','use is independent of interest');
 assert.equal(flow.snapshot().active['project.hall_interest'],'talthall','hall interest is retained');
 assert.equal(flow.next(),true);
 flow.dispose();
});

test('stage one requires a selected use but never forces a project description',()=>{
 for(const [config,options] of [
   [hallpartnerQuoteConfig,{}],
   [hallpartnerQuoteAttachmentsReviewConfig,{uploads:{
     async upload(){throw new Error('review-only files');},
     async submit(){return {status:'failed'};}
   }}]
 ]) {
   const desc=config.steps[0].fields.find(field=>field.id==='project.description');
   assert.ok(desc && desc.kind==='textarea' && !desc.required && !desc.validate);
   const choice=config.steps[0].fields.find(field=>field.id==='project.use');
   assert.ok(choice?.required,'one card must be selected');
   const flow=createQuoteFlow(config,async()=>({status:'failed'}),options);
   assert.equal(flow.next(),false,'no choice cannot pass stage one');
   flow.set('project.description','Hej');
   assert.equal(flow.next(),false,'a short comment cannot replace a card choice');
   flow.set('project.use','unknown');
   assert.equal(flow.next(),true,'short voluntary text is accepted');
   assert.equal(flow.back(),true);
   flow.set('project.description','');
   assert.equal(flow.next(),true,'empty voluntary text is accepted');
   assert.equal(flow.snapshot().active['project.description'],'');
   flow.dispose();
 }
});

test('optional measurement certainty can be skipped without blocking the full six-step review',()=>{
 const flow=createQuoteFlow(hallpartnerQuoteConfig,async()=>({status:'failed'}));
 flow.set('project.use','storage');
 flow.set('project.description','Syntetiskt test av offertförfrågan med okända mått.');
 assert.equal(flow.next(),true);
 assert.equal(flow.snapshot().active['dimensions.confidence'],'');
 assert.equal(flow.next(),true,'an answer about measurement confidence is no longer required');
 assert.equal(flow.snapshot().stepIndex,2);
 assert.equal(flow.back(),true);
 assert.equal(flow.set('dimensions.width','18,5'),true,'width remains available when certainty is blank');
 assert.equal(flow.set('dimensions.length','32'),true,'length remains available when certainty is blank');
 assert.equal(flow.snapshot().active['dimensions.width'],'18,5');
 assert.equal(flow.next(),true);
 assert.equal(flow.next(),true);
 assert.equal(flow.next(),true);
 flow.set('contact.name','Synthetic Person');
 flow.set('contact.email','test@example.invalid');
 assert.equal(flow.next(),true);
 assert.equal(flow.snapshot().reviewing,true);
 assert.equal(flow.snapshot().stepIndex,5);
 assert.equal(flow.snapshot().active['dimensions.confidence'],'');
 assert.equal(flow.snapshot().active['dimensions.width'],'18,5');
 assert.ok(!Object.hasOwn(flow.snapshot().errors,'dimensions.confidence'));
 flow.dispose();
});

test('phone as contact preference requires a phone number, email does not',()=>{
 const flow=createQuoteFlow(hallpartnerQuoteConfig,async()=>({status:'failed'}));
 flow.set('project.use','storage');
 flow.set('project.description','Syntetisk förfrågan om hall för förvaring.');
 assert.equal(flow.next(),true);
 flow.set('dimensions.confidence','need_help');
 assert.equal(flow.next(),true);
 assert.equal(flow.next(),true);
 assert.equal(flow.next(),true);
 flow.set('contact.name','Synthetic Contact');
 flow.set('contact.email','test@example.invalid');
 flow.set('contact.preference','phone');
 assert.equal(flow.next(),false,'cannot request call without a number');
 assert.ok(flow.snapshot().errors['contact.preference']?.includes('telefonnummer'));
 flow.set('contact.phone','070 123 45 67');
 assert.equal(flow.next(),true,'provided phone clears invalid contact preference');
 assert.equal(flow.snapshot().reviewing,true);
 flow.dispose();
});


test('V2 specification documents the updated three-field minimum without requiring free text',()=>{
 const spec=read('docs/content/HALLPARTNER_OFFERTGUIDE_V2.md');
 for(const token of ['Kundbekräftat','Arbetsförslag','tre obligatoriska','project.description','dimensions.confidence','documents.attachments','fem frågesteg']) {
   assert.ok(spec.includes(token),token);
 }
 assert.doesNotMatch(spec,/fem obligatoriska fält/i);
 assert.match(spec,/\`project.description\`[^\n]*\*\*Frivillig\*\*/);
});
