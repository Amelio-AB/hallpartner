# Startsidesvariant — Nordic Industrial

Noindexad lokal prototyp: `/prototype/direction-02/`.

Varianten använder samma `HomepagePrototype`, typade placeholder-innehåll,
bilder, informationsordning och 1220 px breddsystem som `/prototype/start-v02/`.
En valfri `direction`-prop aktiverar en separat CSS-fil vars regler kräver
`.direction-02`. Standardvarianten och startsidan `/` behåller sitt utseende.

## Art direction

- Semantiska profil-tokens: `--hp-graphite: #272D31`, `--hp-graphite-deep: #202427`,
  `--hp-green: #6C826C`, `--hp-green-strong: #4E7A5B`, `--hp-green-hover: #557D5E`,
  `--hp-offwhite: #EBEBE8`, `--hp-concrete: #D9DDD8`, `--hp-text-dark: #202427`,
  `--hp-text-light: #F4F4F0`.
- Grafit i header, hero och projekt; kall off-white i behov, ansvar och kontakt;
  betonggrå teknikyta. Grönt används enbart som accent, främst på CTA-knappar.
- Inter med tyngre rubriker, CTA-knappar med 8 px radie och tydliga horisontella linjer.
- Kontaktens text, CTA och porträtt ligger i samma ljusa layout, sida vid sida
  från 768 px och staplat på mobil. Den extra CTA-panelen under kontakten är borttagen.
- Gröna CTA i header, hero och kontakt: `#4E7A5B`, ljus text `#F4F4F0`, ingen
  border, 8 px radie och hover `#557D5E`. Kontaktens keyboard-fokusindikator är grön.
- Stomme/ritning behåller betongytan och normal mörk rubrik utan bakgrundsbox;
  bilderna behåller 60/40-kompositionen. Projektets faktalinje och behovslistans
  pilar är små gröna accenter.
- Gröna CTA använder 19 px/700 för AA som stor fet text.
- Varm sand/taupe är ersatt genom lokala token-alias; den gamla kontaktfärgen
  `#F0ECE5` överstyrs med de nya neutrala ytorna.
- Projektbild och fakta ligger i separata gridkolumner på tablet/desktop.
- Stomme och ritning har egna bildytor och funktionella captions; mobil visar dem i följd.
- Kontaktporträtt är 112 px och underordnade nästa steg.
- Hero använder `lagerhall-green-details-hero-prototype.png` enbart i Direction 02.
- Inga nya affärsfakta, dekorativa nummer, gradienter eller skuggor.

## Kontroll

`npm run check`, `npm run lint` och `npm run build` passerar.
Den befintliga varningen om tom `src/content/knowledge` kvarstår.

Lokala Chromium-renderingar granskas vid 390, 768, 1024, 1440 och 1920 px.
Samtliga har en H1, `noindex,nofollow`, laddade bilder och ingen horisontell
overflow. Innehållsordningen är densamma och railen stannar vid 1220 px.

Ingen deployment, commit eller push ingår. Live preview kunde inte nås i
sessionen; visuell granskning där efter en framtida deployment återstår.
