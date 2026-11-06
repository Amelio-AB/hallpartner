> **Senaste helgcheckpointen (2026-11-06):** [Hallundersidor, AI-bilder, Om Hallpartner och releaseöverlämning](docs/checkpoints/2026-11-06-helg-hallar-bilder-omoss.md). [Prompt för nästa agent](docs/checkpoints/2026-11-06-overlamningsprompt.md). Flera äldre beskrivningar nedan av inaktiv offertguide, antal rutter och Draft PR #22 är **historiska**. Använd verifierad `main`-HEAD, release-PR och Actions som nulägeskälla.

# Hallpartner webbplats

Kodbas för Hallpartners statiska Astro-webbplats. `main` är ordinarie
utvecklingsbas. Bildpiloterna och AMP-006 ingår redan genom PR #12;
de ska inte kopieras in eller mergas igen från gamla arbetsgrenar.
Denna konsolidering kopplar AMP-002 till de riktiga sidorna och tar bort
de publika prototyp-/presentationsrutterna.

**En ordinarie lokal arbetsmapp: `C:\webbprojekt\hallpartner`.**
Skapa inte nya cleanup-/review-mappar, kloner eller worktrees för vanligt
utvecklingsarbete. Läs [AGENTS.md](AGENTS.md) och kontrollera aktuell
Git-status innan du byter gren, hämtar ändringar eller installerar paket.
Säkerhetskopior utanför arbetsmappen ska bevaras, inte blandas ihop med
aktiva arbetsytor.

## Aktuell offertguide på Draft-PR #22

På den öppna Draft-grenen är `/offert/` en sexstegsarbetskandidat med **fem frågesteg plus automatisk granskning**. Alla verkliga offertinskick och filuppladdningar är avstängda. Läs [specifikationen för frågorna och öppna kundbeslut](docs/content/HALLPARTNER_OFFERTGUIDE_V2.md). Publicerad `main`-preview ska inte antas visa arbetsgrenen.

## Lokal start

Använd **Node.js 24**. Privat `@amelio/web-platform` är låst till
`2bde176de3509c2ceb4c1bebdf2e69c48120e4d9` (privat plattformskälla 1.5.0; AMP-002 Spacious).
Se [integrationsgranskningen](docs/AMP_002_HEADER_REVIEW.md) för källjämförelse,
bevarade AMP-produkter, browserkontroller och före-/efterbilder. Ingen ny paketrelease skapas.
Git-inloggningen behöver läsåtkomst; använd befintlig Credential Manager.
Lägg inga tokens i filer, kommandon eller Git-URL:er.

Kontrollera först att rätt repo/branch är öppnad och att eventuellt lokalt
arbete är identifierat. Följande installerar och startar den utcheckade
versionen; det gör ingen pull, merge, radering eller publicering:

```powershell
cd C:\webbprojekt\hallpartner
git status --short --branch
node --version
npm.cmd ci --ignore-scripts --no-audit --no-fund
npm.cmd run dev
```

`npm.cmd` fungerar även när PowerShell blockerar `npm.ps1`.
Öppna serverns utskrivna URL, normalt **http://localhost:4321/**.
Det är den riktiga startsidan. Inga separata publika prototypsidor behövs.

| Kommando | Syfte |
| --- | --- |
| `npm.cmd run dev` | Lokal utveckling; genererar AMP-Footer först |
| `npm.cmd run build` | Statiskt bygge till `dist/`, ingen uppladdning |
| `npm.cmd run preview` | Visa statiskt bygge lokalt |
| `npm.cmd run check` | Astro och TypeScript |
| `npm.cmd run lint` | ESLint |
| `node --experimental-strip-types --test tests/*.test.mjs` | Alla Node-kontraktstester |
| `php tests/lead-receiver.test.php` | Lokal PHP-validering utan SMTP |
| `node scripts/verify-hallpartner-draft.mjs` | Tretton riktiga HTML-sidor, länkar, noindex och sitemap |
| `node scripts/verify-url-migration-draft.mjs` | URL-karta mot färdigt bygge |
| `npm.cmd run format` | Prettier; undvik onödig helrepoformatering |

PHP behöver en separat lokal runtime. Full kandidatvalidering finns i
`.github/workflows/preview-validation.yml`. Det äldre filnamnet
`hallpartner-draft.yml` innehåller endast den kompletterande kontrollen
av uttrycklig Footer-rollback; det bygger inte någon prototypwebbplats.

## Aktiv webbplats

