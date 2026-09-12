import type {EstimateInput,MiddayService} from './estimate-types.ts';
import {sanitizePlannerContext} from './planner-prefill.ts';

type ServiceSelection=Pick<EstimateInput,'service'|'midday'|'blocks'|'planner'>;

// Public selections only: explicit Planner coverage owns the add-on, including none.
export function effectiveMiddayService(input:ServiceSelection):MiddayService{
 if(input.service!=='overnight')return 'none';
 const planner=sanitizePlannerContext(input.planner);
 return planner?.overnightDuration?(input.blocks.length?`drop${planner.overnightDuration}`:'none'):input.midday;
}

export function hasIncompatibleDogWalk(input:ServiceSelection&Pick<EstimateInput,'pets'>):boolean{
 return (input.service.startsWith('walk')||effectiveMiddayService(input).startsWith('walk'))&&input.pets.some(pet=>pet.type!=='dog');
}
