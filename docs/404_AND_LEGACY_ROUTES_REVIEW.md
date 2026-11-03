# Hallpartner – 404 och äldre presentationsrutter (2026-11-02)

**Status:** Avgränsat arbete i Draft PR #5. Ingen merge, FTP/DNS, driftsättning eller indexeringsändring.

Den tidigare 404-sidan använde Amelios presentationslayout och hänvisade till `/vision/`. Den är ersatt av en riktig Hallpartner-sida som återanvänder den befintliga besökarlayouten, samma Header och AMP-003 Footer. Den erbjuder fungerande länkar till startsidan, hallöversikten och Kontakt. Ingen påstådd kundservicefunktion eller mottagningsbekräftelse har lagts till.

404 är fortsatt `noindex,nofollow`, utan canonical och utanför sitemap. Astro genererar `dist/404.html`; faktisk HTTP-status för okända URL:er behöver kontrolleras på Inleed vid framtida driftsättning.

De historiska visionsrutterna `/projekt/`, `/vision/`, `/roadmap/`, `/workshop/` samt alla `/prototype/` är exkluderade ur sitemap. Deras filer och direktadresser finns **kvar** för historiskt granskningsarbete. Vi inför **inte** 301/410 eller borttagning innan HP-033 (inventering) och HP-034 (URL-beslut) har hanterats.

Kontroller krävs på exakt HEAD: Astro/TypeScript, ESLint, byggd 404-HTML och sitemap, interna länkar, noindex, återanvändning av Header/Footer samt Chrome mobil och desktop.