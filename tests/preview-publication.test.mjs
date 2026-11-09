import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname } from 'node:path';
import { PREVIEW, PROBE, PAGES, safePath, sha256 } from '../scripts/preview/policy.mjs';
import { inspectHtml, rightsStatus, verifyPayload } from '../scripts/preview/payload.mjs';
import { quoteRelease, quoteReleasePolicy } from '../scripts/preview/quote-release.mjs';
import { contactReleasePolicy } from '../scripts/preview/contact-release.mjs';
import { endpoint, credentials, lftpScript, assertAbsent, publicProof, assertPublishContext, retainedFiles, productionSnapshot, verifyProduction, remoteInventory, deliveryStatus, assertDelivery, verifyPublished, request, transientHttpReadError } from '../scripts/preview/remote.mjs';
import { expectedHttpBytes, fingerprint } from '../scripts/preview/delivery.mjs';

const html = '<meta name="robots" content="noindex,nofollow"><h1>Test</h1>';
test('pre-upload delivery allows only the exact forward HTML origin rewrite', async () => {
  const body = Buffer.from('<link rel="canonical" href="https://hallpartner.se/">');
  const fileFingerprints = [fingerprint('index.html', body), { path: 'cgi-bin/.htaccess', sha256: 'a'.repeat(64) }];
  const expected = expectedHttpBytes('index.html', body);
  const requested = [];
  const deliveryChecks = await deliveryStatus(fileFingerprints, async url => {
    requested.push(url); return { status: 200, body: expected, url };
  });
  assert.equal(requested.length, 1); // Never request protected server configuration via HTTP.
  assertDelivery({ fileFingerprints, deliveryChecks });
  for (const response of [
    { status: 200, body }, // Required observed substitution missing.
    { status: 404, body: expected },
    { status: 200, body: Buffer.concat([expected, Buffer.from('changed text')]) },
    { status: 200, body: Buffer.from(expected.toString().replace(PREVIEW, 'https://other.invalid')) },
    { status: 200, body: expected, url: 'https://other.invalid/index.html' },
  ]) {
    const checks = await deliveryStatus(fileFingerprints, async url => ({ url, ...response }));
    assert.throws(() => assertDelivery({ fileFingerprints, deliveryChecks: checks }));
  }
  assert.throws(() => assertDelivery({ fileFingerprints, deliveryChecks: [] }));
  assert.throws(() => assertDelivery({ fileFingerprints: [], deliveryChecks: [] }));
  assert.throws(() => assertDelivery({ fileFingerprints, deliveryChecks: deliveryChecks.map(r => ({...r, path:'wrong.html'})) }));
  assert.throws(() => assertDelivery({ fileFingerprints, deliveryChecks: deliveryChecks.map(r => ({...r, expectedHttpSha256:r.ftpsSha256})) }));
});

test('remote HTTP proof retries only transient read errors without changing any verification rules', async () => {
  const url = PREVIEW + '/offert/';
  const transient = new TypeError('fetch failed', {cause:Object.assign(new Error('closed'),{code:'EPIPE'})});
  assert.equal(transientHttpReadError(transient), true);
  assert.equal(transientHttpReadError(Object.assign(new Error('certificate failed'),{code:'CERT_HAS_EXPIRED'})),false);
  let calls=0, delays=[];
  const ok=await request(url,async () => {
    calls++;
    if (calls===1) throw transient;
    return new Response('<h1>Expected</h1>',{status:200,headers:{'content-type':'text/html'}});
  },async ms=>{delays.push(ms);});
  assert.equal(calls,2);
  assert.deepEqual(delays,[250]);
  assert.equal(ok.status,200);
  assert.equal(ok.body.toString(),'<h1>Expected</h1>');

  calls=0;
  const status=await request(url,async()=>{
    calls++;return new Response('blocked',{status:503});
  },async()=>{throw Error('unexpected retry delay');});
  assert.equal(calls,1,'503 must not be treated as a transient transport failure');
  assert.equal(status.status,503,'HTTP status must not be rewritten as success');

  for (const status of [404, 503]) {
    calls=0;
    await assert.rejects(request(url,async()=>{
      calls++;return {status,arrayBuffer:async()=>{throw transient;}};
    },async()=>{throw Error('HTTP error must never retry, even with a broken body');}), /no verification claimed/);
    assert.equal(calls,1,'A known HTTP error cannot be hidden by retrying its body');
  }

  calls=0;
  await assert.rejects(request(url,async()=>{
    calls++;throw transient;
  },async()=>{}),/no verification claimed/);
  assert.equal(calls,3,'retry limit for failed HTTPS reads');

  calls=0;
  await assert.rejects(request(url,async()=>{
    calls++;
    throw Object.assign(new Error('TLS mismatch'),{code:'ERR_TLS_CERT_ALTNAME_INVALID'});
  },async()=>{}),/no verification claimed/);
  assert.equal(calls,1,'TLS failures never retried');

  calls=0;
  await assert.rejects(request(url,async()=>{
    calls++;return new Response(null,{status:302,headers:{location:'https://attacker.invalid/' }});
  },async()=>{}),/Unexpected redirect origin/);
  assert.equal(calls,1,'unapproved redirects never retried');

  calls=0;
  const bodyError=await request(url,async()=>{
    calls++;
    if(calls===1)return {status:200,headers:new Headers(),arrayBuffer:async()=>{throw transient;}};
    return new Response('valid full body',{status:200});
  },async()=>{});
  assert.equal(calls,2,'partial HTTP body must be retried, not accepted');
  assert.equal(bodyError.body.toString(),'valid full body');
});

