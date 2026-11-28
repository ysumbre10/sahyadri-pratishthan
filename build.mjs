import {sitemapXml} from './seo.mjs';
import {mkdir,cp,writeFile,rm} from 'node:fs/promises';
import {content} from './content.mjs';
import {sections} from './components.mjs';
import {layout} from './layout.mjs';
import {pageDefinitions,pageText,urlFor,pageIntro} from './pages.mjs';
const out=new URL('./dist/',import.meta.url);
await mkdir(out,{recursive:true});
// Local review helpers must never enter a deployment artifact.
await rm(new URL('__letter-preview-phone/',out),{recursive:true,force:true});
// Only explicitly selected public assets enter the deployable site.
await rm(new URL('assets/',out),{recursive:true,force:true});
await mkdir(new URL('assets/',out),{recursive:true});
for(const name of ['icons','id-card-template-v2.png','raigad.webp','lohagad.webp','film.webp','sp_logo_reg_no.webp','document-pages','projects','heritage','presentation','archive']) await cp(new URL(`assets/${name}`,import.meta.url),new URL(`assets/${name}`,out),{recursive:true});
for(const file of ['work-categories.css','work-categories.js','styles.css','archive.css','founder.css','app.js','projects.css','projects.js','heritage.css','media.js','registration.css','id-card.js','member-editor.js']) await cp(new URL(file,import.meta.url),new URL(file,out));
// Unlisted, encrypted letter editor: never add this route to navigation or sitemap.
await rm(new URL('patra-kaksha/',out),{recursive:true,force:true});
await mkdir(new URL('patra-kaksha/',out),{recursive:true});
await cp(new URL('./letter-editor.html',import.meta.url),new URL('patra-kaksha/index.html',out));
const urls=[];
for(const [lang,t] of Object.entries(content)){
 const fragments=sections(lang,t);
 for(const page of pageDefinitions){
  const slug=page.slug;
  const pageTitle=slug?`${pageText[lang][slug][0]} | ${t.name}`:t.title;
  const pageDescription=slug?pageText[lang][slug][1]:t.description;
  const body=(slug&&slug!=='founder'?pageIntro(lang,slug):'')+page.sections.map(key=>fragments[key]()).join('\n');
  let html=layout({lang,t,slug,pageTitle,pageDescription,body});
  for(const target of ['about','work','stories','documents','join']) html=html.replaceAll(`href="#${target}"`,`href="${urlFor(lang,target)}"`);
  // Films remain part of home, about and stories; link elsewhere to the home film.
  if(!page.sections.includes('film')&&!page.sections.includes('videoJournal'))html=html.replaceAll('href="#film"',`href="${urlFor(lang)}#film"`);
  if(slug){const navEnd=html.indexOf('</nav>');const navStart=html.lastIndexOf('<nav',navEnd);const nav=html.slice(navStart,navEnd).replace(`href="${urlFor(lang,slug)}"`,`href="${urlFor(lang,slug)}" aria-current="page"`);html=html.slice(0,navStart)+nav+html.slice(navEnd);}
  const dir=new URL(urlFor(lang,slug).slice(1),out);await mkdir(dir,{recursive:true});await writeFile(new URL('index.html',dir),html);urls.push(urlFor(lang,slug));
 }
}
await writeFile(new URL('robots.txt',out),'User-agent: *\nAllow: /\nSitemap: https://sahyadripratishthan.com/sitemap.xml\n');
await writeFile(new URL('sitemap.xml',out),sitemapXml());
// Retain Google's ownership proof for the organisation's Search Console account.
await cp(new URL('googlea36b97a75caa8bc6.html',import.meta.url),new URL('googlea36b97a75caa8bc6.html',out));
await writeFile(new URL('CNAME',out),'sahyadripratishthan.com\n');
await writeFile(new URL('.nojekyll',out),'');
console.log(`Built ${urls.length} pages across Marathi, Hindi and English.`);

await cp(new URL('assets/icons/favicon.ico',import.meta.url),new URL('favicon.ico',out));
await cp(new URL('assets/icons/icon-96.png',import.meta.url),new URL('favicon.png',out));
await writeFile(new URL('site.webmanifest',out),JSON.stringify({name:'Sahyadri Pratishthan',short_name:'Sahyadri',start_url:'/',display:'browser',background_color:'#fffaf1',theme_color:'#f36616',icons:[192,512].map(size=>({src:`/assets/icons/icon-${size}.png`,sizes:`${size}x${size}`,type:'image/png',purpose:'any'}))}));
