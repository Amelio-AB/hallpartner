# Prompt till Astra/Codex — Hallpartner homepage v0.2

Du arbetar i repot:

`Amelio-AB/hallpartner`

Arbeta på branch:

`feature/architecture-foundation-v0.1`

## Uppgift

Implementera en **noindexad startsidesprototyp v0.2** utifrån den valda Figma-riktningen.

Målet är att skapa en sida som känns specifik för Hallpartner och inte som en generisk AI-genererad B2B/SaaS-sida.

Implementera först som:

`/prototype/start-v02/`

Ersätt **inte** `/` ännu.

## Läs först — obligatoriskt

Läs i denna ordning innan du ändrar kod:

1. `AGENTS.md`
2. `README.md`
3. `.codex/skills/hallpartner-web-art-direction/SKILL.md`
4. `docs/research/FIGMA_ASTRO_IMPLEMENTATION_BRIEF.md`
5. `docs/research/DESIGN_DIRECTION_V0.1.md`
6. `docs/research/DECISION_LOG.md`
7. `docs/research/CLAIMS_EVIDENCE_WORKING.md`

Skillen `hallpartner-web-art-direction` ska aktivt styra ditt arbete.

## Figma — visuell source of truth

Figma-fil:

https://www.figma.com/design/NJXa3fWrP7FEPKjZPLpB4d/Hallpartner-%25E2%2580%2594-Web-Design

Använd Figma-integration/design context, inte bara en screenshot.

Valda frames:

### Desktop

Frame:

`SELECTED — Homepage v0.1 / Editorial Technical`

Node ID:

`5:2`

### Mobile

Frame:

`SELECTED — Homepage v0.1 / Mobile`

Node ID:

`5:88`

Figma-filen är visuell source of truth för den här prototypen, men affärsclaims i Figma är inte automatiskt verifierade fakta.

## Teknisk riktning

Behåll projektets stack:

- Astro
- TypeScript strict
- static output
- vanlig HTML/CSS
- Astro Image för lokala bilder
- inget React/Vue/Svelte
- minimalt JavaScript
- WCAG 2.2 AA

Använd befintlig foundation där den hjälper, men tvinga inte Figma-designen in i gamla generiska section-komponenter.

## Det som ska bevaras från Architecture/Foundation v0.1

Bevara principerna bakom:

- `src/content.config.ts`
- content collections
- `placeholder / draft / verified`
- `src/config/`
- SEO/noindex
- sitemap-exkludering för `/prototype/`
- semantiska design tokens
- thin routes
- Astro Image
- separation mellan content och presentation

## Det som INTE är låst

Följande komponenter är prototyper, inte visuella kontrakt:

- `PageHero.astro`
- `ScopeSection.astro`
- `ProcessSection.astro`
- `CostDriversSection.astro`
- `FAQSection.astro`
- `CTASectionV2.astro`
- `HallTemplate.astro`
- `ReferenceTemplate.astro`

Ändra, ersätt eller komplettera dem om den valda Figma-kompositionen kräver det.

Skapa inte en ny generell komponent om mönstret bara används en gång.

## Viktig layoutregel

Undvik den gamla modellen:

```
<section>
  <div class="container">
    ...
  </div>
</section>
```

som universallösning.

Den nya sidan ska använda flera spatiala lägen när designen kräver det:

- full-bleed
- wide
- content
- reading-width
- asymmetrisk split
- technical rail
- dense information strip
- edge alignment

En smal centrerad content-wrapper får inte styra hela sidan.

## Ingen dekorativ numrering

Den publika sidan får inte använda dekorativa sektionsnummer.

Förbjud exempel:

- `01 / BEHOV`
- `02 / PROJEKT`
- `03 / ANSVAR`
- dekorativa `01 02 03 04` framför halltyper eller listor
- påhittade projektnummer som endast används som designgrepp

Nummer får endast användas när de representerar riktig information, exempelvis:

- mått
- årtal
- antal
- verifierat projektnummer
- pris
- tidsperiod

## Visuell riktning

Kombinationen ska vara:

- editorial / architectural scale
- technical / industrial clarity
- selective human credibility

Viktiga drag:

- byggnaden får stor fysisk närvaro
- tekniska fakta integreras i layouten
- informationstäthet varierar genom sidan
- stora bilder får bryta normal contentbredd
- tunna regler/linjer kan strukturera fakta
- små tekniska labels kontrasteras mot större rubriker
- verkligt material prioriteras framför dekorativa illustrationer
- asymmetri används när den förbättrar kompositionen

