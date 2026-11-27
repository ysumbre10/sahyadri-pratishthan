import {idCardSection} from './id-card.mjs';
import {registrationSection,registrationLink,registrationChoices} from './registration.mjs';
import {heritageHero,inspiration,fieldStories,research,fortCare} from './heritage.mjs';
import {historicSocials,videoJournal} from './media.mjs';
import {featuredProjects,projectShowcase} from './projects.mjs';
import {links,sources} from './content.mjs';
import {documentSection,documentText} from './documents.mjs';
const ext='target="_blank" rel="noopener noreferrer"';
const arrow='<span aria-hidden="true">↗</span>';
const icons=[`<path d="M3 21V7h4v4h4V7h4v4h4V7h3v14M3 17h19M10 21v-4h5v4M12 7V2l6 2-6 2"/>`,`<path d="m5 20 6-9m-3 5 7 5 5-7-8-5-4 7ZM13 9l4-7M3 3l1 3 3 1-3 1-1 3-1-3-2-1 2-1Z"/>`,`<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13ZM9 16c0 2 1 3 3 3"/>`,`<path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-4-2-7-1-10 1Zm0 0v15"/>`];
const icon=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[i]}</svg>`;
const logo=t=>`<span class="logo-art"><img src="/assets/sp_logo_reg_no.webp" alt="${t.name}" width="3264" height="3264"></span>`;

export function sections(lang,t){return {
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
  hero: () => `<section class="hero" aria-labelledby="hero-title"><img class="hero-photo" src="/assets/lohagad.webp" alt="${t.location}" width="1280" height="853" fetchpriority="high"><div class="hero-shade"></div><div class="container hero-content"><p class="hero-label"><span aria-hidden="true">⚑</span> ${t.heroLabel}</p><h1 id="hero-title">${t.hero}</h1><p class="hero-intro">${t.intro}</p><div class="hero-actions"><a class="button" href="#work">${t.explore} <span aria-hidden="true">↓</span></a><a class="watch-link" href="#film"><span class="play" aria-hidden="true">▶</span>${t.film}</a></div></div><div class="hero-bottom container"><span class="hero-caption">${t.location}<small>${t.imageNote}</small></span><a href="#about" class="scroll-cue" aria-label="${t.nav[0]}">↓</a></div></section>`,
  about: () => `<section id="about" class="section container about"><div class="about-photo"><img src="/assets/raigad.webp" alt="${lang==='en'?'Raigad Fort':lang==='hi'?'रायगढ़ किला':'किल्ले रायगड'}" width="1280" height="851" loading="lazy"><div class="photo-quote">${t.quote}</div></div><div class="about-copy"><p class="eyebrow">${t.aboutLabel}</p><h2>${t.aboutTitle}</h2><p>${t.about}</p><p>${t.about2}</p><a class="text-link" href="${links.youtube}" ${ext}>${t.aboutLink} ${arrow}</a></div></section>`,
  work: () => `<section id="work" class="work-section section"><div class="container"><div class="section-heading"><div><p class="eyebrow">${t.workLabel}</p><h2>${t.workTitle}</h2></div><p>${t.workIntro}</p></div><div class="work-grid">${t.work.map(([h,p],i)=>`<article class="work-item">${icon(i)}<h3>${h}</h3><p>${p}</p></article>`).join('')}</div></div></section>`,
  stories: () => `<section id="stories" class="section container"><div class="section-heading"><div><p class="eyebrow">${t.archiveLabel}</p><h2>${t.archiveTitle}</h2></div><p>${t.archiveIntro}</p></div><div class="filters" role="group" aria-label="${t.archiveLabel}" hidden>${t.filters.map((n,i)=>`<button data-filter="${i}" aria-pressed="${i===0}">${n}</button>`).join('')}</div><div class="story-grid">${t.stories.map(([place,title,date,desc],i)=>`<article class="story" data-category="${i===2?2:1}"><div class="story-top"><span class="fort-name">${place}</span>${icon(i===2?3:0)}</div><div class="story-body"><p class="story-date">${date}</p><h3>${title}</h3><p>${desc}</p><a class="text-link" href="${Object.values(sources)[i]}" ${ext}>${t.read} ${arrow}</a></div></article>`).join('')}</div></section>`,
  film: () => `<section id="film" class="film-section"><div class="container film-grid"><a class="film-poster" href="https://www.youtube.com/watch?v=TvDfkTxJqw4" ${ext} aria-label="${t.videoCta}"><img src="/assets/film.webp" alt="${t.videoCaption}" width="480" height="360" loading="lazy"><span class="big-play" aria-hidden="true">▶</span><span class="film-caption">${t.videoCaption}</span></a><div><p class="eyebrow">${t.videoLabel}</p><h2>${t.videoTitle}</h2><p>${t.videoText}</p><a class="text-link" href="https://www.youtube.com/watch?v=TvDfkTxJqw4" ${ext}>${t.videoCta} ${arrow}</a></div></div></section>`,
  join: () => `<section id="join" class="section container join-section"><div><p class="eyebrow">${t.joinLabel}</p><h2>${t.joinTitle}</h2><p>${t.joinText}</p><a class="button" href="${links.whatsapp}" ${ext}>${t.joinCta} ${arrow}</a>${registrationLink(lang)}</div><ol class="join-steps">${t.steps.map(([h,p],i)=>`<li><span>${new Intl.NumberFormat(lang).format(i+1)}</span><div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}</ol></section>`,
  faq: () => `<section class="faq-section"><div class="container faq-grid"><h2>${t.faqTitle}</h2><div>${t.faq.map(([q,a])=>`<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`).join('')}</div></div></section>`,
  connect: () => `<section class="connect container"><div><h2>${t.connect}</h2><p>${t.connectText}</p></div><div class="socials">${Object.entries(links).map(([k,url])=>`<a href="${url}" ${ext}>${{instagram:'Instagram',youtube:'YouTube',whatsapp:'WhatsApp',facebook:'Facebook'}[k]} ${arrow}</a>`).join('')}</div></section>`,
  mission: () => `<div class="mission-strip"><div class="container">${t.strip.map((x,i)=>`<span>${icon([0,1,3][i])}${x}</span>`).join('')}</div></div>`,
  documents: () => documentSection(lang),
};}
