import {expect,test,type Page} from '@playwright/test';
import {PLANNING_KEY} from '../app/lib/planning-state.ts';

async function ready(page:Page){await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false')}
async function dates(page:Page){await page.getByLabel('First service date').fill('2099-01-02');await page.getByLabel('Checkout date').fill('2099-01-03')}
async function seed(page:Page,petTypes:string[],extra:Record<string,unknown>={}){
 await page.goto('/rates');await ready(page);
 await page.evaluate(({key,petTypes,extra})=>sessionStorage.setItem(key,JSON.stringify({schemaVersion:2,petTypes,service:'overnight',blocks:[],midday:'none',zip:'95821',travelTier:'standard',...extra})),{key:PLANNING_KEY,petTypes,extra});
 await page.reload();await ready(page);
}
async function blocked(page:Page){
 await expect(page.locator('.estimate-result')).toContainText('Personalized review required for this daytime Dog Walk selection.');
 await expect(page.locator('.estimate-result')).not.toContainText('$');
 await expect(page.getByRole('button',{name:'Copy summary',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Print',exact:true})).toHaveCount(0);
 await expect(page.locator('.care-plan-summary')).toHaveCount(0);
 await expect(page.locator('.estimate-result').locator('..').getByRole('status')).not.toContainText('$');
}

for(const petTypes of [['cat'],['dog','cat']])test(`12G-EST-02: ${petTypes.join('+')} Overnight walk choices preserve roster and block stale output through restoration`,async({page})=>{
 await seed(page,petTypes);await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();await dates(page);
 await expect(page.locator('.estimate-result')).toContainText(petTypes.length===1?'$80':'$90');
 for(const minutes of [30,60,90]){
  await page.getByRole('radio',{name:`${minutes}-minute dog walk`,exact:true}).check();await blocked(page);
  for(const [index,type] of petTypes.entries())await expect(page.getByRole('combobox',{name:'Pet type',exact:true}).nth(index)).toHaveValue(type);
 }
 await expect.poll(()=>page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)||'{}').midday,PLANNING_KEY)).toBe('walk90');
 await page.reload();await ready(page);await dates(page);
 await expect(page.getByRole('button',{name:'Confirm restored selections and care needs'})).toBeVisible();await blocked(page);
 await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();await blocked(page);
 await page.emulateMedia({media:'print'});await blocked(page);await page.emulateMedia({media:'screen'});
 await page.getByRole('radio',{name:'30-minute midday care',exact:true}).check();await expect(page.locator('.estimate-result')).toContainText(petTypes.length===1?'$103':'$120');
 await page.getByRole('radio',{name:'30-minute dog walk',exact:true}).check();await blocked(page);
 await page.getByLabel('What care do you need?').selectOption('drop30');
 await page.getByLabel('9 AM–12 PM',{exact:true}).check();await expect(page.locator('.estimate-result')).toContainText(petTypes.length===1?'$56':'$70');
 await page.getByLabel('What care do you need?').selectOption('overnight');await expect(page.getByRole('radio',{name:'No daytime add-on',exact:true})).toBeChecked();
 await expect(page.locator('.estimate-result')).toContainText(petTypes.length===1?'$80':'$90');
 for(const [index,type] of petTypes.entries())await expect(page.getByRole('combobox',{name:'Pet type',exact:true}).nth(index)).toHaveValue(type);
});

test('12G-EST-02: all-dog Overnight prices remain usable and changing the roster blocks the selected walk',async({page})=>{
 await seed(page,['dog']);await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();await dates(page);
 for(const [minutes,total] of [[30,117],[60,135],[90,153]]){
  await page.getByRole('radio',{name:`${minutes}-minute dog walk`,exact:true}).check();await expect(page.locator('.estimate-result')).toContainText(`$${total}`);
 }
 await page.getByLabel('How many pets need this service?').fill('2');await blocked(page);
 await expect(page.getByRole('combobox',{name:'Pet type',exact:true}).nth(0)).toHaveValue('dog');await expect(page.getByRole('combobox',{name:'Pet type',exact:true}).nth(1)).toHaveValue('cat');
 await page.getByRole('combobox',{name:'Pet type',exact:true}).nth(1).selectOption('dog');await expect(page.locator('.estimate-result')).toContainText('$173');
 await page.getByRole('combobox',{name:'Pet type',exact:true}).nth(0).selectOption('cat');await blocked(page);
});

test('12G-EST-02: restored effective Planner coverage ignores raw walks and retains opaque review',async({page})=>{
 for(const blocks of [[],[1]]){
  await seed(page,['cat'],{midday:'walk30',blocks,planner:{reviewRequired:false,incomplete:false,overnightDuration:30}});
  await dates(page);await expect(page.getByRole('button',{name:'Copy summary',exact:true})).toHaveCount(0);
  await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();await expect(page.locator('.estimate-result')).toContainText(blocks.length?'$103':'$80');
  await expect(page.locator('.planner-coverage')).toContainText(blocks.length?'Separate 30-minute daytime care':'No separate daytime care selected.');
  await expect(page.locator('.estimate-result')).not.toContainText('Dog Walk selection');
 }
 await seed(page,['dog','cat'],{midday:'walk60',blocks:[1],reviewRequired:true,planner:{reviewRequired:true,incomplete:false,overnightDuration:30}});
 await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();await dates(page);
 await expect(page.locator('.estimate-result')).toContainText('Service and pricing need confirmation');await expect(page.locator('.estimate-result')).not.toContainText('$');
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(value:string)=>{document.documentElement.dataset.compatibilityCopy=value}}});window.print=()=>{document.documentElement.dataset.compatibilityPrint='true'}});
 await page.getByRole('button',{name:'Copy summary',exact:true}).click();const summary=await page.locator('html').getAttribute('data-compatibility-copy');
 expect(summary).toContain('Personalized review required');expect(summary).toContain('Dog, Cat');expect(summary).not.toMatch(/\$|walk60|reviewReasons|insurance|competence/);
 await page.getByRole('button',{name:'Print',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-compatibility-print','true');
 await page.emulateMedia({media:'print'});await expect(page.locator('.care-plan-summary')).toContainText('Personalized review required');await expect(page.locator('.care-plan-summary')).not.toContainText('$');
});
