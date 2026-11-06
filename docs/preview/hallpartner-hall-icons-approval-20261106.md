# Hallpartner – sex SVG-ikoner för hallmenyn (preview 2026-11-06)

## Beslut och användning

Projektägaren har valt sex SVG-ikoner i färgen `#4E7A5B`, lagt filerna i `public/icons/halls/` och uttryckligen begärt att de används i Hallpartners megameny. I detta projekt gäller användningen **endast** Amelios Inleed-preview: `https://hallpartner-se.preview2.inleed.com`.

Ikonerna föreställer lagerhall, maskinhall, häst för ridhus, plåtskikt för plåthall, snöflinga för isolerad hall samt bågformad tälthall. De är dekorativa navigationssymboler, inte produktcertifieringar eller fotografier av verkliga hallar.

## Ursprung och rättighetsavgränsning

- `lagerhall.svg`, `maskinhall.svg`, `plathall.svg` och `isolerad-hall.svg`: utgår från valda Lucide-symboler med anpassad Hallpartner-grön färg.
- `ridhus.svg`: utgår från hästhuvudsymbol i Lucide Lab och har anpassad färg.
- `talthall.svg`: förenklad båghallsillustration framtagen utifrån den referensbild och de ändringsönskemål som projektägaren gav i chatten; ingen kopia av den tidigare felaktigt valda Koboyo-hangarikonen.

Detta dokument registrerar projektägarens godkännande av **ikonval och användning i preview**, inte ett oberoende juridiskt utlåtande om tredjepartslicenser. Kontrollera eventuella tillämpliga ikonbiblioteksvillkor inför kundens slutliga produktionspublicering. Ingen extern licenshandling har importerats som separat evidens.

## Teknisk kontroll

Samtliga sex filer är statiska SVG-filer i `public/icons/halls/`. De måste registreras med exakt SHA-256 för både källa och publicerad output i `config/preview-image-rights.json`. De två hashvärdena är identiska eftersom Astro kopierar dessa filer utan bildoptimering. Detta undantager **inte** någon bild från befintlig rättighets- och publiceringsspärr.

Publicering får endast ske genom projektets vanliga granskade releaseflöde efter CI, bildrättigheter och browserkontroller. Kunden WordPress, DNS och produktionssajt ändras inte.
