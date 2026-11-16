# Maskinhallar – ny sidbrief och redaktionellt utkast v0.1

> 2026-11-01 · **Nyskrivet i Hallpartners Draft PR #5. Inte återfunnen äldre Maskinhallar v0.1 och inte kundgodkänd produktionscopy.** Leverantörer, kundens faktiska projektansvar och tekniska produkter behöver verifieras.

## Källfil och nuläge

- Fulltextkälla: [Astro-sidan `src/pages/stalhallar/maskinhall/index.astro`](https://github.com/Amelio-AB/hallpartner/blob/a670774ad527cb0907ec3df41978c6e1f0d8e84d/src/pages/stalhallar/maskinhall/index.astro).
- Gemensam avgränsad CSS: `src/styles/hallpartner-hall-detail.css`.
- Riktig intern noindex-route: `/stalhallar/maskinhall/`, inte äldre prototyp.
- Sidans mörka Hero och följande sektioner är en redaktionell arbetsversion före AMP-005. Den nya plattformens Header- och Hero-bredd ska samordnas när PR #31 i Amelio Web Platform är godkänd.
- Inga okända legacy-bilder utges för att vara verkliga Hallpartner-leveranser.

## SEO och intention

| Fält | Arbetsval |
|---|---|
| Primär sökintention | Maskinhall / maskinhallar för maskiner, uppställning och arbete |
| URL / föreslagen canonical | `https://hallpartner.se/stalhallar/maskinhall/` |
| SEO title | `Maskinhallar – plats för maskiner och arbete | Hallpartner` |
| Meta description | `Planerar du en maskinhall? Läs om portöppningar, frihöjd, körvägar, serviceytor och vad som är bra att veta inför ett hallprojekt.` |
| H1 | `Maskinhallar med plats för arbetet.` |
| Sidans huvuduppgift | Beskriva maskinernas behov och hur rörelser och arbetszoner påverkar planering |
| Gräns mot Lagerhallar | Lagerhall fokuserar på gods och logistik; maskinhall behandlar även manövrering och serviceutrymme |

## Sektioner i det nya textutkastet

1. Hero med maskinhallsspecifika frågor: passage, arbetsyta, drift.
2. Maskinens mått är bara början: särskilj maskinens ytterdimensioner från plats för rörelser och service.
3. Rörelser genom hallen: en faktisk sekvens (in, arbetsyta, ut). Numreringen förklarar ordningsföljd, inte dekoration.
4. Arbetsytan och inomhusmiljön: portar, frihöjd, service, redskap och eventuellt behov av isolering/ventilation. Ingen dimensionering eller garanti om installationer.
5. Underlag inför första samtalet: enkel skiss av maskiner och rörelser, ungefärlig plats och användning.
6. FAQ unik för maskinhallar: hur behovet uppskattas, verkstadsanvändning och isolering.
7. Avslutande kontakt, via befintliga WordPress-adressen tills ny kontaktmottagning är verifierad.

## Internlänkar – faktisk implementation

| Varifrån | Till | Varför |
|---|---|---|
| Brödsmula | `/stalhallar/` | Till övergripande val av halltyp |
| Skillnad mellan uppställning och lager | `/stalhallar/lagerhall/` | Hjälper besökaren att välja rätt användningsområde |
| Klimat och temperatur | Befintliga `https://hallpartner.se/stalhallar/isolerad-hall/` | Fördjupning utan att blanda ihop användning och isolering |
| Hero och avslutning | Befintliga `https://hallpartner.se/kontakt/` | Första riktiga kontaktvägen tills ny `/kontakt/` är migrerad |

**Kvar före lansering:** verifiera faktiskt utförande, tekniska produktdata, arbets-/montageansvar, kundgodkända bilder, migreringsstatus, korrekt ny kontaktväg och senare AMP-005/002-komposition.

Sidans generella råd om mått och arbetsytor är **planeringsfrågor**, inte platsanpassade konstruktionsbesked.
