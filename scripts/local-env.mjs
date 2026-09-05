import {createHash} from 'node:crypto';
import {existsSync,readFileSync,realpathSync,statfsSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createServer} from 'node:net';
import {expectedGitleaksVersion,findGitleaks} from './gitleaks-tool.mjs';

const scriptDir=dirname(fileURLToPath(import.meta.url));
const root=resolve(scriptDir,'..');
const packagePath=join(root,'package.json');
const lockPath=join(root,'package-lock.json');
const stateDir=join(root,'.cache','local-dev');
const fingerprintPath=join(stateDir,'fingerprint.json');
const manifest=JSON.parse(readFileSync(packagePath,'utf8'));
const lock=JSON.parse(readFileSync(lockPath,'utf8'));
const expectedNode=readFileSync(join(root,'.nvmrc'),'utf8').trim();
const expectedNpm=String(manifest.packageManager||'npm@unknown').split('@').at(-1);
const expectedEnv=['RESEND_SEND_ENABLED','RESEND_API_KEY','PRIVATE_CALENDAR_ICS_URL','TURNSTILE_SECRET_KEY','NEXT_PUBLIC_TURNSTILE_SITE_KEY','SITE_INDEXING_ENABLED','GOOGLE_MAPS_SERVER_KEY','PRIVATE_SERVICE_ORIGIN'];
const dependencyGroups=['dependencies','devDependencies','optionalDependencies','peerDependencies'];

const run=(command,args,{cwd=root,stdio='pipe'}={})=>spawnSync(command,args,{cwd,encoding:'utf8',stdio,windowsHide:true});
const npmRun=(args,options={})=>process.env.npm_execpath&&existsSync(process.env.npm_execpath)
  ?run(process.execPath,[process.env.npm_execpath,...args],options)
  :run(process.platform==='win32'?'npm.cmd':'npm',args,options);
const output=(result)=>(result.stdout||result.stderr||'').trim();
const semverParts=(value)=>String(value).replace(/^v/,'').split('.').map(Number);
const stable=(value)=>Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])])):value;
const dependencyShape=Object.fromEntries(dependencyGroups.map(key=>[key,manifest[key]||{}]));
const runtimeIdentity={node:process.versions.node.split('.').slice(0,2).join('.'),npm:output(npmRun(['--version']))};
const fingerprint=()=>createHash('sha256').update(readFileSync(lockPath)).update(JSON.stringify(stable(dependencyShape))).update(JSON.stringify(runtimeIdentity)).digest('hex');

function checkRoot(){
  const git=run('git',['rev-parse','--show-toplevel']);
  const gitRoot=git.status===0?resolve(output(git)):null;
  let cwd=resolve(process.cwd()),actualRoot=root;
  try{cwd=realpathSync(cwd);actualRoot=realpathSync(root)}catch{}
  return{ok:gitRoot!==null&&resolve(gitRoot)===resolve(root)&&cwd===actualRoot,gitRoot,cwd};
}

function checkRuntime(){
  const [major,minor]=semverParts(process.versions.node),[expectedMajor,expectedMinor]=semverParts(expectedNode);
  return{nodeOk:major===expectedMajor&&minor===expectedMinor,npmOk:runtimeIdentity.npm===expectedNpm,node:process.versions.node,npm:runtimeIdentity.npm};
}

function checkLock(){
  const rootPackage=lock.packages?.['']||{};
  const mismatches=[];
  for(const group of dependencyGroups)for(const [name,range] of Object.entries(manifest[group]||{}))if(rootPackage[group]?.[name]!==range)mismatches.push(`${group}:${name}`);
  return{ok:lock.lockfileVersion===3&&mismatches.length===0,mismatches,version:lock.lockfileVersion};
}

function checkDependencies(){
  if(!existsSync(join(root,'node_modules')))return{ok:false,problems:['node_modules is missing'],extraneous:[]};
  const problems=[];
  for(const group of dependencyGroups){
    for(const name of Object.keys(manifest[group]||{})){
      const installedPath=join(root,'node_modules',...name.split('/'),'package.json');
      const expected=lock.packages?.[`node_modules/${name}`]?.version;
      if(!existsSync(installedPath)){problems.push(`${name} is missing`);continue;}
      const installed=JSON.parse(readFileSync(installedPath,'utf8')).version;
      if(expected&&installed!==expected)problems.push(`${name} is ${installed}; lockfile expects ${expected}`);
    }
  }
  return{ok:problems.length===0,problems,extraneous:[]};
}

function checkTreeIntegrity(){
  const result=npmRun(['ls','--all','--json']);
  let payload={};try{payload=JSON.parse(result.stdout||'{}')}catch{}
  const all=Array.isArray(payload.problems)?payload.problems:[];
  const material=all.filter(value=>/\b(missing|invalid)\b/i.test(value));
  return{ok:material.length===0,problems:material,extraneous:all.filter(value=>/\bextraneous\b/i.test(value))};
}

