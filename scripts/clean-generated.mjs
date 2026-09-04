import {existsSync,rmSync} from 'node:fs';
import {dirname,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dryRun=process.argv.includes('--dry-run');
const targets=['.next','.vinext','dist','out','coverage','playwright-report','test-results','.cache/local-dev/playwright','.cache/local-dev/logs'];

for(const item of targets){
  const target=resolve(root,item),rel=relative(root,target);
  if(!rel||rel.startsWith(`..${sep}`)||rel==='..')throw new Error(`Refusing unsafe cleanup target: ${target}`);
  if(!existsSync(target))continue;
  console.log(`${dryRun?'Would remove':'Removing'} ${rel}`);
  if(!dryRun)rmSync(target,{recursive:true,force:true});
}
console.log(dryRun?'Dry run complete. No files were removed.':'Generated artifacts removed. Dependencies, package caches, Playwright browsers, .env.local, and the environment fingerprint were preserved.');
