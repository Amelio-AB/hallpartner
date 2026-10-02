# Grafisk riktning v0.1

> **Status:** Provisorisk arbetsriktning för struktur, prototyper och komponentgrund.
>
> Detta är **inte** slutlig grafisk profil. Hallpartner och Amelio ska senare fastställa produktionsdesignen tillsammans.

## Referens

Arbetsriktningen utgår från den uppladdade grafiska moodboarden med ett ljust, skandinaviskt industriellt uttryck.

Moodboardens påhittade logotyp, slogans och företagsbudskap är **inte Hallpartner-material** och får inte användas som fakta eller varumärkesidentitet.

## Logotyp

- Hallpartners **originala logotyp** ska användas.
- Den genererade symbol/logotyp som syns i moodboarden ska inte användas.
- Repot innehåller i nuläget `public/images/hallpartner-logo.png`.
- `public/logos/README.md` anger samtidigt att godkänd original-SVG med ljus/mörk variant fortfarande behövs.
- Produktionskomponenter bör därför inte låsas till PNG-formatet.

## Provisorisk färgpalett

Färgerna från referensen får användas som v0.1-tokens:

| Roll | Referens | Hex |
|---|---|---|
| Off white | huvudbakgrund | `#F8F7F4` |
| Light sand | varm sekundär yta | `#E8E1D6` |
| Pale stone | neutral sekundär yta/border | `#D0C9BE` |
| Sage green | accent | `#A7B89F` |
| Warm taupe | sekundär accent/materialton | `#A59686` |
| Graphite | huvudtext/mörka ytor | `#2E2E2E` |

### Viktigt

Färgroller ska vara **semantiska tokens**, exempelvis:

- `--color-bg`
- `--color-surface`
- `--color-text`
- `--color-text-muted`
- `--color-accent`
- `--color-border`
- `--color-action`
- `--color-focus`

Komponenter ska inte hårdkoda moodboardens hexvärden.

Kontrast ska verifieras enligt WCAG 2.2 AA. Sage Green får exempelvis inte automatiskt kombineras med vit text bara för att moodboarden visar gröna CTA-element.

## Typografi

Moodboarden använder **Inter**.

Inter får användas som provisoriskt v0.1-typsnitt för komponent- och sidprototyper.

Det är inte ett permanent beslut. När den grafiska profilen fastställs kan typografin bytas genom design tokens utan att sidarkitektur eller komponent-API behöver ändras.

## Visuell riktning att behålla

- ljusa, varma bakgrunder snarare än den tidigare mörka visionsdesignen
- generöst med tomrum
- stora men relativt lugna rubriker
- stark svart/grå typografi
- industriella arkitekturbilder med naturligt ljus
- nedtonade jord-/materialfärger
- sparsam accentfärg
- tydliga CTA-element utan visuellt brus
- stora bildytor där verkligt projektmaterial finns

## Sådant från moodboarden som INTE är beslutat

- den genererade logotypen
- slogans som "Built for what's next", "More than halls" etc.
- exakta kortformer/radier
- exakt headerlayout
- exakt CTA-färg
- exakta spacing-värden
- bildrenderingar som substitut för verkliga Hallpartner-projekt
- hållbarhetsclaims

## Komponentprincip

Den provisoriska designen ska läggas ovanpå en neutral komponentarkitektur.

Exempel:

`HallTemplate`, `ReferenceTemplate`, `ScopeSection`, `ProcessSection` och andra strukturkomponenter ska inte bero på denna specifika palett för att fungera.

När produktionsdesignen beslutas ska vi kunna byta:

- färger
- typsnitt
- radius
- skuggor
- spacingdetaljer

utan att skriva om sidornas informationsarkitektur.

## Bildspråk

Moodboardens styrka är kombinationen av:

- tydlig industriell arkitektur
- mänsklig skala
- naturliga material-/miljötoner
- lugna beskärningar
- fokus på byggnaden snarare än grafiska effekter

För produktion prioriteras verkliga Hallpartner-bilder framför genererade/renderade bilder när rättigheter och projektidentitet är verifierade.

## Arbetsbeslut v0.1

Denna riktning får användas för:

- noindexade prototypsidor
- komponentfoundation
- layouttester
- navigationsprototyper
- typografisk hierarki
- spacing-/gridexperiment

Den får inte användas som argument för att verksamhetscopy, claims eller slutlig varumärkesprofil är beslutad.
