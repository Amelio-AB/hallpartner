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
const prRuns = validation.jobs.validate.steps.map(s => s.run ?? '').join('\n');
assert(!/remote\.mjs publish|workflow enable|workflow run/.test(prRuns), 'PR validation must never publish/activate');
for (const cmd of ['npm run check','npm run lint','node --test tests/*.test.mjs','npm audit --audit-level=high','composer audit --locked --no-dev','npm run build','scripts/preview/payload.mjs prepare','scripts/preview/browser.mjs','remote.mjs check-target']) assert(prRuns.includes(cmd), 'Missing validation command: ' + cmd);
for (const job of [validation.jobs.validate,deploy.jobs.publish]) {
  assert(job.steps.some(s=>s.uses==='actions/setup-node@v4' && s.with['node-version']==='24'), 'Node 24 required');
  assert(job.steps.find(s=>s.uses==='actions/checkout@v6')?.with['persist-credentials']===false, 'Persisted Git credentials forbidden');
}
assert(!readFileSync('.github/workflows/deploy-production.yml','utf8').includes('run-id:'), 'Old fixed artifact forbidden');
console.log('Workflow structure/permissions/triggers/contracts: PASS');
