/* All member data is memory-only. Never upload photos or persist form data. */
(()=>{
 const form=document.getElementById('id-form');if(!form)return;
 const t=JSON.parse(document.getElementById('id-messages').textContent);
 const el=id=>document.getElementById(`id-${id}`),canvas=el('canvas'),ctx=canvas.getContext('2d');
 const status=message=>{el('status').textContent=message;};
 let photo=null,ready=false,generation=0,exporting=false,member=null,lookupVersion=0,lookupController=null;
 const lookupForm=document.getElementById('member-lookup'),lookupStatus=document.getElementById('lookup-status');
 const template=new Image();
 const today=new Date();el('dob').max=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
 function text(value,x,y,max,size=43,align='left'){
  ctx.save();ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.lineJoin='round';
  do{ctx.font=`700 ${size}px "Noto Serif Devanagari", serif`;if(ctx.measureText(value).width<=max)break;size--;}while(size>16);
  ctx.strokeStyle='#ffce7c';ctx.lineWidth=4;ctx.strokeText(value,x,y);ctx.fillStyle='#351808';ctx.fillText(value,x,y);ctx.restore();
 }
 function render(){
  if(!ready)return;ctx.clearRect(0,0,994,1584);ctx.drawImage(template,0,0,994,1584);
  // Typeset the exact address instead of relying on lettering baked into the image.
  ctx.save();ctx.font='600 34px Georgia, "Times New Roman", serif';
  ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillStyle='#ffe2a3';
  ctx.strokeStyle='#8c300b';ctx.lineWidth=1;ctx.lineJoin='round';
  ctx.strokeText('www.sahyadripratishthan.com',497,358);
  ctx.fillText('www.sahyadripratishthan.com',497,358);ctx.restore();
  if(photo){
   const box={x:306,y:421,w:378,h:449};
   const scale=Math.max(box.w/photo.width,box.h/photo.height)*Number(el('zoom').value);
   const w=photo.width*scale,h=photo.height*scale;
   ctx.save();ctx.beginPath();ctx.roundRect(box.x,box.y,box.w,box.h,15);ctx.clip();
   ctx.drawImage(photo,box.x-(w-box.w)*Number(el('x').value)/100,box.y-(h-box.h)*Number(el('y').value)/100,w,h);ctx.restore();
  }
  text(member?.name||'सभासदाचे पूर्ण नाव',497,974,840,58,'center');
  text('सभासद',530,1067,390);
  text(member?.dob?member.dob.split('-').reverse().join('.'):'DD.MM.YYYY',530,1137,390);
  text(member?.blood||'—',530,1208,390);
  text(member?.phone||'—',530,1278,390);
  text('सभासद क्रमांक : '+(member?.number||'—'),497,1369,810,38,'center');
 }
 form.addEventListener('input',render);
 el('photo').addEventListener('change',async()=>{
  const token=++generation,file=el('photo').files[0];photo=null;el('crop').disabled=true;el('download').disabled=true;render();
  if(!file||!member)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){el('photo').value='';status(t.invalid);return;}
  const url=URL.createObjectURL(file);
  try{const img=new Image();img.src=url;await img.decode();if(token!==generation)return;
   if(img.naturalWidth*img.naturalHeight>40000000)throw new Error('Image too large');
   // Downsample in memory; only this temporary canvas is retained for the preview.
   const scaled=document.createElement('canvas'),scale=Math.min(1,1600/Math.max(img.naturalWidth,img.naturalHeight));
   scaled.width=Math.round(img.naturalWidth*scale);scaled.height=Math.round(img.naturalHeight*scale);
   scaled.getContext('2d').drawImage(img,0,0,scaled.width,scaled.height);photo=scaled;
   el('zoom').value='1';el('x').value=el('y').value='50';el('crop').disabled=false;status(t.lookup.found);el('download').disabled=!ready;render();
  }catch{if(token===generation){el('photo').value='';status(t.invalid);}}finally{URL.revokeObjectURL(url);}
 });
 function clearMember(){generation++;photo=null;member=null;el('photo').value='';el('photo').disabled=true;el('crop').disabled=true;el('download').disabled=true;el('member-details').hidden=true;['name','number','dob','blood','phone'].forEach(k=>el(k).value='');render();}
 form.addEventListener('reset',()=>{lookupVersion++;lookupController?.abort();clearMember();lookupForm.reset();lookupStatus.textContent='';status('');});
 const todayISO=el('dob').max;document.getElementById('lookup-dob').max=todayISO;
 lookupForm.addEventListener('input',()=>{lookupVersion++;lookupController?.abort();clearMember();lookupStatus.textContent='';});
 lookupForm.addEventListener('submit',async event=>{
  event.preventDefault();if(!lookupForm.reportValidity())return;const version=++lookupVersion;lookupController?.abort();clearMember();
  if(!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(t.endpoint)){lookupStatus.textContent=t.lookup.unavailable;return;}
  const payload={phone:document.getElementById('lookup-phone').value,dob:document.getElementById('lookup-dob').value};
  lookupStatus.textContent=t.lookup.searching;lookupController=new AbortController();const timer=setTimeout(()=>lookupController.abort(),25000);
  try{const response=await fetch(t.endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(payload),credentials:'omit',redirect:'follow',referrerPolicy:'no-referrer',signal:lookupController.signal});
   if(!response.ok)throw Error('Lookup unavailable');const result=await response.json();if(version!==lookupVersion)return;
   if(!result.ok){lookupStatus.textContent=t.lookup[result.code]||t.lookup.unavailable;return;}
   const m=result.member;if(!m||!['name','number','dob','phone','blood'].every(k=>typeof m[k]==='string'&&m[k].length<=150)||!/^\d{4}-\d{2}-\d{2}$/.test(m.dob))throw Error('Invalid member response');
   member=Object.freeze({...m});['name','number','dob','phone','blood'].forEach(k=>el(k).value=member[k]);el('member-details').hidden=false;el('photo').disabled=false;lookupStatus.textContent=t.lookup.found;status(t.photoRequired);render();
  }catch{if(version===lookupVersion)lookupStatus.textContent=t.lookup.unavailable;}finally{clearTimeout(timer);}
 });
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!ready||exporting)return;
  if(!member){lookupStatus.textContent=t.lookup.invalid;return;}
  if(!form.reportValidity())return;if(!photo){status(t.photoRequired);el('photo').focus();return;}
  exporting=true;el('download').disabled=true;
  try{render();const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('Empty image');
   const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Sahyadri-Pratishthan-ID.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status(t.done);
  }catch{status(t.failure);}finally{exporting=false;el('download').disabled=!ready||!member||!photo;}
 });
 window.addEventListener('pagehide',()=>{generation++;photo=null;form.reset();ctx.clearRect(0,0,canvas.width,canvas.height);});
 window.addEventListener('pageshow',event=>{if(event.persisted)render();});
 async function init(){try{template.src='/assets/id-card-template-v2.png';await Promise.all([template.decode(),document.fonts.load('700 58px "Noto Serif Devanagari"','सभासदाचे पूर्ण नाव')]);ready=true;render();status('');}catch{status(t.error);}}
 init();
})();
