import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {integrationRegistry} from '../scripts/integration-registry.mjs';

const read=(path:string)=>readFileSync(path,'utf8');

test('deployment configuration guard accepts the reviewed repository policy',()=>{
  const result=spawnSync(process.execPath,['scripts/deployment-safety.mjs'],{encoding:'utf8',windowsHide:true});
  assert.equal(result.status,0,result.stderr||result.stdout);
  assert.match(result.stdout,/Deployment safety check passed/);
});

test('validation CI is read-only, exact-SHA pinned, and has no production secret or deploy path',()=>{
  const workflow=read('.github/workflows/validate.yml');
  assert.match(workflow,/permissions:\s*\n\s+contents: read/);
  assert.doesNotMatch(workflow,/pull_request_target|\bsecrets\.|environment:\s*production|wrangler\s+deploy|git\s+push\s+sites/i);
  assert.match(workflow,/persist-credentials: false/);
  assert.match(workflow,/RESEND_SEND_ENABLED: 'false'/);
  assert.match(workflow,/SITE_INDEXING_ENABLED: 'false'/);
  const actions=[...workflow.matchAll(/^\s*uses:\s*(\S+)/gm)].map(match=>match[1]);
  assert.equal(actions.length,3);
  for(const action of actions)assert.match(action,/@[0-9a-f]{40}$/);
});

test('every integration has an explicit preview boundary and active writes are blocked',()=>{
  for(const integration of integrationRegistry){
    for(const environment of ['local','tests','e2e','preview','staging','production'] as const)assert.ok(integration[environment],`${integration.id} ${environment}`);
    if(['WRITE','WRITE_TARGET'].includes(integration.access))assert.equal(integration.preview,'BLOCKED',integration.id);
  }
});

test('release documentation requires exact provenance, clean state, smoke verification, and rollback',()=>{
  const runbook=read('docs/deployment-hosting.md');
  const records=read('docs/deployments/README.md');
  for(const phrase of ['exact Git SHA','working tree must be clean','Post-deploy smoke test','Rollback','no production secrets'])assert.match(runbook,new RegExp(phrase,'i'));
  for(const phrase of ['Source SHA','Validation result','Deployment result','Smoke result','Rollback SHA'])assert.match(records,new RegExp(phrase));
});
