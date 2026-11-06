# Överlämningsprompt – Hallpartner efter kvällsarbetet 6 november 2026

**Denna version ersätter den tidigare överlämningspromptens arbetsordning.** Historiska checkpoints är fortsatt användbara som källor, men flera innehåller föråldrade uppgifter om hallhero, AI-märkning, AMP-version, offertguidens status och release-PR:er.

## Uppdrag till nästa agent

Fortsätt utvecklingen av Hallpartners Astro-webbplats i `Amelio-AB/hallpartner`. Börja med **läsande inventering**, inte nya designändringar eller automatisk merge. Den enda ordinarie lokala arbetsmappen är `C:\webbprojekt\hallpartner`. Preview: `https://hallpartner-se.preview2.inleed.com/` på Amelios Inleed-konto. Kundens WordPress ligger på ett annat webbhotell. Ändra **inte** WordPress, DNS, namnservrar, SMTP, privata mottagare, noindex eller produktionsdomänen utan separat beslut.

### Läs detta först
1. `AGENTS.md` och `README.md` (notera att de innehåller historiska statusblock).
2. [Kvällscheckpoint 2026-11-06](2026-11-06-kvall-navigation-release.md) och [ursprunglig helgcheckpoint](2026-11-06-helg-hallar-bilder-omoss.md).
3. [PR #43](https://github.com/Amelio-AB/hallpartner/pull/43), dess senaste HEAD, kommentarer och **faktiska** GitHub Actions. Kontrollera både öppna och nyligen mergade PR:er.
4. `docs/preview/hallpartner-hall-icons-approval-20261106.md` på PR #43 och `config/preview-image-rights.json` samt `scripts/preview/payload.mjs`.
5. Den äldre `docs/TODO.md` och `docs/PROJECT_DECISIONS.md` ligger i **Draft PR #2**, inte i `main`. Läs dem som historiska planeringsregister och jämför mot aktuell kod och [GitHub Issue #41](https://github.com/Amelio-AB/hallpartner/issues/41) före förslag om konsolidering.

## 1. Första åtgärden: fastställ release- och previewstatus

**Senast verifierat under kvällens kontroll** var `main` = `15a607f24f088c75f69dab71a765c576a3e4ed88` med de sex SVG-ikonerna, men **utan PR #43**. Senaste granskade PR #43-HEAD var `4fcd587f818dfd0f0fc94dd309d7f1bfd23664f3`. På denna HEAD var CI, Footer och Linux/Windows release tooling gröna. [Preview candidate #42290034192](https://github.com/Amelio-AB/hallpartner/actions/runs/42290034192) var fortfarande `in_progress` i Chrome-regressionen när denna överlämning skrevs. Detta kan ha ändrats när du läser dokumentet.

- Läs **nuvarande** `origin/main`, PR #43 och GitHub Actions på exakt HEAD. Verifiera att inga nya commits tillkommit.
- Om alla obligatoriska kontroller på PR #43 är gröna och ägarens tidigare uttryckliga releasegodkännande fortfarande gäller samma ändringar: squash-merga en gång till `main` med förväntad HEAD-SHA. Undvik dubbel merge. Om grinden är röd/pågår, felsök utan att kringgå den och rapportera öppet.
- Efter merge: kontrollera nya `main`-SHA, workflow `.github/workflows/deploy-production.yml` inklusive `publish`, bildrättigheter, FTPS/HTTP och slutlig Chrome-verifiering. *En grön PR eller merge räcker inte som bevis på publicerad preview.*
- Jämför cacheförbikopplad preview och versionsmarkör med faktiskt käll-SHA. Ingen ny FTP-uppladdning enbart på grund av gammal cache eller ett läst historiskt versionsnummer.
- Kontrollera på riktig preview: startsida, `/stalhallar/`, alla sex `/stalhallar/<typ>/`, `/om-oss/`, `/kontakt/`, `/sa-gar-det-till/`, `/offert/` och `/integritet/`. Bekräfta att noindex finns kvar. Om extern browseråtkomst inte finns, säg det och använd dokumenterad Actions-verifiering.

### Vad PR #43 ska leverera
- En mörkgrön **fullbredds-breadcrumb** `#153129` på de 13 sidor där brödsmulor används. Texten ligger kvar på gemensam centrerad rail.
- **”Startsida” tas bort från Header-menyn**, men logotypen fortsätter att länka till `/`. Breadcrumb-länken ”Start” bevaras.
- För Hallar-megamenyn: sex gröna lokala SVG-ikoner i `public/icons/halls/`, rubrik + en kort beskrivning per länk, tätare avstånd.
- Hover **variant C**: tunn grön understrykning som animeras vänster → höger med samma 240 ms-kurva som AMP-002, utan grön hoverplatta. Behåll tillgänglig fokusram och reduced-motion.
- Ingen ändring i AMP-002:s paket/runtime, offertguiden, split-hero eller kundens drift.

**En sen separat favicon-commit** `9bcb8ed` inkluderades tillfälligt i PR #43 och orsakade fel i bildrättighetsgrinden (PNG saknade godkännande och deklarerades med SVG-MIME). Den återställdes i commit `1675a016`; det ursprungliga favicon-arbetet finns kvar i Git-historiken men är **inte** del av den godkända releasen. Återinför det inte slentrianmässigt. Om favicon ska hanteras, använd en separat PR med rätt MIME och dokumenterade rättigheter.

**Teknisk testnotering:** Windows workflow hade ett intermittent syntetiskt Chrome-starttest med 1,5 sekunders deadline. Endast testfixturens timeout för exit/ready (inte hängtest eller faktiska webbläsarkrav) ökades i PR #43 commit `4fcd587`; därefter passerade Linux och Windows release tooling. Ingen säkerhetsgrind får försvagas.

## 2. Bevara kvällens redan färdiga arbete

- **PR #39** samlade sex hallar, fotorealistiska WebP-konceptbilder, totalentreprenadtexter, Om Hallpartner och första helgcheckpointen. Mergad som `f855a026`.
- **PR #40** införde sex split-heroes med tydlig 50/50-avgränsning, **grön gradient endast i textpanelen**, bild till höger, mobilstapling och **inga synliga AI-bildskyltar**. Mergad som `77d1b126`. Bilderna är fortfarande konceptillustrationer, inte verkliga referensprojekt. Inga generella produktionsrättigheter har verifierats oberoende.
- **PR #42** uppgraderade AMP-002 till Spacious Navigation, med `classic-mega-menu` och befintlig header/CTA. Mergad som `ca83b8f8`. Plattformspinnen är ändrad sedan originalcheckpointen; läs aktuell `package.json` och låsfil, anta inte gamla `4ee0a081`.
- Commit **`15a607f`** lade in sex hallikoner i `public/icons/halls/`. Ikonerna används av megamenyn först genom PR #43:s CSS. `README.txt` i användarens lokala ikonmapp var tidigare en ospårad fil och ska inte raderas utan kontroll.
- AMP-001 offertguiden har ett separat preview-testflöde med syntetisk testmottagning. Utgå från den **verifierade 2026-11-05-checkpointen**, inte äldre beskrivningar om generellt avstängd V2. Ändra inte tekniken eller skicka riktiga kunduppgifter utan uppdrag.

## 3. Nästa prioritet när PR #43 är publicerad och verifierad

**Först: sluta justera godkänd navigation.** Inga fler gradient-, hover- eller icon-finjusteringar utan konkret problem.

1. **P0 – Kundens verkliga leveransomfattning och ansvar.** Utred med Peter/Jimmy vad som ingår i totalentreprenad och ”från bygglov till färdig hall”, hur kommun-/myndighetskontakter fungerar, vem som är avtalspart/byggherre, garantier, försäkringar, underentreprenörer, mark/grund och installationer. Uppdatera endast faktastyrkta webbtexter efter godkännande. Se TODO **HP-009, HP-010, HP-011, HP-015, HP-050** i PR #2.
2. **P1 – Granska kundresan och säljinnehållet.** Sidan `/sa-gar-det-till/` beskriver redan en process, men verifiera att stegen faktiskt matchar Hallpartners arbetssätt. Säkerställ att offertvägar, produktkategori-texter och relevanta CTA:er håller ihop. Se **HP-005, HP-012, HP-029–031, HP-051**.
3. **P1 – Bild- och faktagranskning inför kundlansering.** Verifiera företagets kontaktuppgifter och referensprojekt; planera autentiska hallbilder och rättigheter. Nuvarande AI-konceptbilder är endast temporära previewbilder. Se **HP-017, HP-018, HP-046**.
4. **P2 – GitHub-städning/dokumentation.** [Issue #41](https://github.com/Amelio-AB/hallpartner/issues/41) omfattar äldre grenar och öppna PR:er. Rädda först användbara delar av gamla Draft PR #2 (TODO/beslutsregister) och #4 (bild-/webbplatsplan), jämför #6 och #9:s säkerhets-/formförbättringar med aktuell `main`. Stäng inte PR eller radera grenar på ålder eller utan kontroll av unik kod. Begär separat godkännande innan faktisk radering. Läs också denna överlämnings dokumentations-PR innan nytt register skapas.

**Lansering till kunddomänen är inte beslutad.** Inleed-preview ska förbli noindex. Inga externa kalkylatorer/priser/köpflöden ska byggas utan nya verifierade leverantörsunderlag.

## 4. Rapportformat i nästa chatt

Ge en kompakt status med: faktiskt `main`-SHA, faktiskt publicerad preview-SHA/bevis, aktiva PR:er, senaste testutfall, kvarvarande blockerare samt **en tydlig prioriterad rekommendation**. Börja med det som blockerar verklig kundnytta, inte redan godkända designmikrodetaljer.

Denna överlämning är skapad på en **separat dokumentationsgren** för att inte ändra PR #43:s testade källversion. Kontrollera om dokumentations-PR:n senare har mergats; fram till dess läs den direkt från dess branch. Ingen automatisk publicering följer av dokumentets existens.
