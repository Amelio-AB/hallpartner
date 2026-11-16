# Lagerhallar – ny sidbrief och redaktionellt utkast v0.1

> 2026-11-01 · **Nyskrivet i Hallpartners Draft PR #5. Inte återfunnen äldre Lagerhallar v0.1 och inte kundgodkänd produktionscopy.** Verifiera erbjudande, bilder, tekniska uppgifter och aktuella kundtexter före publicering.

## Källfil och nuläge

- Primär fulltextkälla: [Astro-sidan `src/pages/stalhallar/lagerhall/index.astro`](https://github.com/Amelio-AB/hallpartner/blob/a670774ad527cb0907ec3df41978c6e1f0d8e84d/src/pages/stalhallar/lagerhall/index.astro).
- Gemensam avgränsad CSS: `src/styles/hallpartner-hall-detail.css`.
- Riktig intern noindex-route: `/stalhallar/lagerhall/`; inte en `/prototype/`-route och inte färdig för skarp lansering.
- Inga leverantörs- eller referensbilder har placerats på den här besökarvägen, eftersom rättigheterna ännu inte kontrollerats. Relevanta bilder prioriteras när underlag kommer.
- Header och Hero använder tillfällig Hallpartner-layout tills AMP-002/005 är integrerade efter godkänd plattformsrelease.

## SEO och intention

| Fält | Arbetsval |
|---|---|
| Primär sökintention | Lagerhall / lagerhallar för förvaring och logistik |
| URL / föreslagen canonical | `https://hallpartner.se/stalhallar/lagerhall/` |
| SEO title | `Lagerhallar för förvaring och logistik | Hallpartner` |
| Meta description | `Planerar du en lagerhall? Läs om förvaring, varuflöde, portar och inomhusmiljö. Få hjälp att förbereda ett första samtal om ditt lagerprojekt.` |
| H1 | `Lagerhallar – börja med förvaringen.` |
| Huvuduppgift | Hjälpa besökaren reda ut lagervolymer, hantering och framkomlighet – inte dimensionera eller lova hallutföranden |
| Gräns till Maskinhallar | Maskinhall fokuserar på maskinernas manövrering, service och arbetsytor snarare än godsflöde |

## Sektioner i det nya textutkastet

1. Hero: börja med vad som ska förvaras, hur det hanteras och var hallen planeras.
2. Lagerbehov: innehållet, varuflödet och förändringar över tid. Tre separata behovsfrågor i stället för generiska produktegenskaper.
3. Från port till förvaring: ankomst, interna gångar/hantering och åtkomst till det som används ofta.
4. Utförande: isolering och vägg-/taklösningar som frågor att undersöka, med relevanta länkar. Inga garantier om material, mått eller montage.
5. Lagerhallsspecifik FAQ: storlek, isolering och vad som påverkar projektets pris utan att ange obekräftade belopp.
6. Avslutande kontakt: berätta hur lagret ska fungera. Till dess ny `/kontakt/` är migrerad pekar CTA mot den befintliga WordPress-adressen.

## Internlänkar – faktisk implementation

| Varifrån | Till | Varför |
|---|---|---|
| Brödsmula | `/stalhallar/` | Tillbaka till hallöversikten |
| Kontext om maskiner | `/stalhallar/maskinhall/` | Besökaren behöver också maskiner/arbetsytor |
| Isoleringsavsnitt | Befintliga `https://hallpartner.se/stalhallar/isolerad-hall/` | Fördjupning när temperatur/fukt är relevant |
| Materialavsnitt | Befintliga `https://hallpartner.se/stalhallar/plathall/` | Fördjupning när plåtutförande är relevant |
| Hero och avslutning | Befintliga `https://hallpartner.se/kontakt/` | Inget falskt nativt offertflöde |

**Kvar före lansering:** kundverifierat sortiment/leveransomfattning, godkända hallbilder, säker ny kontaktmottagning, migrationskontroll inklusive nuvarande WordPress-route, samt testad AMP-integration.

Ingen hänvisning från intern webbplats till ny `/offert/` innan AMP-001 och verklig mottagare fungerar.
