# Hallpartner – helhetscheckpoint efter färdig offertguide

**Datum:** 2026-11-06 (svensk tid)  
**Typ:** Kontrollpunkt och överlämning för fortsatt utveckling av hallpartner.se  
**Status:** Offertflödet är tekniskt färdigt och leveransverifierat på Amelios utvecklingspreview; webbplatsen är **inte** produktionslanserad eller slutligt kundgodkänd.  
**Källa:** Aktuell GitHub-kontroll mot `main`, GitHub Actions, PR #31 och dokumenterad inkorgsbekräftelse. Privata serverfiler kontrollerades under Codex releasearbete; denna checkpoint gör ingen ny SSH-kontroll.

## 1. Verifierat nuläge – nyare än äldre dokument

| Del | Aktuell status |
| --- | --- |
| Repo | https://github.com/Amelio-AB/hallpartner |
| Ordinarie Windows-arbetsmapp | `C:\webbprojekt\hallpartner` – kontrollera alltid lokal status innan ändringar |
| GitHub `main` | `931e2149d5477e33aaa4d19bbaa7ad264b04d320` (kontrollerat vid denna checkpoint) |
| Aktiv preview | https://hallpartner-se.preview2.inleed.com/ |
| Offertguiden | https://hallpartner-se.preview2.inleed.com/offert/ |
| Tacksidan | https://hallpartner-se.preview2.inleed.com/offert/tack/ |
| Publicering | GitHub Actions #42121351331, **success** för `931e214`, inklusive live-Chrome |
| Privat PHP | Codex har installerat och SHA-256-verifierat PHP-filer från samma källcommit; dokumenterat i PR #31 |
| Slutligt liveprov | **Ett** syntetiskt inskick, ref `bd890a1c2bd661b183b91dd2`; tacksida och **två separata mejl** bekräftade |
| SSH | Tillfällig nyckel borttagen; nekad återanslutning dokumenterad. Ingen kvarstående agentåtkomst |
| PR #31 | Öppen, **ready for review**, ännu **inte mergad**. Innehåller slutdokumentation. Denna checkpoint läggs i samma dokumentationsgren, inte direkt i `main` |
| Kundens WordPress och DNS | Inte ändrade. Separat från Amelios utvecklingspreview |
| Produktion | Ingen go-live, migrering, domänväxling eller kundhosting godkänd |

**Viktigt:** `main` och publicerad preview är två separata tillstånd. Kontrollera båda vid nya uppdrag. En merge eller grön CI är inte ensam bevis för att previewn är uppdaterad. Push/merge till `main` kan automatiskt starta workflow `deploy-production.yml`, trots namnet endast riktat till **Amelios utvecklingspreview**. Merga inte denna dokumentationsgren enbart för att spara checkpointen.

### Starka leveransbevis

- Statisk publicering för `931e214`: grönt GitHub-workflow https://github.com/Amelio-AB/hallpartner/actions/runs/42121351331. Enligt PR #31 verifierades publiceringsmarkören och **117 originalfiler** på Inleed.
- Privat installation: befintlig `validator.php` skilde sig från Git genom 266 CRLF/LF-radslut. Efter jämförelse utan andra kodskillnader ersattes både validerare och mottagare med Git-exakta bytes. Full SHA-256, PHP-syntax, oberoende test, backup och rollback dokumenterade.
- Verkligt test från den publicerade sexstegsguiden skickades **en gång**. Webbläsaren gick till `/offert/tack/` och visade referensen `bd890a1c2bd661b183b91dd2`.
- Primärmejl till `kontakt@amelio.se` och separat kundkopia till `andreas@amelio.se` hade samma referens och svenska svar. Två separata Gmail-ID/RFC Message-ID dokumenterade; Andreas har bekräftat leveransen. **Skicka inga fler testmejl bara för att dokumentera det redan utförda testet.**
- Efter testet återkallades den tidsbegränsade SSH-nyckeln och dess lokala nyckelpar raderades. Backuper och återställningsskript finns privat hos Inleed, inte i Git.

