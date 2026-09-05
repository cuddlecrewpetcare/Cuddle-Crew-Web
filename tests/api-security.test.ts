import test from 'node:test';
import assert from 'node:assert/strict';
import {dateRange,MAX_ICS_BYTES,MAX_ICS_EVENTS,parseIcsDate,publicAvailability,validIsoDate} from '../app/lib/availability.ts';
import {contactFingerprint,escapeHtml,validateContact} from '../app/lib/contact.ts';
import {assertSafePublicAnalyticsPayload,sanitizePublicEventProperties} from '../app/lib/public-analytics.ts';
import {clientKey,MAX_RATE_LIMIT_BUCKETS,pruneExpiredRateLimits,rateLimit,rateLimitBucketCountForTests,resetRateLimitsForTests} from '../app/lib/rate-limit.ts';
import {fetchWithTimeout,readJsonObject,readResponseJson,readResponseText,safeCalendarUrl} from '../app/lib/server-security.ts';
import * as availabilityRoute from '../app/api/availability/route.ts';
import * as addressCheckRoute from '../app/api/address/check/route.ts';
import * as addressSuggestionsRoute from '../app/api/address/suggestions/route.ts';
import * as contactRoute from '../app/api/contact/route.ts';
import * as estimateRoute from '../app/api/estimate/route.ts';
import {approvedSmsDisclosureText,smsConsentSource} from '../app/config/sms.ts';
import {resendDeliveryConfigured,sendResendEmail,type ResendMessage} from '../app/lib/providers/resend.ts';
import {verifyTurnstile} from '../app/lib/providers/turnstile.ts';
import type {ProviderResult} from '../app/lib/providers/errors.ts';

const validCalendar=(events='')=>`BEGIN:VCALENDAR\n${events}END:VCALENDAR`;
const contactEnvironment=()=>{
 const names=['RESEND_API_KEY','RESEND_SEND_ENABLED','NEXT_PUBLIC_TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY'] as const;
 const previous=Object.fromEntries(names.map(name=>[name,process.env[name]]));
 process.env.RESEND_API_KEY='synthetic-test-key';process.env.RESEND_SEND_ENABLED='true';delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;delete process.env.TURNSTILE_SECRET_KEY;
 return()=>{for(const name of names){const value=previous[name];if(value===undefined)delete process.env[name];else process.env[name]=value}};
};
const successfulSender=(messages:{message:ResendMessage;key:string}[])=>async(message:ResendMessage,key:string):Promise<ProviderResult>=>{messages.push({message,key});return{ok:true}};

test('strict JSON reader accepts known fields and rejects unknown or oversized bodies',async()=>{
 const valid=await readJsonObject(new Request('https://example.test',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({input:'Sacramento'})}),100,['input']);assert.equal(valid.ok,true);
 const unknown=await readJsonObject(new Request('https://example.test',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({input:'ok',admin:true})}),100,['input']);assert.deepEqual({ok:unknown.ok,status:unknown.status},{ok:false,status:400});
 const oversized=await readJsonObject(new Request('https://example.test',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({input:'x'.repeat(200)})}),100,['input']);assert.deepEqual({ok:oversized.ok,status:oversized.status},{ok:false,status:413});
 const wrongType=await readJsonObject(new Request('https://example.test',{method:'POST',body:'{}'}),100,[]);assert.equal(wrongType.status,415);
});

test('provider response readers stop at byte limits before parsing',async()=>{
 assert.deepEqual(await readResponseText(new Response('x'.repeat(101)),100),{ok:false,reason:'too-large'});
 assert.deepEqual(await readResponseJson(new Response('{not-json}'),100),{ok:false,reason:'invalid-json'});
 assert.deepEqual(await readResponseJson(new Response('{"ok":true}'),100),{ok:true,value:{ok:true}});
});

test('only a syntactically valid Cloudflare client IP is trusted',()=>{
 assert.equal(clientKey(new Request('https://example.test',{headers:{'x-forwarded-for':'203.0.113.10'}})),'unknown');
 assert.equal(clientKey(new Request('https://example.test',{headers:{'cf-connecting-ip':'203.0.113.10'}})),'203.0.113.10');
 assert.equal(clientKey(new Request('https://example.test',{headers:{'cf-connecting-ip':'not an ip'}})),'unknown');
});

test('rate limits fail closed and expired identifiers are pruned',()=>{resetRateLimitsForTests();assert.equal(rateLimit('test',2,60_000,1_000).allowed,true);assert.equal(rateLimit('test',2,60_000,1_001).allowed,true);assert.equal(rateLimit('test',2,60_000,1_002).allowed,false);assert.equal(pruneExpiredRateLimits(61_000),1);assert.equal(pruneExpiredRateLimits(61_001),0)});

