import { PRODUCTION, sha256 } from './policy.mjs';

// Observed on both public WordPress pages on 2026-11-04. Only the numeric
// honeypot value varies. Preserve every other byte, including the encoded
// object's field name, key order and settings. Never apply this to preview.
export function productionFingerprint(url, body) {
  const rawSha256 = sha256(body);
  const parsed = new URL(url);
  if (!PRODUCTION.includes(parsed.origin) || !['/', '/stalhallar/'].includes(parsed.pathname) || parsed.search)
    return { rawSha256, comparisonSha256: rawSha256, rule: 'raw' };
  const text = body.toString('latin1');
  const block = /<script id="wpascript-js-after">\nwpa_field_info = JSON\.parse\(atob\("([A-Za-z0-9+/]+={0,2})"\)\);\n\/\/# sourceURL=wpascript-js-after\n<\/script>/g;
  const matches = [...text.matchAll(block)];
  if (matches.length !== 1) return { rawSha256, comparisonSha256: rawSha256, rule: 'raw' };
  const encoded = matches[0][1];
  const decoded = Buffer.from(encoded, 'base64').toString('latin1');
  if (Buffer.from(decoded, 'latin1').toString('base64') !== encoded ||
    !/^\{"wpa_field_name":"rssxxv1801","wpa_field_value":[0-9]{1,6},"wpa_add_test":"no"\}$/.test(decoded))
    return { rawSha256, comparisonSha256: rawSha256, rule: 'raw' };
  const stable = Buffer.from(decoded.replace(/("wpa_field_value":)[0-9]+/, '$1<observed-dynamic-number>'), 'latin1').toString('base64');
  const start = matches[0].index + matches[0][0].indexOf(encoded);
  const comparison = Buffer.from(text.slice(0, start) + stable + text.slice(start + encoded.length), 'latin1');
  return { rawSha256, comparisonSha256: sha256(comparison), rule: 'observed-wpa-field-value-v1' };
}
