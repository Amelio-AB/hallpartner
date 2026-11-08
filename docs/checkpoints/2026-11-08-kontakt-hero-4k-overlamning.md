# Hallpartner – checkpoint och överlämning: kontakt-hero på 4K (2026-11-08)

> **Passiv överlämning efter projektägarens visuella granskning.** Inga nya kodändringar, commits av användarens lokala arbete, merges, pushar eller publiceringar ingår. Fakta om lokal arbetsyta bygger på användarens Codex-rapport/skärmbild och har **inte** verifierats via direkt filåtkomst i denna GitHub-session.

## 1. Var nästa agent börjar

**Första uppdraget är en läsande inventering och därefter en avgränsad fix för hero-bildens beskärning på stora skärmar, endast efter kontroll av aktuell lokal Git-status.** Undvik att omarbeta kontaktsidans innehåll eller offertsidans teknik för att lösa bildproblemet.

- Repo: [Amelio-AB/hallpartner](https://github.com/Amelio-AB/hallpartner).
- Ordinarie lokal arbetsmapp: `C:\webbprojekt\hallpartner`.
- Enda utvecklingspreview: https://hallpartner-se.preview2.inleed.com/.
- Senast verifierade `main`: `7ec2956accbfa16545101f7dfb600aeebca0f705`. [Automatisk Inleed-publicering #42413633236](https://github.com/Amelio-AB/hallpartner/actions/runs/42413633236) är grön på samma SHA. Lokala heroändringar är **inte** med i den publicerade versionen.
- [PR #48](https://github.com/Amelio-AB/hallpartner/pull/48), `codex/hp-042-kontaktvagar-20261108`, HEAD `29015b1f742beb95f8494fab76f10ce8c5d656fd` är öppen **Draft, inte mergad**. [Full PR-validering #42459219579](https://github.com/Amelio-AB/hallpartner/actions/runs/42459219579), CI, release- och Footer-kontroller är gröna. PR:n gäller ett tidigare förslag som visar offert/telefon/mejl i stället för inaktivt kontaktformulär **längre ned på sidan**; den genomför **inte** projektägarens senare val av formulär i högerdelen av heron. **Merga inte PR #48 automatiskt.**
- TODO- och beslutsregistren finns fortfarande i [Draft PR #2](https://github.com/Amelio-AB/hallpartner/pull/2). [PR #44](https://github.com/Amelio-AB/hallpartner/pull/44) är separat Draft med historiska releasebevis. Varken #2 eller #44 får blindmergas.

## 2. Lokalt arbete som måste bevaras

Enligt användarens rapport och VS Code-skärmbild, i `C:\webbprojekt\hallpartner`:

- `public/images/hero/hallpartner-kontakt-hero-illustration.webp` finns **lokalt** och visades med Git-status **U (untracked)** i VS Code. Illustrationen föreställer en tecknad Hallpartner-medarbetare i kontorsmiljö som pratar i telefon, med **användarens original-logotyp på bröstet**. Inga inbakade webbrubriker eller formulär. Bilden är AI-genererad och användaren är nöjd med motivet. Materialet är **inte bekräftat committat eller pushat**.
- `src/styles/hallpartner-info.css`: Codex rapporterade en **lokal ändring om nio CSS-rader vid ungefär rad 12** som använder ovanstående bild endast som bakgrund för `/kontakt/`-heron, med `background-size: cover`, anpassad position och ljus gradient för läsbarhet. Lokal build, lint och browsergranskning rapporterades gröna. **Ingen commit, push, merge eller publicering**.
- Lokala skärmbilder som agenten uppgav: `visual-review/contact-hero/kontakt-1440-hero.png` och `visual-review/contact-hero/kontakt-390-hero.png`, test också vid 320 px. Skärmbilderna och kundens ytterligare 4K-skärmbild delades i ChatGPT-konversationen 2026-11-08; kontrollera att de lokala filerna faktiskt finns innan du använder dem. 4K-bilden finns inte verifierat sparad i GitHub.
- Kontrollera med `git status --short --branch`, `git diff -- src/styles/hallpartner-info.css`, `git ls-files --others --exclude-standard` **innan** `fetch`, `pull`, `checkout` eller något annat som kan störa ändringarna. Det kan finnas *ytterligare* lokalt arbete. Gör ingen `reset --hard`, `git clean`, grenradering eller ny parallell arbetsyta. Utgå inte från att den lokala datorns filer finns på GitHub eller i molnagenten.

## 3. Visuellt godkänt och återstående problem

Användaren har granskat tre vyer av den lokala bakgrundspiloten:

- **Mobil (cirka 390 CSS-px):** illustrationen, ljus gradient och texten upplevs fungera. Ändra inte i onödan.
- **Vanlig laptop:** illustration och layout fungerar enligt användaren. Ändra inte i onödan.
- **27-tums 4K-skärm (kundens första skärmbild):** **inte godkänd ännu**. `cover` gör bakgrundsmotivet kraftigt förstorat; personens huvud kapas av bakom herons övre kant/breadcrumb. Personen och loggan hamnar bakom rubriken och det mörka kontaktkortet, och kompositionen blir obalanserad. Detta är det konkreta kvarvarande bildproblemet.

**Nästa förbättring:** Gör en liten CSS-gränsad lösning för breda/stora CSS-viewports som bevarar motivets beskärning och textkontrast utan att ändra 320–1440-layouten. Utred till exempel separat `background-position` / `background-size` eller en maxbegränsad bildyta för breda skärmar; välj utifrån verkliga skärmbilder, inte antaganden. En 4K-skärm kan ha en betydligt mindre **CSS-viewport** p.g.a. Windows-skalning – mät `innerWidth`, `innerHeight`, `devicePixelRatio` och aktuell browserzoom innan brytpunkter bestäms. Verifiera för 320, 390, 768, 1440 samt användarens faktiska stora viewport och gärna 1920/2560/3840 CSS-px och 200 % text om möjligt.

**Godkännandekrav:** personens huvud ska inte kapas i överkant, rubrik och CTA ska vara läsbara, bilden ska inte täcka det viktiga innehållet, mobil-/laptop-vyer ska i princip se likadana ut som den accepterade piloten. Förändra inte original-WebP eller logotypen utan användarens önskemål.

## 4. Senaste designriktning för hela /kontakt/ (separat från CSS-fixen)

Användaren har **gillat** ett designförslag för sidan, men det är **ännu inte implementerat eller slutgodkänt som funktion**:

- Vänster kolumn: `HALLPARTNER / KONTAKT`, rubriken `Berätta om ditt hallprojekt.`, en kort inledning och **två vita knappar** för telefon och mejl.
- Höger kolumn: **mörkgrönt formulärkort** i stället för befintliga kontaktuppgiftskortet, med namn, e-post, frivilligt telefonnummer och meddelande samt tydlig skillnad mot `/offert/`.
- Bakom heron: användarens godkända **AI-illustration med person i kontor** och ljus toning som ger läsbar text.
- Mobil: text och snabbknappar före illustration/formulär; värna tydliga kontaktvägar.
- Peter och Jimmy-porträtten längre ned ska bevaras.

**Viktig spärr:** `/kontakt/`-formuläret är avstängt i publicerad preview och privat mottagnings-/integritetsgodkännande saknas för det flödet. Att en layout med formulär önskas är **inte** tillstånd att aktivera inskick, ändra `PUBLIC_HP_LEADS_ENABLED`, `scripts/preview/payload.mjs`, PHP, SMTP, mottagare eller personuppgiftspolicy. En **visuell kandidat** kan göras separat och utan att skicka riktiga uppgifter; skarp funktion kräver separat verifierad beslutsgång.

**Blanda inte ihop uppdrag:** den lokala, senaste **CSS-bakgrundsändringen** gjorde bara bildbytet. Formulärombyggnad och vita knappar är **senare designarbete**, inte implementerat i de nio CSS-raderna.

## 5. Prioriterad fortsatt arbetsgång

1. **Börja med läsande lokal Git-inventering.** Identifiera gren/HEAD, lokal CSS-diff, untracked WebP och andra filer. Bevara allt okänt; kontrollera hur PR #48 förhåller sig till lokal gren innan sammanföring.
2. **Rätta 4K-beskärningen** i den befintliga kontaktheron med minimal CSS-diff. Skapa jämförbara skärmbilder 1440/laptop, faktisk 4K och mobil. Visa dem för Andreas; ingen commit/push/merge/publicering enbart med denna checkpoint.
3. När bildproblemet är godkänt, **planera separat UI-kandidat** för två vita kontaktknappar och mörkgrönt formulärkort på hero. Avgör med Andreas hur ett ännu avstängt kontaktformulär presenteras utan att vilseleda besökare. PR #48:s äldre alternativförslag får inte väljas av slentrian.
4. Efter visuellt godkännande och säkerhetsgranskning: besluta separat om Git-integrering, obligatoriska tester och eventuell main→Inleed-preview-publicering. Ingen ändring på kundens WordPress eller DNS.

## 6. Säkerhets- och scopegränser

- Primärt mål: slutför Hallpartner.se. Separat internt säljdokument är pausat, HP-052. Extern kalkylator HP-001–003, montörsorganisationsutredning HP-009 och referensprojekt HP-017 är pausade. Processidan och totalentreprenadbudskapet är redan implementerade i previewn.
- AI-bilder är illustrationer, inte genomförda referensprojekt; registrerade bildrättigheter gäller enbart specifik Inleed-preview enligt nuvarande underlag. Vid eventuell publicering av nytt AI-material krävs korrekt källa, SHA-256, godkännandescoping och befintliga releasegrindar – gör inte antaganden om generell rätt till kundens produktionssajt.
- Publicering bara enligt godkänt main-workflow till `https://hallpartner-se.preview2.inleed.com/`, aldrig en ny domän. Bevara noindex, bildgrind, FTPS/HTTPS-verifiering och serverfilretention. Rör inte kundens WordPress, DNS, SMTP eller skarp mottagarmiljö.

**Checkpoint är inte ett uppdrag att automatiskt mergea eller publicera.** Nästa agent ska börja med att bekräfta aktuell status och prioritera den av användaren observerade 4K-beskärningen.
