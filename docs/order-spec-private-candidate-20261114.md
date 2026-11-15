# Hallpartner beställningsformulär – privat integrationskandidat

Status 14 november 2026: **inte installerad, inte produktionsaktiverad**. Källa är Draft PR #68 på integrationsgrenen. Detta är C:s isolerade leveransväg, inte en ersättning av befintligt `server/lead/` eller `api/lead.php`.

## Låst, kontrollerbart installationsunderlag

Kör i ett verifierat Git-checkout av PR:ens exakta 40-tecken-SHA:

```bash
node scripts/preview/order-spec-candidate.mjs build FULL_COMMIT_SHA reports/preview/order-spec-candidate
node scripts/preview/order-spec-candidate.mjs verify FULL_COMMIT_SHA reports/preview/order-spec-candidate/order-spec-private-candidate.tar
```

Paketet byggs med `git archive` från Git-objekt (inte arbetskopians ändrade filer). En fast lista med 11 privata källfiler inkluderar Composer-manifest och låst `composer.lock`, men exkluderar `vendor/`, kördata, hemligheter, tester, gamla leadmodulen och publik adapter. `manifest.json`, `SOURCE_SHA256`, `ARCHIVE_SHA256` verifierar byteidentitet mot samma commit. CI arkiverar separat paketet som en kortlivad Actions-artifact, utan automatisk deploy.

Den lilla publika adaptern `public/api/order-spec.php` finns **inte** i privatpaketet; den kan senare hämtas separat från samma exakta Git-SHA. Ingen aktiv konfiguration distribueras. `config.example.php` har transport avstängd och får inte användas som aktiveringsmandat.

## Stopp före isolerad installation på kundens preview

Enda tillåtna mål: `s188354`, domän `hallpartner.se.new`, `https://hallpartner-se-new.preview2.inleed.com`. Verifiera serverkonto, webbrot, behörig anslutning och fullständig återställningsbar bytebackup innan något skrivs. Kontrollera PHP-webbmiljön (inte bara CLI): PHP >=8.3, `dom`, `mbstring`, `openssl`, `fileinfo`, `json`, TLS, skrivbart privat font/temp och PDF-minnesgräns. Installera endast låsta Composer-beroenden i en separat privat katalog utanför `public_html`, med separat `0700` state-katalog. Kontrollera installationen i isolerad staging innan adapter kopplas in. Ingen ändring av gammal `lead.php`-modul eller befintlig /offert/ och /kontakt/.

Extern SMTP förblir avstängd; endast syntetisk PDF och loopback/mock är tillåtna. Inga DNS-/MX- eller tidigare s164937-ändringar. Samma fil-SHA i privatarkivet, publik adapter och byggd sida måste dokumenteras och matcha. Utan verifierade serverförutsättningar: **NO DEPLOY**. Chrome-tester i CI är lokal testkandidat, inte kundens live-preview.
