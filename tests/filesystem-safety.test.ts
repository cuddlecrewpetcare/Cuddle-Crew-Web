import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,posix,win32} from 'node:path';
import test from 'node:test';
import {analyzeTrackedNames,assertSafeGeneratedTarget,isPathInside,relativeImportCandidates} from '../scripts/filesystem-safety.mjs';

test('path containment is separator-aware on POSIX and Windows paths',()=>{
  assert.equal(isPathInside('/repo','/repo/dist',posix),true);
  assert.equal(isPathInside('/repo','/repo-other/dist',posix),false);
  assert.equal(isPathInside('/repo','/repo',posix),false);
  assert.equal(isPathInside('C:\\repo','C:\\repo\\dist',win32),true);
  assert.equal(isPathInside('C:\\repo','C:\\repo-other\\dist',win32),false);
  assert.equal(isPathInside('C:\\repo','D:\\repo\\dist',win32),false);
});

test('generated cleanup accepts only allowlisted descendants',()=>{
  const root=mkdtempSync(join(tmpdir(),'cuddle-crew-path-test-'));
  try{
    mkdirSync(join(root,'dist'));
    assert.equal(assertSafeGeneratedTarget(root,join(root,'dist'),['dist']),'dist');
    assert.throws(()=>assertSafeGeneratedTarget(root,join(root,'source'),['dist']),/not an approved/);
    assert.throws(()=>assertSafeGeneratedTarget(root,join(root,'..','outside'),['../outside']),/outside/);
  }finally{rmSync(root,{recursive:true,force:true})}
});

test('generated cleanup refuses symbolic links and Windows junctions',()=>{
  const root=mkdtempSync(join(tmpdir(),'cuddle-crew-link-test-'));
  const target=mkdtempSync(join(tmpdir(),'cuddle-crew-link-target-'));
  try{
    symlinkSync(target,join(root,'dist'),process.platform==='win32'?'junction':'dir');
    assert.throws(()=>assertSafeGeneratedTarget(root,join(root,'dist'),['dist']),/linked generated target/);
  }finally{
    rmSync(join(root,'dist'),{force:true});
    rmSync(root,{recursive:true,force:true});
    rmSync(target,{recursive:true,force:true});
  }
});

test('tracked-name analysis catches case collisions and Windows-invalid names',()=>{
  const result=analyzeTrackedNames(['app/Widget.tsx','app/widget.tsx','docs/CON.txt','bad/name.']);
  assert.equal(result.errors.some(value=>value.includes('case-conflicting')),true);
  assert.equal(result.errors.some(value=>value.includes('Windows-reserved')),true);
  assert.equal(result.errors.some(value=>value.includes('Windows-invalid')),true);
});

test('relative import candidates remain repository-style POSIX paths',()=>{
  assert.deepEqual(relativeImportCandidates('scripts/check.mjs','./helpers.mjs'),['scripts/helpers.mjs']);
  assert.equal(relativeImportCandidates('app/page.tsx','./Widget').includes('app/Widget.tsx'),true);
});
