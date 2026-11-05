# Aktuell leveranscheckpoint – offertguidens mottagning (2026-11-05)

**Läs först** [checkpointen för V2 och Inleed-preview](docs/checkpoints/2026-11-05-offert-v2-inleed-preview.md)
och kontrollera därefter aktuell GitHub-HEAD, GitHub Actions och live-preview.
PR #26 och #27 är mergade. `8d50c82` publicerades med grön körning
`42095152188`; ett riktigt syntetiskt inskick gav HTTP 200 och referensen
`aeb3c18da57f497ff2949777`, vars mejlleverans Andreas bekräftade.
**Skicka förfrågan är aktiverad enbart på Amelios preview.** Inga fler
testutskick behövs för slutdokumentationen. Tillfällig SSH-nyckel är borttagen.
Äldre pauser, inaktiva flaggor, PR-status och EPIPE-stopp nedan är historiska.
Inleed-kontot `kontakt@amelio.se` är både PHP-avsändare och mottagare;
mejlen vidarebefordras till `andreas@amelio.se` och läses i Gmail. Gallring
inom 30 dagar omfattar kopior i båda tjänsterna inklusive papperskorgar.

---
 
# AGENTS.md

## AMP-001 1.5.0 – aktiv offertguidekandidat (2026-11-04)

Verifierad privat plattformskälla 1.5.0:
`4ee0a081c3d799cd30e3075247fdb98473aa49f6`.
**Draft-PR #22** innehåller en arbetskandidat med **fem frågesteg och ett automatiskt granskningssteg**.
Läs [`docs/content/HALLPARTNER_OFFERTGUIDE_V2.md`](docs/content/HALLPARTNER_OFFERTGUIDE_V2.md)
för fältnycklar, frågeformuleringar, villkor och öppna kundbeslut.
[`docs/AMP_001_150_HALLPARTNER.md`](docs/AMP_001_150_HALLPARTNER.md) är en historisk
checkpoint från fyrastegsläget.

**Alla offertinskick är hårt avstängda i denna kandidat**, även när
`PUBLIC_HP_LEADS_ENABLED=true`. Nuvarande PHP-`/api/lead.php` accepterar bara
det gamla V1-kontraktets allowlist och får aldrig ta emot V2-frågor eller filer.
Opt-in `PUBLIC_HP_QUOTE_FILES_REVIEW=true` visar frivilligt filfält i steg 4
endast för lokal granskning; ingen överföring sker.
Ändra inte privat SMTP, PHP-mottagare, kundens WordPress eller DNS.
**PR #22 förblir Draft utan merge eller publicering** tills ägargranskning.
Previewn publiceras endast från `main` via separat workflow.

# Hallpartner webbplats -- AI Agent Guide

> Detta dokument är den primära instruktionen för alla AI-agenter som
> arbetar i projektet. Läs dokumentet innan någon kod skrivs eller
> ändras.

---

## Ordinarie arbetsyta och webbplats (2026-11-04)

Ordinarie lokal arbetsmapp är `C:\webbprojekt\hallpartner`. Använd en
feature-branch i denna mapp; skapa inte fler cleanup-/review-mappar,
kloner eller worktrees för vanligt utvecklingsarbete. Backup utanför den
aktiva mappen är tillåten och ska inte förväxlas med en konkurrerande arbetsyta.
Kontrollera först faktisk lokal HEAD, Git-status och eventuell worktree-koppling.
Äldre rapporter är inte bevis för dagens läge. Använd aldrig generell
`reset --hard`, `git clean` eller rekursiv radering för att dölja okänt arbete.

Den konsoliderade besökarkoden använder:

- `src/layouts/HallpartnerSiteLayout.astro` som gemensamt sid-skal.
- `src/components/SiteHeader.astro` som adapter till riktig AMP-002,
  `classic-mega-menu` med ikonhamburgare och serverrenderad reservnavigation.
- `src/components/home/HallpartnerHome.astro` som startsidans innehåll.

Bildpiloterna, galleri, AMP-006 och använda bilder bevaras. Skapa inte nya
publika prototype-/demo-/review-rutter; testa de riktiga besökarsidorna.
`src/pages` får endast bygga de tretton avsedda HTML-sidorna i
`scripts/preview/policy.mjs`. Återinför inte pensionerade `/prototype/`,
`/projekt/`, `/roadmap/`, `/vision/` eller `/workshop/` från gamla PR:er.
Namn som `hp-draft` i befintlig CSS är kompatibilitetsnamn för den använda
designen, inte tillstånd att skapa en parallell webbplats. Historiska
rapporter, använda komponenter, tester och Git-historik ska bevaras.

