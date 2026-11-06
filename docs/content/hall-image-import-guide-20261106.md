# Hallpartner – Runway-original och importerade WebP-bilder

**Aktuellt läge 2026-11-06:** Sex separata 2K-original genererades i Runways arbetsyta Amelio och tillhandahölls av Andreas i en ZIP-fil. Original-PNG:erna förvaras utanför Git, medan sex optimerade **1920 × 1080 WebP** nu är incheckade på **Draft PR #37**.

Runway-originalens uppgifts-ID och bildkoppling finns i [källmanifestet](hallpartner-ai-image-originals-20261106.json). De versionshanterade WebP-filernas exakta SHA-256 finns i [webbmanifestet](hallpartner-webp-import-manifest-20261106.json).

## Vad som är klart
- Alla sex bilder är importerade till `public/images/halls/` på granskningsgrenen, inte `main`.
- Filernas format, dimensioner och SHA-256 verifieras av `tests/hall-concept-photos.test.mjs`.
- Varje hallsida använder `HallConceptImage.astro` i hero med **ljus gradient**, och har kvar sina tidigare innehållssektioner.
- Alla AI-bilder märks som illustrationer, aldrig som utförda referensprojekt.

## Vad som återstår
1. Andreas granskar resultatet visuellt på localhost, både i mobil och desktop.
2. Bildrättighetsregistret får sex SHA-bundna poster **enbart för Inleed-preview** efter användarens godkännande av bildanvändningen. Den nu röda rättighetskontrollen är en avsiktlig spärr, inte något att kringgå.
3. Efter godkända tester och granskning kan Draft PR #37 tas upp till mergebeslut. Kundens WordPress och DNS får inte ändras.

Original-PNG behövs normalt inte igen. De kan senare bytas ut mot verifierade Hallpartner-foton genom att uppdatera samma bildeftersom filnamn, alt-text och bildrättigheter per sida.
