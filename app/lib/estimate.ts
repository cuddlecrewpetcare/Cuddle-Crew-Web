import {business} from '../config/business.ts';
import {businessDate,daysBetween,holidayForDate,shortNoticeKind,zoneForZip} from './business-rules.ts';
import {sanitizePlannerContext} from './planner-prefill.ts';
import {requiresSpeciesReview} from './species-scope.ts';
import {effectiveMiddayService,hasIncompatibleDogWalk} from './estimate-service-selection.ts';
import type {EstimateInput,EstimateIssue,EstimatePet,EstimateResult,EstimateReviewReason,EstimateService,PetType} from './estimate-types.ts';
export type {EstimateInput,EstimateIssue,EstimatePet,EstimateResult,EstimateReviewReason,EstimateService,MiddayService,PetType,PublicEstimateResult} from './estimate-types.ts';

const species=(type:PetType):'dog'|'cat'|'small'=>type==='dog'?'dog':type==='cat'?'cat':'small';
const counts=(pets:EstimatePet[])=>pets.reduce((out,pet)=>(out[species(pet.type)]++,out),{dog:0,cat:0,small:0});
const additionalPetFee=(pets:EstimatePet[])=>{const c=counts(pets);if(c.dog)return Math.max(0,c.dog-1)*business.pricing.additionalDog+c.cat*business.pricing.additionalCat+c.small*business.pricing.additionalSmall;if(c.cat)return Math.max(0,c.cat-1)*business.pricing.additionalCat+c.small*business.pricing.additionalSmall;return Math.max(0,c.small-1)*business.pricing.additionalSmall;};
const householdSpecies=(pets:EstimatePet[]):'dog'|'cat'|'small'=>{const c=counts(pets);return c.dog?'dog':c.cat?'cat':'small'};
type ContinuousService='continuous3'|'continuous4'|'continuous5'|'continuous6'|'continuous7'|'continuous8'|'continuous24';
type StandardDaytimeService=Exclude<EstimateService,'overnight'|ContinuousService>;
const isContinuousService=(service:EstimateService):service is ContinuousService=>service.startsWith('continuous');
const daytimeBase=(service:StandardDaytimeService,household:'dog'|'cat'|'small')=>{
 if(service==='walk30')return business.pricing.walk30;if(service==='walk60')return business.pricing.walk60;if(service==='walk90')return business.pricing.walk90;
 return business.pricing[service][household];
};
const continuousBase=(service:ContinuousService)=>service==='continuous24'?business.pricing.continuous24Starting:business.pricing.continuous[Number(service.slice('continuous'.length)) as keyof typeof business.pricing.continuous];

export function validateEstimate(input:EstimateInput):EstimateIssue[]{const issues:EstimateIssue[]=[];if(!input.pets.length)issues.push('pets');if(!input.start||!input.end||input.end<input.start)issues.push('dates');else if(input.start<businessDate(input.now))issues.push('past-date');if(zoneForZip(input.zip).state==='incomplete')issues.push('zip');if(input.service!=='overnight'&&!isContinuousService(input.service)&&!input.blocks.length)issues.push('windows');if(hasIncompatibleDogWalk(input))issues.push('walk-household');return issues;}

