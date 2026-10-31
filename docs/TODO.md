# Hallpartner – TODO och öppna frågor

> **Centralt uppgiftsregister · upprättat 2026-10-31 · status är inte bevis för verksamhetsfakta.**
>
> Detta dokument är den gemensamma ingången för öppna uppgifter på Hallpartner.se. **[PROJECT_DECISIONS.md](PROJECT_DECISIONS.md)** är facit för aktuella *projektbeslut*; [researchgrenens claim/evidence-register][claims] är underlag för påståenden som måste bevisas. En TODO-rad får aldrig användas som stöd för ett kundlöfte, lagkrav eller tekniskt dimensioneringsbesked.

## Så används registret

- **Prioritet (risk/konsekvens, inte tidsordning):** **P0** = kritiskt att lösa före *relevant beslut, integration eller lansering*; **P1** = viktigt för första versionen; **P2** = förbättring som kan vänta. **P0 betyder inte automatiskt att uppgiften blockerar pågående textarbete.**
- **Behövs senast** är en separat fasgräns, inte ett kalenderdatum: **Under textarbete** (påverkar innehållsbeslut nu), **Före implementation** (innan berörd kod byggs), **Före lansering** (publicerings-/go-live-krav), **Vid nästa deploy** (innan nästa driftsättning), **Löpande** (vid relevanta ändringar), **Senare** (framtida förbättring). **Löpande + lansering** innebär både kontinuerlig kontroll och en slutlig go-live-kontroll. Saknas en faktisk tidsfrist ska ingen uppfinnas.
- **Status:** `Öppen`, `Utreds`, `Väntar på kund`, `Blockerad`, `Klar`. `Klar` kräver det bevis eller test som står i avslutskravet, inte bara skriven kod.
- **Ansvar:** person/roll som driver punkten eller måste leverera underlag; inte automatiskt tilldelad GitHub-assignee.
- Behåll ID vid statusändring. Skapa nytt ID för ny uppgift. Lägg först osorterade saker i **Inkorg**. Gör fördjupning i separat dokument/issue och länka här.
- Kontrollera datum och källor när regelverk, leverantör, pris eller teknisk implementation ändras. Inga affärsantaganden blir verifierade bara för att de står i en arbetsversion.
- **Granskning:** 2026-10-31 avser inventering och kontroll av dokument/källornas tillgänglighet, **inte** godkännande av produktclaims eller en fullständig teknisk revision.

**Arbetsordning:** Filtrera först på **Behövs senast**, därefter prioritet och beroenden. Det är alltså fullt rimligt att en P0-punkt är ett lanseringskrav och **inte** stoppar dagens utkast. Alla P0 måste ändå vara lösta eller uttryckligen hanterade före respektive grind.

## Integration och offert

| ID | Prioritet | Behövs senast | Status | Ansvar/underlag | Berör | Uppgift och avslutskrav | Källa |
|---|---|---|---|---|---|---|---|
| HP-001 | P0 | Under textarbete | Väntar på kund | Peter/Jimmy | Kalkylator, CTA | Få namn, URL, demo och kontakt till den nya hallleverantörens konfigurator; klart med verifierat underlag. | Planering 2026-10-31 |
| HP-002 | P0 | Före implementation | Blockerad | Leverantör + utveckling | Kalkylator, integration | Undersök API, iframe/embedded läge, datadelning, autentisering, licens/avtal och tekniska begränsningar; klart med dokumenterat integrationsbeslut. Beror på HP-001. | HP-001 |
| HP-003 | P0 | Under textarbete | Väntar på kund | Peter/Jimmy + leverantör | Kalkylator, köp | Klargör inköps-/slutkundspris, moms, frakt, montage, prissättning, prislista, tillgängliga halltyper, betalning samt om ”Köp” är order, avtal eller offert; klart med skriftligt affärsflöde. **Ingen e-handel beslutad.** | Planering 2026-10-31 |
| HP-004 | P1 | Före implementation | Öppen | Andreas/utveckling | Offert | Utvärdera AMP-001 Quote Flow mot Hallpartners behov och befintlig Stadsbud-referens; klart med integrations- och avgränsningsbeslut. **Inte integrerat ännu.** | [AMP][amp], [offert] |
| HP-005 | P1 | Före implementation | Väntar på kund | Peter/Jimmy + Andreas | Offert | Bestäm minsta frågemängd före kontakt och frivilliga tekniska fördjupningar; klart med godkänd frågespec. Tio dokumenterade steg är inte låsta för v1. | [reducering], [offert] |
| HP-006 | P1 | Före implementation | Öppen | Andreas/utveckling | Offert, samtliga CTA | Utforma fungerande väg för förfrågan innan wizard/kalkylator finns; klart när alla CTA har giltig destination, även på mobil. | [offert], [beslut] |
| HP-007 | P0 | Före lansering | Öppen | Andreas + Peter/Jimmy | Formulär, integritet | Fastställ laglig mottagare, faktiskt leveranssätt, personuppgiftsansvar, information/lagring och skydd mot spam; klart med godkänt flöde och testad mottagning. | [offert] |
| HP-008 | P0 | Före lansering | Öppen | Andreas/utveckling | Formulär | Säkerställ att ”Skickat” endast visas efter verifierat mottagarsvar; testa nätverksfel, dubbelklick och återförsök. | [offert], [AMP][amp] |

