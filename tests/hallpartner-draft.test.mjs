import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import {
  draftHref,
  draftPageSpecs,
} from '../src/config/hallpartner-draft-pages.ts';
import {
  hallpartnerPalette,
  hallpartnerActionText,
} from '../src/config/hallpartner-brand.ts';

const pageBySlug = new Map(draftPageSpecs.map((page) => [page.slug, page]));
const stylesheet = readFileSync(new URL('../src/styles/hallpartner-draft.css', import.meta.url), 'utf8');

test('all eleven planned pages have unique draft URLs and explicit unverified status', () => {
  assert.equal(draftPageSpecs.length, 11);
  assert.equal(pageBySlug.size, 11);
  assert.equal(new Set(draftPageSpecs.map((page) => page.intendedPath)).size, 11);
  for (const page of draftPageSpecs) {
    assert.match(page.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(page.intendedPath, /^\/(?:[a-z0-9-]+\/)?$/);
    assert.equal(page.originalTextStatus, 'not-recovered');
    assert.equal(page.sourceIsApprovedCustomerCopy, false);
    assert.ok(page.purpose.trim().length > 15);
    assert.ok(page.sectionPrompts.length > 0);
    for (const section of page.sectionPrompts) {
      assert.ok(section.heading.trim());
      assert.ok(section.editorialNote.trim());
    }
  }
});

test('all related links resolve to a real prototype route', () => {
  for (const page of draftPageSpecs) {
    for (const slug of page.relatedSlugs) {
      assert.ok(pageBySlug.has(slug), `${page.slug}: invalid ${slug}`);
      assert.notEqual(slug, page.slug);
      assert.equal(draftHref(slug), `/prototype/hallpartner/${slug}/`);
    }
  }
});

test('no unbuilt quote wizard, calculator or reference page is promised', () => {
  const allSlugs = draftPageSpecs.map((page) => page.slug);
  for (const forbidden of ['offert', 'rakna-pris', 'referenser']) {
    assert.ok(!allSlugs.includes(forbidden));
  }
  assert.equal(pageBySlug.get('kontakt')?.hero, 'intro');
});

test('information model keeps application, construction, and insulation distinct', () => {
  for (const slug of ['lagerhallar', 'maskinhallar', 'ridhus']) {
    assert.equal(pageBySlug.get(slug)?.group, 'usage');
  }
  for (const slug of ['plathallar', 'talthallar']) {
    assert.equal(pageBySlug.get(slug)?.group, 'construction');
  }
  assert.equal(pageBySlug.get('isolerade-hallar')?.group, 'property');
});

test('approved full-bleed home hero remains a labelled draft, not AMP integration', () => {
  assert.equal(pageBySlug.get('start')?.hero, 'fullbleed');
  assert.equal(pageBySlug.get('ridhus')?.hero, 'signature');
  const home = readFileSync(new URL('../src/components/prototype/HallpartnerHomePrototype.astro', import.meta.url), 'utf8');
  const homeStyles = readFileSync(new URL('../src/styles/hallpartner-home.css', import.meta.url), 'utf8');
  assert.ok(home.includes('src="/images/hallpartner-hero-temporary.webp"'));
  assert.match(home, /AI-genererad konceptbild/);
  assert.match(homeStyles, /\.hp-home-hero__background\s*\{/);
  assert.doesNotMatch(homeStyles, /grid-template-columns:\s*1\.7rem 1fr/);
  assert.doesNotMatch(home, /hp-home-(?:number|step|index|badge)/);
});

test('CSS shell color roles mirror the verified Direction 02 configuration', () => {
  const roles = {
    graphite: hallpartnerPalette.graphite,
    deep: hallpartnerPalette.deepGraphite,
    offwhite: hallpartnerPalette.offWhite,
    concrete: hallpartnerPalette.concrete,
    green: hallpartnerPalette.green,
    cta: hallpartnerPalette.ctaGreen,
    'cta-hover': hallpartnerPalette.ctaHover,
    'text-light': hallpartnerPalette.lightText,
    'action-text': hallpartnerActionText,
  };
  for (const [role, hex] of Object.entries(roles)) {
    assert.ok(stylesheet.includes(`--hp-${role}: ${hex};`), `missing ${role} ${hex}`);
  }
});

test('prototype shell has explicit noindex, skip-link and no production claims', () => {
  const layout = readFileSync(new URL('../src/layouts/HallpartnerDraftLayout.astro', import.meta.url), 'utf8');
  assert.ok(layout.includes('name="robots" content="noindex,nofollow"'));
  assert.ok(layout.includes('href="#main-content"'));
  // The shared shell must support both the internal prototype and the real root.
  assert.ok(layout.includes("'Prototypens navigation'"));
  assert.ok(layout.includes("'Huvudnavigation'"));
  assert.ok(layout.includes('AMP-komponenter'));
  assert.ok(!layout.includes('mountHeaderMenu('));
});

test('sitemap explicitly excludes any prototype routes', () => {
  const config = readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf8');
  assert.match(config, /!pathname\.startsWith\('\/prototype\/'\)/);
});