export function calculateEstimate(input:EstimateInput):{issues:EstimateIssue[];result:EstimateResult|null}{
 const issues=validateEstimate(input);if(issues.length)return{issues,result:null};
 const overnight=input.service==='overnight',continuous=isContinuousService(input.service),continuous24=input.service==='continuous24',capacityPeriod=overnight||continuous24;
 const dates=daysBetween(input.start,input.end,capacityPeriod);if(!dates.length)return{issues:['dates'],result:null};
 const planner=sanitizePlannerContext(input.planner);
 const selectedWindow=input.blocks.length===1?business.windows[input.blocks[0]]:undefined;
 const coverageSupported=!overnight||!planner?.overnightDuration||input.blocks.length===0||Boolean(selectedWindow&&selectedWindow.startHour>=business.overnight.endHour&&selectedWindow.endHour+planner.overnightDuration/60<=business.overnight.startHour);
 const speciesReview=requiresSpeciesReview(input.pets.map(p=>p.type));
 if(speciesReview||planner?.reviewRequired||planner?.incomplete||!coverageSupported)return{issues:[],result:{total:null,serviceSubtotal:null,base:null,petFee:null,units:overnight||continuous?dates.length:dates.length*input.blocks.length,holidayFee:null,holidayCount:0,potentialShortFee:null,shortCount:0,sameDayCount:0,travelFee:null,travelTier:input.travelTier,addOn:null,addOnUnits:0,reviewRequired:true,reviewReasons:speciesReview?['unusual-species']:['planner']}};
 const midday=effectiveMiddayService(input);
 const household=householdSpecies(input.pets),petFee=continuous?0:additionalPetFee(input.pets),units=overnight||continuous?dates.length:dates.length*input.blocks.length;
 const reviewReasons:EstimateReviewReason[]=[];
 if(continuous)reviewReasons.push('continuous-care');
 if(input.pets.some(p=>p.complex))reviewReasons.push('complex-care');
 const c=counts(input.pets);if(c.dog>=4||input.pets.length>=5)reviewReasons.push('household');
 if(!input.travelTier)reviewReasons.push('travel');
 if(input.travelTier==='beyond')reviewReasons.push('travel');
 if(overnight&&input.travelTier&&['extended','farExtended','beyond'].includes(input.travelTier))reviewReasons.push('extended-overnight');
 if(overnight&&household==='small')reviewReasons.push('small-animal-overnight');
 if(capacityPeriod&&dates.length>=7)reviewReasons.push('long-stay');

 const base=overnight?(household==='dog'?business.pricing.overnight.dog:household==='cat'?business.pricing.overnight.cat:0):isContinuousService(input.service)?continuousBase(input.service):daytimeBase(input.service as StandardDaytimeService,household);
 let addOn=0,addOnPetFee=0,addOnUnits=0;
 if(overnight&&midday!=='none'){
   addOnUnits=dates.length;
   addOn=midday==='drop30'?business.pricing.overnightMidday30[household]:daytimeBase(midday,household);
   addOnPetFee=midday.startsWith('walk')?Math.max(0,c.dog-1)*business.pricing.additionalDog:petFee;
 }
 let potentialShortFee=0,shortCount=0,sameDayCount=0;
 if(overnight){for(const date of dates){const kind=shortNoticeKind(date,business.overnight.startHour,input.now,'overnight');if(kind==='review')reviewReasons.push('short-notice');else if(kind==='same-day'||kind==='short-notice'){potentialShortFee+=business.pricing.shortNoticeOvernight;shortCount++;}}}
 // Continuous Care timing is reviewed from its actual schedule, not ordinary visit windows.
 else if(!continuous)for(const date of dates)for(const index of input.blocks){const window=business.windows[index];if(!window)continue;const kind=shortNoticeKind(date,window.startHour,input.now);if(kind==='review')reviewReasons.push('short-notice');else if(kind==='same-day'){potentialShortFee+=business.pricing.sameDayVisit;sameDayCount++;}else if(kind==='short-notice'){potentialShortFee+=business.pricing.shortNoticeVisit;shortCount++;}}
 if(potentialShortFee)reviewReasons.push('short-notice');
 const primaryHolidayCount=dates.filter(date=>holidayForDate(date)).length*(overnight||continuous?1:input.blocks.length);
 const addOnHolidayCount=overnight&&midday!=='none'?dates.filter(date=>holidayForDate(date)).length:0;
 const holidayCount=primaryHolidayCount+addOnHolidayCount;
 const holidayFee=primaryHolidayCount*(overnight||continuous24?business.pricing.holidayOvernight:business.pricing.holidayVisit)+addOnHolidayCount*business.pricing.holidayVisit;
 const tier=input.travelTier?business.travel[input.travelTier]:undefined,travelFee=tier?tier.fee:null;
 const primaryTravelUnits=overnight||continuous?0:units;
 const travelTotal=travelFee===null?0:travelFee*(primaryTravelUnits+addOnUnits);
 const serviceSubtotal=(base+petFee)*units+(addOn+addOnPetFee)*addOnUnits+holidayFee+travelTotal;
 const uniqueReasons=[...new Set(reviewReasons)],reviewRequired=uniqueReasons.length>0;
 return{issues:[],result:{total:reviewRequired?null:serviceSubtotal,serviceSubtotal,base,petFee,units,holidayFee,holidayCount,potentialShortFee,shortCount,sameDayCount,travelFee,travelTier:input.travelTier,addOn,addOnUnits,reviewRequired,reviewReasons:uniqueReasons}};
}
