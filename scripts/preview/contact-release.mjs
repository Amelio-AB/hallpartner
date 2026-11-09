import { readFileSync } from 'node:fs';
import { PREVIEW, PAGES, assert } from './policy.mjs';

const SCOPE = 'amelio-inleed-development-preview-only';

/** Independent approval for contact messages. Quote approval is NOT inherited. */
export function contactRelease(policy, publishedPages = PAGES) {
  assert(policy?.schemaVersion === 1 && policy.scope === SCOPE &&
    policy.targetOrigin === PREVIEW, 'Contact receiver must be scoped to the existing Inleed preview');
  assert(policy.configurationId === 'hallpartner-contact-v1', 'Unexpected contact form contract');
  assert(policy.sender === 'kontakt@amelio.se' && policy.recipient === 'kontakt@amelio.se',
    'Contact form must use the verified preview SMTP sender and Amelio inbox');
  assert(['review','enabled'].includes(policy.mode), 'Invalid contact release mode');
  const enabled = policy.mode === 'enabled';
  if (enabled) {
    const approval = policy.approval ?? {};
    assert(approval.customerPrivacyNoticePath === '/integritet/' &&
      publishedPages.includes('integritet/index.html'), 'Missing published preview privacy notice');
    for (const key of ['privacyApprovedBy','recipientVerifiedBy','receiverVerifiedBy','ownerReleaseApprovedBy','evidence']) {
      assert(typeof approval[key] === 'string' && approval[key].trim().length >= 4,
        'Missing independent contact approval evidence: ' + key);
    }
  }
  return { enabled };
}
export function contactReleasePolicy() {
  return contactRelease(JSON.parse(readFileSync('config/preview-contact-release.json','utf8')));
}
