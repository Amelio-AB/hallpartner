# Hallpartner – komplett specifikation för dynamiskt offertflöde

> **Status:** Arbetsunderlag / source of truth för framtida implementation i nya Astro-baserade hallpartner.se.  
> **Syfte:** Samla Hallpartners beslutade offertflöde, frågor, villkor, datamodell och UX-principer i ett dokument.  
> **Viktigt:** Dokumentet beskriver affärsflödet. Exakt UI-copy kan finslipas innan implementation. Där tidigare beslut bara anger ett fält eller ett begrepp och inte en exakt frågetext markeras detta som arbetsformulering.

---

## 1. Bakgrund och mål

Hallpartner ska ha ett dynamiskt offertflöde där kunden endast får frågor som är relevanta för det aktuella projektet.

Flödet ska:

- fungera bra på mobil och desktop
- vara enkelt för en icke-teknisk kund att använda
- undvika att visa alla tekniska frågor samtidigt
- låta tidigare svar styra senare frågor
- låta kunden välja **”Hallpartner rekommenderar”** eller **”Vet inte”** där tekniska beslut annars skulle skapa onödig friktion
- samla tillräcklig information för att Hallpartner ska kunna bedöma projektet och lämna offert
- kunna utvecklas vidare utan att datamodellen låses till exakt antal visuella steg

Mycket trafik förväntas komma från annonser på Facebook. Mobilupplevelsen är därför ett releasekrav, inte en sekundär förbättring.

---

# 2. Övergripande flöde

Den beslutade huvudstrukturen består av tio steg:

1. Halltyp
2. Storlek & byggplats
3. Grund & mark
4. Väggar & tak
5. Portar, dörrar & öppningar
6. Installationer & tillval
7. Leveransomfattning & tidsplan
8. Ritningar & underlag
9. Kund & kontakt
10. Kontroll & skicka

Grundprincip:

> Tidigare val styr senare steg. Kunden ska inte behöva svara på frågor som inte är relevanta för projektet.

---

# 3. Klassificering av fält

Alla frågor bör klassificeras enligt följande:

## Grund

Frågor som de flesta kunder behöver svara på.

## Villkorad

Visas endast när tidigare svar gör frågan relevant.

## Avancerad

Tekniska frågor som normalt ska döljas bakom exempelvis:

**Visa fler tekniska val**

## Automatisk

Värden som systemet räknar fram eller härleder, exempelvis hallarea.

## Intern

Värden som Hallpartner använder internt men som kunden normalt inte ska behöva se eller förstå.

---

# 4. Steg 1 – Halltyp

## Syfte

Förstå vilken typ av hall kunden söker och använda valet för att styra senare alternativ.

## Beslutad fråga

**Vilken typ av hall är du intresserad av?**

## Alternativ

- Lagerhall
- Ridhus
- Tälthall
- Isolerad hall

## Datamodell

Exempel:

```text
project.hall_type
```

## Viktig modellrisk

Alternativen beskriver inte samma typ av egenskap:

- Lagerhall och Ridhus beskriver främst användning.
- Tälthall beskriver konstruktion.
- Isolerad hall beskriver en egenskap hos klimatskalet.

Därför får datamodellen inte låsa isolering permanent till halltypen.

Ett separat framtida fält ska kunna finnas:

```text
insulation_level
- none
- partial
- insulated
- unknown
```

### Öppet beslut

Hallpartner behöver slutligt bekräfta om de fyra valen faktiskt är separata produktfamiljer eller om användning och konstruktion bör delas upp i separata frågor.

---

# 5. Steg 2 – Storlek & byggplats

## 5.1 Måttsäkerhet

### Beslutad princip

Kunden ska först ange hur säkra måtten är.

### Arbetsformulering

**Vet du ungefär vilka mått hallen ska ha?**

### Datanyckel

```text
dimensions.confidence
```

### Alternativ

- Exakta mått
- Ungefärliga mått
- Jag behöver hjälp

Interna värden:

```text
exact
approximate
need_help
```

### Regel

Om kunden väljer **Jag behöver hjälp** får exakta mått vara frivilliga.

---

## 5.2 Grundmått

Fält:

- Bredd
- Längd
- Sidohöjd

Datanycklar:

