# Hallpartner – webbplatsplan inför implementation

> 2026-10-31 · Arbetsplan, inte godkänd produktionscopy eller slutligt URL-beslut.
> **Uppdatering 2026-11-01:** [SEO-sitemap och internlänkningsplan v0.2](SEO_SITEMAP_V02.md) föreslår att befintliga `/stalhallar/...`-adresser bevaras i stället för nya korta URL:er. Detta ersätter de äldre URL-förslagen i just denna arbetsplan tills GSC/crawl och verksamhetsfakta möjliggör slutbeslut. Startsidan på `/` har numera en separat godkänd fullbredds-Hero som visuell arbetsriktning i Draft PR #5, inte längre det äldre v0.3-delade layoutförslaget.
> Utgår från Andreas överlämning **”Fortsätt utvecklingen av Hallpartner.se – från innehållsplan till Astro-implementation”**, bifogad som `Inklistrad text.txt`, och granskade GitHub-källor. Inga saknade originaltexter har återskapats.

## Läsordning och dokumentens ansvar

Läs först `AGENTS.md` och registren i [PR #2](https://github.com/Amelio-AB/hallpartner/pull/2), även innan den mergas. [PROJECT_DECISIONS.md vid granskad revision](https://github.com/Amelio-AB/hallpartner/blob/8fb19602fd48f8279e33a7558c0e2a86968e176c/docs/PROJECT_DECISIONS.md) förblir det kanoniska beslutsregistret; [TODO.md vid samma revision](https://github.com/Amelio-AB/hallpartner/blob/8fb19602fd48f8279e33a7558c0e2a86968e176c/docs/TODO.md) förblir uppgiftsregistret. Denna plan ersätter inget av registren.

- [Innehållsmanifest](content/README.md): vilka fullständiga källtexter som har återfunnits respektive saknas.
- [SEO-sitemap v0.2](SEO_SITEMAP_V02.md): prioriterad URL-bevarandeplan, sökintention, metadataförslag, internlänkning och krav inför migrering; URL-arbetsförslagen här nedan ska läsas tillsammans med v0.2.
- [Sidbrief för Stålhallar v0.1](page-briefs/stalhallar-v01.md): konkret sektionsordning, sidmetadata, textförslag, länkar och öppna verifieringsfrågor. Denna är ett **nytt redaktionellt underlag**, inte originaltext från den tidigare chatten.
- [Lagerhallar v0.1](page-briefs/lagerhall-v01.md) och [Maskinhallar v0.1](page-briefs/maskinhall-v01.md): två separata nyskrivna Astro-utkast med specifik sökintention och kontextlänkar. De är **inte** de saknade äldre originalen.
- [Innehållsstrategi för bredare marknad](CONTENT_GROWTH_STRATEGY.md): prioriterade sidämnen, konkurrentjämförelse och hur inkommande leverantörsinformation används utan att stoppa arbetet.
- [Integrationsförslag](architecture/AMP_1_2_INTEGRATION.md): komponentansvar, designjämförelse, installation och testgrindar.
- [Inventering och faktiska testresultat](audits/2026-10-31-readiness.md): granskade revisioner och begränsningar.

Dessa filer är tillägg. Befintliga PR #1 och #2, startsidan och historiska prototyper ändras inte av dokumentationsarbetet.

## Besökarens väg genom webbplatsen

Startsidan ska orientera: vad webbplatsen handlar om, vilka behov som leder vidare och hur en första kontakt tas. Hallöversikten ska hjälpa besökaren jämföra relevanta alternativ. Den ska inte vara en längre kopia av startsidan.

Produktsidan ska svara på nästa beslut för just det användningsområdet eller utförandet. Gemensam information om projektgång och ansvar samlas under **Så går det till**, med korta relevanta hänvisningar från produktsidorna. Kontakt är den första planerade vägen för en förfrågan; inte en påhittad prisberäkning eller en oimplementerad offertguide.

Detta är en planeringsmodell. Påståenden om vad Hallpartner faktiskt levererar måste verifieras separat. Varken konkurrenternas utbud eller den befintliga WordPress-texten bevisar Hallpartners erbjudande.

## Sidor i första innehållsomgången

URL:erna nedan är **bevarandeförslag från SEO v0.2 (2026-11-01)**, inte beslutade nya routes. De gamla WordPress-adresserna ska först verifieras med full crawl och GSC. Kolumnen ”sidans uppgift” är redaktionell planering, inte ny kundcopy. Fullständiga utkast och deras sektionsordning måste läsas in innan respektive sida byggs.

| Sida / föreslagen URL | Sidans särskilda uppgift | Vidare väg | Hero att utvärdera |
|---|---|---|---|
| Startsida `/` | Orientera och leda till rätt behov utan att återge hela sortimentsjämförelsen. | Hallöversikt, relevant hallsida, kontakt. | Fullbredds-Hero som nu finns på `/` i Draft PR #5; AMP-004 testas separat innan byte. |
| Hallöversikt `/stalhallar/` | Förklara skillnaden mellan användning, konstruktion och isolering; hjälpa besökaren välja nästa sida. | Relevanta användnings-/utförandesidor. | AMP-005, ljus. |
| Lagerhallar `/stalhallar/lagerhall/` | Behandla lagerbehov och vilka uppgifter som behövs för att diskutera ett lagerprojekt. | Relevant utförande, Så går det till, kontakt. | AMP-005. |
| Maskinhallar `/stalhallar/maskinhall/` | Behandla maskinanvändning och behov som behöver fångas före projektering. | Relevant utförande, Så går det till, kontakt. | AMP-005. |
| Ridhus `/stalhallar/ridhus/` | Ge ridhusbehov ett eget sammanhang, inte återanvända lagerhallstext med nytt namn. | Så går det till, kontakt. | AMP-004 enligt överlämningens fullbreddsriktning. |
| Tälthallar `/stalhallar/talthall/` | Förklara utförandet utan generella löften om bygglovsfrihet eller leverans. | Relevanta användningar, kontakt. | AMP-005. |
| Plåthallar `/stalhallar/plathall/` | Förklara plåtutförandet utan att göra det till ett användningsområde. | Relevanta användningar, isolering där relevant, kontakt. | AMP-005. |
| Isolerade hallar `/stalhallar/isolerad-hall/` | Förklara isolering som egenskap som kan vara relevant för flera hallar. | Relevanta användnings-/utförandesidor, kontakt. | AMP-005. |
| Så går det till `/sa-gar-det-till/` | Samla den verifierade projektgången och ansvarsfördelningen. | Förberedelse för första kontakt. | AMP-005 utan bild. |
| Om Hallpartner `/om-oss/` | Presentera verifierade uppgifter om företaget och personerna. | Kontakt. | AMP-005 med godkänt personfoto eller utan bild. |
| Kontakt `/kontakt/` | Ge en enkel faktisk kontaktväg; skilj kontaktmeddelande från offertspecifikation. | Bekräftat mottagande när backend finns. | AMP-005 utan bild. |

Ingen sida får automatiskt samma sektioner i samma ordning. Sidans bevarade originalutkast och funktion ska avgöra vad som behövs. Fullbreddsbilder används selektivt, inte som rutin mellan varje textblock.

## Informationsmodell och navigation

**Användningsområde:** lager, maskiner och ridverksamhet. **Konstruktionsutförande:** exempelvis tält eller plåt. **Egenskap:** isolering. Ett projekt kan behöva beskrivas utifrån flera av dessa samtidigt; de är inte ett enda ömsesidigt uteslutande val.

Navigationen kan samla sidorna under Hallar, med tydlig gruppering. Det är inte ett beslut om kundens slutliga sortiment. AMP-002 gör en gruppförälder till en menyknapp även när den har `href`. Lägg därför en uttrycklig länk till **Alla stålhallar** inne i gruppen så att `/stalhallar/` kan nås på både mobil och desktop. Den nya URL:en är ännu bara ett bevarandeförslag; se [SEO-sitemap v0.2](SEO_SITEMAP_V02.md).

Gemensamma menydata ska vara samma källa för AMP-002 och en serverrenderad reservnavigation. Visa inte länkar till framtida destinationssidor innan de finns. Alla CTA ska landa på en fungerande väg; ordet ”offert” får inte dölja att ett formulär endast skickar ett vanligt kontaktmeddelande.

## Villkorade och senare funktioner

| Sida eller funktion | Villkor för att införas |
|---|---|
| `/referenser/` och `/referenser/[projekt]/` | Verifierade projekt, Hallpartners faktiska roll, publiceringsrätt och godkända bilder. Inga demoprojekt som verkliga leveranser. |
| `/offert/` | AMP-001, godkänd minimal frågespecifikation och verifierad mottagning. Byggs efter innehållsarbetet. |
| `/rakna-pris/` | Namngiven leverantör, integrationsmöjlighet och verifierad betydelse av pris/Köp. Ingen egen kalkyl eller checkout nu. |
| `/integritetspolicy/` eller annan beslutad informationsyta | Relevant personuppgiftsinformation måste finnas när formuläret tas i bruk. Placering och text ska beslutas; detta får inte glömmas för att URL:en ligger bland framtida sidor. |

Kontakt v0.2 ska enligt överlämningen ha namn, e-post och meddelande som obligatoriska fält, telefon och företag som valfria. Det är inte offertguiden. Säker mottagning, validering, spamskydd och korrekt information om personuppgifter återstår. Ingen lyckad inskickning får visas utan verkligt mottagningsbesked.

## Design som ska bevaras

Direction 02 / Nordic Industrial är arbetsriktningen. Befintlig original-logotyp ska användas, men filernas ursprung och publiceringsrätt behöver kontrolleras. Inter är typografisk arbetsriktning. Preliminär gemensam innehållsbredd är 1220 px; längre text cirka 600–700 px.

De nio uppgivna profilfärgerna bevaras. Grönt används främst på CTA och små accenter. Huvudytorna utgår från grafit, off-white och betonggrått. Ingen dekorativ numrering. Numrering används när den förklarar en verklig ordningsföljd.

Den gamla `docs/DESIGN_SYSTEM.md` beskriver bland annat Manrope, 1440 px och en äldre blå/varm palett. Den är historisk när den strider mot Direction 02. Den ska inte tyst styra en ny implementation. Föreslagen korrigering hör till HP-043 i det kanoniska uppgiftsregistret.

## URL-migrering och indexering

Ingen omfattande routeändring eller 301-regel införs i denna arbetsomgång. Inventera först befintliga WordPress-adresser, inkommande länkar och relevant trafikdata. Besluta sedan mål per gammal URL. Arbetsförslagen ovan är inte i sig ett migreringsbeslut.

Preview och prototyper ska vara noindex. Föreslagna AMP-prototyper ska dessutom undantas från sitemap och hållas utanför ordinarie kundnavigation. Kontrollera metadata i byggd HTML, inte bara standardvärdet i en komponent. Inleed-preview är en separat miljö; ett lokalt bygge eller en CI-artifact visar inte vad som är publicerat där.

## Arbetsordning utan att blanda prioritet och deadline

1. **Nu, före större sidimplementation:** tillför de fullständiga elva originalutkasten enligt innehållsmanifestet. Bekräfta att de verkligen är rätt versioner. Bevara påståenden som kräver kontroll som öppna, inte som fakta.
2. **Parallellt, före plattformsintegration:** hantera den aktuella beroendeauditen och ordna verifierad läsbehörighet till det privata plattformspaketet. Node 24-baseline är testad, men AMP-installationen är inte testad.
3. **Därefter:** bygg en avgränsad, låst AMP-prototyp. Jämför mot originalets komposition utan att ersätta `/`.
4. **Före formulärdrift och lansering:** verifiera erbjudande, ansvar, bilder, kontaktmottagning, integritetsinformation och URL-migrering. Lansering och deployment kräver separata godkännanden.

HP-045 är inte klar bara för att ett manifest finns. HP-038 är inte klar bara för att den befintliga sajten bygger på Node 24. Faktisk AMP-installation, hostintegration och ordinarie byggmiljös policy återstår. HP-039 har ett nytt auditresultat, inte en åtgärdad säkerhetsstatus.

## Källor och bevisgräns

- Andreas överlämningsfil `Inklistrad text.txt`, mottagen i projektchatten 2026-10-31: senaste uppgivna sidstatus och projektmandat. Filen innehåller inte de elva sidornas fulltext.
- [PR #2, granskad HEAD 8fb1960](https://github.com/Amelio-AB/hallpartner/pull/2): tidigare kanoniska beslut/TODO. Senare uppgifter och kvarstående skillnader dokumenteras i inventeringen, inte som tysta ändringar.
- [Historiska innehållsmallar vid 566ff89](https://github.com/Amelio-AB/hallpartner/blob/566ff893e835432f6913bcb4bb78f909513eef7a/docs/research/CONTENT_PAGE_TEMPLATES.md): arbetsmallar, inte sidutkast.
- [Direction 02 vid fd7a912](https://github.com/Amelio-AB/hallpartner/blob/fd7a91295024287cc37968f4638f49d3b029a21d/docs/research/HOMEPAGE_DIRECTION_02.md): grafisk prototyp, inte bevis för kundfakta.
- [Historisk startsidesdata vid fd7a912](https://github.com/Amelio-AB/hallpartner/blob/fd7a91295024287cc37968f4638f49d3b029a21d/src/data/homepagePrototype.ts): uttryckligen placeholder/demo-copy; inte återfunnet v0.3-original.
