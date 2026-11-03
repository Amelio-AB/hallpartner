# Hallpartner – checkpoint efter SMTP-testförsök, 2 november 2026

**Status:** Koden ligger i Draft [PR #5](https://github.com/Amelio-AB/hallpartner/pull/5), senast granskade HEAD före denna dokumentationsuppdatering `6a53010f8600cf6b93277f41ebd0f4fe95d60384`. **Ingen merge, FTP, DNS, publicering, aktiverad kundmottagning eller indexering.**

## Verifierat i användarens privata Inleed-miljö

- En separat privat katalog `~/hallpartner-leads/` finns **utanför `public_html`**. Den gamla Amelio-konfigurationen `~/contact-config.php` lämnades orörd.
- Filerna `receiver.php`, `validator.php`, `smtp-smoke.php`, `config.local.php`, `composer.json` och `composer.lock` ligger i den privata katalogen. `vendor/autoload.php` finns, och `vendor/phpmailer/` ligger rätt.
- `config.local.php` visades med behörighet `600`, katalogen `rates/` med `700`.
- SSH till webbhotellet **fungerar**. PHP CLI rapporterade `8.3.36`.
- `php -l smtp-smoke.php` rapporterade **No syntax errors**; `class_exists("PHPMailer\\PHPMailer\\PHPMailer")` rapporterade **PHPMailer OK**.
- PHPMailer `7.1.1` är Composer-låst i repositoryt. GitHub Actions jobb för vendor-installation och `composer audit --locked` passerade: [vendor CI #41414942573](https://github.com/Amelio-AB/hallpartner/actions/runs/41414942573).

## Senaste SMTP-testet: BLOCKERAT, inget mejl skickat

När användaren anropade den privata `config.local.php` och sedan körde `php smtp-smoke.php --send-test` uppstod **innan SMTP-försök**:

```text
PHP Fatal error: strict_types declaration must be the very first statement in the script
in ~/hallpartner-leads/config.local.php on line 4
```

Det är en PHP-parsningsfråga **i den privata filen**, inte ett autentiseringsfel eller bevis för fungerande mejltransport. Möjliga orsaker: UTF-8 BOM eller blanksteg/text före öppnande `<?php`, alternativt PHP-satser före `declare(strict_types=1);`. Någon exakt orsak är inte verifierad. Undvik att klistra in konfigurationsfilen eller hemligheter i chatt/GitHub.

**Nästa manuella åtgärd:** öppna `config.local.php` i DirectAdmin och kontrollera att dess allra första byte är `<?php` och att `declare(strict_types=1);` är första PHP-sats, exempelvis:

```php
<?php
declare(strict_types=1);

return [
    // befintliga privata värden
];
```

Spara som UTF-8 **utan BOM**, behåll SMTP-värden och behörighet `600`. För säker diagnos utan hemligheter kan agenten föreslå ett lokalt kommando som enbart rapporterar första `<?php`-position och BOM-status. **Gör inga automatiska ändringar i den privata serverfilen utan ny användargranskning.**

När parserfelet är löst: kör först en icke-sändande config-validering, därefter `php smtp-smoke.php --send-test` **högst en gång** med syntetiskt innehåll, och kontrollera faktiskt inkommet mejl. Om resultatet är osäkert, inspektera inbox innan nytt försök. Lösenord/privata config-filer ska aldrig delas.

## Webbplatsens byggstatus och blockerare

- `/kontakt/` innehåller ett **inaktivt** kontaktformulär plus telefon/mejl.
- `/offert/` innehåller en **inaktiv fyrastegs-AMP-001-pilot**. Det beslutade fullständiga affärsflödet i `docs/OFFERTFLODE.md` har tio steg och kvarstår för separat godkännande.
- Publik `/api/lead.php` saknar privat serverkoppling och ska svara `503 failed` – **ingen aktiv kundmottagning**. Backend är designad att installeras utanför webbroten, och SMTP, personuppgiftsinformation, mottagare och verklig leverans är **inte** verifierade.
- `PUBLIC_HP_LEADS_ENABLED` samt privata `enabled` och `privacy_approved` ska fortsatt vara **false**. Ingen publik offert-/kontaktfunktion får aktiveras utifrån test av enbart SMTP.
- Skyddade/godkända arbetsversioner av Header, Hero och AMP-003 Footer får inte ändras utan ny granskning.
- Separata uppgifter kvarstår: AMP-002 Mega Menu/hamburgerikon i Amelio Web Platform, SEO/redirect-karta, kunduppgifter och integritetsriktlinjer, drift/FTP/Node och releasebeslut.

## Säker uppgift för autonom agent

En tidsstyrd agentgranskning har skapats för dagen. Den ska **endast** analysera Hallpartners offert-/kontaktmottagare och utvecklings-PR, reproducera/förbereda säkra tester eller dokumentation i en **separat Draft-gren/PR**, med svensk återrapportering och exakta SHAs. Inte tillåtet: att ansluta till den privata Inleed-katalogen, läsa/ändra lösenord, skicka SMTP-mejl, slå på formulär, ändra FTP/DNS/noindex eller mergea.

**Källor att läsa:** `docs/LEAD_RECEIVER_INTEGRATION.md`, `docs/SMTP_TEST_AMELIO_ACCOUNT.md`, `docs/OFFERTFLODE.md`, `server/lead/`, `.github/workflows/hallpartner-draft.yml` samt dokumentations-PR #2. Detta dokument är checkpoint, **inte** slutgodkännande.
