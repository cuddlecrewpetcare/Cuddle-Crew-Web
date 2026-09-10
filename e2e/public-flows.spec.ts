import {expect,test} from '@playwright/test';

const futureDate='2099-01-02';

test('home keeps service, keyboard, and start paths usable while service-area owns ZIP checks',async({page})=>{
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to main content'})).toBeFocused();
  await expect(page.getByRole('heading',{name:/In-home pet sitting and dog walking/})).toBeVisible();
  await expect(page.getByText('$30').first()).toBeVisible();
  await expect(page.getByRole('link',{name:'Start Here'}).first()).toHaveAttribute('href','/start');
  await expect(page.locator('.estimate-fields')).toHaveCount(0);

  await page.goto('/service-area');
  const zip=page.locator('.checker').getByLabel('Service ZIP');
  await expect(zip).toBeEditable();
  await zip.fill('95821');
  await expect(zip).toHaveValue('95821');
  await page.getByRole('button',{name:'Check ZIP'}).click();
  await expect(page.locator('.checker .result')).toContainText('Personalized travel review required');
  await zip.fill('95660');
  await page.getByRole('button',{name:'Check ZIP'}).click();
  await expect(page.locator('.checker .result')).toContainText('ZIP 95660 can identify the general request location');
  await expect(page.locator('.checker .result')).toContainText('cannot determine an approved travel tier');
});

test('service-area handoff keeps only ZIP and public tier, supports direct entry, and clears safely',async({page})=>{
  const exactAddress='123 Private Example Street, Sacramento, CA 95821';
  await page.route('**/api/address/suggestions',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({suggestions:[]})}));
  await page.route('**/api/address/check',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({available:true,zip:'95821',city:'Sacramento',travelTier:{key:'standard',name:'Standard',fee:0,reviewRequired:false},travelContext:'Typical one-way travel is within the public Standard tier.'})}));
  await page.goto('/service-area');
  await page.getByLabel('Street address').fill(exactAddress);
  await page.getByRole('button',{name:'Check address'}).click();
  await expect(page.getByRole('heading',{name:'Your general service location is ready.'})).toBeVisible();
  const stored=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('cuddlecrew-care-plan-v1')||'{}') as Record<string,unknown>);
  expect(stored.zip).toBe('95821');expect(stored.travelTier).toBe('standard');expect(JSON.stringify(stored)).not.toContain(exactAddress);expect(stored).not.toHaveProperty('address');expect(stored).not.toHaveProperty('city');
  expect(page.url()).not.toContain('123');
  await page.getByRole('link',{name:'Continue to estimate'}).click();
  await expect(page).toHaveURL(/\/rates#estimate$/);
  await expect(page.locator('.estimate-fields').getByLabel('Service ZIP')).toHaveValue('95821');
  await page.goto('/service-area');
  await page.getByRole('button',{name:'Clear saved ZIP and travel tier'}).click();
  await expect(page.getByRole('heading',{name:'Your general service location is ready.'})).toHaveCount(0);
  const cleared=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('cuddlecrew-care-plan-v1')||'{}') as Record<string,unknown>);
  expect(cleared).not.toHaveProperty('zip');expect(cleared).not.toHaveProperty('travelTier');

  await page.evaluate(value=>sessionStorage.setItem('cuddlecrew-care-plan-v1',JSON.stringify({zip:'private-address',travelTier:'internal-zone',address:value})),exactAddress);
  await page.reload();
  await expect(page.getByRole('heading',{name:'Your general service location is ready.'})).toHaveCount(0);
  await expect(page.locator('.checker').getByLabel('Service ZIP')).toHaveValue('');
});

