import test from 'node:test';
import assert from 'node:assert/strict';
import { productionFingerprint } from '../scripts/preview/production-fingerprint.mjs';
import { productionSnapshot, verifyProduction } from '../scripts/preview/remote.mjs';

const url = 'https://hallpartner.se/';
const object = value => `{"wpa_field_name":"rssxxv1801","wpa_field_value":${value},"wpa_add_test":"no"}`;
const html = (value, data = object(value)) => Buffer.from('<p>Original content</p><script id="wpascript-js-after">\nwpa_field_info = JSON.parse(atob("' + Buffer.from(data).toString('base64') + '"));\n//# sourceURL=wpascript-js-after\n</script>');
test('only the observed production honeypot number may vary; raw differences remain visible', () => {
  const a = productionFingerprint(url, html(999517)); const b = productionFingerprint(url, html(918439));
  assert.notEqual(a.rawSha256, b.rawSha256); assert.equal(a.comparisonSha256, b.comparisonSha256);
  assert.equal(a.rule, 'observed-wpa-field-value-v1');
  const mutations = [Buffer.from(html(918439).toString().replace('Original content', 'Changed content')),
    html(918439, object(918439).replace('rssxxv1801', 'different')),
    html(918439, object(918439).replace('"no"', '"yes"')),
    html(918439, object(918439).replace('918439', '"918439"')),
    html(918439, object(918439).replace('}', ',"extra":1}')),
    Buffer.concat([html(918439), html(918439)]), Buffer.from('Unavailable')];
  for (const changed of mutations) assert.notEqual(a.comparisonSha256, productionFingerprint(url, changed).comparisonSha256);
  for (const other of ['https://hallpartner-se.preview2.inleed.com/', url+'robots.txt', url+'?x=1', 'https://example.com/'])
    assert.equal(productionFingerprint(other, html(1)).rule, 'raw');
});
test('production verification accepts only observed numeric variance and still checks all six marker absences', async () => {
  let number = 100000;
  const baseline = await productionSnapshot(async target => ({status:200,body:target.endsWith('robots.txt')?Buffer.from('robots'):html(number++)}));
  const markers = [];
  await verifyProduction(baseline, 'hp-preview-deploy-test.json', async target => {
    if (target.includes('hp-preview-')) { markers.push(target); return {status:404,body:Buffer.from('absent')}; }
    return {status:200,body:target.endsWith('robots.txt')?Buffer.from('robots'):html(number++)};
  }, false);
  assert.equal(markers.length,6);
  await assert.rejects(() => verifyProduction(baseline, 'hp-preview-deploy-test.json', async () => ({status:200,body:html(number++)}), false));
});
