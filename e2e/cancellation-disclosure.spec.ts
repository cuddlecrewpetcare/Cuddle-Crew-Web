import {expect,test} from '@playwright/test';

test('12G-POL-01: rendered cancellation FAQ preserves every approved deadline and outcome without narrow-screen overflow',async({page})=>{
 await page.setViewportSize({width:320,height:900});
 await page.goto('/faq');
 await page.getByLabel('Search questions').fill('cancellation');
 await expect(page.getByRole('status')).toHaveText('1 question found');
 await page.getByText('What is the cancellation policy?',{exact:true}).click();
 const answer=page.locator('details').filter({has:page.getByText('What is the cancellation policy?',{exact:true})});
 for(const phrase of [
  'Written cancellation and booking-change requests are received when Cuddle Crew receives them',
  'Daytime service, including 3–8 hour Continuous Care: at least 24 hours before service has no cancellation fee and any amount paid is refunded or credited; less than 24 hours may be charged 50%; after Cuddle Crew has departed for or arrived at the service location, or after service begins, may be charged 100%',
  'Short Overnight, 24-Hour Continuous Care, and other multi-day vacation care under seven consecutive nights or 24-hour periods: at least 72 hours before the first service receives a full refund or credit; less than 72 hours but at least 24 hours may be charged 50%; less than 24 hours may be charged 100%',
  'Extended bookings of seven or more consecutive nights or 24-hour periods: at least seven days before the first service receives a full refund or credit; less than seven days but at least 72 hours may be charged 50%; less than 72 hours may be charged 100%',
  'Holiday or designated peak-date daytime service, including 3–8 hour Continuous Care: at least seven days receives a full refund or credit; less than seven days but at least 72 hours may be charged 50%; less than 72 hours may be charged 100%',
  'Holiday or designated peak-date Overnight and 24-Hour Continuous Care: at least 14 days receives a full refund or credit; less than 14 days but at least seven days may be charged 50%; less than seven days may be charged 100%',
  'Applicable holiday or peak-date treatment is identified before the affected booking is confirmed',
  'For genuine emergencies and unforeseen circumstances, Cuddle Crew may, at its discretion, reduce or waive a charge, issue a service credit, or provide another reasonable accommodation; an exception is not guaranteed',
  'Different booking-specific cancellation terms for an unusually long, high-value, or capacity-intensive booking apply only when disclosed and accepted before confirmation'
 ])await expect(answer).toContainText(phrase);
 await expect(answer).toContainText('The signed policy controls.');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
});
