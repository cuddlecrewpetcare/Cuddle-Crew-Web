import {expect,test,type Page} from '@playwright/test';
import {PLANNING_KEY} from '../app/lib/planning-state.ts';

const moneyFields=['total','serviceSubtotal','base','petFee','holidayFee','potentialShortFee','travelFee','addOn'];
async function dates(page:Page){
 await page.getByLabel('First service date').fill('2099-01-02');
 await page.getByLabel('Last service date').fill('2099-01-02');
}
async function review(page:Page){
 await expect(page.locator('.estimate-result')).toContainText('Service and pricing need confirmation');
 await expect(page.locator('.estimate-result')).not.toContainText('$');
 await expect(page.locator('.care-plan-summary')).toContainText('Personalized review required');
}
async function copyAndPrint(page:Page){
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(value:string)=>{document.documentElement.dataset.speciesCopy=value}}});window.print=()=>{document.documentElement.dataset.speciesPrint='true'}});
 await page.getByRole('button',{name:'Copy summary',exact:true}).click();
 const summary=await page.locator('html').getAttribute('data-species-copy');
 expect(summary).toContain('Personalized review required');expect(summary).not.toContain('$');expect(summary).not.toMatch(/unusual-species|competence|insurance|reviewReasons/);
 await page.getByRole('button',{name:'Print',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-species-print','true');
 await page.emulateMedia({media:'print'});await review(page);await page.emulateMedia({media:'screen'});
}

for(const type of ['bird','fish','small'])test(`12G-BUS-02: ${type} alone and with a cat stays noncalculable through restoration and copy/print`,async({page})=>{
 await page.addInitScript(()=>{window.addEventListener('cuddlecrew:public-event',event=>{document.documentElement.dataset.speciesAnalytics=JSON.stringify((event as CustomEvent).detail)})});
 for(const petTypes of [[type],['cat',type]]){
  await page.goto('/rates');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');
  await page.getByRole('button',{name:'Clear saved estimate and reset'}).click();
  await page.evaluate(({key,types})=>sessionStorage.setItem(key,JSON.stringify(types.length===1?{schemaVersion:2,petTypes:[],blocks:[],zip:'95821',travelTier:'standard'}:{schemaVersion:2,petTypes:types,service:'drop30',blocks:[0],midday:'none',zip:'95821',travelTier:'standard'})),{key:PLANNING_KEY,types:petTypes});
  await page.reload();await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');
  if(petTypes.length===1){await page.getByRole('combobox',{name:'Pet type',exact:true}).selectOption(type);await page.getByLabel('9 AM–12 PM',{exact:true}).check()}
  else await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();
  const response=page.waitForResponse(response=>response.url().endsWith('/api/estimate')&&response.request().method()==='POST');
  await dates(page);const api=await response;expect(api.request().postDataJSON().pets.map((pet:{type:string})=>pet.type)).toEqual(petTypes);
  const body=await api.json();expect(body.result.reviewRequired).toBe(true);for(const field of moneyFields)expect(body.result[field],field).toBeNull();expect(body.result).not.toHaveProperty('reviewReasons');await review(page);
  const stored=await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)||'{}'),PLANNING_KEY);expect(stored.petTypes).toEqual(petTypes);expect(stored.reviewRequired).toBe(true);expect(JSON.stringify(stored)).not.toMatch(/unusual-species|competence|insurance|reviewReasons|2099/);
  const analytics=await page.locator('html').getAttribute('data-species-analytics');expect(analytics).toContain('estimator_started');expect(analytics).not.toMatch(/bird|fish|small|petTypes|reason|competence|insurance|2099/);expect(page.url()).not.toMatch(/reviewReasons|competence|insurance|2099/);
  await page.reload();await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await expect(page.getByRole('button',{name:'Copy summary',exact:true})).toHaveCount(0);
  await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();await dates(page);await review(page);
  for(const [index,pet] of petTypes.entries())await expect(page.getByRole('combobox',{name:'Pet type',exact:true}).nth(index)).toHaveValue(pet);
  await copyAndPrint(page);
 }
});

