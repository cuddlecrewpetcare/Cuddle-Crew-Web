import assert from 'node:assert/strict';
import test from 'node:test';
import {
  appErrorCategories,
  createRequestId,
  headersWithRequestId,
  logDiagnostic,
  safeDiagnosticRecord,
} from '../app/lib/observability.ts';

test('structured diagnostics retain only the explicit safe schema',()=>{
  const record=safeDiagnosticRecord('ERROR','provider call failed',{
    operation:'contact notification',
    provider:'resend',
    requestId:'request-id',
    providerRequestId:'provider id\r\nprivate',
    durationMs:12.6,
    category:'PROVIDER_UNAVAILABLE',
    outcome:'UNKNOWN_OUTCOME',
    result:'safe result',
    ...({authorization:'Bearer synthetic-secret',payload:'private contact body'} as Record<string,unknown>),
  },new Date('2026-09-05T00:00:00.000Z'));
  const serialized=JSON.stringify(record);
  assert.deepEqual(Object.keys(record).sort(),['category','durationMs','event','level','operation','outcome','provider','providerRequestId','requestId','result','timestamp']);
  assert.equal(record.event,'provider_call_failed');
  assert.equal(record.providerRequestId,'provider_id__private');
  assert.equal(record.durationMs,13);
  assert.equal(serialized.includes('synthetic-secret'),false);
  assert.equal(serialized.includes('private contact body'),false);
});

test('diagnostic logging supports capture without accepting raw causes or payloads',()=>{
  const captured:Record<string,unknown>[]=[];
  logDiagnostic('WARN','security.rate_limited',{operation:'contact',category:'RATE_LIMIT',result:'rejected'},record=>captured.push(record));
  assert.equal(captured.length,1);
  assert.equal(captured[0].event,'security.rate_limited');
  assert.equal(captured[0].category,'RATE_LIMIT');
  assert.equal('error' in captured[0],false);
  assert.equal('payload' in captured[0],false);
});

test('request correlation IDs are server-generated and response-header safe',()=>{
  const first=createRequestId(),second=createRequestId();
  assert.match(first,/^[0-9a-f-]{36}$/);
  assert.notEqual(first,second);
  const headers=headersWithRequestId(first,{'Cache-Control':'no-store'});
  assert.equal(headers.get('x-request-id'),first);
  assert.equal(headers.get('cache-control'),'no-store');
});

test('app error taxonomy remains intentionally small and stable',()=>{
  assert.deepEqual(appErrorCategories,[
    'INPUT_VALIDATION','SECURITY_REJECTED','CONFIGURATION','PROVIDER','INTERNAL','NOT_FOUND','RATE_LIMIT','DUPLICATE','UNAVAILABLE',
  ]);
});
