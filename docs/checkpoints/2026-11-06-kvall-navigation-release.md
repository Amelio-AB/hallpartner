# Hallpartner – kvällscheckpoint 6 november 2026

**Omfattning:** arbete efter den första helgcheckpointen, med särskilt fokus på split-hero, AMP-002, SVG-ikoner, breadcrumb och megameny. Detta dokument är en **tidsstämplad avstämning**, inte automatiskt bevis på aktuell deployment.

## 1. GitHub och releasekedja

| Leverans | Status vid avstämningen | Källor |
|---|---|---|
| PR #39 – sex hallundersidor, bildpilot, Om Hallpartner | Mergad `f855a02631dbca5d52da703d3abc0a8ea2e2db63`; godkänd CI och Inleed-publicering | [PR #39](https://github.com/Amelio-AB/hallpartner/pull/39) |
| PR #40 – split-hero och inga synliga AI-skyltar | Mergad `77d1b12652a6b05117939f5dd21dbbdd53774ea5`; godkänd och publicerad till Inleed | [PR #40](https://github.com/Amelio-AB/hallpartner/pull/40) |
| PR #42 – AMP-002 Spacious Navigation | Mergad `ca83b8f8053c7447983a14c155028397deb03ec5`; `publish` success i [körning #42274396804](https://github.com/Amelio-AB/hallpartner/actions/runs/42274396804) | [PR #42](https://github.com/Amelio-AB/hallpartner/pull/42) |
| Sex hallikoner | Incheckade på `main` i `15a607f24f088c75f69dab71a765c576a3e4ed88` | `public/icons/halls/` |
| PR #43 – globala breadcrumbs, megameny, borttagen Startsida | **Visuellt godkänd och releasegodkänd av Andreas, men ej mergad vid sista kontrollen.** Senaste HEAD `4fcd587f818dfd0f0fc94dd309d7f1bfd23664f3`. | [PR #43](https://github.com/Amelio-AB/hallpartner/pull/43) |

**Senast verifierat `main`:** `15a607f24f088c75f69dab71a765c576a3e4ed88`.

**PR #43 kontroller på exakt HEAD `4fcd587`:** CI [#42290034124](https://github.com/Amelio-AB/hallpartner/actions/runs/42290034124), Footer [#42290034179](https://github.com/Amelio-AB/hallpartner/actions/runs/42290034179) och Release tooling (Linux + Windows) [#42290034088](https://github.com/Amelio-AB/hallpartner/actions/runs/42290034088) **SUCCESS**. Fullständig [Preview candidate #42290034192](https://github.com/Amelio-AB/hallpartner/actions/runs/42290034192) **IN_PROGRESS** vid sista kontrollen. Avvakta dess faktiska slutstatus och eventuella kommentarer innan merge. Inga generella testundantag.

En gammal previewmarkör `f855a02` lästes tidigare under pågående publicering. PR #42:s utredning visade att markören byttes och att 88 statiska filer + 15 cacheförbikopplade sidor senare matchade `77d1b12`. Använd ny bevisning för varje följande release; detta gamla bevis verifierar inte PR #43.

## 2. Designbeslut – godkänt av Andreas

**Hallundersidornas hero:** Gemensam 50/50 split-layout. Textpanelen till vänster har mörkgrön gradient med diskreta variationer per halltyp; hallbilden till höger. **Ingen bildfade** och **ingen synlig AI-bildskylt**. På mobil visas texten först och sedan bilden. Sex WebP-konceptbilder finns i `public/images/halls/`; de får inte beskrivas som utförda Hallpartner-projekt eller som licensmässigt slutgodkända kundproduktioner.

**AMP-002:** `classic-mega-menu` med `navigationAppearance: 'spacious'`. Respektera AMP:s native öppning/fokus/tangentbord/mobilmeny och plattformspinne. Ändra inte plattformspaketet för Hallpartners lokala styling.

**PR #43-design:** Alla **13 sidor med breadcrumb** ska få gemensam bakgrund `#153129` kant till kant med ljus text, medan innehållet är i centrerad rail. Menyvalet `Startsida` försvinner från Header men logo och breadcrumbs länkar fortfarande hem. Hallar-megamenyn visar sex redan versionerade SVG-ikoner, varje länks beskrivning och mindre mellanrum. Hoveralternativ **C**: en tunn grön linje animeras från vänster till höger på 240 ms (samma kurva som i AMP-002:s Header), ingen stor färgad hoverplatta. Tangentbordsfokus/reduced-motion bevaras. Andreas har granskat och godkänt detta visuellt i chatten och gett separat klartecken att mergea och publicera efter godkända tester.

**Ikonfiler:** `lagerhall.svg`, `maskinhall.svg`, `ridhus.svg`, `plathall.svg`, `isolerad-hall.svg`, `talthall.svg` under `public/icons/halls/`. Grön `#4E7A5B`. Ridhus har hästhuvud, isolerad hall snöflinga, tälthall bågtak med port. PR #43 registrerar hashbundet preview-godkännande i `config/preview-image-rights.json` och dokumenterar ursprung i `docs/preview/hallpartner-hall-icons-approval-20261106.md`.

