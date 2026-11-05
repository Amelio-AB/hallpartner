# Checkpoint – Hallpartner offertguide V2 och Inleed-preview (2026-11-05)

**Återupptaget på projektägarens begäran:** se
[fortsatt teknisk verifiering och återstående godkännanden](2026-11-05-offert-release-resumed.md).
Pausen nedan dokumenterar det tidigare stoppet, inte ett nytt stoppbeslut.

> **Arbetet är pausat på projektägarens begäran. Ingen aktivering, merge eller publik serverändring ska göras enbart med stöd av denna checkpoint.** Läs aktuell GitHub-HEAD, PR-status, Actions och fjärrbevis när arbetet återupptas. Denna checkpoint dokumenterar det vi faktiskt verifierade den 5 november och supersederar äldre statuspåståenden om att V2 enbart finns i Draft PR #22 eller att PHP bara accepterar V1.

## Målet och säkerhetsgränsen

Projektägaren vill kunna demonstrera Hallpartners **nya sexstegsguide** på
https://hallpartner-se.preview2.inleed.com/offert/ och därefter aktivera **Skicka förfrågan**.

Utvecklingspreviewn ligger på **Amelios befintliga Inleed-konto**.
Kundens nuvarande WordPress ligger på annat webbhotell och får inte beröras.
Ingen ändring av DNS, hostingkonto, FTP-root, hemligheter i GitHub,
filuppladdning eller priskalkylator är godkänd.

**E-postbeslut 2026-11-05:** `kontakt@amelio.se` ska vara **både avsändare
och mottagare** under Amelios preview. Historiska syntetiska tester använde
även `andreas@amelio.se` som testmottagare; den adressen ska inte bli
default för nya offertinskick. Separat e-post- och integritetsrelease krävs
när webbplatsen senare flyttas till Hallpartners eget Inleed-konto.

## Genomfört och verifierat

### Offertguide och backend

- Den visuella V2-guiden (fem frågesteg + AMP-001:s automatiska kontroll)
  har tidigare publicerats på utvecklingspreviewn. På steg 1 är endast
  användningsområde obligatoriskt; totalt krävs användningsområde, namn och
  e-post. Behovsbeskrivningen är **frivillig**.
- PR #22 och publiceringsrättningen PR #23 mergades tidigare. PR #24
  (`6065c321068a50fd1b3af725d3da55f7986e15e0`) är mergad till
  `main` och innehåller V2-servervalidering, mejlinnehåll och frontend-
  adapter bakom avstängda releaseflaggor.
- På SSH-servern `s164937@ns15.inleed.net` har filerna
  `/home/s164937/hallpartner-leads/validator.php` och
  `/home/s164937/hallpartner-leads/receiver.php` uppdaterats från en
  verifierad PR #24-revision; originalen säkerhetskopierades till
  `/home/s164937/hallpartner-v2-stage/`. PHP-syntax och ett minimalt
  V2-valideringstest passerade. `config.local.php` ändrades **inte**
  av dessa kodbyten.
- Befintlig publik PHP-bootstrap finns på Amelios server under
  `/home/s164937/domains/hallpartner.se/public_html/api/lead.php`,
  verifierad till **943 byte**, SHA-256
  `7d252addd5378e98ddb42871934190800800e076318661b3d66c1a202a89e7ef`.
  Denna fils kod använder `HP_LEAD_PRIVATE_DIR` och fallback till
  `/home/s164937/hallpartner-leads`. Den ska inte ersättas av den
  statiska publiceringspipelinen.
- `GET /api/lead.php` gav HTTP 405 och ett syntetiskt POST med
  avstängd mottagning gav HTTP 503 (`{"status":"failed"}`), såsom förväntat.
  Dessa kontrollanrop bevisade inte i sig e-postmottagning.

### Testad riktig SMTP-leverans via isolerad PHP-loopback

- V2-testet kördes med **tillfällig PHP-server bunden till localhost**,
  en temporär konfiguration och syntetiska uppgifter. Den verkliga
  `config.local.php` var hela tiden inaktiv. Detta är **inte** samma sak
  som ett HTTP-POST från den publicerade Astro-guiden.
- Test 1: SMTP från `kontakt@amelio.se` till
  `andreas@amelio.se`, HTTP 200 med
  `24cc0e74557ce9ceb03412f1`. Projektägaren verifierade
  att samma referens nått testinkorgen.
- Test 2: SMTP **från och till `kontakt@amelio.se`**, med
  `Origin-skydd: OK`, HTTP 200 / `SMTP accepted: TEST OK`,
  referens `b48d4df51f2834f90d04e086`. Projektägaren bifogade
  skärmbild av det mottagna mejlet med exakt denna referens.
- I det syntetiska mejlet står råvärdet `storage` i stället för
  svensk etikett `Lager eller förvaring`. Detta är en
  förbättringspunkt för senare mejlformat, **inte** ett SMTP-fel.

### Senaste privata SSH-kontroll från projektägaren

