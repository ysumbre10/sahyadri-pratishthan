import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../id-card.js',import.meta.url),'utf8');
const member={number:'5001',name:'Test Member',dob:'1995-04-23',phone:'+919876543210',blood:'O+'};
function setup(result={ok:true,member}){
 const nodes=new Map(),events={},texts=[],downloads=[],revoked=[],requests=[];let pending;
 const context={save(){},restore(){},clearRect(){},drawImage(){},beginPath(){},roundRect(){},clip(){},strokeText(){},fillText(v){texts.push(v);},measureText(v){return {width:v.length*20};}};
 const get=id=>{if(!nodes.has(id))nodes.set(id,{value:'',files:[],disabled:false,addEventListener(type,fn){this[type==='reset'?'resetEvent':type]=fn;},focus(){},reportValidity(){return true;},reset(){this.resetEvent?.();},getContext(){return context;},toBlob(fn){fn({type:'image/png'});}});return nodes.get(id);};
 const form=get('id-form'),lookup=get('member-lookup');const l={searching:'searching',found:'found',unavailable:'unavailable',review:'review',invalid:'lookup-invalid',not_found:'not_found'};
 get('id-messages').textContent=JSON.stringify({lookup:l,endpoint:'https://script.google.com/macros/s/test/exec',ready:'ready',invalid:'invalid',done:'done',photoRequired:'photoRequired',error:'error',failure:'failure'});
 get('id-zoom').value=1;get('id-x').value=get('id-y').value=50;get('id-download').disabled=true;get('id-photo').disabled=true;get('lookup-phone').value='9876543210';get('lookup-dob').value='1995-04-23';
 const sandbox={document:{getElementById:get,fonts:{load:async()=>[]},createElement(tag){return tag==='a'?{click(){downloads.push(this.download);}}:{getContext(){return context;}};}},Image:class{naturalWidth=800;naturalHeight=1000;decode(){return Promise.resolve();}},URL:{createObjectURL(){return 'blob:local';},revokeObjectURL(url){revoked.push(url);}},window:{addEventListener(type,fn){events[type]=fn;}},Date,Promise,AbortController,fetch:async(url,opts)=>{requests.push({url,opts});if(result==='pending')return new Promise(resolve=>pending=resolve);return {ok:true,json:async()=>result};},setTimeout(fn,delay){if(delay<2000)fn();return 1;},clearTimeout(){}};
 vm.runInNewContext(source,sandbox);return {get,form,lookup,events,texts,downloads,revoked,requests,resolve:()=>pending({ok:true,json:async()=>({ok:true,member})})};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));const event={preventDefault(){}};
test('lookup is required; fetched details are used; photos never enter network payload',async()=>{
 const s=setup();await settle();assert.equal(s.get('id-download').disabled,true);
 await s.form.submit(event);assert.equal(s.downloads.length,0);
 await s.lookup.submit(event);assert.equal(s.get('id-name').value,'Test Member');assert.equal(s.get('id-photo').disabled,false);assert.equal(s.get('id-download').disabled,true);
 s.get('id-name').value='Changed in DOM';s.form.input();assert(s.texts.includes('www.sahyadripratishthan.com'));assert(!s.texts.includes('Changed in DOM'));
 s.get('id-photo').files=[{type:'image/svg+xml',size:10}];await s.get('id-photo').change();assert.equal(s.get('id-status').textContent,'invalid');
 s.get('id-photo').files=[{type:'image/png',size:11*1024*1024}];await s.get('id-photo').change();assert.equal(s.get('id-status').textContent,'invalid');
 s.get('id-photo').files=[{type:'image/jpeg',size:100}];await s.get('id-photo').change();assert.equal(s.get('id-crop').disabled,false);assert(s.texts.includes('23.04.1995'));assert(s.texts.includes('सभासद क्रमांक : 5001'));
 await s.form.submit(event);assert.deepEqual(s.downloads,['Sahyadri-Pratishthan-ID.png']);assert.equal(s.get('id-status').textContent,'done');
 assert.equal(s.requests.length,1);assert.deepEqual(JSON.parse(s.requests[0].opts.body),{phone:'9876543210',dob:'1995-04-23'});assert.equal(s.requests[0].opts.method,'POST');
 s.form.resetEvent();assert.equal(s.get('id-photo').disabled,true);assert.equal(s.get('id-download').disabled,true);
});
test('review and stale lookup results cannot enable downloads',async()=>{const blocked=setup({ok:false,code:'review'});await settle();await blocked.lookup.submit(event);assert.equal(blocked.get('lookup-status').textContent,'review');assert.equal(blocked.get('id-photo').disabled,true);const s=setup('pending');await settle();const request=s.lookup.submit(event);await settle();s.lookup.input();s.resolve();await request;assert.equal(s.get('id-photo').disabled,true);assert.equal(s.get('id-download').disabled,true);});
test('generator contains no persistent storage or photo upload path',()=>{assert(!/\b(XMLHttpRequest|localStorage|sessionStorage|indexedDB|sendBeacon|FormData)\b/.test(source));assert.equal((source.match(/\bfetch\(/g)||[]).length,1);});
