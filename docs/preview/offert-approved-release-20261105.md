# Godkänd previewrelease – offert V2, 2026-11-05

## Beslut och mål

Andreas har uttryckligen godkänt att färdigställa implementationen och
publicera till Amelios befintliga Inleed-preview när kontrollerna passerat,
samt genomföra ett syntetiskt inskick genom den riktiga guiden och verifiera
samma referens i `kontakt@amelio.se`. Godkännandet upprepades vid återstart
från `913a84c` och när tillfällig SSH-åtkomst installerades. Det krävs inte
ett nytt allmänt publiceringsgodkännande.

Endast `https://hallpartner-se.preview2.inleed.com/offert/` och den privata
PHP-mottagaren `/home/s164937/hallpartner-leads` ingår. WordPress, DNS,
andra webbplatser och framtida kundkonto ingår inte.

Amelio AB är ansvarig i denna preview. Endast Andreas har åtkomst till
testinkorgen och ansvarar för gallring inom 30 dagar, inklusive papperskorgen.
Avsändare och mottagare är `kontakt@amelio.se`.
[Intresseavvägning och behandlingsbeskrivning](offert-privacy-assessment-20261105.md)
redovisar underlaget för artikel 6.1 f. Ingen extern juridisk granskning
eller kundproduktionsrelease påstås.

## Faktiska serverkontroller

Anslutningen verifierades först läsande med SSH på port 2020: användare
`s164937`, värd `ns15`, hem `/home/s164937`. Bootstrap är oförändrad,
943 byte, SHA-256 `7d252addd5378e98ddb42871934190800800e076318661b3d66c1a202a89e7ef`.

Läsande konfigurationskontroll bekräftade avsändare, mottagare och SMTP-login
som `kontakt@amelio.se`, exakt preview-Origin, installerad vendor, godkänd
SMTP-port samt skrivbar privat rate-katalog. Inga lösenord skrevs ut.

Två faktiska problem rättades efter verifierad privat backup: för kort
rate-hemlighet ersattes med 32 slumpbyte (hexkodade); `config.local.php`
begränsades till 0600 och den privata mottagarkatalogen till 0700.
SMTP-värden och lösenord bevarades. `allowed_configurations` begränsar
mottagningen till `hallpartner-offert-v2-review` även vid direkta HTTP-anrop.

Installerad PHP-kod, byteverifierad mot den testade lokala kandidaten:

| Fil | SHA-256 |
| --- | --- |
| validator.php | 39fd8ffac6ad078c70394b4cb9f647f2f0aef67c9ffbba342959328a9d7751f0 |
| receiver.php | e528409deff905e6172725af351e47a65b0db977f2e7d1b514be46ff2e746a15 |
| rate-cleanup.php | 1eae52a77dba7af74ae7be43638131c81b0ffe31a742aad4d039fc676ab09ef8 |

PHP 8.3.36 syntax och regressioner passerade på Inleed utan SMTP. Nytt
Hallpartner-specifikt gallringsjobb kör var 15:e minut; befintliga cronposter
bevarades och hela crontab återlästes exakt. Gallringskommandot kördes utan
fel. Endast utgångna hashade säkerhetsposter omfattas, aldrig mejl.
Privat backup finns under `.release-20261105/backup` i mottagarkatalogen.

## Ordning för aktiveringen

1. Grön validering på exakt PR-HEAD, därefter merge via GitHub till senaste main.
2. Ordinarie workflow 316932905 publicerar bara verifierad statisk payload.
   Kontaktformulär och bilagor hålls avstängda. `/integritet/` ingår.
3. Verifiera main/run-markör, serveroriginal, HTTPS och live Chrome.
4. Först därefter sätts privata `privacy_approved` och `enabled` till true.
   Fram till dess svarar mottagaren 503 utan att skicka mejl, även om den nya
   knappen redan syns. Ingen blind SMTP-retry görs.
5. Ett syntetiskt inskick via den riktiga knappen måste ge HTTP 200 och
   en referens som återfinns i det mottagna mejlet. Tidigare SMTP-bevis
   `b48d4df51f2834f90d04e086` ersätter inte detta sluttest.
6. Ta bort exakt den tillfälliga SSH-nyckeln och verifiera borttagningen.

Detta dokument registrerar godkännande och förkontroller. Det är inte
bevis för genomförd merge, publicering, aktivering eller slutlig leverans.
Utfallet dokumenteras efter respektive faktisk kontroll.
