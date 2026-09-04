import {dateRange,MAX_ICS_BYTES,publicAvailability,validIsoDate} from '../../lib/availability.ts';
import {clientKey,rateLimit} from '../../lib/rate-limit.ts';
import {fetchWithTimeout,safeCalendarUrl} from '../../lib/server-security.ts';
const disclaimer='Calendar space is not operational capacity. Every request requires route, travel, care-time, documentation, buffer, and existing-commitment review before availability is confirmed.';
export async function GET(request:Request){
 const limit=rateLimit(`availability:${clientKey(request)}`,30,5*60_000);if(!limit.allowed)return Response.json({error:'Too many checks. Please wait and try again.'},{status:429,headers:{'Retry-After':String(limit.retryAfter)}});
 const url=new URL(request.url),start=url.searchParams.get('start')||'',end=url.searchParams.get('end')||'';if(!validIsoDate(start)||!validIsoDate(end)||end<start)return Response.json({error:'Choose a valid date range.'},{status:400});
 const days=dateRange(start,end);if(days.length<1||days.length>31)return Response.json({error:'Choose a range of 31 days or fewer.'},{status:400});
 const fallback=()=>Response.json({state:'Request for Review',days:days.map(date=>({date,status:'Request for Review'})),lastUpdated:new Date().toISOString(),source:'fallback',disclaimer},{headers:{'Cache-Control':'public, max-age=60'}});
 const calendarUrl=safeCalendarUrl(process.env.PRIVATE_CALENDAR_ICS_URL||'');if(!calendarUrl)return fallback();
 try{const response=await fetchWithTimeout(calendarUrl,{headers:{Accept:'text/calendar'},cf:{cacheTtl:300} as never},7000);const declared=Number(response.headers.get('content-length'));if(!response.ok||(Number.isFinite(declared)&&declared>MAX_ICS_BYTES))return fallback();const result=publicAvailability(await response.text(),days);return Response.json({...result,lastUpdated:new Date().toISOString(),source:'calendar',disclaimer},{headers:{'Cache-Control':'public, max-age=300, stale-while-revalidate=300'}})}catch{return fallback()}
}
