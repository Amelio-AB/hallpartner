# Hallpartner – offertguide V2 (arbetskandidat)

**Datum:** 2026-11-04  
**Status:** Arbetsförslag för ägargranskning – **inte kundgodkänt och inte aktiverat**.  
**Implementation:** `src/config/hallpartner-quote.ts`, AMP-001 1.5.0, PR [#22](https://github.com/Amelio-AB/hallpartner/pull/22).  
**Mål:** Fem frågesteg plus **ett automatiskt slutgranskningssteg**. Inte sex konfigurerade frågesteg.

## Beslut 2026-11-04 – visuell design godkänd av projektägaren

**Godkänt:** Den visuella Hallpartner-anpassningen på PR #22 med Inter, befintliga gröna färgroller, nedtonade valkort, responsiv tvåkolumnslayout för fält och kompakt sexstegsindikator. Godkännandet gäller designriktningen i commit `de93fe309ec45ef7059a92eab3c6b40ce2e1342d`; färgnyanser, toning och transparens är justerbara vid framtida finputsning och ska inte blockera det fortsatta arbetet.

**Senaste innehållsbeslut 2026-11-04 (ersätter tidigare fyrfältsbeslut):** Projektägaren har godkänt **exakt tre obligatoriska fält**: användningsområde, namn och e-post. Beskrivningsrutan `project.description` är frivillig utan minsta teckenantal, och `dimensions.confidence` förblir frivilligt. Övriga frågeformuleringar, faktiska produkter, verklig filuppladdning, servermottagning, aktivering och merge/publicering är inte därmed slutgodkända. PR #22 förblir Draft tills återstående grindar har passerats.

## Beslut 2026-11-04 – tre obligatoriska svar (senaste beslut)

**Godkänt av projektägaren för den befintliga offertguidens arbetsversion:** Endast `project.use`, `contact.name` och `contact.email` är obligatoriska. På steg 1 måste besökaren **välja ett användningsområde**, men får lämna fritextrutan `project.description` tom eller ange en kort kommentar utan tioteckenskrav. Fritexten ligger kvar på steg 1 tills vidare; vi flyttar inte runt frågor nu. `dimensions.confidence` fortsätter vara frivilligt, och `need_help` döljer fortfarande måtten. Opt-in-varianten med en lokal filväljare har också bara dessa tre obligatoriska frågor.

**Tidigare beslut:** Fyrfältsmodellen från samma dag har uttryckligen ersatts när projektägaren tog bort beskrivningen som krav. Inget annat steg eller affärsinnehåll ändras i detta beslut.

**Inte godkänt här:** Att slå ihop PR, publicera på preview eller aktivera inskickning, SMTP, V2-backend eller filöverföring. Den visuella designen är redan godkänd och lämnas orörd.

## 1. Underlag och källkritik

| Källa | Vad den styr / inte styr | Bedömning |
| --- | --- | --- |
| `docs/OFFERTFLODE.md` (2 oktober) | Frågebank med **tio sakområden**, alternativa formuleringar, datamodell och regler. Dokumentet kallar sig självt ”source of truth” och talar om tio beslutade steg. | **Historiskt underlag**, inte aktuell låst UI-struktur. Frågorna ska spåras, men inte automatiskt byggas som tio steg. |
| `src/config/hallpartner-quote.ts` före V2 | Fyra frågesteg för användning, mått, ort och kontakt; AMP-001 lägger till kontroll. | Verifierad föregående implementation. Ursprungliga fälten `project.use`, `project.description`, `dimensions.*`, `site.city`, `site.postal_code` och `contact.*` bevaras där de används. |
| `src/config/hallpartner-quote-attachments-review.ts` före V2 | En femte fråga-/filsektion i ett opt-in V2-granskningsläge. | Filfrågan flyttas nu till **frågesteg 4**, annars hade sexstegsmålet överskridits. |
| `HallPartner_V70_NORGE_v5_790KR_FIX2 (2).html` (historisk biblioteksfil) | Äldre formulärreferens med bl.a. halltyp, mått, takvinkel, vägg-/takval, antal portar, montagespår och kontaktfält. Den är märkt NORGE, har förvalda tekniska värden och är inte en kundgodkänd svensk offertspecifikation. | **Design-/frågereferens**, inte källa för priser, fasta standarder eller leveransomfattning. |
| Carlstad Stadsbuds offertlogik | Referens för wizard-/progresskänsla och möjlighet att redigera före skickning. | Använd UX-mönster, kopiera inte ett annat företags affärsfrågor. |
| Överlämning 4 november | Projektägarens uttryckliga beslut: **fem frågesteg + slutgranskning**, ingen merge/aktivering före granskning. | Styr aktuell arbetsstruktur. |

**Begrepp:** ”Kundbekräftat” kräver uttrycklig bekräftelse från Hallpartner, inte att en fråga förekommer i ett äldre förslag. I tabellerna nedan betyder **Arbetsförslag** att vi bedömer frågan rimlig för första kontakten, inte att Hallpartner erbjudit det den beskriver.

## Prioriterad innehållsgranskning 2026-11-04

**Den visuella designen är godkänd – frågeinnehållet är det inte.** Denna innehållsiteration har
justerat de befintliga frågornas språk och lagt till ett **frivilligt** intresseval bland webbplatsens sex
hallkategorier. Den har **inte** ändrat datanycklar som redan används, antalet visuella steg,
kraven på kontakt/grundbeskrivning eller påstått att sortimentet är kundgodkänt.

### Kritisk bedömning: vad vi faktiskt behöver veta tidigt

| Bedömd nytta för första säljsamtalet | Uppgifter i arbetskandidaten | Fortsättning |
| --- | --- | --- |
| Hög | Vad kunden behöver hallen till, kort projektbeskrivning, kontaktuppgifter | Behåll i huvudflödet, kontrollera miniminivån med Hallpartner |
| Hög men ännu oklart som obligatoriskt | Ort/område, storleksuppfattning, ungefärlig tidsplan | Behåll synligt men frivilligt tills säljprocessen är bekräftad |
| Möjlig hjälp för rätt lösning | Önskad hallkategori (frivillig), isoleringsbehov, behov av portar | Fråga om behov eller preferens, inte tekniskt produktval |
| Lägre nytta i första kontakten | Takvinkel, paneltjocklek, RAL, grundtyp, portmått per enhet, omfattande installationer | Håll borta från första obligatoriska flödet; använd senare vid behov |
| Kräver separat beslut/infrastruktur | Inkommande filer, mottagaradress, personuppgiftsrutiner och aktiverad inskickning | Fortsatt avstängt. UI-piloten ger inte ett produktionsgodkännande |

**Fastställt för arbetsversionen:** Exakt tre obligatoriska fält:
`project.use`, `contact.name` och `contact.email`.
Projektbeskrivning, måttsäkerhet, mått, ort, tidsplan och telefon är frivilliga. Frågor om verkliga produkter och tekniska utföranden är fortfarande arbetsförslag; beslutet gäller inte aktivering.

**Nästa interna steg:** Granska formulärets existerande frågor och svarsalternativ tillsammans med projektägaren. Inga nya kundfrågeunderlag ska skapas eller skickas. Historiska verksamhetsenkäter är inte en aktiv källa eller blockerare för denna arbetsomgång.

## 2. Fältinventering – aktuell V2-kandidat

### Steg 1 – Behov

| Datanyckel | Fråga / svar | Krav, villkor, UI | Beslutsstatus |
| --- | --- | --- | --- |
| `project.use` | **Vad ska du främst använda hallen till?** Lager eller förvaring (`storage`), maskiner eller verkstad (`machinery`), ridverksamhet (`riding`), annat behov (`other`), behöver rådgivning (`unknown`). | **Obligatorisk**; valkort; informationsknapp. Utgår från användning, inte en sammanblandad produktfamilj. | Arbetsförslag; valen finns även i äldre fyrastegsguide. |
| `project.description` | **Beskriv gärna ditt behov (frivilligt)**. Fri text om användningen och vad som ska få plats. | **Frivillig**; inget minsta teckenantal, kan lämnas tom. Ligger kvar synlig på steg 1. | Uttryckligt godkänt av projektägaren 2026-11-04; V2-servermottagning är ännu inte byggd. |

| `project.hall_interest` | **Vilken av våra hallkategorier tänker du på?** Lagerhall, maskinhall, plåthall, tälthall, ridhus, isolerad hall eller vill ha hjälp att välja. | **Frivillig**, dold under **Har du en viss halltyp i åtanke?** i steg 1. Valet anger vad kunden tittat på – inte en teknisk specifikation. | Arbetsförslag baserat på webbplatsens sex kategorisidor; **inte kundbekräftad produktmodell**. |

**Varför halltyp som frivilligt intresse, inte obligatorisk konstruktion?** Historiken blandar användning (lager/ridhus) med konstruktion (tält) och egenskap (isolering). De sex alternativen återger **webbplatsens navigationskategorier**, inte sex ömsesidigt uteslutande byggsystem. `project.use` och `project.hall_interest` är därför oberoende. Exempel: ridverksamhet + tälthall är tillåtet som önskemål; Hallpartner måste senare rekommendera lämpligt utförande.

### Steg 2 – Mått och plats

| Datanyckel | Fråga / svar | Krav, villkor, UI | Beslutsstatus |
| --- | --- | --- | --- |
| `dimensions.confidence` | **Vet du ungefär hur stor hallen ska vara?** Ja, vet måtten (`exact`), ungefärliga mått (`approximate`), behöver hjälp med storleken (`need_help`). | **Frivillig**; informationsknapp. Kan lämnas tom och hindrar inte navigering. | Obligatoriskt-status borttaget efter projektägarens uttryckliga beslut 2026-11-04. |
| `dimensions.width` | **Bredd i meter**. Positivt tal med decimalpunkt eller kommatecken. | Frivillig; bara när måttsvar ≠ `need_help`; validering av positiva mått. | Arbetsförslag. |
| `dimensions.length` | **Längd i meter**. Samma format. | Frivillig; samma villkor. | Arbetsförslag. |
| `dimensions.side_height` | **Sidohöjd i meter**. Positivt tal. | Frivillig; dold bakom **Fler mått**; visas inte vid `need_help`; informationsknapp. | Arbetsförslag. |
| `site.city` | **I vilken ort eller vilket område vill du bygga?** Ort eller område. | Frivillig, synlig i normalflödet. | Arbetsförslag; geografi behövs ofta för bedömning men är inte kundbekräftat som krav. |
| `site.postal_code` | **Postnummer**. Svenska fem siffror. | Frivillig, i grupp **Fler uppgifter om byggplatsen**. | Arbetsförslag; tidigare nyckel. |
| `site.decided` | **Är den exakta byggplatsen bestämd?** Ja/nej/vet inte. | Frivillig, samma grupp. | Arbetsförslag baserat på historisk fråga. |
| `site.address` | **Adress eller fastighetsbeteckning**. Fri text. | Frivillig; visas endast om `site.decided=yes`; samma grupp. | Arbetsförslag; ingen platsuppgift måste lämnas i granskningsläget. |
| `foundation.status` | **Hur ser det ut med grunden?** Befintlig (`existing`), planerad (`planned`), ingen planerad (`none`), vet inte (`unknown`). | Frivillig, grupp **Fler uppgifter om byggplatsen**. | Arbetsförslag, inte tekniskt eller kundgodkänt. |
| `foundation.notes` | **Vad vet du om grunden?** Exempelvis befintlig platta eller planeringsansvar. | Frivillig, samma grupp; bara när grunden finns eller planeras. | Arbetsförslag; inget påstående om Hallpartners leverans. |

**Viktigt villkor:** `site.city` och övriga platsdata är oberoende av `foundation.status`. Endast `foundation.notes` rensas när grundvalet inte längre gör kommentaren relevant. För bredd/längd/höjd rensas tidigare värden om `dimensions.confidence` ändras till `need_help`.

### Steg 3 – Utformning

| Datanyckel | Fråga / svar | Krav, villkor, UI | Beslutsstatus |
| --- | --- | --- | --- |
| `design.insulation` | **Behöver hallen vara isolerad?** Troligen ja/nej, Hallpartner rekommenderar, vet inte. | Frivillig, synlig; informationsknapp. | Arbetsförslag om behov – **inte** godkända panelalternativ eller material. |
| `openings.ports` | **Behöver hallen en eller flera portar?** Ja/nej/osäker. | Frivillig, synlig. | Arbetsförslag. |
| `openings.port_needs` | **Beskriv gärna hur portarna ska användas.** Ungefärligt antal, mått, trafik eller maskiner. | Frivillig; endast om `openings.ports=yes`. Tillfällig fritext för behov; **inte** en ersättning för separata portobjekt. | Arbetsförslag; detaljerad portmodell kräver plattformsarbete och kundbeslut. |
| `openings.windows` | **Behövs fönster eller ljusinsläpp?** Ja/nej/behöver diskuteras. | Frivillig; grupp **Fler önskemål**. | Arbetsförslag. |
| `design.envelope_wishes` | **Önskemål om väggar, tak eller färg.** Fri text. | Frivillig; samma grupp. | Arbetsförslag. Inga material-/RAL-/takvinkelalternativ hårdkodas. |
| `design.installation_wishes` | **Övriga funktioner eller tillval att diskutera.** Fri text. | Frivillig; samma grupp. Inga utfästelser om utbud. | Arbetsförslag; verkliga tillval kräver verifierat utbud innan de visas som produktalternativ. |
| `delivery.wishes` | **Vad vill du ha hjälp med utöver själva hallen?** Fri text om exempelvis montage eller grund. | Frivillig; samma grupp. | Arbetsförslag, ingen produkt- eller leveransnivå bekräftad. |

**Öppet tekniskt behov:** AMP-001 1.5.0 stöder inte upprepningsbara portposter eller flervalsfält. Implementera inte ”antal portar + ett gemensamt mått” som en falsk komplett modell. En separat plattforms- och mottagarversion krävs om Hallpartner bekräftar detaljerad portkonfigurering före första kontakt.

### Steg 4 – Projektläge och underlag

| Datanyckel | Fråga / svar | Krav, villkor, UI | Beslutsstatus |
| --- | --- | --- | --- |
| `planning.stage` | **Hur långt har projektet kommit?** Undersöker (`ideas`), planering (`planning`), bygglov/projektering (`permit`), redo för nästa steg (`ready`), vet inte (`unknown`). | Frivillig, synlig. | Arbetsförslag; kan hjälpa säljaren att förstå projektets tidshorisont. |
| `planning.timeline` | **När skulle du vilja att bygget startar?** Snarast, inom 3 månader, 3–6, 6–12, senare, vet inte. | Frivillig, synlig. | Arbetsförslag; uppskattning från kund, inte Hallpartners leveranslöfte. |
| `documents.available` | **Har du ritningar, skisser eller bilder?** Ja, något, inte ännu, nej. | Frivillig, synlig, informationsknapp. | Arbetsförslag; inga filer krävs. |
| `documents.description` | **Vilket underlag finns?** Fri text. | Frivillig; bara vid ja/något. | Arbetsförslag. |
| `planning.permit_status` | **Hur ser det ut med bygglovet?** Inte undersökt, undersöks, ansökan pågår, beviljat, vet inte. | Frivillig; grupp **Fler projektuppgifter**; informationsknapp. **Ingen juridisk bedömning** görs. | Arbetsförslag. |
| `planning.notes` | **Övrigt om projektet.** Fri text. | Frivillig; samma grupp. | Arbetsförslag. |
| `documents.attachments` | **Välj bilder eller dokument (endast lokal test).** JPG/PNG/WebP/PDF/DOCX, max 10, 15 MiB/fil och 50 MiB totalt i lokal UI-pilot. | **Endast opt-in filgranskning** via `PUBLIC_HP_QUOTE_FILES_REVIEW=true`; frivillig; på samma steg 4; inga uppladdningar eller verkliga inskickningar. | Teknisk pilot, **inte kundgodkänd** filpolicy. |

**Viktig säkerhetsgräns:** Piloten finns bara i webbläsaren. Den vanliga guiden saknar filfält. Det finns ingen servermottagning för V2, ingen privat lagring och inget godkänt gallringsbeslut. Ingen fil får skickas till `/api/lead.php`.

### Steg 5 – Kontakt

| Datanyckel | Fråga / svar | Krav, villkor, UI | Beslutsstatus |
| --- | --- | --- | --- |
| `contact.name` | **Namn**. | **Obligatorisk**, autocomplete name. | Arbetsförslag; tidigare krav. |
| `contact.email` | **E-post**. | **Obligatorisk**, e-posttyp/autocomplete. | Arbetsförslag; tidigare krav. |
| `contact.phone` | **Telefon**. | Frivillig, mönstervaliderad, autocomplete tel. | Arbetsförslag. |
| `contact.company` | **Företag**. | Frivillig, grupp **Fler kontaktuppgifter**, autocomplete organization. | Arbetsförslag. |
| `contact.role` | **Vilken roll har du i projektet?** Beställare/slutkund, entreprenör, konsult/projektör, annan roll. | Frivillig, samma grupp. | Arbetsförslag; ingen automatisk gren för separat slutkund i denna version. |
| `contact.preference` | **Hur vill du helst bli kontaktad?** E-post, telefon, spelar ingen roll. | Frivillig, samma grupp. **Telefon** kräver ifyllt och giltigt `contact.phone`; annars visas fel innan kontrollsteget. | Arbetsförslag. Kräver affärsbeslut före publik inskickning. |

**Obligatoriska fält godkända för arbetsversionen:** `project.use`, `contact.name`, `contact.email`. **Alla övriga är frivilliga**, inklusive projektbeskrivningen. Detta är ett godkännande av formulärlogikens krav, inte kundgodkännande av produkter eller tillåtelse att aktivera inskickning.

### Steg 6 – Granska och skicka

**Skapas automatiskt av AMP-001.** Ingen sjätte post i `steps`. Sammanfattning per frågesteg, **Ändra** för varje sektion, tillbakagång och bibehållna relevanta svar. Slutknappen visas som **Skicka förfrågan**, men är **inaktiverad** i arbetsversionen. Ingen verklig submission, inget request-ID och ingen kundbekräftelse utlovas.

## 3. Spårning från historikens tio områden

| Historiskt område | V2-kandidat / beslut | Vad som inte tappas bort |
| --- | --- | --- |
| 1. Halltyp | Steg 1: `project.use` + beskrivning + frivillig `project.hall_interest`. | Hallkategorierna beskriver kundens intresse, inte definitiv konstruktion; isoleringsbehov finns i steg 3. |
| 2. Mått och byggplats | Steg 2: osäkerhetsnivå, mått, ort, frivilligt postnummer/adress. | Specialmått, höjd över havet och automatisk area ligger kvar som senare tekniska behov. |
| 3. Grund och mark | Steg 2, frivillig utfällning med grundstatus och kommentar. | Marktyp, grävning, återfyllning, ritning och fundamentval behöver avgränsas med Hallpartner; inte ignoreras. |
| 4. Väggar och tak | Steg 3: isoleringsbehov samt frivillig fritext. | Paneltjocklek, material, färg/RAL och takvinkel ska inte vara kundval utan verifierat sortiment och regler. |
| 5. Portar, dörrar och öppningar | Steg 3: portbehov + följdtext samt frivilligt ljusinsläpp. | Separata portobjekt, typer, dörrmått och placering kräver verifierat behov samt repeaterstöd. |
| 6. Installationer och tillval | Steg 3: frivilliga önskemål i fritext. | Multival och faktiska levererade tjänster väntar på Hallpartners svar. Inget påstått solcellserbjudande. |
| 7. Leveransomfattning och tidsplan | Steg 3: önskad hjälp i fritext; steg 4: tidsplan och status. | Montage, ansvarsfördelning och leveransnivåer är obesvarade affärsfrågor. |
| 8. Ritningar och underlag | Steg 4: vad som finns, frivillig beskrivning, opt-in lokal filpilot. | Privat serverlagring och säker upload är separat senare uppdrag. |
| 9. Kund och kontakt | Steg 5: kontakt och frivillig kundroll. | Slutkundsgrenar, organisationsnummer och befattning kräver affärsmotivering. |
| 10. Kontroll och skicka | AMP-001 automatiska kontrollsteg. | Verklig submit, serverkvittens och `HP-YYYY-NNNNN` är inte aktiva. |

## 4. Regler, rensning och krav på UX

- Endast **synliga relevanta svar** ingår i `flow.snapshot().active` och sammanfattningen. Villkorade fält ska rensas när överordnat svar ändras. De frivilliga utfällbara grupperna styr bara presentationen; att stänga en grupp får **inte** rensa ifyllda svar.
- `dimensions.confidence=need_help` döljer och rensar mått. Ändring av grundstatus rensar kommentaren när den inte längre gäller, men ska inte radera ort eller postnummer.
- `openings.ports != yes` tar bort portkommentaren. `documents.available` annat än yes/some tar bort underlagsbeskrivningen.
- Alla frågor måste gå att förstå på mobil (320, 390, 768, 1024 och 1440 px), med synlig focus, rimlig kortbredd, ingen horisontell overflow, användbar progress och redigerbar sammanfattning.
- Hjälpdialoger ska stödja Escape och återföra fokus. Felmeddelanden ska förklaras och fält i stängda grupper öppnas vid valideringsfel.
- Filer är **frivilliga** och hör till steg 4 bara i separat lokal V2-pilot. Ingen verklig filöverföring sker. Kontrollera inte in kundritningar som publika filer.

## 5. Frågor som inte byggs i V2-kandidat och varför

**Flyttas till senare säljsamtal tills Hallpartner har bekräftat behovet:** exakt fundamenttyp, geoteknik/snölast/brand-/säkerhetsklass, takvinkel, paneltjocklekar och RAL, separata portar med exakta mått, installationsutförande, leveransens ansvarsmatris, bygglovsbedömning, ritningskategori per fil och uppgifter om separat slutkund. De ökar arbetet för besökaren och riskerar felaktiga kommersiella påståenden.

**Kräver teknisk plattformsförändring om de ska bli valbara:** upprepningsbara portobjekt, multival av installationer/åtaganden, härledd area, samt privat filuppladdning med säker backend. Inga provisoriska hårdkodade fälttyper eller kundspecifik ändring i Amelio Web Platform görs nu.

**Utanför uppdraget:** prisberäkning, konfigurator, köp och leverantörsintegration. Se beslutet från 2026-11-02 om pausad kalkylator.

## 6. Nästa godkännanden – endast offertguiden

Det tidigare sidospåret med nya frågor till Hallpartner är **avslutat**. Vi arbetar vidare i den existerande formulärspecifikationen och koden, utan att skapa fler kundfrågeunderlag.

**Första beslutet från projektägaren (innehåll, inte design):**

- Godkänna fem frågesteg + AMP-001:s automatiska slutgranskning.
- Godkänna huvudfrågorna: användning, kort projektbeskrivning, ungefärliga mått och byggplats, relevanta önskemål, projektläge, kontakt.
- [x] **Uppdaterad obligatorisk nivå godkänd 2026-11-04:** användning, namn och e-post. Projektbeskrivning, måttsäkerhet, ort, mått, tidsplan och telefon är frivilliga.
- Behålla möjligheten att ange intresse för en hallkategori **frivilligt**, utan att låsa konstruktionsutförandet.

Den godkända trefältsregeln genomförs och verifieras på befintlig Draft-PR #22. Övriga frågor och serveraktivering bedöms separat. Inget ytterligare designgodkännande behövs för den redan accepterade visuella riktningen.

**Separat, senare beslut:** Om den färdiga och testade, fortfarande inaktiva guiden får mergas till `main` och därmed potentiellt publiceras på utvecklingspreviewn. Detta ger **inte** tillstånd att aktivera faktisk inskickning, filuppladdning, e-postmottagning eller kundens WordPress.


## 7. Säkerhets- och leveransgräns

- **Mottagaren `server/lead/validator.php` är V1:** `contractVersion=1`, maximalt 24 svar och en fast tillåten nyckellista. V2-kandidatens nya nycklar får **inte** skickas dit även utan filer.
- `/offert/` har därför en **uttrycklig permanent avstängning av inskickning i denna PR**. Varken `PUBLIC_HP_LEADS_ENABLED` eller filpiloten kan aktivera den. Kontaktformulärets befintliga flagga lämnas orörd.
- V2 filgranskning använder en uppladdningsadapter som **alltid avvisar** uppladdning och submit. Det finns ingen privat filserver här.
- Innan aktivering behövs kundgodkända fält/avtal, servervalidering för den nya nyckellistan och maxstorleken, GDPR-/mottagarbeslut, separata aktiveringsflaggor och verifierat riktiga testförfrågningar. Bilagor kräver dessutom helt separat säker serverhantering.
- PR #22 stannar **Draft**, utan merge eller publicering från grenen. Publicerad `main`-preview är **inte** denna redesign.

## Visuell formstandard för Hallpartner (designkandidat 2026-11-04)

De två kundreferensbilderna används enbart som **layoutreferenser**. Hallpartners faktiska
besökarsida använder **Inter** och en mörkgrön CTA. Vi kopierar inte den andra
kundens seriftypsnitt, färger eller tjänstefrågor.

| Område | Hallpartners anpassning |
| --- | --- |
| Rubriker, etiketter och input | Inter, samma font som besökarsidan |
| Sidbakgrund | `#EBEBE8` |
| Nedtonade valkort | `#F1F4F0`, fast ton i stället för genomskinliga kort |
| Aktivt val | `#E7F1E6`, kantmarkering `#287B39` |
| Huvudknapp/fokus | `#287B39`, hover `#1D6529`; vit text |
| Intro | En centrerad H1 och kort förklaring; redundant AMP-intro dold visuellt men formulärets aria-label kvarstår |
| Stegindikator | Sex cirklar på större skärmar, sex segment och aktiv stegtext på mobil |
| Valkort i första steget | Två kolumner på desktop, en kolumn på mobil, kort behovsbeskrivning |
| Fält i senare steg | Två kolumner från 740 px, en kolumn under 740 px; textytor och fällbara grupper fullbredd |
| Navigering | Nästa/tillbaka i formulärpanelen; inga knappar flyttas med sköra DOM-hack |
| Avstängd funktion | Ingen verklig inskickning eller filuppladdning förrän separat godkänd backend finns |

CSS ligger **endast** i `src/styles/hallpartner-leads.css` och är avgränsad till
`.hp-quote-shell`; Amelio Web Platform ändras inte. Kontrast testas på fasta
ytfärger, inte med `opacity` som ändras beroende på bakgrunden. Designkandidaten
ska först få visuell ägargranskning och innebär **inte** kundgodkända offertfrågor.

## 8. Granskningschecklista

- [ ] TypeScript, ESLint, Astro-build, Node/PHP-kontrakt och GitHub Actions gröna på sista commit.
- [ ] Verklig webbläsargranskning på befintlig `/offert/` vid 320, 390, 768, 1024 och 1440 px; spara skärmbilder.
- [ ] Valkort, långord, fokus, hjälpdialog (Escape + fokusåterföring) och mobil progress verifierade.
- [ ] Öppna/stäng frivilliga grupper; kontrollera att relevanta värden inte försvinner.
- [ ] Ändra måttsäkerhet/grundstatus/portbehov/underlag; kontrollera rensning av villkorade data och korrekt sammanfattning.
- [ ] Testa både vanlig sexstegsguide utan filfält och opt-in sexstegsguide med lokalt filfält.
- [ ] Kontrollera att **inga** nätverksanrop för inskickning eller filuppladdning sker.
- [x] Projektägaren godkände formulärets visuella design 2026-11-04 (layout, typografi och färgriktning).
- [x] Projektägaren har godkänt exakt tre obligatoriska frågor för arbetsversionen; beskrivningen är frivillig.
- [ ] Övrig frågecopy, val och eventuella produktpåståenden granskas innan någon merge; inga obekräftade produktlöften får införas.
