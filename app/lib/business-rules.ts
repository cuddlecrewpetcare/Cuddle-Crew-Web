import {business,type TravelTierKey} from '../config/business.ts';
import {businessDate,calendarDayIndex,dateOnlyFromCalendarDayIndex,MILLISECONDS_PER_HOUR,resolveWallClock} from './time.ts';
export {businessDate,businessYear} from './time.ts';

/** ZIP alone is not an approved source for travel-zone classification. */
export const zoneForZip=(zip:string)=>/^[0-9]{5}$/.test(zip)?{state:'review' as const,name:'Personalized review required'}:{state:'incomplete' as const};

export const travelTierForMinutes=(minutes:number)=>{
  if(!Number.isFinite(minutes)||minutes<0)return null;
  const entries=Object.entries(business.travel) as [TravelTierKey,(typeof business.travel)[TravelTierKey]][];
  return entries.find(([,tier])=>tier.maximumMinutes===null||minutes<=tier.maximumMinutes)?.[0]??'beyond';
};

/** Exact qualifying dates remain unresolved until the holiday calendar is CURRENT / APPROVED. */
export const publicHolidays=(year:number):readonly []=>{void year;return[]};
export const holidayForDate=(date:string):undefined=>{void date;return undefined};

export const daysBetween=(start:string,end:string,checkoutExclusive=false)=>{const first=calendarDayIndex(start),last=calendarDayIndex(end);if(first===null||last===null||last<first)return[];const final=checkoutExclusive?last-1:last,out:string[]=[];for(let day=first;day<=final;day++)out.push(dateOnlyFromCalendarDayIndex(day));return out;};
export const possibleGapRange=(windowIndexes:number[],durationMinutes:number,overnight=false)=>{const duration=durationMinutes/60;const periods=windowIndexes.map(i=>business.windows[i]).filter(Boolean).map(w=>({earliest:w.startHour,latest:Math.max(w.startHour,w.endHour-duration),duration}));if(overnight)periods.push({earliest:business.overnight.startHour,latest:business.overnight.startHour,duration:14});if(!periods.length)return null;periods.sort((a,b)=>a.earliest-b.earliest);const minimum:number[]=[],maximum:number[]=[];periods.forEach((current,index)=>{const next=periods[(index+1)%periods.length],wrap=index===periods.length-1?24:0;minimum.push(Math.max(0,next.earliest+wrap-(current.latest+current.duration)));maximum.push(Math.max(0,next.latest+wrap-(current.earliest+current.duration)));});return{minimum:Math.max(...minimum),maximum:Math.max(...maximum),overnightMaximum:maximum.at(-1)!};};
export const estimatorCarePlanGap=(windowIndexes:number[],durationMinutes:number,overnight=false)=>possibleGapRange(overnight?[]:windowIndexes,durationMinutes,overnight);
export const plannerCareGap=(windowIndexes:number[],durationMinutes:number,overnight=false)=>possibleGapRange(windowIndexes,durationMinutes,overnight);

export type NoticeKind='past'|'same-day'|'short-notice'|'standard'|'review';
export const shortNoticeKind=(serviceDate:string,startHour:number,now:Date,service:'daytime'|'overnight'='daytime'):NoticeKind=>{const resolved=resolveWallClock(serviceDate,startHour);if(resolved.kind!=='exact')return'review';const diff=resolved.instant.getTime()-now.getTime();if(diff<0)return'past';if(businessDate(now)===serviceDate)return'same-day';if(diff<(service==='overnight'?48:24)*MILLISECONDS_PER_HOUR)return'short-notice';return'standard';};

export type AvailabilityStatus='Request for Review'|'Limited Availability'|'Very Limited'|'Contact for Availability';
const availabilityRank:Record<AvailabilityStatus,number>={'Request for Review':0,'Limited Availability':1,'Very Limited':2,'Contact for Availability':3};
export const applyAvailabilityOverrides=(date:string,current:AvailabilityStatus,overrides:readonly {start:string;end:string;status:Exclude<AvailabilityStatus,'Request for Review'>}[])=>overrides.filter(x=>x.start<=date&&x.end>=date).reduce<AvailabilityStatus>((status,override)=>availabilityRank[override.status]>availabilityRank[status]?override.status:status,current);
