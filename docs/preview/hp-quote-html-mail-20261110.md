# Hallpartner – HTML-mejl för offertguiden (Draft, 2026-11-10)

## Mål
Separata HTML-varianter för kundkopia och internt mejl, inspirerade av Carlstad Stadsbuds rena, vita mejllayout och anpassade till Hallpartners gröna färgskala. Samma korta visuella ärendenummer (`HP-` + 10 första hextecknen) som offertguidens tacksida i [Draft PR #59](https://github.com/Amelio-AB/hallpartner/pull/59).

## Omfattning
- Endast `hallpartner-offert-v2-review`. Kontakt/V1 fortsätter få ett enda oförändrat vanligt textmejl och ingen ny kundkopia.
- Kundmejlet får rubrik, kort nummer, sammanfattning av ifyllda fält, Amelios previewupplysning samt information om att det inte är en bindande offert.
- Internt mejl får samma vita layout, kunduppgifter först, därefter alla ifyllda projektfält, samma ärendenummer och **fullständigt tekniskt referens-ID längst ned**.
- Båda mejlen använder `text/html` **och** `text/plain` via PHPMailers `AltBody`. All kundtext HTML-escapas, inga externa resurser eller spårning. Svenska etiketter och val kommer från befintlig `quote-fields.json`; varken hemligheter eller privata SMTP-värden renderas.
- Avsändare, `Reply-To`, SMTP-konfiguration, `allowed_configurations`, rate-limit, primärleverans och fail-closed-hantering ändras inte.
- Inget nytt utskick introduceras: fortfarande högst ett primärt mejl och en separat kundkopia efter primäracceptans. Ingen automatisk retry. Kundkopians eventuella fel får inte ändra lyckad primärstatus.

## Testkrav
- `php tests/quote-email-template.test.php`: kort ID, escaped HTML, separerade interna/personliga referenser, previewomfång, inga oauktoriserade fält.
- `node scripts/preview/quote-mail-test.mjs`: riktig PHPMailer mot isolerad loopback-SMTP, båda MIME-alternativen, intern/kundkuvert, Reply-To, innehåll, kontaktflödets paritet, avbrott och timeout.
- Fulla Node-, PHP-, Astro- och previewkontroller i PR. Ingen live SMTP eller verkliga personuppgifter i CI.

## Drift – viktigt
**Denna PR är ett källkodsförslag, inte en serverinstallation.** De privata PHP-filerna ligger på Inleed utanför `public_html` och distribueras inte med den statiska webbplatsens vanliga FTP-workflow.

Vid ett **separat och uttryckligt driftsgodkännande**:
1. Jämför installerad `delivery.php` mot källan semantiskt (bevara eventuella driftanpassningar). Bevara den publika `api/lead.php`, vars serverinstallerade fallback skiljer sig från repot. Ingen ändring av `config.local.php`.
2. Ta byte-exakt privat backup och verifiera rollback för `delivery.php` och berörda beroenden. Kontrollera fungerande offert och kontakt innan någon ändring.
3. Installera först den nya passiva `quote-email-template.php` i den redan godkända privata katalogen, med skyddade filrättigheter. Kontrollera syntax och exakt hash. Växla först därefter `delivery.php` enligt godkänd plan.
4. Verifiera kontakt/V1 och offert/V2 med testbara skydd utan att skapa dubbla kundmejl. Gör högst ett särskilt godkänt syntetiskt liveutskick om ett sådant behövs för slutverifiering.
5. Återställ `delivery.php` vid problem utan att skriva över config/vendor/rate-data. Rör inte WordPress, DNS eller Hallpartners kundproduktion.

## Viktiga avgränsningar
- `HP-XXXXXXXXXX` är en **kort söketikett** härledd ur befintlig 96-bitarsreferens, inte ett matematiskt garanterat unikt löpnummer. Den tekniska fullreferensen finns fortsatt internt. Absolut unik, permanent kortnumrering kräver separat serverlagring/unikhetskontroll.
- I previewn är **Amelio** faktisk datamottagare och ansvarig; mallarna säger det uttryckligen. Kundens framtida egen drift kräver ändrade avsändare, kontaktuppgifter, personuppgiftstext och godkännande.
- Inga ändringar får mergas eller driftsättas automatiskt. Granska färger, svenska texter och testresultat först.
