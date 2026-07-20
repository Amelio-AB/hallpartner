# Hallpartner Vision Site

En digital presentations- och visionssajt för Hallpartner, framtagen av Amelio.
Sajten fungerar både som en presentation inför ett första kundmöte och som ett
interaktivt förslag på hur Hallpartners framtida webbplats kan upplevas.

> Fullständig projektdokumentation finns i [`docs/`](docs/) — läs den innan
> större ändringar görs. Se även [AGENTS.md](AGENTS.md) för riktlinjer till
> AI-agenter som arbetar i projektet.

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
  data/         Typad innehållsdata (navigation, copy, projekt, kunskapsbank, roadmap)
  types/        Delade TypeScript-typer
  styles/       Designsystem: tokens, typografi, utilities, global CSS
public/
  images/, logos/, icons/, videos/   Mediamappar med README om vad som behövs
  robots.txt    Noindex-konfiguration (se nedan)
docs/           Projektdokumentation (brief, designsystem, sidspecifikation m.m.)
```

## Deployment

Sajten byggs som en helt statisk Astro-site (`output: 'static'`) och kan
driftas på valfri statisk webbhosting. Domän under konceptfasen:
**hallpartner.amelio.se** (satt som `site` i `astro.config.mjs`).

```bash
npm run build
# → innehåll klart att publiceras i ./dist/
```

### Automatisk produktionsdeploy

`.github/workflows/deploy-production.yml` bygger projektet (`npm ci` +
`npm run build`) och FTP-deployar innehållet i `dist/` till
hallpartner.amelio.se. Workflowen körs automatiskt vid push till `main`,
och kan även köras manuellt via "Run workflow" (workflow_dispatch) i
GitHub Actions-fliken. FTP-uppgifter (`FTP_SERVER`, `FTP_USERNAME`,
`FTP_PASSWORD`) hämtas från repository secrets — inga uppgifter
hårdkodas i workflow-filen.

Fjärrkatalogen (`server-dir`) är satt till `./public_html/` — verifierat
som document root för hallpartner.amelio.se hos Inleed.

## Noindex-status

Sajten är för närvarande en **privat kundpresentation** och ska inte
indexeras av sökmotorer:

- `public/robots.txt` innehåller `Disallow: /` för alla user agents.
- Varje sida sätter `<meta name="robots" content="noindex,nofollow">` via
  `src/components/SeoHead.astro` (standardvärdet `noindex = true`).

### Ta bort noindex när sajten blir publik

1. Uppdatera `public/robots.txt` — ta bort `Disallow: /`.
2. I `src/components/SeoHead.astro`, ändra standardvärdet `noindex = true`
   till `noindex = false` (eller skicka `noindex={false}` explicit från
   respektive layout/sida).
3. `@astrojs/sitemap`-integrationen i `astro.config.mjs` kan behållas som den
   är — den genererar redan en korrekt `sitemap-index.xml`.

## Dokumentation

Se [`docs/`](docs/) för projektbrief, sitemap, innehåll, designsystem,
sidspecifikation, komponentspecifikation och teknisk spec.
