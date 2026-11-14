import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('../src/pages/offert/bestallningsformular.astro',import.meta.url),'utf8');
const form=readFileSync(new URL('../src/components/order-spec/OrderSpecificationForm.astro',import.meta.url),'utf8');
const client=readFileSync(new URL('../src/scripts/order-spec/main.ts',import.meta.url),'utf8');
test('order spec has a fail-closed form with the reviewed API actions',() => {
  assert.match(form,/id="hp-order-spec-form" data-enabled=\{String\(ready\)\} novalidate/);
  assert.match(page,/PUBLIC_HP_ORDER_SPEC_ENABLED/);
  assert.match(page,/PUBLIC_HP_ORDER_BACKEND_VERIFIED/);
  assert.match(page,/PUBLIC_HP_ORDER_PRIVACY_APPROVED/);
  for(const action of ['challenge-request','challenge-confirm','submit']) assert.ok(client.includes(action),action);
  assert.ok(!client.includes('innerHTML'));
  assert.ok(!client.includes('localStorage'));
  assert.ok(!client.includes('sessionStorage'));
});
test('order spec keeps distinct recipient, sender and unsigned document',() => {
  for(const field of ['submitter.email','recipient.email','orderingParty.companyName','supplier.companyName']) assert.ok(form.includes(field),field);
  assert.match(form,/Ej signerat/);
  assert.match(client,/UNCONFIRMED|unconfirmed/);
  assert.match(client,/idempotencyKey/);
  assert.ok(client.includes("const API = '/api/order-spec.php'"));
});
test('order spec exposes all original sections, controlled technical rows and explicit statuses',() => {
  for(const part of ['steelStructure','roofSandwichPanels','wallSandwichPanels','roofSheets','wallSheets','flashings','pvcMembrane','finishes','fixings','openings','documentation','transport']) {
    assert.ok(form.includes(part),part);
  }
  for(const group of ['roofPanel','wallPanel','roofSheet','wallSheet','flashing','pvc','fixing','opening']) assert.ok(form.includes(group),group);
  for(const state of ['included','excluded','unresolved']) assert.ok(form.includes(state),state);
  assert.match(client,/data-item-row/);
  assert.match(client,/numericValue/);
  assert.match(client,/showIssues/);
});
test('all item details are open and separate drawing references supported',() => {
  assert.ok(form.includes('data-add-document'));
  assert.ok(form.includes('data-document-lines'));
  assert.ok(client.includes('data-document-row'));
  assert.ok(client.includes('documentReferences'));
  assert.ok(client.includes('createDocumentRow'));
  assert.ok(client.includes("const details = document.createElement('div');"));
  assert.ok(!client.includes("document.createElement('details')"));
});

test('one-page navigation exposes every source section and keeps supplier scope explicit', () => {
  for(const anchor of ['project','steel','roofSandwichPanels','wallSandwichPanels','roofSheets','wallSheets','flashings','pvcMembrane','finishes','fixings','openings','documentation','transport','review','send']) {
    assert.ok(form.includes('href="#hp-order-' + anchor + '"'),anchor);
  }
  assert.ok(form.includes('hp-order__workspace'));
  assert.ok(form.includes('Montage, markarbete och grundarbete ingår inte'));
});

test('PHP schema error paths normalize to input namespaces', async () => {
  const { normalizeServerFieldPath } = await import('../src/scripts/order-spec/main.ts');
  assert.equal(normalizeServerFieldPath('$.recipient.email'), 'recipient.email');
  assert.equal(normalizeServerFieldPath('$.items.0.dimensions.widthMm'), 'items.0.dimensions.widthMm');
  assert.equal(normalizeServerFieldPath('$.items[5].quantity'), 'items.5.quantity');
  assert.equal(normalizeServerFieldPath('$.documentReferences.1.number'), 'documentReferences.1.number');
  assert.equal(normalizeServerFieldPath('$.sections.steelStructure'), 'sections.steelStructure');
  assert.ok(client.includes('serverInputFor(path)'));
  for (const group of ['data-item-row','data-finish-row','data-document-row']) {
    assert.ok(client.includes(group), group);
  }
});

test('static inputs use the frozen schema max lengths', () => {
  const limits = {"submitter.name":120,"orderingParty.contactName":120,"supplier.manufacturingCountry":120,"supplier.contactName":120,"project.externalOrderNumber":100,"project.drawingReference":160,"project.building.steelGrade":100,"project.building.surfaceTreatment":160,"project.building.otherFramePart":160,"pvcSpecification.fireClass":80,"pvcSpecification.uvResistance":120,"pvcSpecification.materialQuality":160,"pvcSpecification.fixingSystem":160,"delivery.transportResponsibility":160};
  const tags = [...form.matchAll(/<FormField path="([^"]+)"([^>]*?)\/>/g)];
  for (const [path, length] of Object.entries(limits)) {
    const tag = tags.find(([,name]) => name === path);
    assert.ok(tag, path);
    assert.ok(tag[2].includes('maxLength={' + length + '}'), path);
  }
});

