# Plan medan vi väntar på Hallpartner

> **Status:** Arbetsplan. Inga kundsvar antas.

## 1. Offertwizard – referensanalys

**Status:** påbörjad.

Klart i research:

- Stadsbud är UX-/interaktionsreferens.
- Amelio Quote Engine ska inte användas som Astro-motor.
- gamla Hallpartner-frågor får endast användas som historik.
- summary/edit, focus, validation och disabled-panel-principen är värda att återanvända.

Nästa när kundsvar finns:

- definiera minsta informationsmängd före första kontakt
- skapa frågespec v0.3
- först därefter bestämma visuella steg

## 2. Reducera OFFERTFLODE.md

**Status:** arbetsmodell skapad.

Arbetsklassning:

- A: före första kontakt
- B: frivillig detalj
- C: sälj/projektledning senare

Peter/Jimmys svar avgör slutlig klassning.

## 3. Claim/evidence

**Status:** arbetsregister skapat.

Nästa utan kund:

- markera varje publicerat Hallpartner-claim som verifierat/obekräftat
- samla käll-URL
- förbereda kolumner för dokumentbevis

Efter kundsvar:

- ersätt antaganden med godkänd fakta
- skapa permanent source of truth

## 4. URL-migrering

**Status:** kärn-URL:er inventerade.

Kan göras nu:

- behåll lista över publika routes
- dokumentera uppenbara innehållsrisker
- undvik att byta slugs i förtid

Blockerat till senare:

- fullständigt redirectbeslut kräver Search Console/Analytics/full crawl

## 5. Media

**Status:** filinventering skapad.

Kan göras nu:

- identifiera dubbletter
- gruppera efter materialtyp
- förbereda metadatafält

Blockerat:

- projektidentitet
- rättigheter
- Hallpartners scope
- publiceringsgodkännande

## 6. Innehållsmallar

Kan förberedas utan copy.

### Produktsida – strukturell mall

1. vilket behov lösningen passar
2. när den är relevant
3. möjliga utföranden
4. verifierad leveransomfattning
5. kundens/andras ansvar
6. kostnadsdrivare
7. projektprocess
8. verkligt referensprojekt
9. verkliga kundfrågor
10. CTA

Fyll inte dessa rubriker med claims innan fakta finns.

### Referenscase – strukturell mall

- kund/bransch
- behov
- plats
- år
- storlek
- vald lösning
- Hallpartners faktiska scope
- kundens/andra entreprenörers scope
- bilder under processen
- resultat
- kundcitat endast med godkännande

## 7. Grafisk design

Vänta med produktionsdesign.

Kan göras nu:

- samla grafiska riktningar som redan diskuterats
- inventera logotyp/original
- samla verkliga material- och bildtyper

Ska inte göras nu:

- använda CSS från hallpartner.amelio.se som produktionsgrund
- låsa gamla visionsfärger/Manrope
- skriva färdig komponent-CSS för nya sajten

## 8. Tekniskt repoarbete

Main ska lämnas orörd i researchfasen.

Efter affärsbeslut:

1. uppdatera AGENTS/README så historisk information inte styr AI fel
2. ersätt visions-SITEMAP med beslutad produktionsstruktur
3. skapa BUSINESS_FACTS
4. skapa permanent CLAIMS_EVIDENCE
5. revidera OFFERTFLODE
6. därefter innehåll/design/implementation

## Definition av att vänteläget är utnyttjat

När Peter/Jimmy svarar bör vi redan ha:

- en klar UX-referens för wizard
- en reduceringsmodell för frågorna
- en claimlista att verifiera
- en URL-lista att skydda
- en mediainventering att märka upp
- innehållsmallar utan påhittad copy

Då kan kundsvaren direkt omsättas till produktbeslut istället för att starta ny research.
