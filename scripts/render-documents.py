"""Render supplied PDFs for the website. Requires Poppler and Pillow; never modifies originals."""
from pathlib import Path
import subprocess, re, json
from PIL import Image
root=Path(__file__).resolve().parents[1]
items=[('trust','4. Trust RC, By Laws.pdf'),('pan','1. Trust Pan.pdf'),('12a','5. 12A.pdf'),('80g','6. 80G.pdf'),('csr','7. CSR Certificate from ROC.PDF'),('darpan','8. NGO Darpan Registration Details.pdf'),('lei','9. LEI Certificate.pdf')]
manifest=[]
for slug,filename in items:
 source=root/'assets'/filename
 count=int(re.search(r'Pages:\s+(\d+)',subprocess.check_output(['pdfinfo',str(source)],text=True)).group(1))
 folder=root/'assets'/'document-pages'/slug;folder.mkdir(parents=True,exist_ok=True)
 subprocess.run(['pdftoppm','-r','150','-jpeg','-jpegopt','quality=87,optimize=y',str(source),str(folder/'page')],check=True)
 pages=sorted(folder.glob('page-*.jpg'),key=lambda p:int(p.stem.split('-')[-1]))
 assert len(pages)==count
 dimensions=[]
 for page in pages:
  with Image.open(page) as image:
   dimensions.append({'width':image.width,'height':image.height})
 manifest.append({'id':slug,'pages':['/'+str(p.relative_to(root)) for p in pages],'dimensions':dimensions})
 print(slug,count,'pages')
(root/'documents.json').write_text(json.dumps(manifest,indent=2)+'\n')
