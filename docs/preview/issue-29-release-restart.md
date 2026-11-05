# Issue #29 – tekniska releasegrindar och återstart

**Senaste läge efter godkänd återstart:** PR #32 är mergad och `931e214` är
publicerad med grön körning `42121351331`. PHP-aktiveringen stoppades före
filinstallation eftersom den redan aktiva `validator.php` har CRLF och inte
matchar kandidatens exakta Git-bytes. Kandidatarkivet är korrekt. Aktiv
mottagare/konfiguration är oförändrade, inget liveinskick har gjorts och
SSH-nyckeln är återkallad. Se
[aktuell checkpoint](../checkpoints/2026-11-05-issue-29-offert-confirmation.md).
Nästa installation måste omfatta även Git-exakt validator med backup och
återställning; ingen normaliserad hashjämförelse får ersätta detta.

Nedan följer den tidigare återstartsplanen och dess tekniska bakgrund.

Utgångspunkt 2026-11-05: `main` = `4e9d1f7c6c71e5b1e439292710ded649f2d2ead6`.
[Draft PR #31](https://github.com/Amelio-AB/hallpartner/pull/31) behålls
oförändrad som checkpoint för den stoppade releasen. Denna tekniska PR får
inte mergas förrän publicering åter tillåts: push till main startar publicering.

## Chrome: belägg och rättning

I [körning 42114236597](https://github.com/Amelio-AB/hallpartner/actions/runs/42114236597)
misslyckades första sidans Chrome-start före webbplatskontrollerna. Artefaktens
`index-html-chrome-stderr.log` innehåller D-Bus-anslutningsfel men ingen
`DevTools listening`-rad. Det bevisar inte att D-Bus var grundorsaken.
Ingen processstatus, browser-version eller sista HTTP-fel sparades då;
portkonflikt och långsam/stannad Chrome-start går inte att skilja i efterhand.

`chrome-session.mjs` ersätter PID-baserad port med `--remote-debugging-port=0`
och läser `DevToolsActivePort` i en unik temporär profil. Den kontrollerar
browser-identitet och sidans loopback-endpoint, fångar processfel och tidig
exit, och använder en 45-sekunders startgräns samt begränsade HTTP-anrop.
Ingen automatisk omstart eller upprepning av sidtest görs. JSON-bevis sparar
version, runner-image, argument, tider, processstatus, stdout/stderr och
sista nätverksfelets orsak. Startfel, sidassertioner och protokollfel märks
separat. Den egna temporära profilen städas efter processavslut.

En separat kontroll öppnar endast `about:blank` och verifierar CDP/WebSocket
innan webbplatstesterna. Samma kontroll körs före eventuell framtida FTPS-
publicering på publiceringsjobbets egen runner. Alla befintliga sidassertioner,
sex bredder, API-blockering, no-JS-kontroller och säkerhetsgrindar kvarstår.
Headless-läget följer [Chromes dokumentation](https://developer.chrome.com/docs/automation-and-testing/headless).

## Exakt PHP-arkiv

Det nekade arkivet hade CRLF i samtliga sju filer, medan Git-blobarna hade LF.
`git archive` på Windows hade ärvt `core.autocrlf=true`. Det nya kommandot
åsidosätter `core.autocrlf=false` och `core.eol=lf` enbart för arkivbygget;
lokal konfiguration och arbetsfiler ändras inte.

```bash
node scripts/preview/php-candidate.mjs build FULL_COMMIT_SHA reports/preview/php-candidate
node scripts/preview/php-candidate.mjs verify FULL_COMMIT_SHA reports/preview/php-candidate/receiver-candidate.tar
```

Byggaren tillåter endast sex privata källfiler och det oberoende PHP-testet.
Varje tar-post jämförs direkt med `git cat-file blob`: full SHA-256 och exakt
bytejämförelse. Extra/dubbla poster nekas. Manifestet innehåller commit,
filstorlekar, filhashar och arkivhash. `ARCHIVE_SHA256` verifierar transporten;
`CANDIDATE_SHA256` verifierar uppackade filer. Ingen radslutsnormalisering
görs vid jämförelse. Konfiguration, vendor, SMTP-hemligheter och persondata
ingår aldrig. Windows/Linux-tester kräver att CRLF och ändrade bytes nekas.

## Kontrollerad återstart – återstår

1. Kräv gröna kontroller för den tekniska PR:ens exakta HEAD, inklusive
   ordinarie previewvalidering och arkivtest på Windows/Linux. Kontrollera
   att main, PR #31 och live-markören fortfarande stämmer. Ingen omkörning
   av den misslyckade main-publiceringen: den använder gammal testkod.
2. Invänta klartecken att återuppta publicering. Återställ därefter tillfällig
   SSH med Ed25519, `restrict`, fyra timmars `expiry-time`, lokal privatnyckel
   utanför Git och läsande BatchMode-verifiering. Befintliga nycklar bevaras.
3. Kontrollera tidigare privata backuper med fulla hashar och ta ny verifierad
   backup av aktuella berörda filer. Bevara `config.local.php`, SMTP/lösenord,
   vendor, rate-data och publik bootstrap exakt. Kontrollera baseline innan
   någon aktivering; använd inte det gamla CRLF-arkivet.
4. Efter godkänd merge kör ordinarie main-workflow sina befintliga grindar.
   Verifiera statisk publicering med markör, originalfiler och läsande
   live-kontroller. Bygg/verifiera PHP-arkivet för exakt publicerad main-SHA.
5. Verifiera arkivhash efter överföring och samtliga filhashar efter uppackning
   i inaktiv staging. Kör PHP-syntax och oberoende test. Installera stödfiler
   först och byt receiver atomiskt sist enligt den tidigare releaseplanen.
6. Genomför ett enda godkänt syntetiskt inskick i den riktiga guiden med
   `andreas@amelio.se`. Verifiera tacksida, svenska svar och samma referens i
   primärmejl till `kontakt@amelio.se` och besökarkopia till `andreas@amelio.se`.
   Vid osäker leverans: inga upprepade inskick. Stoppa vid kritiskt fel och
   säkra den tidigare fungerande versionen.
7. Dokumentera faktisk publicerad commit och resultat i GitHub, ta bort exakt
   den tillfälliga SSH-nyckeln och verifiera nekad ny anslutning.

Ingen ändring av guidens funktioner, frågor, design eller integritet görs här.
Ingen SSH-installation, publicering, main-omkörning eller liveinskick ingår
i denna rättningsomgång. Tidigare godkända funktionstester behöver inte köras
manuellt igen; de befintliga automatiska GitHub-grindarna är kvar.
