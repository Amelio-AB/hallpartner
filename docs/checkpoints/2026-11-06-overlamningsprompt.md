# Överlämningsprompt till nästa agent – Hallpartner, efter fredagen 6 november 2026

Du fortsätter Amelios Hallpartner-projekt efter en omfattande utvecklingsdag. **Börja med faktagranskning av aktuell live-status – ändra inte kod förrän du vet vad som faktiskt ligger på `main`.**

**Läs hela** [helgcheckpointen](2026-11-06-helg-hallar-bilder-omoss.md), `AGENTS.md`, `README.md`, release-PR:ens kommentarer, GitHub Actions och `src/pages`. Äldre handoverdokument kan vara motstridiga: kontrollera dagens GitHub-bevis och använd inte historiska rapporter som dagens fakta.

Repo: `Amelio-AB/hallpartner`. Normal lokal arbetsmapp: `C:\webbprojekt\hallpartner`. Inleed-preview: `https://hallpartner-se.preview2.inleed.com/`. Kundens WordPress finns hos annan leverantör. **Ingen DNS-/WordPress-/SMTP-ändring**, ingen ny previewdomän, ingen parallel local workspace, ingen destruktiv Git-städning.

## Uppdragets ordning

**1. Fastställ releasedatum och status.** Verifiera aktuellt `main`-SHA, öppna PR:er, Actions för Inleed-preview, serveroriginal och faktisk webbläsarversion där möjligt. Kontrollera att den samlade releasen med sex hallsidor, AI-hero-bilder och ”Om Hallpartner” är mergad, att en enda release-PR användes och att GitHub Actions på exakt `main` har passerat alla gates. Om release inte är godkänd, hantera fel öppet; uppge ingen lyckad publicering utan bevis.

**2. Städa bara dokumenterad releaseöverlappning.** PR #37 och #38 har ersatts av en samlad releasekandidat. När en samlad PR är mergad kan överlappande Draft-PR:er stängas med kommentarer, **utan branchradering**. Rör inte de historiska PR:erna eller kundprojektet utan separat uppdrag.

**3. Föreslå högst tre konkreta nästa utvecklingssteg**, vägt efter säljnytta och risk. Den nyckelfärdiga leveransen/totalentreprenaden är kundbekräftad, men garantier, försäkringar, formellt projekteringsansvar och exakt vad som ingår per avtal måste kunna styrkas innan produktionssajt. Ge en prioriterad rekommendation och avgränsa en liten Draft-PR. Gör inte något påhittat juridiskt påstående.

**4. Behåll det som är färdigt.** Startsida med ”Nyckelfärdiga hallar”, AMP-001 sexstegs-offertguide, sju steg på ”Så går det till”, sex godkända hallsidor med ljus gradient i hero, personporträtt, Header/Footer/galleri. AI-bilder är märkta illustrationsbilder och ska senare ersättas med kundfoton, inte beskrivas som genomförda projekt. Offertguiden ska inte få en kalkylator eller omarbetas på eget initiativ.

## Rapportera tydligt

- Senaste verifierade `main`-SHA och vilken commit som ligger på Inleed-previewn.
- Exakta PR:er, testkörningar, förväntade vs faktiska blockerare.
- Vad som har publicerats och vad som återstår.
- En föreslagen nästa uppgift inklusive omfattning, testplan och om ägarbeslut behövs.

Detta är en **helgöverlämning**. Användarens nästa kontakt kan ske nästa vecka. Starta inga automatiska scheman eller bakgrundsjobb, använd inte gamla arbetsuppgifter som trigger för överarbete.
