import {business} from '../config/business.ts';
import {plannerCareGap} from './business-rules.ts';

export type LifeStage='puppy'|'adult'|'senior'|'mixed';
export type MedicationNeed='none'|'routine'|'timed'|'complex'|'procedure';
export type BehaviorNeed='none'|'fear'|'reactive'|'aggressive'|'escape';
export type RoutineComplexity='simple'|'moderate'|'complex'|'unclear';
export type SeparationNeed='none'|'feeding'|'handling'|'unclear';
export type VisitFit='30'|'60'|'neither'|'unknown';

export type CarePlannerInput={
  dogs:number;cats:number;otherPets:number;lifeStage:LifeStage;
  feedingFrequency:number;bathroomIntervalHours:number;comfortableAloneHours:number;
  taskCount:number;medication:MedicationNeed;behavior:BehaviorNeed;
  routineComplexity:RoutineComplexity;separation:SeparationNeed;visitFit:VisitFit;
  windowIndexes:number[];overnight:boolean;
};

export type CarePlanAssessment={
  durationMinutes:30|60;
  suitability:'starting-point'|'consultation-required'|'refer';
  longestPlausibleGapHours:number|null;
  gapWithinEnteredLimits:boolean|null;
  timezone:string;
  suggestedStartingPoint:string;
  reasons:string[];assumptions:string[];warnings:string[];reviewReasons:string[];factors:string[];
};

const unique=(items:string[])=>[...new Set(items)];
const petTotal=(input:CarePlannerInput)=>input.dogs+input.cats+input.otherPets;

