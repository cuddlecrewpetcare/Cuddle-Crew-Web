import AxeBuilder from '@axe-core/playwright';
import {expect,test} from '@playwright/test';

test('gallery renders every photo in named owner and client groups with uniform focal frames',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/gallery');
 await expect(page.getByRole('heading',{name:'Lauren’s pets'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Client pets'})).toBeVisible();
 await expect(page.getByText(/All client pet photos shown on this site are shared with written permission/)).toBeVisible();
 const cards=page.locator('.gallery-card');
 await expect(cards).toHaveCount(15);
 const frames=await page.locator('.gallery-frame').evaluateAll(elements=>elements.map(element=>{const box=element.getBoundingClientRect();const image=element.querySelector('img')!;return {ratio:Math.round((box.width/box.height)*1000)/1000,objectFit:getComputedStyle(image).objectFit,objectPosition:getComputedStyle(image).objectPosition,alt:image.getAttribute('alt'),loading:image.getAttribute('loading')}}));
 expect(new Set(frames.map(frame=>frame.ratio)).size).toBe(1);
 expect(frames.every(frame=>Math.abs(frame.ratio-.75)<=.002)).toBe(true);
 expect(frames.every(frame=>frame.objectFit==='cover'&&frame.objectPosition&&frame.alt&&frame.loading==='lazy')).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
});

test('gallery dialog opens by keyboard, closes with Escape, and restores focus',async({page})=>{
 await page.goto('/gallery');
 const trigger=page.getByRole('button',{name:/View larger: Blu, a blue merle Australian shepherd/});
 await trigger.focus();
 await page.keyboard.press('Enter');
 const dialog=page.getByRole('dialog',{name:'Enlarged pet photo'});
 await expect(dialog).toBeVisible();
 await expect(dialog.getByRole('button',{name:'Close enlarged photo'})).toBeFocused();
 await expect(dialog.locator('img')).toHaveAttribute('alt',/Blu, a blue merle Australian shepherd/);
 await page.keyboard.press('Tab');
 await expect(dialog.getByRole('button',{name:'Close enlarged photo'})).toBeFocused();
 await page.keyboard.press('Shift+Tab');
 await expect(dialog.getByRole('button',{name:'Close enlarged photo'})).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(dialog).not.toBeVisible();
 await expect(trigger).toBeFocused();
});

test('mobile touch gallery and dialog remain usable without overflow',async({browser})=>{
 const context=await browser.newContext({hasTouch:true,isMobile:true,viewport:{width:390,height:844}});
 const page=await context.newPage();
 await page.goto('/gallery');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 const columns=await page.locator('.gallery-grid').first().evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(' ').length);
 expect(columns).toBe(2);
 await page.locator('.gallery-card').first().tap();
 const dialog=page.getByRole('dialog',{name:'Enlarged pet photo'});
 await expect(dialog).toBeVisible();
 expect(await dialog.evaluate(element=>element.getBoundingClientRect().width<=window.innerWidth)).toBe(true);
 const results=await new AxeBuilder({page}).include('.gallery-dialog').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
 expect(results.violations).toEqual([]);
 await dialog.getByRole('button',{name:'Close enlarged photo'}).tap();
 await expect(dialog).not.toBeVisible();
 await expect(page.locator('.gallery-card').first()).toBeFocused();
 await context.close();
});