## Verksamhetsfakta, produkter och leverans

| ID | Prioritet | Behövs senast | Status | Ansvar/underlag | Berör | Uppgift och avslutskrav | Källa |
|---|---|---|---|---|---|---|---|
| HP-009 | P0 | Under textarbete | Väntar på kund | Peter/Jimmy | Montage, alla hallar | Bekräfta egna montörer eller externa partners, underentreprenad eller separata kundavtal samt ansvar; klart med godkänd ansvarskedja. **Externa partners är en hypotes, inte ett faktum.** | [claims], planering 2026-10-31 |
| HP-010 | P0 | Under textarbete | Väntar på kund | Peter/Jimmy | Alla hallar, process | Specificera standardleverans, tillval, transport/lossning, montage, mark/grund, bygglov, ritningar och vem som gör vad; klart med kundgodkänd ansvarsmatris/offertmall. | [claims], [offert] |
| HP-011 | P0 | Före lansering | Väntar på kund | Peter + leverantör | Om oss, produktcopy | Styrk garantier på material/arbete, garantiansvarig, omfattning, undantag och eventuell certifiering/försäkring; klart med daterade handlingar. | [claims] |
| HP-012 | P0 | Under textarbete | Väntar på kund | Peter/Jimmy | Hallöversikt och produktsidor | Bekräfta verkligt erbjudande, aktuella hallfamiljer och om t.ex. plåt/isolerat är utförande eller eget produktspår; klart med sortimentsmatris. | [claims], [URL][urlresearch] |
| HP-013 | P1 | Före lansering | Väntar på kund | Leverantör/Peter | Produktsidor | Få måttintervall, stomsystem, material, isoleringsalternativ och tekniska begränsningar per produkt; klart med daterat datablad utan egna dimensioneringsantaganden. | [claims] |
| HP-014 | P0 | Före lansering | Väntar på kund | Peter/Jimmy | Produkter, pris, kalkylator | Verifiera aktuella priser, vad som ingår, giltighet, ledtider, hyra/köp och eventuella villkor; ta bort eller tidsmärk obekräftade priser. | [claims], HP-003 |
| HP-015 | P0 | Före lansering | Väntar på kund | Peter/Jimmy | Kontakt, offert, juridik | Bekräfta juridisk avtalspart, bolagsuppgifter och ansvarig för inkommande förfrågningar; klart med kontroll mot företagsunderlag. | [claims] |
| HP-016 | P1 | Före lansering | Väntar på kund | Peter/Jimmy | Om oss, produkter | Verifiera faktisk leveransgeografi (Sverige/Norden), eventuella begränsningar och kapacitet; klart med godkänd copy och underlag. | [claims] |
| HP-017 | P1 | Före lansering | Väntar på kund | Peter/Jimmy | Referenser | Samla riktiga referensprojekt: plats/år, halltyp, storlek, Hallpartners faktiska roll, kundens godkännande; klart med minst ett publiceringsklart case eller beslutat alternativ. | [claims], [researchplan] |
| HP-018 | P0 | Före lansering | Väntar på kund | Peter/Jimmy + Andreas | Bilder, hela webbplatsen | Inventera upphovsrätt, ursprung, licenser och samtycken för legacy- och leverantörsbilder; publicera enbart verifierat material. | [claims], [researchplan] |
| HP-019 | P0 | Under textarbete | Öppen | Andreas + Peter/Jimmy | Befintlig WordPress-sajt | Granska påståenden om eget montageteam/totalentreprenad på den **nu live** webbplatsen; rätta eller neutralisera vid sakfel även före nylansering. Klart med skärmdump/URL och verifierad ändring. | [claims], HP-009 |
| HP-020 | P1 | Före lansering | Väntar på kund | Peter/Jimmy | Om oss, alla produkter | Verifiera erfarenhet, kundlöften, rådgivning, återkopplingstider och marknadsprioritering; klart när claim-registret innehåller källor eller claims strukits. | [claims] |

