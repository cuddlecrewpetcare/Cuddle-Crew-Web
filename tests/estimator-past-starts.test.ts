import assert from 'node:assert/strict';
import test from 'node:test';
import {calculateEstimate} from '../app/lib/estimate.ts';
import type {EstimateInput,PublicEstimateResult} from '../app/lib/estimate-types.ts';
import {POST} from '../app/api/estimate/route.ts';
import {resetRateLimitsForTests} from '../app/lib/rate-limit.ts';

const now=new Date('2026-09-08T20:00:00-07:00');
const baseline:EstimateInput={pets:[{type:'dog'}],service:'drop30',start:'2026-09-08',end:'2026-09-08',blocks:[0],midday:'none',zip:'95821',travelTier:'standard',now};
const moneyFields=['total','serviceSubtotal','base','petFee','holidayFee','potentialShortFee','travelFee','addOn'] as const;
const assertUnpriced=(result:PublicEstimateResult|null)=>{assert(result);assert.equal(result.reviewRequired,true);for(const field of moneyFields)assert.equal(result[field],null)};

test('12G-EST-03: passed and partly elapsed daytime starts require unpriced review',()=>{
 for(const blocks of [[0],[1],[2],[3]])assertUnpriced(calculateEstimate({...baseline,blocks}).result);
 assertUnpriced(calculateEstimate({...baseline,blocks:[0,2],now:new Date('2026-09-08T13:00:00-07:00')}).result);
});

test('12G-EST-03: a passed Overnight start and explicit passed Planner coverage require unpriced review',()=>{
 assertUnpriced(calculateEstimate({...baseline,service:'overnight',end:'2026-09-09',blocks:[]}).result);
 const beforeOvernight=new Date('2026-09-08T13:00:00-07:00');
 assertUnpriced(calculateEstimate({...baseline,service:'overnight',end:'2026-09-09',blocks:[0],planner:{reviewRequired:false,incomplete:false,overnightDuration:30},now:beforeOvernight}).result);
 const stale=calculateEstimate({...baseline,service:'overnight',end:'2026-09-09',blocks:[0],now:beforeOvernight}).result;assert(stale);assert.equal(stale.serviceSubtotal,85);assert.equal(stale.potentialShortFee,25);
});

test('12G-EST-03: exact and future starts retain same-day rules while Continuous Care keeps schedule review',()=>{
 const exact=calculateEstimate({...baseline,blocks:[3],now:new Date('2026-09-08T18:00:00-07:00')}).result;assert(exact);assert.equal(exact.serviceSubtotal,30);assert.equal(exact.potentialShortFee,20);assert.equal(exact.total,null);
 assertUnpriced(calculateEstimate({...baseline,blocks:[3],now:new Date('2026-09-08T18:00:00.001-07:00')}).result);
 const future=calculateEstimate({...baseline,start:'2026-09-09',end:'2026-09-09',blocks:[0],now:new Date('2026-09-08T12:00:00-07:00')}).result;assert(future);assert.equal(future.serviceSubtotal,30);assert.equal(future.potentialShortFee,10);
 const crossing=calculateEstimate({...baseline,blocks:[0],now:new Date('2026-09-08T15:59:59.999Z')}).result;assert(crossing);assert.equal(crossing.serviceSubtotal,30);assert.equal(crossing.potentialShortFee,20);
 const continuous=calculateEstimate({...baseline,service:'continuous3',blocks:[0]}).result;assert(continuous);assert.equal(continuous.serviceSubtotal,90);assert.equal(continuous.reviewRequired,true);
});

test('12G-EST-03: the public API returns opaque unpriced review for a passed start',async t=>{
 t.mock.timers.enable({apis:['Date'],now});resetRateLimitsForTests();
 try{
  const {now:_inputNow,...requestInput}=baseline;void _inputNow;
  const response=await POST(new Request('https://example.test/api/estimate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(requestInput)}));
  assert.equal(response.status,200);assert.equal(response.headers.get('Cache-Control'),'no-store');
  const body=await response.json() as {issues:string[];result:PublicEstimateResult|null};assert.deepEqual(body.issues,[]);assertUnpriced(body.result);
  assert.doesNotMatch(JSON.stringify(body),/reviewReasons|passed|threshold|private-calendar/);
 }finally{t.mock.timers.reset();resetRateLimitsForTests()}
});
