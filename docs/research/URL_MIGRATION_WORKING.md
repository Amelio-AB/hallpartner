# URL-migrering – arbetsinventering

> **Status:** Preliminär karta. Slutligt beslut kräver Search Console/Analytics och full crawl innan WordPress stängs.
>
> Grundprincip: behåll befintliga URL:er när innehållet har en naturlig efterföljare. Ändra inte fungerande slugs bara för att Astro gör det enkelt.

## Publika huvud-URL:er verifierade på nuvarande sajt

| Nuvarande URL | Nuvarande funktion | Preliminärt migrationsbeslut | Blockerare |
|---|---|---|---|
| `/` | Startsida | Behåll | Ny startsidesstrategi |
| `/stalhallar/` | Översikt stålhallar | Behåll | Produktmodell måste verifieras |
| `/stalhallar/lagerhall/` | Lagerhall | Behåll | Prioritet/innehåll verifieras |
| `/stalhallar/maskinhall/` | Maskinhall | Behåll | Prioritet/innehåll verifieras |
| `/stalhallar/plathall/` | Plåthall | Behåll tills motsatsen är beslutad | Risk för överlapp med andra produktsidor |
| `/stalhallar/isolerad-hall/` | Isolerad hall | Behåll tills produktmodellen är beslutad | Isolering är egenskap snarare än ren användningskategori |
| `/stalhallar/talthall/` | Tälthall | Behåll | Faktiskt erbjudande/prioritet |
| `/stalhallar/ridhus/` | Ridhus | Behåll/utvärdera navigation | Affärsprioritet |
| `/om-oss/` | Bolag/team | Behåll | Verifierad företags- och erfarenhetscopy |
| `/kontakt/` | Lågtröskelkontakt | Behåll | Kontaktflöde |
| `/offert/` | Offertförfrågan | Behåll | Ny wizard |

## Observerade SEO-/innehållsrisker att hantera vid migrering

### Produktöverlapp

Nuvarande sajt blandar användningskategorier och utföranden:

- lagerhall
- maskinhall
- ridhus
- plåthall
- isolerad hall
- tälthall

Exempel: en lagerhall kan samtidigt vara plåthall och isolerad hall.

Slutsats: URL:erna bör inte tas bort för tidigt, men framtida informationsarkitektur måste ge varje sida en tydlig sök-/kundintention.

### Claims på befintliga sidor

Flera URL:er innehåller obekräftade påståenden om:

- montage
- Norden
- garanti
- helhetslösning
- pris
- erfarenhet

Migrering får inte bli en automatisk copy-paste.

### Bygglov

Nuvarande maskinhallssida innehåller generaliserade bygglovspåståenden. Sådant ska inte migreras oförändrat.

### Pris

Prisuppgifter bör få:

- datum
- scope
- ansvarig ägare
- rutin för omkontroll

## Före lansering krävs en komplett URL-karta

Komplettera med:

1. WordPress-export/crawl
2. Google Search Console – indexerade URL:er och landningssidor
3. Analytics – trafik och konvertering per URL
4. inkommande länkar
5. gamla URL:er som inte längre finns i navigation
6. bild-URL:er med värdefulla externa länkar vid behov

Varje gammal URL ska därefter få exakt ett beslut:

- **200 – behåll samma URL**
- **301 – närmaste relevanta nya innehåll**
- **410 – endast om innehållet verkligen ska bort och saknar ersättare**

Undvik generella redirects av allt gammalt till startsidan.

## Tekniskt

Astro-repot använder redan:

- slutlig `site: https://hallpartner.se`
- trailing slash
- XML sitemap
- canonical från `Astro.site`

Preview ska fortsatt vara noindex fram till separat lanseringsbeslut.
