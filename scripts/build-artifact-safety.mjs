import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {dirname,join,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dist=join(root,'dist');
const client=join(dist,'client');
const worker=join(dist,'server','index.js');
const failures=[];
const fail=message=>failures.push(message);
const walk=directory=>readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(directory,entry.name)):[join(directory,entry.name)]);

if(!existsSync(client))fail('dist/client is missing; run the production build first');
if(!existsSync(worker))fail('dist/server/index.js is missing; the Sites Worker artifact is incomplete');

const files=existsSync(dist)?walk(dist):[];
if(files.length>20_000)fail(`build artifact contains ${files.length} files; review the unexpected expansion`);
for(const file of files){
  const path=relative(dist,file).replaceAll('\\','/');
  if(/(?:^|\/)(?:\.env(?:\.|$)|docs|tests?|e2e|playwright-report|test-results|coverage|\.git|\.cache|node_modules)(?:\/|$)/i.test(path))fail(`${path}: private/source/test material is forbidden in the deployment artifact`);
  if(/\.(?:map|log|db|sqlite3?|dump|bak|backup)$/i.test(path))fail(`${path}: source map, log, database, or backup is forbidden in the deployment artifact`);
}

const serverOnlyNames=['RESEND_API_KEY','PRIVATE_CALENDAR_ICS_URL','TURNSTILE_SECRET_KEY','GOOGLE_MAPS_SERVER_KEY','PRIVATE_SERVICE_ORIGIN','RESEND_SEND_ENABLED'];
const clientTextFiles=files.filter(file=>file.startsWith(`${client}\\`)||file.startsWith(`${client}/`)).filter(file=>statSync(file).size<=5*1024*1024).filter(file=>/\.(?:js|css|html|json|txt|xml|webmanifest|svg)$/.test(file));
for(const file of clientTextFiles){
  const source=readFileSync(file,'utf8');
  for(const name of serverOnlyNames)if(source.includes(name))fail(`${relative(dist,file)}: client artifact contains server-only environment name ${name}`);
  if(/C:\\Users\\|\/Users\/[^/]+\/|\/home\/runner\/work\//.test(source))fail(`${relative(dist,file)}: client artifact contains a local build path`);
}

if(existsSync(worker)){
  const source=readFileSync(worker,'utf8');
  if(!/export\{[^}]+as default\}/.test(source))fail('Worker entrypoint has no default export');
  if(!/\bfetch\s*\(/.test(source)&&!(/async fetch\(/.test(source)))fail('Worker default object has no callable fetch implementation');
}

const builtHosting=join(dist,'.openai','hosting.json');
if(!existsSync(builtHosting))fail('dist/.openai/hosting.json is missing');
else if(readFileSync(builtHosting,'utf8').trim()!==readFileSync(join(root,'.openai','hosting.json'),'utf8').trim())fail('built hosting manifest differs from the reviewed source manifest');

if(failures.length){
  for(const message of failures)console.error(`FAIL ${message}`);
  console.error(`Build artifact safety check failed with ${failures.length} finding(s). Nothing was modified.`);
  process.exitCode=1;
}else{
  const bytes=files.reduce((sum,file)=>sum+statSync(file).size,0);
  console.log(`PASS Build artifact shape — ${files.length} files, ${(bytes/1024/1024).toFixed(2)} MiB, Worker entrypoint and Sites manifest present`);
  console.log('PASS Build artifact privacy — no generated tests, reports, source maps, databases, backups, client secret names, or client local paths');
  console.log('Build artifact safety check passed. Nothing was modified.');
}
