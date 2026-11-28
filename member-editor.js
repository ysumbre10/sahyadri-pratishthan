(()=>{
 const root=document.getElementById('member-editor');if(!root)return;
 const {text:t,fields}=JSON.parse(document.getElementById('member-edit-messages').textContent),endpoint=JSON.parse(document.getElementById('id-messages').textContent).endpoint;
 const el=id=>document.getElementById('member-'+id),input=k=>document.getElementById('profile-'+k),form=el('profile-form');
 let token='',challenge='',newChallenge='',original=null,contact='',version=0,busy=false,controller=null,pending=null;
 const message=s=>el('edit-status').textContent=s;
 function clear(){version++;controller?.abort();token=challenge=newChallenge='';original=pending=null;contact='';root.hidden=true;el('send-code').hidden=false;form.reset();el('code-form').reset();form.hidden=el('code-form').hidden=el('review').hidden=true;message('');busy=false;root.querySelectorAll('button,input,select').forEach(b=>b.disabled=false);}
 const api=window.memberEditor={clear,found(c){clear();contact=c;root.hidden=false;},onSaved:null};
 const display=(key,value)=>key==='dob'&&/^\d{4}-\d{2}-\d{2}$/.test(value)?new Intl.DateTimeFormat(document.documentElement.lang,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T00:00:00Z')):value||'—';
 const error=r=>(t.errors[r.code]||t.errors.unavailable)+(r.next?' '+new Intl.DateTimeFormat(document.documentElement.lang,{dateStyle:'long'}).format(new Date(r.next)):'');
 async function request(action,data,done){if(busy)return;busy=true;const v=version;controller=new AbortController();const timer=setTimeout(()=>controller.abort(),30000);root.querySelectorAll('button,input,select').forEach(b=>b.disabled=true);message(t.waiting);
 try{const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({action,...data}),credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal});if(!res.ok)throw Error();const r=await res.json();if(v!==version)return;if(!r.ok){message(error(r));return;}done(r);}catch{if(v===version)message(t.errors.unavailable);}finally{clearTimeout(timer);if(v===version){busy=false;root.querySelectorAll('button,input,select').forEach(b=>b.disabled=false);}}}
 el('send-code').addEventListener('click',()=>request('requestCode',{contact},r=>{challenge=r.challenge;el('code-form').hidden=false;message(t.sent);el('code').focus();}));
 el('code-form').addEventListener('submit',e=>{e.preventDefault();if(!el('code-form').reportValidity())return;request('verifyCode',{challenge,code:el('code').value},r=>{token=r.token;original=r.profile;for(const f of fields)input(f.key).value=original[f.key]||'';input('dob').max=new Date().toLocaleDateString('en-CA');form.hidden=false;el('code-form').hidden=true;message('');input('first').focus();});});
 el('new-email').addEventListener('click',()=>{if(!input('email').reportValidity())return;request('requestNewEmailCode',{token,email:input('email').value},r=>{newChallenge=r.challenge;message(t.sent);el('new-code').focus();});});
 el('verify-new').addEventListener('click',()=>request('verifyCode',{token,challenge:newChallenge,code:el('new-code').value},()=>message(t.verify+' ✓')));
 form.addEventListener('input',e=>{pending=null;el('review').hidden=true;if(['first','middle','last'].some(k=>input(k)===e.target))input('name').value=['first','middle','last'].map(k=>input(k).value.trim()).filter(Boolean).join(' ');});
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity()||!original)return;const p=Object.fromEntries(fields.map(f=>[f.key,input(f.key).value.trim()])),changed=fields.filter(f=>p[f.key]!==original[f.key]);if(!changed.length){message(t.errors.no_changes);return;}
 el('changes').replaceChildren();for(const f of changed){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=f.label;dd.textContent=`${t.old}: ${display(f.key,original[f.key])} → ${t.new}: ${display(f.key,p[f.key])}`;el('changes').append(dt,dd);}pending=p;el('review').hidden=false;el('confirm').focus();message('');});
 el('cancel').addEventListener('click',()=>{pending=null;el('review').hidden=true;});
 el('confirm').addEventListener('click',()=>{if(!pending)return;request('saveProfile',{token,profile:pending},r=>{api.onSaved?.(r.member);token='';form.hidden=true;el('send-code').hidden=true;message(t.saved+' '+t.errors.year_limit+' '+new Intl.DateTimeFormat(document.documentElement.lang,{dateStyle:'long'}).format(new Date(r.next)));});});
 window.addEventListener('pagehide',clear);
})();
