# Överlämningsprompt – fortsätt utvecklingen av Hallpartner.se

Kopiera texten mellan avgränsarna till en **ny chatt i Hallpartner-projektet**. Uppdraget börjar med granskning och prioritering, inte ompublicering av offertguiden.

---

Du ska fortsätta utvecklingen av **Hallpartners nya Astro-webbplats**. Vi har precis avslutat en stor teknisk milstolpe: hela offertguiden fungerar på Amelios Inleed-preview, med riktig inskickning, en separat tacksida och en mejlkopia till besökaren. Vi vill nu återgå till **utvecklingen av webbplatsen som helhet**.

## Läs först – ny samlad checkpoint

**Kanonisk överlämning för detta uppdrag:**
https://github.com/Amelio-AB/hallpartner/blob/codex/issue-29-release-checkpoint/docs/checkpoints/2026-11-06-hallpartner-helhetscheckpoint.md

**Slutligt tekniskt bevis från förra etappen:**
https://github.com/Amelio-AB/hallpartner/pull/31

Läs hela helhetscheckpointen samt relevanta delar av `AGENTS.md` och nuvarande källkod. **Var vaksam på äldre dokument som fortfarande säger att offertguiden är inaktiv eller att PR #22 är aktuell.** De påståendena är historiska och upphävs av nyare verifierade leveransbevis. Färsk GitHub- och previewstatus har företräde framför gamla rapporter.

## Nuläge att verifiera – inte anta

- Repo: https://github.com/Amelio-AB/hallpartner
- Ordinarie arbetsmapp på min Windows-dator: `C:\webbprojekt\hallpartner`. Inga ytterligare normala worktrees eller kopior.
- `main` var vid checkpointen `931e2149d5477e33aaa4d19bbaa7ad264b04d320`.
- Publicerad utvecklingspreview: https://hallpartner-se.preview2.inleed.com/
- Offertguide: https://hallpartner-se.preview2.inleed.com/offert/
- Tacksida: https://hallpartner-se.preview2.inleed.com/offert/tack/
- Senast verifierade GitHub-publicering: https://github.com/Amelio-AB/hallpartner/actions/runs/42121351331 (success för `931e214`).
- PR #31 innehåller slutdokumentation och helhetscheckpoint och är ännu inte mergad vid överlämningen. **Merga den inte slentrianmässigt**: en push till `main` kan starta ny preview-publicering.
- Den privata PHP-mottagaren uppdaterades separat och godkändes med fulla SHA-256-kontroller, backup och rollback. Ett syntetiskt inskick gav referensen `bd890a1c2bd661b183b91dd2`; båda separata mejlen verifierades i Gmail och bekräftades av mig. SSH-nyckeln för agenten är borttagen. **Inga fler testinskick behövs** för att bevisa samma funktion.
- Kundens nuvarande WordPress ligger på ett annat webbhotell. DNS, det gamla WordPress-systemet och kundens framtida hostingkonto får inte ändras.

## Viktiga beslut som ska bestå

1. **Offertguiden är färdig för kundgranskning.** Den har fem frågesteg och ett automatiskt granskningssteg. Obligatoriskt: användningsområde, namn och e-post. Projektbeskrivning och övriga vanliga projektuppgifter är frivilliga; villkorad telefonregel kan gälla. Endast lyckad serverkvittens leder till tacksidan. Besökaren får en separat kopia av sina svar. Rör inte detta fungerande flöde utan ett nytt motiverat uppdrag.
2. **Ingen prisberäkning, extern hallkalkylator, filuppladdning eller e-handel i version 1.** Leverantörens kalkylator är pausad tills Hallpartner faktiskt valt en lösning.
3. **Mejl på Amelios preview:** `kontakt@amelio.se` ligger på Inleed, används som avsändare och primär mottagare och vidarebefordrar till `andreas@amelio.se` i Gmail. Kundkopian går till den adress som besökaren angivit. Amelio, inte Hallpartner, ansvarar för nuvarande previewmottagning. Nytt kundkonto/produktionsflöde kräver eget godkännande och verifiering.
4. **Ingen ny stagingdomän eller DNS-förändring.** All vanlig utveckling görs i `C:\webbprojekt\hallpartner`. Astro, TypeScript och låst Amelio Web Platform ska återanvändas.
5. Preview ska förbli **noindex/nofollow** med robots-spärr. Faktiska produktpåståenden, garantier, montage, bygglov, dimensionering, bilder och referenser får inte presenteras som verifierade utan kund- eller fackunderlag.
6. **Återuppta inte det tidigare arbetet med 36 frågor eller ett nytt frågeformulär till Peter och Jimmy.** Det spåret avslutades uttryckligen. Frågor om verksamhetsfakta får bara lyftas när de behövs för en konkret text eller ett nytt beslut.

