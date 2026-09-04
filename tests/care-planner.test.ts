import assert from 'node:assert/strict';
import test from 'node:test';
import {assessCarePlan,type CarePlannerInput} from '../app/lib/care-planner.ts';

const baseline=(change:Partial<CarePlannerInput>={}):CarePlannerInput=>({
  dogs:1,cats:0,otherPets:0,lifeStage:'adult',feedingFrequency:2,
  bathroomIntervalHours:24,comfortableAloneHours:24,taskCount:2,
  medication:'none',behavior:'none',routineComplexity:'simple',separation:'none',visitFit:'30',
  windowIndexes:[0,2],overnight:false,...change,
});

const cases:{name:string;change:Partial<CarePlannerInput>;duration?:30|60|90|null;suitability?:ReturnType<typeof assessCarePlan>['suitability'];reviewIncludes?:string}[]=[
  {name:'ordinary dog',change:{},duration:30,suitability:'starting-point'},
  {name:'ordinary cat',change:{dogs:0,cats:1,bathroomIntervalHours:24},duration:30,suitability:'starting-point'},
  {name:'mixed household',change:{cats:1,otherPets:1,taskCount:4,routineComplexity:'moderate',visitFit:'60'},duration:60},
  {name:'puppy',change:{lifeStage:'puppy',bathroomIntervalHours:4},suitability:'consultation-required',reviewIncludes:'Very young'},
  {name:'senior',change:{lifeStage:'senior'},suitability:'starting-point'},
  {name:'multiple pets',change:{dogs:3,cats:2},suitability:'consultation-required',reviewIncludes:'larger household'},
  {name:'time-sensitive medication',change:{medication:'timed'},suitability:'consultation-required',reviewIncludes:'Time-sensitive'},
  {name:'30-minute fit',change:{visitFit:'30'},duration:30},
  {name:'60-minute fit',change:{visitFit:'60'},duration:60},
  {name:'90-minute fit',change:{visitFit:'90'},duration:90},
  {name:'cannot-fit routine',change:{visitFit:'neither'},duration:null,suitability:'consultation-required',reviewIncludes:'does not fit'},
  {name:'separation requirements',change:{separation:'handling'},suitability:'consultation-required',reviewIncludes:'separate handling'},
  {name:'aggressive or reactive',change:{behavior:'aggressive'},suitability:'consultation-required',reviewIncludes:'Aggression'},
  {name:'escape risk',change:{behavior:'escape'},suitability:'consultation-required',reviewIncludes:'Escape risk'},
  {name:'ambiguous routine',change:{routineComplexity:'unclear'},suitability:'consultation-required',reviewIncludes:'ambiguous'},
  {name:'procedure scope review',change:{medication:'procedure'},suitability:'consultation-required',reviewIncludes:'requires scope'},
];

for(const scenario of cases)test(scenario.name,()=>{
  const result=assessCarePlan(baseline(scenario.change));
  if(scenario.duration!==undefined)assert.equal(result.durationMinutes,scenario.duration);
  if(scenario.suitability)assert.equal(result.suitability,scenario.suitability);
  if(scenario.reviewIncludes)assert(result.reviewReasons.some(reason=>reason.includes(scenario.reviewIncludes!)));
});

test('actual flexible windows, not visit-count division, determine the longest gap',()=>{
  const result=assessCarePlan(baseline({windowIndexes:[0,2],visitFit:'30'}));
  assert.equal(result.longestPlausibleGapHours,20);
  assert.notEqual(result.longestPlausibleGapHours,12);
});

test('midnight crossing is modeled from the final window to the next local service day',()=>{
  assert.equal(assessCarePlan(baseline({windowIndexes:[0]})).longestPlausibleGapHours,26);
});

test('overnight only and overnight with midday coverage use actual coverage periods',()=>{
  assert.equal(assessCarePlan(baseline({windowIndexes:[],overnight:true})).longestPlausibleGapHours,10);
  assert.equal(assessCarePlan(baseline({windowIndexes:[1],overnight:true})).longestPlausibleGapHours,6.5);
});

test('planner never overrides a stated duration using a hidden workload score',()=>{
  const result=assessCarePlan(baseline({dogs:4,cats:2,taskCount:6,routineComplexity:'complex',visitFit:'30'}));
  assert.equal(result.durationMinutes,30);
  assert.equal(result.suitability,'consultation-required');
});

test('short entered tolerance conservatively controls the gap comparison',()=>{
  const result=assessCarePlan(baseline({comfortableAloneHours:10,bathroomIntervalHours:6}));
  assert.equal(result.gapWithinEnteredLimits,false);
  assert(result.reviewReasons.some(reason=>reason.includes('6-hour care limit')));
});

test('DST and timezone limitations are explicit without collecting travel dates',()=>{
  const result=assessCarePlan(baseline());
  assert.equal(result.timezone,'America/Los_Angeles');
  assert(result.warnings.some(warning=>warning.includes('daylight-saving')));
  assert(result.assumptions.some(assumption=>assumption.includes('repeat each service day')));
});

test('outputs retain consultation and non-booking boundaries',()=>{
  const warnings=assessCarePlan(baseline()).warnings.join(' ');
  for(const boundary of ['diagnose','prescribe','guarantee acceptance','reserve inventory','Final suitability','Feeding frequency'])assert(warnings.includes(boundary));
});
