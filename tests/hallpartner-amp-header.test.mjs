import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ampHeaderItems, ampHeaderBrand, ampHeaderCTA, ampHeaderTheme, ampReviewVariants } from '../src/config/hallpartner-amp-header.ts';
import { validateHeaderConfig, resolveHeaderTheme } from '@amelio/web-platform/header-menu';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=(p)=>readFileSync(join(root,p),'utf8');

test('approved AMP-002 public contract accepts Hallpartner data',()=>{
  for (const variant of ampReviewVariants) {
    assert.ok(['classic-dropdown','classic-mega-menu'].includes(variant));
    assert.doesNotThrow(()=>validateHeaderConfig({variant,items:[...ampHeaderItems],brand:ampHeaderBrand,cta:ampHeaderCTA,theme:ampHeaderTheme}));
  }
  assert.equal(resolveHeaderTheme(ampHeaderTheme).corrections.length,0,'theme must not need contrast fixes');
  assert.equal(ampHeaderBrand.logoSrc,'/images/logo_text_white.png');
});
test('all AMP header links lead to real visitor routes',()=>{
  const links=ampHeaderItems.flatMap(item=>[
    ...(item.href?[item.href]:[]),
    ...((item.groups||[]).flatMap(group=>group.links.map(l=>l.href))),
    ...(item.featured?[item.featured.href]:[])
  ]).concat(ampHeaderCTA.href);
  for(const href of links){
    assert.ok(href.startsWith('/')&&href.endsWith('/'));
    assert.ok(existsSync(join(root,'src/pages',href==='/'?'index.astro':join(href.slice(1),'index.astro'))),'missing '+href);
  }
});
test('AMP header review does not replace existing visitor shell',()=>{
  const home=read('src/pages/index.astro');
  const shell=read('src/layouts/HallpartnerDraftLayout.astro');
  const review=read('src/components/prototype/HallpartnerAmpHeaderReview.astro');
  assert.ok(!home.includes('HallpartnerAmpHeaderReview'));
  assert.ok(!shell.includes('hp-amp-header-target'));
  assert.ok(shell.includes('<header class="hp-draft-header">'));
  assert.ok(review.includes('mountHeaderMenu(mountTarget'));
  assert.ok(review.includes('fallback.hidden = true'));
  assert.ok(review.includes('id="hp-amp-header-fallback"'));
  assert.ok(review.includes('name="robots" content="noindex,nofollow"'));
  assert.ok(review.includes("renderFooter({ ...hallpartnerFooterConfig, variant: 'compact' })"));
  assert.ok(review.includes('<HallpartnerHomePrototype variant="site" />'));
});
test('three noindex review views stay outside sitemap',()=>{
  for (const p of ['src/pages/prototype/amp/header/index.astro','src/pages/prototype/amp/header/mega/index.astro','src/pages/prototype/amp/header/solid/index.astro'])
    assert.ok(existsSync(join(root,p)));
  assert.match(read('astro.config.mjs'),/pathname\.startsWith\('\/prototype\/'\)/);
});
