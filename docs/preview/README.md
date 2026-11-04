# Publicering till befintlig Inleed-preview

Aktuellt uppdrag 2026-11-04: Andreas har godkänt slutvalidering, merge av den
avgränsade publiceringsrättningen, aktivering av workflow **316932905** och
första publicering av senaste main. Samma allmänna klartecken ska inte begäras
igen. Verifierat mål, privat råbackup och exakt beslut före radering krävs.
Godkänd merge är inte bevis för publicerad webbplats.

Konsolideringen i [PR #16](https://github.com/Amelio-AB/hallpartner/pull/16)
är mergad på `fb9d51a9a0f02b4c57c948ef50cbb06616e61ebf`. AMP-002,
bildpiloterna, AMP-006 och galleriet bevaras. Arbetsmappen är
`C:\webbprojekt\hallpartner`; ingen ny worktree, domän eller publiceringsrot.

## Mål och spärrar

- Preview: https://hallpartner-se.preview2.inleed.com/ på Amelios Inleed-konto.
- Konto: `deploy@hallpartner.se`, inloggningsrot `./`. Dokumenterad fysisk
  koppling: `/home/s164937/domains/hallpartner.se/public_html/`.
- Endpoint hämtas ur befintlig säker credential-hantering, aldrig gissad.
  Endpoint/konto/root binds med SHA-256 i releasepolicyn.
- Explicit FTPS port 21, TLS minst 1.2, skyddade kontroll-/datakanaler samt
  certifikat- och värdnamnskontroll. Inga hemligheter i rapporter/argument.
- Befintlig målmarkör måste matcha via FTPS och preview-HTTPS och vara frånvarande
  med 404/410 på både `hallpartner.se` och `www.hallpartner.se`.
- DNS, kundens WordPress, e-post, credentials och arkivbranchen ändras inte.
- Behåll noindex, robots-spärr, inaktiva kontakt-/offertflöden och bildregistret.

## Exakt byteverifiering

Inleed har enligt Andreas bekräftat domänomskrivningen. Den tidigare
[diagnosen](http-ftps-comparison-20261104.json) är observationsunderlag;
färsk `check-target` krävs. `scripts/preview/delivery.mjs` tillåter endast:

- `.html` och `.xml`: exakt origin `https://hallpartner.se` ersätts med
  `https://hallpartner-se.preview2.inleed.com` vid en URL-gräns.
- Alla andra filtyper, inklusive CSS, JS, JSON, SVG och bilder: identiska bytes.
- Ingen normalisering, trimning eller UTF-8-omkodning. `http`, `www`, andra
  värdar, textändringar och liknande domänprefix undantas inte.

För- och efterkontrollen använder samma jämförelse. `check-target` anropar
spärren och misslyckas vid avvikelse efter sparad diagnos. Rapporter skiljer
`ftpsSha256`, `expectedHttpSha256` och observerad `httpSha256`.
HTTP-status och slutlig origin kontrolleras också.

Efter uppladdning återläses varje paketfil via FTPS och måste exakt matcha
testat manifest. Varje HTTPS-svar jämförs sedan med den framåtriktade
transformeringen av originalet. Inventory och commit-/run-markörer skrivs
sist och återläses exakt via både FTPS och HTTPS.

Produktionssidor och robots jämförs före/efter. Varierande WordPress-hash
stoppar för undersökning men är inte bevis på orsakad förändring. Konkreta
kontroller av frånvarande previewmarkörer körs även vid hashavvikelse.

## Backup och befintliga filer

Före uppladdning/radering krävs privat FTPS-råbackup utanför publik root och
GitHub: samtliga filer inklusive `cgi-bin/.htaccess`, filvis SHA-256-manifest
och verifierad överensstämmelse med färsk fjärrinventering. Källkodsbackup och
omskrivna HTTP-snapshots räcker inte. Actions-kontrollens temporära original
städas på runnern och är ingen backup. Rå serverfiler får inte läggas i
Actions-artifacts för att ersätta privat backup.

Den automatiska publiceraren raderar inga filer. Okända extra filer blockerar. Gamla tillåtna
resurser kräver individuell hashbunden retention; borttagna HTML-sidor är
aldrig automatiskt godkända via tidigare inventory. Bildrättigheter gäller
registrerade bytes, inte varje äldre serverbild.

`serverFiles` i releasepolicyn kan bevara endast `cgi-bin/.htaccess` med exakt
hash, `reviewedBy` och `evidence`. Funktionen måste granskas privat innan
posten fylls i. Filen laddas aldrig upp/raderas av kedjan. Inget generellt
undantag för dotfiler finns. Demos/README kräver ett exakt raderingsbeslut.

Andreas har nu godkänt den [exakta filplanen](publication-fix-20261104.md):
13 namngivna borttagningar efter verifierad privat råbackup, 26 hashbundna
tillfälliga retentionposter och oförändrad skyddsfil/målmarkör. Befintligt
valideringsworkflow har manuella main-lägen för krypterad backuptransport och
denna engångsstädning; de ingår aldrig i automatisk publicering. Privat nyckel
och dekrypterad råbackup stannar lokalt. Endast chiffertext går till en tillfällig
artifact som tas bort efter verifierad lokal återställning.

## Validering och aktivering

`preview-validation.yml` kör låst installation på Node 24, Astro/TypeScript,
lint, Node-/PHP-regressioner, npm-audit med oförändrad high-gräns,
Composer-audit, bygge, HTML-/URL-/workflowkontrakt, payload/bildregister och
Chrome på tretton verkliga sidor samt AMP-006/galleri. PR-körningen gör också
läsande serverkontroll med befintliga Actions-secrets.

Publiceringen hämtar SHA-märkt payload och manifest från samma körning,
bygger inte om och avvisar annat repo/ref/event eller inaktuell main.
Ingen PR publicerar. Gamla ops 405335800/405334470 ska vara disabled_manually
och sakna oavslutade jobb; skriptet kontrollerar båda. Delad concurrency
behålls. Inaktivering stoppar inte redan startade jobb.

1. Slutför målbevis, privat backup, konfigurationsgranskning och exakt
   filhantering. Registrera färskt målbevis/retention i granskad commit.
2. Kör full validering på exakt slutlig PR-HEAD och granska diffen.
3. Mergea med förväntad HEAD-SHA enligt klartecknet, utan kringgånget
   branchskydd. Verifiera resulterande senaste main.
4. När förkontrollerna är klara: aktivera endast 316932905 och kör manuellt
   från senaste main. Använd inga gamla ops-grenar eller PR-artifacts.
5. Följ körningen till slutstatus. Verifiera FTPS, HTTPS, commit/run-markör,
   AMP-002 på desktop/mobil, AMP-006/galleri på `/stalhallar/`, noindex och
   inaktiva formulär. Rapportera publicerad SHA separat från merge-SHA.

Publiceringsjobbet kör även riktig Chrome mot den kundsynliga startsidan och
`/stalhallar/` efter uppladdningen: responsiv AMP-002, AMP-006 och galleri.
Skärmbilder och testresultat sparas separat under `live-browser` i körningens
publiceringsbevis. Dessa ska inte förväxlas med kandidatens tidigare bilder.

FTPS är inte atomiskt: resurser överförs före HTML, startsidan sist. Avbrott
kan ge delvis uppdaterat innehåll; ingen destruktiv automatisk rollback sker.
Återställning använder separat godkänd revert på main eller exakt manuell plan.

Historiska rapporter: [servergranskning](server-review-20261104.md),
[filplan](remote-file-plan-20261104.json), [bildbesked](customer-image-approval-20261104.md).
Deras äldre krav på ny rot, oidentifierad omskrivning och allmänt slut-GO är
ersatta av aktuellt uppdrag. Återstående åtkomst- och filbeslut ska redovisas
konkret; inga framgångar eller backupbevis får antas.
