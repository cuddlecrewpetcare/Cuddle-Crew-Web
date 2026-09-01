import {business,type PricingPetType,type VisitDuration} from '../config/business.ts';
import {businessDate,daysBetween,holidayForDate,shortNoticeKind,zoneForZip} from './business-rules.ts';

export type PetType='dog'|'cat'|'rabbit'|'bird'|'fish'|'small';
export type EstimatePet={type:PetType;complex?:boolean};
export type EstimateService='drop30'|'drop60'|'walk30'|'walk60'|'overnight';
export type EstimateInput={pets:EstimatePet[];service:EstimateService;start:string;end:string;blocks:number[];midday:'none'|'30'|'60';zip:string;now:Date};
export type EstimateIssue='dates'|'past-date'|'zip'|'windows'|'walk-household';
export type ManualReviewReason='complex-care'|'small-animal-overnight'|'unusual-overnight-household'|'extended-area-overnight'|'beyond-travel-area';
export type EstimateResult={
  total:number|null;
  base:number|null;
  petFee:number;
  units:number;
  holidays:{date:string;name:string}[];
  holidayFee:number;
  shortFee:number;
  shortCount:number;
  zone:number;
  zoneName:string|null;
  outside:boolean;
  addOn:number;
  addOnUnits:number;
  manualReview:boolean;
  manualReviewReasons:ManualReviewReason[];
};

const pricingType=(type:PetType):PricingPetType=>type==='dog'?'dog':type==='cat'?'cat':'smallAnimal';
const counts=(pets:EstimatePet[])=>pets.reduce<Record<PricingPetType,number>>((value,pet)=>{value[pricingType(pet.type)]++;return value},{dog:0,cat:0,smallAnimal:0});
const primaryType=(value:Record<PricingPetType,number>):PricingPetType=>value.dog?'dog':value.cat?'cat':'smallAnimal';
const additionalPetFee=(value:Record<PricingPetType,number>,primary:PricingPetType)=>
  (value.dog-(primary==='dog'?1:0))*business.pricing.additionalPet.dog+
  (value.cat-(primary==='cat'?1:0))*business.pricing.additionalPet.cat+
  (value.smallAnimal-(primary==='smallAnimal'?1:0))*business.pricing.additionalPet.smallAnimal;

export function validateEstimate(input:EstimateInput):EstimateIssue[]{const issues:EstimateIssue[]=[];if(!input.start||!input.end||input.end<input.start)issues.push('dates');else if(input.start<businessDate(input.now))issues.push('past-date');if(zoneForZip(input.zip).state==='incomplete')issues.push('zip');if(input.service!=='overnight'&&!input.blocks.length)issues.push('windows');if(input.service.startsWith('walk')&&input.pets.some(p=>p.type!=='dog'))issues.push('walk-household');return issues;}

export function calculateEstimate(input:EstimateInput):{issues:EstimateIssue[];result:EstimateResult|null}{
  const issues=validateEstimate(input);if(issues.length)return{issues,result:null};
  const overnight=input.service==='overnight',dates=daysBetween(input.start,input.end,overnight),zoneResult=zoneForZip(input.zip);if(!dates.length)return{issues:['dates'],result:null};
  const household=counts(input.pets),primary=primaryType(household),duration=(input.service.endsWith('60')?60:30) as VisitDuration;
  const manualReviewReasons:ManualReviewReason[]=[];
  if(input.pets.some(pet=>pet.complex))manualReviewReasons.push('complex-care');
  if(zoneResult.state==='outside')manualReviewReasons.push('beyond-travel-area');

  let base:number|null;
  if(input.service==='drop30'||input.service==='drop60')base=business.pricing.dropIn[primary][duration];
  else if(input.service==='walk30'||input.service==='walk60')base=business.pricing.dogWalk[duration];
  else if(household.dog)base=business.pricing.overnight.dogHousehold;
  else if(household.cat&&household.smallAnimal===0)base=business.pricing.overnight.catOnly;
  else if(household.smallAnimal&&household.cat===0){base=business.pricing.overnight.smallAnimalOnly;manualReviewReasons.push('small-animal-overnight');}
  else{base=null;manualReviewReasons.push('unusual-overnight-household');}

  if(overnight&&zoneResult.state==='listed'&&(zoneResult.key==='extended'||zoneResult.key==='farExtended'))manualReviewReasons.push('extended-area-overnight');
  const petFee=additionalPetFee(household,primary),units=overnight?dates.length:dates.length*input.blocks.length;
  const holidays=dates.map(date=>({date,name:holidayForDate(date)})).filter((value):value is {date:string;name:string}=>Boolean(value.name));
  const holidayFee=overnight?holidays.length*business.pricing.holiday.overnight:holidays.length*input.blocks.length*business.pricing.holiday.visit;
  let shortFee=0,shortCount=0;
  if(overnight){for(const date of dates){const kind=shortNoticeKind(date,business.overnight.startHour,input.now);if(kind==='same-day'||kind==='under-48'){shortFee+=business.pricing.shortNotice.overnight;shortCount++;}}}
  else for(const date of dates)for(const index of input.blocks){const window=business.windows[index];if(!window)continue;const kind=shortNoticeKind(date,window.startHour,input.now);if(kind==='same-day'||kind==='under-48'){shortFee+=business.pricing.shortNotice.visit;shortCount++;}}

  let addOn=0;
  if(overnight&&input.midday!=='none')addOn=household.dog?business.pricing.overnightMidday.dogHousehold:household.cat&&household.smallAnimal===0?business.pricing.overnightMidday.catOnly:business.pricing.overnightMidday.smallAnimalOnly;
  const addOnUnits=overnight&&input.midday!=='none'?dates.length:0;
  const zone=zoneResult.state==='listed'?zoneResult.feePerVisit:0;
  const travelTotal=overnight?0:zone*units;
  const manualReview=manualReviewReasons.length>0;
  const total=!manualReview&&base!==null?(base+petFee)*units+addOn*addOnUnits+travelTotal+holidayFee+shortFee:null;
  return{issues:[],result:{total,base,petFee,units,holidays,holidayFee,shortFee,shortCount,zone,zoneName:zoneResult.state==='listed'?zoneResult.name:null,outside:zoneResult.state==='outside',addOn,addOnUnits,manualReview,manualReviewReasons}};
}
