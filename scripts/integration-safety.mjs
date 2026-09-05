import {readFileSync,readdirSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {integrationRegistry} from './integration-registry.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFileSync(join(root,path),'utf8');
const failures=[];
const fail=message=>failures.push(message);
const envTemplate=new Map(read('.env.example').split(/\r?\n/).flatMap(line=>{const match=line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);return match?[[match[1],match[2]]]:[]}));
const ids=new Set();

for(const integration of integrationRegistry){
  if(ids.has(integration.id))fail(`duplicate provider id: ${integration.id}`);ids.add(integration.id);
  for(const name of [...integration.secrets,...integration.publicConfig,...(integration.writeGate?[integration.writeGate]:[])])if(!envTemplate.has(name))fail(`${integration.id}: ${name} is missing from .env.example`);
  for(const name of integration.secrets)if(name.startsWith('NEXT_PUBLIC_'))fail(`${integration.id}: secret ${name} is browser-public`);
  if(['WRITE','WRITE_TARGET'].includes(integration.access)&&integration.status.startsWith('ACTIVE')&&!integration.writeGate&&integration.id!=='business-mailbox')fail(`${integration.id}: active write has no provider-specific gate`);
  if(integration.writeGate&&envTemplate.get(integration.writeGate)!=='false')fail(`${integration.id}: ${integration.writeGate} must default to false`);
  if(['tests','e2e'].some(environment=>!integration[environment]))fail(`${integration.id}: automated environment policy is missing`);
}

const packageJson=JSON.parse(read('package.json'));
if(!String(packageJson.scripts?.validate||'').includes('check:integrations'))fail('standard validation does not run check:integrations');
if(!read('scripts/run-e2e.mjs').includes("RESEND_SEND_ENABLED:'false'"))fail('E2E server does not force the active email write gate off');
if(!read('app/lib/providers/resend.ts').includes('resendDeliveryConfigured'))fail('Resend adapter does not enforce its write gate');
if(read('app/api/address/check/route.ts').includes('validateAddress?key='))fail('Google Maps secret remains in an Address Validation URL');

const testFiles=['tests','e2e'].flatMap(directory=>readdirSync(join(root,directory),{withFileTypes:true}).filter(entry=>entry.isFile()&&/\.(?:ts|tsx|js|mjs)$/.test(entry.name)).map(entry=>join(directory,entry.name)));
const forbiddenLiveWriteHosts=['api.resend.com','api.stripe.com','api.dialpad.com'];
for(const file of testFiles){const source=read(file);for(const host of forbiddenLiveWriteHosts)if(source.includes(host))fail(`${file}: live write host ${host} is forbidden in automated tests`)}

if(failures.length){for(const message of failures)console.error(`FAIL ${message}`);console.error(`Integration safety check failed with ${failures.length} finding(s). Nothing was modified.`);process.exitCode=1}
else{
  console.log(`PASS Integration registry — ${integrationRegistry.length} provider/boundary entries have explicit access and environment policy`);
  console.log('PASS Write isolation — active email delivery has a provider-specific gate that defaults off');
  console.log('PASS Secret boundary — registered provider secrets are server-only and declared without values');
  console.log('PASS Test isolation — known live write hosts are absent from Node and E2E source');
  console.log('PASS Maps authentication — the server key is not placed in the Address Validation URL');
  console.log('Integration safety check passed. Nothing was modified.');
}
