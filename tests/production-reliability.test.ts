import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {resolve} from 'node:path';
import {GET as healthCheck} from '../app/api/health/route.ts';

test('health endpoint returns only safe operational fields',async()=>{
  const response=healthCheck();
  const payload=await response.json() as Record<string,unknown>;

  assert.equal(response.status,200);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
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
  assert.match(start,/Start with service area/);assert.match(start,/Check preliminary availability/);assert.match(start,/Open your client portal/);assert.match(start,/Online tools provide planning guidance only/);assert.match(start,/aria-label="Choose your next step"/);
});

test('service-area map has a visible unavailable fallback',()=>{
  const map=readFileSync(resolve('app/ServiceAreaMap.tsx'),'utf8');
  assert.match(map,/setUnavailable\(true\)/);assert.match(map,/The interactive map is unavailable right now/);assert.match(map,/role="status"/);
});

test('contact errors receive focus while preserving entered values for recovery',()=>{
  const contact=readFileSync(resolve('app/contact/ContactTools.tsx'),'utf8');
  assert.match(contact,/errorRef\.current\?\.focus\(\)/);assert.match(contact,/ref=\{errorRef\}/);assert.match(contact,/tabIndex=\{-1\}/);
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
  const routes=['start','choosing-care','holidays','privacy','terms'];

  assert.match(sitemap,/SITE_INDEXING_ENABLED/);
  assert.match(sitemap,/\/choosing-care/);
  assert.match(robots,/SITE_INDEXING_ENABLED/);
  assert.match(proxy,/['\"]\/services['\"]:\s*['\"]\/#services['\"]/);
  assert.match(proxy,/['\"]\/rates['\"]:\s*['\"]\/#estimate['\"]/);
  for(const route of routes){
    const source=readFileSync(resolve(`app/${route}/page.tsx`),'utf8');
    assert.match(source,/alternates:\{canonical:/);
    assert.match(source,/openGraph:/);
  }
});

test('home defers below-fold interactive tools and keeps public prices sourced from business rules',()=>{
  const home=readFileSync(resolve('app/page.tsx'),'utf8');

  assert.match(home,/dynamic\(\(\)=>import\('\.\/QuoteEstimator'\),\{ssr:false/);
  assert.match(home,/dynamic\(\(\)=>import\('\.\/AddressChecker'\),\{ssr:false/);
  assert.match(home,/dynamic\(\(\)=>import\('\.\/ServiceAreaMap'\),\{ssr:false/);
  assert.match(home,/Loading the planning estimator/);
  assert.match(home,/Use the ZIP checker for the same published service-area result/);
  assert.match(home,/\$\{business\.pricing\.drop30\.dog\}/);
  assert.match(home,/\$\{business\.pricing\.walk60\}/);
  assert.match(home,/\$\{business\.pricing\.overnightMidday\}/);
  assert.match(home,/Drop-ins from \$\{business\.pricing\.drop30\.other\}/);
  assert.doesNotMatch(home,/\$85|\$80|\$45 dog|\$25 cat|Drop-ins from \$25/);
});

test('FAQ pricing is derived from authoritative business configuration',()=>{
  const faq=readFileSync(resolve('app/faq/FAQSearch.tsx'),'utf8');
  for(const key of ['shortNoticeVisit','sameDayVisit','shortNoticeOvernight','holidayVisit','holidayOvernight','overnightMidday','drop30.other','drop60.other','additionalOther'])assert.match(faq,new RegExp(`business\\.pricing\\.${key.replace('.','\\.')}`));
  assert.doesNotMatch(faq,/30-minute drop-in is \$20|60-minute drop-in is \$35|starts at \$25|at \$40/);
});

test('fallback pages remain safe and actionable without exposing internals',()=>{
  const error=readFileSync(resolve('app/error.tsx'),'utf8'),notFound=readFileSync(resolve('app/not-found.tsx'),'utf8');
  assert.match(error,/Something went wrong/);assert.match(error,/Try again/);assert.match(error,/Contact Lauren/);assert.doesNotMatch(error,/error\.message|error\.stack|JSON\.stringify\(error\)/);
  assert.match(notFound,/Page not found/);assert.match(notFound,/View Services/);assert.match(notFound,/Contact Lauren/);
});
