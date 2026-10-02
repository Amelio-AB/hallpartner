# AGENTS.md

# Hallpartner webbplats -- AI Agent Guide

> Detta dokument är den primära instruktionen för alla AI-agenter som
> arbetar i projektet. Läs dokumentet innan någon kod skrivs eller
> ändras.

---

# Projektets syfte

Repot är kodbasen för Hallpartners riktiga webbplats på https://hallpartner.se.
Migration phase 1 förbereder preview och teknisk grund. Fokus ligger på
kvalitet, förtroende och långsiktig affärsnytta.

Befintliga sidor, komponenter och bilder bevaras tills live-sajten inventerats:
**pending live-site inventory**. Äldre sid- och innehållsspecifikationer
beskriver visionskonceptet, inte beslutad produktionsstruktur.

Preview: https://hallpartner-se.preview2.inleed.com. Previewmiljön är live och
ska användas som visuell kontrollpunkt under utvecklingen. Behåll noindex.
GitHub Actions deployar till FTP-kontots root `./` utan `--delete`.
DNS för hallpartner.se ska inte ändras i utvecklingsarbetet. Ändra inte
secrets eller arkivbranchen `archive/vision-site-2026-10-02`.

---

# Prioritetsordning

När beslut behöver fattas gäller följande ordning:

1.  AGENTS.md
2.  PROJECT_BRIEF.md
3.  DESIGN_SYSTEM.md
4.  PAGE_SPEC.md
5.  COMPONENTS.md
6.  TECHNICAL_SPEC.md
7.  CONTENT.md

Vid konflikter har dokument högre upp alltid företräde.

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

Den aktuella utvecklingsversionen finns på:

https://hallpartner-se.preview2.inleed.com/

AI-agenter som arbetar med design, innehåll, layout, navigation, responsivitet
eller komponenter ska använda previewn som en faktisk granskningsyta, inte bara
läsa koden.

Previewn är INTE ett godkänt facit. Granska den kritiskt. Identifiera konkret:

- vad som fungerar och bör bevaras
- vad som är otydligt, svagt eller visuellt inkonsekvent
- vad som inte stödjer Hallpartners affärsmål eller bygger förtroende
- problem på mobil och desktop
- förbättringar som ger tydlig nytta före kosmetiska detaljer

Utgå inte från att befintlig design är rätt bara för att den redan är byggd.
När en uppgift påverkar UI ska relevant sida granskas i preview före större
ändringar och igen efter deployment.

---

# Arbetsflöde

Innan kod skrivs:

1.  Läs relevant dokumentation.
2.  Granska relevant sida i live preview när uppgiften påverkar UI/innehåll.
3.  Identifiera befintliga komponenter.
4.  Bedöm påverkan på design och arkitektur.
5.  Implementera.
6.  Testa lokalt och granska resultatet i preview efter deployment.
7.  Uppdatera dokumentation vid behov.

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

- Duplicera komponenter.
- Skapa stora monolitiska filer.
- Bryta designsystemet.
- Lägga till onödiga bibliotek.
- Försämra prestanda för små visuella vinster.

---

# Checklista före commit

- [ ] Projektet bygger utan fel
- [ ] ESLint passerar
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

Version 1.0
