import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const get=(name)=>JSON.parse(readFileSync(join(root,'docs/migration',name),'utf8'));
const m=get('legacy-url-map.v01.json'),i=get('legacy-media-sitemap.v01.json');
test('12 live URLs and no authorized redirects',()=>{
 assert.equal(m.oldPages.length,12);
 assert.equal(new Set(m.oldPages.map(x=>x.sourcePath)).size,12);
 assert.ok(m.oldPages.every(x=>x.sourceGetStatus===200));
 assert.deepEqual(m.proposedRedirects,[]);assert.deepEqual(m.activatedRedirects,[]);
});
test('retain ten URL paths unchanged',()=>{
 const rows=m.oldPages.filter(x=>x.actionProposal==='KEEP_PATH_200');
 assert.equal(rows.length,10);
 for(const r of rows){assert.equal(r.sourcePath,r.destinationPath);assert.ok(existsSync(join(root,r.astroRoute)),r.sourcePath);}
});
test('no silent form loss or test-page redirect',()=>{
 const by=Object.fromEntries(m.oldPages.map(x=>[x.sourcePath,x]));
 assert.match(by['/kontakt/'].functionGap,/form/i);
 for(const x of ['/offert/','/quote-engine-test/']){
  assert.equal(by[x].actionProposal,'HOLD_FOR_DECISION');
  assert.equal(by[x].destinationPath,null);
 }
});
test('media are rights-unverified distinct URLs',()=>{
 assert.equal(i.items.length,32);assert.equal(i.sitemapLocOccurrences,41);
 assert.equal(new Set(i.items.map(x=>x.oldUrl)).size,32);
 assert.equal(i.items.reduce((n,x)=>n+x.occurrences,0),41);
 assert.ok(i.items.every(x=>x.oldPath.startsWith('/wp-content/uploads/')&&x.rights==='UNVERIFIED'));
});
