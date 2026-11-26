// Run extract-projects.py first. Requires sharp (SHARP_MODULE may point to an existing installation).
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const {default:sharp}=await import(process.env.SHARP_MODULE||'sharp');
const root=new URL('../',import.meta.url);const review='/tmp/sahyadri-project-review';await mkdir(review,{recursive:true});
const manifest=JSON.parse(await readFile('/tmp/sahyadri-project-originals/manifest.json','utf8'));
for(const project of manifest){
 await mkdir(new URL(`assets/projects/${project.id}/`,root),{recursive:true});
 for(const image of project.images){
  const {width,height}=await sharp(image.input,{failOn:"none"}).rotate().toBuffer({resolveWithObject:true}).then(r=>r.info);
  for(const [variant,size,quality] of [['large',1600,78],['card',800,76],['thumb',180,68]]){
   image[variant]=`/assets/projects/${project.id}/${image.id}-${variant}.webp`;
   await sharp(image.input,{failOn:"none"}).rotate().resize({width:size,height:size,fit:'inside',withoutEnlargement:true}).webp({quality,effort:6}).toFile(fileURLToPath(new URL(image[variant].slice(1),root)));
  }
  image.width=width;image.height=height;delete image.input;
 }
 for(let offset=0;offset<project.images.length;offset+=12){
  const items=project.images.slice(offset,offset+12);const overlays=[];
  for(let j=0;j<items.length;j++){
   const x=j%4*300,y=Math.floor(j/4)*250;const label=Buffer.from(`<svg width="300" height="25"><text x="10" y="18" font-family="sans-serif" font-size="15">${project.id} / ${items[j].id}</text></svg>`);
   const thumb=await sharp(fileURLToPath(new URL(items[j].thumb.slice(1),root))).resize({width:288,height:218,fit:'contain',background:'#e1e4df'}).toBuffer();
   overlays.push({input:label,left:x,top:y},{input:thumb,left:x+6,top:y+27});
  }
  await sharp({create:{width:1200,height:Math.ceil(items.length/4)*250,channels:3,background:'#e1e4df'}}).composite(overlays).jpeg().toFile(`${review}/${project.id}-${offset/12+1}.jpg`);
 }
 console.log(`${project.id}: ${project.images.length} images optimised`);
}
await writeFile(new URL('projects-manifest.json',root),JSON.stringify(manifest,null,2)+'\n');
