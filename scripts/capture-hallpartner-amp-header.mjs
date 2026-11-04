/** Header regression uses real visitor routes, never separate public test pages. */
import { spawnSync } from 'node:child_process';
const origin = process.env.HP_PREVIEW_ORIGIN || 'http://127.0.0.1:4321';
for (const [name, route] of [['home','/'],['solid','/sa-gar-det-till/']]) {
  const result = spawnSync(process.execPath, ['scripts/capture-hallpartner-home.mjs'], {
    stdio:'inherit', timeout:240000,
    env:{...process.env, HP_PREVIEW_URL:new URL(route,origin).href, HP_SCREENSHOT_PREFIX:'amp002-'+name},
  });
  if (result.error || result.status !== 0) throw new Error('AMP-002 visitor regression failed: '+name, {cause:result.error});
}
