import test from 'node:test';
import assert from 'node:assert/strict';
import {dateRange,MAX_ICS_BYTES,MAX_ICS_EVENTS,publicAvailability,validIsoDate} from '../app/lib/availability.ts';
import {contactFingerprint,escapeHtml,validateContact} from '../app/lib/contact.ts';
import {assertSafePublicAnalyticsPayload,sanitizePublicEventProperties} from '../app/lib/public-analytics.ts';
import {clientKey,rateLimit,resetRateLimitsForTests} from '../app/lib/rate-limit.ts';
import {fetchWithTimeout,readJsonObject,safeCalendarUrl} from '../app/lib/server-security.ts';
import * as contactRoute from '../app/api/contact/route.ts';
import {approvedSmsDisclosureText,smsConsentSource} from '../app/config/sms.ts';

test('strict JSON reader accepts known fields and rejects unknown or oversized bodies',async()=>{
 const valid=await readJsonObject(new Request('https://example.test',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({input:'Sacramento'})}),100,['input']);assert.equal(valid.ok,true);
 const unknown=await readJsonObject(new Request('https://example.test',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({input:'ok',admin:true})}),100,['input']);assert.deepEqual({ok:unknown.ok,status:unknown.status},{ok:false,status:400});
 const oversized=await readJsonObject(new Request('https://example.test',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({input:'x'.repeat(200)})}),100,['input']);assert.deepEqual({ok:oversized.ok,status:oversized.status},{ok:false,status:413});
 const wrongType=await readJsonObject(new Request('https://example.test',{method:'POST',body:'{}'}),100,[]);assert.equal(wrongType.status,415);
});

test('only a syntactically valid Cloudflare client IP is trusted',()=>{
 assert.equal(clientKey(new Request('https://example.test',{headers:{'x-forwarded-for':'203.0.113.10'}})),'unknown');
 assert.equal(clientKey(new Request('https://example.test',{headers:{'cf-connecting-ip':'203.0.113.10'}})),'203.0.113.10');
 assert.equal(clientKey(new Request('https://example.test',{headers:{'cf-connecting-ip':'not an ip'}})),'unknown');
});

test('rate limits fail closed after the configured allowance',()=>{resetRateLimitsForTests();assert.equal(rateLimit('test',2,60_000).allowed,true);assert.equal(rateLimit('test',2,60_000).allowed,true);assert.equal(rateLimit('test',2,60_000).allowed,false)});

test('bounded fetch aborts a stalled provider',async()=>{
 const original=globalThis.fetch;globalThis.fetch=((_input:RequestInfo|URL,init?:RequestInit)=>new Promise((_resolve,reject)=>init?.signal?.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))))) as typeof fetch;
 try{await assert.rejects(()=>fetchWithTimeout('https://example.test',{},5),/Aborted/)}finally{globalThis.fetch=original}
});

test('calendar URL validation permits public HTTPS and blocks local targets',()=>{assert.equal(safeCalendarUrl('webcal://calendar.example.com/feed'),'https://calendar.example.com/feed');assert.equal(safeCalendarUrl('http://calendar.example.com/feed'),undefined);assert.equal(safeCalendarUrl('https://127.0.0.1/feed'),undefined)});

test('calendar dates are real and ranges cross midnight safely',()=>{assert.equal(validIsoDate('2028-02-29'),true);assert.equal(validIsoDate('2027-02-29'),false);assert.deepEqual(dateRange('2026-12-31','2027-01-01'),['2026-12-31','2027-01-01'])});

test('calendar output is coarse and never exposes private event content',()=>{
 const secret='CLIENT: Private Person\nLOCATION: Home address';const result=publicAvailability(`BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART:20260901T230000Z\nDTEND:20260902T010000Z\nSUMMARY:${secret}\nEND:VEVENT\nEND:VCALENDAR`,['2026-09-01','2026-09-02']);
 assert.deepEqual(Object.keys(result.days[0]).sort(),['date','status']);assert.equal(JSON.stringify(result).includes('Private Person'),false);assert.equal(result.days.length,2);
});

test('calendar resource limits reject oversized feeds and event floods',()=>{assert.throws(()=>publicAvailability('x'.repeat(MAX_ICS_BYTES+1),['2026-09-01']),/calendar-too-large/);assert.throws(()=>publicAvailability('BEGIN:VEVENT\nEND:VEVENT\n'.repeat(MAX_ICS_EVENTS+1),['2026-09-01']),/calendar-too-many-events/)});
test('calendar processing has a bounded deadline',()=>{let tick=0;assert.throws(()=>publicAvailability('BEGIN:VEVENT\nEND:VEVENT\n'.repeat(60),['2026-09-01'],()=>tick++*101),/calendar-processing-time/)});

