"""Keep work records, label historic invitations, remove unused generated derivatives."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parent.parent
records=json.loads((root/'instagram-records.json').read_text());images=json.loads((root/'instagram-images.json').read_text());kept=[];excluded=[]
for r in records:
 c=r['caption'];done=bool(re.search('करण्यात आले|करण्यात आली|पार पड|पूर्ण केले|पूर्ण झाले|संपन्न झाल|उभारले|उभारण्यात आले|सहभाग नोंदव|संकलन|श्रमदान केले|स्वच्छ केले|स्वच्छ करण्यात|बसविण्यात आले|बसवण्यात आले',c))
 if re.search('भावपूर्ण श्रद्धांजली|निधन|वाढदिवस|निधी अर्पण|निधी देणगी',c) and not done:excluded.append(r['id']);continue
 if re.search('उपस्थित रहावे|उपस्थित राहावे|उपस्थिती प्रार्थनीय|सहभागी व्हा|संपन्न होणार|आयोजित करणेबाबत|नियोजन करावे|येणार आहे|नक्की या|यायलाच',c) and not done:r['recordType']='announcement'
 kept.append(r)
used={p for r in kept for p in r['photos']};images={k:v for k,v in images.items() if k in used};files={Path(v[f]).name for v in images.values() for f in ['src','thumb']}
for p in (root/'assets/instagram').glob('*.webp'):
 if p.name not in files:p.unlink()
(root/'instagram-records.json').write_text(json.dumps(kept,ensure_ascii=False,indent=2));(root/'instagram-images.json').write_text(json.dumps(images,ensure_ascii=False,indent=2))
report={'records':len(kept),'photographs':len(images),'announcements':sum(r.get('recordType')=='announcement' for r in kept),'excluded':excluded,'bytes':sum(p.stat().st_size for p in (root/'assets/instagram').glob('*.webp'))}
(root/'output/instagram/final-report.json').write_text(json.dumps(report,indent=2));print(report)
