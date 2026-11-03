# AMP-002 – Hallpartner ikonmeny, isolerad Draft-granskning (2026-11-03)

## Omfattning och källa

Den verkliga startsidans Header, Hero, kundtexter och offertflöde ändras inte. Detta arbete gäller den isolerade, noindexerade AMP-002-testkomponenten på PR-basen `feature/hallpartner-v1-skeleton-20261031`. Kunden godkänner ett eventuellt globalt Header-byte separat.

- Produkt: **riktig** `@amelio/web-platform/header-menu` från plattformspaketet, inte kopierad JS/CSS.
- Godkänd privat källversion: **1.4.0**, exact Git SHA `fec9ca01b3c0d4bc9002fa21832a51cf51009749`.
- Paketdistribution: privat Git-källa, **ingen** antagen npm-publicering av 1.4.0.
- Testval: `classic-mega-menu`, med toppnivå `mobileToggleAppearance: 'icon'`. `mobileToggleTreatment` lämnas i plattformens kompatibla standardläge; ikonens utseende är samma som i granskad Amelio-presentation.
- Hallpartners logotyp, menyer, gröna CTA, Header-/Hero-tema och AMP-003 Compact Footer behålls.
- Delad innehållsbredd från separat Draft [plattforms-PR #31](https://github.com/Amelio-AB/amelio-web-platform/pull/31) ingår **inte** i denna commit.
- Det tidigare `AMP003_APPROVED_VERSION`-namnet representerade rotpaketets version, inte AMP-003-produktens egen version. Installationskontrollen skiljer nu ut den godkända **paket**versionen, utan att ändra Footerns konfiguration.

## Lokala testvägar efter autentiserat `npm ci`

| Adress | Innehåll |
| --- | --- |
| `http://localhost:4321/prototype/amp/header/mega/` | **Huvudgranskning:** Classic Mega Menu, ikon, mörkt Hero-foto |
| `http://localhost:4321/prototype/amp/header/mega/?tone=light` | Samma verkliga foto och Header, men ljust transparent Hero-tonläge som kontrast-stresstest (inte designförslag) |
| `http://localhost:4321/prototype/amp/header/solid/` | Classic Mega Menu och täckt, solid Header på intern testsida |
| `http://localhost:4321/prototype/amp/header/` | Befintlig Classic Dropdown, endast regressionsjämförelse |

Starta med Node 24+ och behörig privat paketinstallation: `npm ci`, `npm run dev`. Vid nedladdning från privat GitHub används read-only Git-autentisering, inte incheckade lösenord.

Serverrenderad reservnavigation visas endast när AMP-002 inte kan monteras. En lyckad AMP-002-montering döljer reserven. Befintlig Header på `/` och riktiga sidrutter ändras inte.

## Testkrav och bevis

`npm run check`, `npm run lint`, kontraktstester och `npm run build` måste passera med autentiskt, npm-genererat `package-lock.json`, där både rotberoende och installerad paketpost pekar på exakt godkänd SHA.

`scripts/capture-hallpartner-amp-header.mjs` testar AMP-002 i den **verkliga** Hallpartner-Astro-layouten vid 320/390/768/1024/1280/1440 CSS-pixlar, med 44×44-tryckyta, ikon/X, ARIA, mobilpanelens högerkant, menyer, överlapp, Escape, fokusåtergång, scroll-lås, keyboard Enter och Headerns scrollövergång. Testet sparar mobilpanel öppnad, header i sidlayout och JSON-rapport som GitHub Actions-artefakt.

De automatiska testerna kan inte ensamma garantera att hamburgarikonen eller den **vita** Hallpartner-logotypen syns tillräckligt mot verkligt fotografi vid `?tone=light`. Skärmbilder från Chrome på riktigt Hallpartner-foto visar att den mörka ikonen vid ljust Hero-tonläge blir **svårläst mot det mörka motivet**. Använd mörkt Hero-tonläge för denna bild; det ljusa läget är endast en teknisk regressionskontroll och kräver annat fotografi eller separat godkänt kontrastgrepp. Fokusramen är avsiktlig vid tangentbordsstyrning och skärmbildstestet sparar därför separat fokus- och normalt ikonläge. Verklig iPhone/Safari, skärmläsare och faktisk kund-CSP ska utvärderas separat.

**Status:** Integrationsgren och Draft PR för visuell granskning. Inget byte av besökarnas Header, ingen merge till main, FTP, Vercel, DNS eller produktionspublicering.
