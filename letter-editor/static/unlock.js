const decode=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
let currentURL;
document.getElementById('unlock').addEventListener('submit',async event=>{
 event.preventDefault();const input=document.getElementById('password'),button=document.getElementById('enter'),status=document.getElementById('status');
 button.disabled=true;status.textContent='उघडत आहे…';
 try{
 if(!crypto.subtle)throw Error('unsupported');
 const response=await fetch('./sealed.json',{cache:'no-store'});if(!response.ok)throw Error('network');const envelope=await response.json();
 const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(input.value.trim()),'PBKDF2',false,['deriveKey']);
 const key=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:decode(envelope.salt),iterations:envelope.iterations},material,{name:'AES-GCM',length:256},false,['decrypt']);
 const plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(envelope.iv)},key,decode(envelope.ciphertext));
 const payload=JSON.parse(new TextDecoder().decode(plaintext));input.value='';
 // Opaque-origin sandbox isolates the decrypted document from the public website.
 const frame=document.createElement('iframe');frame.title='सह्याद्री पत्रलेखन';frame.setAttribute('sandbox','allow-scripts allow-modals allow-downloads');
 const csp="<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; img-src data: blob:; font-src data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; base-uri 'none'; form-action 'none'\">";
 const html=payload.html.replace('<meta charset="utf-8">','<meta charset="utf-8">'+csp).replace("document.getElementById('lock').onclick=()=>location.reload();","document.getElementById('lock').onclick=()=>parent.postMessage('lock-letter-editor','*');");
 currentURL=URL.createObjectURL(new Blob([html],{type:'text/html'}));frame.src=currentURL;document.body.replaceChildren(frame);
 window.addEventListener('message',event=>{if(event.source===frame.contentWindow&&event.data==='lock-letter-editor'){URL.revokeObjectURL(currentURL);location.reload()}});
 }catch(error){status.textContent=error.name==='OperationError'?'पासवर्ड चुकीचा आहे. पुन्हा प्रयत्न करा.':'संपादक उघडता आला नाही. इंटरनेट कनेक्शन तपासा व नवीन ब्राउझरमध्ये पुन्हा प्रयत्न करा.';button.disabled=false;input.focus()}
});
