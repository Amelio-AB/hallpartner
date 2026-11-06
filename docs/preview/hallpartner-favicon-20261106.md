# Hallpartner – användarens PNG-favicon

## Ursprung och användningsunderlag

Andreas uppger i releaseuppdraget den 6 november 2026: ”Jag har skapat en ny favicon för Hallpartner: vit Hallpartner-symbol på mörkgrön bakgrund.” Samma uppdrag säger att den nya faviconen på sikt ska ersätta den gamla på befintlig Inleed-preview och begär en separat verifierad PR. Detta registrerar användarens eget material och begärda preview-användning; ingen extern licenshandling eller generell produktionsrätt har påståtts.

Originalet återfinns i commit `9bcb8ed2e757bfad1c877a257d961a12b099edf4`, fil `public/favicon.png`. Det återställdes byteexakt efter att navigationens PR #43 hade publicerats och verifierats. Återställningen i `1675a016` ändras inte historiskt; faviconen återinförs endast i denna separata kandidat.

- SHA-256 källa och kopierad PNG: `902f586b43dd7b013339c0f9869f098e48ca1ceee851117a3cc8a68a67ace8a1`.
- Originalfil: 916 288 byte. Ingen bildredigering, skalning eller omkodning.
- Scope: `https://hallpartner-se.preview2.inleed.com`.
- Båda layouts anger endast `/favicon.png` med `type="image/png"`.
- Tidigare explicita SVG-/ICO-referenser är borttagna. Historiska källfiler bevaras; ingen serverradering ingår.
- Underlaget gäller preview-användning av det användarlevererade materialet. Det är inte ett separat merge-/publiceringsbeslut för denna PR.

## Befintlig SVG på servern – separat releasevillkor

När SVG-referensen försvinner ur HTML ingår `favicon.svg` inte längre i den nya statiska payloaden. Den ligger dock kvar på servern eftersom publiceraren aldrig raderar filer. `retainedFiles()` i `scripts/preview/remote.mjs` kräver ett individuellt hashbundet beslut för denna root-fil; automatisk retention gäller bara vissa underkataloger. Det tidigare bildgodkännandet är enligt `customer-image-approval-20261104.md` inte ett generellt retentionbeslut.

Den faktiskt publicerade SVG-filen har SHA-256 `a93cfae97a15bc8add4a877b793c7e9e5ae9187a7de76eaca2dee9a72099da13`, verifierad i publiceringen av `53afac8`. Lokal CRLF ger ett annat hashvärde och får inte användas som serverbevis.

Föreslaget minsta beslut före favicon-release: bevara **endast** `favicon.svg` med denna exakta serverhash som en orefererad äldre fil, utan uppladdning, radering eller favicon-prioritet. `favicon.ico` har redan ett separat hashbundet retentionbeslut och dess gamla layoutreferens tas bort här. Inget wildcard eller förändrad verifieringslogik behövs.

Ingen ny retentionpost har registrerats som godkänd innan ett konkret beslut finns. Kandidaten lämnas som Draft om beslutet saknas. En grön PR-validering ska inte beskrivas som full publiceringsberedskap om detta villkor återstår.
