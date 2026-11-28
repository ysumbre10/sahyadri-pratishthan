"""Import only captioned public work posts; never extract private export metadata."""
import glob,zipfile,json,re,hashlib,io,math,collections,datetime,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
rules={
'fort-doors':r'प्रवेशद्वार|दरवाज|महाद्वार|महादरवाजा',
'cannon-carriages':r'तोफगाड|तोफगाडे|तोफेला|तोफांना|तोफांचे|तोफ संवर्धन|तोफ बसव|तोफखाना|cannon',
'water-tank-cleaning':r'(?:टाक|टाके|टाकी|जलस्रोत|पाणवठ|कुंड|विहीर|विहिर).{0,55}(?:स्वच्छ|गाळ|संवर्धन)|(?:स्वच्छ|गाळ).{0,55}(?:टाक|टाके|टाकी|कुंड|विहीर)|जलसंवर्धन',
'temple-conservation':r'(?:मंदिर|देऊळ|देवालय).{0,65}(?:संवर्धन|निर्माण|जीर्णोद्धार|जिर्णोद्धार|बांधकाम|उभार|दुर्गार्पण|लोकार्पण)|(?:संवर्धन|जीर्णोद्धार|बांधकाम).{0,40}मंदिर',
'wall-restoration':r'तटबंदी|बुरुज|चिरेबंदी',
'rajmudra':r'राजमुद्रा',
'blood-donation':r'रक्तदान|blood donation',
'shaurya-tula-vandito':r'शौर्य.{0,8}तुला.{0,8}वंदितो|कारगिल|कृतज्ञता सोहळा',
'andolans':r'आंदोलन|मोर्चा|निवेदन|उपोषण',
'cleanliness-drives':r'स्वच्छता|स्वच्छते|कचरा|प्लास्टिक मुक्त',
'memorial-conservation':r'स्मारक.{0,45}(?:संवर्धन|निर्माण|बांध|उभार|लोकार्पण)|समाधी.{0,40}(?:संवर्धन|जीर्णोद्धार)',
'history-and-exhibitions':r'व्याख्यान|प्रदर्शन|शस्त्रप्रदर्शन',
'shiv-rath-yatra':r'शिवरथ|शिव रथ',
'flag-initiatives':r'ध्वजस्तंभ|ध्वजारोहण|ध्वजवंदन|ध्वज.{0,30}(?:जंजिरा|पद्मदुर्ग)|(?:जंजिरा|पद्मदुर्ग).{0,30}ध्वज',
'tree-planting':r'वृक्षारोपण|वृक्ष लागवड|झाडे लाव',
'youth-camps':r'प्रेरणा शिबिर|युवा शिबिर|सैन्य.{0,20}शिबिर',
'community-service':r'पूरग्रस्त|अन्नदान|आरोग्य शिबिर|आरोग्य तपासणी|वस्त्र वाटप|मदतकार्य|रुग्णवाहिका',
'heritage-celebrations':r'दीपोत्सव|दिपोत्सव|दुर्गदिन|दुर्ग दिन',
'research-and-signage':r'दिशादर्शक|माहिती फलक|इतिहास फलक|पुरावस्त|शिलालेख',
}
def fix(s):
 try:return s.encode('latin1').decode('utf8')
 except (UnicodeError,AttributeError):return s or ''
def clean(s):
 s=fix(s);s=re.sub(r'https?://\S+|@[\w.]+|#[^\s#]+','',s);s=re.sub(r'(?<!\d)(?:\+?91[ -]?)?[०-९0-9][०-९0-9 -]{8,14}[०-९0-9](?!\d)','',s)
 return re.sub(r'\n{3,}','\n\n',s).strip()
zips=[zipfile.ZipFile(p) for p in sorted(glob.glob('/Users/yadneshsumbre/Downloads/instagram-sahyadri_pratishthan_official-*.zip'))]
index={n:z for z in zips for n in z.namelist()};posts=[]
for n,z in index.items():
 if re.fullmatch(r'your_instagram_activity/media/(posts(?:_\d+)?|reels|igtv_videos)\.json',n):
  d=json.loads(z.read(n));posts+= d if isinstance(d,list) else next(iter(d.values()))
seen=set();groups={};skipped=collections.Counter()
for p in posts:
 labels=p.get('label_values',[]);media=p.get('media',[]) or next((x.get('media',[]) for x in labels if x['label']=='Media'),[])
 if not media:continue
 key=tuple(x['uri'] for x in media)
 if key in seen:continue
 seen.add(key)
 cap=clean(p.get('title') or next((x.get('title') for x in media if x.get('title')),None) or next((x.get('value') for x in labels if x['label']=='Caption'),''))
 cats=[c for c,r in rules.items() if re.search(r,cap,re.I|re.S)]
 if not cats or len(cap)<45:skipped['unclassified_or_short']+=1;continue
 # Campaign posts remain source accounts, never automatically labelled completed work.
 norm=re.sub(r'[^\w]','',cap).lower();h=hashlib.sha256(norm.encode()).hexdigest()[:16]
 g=groups.setdefault(h,{'id':'ig-'+h,'caption':cap,'categories':cats,'media':[],'timestamps':[]})
 g['media']+= [m['uri'] for m in media if m['uri'] in index and m['uri'] not in g['media']]
 g['timestamps'] += [m.get('creation_timestamp',p.get('timestamp',0)) for m in media]
print('Public records',len(seen),'caption groups',len(groups),'categories',dict(collections.Counter(c for g in groups.values() for c in g['categories'])),flush=True)
(ROOT/'output/instagram/candidates.json').write_text(json.dumps(list(groups.values()),ensure_ascii=False,indent=2))
if '--prepare' not in __import__('sys').argv:raise SystemExit

rawdir=ROOT/'output/instagram/raw';rawdir.mkdir(exist_ok=True,parents=True)
for count,g in enumerate(groups.values()):
 paths=[]
 for uri in g['media']:
  if uri.lower().endswith(('.jpg','.jpeg','.png','.webp')):
   target=rawdir/(hashlib.sha256(uri.encode()).hexdigest()[:20]+Path(uri).suffix)
   if not target.exists():target.write_bytes(index[uri].read(uri))
   paths.append(str(target))
 if not paths:
  uri=next((u for u in g['media'] if u.endswith('.mp4')),None)
  if uri:
   target=rawdir/(g['id']+'.png')
   if not target.exists():
    with tempfile.TemporaryDirectory() as tmp:
     v=Path(tmp)/'clip.mp4';v.write_bytes(index[uri].read(uri))
     subprocess.run(['ffmpeg','-v','error','-ss','1','-i',str(v),'-frames:v','1','-vf','scale=1200:1200:force_original_aspect_ratio=decrease',str(target)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
   if target.exists():paths=[str(target)];g['videoStill']=True
 g['paths']=paths
 if count%100==0:print('Extracted',count,'/',len(groups),flush=True)
(ROOT/'output/instagram/candidates.json').write_text(json.dumps(list(groups.values()),ensure_ascii=False,indent=2))
