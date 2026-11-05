# Återupptagen offertrelease – 2026-11-05

**Senare uppdatering:** Andreas har godkänt hantering och publicering.
Se [den godkända releasen och faktiska serverkontroller](../preview/offert-approved-release-20261105.md).
Texten nedan beskriver läget före detta godkännande.

Arbetet återupptogs på projektägarens uttryckliga uppdrag i befintliga
`C:\webbprojekt\hallpartner`, på PR #26:s gren
`feat/preview-offert-release-gate-20261105`. Tidigare arbete bevarades.
Den tidigare pauscheckpointen är historik; dess bevisgränser gäller fortfarande.

## Aktuell observation före ändring

- `origin/main`: `6065c321068a50fd1b3af725d3da55f7986e15e0`.
- PR #26: Draft, HEAD `853b422330e88003bcc55148279cfb3c7e6284fa`.
  CI och Footer var gröna, Preview validation stoppade på HTTP-transportfel.
- PR #27: Draft, HEAD `b99f4c359efbab0c5d90e9d69ef9ad570fcdd514`.
  Alla tre kontroller passerade. Läsande målbevis i körning
  [42081972297](https://github.com/Amelio-AB/hallpartner/actions/runs/42081972297)
  verifierade 117 fjärrfiler via FTPS och HTTPS, utan skrivning,
  `2026-11-05T18:24:50.194Z`. Retentionskontrollen passerade också.
- Workflow 316932905 är faktiskt aktivt. Gamla 405335800 och 405334470 är
  `disabled_manually`. Inget workflow ändrades eller startades för publicering.
- Ny HTTPS-läsning av `hp-preview-deploy.json` visar fortfarande
  `54c6586b9eba93c4febf9b22604473c2b8316ad7`, run `41973215969`.
  `/offert/` gav 200 med `data-enabled=false` och noindex; GET på
  `/api/lead.php` gav 405. Markören bevisar inte ensam alla nuvarande bytes.
- SMTP-beviset `b48d4df51f2834f90d04e086`, från och till
  `kontakt@amelio.se`, återanvänds. Inget nytt SMTP-test kördes.

## Ändringar på arbetsgrenen

PR #27 förenades med PR #26 i lokal merge `325c571` (inte merge till main).
Den enda konflikten var testimporterna; båda grenarnas tester bevarades.

- HTML-kontrollen och den responsiva Chrome-granskningen följer nu den
  granskade releasepolicyn. De krävde tidigare alltid avstängd offert och
  skulle därför blockera även en godkänd aktiv release.
- Chrome-granskningen blockerar API-anrop i webbläsaren och klickar aldrig
  på den slutliga skickaknappen. Den kan därför användas även på aktiv
  preview utan att leverera syntetiska eller verkliga uppgifter.
- Publiceringsworkflowets efterkontroll omfattar nu även `/offert/`.
- Aktiv offertpayload måste länka till `/integritet/`.
- Releaseflaggorna sätter uttryckligen kontaktformulär och filgranskning
  till false, oberoende av offertens läge.
- PR #27:s läsretry får inte göra ett nytt försök efter känd HTTP 404/503
  ens om läsningen av felmeddelandets body avbryts. Regression finns.
- Lokalt aktivt Chrome-test täcker 390 och 1440 px, lyckat svar, avvisad
  mottagning (503) och osäker leverans (500). Det använder bara loopback
  och gör exakt ett anrop per scenario; inget SMTP.

## Lokal verifiering

- Låsta beroenden installerade: AMP 1.5.0, rätt källpin. Den tidigare
  lokala installationen var 1.4.0 och kunde inte användas som bevis.
- Astro/TypeScript: 0 fel och varningar. ESLint passerade.
- 75 Node-regressioner passerade, liksom workflowkontrakt och HTML-/URL-kontroller.
- Ordinarie bygge: 14 allowlistade sidor inklusive integritetsutkastet.
- Inaktiv offert granskades i Chrome vid 320, 390, 768, 1024, 1280 och
  1440 px. Sex steg, obligatoriska fält, tangentbordsfokus/dialog och
  avstängd slutknapp passerade. Mobilskärmbilden granskades visuellt.
- Aktivt lokalt test: fyra scenarier passerade. Lyckat svar bekräftas;
  503 visar utebliven mottagning; 500 spärrar omsändning. Inga SMTP-anrop.
- Det lokala bygget återställdes till granskningsläge efter testet.
- PHP/Composer saknas lokalt; dessa kontroller körs i PR-kandidatens CI.
  Äldre gröna kontroller är inte slutbevis för den nya revisionen.

## Återstår innan aktivering

`config/preview-quote-release.json` är fortfarande `mode: review` och
godkännandena är null. Privat serverkonfiguration har inte ändrats.
Ingen merge till main, publicering eller slutligt publikt inskick har gjorts.

Projektägaren behöver godkänna den konkreta hanteringen i
`src/pages/integritet/index.astro`: Amelio AB:s ansvar för previewmottagningen,
vilka som har tillgång till `kontakt@amelio.se`, rättslig grund och vem som
utför radering inom 30 dagar. Texten är fortfarande ett förslag, inte ett
påstående att bedömningen eller gallringsrutinen är fastställd.

Efter godkänd hantering behöver texten färdigställas, privat konfiguration
kontrolleras utan hemlighetsutskrift, och exakt previewaktivering godkännas.
Den godkända releasen ska gå via senaste main och ordinarie mål-/bytekontroller.
Slutbevis är ett enda syntetiskt inskick via verkliga knappen med motsvarande
referens i `kontakt@amelio.se`. DNS, WordPress och kundens framtida konto
ingår inte.