test('forward transformation preserves all other bytes, origins and file types', () => {
  const raw = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from('https://hallpartner.se/a https://hallpartner.se?x https://hallpartner.se#x https://hallpartner.se.evil/x https://www.hallpartner.se/ http://hallpartner.se/\r\n')]);
  for (const path of ['x.css','x.js','x.json','x.svg','x.webp','x.txt']) assert.deepEqual(expectedHttpBytes(path, raw), raw);
  for (const path of ['x.html','x.xml']) {
    const expected = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(`${PREVIEW}/a ${PREVIEW}?x ${PREVIEW}#x https://hallpartner.se.evil/x https://www.hallpartner.se/ http://hallpartner.se/\r\n`)]);
    assert.deepEqual(expectedHttpBytes(path, raw), expected);
  }
});

test('post-upload verification reads every FTPS original and rejects tampering before trusting HTTP', async () => {
  const raw = Buffer.from('<h1>Original</h1><a href="https://hallpartner.se/">Home</a>');
  const css = Buffer.from('/* https://hallpartner.se/ */');
  const manifest = { commit:'a'.repeat(40), files:[{path:'index.html',sha256:sha256(raw)},{path:'a.css',sha256:sha256(css)}], externalAssets:[] };
  const transfer = (commands, _creds, cwd) => {
    assert.deepEqual(commands,['get index.html -o original-0','get a.css -o original-1']);
    writeFileSync(cwd+'/original-0', raw); writeFileSync(cwd+'/original-1', css);
  };
  const get = async url => ({url,status:200,body:new URL(url).pathname === '/' ? expectedHttpBytes('index.html',raw) : css});
  assert.equal((await verifyPublished(manifest, {}, get, transfer, false)).length, 2);
  await assert.rejects(() => verifyPublished(manifest, {}, get, (commands,creds,cwd) => {
    transfer(commands,creds,cwd);writeFileSync(cwd+'/original-0',expectedHttpBytes('index.html',raw));
  }, false), /FTPS original/);
  await assert.rejects(() => verifyPublished(manifest, {}, async url => ({url,status:200,body:Buffer.from('wrong file')}),transfer,false), /HTTPS differs/);
  await assert.rejects(() => verifyPublished(manifest, {}, async url => ({url,status:404,body:raw}),transfer,false));
});
test('read-only inventory records protected paths without permitting command injection or traversal', () => {
  assert.deepEqual(remoteInventory('./\n./cgi-bin/\n./cgi-bin/.htaccess\n./index.html\n'), {
    remoteFiles: ['cgi-bin/.htaccess', 'index.html'], remoteDirectories: ['cgi-bin'],
  });
  for (const path of ['../outside', './a/../outside', '/absolute', '-o', 'a;put x', 'a b', 'a"b', 'a\\b', './a//b', './x\n./x']) {
    assert.throws(() => remoteInventory(path));
  }
});
test('public allowlist excludes internal pages and server code', () => {
  assert.equal(PAGES.length,16);
  assert.ok(PAGES.includes('offert/tack/index.html'));
  assert.ok(PAGES.includes('integritet/index.html'));
  assert.ok(PAGES.includes('integritetspolicy/index.html'));
  assert.ok(!PAGES.some(p=>p.startsWith('api/')));
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
  inspectHtml(html+'<form id="hp-contact-form" data-enabled="false"></form>','kontakt/index.html',false,false);
  inspectHtml(html+'<div id="hp-offert-guide" data-enabled="false"></div>','offert/index.html',false);
});
test('preview form activation is limited to the exact quote host and approved mode', () => {
  const disabled = html + '<div id="hp-offert-guide" data-enabled="false"></div>';
  const enabled = html + '<div id="hp-offert-guide" data-enabled="true"></div><a href="/integritet/">Personuppgifter</a>';
  inspectHtml(disabled, 'offert/index.html',false);
  assert.throws(() => inspectHtml(enabled, 'offert/index.html',false));
  inspectHtml(enabled, 'offert/index.html', true);
  assert.throws(() => inspectHtml(enabled.replace('href="/integritet/"', 'href="/kontakt/"'), 'offert/index.html', true), /privacy notice/);
  assert.throws(() => inspectHtml(disabled, 'offert/index.html', true));
  assert.throws(() => inspectHtml(html + '<form data-enabled="true"></form>', 'offert/index.html', true));
  assert.throws(() => inspectHtml(html + '<div id="hp-contact-form" data-enabled="true"></div>', 'kontakt/index.html', true));
  assert.throws(() => inspectHtml(html + '<div id="hp-offert-guide" data-enabled="true"></div>', 'other.html', true));
});
test('approval must be complete, preview-only and backed by a published privacy route', () => {
  const policy = {...JSON.parse(readFileSync('config/preview-quote-release.json','utf8')),mode:'review',approval:{}};
  assert.deepEqual(quoteRelease(policy), { enabled:false });
  const fields = {
    customerPrivacyNoticePath:'/integritet/', privacyApprovedBy:'Hallpartner authorized sign-off',
    receiverVerifiedBy:'Andreas successful real intake', recipientVerifiedBy:'Amelio owner verified',
    ownerReleaseApprovedBy:'Andreas release approval', evidence:'docs/preview/approved-quote-release.md'
  };
  const enabled={...policy, mode:'enabled', recipient:'kontakt@amelio.se', approval:fields};
  assert.throws(() => quoteRelease(enabled, PAGES.filter(p => p !== 'integritet/index.html')), /Privacy notice must be published/);
  assert.deepEqual(quoteRelease(enabled, PAGES), { enabled:true });
  for (const field of Object.keys(fields)) {
    assert.throws(() => quoteRelease({...enabled,approval:{...fields,[field]:null}},[...PAGES,'integritet/index.html']));
  }
  for (const extra of [{sender:'other@invalid.test'},{recipient:'someone@invalid.test'},
    {targetOrigin:'https://hallpartner.se'},{scope:'other'},{mode:'something-else'}]) {
    assert.throws(() => quoteRelease({...policy,...extra}));
  }
  assert.deepEqual(quoteReleasePolicy(),quoteRelease(JSON.parse(readFileSync('config/preview-quote-release.json','utf8'))));
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

test('server configuration exemption is explicit, hash-bound and cannot publish or retain arbitrary dotfiles', () => {
  const entry = {path:'cgi-bin/.htaccess',sha256:'a'.repeat(64),reviewedBy:'Owner',evidence:'Private raw configuration review'};
  const policy = {retainedFiles:[],serverFiles:[entry]};
  assert.deepEqual(retainedFiles([entry.path],{files:[]},policy),[entry]);
  assert.throws(() => safePath(entry.path));
  for (const path of ['.htaccess','cgi-bin/.env','other/.htaccess']) assert.throws(() => retainedFiles([path],{files:[]},{...policy,serverFiles:[{...entry,path}]}));
  for (const field of ['sha256','reviewedBy','evidence']) assert.throws(() => retainedFiles([entry.path],{files:[]},{...policy,serverFiles:[{...entry,[field]:''}]}));
});
test('existing PHP bootstrap is retained byte-for-byte only with an explicit exact hash and no upload permission', () => {
  const allowed = {
    path:'api/lead.php',
    sha256:'7d252addd5378e98ddb42871934190800800e076318661b3d66c1a202a89e7ef',
    reviewedBy:'Hash-and-scope review; PHP content is not audited',
    evidence:'docs/preview/preserve-lead-bootstrap-20261104.md#farskt-hashbevis',
    preserveOnly:true
  };
  const policy={retainedFiles:[],serverFiles:[allowed]};
  assert.deepEqual(retainedFiles([allowed.path],{files:[]},policy),[allowed]);
  assert.throws(()=>safePath(allowed.path),'PHP must never enter static upload payload');
  assert.throws(()=>retainedFiles([allowed.path],{files:[]},{...policy,serverFiles:[]}),/Unreviewed/);
  for(const field of ['sha256','reviewedBy','evidence']) {
    assert.throws(()=>retainedFiles([allowed.path],{files:[]},{...policy,serverFiles:[{...allowed,[field]:''}]}));
  }
  assert.throws(()=>retainedFiles([allowed.path],{files:[]},{...policy,serverFiles:[{...allowed,preserveOnly:false}]}));
  assert.throws(()=>retainedFiles(['api/other.php'],{files:[]},{...policy,serverFiles:[{...allowed,path:'api/other.php'}]}));
  assert.throws(()=>retainedFiles(['server/lead.php'],{files:[]},{...policy,serverFiles:[{...allowed,path:'server/lead.php'}]}));
});

test('production fingerprint requires stable successful responses before upload', async () => {
  assert.equal((await productionSnapshot(async()=>({status:200,body:Buffer.from('same')}))).length,6);
  let n=0;await assert.rejects(()=>productionSnapshot(async()=>({status:200,body:Buffer.from(String(n++))})));
  await assert.rejects(()=>productionSnapshot(async()=>({status:500,body:Buffer.from('error')})));
});

test('a changed production HTML hash cannot skip the concrete marker separation checks', async () => {
  const requested = [];
  await assert.rejects(() => verifyProduction([{url:'https://hallpartner.se/',sha256:sha256('before')}], 'hp-preview-deploy-test.json', async url => {
    requested.push(url); return {status:url.includes('hp-preview-')?404:200,body:Buffer.from('dynamic after')};
  }, false), /dynamic WordPress bytes alone/);
  assert.equal(requested.filter(url=>url.includes('hp-preview-')).length,6);
  await assert.rejects(() => verifyProduction([], 'hp-preview-deploy-test.json', async()=>({status:200,body:Buffer.from(PROBE)}), false), /Production marker/);
});
test('payload verification rejects empty or forged file inventory', () => {
  assert.throws(()=>verifyPayload('not-present',{commit:'a'.repeat(40),files:[],images:[]}));
});

test('verified payload rejects changed bytes, forbidden additions and forged active-form hashes', () => {
  const root=mkdtempSync(tmpdir()+'/hp-payload-test-');
  try {
    const manifest={commit:'a'.repeat(40),files:[],images:[]};
    for(const page of PAGES){
      const quote='<div id="hp-offert-guide" data-enabled="'+quoteReleasePolicy().enabled+'"></div><a href="/integritet/">Personuppgifter</a>';
      const contact='<form id="hp-contact-form" data-enabled="'+contactReleasePolicy().enabled+'"></form>' +
        (contactReleasePolicy().enabled?'<a href="/integritet/">Integritet</a>':'');
      const body=html+'Nyckelfärdiga hallar.'+(page==='kontakt/index.html'?contact:'')+(page==='offert/index.html'?quote:'');
      mkdirSync(dirname(root+'/'+page),{recursive:true});writeFileSync(root+'/'+page,body);manifest.files.push({path:page,sha256:sha256(body)});
    }
    const robots='User-agent: *\nDisallow: /\n';writeFileSync(root+'/robots.txt',robots);manifest.files.push({path:'robots.txt',sha256:sha256(robots)});
    verifyPayload(root,manifest);
    writeFileSync(root+'/extra.php','<?php echo "no";');assert.throws(()=>verifyPayload(root,manifest));rmSync(root+'/extra.php');
    writeFileSync(root+'/index.html','tampered');assert.throws(()=>verifyPayload(root,manifest));
    const body=html+'Nyckelfärdiga hallar.<form data-enabled="true"></form>';writeFileSync(root+'/index.html',body);manifest.files.find(x=>x.path==='index.html').sha256=sha256(body);assert.throws(()=>verifyPayload(root,manifest));
  } finally {rmSync(root,{recursive:true,force:true});}
});

test('future releases can retain verified hashed assets, but not stale HTML or revoked images', () => {
  const prior=[{path:'_astro/old.js',sha256:'a'.repeat(64)},{path:'_astro/old.webp',sha256:'b'.repeat(64)},{path:'removed/index.html',sha256:'c'.repeat(64)}];const policy={retainedFiles:[]};const manifest={files:[]};
  assert.deepEqual(retainedFiles(['_astro/old.js'],manifest,policy,prior),[prior[0]]);
  assert.throws(()=>retainedFiles(['_astro/old.webp'],manifest,policy,prior));
  assert.deepEqual(retainedFiles(['_astro/old.webp'],manifest,policy,prior,[{outputSha256:'b'.repeat(64),scope:PREVIEW,approvedBy:'Owner',evidence:'Rights record'}]),[prior[1]]);
  assert.throws(()=>retainedFiles(['removed/index.html'],manifest,policy,prior));
});
