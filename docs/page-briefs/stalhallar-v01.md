# Stålhallar – innehålls- och SEO-brief v0.1

> **2026-11-01 · Nyskriven redaktionell arbetsplan för `/stalhallar/`, INTE ett återfunnet originalutkast och INTE kundgodkänd produktionscopy.**
>
> Syfte: konkret underlag för Astro-sidan med AMP-005, internlänkning och kommande SEO-granskning. Faktapåståenden om Hallpartners leveranser måste verifieras av Peter/Jimmy. URL:en är ett **bevarandeförslag**, inte slutligt låst. AMP-002 utvecklas separat och ska inte ändras här.
>
> Läs tillsammans med [SEO-sitemap v0.2](../SEO_SITEMAP_V02.md), [webbplatsplanen](../WEBSITE_PLAN.md) och [innehållsmanifestet](../content/README.md). Manifestets status **0/11 återfunna fulltext-original** är oförändrad.

## 1. Roll och sökintention

**Primär sida:** `https://hallpartner.se/stalhallar/`. Den tidigare WordPress-adressen behålls som första alternativ för att undvika omotiverad flytt och för att bevara möjliga befintliga länksignaler. Detta är en SEO-försiktighetsprincip, inte dokumenterade sökpositioner eller trafikvolymer.

**Besökarens huvudfråga:** "Jag behöver en hall. Vilka stålhallar eller andra relevanta hallutföranden kan passa min verksamhet, och vad behöver jag veta innan jag hör av mig?"

**Primär semantisk inriktning:** stålhallar / stålhall. Sekundära uttryck att använda **endast när texten svarar på frågan**: hallbyggnad, stålhall för lager, stålhall för maskiner, stålstomme, plåtutförande, isolerad hall. Inte verifierad sökvolym.

**Sidans jobb:** en begriplig jämförelse och navigering till ämnessidor. Inte en kopia av startsidan, en full teknisk produktbeskrivning eller ett tio-stegs offertformulär.

**Tydlig gräns mot undersidorna:**
- `/stalhallar/lagerhall/` besvarar lagring, logistiska flöden och åtkomst i detalj.
- `/stalhallar/maskinhall/` besvarar maskiners storlek, service och förflyttning.
- `/stalhallar/ridhus/` besvarar ridverksamhetens specifika behov.
- `/stalhallar/plathall/` behandlar plåtutförandet, inte ett fristående användningsområde.
- `/stalhallar/talthall/` behandlar tält-/dukutförandet, inte en användning. **Kontrollera om respektive hall hör till stålhallskategorin i det faktiska sortimentet** innan den presenteras som underkategori.
- `/stalhallar/isolerad-hall/` behandlar isolering som egenskap hos flera halltyper.

**Arkitekturrisk:** `/stalhallar/` heter "Stålhallar", men den tidigare WordPress-sidan presenterar även PVC-hallar. Om Hallpartner säljer hallar utan bärande stålstomme kan de inte tyst räknas som stålhallar. Bevara URL-förslaget tills GSC och sortimentsmatris är granskade; redaktionellt kan dessa lösningar beskrivas under "Andra utföranden att jämföra", inte "Alla stålhallar" om den kategoriseringen är fel.

## 2. Metadata och sididentitet – första skrivförslag

| Fält | Förslag eller krav |
|---|---|
| Sid-URL | `/stalhallar/` (preliminärt bevarande) |
| Canonical efter beslut | `https://hallpartner.se/stalhallar/` – absolut, själv-refererande |
| SEO-title | `Stålhallar för olika behov | Hallpartner` |
| Meta description | `Utforska stålhallar för lager, maskiner och andra verksamheter. Jämför användningsområden och se vad du behöver veta inför en första förfrågan.` |
| H1 (AMP-005) | `Stålhallar för din verksamhet` |
| Breadcrumb | `Start → Stålhallar`; Start länkar till `/` |
| Sidans språk | `sv` |
| Hero | AMP-005 Page Intro Hero, ljus och under solid AMP-002 Header; text utan bild tills bildrättigheter godkänts |
| Indexering under utveckling | `noindex,nofollow` i preview/prototyp; slutlig indexering endast efter releasebeslut |
| Open Graph | Titel/beskrivning/kanonisk URL enligt verifierad sida; bild endast när relevant godkänd bild finns |

**Varför inte "Stålhallar till bäst pris"?** Pris och leveranslöften är ännu inte styrkta. Skriv titel efter sidans riktiga innehåll, inte efter obekräftade affärspåståenden. Google kan välja annan titel/snippet än vårt förslag.

## 3. Föreslagen sektionsordning

