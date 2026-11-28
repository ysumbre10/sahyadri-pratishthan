for(const root of document.querySelectorAll('[data-work-events]')){
 const form=root.querySelector('[data-work-filters]');if(!form)continue;
 const search=form.querySelector('[data-work-search]'),year=form.querySelector('[data-work-year]'),events=[...root.querySelectorAll('[data-work-event]')],status=form.querySelector('[data-work-result]'),empty=root.querySelector('[data-work-empty]');
 const lang=document.documentElement.lang,number=new Intl.NumberFormat(lang),pageSize=12;
 const labels={mr:['मागील','पुढील','मोहिमांची पाने'],hi:['पिछला','अगला','अभियान के पृष्ठ'],en:['Previous','Next','Event pages']}[lang]||['Previous','Next','Event pages'];
 const pagination=document.createElement('nav');pagination.className='work-pagination';pagination.setAttribute('aria-label',labels[2]);
 const previous=document.createElement('button'),next=document.createElement('button'),pageStatus=document.createElement('span');
 previous.type=next.type='button';previous.textContent=labels[0];next.textContent=labels[1];pageStatus.setAttribute('aria-live','polite');
 pagination.append(previous,pageStatus,next);root.append(pagination);
 const normalize=s=>s.normalize('NFC').toLocaleLowerCase().trim();let page=1;
 function filter(reset=true){
  if(reset)page=1;
  const query=normalize(search.value),matches=events.filter(event=>(!query||normalize(event.dataset.search).includes(query))&&(!year.value||event.dataset.year===year.value));
  const pages=Math.max(1,Math.ceil(matches.length/pageSize));page=Math.min(page,pages);
  const visible=new Set(matches.slice((page-1)*pageSize,page*pageSize));
  for(const event of events){event.hidden=!visible.has(event);if(!event.hidden)for(const img of event.querySelectorAll('img[data-work-src]')){img.src=img.dataset.workSrc;img.removeAttribute('data-work-src');}}
  status.textContent=`${number.format(matches.length)} / ${number.format(events.length)}`;empty.hidden=matches.length!==0;
  pagination.hidden=pages<=1;previous.disabled=page===1;next.disabled=page===pages;pageStatus.textContent=`${number.format(page)} / ${number.format(pages)}`;
 }
 function turn(delta){page+=delta;filter(false);form.scrollIntoView({block:'start'});search.focus({preventScroll:true});}
 previous.addEventListener('click',()=>turn(-1));next.addEventListener('click',()=>turn(1));
 form.hidden=false;form.addEventListener('submit',e=>e.preventDefault());search.addEventListener('input',()=>filter());year.addEventListener('change',()=>filter());form.addEventListener('reset',()=>setTimeout(()=>filter(),0));
 // Preserve links to individual archive accounts, including events beyond page one.
 function revealHash(){const target=events.find(event=>'#'+event.id===location.hash);if(target){search.value='';year.value='';page=Math.floor(events.indexOf(target)/pageSize)+1;filter(false);target.scrollIntoView({block:'start'});}}
 filter();revealHash();window.addEventListener('hashchange',revealHash);
}
