# Startsidesprototyp v0.2 – visuellt refinement

Status: lokal, noindexad designprototyp på `/prototype/start-v02/`.
Route, content-modell och arkitektur är bevarade. Startsidan `/` är oförändrad.
Ingen deployment, commit eller push ingår.

## Slutligt begränsat refinement-pass

Projektfaktapanelen har utökats till högst 500 px på desktop med en bredare
etikettkolumn. Godtycklig ordbrytning är borttagen; Leveransomfattning visas helt.
Överlappningen och railens högerkant är bevarade. Tablet behåller staplade fakta.

Montage/ritning använder 60/40 på tablet och desktop, med 300 respektive 380 px
höga bildytor och närmare grupperad rubrik/copy. Mobilens ritningsinset bevaras.
Den ljusa bakgrunden behålls. Ansvar har starkare kolumnrubriker, tydligare linjer
och justerad spacing. Peter/Jimmy-namnen har högre vikt; porträttstorleken är samma.
Inga nya fakta, cards, ikoner eller dekorativa nummer har införts.

Check, lint och build passerar. Visuell granskning vid 390, 768, 1024, 1440 och
1920 px bekräftar läsbara fakta och bibehållen komposition utan overflow.
Hero, navigation, behov, breddsystem, content-modell, route och startsidan är
oförändrade. Ingen commit eller push.

## Refinement 2 – layout

Tre breddlägen används: kantställda stora bilder, en gemensam rail med maxbredd
1220 px och läsbredd upp till 44ch (hero-ingress 38ch). Mobil har 20 px sidmarginal.
Hero-text, navigation, behov, ansvar och kontakt följer railen; stora hero- och
projektbilder behåller kantkontakt. Kontaktens bakgrund går över hela bredden.

Headern är 104 px hög på desktop med 18 px ordmärke och 17 px navigation.
Behovsrader har 32 px rubriker och en namnkolumn på högst 280 px, vilket för
beskrivningarna närmare. Projektfaktans högersida följer railen. Montage och
ritning har en gemensam förklaring som tydliggör att underlagen är separata.

Kontaktens text, CTA och personer bildar en sammanhållen komposition. Porträtten
visas nu i 224 px på desktop och 166 px på mobil, vilket ersätter första passets
begränsning till 166 px. Originalens låga upplösning begränsar skärpan.
Strategisk målgruppscopy, route och content-modell är oförändrade.

Check, lint och build passerade efter ändringarna. Renderingar vid 390, 768,
1024, 1440 och 1920 px granskades visuellt. Ingen horisontell overflow;
header, behov och kontakt håller uppmätt 1220 px vid både 1440 och 1920 px.
Alla bilder och Inter laddades. Noindex, en H1, textkontrast och tangentbordsmeny
kontrollerades. Ingen deployment, commit eller push genomfördes.

## Design och implementation från första refinement-passet

Utgår från senast tillgängliga Figma design context för `NJXa3fWrP7FEPKjZPLpB4d`,
desktop `5:2` och mobil `5:88`, samt Hallpartners art-direction-skill.
Figma MCP:s Starter-anropstak hindrade en ny hämtning under refinement-passet.

Thin route → `HomepagePrototype.astro`, separat typad placeholder-copy och sidisolerad CSS.
Återanvänder `SiteSeo`, `ActionLink`, foundation-tokens/base och config-navigation.
Content collections och statusmodellen är oförändrade. Sidans innehåll är fortfarande `placeholder`.
Explicit `noindex,nofollow`; `/prototype/` är redan exkluderad från sitemap.

- Hero: större bildandel, 58 % på desktop, och teknisk faktayta integrerad med fotografiet.
- Navigation: 16 px på desktop; viktig vanlig desktoptext 20 px, projektfakta 18 px.
- Behovslistan: linjerade rader med 30 px rubriker på desktop, inga cards.
- Projekt: stor stommebild med överlappande faktaspalt och mindre material-/ritningsytor.
- Mobil: kortare hero-copy, en primär CTA, egen faktahierarki, ritningsinset och synliga porträtt.
- Ansvar: HALLPARTNER / TILLVAL / ANNAN PART bevarat med större text.
- Kontakt: egna synliga porträtt, namn och mer utrymme; bilderna förstoras inte över 166 px.
- Det dekorativa behovsbandet är borttaget: inga fält, länkar eller förklaringar gav verklig funktion.
  Dess data bevaras i content-modellen enligt uppgiftens avgränsning.

## Bildinventering före implementation

33 bildfiler i `src/assets/images/` och `src/assets/images/legacy/` granskades
visuellt i en kontaktkarta samt med metadata. Originalfilerna är oförändrade.

