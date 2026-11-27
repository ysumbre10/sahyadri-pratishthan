let typography=defaultTypography(),customFont=null,customFace=null;
function familyFor(id){return id==='custom'?'LetterCustomFont':LETTER_FONTS.find(f=>f.id===id)?.family||LETTER_FONTS[0].family}
function applyTypography(node,id){
 const s=typography[id];node.dataset.section=id;
 Object.assign(node.style,{fontFamily:`"${familyFor(s.font)}", "Noto Sans Devanagari", sans-serif`,fontSize:s.size+'pt',fontWeight:s.bold?'700':'400',fontStyle:s.italic?'italic':'normal',lineHeight:String(s.line),marginBottom:s.gap+'pt',wordSpacing:s.word+'px',textAlign:s.align});
}
function option(value,label){const o=document.createElement('option');o.value=value;o.textContent=label;return o}
function fontOptions(select){select.replaceChildren(...LETTER_FONTS.map(f=>option(f.id,f.label)));if(customFont)select.append(option('custom','माझा ISM / Unicode फॉन्ट'))}
function setupFormatting(){
 fontOptions($('all-font'));
 for(const [id,label]of Object.entries(LETTER_SECTIONS)){
  const details=document.createElement('details');details.className='format-panel';details.dataset.for=id;
  const summary=document.createElement('summary');summary.textContent='अक्षररचना';const state=document.createElement('span');state.id='format-summary-'+id;summary.append(state);details.append(summary);
  const panel=document.createElement('div');panel.className='format-controls';
  function control(key,title,element){const labelEl=document.createElement('label');const controlId=`format-${id}-${key}`;labelEl.htmlFor=controlId;labelEl.textContent=title;element.id=controlId;element.dataset.format=id;element.dataset.key=key;panel.append(labelEl,element);return element}
  const font=control('font','फॉन्ट',document.createElement('select'));fontOptions(font);
  const toggles=document.createElement('div');toggles.className='style-toggles';
  for(const [key,title]of [['bold','ठळक (Bold)'],['italic','तिरपे (Italic)']]){const b=document.createElement('button');b.type='button';b.className='format-toggle';b.dataset.format=id;b.dataset.key=key;b.id=`format-${id}-${key}`;b.textContent=title;b.setAttribute('aria-pressed','false');b.setAttribute('aria-label',`${label}: ${title}`);b.onclick=()=>{typography[id][key]=!typography[id][key];syncFormatting();update()};toggles.append(b)}panel.append(toggles);
  for(const [key,title,min,max,step]of [['size','अक्षर आकार (pt)',9,24,.5],['gap','परिच्छेदांमधील अंतर (pt)',0,24,.5],['word','शब्दांमधील अतिरिक्त अंतर (px)',0,4,.25]]){const input=control(key,title,document.createElement('input'));input.type='number';input.min=min;input.max=max;input.step=step;input.inputMode='decimal'}
  const line=control('line','ओळींमधील अंतर',document.createElement('select'));for(const n of [1.2,1.4,1.5,1.6,1.7,1.8,2,2.2,2.4])line.append(option(n,String(n)));
  const align=control('align','मजकूर मांडणी',document.createElement('select'));for(const [value,title]of [['left','डावीकडे'],['justify','दोन्ही बाजूंनी समान'],['center','मध्यभागी'],['right','उजवीकडे']])align.append(option(value,title));
  const sample=document.createElement('p');sample.className='font-sample';sample.id='font-sample-'+id;sample.textContent='सह्याद्री प्रतिष्ठान हिंदुस्थान — मराठी पत्र';panel.append(sample);
  const reset=document.createElement('button');reset.type='button';reset.className='secondary';reset.textContent='या भागाची मूळ अक्षररचना';reset.onclick=()=>{typography[id]=defaultTypography()[id];syncFormatting();update()};panel.append(reset);details.append(panel);$(id).after(details);
 }
 $('fields').addEventListener('change',event=>{const e=event.target;if(!e.dataset.format||e.tagName==='BUTTON')return;const {format:id,key}=e.dataset;const next={...typography[id],[key]:['size','gap','line','word'].includes(key)?Number(e.value):e.value};if(!validTypography(next,!!customFont)){e.value=typography[id][key];$('status').textContent='अक्षर आकार ९–२४ pt आणि वैध अंतर निवडा.';return}typography[id]=next;syncFormatting();update()});
 $('apply-all').onclick=()=>{const size=Number($('all-size').value);if(!Number.isFinite(size)||size<9||size>24){$('all-size').reportValidity();return}for(const id of Object.keys(typography))Object.assign(typography[id],{font:$('all-font').value,size,line:Number($('all-line').value)});syncFormatting();update()};
 $('custom-font').onchange=async()=>{const file=$('custom-font').files[0];if(!file)return;try{if(file.size>2*1024*1024||! /\.(ttf|otf)$/i.test(file.name))throw Error('२ MB पर्यंतची Unicode TTF किंवा OTF फाइल निवडा.');const bytes=await file.arrayBuffer();if(!hasDevanagariCmap(bytes))throw Error('या फॉन्टमध्ये Unicode देवनागरी अक्षरे नाहीत. ISM Unicode फॉन्ट वापरा.');const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=reject;reader.readAsDataURL(file)});await installCustomFont({name:file.name,data});refreshFontOptions();$('font-message').textContent=`${file.name} तयार आहे. फॉन्ट निवडीत “माझा ISM / Unicode फॉन्ट” निवडा.`;await update()}catch(error){$('font-message').textContent=error.message||'फॉन्ट उघडता आला नाही.'}finally{$('custom-font').value=''}};
 syncFormatting();
}
function refreshFontOptions(){for(const select of document.querySelectorAll('select[data-key="font"],#all-font')){const value=select.value;fontOptions(select);select.value=value==='custom'&&!customFont?LETTER_FONTS[0].id:value}syncFormatting()}
function syncFormatting(){for(const [id,s]of Object.entries(typography)){for(const [key,value]of Object.entries(s)){const input=$(`format-${id}-${key}`);if(!input)continue;if(typeof value==='boolean')input.setAttribute('aria-pressed',String(value));else input.value=value}const label=s.font==='custom'?'माझा फॉन्ट':familyFor(s.font);$('format-summary-'+id).textContent=`${label} · ${s.size} pt${s.bold?' · B':''}${s.italic?' · I':''}`;applyTypography($('font-sample-'+id),id)}}
async function ensureLetterFonts(){const loads=Object.values(typography).map(s=>document.fonts.load(`${s.italic?'italic':'normal'} ${s.bold?700:400} ${s.size}pt "${familyFor(s.font)}"`,'सह्याद्री प्रतिष्ठान ABC १२३'));const result=await Promise.all(loads);if(result.some(faces=>!faces.length))throw Error('निवडलेला फॉन्ट लोड झाला नाही. दुसरा फॉन्ट निवडा.');await document.fonts.ready}
async function installCustomFont(value){
 if(!value||typeof value.name!=='string'||value.name.length>200||typeof value.data!=='string'||value.data.length>2800000||! /^[A-Za-z0-9+/=]+$/.test(value.data))throw Error('अवैध फॉन्ट फाइल.');
 const bytes=Uint8Array.from(atob(value.data),c=>c.charCodeAt(0));if(!hasDevanagariCmap(bytes.buffer))throw Error('Unicode देवनागरी फॉन्ट आवश्यक आहे.');
 const face=new FontFace('LetterCustomFont',bytes.buffer);await face.load();if(customFace)document.fonts.delete(customFace);document.fonts.add(face);customFace=face;customFont={name:value.name,data:value.data};
}
