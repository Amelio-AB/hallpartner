# Hallpartner – visuell granskning utan merge eller deployment

**Arbetsgren:** `feature/hallpartner-v1-skeleton-20261031`  
**Draft PR:** https://github.com/Amelio-AB/hallpartner/pull/5  
**Startsida att granska:** `http://localhost:4321/prototype/hallpartner/start/`

Detta är en **visuell arbetsprototyp**, inte ny publicerad webbplats. Befintliga sidor under `/` är orörda och `main` är inte mergad.

## På Windows (PowerShell)

Använd **Node.js 24**, Git och en separat mapp så påverkas inte ditt vanliga arbetsprojekt.

```powershell
cd C:\webbprojekt
git clone --branch feature/hallpartner-v1-skeleton-20261031 --single-branch https://github.com/Amelio-AB/hallpartner.git Hallpartner-granskning
cd Hallpartner-granskning
node --version
npm ci
npm run dev
```

Öppna **http://localhost:4321/prototype/hallpartner/start/** i webbläsaren.  
Alla prototypsidor finns på **http://localhost:4321/prototype/hallpartner/**.  
På en senare dag, om granskningens mapp redan finns, kör `git pull --ff-only` i den mappen före `npm ci` och `npm run dev`.

Alternativ för den som redan har repo:t: skapa en separat Git-worktree från `origin/feature/hallpartner-v1-skeleton-20261031`. Byt inte den vanliga lokala arbetsgrenen och merga inte för att kunna granska.

## iPhone eller annan enhet i samma nätverk

Starta i datorns projektmapp:

```powershell
npm run dev -- --host 0.0.0.0
```

Använd datorns lokala IPv4-adress i stället för `localhost`, exempelvis
`http://<datorns-ip>:4321/prototype/hallpartner/start/`.
Dator och mobil måste vara på samma nätverk; lokal brandvägg kan behöva tillåta anslutningen. Exponera inte utvecklingsservern publikt.

## Vad ska granskas?

- **Startsidan:** delad mörk Hero med hallfoto, läsbar text och tydliga länkar.
- **Halltyper:** tre ingångar som leder vidare till existerande prototyproutes.
- **Mobilmeny:** vid smal bredd ska menyn öppnas/stängas med knapp och `Escape`, utan en extra nav.
- **Desktop/mobil:** prova runt 390 px och 1440 px samt tangentbord och textzoom.
- **Kvalitet:** knapparnas kontrast, hallbildens beskärning, läsbarhet, avstånd och eventuell horisontell scroll.

Vill du kontrollera det statiska bygget lokalt:

```powershell
npm run check
npm run lint
npm run build
node --experimental-strip-types scripts/verify-hallpartner-draft.mjs
```

CI-verifiering finns i PR #5 och ska granskas på **dess aktuella HEAD**, inte på en äldre grön körning. CI-bevisar inte att designen är snygg på en riktig mobilskärm.

## Validerade helsidesskärmbilder från CI

GitHub Actions på [Draft PR #5](https://github.com/Amelio-AB/hallpartner/pull/5) skapar en nedladdningsbar artifact `hallpartner-home-visual-<commit>` efter varje ändring. Den innehåller:

- `validated-desktop-full.png`: hela startsidan, desktopbredd 1440 px.
- `validated-mobile-full.png`: hela startsidan, mobilbredd 390 px.
- `validated-REPORT.json`: faktiskt antal H1/nav, horisontell overflow, att samtliga fyra bilder är laddade och att mobilmenyn öppnas/stängs med Escape.

Dessa tas av headless Chrome med `scripts/capture-hallpartner-home.mjs` efter att bilder och typsnitt laddats. CI kräver att denna kontroll passerar. Det är fortfarande **inte** samma sak som ett test på en fysisk iPhone; granska också localhost manuellt.

## Avsiktliga begränsningar

- Hallpartners originallogotyp saknas i repot: tillfällig textmarkering visas i stället.
- Bilderna används som **layoutdemonstration**, inte som autentiserade kundreferenser. Rättigheter och avbildade projekt är inte verifierade.
- De tidigare elva fullständiga sidutkasten är inte arkiverade i åtkomliga källor. Texten på startsidan är en ny, försiktig arbetsversion, inte originaltext eller kundgodkänd produktcopy.
- Kontaktutkastet har **ingen ansluten formulärmottagning**. Inga priser, garantier, montage- eller leveransvillkor utlovas.
- AMP-002/003/004/005 är **inte installerade** i denna gren. Header och delad Hero är tillfälliga för visuell granskning, inte kopierade plattformskomponenter.
- Offertguide och leverantörskalkylator tillhör senare fas.
- Alla prototyproutes är `noindex,nofollow` och exkluderade från sitemap. Ändra inte detta inför vanlig visuell granskning.

**Ingen merge, FTP-publicering, DNS-ändring eller uppladdning till Inleed ingår.**