```text
dimensions.width
dimensions.length
dimensions.side_height
```

### Automatisk area

```text
dimensions.area_m2 = width × length
```

Arean ska beräknas automatiskt när bredd och längd finns.

---

## 5.3 Ungefärlig geografisk plats

Fält:

- Postnummer
- Ort

Datanycklar:

```text
site.postal_code
site.city
```

### Regel

Postnummer och ort kan finnas även om exakt byggplats inte är bestämd.

Det är rimligt att kunden vet ungefär var hallen ska byggas utan att känna exakt adress eller fastighetsbeteckning.

---

## 5.4 Exakt byggplats

### Beslutad fråga

**Är byggplatsen bestämd?**

Datanyckel:

```text
site.decided
```

Alternativ:

- Ja
- Nej

### Om Ja

Visa:

- Adress
- Fastighetsbeteckning – frivillig

Datanycklar:

```text
site.address
site.property_designation
```

### Viktig UX-förbättring inför slutlig implementation

Frågan **”Är byggplatsen bestämd?”** blandar i praktiken två nivåer:

1. Vet kunden ungefär var projektet ska ligga?
2. Är den exakta fastigheten/adressen bestämd?

En framtida formulering kan därför delas upp i två frågor, exempelvis:

- Vet du ungefär var hallen ska byggas?
- Är den exakta byggplatsen bestämd?

Detta är en UX-förbättring och ska beslutas innan slutlig copy låses.

---

## 5.5 Avancerade uppgifter

Följande ska inte ligga i normalflödet från början:

- Fri invändig höjd
- Höjd över havet
- Specialmått

De kan senare ligga bakom **Visa fler tekniska val**.

Takvinkel hör inte hemma i detta steg utan i **Steg 4 – Väggar & tak**.

---

# 6. Steg 3 – Grund & mark

## 6.1 Grundstatus

### Rekommenderad frågeformulering

Tidigare testcopy **”Finns det en grund?”** blev språkligt för snäv eftersom ett svar kan vara ”Planerad grund”.

Bättre arbetsformulering:

**Hur ser det ut med grunden idag?**

Datanyckel:

```text
foundation.status
```

Alternativ:

- Det finns redan en grund
- Grunden är planerad
- Ingen grund är planerad ännu
- Vet inte

Interna värden:

```text
existing
planned
none
unknown
```

---

## 6.2 Om befintlig grund

Visa fråga om grundtyp.

### Arbetsformulering

**Vilken typ av grund finns?**

Datanyckel:

```text
foundation.type
```

Alternativ:

- Betongplatta
- Plint/fundament
- Annat
- Vet inte

Visa även:

**Finns det en grundritning?**

Datanyckel:

```text
foundation.drawing_available
```

Alternativ:

- Ja
- Nej
- Vet inte

---

## 6.3 Om grunden är planerad

### Fråga/område

Vem ansvarar för grundlösningen?

Datanyckel:

```text
foundation.responsibility
```

Alternativ:

- Kunden eller annan entreprenör
- Hallpartner
- Inte bestämt ännu

Interna värden:

```text
customer_or_other
hallpartner
undecided
```

---

## 6.4 Om ingen grund är planerad

### Fråga/område

Behöver kunden hjälp med grunden?

Datanyckel:

```text
foundation.help_needed
```

Alternativ:

- Ja
- Nej
- Diskutera med Hallpartner

Interna värden:

```text
yes
no
discuss
```

---

## 6.5 Fundament

Framtida val:

- Hallpartner rekommenderar
- Plintfundament
- Jordskruv
- Annan lösning

Detta behöver inte vara en obligatorisk kundfråga i första kompletta versionen om Hallpartner hellre rekommenderar lösning efter projektbedömning.

---

## 6.6 Markarbete

Frågor/områden:

### Grävning

- Ja
- Nej
- Vet inte

### Återfyllning

- Ja
- Nej
- Vet inte

Teknisk placering i flödet behöver slutligt bestämmas för att undvika dubbel frågor senare under leveransomfattning/tillägg.

---

## 6.7 Marktyp

### Arbetsformulering

**Vilken typ av mark finns på byggplatsen?**

Alternativ:

- Hårdgjord yta
- Grus
- Jord/åker
- Berg
- Befintlig byggnad
- Vet inte
- Annat

