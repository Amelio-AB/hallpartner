import type {
  CTA,
  FAQItem,
  HallTypeItem,
  IndustryItem,
  JourneyStep,
  OpportunityCard,
  ProcessStep,
  ResultItem,
  RoadmapPhase,
  ServiceItem,
  StrengthItem,
} from '../types/content';

// Copy hämtad ordagrant från docs/CONTENT.md där sådan finns.
// Textblock utan motsvarighet i CONTENT.md är strukturell platshållartext
// (märkt TODO i kommentar) och ska granskas av Hallpartner innan publicering.

export const globalMessage = {
  line1: 'Ni bygger inte hallar.',
  line2: 'Ni bygger framtidens verksamheter.',
};

export const homeHero = {
  eyebrow: 'Hallpartner – nästa kapitel',
  title: 'Ni bygger inte hallar.',
  subtitle: 'Ni bygger framtidens verksamheter.',
  body: 'En vision för hur Hallpartners digitala närvaro kan spegla kvaliteten, erfarenheten och ambitionen i varje projekt.',
  primaryCTA: { label: 'Utforska visionen', href: '/vision/', variant: 'primary' } as CTA,
  secondaryCTA: {
    label: 'Se startsidesförslaget',
    href: '/startsideforslag/',
    variant: 'secondary',
  } as CTA,
};

export const meaningSection = {
  title: 'Mer än en byggnad.',
  text: 'Varje hall skapar förutsättningar för produktion, logistik, lagerhållning och tillväxt. Hallpartner levererar lösningar som hjälper företag att utvecklas.',
};

export const builtStrengths: StrengthItem[] = [
  {
    title: 'Kompletta hallösningar',
    // TODO: Kort beskrivning ska bekräftas av Hallpartner.
    description: 'En helhetslösning från första idé till färdig hall.',
  },
  {
    title: 'Projektering',
    description: 'Noggrann planering som säkerställer rätt lösning för verksamheten.',
  },
  {
    title: 'Montage',
    description: 'Erfaret montage på plats, med fokus på kvalitet och säkerhet.',
  },
  {
    title: 'Personlig projektledning',
    description: 'En tydlig kontaktväg genom hela projektet, från start till leverans.',
  },
];

export const journeyIntro = {
  title: 'Besluten börjar långt innan första kontakten.',
  text: 'Kunder söker information, jämför alternativ och bygger förtroende digitalt innan de tar kontakt.',
};

export const journeySteps: JourneyStep[] = [
  { label: 'Söker', description: 'Behovet identifieras och research inleds online.' },
  { label: 'Jämför', description: 'Leverantörer, referenser och kompetens jämförs.' },
  { label: 'Bygger förtroende', description: 'Innehåll och case avgör vem som känns trovärdig.' },
  { label: 'Kontakt', description: 'Första kontakten tas med den leverantör som känns säkrast.' },
  { label: 'Affär', description: 'Dialogen övergår till offert och projekt.' },
];

export const opportunitySection = {
  title: 'Här finns nästa möjlighet.',
  text: 'Visionen är att låta den digitala upplevelsen spegla kvaliteten i Hallpartners verkliga arbete.',
  cta: { label: 'Se visionen', href: '/vision/', variant: 'ghost' } as CTA,
};

export const opportunityCards: OpportunityCard[] = [
  {
    title: 'Erfarenhet',
    description: 'Årtal av samlad kunskap inom hallbyggnation kan bli lättare att förstå digitalt.',
  },
  {
    title: 'Projekt',
    description: 'Genomförda projekt kan visas upp och göra kompetensen påtaglig för nya kunder.',
  },
  {
    title: 'Förtroende',
    description: 'Ett tydligt digitalt uttryck stärker förtroendet redan innan första mötet.',
  },
];

export const visionTeaser = {
  title: 'En digital vision för Hallpartner',
  text: 'Det här är inte en färdig webbplats. Det är en riktning för hur Hallpartner kan stärka sitt varumärke och sin affär digitalt.',
  cta: { label: 'Utforska visionen', href: '/vision/', variant: 'primary' } as CTA,
};

export const startPageTeaser = {
  title: 'Ett konkret förslag på Hallpartners nya startsida.',
  text: 'Ett trovärdigt koncept som visar hur förstasidan kan möta besökare med tydligt affärsvärde, tjänster och referensprojekt.',
  cta: { label: 'Se startsidesförslaget', href: '/startsideforslag/', variant: 'secondary' } as CTA,
};

export const projectsTeaser = {
  title: 'Referensprojekt som bygger förtroende.',
  text: 'Ett system för att visa upp genomförda projekt på ett sätt som skapar trovärdighet hos nya kunder.',
  cta: { label: 'Se alla projekt', href: '/projekt/', variant: 'ghost' } as CTA,
};

