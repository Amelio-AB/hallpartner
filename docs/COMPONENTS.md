# COMPONENTS.md

# Hallpartner Vision Site -- Component Specification

## Syfte

Detta dokument definierar alla återanvändbara komponenter i
Astro-projektet. Varje komponent ska ha ett tydligt ansvar, vara lätt
att återanvända och följa designsystemet.

---

# Layout Components

## BaseLayout

Ansvar: - HTML-struktur - Metadata - SEO - Robots - Global CSS -
Header - Footer

Props: - title - description - canonical - image - noindex

---

## PresentationLayout

Ansvar: - Layout för den filmiska presentationssidan - Sektioner med
stora mellanrum - Scrollvänlig upplevelse

---

# Navigation

## Header

Innehåller: - Logotyp - Primär navigation - CTA-knapp - Mobilmeny

Props: - currentPage

---

## Footer

Innehåller: - Navigation - Kontakt - Copyright - Vision-information

---

# Hero

Ansvar: - Första intrycket - Hero-copy - CTA - Bakgrundsbild/video

Props: - eyebrow - title - subtitle - primaryCTA - secondaryCTA -
backgroundImage

---

# SectionIntro

Gemensam introduktion för sektioner.

Props: - title - intro - align

---

# StatementSection

Används för stora budskap.

Exempel:

"Ni bygger inte hallar."

Props: - statement - supportingText - image

---

# StrengthGrid

Visar Hallpartners styrkor.

Props: - items\[\]

Item: - title - description - icon

---

# CustomerJourney

Visar kundresan.

Steg: - Söker - Jämför - Bygger förtroende - Kontakt - Affär

Props: - steps\[\]

---

# OpportunitySection

Visar affärsmöjligheten.

Props: - title - cards\[\]

---

# BrowserMockup

Renderar en webbläsarram.

Props: - image - caption

---

# ProjectCard

Visar ett referensprojekt.

Props: - title - category - location - image - description - href

Hover: - lätt bildzoom - pilanimation

---

# ProjectGrid

Grid av ProjectCard.

Props: - projects\[\]

---

# KnowledgeCard

Visar artikel eller guide.

Props: - title - category - readingTime - href

---

# KnowledgeGrid

Grid med KnowledgeCards.

Props: - articles\[\]

---

# RoadmapTimeline

Visar projektets faser.

Props: - phases\[\]

Phase: - title - description

---

# ResultsGrid

Visar förväntade resultat.

Props: - results\[\]

Result: - icon - title - text

---

# CTASection

Avslutande sektion.

Props: - title - text - button

---

# ButtonLink

Gemensam knappkomponent.

Varianter: - primary - secondary - ghost

Props: - href - label - variant

---

# LogoPlaceholder

Temporär logotyp.

Byts senare mot Hallpartners riktiga logotyp.

---

# SeoHead

Ansvar: - title - meta description - Open Graph - canonical - robots

---

# SkipLink

Tillgänglighetskomponent.

Hoppar direkt till huvudinnehållet.

---

# Gemensamma regler

Alla komponenter ska:

- vara återanvändbara
- använda TypeScript
- vara semantiska
- fungera utan JavaScript där möjligt
- följa WCAG AA
- använda CSS-variabler från designsystemet
- undvika duplicerad markup

Version 1.0
