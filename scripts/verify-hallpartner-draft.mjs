/**
 * Verify rendered HTML from npm run build; source-only checks are insufficient.
 * This is a prototype guard, not an end-to-end AMP or accessibility audit.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { draftPageSpecs } from '../src/config/hallpartner-draft-pages.ts';

const dist = new URL('../dist/', import.meta.url).pathname;
const routes = ['', ...draftPageSpecs.map((page) => page.slug)];

for (const slug of routes) {
  const file = join(dist, 'prototype', 'hallpartner', slug, 'index.html');
  assert.ok(existsSync(file), `missing built prototype HTML: ${file}`);
  const html = readFileSync(file, 'utf8');
  assert.match(html, /<meta\s+name="robots"\s+content="noindex,nofollow"/);
  assert.equal((html.match(/<h1(?:\s|>)/gi) ?? []).length, 1, `wrong H1 count: ${file}`);
  assert.equal((html.match(/<header(?:\s|>)/gi) ?? []).length, 1, `duplicate header: ${file}`);
  assert.equal((html.match(/<nav(?:\s|>)/gi) ?? []).length, 1, `duplicate navigation: ${file}`);
  assert.ok(html.includes('Intern arbetsprototyp'), `missing draft marker: ${file}`);
  assert.ok(html.includes('id="main-content"'), `missing main landmark: ${file}`);
  if (slug) {
    assert.ok(html.includes('Ursprungligt fulltextutkast saknas'), `missing source warning: ${file}`);
  }
}

// Check links/anchors on EVERY prototype route, not just the finished visual pages.
// Verify destinations against generated output instead of merely matching route lists.
const builtHtml = new Map(
  routes.map((slug) => [slug, readFileSync(join(dist, 'prototype', 'hallpartner', slug, 'index.html'), 'utf8')]),
);
const ids = new Map(routes.map((slug) => [
  slug,
  [...builtHtml.get(slug).matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
]));
for (const slug of routes) {
  const html = builtHtml.get(slug);
  const existingIds = ids.get(slug);
  assert.equal(new Set(existingIds).size, existingIds.length, 'duplicate id on prototype route: ' + (slug || 'index'));
  for (const [, rawHref] of html.matchAll(/\shref="([^"]*)"/g)) {
    if (!rawHref.startsWith('#') && !rawHref.startsWith('/prototype/hallpartner/')) continue;
    const target = new URL(rawHref, 'https://prototype.example/prototype/hallpartner/' + slug + '/');
    const routePrefix = '/prototype/hallpartner/';
    assert.ok(target.pathname.startsWith(routePrefix), 'prototype href escaped route root: ' + rawHref);
    const targetSlug = target.pathname.slice(routePrefix.length).replace(/\/$/, '');
    assert.ok(routes.includes(targetSlug), 'unbuilt prototype link on ' + (slug || 'index') + ': ' + rawHref);
    assert.ok(existsSync(join(dist, 'prototype', 'hallpartner', targetSlug, 'index.html')),
      'missing linked HTML on ' + (slug || 'index') + ': ' + rawHref);
    if (target.hash) {
      const anchor = decodeURIComponent(target.hash.slice(1));
      assert.ok(ids.get(targetSlug).includes(anchor),
        'missing target anchor on ' + (slug || 'index') + ': ' + rawHref);
    } else {
      assert.notEqual(rawHref, '#', 'empty hash link on ' + (slug || 'index'));
    }
  }

  // HPD-017: no zero-padded decorative numbers in headings. Genuine process
  // sequences belong in an explicit ordered list, not in visual heading badges.
  for (const [, heading] of html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)) {
    const content = heading.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/g, ' ').trim();
    assert.doesNotMatch(content, /^0[1-9]\b/, 'decorative heading number in ' + (slug || 'index') + ': ' + content);
  }
}

// The temporary approved concept image must remain a small, real WebP asset.
// It is not evidence of a completed Hallpartner building.
const heroAsset = join(dist, 'images', 'hallpartner-hero-temporary.webp');
assert.ok(existsSync(heroAsset), 'approved temporary hero asset is missing from build');
const webp = readFileSync(heroAsset);
assert.ok(webp.length > 1000 && webp.length < 350_000, 'hero WebP asset too large/invalid');
assert.equal(webp.toString('ascii', 0, 4), 'RIFF', 'hero asset lacks RIFF header');
assert.equal(webp.toString('ascii', 8, 12), 'WEBP', 'hero asset lacks WebP signature');

const index = readFileSync(join(dist, 'prototype', 'hallpartner', 'index.html'), 'utf8');
for (const page of draftPageSpecs) {
  assert.ok(index.includes(`/prototype/hallpartner/${page.slug}/`), `index does not link to ${page.slug}`);
}

// The homepage must be an actual visual composition, not editorial placeholders.
const homepage = readFileSync(join(dist, 'prototype', 'hallpartner', 'start', 'index.html'), 'utf8');
assert.ok(homepage.includes('En hall börjar med ditt behov.'), 'missing homepage Hero');
assert.ok(homepage.includes('id="halltyper"'), 'missing hall type section');
assert.ok(homepage.includes('id="att-tanka-pa"'), 'missing planning section');
assert.ok((homepage.match(/<img(?:\s|>)/gi) ?? []).length >= 4, 'home prototype needs built image elements');
assert.ok(homepage.includes('aria-controls="hp-proto-nav"'), 'missing accessible mobile menu toggle');
for (const href of homepage.matchAll(/href="(\/prototype\/hallpartner\/[^"#?]*\/)"/g)) {
  const target = join(dist, href[1].slice(1), 'index.html');
  assert.ok(existsSync(target), 'broken local homepage link: ' + href[1]);
}
for (const anchor of ['halltyper', 'att-tanka-pa']) {
  assert.ok(homepage.includes('id="' + anchor + '"'), 'broken homepage anchor: #' + anchor);
}

// The hall overview must be a complete second visual page with working review links.
const halls = readFileSync(join(dist, 'prototype', 'hallpartner', 'hallar', 'index.html'), 'utf8');
assert.ok(halls.includes('Vilken sorts hall behöver du?'), 'missing overview Hero');
for (const id of ['hp-halls-usage', 'hp-halls-structure', 'hp-halls-insulation']) {
  assert.ok(halls.includes('id="' + id + '"'), 'missing overview section: ' + id);
}
assert.ok((halls.match(/<img(?:\s|>)/gi) ?? []).length >= 4, 'hall overview needs built image elements');
for (const slug of ['lagerhallar', 'maskinhallar', 'ridhus', 'talthallar', 'plathallar', 'isolerade-hallar', 'kontakt']) {
  assert.ok(halls.includes('/prototype/hallpartner/' + slug + '/'), 'missing overview link: ' + slug);
  assert.ok(existsSync(join(dist, 'prototype', 'hallpartner', slug, 'index.html')), 'broken overview target: ' + slug);
}

// The storage-hall page has its own visual composition, not generic editorial placeholders.
const storage = readFileSync(join(dist, 'prototype', 'hallpartner', 'lagerhallar', 'index.html'), 'utf8');
assert.ok(storage.includes('Mer plats för det som behöver förvaras.'), 'missing storage page hero');
for (const id of ['hp-storage-needs', 'hp-storage-flow', 'hp-storage-next']) {
  assert.ok(storage.includes('id="' + id + '"'), 'missing storage section: ' + id);
}
assert.ok((storage.match(/<img(?:\s|>)/gi) ?? []).length >= 2, 'storage page needs two rendered images');
assert.ok(storage.includes('Ursprungligt fulltextutkast saknas'), 'storage page must disclose missing original copy');
assert.ok(storage.includes('noindex,nofollow'), 'storage page must not be indexable');
for (const slug of ['hallar', 'kontakt']) {
  const href = '/prototype/hallpartner/' + slug + '/';
  assert.ok(storage.includes(href), 'missing storage link: ' + href);
  assert.ok(existsSync(join(dist, 'prototype', 'hallpartner', slug, 'index.html')), 'broken storage target: ' + href);
}

// Maskinhallar has a dedicated visitor-facing composition, not generic editorial placeholders.
const machines = readFileSync(join(dist, 'prototype', 'hallpartner', 'maskinhallar', 'index.html'), 'utf8');
assert.ok(machines.includes('Plats för maskiner. Utrymme för arbetet.'), 'missing machine hall Hero');
for (const id of ['hp-machines-use', 'hp-machines-movement', 'hp-machines-questions']) {
  assert.ok(machines.includes('id="' + id + '"'), 'missing machine section: ' + id);
}
assert.ok(machines.split('<img').length - 1 >= 2, 'machine page needs two rendered images');
assert.ok(machines.includes('Ursprungligt fulltextutkast saknas'), 'machine page must disclose unverified copy');
assert.ok(machines.includes('noindex,nofollow'), 'machine page must remain noindex');
for (const slug of ['hallar', 'lagerhallar', 'kontakt']) {
  const href = '/prototype/hallpartner/' + slug + '/';
  assert.ok(machines.includes(href), 'missing machine link: ' + href);
  assert.ok(existsSync(join(dist, 'prototype', 'hallpartner', slug, 'index.html')), 'broken machine target: ' + href);
}

const sitemapFiles = readdirSync(dist).filter((file) => /^sitemap.*\.xml$/.test(file));
assert.ok(sitemapFiles.length > 0, 'expected an XML sitemap from Astro build');
for (const file of sitemapFiles) {
  const xml = readFileSync(join(dist, file), 'utf8');
  assert.ok(!xml.includes('/prototype/'), `draft route leaked into ${file}`);
}

console.log(`Verified ${routes.length} static prototype pages: one header/navigation/H1, noindex, and no sitemap leaks.`);

// Rendered production-path homepage (still noindex while under construction).
const siteHome = readFileSync(join(dist, 'index.html'), 'utf8');
assert.match(siteHome, /<meta\s+name="robots"\s+content="noindex,nofollow"/);
assert.ok(siteHome.includes('En hall börjar med ditt behov.'), 'root homepage is not the approved Hero');
assert.ok(siteHome.includes('aria-label="Huvudnavigation"'), 'site nav is not visitor facing');
assert.ok(siteHome.includes('aria-controls="hp-proto-nav"'), 'mobile menu control missing');
assert.equal((siteHome.match(/<h1(?:\s|>)/gi) ?? []).length, 1, 'site has incorrect H1 count');
assert.equal((siteHome.match(/<header(?:\s|>)/gi) ?? []).length, 1, 'site has duplicate header');
assert.equal((siteHome.match(/<nav(?:\s|>)/gi) ?? []).length, 1, 'site has duplicate navigation');
for (const phrase of ['Visuell arbetsversion', 'För intern granskning', 'Intern arbetsprototyp', 'AI-genererad konceptbild', 'Ursprungligt fulltextutkast saknas', 'digital analys och vision']) {
  assert.ok(!siteHome.includes(phrase), 'prototype text on /: ' + phrase);
}
assert.ok(!siteHome.includes('/prototype/hallpartner/'), 'production path links to prototype');
assert.ok(siteHome.includes('href="/kontakt/"'), 'missing verified contact link');
assert.ok(siteHome.includes('src="/images/logo_text_white.png"'), 'missing visitor header image');
assert.ok(siteHome.includes('alt="Hallpartner – Hallar till alla"'), 'missing site logo alt');
assert.ok(!homepage.includes('src="/images/logo_text_white.png"'), 'prototype brand should remain unchanged');
assert.ok(existsSync(join(dist, 'images', 'logo_text_white.png')), 'static logo asset missing');
assert.ok((siteHome.match(/<img(?:\s|>)/gi) ?? []).length >= 4, 'site images missing');
for (const href of [...siteHome.matchAll(/\shref="([^"]+)"/g)].map(x=>x[1]).filter(x=>x.startsWith('#')||x.startsWith('/#'))) {
  const id=href.split('#')[1];
  assert.ok(id && siteHome.includes('id="'+id+'"'), 'broken root anchor: '+href);
}
console.log('Verified / homepage: Hero, one H1/header/nav, noindex, anchor targets and no prototype links.');

// New real-path Hall overview: useful content and preserved SEO identity, but
// intentionally noindex while customer claims, imagery and migration are reviewed.
const hallOverview = readFileSync(join(dist, 'stalhallar', 'index.html'), 'utf8');
assert.match(hallOverview, /<meta\s+name="robots"\s+content="noindex,nofollow"/);
assert.match(hallOverview, /<link\s+rel="canonical"\s+href="https:\/\/hallpartner\.se\/stalhallar\/"/);
assert.equal((hallOverview.match(/<h1(?:\s|>)/gi) ?? []).length, 1, 'hall overview must have exactly one H1');
assert.equal((hallOverview.match(/<header(?:\s|>)/gi) ?? []).length, 1, 'hall overview has duplicate header');
assert.equal((hallOverview.match(/<nav(?:\s|>)/gi) ?? []).length, 3, 'hall overview needs main navigation, breadcrumbs and content navigation');
assert.ok(hallOverview.includes('aria-label="Brödsmulor"'), 'missing breadcrumbs');
assert.ok(hallOverview.includes('aria-label="På den här sidan"'), 'missing page shortcuts');
assert.ok(hallOverview.includes('href="/stalhallar/"'), 'navigation does not link to real hall overview');
for (const id of ['anvandningsomraden', 'utforanden', 'infor-projektet', 'vanliga-fragor']) {
  assert.ok(hallOverview.includes('id="' + id + '"'), 'missing section anchor: ' + id);
}
for (const slug of ['lagerhall', 'maskinhall', 'ridhus', 'talthall', 'plathall', 'isolerad-hall']) {
  assert.ok(hallOverview.includes('href="/stalhallar/' + slug + '/"'), 'missing native overview destination: ' + slug);
}
assert.ok(!hallOverview.includes('/prototype/hallpartner/'), 'draft links must never be part of real overview');
assert.ok(!hallOverview.includes('AI-genererad konceptbild'), 'internal draft copy must not leak');
assert.ok(siteHome.includes('href="/stalhallar/"'), 'homepage must link to the actual hall overview');
console.log('Verified /stalhallar/: noindex, canonical, single H1, section anchors, all six hall destinations.');

// Pages migrated from WordPress paths must use the same canonical URL,
// real breadcrumbs, unique content, and only functioning local destinations.
const details = [
  { slug: 'lagerhall', label: 'Lagerhallar', ids: ['lagerbehov', 'varuflode', 'lagerutforande', 'lagerfragor'] },
  { slug: 'maskinhall', label: 'Maskinhallar', ids: ['maskinernas-behov', 'korvagar', 'arbetsytan', 'maskinhall-fragor'] },
];
for (const detail of details) {
  const html = readFileSync(join(dist, 'stalhallar', detail.slug, 'index.html'), 'utf8');
  const expected = 'https://hallpartner.se/stalhallar/' + detail.slug + '/';
  assert.ok(html.includes('name="robots" content="noindex,nofollow"'), 'detail leaked indexability: ' + detail.slug);
  assert.ok(html.includes('rel="canonical" href="' + expected + '"'), 'wrong canonical for ' + detail.slug);
  assert.equal((html.match(/<h1(?:\s|>)/gi) ?? []).length, 1, 'duplicate or missing detail H1');
  assert.equal((html.match(/<header(?:\s|>)/gi) ?? []).length, 1, 'duplicate detail header');
  assert.equal((html.match(/<nav(?:\s|>)/gi) ?? []).length, 3, 'detail must have main nav, breadcrumbs, page nav');
  assert.ok(html.includes('aria-label="Brödsmulor"'), 'missing breadcrumbs');
  assert.ok(html.includes('href="/stalhallar/"'), 'missing overview link');
  assert.ok(html.includes('href="/kontakt/"'), 'missing live contact destination');
  assert.ok(!html.includes('/prototype/hallpartner/'), 'visitor detail links to old prototype');
  for (const id of detail.ids) {
    assert.ok(html.includes('id="' + id + '"'), 'missing detail anchor ' + id + ' on ' + detail.slug);
  }
  for (const href of [...html.matchAll(/\shref="(\/stalhallar\/[^"#?]*\/)"\s*/g)].map(x => x[1])) {
    assert.ok(existsSync(join(dist, href.slice(1), 'index.html')), 'broken local hall detail link: ' + href);
  }
}
assert.ok(hallOverview.includes('href="/stalhallar/lagerhall/"'), 'overview should link to local storage hall');
assert.ok(hallOverview.includes('href="/stalhallar/maskinhall/"'), 'overview should link to local machine hall');
assert.ok(siteHome.includes('href="/stalhallar/lagerhall/"'), 'home should link to local storage hall');
assert.ok(siteHome.includes('href="/stalhallar/maskinhall/"'), 'home should link to local machine hall');
console.log('Verified migrated /stalhallar/lagerhall/ and /stalhallar/maskinhall/: noindex, canonical, anchors and internal links.');


