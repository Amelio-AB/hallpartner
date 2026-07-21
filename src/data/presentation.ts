import type {
  CTA,
  FAQItem,
  HallTypeItem,
  IndustryItem,
  JourneyStep,
  LinkCardItem,
  OpportunityCard,
  PreserveValueItem,
  ProcessStep,
  ResultItem,
  RoadmapPhase,
  ServiceItem,
  StrengthItem,
  WorkshopGroup,
} from '../types/content';

// Copy för startsidan följer ordalydelsen i uppdraget "Bygg om Hallpartner
// Vision Site" (samtalsdriven presentation inför första kundmötet) ordagrant
// där sådan finns. Kort text utan exakt given ordalydelse (t.ex. korta
// styrkebeskrivningar) är skriven i samma tonalitet och märkt TODO — ska
// stämmas av med Hallpartner innan publicering. Copy för övriga sidor är
// hämtad från docs/CONTENT.md där sådan finns.

// ---------------------------------------------------------------------------
// Startsida (/) — samtalsdriven presentation inför första kundmötet.
// Ordlydelse följer instruktionerna för startsidans ombyggnad ordagrant där
// sådana finns. Korta förklaringar och beskrivningar utan exakt given text
// är skrivna i samma tonalitet (enkelt språk, "jag ser/jag tror") och ska
// stämmas av med Hallpartner innan publicering.
// ---------------------------------------------------------------------------

// 1. Hero
export const homeHero = {
  eyebrow: 'En första analys av Hallpartners digitala närvaro',
  title: 'Jag tror att Hallpartner kan ta en starkare position digitalt.',
  body: 'Jag har tittat på er nuvarande webbplats ur en potentiell kunds perspektiv. Här visar jag vad jag ser, vilka möjligheter jag tror finns och vad jag gärna vill förstå bättre om er verksamhet.',
  primaryCTA: { label: 'Börja presentationen', href: '#grund', variant: 'primary' } as CTA,
  secondaryCTA: {
    label: 'Se ett möjligt startsidesförslag',
    href: '/startsideforslag/',
    variant: 'secondary',
  } as CTA,
};

// 2. Det här fungerar redan bra
export const strengthsIntro = {
  title: 'Hallpartner har en stark grund.',
  text: 'Det finns redan mycket att bygga vidare på. Min uppgift är inte att förändra vilka ni är, utan att göra era styrkor tydligare för kunden.',
};

// TODO: Korta förklaringar ska bekräftas av Hallpartner.
export const coreStrengths: StrengthItem[] = [
  {
    title: 'Bred erfarenhet',
    description: 'Många års erfarenhet av hallbyggnation som kunder kan luta sig mot.',
  },
  {
    title: 'Kompletta hallösningar',
    description:
      'En helhetslösning från idé till färdig hall, utan att kunden behöver koppla ihop flera leverantörer.',
  },
  {
    title: 'Kunskap genom hela projektet',
    description: 'Kompetens som följer med genom projektering, montage och leverans.',
  },
  {
    title: 'Personlig kontakt',
    description: 'En tydlig kontaktperson som kunden kan lita på genom hela processen.',
  },
];

// 3. Min utgångspunkt
export const visitorPerspective = {
  title: 'Jag har försökt se webbplatsen som en ny kund.',
  intro:
    'En besökare känner kanske inte till Hallpartner, era projekt eller hur ni arbetar. Därför behöver webbplatsen snabbt svara på några enkla frågor:',
  questions: [
    'Kan ni hjälpa mig med rätt typ av hall?',
    'Har ni gjort liknande projekt tidigare?',
    'Hur går ett projekt till?',
    'Kan jag känna mig trygg med er?',
    'Vad är nästa steg?',
  ],
  closing: 'I dag behöver besökaren arbeta ganska hårt för att hitta svaren.',
};

// 4. Så tror jag att kunden väljer leverantör
export const decisionJourneyIntro = {
  title: 'Beslutet börjar ofta innan första samtalet.',
};

export const decisionJourneySteps: JourneyStep[] = [
  { label: 'Söker', description: 'Behovet identifieras och research inleds online.' },
  { label: 'Besöker webbplatsen', description: 'Första intrycket av Hallpartner skapas digitalt.' },
  { label: 'Jämför alternativ', description: 'Leverantörer, referenser och kompetens jämförs.' },
  { label: 'Bygger förtroende', description: 'Innehåll och case avgör vem som känns trovärdig.' },
  {
    label: 'Tar kontakt',
    description: 'Första kontakten tas med den leverantör som känns säkrast.',
  },
  { label: 'Begär offert', description: 'Dialogen övergår till offert och projekt.' },
];

