# Granskning av åtta lokala filer 2026-11-04

**Rekommendation: integrera denna granskningsrapport; överför ingen av de åtta råfilerna direkt till main.** Paketfilerna är ersatta av nyare, säkrare versioner. DOCX-filerna är historiska kundarbetsunderlag. Logotyperna kräver filval och verifierad användningsrätt. Signaturprototypen är tekniskt användbar men behöver ett separat integrationsbeslut.

Detta är ett konkret filurval för Andreas granskning, inte ett beslut att kasta bort material. Alla åtta original och backupfiler finns kvar oförändrade. [Inventeringen med SHA-256](inventory.json) binder varje bedömning till exakt granskad fil. Ingen av råfilerna har ett tillräckligt motiverat och godkänt direkt integrationsbehov nu.

## Bas och skydd av pågående arbete

- Ursprunglig bas enligt uppdraget: `47068c9a9855e0d1c11edc5e6cad68b886b3ca37`. Under granskningen mergades PR #13 av annat arbete. Granskningsgrenen uppdaterades till senaste origin/main: **`22cd2ad0d29b1e5485f0cae5bfdf53b758996880`**. Ingen merge utfördes av detta arbete.
- Ny worktree: `C:\webbprojekt\hallpartner-local-review-20261104`, branch `feature/hallpartner-local-assets-review-20261104`.
- Original: `C:\webbprojekt\hallpartner`, kvar på `746b8f7317fba81fcd8ecf34f1779a36f9f064c8` med samma två modifierade och sex ospårade filer.
- Backup: `C:\webbprojekt\hallpartner-local-backup-20261103-204934`. Alla åtta SHA-256 matchade originalet vid inventeringen.
- De två tidigare separata worktrees för integration och preview var rena och lämnas orörda. PR #13, dess branch och publiceringsarbete ändras inte här.
- Ingen reset, clean, stash, checkout eller installation i originalmappen. Originalets indexhash och status sparades för slutlig jämförelse. Ingen merge, deployment, FTP eller formuläraktivering.

## Filvis urval

| Lokal fil | Med i denna PR? | Bedömning och föreslaget beslut |
| --- | --- | --- |
| `package.json` | Nej | Äldre appnamn, Node-krav och AMP/Astro; saknar aktuella Footer-skript. Ingen unik nödvändig ändring saknas i main. |
| `package-lock.json` | Nej | Återför äldre Astro/Sharp/Vite och AMP. Ingen partiell lockfilsöverföring. |
| `docs/00_Handlingsplan_salja_fler_hallar.docx` | Nej | Historiskt mötes-/prioriteringsunderlag från 2 oktober. Bevara i kundens dokumentarkiv; återanvänd relevanta frågor i befintliga register. |
| `docs/Hallpartner_Beslutsunderlag_Peter_Jimmy.docx` | Nej | 36 obesvarade kundfrågor från oktober. Användbar workshopmall, inte beslutade fakta eller aktuell byggspecifikation. Aktualisera inför ny utsändning. |
| `public/images/logo_black.png` | Nej | Bästa lokala kandidaten för mörk full logotyp på ljus bakgrund. Föreslås för senare godkännande av källa, rättighet och användning. |
| `public/images/logo_white.png` | Nej | Ljus full logotyp för mörka ytor. Möjlig komplettering, men stor rasterfil och inget nytt behov i befintlig Header/Footer. |
| `src/assets/images/legacy/hallpartner-logotype-light-1536x922.png` | Nej | Äldre svart logotyp på vit bakgrund, felaktigt dimensions-/färgnamn och lägre upplösning. Bevara som källreferens, inte webbleverans. |
| `src/pages/prototype/amp/signature.astro` | Nej | AMP-002 + AMP-004 fungerar med AMP 1.4.0. Bevara som jämförelseunderlag för separat godkänd komponentuppgift. |

## Paketjämförelse

| Låst paket | Lokalt original | Main som behålls |
| --- | --- | --- |
| Astro | 7.1.3 | **7.3.3** |
| Sharp | 0.35.3 | **0.35.5** |
| Vite | 8.1.5 | **8.3.5** |
| Amelio Web Platform | 1.2.0 / `763d2b1eb3ed73788bc9adf1f157a15575ba521e` | **1.4.0 / `fec9ca01b3c0d4bc9002fa21832a51cf51009749`** |

Hela package.json jämfördes semantiskt. Originalets `hallpartner-vision-site` och Node `>=22.12.0` är äldre än mains `hallpartner-site` och `>=24`. Main har även predev/prebuild för AMP Footer och test:footer. Övriga deklarerade beroenden/scripts tillför inget som saknas. Lockfilernas 126 olika paketposter ska inte sammanfogas manuellt. Inga dependency-, override- eller auditpolicyändringar görs.

## DOCX innehåll och informationshantering

Handlingsplanen behandlar leveransomfattning, kundprioritering, referenser, verifierbara påståenden, kort offertstart och säljuppföljning. Föreslagen återkoppling samma arbetsdag är en rekommendation, inte ett kundgodkänt löfte. Säljrutinen och mätningen av vunna/förlorade affärer är användbara diskussionspunkter men ska inte beskrivas som införda processer.

