import {business} from '../config/business.ts';
import {applyAvailabilityOverrides,type AvailabilityStatus} from './business-rules.ts';
export const MAX_ICS_BYTES=512_000;
export const MAX_ICS_EVENTS=2_000;
export const MAX_ICS_PROCESSING_MS=100;
const dayMs=86_400_000;
const iso=(date:Date)=>date.toISOString().slice(0,10);
const parseIcsDate=(value:string)=>{const raw=value.split(':').pop()?.trim()||'',match=raw.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?Z?)?/);return match?new Date(Date.UTC(+match[1],+match[2]-1,+match[3],+(match[4]||0),+(match[5]||0),+(match[6]||0))):null};
export const validIsoDate=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&iso(new Date(`${value}T12:00:00Z`))===value;
export const dateRange=(start:string,end:string)=>{const out:string[]=[];for(let cursor=new Date(`${start}T12:00:00Z`),last=new Date(`${end}T12:00:00Z`);cursor<=last;cursor=new Date(cursor.getTime()+dayMs))out.push(iso(cursor));return out};
export function publicAvailability(ics:string,days:string[],clock=()=>performance.now()){
  const started=clock();
  if(new TextEncoder().encode(ics).byteLength>MAX_ICS_BYTES)throw new Error('calendar-too-large');
  const events=ics.replace(/\r?\n[ \t]/g,'').split('BEGIN:VEVENT').slice(1);
  if(events.length>MAX_ICS_EVENTS)throw new Error('calendar-too-many-events');
  const load:Record<string,number>=Object.fromEntries(days.map(day=>[day,0]));
  for(const [index,raw] of events.entries()){if(index%50===0&&clock()-started>MAX_ICS_PROCESSING_MS)throw new Error('calendar-processing-time');const event=raw.split('END:VEVENT')[0];if(/STATUS:CANCELLED/i.test(event)||/TRANSP:TRANSPARENT/i.test(event))continue;const startLine=event.match(/^DTSTART[^\r\n]*$/mi)?.[0],endLine=event.match(/^DTEND[^\r\n]*$/mi)?.[0];if(!startLine)continue;const begins=parseIcsDate(startLine),ends=endLine?parseIcsDate(endLine):null;if(!begins)continue;const first=iso(begins),last=iso(new Date(Math.max(begins.getTime(),(ends?.getTime()||begins.getTime()+3_600_000)-1)));for(const day of days)if(day>=first&&day<=last)load[day]++}
  const publicDays=days.map(date=>{const calendarStatus:AvailabilityStatus=load[date]<=1?'Good Availability':load[date]<=3?'Limited Availability':load[date]<=5?'Very Limited':'Contact for Availability';return{date,status:applyAvailabilityOverrides(date,calendarStatus,business.availabilityOverrides)}});
  const rank:Record<AvailabilityStatus,number>={'Good Availability':0,'Limited Availability':1,'Very Limited':2,'Contact for Availability':3};
  return{state:publicDays.reduce((worst,day)=>rank[day.status]>rank[worst]?day.status:worst,'Good Availability' as AvailabilityStatus),days:publicDays};
}
