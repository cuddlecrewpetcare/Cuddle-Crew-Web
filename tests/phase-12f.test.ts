import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const read=(path:string)=>readFileSync(resolve(path),'utf8');

test('smart-tool links resolve to the current estimator and service-area destinations',()=>{
 const planner=read('app/plan/CarePlanner.tsx'),summary=read('app/CarePlanSummary.tsx');
 assert.match(planner,/href=\{`\/rates\?\$\{estimateParams\.toString\(\)\}#estimate`\}/);
 assert.doesNotMatch(planner,/href=\{`\/\?\$\{estimateParams/);
 assert.match(summary,/href="\/service-area">Check service area/);
 assert.doesNotMatch(summary,/href="#area"/);
});

test('service-area handoff uses only sanitized session ZIP and public tier state',()=>{
 const state=read('app/lib/planning-state.ts'),tools=read('app/ServiceAreaTools.tsx'),checker=read('app/AddressChecker.tsx');
 assert.match(state,/travelTier\?:TravelTierKey/);assert.match(state,/travelTiers\.has/);assert.doesNotMatch(state,/zone\?:string/);
 assert.match(tools,/savePlanningLocation\(location\)/);assert.match(tools,/clearPlanningLocation\(\)/);assert.match(tools,/href="\/rates#estimate"/);
 assert.match(checker,/onLocation\(\{zip:checked\.zip,travelTier\}\)/);assert.doesNotMatch(checker,/sessionStorage|localStorage|trackPublicEvent/);
 for(const privateField of ['address','city','contact','identity','routeGeometry'])assert.doesNotMatch(state,new RegExp(`${privateField}\\??:`,'i'));
});

test('estimator failure keeps recovery local and offers retry plus a safe fallback',()=>{
 const estimator=read('app/QuoteEstimator.tsx');
 assert.match(estimator,/estimateStatus.*'error'/);assert.match(estimator,/onClick=\{retry\}>Try again/);assert.match(estimator,/href="\/contact">Contact Lauren/);
 assert.match(estimator,/Your entries are still here/);assert.match(estimator,/does not mean service is unavailable/);assert.doesNotMatch(estimator,/cached estimate|response\.statusText|error\.stack/);
});

test('contact timing and recovery use canonical configuration without a faster promise',()=>{
 const contact=read('app/contact/ContactTools.tsx'),page=read('app/contact/page.tsx'),business=read('app/config/business.ts');
 assert.match(business,/replyWindow: 'within 1–2 business days'/);assert.match(contact,/business\.replyWindow/);assert.doesNotMatch(contact,/within one business day|one business day/i);
 for(const phrase of ['Try the form again','Open your email app instead','Open Precise Petcare'])assert.match(contact,new RegExp(phrase));
 assert.match(page,/<noscript>/);assert.match(page,/business\.phoneHref/);assert.match(page,/\/accessibility/);
});

test('preparation and technology guidance are original, concise, and safely scoped',()=>{
 const start=read('app/start/page.tsx'),faq=read('app/faq/FAQSearch.tsx'),combined=`${start}\n${faq}`;
 for(const phrase of ['Prepare the routine and its backup','emergency and veterinary contacts','tested primary access','device, power, or network fails','do not automatically replace appropriate in-person welfare checks'])assert.match(combined,new RegExp(phrase));
 for(const prohibited of ['Client Handout - Preparing for Your Pet Sitter','Pet Sitter Interview Checklist','Summer Safety Tips for Pet Owners','Dog Travel Safety Infographic'])assert.doesNotMatch(combined,new RegExp(prohibited));
 assert.match(faq,/does not connect to or remotely monitor client devices/);assert.match(faq,/not veterinary monitoring/);
});

test('accessibility route is substantive, linked, and avoids certification overclaims',()=>{
 const page=read('app/accessibility/page.tsx'),footer=read('app/SiteFooter.tsx'),sitemap=read('app/sitemap.ts');
 for(const phrase of ['Website accessibility','keyboard-operable','reduced-motion','Report a barrier','continued improvement'])assert.match(page,new RegExp(phrase,'i'));
 assert.match(page,/business\.email/);assert.match(page,/business\.phoneHref/);assert.match(footer,/href="\/accessibility"/);assert.match(sitemap,/\/accessibility/);
 assert.doesNotMatch(page,/WCAG|certif(?:y|ied|ication)|legal compliance|fully accessible|complete accessibility|exhaustive assistive/i);
});

test('route social metadata is complete while schema and indexing gates stay bounded',()=>{
 const helper=read('app/lib/metadata.ts'),layout=read('app/layout.tsx'),sitemap=read('app/sitemap.ts'),robots=read('app/robots.ts');
 for(const field of ['alternates','canonical','openGraph','twitter','summary_large_image','/og.png'])assert.match(helper,new RegExp(field));
 assert.doesNotMatch(layout,/priceRange/);assert.match(layout,/'@type': 'LocalBusiness'/);assert.match(layout,/'@type': 'WebSite'/);
 assert.match(sitemap,/SITE_INDEXING_ENABLED!==?'true'|SITE_INDEXING_ENABLED/);assert.match(robots,/SITE_INDEXING_ENABLED/);
});
