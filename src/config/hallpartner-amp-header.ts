import type { HeaderMenuConfig } from '@amelio/web-platform/header-menu';

/** Hallpartner-owned navigation and theme for the shared visitor Header. */
export const ampHeaderItems: HeaderMenuConfig['items'] = [
  {
    label: 'Hallar', href: '/stalhallar/',
    menuIntro: { heading: 'Utforska våra halltyper', description: 'Välj efter användningsområde eller byggnadens utförande.' },
    groups: [
      { heading: 'Användningsområden', links: [
        { label: 'Lagerhallar', href: '/stalhallar/lagerhall/', description: 'För lager, logistik och förvaring' },
        { label: 'Maskinhallar', href: '/stalhallar/maskinhall/', description: 'För maskiner, fordon och verkstad' },
        { label: 'Ridhus', href: '/stalhallar/ridhus/', description: 'För ridning, träning och hästverksamhet' },
      ]},
      { heading: 'Utföranden', links: [
        { label: 'Plåthallar', href: '/stalhallar/plathall/', description: 'Hallbyggnader med plåt som tak och väggar' },
        { label: 'Isolerade hallar', href: '/stalhallar/isolerad-hall/', description: 'För verksamheter med klimatkrav' },
        { label: 'Tälthallar', href: '/stalhallar/talthall/', description: 'Flexibla hallar med bågkonstruktion' },
      ]},
    ],
    featured: { label: 'Se alla hallar', href: '/stalhallar/' },
  },
  { label: 'Inför ditt projekt', href: '/sa-gar-det-till/' },
  { label: 'Om Hallpartner', href: '/om-oss/' },
  { label: 'Kontakt', href: '/kontakt/' },
];
export const ampHeaderBrand: HeaderMenuConfig['brand'] = {
  name: 'Hallpartner', href: '/', logoSrc: '/images/logo_text_white.png', logoHeroSrc: '/images/logo_text_white.png',
};
export const ampHeaderCTA: NonNullable<HeaderMenuConfig['cta']> = { label: 'Be om offert', href: '/offert/' };
export const ampHeaderTheme: NonNullable<HeaderMenuConfig['theme']> = {
  colors: {
    headerBg: '#10251C', headerText: '#F7F7F2', submenuBg: '#F5F5F0',
    submenuText: '#10251C', accent: '#F7F7F2', ctaText: '#10251C',
  },
  font: 'Manrope, system-ui, sans-serif',
};
