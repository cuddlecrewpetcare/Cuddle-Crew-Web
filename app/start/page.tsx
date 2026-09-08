import SiteFooter from '../SiteFooter';
import SiteHeader from '../SiteHeader';
import {business} from '../config/business';

import {publicPageMetadata} from '../lib/metadata';
export const metadata=publicPageMetadata({title:"Start Here | Cuddle Crew Pet Care",description:"Follow the clear new-client path from service exploration and secure Precise Petcare information to personalized review and confirmed care.",path:'/start'});

const steps=[
 {title:'Learn about services and check fit',body:'Compare care options, approved public rates, and the general service area. This helps you orient—not reserve care.'},
 {title:'Use planning tools if helpful',body:'The estimator, care planner, and address check are optional tools for understanding likely care and pricing.'},
 {title:'Create your secure Precise Petcare profile',body:'Complete the relevant household, pet, care, emergency, and access information, then submit the applicable service request through the approved workflow.'},
 {title:'Meet before first care',body:'A complimentary initial Meet & Greet is generally expected unless Lauren personally approves a rare exception.'},
 {title:'Lauren performs a personalized review',body:'She reviews route, schedule, routine, animal welfare, safety, approved scope, and real capacity without exposing private internal criteria.'},
 {title:'Receive confirmation in Precise Petcare',body:'Only an approved Precise Petcare quote and confirmed booking establish the service, schedule, care plan, and final price.'},
] as const;

const pathways=[
 {title:'Services',body:'Understand Drop-Ins, Walks, Standard Overnight, and Continuous Care.',href:'/services',label:'Explore services'},
 {title:'Rates & estimate',body:'See complete approved public pricing and build a preliminary estimate.',href:'/rates#estimate',label:'View rates'},
 {title:'Service area',body:'Check an address for typical travel and learn the route-review boundary.',href:'/service-area',label:'Check service area'},
 {title:'Plan care',body:'Use the anonymous guide to compare care frequency and duration.',href:'/plan',label:'Plan care'},
 {title:'Questions first',body:'Contact Lauren about an unusual routine or the right next step.',href:'/contact',label:'Contact Lauren'},
] as const;

export default function Start(){return <><SiteHeader/><main id="main-content" tabIndex={-1}><div className="shell start-page">
 <section className="subhero start-hero"><p className="eyebrow">New-client orientation</p><h1>Start with clarity, then request care securely.</h1><p className="lede">Explore what may fit, use the planning tools you need, and move into Precise Petcare when you are ready to share private details. Lauren reviews every request before anything is confirmed.</p><div className="actions"><a className="button" href={business.portal.register}>Create your secure profile</a><a className="text-link" href="#new-client-path">See the full path →</a></div><p className="start-helper">Already a client? <a href={business.portal.login}>Open your Precise Petcare account</a>.</p></section>

 <section id="new-client-path" className="start-process" aria-labelledby="start-process-heading"><div className="section-heading"><div><p className="eyebrow">How it works</p><h2 id="start-process-heading">From exploring to confirmed care.</h2></div><p>No website step auto-books service or holds dates.</p></div><ol>{steps.map((step,index)=><li key={step.title}><span aria-hidden="true">{index+1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol><div className="process-boundary"><strong>Confirmation boundary</strong><p>An estimate, service-area result, registration, Meet & Greet, invoice, or payment does not guarantee acceptance. Final client-specific profiles, care instructions, access information, bookings, schedules, and approved service plans remain in Precise Petcare.</p></div></section>

 <section className="start-tools" aria-labelledby="start-tools-heading"><div className="section-heading"><div><p className="eyebrow">Explore at your pace</p><h2 id="start-tools-heading">Choose the support you need.</h2></div><p>You do not have to use every tool before registering.</p></div><div className="start-pathways"><ol>{pathways.map((path,index)=><li key={path.title}><span aria-hidden="true">{index+1}</span><div><h3>{path.title}</h3><p>{path.body}</p><a className="text-link" href={path.href}>{path.label} →</a></div></li>)}</ol></div></section>

 <section className="content-card readiness-cue"><p className="eyebrow">Before first care</p><h2>Prepare the routine and its backup.</h2><p>Keep these details current in secure Precise Petcare records, then confirm them at the Meet & Greet:</p><ul><li>Current care and medication instructions, plus emergency and veterinary contacts.</li><li>Enough food, medication, litter, enclosure supplies, and working care equipment—with clear locations.</li><li>A tested primary access method and an approved backup access plan where applicable.</li><li>A safe backup for routine feeders, fountains, self-cleaning litter boxes, smart access devices, or other equipment if the device, power, or network fails.</li></ul><p>This readiness check does not replace the signed agreements or the confirmed care plan.</p></section>

 <section className="cta start-cta"><p className="eyebrow">Ready for the secure step?</p><h2>Create your Precise Petcare profile.</h2><p>Use the portal for private household, pet, medical, emergency, and access information. Submit the relevant request there when your profile is ready.</p><div className="actions center"><a className="button" href={business.portal.register}>Create your secure profile</a><a className="button secondary" href="/contact">Contact Lauren first</a></div></section>
 </div></main><SiteFooter/></>}
