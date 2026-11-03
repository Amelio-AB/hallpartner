# Lokal städning och konsolidering – 2026-11-03

## Fortsätt här

- Arbetsmapp: `C:\webbprojekt\hallpartner-cleanup-20261103`.
- Lokal branch: `chore/local-workspace-cleanup-20261103`.
- Utgångspunkt: `db0d81082cf8ad4438ec830675e6107801ebacf3`, aktuell HEAD för
  `feature/hallpartner-v1-skeleton-20261031` och Draft PR #5 vid kontrollen.
- Städningen sparas som lokal commit på denna branch. Se `git log -1` för dess SHA.
- Ingen push, ny PR, merge eller deployment ingår.

Den gamla mappen `C:\webbprojekt\hallpartner` är avsiktligt oförändrad.
Den är inte den aktuella rena utvecklingsmiljön. Arbeta vidare i worktreen ovan.
Se [README](../README.md) för installation, struktur och kommandon.

## Ursprungligt läge och skydd

`git fetch origin --prune` genomfördes. Lokal utvecklingsbranch stod på
`746b8f7317fba81fcd8ecf34f1779a36f9f064c8`: **40 commits efter**, inga egna commits
framför aktuell GitHub-gren. Endast en registrerad worktree fanns från början.
GitHub-connectorn bekräftade PR #5:s aktuella head, öppen Draft och ej mergad.
Gamla `main` användes inte som utvecklingsbas.

Två ändrade paketfiler innehöll en äldre lokal AMP-installation (revision
`763d2b1...`). Sex ospårade filer fanns:

- `docs/00_Handlingsplan_salja_fler_hallar.docx`
- `docs/Hallpartner_Beslutsunderlag_Peter_Jimmy.docx`
- `public/images/logo_black.png`
- `public/images/logo_white.png`
- `src/assets/images/legacy/hallpartner-logotype-light-1536x922.png`
- `src/pages/prototype/amp/signature.astro`

De har inte lagts in automatiskt i nya webbplatsen. Paketfilerna krockar med
senaste grenens avsiktligt låsta AMP-version; därför skapades en separat worktree.
`server/lead/` saknades i gamla checkouten men finns komplett i nya worktreen,
tillsammans med bland annat ny Footer, offertpilot och URL-inventering.

**Verifierad backup:** `C:\webbprojekt\hallpartner-backup-20261103-065543`.

- `files/`: alla åtta ändrade/ospårade filer, med ursprungliga relativa sökvägar.
- `manifest.json`: SHA256 per fil; både backup och original kontrollerade.
- `local-changes.patch`: binär Git-diff mot ursprunglig HEAD.
- `repository.bundle`: samtliga befintliga Git-refs och nåbar historik före städning.
- `git-status.txt`, `original-head.txt`: utgångsläge.
- `baseline-dist/`: orört bygge från senaste GitHub-HEAD, för jämförelse.

De enda Git-ignorerade katalogerna i gamla mappen var `node_modules/`,
`.astro/` och `dist/`. Dessa regenererbara filer kopierades inte till filbackupen.
Inga privata miljöfiler påträffades i inventeringen. Inga lösenord lästes eller
visades. Befintlig Git-autentisering användes utan export av credentials.

## Borttaget och ändrat

Nio filer togs bort efter kontroll av importer och referenser i spårad kod,
tester, skript och workflows samt genomläsning av filerna:

| Fil | Belägg |
| --- | --- |
| `src/components/ConversationPrompt.astro` | Inga kodreferenser |
| `src/components/CustomerJourney.astro` | Inga kodreferenser |
| `src/components/CustomerQuestions.astro` | Inga kodreferenser |
| `src/components/Hero.astro` | Oanvänd äldre Hero; aktiv Hero ligger i HallpartnerHomePrototype |
| `src/components/OpportunitySection.astro` | Inga importörer |
| `src/components/InternalLinkCard.astro` | Enda importören var oanvänd OpportunitySection |
| `src/components/ResultsGrid.astro` | Endast historisk dokumentation hänvisade till den |
| `src/components/StatementSection.astro` | Endast historisk dokumentation hänvisade till den |
| `src/layouts/PresentationLayout.astro` | Ingen route eller komponent importerade layouten |

