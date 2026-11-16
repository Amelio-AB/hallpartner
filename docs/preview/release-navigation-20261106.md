# PR #43: samtidig serverläsning och ompublicering

## Slutsats

Den röda kandidaten hade en verklig byteavvikelse i **en deploymarkör**, orsakad av att den lästes under en samtidig ompublicering av samma main-commit. Felet är inte bevis för gammal besökarkod eller en bestående cacheavvikelse. Säkerhetsgrinden stoppade korrekt en jämförelse av två olika ögonblick.

Inga källkodsfiler, hashregler, releaseundantag eller concurrency-inställningar ändrades för att få releasen grön. [PR #43](https://github.com/Amelio-AB/hallpartner/pull/43) omkördes på oförändrad HEAD `4fcd587f818dfd0f0fc94dd309d7f1bfd23664f3` efter avslutad publicering. Samtliga obligatoriska checks passerade. Squash-merge med förväntad HEAD skapade `53afac8c3d1d7d990605db65c51f59ee838ca640` den 6 november 2026 kl. 21:51:09 UTC.

## Konkret fel och hashkoppling

[Försök 1](https://github.com/Amelio-AB/hallpartner/actions/runs/42290034192/attempts/1) läste servern 20:47:12–20:54:03 UTC. `target-proof.json` innehåller **144 HTTPS-jämförelser, 143 godkända och en avvikande**, med noll skrivoperationer. Den enda avvikande filen var:

`hp-preview-deploy-15a607f24f088c75f69dab71a765c576a3e4ed88.json`

| Observation | SHA-256 |
|---|---|
| FTPS-original och förväntade HTTPS-bytes | `052ac529713a65d8cee634a562897c38a02fb1fe9dc030c4362f883fbf9a5878` |
| Faktiskt HTTPS-svar, HTTP 200, rätt origin | `9145c2e1ae9fd03e109d39192d2f0f136ac3be5c094154ebf23fb4be261eef40` |

Den första hashen finns också i förkontrollen för den samtidiga [main-publiceringen #42289244985](https://github.com/Amelio-AB/hallpartner/actions/runs/42289244985). Den andra hashen motsvarar exakt dess nya markör, rekonstruerad med publicerarens fältordning, JSON-indrag och avslutande radbrytning från `deployment-result.json`. Markören anger commit `15a607f`, run `42289244985` och `verifiedAt: 2026-11-06T20:51:35.195Z`.

Publiceraren använder ett commitspecifikt filnamn men skriver ändå om filen när **samma commit publiceras igen**, eftersom run-ID och verifieringstid ändras. Läsningen såg därför föregående markör via FTPS och ersättningsmarkören via HTTPS. Filnamnsinventeringen kan samtidigt vara oförändrad. JSON omfattas inte av domänomskrivningen; inga bytes normaliserades.

Exakta läs-/skrivtider per fil finns inte i rapporten. `verifiedAt` är markörens skapandetid strax före uppladdning, inte en exakt FTP-skrivtid. Hashkopplingen och den dokumenterade tidsöverlappningen visar dock vilka två versioner som jämfördes. Ingen visitorfil avvek i denna jämförelse.

## Stabil omkörning

[Försök 2](https://github.com/Amelio-AB/hallpartner/actions/runs/42290034192/attempts/2) kördes utan kodändring och utan en aktiv publicering. Serverkontrollen avslutades 21:47:43.512 UTC med **144/144 matchningar**, noll skrivoperationer och därefter godkänd separat retained-file-kontroll. Den aktuella markören hade `9145c2e…eef40` via både FTPS och HTTPS. Hela körningen blev grön.

[Omkörningens evidence-artifact](https://github.com/Amelio-AB/hallpartner/actions/runs/42290034192/artifacts/13544005790) innehåller `target-proof.json`, `retained-verification.json`, browserresultat, manifest och auditrapporter. Den separata hashrapporten `2026-11-06-release-investigation.json` återger endast relevanta markörhashar och kontrollutfall, inga privata serveroriginal.

## Concurrency och kvarvarande risk

Publiceringsworkflowet har workflow-låset `hallpartner-inleed-preview-20261103` med `cancel-in-progress: false`. Maintenance-jobbet använder samma grupp. PR-jobbet `validate` saknar detta lås och kan därför läsa medan publiceraren skriver. Detta förklarar att den aktuella kollisionen var möjlig.

Ingen låsändring ingår i den visuellt godkända releasen. Ett identiskt lås direkt på återanvändbar validering kan skapa väntan på publicerarens eget föräldralås. En separat förbättring behöver skilja PR-läsning från validering som anropas av publiceraren samt analysera köhantering, undanträngda väntande körningar, maintenance och tidsgränser. Fram till dess ska en röd hashkontroll undersökas och bara omköras när publiceraren är stilla; hashavvikelser får aldrig ignoreras eller automatiskt godtas.

## Kandidatgranskning

Kandidatens obligatoriska Actions omfattade Astro/TypeScript, ESLint, Node/PHP, npm-/Composer-audit, låst AMP, bildrättigheter, statisk payload, Chrome på 15 sidor och AMP-002:s 40 viewport-/textstorleksfall samt Footer, galleri och AMP-006. Alla obligatoriska checks var gröna före merge; maintenance var korrekt överhoppat.

En kompletterande lokal Chrome-kontroll granskade 15 sidor vid 390/1440 px och 100/200 % standardtextstorlek: 60 fall. Alla 13 breadcrumb-rader hade `#153129` och full viewportbredd, huvudmenyn saknade Startsida, logotypen länkade hem, sex ikoner/beskrivningar fanns på desktop och fokus/reduced-motion fungerade. Inga API-anrop gjordes. Desktop-, mobil- och textförstoringsbilder granskades. Dessa är kandidatbevis; publicering redovisas separat i kvällscheckpointen.

Det kända problemet med stora sidrubriker/hero-copy vid 200 % text på smal mobil kvarstår som separat tillgänglighetsuppföljning. Den godkända split-hero-designen och dess källkod ändrades inte.
