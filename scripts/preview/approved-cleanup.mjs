import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assert, json, PREVIEW } from './policy.mjs';
import { credentials, checkTarget, ftps, latest, assertPublishContext, assertAbsent, assertOldPublishersIdle, productionSnapshot, verifyProduction } from './remote.mjs';
import { inventoryDigest } from './private-backup.mjs';
import { verifyPayload } from './payload.mjs';

// One explicit user-approved maintenance operation. The publisher never calls it.
// No wildcard, directory removal, recursive deletion, or configurable path input.
export const APPROVED_REMOVALS = [
  'projekt/index.html','roadmap/index.html','vision/index.html','workshop/index.html',
  'icons/README.md','images/README.md','images/details/README.md','images/hero/README.md',
  'images/projects/README.md','logos/README.md','videos/README.md',
  'sitemap-0.xml','sitemap-index.xml',
].sort();

export function removalPlan(plan, proof, manifest, verifiedBackupDigest) {
  assert(plan.deletionAuthorized === true && plan.target === PREVIEW && plan.bindingSha256 === proof.bindingSha256, 'Missing exact cleanup approval/target binding');
  assert(/^[a-f0-9]{64}$/.test(verifiedBackupDigest ?? '') && inventoryDigest(proof.fileFingerprints) === verifiedBackupDigest, 'Current server differs from the privately verified raw backup');
  const removals = plan.files.filter(f => ['remove-only-after-exact-approval-and-raw-backup','obsolete-sitemap-decision-required'].includes(f.action));
  assert(JSON.stringify(removals.map(f=>f.path).sort()) === JSON.stringify(APPROVED_REMOVALS), 'Cleanup must match the thirteen approved paths exactly');
  for (const file of removals) {
    const current = proof.fileFingerprints.find(f=>f.path===file.path);
    assert(current && current.sha256 === file.sha256 && current.bytes === file.bytes, 'Approved removal changed or is missing: '+file.path);
    assert(!manifest.files.some(f=>f.path===file.path), 'New site still needs an approved removal: '+file.path);
  }
  return removals;
}

export async function cleanup() {
  assert(process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' && process.env.HP_OPERATION === 'approved-cleanup', 'Cleanup requires the explicit manual operation');
  assertPublishContext(process.env,process.env.GITHUB_SHA);
  const manifest = json('reports/preview/manifest.json');
  assert(manifest.commit === process.env.GITHUB_SHA, 'Cleanup payload commit mismatch');
  verifyPayload('preview-payload',manifest);
  await assertOldPublishersIdle();
  const creds = credentials(); const policy = json('config/preview-release.json');
  assert(creds.binding === policy.targetBindingSha256, 'Cleanup target binding changed');
  const before = await checkTarget(creds);
  const removals = removalPlan(json('docs/preview/server-file-decisions-20261104.json'),before,manifest,process.env.HP_VERIFIED_BACKUP_SHA256);
  const production = await productionSnapshot();
  await latest(process.env.GITHUB_SHA);
  ftps(removals.map(f=>'rm '+f.path),creds,resolve('.'));
  const after = await checkTarget(creds);
  const preserved = before.fileFingerprints.filter(f=>!APPROVED_REMOVALS.includes(f.path));
  assert(inventoryDigest(after.fileFingerprints) === inventoryDigest(preserved), 'Unexpected server changes during exact cleanup');
  assert(JSON.stringify(before.remoteDirectories) === JSON.stringify(after.remoteDirectories), 'Cleanup changed a server directory');
  for (const file of removals) await assertAbsent(PREVIEW,file.path);
  await verifyProduction(production,'hp-preview-deploy-'+process.env.GITHUB_SHA+'.json');
  await latest(process.env.GITHUB_SHA);
  mkdirSync('reports/preview',{recursive:true});
  writeFileSync('reports/preview/cleanup-result.json',JSON.stringify({status:'verified',commit:process.env.GITHUB_SHA,runId:process.env.GITHUB_RUN_ID,
    backupInventorySha256:process.env.HP_VERIFIED_BACKUP_SHA256,removed:removals.map(({path,sha256})=>({path,sha256})),preservedFiles:preserved.length,checkedAt:new Date().toISOString()},null,2)+'\n');
  console.log('Exactly thirteen approved files removed; all other originals and directories unchanged.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await cleanup();
