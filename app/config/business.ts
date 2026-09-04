export const business = {
  name: 'Cuddle Crew Pet Care', owner: 'Lauren Blalock', email: 'lauren@cuddlecrewpetcare.com',
  phoneDisplay: '916-252-3550', phoneHref: 'tel:+19162523550', timezone: 'America/Los_Angeles',
  website: 'https://www.cuddlecrewpetcare.com', phoneE164: '+1-916-252-3550',
  location: { city: 'Carmichael', region: 'CA', territory: 'Sacramento area, California' },
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
  pricing: {
    drop30:{dog:30,cat:28,small:28,other:28}, drop60:{dog:48,cat:45,small:45,other:45}, drop90:{dog:66,cat:62,small:62,other:62},
    walk30:32, walk60:50, walk90:68,
    overnight:{dog:85,cat:80,small:null},
    overnightMidday30:{dog:25,cat:23,small:23,other:23},
    additionalDog:10, additionalCat:5, additionalSmall:5, additionalOther:5,
    holidayVisit:15, holidayOvernight:30,
    shortNoticeVisit:10, sameDayVisit:20, shortNoticeOvernight:25,
  },
  travel: {
    core:{name:'Core',maximumMinutes:10,fee:0},
    standard:{name:'Standard',maximumMinutes:20,fee:0},
    extended:{name:'Extended',maximumMinutes:30,fee:10},
    farExtended:{name:'Far Extended',maximumMinutes:45,fee:20},
    beyond:{name:'Beyond normal range',maximumMinutes:null,fee:null},
  },
  policyStatus: {holidayCalendar:'PLACEHOLDER',zipZoneMap:'MISSING',credentialsAndScope:'PLACEHOLDER'},
  availabilityOverrides: [] as readonly {start:string;end:string;status:'Limited Availability'|'Very Limited'|'Contact for Availability';note?:string}[],
} as const;

export type TravelTierKey=keyof typeof business.travel;

export const serviceCatalog = {
  drop30:{label:'30-minute drop-in',kind:'drop-in',duration:30,prices:business.pricing.drop30},
  drop60:{label:'60-minute drop-in',kind:'drop-in',duration:60,prices:business.pricing.drop60},
  drop90:{label:'90-minute Extended Care',kind:'drop-in',duration:90,prices:business.pricing.drop90},
  walk30:{label:'30-minute dog walk',kind:'walk',duration:30,price:business.pricing.walk30},
  walk60:{label:'60-minute dog walk',kind:'walk',duration:60,price:business.pricing.walk60},
  walk90:{label:'90-minute Adventure Walk',kind:'walk',duration:90,price:business.pricing.walk90},
  overnight:{label:'Overnight care',kind:'overnight',duration:null,prices:business.pricing.overnight},
} as const;
