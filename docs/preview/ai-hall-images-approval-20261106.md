# Hallpartner – AI-bilder för hallundersidor, granskningsgodkännande 2026-11-06

**Status:** Visuellt godkänd arbetsversion på Draft PR #37. Detta godkännande registreras endast för den befintliga offentligt åtkomliga **Inleed-previewn**, `https://hallpartner-se.preview2.inleed.com`. **Ingen merge, publicering eller produktionslansering genom detta dokument.**

## Underlag och användarbesked

Andreas har i Hallpartner-samtalet:
- valt att Hallpartners sex AI-konceptbilder ska användas för hallundersidorna tills kundens egna foton kan ersätta dem;
- själv bifogat en ZIP med sex Runway-genererade 2560×1440-original och låtit dem optimeras till 1920×1080 WebP;
- granskat den lokala versionen och begärt korrigeringar av hero-gradienten och textens läsbarhet på stora skärmar;
- efter justeringarna sagt: *"vi godkänner det för nu ! DÅ kan vi gå vidare :)"*.

Detta behandlas som godkännande av bildval och granskningsutformning för projektets **preview-omfattning**, inte som ett utlåtande om tekniska konstruktionsdetaljer, ett oberoende immaterialrättsligt utlåtande eller som klartecken att merga/pusha till produktion.

## Bildkällor och begränsningar

De sex granskade filerna finns i `public/images/halls/` på Draft PR #37. Exakt sökväg, storlek och SHA-256 per fil finns i `docs/content/hallpartner-webp-import-manifest-20261106.json`. Bilderna är skapade med AI genom användarstyrda promptar i Runway-arbetsytan Amelio, inte fotografier av Hallpartners utförda projekt.

- Källfilerna är faktiska WebP-filer i `public/images/halls/` och publiceras som statiska filer; source- och output-hash är därför identiska.
- **AI-genererad illustration** framgår i det bildnära figcaption-elementet.
- De får inte utges för att visa verkliga referensprojekt, specifika leverantörers produkter, certifierade detaljer eller verifierade byggsystem.
- Bilderna ska senare kunna bytas mot kundens egna fotografier.
- Ingen extern licenshandling från bildleverantör åberopas; `externalLicenseEvidence` förblir `null`. Eventuella separata användningsvillkor för Runway måste följas.

## Preview-scope och skydd

Registret `config/preview-image-rights.json` tillför exakt sex SHA-bundna poster: källa, källhash, outputhash, preview-URL, godkännare och evidens. Ingen ändring görs i `scripts/preview/payload.mjs` eller publiceringsspärrens logik.

**Avstämning innan senare merge:** GitHub Actions ska godkänna exakt PR-HEAD, inklusive bildrättighetskontrollen, efter att dessa poster är inlagda. Andreas granskar resultatet före merge, vilket är ett separat beslut.
