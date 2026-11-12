import test from 'node:test';
import assert from 'node:assert/strict';
import { formatLeadReference } from '../src/lib/lead-reference.ts';

test('a verified server requestId gets a stable short case label', () => {
  assert.equal(formatLeadReference('abcdef0123456789abcdef01'), 'HP-ABCDEF0123');
  assert.equal(formatLeadReference('1234567890abcdef12345678'), 'HP-1234567890');
  assert.equal(formatLeadReference('0000000000abcdef12345678'), 'HP-0000000000');
});

test('an invalid, truncated or injected requestId cannot look like a receipt', () => {
  for (const value of ['', '1234567890', '1234567890abcdef1234567z',
    '1234567890ABCDEF12345678', '1234567890abcdef12345678<script>']) {
    assert.equal(formatLeadReference(value), null);
  }
});