## Boverket, bygglov och konstruktionsinformation

> **Regelkontroll 2026-10-31:** Boverket anger att nya byggregler gäller fullt ut för **nya ärenden från 2026-07-01**. Äldre BBR/EKS kunde användas under övergången; äldre regler kan fortfarande vara relevanta i vissa redan påbörjade ärenden. Kontrollera alltid ärendetyp och datum. Ingen rad nedan är projektspecifik ingenjörsbedömning.

| ID | Prioritet | Behövs senast | Status | Ansvar/underlag | Berör | Uppgift och avslutskrav | Källa |
|---|---|---|---|---|---|---|---|
| HP-021 | P1 | Före lansering | Utreds | Teknisk sakkunnig + Andreas | FAQ, hallar | Utred aktuella snölastregler, snözoner, höjd/lokal påverkan och användbara formuleringar; klart efter sakkunniggranskning med regelversion och datum. **Använd inte EKS-karta som automatiskt gällande krav.** | [Boverket snö][snow], [nya regler][newrules] |
| HP-022 | P1 | Före lansering | Öppen | Teknisk sakkunnig | FAQ, hallar | Utred vindlast och byggplatsens förutsättningar; klart med källhänvisad generell förklaring, ej dimensioneringsvärde för kundhall. | [Boverket vind][wind] |
| HP-023 | P1 | Före lansering | Utreds | Andreas + bygglovssakkunnig | Tälthallar | Undersök när varaktiga lagertält/tälthallar bedöms som byggnad och lovpliktiga, inklusive kommunal prövning; klart med aktuell, granskad copy. | [Boverket byggnad][building] |
| HP-024 | P1 | Före lansering | Öppen | Andreas + bygglovssakkunnig | FAQ, alla hallar | Utforma allmän vägledning om bygglov, mark/grund, ansvar och kommunens prövning; undvik generella löften om bygglovsfrihet. | [Boverket byggnad][building], [URL][urlresearch] |
| HP-025 | P0 | Före lansering | Väntar på kund | Peter/leverantör + konstruktör | Alla hallar, offert | Fastställ vilka dokument, lastförutsättningar, dimensionerings-/produktbevis och ansvar som faktiskt kan styrkas för olika utföranden; klart med styrkt underlag och gränsdragning. | [claims], [Boverket snö][snow], [Boverket vind][wind] |
| HP-026 | P1 | Före lansering | Öppen | Andreas + sakkunnig | Rådgivning/FAQ | Sätt redaktionell gräns: webbplatsen ger inte slutlig dimensionering, certifiering eller platsanpassade konstruktionsbesked. Klart efter godkänd innehållsgranskning. | HP-021–025 |
| HP-027 | P2 | Senare | Öppen | Andreas | Ev. klimatlastguide | Utvärdera pedagogisk snözonsförklaring eller API-koppling **enbart som framtida idé**; kontrollera giltighet/licens och dagens regler innan beslut. | [Boverket klimatdata][climate], [nya regler][newrules] |

## Sidstruktur och innehåll

