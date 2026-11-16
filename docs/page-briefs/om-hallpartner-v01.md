# Om Hallpartner – nytt sidutkast och SEO-brief v0.1

> **2026-11-01 · Ny intern noindexerad Astro-arbetsversion, inte återfunnet historiskt "Om Hallpartner v0.1" och inte kundgodkänd produktionscopy.**

## Varför sidan behövs

En "Om oss"-sida ska hjälpa en besökare förstå **vem som finns bakom webbplatsen** och hur man tar kontakt. Den ska inte vara ytterligare en upprepning av hallsortimentet eller en påhittad berättelse om bolagets utveckling.

- Verklig arbetsroute: `/om-oss/` på Hallpartners [Draft PR #5](https://github.com/Amelio-AB/hallpartner/pull/5).
- Hela nya textutkastet finns i [`src/pages/om-oss/index.astro`](https://github.com/Amelio-AB/hallpartner/blob/594f6ea6792ca3cbab1d0602db7cd87624065236/src/pages/om-oss/index.astro).
- Title: `Om Hallpartner | Hallpartner`; H1: `Lär känna Hallpartner.`; unik meta description om personerna och första kontakt.
- Använder redan godkänd besökar-Header och informationssidornas befintliga CSS. **Inga nya bilder eller AMP-komponenter är installerade.** Inga ofärdiga formulär eller referenser.
- Om oss nås från sidfoten och länkar till `/stalhallar/`, `/sa-gar-det-till/` och `/kontakt/`.

## Personer – tidigare publicerat, inte kundverifierat

En sökindexerad version av [Hallpartners tidigare Om oss](https://hallpartner.se/om-oss/) (läst 2026-11-01, senast uppgiven crawl ca fyra månader tidigare) presenterade:

- **Jimmy Gustafsson** – säljare/projektledare för hallar.
- **Peter Fridland** – säljare/projektledare för hallar.

Dessa namn/rollbeskrivningar har använts i en neutral presentation med initialer som typografiska monogram. **Peter/Jimmy måste bekräfta deras aktuella roll, namnpresentation och rätt att publicera uppgifterna innan sajten lanseras.**

Den gamla sidan innehöll vidare uppgifter om särskilda erfarenhetsår, montageansvar, företagets juridiska identitet och långtgående helhetsåtaganden. Dessa är **inte** överförda. Den publicerade äldre texten är inget tillräckligt bevis för deras aktualitet eller för ett normalerbjudande. Knyt verifieringen till HP-009, HP-010, HP-015, HP-020 och centrala claim/evidence-arbetet.

## Sidans sektioner

1. **Om Hallpartner:** neutral introduktion om hallar efter verksamhetens behov, samt en väg till hallöversikten.
2. **Möt personerna:** två kort med tidigare publicerat namn och roll. Riktiga porträtt ersätter monogram endast när bilden F12 har proveniens/publiceringsrätt och personen godkänt presentationen.
3. **Det som behöver bli tydligt i ett projekt:** användningsområde, byggplats och omfattning som kundfrågor. Detta är inte Hallpartners avtalade arbetsprocess. Länk till den separat skrivna projektsidan.
4. **Kontakt:** CTA till den verkliga Astro-routen `/kontakt/`, som fortfarande måste få kundverifierade kontaktuppgifter och eventuell säker backend.

## Före indexerbar lansering

- Få kundens faktiska juridiska namn/organisationsnummer och vilken part som lämnar offert och avtal. **Publicera inte bolagsuppgifter genom att anta att den tidigare footern fortfarande stämmer.**
- Verifiera Jimmy/Peters nuvarande befattningar och om personuppgifter får användas i marknadsföringen.
- Ta godkända porträtt och bilder enligt [foto-/bildplan F12](../IMAGE_PLAN.md), utan att använda leverantörsbild som Hallpartner-referens.
- Samla styrkta fakta om verksamhetens erfarenhet och eventuella konkreta projekt innan biografier eller förtroendepåståenden utökas.
- Kundgodkänn den nya copy:n och gör separat kontroll av mobil, tangentbord, noindex/kanonisk URL, länkar och CMP/dataskydd när tillämpligt.

**Status:** klar som intern innehålls-/layoutarbetsversion för visuell granskning, **inte** färdig som kundgodkänd Om oss-sida. Det äldre originalutkastet finns fortfarande inte i arkivet.

Källor: [SEO-sitemap v0.2](../SEO_SITEMAP_V02.md), [innehållsmanifestet](../content/README.md), [central HPD-028 för närliggande visuella godkännanden](https://github.com/Amelio-AB/hallpartner/blob/c977aff85adb2bf78d262c5e957db8927ede7a2f/docs/PROJECT_DECISIONS.md) och [bildplan](../IMAGE_PLAN.md).
