# Hallpartner webbplats

Kodbas för Hallpartners riktiga webbplats på **https://hallpartner.se**,
vidareutvecklad från Amelios visionssajt. Migration phase 1 förbereder
preview och teknisk grund. Befintliga sidor, komponenter och bilder bevaras.
Slutligt innehåll och sidstruktur: **pending live-site inventory**.

> Fullständig projektdokumentation finns i [`docs/`](docs/) — läs den innan
> större ändringar görs. Se även [AGENTS.md](AGENTS.md) för riktlinjer till
> AI-agenter som arbetar i projektet.

## Gemensamma dokument för beslut och öppna frågor

**Läs före större arbete:** [`docs/PROJECT_DECISIONS.md`](docs/PROJECT_DECISIONS.md) är registret för **aktuella projektbeslut och deras mognadsgrad**. [`docs/TODO.md`](docs/TODO.md) är den centrala **listan över öppna frågor, blockerare och uppgifter**, med en enkel Inkorg för nya idéer.

Planeringsarbete om ny sidstruktur och copy pågår även om en **befintlig Astro-preview** redan är driftsatt. Äldre visionsfiler (`docs/SITEMAP.md`, `docs/DESIGN_SYSTEM.md`, delar av `docs/AI_INSTRUCTIONS.md`) är inte automatiskt beslutad produktionsdesign. Den tidigare [research-beslutsloggen](https://github.com/Amelio-AB/hallpartner/blob/research/pre-production-analysis/docs/research/DECISION_LOG.md) är historisk källa; ändra **projektbeslut här**, inte i parallella register. Bekräfta affärsfakta med Hallpartner innan publicering.

## Aktuell live preview

Utvecklingsversionen finns på:

**https://hallpartner-se.preview2.inleed.com/**

Detta är den gemensamma granskningsytan för projektet. AI-agenter ska vid
arbete med UI, innehåll, navigation eller responsivitet öppna relevant sida
där och granska resultatet kritiskt. Previewn är inte ett godkänt facit; den
ska användas för att hitta konkreta problem och förbättringar före fortsatt
arbete.

## Stack

- [Astro](https://astro.build) (statisk output)
- TypeScript (strict mode)
- CSS med Astro-komponenter och CSS custom properties — inget CSS-ramverk
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) för XML-sitemap
- Inget UI-ramverk (React/Vue/Svelte) används eller behövs

## Lokala kommandon

| Kommando          | Beskrivning                                        |
| ----------------- | -------------------------------------------------- |
| `npm install`     | Installerar beroenden                              |
| `npm run dev`     | Startar lokal utvecklingsserver (`localhost:4321`) |
| `npm run build`   | Bygger produktionssajten till `./dist/`            |
| `npm run preview` | Förhandsgranskar produktionsbygget lokalt          |
| `npm run check`   | Kör `astro check` (TypeScript- och mallkontroll)   |
| `npm run lint`    | Kör ESLint                                         |
| `npm run format`  | Formaterar koden med Prettier                      |

## Struktur

```text
src/
  components/   Återanvändbara Astro-komponenter
  layouts/      BaseLayout och PresentationLayout
  pages/        Filbaserad routing (se docs/SITEMAP.md)
  data/         Typad innehållsdata (navigation, copy, projekt och roadmap)
  types/        Delade TypeScript-typer
  styles/       Designsystem: tokens, typografi, utilities, global CSS
public/
  images/, logos/, icons/, videos/   Mediamappar med README om vad som behövs
  robots.txt    Noindex-konfiguration (se nedan)
docs/           Projektdokumentation (brief, designsystem, sidspecifikation m.m.)
```

## Deployment — migration phase 1

Astro bygger statiskt till dist/. Site är https://hallpartner.se:
BaseLayout skapar canonical från Astro.site, och sitemap använder samma domän.
Det påverkar metadata och XML, inte previewhosting eller DNS. /workshop/
är fortsatt undantagen från sitemap; övrig befintlig struktur bevaras.

.github/workflows/deploy-production.yml behåller befintligt lftp-flöde och
gör riktig upload vid push till main eller workflow_dispatch.
Previewmiljöns URL är https://hallpartner-se.preview2.inleed.com.
Permissions är contents: read. Bygget valideras innan artifact sparas,
och nedladdad dist/index.html kontrolleras igen före FTP.
Credentials hämtas från repository secrets FTP_HOST, FTP_USERNAME,
FTP_PASSWORD; värden ska inte ändras eller skrivas ut.

FTP-kontots angivna custom root är /domains/hallpartner.se/public_html/.
Remote target är därför ./, relativt inloggningsroten:

```text
mirror --reverse --verbose --parallel=4 ./dist/ ./
```

Ingen `--delete` används. FTP-target `./` är verifierat mot Hallpartners
document root och deploymenten är live i previewmiljön.
DNS för hallpartner.se pekar fortsatt mot befintlig WordPress och ändras inte här.
Arkivbranchen archive/vision-site-2026-10-02 ska lämnas orörd.

## Noindex-status

Preview och utvecklingsbygget ska fortsatt vara noindex. SeoHead, BaseLayout
och PresentationLayout har noindex = true som standard. Sidornas metatagg
är noindex,nofollow. robots.txt tillåter hämtning så att metataggen kan läsas;
Allow är alltså inte ett indexeringsgodkännande. Sitemap pekar på slutlig domän.
Indexering får aktiveras först vid en separat godkänd lansering.

## Nästa steg — pending live-site inventory

- Inventera nuvarande live-sajt innan nya routes, sitemap eller innehåll beslutas.
- Bedöm vilka presentationsdelar som ska återanvändas, skrivas om eller tas bort.
- Samla originalbilder i src/assets/images/legacy/ med ursprungliga filnamn;
  inventera källor och rättigheter innan optimering och användning.
- Granska live preview efter UI-ändringar och använd den som obligatorisk visuell kontrollpunkt.
- Planera senare lansering: metadata, sitemap, indexering och DNS separat.
- Granska befintliga beroenden före publicering. npm audit vid phase 1 rapporterar
  10 sårbarheter (1 moderate, 8 high, 1 critical), inklusive Astro
  GHSA-26w7-cxv4-gfx2. Ingen automatisk audit fix eller versionsändring gjordes.

## Dokumentation

Se [`docs/`](docs/) för projektbrief, sitemap, innehåll, designsystem,
sidspecifikation, komponentspecifikation och teknisk spec.
