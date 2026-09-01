import {dateRange,MAX_ICS_BYTES,publicAvailability,validIsoDate} from '../../lib/availability.ts';
import {clientKey,rateLimit} from '../../lib/rate-limit.ts';
import {fetchWithTimeout,safeCalendarUrl} from '../../lib/server-security.ts';
const disclaimer='Availability is provided for planning purposes only and may not reflect recent requests or scheduling changes. Services are not reserved until reviewed and confirmed.';
export async function GET(request:Request){
 const limit=rateLimit(`availability:${clientKey(request)}`,30,5*60_000);if(!limit.allowed)return Response.json({error:'Too many checks. Please wait and try again.'},{status:429,headers:{'Retry-After':String(limit.retryAfter)}});
 const url=new URL(request.url),start=url.searchParams.get('start')||'',end=url.searchParams.get('end')||'';if(!validIsoDate(start)||!validIsoDate(end)||end<start)return Response.json({error:'Choose a valid date range.'},{status:400});
 const days=dateRange(start,end);if(days.length<1||days.length>31)return Response.json({error:'Choose a range of 31 days or fewer.'},{status:400});
 const fallback=()=>Response.json({state:'Contact for Availability',days:days.map(date=>({date,status:'Contact for Availability'})),lastUpdated:new Date().toISOString(),source:'fallback',disclaimer},{headers:{'Cache-Control':'public, max-age=60'}});
 const calendarUrl=safeCalendarUrl(process.env.PRIVATE_CALENDAR_ICS_URL||'');if(!calendarUrl)return fallback();
 try{const response=await fetchWithTimeout(calendarUrl,{headers:{Accept:'text/calendar'},cf:{cacheTtl:300} as never},7000);const declared=Number(response.headers.get('content-length'));if(!response.ok||(Number.isFinite(declared)&&declared>MAX_ICS_BYTES))return fallback();const result=publicAvailability(await response.text(),days);return Response.json({...result,lastUpdated:new Date().toISOString(),source:'calendar',disclaimer},{headers:{'Cache-Control':'public, max-age=300, stale-while-revalidate=300'}})}catch{return fallback()}
}