Deras lokala CSS försvann med filerna. Inga fristående CSS-filer togs bort:
alla hade kvarvarande importörer. Ingen dynamisk komponentinläsning hittades.
Historiken finns kvar i Git och i backupens bundle.

Övriga ändringar:

- Paketnamn `hallpartner-vision-site` → `hallpartner-site` i paketmanifest och
  låsfilens två rotfält. Beroenden, versioner, integritetshashar och AMP-revision
  är exakt oförändrade.
- `.gitignore`: alla lokala `.env.*` (exempel undantas), `.npmrc`,
  `visual-review/`, `*.tsbuildinfo` och `server/lead/rates/`.
  Befintligt skydd för privat config, vendor och AMP-generering behålls.
- `.prettierignore`: genererade och privata lokala filer undantas från massformatering.
- `scripts/verify-hallpartner-draft.mjs`: ett befintligt Windows-fel rättades.
  `new URL(...).pathname` gav `\C:\...`; `fileURLToPath` ger korrekt lokal
  sökväg även på Windows. Kontrollens assertions ändrades inte.
- `scripts/prepare-amp-footer.mjs`: endast inaktuell kommentar rättades;
  AMP-003 är redan standard och legacy är ett uttryckligt alternativ.
- README och lokal granskningsguide visar nu riktiga startsidan, aktiv struktur,
  Node 24, rätt paketåtkomst och avstängda formulär.
- Äldre komponent-/designspecifikationer är märkta som visionshistorik.
  AI-/teknikdokumentens felaktiga påstående om enbart FTP dry-run är korrigerat.
- Fyra media-README-filer pekar inte längre på borttagna aktiva komponenter.

Inga filer flyttades och inga aktiva komponenter döptes om. Ingen ny källkodsmapp
skapades; Astros struktur behölls.

## Medvetet bevarat

| Område | Varför |
| --- | --- |
| `src/components/prototype/` | Startsidan använder HallpartnerHomePrototype; övriga komponenter används av granskningsrutter |
| HallpartnerSiteLayout och HallpartnerDraftLayout | Delat aktivt skal och prototypstöd; Header/Hero/Footer ska bevaras |
| `/prototype/` | Referensarbete och befintliga regressionstester |
| `/projekt/`, `/vision/`, `/roadmap/`, `/workshop/` | Kvarvarande direktadresser och dokumenterat beslut att inte radera/redirecta utan separat inventering |
| BaseLayout, Header, Footer och äldre generella CSS-filer | Används av historiska rutter; de är inte aktiva webbplatsens motsvarigheter |
| `src/data/` och `src/types/` | Delad historisk data och typer; exportvis trimning ger liten nytta och större granskningsyta |
| Alla bilder, logotyper och tomma mediamappar med README | Proveniens och rättigheter är inte slutligt utredda |
| `server/lead/`, API, formulär och `src/config/` | Del av senaste fungerande utvecklingsversionen; förblir inaktiva |
| Samtliga tests och workflows | Behövs för verifiering; driftkonfiguration ligger utanför lokal städning |
| Gamla branches och arkivbranch | Historik bevaras utan ändringar |
| Lokala DOCX/logotyper/signaturprototyp | Användararbete bevarat i originalmapp och backup; ingen automatisk innehållsimport |

SHA256-inventeringen fann fyra bildpar med identiskt innehåll. De **behölls**:

- `legacy/Lagarhall-med-eneklplat.jpg` och `legacy/lagerhall-med-enkelplat.jpg`
- de två `legacy/Ridhall-med-eneklplat-och-ljusinslapp-1536x1152*.jpg`
- `legacy/maskinhall_bygga.jpeg` och `src/assets/images/maskinhall.jpeg`
- `legacy/talthallar.jpg` och `src/assets/images/talthall.jpg`

