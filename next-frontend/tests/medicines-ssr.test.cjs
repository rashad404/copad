// Integration check against a running frontend and the real public catalogue.
// CATALOGUE_TEST_ORIGIN=http://localhost:3007 node --test tests/medicines-ssr.test.cjs
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const origin=process.env.CATALOGUE_TEST_ORIGIN;
test('public catalogue delivers indexable HTML, canonical, Drug schema, prices and true 404s',{skip:!origin},async()=>{
 const response=await fetch(`${origin}/dermanlar/ibuprofen`);assert.equal(response.status,200);
 const doc=new JSDOM(await response.text()).window.document;
 assert.equal(doc.title,'İbuprofen - qiymətlər və alternativlər | AzDoc');
 assert.match(doc.querySelector('meta[name=description]').content,/Ibuprofen/);
 assert.match(doc.querySelector('link[rel=canonical]').href,/\/dermanlar\/ibuprofen$/);
 const schema=JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
 assert.equal(schema['@type'],'Drug');assert.equal(schema.name,'İbuprofen');
 doc.querySelectorAll('script').forEach(s=>s.remove());
 assert.equal(doc.querySelector('h1').textContent,'İbuprofen');
 assert.ok(doc.querySelectorAll('tbody tr').length>0);assert.match(doc.body.textContent,/0,35/);
 assert.ok(doc.querySelector('a[href="/dermanlar/ibuprofen-maks"]'));
 const search=new JSDOM(await (await fetch(`${origin}/dermanlar?q=${encodeURIComponent('İbuprofen')}`)).text()).window.document;
 search.querySelectorAll('script').forEach(s=>s.remove());
 assert.equal(search.querySelector('input[name=q]').value,'İbuprofen');
 assert.ok(search.querySelector('a[href="/dermanlar/ibuprofen"]'));
 assert.match(search.querySelector('meta[name=robots]').content,/noindex/);
 assert.equal((await fetch(`${origin}/dermanlar/nonexistent-codex-test`)).status,404);
});