test('estimator failure retains safe inputs, retries once requested, and hides internal details',async({page})=>{
  let attempts=0;
  await page.route('**/api/availability',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({state:'Request for Review'})}));
  await page.route('**/api/estimate',route=>{attempts++;return attempts===1?route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'private provider stack and internal failure detail'})}):route.continue()});
  await page.goto('/rates');
  await page.getByLabel('First service date').fill(futureDate);
  await page.getByLabel('Last service date').fill(futureDate);
  await page.getByLabel('9 AM–12 PM').check();
  await page.locator('.estimate-fields').getByLabel('Service ZIP').fill('95821');
  await expect(page.getByText('We couldn’t calculate this estimate.')).toBeVisible();
  await expect(page.getByText('A failed estimate does not mean service is unavailable.')).toBeVisible();
  await expect(page.getByText(/private provider stack/i)).toHaveCount(0);
  await expect(page.getByLabel('First service date')).toHaveValue(futureDate);
  await expect(page.getByLabel('9 AM–12 PM')).toBeChecked();
  await expect(page.locator('.estimate-fields').getByLabel('Service ZIP')).toHaveValue('95821');
  await expect(page.getByRole('link',{name:'Contact Lauren'})).toHaveAttribute('href','/contact');
  await page.getByRole('button',{name:'Try again'}).click();
  await expect(page.locator('.estimate-result')).toContainText('Personalized review required');
  expect(attempts).toBe(2);
});

test('estimator and planner retain preliminary, non-booking boundaries',async({page})=>{
  const date=futureDate;
  let availabilityPayload:Record<string,unknown>|undefined;
  await page.route('**/api/availability',route=>{expect(route.request().method()).toBe('POST');expect(new URL(route.request().url()).search).toBe('');availabilityPayload=route.request().postDataJSON() as Record<string,unknown>;return route.fulfill({contentType:'application/json',body:JSON.stringify({state:'Limited Availability'})})});
  await page.goto('/rates');
  await expect(page.locator('.estimate-fields')).toBeVisible();
  await page.getByLabel('First service date').fill(date);
  await page.getByLabel('Last service date').fill(date);
  await expect.poll(()=>availabilityPayload).toEqual({start:date,end:date});
  await page.getByLabel('9 AM–12 PM').check();
  await page.locator('.estimate-fields').getByLabel('Service ZIP').fill('95821');
  await expect(page.getByText('Personalized review required').first()).toBeVisible();
  await expect(page.locator('.estimate-result').getByText(/Payment does not guarantee acceptance/)).toBeVisible();

  await page.goto('/plan');
  await expect(page.getByRole('heading',{name:'Turn a routine into a sensible starting plan.'})).toBeVisible();
  await page.getByLabel('Behavior or safety consideration').selectOption('reactive');
  await expect(page.getByText('Personalized review required')).toBeVisible();
});

test('approved Continuous Care and holiday information are usable without creating a booking',async({page})=>{
  await page.goto('/rates');
  await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');
  await page.getByLabel('What care do you need?').selectOption('continuous5');
  await page.getByLabel('First service date').fill(futureDate);
  await page.getByLabel('Last service date').fill(futureDate);
  await page.locator('.estimate-fields').getByLabel('Service ZIP').fill('95821');
  await expect(page.locator('.estimate-result')).toContainText('$145');
  await expect(page.locator('.estimate-result')).toContainText('no ordinary per-pet modifier');
  await expect(page.getByText('Continuous Care at your residence')).toBeVisible();

  await page.getByLabel('What care do you need?').selectOption('continuous24');
  await page.getByLabel('Checkout date').fill('2099-01-03');
  await expect(page.locator('.estimate-result')).toContainText('$300');
  await expect(page.locator('.estimate-result')).toContainText('starting at');

  await page.goto('/holidays');
  await expect(page.getByRole('heading',{name:'Approved 2026–2028 holiday and peak dates.'})).toBeVisible();
  await expect(page.getByText(/January 16, 2026–January 19, 2026/)).toBeVisible();
  await expect(page.getByText(/December 24, 2026–January 3, 2027/)).toBeVisible();
  await expect(page.getByText(/January 15, 2027–January 18, 2027/)).toBeVisible();
  await expect(page.getByText(/December 24, 2027–January 3, 2028/)).toBeVisible();
  await expect(page.getByText(/June 30, 2028–July 4, 2028/)).toBeVisible();
  await expect(page.getByText(/December 24, 2028–January 3, 2029/)).toBeVisible();
});