| Område | Användning |
| --- | --- |
| `src/pages/index.astro` | Startsida på `/` |
| `src/pages/stalhallar/` | Hallöversikt och sex hallundersidor |
| `src/pages/kontakt/`, `om-oss/`, `sa-gar-det-till/`, `offert/`, `404.astro` | Övriga avsedda besökarsidor; formulär avstängda |
| `src/layouts/HallpartnerSiteLayout.astro` | Gemensamt HTML-skal med metadata, Header och AMP-003 Footer |
| `src/components/SiteHeader.astro` | Riktig AMP-002 och serverrenderad reservnavigation |
| `src/components/home/HallpartnerHome.astro` | Startsida/Hero, flyttad ur den gamla prototypmappen |
| `src/components/ExpandableImageCards.astro`, `ImageGallery.astro` | Godkända bildkort och galleri |
| `src/components/ContactForm.astro` | Avstängt kontaktformulär |
| `src/styles/hallpartner-*.css` | Den använda webbplatsens sid- och komponentstilar |
| `src/config/` | Header, Footer, offertguide och varumärkesinställningar |
| `src/assets/images/`, `public/images/` | Använda bilder och bevarat källmaterial |
| `server/lead/`, `public/api/lead.php` | Inaktiv PHP-mottagare; ingår inte i statiskt publiceringspaket |
| `scripts/`, `tests/` | Paketgenerering, kontrakt och Chrome-granskning av riktiga sidor |
| `config/preview-*.json`, `scripts/preview/` | Commitbundet publiceringspaket, bildgodkännanden och målspärrar |

Alla tretton avsedda HTML-filer definieras i `scripts/preview/policy.mjs`.
Tester stoppar bygget om andra HTML-rutter tillkommer. `/prototype/`,
`/projekt/`, `/roadmap/`, `/vision/` och `/workshop/` byggs inte längre.

Bilder, galleri, AMP-006 och paketversioner bevaras av konsolideringen.
CSS-klassnamn med `hp-draft` används fortfarande av den godkända designen;
de är inte separata demosidor och ska inte raderas utifrån namnet.
Git-historik och historiska dokument är bevarade.

## Aktuell dokumentation och historik

Börja med [AGENTS.md](AGENTS.md) och
[konsolideringscheckpointen](docs/checkpoints/2026-11-04-site-consolidation.md).
Där finns den filvisa borttagnings-/flyttlistan och gränsen mot lokal
städning och serverfiler. Kontrollera aktuell PR/HEAD och Actions; dokumentet
påstår inte att en viss version redan är mergad eller publicerad.

[Footer-integrationen](docs/AMP_003_FOOTER_INTEGRATION.md),
[lead-mottagaren](docs/LEAD_RECEIVER_INTEGRATION.md),
[SMTP-checkpointen](docs/checkpoints/2026-11-02-smtp-pending.md) och
[kalkylatorbeslutet](docs/checkpoints/2026-11-02-calculator-paused.md)
är relevanta underlag. Kalkylatorn är fortsatt pausad.

`docs/AMP_002_HEADER_REVIEW.md`, `docs/LOCAL_VISUAL_REVIEW.md`,
`docs/LOCAL_WORKSPACE_CLEANUP.md` och tidigare integrationsrapporter
beskriver äldre steg. Deras instruktioner om cleanup-mappar och offentliga
prototypvyer gäller inte längre. De bevaras som historik, inte som dagens
arbetsorder eller bevis för lokal Git-status.

[URL-inventeringen](docs/migration/URL_INVENTORY_2026-11-02.md) är underlag
utan aktiva redirects. Äldre visionsspecifikationer är inte en aktuell
karta över implementerade sidor. Leverantörsbilder och AI-koncept får inte
presenteras som utförda Hallpartner-referensprojekt.

## Preview och gränser

Beslutad utvecklingsadress: **https://hallpartner-se.preview2.inleed.com/**
på Amelios befintliga Inleed-konto. Inga nya stagingdomäner eller DNS-ändringar
ingår. Kundens befintliga WordPress ligger enligt Andreas på annat webbhotell.
Kundens framtida separata Inleed-konto ingår inte i utvecklingsautomatiken.

Alla besökarsidor behåller `noindex,nofollow`. Det statiska
publiceringspaketet blockerar crawling i robots.txt och innehåller ingen
sitemap, PHP-mottagare, intern Markdown eller prototypsida.

Inleeds domänomskrivning i previewn är bekräftad. Den befintliga
publiceringskoden behöver skilja exakt FTPS-original från den specifikt
verifierade HTTPS-omskrivningen. Mål och registrerade bilder är redan
beslutade; nya allmänna tillstånd eller en ny miljö behövs inte.

Workflow `deploy-production.yml` (ID 316932905) är det befintliga
publiceringsflödet för utvecklingspreview från `main`. Kontrollera verklig
workflowstatus och att publicerad commit faktiskt överensstämmer med `main`;
PR-körningar får inte publicera. En godkänd build är inget publiceringsbevis.
[Publiceringsprocessen](docs/preview/README.md) innehåller historiska
inventeringar som måste kontrolleras igen före skrivning.

Att ta bort en källroute avpublicerar inte en gammal FTP-kopia. Sådan
städning kräver färsk filinventering, privat råbackup och exakt godkänd
raderingslista. Skyddsfiler som `.htaccess` är inte demos. Inga serverfiler
raderas automatiskt och ingen lokal mapp får tas bort med generell force.
