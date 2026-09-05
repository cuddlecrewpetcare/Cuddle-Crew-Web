import {fetchWithTimeout} from '../server-security.ts';
import {providerFailureForException,providerFailureForStatus,type ProviderResult} from './errors.ts';

const endpoint='https://api.resend.com/emails';
export const RESEND_TIMEOUT_MS=8_000;

export type ResendMessage={
  from:string;
  to:string[];
  reply_to:string;
  subject:string;
  text:string;
  html:string;
};

type ResendEnvironment={
  [name:string]:string|undefined;
  RESEND_API_KEY?:string;
  RESEND_SEND_ENABLED?:string;
};
type Fetcher=typeof fetch;

export const resendDeliveryConfigured=(environment:ResendEnvironment=process.env)=>
  environment.RESEND_SEND_ENABLED==='true'&&Boolean(environment.RESEND_API_KEY?.trim());

export async function sendResendEmail(
  message:ResendMessage,
  idempotencyKey:string,
  options:{environment?:ResendEnvironment;fetcher?:Fetcher}={},
):Promise<ProviderResult>{
  const environment=options.environment||process.env;
  if(!resendDeliveryConfigured(environment))return{ok:false,category:'AUTH_OR_CONFIG',outcome:'NOT_ATTEMPTED'};
  try{
    const response=await fetchWithTimeout(endpoint,{
      method:'POST',
      headers:{
        Authorization:`Bearer ${environment.RESEND_API_KEY}`,
        'Content-Type':'application/json',
        'User-Agent':'CuddleCrewPetCare/1.0',
        'Idempotency-Key':idempotencyKey,
      },
      body:JSON.stringify(message),
    },RESEND_TIMEOUT_MS,options.fetcher);
    if(!response.ok)return providerFailureForStatus(response.status);
    const requestId=response.headers.get('x-request-id')?.trim();
    return{ok:true,...(requestId?{providerRequestId:requestId.slice(0,128)}:{})};
  }catch(error){
    return providerFailureForException(error);
  }
}
