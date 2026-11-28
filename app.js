// Preserve links shared before the site was split into pages.
const oldSection=location.hash.slice(1);
if(['about','work','stories','documents','join'].includes(oldSection)&&!document.getElementById(oldSection)){
 const prefix=/^\/(hi|en)(?:\/|$)/.exec(location.pathname)?.[1];
 location.replace(`${prefix?'/'+prefix:''}/${oldSection==='stories'?'work':oldSection}/`);
}
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
const filters=document.querySelector('.filters');if(filters){filters.hidden=false;
filters.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('.story').forEach(story=>{story.hidden=button.dataset.filter!=='0'&&story.dataset.category!==button.dataset.filter;});}));
}
const dialog=document.querySelector('#credits');document.querySelector('[data-credits]').addEventListener('click',()=>dialog.showModal());dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelectorAll('.languages a').forEach(a=>a.addEventListener('click',()=>{if(location.hash)a.hash=location.hash;}));

// Originals are excluded from dist. The reader only receives rendered pages.
const viewer=document.querySelector('.document-viewer');
if(viewer){
 const select=viewer.querySelector('#document-select');
 const zoom=viewer.querySelector('#document-zoom');
 const stage=viewer.querySelector('.document-stage');
 const previous=viewer.querySelector('[data-document-prev]');
 const next=viewer.querySelector('[data-document-next]');
 const status=viewer.querySelector('[data-document-status]');
 const records=[...viewer.querySelectorAll('.document-record')];
 let page=0;
 const selected=()=>records.find(r=>r.dataset.document===select.value);
 function render(){
  records.forEach(record=>{
   const active=record===selected();record.hidden=!active;record.open=active;
   record.querySelectorAll('.document-page').forEach((figure,i)=>figure.hidden=!active||i!==page);
  });
  const total=selected().querySelectorAll('.document-page').length;
  status.textContent=`${viewer.dataset.pageLabel} ${page+1} / ${total}`;
  previous.disabled=page===0;next.disabled=page===total-1;
  stage.scrollTop=0;stage.scrollLeft=0;
 }
 select.addEventListener('change',()=>{page=0;zoom.value='100';stage.style.setProperty('--document-zoom','100%');render();});
 previous.addEventListener('click',()=>{if(page>0){page--;render();}});
 next.addEventListener('click',()=>{if(page<selected().querySelectorAll('.document-page').length-1){page++;render();}});
 zoom.addEventListener('change',()=>stage.style.setProperty('--document-zoom',`${zoom.value}%`));
 viewer.classList.add('enhanced');viewer.querySelector('.document-controls').hidden=false;render();
}

// Mobile paths use ordinary anchors so direct links and browser Back still work.
const joinChoices=document.querySelector('.registration-choices');
if(joinChoices){
 const syncJoinPath=()=>{
  const path=location.hash==='#registration'?'new':location.hash==='#id-card'?'id':'';
  document.body.dataset.joinPath=path;
  joinChoices.querySelectorAll('[data-join-choice]').forEach(link=>{
   if(link.dataset.joinChoice===path)link.setAttribute('aria-current','true');
   else link.removeAttribute('aria-current');
  });
 };
 syncJoinPath();
 window.addEventListener('hashchange',syncJoinPath);
 // Reveal the destination before native anchor scrolling runs.
 document.querySelectorAll('a[href="#registration"],a[href="#id-card"]').forEach(link=>link.addEventListener('click',()=>{
  document.body.dataset.joinPath=link.hash==='#id-card'?'id':'new';
 }));
}
