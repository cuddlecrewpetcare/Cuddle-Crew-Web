import {business} from '../config/business.ts';

export const MILLISECONDS_PER_HOUR=3_600_000;
const MILLISECONDS_PER_CALENDAR_INDEX_DAY=86_400_000;
const dateOnlyPattern=/^(\d{4})-(\d{2})-(\d{2})$/;

export type DateOnlyParts={year:number;month:number;day:number};
export type WallClockResolution={kind:'exact';instant:Date}|{kind:'ambiguous'|'nonexistent'};

const dateFormatterCache=new Map<string,Intl.DateTimeFormat>();
const dateTimeFormatterCache=new Map<string,Intl.DateTimeFormat>();
const dateFormatter=(timeZone:string)=>{
  let formatter=dateFormatterCache.get(timeZone);
  if(!formatter){formatter=new Intl.DateTimeFormat('en-US-u-ca-iso8601-nu-latn',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'});dateFormatterCache.set(timeZone,formatter)}
  return formatter;
};
const dateTimeFormatter=(timeZone:string)=>{
  let formatter=dateTimeFormatterCache.get(timeZone);
  if(!formatter){formatter=new Intl.DateTimeFormat('en-US-u-ca-iso8601-nu-latn',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});dateTimeFormatterCache.set(timeZone,formatter)}
  return formatter;
};
const numericParts=(formatter:Intl.DateTimeFormat,instant:Date)=>Object.fromEntries(formatter.formatToParts(instant).filter(part=>part.type!=='literal').map(part=>[part.type,Number(part.value)])) as Record<string,number>;

export function parseDateOnly(value:string):DateOnlyParts|null{
  const match=dateOnlyPattern.exec(value);if(!match)return null;
  const parts={year:Number(match[1]),month:Number(match[2]),day:Number(match[3])};
  const probe=new Date(0);probe.setUTCFullYear(parts.year,parts.month-1,parts.day);probe.setUTCHours(0,0,0,0);
  return probe.getUTCFullYear()===parts.year&&probe.getUTCMonth()===parts.month-1&&probe.getUTCDate()===parts.day?parts:null;
}

/** UTC is only a stable integer calendar index here; it does not assign UTC semantics to a business date. */
export function calendarDayIndex(value:string):number|null{const parts=parseDateOnly(value);if(!parts)return null;const date=new Date(0);date.setUTCFullYear(parts.year,parts.month-1,parts.day);date.setUTCHours(0,0,0,0);return date.getTime()/MILLISECONDS_PER_CALENDAR_INDEX_DAY}
export const dateOnlyFromCalendarDayIndex=(index:number)=>new Date(index*MILLISECONDS_PER_CALENDAR_INDEX_DAY).toISOString().slice(0,10);
export const addCalendarDays=(value:string,days:number)=>{const index=calendarDayIndex(value);return index===null||!Number.isInteger(days)?null:dateOnlyFromCalendarDayIndex(index+days)};
export const calendarDayDifference=(start:string,end:string)=>{const first=calendarDayIndex(start),last=calendarDayIndex(end);return first===null||last===null?null:last-first};

export function businessDate(instant:Date=new Date(),timeZone:string=business.timezone){
  const parts=numericParts(dateFormatter(timeZone),instant);
  return `${String(parts.year).padStart(4,'0')}-${String(parts.month).padStart(2,'0')}-${String(parts.day).padStart(2,'0')}`;
}
export const businessYear=(instant:Date=new Date(),timeZone:string=business.timezone)=>Number(businessDate(instant,timeZone).slice(0,4));

const wallClockParts=(instant:Date,timeZone:string)=>{const parts=numericParts(dateTimeFormatter(timeZone),instant);return{year:parts.year,month:parts.month,day:parts.day,hour:parts.hour,minute:parts.minute,second:parts.second}};
const sameWallClock=(actual:ReturnType<typeof wallClockParts>,wanted:ReturnType<typeof wallClockParts>)=>actual.year===wanted.year&&actual.month===wanted.month&&actual.day===wanted.day&&actual.hour===wanted.hour&&actual.minute===wanted.minute&&actual.second===wanted.second;

/** Resolves an explicit local wall-clock value and refuses DST gaps or repeated local times. */
export function resolveWallClock(date:string,hour:number,minute=0,timeZone:string=business.timezone,second=0):WallClockResolution{
  const parsed=parseDateOnly(date);if(!parsed||!Number.isInteger(hour)||hour<0||hour>23||!Number.isInteger(minute)||minute<0||minute>59||!Number.isInteger(second)||second<0||second>59)return{kind:'nonexistent'};
  const wanted={...parsed,hour,minute,second},wantedAsUtc=Date.UTC(parsed.year,parsed.month-1,parsed.day,hour,minute,second);
  let candidate=wantedAsUtc;
  for(let attempt=0;attempt<4;attempt++){const actual=wallClockParts(new Date(candidate),timeZone);candidate-=Date.UTC(actual.year,actual.month-1,actual.day,actual.hour,actual.minute,actual.second)-wantedAsUtc}
  const matches=new Set<number>();
  for(let offset=-4*MILLISECONDS_PER_HOUR;offset<=4*MILLISECONDS_PER_HOUR;offset+=15*60_000){const value=candidate+offset;if(sameWallClock(wallClockParts(new Date(value),timeZone),wanted))matches.add(value)}
  if(matches.size===0)return{kind:'nonexistent'};
  if(matches.size>1)return{kind:'ambiguous'};
  return{kind:'exact',instant:new Date([...matches][0])};
}

export function assertTimeZoneSupported(timeZone:string=business.timezone){new Intl.DateTimeFormat('en-US',{timeZone}).format(new Date(0));return true}
