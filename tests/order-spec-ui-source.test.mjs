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
