import {readdirSync,readFileSync,statSync} from 'node:fs';
import {join,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {resourceLimits} from '../app/config/resource-limits.ts';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
let failures=0;
const pass=(name,detail)=>console.log(`PASS    ${name} — ${detail}`);
const warn=(name,detail)=>console.log(`WARNING ${name} — ${detail}`);
const fail=(name,detail)=>{failures++;console.error(`FAIL    ${name} — ${detail}`)};
const entries=object=>Object.entries(object).flatMap(([key,value])=>typeof value==='object'&&value!==null?entries(value).map(([child,item])=>[`${key}.${child}`,item]):[[key,value]]);

const numeric=entries(resourceLimits);
const invalid=numeric.filter(([,value])=>!Number.isInteger(value)||Number(value)<=0);
if(invalid.length)for(const[name,value]of invalid)fail('Resource limit',`${name} must be a positive integer, received ${String(value)}`);
else pass('Resource limit schema',`${numeric.length} positive integer budgets`);

if(Math.max(...Object.values(resourceLimits.requestBodyBytes))<=16_384)pass('Request bodies','all public JSON body limits are at most 16 KiB');else fail('Request bodies','a public JSON body limit exceeds 16 KiB');
if(Math.max(...Object.values(resourceLimits.providerResponseBytes))<=1_048_576)pass('Provider responses','all parsed provider payloads are capped at or below 1 MiB');else fail('Provider responses','a parsed provider payload exceeds 1 MiB');
if(resourceLimits.processStateEntries.rateLimits<=4_096&&resourceLimits.processStateEntries.recentContactAttempts<=1_024)pass('Process-local state','rate-limit and contact-attempt maps have conservative cardinality caps');else fail('Process-local state','a process-local map cap exceeds the reviewed ceiling');
if(resourceLimits.calendar.maximumDays<=31&&resourceLimits.calendar.maximumEvents<=2_000&&resourceLimits.calendar.maximumProcessingMs<=100)pass('Calendar work','date window, event count, and processing deadline remain bounded');else fail('Calendar work','a reviewed calendar ceiling was increased');

const health=readFileSync(join(root,'app/api/health/route.ts'),'utf8');
const healthImports=[...health.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(match=>match[1]);
if(healthImports.every(path=>path==='../../lib/observability.ts')&&!/\bfetch\s*\(/.test(health))pass('Health endpoint','no provider import or fetch call');else fail('Health endpoint','must remain local and provider-free');

const walk=directory=>readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(directory,entry.name)):[join(directory,entry.name)]);
const assets=walk(join(root,'public')).map(path=>({path,size:statSync(path).size})).sort((a,b)=>b.size-a.size);
const blocked=assets.filter(asset=>asset.size>=10*1024*1024),review=assets.filter(asset=>asset.size>=1024*1024&&asset.size<10*1024*1024);
for(const asset of blocked)fail('Static asset',`${relative(root,asset.path)} is ${(asset.size/1024/1024).toFixed(2)} MiB (10 MiB limit)`);
for(const asset of review)warn('Static asset review',`${relative(root,asset.path)} is ${(asset.size/1024/1024).toFixed(2)} MiB`);
if(!blocked.length)pass('Static asset hard limit','no public asset is 10 MiB or larger');

if(failures){console.error(`Resource safety check failed with ${failures} finding(s). Nothing was modified.`);process.exitCode=1}else console.log('Resource safety check passed. Nothing was modified.');