test('12G-BUS-02: Other pets retains neutral review after Planner reconfirmation and exact handoff',async({page})=>{
 await page.goto('/plan');await page.getByRole('button',{name:'Clear saved planner progress and reset'}).click();
 await page.getByLabel('Dogs',{exact:true}).fill('0');await page.getByLabel('Cats',{exact:true}).fill('1');await page.getByLabel('Other pets',{exact:true}).fill('1');
 await page.getByLabel(/Shortest maximum time/).fill('24');await page.getByLabel(/Longest stated bathroom/).fill('24');await page.getByLabel('Can the full routine safely fit in one visit?').selectOption('30');
 await expect(page.getByRole('heading',{name:'Personalized review required'})).toBeVisible();await expect(page.locator('.planner-result')).not.toContainText('other accepted');
 await page.reload();await page.getByLabel('Medication timing').selectOption('none');await page.getByLabel('Behavior or safety consideration').selectOption('none');await page.getByLabel('Routine complexity').selectOption('simple');await page.getByLabel('Separation requirements').selectOption('none');await page.getByRole('checkbox',{name:/I have checked the restored selections/}).check();
 await expect(page.getByRole('heading',{name:'Personalized review required'})).toBeVisible();
 const href=await page.getByRole('link',{name:'Price this starting point'}).getAttribute('href');expect(href).toContain('cats=1');expect(href).toContain('otherPets=1');expect(href).toContain('review=1');expect(href).not.toMatch(/species|competence|insurance|reason/);
 await page.getByRole('link',{name:'Price this starting point'}).click();await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await dates(page);await page.locator('.estimate-fields').getByLabel('Service ZIP').fill('95821');await review(page);
 await expect(page.getByRole('combobox',{name:'Pet type',exact:true}).nth(0)).toHaveValue('cat');await expect(page.getByRole('combobox',{name:'Pet type',exact:true}).nth(1)).toHaveValue('small');await copyAndPrint(page);
});

test('12G-BUS-02: small-animal FAQ qualifies ordinary prices and grouped husbandry',async({page})=>{
 await page.goto('/faq');await page.getByText('How are small animals priced?',{exact:true}).click();const answer=page.locator('details').filter({has:page.getByText('How are small animals priced?',{exact:true})});
 await expect(answer).toContainText('where appropriate');await expect(answer).toContainText('personalized review');await expect(answer).toContainText('husbandry workload');await expect(answer).not.toContainText('per typical tank');await expect(answer).not.toContainText('Each additional rabbit, bird, tank');
 await expect(answer).toContainText('$28 for 30 minutes');await expect(answer).toContainText('$45 for 60 minutes');await expect(answer).toContainText('+$5 where appropriate');
});

for(const type of ['bird','fish','small','cat'])test(`12G-BUS-02: primary Dog Walk preserves the ${type} roster through service changes and restoration`,async({page})=>{
 await page.goto('/rates');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');
 await page.evaluate(({key,type})=>sessionStorage.setItem(key,JSON.stringify({schemaVersion:2,petTypes:[type],service:'drop30',blocks:[0],midday:'none',zip:'95821',travelTier:'standard'})),{key:PLANNING_KEY,type});
 await page.reload();await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();await dates(page);
 await expect(page.locator('.estimate-result')).toContainText(type==='cat'?'$28':'Service and pricing need confirmation');
 for(const service of ['walk30','walk60','walk90']){
  await page.getByLabel('What care do you need?').selectOption(service);
  await expect(page.getByRole('combobox',{name:'Pet type',exact:true})).toHaveValue(type);await expect(page.getByRole('combobox',{name:'Pet type',exact:true})).toBeEnabled();
  await expect(page.locator('.estimate-result')).toContainText('Dog walks can only be estimated for dogs.');await expect(page.locator('.estimate-result')).not.toContainText('$');
 }
 await expect.poll(()=>page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)||'{}').petTypes,PLANNING_KEY)).toEqual([type]);
 await page.reload();await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();await dates(page);
 await expect(page.getByRole('combobox',{name:'Pet type',exact:true})).toHaveValue(type);await expect(page.locator('.estimate-result')).toContainText('Dog walks can only be estimated for dogs.');await expect(page.getByRole('button',{name:'Copy summary',exact:true})).toHaveCount(0);
 await page.getByLabel('What care do you need?').selectOption('drop30');await expect(page.locator('.estimate-result')).toContainText(type==='cat'?'$28':'Service and pricing need confirmation');
});
