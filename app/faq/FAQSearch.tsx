'use client';
import {useMemo,useRef,useState} from 'react';
import {trackPublicEvent} from '../lib/public-analytics';
import {business} from '../config/business';

const entries=[
['Getting started','Do new clients need a Meet & Greet?','Yes. A paid Meet & Greet is required for every new household. Its final rate is confirmed personally because no authoritative public price has been set. Registration and requests are not automatic confirmations; dates are reserved only after Lauren reviews and manually approves the request.'],
['Pricing','What if I need care at short notice?',`Daytime requests less than 48 hours before the selected window include $${business.pricing.shortNotice.visit} per visit. Overnight requests less than 48 hours before care include $${business.pricing.shortNotice.overnight} per night. All depend on availability and are evaluated in Pacific Time.`],
['Policies','What is the cancellation policy?','48 or more hours ahead receives a full refund; under 48 hours is charged 50%; same-day cancellations are charged in full.'],
['Pricing','Which dates have holiday charges?',`New Year’s Day, Easter, Mother’s Day, Independence Day, Thanksgiving, Christmas Eve, Christmas Day, and New Year’s Eve. Daytime visits add $${business.pricing.holiday.visit} per visit; overnight care adds $${business.pricing.holiday.overnight} per night.`],
['Services','What does an overnight include?',`Overnight care is ${business.overnight.label} and excludes daytime care. A separately booked 30-minute midday visit may be added for $${business.pricing.overnightMidday.dogHousehold} for a dog household or $${business.pricing.overnightMidday.catOnly} for a cat-only household per night. Extended-area overnight travel requires personal review.`],
['Scheduling','Are visit times exact?','Choose preferred windows of 9 AM–12 PM, 12–3 PM, 3–6 PM, or 6–9 PM. Exact arrival times are confirmed based on the approved routine, medication timing, travel, safety, and schedule.'],
['Pricing','Does an online estimate guarantee my price or dates?',"No. It is a planning tool. Final pricing, timing, care fit, and availability require Lauren’s review and approval."],
['Health','Can you give medication?','With approved written instructions, Lauren can provide pills crushed into food, liquid medication mixed into food, and routine topical medication. Injections, veterinary procedures, specialized administration, and unsafe bite-risk situations are not offered.'],
['Small animals','How are small animals priced?',`Routine 30-minute drop-ins start at $${business.pricing.dropIn.smallAnimal[30]} and 60-minute drop-ins at $${business.pricing.dropIn.smallAnimal[60]}. Fish are generally priced per typical tank. Each additional small animal starts at $${business.pricing.additionalPet.smallAnimal} per visit when the care safely fits. Complex routines may need a longer service or personal review. Small-animal-only overnights require personal review.`],
['Pricing','How do travel zones work?',`Travel is based primarily on approximate one-way drive time: Core 0–10 minutes and Standard over 10–20 minutes are included; Extended over 20–30 minutes adds $${business.zones.extended.feePerVisit} per standalone visit; Far Extended over 30–45 minutes adds $${business.zones.farExtended.feePerVisit}. Beyond approximately 45 minutes and extended-area overnights require personal review. Travel times may vary with traffic.`],
['Pets','Do you care for puppies or senior pets?','Senior pets are welcome. Dogs under one year old are considered individually because some need more frequent attention than the schedule can reliably support.'],
['Safety','What are the walking safety rules?','Dogs need secure, properly fitting equipment and remain leashed. Off-leash and dog-park visits are not offered. Walks are adjusted or replaced above 85°F or when pavement, smoke, storms, or other conditions are unsafe.'],
['Safety','How are emergencies handled?',"Lauren follows the current client profile and signed agreement, attempts to reach the client or authorized contact, and may seek veterinary help when care should not reasonably be delayed."],
['Privacy','How is home access handled?','Keys, codes, and household instructions are confidential and used only for approved care. Put them in the secure client portal and review backup access at the meet-and-greet.'],
['Services','Which services are not offered?','Pet transportation, boarding, continuous 24-hour care, grooming, training, veterinary procedures, injections, off-leash walks, and dog-park visits are not offered.'],
['Privacy','What about pet photos?','Client-pet photos appear publicly only with permission and are not presented as reviews or endorsements. You may change your preference by contacting Lauren.']
] as const;

export default function FAQSearch(){
 const[q,setQ]=useState(''),[cat,setCat]=useState('All'),tracked=useRef(false);
 const cats=['All',...new Set(entries.map(x=>x[0]))];
 const shown=useMemo(()=>entries.filter(([c,t,a])=>(cat==='All'||c===cat)&&`${t} ${a}`.toLowerCase().includes(q.toLowerCase())),[q,cat]);
 const search=(value:string)=>{setQ(value);if(value.trim().length>=2&&!tracked.current){tracked.current=true;trackPublicEvent('faq_searched')}};
 return <><div className="faq-tools"><label>Search questions<input type="search" value={q} onChange={e=>search(e.target.value)} placeholder="Try medication, cancellation, puppy…"/></label><label>Category<select value={cat} onChange={e=>setCat(e.target.value)}>{cats.map(x=><option key={x}>{x}</option>)}</select></label></div><p aria-live="polite">{shown.length} question{shown.length===1?'':'s'} found</p><div className="accordion-list">{shown.map(([c,t,a])=><details key={t}><summary><span>{t}</span><small>{c}</small></summary><p>{a}</p></details>)}</div>{!shown.length&&<div className="content-card"><h2>No exact match</h2><p><a href="/contact">Ask Lauren directly</a>, or try a broader search term.</p></div>}</>;
}
