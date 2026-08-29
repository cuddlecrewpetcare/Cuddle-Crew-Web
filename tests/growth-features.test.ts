import test from 'node:test';
import assert from 'node:assert/strict';
import {loadReferral,parseReferralSource,persistReferral,referralFromSearch,referralStorageKey} from '../app/lib/referral.ts';
import {sanitizePublicEventProperties} from '../app/lib/public-analytics.ts';

test('referral parser accepts allowlisted sources',()=>{assert.equal(parseReferralSource('instagram'),'instagram');assert.equal(parseReferralSource('business-card'),'business-card');assert.equal(parseReferralSource('google'),'google')});
test('referral parser rejects unsafe or unknown values',()=>{assert.equal(parseReferralSource('unknown'),undefined);assert.equal(parseReferralSource('https://example.com'),undefined);assert.equal(parseReferralSource('<script>alert(1)</script>'),undefined)});
test('referral query reads only the allowlisted ref parameter',()=>{assert.equal(referralFromSearch('?ref=instagram&email=private@example.com'),'instagram');assert.equal(referralFromSearch('?email=private@example.com'),undefined)});
test('safe referral persists while invalid values are ignored',()=>{const values=new Map<string,string>();const storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value)}};assert.equal(persistReferral(storage,'facebook'),'facebook');assert.equal(values.size,1);assert.equal(values.get(referralStorageKey),'facebook');assert.equal(loadReferral(storage),'facebook');assert.equal(persistReferral(storage,'javascript:alert(1)'),undefined);assert.equal(values.size,1)});
test('analytics sanitizer keeps coarse allowlisted properties only',()=>{assert.deepEqual(sanitizePublicEventProperties({serviceType:'overnight',zoneName:'Core',duration:30,status:'success',address:'123 Main',email:'x@y.com',phone:'555',medication:'pill',behavior:'bite',accessCode:'1234'}),{serviceType:'overnight',zoneName:'Core',duration:30,status:'success'})});
