for(const root of document.querySelectorAll('[data-work-events]')){
 const form=root.querySelector('[data-work-filters]');if(!form)continue;
 const search=form.querySelector('[data-work-search]'),year=form.querySelector('[data-work-year]'),events=[...root.querySelectorAll('[data-work-event]')],status=form.querySelector('[data-work-result]'),empty=root.querySelector('[data-work-empty]');
 const normalize=s=>s.normalize('NFC').toLocaleLowerCase().trim();
 function filter(){const query=normalize(search.value);let count=0;for(const event of events){const show=(!query||normalize(event.dataset.search).includes(query))&&(!year.value||event.dataset.year===year.value);event.hidden=!show;if(show)count++;}status.textContent=`${new Intl.NumberFormat(document.documentElement.lang).format(count)} / ${new Intl.NumberFormat(document.documentElement.lang).format(events.length)}`;empty.hidden=count!==0;}
 form.hidden=false;form.addEventListener('submit',e=>e.preventDefault());search.addEventListener('input',filter);year.addEventListener('change',filter);form.addEventListener('reset',()=>setTimeout(filter,0));filter();
}
