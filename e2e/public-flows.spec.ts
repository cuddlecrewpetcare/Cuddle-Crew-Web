import {expect,test} from '@playwright/test';

const futureDate='2099-01-02';

test('home keeps service, ZIP, keyboard, and portal paths usable',async({page})=>{
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to main content'})).toBeFocused();
  await expect(page.getByRole('heading',{name:'Care for the time the routine needs.'})).toBeVisible();
  await expect(page.getByText('$30').first()).toBeVisible();
  await expect(page.getByRole('link',{name:'New client registration'}).first()).toHaveAttribute('href','https://cuddlecrewpetcare.petssl.com/account');

  const zip=page.locator('.checker').getByLabel('Service ZIP');
  await expect(zip).toBeEditable();
  await zip.fill('95821');
  await expect(zip).toHaveValue('95821');
  await page.getByRole('button',{name:'Check ZIP'}).click();
  await expect(page.locator('.checker .result')).toContainText('Personalized travel review required');
  await zip.fill('95660');
  await expect(page.locator('.checker .result')).toContainText('ZIP 95660 cannot determine an approved travel tier');
});

test('estimator and planner retain preliminary, non-booking boundaries',async({page})=>{
  const date=futureDate;
  let availabilityPayload:Record<string,unknown>|undefined;
  await page.route('**/api/availability',route=>{expect(route.request().method()).toBe('POST');expect(new URL(route.request().url()).search).toBe('');availabilityPayload=route.request().postDataJSON() as Record<string,unknown>;return route.fulfill({contentType:'application/json',body:JSON.stringify({state:'Limited Availability'})})});
  await page.goto('/');
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

test('start and contact flows do not send a real inquiry in browser tests',async({page})=>{
  await page.goto('/start');
  await expect(page.getByRole('heading',{name:'Find your next pet-care step.'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Open your client portal'})).toHaveAttribute('href','https://cuddlecrewpetcare.petssl.com/login');

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
  expect(submitted?.phone).toBe('916-555-1212');expect(submitted?.smsConsent).toBe(false);

  failDelivery=true;await page.reload();
  await page.getByLabel(/Your name/).fill('Private Test Visitor');await page.getByLabel(/Your email/).fill('private-test@example.com');await page.getByLabel(/Phone/).fill('916-555-0199');await page.getByLabel(/What would you like to ask/).fill('This private test message must not enter a URL.');await page.getByRole('button',{name:'Send inquiry'}).click();
  const fallback=page.getByRole('link',{name:'Open your email app instead'});await expect(fallback).toHaveAttribute('href','mailto:lauren@cuddlecrewpetcare.com?subject=Pet%20care%20question');const href=await fallback.getAttribute('href');for(const value of ['Private Test Visitor','private-test@example.com','916-555-0199','private test message'])expect(href?.toLowerCase()).not.toContain(value.toLowerCase());
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
  await page.goto('/');
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
  await expect(page.getByLabel('Behavior or safety consideration')).toHaveValue('none');
  await expect(page.getByRole('heading',{name:'Possible service timing across a day'})).toBeVisible();
  await page.getByRole('button',{name:'Clear saved planner progress and reset'}).click();
  await expect(page.getByText('Saved planner progress cleared.')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>sessionStorage.getItem('cuddlecrew-care-planner-v1'))).toBeNull();
});
