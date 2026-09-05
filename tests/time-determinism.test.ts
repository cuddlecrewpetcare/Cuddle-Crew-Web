import test from 'node:test';
import assert from 'node:assert/strict';
import {business} from '../app/config/business.ts';
import {daysBetween,shortNoticeKind} from '../app/lib/business-rules.ts';
import {addCalendarDays,assertTimeZoneSupported,businessDate,calendarDayDifference,parseDateOnly,resolveWallClock} from '../app/lib/time.ts';

test('Pacific business timezone is canonical and supported by the runtime',()=>{
  assert.equal(business.timezone,'America/Los_Angeles');
  assert.equal(assertTimeZoneSupported(),true);
  assert.equal(businessDate(new Date('2026-09-06T06:59:59Z')),'2026-09-05');
  assert.equal(businessDate(new Date('2026-09-06T07:00:00Z')),'2026-09-06');
});

test('date-only arithmetic covers ordinary, month, year, leap, and DST boundaries',()=>{
  assert.deepEqual(daysBetween('2026-09-05','2026-09-07'),['2026-09-05','2026-09-06','2026-09-07']);
  assert.deepEqual(daysBetween('2026-01-31','2026-02-01'),['2026-01-31','2026-02-01']);
  assert.deepEqual(daysBetween('2026-12-31','2027-01-01'),['2026-12-31','2027-01-01']);
  assert.deepEqual(daysBetween('2028-02-28','2028-03-01'),['2028-02-28','2028-02-29','2028-03-01']);
  assert.deepEqual(daysBetween('2026-03-07','2026-03-09'),['2026-03-07','2026-03-08','2026-03-09']);
  assert.deepEqual(daysBetween('2026-10-31','2026-11-02'),['2026-10-31','2026-11-01','2026-11-02']);
  assert.equal(calendarDayDifference('2026-03-07','2026-03-09'),2);
  assert.equal(parseDateOnly('2027-02-29'),null);
});

test('same business day is distinct from less than 24 elapsed hours',()=>{
  assert.equal(shortNoticeKind('2026-09-06',9,new Date('2026-09-06T06:50:00Z')),'short-notice');
  assert.equal(shortNoticeKind('2026-09-05',18,new Date('2026-09-05T07:05:00Z')),'same-day');
  assert.equal(shortNoticeKind('2026-09-06',9,new Date('2026-09-05T16:00:00Z')),'standard');
  assert.equal(shortNoticeKind('2026-09-06',9,new Date('2026-09-05T16:00:01Z')),'short-notice');
});

test('DST resolution rejects nonexistent and ambiguous wall-clock times',()=>{
  assert.equal(resolveWallClock('2026-03-08',2,30).kind,'nonexistent');
  assert.equal(resolveWallClock('2026-11-01',1,30).kind,'ambiguous');
  const spring=resolveWallClock('2026-03-08',9);assert.equal(spring.kind,'exact');if(spring.kind==='exact')assert.equal(spring.instant.toISOString(),'2026-03-08T16:00:00.000Z');
  const fall=resolveWallClock('2026-11-01',9);assert.equal(fall.kind,'exact');if(fall.kind==='exact')assert.equal(fall.instant.toISOString(),'2026-11-01T17:00:00.000Z');
  assert.equal(shortNoticeKind('2026-03-08',9,new Date('2026-03-07T16:30:00Z')),'short-notice');
  assert.equal(shortNoticeKind('2026-11-01',9,new Date('2026-10-31T17:30:00Z')),'short-notice');
});

test('overnight wall-clock coverage spans midnight without assuming a fixed duration',()=>{
 const elapsedHours=(startDate:string)=>{const endDate=addCalendarDays(startDate,1)!;const start=resolveWallClock(startDate,18),end=resolveWallClock(endDate,8);assert.equal(start.kind,'exact');assert.equal(end.kind,'exact');return start.kind==='exact'&&end.kind==='exact'?(end.instant.getTime()-start.instant.getTime())/3_600_000:NaN};
 assert.equal(elapsedHours('2026-03-07'),13);
 assert.equal(elapsedHours('2026-10-31'),15);
});

test('overnight exactly 48 hours is outside the approved less-than threshold',()=>{
 const service=resolveWallClock('2026-03-09',18);assert.equal(service.kind,'exact');if(service.kind!=='exact')return;
 assert.equal(shortNoticeKind('2026-03-09',18,new Date(service.instant.getTime()-48*3_600_000),'overnight'),'standard');
 assert.equal(shortNoticeKind('2026-03-09',18,new Date(service.instant.getTime()-48*3_600_000+1),'overnight'),'short-notice');
});