De två sistnämnda paren knyter originalmaterial till använda bilder.
Legacy-mappens instruktion att bevara originalnamn och proveniens gäller fortsatt.

## Verifiering

| Kontroll | Resultat |
| --- | --- |
| Ren installation med låsfil, Node 24.19.0 / npm 11.17.0 | PASS |
| Astro/TypeScript efter borttagning, 73 kontrollerade filer | 0 fel, 0 varningar, 0 hints |
| ESLint, inklusive ändrade skript efter Windows-fix | PASS |
| Samtliga Node-kontraktstester | 41/41 PASS |
| Astro build | PASS, 32 sidor |
| Byggd HTML, interna länkar/ankare, landmarks, noindex, sitemap | PASS |
| URL-migrationskarta och inaktiva offert-/kontaktflöden | PASS |
| PHP 8.3.36: mottagarens validerings-/rate-limit-test | PASS |
| PHP-syntax: publik bootstrap, validator, receiver, exempelconfig, smtp-smoke | PASS |
| SMTP-skript utan sändflagga | Avbryter korrekt, inget mejl skickat |
| Lokal HTTP POST utan privat config | 503 med status failed, inget skickat |
| Chrome: startsida, prototypstartsida, hallöversikt, Kontakt, Offert och 404 | PASS på 320/390/768/1280/1440 px, 30 sidvyer |
| Git-ignore för genererat/privat och undantag för config-exempel | PASS |
| Kontroll av paketlås och originalfiler mot backup | PASS |
| `git diff --check` | PASS |

PHP saknades i PATH. En portabel PHP 8.3.36 från
[officiella PHP-nedladdningen](https://www.php.net/downloads.php?os=windows&version=8.3)
hämtades till temporär mapp och arkivets publicerade SHA256 kontrollerades före körning.
Ingen PHP-installation, PATH-ändring, SMTP-konfiguration eller serveranslutning gjordes.

**Byggjämförelse:** 75 filer i både före- och efterbygge; alla 32 HTML-filer samt
CSS, JavaScript, bilder, API-bootstrap och XML är byte för byte identiska.
Endast fyra kopierade media-README-filer skiljer sig. Det styrker att städningen
inte ändrar Header, Hero, Footer, sidor, innehåll, länkar eller funktion.

Screenshots/JSON finns i den nya worktreens ignorerade `visual-review/`.
Startsidan granskades visuellt från verkliga Chrome-bilder på mobil och desktop:
logotyp, typografi, kort, Hero och Footer finns kvar utan överlapp eller overflow.
Befintliga bildrättighets-/kundinnehållsfrågor lämnas till separat arbete.

**Verifieringsgräns:** extern preview öppnades inte framgångsrikt. Inbyggd
webbläsaranslutning saknades och Computer Use stoppades eftersom verktyget inte
kunde fastställa aktuell URL säkert. Ingen fortsatt UI-automation utfördes.
Lokal headless-testning och granskning av testbilder genomfördes separat.
Ingen fysisk mobil eller full skärmläsargranskning utfördes. Ingen deployment
gjordes, så ingen granskning efter deployment påstås.

## Arbetsläge efter leverans

Den nya worktreen ska användas för fortsatt utveckling; städändringarna sparas
i en lokal commit och Git-status kontrolleras efteråt. Originalmappen är fortfarande
40 commits efter och har sina åtta bevarade lokala filer. Det är avsiktligt,
inte en misslyckad synkning.

Privata AMP-paketet, noindex, formulärspärrar, secrets, main, arkivbranch, DNS,
FTP, Inleed och Vercel har inte ändrats. Det här är en konsoliderad lokal
utvecklingsmiljö, inte ett lanseringsgodkännande.
