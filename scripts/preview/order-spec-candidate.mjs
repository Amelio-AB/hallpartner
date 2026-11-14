/** C-owned immutable private order-spec source candidate. No deploy, state, secrets or vendor. */
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve, dirname, basename, join} from 'node:path';
import {pathToFileURL} from 'node:url';

export const FILES=Object.freeze([
  'server/order-spec/cleanup.php',
  'server/order-spec/config.example.php',
  'server/order-spec/labels.php',
  'server/order-spec/mailer.php',
  'server/order-spec/pdf.php',
  'server/order-spec/receiver.php',
  'server/order-spec/state.php',
  'server/order-spec/validation.php',
  'server/order-spec/schema.v1.json',
  'server/order-spec/composer.json',
  'server/order-spec/composer.lock'
]);
export const ARCHIVE='order-spec-private-candidate.tar';
const digest=b=>createHash('sha256').update(b).digest('hex');
function run(cmd,args,cwd){
  const result=spawnSync(cmd,args,{cwd,maxBuffer:12*1024*1024,windowsHide:true,
    env:{...process.env,TAR_OPTIONS:''}});
  if(result.error)throw result.error;
  assert.equal(result.status,0,cmd+' failed: '+String(result.stderr));
  return result.stdout;
}
function exactRevision(sha){
  assert.match(sha,/^[0-9a-f]{40}$/,'Full immutable commit SHA required');
  assert.equal(String(run('git',['rev-parse','--verify',sha+'^{commit}'])).trim(),sha);
}
export function verifyCandidate(commit,archive){
  exactRevision(commit);
  const dir=dirname(resolve(archive)),local='./'+basename(archive);
  const paths=String(run('tar',['-tf',local],dir)).trim().split(/\r?\n/);
  const permittedDirs=new Set(['server/','server/order-spec/']);
  assert.deepEqual(paths.filter(p=>!permittedDirs.has(p)).sort(),[...FILES].sort(),
    'Unexpected private candidate files');
  assert.equal(new Set(paths).size,paths.length,'Duplicate archive entry');
  const files=FILES.map(path=>{
    const expected=run('git',['cat-file','blob',commit+':'+path]);
    const actual=run('tar',['-xOf',local,path],dir);
    assert.equal(digest(actual),digest(expected),'Git blob SHA-256 mismatch: '+path);
    assert.ok(actual.equals(expected),'Raw Git blob bytes mismatch: '+path);
    return {path,bytes:expected.length,sha256:digest(expected)};
  });
  return {commit,archiveSha256:digest(readFileSync(archive)),files,
    publicAdapter:'public/api/order-spec.php (separate, NOT in private archive)',
    deploymentStatus:'NOT INSTALLED; transport disabled'};
}
export function buildCandidate(commit,directory){
  exactRevision(commit);
  mkdirSync(directory,{recursive:true});
  const archive=resolve(directory,ARCHIVE);
  run('git',['-c','core.autocrlf=false','-c','core.eol=lf','archive','--format=tar',
    '--output='+archive,commit,'--',...FILES]);
  const manifest=verifyCandidate(commit,archive);
  writeFileSync(join(directory,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  writeFileSync(join(directory,'ARCHIVE_SHA256'),manifest.archiveSha256+'  '+ARCHIVE+'\n');
  writeFileSync(join(directory,'SOURCE_SHA256'),manifest.files.map(f=>f.sha256+'  '+f.path).join('\n')+'\n');
  return manifest;
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const [operation,commit,target]=process.argv.slice(2);
  assert.ok(target,'Usage: order-spec-candidate.mjs build|verify FULL_SHA DIRECTORY|ARCHIVE');
  const result=operation==='build'?buildCandidate(commit,target):
    operation==='verify'?verifyCandidate(commit,target):assert.fail('Unknown operation');
  console.log(JSON.stringify(result,null,2));
}
