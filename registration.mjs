// Keep the public form destination in one place; no personal data is collected here.
export const registrationFormUrl = 'https://forms.gle/gk9JPfDmG1Z9tQjx9';
const copy = {
 mr: {
  title:'दुर्गसेवक म्हणून नोंदणी करा', intro:'गड-किल्ल्यांच्या जतनासाठी एक पाऊल पुढे. सह्याद्री प्रतिष्ठानच्या कार्यात सहभागी होण्यासाठी नोंदणी अर्ज भरा.',
  form:'नोंदणी अर्ज भरा', external:'Google Form नवीन टॅबमध्ये उघडेल.',
  steps:[['आपली माहिती भरा','नोंदणी अर्जात विचारलेली माहिती अचूक भरा आणि अर्ज सबमिट करा.'],['नोंदणीची नोंद','सबमिट केल्यानंतर Google Form वरील पुष्टीकरण तपासा.'],['आपले ओळखपत्र','खाली आपली नोंदणी शोधा, फोटो निवडा आणि ओळखपत्र डाउनलोड करा.']],
  card:'दुर्गसेवक ओळखपत्र', soon:'लवकरच उपलब्ध', pending:'ओळखपत्राची सुविधा तयार होत आहे', note:'अंतिम ओळखपत्राचा नमुना निश्चित झाल्यावर येथे फोटो निवडून ओळखपत्र डाउनलोड करता येईल.',
  privacy:'तुमचा फोटो, तुमच्याच डिव्हाइसवर', privacyText:'ओळखपत्रासाठी निवडलेला फोटो फक्त तुमच्या ब्राउझरमध्ये वापरण्याची व्यवस्था असेल. तो आमच्या सर्व्हरवर किंवा नोंदणीच्या मास्टर शीटमध्ये जतन केला जाणार नाही.',
  details:'नोंदणीपूर्वी जाणून घ्या', detailText:'नोंदणीची माहिती Google Form द्वारे पाठवली जाते. अर्ज सबमिट केल्यानंतर खाली मोबाइल क्रमांक आणि जन्मतारखेने आपली नोंदणी शोधा. माहिती दुरुस्त करण्यासाठी संस्थेशी संपर्क साधा.', cta:'दुर्गसेवक नोंदणी', teaser:'नोंदणी करा किंवा आपले ओळखपत्र तयार करा.'
 },
 hi: {
  title:'दुर्गसेवक के रूप में पंजीकरण करें', intro:'किलों की विरासत सँजोने के लिए एक कदम आगे। सह्याद्री प्रतिष्ठान के कार्य में भाग लेने के लिए पंजीकरण फ़ॉर्म भरें।',
  form:'पंजीकरण फ़ॉर्म भरें', external:'Google Form नए टैब में खुलेगा।',
  steps:[['अपनी जानकारी भरें','पंजीकरण फ़ॉर्म में माँगी गई जानकारी सही भरें और फ़ॉर्म सबमिट करें।'],['पंजीकरण की पुष्टि','सबमिट करने के बाद Google Form पर पुष्टि संदेश देखें।'],['आपका पहचान पत्र','नीचे पंजीकरण खोजें, फ़ोटो चुनें और कार्ड डाउनलोड करें।']],
  card:'दुर्गसेवक पहचान पत्र', soon:'जल्द उपलब्ध', pending:'पहचान पत्र की सुविधा तैयार हो रही है', note:'पहचान पत्र का अंतिम डिज़ाइन तय होने पर यहाँ फ़ोटो चुनकर अपना कार्ड डाउनलोड कर सकेंगे।',
  privacy:'आपका फ़ोटो, आपके डिवाइस पर', privacyText:'पहचान पत्र के लिए चुने गए फ़ोटो का उपयोग केवल आपके ब्राउज़र में करने की व्यवस्था होगी। उसे हमारे सर्वर या पंजीकरण की मास्टर शीट में सहेजा नहीं जाएगा।',
  details:'पंजीकरण से पहले जानें', detailText:'पंजीकरण की जानकारी Google Form के माध्यम से भेजी जाती है। फ़ॉर्म सबमिट करने के बाद नीचे मोबाइल नंबर और जन्मतिथि से अपना पंजीकरण खोजें। सुधार के लिए संस्था से संपर्क करें।', cta:'दुर्गसेवक पंजीकरण', teaser:'पंजीकरण करें या अपना पहचान पत्र बनाएँ।'
 },
 en: {
  title:'Register as a Durgsevak', intro:'Take a step towards preserving our forts. Fill in the registration form to take part in the work of Sahyadri Pratishthan.',
  form:'Open registration form', external:'Opens Google Forms in a new tab.',
  steps:[['Fill in your details','Complete the information requested in the registration form and submit it.'],['Check your submission','Look for the confirmation message in Google Forms after submitting.'],['Your member ID card','Find your registration below, choose a photo and download your card.']],
  card:'Durgsevak identity card', soon:'Coming soon', pending:'Your ID card experience is taking shape', note:'Once the final card design is ready, you will be able to select a photo here and download your card.',
  privacy:'Your photo stays on your device', privacyText:'The ID card tool will use your selected photo only in your browser. It will not save the photo to our servers or the registration master sheet.',
  details:'Before you register', detailText:'Registration details are submitted through Google Forms. After submitting, find your registration below using your mobile number and date of birth. Contact the organisation if your details need correction.', cta:'Durgsevak registration', teaser:'Register or create your member ID card.'
 }
};
export function registrationSection(lang){
 const t=copy[lang];
 const existing={mr:'आधीच नोंदणी केली आहे?',hi:'पहले से पंजीकृत हैं?',en:'Already registered?'}[lang];
 const create={mr:'आपले ओळखपत्र तयार करा',hi:'अपना कार्ड बनाएँ',en:'Create your ID card'}[lang];
 return `<section id="registration" class="registration-section section" aria-labelledby="registration-title"><div class="container"><div class="registration-grid"><div class="registration-copy"><h2 id="registration-title">${t.title}</h2><p class="registration-intro">${t.intro}</p><a class="button registration-button" href="${registrationFormUrl}" target="_blank" rel="noopener noreferrer" aria-describedby="registration-external">${t.form}</a><p id="registration-external" class="registration-external">${t.external}</p><div class="registration-existing"><p>${existing}</p><a href="#id-card">${create}</a></div></div><ol class="registration-steps">${t.steps.map(([title,description],i)=>`<li><span class="registration-step-number" aria-hidden="true">${new Intl.NumberFormat(lang).format(i+1)}</span><div><h3>${title}</h3><p>${description}</p></div></li>`).join('')}</ol></div><details class="registration-details"><summary>${t.details}</summary><p>${t.detailText}</p></details></div></section>`;
}
export function registrationLink(lang){const t=copy[lang];return `<div class="registration-invite"><h3>${t.cta}</h3><p>${t.teaser}</p><a class="button registration-button" href="${lang==='mr'?'':`/${lang}`}/join/#registration">${t.form}</a></div>`;}
