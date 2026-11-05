import { appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PREVIEW, PAGES, assert, json } from './policy.mjs';

const EXPECTED_SCOPE = 'amelio-inleed-development-preview-only';
const REFERENCE_PATH = '/integritet/';

/**
 * Public site artifacts may opt into V2 sending only after an explicit,
 * reviewed preview-only release. A successful SMTP smoke test alone is not
 * approval for capturing real customers' personal data.
 */
export function quoteRelease(policy, publishedPages = PAGES) {
  assert(policy?.schemaVersion === 1, 'Invalid quote release schema');
  assert(policy.scope === EXPECTED_SCOPE && policy.targetOrigin === PREVIEW,
    'Quote release target must be the existing Amelio Inleed preview');
  assert(['review', 'enabled'].includes(policy.mode), 'Invalid quote release mode');
  assert(policy.sender === 'kontakt@amelio.se' && policy.testRecipient === 'andreas@amelio.se',
    'Quote release must preserve the verified Amelio SMTP sender and isolated test inbox');
  const enabled = policy.mode === 'enabled';
  // The intended preview receiver is explicitly confirmed by the project owner.
  // This policy is public metadata, not proof that the private PHP config matches.
  assert(policy.recipient === 'kontakt@amelio.se',
    'Preview quote recipient must be kontakt@amelio.se');
  if (enabled) {
    assert(policy.approval?.customerPrivacyNoticePath === REFERENCE_PATH,
      'Missing customer-approved privacy notice for V2');
    assert(publishedPages.includes('integritet/index.html'),
      'Privacy notice must be published as an explicitly allowlisted preview page');
    for (const property of [
      'privacyApprovedBy', 'receiverVerifiedBy', 'recipientVerifiedBy',
      'ownerReleaseApprovedBy', 'evidence'
    ]) {
      assert(typeof policy.approval[property] === 'string' &&
        policy.approval[property].trim().length >= 4,
      'Missing independent approval evidence for ' + property);
    }
  }
  return { enabled };
}
export function quoteReleasePolicy() {
  return quoteRelease(json('config/preview-quote-release.json'));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [operation] = process.argv.slice(2);
  assert(operation === 'github-env', 'Use github-env');
  const envFile = process.env.GITHUB_ENV;
  assert(typeof envFile === 'string' && envFile.length > 0, 'GITHUB_ENV is required');
  const { enabled } = quoteReleasePolicy();
  // Never echo secrets or inspect the server's private config here.
  const flag = enabled ? 'true' : 'false';
  appendFileSync(envFile, [
    'PUBLIC_HP_QUOTE_SUBMISSIONS_ENABLED=' + flag,
    'PUBLIC_HP_RECEIVER_VERIFIED=' + flag,
    'PUBLIC_HP_PRIVACY_APPROVED=' + flag,
    ''
  ].join('\n'));
  console.log('Preview-only quote release mode: ' + (enabled ? 'enabled' : 'review-disabled'));
}
