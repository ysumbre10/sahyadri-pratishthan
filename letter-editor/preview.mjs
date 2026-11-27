// Local-only phone-width preview. The normal build removes this route.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const html=await readFile(new URL('../letter-editor.html',import.meta.url),'utf8');
const phone=html.replace('</head>',`<style>html{background:#dde2e7}body{width:min(390px,100%);margin:0 auto;min-height:100vh;box-shadow:0 0 28px #0002}body>main{margin:24px 0}iframe{height:100dvh}</style></head>`);
const destination=new URL('../dist/__letter-preview-phone/',import.meta.url);
await mkdir(destination,{recursive:true});await writeFile(new URL('index.html',destination),phone);
console.log('Desktop preview: http://127.0.0.1:4173/patra-kaksha/');
console.log('Phone-width preview: http://127.0.0.1:4173/__letter-preview-phone/');
