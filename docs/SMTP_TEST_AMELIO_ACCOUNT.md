# Hallpartner – isolerat SMTP-test med Amelios e-postkonto

**Status 2026-11-02:** testverktyg i Draft PR #5. Ingen sändning utförs automatiskt, ingen publikt aktiv formmottagare, ingen deployment.

Den äldre Amelio-konfigurationsfilen heter `contact-config.php`. **Ändra inte Amelios originalfil.** Hallpartners nya privata PHP-mottagare läser **`config.local.php`** i samma privata mapp som `receiver.php`, `validator.php` och `vendor/autoload.php`. Den mappen måste ligga utanför `public_html`. `public/api/lead.php` är bara ett publikt PHP-startskal som kräver miljövariabeln `HP_LEAD_PRIVATE_DIR` för att hitta mottagaren.

För en första syntetisk testomgång kan Hallpartners PRIVATA config använda dessa redan kända uppgifter: `smtp_host = mail.inleed.com`, `smtp_port = 465` (implicit TLS/SMTPS), `smtp_username = kontakt@amelio.se`, `smtp_from = kontakt@amelio.se`, `recipient = andreas@amelio.se`.

Mappa alltså den äldre filens `from_email` till `smtp_from` och `to_email` till `recipient`. Fälten `smtp_secure`, `autoload_path` och `send_customer_confirmation` används inte i Hallpartners mottagare. Krypteringsläget bestäms av port 465/587; PHPMailer ska installeras med Composer i privat `vendor/`, inte kopieras från den gamla Amelio-sökvägen.

**Lösenordet ska fyllas i enbart i serverns privata `config.local.php` och aldrig skickas till chatten eller läggas i GitHub.** Använd [`server/lead/config.example.php`](../server/lead/config.example.php) som mall. Lämna `enabled = false` och `privacy_approved = false` så länge de publika formulären saknar godkänd kundmottagning. Välj endast rätt, faktiskt installerad HTTPS-origin som `allowed_origin`, en privat skrivbar `rate_dir` och en slumpmässig `rate_secret` om minst 32 tecken.

## Blockerare: PHP tolkar inte privat config.local.php

Den **2 november 2026** fungerade SSH, PHP 8.3.36 och PHPMailer-autoload,
men ett manuellt försök avbröts **före varje SMTP-anslutning**:

```text
strict_types declaration must be the very first statement in the script
in config.local.php on line 4
```

Börja nästa manuella felsökning med ett **icke-sändande** syntaxprov i
`~/hallpartner-leads`:

```bash
php -l config.local.php
```

Filen ska börja med `<?php` som **första byte**, utan UTF-8 BOM,
tomrad eller annat innehåll framför. `declare(strict_types=1);` ska
vara den första PHP-satsen (kommentarer och blankrader **efter**
`<?php` i sig ger inte detta fel). Spara som UTF-8 **utan BOM**.

Vid osäkerhet kan följande **endast läsa de första fem byten och skriva
en diagnos, aldrig några lösenord eller övriga filvärden**:

```bash
php -r '$f=@fopen("config.local.php","rb"); if (!$f) { fwrite(STDERR,"Kan inte läsa filen.\n"); exit(1); } $h=fread($f,5); fclose($f); echo str_starts_with($h,"\xEF\xBB\xBF") ? "UTF-8 BOM före PHP-taggen.\n" : ($h === "<?php" ? "PHP-öppning finns på byte 1.\n" : "Det finns innehåll före eller i stället för PHP-öppningen.\n");'
```

Visa inte filens innehåll, använd inte `cat` eller `xxd` på den privata
konfigurationen, och kopiera inte hemligheter till GitHub eller chatten.
Ändra ingenting på servern automatiskt. Behåll `enabled=false` och
`privacy_approved=false` även efter en lyckad syntaxkontroll.
Först efter rättning och godkänd manuell kontroll får det syntetiska
SMTP-provet köras **en gång**, följt av kontroll av den riktiga inkorgen.

Efter PHP 8.2+ och privat Composer-installation (med versionslåsta beroenden), kör i den privata servermappen:

```bash
php smtp-smoke.php
# Ska INTE skicka något; avslutas med felkod 2.

php smtp-smoke.php --send-test
# Skickar exakt ETT syntetiskt testmejl till angiven recipient.
```

Testkommandot använder SMTP-kontot men passerar **inte** webbformulären. Bekräfta mottagning manuellt i inkorgen och eventuell skräppost. SMTP-acceptans är inte en garanti för att mailet kom fram.

**OBS:** `npm run dev` på localhost kör inte PHP, och nuvarande GitHub Actions bygger inte ut den privata PHP-mappen till Inleed. Det går därför inte att slå på kontakt- eller offertinskickning enbart genom att ange dessa inställningar. Nästa separata grind är ett godkänt test i verklig servermiljö, godkänd integritetsinformation och beslut om mottagare. Den gamla WordPress-webbplatsen lämnas orörd.