test('PVC section 5 precedes colours section 6 and retains aggregate fields', () => {
  // The left-hand navigation and printed source PDF use 1–12 order;
  // section 5 must not accidentally be rendered after section 6.
  const categoryOrder = [...form.matchAll(/\{ code: '(2A|2B|3A|3B|4|5|7|8)', key:/g)].map(match => match[1]);
  assert.deepEqual(categoryOrder, ['2A','2B','3A','3B','4','5','7','8']);
  const beforeFinishes = form.indexOf('groups.slice(0,6).map');
  const finishes = form.indexOf('id="hp-order-finishes"');
  const afterFinishes = form.indexOf('groups.slice(6).map');
  assert.ok(beforeFinishes !== -1 && beforeFinishes < finishes && finishes < afterFinishes);
  assert.equal((form.match(/\{group\.category === 'pvc' && <div class="hp-order__grid">/g) ?? []).length,1);
  for (const path of ['pvcSpecification.weightGm2','pvcSpecification.fireClass','pvcSpecification.uvResistance','pvcSpecification.materialQuality','pvcSpecification.fixingSystem']) {
    assert.ok(form.includes(path), path);
  }
});

test('hall footprint accepts 1000-metre schema limit, distinct from product dimensions', async () => {
  const {validPositive} = await import('../src/scripts/order-spec/main.ts');
  assert.equal(validPositive(1000000,'project.building.lengthMm'),true);
  assert.equal(validPositive(1000000,'project.building.widthMm'),true);
  assert.equal(validPositive(1000000.01,'project.building.lengthMm'),false);
  assert.equal(validPositive(100001,'dimensions.lengthMm'),false);
  assert.equal(validPositive(100001,'dimensions.widthMm'),false);
  assert.equal(validPositive(-1,'project.building.lengthMm'),false);
});
test('email fields use schema maxLength 254 and article rows allow gloss', () => {
  const field = readFileSync(new URL('../src/components/order-spec/FormField.astro',import.meta.url),'utf8');
  assert.ok(field.includes("kind === 'email' ? 254 : 180"));
  assert.ok(client.includes("{key: 'gloss', label: 'Glansgrad', maxLength: 50}"));
});


test('async email challenge is bound to one unchanged submitter address', async () => {
  const { isCurrentVerificationRequest } = await import('../src/scripts/order-spec/main.ts');
  assert.equal(isCurrentVerificationRequest('synthetic@example.test', 2, 'synthetic@example.test', 2), true);
  assert.equal(isCurrentVerificationRequest('synthetic@example.test', 2, 'other@example.test', 2), false);
  assert.equal(isCurrentVerificationRequest('synthetic@example.test', 2, 'synthetic@example.test', 4), false);
  assert.ok(client.includes('const requestedEmail = input.value.trim();'));
  assert.ok(client.includes('const requestRevision = emailRevision;'));
  assert.ok(client.includes('email:requestedEmail'));
  assert.ok(client.includes('verifiedEmail = requestedEmail;'));
  assert.ok(client.includes('invalidateChangedEmail(event.target)'));
});

test('dynamic rows focus the first editable field and removals restore add control', () => {
  for (const key of ['itemType', 'materialClass', 'number']) {
    assert.ok(client.includes('data-item-field="' + key + '"]') && client.includes('?.focus();'), key);
  }
  for (const button of ['data-add-line', 'data-add-finish', 'data-add-document']) {
    assert.ok(client.includes("querySelector<HTMLButtonElement>('[" + button + "]')?.focus()"), button);
  }
});

test('error messages reach checkbox groups and all field hints are described for assistive tech', () => {
  const field = readFileSync(new URL('../src/components/order-spec/FormField.astro',import.meta.url),'utf8');
  const styles = readFileSync(new URL('../src/styles/order-spec.css',import.meta.url),'utf8');
  assert.ok(field.includes("const hintId = hint ? id + '-hint' : undefined;"));
  assert.ok(field.includes("const description = [hintId, errorId].filter(Boolean).join(' ');"));
  assert.ok(field.includes('class="hp-order__hint" id={hintId}'));
  assert.ok(field.includes('class="hp-order__error" id={errorId}'));
  assert.ok(client.includes("closest<HTMLElement>('.hp-order__field, .hp-order__ack, .hp-order__checks')"));
  assert.ok(client.includes("if (!describedBy.includes(error.id))"));
  assert.ok(styles.includes('.hp-order__ack .hp-order__error'));
  assert.ok(styles.includes('.hp-order__checks > .hp-order__error'));
});
