import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname } from 'node:path';
import { PREVIEW, PROBE, PAGES, safePath, sha256 } from '../scripts/preview/policy.mjs';
import { inspectHtml, rightsStatus, verifyPayload } from '../scripts/preview/payload.mjs';
import { endpoint, credentials, lftpScript, assertAbsent, publicProof, assertPublishContext, retainedFiles, productionSnapshot, remoteInventory } from '../scripts/preview/remote.mjs';

const html = '<meta name="robots" content="noindex,nofollow"><h1>Test</h1>';
test('read-only inventory records protected paths without permitting command injection or traversal', () => {
  assert.deepEqual(remoteInventory('./\n./cgi-bin/\n./cgi-bin/.htaccess\n./index.html\n'), {
    remoteFiles: ['cgi-bin/.htaccess', 'index.html'], remoteDirectories: ['cgi-bin'],
  });
  for (const path of ['../outside', './a/../outside', '/absolute', '-o', 'a;put x', 'a b', 'a"b', 'a\\b', './a//b', './x\n./x']) {
    assert.throws(() => remoteInventory(path));
  }
});
test('public allowlist excludes internal pages and server code', () => {
  assert.equal(PAGES.length,13);
  for (const path of ['../index.html','/index.html','a//x','.env','api/lead.php','server/key.json','prototype/index.html','x.php5','x.PHTML','x.log','x.map','docs/a.html','x;put-secret']) assert.throws(()=>safePath(path));
  assert.equal(safePath('_astro/gallery.aB-12.js'),'_astro/gallery.aB-12.js');
});
test('missing robots and active form contracts fail closed', () => {
  assert.throws(()=>inspectHtml('<h1>Test</h1>','other.html'));
  assert.throws(()=>inspectHtml(html+'<form data-enabled="true"></form>','other.html'));
  assert.throws(()=>inspectHtml(html+'<form data-enabled="false" action="/api/lead.php"></form>','other.html'));
  assert.throws(()=>inspectHtml(html+'<iframe src="https://example.com"></iframe>','other.html'));
  assert.throws(()=>inspectHtml(html,'kontakt/index.html'));
  assert.throws(()=>inspectHtml(html,'offert/index.html'));
  inspectHtml(html+'<form id="hp-contact-form" data-enabled="false"></form>','kontakt/index.html');
  inspectHtml(html+'<div id="hp-offert-guide" data-enabled="false"></div>','offert/index.html');
});
test('HTML parser retains responsive images, inline imports and stylesheet references', () => {
  const r=inspectHtml(html+'<img src="/a.webp" srcset="/a.webp 320w, /b.webp 640w"><link rel="stylesheet" href="/a.css"><script type="module">import "/a.js"</script>','other.html');
  assert.deepEqual(r.assets,['/a.webp','/a.webp','/b.webp','/a.css']);assert.equal(r.scripts.length,1);
});
test('image permission binds source, output bytes, origin, approver and evidence', () => {
  const image={source:'public/a.webp',sourceSha256:'a'.repeat(64),outputSha256:'b'.repeat(64)};
  const permission={...image,scope:PREVIEW,approvedBy:'Owner',evidence:'Rights record'};
  assert.equal(rightsStatus({images:[image]},{schemaVersion:1,approvals:[]})[0].approved,false);
  assert.equal(rightsStatus({images:[image]},{schemaVersion:1,approvals:[permission]})[0].approved,true);
  for(const field of ['source','sourceSha256','outputSha256','scope','approvedBy','evidence']) assert.equal(rightsStatus({images:[image]},{schemaVersion:1,approvals:[{...permission,[field]:''}]})[0].approved,false);
});
test('FTPS credentials cannot inject a path, command or insecure host scheme', () => {
  for(const host of ['http://example.org','ftp://user:pass@example.org','ftp://example.org/domains/live','example.org;bye','example.org\nbye','ftp://example.org:22'])assert.throws(()=>endpoint(host));
  assert.equal(endpoint('ftp.example.org'),'ftp://ftp.example.org:21');
  assert.throws(()=>credentials({FTP_HOST:'ftp.example.org',FTP_USERNAME:'name;bye',FTP_PASSWORD:'x'}));
  const c=credentials({FTP_HOST:'ftp.example.org',FTP_USERNAME:'preview@example.org',FTP_PASSWORD:'secret;"\n$()'});
  const script=lftpScript(['get marker.txt -o marker.txt'],c);
  assert(!script.includes(c.password));assert(script.includes('--env-password'));assert(script.includes('set ftp:ssl-force yes'));assert(script.includes('set ssl:verify-certificate yes'));assert(script.includes('set ssl:check-hostname yes'));assert(!/ssl-allow no|--delete/.test(script));
});
test('public target proof rejects soft 404, production alias, redirects/errors and missing marker', async () => {
  const good=async url=>({status:url.startsWith(PREVIEW)?200:404,body:Buffer.from(url.startsWith(PREVIEW)?PROBE:'not found')});
  await publicProof(good);
  await assert.rejects(()=>publicProof(async()=>({status:200,body:Buffer.from(PROBE)})));
  await assert.rejects(()=>assertAbsent('https://hallpartner.se','x',async()=>({status:200,body:Buffer.from('not found')})));
  await assert.rejects(()=>assertAbsent('https://hallpartner.se','x',async()=>({status:503,body:Buffer.from('unavailable')})));
  await assert.rejects(()=>publicProof(async()=>{throw Error('TLS failed');}));
});
test('publication rejects PRs, other branches/repos and mismatched commits', () => {
  const sha='a'.repeat(40);const env={GITHUB_REPOSITORY:'Amelio-AB/hallpartner',GITHUB_REF:'refs/heads/main',GITHUB_EVENT_NAME:'push',GITHUB_SHA:sha};
  assertPublishContext(env,sha);
  for(const [field,value]of Object.entries({GITHUB_REPOSITORY:'other/repo',GITHUB_REF:'refs/heads/feature/test',GITHUB_EVENT_NAME:'pull_request',GITHUB_SHA:'b'.repeat(40)}))assert.throws(()=>assertPublishContext({...env,[field]:value},sha));
});
test('stale remote pages/PHP/unreviewed assets block without deleting anything', () => {
  const m={files:[{path:'index.html'}]};const policy={retainedFiles:[]};
  assert.deepEqual(retainedFiles(['index.html'],m,policy),[]);
  for(const path of ['old-image.jpg','prototype/index.html','api/lead.php','.htaccess'])assert.throws(()=>retainedFiles([path],m,policy));
  const entry={path:'old-image.jpg',sha256:'a'.repeat(64),approvedBy:'Owner',evidence:'Preview usage permission'};
  assert.deepEqual(retainedFiles(['old-image.jpg'],m,{retainedFiles:[entry]}),[entry]);
});
test('production fingerprint requires stable successful responses before upload', async () => {
  assert.equal((await productionSnapshot(async()=>({status:200,body:Buffer.from('same')}))).length,6);
  let n=0;await assert.rejects(()=>productionSnapshot(async()=>({status:200,body:Buffer.from(String(n++))})));
  await assert.rejects(()=>productionSnapshot(async()=>({status:500,body:Buffer.from('error')})));
});
test('payload verification rejects empty or forged file inventory', () => {
  assert.throws(()=>verifyPayload('not-present',{commit:'a'.repeat(40),files:[],images:[]}));
});

