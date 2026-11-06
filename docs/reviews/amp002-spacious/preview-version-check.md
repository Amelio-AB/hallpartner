# Förklarad marköravvikelse: preview och main 2026-11-06

**Slutsats:** den tidigare uppgiften `f855a02` var en läsning under pågående
publicering, före markörbytet. Färska kontroller visar ingen kvarstående
versionsavvikelse eller cacheavvikelse. Previewn levererar **`77d1b12652a6b05117939f5dd21dbbdd53774ea5`**,
inklusive den godkända split-heron från [PR #40](https://github.com/Amelio-AB/hallpartner/pull/40).
Ingen merge, publicering eller serverändring utfördes i denna utredning.

## Tidsordning

Alla tider nedan är svensk tid (Europe/Stockholm, CET, UTC+1), 6 november 2026.

| Händelse | Tid |
| --- | --- |
| PR #40 mergas till `77d1b12` | 18:47:27 |
| Publiceringskörning [42264842858](https://github.com/Amelio-AB/hallpartner/actions/runs/42264842858) startar | 18:47:30 |
| Valideringen blir grön | 18:55:39 |
| `publish`-jobbet startar | 18:55:41 |
| Överförings-/verifieringssteget startar | 18:56:30 |
| Ny markör skapas efter filverifiering (`verifiedAt`, även HTTP `Last-Modified`) | **19:09:27** |
| Överföring och FTPS-/HTTPS-verifiering blir gröna | 19:09:48 |
| Live-browsergranskning blir grön | 19:13:20 |
| Hela `publish`-jobbet blir grönt | **19:13:30** |
| Färsk vanlig + cacheförbikopplad markör-/startsideläsning | 19:17:04–05 |
| Full bytejämförelse mot publicerat main-payload startar | 19:19:01 |

Den första läsningen i AMP-002-arbetet gjordes före markörbytet, när GitHub
fortfarande rapporterade körningen som `in_progress`. Exakt sekund för den
första HTTP-läsningen sparades inte; den ska därför inte ges en påhittad tid.
Den då lästa markören pekade på föregående lyckade körning `42236416685` och
`verifiedAt: 2026-11-06T15:01:20.872Z`. Uppgiften var ett historiskt ögonblick,
inte en ny kontroll efter den senare gröna publiceringen.

## Varför den gamla markören kunde ligga kvar

Den befintliga koden i `scripts/preview/remote.mjs` laddar upp och verifierar
payloadets samtliga filer först. Därefter skrivs inventory, commitunik markör
och sist `hp-preview-deploy.json`. Markören byts alltså inte när `main` ändras
eller när valideringsjobbet blir grönt. Under en pågående överföring beskriver
den föregående slutförda publicering. Filer kan redan ha börjat uppdateras då;
en ensam markör under körningen bevisar inte att hela servern är atomiskt gammal.

Ingen markörfil behöver rättas manuellt. Ingen cachetömning eller ny publicering
behövdes. Browserns privata historiska cache kan inte rekonstrueras, men de
nya jämförelserna ger inget stöd för att cache orsakade just denna observation.

## Kontroller och konkreta bevis

1. GitHub `main`, PR #40:s mergecommit och publiceringskörningens `headSha`
   är alla exakt `77d1b12652a6b05117939f5dd21dbbdd53774ea5`.
2. `/hp-preview-deploy.json` hämtades både normalt och med unik query samt
   `Cache-Control: no-cache` / `Pragma: no-cache`. Båda gav HTTP 200,
   samma ETag `"148-65f9f834463c0"`, `Last-Modified: 18:09:27 GMT` och
   SHA-256 `a67a14c44be2669098f52f3df2815cb1862abda3717d3a3887eeb820a714ae9c`.
3. Den commitunika markören `hp-preview-deploy-77d1b12652a6b05117939f5dd21dbbdd53774ea5.json`
   var byte-identisk med huvudmarkören. Båda anger körning `42264842858`.
4. Inventory gav exakt det hashvärde som markören anger:
   `e7e7375420e663ee8c3aef701efb18908a5c57ecdc304dadfdab6fed43ac33c4`.
5. Det nedladdade manifestet från
   [publiceringsbeviset](https://github.com/Amelio-AB/hallpartner/actions/runs/42264842858/artifacts/13528701105)
   matchade markörens SHA-256
   `a5d3b9fd7c685250ce11d6022fb5d5781b68ea24c11ad478b5183a566423a599`.
   `deployment-result.json` anger `status: verified`.
6. Arkiverad `published-delivery.json` innehåller **88/88 godkända filer**.
   Varje FTPS-originalhash matchar manifestet. HTTPS matchar enbart den tidigare
   verifierade Inleed-transformeringen `https://hallpartner.se` → previewdomänen
   i HTML/XML. Inga andra skillnader normaliseras bort. Detta är läst bevis från
   publiceringskörningen, inte en påstådd ny FTPS-anslutning i denna utredning.
7. En ny oberoende HTTPS-kontroll jämförde **alla 88 statiska filer** med
   [payload-artifactet](https://github.com/Amelio-AB/hallpartner/actions/runs/42264842858/artifacts/13526174221).
   Samtliga matchade. **Alla 15 HTML-sidor** hämtades också cacheförbikopplat;
   de gav exakt samma förväntade bytes som de vanliga svaren. Detta omfattar
   samtliga sex hallsidor och deras CSS, bilder och JavaScript.
8. Split-hero-CSS `/_astro/hallpartner-hall-detail.jQBi7C_O.css` ingår i
   jämförelsen och matchar exakt det publicerade main-payloadet.

Fullständiga färska filhashar, markördata och valda HTTP-headers sparas i
[`preview-version-evidence.json`](preview-version-evidence.json).
Inga credentials eller privata formulärdata finns i bevisfilen.

## Fortsatt AMP-002-arbete

AMP-002-grenen skapades redan från exakt `77d1b12`; den ligger inte på den
äldre previewcommitten. `git diff 77d1b12 HEAD --` för `HallConceptImage.astro`,
`hallpartner-hall-detail.css`, `src/pages/stalhallar/` och
`tests/hall-concept-photos.test.mjs` är tom. **Den godkända split-hero-designen
är oförändrad.** Det är huvudmenyn och dess adapter som uppgraderas i Draft-PR #42.

Versionsavvikelsen är därmed förklarad. Merge/publicering får fortfarande inte
göras i detta uppdrag. Relevanta PR-kontroller ska vara gröna och ett separat
ägargodkännande krävs; aktuell CI-status redovisas på PR:n.
