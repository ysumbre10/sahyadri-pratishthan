import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../work-categories.js',import.meta.url),'utf8');
function setup(hash=''){
 const make=()=>({hidden:false,value:'',children:[],handlers:{},setAttribute(){},append(...nodes){this.children.push(...nodes);},addEventListener(n,f){this.handlers[n]=f;},scrollIntoView(){},focus(){}});
 const search=make(),year=make(),status=make(),empty=make(),form=make(),root=make(),window=make();form.querySelector=s=>({'[data-work-search]':search,'[data-work-year]':year,'[data-work-result]':status}[s]);
 const events=Array.from({length:30},(_,i)=>{const e=make(),img={dataset:{workSrc:`image-${i}.webp`},removeAttribute(){}};e.id=`event-${i}`;e.dataset={search:i===20?'भोरगिरी':'fort',year:i<15?'2025':'2024'};e.querySelectorAll=()=>[img];e.img=img;return e;});root.querySelector=s=>s==='[data-work-filters]'?form:empty;root.querySelectorAll=()=>events;
 vm.runInNewContext(source,{document:{documentElement:{lang:'en'},querySelectorAll:()=>[root],createElement:make},window,location:{hash},Intl,setTimeout:f=>f()});
 return {root,events,search,year,form};
}
test('pagination loads only visible images, filters original Marathi captions, and resets to page one',()=>{const s=setup();assert.equal(s.events.filter(e=>!e.hidden).length,12);assert.equal(s.events[12].img.src,undefined);s.root.children[0].children[2].handlers.click();assert.equal(s.events[12].hidden,false);assert.equal(s.events[12].img.src,'image-12.webp');s.search.value='भोरगिरी';s.search.handlers.input();assert.deepEqual(s.events.filter(e=>!e.hidden).map(e=>e.id),['event-20']);s.search.value='';s.year.value='2024';s.year.handlers.change();assert.equal(s.events[15].hidden,false);assert.equal(s.events[14].hidden,true);});
test('a deep link reveals its page and loads the target photograph',()=>{const s=setup('#event-27');assert.equal(s.events[27].hidden,false);assert.equal(s.events[27].img.src,'image-27.webp');assert.equal(s.events[0].hidden,true);});
