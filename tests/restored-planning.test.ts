import test from 'node:test';
import assert from 'node:assert/strict';
import {assessCarePlan,type CarePlannerInput} from '../app/lib/care-planner.ts';
import {CARE_PLANNER_PROGRESS_KEY,clearCarePlannerProgress,loadCarePlannerProgress,parseCarePlannerProgress,saveCarePlannerProgress} from '../app/lib/care-planner-progress.ts';
import {PLANNING_KEY,clearPlanningState,loadPlanningState,parseStoredPlanningState,parsePlanningStateQuery,planningStateQuery,resolveEstimatePlanningState,savePlanningLocation,savePlanningState} from '../app/lib/planning-state.ts';
import {calculateEstimate} from '../app/lib/estimate.ts';

const routine:CarePlannerInput={dogs:1,cats:0,otherPets:0,lifeStage:'adult',feedingFrequency:2,bathroomIntervalHours:24,comfortableAloneHours:24,taskCount:2,medication:'none',behavior:'none',routineComplexity:'simple',separation:'none',visitFit:'30',windowIndexes:[0,1,2,3],overnight:false};
const storedRoutine={schemaVersion:2,...routine};
const estimateState={schemaVersion:2,petTypes:['dog'],service:'drop30',blocks:[0],midday:'none',zip:'95821',travelTier:'standard'};
function withStorage(run:(values:Map<string,string>)=>void){const original=Object.getOwnPropertyDescriptor(globalThis,'sessionStorage'),values=new Map<string,string>();Object.defineProperty(globalThis,'sessionStorage',{configurable:true,value:{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key)}});try{run(values)}finally{if(original)Object.defineProperty(globalThis,'sessionStorage',original);else Reflect.deleteProperty(globalThis,'sessionStorage')}}

test('12G-CARE-03: every omitted care answer requires confirmation before restored guidance or handoff',()=>{
 for(const change of [{medication:'timed'},{behavior:'aggressive'},{routineComplexity:'complex'},{separation:'handling'}] as Partial<CarePlannerInput>[]){
  const input={...routine,...change};assert.equal(assessCarePlan(input).suitability,'consultation-required');
  withStorage(values=>{saveCarePlannerProgress(input);const raw=values.get(CARE_PLANNER_PROGRESS_KEY)!;assert.deepEqual(Object.keys(JSON.parse(raw)),['schemaVersion','dogs','cats','otherPets','lifeStage','feedingFrequency','bathroomIntervalHours','comfortableAloneHours','windowIndexes','overnight','visitFit']);const restored=loadCarePlannerProgress();assert.equal(restored.visitFit,'30');assert.equal(restored.requiresConfirmation,true);const result=assessCarePlan({...routine,...restored,answersConfirmed:!restored.requiresConfirmation});assert.equal(result.suitability,'consultation-required');assert.equal(result.durationMinutes,null);});
 }
});

test('12G-CARE-03: fresh and explicitly reconfirmed valid care remain usable without bypassing broad review',()=>{
 assert.equal(parseCarePlannerProgress(null).requiresConfirmation,false);
 assert.equal(assessCarePlan({...routine,answersConfirmed:true}).suitability,'starting-point');
 for(const change of [{dogs:4},{lifeStage:'puppy'},{visitFit:'neither'},{comfortableAloneHours:1}] as Partial<CarePlannerInput>[]){const result=assessCarePlan({...routine,...change,answersConfirmed:true});assert.equal(result.suitability,'consultation-required');}
});

test('12G-CARE-03: invalid, partial, legacy and unknown-schema progress cannot invent valid visit fit',()=>{
 for(const raw of ['', '{bad','null','[]','7',JSON.stringify({}),JSON.stringify({...storedRoutine,schemaVersion:undefined}),JSON.stringify({...storedRoutine,schemaVersion:99}),JSON.stringify({...storedRoutine,dogs:2.5}),JSON.stringify({...storedRoutine,dogs:-1}),JSON.stringify({...storedRoutine,cats:9}),JSON.stringify({...storedRoutine,lifeStage:'unknown'}),JSON.stringify({...storedRoutine,feedingFrequency:0}),JSON.stringify({...storedRoutine,bathroomIntervalHours:'24'}),JSON.stringify({...storedRoutine,comfortableAloneHours:null}),JSON.stringify({...storedRoutine,windowIndexes:[1,'3']}),JSON.stringify({...storedRoutine,windowIndexes:null}),JSON.stringify({...storedRoutine,overnight:'false'}),JSON.stringify({...storedRoutine,visitFit:'15'})]){const state=parseCarePlannerProgress(raw);assert.equal(state.requiresConfirmation,true,raw);assert.equal(state.visitFit,'unknown',raw);assert.equal(assessCarePlan({...routine,...state,answersConfirmed:false}).durationMinutes,null);}
 const valid=parseCarePlannerProgress(JSON.stringify({...storedRoutine,windowIndexes:[],overnight:true}));assert.deepEqual(valid.windowIndexes,[]);assert.equal(valid.visitFit,'30');
});

