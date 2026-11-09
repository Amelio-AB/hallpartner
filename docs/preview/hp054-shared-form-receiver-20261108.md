# HP-054 – Delad mottagare, separat kontaktaktivering

Datum: 2026-11-08. **Draft-kandidat, inte en aktiv leverans.**

## Befintligt gemensamt flöde

Både `/offert/` (AMP-001 V2) och `/kontakt/` använder redan **samma** `POST /api/lead.php` med `contractVersion=1`, `technicalId=quote-flow` och egna `configurationId`:

- `hallpartner-offert-v2-review` – offertguide, redan godkänd på Amelios utvecklingspreview.
- `hallpartner-contact-v1` – kort kontaktformulär, fortfarande avstängt tills eget godkännande.

Den privata koden i `server/lead` hanterar gemensam validering, Origin, HTTPS, rate limiting, SMTP, felstatus och referens. Den levereras **inte automatiskt** via GitHub:s statiska previewdeploy. Serverns lösenord och privata `config.local.php` ska aldrig läggas i repot.

## Förändringar i denna PR

- `config/preview-contact-release.json`: separat fail-closed policy i läget `review`, för enbart `https://hallpartner-se.preview2.inleed.com`.
- `scripts/preview/contact-release.mjs`: validerar kontaktens **egna** godkännanden. Offertens befintliga policy och mottagare får inte automatiskt godkänna kontakt.
- `quote-release.mjs` levererar både offert- och kontaktflaggor från *var sin* policy; `PUBLIC_HP_LEADS_ENABLED=false` kvarstår i denna kandidat.
- Den statiska payload-grinden och Chrome-tester stöder båda lägen, men kan inte leverera ett kontaktärende utan separat aktiv policy.
- Privat PHP-mottagare får en uttrycklig `allowed_configurations`-grind för kontakt. Detta är en **källkodsändring** som måste versionsverifieras och läggas i det privata serverområdet före eventuell aktivering.
- Integritetssidan förklarar hur ett framtida aktivt kontaktärende hanteras av Amelio i previewn; det skickas inte automatiskt till Hallpartner. Aktivt formulär länkar dit.
- Regressionstester använder påhittade uppgifter, inte verkliga kundmeddelanden.

## Blockerare före verkliga kontaktinskick

1. Verifiera aktuell privat `server/lead/receiver.php`, `validator.php` och `config.local.php` via godkänd administrativ åtkomst. Säkerställ att `allowed_configurations` explicit innehåller `hallpartner-contact-v1` **först när** kontaktmottagningen ska aktiveras. Bevara offertguidens `hallpartner-offert-v2-review` och dess fungerande SMTP-inställningar. Ingen blind serveruppladdning.
2. Bekräfta att **kontakt@amelio.se** fortsatt ska ta emot kontaktärenden under preview, och vem som får läsa/gallra dem. `info@hallpartner.se` är en publik kontaktväg, inte automatiskt SMTP-mottagare på Amelios utvecklingskonto.
3. Färdigställ/godkänn integritetsinformationen för *kontaktförfrågningar*, inklusive behandlingsansvarig, gallring och eventuell bekräftelsehantering. Dokumentera ägargodkännande och separat syntetisk SMTP-verifiering i en faktisk bevisfil.
4. Först därefter ändras `config/preview-contact-release.json` till `mode=enabled` med verklig bevisning. Kör fullständiga Actions, verifiera målbindning, `noindex`, read-only PR-test samt ingen påverkan på kundens WordPress eller DNS.
5. Efter grön och godkänd previewrelease: kontrollera exakt **ett** syntetiskt kontaktmeddelande och bekräfta serverreferens + faktisk mejlmottagning, utan falsk success eller upprepade utskick.

## Övrig releasekontext

Tidigare kontakt-PR #54 är mergad på `main`, men Inleed-workflow #42496108781 blev rött på extern WordPress-HTTPS-kontroll efter att previewfilerna verifierats. Denna PR försöker **inte** ändra publiceringens säkerhetsgrindar. Kontaktaktivering sker inte förrän hela releaseprocessen kan verifieras enligt separat beslut.

## SSH-inventering 2026-11-08 – faktisk serverstatus (läsning, ingen driftändring)

Projektägaren fick en läsande inventering utförd via återställd SSH-åtkomst till `ns15.inleed.net:2020`, användare `s164937`. **Ingen hemlighet, kunduppgift eller privat filinnehåll har kopierats till GitHub.** De fyra lokala ändringarna hos användaren lämnades orörda.

