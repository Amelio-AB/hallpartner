/**
 * Direction 02 working palette; not a new customer-approved visual identity.
 * Source: the 2026-10-31 handoff and HOMEPAGE_DIRECTION_02.md at fd7a912.
 * These values are not applied to the existing website by this module.
 */
export const hallpartnerPalette = Object.freeze({
  graphite: '#272D31',
  deepGraphite: '#202427',
  green: '#6C826C',
  ctaGreen: '#4E7A5B',
  ctaHover: '#557D5E',
  offWhite: '#EBEBE8',
  concrete: '#D9DDD8',
  darkText: '#202427',
  lightText: '#F4F4F0',
} as const);

/**
 * White is intentional for normal-sized CTA text in both normal/hover states.
 * Direction 02 used 19px/700 light text; that large-text exception must not
 * silently become a dependency of every future platform button.
 */
export const hallpartnerActionText = '#FFFFFF' as const;

/** Public AMP-002 theme.colors roles; no platform runtime is imported here. */
export const hallpartnerHeaderColors = Object.freeze({
  headerBg: hallpartnerPalette.graphite,
  headerText: hallpartnerPalette.lightText,
  submenuBg: hallpartnerPalette.offWhite,
  submenuText: hallpartnerPalette.darkText,
  accent: hallpartnerPalette.ctaGreen,
  ctaText: hallpartnerActionText,
} as const);

/**
 * Semantic values for a future external customer stylesheet. Do not pass these
 * as renderer theme props under strict CSP: those props emit inline styles.
 */
export const hallpartnerHeroColors = Object.freeze({
  dark: Object.freeze({
    background: hallpartnerPalette.graphite,
    text: hallpartnerPalette.lightText,
    accent: hallpartnerPalette.ctaGreen,
    accentText: hallpartnerActionText,
  }),
  light: Object.freeze({
    background: hallpartnerPalette.offWhite,
    text: hallpartnerPalette.darkText,
    accent: hallpartnerPalette.ctaGreen,
    accentText: hallpartnerActionText,
  }),
});
