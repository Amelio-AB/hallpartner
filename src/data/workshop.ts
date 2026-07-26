import type { WorkshopAnalysisGroup, WorkshopCategory } from '../types/content';

// Frågorna och sakuppgifterna är återställda från den senast bearbetade
// versionen av FragorMedSvar.astro. Formuleringarna under `preliminary`
// markerar uttryckligen att uppgifterna är hypoteser som ska bekräftas.
// `importance` är nyskrivet för den separata workshopsidans behov.
export const workshopCategories: WorkshopCategory[] = [
  {
    number: '01',
    title: 'Mål och riktning',
    questions: [
      {
        id: 'mal-och-riktning-1',
        question: 'Vad ska sajten göra bättre än den gör i dag?',
        preliminary:
          'Min preliminära bild är att sajten behöver ge försäljningen bättre stöd med bilder, material, filmer och referensobjekt från flera kunder.',
        importance:
          'Svaret hjälper oss att prioritera webbplatsens viktigaste uppgift och välja innehåll som faktiskt stödjer affären.',
      },
      {
        id: 'mal-och-riktning-2',
        question: 'Hur vet vi om ett år att det här var värt investeringen?',
        preliminary:
          'Min preliminära bild är att nyttan ska synas i fler sålda hallar under 2027, men målet behöver formuleras tillsammans.',
        importance:
          'Ett tydligt mått gör det möjligt att prioritera rätt och senare bedöma om arbetet har gett önskad effekt.',
      },
      {
        id: 'mal-och-riktning-3',
        question: 'Vad skulle få er att säga att projektet blev riktigt lyckat?',
        preliminary:
          'Det verkar som att ett tydligt försäljningsmål för 2027, som verksamheten står bakom, är en viktig del av framgången.',
        importance:
          'Frågan förankrar projektets mål i verksamheten och visar vilka resultat som är viktigast för Hallpartner.',
      },
    ],
  },
  {
    number: '02',
    title: 'Kunder och försäljning',
    questions: [
      {
        id: 'kunder-och-forsaljning-1',
        question: 'Hur hittar kunderna er i dag?',
        preliminary:
          'Utifrån det jag har sett hittills verkar kunderna främst hitta Hallpartner via Google, Facebook och Blocket.',
        importance:
          'Svaret visar vilka delar av kundresan webbplatsen behöver stödja och vilka kanaler som bör följas upp.',
      },
      {
        id: 'kunder-och-forsaljning-2',
        question: 'Vilka kunder vill ni få fler av – och vilka vill ni ha färre av?',
        preliminary:
          'Min preliminära bild är att Hallpartner vill få fler kunder som köper stora hallar.',
        importance:
          'Prioriterade kundtyper styr budskap, referensprojekt, tjänsteinnehåll och vilka förfrågningar webbplatsen ska uppmuntra.',
      },
      {
        id: 'kunder-och-forsaljning-3',
        question:
          'Vad händer när en förfrågan kommer in? Vem tar emot den och hur snabbt svarar ni?',
        preliminary:
          'Min preliminära bild är att Hallpartner återkopplar inom 24 timmar. Det här behöver vi bekräfta och beskriva mer exakt tillsammans.',
        importance:
          'Flödet efter en förfrågan avgör hur kontaktvägar ska utformas och vilka förväntningar webbplatsen kan skapa.',
      },
      {
        id: 'kunder-och-forsaljning-4',
        question: 'Hur lång är vägen från första kontakt till affär?',
        preliminary:
          'Det verkar som att tiden varierar beroende på hallen och kunden. Vi behöver förstå vilka skillnader som påverkar processen.',
        importance:
          'Säljcykelns längd visar vilket innehåll kunden behöver i olika skeden innan offert och beslut.',
      },
      {
        id: 'kunder-och-forsaljning-5',
        question: 'Vilket område levererar ni till i praktiken?',
        preliminary:
          'Min preliminära bild är att Hallpartner levererar i hela Sverige och har en ambition att även nå Norge.',
        importance:
          'Geografin påverkar målgrupper, sökinnehåll, referensurval och hur erbjudandet behöver beskrivas.',
      },
    ],
  },
  {
    number: '03',
    title: 'Erbjudande och konkurrens',
    questions: [
      {
        id: 'erbjudande-och-konkurrens-1',
        question: 'Vilka typer av hallar säljer ni mest?',
        preliminary:
          'Utifrån underlaget verkar det ännu inte finnas en tydlig bild av vilken halltyp som säljer mest. Det behöver vi bekräfta tillsammans.',
        importance:
          'Svaret hjälper oss att prioritera tjänster, projekt och landningssidor efter faktisk efterfrågan.',
      },
      {
        id: 'erbjudande-och-konkurrens-2',
        question: 'Varför valde er senaste kund er i stället för konkurrenten?',
        preliminary:
          'Min preliminära bild är att tillgänglighet, telefonsvar och aktiv uppföljning bidrar när Hallpartner vinner en affär.',
        importance:
          'Det kunderna faktiskt väljer Hallpartner för bör vara kärnan i webbplatsens förtroendeskapande budskap.',
      },
      {
        id: 'erbjudande-och-konkurrens-3',
        question: 'Berätta om en affär ni förlorade – vad fällde avgörandet?',
        preliminary:
          'Det verkar som att pris eller en konkurrents tydligare kommunikation kan ha varit avgörande. Vi behöver pröva den bilden mot konkreta affärer.',
        importance:
          'Förlorade affärer kan visa vilka invändningar, informationsluckor eller förtroendefrågor webbplatsen behöver hantera.',
      },
      {
        id: 'erbjudande-och-konkurrens-4',
        question: 'Finns det något ni vill sälja mer av framåt?',
        preliminary: 'Min preliminära bild är att Hallpartner vill sälja fler stora hallar.',
        importance:
          'Framtida försäljningsfokus avgör vilka delar av erbjudandet som ska få mest synlighet och innehåll.',
      },
    ],
  },
  {
    number: '04',
    title: 'Kundens frågor',
    questions: [
      {
        id: 'kundens-fragor-1',
        question: 'Vad frågar kunderna nästan alltid om?',
        preliminary:
          'Det verkar som att återkommande frågor gäller snözoner, vad som ingår och vad monteringen kostar.',
        importance:
          'Vanliga frågor visar vilket innehåll som kan minska osäkerhet och förbättra kvaliteten på offertförfrågningar.',
      },
      {
        id: 'kundens-fragor-2',
        question: 'Vad brukar skapa osäkerhet eller tveksamhet?',
        preliminary:
          'Min preliminära bild är att kunder ibland ändrar sig flera gånger under processen. Orsakerna behöver vi förstå bättre.',
        importance:
          'När orsaken till tvekan är tydlig kan webbplatsen förklara val, ansvar och nästa steg vid rätt tidpunkt.',
      },
      {
        id: 'kundens-fragor-3',
        question: 'Vad behöver ni veta innan ni kan lämna en offert?',
        preliminary:
          'Utifrån det jag har sett hittills behöver Hallpartner bland annat längd, bredd, material och information om markförhållanden.',
        importance:
          'Ett tydligt offertunderlag kan ge bättre förfrågningar och hjälpa kunden att förbereda rätt information före kontakt.',
      },
      {
        id: 'kundens-fragor-4',
        question: 'Var uppstår de vanligaste missförstånden?',
        preliminary:
          'Det verkar som att ansvarsfördelningen – vem som ska göra vad – är en återkommande källa till missförstånd.',
        importance:
          'Tydliga roller och ansvar kan stärka förtroendet och minska friktion under både försäljning och genomförande.',
      },
    ],
  },
  {
    number: '05',
    title: 'Innehåll och bilder',
    questions: [
      {
        id: 'innehall-och-bilder-1',
        question: 'Vilka projekt är ni mest stolta över?',
        preliminary:
          'Min preliminära bild är att projektet i Jönköping är ett projekt Hallpartner gärna vill lyfta.',
        importance:
          'Rätt referensprojekt ger konkreta bevis på erfarenhet och hjälper nya kunder att känna igen sin egen situation.',
      },
      {
        id: 'innehall-och-bilder-2',
        question: 'Vilka bilder och ritningar finns – och kan jag få se dem i dag?',
        preliminary:
          'Min preliminära bild är att befintligt material behöver gås igenom och överföras i samband med mötet.',
        importance:
          'En tidig inventering visar vad som redan kan användas och vilket bild- eller ritningsmaterial som behöver tas fram.',
      },
      {
        id: 'innehall-och-bilder-3',
        question: 'Finns kunder som kan tänka sig att medverka i ett referenscase?',
        preliminary:
          'Det verkar finnas kunder som kan tänka sig att medverka längre fram, men detta behöver bekräftas.',
        importance:
          'Kundmedverkan kan göra projektpresentationer mer trovärdiga och ge starkare bevis än företagets egna påståenden.',
      },
      {
        id: 'innehall-och-bilder-4',
        question: 'Vem hos er kan bidra med innehåll, och hur mycket tid har den personen?',
        preliminary:
          'Min preliminära bild är att en person kan bidra med ungefär två timmar i veckan.',
        importance:
          'Tillgänglig tid avgör en realistisk innehållsplan, ansvarsfördelning och hur enkelt webbplatsen måste vara att uppdatera.',
      },
    ],
  },
  {
    number: '06',
    title: 'Sajten i dag',
    questions: [
      {
        id: 'sajten-i-dag-1',
        question: 'Vem byggde nuvarande sajt och vem uppdaterar den?',
        preliminary:
          'Min preliminära bild är att den nuvarande leverantören sköter både drift och uppdateringar.',
        importance:
          'Nuvarande ansvar och teknik påverkar migrering, åtkomst, drift och vilken förvaltningsmodell som är rimlig framåt.',
      },
      {
        id: 'sajten-i-dag-2',
        question: 'Vad fungerar bra – och vad irriterar er mest?',
        preliminary:
          'Utifrån underlaget verkar pålitlighet och uppdatering fungera bra. Tillgänglighet via telefon lyfts också fram, men bilden behöver fördjupas.',
        importance:
          'Det som redan fungerar ska bevaras, medan återkommande problem visar var förändring ger störst praktisk nytta.',
      },
      {
        id: 'sajten-i-dag-3',
        question: 'Har ni Google Analytics eller Search Console? Kan jag få tillgång?',
        preliminary:
          'Det verkar som att verktygen inte är installerade i dag och att den nuvarande leverantören har webbplatsens konto. Detta behöver verifieras.',
        importance:
          'Tillgång till mätdata och sökdata ger en faktabaserad nulägesbild och gör framtida resultat möjliga att följa.',
      },
      {
        id: 'sajten-i-dag-4',
        question: 'Vad vill ni kunna ändra själva, utan att ringa mig?',
        preliminary:
          'Min preliminära bild är att Hallpartner vill kunna ändra texter, öppettider och bilder själva.',
        importance:
          'Redaktörsbehoven påverkar teknikval, behörigheter, utbildning och hur enkel den löpande förvaltningen blir.',
      },
    ],
  },
];

