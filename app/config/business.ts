export const business = {
  name: 'Cuddle Crew Pet Care', owner: 'Lauren Blalock', email: 'lauren@cuddlecrewpetcare.com',
  phoneDisplay: '916-252-3550', phoneHref: 'tel:+19162523550', timezone: 'America/Los_Angeles',
  replyWindow: 'within 1–2 business days',
  portal: { register: 'https://cuddlecrewpetcare.petssl.com/account', login: 'https://cuddlecrewpetcare.petssl.com/login' },
  windows: ['9 AM–12 PM', '12–3 PM', '3–6 PM', '6–9 PM'],
  holidays: ["New Year’s Day", 'Easter', "Mother’s Day", 'Independence Day', 'Thanksgiving', 'Christmas Eve', 'Christmas Day', "New Year’s Eve"],
  pricing: { drop30:{dog:30,other:25}, drop60:{dog:45,other:40}, walk30:30, walk60:45,
    overnight:{dog:85,cat:80}, additionalDog:10, additionalOther:5, overnightAddOn30:20,
    overnightAddOn60:35, holidayVisit:15, holidayOvernight:30, shortNoticeVisit:10,
    sameDayVisit:20, shortNoticeOvernight:25 },
  zones: { core:['95608','95628','95821','95864'], standard:['95610','95621','95662','95825','95841','95842'],
    extended:['95660','95661','95670','95678','95826','95827','95843','95655'],
    farExtended:['95630','95648','95650','95677','95742','95746','95747','95762','95765'] },
} as const;
export const allServiceZips = Object.values(business.zones).flat();
