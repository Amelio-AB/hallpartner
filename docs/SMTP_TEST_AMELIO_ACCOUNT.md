# Hallpartner – isolerat SMTP-test med Amelios e-postkonto

**Status 2026-11-02:** testverktyg i Draft PR #5. Ingen sändning utförs automatiskt, ingen publikt aktiv formmottagare, ingen deployment.

Den äldre Amelio-konfigurationsfilen heter `contact-config.php`. **Ändra inte Amelios originalfil.** Hallpartners nya privata PHP-mottagare läser **`config.local.php`** i samma privata mapp som `receiver.php`, `validator.php` och `vendor/autoload.php`. Den mappen måste ligga utanför `public_html`. `public/api/lead.php` är bara ett publikt PHP-startskal som kräver miljövariabeln `HP_LEAD_PRIVATE_DIR` för att hitta mottagaren.

För en första syntetisk testomgång kan Hallpartners PRIVATA config använda dessa redan kända uppgifter: `smtp_host = mail.inleed.com`, `smtp_port = 465` (implicit TLS/SMTPS), `smtp_username = kontakt@amelio.se`, `smtp_from = kontakt@amelio.se`, `recipient = andreas@amelio.se`.

Mappa alltså den äldre filens `from_email` till `smtp_from` och `to_email` till `recipient`. Fälten `smtp_secure`, `autoload_path` och `send_customer_confirmation` används inte i Hallpartners mottagare. Krypteringsläget bestäms av port 465/587; PHPMailer ska installeras med Composer i privat `vendor/`, inte kopieras från den gamla Amelio-sökvägen.

**Lösenordet ska fyllas i enbart i serverns privata `config.local.php` och aldrig skickas till chatten eller läggas i GitHub.** Använd [`server/lead/config.example.php`](../server/lead/config.example.php) som mall. Lämna `enabled = false` och `privacy_approved = false` så länge de publika formulären saknar godkänd kundmottagning. Välj endast rätt, faktiskt installerad HTTPS-origin som `allowed_origin`, en privat skrivbar `rate_dir` och en slumpmässig `rate_secret` om minst 32 tecken.

Efter PHP 8.2+ och privat Composer-installation (med versionslåsta beroenden), kör i den privata servermappen:

```bash
php smtp-smoke.php
# Ska INTE skicka något; avslutas med felkod 2.

php smtp-smoke.php --send-test
# Skickar exakt ETT syntetiskt testmejl till angiven recipient.
```

Testkommandot använder SMTP-kontot men passerar **inte** webbformulären. Bekräfta mottagning manuellt i inkorgen och eventuell skräppost. SMTP-acceptans är inte en garanti för att mailet kom fram.

**OBS:** `npm run dev` på localhost kör inte PHP, och nuvarande GitHub Actions bygger inte ut den privata PHP-mappen till Inleed. Det går därför inte att slå på kontakt- eller offertinskickning enbart genom att ange dessa inställningar. Nästa separata grind är ett godkänt test i verklig servermiljö, godkänd integritetsinformation och beslut om mottagare. Den gamla WordPress-webbplatsen lämnas orörd.
