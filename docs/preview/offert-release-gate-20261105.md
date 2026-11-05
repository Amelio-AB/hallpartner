# Offertguide – preview-releasegrind efter verifierad SMTP-test (2026-11-05)

## Verifierat i den privata Inleed-miljön

En syntetisk V2-förfrågan via isolerad loopback-server gav HTTP 200 och referensen `24cc0e74557ce9ceb03412f1`. Projektägaren har därefter verifierat ett faktiskt mottaget mejl i testinkorgen med exakt samma referens. SMTP-avsändaren är `kontakt@amelio.se`; under Amelios previewtest används `andreas@amelio.se` som mottagare. Det är **inte** en verifiering av att den publika `/offert/`-knappen fungerar ännu.

Offentliga `config.local.php`-inställningar är fortfarande `enabled=false` och `privacy_approved=false`. Den privata V2-valideraren har installerats; credentials och lösenord berörs inte av den här PR:n.

## Detta införs i PR:n

- `config/preview-quote-release.json` har `mode: "review"` som standard. En vanlig merge eller push publicerar **inte** ett aktivt formulär.
- `scripts/preview/quote-release.mjs` beräknar buildflaggorna från en granskningsbar releasepolicy. För `enabled` krävs signerade beslut om integritet, receiver, testmottagare och projektägargodkännande samt en faktisk `/integritet/`-sida i previewns publiceringsallowlist.
- GitHub Actions sätter bara flaggorna utifrån policyn **innan** Astro-byggningen. Övriga kontaktformulär påverkas inte.
- `scripts/preview/payload.mjs` tillåter `data-enabled=true` **endast** på `#hp-offert-guide`, på `offert/index.html`, och endast i godkänt läge. All PHP/API-uppladdning och andra aktiva formulär är fortsatt förbjudna.
- Vid en senare aktivering måste offertsidan också länka till den kundgodkända integritetsinformationen.
- Node-regressioner testar att aktivt läge blockeras utan tillräckliga beslut samt att inget annat formulär kan aktiveras.

## Återstående faktiska steg innan aktiv publik knapp

1. Fastställ vem som är personuppgiftsansvarig under **Amelios testpreview**, vilka som får åtkomst till testinkorgen och när testuppgifter raderas. Lägg till och granska en integritetssida. Ingen faktisk kunddata ska användas i förtid.
2. Verifiera privat `config.local.php` på servern utan att dela hemligheter. E-post ska gå **från** `kontakt@amelio.se`; välj och bekräfta avsedd **mottagare** separat innan previewn öppnas för verkliga inskick. Den tidigare syntetiska testen använde `andreas@amelio.se` som testinkorg. Serverns origin måste vara `https://hallpartner-se.preview2.inleed.com`.
3. Dokumentera konkret go/no-go, lås en revision som endast gäller previewdomänen, och ändra därefter `mode` i en separat godkänd PR. Håll WordPress och kundens befintliga webbhotell orörda.
4. När integritet och servermottagning är godkända, aktivera den privata konfigurationen och publicera **enbart på Inleed-previewn**. Testa webbläsarens sex steg med syntetiska uppgifter och bekräfta exakt referens i Roundcube. Avbryt om någon del fallerar.
5. För framtida drift på Hallpartners eget konto krävs en **separat** mottagar-, SMTP-, domän- och integritetsrelease. Flytta aldrig automatiskt Amelios uppgifter eller hemligheter dit.

## Avgränsning

Detta arbete aktiverar inte prisberäkning, filuppladdning, WordPress, DNS, SMTP-ändringar eller verkliga kundinskick. Det gör publiceringsflödet redo för en senare godkänd aktivering.