export const workshopAnalysis: WorkshopAnalysisGroup[] = [
  {
    title: 'Vad som redan fungerar',
    intro: 'Här ser jag ett starkt fundament att bygga vidare på:',
    observations: [
      'Snabb svarstid (24 timmar) och personlig telefonuppföljning – det egna svaret på varför affärer vinns.',
      'Tydlig bild av vilken information som krävs för en offert: mått, material och markförhållanden.',
      'Rikstäckande leverans redan i dag, med uttalad vilja att växa mot Norge.',
      'En tydlig ambition att få fler kunder som köper stora hallar – en riktning att bygga innehåll kring.',
    ],
  },
  {
    title: 'Störst potential',
    intro: 'Här ser jag preliminärt störst utrymme att växa:',
    observations: [
      'Egen webbstatistik skulle visa vilken hallstyp som faktiskt säljer mest.',
      'En tydlig sida om vem som gör vad kan både stödja fler affärer och minska missförstånd.',
      'Tydligare information tidigt i processen kan minska antalet gånger kunder ombestämmer sig.',
      'Möjlighet att redigera texter och bilder själva kan ge en enklare vardag och kräver en lösning bortom ren FTP-deploy.',
      'Ett tydligt, gemensamt mål för 2027 kan ge hela projektet en riktning att sikta mot.',
    ],
  },
];
