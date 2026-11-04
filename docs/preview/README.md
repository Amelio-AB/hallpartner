# Automatisk Inleed-preview – förberedelser och aktivering

Status 2026-11-04: PR #12, #13 och #14 är mergade. Godkänd bas är
`0c27b4a8e20efd3b8dca2498e5c2005df68f423b`. Bildgodkännanden är nu
registrerade. **NO-GO för aktivering och publicering:** serverns gamla filer,
kontots isolering och äldre ops-flöden återstår. Workflow **316932905 är
fortfarande disabled_manually**. Denna PR ändrar inte webbplatsens bilder,
design, innehåll, komponenter eller beroendeversioner.

## Miljöer och gränser

| Miljö | Roll |
| --- | --- |
| main | Ordinarie utvecklingsbas. Endast senaste godkända main kan publiceras. |
| https://hallpartner-se.preview2.inleed.com | Offentligt åtkomlig utvecklings- och kundgranskningspreview, med noindex. |
| https://hallpartner.se och www | Befintlig produktion. Aldrig ett publiceringsmål i processen. |
| Kundens framtida Inleed-konto | Separat slutleverans av en godkänd dist-version; ingår inte i automatiken. |

Inga secrets, DNS-, SMTP-, konto- eller produktionsinställningar ändras.
De åtta bevarade lokala råfilerna från PR #14 ligger kvar utanför arbetsytan.

## Bildbesked och exakt kandidat

[Andreas besked och dess gränser](customer-image-approval-20261104.md) skiljer
leverantörsbilder enligt kundens bekräftelse från den tillfälliga AI-Heron,
ordlogotypen och H-faviconen. Även de tre senare är uttryckligen godkända av
Andreas för offentlig preview och normal bildoptimering. Inget externt
licensavtal eller okänd rättighetsinnehavare har uppfunnits.

[Den aktuella inventeringen](candidate-images-20261104.json) omfattar 14
källor och 51 bildfiler i ett statiskt paket med 74 filer. Godkännandena i
`config/preview-image-rights.json` binder verklig källa och utdata via SHA-256,
exakt previeworigin, Andreas och beslutsdokumentet. Linux-artifactens bytes
är kontrollerade; faviconens Windows-CRLF avviker från Git/Linux-LF och
redovisas separat. Bildfilerna och optimeringen är oförändrade.

Rättighetskontrollen körs nu även i PR-valideringen. Ändrade bildbytes eller
återkallade godkännanden stoppar nästa kandidat. Noindex är inte ett
tillstånd. Beskedet är kundens bekräftelse, inte en oberoende juridisk
verifiering. Leverantörsbilder får inte presenteras som egna genomförda
Hallpartner-projekt. En referenssida väntar på verkliga projektfotografier.

## Validering och publiceringspaket

`.github/workflows/deploy-production.yml` heter **Hallpartner Inleed
development preview** och använder fortfarande workflow-ID 316932905.
Endast main-push och manuell körning tillåts; publiceringsskriptet avvisar
andra refs, events, repository och inaktuell main. Ingen PR publicerar.

`preview-validation.yml` kör med Node 24: riktig npm ci med låst AMP 1.4.0
på `fec9ca01b3c0d4bc9002fa21832a51cf51009749`, källkontroll, check, lint,
alla Node-/PHP-regressioner, npm-audit på oförändrad high-gräns,
Composer-audit, build, HTML-/URL-kontrakt, payload-/bildrättighetskontroller
samt Chrome på själva paketet (13 sidor × 5 bredder, AMP-006 och galleri).
Workflow-YAML, shell och kontrakt granskas också. Den privata AMP-tokenen
används endast i installationen, utan beständiga token-URL:er.

Payloaden består av 13 tillåtna publika HTML-filer och deras använda
CSS/JS/bild/font-resurser. PHP/API/SMTP, privata filer, interna prototyper,
projekt, roadmap, vision, workshop och Markdown utesluts. Alla sidor måste
behålla noindex,nofollow; kontakt och offert måste förbli inaktiva.
Payloadens robots.txt blockerar all crawling. Ingen sitemap publiceras.
Google Fonts är befintligt tillåtet externt resursursprung.

Publiceringsjobbet hämtar bara exakt SHA-märkt payload och manifest från
samma körning, verifierar filhasharna och bygger inte om. Gamla PR #5-
artifacts används inte av det nya workflowet.

## Färsk serverinventering och kvarvarande spärrar

Se [servergranskning och filvis plan](server-review-20261104.md),
[FTPS-målbevis](target-proof-20261104.json),
[HTTPS-kontroller](https-inventory-20261104.json) och
[workflowinventering](workflow-inventory-20261104.json).

Den läsande kontrollen hittar fortfarande 63 fjärrfiler och samma 12
policyförbjudna sökvägar. Fyra gamla interna sidor och sju README-filer
svarar HTTP 200. `cgi-bin/.htaccess` svarar 403 och får inte behandlas som
en vanlig webbplatsfil. Ingen serverfil har ändrats eller raderats.

FTPS-markören matchar previewn och är frånvarande med HTTP 404 på båda
produktionsvärdarna. Detta är ett färskt observerat målbevis, inte bevis för
fullständig vhost-/kontoisolering. `config/preview-release.json` behåller
`targetBindingSha256: null`, `targetEvidence: null` och tom retentionlista.
Inleed-kontots domänkoppling, custom root, eventuell delning med andra
webbplatser och .htaccess-funktion behöver granskas av kontoägaren/Inleed.
En ren, separat previewrot föredras om den kan ordnas utan påverkan på
andra tjänster; ingen sådan serverändring görs i denna PR.

