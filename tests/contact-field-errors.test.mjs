import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { clearContactFieldErrors, showContactFieldErrors } from '../src/lib/contact-field-errors.ts';

// Minimal synthetic DOM. Never enables the real form or makes HTTP/SMTP requests.
class FakeField {
  constructor(id, name, container) {
    this.id = id;
    this.name = name;
    this.container = container;
    this.attributes = new Map();
    this.value = 'Keep entered value';
    this.focused = false;
  }
  closest(selector) {
    return selector === '.hp-contact-form__field' ? this.container : null;
  }
  getAttribute(key) { return this.attributes.get(key) ?? null; }
  setAttribute(key, value) { this.attributes.set(key, value); }
  removeAttribute(key) { this.attributes.delete(key); }
  focus() { this.focused = true; }
}
class FakeInput extends FakeField {}
class FakeTextArea extends FakeField {}
class FakeContainer {
  constructor() { this.children = []; }
  querySelector(selector) {
    return selector === '[data-hp-contact-error="true"]'
      ? this.children.find((child) => child.dataset.hpContactError === 'true') ?? null
      : null;
  }
  append(child) { child.parent = this; this.children.push(child); }
}
class FakeParagraph {
  constructor() { this.dataset = {}; this.textContent = ''; }
  remove() { this.parent.children = this.parent.children.filter((node) => node !== this); }
}
globalThis.HTMLInputElement = FakeInput;
globalThis.HTMLTextAreaElement = FakeTextArea;
globalThis.document = {
  createElement(tag) {
    assert.equal(tag, 'p');
    return new FakeParagraph();
  },
};

function fakeForm() {
  const names = ['contact.name', 'contact.email', 'contact.phone', 'contact.company', 'contact.message'];
  const containers = {};
  const fields = {};
  for (const name of names) {
    const container = new FakeContainer();
    containers[name] = container;
    const id = 'hp-form-' + name.split('.')[1];
    fields[name] = name === 'contact.message'
      ? new FakeTextArea(id, name, container)
      : new FakeInput(id, name, container);
  }
  return {
    fields, containers,
    elements: { namedItem: (name) => fields[name] ?? null },
    contains: (container) => Object.values(containers).includes(container),
  };
}

test('422 errors follow form order and preserve non-HTML text literally', () => {
  const form = fakeForm();
  assert.equal(showContactFieldErrors(form, {
    'contact.message': 'Beskriv mer.',
    'contact.email': '<img src=x onerror=alert(1)>',
    'contact.name': 73,
    '_global': 'Do not attach to a field.',
    other: 'Unknown key.',
  }), 2);
  assert.equal(form.fields['contact.email'].focused, true);
  assert.equal(form.fields['contact.message'].focused, false);
  assert.equal(form.fields['contact.email'].getAttribute('aria-invalid'), 'true');
  assert.equal(form.fields['contact.email'].getAttribute('aria-describedby'), 'hp-form-email-server-error');
  assert.equal(form.containers['contact.email'].children[0].textContent, '<img src=x onerror=alert(1)>');
  assert.equal(form.containers['contact.name'].children.length, 0);
  assert.equal(form.fields['contact.email'].value, 'Keep entered value');
});

test('repeated 422 responses remove stale errors while retaining hint/ARIA associations', () => {
  const form = fakeForm();
  form.fields['contact.message'].setAttribute('aria-describedby', 'hp-form-message-hint');
  assert.equal(showContactFieldErrors(form, { 'contact.message': 'Felaktig text.' }), 1);
  assert.equal(form.fields['contact.message'].getAttribute('aria-describedby'),
    'hp-form-message-hint hp-form-message-server-error');
  assert.equal(showContactFieldErrors(form, { 'contact.company': 'Fel på företagsnamn.' }), 1);
  assert.equal(form.containers['contact.message'].children.length, 0);
  assert.equal(form.fields['contact.message'].getAttribute('aria-describedby'), 'hp-form-message-hint');
  assert.equal(form.fields['contact.message'].getAttribute('aria-invalid'), null);
  assert.equal(form.fields['contact.message'].value, 'Keep entered value');
  clearContactFieldErrors(form);
  assert.equal(form.containers['contact.company'].children.length, 0);
  assert.equal(form.fields['contact.company'].getAttribute('aria-describedby'), null);
});

test('malformed, global-only and unknown error payloads never create field messages', () => {
  for (const payload of [undefined, null, 9, '', ['wrong'], { _global: 'Wrong form' }, { something: 'No field' },
    { 'contact.name': { html: 'not text' } }, { 'contact.email': '   ' }]) {
    const form = fakeForm();
    assert.equal(showContactFieldErrors(form, payload), 0);
    assert.equal(form.containers['contact.name'].children.length, 0);
  }
});

test('oversized untrusted text uses a bounded fallback', () => {
  const form = fakeForm();
  assert.equal(showContactFieldErrors(form, { 'contact.name': 'x'.repeat(400) }), 1);
  assert.equal(form.containers['contact.name'].children[0].textContent, 'Kontrollera det här fältet.');
});

test('contact UI retains disabled gate, safe unknown outcome and existing help text', () => {
  const ui = readFileSync(new URL('../src/components/ContactForm.astro', import.meta.url), 'utf8');
  assert.match(ui, /PUBLIC_HP_LEADS_ENABLED === 'true'/);
  assert.match(ui, /type="submit" disabled/);
  assert.match(ui, /form\.dataset\.enabled === 'true'/);
  assert.match(ui, /clearContactFieldErrors\(form\)/);
  assert.match(ui, /showContactFieldErrors\(form, body\?\.fields\)/);
  assert.match(ui, /aria-describedby="hp-form-message-hint"/);
  assert.match(ui, /id="hp-form-message-hint"/);
  assert.match(ui, /response\.status === 200 && body\?\.status === 'success'/);
  assert.match(ui, /response\.status === 503 && body\?\.status === 'failed'/);
  assert.match(ui, /allowRetry = false/);
  assert.doesNotMatch(ui, /innerHTML/);
});
