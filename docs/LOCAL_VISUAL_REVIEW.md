# Hallpartner – lokal visuell granskning

Uppdaterad 2026-11-03. Utvecklingsgren:
`feature/hallpartner-v1-skeleton-20261031`, [Draft PR #5](https://github.com/Amelio-AB/hallpartner/pull/5).
Lokal städgren och arbetsmapp finns i [städrapporten](LOCAL_WORKSPACE_CLEANUP.md).

**Granska nya startsidan på `/`.** `/prototype/hallpartner/start/` är en separat
referens. Varken `main` eller extern preview garanterar senaste Draft-HEAD.

## Windows

```powershell
cd C:\webbprojekt\hallpartner-cleanup-20261103
node --version
npm.cmd ci --ignore-scripts --no-audit --no-fund
npm.cmd run dev
```

Node 24 och GitHub-läsåtkomst till låst privat AMP-paket krävs.
Öppna serverns angivna URL, normalt `http://localhost:4321/`.
Befintlig installation med oförändrad låsfil behöver inte installeras om.

## Granska

- Fullbredds-Hero, transparent Header vid sidstart och mörk Header vid scroll.
- Arbetslogotyp från `public/images/logo_text_white.png`.
- Mobilmeny: öppning, Escape, klick utanför och tangentbordsfokus.
- Hero-länkar: målrubriker får inte skymmas av fast Header.
- AMP-003 Compact Footer: en Footer, länkar och mobilgrupper.
- Hallöversikt, sex hallundersidor, Kontakt, Offert, Om Hallpartner,
  Inför ditt projekt och 404.
- Bredder 320, 390, 768, 1280 och 1440 px utan kollisioner eller horisontell scroll.
- Fortsatt avstängd sändning på Kontakt och Offert.

För fysisk mobil i samma privata nätverk: `npm.cmd run dev -- --host 0.0.0.0`.
Använd datorns lokala adress och serverns port. Exponera inte servern publikt.
Chrome-emulering ersätter inte fysisk mobil eller full tillgänglighetsgranskning.

## Automatiserade tester

Bygg med `npm.cmd run build`, starta sedan
`npm.cmd run preview -- --host 127.0.0.1 --port 4321`.

Kör i en andra terminal:

```powershell
$env:HP_CHROME = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$env:HP_PREVIEW_URL = 'http://127.0.0.1:4321/'
$env:HP_SCREENSHOT_PREFIX = 'site-home'
node scripts/capture-hallpartner-home.mjs
```

Anpassa Chrome-sökvägen till installationen. Bilder och JSON-rapport sparas i
Git-ignorerade `visual-review/`. Testet kontrollerar bilder, landmarks, logotyp,
overflow, mobilmeny och på relevanta sidor avstängda formulär.
Skriptets Hero-/ankarkontroll gäller `/prototype/hallpartner/start/`;
granska även riktiga startsidans beteende.

Övriga sidtester finns i `.github/workflows/hallpartner-draft.yml`.
CI-resultat gäller sin exakta commit; inget workflow behöver startas för lokala tester.

## Bevarade begränsningar

AMP-003 Footer är installerad. AMP-002 Header har separata granskningssidor under
`/prototype/amp/header/`. Aktiv Header/Hero använder befintlig implementation.
AMP-001 på `/offert/` är en avstängd pilot; kalkylatorspåret är pausat.

AI-Heron är en konceptbild, inte ett verifierat referensprojekt. Bildrättigheter,
kundtexter och kontaktuppgifter kräver separat godkännande.
Behåll noindex. Ingen SMTP, formuläraktivering, merge eller deployment ingår.
