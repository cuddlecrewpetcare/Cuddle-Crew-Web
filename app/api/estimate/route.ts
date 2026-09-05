import {business,serviceCatalog,type TravelTierKey} from '../../config/business.ts';
import {calculateEstimate} from '../../lib/estimate.ts';
import type {EstimateInput,EstimatePet,EstimateService,MiddayService,PetType,PublicEstimateResult} from '../../lib/estimate-types.ts';
import {clientKey,rateLimit} from '../../lib/rate-limit.ts';
import {readJsonObject} from '../../lib/server-security.ts';
import {createRequestId,jsonWithRequestId,logDiagnostic} from '../../lib/observability.ts';
import {resourceLimits} from '../../config/resource-limits.ts';

const petTypes=new Set<PetType>(['dog','cat','rabbit','bird','fish','small']);
const services=new Set<EstimateService>(Object.keys(serviceCatalog) as EstimateService[]);
const middayServices=new Set<MiddayService>(['none','drop30','drop60','drop90','walk30','walk60','walk90']);
const travelTiers=new Set<TravelTierKey>(Object.keys(business.travel) as TravelTierKey[]);
const validDate=(value:unknown):value is string=>{if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const parsed=new Date(`${value}T12:00:00Z`);return!Number.isNaN(parsed.getTime())&&parsed.toISOString().slice(0,10)===value};

export async function POST(request:Request){
 const requestId=createRequestId(),json=(body:unknown,init:ResponseInit={})=>{const headers=new Headers(init.headers);headers.set('Cache-Control','no-store');return jsonWithRequestId(body,requestId,{...init,headers})};
 const limit=rateLimit(`estimate:${clientKey(request)}`,60,5*60_000);if(!limit.allowed){logDiagnostic('WARN','security.rate_limited',{operation:'estimate',requestId,category:'RATE_LIMIT',result:'rejected'});return json({error:'Please wait and try again.'},{status:429,headers:{'Retry-After':String(limit.retryAfter)}})}
 const parsed=await readJsonObject(request,resourceLimits.requestBodyBytes.estimate,['pets','service','start','end','blocks','midday','zip','travelTier']);if(!parsed.ok)return json({error:parsed.error},{status:parsed.status});
 const value=parsed.value,pets=Array.isArray(value.pets)?value.pets:[];
 if(pets.length<1||pets.length>resourceLimits.estimate.maximumPets||!pets.every(p=>p&&typeof p==='object'&&petTypes.has((p as {type?:PetType}).type as PetType)))return json({error:'Choose a valid pet household.'},{status:400});
 const service=value.service as EstimateService,midday=value.midday as MiddayService,travelTier=value.travelTier as TravelTierKey|undefined;
 if(!services.has(service)||!middayServices.has(midday)||(travelTier!==undefined&&!travelTiers.has(travelTier)))return json({error:'Choose valid service options.'},{status:400});
 if(!validDate(value.start)||!validDate(value.end)||value.end<value.start||(Date.parse(`${value.end}T12:00:00Z`)-Date.parse(`${value.start}T12:00:00Z`))/86_400_000>resourceLimits.estimate.maximumDays||typeof value.zip!=='string'||!/^\d{5}$/.test(value.zip))return json({error:'Choose valid dates and ZIP.'},{status:400});
 const blocks=Array.isArray(value.blocks)?[...new Set(value.blocks.filter((x):x is number=>Number.isInteger(x)&&Number(x)>=0&&Number(x)<business.windows.length))]:[];
 const input:EstimateInput={pets:pets.map(p=>({type:(p as EstimatePet).type,complex:(p as EstimatePet).complex===true})),service,start:value.start,end:value.end,blocks,midday,zip:value.zip,travelTier,now:new Date()};
 const output=calculateEstimate(input);if(!output.result)return json(output);
 const{reviewReasons:privateReasons,...publicResult}=output.result;void privateReasons;
 return json({issues:output.issues,result:publicResult satisfies PublicEstimateResult});
}
