import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const dist=join(root,'dist');
const m=JSON.parse(readFileSync(join(root,'docs/migration/legacy-url-map.v01.json'),'utf8'));
const retained=m.oldPages.filter(x=>x.actionProposal==='KEEP_PATH_200');
const unresolved=m.oldPages.filter(x=>x.actionProposal==='HOLD_FOR_DECISION');
assert.equal(retained.length,10);assert.equal(unresolved.length,2);
assert.deepEqual(m.activatedRedirects,[]);
for(const r of retained){
 const file=join(dist,r.sourcePath.slice(1),'index.html');
 assert.ok(existsSync(file),'missing '+r.sourcePath);
 const html=readFileSync(file,'utf8');
 assert.ok(html.includes('rel="canonical" href="https://hallpartner.se'+r.sourcePath+'"'),'wrong canonical '+r.sourcePath);
 assert.ok(html.includes('name="robots" content="noindex,nofollow"'),'missing Draft noindex '+r.sourcePath);
}
const siteMaps=readdirSync(dist).filter(x=>/^sitemap.*\.xml$/.test(x));
assert.ok(siteMaps.length);
for(const r of unresolved){
 assert.equal(r.destinationPath,null);
 if(r.sourcePath==='/offert/') {
   const draftFile=join(dist,'offert','index.html');
   assert.ok(existsSync(draftFile),'missing disabled AMP-001 draft');
   const html=readFileSync(draftFile,'utf8');
   assert.ok(html.includes('noindex,nofollow') && html.includes('data-enabled="false"'),'quote preview must be non-delivering');
 } else {
   assert.ok(!existsSync(join(dist,r.sourcePath.slice(1),'index.html')),'unapproved new route '+r.sourcePath);
 }
 for(const file of siteMaps){
  assert.ok(!readFileSync(join(dist,file),'utf8').includes('https://hallpartner.se'+r.sourcePath),'unresolved URL in sitemap');
 }
}
console.log('Verified ten unchanged Astro destinations and two unresolved WordPress paths; no redirects.');
