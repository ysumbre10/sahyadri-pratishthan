/* Sahyadri ID service. No photos or public bulk-member endpoint. Email OTP protects corrections. */
const CONFIG = Object.freeze({spreadsheetId:'1ziNdRJ2-0WYWc7-T_c_wy6JzhskyOFg5IuvbFNZU1HE',formId:'1c79YLKRG45_LGSAy8IpWu1YZ9z0mWCu8s2UvgFjMK2w',owner:'info.sahyadripratishthan@gmail.com'});
function book_(){return SpreadsheetApp.openById(CONFIG.spreadsheetId);}
function clean_(v){return String(v==null?'':v).normalize('NFC').trim().replace(/\s+/g,' ');}
function digits_(v){return clean_(v).replace(/[०-९]/g,c=>'०१२३४५६७८९'.indexOf(c));}
function phone_(v){let s=digits_(v).replace(/[\s().-]/g,'');if(/^\+91[6-9]\d{9}$/.test(s))return s;if(/^91[6-9]\d{9}$/.test(s))return '+'+s;if(/^0[6-9]\d{9}$/.test(s))s=s.slice(1);if(/^[6-9]\d{9}$/.test(s))return '+91'+s;return /^\+230\d{8}$/.test(s)?s:'';}
function date_(v){if(Object.prototype.toString.call(v)==='[object Date]'&&!isNaN(v))return Utilities.formatDate(v,'Asia/Kolkata','yyyy-MM-dd');let s=digits_(v),m;if((m=/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(s)))s=m[1]+'-'+m[2]+'-'+m[3];else if((m=/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/.exec(s)))s=m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0');else return '';const d=new Date(s+'T00:00:00Z');return !isNaN(d)&&d.toISOString().slice(0,10)===s&&s>='1900-01-01'&&s<=Utilities.formatDate(new Date(),'Asia/Kolkata','yyyy-MM-dd')?s:'';}
function name_(v){return clean_(v).toLocaleLowerCase().replace(/[\u200b-\u200d]/g,'');}
function blood_(v){const s=clean_(v).toUpperCase().replace(/\s/g,'').replace(/POSITIVE|\+VE/g,'+').replace(/NEGATIVE|-VE|−/g,'-');return /^(A|B|AB|O)[+-]$/.test(s)?s:'';}
function safe_(v){const s=clean_(v);return /^[=+\-@]/.test(s)?"'"+s:s;}
function assertMaster_(sheet){const h=sheet.getRange(1,1,1,33).getDisplayValues()[0];if(h[0]!=='Registration numbers'||h[1]!=='Member ID'||h[24]!=='Identity review'||h[25]!=='Card data status')throw Error('Master schema changed; review configuration.');}
function owner_(){if(Session.getActiveUser().getEmail()!==CONFIG.owner)throw Error('Owner only');}
function sheet_(ss,name,headers){let s=ss.getSheetByName(name);if(!s){s=ss.insertSheet(name);s.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold').setBackground('#f36a16');s.setFrozenRows(1);}return s;}
function installWorkflow(){owner_();const ss=book_(),form=FormApp.openById(CONFIG.formId);assertMaster_(ss.getSheetByName('Master'));if(form.getDestinationId()!==CONFIG.spreadsheetId)throw Error('Form is not linked to master.');sheet_(ss,'Form processing',['Response ID','Processed at','Result','Member ID','Registration numbers','Reason']);sheet_(ss,'Incoming review',['Response ID','Received at','Full name','Mobile','DOB','Blood group','Reason','Review status']);const triggers=ScriptApp.getProjectTriggers();if(!triggers.some(t=>t.getHandlerFunction()==='onMemberSubmit_'))ScriptApp.newTrigger('onMemberSubmit_').forForm(form).onFormSubmit().create();if(!triggers.some(t=>t.getHandlerFunction()==='retrySubmissions_'))ScriptApp.newTrigger('retrySubmissions_').timeBased().everyHours(1).create();console.log('Installed form-submit and hourly recovery triggers; no existing members changed.');}
function doGet(){return ContentService.createTextOutput(JSON.stringify({service:'Sahyadri member lookup',version:2})).setMimeType(ContentService.MimeType.JSON);}
function doPost(e){let result={ok:false,code:'unavailable'};try{if(!e||!e.postData||e.postData.contents.length>10000)return json_({ok:false,code:'invalid'});const q=JSON.parse(e.postData.contents);const actions={contactLookup:contactLookup_,requestCode:requestCode_,verifyCode:verifyCode_,requestNewEmailCode:requestNewEmailCode_,saveProfile:saveProfile_};result=q.action?(Object.prototype.hasOwnProperty.call(actions,q.action)?actions[q.action](q):{ok:false,code:'invalid'}):lookupMember_(q);}catch(err){console.error('Member lookup failed (details omitted).');}return json_(result);}
function json_(v){return ContentService.createTextOutput(JSON.stringify(v)).setMimeType(ContentService.MimeType.JSON);}
function allowed_(phone){const lock=LockService.getScriptLock();if(!lock.tryLock(3000))return false;try{const cache=CacheService.getScriptCache(),minute=Math.floor(Date.now()/60000),hour=Math.floor(Date.now()/3600000);const hash=Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,phone));const p='p:'+hash+':'+hour,g='g:'+minute;const a=Number(cache.get(p)||0),b=Number(cache.get(g)||0);if(a>=15||b>=60)return false;cache.put(p,String(a+1),3600);cache.put(g,String(b+1),60);return true;}finally{lock.releaseLock();}}
function lookupMember_(q){const phone=phone_(q&&q.phone),dob=date_(q&&q.dob);if(!phone||!dob)return {ok:false,code:'invalid'};if(!allowed_(phone))return {ok:false,code:'limited'};const ss=book_(),s=ss.getSheetByName('Master');assertMaster_(s);const count=s.getLastRow()-1;if(count<1)return {ok:false,code:'not_found'};
 const direct=s.getRange(2,4,count,1).createTextFinder(phone).matchEntireCell(true).findAll();const aliases=s.getRange(2,9,count,1).createTextFinder(phone).matchEntireCell(false).findAll();const rows=[...new Set(direct.concat(aliases).map(c=>c.getRow()))];if(rows.length>15)return {ok:false,code:'review'};
 const matches=rows.map(r=>s.getRange(r,1,1,33).getValues()[0]).filter(r=>[r[3],...String(r[8]).split(';')].some(p=>phone_(p)===phone)&&date_(r[4])===dob);
 if(!matches.length)return {ok:false,code:'not_found'};if(matches.length!==1)return {ok:false,code:'review'};const r=matches[0];
 if(!['Strong matches consolidated','Closest supported match consolidated','Distinct member after comparison','Repeated submissions consolidated'].includes(r[24])||r[25]!=='Core fields present'||!clean_(r[0])||!clean_(r[1])||!clean_(r[2]))return {ok:false,code:'review'};
 return {ok:true,member:{number:clean_(r[0]),name:clean_(r[2]),dob:dob,phone:phone,blood:blood_(r[13])||'—',role:'सभासद'}};
}
function onMemberSubmit_(e){if(!e||!e.response||!e.source||e.source.getId()!==CONFIG.formId)throw Error('Valid form trigger required');processResponse_(e.response);}
function retrySubmissions_(){const since=new Date(Date.now()-48*3600000);const responses=FormApp.openById(CONFIG.formId).getResponses(since);const start=Date.now();for(const r of responses){if(Date.now()-start>240000)break;processResponse_(r);}}
function getResponse_(response){const data={};response.getItemResponses().forEach(i=>data[clean_(i.getItem().getTitle()).replace(/\s*[:：]\s*$/,'')]=i.getResponse());const read=k=>clean_(data[k]);const first=read('पहिले नाव'),middle=read('वडील/पतीचे नाव'),last=read('आडनाव');return {id:response.getId(),timestamp:response.getTimestamp(),first,middle,last,name:clean_([first,middle,last].join(' ')),phone:phone_(read('व्हॉट्सॲप दूरध्वनी क्रमांक')),dob:date_(data['जन्म तारीख']),blood:blood_(read('रक्तगट')),email:read('ईमेल'),gender:read('लिंग'),village:read('गाव'),taluka:read('तालुका'),district:read('जिल्हा'),residence:read('सध्याचे वास्तव्य'),state:read('राज्य'),occupation:read('सध्या काय करता'),marital:read('वैवाहिक पात्रता'),education:read('शिक्षण')};}
function findId_(sheet,id,column){return sheet.getLastRow()<2?null:sheet.getRange(2,column,sheet.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).findNext();}
function appendStyled_(s,values){const row=s.getLastRow()+1;if(row>s.getMaxRows())s.insertRowsAfter(s.getMaxRows(),100);const out=s.getRange(row,1,1,values.length);if(row>2)s.getRange(row-1,1,1,values.length).copyTo(out,SpreadsheetApp.CopyPasteType.PASTE_FORMAT,false);out.setValues([values.map(v=>typeof v==='string'?safe_(v):v)]);return row;}
function processResponse_(response){const lock=LockService.getScriptLock();lock.waitLock(30000);try{const ss=book_(),master=ss.getSheetByName('Master'),log=ss.getSheetByName('Form processing'),review=ss.getSheetByName('Incoming review');if(!log||!review)throw Error('Run installWorkflow first');assertMaster_(master);const p=getResponse_(response);if(!p.id)throw Error('Response ID missing');if(findId_(log,p.id,1))return;const key='form:'+CONFIG.formId+':'+p.id;
 const recovered=findId_(master,key,30);if(recovered){const row=master.getRange(recovered.getRow(),1,1,33).getValues()[0];ensureLookup_(ss,row);appendStyled_(log,[p.id,new Date(),'Created',row[1],row[0],'Recovered after interrupted processing']);return;}
 const hold=reason=>{if(!findId_(review,p.id,1))appendStyled_(review,[p.id,p.timestamp,p.name,p.phone,p.dob,p.blood,reason,'Pending review']);appendStyled_(log,[p.id,new Date(),'Review required','','',reason]);};
 if(!p.first||!p.middle||!p.last||!p.phone||!p.dob||p.name.length>100){hold('Missing or invalid required identity fields');return;}
 const rows=master.getRange(2,1,Math.max(1,master.getLastRow()-1),33).getValues();const candidates=rows.filter(r=>clean_(r[1])&&([r[3],...String(r[8]).split(';')].some(n=>phone_(n)===p.phone)||name_(r[2])===name_(p.name)));
 const exact=candidates.filter(r=>name_(r[2])===name_(p.name)&&date_(r[4])===p.dob&&[r[3],...String(r[8]).split(';')].some(n=>phone_(n)===p.phone));
 if(exact.length===1&&candidates.length===1){const r=exact[0];if(p.blood&&blood_(r[13])&&blood_(r[13])!==p.blood){hold('Existing member blood group differs; no overwrite');return;}appendStyled_(log,[p.id,new Date(),'Existing member',r[1],r[0],'Existing details and registration numbers preserved']);return;}
 if(candidates.length){hold('Possible existing member or shared contact; verify identity before allocation');return;}
 const lookup=ss.getSheetByName('Registration lookup'),used=new Set();if(lookup.getLastRow()>1)lookup.getRange(2,1,lookup.getLastRow()-1,1).getDisplayValues().forEach(r=>{const n=Number(r[0]);if(Number.isSafeInteger(n)&&n>0)used.add(n);});rows.forEach(r=>String(r[0]).split(/[;,]/).forEach(v=>{const n=Number(v.trim());if(Number.isSafeInteger(n)&&n>0)used.add(n);}));let number=5001;while(used.has(number))number++;
 const memberId='SP-'+Utilities.getUuid();const r=Array(33).fill('');Object.assign(r,{0:String(number),1:memberId,2:p.name,3:p.phone,4:new Date(p.dob+'T12:00:00+05:30'),5:p.first,6:p.middle,7:p.last,11:p.email,12:p.gender,13:p.blood,14:p.village,15:p.taluka,16:p.district,17:p.residence,18:p.state,19:p.occupation,20:p.marital,21:p.education,22:p.timestamp,23:'New form registration',24:'Strong matches consolidated',25:'Core fields present',27:1,28:'Current registration form',29:key,32:name_(p.name)});
 appendStyled_(master,r);ensureLookup_(ss,r);appendStyled_(log,[p.id,new Date(),'Created',memberId,String(number),'Unique name/contact; no existing member overwritten']);
 }finally{lock.releaseLock();}}
function ensureLookup_(ss,r){const s=ss.getSheetByName('Registration lookup');if(!findId_(s,String(r[0]),1))appendStyled_(s,[String(r[0]),String(r[1]),String(r[2]),'New form registration','Existing registration numbers preserved']);}
function verifyConfiguration(){owner_();const ss=book_(),form=FormApp.openById(CONFIG.formId);assertMaster_(ss.getSheetByName('Master'));console.log(JSON.stringify({formLinked:form.getDestinationId()===CONFIG.spreadsheetId,masterRows:ss.getSheetByName('Master').getLastRow()-1,triggerHandlers:ScriptApp.getProjectTriggers().map(t=>t.getHandlerFunction())}));}

// Verified self-service corrections. Sessions and OTPs never appear in the sheet.
const PROFILE_FIELDS={name:2,phone:3,dob:4,first:5,middle:6,last:7,email:11,gender:12,blood:13,village:14,taluka:15,district:16,residence:17,state:18,occupation:19,marital:20,education:21};
const CORRECTION_HEADERS=['Correction count','Last corrected at','Next correction allowed','Changed fields','Previous values','Corrected values','Correction ID'];
function hash_(v){return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(v)));}
function email_(v){const s=clean_(v).toLowerCase();return s.length<=254&&/^[^\s@;,]+@[^\s@;,]+\.[^\s@;,]+$/.test(s)?s:'';}
function approved_(r){return ['Strong matches consolidated','Closest supported match consolidated','Distinct member after comparison','Repeated submissions consolidated'].includes(r[24])&&!!clean_(r[0])&&!!clean_(r[1]);}
function contactRows_(s,contact){const p=phone_(contact),mail=email_(contact),n=s.getLastRow()-1;if(!n||(!p&&!mail))return [];let hits;
 if(p)hits=s.getRange(2,4,n,1).createTextFinder(p).matchEntireCell(true).findAll().concat(s.getRange(2,9,n,1).createTextFinder(p).matchEntireCell(false).findAll());
 else hits=s.getRange(2,12,n,1).createTextFinder(mail).matchCase(false).matchEntireCell(true).findAll();
 const indexes=[...new Set(hits.map(c=>c.getRow()))];if(indexes.length>15)return [];
 return indexes.map(row=>({row,values:s.getRange(row,1,1,40).getValues()[0]})).filter(x=>p?[x.values[3],...String(x.values[8]).split(';')].some(v=>phone_(v)===p):email_(x.values[11])===mail);
}
function card_(r){return {number:clean_(r[0]),name:clean_(r[2]),dob:date_(r[4]),phone:phone_(r[3]),blood:blood_(r[13])||'—',role:'सभासद'};}
function profile_(r){const p={};Object.keys(PROFILE_FIELDS).forEach(k=>p[k]=k==='dob'?date_(r[4]):clean_(r[PROFILE_FIELDS[k]]));return p;}
function contactLookup_(q){const contact=clean_(q.contact);if(!phone_(contact)&&!email_(contact))return {ok:false,code:'invalid'};if(!allowed_(contact.toLowerCase()))return {ok:false,code:'limited'};
 const s=book_().getSheetByName('Master');assertMaster_(s);const matches=contactRows_(s,contact);if(!matches.length)return {ok:false,code:'not_found'};if(matches.length!==1||!approved_(matches[0].values))return {ok:false,code:'review'};return {ok:true,member:card_(matches[0].values)};
}
function secret_(){return Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');}
function cacheJSON_(key){const raw=CacheService.getScriptCache().get(key);return raw?JSON.parse(raw):null;}
function storeJSON_(key,value,ttl){CacheService.getScriptCache().put(key,JSON.stringify(value),ttl);}
function memberById_(id){const s=book_().getSheetByName('Master');assertMaster_(s);const hits=s.getRange(2,2,s.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).findAll();if(hits.length!==1)throw Error('Member identity changed');const row=hits[0].getRow(),values=s.getRange(row,1,1,40).getValues()[0];if(!approved_(values))throw Error('Identity review required');return {sheet:s,row,values};}
function assertCorrectionSchema_(s){if(s.getRange(1,34,1,7).getDisplayValues()[0].join('|')!==CORRECTION_HEADERS.join('|'))throw Error('Correction columns missing');}
function anniversary_(iso){const d=new Date(iso),month=d.getUTCMonth();d.setUTCFullYear(d.getUTCFullYear()+1);if(d.getUTCMonth()!==month)d.setUTCDate(0);return d.toISOString();}
function eligibility_(r,now){if(!r[34])return {allowed:true,next:''};const last=new Date(r[34]);if(isNaN(last))return {allowed:false,next:''};const next=anniversary_(last.toISOString());return {allowed:new Date(now)>=new Date(next),next};}
function session_(token){if(typeof token!=='string'||!/^[a-f0-9]{64}$/i.test(token))return null;const session=cacheJSON_('session:'+hash_(token));if(!session||session.expires<Date.now())return null;return session;}
function sendCode_(memberId,email,purpose,sessionKey){
 const props=PropertiesService.getScriptProperties(),day=Utilities.formatDate(new Date(),'Asia/Kolkata','yyyy-MM-dd');
 let limits;try{limits=JSON.parse(props.getProperty('otpLimits')||'{}');}catch{limits={};}
 if(limits.day!==day)limits={day,total:0,recipients:{}};
 const key=hash_(email),entry=limits.recipients[key]||{count:0,last:0};
 if(limits.total>=80||entry.count>=5||Date.now()-entry.last<60000||MailApp.getRemainingDailyQuota()<1)return {ok:false,code:'limited'};
 const id=secret_(),code=String(parseInt(Utilities.getUuid().replace(/-/g,'').slice(0,8),16)%1000000).padStart(6,'0');
 const challenge={memberId,email,purpose,sessionKey,hash:hash_(id+':'+code),attempts:0,expires:Date.now()+600000};
 limits.total++;entry.count++;entry.last=Date.now();limits.recipients[key]=entry;props.setProperty('otpLimits',JSON.stringify(limits));
 storeJSON_('otp:'+id,challenge,600);
 try{MailApp.sendEmail({to:email,subject:'Sahyadri Pratishthan — verification code',body:'Your verification code is '+code+'. It expires in 10 minutes.\n\nUse it only on https://sahyadripratishthan.com to verify a member-profile correction. Never share this code. If you did not request it, ignore this email.\n\nSupport: info.sahyadripratishthan@gmail.com',name:'Sahyadri Pratishthan Hindusthan'});}catch(e){CacheService.getScriptCache().remove('otp:'+id);throw e;}
 return {ok:true,challenge:id};
}
function requestCode_(q){const lock=LockService.getScriptLock();if(!lock.tryLock(10000))return {ok:false,code:'limited'};try{
 const s=book_().getSheetByName('Master');assertMaster_(s);assertCorrectionSchema_(s);const rows=contactRows_(s,q.contact);if(rows.length!==1||!approved_(rows[0].values))return {ok:false,code:'review'};
 const r=rows[0].values,email=email_(r[11]);if(!email)return {ok:false,code:'no_email'};
 const gate=eligibility_(r,new Date());if(!gate.allowed)return {ok:false,code:'year_limit',next:gate.next};
 // A shared mailbox is not sufficient to distinguish registered members.
 if(contactRows_(s,email).length!==1)return {ok:false,code:'review'};
 return sendCode_(clean_(r[1]),email,'profile','');
 }finally{lock.releaseLock();}}
function verifyCode_(q){const lock=LockService.getScriptLock();if(!lock.tryLock(10000))return {ok:false,code:'limited'};try{
 const key='otp:'+clean_(q.challenge),otp=cacheJSON_(key);if(!otp||otp.expires<Date.now()||otp.attempts>=5)return {ok:false,code:'invalid_code'};
 otp.attempts++;storeJSON_(key,otp,Math.max(1,Math.ceil((otp.expires-Date.now())/1000)));
 if(!/^\d{6}$/.test(String(q.code))||hash_(q.challenge+':'+q.code)!==otp.hash)return {ok:false,code:'invalid_code'};
 const m=memberById_(otp.memberId);
 if(otp.purpose==='new-email'){
  const session=session_(q.token);if(!session||hash_(q.token)!==otp.sessionKey||session.memberId!==otp.memberId)return {ok:false,code:'expired'};
  session.newEmail=otp.email;storeJSON_('session:'+hash_(q.token),session,Math.max(1,Math.ceil((session.expires-Date.now())/1000)));CacheService.getScriptCache().remove(key);return {ok:true,emailVerified:true};
 }
 if(email_(m.values[11])!==otp.email)return {ok:false,code:'expired'};
 CacheService.getScriptCache().remove(key);const token=secret_(),session={memberId:otp.memberId,email:otp.email,baseline:hash_(JSON.stringify(profile_(m.values))),expires:Date.now()+900000};storeJSON_('session:'+hash_(token),session,900);
 return {ok:true,token,profile:profile_(m.values),member:card_(m.values),eligibility:eligibility_(m.values,new Date())};
 }finally{lock.releaseLock();}}
function requestNewEmailCode_(q){const lock=LockService.getScriptLock();if(!lock.tryLock(10000))return {ok:false,code:'limited'};try{const session=session_(q.token),email=email_(q.email);if(!session)return {ok:false,code:'expired'};if(!email)return {ok:false,code:'invalid'};if(contactRows_(book_().getSheetByName('Master'),email).some(m=>m.values[1]!==session.memberId))return {ok:false,code:'contact_conflict'};return sendCode_(session.memberId,email,'new-email',hash_(q.token));}finally{lock.releaseLock();}}
function validateProfile_(input){if(!input||typeof input!=='object'||Array.isArray(input))return null;const out={};if(Object.keys(input).some(k=>!Object.prototype.hasOwnProperty.call(PROFILE_FIELDS,k)))return null;
 for(const k of Object.keys(PROFILE_FIELDS)){if(typeof input[k]!=='string'||input[k].length>250)return null;out[k]=clean_(input[k]);}
 out.email=email_(out.email);out.phone=phone_(out.phone);out.dob=/^\d{4}-\d{2}-\d{2}$/.test(out.dob)?date_(out.dob):'';
 if(!out.name||out.name.length>100||!out.email||!out.phone||!out.dob||/^[=+@-]/.test(out.name))return null;
 if(out.blood&&!blood_(out.blood))return null;out.blood=blood_(out.blood);return out;
}
function saveProfile_(q){const lock=LockService.getScriptLock();if(!lock.tryLock(15000))return {ok:false,code:'limited'};try{
 const session=session_(q.token);if(!session)return {ok:false,code:'expired'};const m=memberById_(session.memberId);assertCorrectionSchema_(m.sheet);const log=book_().getSheetByName('Member corrections');if(!log)throw Error('Correction log missing');
 const transaction=hash_(q.token),prior=findId_(log,transaction,1);
 if(prior){const old=log.getRange(prior.getRow(),1,1,11).getValues()[0];if(m.values[39]===transaction){log.getRange(prior.getRow(),5,1,2).setValues([[m.values[34],'Applied']]);return {ok:true,member:card_(m.values),next:clean_(m.values[35])};}if(old[5]!=='Failed')return {ok:false,code:'review'};}
 const gate=eligibility_(m.values,new Date());if(!gate.allowed)return {ok:false,code:'year_limit',next:gate.next};
 if(email_(m.values[11])!==session.email||hash_(JSON.stringify(profile_(m.values)))!==session.baseline)return {ok:false,code:'stale'};
 const p=validateProfile_(q.profile);if(!p)return {ok:false,code:'invalid'};
 if(p.email!==session.email&&p.email!==session.newEmail)return {ok:false,code:'verify_email'};
 for(const contact of [p.phone,p.email])if(contactRows_(m.sheet,contact).some(x=>x.values[1]!==session.memberId))return {ok:false,code:'contact_conflict'};
 const before=profile_(m.values),changed=Object.keys(PROFILE_FIELDS).filter(k=>p[k]!==before[k]);if(!changed.length)return {ok:false,code:'no_changes'};
 const oldValues={},newValues={};changed.forEach(k=>{oldValues[k]=k==='dob'?m.sheet.getRange(m.row,5,1,1).getDisplayValues()[0][0]:before[k];newValues[k]=p[k];});
 const now=new Date().toISOString(),next=anniversary_(now),r=m.values.slice();
 changed.forEach(k=>r[PROFILE_FIELDS[k]]=p[k]);r[32]=name_(p.name);
 // Retain old contacts only in the private audit, never as a login alias.
 if(changed.includes('phone')){oldValues.otherPhones=clean_(r[8]);r[8]='';}
 r[33]=Number(r[33]||0)+1;r[34]=now;r[35]=next;r[36]=changed.join(', ');r[37]=JSON.stringify(oldValues);r[38]=JSON.stringify(newValues);r[39]=transaction;
 // Keep review markers: a member correction does not resolve admin review.
 const logRow=appendStyled_(log,[transaction,session.memberId,clean_(r[0]),now,'','Pending',r[36],r[37],r[38],'Registered email OTP',next]);
 try{m.sheet.getRange(m.row,1,1,40).setValues([r.map(v=>typeof v==='string'?"'"+v:v)]);SpreadsheetApp.flush();}catch(err){throw err;}
 log.getRange(logRow,5,1,2).setValues([[now,'Applied']]);
 return {ok:true,member:card_(r),next};
 }finally{lock.releaseLock();}}
function authorizeMemberEmail(){owner_();console.log('Remaining daily email recipients: '+MailApp.getRemainingDailyQuota());}