| Kontroll | Observerat |
| --- | --- |
| PHP / PHPMailer | PHP 8.3.36; PHPMailer 7.1.1 laddas; installerade PHP-källor klarar syntaxkontroll |
| Origin och SMTP-adresser | `allowed_origin` pekar på Inleed-preview; SMTP-avsändare, användare och mottagare är `kontakt@amelio.se` |
| Tillåtna kontrakt | Privat `allowed_configurations` innehåller **endast** `hallpartner-offert-v2-review`; `hallpartner-contact-v1` är **inte** tillåtet |
| TLS / privat lagring | Publik GET mot API ger väntat 405 via TLS; privata kataloger har 700 och konf.fil 600; rate-katalog skrivbar utanför `public_html` |
| Rate-limit | Kod för fem försök/timme och HMAC-baserad IP-identifierare finns; faktiska rate-postar/limiten ej provkörd |
| SMTP | Nätverksport nåbar; **ingen autentisering eller faktisk mejlleverans testad** |
| Installerade filhashar | `delivery.php`, `messages.php`, `rate-cleanup.php` överensstämmer med jämförelseunderlaget; `receiver.php`, `validator.php`, `public/api/lead.php` avviker |

**Viktig skillnad:** GitHub `main` och denna Draft-PR har redan samma `public/api/lead.php`, som kräver en explicit `HP_LEAD_PRIVATE_DIR` och annars svarar 503. Den *installerade* publika API-filen använder enligt inventeringen fortfarande en fallback för privat sökväg. **Byt inte ut den publika filen** före en separat kontroll att webbservern faktiskt tillhandahåller miljövariabeln i PHP-processen; annars kan befintliga offertinskick brytas. Den installerade serverkoden är ett externt driftläge, inte automatiskt identisk med GitHub.

### Säkra steg före aktivering

1. **Läsande jämförelse, utan att visa privata hemligheter:** jämför semantiska skillnader i installerad `receiver.php`, `validator.php` och `api/lead.php` mot den granskade kandidaten. Det räcker inte att notera att hash skiljer; avvikelser kan gälla driftanpassningar. Kontrollera endast om `HP_LEAD_PRIVATE_DIR` finns i **webb-PHP:s** miljö (ja/nej), utan att skriva ut värdet eller vägen.
2. Säkerställ att det finns **återställningsbara, rättighetsskyddade byte-exakta säkerhetskopior** och att rollback har testats med ofarlig läsning. Bevara fungerande `hallpartner-offert-v2-review`, `allowed_origin`, SMTP-konfiguration och privat katalog hela tiden. Skicka inte privata filer eller arkiv till GitHub.
3. Verifiera att `validator.php` och `receiver.php` från exakt godkänd kodversion är kompatibla **tillsammans**. Uppdatera inte `receiver.php` till en variant som anropar `hp_configuration_allowed` innan dess funktion verkligen är installerad och provad i `validator.php`; planera övergång/rollback mot samma privatkatalog. `config.local.php` ändras inte i detta steg.
4. Om, och endast om, den publika bootstrappens nödvändiga miljövariabel faktiskt finns i PHP-processen, kan en separat genomgången flytt från fallback till explicit sökväg planeras. Publicerad offertguide måste fortsatt svara normalt; ett 405 på GET bevisar **inte** att POST och SMTP fungerar.
5. **Separat aktiveringsbeslut:** bekräfta aktuell mottagning hos `kontakt@amelio.se`, integritetstext och gallringsansvar. Lägg därefter till `hallpartner-contact-v1` i privata allowlisten utan att ta bort offertkontraktet. Följ aktuell Draft-policy `review` tills alla grindar är passerade och offline-tester är gröna.
6. Efter verifierad Inleed-release: kör **högst ett syntetiskt kontaktärende** med påhittade uppgifter och kontrollera både mottagarens svar och faktisk leverans i Amelios inkorg. Skicka inte riktiga kunddata som test. Kontrollera också att offertguidens fungerande inskicksflöde inte har regresserat.

**Nuläge för webbpublicering:** `main` har senare uppdaterats till `d9dc75502c3415170ff657148e794a94f4758798`; [GitHub-run #42516568710](https://github.com/Amelio-AB/hallpartner/actions/runs/42516568710) är verifierat grön, inklusive uppladdning och Chrome-test efter publicering. Den nya `/integritetspolicy/` på `main` gäller Hallpartners ordinarie kundkontakt; `/integritet/` beskriver i stället Amelios utvecklingspreview. PR #57 behöver synkas mot aktuell `main` och båda texterna hållas korrekt avgränsade innan merge. [HP-055 / Issue #58](https://github.com/Amelio-AB/hallpartner/issues/58) beskriver tidigare opålitlighet i extern WordPress-HTTPS-kontroll, men den senaste releasen lyckades utan ändring av skyddsgrindarna.

**Ingen merge, privat serverändring, allowlist-aktivering eller ny publicering ingår i denna dokumentationsuppdatering.**
