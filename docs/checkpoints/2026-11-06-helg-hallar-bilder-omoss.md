# Hallpartner – helgcheckpoint och samlad release, 6 november 2026

**Syfte:** Hållbar överlämning inför nästa arbetsdag. Detta dokument skapas **i releasekandidaten före merge/publicering**. Behandla det som verifierade källfakta och releaseplan, inte som ett påstående att den publika previewn redan visar en ny commit. **Slutresultat och faktisk publiceringsstatus finns i release-PR:ens kommentarer och GitHub Actions.**

## 1. Projekt och säkerhetsgränser

- Repo: [Amelio-AB/hallpartner](https://github.com/Amelio-AB/hallpartner)
- Ordinarie Windows-arbetsmapp: `C:\webbprojekt\hallpartner`. Ingen extra klon/worktree eller alternativ standardmapp. Kontrollera `git status --short --branch` före grenbyte; gör inte `git reset --hard`, `git clean` eller destruktiv städning.
- Astro, Node.js 24, privat `@amelio/web-platform` låst till `4ee0a081c3d799cd30e3075247fdb98473aa49f6`.
- Tillåtet publiceringsmål är **endast** `https://hallpartner-se.preview2.inleed.com/`, på **Amelios befintliga Inleed-konto**. Kundens WordPress ligger på annat hotell och ska INTE ändras. **Ingen ny domän, FTP-rot, DNS, namnserver eller produktionssajt.**
- Publicering sker automatiskt **bara från `main`**, via `.github/workflows/deploy-production.yml`. PR-workflows läser/testar utan uppladdning. Bildrättigheter, FTPS/HTTP-originalkontroll, Chrome och noindex är spärrar att bevara.
- Preview får ta emot syntetiska offertförfrågningar enligt senast godkänd V2-policy. Mottagning mejlar till Amelios testinfrastruktur, **inte** en bekräftad produktionsmottagare hos kunden. Den separata kontaktformulärsknappen är fortsatt inaktiv. Öppna INTE gammalt kalkylator- eller 36-frågorsspår.
- Driftklara nyckelfärdiga hallar och möjlighet till totalentreprenad är kundbekräftade. **Avtal avgör** projektering, grund, montage, installationer, ansvar, garantier och försäkringar. Byggherrens lagstadgade ansvar kvarstår. Inga löften om automatiskt bygglov, fasta garantier eller att allt ingår oavsett projekt.

## 2. Godkända förändringar från dagens arbete

**Före dagens nya release:** `main` var `d8bf0753dee7f57b1c91e97105e4c12ab9c21301`, efter godkänd PR #36 med startsidans budskap ”Nyckelfärdiga hallar”, offertvägar och sidan ”Så går det till”. Den publicerade tidigare versionen bekräftades i användarens webbläsare. Denna baseline är *inte* bevis för status efter nästa release.

**PR #37 – sex hallundersidor + bilder**

- Gren `feat/hallpartner-hallundersidor-copy-20261106`, verifierad käll-HEAD `ad4dbce656a2b22c81ea1dff5a92b45026871550`.
- Sex verkliga besökarrutter: `/stalhallar/lagerhall/`, `maskinhall/`, `ridhus/`, `plathall/`, `isolerad-hall/`, `talthall/`.
- Varje sida har unik H1, anpassad köpinriktad text, fråga om totalentreprenad, och tydlig offertväg samt processlänk; ingen offertteknik har ändrats.
- Sex separata fotorealistiska, AI-genererade konceptbilder, framtagna i Runways Amelio-arbetsyta och levererade av Andreas. Publicerade källor i `public/images/halls/` är optimerade WebP (1920×1080). `src/components/HallConceptImage.astro` visar bilden inne i hero med synlig märkning ”AI-genererad illustration. Bilden visar inte ett utfört Hallpartner-projekt.”
- Godkänd visuellt inriktning: fullbreddshero med **ljus gradient**, samma ton som breadcrumb (`#EBEBE8`). Ljust under mörk text, gradvis transparent åt höger, **ingen mörk gradient**. På mycket stora skärmar skyddar en tätare ljus ton den centrerade textkolumnen genom `calc(50% + 6rem)` och tonar ut vid `calc(50% + 28rem)`. Mobil har lodrät toning.
- Den gamla faktarutan ligger som kompakt remsa direkt efter hero, inte ovanpå fotot. Samma design i samtliga sex sidor. Andreas har granskat och sagt att det är godkänt **för nu**. Undvik ytterligare gradientfinjustering innan annat prioriterat är löst.
- Webb-bilder är **inte** verkliga Hallpartner-projekt, specifika certifierade system eller verifierade referenser. Egen fotografering och korrekt bytesättning är framtida arbete.
- Bildregister `config/preview-image-rights.json` har 59 poster totalt; exakt sex nya hashbundna godkännanden för **enbart denna Inleed-preview**. Underlag: `docs/preview/ai-hall-images-approval-20261106.md`. Allmän produktionslicens är INTE verifierad oberoende.
- Första gröna fulla candidate-validation för exakt PR #37: [run 42231523768](https://github.com/Amelio-AB/hallpartner/actions/runs/42231523768). CI [42231523575](https://github.com/Amelio-AB/hallpartner/actions/runs/42231523575), Footer [42231524179](https://github.com/Amelio-AB/hallpartner/actions/runs/42231524179), Release tooling [42231524186](https://github.com/Amelio-AB/hallpartner/actions/runs/42231524186) gröna.

**PR #38 – Om Hallpartner**

- Gren `feat/hallpartner-om-oss-helhetsleverans-20261106`, verifierad käll-HEAD `cc2f6261c5e25826dbd270bcb879487a07c8609c`.
- `/om-oss/` har tydligare erbjudande om nyckelfärdiga och driftklara hallar genom totalentreprenad. Bekräftade porträtt och yrkesroller för **Peter och Jimmy** bevarade. Sidan länkar till `/offert/`, `/kontakt/` och `/sa-gar-det-till/`.
- Inga påhittade referenser, årtal, godkännanden, leverantörsdata eller försäkringslöften. Ändrar bara Om oss, `hallpartner-info.css` och eget kontraktstest.
- CI [42232328486](https://github.com/Amelio-AB/hallpartner/actions/runs/42232328486) grön. Separat **Windows-test för tidig Chrome-start** i Release tooling [42232328530](https://github.com/Amelio-AB/hallpartner/actions/runs/42232328530) misslyckades intermittently med ”startup deadline exceeded” i stället för väntat ”Chrome exited”, medan Ubuntu var grön. Detta är inte ett skäl att försvaga testet. Samlad release måste testas på **exakt gemensam HEAD**. Full kandidatvalidering av PR #38 pågick vid checkpointens skapande.

## 3. Samlad release utan dubbel merge

- Den samlade releasegrenen `release/hallpartner-helg-20261106-hallar-omoss` byggs från **exakt PR #37-HEAD** och för in de **tre oförändrade källfilernas Git-blobbar från PR #38**. Inga överlapp hittades i de filer som PR #38 ändrade.
- Den här checkpointen och en återanvändbar agentprompt ligger i `docs/checkpoints/`. Både `AGENTS.md` och `README.md` hänvisar hit och varnar för historiska felaktiga statusuppgifter.
- Mergea **enbart den samlade release-PR:n** efter att *exakt commit* har passerat kvalitets- och publiceringsspärrarna. Mergea inte därefter #37/#38 igen; stäng dem utan att radera grenar och länka release-PR:n.
- Squash-merge till `main` ska trigga Inleed-previewdeploy. Kontrollera faktiskt SHA på nya `main`, Actions-jobbet `publish` med källversion, payload-, rights-, FTPS- och HTTP-bevis, samt Chrome-kontrollen på publicerad domän.
- Om publiceringen är grön men användaren ser gammal hero: verifiera värdnamnet och prova en cache-busting query med faktisk commit, inte en ny blind FTP-överföring.
- Gör **inte** anspråk på publicerad status innan detta har lyckats. Uppdatera release-PR:n med exakt SHA, URL till grön Actions-körning och kvarvarande eventuella problem.

## 4. Innehåll, design och senare arbete

- Använd aktiv webbdesign från `src/styles/`, inte gammal ”Direction 02”-palett. Idag används bl.a. mörk header `#071A16`, accent/CTA `#287B39`, breadcrumb/off-white `#EBEBE8`.
- AMP-002 Header, AMP-003 Footer, AMP-001 offertguide och AMP-006 hallkort bevarade. **Ingen ombyggnad av fungerande offertrouting eller SMTP** utan separat uppdrag.
- `AGENTS.md` och `README.md` innehåller även äldre historik om avstängd V2 och tretton HTML-sidor; de är inte korrekt nulägesbevis. Använd aktuell kod samt checkpoint som ersättande läsordning.
- Kundens önskan om en klar stegvis leverans finns redan på `/sa-gar-det-till/`. Myndighetslänkar till Boverket, Upphandlingsmyndigheten och Arbetsmiljöverket är allmän vägledning och inte Hallpartner-certifiering.
- **Nästa högst värderade arbetsuppgift efter stabil preview:** verifiera exakt leveransomfattning, garantier, försäkringar och hur Hallpartner ska beskriva myndighetskontakter i avtal/webbtext. Därefter granska bildval/referenskällor och kundens faktiska företagsuppgifter samt mobila CTA-vägar. Undvik att prioritera Header-sökfält/symbol i Footer före säljkritiska blockerare.
- Gammalt dokumentationsregister finns på Draft PR #2 och får inte antas vara mergat. PR #31 är historisk checkpoint med annan revisionsbas. Prioritera läsande inventering före grenstädning.

## 5. Återupptag nästa gång

1. Läs `AGENTS.md`, `README.md` och denna fil. Läs även `docs/checkpoints/2026-11-06-overlamningsprompt.md`.
2. Verifiera senaste `main` från GitHub, öppna PR och exakt senaste Actions-run. Läs release-PR:ens kommentarer för **faktiskt** merge-/deployutfall.
3. Om release fortfarande väntar eller har misslyckats, slutför utan att kringgå spärrar. Separera testflakiness från verkliga produkt-/FTP-fel.
4. Kontrollera `https://hallpartner-se.preview2.inleed.com/` på `/stalhallar/lagerhall/`, `/maskinhall/`, `/ridhus/`, `/plathall/`, `/isolerad-hall/`, `/talthall/` samt `/om-oss/` och `/offert/`. Säg uttryckligen om extern åtkomst saknas; GitHub Actions live-bevis är då bättre än att gissa.
5. Respektera att Andreas avslutat veckan, är nöjd med aktuell design och inte begärt extra bilder, ny video eller produktionslansering. Använd separata Draft-PR för nya ändringar och invänta godkännande innan merge.

**Detta dokument är ett checkpointunderlag från releasekandidaten. Läs en grön publiceringskörning, inte checkpointens datum, som bevis för leverans.**
