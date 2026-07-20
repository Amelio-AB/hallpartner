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

Under presentationsfasen:

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

Domän under konceptfas:

hallpartner.amelio.se

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
