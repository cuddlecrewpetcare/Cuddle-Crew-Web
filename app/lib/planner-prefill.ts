import {business} from '../config/business.ts';
import type {EstimateService,MiddayService,PetType,PlannerContext} from './estimate-types.ts';

export type PlannerPrefill={count:number|null;types:PetType[];service:EstimateService;blocks:number[];overnight:boolean;midday:MiddayService;planner:PlannerContext};
const countValue=(value:string|null)=>value!==null&&/^\d+$/.test(value)&&Number(value)<=8?Number(value):null;
export const normalizePlannerCount=(value:number)=>Number.isFinite(value)?Math.max(0,Math.min(8,Math.floor(value))):0;

// Only public planning selections and an opaque review requirement cross this boundary.
export function plannerPrefillQuery(input:{dogs:number;cats:number;otherPets:number;duration:30|60|90;blocks:number[];overnight:boolean;reviewRequired:boolean}):string{
 return new URLSearchParams({planner:'2',dogs:String(normalizePlannerCount(input.dogs)),cats:String(normalizePlannerCount(input.cats)),otherPets:String(normalizePlannerCount(input.otherPets)),duration:String(input.duration),windows:input.blocks.join(','),overnight:input.overnight?'1':'0',review:input.reviewRequired?'1':'0'}).toString();
}

export function parsePlannerPrefill(search:string):PlannerPrefill|null{
 const params=new URLSearchParams(search),version=params.get('planner');if(version===null)return null;
 const durationValue=params.get('duration'),duration=durationValue==='30'?30:durationValue==='60'?60:durationValue==='90'?90:null;
 const rawBlocks=(params.get('windows')||'').split(',').filter(Boolean),blocks=[...new Set(rawBlocks.filter(value=>/^[0-3]$/.test(value)).map(Number))];
 const overnight=params.get('overnight')==='1';
 let count:number|null=null,types:PetType[]=[],incomplete=duration===null||rawBlocks.some(value=>!/^[0-3]$/.test(value));
 let counts:PlannerContext['counts'];
 if(version==='2'){
  const values=[countValue(params.get('dogs')),countValue(params.get('cats')),countValue(params.get('otherPets'))];
  if(values.every((value):value is number=>value!==null)){
   count=values.reduce((sum,value)=>sum+value,0);
   if(count>0&&count<=8)types=values.flatMap((value,index)=>Array<PetType>(value).fill((['dog','cat','small'] as const)[index]));
   else{incomplete=true;counts=values as [number,number,number]}
  }else incomplete=true;
  if(!params.has('windows')||!['0','1'].includes(params.get('overnight')||'')||!['0','1'].includes(params.get('review')||''))incomplete=true;
 }else if(version==='1'){
  count=countValue(params.get('pets'));const household=params.get('household');
  if(count&&['Dog','Cat','Rabbit, bird, fish, or small animal'].includes(household||''))types=Array<PetType>(count).fill(household==='Dog'?'dog':household==='Cat'?'cat':'small');
  else incomplete=true;
 }else incomplete=true;
 const daytime:MiddayService=duration===90?'drop90':duration===60?'drop60':'drop30';
 const supportedDaytime=blocks.length===1&&business.windows[blocks[0]].startHour>=business.overnight.endHour&&business.windows[blocks[0]].endHour+(duration??30)/60<=business.overnight.startHour;
 const planner:PlannerContext={reviewRequired:version!=='2'||params.get('review')!=='0'||incomplete,incomplete,...(overnight&&duration?{overnightDuration:duration}:{}),...(counts?{counts}:{}),...(incomplete&&count!==null?{petCount:count}:{})};
 return{count,types,blocks,overnight,service:overnight?'overnight':daytime,midday:overnight&&supportedDaytime?daytime:'none',planner};
}

export function sanitizePlannerContext(value:unknown):PlannerContext|undefined{
 if(value===undefined)return undefined;
 if(!value||typeof value!=='object'||Array.isArray(value))return{reviewRequired:true,incomplete:true};
 const input=value as Record<string,unknown>;
 const invalid=typeof input.reviewRequired!=='boolean'||typeof input.incomplete!=='boolean'||(input.overnightDuration!==undefined&&![30,60,90].includes(input.overnightDuration as number));
 const counts=Array.isArray(input.counts)&&input.counts.length===3&&input.counts.every(count=>Number.isInteger(count)&&count>=0&&count<=8)?input.counts as [number,number,number]:undefined;
 return{reviewRequired:invalid||input.reviewRequired===true,incomplete:invalid||input.incomplete===true,...([30,60,90].includes(input.overnightDuration as number)?{overnightDuration:input.overnightDuration as 30|60|90}:{}),...(counts?{counts}:{}),...(Number.isInteger(input.petCount)&&Number(input.petCount)>=0&&Number(input.petCount)<=24?{petCount:Number(input.petCount)}:{})};
}

export function plannerCoverageText(blocks:number[],planner?:PlannerContext):string|undefined{
 if(!planner?.overnightDuration)return undefined;
 return blocks.length?`Separate ${planner.overnightDuration}-minute daytime care requested in each selected window: ${blocks.map(index=>business.windows[index]?.label).filter(Boolean).join(', ')}. Timing and any overlap with Standard Overnight Care require confirmation.`:'No separate daytime care selected.';
}