export const knowledgeTeaser = {
  title: 'Kunskap som stärker varje beslut.',
  text: 'Guider och svar på vanliga frågor som positionerar Hallpartner som experten kunden vill anlita.',
  cta: { label: 'Till kunskapsbanken', href: '/kunskapsbank/', variant: 'ghost' } as CTA,
};

export const roadmapTeaser = {
  title: 'Vägen till en ny digital plattform.',
  text: 'En tydlig, stegvis process från insikt till lansering — och vidare utveckling därefter.',
  cta: { label: 'Se hela roadmapen', href: '/roadmap/', variant: 'ghost' } as CTA,
};

// Kondenserad version för startsidans roadmap-sektion (PAGE_SPEC.md, sektion 10).
// Den fullständiga 8-fasiga roadmapen finns på /roadmap/, se src/data/roadmap.ts.
export const roadmapHomePhases: RoadmapPhase[] = [
  { title: 'Insikt', description: 'Vi lär känna verksamheten, kunderna och målen.' },
  { title: 'Strategi', description: 'Struktur och innehållsstrategi läggs fast.' },
  { title: 'Design', description: 'Upplevelse och visuellt uttryck formges.' },
  { title: 'Utveckling', description: 'Plattformen byggs i Astro.' },
  { title: 'Lansering', description: 'Webbplatsen publiceras.' },
  { title: 'Förbättring', description: 'Löpande vidareutveckling utifrån data och behov.' },
];

// PAGE_SPEC.md har högre prioritet än CONTENT.md — denna ordlydelse följer PAGE_SPEC.md.
export const resultsItems: ResultItem[] = [
  {
    icon: 'trend-up',
    title: 'Starkare varumärke',
    text: 'Ett digitalt uttryck som matchar kvaliteten i det fysiska arbetet.',
  },
  {
    icon: 'inbox',
    title: 'Fler relevanta förfrågningar',
    text: 'En tydligare position gör det lättare för rätt kunder att höra av sig.',
  },
  {
    icon: 'eye',
    title: 'Högre synlighet',
    text: 'Bättre struktur och innehåll stärker synligheten i sök.',
  },
  {
    icon: 'layers',
    title: 'Skalbar plattform',
    text: 'En grund som kan växa i takt med verksamheten.',
  },
];

export const closingCTA = {
  title: 'Låt oss bygga nästa kapitel tillsammans.',
  button: { label: 'Boka nästa möte', href: '/kontakt/', variant: 'primary' } as CTA,
};

// ---------------------------------------------------------------------------
// /vision/
// ---------------------------------------------------------------------------

export const visionPage = {
  heading: 'En digital vision för Hallpartner',
  intro:
    'Det här är inte en färdig webbplats. Det är en riktning för hur Hallpartner kan stärka sitt varumärke och sin affär digitalt.',
  // TODO: Nuläge ska beskrivas tillsammans med Hallpartner för att vara korrekt.
  currentState: {
    title: 'Nuläge och möjlighet',
    text: 'Idag skapas första intrycket av Hallpartner ofta digitalt, långt innan en offertförfrågan skickas. Det ger en tydlig möjlighet: en digital närvaro som redan från start speglar erfarenheten och kvaliteten i det verkliga arbetet.',
  },
  futurePosition: {
    title: 'Framtida digital position',
    text: 'Målet är en plattform som positionerar Hallpartner som det självklara valet för verksamheter som ska investera i en ny hall — trovärdig, lättnavigerad och tydlig i sitt affärsvärde.',
  },
  strengthenBusiness: {
    title: 'Hur design, innehåll, SEO och AI-sök stärker affären',
    text: 'Genomtänkt design skapar förtroende vid första ögonkastet. Strukturerat innehåll besvarar kundens frågor innan de ställs. En stark sökstruktur gör Hallpartner synligt både i traditionell sökning och i AI-drivna svar. Tillsammans bygger detta en plattform som arbetar för affären dygnet runt.',
  },
  links: {
    startPage: {
      label: 'Se startsidesförslaget',
      href: '/startsideforslag/',
      variant: 'secondary',
    } as CTA,
    roadmap: { label: 'Se roadmapen', href: '/roadmap/', variant: 'ghost' } as CTA,
  },
};

// ---------------------------------------------------------------------------
// /startsideforslag/
// ---------------------------------------------------------------------------

