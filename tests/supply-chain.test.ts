import assert from 'node:assert/strict';
import test from 'node:test';
import {analyzeLock} from '../scripts/supply-chain.mjs';

const manifest={
  scripts:{test:'node --test'},
  dependencies:{react:'19.2.6'},
  devDependencies:{vite:'8.0.13'},
};

const lock={
  lockfileVersion:3,
  packages:{
    '':{dependencies:{react:'19.2.6'},devDependencies:{vite:'8.0.13'}},
    'node_modules/react':{version:'19.2.6',resolved:'https://registry.npmjs.org/react/-/react-19.2.6.tgz',integrity:'sha512-safe'},
    'node_modules/vite':{version:'8.0.13',resolved:'https://registry.npmjs.org/vite/-/vite-8.0.13.tgz',integrity:'sha512-safe'},
  },
};

test('supply-chain analysis accepts a synchronized npm lockfile with registry integrity',()=>{
  const result=analyzeLock(manifest,lock);
  assert.deepEqual(result.errors,[]);
  assert.equal(result.counts.directProduction,1);
  assert.equal(result.counts.directDevelopment,1);
});

test('supply-chain analysis rejects manifest drift, alternate lockfiles, and untrusted sources',()=>{
  const changed=structuredClone(lock);
  changed.packages[''].dependencies.react='19.2.5';
  changed.packages['node_modules/react'].resolved='git+https://example.invalid/react.git';
  const result=analyzeLock(manifest,changed,{managerFiles:['package-lock.json','yarn.lock']});
  assert.ok(result.errors.some(value=>value.includes('not synchronized')));
  assert.ok(result.errors.some(value=>value.includes('unexpected package-manager files')));
  assert.ok(result.errors.some(value=>value.includes('nonstandard package source')));
});

test('supply-chain analysis requires review for new lifecycle execution',()=>{
  const changed=structuredClone(lock);
  (changed.packages as Record<string,Record<string,unknown>>)['node_modules/unreviewed-tool']={version:'1.0.0',resolved:'https://registry.npmjs.org/unreviewed-tool/-/unreviewed-tool-1.0.0.tgz',integrity:'sha512-safe',hasInstallScript:true};
  const result=analyzeLock(manifest,changed);
  assert.ok(result.errors.some(value=>value.includes('unreviewed lifecycle-script packages')));
});
