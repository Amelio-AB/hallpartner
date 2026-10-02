# Hall page prototype v0.1 — design brief

> **Status:** Design- och implementationsunderlag. Inga verksamhetsclaims i detta dokument är verifierade om de inte uttryckligen markeras som sådana.

## Syfte

Testa om Hallpartners nya visuella språk fungerar på en hallsida utan att sidan blir en kopia av startsidan.

Första exempeltypen är **lagerhall**, eftersom den finns i nuvarande sajt och i befintligt bildmaterial.

Detta är fortfarande en prototype. Den ska inte ersätta `/stalhallar/lagerhall/` ännu.

## Huvuduppgift för sidan

Startsidan ska orientera.

Hallsidan ska hjälpa en besökare att förstå:

- om lösningen är relevant
- vilka val som påverkar utförandet
- vilken information som är viktig tidigt
- vad som påverkar omfattning/kostnad
- vem som ansvarar för vad
- hur ett verkligt projekt kan se ut
- hur kunden tar nästa steg

## Designprincip

Sidan ska dela **visuellt DNA** med startsidan men inte dess exakta sekvens.

Undvik:

- startsidans hero kopierad rakt av
- samma behovslista igen
- samma projektsektion i samma placering
- samma kontaktavslutning i samma komposition
- generisk “produktfeatures i tre kort”

## Föreslagen kompositionsidé

### 1. Produktintro / hero

Mer produktorienterad än startsidan.

Möjlig struktur:

- H1: Lagerhall
- kort ingress, tydligt markerad demo tills copy verifierats
- stor verklig hallbild
- liten teknisk faktarad eller ritningsdetalj som stöd, inte dekor
- CTA: offertstart
- sekundär CTA: prata med Hallpartner

Hero behöver inte ha samma 50/50-split som startsidan.

### 2. När passar en lagerhall?

Inte cards.

Arbeta hellre med:

- större typografi
- två kolumner
- index/lista
- tydliga användningsfall och avgränsningar

All copy är placeholder tills Peter/Jimmy verifierat målgrupper/användning.

### 3. Utförande och val

Här ska sidan bli mer teknisk.

Visuellt kan den använda:

- ritning
- materialdetaljer
- bildutsnitt
- små tekniska labels
- jämförelse mellan alternativ

Möjliga informationsområden:

- isolerad / oisolerad
- klimatskal
- portar
- höjd / spann
- andra relevanta val

Men inga alternativ får presenteras som Hallpartners faktiska sortiment innan de verifierats.

### 4. Vad påverkar projektets omfattning?

Förklara drivare utan prisprecision.

Exempel på kategorier att testa visuellt:

- storlek/geometri
- utförande
- byggplats
- portar/öppningar
- installationer/tillval

Dessa är designkategorier i prototypen, inte verifierade kommersiella regler.

### 5. Ansvar / leveransomfattning

Återanvänd informationsprincipen från startsidan men inte nödvändigtvis samma visuella komponent.

Behåll kärnan:

- Hallpartner
- Tillval
- Kund/annan part

Innehållet är placeholder tills kundsvar finns.

### 6. Projektbevis

Använd verkligt bildmaterial som prototypmaterial.

För hallsidan kan projektbeviset vara kompaktare än startsidans stora signatursektion.

Visa gärna:

- färdig hall
- stomme/montage
- teknisk detalj

Ingen bild får beskrivas som verifierad Hallpartner-referens om det inte är styrkt.

### 7. Offertstart

Avslutningen ska känna sig relevant för produktsidan.

Budskapet bör stödja att kunden inte behöver kunna alla tekniska detaljer från början.

Slutlig copy väntar på Peter/Jimmy.

## Layout width system

Använd Hallpartner-skillens tre lägen:

- full-bleed
- wide rail
- reading width

Full-width ska vara selektivt.

En hallsida bör sannolikt ha mer koncentrerad teknisk information än startsidan.

## Visuell signatur

För denna sidtyp bör det minnesvärda greppet vara **produktens konstruktion/utförande**.

Prioritera därför:

- ritning
- materialdetalj
- stomme
- mått/teknisk annotation
- verklig hall

framför generiska dekorativa element.

## Bildmaterial att prova

Befintliga assets kan användas i prototype:

- `src/assets/images/lagerhall.jpg`
- `src/assets/images/legacy/Isolerad-lagerbyggnad-med-Sandwich-1-1152x1536.jpg`
- `src/assets/images/legacy/lagerhall-med-enkelplat.jpg`
- `src/assets/images/legacy/lagerhall-fonster-1536x1178.jpeg`
- `src/assets/images/legacy/lagerlokal-stalstomme-1536x1152.jpg`
- `src/assets/images/legacy/Stalstomme-1-1536x1152.jpg`
- `src/assets/images/legacy/Stalstomme-2-1536x1152.jpg`
- `src/assets/images/legacy/maskinhall-ritning.webp`

Bildval ska göras för layoutbedömning, inte för att bevisa projektassociation.

## Copy-status

Följande ska betraktas som öppet:

- B2B/B2C-balans
- användningsfall
- standardleverans
- tillval
- tekniska alternativ
- kostnadsdrivare
- projekttider
- garantier
- montage
- geografisk leverans
- referensprojekt

## Design review

Fråga efter första designpass:

- känns detta som en hallsida, inte en landningssida?
- är teknisk information begriplig utan att bli katalog?
- finns en tydlig egen komposition?
- används verkligt material aktivt?
- känns sidan släkt med startsidan utan att vara en kopia?
- finns dekorativa AI-mönster?
