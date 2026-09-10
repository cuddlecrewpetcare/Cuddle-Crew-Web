import test from 'node:test';
import assert from 'node:assert/strict';
import {assessCarePlan,type CarePlannerInput} from '../app/lib/care-planner.ts';
import {calculateEstimate} from '../app/lib/estimate.ts';
import type {EstimateInput,PublicEstimateResult} from '../app/lib/estimate-types.ts';
import {normalizePlannerCount,parsePlannerPrefill,plannerCoverageText,plannerPrefillQuery,sanitizePlannerContext} from '../app/lib/planner-prefill.ts';
import {parseStoredPlanningState,parsePlanningStateQuery,planningStateQuery,resolveEstimatePlanningState,sanitizePlanningState} from '../app/lib/planning-state.ts';
import {POST} from '../app/api/estimate/route.ts';
import {resetRateLimitsForTests} from '../app/lib/rate-limit.ts';

const routine:CarePlannerInput={dogs:1,cats:0,otherPets:0,lifeStage:'adult',feedingFrequency:2,bathroomIntervalHours:24,comfortableAloneHours:24,taskCount:2,medication:'none',behavior:'none',routineComplexity:'simple',separation:'none',visitFit:'30',windowIndexes:[1],overnight:false};
const handoff=(change:Partial<CarePlannerInput>={})=>{const input={...routine,...change},assessment=assessCarePlan(input);assert(assessment.durationMinutes);const query=plannerPrefillQuery({...input,duration:assessment.durationMinutes,blocks:input.windowIndexes,reviewRequired:assessment.suitability==='consultation-required'});const parsed=parsePlannerPrefill(`?${query}`);assert(parsed);return{query,parsed,assessment}};
const estimate=(change:Partial<CarePlannerInput>={},override:Partial<EstimateInput>={})=>{const value=handoff(change).parsed;return calculateEstimate({pets:value.types.map(type=>({type})),service:value.service,blocks:value.blocks,midday:value.midday,planner:value.planner,start:'2099-01-02',end:value.overnight?'2099-01-03':'2099-01-02',zip:'95821',travelTier:'standard',now:new Date('2026-01-01T00:00:00Z'),...override})};

test('12G-CARE-02: consultation handoff preserves only opaque review and suppresses automatic money',()=>{
 const change:Partial<CarePlannerInput>={medication:'complex',behavior:'aggressive',comfortableAloneHours:2,bathroomIntervalHours:2,windowIndexes:[0,2]};
 const {query,parsed,assessment}=handoff(change);assert.equal(assessment.suitability,'consultation-required');assert.equal(parsed.planner.reviewRequired,true);
 assert.deepEqual([...new URLSearchParams(query).keys()],['planner','dogs','cats','otherPets','duration','windows','overnight','review']);
 assert.doesNotMatch(query,/complex|aggress|medication|behavior|limit|reason/);
 const result=estimate(change).result;assert(result);assert.equal(result.reviewRequired,true);assert.equal(result.total,null);for(const key of ['serviceSubtotal','base','petFee','holidayFee','potentialShortFee','travelFee','addOn'] as const)assert.equal(result[key],null);
 const restored=resolveEstimatePlanningState(`?${query}`,sanitizePlanningState({zip:'95821',travelTier:'standard'}));const session=parseStoredPlanningState(JSON.stringify(restored));assert.equal(session.planner?.reviewRequired,true);assert.deepEqual(session.blocks,[0,2]);assert.doesNotMatch(JSON.stringify(session),/complex|aggress|medication|behavior|reason/);
 assert.deepEqual(parsePlanningStateQuery(`?${planningStateQuery(session)}`).planner,session.planner);for(const zip of ['95821','95660']){const located=resolveEstimatePlanningState(`?zip=${zip}`,session);assert.equal(located.planner?.reviewRequired,true);assert.deepEqual(located.petTypes,['dog']);assert.deepEqual(located.blocks,[0,2]);assert.equal(located.travelTier,zip==='95821'?'standard':undefined)}
});

