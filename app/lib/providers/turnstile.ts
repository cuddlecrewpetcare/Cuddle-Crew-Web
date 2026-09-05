import {fetchWithTimeout,readResponseJson} from '../server-security.ts';
import {resourceLimits} from '../../config/resource-limits.ts';
import {providerFailureForException,providerFailureForStatus,type ProviderFailure} from './errors.ts';

export const TURNSTILE_TIMEOUT_MS=resourceLimits.providerTimeoutMs.turnstile;
export const TURNSTILE_MAX_RESPONSE_BYTES=resourceLimits.providerResponseBytes.turnstile;
export type TurnstileResult={ok:true;verified:boolean}|ProviderFailure;

export async function verifyTurnstile(
  token:string,
  ip:string,
  secret=process.env.TURNSTILE_SECRET_KEY,
  fetcher?:typeof fetch,
):Promise<TurnstileResult>{
  if(!secret)return{ok:true,verified:true};
  if(!token)return{ok:true,verified:false};
  const body=new FormData();
  body.set('secret',secret);
  body.set('response',token);
  if(ip!=='unknown')body.set('remoteip',ip);
  try{
    const response=await fetchWithTimeout('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body},TURNSTILE_TIMEOUT_MS,fetcher);
    if(!response.ok)return providerFailureForStatus(response.status);
    const result=await readResponseJson(response,TURNSTILE_MAX_RESPONSE_BYTES);
    if(!result.ok||!result.value||typeof result.value!=='object'||typeof (result.value as {success?:unknown}).success!=='boolean')return{ok:false,category:'UNKNOWN',outcome:'CONFIRMED_FAILURE'};
    const payload=result.value as {success:boolean;'error-codes'?:unknown};
    if(!payload.success&&Array.isArray(payload['error-codes'])){
      const codes=payload['error-codes'].slice(0,32).filter((value):value is string=>typeof value==='string');
      if(codes.includes('internal-error'))return{ok:false,category:'PROVIDER_UNAVAILABLE',outcome:'CONFIRMED_FAILURE'};
      if(codes.some(code=>code==='invalid-input-secret'||code==='missing-input-secret'))return{ok:false,category:'AUTH_OR_CONFIG',outcome:'CONFIRMED_FAILURE'};
    }
    return{ok:true,verified:payload.success};
  }catch(error){
    return providerFailureForException(error);
  }
}
