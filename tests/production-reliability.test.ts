import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {resolve} from 'node:path';
import {GET as healthCheck} from '../app/api/health/route.ts';

test('health endpoint returns only safe operational fields',async()=>{
  const response=healthCheck();
  const payload=await response.json() as Record<string,unknown>;

  assert.equal(response.status,200);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.deepEqual(Object.keys(payload).sort(),['status','timestamp']);
  assert.equal(payload.status,'ok');
  assert.equal(typeof payload.timestamp,'string');
  assert.equal(Number.isNaN(Date.parse(payload.timestamp as string)),false);
});

test('mobile navigation remains visible until JavaScript enhances it',()=>{
  const header=readFileSync(resolve('app/SiteHeader.tsx'),'utf8');
  const styles=readFileSync(resolve('app/globals.css'),'utf8');

  assert.match(header,/const navRef=useRef<HTMLElement>\(null\)/);
  assert.match(header,/navRef\.current\?\.classList\.add\('is-enhanced'\)/);
  assert.match(header,/<nav ref=\{navRef\} className="nav shell"/);
  assert.match(styles,/\.sticky-header \.nav-links\{display:flex;position:static/);
  assert.match(styles,/\.nav\.is-enhanced \.nav-links\{display:none;position:absolute/);
  assert.match(styles,/\.nav\.is-enhanced \.nav-links\.is-open\{display:flex\}/);
});
