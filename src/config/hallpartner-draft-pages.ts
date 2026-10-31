/**
 * Editorial ROUTE SPECIFICATIONS, NOT CUSTOMER-APPROVED WEBSITE COPY.
 *
 * All eleven full-text drafts are still missing from docs/content/README.md
 * (PR #4). These specifications only establish the reviewable route map.
 * Never render intendedPath as a live navigation target until migration.
 */
export type DraftPageGroup = 'overview' | 'usage' | 'construction' | 'property' | 'information';
export type DraftHeroChoice = 'fullbleed' | 'signature' | 'intro';

export interface DraftPageSpec {
  readonly slug: string;
  readonly label: string;
  readonly intendedPath: string;
  readonly purpose: string;
  readonly group: DraftPageGroup;
  readonly hero: DraftHeroChoice;
  readonly originalTextStatus: 'not-recovered';
  readonly sourceIsApprovedCustomerCopy: false;
  readonly sectionPrompts: readonly {
    readonly heading: string;
    readonly editorialNote: string;
  }[];
  readonly relatedSlugs: readonly string[];
}

export const draftPageSpecs: readonly DraftPageSpec[] = [
  {
    slug: 'start', label: 'Startsida', intendedPath: '/', group: 'overview', hero: 'fullbleed',
    purpose: 'Orientera besökaren, förklara nästa steg och hänvisa till rätt innehåll utan att duplicera hallöversikten.',
    originalTextStatus: 'not-recovered', sourceIsApprovedCustomerCopy: false,
    sectionPrompts: [
      { heading: 'Introduktion', editorialNote: 'Enligt nytt designbeslut har startsidan bild i helbredd, även bakom transparent header. Bild är AI-genererad konceptvisualisering; AMP-004 är ännu inte integrerad.' },
      { heading: 'Välj rätt väg', editorialNote: 'Visa relevanta användningsområden, men påstå inte att specifika hallutföranden ingår utan verifierat sortiment.' },
      { heading: 'Nästa steg', editorialNote: 'Länka till kontakt först när en verkligt fungerande kontaktväg är kontrollerad.' },
    ],
    relatedSlugs: ['hallar', 'kontakt'],
  },
  {
    slug: 'hallar', label: 'Hallar', intendedPath: '/hallar/', group: 'overview', hero: 'intro',
    purpose: 'Hjälpa besökaren skilja användningsområde från konstruktion och egenskap.',
    originalTextStatus: 'not-recovered', sourceIsApprovedCustomerCopy: false,
    sectionPrompts: [
      { heading: 'Utgå från användningen', editorialNote: 'Separera lager, maskiner och ridhus i den redaktionella strukturen.' },
      { heading: 'Utföranden och egenskaper', editorialNote: 'Förklara att tält och plåt är konstruktion medan isolering kan vara en egenskap. Bekräfta faktiskt sortiment.' },
      { heading: 'Vägen vidare', editorialNote: 'Visa länkar till relevanta undersidor utan pris-, garanti- eller leveranslöften.' },
    ],
    relatedSlugs: ['lagerhallar', 'maskinhallar', 'ridhus', 'talthallar', 'plathallar', 'isolerade-hallar'],
  },
  {
    slug: 'lagerhallar', label: 'Lagerhallar', intendedPath: '/lagerhallar/', group: 'usage', hero: 'intro',
    purpose: 'Ta upp praktiska lagerbehov och vilka uppgifter som behövs inför ett samtal.',
    originalTextStatus: 'not-recovered', sourceIsApprovedCustomerCopy: false,
    sectionPrompts: [
      { heading: 'Lagerbehovet', editorialNote: 'Återför originalutkastet; beskriv inte obekräftade mått eller tillgängliga produkter.' },
      { heading: 'Frågor inför kontakt', editorialNote: 'Förtydliga behov som användning och åtkomst utan att lova teknisk dimensionering.' },
    ],
    relatedSlugs: ['hallar', 'sa-gar-det-till', 'kontakt'],
  },
  {
    slug: 'maskinhallar', label: 'Maskinhallar', intendedPath: '/maskinhallar/', group: 'usage', hero: 'intro',
    purpose: 'Behandla maskinanvändning separat från lagerhallarnas behov.',
    originalTextStatus: 'not-recovered', sourceIsApprovedCustomerCopy: false,
    sectionPrompts: [
      { heading: 'Användning och arbetssätt', editorialNote: 'Hämta originaltext; undvik egna påståenden om funktioner eller ingående system.' },
      { heading: 'Projektets förutsättningar', editorialNote: 'Diskutera behov på en allmän nivå, utan dimensioneringsbesked.' },
    ],
    relatedSlugs: ['hallar', 'kontakt'],
  },
  {
    slug: 'ridhus', label: 'Ridhus', intendedPath: '/ridhus/', group: 'usage', hero: 'signature',
    purpose: 'Ge ridhus en egen informationsordning och ett relevant användningssammanhang.',
    originalTextStatus: 'not-recovered', sourceIsApprovedCustomerCopy: false,
    sectionPrompts: [
      { heading: 'Ridhusprojektet', editorialNote: 'Återför godkänd arbetsversion v0.1 från originalkälla. Hero är tills vidare endast planerad AMP-004-kandidat.' },
      { heading: 'Planeringsfrågor', editorialNote: 'Använd inte bilder som verkliga referensprojekt utan publiceringsrätt och projektbevis.' },
    ],
    relatedSlugs: ['sa-gar-det-till', 'kontakt'],
  },
  {
    slug: 'talthallar', label: 'Tälthallar', intendedPath: '/talthallar/', group: 'construction', hero: 'intro',
    purpose: 'Beskriva ett konstruktionsutförande, inte ett eget användningsområde.',
    originalTextStatus: 'not-recovered', sourceIsApprovedCustomerCopy: false,
    sectionPrompts: [
      { heading: 'Konstruktion och användning', editorialNote: 'Återför textutkastet när källan finns. Påstå inte bygglovsfrihet.' },
      { heading: 'Frågor att utreda', editorialNote: 'Särskilj generell orientering från faktiska projektspecifika regler.' },
    ],
    relatedSlugs: ['hallar', 'kontakt'],
  },
  {
    slug: 'plathallar', label: 'Plåthallar', intendedPath: '/plathallar/', group: 'construction', hero: 'intro',
    purpose: 'Beskriva plåt som utförande utan att utge det för ett eget användningsområde.',
    originalTextStatus: 'not-recovered', sourceIsApprovedCustomerCopy: false,
    sectionPrompts: [
      { heading: 'Plåt som utförande', editorialNote: 'Bevara v0.1 från originalkällan när den är återfunnen. Verifiera faktisk produktmodell.' },
      { heading: 'Samband med behov', editorialNote: 'Visa hur utförandet förhåller sig till möjliga användningar, utan egen teknisk rådgivning.' },
    ],
    relatedSlugs: ['hallar', 'isolerade-hallar'],
  },
  {
    slug: 'isolerade-hallar', label: 'Isolerade hallar', intendedPath: '/isolerade-hallar/', group: 'property', hero: 'intro',
    purpose: 'Förklara isolering som en möjlig egenskap hos olika halltyper.',
    originalTextStatus: 'not-recovered', sourceIsApprovedCustomerCopy: false,
    sectionPrompts: [
      { heading: 'Isoleringens roll', editorialNote: 'Status för v0.1 motsägs av äldre PR #2; behandla texten som saknad tills fulltext och version återfunnits.' },
      { heading: 'Val att utreda', editorialNote: 'Ingen energiprestanda eller konstruktion får lovas utan leverantörsdata.' },
    ],
    relatedSlugs: ['hallar', 'kontakt'],
  },
  {
    slug: 'sa-gar-det-till', label: 'Så går det till', intendedPath: '/sa-gar-det-till/', group: 'information', hero: 'intro',
    purpose: 'Samla gemensam projektgång och gränser för ansvar efter att processen styrkts.',
    originalTextStatus: 'not-recovered', sourceIsApprovedCustomerCopy: false,
    sectionPrompts: [
      { heading: 'Från fråga till projekt', editorialNote: 'Infoga endast verkliga och godkända processsteg. Ingen utlovad svarstid.' },
      { heading: 'Vem ansvarar för vad?', editorialNote: 'Kundverifierad ansvarsmatris saknas. Skriv inte egna montörer eller totalentreprenad.' },
    ],
    relatedSlugs: ['hallar', 'kontakt'],
  },
  {
    slug: 'om-oss', label: 'Om Hallpartner', intendedPath: '/om-oss/', group: 'information', hero: 'intro',
    purpose: 'Presentera verksamheten utifrån bekräftade person- och företagsuppgifter.',
    originalTextStatus: 'not-recovered', sourceIsApprovedCustomerCopy: false,
    sectionPrompts: [
      { heading: 'Människorna bakom', editorialNote: 'Vänta på godkända namn, fotografier, erfarenhetsuppgifter och publiceringsrätt.' },
      { heading: 'Ansvar och kontakt', editorialNote: 'Bolagsuppgifter och juridisk avtalspart ska verifieras före publicering.' },
    ],
    relatedSlugs: ['kontakt'],
  },
  {
    slug: 'kontakt', label: 'Kontakt', intendedPath: '/kontakt/', group: 'information', hero: 'intro',
    purpose: 'Ge en säker, verklig väg till Hallpartner. Inget formulär aktiveras före backendverifiering.',
    originalTextStatus: 'not-recovered', sourceIsApprovedCustomerCopy: false,
    sectionPrompts: [
      { heading: 'Kontaktväg', editorialNote: 'Kontakt v0.2 planerar namn, e-post, meddelande (krav) samt telefon och företag (frivilliga). Ingen mottagare eller leveransväg är verifierad ännu.' },
      { heading: 'Personuppgifter', editorialNote: 'Visa inte en inskickad-bekräftelse innan mottagning, integritetstext och spamskydd faktiskt fungerar.' },
    ],
    relatedSlugs: ['hallar'],
  },
];

/** Only prototype routes are linkable in this stage; intendedPath is planning data. */
export function draftHref(slug: string): string {
  return `/prototype/hallpartner/${slug}/`;
}
