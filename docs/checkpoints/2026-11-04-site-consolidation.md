# Konsolidering av den riktiga webbplatsen – 2026-11-04

## Uppdrag och verifierad bas

Andreas begärde att bildpiloterna och AMP-002 skulle finnas tillsammans på den riktiga webbplatsen, utan publika prototyper/demos och utan fler lokala arbetsmappar. Den granskade main-basen var `477f982509236ef299180a33727882437d0c15de`. På denna bas använde den riktiga webbplatsen fortfarande den handskrivna menyn i HallpartnerDraftLayout. PR #7, HEAD `f0fda2360d9bc3c2aee5a5e1b34a86dacdfbdca6`, implementerade endast en isolerad menygranskning.

## Denna ändring

- Behåller main-basens bildfiler, bildpiloter, galleri och AMP-006. Paketfiler och låst AMP 1.4.0 ändras inte.
- Flyttar den använda startsidan från `components/prototype/HallpartnerHomePrototype.astro` till `components/home/HallpartnerHome.astro`. Bara den tidigare `site`-varianten finns kvar; besökarnas innehåll och bildval bevaras.
- Gör HallpartnerSiteLayout till det enda besökarskalet och ansluter riktig AMP-002 via SiteHeader, `classic-mega-menu` och `mobileToggleAppearance: 'icon'`. Menydata/tema från den tidigare integrationen återanvänds. Ingen äldre paketlåsfil eller CI-version från PR #7 kopieras.
- Bevarar fungerande serverrenderad navigation när JavaScript saknas. AMP äger meny-/dialogbeteendet. AMP-003 Footer och dess uttryckliga rollback bevaras.
- Tar bort aktiva källrutter för prototype, projekt, roadmap, vision och workshop. Endast de tretton avsedda HTML-sidorna får byggas.
- Retargeterar tester till verkliga besökarsidor och kräver att de borttagna rutterna inte byggs. Preview-valideringen behåller Node/PHP, audit, payload/rättighetskontroll och Chrome. Det äldre dubblerande draft-workflowet behåller endast sin unika Footer-rollbackkontroll.

## Filvis borttagning/flytt i denna PR

Git-historiken bevarar samtliga tidigare källversioner. Den exakta granskbara listan finns i PR-diffen, inte i en generell namnmatchande raderingsregel.

- `src/pages/prototype/amp/header/index.astro`
- `src/pages/prototype/amp/header/mega/index.astro`
- `src/pages/prototype/amp/header/solid/index.astro`
- `src/pages/prototype/hallpartner/[slug].astro`
- `src/pages/prototype/hallpartner/hallar.astro`
- `src/pages/prototype/hallpartner/index.astro`
- `src/pages/prototype/hallpartner/lagerhallar.astro`
- `src/pages/prototype/hallpartner/maskinhallar.astro`
- `src/pages/prototype/hallpartner/start.astro`
- `src/pages/projekt/index.astro`
- `src/pages/roadmap/index.astro`
- `src/pages/vision/index.astro`
- `src/pages/workshop/index.astro`
- `src/components/prototype/HallpartnerAmpHeaderReview.astro` – adapterbeteendet flyttat till riktig SiteHeader.
- `src/components/prototype/HallpartnerHomePrototype.astro` – besöksinnehållet flyttat till HallpartnerHome.
- `src/components/prototype/HallpartnerHallOverview.astro`
- `src/components/prototype/HallpartnerMachineHall.astro`
- `src/components/prototype/HallpartnerStorageHall.astro`
- `src/layouts/HallpartnerDraftLayout.astro` – besökarskalet ersatt av HallpartnerSiteLayout.
- `src/config/hallpartner-draft-pages.ts`
- `src/styles/hallpartner-amp-header-review.css` – använd menyadapterstil flyttad till hallpartner-amp-header.css.
- `tests/hallpartner-draft.test.mjs` – ersatt av tester för de riktiga besökarsidorna; kontroller som krävde prototyper pensioneras.

Befintliga CSS-klasser med `hp-draft` är kompatibilitetsnamn för den använda designen, inte egna demosidor. Historiska rapporter och Git-historik raderas inte för att ordet prototype förekommer där. Privata källunderlag och säkerhetskopior lämnas orörda.

## Verifiering och återstående gränser

En skriven ändring är inte ett testresultat. PR:ens exakta HEAD och aktuella Actions-resultat ska avgöra teststatus. Visuell granskning av riktig Header tillsammans med godkänt bildinnehåll krävs före merge. Denna text påstår varken merge, publicering eller lokalt rent arbetsträd.

Ingen Windows-mapp, annan branch, FTP-fil, workflowaktivering, secret eller DNS ändras av denna PR. Den enda ordinarie lokala arbetsmappen är fortsatt `C:\webbprojekt\hallpartner`; Codex måste kontrollera och uppdatera den befintliga arbetsmappen. Ingen ny clone/worktree behövs.

Att radera en källroute tar inte bort dess gamla FTP-kopia. Serverinventering, skyddad råbackup och exakt godkänd FTP-städlista krävs innan sådan avpublicering. `.htaccess` och `cgi-bin` är inte demos.

Previewpublicering är en separat kvarvarande leverans: befintlig FTPS/HTTPS-kontroll måste hantera Inleeds bekräftade domänomskrivning. Mål och bildanvändning är redan beslutade. Inga nya miljöer eller DNS-ändringar behövs. Äldre instruktioner att behålla publika prototyper eller behandla Header #7 som globalt installerad ersätts av denna verifierade kodstruktur.
