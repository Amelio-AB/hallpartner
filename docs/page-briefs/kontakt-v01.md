# Kontakt – nyskriven Astro-sida v0.1 (utan formulär)

> 2026-11-01 · Ny **noindexerad arbetsversion**. Inte en återfunnen historisk Kontakt v0.2 och inte godkänd publicering av kontaktuppgifter. Den historiska överlämningen angav ett enkelt formulär med namn/e-post/meddelande, men backend, personuppgiftsansvar och mottagning saknar verifiering.

## Källkod och prioritering

- Ny fulltextkälla: [`src/pages/kontakt/index.astro`](https://github.com/Amelio-AB/hallpartner/blob/746b8f7317fba81fcd8ecf34f1779a36f9f064c8/src/pages/kontakt/index.astro), i [Draft PR #5](https://github.com/Amelio-AB/hallpartner/pull/5).
- Den tidigare Astro-routen på `/kontakt/` var en Amelio-presentation med Amelios kontaktperson och ett `mailto`-formulär. Den har ersatts i **utvecklingsgrenen**, inte på WordPress eller Inleed.
- Nu används `HallpartnerSiteLayout`, gemensam besökar-Header, visuellt avgränsad `hallpartner-info.css` och egen H1 `Berätta om ditt hallprojekt.`
- Sidbeskrivning: besökaren ska hitta en kontaktväg och förstå vad som kan vara bra att förbereda, inte fylla i ett falskt offertformulär.

## Kontaktinformation – källa och osäkerhet

I sökindexerad äldre WordPress-footer på Hallpartner.se fanns följande publicerade uppgifter vid kontroll 2026-11-01:

- E-post: `info@hallpartner.se`
- Telefon: `054-820 04 90`
- Dessa är **publicerade historiska uppgifter**, inte verifierad aktuell mottagning eller slutligt kundgodkännande. Direkt hämtning av `/kontakt/` misslyckades i granskningsmiljön. **Peter/Jimmy måste bekräfta** att adress, nummer och mottagare är korrekta inför lansering (HP-015, HP-007).

Den nya arbetsversionen visar en vanlig `mailto:`-länk och en `tel:`-länk, **utan formulär**. Mailto betyder att användarens e-postklient öppnas; webbplatsen kan inte garantera att något skickats eller kommit fram. Vi påstår därför inte skickat/framgång efter klick.

## Innehåll och internlänkar

1. Introduktion: börja med ett första samtal om vilket hallbehov kunden har.
2. Kontaktkort: synlig e-post och telefon, användarstyrda mejl-/ringlänkar. Inga svarstidslöften.
3. Förberedelser: användning, ungefärliga mått och byggort som hjälpsamma uppgifter.
4. Vidare läsning: internlänkar till `/stalhallar/` och `/sa-gar-det-till/`.

Header, footer, startsida och befintliga sex hallundersidor länkar nu till den **lokala** `/kontakt/`-routen i arbetsversionen.

## Kvar före publik kontaktlansering

- Bekräfta avtalspart, e-post, telefon, mottagaransvar och fel-/vidarebefordran.
- Ta ställning till om ett lätt kontaktformulär ska finnas. Aktivera det först efter servervalidering, spam-skydd, dataskyddsinformation och verifierad mottagning.
- Kontrollera eventuell befintlig WordPress-formulärfunktion före byte så att leads inte går förlorade.
- Kundgodkänn sidcopy och utför riktig mobil-/desktopgranskning; `noindex` är kvar tills beslut om produktion.
- Kontrollen att mailto- och telefonlänkar renderas bevisar **inte** att e-post eller samtal når rätt person.

Se [SEO-sitemap](../SEO_SITEMAP_V02.md), [aktuellt arbetsregister](https://github.com/Amelio-AB/hallpartner/pull/2) och [Så går det till-brief](sa-gar-det-till-v01.md).