## Webbplatsen vi nu ska utveckla

Det finns en verklig startsida, hallöversikt, sex undersidor för halltyper, Kontakt, Om oss (med Peter/Jimmy), Inför ditt projekt, offertguide och integritetssida. Den responsiva Headern bygger på AMP-002; Footer på AMP-003, och bildgalleri samt AMP-006-kort finns redan. Riktiga sidor ska utvecklas – inga nya publika prototyper.

Den aktiva layouten använder mörka gröna toner. **Utgå från faktiskt använd CSS/config och den aktuella previewn**, inte gamla paletter i visionsdokumenten.

Kända önskemål: ett eventuellt sökfält i Header (utred behovet först) och Hallpartners symbol som dekorelement i Footer eller lämpliga sektioner. Headerns offert-CTA finns redan. Dessa visuella saker ska inte prioriteras framför att webbplatsens erbjudande är begripligt och faktamässigt korrekt.

## Vad jag vill att du gör först

**Steg 1 – Läsande nulägeskontroll.** Kontrollera GitHub `main`, öppna PR:er, senaste GitHub Actions, lokal Git-status om du faktiskt har datoråtkomst och den publicerade previewn. Jämför den faktiska webbplatsens sidor med vad nyaste checkpointen säger. Redovisa tydligt vad du har verifierat själv och vad som bygger på dokumenterade releasebevis. Ingen kodändring, publicering, merge eller filradering i detta första steg.

**Steg 2 – Kritisk granskning av webbplatsen.** Bedöm startsidan, hallöversikten och undersidorna utifrån frågorna: Förstår en ny besökare vad Hallpartner erbjuder? Skiljs hallens användning från utförande? Finns obestyrkta produkt- eller leveranslöften? Är bilderna relevanta och rättigheterna klarlagda? Fungerar kontaktvägen, CTA:erna och den mobila användarresan? Titta på previewn, men behandla den inte som ett facit.

**Steg 3 – Prioriterat nästa arbetsförslag.** Ge mig en tydlig rangordning av de tre viktigaste förbättringarna, med konkret effekt, arbetsinsats, beroenden och rekommendation om vilket vi ska göra först. Prioritera framför allt:
- Hallpartners faktiska produktutbud, montage-/leveransansvar och kritisk faktagranskning av sidtexter;
- enhetlig och begriplig struktur/copy på startsida och hallsidor;
- bildrättigheter, verkliga referenser och eventuella kompletterande fotografier;
- dokumentationshygien: `AGENTS.md`, `README.md` och gammal TODO i Draft PR #2 är delvis inaktuella, men ska inte okritiskt mergas.

När jag har valt det första förbättringsspåret ska du hjälpa mig att genomföra det i en avgränsad branch/PR och testa det. **Publicering till preview och merge till main kräver mitt uttryckliga godkännande.**

## Arbetssätt och kommunikation

Skriv på naturlig svenska. Var konkret, konstruktivt kritisk och ifrågasätt gamla antaganden. Återanvänd befintlig kod och komponenter, undvik extra beroenden och parallella arbetsmappar. Använd inga vaga formuleringar om att något är ”klart” om det inte är testat och faktiskt publicerat. Skilj alltid på **lokal kod, PR-kandidat, merge, publicerad preview och kundgodkänt innehåll**.

Jag vill inte ha ytterligare felsökning av den redan färdiga offertguiden eller nya omfattande kundfrågeunderlag. Hjälp mig fokusera på det som har störst effekt på Hallpartners nya webbplats. Fråga bara efter ett specifikt kundbeslut när det faktiskt behövs.

**Börja nu med nulägeskontrollen och ge mig ditt prioriterade förslag till nästa utvecklingsinsats.**

---
