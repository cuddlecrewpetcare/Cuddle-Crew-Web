import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {dirname,join,relative,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {integrationRegistry} from './integration-registry.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const failures=[];
const fail=message=>failures.push(message);
const read=path=>readFileSync(join(root,path),'utf8');
const requireFile=path=>{
  if(!existsSync(join(root,path))){fail(`${path}: required deployment foundation file is missing`);return ''}
  return read(path);
};
const envTemplate=new Map(requireFile('.env.example').split(/\r?\n/).flatMap(line=>{
  const match=line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
  return match?[[match[1],match[2]]]:[];
}));

const manifest=JSON.parse(requireFile('package.json'));
const hosting=JSON.parse(requireFile('.openai/hosting.json'));
const workflow=requireFile('.github/workflows/validate.yml');
const proxy=requireFile('proxy.ts');
const health=requireFile('app/api/health/route.ts');
const robots=requireFile('app/robots.ts');
const runbook=requireFile('docs/deployment-hosting.md');
const releaseRecord=requireFile('docs/deployments/README.md');

if(read('.nvmrc').trim()!=='22.17.1')fail('.nvmrc must pin Node 22.17.1');
if(manifest.packageManager!=='npm@10.9.2')fail('packageManager must pin npm 10.9.2');
if(manifest.scripts?.build!=='vinext build')fail('the production build command must remain exactly "vinext build"');
if(!String(manifest.scripts?.validate||'').includes('check:deployment'))fail('standard validation must run check:deployment');
if(!String(manifest.scripts?.validate||'').includes('check:build-artifact'))fail('standard validation must verify the generated build artifact');

const forbiddenDeployCommand=/\b(?:wrangler\s+deploy|git\s+push\s+sites|deploy_site_version|deploy_private_site_version|npm\s+publish)\b/i;
for(const [name,command] of Object.entries(manifest.scripts||{})){
  if(forbiddenDeployCommand.test(String(command)))fail(`package script ${name} contains an unauthorized deployment command`);
}

const allowedHostingKeys=new Set(['project_id','static','d1','r2','capabilities']);
for(const key of Object.keys(hosting))if(!allowedHostingKeys.has(key))fail(`.openai/hosting.json contains unsupported key ${key}`);
if(typeof hosting.project_id!=='string'||!hosting.project_id.trim())fail('.openai/hosting.json must retain its existing non-secret Sites project identity');
if(hosting.d1!==null||hosting.r2!==null)fail('D1 and R2 must remain disabled until a separately authorized persistence phase');

const expectedNames=new Set(['RESEND_SEND_ENABLED','RESEND_API_KEY','PRIVATE_CALENDAR_ICS_URL','TURNSTILE_SECRET_KEY','NEXT_PUBLIC_TURNSTILE_SITE_KEY','SITE_INDEXING_ENABLED','GOOGLE_MAPS_SERVER_KEY','PRIVATE_SERVICE_ORIGIN']);
for(const name of expectedNames)if(!envTemplate.has(name))fail(`.env.example is missing ${name}`);
if(envTemplate.get('RESEND_SEND_ENABLED')!=='false')fail('RESEND_SEND_ENABLED must default to false');
if(envTemplate.get('SITE_INDEXING_ENABLED')!=='false')fail('SITE_INDEXING_ENABLED must default to false');
for(const name of ['RESEND_API_KEY','PRIVATE_CALENDAR_ICS_URL','TURNSTILE_SECRET_KEY','GOOGLE_MAPS_SERVER_KEY','PRIVATE_SERVICE_ORIGIN']){
  if(name.startsWith('NEXT_PUBLIC_'))fail(`${name} must remain server-only`);
}

for(const integration of integrationRegistry){
  for(const environment of ['local','tests','e2e','preview','staging','production'])if(!integration[environment])fail(`${integration.id}: ${environment} policy is missing`);
  if(['WRITE','WRITE_TARGET'].includes(integration.access)&&integration.preview!=='BLOCKED')fail(`${integration.id}: preview write access is not blocked`);
}

if(/pull_request_target\s*:/.test(workflow))fail('CI must not use pull_request_target');
if(!/^\s*pull_request\s*:/m.test(workflow)||!/^\s*push\s*:/m.test(workflow)||!/^\s*workflow_dispatch\s*:/m.test(workflow))fail('CI triggers must cover pull requests, main pushes, and explicit manual validation');
if(!/permissions:\s*\r?\n\s+contents:\s*read/.test(workflow))fail('CI must set read-only repository permissions');
if(/(?:contents|actions|checks|deployments|id-token|packages|pull-requests|statuses):\s*write/.test(workflow))fail('validation CI must not request write permissions');
if(/\bsecrets\./.test(workflow))fail('routine validation CI must not reference repository or production secrets');
if(!/persist-credentials:\s*false/.test(workflow))fail('checkout credentials must not persist into validation steps');
if(!/node-version-file:\s*['"]?\.nvmrc/.test(workflow))fail('CI must use the repository Node pin');
if(!/npm\s+ci\b/.test(workflow)||/npm\s+install\b/.test(workflow))fail('CI dependency installation must use npm ci, not npm install');
if(!/npm\s+run\s+validate:full\b/.test(workflow))fail('CI must run the complete validation gate');
if(!/RESEND_SEND_ENABLED:\s*['"]false['"]/.test(workflow))fail('CI must force Resend writes off');
if(!/SITE_INDEXING_ENABLED:\s*['"]false['"]/.test(workflow))fail('CI must force preview/test indexing off');
if(forbiddenDeployCommand.test(workflow)||/environment:\s*production/.test(workflow))fail('validation CI must not contain a production deployment path');

const reviewedActions=new Set([
  'actions/checkout@11d5960a326750d5838078e36cf38b85af677262',
  'actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020',
  'actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02',
]);
const actionUses=[...workflow.matchAll(/^\s*uses:\s*(\S+)/gm)].map(match=>match[1]);
if(actionUses.length!==reviewedActions.size)fail('CI action inventory changed; review every action and exact commit pin');
for(const action of actionUses)if(!reviewedActions.has(action))fail(`CI action is not on the reviewed exact-SHA allowlist: ${action}`);

for(const [header,value] of [
  ["'X-Content-Type-Options'","'nosniff'"],
  ["'Referrer-Policy'","'strict-origin-when-cross-origin'"],
  ["'X-Frame-Options'","'DENY'"],
  ["'Permissions-Policy'","'camera=(), microphone=(), geolocation=()'"],
  ["'Strict-Transport-Security'","'max-age=31536000'"],
])if(!proxy.includes(`${header}:${value}`))fail(`proxy.ts does not retain ${header}`);
for(const directive of ["default-src 'self'","base-uri 'self'","form-action 'self'","frame-ancestors 'none'","upgrade-insecure-requests"]){
  if(!proxy.includes(directive))fail(`Content Security Policy is missing ${directive}`);
}
if(proxy.includes("'unsafe-eval'"))fail('Content Security Policy must not allow unsafe-eval');
if(/'Strict-Transport-Security':'[^']*(?:includeSubDomains|preload)/.test(proxy))fail('HSTS must not cover unresolved subdomains or request preload');
if(/Access-Control-Allow-Origin['"]?\s*[:,]\s*['"]\*/i.test(proxy))fail('broad wildcard CORS is forbidden');
if(!health.includes("'Cache-Control':'no-store'")||/\bfetch\s*\(/.test(health)||health.includes('process.env'))fail('health endpoint must remain no-store, provider-free, and environment-free');
if(!robots.includes("SITE_INDEXING_ENABLED==='true'"))fail('robots policy must remain opt-in');

const tracked=spawnSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8',windowsHide:true}).stdout.split('\0').filter(Boolean);
for(const file of tracked){
  if(/^\.env(?:\.|$)/i.test(file)&&file!=='.env.example')fail(`${file}: environment value files must not be tracked`);
  if(/(?:^|\/)(?:playwright-report|test-results|coverage|dist|\.next|\.vinext|\.wrangler)(?:\/|$)/i.test(file))fail(`${file}: generated deployment/test output must not be tracked`);
}

const walk=directory=>readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(directory,entry.name)):[join(directory,entry.name)]);
const serverOnlyNames=['RESEND_API_KEY','PRIVATE_CALENDAR_ICS_URL','TURNSTILE_SECRET_KEY','GOOGLE_MAPS_SERVER_KEY','PRIVATE_SERVICE_ORIGIN'];
for(const file of walk(join(root,'app')).filter(path=>/\.(?:js|jsx|ts|tsx)$/.test(path))){
  const source=readFileSync(file,'utf8');
  if(!/^\s*['"]use client['"]/m.test(source))continue;
  for(const name of serverOnlyNames)if(source.includes(name))fail(`${relative(root,file)}: client source references server-only ${name}`);
}

if(!runbook.includes('exact Git SHA')||!runbook.includes('working tree must be clean')||!runbook.includes('Rollback'))fail('deployment runbook is missing exact-SHA, clean-tree, or rollback policy');
if(!releaseRecord.includes('Rollback SHA')||!releaseRecord.includes('Validation result'))fail('deployment record template is incomplete');

if(failures.length){
  for(const message of failures)console.error(`FAIL ${message}`);
  console.error(`Deployment safety check failed with ${failures.length} finding(s). Nothing was modified.`);
  process.exitCode=1;
}else{
  console.log('PASS Deployment source — exact toolchain, build command, Sites manifest, and no hidden deploy script');
  console.log('PASS Environment separation — canonical names documented; preview writes and default write gates are blocked');
  console.log('PASS CI configuration — read-only validation, exact-SHA actions, no production secrets, and no deployment path');
  console.log('PASS Runtime policy — security headers, opt-in indexing, same-origin API posture, and minimal health boundary');
  console.log('PASS Release operations — exact-SHA, clean-tree, deployment record, and rollback documentation present');
  console.log('Deployment safety check passed. Nothing was modified.');
}