test('verified payload rejects changed bytes, forbidden additions and forged active-form hashes', () => {
  const root=mkdtempSync(tmpdir()+'/hp-payload-test-');
  try {
    const manifest={commit:'a'.repeat(40),files:[],images:[]};
    for(const page of PAGES){
      const body=html+'En hall börjar med ditt behov.'+(page==='kontakt/index.html'?'<form id="hp-contact-form" data-enabled="false"></form>':'')+(page==='offert/index.html'?'<div id="hp-offert-guide" data-enabled="false"></div>':'');
      mkdirSync(dirname(root+'/'+page),{recursive:true});writeFileSync(root+'/'+page,body);manifest.files.push({path:page,sha256:sha256(body)});
    }
    const robots='User-agent: *\nDisallow: /\n';writeFileSync(root+'/robots.txt',robots);manifest.files.push({path:'robots.txt',sha256:sha256(robots)});
    verifyPayload(root,manifest);
    writeFileSync(root+'/extra.php','<?php echo "no";');assert.throws(()=>verifyPayload(root,manifest));rmSync(root+'/extra.php');
    writeFileSync(root+'/index.html','tampered');assert.throws(()=>verifyPayload(root,manifest));
    const body=html+'En hall börjar med ditt behov.<form data-enabled="true"></form>';writeFileSync(root+'/index.html',body);manifest.files.find(x=>x.path==='index.html').sha256=sha256(body);assert.throws(()=>verifyPayload(root,manifest));
  } finally {rmSync(root,{recursive:true,force:true});}
});

test('future releases can retain verified hashed assets, but not stale HTML or revoked images', () => {
  const prior=[{path:'_astro/old.js',sha256:'a'.repeat(64)},{path:'_astro/old.webp',sha256:'b'.repeat(64)},{path:'removed/index.html',sha256:'c'.repeat(64)}];const policy={retainedFiles:[]};const manifest={files:[]};
  assert.deepEqual(retainedFiles(['_astro/old.js'],manifest,policy,prior),[prior[0]]);
  assert.throws(()=>retainedFiles(['_astro/old.webp'],manifest,policy,prior));
  assert.deepEqual(retainedFiles(['_astro/old.webp'],manifest,policy,prior,[{outputSha256:'b'.repeat(64),scope:PREVIEW,approvedBy:'Owner',evidence:'Rights record'}]),[prior[1]]);
  assert.throws(()=>retainedFiles(['removed/index.html'],manifest,policy,prior));
});
