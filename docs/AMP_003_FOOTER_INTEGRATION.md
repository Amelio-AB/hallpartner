# Hallpartner – AMP-003 Footer installerad i Draft

**Status 2026-11-02: AMP-003 Compact v1.1.0 är versionslåst och aktiv som standard på Hallpartners nya Astro-sidor i arbetsgrenen `feature/hallpartner-v1-skeleton-20261031`.** Fortfarande **Draft PR #5**, `noindex,nofollow`, ingen merge, FTP, DNS eller Inleed-publicering.

## Exakt källa och verifiering

- Privat paket: `@amelio/web-platform`, godkänd v1.1.0, SHA `a11811bfbf51416e7fe7d58aed4551be77914d65`.
- Beroendet är hämtat via GitHub med `github:Amelio-AB/amelio-web-platform#a11811bfbf51416e7fe7d58aed4551be77914d65` i `package.json` och npm-genererad motsvarighet i `package-lock.json`.
- Låsfilens paketpost och integritetshash kommer från en **verklig `npm install`**, inte ett antagande. En **ren `npm ci` med separat npm-cache** återinstallerade rätt paket och en AMP-aktiverad Astro-build passerade: [GitHub Actions – installations- och låsfilskontroll](https://github.com/Amelio-AB/hallpartner/actions/runs/41398415881).
- Dessförinnan passerade faktisk AMP-rendering, servergenererad HTML och Chrome i 320/390/768/1280/1440 px i den separata [privata consumer-körningen](https://github.com/Amelio-AB/hallpartner/actions/runs/41398162735).
- Den vanliga Draft-CI:n ska nu göra `npm ci` med en temporär Git-askpass på **Node 24** och testa AMP-Footern som standard. Tokenen är tillgänglig endast under själva installationssteget, inte under build eller test. Ingen credential finns i paketfilerna.

## Sidomfattning

Den gemensamma `HallpartnerDraftLayout.astro` renderar AMP-003 **Compact** för alla riktiga besökarsidor: `/`, `/stalhallar/`, de sex hallundersidorna, `/kontakt/`, `/sa-gar-det-till/` och `/om-oss/`. Alla äldre `/prototype/hallpartner/` behåller sitt gamla granskningsutseende och sin Footer. Vi har **inte** ersatt Header/Hero eller lagt till den separata AMP Final CTA.

Konfigurationen i `src/config/hallpartner-footer.mjs` innehåller Hallpartners logotyp, mörkgrön arbetsprofil, verifierbara lokala länkar samt samma **preliminära** telefon och e-post som på kontaktsidan. Dessa företags- och kontaktuppgifter ska godkännas av Hallpartner innan lansering. Inga obekräftade bolags-/adressuppgifter, integritetslänkar, cookieinställningar eller påstådd mottagning har lagts till.

## Bygg och rollback

`npm run dev` och `npm run build` genererar Footerns HTML och original-CSS från paketets **publika export**. Filerna läggs i ignorerade genererade kataloger; plattformens källkod kopieras inte till Hallpartner.

För att tillfälligt granska tidigare Footer på de riktiga sidorna:

```powershell
$env:HALLPARTNER_FOOTER_MODE = "legacy"
npm run dev
```

Ta bort miljövariabeln för att återgå till AMP-003. Den vanliga CI:n testar även ett explicit legacy-bygge efter att AMP-versionens skärmbilder sparats. Om beroendet eller tokenåtkomsten fallerar så avbryts ett normalt `npm ci` i stället för att tyst bygga en annan design. En fullständig rollback av beroendet kräver att både `package.json` och `package-lock.json` återställs till tidigare granskad commit.

## Säkra privata beroenden

**Secret:** `AMELIO_PLATFORM_READ_TOKEN` i Hallpartners repository Actions secrets, med read-only till det privata Amelio-repot. Den används via en temporär `GIT_ASKPASS` och får inte visas i loggar, frontend, källkod eller låsfil. För lokalt Windows-arbete behövs en GitHub-inloggning med motsvarande läsåtkomst (t.ex. Git Credential Manager). Dela aldrig token i chatt eller terminalutskrifter.

Varning: giltighetstiden för tokenen kan vara kort; ett utgånget värde stoppar framtida clean installs. På sikt är en organisationsstyrd, kortlivad GitHub App-token ofta bättre för CI.

## Återstående före lansering

1. **Slutlig CI på exakt Hallpartner HEAD** med AMP default, HTML/noindex, mobil/desktop och verifierad legacy-rollback.
2. Visuell ägargranskning av AMP-Footern i webbplatsens riktiga sidkontext samt kundverifiering av e-post/telefon och lagliga sidtexter.
3. **Före eventuell merge/produktion:** förbered och testa Node 24 och tillåten privat paketåtkomst även i det separata produktionsworkflowet. Det finns i dag äldre Node-konfiguration där och det workflowet har medvetet **inte** ändrats här. Ändra inte `main`, FTP-target, DNS eller noindex utan separat godkännande.

Slutligen: en passerad Chrome-emulering är inte en fysisk skärm-/skärmläsargranskning och innebär inte kundens lanseringsgodkännande.
