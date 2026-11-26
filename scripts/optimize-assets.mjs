// One-time asset migration. Originals are removed separately only after verification.
import {readFile,writeFile,readdir,stat,rename,mkdir} from 'node:fs/promises';
import {resolve,relative,extname} from 'node:path';
const {default:sharp}=await import(process.env.SHARP_MODULE||'sharp');
const root=resolve(new URL('..',import.meta.url).pathname);
async function files(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=resolve(dir,e.name);if(e.isDirectory())out.push(...await files(p));else out.push(p);}return out;}
const baseline=await files(root);const before=Object.fromEntries(await Promise.all(baseline.map(async p=>[relative(root,p),(await stat(p)).size])));
const report={beforeBytes:Object.values(before).reduce((a,b)=>a+b,0),beforeDistBytes:Object.entries(before).filter(([p])=>p.startsWith('dist/')).reduce((n,[,s])=>n+s,0),converted:[],projects:[],deleteAfterVerification:[]};
const extracted=JSON.parse(await readFile('/tmp/sahyadri-project-originals/manifest.json','utf8'));
for(const project of extracted)for(const image of project.images){for(const [variant,max,quality] of [['large',1600,78],['card',800,76],['thumb',180,68]]){
 const destination=resolve(root,`assets/projects/${project.id}/${image.id}-${variant}.webp`);
 const encoded=await sharp(image.input,{failOn:'none'}).rotate().resize({width:max,height:max,fit:'inside',withoutEnlargement:true}).webp({quality,effort:6}).toBuffer();
 await writeFile(destination+'.tmp',encoded);await rename(destination+'.tmp',destination);
 report.projects.push({file:relative(root,destination),before:before[relative(root,destination)],after:encoded.length});
}}
for(const file of await files(resolve(root,'assets'))){
 if(!/\.(jpg|jpeg|png)$/i.test(file))continue;
 const destination=file.replace(/\.(jpg|jpeg|png)$/i,'.webp');
 let pipeline=sharp(file).rotate();
 if(file.endsWith('sp_logo_reg_no.png'))pipeline=pipeline.resize({width:1024,withoutEnlargement:true}).webp({lossless:true,effort:6});
 else if(file.includes('/document-pages/'))pipeline=pipeline.webp({quality:86,effort:6,smartSubsample:true});
 else pipeline=pipeline.webp({quality:80,effort:6,smartSubsample:true});
 const buffer=await pipeline.toBuffer();await writeFile(destination,buffer);
 const sourceMeta=await sharp(file).metadata();const destMeta=await sharp(buffer).metadata();
 if(file.includes('/document-pages/')&&(sourceMeta.width!==destMeta.width||sourceMeta.height!==destMeta.height))throw new Error('Document resolution changed');
 report.converted.push({from:relative(root,file),to:relative(root,destination),before:(await stat(file)).size,after:buffer.length,width:destMeta.width,height:destMeta.height});
 report.deleteAfterVerification.push(relative(root,file));
}
for(const file of await files(resolve(root,'assets')))if(/\.(pdf|zip)$/i.test(file))report.deleteAfterVerification.push(relative(root,file));
for(const file of await files(resolve(root,'output')))if(/\.(png|jpg|jpeg|webp)$/i.test(file))report.deleteAfterVerification.push(relative(root,file));
await mkdir(resolve(root,'output/optimization'),{recursive:true});await writeFile(resolve(root,'output/optimization/report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({converted:report.converted.length,projectVariants:report.projects.length,oldAssetsBytes:report.converted.reduce((n,x)=>n+x.before,0)+report.projects.reduce((n,x)=>n+x.before,0),newAssetsBytes:report.converted.reduce((n,x)=>n+x.after,0)+report.projects.reduce((n,x)=>n+x.after,0),originalsPendingDeletion:report.deleteAfterVerification.length}));
