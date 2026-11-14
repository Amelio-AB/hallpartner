# Hallpartner – order-spec v1 (frozen contract)
## Scope
Public unsigned order *specification*, NOT binding supplier approval or production release. Web page `/offert/bestallningsformular/`, PDF Swedish/English. Buyer/seller selection is informational, not authentication. No prices, cost calculations, permissions or signature values in client payload. Server MUST set and print `UNSIGNED_NOT_RELEASED` and blank customer/supplier signature blocks.

Canonical files: `order-spec-v1.schema.json`, `example.v1.json`, `fields.v1.json`. JSON Schema draft 2020-12. Maintain schemaVersion 1; additive compatible changes only with agreement in issue #67. `additionalProperties:false` is deliberate, including nested structures. All input remains untrusted server-side regardless of HTML or schema. Treat strings as plain text, escape for HTML/PDF, reject CRLF/header injection. No user text in email From/Subject headers other than bounded escaped text in body.

### API request/response baseline
Dedicated `/api/order-spec.php`, Content-Type `application/json`, POST only except authorized short-lived download. All mutations use fixed allowlisted Origin/Host checks, HTTPS, rate limits, payload-size limit and no external SMTP until explicit enablement. A and B may propose exact implementation adjustments *in the coordination issue before coding against incompatible shapes*.

- `{ "action":"challenge-request", "email":"syntetisk@example.invalid" }` → 202 `{ "status":"pending", "challengeId":"opaque" }`. Never reveal whether email exists; throttle per IP/email/global. Synthetically verify no actual outbound mail in disabled preview.
- `{ "action":"challenge-confirm", "challengeId":"opaque", "code":"123456" }` → 200 `{ "status":"verified", "verificationToken":"opaque-short-lived" }`; single-use / bounded attempts / tied to submitter email; redact tokens from logs.
- `{ "action":"submit", "payload":<schema-v1>, "verificationToken":"opaque" }` → after server creates PDF and SMTP primary accepted: 200 `{ "status":"accepted", "documentRef":"HP-...", "downloadUrl":"/api/order-spec.php?action=download&token=opaque" }`. In disabled preview: 503 `{ "status":"disabled", "message":"Utskick ännu inte aktiverat" }`, NEVER return accepted.
- `GET /api/order-spec.php?action=download&token=...` → only a valid short-lived, one-time bound token, `application/pdf`, `Cache-Control: no-store`; no public filenames or predictable links.
- Uncertain SMTP outcome → `{ "status":"unconfirmed" }`, NO automatic resend; idempotency binds key+recipient+payload hash. Reject same key with different payload. No raw exception, SMTP credentials or stack trace in responses.
- Validation errors → HTTP 422 `{ "status":"invalid", "fields":{ "recipient.email":"..." } }`; never echo unescaped attacker text. Client focuses first actual known invalid field.
- If design for email verification is not feasible to safely complete by 18: keep all live submission **disabled** and report the blocker. Never replace verification with fake UI.

### Data rules
- PDF source is server-validated payload. Client `idempotencyKey` is UUID v4 or equivalent; retain on network uncertainty. Server generates document date/ref/revision metadata. External order number is customer-supplied *reference* only.
- `sections` has 12 explicit states: included/excluded/unresolved (see source PDF sections 1–10, counting 2A/2B and 3A/3B). Section 11 is review, 12 is server-owned approval. A missing item is neither excluded nor zero; unexplained included sections require a field-level error or unresolved marker.
- `project.building` contains millimetres, `heightReference` describes dimension type. No auto-engineering signoff. Per-line `dimensions` always millimetres; `quantity` unit explicitly pcs/m/m2/kg/set/roll, no client unitless quantity.
- `items[]` is a list of real products. Keep `lineId` unique, max 120; category one of roofPanel, wallPanel, roofSheet, wallSheet, flashing, pvc, fixing, opening. 3A/3B and #4 overlapping sheet flashings are ONE item record; summary must not double count.
- `finishAssignments` may record category-level finish where no item data applies (e.g. structure). Item RAL/finish wins on conflict and a conflict must be flagged, never silently overwritten. For some raw steel/galvanized materials no RAL is applicable.
- `delivery.agreedDate` denotes an expressly agreed date, never silently auto-filled from requested date.
- `finalReview.detailsReviewed` acknowledges data checked by submitter only, NEVER approves manufacturing; no client approval field accepted.
- No attachments in v1; use `drawingReference` and arrange sketch separately. No local persistence of confidential entries by default.
- `example.v1.json` is **synthetic**; `example.invalid` domains and fake order references; never send this fixture to real mailboxes.

### PDF source mapping
`fields.v1.json.sourceMapping` maps original printed fields, 1–12 and bilingual headings, to schema. Key safety exception: original's production status and signatures are *not* input fields; production release requires separate authenticated signed workflow outside v1. Document item table structure is intentionally improved vs paper rows. All document information should be retained where applicable, without duping flashings.

### Agent integration
A (UI) and B (backend) must pin the C branch commit announced in issue #67 and work independently on their assigned paths. C owns `shared/order-spec/`, footer, preview route policy and integration tests. Do not edit A/B's branch directly; integrate reviewed commit SHAs onto C branch. Test exact C HEAD after combining. CI for PR to main is validation-only; no merge/deploy. No production mail, DNS, Inleed FTP or secret changes without separate verified controls.
