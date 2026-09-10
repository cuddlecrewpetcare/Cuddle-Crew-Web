import assert from 'node:assert/strict';
import test from 'node:test';
import {calculateEstimate} from '../app/lib/estimate.ts';
import {assessCarePlan,type CarePlannerInput} from '../app/lib/care-planner.ts';
import type {EstimateInput,PublicEstimateResult,PetType} from '../app/lib/estimate-types.ts';
import {POST} from '../app/api/estimate/route.ts';
import {resetRateLimitsForTests} from '../app/lib/rate-limit.ts';

const moneyFields=['total','serviceSubtotal','base','petFee','holidayFee','potentialShortFee','travelFee','addOn'] as const;
const baseline:EstimateInput={pets:[{type:'dog'}],service:'drop30',start:'2099-01-02',end:'2099-01-02',blocks:[0],midday:'none',zip:'95821',travelTier:'standard',now:new Date('2026-09-10T12:00:00-07:00')};
function assertReview(result:PublicEstimateResult|null){assert(result);assert.equal(result.reviewRequired,true);for(const field of moneyFields)assert.equal(result[field],null,field)}

for(const type of ['bird','fish','small'] as PetType[])test(`12G-BUS-02: ${type} scope stops every monetary component for solo and mixed services`,()=>{
 for(const pets of [[{type}],[{type:'cat' as const},{type}]])for(const service of ['drop30','drop60','drop90','overnight','continuous3','continuous24'] as const){
  const output=calculateEstimate({...baseline,pets,service,end:service==='overnight'||service==='continuous24'?'2099-01-03':baseline.end,midday:service==='overnight'?'drop30':'none',planner:{reviewRequired:false,incomplete:false}});
  assert.deepEqual(output.issues,[]);assertReview(output.result);
 }
 // Scope must also stop independently calculable holiday, travel and short-notice modifiers.
 assertReview(calculateEstimate({...baseline,pets:[{type}],start:'2026-12-24',end:'2026-12-24',travelTier:'extended',now:new Date('2026-12-24T08:00:00-08:00')}).result);
 for(const service of ['walk30','walk60','walk90'] as const){const output=calculateEstimate({...baseline,pets:[{type}],service});assert.deepEqual(output.issues,['walk-household']);assert.equal(output.result,null)}
});

test('12G-BUS-02: known dog, cat and rabbit daytime anchors remain available in either order',()=>{
 for(const [types,total] of [[['dog'],30],[['cat'],28],[['rabbit'],28],[['cat','rabbit'],33],[['rabbit','cat'],33],[['dog','dog','cat'],45]] as const){
  const result=calculateEstimate({...baseline,pets:types.map(type=>({type}))}).result;assert(result);assert.equal(result.total,total);assert.equal(result.reviewRequired,false);
 }
 for(const [service,total] of [['drop60',45],['drop90',62]] as const)assert.equal(calculateEstimate({...baseline,pets:[{type:'rabbit'}],service}).result?.total,total);
});

test('12G-BUS-02: ambiguous Planner Other needs neutral review without changing entered counts or duration',()=>{
 const routine:CarePlannerInput={dogs:0,cats:0,otherPets:1,lifeStage:'adult',feedingFrequency:2,bathroomIntervalHours:24,comfortableAloneHours:24,taskCount:2,medication:'none',behavior:'none',routineComplexity:'simple',separation:'none',visitFit:'30',windowIndexes:[0,2],overnight:false};
 for(const cats of [0,1]){const result=assessCarePlan({...routine,cats});assert.equal(result.suitability,'consultation-required');assert.equal(result.durationMinutes,30);assert.deepEqual(result.reviewReasons,['Personalized review required.']);assert.doesNotMatch(JSON.stringify(result),/other accepted|unusual-species|competence|insurance/);assert(result.factors.some(factor=>factor.includes(`${cats} cat`)&&factor.includes('1 other pet')))}
});

test('12G-BUS-02: direct API enforces species review despite benign client review flags',async()=>{
 resetRateLimitsForTests();
 for(const type of ['bird','fish','small'])for(const types of [[type],['cat',type]]){
  const {now,...body}=baseline;void now;
  const response=await POST(new Request('https://example.test/api/estimate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...body,pets:types.map(type=>({type})),planner:{reviewRequired:false,incomplete:false}})}));
  assert.equal(response.status,200);assert.equal(response.headers.get('Cache-Control'),'no-store');const output=await response.json() as {issues:string[];result:PublicEstimateResult};assert.deepEqual(output.issues,[]);assertReview(output.result);assert.doesNotMatch(JSON.stringify(output),/reviewReasons|unusual-species|competence|insurance|planner/);
 }
});
