import type {TravelTierKey} from '../config/business.ts';
import type {serviceCatalog} from '../config/business.ts';

export type PetType='dog'|'cat'|'rabbit'|'bird'|'fish'|'small';
export type EstimatePet={type:PetType;complex?:boolean};
export type EstimateService=keyof typeof serviceCatalog;
export type MiddayService='none'|'drop30'|'drop60'|'drop90'|'walk30'|'walk60'|'walk90';
export type EstimateInput={pets:EstimatePet[];service:EstimateService;start:string;end:string;blocks:number[];midday:MiddayService;zip:string;travelTier?:TravelTierKey;now:Date};
export type EstimateIssue='dates'|'past-date'|'zip'|'windows'|'walk-household'|'pets';
export type EstimateReviewReason='travel'|'complex-care'|'household'|'unusual-species'|'small-animal-overnight'|'extended-overnight'|'long-stay'|'short-notice';
export type EstimateResult={total:number|null;serviceSubtotal:number;base:number;petFee:number;units:number;holidayFee:0;holidayPending:true;potentialShortFee:number;shortCount:number;sameDayCount:number;travelFee:number|null;travelTier?:TravelTierKey;addOn:number;addOnUnits:number;reviewRequired:boolean;reviewReasons:EstimateReviewReason[]};
export type PublicEstimateResult=Omit<EstimateResult,'reviewReasons'>;
