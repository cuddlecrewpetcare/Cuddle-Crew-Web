import assert from 'node:assert/strict';
import test from 'node:test';
import {createEnvironmentFingerprint,createRuntimeIdentity,evaluateRuntimeVersions,exactVersionMatches,normalizeExactVersion} from '../scripts/local-env.mjs';

const expectedNode='22.17.1';
const expectedNpm='10.9.2';

test('exact Node pin accepts only the canonical patch version',()=>{
  assert.equal(exactVersionMatches('22.17.1',expectedNode),true);
  assert.equal(exactVersionMatches('v22.17.1',expectedNode,{allowLeadingV:true}),true);
  for(const actual of ['22.17.0','22.17.2','22.18.0','23.0.0'])assert.equal(exactVersionMatches(actual,expectedNode),false,actual);
});

test('exact version normalization rejects malformed values',()=>{
  for(const value of ['22.17','22.17.1.0','22.17.x','22.17.1-beta','version 22.17.1','022.17.1',''])assert.equal(normalizeExactVersion(value),null,value);
});

test('npm pin remains an exact version check',()=>{
  for(const actual of ['10.9.1','10.9.3','10.10.2','11.0.0','v10.9.2']){
    assert.equal(evaluateRuntimeVersions({nodeVersion:expectedNode,npmVersion:actual,expectedNodeVersion:expectedNode,expectedNpmVersion:expectedNpm}).npmOk,false,actual);
  }
  assert.equal(evaluateRuntimeVersions({nodeVersion:expectedNode,npmVersion:expectedNpm,expectedNodeVersion:expectedNode,expectedNpmVersion:expectedNpm}).npmOk,true);
});

test('runtime evaluation reports exact mismatches as not ready without mutating its input',()=>{
  const input={nodeVersion:'22.17.2',npmVersion:'10.9.2',expectedNodeVersion:expectedNode,expectedNpmVersion:expectedNpm};
  const before=structuredClone(input);
  const result=evaluateRuntimeVersions(input);
  assert.deepEqual(input,before);
  assert.deepEqual(result,{ok:false,nodeOk:false,npmOk:true,node:'22.17.2',npm:'10.9.2'});
});

test('runtime identity uses complete canonical Node and npm versions',()=>{
  assert.deepEqual(createRuntimeIdentity({nodeVersion:'v22.17.1',npmVersion:'10.9.2'}),{node:'22.17.1',npm:'10.9.2'});
});

test('runtime fingerprint changes for Node and npm patch drift but ignores irrelevant state',()=>{
  const base={lockfile:'same lockfile',dependencies:{devDependencies:{typescript:'5.9.3'}},runtime:createRuntimeIdentity({nodeVersion:expectedNode,npmVersion:expectedNpm})};
  const fingerprint=createEnvironmentFingerprint(base);
  assert.notEqual(createEnvironmentFingerprint({...base,runtime:createRuntimeIdentity({nodeVersion:'22.17.2',npmVersion:expectedNpm})}),fingerprint);
  assert.notEqual(createEnvironmentFingerprint({...base,runtime:createRuntimeIdentity({nodeVersion:expectedNode,npmVersion:'10.9.3'})}),fingerprint);
  const withIrrelevantState={...base,username:'someone',shell:'different',timestamp:'later'};
  assert.equal(createEnvironmentFingerprint(withIrrelevantState),fingerprint);
});