function readFingerprint(){
  if(!existsSync(fingerprintPath))return{state:'missing',expected:fingerprint()};
  try{const stored=JSON.parse(readFileSync(fingerprintPath,'utf8'));return{state:stored.fingerprint===fingerprint()?'current':'stale',expected:fingerprint(),stored}}catch{return{state:'invalid',expected:fingerprint()}}
}

async function checkPlaywright(){
  try{
    const playwright=await import('@playwright/test');
    const packageFile=join(root,'node_modules','@playwright','test','package.json');
    const version=JSON.parse(readFileSync(packageFile,'utf8')).version;
    const executable=playwright.chromium.executablePath();
    return{ok:existsSync(executable),version,executable};
  }catch(error){return{ok:false,version:'unavailable',executable:'unavailable',error:error instanceof Error?error.message:String(error)}}
}

function processName(pid){
  if(!pid)return'unknown';
  const result=run('tasklist',['/FI',`PID eq ${pid}`,'/FO','CSV','/NH']);
  const match=output(result).match(/^"([^"]+)"/);return match?.[1]||'unknown';
}

function windowsPortOwner(port){
  const result=run('netstat',['-ano','-p','tcp']);
  const line=String(result.stdout||'').split(/\r?\n/).find(value=>new RegExp(`[:.]${port}\\s+.*LISTENING\\s+(\\d+)\\s*$`,'i').test(value));
  if(!line)return{};
  const pid=Number(line.trim().split(/\s+/).at(-1));return{pid,name:processName(pid)};
}

function portStatus(port){
  return new Promise(resolveStatus=>{
    const probe=createServer();
    probe.unref();
    probe.once('error',error=>resolveStatus({port,available:false,error:error.code||'unavailable',ownership:'unknown',...(process.platform==='win32'?windowsPortOwner(port):{})}));
    probe.listen(port,'0.0.0.0',()=>probe.close(()=>resolveStatus({port,available:true})));
  });
}

