import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const script = 'scripts/lead/test-v2-loopback.sh';

test('isolated V2 smoke test parses and requires an explicit send flag', () => {
  const syntax = spawnSync('bash', ['-n', script], { encoding: 'utf8' });
  assert.equal(syntax.status, 0, syntax.stderr);
  const usage = spawnSync('bash', [script], { encoding: 'utf8' });
  assert.equal(usage.status, 2, usage.stderr);
  assert.match(usage.stdout, /--send-test/);
});

test('synthetic test only uses loopback and retains private production config', () => {
  const source = readFileSync(script, 'utf8');
  for (const token of [
    '127.0.0.1:', 'HP_V2_TEST_TOKEN', 'HP_V2_TEST_ORIGINAL_CONFIG',
    'hallpartner-offert-v2-review', 'kontakt@amelio.se',
    'wrong-origin.invalid', "https://hallpartner-se.preview2.inleed.com",
    'TEST INTE BEKRÄFTAT', 'Publik mottagning fortfarande avstängd'
  ]) assert.ok(source.includes(token), token);
  assert.doesNotMatch(source, /config\.local\.php["']?\s*\)\s*>|sed -i[^\\n]*config\.local\.php/);
  assert.match(source, /-S "127\.0\.0\.1:\$port"/);
  assert.ok(source.includes("$c['rate_secret'] = getenv('HP_V2_TEST_RATE_SECRET')"),
    'isolated test must not rely on the production rate limiter secret');
  assert.ok(source.includes('HP_V2_TEST_RATE_DIR='),
    'rate directory must be isolated from production');
  assert.ok(source.includes("$c['recipient'] = 'kontakt@amelio.se'"),
    'temporary test config must redirect every SMTP message to approved test inbox');
  assert.ok(!source.includes('($c["recipient"] ?? "") !== "kontakt@amelio.se"'),
    'do not require changing the existing recipient in the real private config');
});
