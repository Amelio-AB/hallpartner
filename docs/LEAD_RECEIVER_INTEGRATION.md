# Hallpartner – säker mottagning av kontakt och offert (2026-11-02)

> **Senare V2-arbete (2026-11-04):** Beskrivningen nedan av offertguidens fyra pilotsteg gäller den historiska V1-implementationen. Draft-PR #22 har i stället [fem frågesteg och automatisk kontroll](content/HALLPARTNER_OFFERTGUIDE_V2.md); offertinskick är uttryckligen avstängd för dess nya fält. PHP-mottagaren och SMTP ändras inte av UX-arbetet.

> **Uppdatering 2026-11-04:** Inleeds SMTP-inloggning för det privata `kontakt@amelio.se`-kontot och leverans av ett syntetiskt testmejl till Roundcube-inkorgen har bekräftats manuellt. Det bevisar endast SMTP/inkorg, **inte** ett fungerande publikt formulär eller en kundgodkänd mottagare. Formulären förblir inaktiva. AMP-001 1.5.0:s nya bilagekontrakt V2 hanteras separat; befintlig `/api/lead.php` och `server/lead/` accepterar endast V1 JSON. Se [Hallpartners AMP-001 1.5.0 integrationsplan](AMP_001_150_HALLPARTNER.md).

**Status: kod finns och automatiska offline-test genomförs; kundmottagning INTE aktiverad.**
Inga mail, personuppgifter, DNS-, FTP-, Inleed- eller main-ändringar ingår i denna Draft. All publik WordPress-funktion finns kvar.

## Beslut om kalkylator och konvertering (2026-11-02)

Hallpartner har **ingen vald leverantörskalkylator** att använda. Andreas har
beslutat att webbplatsens första version fortsätter med **fristående
offertförfrågan utan automatiska priser eller köp**. Leverantörskalkylator,
prismodell, produktimport och eventuell e-handel är pausade framtidsspår
(HPD-010 i dokumentations-PR #2, se
[checkpoint](checkpoints/2026-11-02-calculator-paused.md)).

**Mottagnings- och integritetsgrindarna nedan är fortfarande obligatoriska.**
Ingen kund ska kunna skicka uppgifter förrän servermottagare, relevant
integritetsinformation och faktiskt inbox-test har godkänts. Att kalkylatorn
pausas innebär inte att mottagningen automatiskt kan aktiveras.

## Levererat i arbetsgrenen

- Kontakt: egen frågeform på /kontakt/ med obligatoriskt namn/e-post/meddelande, frivilligt företag och telefon, plus synliga mailto-/telefonalternativ.
- Offert: /offert/ byggd med **riktig AMP-001 Guided** från det SHA-låsta privata plattformspaketet; kort första guide om användning, storlek, byggplats och kontakt. Den kompletta tiostegsspecifikationen i docs/OFFERTFLODE.md är bevarad och INTE ersatt.
- PHP: public/api/lead.php hamnar i Astro dist/api/lead.php. Den gör inget annat än att slå upp ett separat privat mottagarprogram. Utan server-only HP_LEAD_PRIVATE_DIR svarar den **HTTP 503 {"status":"failed"}**, inte falsk framgång.
- Privat mottagare: server/lead/receiver.php och validator.php är avsedda att installeras **utanför** public_html. De kräver godkänd mottagaradress, en separat autentiserad SMTP-avsändare, PHP 8.2+, Composer/PHPMailer 7.1.1 och en privat writable rate-dir.
- Säkerhetsgrindar: JSON max 16 KiB, strict origin/HTTPS, låst field allowlist, e-post-/måttkontroller, honeypot, SHA256/HMAC-baserad begränsning fem försök/timme/IP och inga loggade råa personuppgifter. Filer och multipart-uppladdning stöds inte.
- Mottagningsstatus: **200+success** först efter att SMTP accepterat överlämningen; **422** vid valideringsfel; **503+failed** endast före SMTP-försök; **500+unknown** vid osäker transport. Klienten får inte automatiskt skicka om när utfallet är okänt.
- Standardbyggläget har **PUBLIC_HP_LEADS_ENABLED avstängd**. Offertguidens slutknapp är avstängd i granskningen och Kontaktknappen förblir disabled. Testa fält utan att skicka kunduppgifter.

## Varför denna arkitektur

Astro har statiskt output och Hallpartners deploy är FTP-baserad. Det behövs därför en verklig servermottagare; frontend eller AMP-001 kan inte själva bekräfta leverans. Inleed dokumenterar PHP, Composer samt autentiserad SMTP (mail.inleed.com, port 587 med STARTTLS). Att PHP stöds generellt betyder **inte** att Hallpartners specifika konto redan är verifierat. Inleed rapporterade dessutom säkerhetsrestriktioner för multipart/formuläruppladdning hösten 2026; därför är detta JSON utan bilagor.

