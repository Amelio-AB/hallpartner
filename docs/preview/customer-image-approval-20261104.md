# Kundbesked om bilder – 2026-11-04

Detta dokument återger Andreas uttryckliga besked i uppdraget och hans
komplettering den 4 november 2026. Det är **kundens bekräftelse**, inte ett
granskat leverantörsavtal, en juridisk licensbedömning eller ett nytt bevis
från fotograf/rättighetsinnehavare.

## Supplier photos

Andreas bekräftar att Hallpartner använder bilder från sin leverantör, har
rätt att använda dem i marknadsföring och har godkänt användning på den nya
webbplatsen och den offentligt åtkomliga utvecklingspreviewn. Publicering
och normal bildoptimering inom Hallpartner-projektet omfattas.

De elva fotografiska källorna i [inventeringen](candidate-images-20261104.json)
registreras på denna grund. Beskedet anger inte leverantörens/fotografens
identitet, ett avtalsnummer eller datum för ett separat leverantörstillstånd.
Sådana uppgifter har därför inte fyllts i. `externalLicenseEvidence` är `null`.
Filernas tekniska härkomst och hash är kontrollerade; varje fotografis
externa rättighetskedja har inte verifierats oberoende.

Leverantörsbilder får inte framställas som Hallpartners egna genomförda
referensprojekt. Egna projektfotografier ska tas senare. En separat
referenssida väntar tills Hallpartner har riktiga projekt att visa.
`projekt/` ingår inte i publiceringspaketet; den gamla fjärrsidan måste
hanteras separat enligt [serverplanen](server-review-20261104.md).

## Other images

Andreas godkänner uttryckligen även följande befintliga filer för den
offentliga utvecklingspreviewn, inklusive normal bildoptimering:

| Källa | Ursprung och avgränsning |
| --- | --- |
| `public/images/hallpartner-hero-temporary.webp` | Tillfällig AI-genererad konceptbild enligt `docs/MIGRATION_FIRST_PASS.md` och `public/images/hero/README.md`. Inte ett utfört Hallpartner-projekt. Kan senare ersättas av egna fotografier. Inget externt licensbevis påstås. |
| `public/images/logo_text_white.png` | Befintlig Hallpartner-ordlogotyp i webbplatsen. Kundens användningsgodkännande; extern formgivare eller överlåtelseavtal är inte verifierade. De separat bevarade lokala logotypfilerna integreras inte. |
| `public/favicon.svg` | Befintlig H-favicon i projektets källkod. Kundens användningsgodkännande; inget separat externt licensbevis påstås. |

## Tekniskt register och begränsningar

`config/preview-image-rights.json` behåller schemaVersion 1 och det befintliga
kontraktets `source`, `sourceSha256`, `outputSha256`, `scope`, `approvedBy`
och `evidence`. Ytterligare metadata skiljer ursprung och kundbekräftelse
från extern licensdokumentation. Ingen kontroll har kringgåtts eller sänkts.

- Scope är exakt `https://hallpartner-se.preview2.inleed.com`.
- Alla 14 källor och 51 bildfiler i Linux-kandidaten är registrerade.
- Källhashar har verifierats mot verkliga filer utlästa ur godkänd Git-bas.
  Utdatahashar har beräknats från nedladdade Linux-artifactfiler, inte från
  filnamn eller antaganden. Samtliga 74 paketfiler matchar manifestet.
- Den initiala kandidaten byggdes i Actions
  [41785461912, försök 2](https://github.com/Amelio-AB/hallpartner/actions/runs/41785461912/attempts/2),
  med samma byggkod, bilder och låsta beroenden som main `0c27b4a8…`.
  PR-valideringen måste även kontrollera registret mot slutlig HEAD.
- Faviconens lokala Windows-CRLF ger andra bytes än Git/Linux-LF. Linux-
  artifactens exakta hash gäller för publicering; ingen normalisering eller
  bildändring har införts. Skillnaden redovisas i inventeringen.
- Godkännandet gäller dessa hashbundna filer. Nya eller ändrade källor,
  optimeringsresultat eller annat publiceringsmål kräver ny registrering.
- Äldre fjärrbilder utanför kandidatens 51 filer är inte automatiskt
  godkända för retention genom detta register.

Kundbeskedet löser inte kontoisolering, serverkonfiguration, gamla fjärrfiler
eller andra tredje mans rättigheter utanför beskedets omfattning. Dessa
förblir separata frågor. Ingen produktionslansering, workflowaktivering
eller serveröverföring godkänns av detta bildregister.
