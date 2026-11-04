import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { PREVIEW, sha256 } from '../scripts/preview/policy.mjs';
import { encryptBackup, decryptBackup, restoreBackup, inventoryDigest } from '../scripts/preview/private-backup.mjs';
import { removalPlan, APPROVED_REMOVALS } from '../scripts/preview/approved-cleanup.mjs';

const keys = generateKeyPairSync('rsa',{modulusLength:3072,publicKeyEncoding:{type:'spki',format:'pem'},privateKeyEncoding:{type:'pkcs8',format:'pem'}});
const original = Buffer.from('private original\r\n\u00e5');
const proof = {bindingSha256:'a'.repeat(64),checkedAt:'2026-11-04T00:00:00Z',fileFingerprints:[{path:'cgi-bin/.htaccess',bytes:original.length,sha256:sha256(original)}],remoteDirectories:['cgi-bin']};
const source = {commit:'b'.repeat(40),runId:'123'};

test('backup transport contains ciphertext only and preserves exact raw bytes after private restore', () => {
  const envelope = encryptBackup(proof,()=>original,keys.publicKey,source);
  assert(!JSON.stringify(envelope).includes('private original'));
  assert(!JSON.stringify(envelope).includes(original.toString('base64')));
  assert(!JSON.stringify(envelope).includes(keys.privateKey));
  assert.deepEqual(Buffer.from(decryptBackup(envelope,keys.privateKey).files[0].content,'base64'),original);
  const temp=mkdtempSync(tmpdir()+'/hp-private-backup-test-');
  try {
    writeFileSync(temp+'/envelope.json',JSON.stringify(envelope));writeFileSync(temp+'/key.pem',keys.privateKey);
    assert.throws(()=>restoreBackup(temp+'/envelope.json',temp+'/key.pem',temp+'/restored',{GITHUB_ACTIONS:'true'}));
    const manifest=restoreBackup(temp+'/envelope.json',temp+'/key.pem',temp+'/restored',{});
    assert.deepEqual(readFileSync(temp+'/restored/files/cgi-bin/.htaccess'),original);
    assert.equal(manifest.inventorySha256,inventoryDigest(proof.fileFingerprints));
    assert.throws(()=>restoreBackup(temp+'/envelope.json',temp+'/key.pem',temp+'/restored',{}));
  } finally {rmSync(temp,{recursive:true,force:true});}
});

test('backup rejects altered ciphertext, authenticated metadata, target, path and file bytes', () => {
  const envelope=encryptBackup(proof,()=>original,keys.publicKey,source);
  const bad=structuredClone(envelope);const cipher=Buffer.from(bad.ciphertext,'base64');cipher[0]^=1;bad.ciphertext=cipher.toString('base64');
  assert.throws(()=>decryptBackup(bad,keys.privateKey));
  for(const field of ['commit','bindingSha256','inventorySha256','target']) {
    const altered=structuredClone(envelope);altered.metadata[field]='wrong';assert.throws(()=>decryptBackup(altered,keys.privateKey));
  }
  assert.throws(()=>encryptBackup(proof,()=>Buffer.from('changed'),keys.publicKey,source));
  assert.throws(()=>encryptBackup({...proof,fileFingerprints:[{...proof.fileFingerprints[0],path:'../escape'}]},()=>original,keys.publicKey,source));
});

test('manual cleanup requires exact approval, a complete current backup and no references in the new payload', () => {
  const files=APPROVED_REMOVALS.map(path=>({path,sha256:'a'.repeat(64),bytes:10,action:path.endsWith('.xml')?'obsolete-sitemap-decision-required':'remove-only-after-exact-approval-and-raw-backup'}));
  const plan={deletionAuthorized:true,target:PREVIEW,bindingSha256:proof.bindingSha256,files};
  const current={bindingSha256:proof.bindingSha256,fileFingerprints:[...files,...proof.fileFingerprints]};
  const digest=inventoryDigest(current.fileFingerprints);
  assert.equal(removalPlan(plan,current,{files:[]},digest).length,13);
  assert.throws(()=>removalPlan({...plan,deletionAuthorized:false},current,{files:[]},digest));
  assert.throws(()=>removalPlan(plan,current,{files:[]},'b'.repeat(64)));
  assert.throws(()=>removalPlan(plan,current,{files:[{path:APPROVED_REMOVALS[0]}]},digest));
  assert.throws(()=>removalPlan({...plan,files:files.slice(1)},current,{files:[]},digest));
  const changed={...current,fileFingerprints:current.fileFingerprints.map((f,i)=>i===0?{...f,sha256:'c'.repeat(64)}:f)};
  assert.throws(()=>removalPlan(plan,changed,{files:[]},inventoryDigest(changed.fileFingerprints)));
});
