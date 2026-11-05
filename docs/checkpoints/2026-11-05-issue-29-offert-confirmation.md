# Issue #29 – slutförd release: tacksida och kundkopia

## Slutligt leveransbevis – 2026-11-06 svensk tid

**Releasen är genomförd och inkorgsleveransen bekräftad av Andreas.** Detta
avsnitt ersätter de historiska stoppstatusarna nedan. Inga fler testinskick
behövs. Ingen ny statisk publicering gjordes under den privata installationen.

- Publicerad frontend och PHP-källversion är
  **`931e2149d5477e33aaa4d19bbaa7ad264b04d320`**. Den tidigare gröna
  [publiceringskörningen 42121351331](https://github.com/Amelio-AB/hallpartner/actions/runs/42121351331)
  kvarstår. Markör och alla 117 inventerade serveroriginal återverifierades
  före installationen; main och preview hade inte ändrats.
- Andreas godkände uttryckligen att även befintlig validator fick ersättas.
  Färsk kontroll före backup och omedelbart före byte visade **enbart 266
  CRLF/LF-skillnader**, inga andra kodskillnader. Den installerade ersättningen
  kopierades från kandidatens råa Git-bytes. Normaliserad hash användes aldrig
  för att godkänna kandidat eller installerad fil.
- Ny privat backup finns i
  `/home/s164937/hallpartner-leads/.release-issue29-final-20261105/backup`.
  Berörda aktiva original och konfiguration kopierades med bevarade rättigheter
  och verifierades med `cmp` och full SHA-256. Katalogen är 0700. Tidigare
  backuper verifierades också. Vendor-filer fick en separat hashförteckning.
  Ett byteverifierat `rollback.sh` i överordnad katalog kan återställa både
  tidigare receiver och validator; ingen återställning behövde köras.
- `messages.php`, `delivery.php` och `quote-fields.json` installerades först,
  validatorn byttes atomiskt och receivern byttes atomiskt **sist**.
  Aktiveringstid UTC: **2026-11-05T23:00:57Z**. Alla installerade källfiler matchar
  Git exakt. PHP 8.3.36-syntax och laddning av PHPMailer/leveranskod passerade.
  Aktiv receiver passerade dessutom ett CLI-test med tom indata: väntad 413
  före SMTP, utan HTTP-anrop eller mejlsändning.
- Installerad receiver SHA-256:
  `eb4f2b5d1e1476cccdf247988dc8f889ed1982fb86526c48f68b3194be66548f`.
  Installerad validator SHA-256:
  `a7f9ddf4ee59636b8f52d943c72777d8f432118a525cc819b6673be13be42385`.
  Stödfilernas hashar motsvarar det verifierade kandidatarkivet beskrivet nedan.
  Konfiguration, SMTP-inställningar/lösenord, vendor, rate-cleanup och publik
  bootstrap är oförändrade och återverifierades även efter liveinskicket.

### Ett liveinskick och två separata mejl

Exakt ett slutligt **Skicka förfrågan** gjordes i den verkliga publicerade
sexstegsguiden, med `andreas@amelio.se` och uttrycklig märkning som syntetiskt
releasetest, ingen verklig offertförfrågan. Ingen upprepning gjordes.

- Referens: **`bd890a1c2bd661b183b91dd2`**. Mottagartid UTC i primärmejlet:
  **2026-11-05 23:03:09**.
- Webbläsaren omdirigerades till `/offert/tack/`, utan referens eller
  personuppgifter i URL. Tacksidan visade rätt referens, att Amelio tagit emot
  förfrågan och att kundkopian lämnats till e-posttjänsten. Visuell granskning
  och skärmbild sparades lokalt i `reports/issue-29/final-thank-you.jpg`.
- Gmail-kopplingen verifierade **två olika Gmail-ID och RFC Message-ID** i
  samma inkorg. Originalet har ämnet `Ny hallförfrågan [referens]` och
  `To: kontakt@amelio.se`; kundkopian har ämnet
  `Kopia av din hallförfrågan [referens]` och `To: andreas@amelio.se`.
  Båda innehåller exakt samma referens och de svenska svaren `Lager eller
  förvaring`, `Jag behöver hjälp med storleken`, `Vet inte` och `Osäker`.
  Detta är två separata mejl, inte två visningar av ett vidarebefordrat mejl.
- Andreas bekräftade uttryckligen i chatten: **båda separata mejlen har kommit
  med samma referens**. SMTP-acceptans hålls därför åtskild från den ytterligare
  verifierade inkorgsleveransen. Befintlig gallring inom 30 dagar gäller båda
  kopiorna och relevanta vidarebefordrings-/papperskorgskopior; inget nytt
  gallrings- eller e-postflöde infördes.

### Tillfällig åtkomst avslutad

Nyckeln använde `restrict`, `expiry-time="20261106025712Z"` och fingeravtryck
`SHA256:kIWnf1u/JKgJ1FMMA/zp21j0reljQ59FEm4YMh80rTo`. Efter inkorgsbekräftelsen
togs exakt en nyckelrad bort atomiskt, med alla andra bytes bevarade och
filrättighet 0600. En ny BatchMode-anslutning utan agent eller återanvänd
anslutning nekades med exit 255. De lokala privata och publika nyckelfilerna
är raderade. Privat backup och återställningsväg finns kvar på servern.

Design, frågor, övriga funktioner, integritetshantering, SMTP, WordPress,
DNS och kundens framtida hostingkonto har inte ändrats i installationen.

---

## Historisk releasestatus – återstart efter PR #32 (2026-11-05)

Andreas godkände hela återstartsplanen, inklusive merge/publicering, privat
installation och exakt ett syntetiskt liveinskick. Releasen stoppades vid
en strikt bytekontroll **före någon privat filinstallation**. Inget inskick
gjordes. PR #31 ligger kvar som Draft; ingen ny publicering följer av denna
dokumentationsuppdatering.

### Mergat, publicerat och verifierat

- PR #32:s exakta HEAD `e4e7945bcf712bc10ec401a8260120eb91cdc4eb` hade alla
  kontroller gröna. Main och preview var oförändrade före merge. PR #32
  mergades till **`931e2149d5477e33aaa4d19bbaa7ad264b04d320`**.
- Ny ordinarie main-körning
  [42121351331](https://github.com/Amelio-AB/hallpartner/actions/runs/42121351331)
  är helt grön: validering, publicering, original-/HTTP-kontroller och
  läsande live-Chrome. Vanlig CI
  [42121351071](https://github.com/Amelio-AB/hallpartner/actions/runs/42121351071)
  är också grön. Den gamla misslyckade körningen startades inte om.
- SSH och HTTPS bekräftar publicerad commit `931e214` och rätt run-ID.
  Alla **117 originalfiler** i publiceringsinventeringen verifierades
  med full SHA-256 via SSH. Markörens `verifiedAt` är
  `2026-11-05T22:45:29.998Z`. Inventeringens SHA-256:
  `19a3e34a54434650ab845973405ab7e360c4080af71cc1e79493527542852d87`.
  Manifestets SHA-256:
  `9884cb94e43be4bd00abb644709855661e340903bd61b47d3ce4a286de296a88`.
- Backupen nedan verifierades före merge mot samtliga berörda privata
  original och dåvarande statiska preview. Den behövde inte tas om.

### Korrekt kandidatarkiv, men avvikande installerad validator

- Arkivet för exakt publicerad commit har SHA-256
  `d1c1a36416f081f825c78246e007e2ae60dee5a0f59f7ff0576a4ef2f84be9f0`.
  Alla sju filer matchar råa Git-blobbar byte för byte. Arkivhash och
  samtliga filhashar verifierades efter överföring och uppackning på servern.
  PHP 8.3.36-syntax, oberoende validerings-/rate-limit-test samt svensk
  sammanfattning och laddning av delivery-koden passerade utan SMTP.
- Inaktiv staging finns i
  `/home/s164937/hallpartner-leads/.release-issue29-restart-20261105`.
  Det tidigare nekade CRLF-arkivet användes inte.
- Aktiveringsskriptet antog att befintlig `validator.php` redan hade exakt
  samma bytes som Git och skulle därför lämnas orörd. Den strikta `cmp`-
  kontrollen nekade filen **innan stödfiler eller receiver installerades**.
  Den aktiva filen är 12 091 byte med 266 CRLF-radslut och SHA-256
  `39fd8ffac6ad078c70394b4cb9f647f2f0aef67c9ffbba342959328a9d7751f0`.
  Git-kandidaten är 11 825 byte med LF och SHA-256
  `a7f9ddf4ee59636b8f52d943c72777d8f432118a525cc819b6673be13be42385`.
  Läsande diagnostik visade enbart radslutsskillnader; detta användes
  **inte** som accepterad byte-/hashkontroll och inga filer normaliserades.
  `rate-cleanup.php` är däremot redan exakt byteidentisk med Git.
- Efter stoppet verifierades aktiv receiver, validator, rate-cleanup,
  konfiguration, composer-filer, smtp-smoke och publik bootstrap mot backupen.
  De är oförändrade. `messages.php`, `delivery.php` och `quote-fields.json`
  saknas fortfarande i aktiv katalog. Ingen receiver-temporärfil skapades.

Den nya statiska frontendversionen är publicerad, men den tidigare privata
mottagaren är fortsatt aktiv. Frontenden är kompatibel med dess äldre svar:
saknad kundkopiestatus visas som obekräftad. **Kundkopian är inte installerad
eller liveverifierad. Noll syntetiska liveinskick gjordes i återstarten.**

### Åtkomst avslutad och återstående arbete

Nyckeln hade `restrict`, `expiry-time="20261106022032Z"` och fingeravtryck
`SHA256:Or8486MyZtci0Cl3DPoCHSSq/gzli29xy1waqNHypZ0`. Efter stoppet togs exakt
dess rad bort atomiskt; övriga bytes bevarades, filrättighet 0600. En ny
BatchMode-anslutning med enbart denna nyckel nekades med exit 255. Lokala
privata och publika nyckelfiler är raderade.

Nästa kontrollerade installation behöver även omfatta **Git-exakt
`validator.php`**, med verifierad backup av den befintliga CRLF-filen och
återställning av båda filerna vid ett fel efter byte. Ersätt filen med den
verifierade kandidatens bytes; acceptera inte en normaliserad hash eller
ändra aktiv fil på plats. Ingen ny statisk publicering behövs enbart för
denna installationsrättning om main, preview och kandidat fortfarande är
oförändrade. Därefter återstår exakt ett liveinskick, redirect/tacksida,
två separata mejl med samma referens, Andreas inkorgsbekräftelse och ny
åtkomststängning. Ingen testförfrågan ska skickas som följd av denna checkpoint.

Design, frågor, SMTP-inställningar/lösenord, integritet, WordPress och DNS
har inte ändrats i återstarten.

---

## Historisk releasestatus – första stoppet före publicering (2026-11-05)

Andreas godkände uttryckligen merge, kontrollerad previewrelease, privat
PHP-installation och **ett enda** syntetiskt inskick med besökaradressen
`andreas@amelio.se`. Godkännandet ersätter kandidatens tidigare väntan på
godkännande nedan. Vid ett kritiskt fel ska releasen stoppas och den fungerande
versionen säkras, utan upprepade testinskick.

- Arbetsmappen var ren. PR #30:s exakta HEAD
  `de8569b7a513eaec8edc8ca5ca1e6ac8cf8b2f48` hade fortsatt gröna CI-,
  Footer- och previewkontroller. PR #30 mergades med SHA-kontroll till
  **`4e9d1f7c6c71e5b1e439292710ded649f2d2ead6`**.
- Vanlig main-CI [42114236938](https://github.com/Amelio-AB/hallpartner/actions/runs/42114236938)
  är grön. Den automatiska publiceringskörningen
  [42114236597](https://github.com/Amelio-AB/hallpartner/actions/runs/42114236597)
  **stoppades i valideringen**: `Chrome debugging target unavailable` vid
  första sidan, `index-html`, 2026-11-05T21:38:43Z. Node-, PHP-, isolerade
  SMTP-, bygg-, säkerhets- och HTML-kontroller hade passerat. Felet visar
  att Chrome-testet inte fick en debugging-anslutning; det bevisar inte
  ett fel i webbplatsens funktion. Ingen omkörning har startats.
- Jobbet **publish hoppades över**. Både SSH-läst servermarkör och HTTPS
  bekräftar fortsatt publicerad commit
  **`6b175c5636022420f6712f664c85209f88fea2d0`**, körning `42102526488`.
  Aktiv `receiver.php` och `config.local.php` jämfördes byte för byte med
  backupen efter stoppet och är oförändrade. Inga PHP-ändringar installerades.
- **Noll syntetiska liveinskick** har gjorts i detta releaseförsök. Varken
  primärmejl, besökarkopia eller redirect på den nya liveversionen har
  därför leveransverifierats. Tidigare testbevis får inte användas som
  bevis för denna ännu opublicerade funktion.

### Verifierad backup och inaktiv kandidat

Backup ligger privat på den befintliga Inleed-servern:
`/home/s164937/hallpartner-leads/.release-issue29-20261105/backup`.
Katalogen är 0700. Befintliga privata filer, inklusive konfigurationen,
kopierades med bevarade rättigheter och verifierades med `cmp` och SHA-256.
Konfigurationsvärden och lösenord skrevs aldrig ut. Avsändare, SMTP-login
och mottagare verifierades som `kontakt@amelio.se`, korrekt preview-Origin
och enbart V2 var tillåtna; inga värden ändrades.

- Säkerhetskopierad aktiv receiver SHA-256:
  `e528409deff905e6172725af351e47a65b0db977f2e7d1b514be46ff2e746a15`.
- Privat råbackup `public-preview.tar` jämfördes mot dåvarande serverfiler
  med `tar -d`, med oförändrad markör före och efter. SHA-256:
  `f8cca732f726321cc454af07ce03dff07307a098c1d450c5f21e9c433f205cf7`.
- Publik bootstrap är oförändrad med tidigare verifierad SHA-256
  `7d252addd5378e98ddb42871934190800800e076318661b3d66c1a202a89e7ef`.
- Kandidatarkivet överfördes endast till den privata, inaktiva `stage`-
  katalogen. Dess bytekontroll mot råa Git-blobbar **nekade samtliga sju
  filer**. Lokal undersökning bevisade att Windows `core.autocrlf=true`
  hade gett arkivet CRLF i stället för Git-blobbarnas LF, utan andra
  textskillnader. Ingen fil accepterades genom normaliserad hashkontroll.
  Vid återupptagning ska ett nytt arkiv med exakta Git-bytes skapas och
  byteverifieras innan syntax- och regressionstester körs på servern.

### Tillfällig SSH-åtkomst avslutad

Den nya Ed25519-nyckeln verifierades först med `BatchMode`, `IdentitiesOnly`
och läsande kommandon mot konto `s164937`, server `ns15`, PHP 8.3.36.
Nyckeln installerades med `restrict` och
`expiry-time="20261106013202Z"` (fyra timmar från skapandet).
Fingeravtryck: `SHA256:Mhcko2gRXkEQCI2hHOPctYRsga/lJZEjc8ngi0JJ9oQ`.

Efter releasestoppet togs exakt en matchande nyckelrad bort atomiskt.
Alla andra nyckelrader bevarades byte för byte; filrättigheten är 0600.
Återläsning visade noll matchningar. En ny anslutning med enbart den
tillfälliga nyckeln nekades med `Permission denied`, exit 255.
De lokala privata och publika nyckelfilerna raderades efter verifieringen.

**Nästa steg:** utred Chrome-startfelet och rätta kandidatartefaktens
radslut innan ett nytt kontrollerat releaseförsök. Ingen SMTP-retry,
installation eller publicering ska göras som en följd av denna
dokumentationsuppdatering. Kundens WordPress, DNS, SMTP-inställningar,
integritetshantering och framtida Inleed-konto har inte ändrats.

---

Nedan följer kandidatens tidigare implementation och releaseplan.

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
- HTML-/migrationskontrakt verifierade för både AMP-sidfoten och legacy-
  reservsidfoten: canonical, noindex, länkar, ankare och avgränsad sitemap.
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
