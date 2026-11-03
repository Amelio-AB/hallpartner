# Automatisk Inleed-preview – implementation och aktivering

Status 2026-11-03: **redo för kodgranskning, inte godkänd för aktivering/publicering**. Arbetet är stackat på PR #12, bas `ff1ea21d36a0a636fa1bd0e35a514758f99bc7a1`. Varken PR #12 eller denna PR har mergats av detta arbete. Workflow-ID **316932905 förblir disabled_manually**.

## Miljöer

| Miljö | Roll |
| --- | --- |
| main | Ordinarie utvecklingsbas efter godkänd merge av PR #12. Nuvarande gamla main får inte publiceras. |
| https://hallpartner-se.preview2.inleed.com | Utvecklings- och kundgranskningspreview. Uppdateras automatiskt först efter aktivering och passerade kontroller. |
| https://hallpartner.se (även www) | Kundens befintliga/framtida produktion. Inget publiceringsmål i detta workflow. |
| Kundens framtida Inleed-konto | Separat, skapas av Andreas för slutlig lansering. En godkänd dist levereras separat; inga automatiska credentials/triggers till detta konto. |

## Workflows och exakta byggresultat

`.github/workflows/deploy-production.yml` ersätter samma gamla fil och workflow-ID. Nytt namn: **Hallpartner Inleed development preview**. Triggers: push på main och workflow_dispatch. Publiceringsskriptet avvisar andra ref/event/repository även vid manuell körning. Ingen PR-trigger finns i publiceringsworkflowet.

`preview-validation.yml` är både PR-validering (main eller integrationsgrenen) och återanvändbar workflow_call. Den installerar exakt lockfil med Node 24, tillfällig GIT_ASKPASS och befintlig AMELIO_PLATFORM_READ_TOKEN, utan beständiga token-URL:er. AMP-manifest/version/käll-SHA verifieras. Token finns bara i installationssteget. Build-/teststeg får ingen FTP-hemlighet. Inga secrets ändras av denna implementation.

Valideringen kör check, lint, alla Node-/PHP-regressioner, npm-audit på den oförändrade high-gränsen, Composer-audit, build, HTML/URL-kontrakt, statisk payload-validering och Chrome mot **själva uppladdningspaketet** (13 sidor × 5 bredder, AMP-006 och galleri). Befintliga CI-, AMP- och fulla draft-workflows utökas med integrationsgrenen som PR-bas; deras tester behålls. Två befintliga vänteloopar får ShellCheck-kompatibel syntax med oförändrat antal försök. Chrome-starten får 30 sekunders tidsgräns, kontroll av tidig processdöd och sparad stderr-diagnostik; sid- och interaktionskraven är oförändrade. Full draft-validation testar även interna Header-prototyper som inte publiceras.

Actionlint 1.7.12 laddas från officiell release med hårdkodad SHA-256. ShellCheck granskar shellskripten. Återanvändbara JS/YAML-parsers kommer från befintliga låsta Astro-beroenden; inga nya npm-paket eller plattformsversioner införs.

Payload/evidence artifacts innehåller exakt checkout-SHA och run_attempt. Publiceringsjobbet hämtar endast artifacts från **samma workflow-körning**, verifierar filernas SHA-256 och bygger inte om. Gamla PR #5-artifacts används aldrig.

## Statiskt innehåll och bildrättigheter

`scripts/preview/payload.mjs` går igenom faktisk dist och kopierar endast 13 explicit tillåtna publika HTML-filer och deras använda CSS/JS/bild/font-resurser. Inline-modulimporter, srcset och CSS-url följs. Saknade resurser, oväntade externa ursprung, aktivt formulär, inbäddningar eller ändrade robots-meta stoppar processen. Befintlig Google Fonts-CSS är det enda tillåtna externa resursursprunget tillsammans med fonts.gstatic.com.

Appens HTML ändras inte. Paketets robots.txt sätts till `User-agent: * / Disallow: /` (två rader); den gamla dist-filens Allow-regel publiceras inte. Sitemap behövs inte i blockerad utvecklingspreview och följer inte med. Noindex,nofollow och inaktiv kontakt/offert verifieras före och efter överföring via byteidentisk HTTP-verifiering.

PHP/API/SMTP, privata konfigurationer, .git/.env, sourcemaps, Markdown, loggar, backupfiler och `prototype/`, `projekt/`, `roadmap/`, `vision/`, `workshop/`, `quote-engine-test/` är uteslutna. Avsiktligt behållna källfiler och lokal dist raderas inte.

Basens kandidat ger **74 filer, 51 bildfiler från 14 källbilder**. [Kandidatinventeringen](candidate-images-20261103.json) redovisar källor/hashar/sidor. [Nuvarande publika previewbilder](current-public-images-20261103.json) redovisar sex bild-URL:er hämtade från publika sidors HTML/lokala CSS, inklusive status och SHA-256. Denna HTTP-inventering är inte en fullständig serverinventering; gamla oannonserade URL:er fångas av FTPS-listningen. Inbyggda SVG-ikoner ingår i granskad komponentkod.