test('start and contact flows do not send a real inquiry in browser tests',async({page})=>{
  await page.goto('/start');
  await expect(page.getByRole('heading',{name:'Start with clarity, then request care securely.'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Open your Precise Petcare account'})).toHaveAttribute('href','https://cuddlecrewpetcare.petssl.com/login');

  let submitted:Record<string,unknown>|undefined;
  let failDelivery=false;
  await page.route('**/api/contact',route=>{submitted=route.request().postDataJSON() as Record<string,unknown>;return route.fulfill({status:failDelivery?503:200,contentType:'application/json',body:failDelivery?JSON.stringify({error:'Unable to send inquiry.'}):'{}'})});
  await page.goto('/contact');
  const phone=page.getByLabel(/Phone/);
  const smsConsent=page.getByRole('checkbox',{name:'Yes, I agree to service-related text messages.'});
  await expect(phone).toHaveAttribute('type','tel');
  await expect(phone).toHaveAttribute('autocomplete','tel');
  await expect(phone).toHaveAttribute('name','phone');
  await expect(smsConsent).toHaveAttribute('name','smsConsent');
  await expect(smsConsent).not.toHaveAttribute('required','');
  await expect(smsConsent).not.toBeChecked();
  const disclosure=page.locator('#sms-disclosure');
  for(const phrase of ['Cuddle Crew Pet Care','service inquiries','appointment confirmations and reminders','Message frequency varies','Message and data rates may apply','STOP','HELP'])await expect(disclosure).toContainText(phrase);
  const privacyLink=page.getByRole('link',{name:'Privacy Policy'});
  await expect(privacyLink).toHaveAttribute('href','/privacy');
  await phone.focus();await page.keyboard.press('Tab');await page.keyboard.press('Tab');await expect(smsConsent).toBeFocused();await page.keyboard.press('Tab');await expect(privacyLink).toBeFocused();
  await page.getByLabel(/Your name/).fill('Test Visitor');
  await page.getByLabel(/Your email/).fill('test@example.com');
  await phone.fill('916-555-1212');
  await page.getByLabel(/What would you like to ask/).fill('Could you explain the service-area review process?');
  await page.getByRole('button',{name:'Send inquiry'}).click();
  await expect(page.getByText('Thanks—your inquiry was accepted for delivery to Lauren.')).toBeVisible();
  await expect(page.locator('.form-status.success')).toContainText('within 1–2 business days');
  expect(submitted?.phone).toBe('916-555-1212');expect(submitted?.smsConsent).toBe(false);

  failDelivery=true;await page.reload();
  await page.getByLabel(/Your name/).fill('Private Test Visitor');await page.getByLabel(/Your email/).fill('private-test@example.com');await page.getByLabel(/Phone/).fill('916-555-0199');await page.getByLabel(/What would you like to ask/).fill('This private test message must not enter a URL.');await page.getByRole('button',{name:'Send inquiry'}).click();
  const fallback=page.getByRole('link',{name:'Open your email app instead'});await expect(fallback).toHaveAttribute('href','mailto:lauren@cuddlecrewpetcare.com?subject=Pet%20care%20question');const href=await fallback.getAttribute('href');for(const value of ['Private Test Visitor','private-test@example.com','916-555-0199','private test message'])expect(href?.toLowerCase()).not.toContain(value.toLowerCase());
  const error=page.getByRole('alert');await expect(error.getByRole('link',{name:/Call 916-252-3550/})).toHaveAttribute('href','tel:+19162523550');await expect(error.getByRole('link',{name:'Open Precise Petcare'})).toHaveAttribute('href','https://cuddlecrewpetcare.petssl.com/login');
  await expect(page.getByLabel(/Your name/)).toHaveValue('Private Test Visitor');await expect(page.getByLabel(/Your email/)).toHaveValue('private-test@example.com');
  failDelivery=false;await page.getByRole('button',{name:'Try the form again'}).click();await expect(page.getByText('Thanks—your inquiry was accepted for delivery to Lauren.')).toBeVisible();
});

test('contact form transmits affirmative SMS consent only when checked',async({page})=>{
  let submitted:Record<string,unknown>|undefined;
  await page.route('**/api/contact',route=>{submitted=route.request().postDataJSON() as Record<string,unknown>;return route.fulfill({contentType:'application/json',body:'{}'})});
  await page.goto('/contact');
  const phone=page.getByLabel(/Phone/);
  const smsConsent=page.getByRole('checkbox',{name:'Yes, I agree to service-related text messages.'});
  await expect(async()=>{await smsConsent.uncheck();await smsConsent.check();await expect(phone).toHaveAttribute('required','',{timeout:250})}).toPass({timeout:5000});
  await page.getByLabel(/Your name/).fill('SMS Test Visitor');
  await page.getByLabel(/Your email/).fill('sms-test@example.com');
  await phone.fill('916-555-3434');
  await page.getByLabel(/What would you like to ask/).fill('Please explain how service-related text updates work.');
  await page.getByRole('button',{name:'Send inquiry'}).click();
  await expect(page.getByText('Thanks—your inquiry was accepted for delivery to Lauren.')).toBeVisible();
  expect(submitted?.phone).toBe('916-555-3434');expect(submitted?.smsConsent).toBe(true);expect(submitted).not.toHaveProperty('smsConsentTimestamp');expect(submitted).not.toHaveProperty('smsConsentSource');
});

test('contact SMS controls and disclosure are scanner-readable in initial public HTML',async({request})=>{
  const response=await request.get('/contact');expect(response.status()).toBe(200);const html=await response.text();
  for(const fragment of ['type="tel"','autoComplete="tel"','name="phone"','type="checkbox"','name="smsConsent"','Cuddle Crew Pet Care','service inquiries','appointment confirmations and reminders','Message frequency varies','Message and data rates may apply','STOP','HELP','href="/privacy"','Privacy Policy'])expect(html).toContain(fragment);
});

test('contact SMS consent remains readable without horizontal overflow across responsive sizes',async({page})=>{
  for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:800});await page.goto('/contact');await expect(page.getByLabel(/Phone/)).toBeVisible();await expect(page.getByRole('checkbox',{name:'Yes, I agree to service-related text messages.'})).toBeVisible();await expect(page.locator('#sms-disclosure')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true)}
});