export function assessCarePlan(input:CarePlannerInput):CarePlanAssessment{
  const total=petTotal(input),reviewReasons:string[]=[],warnings:string[]=[],factors:string[]=[],reasons:string[]=[];
  const workload=input.taskCount+total+(input.routineComplexity==='moderate'?2:input.routineComplexity==='complex'?4:0)+(input.separation==='none'?0:2);
  const durationMinutes:30|60=input.visitFit==='60'||input.visitFit==='neither'||workload>=9?60:30;
  const gap=plannerCareGap(input.windowIndexes,durationMinutes,input.overnight);
  const effectiveLimit=Math.min(input.comfortableAloneHours,input.bathroomIntervalHours);
  const gapWithinEnteredLimits=gap?gap.maximum<=effectiveLimit:null;

  factors.push(`${total} pet${total===1?'':'s'}: ${input.dogs} dog${input.dogs===1?'':'s'}, ${input.cats} cat${input.cats===1?'':'s'}, and ${input.otherPets} other accepted pet${input.otherPets===1?'':'s'}.`);
  factors.push(`${input.feedingFrequency} feeding period${input.feedingFrequency===1?'':'s'} per day and a stated bathroom/walk interval of ${input.bathroomIntervalHours} hours.`);
  factors.push(`${input.taskCount} selected care task${input.taskCount===1?'':'s'} with ${input.routineComplexity} routine complexity.`);
  if(input.overnight)factors.push(input.windowIndexes.length?'Overnight coverage plus intentionally selected daytime coverage.':'Overnight coverage without a daytime visit.');

  if(input.visitFit==='30')reasons.push('You indicated the complete routine fits safely within 30 minutes.');
  else if(input.visitFit==='60')reasons.push('You indicated the routine needs up to 60 minutes.');
  else if(input.visitFit==='neither')reviewReasons.push('The routine does not fit within a 60-minute service and needs a custom discussion or referral.');
  else reviewReasons.push('Visit duration is uncertain and should be confirmed before a service length is selected.');
  if(workload>=9){reasons.push('The household size, tasks, separation, or routine complexity point to a 60-minute starting point.');if(input.visitFit==='30')reviewReasons.push('The stated 30-minute fit conflicts with the routine workload.');}

  if(input.medication==='timed')reviewReasons.push('Time-sensitive medication cannot be matched to flexible arrival windows automatically.');
  if(input.medication==='complex')reviewReasons.push('Medication refusal risk or specialized handling requires private review.');
  if(input.medication==='procedure')reviewReasons.push('Injections and veterinary procedures are not offered and require an appropriate referral.');
  if(input.behavior==='fear')reviewReasons.push('Fearful or slow-to-warm handling needs a private fit and safety review.');
  if(input.behavior==='reactive')reviewReasons.push('Reactive behavior and trigger management require private review.');
  if(input.behavior==='aggressive')reviewReasons.push('Aggression, bite risk, or handling sensitivity requires private safety review and may not be accepted.');
  if(input.behavior==='escape')reviewReasons.push('Escape risk requires private access and handling planning.');
  if(input.lifeStage==='puppy'||input.lifeStage==='mixed')reviewReasons.push('Very young pets may need shorter intervals and an individually reviewed routine.');
  if(input.lifeStage==='senior'||input.lifeStage==='mixed')factors.push('Senior-pet comfort and mobility needs can affect visit length and timing.');
  if(input.routineComplexity==='complex')reviewReasons.push('A complex routine needs human confirmation of sequence, timing, and service fit.');
  if(input.routineComplexity==='unclear')reviewReasons.push('The routine is ambiguous and should be clarified before relying on a schedule.');
  if(input.separation==='feeding')reviewReasons.push('Separate feeding may change the service duration and safe task sequence.');
  if(input.separation==='handling')reviewReasons.push('Pets requiring separate handling need a private safety and feasibility review.');
  if(input.separation==='unclear')reviewReasons.push('Separation requirements are unclear and need consultation.');
  if(total<1)reviewReasons.push('At least one pet is required to create a planning result.');
  if(total>=5)reviewReasons.push('A larger household needs confirmation that all care tasks fit the selected service duration.');
  if(input.feedingFrequency>=3)factors.push('Frequent feeding may require timing coordination within flexible service windows.');
  if(!gap)reviewReasons.push('No service window or overnight coverage is selected, so a care gap cannot be evaluated.');
  else if(!gapWithinEnteredLimits)reviewReasons.push(`The longest plausible ${gap.maximum}-hour gap exceeds the entered ${effectiveLimit}-hour care limit.`);

  warnings.push('Service windows are flexible arrival ranges, not exact appointment times.');
  warnings.push(`Gap calculations use repeating local wall-clock windows in ${business.timezone}; daylight-saving transitions can change elapsed time and are confirmed during scheduling.`);
  warnings.push('This educational starting point does not diagnose, prescribe, provide treatment, guarantee acceptance, reserve inventory, or create a booking.');
  warnings.push('Final suitability, timing, availability, and service acceptance are determined through consultation.');

  const suitability=input.medication==='procedure'?'refer':reviewReasons.length?'consultation-required':'starting-point';
  const suggestedStartingPoint=suitability==='refer'?'Ask the veterinary team about an appropriate care arrangement.':suitability==='consultation-required'?`Begin with a ${durationMinutes}-minute planning option and review it with Lauren before relying on it.`:`A ${durationMinutes}-minute visit schedule is a reasonable educational starting point for consultation.`;
  if(gap)reasons.push(`The selected flexible windows produce a longest plausible care gap of approximately ${gap.maximum} hours.`);

  return{durationMinutes,suitability,longestPlausibleGapHours:gap?.maximum??null,gapWithinEnteredLimits,timezone:business.timezone,suggestedStartingPoint,reasons:unique(reasons),assumptions:[
    'Selected windows repeat each service day and a visit may begin anywhere within its listed arrival window.',
    'The entered comfortable-alone and bathroom/walk intervals are planning limits supplied by the household, not medical guidance.',
    'Overnight care uses the published approximate overnight coverage; selected daytime windows are included only when intentionally chosen.',
  ],warnings:unique(warnings),reviewReasons:unique(reviewReasons),factors:unique(factors)};
}
