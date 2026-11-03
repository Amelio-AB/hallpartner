// Field-only presentation for the disabled-by-default Hallpartner contact form.
// The server response is untrusted: use known fields, bounded strings and textContent.
const CONTACT_FIELDS = ['contact.name', 'contact.email', 'contact.phone', 'contact.company', 'contact.message'];

function controlFor(form: HTMLFormElement, name: string) {
  const control = form.elements.namedItem(name);
  return control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement ? control : null;
}

function fieldContainer(form: HTMLFormElement, control: HTMLInputElement | HTMLTextAreaElement) {
  const container = control.closest('.hp-contact-form__field');
  return container && form.contains(container) ? container : null;
}

export function clearContactFieldErrors(form: HTMLFormElement): void {
  for (const name of CONTACT_FIELDS) {
    const control = controlFor(form, name);
    if (!control) continue;
    const errorId = control.id + '-server-error';
    const container = fieldContainer(form, control);
    container?.querySelector('[data-hp-contact-error="true"]')?.remove();

    const describedBy = (control.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter((token) => token && token !== errorId);
    if (describedBy.length) control.setAttribute('aria-describedby', describedBy.join(' '));
    else control.removeAttribute('aria-describedby');
    control.removeAttribute('aria-invalid');
  }
}

export function showContactFieldErrors(form: HTMLFormElement, fields: unknown): number {
  clearContactFieldErrors(form);
  if (fields === null || typeof fields !== 'object' || Array.isArray(fields)) return 0;
  const errors = fields as Record<string, unknown>;
  let first: HTMLInputElement | HTMLTextAreaElement | null = null;
  let count = 0;

  // Use form order rather than untrusted server-object key order.
  for (const name of CONTACT_FIELDS) {
    const error = errors[name];
    if (typeof error !== 'string' || !error.trim()) continue;
    const control = controlFor(form, name);
    if (!control) continue;
    const container = fieldContainer(form, control);
    if (!container) continue;

    const errorId = control.id + '-server-error';
    const paragraph = document.createElement('p');
    paragraph.id = errorId;
    paragraph.className = 'hp-contact-form__status';
    paragraph.dataset.state = 'error';
    paragraph.dataset.hpContactError = 'true';
    paragraph.textContent = error.trim().length > 300
      ? 'Kontrollera det här fältet.'
      : error.trim();
    container.append(paragraph);
    control.setAttribute('aria-invalid', 'true');

    const describedBy = (control.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(Boolean);
    control.setAttribute('aria-describedby', [...new Set([...describedBy, errorId])].join(' '));
    if (!first) first = control;
    count++;
  }

  first?.focus();
  return count;
}
