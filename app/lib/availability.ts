import {business} from '../config/business.ts';
import {resourceLimits} from '../config/resource-limits.ts';
import {applyAvailabilityOverrides,type AvailabilityStatus} from './business-rules.ts';
import {calendarDayIndex,dateOnlyFromCalendarDayIndex,parseDateOnly,resolveWallClock} from './time.ts';
export const MAX_ICS_BYTES=resourceLimits.providerResponseBytes.calendar;
export const MAX_ICS_EVENTS=resourceLimits.calendar.maximumEvents;
export const MAX_ICS_PROCESSING_MS=resourceLimits.calendar.maximumProcessingMs;
export type CalendarDateValue={kind:'date';date:string}|{kind:'instant';instant:Date;timeZone:'UTC'|string};
export const validIsoDate=(value:string)=>parseDateOnly(value)!==null;
export const dateRange=(start:string,end:string)=>{const first=calendarDayIndex(start),last=calendarDayIndex(end);if(first===null||last===null||last<first)return[];const out:string[]=[];for(let day=first;day<=last;day++)out.push(dateOnlyFromCalendarDayIndex(day));return out};
export function parseIcsDate(value:string):CalendarDateValue|null{
  const separator=value.indexOf(':');if(separator<0)return null;
  const declaration=value.slice(0,separator),raw=value.slice(separator+1).trim();
  if(!/^DTSTART(?:;[^:\r\n]+)*$/i.test(declaration))return null;
  const parameters=declaration.split(';').slice(1),valueType=parameters.find(parameter=>/^VALUE=/i.test(parameter))?.slice(6).toUpperCase(),timeZone=parameters.find(parameter=>/^TZID=/i.test(parameter))?.slice(5);
  const dateMatch=/^(\d{4})(\d{2})(\d{2})$/.exec(raw);
  if(valueType==='DATE'||dateMatch){if(timeZone||!dateMatch)return null;const date=`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;return validIsoDate(date)?{kind:'date',date}:null}
  const dateTimeMatch=/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/.exec(raw);if(!dateTimeMatch)return null;
  const date=`${dateTimeMatch[1]}-${dateTimeMatch[2]}-${dateTimeMatch[3]}`,hour=Number(dateTimeMatch[4]),minute=Number(dateTimeMatch[5]),second=Number(dateTimeMatch[6]||0);
  if(dateTimeMatch[7]){if(timeZone||!validIsoDate(date)||hour>23||minute>59||second>59)return null;return{kind:'instant',instant:new Date(`${date}T${dateTimeMatch[4]}:${dateTimeMatch[5]}:${String(second).padStart(2,'0')}Z`),timeZone:'UTC'}}
  if(!timeZone)return null;
  try{const resolved=resolveWallClock(date,hour,minute,timeZone,second);return resolved.kind==='exact'?{kind:'instant',instant:resolved.instant,timeZone}:null}catch{return null}
}
export function publicAvailability(ics:string,days:string[],clock=()=>performance.now()){
  const started=clock();
  if(new TextEncoder().encode(ics).byteLength>MAX_ICS_BYTES)throw new Error('calendar-too-large');
  if(!/^BEGIN:VCALENDAR\r?$/mi.test(ics)||!/^END:VCALENDAR\r?$/mi.test(ics))throw new Error('calendar-malformed');
  const events=ics.replace(/\r?\n[ \t]/g,'').split('BEGIN:VEVENT').slice(1);
  if(events.length>MAX_ICS_EVENTS)throw new Error('calendar-too-many-events');
  for(const [index,raw] of events.entries()){if(index%50===0&&clock()-started>MAX_ICS_PROCESSING_MS)throw new Error('calendar-processing-time');const event=raw.split('END:VEVENT')[0];if(/STATUS:CANCELLED/i.test(event)||/TRANSP:TRANSPARENT/i.test(event))continue;const startLine=event.match(/^DTSTART[^\r\n]*$/mi)?.[0];if(!startLine||!parseIcsDate(startLine))throw new Error('calendar-time-ambiguous')}
  const publicDays=days.map(date=>({date,status:applyAvailabilityOverrides(date,'Request for Review',business.availabilityOverrides)}));
  const rank:Record<AvailabilityStatus,number>={'Request for Review':0,'Limited Availability':1,'Very Limited':2,'Contact for Availability':3};
  return{state:publicDays.reduce((worst,day)=>rank[day.status]>rank[worst]?day.status:worst,'Request for Review' as AvailabilityStatus),days:publicDays};
}