test('rate-limit state has bounded key size and cardinality',()=>{
 resetRateLimitsForTests();
 assert.equal(rateLimit('x'.repeat(129),1,60_000,1_000).allowed,false);
 for(let index=0;index<MAX_RATE_LIMIT_BUCKETS;index++)assert.equal(rateLimit(`bounded:${index}`,1,60_000,1_000).allowed,true);
 assert.equal(rateLimitBucketCountForTests(),MAX_RATE_LIMIT_BUCKETS);
 assert.equal(rateLimit('bounded:overflow',1,60_000,1_000).allowed,false);
 assert.equal(pruneExpiredRateLimits(61_000),MAX_RATE_LIMIT_BUCKETS);
});

test('bounded fetch aborts a stalled provider',async()=>{
 const original=globalThis.fetch;globalThis.fetch=((_input:RequestInfo|URL,init?:RequestInit)=>new Promise((_resolve,reject)=>init?.signal?.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))))) as typeof fetch;
 try{await assert.rejects(()=>fetchWithTimeout('https://example.test',{},5),/Aborted/)}finally{globalThis.fetch=original}
});

test('provider deadline remains active through slow response-body consumption',async()=>{
 const stream=new ReadableStream<Uint8Array>({pull:()=>new Promise(()=>{})});
 const response=await fetchWithTimeout('https://example.test',{},5,(async()=>new Response(stream)) as typeof fetch);
 assert.deepEqual(await readResponseText(response,100),{ok:false,reason:'timeout'});
});

test('Resend adapter requires an explicit write gate and keeps credentials out of URLs',async()=>{
 const message={from:'Sender <sender@example.test>',to:['recipient@example.test'],reply_to:'reply@example.test',subject:'Synthetic message',text:'Synthetic body',html:'<p>Synthetic body</p>'};let calls=0,seenUrl='',seenInit:RequestInit|undefined;
 const fetcher=(async(input,init)=>{calls++;seenUrl=String(input);seenInit=init;return new Response('{}',{status:200,headers:{'x-request-id':'synthetic-request-id'}})}) as typeof fetch;
 assert.equal(resendDeliveryConfigured({RESEND_API_KEY:'synthetic-key',RESEND_SEND_ENABLED:'false'}),false);
 assert.deepEqual(await sendResendEmail(message,'contact/synthetic',{environment:{RESEND_API_KEY:'synthetic-key',RESEND_SEND_ENABLED:'false'},fetcher}),{ok:false,category:'AUTH_OR_CONFIG',outcome:'NOT_ATTEMPTED'});assert.equal(calls,0);
 assert.deepEqual(await sendResendEmail(message,'contact/synthetic',{environment:{RESEND_API_KEY:'synthetic-key',RESEND_SEND_ENABLED:'true'},fetcher}),{ok:true,providerRequestId:'synthetic-request-id'});assert.equal(calls,1);assert.equal(new URL(seenUrl).protocol,'https:');assert.equal(seenUrl.includes('synthetic-key'),false);assert.equal(new Headers(seenInit?.headers).get('idempotency-key'),'contact/synthetic');assert.equal(String(seenInit?.body),JSON.stringify(message));
});

test('provider adapter normalizes an unknown Resend timeout outcome without retrying',async()=>{
 const message={from:'Sender <sender@example.test>',to:['recipient@example.test'],reply_to:'reply@example.test',subject:'Synthetic message',text:'Synthetic body',html:'<p>Synthetic body</p>'};let calls=0;const fetcher=(async()=>{calls++;throw new DOMException('Aborted','AbortError')}) as typeof fetch;
 assert.deepEqual(await sendResendEmail(message,'contact/timeout',{environment:{RESEND_API_KEY:'synthetic-key',RESEND_SEND_ENABLED:'true'},fetcher}),{ok:false,category:'TIMEOUT',outcome:'UNKNOWN_OUTCOME'});assert.equal(calls,1);
});

test('Turnstile validates representative success and fails closed on malformed provider data',async()=>{
 let calls=0;const success=(async()=>{calls++;return new Response(JSON.stringify({success:true}),{status:200})}) as typeof fetch;assert.deepEqual(await verifyTurnstile('synthetic-token','203.0.113.40','synthetic-secret',success),{ok:true,verified:true});assert.equal(calls,1);
 const malformed=(async()=>new Response('{}',{status:200})) as typeof fetch;assert.deepEqual(await verifyTurnstile('synthetic-token','unknown','synthetic-secret',malformed),{ok:false,category:'UNKNOWN',outcome:'CONFIRMED_FAILURE'});
 const outage=(async()=>new Response(JSON.stringify({success:false,'error-codes':['internal-error']}),{status:200})) as typeof fetch;assert.deepEqual(await verifyTurnstile('synthetic-token','unknown','synthetic-secret',outage),{ok:false,category:'PROVIDER_UNAVAILABLE',outcome:'CONFIRMED_FAILURE'});
});

