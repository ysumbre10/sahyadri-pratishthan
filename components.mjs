import {forts,renderFortDirectory,renderFortPage} from './fort-pages.mjs';
import {guideDefinitions,renderGuide} from './conservation-guides.mjs';
import {archiveCatalog,archiveCollection,archiveDirectory,founderDetailedWork} from './archive.mjs';
import {founderFeature,founderHero,founderJourney,founderRecords,founderCommunity,founderClosing} from './founder.mjs';
import {movementJourney,journeyArchive} from './journey.mjs';
import {idCardSection} from './id-card.mjs';
import {registrationSection,registrationLink,registrationChoices} from './registration.mjs';
import {heritageHero,inspiration,fieldStories,research,fortCare} from './heritage.mjs';
import {historicSocials,videoJournal} from './media.mjs';
import {featuredProjects,projectShowcase} from './projects.mjs';
import {links,sources} from './content.mjs';
import {documentSection} from './documents.mjs';
const ext='target="_blank" rel="noopener noreferrer"';
const arrow='<span aria-hidden="true">↗</span>';
const icons=[`<path d="M3 21V7h4v4h4V7h4v4h4V7h3v14M3 17h19M10 21v-4h5v4M12 7V2l6 2-6 2"/>`,`<path d="m5 20 6-9m-3 5 7 5 5-7-8-5-4 7ZM13 9l4-7M3 3l1 3 3 1-3 1-1 3-1-3-2-1 2-1Z"/>`,`<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13ZM9 16c0 2 1 3 3 3"/>`,`<path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-4-2-7-1-10 1Zm0 0v15"/>`];
const icon=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[i]}</svg>`;

export function sections(lang,t){return {
 fortDirectory:()=>renderFortDirectory(lang),
 ...Object.fromEntries(forts.map(f=>['fort_'+f.id,()=>renderFortPage(lang,f.id)])),
 ...Object.fromEntries(guideDefinitions.map(({slug})=>['guide_'+slug,()=>renderGuide(lang,slug)])),
  ...Object.fromEntries(archiveCatalog.map(g=>['archive_'+g.id,()=>archiveCollection(lang,g.id)])),
  archiveDirectory:()=>archiveDirectory(lang),
  workArchiveDirectory:()=>archiveDirectory(lang,'work'),
  activityArchiveDirectory:()=>archiveDirectory(lang,'activities'),
  founderDetailedWork:()=>founderDetailedWork(lang),
  founderFeature:()=>founderFeature(lang),
  founderHero:()=>founderHero(lang),
  founderJourney:()=>founderJourney(lang),
  founderRecords:()=>founderRecords(lang),
  founderCommunity:()=>founderCommunity(lang),
  founderClosing:()=>founderClosing(lang),
  movementJourney:()=>movementJourney(lang),
  journeyArchive:()=>journeyArchive(lang),

  campaign:()=>`<section class="campaign-section" aria-labelledby="campaign-title"><div class="container campaign-grid"><div class="campaign-copy"><h2 id="campaign-title">${{mr:'पुढच्या मोहिमेत सहभागी व्हा',hi:'अगले अभियान में शामिल हों',en:'See you at the next fort.'}[lang]}</h2><p>${t.joinText}</p><a class="button" href="${links.whatsapp}" ${ext}>${t.joinCta}</a></div><ol class="campaign-steps">${t.steps.map(([h,p],i)=>`<li><span aria-hidden="true">${new Intl.NumberFormat(lang).format(i+1)}</span><div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}</ol></div></section>`,
  idCard:()=>idCardSection(lang),
  registrationChoices:()=>registrationChoices(lang),
  registration:()=>registrationSection(lang),
  heritageHero:()=>heritageHero(lang),
  inspiration:()=>inspiration(lang),
  fieldStories:()=>fieldStories(lang),
  research:()=>research(lang),
  fortCare:()=>fortCare(lang),
  historicSocials:()=>historicSocials(lang),
  videoJournal:()=>videoJournal(lang),
  featuredProjects: () => featuredProjects(lang),
  projectShowcase: () => projectShowcase(lang),
  about: () => `<section id="about" class="section container about"><div class="about-photo"><img src="/assets/raigad.webp" alt="${lang==='en'?'Raigad Fort':lang==='hi'?'रायगढ़ किला':'किल्ले रायगड'}" width="1280" height="851" loading="lazy"><div class="photo-quote">${t.quote}</div></div><div class="about-copy"><p class="eyebrow">${t.aboutLabel}</p><h2>${t.aboutTitle}</h2><p>${t.about}</p><p>${t.about2}</p><a class="text-link" href="${links.youtube}" ${ext}>${t.aboutLink} ${arrow}</a></div></section>`,
  stories: () => `<section id="stories" class="section container"><div class="section-heading"><div><p class="eyebrow">${t.archiveLabel}</p><h2>${t.archiveTitle}</h2></div><p>${t.archiveIntro}</p></div><div class="filters" role="group" aria-label="${t.archiveLabel}" hidden>${t.filters.map((n,i)=>`<button data-filter="${i}" aria-pressed="${i===0}">${n}</button>`).join('')}</div><div class="story-grid">${t.stories.map(([place,title,date,desc],i)=>`<article class="story" data-category="${i===2?2:1}"><div class="story-top"><span class="fort-name">${place}</span>${icon(i===2?3:0)}</div><div class="story-body"><p class="story-date">${date}</p><h3>${title}</h3><p>${desc}</p><a class="text-link" href="${Object.values(sources)[i]}" ${ext}>${t.read} ${arrow}</a></div></article>`).join('')}</div></section>`,
  join: () => `<section id="join" class="section container join-section"><div><p class="eyebrow">${t.joinLabel}</p><h2>${t.joinTitle}</h2><p>${t.joinText}</p><a class="button" href="${links.whatsapp}" ${ext}>${t.joinCta} ${arrow}</a>${registrationLink(lang)}</div><ol class="join-steps">${t.steps.map(([h,p],i)=>`<li><span>${new Intl.NumberFormat(lang).format(i+1)}</span><div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}</ol></section>`,
  faq: () => `<section class="faq-section"><div class="container faq-grid"><h2>${t.faqTitle}</h2><div>${t.faq.map(([q,a])=>`<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`).join('')}</div></div></section>`,
  documents: () => documentSection(lang),
};}
