type Bucket={count:number;reset:number};
const buckets=new Map<string,Bucket>();
export const clientKey=(request:Request)=>{const value=request.headers.get('cf-connecting-ip')?.trim()||'';return /^[0-9a-f:.]{3,45}$/i.test(value)?value:'unknown'};
export const pruneExpiredRateLimits=(now=Date.now())=>{let removed=0;for(const[key,bucket]of buckets)if(bucket.reset<=now){buckets.delete(key);removed++}return removed};
export const rateLimit=(key:string,limit:number,windowMs:number,now=Date.now())=>{pruneExpiredRateLimits(now);const current=buckets.get(key);if(!current){buckets.set(key,{count:1,reset:now+windowMs});return{allowed:true,retryAfter:0};}current.count++;return{allowed:current.count<=limit,retryAfter:Math.ceil((current.reset-now)/1000)};};
export const resetRateLimitsForTests=()=>buckets.clear();
