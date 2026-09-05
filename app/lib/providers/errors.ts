export type ProviderErrorCategory=
  |'TIMEOUT'
  |'AUTH_OR_CONFIG'
  |'RATE_LIMIT'
  |'PROVIDER_UNAVAILABLE'
  |'VALIDATION_REJECTED'
  |'UNKNOWN';

export type ProviderFailure={
  ok:false;
  category:ProviderErrorCategory;
  outcome:'NOT_ATTEMPTED'|'CONFIRMED_FAILURE'|'UNKNOWN_OUTCOME';
  status?:number;
};

export type ProviderSuccess={ok:true;providerRequestId?:string};
export type ProviderResult=ProviderSuccess|ProviderFailure;

export function providerFailureForStatus(status:number):ProviderFailure{
  if(status===401||status===403)return{ok:false,category:'AUTH_OR_CONFIG',outcome:'CONFIRMED_FAILURE',status};
  if(status===429)return{ok:false,category:'RATE_LIMIT',outcome:'CONFIRMED_FAILURE',status};
  if(status===409)return{ok:false,category:'UNKNOWN',outcome:'UNKNOWN_OUTCOME',status};
  if(status===400||status===422)return{ok:false,category:'VALIDATION_REJECTED',outcome:'CONFIRMED_FAILURE',status};
  if(status>=500)return{ok:false,category:'PROVIDER_UNAVAILABLE',outcome:'CONFIRMED_FAILURE',status};
  return{ok:false,category:'UNKNOWN',outcome:'CONFIRMED_FAILURE',status};
}

export function providerFailureForException(error:unknown):ProviderFailure{
  if(error instanceof DOMException&&error.name==='AbortError')return{ok:false,category:'TIMEOUT',outcome:'UNKNOWN_OUTCOME'};
  return{ok:false,category:'PROVIDER_UNAVAILABLE',outcome:'UNKNOWN_OUTCOME'};
}
