import {business} from '../config/business.ts';
import {businessDate,daysBetween,shortNoticeKind,zoneForZip} from './business-rules.ts';
import type {EstimateInput,EstimateIssue,EstimatePet,EstimateResult,EstimateReviewReason,EstimateService,PetType} from './estimate-types.ts';
export type {EstimateInput,EstimateIssue,EstimatePet,EstimateResult,EstimateReviewReason,EstimateService,MiddayService,PetType,PublicEstimateResult} from './estimate-types.ts';

const species=(type:PetType):'dog'|'cat'|'small'=>type==='dog'?'dog':type==='cat'?'cat':'small';
const counts=(pets:EstimatePet[])=>pets.reduce((out,pet)=>(out[species(pet.type)]++,out),{dog:0,cat:0,small:0});
const additionalPetFee=(pets:EstimatePet[])=>{const c=counts(pets);if(c.dog)return Math.max(0,c.dog-1)*business.pricing.additionalDog+c.cat*business.pricing.additionalCat+c.small*business.pricing.additionalSmall;if(c.cat)return Math.max(0,c.cat-1)*business.pricing.additionalCat+c.small*business.pricing.additionalSmall;return Math.max(0,c.small-1)*business.pricing.additionalSmall;};
const householdSpecies=(pets:EstimatePet[]):'dog'|'cat'|'small'=>{const c=counts(pets);return c.dog?'dog':c.cat?'cat':'small'};
const daytimeBase=(service:Exclude<EstimateService,'overnight'>,household:'dog'|'cat'|'small')=>{
 if(service==='walk30')return business.pricing.walk30;if(service==='walk60')return business.pricing.walk60;if(service==='walk90')return business.pricing.walk90;
 return business.pricing[service][household];
};

export function validateEstimate(input:EstimateInput):EstimateIssue[]{const issues:EstimateIssue[]=[];if(!input.pets.length)issues.push('pets');if(!input.start||!input.end||input.end<input.start)issues.push('dates');else if(input.start<businessDate(input.now))issues.push('past-date');if(zoneForZip(input.zip).state==='incomplete')issues.push('zip');if(input.service!=='overnight'&&!input.blocks.length)issues.push('windows');if(input.service.startsWith('walk')&&input.pets.some(p=>p.type!=='dog'))issues.push('walk-household');return issues;}

export function calculateEstimate(input:EstimateInput):{issues:EstimateIssue[];result:EstimateResult|null}{
 const issues=validateEstimate(input);if(issues.length)return{issues,result:null};
 const overnight=input.service==='overnight',dates=daysBetween(input.start,input.end,overnight);if(!dates.length)return{issues:['dates'],result:null};
 const household=householdSpecies(input.pets),petFee=additionalPetFee(input.pets),units=overnight?dates.length:dates.length*input.blocks.length;
 const reviewReasons:EstimateReviewReason[]=[];
 if(input.pets.some(p=>p.complex))reviewReasons.push('complex-care');
 const c=counts(input.pets);if(c.dog>=4||input.pets.length>=5)reviewReasons.push('household');
 if(input.pets.some(p=>!['dog','cat','rabbit','bird','fish'].includes(p.type)))reviewReasons.push('unusual-species');
 if(!input.travelTier)reviewReasons.push('travel');
 if(input.travelTier==='beyond')reviewReasons.push('travel');
 if(overnight&&input.travelTier&&['extended','farExtended','beyond'].includes(input.travelTier))reviewReasons.push('extended-overnight');
 if(overnight&&household==='small')reviewReasons.push('small-animal-overnight');
 if(overnight&&dates.length>=7)reviewReasons.push('long-stay');

 const base=overnight?(household==='dog'?business.pricing.overnight.dog:household==='cat'?business.pricing.overnight.cat:0):daytimeBase(input.service as Exclude<EstimateService,'overnight'>,household);
 let addOn=0,addOnPetFee=0,addOnUnits=0;
 if(overnight&&input.midday!=='none'){
   addOnUnits=dates.length;
   addOn=input.midday==='drop30'?business.pricing.overnightMidday30[household]:daytimeBase(input.midday,household);
   addOnPetFee=input.midday.startsWith('walk')?Math.max(0,c.dog-1)*business.pricing.additionalDog:petFee;
 }
 let potentialShortFee=0,shortCount=0,sameDayCount=0;
 if(overnight){for(const date of dates){const kind=shortNoticeKind(date,business.overnight.startHour,input.now,'overnight');if(kind==='same-day'||kind==='short-notice'){potentialShortFee+=business.pricing.shortNoticeOvernight;shortCount++;}}}
 else for(const date of dates)for(const index of input.blocks){const window=business.windows[index];if(!window)continue;const kind=shortNoticeKind(date,window.startHour,input.now);if(kind==='same-day'){potentialShortFee+=business.pricing.sameDayVisit;sameDayCount++;}else if(kind==='short-notice'){potentialShortFee+=business.pricing.shortNoticeVisit;shortCount++;}}
 if(potentialShortFee)reviewReasons.push('short-notice');
 const tier=input.travelTier?business.travel[input.travelTier]:undefined,travelFee=tier?overnight?0:tier.fee:null;
 const travelTotal=travelFee===null?0:overnight?0:travelFee*(units+addOnUnits);
 const serviceSubtotal=(base+petFee)*units+(addOn+addOnPetFee)*addOnUnits+travelTotal;
 const uniqueReasons=[...new Set(reviewReasons)],reviewRequired=uniqueReasons.length>0;
 return{issues:[],result:{total:reviewRequired?null:serviceSubtotal,serviceSubtotal,base,petFee,units,holidayFee:0,holidayPending:true,potentialShortFee,shortCount,sameDayCount,travelFee,travelTier:input.travelTier,addOn,addOnUnits,reviewRequired,reviewReasons:uniqueReasons}};
}
