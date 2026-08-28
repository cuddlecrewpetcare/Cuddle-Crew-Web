const dayMs=86_400_000;
const iso=(date:Date)=>date.toISOString().slice(0,10);
const parseIcsDate=(value:string)=>{
  const raw=value.split(':').pop()?.trim()||'';
  const match=raw.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?Z?)?/);
  if(!match)return null;
  return new Date(Date.UTC(+match[1],+match[2]-1,+match[3],+(match[4]||0),+(match[5]||0),+(match[6]||0)));
};
const dateRange=(start:string,end:string)=>{
  const out:string[]=[];
  for(let cursor=new Date(`${start}T12:00:00Z`),last=new Date(`${end}T12:00:00Z`);cursor<=last;cursor=new Date(cursor.getTime()+dayMs))out.push(iso(cursor));
  return out;
};
type PublicDay={date:string;status:'Good Availability'|'Limited Availability'|'Very Limited'|'Contact for Availability'};

export async function GET(request:Request){
  const url=new URL(request.url),start=url.searchParams.get('start')||'',end=url.searchParams.get('end')||'';
  if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||!/^\d{4}-\d{2}-\d{2}$/.test(end)||end<start)return Response.json({error:'Choose a valid date range.'},{status:400});
  const days=dateRange(start,end);if(days.length<1||days.length>31)return Response.json({error:'Choose a range of 31 days or fewer.'},{status:400});
  const configured=process.env.PRIVATE_CALENDAR_ICS_URL;
  const fallback=()=>Response.json({state:'Contact for Availability',days:days.map(date=>({date,status:'Contact for Availability'})),lastUpdated:new Date().toISOString(),source:'fallback',disclaimer:'Availability is provided for planning purposes only and may not reflect recent requests or scheduling changes. Services are not reserved until reviewed and confirmed.'},{headers:{'Cache-Control':'public, max-age=60'}});
  if(!configured)return fallback();
  try{
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);
    const response=await fetch(configured.replace(/^webcal:/i,'https:'),{signal:controller.signal,headers:{Accept:'text/calendar'},cf:{cacheTtl:300} as never});clearTimeout(timer);
    if(!response.ok)return fallback();
    const text=(await response.text()).replace(/\r?\n[ \t]/g,'');
    const events=text.split('BEGIN:VEVENT').slice(1).map(block=>block.split('END:VEVENT')[0]);
    const load:Record<string,number>={};for(const day of days)load[day]=0;
    for(const event of events){if(/STATUS:CANCELLED/i.test(event)||/TRANSP:TRANSPARENT/i.test(event))continue;const startLine=event.match(/^DTSTART[^\r\n]*$/mi)?.[0],endLine=event.match(/^DTEND[^\r\n]*$/mi)?.[0];if(!startLine)continue;const begins=parseIcsDate(startLine),ends=endLine?parseIcsDate(endLine):null;if(!begins)continue;const first=iso(begins),last=iso(new Date(Math.max(begins.getTime(),(ends?.getTime()||begins.getTime()+3_600_000)-1)));for(const day of dateRange(first,last)){if(day in load)load[day]++}}
    const publicDays:PublicDay[]=days.map(date=>({date,status:load[date]<=1?'Good Availability':load[date]<=3?'Limited Availability':load[date]<=5?'Very Limited':'Contact for Availability'}));
    const rank={'Good Availability':0,'Limited Availability':1,'Very Limited':2,'Contact for Availability':3};const state=publicDays.reduce((worst,day)=>rank[day.status]>rank[worst]?day.status:worst,'Good Availability' as PublicDay['status']);
    return Response.json({state,days:publicDays,lastUpdated:new Date().toISOString(),source:'calendar',disclaimer:'Availability is provided for planning purposes only and may not reflect recent requests or scheduling changes. Services are not reserved until reviewed and confirmed.'},{headers:{'Cache-Control':'public, max-age=300, stale-while-revalidate=300'}});
  }catch{return fallback()}
}
