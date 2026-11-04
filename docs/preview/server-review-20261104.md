# Servergranskning och filvis plan – 2026-11-04

**NO-GO för publicering. Ingen serverändring eller radering har utförts.**

## Färsk observation

[FTPS-beviset](target-proof-20261104.json) från [valideringskörning 41791114322](https://github.com/Amelio-AB/hallpartner/actions/runs/41791114322) på 4d39a09b3671c96051ad5a58e007b557bdf7adc0 visar 25 kataloger, hash för samtliga 63 filer och samma 63 filer och samma 12 förbjudna sökvägar som 2026-11-03. Markören matchar via FTPS och preview-HTTPS och ger 404 på hallpartner.se och www. Konto-bindningens hash är oförändrad. Detta är ett observerat samband, inte en granskning av hela Inleed-kontots domän-/vhostkonfiguration.

[HTTPS-inventeringen](https-inventory-20261104.json) omfattar de 63 tidigare filerna samt de två nya publiceringsmarkörerna. 62 gamla filer ger 200; cgi-bin/.htaccess ger 403. hp-preview-deploy.json och hp-preview-inventory.json ger 404. Ingen exakt aktuell commit kan därför intygas via den nya processens markör. Historiskt publicerades PR #5-kandidaten db0d81082cf8ad4438ec830675e6107801ebacf3 i [ops-körning 41585184091](https://github.com/Amelio-AB/hallpartner/actions/runs/41585184091). Den historiska uppgiften är inte ett bevis på att varje byte varit oförändrad sedan dess.

De fyra gamla interna sidornas hashvärden matchar förra inventeringen. Även 18 av 18 tidigare inventerade publika bildfiler är byteidentiska. Samtliga sju README-filer matchar Git-källan från den tidigare publicerade PR #5-kandidaten. Övriga ändringar jämförs bara där tidigare filhash faktiskt finns; oförändrade sökvägar bevisar inte oförändrat innehåll. Den utökade läsande FTPS-kontrollen har passerat. 44 av 62 HTTP-läsbara filer är byteidentiska med FTPS; 18 HTML/XML-filer skiljer sig, se nedan. .htaccess är 17 byte och har en FTPS-hash; rå konfiguration publiceras inte i rapport/artifacts. Vhost- och kontoisoleringen är fortfarande inte verifierad.

## Ny blockerare: omskrivning i HTTP-leveransen

[Bytesjämförelsen](http-ftps-comparison-20261104.json) visar 44 identiska filer och 18 avvikande HTML/XML-svar. Att enbart ersätta previeworigin med https://hallpartner.se i respektive HTTP-svar återger exakt den hash som lästes via FTPS för alla 18. Tolv publika HTML-sidor, fyra interna HTML-sidor och två sitemap-filer berörs. Det är en observation som talar för domänomskrivning i HTTP-/proxylagret; faktisk Inleed-konfiguration är inte granskad. Nya HTTP-läsningar gav samma avvikande bytes.

Det nya publiceringspaketet innehåller också kanoniska produktions-URL:er. Befintlig strikt efterkontroll skulle därför kunna misslyckas EFTER överföringen. Denna PR lägger till en förkontroll av befintliga tillåtna fjärrfiler: skillnad mellan FTPS och HTTPS blockerar före första fjärrskrivningen. Läsande PR-inventering redovisar avvikelser utan att påstå publiceringsberedskap. Ingen normalisering, tillåten differens eller sänkt hashkontroll införs.

Inleed/kontoägaren behöver bekräfta mekanismen och en separat godkänd lösning för just previewn. Exempel är en isolerad previewrot utan omskrivning, eller en separat granskad preview-byggkonfiguration som ger avsedda bytes. Ingen sådan server- eller webbplatsändring görs här. En tom ny root har inga HTML-filer att jämföra, så befintlig målbevisning ersätter inte granskning av konfiguration eller det godkända första överföringstestet.

## Exakta förbjudna filer

| Sökväg relativt login-root | HTTPS | Aktuell SHA-256 för FTPS-filen | Föreslagen hantering, inte godkänd åtgärd |
| --- | --- | --- | --- |
| `cgi-bin/.htaccess` | 403 | `74d7c0a057cc6a4e4b762757f8f69194a1249028bff3ede8ed80a66f06494d21` (FTPS; HTTP 403) | Ingen åtgärd utan separat konfigurationsgodkännande |
| `icons/README.md` | 200 | `1c262517dabccc64c33139a480e96ec15c236080b919d55332021a9a6f85b3d6` | Separat godkännande krävs för borttagning ur publik root |
| `images/README.md` | 200 | `e862e9c3b031088a45fd01cfeb9889c0bebb09a99381011ceafc73556ce566ca` | Separat godkännande krävs för borttagning ur publik root |
| `images/details/README.md` | 200 | `92041db8295f2b1b1f8cb50c5168913adb37015958ec067ca3e7b69de9eb5374` | Separat godkännande krävs för borttagning ur publik root |
| `images/hero/README.md` | 200 | `693c87961fa11a9508ec9aad501c82b999f81309559f5c973410b51dfa9ba60c` | Separat godkännande krävs för borttagning ur publik root |
| `images/projects/README.md` | 200 | `ba27d8522e1130f4b93e0b771180dc0637213c72de6e21d053817a0effdabc32` | Separat godkännande krävs för borttagning ur publik root |
| `logos/README.md` | 200 | `fc3dc66d3ec98debb77ae3863944b3822b1e8bc9dbdbaf73d7cb6178b6b2d101` | Separat godkännande krävs för borttagning ur publik root |
| `projekt/index.html` | 200 | `350ba10482671ff1d4fc50c715c6f91835f3fe80edc6eadd6216f3361f8f9300` | Separat godkännande krävs för borttagning ur publik root |
| `roadmap/index.html` | 200 | `178f038adf55d310343865349615a8766aa98397c66c97f4fbfcc7536d9c685a` | Separat godkännande krävs för borttagning ur publik root |
| `videos/README.md` | 200 | `ce5e6f9bc7e6366156121913ae4edc633be3281f0b25c0ff04a87f9d18a24ede` | Separat godkännande krävs för borttagning ur publik root |
| `vision/index.html` | 200 | `ac57cb68573bd9d90355e4264e304aff387d948d7568b973d9632ddb115617cc` | Separat godkännande krävs för borttagning ur publik root |
| `workshop/index.html` | 200 | `a216d98e9376d285052dd21fdc13d4efa939bb2074f527e99d23c68a828b6fc6` | Separat godkännande krävs för borttagning ur publik root |

HTML-sidorna är äldre interna vision-/arbetsunderlag och strider mot den nya publika tillåtelselistan. /projekt/ ska inte vara en publik referenssida innan riktiga projekt finns. README-filerna är källdokumentation och ska inte publiceras. .htaccess kan skydda CGI-/servermiljön: att HTTP svarar 403 styrker inte att filen är överflödig. Varken den eller cgi-bin får ändras utan separat godkännande.

## Backup, isolering och godkännande

Alla 62 HTTP-läsbara gamla filer har sparats lokalt i en åtkomstskyddad backup under Andreas Windows-konto, utanför GitHub. Hasharna har verifierats efter lokal skrivning. 44 kopior matchar även FTPS-bytes, inklusive de sju README-filerna. De 18 omskrivna HTML/XML-svaren, däribland de fyra interna sidorna, är endast HTTP-snapshots och får INTE behandlas som byteidentisk återställningsbackup för serverfilerna. En riktig privat FTPS-backup av dessa behövs före ändring. Den exakta privata backupplatsen redovisas i överlämningen, inte som en publik serveradress. .htaccess har inte kunnat säkerhetskopieras via HTTPS. En FTPS-hash är inte en återställningsbackup; serverkonfigurationen måste säkerhetskopieras privat av kontoägaren innan någon åtgärd.

Förstahandsalternativet är en ren, separat previewrot och ett konto begränsat till den roten, om Inleed kan ordna det utan påverkan på andra tjänster. Varken ny root, domänkoppling, credentials eller kontrollmarkör skapas i denna uppgift. En ny koppling kräver ny markörbevisning, granskad kontobindning och separat godkännande.

Om befintlig root måste användas: kontoägaren/Inleed granskar vhost-mappning, FTP custom root, andra domäner och cgi-bin/.htaccess. Gör därefter en full relevant privat backup med hashkontroll, ny inventering och konsekvensbedömning. De elva exakta HTML-/README-filerna ovan kan föreslås tas bort ur den publika roten efter Andreas separata godkännande. Ingen katalogrensning, wildcard, --delete eller rekursiv radering ska användas. Serverkonfigurationen har en separat beslutspunkt och får inte omfattas av ett allmänt städnings-GO.

## Andra gamla filer

[Den fullständiga filplanen](remote-file-plan-20261104.json) redovisar alla 63 filer. Även 26 gamla statiska filer utanför nya manifestet behöver hanteras; de tolv förbjudna filerna är alltså inte den enda spärren. Dessa övriga filer kan prövas för individuell hashbunden retention där policyn tillåter det, eller lämnas i en arkiverad gammal root när en ny isolerad root införs. Inga retentiongodkännanden har lagts in. Äldre bilder utanför kandidatens 51 bildfiler får inte automatiskt omfattas av det nya registret.

## Kvar före första publicering

- Full FTPS-hash-/kataloginventering och 51/51 bildgodkännanden har passerat på ovan angiven kod-HEAD. Den nya förkontrollen och slutlig HEAD verifieras i PR-kontrollerna.
- Lös domänomskrivningen för previewn med separat granskat beslut; efterkontrollens krav på exakta bytes kvarstår.
- Verifierad kontoisolering och privat backup av berörd serverkonfiguration.
- Separat godkänd filvis städning eller isolerad root; därefter ny inventering och eventuella granskade retentionposter.
- Granskad targetBindingSha256/targetEvidence i releasekonfigurationen; dessa är fortfarande null.
- Äldre ops 405335800 och 405334470 måste bli disabled_manually före aktivering av 316932905. Inga workflowstatusar har ändrats.
- Granskning av oskyddad main och preview-environment utan reviewers.
- Godkänd merge, exakt slutlig main-SHA och Andreas separata slutliga GO innan aktivering eller uppladdning.

Ingen commit är tekniskt klar för publicering ännu. Se [aktiveringsordningen](README.md) för stegen efter att blockerarna lösts.
