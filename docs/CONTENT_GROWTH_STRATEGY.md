# Hallpartner – innehållsstrategi för bredare marknad v0.1

> 2026-11-01. Redaktionell arbetsriktning, **inte kundgodkända produkt- eller leveranspåståenden**.
> Ambitionen att Hallpartner ska bli en av de bästa aktörerna i Sverige och Norden är ett affärsmål, inte något vi kan skriva som verifierat faktapåstående. Företagets tänkbara breda leveransförmåga får vägleda vilka kundbehov som täcks, men kräver leverantörs- och kundbekräftelse före publicerad produktfakta.

## Konkurrenterna och vårt vägval

| Konkurrent | Vad de visar på sin publika webbplats | Vårt relevanta svar |
|---|---|---|
| [Borga](https://www.borga.se/stalhallar/) | Branschspecifika ingångar, egna lösningar och erfarenhetsbevis | Hjälp besökaren förstå sina behov först; använd bara verkligt bekräftade Hallpartner-bevis |
| [Lindab](https://www.lindab.se/losningar/hallar/) | Projekttänk, byggsystem och tydlig process | Beskriv vad som behöver förberedas och vilka val som påverkar projektet |
| [Hallbyggarna Jonsereds](https://hallbyggarna.se/) | Konkreta hallvarianter och vissa offentliga prisexempel | Förklara kostnadsdrivare redan nu; publicera egna priser endast med giltigt underlag |
| [Northpower](https://www.northpower.se/) | Egen teknikkompetens, referensprojekt och erbjudanden | Skapa samma typ av förtroende med Hallpartners faktiska roller och godkända projektbilder |
| [Temahallen](https://temahallen.com/vara-stalhallar/lager-logistikhallar/lagerlokaler/) | Projektsteg och kontaktuppgifter | Kort, begriplig kundresa och ett fungerande första kontaktsteg |

Detta är en kvalitativ jämförelse, inte mätta sökpositioner eller konverteringsgrader. Kopiera inte konkurrenternas marknadsföringspåståenden till Hallpartner.

## Rekommenderad huvudprincip

**Brett innehåll kring användningar – precist innehåll kring produkter.**

Vi kan redan nu skriva om behov som lager, maskiner, ridhus, industri, verkstad och lantbruk utan att lova vissa dimensioner eller montageformer. För nya undersidor måste det finnas ett eget kundproblem att lösa; en sida som bara byter ut halltypen i samma text är inte konkurrenskraftig.

Håll tre begrepp åtskilda i redaktionen: hallens användning, dess konstruktionsutförande och egenskaper som isolering. Det hjälper både läsaren och internlänkningen.

## Utvecklingsordning

| Prioritet | Innehåll | Motivering |
|---|---|---|
| Hög – nu | Stålhallar/hallöversikt | Gemensam kundingång och internlänkningsnav. Första verkliga `/stalhallar/`-arbetsversion finns nu i Draft PR #5, commit `9c3b28ce8209da1c6181ac04150876df7a82a7e8`, fortfarande noindex |
| Hög – nu | Lagerhallar och Maskinhallar | Två nya, separat skrivna noindexerade Astro-sidor i Hallpartners Draft PR #5, på de bevarade URL:erna. Återstår: visuell granskning, faktaverifiering, godkända bilder, senare AMP-002/005 och verklig kontaktmottagning. |
| Hög – nu | Startsidan, navigation och kontaktväg | Koppla rätt behov till fungerande nästa steg utan att bygga om godkänd Hero |
| Medel – efter sidutkast | Tälthallar, Plåthallar, Isolerade hallar, Ridhus | Alla fyra har nu egna **noindexerade Astro-arbetsversioner** på bevarade WordPress-vägar. Tälthallar och Ridhus fick egna sidunika utkast 2026-11-01. Teknik, leverantörer, publiceringsrätt och senare AMP-/fotoanpassning återstår. |
| Medel – före lansering | Så går det till, Om oss, Kontakt | Alla tre har nu **noindexerade Astro-arbetsversioner**. Processen är kundens förberedelseguide, inte avtalad entreprenadkedja. Kontakt visar tidigare publicerad e-post/telefon utan formulär. Om oss använder namn och roller från en tidigare webbplats, men juridisk avtalspart, aktuell kompetens, personuppgiftsgodkännande och kontaktmottagning återstår. |
| Kritisk för faktiskt offertflöde | AMP-001 och mottagande backend | Säker servervalidering, integritet, mottagare och testad leverans |
| Senare efter sökdata | Industrihallar, Verkstadshallar, Lantbrukshallar, prisguider och referenser | Bara om faktisk egen sökintention, kundunderlag och verkligt erbjudande motiverar separata sidor |

Skriv inte 20 tunna SEO-sidor och publicera inte obekräftade referenser för att se större ut än konkurrenterna.

## Information att hämta från leverantörerna

- Vilka konstruktionssystem, tak/väggmaterial och storleksintervall de faktiskt erbjuder.
- Vilka isolerings- och portlösningar som kan specificeras med produktblad.
- Dimensioneringsansvar och relevanta tekniska handlingar.
- Vad offererat pris inkluderar: stommen, beklädnad, ritningar, frakt, lossning, montage, grund, moms, tillval och giltighet.
- Kundens och leverantörens respektive ansvar; även garantier och juridisk avtalspart.
- Verklig geografisk leveransförmåga, tidsramar och eventuella förbehåll.
- Rättigheter till produktbilder, ritningar och referenser samt vilken roll Hallpartner haft.

Registrera varje svar med källa, datum och ansvarig. Saknas en uppgift: märk den **ej verifierad** i innehållsunderlaget i stället för att fylla luckan med rimliga antaganden.

## SEO- och affärsmål

Vi behöver mäta relevanta organiska klick, vilka sidtyper som leder till kvalificerade förfrågningar, vilka frågor kunderna ställer och om de hittar rätt utan att behöva backa mellan snarlika sidor.

Google Search Console och GA4-data för Hallpartner saknas i denna genomgång. Inga rankingpositioner eller procentmål får hittas på. När åtkomsten finns jämför vi befintliga URL:er innan vi låser nya.

För en nordisk ambition behövs separat beslut om vilka länder Hallpartner kan leverera i, vem som ansvarar för krav och avtal där och om lokaliserade språkversioner är motiverade. Svensk copy som bara översätts eller upprepar sökord är inte en nordisk marknadsstrategi.

## Fotografering och bildbevis

Andreas planerar egen fotografering och Hallpartner har uppgett att bildmaterial hittills främst kommer från leverantör. För varje ny sida används [bildplanen](IMAGE_PLAN.md) och [fotolistan F01–F18](PHOTO_SHOT_LIST.md) för att få verkliga produktmotiv. Utvecklingen fortsätter med bilder som **separat granskad komplettering**; Hallpartners godkända noindexade Lagerhallar/Maskinhallar ändras inte bara för att en ny bild finns. Proveniens och kommersiell rätt krävs även för självtagna bilder av kundens eller leverantörens objekt. Rätten att fotografera betyder inte automatiskt rätt att påstå att det är en Hallpartner-referens.

## Viktiga gränser

- Publicera inte "Nordens bästa", "egna montörer", "helhetsentreprenad", standardmått, priser, garantier, svarstider eller leverans i alla nordiska länder som fakta utan underlag.
- Behåll `noindex` på nya Astro-sidor tills separata beslut om fakta, URL-migrering, mottagning och release finns.
- AMP-002:s innehållsbredd förbättras i ett **separat** plattformsarbete. Återanvänd efter verifierad uppdatering av Hallpartners låsta AMP-revision. AMP-005 för nya sidintroduktioner när det fungerar i kundmiljön.
- Den äldre kontakt- och offertinformationen i WordPress är inte bevis för att den nya Astro-routen kan ta emot formulär.

## Dokument att använda direkt

- [SEO-sitemap och internlänkningsplan](SEO_SITEMAP_V02.md)
- [Webbplatsplan](WEBSITE_PLAN.md)
- [Stålhallar-sidbrief](page-briefs/stalhallar-v01.md)
- [Innehållsmanifest, äldre original ännu ej arkiverade](content/README.md)
- [Google Search Central – användbart innehåll](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
