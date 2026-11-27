import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const context=vm.createContext({Intl});vm.runInContext(await readFile(new URL('public/pagination.js',import.meta.url),'utf8'),context);
const paginate=context.paginateLetterText;
// Deterministic layout adapter exercises page-boundary behavior independently of the DOM.
function flow(text,{capacity=40,used=0,measure=s=>[...s].length}={}){
 const pages=[''];let usedSpace=used;
 paginate(text,{
  fits:s=>usedSpace+measure(s)<=capacity,
  commit:s=>{pages[pages.length-1]+=s;usedSpace+=measure(s)},
  nextPage:()=>{pages.push('');usedSpace=0},
  isEmpty:()=>usedSpace===0
 });
 return pages;
}
test('overflow adds pages without losing or duplicating text',()=>{
 const input='सह्याद्री प्रतिष्ठान दुर्ग संवर्धन कार्य. '.repeat(100);
 const pages=flow(input);assert(pages.length>2);assert.equal(pages.join(''),input);assert(pages.every(p=>[...p].length<=40));
});
test('a word moves off an already full page',()=>{assert.deepEqual(flow('पुढील',{capacity:20,used:20}),['','पुढील'])});
test('a long unbroken token splits across pages instead of clipping',()=>{
 const input='https://example.test/'+ 'a'.repeat(2000);const pages=flow(input);assert.equal(pages.join(''),input);assert(pages.every(p=>p.length<=40));
});
test('Devanagari grapheme clusters are not split',()=>{
 const input='प्रतिष्ठान'.repeat(100);const pages=flow(input,{capacity:20});assert.equal(pages.join(''),input);
 const boundaries=new Set([0]);let offset=0;for(const {segment}of new Intl.Segmenter('mr',{granularity:'grapheme'}).segment(input)){offset+=segment.length;boundaries.add(offset)}
 offset=0;for(const page of pages){offset+=page.length;assert(boundaries.has(offset))}
});
test('blank paragraphs take space and remain present',()=>{assert.deepEqual(flow(''),['\u00a0']);assert.equal(flow('  \n   ').join(''),'  \n   ')});
test('exactly full page does not create an extra blank page',()=>{assert.deepEqual(flow('x'.repeat(40)),['x'.repeat(40)])});
test('impossible layout fails explicitly instead of looping',()=>{assert.throws(()=>flow('अ',{capacity:0}),/मजकूर/) });
