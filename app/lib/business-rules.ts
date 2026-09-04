import {business,type TravelTierKey} from '../config/business.ts';

const isoLocal=(date:Date)=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const businessDate=(date:Date=new Date(),timezone=business.timezone)=>new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
export const businessYear=(date:Date=new Date(),timezone=business.timezone)=>Number(new Intl.DateTimeFormat('en-US',{timeZone:timezone,year:'numeric'}).format(date));

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

export const daysBetween=(start:string,end:string,checkoutExclusive=false)=>{if(!start||!end||end<start)return[];const out:string[]=[],cursor=new Date(`${start}T12:00:00`),last=new Date(`${end}T12:00:00`);while(cursor<last||(!checkoutExclusive&&cursor.getTime()===last.getTime())){out.push(isoLocal(cursor));cursor.setDate(cursor.getDate()+1);}return out;};
export const possibleGapRange=(windowIndexes:number[],durationMinutes:number,overnight=false)=>{const duration=durationMinutes/60;const periods=windowIndexes.map(i=>business.windows[i]).filter(Boolean).map(w=>({earliest:w.startHour,latest:Math.max(w.startHour,w.endHour-duration),duration}));if(overnight)periods.push({earliest:business.overnight.startHour,latest:business.overnight.startHour,duration:14});if(!periods.length)return null;periods.sort((a,b)=>a.earliest-b.earliest);const minimum:number[]=[],maximum:number[]=[];periods.forEach((current,index)=>{const next=periods[(index+1)%periods.length],wrap=index===periods.length-1?24:0;minimum.push(Math.max(0,next.earliest+wrap-(current.latest+current.duration)));maximum.push(Math.max(0,next.latest+wrap-(current.earliest+current.duration)));});return{minimum:Math.max(...minimum),maximum:Math.max(...maximum),overnightMaximum:maximum.at(-1)!};};
export const estimatorCarePlanGap=(windowIndexes:number[],durationMinutes:number,overnight=false)=>possibleGapRange(overnight?[]:windowIndexes,durationMinutes,overnight);
export const plannerCareGap=(windowIndexes:number[],durationMinutes:number,overnight=false)=>possibleGapRange(windowIndexes,durationMinutes,overnight);

export type NoticeKind='past'|'same-day'|'short-notice'|'standard';
export const shortNoticeKind=(serviceDate:string,startHour:number,now:Date,service:'daytime'|'overnight'='daytime'):NoticeKind=>{const serviceTime=new Date(`${serviceDate}T${String(startHour).padStart(2,'0')}:00:00`),diff=serviceTime.getTime()-now.getTime();if(diff<0)return'past';if(isoLocal(now)===serviceDate)return'same-day';if(diff<(service==='overnight'?48:24)*3_600_000)return'short-notice';return'standard';};

export type AvailabilityStatus='Request for Review'|'Limited Availability'|'Very Limited'|'Contact for Availability';
const availabilityRank:Record<AvailabilityStatus,number>={'Request for Review':0,'Limited Availability':1,'Very Limited':2,'Contact for Availability':3};
export const applyAvailabilityOverrides=(date:string,current:AvailabilityStatus,overrides:readonly {start:string;end:string;status:Exclude<AvailabilityStatus,'Request for Review'>}[])=>overrides.filter(x=>x.start<=date&&x.end>=date).reduce<AvailabilityStatus>((status,override)=>availabilityRank[override.status]>availabilityRank[status]?override.status:status,current);
