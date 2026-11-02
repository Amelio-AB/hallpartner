# Beslut 2026-11-02 – Hallpartner v1 utan leverantörskalkylator

**Status:** Gällande arbetsavgränsning beslutad av Andreas 2026-11-02.
Dokumenterar projektets fortsättning, inte kundens slutgodkännande av
produkter, prissättning, fungerande mejlmottagning eller publicering.

## Bekräftat underlag

Peter meddelade via e-post den 2 november 2026 att Hallpartner fortfarande
förhandlar med en ny leverantör och **inte har någon kalkylator man vill
använda i nuläget**. Varken vald leverantör, API, prisdata, köpvillkor eller
tillgängligt testverktyg har verifierats. Kalkylatorn får därför inte
planeras som en förutsättning för webbplatsens version 1.

Andreas har beslutat att arbetet fortsätter **utan** kalkylator. Detta
ersätter äldre antaganden om att offertflödet måste samspela med
leverantörens konfigurator innan Hallpartner kan lansera sin webbplats.

## Avgränsning för version 1

- **Ja:** informativa hallsidor, kontaktväg och en fristående offertguide
  där kunden anger användning, ungefärliga mått, byggplats och kontaktdata.
- **Ja:** återanvänd **AMP-001 Quote Flow** och bevara separat
  frågekonfiguration. De tio områdena i `docs/OFFERTFLODE.md` är en
  inventering; den korta befintliga fyrastegsguiden på `/offert/` är en
  **arbetsversion**, inte affärsgodkänd slutprodukt.
- **Nej:** automatisk prisberäkning, konfigurations-/prismotor,
  prisimport, leverantörs-API/iframe, checkout, bindande onlineköp eller
  CTA som antyder att detta finns. Visa inga obekräftade priser.
- **Nej:** bygg inte platshållare för en specifik framtida leverantör.
  Håll kundens förfrågedata och mottagningen leverantörsoberoende.

## Fortsatt arbete i rätt ordning

1. Färdigställ och granska hallöversikt, hallsidor, navigering och
   befintliga CTA. Kvalificera ej verifierade sortiments-, montage-,
   garanti- eller leveranslöften för kundgranskning.
2. Behåll `/kontakt/` med telefon och mejl som användbar ingång.
   `/offert/` är inaktiv tills korta kundfrågor, mottagarbrevlåda,
   personuppgiftsinformation, privat PHP/SMTP-installation och faktisk
   mejlmottagning är kontrollerade. Sätt **inte**
   `PUBLIC_HP_LEADS_ENABLED=true` eller motsvarande serverflaggor nu.
3. Slutför säker mottagning, mobiltest, validering och kundens godkännande.
   Därefter separat bedömning av om och hur CTA kan leda till den
   aktiva offertguiden. Byt inte ut en fungerande kontaktväg mot en
   avstängd formulärknapp.
4. Fortsätt övriga lanseringskontroller: företags- och produktfakta,
   bildrättigheter, SEO/redirects, säkerhet, drift och releasebeslut.
   Inget i detta beslut är en instruktion att mergea eller deploya.

## Villkor för ett eventuellt kalkylatorspår senare

Starta först efter att Peter/Jimmy bekräftat **att Hallpartner faktiskt
vill använda ett specifikt verktyg**. Samla då demo, kontaktperson och
rättigheter; utred om 'Köp' är en order eller offert, prissättning
och moms/frakt/montage, API eller annan integration, personuppgiftsflöde
och förvaltning. Presentera kostnad och effekt innan nytt uppdrag
godkänns. En annan leverantör ska inte kräva ombyggnad av sidinnehåll
eller kundens grundläggande förfrågeflöde.

## Koppling till andra arbetsgrenar

- Kanoniska beslutet: **HPD-010**, med **HPD-005/009**, i
  [dokumentations-PR #2](https://github.com/Amelio-AB/hallpartner/pull/2).
- TODO **HP-001–003** är **P2 / Senare / Pausad**, inte blockerare.
- Utveckling av riktiga Astro-sidor: [Draft PR #5](https://github.com/Amelio-AB/hallpartner/pull/5).
- Grund för säker mottagning:
  [LEAD_RECEIVER_INTEGRATION.md](../LEAD_RECEIVER_INTEGRATION.md).
- Nästa SMTP-kontrollpunkt:
  [2026-11-02-smtp-pending.md](2026-11-02-smtp-pending.md).

**Avgränsning för denna kodändring:** text och dokumentation.
Ingen förändring av e-postcredentials, mottagningsflaggor,
FTP/DNS, noindex, mailutskick eller produktionssajt.
