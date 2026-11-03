# Dependency-audit inför merge av PR #12

Analysdatum: 2026-11-03. Bas: `df791c0e0e7c81011ce5b3a80f3daea6095f76b3`.

## Underlag och avgränsning

Utgångsrapporten är artifact `hallpartner-audit-df791c0e0e7c81011ce5b3a80f3daea6095f76b3` från [Actions 41712989064](https://github.com/Amelio-AB/hallpartner/actions/runs/41712989064). De 23 paketmarkeringarna omfattar **47 unika advisories**, inklusive överlappande versioner och ärvda fynd. Varje advisory nedan kontrollerades mot GitHubs Advisory API och paketversioner mot npm-registret.

Endast Astro-kravet och npm-genererad låsfil ändras i implementationen. AMP 1.4.0 ligger kvar på `fec9ca01b3c0d4bc9002fa21832a51cf51009749`, inklusive oförändrad lock-integritet. Ingen override, audit-exkludering, CI-försvagning eller plattformsuppgradering införs. Design, innehåll, formulär, noindex och publiceringskonfiguration är oförändrade.

## Audit före och efter

| Rapport | Kritisk | Hög | Måttlig | Låg | Totalt markerade paket |
| --- | ---: | ---: | ---: | ---: | ---: |
| Baseline | 1 | 11 | 11 | 0 | 23 |
| Efter uppgradering | 0 | 0 | 9 | 0 | 9 |

46 av 47 unika advisories försvinner. Kvar: GHSA-g3hv-75wg-m249 med åtta ärvda paketmarkeringar. Full `npm audit --json` avslutar fortsatt med kod 1. Den **redan befintliga**, oförändrade CI-gränsen `--audit-level=high` kan passera; det är inte en ren full audit. Basens Composer-audit hade noll advisories; slutlig Composer-audit och övriga resultat redovisas på exakt HEAD i PR #12.

## Kontrollerade uppgraderingar

`npm install astro@7.3.3 --save --no-fund --no-audit`, följt av riktad `npm update brace-expansion devalue fast-uri js-yaml nanoid postcss postcss-selector-parser sharp smol-toml source-map-js svgo vite zod --no-fund --no-audit`. Flaggan `--no-audit` används bara under installation; audit körs separat och bevaras. Inga handskrivna lockposter. Npm uppdaterar även nödvändiga följeberoenden och plattformsspecifika binärer; full diff finns i package-lock.json. Inga nya direkta beroenden.

Astro 7.3.3 är första versionen som täcker alla fyra rapporterade Astro-advisories. Sharp 0.35.5 täcker både libheif- och den senare librsvg-varningen; enbart 0.35.4 hade varit otillräckligt. Node 24 uppfyller paketens engines.

| Paket | Installerat före | Installerat efter |
| --- | --- | --- |
| astro | 7.1.3 | 7.3.3 |
| brace-expansion | 5.0.7, 1.1.16 | 5.0.12, 1.1.21 |
| devalue | 5.8.2 | 5.9.4 |
| fast-uri | 3.1.4 | 3.1.9 |
| js-yaml | 4.3.0 | 4.3.2 |
| minimatch | 10.2.5, 3.1.5 | 10.2.5, 3.1.5 |
| nanoid | 3.3.16 | 3.3.20 |
| postcss | 8.5.20 | 8.5.32 |
| postcss-selector-parser | 7.1.4 | 7.1.7 |
| sharp | 0.35.3 | 0.35.5 |
| smol-toml | 1.7.0 | 1.9.1 |
| source-map-js | 1.2.1 | 1.2.2 |
| svgo | 4.0.2 | 4.1.0 |
| vite | 8.1.5 | 8.3.5 |
| zod | 4.4.3 | 4.6.7 |

## Användning och funktionell påverkan

Dessa bedömningar gäller nuvarande kod och statiska publiceringsmodell, inte alla tänkbara framtida användningar. Låg exponering innebär inte att en sårbar paketversion är åtgärdad.

### astro

Byggning och lokal utvecklingsserver. Statiska HTML/CSS/JS publiceras; ingen Astro-server eller bildendpoint i drift. Inga JSX/MDX-integrationspaket, auth-middleware, egen base eller View Transitions i appen. Bildkedjan bearbetar repoägda bilder vid byggning; en skadlig tillförd bild kan ändå angripa byggmiljön.

Uppgraderingspåverkan: Compiler, bildoptimering och genererad HTML kan ändras; full sid-, bild- och interaktionsregression krävs.

### brace-expansion

Utveckling: ESLint/parserns globmönster från repo och verktyg, inte besökarinput.

Uppgraderingspåverkan: Globmatchning; befintliga lint- och Node-tester.

### devalue

Astros serialisering vid byggning och möjliga framework-runtimevägar. Ingen egen import, SSR, Actions eller publik deserialiseringsendpoint i denna statiska webbplats.

Uppgraderingspåverkan: Serialisering och eventuella genererade klientdata; check/build och Chrome-regression.

### fast-uri

Utveckling: @astrojs/check → language server → yaml-language-server → ajv. Ingen URI-baserad SSRF-/redirect-policy i publicerad app använder detta paket.

Uppgraderingspåverkan: Schemas/URI-normalisering i check, verifieras med Astro check.

### js-yaml

Byggning/utveckling: Astro/internal-helpers och ESLint-konfiguration. Ingen publik YAML-inmatning.

Uppgraderingspåverkan: Parsning av projektkonfiguration/innehåll; check/lint/build.

### minimatch

Endast utveckling: ESLint och TypeScript-parser. Se den separata riskbedömningen nedan.

Uppgraderingspåverkan: Ingen säker kompatibel uppgradering genom föräldrapaketen; behåll och redovisa fyndet.

### nanoid

Byggning via PostCSS. Ingen egen customAlphabet/customRandom-användning med besökarstyrd storlek.

Uppgraderingspåverkan: Genererade identifierare; build och Chrome.

### postcss

Byggning via Vite och utveckling via eslint-plugin-astro. CSS kommer från repo/pinnad AMP; ingen publik CSS-processor.

Uppgraderingspåverkan: CSS och source maps; lint/build och visuell kontroll.

### postcss-selector-parser

Utveckling via eslint-plugin-astro; selector-strängar från källkod.

Uppgraderingspåverkan: Selectorparsning; lint.

### sharp

Byggning: Astro standardbildtjänst bearbetar lokala bilder. Native libheif/librsvg-kedjan kan angripa CI om en skadlig bild tillförs. Ingen Sharp-process eller bildinläsningsendpoint i statisk produktion.

Uppgraderingspåverkan: Bildkodning, färger, mått och native-binärer på Windows/Linux; full build och Chrome-bildkontroller.

### smol-toml

Byggning/utveckling via Astro/internal-helpers. Ingen publik TOML-inmatning.

Uppgraderingspåverkan: Konfigurations-/innehållsparsning; check/build.

### source-map-js

Byggning via PostCSS, css-tree och magicast. Inga besökarstyrda source maps behandlas i drift.

Uppgraderingspåverkan: CSS/JS-source maps; check/lint/build.

### svgo

Byggning via Astro, repoägda SVG-resurser. Ingen publik SVG-uppladdning eller removeScripts-baserad saneringstjänst.

Uppgraderingspåverkan: Optimerade SVG kan påverkas; byggning och Chrome-bildkontroll.

### vite

Lokal utvecklingsserver och byggning. Ingen Vite-server i publicerad statisk webbplats. Windows editor-anrop och exponerad utvecklingsserver är verkliga utvecklingsrisker även utan produktions-SSR.

Uppgraderingspåverkan: Bundling, utvecklingsserver och klient-JS; check/build samt samtliga Chrome-interaktioner.

### zod

Byggning/konfigurationsvalidering via Astro och sitemap. Ingen egen publik Zod-valideringsendpoint. PHP-mottagaren använder separat PHP-validering.

Uppgraderingspåverkan: Validering av konfiguration; check/build och sitemap-test.

## Varje rapporterad advisory

Patchkolumnen visar första publicerade fix för den installerade versionslinjen enligt GitHub Advisory API. Paketens före/efter-versioner och användning framgår ovan. Alla rader utom minimatch är åtgärdade i den nya låsfilen.

| Paket | Advisory och problem | Svårighet | Första fix i aktuell linje |
| --- | --- | --- | --- |
| astro | [GHSA-26w7-cxv4-gfx2](https://github.com/advisories/GHSA-26w7-cxv4-gfx2): Astro: Remote code execution through AVIF image optimization | critical | 7.2.8 |
| astro | [GHSA-376h-93r7-7g6f](https://github.com/advisories/GHSA-376h-93r7-7g6f): Astro: Authorization bypass from missing path-segment boundary check when stripping the configured base | medium | 7.2.4 |
| astro | [GHSA-98hj-9722-w3j8](https://github.com/advisories/GHSA-98hj-9722-w3j8): Astro: Reflected/Stored XSS via unescaped <script>/<style> tag content in JSX/MDX rendering | medium | 7.3.2 |
| astro | [GHSA-mpr7-6m5w-76rw](https://github.com/advisories/GHSA-mpr7-6m5w-76rw): Astro: Arbitrary CSS injection in Astro View Transitions | low | 7.3.3 |
| brace-expansion | [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg): brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash | high | 5.0.8, 1.1.17 |
| brace-expansion | [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895): brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation | high | 1.1.18, 5.0.9 |
| brace-expansion | [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr): brace-expansion: Quadratic-time expansion of the `{a},b}` rewrite causes CPU denial of service | medium | 5.0.12, 1.1.21 |
| brace-expansion | [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7): brace-expansion: DoS via uncontrolled recursion on nested brace groups causing stack exhaustion | high | 5.0.11, 1.1.20 |
| brace-expansion | [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p): brace-expansion: DoS via uncontrolled recursion in parseCommaParts causing stack exhaustion | high | 5.0.10, 1.1.19 |
| devalue | [GHSA-9rgm-9g3h-6x36](https://github.com/advisories/GHSA-9rgm-9g3h-6x36): Svelte devalue: DoS via malformed input | medium | 5.9.2 |
| devalue | [GHSA-j22f-vq7h-c4qm](https://github.com/advisories/GHSA-j22f-vq7h-c4qm): devalue: `stringify`/`uneval` serialize shared memory | high | 5.9.3 |
| devalue | [GHSA-hx4r-w6wj-j8fg](https://github.com/advisories/GHSA-hx4r-w6wj-j8fg): devalue: Residual sparse-array CPU amplification in uneval | medium | 5.9.3 |
| devalue | [GHSA-mcm9-63f2-9j32](https://github.com/advisories/GHSA-mcm9-63f2-9j32): devalue: Repeated primitive strings cause quadratic expansion in uneval | high | 5.9.3 |
| devalue | [GHSA-wf3x-273g-mvxv](https://github.com/advisories/GHSA-wf3x-273g-mvxv): devalue: Sparse arrays emitted by uneval cause eager allocation when evaluated | low | 5.9.3 |
| devalue | [GHSA-x5rw-q4pp-hg5g](https://github.com/advisories/GHSA-x5rw-q4pp-hg5g): devalue: stringifyAsync can cause an unhandled rejection despite a caught returned promise | high | 5.9.3 |
| devalue | [GHSA-4q55-j62x-fr9h](https://github.com/advisories/GHSA-4q55-j62x-fr9h): devalue: Malformed null-prototype object keys bypass __proto__ rejection via property-key coercion | medium | 5.9.3 |
| devalue | [GHSA-r9w8-h9r3-54w4](https://github.com/advisories/GHSA-r9w8-h9r3-54w4): devalue: Custom ArrayBuffer revivers can bypass typed-array allocation validation | high | 5.9.3 |
| fast-uri | [GHSA-7p8r-x3mc-p8w7](https://github.com/advisories/GHSA-7p8r-x3mc-p8w7): fast-uri vulnerable to host confusion via backslash authority introducer | high | 3.1.5 |
| fast-uri | [GHSA-5jgf-p345-68v8](https://github.com/advisories/GHSA-5jgf-p345-68v8): fast-uri vulnerable to host confusion via skipped IDN canonicalization on scheme-relative references | high | 3.1.6 |
| fast-uri | [GHSA-f65p-4m7j-42xc](https://github.com/advisories/GHSA-f65p-4m7j-42xc): fast-uri vulnerable to server-side request forgery via malformed IPv6 normalization | high | 3.1.6 |
| fast-uri | [GHSA-fph4-wmhf-6fwf](https://github.com/advisories/GHSA-fph4-wmhf-6fwf): fast-uri vulnerable to server-side request forgery via repeated hostname percent-decoding | high | 3.1.6 |
| fast-uri | [GHSA-jqff-g426-hqxp](https://github.com/advisories/GHSA-jqff-g426-hqxp): fast-uri vulnerable to host confusion via percent-encoded scheme normalization | high | 3.1.6 |
| fast-uri | [GHSA-qw65-cvwx-89v3](https://github.com/advisories/GHSA-qw65-cvwx-89v3): fast-uri vulnerable to authority injection via an unvalidated port in serialize | high | 3.1.7 |
| fast-uri | [GHSA-hrr3-gc8f-f4qj](https://github.com/advisories/GHSA-hrr3-gc8f-f4qj): fast-uri vulnerable to inconsistent host case normalization via percent-encoded octets | medium | 3.1.8 |
| fast-uri | [GHSA-w74x-v6f9-j3xg](https://github.com/advisories/GHSA-w74x-v6f9-j3xg): fast-uri vulnerable to URI scheme spoofing via percent-encoded scheme decoding | medium | 3.1.9 |
| fast-uri | [GHSA-xhq7-xmqj-769h](https://github.com/advisories/GHSA-xhq7-xmqj-769h): fast-uri vulnerable to improper path equivalence in relative reference normalization | low | 3.1.9 |
| fast-uri | [GHSA-wjr9-j795-jxcr](https://github.com/advisories/GHSA-wjr9-j795-jxcr): fast-uri vulnerable to host confusion via unchecked WHATWG host canonicalization | medium | 3.1.9 |
| fast-uri | [GHSA-333x-w4r6-6crp](https://github.com/advisories/GHSA-333x-w4r6-6crp): fast-uri vulnerable to scheme injection via an unescaped first-segment colon in suffix references | low | 3.1.9 |
| js-yaml | [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj): JS-YAML: Quadratic CPU consumption in !!omap resolution (3.x and 4.x) — CVE-2026-59870 fix not backported | high | 4.3.1 |
| js-yaml | [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh): js-yaml: maxTotalMergeKeys does not limit CPU use for empty merge sources | high | 4.3.2 |
| minimatch | [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249): minimatch has potential denial of service via globparts amplification | medium | 11.0.1 |
| nanoid | [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8): nanoid: custom generators can loop indefinitely when size is zero | high | 3.3.18 |
| postcss | [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp): PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset | medium | 8.5.23 |
| postcss-selector-parser | [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf): PostCSS: Quadratic complexity in flat selector parsing allows CPU exhaustion | medium | 7.1.6 |
| sharp | [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c): sharp: Vulnerabilities in libheif: GHSA-g89c-p67h-r497 and GHSA-2jg2-4ch7-h545 | high | 0.35.4 |
| sharp | [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w): sharp : Vulnerability in librsvg dependency CVE-2026-96889 | high | 0.35.5 |
| smol-toml | [GHSA-7w5x-hrqm-74c2](https://github.com/advisories/GHSA-7w5x-hrqm-74c2): smol-toml: Denial of Service via malformed TOML documents | high | 1.7.1 |
| smol-toml | [GHSA-r4xh-jqrq-34v2](https://github.com/advisories/GHSA-r4xh-jqrq-34v2): smol-toml: Quadratic-time parse() from parseKey rescanning to end of document on each key line | medium | 1.9.0 |
| source-map-js | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q): source-map-js allows event-loop denial of service through indexed source-map section offsets | high | 1.2.2 |
| svgo | [GHSA-4vpr-x523-8j87](https://github.com/advisories/GHSA-4vpr-x523-8j87): SVGO: removeScripts incompletely sanitizes executable HTML in SVG foreignObject elements | medium | 4.1.0 |
| svgo | [GHSA-w27v-7q3p-w38r](https://github.com/advisories/GHSA-w27v-7q3p-w38r): SVGO: removeScripts allows executable links through namespace and control-character bypasses | high | 4.1.0 |
| vite | [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv): launch-editor: escapeCmdArgs() omits % escaping on Windows | medium | 8.1.6 |
| vite | [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw): launch-editor: Editor CLI flag misinterpretation causing arbitrary command execution for some editors | medium | 8.1.6 |
| vite | [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm): launch-editor: `fs.existsSync()` existence check can be bypassed on Windows | high | 8.1.6 |
| vite | [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw): Vite: Cross origin script execution through Vite custom middleware | low | 8.1.6 |
| vite | [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22): Vite: Files outside `server.fs.allow` could be served when project paths match system paths on non-Windows machine | medium | 8.1.6 |
| zod | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5): Zod can exhaust memory while validating oversized constrained collections | high | 4.6.6 |

## Kvarvarande minimatch: konkret riskbedömning

[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) beskriver CPU-/minnesförbrukning i `firstPhasePreProcess()` när angriparen styr globmönster och `optimizationLevel >= 2`. Registrets breda intervall `<11.0.1` markerar både installerade 3.1.5 och 10.2.5.

- **3.1.5 via ESLint 9.39.5:** den angivna `firstPhasePreProcess`/`optimizationLevel`-algoritmen finns inte i `node_modules/minimatch/minimatch.js`. Detta är en versionsmässig träff utan den beskrivna kodvägen, inte bevis för att paketet saknar alla risker. ESLint/config-array/eslintrc använder statiska globinställningar.
- **10.2.5 via typescript-estree 8.65.0:** `dist/commonjs/index.js` har den sårbara algoritmen, men den är villkorad av nivå >=2; default är 1. Parserns `dist/useProgramFromProjectService.js` använder `minimatch(filePath, pattern, { dot: true })`. Projektets eslint.config.js aktiverar varken projectService/allowDefaultProject eller optimeringsnivå 2. Den aktuella anropsvägen når därför inte den rapporterade algoritmen.
- Samtliga berörda paket är utvecklingsberoenden. Besökare kan inte skicka globmönster till dem; varken Node-moduler eller lintverktyg publiceras som körande server. En betrodd utvecklare kan ändra konfigurationen, vilket måste utlösa ny bedömning.
- Kontrollerat 2026-11-03: senaste ESLint 10.14.0 kräver minimatch ^10.2.6; senaste typescript-estree 8.72.1 kräver ^10.2.2. Ingendera erbjuder en normal beroendeväg till fixen 11.0.1. Större verktygsmigration löser därför inte fyndet. Auditens förslag att nedgradera eslint-plugin-astro till 0.9.0 är olämpligt. En påtvingad major-override riskerar ESLints CommonJS/API-kompatibilitet och används inte.

**Bedömning:** låg konkret risk i nuvarande utvecklingsflöde, ingen identifierad nåbar produktionsväg för denna advisory. Det är rimligt med tekniskt GO efter godkänd full regression, med detta öppet redovisade kvarvarande fynd och Andreas slutliga godkännande. Det är inte ett påstående om noll sårbarheter.

**Uppföljning:** uppgradera när ESLint och TypeScript-parserns stödda kedjor accepterar fixad minimatch. Om globmönster börjar komma från obetrodd input, optimeringsnivå 2 aktiveras eller utvecklingsverktyg används i en publik tjänst gäller **NO-GO tills ny säkerhetsbedömning/åtgärd**. Ingen suppression införs; CI fortsätter rapportera fyndet.

Ärvda måttliga markeringar: @eslint-community/eslint-utils 4.9.1, @eslint/config-array 0.21.2, @eslint/eslintrc 3.3.6, @typescript-eslint/parser 8.65.0, @typescript-eslint/typescript-estree 8.65.0, eslint 9.39.5, eslint-compat-utils 0.6.5, eslint-plugin-astro 1.7.0. Dessa har inga egna ytterligare advisories i rapporten.

## Slutverifiering och beslut

PR #12 är den slutliga resultatjournalen: exakt commit, npm ci/check/lint/build, samtliga Node/PHP-regressioner, Chrome på befintliga sidor och AMP-006/galleri/Header/Hero/Footer, full npm-audit, Composer-audit samt GitHub Actions på Node 24 och privat AMP-installation. Dokumentet beskriver analysen; testresultat får inte antas innan dessa körningar är klara.

Ingen merge eller deployment ingår. Det manuellt avstängda publiceringsworkflowet ska förbli avstängt. Tidigare integrationsrapport beskriver baseline; denna rapport ersätter dess dependency-audit-bedömning när PR:ns slutverifiering är godkänd.
