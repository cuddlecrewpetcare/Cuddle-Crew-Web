import test from 'node:test';import assert from 'node:assert/strict';
import {applyAvailabilityOverrides,businessDate,businessYear,daysBetween,easterDate,estimatorCarePlanGap,holidayForDate,plannerCareGap,possibleGapRange,shortNoticeKind,zoneForDriveSeconds,zoneForZip} from '../app/lib/business-rules.ts';
import {calculateEstimate} from '../app/lib/estimate.ts';import type {EstimateInput,EstimatePet} from '../app/lib/estimate.ts';
import {parsePlannerPrefill} from '../app/lib/planner-prefill.ts';
import {turnstileMode} from '../app/lib/turnstile-config.ts';

const pets=(...types:EstimatePet['type'][]):EstimatePet[]=>types.map(type=>({type}));
const input=(change:Partial<EstimateInput>={}):EstimateInput=>({pets:pets('dog'),service:'drop30',start:'2026-09-10',end:'2026-09-10',blocks:[0],midday:'none',zip:'95821',now:new Date('2026-01-01T12:00:00'),...change});
const total=(change:Partial<EstimateInput>={})=>{const value=calculateEstimate(input(change));assert.deepEqual(value.issues,[]);assert(value.result);return value.result;};

test('ZIP lookup distinguishes all travel states',()=>{assert.equal(zoneForZip('').state,'incomplete');for(const zip of ['95821','95610','95660','95630'])assert.equal(zoneForZip(zip).state,'listed');assert.equal(zoneForZip('99999').state,'outside');});
test('overnight checkout is exclusive',()=>assert.deepEqual(daysBetween('2026-12-22','2026-12-26',true),['2026-12-22','2026-12-23','2026-12-24','2026-12-25']));
test('holiday calendar includes calculated and fixed dates',()=>{assert.equal(easterDate(2027),'2027-03-28');assert.equal(holidayForDate('2026-11-26'),'Thanksgiving');assert.equal(holidayForDate('2026-12-25'),'Christmas Day');});

test('possible gap range models one flexible service window',()=>{assert.deepEqual(possibleGapRange([0],30),{minimum:21,maximum:26,overnightMaximum:26});assert.deepEqual(possibleGapRange([0],60),{minimum:21,maximum:25,overnightMaximum:25});});
test('possible gap range models multiple windows and day wrap',()=>{assert.deepEqual(possibleGapRange([0,2],30),{minimum:15,maximum:20,overnightMaximum:20});assert.deepEqual(possibleGapRange([0,2],60),{minimum:15,maximum:19,overnightMaximum:19});});
test('possible gap range models overnight care',()=>{assert.deepEqual(possibleGapRange([],30,true),{minimum:10,maximum:10,overnightMaximum:10});assert.deepEqual(possibleGapRange([0],30,true),{minimum:6,maximum:8.5,overnightMaximum:3.5});});
test('possible gap range returns null for empty schedule',()=>assert.equal(possibleGapRange([],30,false),null));
test('estimator overnight ignores hidden daytime window state',()=>assert.deepEqual(estimatorCarePlanGap([0,2],30,true),possibleGapRange([],30,true)));
test('planner overnight includes intentionally selected daytime windows',()=>assert.deepEqual(plannerCareGap([0,2],30,true),possibleGapRange([0,2],30,true)));
test('plain overnight still models the overnight period',()=>assert.deepEqual(plannerCareGap([],30,true),possibleGapRange([],30,true)));
test('business date and year follow Sacramento around New Year',()=>{const instant=new Date('2027-01-01T06:30:00Z');assert.equal(businessDate(instant),'2026-12-31');assert.equal(businessYear(instant),2026)});

