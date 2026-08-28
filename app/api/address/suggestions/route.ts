import {rateLimit,clientKey} from '../../../lib/rate-limit';
import {parseAutocomplete} from '../../../lib/address';
const clean=(value:unknown)=>typeof value==='string'?value.trim().slice(0,180):'';
export async function POST(request:Request){
 const limit=rateLimit(`address-suggest:${clientKey(request)}`,25,5*60_000);if(!limit.allowed)return Response.json({error:'Please wait and try again.'},{status:429});
 const key=process.env.GOOGLE_MAPS_SERVER_KEY;if(!key)return Response.json({available:false,suggestions:[]},{status:503});
 const input=clean((await request.json().catch(()=>({}))).input);if(input.length<4)return Response.json({available:true,suggestions:[]});
 try{const response=await fetch('https://places.googleapis.com/v1/places:autocomplete',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text'},body:JSON.stringify({input,includedRegionCodes:['us']})});if(!response.ok)throw new Error();return Response.json({available:true,suggestions:parseAutocomplete(await response.json())},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({available:false,suggestions:[]},{status:503})}
}