| Användning | Bedömning av befintligt material |
|---|---|
| Hero / färdig hall | `lagerhall.jpg` och `Lagerbyggbad-med-Sandwixh-1536x1055.jpg` har samma tydliga motiv. Legacy-versionens 1536 × 1055 px ger bättre bildskala än 1024 × 704 px. `maskinhall.jpeg`, `lagerbyggnad.jpeg` och `Lagerhall-2-2.jpg` är alternativa exteriörer men ger mindre tydlig arkitektonisk profil eller lägre upplösning. |
| Projekt / referenslayout | `lagerlokal-stalstomme-1536x1152.jpg` visar hela stommen med starkt perspektiv och läsbara konstruktionslinjer. Används enbart som prototypmaterial. |
| Montage / process | `Stalstomme-1-1536x1152.jpg` visar balkar, pelare, byggplats och personer; bättre material-/montagenärvaro än ytterligare en färdig fasad. `Stalstomme-2-1536x1152.jpg` är en närliggande vinkel med mindre synligt arbete och väljs bort för att undvika redundant bildserie. `bygga-maskinhall.jpeg` och `maskinhall_bygga.jpeg` är interiör respektive färdig exteriör, inte automatiskt processbevis trots filnamnen. |
| Teknisk detalj | `maskinhall-ritning.webp` ger teknisk variation. `lagerhall-fonster-1536x1178.jpeg` är ett bra detaljalternativ, men väljs bort för att inte fylla sidan med fler likartade fasadbilder. |
| Peter / Jimmy | Båda `kontakt_foto_*.jpg` finns, 166 × 166 px. Visuellt användbara som små mänskliga porträtt, men begränsade för stor presentation. |
| Övrigt | Tälthallsbilder, ridhus, plåthallar och ritningen `228.jpg` inventerades men matchar inte den prioriterade lagerhall-/stålkonstruktion-kompositionen lika väl. Dubbletter lämnas orörda. Logotypfilen används inte som fotografi eller ny produktionslogotyp. |

## Exakt använda bilder

Alla sex importeras lokalt genom Astro `Image`; foton har beskrivande alt-text.
Heron laddas eager med hög prioritet, övriga bilder lazy och med responsiva varianter.

| Fil under `src/assets/images/` | Placering | Visuellt skäl |
|---|---|---|
| `legacy/Lagerbyggbad-med-Sandwixh-1536x1055.jpg` | Hero | Högre upplöst version av föreslagna `lagerhall.jpg`; stor fasad, starkt hörnperspektiv och tydlig byggnadsidentitet. |
| `legacy/lagerlokal-stalstomme-1536x1152.jpg` | Projektets stora bild | Hela stommen ger fysisk skala och läsbar konstruktion bakom den överlappande faktaspalten. |
| `legacy/Stalstomme-1-1536x1152.jpg` | Montage-/materialkomplement | Takbalkar, pelare och byggplats ger variation och mänsklig skala. |
| `legacy/maskinhall-ritning.webp` | Teknisk inset | Bryter fotografiernas rytm med en riktig sektionsritning; visas utan koppling till bildens mått eller projekt. |
| `legacy/kontakt_foto_Peter.jpg` | Kontakt | Riktigt befintligt porträtt ger mänsklig närvaro. |
| `legacy/kontakt_foto_Jimmy.jpg` | Kontakt | Riktigt befintligt porträtt ger mänsklig närvaro. |

## Claims och avsiktliga Figma-avvikelser

Bilderna är prototypmaterial, inte verifierade Hallpartner-referensprojekt.
Bilderna och ritningen presenteras inte som ett och samma dokumenterade projekt.
Hero-måttet 18 × 36 m är uttryckligen demo och gäller inte bilden.
Projektfakta och ansvar förblir “Verifieras”; inga roller, garantier eller scope gissas.
Navigation och offert-CTA går till befintliga prototyper; ingen wizard skapas.

Färgblocken har ersatts med verkliga bilder, projektytan är mer redaktionell,
porträtten visas på mobil och behovsbandet är borttaget. Dessa avvikelser är
avsiktliga förbättringar enligt refinement-uppgiften.

## Creative-director-granskning och verifiering

Sidans signatur är den kantställda hallbilden med sammanhållen demo-faktayta,
kontrasterad mot linjerade behovsrader och en redaktionell stomme-/ritningskomposition.
Ingen universell smal wrapper, dekorativ numrering, generisk card-grid eller gradient.
Mobil har egen hierarki och bildkomposition, inte bara staplad desktop.

- `npm run check`, `npm run lint`, `npm run build` passerar via `npm.cmd` på Windows.
- Desktop 1440 px och mobil 390 px renderas med laddad Inter och alla sex bilder.
- Kompletterande kontroller vid 768, 1024 och 1920 px: ingen horisontell overflow.
- En H1, explicit noindex, synlig fokus och tangentbordsfunktion i mobilmenyn kontrolleras.
- Synliga texters beräknade kontrast passerar AA på de kontrollerade bakgrunderna.
- Bildladdning, proportioner, beskärningar och överlappningar granskas visuellt.
- Befintlig varning för tom `src/content/knowledge` påverkar inte bygget.
- Live preview granskades i ursprungspasset. Refinement granskas lokalt;
  live preview efter deployment återstår eftersom ingen publicering ingår.

Större och skarpare originalporträtt är önskvärda inför produktion.
Godkända bildrättigheter och projektfakta behövs innan bilderna används som projektbevis.