export const decisionJourneyNote =
  'Webbplatsens uppgift är inte att avsluta affären. Den ska göra kunden trygg nog att ta nästa steg.';

export const decisionJourneyPrompt = 'Stämmer det här med hur era kunder brukar hitta och välja er?';

// 5. Här ser jag den största potentialen
export const opportunitiesIntro = {
  title: 'Fyra möjligheter som kan göra stor skillnad.',
};

export const opportunityCards: OpportunityCard[] = [
  {
    title: 'Tydligare erbjudande',
    description:
      'Besökaren ska snabbt förstå vilka hallar, tjänster och lösningar Hallpartner erbjuder.',
    href: '/startsideforslag/',
    linkLabel: 'Se startsidesförslaget',
  },
  {
    title: 'Starkare referensprojekt',
    description: 'Varje projekt kan visa kundens behov, Hallpartners lösning och det färdiga resultatet.',
    href: '/projekt/',
    linkLabel: 'Se referensprojekt',
  },
  {
    title: 'Synlig kunskap',
    description: 'Vanliga kundfrågor kan bli guider som skapar trygghet redan före första kontakten.',
    href: '/kunskapsbank/',
    linkLabel: 'Till kunskapsbanken',
  },
  {
    title: 'En tydligare väg till kontakt',
    description: 'Det ska vara enkelt att förstå vad nästa steg är och vem kunden ska prata med.',
    href: '/kontakt/',
    linkLabel: 'Till kontakt',
  },
];

// 6. Det här vill jag inte förändra
export const preserveValuesIntro = {
  title: 'Det viktiga ska kännas igen.',
  text: 'En ny digital riktning ska förstärka Hallpartner, inte göra företaget opersonligt eller generiskt.',
};

export const preserveValues: PreserveValueItem[] = [
  { title: 'Den personliga kontakten' },
  { title: 'Den praktiska erfarenheten' },
  { title: 'Det långsiktiga arbetssättet' },
  { title: 'Närheten till kundens projekt' },
  { title: 'Hallpartners identitet och trovärdighet' },
];

// 7. Frågor jag gärna vill diskutera
export const workshopIntro = {
  title: 'För att skapa rätt lösning behöver jag förstå hur ni arbetar i dag.',
};

export const workshopGroups: WorkshopGroup[] = [
  {
    title: 'Kunder och försäljning',
    questions: [
      'Hur hittar kunderna er i dag?',
      'Vilka typer av kunder vill ni få fler av?',
      'Hur lång är vägen från första kontakt till affär?',
      'Vilka konkurrenter möter ni oftast?',
    ],
  },
  {
    title: 'Tjänster och erbjudande',
    questions: [
      'Vilka typer av hallar säljer ni mest?',
      'Vilka tjänster är viktigast för lönsamheten?',
      'Vad skiljer Hallpartner från andra leverantörer?',
      'Finns det erbjudanden ni vill prioritera framåt?',
    ],
  },
  {
    title: 'Kundens frågor',
    questions: [
      'Vad frågar kunderna nästan alltid om?',
      'Vad brukar skapa osäkerhet?',
      'Vad behöver kunden veta innan ni kan lämna offert?',
      'Var uppstår de vanligaste missförstånden?',
    ],
  },
  {
    title: 'Projekt och innehåll',
    questions: [
      'Vilka projekt är ni mest stolta över?',
      'Finns bilder, ritningar eller kundberättelser?',
      'Kan vissa kunder tänka sig att medverka i ett referenscase?',
      'Vem inom Hallpartner kan bidra med kunskap och innehåll?',
    ],
  },
];

// 8. Min vision
export const visionOverviewIntro = {
  title: 'En webbplats som hjälper kunden från första fråga till första kontakt.',
  text: 'Jag ser framför mig en digital plattform där Hallpartner kan visa vad ni gör, hur ni arbetar och varför kunder ska känna sig trygga med er.',
};