Datanyckel, rekommenderad domän:

```text
site.ground_type
```

Tidigare prototyp placerade marktyp under foundation, men marktypen beskriver byggplatsen snarare än själva grunden.

### Regel

Marktyp ska inte rensas bara för att kunden ändrar grundstatus. Exempelvis kan **Jord/åker** fortfarande vara sant oavsett om grunden är befintlig eller planerad.

---

# 7. Steg 4 – Väggar & tak

Halltypen ska styra vilka material och alternativ som visas.

Alla alternativ ska inte visas för alla halltyper.

---

## 7.1 Väggmaterial

Alternativ från tidigare Hallpartner-underlag/prototyp:

- Stålplåt
- Sandwichpanel
- PVC-duk
- Träbeklädnad

### Villkor

Vilka alternativ som visas ska bero på halltyp.

---

## 7.2 Sandwichpanel

Om kunden väljer sandwichpanel:

- Hallpartner rekommenderar tjocklek
- Kunden väljer själv

Tekniska paneltjocklekar ska inte visas direkt för normal kund om det inte finns ett tydligt behov.

De kan ligga bakom ett avancerat val.

---

## 7.3 Väggfärg

Alternativ:

- Vit
- Svart
- Grå
- Röd
- Annan RAL
- Hallpartner rekommenderar

Om **Annan RAL** väljs ska ett kompletterande fält visas för RAL-kod/färgönskemål.

---

## 7.4 Takmaterial

Alternativ:

- Takplåt
- Sandwichpanel
- PVC-duk
- Hallpartner rekommenderar

Halltypen styr vilka alternativ som är relevanta.

---

## 7.5 Takfärg

Samma princip som väggfärg:

- Vit
- Svart
- Grå
- Röd
- Annan RAL
- Hallpartner rekommenderar

---

## 7.6 Takvinkel

Alternativ:

- Hallpartner rekommenderar
- 11°
- 18°
- 22°
- 28°
- 38°
- Annan

### Viktig regel

Ingen teknisk takvinkel ska vara förvald för kunden.

Om **Annan** väljs ska ett kompletterande värde kunna anges.

---

# 8. Steg 5 – Portar, dörrar & öppningar

## 8.1 Portar

Varje port ska vara ett separat objekt.

Fel modell:

```text
antal portar + ett gemensamt mått
```

Rätt princip:

```text
ports[]
  type
  width
  height
  location
  notes
```

Funktioner:

- Lägg till port
- Duplicera port
- Ta bort port

---

## 8.2 Porttyp

Preliminära alternativ:

- Skjutport
- Takskjutport
- Vikport
- Annan
- Hallpartner rekommenderar

### Öppet beslut

Hallpartner behöver bekräfta det verkliga sortimentet innan alternativen betraktas som produktionsklara.

---

## 8.3 Portmått

För varje port:

- Bredd
- Höjd

Eventuellt:

- Placering
- Kommentar

---

## 8.4 Fordon och maskiner

Fråga:

**Ska större fordon eller maskiner passera?**

Alternativ/exempel:

- Lastbil
- Lastmaskin
- Traktor
- Entreprenadmaskin
- Hästtransport
- Annat

Systemet kan senare varna om angivna portmått verkar för små.

Det ska vara en varning/rekommendation, inte ett hårt tekniskt block, eftersom kundens uppgifter inte är konstruktionsmässigt verifierade.

---

## 8.5 Dörrar

Frågor/områden:

- Antal dörrar
- Standardmått som förstahandsval
- Specialmått vid behov

Detaljnivån behöver slutligt fastställas med Hallpartner.

---

## 8.6 Fönster

Fråga/område:

Finns behov av fönster?

Alternativ:

- Ja
- Nej
- Vet inte

Om Ja:

- Antal

Avancerade mått och placering ska normalt döljas.

---

## 8.7 Ljusband

Alternativ:

- Ja
- Nej
- Vet inte
- Hallpartner rekommenderar

---

# 9. Steg 6 – Installationer & tillval

## 9.1 Övergripande installationer

Möjliga val:

- Belysning
- El
- Ventilation
- Värme
- Solceller
- Inget
- Vet inte

Flera val kan behöva tillåtas.

---

## 9.2 Belysning

