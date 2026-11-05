# Offertguide V2 – säker aktivering av verkliga inskick (2026-11-05)

## Status

Den nya sexstegsguiden är redan publicerad på Amelios Inleed-preview som **granskningsversion**. I detta ändringsförslag förbereds PHP-mottagning och AMP-001:s JSON-adapter, men **ingen verklig kundmottagning aktiveras genom att denna PR mergas**. Byggflaggorna är falska som standard, och privat backend distribu­eras inte av statisk preview-pipeline.

## Vad denna PR gör

- Serverns `hp_validate_lead()` accepterar även `configurationId: hallpartner-offert-v2-review` enligt den faktiska V2-fältlistan.
- Fälten valideras oberoende av frontend: tre obligatoriska uppgifter (användning, namn, e-post), allowlist för varje val, mått, villkorade fält och telefonönskemål.
- SMTP-mejlet inkluderar V2-frågorna, inte bara gamla V1-nycklar.
- Frontend använder `createJsonAdapter('/api/lead.php')` **enbart** när samtliga tre releaseflaggor är `true`:
  - `PUBLIC_HP_QUOTE_SUBMISSIONS_ENABLED`
  - `PUBLIC_HP_RECEIVER_VERIFIED`
  - `PUBLIC_HP_PRIVACY_APPROVED`
- Ingen filuppladdning aktiveras. `PUBLIC_HP_QUOTE_FILES_REVIEW` tillåts bara när verklig inskickning är avstängd.
- Tidigare kontaktformulär och V1-validator fortsätter att fungera separat.

## Ytterligare verifierad releaseblockerare: dagens previewpipeline

`scripts/preview/payload.mjs` kräver uttryckligen `data-enabled="false"` för varje formulär och för `offert/index.html`. Kontrolltesterna i `tests/preview-publication.test.mjs` förutsätter detta. Även när privat mottagare installerats och PHP fungerar skulle en byggd guide med aktiv skickaknapp därför **stoppas av den befintliga säkerhetskontrollen**.

Dessutom skickar `.github/workflows/deploy-production.yml` inte de tre `PUBLIC_HP_*`-aktiveringsflaggorna till Astro-byggsteget i det återanvända `preview-validation.yml`. En manuell ändring av privata PHP-inställningar kan därför inte aktivera den statiska frontendknappen.

**Krävd separat, godkänd aktiverings-PR:** inför en explicit, spårbar preview-only releaseväg som bara tillåter aktiv `offert/index.html` efter dokumenterad mottagar- och integritetskontroll; bevara att kontaktformulär och PR-granskningar förblir avstängda. Gränsen ska testas både för avstängd standard och godkänd aktivering; alla andra förbjudna payloads ska fortsätta stoppas. Aktivera aldrig detta genom att generellt ta bort `inspectHtml`-skydden.

## Vad som faktiskt blockerar riktig inskickning

1. **Installera den reviderade privata PHP-mottagaren** (`server/lead/receiver.php` och `validator.php`) utanför `public_html` på rätt Inleed-konto. Verifiera den redan befintliga *serverkopian* `api/lead.php` separat: dess dokumenterade SHA motsvarar inte repots offentliga bootstrap. Ändra ingen PHP i den statiska FTPS-publiceringen.
2. **Verifiera privat konfiguration**: `HP_LEAD_PRIVATE_DIR` från publika PHP-entrypointen, PHP-version, PHPMailer/vendor, skrivbar privat rate-dir, HTTPS-origin `https://hallpartner-se.preview2.inleed.com`, privata autentiserade SMTP-uppgifter samt godkänd avsändare och mottagare. Ingen hemlighet ska läggas i GitHub eller chatten.
3. **Beslut om personuppgifter**: Kunden måste bekräfta vem som tar emot leaden och ansvarar för dem, och den faktiskt publicerade integritetsinformationen måste gälla denna domän och dessa uppgifter. I privat `config.local.php` hålls `enabled=false` och `privacy_approved=false` till dess.
4. **Verifiera riktiga testinskick** på preview med *syntetiska data*: HTTPS/Origin, V2-kontrakt, 200 + success + referens, faktisk SMTP-leverans till godkänd testmottagares inkorg och Reply-To; nekade försök, fel och tidsgränser. SMTP-smoke ensam bevisar inte webbformulärets funktion. Testa att inget skapar dubletter.
5. **Aktivera först därefter** privat `enabled=true` och `privacy_approved=true`, och slå på alla tre byggflaggorna i en separat godkänd previewrelease. Kör live-Chrome och manuell bekräftelse efter publicering. WordPress, DNS, kundhosting och riktiga filuppladdningar ska inte ändras.

## Viktigt

Detta är inte en ändring som kan slutföras med enbart GitHub-publicering. Den privata mottagarinstallationen och kundgodkänd personuppgiftshantering behövs innan knappen får ge en verklig skickatbekräftelse. Att endast ta bort `disabled` eller returnera `success` lokalt skulle vilseleda besökaren och riskera att förfrågningar går förlorade.
