import {readFile,writeFile,mkdir,readdir,stat,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const sharp=(await import(process.env.SHARP_MODULE||'sharp')).default;
const root=new URL('../',import.meta.url),out=new URL('assets/instagram/',root);await mkdir(out,{recursive:true});
const groups=JSON.parse(await readFile(new URL('output/instagram/candidates.json',root))),images={},records=[],seen=new Set(),errors=[];
let cursor=0;
async function worker(){while(cursor<groups.length){const i=cursor++,g=groups[i];
 const candidates=[];
 for(const path of g.paths||[]){try{const image=sharp(path).rotate(),meta=await image.metadata();if(Math.min(meta.width,meta.height)<260)continue;
 const pixels=await image.clone().resize(16,16,{fit:'fill'}).greyscale().raw().toBuffer(),avg=pixels.reduce((a,b)=>a+b,0)/pixels.length;
 const hash=createHash('sha256').update(Buffer.from(pixels.map(x=>x>avg?1:0))).digest('hex');if(seen.has(hash)||candidates.some(c=>c.hash===hash))continue;
 const stats=await image.clone().resize(240,240,{fit:'inside'}).stats();const score=Math.log(meta.width*meta.height)+(stats.sharpness||0)*.04;
 candidates.push({path,hash,score});}catch(e){errors.push({path,error:e.message});}}
 const selected=candidates.filter(c=>!seen.has(c.hash)).sort((a,b)=>b.score-a.score).slice(0,(g.paths?.length||0)>5?3:2);if(!selected.length)continue;
 const photos=[];
 for(const [j,c] of selected.entries()){seen.add(c.hash);const key=g.id+'-'+(j+1),im=sharp(c.path).rotate().resize(1280,1280,{fit:'inside',withoutEnlargement:true});
 let result;try{await access(new URL(key+'-thumb.webp',out));result=await sharp(new URL(key+'.webp',out).pathname).metadata();}catch{result=await im.clone().webp({quality:73,effort:3}).toFile(new URL(key+'.webp',out).pathname);}
 try{await access(new URL(key+'-thumb.webp',out));}catch{await im.clone().resize(600,600,{fit:'inside',withoutEnlargement:true}).webp({quality:66,effort:3}).toFile(new URL(key+'-thumb.webp',out).pathname);}
 images[key]={src:'/assets/instagram/'+key+'.webp',thumb:'/assets/instagram/'+key+'-thumb.webp',width:result.width,height:result.height};photos.push(key);}
 const timestamp=Math.min(...g.timestamps.filter(Boolean));records.push({id:g.id,categories:g.categories,date:Number.isFinite(timestamp)?new Date(timestamp*1000).toISOString().slice(0,10):'',caption:g.caption,photos,videoStill:!!g.videoStill});
 if(i%100===0)console.log('Optimized',i,'/',groups.length);
}}
await Promise.all(Array.from({length:4},worker));
records.sort((a,b)=>b.date.localeCompare(a.date));await writeFile(new URL('instagram-records.json',root),JSON.stringify(records,null,2));await writeFile(new URL('instagram-images.json',root),JSON.stringify(images,null,2));
const bytes=(await Promise.all((await readdir(out)).map(async name=>(await stat(new URL(name,out))).size))).reduce((a,b)=>a+b,0);
const report={records:records.length,photos:Object.keys(images).length,bytes,categories:Object.fromEntries([...new Set(records.flatMap(r=>r.categories))].map(c=>[c,records.filter(r=>r.categories.includes(c)).length])),errors};await writeFile(new URL('output/instagram/import-report.json',root),JSON.stringify(report,null,2));console.log(report);