**Huvudreferens:** [PR #31 – Slutcheckpoint för Issue #29](https://github.com/Amelio-AB/hallpartner/pull/31), särskilt `docs/checkpoints/2026-11-05-issue-29-offert-confirmation.md` i den PR-grenen. [Issue #29](https://github.com/Amelio-AB/hallpartner/issues/29) stängdes av PR #30:s merge; detta motsvarar nu också verifierad verklig leverans.

## 2. Offertflödet – bevara det som fungerar

- AMP-001 i `@amelio/web-platform` 1.5.0; fem frågesteg och ett automatiskt granskningssteg.
- De tre generellt obligatoriska uppgifterna är **användningsområde**, **namn**, **e-postadress**. Projektbeskrivningen är **frivillig**. Vissa villkorade regler finns, till exempel att telefon behöver anges om uppringning väljs.
- `Skicka förfrågan` går till `/api/lead.php` och den privata PHP-mottagaren. Endast verifierat HTTP 200 och `status: success` ger tacksida.
- `/offert/tack/` visar mottagningsbekräftelse, referens och separat besked om besökarens mejlkopia. Ett direktbesök utan giltigt engångskvitto visas neutralt. Inga formulärsvar eller kontaktuppgifter läggs i URL:en.
- Primärmejl till konfigurerad mottagare och separat kundkopia till validerad besökaradress. Svarsalternativen översätts till läsbar svenska, t.ex. `storage` → **Lager eller förvaring**.
- Om primärmejlet accepterats men kundkopian misslyckas får det inte göra ursprungsförfrågan till ett misslyckat inskick. Ingen automatisk omsändning vid okänd transportstatus.
- **Inga filuppladdningar, automatiska prisberäkningar, extern hallkalkylator, köp eller e-handel** i denna version. Kalkylatorn är pausad enligt `docs/checkpoints/2026-11-02-calculator-paused.md`.
- Ändra inte frågorna, designen, SMTP eller releasegrindarna utan ett nytt avgränsat behov och godkännande. Projektägarens testgodkännande är **inte** Hallpartners slutliga godkännande av alla affärsfrågor.

### E-post och personuppgifter på previewn

- Webbplatsen kör på **Amelios** befintliga Inleed-konto; den privata mottagaren använder `kontakt@amelio.se` som både avsändare och primär mottagare.
- Adressen `kontakt@amelio.se` ligger hos **Inleed** och vidarebefordrar mejl till `andreas@amelio.se`, som läses i **Gmail**. Gmail-inbox betyder alltså inte att Inleed-kontot ligger hos Google.
- Den separata kundkopian skickas till besökarens angivna e-postadress.
- `/integritet/` beskriver Amelio AB:s behandling i utvecklingsmiljön; Amelios radering inom 30 dagar omfattar tillämpliga kopior, svar och papperskorgar hos Inleed och Gmail, medan leverantörernas tekniska säkerhetskopior styrs av egna regler. Besökarens privata brevlåda ligger utanför Amelios gallring.
- Den här previewn ska inte utge sig för att vara Hallpartners produktionsmottagning. **Innan flytt till kundkonto krävs separat beslut** om faktisk mottagare, SMTP, dataskydd, ansvar och verifierad e-postleverans.

## 3. Webbplatsens aktuella struktur

- Byggd med **Astro + TypeScript**, statiska besökarsidor, Node.js 24, låst privat Amelio Web Platform.
- Gemensam layout: `src/layouts/HallpartnerSiteLayout.astro`.
- Riktig responsiv meny: `src/components/SiteHeader.astro` med AMP-002 och serverrenderad fallback.
- Startsida: `src/components/home/HallpartnerHome.astro`; godkända arbetskomponenter för Hero, AMP-003 Footer, AMP-006-länkkort och bildgalleri.
- **15 avsedda HTML-sidor** enligt `scripts/preview/policy.mjs`: `/`, `/404`-fil, `/kontakt/`, `/offert/`, `/offert/tack/`, `/integritet/`, `/om-oss/`, `/sa-gar-det-till/`, `/stalhallar/` och sex hallundersidor: lagerhall, maskinhall, plåthall, isolerad hall, ridhus och tälthall.
- På startsida/undersidor finns redan riktiga bildpiloter och galleri; porträtt och kontaktkort för Peter/Jimmy ingår i befintlig design. Använda bilder är inte automatiskt verifierade som Hallpartners egna projekt eller licensierade för framtida produktion.
- Headerns primära CTA heter nu ungefär **”Be om offert”** och går till `/offert/`. Det äldre TODO-kravet ”byt från Kontakt till offertknapp” är därmed åtminstone visuellt genomfört; kontrollera befintlig kod innan en uppgift bockas av.
- Aktiv styling ska kontrolleras i använda CSS- och configfiler. Äldre `docs/DESIGN_SYSTEM.md` är visionshistorik med annan palett. Aktiv `.hp-site`-variant använder mörk grönton (`#132822`, `#071A16`), accent `#72BF7B`, CTA `#287B39` och hover `#1D6529`. Äldre Direction 02-värden finns fortfarande i koden och får inte oavsiktligt användas som facit för den synliga webbplatsen.
- Previewn ska vara **noindex/nofollow**, ha robotsspärr och ingen publik sitemap. Den får inte börja indexeras vid normal utvecklingspublicering.
- Kundens befintliga WordPress ligger på **annat webbhotell** och lämnas orört. DNS och framtida separat kundkonto är utanför aktuellt scope.

## 4. Dokumentationsfällor – läs detta före fortsatt arbete

Flera dokument i `main` innehåller **historiska statuspåståenden** från tidigare steg. Speciellt:
- `AGENTS.md` börjar med offertcheckpoint från **före** tacksida/kundkopia och innehåller längre ned äldre besked om avstängd V2 och Draft PR #22.
- `README.md` beskriver fortfarande offertguiden som avstängd/Draft och anger ibland 13 HTML-sidor och inaktiv PHP; aktuellt är 15 sidor och fungerande offertmottagning på Amelios preview.
- `docs/preview/README.md`, `docs/LOCAL_WORKSPACE_CLEANUP.md`, `docs/content/HALLPARTNER_OFFERTGUIDE_V2.md` och vissa integrationsrapporter är värdefull historik, **inte** aktuella driftinstruktioner.
- TODO/beslutsregister `docs/TODO.md` och `docs/PROJECT_DECISIONS.md` finns på **öppen Draft PR #2**, inte på `main`. Flera offert- och tekniska TODO-statusar där är nu inaktuella.
- `docs/content/HALLPARTNER_OFFERTGUIDE_KUNDBESLUT.md` är arkiverat; återuppta **inte** spåret med 36 eller sju separata frågor till Peter/Jimmy utan ett uttryckligt nytt beslut.

**Prioritera vid statuskonflikt:** färsk `main` och publiceringsmarkör → GitHub Actions / faktisk kod → slutförd release dokumenterad i PR #31 → äldre planer. Ändra inte historiska dokument genom att radera deras historik; lägg hellre tydliga uppdateringar överst.

## 5. Kvarvarande arbete – rangordnat för nästa etapp

### A. Högst nytta nu: affärsinnehåll och kundgranskning

1. **Granska befintlig webbplats med kundens ögon** på desktop och mobil; identifiera tydliga hinder för att förstå erbjudandet och lämna offertförfrågan. Ge prioriterat åtgärdsförslag innan omfattande ombyggnad.
2. **Faktagranska Hallpartners erbjudande**: hallkategorier, vad som ingår, montage och eventuella samarbetspartners, geografi, vilka konstruktioner/utföranden de faktiskt levererar. Undvik påståenden om egna montörer, totalentreprenad, garanti eller bygglov utan verifiering.
3. **Granska och förbättra text för startsida och de sex hallundersidorna**. Skilj mellan användning (lager/ridhus/maskiner) och utförande (isolering/plåt/tält), undvik överlapp och styr till relevant offert/kontakt. Verifiera produktpåståenden med Peter/Jimmy före produktion.
4. **Samla fullständiga arbetsutkast** i `docs/content/` där de faktiskt finns; behåll versions- och källstatus. Detta är HP-045 i Draft PR #2. Hitta inte på historiska textutkast.
5. **Bildrättigheter och referenser:** inventera licens/ursprung, välj godkända verkliga projekt och planera egen fotografering. Befintliga bilder ska inte benämnas som Hallpartners genomförda projekt utan belägg.

### B. Tekniskt underhåll som bör ske avgränsat

6. **Synka agent- och README-dokumentation** så att nästa AI-agent inte återaktiverar redan slutförda offertuppgifter. Planera en docs-only PR, verifiera att den inte överlappar PR #31 eller gamla Draft PR #2; merga inte bara för dokumentationsordning eftersom `main` kan trigga preview-publicering.
7. **Gå igenom öppna PR:er** före ny kod: #31 är färdig slutcheckpoint, #25 är gammal isolerad offerttest-Draft, #9 kontaktformulärets feltexter, #7 gammal isolerad AMP-meny, #6 äldre valideringsgranskning, #4 och #2 äldre dokumentation samt #1 arkitektur. Granska överlapp, återanvänd endast det som fortfarande behövs och radera inte historik slentrianmässigt.
8. **Förbered säker produktionsmigration separat**: URL-/redirectkartläggning, SEO, indexeringsbeslut, kontaktuppgifter, juridik, ny server-/e-postkonfiguration och nytt kundgodkännande. Gör inte DNS- eller WordPress-ändringar under vanligt utvecklingsarbete.

### C. Önskemål som inte behöver tränga undan grunden

9. **Sökfält i Header**: tidigare önskemål HP-047, ännu inte beställt som funktion; kontrollera först om sajten har tillräckligt mycket innehåll för att sök faktiskt ska ge nytta.
10. **Hallpartners symbol i Footer och på vissa sidor**: HP-049, visuellt önskemål för separat designgranskning, med rätt grafiskt original och bildrättighet.
11. **Tacksidans design**: fungerar, men kan få kortare text och tydligare visuell bekräftelse när nästa UX-omgång planeras. Ändra inte leveranslogiken av kosmetiska skäl.
12. **Kontaktformulär, bilagor, referensbank, pris- och kalkylatorintegration**: separata framtida beslut. Kontaktformulär är inte samma sak som den aktiva offertguiden. Filuppladdning och kalkylator ska inte smygaktiveras.

## 6. Arbetssätt och skyddsgränser för nästa agent

- Starta **läsande**: `git status --short --branch`, `git fetch` först efter kontroll av lokalt arbete, aktuell `main`, PR-status, publika previewn och rätt dokumentation. Hävda inte att en lokal arbetsmapp är ren utan att faktiskt verifiera det.
- Använd **endast** `C:\webbprojekt\hallpartner` som ordinarie lokal arbetsyta. Skapa inga parallella standardkloner/worktrees, gör ingen destruktiv `reset --hard`, `git clean` eller backup-radering.
- Gör ny utveckling på avgränsad feature-branch och PR. **Inga merges, pushar till `main`, FTP/SSH-serverändringar eller publicering utan tydligt godkännande**, med undantag för ett redan avgränsat och fortfarande giltigt godkännande.
- Bevara befintlig preview och all fungerande offertepost/receiver; inga nya syntetiska liveinskick utan reellt testbehov och uttryckligt godkännande. Dokumentera skillnaden mellan lokalt test, PR-CI, merge, statisk publicering och privat PHP-installation.
- Gör design- och textgranskning kritiskt: påpeka svagheter, visa bättre alternativ och prioritera konkreta konverterings-/förtroendeförbättringar före kosmetiska detaljer.
- Använd godkända AMP-komponenter där de passar. Undvik pris-, sortiments- och garantiantaganden. För bygglov, snö-/vindlaster och dimensionering krävs aktuella källor och vid behov sakkunnig granskning.
- Inga hemligheter, kunddata eller privata serverkonfigurationer i repo/AI-rapporter. Vid framtida serverjobb krävs tidsbegränsad SSH, verifierad backup, strikt filhashkontroll och efterföljande nyckelborttagning.
- Slutlig lansering till `hallpartner.se` och separat kundhosting beslutas uttryckligen senare; denna checkpoint avser **Amelios preview**.

## 7. Rekommenderad första insats i nästa chatt

**Gör inte en ny offertrelease.** Börja med en kort **nulägesgranskning av webbplatsens innehåll och användarresa**, med prioritering av de tre största förbättringsmöjligheterna och tydlig markering av vad som kräver kundunderlag. Föreslå sedan ett avgränsat första arbetsuppdrag och invänta Andreas prioriteringsbeslut före kodändring.

## 8. Referenslänkar

- [Repo](https://github.com/Amelio-AB/hallpartner) · [Aktiv preview](https://hallpartner-se.preview2.inleed.com/) · [Offert](https://hallpartner-se.preview2.inleed.com/offert/)
- [Slutcheckpoint PR #31](https://github.com/Amelio-AB/hallpartner/pull/31) · [Grön publiceringskörning](https://github.com/Amelio-AB/hallpartner/actions/runs/42121351331)
- [Full offertrelease i PR #31](https://github.com/Amelio-AB/hallpartner/blob/codex/issue-29-release-checkpoint/docs/checkpoints/2026-11-05-issue-29-offert-confirmation.md)
- [Sido- och fotokontroller](https://github.com/Amelio-AB/hallpartner/tree/main/docs/reviews) · [Konsolidering](https://github.com/Amelio-AB/hallpartner/blob/main/docs/checkpoints/2026-11-04-site-consolidation.md)
- [TODO/beslut under granskning i Draft PR #2](https://github.com/Amelio-AB/hallpartner/pull/2) – historisk TODO-status måste uppdateras efter ny källkontroll.

**Stoppunkt:** här avslutas milstolpen `offertguide + tacksida + kundkopia + privat PHP + verifierade två mejl`. Nästa etapp är **resten av Hallpartners webbplats**, inte mer offertfelsökning.
