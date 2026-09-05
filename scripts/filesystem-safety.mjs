import {existsSync,lstatSync} from 'node:fs';
import path,{dirname,relative,resolve,sep} from 'node:path';

export const generatedCleanupTargets=[
  '.next',
  '.vinext',
  'dist',
  'out',
  'coverage',
  'playwright-report',
  'test-results',
  '.cache/local-dev/playwright',
  '.cache/local-dev/logs',
];

export function isPathInside(root,target,pathApi=path){
  const rel=pathApi.relative(pathApi.resolve(root),pathApi.resolve(target));
  return Boolean(rel)&&rel!=='..'&&!rel.startsWith(`..${pathApi.sep}`)&&!pathApi.isAbsolute(rel);
}

export function repositoryPath(root,target){
  if(!isPathInside(root,target))throw new Error('Path is outside the repository root.');
  return relative(resolve(root),resolve(target)).split(sep).join('/');
}

export function assertSafeGeneratedTarget(root,target,allowed=generatedCleanupTargets){
  const rootPath=resolve(root),targetPath=resolve(target);
  const rel=repositoryPath(rootPath,targetPath);
  if(!allowed.includes(rel))throw new Error(`Path is not an approved generated target: ${rel}`);

  for(let cursor=targetPath;cursor!==rootPath;cursor=dirname(cursor)){
    if(!isPathInside(rootPath,cursor))throw new Error('Generated target ancestry escaped the repository root.');
    if(existsSync(cursor)&&lstatSync(cursor).isSymbolicLink())throw new Error(`Refusing linked generated target: ${rel}`);
  }
  return rel;
}

const windowsReserved=/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i;
const windowsInvalid=/[<>:"\\|?*]/;

export function analyzeTrackedNames(names){
  const errors=[],warnings=[];
  const exact=new Set(names),byCase=new Map();
  for(const name of [...names].sort()){
    const folded=name.toLocaleLowerCase('en-US');
    const prior=byCase.get(folded);
    if(prior&&prior!==name)errors.push(`case-conflicting tracked paths: ${prior} and ${name}`);
    else byCase.set(folded,name);
    for(const segment of name.split('/')){
      if(!segment||segment==='.'||segment==='..')errors.push(`unsafe path segment in ${name}`);
      if(windowsReserved.test(segment))errors.push(`Windows-reserved filename in ${name}`);
      if(windowsInvalid.test(segment)||/[ .]$/.test(segment)||/[\u0000-\u001f]/.test(segment))errors.push(`Windows-invalid filename in ${name}`);
    }
    if(/[^\x20-\x7e]/.test(name))warnings.push(`non-ASCII tracked filename requires intentional review: ${name}`);
  }
  return{errors,warnings,exact,byCase};
}

export function relativeImportCandidates(importer,specifier){
  const base=path.posix.normalize(path.posix.join(path.posix.dirname(importer),specifier));
  if(path.posix.extname(base))return[base];
  return[base,`${base}.ts`,`${base}.tsx`,`${base}.js`,`${base}.jsx`,`${base}.mjs`,`${base}.cjs`,`${base}.json`,`${base}/index.ts`,`${base}/index.tsx`,`${base}/index.js`,`${base}/index.mjs`];
}
