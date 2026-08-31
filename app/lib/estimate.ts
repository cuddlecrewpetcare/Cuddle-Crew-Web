import {business} from '../config/business.ts';
import {businessDate,daysBetween,holidayForDate,shortNoticeKind,zoneForZip} from './business-rules.ts';

export type PetType='dog'|'cat'|'rabbit'|'bird'|'fish'|'small';
export type EstimatePet={type:PetType;complex?:boolean};
export type EstimateService='drop30'|'drop60'|'walk30'|'walk60'|'overnight';
export type EstimateInput={pets:EstimatePet[];service:EstimateService;start:string;end:string;blocks:number[];midday:'none'|'30'|'60';zip:string;now:Date};
export type EstimateIssue='dates'|'past-date'|'zip'|'windows'|'walk-household';
export type EstimateResult={total:number;base:number;petFee:number;units:number;holidays:{date:string;name:string}[];holidayFee:number;shortFee:number;shortCount:number;sameDayCount:number;zone:number;outside:boolean;addOn:number;addOnUnits:number;complex:boolean;overnightPetReview:boolean};

export function validateEstimate(input:EstimateInput):EstimateIssue[]{const issues:EstimateIssue[]=[];if(!input.start||!input.end||input.end<input.start)issues.push('dates');else if(input.start<businessDate(input.now))issues.push('past-date');if(zoneForZip(input.zip).state==='incomplete')issues.push('zip');if(input.service!=='overnight'&&!input.blocks.length)issues.push('windows');if(input.service.startsWith('walk')&&input.pets.some(p=>p.type!=='dog'))issues.push('walk-household');return issues;}

export function calculateEstimate(input:EstimateInput):{issues:EstimateIssue[];result:EstimateResult|null}{
 const issues=validateEstimate(input);if(issues.length)return{issues,result:null};
 const p=business.pricing,overnight=input.service==='overnight',dates=daysBetween(input.start,input.end,overnight),zoneResult=zoneForZip(input.zip);if(!dates.length)return{issues:['dates'],result:null};
 const dogs=input.pets.filter(x=>x.type==='dog').length,others=input.pets.length-dogs,hasDog=dogs>0;
 const base=input.service==='drop30'?p.drop30.dog:input.service==='drop60'?p.drop60.dog:input.service==='walk30'?p.walk30:input.service==='walk60'?p.walk60:p.overnight.dog;
 const overnightPetReview=overnight&&input.pets.length>1,petFee=overnight?0:Math.max(0,dogs-1)*p.additionalDog+(hasDog?others*p.additionalOther:Math.max(0,others-1)*p.additionalOther),units=overnight?dates.length:dates.length*input.blocks.length;
 const holidays=dates.map(date=>({date,name:holidayForDate(date)})).filter((x):x is {date:string;name:string}=>Boolean(x.name)),holidayFee=overnight?holidays.length*p.holidayOvernight:holidays.length*input.blocks.length*p.holidayVisit;
 let shortFee=0,shortCount=0,sameDayCount=0;if(overnight){for(const date of dates){const kind=shortNoticeKind(date,business.overnight.startHour,input.now);if(kind==='same-day'||kind==='under-48'){shortFee+=p.shortNoticeOvernight;shortCount++;}}}else for(const date of dates)for(const index of input.blocks){const window=business.windows[index];if(!window)continue;const kind=shortNoticeKind(date,window.startHour,input.now);if(kind==='same-day'){shortFee+=p.sameDayVisit;sameDayCount++;}else if(kind==='under-48'){shortFee+=p.shortNoticeVisit;shortCount++;}}
 const addOn=overnight&&input.midday!=='none'?p.overnightMidday:0,addOnUnits=overnight&&input.midday!=='none'?dates.length:0,zone=zoneResult.state==='listed'?zoneResult.fee:0,travelTotal=zone*(units+addOnUnits);
 return{issues:[],result:{total:(base+petFee)*units+(addOn+petFee)*addOnUnits+travelTotal+holidayFee+shortFee,base,petFee,units,holidays,holidayFee,shortFee,shortCount,sameDayCount,zone,outside:zoneResult.state==='outside',addOn,addOnUnits,complex:input.pets.some(x=>x.complex),overnightPetReview}};
}
