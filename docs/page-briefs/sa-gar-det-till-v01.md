# Så går det till – nyskriven Astro-sida v0.1

> 2026-11-01 · Ny **noindexerad redaktionell arbetsversion**. Den beskriver kundens förberedelser, **inte** Hallpartners verifierade och avtalade projektprocess. Den är inte återfunnen historisk Så går det till v0.1 eller kundgodkänd text.

## Källkod och uppgift

- Fulltextkälla: [`src/pages/sa-gar-det-till/index.astro`](https://github.com/Amelio-AB/hallpartner/blob/746b8f7317fba81fcd8ecf34f1779a36f9f064c8/src/pages/sa-gar-det-till/index.astro), i [Draft PR #5](https://github.com/Amelio-AB/hallpartner/pull/5).
- Riktig intern Astro-route: `/sa-gar-det-till/`. Den använder Hallpartners befintliga besökarlayout och sidans egna `hallpartner-info.css`, inte en installerad AMP-005.
- Title/H1 är sidunika. Introduktionen anger att kunden får en översikt över vad som bör förberedas före första kontakten, inte ett löfte om att Hallpartner levererar en fast sekvens.
- Kontaktknappar leder till den nya noindexerade `/kontakt/`, utan ett oimplementerat offertformulär.

## Sektioner i arbetsversionen

1. Inledning: från idé till ett tydligare hallbehov.
2. Fyra förberedelser för beställaren: beskriv användningen; uppskatta utrymmet; undersök byggplatsen; klarlägg omfattning och ansvar.
3. Ett avsnitt med frågor om lov/myndighetskrav, grund/ritningar/montage och pris/tidsplan. **Beskriv frågorna, inte obekräftade Hallpartner-löften.**
4. Vägen vidare: hallöversikt och fungerande kontaktvägar via den nya Kontakt-sidan.

Numreringen är en verklig ordningsföljd av **kundens informationsarbete**, inte dekorativa numrerade rubriker och inte en avtalad intern entreprenadkedja.

## Fakta som saknas

**HP-009**: vem som faktiskt utför montage och av vem det beställs.  
**HP-010**: vad Hallpartner ansvarar för från rådgivning till handlingar, frakt, lossning, grund och byggplats.  
**HP-015**: juridisk part och bekräftad kontaktmottagare.

Det här måste klarläggas innan sidan får beskriva en namngiven leveransprocess med bestämda faser, löften om ledtider eller offertomfattning. Även tekniska krav och lov ska verifieras på plats och mot gällande regler; de är inte standardvärden från vår text.

## Acceptans

Under utveckling är sidan färdig som **innehållsarbetsversion** när en H1, noindex, canonical, fungerande interna länkar och mobil-/desktopkontroll har passerat. Kundens sakliga godkännande, ansvarsmatris, eventuellt uppdaterad AMP-005 och framtida indexering är **separata beslut**.

Se [SEO-sitemap](../SEO_SITEMAP_V02.md), [webbplatsplan](../WEBSITE_PLAN.md) och [centralt TODO-register](https://github.com/Amelio-AB/hallpartner/pull/2).
