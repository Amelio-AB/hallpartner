# Hallpartner – offertguide V2 (arbetskandidat)

**Datum:** 2026-11-04  
**Status:** Arbetsförslag för ägargranskning – **inte kundgodkänt och inte aktiverat**.  
**Implementation:** `src/config/hallpartner-quote.ts`, AMP-001 1.5.0, PR [#22](https://github.com/Amelio-AB/hallpartner/pull/22).  
**Mål:** Fem frågesteg plus **ett automatiskt slutgranskningssteg**. Inte sex konfigurerade frågesteg.

## Beslut 2026-11-04 – visuell design godkänd av projektägaren

**Godkänt:** Den visuella Hallpartner-anpassningen på PR #22 med Inter, befintliga gröna färgroller, nedtonade valkort, responsiv tvåkolumnslayout för fält och kompakt sexstegsindikator. Godkännandet gäller designriktningen i commit `de93fe309ec45ef7059a92eab3c6b40ce2e1342d`; färgnyanser, toning och transparens är justerbara vid framtida finputsning och ska inte blockera det fortsatta arbetet.

**Inte godkänt genom detta beslut:** Exakt frågeinnehåll, vilka frågor som är obligatoriska, verklig filuppladdning, servermottagning, aktivering eller merge/publicering. Frågorna kräver separat beslut med Hallpartner. PR #22 förblir Draft tills återstående grindar har passerats.

## 1. Underlag och källkritik

| Källa | Vad den styr / inte styr | Bedömning |
| --- | --- | --- |
| `docs/OFFERTFLODE.md` (2 oktober) | Frågebank med **tio sakområden**, alternativa formuleringar, datamodell och regler. Dokumentet kallar sig självt ”source of truth” och talar om tio beslutade steg. | **Historiskt underlag**, inte aktuell låst UI-struktur. Frågorna ska spåras, men inte automatiskt byggas som tio steg. |
| `Hallpartner_Beslutsunderlag_Peter_Jimmy.docx` / PDF (oktober, tillgänglig i projektets dokumentbibliotek men inte versionshanterad) | 36 **verksamhetsfrågor till Hallpartner**. Framför allt fråga 14–15 och 27–36 rör förfrågans innehåll och process. De synliga svarsfälten är tomma. | **Öppet beslut**, inte kundbekräftat sortiment eller obligatoriska leadfält. |
| `src/config/hallpartner-quote.ts` före V2 | Fyra frågesteg för användning, mått, ort och kontakt; AMP-001 lägger till kontroll. | Verifierad föregående implementation. Ursprungliga fälten `project.use`, `project.description`, `dimensions.*`, `site.city`, `site.postal_code` och `contact.*` bevaras där de används. |
| `src/config/hallpartner-quote-attachments-review.ts` före V2 | En femte fråga-/filsektion i ett opt-in V2-granskningsläge. | Filfrågan flyttas nu till **frågesteg 4**, annars hade sexstegsmålet överskridits. |
| `HallPartner_V70_NORGE_v5_790KR_FIX2 (2).html` (historisk biblioteksfil) | Äldre formulärreferens med bl.a. halltyp, mått, takvinkel, vägg-/takval, antal portar, montagespår och kontaktfält. Den är märkt NORGE, har förvalda tekniska värden och är inte en kundgodkänd svensk offertspecifikation. | **Design-/frågereferens**, inte källa för priser, fasta standarder eller leveransomfattning. |
| Carlstad Stadsbuds offertlogik | Referens för wizard-/progresskänsla och möjlighet att redigera före skickning. | Använd UX-mönster, kopiera inte ett annat företags affärsfrågor. |
| Överlämning 4 november | Projektägarens uttryckliga beslut: **fem frågesteg + slutgranskning**, ingen merge/aktivering före granskning. | Styr aktuell arbetsstruktur. |

**Begrepp:** ”Kundbekräftat” kräver uttrycklig bekräftelse från Hallpartner, inte att en fråga förekommer i ett äldre förslag. I tabellerna nedan betyder **Arbetsförslag** att vi bedömer frågan rimlig för första kontakten, inte att Hallpartner erbjudit det den beskriver.

## 2. Fältinventering – aktuell V2-kandidat

### Steg 1 – Behov

| Datanyckel | Fråga / svar | Krav, villkor, UI | Beslutsstatus |
| --- | --- | --- | --- |
| `project.use` | **Vad ska du främst använda hallen till?** Lager eller förvaring (`storage`), maskiner eller verkstad (`machinery`), ridverksamhet (`riding`), annat behov (`other`), behöver rådgivning (`unknown`). | **Obligatorisk**; valkort; informationsknapp. Utgår från användning, inte en sammanblandad produktfamilj. | Arbetsförslag; valen finns även i äldre fyrastegsguide. |
| `project.description` | **Berätta kort om projektet**. Fri text om användningen och vad som ska få plats. | **Obligatorisk**, minst 10 tecken i frontend; kort hjälptext. | Arbetsförslag; befintlig validator kräver 10 tecken. |

**Varför inte halltyp som första obligatoriska val?** Historiken blandar produkt/användning (lager/ridhus) med konstruktion (tält) och isolering. Projektägaren och frågeunderlaget pekar på samma modellrisk. Kundens önskemål kan först beskrivas fritt; senare kan ett verkligt sortiment styra separata val.

### Steg 2 – Mått och plats

| Datanyckel | Fråga / svar | Krav, villkor, UI | Beslutsstatus |
| --- | --- | --- | --- |
| `dimensions.confidence` | **Hur säkra är dina mått?** Vet (`exact`), ungefärliga (`approximate`), behöver hjälp (`need_help`). | **Obligatorisk**; informationsknapp. | Arbetsförslag; bevarar tidigare logik. |
| `dimensions.width` | **Bredd i meter**. Positivt tal med decimalpunkt eller kommatecken. | Frivillig; bara när måttsvar ≠ `need_help`; validering av positiva mått. | Arbetsförslag. |
| `dimensions.length` | **Längd i meter**. Samma format. | Frivillig; samma villkor. | Arbetsförslag. |
| `dimensions.side_height` | **Sidohöjd i meter**. Positivt tal. | Frivillig; dold bakom **Fler mått**; visas inte vid `need_help`; informationsknapp. | Arbetsförslag. |
| `site.city` | **Var planeras hallen?** Ort eller område. | Frivillig, synlig i normalflödet. | Arbetsförslag; geografi behövs ofta för bedömning men är inte kundbekräftat som krav. |
| `site.postal_code` | **Postnummer**. Svenska fem siffror. | Frivillig, i grupp **Fler uppgifter om byggplatsen**. | Arbetsförslag; tidigare nyckel. |
| `site.decided` | **Är den exakta byggplatsen bestämd?** Ja/nej/vet inte. | Frivillig, samma grupp. | Arbetsförslag baserat på historisk fråga. |
| `site.address` | **Adress eller fastighetsbeteckning**. Fri text. | Frivillig; visas endast om `site.decided=yes`; samma grupp. | Arbetsförslag; ingen platsuppgift måste lämnas i granskningsläget. |
| `foundation.status` | **Hur ser det ut med grunden?** Befintlig (`existing`), planerad (`planned`), ingen planerad (`none`), vet inte (`unknown`). | Frivillig, grupp **Fler uppgifter om byggplatsen**. | Arbetsförslag; fråga 28 i kundunderlaget är obesvarad. |
| `foundation.notes` | **Vad vet du om grunden?** Exempelvis befintlig platta eller planeringsansvar. | Frivillig, samma grupp; bara när grunden finns eller planeras. | Arbetsförslag; inget påstående om Hallpartners leverans. |

**Viktigt villkor:** `site.city` och övriga platsdata är oberoende av `foundation.status`. Endast `foundation.notes` rensas när grundvalet inte längre gör kommentaren relevant. För bredd/längd/höjd rensas tidigare värden om `dimensions.confidence` ändras till `need_help`.

### Steg 3 – Utformning

| Datanyckel | Fråga / svar | Krav, villkor, UI | Beslutsstatus |
| --- | --- | --- | --- |
| `design.insulation` | **Behöver hallen vara isolerad?** Troligen ja/nej, Hallpartner rekommenderar, vet inte. | Frivillig, synlig; informationsknapp. | Arbetsförslag om behov – **inte** godkända panelalternativ eller material. |
| `openings.ports` | **Behöver hallen en eller flera portar?** Ja/nej/osäker. | Frivillig, synlig. | Arbetsförslag. |
| `openings.port_needs` | **Beskriv portbehovet.** Ungefärligt antal, mått, trafik eller maskiner. | Frivillig; endast om `openings.ports=yes`. Tillfällig fritext för behov; **inte** en ersättning för separata portobjekt. | Arbetsförslag; detaljerad portmodell kräver plattformsarbete och kundbeslut. |
| `openings.windows` | **Behövs fönster eller ljusinsläpp?** Ja/nej/behöver diskuteras. | Frivillig; grupp **Fler önskemål**. | Arbetsförslag. |
| `design.envelope_wishes` | **Önskemål om väggar, tak eller färg.** Fri text. | Frivillig; samma grupp. | Arbetsförslag. Inga material-/RAL-/takvinkelalternativ hårdkodas. |
| `design.installation_wishes` | **Övriga funktioner eller tillval att diskutera.** Fri text. | Frivillig; samma grupp. Inga utfästelser om utbud. | Arbetsförslag; fråga 31 måste besvaras innan verkliga tillval får väljas. |
| `delivery.wishes` | **Vilken hjälp önskar du med leveransen?** Fri text om exempelvis montage eller grund. | Frivillig; samma grupp. | Arbetsförslag, ingen produkt- eller leveransnivå bekräftad. |

**Öppet tekniskt behov:** AMP-001 1.5.0 stöder inte upprepningsbara portposter eller flervalsfält. Implementera inte ”antal portar + ett gemensamt mått” som en falsk komplett modell. En separat plattforms- och mottagarversion krävs om Hallpartner bekräftar detaljerad portkonfigurering före första kontakt.

### Steg 4 – Projektläge och underlag

| Datanyckel | Fråga / svar | Krav, villkor, UI | Beslutsstatus |
| --- | --- | --- | --- |
| `planning.stage` | **Hur långt har projektet kommit?** Undersöker (`ideas`), planering (`planning`), bygglov/projektering (`permit`), redo för nästa steg (`ready`), vet inte (`unknown`). | Frivillig, synlig. | Arbetsförslag; möjlig kvalificering enligt fråga 32. |
| `planning.timeline` | **När hoppas du komma igång?** Snarast, inom 3 månader, 3–6, 6–12, senare, vet inte. | Frivillig, synlig. | Arbetsförslag; uppskattning från kund, inte Hallpartners leveranslöfte. |
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
| `contact.role` | **Vilken roll har du i projektet?** Beställare/slutkund, entreprenör, konsult/projektör, annan roll. | Frivillig, samma grupp. | Arbetsförslag; fråga 35 är obesvarad. Ingen automatisk gren för separat slutkund ännu. |
| `contact.preference` | **Hur vill du helst bli kontaktad?** E-post, telefon, spelar ingen roll. | Frivillig, samma grupp. | Arbetsförslag. Kräver affärsbeslut före publik inskickning. |

**Obligatoriska fält i denna kandidat:** `project.use`, `project.description`, `dimensions.confidence`, `contact.name`, `contact.email`. Detta är **inte** Hallpartners godkända slutliga kravlista. Valen behöver bekräftas mot fråga 14, 15 och 34. Minsta möjliga krav kan vara ännu bättre för konverteringen.

### Steg 6 – Granska och skicka

**Skapas automatiskt av AMP-001.** Ingen sjätte post i `steps`. Sammanfattning per frågesteg, **Ändra** för varje sektion, tillbakagång och bibehållna relevanta svar. Slutknappen visas som **Skicka förfrågan**, men är **inaktiverad** i arbetsversionen. Ingen verklig submission, inget request-ID och ingen kundbekräftelse utlovas.

## 3. Spårning från historikens tio områden

| Historiskt område | V2-kandidat / beslut | Vad som inte tappas bort |
| --- | --- | --- |
| 1. Halltyp | Steg 1: `project.use` + beskrivning. | Frågan om konstruktionsfamilj/isolering är öppen; isoleringsbehov finns i steg 3. |
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

## 6. Beslut att be Hallpartner om före låsning

1. **Fråga 14–15, 27, 34:** Vilka uppgifter måste finnas före första samtalet, och vilka är onödiga som krav? Ska man alltid ange användning, text och måttsäkerhet?
2. **Fråga 27–31:** Hur säljs halltyperna i praktiken? Vilka utformnings-/port-/installationsval är verkliga erbjudanden? Vad är endast förfrågningsönskemål?
3. **Fråga 6–10, 28, 31:** Vilka arbeten ingår/kan diskuteras för grund, montage och leverans? Ska besökaren ens välja leveransomfattning?
4. **Fråga 32–35:** Behövs tidsplan, bygglovsstatus, bilagor, telefon eller kundroll före kontakt? Ska kontaktpreferens finnas?
5. **Fråga 33, 36:** Vilka filer är tillåtna, hur behandlas personuppgifter, vem tar emot förfrågan, och hur godkänns lagring/retention?

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
- [ ] Frågefördelning, obligatoriska uppgifter och affärsfakta behöver godkännas separat av Hallpartner.