Alternativ/önskemål:

- LED
- Arbetsbelysning
- Hallpartner rekommenderar

---

## 9.3 Värme

Alternativ:

- Uppvärmd hall
- Frostfritt
- Hallpartner rekommenderar

---

## 9.4 Ventilation

Alternativ:

- Enkel
- Mekanisk
- Hallpartner rekommenderar

---

## 9.5 Solceller

Alternativ:

- Hallpartner levererar
- Bara förbereda tak
- Diskutera

---

## 9.6 Takrelaterade tillval

Möjliga tillval:

- Takavvattning
- Ljusband
- Antikondens
- Solcellsförberedelse

Undvik att fråga om samma sak två gånger om ett val redan gjorts tidigare.

---

## 9.7 Invändiga lösningar

Möjliga val:

- Innerväggar
- Avskiljningar
- Förråd
- Teknikrum
- Annat

---

## 9.8 Extra arbeten

Möjliga val:

- Markarbete
- Grundarbete
- Rivning
- Anslutning till befintlig byggnad
- Transport
- Montage
- Annat

### Viktig regel

Fråga inte om sådant kunden redan svarat på i tidigare steg.

Exempel: om grundarbete redan definierats i steg 3 ska steg 6/7 återanvända det svaret eller endast fråga om leveransomfattning, inte upprepa tekniska grundfrågor.

---

## 9.9 Avancerade tekniska krav

Ska normalt vara dolda:

- Brandklass
- Säkerhetsklass
- Särskilda laster
- Traversförberedelse
- Installationskrav

De kan visas bakom **Visa fler tekniska val** eller hanteras vid senare komplettering.

---

# 10. Steg 7 – Leveransomfattning & tidsplan

## 10.1 Leveransomfattning

Databegrepp:

```text
delivery_scope
```

Alternativ:

- Endast hallmaterial
- Hallmaterial + montage
- Hallmaterial + montage + grundarbete
- Så komplett leverans som möjligt
- Hallpartner rekommenderar

---

## 10.2 Montage

Alternativ:

- Ja
- Nej
- Pris både med och utan
- Vet inte

---

## 10.3 Kundens egna åtaganden

Flera val möjliga:

- Markarbete
- Grund
- El
- Ventilation
- Värme
- Montage
- Transport
- Bygglov/projektering
- Annat

---

## 10.4 Tidsplan

Alternativ:

- ASAP
- Inom 3 månader
- 3–6 månader
- 6–12 månader
- Mer än 12 månader
- Vet inte

Frivilligt:

- Önskat färdigdatum

---

## 10.5 Projektstatus

Flera val möjliga:

- Undersöker alternativ
- Mått finns
- Ritningar finns
- Byggplats bestämd
- Projektering pågår
- Bygglov pågår
- Bygglov klart
- Redo att beställa

---

## 10.6 Bygglov

Alternativ:

- Inte undersökt
- Behövs sannolikt
- Ansökan pågår
- Beviljat
- Behövs inte
- Vet inte

### Viktig regel

Systemet ska inte juridiskt avgöra om bygglov krävs.

Det ska registrera kundens status/uppfattning och vid behov hänvisa till dialog med kommun eller sakkunnig.

---

## 10.7 Åtkomst till byggplats

Alternativ:

- God
- Begränsad
- Vet inte

Avancerade/internt relevanta följdfrågor kan senare handla om montageutrustning eller maskiner.

---

# 11. Steg 8 – Ritningar & underlag

## 11.1 Finns underlag?

Alternativ:

- Ja
- Lite
- Nej
- Inte ännu

### Viktig regel

Uppladdning ska inte vara obligatorisk för att kunden ska kunna skicka en förfrågan.

---

## 11.2 Dokumentkategorier

Möjliga kategorier:

- Planritning
- Fasad
- Sektion
- Situationsplan
- Grundritning
- Konstruktionsritning
- Skiss
- Byggplatsbilder
- Befintlig byggnad
- Bygglovshandlingar
- Annat

Filer ska höra till själva projektet/förfrågan.

---

## 11.3 Dynamiska uppladdningstips

Exempel:

- Befintlig grund → be gärna om grundritning
- Anslutning till befintlig byggnad → be om bilder/ritningar
- Bygglov klart → be om bygglovshandlingar

