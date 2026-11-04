// Temporary PR-only read diagnostic. Removed before merge after collecting evidence.
import {mkdtempSync,rmSync,writeFileSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {assert,json,sha256} from './policy.mjs';
import {credentials,retainedFiles,ftps,verifyRetainedFiles} from './remote.mjs';
assert(process.env.GITHUB_EVENT_NAME==='pull_request','Read-only PR diagnostic only');
const proof=json('reports/preview/target-proof.json');
const extras=retainedFiles(proof.remoteFiles,json('reports/preview/manifest.json'),json('config/preview-release.json'),[],json('config/preview-image-rights.json').approvals);
const temp=mkdtempSync(tmpdir()+'/hp-retained-diagnostic-');
const report={mode:'legacy-one-connection-per-file',startedAt:new Date().toISOString(),verified:[],failure:null};
try {
  const creds=credentials();
  for(const [index,file] of extras.entries()) {
    try {
      ftps(['get '+file.path+' -o legacy-'+index],creds,temp);
      assert(sha256(readFileSync(temp+'/legacy-'+index))===file.sha256,'Retained hash mismatch');
      report.verified.push(file.path);
    }catch(error){report.failure={path:file.path,...(error.safeDetails??{reason:'hash-mismatch'})};break;}
  }
  report.completedAt=new Date().toISOString();
  writeFileSync('reports/preview/retained-legacy-diagnostic.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
  // Do not weaken TLS, timeouts, or retry counts. Verify the corrected batching.
  verifyRetainedFiles(extras,creds,temp);
}finally{rmSync(temp,{recursive:true,force:true});}
