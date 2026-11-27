const ids=['date','kind','number','recipient','subject','salutation','body','closing','name','designation','contact','size'];
const $=id=>document.getElementById(id);let signature='',timer;
$('date').value=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
function paragraph(text,bold=false){const p=document.createElement('p');p.textContent=text;if(bold)p.style.fontWeight='700';return p}
function render(){
 $('pages').replaceChildren();let content;
 function newPage(){
  const frame=document.createElement('div');frame.className='sheet-frame';
  const sheet=document.createElement('article');sheet.className='sheet';
  const bg=document.createElement('img');bg.className='stationery';bg.src='/letterhead.png';bg.alt='';
  content=document.createElement('div');content.className='letter-content';content.style.fontSize=$('size').value+'px';
  sheet.append(bg,content);frame.append(sheet);$('pages').append(frame);
 }
 const fits=()=>content.scrollHeight<=content.clientHeight&&content.scrollWidth<=content.clientWidth;
 newPage();
 function text(value,bold=false){
  let p;
  paginateLetterText(value,{
   fits(candidate){if(!p){p=paragraph('',bold);content.append(p)}p.textContent=candidate;return fits()},
   commit(candidate){p.textContent=candidate;p=null},
   isEmpty(){return [...content.children].every(child=>child===p)},
   nextPage(){if(p){p.remove();p=null}newPage()}
  });
 }
 function append(node){
  content.append(node);if(fits())return;
  node.remove();
  if(content.childElementCount)newPage();
  content.append(node);if(fits())return;
  node.remove();
  // Unusually long closing/signatory fields may span pages too.
  if(node.classList.contains('signature-block')){for(const child of [...node.children]){if(child.tagName==='P')text(child.textContent,child.style.fontWeight==='700');else append(child)}return}
  throw new Error('हा भाग पानात मावत नाही. मजकूर किंवा अक्षर आकार कमी करा.');
 }
 const meta=document.createElement('div');meta.className='letter-meta';
 const ref=document.createElement('span'),date=document.createElement('span');
 ref.textContent=$('number').value?$('kind').value+' '+$('number').value:'';
 const dateValue=$('date').value;date.textContent=dateValue?'दि. '+new Date(dateValue+'T12:00:00').toLocaleDateString('mr-IN'):'';
 meta.append(ref,date);append(meta);
 if($('recipient').value)text('प्रति,\n'+$('recipient').value);
 if($('subject').value)text('विषय : '+$('subject').value,true);
 if($('salutation').value)text($('salutation').value);
 if($('body').value)for(const line of $('body').value.split('\n'))text(line);
 const sign=document.createElement('div');sign.className='signature-block';
 if($('closing').value)sign.append(paragraph($('closing').value));
 if(signature){const img=document.createElement('img');img.src=signature;img.className='signature-image';img.alt='स्वाक्षरी';sign.append(img)}
 for(const id of ['name','designation','contact'])if($(id).value)sign.append(paragraph($(id).value,id==='name'));
 if(sign.childElementCount)append(sign);
 const sheets=[...document.querySelectorAll('.sheet')];
 sheets.forEach((sheet,i)=>{sheet.setAttribute('aria-label',`पान ${i+1}`);const n=document.createElement('span');n.className='page-label';n.textContent=`${i+1} / ${sheets.length}`;sheet.append(n)});
 $('page-count').textContent=`${sheets.length} पाने`;
 $('mobile-page-count').textContent=`पूर्वावलोकन पहा (${sheets.length} पाने)`;
 $('text-count').textContent=`${$('body').value.length.toLocaleString('mr-IN')} / ५०,००० अक्षरे`;
 for(const area of document.querySelectorAll('.letter-content'))if(area.scrollHeight>area.clientHeight||area.scrollWidth>area.clientWidth)throw new Error('मजकूर सुरक्षित जागेबाहेर आहे. अक्षर आकार कमी करा.');
 scale();
}
function update(){try{syncSignature();render();$('status').textContent='';$('print').disabled=false}catch(e){$('status').textContent=e.message;$('print').disabled=true}}
function syncSignature(){
 $('signature-preview').hidden=!signature;$('remove-signature').disabled=!signature;
 if(signature)$('signature-thumbnail').src=signature;else $('signature-thumbnail').removeAttribute('src');
}
function scale(){
 const width=$('pages').clientWidth;
 const ratio=$('preview-size').value==='actual'?1:Math.min(1,width/794);
 document.querySelectorAll('.sheet-frame').forEach(frame=>{frame.style.width=(794*ratio)+'px';frame.style.height=(1123*ratio)+'px';frame.firstElementChild.style.transform=`scale(${ratio})`});
}
$('preview-size').addEventListener('change',scale);
$('jump').onchange=()=>{const value=$('jump').value;if(value==='preview')$('show-preview').click();if(value==='fields')$('show-fields').click();$('jump').value=''};
$('show-preview').onclick=()=>{clearTimeout(timer);update();$('preview').scrollIntoView({block:'start'});$('preview-title').focus({preventScroll:true})};
$('show-fields').onclick=()=>{$('fields').scrollIntoView({block:'start'});$('fields-title').focus({preventScroll:true})};
$('fields').addEventListener('submit',e=>e.preventDefault());$('fields').addEventListener('input',e=>{if(e.target.type==='file')return;clearTimeout(timer);timer=setTimeout(update,120)});window.addEventListener('resize',scale);
$('signature').addEventListener('change',async()=>{const file=$('signature').files[0];if(!file)return;if(!['image/png','image/jpeg'].includes(file.type)||file.size>2*1024*1024){$('status').textContent='PNG किंवा JPG फाइल वापरा (कमाल 2 MB).';return}const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{signature=reader.result;update()};img.onerror=()=>{$('status').textContent='स्वाक्षरीची फाइल उघडता आली नाही.'};img.src=reader.result};reader.readAsDataURL(file)});
$('remove-signature').onclick=()=>{signature='';$('signature').value='';update()};
$('print').onclick=async()=>{clearTimeout(timer);await document.fonts.ready;update();if($('print').disabled)return;try{await Promise.all([...document.querySelectorAll('#pages img')].map(img=>img.decode()));window.print()}catch{$('status').textContent='लेटरहेड लोड झाले नाही. पेज रिफ्रेश करून पुन्हा प्रयत्न करा.'}};
$('save').onclick=()=>{const data={version:1,fields:Object.fromEntries(ids.map(id=>[id,$(id).value])),signature};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'}));a.download=`sahyadri-draft-${$('date').value||'letter'}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$('load').onchange=async()=>{try{const file=$('load').files[0];if(!file)return;if(file.size>4*1024*1024)throw Error();const data=JSON.parse(await file.text());if(data.version!==1||!data.fields||ids.some(id=>typeof data.fields[id]!=='string'||data.fields[id].length>($(id).maxLength>0?$(id).maxLength:50000))||!['15','16','18'].includes(data.fields.size)||!['जावक क्र.','आवक क्र.'].includes(data.fields.kind)||typeof data.signature!=='string'||(data.signature&&!/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(data.signature)))throw Error();for(const id of ids)$(id).value=data.fields[id];signature=data.signature;update()}catch{$('status').textContent='वैध सह्याद्री मसुदा JSON फाइल निवडा.'}finally{$('load').value=''}};
update();
document.fonts.ready.then(update);
