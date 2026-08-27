const RESEND_ENDPOINT='https://api.resend.com/emails';
const recipient='lauren@cuddlecrewpetcare.com';

const clean=(value:unknown,max:number)=>typeof value==='string'?value.trim().slice(0,max):'';
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]!));

export async function POST(request:Request){
  const apiKey=process.env.RESEND_API_KEY;
  if(!apiKey) return Response.json({error:'Contact delivery is not configured.'},{status:503});
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return Response.json({error:'Invalid request.'},{status:400});}
  if(clean(body.website,200)) return Response.json({ok:true});
  const startedAt=Number(body.startedAt);
  const elapsed=Date.now()-startedAt;
  if(!Number.isFinite(startedAt)||elapsed<3000||elapsed>7_200_000) return Response.json({error:'Please reload the form and try again.'},{status:400});
  const name=clean(body.name,80), replyTo=clean(body.replyTo,254), phone=clean(body.phone,30), zip=clean(body.zip,10), message=clean(body.message,3000);
  if(name.length<2||!emailPattern.test(replyTo)||message.length<10) return Response.json({error:'Please check the required fields.'},{status:400});
  const text=`New website inquiry\n\nName: ${name}\nEmail: ${replyTo}\nPhone: ${phone||'Not provided'}\nService ZIP: ${zip||'Not provided'}\n\nMessage:\n${message}`;
  const html=`<h2>New website inquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(replyTo)}<br><strong>Phone:</strong> ${escapeHtml(phone||'Not provided')}<br><strong>Service ZIP:</strong> ${escapeHtml(zip||'Not provided')}</p><h3>Message</h3><p>${escapeHtml(message).replace(/\n/g,'<br>')}</p>`;
  const response=await fetch(RESEND_ENDPOINT,{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json','User-Agent':'CuddleCrewPetCare/1.0','Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({from:'Cuddle Crew Website <website@cuddlecrewpetcare.com>',to:[recipient],reply_to:replyTo,subject:`Pet care inquiry from ${name}`,text,html})});
  if(!response.ok){console.error('Resend contact delivery failed',response.status);return Response.json({error:'Unable to send inquiry.'},{status:502});}
  return Response.json({ok:true});
}