Detta är **ett nytt redaktionellt brief**, inte äldre sidtext v0.1. Exempelmeningar nedan är textförslag att senare sakgranska.

### 0. Brödsmulor (serverrenderad)

Synlig länk `Start` → text `Stålhallar`. Ligg före H1. Om strukturerade data används ska `BreadcrumbList` spegla den verkliga synliga brödsmulan, utan påhittad nivå `/hallar/`.

### 1. Hero: vad sidan handlar om (AMP-005)

- Överrubrik: `Hallar / Stålhallar` (valfri; ingen extra H1).
- H1: `Stålhallar för din verksamhet`.
- Förslag ingress: `Behöver du mer utrymme för lager, maskiner eller verksamheten? Börja med hur hallen ska användas. Här får du överblick över olika behov och vad som kan vara bra att undersöka innan du tar kontakt.`
- Primär länk: `Utforska användningsområden` → `#anvandningsomraden`.
- Sekundär länk om kontaktflödet verkligen fungerar: `Kontakta Hallpartner` → `/kontakt/`.
- AMP-005 avger själv H1. Lägg inte en extra H1 i sidans shell.

### 2. H2 "Vad ska hallen användas till?" – högsta prioritet

**Id:** `anvandningsomraden`. Tre tydliga ingångar med egen text och riktiga HTML-länkar:

| Ingång | Kort beskrivning som arbetsutkast | Länktext / mål |
|---|---|---|
| Lagerhallar | `Ska hallen användas för varor, material eller förvaring? Börja med platsbehov, portar och hur lagret ska användas.` | `Läs om lagerhallar` → `/stalhallar/lagerhall/` |
| Maskinhallar | `Behöver maskiner eller fordon få plats? Fundera på åtkomst, fria ytor och vilka moment som ska kunna utföras i hallen.` | `Läs om maskinhallar` → `/stalhallar/maskinhall/` |
| Ridhus | `För ridverksamhet behöver planeringen utgå från aktiviteten och hur byggnaden ska användas.` | `Läs om ridhus` → `/stalhallar/ridhus/` |

Upprepa inte undersidornas fullständiga tekniska eller branschspecifika texter. Om någon halltyp inte faktiskt ingår i Hallpartners aktuella erbjudande ska den **inte presenteras som köpbar produkt**.

### 3. H2 "Utföranden och egenskaper att jämföra"

Förklara att **användningsområde**, **utförande** och **egenskap** inte är samma sorts val. Undvik att presentera plåthall, tälthall och isolerad hall som tre ömsesidigt uteslutande halltyper.

- `Plåthallar`: länk till `/stalhallar/plathall/`. Beskriv kort att detta avser plåtutförandet; verifiera om det gäller beklädnad, konstruktion eller en definierad produktfamilj hos Hallpartner.
- `Tälthallar`: länk till `/stalhallar/talthall/`. Beskriv som ett annat utförande att undersöka. Skriv inte att alla tälthallar har stålstomme, kan flyttas eller alltid är bygglovsfria.
- `Isolerade hallar`: länk till `/stalhallar/isolerad-hall/`. Förklara att isolering kan vara en egenskap hos olika hallanvändningar; lova inte energiklass, temperatur eller paneltjocklek.

**Exempel på neutral övergångstext:** `När du vet vad hallen ska användas till blir det lättare att diskutera utförandet. Material, isolering och andra egenskaper behöver väljas efter projektets förutsättningar.`

### 4. H2 "Vad behöver du tänka på inför ett hallprojekt?"

En kort, konkret beslutschecklista som hjälper någon före första kontakten:

1. **Användning:** vad ska förvaras eller göras i hallen?
2. **Utrymme och tillträde:** uppskattad storlek, frihöjd och portbehov?
3. **Plats:** var ska hallen stå, och vilka mark-/grundförutsättningar är kända?
4. **Inomhusmiljö:** finns behov av isolering, uppvärmning eller särskild fukthantering?
5. **Ansvarsgräns:** vilken hjälp förväntas från Hallpartner, och vilka underlag har kunden?

Det är frågor, inte konstruktionsbesked. Ingen generell lovfrihet, snö-/vindlastklassning eller exakt dimensionering i denna översikt. Länka till `/sa-gar-det-till/` först när sidan faktiskt har byggts och innehållet verifierats; annars till fungerande kontaktväg.

### 5. H2 "Hur kommer jag vidare?"

Ge en begriplig väg till **ett verkligt kontaktsteg**.

Arbetsutkast: `Du behöver inte ha alla detaljer färdiga innan du tar kontakt. Börja med att beskriva vad hallen ska användas till, ungefärliga mått om du känner till dem och var projektet är tänkt att ligga.`