## 3. Favicon och releasegräns

En **sen separat favicon-commit** `9bcb8ed2` lades till i PR #43 efter de första godkända testerna. Den lade in `public/favicon.png` och angav felaktigt `image/svg+xml` som MIME i layouts. Den blev blockerad av bildrättighetsgrinden (PNG saknade SHA-godkännande). Commit `1675a016` återställde de tre ändringarna, men bevarade historiken. Git-trädet vid `1675a016` är exakt samma som vid den tidigare godkända `e9c48b75`: `4c720d5bc9fc652449d4811047f0be4fcea8bc6f`. Faviconen ingår **inte** i godkänd PR #43-release. Ny separat PR behövs om den ska tas vidare.

Ett återkommande Windows-test för syntetisk Chrome-fixture gav ibland `Chrome startup deadline exceeded` i stället för förväntad tidig exit vid 1500 ms. PR #43 HEAD `4fcd587` ger endast exit/ready-fixturen 8000 ms och behåller hängtestets 1500 ms samt samma assertions. Release tooling på Linux/Windows blev gröna; ingen verifieringsgrind för faktisk browser/site sänktes.

## 4. TODO-inventering och framtida prioritet

**Viktigt:** `docs/TODO.md` och `docs/PROJECT_DECISIONS.md` finns i öppen **Draft-PR #2**, inte på `main`. De innehåller äldre statusar (t.ex. AMP-integration och offertmottagning) som inte får tolkas som nuläge. TODO **HP-050** och **HP-051** fångar kundens önskemål från 6 november om totalentreprenad/myndighetskontakter samt en verklig steg-för-steg-kundresa.

**Efter verifierad PR #43-publicering föreslås denna ordning:**

1. **Kundens sakunderlag för totalentreprenad (högsta nyttan):** bekräfta leveransomfattning, ansvar/avtal, bygglovsarbete/kommunrelation, mark/grund, installationer, garantier och försäkring med Peter/Jimmy. Relevanta TODO: HP-009, 010, 011, 015, 050. Undvik påståenden om att myndigheter alltid godkänner eller att allt ingår oavsett projekt.
2. **Säljflöde och innehåll:** granska `/sa-gar-det-till/` mot verklig kundprocess och `/offert/` samt CTA-vägar. Inventera vad som faktiskt återstår från HP-005, HP-012, HP-029–031, HP-051 – flera gamla TODO-statusar är historiska.
3. **Företagsfakta och bilder:** riktiga referenshallar, korrekt licens/bildursprung, porträtt/kontaktuppgifter och fotografering (HP-017, 018, 046).
4. **Dokumentation och GitHub-städning:** [Issue #41](https://github.com/Amelio-AB/hallpartner/issues/41) dokumenterar cirka 40 grenar och äldre Draft-PR:er vid inventeringen. Bevara unikt arbete i PR #2, #4, #6 och #9 innan eventuell stängning; ingen branchradering utan explicit separat godkännande.

Övriga tidigare idéer (header-sökning, symbol i Footer) kan vänta. En gammal kalkylator/leverantörspris-/köpfunktion ingår inte i v1. AMP-001 skickar enbart enligt senaste verifierade preview-policy, inte till kundens produktionsmottagare.

**Tillgänglighet:** PR #42 dokumenterade en redan befintlig brist där startsidans hero-copy kan klippas vid 200 % text på mycket smal vy; följ upp separat utan att återöppna godkänd Header-design. Testa alltid minst mobil, desktop och textförstoring på kritiska ändringar.

## 5. Konkreta återupptagssteg

1. Läs [uppdaterad överlämningsprompt](2026-11-06-overlamningsprompt.md), den här checkpointen, `AGENTS.md` och `README.md`.
2. Läs senaste `main`, [PR #43](https://github.com/Amelio-AB/hallpartner/pull/43) och Actions; om PR fortfarande väntar: slutför kontroller/merge/publiceringsverifiering inom redan godkänt scope, annars rapportera blockeraren. Inga uppdiktade tidslöften eller bakgrundsarbeten.
3. Kör läsande `git status -sb` i `C:\webbprojekt\hallpartner`. Under kvällsarbetet låg `public/icons/halls/README.txt` tidigare ospårad lokalt. Anta inte att den finns kvar, och radera inte okända filer. Skydda arbetsmappen före branchbyte.
4. När Inleed har rätt version: dokumentera release-SHA, grön Actions-URL och faktisk verifiering i PR #43. **Börja därefter med kundens verifieringsfrågor**, inte fler mikrojusteringar i navigationen.
5. Låt dokumentations-PR:n för denna kvällscheckpoint vara separat från releasekoden. Dokumentet får inte i sig trigga publicering.

**Källprincip:** Datum och checkpoint är inte releasebevis. Aktuella GitHub Actions och kontrollerade filer/svar har alltid företräde.