Detta ska vara hjälptext/rekommendation, inte hårda krav.

---

## 11.4 Avancerade underlag

Framtida kategorier:

- Geoteknik
- Brandskydd
- Lastförutsättningar
- Konstruktionsberäkningar
- Installationsunderlag

---

## 11.5 Filhantering

Byggnadsritningar och kundunderlag ska inte slentrianmässigt läggas publikt.

I Astro-implementationen behöver en separat säker filstrategi väljas innan filuppladdning aktiveras i produktion.

Krav att besluta:

- privat lagring
- åtkomstkontroll
- filstorlek
- tillåtna filtyper
- virus/malware-kontroll
- gallring
- koppling mellan fil och request_id

---

# 12. Steg 9 – Kund & kontakt

## 12.1 Kundroll

Databegrepp:

```text
customer_role
```

Alternativ:

- Slutkund
- Entreprenör
- Konsult/projektör
- Återförsäljare
- Annat

---

## 12.2 Kontaktuppgifter

Fält:

- Företagsnamn
- Organisationsnummer – frivilligt
- Kontaktperson
- Telefon
- E-post
- Befattning – frivilligt

---

## 12.3 Kontaktpreferens

Alternativ:

- Telefon
- E-post
- Digitalt möte
- Fysiskt möte
- Spelar ingen roll

---

## 12.4 Är kontaktpersonen slutkund?

Databegrepp:

```text
is_end_customer
```

Om Nej, visa:

- Slutkundsföretag
- Kontaktperson
- Ort
- Kommentar

Frivilligt:

- Beslutsfattare

---

# 13. Steg 10 – Kontroll & skicka

## 13.1 Sammanfattning

Kunden ska se en sammanfattning uppdelad per sektion.

Exempel:

- Halltyp
- Storlek & byggplats
- Grund & mark
- Väggar & tak
- Portar, dörrar & öppningar
- Installationer & tillval
- Leveransomfattning & tidsplan
- Ritningar & underlag
- Kund & kontakt

Visa endast fält som faktiskt innehåller relevant data.

---

## 13.2 Ändra

Varje sektion ska ha:

**Ändra**

Klick ska ta kunden tillbaka till rätt del av flödet utan att övriga svar försvinner.

---

## 13.3 Osäkra svar

Sammanfattningen ska tydligt kunna visa markörer som:

- cirka
- Hallpartner rekommenderar
- behöver kompletteras

Detta hjälper både kunden och Hallpartner att förstå vad som är ett fast krav och vad som fortfarande är öppet.

---

## 13.4 Skicka

Slutlig knapp:

**Skicka offertförfrågan**

Efter lyckad skickning ska kunden få:

- bekräftelse
- unikt request_id

Exempel:

```text
HP-2026-00142
```

---

# 14. Efter skickad förfrågan

## Kundversion

Kunden ska få en kort och lättläst sammanfattning.

Den ska inte överlastas med interna tekniska fält.

## Intern Hallpartner-version

Hallpartner ska kunna se:

- alla tekniska värden
- saknade uppgifter
- osäkerheter
- uppladdade filer
- status
- request_id

Senare kan systemet generera en intern kompletteringslista, exempelvis:

- takvinkel saknas
- grundtyp behöver bestämmas
- porttyp saknas

---

# 15. Teknisk status på kundens uppgifter

Kundens inskickade svar ska betraktas som:

```text
kundförfrågan
→ preliminärt tekniskt underlag
→ Hallpartner granskar
→ godkänd teknisk specifikation
```

Kundens svar får inte automatiskt presenteras som konstruktionsmässigt verifierade.

Det gäller särskilt:

- mått
- laster
- takvinkel
- grundlösning
- portdimensionering
- brandkrav
- bygglov

---

# 16. Datamodell

Frontendens visuella steg ska inte vara datamodellen.

Undvik:

```text
step1
step2
step3
...
```

Backend/state ska i stället tänka i domäner, exempelvis:

```text
quote
├── project
├── dimensions
├── site
├── foundation
├── envelope
├── openings
├── installations
├── delivery
├── documents
└── customer
```

Det gör att frågor kan flyttas mellan visuella steg utan att lagrad data behöver migreras bara för att UX ändras.

---

# 17. Exempel på dynamiska regler

