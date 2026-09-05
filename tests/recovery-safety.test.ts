import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {hasRequiredRecoveryLanguage,isForbiddenRecoveryPath,requiredRecoveryFiles} from '../scripts/recovery-safety.mjs';

const read=(path:string)=>readFileSync(path,'utf8');

test('recovery check accepts the reviewed repository foundation',()=>{
  const result=spawnSync(process.execPath,['scripts/recovery-safety.mjs'],{encoding:'utf8',windowsHide:true});
  assert.equal(result.status,0,result.stderr||result.stdout);
  assert.match(result.stdout,/Recovery safety check passed/);
  assert.match(result.stdout,/does not prove offsite copies/);
});

test('recovery guard rejects private archives and permits only the documentation template',()=>{
  for(const path of ['backups/site.zip','private-exports/clients.csv','recovery-codes/github.txt','.env.local','snapshot.sql.gz','certificate.p12'])assert.equal(isForbiddenRecoveryPath(path),true,path);
  assert.equal(isForbiddenRecoveryPath('docs/backups/README.md'),false);
  assert.equal(isForbiddenRecoveryPath('.env.example'),false);
});

test('recovery documents retain restore, continuity, and manifest invariants',()=>{
  const missing=hasRequiredRecoveryLanguage(
    read('docs/backup-disaster-recovery.md'),
    read('docs/business-continuity.md'),
    read('docs/backups/README.md'),
  );
  assert.deepEqual(missing,{recovery:[],continuity:[],template:[]});
});

test('recovery foundation keeps every authority and operational dependency explicit',()=>{
  assert.equal(requiredRecoveryFiles.length,9);
  for(const path of requiredRecoveryFiles)assert.doesNotThrow(()=>read(path),path);
  const policy=read('docs/backup-disaster-recovery.md');
  for(const provider of ['GitHub','OpenAI Sites','domain registrar','Google Workspace','Precise Petcare','Resend','Turnstile','Google Maps','private calendar'])assert.match(policy,new RegExp(provider,'i'),provider);
});
