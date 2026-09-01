import {expect,test} from '@playwright/test';

const futureDate=()=>{
  const date=new Date();
  date.setDate(date.getDate()+21);
  return date.toISOString().slice(0,10);
};

test('home keeps service, ZIP, keyboard, and portal paths usable',async({page})=>{
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to main content'})).toBeFocused();
  await expect(page.getByRole('heading',{name:'Services for their real routine.'})).toBeVisible();
  await expect(page.getByText('$30').first()).toBeVisible();
  await expect(page.getByRole('link',{name:'New client registration'}).first()).toHaveAttribute('href','https://cuddlecrewpetcare.petssl.com/account');

  const zip=page.locator('#zip');
  await expect(zip).toBeEditable();
  await page.waitForTimeout(2_000);
  await zip.fill('95821');
  await zip.press('Enter');
  await expect(page.locator('.checker .result')).toContainText('Core zone');
  await zip.fill('95660');
  await zip.press('Enter');
  await expect(page.locator('.checker .result')).toContainText('Extended zone');
  await zip.fill('99999');
  await zip.press('Enter');
  await expect(page.locator('.checker .result')).toContainText('Outside our listed zones');
});

test('estimator and planner retain preliminary, non-booking boundaries',async({page})=>{
  await page.route('**/api/availability?*',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({state:'Limited Availability'})}));
  await page.goto('/');
  await page.getByLabel('First service date').fill(futureDate());
  await page.getByLabel('Last service date').fill(futureDate());
  await page.getByLabel('Service ZIP').fill('95821');
  await page.getByLabel('9 AM–12 PM').check();
  await expect(page.getByText('Planning estimate').first()).toBeVisible();
  await expect(page.getByText("Final pricing, timing, safety, and availability require Lauren’s approval.")).toBeVisible();

  await page.goto('/plan');
  await expect(page.getByRole('heading',{name:'Turn a routine into a sensible starting plan.'})).toBeVisible();
  await page.getByLabel('Behavior or safety consideration').selectOption('reactive');
  await expect(page.getByText('Human review is needed')).toBeVisible();
});

test('start and contact flows do not send a real inquiry in browser tests',async({page})=>{
  await page.goto('/start');
  await expect(page.getByRole('heading',{name:'Find your next pet-care step.'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Open your client portal'})).toHaveAttribute('href','https://cuddlecrewpetcare.petssl.com/login');

  await page.route('**/api/contact',route=>route.fulfill({contentType:'application/json',body:'{}'}));
  await page.goto('/contact');
  await page.getByLabel(/Your name/).fill('Test Visitor');
  await page.getByLabel(/Your email/).fill('test@example.com');
  await page.getByLabel(/What would you like to ask/).fill('Could you explain the service-area review process?');
  await page.getByRole('button',{name:'Send inquiry'}).click();
  await expect(page.getByText('Thanks—your inquiry was sent to Lauren.')).toBeVisible();
});

test('anonymous progress survives refresh without retaining dates or safety details and can be deleted',async({page})=>{
  await page.goto('/');
  await page.getByLabel('Service ZIP').fill('95821');
  await page.getByLabel('9 AM–12 PM').check();
  await page.getByLabel('First service date').fill(futureDate());
  await page.getByLabel('Last service date').fill(futureDate());
  await page.reload();
  await expect(page.getByLabel('Service ZIP')).toHaveValue('95821');
  await expect(page.getByLabel('9 AM–12 PM')).toBeChecked();
  await expect(page.getByLabel('First service date')).toHaveValue('');
  await expect(page.getByLabel('Last service date')).toHaveValue('');
  await page.getByRole('button',{name:'Clear saved estimate and reset'}).click();
  await expect(page.getByText('Saved estimate cleared.')).toBeVisible();
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
