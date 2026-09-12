import assert from 'node:assert/strict';
import test from 'node:test';
import {calculateEstimate} from '../app/lib/estimate.ts';
import type {EstimateInput,PublicEstimateResult} from '../app/lib/estimate-types.ts';
import {POST} from '../app/api/estimate/route.ts';
import {resetRateLimitsForTests} from '../app/lib/rate-limit.ts';

const base:EstimateInput={pets:[{type:'rabbit'}],service:'overnight',start:'2099-01-02',end:'2099-01-03',blocks:[],midday:'none',zip:'95821',travelTier:'standard',now:new Date('2026-09-12T12:00:00-07:00')};
const money=['total','serviceSubtotal','base','petFee','holidayFee','potentialShortFee','travelFee','addOn'] as const;
const unpriced=(result:PublicEstimateResult|null)=>{assert(result);assert.equal(result.reviewRequired,true);for(const key of money)assert.equal(result[key],null)};

test('12G-BUS-01: one or two rabbit-only Overnights remain unpriced',()=>{
 for(const count of [1,2])unpriced(calculateEstimate({...base,pets:Array.from({length:count},()=>({type:'rabbit' as const}))}).result);
});

test('12G-BUS-01: approved Overnight and rabbit daytime anchors remain unchanged',()=>{
 assert.equal(calculateEstimate({...base,pets:[{type:'dog'}]}).result?.total,85);
 assert.equal(calculateEstimate({...base,pets:[{type:'cat'}]}).result?.total,80);
 for(const [service,total] of [['drop30',28],['drop60',45],['drop90',62]] as const)assert.equal(calculateEstimate({...base,service,end:base.start,blocks:[0]}).result?.total,total);
});

test('12G-BUS-01: the public API returns no numeric fallback or private reason',async()=>{
 resetRateLimitsForTests();const {now,...request}=base;void now;
 try{for(const count of [1,2]){
  const response=await POST(new Request('https://example.test/api/estimate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...request,pets:Array.from({length:count},()=>({type:'rabbit'}))})}));
  assert.equal(response.status,200);assert.equal(response.headers.get('Cache-Control'),'no-store');const body=await response.json() as {issues:string[];result:PublicEstimateResult|null};assert.deepEqual(body.issues,[]);unpriced(body.result);assert.doesNotMatch(JSON.stringify(body),/reviewReasons|benchmark|small-animal-overnight/);
 }}finally{resetRateLimitsForTests()}
});
