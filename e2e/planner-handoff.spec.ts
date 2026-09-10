import {expect,test,type Page} from '@playwright/test';

import {PLANNING_KEY} from '../app/lib/planning-state.ts';
const labels=['9 AM–12 PM','12–3 PM','3–6 PM','6–9 PM'];
async function prepare(page:Page,options:{dogs?:number;cats?:number;otherPets?:number;windows?:number[];overnight?:boolean}={}){
 await page.goto('/plan');
 await page.getByRole('button',{name:'Clear saved planner progress and reset'}).click();
 await page.getByLabel('Dogs',{exact:true}).fill(String(options.dogs??1));
 await page.getByLabel('Cats',{exact:true}).fill(String(options.cats??0));
 await page.getByLabel('Other accepted pets',{exact:true}).fill(String(options.otherPets??0));
 await page.getByLabel(/Shortest maximum time/).fill('24');
 await page.getByLabel(/Longest stated bathroom/).fill('24');
 await page.getByLabel('Can the full routine safely fit in one visit?').selectOption('30');
 for(const [index,label] of labels.entries())await page.getByRole('checkbox',{name:label,exact:true}).setChecked((options.windows??[0,2]).includes(index));
 await page.getByRole('checkbox',{name:/Overnight care/}).setChecked(options.overnight??false);
 await page.evaluate(storageKey=>{const state=JSON.parse(sessionStorage.getItem(storageKey)||'{}');sessionStorage.setItem(storageKey,JSON.stringify({...state,zip:'95821',travelTier:'standard'}))},PLANNING_KEY);
}
async function price(page:Page,overnight=false){
 await page.getByRole('link',{name:'Price this starting point'}).click();
 await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');
 await dates(page,overnight);
}
async function dates(page:Page,overnight=false){
 await page.getByLabel('First service date').fill('2099-01-02');
 await page.getByLabel(overnight?'Checkout date':'Last service date').fill(overnight?'2099-01-03':'2099-01-02');
}
async function copyAndPrint(page:Page){
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(value:string)=>{document.documentElement.dataset.copiedSummary=value}}});window.print=()=>{document.documentElement.dataset.printed='true'}});
 await page.getByRole('button',{name:'Copy summary',exact:true}).click();
 const summary=await page.locator('html').getAttribute('data-copied-summary');
 await page.getByRole('button',{name:'Print',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('data-printed','true');
 await page.emulateMedia({media:'print'});
 await expect(page.locator('.estimate-result')).toBeVisible();
 return summary||'';
}

test('12G-CARE-02: reviewed Planner safety result survives API, session, copy and print',async({page})=>{
 await prepare(page);
 await page.getByLabel('Medication timing').selectOption('complex');
 await page.getByLabel('Behavior or safety consideration').selectOption('aggressive');
 await page.getByLabel(/Shortest maximum time/).fill('2');
 await page.getByLabel(/Longest stated bathroom/).fill('2');
 await expect(page.getByRole('heading',{name:'Personalized review required'})).toBeVisible();
 const href=await page.getByRole('link',{name:'Price this starting point'}).getAttribute('href');expect(href).toContain('review=1');expect(href).not.toMatch(/medication|complex|aggress|behavior|reason|limit/);
 const response=page.waitForResponse(response=>response.url().endsWith('/api/estimate')&&response.request().method()==='POST');
 await price(page);
 const api=await response;const payload=api.request().postDataJSON();expect(payload.planner).toEqual({reviewRequired:true,incomplete:false});expect(JSON.stringify(payload)).not.toMatch(/medication|aggress|behavior|reason/);
 const body=await api.json();expect(body.result.reviewRequired).toBe(true);expect(body.result.total).toBeNull();expect(body.result.serviceSubtotal).toBeNull();expect(body.result).not.toHaveProperty('reviewReasons');
 await expect(page.locator('.estimate-result')).toContainText('Personalized review required');await expect(page.locator('.estimate-result')).not.toContainText('$60');
 const stored=await page.evaluate(storageKey=>sessionStorage.getItem(storageKey),PLANNING_KEY);expect(stored).toContain('"reviewRequired":true');expect(stored).not.toMatch(/medication|aggress|behavior|reason|2099/);
 await page.goto('/rates#estimate');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await dates(page);
 await expect(page.locator('.estimate-result')).toContainText('Service and pricing need confirmation');
 const summary=await copyAndPrint(page);expect(summary).toContain('Personalized review required');expect(summary).not.toContain('$');expect(summary).not.toMatch(/medication|aggress|behavior|reason/);
 await expect(page.locator('.care-plan-summary')).toContainText('Personalized review required');
});

test('12G-XF-01: explicit Overnight plus 30-minute midday coverage prices and restores at $110',async({page})=>{
 await prepare(page,{overnight:true,windows:[1]});await price(page,true);
 await expect(page.getByLabel('What care do you need?')).toHaveValue('overnight');
 await expect(page.locator('.estimate-result')).toContainText('$110');await expect(page.locator('.planner-coverage')).toContainText('Separate 30-minute daytime care');await expect(page.locator('.planner-coverage')).toContainText('12–3 PM');
 await expect(page.locator('.estimate-result')).toContainText('Daytime add-on: $25 × 1');
 await page.goto('/rates#estimate');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await dates(page,true);await expect(page.locator('.estimate-result')).toContainText('$110');
 const summary=await copyAndPrint(page);expect(summary).toContain('$110');expect(summary).toContain('Standard Overnight');expect(summary).toContain('Separate 30-minute daytime care');expect(summary).toContain('12–3 PM');
 await expect(page.locator('.care-plan-summary')).toContainText('12–3 PM');await expect(page.locator('.care-plan-summary')).toContainText('approximately 6.5 hours');await expect(page.locator('.care-plan-summary')).not.toContainText('approximately 10 hours');
});

test('12G-XF-01: multiple or overlapping selected coverage stays visible without a fabricated price',async({page})=>{
 for(const windows of [[0,1],[3]]){
  await prepare(page,{overnight:true,windows});await price(page,true);
  await expect(page.getByLabel('What care do you need?')).toHaveValue('overnight');await expect(page.locator('.estimate-result')).toContainText('Service and pricing need confirmation');await expect(page.locator('.estimate-result')).not.toContainText('$');
  for(const index of windows)await expect(page.locator('.planner-coverage')).toContainText(labels[index]);
  await page.goto('/rates#estimate');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await dates(page,true);await expect(page.locator('.estimate-result')).not.toContainText('$');
  const summary=await copyAndPrint(page);expect(summary).toContain('Personalized review required');for(const index of windows)expect(summary).toContain(labels[index]);expect(summary).not.toContain('$');await page.emulateMedia({media:'screen'});
 }
});

test('12G-XF-02: known mixed households retain exact broad types and appropriate prices',async({page})=>{
 for(const sample of [{dogs:2,cats:1,otherPets:0,types:['dog','dog','cat'],subtotal:'$90',review:false},{dogs:0,cats:1,otherPets:1,types:['cat','small'],subtotal:'$66',review:true}]){
  await prepare(page,sample);await price(page);
  const selects=page.getByRole('combobox',{name:'Pet type',exact:true});await expect(selects).toHaveCount(sample.types.length);for(const [index,type] of sample.types.entries())await expect(selects.nth(index)).toHaveValue(type);
  await expect(page.locator('.estimate-result')).toContainText(sample.subtotal);await expect(page.locator('#estimate-result-title')).toHaveText(sample.review?'Personalized review required':'Preliminary estimate');
  const stored=await page.evaluate(storageKey=>JSON.parse(sessionStorage.getItem(storageKey)||'{}'),PLANNING_KEY);expect(stored.petTypes).toEqual(sample.types);
  await page.goto('/rates#estimate');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');for(const [index,type] of sample.types.entries())await expect(page.getByRole('combobox',{name:'Pet type',exact:true}).nth(index)).toHaveValue(type);
 }
});

test('12G-XF-03: a saved walk90 cannot contaminate a new Overnight with explicitly empty coverage',async({page})=>{
 await page.goto('/rates');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await page.getByLabel('What care do you need?').selectOption('overnight');await page.getByRole('radio',{name:'90-minute dog walk',exact:true}).check();
 await expect.poll(()=>page.evaluate(storageKey=>JSON.parse(sessionStorage.getItem(storageKey)||'{}').midday,PLANNING_KEY)).toBe('walk90');
 await prepare(page,{overnight:true,windows:[]});await price(page,true);
 await expect(page.locator('.estimate-result')).toContainText('$85');await expect(page.locator('.estimate-result')).not.toContainText('$153');await expect(page.locator('.estimate-result')).not.toContainText('Daytime add-on:');await expect(page.locator('.planner-coverage')).toContainText('No separate daytime care selected');await expect(page.locator('.estimate-fields').getByLabel('Service ZIP')).toHaveValue('95821');
 const stored=await page.evaluate(storageKey=>JSON.parse(sessionStorage.getItem(storageKey)||'{}'),PLANNING_KEY);expect(stored.midday).toBe('none');expect(stored.blocks).toEqual([]);expect(stored.travelTier).toBe('standard');
 await page.goto('/rates#estimate');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await dates(page,true);await expect(page.locator('.estimate-result')).toContainText('$85');
});

test('legacy mixed and fractional handoffs stay incomplete across reload and reset clears review',async({page})=>{
 for(const search of ['planner=1&pets=3&household=Mixed-pet+household&duration=30&windows=1','planner=1&pets=2.5&household=Dog&duration=30&windows=1']){
  await page.goto(`/rates?${search}#estimate`);await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await expect(page.locator('.planner-incomplete')).toContainText('Personalized review required');await expect(page.getByRole('combobox',{name:'Pet type',exact:true})).toHaveCount(0);
  await dates(page);await page.locator('.estimate-fields').getByLabel('Service ZIP').fill('95821');await expect(page.locator('.estimate-result')).toContainText('Confirm household and care selections');await expect(page.locator('.estimate-result')).not.toContainText('$');
  await page.goto('/rates#estimate');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await expect(page.getByRole('combobox',{name:'Pet type',exact:true})).toHaveCount(0);await expect(page.locator('.planner-incomplete')).toContainText('Personalized review required');
  await page.getByRole('button',{name:'Clear saved estimate and reset'}).click();await expect(page.locator('.planner-incomplete')).toHaveCount(0);await expect(page.getByRole('combobox',{name:'Pet type',exact:true})).toHaveValue('dog');await page.reload();await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await expect(page.locator('.planner-incomplete')).toHaveCount(0);await expect(page.getByRole('combobox',{name:'Pet type',exact:true})).toHaveValue('dog');
 }
});
