import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createChromeSession } from '../scripts/preview/chrome-session.mjs';

const fixture = mode => ({
  // Windows CI can take longer than 1.5 s to spawn a second Node process.
  // Keep the intentionally hung-process deadline short; only the exit/ready
  // fixture gets extra scheduling headroom. Assertions remain unchanged.
  executable: process.execPath, timeoutMs: mode === 'hang' ? 1500 : 8000,
  spawnProcess: (_executable, flags, options) => spawn(process.execPath, ['tests/fixtures/chrome-process.mjs', mode, ...flags], options),
});
test('missing Chrome executable fails as infrastructure, not a site assertion', async () => {
  const session = await createChromeSession({ executable: 'hp-nonexistent-chrome-executable', timeoutMs: 500 });
  try { await assert.rejects(session.ready(), /CHROME_STARTUP:.*ENOENT/); }
  finally { await session.close(); }
  assert.equal(session.evidence.phase, 'chrome-startup');
  assert.equal(existsSync(session.evidence.profile), false);
});
test('early Chrome exit preserves exit code and stderr', async () => {
  const session = await createChromeSession(fixture('exit'));
  try { await assert.rejects(session.ready(), /CHROME_STARTUP: Chrome exited/); }
  finally { await session.close(); }
  assert.equal(session.evidence.exitCode, 23);
  assert.match(session.evidence.stderr, /Synthetic Chrome startup failure/);
});
test('hung Chrome has a bounded deadline and is cleaned up without retrying', async () => {
  const session = await createChromeSession(fixture('hang'));
  try { await assert.rejects(session.ready(), /CHROME_STARTUP: Chrome startup deadline/); }
  finally { await session.close(); }
  assert.match(session.evidence.lastProbeError, /DevToolsActivePort/);
  assert.equal(existsSync(session.evidence.profile), false);
});
test('Chrome uses its own ephemeral port and verifies the CDP browser identity', async () => {
  const session = await createChromeSession(fixture('ready'));
  try {
    const target = await session.ready();
    assert.match(target.webSocketDebuggerUrl, /\/devtools\/page\/fixture$/);
    assert.equal(session.evidence.status, 'ready');
    assert.ok(session.evidence.flags.includes('--remote-debugging-port=0'));
    assert.ok(session.evidence.port > 0);
  } finally { await session.close(); }
});
