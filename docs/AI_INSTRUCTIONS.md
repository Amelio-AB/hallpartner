# AI_INSTRUCTIONS.md

# Hallpartner Vision Site -- AI Development Instructions

## Syfte

AGENTS.md är primär instruktion. Detta dokument kompletterar den för AI-assistenter
(Codex, Cursor, Claude Code m.fl.) som arbetar i projektet. Målet är att
säkerställa ett konsekvent arbetssätt, hög kodkvalitet och ett enhetligt
resultat.

---

# Projektets mål

Utveckla Hallpartners riktiga webbplats i Astro. I migration phase 1 bevaras
befintliga sidor och komponenter: **pending live-site inventory**. Behåll noindex
och endast FTP dry-run enligt AGENTS.md och README.md. Webbplatsen ska:

- Förmedlar en premiumkänsla
- Är snabb, tillgänglig och responsiv
- Är lätt att vidareutveckla
- Följer projektets designsystem och tekniska specifikation

AI ska alltid prioritera kvalitet framför hastighet.

---

# Arbetsprinciper

AI ska:

- Läsa relevant dokumentation i `/docs` innan kod skrivs.
- Återanvända befintliga komponenter före skapande av nya.
- Föreslå förbättringar när de är tydligt motiverade.
- Undvika att duplicera kod eller logik.
- Hålla varje komponent fokuserad på ett ansvar.

---

# Dokument att följa

Prioritetsordning:

0.  AGENTS.md
1.  PROJECT_BRIEF.md
2.  DESIGN_SYSTEM.md
3.  PAGE_SPEC.md
4.  COMPONENTS.md
5.  TECHNICAL_SPEC.md
6.  CONTENT.md

Vid konflikt gäller dokument högre upp i listan.

---

# Kodstandard

- TypeScript i strict mode
- Semantisk HTML
- Mobile First
- CSS-variabler
- Beskrivande namn
- Tydliga props
- Små komponenter
- Inga "magic numbers" utan motivering

---

# Designregler

- Premium före komplexitet
- Mycket luft
- Tydlig typografisk hierarki
- Konsekvent spacing
- Diskreta animationer
- Ingen överdesign

---

# Tillgänglighet

Alla nya funktioner ska:

- Fungera med tangentbord
- Ha synliga fokusmarkeringar
- Ha korrekt rubrikhierarki
- Inkludera alt-texter
- Respektera `prefers-reduced-motion`

---

# SEO

AI ska säkerställa:

- En H1 per sida
- Unika metadata
- Intern länkning
- Semantisk struktur
- Optimerade bilder

---

# Prestanda

Mål:

- Minimal JavaScript
- Lazy loading
- Responsiva bilder
- Lighthouse ≥ 95

---

# Beslutsregler

Innan ny kod skapas ska AI fråga sig:

1.  Finns redan en komponent?
2.  Är lösningen återanvändbar?
3.  Följer den designsystemet?
4.  Är den tillgänglig?
5.  Är den enkel att underhålla?

Om svaret är nej ska lösningen omarbetas.

---

# Dokumentation

Vid större ändringar ska AI:

- Uppdatera relevant dokument i `/docs`
- Beskriva varför ändringen gjordes
- Hålla dokumentationen synkroniserad med koden

---

# Leveranskriterier

Projektet anses färdigt när:

- Bygget är felfritt
- Designen följer visionen
- Alla sidor är responsiva
- Tillgänglighetskraven uppfylls
- Dokumentationen är uppdaterad

---

Version 1.0
