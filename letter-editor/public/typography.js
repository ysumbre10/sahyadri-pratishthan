const LETTER_SECTIONS={date:'दिनांक',number:'आवक / जावक क्रमांक',recipient:'प्रति',subject:'विषय',salutation:'संबोधन',body:'मुख्य मजकूर',closing:'समारोप',name:'स्वाक्षरी करणाऱ्याचे नाव',designation:'पद / संस्था',contact:'फोन / ईमेल'};
const baseTypography=()=>({font:'noto-sans-devanagari',size:12,bold:false,italic:false,line:1.7,gap:10.5,word:0,align:'left'});
function defaultTypography(size=12){return Object.fromEntries(Object.keys(LETTER_SECTIONS).map(id=>[id,{...baseTypography(),size,bold:['subject','name'].includes(id)}]))}
function validTypography(style,custom=false){return style&&typeof style==='object'&&(LETTER_FONTS.some(f=>f.id===style.font)||(custom&&style.font==='custom'))&&typeof style.bold==='boolean'&&typeof style.italic==='boolean'&&['left','center','right','justify'].includes(style.align)&&[['size',9,24],['line',1.2,2.4],['gap',0,24],['word',0,4]].every(([key,min,max])=>typeof style[key]==='number'&&Number.isFinite(style[key])&&style[key]>=min&&style[key]<=max)}
// A Unicode Devanagari cmap is required: legacy ISM encodings cannot render Unicode Marathi.
function hasDevanagariCmap(buffer){
 try{
  const v=new DataView(buffer),u16=o=>v.getUint16(o),u32=o=>v.getUint32(o);const signature=u32(0);if(signature!==0x00010000&&signature!==0x4f54544f)return false;
  const tables=u16(4);if(tables>256)return false;let cmap=-1;
  for(let i=0;i<tables;i++){const o=12+i*16;if(u32(o)===0x636d6170){cmap=u32(o+8);break}}
  if(cmap<0)return false;const count=u16(cmap+2);if(count>256)return false;
  for(let i=0;i<count;i++){
   const rec=cmap+4+i*8,platform=u16(rec),encoding=u16(rec+2);if(platform!==0&&!(platform===3&&[1,10].includes(encoding)))continue;
   const offset=cmap+u32(rec+4),format=u16(offset);
   const has=code=>{
    if(format===12){const n=u32(offset+12);if(n>100000)return false;for(let j=0;j<n;j++){const p=offset+16+j*12,start=u32(p),end=u32(p+4);if(code>=start&&code<=end)return u32(p+8)+(code-start)!==0}return false}
    if(format===4){const n=u16(offset+6)/2;if(n>32768)return false;const ends=offset+14,starts=ends+2*n+2,deltas=starts+2*n,ranges=deltas+2*n;for(let j=0;j<n;j++){if(code<u16(starts+2*j)||code>u16(ends+2*j))continue;const delta=u16(deltas+2*j),range=u16(ranges+2*j);if(!range)return((code+delta)&65535)!==0;const glyph=u16(ranges+2*j+range+2*(code-u16(starts+2*j)));return glyph!==0&&((glyph+delta)&65535)!==0}return false}
    return false;
   };
   if(has(0x0915)&&has(0x093e))return true;
  }
 }catch{return false}return false;
}
