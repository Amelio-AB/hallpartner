# Hallpartner webbplats

Kodbas för Hallpartners nya Astro-webbplats. Senaste utvecklingsgren:
`feature/hallpartner-v1-skeleton-20261031`, [Draft PR #5](https://github.com/Amelio-AB/hallpartner/pull/5).
Gamla `main` är inte den senaste webbplatsen. Kontrollera aktuell GitHub-HEAD;
PR-beskrivningen innehåller äldre historiska SHA-värden.

Lokal konsolidering 2026-11-03 finns på `chore/local-workspace-cleanup-20261103`.
Se [städrapporten](docs/LOCAL_WORKSPACE_CLEANUP.md) för backup och verifiering.
Läs [AGENTS.md](AGENTS.md) före ändringar.

## Lokal start

Använd **Node.js 24**. Privat `@amelio/web-platform` är oförändrat låst till
`a11811bfbf51416e7fe7d58aed4551be77914d65` (1.1.0).
Git-inloggningen behöver läsåtkomst; använd befintlig Credential Manager.
Lägg inga tokens i filer, kommandon eller Git-URL:er.

```powershell
cd C:\webbprojekt\hallpartner-cleanup-20261103
node --version
npm.cmd ci --ignore-scripts --no-audit --no-fund
npm.cmd run dev
```

`npm.cmd` fungerar även när PowerShell blockerar `npm.ps1`.
Öppna serverns utskrivna URL, normalt **http://localhost:4321/**.
Det är den nya startsidan; `/prototype/` innehåller separata referenssidor.
Kör inte pull eller installation i den gamla smutsiga mappen som genväg.

| Kommando | Syfte |
| --- | --- |
| `npm.cmd run dev` | Lokal utveckling; genererar AMP-Footer först |
| `npm.cmd run build` | Statiskt bygge till `dist/`, ingen uppladdning |
| `npm.cmd run preview` | Visa statiskt bygge lokalt |
| `npm.cmd run check` | Astro och TypeScript |
| `npm.cmd run lint` | ESLint |
| `node --experimental-strip-types --test tests/*.test.mjs` | Alla Node-kontraktstester |
| `php tests/lead-receiver.test.php` | Lokal PHP-validering utan SMTP |
| `node --experimental-strip-types scripts/verify-hallpartner-draft.mjs` | Byggd HTML, länkar, noindex och sitemap |
| `node scripts/verify-url-migration-draft.mjs` | URL-karta mot färdigt bygge |
| `npm.cmd run format` | Prettier; undvik onödig helrepoformatering |

PHP behöver en separat lokal runtime. Fulla teststeg finns i
`.github/workflows/hallpartner-draft.yml`.
[Visuell granskning](docs/LOCAL_VISUAL_REVIEW.md) beskriver mobil/desktop.

## Aktiv webbplats och historiskt material

| Område | Användning |
| --- | --- |
| `src/pages/index.astro` | Aktiv startsida på `/` |
| `src/pages/stalhallar/` | Hallöversikt och sex hallundersidor |
| `src/pages/kontakt/`, `om-oss/`, `sa-gar-det-till/`, `offert/`, `404.astro` | Besöksrutter under utveckling; formulär avstängda |
| `src/layouts/HallpartnerSiteLayout.astro` | Besökarsidornas ingång till det delade skalet |
| `src/layouts/HallpartnerDraftLayout.astro` | Aktiv Header och AMP-003 Footer i site-läge; äldre Footer i prototypläge |
| `src/components/prototype/HallpartnerHomePrototype.astro` | Aktiv startsida/Hero **och** prototyp; namnet betyder inte oanvänd kod |
| `src/components/ContactForm.astro` | Avstängt kontaktformulär |
| `src/styles/hallpartner-*.css` | Sid- och skalstilar, delvis gemensamma för prototyper och besökarsidor |
| `src/config/` | Footer, offertguide, prototypdata, Direction 02 och headergranskning |
| `src/pages/prototype/` | Visuella referenser och AMP-granskning som används i tester |
| `src/pages/projekt/`, `vision/`, `roadmap/`, `workshop/` | Äldre presentation; direktadresser finns kvar, utanför sitemap |
| `BaseLayout.astro`, äldre komponenter, `src/data/`, `src/types/`, generell CSS | Beroenden till den bevarade presentationen |
| `src/assets/images/`, `public/` | Använda bilder och bevarat originalmaterial; rättigheter kräver separat granskning |
| `server/lead/`, `public/api/lead.php` | Inaktiv PHP-mottagare; privata filer/vendor får inte publiceras med webbplatsen |
| `scripts/`, `tests/` | AMP-generering, kontrakt, HTML-/URL-kontroller och Chrome-granskning |
| `.github/workflows/` | CI och befintliga driftflöden, oförändrade av städningen |

Astros standardstruktur behålls. Aktiv Header, Hero, Footer, kundtexter och rutter
har inte ändrats av städningen. AMP-paketets kod och revision är oförändrade.

## Dokumentation

Utgå från [AGENTS.md](AGENTS.md), [städrapporten](docs/LOCAL_WORKSPACE_CLEANUP.md),
[Footer-integrationen](docs/AMP_003_FOOTER_INTEGRATION.md),
[headergranskningen](docs/AMP_002_HEADER_REVIEW.md),
[lead-mottagaren](docs/LEAD_RECEIVER_INTEGRATION.md),
[SMTP-checkpointen](docs/checkpoints/2026-11-02-smtp-pending.md) och
[kalkylatorbeslutet](docs/checkpoints/2026-11-02-calculator-paused.md).

[URL-inventeringen](docs/migration/URL_INVENTORY_2026-11-02.md) och
[äldre rutter](docs/404_AND_LEGACY_ROUTES_REVIEW.md) är underlag utan aktiva redirects.
`PROJECT_BRIEF.md`, `PAGE_SPEC.md`, `CONTENT.md`, `SITEMAP.md`,
`COMPONENTS.md` och `DESIGN_SYSTEM.md` i `docs/` beskriver äldre visionsmaterial;
de är inte en aktuell karta över implementerade sidor.
Daterade migreringsrapporter är historik, inte bevis för dagens HEAD.

## Preview och gränser

Extern preview: **https://hallpartner-se.preview2.inleed.com/**.
Den är en granskningsyta, inte ett facit eller bevis för att aktuell Draft-HEAD
är publicerad. Granska berörda sidor före UI-ändringar och efter separat godkänd deployment.

Alla sidor behåller `noindex,nofollow`. Canonical/sitemap använder
`https://hallpartner.se`; det ändrar inte DNS eller hosting.
Historiska rutter, prototyper, 404 och offertguiden är undantagna från sitemap.

`deploy-production.yml` kan göra **riktig FTP-upload** vid push till `main`
eller manuell körning. Remote target är `./`, utan `--delete`.
Kör inte workflowet för lokal verifiering. Dess äldre Node-/installationskonfiguration
hanteras i ett separat uppdrag.

Lokal städning omfattar ingen push, merge, deployment, GO-LIVE, DNS-/FTP-ändring,
ändring av secrets, formuläraktivering eller SMTP.
Arkivbranchen `archive/vision-site-2026-10-02` lämnas orörd.
