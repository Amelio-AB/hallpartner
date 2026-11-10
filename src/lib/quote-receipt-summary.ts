import { hallpartnerQuoteConfig } from '../config/hallpartner-quote';

/**
 * Only a small selection of project facts crosses the redirect. Never store
 * name, email, phone, company, site address or free-text descriptions here.
 * The record is removed from sessionStorage immediately by the thank-you page.
 */
const fields = [
  { id: 'project.use', label: 'Användningsområde', kind: 'option' },
  { id: 'project.hall_interest', label: 'Hallkategori', kind: 'option' },
  { id: 'dimensions.confidence', label: 'Storleksuppgift', kind: 'option' },
  { id: 'dimensions.width', label: 'Bredd', kind: 'metres' },
  { id: 'dimensions.length', label: 'Längd', kind: 'metres' },
  { id: 'site.city', label: 'Byggort', kind: 'city' },
  { id: 'design.insulation', label: 'Isolering', kind: 'option' },
  { id: 'planning.timeline', label: 'Önskad byggstart', kind: 'option' },
  { id: 'planning.permit_status', label: 'Bygglov', kind: 'option' },
] as const;

export type QuoteSummaryId = typeof fields[number]['id'];
export type QuoteSummaryValue = { id: QuoteSummaryId; value: string };
export type QuoteSummaryRow = { label: string; value: string };

type ConfigOption = { value: string; label: string };
type ConfigField = { id: string; options?: ConfigOption[] };
const configFields: ConfigField[] = [];
for (const step of hallpartnerQuoteConfig.steps) {
  for (const field of step.fields) configFields.push(field as ConfigField);
}

function cleanValue(id: QuoteSummaryId, input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  if (!value || value.length > 100 || /[\u0000-\u001f\u007f]/.test(value)) return null;
  const field = fields.find(item => item.id === id);
  if (!field) return null;

  if (field.kind === 'metres') {
    if (!/^\d{1,3}([,.]\d{1,2})?$/.test(value) || Number(value.replace(',', '.')) <= 0) return null;
    return value;
  }
  if (field.kind === 'city') {
    // Avoid persisting accidentally supplied street addresses or email addresses.
    if (value.length > 60 || /[\d@<>]/.test(value)) return null;
    return value;
  }
  const configField = configFields.find(item => item.id === id);
  if (!configField || !Array.isArray(configField.options)) return null;
  return configField.options?.some(option => option.value === value) ? value : null;
}

/** Used only after a server-confirmed successful submission. */
export function buildQuoteReceiptSummary(answers: unknown): QuoteSummaryValue[] {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return [];
  const record = answers as Record<string, unknown>;
  return fields.flatMap(field => {
    const value = cleanValue(field.id, record[field.id]);
    return value === null ? [] : [{ id: field.id, value }];
  });
}

/** Revalidate client storage before display, ignoring all unknown/PII keys. */
export function parseQuoteReceiptSummary(value: unknown): QuoteSummaryValue[] {
  if (!Array.isArray(value) || value.length > fields.length) return [];
  const byId = new Map<string, unknown>();
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const { id, value: answer } = item as Record<string, unknown>;
    if (typeof id !== 'string' || !fields.some(field => field.id === id) || byId.has(id)) return [];
    byId.set(id, answer);
  }
  return fields.flatMap(field => {
    const cleaned = cleanValue(field.id, byId.get(field.id));
    return cleaned === null ? [] : [{ id: field.id, value: cleaned }];
  });
}

export function displayQuoteReceiptSummary(values: QuoteSummaryValue[]): QuoteSummaryRow[] {
  return parseQuoteReceiptSummary(values).flatMap(item => {
    const configField = configFields.find(field => field.id === item.id);
    const field = fields.find(field => field.id === item.id)!;
    let value = item.value;
    if (field.kind === 'option') {
      if (!configField || !Array.isArray(configField.options)) return [];
      value = configField.options?.find(option => option.value === value)?.label ?? '';
      if (!value) return [];
    } else if (field.kind === 'metres') {
      value += ' meter';
    }
    return [{ label: field.label, value }];
  });
}
