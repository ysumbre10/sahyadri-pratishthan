import {workCategoryDefinitions,workCategoryText} from './work-categories.mjs';
import {fortPageDefinitions,fortPageText} from './fort-pages.mjs';
import {guideDefinitions,guidePageText} from './conservation-guides.mjs';
import {readFileSync} from 'node:fs';
const catalog=JSON.parse(readFileSync(new URL('./archive-catalog.json',import.meta.url),'utf8'));
// Add a page here, supply translated metadata, and compose its section names.
// The builder generates the route in all three languages automatically.
export const pageDefinitions=[
 {slug:'',sections:['heritageHero','inspiration','fieldStories','featuredProjects','research','videoJournal','fortCare','join','historicSocials']},
 {slug:'about',sections:['founderFeature','about','movementJourney','inspiration','fortCare','videoJournal','historicSocials']},
 {slug:'work',sections:['workDirectory','join','historicSocials']},
 {slug:'work/collections',sections:['projectShowcase']},
 {slug:'stories',sections:['activityArchiveDirectory','stories','videoJournal','historicSocials']},
 {slug:'founder',sections:['founderHero','founderJourney','founderDetailedWork','founderRecords','founderCommunity','founderClosing']},
 {slug:'journey',sections:['archiveDirectory','journeyArchive','founderRecords','founderClosing']},
 {slug:'documents',sections:['documents','historicSocials']},
 {slug:'join',sections:['registrationChoices','registration','idCard','campaign','faq','historicSocials']}
];
export const urlFor=(lang,slug='')=>`${lang==='mr'?'/':`/${lang}/`}${slug?slug+'/':''}`;
export const pageText={
 mr:{
  home:'मुख्यपृष्ठ',more:'अधिक जाणून घ्या',overview:'सह्याद्रीशी नाते जोडा.',
  founder:['डॉ. श्रमिक गोजमगुंडे','सह्याद्री प्रतिष्ठानचे संस्थापक अध्यक्ष डॉ. श्रमिक गोजमगुंडे यांचा दुर्गसंवर्धन, छायाचित्रण आणि इतिहासाच्या जनजागृतीतील कार्यप्रवास जाणून घ्या.'],
  journey:['दुर्गसेवेचा कार्यप्रवास','सह्याद्री प्रतिष्ठानचा दुर्गसंवर्धन, जनजागृती आणि समाजसेवेचा प्रवास पाहा. संस्थेच्या संग्रहातील मोहिमा, छायाचित्रे आणि कार्याच्या नोंदी वाचा.'],
  about:['दुर्गसंवर्धनाची आमची चळवळ','महाराष्ट्रातील गड-किल्ल्यांचे जतन करणाऱ्या सह्याद्री प्रतिष्ठानची ओळख. दुर्गसेवकांचे श्रमदान, इतिहासाचा जागर आणि संस्थेचा कार्यप्रवास जाणून घ्या.'],
  work:['गड-किल्ल्यांवरील संवर्धन कार्य','सह्याद्री प्रतिष्ठानच्या गड-किल्ल्यांवरील दुर्गसंवर्धन मोहिमा पाहा. महादरवाजे, तोफा, पाण्याच्या टाक्या आणि श्रमदानाच्या कार्याचे छायाचित्र संग्रह.'],
  stories:['दुर्गसंवर्धन मोहिमांच्या नोंदी','सह्याद्री प्रतिष्ठानच्या गड-किल्ल्यांवरील उपक्रम, अभ्यासभेटी आणि मोहिमांच्या प्रकाशित नोंदी वाचा. मूळ वृत्तस्रोत आणि कार्याच्या संग्रहाशी जोडले जा.'],
  documents:['अधिकृत कागदपत्रे','सह्याद्री प्रतिष्ठानची नोंदणी प्रमाणपत्रे आणि अधिकृत कागदपत्रे येथे वाचा. संस्थेच्या उपलब्ध मूळ नोंदींच्या प्रतिमा एकाच ठिकाणी पाहा.'],
  join:['दुर्गसंवर्धनात सहभागी व्हा','सह्याद्री प्रतिष्ठानच्या दुर्गसंवर्धन कार्यात सहभागी व्हा. सभासद नोंदणी, मोहिमांची माहिती आणि स्वयंसेवक म्हणून आपला वेळ व कौशल्य देण्याचे मार्ग जाणून घ्या.']
 },
 hi:{
  home:'मुख्य पृष्ठ',more:'और जानें',overview:'सह्याद्री से जुड़ें.',
  founder:['डॉ. श्रमिक गोजमगुंडे','सह्याद्री प्रतिष्ठान के संस्थापक अध्यक्ष डॉ. श्रमिक गोजमगुंडे की दुर्ग संरक्षण, फोटोग्राफी और इतिहास के प्रति जनजागृति की यात्रा जानें।'],
  journey:['दुर्गसेवा की यात्रा','सह्याद्री प्रतिष्ठान की दुर्ग संरक्षण, जनजागृति और समाजसेवा की यात्रा देखें। संस्था के संग्रह से अभियानों, तस्वीरों और कार्य के विवरण पढ़ें।'],
  about:['दुर्ग संरक्षण का हमारा अभियान','महाराष्ट्र के किलों की विरासत सँजोने वाले सह्याद्री प्रतिष्ठान को जानें। दुर्गसेवकों के श्रमदान, इतिहास के प्रति जागरूकता और संस्था की यात्रा के बारे में पढ़ें।'],
  work:['किलों पर संरक्षण कार्य','सह्याद्री प्रतिष्ठान के दुर्ग संरक्षण अभियानों को तस्वीरों में देखें। किलों के प्रवेशद्वार, तोपें, जलकुंड और स्वयंसेवकों के श्रमदान के संग्रह।'],
  stories:['दुर्ग संरक्षण अभियानों के विवरण','सह्याद्री प्रतिष्ठान के किलों पर हुए कार्यक्रमों, अध्ययन यात्राओं और अभियानों की प्रकाशित रिपोर्ट पढ़ें। मूल समाचार स्रोत और कार्य के संग्रह देखें।'],
  documents:['आधिकारिक दस्तावेज़','सह्याद्री प्रतिष्ठान के पंजीकरण प्रमाणपत्र और आधिकारिक दस्तावेज़ यहाँ पढ़ें। संस्था के उपलब्ध मूल अभिलेखों की छवियाँ एक ही स्थान पर देखें।'],
  join:['दुर्ग संरक्षण से जुड़ें','सह्याद्री प्रतिष्ठान के दुर्ग संरक्षण कार्य में भाग लें। सदस्य पंजीकरण, अभियानों की जानकारी और स्वयंसेवक के रूप में अपना समय व कौशल देने के तरीके जानें।']
 },
 en:{
  home:'Home',more:'Explore this section',overview:'Find your connection to the Sahyadris.',
  founder:['Dr. Shramik Gojamgunde','Meet Dr. Shramik Gojamgunde, founder of Sahyadri Pratishthan, through his work in fort conservation, photography and public education.'],
  journey:['Our fort conservation journey','Trace Sahyadri Pratishthan’s fort conservation, education and community service through campaign records and photographs from the organisation’s archive.'],
  about:['Our fort conservation movement','Meet Sahyadri Pratishthan, a volunteer movement caring for Maharashtra’s forts through conservation, clean-ups and heritage awareness. Explore our journey.'],
  work:['Fort conservation projects','See Sahyadri Pratishthan’s conservation work at Maharashtra’s forts: gateways, cannons, water tanks and volunteer campaigns, documented in photographs.'],
  stories:['Fort conservation field notes','Read published accounts of Sahyadri Pratishthan’s fort conservation campaigns, study visits and programmes, with links to original news reports.'],
  documents:['Official documents','Read Sahyadri Pratishthan’s registration certificates and official documents. View images of the organisation’s available original records in one place.'],
  join:['Volunteer for fort conservation','Join Sahyadri Pratishthan’s fort conservation movement. Find membership registration, campaign information and ways to volunteer your time and skills.']
 }
};
for(const group of catalog){pageDefinitions.push({slug:'archive/'+group.id,sections:['archive_'+group.id]});for(const lang of ['mr','hi','en'])pageText[lang]['archive/'+group.id]=[group.title[lang],group.intro[lang]];}
pageDefinitions.push(...guideDefinitions,...fortPageDefinitions,...workCategoryDefinitions);
for(const lang of ['mr','hi','en'])Object.assign(pageText[lang],guidePageText[lang],fortPageText[lang],workCategoryText[lang]);
for(const lang of ['mr','hi','en'])pageText[lang]['work/collections']={mr:['संपूर्ण छायाचित्र संग्रह','सह्याद्री प्रतिष्ठानच्या मूळ कार्यसंग्रहातील सर्व छायाचित्रे पाहा. गड-किल्ले, स्मारके आणि सामूहिक दुर्गसेवेचे क्षण.'],hi:['पूरा फोटो संग्रह','सह्याद्री प्रतिष्ठान के मूल कार्य संग्रह की सभी तस्वीरें देखें। किले, स्मारक और सामूहिक दुर्गसेवा के क्षण।'],en:['Complete project photograph collections','Browse the complete original project photo collections from Sahyadri Pratishthan: forts, memorials and moments of collective conservation work.']}[lang];
pageText.mr.work=['दुर्गसंवर्धन ते समाजसेवा','सह्याद्री प्रतिष्ठानचे कार्य विषयानुसार पाहा: गडाचे दरवाजे, तोफगाडे, मंदिर संवर्धन, पाण्याची टाकी स्वच्छता, इतिहास जागर आणि समाजसेवा.'];
pageText.hi.work=['दुर्ग संरक्षण से समाजसेवा तक','सह्याद्री प्रतिष्ठान का कार्य विषय के अनुसार देखें: प्रवेशद्वार, तोपगाड़ियाँ, मंदिर संरक्षण, जलकुंड सफाई, इतिहास जनजागृति और समाजसेवा।'];
pageText.en.work=['Our work: fort conservation & community service','Explore Sahyadri Pratishthan’s gateway, cannon, temple and water-tank work alongside history programmes, volunteer campaigns and community service.'];
export function pageIntro(lang,slug){const text=pageText[lang];const [title,description]=text[slug];return `<section class="page-intro"><div class="container"><nav class="breadcrumbs" aria-label="${text.home}"><a href="${urlFor(lang)}">${text.home}</a><span aria-hidden="true">/</span><span aria-current="page">${title}</span></nav><h1>${title}</h1><p>${description}</p></div></section>`;}