- Primär CTA: `Kontakta Hallpartner` → `/kontakt/` **endast när rätt kontaktmottagare och funktion har verifierats i den nya miljön**. Under migration kan en kontrollerat fungerande befintlig WordPress-adress vara temporär destination.
- Senare alternativ: `Begär offert` → `/offert/` **först när AMP-001, servervalidering, mottagning och integritetstext är på plats**.
- Inga påhittade svarstider, "kostnadsfri offert", garantier eller försäkringar.

### 6. Valfria sektioner som kräver material

- **Verklig referens:** bara om projektidentitet, Hallpartners roll, år, kundens godkännande och bilder kan styrkas; annars utelämnas kortet.
- **Korta svar på frågor:** lägg till först om de verkligen hjälper besökaren och svaren är verifierade. Ingen FAQ-matris för att fylla ord, inget obefogat FAQPage-schema.
- **Pris/finansiering:** utelämnas tills daterat prisunderlag eller beslutad och korrekt förklarad prismodell finns. Referera i så fall till scope, moms, transport, montage, grund och giltighet, inte obekräftade "från"-priser.

## 4. Internlänkar och navigation

**Från denna sida – prioriterade synliga länkar:**

| Placering | Ankartext | Destinations-URL |
|---|---|---|
| Användningskort | Läs om lagerhallar | `/stalhallar/lagerhall/` |
| Användningskort | Läs om maskinhallar | `/stalhallar/maskinhall/` |
| Användningskort | Läs om ridhus | `/stalhallar/ridhus/` |
| Utförande | Plåthallar | `/stalhallar/plathall/` |
| Alternativa utföranden | Tälthallar | `/stalhallar/talthall/` |
| Egenskap | Isolerade hallar | `/stalhallar/isolerad-hall/` |
| Avslutande kontakt | Kontakta Hallpartner | `/kontakt/` |
| Fördjupning (villkorad) | Så går det till | `/sa-gar-det-till/` |
| Offert (villkorad) | Begär offert | `/offert/` |

- **Till sidan:** startsidan, Headerns grupp `Hallar` via en faktisk länk `Alla stålhallar`, footer och brödsmulor från hallundersidorna.
- Låt AMP-002:s gruppförälder vara en menyknapp enligt plattformens kontrakt; översikten måste få en explicit klickbar länk i menyn på både mobil och desktop.
- Ingen länk till ännu obefintliga Astro-routes vid faktisk publicering. Under utveckling används noindexerade sidprototyper separat från besökarens riktiga navigering.
- Beskrivande länkar i kontext är viktigare än att maximera antalet länkar. Lägg inte upprepade generiska "Läs mer"-knappar utan beskrivande sammanhang.
- För framtida `/stalhallar/[sida]/`: synlig brödsmula `Start → Stålhallar → [Sida]` och en kort länk tillbaka till översikten. Ingen dubblett `/hallar/` ska samtidigt indexeras med samma innehåll.

## 5. Bilder, trovärdighet och kundfakta

**Bildval:** använd gärna en godkänd verklig produktbild med tydlig stålhall i huvudsektionen. Tills rättighet och relevans är fastställda kan AMP-005 vara textbaserad. Tillämpa korrekt alt-text, exakta dimensioner och anpassat mobilutsnitt. Märk inte en AI-bild eller en okänd legacy-bild som levererat kundprojekt.

**Obekräftade uppgifter i äldre WordPress-texter som INTE ska ärvas:**

| Äldre påstående/uppgift | Verifiering innan eventuell publicering |
|---|---|
| Egna montörer / montage ingår alltid | Faktiskt utförande, avtalspart, normal omfattning, ansvar |
| Komplett helhetslösning, ritningar, portar, material ingår | Standardoffert, tillval och undantag |
| Standardmått, snölast eller konstruktion anpassad för "nordiskt klimat" | Produktblad, ansvarig konstruktör, platsberoende villkor |
| Hyra eller köpa | Verklig hyresmodell, avtalsvillkor och part |
| Kostnadsfri offert, snabba leveranser eller specifik prisnivå | Kundens beslut, aktuell kalkyl, avgränsning och datum |
| Isolervärde/paneltjocklek, underhållsfrihet, garantier | Leverantörsdata, teknisk dokumentation, garantiansvar |
| Leverans i Sverige/Norden och projektbilder | Faktisk geografi, Hallpartners roll, rättigheter |

**Särskild fråga till Peter/Jimmy:** Vilka halltyper och utföranden säljs aktivt i dag, och vilka använder bärande stålstomme? Detta avgör om `/stalhallar/` är ett korrekt produktnav eller endast en sida för en av flera hallfamiljer.

