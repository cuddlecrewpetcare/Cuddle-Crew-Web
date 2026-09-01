import type {CarePlannerInput,LifeStage,VisitFit} from './care-planner.ts';

export type CarePlannerProgress=Pick<CarePlannerInput,'dogs'|'cats'|'otherPets'|'lifeStage'|'feedingFrequency'|'bathroomIntervalHours'|'comfortableAloneHours'|'windowIndexes'|'overnight'|'visitFit'>;
const stages=new Set<LifeStage>(['puppy','adult','senior','mixed']),fits=new Set<VisitFit>(['30','60','neither','unknown']);
const bounded=(value:unknown,min:number,max:number,fallback:number)=>Number.isInteger(value)&&Number(value)>=min&&Number(value)<=max?Number(value):fallback;
export const CARE_PLANNER_PROGRESS_KEY='cuddlecrew-care-planner-v1';
export const sanitizeCarePlannerProgress=(input:Record<string,unknown>):CarePlannerProgress=>({
 dogs:bounded(input.dogs,0,8,1),cats:bounded(input.cats,0,8,0),otherPets:bounded(input.otherPets,0,8,0),
 lifeStage:typeof input.lifeStage==='string'&&stages.has(input.lifeStage as LifeStage)?input.lifeStage as LifeStage:'adult',
 feedingFrequency:bounded(input.feedingFrequency,1,6,2),bathroomIntervalHours:bounded(input.bathroomIntervalHours,1,24,8),comfortableAloneHours:bounded(input.comfortableAloneHours,1,24,8),
 windowIndexes:Array.isArray(input.windowIndexes)?[...new Set(input.windowIndexes.filter((value):value is number=>Number.isInteger(value)&&Number(value)>=0&&Number(value)<4))]:[0,2],
 overnight:input.overnight===true,visitFit:typeof input.visitFit==='string'&&fits.has(input.visitFit as VisitFit)?input.visitFit as VisitFit:'unknown',
});
export const parseCarePlannerProgress=(raw:string|null)=>{if(!raw)return sanitizeCarePlannerProgress({});try{const value=JSON.parse(raw);return value&&typeof value==='object'?sanitizeCarePlannerProgress(value):sanitizeCarePlannerProgress({})}catch{return sanitizeCarePlannerProgress({})}};
export const loadCarePlannerProgress=()=>{try{return typeof sessionStorage==='undefined'?sanitizeCarePlannerProgress({}):parseCarePlannerProgress(sessionStorage.getItem(CARE_PLANNER_PROGRESS_KEY))}catch{return sanitizeCarePlannerProgress({})}};
export const saveCarePlannerProgress=(value:CarePlannerProgress)=>{try{if(typeof sessionStorage!=='undefined')sessionStorage.setItem(CARE_PLANNER_PROGRESS_KEY,JSON.stringify(sanitizeCarePlannerProgress(value as unknown as Record<string,unknown>)))}catch{}};
export const clearCarePlannerProgress=()=>{try{if(typeof sessionStorage!=='undefined')sessionStorage.removeItem(CARE_PLANNER_PROGRESS_KEY)}catch{}};