**Alla bildrättigheter är fortsatt overifierade.** Noindex ger inget bildtillstånd. `config/preview-image-rights.json` har därför inga godkännanden; faktisk publicering blockeras. Rättighetsinnehavarens tillstånd måste omfatta offentlig preview och eventuella bearbetningar. Säkra alternativ är kundägda fotografier med dokumenterat tillstånd eller korrekt licensierat ersättningsmaterial, infört i separat godkänd innehållsändring. Inget motiv byts i denna PR.

Ett framtida godkännande registreras per bildvariant med `source`, `sourceSha256`, `outputSha256`, `scope` (= exakt previeworigin), `approvedBy` och `evidence`. Använd den senaste **Linux-CI-rapportens** image-rights.json; versionsbyten kan ändra bildbytes. Evidence är ett ärende-/avtalsreferens-ID, inte ett privat avtal eller personuppgifter. Ändrade bilder eller återkallade godkännanden blockerar nästa publicering.

## FTPS-målet

Den gamla kommentaren `/domains/hallpartner.se/public_html/` får inte användas som bevis för en säker destination. Den beskriver FTP-kontots custom root, inte vilken publik domän som faktiskt visar filerna. Ingen sådan serverabsolut path används i den nya processen.

Befintlig ofarlig kontrollfil: `hp-preview-probe-20261103-6de487a.txt`, exakt innehåll `HALLPARTNER_INLEED_PREVIEW_PROBE_20261103_6de487a`. En läsande HTTPS-kontroll 2026-11-03 gav 200/exakt innehåll på previewn och 404 på både hallpartner.se och www. Historisk ops-verifiering: [41585184270](https://github.com/Amelio-AB/hallpartner/actions/runs/41585184270). Ny PR-validering läser även samma fil via **aktuella FTPS-credentials** och listar root med `find .`, utan uppladdning. Resultatet sparas som target-proof.json.

Varje framtida publicering upprepar kontrollen med befintliga FTP_HOST, FTP_USERNAME, FTP_PASSWORD. Explicit FTPS på port 21, TLS >=1.2, skyddad kontroll-/datakanal samt certifikat- och värdnamnskontroll är obligatoriska. Timeout, TLS-fel, oväntad redirect, saknad markör eller soft-404 på produktionsdomänen stoppar allt före första skrivning. Inga fallback-anrop med avstängd TLS görs. Lösenordet skickas via LFTP_PASSWORD, inte kommandorad, URL eller skriptfil; råa lftp-fel skrivs inte till logg.

`config/preview-release.json` måste efter separat målgranskning få `targetBindingSha256` från aktuell target-proof och `targetEvidence`. Bindningen är SHA-256 av normaliserad endpoint + kontonamn + `./`; inga credential-värden lagras i repo. Byte av konto/host/root kräver ny granskning. Kontot ska vara separat begränsat till previewroot; använd aldrig framtida kundkontots credentials här. Om tillförlitlig isolering inte kan visas förblir publiceringen blockerad.

## Konkurrens, gamla filer och fel

Concurrency-grupp `hallpartner-inleed-preview-20261103`, cancel-in-progress=false, är samma som de gamla ops-flödena. Ingen ny körning avbryter en påbörjad uppladdning. Inaktuella väntande körningar får falla bort; senaste main kontrolleras via GitHub omedelbart före första skrivning samt efter verifiering. Ett nytt main under pågående överföring gör att äldre körningen inte rapporteras lyckad; den nya körningen får sedan publicera. FTPS är inte en atomisk releaseväxling: ett nätavbrott kan lämna en delvis uppdaterad preview. Assetfiler skickas före HTML och startsidan sist; ingen automatisk destruktiv rollback sker.

De två gamla ops-workflows, ID **405335800 och 405334470**, måste stängas av efter separat godkännande före första nya publiceringen. Publish-spärren kontrollerar att båda är disabled_manually. Deras gren lämnas orörd i denna PR. Delad concurrency minskar överlapp men kan inte förhindra att ett gammalt flöde senare skriver över en ny release; därför krävs avstängningen.

**Inget --delete, rm, serverflytt eller serverradering används.** Nytt innehåll får skriva över samma statiska målfil. Hela fjärrlistningen inventeras: okända gamla filer blockerar. PHP, interna HTML-sidor och dotfiler får inte godkännas för retention; de kräver separat plan och godkänd städning utanför denna PR. Det är otillräckligt att bara utelämna dem ur uppladdningen. Tillåtna, äldre statiska filer kan granskas individuellt i retainedFiles med path, sha256, approvedBy och evidence (inklusive användningsrätt för bilder). Bytes läses och kontrolleras före publicering.

Efter första verifierade release sparas `hp-preview-inventory.json` med publik filsökväg/hash. Dess hash finns i deploymarkören. Tidigare verifierade hashade resurser kan därefter ligga kvar automatiskt; gamla bilder kräver fortsatt explicit bildgodkännande. Gammal borttagen HTML godkänns aldrig automatiskt. Detta låter framtida CSS/JS-ändringar publiceras utan serverradering, men skapar växande lagring som behöver separat, godkänd periodisk städning.

## Efterkontroll och spårbarhet

Varje HTML/CSS/JS/bild/font i manifestet hämtas från preview över HTTPS och måste matcha exakt SHA-256. Därmed kontrolleras både startsida/undersidor, noindex och avstängda formulär mot det testade innehållet. Befintlig extern font-CSS kontrolleras också.

Före överföring krävs två stabila HTTP-svar från /, /robots.txt och /stalhallar/ på båda produktionsvärdarna. Deras fingeravtryck måste vara oförändrade efteråt. Markörerna måste fortsatt ge 404/410 där. Om WordPress blir dynamisk/instabil eller ändras samtidigt blockeras körningen för utredning; frånvaro av nätkontakt räknas aldrig som bevis för säkerhet.

Först efter godkänd resurskontroll skrivs `hp-preview-deploy-<40-teckens-commit>.json` och `hp-preview-deploy.json`. Markörerna innehåller commit, runId, manifest-/inventory-hash och verifieringstid, inga secrets. De läses tillbaka och produktionen kontrolleras igen. **Workflowets slutstatus och markören måste båda verifieras**; en markör ensam bevisar inte att sista kontrollen lyckades.

Senast publicerade kandidat läses på https://hallpartner-se.preview2.inleed.com/hp-preview-deploy.json och jämförs med en lyckad Actions-körning för runId samt senaste avsedda main. Den markören finns inte förrän första godkända nya publiceringen. Inga testmarkörer har laddats upp av detta arbete.

## Första aktivering – strikt ordning

1. Granska denna stackade Draft-PR och dess CI, utan publicering.
2. Låt workflow 316932905 förbli manuellt avstängt.
3. Invänta Andreas godkännande.
4. Mergea PR #12 till main (separat godkänd åtgärd).
5. Byt denna PR:s bas till uppdaterad main; kontrollera diff och kör CI igen.
6. Mergea preview-PR:n medan publiceringsworkflowet fortfarande är avstängt.
7. Kontrollera färsk FTPS/HTTPS-målbevisning, kontoisolering, bildtillstånd och alla gamla fjärrfiler. Registrera godkännanden via granskad commit. Stäng av gamla ops-flöden efter godkännande. Kontrollera main/preview-behörigheter; befintlig preview-environment saknar manuella reviewers och main var oskyddad vid inventeringen.
8. **Efter separat uttryckligt godkännande av Andreas:** aktivera workflow 316932905 och kör workflow_dispatch från senaste main. Använd aldrig gamla main eller annan gren.
9. Kontrollera slutstatus, commitmarkör, preview visuellt på mobil/desktop, resurser/formulär/noindex och oförändrad hallpartner.se.
10. Framtida godkända main-uppdateringar kör samma fulla verifiering och publicerar endast om samtliga säkerhetsvillkor fortfarande gäller. Ändrad bild, okända gamla filer, nytt konto eller brutna tester stoppar publiceringen.

Inga merge-, aktiverings-, uppladdnings-, DNS- eller SMTP-åtgärder ingår i denna implementation.

## Incidentstopp

Stäng av workflow 316932905 i GitHub Actions för att stoppa nya körningar. Det avbryter inte en pågående körning: avbryt den explicit om omedelbart stopp behövs, och anta att previewn kan vara delvis uppdaterad. Låt gamla ops-flöden förbli avstängda. Vid fel konto/credentialincident: stoppa åtkomst hos Inleed och utred privat; skriv inga hemligheter i ärenden/loggar. Gör ingen automatisk deletion eller uppladdning till alternativ root.

Återställning sker genom en separat godkänd revert på main och ny verifierad körning, eller en uttryckligen godkänd manuell återställningsplan. Manuell körning av en gammal SHA tillåts inte av latest-main-spärren.

## Vad som återstår att verifiera

Lokala/PR-kontroller kan verifiera struktur, skript, byggning, manifest, säkerhetsspärrar, browserbeteende och läsande målbevis. **Skrivbehörighet, verklig FTPS-överföring, avbrottsåterhämtning och efter-deployment-kontroll på Inleed kan inte verifieras förrän steg 8 uttryckligen godkänts.** Inga mocktester ersätter det.

Bildrättigheter och initial fjärrstädning/retention är verkliga aktiveringsblockerare. Kvarvarande minimatch-advisory i utvecklingsberoenden från PR #12 redovisas fortsatt i npm-audit (9 måttliga markeringar, inga höga/kritiska); CI-gränsen ändras inte.

[Workflowinventering med triggers och tillstånd](workflow-inventory-20261103.json). Den omfattar även historiska/isolera­de grenar; att en workflow syns i GitHub betyder inte att filen finns på aktuell main. Inventeringen är en daterad ögonblicksbild.