test('anonymous progress survives refresh without retaining dates or safety details and can be deleted',async({page})=>{
  await page.goto('/rates');
  await expect(page.locator('.estimate-fields')).toBeVisible();
  await page.locator('.estimate-fields').getByLabel('Service ZIP').fill('95821');
  await page.getByLabel('9 AM–12 PM').check();
  await page.getByLabel('First service date').fill(futureDate);
  await page.getByLabel('Last service date').fill(futureDate);
  await page.reload();
  await expect(page.locator('.estimate-fields').getByLabel('Service ZIP')).toHaveValue('95821');
  await expect(page.getByLabel('9 AM–12 PM')).toBeChecked();
  await expect(page.getByLabel('First service date')).toHaveValue('');
  await expect(page.getByLabel('Last service date')).toHaveValue('');
  await page.getByRole('button',{name:'Clear saved estimate and reset'}).click();
  await expect(page.locator('.estimate-fields').getByLabel('Service ZIP')).toHaveValue('');
  await expect.poll(()=>page.evaluate(()=>sessionStorage.getItem('cuddlecrew-care-plan-v1'))).toBeNull();

  await page.goto('/plan');
  await expect.poll(()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('cuddlecrew-care-planner-v1')||'{}').dogs)).toBe(1);
  await page.getByLabel('Dogs').fill('2');
  await page.getByLabel('Behavior or safety consideration').selectOption('reactive');
  await expect.poll(()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('cuddlecrew-care-planner-v1')||'{}').dogs)).toBe(2);
  await page.reload();
  await expect(page.getByLabel('Dogs')).toHaveValue('2');
  await expect(page.getByLabel('Behavior or safety consideration')).toHaveValue('');
  await expect(page.getByRole('link',{name:'Price this starting point'})).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Possible service timing across a day'})).toBeVisible();
  await page.getByRole('button',{name:'Clear saved planner progress and reset'}).click();
  await expect(page.getByText('Saved planner progress cleared.')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>sessionStorage.getItem('cuddlecrew-care-planner-v1'))).toBeNull();
});

