/** HP-056: check an explicitly activated customer production build; read-only. */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] || 'dist';
const page = p => readFileSync(join(root, p), 'utf8');
const home = page('index.html');
const contact = page('kontakt/index.html');
const quote = page('offert/index.html');
const policy = page('integritetspolicy/index.html');
const receipt = page('offert/tack/index.html');
const notFound = page('404.html');

assert.match(home, /<meta name="robots" content="index,follow"/, 'Production home must be indexable');
assert.match(contact, /<meta name="robots" content="index,follow"/);
assert.match(quote, /<meta name="robots" content="index,follow"/);
assert.match(contact, /id="hp-contact-form"[^>]*data-enabled="true"/, 'Contact form is missing or disabled');
assert.match(quote, /id="hp-offert-guide"[^>]*data-enabled="true"/, 'Quote flow is missing or disabled');
for (const html of [contact,quote]) {
  assert.match(html,/href="\/integritetspolicy\/"/,'Live forms must link to real Hallpartner privacy policy');
  assert.doesNotMatch(html,/Amelios utvecklingspreview|kontakt@amelio\.se|Arbetsversion:/,
    'No development messaging in live form');
}
assert.match(contact,/mailto:info@hallpartner\.se/,'Contact fallback is available');
assert.match(policy,/via de digitala|aktiverat kontakt- eller offertformulär/,'Policy must explain active forms');
assert.match(policy,/Beebyte/,'Policy must identify current mail provider');
assert.doesNotMatch(policy,/formulär på den nya webbplatsen är ännu inte aktiverade/,
  'No inactive-form notice in live privacy copy');
for (const html of [receipt,notFound]) {
  assert.match(html,/name="robots" content="noindex,nofollow"/);
}
assert.ok(existsSync(join(root,'sitemap-index.xml')),'Missing sitemap');
assert.doesNotMatch(page('robots.txt'),/(^|\n)Disallow:\s*\/(?:\r?\n|$)/);
assert.ok(!existsSync(join(root,'api','lead.php')),'Never include private API in static release');
console.log('HP056 ACTIVE CUSTOMER BUILD PASS: contact, quote, privacy, SEO, no PHP payload');
