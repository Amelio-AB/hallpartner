import type { ProjectItem } from '../types/content';

// TODO: Samtliga projekt är neutrala exempel som visar hur systemet fungerar.
// De ska ersättas med verkligt material (bilder, orter, case) från Hallpartner
// innan sidan publiceras. Inga verkliga kundnamn eller siffror får hittas på.
export const projects: ProjectItem[] = [
  {
    slug: 'exempelprojekt-industrihall',
    title: 'Exempelprojekt — Industrihall',
    category: 'Industrihall',
    location: 'TODO: Ort',
    imageLabel: 'TODO: Bild på färdig industrihall',
    need: 'TODO: Kundens behov beskrivs här när verkligt projektunderlag finns.',
    solution: 'TODO: Hallpartners lösning beskrivs här.',
    result: 'TODO: Resultat beskrivs här.',
    relatedService: 'Kompletta hallösningar',
  },
  {
    slug: 'exempelprojekt-lagerhall',
    title: 'Exempelprojekt — Lagerhall',
    category: 'Lagerhall',
    location: 'TODO: Ort',
    imageLabel: 'TODO: Bild på färdig lagerhall',
    need: 'TODO: Kundens behov beskrivs här när verkligt projektunderlag finns.',
    solution: 'TODO: Hallpartners lösning beskrivs här.',
    result: 'TODO: Resultat beskrivs här.',
    relatedService: 'Projektering',
  },
  {
    slug: 'exempelprojekt-lantbrukshall',
    title: 'Exempelprojekt — Lantbrukshall',
    category: 'Lantbrukshall',
    location: 'TODO: Ort',
    imageLabel: 'TODO: Bild på färdig lantbrukshall',
    need: 'TODO: Kundens behov beskrivs här när verkligt projektunderlag finns.',
    solution: 'TODO: Hallpartners lösning beskrivs här.',
    result: 'TODO: Resultat beskrivs här.',
    relatedService: 'Montage',
  },
];
