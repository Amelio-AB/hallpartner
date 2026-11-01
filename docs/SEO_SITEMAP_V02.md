# Hallpartner – SEO-sitemap och internlänkningsplan v0.2

> **2026-11-01 · Arbetsrekommendation, inte lanseringsbeslut eller godkänd kundcopy.**
> Avser sidornas roller, URL-migrering, sökfokus och länkar inför Astro-implementation. Huvudkällan för tidigare textversioner är fortfarande [innehållsmanifestet](content/README.md), som anger att fulltext för 0/11 originalutkast har arkiverats. Skapa inte påstådda original av förslagen här.
>
> **Första genomarbetade sidbrief:** [Stålhallar /stalhallar/ v0.1](page-briefs/stalhallar-v01.md). Nyskriven innehållsplan, inte kundgodkänd copy och inte återfunnet fulltextoriginal.
>
> **URL-förslag v0.2 ersätter de korta arbets-URL:erna i WEBSITE_PLAN.md från 2026-10-31.** Inga routes, redirects, canonical-taggar, sitemaps, arbetsflöden eller publicerade sidor ändrades av denna dokumentationsrevision. Uppdatera befintliga HPD-/HP-ID i PR #2 vid faktisk status-/beslutsändring; skapa inte ett parallellt kanoniskt beslutsregister.

## 1. Vad som går att styrka

