/** Validate the actual visitor build, not retired presentation routes. */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from './preview/policy.mjs';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const list = (prefix = '') => readdirSync(join(dist, prefix), { withFileTypes:true }).flatMap(entry => entry.isDirectory() ? list(prefix + entry.name + '/') : [prefix + entry.name]);
const built = list();
assert.deepEqual(built.filter(path => path.endsWith('.html')).sort(), [...PAGES].sort(), 'Unexpected or missing HTML route');
const pages = new Map(PAGES.map(path => [path, readFileSync(join(dist, path), 'utf8')]));
const ids = new Map([...pages].map(([path,html]) => [path, [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1])]));
const ampFooter = process.env.HALLPARTNER_FOOTER_MODE !== 'legacy';
const origin = 'https://hallpartner.se';
const routeFor = path => path === 'index.html' ? '/' : '/' + path.replace(/\/index\.html$/, '/');
const expectedAnchors = {
  'index.html':['halltyper','att-tanka-pa'],
  'stalhallar/index.html':['anvandningsomraden','utforanden','infor-projektet','vanliga-fragor'],
  'stalhallar/lagerhall/index.html':['lagerbehov','varuflode','lagerutforande','lagerfragor'],
  'stalhallar/maskinhall/index.html':['maskinernas-behov','korvagar','arbetsytan','maskinhall-fragor'],
  'stalhallar/plathall/index.html':['plathall-begrepp','plathall-val','plathall-anvandning','plathall-fragor'],
  'stalhallar/isolerad-hall/index.html':['isolering-behov','isolering-samspel','isolering-anvandning','isolering-fragor'],
  'stalhallar/ridhus/index.html':['ridhus-verksamhet','ridhus-ridyta','ridhus-miljo','ridhus-fragor'],
  'stalhallar/talthall/index.html':['talthall-utforande','talthall-anvandning','talthall-byggplats','talthall-fragor'],
  'kontakt/index.html':['infor-kontakt','nasta-steg'],
  'sa-gar-det-till/index.html':['projekt-forberedelser','projekt-ansvar'],
  'om-oss/index.html':['teamet','om-inriktning','om-kontakt'],
};
const descriptions = new Set();
for (const [path,html] of pages) {
  assert.match(html, /<meta\s+name="robots"\s+content="noindex,nofollow"/, path);
  for (const tag of ['h1','header','footer','main']) assert.equal((html.match(new RegExp('<'+tag+'(?:\\s|>)','gi')) || []).length,1,path+': '+tag);
  assert.ok(html.includes('id="main-content"') && html.includes('href="#main-content"'), path+': skip link');
  assert.ok(html.includes('id="hp-amp-header-target"') && html.includes('id="hp-amp-header-fallback"'), path+': AMP header target/fallback');
  assert.ok(html.includes('aria-label="Huvudnavigation"'), path+': no-JS navigation');
  assert.equal(new Set(ids.get(path)).size, ids.get(path).length, path+': duplicate ids');
  for (const id of expectedAnchors[path] || []) assert.ok(ids.get(path).includes(id),path+': missing '+id);
  if (path === '404.html') assert.doesNotMatch(html, /rel="canonical"/);
  else assert.ok(html.includes('rel="canonical" href="'+origin+routeFor(path)+'"'),path+': canonical');
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1];
  assert.ok(description && !descriptions.has(description),path+': missing/duplicate description');
  descriptions.add(description);
  assert.doesNotMatch(html, /(?:href|src)="\/(?:prototype|demo|vision|projekt|roadmap|workshop)(?:\/|")/,path);
  assert.doesNotMatch(html, /andreas@amelio\.se|tel:\+46735054763/,path);
  if (ampFooter) {
    assert.ok(html.includes('class="af af--compact"'),path+': approved Footer missing');
    assert.ok(html.includes('href="/generated/amp-003-footer.css"'),path+': Footer CSS missing');
    assert.ok(html.includes('class="af__mobile-groups"'),path+': Footer disclosure missing');
    assert.ok(!html.includes('class="hp-draft-footer"'),path+': duplicate old Footer');
  } else {
    assert.ok(html.includes('class="hp-draft-footer"'),path+': rollback missing');
    assert.ok(!html.includes('class="af af--compact"'),path+': unexpected AMP Footer');
  }
  for (const [,rawHref] of html.matchAll(/\shref="([^"]*)"/g)) {
    if (!rawHref.startsWith('/') && !rawHref.startsWith('#')) continue;
    assert.notEqual(rawHref,'#',path+': empty link');
    const target = new URL(rawHref,origin+routeFor(path));
    assert.equal(target.origin,origin,path+': unexpected protocol-relative URL');
    const targetFile = target.pathname === '/' ? 'index.html' : decodeURIComponent(target.pathname.slice(1)) + (target.pathname.endsWith('/') ? 'index.html' : '');
    assert.ok(existsSync(join(dist,targetFile)),path+': broken local link '+rawHref);
    if (target.hash && pages.has(targetFile)) assert.ok(ids.get(targetFile).includes(decodeURIComponent(target.hash.slice(1))),path+': missing anchor '+rawHref);
  }
  for (const [,heading] of html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)) assert.doesNotMatch(heading.replace(/<[^>]*>/g,''), /^\s*0[1-9]\b/,path+': decorative heading number');
}
const home = pages.get('index.html');
assert.ok(home.includes('En hall börjar med ditt behov.'));
assert.ok(home.includes('src="/images/logo_text_white.png"') && home.includes('alt="Hallpartner – Hallar till alla"'));
assert.ok((home.match(/<img(?:\s|>)/g) || []).length >= 4);
for (const phrase of ['Visuell arbetsversion','För intern granskning','Intern arbetsprototyp','Ursprungligt fulltextutkast saknas','digital analys och vision']) assert.ok(!home.includes(phrase),phrase);
const hero = readFileSync(join(dist,'images/hallpartner-hero-temporary.webp'));
assert.ok(hero.length>1000 && hero.length<350000);
assert.equal(hero.toString('ascii',0,4),'RIFF'); assert.equal(hero.toString('ascii',8,12),'WEBP');
for (const slug of ['lagerhall','maskinhall','plathall','isolerad-hall','ridhus','talthall']) {
  const html=pages.get('stalhallar/'+slug+'/index.html');
  assert.ok(html.includes('aria-label="Brödsmulor"') && html.includes('aria-label="På den här sidan"'),slug);
  assert.ok(pages.get('stalhallar/index.html').includes('href="/stalhallar/'+slug+'/"'),slug);
}
const contact=pages.get('kontakt/index.html');
assert.ok(contact.includes('id="hp-contact-form"') && contact.includes('data-enabled="false"'));
assert.ok(contact.includes('info@hallpartner.se') && contact.includes('054-820 04 90'));
const offer=pages.get('offert/index.html');
assert.ok(offer.includes('id="hp-offert-guide"') && offer.includes('data-enabled="false"'));
for (const name of ['Jimmy Gustafsson','Peter Fridland']) assert.ok(pages.get('om-oss/index.html').includes(name));
assert.ok(pages.get('404.html').includes('Sidan kunde inte hittas | Hallpartner'));
const sitemapFiles=built.filter(path=>/^sitemap.*\.xml$/.test(path));
assert.ok(sitemapFiles.length>0);
for (const path of sitemapFiles) {
  const xml=readFileSync(join(dist,path),'utf8');
  for (const route of ['/prototype/','/demo/','/vision/','/projekt/','/roadmap/','/workshop/','/404.html','/404/','/offert/']) assert.ok(!xml.includes(route),path+': '+route);
}
console.log('Verified thirteen visitor pages: no retired routes, valid links/anchors, metadata, shared Header/Footer and inactive intake.');