Resultatet återges utan lösenord eller faktiska hemliga konfigurationsvärden:

```text
SMTP-avsandare: OK
Mottagare: OK
Preview-origin: OK
Mottagning avstangd: OK
Integritet avstangd: OK
```

Detta betyder: privat SMTP-avsändare och mottagare är nu båda
`kontakt@amelio.se`, `allowed_origin` är previewadressen och
**`enabled=false` samt `privacy_approved=false` kvarstår**.
Den riktiga publika offertknappen är därför fortfarande **inte aktiverad**.

## Github-status vid checkpoint

- Repo: https://github.com/Amelio-AB/hallpartner
- Vid den senaste läsningen: `main` =
  `6065c321068a50fd1b3af725d3da55f7986e15e0` (merge av PR #24).
- **PR #25 (Draft)**:
  https://github.com/Amelio-AB/hallpartner/pull/25
  – isolerat V2-testskript för localhost/SMTP. Senast kontrollerad
  källrevision `8e3e72a9e1925515a70d41c7fa57a7189e94a287`;
  dess CI, Footer-rollback och Preview validation hade status
  **success**. Ingen merge/publicering av PR #25.
- **PR #26 (Draft)**:
  https://github.com/Amelio-AB/hallpartner/pull/26
  – ny `config/preview-quote-release.json`, releasekontroll,
  buildflaggor, snäv payload-allowlist, tester och
  utkast till integritetssida `src/pages/integritet/index.astro`.
  Den senaste testade källrevisionen **före dokumentationscheckpointen**
  var `cb43657aded4ee27dde54a86bc7886bf541c4790`.
  **CI, Footer-rollback och Preview validation var alla success**,
  inklusive Chrome och läsande FTPS-kontroll. Nyare dokumentationscommits
  ska valideras separat; ärv inte äldre gröna tester.
- Releasepolicyn på PR #26 har fortfarande **`mode: "review"`**,
  avsändare/mottagare `kontakt@amelio.se`, och
  aktiveringsgodkännanden är `null`. Det innebär avstängd skickaknapp.
- **Viktig publiceringsobservation:** Efter merge av PR #24 kördes
  main-publicering [Actions #41982929414](https://github.com/Amelio-AB/hallpartner/actions/runs/41982929414).
  Valideringen passerade, men **publish misslyckades**
  2026-11-05 med `TypeError: fetch failed` / `write EPIPE`
  i `scripts/preview/remote.mjs publish`. Efterföljande live-Chrome
  kördes inte. Det går **inte** att utifrån enbart jobbfelet säga vilka
  filer som hann överföras; kontrollera färsk previewmarkör,
  FTPS-original och HTTPS innan en ny publicering eller retry.
  Anta inte att `6065c321` finns ute bara för att den är mergad.

## Återstår vid återstart – arbetsordning

1. **Läsande inventering**: verifiera `main`, PR #25 och #26,
   aktuella jobb, om publik preview faktiskt har rätt revision,
   och orsaken/omfattningen till EPIPE-felet. Gör ingen blind retry
   som kan skriva till fel plats.
2. **Granska och godkänn integritetshanteringen för Amelios preview**:
   utkastet föreslår Amelio AB som personuppgiftsansvarig för testmiljön
   och radering av inkomna testförfrågningar inom 30 dagar. Detta
   **har ännu inte uttryckligen godkänts av projektägaren**.
   Bekräfta åtkomst, faktisk gallringsrutin och juridisk information
   innan `privacy_approved` någonsin sätts true.
3. Säkerställ att PR #26:s **lokala aktiva Chrome-test** fungerar,
   att avstängd standard passerar, och att enbart
   `#hp-offert-guide` under `/offert/` kan aktiveras med godkänd
   policy. Kontaktformuläret ska fortsatt vara avstängt.
4. Först efter dokumenterat godkännande, korrekt publicerad
   integritetssida och säkerhetskontroller: genomför en separat,
   explicit *preview-only* aktivering av privat `enabled`,
   `privacy_approved` och releasepolicyn. Behåll all privat
   konfiguration och SMTP-hemligheter utanför GitHub.
5. Publicera via ordinarie verifierat `main`-workflow, verifiera
   serveroriginal och live-Chrome. Gör ett **enda syntetiskt**
   inskick via den faktiska publika knappen, jämför referens och
   mottaget mejl i `kontakt@amelio.se`. Stoppa och rapportera om
   någon releasegrind eller leveranskontroll fallerar.
6. För kundens framtida egna Inleed-konto krävs ett separat
   migrerings- och driftgodkännande; inga automatiska flyttar nu.

## Beslut om paus

Den 5 november 2026 avslutade projektägaren dagens arbete.
**Ingen mer merge, deploy, serverkonfigurationsändring eller e-posttest
ska göras som en följd av checkpointen.** Dokumentationscommit på PR #26
är enbart en överlämning och aktiverar ingenting. Projektägaren vill
återuppta arbetet med att få en verkligt fungerande **Skicka förfrågan**
på Amelios utvecklingspreview.
