import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {content,officialTagline} from '../content.mjs';
import {pageDefinitions,urlFor} from '../pages.mjs';
import {workCategories,categoryEvents} from '../work-categories.mjs';
import {documents} from '../documents.mjs';
const projects=JSON.parse(await readFile(new URL('../projects-manifest.json',import.meta.url),'utf8'));
const photoCount=projects.reduce((total,project)=>total+project.images.length,0);
const root=new URL('../dist/',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const routes=new Map();
const titles=new Set(),descriptions=new Set();
for(const lang of Object.keys(content))for(const {slug} of pageDefinitions){
 const route=urlFor(lang,slug);const html=await read(route.slice(1)+'index.html');routes.set(route,html);
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 const description=html.match(/<meta name="description" content="([^"]*)">/)?.[1];
 assert(title&&description,`${route}: title and description present`);
 assert(!titles.has(lang+':'+title)&&!descriptions.has(description),`${route}: unique search metadata`);
 titles.add(lang+':'+title);descriptions.add(description);
 assert(html.includes('href="/favicon.png"')&&html.includes('href="/favicon.ico"'),`${route}: PNG and ICO favicons`);
 assert(html.includes('href="/site.webmanifest"'),`${route}: install icon manifest`);
 assert(html.includes('content="index, follow, max-image-preview:large"'),`${route}: public page indexable`);
 assert(!/noindex/i.test(html),`${route}: no accidental noindex`);
 const structured=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
 assert.equal(structured.length,1,`${route}: one structured graph`);
 const graph=structured[0]['@graph'];
 assert(graph.some(node=>node['@type']==='WebSite'&&node.url==='https://sahyadripratishthan.com/'),`${route}: canonical website identity`);
 const page=graph.find(node=>node['@id']===`https://sahyadripratishthan.com${route}#webpage`);
 assert(page&&page.inLanguage===lang,`${route}: page identity and language`);
 if(slug&&slug!=='founder')assert(graph.some(node=>node['@type']==='BreadcrumbList'&&node.itemListElement.at(-1).item===page.url),`${route}: matching breadcrumb`);
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`${route}: one h1`);
 assert(html.includes(`<html lang="${lang}">`),`${route}: language`);
 assert(html.includes(`<link rel="canonical" href="https://sahyadripratishthan.com${route}">`),`${route}: canonical`);
 assert(html.includes(officialTagline),`${route}: exact tagline`);
 for(const locale of Object.keys(content))assert(html.includes(`hreflang="${locale}" href="https://sahyadripratishthan.com${urlFor(locale,slug)}"`),`${route}: matching language route`);
 if(slug===''){
  assert.equal((html.match(/class="portrait-arch"/g)||[]).length,2,`${route}: both royal portraits`);
  assert.equal((html.match(/data-video="/g)||[]).length,2,`${route}: both archive videos`);
  assert.equal((html.match(/class="social-crest"/g)||[]).length,4,`${route}: official social emblems`);
  assert(!html.includes('<iframe'),`${route}: videos load only on interaction`);
 }
 if(slug==='work/collections'){
  assert.equal((html.match(/data-project-chapter/g)||[]).length,projects.length,`${route}: all project collections`);
  assert.equal((html.match(/data-photo data-caption/g)||[]).length,photoCount,`${route}: all unique photographs`);
 }
 if(slug==='documents')assert.equal((html.match(/class="document-page"/g)||[]).length,documents.reduce((n,d)=>n+d.pages.length,0));
 assert(!/\b(?:href|src)="[^\"]*\.pdf(?:[?#"])|<[^>]+\sdownload(?:[\s=>])/i.test(html),`${route}: no PDF/download links`);
}
for(const [route,html] of routes){
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,`${route}: unique IDs`);
 for(const [,link] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(!link.startsWith('/')&&!link.startsWith('#'))continue;
  const url=new URL(link,'https://local.test'+route);
  if(url.pathname.endsWith('/')){
   const target=routes.get(url.pathname);assert(target,`${route}: route ${link}`);
   if(url.hash)assert(target.includes(`id="${url.hash.slice(1)}"`),`${route}: anchor ${link}`);
  }else await access(new URL(url.pathname.slice(1),root));
 }
}
for(const document of documents)for(const page of document.pages)await access(new URL(page.slice(1),root));
for(const project of projects)for(const image of project.images)for(const size of ['large','card','thumb'])await access(new URL(image[size].slice(1),root));
const files=await readdir(root,{recursive:true});assert(!files.some(file=>/\.(pdf|zip|heic)$/i.test(file)),'Source archives and documents excluded from deployment');
const sitemap=await read('sitemap.xml');assert.equal((sitemap.match(/<url>/g)||[]).length,routes.size);
assert(sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'),'Sitemap language namespace');
for(const [route] of routes){
 const entry=sitemap.match(new RegExp(`<url><loc>https://sahyadripratishthan\\.com${route}</loc>(.*?)</url>`))?.[1];
 assert(entry,`${route}: sitemap entry`);
 for(const lang of [...Object.keys(content),'x-default'])assert(entry.includes(`hreflang="${lang}"`),`${route}: sitemap alternate ${lang}`);
}
assert(!sitemap.includes('patra-kaksha'),'Private editor excluded from sitemap');
assert((await read('patra-kaksha/index.html')).includes('noindex'),'Private editor remains noindex');
console.log(`Verified ${routes.size} pages, language routes, metadata, links, exact tagline, document pages, ${projects.length} collections / ${photoCount} photos, and source-file exclusion.`);
// Every archive account must remain reachable in each language with its photographs.
const archive=JSON.parse(await readFile(new URL('../archive-catalog.json',import.meta.url),'utf8'));
const archiveImages=JSON.parse(await readFile(new URL('../archive-images.json',import.meta.url),'utf8'));
for(const group of archive){
 assert.equal(new Set(group.entries.map(e=>e.id)).size,group.entries.length,`${group.id}: unique account IDs`);
 for(const lang of Object.keys(content)){
  const html=routes.get(urlFor(lang,'archive/'+group.id));
  for(const entry of group.entries){
   assert(entry.title[lang]&&entry.body[lang],`${group.id}/${entry.id}: ${lang} translation`);
   assert(![entry.title[lang],entry.body[lang]].some(s=>s.includes('\uFFFD')),`${group.id}/${entry.id}: valid text`);
   assert(html.includes(`id="${entry.id}"`),`${group.id}/${entry.id}: published account`);
   for(const name of entry.photos){const im=archiveImages[name];assert(im,`${name}: image provenance`);assert(html.includes(`href="${im.src}"`),`${name}: full-size photograph available`);}
  }
 }
}
console.log(`Verified ${archive.length} archive collections, ${archive.reduce((n,g)=>n+g.entries.length,0)} detailed accounts and ${Object.keys(archiveImages).length} source photographs.`);

const favicon=await readFile(new URL('favicon.png',root));
assert.equal(favicon.subarray(1,4).toString(),'PNG');
assert.equal(favicon.readUInt32BE(16),96);assert.equal(favicon.readUInt32BE(20),96);
const manifest=JSON.parse(await read('site.webmanifest'));
for(const icon of manifest.icons)await access(new URL(icon.src.slice(1),root));
console.log('Verified square Google-compatible favicon and app icons.');

for(const lang of Object.keys(content)){
 const directory=routes.get(urlFor(lang,'work'));
 for(const category of workCategories){
  assert(directory.includes(`href="${urlFor(lang,'work/'+category.id)}"`),'Work category linked');
  const page=routes.get(urlFor(lang,'work/'+category.id));
  for(const event of categoryEvents(category))assert(page.includes(`id="${event.key}"`),'Every category record published');
  assert.equal((page.match(/data-photo-dialog/g)||[]).length,1,'One gallery dialog per category');
 }
}
console.log(`Verified all ${workCategories.length} work categories, event records and galleries.`);

assert.equal(new Set(workCategories.map(c=>c.id)).size,workCategories.length,'Unique category routes');
for(const category of workCategories){
 const events=categoryEvents(category);
 assert.equal(new Set(events.map(e=>e.key)).size,events.length,'No duplicate records within category');
 for(const event of events)if(event.sourceUrl){
  assert.equal(new URL(event.sourceUrl).protocol,'https:','Public evidence URL');
  for(const lang of Object.keys(content)){
   const html=routes.get(urlFor(lang,'work/'+category.id));
   assert(html.includes(event.sourceUrl),'Visible public source link');
   if(event.recordType)assert(html.includes('work-record-type'),'Proposal/announcement clearly labelled');
  }
 }
}
