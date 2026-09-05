import {resourceLimits} from '../config/resource-limits.ts';

type Bucket={count:number;reset:number};
const buckets=new Map<string,Bucket>();
export const MAX_RATE_LIMIT_BUCKETS=resourceLimits.processStateEntries.rateLimits;
export const clientKey=(request:Request)=>{const value=request.headers.get('cf-connecting-ip')?.trim()||'';return /^[0-9a-f:.]{3,45}$/i.test(value)?value:'unknown'};
export const pruneExpiredRateLimits=(now=Date.now())=>{let removed=0;for(const[key,bucket]of buckets)if(bucket.reset<=now){buckets.delete(key);removed++}return removed};
export const rateLimit=(key:string,limit:number,windowMs:number,now=Date.now())=>{pruneExpiredRateLimits(now);if(key.length>128)return{allowed:false,retryAfter:Math.ceil(windowMs/1000)};const current=buckets.get(key);if(!current){if(buckets.size>=MAX_RATE_LIMIT_BUCKETS)return{allowed:false,retryAfter:Math.ceil(windowMs/1000)};buckets.set(key,{count:1,reset:now+windowMs});return{allowed:true,retryAfter:0};}current.count++;return{allowed:current.count<=limit,retryAfter:Math.max(1,Math.ceil((current.reset-now)/1000))};};
export const rateLimitBucketCountForTests=()=>buckets.size;
export const resetRateLimitsForTests=()=>buckets.clear();