test('short notice uses under-48 excluding separate same-day tier',()=>{const now=new Date('2026-08-29T11:00:00');assert.equal(shortNoticeKind('2026-08-29',15,now),'same-day');assert.equal(shortNoticeKind('2026-08-30',9,now),'under-48');assert.equal(shortNoticeKind('2026-09-02',9,now),'standard');assert.equal(shortNoticeKind('2026-08-28',9,now),'past');});

test('authoritative species-aware drop-in and dog-walk rates',()=>{
 assert.equal(total().total,30); // A
 assert.equal(total({service:'drop60',zip:'95610'}).total,48); // B
 assert.equal(total({pets:pets('cat')}).total,28); // C
 assert.equal(total({service:'drop60',pets:pets('cat'),zip:'95610'}).total,45); // D
 assert.equal(total({pets:pets('small')}).total,28); // E
 assert.equal(total({service:'walk30'}).total,32); // F
 assert.equal(total({service:'walk60'}).total,50); // G
});
test('overnight rates and separately booked midday visits follow household composition',()=>{
 assert.equal(total({service:'overnight',end:'2026-09-11'}).total,85); // H
 assert.equal(total({service:'overnight',end:'2026-09-11',pets:pets('cat')}).total,80); // I
 assert.equal(total({service:'overnight',end:'2026-09-11',midday:'30'}).total,110); // J
 assert.equal(total({service:'overnight',end:'2026-09-11',midday:'30',pets:pets('cat')}).total,103); // K
 assert.equal(total({service:'overnight',end:'2026-09-11',pets:pets('dog','cat')}).total,90);
});
test('additional-pet modifiers apply only after the household base pet',()=>{
 assert.equal(total({pets:pets('dog','dog')}).total,40); // L
 assert.equal(total({pets:pets('cat','cat')}).total,33); // M
 assert.equal(total({pets:pets('dog','cat')}).total,35);
 assert.equal(total({pets:pets('cat','small','small')}).total,38);
});
test('travel fees use drive-time bands with ZIPs as preliminary mappings',()=>{
 assert.equal(total({zip:'95821'}).total,30);
 assert.equal(total({zip:'95610'}).total,30);
 assert.equal(total({zip:'95660'}).total,40); // N
 assert.equal(total({zip:'95630'}).total,50); // O
 const outside=total({zip:'99999'});assert.equal(outside.total,null);assert.equal(outside.manualReview,true);assert(outside.manualReviewReasons.includes('beyond-travel-area')); // P
 assert.equal(zoneForDriveSeconds(600).key,'core');
 assert.equal(zoneForDriveSeconds(601).key,'standard');
 assert.equal(zoneForDriveSeconds(1200).key,'standard');
 assert.equal(zoneForDriveSeconds(1201).key,'extended');
 assert.equal(zoneForDriveSeconds(1800).key,'extended');
 assert.equal(zoneForDriveSeconds(1801).key,'farExtended');
 assert.equal(zoneForDriveSeconds(2700).key,'farExtended');
 assert.equal(zoneForDriveSeconds(2701).state,'outside');
});
test('manual-review combinations do not present an automatic total',()=>{
 const smallOvernight=total({service:'overnight',end:'2026-09-11',pets:pets('small')});assert.equal(smallOvernight.total,null);assert(smallOvernight.manualReviewReasons.includes('small-animal-overnight')); // Q
 const complex=total({pets:[{type:'dog',complex:true}]});assert.equal(complex.total,null);assert(complex.manualReviewReasons.includes('complex-care')); // R
 const extendedOvernight=total({service:'overnight',end:'2026-09-11',zip:'95660'});assert.equal(extendedOvernight.total,null);assert(extendedOvernight.manualReviewReasons.includes('extended-area-overnight'));
});
test('holiday pricing supports daytime, overnight, and multiple dates',()=>{assert.equal(total({start:'2026-12-24',end:'2026-12-24'}).total,45);assert.equal(total({service:'overnight',start:'2026-12-24',end:'2026-12-25'}).total,115);assert.equal(total({start:'2026-12-24',end:'2026-12-25'}).total,90);assert.equal(total().holidayFee,0);});
test('invalid estimate states are explicit',()=>{assert.deepEqual(calculateEstimate(input({start:''})).issues,['dates']);assert.deepEqual(calculateEstimate(input({end:'2026-09-09'})).issues,['dates']);assert.deepEqual(calculateEstimate(input({zip:''})).issues,['zip']);assert.deepEqual(calculateEstimate(input({blocks:[]})).issues,['windows']);assert.deepEqual(calculateEstimate(input({service:'walk30',pets:pets('cat')})).issues,['walk-household']);});
test('past dates are rejected in the business timezone while today and future remain valid',()=>{const now=new Date('2026-08-29T19:00:00Z');assert.deepEqual(calculateEstimate(input({start:'2026-08-28',end:'2026-08-28',now})).issues,['past-date']);assert.deepEqual(calculateEstimate(input({start:'2026-08-29',end:'2026-08-29',now})).issues,[]);assert.deepEqual(calculateEstimate(input({start:'2026-08-30',end:'2026-08-30',now})).issues,[])});
test('less-than-48-hour pricing uses the authoritative visit fee including same day',()=>{assert.equal(total({start:'2026-08-30',end:'2026-08-30',now:new Date('2026-08-29T11:00:00')}).shortFee,10);assert.equal(total({start:'2026-08-29',end:'2026-08-29',blocks:[2],now:new Date('2026-08-29T11:00:00')}).shortFee,10);});

