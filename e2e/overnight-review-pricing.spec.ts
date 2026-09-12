import {expect,test} from '@playwright/test';
import {PLANNING_KEY} from '../app/lib/planning-state.ts';

test('12G-BUS-01: rabbit-only Overnight stays unpriced through direct use, restore, copy and print',async({page})=>{
 await page.setExtraHTTPHeaders({'cf-connecting-ip':'2001:db8::1201'});
 await page.goto('/rates');await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');
 await page.getByRole('combobox',{name:'Pet type',exact:true}).selectOption('rabbit');await page.getByLabel('What care do you need?').selectOption('overnight');
 await page.locator('.estimate-fields').getByLabel('Service ZIP').fill('95821');
 await page.getByLabel('First service date').fill('2099-01-02');await page.getByLabel('Checkout date').fill('2099-01-03');
 const result=page.locator('.estimate-result');await expect(result).toContainText('Personalized review required');await expect(result).not.toContainText('$');
 await page.getByLabel('How many pets need this service?').fill('2');await page.getByRole('combobox',{name:'Pet type',exact:true}).nth(1).selectOption('rabbit');await expect(result).not.toContainText('$');
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(value:string)=>{document.documentElement.dataset.bus01Copy=value}}});window.print=()=>{document.documentElement.dataset.bus01Print='true'}});
 await page.getByRole('button',{name:'Copy summary',exact:true}).click();const copy=await page.locator('html').getAttribute('data-bus01-copy');expect(copy).toContain('Personalized review required');expect(copy).toContain('Rabbit, Rabbit');expect(copy).not.toContain('$');
 await page.getByRole('button',{name:'Print',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-bus01-print','true');await page.emulateMedia({media:'print'});await expect(page.locator('.care-plan-summary')).not.toContainText('$');await page.emulateMedia({media:'screen'});
 const stored=await page.evaluate(key=>sessionStorage.getItem(key)||'',PLANNING_KEY);expect(stored).not.toMatch(/2099|reviewReasons|small-animal-overnight/);
 await page.reload();await expect(page.locator('.advanced-estimator')).toHaveAttribute('aria-busy','false');await page.getByLabel('First service date').fill('2099-01-02');await page.getByLabel('Checkout date').fill('2099-01-03');await page.getByRole('button',{name:'Confirm restored selections and care needs'}).click();await expect(result).not.toContainText('$');
 for(const box of await page.getByRole('combobox',{name:'Pet type',exact:true}).all())await expect(box).toHaveValue('rabbit');
});
