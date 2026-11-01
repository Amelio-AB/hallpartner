# Hallpartner – aktuella projektbeslut

> **Gemensamt beslutsregister · upprättat 2026-10-31.** Dokumenterar beslut om webbprojektet, **inte** bevis om Hallpartners produkter, leverans, garanti eller juridiska ansvar.
>
> Status **Slutligt beslutat** gäller ett projektbeslut inom beskrivet scope, inte kundens godkännande av varje sida. **Godkänd arbetsriktning** är en intern riktning som kan omprövas. **Preliminärt** är ett förslag som inte får behandlas som låst.
>
> **Kanonisk plats:** Nya och ändrade projektbeslut förs i **detta dokument**. [Den äldre research-beslutsloggen][researchlog] bevaras som tidsstämplad historisk källa och ska **inte** parallelluppdateras som ett konkurrerande register. Detaljerade, ännu obekräftade verksamhetspåståenden hör till [claim/evidence-underlaget][claims] och öppna frågor till [TODO.md](TODO.md).

## Teknik, plattform och arbetssätt

| ID / datum | Beslut | Motiv | Status | Beroenden / källa |
|---|---|---|---|---|
| HPD-001 · 2026-10-02 | Nya webbplatsen byggs med **Astro + TypeScript**, statisk output; slutlig domän `hallpartner.se`. | Fristående, underhållbar lösning utanför WordPress. | Slutligt beslutat | [Researchlog][researchlog], [main README][readme] |
| HPD-002 · 2026-10-02 | Preview ska vara **noindex** tills separat lanseringsbeslut. DNS och hosting hanteras separat från research. | Hindrar oavsiktlig indexering; skyddar befintlig live-sajt. | Slutligt beslutat | [Researchlog][researchlog], [main README][readme] |
| HPD-003 · 2026-10-31 (dokumenterat) | Återanvänd **Amelio Web Platform** när komponenterna passar och respektera deras kontrakt. | Delade komponenter minskar dubbel implementation, men får inte tränga undan kundkrav. | Godkänd arbetsriktning | Teknisk kompatibilitet [HP-037–041](TODO.md); [AMP 1.1.0][amp] |
| HPD-004 · 2026-10-31 (dokumenterat) | **AMP-002 Header Menu**, **AMP-003 Footer** och fristående **Final CTA** är kandidater för Hallpartner. | Befintliga, godkända plattformsprodukter. | Godkänd arbetsriktning | Hallpartner-integration ej godkänd/testad; [AMP 1.1.0][amp] |
| HPD-005 · 2026-10-31 (dokumenterat) | **AMP-001 Quote Flow** ska vara grund för framtida Hallpartner-wizard. | Återanvänd testat offertflödeskontrakt, anpassa frågor och design efter Hallpartner. | Godkänd arbetsriktning | Kundens frågespec, endpoint och GDPR kvarstår; [AMP 1.1.0][amp], [OFFERTFLODE][offert] |
| HPD-006 · 2026-10-02 | **Amelio Quote Engine** (WordPress/Elementor/PHP) ska **inte** vara teknisk motor i Astro. | Teknikspåret är avslutat; endast historiska lärdomar är användbara. | Slutligt beslutat | [Researchlog][researchlog] |
| HPD-007 · 2026-10-02 (förtydligat 2026-10-31) | **Carlstad Stadsbuds offertguide var en historisk UX-/interaktionsreferens** (steg, progress, validering, fokus och sammanfattning/ändra). Den är **inte längre styrande teknisk modell** för Hallpartner. **AMP-001 Quote Flow från Amelio Web Platform ska användas** för det nya offertflödet, enligt HPD-005; Stadsbuds frågor, payload och PHP-endpoint ska inte kopieras. | Bevarar lärdomar från tidigare arbete utan att konkurrera med den valda plattformskomponenten. | Slutligt beslutat | [Researchlog][researchlog], [AMP 1.1.0][amp], HPD-005 |
| HPD-008 · 2026-10-02 | De **tio stegen i OFFERTFLODE.md** är en detaljerad inventering, **inte** låst första konverteringsflöde. Frågor delas i före kontakt, frivilliga och senare teknik/sälj. | Minskar friktion och risken att kräva konstruktionsbesked av en ny kund. | Godkänd arbetsriktning | Kräver Peter/Jimmys säljbehov; [Researchlog][researchlog], [reducering][reduction] |
| HPD-009 · 2026-10-31 (dokumenterat) | Implementera det slutliga offertflödet **efter** att sidinnehåll och kundens informationsbehov är tydligare. | Undvik att bygga om en tung wizard när mål och frågor ändras. | Godkänd arbetsriktning | [TODO HP-004–008](TODO.md); aktuellt planeringsunderlag |
| HPD-010 · 2026-10-31 (dokumenterat) | Leverantörens nya hallkonfigurator med pris och ”Köp” är **ett separat integrationsspår**. | Köpknapp, prislogik och avtal kan inte förutsättas motsvara en offertförfrågan. | Slutligt beslutat (separat utredning) | Ingen e-handel eller orderintegration beslutad; [TODO HP-001–003](TODO.md); aktuellt planeringsunderlag |
| HPD-011 · 2026-10-31 (dokumenterat) | Arbeta fram **sitemap, sidstruktur och innehåll i text innan ny sidimplementation** påbörjas. | Fångar fel i erbjudande och navigation innan kodkostnaden uppstår. | Godkänd arbetsriktning | Befintlig preview/kod försvinner inte och är inte godkänd produktionscopy; aktuellt planeringsunderlag |

