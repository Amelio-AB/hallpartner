# Bildpilot 1 – lokal granskning

Datum: 2026-11-03. Arbetsmapp: `C:\webbprojekt\hallpartner-cleanup-20261103`.
Branch: `feature/hallpartner-image-pilot-20261103`.
Utgångspunkt: `ef7a886bd90b9fb7b351595f2ba01a0997a91830`.

Endast en lokal arbetsversion för Andreas granskning. **Bildrättigheterna är
inte slutligt verifierade. Ingen kundpublicering är godkänd.** Fotografierna
illustrerar användning och utförande; de är inte verifierade Hallpartner-referenser.
Samtliga original i `src/assets/images/legacy/` bevaras oförändrade.

## Innehållsbilder

Alla filnamn nedan avser `src/assets/images/legacy/`.

| Sida och placering | Original | Alt-text | Visuellt resultat |
| --- | --- | --- | --- |
| `/`, Ridhus-kortet i `#halltyper` | `H191567f7ad934fb6aa6520bd8eeeac08N-e1773849628844.jpg` | Ridhus med upplyst ridbana och ryttare. | Rätt verksamhet syns. Befintliga kortmått och länkar bevaras. Fokus vid 65 % av bildens höjd håller ryttaren synlig även i det breda surfplattekortet. |
| `/stalhallar/lagerhall/`, `#varuflode` | `lagerhall-med-enkelplat.jpg` | Plåtklädd lagerhall med stor öppen port. | Text och befintliga planeringspunkter samlas till vänster, portbilden till höger. På mobil följer bilden efter texten. Hela motivet bevaras. |
| `/stalhallar/maskinhall/`, `#korvagar` | `bygga-maskinhall.jpeg` | Stor maskin och lastbil i en rymlig hallbyggnad. | Fotografiet står bredvid introduktionen, ovanför de tre befintliga rörelsekorten. Maskin, lastbil och utrymmet omkring syns utan beskärning. |
| `/stalhallar/talthall/`, `#talthall-utforande` | `talthall-1536x1152.jpg` | Vit tälthall med öppning och synlig truck. | Fotografiet står bredvid introduktionen, före befintliga utförandekort. Öppning, duk och truck syns utan beskärning. |

Gemensamma CSS-klasser i befintlig hallstilmall räcker; ingen ny komponent eller
nytt beroende behövs. Befintliga texter, rubriker och kort är kvar.
Startsideskomponenten delas med `/prototype/hallpartner/start/`, som också får
det rättade Ridhus-kortet. Ingen Hero, Header eller Footer har ändrats.