export const startPageHero = {
  title: 'Framtidens hallar börjar med rätt partner.',
  // TODO: Stödtext ska formuleras tillsammans med Hallpartner.
  subtitle:
    'Ett koncept för hur Hallpartners nya webbplats kan möta besökare med tydligt affärsvärde från första sekund.',
  cta: { label: 'Begär offert', href: '/kontakt/', variant: 'primary' } as CTA,
};

// TODO: Verklig tjänstelista ska bekräftas av Hallpartner. Utgår tills vidare
// från styrkorna i docs/CONTENT.md.
export const services: ServiceItem[] = [
  {
    title: 'Kompletta hallösningar',
    description: 'Från idé till nyckelfärdig hall, i ett sammanhållet projekt.',
  },
  { title: 'Projektering', description: 'Teknisk planering anpassad efter verksamhetens behov.' },
  {
    title: 'Montage',
    description: 'Professionellt montage genomfört med kvalitet och säkerhet i fokus.',
  },
  { title: 'Personlig projektledning', description: 'En fast kontaktperson genom hela projektet.' },
];

// TODO: Konceptexempel — verkliga halltyper ska bekräftas av Hallpartner.
export const hallTypes: HallTypeItem[] = [
  { title: 'Industrihall', description: 'Anpassad för produktion och tillverkning.' },
  { title: 'Lagerhall', description: 'Effektiv lagerhållning och logistik.' },
  { title: 'Lantbrukshall', description: 'Lösningar för lantbrukets behov.' },
  { title: 'Verkstadshall', description: 'Funktionell miljö för verkstad och service.' },
];

// TODO: Konceptexempel — verkliga branscher ska bekräftas av Hallpartner.
export const industries: IndustryItem[] = [
  { title: 'Industri & tillverkning' },
  { title: 'Logistik & lager' },
  { title: 'Lantbruk' },
  { title: 'Handel & e-handel' },
  { title: 'Offentlig sektor' },
];

// TODO: Konceptexempel — verklig arbetsprocess ska bekräftas av Hallpartner.
export const processSteps: ProcessStep[] = [
  { title: 'Behovsanalys', description: 'Vi lyssnar in verksamhetens förutsättningar och mål.' },
  { title: 'Projektering & offert', description: 'Lösningen tar form och prissätts tydligt.' },
  { title: 'Tillverkning', description: 'Hallens delar tillverkas enligt specifikation.' },
  { title: 'Montage på plats', description: 'Erfarna montageteam färdigställer hallen.' },
  {
    title: 'Överlämning & uppföljning',
    description: 'Hallen överlämnas och följs upp enligt behov.',
  },
];

// TODO: Formuleringar ska stämmas av med Hallpartner innan publicering.
export const trustStrengths: StrengthItem[] = [
  { title: 'Helhetsleverantör', description: 'Ett samlat ansvar från idé till färdig hall.' },
  { title: 'Personlig projektledning', description: 'En tydlig kontaktväg genom hela processen.' },
  {
    title: 'Kvalitetssäkrad process',
    description: 'Strukturerat arbetssätt från projektering till montage.',
  },
  { title: 'Lokal förankring', description: 'Kunskap om svenska förhållanden och krav.' },
];

// TODO: Svaren är generella branschresonemang och ska kvalitetssäkras av
// Hallpartners experter innan publicering — inga Hallpartner-specifika
// fakta, priser eller tidsangivelser är inkluderade.
export const faqItems: FAQItem[] = [
  {
    question: 'Vad påverkar priset på en stålhall?',
    answer:
      'Priset påverkas bland annat av hallens storlek, markförhållanden, materialval och grad av anpassning.',
  },
  {
    question: 'Behöver jag bygglov?',
    answer:
      'I de flesta fall krävs bygglov eller anmälan. Kraven varierar mellan kommuner, så det bör alltid kontrolleras i det enskilda fallet.',
  },
  {
    question: 'Hur lång tid tar ett projekt?',
    answer:
      'Tidsramen beror på hallens storlek och komplexitet, samt på handläggningstider för eventuella tillstånd.',
  },
  {
    question: 'Vilken hall passar min verksamhet?',
    answer:
      'Rätt halltyp beror på användningsområde, till exempel produktion, lager, lantbruk eller verkstad.',
  },
];

// ---------------------------------------------------------------------------
// /kontakt/
// ---------------------------------------------------------------------------

export const contactPage = {
  heading: 'Vi ser fram emot nästa steg.',
  text: 'Den här visionen är en början. Tillsammans kan vi skapa en digital upplevelse som speglar Hallpartners kvalitet.',
  // Länkar till kontaktkortet på samma sida — riktiga kontaktuppgifter är TODO, se ContactCard.
  cta: { label: 'Kontakta Amelio', href: '#kontaktuppgifter', variant: 'primary' } as CTA,
};
