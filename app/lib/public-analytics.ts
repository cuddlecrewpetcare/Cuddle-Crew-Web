import {loadReferral} from './referral.ts';

export const publicEventNames=['service_area_checked','availability_checked','estimator_started','estimator_completed','planner_started','planner_completed','faq_searched','safety_searched','provider_comparison_viewed','new_client_clicked','existing_client_clicked','contact_submitted','phone_clicked','instagram_clicked'] as const;
export type PublicEventName=(typeof publicEventNames)[number];
const allowedKeys=['serviceType','zoneName','duration','status','referralSource'] as const;
const allowedValues=/^[a-zA-Z0-9 _-]{1,40}$/;
const prohibitedKey=/(address|email|phone|name|message|medical|medication|access|token|url|referrer)/i;
export type PublicEventProperties=Partial<Record<(typeof allowedKeys)[number],string|number|boolean>>;
export const assertSafePublicAnalyticsPayload=(properties:Record<string,unknown>={})=>{if(process.env.NODE_ENV!=='production'){const unsafe=Object.keys(properties).find(key=>prohibitedKey.test(key));if(unsafe)throw new Error(`Prohibited analytics property: ${unsafe}`)}};
export const sanitizePublicEventProperties=(properties:Record<string,unknown>={})=>Object.fromEntries(Object.entries(properties).filter(([key,value])=>allowedKeys.includes(key as typeof allowedKeys[number])&&((typeof value==='string'&&allowedValues.test(value))||(typeof value==='number'&&Number.isFinite(value)&&Math.abs(value)<=100_000)||typeof value==='boolean'))) as PublicEventProperties;
export const trackPublicEvent=(name:PublicEventName,properties:Record<string,unknown>={})=>{try{assertSafePublicAnalyticsPayload(properties);if(typeof window==='undefined')return;const referralSource=loadReferral(window.sessionStorage);const detail={name,properties:sanitizePublicEventProperties({...properties,...(referralSource?{referralSource}: {})})};window.dispatchEvent(new CustomEvent('cuddlecrew:public-event',{detail}));}catch{/* Analytics is intentionally optional and must fail open. */}};
