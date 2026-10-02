# Prompt till Astra — Homepage v0.2 visual refinement 2

Arbeta endast på befintliga noindex-routen:

`/prototype/start-v02/`

Gör ingen commit och ingen push.

## Läs först

Läs:

1. `.codex/skills/hallpartner-web-art-direction/SKILL.md`
2. `docs/research/FIGMA_ASTRO_IMPLEMENTATION_BRIEF.md`
3. `docs/research/HOMEPAGE_PROTOTYPE_V0.2.md`

Utgå dessutom från den befintliga implementationen du just byggt och de senaste visuella besluten nedan.

## Huvudkorrigering: sidan är för bred genomgående

Nuvarande version använder bredden bättre än första foundationen, men texttunga delar är fortfarande för utdragna.

Full-width ska vara ett **selektivt visuellt grepp**, inte standard för hela sidan.

### Inför tre layoutlägen

1. **full-bleed**
   - hero/projektbilder
   - valda visuella band
   - montage där fysisk skala är poängen

2. **wide content rail**
   - riktvärde ca 1180–1240 px vid 1440 px viewport
   - navigation
   - behovslistan
   - ansvar
   - projektdata
   - kontaktinformation

3. **reading width**
   - ingress
   - längre förklarande copy
   - textstycken där läsbarhet är viktigare än bredd

Undvik både:
- smal universell wrapper
- 100% viewport-bredd på varje sektion

Whitespace ska gruppera innehåll. Om relaterade element hamnar för långt ifrån varandra, dra in sektionen i stället för att fylla tomrummet med dekoration.

## Behåll

Behåll i stort:

- hero-kompositionen med stor verklig hallbild
- behovslistan som rader, inte cards
- den stora stålstomme-/projektdelen
- faktapanelen som bryter projektbildens grid
- ritningen/montagebilderna
- ansvarskonceptet HALLPARTNER / TILLVAL / ANNAN PART
- den ljusa, lugna grafiska riktningen
- inga dekorativa sektionsnummer

## Förbättra

### Header
- öka läsbarheten något
- något större ordmärke/navigation
- ge headern lite mer vertikal närvaro
- håll headerinnehållet på en wide rail, inte hela viewporten

### Hero
- behåll stor bild
- dra in vänster textkolumn till ett mer avsiktligt content rail
- vanlig brödtext får inte bli mikroskopisk
- projektdata ska kännas integrerad med bilden, inte som lös overlay-text
- ändra inte målgruppscopyn ännu; den väntar på Peter/Jimmy

### Behovssektion
- centrera sektionen på wide rail
- minska avståndet mellan hallnamn och beskrivning
- stärk typografin i raderna
- inga cards
- inga dekorativa nummer

### Projektsektion
- får fortsatt vara bred/full-bleed
- behåll stor fysisk skala
- gör montagebild + ritning mer avsiktligt sammanhörande, som stödmaterial till projektet snarare än lösa galleribilder
- använd captions/labels som förklarar relationen

### Ansvar
- dra in till wide rail
- öka läsbarheten
- behåll tre delar
- fyll inte tomrum med ikoner eller cards
- informationen är fortfarande placeholder tills kundsvar kommer

### Kontakt / Peter & Jimmy
- gör sektionen mer mänsklig och viktig
- större porträtt
- dra in allt till en sammanhållen wide rail
- låt text, CTA och personerna kännas som samma komposition
- roller/kontaktuppgifter får fortfarande vara placeholder om ej verifierade

### Copy
Ändra inte strategisk målgruppscopy nu.

Följande är pending customer verification:
- B2B vs B2C-balans
- “verksamheter som växer”
- prioriterade halltyper
- ansvar
- referensfakta

## Viktig designprincip

Sidan ska växla mellan:

- koncentrerad information
- lugnt whitespace
- stark bildskala

Inte mellan:
- full viewport
- full viewport
- full viewport
- full viewport

## Kontroll

Efter ändring:

- npm run check
- npm run lint
- npm run build
- rendera 1440 px desktop och 390 px mobile
- kontrollera även 1920 px så innehåll inte flyter isär
- kontrollera 1024/768 för mellanlägen

Gör en visuell self-review:

- känns textgrupper sammanhållna?
- används full-width bara där det ger effekt?
- känns sidan lättare att skanna?
- är headern läsbar?
- känns Peter/Jimmy integrerade i designen?
- känns montage/ritning som en berättelse snarare än lösa bilder?
- finns fortfarande generiska AI-layoutmönster?

Stanna efter implementation och rapportera:
1. vilka breddsystem du införde
2. vilka sektioner som är full-bleed respektive constrained
3. vilka visuella ändringar som gjordes
4. testresultat
5. kvarstående designproblem

Ingen commit och ingen push.
