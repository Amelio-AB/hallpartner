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

Props: - eyebrow - title - subtitle - primaryCTA - valfri secondaryCTA -
image

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

# CustomerQuestions

Visar en koncentrerad lista med öppna frågor som stöd för dialog i mötet.

Props: - title - intro - questions\[\] - closing

---

# ConversationPrompt

Markerar en naturlig paus där presentatören bjuder in Hallpartner i
samtalet.

Props: - question

---

# WorkshopQuestions

Renderar workshopsidans typade frågeområden. Varje fråga innehåller en
preliminär bild, en förklaring av frågans betydelse och en utskrivbar
anteckningsyta. Innehållet visas utan externa JavaScriptberoenden.

Props: - categories\[\] - analysis\[\]

---

# WorkshopSummary

Avslutande arbetsunderlag för målbild, målgrupper, prioriteringar,
innehåll, ansvar och nästa steg. Alla ytor är visuella anteckningsfält och
sparar ingen information.

---

# OpportunitySection

Visar affärsmöjligheten.

Props: - title - cards\[\]

---

# ProjectCard

Visar ett referensprojekt.

Props: - id - title - category - image - imageAlt - description - href -
linkLabel

Bild: - Astro Image - responsiva bildstorlekar - 4:3-format - object-fit cover

Hover: - lätt bildzoom

---

# ProjectGrid

Grid av ProjectCard.

Props: - projects\[\]

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

# Skip-länk

BaseLayout innehåller en tangentbordsfokuserbar länk direkt till
huvudinnehållet.

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
