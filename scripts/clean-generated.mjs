import {existsSync,rmSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {assertSafeGeneratedTarget,generatedCleanupTargets} from './filesystem-safety.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dryRun=process.argv.includes('--dry-run');
for(const item of generatedCleanupTargets){
  const target=resolve(root,item),rel=assertSafeGeneratedTarget(root,target);
  if(!existsSync(target))continue;
  console.log(`${dryRun?'Would remove':'Removing'} ${rel}`);
  if(!dryRun)rmSync(target,{recursive:true,force:true});
}
console.log(dryRun?'Dry run complete. No files were removed.':'Generated artifacts removed. Dependencies, package caches, Playwright browsers, .env.local, and the environment fingerprint were preserved.');
