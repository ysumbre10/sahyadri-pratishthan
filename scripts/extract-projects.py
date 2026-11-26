"""Read approved image types from ZIPs; no archive paths are used as output paths."""
from pathlib import Path
from zipfile import ZipFile
import json,hashlib,subprocess
root=Path(__file__).resolve().parents[1];raw=Path('/tmp/sahyadri-project-originals');raw.mkdir(exist_ok=True)
projects=[('pratapgad','किल्ले प्रतापगड'),('vasantgad','किल्ले वसंतगड'),('gateways','प्रवेशद्वार'),('cannons','तोफगाडे'),('murarbaji','रणधुरंदर'),('rajgad','राजगड संवर्धन'),('janjira','किल्ले जंजिरा'),('padmadurg','किल्ले पद्मदुर्ग')];manifest=[]
for slug,prefix in projects:
 archive=next(p for p in (root/'assets').glob('*.zip') if p.name.startswith(prefix));rows=[];seen={};excluded=[];duplicates=[]
 with ZipFile(archive) as z:
  for entry in z.infolist():
   if entry.is_dir():continue
   suffix=Path(entry.filename).suffix.lower()
   if suffix not in ['.jpg','.jpeg','.png','.heic']:excluded.append(entry.filename);continue
   data=z.read(entry);digest=hashlib.sha256(data).hexdigest()
   if digest in seen:duplicates.append({'source':entry.filename,'sameAs':seen[digest]});continue
   stem=f'{len(rows)+1:02d}';seen[digest]=stem;file=raw/(slug+'-'+stem+suffix);file.write_bytes(data)
   if suffix=='.heic':
    converted=file.with_suffix('.jpg')
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_stream_groups','-show_streams','-of','json',str(file)]))
    grid=probe['stream_groups'][0]['components'][0];tiles=grid['subcomponents']
    inputs=''.join('[0:'+str(t['stream_index'])+']' for t in tiles)
    layout='|'.join(str(t['tile_horizontal_offset'])+'_'+str(t['tile_vertical_offset']) for t in tiles)
    filters=inputs+'xstack=inputs='+str(len(tiles))+':layout='+layout+',crop='+str(grid['width'])+':'+str(grid['height'])
    rotations=[side.get('rotation',0) for st in probe['streams'] for side in st.get('side_data_list',[]) if 'rotation' in side]
    rotation=rotations[-1] if rotations else 0
    if rotation==-90:filters+=',transpose=clock'
    elif rotation==90:filters+=',transpose=cclock'
    elif abs(rotation)==180:filters+=',hflip,vflip'
    filters+='[out]'
    subprocess.run(['ffmpeg','-v','error','-y','-noautorotate','-i',str(file),'-filter_complex',filters,'-map','[out]','-frames:v','1','-q:v','2',str(converted)],check=True)
    file=converted
   rows.append({'id':stem,'source':entry.filename,'input':str(file)})
 manifest.append({'id':slug,'archive':archive.name,'images':rows,'excluded':excluded,'duplicates':duplicates})
 print(slug,len(rows),'photos;',len(duplicates),'duplicates;',len(excluded),'non-image files excluded')
(raw/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
