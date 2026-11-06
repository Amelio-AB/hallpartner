import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const page=read('src/pages/om-oss/index.astro');
const css=read('src/styles/hallpartner-info.css');

test('Om Hallpartner beskriver den kundbekräftade totalentreprenaden och avtalets omfattning',()=>{
  assert.match(page, /totalentreprenad/);
  assert.match(page, /driftklar/);
  assert.match(page, /nyckelfärdig/);
  assert.match(page, /underentreprenörer/);
  assert.match(page, /avtalet/);
  assert.ok(!page.includes('garanterat bygglov'));
  assert.ok(!page.includes('allt ingår'));
});

test('människorna bakom och bild-/kontaktlänkarna bevaras',()=>{
  assert.match(page,/hallpartnerPeople\.map/);
  assert.match(page, /id="teamet"/);
  assert.match(page,/href="\/kontakt\/#personer"/);
  assert.match(page,/href="#om-inriktning"/);
});

test('offert är huvudval men telefon och e-post finns kvar',()=>{
  assert.equal(page.split('href="/offert/"').length - 1,2);
  assert.ok(page.includes('href="/kontakt/"'));
  assert.ok(page.includes('href="/sa-gar-det-till/"'));
  assert.match(css,/\.hp-info--about \.hp-info__end-actions/);
});
