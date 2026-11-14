# HP-056: Hallpartners PHP-mottagare i eget Inleed-konto

## Syfte och beroenden

Denna kundanpassning bygger på Draft PR #65 (som i sin tur bygger på #61).
Det är **inte** en självständig release från `main`. Ingen automatisk
merge eller publicering till Amelios preview får utlösas av denna gren.

Kundkonto: `s188354`. Testorigin: `https://hallpartner-se-new.preview2.inleed.com`.
Den statiska Astro-previewn är redan publicerad och båda formulären är
avstängda. DNS, Beebyte-mail, Loopia och Amelios preview lämnas orörda.

## Inaktiva serverfiler som redan finns

- Källpaket: `/home/s188354/hallpartner-leads/releases/9efdf900539e09b92a198169f94c7d6eee094a5a`.
  Detta är en verifierad **föräldrakandidat** från PR #65, inte den här grenens ändrade runtime.
- Källarkivets SHA-256:
  `836E58B7CE47E4DA8F4965192F4B4DC5938B157775902699CFC0945A3F159340`.
- PHP 8.3.36 och Composer 2.11.2 finns på kontot; PHPMailer 7.1.1
  installerat från låst Composer-fil. Tre PHP-testsviter godkända.
- Privat konfiguration: `/home/s188354/hallpartner-leads/shared/config.local.php`,
  behörighet 0600. `mail_environment='preview'`, `enabled=false`,
  `privacy_approved=false`, tom tillåtelselista och inga SMTP-uppgifter.
- Rate state: `/home/s188354/hallpartner-leads/state`, behörighet 0700.
- **Inget publikt** `api/lead.php` har installerats och ingen SMTP-sändning har skett.

## Ändringarna i denna gren

- HTML-mallar och avsändar-/reply-to-namn anger Hallpartner, aldrig Amelio.
  `mail_environment='preview'` ger tydliga testmeddelanden;
  `'production'` ger kundmejl utan test-/previewtext.
- Okänd eller saknad `mail_environment` måste stoppa all SMTP-leverans.
  Värdet hämtas **enbart från serverns privata konfiguration**, aldrig från besökarens JSON.
- `rate-cleanup.php` får endast städa namngivna och utgångna rate-filer
  i `/home/<kundkonto>/hallpartner-leads/state`; inga gamla konto-/previewadresser.
  Den säkra CLI-körvägen förutsätter releasekatalogen
  `hallpartner-leads/releases/<revision>/server/lead`.
- `config.example.php` visar låst och avstängd kundpreview-konfiguration.
- PHP-malltester och den isolerade SMTP-loopbackregressionen kontrollerar
  både preview och produktion, inklusive hantering av misslyckad kundkopia.

## Säker driftsättning, ännu ej utförd

1. Granska Draft-PR och verifiera **exakt låst commit**, lint, PHP-tester,
   Composer-audit och isolerad SMTP-loopback. Uppdatera privata källpaket
   först efter separat godkännande. Ändra inte den äldre verifierade releasen.
2. Skapa en ny isolerad releasekatalog med den godkända koden och installerade
   beroenden. Lägg **ingen** `config.local.php` i Git eller det publika arkivet.
3. Länka den nya releasens `server/lead/config.local.php` till kundens
   `shared/config.local.php` med restriktiva filrättigheter.
   Bekräfta att webbserverns PHP-process kan läsa konfigurationen
   utan att katalogen exponeras via URL.
4. Innan någon frontend ändras: verifiera avstängd privat mottagare
   med isolerade negativa HTTP-test och en egen driftsmarkör.
   För offentlig adapter krävs även korrekt inställd
   `HP_LEAD_PRIVATE_DIR` som pekar till vald privat release.
5. Installera publik `api/lead.php` separat efter granskning och bevisa
   HTTP 405 för GET, HTTP 503 för avstängd POST, ingen informationsläcka
   samt korrekt HTTPS/Origin-policy.
6. **Aktivera inte** kontakt/offert eller SMTP förrän kundens verkliga
   avsändare/mottagare, SMTP-konto, integritetstext, kundkopior,
   dubblett-/rate-limit och produktionsdomän är kontrollerade.
   Prova högst ett uttryckligt godkänt syntetiskt inskick per formulär.
7. Först efter dokumenterad smoke test och rollbackplan:
   slå på respektive formulär i en separat frontend-release.
   Flytta Beebyte-mail och DNS i egna godkända steg.

## Rollback

Behåll föregående privata release och ursprunglig webbrot orörda.
Vid fel: avaktivera formulär-/API-kopplingen först; återställ sedan endast
den separata kundreleasen. Inga massraderingar, inga exporter av lösenord.
