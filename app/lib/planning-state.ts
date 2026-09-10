import type {EstimateService,PetType,PlannerContext} from './estimate-types.ts';
import {parsePlannerPrefill,sanitizePlannerContext} from './planner-prefill.ts';
import {business,serviceCatalog,type TravelTierKey} from '../config/business.ts';

export type PlanningState={petTypes:PetType[];service?:EstimateService;blocks:number[];midday?:'none'|'drop30'|'drop60'|'drop90'|'walk30'|'walk60'|'walk90';zip?:string;travelTier?:TravelTierKey;availability?:string;planner?:PlannerContext};
const petTypes=new Set<PetType>(['dog','cat','rabbit','bird','fish','small']);
const services=new Set<EstimateService>(Object.keys(serviceCatalog) as EstimateService[]);
const travelTiers=new Set<TravelTierKey>(Object.keys(business.travel) as TravelTierKey[]);
export const sanitizePlanningState=(input:Record<string,unknown>):PlanningState=>{const zip=typeof input.zip==='string'&&/^\d{5}$/.test(input.zip)?input.zip:undefined;return{
 petTypes:Array.isArray(input.petTypes)?input.petTypes.filter((x):x is PetType=>typeof x==='string'&&petTypes.has(x as PetType)).slice(0,8):[],
 service:typeof input.service==='string'&&services.has(input.service as EstimateService)?input.service as EstimateService:undefined,
 blocks:Array.isArray(input.blocks)?[...new Set(input.blocks.filter((x):x is number=>Number.isInteger(x)&&Number(x)>=0&&Number(x)<4))]:[],
 midday:typeof input.midday==='string'&&new Set(['none','drop30','drop60','drop90','walk30','walk60','walk90']).has(input.midday)?input.midday as PlanningState['midday']:undefined,
 zip,
 travelTier:zip&&typeof input.travelTier==='string'&&travelTiers.has(input.travelTier as TravelTierKey)?input.travelTier as TravelTierKey:undefined,
 availability:typeof input.availability==='string'?input.availability.slice(0,50):undefined,
 planner:sanitizePlannerContext(input.planner),
}};
export const planningStateQuery=(state:PlanningState)=>{const clean=sanitizePlanningState(state as unknown as Record<string,unknown>),params=new URLSearchParams();if(clean.petTypes.length)params.set('petTypes',clean.petTypes.join(','));if(clean.service)params.set('service',clean.service);if(clean.blocks.length)params.set('windows',clean.blocks.join(','));if(clean.midday)params.set('midday',clean.midday);if(clean.zip)params.set('zip',clean.zip);if(clean.planner)params.set('planningContext',JSON.stringify(clean.planner));return params.toString()};
const parsePlannerQueryContext=(raw:string|null)=>{try{return raw&&raw.length<=256?sanitizePlannerContext(JSON.parse(raw)):{reviewRequired:true,incomplete:true}}catch{return{reviewRequired:true,incomplete:true}}};
export const parsePlanningStateQuery=(search:string)=>{const p=new URLSearchParams(search),windows=(p.get('windows')||'').split(',').filter(Boolean).map(Number);return sanitizePlanningState({petTypes:(p.get('petTypes')||'').split(',').filter(Boolean),service:p.get('service'),blocks:windows,midday:p.get('midday'),start:p.get('start'),end:p.get('end'),zip:p.get('zip'),...(p.has('planningContext')?{planner:parsePlannerQueryContext(p.get('planningContext'))}:p.has('planningReview')?{planner:{reviewRequired:true,incomplete:true}}:{})})};
export function resolveEstimatePlanningState(search:string,saved:PlanningState):PlanningState{
 const handoff=parsePlannerPrefill(search),query=parsePlanningStateQuery(search);
 if(handoff)return{petTypes:handoff.types,service:handoff.service,blocks:handoff.blocks,midday:handoff.midday,planner:handoff.planner,zip:query.zip||saved.zip,travelTier:query.zip&&query.zip!==saved.zip?undefined:saved.travelTier};
 if(query.zip&&!query.petTypes.length&&!query.service&&!query.planner)return{...saved,zip:query.zip,travelTier:query.zip===saved.zip?saved.travelTier:undefined};
 return query.petTypes.length||query.planner?{...query,planner:query.planner||saved.planner}:saved;
}
export const PLANNING_KEY='cuddlecrew-care-plan-v1';
export const parseStoredPlanningState=(raw:string|null)=>{if(!raw)return sanitizePlanningState({});try{const value=JSON.parse(raw);return value&&typeof value==='object'?sanitizePlanningState(value):sanitizePlanningState({})}catch{return sanitizePlanningState({})}};
export const loadPlanningState=()=>{try{return typeof sessionStorage==='undefined'?sanitizePlanningState({}):parseStoredPlanningState(sessionStorage.getItem(PLANNING_KEY))}catch{return sanitizePlanningState({})}};
export const savePlanningState=(state:PlanningState)=>{try{if(typeof sessionStorage!=='undefined')sessionStorage.setItem(PLANNING_KEY,JSON.stringify(sanitizePlanningState(state as unknown as Record<string,unknown>)))}catch{}}
export const clearPlanningState=()=>{try{if(typeof sessionStorage!=='undefined')sessionStorage.removeItem(PLANNING_KEY)}catch{}}
export const savePlanningLocation=(location:{zip:string;travelTier?:TravelTierKey})=>{const current=loadPlanningState();savePlanningState({...current,zip:location.zip,travelTier:location.travelTier})};
export const clearPlanningLocation=()=>{const current=loadPlanningState();savePlanningState({...current,zip:undefined,travelTier:undefined})};