function envNames(){
  const envPath=join(root,'.env.local');
  const values=new Map();
  if(existsSync(envPath))for(const line of readFileSync(envPath,'utf8').split(/\r?\n/)){const match=line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);if(match)values.set(match[1],match[2].replace(/^(['"])(.*)\1$/,'$2'))}
  const value=name=>process.env[name]??values.get(name)??'';
  const configured=name=>Boolean(String(value(name)).trim());
  return{
    exists:existsSync(envPath),
    names:[...values.keys()],
    providers:{
      resend:{key:configured('RESEND_API_KEY'),enabled:value('RESEND_SEND_ENABLED')==='true'},
      calendar:{configured:configured('PRIVATE_CALENDAR_ICS_URL')},
      turnstile:{site:configured('NEXT_PUBLIC_TURNSTILE_SITE_KEY'),secret:configured('TURNSTILE_SECRET_KEY')},
      maps:{key:configured('GOOGLE_MAPS_SERVER_KEY'),origin:configured('PRIVATE_SERVICE_ORIGIN')},
    },
  };
}

function gitInfo(){
  const branch=output(run('git',['branch','--show-current']))||'(detached)';
  const sha=output(run('git',['rev-parse','HEAD']));return{branch,sha};
}

function disk(){
  try{const value=statfsSync(root),free=value.bavail*value.bsize;return{free,freeGb:free/1024/1024/1024}}catch{return{free:0,freeGb:0}}
}

async function collect(){
  const dependencies=checkDependencies();
  return{root:checkRoot(),runtime:checkRuntime(),lock:checkLock(),dependencies,tree:dependencies.ok?checkTreeIntegrity():{ok:false,problems:dependencies.problems},fingerprint:readFingerprint(),playwright:await checkPlaywright(),gitleaks:findGitleaks(),ports:await Promise.all([3000,3100].map(portStatus)),env:envNames(),git:gitInfo(),disk:disk()};
}

const line=(kind,label,detail='')=>console.log(`${kind.padEnd(7)} ${label}${detail?` — ${detail}`:''}`);

async function doctor(){
  const state=await collect();let failed=false;
  const pass=(label,detail)=>line('PASS',label,detail),warn=(label,detail)=>line('WARNING',label,detail),fail=(label,detail)=>{failed=true;line('FAIL',label,detail)},info=(label,detail)=>line('INFO',label,detail);
  if(state.root.ok)pass('Repository root',root);else fail('Repository root',`run this command from ${root}`);
  if(state.runtime.nodeOk)pass('Node',state.runtime.node);else fail('Node',`${state.runtime.node}; expected ${expectedNode}`);
  if(state.runtime.npmOk)pass('Package manager',`npm ${state.runtime.npm}`);else fail('Package manager',`npm ${state.runtime.npm}; expected ${expectedNpm}`);
  if(state.lock.ok)pass('Lockfile',`npm lockfile v${state.lock.version}`);else fail('Lockfile',state.lock.mismatches.join(', ')||'unsupported format');
  if(state.dependencies.ok)pass('Dependencies','required direct packages match package-lock.json');else fail('Dependencies',state.dependencies.problems.join('; '));
  if(state.tree.ok)pass('Dependency tree','npm reports no missing or invalid packages');else fail('Dependency tree',state.tree.problems.join('; ')||'npm dependency tree validation failed');
  if(state.fingerprint.state==='current')pass('Environment fingerprint','current');else if(state.fingerprint.state==='missing')warn('Environment fingerprint','missing; run npm run setup:local once');else fail('Environment fingerprint',`${state.fingerprint.state}; run npm run setup:local`);
  if(state.playwright.ok)pass('Playwright browser',`${state.playwright.version} Chromium available`);else fail('Playwright browser','Chromium unavailable; run npm run setup:local');
  if(state.gitleaks.available&&state.gitleaks.compatible)pass('Secret scanner',`Gitleaks ${state.gitleaks.version} available`);else if(state.gitleaks.available)fail('Secret scanner',`Gitleaks ${state.gitleaks.version}; expected ${expectedGitleaksVersion}`);else fail('Secret scanner',`Gitleaks ${expectedGitleaksVersion} unavailable; follow docs/local-development.md`);
  for(const port of state.ports){const owner=port.pid?` by PID ${port.pid} (${port.name})`:'';if(port.available)pass(`Port ${port.port}`,'available');else if(port.port===3000)warn('Port 3000',`occupied${owner}; ownership unknown, inspect before starting dev`);else fail('Port 3100',`occupied${owner}; Playwright will not reuse it`)}
  if(state.env.exists)info('.env.local',`${state.env.names.length} recognized or custom variable names present; values hidden`);else info('.env.local','not present; optional integrations use safe fallbacks');
  const missingTemplate=expectedEnv.filter(name=>!readFileSync(join(root,'.env.example'),'utf8').includes(`${name}=`));
  if(missingTemplate.length)fail('.env.example',`missing ${missingTemplate.join(', ')}`);else pass('.env.example','expected variable names documented');
  const providers=state.env.providers;
  if(providers.resend.enabled&&!providers.resend.key)fail('Resend configuration','write gate is enabled but RESEND_API_KEY is not configured');
  else if(providers.resend.enabled)warn('Resend configuration','live email writes explicitly enabled for this environment');
  else pass('Resend configuration',providers.resend.key?'API key configured; write gate remains disabled':'not configured; live writes blocked');
  info('Private calendar',providers.calendar.configured?'configured; local config only, provider not contacted':'not configured; conservative fallback active');
  if(providers.turnstile.site!==providers.turnstile.secret)fail('Turnstile configuration','site and secret keys must be configured together');else info('Turnstile configuration',providers.turnstile.site?'configured; provider not contacted':'not configured; optional verification off');
  if(providers.maps.key!==providers.maps.origin)fail('Maps configuration','server key and private origin must be configured together');else info('Maps configuration',providers.maps.key?'configured; provider not contacted':'not configured; address provider calls disabled');
  if(state.disk.freeGb<10)warn('Disk space',`${state.disk.freeGb.toFixed(1)} GiB free`);else pass('Disk space',`${state.disk.freeGb.toFixed(1)} GiB free`);
  info('Git branch',state.git.branch==='main'?'currently on main':state.git.branch);
  info('Local readiness',failed?'repair the reported failures before development':'READY LOCALLY; no dependency or browser download needed');
  process.exitCode=failed?1:0;
}

async function summary(){
  const state=await collect();
  console.log('Cuddle Crew local environment (no secret values)');
  console.log(`Repository: ${root}`);
  console.log(`Branch: ${state.git.branch}`);
  console.log(`Commit: ${state.git.sha}`);
  console.log(`Node: ${state.runtime.node} (pinned ${expectedNode})`);
  console.log(`npm: ${state.runtime.npm} (selected ${expectedNpm})`);
  for(const name of ['next','vinext','vite','typescript','@playwright/test']){const path=join(root,'node_modules',...name.split('/'),'package.json');console.log(`${name}: ${existsSync(path)?JSON.parse(readFileSync(path,'utf8')).version:'missing'}`)}
  console.log(`Dependencies: ${state.dependencies.ok&&state.tree.ok?'healthy':'repair needed'}`);
  console.log(`Fingerprint: ${state.fingerprint.state}`);
  console.log(`Playwright Chromium: ${state.playwright.ok?'available':'missing'} (${state.playwright.executable})`);
  console.log(`Gitleaks: ${state.gitleaks.available?(state.gitleaks.compatible?`available (${state.gitleaks.version})`:`incompatible (${state.gitleaks.version}; expected ${expectedGitleaksVersion})`):`missing (expected ${expectedGitleaksVersion})`}`);
  console.log('Secret scan integration: enabled in npm run validate; history scan is separate.');
  for(const port of state.ports)console.log(`Port ${port.port}: ${port.available?'available':`occupied${port.pid?` by PID ${port.pid} (${port.name})`:''}; ownership unknown`}`);
  console.log(`.env.local: ${state.env.exists?`${state.env.names.length} variable names detected; values hidden`:'not present'}`);
  console.log(`Resend: ${state.env.providers.resend.enabled&&state.env.providers.resend.key?'configured and explicitly write-enabled':state.env.providers.resend.key?'key configured; writes disabled':'not configured; writes disabled'}`);
  console.log(`Private calendar: ${state.env.providers.calendar.configured?'configured':'not configured; conservative fallback'}`);
  console.log(`Turnstile: ${state.env.providers.turnstile.site&&state.env.providers.turnstile.secret?'configured':state.env.providers.turnstile.site||state.env.providers.turnstile.secret?'misconfigured pair':'not configured'}`);
  console.log(`Google Maps/address: ${state.env.providers.maps.key&&state.env.providers.maps.origin?'configured':state.env.providers.maps.key||state.env.providers.maps.origin?'misconfigured pair':'not configured'}`);
  console.log(`Disk free: ${state.disk.freeGb.toFixed(1)} GiB`);
  console.log('Baseline: 142 Node tests; 21 Playwright tests including 9 focused accessibility checks; lint allows 4 known no-img-element warnings.');
  console.log('Observability: structured redacted runtime diagnostics and request IDs enabled; live provider health checks disabled.');
  console.log('Network: not needed for healthy local checks; needed for Git operations and intentionally live provider calls.');
}

async function setup(){
  const rootState=checkRoot(),runtime=checkRuntime(),lockState=checkLock();
  if(!rootState.ok||!runtime.nodeOk||!runtime.npmOk||!lockState.ok){console.error('Environment prerequisites do not match the repository. Run npm run doctor for details.');process.exitCode=1;return}
  const gitleaks=findGitleaks();
  if(!gitleaks.available||!gitleaks.compatible){console.error(`Gitleaks ${expectedGitleaksVersion} must be installed once as documented in docs/local-development.md. Setup does not download it automatically.`);process.exitCode=1;return}
  let dependencies=checkDependencies(),tree=dependencies.ok?checkTreeIntegrity():{ok:false,problems:dependencies.problems,extraneous:[]};
  if(!dependencies.ok||!tree.ok){
    const missingTree=!existsSync(join(root,'node_modules'));
    console.log(missingTree?'Dependencies are absent; running deterministic npm ci from package-lock.json.':'Dependency evidence is stale or incomplete; running npm install without deleting caches or node_modules.');
    const install=npmRun(missingTree?['ci']:['install'],{stdio:'inherit'});if(install.status!==0){process.exitCode=install.status||1;return}
    dependencies=checkDependencies();if(!dependencies.ok){console.error(dependencies.problems.join('\n'));process.exitCode=1;return}
  }else console.log('Dependencies are healthy; install skipped.');
  let playwright=await checkPlaywright();
  if(!playwright.ok){console.log('Chromium is missing for the installed Playwright version; installing only Chromium.');const install=npmRun(['exec','--','playwright','install','chromium'],{stdio:'inherit'});if(install.status!==0){process.exitCode=install.status||1;return}playwright=await checkPlaywright()}
  else console.log('Playwright Chromium is available; browser install skipped.');
  if(!playwright.ok){console.error('Playwright Chromium remains unavailable.');process.exitCode=1;return}
  mkdirSync(stateDir,{recursive:true});writeFileSync(fingerprintPath,`${JSON.stringify({schemaVersion:1,fingerprint:fingerprint(),createdAt:new Date().toISOString(),runtime:runtimeIdentity},null,2)}\n`);
  console.log(`Local fingerprint refreshed at ${fingerprintPath.slice(root.length+1)}.`);
  if(!existsSync(join(root,'.env.local')))console.log('INFO .env.local is absent. Copy .env.example only when an optional live integration is needed.');
  console.log('Local setup is ready. Existing caches and installations were preserved.');
}

const mode=process.argv[2];
if(mode==='doctor')await doctor();else if(mode==='summary')await summary();else if(mode==='setup')await setup();else{console.error('Use doctor, summary, or setup.');process.exitCode=2}
