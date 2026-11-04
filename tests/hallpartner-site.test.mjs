import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hallpartnerPalette, hallpartnerActionText, hallpartnerPaletteTrial } from '../src/config/hallpartner-brand.ts';
import { PAGES } from '../scripts/preview/policy.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const walk = (dir, prefix = '') => readdirSync(join(root, dir, prefix), { withFileTypes:true }).flatMap(entry => entry.isDirectory() ? walk(dir, prefix + entry.name + '/') : [prefix + entry.name]);
const stylesheet = read('src/styles/hallpartner-draft.css');
const home = read('src/components/home/HallpartnerHome.astro');
const layout = read('src/layouts/HallpartnerSiteLayout.astro');
const hallDetails = [
  ['lagerhall', 'Lagerhallar', ['lagerbehov','varuflode','lagerutforande','lagerfragor']],
  ['maskinhall', 'Maskinhallar', ['maskinernas-behov','korvagar','arbetsytan','maskinhall-fragor']],
  ['plathall', 'Plåthallar', ['plathall-begrepp','plathall-val','plathall-anvandning','plathall-fragor']],
  ['isolerad-hall', 'Isolerade hallar', ['isolering-behov','isolering-samspel','isolering-anvandning','isolering-fragor']],
  ['ridhus', 'Ridhus', ['ridhus-verksamhet','ridhus-ridyta','ridhus-miljo','ridhus-fragor']],
  ['talthall', 'Tälthallar', ['talthall-utforande','talthall-anvandning','talthall-byggplats','talthall-fragor']],
];

