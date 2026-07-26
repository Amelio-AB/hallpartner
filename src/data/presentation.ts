import type {
  CTA,
  JourneyStep,
  OpportunityCard,
  ResultItem,
  RoadmapPhase,
  StrengthItem,
} from '../types/content';

// Copy för startsidan är strukturerad som en samtalsdriven presentation
// inför det första kundmötet. Konkreta verksamhetsuppgifter bygger på
// befintligt analysunderlag och ska bekräftas av Hallpartner innan extern
// publicering. Copy för övriga sidor är hämtad från docs/CONTENT.md där
// sådan finns.

// ---------------------------------------------------------------------------
// Startsida (/) — samtalsdriven presentation inför första kundmötet.
// Tonaliteten är konkret och undersökande: analysen visar en riktning men
// lämnar utrymme för Andreas att beskriva verksamheten med egna ord.
// ---------------------------------------------------------------------------

// 1. Hero
export const homeHero = {
  eyebrow: 'En första analys av Hallpartners digitala närvaro',
  title: 'Hallpartner har mer att visa än vad en ny besökare ser i dag.',
  body: 'Jag har gått igenom er webbplats med en ny kunds ögon. Min bild är att styrkan finns i erfarenheten, helhetsansvaret och den personliga kontakten — men att allt detta kan bli betydligt tydligare digitalt. Det är utgångspunkten för dagens samtal.',
  primaryCTA: { label: 'Börja presentationen', href: '#grund', variant: 'primary' } as CTA,
};

// 2. Styrkorna som redan finns
export const strengthsIntro = {
  title: 'Det finns redan mycket att bygga vidare på.',
  text: 'Det som sticker ut är inte bara vad ni bygger, utan hur ni arbetar nära kunden. Ni svarar, följer upp och vet vilken information som krävs för att ett projekt ska kunna gå vidare.',
};

export const coreStrengths: StrengthItem[] = [
  {
    title: 'Ni svarar och följer upp',
    description:
      'Att ni svarar i telefon och återkopplar snabbt är en konkret styrka i försäljningen.',
  },
  {
    title: 'Ni vet vad en bra offert kräver',
    description:
      'Mått, material och markförhållanden behöver vara tydliga innan rätt lösning kan tas fram.',
  },
  {
    title: 'Ni kan leverera över hela Sverige',
    description:
      'Den geografiska räckvidden visar att verksamheten redan har en stark grund för fortsatt tillväxt.',
  },
  {
    title: 'Ni har en tydlig ambition',
    description: 'Fokus på större hallar ger en riktning som webbplatsens innehåll kan stödja.',
  },
];

// 3. Så tror jag att kunden väljer leverantör
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

export const decisionJourneyPrompt =
  'Stämmer det här med hur era kunder brukar hitta och välja er?';

// 4. Här ser jag den största potentialen
export const opportunitiesIntro = {
  title: 'Er erfarenhet syns inte fullt ut i dag.',
  text: 'Jag ser tre områden där webbplatsen kan göra större nytta redan tidigt i kundens beslut.',
};

export const opportunityCards: OpportunityCard[] = [
  {
    title: 'Gör erbjudandet lättare att förstå',
    description:
      'Besökaren ska snabbt kunna se vilka typer av hallar ni arbetar med, vad som ingår och vilken information ni behöver.',
  },
  {
    title: 'Låt genomförda projekt bära beviset',
    description:
      'Ett bra referensprojekt visar kundens behov, Hallpartners lösning och det färdiga resultatet.',
    href: '/projekt/',
    linkLabel: 'Se referensexemplet',
  },
  {
    title: 'Gör vägen till nästa steg tydlig',
    description:
      'Rätt frågor före kontakt kan ge kunden trygghet och samtidigt ge er ett bättre underlag för första samtalet.',
  },
];

// 5. Min vision
export const visionOverviewIntro = {
  title: 'En webbplats som hjälper kunden från första fråga till första kontakt.',
  text: 'Den behöver inte säga allt. Den ska hjälpa rätt kund att förstå vad Hallpartner kan göra, känna igen sin situation och bli trygg nog att ta kontakt.',
};

// 6. Frågor till Hallpartner
export const meetingQuestions = {
  title: 'Innan jag föreslår en lösning behöver jag förstå mer.',
  intro:
    'Jag har några hypoteser efter analysen, men de behöver prövas mot hur ni faktiskt arbetar:',
  questions: [
    'Vilka typer av projekt vill ni få fler av?',
    'Varför väljer kunder Hallpartner när ni vinner en affär?',
    'Var uppstår de vanligaste frågorna eller missförstånden?',
    'Vilka genomförda projekt visar bäst vad ni kan?',
    'Vilket innehåll kan ni realistiskt hålla uppdaterat?',
    'Vad ska en ny webbplats ha bidragit med om ett år?',
  ],
  closing:
    'Svaren på de här frågorna avgör vad som är rätt att bygga — och vad vi medvetet ska låta bli.',
};

// 7. Möjligt arbetssätt
export const workingProcessIntro = {
  title: 'Om vi väljer att gå vidare.',
};

export const workingProcessPhases: RoadmapPhase[] = [
  {
    title: 'Förstå verksamheten',
    description: 'Vi lär känna Hallpartners mål, kunder och sätt att arbeta.',
  },
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
  {
    title: 'Bygga och testa',
    description: 'Sajten byggs och testas på mobil, surfplatta och dator.',
  },
  {
    title: 'Lansera och förbättra',
    description: 'Sajten publiceras och utvecklas vidare över tid.',
  },
];

export const workingProcessCta = {
  label: 'Se hela arbetsprocessen',
  href: '/roadmap/',
  variant: 'ghost',
} as CTA;

// 8. Förväntad affärsnytta
export const businessValueIntro = {
  title: 'Om vi gör det här rätt ska kunden märka skillnaden.',
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

// 9. Avslutning
export const presentationClosing = {
  title: 'Det här är min bild. Nu vill jag gärna höra er.',
  text: 'Målet med mötet är inte att besluta om alla detaljer. Målet är att förstå om vi ser samma möjligheter och om det finns en bra grund för nästa steg.',
  button: { label: 'Låt oss prata vidare', href: '/kontakt/', variant: 'primary' } as CTA,
};

// Används av /roadmap/ som avslutande CTA-block.
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
    text: 'Målet är en plattform som gör Hallpartner till ett tydligt och trovärdigt alternativ för verksamheter som ska investera i en ny hall — lättnavigerad och relevant genom hela beslutsprocessen.',
  },
  strengthenBusiness: {
    title: 'Hur design, innehåll, SEO och AI-sök stärker affären',
    text: 'Genomtänkt design kan stärka förtroendet vid första ögonkastet. Strukturerat innehåll kan besvara kundens frågor tidigt, och en tydlig sökstruktur förbättrar möjligheten att synas i både traditionell sökning och AI-drivna svar. Tillsammans kan detta ge försäljningen ett bättre digitalt stöd över tid.',
  },
  links: {
    contact: { label: 'Kontakta oss', href: '/kontakt/', variant: 'primary' } as CTA,
    roadmap: { label: 'Se arbetssättet', href: '/roadmap/', variant: 'ghost' } as CTA,
    home: { label: 'Till analysen', href: '/', variant: 'ghost' } as CTA,
  },
};

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
  },
};