## 6. Genomförande i Astro / AMP – senare, inte gjort i denna PR

- Bygg en riktig Astro-route `src/pages/stalhallar/index.astro` först efter URL- och innehållsbeslut. Låt `/prototype/...` vara separat. Håll den nya routen `noindex` tills lansering beslutats.
- Använd AMP-005 Page Intro Hero (ljus), **solid AMP-002** och exakt en reserverad Header-höjd; AMP-005 genererar H1 själv. Ta inte AMP-002:s pågående containerändring från annan gren som redan installerad.
- Ingen hårdkodad extra scroll-Herologik som konkurrerar med AMP-002. Använd gemensam content-wrapper enligt det nya godkända AMP-kontraktet när det är tillgängligt och uppdaterat i Hallpartners låsfil.
- Centrala internlänkar ska vara riktiga `<a href>` i genererad HTML. Kontrollera ankaren `#anvandningsomraden`, brödsmula, tangentbordsfokus och clearance bakom fixed Header.
- SEO-layout måste inkludera: exakt sidtitel och description, canonical, språk, Open Graph när bild finns, noindex-grind, och sitemap som inte läcker prototyper eller gamla visionsrutter.
- Kontrollera att byggd `dist/stalhallar/index.html` finns när sidan väl är implementerad; en SEO-brief är inte bevis för en färdig route.
- Implementera inte AMP-001 i översikten som ett låtsasformulär. Den får länka till fungerande offertflöde senare.
- Visuell och funktionell QA: 320/390/768/1024/1280/1440px, mobilmeny, ingen overflow, bild och textzoom, länkar och verkligt formulärmottagande där det berörs.

## 7. Acceptanskriterier och nästa konkreta beslut

**Brief färdig som arbetsunderlag** när varje planerad sektion har en särskild uppgift, SEO-fokus och förväntade länkar. Det uppfylls av detta dokument, men det betyder inte att kunden godkänt copy.

**Godkänd för implementation som intern noindex-arbetsversion** kräver:
1. Sortimentsmatris: stålhall, PVC/tält, plåt och isolering som Hallpartner faktiskt erbjuder – eller tydligt neutrala avgränsningar.
2. Beslut om navets roll: primärt `/stalhallar/` eller senare ersättare efter crawl/GSC. Ingen dubbel publicerad översikt.
3. Bekräftat vilka länkmål som finns och vilket kontaktflöde som faktiskt fungerar.
4. Genomgång av nya textutkast mot kundpåståenden, korrekt märkta som nya.
5. Relevant bild med ursprung/rättighet eller textbaserad Hero.

**Godkänd för indexerbar lansering** kräver dessutom full URL/301-karta, metadata/canonical, 200-status, fungerande formulär, sitemap/robots-granskning, rättighetskontroll och separat releasegodkännande. Publicera inte förrän äldre visionssidor och `noindex` hanterats med avsedd miljöpolicy.

**En viktig innehållsprioritering:** Starta inte med ett omfattande allmänt stycke om stål som material. Det hjälper färre besökare att välja rätt än en kort förklaring av användningsområdena, följd av tydliga vägar till relevanta undersidor.

## 8. Källor och begränsningar

- Indexerat innehåll från [Stålhallar](https://hallpartner.se/stalhallar/), [Lagerhallar](https://hallpartner.se/stalhallar/lagerhall/), [Tälthallar](https://hallpartner.se/stalhallar/talthall/) och [Isolerade hallar](https://hallpartner.se/stalhallar/isolerad-hall/), hämtat via sökindex 2026-11-01. Källornas senaste uppgivna crawl var cirka 3–4 månader gammal; **ingen färsk direkt HTTP-crawl eller Search Console-koppling** bekräftad.
- [Tidigare URL-inventering](https://github.com/Amelio-AB/hallpartner/blob/566ff893e835432f6913bcb4bb78f909513eef7a/docs/research/URL_MIGRATION_WORKING.md) och [faktapåståenden för verifiering](https://github.com/Amelio-AB/hallpartner/blob/566ff893e835432f6913bcb4bb78f909513eef7a/docs/research/CLAIMS_EVIDENCE_WORKING.md).
- [Google: webbplatsflytt](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [crawlbara länkar](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [sidtitlar](https://developers.google.com/search/docs/appearance/title-link), [metabeskrivningar](https://developers.google.com/search/docs/appearance/snippet).
- Ingen uppmätt sökvolym eller garanterad SEO-effekt; titlar och textförslag omprövas efter faktisk data och kundgranskning.
