import {readFileSync} from 'node:fs';
const catalog=JSON.parse(readFileSync(new URL('./archive-catalog.json',import.meta.url),'utf8'));
// Add a page here, supply translated metadata, and compose its section names.
// The builder generates the route in all three languages automatically.
export const pageDefinitions=[
 {slug:'',sections:['heritageHero','inspiration','fieldStories','featuredProjects','research','videoJournal','fortCare','join','historicSocials']},
 {slug:'about',sections:['founderFeature','about','movementJourney','inspiration','fortCare','videoJournal','historicSocials']},
 {slug:'work',sections:['workArchiveDirectory','projectShowcase','join','historicSocials']},
 {slug:'stories',sections:['activityArchiveDirectory','stories','videoJournal','historicSocials']},
 {slug:'founder',sections:['founderHero','founderJourney','founderDetailedWork','founderRecords','founderCommunity','founderClosing']},
 {slug:'journey',sections:['archiveDirectory','journeyArchive','founderRecords','founderClosing']},
 {slug:'documents',sections:['documents','historicSocials']},
 {slug:'join',sections:['registrationChoices','registration','idCard','campaign','faq','historicSocials']}
];
export const urlFor=(lang,slug='')=>`${lang==='mr'?'/':`/${lang}/`}${slug?slug+'/':''}`;
export const pageText={
 mr:{founder:['श्रमिक गोजमगुंडे','सह्याद्री प्रतिष्ठानचे संस्थापक अध्यक्ष आणि दुर्गसंवर्धनासाठी त्यांचा प्रवास.'],journey:['दुर्गसेवेचा कार्यप्रवास','दुर्गसंवर्धन, जनजागृती आणि समाजसेवा : संस्थेच्या संग्रहातील नोंदी.'],home:'मुख्यपृष्ठ',more:'अधिक जाणून घ्या',overview:'सह्याद्रीशी नाते जोडा.',about:['आमच्याविषयी','गड-किल्ल्यांच्या जतनासाठी एकत्र आलेल्या दुर्गसेवकांची चळवळ.'],work:['आमचे कार्य','दुर्गसंवर्धन, श्रमदान आणि इतिहासाच्या जागरासाठी आमचे प्रयत्न.'],stories:['कार्याच्या नोंदी','गड-किल्ल्यांवरील उपक्रम आणि मोहिमांच्या प्रकाशित नोंदी.'],documents:['अधिकृत कागदपत्रे','संस्थेची नोंदणी प्रमाणपत्रे आणि अधिकृत कागदपत्रे येथे वाचा.'],join:['सहभागी व्हा','आपला वेळ आणि कौशल्य दुर्गसंवर्धनाच्या कार्याला द्या.']},
 hi:{founder:['श्रमिक गोजमगुंडे','सह्याद्री प्रतिष्ठान के संस्थापक अध्यक्ष और दुर्ग संरक्षण की उनकी यात्रा।'],journey:['दुर्गसेवा की यात्रा','दुर्ग संरक्षण, जनजागृति और समाजसेवा : संस्था के संग्रह से।'],home:'मुख्य पृष्ठ',more:'और जानें',overview:'सह्याद्री से जुड़ें.',about:['हमारे बारे में','किलों की विरासत को सँजोने के लिए एकजुट दुर्गसेवकों का अभियान।'],work:['हमारा कार्य','दुर्ग संरक्षण, श्रमदान और इतिहास के प्रति जागरूकता के हमारे प्रयास।'],stories:['कार्य की झलकियाँ','किलों पर हुए कार्यक्रमों और अभियानों की प्रकाशित रिपोर्ट।'],documents:['आधिकारिक दस्तावेज़','संस्था के पंजीकरण प्रमाणपत्र और आधिकारिक दस्तावेज़ यहाँ पढ़ें।'],join:['अभियान से जुड़ें','अपना समय और कौशल किलों के संरक्षण के कार्य में लगाएँ।']},
 en:{founder:['Shramik Gojamgunde','Meet the founder of Sahyadri Pratishthan through his work in fort conservation, photography and public education.'],journey:['A journey of service','Fort conservation, public education and community service from the organisation’s historical archive.'],home:'Home',more:'Explore this section',overview:'Find your connection to the Sahyadris.',about:['Our story','Meet the movement of volunteers working to preserve our shared heritage.'],work:['Our work','Fort conservation, volunteer service and the work of keeping history alive.'],stories:['Field notes','Published accounts of programmes and conservation visits across the forts.'],documents:['Official documents','Read the organisation’s registration certificates and official records.'],join:['Join the movement','Bring your time and skills to the care of our forts.']}
};
for(const group of catalog){pageDefinitions.push({slug:'archive/'+group.id,sections:['archive_'+group.id]});for(const lang of ['mr','hi','en'])pageText[lang]['archive/'+group.id]=[group.title[lang],group.intro[lang]];}
export function pageIntro(lang,slug){const text=pageText[lang];const [title,description]=text[slug];return `<section class="page-intro"><div class="container"><nav class="breadcrumbs" aria-label="${text.home}"><a href="${urlFor(lang)}">${text.home}</a><span aria-hidden="true">/</span><span aria-current="page">${title}</span></nav><h1>${title}</h1><p>${description}</p></div></section>`;}
export function overview(lang){const text=pageText[lang];return `<section class="section container overview"><h2>${text.overview}</h2><div class="overview-links">${['about','stories','documents'].map(slug=>`<a href="${urlFor(lang,slug)}"><h3>${text[slug][0]} <span aria-hidden="true">↗</span></h3><p>${text[slug][1]}</p></a>`).join('')}</div></section>`;}
