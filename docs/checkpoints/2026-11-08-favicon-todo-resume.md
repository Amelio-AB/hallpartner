# Hallpartner – återupptagen release- och TODO-checkpoint, 2026-11-08

> Dokumenterad i Draft PR #2. Detta är en **faktagranskad checkpoint**, inte ett beslut att merga PR #2 eller publicera på nytt. Kontrollera alltid GitHub/preview på nytt vid senare sessioner.

## Verifierat releaseutfall

- Senaste verifierade `main`: `7ec2956accbfa16545101f7dfb600aeebca0f705` (merge av [PR #46](https://github.com/Amelio-AB/hallpartner/pull/46), 2026-11-07 20:58:59 UTC).
- PR #46 återför användarens byteexakta `public/favicon.png`, deklarerar `image/png` i båda layouts och bevarar tidigare `favicon.svg` på servern enligt explicit hashbundet retentionbeslut. Konflikten mot senast publicerade processhero är löst på PR-HEAD `3bb6f4709d18cc2ec6c5becb2174d3db6f630559`.
- [Full kandidatvalidering #42410788613](https://github.com/Amelio-AB/hallpartner/actions/runs/42410788613): `success` efter omkörning, inklusive FTPS read-only retained-file-preflight. Chattavbrottet inträffade medan jobben fortfarande pågick; grinden slutfördes senare.
- [Main-CI #42413633173](https://github.com/Amelio-AB/hallpartner/actions/runs/42413633173): `success`. [Inleed-previewpublicering #42413633236](https://github.com/Amelio-AB/hallpartner/actions/runs/42413633236): både `validate` och `publish` `success`, med efterföljande HTTP- och Chrome-verifiering av publicerad webbplats på samma main-SHA.
- Processheron/AI-konceptillustrationen hade redan mergats via [PR #47](https://github.com/Amelio-AB/hallpartner/pull/47) och bevarades av faviconmergen. Den är inte ett kundreferensfoto. Inget behöver laddas upp igen för att återställa den.

**Bevisgräns:** GitHub Actions rapporterar godkänd publicering och live-interaktionstester. Denna genomgång har inte etablerat en separat, aktuell manuell webbläsarobservation av faviconens utseende. Kundens WordPress, DNS, SMTP och skarpa produktionssajt har inte ändrats av checkpointarbetet.

## Avstämning av öppna uppgifter

- **Färdigt som previewfunktion:** favicon (inget eget HP-ID); HP-048 header-CTA `Be om offert` → `/offert/`; HP-038 Node 24/AMP-gate; HP-040 det befintliga, riktiga `main`→Inleed-previewflödet. HP-050 totalentreprenad/nyckelfärdigt är redan markerad `Klar` efter tidigare ägarbeslut.
- **Byggt men kräver kundens sakgranskning:** HP-051 – de sju publicerade processtegen finns på `/sa-gar-det-till/`, men Peter/Jimmy behöver verifiera ordningsföljd, projekterings- och bygglovsansvar och leveransomfattning. HP-010/011/015 är separata avtals-, garanti- och företagsfrågor. Hallundersidorna är publicerade som arbetsversioner; inga AI-bilder får påstås vara kundcase.
- **Pausat:** HP-001–003 extern kalkylator/köp; HP-009 separat montörsinventering; HP-017 referensprojekt i väntan på faktiska färdigställda projekt. Ingen av dessa ska återöppnas bara för att skapa arbete.
- **Kundlansering återstår:** faktagranskning, juridiska kontakt- och integritetsuppgifter, slutlig offertmottagning, innehålls- och SEO-/URL-beslut samt separat godkänd release. Amelios testmottagning på previewn är redan verifierad och ska inte förväxlas med kundens produktionsmottagare.
- **Dokumentation:** `docs/TODO.md` i denna Draft-gren har uppdaterats med verifierade releasefakta och tio berörda HP-rader. Äldre delar av `AGENTS.md`/`README.md` och PR #2:s eget äldre beslutsregister innehåller fortfarande historiska tillstånd; de får inte blindmergas som aktuella instruktioner.

## Öppna PR:er och nästa arbetsordning

- [PR #44](https://github.com/Amelio-AB/hallpartner/pull/44) är fortfarande Draft. Den har unik äldre felsökningsdokumentation om navigation och FTPS/HTTPS; inte samma sak som ett aktuellt publiceringsbeslut. Bevara underlaget och jämför selektivt med `main` innan eventuell avveckling. **Ingen automatisk merge eller branchradering.**
- [PR #2](https://github.com/Amelio-AB/hallpartner/pull/2) är fortfarande Draft. TODO:n är uppdaterad här, **inte på `main`**. Innan framtida merge måste `AGENTS.md`/`README.md` och `PROJECT_DECISIONS.md` förenas med den implementerade webbplatsen och aktuell huvudgren utan att återinföra felaktiga uppgifter.
- Rekommenderat nästa affärsarbete: låt Peter/Jimmy faktagranska de redan publicerade sju stegen och den avtalade totalentreprenadens faktiska gränser (HP-051/010), hellre än att bygga ytterligare UI eller gamla kalkylatorspår.
- Därefter kontroll av kundens namn, kontaktuppgifter och mottagarmiljö (HP-015/007) samt lanseringskritiska påståenden. HP-047 sökfält och HP-049 dekorativ symbol i Footer kan vänta.

## Säkra gränser

Enda preview: https://hallpartner-se.preview2.inleed.com/. Normal arbetsmapp: `C:\\webbprojekt\\hallpartner`. Inga ändringar i WordPress, DNS, privata SMTP-inställningar, kontrollflaggor, FTPS-retention eller noindex under dokumentationsavstämningen. Ingen ny code/deploy-PR, ingen manuell FTP-uppladdning och ingen dold automation.