export const visionOverviewItems: LinkCardItem[] = [
  { title: 'Tydlig startsida', href: '/startsideforslag/', linkLabel: 'Se förslaget' },
  { title: 'Halltyper och tjänster', href: '/startsideforslag/', linkLabel: 'Se förslaget' },
  { title: 'Referensprojekt', href: '/projekt/', linkLabel: 'Se projekten' },
  { title: 'Kunskapsbank', href: '/kunskapsbank/', linkLabel: 'Till kunskapsbanken' },
  { title: 'Enkel kontaktväg', href: '/kontakt/', linkLabel: 'Till kontakt' },
];

// 9. Se ett möjligt startsidesförslag
export const startPageTeaser = {
  title: 'Så här skulle nästa steg kunna se ut.',
  text: 'Det här är inte en färdig design. Det är ett konkret exempel på hur Hallpartners erbjudande kan bli tydligare för en ny kund.',
  cta: { label: 'Öppna startsidesförslaget', href: '/startsideforslag/', variant: 'primary' } as CTA,
  secondaryCta: { label: 'Läs om visionen', href: '/vision/', variant: 'ghost' } as CTA,
};

// 10. Möjligt arbetssätt
export const workingProcessIntro = {
  title: 'Om vi väljer att gå vidare.',
};

export const workingProcessPhases: RoadmapPhase[] = [
  { title: 'Förstå verksamheten', description: 'Vi lär känna Hallpartners mål, kunder och sätt att arbeta.' },
  {
    title: 'Samla innehåll och projekt',
    description: 'Bilder, projekt och kunskap samlas in som grund för innehållet.',
  },
  {
    title: 'Bestämma struktur och budskap',
    description: 'Vi bestämmer vad sajten ska säga och i vilken ordning.',
  },
  {
    title: 'Designa upplevelsen',
    description: 'Utseende och känsla formges enligt Hallpartners identitet.',
  },
  { title: 'Bygga och testa', description: 'Sajten byggs och testas på mobil, surfplatta och dator.' },
  { title: 'Lansera och förbättra', description: 'Sajten publiceras och utvecklas vidare över tid.' },
];

export const workingProcessCta = {
  label: 'Se hela arbetsprocessen',
  href: '/roadmap/',
  variant: 'ghost',
} as CTA;

// 11. Förväntad affärsnytta
export const businessValueIntro = {
  title: 'Vad arbetet ska bidra till.',
};

export const businessValueItems: ResultItem[] = [
  {
    icon: 'compass',
    title: 'Tydligare första intryck',
    text: 'Besökaren förstår snabbt vem Hallpartner är och vad ni kan hjälpa till med.',
  },
  {
    icon: 'shield',
    title: 'Större förtroende',
    text: 'Tydligt innehåll gör det lättare för kunden att känna sig trygg.',
  },
  {
    icon: 'inbox',
    title: 'Fler relevanta förfrågningar',
    text: 'Rätt information gör det enklare för rätt kunder att höra av sig.',
  },
  {
    icon: 'handshake',
    title: 'Bättre stöd för säljarbetet',
    text: 'Säljteamet får ett verktyg som gör en del av jobbet innan första mötet.',
  },
  {
    icon: 'layers',
    title: 'En plattform som kan växa över tid',
    text: 'En grund som kan byggas ut i takt med verksamheten.',
  },
];

// 12. Avslutning
export const presentationClosing = {
  title: 'Det här är min bild. Nu vill jag gärna höra er.',
  text: 'Målet med mötet är inte att besluta om alla detaljer. Målet är att förstå om vi ser samma möjligheter och om det finns en bra grund för nästa steg.',
  button: { label: 'Låt oss prata vidare', href: '/kontakt/', variant: 'primary' } as CTA,
  secondaryButton: {
    label: 'Se startsidesförslaget',
    href: '/startsideforslag/',
    variant: 'secondary',
  } as CTA,
};

// Används av /projekt/, /kunskapsbank/ och /roadmap/ som avslutande CTA-block.
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
    home: { label: 'Till analysen', href: '/', variant: 'ghost' } as CTA,
    contact: { label: 'Kontakta oss', href: '/kontakt/', variant: 'ghost' } as CTA,
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
  links: {
    home: { label: 'Till analysen', href: '/', variant: 'ghost' } as CTA,
    startPage: { label: 'Se startsidesförslaget', href: '/startsideforslag/', variant: 'ghost' } as CTA,
  },
};
