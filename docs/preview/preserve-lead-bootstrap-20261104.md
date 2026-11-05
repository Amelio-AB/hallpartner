# Preview – bevara befintlig PHP-bootstrap utan publicering (2026-11-04)

## Färskt hashbevis

**Bakgrund:** Efter att den godkända offertguiden mergades i PR #22 till `main` på
`bd70d5ce7441de1ea694c50ecf534f8203f6c18a` stoppade
[publiceringskörning 41909289110](https://github.com/Amelio-AB/hallpartner/actions/runs/41909289110)
innan den laddade upp något. Fel: `Excluded public path: api/lead.php`.

Körningen verifierade att FTPS-kontot och previewmarkören matchar
`https://hallpartner-se.preview2.inleed.com/` och att markören saknas på
Hallpartners nuvarande WordPress-domäner. Läsande serverbevis från
`target-proof.json` i samma körning:

| Egenskap | Observerat |
| --- | --- |
| Sökväg | `api/lead.php` i befintlig preview-rot |
| Originalstorlek | 943 byte |
| Ursprunglig FTPS SHA-256 | `7d252addd5378e98ddb42871934190800800e076318661b3d66c1a202a89e7ef` |
| Läsning | 2026-11-04T20:55:09.501Z |
| Ny uppladdning | **Ingen** – spärren slog till före första skrivoperationen |

**Viktig källkritik:** Dessa uppgifter verifierar filens existens och
fingeravtryck, **inte PHP-kodens innehåll eller säkerhet**. Repots
`public/api/lead.php` har en annan hash (och annan storlek).
Vi gör **inte** anspråk på att den befintliga serverkopian är kodgranskad
eller identisk med repots bootstrap. Den måste granskas separat före
eventuell aktivering av verklig mottagning.

## Exakt bevarande – inget undantag för publik PHP-publicering

För att kunna publicera en **statisk, inaktiv offertguide** ska den redan
befintliga filen bevaras byte-för-byte, utan att laddas upp eller ändras.
Det är ett mycket snävare beslut än att tillåta serverkod i publiceringspaketet:

- `api/lead.php` får endast finnas som en **preserve-only**-post i
  `config/preview-release.json` med exakt ovanstående SHA-256.
- `safePath()` förbjuder fortfarande **alla** PHP-filer och `api/` i
  publiceringspaketet. Endast denna exakta befintliga sökväg undantas
  vid *läsande och hashverifierad retention*, inte under upload.
- En ny hash, saknad metadata eller annan PHP-/API-sökväg blockerar. Inga
  serverfiler raderas eller ändras av detta arbete.
- PR-valideringen kontrollerar nu också att inga okända skyddade filer
  finns på servern; tidigare kontrollerades endast redan policylistade
  gamla resurser.
- Sidans offertguide har `ready = false` och blockerade submit-/uploadadaptrar;
  det här undantaget aktiverar inte PHP, SMTP eller kundinbox.

**Scope:** Endast Amelios redan verifierade Inleed-preview, med oförändrad
målbindning, inga nya konton, DNS-förändringar eller ändringar på
kundens WordPress-server. Om aktuell FTPS-fil avviker från SHA ovan ska
publiceringen stanna **utan** nya skrivningar.

**Uppföljning:** Innan verklig offertmottagning aktiveras ska
`api/lead.php` jämföras byte-för-byte med godkänd källkod och
privat receiver-konfiguration granskas separat. Denna ändring är inte
ett godkännande av det driftspåret.
