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

Preview: https://hallpartner-se.preview2.inleed.com. Behåll noindex.
FTP får i denna fas endast köras med dry-run mot kontots root `./`.
Granska resultatet före aktivering av upload. Ändra inte DNS, secrets eller
arkivbranchen `archive/vision-site-2026-10-02`.

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

# Arbetsflöde

Innan kod skrivs:

1.  Läs relevant dokumentation.
2.  Identifiera befintliga komponenter.
3.  Bedöm påverkan på design och arkitektur.
4.  Implementera.
5.  Testa.
6.  Uppdatera dokumentation vid behov.

---

# Definition of Done

En uppgift är klar när:

- Koden bygger utan fel.
- Designen följer designsystemet.
- Komponenten är återanvändbar.
- Tillgänglighetskrav är uppfyllda.
- Responsivitet är verifierad.
- Dokumentation är uppdaterad.

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
