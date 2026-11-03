# Hallpartner – första migreringsomgången

> 2026-11-01. Implementation på befintlig PR #5; ingen publiceringsacceptans.

- Roten `/` använder nya granskade fullskärms-Heron och startsidans sektioner. Inga prototypvarningar syns på denna sida.
- Header och mobilmeny är en tillfällig gemensam implementation som senare ska ersättas av AMP när paketet faktiskt är installerat.
- Besökarens navigering går till riktiga ankare. Produktkorten och kontaktknappen leder tills vidare till Hallpartners befintliga WordPress-sidor; detta måste ersättas innan lansering.
- Prototyperna har sina interna disclaimers kvar och ska fortsatt vara noindex.
- Även roten `/` behåller `noindex,nofollow` under arbetet. Inget FTP-/deployworkflow har ändrats.
- AI-genererad Hero-bild `public/images/hallpartner-hero-temporary.webp` är en temporär konceptvisualisering, inte ett utfört Hallpartner-projekt. Proveniens bevaras här, inte i hero-texten.
- Riktig original-logotyp saknas i GitHub; lokala ospårade filer ska inte skrivas över. Fem sådana filer har kopierats lokalt till `C:\webbprojekt\hallpartner-backup-20261101-061041`.

## Nästa blockerare
- Verifiera originallogotyp och användning, flytta in när användaren godkänt filval.
- Arkivera sidutkasten från originalkällorna; PR #4 anger 0/11 original i fulltext.
- Migrera undersidorna, ersätt WordPress-länkar, granska SEO/301-regler och sitemap.
- Testa kontaktmottagning, mobilvyer, AMP, säkerhetsaudit och verkligt innehåll.
- Ingen merge, DNS-ändring eller Inleed-uppladdning utan separat godkännande.