test('Continuous service transitions clear hidden visit windows and retain household and review state',async({page})=>{
 await page.goto('/rates');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');
 await page.getByLabel('How many pets need this service?').fill('2');
 await page.getByLabel('Care may be unusually detailed').first().check();
 for(const label of ['9 AM–12 PM','12–3 PM','3–6 PM','6–9 PM'])await page.getByLabel(label,{exact:true}).check();
 await page.getByLabel('What care do you need?').selectOption('drop60');
 await expect(page.locator('.time-blocks input:checked')).toHaveCount(4);
 await page.getByLabel('First service date').fill(futureDate);await page.getByLabel('Last service date').fill(futureDate);await page.locator('.estimate-fields').getByLabel('Service ZIP').fill('95821');
 await expect(page.locator('.estimate-result')).toContainText('$212');
 const response=page.waitForResponse(r=>r.url().endsWith('/api/estimate')&&r.request().postDataJSON().service==='continuous3');
 await page.getByLabel('What care do you need?').selectOption('continuous3');
 const actual=await response;expect(actual.request().postDataJSON().blocks).toEqual([]);const result=(await actual.json()).result;expect(result.potentialShortFee).toBe(0);expect(result.sameDayCount).toBe(0);expect(result.reviewRequired).toBe(true);
 await expect(page.locator('.time-blocks')).toHaveCount(0);await expect(page.locator('.estimate-result')).toContainText('$90');await expect(page.locator('.estimate-result')).not.toContainText('A potential');
 await expect.poll(()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('cuddlecrew-care-plan-v1')||'{}').blocks)).toEqual([]);
 const stored=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('cuddlecrew-care-plan-v1')||'{}'));expect(stored.petTypes).toEqual(['dog','cat']);expect(stored.zip).toBe('95821');expect(stored.reviewRequired).toBe(true);expect(stored).not.toHaveProperty('start');expect(stored).not.toHaveProperty('end');
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(value:string)=>{document.documentElement.dataset.summary=value}}});window.print=()=>{document.documentElement.dataset.printed='true'}});
 await page.getByRole('button',{name:'Copy summary',exact:true}).click();expect(await page.locator('html').getAttribute('data-summary')).toContain('Calculable service subtotal: $90');expect(await page.locator('html').getAttribute('data-summary')).not.toContain('$80');await page.getByRole('button',{name:'Print',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-printed','true');
 await page.getByLabel('What care do you need?').selectOption('drop30');await expect(page.locator('.time-blocks input:checked')).toHaveCount(0);await expect(page.locator('.estimate-result')).toContainText('Select at least one visit window');await expect(page.getByLabel('Care may be unusually detailed').first()).toBeChecked();
});
for(const entry of ['saved','query'] as const)test(`Continuous ${entry} entry removes stale windows before restore and API calculation`,async({page})=>{
 await page.goto('/rates');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');
 await page.evaluate(()=>sessionStorage.setItem('cuddlecrew-care-plan-v1',JSON.stringify({schemaVersion:2,petTypes:['dog','cat'],service:'continuous24',blocks:[0,1,2,3],midday:'none',zip:'95821',travelTier:'standard',reviewRequired:true})));
 if(entry==='saved')await page.reload();else await page.goto('/rates?petTypes=dog,cat&service=continuous24&windows=0,1,2,3&midday=none&zip=95821&planningContext=%7B%22reviewRequired%22%3Atrue%2C%22incomplete%22%3Afalse%7D#estimate');
 await expect(page.getByLabel('What care do you need?')).toHaveValue('continuous24');await expect(page.locator('.time-blocks')).toHaveCount(0);
 await page.getByLabel('First service date').fill(futureDate);await page.getByLabel('Checkout date').fill('2099-01-03');await expect(page.locator('.estimate-result')).toContainText('Review the restored selections');
 const response=page.waitForResponse(r=>r.url().endsWith('/api/estimate'));await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();
 const actual=await response;const request=actual.request().postDataJSON();expect(request.blocks).toEqual([]);expect(request.pets.map((p:{type:string})=>p.type)).toEqual(['dog','cat']);expect(request.planner.reviewRequired).toBe(true);const result=(await actual.json()).result;expect(result.total).toBeNull();expect(result.potentialShortFee).toBeNull();expect(result.reviewRequired).toBe(true);
 await expect.poll(()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('cuddlecrew-care-plan-v1')||'{}').blocks)).toEqual([]);
 await page.getByLabel('What care do you need?').selectOption('drop30');await expect(page.locator('.time-blocks input:checked')).toHaveCount(0);
});
