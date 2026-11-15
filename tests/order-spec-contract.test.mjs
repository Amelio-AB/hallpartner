import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = file => JSON.parse(readFileSync(new URL('../shared/order-spec/'+file, import.meta.url), 'utf8'));
const schema=read('order-spec-v1.schema.json');
const example=read('example.v1.json');
const fields=read('fields.v1.json');
test('contract: frozen version and strict top-level keys',()=>{
 assert.equal(schema.$schema,'https://json-schema.org/draft/2020-12/schema');
 assert.equal(schema.additionalProperties,false);
 assert.equal(example.schemaVersion,1);
 assert.equal(example.formType,'hallpartner-order-spec-v1');
 assert.deepEqual(Object.keys(example).filter(k=>!Object.keys(schema.properties).includes(k)),[]);
 for(const required of schema.required)assert.ok(required in example,required);
});
test('contract: source covers header plus 1, 2A/B, 3A/B and 4–12',()=>{
 assert.deepEqual(fields.sourceMapping.map(s=>s.pdf),['Header','1','2A','2B','3A','3B','4','5','6','7','8','9','10','11','12']);
 assert.deepEqual(Object.keys(example.sections).sort(),Object.keys(fields.sectionCodes).sort());
 assert.ok(fields.sourceMapping.every(s=>s.labels.length&&s.paths.length));
});
test('contract: no client price, approval, role authority or signature',()=>{
 const forbidden=['approvalStatus','releasedForProduction','signature','purchasePrice','price','cost','permission'];
 const raw=JSON.stringify(example);
 for(const word of forbidden) assert.doesNotMatch(raw,new RegExp('"'+word+'"','i'));
 assert.equal(schema.properties.items.items.additionalProperties,false);
 assert.equal(schema.properties.sections.additionalProperties,false);
 assert.equal(example.finalReview.detailsReviewed,false);
 assert.equal(example.documentReferences[0].number,'SYNTH-01');
});
test('contract: sample item identities and safe material categories',()=>{
 assert.equal(new Set(example.items.map(i=>i.lineId)).size, example.items.length);
 const cat=new Set(fields.itemCategories);
 for(const item of example.items){
 assert.ok(cat.has(item.category),item.category);
 assert.ok(item.quantity>0);
 assert.ok(schema.properties.items.items.required.every(k=>k in item),item.lineId);
 }
 assert.match(example.submitter.email,/@example\.invalid$/);
 assert.match(example.recipient.email,/@example\.invalid$/);
});
