# AMP-006 – behovsprövning för Hallpartner (2026-11-01)

> **Status: Avvakta, återutvärdera när bild- och referensunderlag finns.**
> Detta är en **preliminär komponentbedömning**, inte ett nytt kanoniskt projektbeslut och inte en instruktion att installera eller distribuera AMP-006. Webbplatsens redan godkända besökar-Header, Hero och länkkort ska inte ändras i detta steg.

## Verifierad plattformskälla

- Produkt: **AMP-006 Expandable Card Grid**, import `@amelio/web-platform/expandable-card-grid`.
- Verifierat på skyddad `Amelio-AB/amelio-web-platform` main: full SHA **`ae06ebd9f5f94f3e75328ddac8af3a8912c1d7f0`**, privat källpaket **1.3.0**, Node >=24.
- [Produktens publika dokumentation](https://github.com/Amelio-AB/amelio-web-platform/blob/ae06ebd9f5f94f3e75328ddac8af3a8912c1d7f0/docs/products/expandable-card-grid/README.md) anger att korten renderas via `renderExpandableCardGrid`, förstärks med `enhanceExpandableCardGrid` och har separat CSS-export.
- Den samtidigt pågående [AMP-002/004/005-layout-PR #31](https://github.com/Amelio-AB/amelio-web-platform/pull/31) var **Draft och omergad vid granskningen**. Den verifierade 1.3.0-main-revisionen inkluderar alltså **inte** automatiskt PR #31:s kommande gemensamma Header-/Hero-bredd.
- Hallpartner-kodens PR #5 saknar ännu ett committat privat AMP-beroende/lockfile. Andreas har installerat äldre AMP 1.2.0 **lokalt**, men det bevisar inte att GitHub Actions i Hallpartner kan läsa privata Amelio-repot. CI:s `GITHUB_TOKEN` är i normalfallet begränsat till det egna repot. Använd ingen personlig åtkomsttoken eller credential i repo/lockfile.

## Befintlig webbplats och alternativa komponenter

| Plats/komponent i Hallpartner | Faktiskt nuläge | Bedömning |
|---|---|---|
| Startsida `/`, `HallpartnerHomePrototype.astro` | Tre bildbaserade hallkort i en redan accepterad startsideslayout. Bildkällornas kommersiella rättigheter väntar på HP-018. | **Ingen ändring nu.** AMP-006 skulle ge hoverexpansion, men behovet av extra text eller bättre navigering är inte visat. Risk för onödig rörelse och designförskjutning. |
| Stålhallar `/stalhallar/` | Två typer av **textbaserade** kort: användning (lager/maskin/ridhus), utföranden/egenskaper (plåt/tält/isolering). Klara och egna länktexter, goda innehållsgränser. | **Behåll textkorten.** Fotografier saknas; konstruktion och isolering bör inte styras av identiska dekorativa hallbilder. |
| Lagerhallar och Maskinhallar | Egna innehållssektioner och kontextuella textlänkar, noindex och visuellt accepterade av Andreas. | **Ingen AMP-006.** Ett expanderande nät är inte ett bättre sätt att läsa dessa sidors information. |
| `src/components/InternalLinkCard.astro` | Äldre, enkel semantisk länkkortkomponent från visionssidor. | **Behåll där den används.** Den har inte krav på bild, expansion eller JS. Behöver inte ersättas. |
| `src/components/ProjectGrid.astro` och `ProjectCard.astro` | Äldre visions-/demogalleristruktur; inga verifierade Hallpartner-referensprojekt har ännu kundgodkänts. | **Möjlig framtida kandidat.** Tre godkända referensbilder med olika faktiska projekt kan motivera AMP-006:s expanderande effekt. Byt inte bara för att få animation. |
| Framtida referensbibliotek | Foto- och referensplanen finns i `docs/IMAGE_PLAN.md` med HP-017/018/046 som beroenden. | **Bästa plats att testa en isolerad AMP-006-prototyp**, om projektdata, korttexter, destinationer och bilder verifierats. |

**Viktigt:** En ny komponent med fler effekter ger inte automatiskt bättre användbarhet eller SEO. Jämför alltid med statisk kortlayout och mät om fler besökare hittar rätt sida. AMP-006 gör ingen filtrering eller prisjämförelse och lämpar sig inte som ett helt produktkatalogsystem.

## När vi ska ompröva AMP-006

1. Det finns **minst tre faktiskt relevanta och lagligt användbara** hall-/projektbilder och korrekta länkmål, gärna med kundgodkända referensbeskrivningar. Detta är ett *praktiskt testvillkor*, inte ett hårt krav i AMP-produkten.
2. Den sidan har ett **visat navigationsbehov** som blir bättre av att aktiva kort får mer utrymme. Fokusera på vad besökaren ser utan hover och på en liten mobil.
3. PR #31:s status och slutlig godkänd plattformssha är kontrollerade, så att en paketuppgradering inte installerar 1.3.0 och missar kommande layoutförbättringar.
4. Hallpartners CI kan installera privat GitHub-beroende med **organisationens godkända read-only credential** (eller motsvarande säkert godkänd lösning), utan att det exponeras i loggar eller lockfil. Testa `npm ci` i GitHub Actions på exakt SHA.
5. Gör en separat noindexerad A/B-designjämförelse mellan statiska kort och AMP-006, och låt Andreas godkänna eventuell ändring innan den ersätter befintliga kort.

### Om testet väl görs

Använd en **ny separat feature-gren och Draft PR**, inte en kopierad AVAB-komponent. Den faktiska integrationen ska importera enbart de publika API:erna:

```js
import { renderExpandableCardGrid, enhanceExpandableCardGrid } from '@amelio/web-platform/expandable-card-grid';
import '@amelio/web-platform/expandable-card-grid/style.css';
```

Sidägaren står för data, bildoptimering, alt-text, tokenmappning, livscykelstädning och en innehållswrapper. Håll respektive kortlänk fungerande utan JavaScript (server-renderad HTML), kontrollera textkontrast över verkliga bilder, touch utan dubbeltryck, fokus och Tab/Escape, reducerad rörelse, lång text och 320/390/768/1280/1440px. Skapa inte Hallpartner-specifika kopior av AMP-kortens animationskod.

Befintlig Header/Hero och eventuella andra AMP-produkter byts **inte** samtidigt i detta experiment. Förändringen är reversibel genom att inte mergas förrän den är visuellt och funktionellt godkänd.

## Rekommendation / nästa steg

**Ingen installation och ingen UI-ändring nu.** Dokumentera stödet för AMP-006 som en **valfri framtida komponent** och fortsätt tills vidare med de planerade hallundersidorna och insamling av verkliga bilder. När referensbiblioteket är redo tar vi ställning till om nyttan överväger komplexiteten.

Se [bildplanen](../IMAGE_PLAN.md), [webbplatsplanen](../WEBSITE_PLAN.md) och [centrala TODO #2](https://github.com/Amelio-AB/hallpartner/pull/2) för beroenden. En preliminär komponentbedömning ska inte felaktigt markeras som färdig AMP-integration.
