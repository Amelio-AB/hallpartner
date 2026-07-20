import type { NavItem } from '../types/content';

// Ordning enligt docs/SITEMAP.md → "Primär navigation".
export const primaryNav: NavItem[] = [
  { label: 'Startsida', href: '/' },
  { label: 'Vision', href: '/vision/' },
  { label: 'Startsideförslag', href: '/startsideforslag/' },
  { label: 'Projekt', href: '/projekt/' },
  { label: 'Kunskapsbank', href: '/kunskapsbank/' },
  { label: 'Roadmap', href: '/roadmap/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

export const footerNav: NavItem[] = primaryNav;
