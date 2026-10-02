# PAGE_SPEC.md

# Hallpartner Vision Site -- Page Specification

> Migration phase 1: Repot är nu kodbasen för Hallpartners riktiga webbplats.
> Nedanstående beskriver det bevarade visionskonceptet, inte en beslutad
> produktionsspecifikation. Innehåll och struktur: **pending live-site inventory**.
> Se AGENTS.md och README.md för aktuell omfattning.

## Översikt

Detta dokument beskriver syftet och den funktionella specifikationen för
varje sektion på webbplatsen. Varje sektion ska ha ett tydligt
affärsmål, en tydlig känsla och en definierad layout.

---

# 01 Hero

## Syfte

Rama in presentationen som en första analys och skapa nyfikenhet inför
samtalet.

## Huvudbudskap

**Hallpartner har mer att visa än vad en ny besökare ser i dag.**

## Layout

- Full viewport
- Bakgrundsbild/video
- Mörk overlay
- Text vänsterställd
- En CTA-knapp som startar presentationen

## Komponenter

- Header
- Hero
- CTAButton

## Animation

- Fade-in
- Långsam bakgrundszoom

## Bild

Drönarbild över färdig hall.

---

# 02 Styrkorna som redan finns

## Syfte

Skapa förtroende genom att börja i verksamhetens faktiska styrkor.

## Layout

Fyra informationskort och en kort slutsats.

## Känsla

Stolthet och trovärdighet.

---

# 03 Kundens väg till beslut

## Syfte

Visualisera den moderna kundresan.

## Layout

Horisontell process:

Sök → Jämför → Förtroende → Kontakt → Affär

---

# 04 Digital potential

## Syfte

Visa möjligheten, inte problemet.

## Layout

Tre kort: - Erbjudande - Referensprojekt - Nästa steg

---

# 05 Visionen

## Syfte

Sammanfatta webbplatsens uppgift i ett kort, inspirerande påstående.

## Layout

Mörk statement-sektion utan länk eller mockup.

---

# 06 Frågor till Hallpartner

## Syfte

Skapa dialog och pröva analysens hypoteser mot verksamheten.

## Layout

Sex öppna frågor i en koncentrerad lista utan färdiga svar.

---

# 07 Arbetssätt

## Syfte

Visa en trygg och begriplig väg framåt utan att låsa lösningen i förväg.

## Layout

Sex faser i en tidslinje och en diskret fördjupningslänk.

---

# 08 Förväntad affärsnytta

## Syfte

Beskriva vilken märkbar skillnad arbetet ska skapa för kund och
försäljning.

## Layout

Fem ikonblock.

---

# 09 Avslutande dialog

## Syfte

Lämna presentationen i en öppen fråga och bjuda in till nästa samtal.

## Layout

En rubrik, en kort text och en kontaktknapp.

---

# Referensprojekt (/projekt/)

## Syfte

Inspirera Hallpartner och visa hur ett professionellt referensbibliotek kan
bygga förtroende, stödja försäljningen och stärka den digitala synligheten.

## Layout

- Presentationshero med överrubrik, H1 och ingress
- Fyra informationskort om affärsnyttan
- Diskret information om att projekten är demonstrationsmaterial
- Tre projektkort med lokala, responsiva bilder
- Rekommendation och checklista för löpande projektdokumentation
- Avslutande CTA till kontakt och startsidans analys

## Komponent

- SectionIntro
- StrengthGrid
- ProjectGrid
- ProjectCard
- CTASection

## Responsivitet

- Desktop: tre projektkort
- Tablet: två projektkort
- Mobil: ett projektkort

---

# Roadmap (/roadmap/)

## Syfte

Visa arbetsprocessen.

## Layout

Vertikal tidslinje.

## Faser

1.  Insikt
2.  Strategi
3.  Design
4.  Utveckling
5.  Lansering
6.  Förbättring

---

# Gemensamma regler

## Desktop

1440px maxbredd.

## Tablet

Två kolumner där möjligt.

## Mobil

En kolumn.

## Tillgänglighet

- Semantisk HTML
- Fokusmarkering
- Alt-texter
- WCAG AA

## SEO

- En H1 per sida
- Beskrivande rubriker
- Internlänkning
- Optimerade metadata

Version 1.0