Beslutsunderlaget har 36 tomma svarsfält om affärsmål, leverans, ansvar, kontakt, referens-/bildrätt, erfarenhet och offertfrågor. Det nämner prisexempel, tiostegsflöde och att design/implementation ska följa senare. Detta är historisk kontext. Nuvarande v1 har redan utvecklats och omfattar en kort, inaktiv AMP-001-guide utan automatiska priser eller extern konfigurator. Frågorna får inte upphäva AGENTS.md eller checkpointen 2026-11-02.

**Kontrollerat:** hela texten inklusive tabeller, headers/footers, docProps, custom XML, relationer och miniatyrbilder. Inga ifyllda svar, lösenord/token, kommentarer, spårade ändringar, dolda textruns, makron, inbäddade bilagor eller externa paketrelationer hittades. Företags- och mottagarnamn förekommer; dokumenten är inte anonyma. Framtida svar kan innehålla affärskänsliga uppgifter, kundprojekt och personuppgifter och bör hanteras i en åtkomststyrd kundmapp, inte automatiskt i Git.

Metadata: författare python-docx respektive Amelio AB, generiska skapad/ändrad-datum från 2013 och missvisande sidantal 1. Dessa metadata bevisar inte verkligt datum eller författarprocess. Miniatyrbilderna är tomma. Dokumentens fotrader anger oktober 2026. Granskningen avser innehåll/OOXML; ingen sidlayoutgodkänning lämnas eftersom den bundlade dokumentmiljön saknar LibreOffice. Originalen har inte öppnats för redigering eller sparats om.

### Överlapp utan konkurrerande specifikation

