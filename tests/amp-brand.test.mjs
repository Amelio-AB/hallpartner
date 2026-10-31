import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  hallpartnerPalette as palette,
  hallpartnerActionText,
  hallpartnerHeaderColors,
  hallpartnerHeroColors,
} from '../src/config/hallpartner-brand.ts';

// WCAG sRGB relative luminance; this only tests opaque, solid color pairs.
// It does not establish photographic contrast, focus visibility or WCAG conformance.
function luminance(hex) {
  assert.match(hex, /^#[0-9a-f]{6}$/i);
  const values = [1, 3, 5].map((start) => {
    const channel = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

function contrast(a, b) {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
}

function normalText(foreground, background) {
  const ratio = contrast(foreground, background);
  assert.ok(ratio >= 4.5, `${foreground} on ${background}: ${ratio}:1 < 4.5:1`);
}

test('the existing nine Direction 02 colors are preserved', () => {
  assert.deepEqual(palette, {
    graphite: '#272D31', deepGraphite: '#202427', green: '#6C826C',
    ctaGreen: '#4E7A5B', ctaHover: '#557D5E', offWhite: '#EBEBE8',
    concrete: '#D9DDD8', darkText: '#202427', lightText: '#F4F4F0',
  });
  assert.ok(Object.isFrozen(palette));
});

test('contrast calculation has known endpoints', () => {
  assert.equal(contrast('#FFFFFF', '#000000'), 21);
  assert.equal(contrast('#272D31', '#272D31'), 1);
  assert.equal(contrast('#FFFFFF', '#000000'), contrast('#000000', '#FFFFFF'));
});

test('normal-sized CTA labels pass on both green states without rounding', () => {
  normalText(hallpartnerActionText, palette.ctaGreen);
  normalText(hallpartnerActionText, palette.ctaHover);
});

test('legacy light text needs the documented large-text treatment on green', () => {
  for (const background of [palette.ctaGreen, palette.ctaHover]) {
    const ratio = contrast(palette.lightText, background);
    assert.ok(ratio >= 3 && ratio < 4.5);
  }
});

test('AMP-002 mapping uses the six documented public color roles', () => {
  assert.deepEqual(Object.keys(hallpartnerHeaderColors).sort(), [
    'accent', 'ctaText', 'headerBg', 'headerText', 'submenuBg', 'submenuText',
  ]);
  const c = hallpartnerHeaderColors;
  normalText(c.headerText, c.headerBg);
  normalText(c.submenuText, c.submenuBg);
  normalText(c.ctaText, c.accent);
});

test('both hero themes have readable opaque text and action pairs', () => {
  for (const c of Object.values(hallpartnerHeroColors)) {
    normalText(c.text, c.background);
    normalText(c.accentText, c.accent);
  }
});

test('invalid color syntax is rejected by the test helper', () => {
  for (const color of ['red', '#fff', '#FFFFFFFF', 'url(example)', '']) {
    assert.throws(() => contrast(color, '#FFFFFF'));
  }
});
