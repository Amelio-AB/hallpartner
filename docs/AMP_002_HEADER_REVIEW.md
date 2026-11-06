# AMP-002 Spacious – kandidatgranskning (2026-11-06)

Aktuell integration och före-/efterbilder: [Spacious Navigation](reviews/amp002-spacious/README.md).
Den riktiga besökarnavigationen använder nu uttryckligen `navigationAppearance: 'spacious'`
och `classic-mega-menu`, från privat plattformskälla
`2bde176de3509c2ceb4c1bebdf2e69c48120e4d9`. Paketets rotversion är fortfarande `1.5.0`.
Detta är en utvecklingskandidat, inte en merge eller publicering.

Dokumentet nedan bevaras som historik från tiden före webbplatskonsolideringen.
Dess prototyprutter finns inte längre och ska inte återinföras.

---

# Historik: AMP-002 Header – avgränsad lokal granskning (2026-11-02)

Status: ISOLERAD ARBETSPROTOTYP. Den godkända riktiga startsidan på /, dess Header och Hero är oförändrade. Ingen merge, FTP, DNS, Inleed-deploy eller noindex-ändring.

## Tre jämförbara AMP-002-vyer

- http://localhost:4321/prototype/amp/header/ – godkänd AMP-002 Classic Dropdown framför samma Hallpartner-bild-Hero och startsidesinnehåll.
- http://localhost:4321/prototype/amp/header/mega/ – AMP-002 Classic Mega Menu framför samma startsidesinnehåll.
- http://localhost:4321/prototype/amp/header/solid/ – AMP-002 Classic Dropdown med täckt Header på en testundersida utan Hero.

Länkar och färger ägs av Hallpartner i src/config/hallpartner-amp-header.ts. Båda Header-varianterna monteras med mountHeaderMenu från det redan versionslåsta privata paketet @amelio/web-platform 1.1.0, käll-SHA a11811bfbf51416e7fe7d58aed4551be77914d65. Produktens faktiska CSS importeras. Separat godkänd AMP-003 Footer återanvänds.

Vid lyckad AMP-montering döljs den serverrenderade reservnavigationen helt; om JS inte fungerar behålls denna fungerande navigation. AMP-002 hanterar själv scroll, hover, disclosure, Escape, mobil dialog och fokus. Sidorna är noindex och exkluderade från sitemap.

## Att granska

1. Jämför logotyp, menyspacing och CTA mot den godkända riktiga startsidan på desktop.
2. Kontrollera transparent Header över hallbild, solid Header efter scroll och läsbarheten på mobil.
3. Prova Hallar-menyn via mus, Enter, Escape, utanförklick och kontrollera att alla sex halltyper länkar rätt.
4. På 320/390 px: mobilmeny, dialog, scroll-lås och fokusåtergång.
5. På solid-undersidan: inga överlapp med H1 eller innehåll; även vid textzoom.

AMP-002 är produktgodkänd men denna Hallpartner-integration är en arbetsprototyp som behöver visuell ägargranskning innan den får ersätta nuvarande Header. Välj inte automatiskt Megameny bara för att den är tekniskt tillgänglig.

Kontroller: Astro/TypeScript, ESLint, kontraktstester, byggd noindex-HTML, Chrome 320/390/768/1280/1440px och dokumenterade skärmbilder. Fysiska telefoner/skärmläsare är en separat begränsning.
