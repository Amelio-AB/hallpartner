import type { CollectionEntry } from 'astro:content';

/** Layoutcopy from the selected Figma frames; no business claims are verified. */
export const homepagePrototype = {
  status: 'placeholder' satisfies CollectionEntry<'halls'>['data']['status'],
  disclaimer: 'Designprototyp · demo-copy, inte verifierade verksamhetsuppgifter.',
  hero: {
    title: 'Stålhallar för verksamheter som växer.',
    desktopIntro:
      'En tydligare väg från behov till rätt hall — med projekt, ansvar och nästa steg synligt från början.',
    mobileIntro: 'En tydligare väg från behov till rätt hall.',
    dimension: '18 × 36 m',
    fields: ['Stålstomme', 'Portar', 'Plats', 'Status'],
  },
  briefFields: ['Användning', 'Storlek', 'Plats', 'Tidsram', 'Ansvar'],
  needs: [
    { title: 'Lager', detail: 'Flöde · portar · isolering' },
    { title: 'Maskin', detail: 'Fri höjd · åtkomst · slitstyrka' },
    { title: 'Produktion', detail: 'Installationer · logistik · arbetsmiljö' },
    { title: 'Ridhus', detail: 'Spann · klimat · underlag' },
  ],
  project: {
    title: 'Lagerhall',
    facts: ['Ort', 'Storlek', 'Leveransomfattning', 'År'],
  },
  responsibilities: [
    { title: 'Hallpartner', text: 'Standardleverans — verifieras' },
    { title: 'Tillval', text: 'Möjliga val — verifieras' },
    { title: 'Annan part', text: 'Ansvar utanför leveransen — verifieras' },
  ],
  portraits: ['Peter', 'Jimmy'],
} as const;
