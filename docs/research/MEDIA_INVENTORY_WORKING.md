# Legacy media – arbetsinventering

> **Status:** Filinventering från `src/assets/images/legacy/`.
>
> Klassificering nedan bygger i första hand på filnamn och repository-metadata. En fil är **inte** ett verifierat Hallpartner-referensprojekt bara för att den finns här.

## Viktig regel

Innan en bild används som projektbevis måste följande verifieras:

- ursprung
- publiceringsrätt
- om Hallpartner faktiskt levererat projektet
- vad Hallpartner levererade
- kund/ort/år/storlek om det ska presenteras som case
- om kunden får namnges

## Inventerade filer

| Fil | Preliminär typ utifrån filnamn | Kommentar/status |
|---|---|---|
| `228.jpg` | Okänd | Behöver identifieras |
| `H191567f7ad934fb6aa6520bd8eeeac08N-e1773849628844.jpg` | Okänd | Behöver identifieras |
| `Isolerad-lagerbyggnad-med-Sandwich-1-1152x1536.jpg` | Isolerad lagerbyggnad | Kandidat produktbild; projektstatus okänd |
| `Lagarhall-med-eneklplat.jpg` | Lagerhall/enkelplåt | Binär dubblett av `lagerhall-med-enkelplat.jpg` enligt samma Git SHA |
| `Lagerbyggbad-med-Sandwixh-1536x1055.jpg` | Lagerbyggnad/sandwich | Kandidat produktbild; projektstatus okänd |
| `Lagerhall-2-2.jpg` | Lagerhall | Behöver identifieras |
| `Lagertalt-1536x1023.jpg` | Lagertält/tälthall | Kandidat produktbild |
| `Ridhall-med-eneklplat-och-ljusinslapp-1536x1152 (1).jpg` | Ridhall | Binär dubblett av filen utan `(1)` enligt samma Git SHA |
| `Ridhall-med-eneklplat-och-ljusinslapp-1536x1152.jpg` | Ridhall | Projektstatus okänd |
| `Ridhus-e1773849834546.png` | Ridhus | Stor PNG; ursprung/rättigheter måste kontrolleras |
| `Stalstomme-1-1536x1152.jpg` | Stålstomme/montage | Bra materialtyp för process/teknik om rättigheter finns |
| `Stalstomme-2-1536x1152.jpg` | Stålstomme/montage | Bra materialtyp för process/teknik om rättigheter finns |
| `bygga-maskinhall.jpeg` | Maskinhall/process | Projektstatus okänd |
| `isolerad-hall-med-pvc-tak.jpg` | Isolerad hall/PVC | Produkt-/teknikbild |
| `kontakt_foto_Jimmy.jpg` | Porträtt Jimmy | Kandidat teamfoto; kontrollera aktualitet/rättighet |
| `kontakt_foto_Peter.jpg` | Porträtt Peter | Kandidat teamfoto; kontrollera aktualitet/rättighet |
| `lagerbyggnad.jpeg` | Lagerbyggnad | Projektstatus okänd |
| `lagerhall-fonster-1536x1178.jpeg` | Lagerhall/fönster | Produktdetalj/projektstatus okänd |
| `lagerhall-med-enkelplat.jpg` | Lagerhall/enkelplåt | Samma binära fil som felstavad `Lagarhall...` |
| `lagerlokal-stalstomme-1536x1152.jpg` | Lagerlokal/stålstomme | Process-/projektbild |
| `maskinhall-ritning.webp` | Teknisk ritning | Särskilt värdefull materialtyp om den får publiceras |
| `maskinhall.jpeg` | Maskinhall | Projektstatus okänd |
| `maskinhall_bygga.jpeg` | Maskinhall/process | Projektstatus okänd |
| `plathall-1536x1152.jpeg` | Plåthall | Produkt-/projektbild |
| `plathallar-1536x1152.jpeg` | Plåthallar | Produkt-/projektbild |
| `talthall-1536x1152.jpeg` | Tälthall | Observera även JPG med samma basnamn; olika Git SHA |
| `talthall-1536x1152.jpg` | Tälthall | Inte binärt identisk med JPEG-versionen |
| `talthall-LED.jpg` | Tälthall/LED | Bra kandidat för tillvalsillustration om verifierad |
| `talthallar.jpg` | Tälthallar | Produkt-/projektbild |

## Dubbletter som kan städas senare

Städa **inte** på researchbranchen ännu, men notera:

1. `Lagarhall-med-eneklplat.jpg`
   och `lagerhall-med-enkelplat.jpg`
   har samma Git blob SHA och är binärt identiska.

2. `Ridhall-med-eneklplat-och-ljusinslapp-1536x1152 (1).jpg`
   och filen utan `(1)`
   har samma Git blob SHA.

## Materialtyper som är särskilt värdefulla om de kan verifieras

Prioritet:

1. verkliga färdiga hallar med känd kund/ort/scope
2. stålstomme och montagebilder
3. teknisk ritning
4. detaljer som visar portar, fönster, sandwich/PVC/plåt
5. aktuella teamfoton

## Nästa inventeringspass efter kundsvar

För varje fil lägg till:

- source_url/original
- copyright_owner
- permission_status
- project_name
- location
- year
- hall_type/use
- dimensions/area
- Hallpartner_scope
- approved_for_web
- intended_use (hero/product/reference/process/detail)
