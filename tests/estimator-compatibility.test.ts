import assert from 'node:assert/strict';
import test from 'node:test';
import {calculateEstimate} from '../app/lib/estimate.ts';
import type {EstimateInput,PetType} from '../app/lib/estimate-types.ts';
import {POST} from '../app/api/estimate/route.ts';
import {resetRateLimitsForTests} from '../app/lib/rate-limit.ts';

// core/03 §§3–4; logic/38 §§5,7: dedicated walks cannot absorb other-pet care.
const baseline:EstimateInput={pets:[{type:'dog'}],service:'overnight',start:'2099-01-02',end:'2099-01-03',blocks:[],midday:'walk30',zip:'95821',travelTier:'standard',now:new Date('2026-09-10T12:00:00-07:00')};
const walks=['walk30','walk60','walk90'] as const;
const households:PetType[][]=[['cat'],['rabbit'],['bird'],['fish'],['small'],['dog','cat'],['cat','dog'],['dog','rabbit']];

test('12G-EST-02: every incompatible Overnight walk rejects calculation and preserves its roster',()=>{
 for(const types of households)for(const midday of walks){
  const input={...baseline,pets:types.map(type=>({type})),midday};
  const output=calculateEstimate(input);assert.deepEqual(output,{issues:['walk-household'],result:null});assert.deepEqual(input.pets.map(pet=>pet.type),types);
 }
});

test('12G-EST-02: dog-only Overnight walks retain approved prices and per-service dog modifiers',()=>{
 for(const [midday,total] of [['walk30',117],['walk60',135],['walk90',153]] as const){
  const result=calculateEstimate({...baseline,midday}).result;assert(result);assert.equal(result.total,total);assert.equal(result.reviewRequired,false);
  assert.equal(calculateEstimate({...baseline,midday,pets:[{type:'dog'},{type:'dog'}]}).result?.total,total+20);
 }
});

test('12G-EST-02: effective Planner Drop-In or none supersedes every stale raw walk',()=>{
 for(const midday of walks)for(const [types,base,addOn] of [[['cat'],80,23],[['dog','cat'],90,30]] as const)for(const blocks of [[],[1]]){
  const output=calculateEstimate({...baseline,pets:types.map(type=>({type})),midday,blocks,planner:{reviewRequired:false,incomplete:false,overnightDuration:30}});
  assert.deepEqual(output.issues,[]);assert.equal(output.result?.total,base+(blocks.length?addOn:0));assert.equal(output.result?.reviewRequired,false);
 }
 for(const [overnightDuration,total] of [[60,125],[90,142]] as const)assert.equal(calculateEstimate({...baseline,pets:[{type:'cat'}],blocks:[1],planner:{reviewRequired:false,incomplete:false,overnightDuration}}).result?.total,total);
 // A raw add-on is also inactive after leaving Overnight Care.
 assert.equal(calculateEstimate({...baseline,pets:[{type:'cat'}],service:'drop30',blocks:[0],end:baseline.start}).result?.total,28);
});

test('12G-EST-02: effective coverage does not clear existing opaque or scope review',()=>{
 for(const planner of [{reviewRequired:true,incomplete:false,overnightDuration:30 as const},{reviewRequired:false,incomplete:true,overnightDuration:30 as const}]){
  const result=calculateEstimate({...baseline,pets:[{type:'cat'}],blocks:[1],planner}).result;assert(result);assert.equal(result.reviewRequired,true);assert.equal(result.total,null);assert.equal(result.serviceSubtotal,null);
 }
 const result=calculateEstimate({...baseline,pets:[{type:'fish'}],blocks:[1],planner:{reviewRequired:false,incomplete:false,overnightDuration:30}}).result;assert.equal(result?.reviewRequired,true);assert.equal(result?.total,null);
});

test('12G-EST-02: API rejects incompatible walks and honors effective Planner overrides',async()=>{
 resetRateLimitsForTests();
 const {now,...base}=baseline;void now;
 for(const types of [['cat'],['dog','cat']])for(const midday of walks)for(const planner of [undefined,{reviewRequired:false,incomplete:false},{reviewRequired:false,incomplete:false,overnightDuration:30}]){
  const response=await POST(new Request('https://example.test/api/estimate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...base,pets:types.map(type=>({type})),midday,blocks:[1],planner})}));
  assert.equal(response.status,200);assert.equal(response.headers.get('Cache-Control'),'no-store');const output=await response.json() as {issues:string[];result:{total:number|null}|null};
  if(planner?.overnightDuration){assert.deepEqual(output.issues,[]);assert(output.result);assert.equal(output.result.total,types.length===1?103:120)}else assert.deepEqual(output,{issues:['walk-household'],result:null});
  assert.doesNotMatch(JSON.stringify(output),/reviewReasons|insurance|competence/);
 }
});
