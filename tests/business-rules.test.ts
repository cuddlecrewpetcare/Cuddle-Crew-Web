import test from 'node:test';import assert from 'node:assert/strict';
import {daysBetween,easterDate,holidayForDate,largestDailyGap,shortNoticeKind,zoneForZip} from '../app/lib/business-rules.ts';
test('ZIP lookup distinguishes incomplete, listed, and outside',()=>{assert.equal(zoneForZip('').state,'incomplete');assert.deepEqual(zoneForZip('95821').state,'listed');assert.equal(zoneForZip('99999').state,'outside');});
test('overnight checkout is exclusive',()=>{assert.deepEqual(daysBetween('2026-12-22','2026-12-26',true),['2026-12-22','2026-12-23','2026-12-24','2026-12-25']);});
test('holiday calendar includes calculated and fixed dates',()=>{assert.equal(easterDate(2027),'2027-03-28');assert.equal(holidayForDate('2026-11-26'),'Thanksgiving');assert.equal(holidayForDate('2026-12-25'),'Christmas Day');});
test('largest gap uses actual care windows',()=>{assert.equal(largestDailyGap([0,2]),15);assert.equal(largestDailyGap([],false),null);assert.equal(largestDailyGap([1],true),4);});
test('short notice distinguishes same day and under 48 hours',()=>{const now=new Date('2026-08-29T11:00:00');assert.equal(shortNoticeKind('2026-08-29',15,now),'same-day');assert.equal(shortNoticeKind('2026-08-30',9,now),'under-48');assert.equal(shortNoticeKind('2026-09-02',9,now),'standard');});
