# Hallpartner – överföring av de sex Runway-originalen till Draft PR #37

**Status 2026-11-06:** Sex separata AI-genererade konceptbilder skapade i Runways arbetsyta **Amelio**, 16:9, 2K. Status är `generated_in_runway_not_imported`: inga originalfiler är ännu importerade till GitHub och inga nya bildvägar refereras av webbplatsen.

**Teknisk begränsning:** Runway visar originalens bild-URL:er i denna konversation, men filbytes kan inte hämtas till modellens arbetscontainer. Försök att låta webbplatsen använda temporära signerade länkar skulle skapa trasiga bilder när länkarna löper ut. Den tidigare felbeskurna bildsamlingen är inte godkänd som fullstor källa.

## Säker import på Andreas dator

1. Ladda ned bilderna från **Amelio → Assets** i Runway som original i PNG-format (inte skärmdumpar). Identifiera respektive bild med task-id enligt [manifestet](hallpartner-ai-image-originals-20261106.json).
2. Lägg de sex originalfilerna i valfri **temporär mapp utanför projektets webbrot**, t.ex. `C:\webbprojekt\hallpartner-bildoriginal`; namnge dem enligt manifestet: `lagerhall.png`, `maskinhall.png`, `ridhus.png`, `plathall.png`, `isolerad-hall.png`, `talthall.png`.
3. Kontrollera att `C:\webbprojekt\hallpartner` är ren i Git innan du byter arbetsgren. Gå till `origin/feat/hallpartner-hallundersidor-copy-20261106` (den aktuella Draft PR #37) och kör `node scripts/hall-image-preflight.mjs C:\webbprojekt\hallpartner-bildoriginal`.
4. **Innan import:** granska de sex fullstora motiven. Titta särskilt på orealistiska portar, takstolar, förankringar, djur och maskiner. Bildgenerering kan hitta på konstruktionsdetaljer.
5. Konvertera godkända bilder till WebP för webbplatsen och lägg under `public/images/halls/` med `targetFile`-namnen från manifestet. Dessa filer skall vara faktiska Git-versionerade bilder; inga externa signerade URL:er.
6. Koppla respektive statisk bildväg i rätt Astro-sida på grenen. Säkerställ att varje bild visar **AI-genererad illustrationsbild** och aldrig ett verkligt Hallpartner-projekt. Den ska senare vara enkel att ersätta med kundens foto.
7. Kör `npm.cmd run check`, `npm.cmd run lint`, `npm.cmd run build` samt Node-test och Chrome-review. Stanna på Draft PR #37 för Andreas slutliga visuella godkännande, ingen merge/publicering.

**Avgränsning:** Guiden är framtagen för att hålla redan godkända texter intakta och förhindra brutna bildreferenser på Inleed. Bilderna kan inte likställas med verifierade verkliga projekt.