test('12G-XF-01: one separate midday arrival remains Standard Overnight plus selected care',()=>{
 for(const [visitFit,total] of [['30',110],['60',133],['90',151]] as const){const {parsed}=handoff({overnight:true,visitFit});assert.equal(parsed.service,'overnight');assert.deepEqual(parsed.blocks,[1]);assert.equal(parsed.midday,`drop${visitFit}`);const result=estimate({overnight:true,visitFit}).result;assert(result);assert.equal(result.total,total);assert.equal(result.base,85);assert.equal(result.addOnUnits,1)}
 const mixed=estimate({overnight:true,dogs:2,cats:1}).result;assert(mixed);assert.equal(mixed.total,140);assert.equal(mixed.petFee,15);assert.equal(mixed.addOnUnits,1);
});

test('12G-XF-01: multiple and potentially overlapping coverage remains selected and noncalculable',()=>{
 for(const windowIndexes of [[0,1],[2],[3],[1,3]]){const {parsed}=handoff({overnight:true,windowIndexes});const result=estimate({overnight:true,windowIndexes}).result;assert(result);assert.equal(parsed.service,'overnight');assert.deepEqual(parsed.blocks,windowIndexes);assert.equal(result.reviewRequired,true);assert.equal(result.total,null);assert.equal(result.serviceSubtotal,null);assert.equal(result.base,null);assert.equal(result.addOn,null);const restored=parseStoredPlanningState(JSON.stringify(resolveEstimatePlanningState(`?${handoff({overnight:true,windowIndexes}).query}`,sanitizePlanningState({}))));assert.deepEqual(restored.blocks,windowIndexes);assert.equal(restored.planner?.overnightDuration,30);assert.match(plannerCoverageText(restored.blocks,restored.planner)||'',/Separate 30-minute daytime care/)}
});

test('12G-XF-02: exact known composition survives handoff with no manufactured dog or species',()=>{
 const mixed=handoff({dogs:2,cats:1});assert.deepEqual(mixed.parsed.types,['dog','dog','cat']);const priced=estimate({dogs:2,cats:1,windowIndexes:[0,2]}).result;assert(priced);assert.equal(priced.total,90);assert.equal(priced.base!+priced.petFee!,45);
 const broadOther=handoff({dogs:0,cats:1,otherPets:1});assert.deepEqual(broadOther.parsed.types,['cat','small']);const result=estimate({dogs:0,cats:1,otherPets:1,windowIndexes:[0,2]}).result;assert(result);for(const field of ['serviceSubtotal','base','petFee','holidayFee','potentialShortFee','travelFee','addOn'] as const)assert.equal(result[field],null);assert.equal(broadOther.parsed.planner.reviewRequired,true);assert.equal(result.reviewRequired,true);assert.equal(result.total,null);
 const large=handoff({dogs:8,cats:8,otherPets:8});assert.deepEqual(large.parsed.planner.counts,[8,8,8]);assert.equal(large.parsed.planner.petCount,24);assert.deepEqual(large.parsed.types,[]);assert.equal(large.parsed.planner.incomplete,true);
});

test('12G-XF-03: new empty selections override old add-on/windows/service but preserve unrelated location',()=>{
 const saved=sanitizePlanningState({petTypes:['dog'],service:'overnight',blocks:[0,2],midday:'walk90',zip:'95821',travelTier:'standard',planner:{reviewRequired:true,incomplete:false}});
 const {query}=handoff({overnight:true,windowIndexes:[]});const state=resolveEstimatePlanningState(`?${query}`,saved);assert.equal(state.service,'overnight');assert.equal(state.midday,'none');assert.deepEqual(state.blocks,[]);assert.equal(state.planner?.reviewRequired,false);assert.equal(state.zip,'95821');assert.equal(state.travelTier,'standard');assert.equal(estimate({overnight:true,windowIndexes:[]},{midday:'walk90'}).result?.total,85);
 const daytime=resolveEstimatePlanningState(`?${handoff({windowIndexes:[]}).query}`,saved);assert.equal(daytime.service,'drop30');assert.deepEqual(daytime.blocks,[]);assert.equal(daytime.midday,'none');assert.equal(daytime.planner?.reviewRequired,true);
 const differentZip=resolveEstimatePlanningState(`?${query}&zip=95660`,saved);assert.equal(differentZip.zip,'95660');assert.equal(differentZip.travelTier,undefined);
});