| ID | Prioritet | Behövs senast | Status | Ansvar/underlag | Berör | Uppgift och avslutskrav | Källa |
|---|---|---|---|---|---|---|---|
| HP-028 | P1 | Under textarbete | Öppen | Andreas | Sitemap, navigation | Fastställ kundens behovsbaserade sidstruktur och skilj användning (lager/ridhus/maskin) från utförande (plåt/isolering/tält); klart efter genomgång av sortiment och SEO. | [URL][urlresearch], [beslut] |
| HP-029 | P1 | Före lansering | Öppen | Andreas + Peter/Jimmy | Startsida | Slutgranska startsida v0.3 och sätt verifierad produktionscopy; godkänd arbetsriktning ≠ kundverifierad text. | [beslut], [claims] |
| HP-030 | P1 | Före lansering | Öppen | Andreas + Peter/Jimmy | /hallar/, lager, maskin, ridhus, tält | Färdigställ arbetsutkast, kontrollera varje claim mot verkligt erbjudande och koppla till CTA; klart med sidvis copygranskning. | [beslut], [claims] |
| HP-031 | P1 | Under textarbete | Utreds | Andreas | Plåthallar, isolerade hallar | **Plåthallssidan v0.1 finns som första textutkast men är inte slutligt godkänd.** Återstår: ta fram utkast för isolerade hallar, kontrollera sökintention/överlapp och faktagranska båda innan publicering; klart efter dokumenterade arbetsutkast och genomgång. | [URL][urlresearch], [beslut] |
| HP-045 | P1 | Under textarbete | Öppen | Andreas/innehållsansvarig | `docs/content/`, alla sidutkast | Samla **hela, befintliga sidutkast** i versionsmärkta filer under `docs/content/` (bl.a. startsida v0.3, hallöversikt, lagerhall, maskinhall, ridhus, tälthall och plåthall v0.1 där källtext finns). Ange källa, versionsdatum, arbetsstatus och kvarstående verifiering; samla inte bara godkännandestatus. Klart när texterna är sparade och lätta att hitta för AI-agenter; **hitta inte på saknad text och märk inget utkast som slutgodkänd produktionscopy**. | [beslut], HP-029–031 |
| HP-032 | P1 | Före implementation | Öppen | Andreas | Sidmallar och bilder | Säkerställ autentisk Hallpartner-logotyp, bildbeskärning, tillgänglighet och desktop/mobil-layout enligt Direction 02; klart efter godkänd visuell granskning. | [direction], [beslut] |

## SEO och URL-migrering

| ID | Prioritet | Behövs senast | Status | Ansvar/underlag | Berör | Uppgift och avslutskrav | Källa |
|---|---|---|---|---|---|---|---|
| HP-033 | P1 | Före implementation | Öppen | Andreas + SEO-ansvarig | Gamla/nya URL:er | Inventera WordPress-routes via crawl, Search Console, Analytics, länkar och sitemap; klart med full URL-lista och prioriterade ingångar. | [URL][urlresearch] |
| HP-034 | P0 | Före lansering | Blockerad | Andreas + SEO-ansvarig | Redirects, lansering | Besluta för varje gammal URL 200/301/410 och testa exakta 301:or till relevant nytt innehåll. Beror på HP-028 och HP-033. | [URL][urlresearch] |
| HP-035 | P1 | Före lansering | Öppen | Andreas | Metadata, internalänkning | Granska nyckelord och överlapp, titlar, canonical, sitemaps och intern länkning i godkänd struktur; klart med sidvis SEO-check. | [URL][urlresearch] |
| HP-036 | P0 | Löpande + lansering | Öppen | Andreas | Preview/produktion | Kontrollera `noindex` på preview efter förändringar och sätt ett separat godkänt lanseringsbeslut för indexering; klart med faktisk HTTP/HTML-kontroll. | [main README][mainreadme] |

## Teknik, plattform och release

