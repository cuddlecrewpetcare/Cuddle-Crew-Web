const RESEND_ENDPOINT='https://api.resend.com/emails';
const recipient='lauren@cuddlecrewpetcare.com';
import {clientKey,rateLimit,verifyTurnstile} from '../../lib/rate-limit';
import {turnstileMode} from '../../lib/turnstile-config';

const clean=(value:unknown,max:number)=>typeof value==='string'?value.trim().slice(0,max):'';
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]!));

export async function POST(request:Request){
  if(turnstileMode(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,process.env.TURNSTILE_SECRET_KEY)==='misconfigured'){console.error('Turnstile configuration requires both site and secret keys.');return Response.json({error:'Contact security is temporarily misconfigured. Please email Lauren directly.'},{status:503});}
  const ip=clientKey(request),limit=rateLimit(`contact:${ip}`,5,10*60_000);if(!limit.allowed)return Response.json({error:'Too many attempts. Please wait before trying again.'},{status:429,headers:{'Retry-After':String(limit.retryAfter)}});
  const apiKey=process.env.RESEND_API_KEY;
  if(!apiKey) return Response.json({error:'Contact delivery is not configured.'},{status:503});
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return Response.json({error:'Invalid request.'},{status:400});}
  if(!await verifyTurnstile(clean(body.turnstileToken,2048),ip))return Response.json({error:'Verification failed. Please try again.'},{status:400});
  if(clean(body.website,200)) return Response.json({ok:true});
  const startedAt=Number(body.startedAt);
  const elapsed=Date.now()-startedAt;
  if(!Number.isFinite(startedAt)||elapsed<3000||elapsed>7_200_000) return Response.json({error:'Please reload the form and try again.'},{status:400});
  const name=clean(body.name,80), replyTo=clean(body.replyTo,254), phone=clean(body.phone,30), zip=clean(body.zip,10), topic=clean(body.topic,80)||'General question', message=clean(body.message,3000);
  if(name.length<2||!emailPattern.test(replyTo)||message.length<10) return Response.json({error:'Please check the required fields.'},{status:400});
  const text=`New website inquiry\n\nTopic: ${topic}\nName: ${name}\nEmail: ${replyTo}\nPhone: ${phone||'Not provided'}\nService ZIP: ${zip||'Not provided'}\n\nMessage:\n${message}`;
  const html=`<h2>New website inquiry</h2><p><strong>Topic:</strong> ${escapeHtml(topic)}<br><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(replyTo)}<br><strong>Phone:</strong> ${escapeHtml(phone||'Not provided')}<br><strong>Service ZIP:</strong> ${escapeHtml(zip||'Not provided')}</p><h3>Message</h3><p>${escapeHtml(message).replace(/\n/g,'<br>')}</p>`;
  const response=await fetch(RESEND_ENDPOINT,{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json','User-Agent':'CuddleCrewPetCare/1.0','Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({from:'Cuddle Crew Website <website@cuddlecrewpetcare.com>',to:[recipient],reply_to:replyTo,subject:`${topic} — inquiry from ${name}`,text,html})});
  if(!response.ok){console.error('Resend contact delivery failed',response.status);return Response.json({error:'Unable to send inquiry.'},{status:502});}
  const confirmationText=`Hi ${name},\n\nThanks—your ${topic.toLowerCase()} inquiry was sent to Lauren at Cuddle Crew Pet Care. Please allow 1–2 business days for a reply. If your requested care begins within 48 hours, submit the formal request through the client portal and call 916-252-3550.\n\nThis confirms delivery only; it is not a booking or acceptance of care.`;
  const confirmationHtml=`<div style="font-family:Arial,sans-serif;line-height:1.6;color:#3b241a"><h2>Thanks, ${escapeHtml(name)}.</h2><p>Your <strong>${escapeHtml(topic.toLowerCase())}</strong> inquiry was sent to Lauren. Please allow 1–2 business days for a reply.</p><p>If care begins within 48 hours, submit the formal request through the portal and call 916-252-3550.</p><p><strong>This confirms delivery only; it is not a booking or acceptance of care.</strong></p></div>`;
  const confirmation=await fetch(RESEND_ENDPOINT,{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json','User-Agent':'CuddleCrewPetCare/1.0','Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({from:'Cuddle Crew Pet Care <website@cuddlecrewpetcare.com>',to:[replyTo],reply_to:recipient,subject:'We received your Cuddle Crew inquiry',text:confirmationText,html:confirmationHtml})});
  if(!confirmation.ok) console.error('Resend confirmation delivery failed',confirmation.status);
  return Response.json({ok:true});
}