## Anti-AI-regler

Undvik som default:

- tre identiska cards på rad
- icon + heading + paragraph-kort
- centered eyebrow + stor rubrik + ingress + två CTA som återkommande sektion
- zig-zag bild/text/bild/text
- pill-former överallt
- samma border-radius på allt
- samma section-padding genom hela sidan
- dekorativa gradients/blobbar
- glassmorphism
- samma wrapperbredd på alla sektioner
- att alla sidor byggs av samma sekvens sections

Om första implementationen fortfarande känns som en AI-template: gör om kompositionen innan du rapporterar klart.

## Innehållssäkerhet

Detta är fortfarande en prototyp.

Använd bara:

1. verifierad information som redan finns i repot, eller
2. tydligt märkt placeholder/demo-copy.

Hitta inte på Hallpartner-fakta.

Anta inte som verifierat:

- leveransomfattning
- montageupplägg
- garantier
- erfarenhetsår
- geografisk täckning
- certifieringar
- partners
- projektdata
- priser
- ledtider

När Figma visar exempelvärden ska de förbli tydligt demo/placeholder i prototypen.

## Bilder

Använd befintliga Hallpartner/legacy-bilder endast som prototypmaterial där det är lämpligt.

Behandla dem inte automatiskt som verifierade Hallpartner-referensprojekt.

Den manuellt inverterade printscreen-loggan i legacy är **inte** original och ska inte användas som produktionslogotyp.

Befintlig repo-logotyp kan användas temporärt tills godkänd original-SVG finns.

## Header

Utgå från Figma-kompositionen och den preliminära navigationen:

- Hallar
- Så går det till
- Referenser
- Kunskap
- Om Hallpartner
- CTA: Få offert

Navigationen är fortfarande en hypotes. Hårdkoda den inte på flera platser; använd config.

## Responsivitet

Desktop och mobile har separata Figma-frames.

Implementera inte mobile som en mekanisk vertikal stapling av desktop.

Bevara:

- informationshierarki
- bildens betydelse
- tekniska fakta
- CTA-prioritet

men komponera om där mobilen kräver det.

Kontrollera minst:

- 390px
- 768px
- 1024px
- 1440px+

Ingen horisontell overflow.

## Tillgänglighet

Minimikrav:

- semantisk headingstruktur
- endast en H1
- tangentbordsnavigation
- synlig focus
- tillräcklig kontrast
- korrekt alt-text
- dekorativa element ska inte ge skärmläsarbrus
- klickytor ska fungera på mobil
- respektera `prefers-reduced-motion`

## Arbetsmetod

1. Läs all obligatorisk dokumentation.
2. Läs Hallpartner-skillen.
3. Hämta Figma design context för node `5:2` och `5:88`.
4. Granska befintlig foundation innan ny kod skapas.
5. Planera vilka befintliga delar som:
   - kan återanvändas
   - behöver anpassas
   - bör ersättas
6. Implementera `/prototype/start-v02/`.
7. Kör:
   - `npm run check`
   - `npm run lint`
   - `npm run build`
8. Starta lokal preview/devserver.
9. Jämför implementationen visuellt mot båda Figma-framerna.
10. Gör en creative-director self-review enligt skillen.
11. Justera innan du rapporterar klart.

## Ändra inte

- deployment secrets
- DNS
- FTP-target
- arkivbranch
- nuvarande produktionsroute `/`
- WordPress
- Amelio Quote Engine
- offertbackend

Implementera inte offertwizarden i denna uppgift.

## Definition of Done

Uppgiften är inte klar bara för att sidan bygger.

Den är klar när:

- prototype-routen fungerar
- desktop ligger nära Figma-kompositionen
- mobile ligger nära Figma-kompositionen
- sidan inte styrs av en universell smal wrapper
- dekorativ numrering saknas
- generic card repetition är undviken
- inga obekräftade claims har smugit in
- TypeScript/Astro check passerar
- lint passerar
- build passerar
- resultatet har granskats visuellt
- du har identifierat eventuella avsiktliga avvikelser från Figma

## Slutrapport

Rapportera kort:

1. vilka filer du ändrade
2. vilka komponenter du återanvände
3. vilka komponenter du ersatte/skapade och varför
4. resultat av check/lint/build
5. vilka Figma-avvikelser som är avsiktliga
6. vad du fortfarande bedömer behöver visuell justering

Gör inga commits eller pushar om inte användaren uttryckligen ber om det.