for (const detail of [
  {slug:'plathall',ids:['plathall-begrepp','plathall-val','plathall-anvandning','plathall-fragor']},
  {slug:'isolerad-hall',ids:['isolering-behov','isolering-samspel','isolering-anvandning','isolering-fragor']}
]) {
  const html=readFileSync(join(dist,'stalhallar',detail.slug,'index.html'),'utf8');
  assert.ok(html.includes('name="robots" content="noindex,nofollow"'), 'wrong robots '+detail.slug);
  assert.ok(html.includes('rel="canonical" href="https://hallpartner.se/stalhallar/'+detail.slug+'/"'),'wrong canonical '+detail.slug);
  assert.equal((html.match(/<h1(?:\s|>)/gi)??[]).length,1,'H1 count '+detail.slug);
  assert.equal((html.match(/<header(?:\s|>)/gi)??[]).length,1,'header count '+detail.slug);
  assert.equal((html.match(/<nav(?:\s|>)/gi)??[]).length,3,'nav count '+detail.slug);
  assert.ok(html.includes('aria-label="Brödsmulor"'));
  for(const id of detail.ids)assert.ok(html.includes('id="'+id+'"'), 'missing section '+id);
  assert.ok(!html.includes('/prototype/hallpartner/'));
  for (const href of [...html.matchAll(/\shref="(\/stalhallar\/[^"#?]*\/)"/g)].map(x=>x[1])) {
    assert.ok(existsSync(join(dist,href.slice(1),'index.html')),'broken internal href '+href);
  }
}
assert.ok(siteHome.includes('href="/stalhallar/isolerad-hall/"'), 'homepage isolate link not migrated');
console.log('Verified Plåthallar and Isolerade hallar: noindex, canonical, breadcrumbs, H1 and local links.');


// Ridhus and Tälthallar retain their original search URLs as local drafts,
// with distinct editorial content and a tested HTML/no-JS navigation baseline.
for (const item of [
  { slug: 'ridhus', title: 'Ridhus', anchors: ['ridhus-verksamhet', 'ridhus-ridyta', 'ridhus-miljo', 'ridhus-fragor'] },
  { slug: 'talthall', title: 'Tälthallar', anchors: ['talthall-utforande', 'talthall-anvandning', 'talthall-byggplats', 'talthall-fragor'] },
]) {
  const html = readFileSync(join(dist, 'stalhallar', item.slug, 'index.html'), 'utf8');
  assert.ok(html.includes('name="robots" content="noindex,nofollow"'), 'missing noindex: ' + item.slug);
  assert.ok(html.includes('rel="canonical" href="https://hallpartner.se/stalhallar/' + item.slug + '/"'), 'canonical mismatch: ' + item.slug);
  assert.equal((html.match(/<h1(?:\s|>)/gi) ?? []).length, 1, 'H1 count: ' + item.slug);
  assert.equal((html.match(/<header(?:\s|>)/gi) ?? []).length, 1, 'duplicate Header: ' + item.slug);
  assert.equal((html.match(/<nav(?:\s|>)/gi) ?? []).length, 3, 'three navigations expected: ' + item.slug);
  assert.ok(html.includes('aria-label="Brödsmulor"'), 'breadcrumbs missing: ' + item.slug);
  assert.ok(html.includes('href="/stalhallar/"'), 'overview link missing: ' + item.slug);
  assert.ok(html.includes('href="/kontakt/"'), 'contact link missing: ' + item.slug);
  assert.ok(!html.includes('/prototype/hallpartner/'), 'visitor link points at prototype: ' + item.slug);
  assert.ok(!html.includes('AI-genererad konceptbild'), 'prototype claim leaked: ' + item.slug);
  for (const id of item.anchors) assert.ok(html.includes('id="' + id + '"'), 'missing section anchor ' + id);
  for (const href of [...html.matchAll(/\shref="(\/stalhallar\/[^"#?]*\/)"/g)].map(m => m[1])) {
    assert.ok(existsSync(join(dist, href.slice(1), 'index.html')), 'broken native hall link: ' + href);
  }
}
assert.ok(siteHome.includes('href="/stalhallar/ridhus/"'), 'homepage Ridhus card still links to WordPress');
assert.ok(hallOverview.includes('href="/stalhallar/talthall/"'), 'overview Tälthall card still links to WordPress');
console.log('Verified Ridhus and Tälthallar: native noindex routes, canonical, links, 1 H1 and correct landmarks.');


// The historic /kontakt/ route was an Amelio presentation form with mailto
// directed to the web developer. Verify this is now native Hallpartner content
// and that no false backend form or success state can escape into production.
for (const item of [
  {slug:'kontakt',ids:['infor-kontakt','nasta-steg'],has:['info@hallpartner.se','054-820 04 90']},
  {slug:'sa-gar-det-till',ids:['projekt-forberedelser','projekt-ansvar'],has:['Klargör omfattningen','Vem ansvarar för vad?']},
]) {
  const html = readFileSync(join(dist, item.slug, 'index.html'), 'utf8');
  assert.ok(html.includes('name="robots" content="noindex,nofollow"'), 'info route must remain noindex: ' + item.slug);
  assert.ok(html.includes('rel="canonical" href="https://hallpartner.se/' + item.slug + '/"'), 'canonical mismatch: ' + item.slug);
  assert.equal((html.match(/<h1(?:\s|>)/gi) ?? []).length, 1, 'only one H1 on ' + item.slug);
  assert.equal((html.match(/<header(?:\s|>)/gi) ?? []).length, 1, 'only one header on ' + item.slug);
  assert.equal((html.match(/<nav(?:\s|>)/gi) ?? []).length, 3, 'main, breadcrumbs, jump nav required: ' + item.slug);
  assert.ok(html.includes('aria-label="Brödsmulor"'), 'breadcrumbs missing: ' + item.slug);
  assert.ok(!html.includes('/prototype/hallpartner/'), 'prototype link on info route: ' + item.slug);
  assert.ok(!html.includes('andreas@amelio.se'), 'Amelio contact leaked on visitor page');
  assert.ok(!html.includes('tel:+46735054763'), 'developer phone leaked on visitor page');
  assert.ok(!html.includes('<form'), 'unimplemented contact form leaked on ' + item.slug);
  for (const id of item.ids) assert.ok(html.includes('id="' + id + '"'), 'missing anchor: ' + id);
  for (const phrase of item.has) assert.ok(html.includes(phrase), 'missing relevant info: ' + phrase);
  for (const href of [...html.matchAll(/\shref="(\/[^"#?]+\/)"/g)].map(m => m[1])) {
    assert.ok(existsSync(join(dist, href.slice(1), 'index.html')), 'broken native info link: ' + href);
  }
}
assert.ok(siteHome.includes('href="/kontakt/"'), 'home should link to native contact route');
assert.ok(siteHome.includes('href="/sa-gar-det-till/"'), 'main navigation must link to native process route');
console.log('Verified visitor Kontakt and Så går det till: native routes, noindex, no fake form, correct brand and links.');
