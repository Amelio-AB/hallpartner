# Architecture / Foundation v0.1

> **Status:** Implementerad arbetsgrund på branch `feature/architecture-foundation-v0.1`.
>
> Inte godkänd för merge till `main` förrän build/check/lint och visuell preview har granskats.

## Mål

Skapa en produktionsnära sid- och komponentarkitektur som kan fyllas med verifierat Hallpartner-innehåll när Peter/Jimmy återkommer.

Grunden ska kunna utvecklas utan att:

- gammal visionscopy blir produktionscopy
- gamla CSS-regler styr den nya sajten
- sidinnehåll hårdkodas i komponenter
- demo-innehåll misstas för verifierad verksamhetsfakta

## Arkitektur

```text
src/
├── components/
│   ├── cards/
│   ├── navigation/
│   ├── sections/
│   ├── seo/
│   └── ui/
├── config/
├── content/
│   ├── halls/
│   ├── references/
│   └── knowledge/
├── layouts/
│   └── ProductLayout.astro
├── templates/
│   ├── HallTemplate.astro
│   └── ReferenceTemplate.astro
├── pages/
│   └── prototype/
└── styles/
    └── foundation/
```

Befintliga visionskomponenter lämnas kvar tills nya produktionsmotsvarigheter är granskade.

## Ansvar per lager

### Routes

`src/pages/`

Bestämmer URL och hämtar rätt content/template.

Routes ska vara tunna.

### Content

`src/content/`

Redaktionell data för publika sidtyper.

Content collections ger schemasäkring och TypeScript-typer.

Statusfält:

- `placeholder`
- `draft`
- `verified`

### Templates

`src/templates/`

Bestämmer informationsordningen för en sidtyp.

v0.1:

- `HallTemplate`
- `ReferenceTemplate`

### Components

Små återanvändbara gränssnittsmönster och kompletta informationssektioner.

v0.1 grupperar komponenter efter ansvar:

- `ui`
- `navigation`
- `cards`
- `sections`
- `seo`

### Layout

`ProductLayout.astro`

Sköter:

- HTML-ram
- metadata
- fontladdning
- header/footer
- skip link
- prototype-banner

Den gamla `BaseLayout` och `PresentationLayout` lämnas orörda tills den nya grunden är godkänd.

### Config

`src/config/site.ts`

Global webbkonfiguration:

- site name
- framtida primärnavigation
- CTA
- separat prototype-navigation

### Styles

`src/styles/foundation/`

Den provisoriska grafiska riktningen v0.1 ligger bakom semantiska tokens.

Ingen komponent ska vara beroende av moodboardens exakta hexvärden.

## Navigation v0.1

Preliminär produktionsnavigation:

- Hallar
- Så går det till
- Referenser
- Kunskap
- Om Hallpartner
- CTA: Få offert

Kontakt är separat sekundär handling.

Detta är en arkitekturhypotes och kan ändras efter kundsvar.

## Prototyper

Noindexade routes:

- `/prototype/foundation/`
- `/prototype/hall/exempel-lagerhall/`
- `/prototype/reference/exempelprojekt/`

Alla `/prototype/` exkluderas från sitemap.

Demo-innehåll är tydligt märkt som placeholder och får inte återanvändas som verifierad Hallpartner-copy.

## Logotyp

`BrandLogo.astro` använder tills vidare befintlig repo-asset:

`/images/hallpartner-logo.png`

Detta är temporärt.

Slutlig implementation ska använda godkänd original-SVG från Hallpartner.

Den manuellt inverterade printscreen-filen i legacy får inte användas som produktionslogotyp.

## Design v0.1

Se:

`docs/research/DESIGN_DIRECTION_V0.1.md`

Inter och den ljusa moodboard-paletten används tills vidare.

Slutlig grafisk profil kan bytas utan att templates eller content schemas behöver skrivas om.

## Nästa arkitektursteg efter granskning

När v0.1 är godkänd:

1. besluta om komponentnamn och mappstruktur ska behållas
2. skapa produktionsroute för hallöversikt
3. skapa referensöversikt
4. skapa knowledge/article template först när innehållsbehov är verifierat
5. skapa kontakt/offert-skelett
6. ersätt demo-data med verifierat content
7. ta bort eller arkivera visionskomponenter först när nya motsvarigheter täcker behoven

## Ej i v0.1

- färdig startsida
- produktionscopy
- slutlig design
- riktig offertwizard
- backend
- CMS
- kundportal
- prisberäkning
