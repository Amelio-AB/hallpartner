# Servergranskning och filvis plan – 2026-11-04

**NO-GO för publicering. Ingen serverändring eller radering har utförts.**

## Färsk observation

[FTPS-beviset](target-proof-20261104.json) från valideringskörning 41785461912, försök 2, visar samma 63 filer och samma 12 förbjudna sökvägar som 2026-11-03. Markören matchar via FTPS och preview-HTTPS och ger 404 på hallpartner.se och www. Konto-bindningens hash är oförändrad. Detta är ett observerat samband, inte en granskning av hela Inleed-kontots domän-/vhostkonfiguration.

[HTTPS-inventeringen](https-inventory-20261104.json) omfattar de 63 tidigare filerna samt de två nya publiceringsmarkörerna. 62 gamla filer ger 200; cgi-bin/.htaccess ger 403. hp-preview-deploy.json och hp-preview-inventory.json ger 404. Ingen exakt aktuell commit kan därför intygas via den nya processens markör. Historiskt publicerades PR #5-kandidaten db0d81082cf8ad4438ec830675e6107801ebacf3 i [ops-körning 41585184091](https://github.com/Amelio-AB/hallpartner/actions/runs/41585184091). Den historiska uppgiften är inte ett bevis på att varje byte varit oförändrad sedan dess.

De fyra gamla interna sidornas hashvärden matchar förra inventeringen. Även 18 av 18 tidigare inventerade publika bildfiler är byteidentiska. Samtliga sju README-filer matchar Git-källan från den tidigare publicerade PR #5-kandidaten. Övriga ändringar jämförs bara där tidigare filhash faktiskt finns; oförändrade sökvägar bevisar inte oförändrat innehåll. Den nya läsande FTPS-kontrollen i denna PR kompletterar med kataloger och hash för varje fjärrfil på slutlig HEAD.

## Exakta förbjudna filer

| Sökväg relativt login-root | HTTPS | Aktuell SHA-256 för filen | Föreslagen hantering, inte godkänd åtgärd |
| --- | --- | --- | --- |
| `cgi-bin/.htaccess` | 403 | Ej läsbar via HTTPS; 403-body är inte filhash | Ingen åtgärd utan separat konfigurationsgodkännande |
| `icons/README.md` | 200 | `1c262517dabccc64c33139a480e96ec15c236080b919d55332021a9a6f85b3d6` | Separat godkännande krävs för borttagning ur publik root |
| `images/README.md` | 200 | `e862e9c3b031088a45fd01cfeb9889c0bebb09a99381011ceafc73556ce566ca` | Separat godkännande krävs för borttagning ur publik root |
| `images/details/README.md` | 200 | `92041db8295f2b1b1f8cb50c5168913adb37015958ec067ca3e7b69de9eb5374` | Separat godkännande krävs för borttagning ur publik root |
| `images/hero/README.md` | 200 | `693c87961fa11a9508ec9aad501c82b999f81309559f5c973410b51dfa9ba60c` | Separat godkännande krävs för borttagning ur publik root |
| `images/projects/README.md` | 200 | `ba27d8522e1130f4b93e0b771180dc0637213c72de6e21d053817a0effdabc32` | Separat godkännande krävs för borttagning ur publik root |
| `logos/README.md` | 200 | `fc3dc66d3ec98debb77ae3863944b3822b1e8bc9dbdbaf73d7cb6178b6b2d101` | Separat godkännande krävs för borttagning ur publik root |
| `projekt/index.html` | 200 | `968fe1af3a3fb283fd63520144ccea4c0664b888752c791257b552acea573003` | Separat godkännande krävs för borttagning ur publik root |
| `roadmap/index.html` | 200 | `c5b77d533867e5bb4f17612c983de6debfb8264afe8bf5a7455b8d546eedf677` | Separat godkännande krävs för borttagning ur publik root |
| `videos/README.md` | 200 | `ce5e6f9bc7e6366156121913ae4edc633be3281f0b25c0ff04a87f9d18a24ede` | Separat godkännande krävs för borttagning ur publik root |
| `vision/index.html` | 200 | `ddc3f4b6c0ecc7771cc513ae0d4dd10ee4692216c5ec0d26f893283b0784762f` | Separat godkännande krävs för borttagning ur publik root |
| `workshop/index.html` | 200 | `7fbf2242e010ff87e2350f12e9eb4a2fc9a15074a012b325365ae13c2d71b7f4` | Separat godkännande krävs för borttagning ur publik root |

