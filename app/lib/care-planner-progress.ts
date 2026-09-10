import type {CarePlannerInput,LifeStage,VisitFit} from './care-planner.ts';

export type CarePlannerProgress=Pick<CarePlannerInput,'dogs'|'cats'|'otherPets'|'lifeStage'|'feedingFrequency'|'bathroomIntervalHours'|'comfortableAloneHours'|'windowIndexes'|'overnight'|'visitFit'>;
const stages=new Set<LifeStage>(['puppy','adult','senior','mixed']),fits=new Set<VisitFit>(['30','60','90','neither','unknown']);
const bounded=(value:unknown,min:number,max:number,fallback:number)=>Number.isInteger(value)&&Number(value)>=min&&Number(value)<=max?Number(value):fallback;
export const CARE_PLANNER_PROGRESS_KEY='cuddlecrew-care-planner-v1';
export const sanitizeCarePlannerProgress=(input:Record<string,unknown>):CarePlannerProgress=>({
 dogs:bounded(input.dogs,0,8,1),cats:bounded(input.cats,0,8,0),otherPets:bounded(input.otherPets,0,8,0),
 lifeStage:typeof input.lifeStage==='string'&&stages.has(input.lifeStage as LifeStage)?input.lifeStage as LifeStage:'adult',
 feedingFrequency:bounded(input.feedingFrequency,1,6,2),bathroomIntervalHours:bounded(input.bathroomIntervalHours,1,24,8),comfortableAloneHours:bounded(input.comfortableAloneHours,1,24,8),
 windowIndexes:Array.isArray(input.windowIndexes)?[...new Set(input.windowIndexes.filter((value):value is number=>Number.isInteger(value)&&Number(value)>=0&&Number(value)<4))]:[0,2],
 overnight:input.overnight===true,visitFit:typeof input.visitFit==='string'&&fits.has(input.visitFit as VisitFit)?input.visitFit as VisitFit:'unknown',
});
// Restored selections are never evidence that the omitted care answers were negative.
const completeProgress=(input:Record<string,unknown>)=>
 input.schemaVersion===2&&
 (['dogs','cats','otherPets'] as const).every(key=>bounded(input[key],0,8,-1)!==-1)&&
 stages.has(input.lifeStage as LifeStage)&&bounded(input.feedingFrequency,1,6,-1)!==-1&&
 bounded(input.bathroomIntervalHours,1,24,-1)!==-1&&bounded(input.comfortableAloneHours,1,24,-1)!==-1&&
 Array.isArray(input.windowIndexes)&&input.windowIndexes.every(value=>Number.isInteger(value)&&value>=0&&value<4)&&
 typeof input.overnight==='boolean'&&fits.has(input.visitFit as VisitFit);
export const parseCarePlannerProgress=(raw:string|null)=>{
 const fresh={...sanitizeCarePlannerProgress({}),requiresConfirmation:false};if(raw===null)return fresh;
 try{const value=JSON.parse(raw);if(value&&typeof value==='object'&&!Array.isArray(value)){const progress=sanitizeCarePlannerProgress(value);return{...progress,visitFit:completeProgress(value)?progress.visitFit:'unknown' as VisitFit,requiresConfirmation:true}}}catch{}
 return{...fresh,requiresConfirmation:true};
};
export const loadCarePlannerProgress=()=>{try{return parseCarePlannerProgress(typeof sessionStorage==='undefined'?null:sessionStorage.getItem(CARE_PLANNER_PROGRESS_KEY))}catch{return parseCarePlannerProgress('')}};
export const saveCarePlannerProgress=(value:CarePlannerProgress)=>{try{if(typeof sessionStorage!=='undefined')sessionStorage.setItem(CARE_PLANNER_PROGRESS_KEY,JSON.stringify({schemaVersion:2,...sanitizeCarePlannerProgress(value as unknown as Record<string,unknown>)}))}catch{}};
export const clearCarePlannerProgress=()=>{try{if(typeof sessionStorage!=='undefined')sessionStorage.removeItem(CARE_PLANNER_PROGRESS_KEY)}catch{}};
