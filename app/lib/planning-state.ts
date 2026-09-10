import type {EstimateService,PetType,PlannerContext} from './estimate-types.ts';
import {parsePlannerPrefill,sanitizePlannerContext} from './planner-prefill.ts';
import {business,serviceCatalog,type TravelTierKey} from '../config/business.ts';

export type PlanningState={petTypes:PetType[];service?:EstimateService;blocks:number[];midday?:'none'|'drop30'|'drop60'|'drop90'|'walk30'|'walk60'|'walk90';zip?:string;travelTier?:TravelTierKey;availability?:string;planner?:PlannerContext;reviewRequired?:boolean;requiresConfirmation?:boolean};
const petTypes=new Set<PetType>(['dog','cat','rabbit','bird','fish','small']);
const services=new Set<EstimateService>(Object.keys(serviceCatalog) as EstimateService[]);
const travelTiers=new Set<TravelTierKey>(Object.keys(business.travel) as TravelTierKey[]);
export const sanitizePlanningState=(input:Record<string,unknown>):PlanningState=>{const zip=typeof input.zip==='string'&&/^\d{5}$/.test(input.zip)?input.zip:undefined;return{
 petTypes:Array.isArray(input.petTypes)?input.petTypes.filter((x):x is PetType=>typeof x==='string'&&petTypes.has(x as PetType)).slice(0,8):[],
 service:typeof input.service==='string'&&services.has(input.service as EstimateService)?input.service as EstimateService:undefined,
 blocks:typeof input.service==='string'&&input.service.startsWith('continuous')?[]:Array.isArray(input.blocks)?[...new Set(input.blocks.filter((x):x is number=>Number.isInteger(x)&&Number(x)>=0&&Number(x)<4))]:[],
 midday:typeof input.midday==='string'&&new Set(['none','drop30','drop60','drop90','walk30','walk60','walk90']).has(input.midday)?input.midday as PlanningState['midday']:undefined,
 zip,
 travelTier:zip&&typeof input.travelTier==='string'&&travelTiers.has(input.travelTier as TravelTierKey)?input.travelTier as TravelTierKey:undefined,
 availability:typeof input.availability==='string'?input.availability.slice(0,50):undefined,
 planner:sanitizePlannerContext(input.planner),
 ...(input.reviewRequired===true?{reviewRequired:true}:{}),
}};
export const planningStateQuery=(state:PlanningState)=>{const clean=sanitizePlanningState(state as unknown as Record<string,unknown>),params=new URLSearchParams();if(clean.petTypes.length)params.set('petTypes',clean.petTypes.join(','));if(clean.service)params.set('service',clean.service);if(clean.blocks.length)params.set('windows',clean.blocks.join(','));if(clean.midday)params.set('midday',clean.midday);if(clean.zip)params.set('zip',clean.zip);if(clean.planner||clean.reviewRequired)params.set('planningContext',JSON.stringify(clean.reviewRequired?{...clean.planner,reviewRequired:true,incomplete:clean.planner?.incomplete||false}:clean.planner));return params.toString()};
const parsePlannerQueryContext=(raw:string|null)=>{try{return raw&&raw.length<=256?sanitizePlannerContext(JSON.parse(raw)):{reviewRequired:true,incomplete:true}}catch{return{reviewRequired:true,incomplete:true}}};
export const parsePlanningStateQuery=(search:string)=>{const p=new URLSearchParams(search),windows=(p.get('windows')||'').split(',').filter(Boolean).map(Number);return sanitizePlanningState({petTypes:(p.get('petTypes')||'').split(',').filter(Boolean),service:p.get('service'),blocks:windows,midday:p.get('midday'),start:p.get('start'),end:p.get('end'),zip:p.get('zip'),...(p.has('planningContext')?{planner:parsePlannerQueryContext(p.get('planningContext'))}:p.has('planningReview')?{planner:{reviewRequired:true,incomplete:true}}:{})})};
export function resolveEstimatePlanningState(search:string,saved:PlanningState):PlanningState{
 const handoff=parsePlannerPrefill(search),query=parsePlanningStateQuery(search);
 if(handoff)return{petTypes:handoff.types,service:handoff.service,blocks:handoff.blocks,midday:handoff.midday,planner:handoff.planner,zip:query.zip||saved.zip,travelTier:query.zip&&query.zip!==saved.zip?undefined:saved.travelTier};
 if(query.zip&&!query.petTypes.length&&!query.service&&!query.planner)return{...saved,zip:query.zip,travelTier:query.zip===saved.zip?saved.travelTier:undefined};
 return query.petTypes.length||query.planner?{...query,planner:query.planner||saved.planner,requiresConfirmation:true}:saved;
}
export const PLANNING_KEY='cuddlecrew-care-plan-v1';
const validWindows=(value:unknown):value is number[]=>Array.isArray(value)&&value.every(x=>Number.isInteger(x)&&x>=0&&x<4);
export const parseStoredPlanningState=(raw:string|null):PlanningState=>{
 if(raw===null)return sanitizePlanningState({});
 let input:Record<string,unknown>={};try{const value=JSON.parse(raw);if(value&&typeof value==='object'&&!Array.isArray(value))input=value}catch{}
 const state=sanitizePlanningState(input);
 // A location-only record contains no care answers to restore. All care records need confirmation.
 const locationOnly=Object.keys(input).every(key=>['schemaVersion','zip','travelTier','petTypes','blocks','reviewRequired'].includes(key))&&Array.isArray(input.petTypes)&&input.petTypes.length===0&&validWindows(input.blocks)&&input.blocks.length===0&&!state.reviewRequired;
 if(input.schemaVersion===2&&locationOnly)return state;
 const complete=input.schemaVersion===2&&Array.isArray(input.petTypes)&&input.petTypes.length>0&&input.petTypes.length<=8&&
  input.petTypes.every(type=>petTypes.has(type))&&!!state.service&&validWindows(input.blocks)&&state.midday!==undefined&&
  (input.reviewRequired===undefined||typeof input.reviewRequired==='boolean');
 return{...state,requiresConfirmation:true,...(!complete?{planner:{...state.planner,reviewRequired:true,incomplete:true}}:{})};
};
export const loadPlanningState=()=>{try{return parseStoredPlanningState(typeof sessionStorage==='undefined'?null:sessionStorage.getItem(PLANNING_KEY))}catch{return parseStoredPlanningState('')}};
export const savePlanningState=(state:PlanningState)=>{try{if(typeof sessionStorage!=='undefined')sessionStorage.setItem(PLANNING_KEY,JSON.stringify({schemaVersion:2,...sanitizePlanningState(state as unknown as Record<string,unknown>)}))}catch{}}
export const clearPlanningState=()=>{try{if(typeof sessionStorage!=='undefined')sessionStorage.removeItem(PLANNING_KEY)}catch{}}
export const savePlanningLocation=(location:{zip:string;travelTier?:TravelTierKey})=>{const current=loadPlanningState();savePlanningState({...current,zip:location.zip,travelTier:location.travelTier})};
export const clearPlanningLocation=()=>{const current=loadPlanningState();savePlanningState({...current,zip:undefined,travelTier:undefined})};
