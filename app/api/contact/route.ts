import {contactFingerprint,contactKeys,escapeHtml,validateContact} from '../../lib/contact.ts';
import {clientKey,rateLimit} from '../../lib/rate-limit.ts';
import {readJsonObject} from '../../lib/server-security.ts';
import {turnstileMode} from '../../lib/turnstile-config.ts';
import {smsConsentSource} from '../../config/sms.ts';
import {resourceLimits} from '../../config/resource-limits.ts';
import {resendDeliveryConfigured,sendResendEmail,type ResendMessage} from '../../lib/providers/resend.ts';
import {verifyTurnstile} from '../../lib/providers/turnstile.ts';
import type {ProviderFailure,ProviderResult} from '../../lib/providers/errors.ts';
import {createRequestId,jsonWithRequestId,logDiagnostic,logProviderFailure} from '../../lib/observability.ts';

const recipient='lauren@cuddlecrewpetcare.com';
const duplicateWindowMs=2*60_000;
export const MAX_RECENT_CONTACT_ATTEMPTS=resourceLimits.processStateEntries.recentContactAttempts;
type ContactAttempt={expires:number;accepted:boolean;requestId:string;smsConsentTimestamp?:string};
const recent=new Map<string,ContactAttempt>();
type EmailSender=(message:ResendMessage,idempotencyKey:string)=>Promise<ProviderResult>;

const pruneAttempts=(now:number)=>{for(const[key,attempt]of recent)if(attempt.expires<=now)recent.delete(key)};
const upstreamStatus=(failure:ProviderFailure)=>failure.outcome==='CONFIRMED_FAILURE'?502:503;
export const resetContactAttemptsForTests=()=>recent.clear();
export const contactAttemptCountForTests=()=>recent.size;