test('calendar URL validation permits public HTTPS and blocks local targets',()=>{assert.equal(safeCalendarUrl('webcal://calendar.example.com/feed'),'https://calendar.example.com/feed');assert.equal(safeCalendarUrl('http://calendar.example.com/feed'),undefined);assert.equal(safeCalendarUrl('https://127.0.0.1/feed'),undefined)});

test('calendar dates distinguish UTC, TZID, date-only, and ambiguous provider values',()=>{
 const utc=parseIcsDate('DTSTART:20260906T010000Z');assert.equal(utc?.kind,'instant');if(utc?.kind==='instant')assert.equal(utc.instant.toISOString(),'2026-09-06T01:00:00.000Z');
 const zoned=parseIcsDate('DTSTART;TZID=America/Los_Angeles:20260905T180000');assert.equal(zoned?.kind,'instant');if(zoned?.kind==='instant')assert.equal(zoned.instant.toISOString(),'2026-09-06T01:00:00.000Z');
 assert.deepEqual(parseIcsDate('DTSTART;VALUE=DATE:20260905'),{kind:'date',date:'2026-09-05'});
 assert.equal(parseIcsDate('DTSTART:20260905T180000'),null);
 assert.equal(parseIcsDate('DTSTART;TZID=Not/A_Zone:20260905T180000'),null);
 assert.equal(parseIcsDate('DTSTART;TZID=America/Los_Angeles:20260308T023000'),null);
 assert.equal(parseIcsDate('DTSTART;TZID=America/Los_Angeles:20261101T013000'),null);
 assert.throws(()=>publicAvailability(validCalendar('BEGIN:VEVENT\nDTSTART:20260905T180000\nEND:VEVENT\n'),['2026-09-05']),/calendar-time-ambiguous/);
});

