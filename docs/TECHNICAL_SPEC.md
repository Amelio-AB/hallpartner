# TECHNICAL_SPEC.md

# Hallpartner Vision Site -- Technical Specification

## Syfte

Detta dokument beskriver den tekniska arkitekturen,
utvecklingsprinciperna och kvalitetskraven för projektet.

---

# Teknikstack

## Ramverk

- Astro (senaste stabila version)

## Språk

- TypeScript
- HTML5
- CSS (moduler eller organiserade globala filer)

## Paket

- @astrojs/sitemap
- Astro Compress (vid behov)
- ESLint
- Prettier

---

# Mappstruktur

    src/
      components/
      layouts/
      pages/
      styles/
      assets/

    public/
    docs/

    astro.config.mjs
    tsconfig.json

---

# Kodstandard

- TypeScript strict mode
- Små och fokuserade komponenter
- Återanvändbara props
- Ingen duplicerad kod
- Beskrivande fil- och komponentnamn

---

# CSS

- Mobile First
- CSS-variabler
- Logiska spacing-värden
- Konsekvent typografisk skala
- Begränsad nesting

---

# Prestanda

Mål:

- Lighthouse Performance ≥ 95
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

Optimeringar:

- Lazy loading av bilder
- Responsive images
- Minifierade tillgångar
- Förladdning av kritiska resurser
- Minimal JavaScript-mängd

---

# SEO

- En H1 per sida
- Unika titlar och metabeskrivningar
- Canonical-taggar
- XML-sitemap
- robots.txt
- Semantisk HTML
- Strukturerad internlänkning

Under utveckling och i preview (behåll skyddet):

    <meta name="robots" content="noindex,nofollow">

---

# Tillgänglighet

Projektet ska följa WCAG 2.2 AA:

- Tangentbordsnavigering
- Synliga fokusmarkeringar
- Korrekt rubrikhierarki
- Alt-texter
- Tillräcklig kontrast
- prefers-reduced-motion

---

# Git

Branch-strategi:

- main
- feature/\*
- fix/\*

Commits:

- feat:
- fix:
- docs:
- refactor:
- chore:

---

# Deployment

Miljöer:

- Lokal utveckling
- Preview
- Produktion

Slutlig site/canonical: https://hallpartner.se.
Preview: https://hallpartner-se.preview2.inleed.com.

Migration phase 1: befintligt lftp-workflow kör endast dry-run mot `./`,
relativt kontots custom root `/domains/hallpartner.se/public_html/`.
Verifiera root och granska första dry-run före upload. Ingen serverradering.
DNS och secrets ändras inte. Se README.md för nästa steg.

---

# Kvalitetssäkring

Kontroll före leverans:

- Bygg utan fel
- Inga brutna länkar
- Responsiv på mobil, surfplatta och desktop
- SEO verifierad
- Tillgänglighet verifierad
- Visuell genomgång

---

# Framtida utveckling

Förbered arkitekturen för:

- CMS-integration
- Blogg
- Referensprojekt
- Formulär
- Flerspråkighet
- Analysverktyg

Version 1.0