Astros `Image` används med `widths` och `sizes`, WebP, storleksattribut och
`loading="lazy"`. Innehållsbilderna behåller originalens proportioner genom
`height: auto`. Kortet har fortsatt sin reserverade bildyta. Ingen ny klient-JavaScript.
API-underlag: [Astros Image-dokumentation](https://docs.astro.build/en/reference/modules/astro-assets/).

## Underlag och kontroll före ändring

AGENTS.md, städrapporten, aktuell designprofil och lokal granskningsguide har
lästs. Ingen separat bildplan hittades i checkouten; detta uppdrags bildlista,
legacy-mappens README och `docs/migration/legacy-media-sitemap.v01.json` är underlag.
Inventeringens status `UNVERIFIED` ändras inte av denna pilot.

Extern preview granskades före kodändring på alla fyra sidor, med skärmbilder
i 320, 390, 768, 1280 och 1440 px. Den inbyggda webbläsaranslutningen saknades;
projektets befintliga Chrome-skript användes. Första försöket stoppades av
nätverkssandboxen; granskningen lyckades med utökad nätverksåtkomst.

Bevara: lugn färgpalett, tydliga rubriker, hallkort, ankarnavigation och kontaktvägar.
Svagheter: fel motiv i Ridhus-kortet och långa textpartier utan konkret visuell
förklaring på undersidorna. Mobilens stapling och desktopens innehållsbredd fungerar.
Previewn är referens för granskning, inte bevis för aktuell lokal commit.

## Skärmbilder

Rot: `visual-review/image-pilot-01/` (Git-ignorerade lokala granskningsfiler).

- `live-before/`: extern preview före ändring.
- `before/`: lokalt bygge av exakt startcommit.
- `content-only/`: innehållsbilder, fortsatt enfärgad mörk sektion på Tälthallar.
- `after/`: slutlig pilot med innehållsbilder och det separata bakgrundstestet.
- `review-sheets/`: sammanställningar för visuell granskning.
- `baseline-dist/`: orört lokalt startbygge för innehålls- och skaljämförelse.

Filnamn: `{home|lagerhall|maskinhall|talthall}-{mobile-320|mobile|tablet-768|desktop-1280|desktop}-full.png`.
Sektionsbilder har sektions-ID i stället för `full`, exempelvis
`talthall-desktop-talthall-anvandning.png`. JSON-rapporter ligger i samma katalog.
Samma viewport, höjd och skärmfaktor används i före- och efterbilderna.

Öppna [den lokala jämförelseöversikten](../visual-review/image-pilot-01/index.html)
och välj skärmbredd. Där finns före/efter för alla fyra sidor samt en separat
bakgrundsjämförelse. Bilderna går att öppna i originalstorlek.
Bakgrundsparet finns också som `review-sheets/background-{320|390|768|1280|1440}.png`:
vänster utan, höger med bakgrundsbild. Bilderna har identisk sektionshöjd.

Det befintliga `scripts/capture-hallpartner-home.mjs` har fått ett valfritt
`HP_SCREENSHOT_SECTIONS` (kommaseparerade ID:n) samt rapportering av bildattribut.
Ordinarie browserkontroller är kvar.

## Inledande verifiering: innehållsbilder

- Astro/TypeScript: 75 filer, 0 fel, 0 varningar, 0 hints.
- ESLint: PASS.
- Node: 41/41 PASS. Ett äldre totalförbud mot bilder på Tälthallar har avgränsats
  till den oförändrade Heron enligt pilotens uppdrag. Ridhus-undersidans bildförbud kvarstår.
- Astro build: PASS, 32 sidor.
- Byggd HTML, noindex, canonical, landmarks, länkar, sitemap och URL-mappning: PASS.
- Browser: fyra sidor × fem bredder, 20/20 PASS. Bilder laddar, en H1 och Footer,
  ingen horisontell scroll; mobilmeny öppnar och stänger med Escape och klick utanför.
- Visuell granskning av innehållssektioner: 320, 390, 768 och 1440 px. Motiven är
  läsbara, korten bevarade och mobilens ordning naturlig.

## Separat bakgrundstest: resultat

`talthall-LED.jpg` (1024 × 523 px) används dekorativt i
`/stalhallar/talthall/#talthall-anvandning`. Alt-texten är tom (`alt=""`) och
bildlagret har `aria-hidden="true"`. Bilden laddas med Astro Image, responsiva
640/1024 px-varianter och lazy loading. Inga påståenden om projektägare tillkommer.

Den befintliga mörka sektionen ligger kvar under bilden. Ett 80 % mörkt lager
i samma grafitgröna färg gör texten läsbar även över vita lampor och dukpartier.
På mobil begränsas bilden till sektionens övre 28 rem och tonar ut till
enfärgat bakom den längre läsningen. På surfplatta och desktop täcker den
sektionen utan att ändra dess mått, kort, länkar eller texter.

Bedömning efter granskning i 320, 390, 768 och 1440 px: användbart som lokalt
alternativ. Motivet ger rumskänsla, men den enfärgade versionen är lugnare.
Texten är fortfarande tydligt läsbar och det blev inget överlapp. Bakgrunden
behålls **endast som granskningsförslag**, inte som kundgodkänd design.
Fotots begränsade upplösning är mindre märkbar under den mörka överlagringen.

## Slutlig verifiering

| Kontroll | Resultat / belägg |
| --- | --- |
| Astro/TypeScript | PASS, 75 filer, 0 fel/varningar/hints (`final-check.log`) |
| ESLint | PASS (`final-lint.log`) |
| Node-kontraktstester | 41/41 PASS (`node-tests.log`) |
| Astro build | PASS, 32 statiska sidor (`final-build.log`) |
| HTML, noindex, canonical, landmarks, sitemap, oförändrade URL:er | PASS (`html-check.log` och `verify-url-migration-draft.mjs`) |
| Browser för innehållsbilder | 20/20 sid-/breddkombinationer, inklusive mobilmenyn (`content-only/*-REPORT.json`) |
| Browser efter bakgrundstest | Tälthallar 5/5; övriga tre sidors oförändrade efterbilder återanvänds (`after/`) |
| Extra kontroll av alla fyra slutliga sidor | 16/16 i 320/390/768/1440 px; oförändrad synlig text och byggd Header/Hero/Footer, inga browserundantag (`acceptance.json`) |
| Bildladdning och dimensioner | Alla pilotbilder laddar, har `srcset`, `sizes`, lazy loading och dimensioner; höjden är reserverad före avkodning (`acceptance.json`) |
| Horisontell scroll | Ingen i de kontrollerade bredderna; även bildytornas verkliga gränser kontrollerade |
| Bakgrundskontrast | Minst **4,76:1** för sektionens textfärger över ett teoretiskt helt vitt bildparti under 80 % overlay; över 4,5:1 även för liten text (`acceptance.json`) |
| Original och skyddade delar | Alla 29 originalbilder byte-identiska med startcommit. Paketfiler, public, server, config, layouter, workflows och legacy-material oförändrade (`preservation-and-assets.json`) |
| Git | `git diff --check` PASS. Städgrenen kvar på `ef7a886`, AMP-002 kvar på `5198c3a` |

Den extra browserkontrollen jämför byggd HTML före/efter, eftersom Headerns
meny- och scrolltillstånd ändras vid körning. Tillfälliga Astro-scopeattribut
normaliseras vid jämförelsen. Alla befintliga synliga sidtexter är bevarade.
Kontrollerna motsvarar inte en full skärmläsargranskning eller test på fysisk mobil.
Ingen Lighthouse-poäng eller fullständig CLS-mätning påstås.

Extern preview granskades före ändring. **Ingen granskning efter deployment är
gjord, eftersom uppdraget uttryckligen förbjuder deployment.** Slutgranskningen
gäller det lokala bygget. Noindex och avstängd offertmottagning är kvar.

## Öppna lokalt och granska

Från den verifierade projektmappen:

```powershell
cd C:\webbprojekt\hallpartner-cleanup-20261103
npm.cmd run dev -- --host 127.0.0.1 --port 4321
```

Öppna serverns angivna adress (normalt `http://127.0.0.1:4321/`) och sedan:

- `/` – Ridhus-kortet under halltyperna.
- `/stalhallar/lagerhall/#varuflode`.
- `/stalhallar/maskinhall/#korvagar`.
- `/stalhallar/talthall/#talthall-utforande` och `#talthall-anvandning`.

För samma statiska bygge som skärmbilderna: `npm.cmd run build`, därefter
`npm.cmd run preview -- --host 127.0.0.1 --port 4321` i stället för dev.
Granskningsservern som användes under arbetet stoppas efter avslutade kontroller.
Skärmbildsöversikten `visual-review/image-pilot-01/index.html` går att öppna
direkt som lokal fil utan server.

Lokala ändringscommits:

- `c34fcca` – de fyra innehållsbilderna, delad bildlayout, granskningsstöd och första rapporten.
- `0ece57be8eda56b85e6698f3e8fda72f131f1f63` – **enbart bakgrundstestet** på Tälthallar.
- En efterföljande dokumentationscommit slutför denna rapport.

Om bakgrunden väljs bort i nästa uppdrag kan just `0ece57b` återställas med
en vanlig revert; övriga bilder behöver inte tas bort. Ingen återställning görs nu.
Ingen push, merge, Inleed-/Vercel-publicering, GO-LIVE eller konsolidering till
originalmappen har gjorts. Ingen fil i originalmappens arbetsyta har ändrats.

## Bildproblem och förbättringar, prioriterat

1. Verifiera användningsrätt och proveniens med Hallpartner före kundpublicering,
   inklusive ryttaren, synliga fordonsregistreringar och leverantörsmärkning.
2. Ersätt lagerbilden med ett godkänt högupplöst original när det finns. Nuvarande
   original är 590 × 394 px; visningsbredden begränsas till 590 px. På skärmar med
   hög pixeltäthet blir bilden mindre skarp. Ingen AI-uppskalning gjordes.
3. Bedöm om Tälthallars dekorativa bakgrund ger tillräcklig nytta jämfört med
   den lugnare enfärgade sektionen; jämförelsen är separat från innehållsbilderna.
4. Fotografiet på maskinhallen visar en arbetsmiljö med flera detaljer. Det förklarar
   utrymme men ska inte behandlas som en rekommenderad planlösning eller säkerhetslösning.

## Möjliga AI-bilder, endast förslag

| Prioritet | Sida/sektion | Motiv och typ | Varför befintligt foto inte räcker |
| --- | --- | --- | --- |
| 1 | Maskinhallar, körvägar | Principskiss ovanifrån med maskin, port, vändyta och rörelsepilar, utan tekniska mått | Fotografiet visar volym men inte hela rörelseförloppet. En tydligt märkt konceptskiss kan förklara planeringsfrågorna. |
| 2 | Lagerhallar, varuflöde | Schematisk illustration av inleverans, förvaring och utleverans | Portfotot visar tillträde men inte hur gods passerar olika funktioner. |
| 3 | Tälthallar, utförande | Enkel principiell illustration av stomme, duk och öppning | Fotografierna visar färdiga hallar, inte delarnas relation. Måste märkas som principskiss, inte leverantörskonstruktion. |

AI lämpar sig här för pedagogiska koncept som kan granskas och korrigeras, inte
för påhittade referensfoton. En manuellt ritad SVG kan vara ännu tydligare för
enkla flöden. Inga AI-bilder har genererats.
