# Personuppgiftsbedömning för Amelios preview

Datum: 2026-11-05. Gäller endast
`https://hallpartner-se.preview2.inleed.com/offert/` på Amelios befintliga
Inleed-konto. Detta är ingen bedömning av Hallpartners framtida drift.

## Bekräftade beslut

Andreas har i projektchatten uttryckligen bekräftat att Amelio AB ansvarar
för denna tillfälliga mottagning, att endast han läser `kontakt@amelio.se`
och att han raderar testförfrågningar inom 30 dagar, inklusive papperskorgen.
Samma adress används som avsändare och mottagare. Han har godkänt teknisk
implementation, publicering och ett syntetiskt test via den riktiga guiden
när nödvändiga kontroller är godkända. Berättigat intresse är villkorat av
en korrekt, dokumenterad bedömning; något oberoende juridiskt godkännande
har inte påståtts eller registrerats.

## Intresse, nödvändighet och avvägning

Bedömningen följer IMY:s krav på ett konkret berättigat intresse,
nödvändig behandling och en avvägning mot den registrerades integritet och
rimliga förväntningar. Bedömningen ska kunna redovisas:
[IMY – intresseavvägning](https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/rattslig-grund/intresseavvagning/).

1. **Intresse:** Amelio ska kunna besvara en besökares egen förfrågan till
   den uttryckligen angivna previewmottagaren och skydda den mot missbruk.
   Utvecklingstestning i sig motiverar inte insamling av verkliga kunduppgifter;
   funktionstester använder därför syntetiska data.
2. **Nödvändighet:** kontaktuppgifter behövs för den efterfrågade återkopplingen.
   Endast användningsområde, namn och e-post krävs. Telefon krävs endast om
   besökaren väljer telefonåterkoppling. Besökaren kan lämna projektfält tomma.
   Inga bilagor, köp, kreditupplysningar eller automatiska priser ingår.
   Ingen förfrågan sparas på servern under navigering i guiden.
3. **Avvägning:** det är en frivillig, besökarinitierad kontakt. Den aktiva
   sidan måste tydligt säga att Amelio tar emot uppgifterna och länka till
   integritetsinformationen innan inskick; Hallpartners varumärke får inte
   ge intryck av en annan mottagare. Alternativ kontakt med Hallpartner finns.
   Inga uppgifter används för marknadsföring, profilering eller automatiska
   beslut. Fri text innebär en risk för onödiga eller känsliga uppgifter;
   besökaren uppmanas därför att inte lämna sådana eller andras uppgifter.
   Begränsad åtkomst, högst 30 dagars inkorgslagring och rätten att invända
   begränsar intrånget. Om behandlingens ändamål, mottagare eller omfattning
   ändras måste avvägningen göras om före fortsatt behandling.

Slutsats för detta avgränsade flöde: artikel 6.1 f kan användas för den
frivilliga återkopplingen och det nödvändiga säkerhetsskyddet, under de
ovanstående begränsningarna. Beslutet om verksamhetens hantering är Andreas;
denna dokumentation redovisar bedömningen och dess tekniska villkor.

## Faktisk behandling och gallring

- Privat PHP-validering, exakt preview-Origin och krypterad SMTP. Mejlet
  stannar hos `kontakt@amelio.se`; inga automatiska vidarebefordringar görs
  av applikationen. Serverns faktiska brevlådeinställningar verifieras separat.
- Formulärinnehållet sparas som mejl. Applikationens fellogg skriver endast
  en slumpad referens vid osäkert SMTP-utfall, aldrig formulärsvaret.
- Andreas raderar förfrågan och sammanhörande svar från testinkorgen och
  papperskorgen senast 30 dagar efter mottagandet. Vid återställning av
  backup ska tidigare gallrade mejl raderas igen.
- Inleed är biträde enligt [biträdesavtalet](https://inleed.se/bitradesavtal.pdf)
  som ingår i tjänsteavtalet. [Villkor 3.3 och 6.1](https://inleed.se/avtal)
  anger rullande sjudagarsbackup respektive biträdesavtalet. Detta ger inte
  stöd för att lova omedelbar radering ur alla säkerhetskopior.
- Missbruksskyddet lagrar HMAC av IP-adress och anropstidpunkter, separat
  från formulärdata. En timmes historik begränsar till fem inskick.
  Den nya CLI-gallringen tar bara bort utgångna `lead-<sha256>.json`-poster.
  Ett jobb var 15:e minut krävs före aktivering, så normala poster gallras
  inom två timmar. Gemensamt fillås förhindrar race mellan mottagning och gallring.
- Webbhotellets egna anslutningsloggar är en separat driftbehandling;
  applikationen varken exporterar eller utökar dem. Ingen obekräftad exakt
  lagringstid eller tredjelandsplacering anges som ett verifierat faktum.

## Aktiveringsbevis

Läsande SSH-kontroll bekräftade rätt konto/server, privat V2-kod, API-bootstrap,
preview-Origin och båda mejladresserna. `enabled` och `privacy_approved`
var false. En för kort rate-hemlighet och konfigurationsläge 0644 upptäcktes;
båda måste rättas innan aktivering. Godkännanden i releasepolicyn får inte
ersätta verifierad serverkonfiguration, fungerande gallring eller lyckad
publicering. Sluttestets HTTP-referens måste matcha mottaget mejl.
