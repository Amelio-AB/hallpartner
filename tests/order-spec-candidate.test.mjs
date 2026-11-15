import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {ARCHIVE,FILES,buildCandidate,verifyCandidate} from '../scripts/preview/order-spec-candidate.mjs';

test('private order-spec release archives exactly approved Git blobs, never active secrets or lead',()=>{
  assert.ok(FILES.includes('server/order-spec/composer.lock'));
  assert.ok(FILES.includes('server/order-spec/config.example.php'));
  assert.equal(FILES.some(p=>p.includes('vendor/')||p.includes('config.local')||
    p.includes('server/lead/')||p.startsWith('public/')||p.includes('state_dir')),false);
  const directory=mkdtempSync(join(tmpdir(),'hp-order-private-'));
  const commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  try{
    const manifest=buildCandidate(commit,directory);
    assert.equal(manifest.commit,commit);
    assert.equal(manifest.files.length,FILES.length);
    assert.match(manifest.archiveSha256,/^[a-f0-9]{64}$/);
    assert.deepEqual(verifyCandidate(commit,join(directory,ARCHIVE)),manifest);
    const bytes=Buffer.from(readFileSync(join(directory,ARCHIVE)));
    const offset=bytes.indexOf(Buffer.from('<?php'));
    assert.ok(offset>0,'Expected a private PHP source in archive');
    bytes[offset+2]^=1;
    const changed=join(directory,'tampered.tar');
    writeFileSync(changed,bytes);
    assert.throws(()=>verifyCandidate(commit,changed),/SHA-256 mismatch/);
    assert.throws(()=>buildCandidate('HEAD',directory),/Full immutable commit SHA/);
  }finally{rmSync(directory,{recursive:true,force:true});}
});
