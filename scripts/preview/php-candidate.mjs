/** Private receiver source package only. Never includes config, credentials or vendor. */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join, dirname, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

export const FILES = Object.freeze([
  'server/lead/receiver.php', 'server/lead/messages.php', 'server/lead/delivery.php',
  'server/lead/quote-email-template.php', 'server/lead/quote-fields.json',
  'server/lead/validator.php', 'server/lead/rate-cleanup.php',
  'tests/lead-receiver.test.php', 'tests/quote-email-template.test.php',
]);
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, maxBuffer: 8 * 1024 * 1024, env: { ...process.env, TAR_OPTIONS: '' }, windowsHide: true });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, command + ' failed: ' + result.stderr.toString());
  return result.stdout;
}
function revision(commit) {
  assert.match(commit, /^[0-9a-f]{40}$/, 'An explicit full commit SHA is required');
  assert.equal(run('git', ['rev-parse', '--verify', commit + '^{commit}']).toString().trim(), commit);
  return commit;
}

export function verifyCandidate(commit, archive) {
  revision(commit);
  // GNU tar in Git Bash interprets a Windows drive colon as a remote host.
  // Use a local relative filename from the archive directory for both tar variants.
  const archiveDirectory = dirname(resolve(archive));
  const archiveName = './' + basename(archive);
  const entries = run('tar', ['-tf', archiveName], archiveDirectory).toString().trim().split(/\r?\n/);
  // Git archive includes parent directory entries. No extra files, duplicates or paths permitted.
  const directories = ['server/', 'server/lead/', 'tests/'];
  assert.deepEqual(entries.filter(path => !directories.includes(path)).sort(), [...FILES].sort(), 'Unexpected archive entries');
  assert.equal(new Set(entries).size, entries.length, 'Duplicate archive entry');
  const files = FILES.map(path => {
    const expected = run('git', ['cat-file', 'blob', commit + ':' + path]);
    const actual = run('tar', ['-xOf', archiveName, path], archiveDirectory);
    // Both complete bytes and complete SHA-256 must match. Never normalize line endings.
    assert.equal(sha256(actual), sha256(expected), 'Git blob SHA-256 mismatch: ' + path);
    assert.ok(actual.equals(expected), 'Git blob bytes mismatch: ' + path);
    return { path, bytes: expected.length, sha256: sha256(expected) };
  });
  return { commit, archiveSha256: sha256(readFileSync(archive)), files };
}

export function buildCandidate(commit, directory) {
  revision(commit);
  mkdirSync(directory, { recursive: true });
  const archive = resolve(directory, 'receiver-candidate.tar');
  // Command-scoped override: never change the user's Git config or working tree.
  run('git', ['-c', 'core.autocrlf=false', '-c', 'core.eol=lf', 'archive', '--format=tar', '--output=' + archive, commit, '--', ...FILES]);
  const manifest = verifyCandidate(commit, archive);
  writeFileSync(join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  writeFileSync(join(directory, 'CANDIDATE_SHA256'), manifest.files.map(file => file.sha256 + '  ' + file.path).join('\n') + '\n');
  writeFileSync(join(directory, 'ARCHIVE_SHA256'), manifest.archiveSha256 + '  receiver-candidate.tar\n');
  return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [operation, commit, destination] = process.argv.slice(2);
  assert.ok(destination, 'Usage: php-candidate.mjs build|verify FULL_COMMIT DIRECTORY|ARCHIVE');
  const manifest = operation === 'build' ? buildCandidate(commit, destination)
    : operation === 'verify' ? verifyCandidate(commit, destination) : assert.fail('Unknown operation');
  console.log(JSON.stringify(manifest, null, 2));
}