test('ambiguous legacy, malformed counts and incomplete new handoffs never restore a fabricated roster',()=>{
 const saved=sanitizePlanningState({petTypes:['dog','cat'],blocks:[0],midday:'walk90',zip:'95821'});
 for(const query of ['planner=1&pets=3&household=Dogs+and+cats&duration=30','planner=1&pets=2&household=Mixed-pet+household&duration=30','planner=1&pets=4&household=Unknown','planner=1&pets=2.5&household=Dog&duration=30','planner=2&dogs=2.5&cats=0&otherPets=0&duration=30&windows=1&overnight=0&review=0','planner=99']){const state=resolveEstimatePlanningState(`?${query}`,saved);assert.deepEqual(state.petTypes,[]);assert.equal(state.planner?.incomplete,true);assert.equal(state.planner?.reviewRequired,true);const restored=resolveEstimatePlanningState('',parseStoredPlanningState(JSON.stringify(state)));assert.deepEqual(restored.petTypes,[]);assert.equal(restored.planner?.incomplete,true)}
 const invalidReview=resolveEstimatePlanningState('?planner=2&dogs=1&cats=0&otherPets=0&duration=30&windows=1&overnight=0',saved);assert.equal(invalidReview.planner?.reviewRequired,true);assert.equal(invalidReview.planner?.incomplete,true);
 assert.equal(normalizePlannerCount(2.5),2);assert.equal(normalizePlannerCount(Infinity),0);assert.deepEqual(sanitizePlannerContext({reviewRequired:'false',incomplete:false,reason:'private'}),{reviewRequired:true,incomplete:true});
});

test('estimate API preserves opaque review, strips private reasons, and owns explicit Overnight coverage',async()=>{
 resetRateLimitsForTests();
 const request=async(change:Record<string,unknown>)=>{const response=await POST(new Request('https://example.test/api/estimate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({pets:[{type:'dog'}],service:'drop30',start:'2099-01-02',end:'2099-01-02',blocks:[0,2],midday:'none',zip:'95821',travelTier:'standard',...change})}));return{response,body:await response.json() as {result:PublicEstimateResult}}};
 const reviewed=await request({planner:{reviewRequired:true,incomplete:false}});assert.equal(reviewed.response.status,200);assert.equal(reviewed.response.headers.get('Cache-Control'),'no-store');assert.equal(reviewed.body.result.reviewRequired,true);assert.equal(reviewed.body.result.total,null);assert.equal(reviewed.body.result.serviceSubtotal,null);assert.equal('reviewReasons' in reviewed.body.result,false);assert.doesNotMatch(JSON.stringify(reviewed.body),/planner|medication|behavior|reason/);
 for(const blocks of [[1],[],[0,1],[3]]){const output=await request({service:'overnight',end:'2099-01-03',blocks,midday:'walk90',planner:{reviewRequired:false,incomplete:false,overnightDuration:30}});assert.equal(output.response.status,200);assert.equal(output.body.result.total,blocks.length===0?85:blocks.length===1&&blocks[0]===1?110:null);if(blocks.length>1||blocks[0]===3)assert.equal(output.body.result.serviceSubtotal,null)}
 assert.equal((await request({planner:{reviewRequired:true,incomplete:false,reason:'private synthetic note'}})).response.status,400);
 assert.equal((await request({planner:{reviewRequired:'false',incomplete:false}})).body.result.reviewRequired,true);
 assert.equal((await request({pets:[],planner:{reviewRequired:true,incomplete:true}})).response.status,400);
});