Den utökade check-target-kontrollen läser kataloglista och samtliga
filhashar via FTPS. Endast sökväg, storlek och hash sparas i artifacts.
Råfiler/serverkonfiguration stannar i runnerns temporära katalog och
städas lokalt; detta är inte en återställningsbackup. Okända/osäkra
sökvägar och ändrad fil-/kataloglista under läsningen stoppar kontrollen.
Listkontrollen är inte ett atomiskt serverlås och upptäcker inte varje
samtidig ändring av bytes i en oförändrad sökväg.

## Överföringens spärrar och begränsningar

Explicit FTPS på port 21 kräver TLS >=1.2, skyddade kontroll-/datakanaler,
certifikat- och värdnamnskontroll. Ingen okrypterad fallback tillåts.
Lösenord ligger i LFTP_PASSWORD, inte argument, URL eller skriptfil.
Kontobindningen är hash av normaliserad endpoint, konto och root `./`.

De två gamla ops-workflows **405335800** (publicering) och **405334470**
(markörskrivning) är fortfarande aktiva och måste inaktiveras före ny
publicering. Båda triggas av push på ops/inleed-preview-cutover-20261103;
den grenen och flödenas status lämnas orörda här. Nya publiceringsskriptet
kräver disabled_manually för båda. Delad concurrency hindrar överlappande
körningar men ersätter inte avstängning.

Inget --delete, rm, rekursiv serverrensning eller serverflytt ingår.
Otillåtna gamla sidor och dotfiler kan inte kringgås med retainedFiles.
Andra äldre statiska filer behöver separat hashbunden retentiongranskning;
nya bildgodkännanden gör inte alla gamla fjärrbilder automatiskt godkända.

FTPS är inte en atomisk releaseväxling. Assets överförs före HTML och
startsidan sist. Ett avbrott kan lämna en delvis uppdaterad preview;
ingen automatisk destruktiv rollback sker. Senaste main kontrolleras
omedelbart före skrivning och efter verifiering.

Efter uppladdning måste varje paketfil matcha över HTTPS. Två stabila
förkontroller av /, /robots.txt och /stalhallar/ på båda produktionsvärdarna
måste vara oförändrade efteråt; markörerna ska förbli frånvarande där.
Först därefter skrivs hashbunden inventory och commit-/run-markörer.
Både lyckad workflowstatus och hp-preview-deploy.json måste verifieras.

## Rekommenderad ordning – ingen åtgärd utförs automatiskt

1. Granska denna Draft-PR och slutlig HEAD/CI. Låt workflow 316932905 vara avstängt.
2. Kontoägaren/Inleed verifierar domänisolering och väljer ren previewrot eller exakt godkänd hantering av gamla filer. Serverkonfiguration får inte ändras utan separat godkännande.
3. Före varje eventuell filändring: ta full relevant privat backup, verifiera hash, kontrollera färsk lista och få Andreas separata godkännande av den filvisa planen. Ingen radering är godkänd av denna PR.
4. Registrera därefter verifierad målbindning och eventuell tillåten retention i en granskad commit. Kör alla tester och färsk läsande serverkontroll igen. Okända filer ska fortsatt blockera.
5. Inaktivera de två äldre ops-flödena efter godkännande; kontrollera att inga gamla körningar pågår/köar. Granska main-skydd och preview-behörigheter: main är nu oskyddad och preview-environment saknar reviewers. Automatik kan annars inte i sig garantera att alla main-ändringar är mänskligt godkända.
6. Mergea endast godkända förberedelser till main medan publiceringen fortfarande är avstängd. Ingen merge utförs av denna uppgift. Notera exakt slutlig main-SHA; PR-HEAD är inte automatiskt publicerings-SHA.
7. Redovisa alla passerade kontroller, isolerat mål och kvarvarande risker. **Stanna för Andreas separata slutliga GO för exakt main-SHA, aktivering och första manuella uppladdning.**
8. Efter detta GO: aktivera 316932905 och kör workflow_dispatch på senaste main. Kontrollera slutstatus, SHA-markör, alla resurser, mobil/desktop, noindex, inaktiva formulär och oförändrad produktion.
9. Först efter verifierad första publicering lämnas automatiken aktiverad för framtida godkända merges till main. Inga kundkonton eller andra domäner läggs till i denna process.

## Incidentstopp och kvarvarande validering

Inaktivering av 316932905 stoppar nya körningar men avbryter inte en
pågående överföring; den måste stoppas explicit vid incident. Gamla ops
ska förbli avstängda. Skrivbehörighet, verklig FTPS-överföring,
avbrottsåterhämtning och efter-publiceringskontroll är ännu inte testade.
Ingen lokal/PR-kontroll ersätter ett godkänt första publiceringstest.

Återställning görs genom separat godkänd revert på main och ny verifierad
körning eller en uttryckligen godkänd manuell plan. Gamla SHA får inte
kringgå latest-main-spärren. Npm-auditens kvarvarande måttliga
utvecklingsberoendefynd redovisas i CI; ingen gräns sänks här.
