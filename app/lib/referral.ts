export const referralSources=['business-card','instagram','nextdoor','vet-office','flyer','facebook','yelp','google'] as const;
export type ReferralSource=(typeof referralSources)[number];
export const referralStorageKey='cuddlecrew.referral';
export const parseReferralSource=(value:unknown):ReferralSource|undefined=>typeof value==='string'&&referralSources.includes(value as ReferralSource)?value as ReferralSource:undefined;
export const referralFromSearch=(search:string)=>parseReferralSource(new URLSearchParams(search).get('ref'));
export const persistReferral=(storage:Pick<Storage,'getItem'|'setItem'>,value:unknown)=>{const safe=parseReferralSource(value);if(!safe)return undefined;try{storage.setItem(referralStorageKey,safe);return safe}catch{return undefined}};
export const loadReferral=(storage:Pick<Storage,'getItem'>)=>{try{return parseReferralSource(storage.getItem(referralStorageKey))}catch{return undefined}};