Regler ska separeras från rena UI-komponenter.

Exempel:

```text
IF hall_type = talthall
THEN visa relevanta PVC-alternativ
```

```text
IF wall_material = sandwich
THEN visa val för paneltjocklek
```

```text
IF foundation_status = existing
THEN visa grundtyp och fråga om grundritning
```

```text
IF customer_role != end_customer
THEN visa slutkundsfält
```

```text
IF dimension_confidence = need_help
THEN exakta mått är frivilliga
```

```text
IF ports_required = yes
THEN minst en portpost kan skapas
```

---

# 18. Rensning av villkorad data

När ett överordnat svar ändras ska data som inte längre är relevant rensas.

Exempel:

```text
foundation.status = existing
foundation.type = concrete_slab
foundation.drawing_available = yes
```

Om kunden ändrar till:

```text
foundation.status = planned
```

ska följande gamla värden inte ligga kvar dolt:

```text
foundation.type
foundation.drawing_available
```

Däremot ska oberoende uppgifter behållas.

Exempel:

```text
site.ground_type = soil_field
```

ska inte rensas bara för att grundstatus ändras.

---

# 19. Navigering och state

Kunden ska kunna:

- gå framåt
- gå bakåt
- ändra tidigare svar
- behålla övriga relevanta svar
- återvända från Kontroll till rätt steg
- fortsätta utan att formuläret återställs

Validering ska ske utifrån aktuellt state och endast på frågor som är relevanta.

---

# 20. Mobilkrav

Mobil är ett huvudscenario eftersom stor del av trafiken förväntas komma från Facebook-annonser.

Krav:

- mobile first
- ingen horisontell scroll
- touchvänliga knappar och val
- formulärfält med full användbar bredd
- tydliga labels ovanför fälten
- stegindikator som fungerar på smal skärm
- inga viktiga actions bakom hover
- numeriska fält ska använda lämpligt mobilt tangentbord
- felmeddelanden ska visas nära relevant fält
- dynamiskt visade/dolda fält får inte skapa förvirrande hopp
- sammanfattningen ska fungera som en kolumn på mobil
- formuläret ska gå att fylla i med en hand utan zoom

Test ska göras på riktig mobil, inte endast med smalt desktopfönster.

Facebooks inbyggda webbläsare bör ingå i slutligt acceptanstest.

---

# 21. UX-principer

Formuläret ska kännas som en guidning, inte som en teknisk specifikationsblankett.

Prioritera:

- en tydlig huvudfråga i taget
- kort hjälptext när facktermer används
- valkort när få tydliga alternativ finns
- dropdown när listor är längre eller sekundära
- **Vet inte** när kunden rimligen kan sakna teknisk kunskap
- **Hallpartner rekommenderar** när Hallpartner normalt bör göra valet

Undvik:

- tekniska standardvärden som automatiskt förval
- stora väggar av formulärfält
- att fråga samma sak i flera steg
- krav på filer för att kunna skicka
- konstruktionstekniska påståenden som kunden förväntas verifiera

---

# 22. Visuell UX-referens

Tidigare beslutad UX-referens för offertguidens struktur är Carlstad Stadsbuds offertguide.

Referensen ska användas för:

- wizard-struktur
- progress/stegkänsla
- komponentmodell
- mobilt beteende
- övergripande interaktionsmönster

Hallpartners implementation ska använda Hallpartners egen grafiska profil, innehåll och affärslogik.

Referensen är inte ett skäl att kopiera Stadsbuds affärsfrågor.

---

# 23. Astro-implementation – principer

WordPress-spåret är avslutat. Den nya webbplatsen byggs i Astro.

Offertflödet ska därför planeras som en del av Hallpartners nya webbarkitektur.

Viktiga principer:

- affärslogik och state ska inte ligga utspridda i presentationskomponenter
- frågekonfiguration ska kunna hållas separat från wizard-komponenterna
- återanvändbara komponenter ska användas för valkort, input, sammanfattningsrader och repeater-objekt som portar
- klient-JavaScript ska hållas så begränsat som möjligt men får användas där det dynamiska flödet kräver det
- serverlagring och filuppladdning ska väljas separat från den statiska Astro-frontenden
- endpoint ska validera all data på serversidan
- frontendvalidering är UX, inte säkerhet

