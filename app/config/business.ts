export const business = {
  name: 'Cuddle Crew Pet Care', owner: 'Lauren Blalock', email: 'lauren@cuddlecrewpetcare.com',
  phoneDisplay: '916-252-3550', phoneHref: 'tel:+19162523550', timezone: 'America/Los_Angeles',
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
  pricing: { drop30:{dog:30,other:25}, drop60:{dog:45,other:40}, walk30:30, walk60:45,
    overnight:{dog:85,cat:80}, additionalDog:10, additionalOther:5, overnightAddOn30:20,
    overnightAddOn60:35, holidayVisit:15, holidayOvernight:30, shortNoticeVisit:10,
    sameDayVisit:20, shortNoticeOvernight:25 },
  shortNotice: {
    daytimeRule: 'under 48 hours, excluding same-day requests',
    sameDayRule: 'same calendar day',
    overnightRule: 'under 48 hours',
  },
  zones: {
    core:{name:'Core',fee:0,color:'#64FF41',zips:['95608','95628','95821','95864']},
    standard:{name:'Standard',fee:0,color:'#3075FF',zips:['95610','95621','95662','95825','95841','95842']},
    extended:{name:'Extended',fee:5,color:'#FFBF5E',zips:['95660','95661','95670','95678','95826','95827','95843','95655']},
    farExtended:{name:'Far Extended',fee:10,color:'#E45CFF',zips:['95630','95648','95650','95677','95742','95746','95747','95762','95765']},
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