## Konfiguration som INTE får göras i GitHub eller chatten

1. **Kundbeslut:** Peter/Jimmy bekräftar juridiskt personuppgiftsansvar, faktisk mottagarbrevlåda (tidigare publicerad info@hallpartner.se är inte automatiskt verifierad), SMTP-avsändare och vad som händer med förfrågningarna. Bestäm gallring av inkorg och skydd mot obehörig åtkomst.
2. **Integritet:** publicera kundgodkänd information om syfte, ansvarig, rättslig grund, åtkomst, lagringstid, kontakt och registrerades rättigheter, samt placera länk vid båda formulären. Låt config privacy_approved vara false tills detta är gjort.
3. **Hosting:** kontrollera på rätt Inleed-konto att PHP 8.2 eller senare exekverar, att mail.inleed.com:587 kan nås med STARTTLS och att HP_LEAD_PRIVATE_DIR kan sättas som server-only miljövariabel för PHP. Sätt aldrig SMTP-lösenord i publika PHP-filer.
4. **Privat installation:** placera server/lead/ som en separat katalog UTANFÖR public_html, t.ex. på en privat serverplats som användaren och webbhotellsägaren väljer. Installera PHPMailer med Composer från server/lead/composer.json, **generera och versionslås composer.lock före produktionsrelease**, kopiera config.example.php till config.local.php i privat katalog och fyll i rätt SMTP-uppgifter där. Skapa separat privat skrivbar rate_dir. Behåll enabled=false och privacy_approved=false under test.
5. **Test:** gör ett syntetiskt Kontakt- och Offertutskick i kontrollerad miljö med godkänd testmottagare, verifiera själva mailet i mottagarens inbox/skräppost, avsändare, Reply-To, referens-ID, rätt SSL/TLS och att felaktiga fält, okänd origin och överbelastning avvisas. Testa att det inte finns några dubletter. SMTP-acceptans är inte garanti för faktisk leverans till inbox.
6. **Aktivering:** först efter dokumenterat godkännande och testad mottagning får en separat release sätta PUBLIC_HP_LEADS_ENABLED=true vid byggning OCH privatsidans enabled=true och privacy_approved=true. Inga credentials ska ligga i statiska Astro-assets.
7. **Go-live:** granska den vanliga Inleed-/FTP-deployen separat (den har ännu gammal Node och privatrepo-behörighet måste lösas). Testa /api/lead.php under den riktiga domänen. Behåll gamla WordPress /offert/ och /kontakt/ tills likvärdig mottagning har godkänts. Ingen automatisk 301 till en avstängd guide.

## Kända begränsningar

- Ingen faktisk SMTP-inloggning eller leverans till Hallpartner har testats, så **HP-007, HP-008 och migreringskravet för /offert/ är fortfarande öppna**.
- Offert v0.1 innehåller **fyra pilotsteg**, inte fulla tiostegskontraktet och inte en prisberäkning. Frågor och sortiment behöver kundgodkännas.
- Ingen databas, kö eller exakt-en-gång-leverans finns. Timeout kan ge okänd status; framtida produktionshärdning bör avgöra om idempotens och robust kö krävs.
- Hastighetsbegränsningen sparar endast pseudonyma HMAC-nycklar och tidsstämplar i rate_dir. Sätt en gallringsrutin, t.ex. borttagning av filer äldre än två dygn genom schemalagd serveruppgift. Råa formulärsvar sparas inte till disk av denna kod.
- Ingen hostingkonfiguration, ingående e-post eller faktisk SMTP-status har ändrats i detta uppdrag.
- Referensen till gamla Fridland Consulting AB på tidigare WordPress-sidan är inte automatisk kundverifiering.

## Lokal granskning med VS Code

Kör från C:\webbprojekt\hallpartner efter git pull och npm ci:

    npm run dev

Öppna http://localhost:4321/kontakt/ och http://localhost:4321/offert/.

Kör även:

    node --experimental-strip-types --test tests/lead-intake.test.mjs
    php -l server/lead/receiver.php
    php tests/lead-receiver.test.php
    npm run check
    npm run lint
    npm run build

Astro-devservern kör inte PHP. PHP-HTTP-stubben kontrolleras därför separat med en lokal PHP-server i GitHub Actions. Under granskningen visas ingen falsk skickatbekräftelse.

## Källor

- Amelio Web Platform AMP-001, public contract: https://github.com/Amelio-AB/amelio-web-platform/blob/a11811bfbf51416e7fe7d58aed4551be77914d65/docs/CONTRACT.md
- Inleed SMTP: https://login.inleed.net/helpcenter/1054/installera-och-konfigurera-ett-smtp-plugin-wordpress
- Inleed hosting/PHP: https://inleed.se/webbhotell
- Inleed driftstatus: https://inleeddrift.se/
- PHPMailer: https://github.com/PHPMailer/PHPMailer/releases
