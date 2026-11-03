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
- `review-sheets/`: sammanställningar för visuell granskning.
- `baseline-dist/`: orört lokalt startbygge för innehålls- och skaljämförelse.

Filnamn: `{home|lagerhall|maskinhall|talthall}-{mobile-320|mobile|tablet-768|desktop-1280|desktop}-full.png`.
Sektionsbilder har sektions-ID i stället för `full`, exempelvis
`talthall-desktop-talthall-anvandning.png`. JSON-rapporter ligger i samma katalog.
Samma viewport, höjd och skärmfaktor används i före- och efterbilderna.

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

Bakgrundstestet görs i en separat efterföljande commit. Slutresultat och
slutlig verifiering kompletteras efter den jämförelsen.

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
