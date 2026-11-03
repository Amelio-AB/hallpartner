# Bildpilot 2 – Stålhallars Hero och galleri

Datum: 2026-11-03. Lokal arbetsmapp: `C:\webbprojekt\hallpartner-cleanup-20261103`.
Branch: `feature/hallpartner-stalhallar-media-pilot-20261103`, skapad från exakt
`5ee8a75de5529390835490525599dba896f68509` efter kontroll av ren arbetsyta.
Ingen ny projektmapp eller worktree. Endast `/stalhallar/` ingår.

## Originalvideon: källkontroll och fallbackbeslut

Gamla [Hallpartner.se](https://hallpartner.se/) använder Elementor och anger
`https://vimeo.com/390143091?fl=pl&fe=cm#t=4s` som `background_video_link`.
Inställningarna anger start vid 6 sekunder och slut vid 44 sekunder, samt
uppspelning på mobil. Käll-HTML har sparats i den lokala granskningsmappen.

[Vimeos offentliga metadata](https://vimeo.com/api/oembed.json?url=https://vimeo.com/390143091)
identifierar **THORSPAN - STEEL STRUCTURES**, uppladdare **Thorspan**, publicerad
2020-02-08, total längd **51 sekunder**. Miniatyren visar en flygbild av ett
industriområde. Angivna 426 × 240 gäller inbäddningens visningsstorlek och är
**inte verifierad originalupplösning**.

| Kandidat | Format / upplösning / längd / storlek | Utfall |
| --- | --- | --- |
| Vimeo 390143091, faktisk Hero-källa | Originalformat, originalupplösning och filstorlek okända. 51 s enligt oEmbed. | Publik player/config svarade 401 respektive 403. Ingen åtkomlig originalfil verifierad. |
| WordPress media-ID 3795, `stalhall.mp4` | MP4, H.264 (`avc1`), 1920 × 1080, 10,01 s, 3 083 172 byte | Nåbar, nedladdad och lokalt avkodad. Visar en mörk korridor, inte den identifierade Hero-videon. Används inte. |
| Lokala projektfiler före undersökningen | Ingen MP4/WebM/MOV i aktuell checkout utanför genererade filer och granskningsmaterial | Ingen originalvideo hittad. |

WordPresskällor:
[offentligt mediaindex](https://hallpartner.se/wp-json/wp/v2/media?media_type=video&per_page=100),
[media-ID 3795](https://hallpartner.se/wp-json/wp/v2/media/3795),
[filen](https://hallpartner.se/wp-content/uploads/2025/12/stalhall.mp4).
Kandidatens dimensioner och längd verifierades både från MP4-boxar och faktisk
Chrome-avkodning; tre bildrutor sparades för motivkontroll.

Ingen FTP- eller kontrollpanelsanslutning har gjorts enligt uppdragets förbud.
Publika HTTP-källor är undersökta; någon separat originalfil hos Inleed har
därmed inte verifierats. Inga credentials har lästs eller ändrats.

**Beslut:** använd den uttryckligen beställda statiska fallbacken. Ingen annan
video ersätter originalet. Ingen fungerande video-Hero, pausfunktion eller
videofallback påstås testad. Ingen Vimeo-iframe eller videohämtning läggs in.

För att återuppta videodelen behöver Peter/Jimmy på Hallpartner bekräfta rätt
material och kontakt med Thorspan eller annan faktisk rättighetsinnehavare.
Behörig rättighetsinnehavare måste godkänna användning, bearbetning och eventuell
egen hosting. Andreas godkänner design och publiceringsbeslut. Att filmen redan
ligger på gamla sajten bevisar inte dessa rättigheter.

## Statisk Hero-pilot

`src/assets/images/legacy/Lagerbyggbad-med-Sandwixh-1536x1055.jpg` används som
dekorativt, responsivt bakgrundsfoto. Det är **inte en bildruta ur Vimeo-videon**.
Originalfilen bevaras och dess användningsrätt är fortsatt overifierad.
Astro Image skapar WebP i 480/768/1024/1536 px. Tom alt-text och `aria-hidden`
används eftersom fotot är en dekorativ bakgrund bakom den bevarade introduktionen.

H1, brödtext, båda CTA-länkarna och guidepanelen är kvar. Mörk overlay,
ljusa textfärger och synligt tangentbordsfokus hör enbart till denna Hero.
På mobil/surfplatta tonar fotot ut före guidepanelen för att undvika en extrem
beskärning över hela den höga staplade sektionen. Befintlig mörk yta är fallback
om bilden inte laddas. Ingen rörelse eller video laddas, även utan JavaScript.

## Galleriurval

Den återanvändbara `src/components/ImageGallery.astro` används endast på
`/stalhallar/`, efter `#anvandningsomraden` och före `#utforanden`.
Alla filer nedan ligger i `src/assets/images/legacy/`. Originalen är orörda.
Urvalet beskriver motiv och användning, inte verifierade kundprojekt,
byggnadsmaterial eller specifikationer för Hallpartners leveranser.

| Fil | Rubrik och synlig bildtext | Alt-text |
| --- | --- | --- |
| `plathall-1536x1152.jpeg` | **Plåtklädd exteriör** — Portar och fasad på en hallbyggnad. | Grå plåtklädd hall med stor stängd port och dörr på gaveln. |
| `bygga-maskinhall.jpeg` | **Utrymme för maskiner** — Maskin och lastbil under samma tak. | Stor maskin och lastbil i en rymlig hallbyggnad. |
| `Stalstomme-1-1536x1152.jpg` | **Stommen under montage** — Stålstomme innan väggar och tak är färdiga. | Stålstomme med takbalkar och delvis monterad vägg. |
| `talthall-1536x1152.jpg` | **Dukklätt utförande** — Öppning och åtkomst i en vit tälthall. | Vit tälthall med öppning och synlig truck. |
| `H191567f7ad934fb6aa6520bd8eeeac08N-e1773849628844.jpg` | **Interiör för ridning** — Ridbana med dagsljus och belysning. | Ridhus med upplyst ridbana och ryttare. |

Ridhusbilden illustrerar användningen; den är inget underlag för att kalla den
avbildade byggnaden en stålhall. Bildrättigheter och motivens koppling till
Hallpartner behöver bekräftas av Hallpartner och faktisk rättighetsinnehavare.

Galleriet visar två bilder från 741 px och en bild med en synlig kant av nästa
på mindre skärmar. Bilderna har förhållandet 4:3; ridhusets fokuspunkt ligger
vid 65 % i höjdled för att bevara ridbanan och ryttaren. Bildtexter ligger på
en egen ljus yta. Alla fem motiv och bildtexter har granskats visuellt.

Manuella knappar, inbyggd svepning/rullning, vänster-/högerpil samt Home/End
stöds. Fokus ligger kvar när en knapp når ett ändläge. Knapparnas tillstånd
uppdateras under rullning; en artig statusuppdatering anger aktuell bild eller
bildpar när rullningen stannat. Ingen automatisk bläddring eller extra
tredjepartsmodul. Reducerad rörelse ger omedelbar förflyttning. Utan JavaScript
döljs knapparna och den fokuserbara, horisontellt rullbara bildlistan finns kvar.

## Visuell jämförelse

Öppna [den lokala jämförelsen](../visual-review/image-pilot-02/index.html).
Den visar tre separata lägen: före, endast Hero-fallback och Hero med galleri.
Skärmbredd kan väljas och helbilderna öppnas i originalstorlek.

| Bredd | Före, från `5ee8a75` | Endast Hero-fallback | Hero och galleri |
| --- | --- | --- | --- |
| 390 px | [Före](../visual-review/image-pilot-02/before/stalhallar-mobile-full.png) | [Hero](../visual-review/image-pilot-02/hero-only/stalhallar-mobile-full.png) | [Efter](../visual-review/image-pilot-02/after/stalhallar-mobile-full.png) |
| 768 px | [Före](../visual-review/image-pilot-02/before/stalhallar-tablet-768-full.png) | [Hero](../visual-review/image-pilot-02/hero-only/stalhallar-tablet-768-full.png) | [Efter](../visual-review/image-pilot-02/after/stalhallar-tablet-768-full.png) |
| 1440 px | [Före](../visual-review/image-pilot-02/before/stalhallar-desktop-full.png) | [Hero](../visual-review/image-pilot-02/hero-only/stalhallar-desktop-full.png) | [Efter](../visual-review/image-pilot-02/after/stalhallar-desktop-full.png) |
| 320 px, extra kontroll | [Före](../visual-review/image-pilot-02/before/stalhallar-mobile-320-full.png) | [Hero](../visual-review/image-pilot-02/hero-only/stalhallar-mobile-320-full.png) | [Efter](../visual-review/image-pilot-02/after/stalhallar-mobile-320-full.png) |

Även 1280 px ingår i skärmbildsrapporterna. Separata utsnitt av Hero,
användningsområden och galleri finns bredvid helbilderna. `interaction/`
innehåller alla fem motiv på mobil och desktop, inklusive fokusramar.
Skärmbilder, hämtade källbevis, testloggar och gransknings-HTML ligger i den
befintligt Git-ignorerade mappen `visual-review/image-pilot-02/`; de är lokala
granskningsartefakter och följer inte med en Git-checkout.

### Bedömning för Andreas

- **Tidigare Hero:** den ljusa ytan är lugn och gör sidans vägledning tydlig.
  H1, text och CTA fungerar redan bra och är bevarade.
- **Hero-fallback:** hallfotot ger ett mer visuellt anslag och den mörka ytan
  håller texten läsbar. På mobil blir bilden kraftigt beskuren och bidrar
  främst med stämning. Bilden kräver inte mer vertikalt utrymme än den tidigare
  introduktionen. Detta är ingen jämförelse av faktisk videouppspelning.
- **Galleri:** tillför konkret variation mellan exteriör, användning, montage
  och utförande efter den textbaserade översikten. Det är den tydligaste nyttan
  i denna pilot. Två bilder går att jämföra samtidigt på desktop; på mobil
  signalerar nästa bildkant att det finns mer att se.
- **Utrymme:** galleriet förlänger sidan med cirka 880 px vid 390 px, 830 px
  vid 768 px och 1 090 px vid 1440 px. Det gör sidan märkbart längre, ungefär
  en extra skärmhöjd. Bildtexterna är korta, men bildytan får tydlig tyngd.
  Den tidigare användningsvägledningen ligger fortfarande före galleriet.
- **Rekommendation:** prioritera beslut om galleriet. Bedöm Hero-bakgrunden
  separat som ett visuellt val. Återuppta video först när originalfil och
  rättigheter finns; då återstår uppspelning, paus, poster ur rätt material,
  reducerad rörelse, mobil laddningsstrategi och faktisk videoprestanda.

## Verifiering

Live-previewns `/stalhallar/` granskades faktiskt före ändringen på 320, 390,
768, 1280 och 1440 px. Underlag finns i `live-before/`. Den granskningen visade
en läsbar ljus introduktion och textbaserade användningskort, men få visuella
exempel. Previewn användes som kontrollpunkt, inte som godkänt designfacit.

Efterbilder och interaktionstester kördes mot lokal byggd Astro-preview.
Ingen deployment har gjorts; kontroll i live-preview efter deployment är
därför inte utförd och är inte påstådd.

| Kontroll | Resultat |
| --- | --- |
| `npm.cmd run check` | Godkänd: 0 errors, 0 warnings. En befintlig hint om oanvänd variabel i den ignorerade granskningsfilen från bildpilot 1. |
| `npm.cmd run lint` | Godkänd. |
| `npm.cmd run build` | Godkänd. |
| `node --experimental-strip-types --test tests/*.test.mjs` | 41/41 godkända. |
| `node --experimental-strip-types scripts/verify-hallpartner-draft.mjs` | Godkänd: bland annat noindex, H1, lokala länkar, Footer och inaktiva offert-/kontaktutkast. |
| `node scripts/verify-url-migration-draft.mjs` | Godkänd. Inga nya redirects. |
| Befintlig Chrome-skärmbildskontroll | Godkänd på alla fem bredder: laddade bilder, en H1, navigation, mobilmeny, Footer och ingen oavsiktlig sidöverströmning. |
| Nya faktiska Chrome-interaktioner | Godkända vid 320, 390, 768 och 1440 px: föregående/nästa, Enter, pilar, Home/End, ändlägen, kvarvarande synligt fokus och ingen automatisk bläddring. |
| Svepning | Godkänd via Chromes touchhändelser vid 320 och 390 px; ingen fysisk telefon ingick. |
| Reducerad rörelse | Omedelbar galleriförflyttning. Hero är helt statisk. |
| JavaScript avstängt | Fem bildtexter kvar, knappar dolda, inbyggd tangentbordsrullning fungerar. |
| Hero-bilden blockerad, 390 px / DPR 2 | Mörk bakgrund, H1 och CTA finns kvar; ingen sidöverströmning. |
| Video och externa spelare | Noll videoelement, iframes och videoförfrågningar i piloten. Paus och videouppspelning ej tillämpliga. |
| Kontrast | Konservativ beräkning mot vitt foto bakom svagaste overlay: Hero-text 8,13:1, grön H1-del 5,73:1, ingress 7,34:1. Galleriets bildtext 8,56:1 och instruktion 6,35:1. |
| Regression | Hero-text och länkar oförändrade, Header-HTML oförändrad, startsidans byggda HTML byte-identisk med baseline. Originalbilder, paketfiler, layout och konfiguration oförändrade. |

Testningen är ingen fullständig skärmläsar- eller WCAG-certifiering. Underlag:
[interaktioner](../visual-review/image-pilot-02/interaction/INTERACTION-REPORT.json),
[fallback/kontrast](../visual-review/image-pilot-02/interaction/FALLBACK-REPORT.json),
[regression och bildstorlekar](../visual-review/image-pilot-02/REGRESSION-REPORT.json).
Interaktionskontrollerna återanvänder Chrome/CDP-starten från det befintliga
skärmbildsskriptet; inga test- eller runtime-beroenden har installerats.

### Prestanda

Astro genererar responsiv WebP med `srcset`/`sizes`. Hero är prioriterad och
galleriet har `loading="lazy"` med reserverade bildproportioner. Närliggande
lazy-bilder kan förhämtas av webbläsaren; detta är inte en garanti att varje
fil väntar tills just den bilden syns. Ingen tung video laddas på mobil.

| Viewport, DPR 1 | Vald Hero-fil | Alla fem valda gallerifiler tillsammans |
| --- | --- | --- |
| 390 px | 12 778 byte | 133 610 byte |
| 768 px | 27 026 byte | 133 610 byte |
| 1440 px | 94 986 byte | 211 598 byte |

Detta är faktiska byggda filstorlekar, inte mätt total sidöverföring eller
Lighthouse/Core Web Vitals. Bildkontrollen laddar alla bilder för att kunna
granska dem; vanlig sidvisning använder fortfarande lazy loading.
Galleriets kompilerade JavaScript är 1 624 byte, cirka 788 byte gzip.
Den befintliga logotypen är oförändrad och ingår inte i tabellens nya bildkostnad.

## Lokala ändringar och beslut

Hero-fallbacken är sparad separat i `2fc3764`
(`feat: prepare static steel hall Hero fallback after video audit`).
Galleriet, dess sidkoppling och denna slutrapport sparas i en egen efterföljande
commit (`feat: add manual steel hall image gallery`). Galleriet är oberoende av
Hero-CSS: införandet består av en egen komponent, importer/data och en placering
efter användningsområdena. Lösningarna kan därmed granskas och väljas separat.

Startbranchen för bildpilot 1 ligger kvar på `5ee8a75`. Städgrenen ligger kvar
på `ef7a886` och AMP-002-grenen på `5198c3a`. Paketnamnet är `hallpartner-site`.
Ingen annan sida, global Header, startsidans Hero eller originalfil har ändrats.
Ingen push, merge, publicering, FTP, DNS-ändring eller GO-LIVE har utförts.

För lokal visning: kör `npm.cmd run preview -- --host 127.0.0.1 --port 4322`
efter `npm.cmd run build` och öppna `/stalhallar/` på den adress som Astro skriver
ut. Jämförelsens HTML och PNG-filer kan öppnas direkt utan server.
