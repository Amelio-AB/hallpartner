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

## 1. Aktuell release och första åtgärd

**Navigationens release är slutförd.** PR #43 är mergad och både main och faktisk Inleed-preview är `53afac8c3d1d7d990605db65c51f59ee838ca640`. [Publicering #42300087820](https://github.com/Amelio-AB/hallpartner/actions/runs/42300087820) är grön inklusive publish. 94 filer, samtliga 15 besökarsidor och live-Chrome har verifierats; ingen senare publicering var köad. [Kvällscheckpointen](2026-11-06-kvall-navigation-release.md) länkar till manifest-/markörbevis, browserkontroller och kvarvarande begränsningar. Kontrollera ändå aktuell HEAD och preview innan ett nytt arbete påbörjas.

Den tidigare FTPS/HTTPS-blockeringen är förklarad: en samtidig ompublicering av samma commit skrev om en JSON-markör mellan kontrollens två läsningar. 143/144 filer matchade; endast markören avvek. Hasharna identifierar exakt föregående och ny markör. [Utredningen](../preview/release-navigation-20261106.md) visar även concurrency-gränsen. Oförändrad PR-HEAD kördes om med stilla publicerare och blev helt grön före merge. Ingen säkerhetsspärr eller design ändrades.

### Återstående separata PR:er

- **[Favicon PR #46](https://github.com/Amelio-AB/hallpartner/pull/46) är Draft**, inte mergad/publicerad. Den återställer användarens PNG byteexakt, sätter `image/png` i båda layouts och tar bort konkurrerande SVG-/ICO-referenser. Lokal build/lint/122 Node-tester och faktisk Chrome-avkodning är godkända. Följ dess aktuella Actions separat; navigationens gröna release verifierar inte framtida favicon-publicering.
- **Retentionbeslutet är godkänt 2026-11-07:** Andreas svarade ”Godkänn exakt bevarande” för endast den orefererade serverfilen `favicon.svg`, SHA-256 `a93cfae97a15bc8add4a877b793c7e9e5ae9187a7de76eaca2dee9a72099da13`. Det är registrerat på PR #46 i `94127cc4d5ed69d60a8aaf7aef05017817651a35`; den tidigare saknade retentionauktorisationen ska inte begäras igen. Exakt hashkontroll kvarstår. Beslutet omfattar ingen radering, merge eller publicering. Kontrollera gröna Actions på uppdaterad HEAD inför ett separat releasebeslut; båda PR:erna förblir Draft.
- **PR #44 för denna dokumentation ska förbli separat och Draft. Merga den inte automatiskt:** även en dokumentationsmerge kan utlösa ny main-publicering.

### Bevara godkänd navigation

Alla 13 breadcrumb-rader har `#153129` över full bredd och centrerad innehållsrail. Startsida är borta ur huvudmenyn; logotyp och breadcrumbs länkar hem. Hallar-megamenyn har sex gröna ikoner, beskrivningar och godkänd 240 ms-understrykning. AMP-002 Spacious, mobilmeny, fokus och reduced-motion är verifierade. Split-hero, AMP-runtime och formulärlägen ändrades inte.

Den godkända previewn är fortfarande noindex och är inte en produktionslansering. WordPress, DNS och SMTP är orörda. Nästa innehållsspår ska utgå från verifierade kundfakta om totalentreprenad och processen från första kontakt till färdig hall; genomför inga nya designändringar utan uppdrag.

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
