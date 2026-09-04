import {business} from '../config/business.ts';
import type {EstimateService,PetType} from './estimate.ts';
export type PlannerPrefill={count:number;types:PetType[];service:EstimateService;blocks:number[];overnight:boolean};
export function parsePlannerPrefill(search:string):PlannerPrefill|null{
 const params=new URLSearchParams(search);if(params.get('planner')!=='1')return null;
 const count=Math.max(1,Math.min(8,Number(params.get('pets'))||1)),household=params.get('household')||'',duration=params.get('duration')==='90'?90:params.get('duration')==='60'?60:30;
 const blocks=[...new Set((params.get('windows')||'').split(',').filter(Boolean).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<business.windows.length))],overnight=params.get('overnight')==='1';
 let types:PetType[];if(household==='Dog')types=Array(count).fill('dog');else if(household==='Cat')types=Array(count).fill('cat');else if(household==='Dogs and cats')types=Array.from({length:count},(_,i)=>i===count-1?'cat':'dog');else if(household==='Rabbit, bird, fish, or small animal')types=Array(count).fill('small');else if(household==='Mixed-pet household')types=Array.from({length:count},(_,i)=>i===0?'dog':i===1?'cat':'small');else return null;
 return{count,types,blocks,overnight,service:overnight?'overnight':duration===90?'drop90':duration===60?'drop60':'drop30'};
}