test('contact validation normalizes safe values and rejects injection or bad fields',async()=>{
 const base={name:'Lauren Test',replyTo:'USER@Example.com',phone:'(916) 555-1212',smsConsent:false,zip:'95814',topic:'Availability or scheduling',message:'Please tell me about availability.',website:'',startedAt:Date.now()-4000,turnstileToken:''};
 const valid=validateContact(base);assert.equal(valid.ok&&!valid.honeypot&&valid.data.replyTo,'user@example.com');assert.equal(valid.ok&&!valid.honeypot&&valid.data.phone,'9165551212');
 assert.equal(valid.ok&&!valid.honeypot&&valid.data.smsConsent,false);assert.equal(validateContact({...base,phone:'',smsConsent:true}).ok,false);assert.equal(validateContact({...base,smsConsent:'true'}).ok,true);
 assert.equal(validateContact({...base,name:'Bad\r\nBcc: victim@example.com'}).ok,false);assert.equal(validateContact({...base,replyTo:'bad\r\n@example.com'}).ok,false);assert.equal(validateContact({...base,topic:'Injected topic'}).ok,false);assert.equal(escapeHtml('<script>'),'&lt;script&gt;');
 if(valid.ok&&!valid.honeypot){const fingerprintData={name:valid.data.name,replyTo:valid.data.replyTo,phone:valid.data.phone,smsConsent:valid.data.smsConsent,topic:valid.data.topic,message:valid.data.message};assert.equal(await contactFingerprint(fingerprintData),await contactFingerprint(fingerprintData));assert.notEqual(await contactFingerprint(fingerprintData),await contactFingerprint({...fingerprintData,smsConsent:true}))}
});

test('canonical SMS disclosure contains the complete approved wording',()=>{
 assert.equal(approvedSmsDisclosureText,'I agree to receive text messages from Cuddle Crew Pet Care regarding service inquiries, scheduling, appointment confirmations and reminders, pet-care updates, billing, and customer support. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for assistance. Review our Privacy Policy to learn how your information is used.');
 assert.equal(smsConsentSource,'website_contact_form');
});

test('contact endpoint accepts valid requests, suppresses duplicates, and exposes no unsupported method',async()=>{
 resetRateLimitsForTests();const previousKey=process.env.RESEND_API_KEY,previousSite=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,previousSecret=process.env.TURNSTILE_SECRET_KEY,originalFetch=globalThis.fetch;process.env.RESEND_API_KEY='test-key';delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;delete process.env.TURNSTILE_SECRET_KEY;let calls=0;const sentBodies:string[]=[];globalThis.fetch=(async(_input,init)=>{calls++;sentBodies.push(String(init?.body||''));return new Response('{}',{status:200})}) as typeof fetch;
 const body={name:'Route Tester',replyTo:'route@example.com',phone:'9165551212',smsConsent:true,zip:'95814',topic:'Other',message:'A valid route-level test message.',website:'',startedAt:Date.now()-4000,turnstileToken:''};
 try{const request=()=>new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.20'},body:JSON.stringify(body)});const first=await contactRoute.POST(request()),second=await contactRoute.POST(request());assert.equal(first.status,200);assert.deepEqual(await second.json(),{ok:true,duplicate:true});assert.equal(calls,2);assert.match(sentBodies[0],/SMS consent: Granted/);assert.match(sentBodies[0],/SMS consent source: website_contact_form/);assert.match(sentBodies[0],/SMS consent timestamp: 20/);assert.equal('GET' in contactRoute,false)}finally{globalThis.fetch=originalFetch;if(previousKey===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=previousKey;if(previousSite===undefined)delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;else process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY=previousSite;if(previousSecret===undefined)delete process.env.TURNSTILE_SECRET_KEY;else process.env.TURNSTILE_SECRET_KEY=previousSecret}
});

test('contact endpoint returns a safe schema error without reflecting submitted data',async()=>{resetRateLimitsForTests();const previous=process.env.RESEND_API_KEY;process.env.RESEND_API_KEY='test-key';try{const response=await contactRoute.POST(new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({secretPayload:'do not reflect'})}));assert.equal(response.status,400);assert.equal((await response.text()).includes('do not reflect'),false)}finally{if(previous===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=previous}});

test('analytics keeps only bounded public dimensions and asserts on sensitive fields in development',()=>{assert.deepEqual(sanitizePublicEventProperties({status:'available',email:'person@example.com',duration:Infinity}),{status:'available'});assert.throws(()=>assertSafePublicAnalyticsPayload({homeAddress:'secret'}),/Prohibited analytics property/)});
