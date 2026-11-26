// Optional deep image verification; requires Sharp. Normal npm run verify needs no dependencies.
import {readFile,readdir,stat,writeFile} from 'node:fs/promises';
const {default:sharp}=await import(process.env.SHARP_MODULE||'sharp');
async function list(d){const out=[];for(const e of await readdir(d,{withFileTypes:true})){const p=d+'/'+e.name;if(e.isDirectory())out.push(...await list(p));else out.push(p);}return out;}
const images=(await list('assets')).filter(p=>!p.endsWith('.DS_Store'));
if(images.some(p=>!p.endsWith('.webp')))throw new Error('Non-WebP public asset remains');
for(const path of images)await sharp(path).stats();
const projects=JSON.parse(await readFile('projects-manifest.json','utf8'));
for(const project of projects)for(const image of project.images)for(const [variant,max] of Object.entries({thumb:180,card:800,large:1600})){const actual=await sharp('.'+image[variant]).metadata();const expected=Math.round(image.width*Math.min(1,max/Math.max(image.width,image.height)));if(Math.abs(actual.width-expected)>1)throw new Error('Incorrect responsive width: '+image[variant]);}
for(const name of ['shivaji','sambhaji']){const path=`assets/heritage/${name}-rajmudra.webp`;const m=await sharp(path).metadata();const s=await sharp(path).stats();if(!m.hasAlpha||s.channels[3].min!==0||s.channels[3].max!==255)throw new Error('Invalid cutout alpha');}
const report=JSON.parse(await readFile('output/optimization/report.json','utf8'));
let total=0,dist=0;for(const p of await list('.')){const size=(await stat(p)).size;total+=size;if(p.startsWith('./dist/'))dist+=size;}
report.afterBytes=total;report.afterDistBytes=dist;report.decodedWebpImages=images.length;
await writeFile('output/optimization/report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({images:images.length,projectBeforeMiB:report.beforeBytes/1048576,projectAfterMiB:total/1048576,siteBeforeMiB:report.beforeDistBytes/1048576,siteAfterMiB:dist/1048576,projectReductionPercent:100*(1-total/report.beforeBytes),siteReductionPercent:100*(1-dist/report.beforeDistBytes)},null,2));