Se [konsolideringscheckpointen](docs/checkpoints/2026-11-04-site-consolidation.md)
för exakt flytt-/borttagningslista och återstående gränser. Den dokumenterar
kodändringen, inte ett påstående om lokal städning, merge eller publicering.
Kontrollera PR/HEAD och aktuella tester innan arbete fortsätter; en grön
byggkontroll är inte bevis för att previewn visar samma commit.

---

## Aktuellt scope: inga kundpriser eller köp i v1 (2026-11-02)

Peter har meddelat att Hallpartner fortfarande förhandlar med en leverantör
och inte har någon kalkylator man vill använda. Andreas har därför beslutat
att **den nya webbplatsen ska fortsätta byggas utan extern konfigurator**.

- Bygg och granska hallar, innehåll, kontaktvägar och den fristående
  **AMP-001-offertförfrågan** utan beroende av leverantör, prislista,
  automatiska priser, checkout eller köpknapp.
- `/offert/` är en kort **inaktiv arbetsguide** tills kundens frågor, säker
  servermottagning, SMTP/inbox och integritetsinformation har godkänts.
  Fungerande `/kontakt/` med telefon/mejl ska fortsatt vara alternativet.
- Gör inga provisoriska API-/iframe-kopplingar eller publik
  kalkylatorfunktion. Återuppta ett separat kalkylatorspår först efter att
  Hallpartner valt lösning och godkänt integrationens omfattning och kostnad.
