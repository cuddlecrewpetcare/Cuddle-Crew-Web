import assert from 'node:assert/strict';
import test from 'node:test';
import {GET as healthCheck} from '../app/api/health/route.ts';

test('health endpoint returns only safe operational fields',async()=>{
  const response=healthCheck();
  const payload=await response.json() as Record<string,unknown>;

  assert.equal(response.status,200);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.deepEqual(Object.keys(payload).sort(),['status','timestamp']);
  assert.equal(payload.status,'ok');
  assert.equal(typeof payload.timestamp,'string');
  assert.equal(Number.isNaN(Date.parse(payload.timestamp as string)),false);
});
