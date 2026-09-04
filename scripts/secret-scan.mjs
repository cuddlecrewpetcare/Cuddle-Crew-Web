import {copyFileSync,existsSync,mkdirSync,readFileSync,rmSync,statSync} from 'node:fs';
import {dirname,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {expectedGitleaksVersion,findGitleaks} from './gitleaks-tool.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const mode=process.argv[2];
const scanner=findGitleaks();
const stateRoot=resolve(root,'.cache','local-dev');
const runId=`secret-scan-${process.pid}-${Date.now()}`;
const snapshot=resolve(stateRoot,`${runId}-snapshot`);
const report=resolve(stateRoot,`${runId}-report.json`);

const safeField=(value,fallback='unknown')=>String(value??fallback).replace(/[\r\n\t]/g,' ').slice(0,240);
const withinRoot=(path)=>{const rel=relative(root,path);return rel&&!rel.startsWith(`..${sep}`)&&rel!=='..'};

function currentSnapshot(){
  const listed=spawnSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8',windowsHide:true});
  if(listed.status!==0)throw new Error('Git could not enumerate current repository files.');
  mkdirSync(snapshot,{recursive:true});
  for(const name of listed.stdout.split('\0').filter(Boolean)){
    const source=resolve(root,name);
    if(!withinRoot(source)||!existsSync(source)||!statSync(source).isFile())continue;
    const destination=resolve(snapshot,name);
    if(!relative(snapshot,destination)||relative(snapshot,destination).startsWith(`..${sep}`))throw new Error('Unsafe snapshot path encountered.');
    mkdirSync(dirname(destination),{recursive:true});
    copyFileSync(source,destination);
  }
}

function sanitizedPath(value){
  const raw=resolve(String(value||'unknown'));
  if(mode==='current'&&raw.startsWith(snapshot))return safeField(relative(snapshot,raw).replaceAll('\\','/'));
  return safeField(String(value||'unknown').replaceAll('\\','/'));
}

function printFindings(findings){
  console.error(`Secret scan found ${findings.length} potential credential${findings.length===1?'':'s'}. Values are fully redacted.`);
  for(const [index,finding] of findings.entries()){
    const parts=[`FINDING ${index+1}`,`rule=${safeField(finding.RuleID)}`,`file=${sanitizedPath(finding.File)}`];
    if(Number.isInteger(finding.StartLine)&&finding.StartLine>0)parts.push(`line=${finding.StartLine}`);
    if(finding.Commit)parts.push(`commit=${safeField(finding.Commit).slice(0,12)}`);
    console.error(parts.join(' '));
  }
  console.error('Treat plausible exposed credentials as compromised: revoke, rotate, remove the tracked value, assess history, and rescan.');
}

if(!['current','history'].includes(mode)){
  console.error('Use current or history.');
  process.exitCode=2;
}else if(!scanner.available||!scanner.compatible){
  console.error(`Gitleaks ${expectedGitleaksVersion} is required. Run npm run doctor and follow docs/local-development.md.`);
  process.exitCode=2;
}else{
  try{
    mkdirSync(stateRoot,{recursive:true});
    if(mode==='current')currentSnapshot();
    const targetArgs=mode==='current'?['dir',snapshot]:['git','--log-opts=--all',root];
    const result=spawnSync(scanner.command,[...targetArgs,'--config',resolve(root,'.gitleaks.toml'),'--no-banner','--no-color','--redact=100','--log-level=error','--report-format=json','--report-path',report,'--max-target-megabytes=20','--timeout=180'],{cwd:root,encoding:'utf8',windowsHide:true});
    let findings=[];
    if(existsSync(report)){
      try{const parsed=JSON.parse(readFileSync(report,'utf8'));if(Array.isArray(parsed))findings=parsed}catch{}
    }
    if(findings.length){printFindings(findings);process.exitCode=1}
    else if(result.status!==0){console.error(`Gitleaks ${mode} scan could not complete safely (exit ${result.status??'unknown'}). No scanner output was echoed.`);process.exitCode=2}
    else console.log(`PASS ${mode==='current'?'Current repository':'Git history'} secret scan — 0 findings; secret values were not emitted.`);
  }catch(error){console.error(`Secret scan failed safely: ${safeField(error instanceof Error?error.message:error)}`);process.exitCode=2}
  finally{
    if(existsSync(snapshot))rmSync(snapshot,{recursive:true,force:true});
    if(existsSync(report))rmSync(report,{force:true});
  }
}