test('availability overrides only make status more restrictive',()=>{const overrides=[{start:'2026-12-20',end:'2026-12-28',status:'Very Limited' as const},{start:'2026-12-24',end:'2026-12-24',status:'Contact for Availability' as const}];assert.equal(applyAvailabilityOverrides('2026-12-21','Good Availability',overrides),'Very Limited');assert.equal(applyAvailabilityOverrides('2026-12-24','Limited Availability',overrides),'Contact for Availability');assert.equal(applyAvailabilityOverrides('2026-12-21','Contact for Availability',overrides),'Contact for Availability');assert.equal(applyAvailabilityOverrides('2026-12-30','Good Availability',overrides),'Good Availability');});

test('planner prefill safely parses supported household shapes',()=>{assert.deepEqual(parsePlannerPrefill('?planner=1&pets=1&household=Dog&duration=30&windows=0,2'),{count:1,types:['dog'],service:'drop30',blocks:[0,2],overnight:false});assert.deepEqual(parsePlannerPrefill('?planner=1&pets=1&household=Cat&duration=60'),{count:1,types:['cat'],service:'drop60',blocks:[],overnight:false});assert.deepEqual(parsePlannerPrefill('?planner=1&pets=3&household=Dogs+and+cats&duration=60&windows=1'),{count:3,types:['dog','dog','cat'],service:'drop60',blocks:[1],overnight:false});assert.deepEqual(parsePlannerPrefill('?planner=1&pets=4&household=Mixed-pet+household&overnight=1'),{count:4,types:['dog','cat','small','small'],service:'overnight',blocks:[],overnight:true});});
test('planner prefill clamps counts and discards invalid windows',()=>{const value=parsePlannerPrefill('?planner=1&pets=99&household=Dog&duration=bogus&windows=-1,0,0,8,nope');assert(value);assert.equal(value.count,8);assert.equal(value.types.length,8);assert.deepEqual(value.blocks,[0]);assert.equal(value.service,'drop30');assert.equal(parsePlannerPrefill('?pets=2'),null);});
test('Turnstile requires a complete site and secret key pair',()=>{assert.equal(turnstileMode(undefined,undefined),'off');assert.equal(turnstileMode('',''),'off');assert.equal(turnstileMode('site','secret'),'enabled');assert.equal(turnstileMode('site',undefined),'misconfigured');assert.equal(turnstileMode(undefined,'secret'),'misconfigured');});
