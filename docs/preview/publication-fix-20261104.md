# Publiceringsrättning 2026-11-04

Färskt serverbevis: 2026-11-04T11:32:27.841Z, [körning 41820401939](https://github.com/Amelio-AB/hallpartner/actions/runs/41820401939),
testad commit `c8b02d37c15ee429de42884cc5c3c737911d91d7`. Full validering passerade.

## Målbevis

Befintligt konto deploy@hallpartner.se verifierades i check-target; TLS-certifikat
och värdnamn kontrollerades av lftp utan undantag. Login-root ./ innehåller
målmarkören som också matchar preview-HTTPS och saknas på båda produktionsvärdarna.
Mappningen till /home/s164937/domains/hallpartner.se/public_html/ kommer från
Andreas dokumenterade kontouppgift; kontrollpanelen har inte granskats på nytt.
Ingen annan root, endpoint eller credential har skapats eller antagits.

Bindning: `585298685cee775cc96d387e369cccf145e3e0db4adc72d32d2fe6c285d64cbe`.
Hash av körningens target-proof.json: `b5895bc0124048e64501ab042421fa72199b4e63101bb229994656362d4588b3`.
63 filer och 25 kataloger; alla rå filhashar matchar föregående inventering.
51 tillåtna HTTP-leveranser passerar: 37 byteidentiska, 14 exakt omskrivna HTML/XML.
Tolv policyförbjudna filer inventeras separat och undantas inte från filhanteringsspärren.
[Full filvis inventering](server-file-decisions-20261104.json) innehåller endast
hash/metadata, inga rå serverfiler.

## Serverkonfiguration

Endast cgi-bin/.htaccess bevaras genom en explicit serverFiles-post.
Den färska FTPS-hashen `74d7c0a057cc6a4e4b762757f8f69194a1249028bff3ede8ed80a66f06494d21` och storleken 17 byte
matchar exakt det kända Apache-direktiv som stänger av kataloglistning, med LF.
Detta är en hashbaserad identifiering av originalets innehåll, inte en
nedladdad privat återställningskopia. Funktionen beskrivs i
[Apaches Options-dokumentation](https://httpd.apache.org/docs/2.4/mod/core.html#options).
HTTP 403 är kompletterande observation, inte grund för att radera filen.
Filen och cgi-bin lämnas orörda; inget annat dotfilundantag har lagts till.

## Verifierat och kvarvarande hinder

Den första fulla CI-körningen omfattade låst installation, check/lint, 54 Node-tester, PHP, audit,
bygge, 75 payloadfiler/51 bildfiler och Chrome på 13 sidor i sex bredder
(320, 390, 768, 1024, 1280, 1440), AMP-002, AMP-006 och galleri.
Npm-audit: 0 höga/kritiska, 9 måttliga; Composer: inga advisories.
Detta är kandidatkontroll, inte publiceringsbevis.

Äldre ops 405335800/405334470 är disabled_manually, utan köade/pågående jobb.
316932905 är fortfarande disabled_manually. Inga serverfiler har ändrats.
Previewns hp-preview-deploy.json och hp-preview-inventory.json gav HTTP 404
vid färsk kontroll. Senaste main är alltså inte verifierat publicerad.

Privat FTPS-råbackup saknas. De angivna Windows-backuperna avser lokala
arbetsfiler; tidigare preview-backup innehåller omskrivna HTTP-snapshots.
Ingen Hallpartner-anslutning finns i kontrollerad FileZilla-konfiguration eller
sessionens FTP-miljövariabler. GitHub Secrets har använts på runnern för
läsande kontroll; de har inte exporterats. För backup behövs befintlig
FTPS-åtkomst säkert tillgänglig lokalt, eller en privat FTPS-backup från
kontoägaren/Inleed som kan hashjämföras mot denna inventering. Skicka inga
lösenord i chatten och lägg inga rå serveroriginal i GitHub-artifacts.

Webbläsarkontroll av verklig preview via Computer Use stoppades eftersom
verktyget inte kunde fastställa aktuell Windows-URL säkert. CI-bilderna
gäller kandidaten, inte den äldre kundsynliga previewn.

## Exakt filvis beslutspunkt

Andreas har i denna session uttryckligen godkänt alternativ 1 i nedanstående
exakta filplan: de 13 namngivna filerna får tas bort efter verifierad privat
FTPS-råbackup och kontroll att det nya paketet inte använder dem. De 26 äldre
resurserna ska behållas tillfälligt med exakt angivna hashvärden. Skyddsfilen,
målmarkören och övrig serverkonfiguration ska bevaras. Ingen radering är ännu
utförd vid dokumentets kontrollpunkt. Först krävs verifierad privat råbackup
och ny hashkontroll. Nedan klassificeras alla extra filer; inga kataloger
får rensas rekursivt. De 22 filer som ingår i paketet ersätts först vid
godkänd publicering. Målmarkören bevaras.

### Elva publika demo-/README-filer: föreslagen borttagning efter separat beslut

| Fil | Byte | FTPS SHA-256 |
| --- | ---: | --- |
| `icons/README.md` | 350 | `1c262517dabccc64c33139a480e96ec15c236080b919d55332021a9a6f85b3d6` |
| `images/README.md` | 599 | `e862e9c3b031088a45fd01cfeb9889c0bebb09a99381011ceafc73556ce566ca` |
| `images/details/README.md` | 350 | `92041db8295f2b1b1f8cb50c5168913adb37015958ec067ca3e7b69de9eb5374` |
| `images/hero/README.md` | 514 | `693c87961fa11a9508ec9aad501c82b999f81309559f5c973410b51dfa9ba60c` |
| `images/projects/README.md` | 441 | `ba27d8522e1130f4b93e0b771180dc0637213c72de6e21d053817a0effdabc32` |
| `logos/README.md` | 518 | `fc3dc66d3ec98debb77ae3863944b3822b1e8bc9dbdbaf73d7cb6178b6b2d101` |
| `projekt/index.html` | 21074 | `350ba10482671ff1d4fc50c715c6f91835f3fe80edc6eadd6216f3361f8f9300` |
| `roadmap/index.html` | 12310 | `178f038adf55d310343865349615a8766aa98397c66c97f4fbfcc7536d9c685a` |
| `videos/README.md` | 446 | `ce5e6f9bc7e6366156121913ae4edc633be3281f0b25c0ff04a87f9d18a24ede` |
| `vision/index.html` | 8873 | `ac57cb68573bd9d90355e4264e304aff387d948d7568b973d9632ddb115617cc` |
| `workshop/index.html` | 47103 | `a216d98e9376d285052dd21fdc13d4efa939bb2074f527e99d23c68a828b6fc6` |

### Två gamla sitemaps: föreslagen borttagning efter separat beslut

| Fil | Byte | FTPS SHA-256 |
| --- | ---: | --- |
| `sitemap-0.xml` | 997 | `0a8173316cb8c79fb3c161f87c24e0ecd10acc2a6ce30dd398fa05aefa46bf2e` |
| `sitemap-index.xml` | 185 | `cf567677bcd31504b08eaece0160b69b83abf6f44304ac0ad47bdf9f907f1623` |

### Tretton gamla CSS-/JS-resurser: föreslagen tillfällig hashbunden retention

| Fil | Byte | FTPS SHA-256 |
| --- | ---: | --- |
| `_astro/BaseLayout.9miOOxgp.css` | 12971 | `c48ba466d900f9669e68d25fba8bb3747248541126f4eaa136a30555ded4a6b8` |
| `_astro/HallpartnerAmpHeaderReview.Bl7t1kAC.css` | 28769 | `681fce51faeb0484ada259a45056da9de730e0805492e7b3bba0fc1a3fb293fa` |
| `_astro/HallpartnerAmpHeaderReview.astro_astro_type_script_index_0_lang.C3UX410D.js` | 14568 | `82fd315cfcdf4e07527f38cebe614f56446074337c7e71ac927a067b48ac86fd` |
| `_astro/HallpartnerHomePrototype.BqoPkoSq.css` | 11424 | `d0daee75e850da2f109f7bddb61fda0947502f107ed67b815a4be3374e063263` |
| `_astro/hallar.CxoSSUF_.css` | 9436 | `bec4276c68290dc03af575248bb2ff54a580869397160b6c179f462f38fb7a07` |
| `_astro/hallpartner-amp-footer.CCKQcGo_.css` | 9009 | `3c4691e165f90b2733df2d58761b777cd8157f30348b5ae01174b47fc2ff1dc1` |
| `_astro/hallpartner-hall-detail.Dycg-4v0.css` | 9384 | `0743d85b80be9e739f309dd49f11d9dff1f42c7006fc8f8eba9138dbbe0f6c5e` |
| `_astro/index.B-04pRzj.css` | 7662 | `614f9a48a539f2055c767dddc6f67e59af5a4bb6e791d69dbb1326c208f4979b` |
| `_astro/index.CoVjVydE.css` | 10917 | `c864fd3026a982b6d20abb019cea370d92520d5823b46105cb2ef679ad53c31a` |
| `_astro/index.astro_astro_type_script_index_0_lang.DnxyHExG.js` | 14180 | `8aea1916451c58b8dae9e24b45dc0b63dde5a39a081d60f37e967875558f0ea8` |
| `_astro/index.tADN2pFz.css` | 6415 | `607b947d27e15aaa7f241d08141b422f899729c4cd2d0e4c95f9fe02ff7de23d` |
| `_astro/lagerhallar.Bk5ffRqu.css` | 9051 | `63584324b259405e65b6e77c8120e311428a6c41aad8c8763aa10d6373f98e26` |
| `_astro/maskinhallar.C6Pwgr9T.css` | 10508 | `f70be99ddb733bae7467c3e9a991318178dbf1445b2cede5dab39bc502959411` |

### Tretton Äldre bildfiler: specifikt retention-/borttagningsbeslut behövs

| Fil | Byte | FTPS SHA-256 |
| --- | ---: | --- |
| `_astro/lagerhall.GPeeZOoY_Z1O7orc.webp` | 12558 | `7b1cb51b756e23746b0a733abd3c36ba5a826f2f4064e04eb86c00c535568b3a` |
| `_astro/lagerhall.GPeeZOoY_ZWaSV7.webp` | 36150 | `e1bf0a2c5bef3dd27f60689439b08a7e59613fb176b6ffa04cffac08a853621b` |
| `_astro/lagerhall.GPeeZOoY_ZsTBw1.webp` | 25714 | `79c2add9399f1391fd6ad2746726d7fa5101b022104d6aa7e9111da07289edda` |
| `_astro/maskinhall.CY7PyZ0H_22cXX5.webp` | 20866 | `dcbcc14a44a6a246cf16645e1ddc25b03db717e98fb76802d8a021231cb220e9` |
| `_astro/maskinhall.CY7PyZ0H_Z26r2bW.webp` | 79838 | `aba28caa4d050abc5286dc967954729ec8a11c8c6ec653e1d6d5601567bfaa08` |
| `_astro/maskinhall.CY7PyZ0H_Z2lkW6i.webp` | 52472 | `642b36e3e397208ea97b1c1767291e1db13f2e66a6456dc5dbac94ac397a55c0` |
| `_astro/talthall.Bs7k6_C3_1dTXzQ.webp` | 77856 | `1e5b86751580bab76eae51a1e2b0c54274b25e138274ea9aa0c10fb4fc6ad3e7` |
| `_astro/talthall.Bs7k6_C3_Z5UAgg.webp` | 114268 | `983927ac9d1dbea7d0b75e5fe22dc7d91cde6e53365c02ccd0003422a2a03583` |
| `_astro/talthall.Bs7k6_C3_Zpu0oi.webp` | 131882 | `878acc13b42c00661f10065d4be5259e714dd74d24bde781d1b321574d2a6888` |
| `_astro/talthall.Bs7k6_C3_gKg3S.webp` | 34300 | `e5b0205a2b617cbdf2c84bedb3a3d72c0978567f6a4ff6b53ab0ab00f56bb35c` |
| `_astro/talthall.Bs7k6_C3_jwvGm.webp` | 58618 | `a6848724568215d6d84072f67fada633d8f32e396a8814bcc333cbd377ebca9f` |
| `favicon.ico` | 655 | `09d2ac08d8cca9b6e1f90221f345a8c4dd0371c64a0dc52b6f96fc589b1e3d67` |
| `images/hallpartner-logo.png` | 37524 | `b8ee0c27a701c6426b4a1945b64accf1e23b0c8718699b3406d55fdf7c6995f6` |

### Serverkonfiguration: bevara oförändrad

| Fil | Byte | FTPS SHA-256 |
| --- | ---: | --- |
| `cgi-bin/.htaccess` | 17 | `74d7c0a057cc6a4e4b762757f8f69194a1249028bff3ede8ed80a66f06494d21` |

### Målmarkör: bevara oförändrad

| Fil | Byte | FTPS SHA-256 |
| --- | ---: | --- |
| `hp-preview-probe-20261103-6de487a.txt` | 50 | `3eeebd77227a8c895cc60f1137fcd01500517fc8a84743e82e1d303467945ea7` |

Gamla resurser får inte raderas medan fortfarande publicerade sidor använder dem.
Tillfällig retention binder exakt dessa hashar och Andreas uttryckliga beslut.
Detta är bevarande av redan befintliga serverbytes, inte tillstånd att lägga till
nytt bildinnehåll eller ändra de 51 godkända bilderna i det nya paketet.

## Privat backup och godkänd engångsstädning

Befintligt preview-validation-workflow har två manuella underhållslägen som
bara tillåts från senaste main, under samma överföringslås som publiceringen.
Ingen ny workflowfil, publiceringsrot, credential eller tjänst tillkommer.

`private-backup` läser original via befintliga FTPS-secrets och krypterar dem
på runnern med AES-256-GCM och en RSA-OAEP-SHA256-mottagarnyckel. Endast publik
RSA-nyckel skickas till Actions; den privata nyckeln skapas och stannar i den
befintliga åtkomstskyddade lokala backupplatsen. Endast chiffertext transporteras
som en kortlivad artifact. Rå serverdata och privata nycklar ingår aldrig i
GitHub-artifacts. Efter lokal dekryptering verifieras varje fil på disk mot
FTPS-hash och storlek, inklusive skyddsfilen; fil-/katalogmanifest sparas privat.
Transportartefacten tas sedan bort från GitHub. Backupen ligger kvar lokalt.

Andreas har separat och uttryckligen godkänt GitHub-repot Amelio-AB/hallpartner
som tillfällig destination för denna krypterade engångsöverföring av just de
63 inventerade filerna. Överföringen stoppas före kryptering/artifact om
filantal, sökvägar, SHA-256, storlek eller målbindning ändrats. Publik nyckel
verifieras mot sin lokala privata motsvarighet; inga privata nycklar, lösenord
eller okrypterade serverbytes får finnas i loggar/artifacts.

`approved-cleanup` anropas först efter denna verifiering, med backupmanifestets
inventeringshash som indata. Den nya sidans paket byggs och verifieras innan
kontrollen av borttagningslistan. Skriptet kräver exakt de 13 godkända sökvägarna,
deras hash/storlek, identisk full aktuell serverinventering mot backupen, senaste
main och avstängda/inaktiva gamla publicerare. Det raderar inga kataloger och
använder inga wildcards. Efteråt verifieras att alla andra original och samtliga
kataloger är oförändrade, att de 13 filerna ger 404/410 och att produktionens
markörkontroller fortfarande passerar. Den vanliga publiceraren anropar aldrig
detta underhållsläge och har fortfarande ingen raderingsfunktion.
