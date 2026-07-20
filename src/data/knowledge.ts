import type { KnowledgeArticle } from '../types/content';

// TODO: Exempelrubriker och ingresser. Generella branschresonemang som ska
// kvalitetssäkras av Hallpartners experter innan publicering — inga
// Hallpartner-specifika fakta, priser eller tidsangivelser är inkluderade.
// Rubriker enligt docs/CONTENT.md, kategorier enligt docs/SITEMAP.md.
export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: 'vad-paverkar-priset-pa-en-stalhall',
    title: 'Vad påverkar priset på en stålhall?',
    category: 'Kostnader',
    readingTime: '4 min',
    excerpt: 'En genomgång av de faktorer som styr kostnaden för en hallinvestering.',
  },
  {
    slug: 'behover-jag-bygglov',
    title: 'Behöver jag bygglov?',
    category: 'Bygglov',
    readingTime: '3 min',
    excerpt: 'Vad som generellt gäller kring bygglov och anmälningsplikt för hallar.',
  },
  {
    slug: 'hur-lang-tid-tar-ett-projekt',
    title: 'Hur lång tid tar ett projekt?',
    category: 'Byggtid',
    readingTime: '3 min',
    excerpt: 'Vilka faktorer som påverkar tidsplanen för ett hallprojekt.',
  },
  {
    slug: 'vilken-hall-passar-min-verksamhet',
    title: 'Vilken hall passar min verksamhet?',
    category: 'Halltyper',
    readingTime: '5 min',
    excerpt: 'En översikt av vanliga halltyper och vad de passar till.',
  },
  {
    slug: 'materialval-for-din-hall',
    title: 'Materialval för din hall',
    category: 'Material',
    readingTime: '4 min',
    excerpt: 'Vanliga materialval vid hallbyggnation och vad de innebär.',
  },
  {
    slug: 'vad-bor-ett-offertunderlag-innehalla',
    title: 'Vad bör ett offertunderlag innehålla?',
    category: 'Guider',
    readingTime: '4 min',
    excerpt: 'Så förbereder du underlag som gör offertprocessen enklare.',
  },
];
