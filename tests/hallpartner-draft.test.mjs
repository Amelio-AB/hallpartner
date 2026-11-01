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
  hallpartnerPaletteTrial,
} from '../src/config/hallpartner-brand.ts';

const pageBySlug = new Map(draftPageSpecs.map((page) => [page.slug, page]));
const stylesheet = readFileSync(new URL('../src/styles/hallpartner-draft.css', import.meta.url), 'utf8');

test('all eleven planned pages have unique draft URLs and explicit unverified status', () => {
  assert.equal(draftPageSpecs.length, 11);
  assert.equal(pageBySlug.size, 11);
  assert.equal(new Set(draftPageSpecs.map((page) => page.intendedPath)).size, 11);
  for (const page of draftPageSpecs) {
    assert.match(page.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(page.intendedPath, /^\/(?:[a-z0-9-]+\/)*$/);
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

test('customer moodboard trial is scoped to / and meets WCAG AA normal-text contrast', () => {
  const originalShell = stylesheet.match(/\.hp-draft\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  const siteColors = stylesheet.match(/\.hp-site\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  const roles = {
    graphite: hallpartnerPaletteTrial.graphite,
    deep: hallpartnerPaletteTrial.deepGraphite,
    green: hallpartnerPaletteTrial.green,
    cta: hallpartnerPaletteTrial.ctaGreen,
    'cta-hover': hallpartnerPaletteTrial.ctaHover,
    'link-on-light': hallpartnerPaletteTrial.linkOnLight,
  };
  for (const [role, hex] of Object.entries(roles)) {
    assert.ok(siteColors.includes(`--hp-${role}: ${hex};`), `incorrect trial site ${role} token`);
  }
  assert.ok(originalShell.includes(`--hp-cta: ${hallpartnerPalette.ctaGreen};`), 'prototype palette must stay unchanged');
  const homeStyles = readFileSync(new URL('../src/styles/hallpartner-home.css', import.meta.url), 'utf8');
  assert.match(homeStyles, /\.hp-site \.hp-home-hero__overlay\s*\{/);
  assert.match(homeStyles, /\.hp-site \.hp-home-kicker--dark,/);
  assert.match(homeStyles, /rgba\(7,26,22,\.94\)/);
  const luminance = (hex) => {
    const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
    const [r, g, b] = channels.map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y);
    return (light + 0.05) / (dark + 0.05);
  };
  assert.ok(contrast('#FFFFFF', hallpartnerPaletteTrial.ctaGreen) >= 4.5);
  assert.ok(contrast('#FFFFFF', hallpartnerPaletteTrial.ctaHover) >= 4.5);
  assert.ok(contrast(hallpartnerPaletteTrial.linkOnLight, hallpartnerPaletteTrial.concrete) >= 4.5);
  assert.ok(contrast(hallpartnerPaletteTrial.linkOnLight, hallpartnerPaletteTrial.offWhite) >= 4.5);
  assert.ok(contrast(hallpartnerPaletteTrial.green, hallpartnerPaletteTrial.deepGraphite) >= 4.5);
});

test('new visitor logo preserves original transparent image and prototype branding', () => {
  const png = readFileSync(new URL('../public/images/logo_text_white.png', import.meta.url));
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16), 1536);
  assert.equal(png.readUInt32BE(20), 274);
  assert.equal(png[25], 6, 'expected RGBA PNG with alpha');

  const layout = readFileSync(new URL('../src/layouts/HallpartnerDraftLayout.astro', import.meta.url), 'utf8');
  assert.ok(layout.includes('src="/images/logo_text_white.png"'), 'missing real logo');
  assert.ok(layout.includes('alt="Hallpartner – Hallar till alla"'), 'missing meaningful alt text');
  assert.ok(layout.includes('width="1536"') && layout.includes('height="274"'), 'intrinsic dimensions not set');
  assert.ok(layout.includes('{isSite ? ('), 'site and prototype branding should be separate');
  assert.ok(layout.includes('Visuell arbetsversion · ej originallogotyp'), 'prototype label lost');
  const css = readFileSync(new URL('../src/styles/hallpartner-draft.css', import.meta.url), 'utf8');
  assert.match(css, /\.hp-site \.hp-site-logo\s*\{/);
  assert.match(css, /width:\s*clamp\(210px, 20vw, 280px\)/);
  assert.match(css, /width:\s*clamp\(150px, 44vw, 190px\)/);
  assert.match(css, /height:\s*auto/);
});

test('SEO hub /stalhallar/ has a distinct noindex visitor page and accurate route destinations', () => {
  const page = readFileSync(new URL('../src/pages/stalhallar/index.astro', import.meta.url), 'utf8');
  const layout = readFileSync(new URL('../src/layouts/HallpartnerDraftLayout.astro', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/styles/hallpartner-stalhallar.css', import.meta.url), 'utf8');
  assert.match(page, /HallpartnerSiteLayout/);
  assert.match(page, /Stålhallar för/);
  assert.equal((page.match(/<h1(?:\s|>)/g) ?? []).length, 1);
  for (const slug of ['lagerhall', 'maskinhall', 'ridhus', 'talthall', 'plathall', 'isolerad-hall']) {
    assert.ok(page.includes("href: '/stalhallar/" + slug + "/'"), 'missing native internal link to ' + slug);
  }
  for (const id of ['anvandningsomraden', 'utforanden', 'infor-projektet', 'vanliga-fragor']) {
    assert.ok(page.includes('id="' + id + '"'), 'missing content anchor: ' + id);
  }
  assert.ok(layout.includes('rel="canonical"'), 'site canonical element missing');
  assert.ok(layout.includes("Astro.url.pathname"), 'canonical must follow actual route');
  assert.ok(layout.includes("'/stalhallar/'"), 'main navigation must reach the new overview');
  assert.match(css, /\.hp-stal__hero-grid/);
  assert.match(css, /@media \(max-width: 740px\)/);
  assert.doesNotMatch(page, /montage ingår alltid|egna montörer|totalentreprenad|nordens bästa|fri bygglov|garanterad leverans/i);
  for (const spec of draftPageSpecs.filter((p) => ['hallar', 'lagerhallar', 'maskinhallar', 'ridhus', 'talthallar', 'plathallar', 'isolerade-hallar'].includes(p.slug))) {
    assert.ok(spec.intendedPath.startsWith('/stalhallar/'), 'outdated planned URL: ' + spec.slug);
  }
});

test('two visitor hall pages have distinct SEO intent, native navigation and safe review-only content', () => {
  const pages = [
    {
      name: 'lagerhall',
      heading: 'Lagerhallar – börja med',
      anchors: ['lagerbehov', 'varuflode', 'lagerutforande', 'lagerfragor'],
      distinct: ['Vad ska lagras?', 'Hur rör sig godset?', 'Hur används lagret över tid?'],
    },
    {
      name: 'maskinhall',
      heading: 'Maskinhallar med',
      anchors: ['maskinernas-behov', 'korvagar', 'arbetsytan', 'maskinhall-fragor'],
      distinct: ['In i hallen', 'På arbetsytan', 'Ut igen'],
    },
  ];
  const intros = [];
  for (const item of pages) {
    const source = readFileSync(new URL('../src/pages/stalhallar/' + item.name + '/index.astro', import.meta.url), 'utf8');
    assert.ok(source.includes('HallpartnerSiteLayout'), 'wrong shell on ' + item.name);
    assert.ok(source.includes(item.heading), 'wrong heading on ' + item.name);
    assert.equal((source.match(/<h1(?:\s|>)/g) ?? []).length, 1, 'wrong H1 in ' + item.name);
    for (const id of item.anchors) {
      assert.ok(source.includes('id="' + id + '"'), 'missing anchor ' + id);
    }
    for (const phrase of item.distinct) assert.ok(source.includes(phrase), 'missing distinct topic ' + phrase);
    assert.ok(source.includes('href="/stalhallar/"'), 'missing overview breadcrumb');
    assert.ok(source.includes("const contactHref = '/kontakt/';"), 'visitor page must use native contact destination');
    assert.doesNotMatch(source, /egna montörer|leveransgaranti|nordens bästa|garanterad leverans|bygglovsfri|frånpris/i);
    intros.push(source.match(/description="([^"]+)"/)?.[1] ?? '');
  }
  assert.notEqual(intros[0], intros[1], 'duplicate page descriptions');
  const overview = readFileSync(new URL('../src/pages/stalhallar/index.astro', import.meta.url), 'utf8');
  assert.ok(overview.includes("href: '/stalhallar/lagerhall/'"), 'overview still links to WordPress lagerhall');
  assert.ok(overview.includes("href: '/stalhallar/maskinhall/'"), 'overview still links to WordPress maskinhall');
  const home = readFileSync(new URL('../src/components/prototype/HallpartnerHomePrototype.astro', import.meta.url), 'utf8');
  assert.ok(home.includes("lagerhallar: '/stalhallar/lagerhall/'"));
  assert.ok(home.includes("maskinhallar: '/stalhallar/maskinhall/'"));
  const styles = readFileSync(new URL('../src/styles/hallpartner-hall-detail.css', import.meta.url), 'utf8');
  assert.match(styles, /\.hp-detail__split/);
  assert.match(styles, /\.hp-detail--machine/);
  assert.match(styles, /@media \(max-width: 740px\)/);
});


test('Plåthallar and Isolerade hallar have distinct native noindex review routes', () => {
  const pages = [
    { slug:'plathall', title:'Plåthallar för', ids:['plathall-begrepp','plathall-val','plathall-anvandning','plathall-fragor'] },
    { slug:'isolerad-hall', title:'Isolerade hallar för', ids:['isolering-behov','isolering-samspel','isolering-anvandning','isolering-fragor'] },
  ];
  const titles=[];
  for (const page of pages) {
    const source = readFileSync(new URL('../src/pages/stalhallar/'+page.slug+'/index.astro', import.meta.url),'utf8');
    assert.ok(source.includes('HallpartnerSiteLayout'));
    assert.ok(source.includes(page.title));
    assert.equal((source.match(/<h1(?:\s|>)/g) ?? []).length, 1, 'only one H1');
    for(const id of page.ids)assert.ok(source.includes('id="'+id+'"'), 'missing anchor '+id);
    assert.ok(source.includes('href="/stalhallar/"'));
    assert.ok(source.includes("const contactHref = '/kontakt/';"));
    assert.doesNotMatch(source,/egna montörer|nordens bästa|bygglovsfri|standardgaranti|frånpris/i);
    titles.push(source.match(/title="([^"]+)"/)?.[1]??'');
  }
  assert.notEqual(titles[0],titles[1]);
  const overview=readFileSync(new URL('../src/pages/stalhallar/index.astro',import.meta.url),'utf8');
  assert.ok(overview.includes("href: '/stalhallar/plathall/'"));
  assert.ok(overview.includes("href: '/stalhallar/isolerad-hall/'"));
});


test('Ridhus and Tälthallar provide distinct needs-first visitor content on native routes', () => {
  const pages = [
    {
      slug: 'ridhus',
      h1: 'Ridhus med plats för',
      anchors: ['ridhus-verksamhet', 'ridhus-ridyta', 'ridhus-miljo', 'ridhus-fragor'],
      unique: ['Vad ska hända inne i ridhuset?', 'Ljus och inomhusmiljö spelar roll.', 'Hur stort behöver ett ridhus vara?'],
      related: '/stalhallar/talthall/',
    },
    {
      slug: 'talthall',
      h1: 'Tälthallar efter',
      anchors: ['talthall-utforande', 'talthall-anvandning', 'talthall-byggplats', 'talthall-fragor'],
      unique: ['Vad behöver en tälthall klara?', 'Byggplatsen behöver utredas.', 'Är en tälthall alltid bygglovsfri?'],
      related: '/stalhallar/ridhus/',
    },
  ];
  const titles = [];
  const descriptions = [];
  for (const item of pages) {
    const source = readFileSync(new URL('../src/pages/stalhallar/' + item.slug + '/index.astro', import.meta.url), 'utf8');
    assert.ok(source.includes('HallpartnerSiteLayout'), 'missing visitor shell: ' + item.slug);
    assert.equal((source.match(/<h1(?:\s|>)/g) ?? []).length, 1, 'exactly one H1 required: ' + item.slug);
    assert.ok(source.includes(item.h1), 'unique H1 missing: ' + item.slug);
    assert.ok(source.includes('href="/stalhallar/"'), 'missing overview breadcrumb: ' + item.slug);
    assert.ok(source.includes("const contactHref = '/kontakt/';"), 'native contact expected on ' + item.slug);
    assert.ok(source.includes('href="' + item.related + '"'), 'missing relevant mutual link: ' + item.slug);
    for (const id of item.anchors) assert.ok(source.includes('id="' + id + '"'), 'missing anchor ' + id);
    for (const phrase of item.unique) assert.ok(source.includes(phrase), 'no distinguishing content: ' + phrase);
    assert.doesNotMatch(source, /egna montörer|montage ingår alltid|nordens bästa|garanterad leverans|tälthallar (?:är|blir) bygglovsfria|standardgaranti|frånpris:/i);
    if (item.slug === 'talthall') {
      assert.ok(source.includes('Nej, det kan inte förutsättas.'), 'building permit question must not assert an exemption');
    }
    assert.doesNotMatch(source, /<img(?:\s|>)|<Image(?:\s|>)/i, 'do not use unverified photography on new route');
    titles.push(source.match(/title="([^"]+)"/)?.[1] ?? '');
    descriptions.push(source.match(/description="([^"]+)"/)?.[1] ?? '');
  }
  assert.notEqual(titles[0], titles[1], 'different search intents need distinct SEO titles');
  assert.notEqual(descriptions[0], descriptions[1], 'different search intents need distinct SEO descriptions');

  const overview = readFileSync(new URL('../src/pages/stalhallar/index.astro', import.meta.url), 'utf8');
  const homepage = readFileSync(new URL('../src/components/prototype/HallpartnerHomePrototype.astro', import.meta.url), 'utf8');
  for (const slug of ['ridhus', 'talthall']) {
    assert.ok(overview.includes("href: '/stalhallar/" + slug + "/'"), 'overview must use native route: ' + slug);
  }
  assert.ok(homepage.includes("ridhus: '/stalhallar/ridhus/'"), 'homepage must link to native Ridhus');
  const variants = readFileSync(new URL('../src/styles/hallpartner-hall-variants.css', import.meta.url), 'utf8');
  assert.match(variants, /\.hp-detail--ridhus \.hp-detail__hero/);
  assert.match(variants, /\.hp-detail--talthall \.hp-detail__hero/);
});


test('Contact and planning pages replace legacy Amelio contact and never fake a form submission', () => {
  const contact = readFileSync(new URL('../src/pages/kontakt/index.astro', import.meta.url), 'utf8');
  const process = readFileSync(new URL('../src/pages/sa-gar-det-till/index.astro', import.meta.url), 'utf8');
  const shared = readFileSync(new URL('../src/layouts/HallpartnerDraftLayout.astro', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/styles/hallpartner-info.css', import.meta.url), 'utf8');
  for (const page of [contact, process]) {
    assert.ok(page.includes('HallpartnerSiteLayout'), 'missing shared site layout');
    assert.equal((page.match(/<h1(?:\s|>)/g) ?? []).length, 1, 'page must have one H1');
    assert.ok(page.includes('aria-label="Brödsmulor"'), 'missing visible breadcrumbs');
    assert.ok(page.includes('aria-label="På den här sidan"'), 'missing in-page navigation');
    assert.doesNotMatch(page, /andreas@amelio\.se|073-505 47 63|mailto:[^'" ]+amelio\.se|form action|<form(?:\s|>)/i);
  }
  assert.ok(contact.includes("'info@hallpartner.se'"), 'existing Hallpartner email missing');
  assert.ok(contact.includes("'tel:+46548200490'"), 'existing Hallpartner telephone missing');
  assert.ok(contact.includes("href={'mailto:' + contactEmail}"), 'real mailto link missing');
  assert.ok(process.includes('id="projekt-forberedelser"'), 'missing planning section');
  assert.ok(process.includes('id="projekt-ansvar"'), 'missing responsibilities section');
  assert.ok(process.includes('href="/kontakt/"'), 'planning page must lead to contact');
  assert.ok(shared.includes("isSiteProcess") && shared.includes("isSiteContact"));
  assert.ok(shared.includes("'/sa-gar-det-till/'") && shared.includes("'/kontakt/'"));
  assert.match(css, /\.hp-info__contact-panel/);
  assert.match(css, /@media\(max-width:740px\)/);
});
