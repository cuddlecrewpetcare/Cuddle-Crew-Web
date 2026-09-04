import {spawn,spawnSync} from 'node:child_process';
import {createServer} from 'node:net';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import process from 'node:process';

const repoRoot=fileURLToPath(new URL('../',import.meta.url));
const target='http://127.0.0.1:3100';
const vinextCli=path.join(repoRoot,'node_modules','vinext','dist','cli.js');
const playwrightCli=path.join(repoRoot,'node_modules','@playwright','test','cli.js');
let server;

const assertPortAvailable=()=>new Promise((resolve,reject)=>{
  const probe=createServer();
  probe.unref();
  probe.once('error',error=>reject(new Error(`E2E port 3100 is unavailable (${error.code||error.message}); inspect it with npm run doctor.`)));
  probe.listen(3100,'0.0.0.0',()=>probe.close(resolve));
});

const waitForServer=async()=>{
  const deadline=Date.now()+60_000;
  while(Date.now()<deadline){
    if(server.exitCode!==null)throw new Error(`E2E server exited early with code ${server.exitCode}.`);
    try{const response=await fetch(target);if(response.ok)return}catch{}
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  throw new Error(`Timed out waiting for ${target}.`);
};

const stopServer=()=>{
  if(!server||server.exitCode!==null)return;
  if(process.platform==='win32')spawnSync('taskkill',['/pid',String(server.pid),'/T','/F'],{stdio:'ignore'});
  else server.kill('SIGTERM');
};

try{
  await assertPortAvailable();
  server=spawn(process.execPath,[vinextCli,'start','--port=3100'],{cwd:repoRoot,stdio:'inherit',windowsHide:true});
  server.unref();
  await waitForServer();
  const test=spawn(process.execPath,[playwrightCli,'test'],{cwd:repoRoot,stdio:'inherit',windowsHide:true});
  const exitCode=await new Promise((resolve,reject)=>{test.once('error',reject);test.once('exit',code=>resolve(code??1))});
  process.exitCode=exitCode;
}catch(error){
  console.error(error instanceof Error?error.message:error);
  process.exitCode=1;
}finally{
  stopServer();
}
