import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

export const expectedGitleaksVersion='8.30.0';

const sharedWindowsPath=resolve(`${process.env.SystemDrive||'C:'}\\`,'Tools','gitleaks','gitleaks.exe');

export function findGitleaks(){
  const candidates=[process.env.GITLEAKS_PATH,process.platform==='win32'?sharedWindowsPath:undefined,'gitleaks'].filter(Boolean);
  for(const candidate of [...new Set(candidates)]){
    if(candidate!== 'gitleaks'&&!existsSync(candidate))continue;
    const result=spawnSync(candidate,['version'],{encoding:'utf8',windowsHide:true});
    if(result.status!==0)continue;
    const version=String(result.stdout||result.stderr||'').match(/\d+\.\d+\.\d+/)?.[0]||'unknown';
    return{available:true,compatible:version===expectedGitleaksVersion,version,command:candidate};
  }
  return{available:false,compatible:false,version:'unavailable',command:null};
}
