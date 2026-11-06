# Hallpartner – bildpaketet och hero-layouten på Draft PR #37

**Status 2026-11-06:** Andreas har skickat sex original i 2560 × 1440, optimerade till sex WebP-bilder på 1920 × 1080 och importerade till **`feat/hallpartner-hallundersidor-copy-20261106`** (PR #37). De ligger inte på `main` eller Inleed-previewn.

**Aktiv bildkälla:** `public/images/halls/`; [WebP-manifestet](hallpartner-webp-import-manifest-20261106.json) innehåller de sex filernas exakta SHA-256 och storlekar. Filnamnen är neutrala och avsedda för framtida utbyte mot riktiga kundfoton.

## Nuvarande placering
- `src/components/HallConceptImage.astro` används **inne i hero** på alla sex hallsidor.
- `src/styles/hallpartner-hall-detail.css` lägger en off-white gradient bakom mörk hero-text, utan mörk ton över bilden.
- På mobil ligger bildens tydliga del längre ned i samma hero, med ljus övergång ovanför.
- Faktarutan med tre frågor ligger i en låg, ljus informationsremsa efter hero.
- Markeringen *AI-genererad illustration. Bilden visar inte ett utfört Hallpartner-projekt.* visas med varje bild.
- Existerande extra bilder i andra innehållsavsnitt behålls tills vidare.

## Lokalt granskningstest
```powershell
cd C:\webbprojekt\hallpartner
git status --short --branch
git fetch origin
git pull --ff-only origin feat/hallpartner-hallundersidor-copy-20261106
node --test tests/hall-concept-photos.test.mjs
npm.cmd run dev
```
Kör endast `git pull` när arbetsmappen är ren och du befinner dig på PR #37-grenen. Astro visar den faktiska porten (t.ex. `http://localhost:4322/`). Kontrollera 320/390/768/1280/1440 pixlar, rubrikernas läsbarhet och att port, ridytor och andra motiv inte döljs oproportionerligt mycket.

## Före merge / publicering
- Granska alla sex hero-bilder. Fotonas skenbara konstruktioner är AI-genererade och får inte beskrivas som verklig teknisk referens.
- Lägg till sex korrekt SHA-bundna **preview-only**-godkännanden i `config/preview-image-rights.json` med saklig dokumentation först efter Andreas godkännande av bildanvändningen.
- Kontrollera fullständig kandidatvalidering och publicera endast till Amelios befintliga Inleed-preview efter separat godkännande.

**Kundens WordPress och DNS påverkas inte.**
