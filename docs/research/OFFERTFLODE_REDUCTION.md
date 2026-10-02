# OFFERTFLODE.md – reduceringsanalys

> **Status:** Arbetsanalys. Ersätter inte `docs/OFFERTFLODE.md`.

## Huvudslutsats

`OFFERTFLODE.md` är en bra inventering av möjliga frågor och framtida funktioner, men de tio stegen bör **inte** betraktas som låst första kundflöde ännu.

Dokumentet innehåller samtidigt:

- grundläggande leadinformation
- offertunderlag
- tekniska produktval
- projekteringsuppgifter
- framtida tillval
- intern information

Det riskerar att göra kunden till konstruktör innan första kontakt.

## Arbetsmodell

### A – sannolikt relevant före första kontakt

Ska ge Hallpartner tillräckligt underlag för att förstå leadet och ta ett bra nästa samtal.

Preliminära kandidater:

- vad byggnaden ska användas till
- projektets mognadsgrad
- ungefärlig storlek eller **behöver hjälp**
- ungefärlig byggort/plats
- ungefärlig tidsram
- vad kunden vill ha hjälp med
- kontaktuppgifter
- frivillig fritext
- eventuellt frivilligt underlag/fil senare

Alla kandidater måste fortfarande stämmas av mot Peter/Jimmys faktiska säljprocess.

### B – frivillig fördjupning om kunden redan vet

Kan vara användbart men får inte blockera inskick.

Exempel:

- preliminära mått
- befintlig ritning
- ungefärligt antal portar
- känd grundstatus
- särskilda behov
- bygglovsstatus

### C – kompletteras senare av sälj/projektledning

Bör som huvudregel inte krävas i första offertstarten:

- exakt grundtyp/fundament
- markarbete i detalj
- paneltjocklek
- RAL-kod
- exakt takvinkel
- detaljerad portplacering
- exakta dörr-/fönstermått
- ventilationstyp
- värmesystem
- brandklass
- säkerhetsklass
- särskilda laster
- traversförberedelse
- detaljerad åtkomst för montageutrustning
- tekniska konstruktionsunderlag

## Granskning av de tio nuvarande stegen

### 1. Halltyp

**Behöver omarbetas.**

Nuvarande alternativ blandar:

- användning: Lagerhall, Ridhus
- konstruktion: Tälthall
- egenskap: Isolerad hall

Användning och tekniskt utförande bör sannolikt separeras.

### 2. Storlek & byggplats

**Delvis starkt.**

Behåll principen:

- kunden får ange hur säker den är på måtten
- `Jag behöver hjälp` är legitimt
- area härleds, frågas inte

Exakt adress och fastighetsbeteckning bör sannolikt flyttas senare om de inte behövs för första kvalificering.

### 3. Grund & mark

**Troligen för tidigt i nuvarande omfattning.**

Grundstatus kan vara relevant. Grundtyp, grundritning, grävning, återfyllning och marktyp behöver motiveras separat.

### 4. Väggar & tak

**Huvudsakligen senare/fördjupning.**

Materialval kan vara relevanta om kunden redan har preferenser. Paneltjocklek, färg och takvinkel bör normalt inte vara krav före första kontakt.

### 5. Portar, dörrar & öppningar

**Viktig produktdata men för detaljerad som standard.**

Fråga hellre om behov och ungefärligt antal tidigt. Repeater med exakta mått/placering kan bli frivillig för avancerade kunder eller tas senare.

### 6. Installationer & tillval

**Måste verifieras mot verkligt erbjudande.**

Inga installationsalternativ får finnas innan Hallpartner bekräftat vad de faktiskt levererar, samordnar respektive endast förbereder för.

### 7. Leveransomfattning & tidsplan

**Affärsmässigt viktigt, men nuvarande alternativ är obekräftade.**

Tidsplan/projektstatus är sannolikt högvärdesfrågor. Leveransomfattning kan bara frågas när Hallpartners egna leveransnivåer är verifierade.

### 8. Ritningar & underlag

**Bra som frivilligt stöd.**

Filer får inte bli krav för att lämna lead. Säker filhantering beslutas senare.

### 9. Kund & kontakt

**Behövs. Förenkla efter verklig målgrupp.**

Företagsnamn, kontaktperson, telefon och e-post är rimlig bas för B2B. Kundroll/slutkundsstruktur behöver motiveras av säljarbetet innan den blir obligatorisk.

### 10. Kontroll & skicka

**Behåll som central UX-princip.**

Sammanfattning + **Ändra** är beslutat mönster från Stadsbud-referensen.

## Frågor som blockerar reduceringen

Peter/Jimmy behöver bland annat svara på:

- vilka projekt de faktiskt vill ha
- vad en normal leverans innehåller
- vad som är tillval
- vad kunden/annan entreprenör normalt ansvarar för
- vad Hallpartner måste veta före första samtalet
- vad som krävs först när riktig offert räknas
- vilka installationer/tillval som faktiskt finns
- om grundfrågorna påverkar leadkvalificeringen eller främst projekteringen
- vilka kundtyper/roller som faktiskt förekommer

## Mål efter kundsvar

Skapa en ny v0.3-specifikation där varje fråga märks:

- `before_first_contact`
- `optional_detail`
- `sales_followup`
- `technical_later`
- `internal`

Därefter beslutas de visuella stegen.
