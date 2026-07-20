import type { RoadmapPhase } from '../types/content';

// Fullständig roadmap för /roadmap/. Se docs/SITEMAP.md och docs/PAGE_SPEC.md.
// Den kondenserade 6-stegsversionen på startsidan finns i src/data/presentation.ts.
export const roadmapPhases: RoadmapPhase[] = [
  {
    title: 'Insikt och verksamhetsförståelse',
    description:
      'Vi lär känna Hallpartners verksamhet, kunder och mål för att bygga en plattform som passar verkligheten.',
  },
  {
    title: 'Strategi och informationsarkitektur',
    description: 'Struktur, innehållsstrategi och sidhierarki tas fram utifrån affärsmålen.',
  },
  {
    title: 'UX och visuell design',
    description: 'Upplevelsen och det visuella uttrycket formges enligt designsystemet.',
  },
  {
    title: 'Innehåll och sökstruktur',
    description:
      'Copy, bildmaterial och sökstruktur tas fram för att stärka synlighet och tydlighet.',
  },
  {
    title: 'Utveckling',
    description:
      'Plattformen byggs i Astro med fokus på prestanda, tillgänglighet och kodkvalitet.',
  },
  {
    title: 'Test och kvalitetssäkring',
    description: 'Funktion, responsivitet och tillgänglighet testas innan lansering.',
  },
  {
    title: 'Lansering',
    description: 'Webbplatsen publiceras och görs redo för verkligt bruk.',
  },
  {
    title: 'Löpande förbättring',
    description: 'Plattformen vidareutvecklas löpande utifrån data, mål och nya behov.',
  },
];
