# HP-053 – gemensamma kontaktuppgifter: granskningscheckpoint 2026-11-08

> **Endast Draft-kandidat och dokumentation.** Bas-PR: #50 kontakt-hero. Stäm av aktuell GitHub-HEAD, användarens lokala Git-status och bild/CSS innan integrering. Ingen merge eller publicering utan separat ägargodkännande.

## Genomförd designkandidat
- Ny sektion `#kontaktuppgifter` mellan hero och Peter/Jimmys personkort på `/kontakt/`.
- Herons två vita snabbknappar leder till `#hallpartner-telefon` och `#hallpartner-epost`. Knapptexterna är `Visa telefonnummer` / `Visa e-postadress`, eftersom knapparna scrollar i stället för att ringa/mejla omedelbart.
- Företagets befintligt publicerade växel `054-820 04 90`, gemensam mejl `info@hallpartner.se` samt `Fridland Consulting AB`/`559071-8549` visas i sektionen. Kontrollera juridisk avtalspart med Hallpartner före skarp lansering.
- Personkorten har `directPhone`, `directPhoneHref`, `directEmail` som separata fält. Dessa är `null` tills verkliga kontaktvägar och rätt att publicera dem har verifierats; fallback hänvisar **uttryckligen till växeln**.
- Besökspanelen upplyser om att adress/karta visas först när Hallpartners verkliga offentliga besökskontor är bekräftat. Ingen obekräftad kartpin, ingen Google iframe, API-nyckel eller tredje part.
- Ny fristående stilfil `src/styles/hallpartner-contact-details.css` utan ändring i lokal godkänd hero-bakgrund.

## Tester i PR-kandidaten
- Sid-/Footer-kontraktet använder samma centrala `hallpartnerContact`-källa.
- HTML- och Chrome-tester kontrollerar ankare, fungerande `tel:`/`mailto:`, ordning före personkorten och frånvaro av iframe före integritetsbeslut.
- Lokal bild-/CSS-ändring på användarens Windows-dator **ingår inte i GitHub-PR:n**. Det måste ske en lokal integrering efter `git status --short --branch` för verklig visuell granskning.
- PR #52 är avsedd att vara **staplad på PR #50**; tillfällig bas `main` kan användas enbart för att utlösa full PR-validering och ska därefter återställas till PR #50:s gren. Publicering utlöses bara från godkänd `main` och är inte tillåten i denna ändring.

## Efter detta (separat gren)
Se [HP-054 / Issue #53](https://github.com/Amelio-AB/hallpartner/issues/53): återanvänd säker befintlig kontakt-/offert-PHP-mottagning, men med **separat aktiverings- och integritetsgrind** för kontaktformuläret. `PUBLIC_HP_LEADS_ENABLED` ändras inte av HP-053.

## Kvar innan HP-053 kan stängas
1. Få en faktiskt bekräftad offentlig Hallpartner-besöksadress och publiceringstillstånd för Google Maps-inbäddning; säkra textalternativ och samtyckesstyrd laddning.
2. Personliga telefonnummer och e-postadresser till Jimmy/Peter om de vill offentliggöra dessa, annars behåll märkt växel.
3. Användaren granskar mobil, laptop, stor skärm inklusive 4K och 200 % text på sammanförd lokal hero.
4. Exakta releasegrindar gröna; separat merge-/previewbeslut. Ingen kundproduktion nu.

**Fryst scope:** Kundens WordPress, DNS, privat SMTP, noindex, formulärflaggor, bildrättigheter och redan godkänd WebP lämnas orörda.
