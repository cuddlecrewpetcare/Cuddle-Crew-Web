import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {dirname,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {expectedGitleaksVersion,findGitleaks} from './gitleaks-tool.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dependencyGroups=['dependencies','devDependencies','optionalDependencies','peerDependencies'];
const expectedRegistry='https://registry.npmjs.org/';
const reviewedLifecyclePackages=new Set(['esbuild','fsevents','sharp','unrs-resolver','workerd']);
const ignoredDirectories=new Set(['.git','node_modules','.next','.vinext','dist','out','coverage','.cache','.wrangler','playwright-report','test-results']);

const readJson=(path)=>JSON.parse(readFileSync(path,'utf8'));
const packageName=(path,metadata)=>metadata.name||path.split('node_modules/').at(-1);
const output=(result)=>(result.stdout||result.stderr||'').trim();
const npmRun=(args)=>process.env.npm_execpath&&existsSync(process.env.npm_execpath)
  ?spawnSync(process.execPath,[process.env.npm_execpath,...args],{cwd:root,encoding:'utf8',windowsHide:true})
  :spawnSync(process.platform==='win32'?'npm.cmd':'npm',args,{cwd:root,encoding:'utf8',windowsHide:true});

function findPackageManagerFiles(directory=root,found=[]){
  for(const entry of readdirSync(directory,{withFileTypes:true})){
    if(entry.isDirectory()&&ignoredDirectories.has(entry.name))continue;
    const path=resolve(directory,entry.name);
    if(entry.isDirectory())findPackageManagerFiles(path,found);
    else if(['package-lock.json','npm-shrinkwrap.json','yarn.lock','pnpm-lock.yaml','bun.lock','bun.lockb'].includes(entry.name))found.push(relative(root,path).split(sep).join('/'));
  }
  return found.sort();
}

export function analyzeLock(manifest,lock,{managerFiles=['package-lock.json']}={}){
  const errors=[],warnings=[];
  const entries=Object.entries(lock.packages||{}).filter(([path])=>path);
  const rootPackage=lock.packages?.['']||{};
  if(lock.lockfileVersion!==3)errors.push(`package-lock.json uses lockfile version ${lock.lockfileVersion??'unknown'}; expected 3`);
  for(const group of dependencyGroups){
    const expected=manifest[group]||{},actual=rootPackage[group]||{};
    for(const [name,range] of Object.entries(expected))if(actual[name]!==range)errors.push(`lockfile root is not synchronized for ${group}:${name}`);
    for(const name of Object.keys(actual))if(!Object.hasOwn(expected,name))errors.push(`lockfile root has unexpected ${group}:${name}`);
  }
  if(managerFiles.length!==1||managerFiles[0]!=='package-lock.json')errors.push(`unexpected package-manager files: ${managerFiles.join(', ')||'package-lock.json missing'}`);
  for(const [path,metadata] of entries){
    const source=String(metadata.resolved||'');
    if(source&&!source.startsWith(expectedRegistry))errors.push(`nonstandard package source for ${path}`);
    if(source&&!metadata.integrity)errors.push(`integrity metadata missing for ${path}`);
    if(metadata.link)warnings.push(`linked package requires review: ${path}`);
  }
  const lifecycle=[...new Set(entries.filter(([,metadata])=>metadata.hasInstallScript).map(([path,metadata])=>packageName(path,metadata)))].sort();
  const unreviewedLifecycle=lifecycle.filter(name=>!reviewedLifecyclePackages.has(name));
  if(unreviewedLifecycle.length)errors.push(`unreviewed lifecycle-script packages: ${unreviewedLifecycle.join(', ')}`);
  const rootLifecycle=Object.keys(manifest.scripts||{}).filter(name=>['preinstall','install','postinstall','prepare','prepublish','postpublish'].includes(name));
  if(rootLifecycle.length)errors.push(`root lifecycle scripts require review: ${rootLifecycle.join(', ')}`);
  return{
    errors,warnings,lifecycle,
    counts:{
      lockfilePackages:entries.length,
      directProduction:Object.keys(manifest.dependencies||{}).length,
      directDevelopment:Object.keys(manifest.devDependencies||{}).length,
      peerDeclaringPackages:entries.filter(([,metadata])=>Object.keys(metadata.peerDependencies||{}).length).length,
      optionalPackages:entries.filter(([,metadata])=>metadata.optional).length,
    },
  };
}

function dependencyTree(){
  const result=npmRun(['ls','--all','--json']);
  let payload={};
  try{payload=JSON.parse(result.stdout||'{}')}catch{return{material:['npm dependency tree output was not valid JSON'],extraneous:[]}}
  const problems=Array.isArray(payload.problems)?payload.problems:[];
  return{
    material:problems.filter(problem=>/\b(missing|invalid)\b/i.test(problem)),
    extraneous:problems.filter(problem=>/\bextraneous\b/i.test(problem)),
  };
}

function repositoryState(){
  const manifest=readJson(resolve(root,'package.json'));
  const lock=readJson(resolve(root,'package-lock.json'));
  const expectedNode=readFileSync(resolve(root,'.nvmrc'),'utf8').trim();
  const expectedNpm=String(manifest.packageManager||'').match(/^npm@(.+)$/)?.[1];
  const analysis=analyzeLock(manifest,lock,{managerFiles:findPackageManagerFiles()});
  const tree=dependencyTree();
  const registryResult=npmRun(['config','get','registry']);
  if(registryResult.status!==0)analysis.errors.push('effective npm registry could not be determined');
  else if(output(registryResult)!==expectedRegistry)analysis.errors.push('effective npm registry is not the reviewed public npm registry; value hidden');
  if(manifest.packageManager!==`npm@${expectedNpm}`||!expectedNpm)analysis.errors.push('packageManager must select npm with an exact version');
  if(process.versions.node!==expectedNode)analysis.errors.push(`Node ${process.versions.node} does not match the .nvmrc pin ${expectedNode}`);
  const actualNpm=output(npmRun(['--version']));
  if(actualNpm!==expectedNpm)analysis.errors.push(`npm ${actualNpm||'unknown'} does not match packageManager ${expectedNpm||'unknown'}`);
  if(tree.material.length)analysis.errors.push(...tree.material.map(problem=>`dependency tree: ${problem.split(root).join('<repo>')}`));
  if(tree.extraneous.length)analysis.warnings.push(`${tree.extraneous.length} extraneous optional/WASM package entries reported by npm ls; see docs/dependency-supply-chain.md`);
  return{manifest,lock,expectedNode,expectedNpm,actualNpm,analysis,tree};
}

function check(){
  const state=repositoryState();
  for(const message of state.analysis.errors)console.error(`FAIL    ${message}`);
  for(const message of state.analysis.warnings)console.log(`WARNING ${message}`);
  console.log(`INFO    npm lockfile v${state.lock.lockfileVersion}; ${state.analysis.counts.lockfilePackages} locked package entries`);
  console.log(`INFO    ${state.analysis.counts.directProduction} direct production and ${state.analysis.counts.directDevelopment} direct development dependencies`);
  console.log(`INFO    reviewed lifecycle packages: ${state.analysis.lifecycle.join(', ')||'none'}`);
  if(state.analysis.errors.length){console.error('Supply-chain check failed. Nothing was modified.');process.exitCode=1}
  else console.log('Supply-chain check passed. Nothing was modified.');
}

function summary(){
  const state=repositoryState(),gitleaks=findGitleaks();
  const playwright=state.lock.packages?.['node_modules/@playwright/test']?.version||'missing';
  console.log('Cuddle Crew dependency/toolchain summary (no credentials)');
  console.log(`Node: ${process.versions.node} (pinned ${state.expectedNode})`);
  console.log(`Package manager: npm ${state.actualNpm} (selected ${state.manifest.packageManager})`);
  console.log(`Lockfile: v${state.lock.lockfileVersion}; ${state.analysis.counts.lockfilePackages} package entries; authoritative`);
  console.log(`Direct dependencies: ${state.analysis.counts.directProduction} production; ${state.analysis.counts.directDevelopment} development`);
  console.log(`Dependency tree: ${state.tree.material.length?'missing/invalid packages reported':'no missing/invalid packages'}; ${state.tree.extraneous.length} extraneous entries reported`);
  console.log(`Peer declarations: ${state.analysis.counts.peerDeclaringPackages} locked packages declare peers`);
  console.log(`Platform-optional packages: ${state.analysis.counts.optionalPackages}`);
  console.log(`Reviewed lifecycle packages: ${state.analysis.lifecycle.join(', ')||'none'}`);
  console.log(`Playwright package: ${playwright}; browser binary is managed in the user-level Playwright cache`);
  console.log(`Gitleaks: ${gitleaks.available?gitleaks.version:'missing'} (expected machine-wide ${expectedGitleaksVersion})`);
  console.log(`Structural supply-chain state: ${state.analysis.errors.length?'review required':'pass'}; run npm run check:supply-chain for details`);
}

function audit({includeDevelopment=false}={}){
  const args=['audit','--json','--loglevel=error'];
  if(!includeDevelopment)args.push('--omit=dev');
  const result=npmRun(args);
  let payload;
  try{payload=JSON.parse(result.stdout||'')}catch{
    console.error(`UNAVAILABLE ${includeDevelopment?'Full':'Production'} dependency audit could not obtain valid registry metadata; no clean result is claimed.`);
    process.exitCode=2;return;
  }
  if(payload.error){
    console.error(`UNAVAILABLE ${includeDevelopment?'Full':'Production'} dependency audit endpoint returned an error; no clean result is claimed.`);
    process.exitCode=2;return;
  }
  const counts=payload.metadata?.vulnerabilities||{};
  const total=Number(counts.total||0);
  const scope=includeDevelopment?'Full':'Production';
  if(total===0){console.log(`PASS ${scope} dependency audit — 0 vulnerabilities reported by the npm registry.`);return}
  const affected=Object.entries(payload.vulnerabilities||{}).map(([name,value])=>`${name} (${value.severity}${value.isDirect?', direct':''})`).sort();
  console.error(`${scope} dependency audit reported ${total} vulnerabilities: low=${counts.low||0}, moderate=${counts.moderate||0}, high=${counts.high||0}, critical=${counts.critical||0}.`);
  for(const item of affected)console.error(`FINDING ${item}`);
  console.error('Review applicability and remediate in a dedicated dependency-maintenance task. No files were modified and no audit fix was run.');
  process.exitCode=1;
}

async function main(){
  const mode=process.argv[2];
  if(mode==='check')check();
  else if(mode==='summary')summary();
  else if(mode==='audit-production')audit();
  else if(mode==='audit-all')audit({includeDevelopment:true});
  else{console.error('Use check, summary, audit-production, or audit-all.');process.exitCode=2}
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
