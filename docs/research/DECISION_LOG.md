# Beslutslogg – pre-production

> **Status:** Projektbeslut som gäller tills de uttryckligen ändras.
>
> Detta dokument beskriver tekniska/projektmässiga beslut, inte obekräftade verksamhetsclaims.

## 2026-10-02 – Produktionswebbplats

- Nya hallpartner.se byggs i **Astro + TypeScript** med statisk output.
- Slutlig domän är `https://hallpartner.se`.
- Preview ska vara **noindex** tills separat lanseringsbeslut tas.
- Hosting/DNS/previewproblem hanteras separat från innehålls- och affärsresearch.

## 2026-10-02 – Offertwizard

- **Carlstad Stadsbuds offertguide är beslutad UX-/interaktionsreferens och teknisk modell att utgå från för Astro-wizarden.**
- Referensen gäller bland annat wizardstruktur, progress, stegvis navigation, choice cards, responsivt beteende, validering, fokus, summary/edit och backendfel tillbaka till rätt fält/steg.
- Stadsbuds affärsfrågor, payload och PHP-endpoint ska inte kopieras.

### Amelio Quote Engine

- `Amelio-AB/amelio-quote-engine` ska **inte** användas som motor, kodbas eller teknisk arkitektur i Astro-projektet.
- Det gamla arbetet får endast användas som historiskt underlag för frågor, edge cases och affärslogik som tidigare diskuterats.
- Inget WordPress-/Elementor-/PHP-spår ska portas till den nya sajten.

## 2026-10-02 – Grafisk design

- CSS och visuell design från den gamla/provisoriska visionssajten `hallpartner.amelio.se` ska **inte** användas som beslutad produktionsdesign.
- Befintliga `docs/DESIGN_SYSTEM.md`, färger och typografi är historiskt/idématerial tills Hallpartner och Amelio fastställt den nya grafiska profilen.
- Gamla komponenter kan studeras för generell struktur eller tillgänglighetsmönster, men får inte styra produktionsutseendet automatiskt.

## 2026-10-02 – Affärsinnehåll

- Peter/Jimmy ska verifiera verksamhetsfakta innan viktig produktionscopy låses.
- Nuvarande hallpartner.se är källa till **befintliga publicerade påståenden**, inte automatiskt bevis för att påståendena är korrekta.
- Legacy-bilder är material att inventera, inte automatiskt verifierade referensprojekt.
- Den slutliga sitemapen ska beslutas först när erbjudande, prioriterade kundtyper och leveransomfattning är bättre verifierade.

## 2026-10-02 – OFFERTFLODE.md

- Dokumentet är ett omfattande arbetsunderlag.
- De tio nuvarande stegen är **inte** låsta som slutligt första kundflöde.
- Frågor ska reduceras efter principen:
  - behövs före första kontakt
  - frivillig fördjupning
  - tas av sälj/projektledning senare
  - intern/teknisk information
- Målet är färre relevanta frågor, inte maximal datainsamling.


## 2026-10-02 – Provisorisk grafisk riktning v0.1

- Den uppladdade ljusa Hallpartner-moodboarden får användas som provisorisk arbetsriktning för prototyper och komponentfoundation.
- Moodboardens genererade logotyp ska **inte** användas. Hallpartners originala logotyp gäller.
- Moodboardens slogans och andra påhittade verksamhetsbudskap ska inte användas.
- Provisorisk palett: Off White `#F8F7F4`, Light Sand `#E8E1D6`, Pale Stone `#D0C9BE`, Sage Green `#A7B89F`, Warm Taupe `#A59686`, Graphite `#2E2E2E`.
- Inter får användas provisoriskt.
- All styling ska gå genom semantiska design tokens så att profilen kan bytas utan att sidarkitektur eller komponent-API skrivs om.
- Slutlig grafisk profil beslutas senare tillsammans med Hallpartner.
