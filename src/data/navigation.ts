import type { NavItem } from '../types/content';

// Förenklad navigation för en icke-teknisk kund. URL:erna är oförändrade
// (matchar src/pages/-strukturen), endast etiketterna är anpassade så att
// varje sida beskrivs i vardagsspråk snarare än som webbplatstermer.
export const primaryNav: NavItem[] = [
  { label: 'Analysen', href: '/' },
  { label: 'Visionen', href: '/vision/' },
  { label: 'Projekt', href: '/projekt/' },
  { label: 'Så arbetar vi', href: '/roadmap/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

export const footerNav: NavItem[] = primaryNav;
