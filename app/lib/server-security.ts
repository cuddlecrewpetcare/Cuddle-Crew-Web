export type JsonObject=Record<string,unknown>;

export async function readJsonObject(request:Request,maxBytes:number,allowedKeys:readonly string[]){
  if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))return{ok:false as const,status:415,error:'Content-Type must be application/json.'};
  const declared=Number(request.headers.get('content-length'));
  if(Number.isFinite(declared)&&declared>maxBytes)return{ok:false as const,status:413,error:'Request is too large.'};
  let bytes:ArrayBuffer;
  try{bytes=await request.arrayBuffer()}catch{return{ok:false as const,status:400,error:'Invalid request.'}}
  if(bytes.byteLength>maxBytes)return{ok:false as const,status:413,error:'Request is too large.'};
  let value:unknown;
  try{value=JSON.parse(new TextDecoder().decode(bytes))}catch{return{ok:false as const,status:400,error:'Invalid JSON.'}}
  if(!value||typeof value!=='object'||Array.isArray(value))return{ok:false as const,status:400,error:'Request must be a JSON object.'};
  const object=value as JsonObject;
  if(Object.keys(object).some(key=>!allowedKeys.includes(key)))return{ok:false as const,status:400,error:'Request contains unsupported fields.'};
  return{ok:true as const,value:object};
}

export async function fetchWithTimeout(input:RequestInfo|URL,init:RequestInit={},timeoutMs=7000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{return await fetch(input,{...init,signal:controller.signal})}finally{clearTimeout(timer)}
}

export function safeCalendarUrl(value:string){
  try{
    const url=new URL(value.replace(/^webcal:/i,'https:'));
    if(url.protocol!=='https:'||url.username||url.password)return undefined;
    const host=url.hostname.toLowerCase();
    if(host==='localhost'||host.endsWith('.local')||/^127\./.test(host)||/^10\./.test(host)||/^192\.168\./.test(host)||/^169\.254\./.test(host)||/^172\.(1[6-9]|2\d|3[01])\./.test(host)||host==='::1')return undefined;
    return url.toString();
  }catch{return undefined}
}
