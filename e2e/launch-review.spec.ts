import {expect,test} from '@playwright/test';

const publicRoutes=['/','/start','/plan','/holidays','/choosing-care','/safety','/credentials','/faq','/contact','/privacy','/terms'];

test('all public routes, metadata routes, legacy redirects, and 404 return expected status',async({request})=>{
  for(const route of publicRoutes)expect((await request.get(route)).status(),route).toBe(200);
  expect((await request.get('/robots.txt')).status()).toBe(200);
  expect((await request.get('/sitemap.xml')).status()).toBe(200);
  expect((await request.get('/definitely-not-a-route')).status()).toBe(404);
  for(const [route,target] of [['/services','/#services'],['/rates','/#estimate'],['/service-area','/#area'],['/about','/credentials']] as const){const response=await request.get(route,{maxRedirects:0});expect(response.status(),route).toBe(308);expect(response.headers().location).toBe(`https://www.cuddlecrewpetcare.com${target}`)}
  expect((await request.post('/api/health')).status()).toBe(405);
  expect((await request.get('/api/contact')).status()).toBe(405);
});

test('launch pages retain landmarks, headings, links, and progressive public content',async({page})=>{
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
  await expect(page.getByRole('link',{name:'Skip to main content'})).toHaveAttribute('href','#main-content');
  await expect(page.getByRole('link',{name:'New client registration'}).first()).toHaveAttribute('href','https://cuddlecrewpetcare.petssl.com/account');
  await expect(page.getByText('Care for the time the routine needs.')).toBeVisible();
  await expect(page.getByText('$30').first()).toBeVisible();
  await expect(page.getByText('$48').first()).toBeVisible();
  await expect(page.getByText('$32').first()).toBeVisible();
  await expect(page.getByText('$50').first()).toBeVisible();
  await expect(page.getByText('$66').first()).toBeVisible();
  await expect(page.getByText('$68').first()).toBeVisible();
  await expect(page.getByText('$85').first()).toBeVisible();
  await expect(page.getByText('$80').first()).toBeVisible();
  await expect(page.locator('.estimate-fields')).toBeVisible();
  await page.getByLabel('First service date').fill('2099-01-02');
  await page.getByLabel('Last service date').fill('2099-01-02');
  await page.getByLabel('9 AM–12 PM').check();
  await page.locator('.estimate-fields').getByLabel('Service ZIP').fill('95821');
  await expect(page.getByText('Personalized review required').first()).toBeVisible();
});

test('mobile, 200 percent zoom, keyboard, and reduced-motion paths avoid horizontal overflow',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  // A 640 CSS-pixel viewport at 200% zoom exercises the WCAG 320-pixel
  // reflow equivalent without accidentally combining 320px and 200% (160px).
  await page.setViewportSize({width:640,height:700});
  await page.goto('/plan');
  await page.evaluate(()=>{document.documentElement.style.zoom='2'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to main content'})).toBeFocused();
  await page.goto('/contact');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
  await expect(page.getByLabel(/Your name/)).toBeEditable();
  await expect(page.getByLabel(/Your email/)).toHaveAttribute('type','email');
});
