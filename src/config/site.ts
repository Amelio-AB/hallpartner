export type NavigationItem = {
  label: string;
  href: string;
};

export const siteConfig = {
  name: 'Hallpartner',
  canonicalOrigin: 'https://hallpartner.se',
  primaryCta: {
    label: 'Få offert',
    href: '/offert/',
  },
  secondaryCta: {
    label: 'Kontakt',
    href: '/kontakt/',
  },
} as const;

export const primaryNavigation: NavigationItem[] = [
  { label: 'Hallar', href: '/stalhallar/' },
  { label: 'Så går det till', href: '/sa-gar-det-till/' },
  { label: 'Referenser', href: '/referenser/' },
  { label: 'Kunskap', href: '/kunskap/' },
  { label: 'Om Hallpartner', href: '/om-oss/' },
];

export const prototypeNavigation: NavigationItem[] = [
  { label: 'Hallar', href: '/prototype/hall/exempel-lagerhall/' },
  { label: 'Så går det till', href: '/prototype/foundation/#process' },
  { label: 'Referenser', href: '/prototype/reference/exempelprojekt/' },
  { label: 'Kunskap', href: '/prototype/foundation/#knowledge' },
  { label: 'Om Hallpartner', href: '/prototype/foundation/#about' },
];

export const prototypeCta = {
  label: 'Få offert',
  href: '/prototype/foundation/#cta',
} as const;
