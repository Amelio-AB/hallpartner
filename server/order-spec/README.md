# Hallpartner order-spec private PHP backend – isolated draft

**NOT deployed, NOT production enabled.** Owner: agent B, branch \`feat/order-form-backend-20261114\`. Integration owner agent C, GitHub Issue #67. Do not modify existing \`server/lead/\` or \`public/api/lead.php\`.

## Exact schema and input contract
This module ships a byte-identical copy of the frozen v1 schema from C's \`shared/order-spec/order-spec-v1.schema.json\` (Git blob \`8b4a900badd36790804646c0c90ebec2a175a006\`) at \`schema.v1.json\`. Integrator must verify this byte identity against the actual integration revision before use. Example payload is copied byte-identically into \`tests/example.v1.json\` for standalone backend CLI tests. Both copies must be updated together only after a coordinated schema decision. The interpreter rejects unrecognized fields and unsupported schema keywords; it does **not** accept a client-set price, permission, signature or production release.

PDF uses the exact validated payload, single-row per real article, fixed UNSIGNED / NOT APPROVED status, separate blank sign-off blocks, bilingual headings and DOMPDF A4 page breaks. No external CSS/fonts/images requested and no user-provided HTML is interpreted as markup.

## Installation prerequisites / NOT YET VERIFIED
- PHP web and CLI >=8.3 with \`dom\`, \`mbstring\`, \`json\`, \`fileinfo\`, \`openssl\` and TLS available. Existing s188354 CLI check did not establish \`ext-dom\`; verify separately. PHP memory/temp limits must handle up to 8 MiB PDF.
- Composer install using **generated and reviewed lockfile** (currently NOT generated, because this execution environment has no PHP/Composer CLI). \`composer.json\` pins \`dompdf/dompdf=3.1.6\` and \`phpmailer/phpmailer=7.1.1\`. Do not deploy with unreviewed unlocked \`composer install\`. In a controlled isolated runtime: \`composer update --no-scripts --no-plugins --no-interaction\` once, inspect lock/license/security advisories, verify \`composer install --no-dev --no-scripts --no-plugins\` from lock and commit only reviewed \`composer.lock\` to B's branch.
- Private order-specific directory outside public_html under s188354 with \`receiver.php\`, validation/pdf/mailer/state files, reviewed \`schema.v1.json\`, Composer \`vendor/\`, and private \`config.local.php\`; separate private \`state_dir\` with owner-only 0700 rights. Do not copy source/config/vendor into public web root.
- Only the small public adapter at \`public/api/order-spec.php\` belongs in Astro dist.
- Configure \`HP_ORDER_SPEC_PRIVATE_DIR\` to the private installed module directory, using a verified server-only PHP config approach. No fallback to s164937/Amelio preview.
- Config defaults \`enabled=false\` and \`privacy_approved=false\` and **cannot** send without verified actual Hallpartner sender mailbox/SMTP and owner approval. Need correct HTTPS, origin, Host and SMTP credentials in a private config; never commit/log them. Do not activate real external SMTP within today's task.

## API
The C contract in \`shared/order-spec/README.md\` is canonical:
- POST action \`challenge-request\` with \`email\`; 202 pending with challengeId only after the SMTP server accepted the code message. Code valid 10 minutes, attempts <=5. Rate caps IP/email/global.
- POST action \`challenge-confirm\` with challengeId/code; yields session-bound verificationToken valid 30 minutes, bound to submitter.email, not seller authorization.
- POST action \`submit\` with schema v1 \`payload\`, verificationToken. Every payload has UUIDv4 idempotencyKey. Server reserves key+sender with payload hash before PDF and SMTP; reuse with changed payload returns 409; uncertain SMTP outcomes never auto-resend.
- GET \`?action=download&token=...\` only after SMTP accept, 15-minute one-use token bound to Secure HttpOnly SameSite session. PDF file is not directly exposed. Session cookie path \`/api/order-spec.php\` applies to both endpoint calls.

Status \`accepted\` only means \`send()\` returned true, **not** inbox delivery. \`unconfirmed\` means uncertain SMTP acceptance. A wrong/missing configuration returns HTTP503 \`disabled\`; never fake a successful send. Validation returns 422 with a field path. Any requested use of price/cost/signature/approval fields is rejected.

## Data handling and operational limitations
No automatic retries. Files and reservation/limit state are created within private state_dir and are not cleaned automatically: **before production**, implement a safe retention sweep with verified backup policy, keep accepted document replay behavior explicit, and establish privacy/retention approval. No arbitrary attachments/file uploads. Only one validated arbitrary recipient email per order. For an open public arbitrary-recipient form, aggregate limits and email ownership verification reduce but cannot eliminate abuse; run a real security review before enabling. Never run a real test email using customer details in this draft.

## Testing / actual evidence
Run \`php -l\` against every PHP file, \`php tests/order-spec-backend.test.php\` with PHP >=8.3 and mbstring. This CLI test validates schema, rejects price/status tampering/negative numbers, verifies escaping and self-declared versus sign-off, private state locks, rate limits, idempotency and mock SMTP envelope. **These tests are authored but have NOT RUN in the agent B tool session** (no local PHP runtime available); do not label PASS. The optional real Dompdf test requires private Composer vendor and needs a real render + visual PDF inspection before release. Browser/front-end and actual SMTP are NOT RUN. The existing GitHub PR CI may not yet execute the new PHP suite; C must integrate a non-deploying test step separately if permitted and verify exact SHA.

Remaining owner checks: schema and field mapping parity against the original PDF, actual browser interaction, PDF long-table pagination, timeout race semantics, e-mail deliverability/opt-in, standalone PHP config, and privacy retention. No server or DNS changes have been made by this branch.