| Tema | Befintlig dokumentation | Slutsats |
| --- | --- | --- |
| Kort offertguide, inga automatiska priser/extern konfigurator | [Checkpoint på main](../../checkpoints/2026-11-02-calculator-paused.md), AGENTS.md; HPD-005/008/010 i PR #2 | Nyare scope styr. |
| Företag, erfarenhet, återkoppling, referenser och rättigheter | TODO HP-015/017/018/020/032 i [Draft PR #2](https://github.com/Amelio-AB/hallpartner/pull/2) | Följ upp befintliga uppgifter; skapa inte ett andra beslutsregister. |
| Sidor, erbjudande och bildinsamling | WEBSITE_PLAN.md, IMAGE_PLAN.md, PHOTO_SHOT_LIST.md i [Draft PR #4](https://github.com/Amelio-AB/hallpartner/pull/4) | Betydande sakligt överlapp, inte påstådda ordagranna dubbletter. |
| Detaljerat offertflöde | [OFFERTFLODE.md på main](../../OFFERTFLODE.md), nyare checkpoint och AMP-001-arbetsguide | De tio stegen är inte ett nytt integrationskrav. |

PR #2 och #4 är **öppna Draft-PR:er, inte dokument som redan finns på main**. Jämförelsen använde revisionerna `54f175c24a28153316dbdd6944cf91a810a4af38` respektive `bdc1c38145d2b3a41d20a446d5b9d7e0bf3cc537`. Kundsvaren finns inte i DOCX-underlagen. Särskilt säljrutin/KPI-frågorna kan återanvändas vid nästa workshop efter aktualitetsgranskning, utan en ny styrande specifikation här.

## Logotyper

| Fil | Verkliga mått / storlek | Kvalitet och tänkt användning |
| --- | --- | --- |
| logo_black.png | 1618 × 972; 263 778 byte | Svart symbol, ordmärke och slogan på transparent bakgrund. Tydlig på ljus bakgrund i Chrome. Kandidat för full logotyp, inte direkt ersättare för smal Header-logotyp. |
| logo_white.png | 1536 × 1024; 1 167 022 byte | Vit motsvarighet med transparens. Tydlig på mörk bakgrund, men stor fil och mycket luft. Alla synliga pixlar är delvis transparenta; kontrollera mot avsedd bakgrund före export. |
| hallpartner-logotype-light-1536x922.png | **1150 × 688**; 99 490 byte | Svart motiv på helt ogenomskinlig vit bakgrund trots alfakanal. Tunn mörk kant överst. Namnet light/1536x922 beskriver inte den faktiska bilden. |

Samma visuella logotypfamilj, men **inga exakta filduplikat** sinsemellan eller mot någon spårad bild i mains public/src/assets. Befintliga `public/images/logo_text_white.png` är en smal ordlogotyp på 1536 × 274 som används av besökar-Header, AMP-Header och AMP-Footer. Den är inte en exakt pixelbeskärning av den lokala vita filen; säker härkomst kan inte härledas enbart ur likheten. Befintliga `hallpartner-logo.png` är ytterligare en separat bred variant. Befintliga val ändras inte.

Inga käll-/licensuppgifter eller filspecifika godkännanden hittades för de tre lokala filerna. Teknisk kvalitet bevisar inte rätt varumärkesoriginal eller publicerings-/bearbetningsrätt. HPD-015 kräver rätt logotyp och rättighetskontroll. HP-049 i PR #2 efterfrågar senare återanvändning av symbolen i Footer/undersidor men godkänner inte automatiskt dessa filer.

**Förslag:** Andreas bekräftar i första hand logo_black.png som källkandidat och begär helst kundens vektororiginal. Vit variant behövs bara om en mörk yta ska visa hela märket. Efter rättighetsbesked kan optimerade filer få namn som `hallpartner-logo-stacked-dark.png` / `hallpartner-logo-stacked-light.png` i `src/assets/brand/`. Separat symbolfil väljs i HP-049-arbetet. Bevara råoriginal externt. Ingen omdöpning, beskärning eller ny bildimport ingår här.

## Signaturprototypens funktion och framtid

Den nya komponentmöjligheten är AMP-004 Signature Hero; AMP-002 har redan tre jämförelsevyer på main. Prototypen använder publika Signature Hero/Header-exporter och CSS samt befintliga hero-/logotypfiler. Den behöver ingen äldre AMP-pin och använder inte de tre ospårade logotyperna.

En byteidentisk testkopia byggdes isolerat med Node 24/AMP 1.4.0: Astro check 0 fel/varningar/hints, lyckad build. Chrome vid 320/390/768/1280/1440 px: en monterad Header, en H1, noindex/nofollow, dold reservheader efter montering, laddade bilder, ingen horisontell overflow, menyöppning/Escape och fria ankarmål. Utan JavaScript syns reservnavigationens fem länkar och serverrenderad Hero. Inga formulär eller fångade JS-undantag. [Resultat per bredd](signature-browser.json). Mobil-/desktopskärmbilder granskades lokalt.

Detta är en begränsad kompatibilitets-/interaktionskontroll, inte full tillgänglighetscertifiering eller publiceringsgodkännande. Före senare integration behöver följande hanteras:

- Egna färger/typografi och separat enkel Footer behöver anpassas till mains brand-konfiguration och AMP-003.
- Länkar lämnar arbetsmiljön för hallpartner.se och navigationen täcker bara delar av aktuell struktur.
- CSS skriver över interna `.hm`-/`.ah-signature`-klasser; jämför med plattformens stabila kontrakt.
- Tillfällig Hero-bild och logotyp har inte fått nya rättighetsgodkännanden genom testet.
- `pagehide` förstör Header-instansen utan explicit `pageshow`-återställning. Bakåt/framåt-cache behöver regression; detta är en kodidentifierad risk, inte ett reproducerat fel här.
- Noindex/sitemap-exkludering förhindrar inte att en Astro-route byggs och kan laddas upp. Ingen ny route läggs därför in, och PR #13:s filtrering ändras inte.

Bevara original/backup för en separat AMP-004-jämförelse när Andreas vill utvärdera ny Hero. Återanvänd konfiguration/komponenter från main då; ersätt inte automatiskt nuvarande Header/Hero/Footer.

## Verifiering och föreslaget godkännande

PR:n innehåller endast denna rapport, inventerings-JSON och browserresultat-JSON. Inga råfiler, hemligheter, app- eller workflowändringar. Tillfälliga analyskopior, bilder, Chrome-profiler och testverktyg ligger utanför Git i uppgiftens TEMP-katalog. Originalfiler, status, HEAD, index och backuphashar jämförs igen före överlämning.

Lokalt: riktig npm ci med oförändrad lockfil; check 0 fel/varningar/hints; lint; **53/53 Node-regressioner**; build **32 sidor**; isolerad prototypgranskning ovan. Npm audit: **0 kritiska/höga, 9 måttliga** i redan dokumenterad minimatch-kedja från PR #12. Inget audit-undantag införs. Slutlig commit och dokumentkontroller redovisas i Draft-PR-beskrivningen.

**GitHub CI – kompletterande verifiering 2026-11-04:** Den ursprungliga dokumentationscommiten använde `[skip ci]` eftersom uppdraget då förbjöd även läsande FTPS-kontroller. Andreas har därefter uttryckligen godkänt att arbetet slutförs. Den här dokumentationsändringen initierar därför ordinarie PR-kontroller, inklusive `preview-validation.yml`:s befintliga **läsande** FTPS-/HTTPS-kontroll. Inget publiceringsworkflow aktiveras, ingen FTP-uppladdning sker och inga workflows, regler eller säkerhetsgränser ändras. CI-resultatet för den nya HEAD:en måste verifieras i GitHub innan merge; det är inte ett förhandsgodkännande. [GitHubs dokumentation om överhoppade körningar](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs).

**Godkänn nu:** rapporten och att behålla mains beroenden. **Möjliga senare godkännanden:** svarta logotypen som verifierad källa, vid behov vita motsvarigheten, och separat AMP-004-jämförelse. **Lämna utanför direktintegration:** gamla paketfiler, DOCX-binärer, legacy-logotyp och oförändrad signaturroute. Detta ändrar inte bevarandet av original/backup.
