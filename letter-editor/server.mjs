import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {randomBytes,scryptSync,timingSafeEqual} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=new URL('./',import.meta.url);
export function createEditorServer({passwordHash=process.env.LETTER_PASSWORD_HASH,origin=process.env.LETTER_ORIGIN,secure=true}={}){
 if(!passwordHash||!origin)throw new Error('Set LETTER_PASSWORD_HASH and LETTER_ORIGIN before starting.');
 const [salt,hex]=passwordHash.split(':'); if(!/^[a-f0-9]{32}$/.test(salt)||!/^[a-f0-9]{128}$/.test(hex))throw new Error('Invalid password hash');
 const sessions=new Map(),attempts=new Map();let busy=false;
 const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"};
 return createServer(async(req,res)=>{const reply=(status,body,type='text/plain; charset=utf-8',extra={})=>{res.writeHead(status,{...headers,'Content-Type':type,...extra});res.end(body)};
 try{
 const path=new URL(req.url,origin).pathname;
 const token=(req.headers.cookie||'').split('; ').find(x=>x.startsWith('letter_session='))?.slice(15);
 const now=Date.now();for(const [k,v]of sessions)if(v<now)sessions.delete(k);for(const[k,v]of attempts)if(v.until<now)attempts.delete(k);
 const authenticated=sessions.has(token);
 if(req.method==='POST'){
 if(req.headers.origin!==origin)return reply(403,'Invalid origin');
 if(path==='/logout'){sessions.delete(token);return reply(303,'','text/plain',{'Location':'/','Set-Cookie':`letter_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure?'; Secure':''}`})}
 if(path!=='/login')return reply(404,'Not found');
 // Use the socket address, never an untrusted forwarded header. Proxy deployments share this limit.
 const key=req.socket.remoteAddress;const count=attempts.get(key)||{n:0,until:now+15*60_000};
 if(count.n>=10||busy)return reply(429,'Too many attempts. Try again in 15 minutes.');
 let body='';for await(const chunk of req){body+=chunk;if(body.length>4096)return reply(413,'Request too large')}
 count.n++;attempts.set(key,count);busy=true;let valid=false;
 try{valid=timingSafeEqual(scryptSync(new URLSearchParams(body).get('password')||'',salt,64),Buffer.from(hex,'hex'))}finally{busy=false}
 if(!valid)return reply(303,'','text/plain',{'Location':'/?error=1'});
 attempts.delete(key);const session=randomBytes(32).toString('hex');sessions.set(session,now+8*60*60_000);
 return reply(303,'','text/plain',{'Location':'/','Set-Cookie':`letter_session=${session}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${secure?'; Secure':''}`});
 }
 if(req.method!=='GET')return reply(405,'Method not allowed');
 if(path==='/style.css')return reply(200,await readFile(new URL('public/style.css',base)),'text/css');
 if(!authenticated){if(path!=='/')return reply(401,'Please sign in');return reply(200,await readFile(new URL('public/login.html',base)),'text/html; charset=utf-8')}
 const files={'/':['public/editor.html','text/html; charset=utf-8'],'/editor.js':['public/editor.js','text/javascript'],'/letterhead.png':['private/letterhead.png','image/png'],'/letterhead.pdf':['private/letterhead.pdf','application/pdf']};
 if(!files[path])return reply(404,'Not found');const[file,type]=files[path];reply(200,await readFile(new URL(file,base)),type);
 }catch{reply(500,'Unable to complete the request. Please try again.')}});
}
if(process.argv[1]===fileURLToPath(import.meta.url))createEditorServer({secure:process.env.LETTER_LOCAL!=='1'}).listen(Number(process.env.PORT||4180),'0.0.0.0',()=>console.log('Letter editor listening.'));
