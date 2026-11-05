# Issue #29 – tacksida och kundkopia, kandidat för godkännande

## Utgångsläge och gräns

Arbetsmappen `C:\webbprojekt\hallpartner` var ren före grenbyte. `git fetch origin`
verifierade `origin/main` = `6b175c5636022420f6712f664c85209f88fea2d0`
(PR #28). Ny gren: `codex/issue-29-offert-tack-kundkopia`.
GitHub CI `42102526466` och previewkörning `42102526488` var gröna.
HTTPS-markören angav samma commit, manifest
`9d1a872f0aac34fecaa5e651461f5f858145d2172785d44dbf42475e3b0ae1fd`
och verifiering `2026-11-05T20:35:39.660Z`. Den publicerade offertguiden
granskades läsande i webbläsaren. Inget liveinskick gjordes.
Privata serverfiler har inte återlästs eller ändrats i detta uppdrag.

Detta är en **separat kandidat, inte en publicerad release**. Ingen merge,
workflow-dispatch, SMTP-konfigurationsändring eller serverpublicering ingår
före projektägarens uttryckliga godkännande. Main-mergen startar det befintliga
previewflödet och får därför inte göras före godkännandet.

## Beteende

- AMP-adaptern behåller sin HTTP- och felhantering. Bara HTTP 200 med
  `status: success` får navigera till `/offert/tack/`. Ett avbrutet anrop
  får inte navigera när ett sent svar anländer.
- Tacksidan använder befintlig layout, noindex/nofollow och ingår i den
  uttryckliga allowlisten (nu 15 HTML-filer). Den undantas från sitemap.
  Frågor, obligatoriska fält, design/CSS, uppladdningar och kontaktformulär
  har inte ändrats.
- Fliklagring innehåller bara referens (24 hextecken), kundkopiestatus och
  tidpunkt. Inga svar, namn eller adresser läggs i URL eller lagring.
  Kvittot konsumeras en gång och godtas högst 30 minuter. Direktbesök,
  omladdning efter förbrukat kvitto, ogiltigt kvitto eller spärrad lagring
  visar en neutral text som hänvisar till Amelio före eventuellt nytt inskick.
- Primärmejlet använder fortfarande konfigurerad avsändare/mottagare och
  besökarens validerade adress som Reply-To. Endast V2 får ett andra,
  separat mejl till `contact.email`. Kundkopian har samma autentiserade
  From-adress, avsändarnamnet Amelio och Amelio-mottagaren som Reply-To.
- `quote-fields.json` återger guidens svenska fältnamn och svarsalternativ.
  Paritet testas mot den oförändrade TypeScript-konfigurationen. Bara
  validerade, aktiva och ifyllda svar tas med; inga transportinställningar.
- Efter accepterat primärmejl är resultatet alltid `success` även om
  kundkopian nekas, avbryts eller timeoutar. `customerCopy: accepted` betyder
  SMTP-acceptans, inte bevis för inkorgsleverans. Annars ges `unconfirmed`.
  Inga automatiska omskick görs. Primärt osäkert utfall behåller HTTP 500
  och `unknown`, vilket blockerar nytt inskick i guiden.
- Kundkopians SMTP-timeout/kommandogräns är fem sekunder. Klienten väntar
  högst 60 sekunder på de två sekventiella utskicken. Ett nätverksavbrott
  efter acceptans kan fortfarande innebära okänd status för klienten;
  då uppmanas besökaren att kontrollera med mottagaren före nytt inskick.

## Lokal verifiering

- `npm run check`: inga fel, varningar eller hints.
- `npm run lint`: godkänd.
- `node --test tests/*.test.mjs`: 79/79 godkända.
- Aktiv Astro-byggnad: 15 sidor; samma tre releaseflaggor som tidigare.
- PHP 8.3.36: syntaxkontroll av receiver, delivery, messages och testfixtur
  samt befintlig oberoende validering/rate-limit-regression godkända.
- Riktig, låst PHPMailer 7.1.1 mot en isolerad SMTP-server på `127.0.0.1`:
  båda accepterade, kundkopia nekad, kundkopieanslutning bruten,
  kundkopia timeout, primärmejl nekat samt oförändrat kontaktformulär.
  Exakt två SMTP-anslutningar för V2 efter primäracceptans, annars en.
  Separata mottagarkuvert, From, Reply-To, referens, svenska svar,
  frånvaro av interna inställningar och inaktiva fält verifierades.
  `.invalid`-adresser och påhittade uppgifter användes. Inga externa mejl.
- Chrome kör hela sexstegsguiden på lokal byggnad vid 390 och 1440 px.
  Accepterad/osäker kundkopia, neutral direktöppning, HTTP 422/503/500,
  falsk success, avbruten transport och faktisk 60-sekunderstimeout testades.
  Exakt ett lokalt POST per scenario, ingen felredirect eller horisontell
  overflow. Skärmbilder av lyckad och osäker bekräftelse granskades visuellt.
  Rapporter finns lokalt under `reports/preview/active-quote/` och produceras
  också av PR-kontrollen. Detta är kandidatbevis, inte liveverifiering.
- Samma nya SMTP- och Chrome-regressioner är inkopplade i previewvalidering
  för PR. Slutligt GitHub-resultat ska kontrolleras på PR:ens aktuella SHA.

## Integritet och kontrollerad release efter godkännande

Integritetssidan beskriver full kundkopia till angiven adress. Amelios
30-dagarsgallring omfattar även eventuella skickat-, avsändar- och
vidarebefordringskopior samt papperskorgar hos Inleed och Gmail. Besökarens
egen brevlåda ligger utanför Amelios gallring. PHPMailer-koden skickar via
SMTP och gör ingen IMAP-uppladdning till Skickat; eventuella leverantörs-
eller klientkopior måste kontrolleras operativt vid release.

1. Invänta ägarens godkännande av PR, text och kontrollerad previewrelease.
2. Kontrollera senaste main/PR-SHA, gröna kontroller och befintlig markör.
   Ta verifierad privat backup av berörda privata PHP-filer.
3. Publicera statisk kandidat inklusive integritet och tacksida via ordinarie
   main-workflow. Den är kompatibel med nuvarande receiver: saknad
   `customerCopy` visas som obekräftad kopia, aldrig som skickad.
4. Efter verifierad statisk release: installera `messages.php`,
   `quote-fields.json` och `delivery.php` i den befintliga privata
   mottagarkatalogen; kontrollera hash/syntax innan `receiver.php` byts
   atomiskt. Bevara `config.local.php`, vendor, rate-data och publik bootstrap.
   Ingen snabbfix av aktiv PHP eller ny mottagningsrot. Återställ tidigare
   receiver från backup om grinden fallerar; de nya stödfilerna är passiva
   utan nya receivern. Den statiska kandidaten klarar den äldre receivern.
5. Verifiera på preview efter godkänd installation: ett avtalat syntetiskt
   inskick till en kontrollerad besökaradress. Kontrollera primärmejl och
   kundkopia var för sig med samma referens, svensk sammanfattning och
   tacksida. Kontrollera även om Skickat-/vidarebefordringskopior uppstår
   i respektive tjänst och tillämpa den befintliga gallringen.

Kundens WordPress, DNS, andra formulär och framtida hostingkonto berörs inte.
