/**
 * Hallpartner-owned content for the approved AMP-003 Footer (Compact).
 * The platform package, not this site, provides HTML escaping and responsive behavior.
 * Former WordPress contact details are provisional until customer verification.
 */
// This is the current verified private platform package version (AMP-003 API unchanged), not the Footer product version.
export const AMP003_APPROVED_VERSION = '1.5.0';

export const hallpartnerFooterConfig = {
  variant: 'compact',
  brand: {
    name: 'Hallpartner',
    homeHref: '/',
    logoSrc: '/images/logo_white.png',
    tagline: 'Hallar för verksamheter som behöver mer utrymme.',
  },
  // AMP-003 desktop grid has three columns: two navigation groups + Contact.
  groups: [
    {
      heading: 'Hallar',
      links: [
        { label: 'Alla hallar', href: '/stalhallar/' },
        { label: 'Lagerhallar', href: '/stalhallar/lagerhall/' },
        { label: 'Maskinhallar', href: '/stalhallar/maskinhall/' },
        { label: 'Ridhus', href: '/stalhallar/ridhus/' },
        { label: 'Plåthallar', href: '/stalhallar/plathall/' },
        { label: 'Isolerade hallar', href: '/stalhallar/isolerad-hall/' },
        { label: 'Tälthallar', href: '/stalhallar/talthall/' },
      ],
    },
    {
      heading: 'Hallpartner',
      links: [
        { label: 'Inför ditt projekt', href: '/sa-gar-det-till/' },
        { label: 'Beställningsformulär', href: '/offert/bestallningsformular/' },
        { label: 'Om Hallpartner', href: '/om-oss/' },
        { label: 'Kontakt', href: '/kontakt/' },
      ],
    },
  ],
  contact: {
    heading: 'Kontakt',
    email: 'info@hallpartner.se',
    phone: '054-820 04 90',
    primary: { label: 'Kontakta Hallpartner', href: '/kontakt/' },
  },
  labels: {
    quickContact: 'Kontakta Hallpartner',
    homeLabel: 'Hallpartner – startsida',
    legalNavigation: 'Juridisk information',
  },
  theme: {
    colors: {
      background: '#071A16',
      text: '#F4F4F0',
      accent: '#72BF7B',
      accentText: '#071A16',
    },
  },
  legalLinks: [{ label: 'Integritetspolicy', href: '/integritetspolicy/' }],
  // Company details and processing facts must be verified before go-live.
};
