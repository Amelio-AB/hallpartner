---
name: hallpartner-web-art-direction
description: Design or implement Hallpartner pages with a distinctive editorial-industrial visual language. Use for Hallpartner UI, page composition, responsive layout, Figma-to-Astro work, design reviews, and new page/component work.
---

# Hallpartner Web Art Direction

## Purpose

Prevent Hallpartner from drifting into generic AI-generated website patterns.

The site should feel:

- architectural
- industrial
- calm
- precise
- human
- credible

The visual system should support a real hall supplier, not resemble a SaaS landing page, agency template, or generic construction theme.

## Source hierarchy

When implementing a designed page:

1. approved Figma frame for the page
2. this skill
3. current Hallpartner project documentation
4. reusable project components/tokens where they genuinely fit

Do not force an approved Figma composition into an older generic section pattern just because a component already exists.

## Core principle

Standardize:

- accessibility
- typography system
- spacing tokens
- color roles
- responsive behavior
- content schemas
- interactive behavior
- component APIs where a pattern truly repeats

Do **not** standardize every page into the same visual stack.

Different page types should have different rhythm.

## Public UI rule: no decorative numbering

Do not use decorative section numbering in the public website.

Avoid:

- `01 / BEHOV`
- `02 / REFERENSER`
- `03 / PROCESS`
- decorative `01 02 03 04` beside lists
- fake project numbers used only as visual decoration

Numbers are allowed when they represent real information:

- dimensions
- year
- quantity
- verified project number
- price
- timeline
- technical values

Internal Figma/document numbering is fine.

## Layout grammar

Do not place every section inside the same centered max-width wrapper.

Use deliberately different spatial modes:

- full-bleed
- wide
- content
- reading-width
- technical side rail
- asymmetric split
- edge-aligned text
- image breakout
- dense information strip
- quiet open section

A page should vary density on purpose.

Do not repeat the same vertical padding and section structure throughout an entire page without a reason.

## Page-specific composition

Before designing or implementing a major page, identify:

1. What must the visitor understand?
2. What evidence is strongest?
3. What material deserves visual scale?
4. What is this page's signature visual moment?
5. How should this page differ from the other page types?

### Homepage

Most flexible composition.

Should establish Hallpartner's visual identity and buying logic.

Prefer:

- strong architectural scale
- wide/full-bleed project imagery
- useful technical annotation
- early proof
- clear route from need to solution

Avoid turning the homepage into a catalogue of reusable cards.

### Hall / product page

Should help the customer understand a solution.

Can use:

- technical comparison
- scope/responsibility
- cost drivers
- drawings/measurements
- product-specific project imagery

It should not simply be the homepage sections with different copy.

### Reference page

Should feel editorial and evidence-led.

Prefer:

- large project imagery
- montage sequence
- factual project data
- Hallpartner scope
- project narrative

Do not force project cases into generic marketing cards.

### Knowledge page

Reading clarity takes priority.

A narrower reading column is appropriate here even though it is undesirable as the universal site wrapper.

## Signature devices

Use selectively:

- technical annotation integrated into real project imagery
- dimensions and material notes
- project fact rails
- responsibility matrices
- strong scale contrast between image, headline and technical caption
- montage/process imagery
- real drawings where rights are verified
- real people where relevant

These should communicate information, not act as decoration.

## Image direction

Prefer verified real Hallpartner material:

1. finished real projects
2. steel frame / construction
3. montage
4. technical details
5. drawings
6. people involved in delivery

Do not rely only on polished exterior images.

Do not use generated images as reference-project evidence.

## Default anti-patterns

Avoid by default unless the design has a concrete reason:

- identical three-card grids
- icon + heading + paragraph repeated three or four times
- centered eyebrow + huge heading + paragraph + two buttons
- alternating left-image/right-text zig-zag sections
- excessive rounded cards
- excessive pill-shaped UI
- decorative gradients
- glassmorphism
- floating blobs
- arbitrary shadows
- every image having the same radius
- every section using the same wrapper
- repeated CTA banners after every section
- generic “premium B2B” composition

## Components

Do not create a component merely because an HTML fragment exists.

Create/reuse a component when:

- the interaction/behavior repeats
- the semantic pattern repeats
- the design pattern genuinely repeats
- it has a stable API

If two sections contain similar information but need different composition, they do not have to share the same visual component.

## Figma-to-Astro implementation

When a Figma node is supplied:

- treat the Figma frame as visual source of truth
- preserve the existing Astro/TypeScript/static-output stack
- do not add React, Vue or Svelte without a real technical need
- adapt Figma to semantic HTML
- reuse content collections and typed data
- use Astro Image for local images
- maintain WCAG 2.2 AA
- keep mobile behavior intentional, not just stacked desktop
- use semantic design tokens rather than hardcoded brand colors throughout components

If Figma conflicts with accessibility, responsiveness, or verified business facts, fix the implementation responsibly and document the deviation.

## Placeholder and claims

Never convert prototype copy into a Hallpartner claim merely because it appears in Figma.

Respect content statuses:

- placeholder
- draft
- verified

Do not invent:

- delivery scope
- guarantees
- certifications
- experience
- geographic coverage
- pricing
- timelines
- partnerships
- reference-project facts

## Creative-director self-review

Before considering a UI task complete, ask:

- Would this still be recognizable without the Hallpartner logo?
- Does it look like a generic AI-generated landing page?
- Are too many elements inside the same content wrapper?
- Is the same card form repeated unnecessarily?
- Does this page have one memorable composition idea?
- Is the page's density intentionally varied?
- Are images doing real work?
- Is technical information integrated rather than decorated?
- Is any visible numbering decorative?
- Does mobile have its own hierarchy rather than just stacking desktop?

If the result still feels generic, revise the composition before calling the work complete.


## Layout width system

Full-width is a selective accent, not the default page container.

Use three primary spatial widths:

- **full-bleed** — reserved for major project imagery, hero imagery, selected bands and moments where physical scale matters
- **wide content rail** — default for navigation, lists, responsibility, project facts and most structured content
- **reading width** — for explanatory copy, knowledge content and longer text

Avoid both extremes:

- do not trap every section in a narrow centered wrapper
- do not stretch every section across the full viewport

On a 1440px desktop, use a centered wide rail around 1180–1240px as a starting point for text-heavy sections, then break out deliberately where the composition benefits.

Whitespace must improve grouping and rhythm. If related text is visually too far apart, reduce the working width before adding decoration.

### Selective full-width rule

Good candidates for full-width or breakout treatment:

- hero project image
- large reference/project imagery
- montage sequences
- selected visual transition bands

Poor candidates for universal full-width treatment:

- navigation labels
- explanatory paragraphs
- responsibility matrices
- category lists
- contact details
- factual metadata that needs comparison
