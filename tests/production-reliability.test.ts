import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import test from 'node:test';
import {resolve} from 'node:path';
import {GET as healthCheck} from '../app/api/health/route.ts';

test('health endpoint returns only safe operational fields',async()=>{
  const response=healthCheck();
  const payload=await response.json() as Record<string,unknown>;

  assert.equal(response.status,200);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.match(response.headers.get('X-Request-ID')||'',/^[0-9a-f-]{36}$/);
  assert.deepEqual(Object.keys(payload).sort(),['status','timestamp']);
  assert.equal(payload.status,'ok');
  assert.equal(typeof payload.timestamp,'string');
  assert.equal(Number.isNaN(Date.parse(payload.timestamp as string)),false);
});

test('mobile navigation remains visible until JavaScript enhances it',()=>{
  const header=readFileSync(resolve('app/SiteHeader.tsx'),'utf8');
  const styles=readFileSync(resolve('app/globals.css'),'utf8');

  assert.match(header,/const navRef=useRef<HTMLElement>\(null\)/);
  assert.match(header,/navRef\.current\?\.classList\.add\('is-enhanced'\)/);
  assert.match(header,/<nav ref=\{navRef\} className="nav shell"/);
  assert.match(styles,/\.sticky-header \.nav-links\{display:flex;position:static/);
  assert.match(styles,/\.nav\.is-enhanced \.nav-links\{display:none;position:absolute/);
  assert.match(styles,/\.nav\.is-enhanced \.nav-links\.is-open\{display:flex\}/);
});

test('start page keeps one primary first step and clear planning pathways',()=>{
  const start=readFileSync(resolve('app/start/page.tsx'),'utf8');
  assert.match(start,/New-client orientation/);assert.match(start,/From exploring to confirmed care/);assert.match(start,/Create your secure profile/);assert.match(start,/Open your Precise Petcare account/);assert.match(start,/href:'\/rates#estimate'/);assert.match(start,/href:'\/service-area'/);assert.match(start,/Only an approved Precise Petcare quote and confirmed booking/);
});

test('ZIP-only service-area UI cannot assign a fee',()=>{
  const tools=readFileSync(resolve('app/ServiceAreaTools.tsx'),'utf8');
  const area=readFileSync(resolve('app/service-area/page.tsx'),'utf8');
  assert.match(tools,/ZIP-only fallback/);assert.match(tools,/Personalized travel review required/);assert.match(tools,/cannot determine an approved travel tier/);assert.match(area,/a ZIP alone cannot assign one/);assert.doesNotMatch(tools,/ServiceAreaMap|Core ZIPs|Standard ZIPs/);
});

test('contact errors receive focus while preserving entered values for recovery',()=>{
  const contact=readFileSync(resolve('app/contact/ContactTools.tsx'),'utf8');
  assert.match(contact,/errorRef\.current\?\.focus\(\)/);assert.match(contact,/ref=\{errorRef\}/);assert.match(contact,/tabIndex=\{-1\}/);
});

test('contact form presents separate optional SMS consent with visible privacy linkage',()=>{
  const contact=readFileSync(resolve('app/contact/ContactTools.tsx'),'utf8');
  const sms=readFileSync(resolve('app/config/sms.ts'),'utf8');
  const privacy=readFileSync(resolve('app/privacy/page.tsx'),'utf8');
  const terms=readFileSync(resolve('app/terms/page.tsx'),'utf8');
  assert.match(contact,/useState\(false\)/);assert.match(contact,/id="contact-phone" name="phone"/);assert.match(contact,/autoComplete="tel" type="tel"/);assert.match(contact,/id="sms-consent" name="smsConsent" type="checkbox"/);assert.match(contact,/href="\/privacy"/);assert.match(contact,/required=\{smsConsent\}/);
  for(const phrase of ['Cuddle Crew Pet Care','Message frequency varies','Message and data rates may apply','Reply STOP','HELP for assistance','Privacy Policy'])assert.match(sms,new RegExp(phrase));
  for(const purpose of ['service inquiries','scheduling','appointment confirmations and reminders','pet-care updates','billing','customer support'])assert.match(privacy,new RegExp(purpose));
  assert.match(privacy,/Mobile information and SMS consent will not be sold, rented, or shared with third parties for their marketing or promotional purposes/);
  for(const phrase of ['SMS is optional','Message frequency varies','Message and data rates may apply','Reply STOP','HELP for assistance','SMS consent is not required to purchase Services','separate from accepting these Terms'])assert.match(terms,new RegExp(phrase));
});

test('SEO metadata and schema use the verified business profile without unsupported review claims',()=>{
  const layout=readFileSync(resolve('app/layout.tsx'),'utf8');
  const business=readFileSync(resolve('app/config/business.ts'),'utf8');

  assert.match(business,/website: 'https:\/\/www\.cuddlecrewpetcare\.com'/);
  assert.match(business,/city: 'Carmichael'/);
  assert.match(layout,/'@type': 'LocalBusiness'/);
  assert.match(layout,/'@type': 'WebSite'/);
  assert.match(layout,/telephone: business\.phoneE164/);
  assert.match(layout,/areaServed: business\.location\.territory/);
  assert.doesNotMatch(layout,/AggregateRating|Review/);
});

test('public index routes retain canonical and social metadata while retired routes redirect',()=>{
  const sitemap=readFileSync(resolve('app/sitemap.ts'),'utf8');
  const robots=readFileSync(resolve('app/robots.ts'),'utf8');
  const proxy=readFileSync(resolve('proxy.ts'),'utf8');
  const routes=['start','services','rates','service-area','gallery','choosing-care','holidays','privacy','terms'];

  assert.match(sitemap,/SITE_INDEXING_ENABLED/);
  assert.match(sitemap,/\/choosing-care/);
  assert.match(robots,/SITE_INDEXING_ENABLED/);
  assert.match(proxy,/['\"]\/about['\"]:\s*['\"]\/#meet-lauren['\"]/);
  assert.doesNotMatch(proxy,/['\"]\/(services|rates|service-area)['\"]:/);
  for(const route of routes){
    const source=readFileSync(resolve(`app/${route}/page.tsx`),'utf8');
    assert.match(source,/alternates:\{canonical:/);
    assert.match(source,/openGraph:/);
  }
});

test('home keeps orientation concise while dedicated routes own interactive tools and detailed rates',()=>{
  const home=readFileSync(resolve('app/page.tsx'),'utf8');
  const rates=readFileSync(resolve('app/rates/page.tsx'),'utf8');
  const estimator=readFileSync(resolve('app/RatesEstimator.tsx'),'utf8');
  const area=readFileSync(resolve('app/service-area/page.tsx'),'utf8');
  const areaTools=readFileSync(resolve('app/ServiceAreaTools.tsx'),'utf8');

  assert.doesNotMatch(home,/QuoteEstimator|AddressChecker|estimate-fields|address-checker/);
  assert.match(estimator,/dynamic\(\(\)=>import\('\.\/QuoteEstimator'\),\{ssr:false/);
  assert.match(estimator,/Loading the planning estimator/);
  assert.match(rates,/<RatesEstimator\/>/);
  assert.match(area,/<ServiceAreaTools\/>/);
  assert.match(areaTools,/AddressChecker/);
  assert.match(home,/\$\{business\.pricing\.drop30\.dog\}/);
  assert.match(home,/\$\{business\.pricing\.walk30\}/);
  assert.match(home,/business\.pricing\.overnight\.dog/);
  assert.match(home,/business\.pricing\.continuous24Starting/);
  assert.match(rates,/business\.pricing\.drop90\.dog/);
  assert.match(rates,/business\.pricing\.overnightMidday30\.dog/);
  assert.match(rates,/business\.pricing\.continuous/);
  assert.doesNotMatch(home,/Insured|bonded|GPS tracking|Stripe Climate|No sales tax|written permission/);
});

test('FAQ pricing is derived from authoritative business configuration',()=>{
  const faq=readFileSync(resolve('app/faq/FAQSearch.tsx'),'utf8');
  for(const key of ['shortNoticeVisit','sameDayVisit','shortNoticeOvernight','holidayVisit','holidayOvernight','overnightMidday30.dog','drop30.other','drop60.other','additionalOther'])assert.match(faq,new RegExp(`business\\.pricing\\.${key.replaceAll('.','\\.')}`));
  assert.doesNotMatch(faq,/30-minute drop-in is \$20|60-minute drop-in is \$35|starts at \$25|at \$40/);
});

test('public service copy distinguishes Standard Overnight and both Continuous Care models',()=>{
  const home=readFileSync(resolve('app/page.tsx'),'utf8'),services=readFileSync(resolve('app/services/page.tsx'),'utf8'),faq=readFileSync(resolve('app/faq/FAQSearch.tsx'),'utf8'),holidays=readFileSync(resolve('app/holidays/page.tsx'),'utf8');
  for(const source of [services,faq])for(const phrase of ['Continuous Care','24-Hour Continuous Care','maximum safe and comfortable alone time','household-based'])assert.match(source,new RegExp(phrase));
  assert.match(home,/Continuous Care/);assert.match(services,/reasonable departures/);assert.match(faq,/not \$30 multiplied by 24/);
  assert.match(holidays,/business\.holidayPeriods\.map/);assert.match(holidays,/3–8 hour Continuous Care/);assert.doesNotMatch(holidays,/not yet approved/);
});

test('Phase 12E public imagery uses the owner-selected Blu portrait and excludes prohibited resources',()=>{
  const home=readFileSync(resolve('app/page.tsx'),'utf8');
  for(const fragment of ['homepageMainPhoto','/lauren-portrait.jpeg','/photos/ponyo%20-%20lauren%27s%20cat/lauren-cat-ponyo-couch.jpeg','alt="Lauren Blalock, owner of Cuddle Crew Pet Care"','alt="Ponyo, a gray-and-white cat, reclining on a sofa"'])assert.ok(home.includes(fragment),fragment);
  assert.equal(existsSync(resolve('public/photos/service-dog-walk.jpeg')),false);
  assert.equal(existsSync(resolve('public/psi-membership-certificate.jpg')),true);
  for(const path of ['public/handouts/Client Handout - Preparing for Your Pet Sitter.pdf','public/handouts/Pet Sitter Interview Checklist.pdf','public/handouts/Summer Safety Tips for Pet Owners (Client Handout).pdf','public/infographics/Dog Travel Safety Infographic'])assert.equal(existsSync(resolve(path)),false,path);
});

test('FAQ cancellation summary preserves each approved booking category and policy boundary',()=>{
  const faq=readFileSync(resolve('app/faq/FAQSearch.tsx'),'utf8');
  assert.match(faq,/Daytime service: 24 hours or more/);
  assert.match(faq,/Overnight or vacation care under seven nights uses 72-hour and 24-hour thresholds/);
  assert.match(faq,/For cancellation purposes, 3–8 hour Continuous Care is daytime/);
  assert.match(faq,/24-Hour Continuous Care is Overnight\/multi-day capacity/);
  assert.match(faq,/seven or more consecutive 24-hour periods use the Extended Booking rules/);
  assert.match(faq,/Approved holiday periods use the corresponding longer daytime or Overnight framework/);
  assert.match(faq,/The signed policy and booking details control/);
});

test('fallback pages remain safe and actionable without exposing internals',()=>{
  const error=readFileSync(resolve('app/error.tsx'),'utf8'),notFound=readFileSync(resolve('app/not-found.tsx'),'utf8');
  assert.match(error,/Something went wrong/);assert.match(error,/Try again/);assert.match(error,/Contact Lauren/);assert.doesNotMatch(error,/error\.message|error\.stack|JSON\.stringify\(error\)/);
  assert.match(notFound,/Page not found/);assert.match(notFound,/View Services/);assert.match(notFound,/Contact Lauren/);
});
