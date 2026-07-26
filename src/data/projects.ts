import type { ProjectItem } from '../types/content';
import lagerhall from '../assets/images/lagerhall.jpg';
import maskinhall from '../assets/images/maskinhall.jpeg';
import talthall from '../assets/images/talthall.jpg';

const projectLink = '#dokumentera-projekt';

export const projects: ProjectItem[] = [
  {
    slug: 'industribyggnad',
    title: 'Industribyggnad för växande verksamhet',
    category: 'Industribyggnad',
    image: maskinhall,
    imageAlt: 'Mörkgrå maskinhall med port och en rad fönster',
    description:
      'Det här exemplet visar hur Hallpartner kan beskriva kundens behov, den valda lösningen och resultatet istället för att enbart visa en bild på den färdiga byggnaden.',
    href: projectLink,
    linkLabel: 'Se hur projektet kan presenteras',
  },
  {
    slug: 'lagerhall',
    title: 'Lagerhall för effektiv logistik',
    category: 'Lagerhall',
    image: lagerhall,
    imageAlt: 'Mörkgrå lagerhall med röda kantbeslag och fönster',
    description:
      'Varje referensprojekt bör visa varför byggnaden uppfördes, vilka behov kunden hade och vilken lösning Hallpartner levererade.',
    href: projectLink,
    linkLabel: 'Se hur projektet kan presenteras',
  },
  {
    slug: 'verksamhetsanlaggning',
    title: 'Verksamhetsanläggning med framtida expansionsmöjligheter',
    category: 'Logistik- och verksamhetshall',
    image: talthall,
    imageAlt: 'Flygbild över två sammanbyggda verksamhetshallar i ett industriområde',
    description:
      'Översiktsbilder visar projektets omfattning och hjälper framtida kunder att förstå byggnadens storlek och användningsområde.',
    href: projectLink,
    linkLabel: 'Se hur projektet kan presenteras',
  },
];
