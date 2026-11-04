# AMP-001 1.5.0 – Hallpartner adoption checkpoint (2026-11-04)

## Verified platform source

Private Amelio Web Platform `1.5.0`, merged PR [#33](https://github.com/Amelio-AB/amelio-web-platform/pull/33), post-merge SHA:

`4ee0a081c3d799cd30e3075247fdb98473aa49f6`

[Post-merge green CI](https://github.com/Amelio-AB/amelio-web-platform/actions/runs/41882883394).

Hallpartner uses that exact Git source SHA in `package.json`, `package-lock.json`, `scripts/preview/policy.mjs` and the CI gates. The previous lockfile's integrity hash belongs to the old Git archive; it cannot be reused for new bytes. Verify the resulting lockfile using private `npm ci` in CI before accepting the PR.

## What is implemented in Hallpartner

- The four-step `hallpartner-offert-v1` remains in place. Original field IDs and answers are unchanged; the PHP V1 allowlist remains compatible.
- Adds field-specific explanatory dialogs to project type, measurement certainty and side height.
- Adds collapsed optional presentation groups for side height, postal code and company. Collapsing does not erase answers. Conditional irrelevant answers still are omitted.
- The ordinary `/offert/` guide is still a **review-only, submission-disabled** V1 configuration, matching the previous behavior.
- An explicit opt-in **local V2 file UI review** adds a fifth step with a file field (10 files, 15 MiB/file and 50 MiB total, JPG/PNG/WebP/PDF/DOCX). Run an Astro build with `PUBLIC_HP_QUOTE_FILES_REVIEW=true` and `PUBLIC_HP_LEADS_ENABLED` unset/false to inspect it on the **existing** `/offert/` route. It does not create a new public route.
- The review adapter deliberately makes **no network requests**, refuses upload, and cannot return success. Files are held in the browser only. This is not proof of server support.

## What is NOT implemented or approved

- There is **no** attachment-capable server receiver, persistent storage, real upload endpoint or mail attachment handling.
- The current private Inleed `server/lead` PHP receives only `contractVersion: 1` JSON up to 16 KiB. Do not send AMP-001's V2 `attachments` to it, point the V2 `submit` adapter there or accept opaque IDs as trusted client input.
- The earlier verified synthetic SMTP test establishes authenticated SMTP and receipt of one test message only; it does not prove public contact/offert submissions or approved privacy/recipient.
- Both form submissions stay disabled; WordPress on the separate live host, DNS, SMTP secrets, FTP PHP bootstrap and static preview deployment are untouched.

## Secure V2 backend – next separate work package

1. Determine actual Inleed PHP settings and multipart upload caps (including `post_max_size`, `upload_max_filesize`), private disk quota, MIME tooling and storage/retention policy **before** choosing the transport. Avoid public files or Base64 JSON. If hosting limits cannot support 50 MiB total securely, reduce customer policy or choose a separately approved private object-storage service.
2. Design a **server-owned, temporary enquiry session** bound to individual opaque upload receipts; verify anti-CSRF/origin, abuse rate and quota, content-derived MIME and magic bytes, PDF/Office security requirements, per-file and total sizes, and private directory access. Detect malicious uploads and reject archives with unsafe payloads. Sanitise filenames.
3. Upload over a binary endpoint (or direct-to-private-storage ticket) and return receipt IDs only after durable receipt. Enforce expiration and orphan cleanup; best-effort browser cleanup is not sufficient. Never trust browser-provided MIME, attachment ID or size.
4. Design V2 submission to validate all answers against the chosen quote schema and **atomically claim** only the relevant and completed receipts belonging to the same session and field. A failed upload never reports enquiry success. Unknown outcomes have no blind automatic retries; use idempotency and a private processing queue if reliable delivery/attachment association is required.
5. Specify delivery mode with customer approval (secure attachment link rather than large SMTP attachments is preferable). Define retention, access rights, abuse handling and operational monitoring, before public activation.
6. Independently test wrong-file-type/malformed DOCX, oversized files, ten parallel files, partial upload failures, timeout, duplicate/replay receipts, cross-session access, aborted requests, orphan expiry and backend unavailability. Run real PHP/HTTPS and mailbox tests with synthetic data before permission to enable.
7. Implement separate contact/quote release flags rather than enabling both via `PUBLIC_HP_LEADS_ENABLED`; approve privacy notice and recipient. Do not activate either form as a side effect of this package update.

## Review and merge gates

- Check private `npm ci` with locked exact SHA, typecheck, lint, Astro build, PHP regression, browser/mobile/keyboard tests and `scripts/preview/payload.mjs` static-only safety.
- Inspect actual `/offert/` on local preview at 360px/390px and desktop; test informational dialog (open, Escape, focus return), collapsed-group retained values, irrelevant dimension omission and no-submit safety.
- If no customer deployment is authorized, keep this as a Draft PR. Never merge automatically from a green CI alone.
- An `AMP-001 1.5.0` platform source **does not** mean its upload backend exists at Hallpartner. Keep two separate checklists.

## CI follow-up: AMP-003 Footer exact-version guard

The first candidate CI confirmed private `npm ci`, installed source identity, TypeScript and ESLint, but the static build stopped in `scripts/prepare-amp-footer.mjs` because the inherited Footer package guard required 1.4.0. This integration updates that guard and its regression test to the verified private 1.5.0 source; the actual AMP-003 renderer and Footer content remain unchanged. The new head must pass full CI again before any merge.
