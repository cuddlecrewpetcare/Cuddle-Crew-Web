import {rateLimit,clientKey} from '../../../lib/rate-limit';
import {addressFeaturesAvailable,parseAddressValidation,routeContext} from '../../../lib/address';
import {zoneForZip} from '../../../lib/business-rules';
const clean=(value:unknown)=>typeof value==='string'?value.trim().slice(0,180):'';
export async function POST(request:Request){
 const limit=rateLimit(`address-check:${clientKey(request)}`,12,5*60_000);if(!limit.allowed)return Response.json({error:'Please wait and try again.'},{status:429});
 const key=process.env.GOOGLE_MAPS_SERVER_KEY,origin=process.env.PRIVATE_SERVICE_ORIGIN;if(!addressFeaturesAvailable(key,origin))return Response.json({available:false},{status:503});
 const body=await request.json().catch(()=>({})) as Record<string,unknown>;const address=clean(body.address);if(address.length<6)return Response.json({error:'Enter a complete street address.'},{status:400});
 try{
  const validation=await fetch(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${encodeURIComponent(key!)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({address:{regionCode:'US',addressLines:[address]}})});if(!validation.ok)throw new Error();const normalized=parseAddressValidation(await validation.json());if(!normalized)return Response.json({error:'We could not confirm that address. Try the ZIP checker instead.'},{status:422});
  let travelContext:string|undefined;try{const route=await fetch('https://routes.googleapis.com/directions/v2:computeRoutes',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key!,'X-Goog-FieldMask':'routes.duration,routes.distanceMeters'},body:JSON.stringify({origin:{address:origin},destination:{address:normalized.normalizedDestination||address},travelMode:'DRIVE'})});if(route.ok){const data=await route.json() as {routes?:{duration?:string;distanceMeters?:number}[]},first=data.routes?.[0],seconds=Number((first?.duration||'').replace('s',''));if(first)travelContext=routeContext(seconds,first.distanceMeters||0)}}catch{}
  const zone=zoneForZip(normalized.zip);return Response.json({available:true,zip:normalized.zip,city:normalized.city,zone,travelContext},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({available:false},{status:503})}
}