- Befintligt [URL_MIGRATION_WORKING](https://github.com/Amelio-AB/hallpartner/blob/566ff893e835432f6913bcb4bb78f909513eef7a/docs/research/URL_MIGRATION_WORKING.md) listar etablerade WordPress-adresser för stålhallar och sex produktundersidor. Samma adresser är utgångspunkt för **bevarande**, inte bevis för Google-rankning eller att alla svarar med HTTP 200 just nu.
- I webbsökning den 1 november 2026 kunde sökindexets tidigare crawls från cirka juli–augusti 2026 läsas för `/stalhallar/`, `/stalhallar/lagerhall/`, `/stalhallar/talthall/`, `/stalhallar/isolerad-hall/` och `/om-oss/`. Direkt hämtning av live-sidorna misslyckades i granskningsmiljön, så **färska HTTP-statusar, kanoniska URL:er och aktuella WordPress-metadata är inte verifierade**. Indexresultat kan vara inaktuella.
- Dessa äldre texter innehåller bland annat påståenden om eget montage, helhetslösning, leveransområde och tekniska egenskaper. En tidigare publicering är inte kundverifiering. Använd [CLAIMS_EVIDENCE_WORKING](https://github.com/Amelio-AB/hallpartner/blob/566ff893e835432f6913bcb4bb78f909513eef7a/docs/research/CLAIMS_EVIDENCE_WORKING.md).
- Google Search Console (GSC), GA4 och backlinkdata för `hallpartner.se` har inte varit åtkomliga vid denna genomgång. Ingen sökvolym, rankingposition, konkurrensgrad eller konvertering per landningssida har uppmätts.
- Hallpartners nya Astro-gren har redan riktig startsida på `/`, men hallundersidorna är fortfarande noindexerade prototyper. Legacy-routesna `/vision/`, `/projekt/` och `/roadmap/` finns kvar i byggresultatet. `astro.config.mjs` utesluter prototyper ur XML-sitemap men inte dessa äldre visionssidor.
- Principen följer Googles rekommendationer att kartlägga och behålla relevanta ingångar vid flytt, använda beskrivande titlar och länktexter samt se till att viktiga sidor går att nå genom riktiga HTML-länkar. Källor nederst i dokumentet.

## 2. Rekommenderad struktur och URL-karta

Detta är ett **preliminärt 200/behåll-förslag**, villkorat av full live-crawl, Search Console och Hallpartners faktiska sortiment. Nyckelorden är semantiska ämneshypoteser, inte verifierade rankingmål.

| Sida | Föreslagen permanent URL v0.2 | Sökfokus / sidans unika roll | URL-beslut |
|---|---|---|---|
| Startsida | `/` | Varumärke Hallpartner, orientering till hallutbudet | Behåll |
| Stålhallar / hallöversikt | `/stalhallar/` | Övergripande sökning efter stålhallar; jämförelse och navigationsnav | Behåll befintlig |
| Lagerhallar | `/stalhallar/lagerhall/` | Förvaring, lagerlokal, logistik och åtkomst | Behåll befintlig |
| Maskinhallar | `/stalhallar/maskinhall/` | Maskiner, fordon, frihöjd och verksamhetens arbetsflöde | Behåll enligt tidigare URL-inventering; live-HTTP behöver kontrolleras |
| Ridhus | `/stalhallar/ridhus/` | Ridhus/ridhall och ridverksamhetens egna behov | Behåll enligt tidigare URL-inventering; live-HTTP behöver kontrolleras |
| Tälthallar | `/stalhallar/talthall/` | Duk/PVC-baserat hallutförande och relevanta användningar | Behåll befintlig |
| Plåthallar | `/stalhallar/plathall/` | Plåt som vägg-/takutförande; skillnad mot andra konstruktionsalternativ | Behåll enligt tidigare URL-inventering; live-HTTP behöver kontrolleras |
| Isolerade hallar | `/stalhallar/isolerad-hall/` | Isolering, sandwichpaneler och temperatur-/fuktbehov | Behåll befintlig |
| Så går det till | `/sa-gar-det-till/` | Process och ansvar mellan förfrågan och projekt | Ny sida, först efter processverifiering |
| Om Hallpartner | `/om-oss/` | Företaget, personer, faktisk kompetens och juridisk part | Behåll befintlig |
| Kontakt | `/kontakt/` | Kontaktuppgifter och ett verkligt fungerande kontaktflöde | Behåll befintlig |
| Offert (separat funktion) | `/offert/` | Aktiv hallförfrågan; AMP-001 när flödet är färdigt | Skydda befintlig URL; **lanseringsblockerare** om ersättning/mottagning saknas |
| Integritet | `/integritetspolicy/` eller beslutad befintlig policy-URL | Information om behandling när formulär går i drift | URL/text måste beslutas före formulärlansering |

**Varför inte skapa `/hallar/` parallellt?** De två översiktssidorna skulle i nuläget besvara nästan samma fråga. Vi väljer en primär översikt; om sortimentet senare visar sig bredare än stålhallar och GSC styrker ett byte kan `/hallar/` prövas som **ersättare** med en relevant 301 från `/stalhallar/`, inte som automatisk dubbel sida.

**Varför inte korta alla produkt-URL:er?** Kortare slug är ingen tillräcklig anledning till sidflytt. Besluta 301/200/410 per gammal adress först efter GSC, inkommande länkar, sökintention och crawl. Påhittade `/lagerhallar/`, `/maskinhallar/` etc. ska inte produceras som alternativa dubbletter.

**Industriall, verkstadshall, lantbrukshall och priser:** ämnen att kontrollera mot GSC och verkliga kundförfrågningar. Skapa inte nya landningssidor bara för att konkurrerande företag använder orden. Om ett ämne inte har distinkt behov, separat produktinformation och faktisk erbjudandekoppling ska det först hanteras inom närmaste relevanta sida.

## 3. Redaktionellt kontrakt: en uppgift per sida

| Sida | Fråga sidan ska besvara | Innehållsdelar som ska planeras; inte färdig copy |
|---|---|---|
| Startsida | Vad erbjuder Hallpartner och var börjar jag? | Godkänd bild-Hero, kort förklaring av hallbehov, väg till stålhallar och centrala användningar, verifierade bevis när de finns, kort första steg och kontakt |
| Stålhallar | Hur hittar jag rätt typ av hall? | Förklara först användning (lager/maskiner/ridverksamhet), sedan konstruktion (tält/plåt) och egenskaper (isolering), relevant jämförelse och länkar till samtliga sidor; inte kopiera produktsidorna |
| Lagerhallar | Hur bör jag planera förvaring? | Vilka varor/volymer, in- och utlastning, åtkomst/portar, frihöjd, eventuellt klimatbehov, frågor inför offert, relevanta utföranden |
| Maskinhallar | Vilka krav ställer maskinerna och arbetet? | Maskinmått, förflyttning, portöppningar, tillgänglighet, verksamhet i hallen, eventuella klimatbehov; ska inte bara omskriva lagerhallar |
| Ridhus | Vad behöver en ridhusbeställare utreda? | Typ av ridverksamhet, fri yta, åtkomst, ljus/ventilation som planeringsfrågor, verkliga exempel när rättigheter finns; ingen standarddimensionering |
| Tälthallar | När kan ett duk-/PVC-utförande vara relevant? | Förklara utförande, användning och begränsningar, grund/plats, varaktighet och bygglovsbedömning utan kategoriska löften; skilj från lager som användning |
| Plåthallar | Vad innebär plåt som hallutförande? | Stomme jämfört med beklädnad, tak/väggar, val och eventuella isoleringsalternativ om bekräftade, förhållande till lager-/maskinbehov |
| Isolerade hallar | När behövs isolering och vad måste utredas? | Temperaturkrav, drift/användning, paneler och isoleringsprinciper om verifierade, fukt/ventilation som projekteringsfrågor; inte en ny lagerhallsida |
| Så går det till | Vad händer efter kontakt och vem ansvarar? | Faktiskt verifierade steg, vad kunden behöver bidra med och vem som ansvarar för ritning, lov, grund, transport och montage; inga antagna tider |
| Om Hallpartner | Vem står bakom leveransen? | Korrekt juridisk part, godkända personuppgifter, dokumenterad erfarenhet, godkända bilder, länkar till kontakt och verifierade case |
| Kontakt | Hur kommer jag vidare utan onödigt arbete? | Verifierade kontaktvägar, enkelt fungerande formulär med namngiven mottagare, integritetsinformation, tydlig men bara sanningsenlig förklaring av nästa steg |
| Offert | Hur lämnar jag en strukturerad förfrågan? | Framtida AMP-001, kundgodkänd minsta frågemängd och riktig mottagare; aldrig visa syntetisk “skickat”-bekräftelse i produktion |

### Konkreta sidmetadata – första arbetsförslag

Titlar och beskrivningar ska **omprövas mot färdig copy och verkliga sökfrågor** innan de används. De är skrivförslag, inte uppmätta SEO-optimum.

| Sida | Föreslagen SEO-title | Föreslagen H1 |
|---|---|---|
| Start | Hallpartner – stålhallar för verksamhetens behov | En hall börjar med ditt behov. (bevara redan godkänd Hero) |
| Stålhallar | Stålhallar för olika behov och utföranden \| Hallpartner | Stålhallar för olika verksamheter |
| Lagerhall | Lagerhallar för förvaring och logistik \| Hallpartner | Lagerhallar – börja med förvaringsbehovet |
| Maskinhall | Maskinhallar – planera utrymme och åtkomst \| Hallpartner | Maskinhallar för maskiner och utrustning |
| Ridhus | Ridhus och ridhallar – planera din hall \| Hallpartner | Att planera ett ridhus |
| Tälthall | Tälthallar – användning och utförande \| Hallpartner | Tälthallar för olika behov |
| Plåthall | Plåthallar – utförande och alternativ \| Hallpartner | Vad är en plåthall? |
| Isolerad hall | Isolerade hallar – när behövs isolering? \| Hallpartner | Isolerade hallar och isoleringsbehov |
| Process | Så går ett hallprojekt till \| Hallpartner | Så går det till |
| Om oss | Om Hallpartner – företaget och människorna \| Hallpartner | Om Hallpartner |
| Kontakt | Kontakta Hallpartner om ditt hallprojekt | Kontakta Hallpartner |
| Offert (när färdig) | Begär offert på en hall \| Hallpartner | Beskriv din hallförfrågan |

#### Metabeskrivningar – skrivförslag, inte redan implementerade

- **Start:** Ska du planera en hall för lager eller maskiner? Utforska Hallpartners hallöversikt och se vilka frågor som är bra att förbereda inför kontakt.
- **Stålhallar:** Jämför användningsområden som lager, maskiner och ridhus och läs om olika hallutföranden. Hitta rätt väg inför din förfrågan.
- **Lagerhall:** Planerar du en lagerhall? Läs om utrymmen, åtkomst, portar och frågor att ta ställning till innan du kontaktar Hallpartner.
- **Maskinhall:** Vilken plats behöver maskinerna? Läs om utrymmesbehov, åtkomst och förutsättningar att gå igenom inför ett maskinhallsprojekt.
- **Ridhus:** Utforska viktiga planeringsfrågor för ridhus, från användningsyta till ljus och åtkomst. Se vad du kan förbereda inför första kontakten.
- **Tälthall:** Vad är viktigt vid planering av en tälthall? Läs om möjliga användningar och frågor att reda ut kring konstruktion och byggplats.
- **Plåthall:** Läs om plåt som hallutförande och vilka frågor om väggar, tak och isolering som är relevanta inför ett hallprojekt.
- **Isolerad hall:** När är en isolerad hall relevant? Läs om temperaturbehov, drift och isoleringsval att diskutera under planeringen.
- **Process:** Se vilka frågor som behöver redas ut under ett hallprojekt – från första kontakt till beslut om projektets omfattning och ansvar.
- **Om oss:** Lär känna Hallpartner, personerna bakom verksamheten och hur du kommer i kontakt med företaget.
- **Kontakt:** Kontakta Hallpartner om ett planerat hallprojekt. Beskriv hur hallen ska användas och vilka frågor du vill diskutera.

Undvik att göra om alla `<title>`-element till samma generiska mening med bara halltyp utbytt. Google rekommenderar kompakta, beskrivande och särskiljande sidtitlar.

## 4. Internlänkning – sida för sida

Alla destinationssidor måste finnas som **verkligt fungerande HTML-routes** innan nya kundnavigeringen går live. Länka inte till noindexerade prototyper från produktionssidor. Under gradvis migration kan temporära länkar till befintlig WordPress användas enbart när de faktiskt fungerar.

| Från sida | Primära länkar | Kontextuella länkar när texten motiverar dem |
|---|---|---|
| Start | Stålhallar, Lagerhallar, Maskinhallar, Ridhus, Kontakt | Så går det till |
| Stålhallar | Alla sex hallundersidor, Kontakt | Så går det till, Offert när fungerande |
| Lagerhall | Stålhallar, Kontakt | Isolerad hall vid temperaturbehov, Plåthall/Tälthall vid utförande, Så går det till |
| Maskinhall | Stålhallar, Kontakt | Isolerad hall, Plåthall, Så går det till |
| Ridhus | Stålhallar, Kontakt | Tälthall enbart om relevant utförande faktiskt erbjuds, Så går det till |
| Tälthall | Stålhallar, Kontakt | Lagerhall eller Ridhus när användningen diskuteras, Så går det till |
| Plåthall | Stålhallar, Kontakt | Lagerhall, Maskinhall och Isolerad hall i relevant avsnitt |
| Isolerad hall | Stålhallar, Kontakt | Lagerhall, Maskinhall, Plåthall där samma egenskap är relevant |
| Så går det till | Stålhallar, Kontakt | Offert när godkänd |
| Om oss | Kontakt | Så går det till, verkliga referensprojekt när klara |
| Kontakt | Stålhallar | Offert när godkänd |
| Offert | Kontakt | Stålhallar, personuppgiftspolicy |

- Använd naturlig länktext: `Läs om isolerade hallar` i ett stycke om klimatbehov är tydligare än en rad identiska `Läs mer`.
- Varje hallundersida ska kunna nås från navet **Stålhallar** och ha en relevant väg tillbaka, exempelvis brödsmulor: `Start → Stålhallar → Lagerhallar`.
- Den visuella URL-strukturen avgör inte automatiskt hierarkin i sökresultat. Gör interna länkar och brödsmulor begripliga; använd `BreadcrumbList`-schema först när det motsvarar synlig navigation.
- AMP-002 med en gruppförälder `Hallar` gör föräldern till en **menyknapp**, inte en länk. Lägg en uttrycklig `Alla stålhallar`-länk i gruppen som går till `/stalhallar/` och fungerar på desktop/mobil. Behåll fungerande serverrenderad reservnavigation när JavaScript inte kan montera AMP-002.
- Länka inte automatiskt mellan samtliga produktsidor. 1–3 relevanta korslänkar på en undersida är ofta mer användbart än ett generiskt universellt länkraster; mängden är ingen rankingregel.
- Footer ska erbjuda beständig väg till Stålhallar, Om Hallpartner, Kontakt, integritet och relevant Offert. Den ska inte förvandlas till sökordsfylld länksamling.

## 5. Teknik – verifieringskrav före lansering

1. **Routes och sidmigrering:** Bygg de beslutade adresserna som riktiga Astro-sidor. Avlägsna de gamla visionsrutterna från produktionsindex och XML-sitemap; uppdatera interna länkar. Statiska sidor som fortfarande ligger på `/kontakt/` men visar Amelios gamla vision får inte hamna i ny produktion.
2. **Canonical:** Varje indexerbar HTML-sida får en absolut själv-refererande `rel="canonical"` med slutligt `https://hallpartner.se/.../`. Kontrollera att sitemap, canonical, brödsmulor och interna länkar använder exakt samma destinations-URL. Skapa inga två parallella övervakade kanoniska adresser för samma innehåll.
3. **Indexering:** Preview och prototyper fortsätter med `noindex` och exkluderas från sitemap. Produktionssidor får indexeringsbart svar **först vid separat lanseringsgodkännande**; kontrollera genererad HTML/HTTP i respektive miljö, inte bara komponentprop. En HTML-noindex fungerar bara när roboten får hämta sidan.
4. **XML-sitemap:** Endast avsedda publika, kanoniska, indexerbara sidor; inte `/prototype/`, `/workshop/`, `/vision/`, `/projekt/`, `/roadmap/` eller avvecklade URL:er.
5. **Migreringskarta:** Full crawl av nuvarande WordPress, Search Console 12–16 månader, GA4 om tillgänglig, inkommande länkar, aktuella statuskoder och metadata. Besluta `200/301/410` för **varje** befintlig URL. Undvik kedjor och generella 301 till startsidan. Behåll relevanta 301-regler långsiktigt.
6. **Metadata:** Unikt `<title>`, meta description, en tydlig H1, strukturerade H2 och relevanta alt-texter per verklig bild. Öppen graf/Twitter-kort endast med rätt bild och URL. AMP-004 och AMP-005 skapar sin egen H1: skapa inte en till i sidmallen.
7. **Innehåll:** Kontrollera kundens faktiska sortiment, erbjudandets omfattning, tekniska begränsningar, montage/garanti/priser och upphovsrätt. Fotografi eller ritning är inte referensbevis utan projektidentitet och publiceringsrätt. Inga syntetiska recensioner eller uppblåsta FAQ-schema.
8. **Länkkontroll:** Crawla byggda sidor; 0 interna 404, giltiga HTML-ankare, ingen intern länk till prototyp, en fungerande kontaktväg, ingen falsk formulärbekräftelse. Kontrollera 320/390/768/1280/1440px och tangentbordsnavigation.
9. **SEO-mätning efter lansering:** Spara datum och GSC-baslinje för varje huvudadress (visningar, klick, CTR, frågor och indexering). Följ upp efter release. Datera och ägarsätt eventuella publicerade pris- och regeluppgifter.

## 6. Verkliga blockerare, i rätt ordning

| När | Vad | Varför |
|---|---|---|
| **Nu** | Godkänd sortimentsmatris från Peter/Jimmy: vilka användningar, konstruktioner och egenskaper som säljs | Annars blir sidans ämne eller produktlöfte fel redan före textskrivandet |
| **Nu** | Full live-crawl + GSC om möjligt; jämför mot befintlig URL-lista | Det enda sättet att motivera eller avstå från URL-byten baserat på verklig trafik |
| **Nu** | Återfå sidutkastens fulltext i `docs/content/` eller skriv nya, tydligt märkta utkast | Planeringsrubriker är inte färdig copy och kan inte SEO-granskas fullständigt |
| **Före implementation av undersidor** | Lås URL-karta, sidans särskilda uppgift, internalänkar och innehållsunderlag | Undvik dubbletter mellan Stålhallar/Lager/Maskin/Plåt/Isolering |
| **Före produktion** | Verifierad kontakt, offert och integritet, redirects, metadata, bilder och noindex-switch | Besökaren får annars trasiga CTA; gammal SEO-trafik riskeras |
| **Senare** | Industrihall/verkstadshall/prisguider/kunskapsartiklar och referensbibliotek | Bygg endast när tydlig egen sökintention och verkligt sakunderlag finns |

**Kritisk slutsats:** Sitemapen är nu avgränsad på ett SEO-motiverat sätt, men ingen kan sanningsenligt kalla sidorna “SEO-optimerade och färdiga” förrän deras riktiga innehåll, sökfrågor, URL-status, internlänkar och tekniska rendering granskats.

## 7. Källor och ansvar

- Webbplatsplanen 2026-10-31 och dess innehållsmanifest i samma dokumentations-PR.
- [Befintliga URL:er](https://github.com/Amelio-AB/hallpartner/blob/566ff893e835432f6913bcb4bb78f909513eef7a/docs/research/URL_MIGRATION_WORKING.md) och [claim/evidence](https://github.com/Amelio-AB/hallpartner/blob/566ff893e835432f6913bcb4bb78f909513eef7a/docs/research/CLAIMS_EVIDENCE_WORKING.md).
- Tidigare sökindexerade Hallpartner-sidor: [Stålhallar](https://hallpartner.se/stalhallar/), [Lagerhallar](https://hallpartner.se/stalhallar/lagerhall/), [Tälthallar](https://hallpartner.se/stalhallar/talthall/), [Isolerade hallar](https://hallpartner.se/stalhallar/isolerad-hall/), [Om oss](https://hallpartner.se/om-oss/). Publicerad text är inte verifierad kundfakta.
- [Google: migrering och redirects](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Google: crawlbara länkar och ankartext](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: titlar](https://developers.google.com/search/docs/appearance/title-link)
- [Google: brödsmulor](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google: hjälpsamt innehåll](https://developers.google.com/search/docs/essentials)
