import {readFileSync} from 'node:fs';
import {dirname,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {analyzeTrackedNames,generatedCleanupTargets,relativeImportCandidates} from './filesystem-safety.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const git=args=>spawnSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true});
const listed=git(['ls-files','--cached','--others','--exclude-standard','-z']);
if(listed.status!==0)throw new Error('Git could not enumerate tracked files.');
const tracked=listed.stdout.split('\0').filter(Boolean).sort();
const names=analyzeTrackedNames(tracked);
const errors=[...names.errors],warnings=[...names.warnings];
const textExtensions=new Set(['','.css','.env','.geojson','.html','.js','.jsx','.json','.md','.mjs','.cjs','.ps1','.py','.sh','.svg','.toml','.ts','.tsx','.txt','.webmanifest','.yaml','.yml']);
const textNames=new Set(['.env.example','.gitattributes','.gitignore','.nvmrc']);
const sourceExtensions=new Set(['.js','.jsx','.mjs','.cjs','.ts','.tsx']);
const mediaExtensions='(?:png|jpe?g|gif|webp|svg|ico|woff2?|ttf|otf|pdf|webmanifest|geojson)';
const localPathPattern=/(?:[a-z]:[\\/](?:users|documents and settings)[\\/][^\\/\r\n]+|\/(?:users|home)\/[^/\s]+\/)/i;
const clientPathPattern=/(?:^|[^a-z])[a-z]:[\\/]|\/(?:users|home)\/|file:\/\//i;

const extension=name=>{const leaf=name.split('/').at(-1);const index=leaf.lastIndexOf('.');return index>0?leaf.slice(index).toLowerCase():''};
const exactOrCaseMismatch=(candidates,label)=>{
  if(candidates.some(candidate=>names.exact.has(candidate)))return;
  const mismatch=candidates.map(candidate=>names.byCase.get(candidate.toLocaleLowerCase('en-US'))).find(Boolean);
  if(mismatch)errors.push(`${label} differs in case from tracked path ${mismatch}`);
  else errors.push(`${label} does not resolve to a tracked file`);
};
const rootImportCandidates=specifier=>{
  if(/\.[a-z0-9]+$/i.test(specifier))return[specifier];
  return[specifier,`${specifier}.ts`,`${specifier}.tsx`,`${specifier}.js`,`${specifier}.jsx`,`${specifier}.mjs`,`${specifier}.cjs`,`${specifier}.json`,`${specifier}/index.ts`,`${specifier}/index.tsx`,`${specifier}/index.js`,`${specifier}/index.mjs`];
};

for(const name of tracked){
  const ext=extension(name);
  if(!textNames.has(name)&&!textExtensions.has(ext))continue;
  const bytes=readFileSync(resolve(root,name));
  if(bytes[0]===0xef&&bytes[1]===0xbb&&bytes[2]===0xbf)errors.push(`UTF-8 BOM is not expected in ${name}`);
  let source;
  try{source=new TextDecoder('utf-8',{fatal:true}).decode(bytes)}catch{errors.push(`tracked text is not valid UTF-8: ${name}`);continue}
  if(localPathPattern.test(source))errors.push(`machine-specific user path appears in tracked text: ${name}`);
  if((name.startsWith('app/')||name==='proxy.ts')&&clientPathPattern.test(source))errors.push(`application source contains a local filesystem path: ${name}`);
  if(source.startsWith('#!')&&!source.slice(0,source.indexOf('\n')+1).endsWith('\n'))errors.push(`shebang line is not LF-terminated: ${name}`);

  if(sourceExtensions.has(ext)){
    const imports=[...source.matchAll(/(?:from\s*|import\s*\()(['"])([^'"]+)\1/g)].map(match=>match[2]);
    for(const specifier of imports){
      if(specifier.startsWith('.'))exactOrCaseMismatch(relativeImportCandidates(name,specifier),`${name}: import ${specifier}`);
      else if(specifier.startsWith('@/'))exactOrCaseMismatch(rootImportCandidates(specifier.slice(2)),`${name}: import ${specifier}`);
    }
  }

  if(name.startsWith('app/')||name==='proxy.ts'){
    for(const match of source.matchAll(new RegExp(`['"](/[^'"?#]+\\.${mediaExtensions})(?:[?#][^'"]*)?['"]`,'gi'))){
      const asset=`public${decodeURIComponent(match[1])}`;
      exactOrCaseMismatch([asset],`${name}: public asset ${match[1]}`);
    }
  }

  if(ext==='.md'){
    for(const match of source.matchAll(/\[[^\]]*\]\((?![a-z]+:|#)([^)#]+\.md)(?:#[^)]+)?\)/gi)){
      const target=match[1].replaceAll('\\','/');
      const resolved=relative(root,resolve(root,dirname(name),target)).replaceAll('\\','/');
      exactOrCaseMismatch([resolved],`${name}: documentation link ${target}`);
    }
  }
}

const eol=git(['ls-files','--eol']);
if(eol.status!==0)errors.push('Git could not inspect tracked line endings.');
else for(const line of eol.stdout.split(/\r?\n/))if(/^i\/(?:crlf|mixed)\s/.test(line))errors.push(`Git index contains non-LF text: ${line.split('\t').at(-1)}`);

const modes=git(['ls-files','--stage']);
if(modes.status!==0)errors.push('Git could not inspect tracked file modes.');
else if(modes.stdout.split(/\r?\n/).some(line=>line.startsWith('120000 ')))errors.push('tracked symbolic links require explicit cross-platform review');

const manifest=JSON.parse(readFileSync(resolve(root,'package.json'),'utf8'));
for(const [name,command] of Object.entries(manifest.scripts||{})){
  if(/(^|\s)(?:bash|sh\s+-c|rm\s+-r|cp\s|mv\s|chmod\s|sed\s|grep\s|mkdir\s+-p)(\s|$)|(^|&&|\|\|)\s*[A-Za-z_][A-Za-z0-9_]*=/.test(command))errors.push(`npm script ${name} contains shell-specific syntax`);
}

for(const target of generatedCleanupTargets){
  const ignored=git(['check-ignore','-q','--',`${target}/cross-platform-probe`]);
  if(ignored.status!==0)errors.push(`generated cleanup target is not ignored: ${target}`);
}

const attributes=readFileSync(resolve(root,'.gitattributes'),'utf8');
for(const rule of ['*.sh text eol=lf','*.ps1 text eol=crlf','*.cmd text eol=crlf','*.bat text eol=crlf','*.py text eol=lf'])if(!attributes.includes(rule))errors.push(`missing line-ending rule: ${rule}`);

const longest=[...tracked].sort((a,b)=>b.length-a.length)[0]||'';
if(longest.length>=240)warnings.push(`longest repository-relative path is ${longest.length} characters: ${longest}`);

for(const warning of warnings)console.log(`WARNING ${warning}`);
if(errors.length){for(const error of errors)console.error(`FAIL    ${error}`);console.error(`Cross-platform safety check failed with ${errors.length} finding(s). Nothing was modified.`);process.exitCode=1}
else{
  console.log(`PASS    Filenames — ${tracked.length} tracked paths have no case collision or Windows-invalid name`);
  console.log(`PASS    Encoding — ${tracked.filter(name=>textNames.has(name)||textExtensions.has(extension(name))).length} tracked text files are UTF-8 without BOM`);
  console.log('PASS    Paths — imports, public assets, documentation links, and client sources have no checked path mismatch or local-path leak');
  console.log('PASS    Scripts — npm commands avoid known Bash-only file operations and environment assignment');
  console.log(`PASS    Path depth — longest repository-relative path is ${longest.length} characters`);
  console.log('PASS    Generated state — cleanup targets are repository-contained, allowlisted, ignored, and link-refusing');
  console.log('Cross-platform safety check passed. Nothing was modified.');
}
