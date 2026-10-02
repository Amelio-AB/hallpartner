# Figma → Astro implementation brief

> **Status:** Working brief for Architecture/Foundation v0.2.
>
> Use together with `.codex/skills/hallpartner-web-art-direction/SKILL.md`.

## Figma source

File:

`Hallpartner — Web Design`

Current file key:

`NJXa3fWrP7FEPKjZPLpB4d`

Pages:

- `01 — Direction & Foundations`
- `02 — Concepts & Pages`
- `03 — Components & Archive`

Selected homepage direction:

- desktop frame: `SELECTED — Homepage v0.1 / Editorial Technical`
- mobile frame: `SELECTED — Homepage v0.1 / Mobile`

The direction combines:

- editorial/architectural scale
- technical/industrial clarity
- selective human/project credibility

## Important correction from Foundation v0.1

Foundation v0.1 correctly separated:

- routes
- content
- templates
- components
- design tokens
- placeholder/draft/verified content

However, its visual architecture was too prescriptive.

Do not assume:

`HallTemplate = PageHero + ScopeSection + CostDriversSection + ProcessSection + FAQSection + CTA`

as a mandatory visual sequence.

The content model may survive while the page composition changes.

## What to preserve from current Astro foundation

Preserve unless there is a concrete reason not to:

- Astro + TypeScript
- static output
- content collections
- content status model
- config separation
- SEO/noindex behavior
- sitemap exclusion for prototype routes
- semantic design tokens
- accessibility foundations
- Astro Image
- thin route files

## What may change

The following v0.1 components are prototypes, not contracts:

- `PageHero`
- `ScopeSection`
- `ProcessSection`
- `CostDriversSection`
- `FAQSection`
- `CTASectionV2`
- `HallTemplate`
- `ReferenceTemplate`

Reuse only when the approved design actually calls for them.

## Current navigation hypothesis

- Hallar
- Så går det till
- Referenser
- Kunskap
- Om Hallpartner
- primary CTA: Få offert

This is not final business information.

## Visual rules

See the Figma Direction page and the Hallpartner art-direction skill.

Especially:

- no decorative section numbering
- avoid universal narrow wrappers
- use wide/full-bleed space intentionally
- varied information density
- real project material over decorative illustration
- technical annotation only when it communicates something
- page types should not look like clones

## Business-content safety

The current Figma selected homepage contains placeholders.

Do not treat the following as verified:

- example dimensions
- hall/project facts
- responsibility scope
- example project labels
- process claims

Implementation can retain clearly marked placeholder content on noindex prototype routes.

## Recommended implementation target

Implement the selected Figma direction first as a noindex prototype route, for example:

`/prototype/start-v02/`

Do not replace production/index route yet.

After visual comparison and approval:

1. extract stable primitives
2. update foundation components
3. implement production route
4. remove obsolete prototypes only after replacement is verified
