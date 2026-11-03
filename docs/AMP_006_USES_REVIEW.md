# AMP-006 på Stålhallar – granskningspilot

Datum: 2026-11-03. Endast lokal utveckling och Draft-PR, ingen publicering.

## Leverans och avgränsning

Bildgrenens oförändrade HEAD `94ef3246b9b76ae95516ec03eba1a063d6aa65ea` är uppladdad i
[Draft-PR #10](https://github.com/Amelio-AB/hallpartner/pull/10), mot
`feature/hallpartner-v1-skeleton-20261031` (`db0d81082cf8ad4438ec830675e6107801ebacf3`).
Den innehåller tidigare lokal städning och båda bildpiloterna, med deras kvarstående beslut.

AMP-006 utvecklas separat på `feature/hallpartner-amp006-uses-20261103`, direkt från
bildgrenens HEAD. Dess PR ska ha bildgrenen som bas. Originalmappen
`C:\webbprojekt\hallpartner` och dess lokala ändringar är orörda.

Endast de tre korten i `/stalhallar/#anvandningsomraden` är ersatta. Befintlig H2,
ingress, ankare, övriga sektioner, Header, Hero, kontaktvägar och noindex bevaras.
Kortbeskrivningarna är kortade för tydliga introduktioner; fördjupningen ligger på
befintliga undersidor. Ingen aktivering av formulär eller global redesign.

## Källa och integration

- `@amelio/web-platform` **1.4.0**, exakt Git-SHA
  `fec9ca01b3c0d4bc9002fa21832a51cf51009749`.
- [Officiell AMP-006-dokumentation](https://github.com/Amelio-AB/amelio-web-platform/blob/fec9ca01b3c0d4bc9002fa21832a51cf51009749/docs/products/expandable-card-grid/README.md)
  och [Astro-exempel](https://github.com/Amelio-AB/amelio-web-platform/blob/fec9ca01b3c0d4bc9002fa21832a51cf51009749/examples/expandable-card-grid/consumer.astro).
- `ExpandableImageCards.astro` är en typad adapter för Astro-bilder. Publika
  `renderExpandableCardGrid`, `enhanceExpandableCardGrid` och paketets `style.css`
  äger markup, beteende och layout. Ingen AVAB-kod eller AMP-kärna kopierad/ändrad.
- Unikt ID `stalhallar-use-cards`, ingen intern sektions-/grupprubrik, `headingLevel: 3`.
- Tre jämnstora desktopkort; aktivt kort 2fr och övriga 1fr. Kategori/rubrik alltid
  synliga, beskrivning/CTA vid expansion. Hela kortet är en vanlig länk.
- Plattformens 3/2/1-kolumnslayout, touchläge, fokusprioritet, reducerade rörelse
  och fullständiga HTML-fallback används utan egen interaktionskod.
- Endast dokumenterade CSS-variabler i `hallpartner-expandable-cards.css`:
  grönsvart overlay, vit text, accent `#B5D9B9`, 14 px radie, 410 px minhöjd desktop,
  390 px minhöjd mobil/surfplatta. Innehållet får växa utan klippning.

Paket och låsfil uppgraderades med behörig `npm.cmd install --save-exact` på Node
24.19.0 / npm 11.17.0. Låsfilen är npm-genererad, med faktisk integritet och exakt
resolved Git-SHA. Inga andra paketversioner ändrades. Footer-konfigurationens
versionskontroll gäller nu plattformspaket 1.4.0 enligt principen i PR #7.
Själva AMP-003-koden är oförändrad mellan dessa källrevisioner; genererad Footer-CSS
är byte-identisk före/efter (SHA256 `3fe91f93e887a231fcc05c61902d7b712ad105be0a6b0fb65c7b2b959677f7b7`).

## Bilder och rättigheter

Alla original under `src/assets/images/legacy/` är oförändrade.

| Kort | Bild | Visuellt motiv och urval |
| --- | --- | --- |
| Lagerhallar | `Lagertalt-1536x1023.jpg` | Flygbild med två hallar, lastytor och staplat gods. Vald efter faktisk bildgranskning; pilotens 590 px portfoto visar en tom byggnad och är sämre lämpat för detta kort. |
| Maskinhallar | `bygga-maskinhall.jpeg` | Stor maskin och lastbil inomhus. Återanvänd från bildpilot 1 och 2. |
| Ridhus | `H191567f7ad934fb6aa6520bd8eeeac08N-e1773849628844.jpg` | Ridbana, ljusinsläpp och ryttare. Återanvänd från bildpilot 1 och 2. |

Alt-texterna beskriver motiv, aldrig påstådda Hallpartner-projekt. **Användningsrätt,
proveniens, person-/fordonsdetaljer och leverantörsmärkning är fortfarande
obekräftade. Ingen kundpublicering är godkänd.** Inventeringens UNVERIFIED ändras inte.

Astro `getImage` genererar WebP, dimensioner, `srcset` och `sizes`; AMP renderar
lazy loading och async decoding. Bildkandidater kapas vid originalbredden.
`sizes` tar även hänsyn till den bredd som behövs för en hög `object-fit: cover`-
beskärning. Centrum vid 65 % av höjden behåller hall/maskin/ridbana i smala lägen.
Motiven har granskats både smala och expanderade; inga nya bilder har genererats.

## Granskning och tester

Extern preview granskades före ändring på 320, 390, 768, 1280 och 1440 px.
Bra: tydlig hierarki, färgprofil, kontaktvägar och mobilstapling. Svagt: de tidigare
textkorten saknade motiv som snabbt skiljer användningarna åt. Previewn innehåller
inte bildgrenens senaste lokala Hero/galleri och används därför inte som exakt baseline.

Slutgranskningen gäller lokalt statiskt bygge i riktig installerad Google Chrome
(headless/CDP), inte simulerad CSS. Projektets browseranslutning var otillgänglig;
befintlig Chrome-testmetod återanvändes. Skärmbilderna är också visuellt granskade.

| Kontroll | Resultat |
| --- | --- |
| Astro/TypeScript | PASS, 0 fel, 0 varningar. En befintlig hint i ignorerad `visual-review/image-pilot-01/verify-pilot.mjs`. |
| ESLint och Astro build | PASS; 32 sidor. |
| Befintliga Node-kontraktstester | 41/41 PASS, inklusive AMP-003. |
| Byggd HTML och URL-regression | PASS: noindex, canonical, rubriker, ankare, Footer, länkar och inaktiva formulär. |
| Chrome 320/390/768/1280/1440 | PASS: tre optimerade bilder laddar, H2/H3, inga överlapp eller horisontell scroll. |
| Desktop hover | PASS för vart och ett av tre kort på båda desktopbredderna: 2:1, stabil radhöjd, läsbara detaljer. |
| Tangentbord | PASS: Tab, synlig fokusram, omedelbar expansion, fokus före hover och Enter till korrekt undersida. |
| Touch | PASS: alla tre länkar öppnas med ett tryck på 320/390/768; även bred coarse-pointer-vy visar innehåll direkt. |
| Reducerad rörelse / utan JS | PASS: inga övergångar/zoom i reducerat läge; alla texter och länkar finns utan JS. |
| Kontrast | Minst 4,5:1 för synlig text i testade normala/expanderade lägen, konservativt mot vitt foto under aktuell overlay. Normal-/mobillägenas lägsta beräknade värde är 6,40:1. |
| Header och Hero | Pixelidentiska med sparat tidigare bygge på samtliga fem bredder. |
| Footer | Samma text/källkod/CSS; desktop- och surfplattebilder identiska. Mobilbilder har små raster-/positionsskillnader och påstås inte vara pixelidentiska. Standardläge och explicit legacy-fallback bygger och klarar HTML-kontrollen. |

`npm ci` och samtliga relevanta kontroller körs på den slutliga commiten före push;
PR-beskrivningen anger exakt SHA och utfallet. Lokala slutloggar och rapportens
commit-ID ligger i `visual-review/amp006/`. Tidiga testproblem gällde QA-harnessen:
Chrome kräver minst en maxTouchPoint även vid avstängd emulering, och mätningen
måste invänta avslutade övergångar. Dessa rättades utan att ändra AMP-kärnan.

Chrome-fångst utanför viewporten kan trigga plattformens storleksmätning och ge en
missvisande expansionsbild. Desktopbilder fångas därför i verklig viewport;
expansionsbilderna visar fokusläge med samma 2:1-layout som verifierad hover.

Fysisk iPhone/Android, Safari/Firefox och skärmläsare är inte testade. Detta är ingen
full WCAG-certifiering. Vid 768 px är den bevarade sektionsrubriken smal och får
flera rader; det ligger utanför kortbytet och är kvar för separat bedömning.

## Skärmbilder

Versionshanterade, beständiga granskningsfiler finns i `docs/reviews/amp006/`:

- [1440 px normal](reviews/amp006/1440-normal.png)
- [1440 px Lagerhallar expanderat](reviews/amp006/1440-expanded-0.png)
- [1440 px Maskinhallar expanderat](reviews/amp006/1440-expanded-1.png)
- [1440 px Ridhus expanderat](reviews/amp006/1440-expanded-2.png)
- [1280 px Maskinhallar expanderat](reviews/amp006/1280-expanded-1.png)
- [390 px normal, allt innehåll synligt](reviews/amp006/390-normal.png)
- [390 px fokus, fortsatt statisk layout](reviews/amp006/390-focus-static.png)
- [320 px](reviews/amp006/320-normal.png), [768 px](reviews/amp006/768-normal.png)

På mobil finns inget separat stängt/expanderat läge: innehållet är öppet direkt.
Fokusbilden dokumenterar det avsiktliga beteendet, inte en påhittad mobilanimation.
Alla övriga skärmbilder, live-before, baseline, loggar och JSON finns lokalt i
`C:\webbprojekt\hallpartner-cleanup-20261103\visual-review\amp006\`.

## Öppna och reproducera lokalt

```powershell
cd C:\webbprojekt\hallpartner-cleanup-20261103
git switch feature/hallpartner-amp006-uses-20261103
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 4322
```

Öppna serverns angivna adress och `/stalhallar/#anvandningsomraden`.
4321 var upptagen under arbetet; använd alltid porten Astro skriver ut.
Behörighet till det privata AMP-repot behövs vid ny installation.
För samma statiska bygge som testerna: `npm.cmd run build` och sedan
`npm.cmd run preview -- --host 127.0.0.1 --port 4322`.

```powershell
$env:HP_CHROME='C:\Program Files\Google\Chrome\Application\chrome.exe'
$env:HP_PREVIEW_URL='http://127.0.0.1:4322/stalhallar/'
node scripts/verify-hallpartner-amp006.mjs
```

Valfri `HP_BASELINE_URL` pekar på sparat tidigare bygge för Header/Hero/Footer-
jämförelsen. `HP_SCREENSHOT_DIR` väljer rapportmapp. Ordinarie regression finns
också i `scripts/capture-hallpartner-home.mjs`.

## Publiceringsgräns och kvarstående beslut

FTP-workflowet kör vid main-push eller manuell workflow_dispatch. Dessa feature-
grenar och stackade Draft-PR:er matchar inte det villkoret. Inga workflows, secrets,
DNS, main eller arkivgrenar har ändrats. Ingen merge eller workflow_dispatch.

De befintliga CI-triggerfiltren omfattar inte dessa stackade PR-baser. Dessutom har
äldre draft-workflow en hårdkodad AMP 1.1.0-kontroll. Ingen grön Actions-körning
påstås; workflowet lämnas orört enligt uppdraget. Före eventuell framtida
integrering krävs separat hantering av det CI-kontraktet.

Ingen granskning efter deployment är gjord eftersom deployment uttryckligen är
förbjuden. Andreas visuella godkännande och bildrättigheter återstår före lansering.