| ID | Prioritet | Behövs senast | Status | Ansvar/underlag | Berör | Uppgift och avslutskrav | Källa |
|---|---|---|---|---|---|---|---|
| HP-037 | P1 | Före implementation | Öppen | Andreas/utveckling | Header, footer, Final CTA | Kontrollera AMP-002/003 och separat Final CTA i v1.1.0 mot Hallpartners Astro-kod, licens och godkänt scope; klart med testad plan, **inte antagen integration**. | [AMP][amp] |
| HP-038 | P0 | Före implementation | Utreds | Andreas/utveckling | CI, AMP-integration | Lös **Node 22** i `deploy-production.yml` vs **Node >=24** i plattformspaketet; klart efter dokumenterat kompatibilitetsbeslut och grön CI på avsedd revision. | [workflow][workflow], [AMP package][amppackage] |
| HP-039 | P0 | Före lansering | Öppen | Andreas/utveckling | Säkerhet, beroenden | Gör ny `npm audit`, triagera historiska 10 fynd inkl. kritiskt Astro-råd, besluta åtgärder och retesta; gamla siffror är inte aktuell sårbarhetsstatus. | [main README][mainreadme] |
| HP-040 | P0 | Vid nästa deploy | Utreds | Andreas/hosting | FTP, deployment | Rätta dokumentationskonflikt: workflow heter ”dry-run” men kör `mirror --reverse` **utan** `--dry-run`; verifiera faktisk deploystatus och miljö innan ändring/lansering. **Ingen deployfil ändras i detta uppdrag.** | [workflow][workflow], [main README][mainreadme] |
| HP-041 | P1 | Före implementation | Öppen | Andreas/utveckling | Layout/komponenter | Kontrollera vilka plattformskomponenter som redan finns lokalt och om reuse är lämplig innan ny kod; klart med inventering/versionspinning. | [AMP][amp] |
| HP-042 | P1 | Löpande | Öppen | Andreas/utveckling | Preview | Kontrollera visuella skillnader och regressionsrisk på mobil/desktop mot `https://hallpartner-se.preview2.inleed.com/` när kod ändrats; klart med dokumenterad granskning. | [main AGENTS][mainagents] |
| HP-043 | P1 | Före implementation | Öppen | Andreas | Dokumentation | Revidera äldre `docs/SITEMAP.md`, `docs/DESIGN_SYSTEM.md` och `docs/AI_INSTRUCTIONS.md` **i senare godkänd arbetsgren** så vision/äldre dry-run-beskrivningar inte krockar med dagens plan. | [main README][mainreadme], [direction] |
| HP-044 | P0 | Före lansering | Öppen | Andreas + Hallpartner | Lansering | Inför go-live: godkänn fakta, funktionstest, länkar, SEO/301, integritet, deployment och DNS i separat releasebeslut. Dokumentation eller prototyp är inte lanseringsgodkännande. | HP-007–043 |

## Inkorg / Nya idéer

Lägg till en rad nedan utan att behöva välja prioritet. Klassificera sedan till ett nytt HP-ID ovan; radera inte historiken utan länka till ID.

| Datum | Inskickat av | Idé/fråga | Flyttad till |
|---|---|---|---|
| – | – | _Skriv nästa idé här_ | – |

## Snabbreferens till källor

[beslut]: PROJECT_DECISIONS.md
[offert]: OFFERTFLODE.md
[mainagents]: ../AGENTS.md
[mainreadme]: ../README.md
[workflow]: ../.github/workflows/deploy-production.yml
[claims]: https://github.com/Amelio-AB/hallpartner/blob/research/pre-production-analysis/docs/research/CLAIMS_EVIDENCE_WORKING.md
[reducering]: https://github.com/Amelio-AB/hallpartner/blob/research/pre-production-analysis/docs/research/OFFERTFLODE_REDUCTION.md
[researchplan]: https://github.com/Amelio-AB/hallpartner/blob/research/pre-production-analysis/docs/research/NEXT_STEPS_WHILE_WAITING.md
[urlresearch]: https://github.com/Amelio-AB/hallpartner/blob/research/pre-production-analysis/docs/research/URL_MIGRATION_WORKING.md
[direction]: https://github.com/Amelio-AB/hallpartner/blob/feature/hall-page-prototype-v0.1/docs/research/HOMEPAGE_DIRECTION_02.md
[amp]: https://github.com/Amelio-AB/amelio-web-platform/blob/main/README.md
[amppackage]: https://github.com/Amelio-AB/amelio-web-platform/blob/main/package.json
[newrules]: https://www.boverket.se/sv/om-boverket/nyheter-aktuellt/nyheter/nu-galler-boverkets-nya-byggregler/
[snow]: https://www.boverket.se/sv/PBL-kunskapsbanken/regler-om-byggande/barformaga-stadga-bestandighet/laster/snolaster/
[wind]: https://www.boverket.se/sv/PBL-kunskapsbanken/regler-om-byggande/barformaga-stadga-bestandighet/laster/vindlaster/
[building]: https://www.boverket.se/sv/PBL-kunskapsbanken/lov--byggande/anmalningsplikt/vad-ar-en-byggnad/
[climate]: https://www.boverket.se/sv/om-boverket/oppna-data/klimatlaster-enligt-eks/
