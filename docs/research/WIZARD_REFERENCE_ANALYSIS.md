# Offertwizard – arkitekturanalys

> **Status:** Arbetsunderlag. Inga Hallpartner-frågor låses här.

## Beslutad utgångspunkt

Carlstad Stadsbuds offertguide är referens för Hallpartners framtida:

- wizardstruktur
- progressindikator
- stegvis navigation
- choice cards för betydelsefulla huvudval
- responsivt beteende
- validerings- och fokusmönster
- sammanfattning med **Ändra**
- hantering av backendfel tillbaka till rätt steg/fält

**Amelio Quote Engine ska inte användas som motor, kodbas eller teknisk arkitektur för Astro-projektet.**

Det äldre Hallpartner-arbetet får endast användas som historik över tidigare frågor, edge cases och villkor som redan diskuterats.

## Vad Stadsbud-implementationen faktiskt gör bra

### 1. Inaktiva paneler är verkligen inaktiva

När ett huvudval ändras:

- fel paneler döljs
- deras inputs blir `disabled`
- sammanfattningen läser endast kontroller som inte är disabled
- irrelevanta värden kan därför inte råka följa med i payloaden

Detta beteende bör Hallpartner behålla.

### 2. Steg och affärsdata är separata

Stadsbud har fem visuella steg men bygger en strukturerad payload med separata områden för tjänst, uppdrag, tillägg och kund.

Hallpartner bör göra samma principiella separation: visuella steg ska kunna ändras utan att datamodellen behöver döpas om till `step1`, `step2` osv.

### 3. Sammanfattningen är datadriven

Kontroller märks med sammanfattningssektion och etikett. Endast aktiva och ifyllda värden renderas.

För Hallpartner bör summary-lagret vara generiskt nog att stödja fler/färre områden än Stadsbuds fem steg.

### 4. Serverfel mappas tillbaka till formuläret

Stadsbud:

- tar emot fältspecifika 422-fel
- översätter API-path till rätt kontroll
- går tillbaka till tidigaste felaktiga steg
- visar fel vid fältet
- sätter `aria-invalid`
- flyttar fokus

Detta är ett starkt mönster att återanvända.

### 5. Fokus och navigation är genomtänkta

Vid stegbyte:

- aktivt steg uppdateras
- `aria-current="step"` sätts
- rubriken får fokus
- wizardområdet scrollas till rätt plats
- mobil progress uppdateras separat

### 6. Choice cards används för stora beslut

Bra princip för Hallpartner:

> Choice cards för konceptuella beslut. Vanliga inputs för fakta.

Använd inte stora kort för små ja/nej-frågor eller enkla faktafält.

## Vad som ska anpassas för Hallpartner

- antal steg
- stegnamn
- fält och villkor
- payload/datamodell
- hjälptexter
- valideringsregler
- Hallpartners framtida grafiska designsystem
- backend
- integritetstext
- anti-spam
- filuppladdning

## Vad som INTE ska kopieras

- Stadsbuds tjänster och frågor
- Stadsbuds API-payload
- `/api/offert.php`
- företagsinnehåll
- exakta färger
- exakta mått/breakpoints som hårda krav

Mått som 62rem/54rem och Stadsbuds brytpunkter är referensvärden, inte Hallpartner-krav.

## Grafisk design

Den gamla designen på hallpartner.amelio.se och nuvarande visions-designsystem är **inte beslutad produktionsdesign**.

När Hallpartner och Amelio fastställt den nya grafiska profilen ska wizardens komponenter använda det produktionsdesignsystemets semantiska tokens.

## Rekommenderad framtida komponentmodell

- `WizardShell`
- `WizardProgress`
- `WizardStep`
- `ChoiceCard`
- `OptionControl`
- `FormField`
- `SummaryCard`
- `WizardNavigation`

Affärsfrågor, options, villkor och valideringsregler ska ligga separat från presentationskomponenterna.

## Viktig produktregel

Ingen fråga ska läggas i första kundflödet bara för att Hallpartner *kan* ha nytta av uppgiften.

För varje fråga ska vi kunna svara:

1. Varför behövs denna uppgift?
2. Behövs den före första kontakt?
3. Kan säljaren ta den senare?
4. Är kunden rimligen rätt person att besvara den?
