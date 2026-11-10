import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FILES, buildCandidate, verifyCandidate } from '../scripts/preview/php-candidate.mjs';

test('PHP candidate preserves raw Git bytes despite Windows checkout settings and rejects CRLF/tampering', () => {
  const directory = mkdtempSync(join(tmpdir(), 'hp-archive-test-'));
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const configBefore = execFileSync('git', ['config', '--local', '--list']);
  try {
    const manifest = buildCandidate(commit, directory);
    assert.equal(manifest.files.length, 9);
    assert.ok(manifest.files.some(file => file.path === 'server/lead/quote-email-template.php'));
    assert.ok(manifest.files.some(file => file.path === 'tests/quote-email-template.test.php'));
    assert.match(manifest.archiveSha256, /^[0-9a-f]{64}$/);
    assert.deepEqual(verifyCandidate(commit, join(directory, 'receiver-candidate.tar')), manifest);
    const badArchive = join(directory, 'crlf.tar');
    execFileSync('git', ['-c', 'core.autocrlf=true', 'archive', '--format=tar', '--output=' + badArchive, commit, '--', ...FILES]);
    assert.throws(() => verifyCandidate(commit, badArchive), /Git blob SHA-256 mismatch/);
    const tampered = readFileSync(join(directory, 'receiver-candidate.tar'));
    const offset = tampered.indexOf(Buffer.from('<?php'));
    assert.ok(offset > 0);
    tampered[offset + 2] = 'P'.charCodeAt(0);
    writeFileSync(join(directory, 'tampered.tar'), tampered);
    assert.throws(() => verifyCandidate(commit, join(directory, 'tampered.tar')), /Git blob SHA-256 mismatch/);
    assert.throws(() => buildCandidate('HEAD', directory), /explicit full commit/);
    assert.ok(execFileSync('git', ['config', '--local', '--list']).equals(configBefore), 'Git config changed');
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
