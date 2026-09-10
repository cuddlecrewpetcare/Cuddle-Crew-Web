import AxeBuilder from '@axe-core/playwright';
import {expect,test,type Page} from '@playwright/test';
import {CARE_PLANNER_PROGRESS_KEY as plannerKey} from '../app/lib/care-planner-progress.ts';
import {PLANNING_KEY as estimateKey} from '../app/lib/planning-state.ts';
const confirmLabel='I have checked the restored selections and selected all tasks needed during care.';
async function safePlanner(page:Page){await page.goto('/plan');await page.getByRole('button',{name:'Clear saved planner progress and reset'}).click();await page.getByLabel('Shortest maximum').fill('24');await page.getByLabel('Longest stated').fill('24');await page.getByLabel('Can the full routine').selectOption('30');}
async function careAnswers(page:Page){await page.getByLabel('Medication timing').selectOption('none');await page.getByLabel('Behavior or safety').selectOption('none');await page.getByLabel('Routine complexity').selectOption('simple');await page.getByLabel('Separation requirements').selectOption('none');await page.getByLabel('Feeding and fresh water',{exact:true}).check();await page.getByRole('checkbox',{name:confirmLabel,exact:true}).check();}
async function locationOnly(page:Page){await page.goto('/service-area');await page.evaluate(key=>sessionStorage.setItem(key,JSON.stringify({schemaVersion:2,petTypes:[],blocks:[],zip:'95821',travelTier:'standard'})),estimateKey);}
async function dates(page:Page){await page.getByLabel('First service date').fill('2099-01-02');await page.getByLabel('Last service date').fill('2099-01-02');}

test('12G-CARE-03: omitted safety answers and tasks require explicit re-entry after every refresh',async({page})=>{
 for(const [label,value] of [['Medication timing','timed'],['Behavior or safety consideration','aggressive'],['Routine complexity','complex'],['Separation requirements','handling']]){
  await safePlanner(page);await page.getByLabel(label).selectOption(value);await expect(page.locator('.planner-result h2')).toHaveText('Personalized review required');await expect.poll(()=>page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)||'{}').visitFit,plannerKey)).toBe('30');
  const stored=await page.evaluate(key=>sessionStorage.getItem(key),plannerKey);expect(stored).not.toMatch(/medication|behavior|complexity|separation|task|aggress|timed|handling/);
  await page.reload();await expect(page.getByLabel('Can the full routine')).toHaveValue('30');for(const field of ['Medication timing','Behavior or safety consideration','Routine complexity','Separation requirements'])await expect(page.getByLabel(field)).toHaveValue('');await expect(page.getByLabel('Feeding and fresh water',{exact:true})).not.toBeChecked();
  await expect(page.locator('.planner-result h2')).toHaveText('Personalized review required');await expect(page.getByRole('link',{name:'Price this starting point'})).toHaveCount(0);
  await page.getByRole('checkbox',{name:confirmLabel,exact:true}).check();await expect(page.getByRole('link',{name:'Price this starting point'})).toHaveCount(0);
  await careAnswers(page);await expect(page.locator('.planner-result h2')).toHaveText('30-minute visits may be a useful starting point');await expect(page.getByRole('link',{name:'Price this starting point'})).toHaveAttribute('href',/review=0/);
 }
 await page.getByLabel('Dogs',{exact:true}).fill('4');await expect(page.locator('.planner-result h2')).toHaveText('Personalized review required');await expect(page.getByRole('link',{name:'Price this starting point'})).toHaveAttribute('href',/review=1/);
});

test('12G-CARE-03: legacy or malformed progress stays incomplete until the broad fit is entered again',async({page})=>{
 await safePlanner(page);const valid=await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)!),plannerKey);
 for(const raw of [JSON.stringify({...valid,schemaVersion:undefined}),JSON.stringify({...valid,windowIndexes:[1,'3']}),'{bad']){await page.evaluate(({key,raw})=>sessionStorage.setItem(key,raw),{key:plannerKey,raw});await page.reload();await expect(page.getByLabel('Can the full routine')).toHaveValue('unknown');await expect(page.getByRole('link',{name:'Price this starting point'})).toHaveCount(0);await careAnswers(page);await expect(page.getByRole('link',{name:'Price this starting point'})).toHaveCount(0);}
 await page.getByRole('button',{name:'Clear saved planner progress and reset'}).click();await expect.poll(()=>page.evaluate(key=>sessionStorage.getItem(key),plannerKey)).toBeNull();await expect(page.getByRole('checkbox',{name:confirmLabel,exact:true})).toHaveCount(0);
});