test('calendar dates are real and availability dates stay in a no-store POST body',async()=>{assert.equal(validIsoDate('2028-02-29'),true);assert.equal(validIsoDate('2027-02-29'),false);assert.deepEqual(dateRange('2026-12-31','2027-01-01'),['2026-12-31','2027-01-01']);resetRateLimitsForTests();const previous=process.env.PRIVATE_CALENDAR_ICS_URL;delete process.env.PRIVATE_CALENDAR_ICS_URL;try{const response=await availabilityRoute.POST(new Request('https://example.test/api/availability',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({start:'2026-12-31',end:'2027-01-01'})}));assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');const payload=await response.json() as {days:{date:string;status:string}[]};assert.deepEqual(payload.days,[{date:'2026-12-31',status:'Request for Review'},{date:'2027-01-01',status:'Request for Review'}]);assert.equal('GET' in availabilityRoute,false)}finally{if(previous===undefined)delete process.env.PRIVATE_CALENDAR_ICS_URL;else process.env.PRIVATE_CALENDAR_ICS_URL=previous}});

test('availability provider failure returns a private, conservative fallback',async()=>{
 resetRateLimitsForTests();const previous=process.env.PRIVATE_CALENDAR_ICS_URL,originalFetch=globalThis.fetch;process.env.PRIVATE_CALENDAR_ICS_URL='https://calendar.example.com/private-feed';globalThis.fetch=(async()=>{throw new Error('synthetic provider failure')}) as typeof fetch;
 try{const response=await availabilityRoute.POST(new Request('https://example.test/api/availability',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.30'},body:JSON.stringify({start:'2099-01-02',end:'2099-01-02'})}));assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');const text=await response.text();assert.equal(text.includes('private-feed'),false);const payload=JSON.parse(text) as {source:string;days:{status:string}[]};assert.equal(payload.source,'fallback');assert.deepEqual(payload.days,[{date:'2099-01-02',status:'Request for Review'}])}finally{globalThis.fetch=originalFetch;if(previous===undefined)delete process.env.PRIVATE_CALENDAR_ICS_URL;else process.env.PRIVATE_CALENDAR_ICS_URL=previous}
});

test('malformed calendar provider data degrades to the conservative fallback',async()=>{
 resetRateLimitsForTests();const previous=process.env.PRIVATE_CALENDAR_ICS_URL,originalFetch=globalThis.fetch;process.env.PRIVATE_CALENDAR_ICS_URL='https://calendar.example.com/private-feed';globalThis.fetch=(async()=>new Response('not an ICS calendar',{status:200})) as typeof fetch;
 try{const response=await availabilityRoute.POST(new Request('https://example.test/api/availability',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.41'},body:JSON.stringify({start:'2099-01-02',end:'2099-01-02'})}));assert.equal(response.status,200);const payload=await response.json() as {source:string;state:string};assert.deepEqual(payload.source,'fallback');assert.equal(payload.state,'Request for Review')}finally{globalThis.fetch=originalFetch;if(previous===undefined)delete process.env.PRIVATE_CALENDAR_ICS_URL;else process.env.PRIVATE_CALENDAR_ICS_URL=previous}
});

test('calendar output is coarse and never exposes private event content',()=>{
 const secret='CLIENT: Private Person\nLOCATION: Home address';const result=publicAvailability(`BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART:20260901T230000Z\nDTEND:20260902T010000Z\nSUMMARY:${secret}\nEND:VEVENT\nEND:VCALENDAR`,['2026-09-01','2026-09-02']);
 assert.deepEqual(Object.keys(result.days[0]).sort(),['date','status']);assert.equal(JSON.stringify(result).includes('Private Person'),false);assert.equal(result.days.length,2);
});

test('public availability remains Request for Review with empty or busy calendars',()=>{
 const empty=publicAvailability(validCalendar(),['2026-09-01']),busy=publicAvailability(validCalendar('BEGIN:VEVENT\nDTSTART:20260901T180000Z\nDTEND:20260901T190000Z\nEND:VEVENT\n'),['2026-09-01']);
 for(const result of [empty,busy]){assert.equal(result.state,'Request for Review');assert.equal(result.days[0].status,'Request for Review')}
});

test('calendar resource and shape limits reject malformed, oversized, or flooded feeds',()=>{assert.throws(()=>publicAvailability('not a calendar',['2026-09-01']),/calendar-malformed/);assert.throws(()=>publicAvailability('x'.repeat(MAX_ICS_BYTES+1),['2026-09-01']),/calendar-too-large/);assert.throws(()=>publicAvailability(validCalendar('BEGIN:VEVENT\nEND:VEVENT\n'.repeat(MAX_ICS_EVENTS+1)),['2026-09-01']),/calendar-too-many-events/)});
test('calendar processing has a bounded deadline',()=>{let tick=0;assert.throws(()=>publicAvailability(validCalendar('BEGIN:VEVENT\nEND:VEVENT\n'.repeat(60)),['2026-09-01'],()=>tick++*101),/calendar-processing-time/)});

test('availability rejects an oversized streamed calendar before parsing',async()=>{
 resetRateLimitsForTests();const previous=process.env.PRIVATE_CALENDAR_ICS_URL,originalFetch=globalThis.fetch;process.env.PRIVATE_CALENDAR_ICS_URL='https://calendar.example.com/private-feed';globalThis.fetch=(async()=>new Response('x'.repeat(MAX_ICS_BYTES+1),{status:200})) as typeof fetch;
 try{const response=await availabilityRoute.POST(new Request('https://example.test/api/availability',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.43'},body:JSON.stringify({start:'2099-01-02',end:'2099-01-02'})}));assert.equal(response.status,200);assert.equal((await response.json() as {source:string}).source,'fallback')}finally{globalThis.fetch=originalFetch;if(previous===undefined)delete process.env.PRIVATE_CALENDAR_ICS_URL;else process.env.PRIVATE_CALENDAR_ICS_URL=previous}
});

test('contact validation normalizes safe values and rejects injection or bad fields',async()=>{
 const base={name:'Lauren Test',replyTo:'USER@Example.com',phone:'(916) 555-1212',smsConsent:false,zip:'95814',topic:'Availability or scheduling',message:'Please tell me about availability.',website:'',turnstileToken:''};
 const valid=validateContact(base);assert.equal(valid.ok&&!valid.honeypot&&valid.data.replyTo,'user@example.com');assert.equal(valid.ok&&!valid.honeypot&&valid.data.phone,'9165551212');
 assert.equal(valid.ok&&!valid.honeypot&&valid.data.smsConsent,false);assert.equal(validateContact({...base,phone:'',smsConsent:true}).ok,false);
 for(const malformed of ['true','1',1]){const result=validateContact({...base,smsConsent:malformed});assert.equal(result.ok&&!result.honeypot&&result.data.smsConsent,false)}
 assert.equal(validateContact({...base,name:'Bad\r\nBcc: victim@example.com'}).ok,false);assert.equal(validateContact({...base,replyTo:'bad\r\n@example.com'}).ok,false);assert.equal(validateContact({...base,topic:'Injected topic'}).ok,false);assert.equal(escapeHtml('<script>'),'&lt;script&gt;');
 if(valid.ok&&!valid.honeypot){const fingerprintData={name:valid.data.name,replyTo:valid.data.replyTo,phone:valid.data.phone,smsConsent:valid.data.smsConsent,zip:valid.data.zip,topic:valid.data.topic,message:valid.data.message};assert.equal(await contactFingerprint(fingerprintData),await contactFingerprint(fingerprintData));assert.notEqual(await contactFingerprint(fingerprintData),await contactFingerprint({...fingerprintData,smsConsent:true}));assert.notEqual(await contactFingerprint(fingerprintData),await contactFingerprint({...fingerprintData,zip:'95815'}))}
});

test('canonical SMS disclosure contains the complete approved wording',()=>{
 assert.equal(approvedSmsDisclosureText,'I agree to receive text messages from Cuddle Crew Pet Care regarding service inquiries, scheduling, appointment confirmations and reminders, pet-care updates, billing, and customer support. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for assistance. Review our Privacy Policy to learn how your information is used.');
 assert.equal(smsConsentSource,'website_contact_form');
});

test('contact live delivery is blocked unless the provider-specific write gate is enabled',async()=>{
 resetRateLimitsForTests();contactRoute.resetContactAttemptsForTests();const previousKey=process.env.RESEND_API_KEY,previousGate=process.env.RESEND_SEND_ENABLED,originalFetch=globalThis.fetch;process.env.RESEND_API_KEY='synthetic-key';process.env.RESEND_SEND_ENABLED='false';let calls=0;globalThis.fetch=(async()=>{calls++;throw new Error('must not call provider')}) as typeof fetch;
 try{const response=await contactRoute.POST(new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:'{}'}));assert.equal(response.status,503);assert.equal(response.headers.get('cache-control'),'no-store');assert.deepEqual(await response.json(),{error:'Contact delivery is not configured.'});assert.equal(calls,0)}finally{globalThis.fetch=originalFetch;if(previousKey===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=previousKey;if(previousGate===undefined)delete process.env.RESEND_SEND_ENABLED;else process.env.RESEND_SEND_ENABLED=previousGate}
});

test('contact endpoint accepts valid requests, suppresses duplicates, and exposes no unsupported method',async()=>{
 resetRateLimitsForTests();contactRoute.resetContactAttemptsForTests();const restore=contactEnvironment(),messages:{message:ResendMessage;key:string}[]=[];const post=contactRoute.createContactPost(successfulSender(messages));
 const body={name:'Route Tester',replyTo:'route@example.com',phone:'9165551212',smsConsent:true,zip:'95814',topic:'Other',message:'A valid route-level test message.',website:'',turnstileToken:''};
 try{const request=(value=body)=>new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.20'},body:JSON.stringify(value)});const first=await post(request()),second=await post(request()),changedZip=await post(request({...body,zip:'95815'}));assert.equal(first.status,200);assert.deepEqual(await second.json(),{ok:true,duplicate:true});assert.equal(changedZip.status,200);assert.equal(messages.length,4);assert.match(messages[0].message.text,/SMS consent: Granted/);assert.match(messages[0].message.text,/SMS consent source: website_contact_form/);assert.match(messages[0].message.text,/SMS consent timestamp: 20/);assert.match(messages[0].key,/^contact\/[0-9a-f-]{36}$/);assert.match(messages[1].key,/^confirmation\/[0-9a-f-]{36}$/);assert.notEqual(messages[0].key.split('/')[1],messages[2].key.split('/')[1]);assert.equal('GET' in contactRoute,false)}finally{restore()}
});

test('client timestamps cannot control contact security timing',async()=>{
 resetRateLimitsForTests();contactRoute.resetContactAttemptsForTests();const restore=contactEnvironment(),messages:{message:ResendMessage;key:string}[]=[];const post=contactRoute.createContactPost(successfulSender(messages));
 const body={name:'Clock Tester',replyTo:'clock@example.com',phone:'',smsConsent:false,zip:'95814',topic:'Other',message:'A valid immediate contact inquiry.',website:'',turnstileToken:''};
 try{
  const request=(value:Record<string,unknown>)=>new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.60'},body:JSON.stringify(value)});
  const immediate=await post(request(body));assert.equal(immediate.status,200);assert.equal(messages.length,2);
  for(const startedAt of [-1,0,Date.now()+86_400_000]){const forged=await post(request({...body,replyTo:`clock-${startedAt}@example.com`,startedAt}));assert.equal(forged.status,400);assert.deepEqual(await forged.json(),{error:'Request contains unsupported fields.'})}
  assert.equal(messages.length,2);
 }finally{restore()}
});

test('contact duplicate expiry uses a controlled monotonic clock without sleeping',async()=>{
 resetRateLimitsForTests();contactRoute.resetContactAttemptsForTests();const restore=contactEnvironment(),messages:{message:ResendMessage;key:string}[]=[];let now=1_000;const post=contactRoute.createContactPost(successfulSender(messages),()=>now,()=>new Date('2026-09-05T12:00:00Z'));
 const body={name:'Expiry Tester',replyTo:'expiry@example.com',phone:'',smsConsent:false,zip:'95814',topic:'Other',message:'A deterministic duplicate-window inquiry.',website:'',turnstileToken:''};
 const request=()=>new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.61'},body:JSON.stringify(body)});
 try{assert.equal((await post(request())).status,200);assert.equal(messages.length,2);now=120_999;assert.deepEqual(await (await post(request())).json(),{ok:true,duplicate:true});assert.equal(messages.length,2);now=121_000;assert.equal((await post(request())).status,200);assert.equal(messages.length,4)}finally{restore()}
});

test('contact endpoint preserves non-consent and rejects forged consent metadata',async()=>{
 resetRateLimitsForTests();contactRoute.resetContactAttemptsForTests();const restore=contactEnvironment(),messages:{message:ResendMessage;key:string}[]=[];const post=contactRoute.createContactPost(successfulSender(messages));
 const base={name:'No Consent Tester',replyTo:'no-consent@example.com',phone:'9165553434',smsConsent:false,zip:'95814',topic:'Other',message:'Please reply to this inquiry by email.',website:'',turnstileToken:''};
 try{const unchecked=await post(new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.21'},body:JSON.stringify(base)}));assert.equal(unchecked.status,200);assert.equal(messages.length,2);assert.match(messages[0].message.text,/SMS consent: Not granted/);assert.doesNotMatch(messages[0].message.text,/SMS consent source|SMS consent timestamp/);const forged=await post(new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.22'},body:JSON.stringify({...base,name:'Forged Metadata',replyTo:'forged@example.com',smsConsentTimestamp:'2099-01-01T00:00:00.000Z',smsConsentSource:'verbal_consent'})}));assert.equal(forged.status,400);assert.equal(messages.length,2)}finally{restore()}
});

test('contact endpoint returns a safe schema error without reflecting submitted data',async()=>{resetRateLimitsForTests();contactRoute.resetContactAttemptsForTests();const restore=contactEnvironment(),post=contactRoute.createContactPost(async()=>{throw new Error('must not send')});try{const response=await post(new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({secretPayload:'do not reflect'})}));assert.equal(response.status,400);assert.equal((await response.text()).includes('do not reflect'),false)}finally{restore()}});

test('contact provider failure is bounded to one attempted delivery and returns a safe error',async()=>{
 resetRateLimitsForTests();contactRoute.resetContactAttemptsForTests();const restore=contactEnvironment(),originalError=console.error;let calls=0;const post=contactRoute.createContactPost(async()=>{calls++;return{ok:false,category:'PROVIDER_UNAVAILABLE',outcome:'CONFIRMED_FAILURE',status:503}});console.error=()=>{};
 const body={name:'Failure Path Visitor',replyTo:'failure-path@example.com',phone:'9165550100',smsConsent:false,zip:'95814',topic:'Other',message:'Synthetic failure-path inquiry.',website:'',turnstileToken:''};
 try{const response=await post(new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.31'},body:JSON.stringify(body)}));assert.equal(response.status,502);assert.equal(calls,1);const text=await response.text();assert.deepEqual(JSON.parse(text),{error:'Unable to send inquiry.'});for(const privateValue of [body.name,body.replyTo,body.phone,body.message])assert.equal(text.includes(String(privateValue)),false)}finally{console.error=originalError;restore()}
});

test('contact retries an unknown email outcome only with the same payload and idempotency key',async()=>{
 resetRateLimitsForTests();contactRoute.resetContactAttemptsForTests();const restore=contactEnvironment(),originalError=console.error,calls:{message:ResendMessage;key:string}[]=[];let first=true;const post=contactRoute.createContactPost(async(message,key)=>{calls.push({message,key});if(first){first=false;return{ok:false,category:'TIMEOUT',outcome:'UNKNOWN_OUTCOME'}}return{ok:true}});console.error=()=>{};
 const body={name:'Retry Tester',replyTo:'retry@example.com',phone:'9165550101',smsConsent:true,zip:'95814',topic:'Other',message:'Synthetic unknown-outcome inquiry.',website:'',turnstileToken:''};
 const request=()=>new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.34'},body:JSON.stringify(body)});
 try{assert.equal((await post(request())).status,503);assert.equal((await post(request())).status,200);assert.equal(calls.length,3);assert.equal(calls[0].key,calls[1].key);assert.deepEqual(calls[0].message,calls[1].message)}finally{console.error=originalError;restore()}
});

test('contact treats confirmation failure as partial success and suppresses a duplicate business message',async()=>{
 resetRateLimitsForTests();contactRoute.resetContactAttemptsForTests();const restore=contactEnvironment(),originalError=console.error;let calls=0;const post=contactRoute.createContactPost(async()=>{calls++;return calls===2?{ok:false,category:'PROVIDER_UNAVAILABLE',outcome:'CONFIRMED_FAILURE',status:503}:{ok:true}});console.error=()=>{};
 const body={name:'Partial Success',replyTo:'partial@example.com',phone:'',smsConsent:false,zip:'95814',topic:'Other',message:'Synthetic partial-success inquiry.',website:'',turnstileToken:''};const request=()=>new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.35'},body:JSON.stringify(body)});
 try{assert.equal((await post(request())).status,200);assert.deepEqual(await (await post(request())).json(),{ok:true,duplicate:true});assert.equal(calls,2)}finally{console.error=originalError;restore()}
});

test('contact duplicate state refuses new fingerprints at its fixed capacity',async()=>{
 resetRateLimitsForTests();contactRoute.resetContactAttemptsForTests();const restore=contactEnvironment(),post=contactRoute.createContactPost(async()=>({ok:true})),originalInfo=console.info,originalWarn=console.warn;console.info=()=>{};console.warn=()=>{};
 const request=(index:number)=>new Request('https://example.test/api/contact',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':`2001:db8::${index.toString(16)}`},body:JSON.stringify({name:`Capacity Tester ${index}`,replyTo:`capacity-${index}@example.com`,phone:'',smsConsent:false,zip:'95814',topic:'Other',message:`Synthetic capacity inquiry number ${index}.`,website:'',turnstileToken:''})});
 try{for(let index=0;index<contactRoute.MAX_RECENT_CONTACT_ATTEMPTS;index++)assert.equal((await post(request(index))).status,200);assert.equal(contactRoute.contactAttemptCountForTests(),contactRoute.MAX_RECENT_CONTACT_ATTEMPTS);const overflow=await post(request(contactRoute.MAX_RECENT_CONTACT_ATTEMPTS));assert.equal(overflow.status,503);assert.equal(overflow.headers.get('retry-after'),'120');assert.equal(contactRoute.contactAttemptCountForTests(),contactRoute.MAX_RECENT_CONTACT_ATTEMPTS)}finally{console.info=originalInfo;console.warn=originalWarn;restore();contactRoute.resetContactAttemptsForTests();resetRateLimitsForTests()}
});

test('address routes fail closed without configuration and never call providers',async()=>{
 resetRateLimitsForTests();const previousKey=process.env.GOOGLE_MAPS_SERVER_KEY,previousOrigin=process.env.PRIVATE_SERVICE_ORIGIN,originalFetch=globalThis.fetch;delete process.env.GOOGLE_MAPS_SERVER_KEY;delete process.env.PRIVATE_SERVICE_ORIGIN;globalThis.fetch=(async()=>{throw new Error('provider must not be called')}) as typeof fetch;
 const request=(path:string,body:Record<string,unknown>,ip:string)=>new Request(`https://example.test${path}`,{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':ip},body:JSON.stringify(body)});
 try{const suggestions=await addressSuggestionsRoute.POST(request('/api/address/suggestions',{input:'123 Example Street'},'203.0.113.32')),check=await addressCheckRoute.POST(request('/api/address/check',{address:'123 Example Street'},'203.0.113.33'));assert.equal(suggestions.status,503);assert.equal(check.status,503);assert.equal(suggestions.headers.get('cache-control'),'no-store');assert.equal(check.headers.get('cache-control'),'no-store');assert.deepEqual(await suggestions.json(),{available:false,suggestions:[]});assert.deepEqual(await check.json(),{available:false})}finally{globalThis.fetch=originalFetch;if(previousKey===undefined)delete process.env.GOOGLE_MAPS_SERVER_KEY;else process.env.GOOGLE_MAPS_SERVER_KEY=previousKey;if(previousOrigin===undefined)delete process.env.PRIVATE_SERVICE_ORIGIN;else process.env.PRIVATE_SERVICE_ORIGIN=previousOrigin}
});

test('address validation keeps the Maps key out of the URL and rejects malformed provider data',async()=>{
 resetRateLimitsForTests();const previousKey=process.env.GOOGLE_MAPS_SERVER_KEY,previousOrigin=process.env.PRIVATE_SERVICE_ORIGIN,originalFetch=globalThis.fetch;process.env.GOOGLE_MAPS_SERVER_KEY='synthetic-maps-key';process.env.PRIVATE_SERVICE_ORIGIN='Synthetic private origin';let seenUrl='',seenHeaders=new Headers();globalThis.fetch=(async(input,init)=>{seenUrl=String(input);seenHeaders=new Headers(init?.headers);return new Response('{}',{status:200})}) as typeof fetch;
 const request=new Request('https://example.test/api/address/check',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.42'},body:JSON.stringify({address:'123 Example Street, Sacramento, CA'})});
 try{const response=await addressCheckRoute.POST(request);assert.equal(response.status,503);assert.equal(seenUrl,'https://addressvalidation.googleapis.com/v1:validateAddress');assert.equal(seenUrl.includes('synthetic-maps-key'),false);assert.equal(seenHeaders.get('x-goog-api-key'),'synthetic-maps-key');assert.deepEqual(await response.json(),{available:false})}finally{globalThis.fetch=originalFetch;if(previousKey===undefined)delete process.env.GOOGLE_MAPS_SERVER_KEY;else process.env.GOOGLE_MAPS_SERVER_KEY=previousKey;if(previousOrigin===undefined)delete process.env.PRIVATE_SERVICE_ORIGIN;else process.env.PRIVATE_SERVICE_ORIGIN=previousOrigin}
});

test('address providers reject oversized response bodies',async()=>{
 resetRateLimitsForTests();const previousKey=process.env.GOOGLE_MAPS_SERVER_KEY,previousOrigin=process.env.PRIVATE_SERVICE_ORIGIN,originalFetch=globalThis.fetch;process.env.GOOGLE_MAPS_SERVER_KEY='synthetic-maps-key';process.env.PRIVATE_SERVICE_ORIGIN='Synthetic private origin';globalThis.fetch=(async()=>new Response('x'.repeat(addressCheckRoute.MAX_ADDRESS_VALIDATION_RESPONSE_BYTES+1),{status:200})) as typeof fetch;
 const request=new Request('https://example.test/api/address/check',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.44'},body:JSON.stringify({address:'123 Example Street, Sacramento, CA'})});
 try{const response=await addressCheckRoute.POST(request);assert.equal(response.status,503);assert.deepEqual(await response.json(),{available:false})}finally{globalThis.fetch=originalFetch;if(previousKey===undefined)delete process.env.GOOGLE_MAPS_SERVER_KEY;else process.env.GOOGLE_MAPS_SERVER_KEY=previousKey;if(previousOrigin===undefined)delete process.env.PRIVATE_SERVICE_ORIGIN;else process.env.PRIVATE_SERVICE_ORIGIN=previousOrigin}
});

test('analytics keeps only bounded public dimensions and asserts on sensitive fields in development',()=>{assert.deepEqual(sanitizePublicEventProperties({status:'available',email:'person@example.com',duration:Infinity}),{status:'available'});assert.throws(()=>assertSafePublicAnalyticsPayload({homeAddress:'secret'}),/Prohibited analytics property/)});

test('estimate API returns a neutral review outcome without private trigger reasons',async()=>{
 resetRateLimitsForTests();const response=await estimateRoute.POST(new Request('https://example.test/api/estimate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({pets:[{type:'dog'},{type:'dog'},{type:'dog'},{type:'dog'}],service:'drop30',start:'2099-01-02',end:'2099-01-02',blocks:[0],midday:'none',zip:'95821',travelTier:'standard'})}));
 assert.equal(response.status,200);const payload=await response.json() as {result:Record<string,unknown>};assert.equal(payload.result.reviewRequired,true);assert.equal(payload.result.total,null);assert.equal('reviewReasons' in payload.result,false);
});

test('estimate API rejects unbounded or malformed planning inputs',async()=>{
 resetRateLimitsForTests();const request=(change:Record<string,unknown>)=>estimateRoute.POST(new Request('https://example.test/api/estimate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({pets:[{type:'dog'}],service:'drop30',start:'2099-01-02',end:'2099-01-02',blocks:[0],midday:'none',zip:'95821',travelTier:'standard',...change})}));
 assert.equal((await request({end:'2199-01-02'})).status,400);assert.equal((await request({start:'not-a-date'})).status,400);assert.equal((await request({zip:'9582'})).status,400);assert.equal((await request({service:'boarding'})).status,400);
});
