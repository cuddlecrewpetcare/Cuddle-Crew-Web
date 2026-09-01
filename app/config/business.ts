export type PricingPetType='dog'|'cat'|'smallAnimal';
export type VisitDuration=30|60;
export type TravelZoneKey='core'|'standard'|'extended'|'farExtended';

type DurationRates=Record<VisitDuration,number>;
type PricingConfig={
  dropIn:Record<PricingPetType,DurationRates>;
  dogWalk:DurationRates;
  overnight:{dogHousehold:number;catOnly:number;smallAnimalOnly:null};
  overnightMidday:{dogHousehold:number;catOnly:number;smallAnimalOnly:number};
  additionalPet:Record<PricingPetType,number>;
  holiday:{visit:number;overnight:number};
  shortNotice:{visit:number;overnight:number;thresholdHours:48};
};

type TravelZone={
  name:string;
  feePerVisit:number;
  minMinutesExclusive:number|null;
  maxMinutesInclusive:number;
  color:string;
  zips:readonly string[];
};

const pricing:PricingConfig={
  dropIn:{
    dog:{30:30,60:48},
    cat:{30:28,60:45},
    smallAnimal:{30:28,60:45},
  },
  dogWalk:{30:32,60:50},
  overnight:{dogHousehold:85,catOnly:80,smallAnimalOnly:null},
  overnightMidday:{dogHousehold:25,catOnly:23,smallAnimalOnly:23},
  additionalPet:{dog:10,cat:5,smallAnimal:5},
  holiday:{visit:15,overnight:30},
  shortNotice:{visit:10,overnight:25,thresholdHours:48},
};

const zones:{readonly [K in TravelZoneKey]:TravelZone}={
  core:{name:'Core',feePerVisit:0,minMinutesExclusive:null,maxMinutesInclusive:10,color:'#64FF41',zips:['95608','95628','95821','95864']},
  standard:{name:'Standard',feePerVisit:0,minMinutesExclusive:10,maxMinutesInclusive:20,color:'#3075FF',zips:['95610','95621','95662','95825','95841','95842']},
  extended:{name:'Extended',feePerVisit:10,minMinutesExclusive:20,maxMinutesInclusive:30,color:'#FFBF5E',zips:['95660','95661','95670','95678','95826','95827','95843','95655']},
  farExtended:{name:'Far Extended',feePerVisit:20,minMinutesExclusive:30,maxMinutesInclusive:45,color:'#E45CFF',zips:['95630','95648','95650','95677','95742','95746','95747','95762','95765']},
};

export const business = {
  name: 'Cuddle Crew Pet Care', owner: 'Lauren Blalock', email: 'lauren@cuddlecrewpetcare.com',
  phoneDisplay: '916-252-3550', phoneHref: 'tel:+19162523550', timezone: 'America/Los_Angeles',
  website: 'https://www.cuddlecrewpetcare.com', phoneE164: '+1-916-252-3550',
  location: { city: 'Carmichael', region: 'CA', territory: 'Sacramento and surrounding communities, California' },
  replyWindow: 'within 1–2 business days',
  portal: { register: 'https://cuddlecrewpetcare.petssl.com/account', login: 'https://cuddlecrewpetcare.petssl.com/login' },
  social: {
    google: 'https://share.google/O3aya8JQkApZ4prHu',
    facebook: 'https://www.facebook.com/profile.php?id=61593543881861',
    yelp: 'https://www.yelp.com/biz/cuddle-crew-pet-care-carmichael-2',
    instagram: 'https://www.instagram.com/cuddlecrewpetcare/',
  },
  windows: [
    {id:'morning',label:'9 AM–12 PM',startHour:9,endHour:12},
    {id:'midday',label:'12–3 PM',startHour:12,endHour:15},
    {id:'afternoon',label:'3–6 PM',startHour:15,endHour:18},
    {id:'evening',label:'6–9 PM',startHour:18,endHour:21},
  ],
  overnight: {startHour:18,endHour:8,label:'approximately 6 PM–8 AM'},
  pricing,
  travel:{
    basis:'approximate one-way drive time',
    beyondMinutes:45,
    overnightExtendedArea:'personal-review' as const,
  },
  zones,
  meetAndGreet:{required:true,paid:true,publishedPrice:null},
  petTransportation:{offered:false,authorization:'not-confirmed' as const},
  shortNotice: {
    daytimeRule: 'less than 48 hours',
    overnightRule: 'less than 48 hours',
  },
  credentials: {
    insurer:'Business Insurers of the Carolinas', insurerUrl:'https://www.business-insurers.com/pet-sitter-dog-walker-pet-taxi-and-pooper-scooper-insurance/',
    liabilityOccurrence:1_000_000,liabilityAggregate:2_000_000,cccPerClaim:50_000,cccAnnual:50_000,dishonestyBond:5_000,
    psi:{status:'active',expires:'2027-08-19',lastVerified:'2026-08-27',certificateUrl:'/psi-membership-certificate.jpg'},
    cpr:{status:'in progress',program:'Pet Tech® PetSaver™ eight-hour certification',programUrl:'https://pettech.net/cpr-day/'},
  },
  availabilityOverrides: [] as readonly {start:string;end:string;status:'Limited Availability'|'Very Limited'|'Contact for Availability';note?:string}[],
} as const;

export const allServiceZips = Object.values(business.zones).flatMap(zone=>zone.zips);
