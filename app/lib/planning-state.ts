import type {EstimateService,PetType} from './estimate-types.ts';

export type PlanningState={petTypes:PetType[];service?:EstimateService;blocks:number[];midday?:'none'|'drop30'|'drop60'|'drop90'|'walk30'|'walk60'|'walk90';zip?:string;zone?:string;availability?:string};
const petTypes=new Set<PetType>(['dog','cat','rabbit','bird','fish','small']);
const services=new Set<EstimateService>(['drop30','drop60','drop90','walk30','walk60','walk90','overnight']);
export const sanitizePlanningState=(input:Record<string,unknown>):PlanningState=>({
 petTypes:Array.isArray(input.petTypes)?input.petTypes.filter((x):x is PetType=>typeof x==='string'&&petTypes.has(x as PetType)).slice(0,8):[],
 service:typeof input.service==='string'&&services.has(input.service as EstimateService)?input.service as EstimateService:undefined,
 blocks:Array.isArray(input.blocks)?[...new Set(input.blocks.filter((x):x is number=>Number.isInteger(x)&&Number(x)>=0&&Number(x)<4))]:[],
 midday:typeof input.midday==='string'&&new Set(['none','drop30','drop60','drop90','walk30','walk60','walk90']).has(input.midday)?input.midday as PlanningState['midday']:undefined,
 zip:typeof input.zip==='string'&&/^\d{5}$/.test(input.zip)?input.zip:undefined,
 zone:typeof input.zone==='string'?input.zone.slice(0,40):undefined,availability:typeof input.availability==='string'?input.availability.slice(0,50):undefined,
});
export const planningStateQuery=(state:PlanningState)=>{const clean=sanitizePlanningState(state as unknown as Record<string,unknown>),params=new URLSearchParams();if(clean.petTypes.length)params.set('petTypes',clean.petTypes.join(','));if(clean.service)params.set('service',clean.service);if(clean.blocks.length)params.set('windows',clean.blocks.join(','));if(clean.midday)params.set('midday',clean.midday);if(clean.zip)params.set('zip',clean.zip);return params.toString()};
export const parsePlanningStateQuery=(search:string)=>{const p=new URLSearchParams(search),windows=(p.get('windows')||'').split(',').filter(Boolean).map(Number);return sanitizePlanningState({petTypes:(p.get('petTypes')||'').split(',').filter(Boolean),service:p.get('service'),blocks:windows,midday:p.get('midday'),start:p.get('start'),end:p.get('end'),zip:p.get('zip')})};
export const PLANNING_KEY='cuddlecrew-care-plan-v1';
export const parseStoredPlanningState=(raw:string|null)=>{if(!raw)return sanitizePlanningState({});try{const value=JSON.parse(raw);return value&&typeof value==='object'?sanitizePlanningState(value):sanitizePlanningState({})}catch{return sanitizePlanningState({})}};
export const loadPlanningState=()=>{try{return typeof sessionStorage==='undefined'?sanitizePlanningState({}):parseStoredPlanningState(sessionStorage.getItem(PLANNING_KEY))}catch{return sanitizePlanningState({})}};
export const savePlanningState=(state:PlanningState)=>{try{if(typeof sessionStorage!=='undefined')sessionStorage.setItem(PLANNING_KEY,JSON.stringify(sanitizePlanningState(state as unknown as Record<string,unknown>)))}catch{}}
export const clearPlanningState=()=>{try{if(typeof sessionStorage!=='undefined')sessionStorage.removeItem(PLANNING_KEY)}catch{}}