export function createContactPost(sendEmail:EmailSender=sendResendEmail){
  return async function POST(request:Request){
    const requestId=createRequestId();
    const json=(body:unknown,init:ResponseInit={})=>{const headers=new Headers(init.headers);headers.set('Cache-Control','no-store');return jsonWithRequestId(body,requestId,{...init,headers})};
    if(turnstileMode(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,process.env.TURNSTILE_SECRET_KEY)==='misconfigured'){
      logDiagnostic('ERROR','configuration.invalid',{operation:'contact',provider:'turnstile',requestId,category:'CONFIGURATION',result:'incomplete_pair'});
      return json({error:'Contact security is temporarily misconfigured. Please email Lauren directly.'},{status:503});
    }
    const ip=clientKey(request),limit=rateLimit(`contact:${ip}`,5,10*60_000);
    if(!limit.allowed){logDiagnostic('WARN','security.rate_limited',{operation:'contact',requestId,category:'RATE_LIMIT',result:'rejected'});return json({error:'Too many attempts. Please wait before trying again.'},{status:429,headers:{'Retry-After':String(limit.retryAfter)}})}
    if(!resendDeliveryConfigured()){logDiagnostic('WARN','configuration.missing',{operation:'contact',provider:'resend',requestId,category:'CONFIGURATION',result:'write_disabled'});return json({error:'Contact delivery is not configured.'},{status:503})}
    const parsed=await readJsonObject(request,resourceLimits.requestBodyBytes.contact,contactKeys);
    if(!parsed.ok)return json({error:parsed.error},{status:parsed.status});
    const checked=validateContact(parsed.value);
    if(!checked.ok)return json({error:checked.error},{status:400});
    const turnstileStarted=Date.now();
    const verification=await verifyTurnstile(checked.turnstileToken||'',ip);
    if(!verification.ok){
      logProviderFailure('turnstile','verify',requestId,verification,Date.now()-turnstileStarted);
      return json({error:'Contact security is temporarily unavailable. Please email Lauren directly.'},{status:503});
    }
    logDiagnostic('DEBUG','provider.call_completed',{provider:'turnstile',operation:'verify',requestId,durationMs:Date.now()-turnstileStarted,result:verification.verified?'verified':'rejected'});
    if(!verification.verified){logDiagnostic('INFO','security.turnstile_rejected',{operation:'contact',provider:'turnstile',requestId,category:'SECURITY_REJECTED',result:'rejected'});return json({error:'Verification failed. Please try again.'},{status:400})}
    if(checked.honeypot){logDiagnostic('INFO','security.honeypot_rejected',{operation:'contact',requestId,category:'SECURITY_REJECTED',result:'accepted_without_delivery'});return json({ok:true})}
    const data=checked.data,elapsed=Date.now()-data.startedAt;
    if(elapsed<3000||elapsed>7_200_000)return json({error:'Please reload the form and try again.'},{status:400});

    const fingerprint=await contactFingerprint(data),now=Date.now();
    pruneAttempts(now);
    const prior=recent.get(fingerprint);
    if(prior?.accepted){logDiagnostic('INFO','contact.duplicate_suppressed',{operation:'contact',requestId,category:'DUPLICATE',result:'suppressed'});return json({ok:true,duplicate:true})}
    if(!prior&&recent.size>=MAX_RECENT_CONTACT_ATTEMPTS){logDiagnostic('WARN','resource.capacity_reached',{operation:'contact',requestId,category:'UNAVAILABLE',result:'contact_attempt_state_full'});return json({error:'Contact delivery is temporarily busy. Please wait and try again.'},{status:503,headers:{'Retry-After':'120'}})}
    const attempt=prior||{
      expires:now+duplicateWindowMs,
      accepted:false,
      requestId:crypto.randomUUID(),
      ...(data.smsConsent?{smsConsentTimestamp:new Date().toISOString()}:{}),
    };
    recent.set(fingerprint,attempt);

    const smsConsentRecord=data.smsConsent?`Granted\nSMS consent source: ${smsConsentSource}\nSMS consent timestamp: ${attempt.smsConsentTimestamp}`:'Not granted';
    const text=`New website inquiry\n\nTopic: ${data.topic}\nName: ${data.name}\nEmail: ${data.replyTo}\nPhone: ${data.phone||'Not provided'}\nSMS consent: ${smsConsentRecord}\nService ZIP: ${data.zip||'Not provided'}\n\nMessage:\n${data.message}`;
    const html=`<h2>New website inquiry</h2><p><strong>Topic:</strong> ${escapeHtml(data.topic)}<br><strong>Name:</strong> ${escapeHtml(data.name)}<br><strong>Email:</strong> ${escapeHtml(data.replyTo)}<br><strong>Phone:</strong> ${escapeHtml(data.phone||'Not provided')}<br><strong>SMS consent:</strong> ${data.smsConsent?`Granted<br><strong>SMS consent source:</strong> ${smsConsentSource}<br><strong>SMS consent timestamp:</strong> ${attempt.smsConsentTimestamp}`:'Not granted'}<br><strong>Service ZIP:</strong> ${escapeHtml(data.zip||'Not provided')}</p><h3>Message</h3><p>${escapeHtml(data.message).replace(/\n/g,'<br>')}</p>`;
    const businessStarted=Date.now();
    const businessResult=await sendEmail({from:'Cuddle Crew Pet Care <website@cuddlecrewpetcare.com>',to:[recipient],reply_to:data.replyTo,subject:`${data.topic} — inquiry from ${data.name}`,text,html},`contact/${attempt.requestId}`);
    if(!businessResult.ok){
      logProviderFailure('resend','contact-notification',requestId,businessResult,Date.now()-businessStarted);
      return json({error:'Unable to send inquiry.'},{status:upstreamStatus(businessResult)});
    }
    logDiagnostic('INFO','provider.write_accepted',{provider:'resend',operation:'contact-notification',requestId,durationMs:Date.now()-businessStarted,result:'accepted',...(businessResult.providerRequestId?{providerRequestId:businessResult.providerRequestId}:{})});
    attempt.accepted=true;
    recent.set(fingerprint,attempt);

    const confirmationText=`Hi ${data.name},\n\nThanks—your ${data.topic.toLowerCase()} inquiry was accepted for delivery to Lauren at Cuddle Crew Pet Care. Please allow 1–2 business days for a reply. If your requested care begins within 48 hours, submit the formal request through the client portal and call 916-252-3550.\n\nThis confirms provider acceptance only; it is not a booking or acceptance of care.`;
    const confirmationHtml=`<div style="font-family:Arial,sans-serif;line-height:1.6;color:#3b241a"><h2>Thanks, ${escapeHtml(data.name)}.</h2><p>Your <strong>${escapeHtml(data.topic.toLowerCase())}</strong> inquiry was accepted for delivery to Lauren. Please allow 1–2 business days for a reply.</p><p>If care begins within 48 hours, submit the formal request through the portal and call 916-252-3550.</p><p><strong>This confirms provider acceptance only; it is not a booking or acceptance of care.</strong></p></div>`;
    const confirmationStarted=Date.now();
    const confirmationResult=await sendEmail({from:'Cuddle Crew Pet Care <website@cuddlecrewpetcare.com>',to:[data.replyTo],reply_to:recipient,subject:'We received your Cuddle Crew inquiry',text:confirmationText,html:confirmationHtml},`confirmation/${attempt.requestId}`);
    if(!confirmationResult.ok)logProviderFailure('resend','visitor-confirmation',requestId,confirmationResult,Date.now()-confirmationStarted);
    else logDiagnostic('DEBUG','provider.write_accepted',{provider:'resend',operation:'visitor-confirmation',requestId,durationMs:Date.now()-confirmationStarted,result:'accepted',...(confirmationResult.providerRequestId?{providerRequestId:confirmationResult.providerRequestId}:{})});
    return json({ok:true});
  };
}

export const POST=createContactPost();