HTML-sidorna är äldre interna vision-/arbetsunderlag och strider mot den nya publika tillåtelselistan. /projekt/ ska inte vara en publik referenssida innan riktiga projekt finns. README-filerna är källdokumentation och ska inte publiceras. .htaccess kan skydda CGI-/servermiljön: att HTTP svarar 403 styrker inte att filen är överflödig. Varken den eller cgi-bin får ändras utan separat godkännande.

## Backup, isolering och godkännande

Alla 62 HTTP-läsbara gamla filer har sparats lokalt i en åtkomstskyddad backup under Andreas Windows-konto, utanför GitHub. Hasharna har verifierats efter skrivning, inklusive samtliga elva berörda publika HTML-/README-filer. Den exakta privata backupplatsen redovisas i överlämningen, inte som en publik serveradress. .htaccess har inte kunnat säkerhetskopieras via HTTPS. En FTPS-hash är inte en återställningsbackup; serverkonfigurationen måste säkerhetskopieras privat av kontoägaren innan någon åtgärd.

Förstahandsalternativet är en ren, separat previewrot och ett konto begränsat till den roten, om Inleed kan ordna det utan påverkan på andra tjänster. Varken ny root, domänkoppling, credentials eller kontrollmarkör skapas i denna uppgift. En ny koppling kräver ny markörbevisning, granskad kontobindning och separat godkännande.

Om befintlig root måste användas: kontoägaren/Inleed granskar vhost-mappning, FTP custom root, andra domäner och cgi-bin/.htaccess. Gör därefter en full relevant privat backup med hashkontroll, ny inventering och konsekvensbedömning. De elva exakta HTML-/README-filerna ovan kan föreslås tas bort ur den publika roten efter Andreas separata godkännande. Ingen katalogrensning, wildcard, --delete eller rekursiv radering ska användas. Serverkonfigurationen har en separat beslutspunkt och får inte omfattas av ett allmänt städnings-GO.

## Andra gamla filer

[Den fullständiga filplanen](remote-file-plan-20261104.json) redovisar alla 63 filer. Även gamla statiska filer utanför nya manifestet behöver hanteras; de tolv förbjudna filerna är alltså inte den enda spärren. Dessa övriga filer kan prövas för individuell hashbunden retention där policyn tillåter det, eller lämnas i en arkiverad gammal root när en ny isolerad root införs. Inga retentiongodkännanden har lagts in. Äldre bilder utanför kandidatens 51 bildfiler får inte automatiskt omfattas av det nya registret.

## Kvar före första publicering

- Färsk full FTPS-hash-/kataloginventering på slutlig PR-HEAD och verifiering av bildregistret i Linux-CI.
- Verifierad kontoisolering och privat backup av berörd serverkonfiguration.
- Separat godkänd filvis städning eller isolerad root; därefter ny inventering och eventuella granskade retentionposter.
- Granskad targetBindingSha256/targetEvidence i releasekonfigurationen; dessa är fortfarande null.
- Äldre ops 405335800 och 405334470 måste bli disabled_manually före aktivering av 316932905. Inga workflowstatusar har ändrats.
- Granskning av oskyddad main och preview-environment utan reviewers.
- Godkänd merge, exakt slutlig main-SHA och Andreas separata slutliga GO innan aktivering eller uppladdning.

Ingen commit är tekniskt klar för publicering ännu. Se [aktiveringsordningen](README.md) för stegen efter att blockerarna lösts.
