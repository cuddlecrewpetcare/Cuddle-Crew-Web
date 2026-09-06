import AxeBuilder from '@axe-core/playwright';
import {expect,test} from '@playwright/test';

const auditedRoutes=['/','/plan','/contact','/faq','/privacy'] as const;

for(const route of auditedRoutes){
 test(`${route} has no detectable WCAG A/AA accessibility violations`,async({page})=>{
  await page.goto(route);
  if(route==='/'){
   await page.route('**/api/availability',request=>request.fulfill({contentType:'application/json',body:JSON.stringify({state:'Request for Review'})}));
   await expect(page.locator('.estimate-fields')).toBeVisible();
   await page.getByLabel('How many pets need this service?').fill('2');
   await expect(page.getByRole('group',{name:'Pet 1',exact:true})).toBeVisible();
   await expect(page.getByRole('group',{name:'Pet 2',exact:true})).toBeVisible();
   await page.getByLabel('First service date').fill('2099-01-02');
   await page.getByLabel('Last service date').fill('2099-01-02');
   await page.getByLabel('9 AM–12 PM').check();
   await page.locator('.estimate-fields').getByLabel('Service ZIP').fill('95821');
   await expect(page.locator('.estimate-actions')).toBeVisible();
  }
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
 });
}

test('skip link and compact navigation preserve logical keyboard focus',async({page})=>{
 await page.setViewportSize({width:390,height:800});
 await page.goto('/contact');
 await page.keyboard.press('Tab');
 const skip=page.getByRole('link',{name:'Skip to main content'});
 await expect(skip).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(page.locator('main#main-content')).toBeFocused();

 const toggle=page.locator('.nav-toggle');
 await toggle.focus();
 await page.keyboard.press('Enter');
 await expect(toggle).toHaveAttribute('aria-expanded','true');
 await page.keyboard.press('Escape');
 await expect(toggle).toBeFocused();
 await expect(toggle).toHaveAttribute('aria-expanded','false');
});

test('address suggestions support combobox arrows, Enter, Escape, and status',async({page})=>{
 await page.route('**/api/address/suggestions',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({suggestions:[{id:'one',label:'123 Example Street, Sacramento, CA 95821'},{id:'two',label:'125 Example Street, Sacramento, CA 95821'}]})}));
 await page.route('**/api/address/check',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({available:true,zip:'95821',city:'Sacramento'})}));
 await page.goto('/');
 const address=page.getByRole('combobox',{name:'Street address'});
 await address.fill('123 Example');
 const listbox=page.getByRole('listbox',{name:'Address suggestions'});
 await expect(listbox.getByRole('option')).toHaveCount(2);
 const openWidgetResults=await new AxeBuilder({page}).include('.address-checker').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
 expect(openWidgetResults.violations).toEqual([]);
 await expect(page.locator('.address-checker [role="status"].sr-only')).toContainText(/2 address suggestions available/);
 await address.press('ArrowDown');
 await expect(address).toHaveAttribute('aria-activedescendant',/option-0$/);
 await address.press('Enter');
 await expect(address).toHaveValue('123 Example Street, Sacramento, CA 95821');
 await expect(page.locator('.address-result')).toContainText('95821');

 await address.fill('125 Example');
 await expect(listbox.getByRole('option')).toHaveCount(2);
 await address.press('Escape');
 await expect(page.getByRole('listbox')).toHaveCount(0);
 await expect(address).toBeFocused();
});

test('focus, reduced motion, touch, and narrow reflow remain usable',async({browser})=>{
 const context=await browser.newContext({hasTouch:true,isMobile:true,viewport:{width:320,height:568},reducedMotion:'reduce'});
 const page=await context.newPage();
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/contact');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 const textarea=page.getByLabel(/What would you like to ask/);
 await textarea.focus();
 expect(await textarea.evaluate(element=>Number.parseFloat(getComputedStyle(element).outlineWidth))).toBeGreaterThanOrEqual(3);
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
 await page.goto('/start');
 const social=page.getByRole('link',{name:/Instagram profile/});
 expect(await social.evaluate(element=>Number.parseFloat(getComputedStyle(element).transitionDuration))).toBeLessThanOrEqual(.001);
 const toggle=page.locator('.nav-toggle');
 await toggle.tap();
 await expect(toggle).toHaveAttribute('aria-expanded','true');
 await page.getByRole('link',{name:'FAQ'}).tap();
 await expect(page).toHaveURL(/\/faq$/);
 await context.close();
});

test('core routes reflow without horizontal document overflow',async({page})=>{
 for(const width of [320,375,390,768,1024,1280]){
  await page.setViewportSize({width,height:800});
  for(const route of ['/','/plan','/contact']){
   await page.goto(route);
   expect(await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth})),`${route} at ${width}px`).toEqual({client:width,scroll:width});
  }
 }
});
