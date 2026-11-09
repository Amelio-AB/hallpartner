# HP-054 – Kontaktaktivering på Amelios Inleed-preview

Datum: 2026-11-09. Gäller enbart `https://hallpartner-se.preview2.inleed.com`. Inte Hallpartners WordPress, DNS eller kundproduktion.

## Projektägarbeslut och fakta

- Andreas har uttryckligen begärt att det befintliga kontaktformuläret aktiveras utan ytterligare ombyggnad.
- Mottagare och avsändare på preview är `kontakt@amelio.se`. Den 8 november verifierades detta i den privata Inleed-konfigurationen; inget SMTP-lösenord eller privat innehåll dokumenteras här.
- Amelio AB ansvarar för previewmottagningen. Andreas bekräftade den 9 november att han ansvarar för att gallra kontaktförfrågningar och svar inom 30 dagar hos Inleed och Gmail, inklusive vidarebefordrade/skickade kopior och papperskorgar. Rutinens faktiska genomförande måste följas upp.
- Aktivt kontaktformulär länkar till `/integritet/` (Amelios preview). `/integritetspolicy/` avser Hallpartners ordinarie verksamhet och ska förbli separat.
- Den 9 november: PHP 8.3.36, syntaxtest för fem installerade serverfiler godkänt; privat allowlist innehöll först endast offertkontraktet, sedan bekräftade Andreas `OFFERT: TILLATEN`, `KONTAKT: TILLATEN`, `ANDRA INSTALLNINGAR: OFORANDRADE`, `BACKUP: BEVARAD`.
- Serverns installerade `receiver.php` kontrollerar nuvarande allowlist före anrop till SMTP och `validator.php` känner igen `hallpartner-contact-v1`. Befintliga privata PHP-filer och den publika `api/lead.php` har **inte** ersatts.
- SSH-backupens ID: `hp054-20261109-081418-0ebmW8`. Den innehåller `config.local.php`, `receiver.php`, `validator.php`, med byte-exakt verifiering och privata 700/600-rättigheter. Backupen finns endast på Inleed, utanför public_html.
- Offertguiden är redan separat godkänd och aktiv. Ingen offertpolicy, SMTP-konfiguration eller kundproduktion ska ändras vid kontaktaktiveringen.

## Aktiverings- och verifieringsplan

1. Kontaktpolicyn växlas till `enabled` i denna reviewade kodkandidat. Testa först i Draft-PR; ingen publicering från PR.
2. Efter helt gröna kontroller och slutlig godkänd merge till `main`, verifiera ordinarie previewdeployment inklusive statusmarkör, HTTP och kontaktformulärets `data-enabled=true`.
3. Verifiera **högst ett** syntetiskt POST med påhittade uppgifter, referens-ID och mottagen e-post hos Amelio. HTTP 200/SMTP-acceptans är inte ensamt bevis för inkorgsleverans. Ingen dubbel sändning vid timeout eller oklar leveransstatus.
4. Ingen byte-exakt uppladdning av GitHubs `public/api/lead.php`: den installerade publika bootstrappen använder en driftanpassad fallback. Miljövariabeln `HP_LEAD_PRIVATE_DIR` har inte verifierats i webb-PHP, och offertflödet får inte brytas.
5. Lokal fristående Chrome-avvikelse på AMP-006 hallkort vid 1024px och Windows-radslut i SVG är inte en ändring i kontaktmottagaren; GitHub Actions på tidigare Draft-HEAD passerade. Hantera separat om den nya kontrollen fallerar.

## Rollback

- **Snabb serverstopp:** ta bort **endast** `hallpartner-contact-v1` från `allowed_configurations` och behåll `hallpartner-offert-v2-review`. Återställ inte automatiskt en äldre komplett konfiguration om SMTP/offert har ändrats därefter.
- **Publikt gränssnitt:** ändra kontaktpolicyn till `review`, validera och publicera via ordinarie `main`-kedja; behåll offertpolicyn `enabled`.
- Om privata receiver/validator någon gång ändras, återställ dessa som ett verifierat par från säkerhetskopian. Det ingår inte i denna aktivering.

**Begränsning:** faktisk SMTP-autentisering och mottagning av ett nytt kontaktärende är ännu inte verifierade. De måste prövas efter publicering innan HP-054 kan avslutas.
