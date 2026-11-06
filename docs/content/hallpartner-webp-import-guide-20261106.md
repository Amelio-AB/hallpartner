# Bildimport – färdiga original för Hallpartner PR #37

**Status:** Samtliga sex originella, separata 2560×1440 PNG-bilder har skickats in av Andreas den 6 november 2026 och konverterats till **1920×1080 WebP**. De är ännu inte importerade till GitHub i den här committen.

**Färdigt paket:** `hallpartner-pr37-fardiga-webpbilder.zip` finns som separat bilaga i ChatGPT-samtalet. Arkivet innehåller exakt sex filer under `public/images/halls/`, med sökvägar och SHA-256-hashar i [manifestet](hallpartner-webp-import-manifest-20261106.json).

## Så fungerar den nya placeringen

- Komponent: `src/components/HallConceptImage.astro`, ett foto **inne i hero** med ljus gradient bakom mörk text, utan separat stor bildsektion efter hero.
- Den tidigare hero-faktarutan finns kvar direkt under hero i en kompakt informationsremsa, så den inte blockerar bilden.
- Mobil använder ett synligt fotomotiv i nedre delen av heron och en ljus toning ovanför.
- Bilden visas enbart om motsvarande WebP finns som **faktisk fil** i `public/images/halls/`. Därmed visas inga brutna bild-URL:er medan filöverföringen återstår.
- Varje visad bild får en kort märkning: **AI-genererad illustration. Bilden visar inte ett utfört Hallpartner-projekt.**
- Text, fotografier som redan ligger på andra delar av sidorna samt ankarlänkarna behålls.
- Byt senare bilden mot kundens eget foto genom att justera filen som komponenten väljer för respektive slug; behåll samma bildyta och aktualisera alt-text.

## Överföring och granskning

1. Kontrollera att ordinarie arbetsmapp `C:\webbprojekt\hallpartner` inte har lokala ändringar. Byt till aktuell gren `feat/hallpartner-hallundersidor-copy-20261106`, *inte* `main`.
2. Packa upp `hallpartner-pr37-fardiga-webpbilder.zip` i repots rot. ZIP:ens interna katalogstruktur skapar `public/images/halls/`.
3. Kör `node --test tests/hall-concept-photos.test.mjs` för att kontrollera exakt sex original, pixelstorlek och SHA-256.
4. Kör projektets check/lint/build och granska i localhost. Särskilt 320/390/768/1280/1440 pixlar.
5. Committa bara de sex nya WebP-filerna på PR #37-grenen och pusha den. Vänta med merge.
6. **Innan preview-publicering** måste de sex SHA-bound-bildrättighetsregistreringarna läggas till i `config/preview-image-rights.json` med Andreas faktiska godkännande och dokumenterad preview-omfattning. Det är en avsiktlig säkerhetsspärr.
7. Granska bilder och färdigt innehåll innan merge till `main`.

Inga bilder får beskrivas som verkliga kundprojekt, visa falska logotyper eller användas som dokumentation av tekniska byggsystem.
