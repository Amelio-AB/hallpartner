import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { assert } from './policy.mjs';
const deploy = yaml.load(readFileSync('.github/workflows/deploy-production.yml','utf8'));
const validation = yaml.load(readFileSync('.github/workflows/preview-validation.yml','utf8'));
assert(JSON.stringify(Object.keys(deploy.on).sort()) === JSON.stringify(['push','workflow_dispatch']), 'Unexpected deploy trigger');
assert(JSON.stringify(deploy.on.push.branches) === JSON.stringify(['main']), 'Deploy branch must be main only');
assert(deploy.concurrency.group === 'hallpartner-inleed-preview-20261103' && deploy.concurrency['cancel-in-progress'] === false, 'Unsafe deployment concurrency');
assert(deploy.permissions.contents === 'read' && deploy.permissions.actions === 'read' && Object.keys(deploy.permissions).length === 2, 'Excess deployment permissions');
assert(deploy.jobs.validate.uses === './.github/workflows/preview-validation.yml' && deploy.jobs.publish.needs === 'validate', 'Publication must depend on reusable validation');
assert(validation.on.pull_request.branches.includes('main') && validation.on.pull_request.branches.includes('integration/hallpartner-main-20261103') && validation.on.workflow_call, 'Missing stacked PR/reusable validation');
const buildIndex = validation.jobs.validate.steps.findIndex(step => step.name === 'Build exact checkout');
const quoteIndex = validation.jobs.validate.steps.findIndex(step => step.name === 'Pin quote submission flags to reviewed preview release policy');
assert(quoteIndex >= 0 && quoteIndex < buildIndex &&
  validation.jobs.validate.steps[quoteIndex].run === 'node scripts/preview/quote-release.mjs github-env',
  'Preview build must use exact reviewed quote release policy before building or publishing');
const prRuns = validation.jobs.validate.steps.map(s => s.run ?? '').join('\n');
assert(!/remote\.mjs publish|workflow enable|workflow run/.test(prRuns), 'PR validation must never publish/activate');
for (const cmd of ['npm run check','npm run lint','node --test tests/*.test.mjs','npm audit --audit-level=high','composer audit --locked --no-dev','npm run build','scripts/preview/payload.mjs prepare','scripts/preview/payload.mjs rights','scripts/preview/browser.mjs','remote.mjs check-target']) assert(prRuns.includes(cmd), 'Missing validation command: ' + cmd);
for (const job of [validation.jobs.validate,deploy.jobs.publish]) {
  assert(job.steps.some(s=>s.uses==='actions/setup-node@v4' && s.with['node-version']==='24'), 'Node 24 required');
  assert(job.steps.find(s=>s.uses==='actions/checkout@v6')?.with['persist-credentials']===false, 'Persisted Git credentials forbidden');
}
assert(!readFileSync('.github/workflows/deploy-production.yml','utf8').includes('run-id:'), 'Old fixed artifact forbidden');
const maintenance = validation.jobs.maintenance;
assert(validation.jobs.validate.if === "inputs.operation != 'private-backup' && inputs.operation != 'approved-cleanup'", 'Reusable validation must still run for manual publication without maintenance inputs');
assert(validation.on.workflow_dispatch.inputs.operation.options.join(',') === 'validate,private-backup,approved-cleanup', 'Unexpected manual maintenance operation');
assert(maintenance.if.includes("github.event_name == 'workflow_dispatch'") && maintenance.if.includes("github.ref == 'refs/heads/main'"), 'Maintenance must be manual and main-only');
assert(maintenance.concurrency.group === deploy.concurrency.group && maintenance.concurrency['cancel-in-progress'] === false, 'Maintenance must share the existing transfer lock');
assert(maintenance.permissions.contents === 'read' && maintenance.permissions.actions === 'read', 'Maintenance cannot change GitHub code or secrets');
const transport = maintenance.steps.find(s=>s.with?.name === 'private-preview-backup-${{ github.run_id }}');
assert(transport?.with.path === 'reports/private-preview-backup.envelope.json' && transport.with['retention-days'] === 1, 'Only encrypted temporary backup transport may be uploaded');
assert(!deploy.jobs.publish.steps.some(s=>/approved-cleanup|private-backup/.test(s.run ?? '')), 'Automatic publication must never run maintenance');
const liveBrowser = deploy.jobs.publish.steps.find(s=>s.name === 'Verify actual preview interactions in Chrome after publication');
assert(liveBrowser?.run.includes('https://hallpartner-se.preview2.inleed.com/stalhallar/') && liveBrowser.run.includes('verify-hallpartner-amp006.mjs') && liveBrowser.run.includes('verify-hallpartner-gallery.mjs'), 'Missing real preview browser verification');
assert(liveBrowser.run.includes('https://hallpartner-se.preview2.inleed.com/offert/'), 'Missing read-only live quote verification');
console.log('Workflow structure/permissions/triggers/contracts: PASS');
