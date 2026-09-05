'use client';
import {useMemo,useRef,useState} from 'react';
import {trackPublicEvent} from '../lib/public-analytics';
import {business} from '../config/business';

const entries=[
['Getting started','Do new clients need a meet-and-greet?','A complimentary initial meet-and-greet is generally expected unless Lauren personally approves a rare exception. Completing it does not automatically approve a booking.'],
['Pricing','What if I need care at short notice?',`A daytime request made less than 24 hours before service may have a $${business.pricing.shortNoticeVisit} per-visit charge. A same-day daytime request may instead have a $${business.pricing.sameDayVisit} charge. An overnight request made less than 48 hours ahead may have a $${business.pricing.shortNoticeOvernight} per-night charge. These discretionary charges do not guarantee availability.`],
['Policies','What is the cancellation policy?','Daytime service: 24 hours or more has no cancellation fee; under 24 hours may be charged 50%; after travel to the location or service begins may be charged 100%. Overnight or vacation care under seven nights uses 72-hour and 24-hour thresholds. Bookings of seven or more nights and approved holiday periods have longer rules. The signed policy and booking details control, and compassionate exceptions may be considered.'],
['Pricing','Which dates have holiday charges?',`The approved surcharge structure is $${business.pricing.holidayVisit} per qualifying daytime visit and $${business.pricing.holidayOvernight} per qualifying overnight. The exact holiday/peak-date calendar is not yet approved, so this site does not name or automatically classify dates. Applicable treatment is identified before booking confirmation.`],
['Services','What does an overnight include?',`Overnight care is approximately ${business.overnight.label}, is not continuous 24-hour presence, and excludes daytime care. A 30-minute midday service is $${business.pricing.overnightMidday30.dog} for a dog household or $${business.pricing.overnightMidday30.cat} for a cat/small-animal household. Longer daytime care uses the standard 60- or 90-minute rate; dog walks use the standard walk rate.`],
['Scheduling','Are visit times exact?','Choose preferred windows of 9 AM–12 PM, 12–3 PM, 3–6 PM, or 6–9 PM. Exact arrival times are confirmed based on the approved routine, medication timing, travel, safety, and schedule.'],
['Pricing','Does an online estimate guarantee my price or dates?',"No. It is a planning tool. Final pricing, timing, care fit, and availability require Lauren’s review and approval."],
['Health','Can you give medication?','Medication requests require written instructions and individual scope, timing, handling, safety, and suitability review. The site does not promise a particular administration method while the governing training and service-scope reference is awaiting approval.'],
['Small animals','How are small animals priced?',`Routine 30-minute care starts at $${business.pricing.drop30.other} and 60-minute care at $${business.pricing.drop60.other}. Fish are generally priced per typical tank. Each additional rabbit, bird, tank, cat, or small animal starts at $${business.pricing.additionalOther} per visit. Complex routines may need a longer or custom plan.`],
['Pets','Do you care for puppies or senior pets?','Senior pets are welcome. Dogs under one year old are considered individually because some need more frequent attention than the schedule can reliably support.'],
['Safety','What are the walking safety rules?','Dogs need secure, properly fitting equipment and remain leashed. Outdoor activity may be shortened, changed, or stopped when temperature, pavement, smoke, storms, air quality, or other conditions make the planned activity unsafe.'],
['Safety','How are emergencies handled?',"Lauren follows the current client profile and signed agreement, attempts to reach the client or authorized contact, and may seek veterinary help when care should not reasonably be delayed."],
['Privacy','How is home access handled?','Keys, codes, and household instructions are confidential and used only for approved care. Put them in the secure client portal and review backup access at the meet-and-greet.'],
['Services','Which requests need extra review?','Continuous-care requests, transportation, medication or procedures, exact-time care, unusual species, complex handling, and routines that exceed standard service durations require personalized review. A higher price never overrides safety, legal, insurance, or service-scope limits.'],
['Privacy','What about pet photos?','Public use of client media is not promised while the governing media-consent reference remains unapproved. Private visit documentation is handled according to the confirmed service plan and portal records.']
] as const;

export default function FAQSearch(){
 const[q,setQ]=useState(''),[cat,setCat]=useState('All'),tracked=useRef(false);
 const cats=['All',...new Set(entries.map(x=>x[0]))];
 const shown=useMemo(()=>entries.filter(([c,t,a])=>(cat==='All'||c===cat)&&`${t} ${a}`.toLowerCase().includes(q.toLowerCase())),[q,cat]);
 const search=(value:string)=>{setQ(value);if(value.trim().length>=2&&!tracked.current){tracked.current=true;trackPublicEvent('faq_searched')}};
 return <><div className="faq-tools"><label>Search questions<input type="search" value={q} onChange={e=>search(e.target.value)} placeholder="Try medication, cancellation, puppy…"/></label><label>Category<select value={cat} onChange={e=>setCat(e.target.value)}>{cats.map(x=><option key={x}>{x}</option>)}</select></label></div><p role="status">{shown.length} question{shown.length===1?'':'s'} found</p><div className="accordion-list">{shown.map(([c,t,a])=><details key={t}><summary><span>{t}</span><small>{c}</small></summary><p>{a}</p></details>)}</div>{!shown.length&&<div className="content-card"><h2>No exact match</h2><p><a href="/contact">Ask Lauren directly</a>, or try a broader search term.</p></div>}</>;
}
