# Bildpilot 2 – Stålhallars Hero och galleri

Datum: 2026-11-03. Lokal arbetsmapp: `C:\webbprojekt\hallpartner-cleanup-20261103`.
Branch: `feature/hallpartner-stalhallar-media-pilot-20261103`, skapad från exakt
`5ee8a75de5529390835490525599dba896f68509` efter kontroll av ren arbetsyta.
Ingen ny projektmapp eller worktree. Endast `/stalhallar/` ingår.

## Originalvideon: källkontroll och fallbackbeslut

Gamla [Hallpartner.se](https://hallpartner.se/) använder Elementor och anger
`https://vimeo.com/390143091?fl=pl&fe=cm#t=4s` som `background_video_link`.
Inställningarna anger start vid 6 sekunder och slut vid 44 sekunder, samt
uppspelning på mobil. Käll-HTML har sparats i den lokala granskningsmappen.

[Vimeos offentliga metadata](https://vimeo.com/api/oembed.json?url=https://vimeo.com/390143091)
identifierar **THORSPAN - STEEL STRUCTURES**, uppladdare **Thorspan**, publicerad
2020-02-08, total längd **51 sekunder**. Miniatyren visar en flygbild av ett
industriområde. Angivna 426 × 240 gäller inbäddningens visningsstorlek och är
**inte verifierad originalupplösning**.

| Kandidat | Format / upplösning / längd / storlek | Utfall |
| --- | --- | --- |
| Vimeo 390143091, faktisk Hero-källa | Originalformat, originalupplösning och filstorlek okända. 51 s enligt oEmbed. | Publik player/config svarade 401 respektive 403. Ingen åtkomlig originalfil verifierad. |
| WordPress media-ID 3795, `stalhall.mp4` | MP4, H.264 (`avc1`), 1920 × 1080, 10,01 s, 3 083 172 byte | Nåbar, nedladdad och lokalt avkodad. Visar en mörk korridor, inte den identifierade Hero-videon. Används inte. |
| Lokala projektfiler före undersökningen | Ingen MP4/WebM/MOV i aktuell checkout utanför genererade filer och granskningsmaterial | Ingen originalvideo hittad. |

WordPresskällor:
[offentligt mediaindex](https://hallpartner.se/wp-json/wp/v2/media?media_type=video&per_page=100),
[media-ID 3795](https://hallpartner.se/wp-json/wp/v2/media/3795),
[filen](https://hallpartner.se/wp-content/uploads/2025/12/stalhall.mp4).
Kandidatens dimensioner och längd verifierades både från MP4-boxar och faktisk
Chrome-avkodning; tre bildrutor sparades för motivkontroll.

Ingen FTP- eller kontrollpanelsanslutning har gjorts enligt uppdragets förbud.
Publika HTTP-källor är undersökta; någon separat originalfil hos Inleed har
därmed inte verifierats. Inga credentials har lästs eller ändrats.

**Beslut:** använd den uttryckligen beställda statiska fallbacken. Ingen annan
video ersätter originalet. Ingen fungerande video-Hero, pausfunktion eller
videofallback påstås testad. Ingen Vimeo-iframe eller videohämtning läggs in.

För att återuppta videodelen behöver Peter/Jimmy på Hallpartner bekräfta rätt
material och kontakt med Thorspan eller annan faktisk rättighetsinnehavare.
Behörig rättighetsinnehavare måste godkänna användning, bearbetning och eventuell
egen hosting. Andreas godkänner design och publiceringsbeslut. Att filmen redan
ligger på gamla sajten bevisar inte dessa rättigheter.

## Statisk Hero-pilot

`src/assets/images/legacy/Lagerbyggbad-med-Sandwixh-1536x1055.jpg` används som
dekorativt, responsivt bakgrundsfoto. Det är **inte en bildruta ur Vimeo-videon**.
Originalfilen bevaras och dess användningsrätt är fortsatt overifierad.
Astro Image skapar WebP i 480/768/1024/1536 px. Tom alt-text och `aria-hidden`
används eftersom fotot är en dekorativ bakgrund bakom den bevarade introduktionen.

H1, brödtext, båda CTA-länkarna och guidepanelen är kvar. Mörk overlay,
ljusa textfärger och synligt tangentbordsfokus hör enbart till denna Hero.
På mobil/surfplatta tonar fotot ut före guidepanelen för att undvika en extrem
beskärning över hela den höga staplade sektionen. Befintlig mörk yta är fallback
om bilden inte laddas. Ingen rörelse eller video laddas, även utan JavaScript.

Nästa steg i denna pilot: separat galleri, jämförelser och slutlig verifiering.
