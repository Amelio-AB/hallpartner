# HP-054 – Delad mottagare, separat kontaktaktivering

Datum: 2026-11-08. **Draft-kandidat, inte en aktiv leverans.**

## Befintligt gemensamt flöde

Både `/offert/` (AMP-001 V2) och `/kontakt/` använder redan **samma** `POST /api/lead.php` med `contractVersion=1`, `technicalId=quote-flow` och egna `configurationId`:

- `hallpartner-offert-v2-review` – offertguide, redan godkänd på Amelios utvecklingspreview.
- `hallpartner-contact-v1` – kort kontaktformulär, fortfarande avstängt tills eget godkännande.

Den privata koden i `server/lead` hanterar gemensam validering, Origin, HTTPS, rate limiting, SMTP, felstatus och referens. Den levereras **inte automatiskt** via GitHub:s statiska previewdeploy. Serverns lösenord och privata `config.local.php` ska aldrig läggas i repot.

## Förändringar i denna PR

- `config/preview-contact-release.json`: separat fail-closed policy i läget `review`, för enbart `https://hallpartner-se.preview2.inleed.com`.
- `scripts/preview/contact-release.mjs`: validerar kontaktens **egna** godkännanden. Offertens befintliga policy och mottagare får inte automatiskt godkänna kontakt.
- `quote-release.mjs` levererar både offert- och kontaktflaggor från *var sin* policy; `PUBLIC_HP_LEADS_ENABLED=false` kvarstår i denna kandidat.
- Den statiska payload-grinden och Chrome-tester stöder båda lägen, men kan inte leverera ett kontaktärende utan separat aktiv policy.
- Privat PHP-mottagare får en uttrycklig `allowed_configurations`-grind för kontakt. Detta är en **källkodsändring** som måste versionsverifieras och läggas i det privata serverområdet före eventuell aktivering.
- Integritetssidan förklarar hur ett framtida aktivt kontaktärende hanteras av Amelio i previewn; det skickas inte automatiskt till Hallpartner. Aktivt formulär länkar dit.
- Regressionstester använder påhittade uppgifter, inte verkliga kundmeddelanden.

## Blockerare före verkliga kontaktinskick

1. Verifiera aktuell privat `server/lead/receiver.php`, `validator.php` och `config.local.php` via godkänd administrativ åtkomst. Säkerställ att `allowed_configurations` explicit innehåller `hallpartner-contact-v1` **först när** kontaktmottagningen ska aktiveras. Bevara offertguidens `hallpartner-offert-v2-review` och dess fungerande SMTP-inställningar. Ingen blind serveruppladdning.
2. Bekräfta att **kontakt@amelio.se** fortsatt ska ta emot kontaktärenden under preview, och vem som får läsa/gallra dem. `info@hallpartner.se` är en publik kontaktväg, inte automatiskt SMTP-mottagare på Amelios utvecklingskonto.
3. Färdigställ/godkänn integritetsinformationen för *kontaktförfrågningar*, inklusive behandlingsansvarig, gallring och eventuell bekräftelsehantering. Dokumentera ägargodkännande och separat syntetisk SMTP-verifiering i en faktisk bevisfil.
4. Först därefter ändras `config/preview-contact-release.json` till `mode=enabled` med verklig bevisning. Kör fullständiga Actions, verifiera målbindning, `noindex`, read-only PR-test samt ingen påverkan på kundens WordPress eller DNS.
5. Efter grön och godkänd previewrelease: kontrollera exakt **ett** syntetiskt kontaktmeddelande och bekräfta serverreferens + faktisk mejlmottagning, utan falsk success eller upprepade utskick.

## Övrig releasekontext

Tidigare kontakt-PR #54 är mergad på `main`, men Inleed-workflow #42496108781 blev rött på extern WordPress-HTTPS-kontroll efter att previewfilerna verifierats. Denna PR försöker **inte** ändra publiceringens säkerhetsgrindar. Kontaktaktivering sker inte förrän hela releaseprocessen kan verifieras enligt separat beslut.