- Beslutet dokumenteras också i
  [checkpointen](docs/checkpoints/2026-11-02-calculator-paused.md) och i
  [projektbeslutsregistret i dokumentations-PR #2](https://github.com/Amelio-AB/hallpartner/pull/2)
  (HPD-010). Kontrollera PR:ens aktuella status innan äldre dokument används.

Detta är ett **scopebeslut, inte en godkänd produktlansering**; rör inte
noindex, DNS, FTP, credentials eller main på grund av ändringen.

---

# Projektets syfte och publiceringsmål

Repot är kodbasen för Hallpartners nya Astro-webbplats. Äldre sid- och
innehållsspecifikationer beskriver delvis visionskonceptet, inte beslutad
produktionsstruktur. Använd aktuell kod, beslut och verifierat kundunderlag.

Beslutad utvecklingsadress är https://hallpartner-se.preview2.inleed.com/,
på **Amelios befintliga Inleed-konto**. Kundens nuvarande WordPress ligger
enligt Andreas på ett annat webbhotell. Att Amelios katalog heter
`domains/hallpartner.se/public_html` gör den inte till WordPress-servern.
Skapa ingen ny stagingdomän, inget nytt konto och ingen ny publiceringsrot.
DNS, namnservrar och e-postinställningar får inte ändras.

Inleed har bekräftat att previewadressen skriver om domänreferenser.
Kontrollera serveroriginal exakt via FTPS och HTTPS endast mot den snävt
verifierade transformeringen. Kräv inte en ny miljö för det förväntade
beteendet och normalisera inte bort andra skillnader. Historiska publiceringsrapporter visar att en första publicering senare lyckades,
men de bevisar inte vilken commit previewn visar just nu. Kontrollera aktuella
GitHub Actions, publicerad markör och faktiska serverfiler innan slutsatser dras.

Behåll noindex och robots-spärr. Mål och den registrerade bildanvändningen
är redan beslutade; kontrollera bindning och hashregister utan att begära
samma allmänna bildtillstånd igen. Publiceringsworkflow **316932905** är det befintliga utvecklingspreview-flödet
som kan publicera verifierade pushar till `main`. Kontrollera alltid aktuell
workflowstatus och utfall i GitHub Actions; äldre kommentarer om manuell
avstängning är inte tillförlitliga. **PR-körningar får bara validera**.
Gamla ops-flöden får inte konkurrera med den godkända publiceringen.

Efter godkännande publiceras endast verifierat statiskt innehåll från senaste
main till den markörverifierade previewroten `./`. Automatiken får inte
radera serverfiler. Befintliga publika demos måste avpubliceras med en exakt
granskad filplan och verifierad privat råbackup; en borttagen källroute
raderar inte en tidigare FTP-kopia. Skydds- och konfigurationsfiler som
`.htaccess` och `cgi-bin` får inte behandlas som demofiler.

Se [publiceringsprocessen](docs/preview/README.md) och aktuell överlämning.
Äldre krav där på ny rot eller oidentifierad domänomskrivning är historiska,
inte nya beslut. Kundens framtida Inleed-konto ingår aldrig i automatiken.
Ändra inte secrets eller arkivbranchen `archive/vision-site-2026-10-02`.

---

# Prioritetsordning

När beslut behöver fattas gäller följande ordning:

1. AGENTS.md
2. PROJECT_BRIEF.md
3. DESIGN_SYSTEM.md
4. PAGE_SPEC.md
5. COMPONENTS.md
6. TECHNICAL_SPEC.md
7. CONTENT.md

Vid konflikter har dokument högre upp företräde. Aktuella uttryckliga
kundbeslut och faktisk kod-/miljöverifiering får inte ersättas av en äldre rapport.

---

# Grundprinciper

AI ska alltid:

- Leverera kvalitet före hastighet.
- Bygga långsiktigt hållbar kod.
- Följa Astro best practices.
- Skriva tydlig och självdokumenterande kod.
- Föredra återanvändbara komponenter.
- Minimera beroenden.
- Dokumentera större förändringar.

---

# Arkitektur

Projektet ska vara:

- Modulärt
- Skalbart
- Lätt att underhålla
- Mobile First
- Tillgängligt enligt WCAG 2.2 AA

Nya komponenter ska endast skapas när befintliga inte räcker.

---

# Designfilosofi

Varje beslut ska stödja följande känsla:

- Premium
- Skandinaviskt
- Arkitektoniskt
- Industriellt
- Lugn
- Trovärdig

Undvik visuellt brus och onödig komplexitet.

---

# Kodregler

- TypeScript strict mode
- Semantisk HTML
- En komponent = ett ansvar
- Inga hårdkodade värden utan motivering
- Tydliga props och typer
- Minimera JavaScript

---

# Live preview -- obligatorisk kontrollpunkt

Den beslutade granskningsadressen är:

https://hallpartner-se.preview2.inleed.com/

Identifiera först den faktiskt publicerade versionen. Previewn kan ligga
äldre än main; dess tillgänglighet eller en grön CI innebär inte senaste kod.
AI-agenter som arbetar med design, innehåll, layout, navigation,
responsivitet eller komponenter ska använda previewn som faktisk
kontrollpunkt när rätt version har publicerats, inte bara läsa koden.

Previewn är INTE ett godkänt facit. Granska den kritiskt. Identifiera konkret:

- vad som fungerar och bör bevaras
- vad som är otydligt, svagt eller visuellt inkonsekvent
- vad som inte stödjer Hallpartners affärsmål eller bygger förtroende
- problem på mobil och desktop
- förbättringar som ger tydlig nytta före kosmetiska detaljer

Utgå inte från att befintlig design är rätt bara för att den redan är byggd.
När publicering är avstängd ska den testade kandidaten granskas lokalt eller
i CI. Redovisa detta som kandidatgranskning, aldrig som publiceringsbevis.

---

# Arbetsflöde

Innan kod skrivs:

1. Läs relevant dokumentation och kontrollera aktuell status.
2. Granska relevant sida i rätt version när uppgiften påverkar UI/innehåll.
3. Identifiera befintliga komponenter.
4. Bedöm påverkan på design och arkitektur.
5. Implementera i befintlig arbetsmapp på en avgränsad branch.
6. Testa kandidaten och granska resultatet i preview efter godkänd deployment.
7. Uppdatera dokumentation vid behov.

Skilj i rapporten mellan ändrat, testat, mergat, publicerat och lokalt verifierat.

---

# Definition of Done

En uppgift är klar när:

- Koden bygger utan fel.
- Designen följer designsystemet.
- Komponenten är återanvändbar.
- Tillgänglighetskrav är uppfyllda.
- Responsivitet är verifierad.
- Dokumentation är uppdaterad.
- UI-förändringar är visuellt granskade i live preview efter deployment.

---

# Vanliga fallgropar

Undvik att:

- Duplicera komponenter eller skapa parallella webbplatsmappar.
- Radera använd kod utifrån ett filnamn som prototype, demo eller legacy.
- Skapa stora monolitiska filer.
- Bryta designsystemet.
- Lägga till onödiga bibliotek.
- Försämra prestanda för små visuella vinster.

---

# Checklista före commit

- [ ] Projektet bygger utan fel
- [ ] ESLint passerar
- [ ] Relevanta Node-/PHP- och webbläsartester passerar
- [ ] Responsivitet kontrollerad
- [ ] Tillgänglighet verifierad
- [ ] Metadata uppdaterad
- [ ] Dokumentation uppdaterad
- [ ] Relevant preview-sida granskad efter deployment vid UI-förändringar

---

# Framtida utveckling

Arkitekturen ska vara redo för:

- CMS
- Blogg
- Referensprojekt
- Kontaktformulär
- Flerspråkighet
- Analysverktyg
- SEO-utbyggnad

---

# Slutord

Målet är en hållbar webbplats som kan utvecklas tillsammans med
Hallpartners verksamhet.

Version 1.1 – konsoliderad besökarkod och en ordinarie arbetsmapp.