test('12G-STATE-01: a direct care review survives reload, reconfirmation, copy and print without private storage',async({page})=>{
 await locationOnly(page);await page.goto('/rates');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await page.getByLabel('9 AM–12 PM').check();await dates(page);await expect(page.locator('#estimate-result-title')).toHaveText('Preliminary estimate');
 const changed=page.waitForResponse(r=>r.url().endsWith('/api/estimate')&&r.request().postDataJSON().pets[0].complex===true);await page.getByLabel('Care may be unusually detailed').check();expect((await(await changed).json()).result.reviewRequired).toBe(true);
 await expect.poll(()=>page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)||'{}').reviewRequired,estimateKey)).toBe(true);const raw=await page.evaluate(key=>sessionStorage.getItem(key),estimateKey);expect(raw).not.toMatch(/complex|detail|medication|behavior|reason|2099/);
 await page.reload();await expect(page.getByRole('button',{name:'Confirm restored selections and care needs'})).toBeVisible();await dates(page);await expect(page.locator('.estimate-result')).toContainText('Review the restored selections');await expect(page.locator('.estimate-result')).not.toContainText('$');await expect(page.getByRole('button',{name:'Copy summary',exact:true})).toHaveCount(0);
 const restored=page.waitForResponse(r=>r.url().endsWith('/api/estimate'));await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();const result=(await(await restored).json()).result;expect(result.reviewRequired).toBe(true);expect(result.total).toBeNull();expect(result.serviceSubtotal).toBeNull();await expect(page.locator('.estimate-result')).not.toContainText('$');
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(value:string)=>{document.documentElement.dataset.summary=value}}});window.print=()=>{document.documentElement.dataset.printed='true'}});await page.getByRole('button',{name:'Copy summary',exact:true}).click();expect(await page.locator('html').getAttribute('data-summary')).not.toContain('$');await page.getByRole('button',{name:'Print',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-printed','true');
 await page.getByRole('button',{name:'Clear saved estimate and reset'}).click();await expect.poll(()=>page.evaluate(key=>sessionStorage.getItem(key),estimateKey)).toBeNull();await expect(page.getByLabel('Care may be unusually detailed')).not.toBeChecked();
});

test('12G-STATE-01: ordinary saved selections require confirmation and then remain usable',async({page})=>{
 await locationOnly(page);await page.goto('/rates');await page.getByLabel('9 AM–12 PM').check();await dates(page);await expect(page.locator('#estimate-result-title')).toHaveText('Preliminary estimate');await page.reload();await dates(page);await expect(page.locator('.estimate-result')).not.toContainText('$');await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();await expect(page.locator('#estimate-result-title')).toHaveText('Preliminary estimate');await expect(page.locator('.estimate-result strong')).toHaveText('$30');
});

test('12G-STATE-01: refresh cannot replay a handoff over a later care disclosure',async({page})=>{
 await locationOnly(page);await page.goto('/rates?planner=2&dogs=1&cats=0&otherPets=0&duration=30&windows=0&overnight=0&review=0#estimate');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await expect(page).toHaveURL(/\/rates#estimate$/);await page.getByLabel('Care may be unusually detailed').check();await expect.poll(()=>page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)||'{}').reviewRequired,estimateKey)).toBe(true);await page.reload();await dates(page);await expect(page.locator('.estimate-result')).not.toContainText('$');await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();await expect(page.locator('#estimate-result-title')).toHaveText('Personalized review required');await expect(page.locator('.estimate-result')).not.toContainText('$');
});


test('restored planner and estimator confirmation controls pass focused accessibility scans',async({page})=>{
 await safePlanner(page);await page.reload();await expect(page.getByRole('checkbox',{name:confirmLabel,exact:true})).toBeVisible();
 const planner=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();expect(planner.violations).toEqual([]);
 await locationOnly(page);await page.goto('/rates');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await page.reload();await expect(page.getByRole('button',{name:'Confirm restored selections and care needs'})).toBeVisible();
 const estimator=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();expect(estimator.violations).toEqual([]);
});
