# Hallpartner – AMP-003 Footer-integration (förberedelse 2026-11-02)

**Status 2026-11-02: riktig AMP-003 v1.1.0-installation och AMP-aktiverat bygge är verifierade i en isolerad GitHub Actions-consumer. Paketet är ännu INTE versionslåst i Hallpartners ordinarie package-lock.json, inte aktiverat som standard och inte publicerat.** Arbetsgren/PR #5 förblir Draft. Den hittills godkända Headern, startsidans Hero och alla prototyper är oförändrade.

## Vad adapterändringen gör

- Använder den **godkända AMP-003 renderFooter()** från det privata paketets publika export, inte kopierad plattformskod.
- Använder varianten **Compact** på de riktiga Astro-sidorna genom deras gemensamma layout, inklusive /om-oss/. Äldre /prototype/-rutter behåller den gamla Footern.
- Länkar till sex befintliga hallundersidor, hallöversikten, process, Om Hallpartner och Kontakt.
- Återanvänder den arbetslogotyp och den nya mörkgröna sidpalett som redan finns. Mobilens inbyggda details/summary, fokus och CSS är AMP-003:s eget beteende.
- Visar befintliga publicerade kontaktuppgifter (info@hallpartner.se, 054-820 04 90), **preliminära tills Hallpartner bekräftat dem**.
- Skapar ingen separat Final CTA, inga opublicerade juridiska länkar, ingen påhittad cookiehantering och inget kontaktformulär.
- Paketet renderar statisk escaped HTML vid prebuild/predev; dess oförändrade publicerade CSS-export läggs i en ignorerad genererad fil i public/. Detta håller AMP-källkod borta från Hallpartners repo.

## Varför en opt-in används

@amelio/web-platform är ett **privat** repo. Hallpartners GitHub Actions har ingen dokumenterat verifierad möjlighet att installera beroendet från den privata källan med sitt ordinarie GITHUB_TOKEN. Att lägga in en Git-URL direkt i package.json/package-lock.json nu kan bryta alla nuvarande npm ci-testkörningar. Det är därför inte gjort.

**Normalläge:** HALLPARTNER_FOOTER_MODE=legacy (även när variabeln saknas). Samma Footer som tidigare visas och CI kan fortsätta bygga utan privata rättigheter. **Aktiverat läge:** HALLPARTNER_FOOTER_MODE=amp-003. Då är paketet obligatoriskt; om det saknas, inte är 1.1.0, eller inte kan rendera, avbryts bygget i stället för att tyst visa fel Footer.

## Lokal granskning med rättigheter till båda repona

Godkänd, stabil privat plattformskälla: v1.1.0, **40-teckens release-SHA a11811bfbf51416e7fe7d58aed4551be77914d65**. Om du använder en lokal checkout, kontrollera först dess commit mot detta värde och lämna andra lokala filer orörda. I Hallpartners separata granskningsmapp med Node 24:

~~~powershell
npm ci
# Lokal installation/länk till privat plattformskälla som kontrollerats vid rätt SHA:
npm link --no-save C:\webbprojekt\amelio-web-platform
$env:HALLPARTNER_FOOTER_MODE = "amp-003"
npm run dev
~~~

Öppna http://localhost:4321/ och http://localhost:4321/om-oss/. Alla riktiga sidor använder då den gemensamma AMP-003 Footern. Jämför mobil 320/390 px och desktop 1280/1440 px, kontrollera alla disclosure-länkar, fokusmarkeringar, overflow och att exakt en Footer finns. Kör sedan npm run check, npm run lint, npm run build, node scripts/verify-hallpartner-draft.mjs och den renderade Chrome-QA:n innan godkännande. Testet kan kräva lokal Chrome-konfiguration.

**Observera:** npm ci installerar om låsta beroenden och tar bort en manuellt länkad privat modul. Kör därför npm link igen efter npm ci. Länken är en lokal granskningsmetod – inte ett reproducerbart releasepaket. Om du behöver återgå: ta bort miljövariabeln och kör npm run dev igen.

## Verifierad installation och byggtest, 2 november 2026

[Isolerad consumer-testkörning i privata plattformsrepot](https://github.com/Amelio-AB/amelio-web-platform/actions/runs/41396852845) kontrollerade exakt release-SHA `a11811bfbf51416e7fe7d58aed4551be77914d65`, installerade dess lokalt utcheckade **verkliga privata paket** i en separat Hallpartner-arbetskopias `node_modules` på Node 24 och körde `HALLPARTNER_FOOTER_MODE=amp-003` med byggd HTML, tester och Chrome i 320/390/768/1280/1440 px. **PASS**. Det var en korrekt runtime-/API-integrationstest med `npm install --no-save`; **det var inte** ett permanent SHA-pinnat beroende i Hallpartners ordinarie lockfile och testade **inte** cross-repo-token för Hallpartners Actions.

En separat **valfri** `amp003-private-consumer`-kontroll har nu lagts till i Hallpartners no-deploy PR-workflow. Med en konfigurering av en *endast läsbar* repository secret `AMELIO_PLATFORM_READ_TOKEN` för just `Amelio-AB/amelio-web-platform` checkar jobbet ut release-SHA och installerar/testar det riktiga paketet i samma PR-kod. Utan secret visar jobbet en uttrycklig **warning / SKIPPED** och gör ingen privat installation. Det vanliga baseline-jobbet med legacy-footer fortsätter att köra. Ingen secret kopieras till JavaScript, CSS, npm-loggar eller artifacts; checkout har `persist-credentials: false`.

**Nästa behörighetssteg för repository-administratör:** GitHub → Hallpartner → Settings → Secrets and variables → Actions → New repository secret. Skapa `AMELIO_PLATFORM_READ_TOKEN` med en tidsbegränsad, organisationsgodkänd read-only credential som enbart får läsa det privata plattformsrepots Contents. Ange aldrig hemligheten i denna chatt, i `package*.json` eller i URL:er. Kör om PR-kontrollen för att verifiera åtkomst. Om den redan finns med annat namn, samordna med ansvarig och justera den lästa hemlighetens **namn**, inte dess värde i kod.

## Före permanent AMP-003-aktivering i CI

1. Säkra godkänd autentiserad åtkomst till privat Amelio-repo från Hallpartners GitHub Actions, utan att exponera token i kod eller loggar.
2. Versionslås ett **exakt verifierat SHA** i konsumentens package.json och package-lock.json, kör npm ci på Node 24 och låt vanlig CI verkligen bygga med AMP-003 aktiverad. Inga flytande main-referenser.
3. Testa AMP-003:s faktiska HTML/CSS på mobil och desktop samt kundens verkliga kontaktuppgifter och eventuella integritets-/juridiktexter. Dokumentera visuell acceptans.
4. Aktivera i vanlig build först när föregående steg har passerat. Merge, FTP och DNS kräver egna uttryckliga beslut.

Denna checkpoint är en **förberedelse**, inte ett påstående om slutförd AMP-003-produktionsintegration.
