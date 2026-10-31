# AMP 1.2.0 – integrationsförslag för Hallpartner

> 2026-10-31 · Teknisk granskning och rekommenderad implementation. **Inte en färdig komponentintegration.** [PR #3](https://github.com/Amelio-AB/hallpartner/pull/3) innehåller testad färgkonfiguration och en Node 24-baseline, inte AMP-routes.

## Exakt granskad plattform

- Paket: `@amelio/web-platform`, `package.json` version **1.2.0**, privat, Node **>=24**.
- Källrevision: **`763d2b1eb3ed73788bc9adf1f157a15575ba521e`**.
- [Post-merge-CI](https://github.com/Amelio-AB/amelio-web-platform/actions/runs/41182265432): push på main, samma SHA, completed/success.
- En publicerad v1.2.0 Release-tagg har inte verifierats här. Använd inte ett antaget taggnamn eller flytande main som installationspin.

Källor: [package.json](https://github.com/Amelio-AB/amelio-web-platform/blob/763d2b1eb3ed73788bc9adf1f157a15575ba521e/package.json), [AMP-002](https://github.com/Amelio-AB/amelio-web-platform/blob/763d2b1eb3ed73788bc9adf1f157a15575ba521e/docs/products/header-menu/README.md), [AMP-004](https://github.com/Amelio-AB/amelio-web-platform/blob/763d2b1eb3ed73788bc9adf1f157a15575ba521e/docs/products/signature-hero/README.md), [AMP-005](https://github.com/Amelio-AB/amelio-web-platform/blob/763d2b1eb3ed73788bc9adf1f157a15575ba521e/docs/products/page-intro-hero/README.md).

## Återanvändning utan dubbla system

| Befintligt material | Rekommenderad hantering |
|---|---|
| Main: `Header.astro`, `Hero.astro`, BaseLayout/PresentationLayout | Låt befintliga routes vara oförändrade. Importera inte den gamla headern eller heron i AMP-prototypens shell. Gamla komponenter kan arkiveras senare när inga aktiva sidor använder dem. |
| PR #1: `ProductLayout.astro` | Återanvänd ansvarsfördelningen för SEO, dokumentstruktur, skip-länk och huvudinnehåll. Den importerar egen SiteHeader/SiteFooter och ska därför inte kapsla en extra AMP-header. |
| PR #1: `HallTemplate.astro` | Behåll användbara separata sektioner och typad data som kandidater. Gör inte den fasta ordningen behov/scope/kostnad/process/FAQ/CTA till krav för alla produktsidor. |
| PR #1: PageHero och SiteHeader | Historiska alternativ, inte ett andra aktivt Hero-/Header-system på samma sida som AMP. |
| Prototypgren: Direction 02 och HomepagePrototype | Bevara historisk komposition och tokens. Demo-copy är inte kundcopy och är inte styrkt som startsida v0.3. |
| AMP-003 Footer / Final CTA | Nästa separat utvärdering. En avslutande CTA är valfri och ska inte duplicera kontaktsektionen. API och faktisk kundintegration återstår att granska/testa. |
| AMP-001 Quote Flow | Senare integration efter frågespecifikation och mottagarflöde. Inte del av första Hero-testet. |

## Rekommenderat hostansvar

Bygg ett separat Astro-shell för prototyproutes. Shell äger dokumenthuvud, noindex, skip-länk, en navigationsadapter och ett main-element. Hero-typ väljs uttryckligen i siddata, exempelvis `signature` eller `intro`; URL-djup styr inte detta.

Använd de publika exporterna, inte kopior eller interna sökvägar:

```ts
import { mountHeaderMenu } from '@amelio/web-platform/header-menu';
import '@amelio/web-platform/header-menu/style.css';
import { renderSignatureHero } from '@amelio/web-platform/signature-hero';
import '@amelio/web-platform/signature-hero/style.css';
import { renderPageIntroHero } from '@amelio/web-platform/page-intro-hero';
import '@amelio/web-platform/page-intro-hero/style.css';
```

Detta visar API-kontraktet, inte en redan installerad importkedja i Hallpartner. `mountHeaderMenu` körs i webbläsaren; Hero-renderarna körs vid Astro-rendering. Endast deras validerade, escapade utdata får gå till `set:html`. Låt inte siddata, CMS-HTML eller andra strängar passera samma gräns.

Båda Hero-renderarna skapar en H1. Shell och sidans övriga sektioner ska inte lägga till ytterligare H1. Media behöver explicita dimensioner och alt-text; dekorativa bilder kan ha tom alt. Sidans bilder och innehåll tillhör Hallpartner, inte plattformens showroom.

### AMP-004 med transparent Header

Välj `classic-dropdown` eller `classic-mega-menu`. Montera AMP-002 med `overlayHero: true`, explicit `heroTone` och `heroElement` som pekar på **den renderade Hero-sektionen**, inte Astro-omslaget eller en liknande tom behållare.

AMP-002 ska ensam hantera navigation, synlighet och scrolltillstånd. Lägg inte till en konkurrerande scroll-lyssnare för en egen header. Shell tillför höjdtoken `--ah-header-clearance` när headerhöjden avviker från plattformens dokumenterade standard.

### AMP-005 med solid Header

Använd `overlayHero: false` och inget overlay-heroElement. Reservera den verkliga fixerade Header-höjden **en gång** före huvudinnehållet. CSS-fallbacken ska finnas i den serverrenderade sidan, innan JavaScript är klart. Standardkontraktet anger 4.875rem desktop och 4.35rem mobil, men logotyp, text och lokal CSS kan ändra behovet.

Ett eventuellt ResizeObserver får förfina samma höjdvärde; det ska inte skapa en andra padding. Kontrollera fontladdning, textzoom och brytpunkter innan måttet betraktas som fastställt.

### Reservnavigation och livscykel

AMP-002 stöder inte interaktiv navigation utan JavaScript. Serverrendera därför en enkel navigationsfallback från samma menydata. Den ska finnas kvar även om JavaScript-filen misslyckas att ladda eller mount kastar ett fel. Göm/ersätt den först efter lyckad montering, så att bara ett navigationssystem är aktivt och fokuserbart åt gången. Enbart `noscript` täcker inte misslyckad JavaScript-laddning.

Undvik ännu en specialbyggd mobilmeny med egna scrollregler som permanent parallell lösning. AMP-002:s dialog och fokusåterställning ska användas efter enhancement. Om Astro-klientnavigering senare införs måste instansen förstöras med `destroy()` vid relevant livscykel, inte monteras flera gånger.

## Grafisk anpassning i kundens CSS

Lägg plattformens styles före kundens scoped överstyrningar. Behåll neutral avgränsning, exempelvis en Hallpartner-rotklass. Ändra inte plattformens interna kod.

| Område | Granskad standard | Kundens anpassning att testa |
|---|---|---|
| Wrapper | Båda Hero använder upp till 90rem och egna sidopaddings. | Gemensam, dokumenterad rail på preliminärt max 1220px. Kontrollera faktisk textkant och gutter i Header, Hero och sidsektioner, inte bara max-width-värdet. |
| Hero-färger | Semantiska `--ah-bg`, `--ah-text`, `--ah-accent`, `--ah-accent-text`. | Direction 02 via extern CSS. Behåll grönt främst för CTA. |
| Signature-overlay | Hårdkodade grönaktiga gradienter i plattformens CSS. | Grafitbaserad gradient som prövas mot verklig bild och separat mobilutsnitt. Enbart palettokens ändrar inte denna gradient. |
| Emphasis | Georgia-kursiv i båda Hero-komponenterna. | Använd inte emphasis slentrianmässigt; håll Inter-riktningen genom tillåten kund-CSS när emphasis behövs. |
| Intro-bild | Roterad dekorativ pseudoyta, skugga och bildkant. | Ta bort onödig rotation/skugga i scoped kund-CSS. Behåll själva bildinnehållet. |
| Knappar | Cirka .93/.94rem, vikt650, hover-förflyttning. | Testa Hallpartners 8px-radie och lugn hover. Normalstor text ska inte bero på äldre prototypens undantag för stor fet text. |
| Fokus | Plattformen använder bl.a. currentColor för fokus. | Kontrollera separat mot omgivande yta. Godkänd textkontrast bevisar inte att fokusringen syns. |

Källor: [Signature CSS](https://github.com/Amelio-AB/amelio-web-platform/blob/763d2b1eb3ed73788bc9adf1f157a15575ba521e/src/signature-hero/style.css) och [Intro CSS](https://github.com/Amelio-AB/amelio-web-platform/blob/763d2b1eb3ed73788bc9adf1f157a15575ba521e/src/page-intro-hero/style.css).

### Färgförberedelse i PR #3

`src/config/hallpartner-brand.ts` bevarar samtliga nio profilfärger och mappar AMP-002:s publika roller `headerBg`, `headerText`, `submenuBg`, `submenuText`, `accent`, `ctaText`. Den har ingen import till befintliga sidor.

Separat knapptexttoken `#FFFFFF` används i förslaget: `#F4F4F0` mot CTA-grönt ger cirka 4.472:1, mot hover cirka 4.250:1. Vitt ger cirka 4.931:1 respektive 4.686:1. De sju testerna jämför utan avrundning. Den äldre Direction 02-prototypen hade 19px/700 och ska inte därför beskrivas som generellt underkänd; den nya mappningen undviker att mindre plattformsknappar blir beroende av stor-text-undantaget.

[W3C:s kontrastförklaring](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) skiljer på 4.5:1 för normal text och 3:1 för stor text. Tester av opaka färgpar är inte en full tillgänglighetsgranskning eller bildkontrastmätning.

### CSP

Hero-renderarnas valfria `theme` och bildens `position` ger inline-style. Lämna dessa props utanför vid strikt policy och använd externa kundregler för färg/objektposition. Försvaga inte CSP som snabb lösning. Granska också AMP-002:s runtime och den verkliga serverpolicyn; Hero-valet i sig bevisar inte full CSP-kompatibilitet. Inleed-svarens faktiska CSP har inte kunnat verifieras här.

## Designjämförelse: startsida v0.3 kontra AMP-004

| Fråga | v0.3 enligt Andreas överlämning | AMP-004 enligt granskad kod |
|---|---|---|
| Komposition | Mörk yta, text till vänster, separat stor hallbild till höger. | Bakgrundsbild kant till kant, text ovanpå med gradient. |
| Läsbarhet | Texten ligger på separat yta. | Kräver granskning mot bildens ljusa och mörka partier. |
| Bildutsnitt | Separat bildyta kan bevara hallens form. | Cover-beskärning varierar mer med skärmens format. |
| Återanvändning | Bevara tidigare arbete; exakt original måste återfås. | Godkänd plattformskomponent, men innebär annan komposition. |

**Rekommendation:** behåll v0.3:s delade huvudkomposition som utgångspunkt. Prova AMP-004 separat och på ridhus där fullbredd redan är uppgiven riktning. AMP-005:s bildvariant kan också utvärderas mot en delad komposition, men är inte automatiskt en exakt ersättning för v0.3.

Detta är en jämförelse av uppgiven komposition och komponentkod, **inte en genomförd visuell A/B-granskning**. Originalets fulltext och en åtkomlig rendering saknas. Inget designbyte har gjorts.

## Node, privat paket och låsfil

Den befintliga sajten har faktiskt passerat `npm ci`, check, lint och build på **Node v24.22.1** i [readiness-körningen](https://github.com/Amelio-AB/hallpartner/actions/runs/41183991431). Det är en baseline utan installerat AMP-paket. Ordinarie CI använder fortfarande 22.12.0 och FTP-workflow Node22; de är inte ändrade.

Nästa paketsteg kräver autentiserad läsbehörighet till plattformsrepot i den miljö som kör npm. GitHub-connectorns läsbehörighet i chatten är inte samma sak som autentisering för lokal Git eller GitHub Actions. [GitHubs dokumentation](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication) beskriver GITHUB_TOKEN:s repositoriespecifika behörighet. Anta inte att Hallpartners vanliga token når ett annat privat repo.

Rekommenderad installationsgrind:

1. Använd en godkänd behörighetslösning med minsta nödvändiga läsåtkomst, exempelvis organisationsstyrd kortlivad GitHub App-token. Ingen hemlighet i Git-URL, källkod, låsfil eller logg. Behörigheter/secrets ska inte skapas som sidoeffekt av detta arbete.
2. Installera den granskade fullständiga SHA:n med Node24. Generera `package-lock.json` med npm i riktig miljö; skriv inte ett antaget låsfilobjekt för hand.
3. Kör en ren `npm ci` på arbetsgrenen med samma behörighetsmodell som kommande CI. Kontrollera faktisk låsfil, publika importer, TypeScript och licens/scope.
4. När detta är grönt: samordna Node24 i ordinarie kontroll-/byggmiljöer som separat granskad ändring. Låt FTP-target, triggers, uploadbeteende och hemligheter vara oförändrade. Ingen deployment följer automatiskt av att baseline är grön.

I den aktuella sessionen misslyckades lokal Git-åtkomst med DNS-upplösning av github.com. Connectorn kunde läsa koden, men någon autentiserad ren paketinstallation genomfördes inte. Inga kärnfiler har kopierats in som ett alternativt paket och ingen låsfil har fabricerats.

## Avgränsad prototyp när installationsgrinden är löst

Föreslagna, **ännu inte skapade**, routes:

- `/prototype/amp/signature/`: AMP-002 + AMP-004, explicit demonstrationsmärkning.
- `/prototype/amp/intro/`: AMP-002 + AMP-005 utan bild, solid header.
- `/prototype/amp/intro-image/`: samma intro med separat bild om godkänt material finns.

Använd neutral teknisk testtext, inte nya påstådda originalutkast eller showroom-identitet. Godkända Hallpartner-bilder föredras; en layoutillustration måste märkas som demonstration och får inte visas som referensprojekt. Behåll `/` orörd.

Före prototypgodkännande: check/lint/build, aktuell audit, en H1, en aktiv navigation, giltiga CTA, noindex och sitemap-undantag. Testa 320/390/768/1280/1440px, textzoom, JavaScript av/blockerat, tangentbord, Escape/fokusretur, mobil dialog, scroll över Hero-gränsen, reducerad rörelse, verklig bildkontrast och sidopaddings. Plattformens egen gröna CI ersätter inte dessa hosttester.

Visuell kontroll i Inleed görs först efter ett separat godkänt deploymentsteg. Fram till dess ska lokala eller artifactbaserade resultat uttryckligen märkas som sådana.
