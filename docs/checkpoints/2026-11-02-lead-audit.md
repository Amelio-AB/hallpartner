# Hallpartner – självständig säkerhetsgranskning, 2026-11-02

**Status: granskningsleverans klar, fortsatt Draft och helt utan driftändringar.**
Källgren: [Draft PR #5](https://github.com/Amelio-AB/hallpartner/pull/5), kontrollerad SHA `db0d81082cf8ad4438ec830675e6107801ebacf3` (den innehåller det nya beslutet att v1 **inte** ska använda leverantörskalkylator eller automatiska priser). Den egna ändringen finns i [Draft PR #6](https://github.com/Amelio-AB/hallpartner/pull/6), baserad på PR #5:s arbetsgren, **aldrig mot main**.

## Ändringar i PR #6

- `server/lead/validator.php`: maxlängder efter UTF-8-validering mäts i **Unicode-kodpunkter**, inte bara bytes. Innan detta kunde till exempel 121–480 ASCII-tecken passera ett fält avsett för max 120 tecken. Enstaka flerbytestecken kan inte felaktigt klara ett minikrav på två eller tio tecken.
- Feltexten för ett för långt obligatoriskt fält får inte längre skrivas över med vilseledande `Fältet måste fyllas i` eller `minst tio tecken`.
- `hp_allow_rate()` kräver nu fullständigt skriven counter och lyckad `fflush` **före SMTP-försök**. Kort/0-byte skrivning vid till exempel full diskkvot ska inte ge falsk tillåtelse.
- `tests/lead-receiver.test.php`: syntetiska tester för överlånga namn/företagsfält/meddelanden/projekt/ort, korta svenska flerbytetexter, godkänd svensk text och rätt felmeddelanden. De befintliga proven för mejlinjektion, honeypot, allowlist, mått, postnummer och IP-begränsning behålls.
- `docs/SMTP_TEST_AMELIO_ACCOUNT.md`: icke-sändande felsökning med `php -l config.local.php` och valfri **fem-bytekontroll som endast skriver BOM-status**. Inga privata filer hämtades, lästes eller ändrades i arbetet.
- `.github/workflows/hallpartner-intake-audit.yml`: separat snabb PHP-only PR-kontroll med läsbehörighet, ingen FTP, inga uppkopplade kundmiljöer och **inget testmejl**.

**Exakt testad kod-/CI-SHA:** `2d5602fed3906a1ad59005a2c025b665a9db63f3`.

**CI PASS:** [GitHub Actions #41421690192](https://github.com/Amelio-AB/hallpartner/actions/runs/41421690192), PHP **8.3.6** på runnern: sex `php -l` PASS, syntetisk validator-/rate-limit-suite PASS; SMTP CLI startad **utan** `--send-test` och avvisad enligt kontrakt. Föregående fullständig Hallpartner v1-Draft-CI på basgrenens SHA `db0d810...` var [grön #41419966157](https://github.com/Amelio-AB/hallpartner/actions/runs/41419966157). **För PR #6 har ingen ny fullständig Node/Chrome-/fysisk Safari-granskning gjorts**; det ändrade området är endast backend- och dokumentation/CI.

## Källnära granskningsresultat

| Område | Bedömning | Kvar att göra |
|---|---|---|
| API och fail-closed | `public/api/lead.php` kräver POST + server-only `HP_LEAD_PRIVATE_DIR`; annars 503+failed. Inga SMTP-hemligheter i publika filen. | Kontrollera korrekt miljövariabel, verklig HTTPS, PHP och webbrotsisolering på den faktiska releasehosten. |
| PHP-konfiguration | `receiver.php` kräver både `enabled=true` och `privacy_approved=true`; URI-origin, MIME, Content-Length och JSON-schema valideras innan SMTP. | De ska fortsätta vara **false**. Kontrollera att display_errors är avstängt i produktions-PHP och att privat katalog aldrig läggs under public_html. |
| AMP-001 | `/offert/` använder versionslåst AMP-001 Guided och `createJsonAdapter`; inaktiverad Draft har en blockerande adapter och inaktiverad Skicka-knapp. 500/timeout/otydligt svar behandlas som **unknown**, inte som säkert misslyckande. | Fyrastegspilot är **inte** det beslutsunderlag som innehåller tio steg. Ingen automatisk prisberäkning eller köp ska utvecklas i v1 utan nytt kundbeslut. |
| Kontaktformulär | Inaktiverat under Draft. Vid en framtida 422-respons fokuserar klienten första felaktiga fält men visar **bara generell feltext**, inga fältspecifika fel nära kontrollen. | Åtgärda separat med `aria-invalid`, kopplad feltext, förutsägbar fokusordning och manuell mobil-/skärmläsargranskning innan aktivering. |
| SMTP | `PHPMailer 7.1.1` installerat privat enligt användarens terminaltest, port 465/587 har krypterad transport och en fast avsändare; `Reply-To` tas från validerad inskickare. | **Ingen verklig SMTP-acceptans eller inkorgsleverans bekräftad.** Hallpartners mottagare och avsändare är ännu inte kundgodkända. |
| Spam och drift | HMAC-baserat max fem förfrågningar/timme/IP, med låsning av privat fil; råa formulärvärden loggas inte av mottagaren. | Inför gallring av rate-filer, test av proxied IPv4/IPv6 och full diskkvot innan produktion. Inga reala volym-/drifttester har körts. |
| Idempotens | 200+success först efter `PHPMailer::send()` true, 500+unknown om SMTP-försök blir osäkert. Ingen automatisk omförsökning i klienten. | Ingen beständig request-deduplicering, kö eller exactly-once. Samma begäran kan skickas igen efter omladdning/manuell åtgärd; välj policy före aktivering. |
| Integritet | Forms innehåller varning att inte skicka känslig information; ingen filuppladdning. | Kundgodkänd integritetstext, personuppgiftsansvarig, mottagare, rättslig grund, lagringstid, åtkomst och gallring måste vara beslutade före skarp formulärmottagning. |

## Extern blockerare: den privata Inleed-konfigurationen

Användaren körde följande tidigare på sin **egen** Inleed-server: SSH OK, PHP **8.3.36**, `php -l smtp-smoke.php` OK, `PHPMailer OK`. Vid anrop av `config.local.php` och `php smtp-smoke.php --send-test` gav PHP **fatal error**: `strict_types declaration must be the very first statement` på **rad 4**. Detta inträffade **före SMTP** – inget mejl skickades, och detta är inte ett SMTP-autentiseringsfel. Exakt orsak (BOM eller annan text/kod före deklarationen) är **inte verifierad**.

Nästa manuella steg när Andreas är tillbaka: kör **`php -l config.local.php`** i privata katalogen och rätta enbart filens inledning i DirectAdmin (första bytes `<?php`; `declare(strict_types=1);` första PHP-sats; UTF-8 utan BOM). Dela inte eller klistra in hemliga värden. Behåll `600`-behörighet och avstängda formulär. Därefter vid separat godkännande: **ett** syntetiskt SMTP-test, kontroll av faktisk inkorg och åtskillnad mellan SMTP-acceptans och verifierad leverans. Påbörja **inte** formulär-, FTP- eller DNS-aktivering då.

## Stoppgräns och överlämning

- Inga lösenord eller privata filer på Inleed har hämtats, lästs eller ändrats. Inga produktsidor, Header, Hero, Footer, DNS, FTP, redirects, noindex eller produktionsmiljövariabler har ändrats. Endast öppet granskningsbara källfiler i GitHub har lästs; ändringar begränsas till PR #6:s PHP-kod, syntetiska tester, CI och dokumentation.
- Ingen merge till huvudgren eller PR #5. Inget mejl skickat, ingen ny publik endpoint aktiverad. Testade syntetiska uppgifter är inte riktiga leads.
- **PR #6 är förberedelse för manuell granskning**, inte releasegodkännande. Innan någon merge: granska diffen och CI, dokumentera felhanteringen kring 422, samt planera idempotens/gallring och integritetsbeslut utan att utöka v1 till en kalkylator.