---

# 24. Lagring – målbild

Tidigare MVP-modell för lagring:

```text
quotes
- id
- public_id
- status
- customer_email
- configuration_json
- created_at
- updated_at
```

När modellen stabiliserats kan separata strukturer senare skapas för exempelvis:

- ports
- attachments
- quote_items
- revisions
- calculations

Börja inte med en stor mängd relationstabeller innan affärsmodellen är stabil.

---

# 25. Request ID

Varje skickad offertförfrågan ska få ett människoläsbart unikt ID.

Format:

```text
HP-YYYY-NNNNN
```

Exempel:

```text
HP-2026-00142
```

ID:t ska genereras på serversidan.

---

# 26. Framtida kalkyl

Automatisk kundkalkyl ska inte byggas in i första produktionsversionen.

Plan:

```text
v1
→ offertförfrågan

senare
→ intern kalkyl

ännu senare
→ eventuell prisindikering för standardhallar
```

Intern kalkyl kan senare innehålla:

- material
- montage
- transport
- tillägg
- totalpris
- revisionshistorik

---

# 27. Saker som måste bekräftas med Hallpartner

Följande är ännu inte tillräckligt affärsverifierat för att hårdkodas som permanent produktlogik:

1. Om Lagerhall, Ridhus, Tälthall och Isolerad hall verkligen är separata produktfamiljer.
2. Exakt portsortiment.
3. Vilka vägg- och takmaterial som gäller för respektive halltyp.
4. Vilka paneltjocklekar som faktiskt ska kunna väljas av kund.
5. Vilka färger/RAL-alternativ som ska visas som standard.
6. Vilka takvinklar som är relevanta per konstruktion.
7. Hur detaljerade frågor om grund/fundament kunden själv ska få.
8. Vilka installationer Hallpartner faktiskt levererar respektive endast förbereder för.
9. Exakt ansvarsfördelning för bygglov/projektering.
10. Vilka filtyper Hallpartner vill ta emot.
11. Vilka kontaktuppgifter som ska vara obligatoriska.
12. Vilken e-post-/CRM-/ärendehantering som ska ta emot en färdig förfrågan.
13. Policy för lagringstid och personuppgifter.
14. Vilket anti-spam/botskydd som ska användas.
15. Hur interna kompletteringar och statusar ska hanteras efter inskick.

---

# 28. Rekommenderad första produktionsversion

Första riktiga versionen bör prioritera ett komplett men kontrollerat offertflöde framför avancerad administration och kalkyl.

Prioritet:

1. Alla kundfrågor och villkor
2. Stabil state-hantering
3. Mobil UX
4. Servervalidering
5. Lagring
6. Bekräftelse med request_id
7. Hallpartner-notifiering
8. Säker filhantering

Kan vänta:

- avancerad intern kalkyl
- visuell regelbyggare
- kundportal
- omfattande CRM
- automatiska konstruktionstekniska slutsatser

---

# 29. Acceptanskriterier för offertflödet

Flödet är inte produktionsklart förrän följande är verifierat:

- alla tio huvudområden finns representerade
- irrelevanta frågor döljs
- irrelevanta gamla svar rensas
- relevanta svar ligger kvar vid navigering
- Kontroll visar rätt data
- Ändra fungerar från Kontroll
- inga tekniska val hårdförväljs utan affärsskäl
- mobilflödet fungerar på riktig telefon
- Facebooks in-app browser är testad
- servern validerar inkommande data
- dubbla submits hanteras
- request_id är unikt
- personuppgifter hanteras enligt beslutad policy
- uppladdade filer är privata
- kunden får tydlig bekräftelse
- Hallpartner får en användbar intern sammanställning

---

# 30. Sammanfattning av principen

Offertguiden ska inte försöka göra kunden till konstruktör.

Den ska:

1. förstå projektets grundförutsättningar
2. samla de uppgifter kunden faktiskt känner till
3. låta kunden lämna tekniska beslut till Hallpartner där det är rimligt
4. skapa ett strukturerat underlag som Hallpartner kan granska och komplettera
5. fungera snabbt och friktionsfritt på mobil

Kundens svar är början på offert- och projekteringsprocessen, inte en färdig teknisk specifikation.
