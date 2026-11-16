# Hallpartner – inventering och faktisk verifiering 2026-10-31

> Ingen merge, deployment, DNS-ändring eller ändring av FTP/secrets har genomförts. Dokumentationen skiljer genomförda kontroller från planerad implementation. **AMP-002/004/005 är ännu inte integrerade i Hallpartner.**

## Granskade revisioner och bevarat arbete

| Källa | Granskad HEAD / status | Användning i genomgången |
|---|---|---|
| Hallpartner main | `92ce87c7ddeef89adbc0400bf0b301b4aab2da8f` | Filinventering, README, package.json, CI/deploy-workflows, Header, Hero, äldre designsystem. |
| [PR #1](https://github.com/Amelio-AB/hallpartner/pull/1) | `43a33e54d4182662467e5d1eb2e2ec29a6c0cb7b`; öppen Draft, inte mergad vid kontroll | Ändrade filer, ProductLayout och HallTemplate. Användbara separata delar; inte automatisk adoption av hela grenen. |
| [PR #2](https://github.com/Amelio-AB/hallpartner/pull/2) | `8fb19602fd48f8279e33a7558c0e2a86968e176c`; öppen Draft, inte mergad vid kontroll | AGENTS, PROJECT_DECISIONS och TODO; registren lästes trots att de inte ligger på main. |
| Researchgren | `566ff893e835432f6913bcb4bb78f909513eef7a` | CONTENT_PAGE_TEMPLATES: innehållsstruktur, inte fullständiga nya sidutkast. |
| Hallprototypgren | `fd7a91295024287cc37968f4638f49d3b029a21d` | HOMEPAGE_DIRECTION_02 och homepagePrototype.ts: grafisk riktning och äldre demo-copy. |
| Amelio Web Platform | `763d2b1eb3ed73788bc9adf1f157a15575ba521e` | Package exports/engines, AMP-002/004/005-dokumentation, Signature-renderare samt båda Hero-stilmallarna. |

Detta är en avgränsad källinventering, inte påstående om full kodrevision av varje fil eller historisk commit. Arkivgrenen och övriga arbetsgrenar är orörda. PR #1:s tidigare testuppgifter har inte räknats som nya tester i denna session.

Main innehåller fortfarande visionssajtens komponenter och presentationssidor. Den gamla main-Heron är en fullhöjdsbakgrund med zoom-animation; den är **inte** den delade startsida v0.3 som beskrivs i överlämningen. Direction 02-prototypens data är uttryckligen placeholder. Ingen av dem får märkas om till återfunnen v0.3-copy.

## Nya leveranser

### Teknisk arbetsgren – PR #3

[PR #3](https://github.com/Amelio-AB/hallpartner/pull/3), `feature/amp-integration-readiness-2026-10-31`, exakt kod-HEAD:

`7ffdeb103135f1bd80faeffd43181427fc20215c`

Tre tillagda filer:

```text
src/config/hallpartner-brand.ts
tests/amp-brand.test.mjs
.github/workflows/amp-readiness.yml
```

Färgkonfigurationen bevarar Direction 02 och förbereder plattformens semantiska roller. Vit knapptext är en separat teknisk token för normalstor text; de nio profilfärgerna ändras inte. Modulen är inte inkopplad i befintliga sidor. Sju tester verifierar opaka färgpar och mappning.

Det nya PR-workflowet kör bara kontroller och sparar artifacts. `package.json`, `package-lock.json`, ordinarie `ci.yml` och `deploy-production.yml` är oförändrade. Ingen installerad plattformsdependency, Astro-adapter, AMP-route eller ersatt Header har levererats.

### Dokumentationsgren

`docs/website-plan-amp-2026-10-31`, baserad på samma main, tillför:

```text
docs/WEBSITE_PLAN.md
docs/content/README.md
docs/architecture/AMP_1_2_INTEGRATION.md
docs/audits/2026-10-31-readiness.md
```

Dokumentationen ändrar inga filer i PR #1 eller #2. Den innehåller ett manifest men **0/11 arkiverade fullständiga sidoriginal**. Se [manifestet](../content/README.md) för samtliga versioner, sökomfång och hur källtexterna behöver tillföras.

## Faktiska testresultat

| Kontroll | Resultat | Bevis och avgränsning |
|---|---|---|
| Plattformens post-merge-CI | Godkänd | [Run 41182265432](https://github.com/Amelio-AB/amelio-web-platform/actions/runs/41182265432), push/main på exakt plattforms-SHA. Inte ett Hallpartner-integrationstest. |
| Nya färgtester lokalt | 7/7 godkända | `node --experimental-strip-types --test tests/amp-brand.test.mjs`, Node v22.16.0. Endast nya färgkontrakt. |
| Isolerad TypeScript-kontroll lokalt | Godkänd | `tsc src/config/hallpartner-brand.ts --noEmit --strict --target ES2022 --skipLibCheck`. Inte full Astro-kontroll. |
| Ordinarie Hallpartner-CI för PR #3 | Godkänd | [Run 41183992109](https://github.com/Amelio-AB/hallpartner/actions/runs/41183992109). Ordinarie Node22-workflow är orört. |
| Ny Node24-baseline | Godkänd | [Run 41183991431, runtime-jobb](https://github.com/Amelio-AB/hallpartner/actions/runs/41183991431/job/124487035894): `npm ci`, `npm run check`, `npm run lint`, färgtester och `npm run build` passerar. Artifact anger Node **v24.22.1**, npm **11.19.1**, kod-HEAD `7ffdeb1…`. |
| Aktuell dependency audit | **Underkänd** | Samma run, [audit-jobb](https://github.com/Amelio-AB/hallpartner/actions/runs/41183991431/job/124487035988). Faktiska fynd, inte ett nätverksfel; se nedan. Hela workflowet är därför inte grönt. |
| Statisk kontroll av byggd HTML | Genomförd | Sju HTML-filer i Node24-artifact: samtliga en H1 och `noindex,nofollow`. Startsidan har ett header-element. Workshop har även sektions-header-element; det är inte i sig bevis för flera navigationssystem. |
| Webbläsarkontroll av artifact på localhost | Blockerad | Chromium kunde starta men navigation till lokal testserver nekades med `ERR_BLOCKED_BY_ADMINISTRATOR`. Inga mobil-, fokus- eller scrolltester räknas som passerade. |
| Live-preview hos Inleed | Ej verifierad | Försöket att öppna previewn från granskningsverktyget lyckades inte. Detta bevisar inte att webbplatsen är nere. Ingen arbetsgren har deployats. |
| Ren privat Git-installation av AMP | Ej genomförd | Lokal Git kunde inte slå upp github.com. Connectoråtkomst är inte en npm-/CI-credential. Låsfil och importer är därför inte integrationstestade. |
| AMP-prototyper på 320/390/768/1280/1440px | Ej körda | Routes är inte byggda; de finns som föreslagen testplan, inte levererad funktion. |

Den lokala HTML-kontrollen gäller: `404.html`, `/`, `/kontakt/`, `/projekt/`, `/roadmap/`, `/vision/`, `/workshop/`. Den avser befintliga oförändrade sidor i hämtad CI-artifact, inte godkänd produktionscopy, AMP-prototyper eller Inleed-deployment.

## Säkerhetskontroll – aktuell status, inte historiska siffror

Kommando: `npm audit --audit-level=high --json` efter `npm ci --ignore-scripts --no-audit --no-fund`, inklusive utvecklingsberoenden.

`npm-audit.json` rapporterar:

| Klass | Antal paketposter |
|---|---:|
| Kritisk | 1 |
| Hög | 11 |
| Måttlig | 11 |
| Låg / information | 0 |
| Totalt | 23 |

Detta är npm:s sammanräkning av sårbarhetsklassade paketposter, **inte 23 unika exploateringar eller bevis på intrång**. En paketpost kan innehålla flera råd och indirekta beroenden. `astro` är den kritiska direktberoendeposten. Andra höga poster omfattar bland annat `sharp`, `vite`, `devalue`, `brace-expansion` och `zod`.

[Astros säkerhetsråd GHSA-26w7-cxv4-gfx2](https://github.com/advisories/GHSA-26w7-cxv4-gfx2), kontrollerat 2026-10-31, gäller behandling av en opålitlig AVIF-bild och anger patch i 7.2.8. Auditrapporten innehåller också andra Astro-råd. **7.2.8 ska därför inte läsas som rekommenderad slutversion eller som åtgärd för alla fynd.**

Hallpartner bygger statiska filer. Bedöm exponering separat för utvecklingsserver, byggkedja och publicerad statisk output; antag inte att alla fynd är direkt exploaterbara på Inleed. Behandla tills vidare okända inkommande mediefiler som opålitliga och exponera inte en utvecklingsserver publikt. En kompatibel, granskad uppgradering och ny audit krävs före lanseringsbeslut. Ingen `npm audit fix --force`, automatisk nedgradering eller osäker handredigering av låsfil har gjorts.

Artifactbevis, [körningens artifacts](https://github.com/Amelio-AB/hallpartner/actions/runs/41183991431):

- Audit artifact ID `13036226563`, `hallpartner-audit-7ffdeb103135f1bd80faeffd43181427fc20215c`. ZIP SHA-256: `4d2d29547ca8da9cfc42e3162279fd89fa52bf35d5374aa521d364cd4fd35bb5`. Hämtad och digest verifierad. Innehåller `commit.txt` och `npm-audit.json`; commit stämmer.
- Byggartifact ID `13036665651`, `hallpartner-node24-7ffdeb103135f1bd80faeffd43181427fc20215c`. ZIP SHA-256: `9adb1fb3c277803219b875fff3c4c688301cb6d6ea034c032f7153a5acd9a43c`. Hämtad och digest verifierad. Innehåller dist och runtime-/commitbevis.
- Dessa artifacts har sju dagars retention, med angivet utgångsdatum 2026-11-07. Denna dokumentation bevarar sammanfattning och identitet, men ersätter inte den fullständiga auditrapporten.

## Motstridiga eller föråldrade instruktioner

| Fråga | Skillnad | Rekommenderad samordning utan tyst omskrivning |
|---|---|---|
| Isolerade hallar | PR #2: återstår. Senare överlämning: v0.1 finns. | Notera senaste uppgivna status men begär/tillför själva originalet innan det räknas som arkiverat. Samordna HPD-021/HP-031. |
| Plattform | Äldre register behandlar 1.1.0; överlämningen och granskad källa avser 1.2.0. | Uppdatera befintliga plattformsbeslut med exakt SHA och post-merge-bevis. Skilj godkänd källa från installerat kundberoende. |
| Grafisk profil | Äldre DESIGN_SYSTEM: Manrope, blå/varm palett, 1440px. Direction02: Inter, grafit/grönt,1220px. | Direction02/överlämningen styr den nya prototypen. HP-043 samordnar senare äldre dokument. |
| Deploy | Namn/kommentarer säger dry-run; faktisk `lftp mirror --reverse` saknar `--dry-run`. | Betrakta workflowet som verklig publicering. Ingen manuell dispatch och ingen main-merge i denna arbetsomgång. HP-040 kvarstår. |
| Mallstruktur | Äldre HallTemplate låser sektionsordning; ny innehållsgranskning efterfrågar olika sidfunktioner. | Återanvänd sektioner, inte obligatorisk ordning för alla sidor. |

## Nästa prioriterade arbete

**Före större sidimplementation:** tillför de elva fullständiga originalutkasten. Det är det viktigaste skyddet mot att förlora tidigare innehållsarbete.

**Parallellt, före AMP-integration:** triagera säkerhetsfynden och ordna godkänd autentiserad installation av exakt plattforms-SHA. Testa ren npm-installation och faktisk låsfil på Node24, inte bara befintlig sajts runtime.

**Efter dessa grindar:** bygg den avgränsade AMP-prototypen enligt [integrationsförslaget](../architecture/AMP_1_2_INTEGRATION.md), kontrollera faktisk komposition och mobilinteraktion och håll startsidan orörd tills ett designbeslut finns.

HP-038 är delvis utredd, inte avslutad. HP-039 har verifierade öppna fynd, inte säkerhetsgodkännande. HP-045 är inte avslutad. Behåll skillnaden mellan uppgiftens riskprioritet och när den måste vara löst. Ingen release eller publicering är godkänd av dessa resultat.