test('only the thirteen intended visitor pages can become Astro routes', () => {
  const actual = walk('src/pages').filter(path => path.endsWith('.astro')).sort();
  assert.deepEqual(actual, PAGES.map(path => path.replace(/\.html$/, '.astro')).sort());
  for (const path of actual) {
    const page = read('src/pages/' + path);
    assert.match(page, /HallpartnerSiteLayout/);
    assert.doesNotMatch(page, /components\/prototype|href=["']\/prototype\//);
  }
  for (const path of ['src/pages/prototype','src/pages/demo','src/pages/projekt','src/pages/roadmap','src/pages/vision','src/pages/workshop','src/components/prototype']) assert.equal(existsSync(join(root,path)),false,path);
});
test('the accepted home composition is now a site component with native links', () => {
  assert.match(read('src/pages/index.astro'), /components\/home\/HallpartnerHome\.astro/);
  assert.doesNotMatch(home, /variant|isSite|\/prototype\/|Intern arbetsprototyp/);
  assert.match(home, /En hall börjar med ditt behov\./);
  assert.match(home, /src="\/images\/hallpartner-hero-temporary\.webp"/);
  assert.match(home, /data-hero-tone="dark"/);
  assert.match(home, /fetchpriority="high"/);
  for (const id of ['halltyper','att-tanka-pa']) assert.ok(home.includes('id="' + id + '"'));
  for (const slug of ['lagerhall','maskinhall','ridhus','isolerad-hall']) assert.ok(home.includes('/stalhallar/' + slug + '/'));
  assert.match(home, /widths=\{\[320, 480, 768, 1000\]\}/);
  assert.doesNotMatch(home, /hp-home-(?:number|step|index|badge)/);
});
test('site shell retains noindex, canonical identity, skip link and disabled launch scope', () => {
  assert.match(layout, /name="robots" content="noindex,nofollow"/);
  assert.match(layout, /href="#main-content"/);
  assert.match(layout, /tabindex="-1"/);
  assert.match(layout, /!omitCanonical && Astro\.site/);
  assert.match(layout, /new URL\(Astro\.url\.pathname, Astro\.site\)/);
  assert.doesNotMatch(layout, /HallpartnerDraftLayout|Intern arbetsprototyp|Visuell arbetsversion/);
  assert.match(read('astro.config.mjs'), /pathname\.startsWith\('\/prototype\/'\)/);
});
test('existing color roles and their contrast constraints are preserved', () => {
  for (const [role,hex] of Object.entries({graphite:hallpartnerPalette.graphite,deep:hallpartnerPalette.deepGraphite,offwhite:hallpartnerPalette.offWhite,concrete:hallpartnerPalette.concrete,green:hallpartnerPalette.green,cta:hallpartnerPalette.ctaGreen,'cta-hover':hallpartnerPalette.ctaHover,'text-light':hallpartnerPalette.lightText,'action-text':hallpartnerActionText})) assert.ok(stylesheet.includes(`--hp-${role}: ${hex};`));
  const siteColors = stylesheet.match(/\.hp-site\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  for (const [role,hex] of Object.entries({graphite:hallpartnerPaletteTrial.graphite,deep:hallpartnerPaletteTrial.deepGraphite,green:hallpartnerPaletteTrial.green,cta:hallpartnerPaletteTrial.ctaGreen,'cta-hover':hallpartnerPaletteTrial.ctaHover,'link-on-light':hallpartnerPaletteTrial.linkOnLight})) assert.ok(siteColors.includes(`--hp-${role}: ${hex};`));
  const luminance = hex => [1,3,5].map(offset => parseInt(hex.slice(offset,offset+2),16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4).reduce((sum,v,i) => sum + v*[.2126,.7152,.0722][i],0);
  const contrast = (a,b) => { const [dark,light]=[luminance(a),luminance(b)].sort((x,y)=>x-y); return (light+.05)/(dark+.05); };
  for (const [a,b] of [['#FFFFFF',hallpartnerPaletteTrial.ctaGreen],['#FFFFFF',hallpartnerPaletteTrial.ctaHover],[hallpartnerPaletteTrial.linkOnLight,hallpartnerPaletteTrial.concrete],[hallpartnerPaletteTrial.linkOnLight,hallpartnerPaletteTrial.offWhite],[hallpartnerPaletteTrial.green,hallpartnerPaletteTrial.deepGraphite]]) assert.ok(contrast(a,b)>=4.5,`${a}/${b}`);
  const css = read('src/styles/hallpartner-home.css');
  assert.match(css, /\.hp-site \.hp-home-hero__overlay\s*\{/);
  assert.match(css, /rgba\(7,26,22,\.94\)/);
});
test('the existing transparent logo retains its original bytes contract', () => {
  const png=readFileSync(join(root,'public/images/logo_text_white.png'));
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16),1536); assert.equal(png.readUInt32BE(20),274); assert.equal(png[25],6);
  const header=read('src/components/SiteHeader.astro');
  assert.match(header,/alt="Hallpartner – Hallar till alla"/);
  assert.match(header,/width="1536" height="274"/);
});
for (const [slug,title,anchors] of hallDetails) test('distinct visitor hall content and section anchors: '+slug, () => {
  const page=read('src/pages/stalhallar/'+slug+'/index.astro');
  assert.ok(page.includes(title)); assert.equal((page.match(/<h1(?:\s|>)/g)||[]).length,1);
  for (const id of anchors) assert.ok(page.includes('id="'+id+'"'),id);
  assert.match(page,/href="\/stalhallar\/"/);
  assert.doesNotMatch(page,/egna montörer|leveransgaranti|nordens bästa|garanterad leverans|tälthallar (?:är|blir) bygglovsfria|standardgaranti|frånpris:/i);
  if(slug==='talthall') {
    assert.ok(page.includes('Är en tälthall alltid bygglovsfri?'));
    assert.ok(page.includes('Nej, det kan inte förutsättas.'));
  }
});
test('overview keeps every hall destination and the approved image-card integration', () => {
  const page=read('src/pages/stalhallar/index.astro');
  for (const [slug] of hallDetails) assert.ok(page.includes('/stalhallar/'+slug+'/'));
  for (const id of ['anvandningsomraden','utforanden','infor-projektet','vanliga-fragor']) assert.ok(page.includes('id="'+id+'"'));
  assert.match(page,/ExpandableImageCards/);
  assert.ok(existsSync(join(root,'src/components/ImageGallery.astro')));
});
test('contact guard stays in its component and cannot report false success', () => {
  const contact=read('src/pages/kontakt/index.astro');
  const component=read('src/components/ContactForm.astro');
  assert.match(contact,/ContactForm/);
  assert.match(component,/PUBLIC_HP_LEADS_ENABLED === 'true'/);
  assert.match(component,/type="submit" disabled/);
  assert.match(component,/response.status === 200 && body\?\.status === 'success'/);
  assert.match(component,/response.status === 503 && body\?\.status === 'failed'/);
  assert.ok(component.includes('role="status"'));
  assert.ok(contact.includes("href={'mailto:' + contactEmail}"));
});
test('visitor pages introduce neither developer contacts nor calculator or fabricated reference routes', () => {
  for (const path of ['src/pages/kontakt/index.astro','src/pages/offert/index.astro']) assert.doesNotMatch(read(path),/andreas@amelio\.se|tel:\+46735054763/);
  for (const path of ['src/pages/rakna-pris','src/pages/referenser']) assert.equal(existsSync(join(root,path)),false);
  const about=read('src/pages/om-oss/index.astro');
  for (const name of ['Jimmy Gustafsson','Peter Fridland']) assert.ok(about.includes(name));
  assert.doesNotMatch(about,/egna montörer|20 års erfarenhet|lång erfarenhet|ansvarar för våra montage|levererar över hela Norden|garanti på arbete|kostnadsfri offert|hallprojekt i\s+\d{4}/i);
  assert.doesNotMatch(about,/<img(?:\s|>)|<Image(?:\s|>)/i);
});
