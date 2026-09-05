import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {business} from '../app/config/business.ts';
import {daysBetween,holidayForDate,publicHolidays,shortNoticeKind} from '../app/lib/business-rules.ts';
import {contactKeys} from '../app/lib/contact.ts';
import {assertTimeZoneSupported,resolveWallClock} from '../app/lib/time.ts';

const root=fileURLToPath(new URL('../',import.meta.url));
const source=relative=>readFileSync(path.join(root,relative),'utf8');

assert.equal(business.timezone,'America/Los_Angeles');
assert.equal(assertTimeZoneSupported(),true);
assert.deepEqual(daysBetween('2026-03-07','2026-03-09'),['2026-03-07','2026-03-08','2026-03-09']);
assert.equal(resolveWallClock('2026-03-08',2,30).kind,'nonexistent');
assert.equal(resolveWallClock('2026-11-01',1,30).kind,'ambiguous');
assert.equal(shortNoticeKind('2026-09-06',9,new Date('2026-09-06T06:50:00Z')),'short-notice');
assert.equal(contactKeys.includes('startedAt'),false);
assert.equal(source('app/contact/ContactTools.tsx').includes('startedAt'),false);
assert.equal(source('app/lib/business-rules.ts').includes('new Date(`${serviceDate}'),false);
assert.equal(source('app/sitemap.ts').includes('lastModified:new Date()'),false);
assert.equal(business.policyStatus.holidayCalendar,'PLACEHOLDER');
assert.deepEqual(publicHolidays(2026),[]);
assert.equal(holidayForDate('2026-12-25'),undefined);

console.log('Time safety check passed: Pacific business rules, date-only arithmetic, client/server clock authority, deterministic sitemap metadata, and unresolved-holiday safeguards are intact.');
