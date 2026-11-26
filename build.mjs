import {mkdir,cp,writeFile,rm} from 'node:fs/promises';
import {content} from './content.mjs';
import {sections} from './components.mjs';
import {layout} from './layout.mjs';
import {pageDefinitions,pageText,urlFor,pageIntro,overview} from './pages.mjs';
const out=new URL('./dist/',import.meta.url);
await mkdir(out,{recursive:true});
// Only explicitly selected public assets enter the deployable site.
await rm(new URL('assets/',out),{recursive:true,force:true});
await mkdir(new URL('assets/',out),{recursive:true});
for(const name of ['raigad.webp','lohagad.webp','film.webp','sp_logo_reg_no.webp','document-pages','projects','heritage']) await cp(new URL(`assets/${name}`,import.meta.url),new URL(`assets/${name}`,out),{recursive:true});
for(const file of ['styles.css','app.js','projects.css','projects.js','heritage.css','media.js']) await cp(new URL(file,import.meta.url),new URL(file,out));
const urls=[];
for(const [lang,t] of Object.entries(content)){
 const fragments=sections(lang,t);fragments.overview=()=>overview(lang);
 for(const page of pageDefinitions){
  const slug=page.slug;
  const pageTitle=slug?`${pageText[lang][slug][0]} | ${t.name}`:t.title;
  const pageDescription=slug?pageText[lang][slug][1]:t.description;
  const body=(slug?pageIntro(lang,slug):'')+page.sections.map(key=>fragments[key]()).join('\n');
  let html=layout({lang,t,slug,pageTitle,pageDescription,body});
  for(const target of ['about','work','stories','documents','join']) html=html.replaceAll(`href="#${target}"`,`href="${urlFor(lang,target)}"`);
  // Films remain part of home, about and stories; link elsewhere to the home film.
  if(!page.sections.includes('film')&&!page.sections.includes('videoJournal'))html=html.replaceAll('href="#film"',`href="${urlFor(lang)}#film"`);
  if(slug){const navEnd=html.indexOf('</nav>');const navStart=html.lastIndexOf('<nav',navEnd);const nav=html.slice(navStart,navEnd).replace(`href="${urlFor(lang,slug)}"`,`href="${urlFor(lang,slug)}" aria-current="page"`);html=html.slice(0,navStart)+nav+html.slice(navEnd);}
  const dir=new URL(urlFor(lang,slug).slice(1),out);await mkdir(dir,{recursive:true});await writeFile(new URL('index.html',dir),html);urls.push(urlFor(lang,slug));
 }
}
await writeFile(new URL('robots.txt',out),'User-agent: *\nAllow: /\nSitemap: https://sahyadripratishthan.com/sitemap.xml\n');
await writeFile(new URL('sitemap.xml',out),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path=>`<url><loc>https://sahyadripratishthan.com${path}</loc></url>`).join('')}</urlset>`);
await writeFile(new URL('CNAME',out),'sahyadripratishthan.com\n');
await writeFile(new URL('.nojekyll',out),'');
console.log(`Built ${urls.length} pages across Marathi, Hindi and English.`);
