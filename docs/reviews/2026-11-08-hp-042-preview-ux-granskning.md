# HP-042 – Granskning av kundvägar på Hallpartners preview (2026-11-08)

**Status:** Granskad, åtgärdsförslag inväntar Andreas godkännande. Detta är **endast dokumentation i Draft PR #2**, inte webbplatskod, merge eller publicering.

## Underlag och metod

- Verifierad release: `main` `7ec2956accbfa16545101f7dfb600aeebca0f705`, [Inleed Actions #42413633236](https://github.com/Amelio-AB/hallpartner/actions/runs/42413633236), `validate` och `publish` gröna. Artefakten `preview-publication-7ec2956a…` innehåller publiceringsverifiering, Chrome-rapporter och skärmbilder från publicerad miljö.
- Direkt HTTP-öppning av previewdomänen från den här agentens verktyg lyckades **inte**. Denna bedömning använder därmed **releasens dokumenterade live-Chrome-bilder** för startsidan, hallöversikt och offertguide, **Chrome-kandidatskärmbilder** från exakt samma verifierade payload för övriga 15 rutter, samt läsning av exakt `main`-kod och den publicerade payloadens HTML. Det är inte en fristående realtidsinspektion den 8 november.
- Live-Chrome-rapporter: `home-REPORT.json`, `halls-REPORT.json` och `quote-REPORT.json`, sex skärmbredder (320, 390, 768, 1024, 1280, 1440 px): samtliga `passed` och `noOverflow: true`. Kandidatens `chrome/result.json`: 15 sidor, sex bredder, `passed`, inga API-utskick.
- Publiceringspayloadens 15 HTML-rutter granskades för interna länkmål/ankare, rubriker och länkar till `/offert/`. **Inga trasiga interna länk- eller ankarmål hittades.** Det är en statisk kontroll, inte bevis för kundernas konverteringsgrad.
- Ingen ny testförfrågan skickades. Kundens WordPress, DNS, SMTP, serverfiler, `main` och Inleed-preview ändrades inte.

## Det som fungerar och bör bevaras

1. **Vägen till offert finns på rätt ställen.** Startsidans hero och senare CTA pekar till `/offert/`. Hallöversikten och samtliga sex hallundersidor har tydlig `Be om offert`-knapp tidigt på sidan. Både desktopheader och mobilens öppnade meny har offert-CTA.
2. **Mobilnavigationen fungerar på de testade bredderna.** AMP-002 visar halltyper under begripliga grupper, och rapporterna verifierar öppning/stängning, fokus samt frånvaro av horisontellt overflow. Breadcrumb fungerar med befintlig design.
3. **Offertguidens första steg är begripligt för en kund utan ritningar.** V2 har fem frågesteg och automatisk kontroll. Endast användningsområde, namn och e-post är obligatoriska; fritextbehov, mått och byggplatsuppgifter kan väljas frivilligt. Alternativet `Behöver rådgivning` är särskilt bra att behålla.
4. **Kontaktsidan visar riktiga kontaktvägar och personpresentationer**, med telefon och e-post tillgängliga även när formuläret inte är aktiverat.
5. **Sju processteg och möjligheten till nyckelfärdig hall är redan publicerade.** Ingen ny process- eller hero-design behövs utifrån denna granskning.

## Bekräftade fynd, rekommendationer och avgränsning

### F1 – Kontakt visar formulär som inte kan skickas (hög prioritet för kundvägen)

**Fakta:** `/kontakt/` har en ankarlänk `Kontaktformulär` och ett komplett synligt formulär med namn, e-post, företag, meddelande och knappen `Skicka meddelande`. I den verifierade preview-payloaden har formuläret `data-enabled="false"`, och knappen har HTML-attributet `disabled`. Ett arbetsversionsmeddelande förklarar att inskick inte är möjligt. Källa: [ContactForm.astro](../../src/components/ContactForm.astro), publiceringsskärmbild `chrome/pages/kontakt-index-html-390-full.png`.

**Bedömning:** Besökaren leds till en kontaktmetod som inte fungerar. Även om texten förklarar avstängningen är det en onödig återvändsgränd, särskilt på mobil där formuläret är långt. **Detta är avsiktligt och säkert i previewn, inte ett backendfel**, men en tydlig förbättringsmöjlighet.

**Rekommenderad liten Draft-PR:** När kontaktformuläret är avstängt: visa **inte dess inmatningsfält och avstängda sändknapp för vanliga besökare**. Ersätt formsektionen med `Be om offert` → aktiv `/offert/`, `Skriv ett mejl` och `Ring Hallpartner`. Uppdatera sidans ankarlänk från `Kontaktformulär` till en fungerande kontaktväg. Behåll möjlighet att återaktivera formversionen när den verkligen är godkänd. Ändra inte privat PHP, SMTP eller den aktiva V2-guiden. Kontrollera mobiltangentbord, fokus, länkar och noindex i candidate-validation.

### F2 – Tillfälliga AI-hallbilder saknar synlig ursprungsmärkning (hög prioritet före kundlansering)

**Fakta:** [Bildregistret](../../config/preview-image-rights.json) klassar `public/images/hallpartner-hero-temporary.webp` som `temporary-ai-concept` och de sex hallillustrationerna som `temporary-ai-concept-runway-user-supplied` med godkännande **endast för denna preview**. [HallConceptImage.astro](../../src/components/HallConceptImage.astro) renderar `<figure><img /></figure>` utan `<figcaption>`; de verifierade HTML-filerna för de sex hallsidorna och startsidan saknar synlig text som anger `AI-genererad` eller `illustration`. Bilderna ser ut som foton av verkliga byggnader i Chrome-skärmbilderna. Den äldre checkpointens formulering om **synlig märkning** överensstämmer alltså inte med dagens HTML.

**Bedömning:** Bilderna kan uppfattas som Hallpartners genomförda projekt trots att de uttryckligen är koncept. Kunden har ännu inga färdiga referensprojekt. Detta är en tydlig **trovärdighets-/presentationsrisk** inför kundens skarpa hemsida; källmaterialets previewtillstånd ger inte automatiskt produktionsrätt.

**Rekommenderad separat Draft-PR:** Visa en kort, diskret men verkligt synlig och tillgänglig märkning nära de tillfälliga bilderna: t.ex. `AI-genererad illustrationsbild. Inte ett utfört Hallpartner-projekt.` Ta med startsideheron och de sex hallundersidorna i scopet. Säkerställ att märkningen inte hamnar över viktig hero-copy. För en framtida kundlansering: verifiera rättigheter och välj vilka konceptbilder som alls ska användas. Ingen ny bildgenerering behövs för att först rätta transparensen.

### F3 – Hallspecifik CTA leder till generell offertguide utan att bevara hallvalet (förbättringshypotes, medel prioritet)

**Fakta:** Alla sex hallundersidor använder länkmålet `/offert/` utan medskickad halltyp eller användningskontext. Kunden får göra ett nytt användningsval i guidens första steg. Källor: verifierad publiceringspayload och startsides-/hallrutternas `main`-källkod.

**Hypotes:** Att förfylla det kända hallvalet (med fri möjlighet att ändra) kan ge en smidigare väg och bättre kontext i förfrågan. Det kan också skapa fel om kunden klickat på en **konstruktionstyp** (t.ex. isolerad hall) men formulärets första fråga gäller **användning**. Därför krävs en avgränsad mappning och test mot AMP-001, inte blind queryparameterkodning. Ingen ändring innan F1 och F2 behandlats.

### F4 – Sex steg kan upplevas långa på mobil, men inget avhoppsbevis finns (låg/utred senare)

**Fakta:** Den visuella mobilguiden har fem frågesteg plus kontroll, och första steget innehåller flera stora alternativskort. `Fortsätt` hamnar nedanför första skärmhöjden. Kunden kan dock hoppa över de flesta detaljer, och nuvarande fältkrav är avsiktligt låga. Den synliga Amelio-varningen på previewn upptar plats före själva guiden men är korrekt för testmottagningen.

**Bedömning:** Gå inte tillbaka till stora omdesignförslag utifrån enbart känslan av många steg. Behåll godkänd V2 tills det finns verklig uppgift om var besökare lämnar flödet. Skarp lansering kräver separat godkännande av mottagare/integritet; testmiljötexten får inte av misstag följa med.

## Rekommenderad ordning och gräns för nästa arbete

1. **F1 först:** liten förändring på `/kontakt/` som eliminerar den avstängda återvändsgränden. Avgränsad Draft-PR; behåll fungerande offertguide och alla kontaktuppgifter.
2. **F2 därefter:** märk tillfälliga AI-illustrationer korrekt på de sju berörda sidytorna. Ingen ny design eller layoutombyggnad.
3. **F3/F4 senare:** behåll som förbättringshypoteser. Mät eller testa när den viktigare kundvägen är genomarbetad och mottagning/integritet är klar för kundens miljö.

**Beslutsgrind:** Andreas granskar och godkänner synliga förslag före kodändring, merge eller publicering. Slutliga företags-, garanti- och avtalsuppgifter samt indexering/SEO ligger utanför HP-042 och hör till separata lanseringspunkter.

## Fortsatt säkerhet

Endast beslutad `https://hallpartner-se.preview2.inleed.com/`, aldrig kundens WordPress. Bevara `noindex`, automatiska releasegrindar, befintliga rättighetshashar, serverfilretention och SMTP. Inga spekulativa garantier, färdiga kundcase eller prisuppgifter.
