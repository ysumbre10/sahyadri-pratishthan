import {content,links} from './content.mjs';
import {pageDefinitions,pageText,urlFor} from './pages.mjs';

export const siteOrigin='https://sahyadripratishthan.com';
const locales={mr:'mr_IN',hi:'hi_IN',en:'en_IN'};
export const escapeMarkup=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function searchMetadata({lang,slug,pageTitle,pageDescription}){
 const url=siteOrigin+urlFor(lang,slug);
 const image=siteOrigin+'/assets/'+(slug==='founder'?'presentation/speech.webp':'lohagad.webp');
 const organization={'@type':'Organization','@id':siteOrigin+'/#organization',name:'Sahyadri Pratishthan',alternateName:['सह्याद्री प्रतिष्ठान','Sahyadri Pratishthan Hindusthan','सह्याद्री प्रतिष्ठान हिंदुस्थान'],url:siteOrigin+'/',logo:siteOrigin+'/assets/sp_logo_reg_no.webp',sameAs:Object.values(links)};
 const website={'@type':'WebSite','@id':siteOrigin+'/#website',url:siteOrigin+'/',name:'Sahyadri Pratishthan',alternateName:['सह्याद्री प्रतिष्ठान','Sahyadri Pratishthan Hindusthan'],inLanguage:Object.keys(content),publisher:{'@id':organization['@id']}};
 const page={'@type':slug==='about'?'AboutPage':slug==='work'||slug==='journey'||slug==='stories'||slug.startsWith('archive/')?'CollectionPage':'WebPage','@id':url+'#webpage',url,name:pageTitle,description:pageDescription,inLanguage:lang,isPartOf:{'@id':website['@id']},about:{'@id':organization['@id']},primaryImageOfPage:{'@type':'ImageObject',url:image}};
 const graph=[organization,website,page];
 // Match the visible breadcrumb trail; the founder page has a custom hero.
 if(slug&&slug!=='founder'){
  const breadcrumb={'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:pageText[lang].home,item:siteOrigin+urlFor(lang)},{'@type':'ListItem',position:2,name:pageText[lang][slug][0],item:url}]};
  graph.push(breadcrumb);page.breadcrumb={'@id':breadcrumb['@id']};
 }
 const meta=(attribute,key,value)=>`<meta ${attribute}="${key}" content="${escapeMarkup(value)}">`;
 return meta('name','robots','index, follow, max-image-preview:large')+
  meta('property','og:site_name',content[lang].name)+meta('property','og:locale',locales[lang])+
  Object.keys(content).filter(l=>l!==lang).map(l=>meta('property','og:locale:alternate',locales[l])).join('')+
  meta('property','og:image:alt',slug==='founder'?pageText[lang].founder[0]:({mr:'लोहगड किल्ला, महाराष्ट्र',hi:'लोहगढ़ किला, महाराष्ट्र',en:'Lohagad Fort, Maharashtra'}[lang]))+
  meta('name','twitter:card','summary_large_image')+meta('name','twitter:title',pageTitle)+meta('name','twitter:description',pageDescription)+meta('name','twitter:image',image)+
  `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')}</script>`;
}

export function sitemapXml(){
 const languages=Object.keys(content);
 const entries=languages.flatMap(lang=>pageDefinitions.map(({slug})=>{
  const alternates=[...languages.map(l=>[l,urlFor(l,slug)]),['x-default',urlFor('mr',slug)]];
  return `<url><loc>${escapeMarkup(siteOrigin+urlFor(lang,slug))}</loc>${alternates.map(([language,path])=>`<xhtml:link rel="alternate" hreflang="${language}" href="${escapeMarkup(siteOrigin+path)}"/>`).join('')}</url>`;
 }));
 return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`;
}