## Design

| ID / datum | Beslut | Motiv | Status | Beroenden / källa |
|---|---|---|---|---|
| HPD-012 · 2026-10-31 (dokumenterat) | **Direction 02 / Nordic Industrial** är grafisk **arbetsriktning** för nya webbplatsen. | Ersätter äldre visionspaletter som styrande ny design. | Godkänd arbetsriktning | Kundens slutgodkännande återstår; [Direction 02][direction], aktuellt planeringsunderlag |
| HPD-013 · 2026-10-31 (dokumenterat) | Aktuella tokens: Graphite `#272D31`, Deep Graphite `#202427`, Off-white `#EBEBE8`, Concrete `#D9DDD8`; grön CTA `#4E7A5B`, hover `#557D5E`. Grön allmän accent `#6C826C`; ljus text `#F4F4F0`. | Sammanhängande prototypstil med läsbar kontrast. | Godkänd arbetsriktning | [Direction 02][direction] |
| HPD-014 · 2026-10-31 (dokumenterat) | Grönt används **främst som accent och CTA**, inte som stora bakgrundsfält. | Tyngdpunkten ska ligga på hallar och innehåll. | Godkänd arbetsriktning | [Direction 02][direction] |
| HPD-015 · 2026-10-31 (dokumenterat) | Använd **Hallpartners riktiga logotyp**, inte moodboard-/AI-genererad variant. | Skyddar varumärkesidentitet. | Slutligt beslutat | Originalfil och användningsrätt ska kontrolleras; [Researchlog][researchlog], aktuellt planeringsunderlag |
| HPD-016 · 2026-10-31 (dokumenterat) | Fullbreddsbilder och eventuell overlay/gradient går kant till kant; **text/CTA inom gemensam wrapper** (preliminärt max **1220 px**), normal läsbredd för längre text **600–700 px**. Anpassa bildutsnitt och gradient för mobil. | Låter bilderna få plats utan att text och handlingar tappar linjering. | Godkänd arbetsriktning | Exakta mått prövas i UI; [Direction 02][direction], aktuellt planeringsunderlag |
| HPD-017 · 2026-10-31 (dokumenterat) | Ingen dekorativ numrering på sektioner och rubriker; numrering används när den **förklarar en faktisk process**. | Motverkar onödig dekoration. | Godkänd arbetsriktning | Aktuellt planeringsunderlag |
| HPD-018 · 2026-10-31 (dokumenterat) | Undvik mekanisk upprepning av identiska tre-kortssektioner. | Innehållets funktion ska styra layoutval. | Godkänd arbetsriktning | Aktuellt planeringsunderlag |
| HPD-027 · 2026-11-01 (visuellt godkännande) | **Ridhus och Tälthallar i Hallpartners nya Astro-uppbyggnad är visuellt godkända som arbetsversioner av Andreas.** De får tills vidare följa samma sidgrund som de tidigare accepterade Lagerhallar, Maskinhallar, Plåthallar och Isolerade hallar. | Bevara en sammanhängande design under utbyggnaden och undvik att finjustera samma grundlayout på nytt innan fler sidor är klara. | **Godkänd arbetsriktning, endast visuell granskning** | Andreas i projektchatten 2026-11-01; [Hallpartner Draft PR #5](https://github.com/Amelio-AB/hallpartner/pull/5). **Inte** kundgodkänd produktcopy, teknisk specifikation, bildrätt, AMP-integration, SEO-lansering eller merge. |

## Innehåll, sidor och produktmodell

| ID / datum | Beslut | Motiv | Status | Beroenden / källa |
|---|---|---|---|---|
| HPD-019 · 2026-10-31 (dokumenterat) | **Startsida v0.3** är godkänd som **arbetsriktning**, inte som verifierad produktionscopy. | Gör det möjligt att fortsätta strukturarbetet utan att hitta på kundfakta. | Godkänd arbetsriktning | Kundens sakgranskning; aktuellt planeringsunderlag |
| HPD-020 · 2026-10-31 (dokumenterat) | **Hallöversikten** har ett första arbetsutkast. **Lagerhall** och **maskinhall** har genomarbetade arbetsutkast. | Bevara framsteg och rätt mognadsgrad. | Godkänd arbetsriktning | Inga produktclaims godkända; aktuellt planeringsunderlag |
| HPD-021 · 2026-10-31 (uppdaterat) | **Ridhussidan** är godkänd **som arbetsversion**. **Tälthallssidan** har ett första textutkast. **Plåthallssidan v0.1 är nu framtagen som första textutkast**, men är **inte slutligt godkänd**. **Isolerade hallar återstår** att planera. | Bevarar aktuell mognadsgrad utan att ett textutkast misstas för verifierad produktionscopy. | Godkänd arbetsriktning | [TODO HP-031 och HP-045](TODO.md); uppgift om plåthall v0.1 bekräftad av Andreas 2026-10-31; fullständig text behöver arkiveras |
| HPD-022 · 2026-10-31 (dokumenterat) | Skilj **användningsområde** (lager, maskin, ridhus) från **konstruktion/utförande** (tälthall, plåt, isolering). | Samma hall kan tillhöra flera beskrivningar; undviker överlapp i navigation och formulär. | Godkänd arbetsriktning | Kräver sortiments- och SEO-granskning; [URL-arbete][url], [reducering][reduction] |
| HPD-023 · 2026-10-02 | **Verksamhetsuppgifter måste styrkas av Peter/Jimmy**; nuvarande publicerade WordPress-claims är inte bevis och legacy-bilder är inte automatiskt referenser. | Undviker fel om montage, garantier, pris, erfarenhet och leverans. | Slutligt beslutat (redaktionell regel) | [Researchlog][researchlog], [claims] |

## URL-struktur och migrering

| ID / datum | Beslut | Motiv | Status | Beroenden / källa |
|---|---|---|---|---|
| HPD-024 · 2026-10-31 (dokumenterat) | **Inte låst** till gamla WordPress-slugs; `/hallar/` föreslås som hallöversikt. | Ny informationsarkitektur ska följa användarens behov. | Preliminärt | [URL-arbete][url] förespråkade tidigare att behålla gamla routes; SEO-beslut krävs |
| HPD-025 · 2026-10-31 (dokumenterat) | Arbetsförslag: `/lagerhallar/`, `/maskinhallar/`, `/ridhus/`, `/talthallar/`. | Kortare, begripliga ämnessidor. | Preliminärt | Slutlig analys av trafik, sökintention, redirects; aktuellt planeringsunderlag |
| HPD-026 · 2026-10-31 (dokumenterat) | Varje gammal relevant URL ska utvärderas för **200/301/410** och korrekta 301:or ska finnas vid byte. **Inga omdirigeringar eller nya URL:er slutligt beslutade.** | Behåller ingångar och länkvärde, undviker 404 och irrelevanta redirects. | Slutligt beslutat (migreringsprincip) | [URL-arbete][url], [TODO HP-033–035](TODO.md) |

## Öppna avgränsningar – inte beslut

- **Montage:** uppgift om externa montagesamarbeten är **obekräftad**. Påstå inte ”egna montörer”, ”totalentreprenad” eller fast leveransomfattning utan fakta (HP-009–010).
- **Priser och Köp:** vad som visas, debiteras eller juridiskt beställs av leverantörens kalkylator är **okänt** (HP-001–003).
- **Regelverk:** snö-/vindlast, bygglov och teknisk dimensionering kräver aktuella officiella källor och vid behov sakkunnig; dokumenterade öppna frågor ersätter inte sådan prövning (HP-021–027).
- **Plattformsstatus:** Amelio Web Platform **1.1.0 är produktgodkänd i sitt repo**, men inte automatiskt integrerad eller produktionsgodkänd på Hallpartner.se. Nodekrav och CI måste granskas (HP-037–040).
- **Tidigare design:** [`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md), [`docs/SITEMAP.md`](SITEMAP.md) och delar av [`docs/AI_INSTRUCTIONS.md`](AI_INSTRUCTIONS.md) på `main` beskriver äldre visionsmaterial eller dry-run-status. Dessa **får inte** upphäva uttryckliga aktuella beslut här. Versionsstädning finns som HP-043.
- **Tidigare research:** [`DECISION_LOG.md`][researchlog] är historisk källa till valen den 2 oktober, inklusive en **äldre ljus provisorisk färgpalett**. Direction 02 är senare arbetsriktning men inte kundens slutliga varumärkesgodkännande.

## Rutin vid ändringar

1. Läs först **AGENTS.md**, detta register och **TODO.md**.
2. När en riktning beslutas eller omprövas: **uppdatera existerande HPD-ID** (eller skapa nytt vid nytt beslut); skriv datum, varför det ändrades, vem som godkänt och källlänk. Bevara ändringshistorik via Git.
3. Flytta ej verifierade faktapåståenden till claim/evidence-underlaget, och praktiska beroenden till TODO. Ändra inte ”Preliminärt” till ”Slutligt beslutat” utan explicit beslutsstöd.
4. En lokal prototyp eller passerad build är **inte** slutlig design-, affärs-, publicerings- eller lanseringsacceptans.
5. Om AGENTS.md innehåller en generell instruktion som krockar med ett nytt beslut: lös konflikten explicit i samma granskade PR; låt inte AI välja tyst.

## Källor

[researchlog]: https://github.com/Amelio-AB/hallpartner/blob/research/pre-production-analysis/docs/research/DECISION_LOG.md
[claims]: https://github.com/Amelio-AB/hallpartner/blob/research/pre-production-analysis/docs/research/CLAIMS_EVIDENCE_WORKING.md
[reduction]: https://github.com/Amelio-AB/hallpartner/blob/research/pre-production-analysis/docs/research/OFFERTFLODE_REDUCTION.md
[url]: https://github.com/Amelio-AB/hallpartner/blob/research/pre-production-analysis/docs/research/URL_MIGRATION_WORKING.md
[direction]: https://github.com/Amelio-AB/hallpartner/blob/feature/hall-page-prototype-v0.1/docs/research/HOMEPAGE_DIRECTION_02.md
[amp]: https://github.com/Amelio-AB/amelio-web-platform/blob/main/README.md
[offert]: OFFERTFLODE.md
[readme]: ../README.md