test('12G-STATE-01: current estimate saves neutral review only and restores without automatic pricing',()=>{
 withStorage(values=>{savePlanningState({...estimateState,petTypes:['dog'],service:'drop30',midday:'none',travelTier:'standard',reviewRequired:true});const raw=values.get(PLANNING_KEY)!;assert.equal(JSON.parse(raw).reviewRequired,true);assert.doesNotMatch(raw,/complex|behavior|medication|detail|reason|2099/);const state=loadPlanningState();assert.equal(state.requiresConfirmation,true);assert.equal(state.reviewRequired,true);const query=planningStateQuery(state);assert.equal(parsePlanningStateQuery(query).planner?.reviewRequired,true);assert.doesNotMatch(query,/complex|behavior|medication|detail|reason/);const result=calculateEstimate({pets:state.petTypes.map(type=>({type,complex:false})),service:state.service!,blocks:state.blocks,midday:state.midday!,zip:state.zip!,travelTier:state.travelTier,planner:{...state.planner,reviewRequired:state.reviewRequired!,incomplete:false},start:'2099-01-02',end:'2099-01-02',now:new Date('2026-01-01T00:00:00Z')}).result;assert.equal(result?.reviewRequired,true);assert.equal(result.total,null);assert.equal(result.serviceSubtotal,null);savePlanningLocation({zip:'95821',travelTier:'standard'});assert.equal(loadPlanningState().reviewRequired,true);assert.equal(loadPlanningState().requiresConfirmation,true);});
 const valid=parseStoredPlanningState(JSON.stringify(estimateState));assert.equal(valid.requiresConfirmation,true);assert.equal(valid.planner,undefined);assert.deepEqual(valid.petTypes,['dog']);
});

test('12G-STATE-01: malformed and stale estimator payloads stay incomplete including invalid stored coverage',()=>{
 for(const raw of ['', '{bad','null','[]','42',JSON.stringify({}),JSON.stringify({...estimateState,schemaVersion:undefined}),JSON.stringify({...estimateState,schemaVersion:1}),JSON.stringify({...estimateState,schemaVersion:99}),JSON.stringify({...estimateState,petTypes:['dog','invalid']}),JSON.stringify({...estimateState,petTypes:[]}),JSON.stringify({...estimateState,petTypes:Array(9).fill('dog')}),JSON.stringify({...estimateState,service:'boarding'}),JSON.stringify({...estimateState,midday:'invalid'}),JSON.stringify({...estimateState,reviewRequired:'false'})]){const state=parseStoredPlanningState(raw);assert.equal(state.requiresConfirmation,true,raw);assert.equal(state.planner?.incomplete,true,raw);assert.equal(state.planner?.reviewRequired,true,raw);}
 for(const blocks of [[1,'3'],['3'],null,undefined]){const state=parseStoredPlanningState(JSON.stringify({...estimateState,service:'overnight',blocks,planner:{reviewRequired:false,incomplete:false,overnightDuration:30}}));assert.equal(state.planner?.incomplete,true);assert.equal(state.planner.reviewRequired,true);}
 const empty=parseStoredPlanningState(JSON.stringify({...estimateState,service:'overnight',blocks:[],planner:{reviewRequired:false,incomplete:false,overnightDuration:30}}));assert.equal(empty.planner?.incomplete,false);assert.deepEqual(empty.blocks,[]);
});

test('restoration clear/reset and fresh location-only state retain existing session boundaries',()=>{
 withStorage(values=>{savePlanningLocation({zip:'95821',travelTier:'standard'});const location=loadPlanningState();assert.equal(location.requiresConfirmation,undefined);assert.equal(location.planner,undefined);assert.deepEqual(location.petTypes,[]);saveCarePlannerProgress(routine);clearCarePlannerProgress();assert.equal(values.has(CARE_PLANNER_PROGRESS_KEY),false);assert.equal(loadCarePlannerProgress().requiresConfirmation,false);clearPlanningState();assert.equal(values.has(PLANNING_KEY),false);assert.equal(loadPlanningState().requiresConfirmation,undefined);});
 const query=resolveEstimatePlanningState('?petTypes=dog&service=drop30&windows=1',parseStoredPlanningState(null));assert.equal(query.requiresConfirmation,true);
});
