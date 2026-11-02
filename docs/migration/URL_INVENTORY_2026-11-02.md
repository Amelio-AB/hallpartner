# Hallpartner – inventering av WordPress-URL:er 2026-11-02

> **Draft PR #5 · inget beslut att lansera · inga 301/410/308-regler eller DNS-/FTP-ändringar.**

## Verifierade observationer

[Läsande GitHub Actions-survey](https://github.com/Amelio-AB/hallpartner/actions/runs/41405561051) 2 november 2026: **alla 12 HTML-adresser i nuvarande [WordPress page-sitemap.xml](https://hallpartner.se/page-sitemap.xml) svarade HTTP GET 200** utan omdirigering. `robots.txt` pekar till `sitemap_index.xml` → `page-sitemap.xml`. Menyn innehåller elva av sidorna; `/quote-engine-test/` finns bara i sitemap. Detta bevisar inte att Search Console, historiska länkar eller CMS saknar ytterligare adresser.

**Tio adresser matchar redan Astro-routes** och bör därför preliminärt bevaras med 200, inte 301. De har fortfarande `noindex,nofollow` under utveckling och innehållet är inte slutligt kundgodkänt.

| Ursprung | Publik GET | Astro-mål | Preliminärt beslut | Funktionsgap |
|---|---:|---|---|---|
| `/` | 200 | `/` | Behåll URL | Nej |
| `/stalhallar/` | 200 | `/stalhallar/` | Behåll URL | Nej |
| `/stalhallar/lagerhall/` | 200 | `/stalhallar/lagerhall/` | Behåll URL | Nej |
| `/stalhallar/maskinhall/` | 200 | `/stalhallar/maskinhall/` | Behåll URL | Nej |
| `/stalhallar/plathall/` | 200 | `/stalhallar/plathall/` | Behåll URL | Nej |
| `/stalhallar/isolerad-hall/` | 200 | `/stalhallar/isolerad-hall/` | Behåll URL | Nej |
| `/stalhallar/ridhus/` | 200 | `/stalhallar/ridhus/` | Behåll URL | Nej |
| `/stalhallar/talthall/` | 200 | `/stalhallar/talthall/` | Behåll URL | Nej |
| `/om-oss/` | 200 | `/om-oss/` | Behåll URL | Nej |
| `/kontakt/` | 200 | `/kontakt/` | Behåll URL | Ja |
| `/offert/` | 200 | Saknas | Utred | Ja |
| `/quote-engine-test/` | 200 | Saknas | Utred | Ja |

[Maskinläsbar karta](legacy-url-map.v01.json) innehåller precis de 12 sid-URL:erna, status/proveniens och inga aktiva redirects.

## Tre frågor som måste lösas innan lansering

**1. `/offert/` – högsta prioritet.** Den nuvarande publika sidan visar ett offertformulär med måttfrågor. Astro saknar `/offert/` och AMP-001:s verkliga mottagare. Vi har inte skickat ett formulär eller verifierat att WordPress-mottagningen fungerar. Behåll kundens offertväg fram till godkänd fungerande ersättare; **redirecta inte till startsida eller kontakt som genväg**.

**2. `/kontakt/` – samma adress men försämrad funktion utan beslut.** Nuvarande WordPress har synligt kontaktformulär medan Astro visar telefon och `mailto:` utan backend. Välj och testa en verklig, kundgodkänd kontaktväg. Se HP-007/008.

**3. `/quote-engine-test/` – oavsiktligt offentlig?** Adressen gav 200 och finns i sitemap men inte i navigationen. Ta reda på vad den gör och om den har trafik/inlänkar. Besluta därefter 200, relevant 301 eller 410 med Hallpartner. Ingen regel aktiveras nu.

## Gamla media och kanoniska adressvarianter

WordPress sitemap innehåller **41 bild-LOC-referenser, varav 32 olika `/wp-content/uploads/`-URL:er**. De är inte extra HTML-sidor. [Separat JSON-lista](legacy-media-sitemap.v01.json) bevarar filadresserna, men inga bilder kopieras eller publiceras utan rättighetskontroll. Kontrollera Google Bilder/backlinks och bevara tillgängligheten eller planera exakta ersättnings-URL:er före nedstängning av WordPress.

Följande **testade** varianter får redan omdirigering i ett steg på gamla webbservern: `https://www.hallpartner.se/` → `https://hallpartner.se/`, `http://hallpartner.se/` → HTTPS, `/stalhallar` → `/stalhallar/` och `/offert` → `/offert/`. Dessa fyra observationer bevisar inte hur alla varianter behandlas på Inleed efter byte.

## Återstår – HP-033/034 ännu inte färdiga

- Exportera WordPress hela URL-lista (inklusive dolda sidor, bilagor och andra posttyper) samt Google Search Console 12–16 månader: *Sidor*, *Sökresultat per sida*, *Länkar* och sitemap.
- Kontrollera GA4/hostloggar och inkommande länkar, framför allt till `/offert/` och `/quote-engine-test/`. Kartlägg formulärens faktiska endpunkter utan att kopiera inskickade personuppgifter.
- Godkänn **200/301/410 per URL** först när relevanta mål, HTTP-status och funktioner kan bevisas. Undvik kedjor och massomdirigering till `/`.
- Separat lanseringsgrind: live-HTTP, canonical, sitemap, media, internlänkar, rätt borttagning av `noindex`, och verifierad 404-status. Behåll gamla redirects länge vid verkliga URL-flyttar.
- `/sa-gar-det-till/` är en ny Astro-route, **inte** en gammal WordPress-adress. Gamla Amelio-presentationsrutterna `/vision/`, `/projekt/`, `/roadmap/` är separata och inte påträffade i den publika WordPress-sidkartan.

**Underlag:** [nuvarande Hallpartner](https://hallpartner.se/), [Google Search Central – site moves](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [SEO-URL-plan v0.2](https://github.com/Amelio-AB/hallpartner/blob/docs/website-plan-amp-2026-10-31/docs/SEO_SITEMAP_V02.md).
