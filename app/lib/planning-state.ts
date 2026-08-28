import type {EstimateService,PetType} from './estimate.ts';

export type PlanningState={petTypes:PetType[];service?:EstimateService;blocks:number[];midday?:'none'|'30'|'60';start?:string;end?:string;zip?:string;zone?:string;availability?:string};
const petTypes=new Set<PetType>(['dog','cat','rabbit','bird','fish','small']);
const services=new Set<EstimateService>(['drop30','drop60','walk30','walk60','overnight']);
const iso=/^\d{4}-\d{2}-\d{2}$/;
export const sanitizePlanningState=(input:Record<string,unknown>):PlanningState=>({
 petTypes:Array.isArray(input.petTypes)?input.petTypes.filter((x):x is PetType=>typeof x==='string'&&petTypes.has(x as PetType)).slice(0,8):[],
 service:typeof input.service==='string'&&services.has(input.service as EstimateService)?input.service as EstimateService:undefined,
 blocks:Array.isArray(input.blocks)?[...new Set(input.blocks.filter((x):x is number=>Number.isInteger(x)&&Number(x)>=0&&Number(x)<4))]:[],
 midday:input.midday==='30'||input.midday==='60'||input.midday==='none'?input.midday:undefined,
 start:typeof input.start==='string'&&iso.test(input.start)?input.start:undefined,end:typeof input.end==='string'&&iso.test(input.end)?input.end:undefined,
 zip:typeof input.zip==='string'&&/^\d{5}$/.test(input.zip)?input.zip:undefined,
 zone:typeof input.zone==='string'?input.zone.slice(0,40):undefined,availability:typeof input.availability==='string'?input.availability.slice(0,50):undefined,
});
export const planningStateQuery=(state:PlanningState)=>{const clean=sanitizePlanningState(state as unknown as Record<string,unknown>),params=new URLSearchParams();if(clean.petTypes.length)params.set('petTypes',clean.petTypes.join(','));if(clean.service)params.set('service',clean.service);if(clean.blocks.length)params.set('windows',clean.blocks.join(','));if(clean.midday)params.set('midday',clean.midday);if(clean.start)params.set('start',clean.start);if(clean.end)params.set('end',clean.end);if(clean.zip)params.set('zip',clean.zip);return params.toString()};
export const parsePlanningStateQuery=(search:string)=>{const p=new URLSearchParams(search);return sanitizePlanningState({petTypes:(p.get('petTypes')||'').split(',').filter(Boolean),service:p.get('service'),blocks:(p.get('windows')||'').split(',').map(Number),midday:p.get('midday'),start:p.get('start'),end:p.get('end'),zip:p.get('zip')})};
export const PLANNING_KEY='cuddlecrew-care-plan-v1';
