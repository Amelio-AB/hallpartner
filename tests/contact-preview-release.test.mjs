import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contactRelease, contactReleasePolicy } from '../scripts/preview/contact-release.mjs';
import { quoteBuildEnvironment } from '../scripts/preview/quote-release.mjs';
import { inspectHtml } from '../scripts/preview/payload.mjs';

const contact = JSON.parse(readFileSync('config/preview-contact-release.json', 'utf8'));
const quote = JSON.parse(readFileSync('config/preview-quote-release.json', 'utf8'));

test('contact remains disabled independently of the working quote guide', () => {
  assert.equal(contactReleasePolicy().enabled, false);
  const flags = quoteBuildEnvironment(quote, contact);
  assert.equal(flags.PUBLIC_HP_LEADS_ENABLED, 'false');
  assert.equal(flags.PUBLIC_HP_QUOTE_SUBMISSIONS_ENABLED, 'true');
  assert.equal(flags.PUBLIC_HP_RECEIVER_VERIFIED, 'true');
  assert.equal(flags.PUBLIC_HP_PRIVACY_APPROVED, 'true');
  assert.deepEqual(
    ['hallpartner-contact-v1', 'hallpartner-offert-v2-review'].sort(),
    ['hallpartner-offert-v2-review', 'hallpartner-contact-v1'].sort(),
  );
});

test('contact activation needs independent preview, recipient, privacy and owner evidence', () => {
  const approval = {
    customerPrivacyNoticePath: '/integritet/',
    privacyApprovedBy: 'Separate privacy approval',
    recipientVerifiedBy: 'Actual Amelio inbox verified',
    receiverVerifiedBy: 'Private PHP allowlist and SMTP verified',
    ownerReleaseApprovedBy: 'Explicit owner approval',
    evidence: 'docs/preview/contact-activation-evidence.md',
  };
  const ready = { ...contact, mode: 'enabled', approval };
  assert.equal(contactRelease(ready).enabled, true);
  assert.equal(quoteBuildEnvironment(quote, ready).PUBLIC_HP_LEADS_ENABLED, 'true');
  assert.throws(() => contactRelease({ ...ready, approval: {} }), /Missing|privacy/i);
  assert.throws(() => contactRelease({ ...ready, recipient: 'info@hallpartner.se' }));
  assert.throws(() => contactRelease({ ...ready, targetOrigin: 'https://hallpartner.se' }));
  assert.throws(() => contactRelease(ready, ['kontakt/index.html']), /privacy/i);
});

test('preview payload only allows active contact form with own approval and privacy link', () => {
  const html = `<!doctype html><html><head><meta name="robots" content="noindex,nofollow"></head>
  <body><form id="hp-contact-form" data-enabled="true"><fieldset><input name="contact.name"></fieldset></form>
  <a href="/integritet/">Integritet</a></body></html>`;
  assert.doesNotThrow(() => inspectHtml(html, 'kontakt/index.html', false, true));
  assert.throws(() => inspectHtml(html, 'kontakt/index.html', false, false));
  assert.throws(() => inspectHtml(html.replace('<a href="/integritet/">Integritet</a>', ''), 'kontakt/index.html', false, true), /privacy/);
  assert.throws(() => inspectHtml(html.replace('id="hp-contact-form"', 'id="other-form"'), 'kontakt/index.html', false, true));
});

test('contact and quote use one PHP endpoint with different explicit configuration IDs', () => {
  const contactForm = readFileSync('src/components/ContactForm.astro', 'utf8');
  const quoteAdapter = readFileSync('src/lib/quote-confirmation.ts', 'utf8');
  const receiver = readFileSync('server/lead/receiver.php', 'utf8');
  const validator = readFileSync('server/lead/validator.php', 'utf8');
  assert.match(contactForm, /fetch\('\/api\/lead\.php'/);
  assert.match(quoteAdapter, /createJsonAdapter\('\/api\/lead\.php'/);
  assert.match(contactForm, /configurationId: 'hallpartner-contact-v1'/);
  assert.match(receiver, /hp_configuration_allowed\(\$validation\['kind'\], \$config\)/);
  assert.match(validator, /function hp_configuration_allowed/);
  assert.match(contactForm, /href="\/integritet\/"/);
  assert.match(contactForm, /allowRetry = false/);
});

test('live upload payload is sealed before offline-only active contact browser builds', () => {
  const workflow = readFileSync('.github/workflows/preview-validation.yml','utf8');
  const seal = workflow.indexOf('- name: Save verified payload');
  const activeQuote = workflow.indexOf('- name: Chrome regression for future active quote with local mock only');
  const activeContact = workflow.indexOf('- name: Chrome regression for future active contact with local mock only');
  assert.ok(seal >= 0 && activeQuote > seal && activeContact > activeQuote,
    'Active mock build must never be packaged as the public preview payload');
  assert.ok(workflow.includes('node scripts/preview/active-contact-browser.mjs'),
    'Missing offline browser submission test');
  assert.match(workflow, /PUBLIC_HP_LEADS_ENABLED: 'true'/);
  assert.match(workflow, /node scripts\/preview\/active-quote-browser\.mjs/);
});
