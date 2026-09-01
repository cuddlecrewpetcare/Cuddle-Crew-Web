export const contactTopics=['Availability or scheduling','Services and care options','Pricing or an estimate','Service area or travel fees','Meet-and-greet or registration','Medication or special care','Existing client question','Other'] as const;
export const contactKeys=['name','replyTo','phone','zip','topic','message','website','startedAt','turnstileToken'] as const;
const emailPattern=/^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/;
const text=(value:unknown)=>typeof value==='string'?value.trim():'';
export const escapeHtml=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]!));

export function validateContact(value:Record<string,unknown>){
  const name=text(value.name),replyTo=text(value.replyTo).toLowerCase(),rawPhone=text(value.phone),zip=text(value.zip),topic=text(value.topic),message=text(value.message),website=text(value.website),turnstileToken=text(value.turnstileToken),startedAt=Number(value.startedAt);
  if(website.length>200||turnstileToken.length>2048)return{ok:false as const,error:'Please check the submitted fields.'};
  if(website)return{ok:true as const,honeypot:true as const,turnstileToken};
  const phoneDigits=rawPhone.replace(/\D/g,'');
  const phone=rawPhone?(phoneDigits.length>=7&&phoneDigits.length<=15?`${rawPhone.startsWith('+')?'+':''}${phoneDigits}`:''):'';
  if(name.length<2||name.length>80||/[\r\n]/.test(name)||replyTo.length>254||!emailPattern.test(replyTo)||rawPhone&&!phone||zip&&!/^\d{5}$/.test(zip)||!contactTopics.includes(topic as typeof contactTopics[number])||message.length<10||message.length>3000||!Number.isFinite(startedAt))return{ok:false as const,error:'Please check the required fields.'};
  return{ok:true as const,honeypot:false as const,data:{name,replyTo,phone,zip,topic,message,startedAt,turnstileToken}};
}

export async function contactFingerprint(data:{name:string;replyTo:string;topic:string;message:string}){
  const bytes=new TextEncoder().encode([data.name,data.replyTo,data.topic,data.message].join('\n'));
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(byte=>byte.toString(16).padStart(2,'0')).join('');
}
