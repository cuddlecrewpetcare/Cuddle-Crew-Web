import type {ProviderFailure} from './providers/errors.ts';

export const appErrorCategories=[
  'INPUT_VALIDATION',
  'SECURITY_REJECTED',
  'CONFIGURATION',
  'PROVIDER',
  'INTERNAL',
  'NOT_FOUND',
  'RATE_LIMIT',
  'DUPLICATE',
  'UNAVAILABLE',
] as const;

export type AppErrorCategory=typeof appErrorCategories[number];
export type LogLevel='DEBUG'|'INFO'|'WARN'|'ERROR';
export type DiagnosticFields={
  operation?:string;
  provider?:string;
  status?:number;
  requestId?:string;
  providerRequestId?:string;
  durationMs?:number;
  category?:AppErrorCategory|ProviderFailure['category'];
  outcome?:ProviderFailure['outcome'];
  result?:string;
};

type DiagnosticRecord=DiagnosticFields&{timestamp:string;level:LogLevel;event:string};
type DiagnosticSink=(record:DiagnosticRecord)=>void;

const safeToken=(value:string,max=128)=>value.replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,max);
const finiteInteger=(value:number)=>Math.max(0,Math.round(value));

export function safeDiagnosticRecord(level:LogLevel,event:string,fields:DiagnosticFields={},now=new Date()):DiagnosticRecord{
  const record:DiagnosticRecord={timestamp:now.toISOString(),level,event:safeToken(event,80)||'diagnostic.invalid_event'};
  if(fields.operation)record.operation=safeToken(fields.operation,80);
  if(fields.provider)record.provider=safeToken(fields.provider,80);
  if(Number.isFinite(fields.status))record.status=finiteInteger(fields.status!);
  if(fields.requestId)record.requestId=safeToken(fields.requestId);
  if(fields.providerRequestId)record.providerRequestId=safeToken(fields.providerRequestId);
  if(Number.isFinite(fields.durationMs))record.durationMs=finiteInteger(fields.durationMs!);
  if(fields.category)record.category=fields.category;
  if(fields.outcome)record.outcome=fields.outcome;
  if(fields.result)record.result=safeToken(fields.result,80);
  return record;
}

const consoleSink:DiagnosticSink=record=>{
  const method=record.level==='ERROR'?'error':record.level==='WARN'?'warn':record.level==='INFO'?'info':'debug';
  console[method](JSON.stringify(record));
};

export function logDiagnostic(level:LogLevel,event:string,fields:DiagnosticFields={},sink:DiagnosticSink=consoleSink){
  if(level==='DEBUG'&&process.env.NODE_ENV!=='development'&&sink===consoleSink)return;
  sink(safeDiagnosticRecord(level,event,fields));
}

export const createRequestId=()=>crypto.randomUUID();

export function headersWithRequestId(requestId:string,headers?:HeadersInit){
  const result=new Headers(headers);
  result.set('X-Request-ID',requestId);
  return result;
}

export function jsonWithRequestId(body:unknown,requestId:string,init:ResponseInit={}){
  return Response.json(body,{...init,headers:headersWithRequestId(requestId,init.headers)});
}

export function logProviderFailure(provider:string,operation:string,requestId:string,failure:ProviderFailure,durationMs:number){
  logDiagnostic('ERROR','provider.call_failed',{
    provider,operation,requestId,durationMs,category:failure.category,outcome:failure.outcome,...(failure.status?{status:failure.status}:{}),
  });
}
