export type JsonObject=Record<string,unknown>;

type BoundedBytesResult={ok:true;bytes:Uint8Array}|{ok:false;reason:'too-large'|'unreadable'|'timeout'};
export type BoundedTextResult={ok:true;text:string}|{ok:false;reason:'too-large'|'unreadable'|'timeout'};
export type BoundedJsonResult={ok:true;value:unknown}|{ok:false;reason:'too-large'|'unreadable'|'timeout'|'invalid-json'};
type ResponseDeadline={timer:ReturnType<typeof setTimeout>;expires:number};
const responseDeadlines=new WeakMap<Response,ResponseDeadline>();

const declaredTooLarge=(headers:Headers,maxBytes:number)=>{
  const value=headers.get('content-length');
  if(value===null)return false;
  const declared=Number(value);
  return Number.isFinite(declared)&&declared>maxBytes;
};
const cancelBody=async(stream:ReadableStream<Uint8Array>|null)=>{try{await stream?.cancel()}catch{/* Rejection still follows the safe oversized path. */}};

async function readBoundedBytes(stream:ReadableStream<Uint8Array>|null,maxBytes:number,timeoutMs?:number):Promise<BoundedBytesResult>{
  if(!stream)return{ok:true,bytes:new Uint8Array()};
  const reader=stream.getReader(),chunks:Uint8Array[]=[];
  let total=0,timedOut=false;
  const timer=timeoutMs===undefined?undefined:setTimeout(()=>{timedOut=true;void reader.cancel().catch(()=>{})},Math.max(0,timeoutMs));
  try{
    while(true){
      const{done,value}=await reader.read();
      if(timedOut)return{ok:false,reason:'timeout'};
      if(done)break;
      total+=value.byteLength;
      if(total>maxBytes){try{await reader.cancel()}catch{/* Rejection still follows the safe oversized path. */}return{ok:false,reason:'too-large'}}
      chunks.push(value);
    }
  }catch{return{ok:false,reason:timedOut?'timeout':'unreadable'}}finally{if(timer)clearTimeout(timer);reader.releaseLock()}
  const bytes=new Uint8Array(total);
  let offset=0;
  for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}
  return{ok:true,bytes};
}

export async function readResponseText(response:Response,maxBytes:number):Promise<BoundedTextResult>{
  const deadline=responseDeadlines.get(response);
  try{
    if(declaredTooLarge(response.headers,maxBytes)){await cancelBody(response.body);return{ok:false,reason:'too-large'}}
    const result=await readBoundedBytes(response.body,maxBytes,deadline?deadline.expires-Date.now():undefined);
    return result.ok?{ok:true,text:new TextDecoder().decode(result.bytes)}:result;
  }finally{if(deadline){clearTimeout(deadline.timer);responseDeadlines.delete(response)}}
}

export async function readResponseJson(response:Response,maxBytes:number):Promise<BoundedJsonResult>{
  const result=await readResponseText(response,maxBytes);
  if(!result.ok)return result;
  try{return{ok:true,value:JSON.parse(result.text)}}catch{return{ok:false,reason:'invalid-json'}}
}

export async function readJsonObject(request:Request,maxBytes:number,allowedKeys:readonly string[]){
  if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))return{ok:false as const,status:415,error:'Content-Type must be application/json.'};
  if(declaredTooLarge(request.headers,maxBytes)){await cancelBody(request.body);return{ok:false as const,status:413,error:'Request is too large.'}}
  const body=await readBoundedBytes(request.body,maxBytes);
  if(!body.ok)return body.reason==='too-large'?{ok:false as const,status:413,error:'Request is too large.'}:{ok:false as const,status:400,error:'Invalid request.'};
  let value:unknown;
  try{value=JSON.parse(new TextDecoder().decode(body.bytes))}catch{return{ok:false as const,status:400,error:'Invalid JSON.'}}
  if(!value||typeof value!=='object'||Array.isArray(value))return{ok:false as const,status:400,error:'Request must be a JSON object.'};
  const object=value as JsonObject;
  if(Object.keys(object).some(key=>!allowedKeys.includes(key)))return{ok:false as const,status:400,error:'Request contains unsupported fields.'};
  return{ok:true as const,value:object};
}

export async function fetchWithTimeout(input:RequestInfo|URL,init:RequestInit={},timeoutMs=7000,fetcher:typeof fetch=fetch){
  const controller=new AbortController();
  const expires=Date.now()+Math.max(0,timeoutMs);
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{const response=await fetcher(input,{...init,signal:controller.signal});responseDeadlines.set(response,{timer,expires});return response}catch(error){clearTimeout(timer);throw error}
}

export async function discardResponseBody(response:Response){
  const deadline=responseDeadlines.get(response);
  if(deadline){clearTimeout(deadline.timer);responseDeadlines.delete(response)}
  await cancelBody(response.body);
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
